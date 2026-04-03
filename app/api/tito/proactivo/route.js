export const dynamic = "force-dynamic";
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TITO - MENSAJES PROACTIVOS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Endpoint para generar mensajes proactivos cuando el usuario está en la web
 * sin interactuar. Genera burbujas con curiosidades o preguntas.
 */

import { obtenerProductosWoo } from '@/lib/tito/conocimiento';

// Curiosidades sobre duendes para mostrar aleatoriamente
const CURIOSIDADES = [
  "¿Sabías que los duendes tienen solo 4 dedos? Es parte de su tradición ancestral 🍀",
  "Los guardianes nacen en Piriápolis porque es un punto energético único en el mundo ✨",
  "Cada guardián tarda días en nacer. Son piezas de arte hechas completamente a mano.",
  "Los cristales de cada guardián son REALES. Amatista, cuarzo rosa, citrino...",
  "Cuando un guardián 'esconde' tus llaves, en realidad te está protegiendo de algo 🔮",
  "Los duendes no hacen travesuras, hacen actos de cuidado que los humanos no entienden.",
  "Cada guardián es único. Cuando alguien lo adopta, ese diseño desaparece para siempre.",
  "La ropa de los guardianes está cosida puntada a puntada. No hay dos iguales."
];

// Mensajes según contexto de página
const MENSAJES_CONTEXTO = {
  home: [
    "¿Buscás algo especial? Puedo ayudarte a encontrar tu guardián 💚",
    "Hay guardianes de protección, abundancia, amor... ¿Qué necesitás?",
    "¿Querés hacer el test para descubrir qué guardián te llama?"
  ],
  tienda: [
    "¿Necesitás ayuda para elegir? Contame qué buscás 🍀",
    "Hay muchos guardianes... ¿Te cuento cuál siento que te llama?",
    "¿Protección, abundancia o sanación? Te ayudo a encontrar el tuyo."
  ],
  producto: [
    "¿Tenés alguna pregunta sobre este guardián? 💚",
    "Si querés saber más sobre su energía, preguntame.",
    "Este guardián es único... cuando se va, no vuelve."
  ],
  carrito: [
    "¿Todo bien con tu compra? Estoy acá por si tenés dudas.",
    "Si necesitás ayuda con algo, preguntame 🍀"
  ],
  checkout: [
    "¡Ya casi! Si tenés alguna duda sobre el envío, contame.",
    "Tu guardián te está esperando... 💚"
  ]
};

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      pagina = 'home',      // home, tienda, producto, carrito, checkout
      producto_id,           // ID del producto si está en página de producto
      tiempo_en_pagina = 0,  // Segundos que lleva en la página
      ya_interactuo = false  // Si ya abrió el chat
    } = body;

    // No mostrar proactivo si ya interactuó
    if (ya_interactuo) {
      return Response.json({
        mostrar: false,
        razon: 'ya_interactuo'
      });
    }

    // No mostrar antes de 15 segundos
    if (tiempo_en_pagina < 15) {
      return Response.json({
        mostrar: false,
        razon: 'muy_pronto'
      });
    }

    let mensaje = '';
    let tipo = 'ayuda'; // ayuda, curiosidad, producto

    // Si está en página de producto, buscar info del producto
    if (pagina === 'producto' && producto_id) {
      try {
        const productos = await obtenerProductosWoo();
        const producto = productos.find(p => p.id == producto_id);

        if (producto) {
          // Mensaje específico sobre el producto
          const mensajesProducto = [
            `${producto.nombre} es un guardián de ${producto.categoria || 'energía especial'}. ¿Querés que te cuente más? 💚`,
            `¿Sentiste el llamado de ${producto.nombre}? Puedo contarte su historia.`,
            `${producto.nombre} busca un hogar... ¿Será el tuyo? 🍀`
          ];
          mensaje = mensajesProducto[Math.floor(Math.random() * mensajesProducto.length)];
          tipo = 'producto';
        }
      } catch (e) {
        // Si falla, usar mensaje genérico
      }
    }

    // Si no hay mensaje específico, usar según contexto
    if (!mensaje) {
      const mensajesContexto = MENSAJES_CONTEXTO[pagina] || MENSAJES_CONTEXTO.home;

      // 70% mensaje de ayuda, 30% curiosidad
      if (Math.random() > 0.3) {
        mensaje = mensajesContexto[Math.floor(Math.random() * mensajesContexto.length)];
        tipo = 'ayuda';
      } else {
        mensaje = CURIOSIDADES[Math.floor(Math.random() * CURIOSIDADES.length)];
        tipo = 'curiosidad';
      }
    }

    return Response.json({
      mostrar: true,
      mensaje,
      tipo,
      sonido: true, // Indicar al widget que reproduzca sonido
      delay: 0      // Mostrar inmediatamente
    });

  } catch (error) {
    console.error('[Tito Proactivo] Error:', error);
    return Response.json({
      mostrar: false,
      error: error.message
    });
  }
}

export async function GET() {
  return Response.json({
    status: 'ok',
    endpoint: 'Tito Mensajes Proactivos',
    uso: 'POST con { pagina, producto_id, tiempo_en_pagina, ya_interactuo }',
    tipos_mensaje: ['ayuda', 'curiosidad', 'producto']
  });
}
