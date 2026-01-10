import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

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
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
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
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
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
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
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
=== SOBRE DUENDES DEL URUGUAY ===
Somos un equipo que crea duendes canalizados 100% a mano en Piriápolis, Uruguay - la Ciudad Alquimista.
IMPORTANTE: Siempre decir "el equipo", "nuestro equipo", "los artesanos". NUNCA atribuir el trabajo a una sola persona.

=== EL VALOR DEL ARTE ===
- Esto NO es un producto, es una OBRA DE ARTE única
- El equipo tarda DÍAS en crear cada pieza, a mano, sin moldes
- Porcelana fría PROFESIONAL (no la común), articulada, flexible, IRROMPIBLE
- Cristales REALES engarzados: amatista, cuarzo, citrino, labradorita, turmalina
- Ropa REAL: lanas, fieltros, telas naturales cosidas a mano
- Cada guardián tiene 4 dedos (característica de los duendes reales)
- El valor es INCALCULABLE - como preguntarle a un artista cuánto vale su obra

=== FILOSOFÍA DEL PACTO ÁLMICO ===
- El duende ELIGE a la persona, no al revés
- Cada pieza es ÚNICA e IRREPETIBLE - cuando se va, DESAPARECE PARA SIEMPRE
- Si sentiste algo al verlo, es una SEÑAL del universo
- No es una compra, es un encuentro predestinado

=== PRECIOS (reflejo del valor artístico) ===
- Minis (10 cm): ~$70 USD - línea de entrada
- Medianos (20-25 cm): $150-200 USD - ÚNICOS
- Grandes (30-40 cm): $300-450 USD - ÚNICOS
- Gigantes (50-70 cm): $700-1050 USD - OBRAS MAESTRAS

=== CATEGORÍAS ===
- PROTECCIÓN: Escudo energético, alejar lo negativo
- ABUNDANCIA: Dinero, prosperidad, negocios
- AMOR: Relaciones, armonía, autoestima
- SANACIÓN: Salud, vitalidad, bienestar

=== ENVÍOS ===
- Internacional: DHL Express, 5-10 días
- Uruguay: DAC, 5-7 días

=== SISTEMA DE SEÑAS (facilidad de pago, NO descuento) ===
- 30% para reservar por 30 días
- 70% antes del envío
- Es una FACILIDAD para que puedas asegurar tu pieza única

=== REFERIDOS ===
- Si recomendás a una amiga, ella recibe cupón de $5 USD
- Los cupones NO son acumulables

=== CONTACTO ===
- WhatsApp: +598 98 690 629
- Email: duendesdeluruguay@gmail.com
`;

// ═══════════════════════════════════════════════════════════════
// PERSONALIDAD TITO - CONCISO Y VENDEDOR
// ═══════════════════════════════════════════════════════════════

const PERSONALIDAD_TITO = `
=== QUIÉN SOS ===
Sos TITO, el guardián digital de Duendes del Uruguay.

=== REGLA #1 - LONGITUD (MUY IMPORTANTE) ===
MÁXIMO 2-3 oraciones cortas. NUNCA más de 50 palabras.
PROHIBIDO hacer listas con guiones o viñetas.
PROHIBIDO dar múltiples opciones largas.
Sé DIRECTO y CONCISO. Como un mensaje de WhatsApp.

=== REGLA #2 - SIEMPRE MOSTRAR PRODUCTOS ===
Cuando alguien mencione protección, abundancia, amor, sanación, duende, guardián, o cualquier categoría:
SIEMPRE incluí al final de tu respuesta: [PRODUCTOS: id1, id2, id3]
Elegí 3-4 productos relevantes de la lista de productos disponibles.
ESTO ES OBLIGATORIO. Sin excepción.

=== REGLA #3 - ESTILO ===
- Hablás con "vos" (uruguayo)
- 1 emoji máximo por mensaje
- Decir "el equipo" nunca nombres
- Preguntá UNA sola cosa por mensaje

=== EJEMPLOS DE RESPUESTAS CORRECTAS ===

Usuario: "busco protección"
Tito: "¡Protección! Mirá estos guardianes que tengo para vos, cada uno con cristales especiales para escudo energético 🛡️ ¿Cuál te llama?
[PRODUCTOS: 123, 456, 789]"

