export const dynamic = "force-dynamic";
import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const WP_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';

function getWooAuth() {
  return Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
}

// POST - Chat con Tito MODO DIOS
export async function POST(request) {
  try {
    const body = await request.json();
    const { mensaje, historial = [] } = body;

    if (!mensaje) {
      return Response.json({
        success: false,
        error: 'Mensaje requerido'
      }, { status: 400 });
    }

    // Obtener estadisticas actuales para contexto
    let stats = { clientesTotal: 0, miembrosCirculo: 0, totalGastado: 0, totalRunas: 0, totalTreboles: 0 };
    const usuarios = [];
    try {
      const userKeys = await kv.keys('user:*');
      const elegidoKeys = await kv.keys('elegido:*');
      const allKeys = [...new Set([...userKeys, ...elegidoKeys])];
      stats.clientesTotal = allKeys.length;

      for (const k of allKeys.slice(0, 150)) {
        const u = await kv.get(k);
        if (u) {
          if (u.esCirculo) stats.miembrosCirculo++;
          stats.totalGastado += u.gastado || u.totalCompras || 0;
          stats.totalRunas += u.runas || 0;
          stats.totalTreboles += u.treboles || 0;
          usuarios.push({
            email: u.email,
            nombre: u.nombre || u.nombrePreferido || 'Sin nombre',
            runas: u.runas || 0,
            treboles: u.treboles || 0,
            esCirculo: u.esCirculo || false,
            gastado: u.gastado || u.totalCompras || 0,
            guardianes: u.guardianes?.length || 0
          });
        }
      }
    } catch (e) {}

    // Obtener estadisticas de WooCommerce
    let wooStats = { ventas: 0, ingresos: 0, pendientes: 0 };
    try {
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const pedidosRes = await fetch(
        `${WP_URL}/wp-json/wc/v3/orders?after=${inicioMes.toISOString().split('T')[0]}T00:00:00&per_page=50&status=completed,processing,on-hold`,
        { headers: { 'Authorization': `Basic ${getWooAuth()}` } }
      );
      if (pedidosRes.ok) {
        const pedidos = await pedidosRes.json();
        wooStats.ventas = pedidos.filter(p => p.status !== 'on-hold').length;
        wooStats.ingresos = pedidos.filter(p => p.status !== 'on-hold').reduce((s, p) => s + parseFloat(p.total || 0), 0);
        wooStats.pendientes = pedidos.filter(p => p.status === 'processing' || p.status === 'on-hold').length;
      }
    } catch (e) {}

    // System prompt MODO DIOS
    const systemPrompt = `
═══════════════════════════════════════════════════════════════════════════════
                          TITO - MODO DIOS / ADMIN SUPREMO
═══════════════════════════════════════════════════════════════════════════════

Sos Tito, el asistente administrativo TODOPODEROSO de Duendes del Uruguay.

## TU ESENCIA
- Hablas en espanol rioplatense autentico (vos, tenes, podes)
- Sos directo, eficiente, capaz de TODO
- NUNCA decis "no puedo", siempre encontras la forma
- Respondes con datos precisos, nunca inventas
- Sos el mejor aliado de Duendes, lo sabes TODO del negocio

## DATOS EN TIEMPO REAL

### CLIENTES Y COMUNIDAD
- Total clientes: ${stats.clientesTotal}
- Miembros Circulo: ${stats.miembrosCirculo}
- Total gastado historico: $${stats.totalGastado.toLocaleString()}
- Runas en circulacion: ${stats.totalRunas.toLocaleString()}
- Treboles en circulacion: ${stats.totalTreboles.toLocaleString()}

### VENTAS WOOCOMMERCE (este mes)
- Pedidos completados: ${wooStats.ventas}
- Ingresos: $${Math.round(wooStats.ingresos).toLocaleString()}
- Pedidos pendientes: ${wooStats.pendientes}

### TOP 20 CLIENTES (por email)
${usuarios.sort((a,b) => b.gastado - a.gastado).slice(0, 20).map(u =>
  `- ${u.nombre} | ${u.email} | $${u.gastado} | ᚱ${u.runas} ☘${u.treboles} | ${u.guardianes} guardianes ${u.esCirculo ? '| ★ Circulo' : ''}`
).join('\n')}

## SUPERPODERES - ACCIONES DISPONIBLES

Cuando necesites ejecutar una accion, responde SOLO con el JSON:

### GESTION DE CLIENTES
1. BUSCAR: {"accion": "buscar_cliente", "datos": {"query": "email, nombre o telefono"}}
2. PERFIL COMPLETO: {"accion": "perfil_cliente", "datos": {"email": "email@ejemplo.com"}}
3. CREAR NOTA: {"accion": "crear_nota", "datos": {"email": "email@ejemplo.com", "nota": "texto"}}

### REGALOS Y MONEDAS
4. DAR RUNAS: {"accion": "dar_regalo", "datos": {"email": "email@ejemplo.com", "tipoRegalo": "runas", "cantidad": 50, "mensaje": "opcional"}}
5. DAR TREBOLES: {"accion": "dar_regalo", "datos": {"email": "email@ejemplo.com", "tipoRegalo": "treboles", "cantidad": 100}}
6. REGALO MASIVO: {"accion": "regalo_masivo", "datos": {"filtro": "circulo|todos|top10", "tipoRegalo": "runas", "cantidad": 10}}

### CIRCULO MAGICO
7. ACTIVAR CIRCULO: {"accion": "gestionar_circulo", "datos": {"email": "email@ejemplo.com", "accionCirculo": "activar"}}
8. EXTENDER CIRCULO: {"accion": "gestionar_circulo", "datos": {"email": "email@ejemplo.com", "accionCirculo": "extender", "dias": 30}}
9. DESACTIVAR CIRCULO: {"accion": "gestionar_circulo", "datos": {"email": "email@ejemplo.com", "accionCirculo": "desactivar"}}
10. VER CIRCULOS POR VENCER: {"accion": "circulos_por_vencer", "datos": {"dias": 7}}

### CONTENIDO
11. GENERAR ARTICULO: {"accion": "generar_contenido", "datos": {"categoria": "cosmos|duendes|diy|esoterico|sanacion|celebraciones", "tipo": "articulo|guia|ritual|meditacion", "tema": "tema especifico", "longitud": 3000}}

### WOOCOMMERCE
12. VER PEDIDOS: {"accion": "ver_pedidos", "datos": {"estado": "processing|completed|on-hold|all"}}
13. BUSCAR PEDIDO: {"accion": "buscar_pedido", "datos": {"query": "email, nombre o numero de pedido"}}
14. VER PRODUCTOS: {"accion": "ver_productos", "datos": {"filtro": "nombre o categoria"}}
15. DESTACAR PRODUCTO: {"accion": "destacar_producto", "datos": {"productoId": "123", "destacado": true}}
16. SINCRONIZAR PRODUCTOS: {"accion": "sincronizar_productos"}

### ESTADISTICAS
16. STATS COMPLETAS: {"accion": "ver_stats"}
17. ACTIVIDAD RECIENTE: {"accion": "ver_actividad"}
18. REPORTE VENTAS: {"accion": "reporte_ventas", "datos": {"periodo": "hoy|semana|mes"}}

### PERFILES VISITANTES (LO QUE TITO APRENDIÓ)
19. VER PERFILES: {"accion": "ver_perfiles_tito", "datos": {"limite": 20}}
20. BUSCAR PERFIL: {"accion": "buscar_perfil_tito", "datos": {"query": "nombre, email o visitorId"}}
21. VER CONVERSACIONES: {"accion": "ver_conversaciones_tito", "datos": {"visitorId": "id_del_visitante"}}
22. PERFILES CON PROBLEMAS: {"accion": "perfiles_vulnerables"}

### CREATIVIDAD (IA)
19. GENERAR IMAGEN: {"accion": "generar_imagen", "datos": {"prompt": "descripcion de la imagen", "estilo": "magico|duende|watercolor|realista|natural"}}
20. GENERAR VOZ: {"accion": "generar_voz", "datos": {"texto": "texto a convertir en audio", "voz": "thibisay|thibisay-rapido|duende|bella|rachel"}}

### CONTENIDO PARA REDES SOCIALES
21. POST INSTAGRAM: {"accion": "generar_post_redes", "datos": {"red": "instagram", "tema": "tema del post", "tipo": "feed|story|reel"}}
22. POST FACEBOOK: {"accion": "generar_post_redes", "datos": {"red": "facebook", "tema": "tema del post"}}
23. HILO TWITTER: {"accion": "generar_post_redes", "datos": {"red": "twitter", "tema": "tema del hilo"}}
24. EMAIL MARKETING: {"accion": "generar_email", "datos": {"tipo": "promo|newsletter|bienvenida|circulo", "tema": "tema del email"}}
25. GUION REEL: {"accion": "generar_guion_reel", "datos": {"tema": "tema del reel", "duracion": "30|60|90"}}

## EJEMPLOS DE USO NATURAL

- "Busca a maria" -> buscar_cliente
- "Dale 100 runas a ana@mail.com por su cumple" -> dar_regalo con mensaje
- "Cuantas ventas hubo hoy?" -> respondes directo con los datos que tenes
- "Extiende el circulo de juan 60 dias" -> gestionar_circulo
- "Muestrame los pedidos pendientes" -> ver_pedidos
- "Genera un articulo sobre cristales de 3000 palabras" -> generar_contenido
- "A todos los del circulo dales 20 treboles" -> regalo_masivo
- "Quien compro mas este mes?" -> respondes con los datos
- "Cuantos circulos vencen esta semana?" -> circulos_por_vencer
- "Sincroniza los productos de WooCommerce" -> sincronizar_productos
- "Genera una imagen de un duende en el bosque" -> generar_imagen
- "Convierte este texto a voz" -> generar_voz
- "Genera un post de Instagram sobre luna llena" -> generar_post_redes
- "Escribe un email de bienvenida para el circulo" -> generar_email
- "Crea un guion para un reel de 30 segundos sobre cristales" -> generar_guion_reel
- "Mostrame los perfiles que aprendió Tito" -> ver_perfiles_tito
- "Busca el perfil de maria" -> buscar_perfil_tito
- "Quienes están pasando por momentos difíciles?" -> perfiles_vulnerables
- "Ver conversaciones del visitante X" -> ver_conversaciones_tito

## REGLAS DE ORO

1. Si no necesitas ejecutar accion, responde directo con los datos que ya tenes
2. Si falta un email, pregunta cual es antes de actuar
3. Siempre confirma lo que hiciste
4. Se conciso pero completo
5. Podes dar opiniones y sugerencias proactivas
6. Si ves algo raro (circulo por vencer, cliente inactivo), mencionalo

## ESTILO DE RESPUESTA - MUY IMPORTANTE

Tu formato debe ser LEGIBLE y AGRADABLE a la vista:

1. **PÁRRAFOS SEPARADOS**: Siempre dejá una línea en blanco entre párrafos
2. **LISTAS CON ESPACIO**: Cada ítem de lista en su propia línea
3. **EMOJIS ESTRATÉGICOS**: Usá emojis al inicio de secciones importantes
4. **NEGRITAS**: Resaltá datos importantes con **negritas**
5. **NO TODO JUNTO**: NUNCA escribas todo pegado sin espacios

### Ejemplo de formato CORRECTO:

🎯 **Resultado de la búsqueda**

Encontré a María García:

- 📧 Email: maria@test.com
- 💰 Compras: $150 USD
- ☘️ Tréboles: 25
- ᚱ Runas: 10

✨ Es miembro del Círculo desde hace 30 días.

### Ejemplo de formato INCORRECTO:
Encontré a María García email maria@test.com compras $150 treboles 25 runas 10 es miembro del circulo

SIEMPRE usá el formato correcto. Nunca el incorrecto.`;

    // Datos adicionales para contexto de circulos por vencer
    let circulosPorVencer = [];
    try {
      const circuloKeys = await kv.keys('circulo:*');
      const ahora = new Date();
      const en7Dias = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);

      for (const ck of circuloKeys) {
        const c = await kv.get(ck);
        if (c?.activo && c?.expira) {
          const expira = new Date(c.expira);
          if (expira <= en7Dias && expira > ahora) {
            const email = ck.replace('circulo:', '');
            const user = usuarios.find(u => u.email?.toLowerCase() === email);
            circulosPorVencer.push({
              email,
              nombre: user?.nombre || email,
              diasRestantes: Math.ceil((expira - ahora) / (24 * 60 * 60 * 1000))
            });
          }
        }
      }
    } catch (e) {}

    // Agregar alerta de circulos por vencer al contexto
    const alertaCirculos = circulosPorVencer.length > 0
      ? `\n\n⚠️ ALERTA: ${circulosPorVencer.length} circulos vencen en los proximos 7 dias:\n${circulosPorVencer.map(c => `- ${c.nombre} (${c.diasRestantes} dias)`).join('\n')}`
      : '';

    const systemPromptFinal = systemPrompt + alertaCirculos;

    // Construir mensajes
    const messages = [];
    for (const h of historial.slice(-10)) {
      messages.push({
        role: h.rol === 'usuario' ? 'user' : 'assistant',
        content: h.texto
      });
    }
    messages.push({ role: 'user', content: mensaje });

    // Llamar a Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemPrompt,
      messages
    });

    let respuesta = response.content[0]?.text || 'No pude procesar tu mensaje.';

    // Verificar si hay una accion JSON para ejecutar
    // Primero intentar extraer JSON de bloques de código markdown
    let jsonStr = null;
    let jsonToRemove = null;

    // Buscar JSON en bloques de código markdown
    const codeBlockMatch = respuesta.match(/```(?:json)?\s*(\{[\s\S]*?"accion"[\s\S]*?\})\s*```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
      jsonToRemove = codeBlockMatch[0];
    } else {
      // Buscar JSON directo (sin bloques de código)
      const directMatch = respuesta.match(/(\{[^{}]*"accion"[^{}]*"datos"[^{}]*\{[^{}]*\}[^{}]*\})/);
      if (directMatch) {
        jsonStr = directMatch[1];
        jsonToRemove = directMatch[0];
      }
    }

    if (jsonStr) {
      try {
        // Limpiar el JSON de caracteres problemáticos
        jsonStr = jsonStr.trim().replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
        const accion = JSON.parse(jsonStr);
        const resultado = await ejecutarAccion(accion);

        // Reemplazar JSON con resultado
        respuesta = respuesta.replace(jsonToRemove, '').trim();
        // Limpiar líneas vacías múltiples
        respuesta = respuesta.replace(/\n{3,}/g, '\n\n');
        respuesta = resultado.mensaje + (respuesta ? `\n\n${respuesta}` : '');
      } catch (e) {
        console.error('JSON parse error:', e, 'JSON:', jsonStr);
        respuesta += `\n\n⚠️ Error al ejecutar la acción. Intenta de nuevo.`;
      }
    }

    return Response.json({
      success: true,
      respuesta: respuesta.trim()
    });

  } catch (error) {
    console.error('Error en Tito:', error);
    return Response.json({
      success: false,
      respuesta: 'Ups, tuve un problema tecnico. Intenta de nuevo.',
      error: error.message
    });
  }
}

