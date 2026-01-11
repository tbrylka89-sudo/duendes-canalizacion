export const dynamic = 'force-dynamic';
export const maxDuration = 120;

// ═══════════════════════════════════════════════════════════════
// GENERADOR DE CALENDARIO DE CONTENIDO - EL CÍRCULO
// Crea planes semanales y mensuales variados y atrapantes
// ═══════════════════════════════════════════════════════════════

// Temas que la gente BUSCA y no encuentra de calidad
const TEMAS_TRENDING = {
  duendes: [
    'Tipos de duendes y cómo identificarlos en tu hogar',
    'Señales de que un duende quiere conectar contigo',
    'Cómo crear un altar para duendes',
    'Duendes guardianes vs duendes traviesos',
    'Ofrendas que realmente funcionan',
    'Historias reales de encuentros con duendes',
    'Duendes y niños - la conexión especial',
    'El duende de la prosperidad',
    'Limpiar energías con ayuda de duendes',
    'Duendes en diferentes culturas latinoamericanas'
  ],

  luna: [
    'Rituales para cada fase lunar',
    'Luna nueva: plantar intenciones que sí funcionan',
    'Luna llena: qué liberar y cómo',
    'Tu ciclo menstrual y la luna',
    'Agua de luna: cómo hacerla y usarla',
    'Cortar el pelo según la luna',
    'Eclipses: qué hacer y qué NO hacer',
    'Luna en cada signo: energía del día',
    'Manifestación lunar paso a paso',
    'Diario lunar: cómo empezar'
  ],

  cristales: [
    'Cristales para principiantes: cuáles empezar',
    'Cómo limpiar cristales (métodos reales)',
    'Cristales para ansiedad que funcionan',
    'Cómo saber si un cristal es para vos',
    'Cristales para protección del hogar',
    'Programar cristales: guía práctica',
    'Cristales para dormir mejor',
    'Combinaciones de cristales poderosas',
    'Cristales falsos: cómo detectarlos',
    'Cristales para cada chakra'
  ],

  proteccion: [
    'Protección energética diaria en 5 minutos',
    'Limpiar la energía de tu casa',
    'Cortar lazos energéticos tóxicos',
    'Protección para empáticos',
    'Sal: usos reales de protección',
    'Amuletos que funcionan',
    'Proteger tu energía en lugares públicos',
    'Limpieza con huevo: guía completa',
    'Plantas protectoras para el hogar',
    'Baños de descarga energética'
  ],

  abundancia: [
    'Bloqueos de abundancia: identificarlos',
    'Ritual de prosperidad (que sí funciona)',
    'Relación con el dinero: sanar',
    'Decretos de abundancia efectivos',
    'Feng shui básico para prosperidad',
    'Velas para atraer abundancia',
    'Merecimiento: el trabajo interno',
    'Luna y dinero: mejores momentos',
    'Abundancia más allá del dinero',
    'Gratitud y prosperidad: la conexión'
  ],

  sanacion: [
    'Sanar heridas de la infancia',
    'Ho\'oponopono: guía práctica',
    'Sanar la relación con tu madre',
    'Ancestros: sanar heridas heredadas',
    'Reiki para principiantes',
    'Sanar el corazón roto',
    'Perdonar sin olvidar',
    'Niño interior: reconectarse',
    'Soltar el pasado: proceso real',
    'Autocompasión: práctica diaria'
  ],

  tarot: [
    'Tarot para principiantes: primeros pasos',
    'Cómo hacer preguntas al tarot',
    'Tiradas simples y poderosas',
    'Tarot para decisiones difíciles',
    'Limpiar tu mazo de tarot',
    'Tarot y luna: cuándo tirar',
    'Interpretar cartas difíciles',
    'Tarot para autoconocimiento',
    'Cartas que asustan: qué significan realmente',
    'Tu carta del año: cómo calcularla'
  ],

  rituales: [
    'Rituales de luna nueva efectivos',
    'Crear tu propio ritual personalizado',
    'Rituales con velas: guía completa',
    'Rituales de cierre de ciclo',
    'Rituales para empezar el día',
    'Rituales de solsticio y equinoccio',
    'Rituales para soltar personas',
    'Baño ritual: paso a paso',
    'Rituales con elementos de la naturaleza',
    'Rituales express para días difíciles'
  ],

  autoconocimiento: [
    'Conocer tu sombra',
    'Descubrir tu propósito',
    'Patrones que se repiten en tu vida',
    'Tu arquetipo dominante',
    'Miedos inconscientes',
    'Creencias limitantes: identificarlas',
    'Tu relación con el control',
    'Heridas de apego',
    'Lo que te enoja de otros dice de vos',
    'Journaling para autoconocimiento'
  ]
};

