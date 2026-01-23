/**
 * GUARDIAN INTELLIGENCE - GENERADOR DE HISTORIAS v2
 * Crea narrativas FLUIDAS y ÚNICAS - no templates
 */

import Anthropic from '@anthropic-ai/sdk';
import { SINCRODESTINOS, ESTRUCTURAS, EXPERIENCIAS_HUMANAS, VOCABULARIO, GI_CONFIG, HOOKS_APERTURA, PATRONES_APERTURA, APERTURAS_PROHIBIDAS_SIEMPRE } from './config.js';
import { analizarHistoria, calcularSimilitud } from './analyzer.js';
import productosBase from './productos-base.json' with { type: 'json' };

// ═══════════════════════════════════════════════════════════════
// BASE DE DATOS DE PRODUCTOS REALES
// ═══════════════════════════════════════════════════════════════

/**
 * Busca datos reales de un producto por nombre
 */
export function buscarProductoReal(nombre) {
  if (!nombre) return null;

  const nombreNormalizado = nombre.toLowerCase()
    .replace(' pixie', '')
    .replace(' Pixie', '')
    .trim();

  const producto = productosBase.productos.find(p =>
    p.nombre.toLowerCase().includes(nombreNormalizado) ||
    nombreNormalizado.includes(p.nombre.toLowerCase())
  );

  return producto || null;
}

/**
 * Determina si un producto es único o recreable
 */
export function esProductoUnico(producto, nombre) {
  if (!producto && !nombre) return true; // Por defecto único

  const nombreLower = (nombre || producto?.nombre || '').toLowerCase();

  // Pixies son SIEMPRE únicas
  if (nombreLower.includes('pixie') || producto?.tipo === 'pixie') {
    return true;
  }

  // Arquetipos históricos son recreables
  const arquetipos = ['leprechaun', 'merlín', 'merlin', 'gandalf', 'aradia', 'morgana'];
  for (const arq of arquetipos) {
    if (nombreLower.includes(arq)) return false; // Recreable
  }

  // Por tamaño
  const tamano = producto?.tamano?.toLowerCase() || '';
  if (tamano === 'mini' || tamano === 'mini especial') {
    return false; // Recreables
  }

  // Todo lo demás es único
  return true;
}

/**
 * Obtiene la descripción del tipo de ser
 */
export function obtenerDescripcionTipo(tipo) {
  if (!tipo) return null;

  const tipoLower = tipo.toLowerCase();
  const tipoInfo = productosBase.tipos[tipoLower];

  if (tipoInfo) {
    return tipoInfo.descripcion;
  }

  return null;
}

/**
 * Obtiene el diferenciador de marca (canalización)
 */
export function obtenerDiferenciadorMarca() {
  return productosBase.DIFERENCIADOR_MARCA?.canalizacion?.descripcion ||
    'Cada guardián es canalizado de manera consciente y voluntaria. No es una artesanía - es un ser que elige nacer.';
}

const anthropic = new Anthropic();

// ═══════════════════════════════════════════════════════════════
// SELECCIÓN INTELIGENTE DE ELEMENTOS
// ═══════════════════════════════════════════════════════════════

/**
 * Selecciona un sincrodestino ÚNICO que no esté gastado
 */
