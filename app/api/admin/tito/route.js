import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// POST - Chat con Tito
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
    let stats = { clientesTotal: 0, miembrosCirculo: 0 };
    const usuarios = [];
    try {
      const userKeys = await kv.keys('user:*');
      stats.clientesTotal = userKeys.length;

      for (const k of userKeys.slice(0, 100)) {
        const u = await kv.get(k);
        if (u) {
          if (u.esCirculo) stats.miembrosCirculo++;
          usuarios.push({
            email: u.email,
            nombre: u.nombre || 'Sin nombre',
            runas: u.runas || 0,
            treboles: u.treboles || 0,
            esCirculo: u.esCirculo || false,
            gastado: u.gastado || 0
          });
        }
      }
    } catch (e) {}

    // System prompt mejorado
    const systemPrompt = `Sos Tito, el asistente administrativo de Duendes del Uruguay - una tienda de productos magicos artesanales.

PERSONALIDAD:
- Hablas en espanol rioplatense (vos, tenes, podes)
- Sos eficiente, amable y un poco magico
- Usas lenguaje simple y directo
- Podes usar emojis ocasionalmente

CONTEXTO ACTUAL:
- Total de clientes: ${stats.clientesTotal}
- Miembros del Circulo: ${stats.miembrosCirculo}

USUARIOS RECIENTES:
${usuarios.slice(0, 15).map(u => `- ${u.nombre} (${u.email}): ᚱ${u.runas} ☘${u.treboles} ${u.esCirculo ? '★' : ''}`).join('\n')}

CAPACIDADES Y FORMATO DE ACCIONES:
Cuando necesites ejecutar una accion, responde SOLO con el JSON (sin texto adicional antes):

1. BUSCAR CLIENTE:
{"accion": "buscar_cliente", "datos": {"query": "email o nombre"}}

2. DAR RUNAS:
{"accion": "dar_regalo", "datos": {"email": "email@ejemplo.com", "tipoRegalo": "runas", "cantidad": 20}}

3. DAR TREBOLES:
{"accion": "dar_regalo", "datos": {"email": "email@ejemplo.com", "tipoRegalo": "treboles", "cantidad": 50}}

4. ACTIVAR CIRCULO:
{"accion": "gestionar_circulo", "datos": {"email": "email@ejemplo.com", "accionCirculo": "activar"}}

5. EXTENDER CIRCULO:
{"accion": "gestionar_circulo", "datos": {"email": "email@ejemplo.com", "accionCirculo": "extender", "dias": 30}}

6. DESACTIVAR CIRCULO:
{"accion": "gestionar_circulo", "datos": {"email": "email@ejemplo.com", "accionCirculo": "desactivar"}}

7. VER ESTADISTICAS:
{"accion": "ver_stats"}

8. GENERAR CONTENIDO:
{"accion": "generar_contenido", "datos": {"categoria": "cosmos|duendes|diy|esoterico|sanacion|celebraciones", "tipo": "articulo|guia|ritual|meditacion", "tema": "descripcion del tema"}}

9. VER PRODUCTOS:
{"accion": "ver_productos", "datos": {"filtro": "opcional - nombre o categoria"}}

10. DESTACAR PRODUCTO:
{"accion": "destacar_producto", "datos": {"productoId": "id_del_producto", "destacado": true}}

11. VER ACTIVIDAD RECIENTE:
{"accion": "ver_actividad"}

12. CREAR NOTA PARA CLIENTE:
{"accion": "crear_nota", "datos": {"email": "email@ejemplo.com", "nota": "texto de la nota"}}

EJEMPLOS DE USO:
- "Busca a maria" -> buscar_cliente
- "Dale 20 runas a juan@mail.com" -> dar_regalo con runas
- "Extiende el circulo de ana@mail.com 30 dias" -> gestionar_circulo extender
- "Cuantos miembros del circulo hay?" -> responde conversacionalmente con los datos
- "Mostrame las estadisticas" -> ver_stats
- "Genera un articulo sobre cristales para sanacion" -> generar_contenido

SI NO NECESITAS EJECUTAR ACCION:
Simplemente responde de forma conversacional usando la informacion que tenes.

IMPORTANTE:
- Si te piden algo que requiere un email y no lo tenes, pregunta cual es
- Siempre confirma el resultado de las acciones
- Se conciso pero completo`;

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

    default:
      return { mensaje: `Accion "${tipo}" no implementada todavia.` };
  }
}