Usuario: "es muy caro"
Tito: "Es una obra de arte única, hecha a mano con cristales reales. Cuando se va, desaparece para siempre. Con el 30% lo reservás 30 días ✨"

Usuario: "qué duendes tenés?"
Tito: "¡Mirá estos que están esperando! Cada uno tiene su propia energía y propósito 🍀
[PRODUCTOS: 111, 222, 333, 444]"

=== EJEMPLOS DE RESPUESTAS INCORRECTAS (NO HACER) ===
- Listas largas con opciones
- Párrafos de más de 3 oraciones
- Explicaciones detalladas
- Múltiples preguntas seguidas

=== OBJECIONES (responder corto) ===
"Caro" → "Es arte único, hecho a mano. Con 30% lo reservás."
"Lo pienso" → "Dale, pero es pieza única. Si otro lo adopta, desaparece."
"Después" → "Perfecto, acá te espero. Este guardián lleva días buscando hogar..."

=== MODO ADMIN ===
Si empieza con "ADMIN:" dar datos precisos.
`;

// ═══════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  
  try {
    const { message, history, contexto, visitorId, email } = await request.json();
    
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
      const wpUrl = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
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
    // CONSTRUIR CONTEXTOS
    // ═══════════════════════════════════════════════════════════

    let productosTexto = '';
    if (productos.length > 0 && !esAdmin) {
      productosTexto = '\n=== PRODUCTOS DISPONIBLES ===\n';
      productos.filter(p => p.disponible).slice(0, 40).forEach(p => {
        productosTexto += `- ${p.nombre} (ID:${p.id}): $${p.precio} USD | ${p.categorias}\n`;
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
    // SYSTEM PROMPT FINAL
    // ═══════════════════════════════════════════════════════════

    const systemPrompt = `${PERSONALIDAD_TITO}

${CONOCIMIENTO_BASE}
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
    if (history?.length > 0) {
      history.slice(-10).forEach(h => {
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
    const TITO_AVATAR = 'https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg';

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
          productosVistos: []
        };
        
        nuevaMemoria.ultimaInteraccion = new Date().toISOString();
        nuevaMemoria.interacciones = (nuevaMemoria.interacciones || 0) + 1;
        
        // Detectar nombre
        const nombreMatch = message.match(/(?:me llamo|soy|mi nombre es)\s+([A-Za-zÁáÉéÍíÓóÚúÑñ]+)/i);
        if (nombreMatch) nuevaMemoria.nombre = nombreMatch[1];
        
        // Detectar email
        const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (emailMatch) nuevaMemoria.email = emailMatch[0];
        
        // Detectar duda económica
        if (/caro|expensive|precio|presupuesto|después|despues|no puedo|no tengo|mucho dinero|mucha plata/i.test(message)) {
          nuevaMemoria.dudaEconomica = true;
        }
        
        // Guardar producto visto
        if (contexto?.producto) {
          if (!nuevaMemoria.productosVistos) nuevaMemoria.productosVistos = [];
          if (!nuevaMemoria.productosVistos.find(p => p.nombre === contexto.producto.nombre)) {
            nuevaMemoria.productosVistos.unshift(contexto.producto);
            nuevaMemoria.productosVistos = nuevaMemoria.productosVistos.slice(0, 10);
          }
        }
        
        await kv.set(`tito:visitante:${visitorId}`, nuevaMemoria, { ex: 60 * 24 * 60 * 60 });
      } catch (e) {}
    }

    // ═══════════════════════════════════════════════════════════
    // RESPUESTA
    // ═══════════════════════════════════════════════════════════

    return Response.json({ 
      success: true, 
      response: textoRespuesta,
      productos: productosRecomendados,
      esAdmin,
      esRetorno
    }, { headers: CORS_HEADERS });
    
  } catch (error) {
    console.error('Error Tito:', error);
    return Response.json({ 
      success: false, 
      error: error.message,
      response: 'Disculpá, tuve un problemita. ¿Podés intentar de nuevo? Si sigue, escribinos al WhatsApp: +598 98 690 629 💫'
    }, { status: 500, headers: CORS_HEADERS });
  }
}
