import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ═══════════════════════════════════════════════════════════════
// TITO MAESTRO - EL ASISTENTE OMNIPOTENTE
// Todo lo que necesitas, Tito lo hace
// ═══════════════════════════════════════════════════════════════

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { mensaje, historial = [], contexto = 'admin' } = body;

    if (!mensaje) {
      return Response.json({ success: false, error: 'Mensaje requerido' }, { status: 400, headers: CORS_HEADERS });
    }

    // Cargar contexto completo del sistema
    const sistemaContext = await cargarContextoSistema();

    // System prompt EPICO
    const systemPrompt = `Sos TITO MAESTRO - El asistente omnipotente de Duendes del Uruguay.
Sos mas que un asistente: sos el cerebro operativo de todo el negocio.

═══════════════════════════════════════════════════════
PERSONALIDAD Y ESTILO
═══════════════════════════════════════════════════════
- Hablas en español rioplatense natural (vos, tenes, podes, dale, etc)
- Sos eficiente, inteligente y un poco magico
- Siempre ofreces soluciones, nunca excusas
- Sos proactivo: si ves algo que mejorar, lo mencionas
- Usas emojis con moderacion para dar calidez
- Cuando algo es imposible, ofreces alternativas

═══════════════════════════════════════════════════════
CONTEXTO ACTUAL DEL SISTEMA
═══════════════════════════════════════════════════════
${sistemaContext}

═══════════════════════════════════════════════════════
TUS SUPERPODERES - ACCIONES QUE PODES EJECUTAR
═══════════════════════════════════════════════════════

Cuando necesites ejecutar una accion, responde con el JSON correspondiente.
Podes encadenar multiples acciones en una respuesta.

📋 GESTION DE CLIENTES
----------------------
{"accion": "buscar_cliente", "query": "email o nombre"}
{"accion": "ver_cliente", "email": "email@ejemplo.com"}
{"accion": "editar_cliente", "email": "email@ejemplo.com", "datos": {"nombre": "nuevo nombre", "telefono": "099..."}}
{"accion": "dar_runas", "email": "email@ejemplo.com", "cantidad": 50, "motivo": "regalo de bienvenida"}
{"accion": "dar_treboles", "email": "email@ejemplo.com", "cantidad": 100, "motivo": "compensacion"}
{"accion": "crear_nota", "email": "email@ejemplo.com", "nota": "texto de la nota"}
{"accion": "ver_historial", "email": "email@ejemplo.com"}
{"accion": "segmentar_clientes", "criterio": "gastado>500|circulo_activo|inactivos_30d|nuevos_7d"}

⭐ GESTION DEL CIRCULO
----------------------
{"accion": "activar_circulo", "email": "email@ejemplo.com", "dias": 30, "plan": "mensual|trimestral|anual"}
{"accion": "extender_circulo", "email": "email@ejemplo.com", "dias": 30}
{"accion": "desactivar_circulo", "email": "email@ejemplo.com", "motivo": "razon"}
{"accion": "ver_circulo", "filtro": "activos|por_vencer|vencidos|prueba"}
{"accion": "enviar_recordatorio_circulo", "dias_antes": 7}

🛒 GESTION DE ORDENES (WooCommerce)
-----------------------------------
{"accion": "buscar_ordenes", "filtro": "pendientes|procesando|completadas|reembolsadas", "limite": 20}
{"accion": "ver_orden", "orden_id": 12345}
{"accion": "actualizar_orden", "orden_id": 12345, "estado": "processing|completed|cancelled", "nota": "opcional"}
{"accion": "reembolsar_orden", "orden_id": 12345, "monto": "total|parcial", "cantidad": 50, "motivo": "razon"}
{"accion": "ordenes_del_dia"}
{"accion": "ordenes_pendientes"}

📦 GESTION DE PRODUCTOS
-----------------------
{"accion": "buscar_productos", "query": "nombre o categoria"}
{"accion": "ver_producto", "producto_id": "id"}
{"accion": "editar_producto", "producto_id": "id", "datos": {"precio": 100, "stock": 5, "destacado": true}}
{"accion": "crear_producto", "datos": {"nombre": "...", "precio": 100, "descripcion": "...", "categoria": "..."}}
{"accion": "actualizar_stock", "producto_id": "id", "stock": 10}
{"accion": "productos_sin_stock"}
{"accion": "productos_destacados"}
{"accion": "sincronizar_woo"}

🎫 CUPONES Y DESCUENTOS
-----------------------
{"accion": "crear_cupon", "codigo": "CODIGO", "tipo": "porcentaje|fijo", "valor": 20, "usos": 100, "expira": "2025-12-31", "minimo": 500}
{"accion": "ver_cupones", "estado": "activos|vencidos|todos"}
{"accion": "desactivar_cupon", "codigo": "CODIGO"}
{"accion": "uso_cupon", "codigo": "CODIGO"}

📧 COMUNICACION Y EMAILS
------------------------
{"accion": "enviar_email", "para": "email@ejemplo.com", "asunto": "...", "contenido": "...", "plantilla": "bienvenida|recordatorio|promo|personalizado"}
{"accion": "email_masivo", "segmento": "circulo|todos|inactivos", "asunto": "...", "contenido": "..."}
{"accion": "programar_email", "para": "email@ejemplo.com", "fecha": "2025-01-15", "asunto": "...", "contenido": "..."}
{"accion": "ver_emails_programados"}
{"accion": "enviar_whatsapp", "telefono": "099123456", "mensaje": "..."}

📊 REPORTES Y ANALYTICS
-----------------------
{"accion": "stats_generales"}
{"accion": "stats_ventas", "periodo": "hoy|semana|mes|año|custom", "desde": "2025-01-01", "hasta": "2025-01-31"}
{"accion": "stats_clientes", "tipo": "nuevos|recurrentes|top|inactivos"}
{"accion": "stats_productos", "tipo": "mas_vendidos|menos_vendidos|sin_movimiento"}
{"accion": "proyeccion_ingresos", "meses": 3}
{"accion": "comparar_periodos", "periodo1": "este_mes", "periodo2": "mes_anterior"}
{"accion": "exportar_datos", "tipo": "clientes|ventas|productos", "formato": "csv|json"}

📝 GENERACION DE CONTENIDO
--------------------------
{"accion": "generar_articulo", "tema": "...", "palabras": 3000, "categoria": "cosmos|duendes|diy|esoterico|sanacion"}
{"accion": "generar_email_marketing", "objetivo": "promocion|reactivacion|fidelizacion", "contexto": "..."}
{"accion": "generar_descripcion_producto", "producto": "nombre del producto", "tono": "magico|profesional"}
{"accion": "generar_post_redes", "plataforma": "instagram|facebook", "tema": "..."}
{"accion": "generar_canalizacion", "datos": {"nombreGuardian": "...", "tipoSer": "duende", ...}}

🎨 CREATIVIDAD Y MULTIMEDIA
---------------------------
{"accion": "generar_imagen", "prompt": "descripcion de la imagen", "estilo": "duendes|celestial|botanico|cristales|altar"}
{"accion": "generar_audio", "texto": "texto a convertir en audio", "voz": "thibisay"}

🌐 GESTION WORDPRESS
--------------------
{"accion": "crear_post", "titulo": "...", "contenido": "...", "categoria": "blog|noticias", "estado": "draft|publish"}
{"accion": "editar_post", "post_id": 123, "datos": {"titulo": "...", "contenido": "..."}}
{"accion": "ver_posts", "estado": "draft|publish|all", "limite": 20}
{"accion": "crear_pagina", "titulo": "...", "contenido": "..."}

⚡ AUTOMATIZACIONES
-------------------
{"accion": "crear_automatizacion", "trigger": "nueva_compra|circulo_vence|inactivo_30d", "accion": "enviar_email|dar_runas|crear_nota", "config": {...}}
{"accion": "ver_automatizaciones"}
{"accion": "desactivar_automatizacion", "id": "..."}
{"accion": "ejecutar_tarea", "tarea": "limpiar_tokens|recalcular_rangos|sync_woo"}

🔧 OPERACIONES MASIVAS
----------------------
{"accion": "bulk_dar_runas", "segmento": "circulo|todos", "cantidad": 10, "motivo": "..."}
{"accion": "bulk_email", "segmento": "...", "plantilla": "..."}
{"accion": "bulk_actualizar_precios", "porcentaje": 10, "categoria": "opcional"}

💡 ASISTENCIA INTELIGENTE
-------------------------
{"accion": "sugerir_mejoras"}
{"accion": "analizar_tendencias"}
{"accion": "oportunidades_venta", "email": "email@ejemplo.com"}
{"accion": "clientes_en_riesgo"}
{"accion": "que_hacer_hoy"}

═══════════════════════════════════════════════════════
EJEMPLOS DE USO NATURAL
═══════════════════════════════════════════════════════

Usuario: "Cuantas ventas hubo hoy?"
-> Responder conversacionalmente usando los datos del contexto, o ejecutar stats_ventas

Usuario: "Dale 50 runas a maria@gmail.com por su cumpleaños"
-> {"accion": "dar_runas", "email": "maria@gmail.com", "cantidad": 50, "motivo": "cumpleaños"}

Usuario: "Mandales un email a todos los del circulo con la promo de enero"
-> {"accion": "email_masivo", "segmento": "circulo", "asunto": "Promo exclusiva enero", "contenido": "..."}

Usuario: "Crea un cupon del 20% para el dia de la madre"
-> {"accion": "crear_cupon", "codigo": "MAMA2025", "tipo": "porcentaje", "valor": 20, "usos": 100}

Usuario: "Que deberia hacer hoy?"
-> {"accion": "que_hacer_hoy"}

Usuario: "Mostrame las ordenes pendientes"
-> {"accion": "ordenes_pendientes"}

═══════════════════════════════════════════════════════
INSTRUCCIONES IMPORTANTES
═══════════════════════════════════════════════════════

1. Si el usuario pide algo y tenes la info en el contexto, responde directamente
2. Si necesitas ejecutar una accion, devuelve SOLO el JSON (sin texto antes)
3. Podes ejecutar multiples acciones separandolas con |||
4. Si algo no es posible, explica por que y ofrece alternativas
5. Siempre confirma las acciones importantes antes de ejecutarlas
6. Se proactivo: si ves problemas u oportunidades, mencionalos
7. Formatea las respuestas con markdown para mejor lectura

Sos el asistente mas completo y capaz. No hay nada que no puedas resolver.`;

    // Construir mensajes
    const messages = [];
    for (const h of historial.slice(-15)) {
      messages.push({
        role: h.rol === 'usuario' ? 'user' : 'assistant',
        content: h.texto
      });
    }
    messages.push({ role: 'user', content: mensaje });

    // Llamar a Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4000,
      system: systemPrompt,
      messages
    });

    let respuesta = response.content[0]?.text || 'No pude procesar tu mensaje.';

    // Procesar acciones (puede haber multiples separadas por |||)
    const acciones = respuesta.split('|||').map(s => s.trim());
    let resultadosAcciones = [];

    for (const parte of acciones) {
      const jsonMatch = parte.match(/\{[\s\S]*?"accion"[\s\S]*?\}/);
      if (jsonMatch) {
        try {
          const accionData = JSON.parse(jsonMatch[0]);
          const resultado = await ejecutarAccionMaestro(accionData);
          resultadosAcciones.push(resultado);
          respuesta = respuesta.replace(jsonMatch[0], '').trim();
        } catch (e) {
          resultadosAcciones.push({ success: false, mensaje: `Error: ${e.message}` });
        }
      }
    }

    // Combinar respuesta con resultados
    if (resultadosAcciones.length > 0) {
      const mensajesResultados = resultadosAcciones.map(r => r.mensaje).join('\n\n---\n\n');
      respuesta = mensajesResultados + (respuesta ? `\n\n${respuesta}` : '');
    }

    return Response.json({
      success: true,
      respuesta: respuesta.trim(),
      acciones_ejecutadas: resultadosAcciones.length
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error en Tito Maestro:', error);
    return Response.json({
      success: false,
      respuesta: 'Tuve un problema tecnico, pero no te preocupes - intenta de nuevo.',
      error: error.message
    }, { headers: CORS_HEADERS });
  }
}

