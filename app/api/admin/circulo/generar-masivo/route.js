import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

// ═══════════════════════════════════════════════════════════════════════════════
// API: GENERACIÓN MASIVA DE CONTENIDO
// Genera una semana o mes completo de contenido para el Círculo
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutos max

let _anthropic; function getAnthropic() { if(!_anthropic) _anthropic = new Anthropic(); return _anthropic; }

// Configuración de tipos de contenido por día de la semana
const PLANTILLA_SEMANA = {
  0: { tipo: 'reflexion', nombre: 'Reflexión dominical' },
  1: { tipo: 'mensaje', nombre: 'Mensaje del lunes' },
  2: { tipo: 'conocimiento', nombre: 'Conocimiento mágico' },
  3: { tipo: 'meditacion', nombre: 'Meditación de mitad de semana' },
  4: { tipo: 'mensaje', nombre: 'Mensaje del jueves' },
  5: { tipo: 'ritual', nombre: 'Ritual de viernes' },
  6: { tipo: 'historia', nombre: 'Historia del sábado' }
};

const FASES_LUNARES = [
  { nombre: 'Luna Nueva', icono: '🌑', energia: 'nuevos comienzos, intención, siembra' },
  { nombre: 'Luna Creciente', icono: '🌒', energia: 'crecimiento, acción, manifestación' },
  { nombre: 'Cuarto Creciente', icono: '🌓', energia: 'decisiones, compromiso, superación' },
  { nombre: 'Luna Gibosa Creciente', icono: '🌔', energia: 'refinamiento, ajustes, paciencia' },
  { nombre: 'Luna Llena', icono: '🌕', energia: 'culminación, celebración, liberación' },
  { nombre: 'Luna Gibosa Menguante', icono: '🌖', energia: 'gratitud, compartir, enseñar' },
  { nombre: 'Cuarto Menguante', icono: '🌗', energia: 'soltar, perdonar, limpiar' },
  { nombre: 'Luna Menguante', icono: '🌘', energia: 'descanso, introspección, preparación' }
];

