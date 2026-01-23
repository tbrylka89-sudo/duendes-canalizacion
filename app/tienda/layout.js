// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT TIENDA - SEO METADATA
// Metadata optimizado para la pagina de tienda
// ═══════════════════════════════════════════════════════════════════════════════

import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'Tienda de Guardianes Magicos',
  description: 'Explora nuestra coleccion de guardianes magicos artesanales. Duendes unicos hechos a mano en Piriapolis para proteccion, abundancia, amor y sanacion.',
  path: '/tienda',
  type: 'website',
});

export default function TiendaLayout({ children }) {
  return children;
}
