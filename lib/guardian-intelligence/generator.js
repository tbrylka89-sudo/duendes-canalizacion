/**
 * GUARDIAN INTELLIGENCE - GENERADOR DE HISTORIAS
 * Crea historias únicas que no repiten NADA del catálogo
 */

import Anthropic from '@anthropic-ai/sdk';
import { SINCRODESTINOS, ESTRUCTURAS, EXPERIENCIAS_HUMANAS, VOCABULARIO, GI_CONFIG } from './config.js';
import { analizarHistoria, calcularSimilitud } from './analyzer.js';

const anthropic = new Anthropic();

// ═══════════════════════════════════════════════════════════════
// SELECCIÓN INTELIGENTE
// ═══════════════════════════════════════════════════════════════

/**
 * Selecciona un sincrodestino único de la categoría apropiada
 */
export function seleccionarSincrodestino(categoria, sincrodestinosUsados = [], nombre = '') {
  // Mapear categoría a tipos de sincrodestinos más apropiados
  const mapeoCategoria = {
    'proteccion': ['animales', 'clima', 'tecnologia'],
    'abundancia': ['objetos', 'personas', 'naturaleza'],
    'amor': ['personas', 'animales', 'sueños'],
    'salud': ['naturaleza', 'animales', 'sueños'],
    'sabiduria': ['sueños', 'objetos', 'personas'],
    'sanacion': ['naturaleza', 'animales', 'personas']
  };

  const tiposPreferidos = mapeoCategoria[categoria?.toLowerCase()] || Object.keys(SINCRODESTINOS.permitidos);

  // Recopilar todos los sincrodestinos disponibles de los tipos preferidos
  let disponibles = [];
  for (const tipo of tiposPreferidos) {
    if (SINCRODESTINOS.permitidos[tipo]) {
      disponibles = disponibles.concat(
        SINCRODESTINOS.permitidos[tipo].map(s => ({
          texto: s.replace('{nombre}', nombre),
          tipo
        }))
      );
    }
  }

  // Filtrar los ya usados
  disponibles = disponibles.filter(s => {
    for (const usado of sincrodestinosUsados) {
      if (calcularSimilitud(s.texto, usado) > 50) {
        return false;
      }
    }
    return true;
  });

  // Si no hay disponibles, usar de cualquier categoría
  if (disponibles.length === 0) {
    for (const [tipo, sincros] of Object.entries(SINCRODESTINOS.permitidos)) {
      disponibles = disponibles.concat(
        sincros.map(s => ({ texto: s.replace('{nombre}', nombre), tipo }))
      );
    }
  }

  // Seleccionar uno al azar
  if (disponibles.length === 0) {
    return null;
  }

  return disponibles[Math.floor(Math.random() * disponibles.length)];
}

/**
 * Selecciona una estructura diferente a las últimas usadas
 */
export function seleccionarEstructura(estructurasUsadasRecientes = []) {
  const estructurasDisponibles = Object.keys(ESTRUCTURAS);

  // Filtrar las usadas recientemente
  const disponibles = estructurasDisponibles.filter(e => !estructurasUsadasRecientes.includes(e));

  if (disponibles.length === 0) {
    // Si todas fueron usadas, elegir cualquiera
    return estructurasDisponibles[Math.floor(Math.random() * estructurasDisponibles.length)];
  }

  return disponibles[Math.floor(Math.random() * disponibles.length)];
}

/**
 * Selecciona experiencias humanas relevantes para la categoría
 */
export function seleccionarExperiencias(categoria, cantidad = 2) {
  const mapeoCategoria = {
    'proteccion': ['familia', 'identidad', 'salud'],
    'abundancia': ['dinero', 'identidad'],
    'amor': ['amor', 'identidad'],
    'salud': ['salud', 'identidad', 'espiritual'],
    'sabiduria': ['espiritual', 'identidad'],
    'sanacion': ['familia', 'salud', 'amor']
  };

  const tiposRelevantes = mapeoCategoria[categoria?.toLowerCase()] || Object.keys(EXPERIENCIAS_HUMANAS);

  let experiencias = [];
  for (const tipo of tiposRelevantes) {
    if (EXPERIENCIAS_HUMANAS[tipo]) {
      experiencias = experiencias.concat(EXPERIENCIAS_HUMANAS[tipo]);
    }
  }

  // Mezclar y seleccionar
  experiencias.sort(() => Math.random() - 0.5);
  return experiencias.slice(0, cantidad);
}