export function seleccionarSincrodestino(categoria, sincrodestinosUsados = [], nombre = '') {
  const mapeoCategoria = {
    'proteccion': ['animales', 'clima', 'tecnologia', 'objetos'],
    'abundancia': ['objetos', 'personas', 'naturaleza', 'sueños'],
    'amor': ['personas', 'animales', 'sueños', 'naturaleza'],
    'salud': ['naturaleza', 'animales', 'sueños'],
    'sabiduria': ['sueños', 'objetos', 'personas', 'tecnologia'],
    'sanacion': ['naturaleza', 'animales', 'personas', 'clima']
  };

  const tiposPreferidos = mapeoCategoria[categoria?.toLowerCase()] || Object.keys(SINCRODESTINOS.permitidos);

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

  // Filtrar los ya usados y los gastados
  const gastados = [
    'plantas florecieron', 'mariposa entró', 'pétalos', 'rosa apareció',
    'flores en macetas', 'polilla', 'aroma a rosas'
  ];

  disponibles = disponibles.filter(s => {
    const textoLower = s.texto.toLowerCase();

    // No usar si está gastado
    for (const gastado of gastados) {
      if (textoLower.includes(gastado)) return false;
    }

    // No usar si es muy similar a uno ya usado
    for (const usado of sincrodestinosUsados) {
      if (calcularSimilitud(s.texto, usado) > 50) return false;
    }

    return true;
  });

  if (disponibles.length === 0) {
    // Si no hay disponibles, usar cualquiera que no esté gastado
    for (const [tipo, sincros] of Object.entries(SINCRODESTINOS.permitidos)) {
      for (const s of sincros) {
        const texto = s.replace('{nombre}', nombre);
        let esGastado = false;
        for (const gastado of gastados) {
          if (texto.toLowerCase().includes(gastado)) {
            esGastado = true;
            break;
          }
        }
        if (!esGastado) {
          disponibles.push({ texto, tipo });
        }
      }
    }
  }

  if (disponibles.length === 0) return null;
  return disponibles[Math.floor(Math.random() * disponibles.length)];
}

/**
 * Selecciona experiencias humanas relevantes para conectar
 */
export function seleccionarExperiencias(categoria, cantidad = 3) {
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

  experiencias.sort(() => Math.random() - 0.5);
  return experiencias.slice(0, cantidad);
}

/**
 * Selecciona detalles de vida cotidiana VARIABLES para cada historia
 * NO siempre los mismos - varía para que sea creíble
 */
export function seleccionarDetallesVida() {
  const momentos = [
    'una mañana de lluvia en el taller',
    'una tarde de sol entrando por la ventana',
    'una noche tranquila mientras todo dormía',
    'un domingo por la mañana',
    'después de una semana complicada',
    'un día que empezó sin nada especial',
    'una tarde de esas en las que no sabés qué esperar',
    'un amanecer de esos que te obligan a parar',
    'una noche de luna llena',
    'una mañana fría de invierno',
    'una siesta interrumpida por una idea'
  ];

  const ambientes = [
    'con el mate de por medio',
    'mientras sonaba música de fondo',
    'en silencio total',
    'con la estufa encendida',
    'con la ventana abierta al jardín',
    'mientras llovía afuera',
    'con olor a incienso',
    'con el perro echado cerca',
    'mientras el sol se ponía',
    'en la calma del mediodía'
  ];

  const contextos = [
    '', // A veces sin contexto extra
    '',
    'los nenes andaban dibujando en la otra pieza',
    'estábamos solos en casa',
    'todo estaba en calma',
    'había sido un día largo',
    'veníamos de una semana intensa',
    'el taller estaba más ordenado que nunca',
    'algo en el aire se sentía distinto'
  ];

  return {
    momento: momentos[Math.floor(Math.random() * momentos.length)],
    ambiente: ambientes[Math.floor(Math.random() * ambientes.length)],
    contexto: contextos[Math.floor(Math.random() * contextos.length)]
  };
}

/**
 * Selecciona un TONO para la historia - algunos más casuales, otros más místicos
 */
export function seleccionarTono() {
  const tonos = [
    {
      nombre: 'descontracturado',
      descripcion: 'Casual, directo, como presentando un amigo. Ej: "Él es Yrvin, llegó para ser la llave que abre todas las puertas que tenés trancadas"',
      intro: 'directo al grano, como si presentaras a alguien'
    },
    {
      nombre: 'narrativo',
      descripcion: 'Cuenta una historia, más elaborado pero sin ser pomposo',
      intro: 'como contando una anécdota interesante'
    },
    {
      nombre: 'intimo',
      descripcion: 'Como una confesión, algo personal que compartimos',
      intro: 'como si compartieras un secreto'
    },
    {
      nombre: 'energetico',
      descripcion: 'Con entusiasmo, transmitiendo la emoción de la canalización',
      intro: 'con energía y emoción genuina'
    }
  ];
  return tonos[Math.floor(Math.random() * tonos.length)];
}

/**
 * Selecciona un hook de apertura ÚNICO por categoría
 * Ahora incluye nombre para hooks que empiezan desde el guardián
 */
