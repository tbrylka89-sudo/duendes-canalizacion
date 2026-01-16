import { kv } from '@vercel/kv';
import { generarPerfilGuardian } from '@/lib/circulo/voces-guardianes';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSEJO DEL DÍA - DUENDE DE LA SEMANA
// Cada semana hay un duende diferente, pero cada visita genera un mensaje único
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const nombreUsuario = url.searchParams.get('nombre') || 'viajero';

    // Obtener la semana actual del año
    const ahora = new Date();
    const semanaDelAno = obtenerSemanaDelAno(ahora);
    const claveGuardianSemanal = `circulo:guardian-semana:${ahora.getFullYear()}-W${semanaDelAno}`;

    // Verificar si ya hay un guardián asignado para esta semana
    let guardianSemana = await kv.get(claveGuardianSemanal);

    if (!guardianSemana) {
      // Seleccionar guardián para la semana
      guardianSemana = await seleccionarGuardianSemana(semanaDelAno, ahora.getFullYear());

      if (!guardianSemana) {
        return Response.json({
          success: false,
          error: 'No hay guardianes disponibles'
        }, { status: 404 });
      }

      // Guardar para toda la semana (7 días * 24h * 60min * 60seg)
      await kv.set(claveGuardianSemanal, guardianSemana, { ex: 604800 });
    }

    // Generar mensaje ÚNICO para esta visita (no se cachea)
    const mensaje = await generarConsejoUnico(guardianSemana, nombreUsuario);

    // Calcular cuántos días quedan de esta semana
    const diasRestantes = 7 - ahora.getDay();

    return Response.json({
      success: true,
      semana: semanaDelAno,
      diasRestantes: diasRestantes,
      guardian: {
        id: guardianSemana.id,
        nombre: guardianSemana.nombre,
        imagen: guardianSemana.imagen,
        categoria: guardianSemana.categoria,
        tipo_ser: guardianSemana.tipo_ser,
        tipo_ser_nombre: guardianSemana.tipo_ser_nombre,
        arquetipo: guardianSemana.arquetipo,
        elemento: guardianSemana.elemento,
        url_tienda: guardianSemana.url_tienda
      },
      consejo: mensaje,
      portal: obtenerPortalActual()
    });

  } catch (error) {
    console.error('Error generando consejo del día:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SELECCIONAR GUARDIÁN DE LA SEMANA
// ═══════════════════════════════════════════════════════════════════════════════

async function seleccionarGuardianSemana(semana, ano) {
  const catalogo = await kv.get('productos:catalogo') || [];

  if (catalogo.length === 0) return null;

  // Filtrar guardianes válidos
  const guardianesValidos = catalogo.filter(p =>
    p.imagen &&
    p.estado === 'publish' &&
    p.stockStatus !== 'outofstock'
  );

  if (guardianesValidos.length === 0) return null;

  // Selección basada en semana y año (rotativo)
  const seed = (ano * 100 + semana) % guardianesValidos.length;
  const productoSeleccionado = guardianesValidos[seed];

  // Generar perfil completo
  const guardian = generarPerfilGuardian(productoSeleccionado);

  return {
    id: guardian.id,
    nombre: guardian.nombre,
    imagen: guardian.imagen,
    categoria: guardian.categoria,
    tipo_ser: guardian.tipo_ser,
    tipo_ser_nombre: guardian.tipo_ser_info?.nombre || 'Guardián',
    arquetipo: guardian.arquetipo,
    elemento: guardian.elemento,
    tono_voz: guardian.tono_voz,
    forma_hablar: guardian.forma_hablar,
    frase_tipica: guardian.frase_tipica,
    url_tienda: guardian.url_tienda
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERAR CONSEJO ÚNICO POR VISITA
// ═══════════════════════════════════════════════════════════════════════════════

async function generarConsejoUnico(guardian, nombreUsuario) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Fallback si no hay API key
    return {
      titulo: `Consejo del día de ${guardian.nombre}`,
      mensaje: `${nombreUsuario}, hoy te acompaño en tu camino. Recordá que cada momento es una oportunidad para conectar con la magia.`,
      reflexion: `¿Qué pequeño paso podés dar hoy hacia lo que más deseás?`
    };
  }

  const portal = obtenerPortalActual();
  const hora = new Date().getHours();
  const momento = hora < 6 ? 'madrugada' : hora < 12 ? 'mañana' : hora < 19 ? 'tarde' : 'noche';
  const dia = obtenerDiaSemana();

  // Generar un factor de variación para que cada mensaje sea diferente
  const variacion = Date.now().toString().slice(-4);

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
        max_tokens: 400,
        system: `Sos ${guardian.nombre}, un ${guardian.tipo_ser_nombre} que esta semana está guiando al Círculo de Duendes.

Tu personalidad: ${guardian.tono_voz}
Tu forma de hablar: ${guardian.forma_hablar}
Tu frase característica: "${guardian.frase_tipica}"
Tu elemento: ${guardian.elemento || 'todos los elementos'}
Tu arquetipo: ${guardian.arquetipo || 'sabiduría ancestral'}

REGLAS CRÍTICAS:
- Escribí en español rioplatense (vos, tenés, podés, querés)
- Sé breve pero profundo - máximo 3 oraciones por sección
- NO uses asteriscos, markdown ni formato especial
- Cada mensaje debe ser ÚNICO - usá el código ${variacion} como inspiración sutil
- Hablás en primera persona - SOS ${guardian.nombre}`,
        messages: [{
          role: 'user',
          content: `Es ${dia} a la ${momento}. ${nombreUsuario} acaba de entrar al Círculo.
Estamos en ${portal.nombre} (${portal.energia}).

Generá un consejo del día ÚNICO con este formato:

TITULO: Consejo del día de ${guardian.nombre}
MENSAJE: [2-3 oraciones directas a ${nombreUsuario}, algo profundo pero práctico para este momento específico]
REFLEXION: [Una pregunta poderosa para que reflexione hoy]

Que sea diferente a cualquier otro consejo. Que ${nombreUsuario} sienta que es solo para él/ella en este momento exacto.`
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Error en API');
    }

    const data = await response.json();
    const texto = data.content?.[0]?.text || '';

    // Parsear la respuesta
    const tituloMatch = texto.match(/TITULO:\s*(.+?)(?=MENSAJE:|$)/s);
    const mensajeMatch = texto.match(/MENSAJE:\s*(.+?)(?=REFLEXION:|$)/s);
    const reflexionMatch = texto.match(/REFLEXION:\s*(.+?)$/s);

    return {
      titulo: tituloMatch?.[1]?.trim() || `Consejo del día de ${guardian.nombre}`,
      mensaje: mensajeMatch?.[1]?.trim() || `${nombreUsuario}, hoy es un día para confiar en vos mismo.`,
      reflexion: reflexionMatch?.[1]?.trim() || `¿Qué te está pidiendo tu corazón hoy?`
    };

  } catch (error) {
    console.error('Error generando consejo:', error);
    return {
      titulo: `Consejo del día de ${guardian.nombre}`,
      mensaje: `${nombreUsuario}, el universo no comete errores. Que estés acá ahora tiene un propósito. Prestá atención a las señales que aparezcan hoy.`,
      reflexion: `¿Qué mensaje necesitabas escuchar y todavía no te animaste a aceptar?`
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

function obtenerSemanaDelAno(fecha) {
  const primerDia = new Date(fecha.getFullYear(), 0, 1);
  const dias = Math.floor((fecha - primerDia) / (24 * 60 * 60 * 1000));
  return Math.ceil((dias + primerDia.getDay() + 1) / 7);
}

function obtenerDiaSemana() {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return dias[new Date().getDay()];
}

function obtenerPortalActual() {
  const mes = new Date().getMonth();

  if (mes >= 5 && mes <= 7) return { id: 'yule', nombre: 'Portal de Yule', energia: 'Introspección y renacimiento' };
  if (mes >= 8 && mes <= 10) return { id: 'ostara', nombre: 'Portal de Ostara', energia: 'Nuevos comienzos' };
  if (mes === 11 || mes <= 1) return { id: 'litha', nombre: 'Portal de Litha', energia: 'Abundancia plena' };
  return { id: 'mabon', nombre: 'Portal de Mabon', energia: 'Gratitud y cosecha' };
}
