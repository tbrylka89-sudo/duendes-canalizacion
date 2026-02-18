'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  generateItemListSchema,
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  combineSchemas,
  serializeSchema
} from '@/lib/seo/schema';
import { WORDPRESS_URL } from '@/lib/config/urls';

// ═══════════════════════════════════════════════════════════════════════════════
// TIENDA MAGICA - CARTAS DE TAROT
// Productos de WooCommerce con diseno de cartas de tarot misticas
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORIAS = [
  { slug: 'proteccion', key: 'proteccion', nombre: 'Protección', desc: 'Algo te drena', color: '#3b82f6', icono: '🛡️' },
  { slug: 'amor', key: 'amor', nombre: 'Amor', desc: 'El corazón pide', color: '#ec4899', icono: '💜' },
  { slug: 'dinero-abundancia-negocios', key: 'abundancia', nombre: 'Abundancia', desc: 'No alcanza', color: '#f59e0b', icono: '✨' },
  { slug: 'salud', key: 'salud', nombre: 'Sanación', desc: 'Necesitás sanar', color: '#22c55e', icono: '🌿' },
  { slug: 'sabiduria-guia-claridad', key: 'sabiduria', nombre: 'Sabiduría', desc: 'Buscás respuestas', color: '#8b5cf6', icono: '🔮' },
];

const PARTICULAS = {
  proteccion: ['🛡️', '⚔️', '🔒', '🏰'],
  amor: ['💜', '💗', '💕', '💝'],
  abundancia: ['🪙', '💰', '✨', '⭐'],
  salud: ['🌿', '🍀', '🌱', '🌸'],
  sabiduria: ['🔮', '📿', '🌙', '⭐']
};

