// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDAD: Personalización por Género
// Usado en todo el sistema para adaptar textos según el género del usuario
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Personaliza un texto según el género del usuario
 * @param {string} texto - Texto a personalizar (puede contener /a /e para marcadores)
 * @param {string} genero - 'ella', 'el', o 'neutro'
 * @returns {string} - Texto personalizado
 */
export function personalizarTexto(texto, genero) {
  if (!texto) return '';

  // Si no hay género o es masculino por defecto
  if (!genero || genero === 'el') {
    return texto
      .replace(/Bienvenid[oa]\/[ae]/gi, 'Bienvenido')
      .replace(/Bienvenid[oa]/gi, 'Bienvenido')
      .replace(/guardian[ae]\/[aeiou]/gi, 'guardián')
      .replace(/guardiana/gi, 'guardián')
      .replace(/guardiane/gi, 'guardián')
      .replace(/compañer[oa]\/[ae]/gi, 'compañero')
      .replace(/compañera/gi, 'compañero')
      .replace(/elegid[oa]\/[ae]/gi, 'elegido')
      .replace(/elegida/gi, 'elegido')
      .replace(/elegide/gi, 'elegido')
      .replace(/invitad[oa]\/[ae]/gi, 'invitado')
      .replace(/invitada/gi, 'invitado')
      .replace(/querid[oa]\/[ae]/gi, 'querido')
      .replace(/querida/gi, 'querido')
      .replace(/amadá\/o/gi, 'amado')
      .replace(/amada/gi, 'amado')
      .replace(/\/a\b/g, 'o')  // terminaciones genéricas /a -> o
      .replace(/\/e\b/g, 'o'); // terminaciones genéricas /e -> o
  }

  // Género femenino
  if (genero === 'ella') {
    return texto
      .replace(/Bienvenid[oa]\/[ae]/gi, 'Bienvenida')
      .replace(/Bienvenido/gi, 'Bienvenida')
      .replace(/guardian[ae]\/[aeiou]/gi, 'guardiana')
      .replace(/guardián/gi, 'guardiana')
      .replace(/guardiane/gi, 'guardiana')
      .replace(/compañer[oa]\/[ae]/gi, 'compañera')
      .replace(/compañero/gi, 'compañera')
      .replace(/elegid[oa]\/[ae]/gi, 'elegida')
      .replace(/elegido/gi, 'elegida')
      .replace(/elegide/gi, 'elegida')
      .replace(/invitad[oa]\/[ae]/gi, 'invitada')
      .replace(/invitado/gi, 'invitada')
      .replace(/querid[oa]\/[ae]/gi, 'querida')
      .replace(/querido/gi, 'querida')
      .replace(/amadá\/o/gi, 'amada')
      .replace(/amado/gi, 'amada')
      .replace(/\/a\b/g, 'a')
      .replace(/\/e\b/g, 'a');
  }

  // Género neutro (lenguaje inclusivo)
  if (genero === 'neutro') {
    return texto
      .replace(/Bienvenid[oa]\/[ae]/gi, 'Bienvenide')
      .replace(/Bienvenido/gi, 'Bienvenide')
      .replace(/Bienvenida/gi, 'Bienvenide')
      .replace(/guardian[ae]\/[aeiou]/gi, 'guardiane')
      .replace(/guardián/gi, 'guardiane')
      .replace(/guardiana/gi, 'guardiane')
      .replace(/compañer[oa]\/[ae]/gi, 'compañere')
      .replace(/compañero/gi, 'compañere')
      .replace(/compañera/gi, 'compañere')
      .replace(/elegid[oa]\/[ae]/gi, 'elegide')
      .replace(/elegido/gi, 'elegide')
      .replace(/elegida/gi, 'elegide')
      .replace(/invitad[oa]\/[ae]/gi, 'invitade')
      .replace(/invitado/gi, 'invitade')
      .replace(/invitada/gi, 'invitade')
      .replace(/querid[oa]\/[ae]/gi, 'queride')
      .replace(/querido/gi, 'queride')
      .replace(/querida/gi, 'queride')
      .replace(/amadá\/o/gi, 'amade')
      .replace(/amado/gi, 'amade')
      .replace(/amada/gi, 'amade')
      .replace(/\/a\b/g, 'e')
      .replace(/\/e\b/g, 'e');
  }

  return texto;
}

/**
 * Obtiene el emoji apropiado para el género
 * @param {string} genero - 'ella', 'el', o 'neutro'
 * @returns {string} - Emoji
 */
export function emojiGenero(genero) {
  switch (genero) {
    case 'ella': return '👩';
    case 'neutro': return '🧑';
    default: return '🧑‍🦱';
  }
}

/**
 * Obtiene el artículo apropiado para el género
 * @param {string} genero - 'ella', 'el', o 'neutro'
 * @returns {object} - { el: 'el/la/le', un: 'un/una/une' }
 */
export function articulosGenero(genero) {
  switch (genero) {
    case 'ella':
      return { el: 'la', un: 'una', los: 'las', unos: 'unas' };
    case 'neutro':
      return { el: 'le', un: 'une', los: 'les', unos: 'unes' };
    default:
      return { el: 'el', un: 'un', los: 'los', unos: 'unos' };
  }
}

/**
 * Construye un saludo personalizado
 * @param {string} nombre - Nombre del usuario
 * @param {string} genero - 'ella', 'el', o 'neutro'
 * @returns {string} - Saludo personalizado
 */
export function saludoPersonalizado(nombre, genero) {
  const saludo = personalizarTexto('Bienvenido/a', genero);
  return `${saludo}, ${nombre || 'viajero'}`;
}
