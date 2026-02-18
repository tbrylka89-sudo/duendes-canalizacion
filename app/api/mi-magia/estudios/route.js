import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import { getEstudio, ESTUDIOS, CATEGORIAS } from '@/lib/estudios/catalogo';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// GET: Obtener catálogo de estudios o historial del usuario
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const accion = searchParams.get('accion');
  const token = searchParams.get('token');

  // Catálogo público
  if (accion === 'catalogo') {
    const catalogo = Object.values(ESTUDIOS).map(e => ({
      id: e.id,
      nombre: e.nombre,
      descripcion: e.descripcion,
      runas: e.runas,
      categoria: e.categoria,
      icono: e.icono,
      duracion: e.duracion,
      requierePregunta: e.requierePregunta || false,
      requiereFechaNacimiento: e.requiereFechaNacimiento || false,
      requiereHoraNacimiento: e.requiereHoraNacimiento || false,
      limiteDiario: e.limiteDiario || null
    }));

    return Response.json({
      success: true,
      estudios: catalogo,
      categorias: CATEGORIAS
    });
  }

  // Historial del usuario (requiere auth)
  if (accion === 'historial') {
    if (!token) {
      return Response.json({ success: false, error: 'Token requerido' }, { status: 401 });
    }

    const tokenData = await kv.get(`token:${token}`);
    if (!tokenData) {
      return Response.json({ success: false, error: 'Token inválido' }, { status: 401 });
    }

    const historial = await kv.get(`estudios:historial:${tokenData.email}`) || [];

    return Response.json({
      success: true,
      historial: historial.slice(0, 50) // Últimos 50
    });
  }

  // Ver un estudio específico del historial
  if (accion === 'ver') {
    const estudioId = searchParams.get('id');
    if (!token || !estudioId) {
      return Response.json({ success: false, error: 'Token y ID requeridos' }, { status: 400 });
    }

    const tokenData = await kv.get(`token:${token}`);
    if (!tokenData) {
      return Response.json({ success: false, error: 'Token inválido' }, { status: 401 });
    }

    const estudio = await kv.get(`estudio:${tokenData.email}:${estudioId}`);
    if (!estudio) {
      return Response.json({ success: false, error: 'Estudio no encontrado' }, { status: 404 });
    }

    return Response.json({ success: true, estudio });
  }

  return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });
}