export function seleccionarHookApertura(categoria, hooksUsados = [], nombre = '') {
  const categoriaKey = categoria?.toLowerCase().replace(/[áéíóú]/g, m =>
    ({á:'a',é:'e',í:'i',ó:'o',ú:'u'})[m]
  ) || 'proteccion';

  const hooksCategoria = HOOKS_APERTURA[categoriaKey] || HOOKS_APERTURA.proteccion;

  // Filtrar hooks ya usados recientemente
  const disponibles = hooksCategoria.filter(h => {
    const hookLower = h.toLowerCase();
    for (const usado of hooksUsados) {
      if (calcularSimilitud(hookLower, usado.toLowerCase()) > 60) return false;
    }
    return true;
  });

  let hookSeleccionado;
  if (disponibles.length === 0) {
    hookSeleccionado = hooksCategoria[Math.floor(Math.random() * hooksCategoria.length)];
  } else {
    hookSeleccionado = disponibles[Math.floor(Math.random() * disponibles.length)];
  }

  // Reemplazar {nombre} si existe en el hook
  return hookSeleccionado.replace(/{nombre}/g, nombre || 'este guardián');
}

/**
 * Verifica si una historia empieza con una frase SIEMPRE prohibida (IA genérica)
 */
export function tieneAperturaProhibida(historia) {
  if (!historia) return false;
  const inicio = historia.toLowerCase().slice(0, 150);

  for (const prohibida of APERTURAS_PROHIBIDAS_SIEMPRE) {
    if (inicio.includes(prohibida.toLowerCase())) {
      return true;
    }
  }
  return false;
}

/**
 * Detecta qué patrón de apertura usa una historia
 * Retorna el nombre del patrón o null si no coincide con ninguno conocido
 */
export function detectarPatronApertura(historia) {
  if (!historia) return null;
  const inicio = historia.toLowerCase().slice(0, 100);

  for (const [patron, frases] of Object.entries(PATRONES_APERTURA)) {
    for (const frase of frases) {
      if (inicio.includes(frase.toLowerCase())) {
        return patron;
      }
    }
  }
  return null;
}

/**
 * Verifica si un patrón se usó recientemente (últimas 15 historias GLOBALES)
 */
export function patronUsadoRecientemente(patron, patronesRecientes = []) {
  if (!patron || patronesRecientes.length === 0) return false;
  return patronesRecientes.slice(0, 15).includes(patron);
}

/**
 * Selecciona un estilo narrativo diferente cada vez
 */
export function seleccionarEstiloNarrativo() {
  const estilos = [
    {
      nombre: 'reflexion_primero',
      descripcion: 'Empieza con una reflexión sobre el proceso, luego cuenta la historia',
      apertura: 'Una reflexión sobre lo que significa crear este guardián'
    },
    {
      nombre: 'sincrodestino_primero',
      descripcion: 'Abre con el momento mágico que pasó, luego explica quién es',
      apertura: 'El momento inexplicable que ocurrió durante su creación'
    },
    {
      nombre: 'mensaje_primero',
      descripcion: 'Empieza directo con el mensaje del guardián, luego cuenta quién es',
      apertura: 'Las palabras que el guardián quiso transmitir'
    },
    {
      nombre: 'cliente_primero',
      descripcion: 'Empieza identificando al cliente, luego presenta al guardián',
      apertura: 'Descripción de para quién es este guardián'
    },
    {
      nombre: 'sensorial',
      descripcion: 'Empieza describiendo lo que se sintió en el taller',
      apertura: 'Las sensaciones físicas durante la canalización'
    },
    {
      nombre: 'diario',
      descripcion: 'Como entradas de un diario del proceso',
      apertura: 'Registro íntimo del proceso de creación'
    }
  ];

  return estilos[Math.floor(Math.random() * estilos.length)];
}

// ═══════════════════════════════════════════════════════════════
// GENERACIÓN CON CLAUDE - NARRATIVA FLUIDA
// ═══════════════════════════════════════════════════════════════