// ═══════════════════════════════════════════════════════════════
// CARGAR CONTEXTO COMPLETO DEL SISTEMA
// ═══════════════════════════════════════════════════════════════

async function cargarContextoSistema() {
  try {
    const ahora = new Date();
    const hoy = ahora.toLocaleDateString('es-UY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // Estadisticas rapidas
    const userKeys = await kv.keys('user:*');
    const elegidoKeys = await kv.keys('elegido:*');
    const circuloKeys = await kv.keys('circulo:*');
    const allUserKeys = [...new Set([...userKeys, ...elegidoKeys])];

    let stats = {
      totalClientes: allUserKeys.length,
      miembrosCirculo: 0,
      circulosPorVencer: 0,
      totalRunas: 0,
      totalTreboles: 0,
      totalGastado: 0,
      clientesRecientes: []
    };

    // Procesar usuarios
    const en7Dias = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);
    for (const k of allUserKeys.slice(0, 100)) {
      try {
        const u = await kv.get(k);
        if (u) {
          stats.totalRunas += u.runas || 0;
          stats.totalTreboles += u.treboles || 0;
          stats.totalGastado += u.gastado || u.totalCompras || 0;
          if (u.esCirculo) stats.miembrosCirculo++;

          // Clientes recientes (ultimos 7 dias)
          if (u.fechaCreacion) {
            const fechaAlta = new Date(u.fechaCreacion);
            if ((ahora - fechaAlta) < 7 * 24 * 60 * 60 * 1000) {
              stats.clientesRecientes.push(u.nombre || u.email);
            }
          }
        }
      } catch (e) {}
    }

    // Circulos por vencer
    for (const ck of circuloKeys) {
      try {
        const c = await kv.get(ck);
        if (c?.activo && c?.expira) {
          const expira = new Date(c.expira);
          if (expira <= en7Dias && expira > ahora) stats.circulosPorVencer++;
        }
      } catch (e) {}
    }

    // Productos
    const productos = await kv.get('productos:catalogo') || [];
    const sinStock = productos.filter(p => (p.stock || 0) <= 0).length;

    return `
📅 FECHA: ${hoy}

📊 METRICAS ACTUALES:
- Total clientes: ${stats.totalClientes}
- Miembros Circulo: ${stats.miembrosCirculo}
- Circulos por vencer (7d): ${stats.circulosPorVencer}
- Runas en circulacion: ${stats.totalRunas.toLocaleString()}
- Treboles en circulacion: ${stats.totalTreboles.toLocaleString()}
- Total gastado historico: $${stats.totalGastado.toLocaleString()}
- Productos: ${productos.length} (${sinStock} sin stock)

${stats.clientesRecientes.length > 0 ? `👋 Clientes nuevos (7d): ${stats.clientesRecientes.join(', ')}` : ''}

⚠️ ALERTAS:
${stats.circulosPorVencer > 0 ? `- ${stats.circulosPorVencer} circulos vencen en 7 dias` : ''}
${sinStock > 0 ? `- ${sinStock} productos sin stock` : ''}
`.trim();

  } catch (e) {
    return 'Error cargando contexto del sistema';
  }
}

// ═══════════════════════════════════════════════════════════════
// EJECUTAR ACCIONES - EL MOTOR DE TITO
// ═══════════════════════════════════════════════════════════════

