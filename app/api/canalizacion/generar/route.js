import Anthropic from '@anthropic-ai/sdk';
import canon from '@/lib/canon.json';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// POST - Generar canalización épica (3500+ palabras)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      nombreGuardian,
      tipoSer,        // duende, elfo, hada, mago, bruja, gnomo
      proposito,      // proteccion, amor, abundancia, etc.
      elemento,       // fuego, agua, tierra, aire, eter
      cristales,      // array de cristales incluidos
      nombrePersona,
      fechaNacimiento,
      queBusca,
      situacionEspecial,
      mayorDeseo,
      esRegalo = false,
      deQuien,
      relacionConPersona,
      mensajePersonal
    } = body;

    if (!nombreGuardian || !tipoSer || !nombrePersona) {
      return Response.json({
        success: false,
        error: 'Nombre del guardián, tipo y nombre de la persona son requeridos'
      }, { status: 400 });
    }

    // Obtener info del canon
    const serInfo = canon.seres.tipos.find(s => s.id === tipoSer) || canon.seres.tipos[0];
    const propositoInfo = canon.propositos.find(p => p.id === proposito) || canon.propositos[0];
    const elementoInfo = canon.elementos.find(e => e.id === elemento) || canon.elementos[0];
    const cristalesInfo = (cristales || []).map(c =>
      canon.cristales.principales.find(cr => cr.id === c)?.nombre || c
    ).join(', ');

    // Construir contexto de regalo si aplica
    const contextoRegalo = esRegalo ? `
CONTEXTO DE REGALO:
Este guardián fue elegido como regalo por ${deQuien || 'alguien especial'}.
Relación: ${relacionConPersona || 'cercana'}
Mensaje de quien regala: "${mensajePersonal || 'Con todo mi amor'}"
IMPORTANTE: Incluir sutilmente este contexto en la canalización, mencionando que el amor de quien regala también influyó en la conexión.
` : '';

    const systemPrompt = `Sos un canalizador espiritual maestro del universo de Duendes del Uruguay.

═══════════════════════════════════════════════════════════════
CANON CENTRAL - REGLAS ABSOLUTAS
═══════════════════════════════════════════════════════════════

FILOSOFÍA: "${canon.universo.filosofia_central}"

VERDADES DEL UNIVERSO:
${canon.universo.verdades_absolutas.map(v => `- ${v}`).join('\n')}

SOBRE ${serInfo.nombre.toUpperCase()}S:
- Esencia: ${serInfo.esencia}
- Origen místico: ${serInfo.origen_mistico}
- Personalidad: ${serInfo.personalidad}
- Poder principal: ${serInfo.poder_principal}

ELEMENTO ${elementoInfo.nombre.toUpperCase()}:
- Energía: ${elementoInfo.energia}
- Dirección: ${elementoInfo.direccion}
- Estación: ${elementoInfo.estacion}
- Personalidad guardiana: ${elementoInfo.personalidad_guardiana}

PROPÓSITO - ${propositoInfo.nombre.toUpperCase()}:
- Energía: ${propositoInfo.energia}

═══════════════════════════════════════════════════════════════
TONO Y ESTILO - OBLIGATORIO
═══════════════════════════════════════════════════════════════

IDIOMA: Español rioplatense natural
- Usar "vos" siempre (nunca "tú")
- Conjugaciones: tenés, podés, sos, querés, sabés
- Tono cálido, como escribiendo a una amiga cercana
- Profundo pero accesible, místico pero real

PALABRAS PODEROSAS A USAR:
${canon.tono_comunicacion.palabras_poderosas.join(', ')}

FRASES MARCA:
${canon.tono_comunicacion.frases_marca.map(f => `"${f}"`).join(', ')}

PROHIBIDO:
${canon.tono_comunicacion.prohibido.join(', ')}

═══════════════════════════════════════════════════════════════
ESTRUCTURA DE LA CANALIZACIÓN - MÍNIMO 3500 PALABRAS
═══════════════════════════════════════════════════════════════

${canon.estructura_canalizacion.secciones.map(s => `
### ${s.nombre} (${s.palabras_minimas}+ palabras)
${s.contenido}
`).join('\n')}

═══════════════════════════════════════════════════════════════
ENFOQUE ESPECIAL
═══════════════════════════════════════════════════════════════

Aplicar principios de:
- NEUROCIENCIA: Activar centros emocionales, crear imágenes mentales vívidas
- NEUROMARKETING: Generar conexión profunda, deseo de más
- PSICOLOGÍA: Validar emociones, crear sensación de ser comprendida
- FILOSOFÍA: Dar significado profundo a la conexión
- SOCIOLOGÍA: Hacerla sentir parte de algo especial y exclusivo

Cada párrafo debe tocar el corazón. Cada frase debe resonar.
El lector debe sentir que esta canalización fue escrita SOLO para ella.

═══════════════════════════════════════════════════════════════
FORMATO DE SALIDA
═══════════════════════════════════════════════════════════════

Usar Markdown con:
# Título principal (nombre del guardián)
## Subtítulos para cada sección
**Negritas** para énfasis
*Itálicas* para palabras del guardián o énfasis suave
---
Para separadores entre secciones

NO usar emojis en el texto principal.
Usar simbolismo con palabras, no iconos.`;

    const userPrompt = `GENERAR CANALIZACIÓN ÉPICA PARA:

GUARDIÁN:
- Nombre: ${nombreGuardian}
- Tipo: ${serInfo.nombre}
- Propósito: ${propositoInfo.nombre}
- Elemento: ${elementoInfo.nombre}
- Cristales: ${cristalesInfo || 'Cuarzo cristal'}

PERSONA ELEGIDA:
- Nombre: ${nombrePersona}
- Fecha de nacimiento: ${fechaNacimiento || 'No proporcionada'}
- Lo que busca: ${queBusca || 'Conexión y protección'}
- Situación especial: ${situacionEspecial || 'En un momento de cambio'}
- Mayor deseo: ${mayorDeseo || 'Encontrar paz y propósito'}

${contextoRegalo}

═══════════════════════════════════════════════════════════════
INSTRUCCIONES FINALES
═══════════════════════════════════════════════════════════════

1. MÍNIMO 3500 palabras - cada sección con la profundidad indicada
2. Esta canalización será guardada para siempre - debe ser épica
3. Personalizar PROFUNDAMENTE según los datos de ${nombrePersona}
4. Hacer referencias específicas a su situación y deseos
5. El guardián debe "hablar" directamente a ella en la sección de Mensaje Personal
6. Incluir ritual de bienvenida DETALLADO paso a paso
7. Mencionar los cristales específicos y su sinergia con el guardián
8. Crear conexión emocional desde la primera línea

GENERA LA CANALIZACIÓN COMPLETA AHORA.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const canalizacion = message.content[0]?.text || '';
    const palabras = canalizacion.split(/\s+/).length;

    return Response.json({
      success: true,
      canalizacion,
      palabras,
      cumpleLongitud: palabras >= 3500,
      guardian: {
        nombre: nombreGuardian,
        tipo: serInfo.nombre,
        proposito: propositoInfo.nombre,
        elemento: elementoInfo.nombre,
        cristales: cristalesInfo
      },
      persona: {
        nombre: nombrePersona,
        fechaNacimiento
      },
      generadoEn: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generando canalización:', error);
    return Response.json({
      success: false,
      error: error.message || 'Error al generar canalización'
    }, { status: 500 });
  }
}