// Componente para inyectar schema dinamicamente en cliente
function DynamicSchemaMarkup({ productos }) {
  useEffect(() => {
    if (!productos || productos.length === 0) return;

    // Generar schemas para la tienda
    const breadcrumbs = generateBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Tienda', url: '/tienda' }
    ]);
    const itemList = generateItemListSchema(productos, {
      listName: 'Guardianes Disponibles',
      listDescription: 'Coleccion de guardianes artesanales unicos de Duendes del Uruguay'
    });
    const collectionPage = generateCollectionPageSchema({
      name: 'Tienda de Guardianes',
      description: 'Explora nuestra coleccion de guardianes artesanales unicos, hechos a mano en Piriapolis, Uruguay',
      url: '/tienda'
    });

    const combinedSchema = combineSchemas(breadcrumbs, itemList, collectionPage);
    const jsonLd = serializeSchema(combinedSchema);

    // Buscar y eliminar schema anterior si existe
    const existingScript = document.querySelector('script[data-schema-tienda]');
    if (existingScript) {
      existingScript.remove();
    }

    // Inyectar nuevo schema
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema-tienda', 'true');
      script.textContent = jsonLd;
      document.head.appendChild(script);
    }

    // Cleanup al desmontar
    return () => {
      const scriptToRemove = document.querySelector('script[data-schema-tienda]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [productos]);

  return null;
}

export default function TiendaMagica() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      const res = await fetch('/api/tienda/productos');
      const data = await res.json();

      if (data.success) {
        setProductos(data.productos || []);
      } else {
        setError(data.error || 'Error cargando productos');
      }
    } catch (e) {
      console.error('Error:', e);
      setError('Error conectando con la tienda');
    }
    setCargando(false);
  }

  function getCategoriaKey(categorias) {
    if (!categorias || !categorias.length) return '';
    const cat = categorias[0]?.slug || '';
    if (cat.includes('protec')) return 'proteccion';
    if (cat.includes('amor')) return 'amor';
    if (cat.includes('dinero') || cat.includes('abundan')) return 'abundancia';
    if (cat.includes('salud') || cat.includes('sana')) return 'salud';
    if (cat.includes('sabid')) return 'sabiduria';
    return '';
  }

  function getIcono(categoriaKey) {
    const iconos = {
      proteccion: '🛡️',
      amor: '💜',
      abundancia: '✨',
      salud: '🌿',
      sabiduria: '🔮'
    };
    return iconos[categoriaKey] || '✨';
  }

  const productosFiltrados = categoriaActiva
    ? productos.filter(p => getCategoriaKey(p.categories) === categoriaActiva)
    : productos;

  return (
    <div className="tienda-container">
      {/* Schema Markup dinamico para SEO */}
      <DynamicSchemaMarkup productos={productos} />

      {/* Hero Section */}
      <section className="tienda-hero">
        <div className="hero-bg"></div>
        <div className="hero-pattern"></div>
        <h1>Encontrá tu guardián</h1>
        <p>Cada uno nació para alguien. Uno de ellos, para vos.</p>
      </section>

      {/* Sección de Categorías Grande */}
      <section className="categorias-section">
        <div className="categorias-grid">
          <div
            className={`categoria-grande ${!categoriaActiva ? 'active' : ''}`}
            onClick={() => setCategoriaActiva(null)}
          >
            <div className="categoria-icono">🌟</div>
            <h3 className="categoria-titulo">Todos</h3>
            <p className="categoria-desc">{productos.length} guardianes disponibles</p>
          </div>

          {CATEGORIAS.map((cat) => {
            const cantidad = productos.filter(p => getCategoriaKey(p.categories) === cat.key).length;
            return (
              <div
                key={cat.slug}
                className={`categoria-grande ${categoriaActiva === cat.key ? 'active' : ''}`}
                data-cat={cat.key}
                onClick={() => setCategoriaActiva(categoriaActiva === cat.key ? null : cat.key)}
              >
                <div className="categoria-icono">{cat.icono}</div>
                <h3 className="categoria-titulo">{cat.nombre}</h3>
                <p className="categoria-desc">{cat.desc}</p>
                <span className="categoria-cantidad">{cantidad} guardianes</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Productos */}
      <section className="productos-container">
        {cargando ? (
          <div className="cargando">
            <div className="spinner"></div>
            <p>Invocando guardianes...</p>
          </div>
        ) : error ? (
          <div className="error-msg">
            <p>{error}</p>
            <a href={`${WORDPRESS_URL}/shop/`} target="_blank" rel="noopener" className="btn-alternativo">
              Ver tienda en WordPress →
            </a>
          </div>
        ) : (
          <div className="productos-grid">
            {productosFiltrados.map((producto, index) => {
              const catKey = getCategoriaKey(producto.categories);
              const icono = getIcono(catKey);

              return (
                <article
                  key={producto.id}
                  className="tarot-card"
                  data-cat={catKey}
                  style={{ '--card-index': index }}
                >
                  <a
                    href={producto.permalink || `${WORDPRESS_URL}/product/${producto.slug}/`}
                    target="_blank"
                    rel="noopener"
                    className="tarot-inner"
                  >
                    <div className="tarot-frame"></div>
                    <div className="tarot-corner tl"></div>
                    <div className="tarot-corner tr"></div>
                    <div className="tarot-corner bl"></div>
                    <div className="tarot-corner br"></div>
                    <div className="tarot-badge">{icono}</div>

                    {producto.images?.[0]?.src ? (
                      <div className="tarot-image">
                        <img
                          src={producto.images[0].src}
                          alt={producto.name}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="tarot-no-image">
                        <span className="placeholder-icon">✦</span>
                      </div>
                    )}

                    <div className="tarot-info">
                      <div className="tarot-tipo">Guardián</div>
                      <h3 className="tarot-name">{producto.name}</h3>
                      <div className="tarot-price">
                        ${producto.price} USD
                      </div>
                    </div>

                    <div className="tarot-glow"></div>
                  </a>
                  <Link
                    href={`/producto/${producto.slug}`}
                    className="btn-conocer-historia"
                  >
                    CONOCER HISTORIA
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {!cargando && !error && productosFiltrados.length === 0 && (
          <div className="sin-productos">
            <p>No hay guardianes en esta categoría</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <section className="tienda-footer">
        <p>Duendes del Uruguay · Nacidos en Piriápolis · Destinados a encontrarte</p>
        <Link href="/mi-magia" className="volver-mi-magia">← Volver a Mi Magia</Link>
      </section>

      <style jsx>{`
        .tienda-container {
          min-height: 100vh;
          background: #FAF8F5;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        /* Hero Section */
        .tienda-hero {
          background: linear-gradient(180deg, #0a0a0a 0%, #1a1510 100%);
          padding: 60px 20px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(198,169,98,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='%23C6A962' fill-opacity='1'/%3E%3C/svg%3E");
          background-size: 30px 30px;
        }

        .tienda-hero h1 {
          font-family: 'Cinzel', serif;
          font-size: clamp(24px, 5vw, 48px);
          color: #C6A962;
          font-weight: 400;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin: 0 0 15px 0;
          position: relative;
          text-shadow: 0 0 40px rgba(198,169,98,0.3);
        }

        .tienda-hero p {
          font-size: 18px;
          color: rgba(255,255,255,0.6);
          font-style: italic;
          margin: 0;
          position: relative;
        }

        /* Sección de Categorías Grande */
        .categorias-section {
          background: linear-gradient(180deg, #1a1510 0%, #FAF8F5 100%);
          padding: 60px 20px 80px;
        }

        .categorias-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .categoria-grande {
          background: #0a0a0a;
          border: 1px solid rgba(198,169,98,0.2);
          border-radius: 16px;
          padding: 40px 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .categoria-grande::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, var(--cat-glow, rgba(198,169,98,0.1)) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .categoria-grande:hover::before {
          opacity: 1;
        }

        .categoria-grande:hover {
          transform: translateY(-8px);
          border-color: var(--cat-color, #C6A962);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 30px var(--cat-glow, rgba(198,169,98,0.2));
        }

        .categoria-grande.active {
          border-color: var(--cat-color, #C6A962);
          box-shadow: 0 0 30px var(--cat-glow, rgba(198,169,98,0.3));
          background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
        }

        .categoria-grande[data-cat="proteccion"] { --cat-color: #3b82f6; --cat-glow: rgba(59, 130, 246, 0.4); }
        .categoria-grande[data-cat="amor"] { --cat-color: #ec4899; --cat-glow: rgba(236, 72, 153, 0.4); }
        .categoria-grande[data-cat="abundancia"] { --cat-color: #f59e0b; --cat-glow: rgba(245, 158, 11, 0.4); }
        .categoria-grande[data-cat="salud"] { --cat-color: #22c55e; --cat-glow: rgba(34, 197, 94, 0.4); }
        .categoria-grande[data-cat="sabiduria"] { --cat-color: #8b5cf6; --cat-glow: rgba(139, 92, 246, 0.4); }

        .categoria-icono {
          font-size: 48px;
          margin-bottom: 16px;
          filter: drop-shadow(0 0 15px var(--cat-glow, rgba(198,169,98,0.5)));
          transition: transform 0.4s;
        }

        .categoria-grande:hover .categoria-icono {
          transform: scale(1.15);
        }

        .categoria-titulo {
          font-family: 'Cinzel', serif;
          font-size: 22px;
          color: #fff;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin: 0 0 8px 0;
          transition: color 0.3s;
        }

        .categoria-grande:hover .categoria-titulo,
        .categoria-grande.active .categoria-titulo {
          color: var(--cat-color, #C6A962);
        }

        .categoria-desc {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 16px;
          color: rgba(255,255,255,0.5);
          font-style: italic;
          margin: 0 0 12px 0;
        }

        .categoria-cantidad {
          font-family: 'Cinzel', serif;
          font-size: 12px;
          color: var(--cat-color, #C6A962);
          letter-spacing: 1px;
          opacity: 0.8;
        }

        /* Productos */
        .productos-container {
          background: #FAF8F5;
          padding: 40px 20px 60px;
          min-height: 50vh;
        }

        .productos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Card Tarot */
        .tarot-card {
          position: relative;
          display: flex;
          flex-direction: column;
          text-align: center;
        }

        .tarot-inner {
          position: relative;
          width: 100%;
          aspect-ratio: 2/3;
          background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          display: block;
          box-shadow: 0 12px 35px rgba(0,0,0,0.25);
        }

        /* Botón CONOCER HISTORIA */
        .btn-conocer-historia {
          display: block;
          margin-top: 16px;
          padding: 16px 32px;
          background: #0a0a0a;
          color: #fff;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .btn-conocer-historia:hover {
          background: #1a1a1a;
          border-color: #C6A962;
          color: #C6A962;
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
          transform: translateY(-2px);
        }

        .tarot-card:hover .tarot-inner {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 35px 60px rgba(0,0,0,0.35), 0 0 40px rgba(198,169,98,0.12);
        }

        .tarot-frame {
          position: absolute;
          inset: 5px;
          border: 1px solid rgba(198,169,98,0.35);
          border-radius: 10px;
          pointer-events: none;
          z-index: 2;
        }

        .tarot-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--card-color, #C6A962);
          z-index: 3;
          transition: all 0.3s ease;
        }
        .tarot-corner.tl { top: 10px; left: 10px; border-right: none; border-bottom: none; border-radius: 5px 0 0 0; }
        .tarot-corner.tr { top: 10px; right: 10px; border-left: none; border-bottom: none; border-radius: 0 5px 0 0; }
        .tarot-corner.bl { bottom: 10px; left: 10px; border-right: none; border-top: none; border-radius: 0 0 0 5px; }
        .tarot-corner.br { bottom: 10px; right: 10px; border-left: none; border-top: none; border-radius: 0 0 5px 0; }

        /* Colores por categoría productos */
        .tarot-card[data-cat="proteccion"] { --card-color: #3b82f6; --card-glow: rgba(59, 130, 246, 0.3); }
        .tarot-card[data-cat="amor"] { --card-color: #ec4899; --card-glow: rgba(236, 72, 153, 0.3); }
        .tarot-card[data-cat="abundancia"] { --card-color: #f59e0b; --card-glow: rgba(245, 158, 11, 0.3); }
        .tarot-card[data-cat="salud"] { --card-color: #22c55e; --card-glow: rgba(34, 197, 94, 0.3); }
        .tarot-card[data-cat="sabiduria"] { --card-color: #8b5cf6; --card-glow: rgba(139, 92, 246, 0.3); }

        .tarot-card:hover .tarot-corner {
          box-shadow: 0 0 10px var(--card-glow, rgba(198,169,98,0.3));
        }

        .tarot-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 32px;
          height: 32px;
          background: rgba(0,0,0,0.7);
          border: 1px solid rgba(198,169,98,0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          z-index: 5;
          backdrop-filter: blur(10px);
        }

        .tarot-image {
          position: absolute;
          inset: 15px;
          bottom: 95px;
          border-radius: 8px;
          overflow: hidden;
        }

        .tarot-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s;
        }

        .tarot-card:hover .tarot-image img {
          transform: scale(1.05);
        }

        .tarot-no-image {
          position: absolute;
          inset: 15px;
          bottom: 95px;
          background: linear-gradient(145deg, #1f1f1f 0%, #141414 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed rgba(198,169,98,0.2);
        }

        .placeholder-icon {
          font-size: 40px;
          color: rgba(198,169,98,0.2);
        }

        .tarot-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 15px;
          text-align: center;
          z-index: 2;
        }

        .tarot-tipo {
          font-family: 'Cinzel', serif;
          font-size: 9px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 5px;
        }

        .tarot-name {
          font-family: 'Cinzel', serif;
          font-size: 13px;
          color: #fff;
          margin: 0 0 6px;
          letter-spacing: 0.5px;
          line-height: 1.3;
          min-height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tarot-price {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          color: #C6A962;
        }

        .tarot-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(198,169,98,0.1) 0%, transparent 50%, rgba(198,169,98,0.05) 100%);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
          border-radius: 14px;
        }

        .tarot-card:hover .tarot-glow { opacity: 1; }

        /* Estados */
        .cargando {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(198,169,98,0.2);
          border-top-color: #C6A962;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-msg, .sin-productos {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .btn-alternativo {
          display: inline-block;
          margin-top: 15px;
          padding: 12px 24px;
          background: #C6A962;
          color: #1a1a1a;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
        }

        /* Footer */
        .tienda-footer {
          background: #0a0a0a;
          text-align: center;
          padding: 40px 20px;
          border-top: 1px solid rgba(198,169,98,0.1);
        }

        .tienda-footer p {
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          margin: 0 0 15px;
        }

        .volver-mi-magia {
          color: #C6A962;
          text-decoration: none;
          font-size: 14px;
        }

        .volver-mi-magia:hover {
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .categorias-section {
            padding: 40px 15px 60px;
          }

          .categorias-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .categoria-grande {
            padding: 25px 15px;
          }

          .categoria-icono {
            font-size: 36px;
            margin-bottom: 10px;
          }

          .categoria-titulo {
            font-size: 14px;
            letter-spacing: 1px;
          }

          .categoria-desc {
            font-size: 12px;
            margin-bottom: 8px;
          }

          .categoria-cantidad {
            font-size: 10px;
          }

          .productos-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .tarot-inner {
            aspect-ratio: 2/2.8;
          }

          .tarot-name {
            font-size: 11px;
            min-height: 28px;
          }

          .tarot-price {
            font-size: 12px;
          }

          .btn-conocer-historia {
            padding: 12px 20px;
            font-size: 11px;
            letter-spacing: 1px;
            margin-top: 12px;
          }

          /* Animación de respiración en móvil */
          .tarot-card[data-cat] .tarot-inner {
            animation: cardBreath 4s ease-in-out infinite;
            animation-delay: calc(var(--card-index, 0) * 0.3s);
          }

          @keyframes cardBreath {
            0%, 100% {
              box-shadow: 0 8px 25px rgba(0,0,0,0.25), 0 0 20px -5px var(--card-glow, rgba(198,169,98,0.3));
            }
            50% {
              box-shadow: 0 10px 30px rgba(0,0,0,0.25), 0 0 25px -3px var(--card-glow, rgba(198,169,98,0.4));
            }
          }
        }

        @media (max-width: 480px) {
          .categorias-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .categoria-grande {
            padding: 20px;
          }
        }

        @media (max-width: 380px) {
          .productos-grid {
            gap: 8px;
          }

          .tarot-name {
            font-size: 10px;
          }

          .btn-conocer-historia {
            padding: 10px 16px;
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
