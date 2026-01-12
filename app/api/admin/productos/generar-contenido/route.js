import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `Sos el Cronista del Bosque Ancestral de Piriápolis, Uruguay.
Canalizás la historia y energía de cada guardián que llega al mundo humano.

REGLAS ABSOLUTAS:
- Nombres CÉLTICOS/ÉLFICOS/NATURALES (Elderwood, Bramble, Thornwick, Moss, Fern, Willow, Rowan)
- NUNCA nombres infantiles (nada de -ito, -ita, nada cursi)
- Tono ADULTO, místico, profundo, ELEGANTE
- Solo hablar de FORTALEZAS, nunca mencionar debilidades
- Español rioplatense ("vos", "tenés", "podés", "tu hogar")
- Historia con PROFUNDIDAD espiritual real
- Las descripciones deben ser evocadoras y sensoriales
- Máximo respeto por la tradición élfica y la magia ancestral

CONTEXTO:
Duendes del Uruguay crea guardianes artesanales únicos. Cada pieza es canalizada
en el Bosque de Piriápolis y lleva energía ancestral. Los compradores se llaman
"elegidos" o "guardianes humanos". La compra es un "pacto" o "adopción".`;

const CAMPOS = {
  nombre: {
    instruccion: 'Generá un nombre élfico/celta apropiado para este guardián. Solo el nombre, sin explicación.',
    maxTokens: 50
  },
  historia: {
    instruccion: `Escribí la historia de origen de este guardián (300-400 palabras).
Incluí:
- De qué bosque ancestral proviene
- Cómo y por qué cruzó el portal a este mundo
- Qué misión trae para quien lo adopte
- Algún detalle místico único de su historia

Usá prosa poética pero accesible. Primera o tercera persona según fluya mejor.`,
    maxTokens: 800
  },
  personalidad: {
    instruccion: `Describí la personalidad de este guardián (150-200 palabras).
Incluí:
- Cómo se comunica con su guardián humano
- Su temperamento general
- Qué tipo de energía emana
- Cómo demuestra su presencia en el hogar`,
    maxTokens: 400
  },
  fortalezas: {
    instruccion: `Listá 5-6 fortalezas específicas de este guardián.
Formato: una fortaleza por línea, sin viñetas ni números.
Ejemplo:
Protección del hogar y sus habitantes
Limpieza de energías densas o estancadas
Conexión profunda con la tierra y sus ciclos`,
    maxTokens: 300
  },
  mensaje: {
    instruccion: `Escribí UNA frase poderosa que define la esencia de este guardián.
Debe ser memorable, corta (máximo 15 palabras), y reflejar su propósito.
Solo la frase, sin comillas.`,
    maxTokens: 60
  },
  ritual: {
    instruccion: `Describí el ritual de bienvenida para este guardián (150-200 palabras).
Incluí:
- Qué hacer cuando llega a casa
- Cómo presentarse
- Dónde ubicarlo inicialmente
- Algún gesto simbólico de conexión

Que sea práctico y místico a la vez.`,
    maxTokens: 400
  },
  cuidados: {
    instruccion: `Describí los cuidados especiales para este guardián (150-200 palabras).
Incluí:
- Ubicación ideal en el hogar
- Limpieza energética recomendada
- Fechas especiales de poder
- Qué evitar cerca de él

Información práctica con toque místico.`,
    maxTokens: 400
  }
};

export async function POST(request) {
  try {
    const datos = await request.json();
    const { campo, nombre, tipo, elemento, propositos, color_ojos, color_cabello, piedras } = datos;

    // Construir contexto del guardián
    const contexto = [];
    if (nombre) contexto.push(`Nombre: ${nombre}`);
    if (tipo) contexto.push(`Tipo: ${tipo}`);
    if (elemento) contexto.push(`Elemento: ${elemento}`);
    if (propositos) contexto.push(`Propósitos: ${propositos.replace(/,/g, ', ')}`);
    if (color_ojos) contexto.push(`Color de ojos: ${color_ojos}`);
    if (color_cabello) contexto.push(`Color de cabello: ${color_cabello}`);
    if (piedras) contexto.push(`Piedras/Cristales: ${piedras.replace(/,/g, ', ')}`);

    const contextoStr = contexto.length > 0
      ? `\n\nDATOS DEL GUARDIÁN:\n${contexto.join('\n')}`
      : '';

    // Si es "todo", generar todos los campos
    if (campo === 'todo') {
      const resultado = {};

      // Si no hay nombre, generarlo primero
      if (!nombre) {
        const resNombre = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 50,
          system: SYSTEM_PROMPT,
          messages: [{
            role: 'user',
            content: `${CAMPOS.nombre.instruccion}${contextoStr}`
          }]
        });
        resultado.nombre = resNombre.content[0].text.trim();
        contexto.unshift(`Nombre: ${resultado.nombre}`);
      }

      // Generar el resto en paralelo
      const promesas = Object.entries(CAMPOS)
        .filter(([key]) => key !== 'nombre')
        .map(async ([key, config]) => {
          const res = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: config.maxTokens,
            system: SYSTEM_PROMPT,
            messages: [{
              role: 'user',
              content: `${config.instruccion}\n\nDATOS DEL GUARDIÁN:\n${contexto.join('\n')}`
            }]
          });
          return [key, res.content[0].text.trim()];
        });

      const resultados = await Promise.all(promesas);
      resultados.forEach(([key, value]) => {
        resultado[key] = value;
      });

      return NextResponse.json({
        success: true,
        ...resultado
      }, {
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Generar campo individual
    if (!CAMPOS[campo]) {
      return NextResponse.json({
        success: false,
        error: `Campo "${campo}" no reconocido`
      }, {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const config = CAMPOS[campo];
    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: config.maxTokens,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `${config.instruccion}${contextoStr}`
      }]
    });

    return NextResponse.json({
      success: true,
      [campo]: res.content[0].text.trim()
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    console.error('Error generando contenido:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error al generar contenido'
    }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

// Helper para agregar CORS a todas las respuestas
function corsResponse(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
