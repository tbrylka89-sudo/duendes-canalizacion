'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import './curso-detalle.css';

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA DE DETALLE DE CURSO
// Muestra módulos, lecciones y permite marcar progreso
// ═══════════════════════════════════════════════════════════════════════════════

export default function CursoDetallePage() {
  const params = useParams();
  const cursoId = params.id;

  const [curso, setCurso] = useState(null);
  const [progreso, setProgreso] = useState({ porcentaje: 0, leccionesCompletadas: [] });
  const [leccionActiva, setLeccionActiva] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [perfil, setPerfil] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarCurso();
  }, [cursoId]);

  async function cargarCurso() {
    setCargando(true);
    try {
      // Cargar perfil
      const perfilRes = await fetch('/api/circulo/perfil');
      const perfilData = await perfilRes.json();
      if (perfilData.success) {
        setPerfil(perfilData.perfil);
      }

      // Cargar curso
      const cursoRes = await fetch(`/api/admin/cursos?id=${cursoId}`);
      const cursoData = await cursoRes.json();

      if (cursoData.success) {
        setCurso(cursoData.curso);

        // Cargar progreso si hay usuario
        if (perfilData.perfil?.id) {
          const progresoRes = await fetch(`/api/circulo/cursos/progreso?usuarioId=${perfilData.perfil.id}&cursoId=${cursoId}`);
          const progresoData = await progresoRes.json();
          if (progresoData.success) {
            setProgreso(progresoData.progreso);
          }
        }
      }
    } catch (err) {
      console.error('Error cargando curso:', err);
    } finally {
      setCargando(false);
    }
  }

  async function completarLeccion(moduloIdx, leccionIdx) {
    if (!perfil?.id) {
      setMensaje('Necesitás iniciar sesión para guardar tu progreso');
      return;
    }

    const leccionId = `m${moduloIdx}_l${leccionIdx}`;

    try {
      const res = await fetch('/api/circulo/cursos/progreso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: perfil.id,
          cursoId,
          leccionId,
          accion: 'completar-leccion'
        })
      });

      const data = await res.json();
      if (data.success) {
        setProgreso(data.progreso);
        setMensaje(data.mensaje);

        // Avanzar a siguiente lección
        const siguienteLeccion = encontrarSiguienteLeccion(moduloIdx, leccionIdx);
        if (siguienteLeccion) {
          setLeccionActiva(siguienteLeccion);
        }
      }
    } catch (err) {
      console.error('Error guardando progreso:', err);
    }
  }

  function encontrarSiguienteLeccion(moduloIdx, leccionIdx) {
    const modulo = curso.modulos[moduloIdx];
    if (leccionIdx < modulo.lecciones.length - 1) {
      return { moduloIdx, leccionIdx: leccionIdx + 1 };
    } else if (moduloIdx < curso.modulos.length - 1) {
      return { moduloIdx: moduloIdx + 1, leccionIdx: 0 };
    }
    return null;
  }

  function leccionCompletada(moduloIdx, leccionIdx) {
    return progreso.leccionesCompletadas?.includes(`m${moduloIdx}_l${leccionIdx}`);
  }

  // Limpiar mensaje
  useEffect(() => {
    if (mensaje) {
      const t = setTimeout(() => setMensaje(''), 5000);
      return () => clearTimeout(t);
    }
  }, [mensaje]);

  if (cargando) {
    return (
      <div className="curso-detalle loading">
        <div className="loader">
          <span>📖</span>
          <p>Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="curso-detalle error">
        <h2>Curso no encontrado</h2>
        <Link href="/circulo/cursos">← Volver a cursos</Link>
      </div>
    );
  }

  const leccionActual = leccionActiva
    ? curso.modulos[leccionActiva.moduloIdx]?.lecciones[leccionActiva.leccionIdx]
    : null;

  const duendeActual = leccionActiva
    ? curso.modulos[leccionActiva.moduloIdx]?.duende_profesor
    : null;

  return (
    <div className="curso-detalle">
      {mensaje && <div className="mensaje-flotante">{mensaje}</div>}

      {/* Sidebar con módulos */}
      <aside className="curso-sidebar">
        <div className="sidebar-header">
          <Link href="/circulo/cursos" className="back-link">← Cursos</Link>
          <h2>{curso.titulo}</h2>
          <div className="progreso-general">
            <div className="progreso-bar">
              <div className="progreso-fill" style={{ width: `${progreso.porcentaje}%` }}></div>
            </div>
            <span>{progreso.porcentaje}% completado</span>
          </div>
        </div>

        <div className="modulos-lista">
          {curso.modulos?.map((modulo, mi) => (
            <div key={mi} className="modulo-item">
              <div className="modulo-header">
                <span className="modulo-num">Módulo {mi + 1}</span>
                <h3>{modulo.titulo}</h3>
                {modulo.duende_profesor && (
                  <span className="modulo-duende">🧙 {modulo.duende_profesor.nombre}</span>
                )}
              </div>

              <div className="lecciones-lista">
                {modulo.lecciones?.map((leccion, li) => {
                  const completada = leccionCompletada(mi, li);
                  const esActiva = leccionActiva?.moduloIdx === mi && leccionActiva?.leccionIdx === li;

                  return (
                    <button
                      key={li}
                      className={`leccion-item ${completada ? 'completada' : ''} ${esActiva ? 'activa' : ''}`}
                      onClick={() => setLeccionActiva({ moduloIdx: mi, leccionIdx: li })}
                    >
                      <span className="leccion-estado">
                        {completada ? '✅' : esActiva ? '▶️' : '○'}
                      </span>
                      <span className="leccion-titulo">{leccion.titulo}</span>
                      <span className="leccion-duracion">{leccion.duracion_minutos}min</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Badge del curso */}
        {curso.badge && (
          <div className={`badge-preview ${progreso.porcentaje >= 100 ? 'obtenido' : ''}`}>
            <span className="badge-icon">{curso.badge.icono}</span>
            <div>
              <strong>{curso.badge.nombre}</strong>
              <p>{progreso.porcentaje >= 100 ? '¡Desbloqueado!' : 'Completá el curso para desbloquear'}</p>
            </div>
          </div>
        )}
      </aside>

      {/* Contenido de la lección */}
      <main className="leccion-contenido">
        {leccionActual ? (
          <>
            {duendeActual && (
              <div className="duende-banner">
                <span>🧙</span>
                <div>
                  <strong>{duendeActual.nombre}</strong>
                  <p>{duendeActual.personalidad}</p>
                </div>
              </div>
            )}

            <div className="leccion-header">
              <span className="leccion-num">
                Módulo {leccionActiva.moduloIdx + 1} · Lección {leccionActiva.leccionIdx + 1}
              </span>
              <h1>{leccionActual.titulo}</h1>
            </div>

            <div className="leccion-texto">
              {leccionActual.contenido?.split('\n\n').map((parrafo, i) => (
                <p key={i}>{parrafo}</p>
              ))}
            </div>

            {leccionActual.ejercicio_practico && (
              <div className="leccion-ejercicio">
                <h3>🎯 Ejercicio Práctico</h3>
                <p>{leccionActual.ejercicio_practico}</p>
              </div>
            )}

            {leccionActual.reflexion && (
              <div className="leccion-reflexion">
                <h3>💭 Reflexión</h3>
                <p>{leccionActual.reflexion}</p>
              </div>
            )}

            <div className="leccion-actions">
              {!leccionCompletada(leccionActiva.moduloIdx, leccionActiva.leccionIdx) ? (
                <button
                  className="btn-completar"
                  onClick={() => completarLeccion(leccionActiva.moduloIdx, leccionActiva.leccionIdx)}
                >
                  ✅ Marcar como completada
                </button>
              ) : (
                <div className="leccion-completada-msg">
                  ✅ Lección completada
                  {encontrarSiguienteLeccion(leccionActiva.moduloIdx, leccionActiva.leccionIdx) && (
                    <button
                      className="btn-siguiente"
                      onClick={() => setLeccionActiva(encontrarSiguienteLeccion(leccionActiva.moduloIdx, leccionActiva.leccionIdx))}
                    >
                      Siguiente lección →
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="seleccionar-leccion">
            <span>📖</span>
            <h2>Bienvenido a {curso.titulo}</h2>
            <p>Seleccioná una lección del menú para comenzar</p>
            {curso.modulos?.[0]?.lecciones?.[0] && (
              <button
                className="btn-empezar"
                onClick={() => setLeccionActiva({ moduloIdx: 0, leccionIdx: 0 })}
              >
                Empezar con la primera lección
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