// POST: Generar un nuevo estudio
export async function POST(request) {
  try {
    const body = await request.json();
    const { token, estudioId, datos = {} } = body;

    // 1. Validar token
    if (!token) {
      return Response.json({ success: false, error: 'Necesitás iniciar sesión' }, { status: 401 });
    }

    const tokenData = await kv.get(`token:${token}`);
    if (!tokenData) {
      return Response.json({ success: false, error: 'Sesión expirada. Volvé a entrar.' }, { status: 401 });
    }

    // 2. Validar estudio existe
    const estudioConfig = getEstudio(estudioId);
    if (!estudioConfig) {
      return Response.json({ success: false, error: 'Estudio no encontrado' }, { status: 404 });
    }

    // 3. Obtener datos del usuario
    const usuario = await kv.get(`elegido:${tokenData.email}`);
    if (!usuario) {
      return Response.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    // 4. Verificar runas suficientes
    const runasActuales = usuario.runas || 0;
    const costo = estudioConfig.runas;

    if (runasActuales < costo) {
      return Response.json({
        success: false,
        error: `Necesitás ${costo} runas. Tenés ${runasActuales}.`,
        runasNecesarias: costo,
        runasActuales: runasActuales
      }, { status: 400 });
    }

    // 5. Validar campos requeridos
    if (estudioConfig.requierePregunta && !datos.pregunta?.trim()) {
      return Response.json({ success: false, error: 'Este estudio requiere una pregunta' }, { status: 400 });
    }

    if (estudioConfig.requiereFechaNacimiento && !datos.fechaNacimiento) {
      return Response.json({ success: false, error: 'Este estudio requiere tu fecha de nacimiento' }, { status: 400 });
    }

    // 6. Verificar límite diario si aplica
    if (estudioConfig.limiteDiario) {
      const hoy = new Date().toISOString().split('T')[0];
      const keyLimite = `estudio:limite:${tokenData.email}:${estudioId}:${hoy}`;
      const usosHoy = await kv.get(keyLimite) || 0;

      if (usosHoy >= estudioConfig.limiteDiario) {
        return Response.json({
          success: false,
          error: `Solo podés hacer ${estudioConfig.limiteDiario} "${estudioConfig.nombre}" por día`
        }, { status: 400 });
      }
    }

    // 7. DESCONTAR RUNAS ANTES de generar (para evitar abusos)
    const nuevasRunas = runasActuales - costo;
    await kv.set(`elegido:${tokenData.email}`, {
      ...usuario,
      runas: nuevasRunas
    });

    console.log(`[estudios] Descontadas ${costo} runas a ${tokenData.email}. Antes: ${runasActuales}, Ahora: ${nuevasRunas}`);

    // 8. Preparar datos para el prompt
    const datosPrompt = {
      nombre: usuario.nombre || tokenData.email.split('@')[0],
      ...datos
    };

    // 9. Generar con Claude
    let contenido;
    try {
      const prompt = estudioConfig.prompt(datosPrompt);

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      contenido = response.content[0].text;

    } catch (aiError) {
      // ERROR DE IA: Devolver runas
      console.error('[estudios] Error de Claude:', aiError);

      await kv.set(`elegido:${tokenData.email}`, {
        ...usuario,
        runas: runasActuales // Restaurar runas originales
      });

      return Response.json({
        success: false,
        error: 'Hubo un problema generando tu estudio. Tus runas fueron devueltas.',
        devuelto: true
      }, { status: 500 });
    }

    // 10. Guardar estudio generado
    const estudioGenerado = {
      id: `${estudioId}-${Date.now()}`,
      tipo: estudioId,
      nombre: estudioConfig.nombre,
      icono: estudioConfig.icono,
      contenido: contenido,
      datos: {
        pregunta: datos.pregunta || null,
        fechaNacimiento: datos.fechaNacimiento || null
      },
      runasCosto: costo,
      fechaGenerado: new Date().toISOString()
    };

    // Guardar el estudio completo
    await kv.set(
      `estudio:${tokenData.email}:${estudioGenerado.id}`,
      estudioGenerado,
      { ex: 365 * 24 * 60 * 60 } // 1 año
    );

    // Actualizar historial
    const historial = await kv.get(`estudios:historial:${tokenData.email}`) || [];
    historial.unshift({
      id: estudioGenerado.id,
      tipo: estudioId,
      nombre: estudioConfig.nombre,
      icono: estudioConfig.icono,
      fecha: estudioGenerado.fechaGenerado,
      preview: contenido.substring(0, 100) + '...'
    });

    await kv.set(
      `estudios:historial:${tokenData.email}`,
      historial.slice(0, 100), // Máximo 100 en historial
      { ex: 365 * 24 * 60 * 60 }
    );

    // Actualizar límite diario si aplica
    if (estudioConfig.limiteDiario) {
      const hoy = new Date().toISOString().split('T')[0];
      const keyLimite = `estudio:limite:${tokenData.email}:${estudioId}:${hoy}`;
      const usosHoy = await kv.get(keyLimite) || 0;
      await kv.set(keyLimite, usosHoy + 1, { ex: 24 * 60 * 60 }); // Expira en 24h
    }

    // 11. Respuesta exitosa
    console.log(`[estudios] "${estudioConfig.nombre}" generado para ${tokenData.email}`);

    return Response.json({
      success: true,
      estudio: estudioGenerado,
      runasRestantes: nuevasRunas
    });

  } catch (error) {
    console.error('[estudios] Error general:', error);
    return Response.json({
      success: false,
      error: 'Error inesperado. Intentá de nuevo.'
    }, { status: 500 });
  }
}