/**
 * Genera una historia FLUIDA y ÚNICA para un guardián
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
    historiasExistentes = [],
    hooksUsados = [],
    scoreAnterior = 0  // Para regeneración: solo aceptar si mejora
  } = contexto;

  // Buscar datos reales del producto
  const productoReal = buscarProductoReal(nombre);
  const accesoriosReales = productoReal?.accesorios || accesorios;
  const tipoReal = productoReal?.tipo || tipo;
  const esUnico = esProductoUnico(productoReal, nombre);
  const descripcionTipo = obtenerDescripcionTipo(tipoReal);
  const diferenciadorMarca = obtenerDiferenciadorMarca();

  // Seleccionar elementos únicos
  const sincrodestino = seleccionarSincrodestino(categoria, sincrodestinosUsados, nombre);
  const experiencias = seleccionarExperiencias(categoria);
  const estilo = seleccionarEstiloNarrativo();
  const detallesVida = seleccionarDetallesVida();
  const tono = seleccionarTono();
  const hookApertura = seleccionarHookApertura(categoria, hooksUsados, nombre);

  // Género gramatical
  const articulo = genero === 'F' ? 'una' : 'un';
  const pronombre = genero === 'F' ? 'ella' : 'él';
  const adjetivo = genero === 'F' ? 'a' : 'o';

  // Construir prompt para narrativa FLUIDA
  const prompt = `Sos parte del equipo de artesanos de Duendes del Uruguay - una familia que hace 10 años canaliza guardianes desde Piriápolis, Uruguay. Escribís historias como si contaras una experiencia REAL a un amigo cercano.

CONTEXTO (usá SOLO estos detalles para esta historia, NO inventes otros):
- Vivimos en Piriápolis, Uruguay
- Este guardián nació ${detallesVida.momento}, ${detallesVida.ambiente}${detallesVida.contexto ? '. ' + detallesVida.contexto : ''}
- Después de 10 años canalizando, aprendimos a notar las señales
- Contamos todo de manera CASUAL, como anécdotas de vida real

IMPORTANTE - VARIEDAD:
- NO menciones hijos/nenes a menos que esté en el contexto de arriba
- NO menciones mate a menos que esté en el contexto de arriba
- NO repitas siempre los mismos elementos - cada historia es única
- NO uses "en el taller" en cada historia - variá los espacios

TONO DE ESTA HISTORIA: ${tono.nombre.toUpperCase()}
${tono.descripcion}
Escribí ${tono.intro}.

⭐ HOOK DE APERTURA SUGERIDO (usalo, varialo, o creá uno similar):
"${hookApertura}"

📌 ESTA HISTORIA DEBE SER ÚNICA - NO COPY-PASTE:
Cada guardián es como una persona diferente. Esta historia NO puede sonar igual a otras.

**EMPEZÁ DESDE EL GUARDIÁN Y SUS PODERES ESPECÍFICOS:**
- ¿Qué hace ${nombre} específicamente? ¿Cuál es su don particular?
- ¿Qué trae? ¿Qué energía transmite? ¿Qué vino a aportar?
- Contá su historia, su personalidad, lo que lo hace ÚNICO
- La conexión con la persona viene DESPUÉS, no al principio

**NO empezar dramático/depresivo.** Variá:
- Desde el guardián y lo que trae
- Desde una anécdota de cómo llegó al taller
- Desde sus poderes y cómo ayuda
- Desde el sincrodestino que pasó

❌ PROHIBIDO - NO USES ESTOS PATRONES:
- "${nombre} no vino a darte consejos, no vino a X, no vino a Y..." (REPETITIVO)
- Empezar siempre con el dolor de la persona
- Frases depresivas de entrada ("Hay quienes cargan...", "El peso de...")
- "En lo profundo del bosque..." / "Las brumas del..."
- "Desde tiempos inmemoriales..." / "El velo entre mundos..."

DATOS DEL GUARDIÁN:
- Nombre: ${nombre}
- Tipo: ${tipoReal}${descripcionTipo ? ` (${descripcionTipo})` : ''}
- Categoría: ${categoria}
- Género: ${genero === 'F' ? 'Femenino' : 'Masculino'}
- Tamaño: ${tamano} (${tamanoCm || 18} cm)
- Accesorios REALES (SOLO estos): ${typeof accesoriosReales === 'string' ? accesoriosReales : (accesoriosReales.length > 0 ? accesoriosReales.join(', ') : 'ninguno especificado')}
- ${esUnico ? 'PIEZA ÚNICA - Una vez adoptada, desaparece del universo' : 'PIEZA RECREABLE - La magia está en que no sabés exactamente cómo va a ser el tuyo. Podemos canalizar su esencia nuevamente, cada rostro será único. ¡A ver cuál te elige!'}

SINCRODESTINO/SEÑALES (contar de manera CASUAL, como anécdota):
"${sincrodestino?.texto || 'Inventar uno realista'}"
Ejemplos de cómo contarlo: "Esa semana aparecieron tréboles donde nunca había", "El perro se echó ahí y no se movió hasta que terminamos", "Encontramos una moneda antigua en el piso del taller", "Una mariquita se posó en la mesa y se quedó toda la tarde", "Justo cuando terminábamos el rostro, se largó a llover después de semanas de sequía"
NO contarlo de manera solemne - es parte de nuestra vida cotidiana después de 10 años

EXPERIENCIAS DEL CLIENTE PARA CONECTAR:
- ${experiencias.join('\n- ')}

═══════════════════════════════════════════════════════════════
ESTILO NARRATIVO: ${estilo.nombre.toUpperCase()}
${estilo.descripcion}
═══════════════════════════════════════════════════════════════

REGLAS ABSOLUTAS - LEÉ CON ATENCIÓN:

1. CADA HISTORIA ES ÚNICA COMO CADA HUMANO:
   - ${nombre} NO es igual a otro guardián - tiene poderes y personalidad PROPIOS
   - NO uses headers como "QUÉ TE APORTA", "CÓMO NACIÓ"
   - NO uses viñetas ni listas
   - NO empieces siempre igual (no "Hay personas que...", no "El dolor de...")
   - Contá la historia de ESTE guardián específico, no una genérica
   - Si leyeras 5 historias seguidas, CADA UNA debe sentirse diferente

2. VOZ:
   - Primera parte: "nosotros/nos/el equipo/en el taller" (los canalizadores)
   - El mensaje del guardián: en PRIMERA PERSONA ("yo", "mi", "soy")
   - NUNCA nombres propios (Thi, Gabriel)

3. ELEMENTOS A INCLUIR (tejidos naturalmente, NO como secciones):
   - Cómo fue la experiencia de crearlo (desde "nosotros")
   - El sincrodestino (momento mágico realista)
   - Para quién es (conectar con problemas específicos del cliente)
   - El mensaje del guardián (ver regla especial abajo)
   - Qué cuentan quienes lo adoptaron (prueba social)
   - Un cierre que invite sin ser agresivo

⭐ EL MENSAJE DEL GUARDIÁN - DESDE SU VOZ ÚNICA:
   - En primera persona, entre <em></em>
   - NO explicar que es un mensaje - solo ponerlo, se entiende solo
   - CADA GUARDIÁN HABLA DIFERENTE según su personalidad:
     * Uno puede ser directo y firme
     * Otro puede ser tierno y suave
     * Otro puede ser juguetón
     * Otro puede ser sabio y pausado
   - NO siempre hablar del dolor. Puede hablar de:
     * Lo que viene a traer/aportar
     * Una invitación
     * Una promesa
     * Un recordatorio positivo

4. IDIOMA:
   - Español rioplatense: vos, tenés, podés, sentís, mirás
   - NUNCA tuteo español (tú, tienes, puedes)

5. ACCESORIOS:
   - SOLO mencionar los de la lista
   - NO inventar cristales, capas, bastones que no existan

6. PROHIBIDO (frases de IA barata):
   - "En lo profundo del bosque"
   - "Desde tiempos inmemoriales"
   - "Las brumas del otoño/la bruma"
   - "Un manto de estrellas"
   - "El susurro del viento ancestral"
   - "Brisa fresca", "brisa cálida", cualquier brisa
   - Plantas que florecen, mariposas que entran, pétalos que caen
   - NUNCA llamar "hada" a una pixie - las pixies NO son hadas

7. LÓGICA Y CREDIBILIDAD:
   - EDAD: Nunca decir "tiene X años". Decir "nos transmitió su edad álmica" o variaciones creativas
   - DETALLES FÍSICOS: No decir que algo "apareció solo" - decir que "pareció aparecer" (más creíble, como lo vivimos)
   - VAMPIROS: Si mencionás energías vampíricas, aclarar que son "vampiros energéticos" para que no piensen en vampiros literales
   - PIEZAS ÚNICAS: Si es pieza única, NO decir "las personas que la adoptaron" (error de lógica). Decir "quienes llevaron seres similares en esencia" o "quienes adoptaron guardianes de protección"

8. SI ES PIXIE:
   - Son seres de la naturaleza, almas salvajes, tiernas y honestas
   - Eternas niñas tiernas de las plantas, hierbas y flores
   - Habitan en ellas, portan flores
   - Cada una es ÚNICA con poderes diferentes
   - NUNCA decir "hada" ni comparar con hadas

FORMATO: HTML con <p>, <em> para el mensaje canalizado en cursiva, <strong> para énfasis. NO <ul>, NO <li>, NO headers.

Escribí la historia de ${nombre} de forma ÚNICA, FLUIDA, HUMANA:`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.85, // Balance entre creatividad y consistencia
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

    // Verificar apertura siempre prohibida (IA genérica)
    const tieneAperturaProh = tieneAperturaProhibida(historiaGenerada);
    if (tieneAperturaProh) {
      console.log(`[GI] Historia tiene apertura de IA genérica, regenerando...`);
      if (contexto.intentos < 3) {
        return generarHistoriaUnica(datosGuardian, {
          ...contexto,
          intentos: (contexto.intentos || 0) + 1,
          hooksUsados: [...(hooksUsados || []), hookApertura]
        });
      }
    }

    // Verificar si el patrón de apertura se usó muy recientemente
    const patronDetectado = detectarPatronApertura(historiaGenerada);
    const patronesRecientes = contexto.patronesRecientes || [];
    if (patronDetectado && patronUsadoRecientemente(patronDetectado, patronesRecientes)) {
      console.log(`[GI] Patrón "${patronDetectado}" usado recientemente, regenerando para variar...`);
      if (contexto.intentos < 3) {
        return generarHistoriaUnica(datosGuardian, {
          ...contexto,
          intentos: (contexto.intentos || 0) + 1,
          hooksUsados: [...(hooksUsados || []), hookApertura]
        });
      }
    }

    // Si tiene problemas críticos, intentar regenerar
    if (validacion.puntaje < 50 && contexto.intentos < 3) {
      console.log(`[GI] Historia con puntaje bajo (${validacion.puntaje}), regenerando...`);
      return generarHistoriaUnica(datosGuardian, {
        ...contexto,
        intentos: (contexto.intentos || 0) + 1,
        hooksUsados: [...(hooksUsados || []), hookApertura]
      });
    }

    // Si es regeneración y el score es PEOR que el anterior, rechazar
    if (scoreAnterior > 0 && validacion.puntaje < scoreAnterior) {
      console.log(`[GI] Score nuevo (${validacion.puntaje}) menor que anterior (${scoreAnterior}), regenerando...`);
      if (contexto.intentos < 3) {
        return generarHistoriaUnica(datosGuardian, {
          ...contexto,
          intentos: (contexto.intentos || 0) + 1,
          scoreAnterior,
          hooksUsados: [...(hooksUsados || []), hookApertura]
        });
      }
    }

    return {
      historia: historiaGenerada,
      validacion,
      metadata: {
        estiloUsado: estilo.nombre,
        sincrodestinoBase: sincrodestino?.tipo,
        experienciasUsadas: experiencias,
        hookUsado: hookApertura,
        patronApertura: patronDetectado,  // Para trackear y rotar
        intentos: contexto.intentos || 1
      }
    };

  } catch (error) {
    console.error('[GI] Error generando historia:', error);
    throw error;
  }
}

/**
 * Corrige una historia existente manteniendo su esencia
 */
