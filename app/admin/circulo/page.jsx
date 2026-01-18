'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: HUB CENTRAL DEL CÍRCULO
// Panel de control para gestionar todo el contenido del Círculo
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminCirculo() {
  const [stats, setStats] = useState(null);
  const [duendeSemana, setDuendeSemana] = useState(null);
  const [contenidosHoy, setContenidosHoy] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      // Stats generales
      const resStats = await fetch('/api/admin/circulo');
      const dataStats = await resStats.json();
      if (dataStats.success) {
        setStats(dataStats);
      }

      // Duende de la semana
      const resDuende = await fetch('/api/admin/duende-semana');
      const dataDuende = await resDuende.json();
      if (dataDuende.success) {
        setDuendeSemana(dataDuende.duendeActual);
      }

      // Contenidos del mes actual
      const hoy = new Date();
      const resContenidos = await fetch(`/api/admin/circulo/contenidos?mes=${hoy.getMonth() + 1}&año=${hoy.getFullYear()}`);
      const dataContenidos = await resContenidos.json();
      if (dataContenidos.success) {
        setContenidosHoy(dataContenidos.contenidos || []);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
    setCargando(false);
  }

  const hoy = new Date();
  const contenidoHoy = contenidosHoy.find(c => c.dia === hoy.getDate());
  const contenidosPublicados = contenidosHoy.filter(c => c.estado === 'publicado').length;
  const contenidosProgramados = contenidosHoy.filter(c => c.estado === 'programado').length;

  if (cargando) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <span style={styles.loadingIcon}>★</span>
          <p>Cargando panel del Círculo...</p>
        </div>
      </div>
    );
  }

  const LOGO_RECTANGULAR = 'https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_artistic_portrait_photography_of_recrea_este_exacto_logo_con_color_negro_el_meda-1-scaled.jpg';

  return (
    <div style={styles.container}>
      {/* Logo oficial */}
      <div style={styles.logoContainer}>
        <img src={LOGO_RECTANGULAR} alt="Duendes del Uruguay" style={styles.logo} />
      </div>

      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>★ Admin del Círculo</h1>
          <p style={styles.subtitle}>Panel de control central</p>
        </div>
        <Link href="/mi-magia/circulo" style={styles.btnPreview}>
          Ver Círculo →
        </Link>
      </header>

      {/* TITO ADMIN - Asistente destacado */}
      <Link href="/admin/tito" style={styles.titoCard}>
        <div style={styles.titoIcon}>🤖</div>
        <div style={styles.titoContent}>
          <h2 style={styles.titoTitle}>Tito Admin</h2>
          <p style={styles.titoDesc}>Tu asistente todopoderoso. Escribe lo que necesites en lenguaje natural.</p>
          <div style={styles.titoExamples}>
            <span style={styles.titoExample}>"Dale 50 runas a maria@gmail.com"</span>
            <span style={styles.titoExample}>"Crea una promo de 15%"</span>
            <span style={styles.titoExample}>"¿Cuántos miembros?"</span>
          </div>
        </div>
        <div style={styles.titoArrow}>→</div>
      </Link>

      {/* Asistente del Círculo - Chat conversacional */}
      <Link href="/admin/circulo/asistente" style={{...styles.titoCard, borderColor: 'rgba(107, 142, 159, 0.5)', background: 'linear-gradient(135deg, rgba(107, 142, 159, 0.15), rgba(107, 142, 159, 0.05))'}}>
        <div style={{...styles.titoIcon, background: 'linear-gradient(135deg, #6B8E9F, #4A6670)'}}>✦</div>
        <div style={styles.titoContent}>
          <h2 style={{...styles.titoTitle, color: '#6B8E9F'}}>Asistente del Círculo</h2>
          <p style={styles.titoDesc}>Gestión conversacional. Decime qué necesitás y lo genero todo.</p>
          <div style={styles.titoExamples}>
            <span style={{...styles.titoExample, borderColor: 'rgba(107, 142, 159, 0.3)'}}>"Generá una semana de contenido"</span>
            <span style={{...styles.titoExample, borderColor: 'rgba(107, 142, 159, 0.3)'}}>"Cambiá el duende a Ember"</span>
          </div>
        </div>
        <div style={{...styles.titoArrow, color: '#6B8E9F'}}>→</div>
      </Link>

      {/* Stats rápidas */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>👥</span>
          <div>
            <p style={styles.statValue}>{stats?.totalMiembros || 0}</p>
            <p style={styles.statLabel}>Miembros activos</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>📅</span>
          <div>
            <p style={styles.statValue}>{contenidosPublicados}</p>
            <p style={styles.statLabel}>Publicados este mes</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>⏰</span>
          <div>
            <p style={styles.statValue}>{contenidosProgramados}</p>
            <p style={styles.statLabel}>Programados</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>✦</span>
          <div>
            <p style={styles.statValue}>{duendeSemana?.nombre || 'Sin asignar'}</p>
            <p style={styles.statLabel}>Duende de la Semana</p>
          </div>
        </div>
      </div>

      {/* Contenido de hoy */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Contenido de Hoy ({hoy.getDate()}/{hoy.getMonth() + 1})</h2>
        {contenidoHoy ? (
          <div style={styles.contenidoCard}>
            <div style={styles.contenidoHeader}>
              <span style={styles.tipoBadge}>{contenidoHoy.tipo}</span>
              <span style={{
                ...styles.estadoBadge,
                background: contenidoHoy.estado === 'publicado' ? '#27ae60' : '#f39c12'
              }}>
                {contenidoHoy.estado}
              </span>
            </div>
            <h3 style={styles.contenidoTitulo}>{contenidoHoy.titulo}</h3>
            <p style={styles.contenidoPreview}>
              {contenidoHoy.contenido?.substring(0, 200)}...
            </p>
            <div style={styles.contenidoMeta}>
              {contenidoHoy.duende && <span>Por: {contenidoHoy.duende}</span>}
              {contenidoHoy.reacciones && <span>❤️ {contenidoHoy.reacciones.likes || 0}</span>}
            </div>
          </div>
        ) : (
          <div style={styles.noContenido}>
            <p>No hay contenido para hoy</p>
            <Link href="/admin/circulo/contenido" style={styles.btnGenerar}>
              Generar contenido
            </Link>
          </div>
        )}
      </section>

      {/* Gestión del Círculo */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Gestión del Círculo</h2>
        <div style={styles.menuGrid}>
          <Link href="/admin/circulo/duendes" style={{...styles.menuCard, borderColor: '#d4af37'}}>
            <span style={styles.menuIcon}>✦</span>
            <div>
              <h3 style={{color: '#d4af37'}}>Duendes Reales</h3>
              <p>Gestionar guardianes para contenido</p>
            </div>
          </Link>

          <Link href="/admin/circulo/contenido" style={styles.menuCard}>
            <span style={styles.menuIcon}>✍️</span>
            <div>
              <h3>Generar Contenido</h3>
              <p>Crear mensajes, meditaciones, rituales</p>
            </div>
          </Link>

          <Link href="/admin/circulo/calendario" style={styles.menuCard}>
            <span style={styles.menuIcon}>📅</span>
            <div>
              <h3>Calendario</h3>
              <p>Ver y programar contenido por día</p>
            </div>
          </Link>

          <Link href="/admin/circulo/duende-semana" style={styles.menuCard}>
            <span style={styles.menuIcon}>🌟</span>
            <div>
              <h3>Duende de la Semana</h3>
              <p>Seleccionar guardián protagonista</p>
            </div>
          </Link>

          <a href="/api/admin/circulo/miembros" target="_blank" style={styles.menuCard}>
            <span style={styles.menuIcon}>👥</span>
            <div>
              <h3>Miembros</h3>
              <p>Ver lista de miembros activos</p>
            </div>
          </a>

          <Link href="/admin/comunidad" style={styles.menuCard}>
            <span style={styles.menuIcon}>💬</span>
            <div>
              <h3>Foro / Comunidad</h3>
              <p>Moderar temas y respuestas</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Marketing y Ventas */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Marketing y Ventas</h2>
        <div style={styles.menuGrid}>
          <Link href="/admin/promociones" style={styles.menuCard}>
            <span style={styles.menuIcon}>🎁</span>
            <div>
              <h3>Promociones</h3>
              <p>Gestionar códigos y ofertas</p>
            </div>
          </Link>

          <Link href="/admin/promociones/stats" style={styles.menuCard}>
            <span style={styles.menuIcon}>📊</span>
            <div>
              <h3>Estadísticas Promos</h3>
              <p>Rendimiento de promociones</p>
            </div>
          </Link>

          <Link href="/admin/promociones/automaticas" style={styles.menuCard}>
            <span style={styles.menuIcon}>⚡</span>
            <div>
              <h3>Promos Automáticas</h3>
              <p>Configurar triggers de promociones</p>
            </div>
          </Link>

          <Link href="/admin/duende-disponible" style={styles.menuCard}>
            <span style={styles.menuIcon}>🏷️</span>
            <div>
              <h3>Duende Destacado</h3>
              <p>Widget de venta en Mi Magia</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Datos y Feedback */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Datos y Feedback</h2>
        <div style={styles.menuGrid}>
          <Link href="/admin/sugerencias" style={styles.menuCard}>
            <span style={styles.menuIcon}>💡</span>
            <div>
              <h3>Sugerencias</h3>
              <p>Ideas de la comunidad</p>
            </div>
          </Link>

          <Link href="/admin/clientes" style={styles.menuCard}>
            <span style={styles.menuIcon}>🧑‍🤝‍🧑</span>
            <div>
              <h3>Clientes</h3>
              <p>Base de datos de usuarios</p>
            </div>
          </Link>

          <Link href="/admin/inteligencia" style={styles.menuCard}>
            <span style={styles.menuIcon}>🧠</span>
            <div>
              <h3>Inteligencia</h3>
              <p>Analytics y métricas</p>
            </div>
          </Link>

          <a href="/api/webhooks/woo-order" target="_blank" style={styles.menuCard}>
            <span style={styles.menuIcon}>🔗</span>
            <div>
              <h3>Webhooks</h3>
              <p>Integraciones WooCommerce</p>
            </div>
          </a>
        </div>
      </section>

      {/* Duende de la semana */}
      {duendeSemana && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Duende de la Semana Actual</h2>
          <div style={styles.duendeCard}>
            {duendeSemana.imagen && (
              <img src={duendeSemana.imagen} alt={duendeSemana.nombre} style={styles.duendeImg} />
            )}
            <div style={styles.duendeInfo}>
              <h3>{duendeSemana.nombre}</h3>
              <p>{duendeSemana.descripcion || duendeSemana.proposito}</p>
              {duendeSemana.cristales?.length > 0 && (
                <div style={styles.cristales}>
                  {duendeSemana.cristales.map((c, i) => (
                    <span key={i} style={styles.cristal}>{c}</span>
                  ))}
                </div>
              )}
              <p style={styles.duendeFechas}>
                {new Date(duendeSemana.fechaInicio).toLocaleDateString()} - {new Date(duendeSemana.fechaFin).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Acciones rápidas */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Acciones Rápidas</h2>
        <div style={styles.accionesGrid}>
          <button onClick={() => window.location.href = '/api/cron/publicar-contenido'} style={styles.btnAccion}>
            📤 Publicar contenido programado
          </button>
          <button onClick={() => window.location.href = '/api/admin/circulo/cron'} style={styles.btnAccion}>
            🔄 Ejecutar cron diario
          </button>
          <Link href="/admin/circulo/contenido?generar=mes" style={styles.btnAccion}>
            📅 Generar mes completo
          </Link>
          <button onClick={async () => {
            if (confirm('Esto poblará el foro con posts de prueba. ¿Continuar?')) {
              const res = await fetch('/api/admin/circulo/seed-foro', { method: 'POST', body: JSON.stringify({}) });
              const data = await res.json();
              alert(data.success ? `Foro poblado: ${data.stats?.posts_creados || 0} posts creados` : `Error: ${data.error}`);
            }
          }} style={styles.btnAccion}>
            💬 Poblar foro con contenido
          </button>
          <button onClick={async () => {
            if (confirm('Esto regenerará el contenido usando los duendes reales. ¿Continuar?')) {
              const res = await fetch('/api/admin/circulo/regenerar-contenido', { method: 'POST' });
              const data = await res.json();
              alert(data.success ? `Contenido regenerado: ${data.mensaje}` : `Error: ${data.error}`);
            }
          }} style={styles.btnAccion}>
            ✨ Regenerar contenido con duendes reales
          </button>
        </div>
      </section>

      <footer style={styles.footer}>
        <Link href="/admin/promociones" style={styles.footerLink}>← Promociones</Link>
        <Link href="/admin/inteligencia" style={styles.footerLink}>Inteligencia →</Link>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '2rem',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    color: '#fff'
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  logo: {
    maxWidth: '280px',
    height: 'auto',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.2)'
  },
  titoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)',
    border: '2px solid #d4af37',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '2rem',
    textDecoration: 'none',
    color: '#fff',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  titoIcon: {
    fontSize: '3.5rem',
    background: 'linear-gradient(135deg, #d4af37, #b8962e)',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  titoContent: {
    flex: 1
  },
  titoTitle: {
    fontSize: '1.5rem',
    color: '#d4af37',
    margin: '0 0 0.5rem',
    fontWeight: '700'
  },
  titoDesc: {
    color: '#ccc',
    margin: '0 0 0.75rem',
    fontSize: '1rem'
  },
  titoExamples: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  titoArrow: {
    fontSize: '2rem',
    color: '#d4af37',
    fontWeight: '700'
  },
  titoExample: {
    background: 'rgba(0,0,0,0.3)',
    padding: '4px 10px',
    borderRadius: '15px',
    fontSize: '0.8rem',
    color: '#aaa',
    fontStyle: 'italic'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    gap: '1rem'
  },
  loadingIcon: {
    fontSize: '3rem',
    color: '#d4af37',
    animation: 'pulse 1.5s infinite'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '2rem',
    color: '#d4af37',
    margin: 0
  },
  subtitle: {
    color: '#888',
    margin: '0.25rem 0 0'
  },
  btnPreview: {
    background: 'transparent',
    border: '1px solid #d4af37',
    color: '#d4af37',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statIcon: {
    fontSize: '2rem'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#d4af37',
    margin: 0
  },
  statLabel: {
    color: '#888',
    fontSize: '0.85rem',
    margin: 0
  },
  section: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    color: '#d4af37',
    marginTop: 0,
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(212,175,55,0.3)',
    paddingBottom: '0.5rem'
  },
  contenidoCard: {
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    padding: '1.25rem'
  },
  contenidoHeader: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem'
  },
  tipoBadge: {
    background: '#3498db',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '15px',
    fontSize: '0.75rem',
    textTransform: 'uppercase'
  },
  estadoBadge: {
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '15px',
    fontSize: '0.75rem',
    textTransform: 'uppercase'
  },
  contenidoTitulo: {
    margin: '0 0 0.5rem',
    fontSize: '1.1rem'
  },
  contenidoPreview: {
    color: '#aaa',
    fontSize: '0.9rem',
    lineHeight: 1.5,
    margin: '0 0 0.75rem'
  },
  contenidoMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.85rem',
    color: '#888'
  },
  noContenido: {
    textAlign: 'center',
    padding: '2rem',
    color: '#888'
  },
  btnGenerar: {
    display: 'inline-block',
    marginTop: '1rem',
    background: '#d4af37',
    color: '#1a1a1a',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600'
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem'
  },
  menuCard: {
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    textDecoration: 'none',
    color: '#fff',
    transition: 'all 0.2s',
    border: '1px solid transparent'
  },
  menuIcon: {
    fontSize: '2rem',
    flexShrink: 0
  },
  duendeCard: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  duendeImg: {
    width: '120px',
    height: '120px',
    borderRadius: '12px',
    objectFit: 'cover'
  },
  duendeInfo: {
    flex: 1
  },
  cristales: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginTop: '0.5rem'
  },
  cristal: {
    background: 'rgba(212,175,55,0.2)',
    padding: '4px 10px',
    borderRadius: '15px',
    fontSize: '0.8rem',
    color: '#d4af37'
  },
  duendeFechas: {
    color: '#888',
    fontSize: '0.85rem',
    marginTop: '0.5rem'
  },
  accionesGrid: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  btnAccion: {
    background: 'rgba(212,175,55,0.1)',
    border: '1px solid #d4af37',
    color: '#d4af37',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    textDecoration: 'none',
    display: 'inline-block'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  },
  footerLink: {
    color: '#888',
    textDecoration: 'none'
  }
};
