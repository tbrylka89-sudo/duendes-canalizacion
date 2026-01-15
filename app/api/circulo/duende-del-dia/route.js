import { kv } from '@vercel/kv';
import { generarPerfilGuardian } from '@/lib/circulo/voces-guardianes';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// DUENDE DEL DÍA
// Selecciona un guardián random y genera su mensaje de bienvenida
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const forzar = url.searchParams.get('forzar') === '1';
    const hoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Verificar si ya hay duende del día (a menos que se fuerce regenerar)
    if (!forzar) {
      const duendeGuardado = await kv.get(`circulo:duende-dia:${hoy}`);
      if (duendeGuardado) {
        return Response.json({
          success: true,
          cached: true,
          ...duendeGuardado
        });
      }
    }

    // Obtener catálogo de guardianes
    const catalogo = await kv.get('productos:catalogo') || [];

    if (catalogo.length === 0) {
      return Response.json({
        success: false,
        error: 'No hay guardianes en el catálogo'
      }, { status: 404 });
    }

    // Filtrar solo guardianes con imagen y que estén publicados
    const guardianesValidos = catalogo.filter(p =>
      p.imagen &&
      p.estado === 'publish' &&
      p.stockStatus !== 'outofstock'
    );

    if (guardianesValidos.length === 0) {
      return Response.json({
        success: false,
        error: 'No hay guardianes válidos disponibles'
      }, { status: 404 });
    }

    // Selección pseudo-aleatoria basada en la fecha (mismo guardián todo el día)
    const seed = hashFecha(hoy);
    const indice = seed % guardianesValidos.length;
    const productoSeleccionado = guardianesValidos[indice];

    // Generar perfil enriquecido
    const guardian = generarPerfilGuardian(productoSeleccionado);

    // Generar mensaje del día con Claude
    const mensaje = await generarMensajeDelDia(guardian);

    // Construir respuesta
    const duendeDelDia = {
      fecha: hoy,
      guardian: {
        id: guardian.id,
        nombre: guardian.nombre,
        imagen: guardian.imagen,
        categoria: guardian.categoria,
        tipo_ser: guardian.tipo_ser,
        tipo_ser_nombre: guardian.tipo_ser_info?.nombre || 'Guardián',
        arquetipo: guardian.arquetipo,
        elemento: guardian.elemento,
        url_tienda: guardian.url_tienda
      },
      mensaje: mensaje,
      portal_actual: obtenerPortalActual()
    };

    // Guardar en caché para el resto del día
    await kv.set(`circulo:duende-dia:${hoy}`, duendeDelDia, { ex: 86400 }); // 24h

    return Response.json({
      success: true,
      cached: false,
      ...duendeDelDia
    });

  } catch (error) {
    console.error('Error obteniendo duende del día:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERAR MENSAJE DEL DÍA
// ═══════════════════════════════════════════════════════════════════════════════

async function generarMensajeDelDia(guardian) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Fallback si no hay API key
    return {
      saludo: `Buen día, viajero del Círculo`,
      mensaje: `Soy ${guardian.nombre}, y hoy te acompaño. Que este día te traiga la claridad que buscás.`,
      consejo: `Recordá que la magia está en los pequeños momentos.`
    };
  }

  const portal = obtenerPortalActual();
  const hora = new Date().getHours();
  const momento = hora < 12 ? 'mañana' : hora < 19 ? 'tarde' : 'noche';

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: `Sos ${guardian.nombre}, un ${guardian.tipo_ser_info?.nombre || 'guardián'} de la categoría ${guardian.categoria}.

Tu personalidad: ${guardian.tono_voz}
Tu forma de hablar: ${guardian.forma_hablar}
Tu frase característica: "${guardian.frase_tipica}"

Escribí en español rioplatense (vos, tenés, podés).
Sé breve pero profundo. Cada palabra cuenta.
Hablás en primera persona - SOS ${guardian.nombre}.`,
        messages: [{
          role: 'user',
          content: `Es ${momento} y alguien acaba de entrar al Círculo de Duendes.
Estamos en el ${portal.nombre} (${portal.energia}).

Generá un mensaje de bienvenida con este formato exacto:

SALUDO: [Una línea de saludo personal, cálido]
MENSAJE: [2-3 oraciones profundas pero accesibles, que conecten con la energía del día]
CONSEJO: [Un consejo práctico para hoy, algo que puedan hacer]

No uses asteriscos ni formato markdown. Solo texto puro.`
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Error en API');
    }

    const data = await response.json();
    const texto = data.content?.[0]?.text || '';

    // Parsear la respuesta
    const saludoMatch = texto.match(/SALUDO:\s*(.+?)(?=MENSAJE:|$)/s);
    const mensajeMatch = texto.match(/MENSAJE:\s*(.+?)(?=CONSEJO:|$)/s);
    const consejoMatch = texto.match(/CONSEJO:\s*(.+?)$/s);

    return {
      saludo: saludoMatch?.[1]?.trim() || `Bienvenido al Círculo`,
      mensaje: mensajeMatch?.[1]?.trim() || `Hoy te acompaño en tu camino.`,
      consejo: consejoMatch?.[1]?.trim() || `Tomate un momento para respirar.`
    };

  } catch (error) {
    console.error('Error generando mensaje:', error);
    return {
      saludo: `Buen día, alma curiosa`,
      mensaje: `Soy ${guardian.nombre}, y hoy el universo nos conectó. No es casualidad que estés acá.`,
      consejo: `Prestá atención a las señales que aparezcan hoy. Están ahí para vos.`
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

function hashFecha(fecha) {
  let hash = 0;
  for (let i = 0; i < fecha.length; i++) {
    const char = fecha.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function obtenerPortalActual() {
  const mes = new Date().getMonth();

  if (mes >= 5 && mes <= 7) return { id: 'yule', nombre: 'Portal de Yule', energia: 'Introspección y renacimiento' };
  if (mes >= 8 && mes <= 10) return { id: 'ostara', nombre: 'Portal de Ostara', energia: 'Nuevos comienzos' };
  if (mes === 11 || mes <= 1) return { id: 'litha', nombre: 'Portal de Litha', energia: 'Abundancia plena' };
  return { id: 'mabon', nombre: 'Portal de Mabon', energia: 'Gratitud y cosecha' };
}