export async function corregirHistoria(historiaActual, problemas, datosGuardian, contexto = {}) {
  const {
    nombre,
    tipo = 'guardián',
    categoria = 'proteccion',
    genero = 'M',
    accesorios = []
  } = datosGuardian;

  // Buscar datos reales del producto
  const productoReal = buscarProductoReal(nombre);
  const accesoriosReales = productoReal?.accesorios || accesorios;
  const tipoReal = productoReal?.tipo || tipo;
  const esUnico = esProductoUnico(productoReal, nombre);
  const descripcionTipo = obtenerDescripcionTipo(tipoReal);
  const diferenciadorMarca = obtenerDiferenciadorMarca();

  const pronombre = genero === 'F' ? 'ella' : 'él';

  // Extraer los problemas principales
  const problemasTexto = problemas
    .filter(p => p.severidad === 'critico' || p.severidad === 'alto')
    .map(p => `- ${p.mensaje}`)
    .join('\n');

  const sincrodestino = seleccionarSincrodestino(categoria, contexto.sincrodestinosUsados || [], nombre);
  const experiencias = seleccionarExperiencias(categoria);
  const detallesVida = seleccionarDetallesVida();
  const tono = seleccionarTono();

  const hookApertura = seleccionarHookApertura(categoria, contexto.hooksUsados || [], nombre);

  const prompt = `Sos editor del equipo de Duendes del Uruguay - una familia que hace 10 años canaliza guardianes desde Piriápolis. Tenés que REESCRIBIR esta historia para que sea fluida, humana y CERCANA.

CONTEXTO ESPECÍFICO PARA ESTA HISTORIA (usá SOLO estos detalles):
- Este guardián nació ${detallesVida.momento}, ${detallesVida.ambiente}${detallesVida.contexto ? '. ' + detallesVida.contexto : ''}
- Contamos como si hablaras con un amigo
- Las señales son parte de nuestra vida cotidiana

TONO: ${tono.nombre.toUpperCase()} - ${tono.descripcion}

⭐ HOOK DE APERTURA SUGERIDO (usalo o varialo):
"${hookApertura}"

📌 VARIEDAD: Empezá DIFERENTE a otras historias. Si muchas usan "¿Cuántas veces...?", usá otra estructura.

❌ SIEMPRE PROHIBIDO: "En lo profundo...", "Las brumas...", "Desde tiempos inmemoriales..."

IMPORTANTE - VARIEDAD:
- NO menciones hijos/nenes a menos que esté en el contexto de arriba
- NO menciones mate a menos que esté en el contexto de arriba
- NO uses "en el taller" en cada frase - variá
- Cada historia debe sentirse ÚNICA, no como plantilla

HISTORIA ACTUAL (tiene problemas):
${historiaActual}

PROBLEMAS DETECTADOS:
${problemasTexto}

DATOS DEL GUARDIÁN:
- Nombre: ${nombre}
- Tipo: ${tipoReal}${descripcionTipo ? ` (${descripcionTipo})` : ''}
- Categoría: ${categoria}
- Accesorios REALES: ${typeof accesoriosReales === 'string' ? accesoriosReales : (accesoriosReales.length > 0 ? accesoriosReales.join(', ') : 'no especificados')}
- ${esUnico ? 'PIEZA ÚNICA - Una vez adoptada, desaparece del universo' : 'PIEZA RECREABLE - Transmitir de forma POSITIVA: la magia está en no saber exactamente cómo va a ser el tuyo. Cada rostro es único. ¡A ver cuál te elige!'}

SINCRODESTINO NUEVO A USAR:
"${sincrodestino?.texto || 'Crear uno realista diferente al actual'}"

EXPERIENCIAS DEL CLIENTE:
- ${experiencias.join('\n- ')}

═══════════════════════════════════════════════════════════════
INSTRUCCIONES DE CORRECCIÓN:
═══════════════════════════════════════════════════════════════

1. ELIMINAR:
   - Headers como "QUÉ TE APORTA", "CÓMO NACIÓ"
   - Viñetas y listas
   - La intro "Esta es X. Tiene Y años..."
   - Sincrodestinos gastados (plantas, mariposas, pétalos)

2. AGREGAR (tejido naturalmente):
   - Voz "nosotros" contando la experiencia
   - EL GANCHO: mensaje del guardián que hace decir "este es para mí" (ver abajo)
   - Identificación con problemas del cliente
   - Prueba social (qué cuentan quienes lo adoptaron)
   - Cierre sutil

⭐ EL MENSAJE/GANCHO DEL GUARDIÁN:
   - Es lo que hace que alguien diga "ESTE es para mí"
   - Habla DIRECTO a un tipo de persona específica
   - CADA UNO DIFERENTE - no fórmulas repetidas
   - En primera persona, entre <em></em>
   - NO explicar - solo ponerlo
   - Ej: "Vengo por quien aprendió a callarse", "Busco a la que perdió la fe en sí misma"

3. MANTENER:
   - La esencia del guardián
   - Los accesorios reales mencionados
   - El tono místico pero terrenal

4. USAR:
   - Español rioplatense (vos, tenés, podés)
   - Narrativa fluida sin secciones
   - HTML: <p>, <em>, <strong>. NO <ul>, NO <li>

5. LÓGICA Y CREDIBILIDAD:
   - EDAD: No decir "tiene X años" directo. Decir "nos transmitió su edad álmica" o variaciones
   - DETALLES: No decir que algo "apareció solo" - decir que "pareció aparecer" (más creíble)
   - VAMPIROS: Si mencionás energías vampíricas, aclarar "vampiros energéticos"
   - PIEZAS ÚNICAS: Si es única, NO decir "las personas que la adoptaron". Decir "quienes llevaron seres similares en esencia"

6. SI ES PIXIE:
   - Son seres de la naturaleza, almas salvajes, tiernas y honestas
   - NUNCA llamarlas "hadas" - las pixies NO son hadas

7. PROHIBIDO (frases IA):
   - "brisa fresca/cálida", "brumas", "en lo profundo de", "manto de estrellas"

REESCRIBÍ la historia de ${nombre} corrigiendo todos los problemas:`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.85,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const historiaCorregida = response.content[0].text.trim();
    const validacion = analizarHistoria(historiaCorregida, accesorios);

    return {
      historia: historiaCorregida,
      validacion,
      metadata: {
        tipo: 'correccion',
        problemasOriginales: problemas.length,
        sincrodestinoNuevo: sincrodestino?.tipo
      }
    };

  } catch (error) {
    console.error('[GI] Error corrigiendo historia:', error);
    throw error;
  }
}

