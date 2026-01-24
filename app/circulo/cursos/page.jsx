'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './cursos.css';

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA DE CURSOS PARA MIEMBROS DEL CÍRCULO
// Muestra cursos disponibles con progreso del usuario
// ═══════════════════════════════════════════════════════════════════════════════

export default function CursosPage() {
  const [cursos, setCursos] = useState([]);
  const [cursosConProgreso, setCursosConProgreso] = useState([]);
  const [badges, setBadges] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    try {
      // Cargar perfil del usuario
      const perfilRes = await fetch('/api/circulo/perfil');
      const perfilData = await perfilRes.json();
      if (perfilData.success) {
        setPerfil(perfilData.perfil);
      }

      // Cargar cursos publicados
      const cursosRes = await fetch('/api/admin/cursos?tipo=publico');
      const cursosData = await cursosRes.json();

      if (cursosData.success) {
        const cursosPublicados = cursosData.cursos.filter(c => c.estado === 'publicado');

        // Cargar progreso si hay usuario
        if (perfilData.perfil?.id) {
          const progresoRes = await fetch(`/api/circulo/cursos/progreso?usuarioId=${perfilData.perfil.id}`);
          const progresoData = await progresoRes.json();

          if (progresoData.success) {
            // Combinar cursos con progreso
            const combinados = cursosPublicados.map(curso => {
              const progreso = progresoData.progresos.find(p => p.cursoId === curso.id);
              return {
                ...curso,
                progreso: progreso || { porcentaje: 0, leccionesCompletadas: [] }
              };
            });
            setCursosConProgreso(combinados);
            setBadges(progresoData.badges || []);
          } else {
            setCursosConProgreso(cursosPublicados.map(c => ({ ...c, progreso: { porcentaje: 0 } })));
          }
        } else {
          setCursosConProgreso(cursosPublicados.map(c => ({ ...c, progreso: { porcentaje: 0 } })));
        }
      }
    } catch (err) {
      console.error('Error cargando cursos:', err);
    } finally {
      setCargando(false);
    }
  }

  if (cargando) {
    return (
      <div className="cursos-page loading">
        <div className="loader">
          <span>📚</span>
          <p>Cargando cursos...</p>
        </div>
      </div>
    );
  }

  // MODO MANTENIMIENTO - Mientras rediseñamos la Academia
  const enMantenimiento = true;

  if (enMantenimiento) {
    return (
      <div className="cursos-page">
        <header className="cursos-header">
          <div className="header-content">
            <Link href="/circulo" className="back-link">← Volver al Círculo</Link>
            <h1>🔮 Academia de los Guardianes</h1>
          </div>
        </header>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(138, 99, 210, 0.1))',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '20px',
            padding: '60px 40px',
            maxWidth: '500px'
          }}>
            <span style={{ fontSize: '64px', display: 'block', marginBottom: '20px' }}>✨🔧✨</span>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '28px',
              color: '#d4af37',
              marginBottom: '20px'
            }}>
              Estamos preparando algo mágico
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '16px',
              lineHeight: '1.8',
              marginBottom: '25px'
            }}>
              Los guardianes están trabajando en una nueva experiencia de aprendizaje.
              Cursos más profundos, contenido más valioso, y la sabiduría de nuestros
              duendes reales guiándote semana a semana.
            </p>
            <p style={{
              color: 'rgba(212, 175, 55, 0.9)',
              fontSize: '14px',
              fontStyle: 'italic'
            }}>
              Muy pronto... la Academia renace.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cursos-page">
      {/* Header */}
      <header className="cursos-header">
        <div className="header-content">
          <Link href="/circulo" className="back-link">← Volver al Círculo</Link>
          <h1>📚 Academia de los Guardianes</h1>
          <p>Aprende de los duendes en cursos mágicos diseñados para tu crecimiento espiritual</p>
        </div>
      </header>

      {/* Badges del usuario */}
      {badges.length > 0 && (
        <section className="mis-badges">
          <h2>🏆 Mis Badges</h2>
          <div className="badges-grid">
            {badges.map((badge, i) => (
              <div key={i} className="badge-card obtenido">
                <span className="badge-icon">{badge.icono}</span>
                <div className="badge-info">
                  <strong>{badge.nombre}</strong>
                  <span className="badge-curso">{badge.cursoTitulo}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid de cursos */}
      <section className="cursos-section">
        <h2>Cursos Disponibles</h2>

        {cursosConProgreso.length === 0 ? (
          <div className="cursos-empty">
            <span>📚</span>
            <h3>Próximamente</h3>
            <p>Los guardianes están preparando cursos mágicos para vos</p>
          </div>
        ) : (
          <div className="cursos-grid">
            {cursosConProgreso.map(curso => (
              <Link href={`/circulo/cursos/${curso.id}`} key={curso.id} className="curso-card-link">
                <div className={`curso-card ${curso.progreso?.porcentaje > 0 ? 'en-progreso' : ''} ${curso.progreso?.porcentaje >= 100 ? 'completado' : ''}`}>
                  {curso.imagen && (
                    <div className="curso-imagen">
                      <img src={curso.imagen} alt={curso.titulo} />
                      {curso.progreso?.porcentaje > 0 && (
                        <div className="progreso-overlay">
                          <div className="progreso-barra">
                            <div className="progreso-fill" style={{ width: `${curso.progreso.porcentaje}%` }}></div>
                          </div>
                          <span>{curso.progreso.porcentaje}%</span>
                        </div>
                      )}
                    </div>
                  )}

                  {!curso.imagen && curso.progreso?.porcentaje > 0 && (
                    <div className="progreso-bar-simple">
                      <div className="progreso-fill" style={{ width: `${curso.progreso.porcentaje}%` }}></div>
                    </div>
                  )}

                  <div className="curso-content">
                    <div className="curso-badges">
                      <span className={`nivel-badge ${curso.nivel}`}>{curso.nivel}</span>
                      {curso.progreso?.porcentaje >= 100 && (
                        <span className="completado-badge">✅ Completado</span>
                      )}
                    </div>

                    <h3>{curso.titulo}</h3>
                    <p>{curso.descripcion}</p>

                    <div className="curso-meta">
                      <span>📖 {curso.totalModulos} módulos</span>
                      <span>📝 {curso.totalLecciones} lecciones</span>
                      <span>⏱️ {curso.duracion}</span>
                    </div>

                    {curso.badge && (
                      <div className="curso-badge-reward">
                        <span>{curso.badge.icono}</span>
                        <span>Desbloqueá: {curso.badge.nombre}</span>
                      </div>
                    )}

                    <button className="btn-empezar">
                      {curso.progreso?.porcentaje >= 100 ? 'Ver curso' :
                       curso.progreso?.porcentaje > 0 ? 'Continuar' : 'Empezar'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
