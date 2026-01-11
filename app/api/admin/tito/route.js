import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const WP_URL = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';

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

### CREATIVIDAD (IA)
19. GENERAR IMAGEN: {"accion": "generar_imagen", "datos": {"prompt": "descripcion de la imagen", "estilo": "magico|duende|watercolor|realista|natural"}}
20. GENERAR VOZ: {"accion": "generar_voz", "datos": {"texto": "texto a convertir en audio", "voz": "thibisay|thibisay-rapido|duende|bella|rachel"}}

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

## REGLAS DE ORO

1. Si no necesitas ejecutar accion, responde directo con los datos que ya tenes
2. Si falta un email, pregunta cual es antes de actuar
3. Siempre confirma lo que hiciste
4. Se conciso pero completo
5. Podes dar opiniones y sugerencias proactivas
6. Si ves algo raro (circulo por vencer, cliente inactivo), mencionalo

## ESTILO DE RESPUESTA

- Usa markdown para formatear (negritas, listas)
- Datos concretos, nada de relleno
- Emojis con moderacion
- Personalidad: profesional pero cercano
- Cuando das buenas noticias, celebralas
- Cuando hay problemas, propon soluciones`;

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
    const jsonMatch = respuesta.match(/\{[\s\S]*?"accion"[\s\S]*?\}/);
    if (jsonMatch) {
      try {
        const accion = JSON.parse(jsonMatch[0]);
        const resultado = await ejecutarAccion(accion);

        // Reemplazar JSON con resultado
        respuesta = respuesta.replace(jsonMatch[0], '').trim();
        respuesta = resultado.mensaje + (respuesta ? `\n\n${respuesta}` : '');
      } catch (e) {
        respuesta += `\n\nError al ejecutar: ${e.message}`;
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
        const WOO_URL = process.env.WORDPRESS_URL || process.env.WOO_URL || 'https://duendesuy.10web.cloud';
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
        // Voces personalizadas de Thibisay (Duendes del Uruguay)
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
          return { mensaje: `❌ Error de Eleven Labs: ${res.status}` };
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

    default:
      return { mensaje: `Accion "${tipo}" no implementada todavia.` };
  }
}
