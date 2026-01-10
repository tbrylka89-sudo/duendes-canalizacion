import { kv } from '@vercel/kv';

// POST - Guardar entrada del diario/grimorio
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, tipo, contenido, titulo, tags, faseLunar } = body;

    if (!email || !contenido) {
      return Response.json({ success: false, error: 'Email y contenido requeridos' }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();
    const ahora = new Date();

    // Buscar usuario
    let userKey = `user:${emailNorm}`;
    let usuario = await kv.get(userKey);
    if (!usuario) {
      userKey = `elegido:${emailNorm}`;
      usuario = await kv.get(userKey);
    }

    if (!usuario) {
      return Response.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Crear entrada del diario
    const entradaId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const entrada = {
      id: entradaId,
      tipo: tipo || 'reflexion', // reflexion, sueno, gratitud, ritual, intencion, mensaje-guardian
      titulo: titulo || '',
      contenido,
      tags: tags || [],
      faseLunar: faseLunar || calcularFaseLunar(ahora),
      fecha: ahora.toISOString(),
      modificado: ahora.toISOString()
    };

    // Guardar en grimorio:{email}
    const grimorioKey = `grimorio:${emailNorm}`;
    let grimorio = await kv.get(grimorioKey) || { entradas: [], estadisticas: {} };

    grimorio.entradas.unshift(entrada); // Mas reciente primero
    grimorio.ultimaEntrada = ahora.toISOString();

    // Actualizar estadisticas
    if (!grimorio.estadisticas.porTipo) grimorio.estadisticas.porTipo = {};
    grimorio.estadisticas.porTipo[entrada.tipo] = (grimorio.estadisticas.porTipo[entrada.tipo] || 0) + 1;
    grimorio.estadisticas.totalEntradas = grimorio.entradas.length;

    // Mantener solo las ultimas 500 entradas (para no sobrecargar)
    if (grimorio.entradas.length > 500) {
      grimorio.entradas = grimorio.entradas.slice(0, 500);
    }

    await kv.set(grimorioKey, grimorio);

    // Dar 1 runas por escribir (motivar escritura diaria)
    const diasDesdeUltimaRuna = usuario.ultimaRunaDiario
      ? Math.floor((ahora - new Date(usuario.ultimaRunaDiario)) / (24 * 60 * 60 * 1000))
      : 999;

    let runaOtorgada = false;
    if (diasDesdeUltimaRuna >= 1) {
      usuario.runas = (usuario.runas || 0) + 1;
      usuario.ultimaRunaDiario = ahora.toISOString();
      runaOtorgada = true;
      await kv.set(userKey, usuario);
    }

    return Response.json({
      success: true,
      entrada,
      runaOtorgada,
      mensaje: runaOtorgada
        ? 'Entrada guardada! +1 runa por tu practica diaria'
        : 'Entrada guardada en tu grimorio'
    });

  } catch (error) {
    console.error('Error guardando diario:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET - Obtener entradas del diario
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const tipo = searchParams.get('tipo');
    const limite = parseInt(searchParams.get('limite') || '50');

    if (!email) {
      return Response.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();
    const grimorioKey = `grimorio:${emailNorm}`;
    const grimorio = await kv.get(grimorioKey);

    if (!grimorio) {
      return Response.json({
        success: true,
        entradas: [],
        estadisticas: { totalEntradas: 0, porTipo: {} }
      });
    }

    let entradas = grimorio.entradas || [];

    // Filtrar por tipo si se especifica
    if (tipo) {
      entradas = entradas.filter(e => e.tipo === tipo);
    }

    return Response.json({
      success: true,
      entradas: entradas.slice(0, limite),
      estadisticas: grimorio.estadisticas || {},
      faseLunarHoy: calcularFaseLunar(new Date())
    });

  } catch (error) {
    console.error('Error obteniendo diario:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Eliminar entrada
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { email, entradaId } = body;

    if (!email || !entradaId) {
      return Response.json({ success: false, error: 'Email y entradaId requeridos' }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();
    const grimorioKey = `grimorio:${emailNorm}`;
    const grimorio = await kv.get(grimorioKey);

    if (!grimorio || !grimorio.entradas) {
      return Response.json({ success: false, error: 'Entrada no encontrada' }, { status: 404 });
    }

    const indice = grimorio.entradas.findIndex(e => e.id === entradaId);
    if (indice === -1) {
      return Response.json({ success: false, error: 'Entrada no encontrada' }, { status: 404 });
    }

    const entradaEliminada = grimorio.entradas.splice(indice, 1)[0];
    grimorio.estadisticas.totalEntradas = grimorio.entradas.length;
    if (grimorio.estadisticas.porTipo[entradaEliminada.tipo]) {
      grimorio.estadisticas.porTipo[entradaEliminada.tipo]--;
    }

    await kv.set(grimorioKey, grimorio);

    return Response.json({ success: true, mensaje: 'Entrada eliminada' });

  } catch (error) {
    console.error('Error eliminando entrada:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Calcular fase lunar aproximada
function calcularFaseLunar(fecha) {
  const lunarCycle = 29.53059;
  const knownNewMoon = new Date('2024-01-11T11:57:00Z');
  const daysSinceNew = (fecha - knownNewMoon) / (1000 * 60 * 60 * 24);
  const lunarAge = ((daysSinceNew % lunarCycle) + lunarCycle) % lunarCycle;

  if (lunarAge < 1.85) return { fase: 'nueva', emoji: '🌑', nombre: 'Luna Nueva' };
  if (lunarAge < 7.38) return { fase: 'creciente', emoji: '🌒', nombre: 'Luna Creciente' };
  if (lunarAge < 9.23) return { fase: 'cuarto-creciente', emoji: '🌓', nombre: 'Cuarto Creciente' };
  if (lunarAge < 14.77) return { fase: 'gibosa-creciente', emoji: '🌔', nombre: 'Gibosa Creciente' };
  if (lunarAge < 16.61) return { fase: 'llena', emoji: '🌕', nombre: 'Luna Llena' };
  if (lunarAge < 22.15) return { fase: 'gibosa-menguante', emoji: '🌖', nombre: 'Gibosa Menguante' };
  if (lunarAge < 23.99) return { fase: 'cuarto-menguante', emoji: '🌗', nombre: 'Cuarto Menguante' };
  return { fase: 'menguante', emoji: '🌘', nombre: 'Luna Menguante' };
}
