import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Calcular fase lunar aproximada
function calcularFaseLunar() {
  const hoy = new Date();
  const lunaLlena = new Date('2000-01-21'); // Luna llena de referencia
  const cicloLunar = 29.53059; // Días del ciclo lunar

  const diasDesde = (hoy - lunaLlena) / (1000 * 60 * 60 * 24);
  const faseDias = diasDesde % cicloLunar;

  if (faseDias < 1.85) return 'luna llena';
  if (faseDias < 7.38) return 'luna menguante';
  if (faseDias < 9.23) return 'cuarto menguante';
  if (faseDias < 14.77) return 'luna menguante';
  if (faseDias < 16.61) return 'luna nueva';
  if (faseDias < 22.15) return 'luna creciente';
  if (faseDias < 23.99) return 'cuarto creciente';
  return 'luna creciente';
}

// Formatear fecha en español
function formatearFechaEspanol(fecha) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  const d = new Date(fecha);
  return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}`;
}

// Formatear fecha de adopción
function formatearFechaAdopcion(fecha) {
  if (!fecha) return 'hace un tiempo';

  const adopcion = new Date(fecha);
  const hoy = new Date();
  const diffMeses = Math.floor((hoy - adopcion) / (1000 * 60 * 60 * 24 * 30));

  if (diffMeses < 1) return 'hace poco';
  if (diffMeses === 1) return 'hace 1 mes';
  if (diffMeses < 12) return `hace ${diffMeses} meses`;

  const diffAnios = Math.floor(diffMeses / 12);
  if (diffAnios === 1) return 'hace 1 año';
  return `hace ${diffAnios} años`;
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return Response.json({
        success: false,
        error: 'Token requerido'
      }, { status: 400, headers: CORS_HEADERS });
    }

    // Obtener datos del token
    const tokenData = await kv.get(`token:${token}`);
    if (!tokenData || !tokenData.email) {
      return Response.json({
        success: false,
        error: 'Token inválido'
      }, { status: 401, headers: CORS_HEADERS });
    }

    const email = tokenData.email.toLowerCase();

    // Obtener datos del elegido
    const elegido = await kv.get(`elegido:${email}`) || {};

    // Verificar si tiene guardianes
    const guardianes = elegido.guardianes || [];
    if (guardianes.length === 0) {
      return Response.json({
        success: true,
        mensaje: null,
        razon: 'sin_guardian'
      }, { headers: CORS_HEADERS });
    }

    const guardianPrincipal = guardianes[0];
    const hoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Verificar caché del día
    const cacheKey = `mensaje-diario:${email}:${hoy}`;
    const mensajeCacheado = await kv.get(cacheKey);

    if (mensajeCacheado) {
      return Response.json({
        success: true,
        mensaje: mensajeCacheado.mensaje,
        guardianNombre: guardianPrincipal.nombre,
        fechaFormateada: formatearFechaEspanol(new Date()),
        desdeCacheo: true
      }, { headers: CORS_HEADERS });
    }

    // Generar mensaje con Claude
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const nombrePreferido = elegido.nombrePreferido || elegido.nombre || 'amiga';
    const signoZodiacal = elegido.signoZodiacal || 'un signo misterioso';
    const queBusca = Array.isArray(elegido.queBusca) ? elegido.queBusca.join(', ') : (elegido.queBusca || 'paz y claridad');
    const momentoVida = elegido.momentoVida || 'un momento de transformación';
    const pronombre = elegido.pronombre || 'ella';
    const faseLunar = calcularFaseLunar();
    const fechaAdopcion = formatearFechaAdopcion(guardianPrincipal.fecha);

    const prompt = `Sos ${guardianPrincipal.nombre}, un ser mágico que acompaña a ${nombrePreferido} desde ${fechaAdopcion}.

Sobre ${nombrePreferido}:
- Signo zodiacal: ${signoZodiacal}
- Lo que busca: ${queBusca}
- Momento de vida: ${momentoVida}
- Pronombre: ${pronombre}

Hoy es ${formatearFechaEspanol(new Date())} y la fase lunar es ${faseLunar}.

Escribí un mensaje breve (máximo 4 oraciones) como si fueras ${guardianPrincipal.nombre} hablándole directamente a ${nombrePreferido}. El mensaje debe:
- Ser cálido, íntimo, como de guardián a humano
- Conectar con lo que busca o su momento de vida
- Incluir una pequeña guía o intención para el día de hoy
- Usar "vos" (no "tú")
- No mencionar que sos una IA
- Sonar como algo canalizado, no como algo generado

Respondé SOLO con el mensaje, sin comillas, sin título, sin explicaciones.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    });

    const mensajeGenerado = response.content[0].text.trim();

    // Cachear el mensaje por 24 horas
    await kv.set(cacheKey, {
      mensaje: mensajeGenerado,
      generadoEn: new Date().toISOString()
    }, { ex: 86400 }); // 24 horas

    return Response.json({
      success: true,
      mensaje: mensajeGenerado,
      guardianNombre: guardianPrincipal.nombre,
      fechaFormateada: formatearFechaEspanol(new Date()),
      desdeCacheo: false
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error generando mensaje diario:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}