/**
 * Reescribe una sección específica
 */
export async function reescribirSeccion(seccionActual, problema, contexto = {}) {
  const { tipo, alternativas = [] } = problema;

  const prompt = `Reescribí esta sección de una historia de guardián.

SECCIÓN ACTUAL (tiene problemas):
"${seccionActual}"

PROBLEMA: ${problema.mensaje}

${alternativas.length > 0 ? `ALTERNATIVAS SUGERIDAS: ${alternativas.join(', ')}` : ''}

REGLAS:
- Mantener la ESENCIA y el SIGNIFICADO
- Vocabulario COMPLETAMENTE diferente
- Español rioplatense (vos, tenés)
- Si es sincrodestino, debe ser REALISTA
- NO frases genéricas de IA
- Fluido, humano, no robótico

REESCRIBIR (solo el texto nuevo):`;

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

  const focusKeyword = `${tipo} ${categoria}`.toLowerCase().slice(0, 30);

  const metaDescription = `${nombre} es ${tipo === 'duende' ? 'un duende' : tipo === 'bruja' ? 'una bruja' : tipo === 'pixie' ? 'una pixie' : 'un guardián'} de ${categoria}. Pieza única hecha a mano en Uruguay con cristales reales. Envío internacional.`.slice(0, 155);

  const tituloSEO = `${nombre} - ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} de ${categoria.charAt(0).toUpperCase() + categoria.slice(1)} | Duendes del Uruguay`.slice(0, 60);

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
      `Incluir "${focusKeyword}" en el primer párrafo`,
      'Agregar imagen con alt text que incluya el keyword',
      'Usar subtítulos H2/H3 con variaciones del keyword'
    ]
  };
}

export default {
  seleccionarSincrodestino,
  seleccionarExperiencias,
  seleccionarEstiloNarrativo,
  seleccionarHookApertura,
  tieneAperturaProhibida,
  detectarPatronApertura,
  patronUsadoRecientemente,
  generarHistoriaUnica,
  corregirHistoria,
  reescribirSeccion,
  generarSEO
};