async function ejecutarAccionMaestro(accionData) {
  const { accion } = accionData;

  try {
    switch (accion) {
      // ═══ CLIENTES ═══
      case 'buscar_cliente':
        return await buscarCliente(accionData.query || accionData.email);

      case 'ver_cliente':
        return await verCliente(accionData.email);

      case 'editar_cliente':
        return await editarCliente(accionData.email, accionData.datos);

      case 'dar_runas':
        return await darRecompensa(accionData.email, 'runas', accionData.cantidad, accionData.motivo);

      case 'dar_treboles':
        return await darRecompensa(accionData.email, 'treboles', accionData.cantidad, accionData.motivo);

      case 'crear_nota':
        return await crearNota(accionData.email, accionData.nota);

      case 'ver_historial':
        return await verHistorialCliente(accionData.email);

      case 'segmentar_clientes':
        return await segmentarClientes(accionData.criterio);

      // ═══ CIRCULO ═══
      case 'activar_circulo':
        return await gestionarCirculo(accionData.email, 'activar', accionData.dias || 30, accionData.plan);

      case 'extender_circulo':
        return await gestionarCirculo(accionData.email, 'extender', accionData.dias || 30);

      case 'desactivar_circulo':
        return await gestionarCirculo(accionData.email, 'desactivar', 0, null, accionData.motivo);

      case 'ver_circulo':
        return await verCirculo(accionData.filtro);

      // ═══ ORDENES ═══
      case 'buscar_ordenes':
        return await buscarOrdenes(accionData.filtro, accionData.limite);

      case 'ver_orden':
        return await verOrden(accionData.orden_id);

      case 'actualizar_orden':
        return await actualizarOrden(accionData.orden_id, accionData.estado, accionData.nota);

      case 'ordenes_del_dia':
        return await ordenesDelDia();

      case 'ordenes_pendientes':
        return await buscarOrdenes('pendientes', 20);

      // ═══ PRODUCTOS ═══
      case 'buscar_productos':
        return await buscarProductos(accionData.query);

      case 'ver_producto':
        return await verProducto(accionData.producto_id);

      case 'editar_producto':
        return await editarProducto(accionData.producto_id, accionData.datos);

      case 'actualizar_stock':
        return await actualizarStock(accionData.producto_id, accionData.stock);

      case 'productos_sin_stock':
        return await productosSinStock();

      case 'sincronizar_woo':
        return await sincronizarWoo();

      // ═══ CUPONES ═══
      case 'crear_cupon':
        return await crearCupon(accionData);

      case 'ver_cupones':
        return await verCupones(accionData.estado);

      case 'desactivar_cupon':
        return await desactivarCupon(accionData.codigo);

      // ═══ STATS ═══
      case 'stats_generales':
        return await statsGenerales();

      case 'stats_ventas':
        return await statsVentas(accionData.periodo, accionData.desde, accionData.hasta);

      case 'stats_clientes':
        return await statsClientes(accionData.tipo);

      case 'stats_productos':
        return await statsProductos(accionData.tipo);

      // ═══ CONTENIDO ═══
      case 'generar_articulo':
        return await generarContenido(accionData.tema, accionData.palabras, accionData.categoria);

      case 'generar_email_marketing':
        return await generarEmailMarketing(accionData.objetivo, accionData.contexto);

      case 'generar_post_redes':
        return await generarPostRedes(accionData.plataforma, accionData.tema);

      // ═══ MULTIMEDIA ═══
      case 'generar_imagen':
        return await generarImagen(accionData.prompt, accionData.estilo);

      case 'generar_audio':
        return await generarAudio(accionData.texto, accionData.voz);

      // ═══ INTELIGENCIA ═══
      case 'que_hacer_hoy':
        return await queHacerHoy();

      case 'sugerir_mejoras':
        return await sugerirMejoras();

      case 'clientes_en_riesgo':
        return await clientesEnRiesgo();

      case 'oportunidades_venta':
        return await oportunidadesVenta(accionData.email);

      default:
        return { success: false, mensaje: `Accion "${accion}" no reconocida. Pero seguro puedo ayudarte de otra forma.` };
    }
  } catch (error) {
    return { success: false, mensaje: `Error ejecutando ${accion}: ${error.message}` };
  }
}

// ═══════════════════════════════════════════════════════════════
// IMPLEMENTACION DE ACCIONES
// ═══════════════════════════════════════════════════════════════

// --- CLIENTES ---

async function buscarCliente(query) {
  if (!query) return { success: false, mensaje: 'Necesito un email o nombre para buscar.' };

  const userKeys = await kv.keys('user:*');
  const elegidoKeys = await kv.keys('elegido:*');
  const allKeys = [...new Set([...userKeys, ...elegidoKeys])];
  const resultados = [];
  const q = query.toLowerCase();

  for (const k of allKeys) {
    const u = await kv.get(k);
    if (!u) continue;

    const email = (u.email || '').toLowerCase();
    const nombre = (u.nombre || u.nombrePreferido || '').toLowerCase();

    if (email.includes(q) || nombre.includes(q)) {
      resultados.push({
        email: u.email,
        nombre: u.nombre || u.nombrePreferido || 'Sin nombre',
        runas: u.runas || 0,
        treboles: u.treboles || 0,
        esCirculo: u.esCirculo || false,
        gastado: u.gastado || u.totalCompras || 0,
        ultimaCompra: u.ultimaCompra
      });
    }
  }

  if (resultados.length === 0) {
    return { success: true, mensaje: `No encontre ningun cliente con "${query}". Queres que lo creemos?` };
  }

  const lista = resultados.slice(0, 10).map(r => {
    const ultimaCompra = r.ultimaCompra ? new Date(r.ultimaCompra).toLocaleDateString('es-UY') : 'Nunca';
    return `**${r.nombre}** (${r.email})
   ᚱ ${r.runas} | ☘ ${r.treboles} | ${r.esCirculo ? '⭐ Circulo' : ''} | $${r.gastado} gastado | Ultima compra: ${ultimaCompra}`;
  }).join('\n\n');

  return { success: true, mensaje: `Encontre ${resultados.length} cliente(s):\n\n${lista}` };
}

async function verCliente(email) {
  if (!email) return { success: false, mensaje: 'Necesito el email del cliente.' };

  const emailNorm = email.toLowerCase();
  let user = await kv.get(`user:${emailNorm}`) || await kv.get(`elegido:${emailNorm}`);

  if (!user) {
    return { success: false, mensaje: `No encontre al cliente ${email}` };
  }

  const circulo = await kv.get(`circulo:${emailNorm}`);

  let perfil = `# 👤 Perfil de ${user.nombre || user.nombrePreferido || email}

📧 **Email:** ${user.email}
📱 **Telefono:** ${user.telefono || 'No registrado'}
📅 **Cliente desde:** ${user.fechaCreacion ? new Date(user.fechaCreacion).toLocaleDateString('es-UY') : 'Desconocido'}

## Economia
- ᚱ **Runas:** ${user.runas || 0}
- ☘ **Treboles:** ${user.treboles || 0}
- 💰 **Total gastado:** $${user.gastado || user.totalCompras || 0}
- 🛒 **Compras totales:** ${user.compras?.length || 0}

## Circulo
- **Estado:** ${user.esCirculo ? '⭐ Activo' : '❌ Inactivo'}
${circulo?.expira ? `- **Vence:** ${new Date(circulo.expira).toLocaleDateString('es-UY')}` : ''}
${circulo?.plan ? `- **Plan:** ${circulo.plan}` : ''}

## Guardianes
${user.guardianes?.length > 0 ? user.guardianes.map(g => `- ${g.nombre}`).join('\n') : 'Sin guardianes registrados'}

${user.notasAdmin?.length > 0 ? `## Notas\n${user.notasAdmin.map(n => `- ${n.fecha?.split('T')[0] || ''}: ${n.texto}`).join('\n')}` : ''}`;

  return { success: true, mensaje: perfil };
}

async function editarCliente(email, datos) {
  if (!email || !datos) return { success: false, mensaje: 'Necesito email y datos a modificar.' };

  const emailNorm = email.toLowerCase();
  let userKey = `user:${emailNorm}`;
  let user = await kv.get(userKey);
  if (!user) {
    userKey = `elegido:${emailNorm}`;
    user = await kv.get(userKey);
  }

  if (!user) return { success: false, mensaje: `No encontre al cliente ${email}` };

  // Actualizar campos
  const camposActualizados = [];
  for (const [campo, valor] of Object.entries(datos)) {
    if (valor !== undefined && valor !== null) {
      user[campo] = valor;
      camposActualizados.push(`${campo}: ${valor}`);
    }
  }

  await kv.set(userKey, user);

  return { success: true, mensaje: `✅ Cliente actualizado:\n${camposActualizados.join('\n')}` };
}

async function darRecompensa(email, tipo, cantidad, motivo) {
  if (!email || !cantidad) return { success: false, mensaje: `Necesito email y cantidad de ${tipo}.` };

  const emailNorm = email.toLowerCase();
  let userKey = `user:${emailNorm}`;
  let user = await kv.get(userKey);
  if (!user) {
    userKey = `elegido:${emailNorm}`;
    user = await kv.get(userKey);
  }

  if (!user) return { success: false, mensaje: `No encontre al cliente ${email}` };

  const cantidadNum = parseInt(cantidad);
  user[tipo] = (user[tipo] || 0) + cantidadNum;

  // Registrar en historial
  if (!user.historialRecompensas) user.historialRecompensas = [];
  user.historialRecompensas.push({
    tipo,
    cantidad: cantidadNum,
    motivo: motivo || 'Regalo de Tito',
    fecha: new Date().toISOString()
  });

  await kv.set(userKey, user);

  return {
    success: true,
    mensaje: `🎁 ¡Listo! Le di **${cantidadNum} ${tipo}** a ${user.nombre || email}.
${motivo ? `Motivo: ${motivo}` : ''}
Ahora tiene **${user[tipo]} ${tipo}** en total.`
  };
}