// ═══════════════════════════════════════════════════════════════
// GENERACIÓN CON CLAUDE
// ═══════════════════════════════════════════════════════════════

/**
 * Genera una historia única para un guardián
 */
export async function generarHistoriaUnica(datosGuardian, contexto = {}) {
  const {
    nombre,
    tipo = 'guardián',
    categoria = 'proteccion',
    genero = 'M',
    tamano = 'mediano',
    accesorios = [],
    tamanoCm = 18
  } = datosGuardian;

  const {
    frasesUsadas = [],
    sincrodestinosUsados = [],
    estructurasRecientes = [],
    historiasExistentes = []
  } = contexto;

  // Seleccionar elementos únicos
  const sincrodestino = seleccionarSincrodestino(categoria, sincrodestinosUsados, nombre);
  const estructuraKey = seleccionarEstructura(estructurasRecientes);
  const estructura = ESTRUCTURAS[estructuraKey];
  const experiencias = seleccionarExperiencias(categoria);

  // Determinar género gramatical
  const articulo = genero === 'F' ? 'una' : 'un';
  const pronombre = genero === 'F' ? 'ella' : 'él';
  const adjetivo = genero === 'F' ? 'a' : 'o';

  // Construir lista de frases a evitar
  const frasesEvitar = [
    ...frasesUsadas.slice(0, 50), // Últimas 50 frases
    ...VOCABULARIO.frases_prohibidas_ia,
    ...SINCRODESTINOS.prohibidos
  ].join('\n- ');

  // Construir prompt
  const prompt = `Eres un escritor experto creando historias únicas para guardianes artesanales de Duendes del Uruguay.

DATOS DEL GUARDIÁN:
- Nombre: ${nombre}
- Tipo: ${tipo}
- Categoría: ${categoria}
- Género: ${genero === 'F' ? 'Femenino' : 'Masculino'}
- Tamaño: ${tamano} (${tamanoCm} cm)
- Accesorios REALES (SOLO mencionar estos, NO inventar otros): ${accesorios.join(', ') || 'ninguno especificado'}

ESTRUCTURA A USAR: ${estructura.nombre}
${estructura.descripcion}

SINCRODESTINO SUGERIDO (adaptarlo de forma única):
"${sincrodestino?.texto || 'Crear uno realista y único'}"

EXPERIENCIAS HUMANAS PARA CONECTAR (elegir 1-2):
- ${experiencias.join('\n- ')}

REGLAS ABSOLUTAS - SEGUIR AL PIE DE LA LETRA:

1. SINCRODESTINO: Debe ser algo que PUEDA PASAR en la realidad física. Nada de fantasía irreal.
   - BIEN: "Una mariposa entró y se posó sobre ${pronombre}"
   - MAL: "Llovieron tréboles del techo"

2. ACCESORIOS: SOLO mencionar los de la lista. Si dice "${accesorios[0] || 'amatista'}", hablar de eso. NO inventar.

3. LENGUAJE: Español rioplatense (vos, tenés, podés, sos). NUNCA tuteo (tú, tienes, puedes).

4. VOZ: Narrador del equipo de artesanos. Usar "nos contó", "canalizamos", "el taller".
   NUNCA nombres individuales como "Thibisay" o "Gabriel".

5. CONEXIÓN EMOCIONAL: La historia debe tocar experiencias humanas REALES.

6. NO USAR ESTAS FRASES (ya están en otras historias):
- ${frasesEvitar.slice(0, 1000)}

7. UNICIDAD: Cada frase debe ser ÚNICA. No repetir estructuras, metáforas o expresiones de otras historias.

FORMATO DE SALIDA:
Escribir la historia directamente, sin explicaciones. Solo la historia lista para publicar.
Longitud: 250-400 palabras.
${estructura.nombre === 'Carta del guardián' ? 'Escribir en primera persona como si el guardián escribiera.' : ''}
${estructura.nombre === 'Segunda persona' ? 'Dirigirse a "vos" directamente todo el tiempo.' : ''}

HISTORIA:`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      temperature: 0.9, // Alta temperatura para creatividad
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const historiaGenerada = response.content[0].text.trim();

    // Validar la historia generada
    const validacion = analizarHistoria(historiaGenerada, accesorios);

    // Si tiene problemas críticos, intentar regenerar una vez
    if (validacion.puntaje < 60 && contexto.intentos !== 2) {
      console.log(`[GI] Historia con puntaje bajo (${validacion.puntaje}), regenerando...`);
      return generarHistoriaUnica(datosGuardian, {
        ...contexto,
        intentos: (contexto.intentos || 0) + 1
      });
    }

    return {
      historia: historiaGenerada,
      validacion,
      metadata: {
        estructuraUsada: estructuraKey,
        sincrodestinoBase: sincrodestino?.tipo,
        experienciasUsadas: experiencias,
        intentos: contexto.intentos || 1
      }
    };

  } catch (error) {
    console.error('[GI] Error generando historia:', error);
    throw error;
  }
}