function obtenerFaseLunar(fecha) {
  const cicloLunar = 29.53059;
  const lunaLlenaRef = new Date('2024-01-25');
  const diff = (fecha - lunaLlenaRef) / (1000 * 60 * 60 * 24);
  const fase = ((diff % cicloLunar) + cicloLunar) % cicloLunar;
  const indice = Math.floor((fase / cicloLunar) * 8);
  return FASES_LUNARES[indice];
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      modo = 'semana', // 'semana' o 'mes'
      fechaInicio,
      guardian,
      personalizacion = {},
      soloPreview = false,
      generarImagenes = false,
      estiloImagen = 'fotorealista',
      promptEstilo = ''
    } = body;

    // Obtener guardián de la semana si no se especifica
    let guardianActivo = guardian;
    if (!guardianActivo) {
      guardianActivo = await kv.get('duende-semana-actual');
    }

    if (!guardianActivo) {
      return Response.json({
        success: false,
        error: 'No hay guardián seleccionado. Seleccioná uno primero.'
      }, { status: 400 });
    }

    const inicio = fechaInicio ? new Date(fechaInicio) : new Date();
    const diasGenerar = modo === 'mes' ? 30 : 7;
    const contenidos = [];

    // Generar plan de contenidos
    for (let i = 0; i < diasGenerar; i++) {
      const fecha = new Date(inicio);
      fecha.setDate(inicio.getDate() + i);

      const diaSemana = fecha.getDay();
      const plantilla = PLANTILLA_SEMANA[diaSemana];
      const faseLunar = obtenerFaseLunar(fecha);

      contenidos.push({
        fecha: {
          año: fecha.getFullYear(),
          mes: fecha.getMonth() + 1,
          dia: fecha.getDate(),
          diaSemana: fecha.toLocaleDateString('es-ES', { weekday: 'long' }),
          fechaCompleta: fecha.toISOString()
        },
        tipo: plantilla.tipo,
        tipoNombre: plantilla.nombre,
        faseLunar,
        guardian: {
          id: guardianActivo.id,
          nombre: guardianActivo.nombre,
          imagen: guardianActivo.imagen
        },
        estado: 'pendiente'
      });
    }

    // Si solo es preview, devolver el plan
    if (soloPreview) {
      return Response.json({
        success: true,
        preview: true,
        plan: contenidos,
        guardian: guardianActivo,
        totalDias: contenidos.length
      });
    }

    // Generar contenido real para cada día
    const resultados = [];
    let errores = 0;
    let imagenesGeneradas = 0;

    for (const item of contenidos) {
      try {
        const contenidoGenerado = await generarContenidoDia(
          item,
          guardianActivo,
          personalizacion
        );

        // Generar imagen si está habilitado
        let imagenUrl = null;
        if (generarImagenes) {
          try {
            imagenUrl = await generarImagenContenido(
              contenidoGenerado.titulo,
              item.tipo,
              estiloImagen,
              promptEstilo
            );
            if (imagenUrl) {
              imagenesGeneradas++;
            }
          } catch (imgError) {
            console.error(`[MASIVO] Error generando imagen día ${item.fecha.dia}:`, imgError);
            // No fallamos todo el contenido si la imagen falla
          }
        }

        // Guardar en KV
        const key = `circulo:contenido:${item.fecha.año}:${item.fecha.mes}:${item.fecha.dia}`;
        await kv.set(key, {
          ...contenidoGenerado,
          imagen: imagenUrl,
          programado: true,
          generadoEn: new Date().toISOString()
        });

        resultados.push({
          fecha: item.fecha,
          tipo: item.tipo,
          titulo: contenidoGenerado.titulo,
          imagen: imagenUrl,
          estado: 'generado'
        });

      } catch (error) {
        console.error(`[MASIVO] Error día ${item.fecha.dia}:`, error);
        errores++;
        resultados.push({
          fecha: item.fecha,
          tipo: item.tipo,
          estado: 'error',
          error: error.message
        });
      }

      // Pequeña pausa para no saturar la API
      await new Promise(r => setTimeout(r, generarImagenes ? 2000 : 500));
    }

    // Guardar registro de generación masiva
    const registro = await kv.get('admin:generacion-masiva:historial') || [];
    registro.unshift({
      fecha: new Date().toISOString(),
      modo,
      diasGenerados: resultados.filter(r => r.estado === 'generado').length,
      errores,
      guardian: guardianActivo.nombre
    });
    await kv.set('admin:generacion-masiva:historial', registro.slice(0, 20));

    return Response.json({
      success: true,
      resultados,
      resumen: {
        total: contenidos.length,
        generados: resultados.filter(r => r.estado === 'generado').length,
        imagenes: imagenesGeneradas,
        errores
      }
    });

  } catch (error) {
    console.error('[MASIVO] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function generarContenidoDia(item, guardian, personalizacion) {
  const { tipo, faseLunar, fecha } = item;

  // Construir prompt según el tipo
  let promptBase = `Sos ${guardian.nombre}, un guardián mágico de Duendes del Uruguay.

HOY ES: ${fecha.diaSemana} ${fecha.dia} de ${obtenerNombreMes(fecha.mes)} de ${fecha.año}
FASE LUNAR: ${faseLunar.nombre} ${faseLunar.icono} - Energía de ${faseLunar.energia}

`;

  let instrucciones = '';

  switch (tipo) {
    case 'mensaje':
      instrucciones = `Escribí un MENSAJE DEL DÍA inspirador y profundo.

ESTRUCTURA:
1. Título evocador (máximo 8 palabras)
2. Saludo personalizado conectando con la energía del día
3. Mensaje principal (3-4 párrafos) que:
   - Valide una emoción común ("Sé que a veces sentís...")
   - Ofrezca una perspectiva nueva
   - Conecte con la fase lunar actual
   - Dé una acción concreta para hoy
4. Cierre con una frase poderosa o pregunta reflexiva

TONO: Cercano, sabio, cálido. Como un mentor que te conoce de toda la vida.
NO uses: frases cliché de autoayuda, "en lo profundo del bosque", "desde tiempos inmemoriales"`;
      break;

    case 'meditacion':
      instrucciones = `Escribí una MEDITACIÓN GUIADA de 10-15 minutos.

ESTRUCTURA:
1. Título sugerente
2. Preparación (postura, respiración, espacio)
3. Guía paso a paso:
   - Relajación corporal
   - Visualización con detalles sensoriales (qué ves, olés, sentís)
   - Encuentro con el guardián o elemento mágico
   - Mensaje o regalo simbólico
   - Retorno gradual
4. Integración (qué hacer después)

INCLUÍ: Pausas indicadas con [...], detalles sensoriales específicos
TONO: Voz suave y pausada, presente continuo ("Respirás... sentís...")`;
      break;

    case 'ritual':
      instrucciones = `Escribí un RITUAL práctico y poderoso.

ESTRUCTURA:
1. Nombre del ritual
2. Propósito (qué se logra)
3. Mejor momento para hacerlo (relacionado con ${faseLunar.nombre})
4. Materiales necesarios (cosas comunes que se tienen en casa)
5. Preparación del espacio
6. Pasos del ritual (numerados, claros)
7. Cierre y agradecimiento
8. Qué esperar después

El ritual debe ser FACTIBLE, no requerir elementos raros, y tener un propósito claro.`;
      break;

    case 'conocimiento':
      instrucciones = `Escribí una LECCIÓN DE CONOCIMIENTO mágico.

TEMA SUGERIDO: Cristales, hierbas, runas, fases lunares, elementos, o tradición celta.

ESTRUCTURA:
1. Título educativo atractivo
2. Introducción que despierte curiosidad
3. Contenido principal:
   - Historia/origen
   - Propiedades y usos
   - Cómo trabajar con ello
   - Precauciones si aplica
4. Ejercicio práctico para aplicar el conocimiento
5. Conexión con la fase lunar actual

Que sea ÚTIL y APLICABLE, no solo información teórica.`;
      break;

    case 'historia':
      instrucciones = `Escribí una HISTORIA o LEYENDA con enseñanza.

ESTRUCTURA:
1. Título evocador
2. Historia narrativa (puede ser:)
   - Leyenda celta adaptada
   - Cuento original de un duende
   - Fábula con animales del bosque
   - Historia de un guardián
3. Debe tener: personajes memorables, conflicto, resolución
4. Enseñanza implícita (no moraleja obvia)
5. Reflexión final conectando con el lector

Que EMOCIONE y deje pensando. No sermones, sino historias que toquen el corazón.`;
      break;

    case 'reflexion':
      instrucciones = `Escribí una REFLEXIÓN PROFUNDA para cerrar la semana.

ESTRUCTURA:
1. Título contemplativo
2. Observación sobre la vida, el tiempo, los ciclos
3. Pregunta o serie de preguntas para introspección
4. Una invitación a mirar hacia adentro
5. Conexión con la semana que termina y la que viene

TONO: Contemplativo, pausado, como una conversación al atardecer.
Que invite a PARAR y PENSAR, no a consumir más contenido.`;
      break;
  }

  const prompt = promptBase + instrucciones + `

IMPORTANTE:
- Escribí en español rioplatense (vos, tenés, podés)
- Evitá frases genéricas de IA
- Cada palabra debe APORTAR algo
- La persona debe sentirse VISTA, no solo leída
- Firmá como ${guardian.nombre}

FORMATO: Devolvé SOLO el contenido, sin explicaciones.
Usá ## para subtítulos si es necesario.`;

  const response = await getAnthropic().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }]
  });

  const contenidoTexto = response.content[0].text;

  // Extraer título (primera línea o primer ##)
  let titulo = '';
  const lineas = contenidoTexto.split('\n');
  for (const linea of lineas) {
    const limpia = linea.trim();
    if (limpia && !limpia.startsWith('#')) {
      titulo = limpia;
      break;
    } else if (limpia.startsWith('##')) {
      titulo = limpia.replace(/^#+\s*/, '');
      break;
    } else if (limpia.startsWith('#')) {
      titulo = limpia.replace(/^#+\s*/, '');
      break;
    }
  }

  return {
    tipo,
    titulo: titulo || `${PLANTILLA_SEMANA[new Date(fecha.fechaCompleta).getDay()].nombre}`,
    contenido: contenidoTexto,
    mensaje: contenidoTexto.split('\n\n')[1] || contenidoTexto.slice(0, 300),
    guardian: {
      id: guardian.id,
      nombre: guardian.nombre,
      imagen: guardian.imagen
    },
    faseLunar,
    fecha
  };
}

function obtenerNombreMes(mes) {
  const meses = ['', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return meses[mes];
}

// Generar imagen para contenido
async function generarImagenContenido(titulo, tipo, estiloId, promptEstilo) {
  // Escenas base según tipo de contenido
  const escenasPorTipo = {
    mensaje: ['enchanted forest clearing with sunbeams', 'magical meadow at dawn', 'cozy woodland path'],
    meditacion: ['serene moonlit forest', 'peaceful zen garden', 'calm misty lake at sunrise'],
    ritual: ['mystical altar with candles', 'sacred stone circle', 'witch cottage interior'],
    conocimiento: ['ancient tree library', 'crystal cave with runes', 'herbalist workshop'],
    historia: ['fairy tale forest', 'magical castle in clouds', 'enchanted village'],
    reflexion: ['sunset over mountains', 'starlit night sky', 'autumn forest path']
  };

  const escenas = escenasPorTipo[tipo] || escenasPorTipo.mensaje;
  const escenaBase = escenas[Math.floor(Math.random() * escenas.length)];

  const prompt = `${escenaBase}, theme: "${titulo.slice(0, 50)}". ${promptEstilo}. Magical duende guardian atmosphere, fantasy elements, enchanted nature, professional quality, 8K.`;

  try {
    // Usar OpenAI DALL-E
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      console.log('[MASIVO] No hay OPENAI_API_KEY, saltando imagen');
      return null;
    }

    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1792x1024',
        quality: 'standard'
      })
    });

    const data = await res.json();

    if (data.data?.[0]?.url) {
      return data.data[0].url;
    }

    console.error('[MASIVO] Error en respuesta DALL-E:', data);
    return null;
  } catch (error) {
    console.error('[MASIVO] Error generando imagen:', error);
    return null;
  }
}

// GET - Obtener estado de generaciones masivas
export async function GET() {
  try {
    const historial = await kv.get('admin:generacion-masiva:historial') || [];
    const guardianActual = await kv.get('duende-semana-actual');

    return Response.json({
      success: true,
      historial,
      guardianActual: guardianActual ? {
        id: guardianActual.id,
        nombre: guardianActual.nombre,
        imagen: guardianActual.imagen
      } : null
    });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