async function crearNota(email, nota) {
  if (!email || !nota) return { success: false, mensaje: 'Necesito email y texto de la nota.' };

  const emailNorm = email.toLowerCase();
  let userKey = `user:${emailNorm}`;
  let user = await kv.get(userKey);
  if (!user) {
    userKey = `elegido:${emailNorm}`;
    user = await kv.get(userKey);
  }

  if (!user) return { success: false, mensaje: `No encontre al cliente ${email}` };

  if (!user.notasAdmin) user.notasAdmin = [];
  user.notasAdmin.push({
    texto: nota,
    fecha: new Date().toISOString(),
    autor: 'Tito Maestro'
  });

  await kv.set(userKey, user);

  return { success: true, mensaje: `📝 Nota agregada para ${user.nombre || email}:\n"${nota}"` };
}

async function verHistorialCliente(email) {
  if (!email) return { success: false, mensaje: 'Necesito el email del cliente.' };

  const emailNorm = email.toLowerCase();
  let user = await kv.get(`user:${emailNorm}`) || await kv.get(`elegido:${emailNorm}`);

  if (!user) return { success: false, mensaje: `No encontre al cliente ${email}` };

  let historial = `# Historial de ${user.nombre || email}\n\n`;

  // Compras
  if (user.compras?.length > 0) {
    historial += `## 🛒 Compras (${user.compras.length})\n`;
    historial += user.compras.slice(-10).map(c =>
      `- ${new Date(c.fecha).toLocaleDateString('es-UY')}: $${c.total} - ${c.items?.join(', ') || 'Items'}`
    ).join('\n');
    historial += '\n\n';
  }

  // Canjes
  if (user.historialCanjes?.length > 0) {
    historial += `## ☘ Canjes (${user.historialCanjes.length})\n`;
    historial += user.historialCanjes.slice(-10).map(c =>
      `- ${new Date(c.fecha).toLocaleDateString('es-UY')}: ${c.tipo} (${c.costo} ${c.moneda || 'treboles'})`
    ).join('\n');
    historial += '\n\n';
  }

  // Recompensas
  if (user.historialRecompensas?.length > 0) {
    historial += `## 🎁 Recompensas recibidas\n`;
    historial += user.historialRecompensas.slice(-10).map(r =>
      `- ${new Date(r.fecha).toLocaleDateString('es-UY')}: +${r.cantidad} ${r.tipo} (${r.motivo})`
    ).join('\n');
  }

  return { success: true, mensaje: historial || 'No hay historial registrado.' };
}

async function segmentarClientes(criterio) {
  const userKeys = await kv.keys('user:*');
  const elegidoKeys = await kv.keys('elegido:*');
  const allKeys = [...new Set([...userKeys, ...elegidoKeys])];
  const resultados = [];
  const ahora = new Date();

  for (const k of allKeys) {
    const u = await kv.get(k);
    if (!u) continue;

    let incluir = false;

    if (criterio.includes('gastado>')) {
      const minimo = parseInt(criterio.split('>')[1]);
      incluir = (u.gastado || u.totalCompras || 0) > minimo;
    } else if (criterio === 'circulo_activo') {
      incluir = u.esCirculo === true;
    } else if (criterio === 'inactivos_30d') {
      if (u.ultimaCompra) {
        const ultimaCompra = new Date(u.ultimaCompra);
        incluir = (ahora - ultimaCompra) > 30 * 24 * 60 * 60 * 1000;
      } else {
        incluir = true;
      }
    } else if (criterio === 'nuevos_7d') {
      if (u.fechaCreacion) {
        const fechaAlta = new Date(u.fechaCreacion);
        incluir = (ahora - fechaAlta) < 7 * 24 * 60 * 60 * 1000;
      }
    }

    if (incluir) {
      resultados.push({
        email: u.email,
        nombre: u.nombre || 'Sin nombre',
        gastado: u.gastado || 0
      });
    }
  }

  if (resultados.length === 0) {
    return { success: true, mensaje: `No encontre clientes con el criterio "${criterio}"` };
  }

  const lista = resultados.slice(0, 20).map(r => `- ${r.nombre} (${r.email})`).join('\n');

  return {
    success: true,
    mensaje: `Encontre **${resultados.length} clientes** con criterio "${criterio}":\n\n${lista}${resultados.length > 20 ? '\n\n...y mas' : ''}`
  };
}

// --- CIRCULO ---

async function gestionarCirculo(email, accionCirculo, dias = 30, plan = null, motivo = null) {
  if (!email) return { success: false, mensaje: 'Necesito el email del usuario.' };

  const emailNorm = email.toLowerCase();
  const ahora = new Date();

  let circuloData = await kv.get(`circulo:${emailNorm}`) || { activo: false, plan: null, expira: null };

  // Actualizar usuario tambien
  let userKey = `user:${emailNorm}`;
  let userData = await kv.get(userKey);
  if (!userData) {
    userKey = `elegido:${emailNorm}`;
    userData = await kv.get(userKey);
  }

  if (accionCirculo === 'activar') {
    circuloData.activo = true;
    circuloData.plan = plan || 'admin';
    circuloData.expira = new Date(ahora.getTime() + dias * 24 * 60 * 60 * 1000).toISOString();
    circuloData.activadoPor = 'Tito Maestro';
    circuloData.fechaActivacion = ahora.toISOString();

    await kv.set(`circulo:${emailNorm}`, circuloData);

    if (userData) {
      userData.esCirculo = true;
      userData.circuloExpira = circuloData.expira;
      await kv.set(userKey, userData);
    }

    return {
      success: true,
      mensaje: `⭐ ¡Circulo **activado** para ${userData?.nombre || email}!
- Plan: ${plan || 'Admin'}
- Duracion: ${dias} dias
- Vence: ${new Date(circuloData.expira).toLocaleDateString('es-UY')}`
    };
  }

  if (accionCirculo === 'extender') {
    const fechaBase = circuloData.expira && new Date(circuloData.expira) > ahora
      ? new Date(circuloData.expira)
      : ahora;

    circuloData.expira = new Date(fechaBase.getTime() + dias * 24 * 60 * 60 * 1000).toISOString();
    circuloData.activo = true;

    await kv.set(`circulo:${emailNorm}`, circuloData);

    if (userData) {
      userData.esCirculo = true;
      userData.circuloExpira = circuloData.expira;
      await kv.set(userKey, userData);
    }

    return {
      success: true,
      mensaje: `⏰ Circulo **extendido ${dias} dias** para ${userData?.nombre || email}.
Nueva fecha de vencimiento: ${new Date(circuloData.expira).toLocaleDateString('es-UY')}`
    };
  }

  if (accionCirculo === 'desactivar') {
    circuloData.activo = false;
    circuloData.motivoDesactivacion = motivo;
    circuloData.fechaDesactivacion = ahora.toISOString();

    await kv.set(`circulo:${emailNorm}`, circuloData);

    if (userData) {
      userData.esCirculo = false;
      await kv.set(userKey, userData);
    }

    return {
      success: true,
      mensaje: `❌ Circulo **desactivado** para ${userData?.nombre || email}.${motivo ? `\nMotivo: ${motivo}` : ''}`
    };
  }

  return { success: false, mensaje: 'Accion de circulo no reconocida.' };
}

