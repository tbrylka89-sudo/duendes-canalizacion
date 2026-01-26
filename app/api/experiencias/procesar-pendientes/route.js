import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import canon from '@/lib/canon.json';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// POST - Procesar lecturas pendientes de un usuario
export async function POST(request) {
  try {
    const { email, token } = await request.json();

    // Obtener email desde token si se proporciona
    let userEmail = email;
    if (token && !email) {
      const tokenData = await kv.get(`token:${token}`);
      if (!tokenData) {
        return Response.json({
          success: false,
          error: 'Token inválido'
        }, { status: 401, headers: CORS_HEADERS });
      }
      userEmail = typeof tokenData === 'string' ? tokenData : tokenData.email;
    }

    if (!userEmail) {
      return Response.json({
        success: false,
        error: 'Email o token requerido'
      }, { status: 400, headers: CORS_HEADERS });
    }

    const emailNorm = userEmail.toLowerCase().trim();

    // Obtener historial del usuario
    const historial = await kv.get(`historial:${emailNorm}`) || [];

    // Filtrar lecturas en estado 'procesando'
    const pendientes = historial.filter(h => h.estado === 'procesando');

    if (pendientes.length === 0) {
      return Response.json({
        success: true,
        mensaje: 'No hay lecturas pendientes',
        procesadas: 0
      }, { headers: CORS_HEADERS });
    }

    let procesadas = 0;
    let errores = [];

    for (const lectura of pendientes) {
      try {
        // Obtener la solicitud completa
        const solicitud = await kv.get(`experiencia:${lectura.id}`);
        if (!solicitud) {
          errores.push({ id: lectura.id, error: 'Solicitud no encontrada' });
          continue;
        }

        // Si ya tiene resultado, solo actualizar el historial
        if (solicitud.resultado) {
          const indexHistorial = historial.findIndex(h => h.id === lectura.id);
          if (indexHistorial !== -1) {
            historial[indexHistorial].estado = 'completado';
            historial[indexHistorial].contenido = solicitud.resultado?.contenido || null;
          }
          procesadas++;
          continue;
        }

        // Generar contenido con IA
        const experiencia = {
          nombre: solicitud.experienciaNombre,
          palabras: solicitud.palabrasMinimas || 1000,
          generaIA: true
        };

        const resultado = await generarExperienciaIA(solicitud, experiencia);

        // Actualizar solicitud
        solicitud.estado = 'listo';
        solicitud.resultado = resultado;
        solicitud.fechaCompletado = new Date().toISOString();
        await kv.set(`experiencia:${lectura.id}`, solicitud);

        // Actualizar historial
        const indexHistorial = historial.findIndex(h => h.id === lectura.id);
        if (indexHistorial !== -1) {
          historial[indexHistorial].estado = 'completado';
          historial[indexHistorial].contenido = resultado?.contenido || null;
        }

        // Actualizar lectura individual
        await kv.set(`lectura:${lectura.id}`, {
          id: lectura.id,
          lecturaId: solicitud.experienciaId,
          nombre: solicitud.experienciaNombre,
          icono: lectura.icono || '✨',
          categoria: lectura.categoria || 'otros',
          email: emailNorm,
          runas: solicitud.runasGastadas,
          fecha: solicitud.fechaSolicitud,
          estado: 'completado',
          contenido: resultado?.contenido || null,
          resultado: resultado
        });

        procesadas++;
      } catch (err) {
        console.error(`Error procesando ${lectura.id}:`, err);
        errores.push({ id: lectura.id, error: err.message });
      }
    }

    // Guardar historial actualizado
    await kv.set(`historial:${emailNorm}`, historial);

    return Response.json({
      success: true,
      mensaje: `Procesadas ${procesadas} de ${pendientes.length} lecturas`,
      procesadas,
      total: pendientes.length,
      errores: errores.length > 0 ? errores : undefined
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error procesando pendientes:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}

// Generador de experiencias con IA (simplificado)
async function generarExperienciaIA(solicitud, experiencia) {
  const {
    experienciaId,
    nombreUsuario,
    elemento,
    guardianes,
    contexto,
    preguntaEspecifica,
    fechaNacimiento,
    pronombre,
    datosAdicionales
  } = solicitud;

  const systemPrompt = `Sos un canalizador de Duendes del Uruguay.
Creás experiencias mágicas personalizadas con profundidad y calidez.
Usás español rioplatense (vos, tenés, podés).
Pronombre del usuario: ${pronombre || 'ella'}.

CONTEXTO DEL UNIVERSO DUENDES:
${JSON.stringify({
  tono: canon.tono_comunicacion,
  elementos: canon.elementos
}, null, 2)}

REGLAS CRÍTICAS:
- Mínimo ${experiencia.palabras || 1000} palabras (OBLIGATORIO)
- Español rioplatense natural (vos, tenés, podés)
- Profundo, significativo y personalizado
- Firmá siempre como parte de la familia Duendes del Uruguay`;

  const userPrompt = `Creá una ${experiencia.nombre || solicitud.experienciaNombre} para ${nombreUsuario}.
${elemento ? `Elemento: ${elemento}` : ''}
${guardianes?.length > 0 ? `Guardianes: ${guardianes.map(g => g?.nombre || g).join(', ')}` : ''}
${contexto ? `Contexto: ${contexto}` : ''}
${preguntaEspecifica ? `Pregunta: ${preguntaEspecifica}` : ''}
${fechaNacimiento ? `Fecha de nacimiento: ${fechaNacimiento}` : ''}
${datosAdicionales ? `Datos adicionales: ${JSON.stringify(datosAdicionales)}` : ''}

Creá un contenido profundo, personal y mágico de mínimo ${experiencia.palabras || 1000} palabras.
Que sea útil, sanador y memorable para quien lo recibe.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  });

  const contenido = response.content[0]?.text || '';
  const palabras = contenido.split(/\s+/).length;

  return {
    titulo: experiencia.nombre || solicitud.experienciaNombre,
    contenido,
    palabras,
    fechaGeneracion: new Date().toISOString()
  };
}
