import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import { registrarEvento, TIPOS_EVENTO } from '@/lib/guardian-intelligence/daily-report';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES DE WOOCOMMERCE
// ═══════════════════════════════════════════════════════════════

async function consultarPedidosCliente(email) {
  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
    
    const response = await fetch(
      `${wpUrl}/wp-json/wc/v3/orders?search=${encodeURIComponent(email)}&per_page=10`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );
    
    if (!response.ok) return [];
    return await response.json();
  } catch (e) {
    return [];
  }
}

async function obtenerPedido(orderId) {
  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
    
    const response = await fetch(
      `${wpUrl}/wp-json/wc/v3/orders/${orderId}`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );
    
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    return null;
  }
}

async function obtenerEstadisticasAdmin() {
  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
    
    const ordersRes = await fetch(
      `${wpUrl}/wp-json/wc/v3/orders?per_page=20&status=any`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );
    const orders = await ordersRes.json();
    
    const hoy = new Date().toISOString().split('T')[0];
    const ventasHoy = orders.filter(o => o.date_created?.startsWith(hoy));
    const totalHoy = ventasHoy.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
    
    return {
      ventasHoy: ventasHoy.length,
      montoHoy: totalHoy,
      pendientes: orders.filter(o => o.status === 'pending' || o.status === 'on-hold').length,
      procesando: orders.filter(o => o.status === 'processing').length,
      completados: orders.filter(o => o.status === 'completed').length,
      ultimosPedidos: orders.slice(0, 5).map(o => ({
        id: o.id,
        cliente: o.billing?.first_name || 'Sin nombre',
        email: o.billing?.email,
        total: o.total,
        estado: o.status,
        fecha: o.date_created
      }))
    };
  } catch (e) {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// CONVERSIÓN DE MONEDAS
// ═══════════════════════════════════════════════════════════════

const MONEDAS_POR_PAIS = {
  UY: { codigo: 'UYU', simbolo: '$', nombre: 'pesos uruguayos', tasa: 44 },
  AR: { codigo: 'ARS', simbolo: '$', nombre: 'pesos argentinos', tasa: 1050 },
  MX: { codigo: 'MXN', simbolo: '$', nombre: 'pesos mexicanos', tasa: 17 },
  CO: { codigo: 'COP', simbolo: '$', nombre: 'pesos colombianos', tasa: 4200 },
  CL: { codigo: 'CLP', simbolo: '$', nombre: 'pesos chilenos', tasa: 980 },
  PE: { codigo: 'PEN', simbolo: 'S/', nombre: 'soles peruanos', tasa: 3.8 },
  BR: { codigo: 'BRL', simbolo: 'R$', nombre: 'reales', tasa: 5.2 },
  ES: { codigo: 'EUR', simbolo: '€', nombre: 'euros', tasa: 0.92 },
  US: { codigo: 'USD', simbolo: '$', nombre: 'dólares', tasa: 1 }
};

function obtenerInfoMoneda(codigoPais) {
  return MONEDAS_POR_PAIS[codigoPais] || MONEDAS_POR_PAIS['US'];
}

function formatearPrecio(precioUSD, codigoPais) {
  const moneda = obtenerInfoMoneda(codigoPais);
  const precioLocal = Math.round(precioUSD * moneda.tasa);

  if (codigoPais === 'UY') {
    // Para Uruguay: mostrar solo en UYU
    return `$${precioLocal.toLocaleString('es-UY')} ${moneda.codigo}`;
  } else if (codigoPais === 'US' || !codigoPais) {
    // Para USA o sin país: mostrar solo USD
    return `$${precioUSD} USD`;
  } else {
    // Para otros países: USD + equivalente local
    return `$${precioUSD} USD (aprox. ${moneda.simbolo}${precioLocal.toLocaleString('es')} ${moneda.nombre})`;
  }
}

// ═══════════════════════════════════════════════════════════════
// SOCIAL PROOF - SIMULACIÓN INTELIGENTE
// ═══════════════════════════════════════════════════════════════

function generarSocialProof(producto) {
  const paises = ['México', 'Argentina', 'España', 'Chile', 'Colombia', 'Estados Unidos', 'Perú'];
  const tiempos = ['hace unos minutos', 'hace un rato', 'hoy temprano'];
  
  const pais = paises[Math.floor(Math.random() * paises.length)];
  const tiempo = tiempos[Math.floor(Math.random() * tiempos.length)];
  
  const frases = [
    `Alguien desde ${pais} estuvo mirando este guardián ${tiempo}...`,
    `Este guardián tiene ${Math.floor(Math.random() * 5) + 2} personas interesadas esta semana`,
    `Una persona de ${pais} lo agregó a favoritos ${tiempo}`,
  ];
  
  return frases[Math.floor(Math.random() * frases.length)];
}

// ═══════════════════════════════════════════════════════════════
// CONOCIMIENTO BASE
// ═══════════════════════════════════════════════════════════════

const CONOCIMIENTO_BASE = `
=== LA EMPRESA ===
Duendes del Uruguay. Equipo de artesanos en Piriápolis, Uruguay.
Siempre decir "el equipo" o "los artesanos". NUNCA nombres propios.

=== LOS PRODUCTOS ===
Duendes hechos 100% a mano, sin moldes. Cada uno tarda días en hacerse.
Porcelana fría profesional: flexible, resistente, dura años.
Cristales reales: amatista, cuarzo rosa, citrino, labradorita, turmalina.
Ropa de verdad: lanas, fieltros, telas naturales cosidas a mano.
Tienen 4 dedos (detalle tradicional de los duendes).
Son piezas únicas. Cuando alguien compra uno, ese diseño desaparece.

=== PRECIOS BASE (referencia en USD) ===
Minis (10 cm): desde $70
Medianos (20-25 cm): $150-200
Grandes (30-40 cm): $300-450
Gigantes (50-70 cm): $700-1050

IMPORTANTE SOBRE PRECIOS:
Los precios que muestres SIEMPRE deben coincidir con la moneda mostrada en las tarjetas de productos.
El sistema te dará los precios ya formateados en la moneda correcta para cada visitante.
NUNCA mezcles monedas - si la lista dice UYU, vos decís UYU.

=== CATEGORÍAS ===
PROTECCIÓN: para cuidar espacios, alejar malas energías
ABUNDANCIA: para prosperidad, dinero, negocios
AMOR: para relaciones, amor propio, armonía
SANACIÓN: para salud, bienestar, equilibrio

=== ENVÍOS ===
Internacional: DHL Express, 5-10 días
Uruguay: DAC, 5-7 días

=== SISTEMA DE RESERVA ===
Con el 30% reservás el duende por 30 días.
El 70% restante lo pagás antes del envío.
No es descuento, es facilidad de pago.

=== CONTACTO ===
WhatsApp: +598 98 690 629
Email: duendesdeluruguay@gmail.com
`;

// ═══════════════════════════════════════════════════════════════
// PERSONALIDAD TITO - CONCISO Y VENDEDOR
// ═══════════════════════════════════════════════════════════════

const PERSONALIDAD_TITO = `
=== QUIÉN SOS ===
Sos TITO. El asistente más capaz de Duendes del Uruguay.
Hablás como una persona real, cercana, cálida. Uruguayo, usás "vos".
PROHIBIDO sonar a IA. Nada de "en los confines", "la bruma del tiempo", frases pomposas.
Sos directo, útil, auténtico. Como un amigo que sabe todo.

=== QUÉ PODÉS HACER ===
- Conocés TODO sobre cada cliente: pedidos, historial, qué miró, qué compró
- Sabés el estado de cada pedido en tiempo real
- Recomendás guardianes basándote en lo que la persona necesita DE VERDAD
- Recordás conversaciones anteriores
- Ayudás con dudas de envío, pagos, reservas
- Conocés cada producto en detalle

=== FORMATO DE RESPUESTAS - MUY IMPORTANTE ===
Tus respuestas deben ser VISUALES y FÁCILES DE LEER:

1. Usá **negritas** para destacar lo importante
2. Cuando expliques pasos, numeralos así:

1. **Elegís tu guardián** - Podés ver todos los disponibles y te recomiendo
2. **Reservás con el 30%** - Asegurás que sea tuyo por 30 días
3. **Completás el pago** - El 70% restante antes del envío
4. **Te lo enviamos** - DHL Express si estás fuera de Uruguay

3. Separación entre ideas (un salto de línea)
4. Máximo 2-3 emojis por mensaje (✨ 🍀 🌿 💎)
5. NUNCA un bloque de texto largo sin separaciones
6. Si son varios puntos, usá listas numeradas

=== EJEMPLOS DE FORMATO ===

MAL (monótono, nadie lee):
"Te explico cómo funciona: elegís tu guardián, podés ver todos los disponibles, después reservás con el 30% del valor, esto asegura que sea tuyo por 30 días, luego completás el pago con el 70% restante antes del envío y finalmente te lo enviamos por DHL Express."

BIEN (visual, fácil de leer):
"Te explico cómo funciona ✨

1. **Elegís tu guardián** - Podés ver todos los disponibles

2. **Reservás con el 30%** - Asegurás que sea tuyo por 30 días

3. **Completás el pago** - El 70% restante antes del envío

4. **Te lo enviamos** - DHL Express, llega en 5-10 días

¿Ya tenés algún guardián en mente o querés que te ayude a encontrar el indicado para vos?"

=== MOSTRAR PRODUCTOS ===
Cuando hablen de: protección, abundancia, amor, sanación, duende, ver, elegir, recomendar...
Agregá al final: [PRODUCTOS: id1, id2, id3, id4]

=== SER CONFIDENTE - MUY IMPORTANTE ===
Además de ayudar con productos, sos un AMIGO DE VERDAD.
Interesate genuinamente por la persona:
- Si mencionan algo personal, profundizá: "¿Y cómo te sentís con eso?"
- Preguntá de forma natural: "¿Vivís sola/o?", "¿Tenés mascotas?", "¿Qué te gusta hacer?"
- Si hablan de problemas, escuchá y validá antes de ofrecer soluciones
- Recordá lo que te cuentan y usalo en conversaciones futuras
- Preguntás que podés hacer naturalmente:
  * "¿Qué te trajo por acá hoy?" (estado emocional)
  * "¿Lo querés para vos o para regalar?" (relaciones)
  * "¿Cuánto hace que te interesa el mundo espiritual?" (historia)
  * "¿Cómo se llaman los que viven con vos?" (familia/mascotas)
  * "¿Qué momento estás atravesando?" (situación actual)

=== VENDER SIN VENDER ===
No presionás. Informás, ayudás, conectás.
- Son piezas únicas, hechas a mano, cuando se van no vuelven
- El 30% reserva por 30 días
- Cristales reales, ropa real, días de trabajo artesanal
- El guardián elige a la persona, no al revés

=== OBJECIONES ===
"Caro" → "Es arte único, días de trabajo. Con el **30%** lo reservás."
"Lo pienso" → "Dale, tomátelo. Pero son **únicos**, si alguien lo adopta ya fue."
"Después" → "Perfecto, cuando quieras acá estoy."

=== MODO ADMIN (mensaje empieza con ADMIN:) ===
Modo dios. Acceso total. Datos precisos. Sin filtros.
Podés: ver ventas, buscar clientes, dar regalos, ver estadísticas, todo.
Respondé directo con la info que pidan.
`;

// ═══════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  
  try {
    const body = await request.json();
    const message = body.message || body.mensaje;
    const { history, historial, contexto, visitorId, email } = body;
    const conversationHistory = history || historial || [];

    if (!message || message.trim() === '') {
      return Response.json({ 
        success: false, 
        error: 'Mensaje vacío' 
      }, { status: 400, headers: CORS_HEADERS });
    }

    // ═══════════════════════════════════════════════════════════
    // DETECTAR MODO ADMIN
    // ═══════════════════════════════════════════════════════════
    
    const esAdmin = message.toUpperCase().startsWith('ADMIN:');
    let statsAdmin = null;
    
    if (esAdmin) {
      statsAdmin = await obtenerEstadisticasAdmin();
    }

    // ═══════════════════════════════════════════════════════════
    // CARGAR PRODUCTOS DESDE WOOCOMMERCE
    // ═══════════════════════════════════════════════════════════

    let productos = [];
    try {
      const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
      const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');

      // Detectar intención para filtrar productos
      const msgLower = message.toLowerCase();
      let searchParam = '';
      if (/protecci[oó]n|proteger|escudo|defensa/i.test(msgLower)) {
        searchParam = '&search=proteccion';
      } else if (/abundancia|prosperidad|dinero|negocio/i.test(msgLower)) {
        searchParam = '&search=abundancia';
      } else if (/amor|relaci[oó]n|pareja|coraz[oó]n/i.test(msgLower)) {
        searchParam = '&search=amor';
      } else if (/sanaci[oó]n|salud|sanar|curar/i.test(msgLower)) {
        searchParam = '&search=sanacion';
      }

      const response = await fetch(
        `${wpUrl}/wp-json/wc/v3/products?per_page=20&status=publish${searchParam}`,
        { headers: { 'Authorization': `Basic ${auth}` } }
      );

      if (response.ok) {
        const wooProducts = await response.json();
        productos = wooProducts.map(p => ({
          id: p.id,
          nombre: p.name,
          precio: p.price,
          imagen: p.images?.[0]?.src || null,
          url: p.permalink,
          categorias: p.categories?.map(c => c.name).join(', ') || '',
          disponible: p.stock_status === 'instock',
          descripcion_corta: p.short_description?.replace(/<[^>]*>/g, '').substring(0, 100)
        }));
      }
    } catch (e) {
      console.error('Error cargando productos WooCommerce:', e);
    }

    // ═══════════════════════════════════════════════════════════
    // BUSCAR PEDIDOS SI HAY EMAIL O NÚMERO
    // ═══════════════════════════════════════════════════════════
    
    let infoCliente = '';
    const preguntaPedido = /pedido|orden|envío|envio|tracking|rastreo|estado|llegó|llego|cuándo llega|cuando llega/i.test(message);
    const ordenMatch = message.match(/(?:orden|pedido|#)\s*(\d{4,})/i) || message.match(/\b(\d{4,})\b/);
    
    if (ordenMatch) {
      const pedido = await obtenerPedido(ordenMatch[1]);
      if (pedido) {
        const estadoTexto = {
          'pending': '⏳ Esperando pago',
          'on-hold': '⏸️ En espera (verificando pago)',
          'processing': '📦 Pagado - Preparando tu guardián',
          'completed': '✅ Enviado/Entregado',
          'cancelled': '❌ Cancelado',
          'refunded': '↩️ Reembolsado'
        };
        
        infoCliente = `
=== PEDIDO #${pedido.id} ===
Estado: ${estadoTexto[pedido.status] || pedido.status}
Cliente: ${pedido.billing?.first_name} ${pedido.billing?.last_name}
Total: $${pedido.total} ${pedido.currency}
Fecha: ${pedido.date_created}
Productos: ${pedido.line_items?.map(i => i.name).join(', ')}
${pedido.meta_data?.find(m => m.key === '_tracking_number')?.value ? 
  `Tracking: ${pedido.meta_data.find(m => m.key === '_tracking_number').value}` : 
  'Tracking: Aún no disponible'}
`;
      }
    } else if (email && preguntaPedido) {
      const pedidosCliente = await consultarPedidosCliente(email);
      if (pedidosCliente.length > 0) {
        infoCliente = '\n=== PEDIDOS DEL CLIENTE ===\n';
        pedidosCliente.slice(0, 3).forEach(p => {
          infoCliente += `#${p.id}: ${p.status} - $${p.total} - ${p.line_items?.map(i => i.name).join(', ')}\n`;
        });
      }
    }

    // ═══════════════════════════════════════════════════════════
    // CARGAR MEMORIA DEL VISITANTE
    // ═══════════════════════════════════════════════════════════
    
    let memoriaVisitante = null;
    if (visitorId) {
      try {
        memoriaVisitante = await kv.get(`tito:visitante:${visitorId}`);
      } catch (e) {}
    }

    // ═══════════════════════════════════════════════════════════
    // DETECTAR SI VOLVIÓ (RETARGETING)
    // ═══════════════════════════════════════════════════════════
    
    let esRetorno = false;
    let mensajeRetorno = '';
    
    if (memoriaVisitante && memoriaVisitante.interacciones > 0) {
      const ultimaVisita = new Date(memoriaVisitante.ultimaInteraccion);
      const ahora = new Date();
      const horasDesdeUltima = (ahora - ultimaVisita) / (1000 * 60 * 60);
      
      if (horasDesdeUltima > 1) {
        esRetorno = true;
        if (memoriaVisitante.productosVistos?.length > 0) {
          mensajeRetorno = `\n🔄 RETORNO: Esta persona volvió después de ${Math.round(horasDesdeUltima)} horas. Vio antes: ${memoriaVisitante.productosVistos[0].nombre}. ¡Usá esto! "¡Volviste! Tu guardián sigue esperándote..."\n`;
        }
      }
    }

    // ═══════════════════════════════════════════════════════════
    // EXTRAER PAÍS DEL VISITANTE (antes de todo para usar en precios)
    // ═══════════════════════════════════════════════════════════

    let codigoPais = 'US'; // Default
    let paisNombre = 'desconocido';

    // Widget envía: country (nombre) y countryCode (código ISO)
    if (contexto?.visitante?.country) {
      paisNombre = contexto.visitante.country;
      codigoPais = contexto.visitante.countryCode || 'US';
    } else if (contexto?.visitante?.pais) {
      // Fallback para formato anterior
      paisNombre = contexto.visitante.pais;
      if (contexto.visitante.paisCodigo) {
        codigoPais = contexto.visitante.paisCodigo;
      } else {
        const mapaPaises = {
          'uruguay': 'UY', 'argentina': 'AR', 'mexico': 'MX', 'méxico': 'MX',
          'colombia': 'CO', 'chile': 'CL', 'peru': 'PE', 'perú': 'PE',
          'brasil': 'BR', 'brazil': 'BR', 'españa': 'ES', 'spain': 'ES',
          'united states': 'US', 'estados unidos': 'US'
        };
        codigoPais = mapaPaises[paisNombre.toLowerCase()] || 'US';
      }
    }

    const monedaInfo = obtenerInfoMoneda(codigoPais);

    // ═══════════════════════════════════════════════════════════
    // CONSTRUIR CONTEXTOS
    // ═══════════════════════════════════════════════════════════

    let productosTexto = '';
    if (productos.length > 0 && !esAdmin) {
      productosTexto = '\n=== PRODUCTOS DISPONIBLES ===\n';
      productos.filter(p => p.disponible).slice(0, 40).forEach(p => {
        const precioFormateado = formatearPrecio(parseFloat(p.precio), codigoPais);
        productosTexto += `- ${p.nombre} (ID:${p.id}): ${precioFormateado} | ${p.categorias}\n`;
        if (p.descripcion_corta) {
          productosTexto += `  ${p.descripcion_corta.substring(0, 100)}\n`;
        }
      });
    }

    let contextoTexto = '';
    let socialProof = '';

    if (contexto) {
      contextoTexto = '\n=== CONTEXTO ACTUAL ===\n';
      if (contexto.pagina) contextoTexto += `Página: ${contexto.pagina}\n`;
      contextoTexto += `🌍 País: ${paisNombre} (${codigoPais})\n`;

      if (contexto.producto) {
        contextoTexto += `MIRANDO: ${contexto.producto.nombre}\n`;
        contextoTexto += `¡APROVECHÁ para crear urgencia sobre este producto!\n`;
        socialProof = `\n💡 SOCIAL PROOF PARA USAR: "${generarSocialProof(contexto.producto)}"\n`;
      }
      if (contexto.carrito > 0) {
        contextoTexto += `🛒 TIENE ${contexto.carrito} PRODUCTOS EN CARRITO - ¡EMPUJÁ A CERRAR!\n`;
      }
      if (contexto.tiempoEnPagina > 60) {
        contextoTexto += `⏱️ Lleva ${Math.round(contexto.tiempoEnPagina/60)} minutos - MUY interesada\n`;
      }
    }

    let memoriaTexto = '';
    if (memoriaVisitante) {
      memoriaTexto = '\n=== CONOCÉS A ESTA PERSONA ===\n';
      if (memoriaVisitante.nombre) memoriaTexto += `Nombre: ${memoriaVisitante.nombre}\n`;
      if (memoriaVisitante.esCliente) memoriaTexto += `✨ YA COMPRÓ ANTES - tratala como VIP, ofrecé productos complementarios\n`;
      if (memoriaVisitante.productosVistos?.length > 0) {
        memoriaTexto += `Vio antes: ${memoriaVisitante.productosVistos.slice(0,3).map(p => p.nombre).join(', ')}\n`;
      }
      if (memoriaVisitante.dudaEconomica) {
        memoriaTexto += `⚠️ MOSTRÓ DUDA ECONÓMICA antes - defender valor del arte primero\n`;
      }
      if (memoriaVisitante.interacciones > 3) {
        memoriaTexto += `💬 Ya chateó ${memoriaVisitante.interacciones} veces - MUY interesada\n`;
      }
    }

    let adminTexto = '';
    if (esAdmin && statsAdmin) {
      adminTexto = `
=== MODO ADMIN - ESTADÍSTICAS ===
📊 VENTAS HOY: ${statsAdmin.ventasHoy} pedidos ($${statsAdmin.montoHoy} USD)
⏳ Pendientes: ${statsAdmin.pendientes}
📦 Procesando: ${statsAdmin.procesando}
✅ Completados: ${statsAdmin.completados}

ÚLTIMOS PEDIDOS:
${statsAdmin.ultimosPedidos.map(p => 
  `#${p.id} - ${p.cliente} (${p.email}) - $${p.total} - ${p.estado}`
).join('\n')}
`;
    }

    // ═══════════════════════════════════════════════════════════
    // DETECTAR INTENCIÓN DE IRSE (CLOSER)
    // ═══════════════════════════════════════════════════════════
    
    let closerTexto = '';
    if (/chau|adiós|adios|gracias por|me voy|después veo|despues veo|lo pienso/i.test(message)) {
      closerTexto = '\n🚨 DETECTADO: SE QUIERE IR. Usá el closer: "Antes de que te vayas... con el 30% lo asegurás 30 días" o "Tu guardián sigue esperándote..."\n';
    }

    // ═══════════════════════════════════════════════════════════
    // INSTRUCCIONES DE MONEDA
    // ═══════════════════════════════════════════════════════════

    let monedaTexto = '';
    if (!esAdmin) {
      if (codigoPais === 'UY') {
        monedaTexto = `
=== MONEDA: PESOS URUGUAYOS ===
Este visitante es de Uruguay.
TODOS los precios que menciones deben estar en PESOS URUGUAYOS (UYU).
Los precios en la lista ya están convertidos a UYU.
Ejemplo: "Este guardián está en $3.080 UYU" (NO en dólares)
`;
      } else if (codigoPais === 'US') {
        monedaTexto = `
=== MONEDA: DÓLARES ===
Este visitante es de Estados Unidos.
TODOS los precios en DÓLARES (USD).
Ejemplo: "Este guardián está en $70 USD"
`;
      } else {
        const info = obtenerInfoMoneda(codigoPais);
        monedaTexto = `
=== MONEDA: ${info.codigo} ===
Este visitante es de ${paisNombre}.
Mostrá precios en USD + equivalente en ${info.nombre}.
Los precios en la lista ya tienen el formato correcto.
Ejemplo: "$70 USD (aprox. ${info.simbolo}${Math.round(70 * info.tasa).toLocaleString('es')} ${info.nombre})"
`;
      }
    }

    // ═══════════════════════════════════════════════════════════
    // SYSTEM PROMPT FINAL
    // ═══════════════════════════════════════════════════════════

    const systemPrompt = `${PERSONALIDAD_TITO}

${CONOCIMIENTO_BASE}
${monedaTexto}
${productosTexto}
${contextoTexto}
${socialProof}
${memoriaTexto}
${mensajeRetorno}
${closerTexto}
${infoCliente}
${adminTexto}

=== INSTRUCCIÓN FINAL ===
${esAdmin ?
  'Estás hablando con el equipo (admin). Respondé con datos precisos.' :
  'VENDÉ con elegancia. Defendé el valor del arte. Cada respuesta acerca a la venta. Cerrá siempre con pregunta o call to action.'
}
`;

    // ═══════════════════════════════════════════════════════════
    // MENSAJES
    // ═══════════════════════════════════════════════════════════

    const mensajes = [];
    if (conversationHistory?.length > 0) {
      conversationHistory.slice(-10).forEach(h => {
        mensajes.push({ 
          role: h.role === 'assistant' ? 'assistant' : 'user', 
          content: h.content 
        });
      });
    }
    mensajes.push({ role: 'user', content: message });

    // ═══════════════════════════════════════════════════════════
    // LLAMAR A CLAUDE
    // ═══════════════════════════════════════════════════════════

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: mensajes
    });

    let textoRespuesta = response.content[0].text;

    // Extraer productos recomendados
    let productosRecomendados = [];
    const match = textoRespuesta.match(/\[PRODUCTOS:\s*([^\]]+)\]/i);

    if (match) {
      // Limpiar el tag de la respuesta
      textoRespuesta = textoRespuesta.replace(/\[PRODUCTOS:[^\]]+\]/i, '').trim();
      const ids = match[1].split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      ids.forEach(id => {
        const prod = productos.find(p => p.id === id);
        if (prod) {
          productosRecomendados.push({
            id: prod.id,
            nombre: prod.nombre,
            precio: prod.precio,
            imagen: prod.imagen,
            url: prod.url
          });
        }
      });
    }

    // FALLBACK: Si no hay productos pero detectamos intención, mostrar los primeros 4
    const tieneIntencion = /protecci[oó]n|abundancia|amor|sanaci[oó]n|duende|guardi[aá]n|qu[eé] ten[eé]s|mostrame|ver|busco/i.test(message);
    const TITO_AVATAR = 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg';

    if (productosRecomendados.length === 0 && productos.length > 0 && tieneIntencion && !esAdmin) {
      // Tomar los primeros 4 productos disponibles (con o sin imagen)
      productosRecomendados = productos
        .filter(p => p.disponible)
        .slice(0, 4)
        .map(p => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          imagen: p.imagen || TITO_AVATAR,
          url: p.url
        }));
    }

    // Asegurar que todos los productos tengan imagen (fallback a Tito)
    productosRecomendados = productosRecomendados.map(p => ({
      ...p,
      imagen: p.imagen || TITO_AVATAR
    }));

    // ═══════════════════════════════════════════════════════════
    // GUARDAR MEMORIA
    // ═══════════════════════════════════════════════════════════

    if (visitorId && !esAdmin) {
      try {
        const nuevaMemoria = memoriaVisitante || {
          creado: new Date().toISOString(),
          interacciones: 0,
          productosVistos: [],
          infoPersonal: {},
          conversaciones: []
        };

        nuevaMemoria.ultimaInteraccion = new Date().toISOString();
        nuevaMemoria.interacciones = (nuevaMemoria.interacciones || 0) + 1;
        if (!nuevaMemoria.infoPersonal) nuevaMemoria.infoPersonal = {};
        if (!nuevaMemoria.conversaciones) nuevaMemoria.conversaciones = [];

        // Guardar fragmento de conversación para el admin
        nuevaMemoria.conversaciones.push({
          fecha: new Date().toISOString(),
          usuario: message.substring(0, 500),
          tito: textoRespuesta.substring(0, 500)
        });
        // Mantener solo las últimas 20 interacciones
        if (nuevaMemoria.conversaciones.length > 20) {
          nuevaMemoria.conversaciones = nuevaMemoria.conversaciones.slice(-20);
        }

        // Detectar nombre
        const nombreMatch = message.match(/(?:me llamo|soy|mi nombre es)\s+([A-Za-zÁáÉéÍíÓóÚúÑñ]+)/i);
        if (nombreMatch) {
          nuevaMemoria.nombre = nombreMatch[1];
          nuevaMemoria.infoPersonal.nombre = nombreMatch[1];
        }

        // Detectar email
        const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (emailMatch) {
          nuevaMemoria.email = emailMatch[0];
          nuevaMemoria.infoPersonal.email = emailMatch[0];
        }

        // === EXTRAER INFORMACIÓN PERSONAL (CONFIDENTE) ===

        // Detectar si vive solo/a o acompañado/a
        if (/vivo sol[ao]|estoy sol[ao]|separad[ao]|divorciad[ao]/i.test(message)) {
          nuevaMemoria.infoPersonal.situacionFamiliar = 'vive solo/a';
        } else if (/vivo con|mi pareja|mi esposo|mi esposa|mi novio|mi novia|casad[ao]/i.test(message)) {
          nuevaMemoria.infoPersonal.situacionFamiliar = 'en pareja';
        } else if (/mis hijos|tengo hijos|soy madre|soy padre|mis niños/i.test(message)) {
          nuevaMemoria.infoPersonal.tieneHijos = true;
        }

        // Detectar mascotas
        const mascotaMatch = message.match(/(?:mi|tengo|un[ao]?)\s+(perro|gato|gata|perrita|perrito|gatito|gatita|mascota)/i);
        if (mascotaMatch) {
          nuevaMemoria.infoPersonal.mascota = mascotaMatch[1];
        }
        const nombreMascotaMatch = message.match(/(?:se llama|llamado|llamada)\s+([A-Za-zÁáÉéÍíÓóÚúÑñ]+)/i);
        if (nombreMascotaMatch && nuevaMemoria.infoPersonal.mascota) {
          nuevaMemoria.infoPersonal.nombreMascota = nombreMascotaMatch[1];
        }

        // Detectar problemas/momento difícil
        if (/estoy pasando|momento difícil|momento dificil|problema|crisis|ansiedad|depresión|depresion|triste|angustia|preocupad[ao]|estresad[ao]/i.test(message)) {
          nuevaMemoria.infoPersonal.atravesandoMomentoDificil = true;
          if (!nuevaMemoria.infoPersonal.problemasMencionados) {
            nuevaMemoria.infoPersonal.problemasMencionados = [];
          }
          nuevaMemoria.infoPersonal.problemasMencionados.push({
            fecha: new Date().toISOString(),
            contexto: message.substring(0, 200)
          });
        }

        // Detectar intereses espirituales
        if (/tarot|runas|cristales|meditación|meditacion|yoga|astrología|astrologia|chakras|reiki|brujería|brujeria|magia/i.test(message)) {
          if (!nuevaMemoria.infoPersonal.interesesEspirituales) {
            nuevaMemoria.infoPersonal.interesesEspirituales = [];
          }
          const intereses = message.match(/tarot|runas|cristales|meditación|meditacion|yoga|astrología|astrologia|chakras|reiki|brujería|brujeria|magia/gi);
          if (intereses) {
            intereses.forEach(i => {
              if (!nuevaMemoria.infoPersonal.interesesEspirituales.includes(i.toLowerCase())) {
                nuevaMemoria.infoPersonal.interesesEspirituales.push(i.toLowerCase());
              }
            });
          }
        }

        // Detectar trabajo/ocupación
        const trabajoMatch = message.match(/(?:trabajo en|soy|trabajo como|me dedico a)\s+([^,.]+)/i);
        if (trabajoMatch) {
          nuevaMemoria.infoPersonal.ocupacion = trabajoMatch[1].trim();
        }

        // Detectar para quién es (regalo)
        if (/para mi mamá|para mi madre|para mi hermana|para una amiga|para mi hija|es un regalo|para regalar/i.test(message)) {
          nuevaMemoria.infoPersonal.compraParaRegalo = true;
          const destinatarioMatch = message.match(/para mi\s+(\w+)|para una\s+(\w+)/i);
          if (destinatarioMatch) {
            nuevaMemoria.infoPersonal.destinatarioRegalo = destinatarioMatch[1] || destinatarioMatch[2];
          }
        }

        // Detectar motivo de interés
        if (/busco protección|necesito protección|quiero proteger/i.test(message)) {
          nuevaMemoria.infoPersonal.motivoPrincipal = 'protección';
        } else if (/abundancia|dinero|trabajo|prosperidad/i.test(message)) {
          nuevaMemoria.infoPersonal.motivoPrincipal = 'abundancia';
        } else if (/amor|pareja|relación|corazón/i.test(message)) {
          nuevaMemoria.infoPersonal.motivoPrincipal = 'amor';
        } else if (/salud|sanación|sanar|curar/i.test(message)) {
          nuevaMemoria.infoPersonal.motivoPrincipal = 'sanación';
        }

        // Detectar duda económica
        if (/caro|expensive|precio|presupuesto|después|despues|no puedo|no tengo|mucho dinero|mucha plata/i.test(message)) {
          nuevaMemoria.dudaEconomica = true;
          nuevaMemoria.infoPersonal.mostróDudaEconómica = true;
        }

        // Guardar producto visto
        if (contexto?.producto) {
          if (!nuevaMemoria.productosVistos) nuevaMemoria.productosVistos = [];
          if (!nuevaMemoria.productosVistos.find(p => p.nombre === contexto.producto.nombre)) {
            nuevaMemoria.productosVistos.unshift(contexto.producto);
            nuevaMemoria.productosVistos = nuevaMemoria.productosVistos.slice(0, 10);
          }
        }

        // Guardar país si está disponible
        if (codigoPais && paisNombre) {
          nuevaMemoria.infoPersonal.pais = paisNombre;
          nuevaMemoria.infoPersonal.codigoPais = codigoPais;
        }

        await kv.set(`tito:visitante:${visitorId}`, nuevaMemoria, { ex: 60 * 24 * 60 * 60 });

        // === GUARDAR EN LISTA DE PERFILES PARA ADMIN ===
        // Crear entrada en lista indexada para fácil acceso admin
        if (nuevaMemoria.nombre || nuevaMemoria.email || Object.keys(nuevaMemoria.infoPersonal).length > 2) {
          await kv.sadd('tito:perfiles:activos', visitorId);
        }

      } catch (e) {
        console.error('Error guardando memoria Tito:', e);
      }
    }

    // ═══════════════════════════════════════════════════════════
    // REGISTRAR EVENTO PARA REPORTE DIARIO
    // ═══════════════════════════════════════════════════════════

    if (!esAdmin) {
      registrarEvento(TIPOS_EVENTO.CHAT_TITO, {
        visitorId,
        pais: paisNombre,
        tieneProductosEnCarrito: contexto?.carrito > 0,
        preguntaSobre: /precio|envío|envio|pago/i.test(message) ? 'logistica' :
                       /protecci|abundancia|amor|sanaci/i.test(message) ? 'categoria' :
                       /pedido|orden|tracking/i.test(message) ? 'pedido' : 'general',
        esRetorno
      });
    }

    // ═══════════════════════════════════════════════════════════
    // RESPUESTA
    // ═══════════════════════════════════════════════════════════

    return Response.json({
      success: true,
      response: textoRespuesta,
      respuesta: textoRespuesta,
      productos: productosRecomendados,
      esAdmin,
      esRetorno
    }, { headers: CORS_HEADERS });
    
  } catch (error) {
    console.error('Error Tito:', error);

    // Registrar error para reporte
    registrarEvento(TIPOS_EVENTO.ERROR_API, {
      endpoint: '/api/tito/chat',
      error: error.message
    });

    return Response.json({
      success: false,
      error: error.message,
      response: 'Disculpá, tuve un problemita. ¿Podés intentar de nuevo? Si sigue, escribinos al WhatsApp: +598 98 690 629 💫'
    }, { status: 500, headers: CORS_HEADERS });
  }
}