async function verCirculo(filtro = 'activos') {
  const circuloKeys = await kv.keys('circulo:*');
  const resultados = [];
  const ahora = new Date();
  const en7Dias = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);

  for (const ck of circuloKeys) {
    const c = await kv.get(ck);
    if (!c) continue;

    const email = ck.replace('circulo:', '');
    const expira = c.expira ? new Date(c.expira) : null;
    const diasRestantes = expira ? Math.ceil((expira - ahora) / (24 * 60 * 60 * 1000)) : null;

    let incluir = false;

    if (filtro === 'activos' && c.activo) incluir = true;
    if (filtro === 'por_vencer' && c.activo && expira && expira <= en7Dias && expira > ahora) incluir = true;
    if (filtro === 'vencidos' && (!c.activo || (expira && expira < ahora))) incluir = true;
    if (filtro === 'prueba' && c.activo && c.esPrueba) incluir = true;

    if (incluir) {
      // Buscar nombre del usuario
      const user = await kv.get(`user:${email}`) || await kv.get(`elegido:${email}`);
      resultados.push({
        email,
        nombre: user?.nombre || 'Sin nombre',
        plan: c.plan,
        expira: expira?.toLocaleDateString('es-UY'),
        diasRestantes,
        esPrueba: c.esPrueba
      });
    }
  }

  if (resultados.length === 0) {
    return { success: true, mensaje: `No encontre miembros del circulo con filtro "${filtro}"` };
  }

  // Ordenar por dias restantes
  resultados.sort((a, b) => (a.diasRestantes || 999) - (b.diasRestantes || 999));

  const lista = resultados.slice(0, 20).map(r =>
    `- **${r.nombre}** (${r.email}) - ${r.plan || 'Sin plan'} - Vence: ${r.expira || 'Sin fecha'} ${r.diasRestantes ? `(${r.diasRestantes}d)` : ''} ${r.esPrueba ? '🆓' : ''}`
  ).join('\n');

  return {
    success: true,
    mensaje: `## ⭐ Miembros del Circulo (${filtro})\n\n${lista}\n\n_Total: ${resultados.length}_`
  };
}

// --- ORDENES WooCommerce ---

async function buscarOrdenes(filtro = 'pendientes', limite = 20) {
  const WOO_URL = process.env.WOO_URL || 'https://duendesdeluruguay.com';
  const WOO_KEY = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
  const WOO_SECRET = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

  if (!WOO_KEY || !WOO_SECRET) {
    return { success: false, mensaje: 'WooCommerce no esta configurado. Necesito las credenciales.' };
  }

  const estadoMap = {
    'pendientes': 'pending',
    'procesando': 'processing',
    'completadas': 'completed',
    'canceladas': 'cancelled',
    'reembolsadas': 'refunded'
  };

  const estado = estadoMap[filtro] || filtro;

  try {
    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/orders?status=${estado}&per_page=${limite}`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );

    if (!res.ok) throw new Error(`WooCommerce error: ${res.status}`);

    const ordenes = await res.json();

    if (ordenes.length === 0) {
      return { success: true, mensaje: `No hay ordenes con estado "${filtro}"` };
    }

    const lista = ordenes.map(o => {
      const fecha = new Date(o.date_created).toLocaleDateString('es-UY');
      return `- **#${o.id}** | ${fecha} | ${o.billing?.first_name || 'Cliente'} | $${o.total} | ${o.status}`;
    }).join('\n');

    return {
      success: true,
      mensaje: `## 🛒 Ordenes (${filtro})\n\n${lista}\n\n_Total: ${ordenes.length}_`
    };

  } catch (error) {
    return { success: false, mensaje: `Error consultando WooCommerce: ${error.message}` };
  }
}

async function verOrden(ordenId) {
  const WOO_URL = process.env.WOO_URL || 'https://duendesdeluruguay.com';
  const WOO_KEY = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
  const WOO_SECRET = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

  if (!WOO_KEY || !WOO_SECRET) {
    return { success: false, mensaje: 'WooCommerce no esta configurado.' };
  }

  try {
    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/orders/${ordenId}`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );

    if (!res.ok) throw new Error(`Orden no encontrada`);

    const o = await res.json();

    const items = o.line_items?.map(i => `- ${i.name} x${i.quantity} - $${i.total}`).join('\n') || 'Sin items';

    return {
      success: true,
      mensaje: `## 🛒 Orden #${o.id}

**Estado:** ${o.status}
**Fecha:** ${new Date(o.date_created).toLocaleString('es-UY')}
**Total:** $${o.total}
**Metodo pago:** ${o.payment_method_title || 'No especificado'}

### Cliente
- Nombre: ${o.billing?.first_name} ${o.billing?.last_name}
- Email: ${o.billing?.email}
- Telefono: ${o.billing?.phone}

### Envio
- Direccion: ${o.shipping?.address_1}, ${o.shipping?.city}
- ${o.shipping?.state}, ${o.shipping?.postcode}

### Items
${items}

${o.customer_note ? `### Nota del cliente\n${o.customer_note}` : ''}`
    };

  } catch (error) {
    return { success: false, mensaje: `Error: ${error.message}` };
  }
}

async function actualizarOrden(ordenId, estado, nota) {
  const WOO_URL = process.env.WOO_URL || 'https://duendesdeluruguay.com';
  const WOO_KEY = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
  const WOO_SECRET = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

  if (!WOO_KEY || !WOO_SECRET) {
    return { success: false, mensaje: 'WooCommerce no esta configurado.' };
  }

  try {
    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
    const body = { status: estado };
    if (nota) body.customer_note = nota;

    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/orders/${ordenId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    if (!res.ok) throw new Error(`Error actualizando orden`);

    return {
      success: true,
      mensaje: `✅ Orden #${ordenId} actualizada a **${estado}**${nota ? `\nNota: ${nota}` : ''}`
    };

  } catch (error) {
    return { success: false, mensaje: `Error: ${error.message}` };
  }
}

async function ordenesDelDia() {
  const WOO_URL = process.env.WOO_URL || 'https://duendesdeluruguay.com';
  const WOO_KEY = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
  const WOO_SECRET = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

  if (!WOO_KEY || !WOO_SECRET) {
    return { success: false, mensaje: 'WooCommerce no esta configurado.' };
  }

  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/orders?after=${hoy.toISOString()}&per_page=50`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );

    if (!res.ok) throw new Error(`WooCommerce error`);

    const ordenes = await res.json();
    const totalVentas = ordenes.reduce((acc, o) => acc + parseFloat(o.total), 0);

    if (ordenes.length === 0) {
      return { success: true, mensaje: '📊 No hay ordenes hoy todavia.' };
    }

    const porEstado = {};
    ordenes.forEach(o => {
      porEstado[o.status] = (porEstado[o.status] || 0) + 1;
    });

    const estados = Object.entries(porEstado).map(([e, c]) => `- ${e}: ${c}`).join('\n');

    return {
      success: true,
      mensaje: `## 📊 Ordenes de hoy

**Total ordenes:** ${ordenes.length}
**Facturacion:** $${totalVentas.toFixed(2)}

### Por estado
${estados}`
    };

  } catch (error) {
    return { success: false, mensaje: `Error: ${error.message}` };
  }
}

// --- PRODUCTOS ---

async function buscarProductos(query) {
  let productos = await kv.get('productos:catalogo') || [];

  if (query) {
    const q = query.toLowerCase();
    productos = productos.filter(p =>
      (p.nombre || '').toLowerCase().includes(q) ||
      (p.categoria || '').toLowerCase().includes(q)
    );
  }

  if (productos.length === 0) {
    return { success: true, mensaje: query ? `No encontre productos con "${query}"` : 'No hay productos cargados.' };
  }

  const lista = productos.slice(0, 15).map(p =>
    `- **${p.nombre}** | $${p.precio} | Stock: ${p.stock || 0} | ${p.categoria || 'Sin cat'} ${p.destacado ? '⭐' : ''}`
  ).join('\n');

  return {
    success: true,
    mensaje: `## 📦 Productos${query ? ` (busqueda: ${query})` : ''}\n\n${lista}\n\n_Total: ${productos.length}_`
  };
}