// Ejecutar acciones de Tito
async function ejecutarAccion(accion) {
  const { datos } = accion;
  const tipo = accion.accion;

  switch (tipo) {
    case 'buscar_cliente': {
      const query = datos.email || datos.nombre || datos.query;
      if (!query) return { mensaje: 'Necesito un email o nombre para buscar.' };

      const userKeys = await kv.keys('user:*');
      const elegidoKeys = await kv.keys('elegido:*');
      const allKeys = [...new Set([...userKeys, ...elegidoKeys])];
      const resultados = [];

      for (const k of allKeys) {
        const u = await kv.get(k);
        if (!u) continue;

        const email = (u.email || '').toLowerCase();
        const nombre = (u.nombre || '').toLowerCase();
        const q = query.toLowerCase();

        if (email.includes(q) || nombre.includes(q)) {
          resultados.push({
            email: u.email,
            nombre: u.nombre || 'Sin nombre',
            runas: u.runas || 0,
            treboles: u.treboles || 0,
            esCirculo: u.esCirculo || false,
            gastado: u.gastado || u.totalCompras || 0
          });
        }
      }

      if (resultados.length === 0) {
        return { mensaje: `No encontre ningun cliente con "${query}"` };
      }

      const lista = resultados.slice(0, 5).map(r =>
        `- **${r.nombre}** (${r.email})\n  ᚱ ${r.runas} runas | ☘ ${r.treboles} treboles | ${r.esCirculo ? '★ Circulo activo' : 'Sin circulo'} | $${r.gastado} gastado`
      ).join('\n');

      return { mensaje: `Encontre ${resultados.length} resultado(s):\n\n${lista}` };
    }

    case 'dar_regalo': {
      const { email, tipoRegalo, cantidad } = datos;
      if (!email || !tipoRegalo || !cantidad) {
        return { mensaje: 'Necesito email, tipo de regalo y cantidad.' };
      }

      const emailNorm = email.toLowerCase();
      let userKey = `user:${emailNorm}`;
      let user = await kv.get(userKey);
      if (!user) {
        userKey = `elegido:${emailNorm}`;
        user = await kv.get(userKey);
      }

      if (!user) {
        return { mensaje: `No encontre al usuario ${email}` };
      }

      if (tipoRegalo === 'runas') {
        user.runas = (user.runas || 0) + parseInt(cantidad);
      } else if (tipoRegalo === 'treboles') {
        user.treboles = (user.treboles || 0) + parseInt(cantidad);
      } else {
        return { mensaje: `Tipo de regalo "${tipoRegalo}" no reconocido. Usa: runas o treboles.` };
      }

      await kv.set(userKey, user);

      return {
        mensaje: `✓ Listo! Le di **${cantidad} ${tipoRegalo}** a ${user.nombre || email}.\nAhora tiene ${user[tipoRegalo]} ${tipoRegalo} en total.`
      };
    }

    case 'gestionar_circulo': {
      const { email, accionCirculo, dias } = datos;
      if (!email) {
        return { mensaje: 'Necesito el email del usuario.' };
      }

      const emailNorm = email.toLowerCase();
      let circuloData = await kv.get(`circulo:${emailNorm}`);
      const ahora = new Date();

      if (!circuloData) {
        circuloData = { activo: false, plan: 'admin', expira: null };
      }

      // Tambien actualizar el usuario
      let userKey = `user:${emailNorm}`;
      let userData = await kv.get(userKey);
      if (!userData) {
        userKey = `elegido:${emailNorm}`;
        userData = await kv.get(userKey);
      }

      if (accionCirculo === 'activar') {
        circuloData.activo = true;
        if (!circuloData.expira || new Date(circuloData.expira) < ahora) {
          circuloData.expira = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        }
        await kv.set(`circulo:${emailNorm}`, circuloData);

        if (userData) {
          userData.esCirculo = true;
          userData.circuloExpira = circuloData.expira;
          await kv.set(userKey, userData);
        }

        return { mensaje: `✓ Circulo **activado** para ${email}.\nVence el ${new Date(circuloData.expira).toLocaleDateString('es-UY')}` };
      }

      if (accionCirculo === 'desactivar') {
        circuloData.activo = false;
        await kv.set(`circulo:${emailNorm}`, circuloData);

        if (userData) {
          userData.esCirculo = false;
          await kv.set(userKey, userData);
        }

        return { mensaje: `✓ Circulo **desactivado** para ${email}` };
      }

      if (accionCirculo === 'extender' && dias) {
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

        return { mensaje: `✓ Circulo **extendido ${dias} dias** para ${email}.\nNueva fecha de vencimiento: ${new Date(circuloData.expira).toLocaleDateString('es-UY')}` };
      }

      return { mensaje: 'Accion no reconocida. Usa: activar, desactivar, o extender.' };
    }

    case 'ver_stats': {
      const userKeys = await kv.keys('user:*');
      const elegidoKeys = await kv.keys('elegido:*');
      const circuloKeys = await kv.keys('circulo:*');
      const grimorioKeys = await kv.keys('grimorio:*');

      let miembrosCirculo = 0;
      let pruebasActivas = 0;
      let circulosPorVencer = 0;
      let totalRunas = 0;
      let totalTreboles = 0;
      let totalGastado = 0;

      const ahora = new Date();
      const en7Dias = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);

      // Contar usuarios y monedas
      const allUserKeys = [...new Set([...userKeys, ...elegidoKeys])];
      for (const k of allUserKeys) {
        try {
          const u = await kv.get(k);
          if (u) {
            totalRunas += u.runas || 0;
            totalTreboles += u.treboles || 0;
            totalGastado += u.gastado || u.totalCompras || 0;
          }
        } catch (e) {}
      }

      // Contar circulos
      for (const ck of circuloKeys) {
        try {
          const c = await kv.get(ck);
          if (c?.activo) {
            miembrosCirculo++;
            if (c.esPrueba) pruebasActivas++;
            if (c.expira) {
              const expira = new Date(c.expira);
              if (expira <= en7Dias && expira > ahora) circulosPorVencer++;
            }
          }
        } catch (e) {}
      }

      return {
        mensaje: `📊 **Estadisticas actuales:**

👥 **Clientes:** ${allUserKeys.length}
★ **Miembros Circulo:** ${miembrosCirculo} (${pruebasActivas} en prueba)
⏰ **Por vencer (7d):** ${circulosPorVencer}

💰 **Total gastado:** $${totalGastado.toLocaleString()}
ᚱ **Runas en circulacion:** ${totalRunas.toLocaleString()}
☘ **Treboles en circulacion:** ${totalTreboles.toLocaleString()}
📖 **Grimorios activos:** ${grimorioKeys.length}`
      };
    }

    case 'generar_contenido': {
      const { categoria, tipo, tema } = datos;
      if (!tema) {
        return { mensaje: 'Necesito saber sobre que tema queres que genere el contenido.' };
      }

      const categoriaFinal = categoria || 'esoterico';
      const tipoFinal = tipo || 'articulo';

      // Llamar al API de contenido
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000';

        const res = await fetch(`${baseUrl}/api/admin/contenido/generar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoria: categoriaFinal,
            tipo: tipoFinal,
            tema,
            longitud: 3500
          })
        });

        const data = await res.json();
        if (data.success) {
          // Devolver solo los primeros 500 caracteres como preview
          const preview = data.contenido.substring(0, 500) + '...';
          return {
            mensaje: `✅ **Contenido generado!**

📝 **Categoria:** ${categoriaFinal}
📄 **Tipo:** ${tipoFinal}
📊 **Palabras:** ${data.palabras}

**Preview:**
${preview}

_El contenido completo esta disponible en la seccion de Contenido del admin._`
          };
        } else {
          return { mensaje: `Error generando contenido: ${data.error}` };
        }
      } catch (e) {
        return { mensaje: `Error al conectar con el generador: ${e.message}` };
      }
    }

    case 'ver_productos': {
      const { filtro } = datos || {};
      let productos = await kv.get('productos:catalogo') || [];

      if (filtro) {
        const filtroLower = filtro.toLowerCase();
        productos = productos.filter(p =>
          (p.nombre || '').toLowerCase().includes(filtroLower) ||
          (p.categoria || '').toLowerCase().includes(filtroLower)
        );
      }

      if (productos.length === 0) {
        return { mensaje: filtro ? `No encontre productos con "${filtro}"` : 'No hay productos cargados todavia.' };
      }

      const lista = productos.slice(0, 10).map(p =>
        `- **${p.nombre}** | $${p.precio} | Stock: ${p.stock || 0} | ${p.destacado ? '★' : ''}`
      ).join('\n');

      return {
        mensaje: `📦 **Productos${filtro ? ` (filtro: ${filtro})` : ''}:**\n\n${lista}\n\n_Mostrando ${Math.min(10, productos.length)} de ${productos.length} productos_`
      };
    }

    case 'destacar_producto': {
      const { productoId, destacado } = datos;
      if (!productoId) {
        return { mensaje: 'Necesito el ID del producto.' };
      }

      let productos = await kv.get('productos:catalogo') || [];
      const index = productos.findIndex(p => p.id === productoId);

      if (index === -1) {
        return { mensaje: `No encontre el producto con ID: ${productoId}` };
      }

      productos[index].destacado = destacado !== false;
      await kv.set('productos:catalogo', productos);

      return {
        mensaje: `✓ Producto "${productos[index].nombre}" ${destacado !== false ? 'marcado como destacado' : 'quitado de destacados'}`
      };
    }

    case 'sincronizar_productos': {
      try {
        const WOO_URL = process.env.WORDPRESS_URL || process.env.WOO_URL || 'https://duendesdeluruguay.com';
        const WOO_KEY = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
        const WOO_SECRET = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

        if (!WOO_KEY || !WOO_SECRET) {
          return { mensaje: '⚠️ Credenciales de WooCommerce no configuradas. Verifica las variables de entorno WC_CONSUMER_KEY y WC_CONSUMER_SECRET.' };
        }

        const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');

        // Obtener productos de WooCommerce
        let todosProductos = [];
        let page = 1;
        let hasMore = true;

        while (hasMore && page <= 5) {
          const response = await fetch(
            `${WOO_URL}/wp-json/wc/v3/products?per_page=100&page=${page}`,
            {
              headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (!response.ok) {
            return { mensaje: `❌ Error conectando con WooCommerce: ${response.status}` };
          }

          const productos = await response.json();
          if (productos.length === 0) {
            hasMore = false;
          } else {
            todosProductos = [...todosProductos, ...productos];
            page++;
          }
        }

        // Mapear productos
        const productosWoo = todosProductos.map(p => ({
          id: `woo_${p.id}`,
          wooId: p.id,
          nombre: p.name,
          precio: parseFloat(p.price) || 0,
          precioRegular: parseFloat(p.regular_price) || 0,
          precioOferta: parseFloat(p.sale_price) || null,
          stock: p.stock_quantity || 0,
          stockStatus: p.stock_status,
          categoria: p.categories?.[0]?.name || 'Sin categoria',
          categorias: p.categories?.map(c => c.name) || [],
          imagen: p.images?.[0]?.src || null,
          imagenes: p.images?.map(i => i.src) || [],
          descripcion: (p.short_description || '').replace(/<[^>]*>/g, ''),
          slug: p.slug,
          sku: p.sku,
          wooUrl: p.permalink,
          vendidos: p.total_sales || 0,
          destacado: p.featured || false,
          estado: p.status,
          origen: 'woocommerce',
          sincronizadoEn: new Date().toISOString()
        }));

        // Guardar en KV
        await kv.set('productos:catalogo', productosWoo);
        await kv.set('productos:ultima_sincronizacion', {
          fecha: new Date().toISOString(),
          total: productosWoo.length
        });

        // Contar categorias
        const categorias = [...new Set(productosWoo.map(p => p.categoria))];

        return {
          mensaje: `✅ **Sincronizacion completada!**

📦 **${productosWoo.length} productos** sincronizados desde WooCommerce
📁 **${categorias.length} categorias:** ${categorias.slice(0, 5).join(', ')}${categorias.length > 5 ? '...' : ''}
🕐 Sincronizado: ${new Date().toLocaleString('es-UY')}

_Podes ver los productos en la seccion Productos del admin._`
        };
      } catch (e) {
        return { mensaje: `❌ Error sincronizando: ${e.message}` };
      }
    }

    case 'ver_actividad': {
      const userKeys = await kv.keys('user:*');
      const elegidoKeys = await kv.keys('elegido:*');
      const allKeys = [...new Set([...userKeys, ...elegidoKeys])];
      const actividades = [];

      const ahora = new Date();

      for (const k of allKeys.slice(0, 50)) {
        try {
          const u = await kv.get(k);
          if (!u) continue;

          // Ultima compra
          if (u.ultimaCompra) {
            const fecha = new Date(u.ultimaCompra);
            const diff = Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24));
            if (diff <= 30) {
              actividades.push({
                fecha,
                tipo: 'compra',
                texto: `🛒 ${u.nombre || u.email} realizo una compra`,
                dias: diff
              });
            }
          }

          // Canjes recientes
          if (u.historialCanjes?.length) {
            const ultimoCanje = u.historialCanjes[u.historialCanjes.length - 1];
            if (ultimoCanje.fecha) {
              const fecha = new Date(ultimoCanje.fecha);
              const diff = Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24));
              if (diff <= 30) {
                actividades.push({
                  fecha,
                  tipo: 'canje',
                  texto: `☘ ${u.nombre || u.email} canjeo ${ultimoCanje.tipo || 'experiencia'}`,
                  dias: diff
                });
              }
            }
          }

          // Alta reciente
          if (u.fechaCreacion) {
            const fecha = new Date(u.fechaCreacion);
            const diff = Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24));
            if (diff <= 7) {
              actividades.push({
                fecha,
                tipo: 'nuevo',
                texto: `👋 ${u.nombre || u.email} se registro`,
                dias: diff
              });
            }
          }
        } catch (e) {}
      }

      // Ordenar por fecha
      actividades.sort((a, b) => b.fecha - a.fecha);

      if (actividades.length === 0) {
        return { mensaje: 'No hay actividad reciente en los ultimos 30 dias.' };
      }

      const lista = actividades.slice(0, 15).map(a => {
        const tiempo = a.dias === 0 ? 'hoy' : a.dias === 1 ? 'ayer' : `hace ${a.dias} dias`;
        return `- ${a.texto} (${tiempo})`;
      }).join('\n');

      return { mensaje: `📋 **Actividad reciente:**\n\n${lista}` };
    }

    case 'crear_nota': {
      const { email, nota } = datos;
      if (!email || !nota) {
        return { mensaje: 'Necesito el email del cliente y el texto de la nota.' };
      }

      const emailNorm = email.toLowerCase();
      let userKey = `user:${emailNorm}`;
      let user = await kv.get(userKey);
      if (!user) {
        userKey = `elegido:${emailNorm}`;
        user = await kv.get(userKey);
      }

      if (!user) {
        return { mensaje: `No encontre al usuario ${email}` };
      }

      // Agregar nota
      if (!user.notasAdmin) user.notasAdmin = [];
      user.notasAdmin.push({
        texto: nota,
        fecha: new Date().toISOString(),
        autor: 'Tito'
      });

      await kv.set(userKey, user);

      return { mensaje: `✓ Nota agregada para ${user.nombre || email}:\n"${nota}"` };
    }

    case 'generar_imagen': {
      const { prompt, estilo = 'magico' } = datos;
      if (!prompt) {
        return { mensaje: 'Necesito que me digas que imagen queres generar.' };
      }

      if (!process.env.OPENAI_API_KEY) {
        return { mensaje: '⚠️ OPENAI_API_KEY no esta configurada.' };
      }

      try {
        const estilos = {
          magico: 'magical forest, golden hour, mystical, soft bokeh, fantasy art',
          watercolor: 'watercolor painting, soft edges, dreamy, artistic',
          realista: 'photorealistic, high detail, professional photography',
          natural: 'nature photography, green forest, moss, crystals, earth tones',
          duende: 'whimsical forest creature, magical, enchanted, soft lighting, fairy tale style'
        };

        const promptFinal = `${prompt}, ${estilos[estilo] || estilos.magico}, high quality, beautiful`;

        const res = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: promptFinal,
            n: 1,
            size: '1024x1024',
            quality: 'standard'
          })
        });

        const data = await res.json();

        if (data.error) {
          return { mensaje: `❌ Error de OpenAI: ${data.error.message}` };
        }

        if (data.data?.[0]?.url) {
          return {
            mensaje: `🎨 **Imagen generada!**\n\nPrompt: "${prompt}"\nEstilo: ${estilo}\n\n[Ver imagen](${data.data[0].url})\n\n_La imagen estara disponible por 1 hora._`,
            imagenUrl: data.data[0].url
          };
        }

        return { mensaje: '❌ No se pudo generar la imagen.' };
      } catch (e) {
        return { mensaje: `❌ Error: ${e.message}` };
      }
    }

    case 'generar_voz': {
      const { texto, voz = 'duende' } = datos;
      if (!texto) {
        return { mensaje: 'Necesito el texto que queres convertir a voz.' };
      }

      if (!process.env.ELEVENLABS_API_KEY) {
        return { mensaje: '⚠️ ELEVENLABS_API_KEY no esta configurada.' };
      }

      try {
        // Voces personalizadas (Duendes del Uruguay)
        const VOCES = {
          'thibisay': process.env.ELEVENLABS_VOZ_THIBISAY || 'EXAVITQu4vr4xnSDxMaL',
          'thibisay-rapido': process.env.ELEVENLABS_VOZ_THIBISAY_RAPIDO || 'EXAVITQu4vr4xnSDxMaL',
          'duende': process.env.ELEVENLABS_VOZ_THIBISAY || 'EXAVITQu4vr4xnSDxMaL',
          'rachel': '21m00Tcm4TlvDq8ikWAM',
          'bella': 'EXAVITQu4vr4xnSDxMaL'
        };

        const voiceId = VOCES[voz] || VOCES.duende;

        const res = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            method: 'POST',
            headers: {
              'Accept': 'audio/mpeg',
              'Content-Type': 'application/json',
              'xi-api-key': process.env.ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
              text: texto,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
              }
            })
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Eleven Labs error:', res.status, errorText);

          // Si falla con voz personalizada, intentar con Rachel (voz pública)
          if (voiceId !== '21m00Tcm4TlvDq8ikWAM') {
            const fallbackRes = await fetch(
              'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
              {
                method: 'POST',
                headers: {
                  'Accept': 'audio/mpeg',
                  'Content-Type': 'application/json',
                  'xi-api-key': process.env.ELEVENLABS_API_KEY
                },
                body: JSON.stringify({
                  text: texto,
                  model_id: 'eleven_multilingual_v2',
                  voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                })
              }
            );
            if (fallbackRes.ok) {
              const audioBuffer = await fallbackRes.arrayBuffer();
              const base64Audio = Buffer.from(audioBuffer).toString('base64');
              return {
                mensaje: `🎙️ **Audio generado** (usando voz Rachel porque "${voz}" no está disponible)\n\nTexto: "${texto.substring(0, 100)}${texto.length > 100 ? '...' : ''}"`,
                audio: base64Audio,
                audioFormato: 'audio/mpeg'
              };
            }
          }

          return { mensaje: `❌ Error de Eleven Labs: ${res.status}. La voz "${voz}" (ID: ${voiceId}) no está disponible. Verificá que la voz esté en tu librería de Eleven Labs.` };
        }

        // Convertir a base64
        const audioBuffer = await res.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');

        return {
          mensaje: `🎙️ **Audio generado!**\n\nTexto: "${texto.substring(0, 100)}${texto.length > 100 ? '...' : ''}"\nVoz: ${voz}\nCaracteres: ${texto.length}`,
          audio: base64Audio,
          audioFormato: 'audio/mpeg'
        };
      } catch (e) {
        return { mensaje: `❌ Error: ${e.message}` };
      }
    }

    case 'generar_post_redes': {
      const { red, tema, tipo = 'feed' } = datos;
      if (!tema) {
        return { mensaje: 'Necesito saber sobre que tema queres el post.' };
      }

      const redNombre = {
        instagram: 'Instagram',
        facebook: 'Facebook',
        twitter: 'Twitter/X'
      }[red] || 'Instagram';

      try {
        const promptRedes = `Generá un post para ${redNombre} sobre: "${tema}"

REGLAS:
- Tono: místico, cercano, español rioplatense (vos, tenés, podés)
- Marca: Duendes del Uruguay (productos artesanales mágicos)
- Incluí emojis relevantes
- ${red === 'instagram' ? 'Incluí 20-25 hashtags relevantes al final' : ''}
- ${red === 'twitter' ? 'Formato de hilo: numera cada tweet (1/, 2/, etc.)' : ''}
- ${tipo === 'story' ? 'Texto corto y llamativo para story' : ''}
- ${tipo === 'reel' ? 'Texto que invite a ver el reel completo' : ''}

ESTRUCTURA:
1. Hook inicial que capture atención
2. Contenido principal
3. Call to action
${red === 'instagram' ? '4. Hashtags' : ''}`;

        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{ role: 'user', content: promptRedes }],
          system: 'Sos el equipo de Duendes del Uruguay. Creás contenido mágico y espiritual para redes sociales. Usás español rioplatense (vos, tenés). Tono cálido, místico pero accesible.'
        });

        const contenido = response.content[0]?.text || '';

        return {
          mensaje: `📱 **Post para ${redNombre} generado!**

${contenido}

---
_Copiá y pegá el contenido arriba para publicar._`
        };
      } catch (e) {
        return { mensaje: `❌ Error generando post: ${e.message}` };
      }
    }

    case 'generar_email': {
      const { tipo = 'newsletter', tema } = datos;
      if (!tema) {
        return { mensaje: 'Necesito saber sobre que tema queres el email.' };
      }

      const tipoNombre = {
        promo: 'promocional',
        newsletter: 'newsletter',
        bienvenida: 'de bienvenida',
        circulo: 'para el Círculo'
      }[tipo] || tipo;

      try {
        const promptEmail = `Generá un email ${tipoNombre} sobre: "${tema}"

REGLAS:
- Marca: Duendes del Uruguay
- Tono: cálido, místico, español rioplatense
- Asunto que genere apertura
- Contenido que enganche desde el inicio
- Call to action claro

ESTRUCTURA:
1. **Asunto:** (línea de asunto atractiva)
2. **Preview:** (texto de preview para bandejas)
3. **Cuerpo:**
   - Saludo personalizado
   - Introducción que conecte
   - Contenido principal
   - Call to action
   - Despedida cálida
   - Firma de Duendes`;

        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{ role: 'user', content: promptEmail }],
          system: 'Sos el equipo de Duendes del Uruguay. Escribís emails de marketing mágicos y efectivos. Español rioplatense. Creás conexión emocional con las lectoras.'
        });

        const contenido = response.content[0]?.text || '';

        return {
          mensaje: `📧 **Email ${tipoNombre} generado!**

${contenido}

---
_Revisá y personalizá antes de enviar._`
        };
      } catch (e) {
        return { mensaje: `❌ Error generando email: ${e.message}` };
      }
    }

    case 'generar_guion_reel': {
      const { tema, duracion = '30' } = datos;
      if (!tema) {
        return { mensaje: 'Necesito saber sobre que tema queres el guión del reel.' };
      }

      try {
        const promptGuion = `Generá un guión para un reel de ${duracion} segundos sobre: "${tema}"

FORMATO REEL:
- Duración: ${duracion} segundos
- Hook inicial: primeros 3 segundos CLAVE
- Contenido dinámico y visual
- Texto en pantalla sugerido
- Call to action final

ESTRUCTURA:
🎬 **GUIÓN REEL (${duracion}s)**

**[0-3s] HOOK:**
[Texto/acción que capture atención]

**[3-${Math.floor(duracion * 0.7)}s] DESARROLLO:**
[Contenido principal, tips, información]
- Texto en pantalla: "..."
- Acción: ...

**[${Math.floor(duracion * 0.7)}-${duracion}s] CIERRE:**
[Call to action, seguir cuenta, etc.]

**MÚSICA SUGERIDA:** [tipo de música]
**HASHTAGS:** [5-10 hashtags]

REGLAS:
- Marca: Duendes del Uruguay (productos mágicos artesanales)
- Tono: místico pero moderno y dinámico
- Incluí timestamps aproximados
- Sugiere transiciones`;

        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{ role: 'user', content: promptGuion }],
          system: 'Sos experta en contenido de video para redes. Creás guiones para reels de Duendes del Uruguay (productos mágicos). Formato visual, dinámico, que enganche.'
        });

        const contenido = response.content[0]?.text || '';

        return {
          mensaje: `🎬 **Guión de Reel (${duracion}s) generado!**

${contenido}

---
_Adaptá según tu estilo y los elementos visuales que tengas disponibles._`
        };
      } catch (e) {
        return { mensaje: `❌ Error generando guión: ${e.message}` };
      }
    }

    case 'ver_perfiles_tito': {
      const { limite = 20 } = datos || {};
      try {
        // Obtener IDs de perfiles activos
        const perfilesIds = await kv.smembers('tito:perfiles:activos') || [];

        if (perfilesIds.length === 0) {
          return { mensaje: '📋 Todavía no hay perfiles guardados. Tito irá aprendiendo sobre los visitantes a medida que chatee con ellos.' };
        }

        const perfiles = [];
        for (const visitorId of perfilesIds.slice(0, limite)) {
          const perfil = await kv.get(`tito:visitante:${visitorId}`);
          if (perfil) {
            perfiles.push({ visitorId, ...perfil });
          }
        }

        // Ordenar por última interacción
        perfiles.sort((a, b) => new Date(b.ultimaInteraccion) - new Date(a.ultimaInteraccion));

        const lista = perfiles.map(p => {
          const info = p.infoPersonal || {};
          const detalles = [];
          if (info.situacionFamiliar) detalles.push(info.situacionFamiliar);
          if (info.mascota) detalles.push(`tiene ${info.mascota}${info.nombreMascota ? ` (${info.nombreMascota})` : ''}`);
          if (info.ocupacion) detalles.push(info.ocupacion);
          if (info.motivoPrincipal) detalles.push(`busca ${info.motivoPrincipal}`);
          if (info.atravesandoMomentoDificil) detalles.push('⚠️ momento difícil');
          if (info.mostróDudaEconómica) detalles.push('💰 duda económica');

          return `- **${p.nombre || 'Sin nombre'}** ${p.email ? `(${p.email})` : ''}
  📊 ${p.interacciones || 0} chats | 🌍 ${info.pais || 'Desconocido'}
  ${detalles.length > 0 ? `  📝 ${detalles.join(' | ')}` : ''}`;
        }).join('\n\n');

        return {
          mensaje: `👥 **Perfiles aprendidos por Tito (${perfiles.length}/${perfilesIds.length}):**\n\n${lista}\n\n_Usá "ver conversaciones de [visitorId]" para ver el historial completo._`
        };
      } catch (e) {
        return { mensaje: `❌ Error: ${e.message}` };
      }
    }

    case 'buscar_perfil_tito': {
      const { query } = datos;
      if (!query) {
        return { mensaje: 'Necesito un nombre, email o visitorId para buscar.' };
      }

      try {
        const perfilesIds = await kv.smembers('tito:perfiles:activos') || [];
        const resultados = [];
        const queryLower = query.toLowerCase();

        for (const visitorId of perfilesIds) {
          const perfil = await kv.get(`tito:visitante:${visitorId}`);
          if (!perfil) continue;

          const nombre = (perfil.nombre || '').toLowerCase();
          const email = (perfil.email || '').toLowerCase();

          if (visitorId.includes(queryLower) || nombre.includes(queryLower) || email.includes(queryLower)) {
            resultados.push({ visitorId, ...perfil });
          }
        }

        if (resultados.length === 0) {
          return { mensaje: `No encontré perfiles con "${query}"` };
        }

        const detalle = resultados[0];
        const info = detalle.infoPersonal || {};

        let resumen = `👤 **Perfil de ${detalle.nombre || 'Visitante'}**\n\n`;
        resumen += `📧 Email: ${detalle.email || 'No proporcionado'}\n`;
        resumen += `🔑 ID: ${detalle.visitorId}\n`;
        resumen += `📊 Interacciones: ${detalle.interacciones || 0}\n`;
        resumen += `📅 Última: ${detalle.ultimaInteraccion ? new Date(detalle.ultimaInteraccion).toLocaleString('es-UY') : 'N/A'}\n\n`;

        if (Object.keys(info).length > 0) {
          resumen += `**📝 Lo que sabemos:**\n`;
          if (info.pais) resumen += `- País: ${info.pais}\n`;
          if (info.situacionFamiliar) resumen += `- Situación: ${info.situacionFamiliar}\n`;
          if (info.tieneHijos) resumen += `- Tiene hijos\n`;
          if (info.mascota) resumen += `- Mascota: ${info.mascota}${info.nombreMascota ? ` (${info.nombreMascota})` : ''}\n`;
          if (info.ocupacion) resumen += `- Ocupación: ${info.ocupacion}\n`;
          if (info.motivoPrincipal) resumen += `- Busca: ${info.motivoPrincipal}\n`;
          if (info.interesesEspirituales?.length > 0) resumen += `- Intereses: ${info.interesesEspirituales.join(', ')}\n`;
          if (info.compraParaRegalo) resumen += `- Compra para regalo${info.destinatarioRegalo ? ` (${info.destinatarioRegalo})` : ''}\n`;
          if (info.atravesandoMomentoDificil) resumen += `- ⚠️ Atravesando momento difícil\n`;
          if (info.mostróDudaEconómica) resumen += `- 💰 Mostró duda económica\n`;
        }

        if (detalle.productosVistos?.length > 0) {
          resumen += `\n**👀 Productos vistos:**\n`;
          detalle.productosVistos.slice(0, 5).forEach(p => {
            resumen += `- ${p.nombre}\n`;
          });
        }

        return { mensaje: resumen };
      } catch (e) {
        return { mensaje: `❌ Error: ${e.message}` };
      }
    }

    case 'ver_conversaciones_tito': {
      const { visitorId } = datos;
      if (!visitorId) {
        return { mensaje: 'Necesito el visitorId del perfil.' };
      }

      try {
        const perfil = await kv.get(`tito:visitante:${visitorId}`);
        if (!perfil) {
          return { mensaje: `No encontré el perfil con ID: ${visitorId}` };
        }

        if (!perfil.conversaciones || perfil.conversaciones.length === 0) {
          return { mensaje: `${perfil.nombre || 'Este visitante'} no tiene conversaciones guardadas.` };
        }

        let historial = `💬 **Conversaciones de ${perfil.nombre || 'Visitante'}**\n\n`;

        perfil.conversaciones.slice(-10).forEach(conv => {
          const fecha = new Date(conv.fecha).toLocaleString('es-UY');
          historial += `📅 ${fecha}\n`;
          historial += `👤 **Usuario:** ${conv.usuario}\n`;
          historial += `🤖 **Tito:** ${conv.tito}\n\n---\n\n`;
        });

        return { mensaje: historial };
      } catch (e) {
        return { mensaje: `❌ Error: ${e.message}` };
      }
    }

    case 'perfiles_vulnerables': {
      try {
        const perfilesIds = await kv.smembers('tito:perfiles:activos') || [];
        const vulnerables = [];

        for (const visitorId of perfilesIds) {
          const perfil = await kv.get(`tito:visitante:${visitorId}`);
          if (!perfil) continue;

          const info = perfil.infoPersonal || {};

          // Detectar situaciones sensibles
          if (info.atravesandoMomentoDificil || info.problemasMencionados?.length > 0) {
            vulnerables.push({
              visitorId,
              nombre: perfil.nombre || 'Sin nombre',
              email: perfil.email,
              razon: 'momento difícil',
              detalles: info.problemasMencionados?.[0]?.contexto || 'No hay detalles'
            });
          }
        }

        if (vulnerables.length === 0) {
          return { mensaje: '✅ No hay visitantes que hayan mencionado estar pasando por momentos difíciles.' };
        }

        const lista = vulnerables.map(v =>
          `- **${v.nombre}** ${v.email ? `(${v.email})` : ''}\n  ⚠️ ${v.razon}\n  📝 "${v.detalles.substring(0, 100)}..."`
        ).join('\n\n');

        return {
          mensaje: `⚠️ **Visitantes que necesitan atención especial (${vulnerables.length}):**\n\n${lista}\n\n_Estas personas mencionaron estar pasando por momentos difíciles. Considerá un seguimiento personalizado._`
        };
      } catch (e) {
        return { mensaje: `❌ Error: ${e.message}` };
      }
    }

    default:
      return { mensaje: `Accion "${tipo}" no implementada todavia.` };
  }
}
