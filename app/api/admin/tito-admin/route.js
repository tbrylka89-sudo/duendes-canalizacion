import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

// ═══════════════════════════════════════════════════════════════════════════════
// TITO ADMIN API: ASISTENTE TODOPODEROSO
// Interpreta comandos en lenguaje natural y ejecuta acciones del sistema
// ═══════════════════════════════════════════════════════════════════════════════

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Funciones disponibles para Tito
const FUNCIONES_DISPONIBLES = `
FUNCIONES QUE PUEDES EJECUTAR:

1. USUARIOS:
   - buscar_usuario(email o nombre): Busca un usuario
   - dar_treboles(email, cantidad): Da tréboles a un usuario
   - dar_runas(email, cantidad): Da runas a un usuario
   - activar_circulo(email, dias): Activa membresía del Círculo
   - listar_clientes(filtro): Lista clientes (recientes, circulo, todos)
   - obtener_stats_usuarios(): Estadísticas de usuarios

2. CONTENIDO:
   - ver_contenido_programado(): Muestra contenido programado
   - ver_contenido_dia(dia, mes, año): Ve contenido de un día específico
   - cambiar_duende_semana(nombre): Cambia el duende de la semana
   - publicar_contenido(dia, mes, año): Publica contenido programado
   - ver_duende_actual(): Muestra el duende de la semana actual

3. PROMOCIONES:
   - crear_promo(titulo, descuento, dias): Crea una promoción
   - crear_promo_relampago(tipo, horas): Crea promo relámpago
   - listar_promos(estado): Lista promociones
   - pausar_promo(id): Pausa una promoción
   - stats_promos(): Estadísticas de promociones
   - clonar_mejor_promo(): Clona la promo más exitosa

4. REPORTES:
   - stats_circulo(): Stats del Círculo (miembros, contenidos, etc)
   - stats_generales(): Estadísticas generales del sistema
   - contenido_popular(): Contenido más popular

5. SISTEMA:
   - verificar_sistema(): Verifica que todo funcione
   - ejecutar_cron(): Ejecuta tareas programadas
`;

const SYSTEM_PROMPT = `Eres Tito Admin, el asistente todopoderoso del panel de administración de Duendes del Uruguay.

REGLAS:
1. Puedes ejecutar CUALQUIER acción en el sistema
2. Respondes en español, de forma clara y confirmando cada acción
3. Si algo no existe, lo creas
4. Si algo falla, lo arreglas
5. Siempre confirmas lo que hiciste con ✓
6. Eres eficiente, no das vueltas
7. Si necesitas más información, pregunta de forma concisa

${FUNCIONES_DISPONIBLES}

FORMATO DE RESPUESTA:
Responde SIEMPRE con JSON válido con esta estructura:
{
  "respuesta": "Tu respuesta al usuario en texto plano",
  "acciones": [
    {"funcion": "nombre_funcion", "parametros": {...}, "descripcion": "Qué hiciste"}
  ],
  "necesitaConfirmacion": false,
  "pregunta": null
}

Si necesitas confirmar algo peligroso (eliminar, etc):
{
  "respuesta": "¿Estás seguro de que querés eliminar X?",
  "necesitaConfirmacion": true,
  "accionPendiente": {...}
}`;

// GET - Historial de acciones
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accion = searchParams.get('accion');

    if (accion === 'historial') {
      const historial = await kv.get('tito-admin:historial') || [];
      return Response.json({
        success: true,
        historial: historial.slice(0, 50)
      });
    }

    return Response.json({
      success: true,
      info: 'Tito Admin API',
      acciones: ['historial']
    });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Procesar comando
