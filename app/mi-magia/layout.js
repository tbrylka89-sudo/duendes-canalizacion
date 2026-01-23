// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT MI MAGIA - SEO METADATA (PRIVADO)
// Metadata con noindex para area privada de usuarios
// ═══════════════════════════════════════════════════════════════════════════════

import { generatePrivateMetadata } from '@/lib/seo/metadata';

export const metadata = {
  ...generatePrivateMetadata(
    'Mi Magia - Portal Personal',
    'Tu portal magico personal en Duendes del Uruguay. Accede a tus canalizaciones, lecturas y contenido exclusivo.'
  ),
  // Sobrescribir titulo con template
  title: {
    template: '%s | Mi Magia - Duendes del Uruguay',
    default: 'Mi Magia - Portal Personal',
  },
};

export default function MiMagiaLayout({ children }) {
  return children;
}