async function verProducto(productoId) {
  const productos = await kv.get('productos:catalogo') || [];
  const p = productos.find(prod => prod.id === productoId);

  if (!p) return { success: false, mensaje: `Producto ${productoId} no encontrado.` };

  return {
    success: true,
    mensaje: `## 📦 ${p.nombre}

**ID:** ${p.id}
**Precio:** $${p.precio}
**Stock:** ${p.stock || 0}
**Categoria:** ${p.categoria || 'Sin categoria'}
**Destacado:** ${p.destacado ? 'Si' : 'No'}
**Vendidos:** ${p.vendidos || 0}

${p.descripcion ? `### Descripcion\n${p.descripcion}` : ''}

${p.guardian ? `### Info magica\n- Guardian: ${p.guardian}\n- Elemento: ${p.elemento || 'N/A'}\n- Cristales: ${p.cristales?.join(', ') || 'N/A'}` : ''}`
  };
}

async function editarProducto(productoId, datos) {
  let productos = await kv.get('productos:catalogo') || [];
  const index = productos.findIndex(p => p.id === productoId);

  if (index === -1) return { success: false, mensaje: `Producto ${productoId} no encontrado.` };

  productos[index] = { ...productos[index], ...datos, actualizadoEn: new Date().toISOString() };
  await kv.set('productos:catalogo', productos);

  return { success: true, mensaje: `✅ Producto actualizado: ${productos[index].nombre}` };
}

async function actualizarStock(productoId, stock) {
  return await editarProducto(productoId, { stock: parseInt(stock) });
}

async function productosSinStock() {
  const productos = await kv.get('productos:catalogo') || [];
  const sinStock = productos.filter(p => (p.stock || 0) <= 0);

  if (sinStock.length === 0) {
    return { success: true, mensaje: '✅ Todos los productos tienen stock!' };
  }

  const lista = sinStock.map(p => `- ${p.nombre} (${p.id})`).join('\n');

  return {
    success: true,
    mensaje: `## ⚠️ Productos sin stock (${sinStock.length})\n\n${lista}`
  };
}

async function sincronizarWoo() {
  const WOO_URL = process.env.WOO_URL || 'https://duendesdeluruguay.com';
  const WOO_KEY = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
  const WOO_SECRET = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

  if (!WOO_KEY || !WOO_SECRET) {
    return { success: false, mensaje: 'WooCommerce no esta configurado.' };
  }

  try {
    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/products?per_page=100`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );

    if (!res.ok) throw new Error('Error conectando con WooCommerce');

    const wooProductos = await res.json();

    // Preservar datos locales
    const productosExistentes = await kv.get('productos:catalogo') || [];
    const datosLocales = {};
    productosExistentes.forEach(p => {
      if (p.wooId) datosLocales[p.wooId] = { guardian: p.guardian, elemento: p.elemento, cristales: p.cristales };
    });

    const productosNuevos = wooProductos.map(p => ({
      id: `woo_${p.id}`,
      wooId: p.id,
      nombre: p.name,
      precio: parseFloat(p.price) || 0,
      stock: p.stock_quantity || 0,
      categoria: p.categories?.[0]?.name || 'Sin categoria',
      imagen: p.images?.[0]?.src,
      descripcion: p.short_description?.replace(/<[^>]*>/g, '') || '',
      vendidos: p.total_sales || 0,
      destacado: p.featured,
      ...datosLocales[p.id],
      sincronizadoEn: new Date().toISOString()
    }));

    await kv.set('productos:catalogo', productosNuevos);

    return {
      success: true,
      mensaje: `🔄 Sincronizacion completa: ${productosNuevos.length} productos actualizados desde WooCommerce.`
    };

  } catch (error) {
    return { success: false, mensaje: `Error sincronizando: ${error.message}` };
  }
}

// --- CUPONES ---

async function crearCupon(datos) {
  const { codigo, tipo, valor, usos, expira, minimo } = datos;

  if (!codigo || !valor) {
    return { success: false, mensaje: 'Necesito al menos codigo y valor para crear el cupon.' };
  }

  const WOO_URL = process.env.WOO_URL || 'https://duendesdeluruguay.com';
  const WOO_KEY = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
  const WOO_SECRET = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

  if (!WOO_KEY || !WOO_SECRET) {
    // Guardar localmente si no hay WooCommerce
    let cupones = await kv.get('cupones:lista') || [];
    cupones.push({
      codigo: codigo.toUpperCase(),
      tipo: tipo || 'porcentaje',
      valor,
      usos_maximos: usos || null,
      usos_actuales: 0,
      expira,
      minimo,
      creado: new Date().toISOString(),
      activo: true
    });
    await kv.set('cupones:lista', cupones);

    return { success: true, mensaje: `🎫 Cupon **${codigo.toUpperCase()}** creado localmente (${valor}${tipo === 'fijo' ? '$' : '%'} descuento)` };
  }

  try {
    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');

    const cuponData = {
      code: codigo.toUpperCase(),
      discount_type: tipo === 'fijo' ? 'fixed_cart' : 'percent',
      amount: String(valor),
      usage_limit: usos || null,
      date_expires: expira || null,
      minimum_amount: minimo ? String(minimo) : null
    };

    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/coupons`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cuponData)
      }
    );

    if (!res.ok) throw new Error('Error creando cupon en WooCommerce');

    return {
      success: true,
      mensaje: `🎫 Cupon **${codigo.toUpperCase()}** creado en WooCommerce!
- Descuento: ${valor}${tipo === 'fijo' ? '$' : '%'}
- Usos maximos: ${usos || 'Ilimitados'}
${expira ? `- Expira: ${expira}` : ''}
${minimo ? `- Compra minima: $${minimo}` : ''}`
    };

  } catch (error) {
    return { success: false, mensaje: `Error creando cupon: ${error.message}` };
  }
}

async function verCupones(estado = 'activos') {
  const WOO_URL = process.env.WOO_URL || 'https://duendesdeluruguay.com';
  const WOO_KEY = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
  const WOO_SECRET = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

  if (!WOO_KEY || !WOO_SECRET) {
    const cupones = await kv.get('cupones:lista') || [];
    if (cupones.length === 0) {
      return { success: true, mensaje: 'No hay cupones creados.' };
    }
    const lista = cupones.map(c => `- **${c.codigo}**: ${c.valor}${c.tipo === 'fijo' ? '$' : '%'} (${c.activo ? 'Activo' : 'Inactivo'})`).join('\n');
    return { success: true, mensaje: `## 🎫 Cupones\n\n${lista}` };
  }

  try {
    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/coupons?per_page=50`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );

    const cupones = await res.json();

    if (cupones.length === 0) {
      return { success: true, mensaje: 'No hay cupones en WooCommerce.' };
    }

    const lista = cupones.map(c =>
      `- **${c.code}**: ${c.amount}${c.discount_type.includes('percent') ? '%' : '$'} | Usos: ${c.usage_count}/${c.usage_limit || '∞'}`
    ).join('\n');

    return { success: true, mensaje: `## 🎫 Cupones WooCommerce\n\n${lista}` };

  } catch (error) {
    return { success: false, mensaje: `Error: ${error.message}` };
  }
}

async function desactivarCupon(codigo) {
  // Por ahora solo local
  let cupones = await kv.get('cupones:lista') || [];
  const index = cupones.findIndex(c => c.codigo.toUpperCase() === codigo.toUpperCase());

  if (index >= 0) {
    cupones[index].activo = false;
    await kv.set('cupones:lista', cupones);
    return { success: true, mensaje: `🎫 Cupon ${codigo} desactivado.` };
  }

  return { success: false, mensaje: `Cupon ${codigo} no encontrado.` };
}

// --- STATS ---

async function statsGenerales() {
  const userKeys = await kv.keys('user:*');
  const elegidoKeys = await kv.keys('elegido:*');
  const circuloKeys = await kv.keys('circulo:*');
  const allUserKeys = [...new Set([...userKeys, ...elegidoKeys])];

  let stats = {
    clientes: allUserKeys.length,
    miembrosCirculo: 0,
    totalGastado: 0,
    totalRunas: 0,
    totalTreboles: 0
  };

  for (const k of allUserKeys) {
    try {
      const u = await kv.get(k);
      if (u) {
        stats.totalGastado += u.gastado || u.totalCompras || 0;
        stats.totalRunas += u.runas || 0;
        stats.totalTreboles += u.treboles || 0;
        if (u.esCirculo) stats.miembrosCirculo++;
      }
    } catch (e) {}
  }

  const productos = await kv.get('productos:catalogo') || [];

  return {
    success: true,
    mensaje: `## 📊 Estadisticas Generales

### Clientes
- Total registrados: **${stats.clientes}**
- Miembros Circulo: **${stats.miembrosCirculo}**
- Conversion a Circulo: **${stats.clientes > 0 ? ((stats.miembrosCirculo / stats.clientes) * 100).toFixed(1) : 0}%**

### Economia
- Total facturado: **$${stats.totalGastado.toLocaleString()}**
- Ticket promedio: **$${stats.clientes > 0 ? Math.round(stats.totalGastado / stats.clientes) : 0}**
- Runas en circulacion: **${stats.totalRunas.toLocaleString()}**
- Treboles en circulacion: **${stats.totalTreboles.toLocaleString()}**

### Productos
- Total productos: **${productos.length}**
- Sin stock: **${productos.filter(p => (p.stock || 0) <= 0).length}**`
  };
}