// Estructura semanal base
const ESTRUCTURA_SEMANAL = {
  lunes: {
    tipo: 'motivacion',
    formato: 'reflexion',
    descripcion: 'Mensaje para empezar la semana con intención'
  },
  martes: {
    tipo: 'ensenanza',
    formato: 'articulo',
    descripcion: 'Contenido educativo profundo'
  },
  miercoles: {
    tipo: 'practica',
    formato: 'ritual',
    descripcion: 'Algo para HACER, no solo leer'
  },
  jueves: {
    tipo: 'duendes',
    formato: 'historia',
    descripcion: 'Siempre algo de duendes los jueves'
  },
  viernes: {
    tipo: 'liberacion',
    formato: 'guia',
    descripcion: 'Preparar el fin de semana, soltar la semana'
  },
  sabado: {
    tipo: 'profundo',
    formato: 'reflexion',
    descripcion: 'Contenido más largo para leer con tiempo'
  },
  domingo: {
    tipo: 'preparacion',
    formato: 'ritual',
    descripcion: 'Ritual o práctica para la semana que viene'
  }
};

// Fases lunares y su energía
const ENERGIA_LUNAR = {
  nueva: {
    temas: ['intenciones', 'comienzos', 'plantar semillas', 'introspección'],
    evitar: ['cierres', 'liberación', 'acción externa']
  },
  creciente: {
    temas: ['acción', 'construcción', 'manifestar', 'crecer'],
    evitar: ['soltar', 'descanso', 'introspección profunda']
  },
  llena: {
    temas: ['celebrar', 'gratitud', 'culminación', 'claridad'],
    evitar: ['empezar cosas nuevas', 'decisiones importantes']
  },
  menguante: {
    temas: ['soltar', 'limpiar', 'cerrar ciclos', 'perdonar'],
    evitar: ['comenzar proyectos', 'manifestar cosas nuevas']
  }
};

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      periodo = 'semana', // semana | mes
      fechaInicio = new Date().toISOString().split('T')[0],
      faseLunar = 'creciente', // para ajustar temas
      temasExcluir = [], // temas ya usados recientemente
      enfoqueMes = null // tema central del mes si aplica
    } = body;

    const systemPrompt = `Sos la estratega de contenido de Duendes del Uruguay.
Tu trabajo es crear calendarios de contenido que:

1. NUNCA sean aburridos o predecibles
2. Mezclen temas de forma inteligente
3. Sigan la energía lunar cuando corresponda
4. Siempre incluyan algo de duendes cada semana
5. Enseñen algo REAL y ÚTIL en cada pieza
6. Creen anticipación para el próximo contenido

REGLA DE ORO: Cada título debe hacer que alguien quiera dejar lo que está haciendo para leerlo.

NO uses títulos genéricos como:
- "La magia de..."
- "Descubriendo..."
- "El poder de..."

SÍ usa títulos que generen curiosidad real:
- "Por qué tu protección energética no funciona (y qué hacer)"
- "Lo que nadie te dice sobre los cristales de cuarzo"
- "El duende que salvó mi negocio"

El contenido es para El Círculo - personas que ya están en el camino espiritual y quieren profundizar.`;

    let userPrompt = '';

    if (periodo === 'semana') {
      userPrompt = `Creá el plan de contenido para la semana que comienza el ${fechaInicio}.

FASE LUNAR ACTUAL: ${faseLunar}
${ENERGIA_LUNAR[faseLunar] ? `Temas ideales: ${ENERGIA_LUNAR[faseLunar].temas.join(', ')}` : ''}

ESTRUCTURA SEMANAL:
${Object.entries(ESTRUCTURA_SEMANAL).map(([dia, info]) =>
  `- ${dia.toUpperCase()}: ${info.tipo} (${info.formato}) - ${info.descripcion}`
).join('\n')}

${temasExcluir.length > 0 ? `TEMAS YA USADOS (evitar): ${temasExcluir.join(', ')}` : ''}

Para cada día generá:
1. Título atrapante (que genere curiosidad REAL)
2. Categoría (duendes/luna/cristales/proteccion/abundancia/sanacion/tarot/rituales/autoconocimiento)
3. Tipo de contenido (articulo/ritual/meditacion/historia/guia/reflexion/ensenanza)
4. Descripción en 1-2 oraciones de qué va a tratar
5. Por qué este día (conexión con la energía del día/luna)
6. Gancho: la primera frase del contenido (que genere impacto emocional)

Formato JSON:
{
  "semana": "${fechaInicio}",
  "faseLunar": "${faseLunar}",
  "contenidos": [
    {
      "dia": "lunes",
      "fecha": "YYYY-MM-DD",
      "titulo": "",
      "categoria": "",
      "tipo": "",
      "descripcion": "",
      "porQueHoy": "",
      "gancho": ""
    }
  ],
  "temaDestacado": "El contenido más importante de la semana",
  "hiloConector": "Qué conecta todos los contenidos de la semana"
}`;
    } else {
      // Mes completo
      userPrompt = `Creá el plan de contenido para el mes completo a partir de ${fechaInicio}.

${enfoqueMes ? `ENFOQUE DEL MES: ${enfoqueMes}` : 'Definí vos el enfoque/tema central del mes'}

REGLAS:
1. 4-5 semanas de contenido
2. Cada semana tiene un mini-tema que conecta con el tema del mes
3. Los jueves SIEMPRE son de duendes
4. Variedad de categorías a lo largo del mes
5. Crescendo: el contenido más potente hacia fin de mes
6. Un contenido ESPECIAL de fin de mes (más largo, más profundo)

${temasExcluir.length > 0 ? `TEMAS DEL MES ANTERIOR (evitar repetir): ${temasExcluir.join(', ')}` : ''}

Formato JSON:
{
  "mes": "Nombre del mes",
  "temaDelMes": "El hilo conductor",
  "porQueEsteTema": "Razón energética/estacional/relevante",
  "semanas": [
    {
      "numero": 1,
      "miniTema": "",
      "contenidos": [
        {
          "dia": "lunes",
          "fecha": "YYYY-MM-DD",
          "titulo": "",
          "categoria": "",
          "tipo": "",
          "descripcion": "",
          "gancho": ""
        }
      ]
    }
  ],
  "contenidoEspecial": {
    "titulo": "",
    "tipo": "",
    "descripcion": "",
    "porQueEspecial": ""
  },
  "proximoMesAnticipo": "Pista de qué viene el mes siguiente"
}`;
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
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic error:', response.status, errorData);
      return Response.json({
        success: false,
        error: `Error API: ${response.status}`
      }, { status: 500 });
    }

    const data = await response.json();
    const contenidoRaw = data.content?.[0]?.text || '';

    // Intentar parsear JSON
    let calendario;
    try {
      // Extraer JSON del texto
      const jsonMatch = contenidoRaw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        calendario = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se encontró JSON válido');
      }
    } catch (parseError) {
      // Si no parsea, devolver el texto raw
      return Response.json({
        success: true,
        raw: true,
        contenido: contenidoRaw,
        mensaje: 'No se pudo parsear como JSON, devolviendo texto'
      });
    }

    return Response.json({
      success: true,
      calendario,
      periodo,
      fechaGeneracion: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: error.message || 'Error desconocido'
    }, { status: 500 });
  }
}

// GET - Obtener temas trending y estructura
export async function GET() {
  return Response.json({
    success: true,
    temasTrending: TEMAS_TRENDING,
    estructuraSemanal: ESTRUCTURA_SEMANAL,
    energiaLunar: ENERGIA_LUNAR,
    categorias: Object.keys(TEMAS_TRENDING)
  });
}