export async function POST(request) {
  try {
    const { comando, historialConversacion } = await request.json();

    if (!comando) {
      return Response.json({
        success: false,
        respuesta: 'No recibí ningún comando. ¿Qué necesitás?',
        acciones: []
      });
    }

    // Preparar contexto de conversación
    const mensajesContexto = (historialConversacion || [])
      .filter(m => !m.pensando)
      .slice(-6)
      .map(m => ({
        role: m.tipo === 'usuario' ? 'user' : 'assistant',
        content: m.texto
      }));

    // Agregar el comando actual
    mensajesContexto.push({
      role: 'user',
      content: comando
    });

    // Llamar a Claude para interpretar el comando
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: mensajesContexto
    });

    let respuestaTito;
    try {
      // Intentar parsear como JSON
      const textoRespuesta = response.content[0].text;
      // Buscar JSON en la respuesta
      const jsonMatch = textoRespuesta.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        respuestaTito = JSON.parse(jsonMatch[0]);
      } else {
        // Si no hay JSON, usar la respuesta como texto
        respuestaTito = {
          respuesta: textoRespuesta,
          acciones: []
        };
      }
    } catch (e) {
      respuestaTito = {
        respuesta: response.content[0].text,
        acciones: []
      };
    }

    // Ejecutar las acciones indicadas
    const resultadosAcciones = [];
    for (const accion of (respuestaTito.acciones || [])) {
      try {
        const resultado = await ejecutarAccion(accion.funcion, accion.parametros);
        resultadosAcciones.push({
          ...accion,
          ok: resultado.success,
          resultado: resultado.data || resultado.mensaje
        });
      } catch (err) {
        resultadosAcciones.push({
          ...accion,
          ok: false,
          error: err.message
        });
      }
    }

    // Guardar en historial
    const historial = await kv.get('tito-admin:historial') || [];
    historial.unshift({
      comando,
      respuesta: respuestaTito.respuesta,
      acciones: resultadosAcciones,
      fecha: new Date().toISOString(),
      ok: resultadosAcciones.every(a => a.ok !== false)
    });
    await kv.set('tito-admin:historial', historial.slice(0, 200));

    return Response.json({
      success: true,
      respuesta: respuestaTito.respuesta,
      acciones: resultadosAcciones.map(a => ({
        ok: a.ok,
        descripcion: a.descripcion || a.funcion
      })),
      necesitaConfirmacion: respuestaTito.necesitaConfirmacion
    });

  } catch (error) {
    console.error('[TITO-ADMIN] Error:', error);
    return Response.json({
      success: false,
      respuesta: `Ups, hubo un error: ${error.message}. ¿Intentamos de nuevo?`,
      acciones: []
    }, { status: 500 });
  }
}

