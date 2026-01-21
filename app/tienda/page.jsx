'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// TIENDA MÁGICA - CARTAS DE TAROT
// Productos de WooCommerce con diseño de cartas de tarot místicas
// ═══════════════════════════════════════════════════════════════════════════════

// URLs centralizadas - cambiar aquí cuando migre el dominio
const WORDPRESS_URL = 'https://duendesdeluruguay.com';

const CATEGORIAS = [
  { slug: 'proteccion', nombre: 'Protección', desc: 'Algo te drena', color: '#3b82f6', icono: '🛡️' },
  { slug: 'amor', nombre: 'Amor', desc: 'El corazón pide', color: '#ec4899', icono: '💜' },
  { slug: 'dinero-abundancia-negocios', nombre: 'Abundancia', desc: 'No alcanza', color: '#f59e0b', icono: '✨' },
  { slug: 'salud', nombre: 'Sanación', desc: 'Necesitás sanar', color: '#22c55e', icono: '🌿' },
  { slug: 'sabiduria-guia-claridad', nombre: 'Sabiduría', desc: 'Buscás respuestas', color: '#8b5cf6', icono: '🔮' },
];

const PARTICULAS = {
  proteccion: ['🛡️', '⚔️', '🔒', '🏰'],
  amor: ['💜', '💗', '💕', '💝'],
  abundancia: ['🪙', '💰', '✨', '⭐'],
  salud: ['🌿', '🍀', '🌱', '🌸'],
  sabiduria: ['🔮', '📿', '🌙', '⭐']
};

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
      {/* Hero Section */}
      <section className="tienda-hero">
        <div className="hero-bg"></div>
        <div className="hero-pattern"></div>
        <h1>Encontrá al que ya te eligió</h1>
        <p>Cada uno nació para alguien. Uno de ellos, para vos.</p>

        {/* Categorías */}
        <div className="cat-nav">
          <div
            className={`cat-card ${!categoriaActiva ? 'active' : ''}`}
            onClick={() => setCategoriaActiva(null)}
          >
            <div className="cat-card-inner">
              <div className="cat-bg-glow"></div>
              <div className="cat-frame"></div>
              <div className="cat-corner tl"></div>
              <div className="cat-corner tr"></div>
              <div className="cat-corner bl"></div>
              <div className="cat-corner br"></div>
              <div className="cat-icon-container">
                <span className="cat-icon-main">🌟</span>
              </div>
              <span className="cat-name">Todos</span>
              <span className="cat-count">{productos.length} guardianes</span>
            </div>
          </div>

          {CATEGORIAS.map((cat) => {
            const cantidad = productos.filter(p => getCategoriaKey(p.categories) === cat.slug.split('-')[0]).length;
            const catKey = cat.slug.split('-')[0];
            return (
              <div
                key={cat.slug}
                className={`cat-card ${categoriaActiva === catKey ? 'active' : ''}`}
                data-cat={catKey}
                onClick={() => setCategoriaActiva(categoriaActiva === catKey ? null : catKey)}
              >
                <div className="cat-card-inner">
                  <div className="cat-bg-glow"></div>
                  <div className="cat-frame"></div>
                  <div className="cat-corner tl"></div>
                  <div className="cat-corner tr"></div>
                  <div className="cat-corner bl"></div>
                  <div className="cat-corner br"></div>
                  <div className="cat-particles">
                    {PARTICULAS[catKey]?.map((p, i) => (
                      <span key={i} className="particle" style={{ left: `${15 + i * 20}%`, animationDelay: `${i * 0.5}s` }}>{p}</span>
                    ))}
                  </div>
                  <div className="cat-icon-container">
                    <div className="cat-ring"></div>
                    <span className="cat-icon-main">{cat.icono}</span>
                  </div>
                  <span className="cat-name">{cat.nombre}</span>
                  <span className="cat-count">{cat.desc}</span>
                </div>
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
                    href={producto.permalink || `${WORDPRESS_URL}/producto/${producto.slug}/`}
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
          font-size: 16px;
          color: rgba(255,255,255,0.6);
          font-style: italic;
          margin: 0 0 30px 0;
          position: relative;
        }

        /* Categorías */
        .cat-nav {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          position: relative;
          padding: 20px 0;
        }

        .cat-card {
          position: relative;
          width: 100px;
          height: 130px;
          cursor: pointer;
        }

        .cat-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 100%);
          border: 1px solid rgba(198,169,98,0.3);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }

        .cat-card:hover .cat-card-inner {
          transform: translateY(-8px) scale(1.03);
          border-color: var(--cat-color, #C6A962);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 30px var(--cat-glow, rgba(198,169,98,0.2));
        }

        .cat-card.active .cat-card-inner {
          border-color: var(--cat-color, #C6A962);
          box-shadow: 0 0 25px var(--cat-glow, rgba(198,169,98,0.3));
        }

        .cat-icon-container {
          position: relative;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .cat-icon-main {
          font-size: 28px;
          position: relative;
          z-index: 2;
          transition: transform 0.4s;
          filter: drop-shadow(0 0 10px var(--cat-glow, rgba(198,169,98,0.5)));
        }

        .cat-card:hover .cat-icon-main {
          transform: scale(1.15);
        }

        .cat-name {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          color: #fff;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: color 0.3s;
        }

        .cat-card:hover .cat-name,
        .cat-card.active .cat-name {
          color: var(--cat-color, #C6A962);
        }

        .cat-count {
          font-size: 9px;
          color: rgba(255,255,255,0.4);
          margin-top: 4px;
        }

        /* Colores por categoría */
        .cat-card[data-cat="proteccion"] { --cat-color: #3b82f6; --cat-glow: rgba(59, 130, 246, 0.4); }
        .cat-card[data-cat="amor"] { --cat-color: #ec4899; --cat-glow: rgba(236, 72, 153, 0.4); }
        .cat-card[data-cat="abundancia"] { --cat-color: #f59e0b; --cat-glow: rgba(245, 158, 11, 0.4); }
        .cat-card[data-cat="salud"] { --cat-color: #22c55e; --cat-glow: rgba(34, 197, 94, 0.4); }
        .cat-card[data-cat="sabiduria"] { --cat-color: #8b5cf6; --cat-glow: rgba(139, 92, 246, 0.4); }

        .cat-bg-glow, .cat-frame, .cat-corner, .cat-ring, .cat-particles, .particle {
          position: absolute;
        }

        .cat-bg-glow {
          inset: -50%;
          background: radial-gradient(circle, var(--cat-glow, rgba(198,169,98,0.1)) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .cat-card:hover .cat-bg-glow { opacity: 1; }

        .cat-frame {
          inset: 4px;
          border: 1px solid rgba(198,169,98,0.15);
          border-radius: 10px;
          pointer-events: none;
        }

        .cat-corner {
          width: 12px;
          height: 12px;
          border: 2px solid var(--cat-color, #C6A962);
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .cat-corner.tl { top: 6px; left: 6px; border-right: none; border-bottom: none; border-radius: 4px 0 0 0; }
        .cat-corner.tr { top: 6px; right: 6px; border-left: none; border-bottom: none; border-radius: 0 4px 0 0; }
        .cat-corner.bl { bottom: 6px; left: 6px; border-right: none; border-top: none; border-radius: 0 0 0 4px; }
        .cat-corner.br { bottom: 6px; right: 6px; border-left: none; border-top: none; border-radius: 0 0 4px 0; }

        .cat-card:hover .cat-corner { opacity: 1; }

        .cat-ring {
          width: 70px;
          height: 70px;
          border: 1px solid var(--cat-color, rgba(198,169,98,0.3));
          border-radius: 50%;
          opacity: 0;
          transition: all 0.4s;
        }

        .cat-particles {
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .cat-card:hover .cat-particles { opacity: 1; }

        .particle {
          font-size: 10px;
          opacity: 0;
          animation: floatParticle 3s ease-in-out infinite;
        }

        @keyframes floatParticle {
          0% { opacity: 0; transform: translateY(100%) scale(0.5); }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-100%) scale(0.8) rotate(20deg); }
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
          aspect-ratio: 2/3;
          cursor: pointer;
        }

        .tarot-inner {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          display: block;
          box-shadow: 0 12px 35px rgba(0,0,0,0.25);
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
          .cat-card {
            width: 80px;
            height: 105px;
          }

          .cat-icon-main {
            font-size: 22px;
          }

          .cat-name {
            font-size: 8px;
          }

          .productos-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .tarot-card {
            aspect-ratio: 2/2.8;
          }

          .tarot-name {
            font-size: 11px;
            min-height: 28px;
          }

          .tarot-price {
            font-size: 12px;
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

        @media (max-width: 380px) {
          .productos-grid {
            gap: 8px;
          }

          .tarot-name {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