async function statsVentas(periodo = 'mes', desde = null, hasta = null) {
  // Para stats reales necesitamos WooCommerce
  const WOO_URL = process.env.WOO_URL || 'https://duendesdeluruguay.com';
  const WOO_KEY = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
  const WOO_SECRET = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

  if (!WOO_KEY || !WOO_SECRET) {
    return { success: false, mensaje: 'Necesito WooCommerce configurado para stats de ventas reales.' };
  }

  try {
    const ahora = new Date();
    let fechaDesde = desde ? new Date(desde) : new Date();

    if (!desde) {
      if (periodo === 'hoy') {
        fechaDesde.setHours(0, 0, 0, 0);
      } else if (periodo === 'semana') {
        fechaDesde.setDate(fechaDesde.getDate() - 7);
      } else if (periodo === 'mes') {
        fechaDesde.setMonth(fechaDesde.getMonth() - 1);
      } else if (periodo === 'año') {
        fechaDesde.setFullYear(fechaDesde.getFullYear() - 1);
      }
    }

    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/orders?after=${fechaDesde.toISOString()}&per_page=100&status=completed`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );

    const ordenes = await res.json();

    const totalVentas = ordenes.reduce((acc, o) => acc + parseFloat(o.total), 0);
    const ticketPromedio = ordenes.length > 0 ? totalVentas / ordenes.length : 0;

    return {
      success: true,
      mensaje: `## 📈 Ventas (${periodo})

**Periodo:** ${fechaDesde.toLocaleDateString('es-UY')} - ${ahora.toLocaleDateString('es-UY')}

- **Total ordenes:** ${ordenes.length}
- **Facturacion:** $${totalVentas.toFixed(2)}
- **Ticket promedio:** $${ticketPromedio.toFixed(2)}`
    };

  } catch (error) {
    return { success: false, mensaje: `Error: ${error.message}` };
  }
}

async function statsClientes(tipo = 'top') {
  const userKeys = await kv.keys('user:*');
  const elegidoKeys = await kv.keys('elegido:*');
  const allKeys = [...new Set([...userKeys, ...elegidoKeys])];
  const clientes = [];

  for (const k of allKeys) {
    try {
      const u = await kv.get(k);
      if (u) {
        clientes.push({
          email: u.email,
          nombre: u.nombre || 'Sin nombre',
          gastado: u.gastado || u.totalCompras || 0,
          ultimaCompra: u.ultimaCompra,
          esCirculo: u.esCirculo
        });
      }
    } catch (e) {}
  }

  if (tipo === 'top') {
    clientes.sort((a, b) => b.gastado - a.gastado);
    const lista = clientes.slice(0, 10).map((c, i) =>
      `${i + 1}. **${c.nombre}** - $${c.gastado} ${c.esCirculo ? '⭐' : ''}`
    ).join('\n');

    return { success: true, mensaje: `## 🏆 Top 10 Clientes\n\n${lista}` };
  }

  if (tipo === 'inactivos') {
    const ahora = new Date();
    const inactivos = clientes.filter(c => {
      if (!c.ultimaCompra) return true;
      const dias = (ahora - new Date(c.ultimaCompra)) / (24 * 60 * 60 * 1000);
      return dias > 60;
    });

    const lista = inactivos.slice(0, 15).map(c =>
      `- ${c.nombre} (${c.email}) - $${c.gastado} gastado`
    ).join('\n');

    return { success: true, mensaje: `## 😴 Clientes Inactivos (+60 dias)\n\n${lista}\n\n_Total: ${inactivos.length}_` };
  }

  return { success: true, mensaje: 'Tipo de stats no reconocido.' };
}

async function statsProductos(tipo = 'mas_vendidos') {
  const productos = await kv.get('productos:catalogo') || [];

  if (tipo === 'mas_vendidos') {
    const ordenados = [...productos].sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0));
    const lista = ordenados.slice(0, 10).map((p, i) =>
      `${i + 1}. **${p.nombre}** - ${p.vendidos || 0} vendidos`
    ).join('\n');

    return { success: true, mensaje: `## 🔥 Productos Mas Vendidos\n\n${lista}` };
  }

  if (tipo === 'sin_movimiento') {
    const sinMovimiento = productos.filter(p => (p.vendidos || 0) === 0);
    const lista = sinMovimiento.map(p => `- ${p.nombre}`).join('\n');

    return { success: true, mensaje: `## 📦 Productos Sin Ventas\n\n${lista}\n\n_Total: ${sinMovimiento.length}_` };
  }

  return { success: true, mensaje: 'Tipo de stats no reconocido.' };
}

// --- CONTENIDO ---

async function generarContenido(tema, palabras = 3000, categoria = 'esoterico') {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `Genera un articulo completo sobre "${tema}" para la categoria ${categoria} de Duendes del Uruguay.

El articulo debe:
- Tener minimo ${palabras} palabras
- Estar en español rioplatense (vos, tenes, podes)
- Ser magico pero informativo
- Incluir introduccion, desarrollo y conclusion
- Tener subtitulos claros

Solo devuelve el contenido del articulo, sin comentarios adicionales.`
      }]
    });

    const contenido = response.content[0]?.text || '';
    const palabrasCount = contenido.split(/\s+/).length;

    return {
      success: true,
      mensaje: `## ✍️ Articulo Generado

**Tema:** ${tema}
**Categoria:** ${categoria}
**Palabras:** ${palabrasCount}

---

${contenido.substring(0, 1500)}...

---
_Contenido completo disponible. Palabras totales: ${palabrasCount}_`
    };

  } catch (error) {
    return { success: false, mensaje: `Error generando contenido: ${error.message}` };
  }
}

async function generarEmailMarketing(objetivo, contexto) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Genera un email de marketing para Duendes del Uruguay.

Objetivo: ${objetivo}
Contexto: ${contexto || 'Email general'}

El email debe:
- Tener asunto atractivo
- Ser breve pero efectivo
- Incluir call to action
- Usar tono magico pero profesional
- Estar en español rioplatense

Formato:
ASUNTO: ...
CONTENIDO:
...`
      }]
    });

    const email = response.content[0]?.text || '';

    return { success: true, mensaje: `## 📧 Email Generado\n\n${email}` };

  } catch (error) {
    return { success: false, mensaje: `Error: ${error.message}` };
  }
}

async function generarPostRedes(plataforma, tema) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Genera un post para ${plataforma} sobre "${tema}" para Duendes del Uruguay.

El post debe:
- Ser atractivo y enganchador
- Incluir emojis apropiados
- Tener hashtags relevantes
- Adaptarse al formato de ${plataforma}
- Incluir call to action

Solo el post, sin explicaciones.`
      }]
    });

    return { success: true, mensaje: `## 📱 Post para ${plataforma}\n\n${response.content[0]?.text}` };

  } catch (error) {
    return { success: false, mensaje: `Error: ${error.message}` };
  }
}

// --- INTELIGENCIA ---

