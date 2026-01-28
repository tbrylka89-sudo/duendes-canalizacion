// ═══════════════════════════════════════════════════════════════════════════════
// PAGINA DE PRODUCTO - SEO OPTIMIZADA
// Server Component con generateMetadata dinamico y Schema JSON-LD
// ═══════════════════════════════════════════════════════════════════════════════

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getPopularProducts, getRelatedProducts, formatProduct } from '@/lib/woocommerce/api';
import { generateProductMetadata } from '@/lib/seo/metadata';
import { generateProductoSchemas } from '@/lib/seo/schema';
import SchemaMarkup from '@/app/components/SchemaMarkup';
import { WORDPRESS_URL } from '@/lib/config/urls';

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE METADATA - SEO Dinamico
// ═══════════════════════════════════════════════════════════════════════════════

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const producto = await getProductBySlug(slug);

  if (!producto) {
    return {
      title: 'Guardian no encontrado',
      description: 'Este guardian magico no esta disponible.',
      robots: { index: false, follow: false }
    };
  }

  // Usar generateProductMetadata del sistema SEO
  const metadata = generateProductMetadata(producto);

  return metadata;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE STATIC PARAMS - Pre-render productos populares
// ═══════════════════════════════════════════════════════════════════════════════

export async function generateStaticParams() {
  try {
    const productos = await getPopularProducts(50);
    return productos.map((producto) => ({
      slug: producto.slug
    }));
  } catch (error) {
    console.error('[generateStaticParams] Error:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════

function Breadcrumbs({ producto }) {
  const categoria = producto.categories?.[0];

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-stone-500">
        <li>
          <Link href="/" className="hover:text-amber-700 transition-colors">
            Inicio
          </Link>
        </li>
        <li className="text-stone-400">/</li>
        <li>
          <Link href="/tienda" className="hover:text-amber-700 transition-colors">
            Tienda
          </Link>
        </li>
        {categoria && (
          <>
            <li className="text-stone-400">/</li>
            <li>
              <Link
                href={`/tienda?categoria=${categoria.slug}`}
                className="hover:text-amber-700 transition-colors"
              >
                {categoria.name}
              </Link>
            </li>
          </>
        )}
        <li className="text-stone-400">/</li>
        <li className="text-stone-800 font-medium truncate max-w-[200px]">
          {producto.name}
        </li>
      </ol>
    </nav>
  );
}

function ProductImage({ images, productName }) {
  const mainImage = images?.[0];

  if (!mainImage) {
    return (
      <div className="aspect-square bg-stone-100 rounded-2xl flex items-center justify-center">
        <span className="text-6xl text-stone-300">*</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-lg">
        <img
          src={mainImage.src}
          alt={mainImage.alt || productName}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-amber-400 px-3 py-1 rounded-full text-xs font-medium tracking-wider">
          PIEZA UNICA
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(1, 5).map((img, index) => (
            <div
              key={img.id || index}
              className="aspect-square rounded-lg overflow-hidden bg-stone-100"
            >
              <img
                src={img.src}
                alt={img.alt || `${productName} - imagen ${index + 2}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductInfo({ producto }) {
  const buyUrl = producto.permalink || `${WORDPRESS_URL}/product/${producto.slug}/`;

  return (
    <div className="space-y-6">
      {/* Categoria */}
      {producto.categories?.[0] && (
        <div className="inline-flex items-center gap-2">
          <span className="text-amber-600 text-sm font-medium tracking-wider uppercase">
            {producto.categories[0].name}
          </span>
        </div>
      )}

      {/* Nombre */}
      <h1 className="font-serif text-3xl md:text-4xl text-stone-900 leading-tight">
        {producto.name}
      </h1>

      {/* Precio */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-serif text-stone-900">
          ${producto.price} USD
        </span>
        {producto.onSale && producto.regularPrice && (
          <span className="text-lg text-stone-400 line-through">
            ${producto.regularPrice} USD
          </span>
        )}
      </div>

      {/* Descripcion corta */}
      {producto.shortDescription && (
        <p className="text-stone-600 text-lg leading-relaxed">
          {producto.shortDescription}
        </p>
      )}

      {/* Stock status */}
      <div className="flex items-center gap-2">
        {producto.stockStatus === 'instock' ? (
          <>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-600 text-sm font-medium">Disponible</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 bg-stone-400 rounded-full"></span>
            <span className="text-stone-500 text-sm">No disponible</span>
          </>
        )}
      </div>

      {/* Boton de compra */}
      <a
        href={buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-center py-4 px-8 rounded-xl font-serif text-lg tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        Adoptar a {producto.name}
      </a>

      {/* Info adicional */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-stone-500">Envio</p>
            <p className="text-sm text-stone-700 font-medium">A todo el mundo</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-stone-500">Garantia</p>
            <p className="text-sm text-stone-700 font-medium">30 dias</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDescription({ description }) {
  if (!description) return null;

  return (
    <section className="mt-12 pt-12 border-t border-stone-200">
      <h2 className="font-serif text-2xl text-stone-900 mb-6">
        Historia del Guardian
      </h2>
      <div className="prose prose-stone prose-lg max-w-none">
        <p className="text-stone-600 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </section>
  );
}

function RelatedProducts({ productos }) {
  if (!productos || productos.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-stone-200">
      <h2 className="font-serif text-2xl text-stone-900 mb-8 text-center">
        Otros guardianes que te pueden elegir
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {productos.map((producto) => (
          <Link
            key={producto.id}
            href={`/producto/${producto.slug}`}
            className="group"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3 shadow-md group-hover:shadow-lg transition-shadow">
              {producto.images?.[0]?.src ? (
                <img
                  src={producto.images[0].src}
                  alt={producto.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-stone-300">
                  *
                </div>
              )}
            </div>
            <h3 className="font-serif text-stone-800 group-hover:text-amber-700 transition-colors line-clamp-2">
              {producto.name}
            </h3>
            <p className="text-amber-600 font-medium mt-1">
              ${producto.price} USD
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default async function ProductoPage({ params }) {
  const { slug } = await params;
  const productoRaw = await getProductBySlug(slug);

  if (!productoRaw) {
    notFound();
  }

  const producto = formatProduct(productoRaw);

  // Obtener productos relacionados
  let productosRelacionados = [];
  if (producto.relatedIds?.length > 0) {
    const relacionadosRaw = await getRelatedProducts(producto.relatedIds, 4);
    productosRelacionados = relacionadosRaw.map(formatProduct).filter(Boolean);
  }

  // Generar schema JSON-LD
  const categoria = producto.categories?.[0] || null;
  const productSchema = generateProductoSchemas(productoRaw, categoria);

  return (
    <>
      {/* Schema JSON-LD para SEO */}
      <SchemaMarkup schema={productSchema} />

      <main className="min-h-screen bg-stone-50">
        {/* Header */}
        <header className="bg-stone-900 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="font-serif text-xl text-amber-400 hover:text-amber-300 transition-colors">
              Duendes del Uruguay
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/tienda" className="text-sm text-stone-300 hover:text-white transition-colors">
                Tienda
              </Link>
              <Link href="/mi-magia" className="text-sm text-stone-300 hover:text-white transition-colors">
                Mi Magia
              </Link>
            </nav>
          </div>
        </header>

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumbs producto={producto} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Columna izquierda - Imagen */}
            <div>
              <ProductImage images={producto.images} productName={producto.name} />
            </div>

            {/* Columna derecha - Info */}
            <div>
              <ProductInfo producto={producto} />
            </div>
          </div>

          {/* Descripcion completa */}
          <ProductDescription description={producto.description} />

          {/* Productos relacionados */}
          <RelatedProducts productos={productosRelacionados} />
        </div>

        {/* Footer */}
        <footer className="bg-stone-900 text-stone-400 py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="font-serif text-amber-400 text-lg mb-2">
              Duendes del Uruguay
            </p>
            <p className="text-sm">
              Guardianes artesanales nacidos en Piriapolis, Uruguay
            </p>
            <p className="text-sm mt-4">
              Cada guardian es unico y cuando encuentra su hogar, desaparece para siempre.
            </p>
            <div className="mt-6 flex justify-center gap-6">
              <Link href="/tienda" className="text-amber-400 hover:text-amber-300 transition-colors">
                Tienda
              </Link>
              <Link href="/mi-magia" className="text-amber-400 hover:text-amber-300 transition-colors">
                Mi Magia
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
