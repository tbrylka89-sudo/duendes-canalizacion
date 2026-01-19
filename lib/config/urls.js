/**
 * ═══════════════════════════════════════════════════════════════════
 * CONFIGURACIÓN CENTRALIZADA DE URLs - Duendes del Uruguay
 * ═══════════════════════════════════════════════════════════════════
 *
 * Este archivo centraliza TODAS las URLs del proyecto.
 * Cambiar aquí actualiza todo el sistema.
 *
 * IMPORTANTE: Después de migrar el dominio, solo hay que cambiar
 * WORDPRESS_URL de duendesuy.10web.cloud a duendesdeluruguay.com
 */

// ═══════════════════════════════════════════════════════════════════
// URLs BASE
// ═══════════════════════════════════════════════════════════════════

// WordPress / WooCommerce (tienda principal)
// ✅ Dominio principal activo
export const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';

// Vercel App (APIs, Mi Magia, etc.)
export const VERCEL_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : (process.env.NEXT_PUBLIC_VERCEL_URL || 'https://duendes-vercel.vercel.app');

// Dominio público final (para emails, links externos, etc.)
export const SITE_URL = process.env.SITE_URL || WORDPRESS_URL;

// ═══════════════════════════════════════════════════════════════════
// URLs DE PRODUCTOS Y TIENDA
// ═══════════════════════════════════════════════════════════════════

// Genera URL de producto (usa /producto/ que es el slug en español de WooCommerce)
export const getProductUrl = (slug) => `${WORDPRESS_URL}/producto/${slug}/`;

// URL de la tienda
export const getShopUrl = () => `${WORDPRESS_URL}/tienda/`;

// URL de categoría de producto
export const getCategoryUrl = (slug) => `${WORDPRESS_URL}/categoria-producto/${slug}/`;

// ═══════════════════════════════════════════════════════════════════
// URLs DEL CÍRCULO
// ═══════════════════════════════════════════════════════════════════

export const CIRCULO_URLS = {
  landing: `${WORDPRESS_URL}/circulo/`,
  mensual: getProductUrl('circulo-mensual'),
  trimestral: getProductUrl('circulo-trimestral'),
  semestral: getProductUrl('circulo-semestral'),
  anual: getProductUrl('circulo-anual'),
};

// ═══════════════════════════════════════════════════════════════════
// URLs DE RUNAS (Tienda de moneda virtual)
// ═══════════════════════════════════════════════════════════════════

export const RUNAS_URLS = {
  chispa: getProductUrl('runas-chispa'),
  destello: getProductUrl('runas-destello'),
  resplandor: getProductUrl('runas-resplandor'),
  fulgor: getProductUrl('runas-fulgor'),
  aurora: getProductUrl('runas-aurora'),
};

// Paquetes de runas con metadata (valores correctos con bonus)
export const RUNAS_PACKS = [
  { nombre: 'Chispa', runas: 30, bonus: 0, precio: 5, url: RUNAS_URLS.chispa, desc: 'Para empezar a explorar (30 runas)' },
  { nombre: 'Destello', runas: 80, bonus: 10, precio: 10, url: RUNAS_URLS.destello, desc: 'El más popular (80 + 10 bonus = 90 runas)' },
  { nombre: 'Resplandor', runas: 200, bonus: 40, precio: 20, url: RUNAS_URLS.resplandor, desc: 'Para varias experiencias (200 + 40 bonus = 240 runas)' },
  { nombre: 'Fulgor', runas: 550, bonus: 150, precio: 50, url: RUNAS_URLS.fulgor, desc: 'Pack potente (550 + 150 bonus = 700 runas)' },
  { nombre: 'Aurora', runas: 1200, bonus: 400, precio: 100, url: RUNAS_URLS.aurora, desc: 'El mejor valor (1200 + 400 bonus = 1600 runas)' },
];

// ═══════════════════════════════════════════════════════════════════
// URLs DE APIs
// ═══════════════════════════════════════════════════════════════════

export const API_URLS = {
  titoChat: `${VERCEL_URL}/api/tito/chat`,
  titoMaestro: `${VERCEL_URL}/api/tito/maestro`,
  titoAdmin: `${VERCEL_URL}/api/admin/tito`,
  miMagia: `${VERCEL_URL}/api/mi-magia`,
  gamificacion: `${VERCEL_URL}/api/gamificacion`,
};

// ═══════════════════════════════════════════════════════════════════
// ASSETS (Imágenes, etc.)
// ═══════════════════════════════════════════════════════════════════

export const ASSETS = {
  titoAvatar: `${WORDPRESS_URL}/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg`,
};

// ═══════════════════════════════════════════════════════════════════
// HELPER: Para uso en cliente (navegador)
// ═══════════════════════════════════════════════════════════════════

// Detecta si estamos en el servidor o cliente
export const isServer = typeof window === 'undefined';

// Obtiene la URL base actual (útil para widgets embebidos)
export const getCurrentOrigin = () => {
  if (isServer) return VERCEL_URL;
  return window.location.origin;
};

// ═══════════════════════════════════════════════════════════════════
// EXPORT DEFAULT para importación simple
// ═══════════════════════════════════════════════════════════════════

const URLs = {
  WORDPRESS: WORDPRESS_URL,
  VERCEL: VERCEL_URL,
  SITE: SITE_URL,

  product: getProductUrl,
  shop: getShopUrl,
  category: getCategoryUrl,

  circulo: CIRCULO_URLS,
  runas: RUNAS_URLS,
  runasPacks: RUNAS_PACKS,

  api: API_URLS,
  assets: ASSETS,

  getCurrentOrigin,
};

export default URLs;
