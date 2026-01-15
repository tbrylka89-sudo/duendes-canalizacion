import { kv } from '@vercel/kv';
import { generarPerfilGuardian, generarPromptContenido } from '@/lib/circulo/voces-guardianes';
import { CIRCULO_CONFIG } from '@/lib/circulo/config';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

// ═══════════════════════════════════════════════════════════════════════════════
// API DE GENERACIÓN DE CONTENIDO DEL CÍRCULO
// Genera contenido desde la voz de cada guardián
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      guardian_id,          // ID del guardián protagonista
      tipo,                 // mensaje_diario, ensenanza, ritual, meditacion, diy, altar
      tema,                 // Tema específico (opcional)
      palabras = 1500,      // Extensión aproximada
      instrucciones = '',   // Instrucciones adicionales
      portal = null         // Override del portal actual
    } = body;

    // Validar
    if (!guardian_id) {
      return Response.json({ success: false, error: 'guardian_id requerido' }, { status: 400 });
    }

    const tipoContenido = CIRCULO_CONFIG.tipos_contenido[tipo];
    if (!tipoContenido) {
      return Response.json({
        success: false,
        error: 'Tipo inválido',
        tipos_validos: Object.keys(CIRCULO_CONFIG.tipos_contenido)
      }, { status: 400 });
    }

    // Obtener datos del guardián
    const catalogo = await kv.get('productos:catalogo') || [];
    const productoGuardian = catalogo.find(p => p.id === guardian_id || p.wooId === parseInt(guardian_id));

    if (!productoGuardian) {
      return Response.json({ success: false, error: 'Guardián no encontrado' }, { status: 404 });
    }

    // Generar perfil enriquecido del guardián
    const guardian = generarPerfilGuardian(productoGuardian);

    // Construir el prompt específico para este tipo de contenido
    const promptSistema = construirPromptSistema(guardian, tipoContenido, portal);
    const promptUsuario = construirPromptUsuario(guardian, tipoContenido, tema, palabras, instrucciones);

    // Llamar a Claude
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ success: false, error: 'API key no configurada' }, { status: 500 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: promptSistema,
        messages: [{ role: 'user', content: promptUsuario }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic error:', response.status, errorData);
      return Response.json({ success: false, error: `Error API: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const contenidoRaw = data.content?.[0]?.text || '';

    // Parsear el contenido estructurado
    const contenidoParsed = parsearContenido(contenidoRaw, tipo);

    // Guardar en historial
    const historialKey = `circulo:contenido:${Date.now()}`;
    await kv.set(historialKey, {
      guardian_id,
      guardian_nombre: guardian.nombre,
      tipo,
      tema,
      contenido: contenidoParsed,
      generado_en: new Date().toISOString(),
      estado: 'borrador'
    });

    return Response.json({
      success: true,
      guardian: {
        id: guardian.id,
        nombre: guardian.nombre,
        imagen: guardian.imagen,
        categoria: guardian.categoria,
        tipo_ser: guardian.tipo_ser
      },
      tipo_contenido: tipoContenido,
      contenido: contenidoParsed,
      contenido_raw: contenidoRaw,
      historial_id: historialKey
    });

  } catch (error) {
    console.error('Error generando contenido:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTRUCTORES DE PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════

function construirPromptSistema(guardian, tipoContenido, portalOverride) {
  const portal = portalOverride || obtenerPortalActual();

  return `${guardian.prompt_personalidad}

## CONTEXTO TEMPORAL
Estamos en el ${portal.nombre} (${portal.subtitulo})
Energía predominante: ${portal.energia}
Elemento del momento: ${portal.elemento_dominante}

## FORMATO DE SALIDA
Tu contenido debe estar estructurado así:

---TITULO---
[Título atractivo que refleje tu personalidad]
---FIN_TITULO---

---SUBTITULO---
[Subtítulo o bajada emocional]
---FIN_SUBTITULO---

---INTRO---
[Párrafo de apertura que enganche - máx 3 oraciones]
---FIN_INTRO---

---CUERPO---
[El contenido principal, organizado en secciones si es necesario]
---FIN_CUERPO---

---CIERRE---
[Mensaje de cierre personal tuyo como ${guardian.nombre}]
---FIN_CIERRE---

---RITUAL_SUGERIDO---
[Si aplica: un mini-ritual o práctica relacionada]
---FIN_RITUAL_SUGERIDO---

---CRISTAL_DEL_DIA---
[Un cristal que recomendás y por qué]
---FIN_CRISTAL_DEL_DIA---

## REGLAS INQUEBRANTABLES
1. Sos ${guardian.nombre}. Todo está en primera persona, desde TU experiencia.
2. Español rioplatense: vos, tenés, podés, querés
3. Primera frase = impacto emocional directo
4. PROHIBIDO: frases genéricas de IA ("el velo entre mundos", "brumas ancestrales")
5. Cada párrafo aporta VALOR REAL
6. Tu personalidad brilla en cada línea`;
}

function construirPromptUsuario(guardian, tipoContenido, tema, palabras, instrucciones) {
  const promptsPorTipo = {
    mensaje_diario: `Escribí un mensaje del día para quien entra al Círculo esta mañana.
Breve pero profundo. Como si los saludaras personalmente.
Que sientan que vos, ${guardian.nombre}, los estabas esperando.
Extensión: 150-250 palabras máximo.`,

    ensenanza: `Compartí una enseñanza profunda sobre ${tema || 'tu área de especialidad'}.
No es una clase académica - es vos compartiendo sabiduría desde tu experiencia.
Que puedan aplicar algo HOY.
Extensión: aproximadamente ${palabras} palabras.`,

    ritual: `Guiá un ritual que la persona pueda hacer en su casa.
Paso a paso, con ingredientes simples.
Explicá el POR QUÉ de cada paso, no solo el cómo.
Que sientan tu presencia guiándolos.
Tema: ${tema || 'elige según tu especialidad'}
Extensión: aproximadamente ${palabras} palabras.`,

    meditacion: `Escribí una meditación guiada que se pueda leer en voz alta o grabar.
Ritmo pausado, frases cortas.
Guía sensorial específica (no "sentí la energía" - "notá el peso de tus manos").
Un viaje con inicio, transformación y cierre.
Tu voz como ${guardian.nombre} guía todo el camino.
Extensión: aproximadamente ${palabras} palabras.`,

    diy: `Enseñá a crear algo mágico con las manos.
Un proyecto artesanal inspirado en tu energía como ${guardian.nombre}.
Materiales accesibles, instrucciones claras.
Explicá el significado mágico de lo que están creando.
Tema: ${tema || 'elige algo relacionado a tu categoría'}
Extensión: aproximadamente ${palabras} palabras.`,

    altar: `Enseñá cómo crear un altar dedicado a vos, ${guardian.nombre}.
Qué elementos incluir, cómo disponerlos, qué significan.
Rituales de activación y mantenimiento.
Que sientan que están creando un espacio sagrado para conectar con vos.
Extensión: aproximadamente ${palabras} palabras.`
  };

  let prompt = promptsPorTipo[tipoContenido.id] || promptsPorTipo.ensenanza;

  if (instrucciones) {
    prompt += `\n\nINDICACIONES ADICIONALES: ${instrucciones}`;
  }

  return prompt;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

function parsearContenido(raw, tipo) {
  const extraer = (tag) => {
    const regex = new RegExp(`---${tag}---([\\s\\S]*?)---FIN_${tag}---`, 'i');
    const match = raw.match(regex);
    return match ? match[1].trim() : null;
  };

  return {
    titulo: extraer('TITULO') || 'Sin título',
    subtitulo: extraer('SUBTITULO'),
    intro: extraer('INTRO'),
    cuerpo: extraer('CUERPO') || raw,
    cierre: extraer('CIERRE'),
    ritual_sugerido: extraer('RITUAL_SUGERIDO'),
    cristal_del_dia: extraer('CRISTAL_DEL_DIA'),
    tipo: tipo,
    generado: new Date().toISOString()
  };
}

function obtenerPortalActual() {
  const hoy = new Date();
  const mes = hoy.getMonth();

  const portales = {
    yule: { nombre: 'Portal de Yule', subtitulo: 'El Renacimiento de la Luz', energia: 'Introspección y renacimiento', elemento_dominante: 'tierra' },
    ostara: { nombre: 'Portal de Ostara', subtitulo: 'El Despertar', energia: 'Nuevos comienzos y fertilidad', elemento_dominante: 'aire' },
    litha: { nombre: 'Portal de Litha', subtitulo: 'La Plenitud', energia: 'Abundancia y celebración', elemento_dominante: 'fuego' },
    mabon: { nombre: 'Portal de Mabon', subtitulo: 'La Cosecha', energia: 'Gratitud y soltar', elemento_dominante: 'agua' }
  };

  if (mes >= 5 && mes <= 7) return portales.yule;
  if (mes >= 8 && mes <= 10) return portales.ostara;
  if (mes === 11 || mes <= 1) return portales.litha;
  return portales.mabon;
}

// GET - Información del sistema
export async function GET() {
  return Response.json({
    success: true,
    tipos_contenido: CIRCULO_CONFIG.tipos_contenido,
    portales: CIRCULO_CONFIG.portales,
    portal_actual: obtenerPortalActual()
  });
}
