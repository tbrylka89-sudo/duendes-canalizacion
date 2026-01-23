import './globals.css'
import SchemaMarkup from './components/SchemaMarkup'
import { generateBaseSchemas, generateLocalBusinessSchema, combineSchemas } from '@/lib/seo/schema'

// ═══════════════════════════════════════════════════════════════════════════════
// METADATA SEO GLOBAL - DUENDES DEL URUGUAY
// Configuracion completa de SEO para Next.js App Router
// ═══════════════════════════════════════════════════════════════════════════════

export const metadata = {
  // Configuracion base de metadata
  metadataBase: new URL('https://duendesdeluruguay.com'),

  // Titulos
  title: {
    template: '%s | Duendes del Uruguay',
    default: 'Duendes del Uruguay - Guardianes Magicos Hechos a Mano',
  },

  // Descripcion optimizada (155 caracteres)
  description: 'Guardianes magicos artesanales hechos a mano en Piriapolis, Uruguay. Figuras unicas para proteccion, abundancia, amor y sanacion espiritual.',

  // Keywords relevantes
  keywords: [
    'duendes',
    'guardianes magicos',
    'artesania espiritual',
    'duendes hechos a mano',
    'Piriapolis Uruguay',
    'figuras magicas',
    'proteccion energetica',
    'sanacion espiritual',
    'abundancia',
    'amuletos',
    'canalizacion',
    'lectura energetica',
    'Uruguay',
    'esoterismo',
    'misticismo',
    'regalos espirituales',
  ],

  // Autores
  authors: [{ name: 'Duendes del Uruguay', url: 'https://duendesdeluruguay.com' }],
  creator: 'Duendes del Uruguay',
  publisher: 'Duendes del Uruguay',

  // Formato (para dispositivos moviles)
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // OpenGraph completo
  openGraph: {
    title: 'Duendes del Uruguay - Guardianes Magicos Hechos a Mano',
    description: 'Guardianes magicos artesanales hechos a mano en Piriapolis, Uruguay. Figuras unicas para proteccion, abundancia, amor y sanacion espiritual.',
    url: 'https://duendesdeluruguay.com',
    siteName: 'Duendes del Uruguay',
    locale: 'es_UY',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Duendes del Uruguay - Guardianes Magicos Artesanales',
      },
      {
        url: '/og-image-square.jpg',
        width: 600,
        height: 600,
        alt: 'Duendes del Uruguay - Logo',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Duendes del Uruguay - Guardianes Magicos Hechos a Mano',
    description: 'Guardianes magicos artesanales hechos a mano en Piriapolis, Uruguay. Figuras unicas para proteccion, abundancia y sanacion.',
    site: '@duendesuruguay',
    creator: '@duendesuruguay',
    images: ['/og-image.jpg'],
  },

  // Robots - indexar paginas publicas
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verificacion de Google Search Console (placeholder - reemplazar con el real)
  verification: {
    google: 'TU_CODIGO_DE_VERIFICACION_GOOGLE',
    // yandex: 'TU_CODIGO_YANDEX',
    // bing: 'TU_CODIGO_BING',
  },

  // Iconos y Favicons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#C6A962' },
    ],
  },

  // Web App Manifest
  manifest: '/site.webmanifest',

  // Colores del tema
  other: {
    'msapplication-TileColor': '#0a0a0a',
    'theme-color': '#0a0a0a',
  },

  // Categoria del sitio
  category: 'ecommerce',

  // Alternativas de idioma (si tuvieras version en otros idiomas)
  alternates: {
    canonical: 'https://duendesdeluruguay.com',
    languages: {
      'es-UY': 'https://duendesdeluruguay.com',
    },
  },
}

// Viewport configuration (Next.js 14+)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF8F5' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

// Generar schemas base para toda la web
function getGlobalSchemas() {
  const baseSchemas = generateBaseSchemas(); // Organization + WebSite
  const localBusiness = generateLocalBusinessSchema();
  return combineSchemas(baseSchemas, localBusiness);
}

export default function RootLayout({ children }) {
  const globalSchema = getGlobalSchemas();

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet" />
        {/* Schema Markup JSON-LD para SEO */}
        <SchemaMarkup schema={globalSchema} />
      </head>
      <body>{children}</body>
    </html>
  )
}