// Ejecutar acción específica - OPERACIONES DIRECTAS EN KV
async function ejecutarAccion(funcion, parametros = {}) {
  switch (funcion) {
    // ═══════════════════════════════════════════════════════════════
    // USUARIOS
    // ═══════════════════════════════════════════════════════════════
    case 'buscar_usuario': {
      const { busqueda } = parametros;
      const keys = await kv.keys('usuario:*');
      const resultados = [];

      for (const key of keys.slice(0, 100)) {
        const usuario = await kv.get(key);
        if (usuario && (
          usuario.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
          usuario.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
          usuario.nombrePreferido?.toLowerCase().includes(busqueda.toLowerCase())
        )) {
          resultados.push(usuario);
        }
      }

      return { success: true, data: resultados, total: resultados.length };
    }

    case 'dar_treboles': {
      const { email, cantidad } = parametros;
      const usuario = await kv.get(`usuario:${email}`);
      if (!usuario) {
        return { success: false, mensaje: `Usuario ${email} no encontrado` };
      }
      usuario.treboles = (usuario.treboles || 0) + parseInt(cantidad);
      await kv.set(`usuario:${email}`, usuario);
      return { success: true, mensaje: `Agregados ${cantidad} tréboles. Total: ${usuario.treboles}`, data: usuario };
    }

    case 'dar_runas': {
      const { email, cantidad } = parametros;
      const usuario = await kv.get(`usuario:${email}`);
      if (!usuario) {
        return { success: false, mensaje: `Usuario ${email} no encontrado` };
      }
      usuario.runas = (usuario.runas || 0) + parseInt(cantidad);
      await kv.set(`usuario:${email}`, usuario);
      return { success: true, mensaje: `Agregadas ${cantidad} runas. Total: ${usuario.runas}`, data: usuario };
    }

    case 'activar_circulo': {
      const { email, dias } = parametros;
      const usuario = await kv.get(`usuario:${email}`);
      if (!usuario) {
        return { success: false, mensaje: `Usuario ${email} no encontrado` };
      }

      const fechaFin = new Date();
      fechaFin.setDate(fechaFin.getDate() + (dias || 30));

      usuario.esCirculo = true;
      usuario.circuloHasta = fechaFin.toISOString();
      usuario.circuloActivadoPor = 'tito-admin';

      await kv.set(`usuario:${email}`, usuario);
      return { success: true, mensaje: `Círculo activado hasta ${fechaFin.toLocaleDateString()}`, data: usuario };
    }

    case 'listar_clientes': {
      const keys = await kv.keys('usuario:*');
      const usuarios = [];

      for (const key of keys.slice(0, 50)) {
        const usuario = await kv.get(key);
        if (usuario) {
          usuarios.push({
            email: usuario.email,
            nombre: usuario.nombre || usuario.nombrePreferido,
            treboles: usuario.treboles || 0,
            runas: usuario.runas || 0,
            esCirculo: usuario.esCirculo || false
          });
        }
      }

      return { success: true, data: usuarios, total: usuarios.length };
    }

    case 'obtener_stats_usuarios': {
      const keys = await kv.keys('usuario:*');
      const total = keys.length;
      let circulo = 0;

      for (const key of keys) {
        const u = await kv.get(key);
        if (u?.esCirculo) circulo++;
      }

      return { success: true, data: { totalUsuarios: total, miembrosCirculo: circulo } };
    }

    // ═══════════════════════════════════════════════════════════════
    // CONTENIDO
    // ═══════════════════════════════════════════════════════════════
    case 'ver_contenido_programado': {
      const hoy = new Date();
      const mes = hoy.getMonth() + 1;
      const año = hoy.getFullYear();
      const contenidos = [];

      for (let dia = 1; dia <= 31; dia++) {
        const c = await kv.get(`circulo:contenido:${año}:${mes}:${dia}`);
        if (c && c.estado === 'programado') {
          contenidos.push({ dia, titulo: c.titulo, tipo: c.tipo });
        }
      }

      return { success: true, data: contenidos };
    }

    case 'ver_contenido_dia': {
      const { dia, mes, año } = parametros;
      const contenido = await kv.get(`circulo:contenido:${año}:${mes}:${dia}`);
      return { success: !!contenido, data: contenido };
    }

    case 'cambiar_duende_semana': {
      const { nombre, datos } = parametros;
      await kv.set('duende-semana-actual', {
        nombre,
        ...datos,
        seleccionadoEn: new Date().toISOString()
      });
      return { success: true, mensaje: `Duende de la semana cambiado a ${nombre}` };
    }

    case 'publicar_contenido': {
      const { dia, mes, año } = parametros;
      const key = `circulo:contenido:${año}:${mes}:${dia}`;
      const contenido = await kv.get(key);

      if (!contenido) {
        return { success: false, mensaje: 'Contenido no encontrado' };
      }

      contenido.estado = 'publicado';
      contenido.publicadoEn = new Date().toISOString();
      await kv.set(key, contenido);

      return { success: true, mensaje: `Publicado: ${contenido.titulo}` };
    }

    case 'ver_duende_actual': {
      const duende = await kv.get('duende-semana-actual');
      return { success: true, data: duende };
    }

    // ═══════════════════════════════════════════════════════════════
    // PROMOCIONES
    // ═══════════════════════════════════════════════════════════════
    case 'crear_promo': {
      const { titulo, descuento, dias, descripcion } = parametros;
      const fechaFin = new Date();
      fechaFin.setDate(fechaFin.getDate() + (dias || 7));

      const id = `promo_${Date.now()}`;
      const promo = {
        id,
        tituloInterno: titulo || 'Promoción Tito',
        tituloVisible: titulo || 'Oferta Especial',
        descripcion: descripcion || `${descuento}% de descuento`,
        descuento: descuento || 10,
        tipoDescuento: 'porcentaje',
        cupon: `TITO${Date.now().toString().slice(-6)}`,
        estado: 'activa',
        fechaInicio: new Date().toISOString(),
        fechaFin: fechaFin.toISOString(),
        prioridad: 'alta',
        stats: { vistas: 0, clicks: 0 },
        creadaEn: new Date().toISOString(),
        creadaPor: 'tito-admin'
      };

      await kv.set(`promociones:${id}`, promo);
      return { success: true, mensaje: `Promo creada: ${promo.tituloVisible} (${promo.cupon})`, data: promo };
    }

    case 'crear_promo_relampago': {
      const { tipo, horas } = parametros;
      const descuentos = { '10': 10, '15': 15, '20': 20, '25': 25 };
      const descuento = descuentos[tipo] || parseInt(tipo) || 15;
      const duracion = horas || 24;

      const fechaFin = new Date();
      fechaFin.setHours(fechaFin.getHours() + duracion);

      const id = `promo_${Date.now()}`;
      const promo = {
        id,
        tituloInterno: `Relámpago ${descuento}% - ${duracion}h`,
        tituloVisible: `⚡ OFERTA RELÁMPAGO: ${descuento}% OFF`,
        descripcion: `Solo por ${duracion} horas`,
        descuento,
        tipoDescuento: 'porcentaje',
        cupon: `RELAMPAGO${Date.now().toString().slice(-4)}`,
        estado: 'activa',
        fechaInicio: new Date().toISOString(),
        fechaFin: fechaFin.toISOString(),
        prioridad: 'alta',
        esRelampago: true,
        stats: { vistas: 0, clicks: 0 },
        creadaEn: new Date().toISOString(),
        creadaPor: 'tito-admin'
      };

      await kv.set(`promociones:${id}`, promo);
      return { success: true, mensaje: `Promo relámpago creada: ${descuento}% por ${duracion}h (${promo.cupon})`, data: promo };
    }

    case 'listar_promos': {
      const keys = await kv.keys('promociones:promo_*');
      const promos = [];

      for (const key of keys) {
        const p = await kv.get(key);
        if (p) promos.push({ id: p.id, titulo: p.tituloInterno, estado: p.estado, descuento: p.descuento, cupon: p.cupon });
      }

      return { success: true, data: promos, total: promos.length };
    }

    case 'pausar_promo': {
      const { id } = parametros;
      const promo = await kv.get(`promociones:${id}`);
      if (!promo) return { success: false, mensaje: 'Promo no encontrada' };

      promo.estado = 'pausada';
      await kv.set(`promociones:${id}`, promo);
      return { success: true, mensaje: `Promo pausada: ${promo.tituloInterno}` };
    }

    case 'stats_promos': {
      const keys = await kv.keys('promociones:promo_*');
      let activas = 0, pausadas = 0, totalClicks = 0;

      for (const key of keys) {
        const p = await kv.get(key);
        if (p?.estado === 'activa') activas++;
        if (p?.estado === 'pausada') pausadas++;
        totalClicks += p?.stats?.clicks || 0;
      }

      return { success: true, data: { total: keys.length, activas, pausadas, totalClicks } };
    }

    case 'clonar_mejor_promo': {
      const keys = await kv.keys('promociones:promo_*');
      let mejor = null, mejorCTR = 0;

      for (const key of keys) {
        const p = await kv.get(key);
        if (p?.stats?.vistas > 10) {
          const ctr = p.stats.clicks / p.stats.vistas;
          if (ctr > mejorCTR) { mejorCTR = ctr; mejor = p; }
        }
      }

      if (!mejor) return { success: false, mensaje: 'No hay promos con suficientes datos' };

      const id = `promo_${Date.now()}`;
      const clon = { ...mejor, id, tituloInterno: `${mejor.tituloInterno} (copia)`, stats: { vistas: 0, clicks: 0 }, creadaEn: new Date().toISOString() };
      await kv.set(`promociones:${id}`, clon);

      return { success: true, mensaje: `Clonada: ${mejor.tituloInterno} (CTR: ${(mejorCTR*100).toFixed(1)}%)` };
    }

    // ═══════════════════════════════════════════════════════════════
    // REPORTES
    // ═══════════════════════════════════════════════════════════════
    case 'stats_circulo': {
      const miembros = await kv.keys('usuario:*');
      let activos = 0;

      for (const key of miembros) {
        const u = await kv.get(key);
        if (u?.esCirculo) activos++;
      }

      const hoy = new Date();
      let publicados = 0, programados = 0;

      for (let dia = 1; dia <= 31; dia++) {
        const c = await kv.get(`circulo:contenido:${hoy.getFullYear()}:${hoy.getMonth()+1}:${dia}`);
        if (c?.estado === 'publicado') publicados++;
        if (c?.estado === 'programado') programados++;
      }

      return {
        success: true,
        data: { totalUsuarios: miembros.length, miembrosCirculo: activos, contenidosPublicados: publicados, contenidosProgramados: programados }
      };
    }

    case 'stats_generales': {
      const usuarios = await kv.keys('usuario:*');
      const promos = await kv.keys('promociones:promo_*');

      return { success: true, data: { totalUsuarios: usuarios.length, totalPromos: promos.length } };
    }

    case 'contenido_popular': {
      const hoy = new Date();
      const contenidos = [];

      for (let dia = 1; dia <= 31; dia++) {
        const c = await kv.get(`circulo:contenido:${hoy.getFullYear()}:${hoy.getMonth()+1}:${dia}`);
        if (c?.reacciones?.likes > 0) {
          contenidos.push({ dia, titulo: c.titulo, likes: c.reacciones.likes });
        }
      }

      contenidos.sort((a, b) => b.likes - a.likes);
      return { success: true, data: contenidos.slice(0, 5) };
    }

    // ═══════════════════════════════════════════════════════════════
    // SISTEMA
    // ═══════════════════════════════════════════════════════════════
    case 'verificar_sistema': {
      const checks = [];

      try {
        await kv.set('tito:test', Date.now());
        await kv.del('tito:test');
        checks.push({ nombre: 'Vercel KV', ok: true });
      } catch (e) {
        checks.push({ nombre: 'Vercel KV', ok: false, error: e.message });
      }

      const usuarios = await kv.keys('usuario:*');
      checks.push({ nombre: 'Usuarios en DB', ok: true, cantidad: usuarios.length });

      return { success: checks.every(c => c.ok), data: checks };
    }

    case 'ejecutar_cron': {
      const hoy = new Date();
      const key = `circulo:contenido:${hoy.getFullYear()}:${hoy.getMonth()+1}:${hoy.getDate()}`;
      const contenido = await kv.get(key);

      if (contenido?.estado === 'programado') {
        contenido.estado = 'publicado';
        contenido.publicadoEn = new Date().toISOString();
        await kv.set(key, contenido);
        return { success: true, mensaje: `Publicado: ${contenido.titulo}` };
      }

      return { success: true, mensaje: 'No hay contenido programado para publicar hoy' };
    }

    default:
      return { success: false, mensaje: `Función desconocida: ${funcion}` };
  }
}
