import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { historialChat, datosActuales, catalogo } = await request.json();

    // Convertir historial a formato de mensajes para Claude
    const mensajes = historialChat.map(msg => ({
      role: msg.rol === 'asistente' ? 'assistant' : 'user',
      content: msg.contenido
    }));

    const systemPrompt = `Sos el asistente de registro de guardianes para Duendes del Uruguay.
Tu trabajo es hacer una encuesta conversacional para recopilar los datos de un nuevo guardián.

DATOS QUE NECESITÁS RECOPILAR:
1. Nombre del guardián (obligatorio)
2. Especie: ${catalogo.especies.join(', ')}
3. Género: Masculino, Femenino o Neutro
4. Categoría: ${catalogo.categorias.join(', ')}
5. Tamaño y precio (opciones): ${catalogo.tamanos.join(' | ')}
6. Medida exacta en cm
7. Accesorios detallados (cristales, ropa, objetos que lleva)

DATOS YA RECOPILADOS:
${JSON.stringify(datosActuales, null, 2)}

REGLAS:
- Preguntá de a una cosa por vez, de forma natural y conversacional
- Si el usuario da info incompleta, pedí que complete
- Usá español rioplatense (vos, tenés)
- Cuando tengas TODOS los datos necesarios, mostrá un resumen y preguntá si está todo bien
- Si confirma, respondé EXACTAMENTE con este formato al final:
  [ENCUESTA_COMPLETA]
  {"nombre":"X","especie":"X","genero":"X","categoria":"X","tamano":"X","tamanoCm":X,"accesorios":"X"}

IMPORTANTE sobre especies:
- Si es una pixie, siempre es femenina y siempre única
- Si dice "bruja" o "brujo", usá esa especie
- Si no menciona especie específica, asumí "duende" o "duenda" según género

IMPORTANTE sobre tamaños:
- Mini (~10cm) = $2.500 - recreable
- Mini Especial (~10cm) = $5.500 - recreable
- Pixie (10-13cm) = $5.500 - SIEMPRE único
- Mediano Especial (17-22cm) = $8.000 - único
- Mediano Maestro Místico (22-25cm) = $16.000-20.000 - único
- Grande Especial (25-28cm) = $16.000 - único
- Grande Maestro Místico (27-30cm) = $32.000 - único
- Gigante Especial (30+cm) = $40.000 - único
- Gigante Maestro Místico (35+cm) = $80.000 - único

Sé amable pero eficiente. El objetivo es tener toda la info necesaria para crear la historia del guardián.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: mensajes
    });

    const respuestaTexto = response.content[0].text;

    // Verificar si la encuesta está completa
    let encuestaCompleta = false;
    let datosExtraidos = null;

    if (respuestaTexto.includes('[ENCUESTA_COMPLETA]')) {
      encuestaCompleta = true;

      // Extraer JSON de datos
      const jsonMatch = respuestaTexto.match(/\[ENCUESTA_COMPLETA\]\s*(\{[\s\S]*?\})/);
      if (jsonMatch) {
        try {
          datosExtraidos = JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('Error parseando datos:', e);
        }
      }
    } else {
      // Intentar extraer datos parciales de la conversación
      datosExtraidos = extraerDatosParciales(historialChat, datosActuales);
    }

    // Limpiar la respuesta para mostrar al usuario
    const respuestaLimpia = respuestaTexto
      .replace(/\[ENCUESTA_COMPLETA\][\s\S]*$/, '')
      .trim();

    return NextResponse.json({
      success: true,
      respuesta: respuestaLimpia || respuestaTexto,
      encuestaCompleta,
      datosExtraidos
    });

  } catch (error) {
    console.error('Error en encuesta:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Función para extraer datos parciales de la conversación
function extraerDatosParciales(historial, datosActuales) {
  const datos = { ...datosActuales };

  // Analizar mensajes del usuario para extraer info
  const mensajesUsuario = historial
    .filter(m => m.rol === 'usuario')
    .map(m => m.contenido.toLowerCase());

  for (const msg of mensajesUsuario) {
    // Detectar nombre (primera respuesta suele ser el nombre)
    if (!datos.nombre && mensajesUsuario.indexOf(msg) === 0) {
      const nombre = msg.trim().split(/\s+/)[0];
      if (nombre && nombre.length > 1 && nombre.length < 30) {
        datos.nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
      }
    }

    // Detectar género
    if (msg.includes('masculino') || msg.includes('macho') || msg.includes('él')) {
      datos.genero = 'M';
    } else if (msg.includes('femenin') || msg.includes('hembra') || msg.includes('ella')) {
      datos.genero = 'F';
    }

    // Detectar especie
    const especies = ['pixie', 'bruja', 'brujo', 'vikingo', 'vikinga', 'leprechaun',
                     'chaman', 'mago', 'elfo', 'guerrero', 'gaucho'];
    for (const esp of especies) {
      if (msg.includes(esp)) {
        datos.especie = esp;
        break;
      }
    }

    // Detectar categoría
    const categorias = ['protección', 'abundancia', 'amor', 'sanación', 'salud', 'sabiduría'];
    for (const cat of categorias) {
      if (msg.includes(cat)) {
        datos.categoria = cat.charAt(0).toUpperCase() + cat.slice(1);
        break;
      }
    }

    // Detectar medida en cm
    const cmMatch = msg.match(/(\d+)\s*cm/);
    if (cmMatch) {
      datos.tamanoCm = parseInt(cmMatch[1]);
    }
  }

  return datos;
}