/**
 * Reescribe una sección problemática de una historia
 */
export async function reescribirSeccion(seccionActual, problema, contexto = {}) {
  const { tipo, alternativas = [] } = problema;

  const prompt = `Eres un escritor experto. Debes reescribir una sección de una historia de guardián.

SECCIÓN ACTUAL (tiene problemas):
"${seccionActual}"

PROBLEMA DETECTADO: ${problema.mensaje}

${alternativas.length > 0 ? `ALTERNATIVAS SUGERIDAS: ${alternativas.join(', ')}` : ''}

REGLAS:
- Mantener la ESENCIA y el SIGNIFICADO
- Usar vocabulario COMPLETAMENTE diferente
- Español rioplatense (vos, tenés)
- NO usar frases genéricas de IA
- Si es un sincrodestino, debe ser REALISTA (algo que puede pasar de verdad)

REESCRIBIR (solo el texto nuevo, sin explicaciones):`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      temperature: 0.8,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return response.content[0].text.trim();

  } catch (error) {
    console.error('[GI] Error reescribiendo sección:', error);
    throw error;
  }
}

/**
 * Genera SEO optimizado para un producto
 */
export async function generarSEO(datosProducto) {
  const {
    nombre,
    tipo = 'guardián',
    categoria = 'protección',
    descripcion = '',
    precio
  } = datosProducto;

  // Focus keyword corta (máximo 3 palabras para mejor puntaje Rank Math)
  const focusKeyword = `${tipo} ${categoria}`.toLowerCase().slice(0, 30);

  // Meta description optimizada
  const metaDescription = `${nombre} es ${tipo === 'duende' ? 'un duende' : tipo === 'bruja' ? 'una bruja' : 'un guardián'} de ${categoria}. Pieza única hecha a mano en Uruguay con cristales reales. Envío internacional.`.slice(0, 155);

  // Título SEO
  const tituloSEO = `${nombre} - ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} de ${categoria.charAt(0).toUpperCase() + categoria.slice(1)} | Duendes del Uruguay`.slice(0, 60);

  // Schema markup sugerido
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": nombre,
    "description": metaDescription,
    "brand": {
      "@type": "Brand",
      "name": "Duendes del Uruguay"
    },
    "offers": {
      "@type": "Offer",
      "price": precio || 0,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Duendes del Uruguay"
      }
    }
  };

  return {
    focusKeyword,
    metaDescription,
    tituloSEO,
    schema,
    sugerencias: [
      `Asegurarse de que "${focusKeyword}" aparezca en el primer párrafo`,
      'Agregar al menos una imagen con alt text que incluya el focus keyword',
      'Usar subtítulos H2/H3 con variaciones del keyword'
    ]
  };
}

export default {
  seleccionarSincrodestino,
  seleccionarEstructura,
  seleccionarExperiencias,
  generarHistoriaUnica,
  reescribirSeccion,
  generarSEO
};
