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
      // Cargar perfil del usuario (opcional, no bloquea)
      try {
        const perfilRes = await fetch('/api/circulo/perfil');
        const perfilData = await perfilRes.json();
        if (perfilData.success) {
          setPerfil(perfilData.perfil);
        }
      } catch (e) {
        console.log('Perfil no disponible, continuando sin login');
      }

      // Cargar cursos publicados desde la nueva API de academia
      const cursosRes = await fetch('/api/circulo/academia');
      const cursosData = await cursosRes.json();

      console.log('Respuesta API cursos:', cursosData);

      if (cursosData.success && cursosData.cursos && cursosData.cursos.length > 0) {
        setCursosConProgreso(cursosData.cursos.map(c => ({
          ...c,
          titulo: c.titulo,
          descripcion: c.descripcion,
          imagen: c.imagen,
          progreso: c.progreso || { porcentaje: 0 }
        })));
      } else {
        console.warn('No hay cursos o respuesta inesperada:', cursosData);
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

  // MODO MANTENIMIENTO ELIMINADO - Academia activa

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