async function queHacerHoy() {
  const tareas = [];
  const ahora = new Date();
  const en7Dias = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Revisar circulos por vencer
  const circuloKeys = await kv.keys('circulo:*');
  let porVencer = 0;
  for (const ck of circuloKeys) {
    const c = await kv.get(ck);
    if (c?.activo && c?.expira) {
      const expira = new Date(c.expira);
      if (expira <= en7Dias && expira > ahora) porVencer++;
    }
  }
  if (porVencer > 0) {
    tareas.push(`⏰ **${porVencer} circulos vencen en 7 dias** - Considera contactarlos para renovacion`);
  }

  // Revisar productos sin stock
  const productos = await kv.get('productos:catalogo') || [];
  const sinStock = productos.filter(p => (p.stock || 0) <= 0);
  if (sinStock.length > 0) {
    tareas.push(`📦 **${sinStock.length} productos sin stock** - Revisar inventario`);
  }

  // Revisar ordenes pendientes
  try {
    const WOO_KEY = process.env.WC_CONSUMER_KEY;
    const WOO_SECRET = process.env.WC_CONSUMER_SECRET;
    if (WOO_KEY && WOO_SECRET) {
      const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
      const res = await fetch(
        `${process.env.WOO_URL}/wp-json/wc/v3/orders?status=pending,processing&per_page=50`,
        { headers: { 'Authorization': `Basic ${auth}` } }
      );
      const ordenes = await res.json();
      if (ordenes.length > 0) {
        tareas.push(`🛒 **${ordenes.length} ordenes por procesar** - Revisar y despachar`);
      }
    }
  } catch (e) {}

  // Sugerencias proactivas
  const userKeys = await kv.keys('user:*');
  if (userKeys.length > 0) {
    tareas.push(`💡 **Tip del dia:** Envia un mensaje a tus mejores clientes agradeciendoles`);
  }

  if (tareas.length === 0) {
    return { success: true, mensaje: `## ✅ Todo en orden!

No hay tareas urgentes para hoy. Algunas sugerencias:
- Revisar estadisticas de ventas
- Crear contenido para redes
- Planificar promociones` };
  }

  return { success: true, mensaje: `## 📋 Que hacer hoy\n\n${tareas.join('\n\n')}` };
}

async function sugerirMejoras() {
  const sugerencias = [];

  // Analizar datos
  const userKeys = await kv.keys('user:*');
  const productos = await kv.get('productos:catalogo') || [];

  // Sugerencias basadas en datos
  if (productos.length < 10) {
    sugerencias.push('📦 **Ampliar catalogo** - Tenes pocos productos, considera agregar mas opciones');
  }

  const productosDestacados = productos.filter(p => p.destacado);
  if (productosDestacados.length === 0) {
    sugerencias.push('⭐ **Destacar productos** - No tenes productos destacados, marca algunos para mejor visibilidad');
  }

  if (userKeys.length > 50) {
    sugerencias.push('📧 **Email marketing** - Con +50 clientes, una campaña de email puede generar buenas ventas');
  }

  // Sugerencias generales
  sugerencias.push('🎁 **Programa de referidos** - Incentiva a clientes actuales a traer nuevos');
  sugerencias.push('📱 **Redes sociales** - Publica contenido regularmente para mantener engagement');

  return { success: true, mensaje: `## 💡 Sugerencias de Mejora\n\n${sugerencias.join('\n\n')}` };
}

async function clientesEnRiesgo() {
  const userKeys = await kv.keys('user:*');
  const elegidoKeys = await kv.keys('elegido:*');
  const allKeys = [...new Set([...userKeys, ...elegidoKeys])];
  const enRiesgo = [];
  const ahora = new Date();

  for (const k of allKeys) {
    const u = await kv.get(k);
    if (!u) continue;

    let riesgo = [];

    // Inactivo por mucho tiempo
    if (u.ultimaCompra) {
      const dias = (ahora - new Date(u.ultimaCompra)) / (24 * 60 * 60 * 1000);
      if (dias > 60) riesgo.push(`Inactivo hace ${Math.round(dias)} dias`);
    }

    // Circulo por vencer
    if (u.esCirculo && u.circuloExpira) {
      const diasHastaVencer = (new Date(u.circuloExpira) - ahora) / (24 * 60 * 60 * 1000);
      if (diasHastaVencer > 0 && diasHastaVencer < 7) {
        riesgo.push(`Circulo vence en ${Math.round(diasHastaVencer)} dias`);
      }
    }

    // Cliente valioso inactivo
    if ((u.gastado || 0) > 200 && riesgo.length > 0) {
      enRiesgo.push({
        nombre: u.nombre || u.email,
        email: u.email,
        gastado: u.gastado,
        riesgo: riesgo.join(', ')
      });
    }
  }

  if (enRiesgo.length === 0) {
    return { success: true, mensaje: '✅ No hay clientes valiosos en riesgo de abandono.' };
  }

  const lista = enRiesgo.slice(0, 10).map(c =>
    `- **${c.nombre}** ($${c.gastado} gastado) - ${c.riesgo}`
  ).join('\n');

  return {
    success: true,
    mensaje: `## ⚠️ Clientes en Riesgo\n\nEstos clientes valiosos necesitan atencion:\n\n${lista}\n\n_Sugerencia: Contactalos con una oferta especial o mensaje personalizado_`
  };
}

async function oportunidadesVenta(email) {
  if (!email) {
    return { success: false, mensaje: 'Necesito el email del cliente para analizar oportunidades.' };
  }

  const user = await kv.get(`user:${email.toLowerCase()}`) || await kv.get(`elegido:${email.toLowerCase()}`);

  if (!user) {
    return { success: false, mensaje: `Cliente ${email} no encontrado.` };
  }

  const oportunidades = [];

  // Si no tiene circulo
  if (!user.esCirculo) {
    oportunidades.push('⭐ **Upgrade a Circulo** - Ofrece beneficios exclusivos');
  }

  // Si tiene muchos treboles sin usar
  if ((user.treboles || 0) > 100) {
    oportunidades.push('☘️ **Treboles acumulados** - Recordale que puede canjearlos por experiencias');
  }

  // Si gasto mucho pero hace tiempo no compra
  if ((user.gastado || 0) > 100 && user.ultimaCompra) {
    const dias = (new Date() - new Date(user.ultimaCompra)) / (24 * 60 * 60 * 1000);
    if (dias > 30) {
      oportunidades.push('🛒 **Cliente recurrente inactivo** - Envia oferta personalizada');
    }
  }

  // Si tiene pocos guardianes
  if (!user.guardianes || user.guardianes.length < 2) {
    oportunidades.push('🧙 **Expandir coleccion** - Sugerir guardian complementario');
  }

  if (oportunidades.length === 0) {
    return { success: true, mensaje: `No identifique oportunidades especificas para ${user.nombre || email}. El cliente esta bien atendido.` };
  }

  return {
    success: true,
    mensaje: `## 💰 Oportunidades para ${user.nombre || email}\n\n${oportunidades.join('\n\n')}`
  };
}

// --- MULTIMEDIA ---

async function generarImagen(prompt, estilo = 'duendes') {
  if (!prompt) {
    return { success: false, mensaje: 'Necesito una descripcion de la imagen a generar.' };
  }

  try {
    // Llamar a nuestra API de generacion de imagenes
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/admin/imagen/generar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, estilo })
    });

    const data = await res.json();

    if (data.success && data.imagen) {
      return {
        success: true,
        mensaje: `## 🎨 Imagen Generada

**Prompt:** ${prompt}
**Estilo:** ${estilo}

![Imagen generada](${data.imagen})

_La imagen fue generada exitosamente. Podes copiar la URL o guardarla._

**URL:** ${data.imagen}`
      };
    } else {
      return { success: false, mensaje: `Error generando imagen: ${data.error || 'Error desconocido'}` };
    }

  } catch (error) {
    return { success: false, mensaje: `Error generando imagen: ${error.message}` };
  }
}

async function generarAudio(texto, voz = 'thibisay') {
  if (!texto) {
    return { success: false, mensaje: 'Necesito el texto que queres convertir a audio.' };
  }

  try {
    // Limpiar markdown del texto para mejor audio
    const textoLimpio = texto
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/\n{2,}/g, '\n')
      .substring(0, 5000) // Limite de caracteres
      .trim();

    // Llamar a nuestra API de generacion de voz
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/admin/voz/generar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texto: textoLimpio,
        voz: voz || 'thibisay'
      })
    });

    const data = await res.json();

    if (data.success && data.audio) {
      const duracionMin = Math.floor((data.duracion || 0) / 60);
      const duracionSeg = Math.floor((data.duracion || 0) % 60);

      return {
        success: true,
        mensaje: `## 🎙️ Audio Generado con Thibisay

**Voz:** ${voz || 'Thibisay'}
**Caracteres:** ${textoLimpio.length}
${data.duracion ? `**Duracion:** ${duracionMin}:${duracionSeg.toString().padStart(2, '0')}` : ''}

🎧 [Escuchar Audio](${data.audio})

_El audio fue generado exitosamente con la voz de Thibisay._

**URL del audio:** ${data.audio}`
      };
    } else {
      return { success: false, mensaje: `Error generando audio: ${data.error || 'Error desconocido'}` };
    }

  } catch (error) {
    return { success: false, mensaje: `Error generando audio: ${error.message}` };
  }
}
