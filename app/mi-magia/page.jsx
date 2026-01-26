'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SenalDelDia, TestElemental, CosmosMes, GuiaCristales, CatalogoExperiencias, estilosNuevos } from './nuevas-funciones';
import TestGuardian from './test-guardian';
import { personalizarTexto, saludoPersonalizado } from '@/lib/personalizacion';
import DuendeDisponible from '@/components/DuendeDisponible';
import Referidos from './referidos';
import { DashboardGamificacion, ColeccionBadges, MisionesPanel, HistorialLecturas, LeaderboardRachas, ToastProvider } from './gamificacion-components';
import { ExperienciasMagicas } from './experiencias-magicas';
import { estilos } from './components/styles';
import TestPerfiladoPsicologico from './TestPerfiladoPsicologico';
import { AccesoRestringido, BadgeNivelAcceso, BannerUpgrade } from './components/AccesoRestringido';
import { BannerPromociones } from './components/BannerPromociones';

// Componentes extraídos (refactorizados)
import { Tito, TitoBurbuja } from './components/Tito';
import SeccionInicio from './components/SeccionInicio';
import SeccionCanalizaciones from './components/SeccionCanalizaciones';
import SeccionRegalos from './components/SeccionRegalos';
import SeccionGrimorio from './components/SeccionGrimorio';
import SeccionCirculo from './components/SeccionCirculo';
// Importar solo las constantes necesarias para evitar duplicados
// TIPOS_DIARIO, RANGOS, getRango, getSiguienteRango se definen localmente con formato diferente
import { API_BASE, WORDPRESS_URL, TITO_IMG, CATEGORIAS_LECTURAS, NIVELES_INFO, limpiarTexto } from './components/constants';
import CofreDiario from './components/CofreDiario';

// NOTA: CofreDiario ahora importado desde ./components/CofreDiario

// ═══════════════════════════════════════════════════════════════
// COFRE DIARIO - LOCAL (DEPRECATED - usar el importado)
// ═══════════════════════════════════════════════════════════════

function CofreDiarioLocal({ usuario, token, onRunasGanadas }) {
  const [gamificacion, setGamificacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reclamando, setReclamando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [animacion, setAnimacion] = useState('cerrado'); // cerrado, girando, abierto

  useEffect(() => {
    if (token) {
      cargarGamificacion();
    } else {
      setCargando(false);
    }
  }, [token]);

  const cargarGamificacion = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/gamificacion/usuario?token=${token}`);
      const data = await res.json();
      if (data.success && data.gamificacion) {
        setGamificacion(data.gamificacion);
      } else {
        setError(data.error || 'No se pudo cargar el cofre');
      }
    } catch (e) {
      console.error('Error cargando gamificación:', e);
      setError('Error de conexión');
    }
    setCargando(false);
  };

  const reclamarCofre = async () => {
    if (reclamando || !gamificacion?.puedeReclamarCofre) return;

    setReclamando(true);
    setAnimacion('girando');

    try {
      const res = await fetch(`${API_BASE}/api/gamificacion/cofre-diario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();

      // Esperar animación de giro
      await new Promise(r => setTimeout(r, 2000));

      if (data.success) {
        setAnimacion('abierto');
        setResultado(data);
        setGamificacion(prev => ({
          ...prev,
          puedeReclamarCofre: false,
          racha: data.racha.actual,
          rachaMax: data.racha.max
        }));
        if (onRunasGanadas) {
          onRunasGanadas(data.totales.runas);
        }
      } else {
        setAnimacion('cerrado');
        setResultado({ error: data.error });
      }
    } catch (e) {
      setAnimacion('cerrado');
      setResultado({ error: 'Error al reclamar cofre' });
    }
    setReclamando(false);
  };

  const cerrarResultado = () => {
    setResultado(null);
    setAnimacion('cerrado');
  };

  if (cargando) {
    return (
      <div className="cofre-container cofre-cargando">
        <div className="cofre-spinner"></div>
      </div>
    );
  }

  // Si hay error o no hay gamificación, mostrar botón de reintentar
  if (error || !gamificacion) {
    return (
      <div className="cofre-container">
        <div className="cofre-box error-state">
          <div className="cofre-header">
            <h3>Cofre Diario</h3>
          </div>
          <div className="cofre-icono cerrado">
            <span className="cofre-cerrado">📦</span>
          </div>
          <div className="cofre-info">
            <p className="cofre-error-msg">{error || 'No se pudo cargar'}</p>
            <button className="cofre-btn" onClick={cargarGamificacion}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const puedeReclamar = gamificacion?.puedeReclamarCofre;
  const racha = gamificacion?.racha || 0;
  const diasParaBonus = gamificacion?.diasParaBonus;

  return (
    <div className="cofre-container">
      {/* Modal de resultado */}
      {resultado && !resultado.error && (
        <div className="cofre-modal-overlay" onClick={cerrarResultado}>
          <div className="cofre-modal" onClick={e => e.stopPropagation()}>
            <div className="cofre-modal-glow"></div>
            <div className="cofre-modal-content">
              <div className="cofre-icono-grande cofre-abierto-icono">📦</div>
              <h3>¡Cofre Abierto!</h3>

              <div className="cofre-recompensas">
                <div className="cofre-recompensa principal">
                  <span className="cofre-valor">+{resultado.cofre.runasBase}</span>
                  <span className="cofre-label">Runas</span>
                </div>
                <div className="cofre-recompensa">
                  <span className="cofre-valor">+{resultado.cofre.xpBase}</span>
                  <span className="cofre-label">XP</span>
                </div>
              </div>

              {resultado.bonusRacha && (
                <div className="cofre-bonus">
                  <div className="cofre-bonus-header">
                    <span className="cofre-bonus-dias">{resultado.bonusRacha.dias} días</span>
                    <span className="cofre-bonus-emoji">🔥</span>
                  </div>
                  <p className="cofre-bonus-msg">{resultado.bonusRacha.mensaje}</p>
                  <div className="cofre-bonus-extras">
                    {resultado.bonusRacha.runas > 0 && (
                      <span>+{resultado.bonusRacha.runas} runas bonus</span>
                    )}
                    {resultado.bonusRacha.xp > 0 && (
                      <span>+{resultado.bonusRacha.xp} XP bonus</span>
                    )}
                    {resultado.totales.lecturaGratis && (
                      <span className="cofre-lectura-gratis">🎁 ¡Lectura gratis!</span>
                    )}
                    {resultado.totales.badge && (
                      <span className="cofre-badge">🏆 Badge: {resultado.totales.badge}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="cofre-total">
                <span>Total: {resultado.totales.runas} runas</span>
                <span className="cofre-balance">Balance: {resultado.nuevoBalance} runas</span>
              </div>

              <p className="cofre-mensaje">{resultado.mensaje}</p>

              <button className="cofre-cerrar-btn" onClick={cerrarResultado}>
                ¡Genial!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cofre principal */}
      <div className={`cofre-box ${puedeReclamar ? 'disponible' : 'reclamado'} ${animacion}`}>
        <div className="cofre-header">
          <h3>Cofre Diario</h3>
          {racha > 0 && (
            <div className="cofre-racha">
              <span className="racha-fuego">🔥</span>
              <span className="racha-num">{racha}</span>
            </div>
          )}
        </div>

        <div
          className={`cofre-icono ${animacion}`}
          onClick={puedeReclamar ? reclamarCofre : undefined}
        >
          {animacion === 'girando' ? (
            <div className="cofre-rueda">
              <div className="rueda-inner">
                <span>1</span><span>2</span><span>3</span><span>5</span><span>10</span>
              </div>
            </div>
          ) : puedeReclamar ? (
            <span className="cofre-cerrado">📦</span>
          ) : (
            <span className="cofre-abierto">📭</span>
          )}
        </div>

        <div className="cofre-info">
          {puedeReclamar ? (
            <>
              <button
                className="cofre-btn"
                onClick={reclamarCofre}
                disabled={reclamando}
              >
                {reclamando ? 'Abriendo...' : '¡Abrir Cofre!'}
              </button>
              <p className="cofre-hint">Tocá para reclamar tus runas diarias</p>
            </>
          ) : (
            <>
              <p className="cofre-reclamado-msg">Ya reclamaste hoy</p>
              <p className="cofre-proximo">Volvé mañana</p>
            </>
          )}
        </div>

        {diasParaBonus && diasParaBonus <= 7 && (
          <div className="cofre-proximo-bonus">
            <span>🎁</span>
            <span>{diasParaBonus === 1 ? '¡Mañana bonus especial!' : `${diasParaBonus} días para bonus`}</span>
          </div>
        )}
      </div>

      {/* Racha info */}
      {racha > 1 && (
        <div className="cofre-racha-info">
          <div className="racha-bar">
            <div className="racha-progress" style={{ width: `${Math.min((racha / 7) * 100, 100)}%` }}></div>
          </div>
          <div className="racha-hitos">
            <span className={racha >= 7 ? 'activo' : ''}>7🔥</span>
            <span className={racha >= 14 ? 'activo' : ''}>14🔥</span>
            <span className={racha >= 30 ? 'activo' : ''}>30🔥</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CATÁLOGO DE LECTURAS GAMIFICADO
// ═══════════════════════════════════════════════════════════════

// CATEGORIAS_LECTURAS y NIVELES_INFO ahora importados desde ./components/constants

function CatalogoLecturasGamificado({ usuario, token, setUsuario }) {
  const [catalogo, setCatalogo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('basicas');
  const [lecturaSeleccionada, setLecturaSeleccionada] = useState(null);
  const [ejecutando, setEjecutando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [formData, setFormData] = useState({});
  const [vistaDetalle, setVistaDetalle] = useState('info'); // info, form, resultado

  useEffect(() => {
    cargarCatalogo();
  }, []);

  const cargarCatalogo = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/gamificacion/lecturas?token=${token}`);
      const data = await res.json();
      if (data.success) {
        setCatalogo(data);
      }
    } catch (e) {
      console.error('Error cargando catálogo:', e);
    }
    setCargando(false);
  };

  const ejecutarLectura = async () => {
    if (!lecturaSeleccionada || ejecutando) return;

    setEjecutando(true);
    try {
      const res = await fetch(`${API_BASE}/api/gamificacion/ejecutar-lectura`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          lecturaId: lecturaSeleccionada.id,
          categoria: lecturaSeleccionada.categoria,
          // Enviar todos los campos del formulario
          ...formData
        })
      });
      const data = await res.json();

      if (data.success) {
        setResultado(data);
        setVistaDetalle('resultado');
        // Actualizar runas del usuario
        if (setUsuario) {
          setUsuario(prev => ({
            ...prev,
            runas: data.solicitud.runasRestantes
          }));
        }
        // Recargar catálogo para actualizar estados
        cargarCatalogo();
      } else {
        setResultado({ error: data.error });
      }
    } catch (e) {
      setResultado({ error: 'Error al ejecutar la lectura' });
    }
    setEjecutando(false);
  };

  const cerrarDetalle = () => {
    setLecturaSeleccionada(null);
    setVistaDetalle('info');
    setFormData({});
    setResultado(null);
  };

  if (cargando) {
    return (
      <div className="sec catalogo-cargando">
        <div className="catalogo-spinner"></div>
        <p>Cargando el catálogo mágico...</p>
      </div>
    );
  }

  if (!catalogo) {
    return (
      <div className="sec">
        <p>Error al cargar el catálogo</p>
      </div>
    );
  }

  const usuarioInfo = catalogo.usuario || {};
  const nivelActual = usuarioInfo.nivel || 'iniciada';
  const nivelInfo = NIVELES_INFO[nivelActual];

  // Vista de detalle de lectura
  if (lecturaSeleccionada) {
    return (
      <div className="sec lectura-detalle-gamificada">
        <button className="btn-back" onClick={cerrarDetalle}>← Volver al catálogo</button>

        {vistaDetalle === 'info' && (
          <div className="lectura-info-card">
            <div className="lectura-header-detalle">
              <span className="lectura-icono-grande">{lecturaSeleccionada.icono}</span>
              <div className="lectura-titulo-info">
                <h1>{lecturaSeleccionada.nombre}</h1>
                <div className="lectura-meta-detalle">
                  <span className="meta-nivel" style={{ background: NIVELES_INFO[lecturaSeleccionada.nivel]?.color }}>
                    {NIVELES_INFO[lecturaSeleccionada.nivel]?.icono} {NIVELES_INFO[lecturaSeleccionada.nivel]?.nombre}
                  </span>
                  <span className="meta-tiempo">⏱ {lecturaSeleccionada.duracion}</span>
                  <span className="meta-palabras">📝 ~{lecturaSeleccionada.palabras} palabras</span>
                </div>
              </div>
            </div>

            <p className="lectura-descripcion-larga">{lecturaSeleccionada.descripcion}</p>

            {lecturaSeleccionada.requiereGuardian && (
              <div className="lectura-requisito guardian">
                <span>🛡️</span>
                <span>Requiere tener un guardián adoptado</span>
                {!usuarioInfo.tieneGuardian && <span className="no-cumple">No tenés guardián aún</span>}
              </div>
            )}

            <div className="lectura-precio-detalle">
              <div className="precio-info">
                {lecturaSeleccionada.descuento > 0 && (
                  <span className="precio-original">{lecturaSeleccionada.precioOriginal} ᚱ</span>
                )}
                <span className="precio-final">{lecturaSeleccionada.precioFinal} ᚱ</span>
                {lecturaSeleccionada.descuento > 0 && (
                  <span className="descuento-badge">-{lecturaSeleccionada.descuento}%</span>
                )}
              </div>
              <div className="balance-info">
                <span>Tenés: {usuarioInfo.runas || 0} ᚱ</span>
                {(usuarioInfo.runas || 0) < lecturaSeleccionada.precioFinal && (
                  <span className="faltan">Faltan {lecturaSeleccionada.precioFinal - (usuarioInfo.runas || 0)} ᚱ</span>
                )}
              </div>
            </div>

            {lecturaSeleccionada.disponible ? (
              <button
                className="btn-gold btn-ejecutar"
                onClick={() => setVistaDetalle('form')}
                disabled={(usuarioInfo.runas || 0) < lecturaSeleccionada.precioFinal}
              >
                {(usuarioInfo.runas || 0) >= lecturaSeleccionada.precioFinal
                  ? 'Continuar →'
                  : 'Runas insuficientes'}
              </button>
            ) : (
              <div className="lectura-bloqueada-info">
                {lecturaSeleccionada.bloqueadoPorNivel && (
                  <p>🔒 Necesitás nivel {NIVELES_INFO[lecturaSeleccionada.nivelRequerido]?.nombre} para desbloquear</p>
                )}
                {lecturaSeleccionada.bloqueadoPorGuardian && (
                  <p>🛡️ Necesitás adoptar un guardián primero</p>
                )}
                {lecturaSeleccionada.razonNoDisponible && (
                  <p>⏰ {lecturaSeleccionada.razonNoDisponible}</p>
                )}
              </div>
            )}
          </div>
        )}

        {vistaDetalle === 'form' && (
          <div className="lectura-form-card">
            <h2>Completá tu solicitud</h2>
            <p className="form-intro">Cuanta más información nos des, más personalizada será tu lectura.</p>

            <div className="form-campos-gamificado">
              {/* TIRADAS (Runas, Tarot) */}
              {lecturaSeleccionada.categoria === 'tiradas' && (
                <>
                  <div className="campo">
                    <label>Tu pregunta específica</label>
                    <textarea
                      value={formData.pregunta || ''}
                      onChange={e => setFormData({ ...formData, pregunta: e.target.value })}
                      placeholder="Formulá tu pregunta de forma clara. Ej: ¿Qué necesito saber sobre mi situación laboral?"
                      rows={3}
                    />
                  </div>
                  <div className="campo">
                    <label>¿En qué área de tu vida se centra?</label>
                    <select value={formData.areaVida || ''} onChange={e => setFormData({ ...formData, areaVida: e.target.value })}>
                      <option value="">Seleccioná un área</option>
                      <option value="amor">Amor y relaciones</option>
                      <option value="trabajo">Trabajo y carrera</option>
                      <option value="dinero">Dinero y abundancia</option>
                      <option value="salud">Salud y bienestar</option>
                      <option value="familia">Familia</option>
                      <option value="espiritual">Crecimiento espiritual</option>
                      <option value="general">General / Guía del momento</option>
                    </select>
                  </div>
                  <div className="campo">
                    <label>Contexto breve (opcional)</label>
                    <textarea
                      value={formData.contexto || ''}
                      onChange={e => setFormData({ ...formData, contexto: e.target.value })}
                      placeholder="¿Hay algo específico que necesitemos saber para interpretar mejor?"
                      rows={2}
                    />
                  </div>
                </>
              )}

              {/* MENSAJES (del guardián, susurros) */}
              {lecturaSeleccionada.categoria === 'mensajes' && (
                <>
                  <div className="campo">
                    <label>¿Qué necesitás escuchar hoy?</label>
                    <select value={formData.necesidad || ''} onChange={e => setFormData({ ...formData, necesidad: e.target.value })}>
                      <option value="">Dejá que el guardián elija</option>
                      <option value="guia">Guía para una decisión</option>
                      <option value="consuelo">Consuelo y contención</option>
                      <option value="motivacion">Motivación y fuerza</option>
                      <option value="claridad">Claridad mental</option>
                      <option value="sanacion">Palabras de sanación</option>
                    </select>
                  </div>
                  <div className="campo">
                    <label>¿Qué está pasando en tu vida ahora?</label>
                    <textarea
                      value={formData.contexto || ''}
                      onChange={e => setFormData({ ...formData, contexto: e.target.value })}
                      placeholder="Contanos brevemente qué estás atravesando..."
                      rows={3}
                    />
                  </div>
                  {lecturaSeleccionada.requiereGuardian && (
                    <div className="campo">
                      <label>¿Qué guardián tenés?</label>
                      <input
                        type="text"
                        value={formData.nombreGuardian || ''}
                        onChange={e => setFormData({ ...formData, nombreGuardian: e.target.value })}
                        placeholder="El nombre de tu duende guardián"
                      />
                    </div>
                  )}
                </>
              )}

              {/* RITUALES */}
              {lecturaSeleccionada.categoria === 'rituales' && (
                <>
                  <div className="campo">
                    <label>¿Cuál es el objetivo del ritual?</label>
                    <select value={formData.objetivoRitual || ''} onChange={e => setFormData({ ...formData, objetivoRitual: e.target.value })}>
                      <option value="">Seleccioná un objetivo</option>
                      <option value="proteccion">Protección</option>
                      <option value="limpieza">Limpieza energética</option>
                      <option value="abundancia">Atraer abundancia</option>
                      <option value="amor">Abrir caminos al amor</option>
                      <option value="sanacion">Sanación emocional</option>
                      <option value="cortar">Cortar lazos o bloqueos</option>
                      <option value="manifestar">Manifestar un deseo</option>
                    </select>
                  </div>
                  <div className="campo">
                    <label>Describí tu situación</label>
                    <textarea
                      value={formData.contexto || ''}
                      onChange={e => setFormData({ ...formData, contexto: e.target.value })}
                      placeholder="¿Por qué necesitás este ritual? ¿Qué querés lograr?"
                      rows={3}
                    />
                  </div>
                  <div className="campo">
                    <label>¿Tenés materiales? (velas, cristales, etc.)</label>
                    <select value={formData.materiales || ''} onChange={e => setFormData({ ...formData, materiales: e.target.value })}>
                      <option value="basico">Solo cosas básicas (velas, sal)</option>
                      <option value="algunos">Tengo algunos cristales y hierbas</option>
                      <option value="completo">Tengo variedad de materiales</option>
                      <option value="ninguno">No tengo nada especial</option>
                    </select>
                  </div>
                </>
              )}

              {/* ESTUDIOS (numerología, carta astral, akáshicos, etc.) */}
              {lecturaSeleccionada.categoria === 'estudios' && (
                <>
                  <div className="campo">
                    <label>Fecha de nacimiento completa *</label>
                    <input
                      type="date"
                      value={formData.fechaNacimiento || ''}
                      onChange={e => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                      required
                    />
                  </div>
                  {(lecturaSeleccionada.id.includes('astral') || lecturaSeleccionada.id.includes('gran_estudio')) && (
                    <>
                      <div className="campo">
                        <label>Hora de nacimiento (si la sabés)</label>
                        <input
                          type="time"
                          value={formData.horaNacimiento || ''}
                          onChange={e => setFormData({ ...formData, horaNacimiento: e.target.value })}
                        />
                      </div>
                      <div className="campo">
                        <label>Lugar de nacimiento</label>
                        <input
                          type="text"
                          value={formData.lugarNacimiento || ''}
                          onChange={e => setFormData({ ...formData, lugarNacimiento: e.target.value })}
                          placeholder="Ciudad, País"
                        />
                      </div>
                    </>
                  )}
                  {lecturaSeleccionada.id.includes('akashico') && (
                    <div className="campo">
                      <label>Tu pregunta para los registros</label>
                      <textarea
                        value={formData.pregunta || ''}
                        onChange={e => setFormData({ ...formData, pregunta: e.target.value })}
                        placeholder="¿Qué querés preguntar a tus registros del alma? Sé específica."
                        rows={3}
                      />
                    </div>
                  )}
                  {(lecturaSeleccionada.id.includes('vidas') || lecturaSeleccionada.id.includes('ancestro')) && (
                    <div className="campo">
                      <label>¿Hay algo que se repite en tu vida?</label>
                      <textarea
                        value={formData.patronesRepetidos || ''}
                        onChange={e => setFormData({ ...formData, patronesRepetidos: e.target.value })}
                        placeholder="Patrones, bloqueos, situaciones que se repiten..."
                        rows={3}
                      />
                    </div>
                  )}
                  <div className="campo">
                    <label>¿Qué área te interesa más explorar?</label>
                    <select value={formData.areaInteres || ''} onChange={e => setFormData({ ...formData, areaInteres: e.target.value })}>
                      <option value="">Todas las áreas</option>
                      <option value="personalidad">Mi personalidad y esencia</option>
                      <option value="proposito">Mi propósito de vida</option>
                      <option value="relaciones">Mis relaciones</option>
                      <option value="carrera">Mi carrera y vocación</option>
                      <option value="espiritual">Mi camino espiritual</option>
                    </select>
                  </div>
                </>
              )}

              {/* LECTURAS GENERALES */}
              {(lecturaSeleccionada.categoria === 'lecturas' || lecturaSeleccionada.categoria === 'guias') && (
                <>
                  <div className="campo">
                    <label>¿Qué querés explorar?</label>
                    <textarea
                      value={formData.pregunta || ''}
                      onChange={e => setFormData({ ...formData, pregunta: e.target.value })}
                      placeholder="Tu intención o pregunta para esta lectura..."
                      rows={3}
                    />
                  </div>
                  <div className="campo">
                    <label>Momento de vida actual</label>
                    <select value={formData.momentoVida || ''} onChange={e => setFormData({ ...formData, momentoVida: e.target.value })}>
                      <option value="">Seleccioná</option>
                      <option value="transicion">En transición/cambios</option>
                      <option value="crisis">Atravesando una crisis</option>
                      <option value="crecimiento">En crecimiento y expansión</option>
                      <option value="estabilidad">Momento estable</option>
                      <option value="busqueda">Buscando algo nuevo</option>
                    </select>
                  </div>
                  <div className="campo">
                    <label>Contexto adicional (opcional)</label>
                    <textarea
                      value={formData.contexto || ''}
                      onChange={e => setFormData({ ...formData, contexto: e.target.value })}
                      placeholder="Cualquier información que creas relevante..."
                      rows={2}
                    />
                  </div>
                </>
              )}

              {/* EVENTOS Y PORTALES */}
              {(lecturaSeleccionada.categoria === 'eventos' || lecturaSeleccionada.categoria === 'portales') && (
                <>
                  <div className="campo">
                    <label>¿Qué querés trabajar en este portal/evento?</label>
                    <textarea
                      value={formData.intencion || ''}
                      onChange={e => setFormData({ ...formData, intencion: e.target.value })}
                      placeholder="Tu intención para aprovechar esta energía especial..."
                      rows={3}
                    />
                  </div>
                  <div className="campo">
                    <label>¿Qué necesitás soltar?</label>
                    <textarea
                      value={formData.soltar || ''}
                      onChange={e => setFormData({ ...formData, soltar: e.target.value })}
                      placeholder="Lo que ya no te sirve..."
                      rows={2}
                    />
                  </div>
                  <div className="campo">
                    <label>¿Qué querés manifestar?</label>
                    <textarea
                      value={formData.manifestar || ''}
                      onChange={e => setFormData({ ...formData, manifestar: e.target.value })}
                      placeholder="Lo que querés atraer a tu vida..."
                      rows={2}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="form-resumen">
              <div className="resumen-item">
                <span>Lectura:</span>
                <span>{lecturaSeleccionada.nombre}</span>
              </div>
              <div className="resumen-item">
                <span>Costo:</span>
                <span>{lecturaSeleccionada.precioFinal} ᚱ</span>
              </div>
              <div className="resumen-item">
                <span>XP que ganarás:</span>
                <span>+{lecturaSeleccionada.nivel === 'iniciada' ? 10 : lecturaSeleccionada.nivel === 'aprendiz' ? 25 : lecturaSeleccionada.nivel === 'guardiana' ? 50 : 100}</span>
              </div>
            </div>

            {resultado?.error && (
              <div className="error-msg">{resultado.error}</div>
            )}

            <div className="form-actions">
              <button className="btn-sec" onClick={() => setVistaDetalle('info')}>← Volver</button>
              <button
                className="btn-gold"
                onClick={ejecutarLectura}
                disabled={ejecutando}
              >
                {ejecutando ? 'Canalizando...' : 'Solicitar Lectura'}
              </button>
            </div>
          </div>
        )}

        {vistaDetalle === 'resultado' && resultado && !resultado.error && (
          <div className="lectura-resultado-card">
            <div className="resultado-header">
              <span className="resultado-check">✓</span>
              <h2>¡Tu lectura está lista!</h2>
            </div>

            {resultado.gamificacion?.subioNivel && (
              <div className="nivel-up-banner">
                <span>🎉</span>
                <span>¡Subiste a {resultado.gamificacion.nuevoNivel.nombre}!</span>
              </div>
            )}

            <div className="resultado-stats">
              <div className="stat">
                <span className="stat-valor">+{resultado.gamificacion?.xpGanado}</span>
                <span className="stat-label">XP</span>
              </div>
              <div className="stat">
                <span className="stat-valor">{resultado.solicitud?.runasRestantes}</span>
                <span className="stat-label">Runas</span>
              </div>
              <div className="stat">
                <span className="stat-valor">{resultado.gamificacion?.lecturasCompletadas}</span>
                <span className="stat-label">Lecturas</span>
              </div>
            </div>

            {resultado.resultado && (
              <div className="lectura-contenido">
                <h3>{resultado.resultado.titulo}</h3>
                <div className="contenido-texto">
                  {resultado.resultado.contenido.split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <small>{resultado.resultado.palabras} palabras</small>
              </div>
            )}

            <button className="btn-gold" onClick={cerrarDetalle}>
              Volver al catálogo
            </button>
          </div>
        )}
      </div>
    );
  }

  // Vista principal del catálogo
  return (
    <div className="sec catalogo-gamificado">
      <div className="catalogo-header">
        <h1>Lecturas Mágicas</h1>
        <p>Explorá el catálogo de experiencias. Tu nivel desbloquea nuevas posibilidades.</p>
      </div>

      {/* Info del usuario */}
      <div className="usuario-info-bar">
        <div className="nivel-badge" style={{ borderColor: nivelInfo?.color }}>
          <span className="nivel-icono">{nivelInfo?.icono}</span>
          <span className="nivel-nombre">{nivelInfo?.nombre}</span>
        </div>
        <div className="runas-badge">
          <span className="runas-icono">ᚱ</span>
          <span className="runas-valor">{usuarioInfo.runas || 0}</span>
        </div>
        {usuarioInfo.esCirculo && (
          <div className="circulo-badge">
            <span>★</span>
            <span>Círculo</span>
          </div>
        )}
      </div>

      {/* Eventos activos */}
      {catalogo.eventosActivos && catalogo.eventosActivos.length > 0 && (
        <div className="eventos-activos">
          <h3>🌙 Disponibles ahora</h3>
          <div className="eventos-lista">
            {catalogo.eventosActivos.map(evento => (
              <div
                key={evento.id}
                className="evento-card activo"
                onClick={() => setLecturaSeleccionada(evento)}
              >
                <span className="evento-icono">{evento.icono}</span>
                <div className="evento-info">
                  <strong>{evento.nombre}</strong>
                  <span>{evento.runas} ᚱ</span>
                </div>
                <span className="evento-badge">ACTIVO</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categorías */}
      <div className="categorias-tabs">
        {Object.entries(CATEGORIAS_LECTURAS).map(([key, cat]) => (
          <button
            key={key}
            className={`cat-tab ${categoriaActiva === key ? 'activa' : ''}`}
            onClick={() => setCategoriaActiva(key)}
            style={categoriaActiva === key ? { borderColor: cat.color, color: cat.color } : {}}
          >
            <span>{cat.icono}</span>
            <span>{cat.nombre}</span>
          </button>
        ))}
      </div>

      {/* Info de categoría */}
      <div className="categoria-info">
        <p>{CATEGORIAS_LECTURAS[categoriaActiva]?.desc}</p>
      </div>

      {/* Grid de lecturas */}
      <div className="lecturas-grid">
        {catalogo.catalogo[categoriaActiva]?.map(lectura => (
          <div
            key={lectura.id}
            className={`lectura-card ${lectura.disponible ? '' : 'bloqueada'} ${lectura.popular ? 'popular' : ''} ${lectura.destacado ? 'destacada' : ''}`}
            onClick={() => setLecturaSeleccionada(lectura)}
          >
            {lectura.popular && <span className="tag-popular">Popular</span>}
            {lectura.destacado && <span className="tag-destacado">Destacado</span>}

            <div className="lectura-card-top">
              <span className="lectura-icono">{lectura.icono}</span>
              {!lectura.disponible && (
                <span className="lock-icon">🔒</span>
              )}
            </div>

            <h3>{lectura.nombre}</h3>

            <div className="lectura-meta">
              <span className="nivel-tag" style={{ background: NIVELES_INFO[lectura.nivel]?.color }}>
                {NIVELES_INFO[lectura.nivel]?.icono}
              </span>
              {lectura.requiereGuardian && <span className="guardian-tag">🛡️</span>}
            </div>

            <p className="lectura-desc">{lectura.descripcion?.substring(0, 80)}...</p>

            <div className="lectura-precio">
              {lectura.descuento > 0 && (
                <span className="precio-tachado">{lectura.precioOriginal}</span>
              )}
              <span className="precio-runas">{lectura.precioFinal} ᚱ</span>
              {lectura.descuento > 0 && (
                <span className="descuento">-{lectura.descuento}%</span>
              )}
            </div>

            {lectura.bloqueadoPorNivel && (
              <div className="bloqueado-msg">
                Nivel {NIVELES_INFO[lectura.nivelRequerido]?.nombre}
              </div>
            )}

            {lectura.esEvento && !lectura.disponible && lectura.proximaDisponibilidad && (
              <div className="proximo-evento">
                Próximo: {new Date(lectura.proximaDisponibilidad).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}

        {(!catalogo.catalogo[categoriaActiva] || catalogo.catalogo[categoriaActiva].length === 0) && (
          <div className="sin-lecturas">
            <p>No hay lecturas disponibles en esta categoría actualmente.</p>
          </div>
        )}
      </div>

      {/* CTA para obtener runas */}
      <div className="cta-runas">
        <p>¿Necesitás más runas?</p>
        <a href={`${WORDPRESS_URL}/producto-categoria/runas/`} target="_blank" rel="noopener" className="btn-gold-sm">
          Obtener Runas ↗
        </a>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIENDA DE RUNAS - GAMIFICACIÓN
// ═══════════════════════════════════════════════════════════════

const PAQUETES_RUNAS_UI = [
  {
    id: 'chispa',
    nombre: 'Chispa',
    runas: 30,
    precio: 5,
    bonus: 0,
    slug: 'paquete-runas-30',
    popular: false,
    descripcion: 'Perfecto para empezar',
    icono: '✧',
    color: '#8B9A46'
  },
  {
    id: 'destello',
    nombre: 'Destello',
    runas: 80,
    precio: 10,
    bonus: 10,
    slug: 'paquete-runas-80',
    popular: true,
    descripcion: '+10 runas de regalo',
    icono: '✦',
    color: '#D4AF37'
  },
  {
    id: 'resplandor',
    nombre: 'Resplandor',
    runas: 200,
    precio: 20,
    bonus: 40,
    slug: 'paquete-runas-200',
    popular: false,
    descripcion: '+40 runas de regalo',
    icono: '◆',
    color: '#9B59B6'
  },
  {
    id: 'fulgor',
    nombre: 'Fulgor',
    runas: 550,
    precio: 50,
    bonus: 150,
    slug: 'paquete-runas-550',
    popular: false,
    descripcion: '+150 runas de regalo',
    icono: '❖',
    color: '#3498db'
  },
  {
    id: 'aurora',
    nombre: 'Aurora',
    runas: 1200,
    precio: 100,
    bonus: 400,
    slug: 'paquete-runas-1200',
    popular: false,
    destacado: true,
    descripcion: 'El mejor valor - +400 runas',
    icono: '✹',
    color: '#e74c3c'
  }
];

function TiendaRunas({ usuario, onCompra }) {
  const [paqueteHover, setPaqueteHover] = useState(null);

  const calcularRatio = (paquete) => {
    return (paquete.runas / paquete.precio).toFixed(1);
  };

  return (
    <div className="tienda-runas-container">
      {/* Header */}
      <div className="tienda-runas-header">
        <div className="header-glow"></div>
        <div className="runa-grande">ᚱ</div>
        <h2>Tienda de Runas</h2>
        <p>Las runas son la moneda mágica del bosque. Usalas para acceder a lecturas, experiencias y secretos ancestrales.</p>

        <div className="balance-actual">
          <span className="balance-label">Tu balance actual</span>
          <div className="balance-valor">
            <span className="runa-icono">ᚱ</span>
            <span className="balance-numero">{usuario?.runas || 0}</span>
          </div>
        </div>
      </div>

      {/* Grid de paquetes */}
      <div className="paquetes-grid">
        {PAQUETES_RUNAS_UI.map((paquete, index) => (
          <a
            key={paquete.id}
            href={`${WORDPRESS_URL}/product/${paquete.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className={`paquete-card ${paquete.popular ? 'popular' : ''} ${paquete.destacado ? 'destacado' : ''}`}
            style={{ '--paquete-color': paquete.color, '--card-delay': `${index * 0.1}s` }}
            onMouseEnter={() => setPaqueteHover(paquete.id)}
            onMouseLeave={() => setPaqueteHover(null)}
          >
            {paquete.popular && <div className="tag-popular">MÁS POPULAR</div>}
            {paquete.destacado && <div className="tag-destacado">MEJOR VALOR</div>}

            <div className="paquete-glow"></div>
            <div className="paquete-frame"></div>

            {/* Corners */}
            <div className="paquete-corner tl"></div>
            <div className="paquete-corner tr"></div>
            <div className="paquete-corner bl"></div>
            <div className="paquete-corner br"></div>

            <div className="paquete-icono">
              <span>{paquete.icono}</span>
            </div>

            <h3 className="paquete-nombre">{paquete.nombre}</h3>

            <div className="paquete-runas">
              <span className="runas-numero">{paquete.runas}</span>
              <span className="runas-simbolo">ᚱ</span>
            </div>

            {paquete.bonus > 0 && (
              <div className="paquete-bonus">
                +{paquete.bonus} runas gratis
              </div>
            )}

            <p className="paquete-desc">{paquete.descripcion}</p>

            <div className="paquete-precio">
              <span className="precio-moneda">$</span>
              <span className="precio-numero">{paquete.precio}</span>
              <span className="precio-usd">USD</span>
            </div>

            <div className="paquete-ratio">
              {calcularRatio(paquete)} runas por dólar
            </div>

            <div className="paquete-cta">
              <span>Obtener</span>
              <span className="cta-arrow">→</span>
            </div>

            {/* Partículas en hover */}
            {paqueteHover === paquete.id && (
              <div className="particulas">
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="particula" style={{ '--delay': `${i * 0.15}s`, '--x': `${Math.random() * 100}%` }}>ᚱ</span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>

      {/* Info adicional */}
      <div className="tienda-info">
        <div className="info-item">
          <span className="info-icono">🔒</span>
          <div>
            <strong>Pago seguro</strong>
            <p>Procesado por WooCommerce</p>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icono">⚡</span>
          <div>
            <strong>Entrega instantánea</strong>
            <p>Tus runas se acreditan al instante</p>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icono">♾️</span>
          <div>
            <strong>No expiran</strong>
            <p>Usalas cuando quieras</p>
          </div>
        </div>
      </div>

      {/* Qué puedo hacer con runas */}
      <div className="runas-usos">
        <h3>¿Qué puedo hacer con las runas?</h3>
        <div className="usos-grid">
          <div className="uso-card">
            <span className="uso-icono">ᚱ</span>
            <strong>Tiradas de Runas</strong>
            <small>Desde 15 ᚱ</small>
          </div>
          <div className="uso-card">
            <span className="uso-icono">✦</span>
            <strong>Lecturas del Alma</strong>
            <small>Desde 25 ᚱ</small>
          </div>
          <div className="uso-card">
            <span className="uso-icono">☽</span>
            <strong>Oráculos del Mes</strong>
            <small>Desde 40 ᚱ</small>
          </div>
          <div className="uso-card">
            <span className="uso-icono">∞</span>
            <strong>Registros Akáshicos</strong>
            <small>Desde 200 ᚱ</small>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tienda-runas-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .tienda-runas-header {
          text-align: center;
          padding: 40px 20px;
          background: linear-gradient(180deg, rgba(20,20,30,0.95) 0%, rgba(10,10,20,0.98) 100%);
          border-radius: 24px;
          margin-bottom: 30px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(212,175,55,0.2);
        }

        .header-glow {
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .runa-grande {
          font-size: 64px;
          color: #d4af37;
          text-shadow: 0 0 40px rgba(212,175,55,0.5);
          margin-bottom: 15px;
          animation: pulseRuna 3s ease-in-out infinite;
        }

        @keyframes pulseRuna {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        .tienda-runas-header h2 {
          font-family: 'Cinzel', serif;
          font-size: clamp(24px, 5vw, 36px);
          color: #d4af37;
          margin: 0 0 10px;
          letter-spacing: 3px;
          position: relative;
        }

        .tienda-runas-header p {
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          max-width: 500px;
          margin: 0 auto 25px;
          line-height: 1.6;
          position: relative;
        }

        .balance-actual {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 16px;
          padding: 15px 30px;
          position: relative;
        }

        .balance-label {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 5px;
        }

        .balance-valor {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .balance-valor .runa-icono {
          font-size: 24px;
          color: #d4af37;
        }

        .balance-numero {
          font-family: 'Cinzel', serif;
          font-size: 32px;
          color: #fff;
          font-weight: 600;
        }

        /* Grid de paquetes */
        .paquetes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .paquete-card {
          position: relative;
          background: linear-gradient(145deg, rgba(20,20,30,0.95) 0%, rgba(10,10,20,0.98) 100%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 25px 20px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          animation: fadeInCard 0.5s ease forwards;
          animation-delay: var(--card-delay);
          opacity: 0;
        }

        @keyframes fadeInCard {
          to { opacity: 1; transform: translateY(0); }
          from { opacity: 0; transform: translateY(20px); }
        }

        .paquete-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--paquete-color);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 30px color-mix(in srgb, var(--paquete-color) 30%, transparent);
        }

        .paquete-card.popular {
          border-color: rgba(212,175,55,0.5);
          box-shadow: 0 0 20px rgba(212,175,55,0.2);
        }

        .paquete-card.destacado {
          border-color: rgba(231,76,60,0.5);
        }

        .tag-popular, .tag-destacado {
          position: absolute;
          top: -1px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #0a0a0a;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 4px 12px;
          border-radius: 0 0 8px 8px;
        }

        .tag-destacado {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: #fff;
        }

        .paquete-glow {
          position: absolute;
          inset: -100%;
          background: radial-gradient(circle at center, var(--paquete-color), transparent 70%);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }

        .paquete-card:hover .paquete-glow {
          opacity: 0.1;
        }

        .paquete-frame {
          position: absolute;
          inset: 4px;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 18px;
          pointer-events: none;
        }

        .paquete-corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border: 2px solid var(--paquete-color);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .paquete-card:hover .paquete-corner {
          opacity: 0.7;
        }

        .paquete-corner.tl { top: 8px; left: 8px; border-right: none; border-bottom: none; border-radius: 4px 0 0 0; }
        .paquete-corner.tr { top: 8px; right: 8px; border-left: none; border-bottom: none; border-radius: 0 4px 0 0; }
        .paquete-corner.bl { bottom: 8px; left: 8px; border-right: none; border-top: none; border-radius: 0 0 0 4px; }
        .paquete-corner.br { bottom: 8px; right: 8px; border-left: none; border-top: none; border-radius: 0 0 4px 0; }

        .paquete-icono {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: var(--paquete-color);
          margin-bottom: 12px;
          position: relative;
          text-shadow: 0 0 20px var(--paquete-color);
        }

        .paquete-nombre {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          color: #fff;
          margin: 0 0 10px;
          letter-spacing: 1px;
        }

        .paquete-runas {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 8px;
        }

        .runas-numero {
          font-family: 'Cinzel', serif;
          font-size: 36px;
          color: #fff;
          font-weight: 600;
        }

        .runas-simbolo {
          font-size: 20px;
          color: #d4af37;
        }

        .paquete-bonus {
          background: linear-gradient(135deg, rgba(46,204,113,0.2), rgba(39,174,96,0.2));
          border: 1px solid rgba(46,204,113,0.4);
          color: #2ecc71;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          margin-bottom: 10px;
        }

        .paquete-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin: 0 0 12px;
          text-align: center;
        }

        .paquete-precio {
          display: flex;
          align-items: baseline;
          gap: 2px;
          margin-bottom: 5px;
        }

        .precio-moneda {
          font-size: 16px;
          color: #d4af37;
        }

        .precio-numero {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          color: #d4af37;
          font-weight: 600;
        }

        .precio-usd {
          font-size: 12px;
          color: rgba(212,175,55,0.7);
          margin-left: 4px;
        }

        .paquete-ratio {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 15px;
        }

        .paquete-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, var(--paquete-color), color-mix(in srgb, var(--paquete-color) 70%, #000));
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 25px;
          transition: all 0.3s;
        }

        .paquete-card:hover .paquete-cta {
          transform: scale(1.05);
          box-shadow: 0 5px 20px color-mix(in srgb, var(--paquete-color) 40%, transparent);
        }

        .cta-arrow {
          transition: transform 0.3s;
        }

        .paquete-card:hover .cta-arrow {
          transform: translateX(4px);
        }

        /* Partículas */
        .particulas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particula {
          position: absolute;
          bottom: 0;
          left: var(--x);
          font-size: 14px;
          color: #d4af37;
          animation: floatUp 1.5s ease-out forwards;
          animation-delay: var(--delay);
          opacity: 0;
        }

        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-150px) rotate(20deg); opacity: 0; }
        }

        /* Info items */
        .tienda-info {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
          padding: 30px 20px;
          background: rgba(255,255,255,0.02);
          border-radius: 16px;
          margin-bottom: 30px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .info-icono {
          font-size: 24px;
        }

        .info-item strong {
          display: block;
          color: #fff;
          font-size: 14px;
        }

        .info-item p {
          margin: 0;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }

        /* Usos de runas */
        .runas-usos {
          background: linear-gradient(145deg, rgba(20,20,30,0.95) 0%, rgba(10,10,20,0.98) 100%);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 20px;
          padding: 30px;
          text-align: center;
        }

        .runas-usos h3 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          font-size: 18px;
          margin: 0 0 20px;
          letter-spacing: 2px;
        }

        .usos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 15px;
        }

        .uso-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 20px 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .uso-card:hover {
          border-color: rgba(212,175,55,0.3);
          background: rgba(212,175,55,0.05);
        }

        .uso-icono {
          font-size: 24px;
          color: #d4af37;
        }

        .uso-card strong {
          color: #fff;
          font-size: 13px;
        }

        .uso-card small {
          color: rgba(255,255,255,0.5);
          font-size: 11px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .paquetes-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .paquete-card {
            padding: 20px 15px;
          }

          .runas-numero {
            font-size: 28px;
          }

          .precio-numero {
            font-size: 22px;
          }

          .tienda-info {
            flex-direction: column;
            gap: 15px;
          }

          .runa-grande {
            font-size: 48px;
          }
        }

        @media (max-width: 400px) {
          .paquetes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIENDA DE MEMBRESÍAS DEL CÍRCULO
// ═══════════════════════════════════════════════════════════════

const MEMBRESIAS_UI = [
  {
    id: 'mensual',
    nombre: 'Mensual',
    precio: 15,
    meses: 1,
    runasBienvenida: 20,
    runasMensuales: 12,
    slug: 'circulo-mensual',
    descripcion: 'Perfecto para probar',
    icono: '☽',
    color: '#8B9A46',
    beneficios: ['Contenido exclusivo semanal', 'Foro privado', '12 runas cada mes']
  },
  {
    id: 'semestral',
    nombre: 'Seis Meses',
    precio: 50,
    meses: 6,
    runasBienvenida: 60,
    runasMensuales: 15,
    slug: 'circulo-seis-meses',
    popular: true,
    descripcion: 'Ahorrás $40',
    icono: '✦',
    color: '#D4AF37',
    beneficios: ['Todo lo del mensual', '15 runas cada mes', 'Descuento en tienda']
  },
  {
    id: 'anual',
    nombre: 'Año del Guardián',
    precio: 80,
    meses: 12,
    runasBienvenida: 120,
    runasMensuales: 25,
    slug: 'circulo-anual',
    destacado: true,
    descripcion: 'El mejor valor - Ahorrás $100',
    icono: '👑',
    color: '#9B59B6',
    beneficios: ['Todo lo anterior', '25 runas cada mes', 'Acceso anticipado', 'Badge exclusivo']
  }
];

function TiendaMembresias({ usuario, circulo }) {
  const [planHover, setPlanHover] = useState(null);

  const calcularAhorro = (plan) => {
    const costoMensual = 15 * plan.meses;
    return costoMensual - plan.precio;
  };

  const esMiembro = circulo?.activo;

  return (
    <div className="tienda-membresias-container">
      {/* Header */}
      <div className="membresias-header">
        <div className="header-glow"></div>
        <div className="circulo-icono">⭐</div>
        <h2>El Círculo de Duendes</h2>
        <p>Únete al Santuario. Acceso exclusivo a contenido, comunidad y runas mensuales.</p>

        {esMiembro ? (
          <div className="estado-miembro activo">
            <span className="estado-icono">✓</span>
            <div>
              <strong>Sos parte del Círculo</strong>
              <small>Plan: {circulo.planNombre || circulo.plan}</small>
            </div>
          </div>
        ) : (
          <div className="estado-miembro inactivo">
            <span className="estado-icono">☆</span>
            <span>Todavía no sos miembro</span>
          </div>
        )}
      </div>

      {/* Grid de planes */}
      <div className="planes-grid">
        {MEMBRESIAS_UI.map((plan, index) => (
          <a
            key={plan.id}
            href={`${WORDPRESS_URL}/product/${plan.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className={`plan-card ${plan.popular ? 'popular' : ''} ${plan.destacado ? 'destacado' : ''}`}
            style={{ '--plan-color': plan.color, '--card-delay': `${index * 0.1}s` }}
            onMouseEnter={() => setPlanHover(plan.id)}
            onMouseLeave={() => setPlanHover(null)}
          >
            {plan.popular && <div className="tag-popular">MÁS POPULAR</div>}
            {plan.destacado && <div className="tag-destacado">MEJOR VALOR</div>}

            <div className="plan-glow"></div>

            <div className="plan-icono">
              <span>{plan.icono}</span>
            </div>

            <h3 className="plan-nombre">{plan.nombre}</h3>

            <div className="plan-precio">
              <span className="precio-moneda">$</span>
              <span className="precio-numero">{plan.precio}</span>
              <span className="precio-periodo">USD</span>
            </div>

            {plan.meses > 1 && (
              <div className="plan-ahorro">
                Ahorrás ${calcularAhorro(plan)}
              </div>
            )}

            <div className="plan-runas-bienvenida">
              <span className="runa-icono">ᚱ</span>
              <span>{plan.runasBienvenida} runas de bienvenida</span>
            </div>

            <ul className="plan-beneficios">
              {plan.beneficios.map((b, i) => (
                <li key={i}><span className="check">✓</span> {b}</li>
              ))}
            </ul>

            <div className="plan-runas-mensuales">
              +{plan.runasMensuales} ᚱ cada mes
            </div>

            <div className="plan-cta">
              <span>Unirme al Círculo</span>
              <span className="cta-arrow">→</span>
            </div>

            {planHover === plan.id && (
              <div className="particulas-circulo">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="estrella" style={{ '--delay': `${i * 0.2}s`, '--x': `${20 + Math.random() * 60}%` }}>✦</span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>

      {/* Beneficios del Círculo */}
      <div className="circulo-beneficios">
        <h3>¿Qué incluye el Círculo?</h3>
        <div className="beneficios-grid">
          <div className="beneficio-card">
            <span className="beneficio-icono">📿</span>
            <strong>Contenido Exclusivo</strong>
            <p>Rituales, guías y conocimiento ancestral cada semana</p>
          </div>
          <div className="beneficio-card">
            <span className="beneficio-icono">💬</span>
            <strong>Foro Privado</strong>
            <p>Comunidad de buscadores como vos</p>
          </div>
          <div className="beneficio-card">
            <span className="beneficio-icono">ᚱ</span>
            <strong>Runas Mensuales</strong>
            <p>Recibís runas cada mes mientras seas miembro</p>
          </div>
          <div className="beneficio-card">
            <span className="beneficio-icono">🏷️</span>
            <strong>Descuentos</strong>
            <p>Precios especiales en guardianes y experiencias</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tienda-membresias-container {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .membresias-header {
          text-align: center;
          padding: 40px 20px;
          background: linear-gradient(180deg, rgba(20,20,35,0.95) 0%, rgba(10,10,25,0.98) 100%);
          border-radius: 24px;
          margin-bottom: 30px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(155,89,182,0.3);
        }

        .header-glow {
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(155,89,182,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .circulo-icono {
          font-size: 56px;
          margin-bottom: 15px;
          animation: pulseCirculo 3s ease-in-out infinite;
        }

        @keyframes pulseCirculo {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(155,89,182,0.5)); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 40px rgba(155,89,182,0.8)); }
        }

        .membresias-header h2 {
          font-family: 'Cinzel', serif;
          font-size: clamp(22px, 5vw, 32px);
          color: #fff;
          margin: 0 0 10px;
          letter-spacing: 3px;
        }

        .membresias-header p {
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          max-width: 450px;
          margin: 0 auto 25px;
          line-height: 1.6;
        }

        .estado-miembro {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          border-radius: 50px;
          font-size: 14px;
        }

        .estado-miembro.activo {
          background: rgba(46,204,113,0.15);
          border: 1px solid rgba(46,204,113,0.4);
          color: #2ecc71;
        }

        .estado-miembro.activo strong {
          display: block;
          color: #fff;
        }

        .estado-miembro.activo small {
          color: rgba(255,255,255,0.6);
          font-size: 12px;
        }

        .estado-miembro.inactivo {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
        }

        .estado-icono {
          font-size: 20px;
        }

        /* Grid de planes */
        .planes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .plan-card {
          position: relative;
          background: linear-gradient(145deg, rgba(20,20,35,0.95) 0%, rgba(10,10,25,0.98) 100%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 30px 20px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          animation: fadeInCard 0.5s ease forwards;
          animation-delay: var(--card-delay);
          opacity: 0;
        }

        @keyframes fadeInCard {
          to { opacity: 1; transform: translateY(0); }
          from { opacity: 0; transform: translateY(20px); }
        }

        .plan-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--plan-color);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 30px color-mix(in srgb, var(--plan-color) 30%, transparent);
        }

        .plan-card.popular {
          border-color: rgba(212,175,55,0.5);
          box-shadow: 0 0 25px rgba(212,175,55,0.2);
        }

        .plan-card.destacado {
          border-color: rgba(155,89,182,0.5);
          box-shadow: 0 0 25px rgba(155,89,182,0.2);
        }

        .tag-popular, .tag-destacado {
          position: absolute;
          top: -1px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #0a0a0a;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 5px 14px;
          border-radius: 0 0 10px 10px;
        }

        .tag-destacado {
          background: linear-gradient(135deg, #9b59b6, #8e44ad);
          color: #fff;
        }

        .plan-glow {
          position: absolute;
          inset: -100%;
          background: radial-gradient(circle at center, var(--plan-color), transparent 70%);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }

        .plan-card:hover .plan-glow {
          opacity: 0.1;
        }

        .plan-icono {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .plan-nombre {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          color: #fff;
          margin: 0 0 15px;
          text-align: center;
        }

        .plan-precio {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 8px;
        }

        .precio-moneda {
          font-size: 18px;
          color: rgba(255,255,255,0.6);
        }

        .precio-numero {
          font-family: 'Cinzel', serif;
          font-size: 42px;
          color: #fff;
          font-weight: 600;
          line-height: 1;
        }

        .precio-periodo {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-left: 4px;
        }

        .plan-ahorro {
          background: rgba(46,204,113,0.15);
          color: #2ecc71;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 15px;
        }

        .plan-runas-bienvenida {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          color: #d4af37;
          margin-bottom: 20px;
        }

        .runa-icono {
          font-size: 16px;
        }

        .plan-beneficios {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
          width: 100%;
        }

        .plan-beneficios li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .plan-beneficios li:last-child {
          border-bottom: none;
        }

        .check {
          color: #2ecc71;
          font-size: 12px;
        }

        .plan-runas-mensuales {
          color: var(--plan-color);
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .plan-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--plan-color);
          color: #fff;
          padding: 12px 24px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
          width: 100%;
          justify-content: center;
        }

        .plan-card:hover .plan-cta {
          transform: scale(1.05);
          box-shadow: 0 5px 20px color-mix(in srgb, var(--plan-color) 50%, transparent);
        }

        .cta-arrow {
          transition: transform 0.3s;
        }

        .plan-card:hover .cta-arrow {
          transform: translateX(4px);
        }

        .particulas-circulo {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .estrella {
          position: absolute;
          bottom: 20%;
          left: var(--x);
          font-size: 16px;
          color: var(--plan-color);
          animation: floatStar 2s ease-out forwards;
          animation-delay: var(--delay);
          opacity: 0;
        }

        @keyframes floatStar {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          20% { opacity: 1; transform: scale(1); }
          100% { transform: translateY(-100px) rotate(180deg); opacity: 0; }
        }

        /* Beneficios del Círculo */
        .circulo-beneficios {
          background: linear-gradient(145deg, rgba(20,20,35,0.95) 0%, rgba(10,10,25,0.98) 100%);
          border: 1px solid rgba(155,89,182,0.2);
          border-radius: 20px;
          padding: 30px;
          text-align: center;
        }

        .circulo-beneficios h3 {
          font-family: 'Cinzel', serif;
          color: #fff;
          font-size: 18px;
          margin: 0 0 25px;
          letter-spacing: 2px;
        }

        .beneficios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
        }

        .beneficio-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 25px 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          transition: all 0.3s;
        }

        .beneficio-card:hover {
          border-color: rgba(155,89,182,0.3);
          background: rgba(155,89,182,0.05);
        }

        .beneficio-icono {
          font-size: 28px;
        }

        .beneficio-card strong {
          color: #fff;
          font-size: 14px;
        }

        .beneficio-card p {
          margin: 0;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          line-height: 1.4;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .planes-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto 40px;
          }
        }

        @media (max-width: 768px) {
          .circulo-icono {
            font-size: 44px;
          }

          .beneficios-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .beneficios-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

// limpiarTexto y TITO_IMG ahora importados desde ./components/constants

// ═══════════════════════════════════════════════════════════════
// PACKS DE RUNAS (con URLs directas)
// ═══════════════════════════════════════════════════════════════

const PACKS_RUNAS = [
  { nombre: 'Chispa', runas: 30, bonus: 0, precio: 5, url: `${WORDPRESS_URL}/producto/runas-chispa/`, desc: 'Para empezar a explorar (30 runas)' },
  { nombre: 'Destello', runas: 80, bonus: 10, precio: 10, url: `${WORDPRESS_URL}/producto/runas-destello/`, desc: 'El más popular (80 + 10 bonus = 90 runas)' },
  { nombre: 'Resplandor', runas: 200, bonus: 40, precio: 20, url: `${WORDPRESS_URL}/producto/runas-resplandor/`, desc: 'Para varias experiencias (200 + 40 bonus = 240 runas)' },
  { nombre: 'Fulgor', runas: 550, bonus: 150, precio: 50, url: `${WORDPRESS_URL}/producto/runas-fulgor/`, desc: 'Pack potente (550 + 150 bonus = 700 runas)' },
  { nombre: 'Aurora', runas: 1200, bonus: 400, precio: 100, url: `${WORDPRESS_URL}/producto/runas-aurora/`, desc: 'El mejor valor (1200 + 400 bonus = 1600 runas)' }
];

// ═══════════════════════════════════════════════════════════════
// EXPERIENCIAS CON INFO COMPLETA Y HUMANA
// ═══════════════════════════════════════════════════════════════

const EXPERIENCIAS = [
  { 
    id: 'tirada-runas',
    nombre: 'Tirada de Runas',
    icono: 'ᚱ',
    runas: 8,
    treboles: 40, 
    tiempo: '20-30 minutos', 
    intro: `Las runas son un antiguo alfabeto nórdico que trasciende la escritura. Cada símbolo guarda energía, sabiduría y mensajes del universo. Cuando hacemos una tirada, no es azar - es sincronicidad pura.

Nosotros nos sentamos en silencio, conectamos con tu energía a través de tu pregunta, y dejamos que las runas hablen. A veces el mensaje es directo; otras veces es simbólico y requiere interpretación.`,
    queRecibis: ['Tirada de 3 runas con interpretación profunda', 'Mensaje canalizado específico para tu situación', 'Guía práctica de acción (qué hacer ahora)', 'Ritual opcional para potenciar el mensaje'],
    paraQuien: 'Ideal si tenés una pregunta concreta, necesitás claridad sobre una decisión, o simplemente querés saber qué energía te rodea en este momento.',
    campos: ['pregunta', 'contexto']
  },
  { 
    id: 'susurro-guardian',
    nombre: 'Susurro del Guardián',
    icono: '✦',
    runas: 15,
    treboles: 75, 
    tiempo: '40-60 minutos',
    intro: `¿Estás mirando los guardianes de la tienda y no sabés cuál elegir? ¿Sentís que varios te llaman pero no podés decidirte? Este servicio existe exactamente para eso.

Lo que hacemos es conectar con los guardianes que mencionás y dejar que ELLOS hablen. Porque recordá: el duende te elige a vos, no al revés. A veces pensamos que queremos uno y resulta que otro lleva tiempo esperándonos.`,
    queRecibis: ['Conexión canalizada con los guardianes que mencionaste', 'Mensaje directo del guardián que resuena con vos', 'Explicación de por qué ÉL te eligió', 'Guía para preparar su llegada a tu hogar'],
    paraQuien: 'Para vos que estás entre varios guardianes y necesitás esa confirmación. O si sentís el llamado pero no sabés por dónde empezar.',
    campos: ['guardianes_interes', 'situacion', 'que_buscas'],
    esElegirGuardian: true
  },
  { 
    id: 'oraculo-mes',
    nombre: 'Oráculo del Mes',
    icono: '☽',
    runas: 18,
    treboles: 90, 
    tiempo: '1-2 horas',
    intro: `Cada mes trae su propia energía. Las fases lunares, los tránsitos planetarios, las estaciones... todo influye en cómo fluye nuestra vida. Este oráculo te da un mapa completo del mes que viene.

No es una predicción rígida del futuro - es una guía de las energías disponibles y cómo aprovecharlas. Porque el futuro no está escrito; se co-crea entre el universo y tus decisiones.`,
    queRecibis: ['Tirada de 5 runas para cada área de tu vida', 'Análisis de las fases lunares del mes', 'Días favorables marcados para diferentes actividades', 'Rituales específicos para cada semana', 'Cristales y elementos recomendados'],
    paraQuien: 'Perfecto si te gusta planificar, si querés saber cuándo es mejor momento para iniciar proyectos, tener conversaciones difíciles, o simplemente fluir con la energía del mes.',
    campos: ['mes', 'area_principal', 'situacion']
  },
  { 
    id: 'gran-oraculo',
    nombre: 'El Gran Oráculo',
    icono: '★',
    runas: 35,
    treboles: 175, 
    tiempo: '2-3 horas',
    intro: `Esta es nuestra lectura más completa para quienes quieren ver el panorama grande. Tres meses de tu vida mapeados en detalle: amor, trabajo, salud, espiritualidad, desarrollo personal.

Usamos una combinación de runas, numerología (por eso pedimos tu fecha de nacimiento) y canalización directa. El resultado es un documento extenso que vas a querer releer varias veces porque siempre encontrarás nuevos detalles.`,
    queRecibis: ['Tirada de 7 runas maestras', 'Análisis numerológico personal', 'Mapa detallado de los próximos 3 meses', '3 rituales completamente personalizados', 'Cristales, hierbas y elementos específicos para tu camino'],
    paraQuien: 'Para momentos de transición importante, inicio de año, cumpleaños, o cuando sentís que necesitás una visión amplia de hacia dónde va tu vida.',
    campos: ['fecha_nacimiento', 'hora_nacimiento', 'lugar_nacimiento', 'pregunta_principal']
  },
  { 
    id: 'lectura-alma',
    nombre: 'Lectura del Alma',
    icono: '◈',
    runas: 45,
    treboles: 225, 
    tiempo: '4-6 horas',
    intro: `¿Alguna vez sentiste que hay algo más grande esperándote? ¿Que viniste a este mundo con un propósito que todavía no terminás de descifrar? Esta lectura va a las profundidades de tu ser.

Trabajamos con tu número de vida (calculado desde tu fecha de nacimiento), patrones que se repiten en tu historia, y canalización profunda para revelar tu misión de alma. No es solo "qué vas a ser" - es "quién viniste a ser".`,
    queRecibis: ['Tu número de vida y su significado completo', 'Misión de alma revelada', 'Patrones kármicos que estás trabajando', 'Dones innatos que podés desarrollar', 'Guía detallada para los próximos 6 meses', 'Meditación personalizada grabada'],
    paraQuien: 'Para quienes sienten el llamado espiritual fuerte, están en búsqueda de propósito, o atraviesan una "crisis" que en realidad es un despertar.',
    campos: ['fecha_nacimiento', 'hora_nacimiento', 'lugar_nacimiento', 'nombre_completo', 'patrones_repetitivos']
  },
  { 
    id: 'registros-akashicos',
    nombre: 'Registros Akáshicos',
    icono: '∞',
    runas: 60,
    treboles: 300, 
    tiempo: '6-8 horas',
    intro: `Los Registros Akáshicos son la biblioteca cósmica donde está guardada toda la información de tu alma a través de todas sus encarnaciones. Acceder a ellos es como abrir el libro de tu existencia eterna.

Este proceso es sagrado y profundo. Requiere preparación tanto de nuestra parte como tuya. El resultado es información de vidas pasadas que explican patrones actuales, contratos álmicos que tenés vigentes, y mensajes directos de tus guías y maestros ascendidos.`,
    queRecibis: ['Apertura ceremonial de tus registros', 'Información de 3 vidas pasadas relevantes para tu presente', 'Contratos álmicos actuales y cómo trabajarlos', 'Mensajes de tus guías y maestros', 'Karma pendiente y guía para resolverlo', 'Tu misión específica en esta vida', 'Ritual de integración'],
    paraQuien: 'Para almas maduras en el camino espiritual, quienes sienten conexiones inexplicables con épocas o lugares, o quienes quieren entender el "por qué" profundo de sus experiencias.',
    campos: ['fecha_nacimiento', 'hora_nacimiento', 'lugar_nacimiento', 'nombre_completo', 'miedos_inexplicables', 'atracciones_epocas']
  },
  { 
    id: 'carta-ancestral',
    nombre: 'Carta Ancestral',
    icono: '❧',
    runas: 22,
    treboles: 110, 
    tiempo: '1-2 horas',
    intro: `Tus ancestros no se fueron del todo. Su sangre corre por tus venas, sus memorias están en tu ADN, y su amor te acompaña aunque no los veas. Esta carta es un puente hacia ellos.

Canalizamos mensajes de tu linaje - pueden ser abuelos que conociste, bisabuelos que no, o ancestros más antiguos que tienen algo que decirte. A veces traen bendiciones; otras veces, advertencias cariñosas; siempre, amor.`,
    queRecibis: ['Mensaje canalizado directamente de tu linaje', 'Activación de protección ancestral', 'Bendiciones de línea familiar', 'Patrones heredados que podés sanar', 'Dones ancestrales que podés recuperar', 'Ritual de ofrenda sugerido para honrarlos'],
    paraQuien: 'Para quienes sienten conexión con sus raíces, perdieron seres queridos y quieren reconectar, o notan patrones familiares que quieren entender y sanar.',
    campos: ['nombre_ancestro', 'nacionalidades', 'patrones_familia']
  },
  { 
    id: 'mapa-energetico',
    nombre: 'Mapa Energético',
    icono: '◎',
    runas: 28,
    treboles: 140, 
    tiempo: '2-3 horas',
    intro: `Tu cuerpo físico es solo la capa más densa de quien sos. Alrededor y a través de él fluye tu cuerpo energético: chakras, aura, meridianos. Cuando algo está mal energéticamente, eventualmente se manifiesta en lo físico o emocional.

Este mapa es un diagnóstico completo. Escaneamos tu campo, identificamos dónde hay bloqueos, fugas, o desequilibrios, y te damos un plan concreto para limpiarte y reequilibrarte.`,
    queRecibis: ['Análisis detallado de tus 7 chakras principales', 'Bloqueos específicos identificados con su origen probable', 'Fugas energéticas y cómo sellarlas', 'Plan de limpieza día a día por 21 días', 'Cristales recomendados para cada chakra', 'Ejercicios energéticos diarios', 'Afirmaciones personalizadas'],
    paraQuien: 'Para quienes sienten cansancio inexplicable, bloqueos creativos o emocionales, sensación de estancamiento, o simplemente quieren un "chequeo energético".',
    campos: ['sintomas_fisicos', 'sintomas_emocionales', 'areas_bloqueadas']
  },
  { 
    id: 'pregunta-especifica',
    nombre: 'Pregunta Específica',
    icono: '?',
    runas: 12,
    treboles: 60, 
    tiempo: '30-45 minutos',
    intro: `A veces no necesitás un análisis extenso. Necesitás UNA respuesta. Esa pregunta que te da vueltas en la cabeza, que no te deja dormir, que necesitás resolver para poder avanzar.

Este servicio es directo y al punto. Hacés tu pregunta, canalizamos la respuesta, te la damos sin vueltas. Sí, no, cómo, cuándo, qué hacer. Claridad pura.`,
    queRecibis: ['Respuesta canalizada directa y clara', 'Pros y contras revelados', 'Consejo de acción específico', 'Timing sugerido (cuándo actuar)', 'Posibles obstáculos y cómo superarlos'],
    paraQuien: 'Para decisiones puntuales: ¿acepto ese trabajo?, ¿termino esta relación?, ¿me mudo?, ¿empiezo ese proyecto? Preguntas concretas, respuestas concretas.',
    campos: ['pregunta', 'contexto', 'opciones', 'deadline']
  }
];

// ═══════════════════════════════════════════════════════════════
// CANJES (con IDs para API)
// ═══════════════════════════════════════════════════════════════

const CANJES = [
  // Cupones de descuento fijo en USD
  { id: 'cupon-5usd', nombre: 'Cupón $5 USD', treboles: 30, desc: 'Válido en cualquier compra', tipo: 'cupon', valor: 5, valorUY: 225 },
  { id: 'cupon-10usd', nombre: 'Cupón $10 USD', treboles: 60, desc: 'Sin mínimo de compra', tipo: 'cupon', valor: 10, valorUY: 450 },
  { id: 'cupon-15usd', nombre: 'Cupón $15 USD', treboles: 100, desc: 'Cualquier guardián', tipo: 'cupon', valor: 15, valorUY: 675 },
  // Envíos
  { id: 'envio-gratis-uy', nombre: 'Envío Gratis UY', treboles: 60, desc: 'Nacional Uruguay', tipo: 'envio' },
  { id: 'envio-gratis-int', nombre: 'Envío Gratis Int.', treboles: 100, desc: 'Internacional DHL', tipo: 'envio-int' },
  // Productos
  { id: 'mini-guardian', nombre: 'Mini Guardián', treboles: 150, desc: 'Pequeño protector (10cm)', tipo: 'producto' },
  { id: 'cristal', nombre: 'Cristal Sorpresa', treboles: 50, desc: 'Cristal energizado', tipo: 'producto' },
  // Lecturas y experiencias con tréboles
  { id: 'tirada-runas-treboles', nombre: 'Tirada de Runas', treboles: 40, desc: 'Sin gastar runas', tipo: 'lectura' },
  { id: 'lectura-energia-treboles', nombre: 'Lectura Energética', treboles: 80, desc: 'Análisis completo', tipo: 'lectura' },
  { id: 'oraculo-mes-treboles', nombre: 'Oráculo del Mes', treboles: 100, desc: 'Guía mensual', tipo: 'lectura' },
  // Círculo con tréboles (menos que un mini duende $70)
  { id: 'circulo-7dias', nombre: '7 días de Círculo', treboles: 25, desc: 'Acceso completo', tipo: 'circulo' },
  { id: 'circulo-30dias', nombre: '30 días de Círculo', treboles: 60, desc: 'Un mes completo', tipo: 'circulo' }
];

// ═══════════════════════════════════════════════════════════════
// MEMBRESÍAS CÍRCULO (info completa desplegable)
// ═══════════════════════════════════════════════════════════════

const MEMBRESIAS = [
  {
    nombre: 'Semestral',
    precio: 50,
    precioUY: 2000,
    dias: 180,
    url: `${WORDPRESS_URL}/producto/circulo-semestral/`,
    beneficios: [
      'Contenido semanal exclusivo',
      '15 runas por mes',
      '4 tréboles por mes',
      '2 tiradas de runas gratis/mes',
      '1 lectura de energía gratis/mes',
      '48h acceso anticipado',
      '5% en guardianes nuevos'
    ]
  },
  {
    nombre: 'Anual',
    precio: 80,
    precioUY: 3200,
    dias: 365,
    ahorro: '20%',
    destacado: true,
    url: `${WORDPRESS_URL}/producto/circulo-anual/`,
    beneficios: [
      'Todo lo del plan Semestral',
      '25 runas por mes',
      '10 tréboles por mes',
      '5 tiradas de runas gratis/mes',
      '3 lecturas de energía gratis/mes',
      '2 guías de cristal gratis/mes',
      '1 Estudio del Alma gratis/año',
      '72h acceso anticipado',
      '10% en TODA la tienda',
      'Sorpresa de aniversario'
    ]
  }
];

const CIRCULO_CONTENIDO = {
  beneficios: [
    { icono: "◈", titulo: "Descuentos exclusivos", desc: "5% a 10% según tu plan. Mensual: 5% guardianes nuevos. Anual: 10% en toda la tienda." },
    { icono: "✦", titulo: "Acceso anticipado", desc: "24h a 72h antes según tu plan. Reservá los guardianes que te llaman antes que nadie." },
    { icono: "ᚱ", titulo: "Runas y tréboles mensuales", desc: "De 10 a 25 runas y 2 a 10 tréboles por mes según tu plan." },
    { icono: "☽", titulo: "Tiradas y lecturas gratis", desc: "1 a 5 tiradas de runas gratis al mes según tu plan." },
    { icono: "❧", titulo: "DIY mágicos mensuales", desc: "Proyectos para hacer en casa: crear tu altar, hacer velas rituales, preparar aguas mágicas, etc." },
    { icono: "◎", titulo: "Meditaciones guiadas", desc: "Audios exclusivos para conectar con tu guardián, limpiar chakras, y más." },
    { icono: "★", titulo: "Contenido semanal", desc: "Cada semana nuevo contenido: mini-lecturas colectivas, tips, información esotérica." },
    { icono: "?", titulo: "Tus preguntas respondidas", desc: "Mandás tus dudas y las respondemos en los contenidos semanales." }
  ],
  temas: [
    "Calendario esotérico completo: Samhain, Yule, Imbolc, Ostara, Beltane, Litha, Lughnasadh, Mabon",
    "Fases lunares: qué hacer en cada una, rituales específicos",
    "Cristales: propiedades de más de 50 piedras, cómo limpiarlas, programarlas y usarlas",
    "Tarot para principiantes: significado de las cartas, tiradas básicas",
    "Runas: historia, significado de cada una, cómo hacer tu propio set",
    "Cómo crear tu altar personal paso a paso",
    "Rituales de protección para el hogar",
    "Trabajo con los 4 elementos: ejercicios prácticos",
    "Conexión con guías espirituales y ancestros",
    "Limpieza energética: técnicas avanzadas",
    "Magia de las velas: colores, días, intenciones",
    "Herbolaria mágica: plantas, usos, preparaciones",
    "Desarrollo de la intuición: ejercicios diarios"
  ]
};

// ═══════════════════════════════════════════════════════════════
// OPCIONES DE DIARIO (expandidas)
// ═══════════════════════════════════════════════════════════════

const TIPOS_DIARIO = [
  { id: 'reflexion', n: 'Reflexión personal', i: '✦', desc: 'Pensamientos, insights, lo que tengas en mente' },
  { id: 'senal', n: 'Recibí una señal', i: '◈', desc: 'Algo que interpretaste como mensaje' },
  { id: 'sueno', n: 'Tuve un sueño', i: '☽', desc: 'Sueños que quieras recordar o interpretar' },
  { id: 'sincronicidad', n: 'Sincronicidad', i: '∞', desc: 'Coincidencias significativas' },
  { id: 'mensaje', n: 'Mensaje de mi guardián', i: '❧', desc: 'Comunicación que percibiste' },
  { id: 'ritual', n: 'Hice un ritual', i: '◎', desc: 'Rituales, limpiezas, meditaciones' },
  { id: 'gratitud', n: 'Gratitud', i: '♥', desc: 'Lo que agradecés hoy' },
  { id: 'intencion', n: 'Intención/manifestación', i: '★', desc: 'Lo que querés atraer' },
  { id: 'sanacion', n: 'Proceso de sanación', i: '✚', desc: 'Avances en tu camino de sanación' },
  { id: 'libre', n: 'Escritura libre', i: '✎', desc: 'Lo que quieras, sin categoría' }
];

// ═══════════════════════════════════════════════════════════════
// SISTEMA DE RANGOS
// ═══════════════════════════════════════════════════════════════

const RANGOS = [
  { id: 'semilla', nombre: 'Semilla Mágica', min: 0, icono: '🌱', color: '#90EE90', beneficio: 'Bienvenida al mundo elemental' },
  { id: 'brote', nombre: 'Brote de Luz', min: 50, icono: '🌿', color: '#98FB98', beneficio: '+5% tréboles extra' },
  { id: 'aprendiz', nombre: 'Aprendiz Elemental', min: 150, icono: '✨', color: '#d4af37', beneficio: '1 tirada gratis' },
  { id: 'guardian', nombre: 'Guardiana del Bosque', min: 300, icono: '🌳', color: '#228B22', beneficio: '10% descuento' },
  { id: 'hechicera', nombre: 'Hechicera de Cristal', min: 500, icono: '💎', color: '#9b59b6', beneficio: 'Acceso 72hs antes' },
  { id: 'alquimista', nombre: 'Alquimista del Alba', min: 800, icono: '⚗️', color: '#e74c3c', beneficio: '15% + 1 lectura/mes' },
  { id: 'maestra', nombre: 'Maestra Elemental', min: 1200, icono: '👑', color: '#f39c12', beneficio: 'Todo + sorpresas' }
];

const getRango = (gastado) => {
  const g = gastado || 0;
  for (let i = RANGOS.length - 1; i >= 0; i--) {
    if (g >= RANGOS[i].min) return RANGOS[i];
  }
  return RANGOS[0];
};

const getSiguienteRango = (gastado) => {
  const g = gastado || 0;
  for (let i = 0; i < RANGOS.length; i++) {
    if (g < RANGOS[i].min) return RANGOS[i];
  }
  return null;
};

// ═══════════════════════════════════════════════════════════════
// MUNDO ELEMENTAL (resumido para espacio)
// ═══════════════════════════════════════════════════════════════

const MUNDO_ELEMENTAL = {
  intro: {
    titulo: "El Reino Elemental",
    texto: `El Reino Elemental es el mundo invisible que coexiste con el nuestro. Es el plano donde habitan los seres de naturaleza, aquellos que los antiguos llamaban "los que están entre mundos". Este plano existe en una frecuencia vibratoria más alta que la nuestra, pero algunas personas sensibles pueden percibirlo.

Cada cultura los ha conocido: los celtas hablaban del Pueblo de las Hadas (Tuatha Dé Danann), los nórdicos de los Alfar (elfos de luz y oscuridad), los griegos de Ninfas y Dríades, los japoneses de los Kami. Todos describían lo mismo: seres de luz que custodian los secretos de la naturaleza y mantienen el equilibrio del mundo.

Los elementales no son "espíritus" en el sentido religioso. Son seres de energía pura, más antiguos que la humanidad, que eligieron este plano de existencia para cumplir funciones específicas. Algunos trabajan con la naturaleza, otros con las emociones humanas, algunos protegen, otros enseñan.

En Duendes del Uruguay trabajamos principalmente con los seres de Tierra - duendes, gnomos y guardianes - porque son los más afines a la vida humana. Han evolucionado durante milenios para entender nuestra psicología, nuestras necesidades, nuestros miedos y sueños. Por eso, cuando un duende elige a un humano, esa conexión es profunda y duradera.

La comunicación con estos seres no requiere dones especiales. Requiere apertura, respeto, y la voluntad de escuchar con el corazón en lugar del oído. Ellos hablan a través de sincronicidades, sueños, sensaciones, y a veces, a través de objetos físicos que han sido canalizados para servir como puentes entre mundos.`
  },
  elementales: [
    {
      elemento: "Tierra",
      nombre: "Duendes, Gnomos y Guardianes",
      icono: "◆",
      color: "#8B4513",
      desc: "Los más cercanos a los humanos. Guardianes de hogares, tesoros y secretos de la naturaleza. Trabajan con la energía de la estabilidad, la protección, la abundancia material y la conexión con el mundo físico.",
      conectar: "Cristales (especialmente cuarzo y turmalina), plantas vivas, figuras canalizadas, jardines, tierra de lugares sagrados.",
      detalles: "Los seres de Tierra son los más densos energéticamente, lo que les permite interactuar más fácilmente con el plano físico. Pueden mover objetos, crear sonidos, y habitar espacios u objetos. Son leales, trabajadores, y tienen un fuerte sentido de la justicia. Les atraen los hogares ordenados, las plantas bien cuidadas, y las personas honestas.",
      ritual: "Para conectar con la energía de Tierra, sentate descalza sobre césped o tierra. Colocá las manos sobre el suelo y visualizá raíces creciendo desde tus palmas hacia el centro de la Tierra. Pedí permiso para conectar y escuchá en silencio."
    },
    {
      elemento: "Agua",
      nombre: "Ondinas, Ninfas y Sirenas",
      icono: "≋",
      color: "#1E90FF",
      desc: "Trabajan con las emociones, la intuición, los sueños y el flujo de la vida. Son los sanadores del mundo elemental, capaces de limpiar bloqueos emocionales profundos.",
      conectar: "Agua bendecida, fuentes, rituales de luna llena, baños rituales, lágrimas ofrecidas con intención.",
      detalles: "Los seres de Agua son fluidos, cambiantes, profundamente empáticos. Pueden sentir las emociones humanas a distancia y a menudo son atraídos por personas que están pasando por procesos emocionales intensos. Son los más difíciles de 'fijar' porque su naturaleza es el cambio constante.",
      ritual: "Llená un vaso de cristal con agua pura bajo la luna llena. Sostenelo entre tus manos y hablá al agua sobre lo que necesitás sanar emocionalmente. Bebé el agua al amanecer siguiente."
    },
    {
      elemento: "Fuego",
      nombre: "Salamandras y Djinn",
      icono: "🔥",
      color: "#FF4500",
      desc: "Pura energía transformadora. Transmutan lo negativo en positivo, destruyen para crear, purifican lo corrupto. Son los más poderosos pero también los más volátiles.",
      conectar: "Velas encendidas con intención, incienso, luz solar directa, hogueras rituales, ceniza de rituales pasados.",
      detalles: "Los seres de Fuego son intensos, apasionados, y no conocen los grises: todo es blanco o negro para ellos. Pueden ser increíblemente protectores pero también peligrosos si se les falta el respeto. Requieren trabajo con precaución y experiencia.",
      ritual: "Encendé una vela roja o naranja. Mirá fijamente la llama durante 5 minutos sin parpadear. Visualizá todo lo que querés transmutar siendo consumido por el fuego. Cuando la vela se consuma, el proceso estará completo."
    },
    {
      elemento: "Aire",
      nombre: "Silfos, Hadas y Musas",
      icono: "❋",
      color: "#87CEEB",
      desc: "Mensajeros entre mundos, portadores de inspiración, claridad mental y comunicación. Son los más etéreos y difíciles de percibir, pero los más accesibles para la comunicación.",
      conectar: "Viento, plumas (especialmente encontradas), campanas de viento, música, incienso elevándose, escritura automática.",
      detalles: "Los seres de Aire son curiosos, juguetones, y extremadamente rápidos. Pueden traer mensajes de otras dimensiones, inspirar obras de arte, y desbloquear la creatividad. Les encantan los lugares altos, la música, y las personas que se ríen seguido.",
      ritual: "En un día ventoso, salí a un lugar abierto. Abrí los brazos y dejá que el viento te envuelva. Hacé una pregunta en voz alta y prestá atención a cualquier pensamiento, imagen o sensación que llegue en los siguientes minutos."
    }
  ],
  tiposDuendes: [
    {
      tipo: "Duendes del Hogar",
      desc: "Protegen casas y familias. Se sienten atraídos por hogares donde hay amor, niños, o mascotas. Son los más comunes y los más fáciles de percibir.",
      señales: "Objetos que se mueven, puertas que se abren solas, mascotas mirando 'a la nada', sensación de compañía cuando estás sola."
    },
    {
      tipo: "Duendes de Abundancia",
      desc: "Atraen prosperidad, oportunidades, y flujo de dinero. No dan riqueza instantánea sino que abren caminos y multiplican esfuerzos.",
      señales: "Monedas que aparecen en lugares inesperados, ideas de negocio que surgen de la nada, 'coincidencias' laborales."
    },
    {
      tipo: "Duendes Sanadores",
      desc: "Trabajan con la salud física y emocional. Alivian dolores, aceleran recuperaciones, y ayudan a soltar traumas.",
      señales: "Sueños reveladores sobre salud, intuiciones sobre qué remedio usar, sensación de calor o cosquilleo en zonas afectadas."
    },
    {
      tipo: "Duendes del Bosque",
      desc: "Los más antiguos y poderosos. Custodian espacios naturales y tienen conexión directa con la sabiduría de la Tierra.",
      señales: "Sensación de ser observada en el bosque, caminos que 'aparecen', animales que se acercan sin miedo."
    },
    {
      tipo: "Duendes Traviesos (Pucks)",
      desc: "Ni buenos ni malos: caóticos. Les gusta el desorden, las bromas, y poner a prueba a los humanos. Con respeto, se vuelven aliados.",
      señales: "Llaves que desaparecen y reaparecen, risas que se escuchan sin fuente, electrónicos que fallan."
    }
  ],
  duendes: {
    titulo: "Los Duendes",
    texto: `Los duendes son seres de energía que han elegido vibrar cerca del plano físico. A diferencia de otros elementales que prefieren mantener distancia de los humanos, los duendes han evolucionado durante milenios desarrollando un interés genuino por nuestra especie.

Pueden manifestarse de múltiples formas: moviendo objetos, creando sonidos sutiles, enviando señales a través de sincronicidades, y - lo más importante para nosotros - habitando objetos físicos que han sido canalizados específicamente para servir de puente entre mundos.

Cuando un duende habita un guardián canalizado, no está "atrapado". Elige estar ahí porque ha encontrado a un humano con quien quiere trabajar. Es una relación simbiótica: el duende ofrece protección, guía y energía; el humano ofrece un ancla en el mundo físico, cuidados, y compañía.

Tienen personalidades definidas: algunos son serios y protectores, otros traviesos y juguetones, algunos sabios y antiguos, otros jóvenes y curiosos. Pero todos comparten ciertos rasgos: lealtad inquebrantable hacia quienes los tratan bien, conexión especial con niños y animales (que pueden verlos más fácilmente), y un sentido del humor que a veces puede parecer extraño a los humanos.

Los duendes no piden adoración ni sacrificios. Piden respeto, comunicación, y cuidados básicos. A cambio, ofrecen algo invaluable: un compañero del otro lado del velo, un guardián que vela por vos incluso cuando dormís.`
  },
  signos: [
    { signo: "Un duende te eligió", señales: ["Sentís atracción inexplicable hacia una figura", "Sueños recurrentes con duendes o gnomos", "Sincronicidades relacionadas con duendes (verlos en todas partes)", "Sensación de 'reconocimiento' al ver cierto guardián"] },
    { signo: "Tu duende está activo", señales: ["Objetos que se mueven solos", "Sonidos inexplicables (campanitas, pasos)", "Sueños muy vívidos y significativos", "Mascotas que miran hacia tu altar", "Velas que chisporrotean sin corriente de aire"] },
    { signo: "Tu duende necesita atención", señales: ["Sensación de que 'algo falta' en casa", "Racha de mala suerte o cosas que salen mal", "Te olvidás de hablarle por mucho tiempo", "Intuiciones que ignoraste repetidamente"] }
  ],
  alquimia: {
    titulo: "Alquimia y Piriápolis",
    texto: `La alquimia no era solo convertir plomo en oro - eso era una metáfora. Era una ciencia espiritual completa que entendía la conexión entre todos los niveles de existencia: elementos, planetas, metales, partes del cuerpo, emociones humanas, y seres invisibles.

Los alquimistas medievales sabían que ciertos lugares de la Tierra tenían configuraciones energéticas especiales, vórtices donde el velo entre mundos era más delgado. Buscaban estos lugares para establecer sus laboratorios porque ahí la transmutación (de cualquier tipo) era más fácil.

Francisco Piria, fundador de Piriápolis, era un alquimista iniciado. Eligió este punto específico de la costa uruguaya por su configuración única: el encuentro del mar (Agua) con las sierras (Tierra), las corrientes de aire constantes (Aire), y la energía solar particular de esta latitud (Fuego). Los cuatro elementos en perfecto equilibrio.

La disposición de Piriápolis no es casualidad: el Castillo de Piria, el Argentino Hotel, la Rambla, la Virgen de los Pescadores... todo está ubicado siguiendo principios alquímicos de geometría sagrada. Es un gran círculo mágico trazado en la tierra.

Es acá, en este vórtice energético, donde nuestro equipo canaliza a los guardianes. La energía del lugar facilita la conexión con el Reino Elemental, permitiendo que cada figura se convierta en un verdadero puente entre mundos.

Cuando recibís un guardián canalizado en Piriápolis, no solo recibís un objeto hermoso. Recibís un fragmento de esta energía ancestral, un pedacito de este lugar mágico que ahora vivirá en tu hogar.`
  },
  rituales: [
    { nombre: "Ritual de Conexión Elemental", pasos: ["Elegí el elemento con el que querés trabajar", "Creá un espacio con símbolos de ese elemento", "Encendé incienso y una vela del color correspondiente", "Meditá 10 minutos visualizando el elemento", "Pedí permiso para conectar y escuchá"], duracion: "20-30 minutos" },
    { nombre: "Ritual de Presentación al Guardián", pasos: ["Lavá tus manos con agua y sal marina", "Encendé vela blanca o dorada", "Abrí el guardián con reverencia, sin prisa", "Presentate: nombre, intención, qué esperás", "Escuchá en silencio por 5 minutos", "Agradecé y colocalo en su lugar"], duracion: "15-20 minutos" },
    { nombre: "Ritual de Luna Llena", pasos: ["Sacá tu guardián a la luz de la luna", "Limpialo con humo de salvia", "Hablale sobre el mes que pasó", "Hacé tres pedidos para el mes que viene", "Dejalo bajo la luna hasta el amanecer"], duracion: "15 minutos + noche" }
  ]
};

const CUIDADOS = [
  { titulo: "Ritual de Bienvenida", texto: "Dejalo reposar unas horas, luego en calma: lavá tus manos con sal, encendé vela blanca, abrilo con reverencia, presentate y escuchá.", items: ["Lavá manos con agua y sal", "Encendé vela blanca o dorada", "Abrí con reverencia", "Presentate y escuchá en silencio"] },
  { titulo: "Espacio Sagrado", texto: "Necesita un lugar propio, elevado, limpio. Que pueda 'ver' lo que protege.", items: ["Evitá ruido y tránsito", "Nunca en el piso", "Protectores: cerca de la entrada", "Abundancia: cerca de donde manejás dinero"] },
  { titulo: "Limpieza Energética Semanal", texto: "Absorbe energías densas para protegerte. Necesita limpieza regular.", items: ["Humo de salvia o palo santo", "Luz de luna llena", "Agua con sal marina (rociar)", "Sonido de cuenco o campana"] },
  { titulo: "Comunicación", texto: "Hablale diariamente, en voz alta o mental.", items: ["Buenos días al levantarte", "Pedí protección antes de salir", "Agradecé cada noche", "Celebrá logros con él"] },
  { titulo: "Ofrendas de Alta Vibración", texto: "Fortalecen el vínculo. Cosas naturales y de alta energía.", items: ["Flores frescas", "Cristales pequeños", "Agua fresca", "Luz de vela", "Incienso de calidad"] },
  { titulo: "⚠️ QUÉ NO HACER", texto: "Esto baja la vibración o rompe el vínculo.", items: ["NUNCA dulces ni azúcar", "NUNCA alcohol", "No guardarlo en cajones", "No exponerlo a peleas", "No prestarlo", "No ignorarlo mucho tiempo"], esProhibido: true }
];

const CRISTALES = [
  { nombre: "Amatista", color: "#9b59b6", imagen: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&w=400", props: "Intuición, paz, protección espiritual", cuidado: "Agua y luna. Evitar sol directo." },
  { nombre: "Cuarzo Rosa", color: "#f8bbd9", imagen: "https://images.pexels.com/photos/5765988/pexels-photo-5765988.jpeg?auto=compress&w=400", props: "Amor incondicional, sanación emocional", cuidado: "Solo luna. Muy sensible al sol." },
  { nombre: "Citrino", color: "#f4d03f", imagen: "https://images.pexels.com/photos/10475789/pexels-photo-10475789.jpeg?auto=compress&w=400", props: "Abundancia, alegría, manifestación", cuidado: "Auto-limpiante. Carga al sol." },
  { nombre: "Turmalina Negra", color: "#2c3e50", imagen: "https://images.pexels.com/photos/5273539/pexels-photo-5273539.jpeg?auto=compress&w=400", props: "Protección máxima, escudo energético", cuidado: "Enterrar en sal o tierra." },
  { nombre: "Labradorita", color: "#3498db", imagen: "https://images.pexels.com/photos/7533347/pexels-photo-7533347.jpeg?auto=compress&w=400", props: "Magia, transformación, intuición", cuidado: "Bajo las estrellas." },
  { nombre: "Cuarzo Transparente", color: "#ecf0f1", imagen: "https://images.pexels.com/photos/1573236/pexels-photo-1573236.jpeg?auto=compress&w=400", props: "Amplificador universal, claridad", cuidado: "Acepta todo. Limpiar seguido." },
  { nombre: "Selenita", color: "#f5f5f5", imagen: "https://images.pexels.com/photos/6186495/pexels-photo-6186495.jpeg?auto=compress&w=400", props: "Limpieza energética, conexión angélica", cuidado: "NUNCA mojar. Solo luna o sonido." },
  { nombre: "Ojo de Tigre", color: "#b8860b", imagen: "https://images.pexels.com/photos/6186512/pexels-photo-6186512.jpeg?auto=compress&w=400", props: "Coraje, prosperidad, protección", cuidado: "Sol de mañana." },
  { nombre: "Obsidiana", color: "#1a1a1a", imagen: "https://images.pexels.com/photos/4040567/pexels-photo-4040567.jpeg?auto=compress&w=400", props: "Verdad, protección psíquica, raíces", cuidado: "Agua corriente. Luna nueva." }
];

// ═══════════════════════════════════════════════════════════════
// LOGIN CON MAGIC LINK
// ═══════════════════════════════════════════════════════════════

function LoginMagicLink({ onLoginExitoso }) {
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState('inicial'); // inicial, enviando, enviado, error
  const [mensaje, setMensaje] = useState('');
  const [linkDirecto, setLinkDirecto] = useState(null);

  // Estilos inline para garantizar que siempre se apliquen
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
      padding: '20px',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    },
    card: {
      background: '#111',
      borderRadius: '20px',
      padding: '3rem 2.5rem',
      maxWidth: '420px',
      width: '100%',
      textAlign: 'center',
      border: '1px solid #222',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    },
    icono: {
      fontSize: '4rem',
      display: 'block',
      marginBottom: '1rem',
      filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3))',
    },
    titulo: {
      fontFamily: "'Cinzel', serif",
      fontSize: '2.5rem',
      color: '#fff',
      margin: '0 0 0.5rem',
    },
    subtitulo: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: '1.1rem',
      marginBottom: '2rem',
    },
    campo: {
      textAlign: 'left',
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      color: 'rgba(255,255,255,0.7)',
      fontSize: '0.9rem',
      marginBottom: '0.5rem',
      fontFamily: "'Cinzel', serif",
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      background: '#0a0a0a',
      border: '1px solid #333',
      borderRadius: '10px',
      color: '#fff',
      fontSize: '1.1rem',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    btn: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #d4af37 0%, #b8972e 100%)',
      color: '#0a0a0a',
      border: 'none',
      borderRadius: '10px',
      fontFamily: "'Cinzel', serif",
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
    },
    btnSec: {
      background: 'transparent',
      color: 'rgba(255,255,255,0.6)',
      border: '1px solid #333',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      marginTop: '1.5rem',
    },
    error: {
      background: 'rgba(255,100,100,0.1)',
      border: '1px solid rgba(255,100,100,0.3)',
      color: '#ff9999',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontSize: '0.9rem',
    },
    info: {
      background: '#0a0a0a',
      padding: '1rem',
      borderRadius: '10px',
      marginTop: '1.5rem',
    },
    infoText: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: '0.85rem',
      margin: '0.3rem 0',
    },
    ayuda: {
      paddingTop: '1rem',
      marginTop: '1.5rem',
      borderTop: '1px solid #222',
    },
    link: {
      color: 'rgba(255,255,255,0.5)',
      textDecoration: 'none',
      fontSize: '0.9rem',
    },
  };

  const enviarMagicLink = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setMensaje('Por favor ingresá un email válido');
      setEstado('error');
      return;
    }

    setEstado('enviando');
    try {
      const res = await fetch('/api/mi-magia/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });
      const data = await res.json();

      if (data.success) {
        setEstado('enviado');
        if (data.linkDirecto) {
          setLinkDirecto(data.linkDirecto);
          setMensaje(data.mensaje || 'Error enviando email');
          console.log('Debug Resend:', data.debug);
        }
      } else {
        setMensaje(data.error || 'Error al enviar el enlace');
        setEstado('error');
      }
    } catch (err) {
      setMensaje('Error de conexión. Intentá de nuevo.');
      setEstado('error');
    }
  };

  if (estado === 'enviado') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <span style={styles.icono}>✨</span>
          <h1 style={styles.titulo}>¡Magia lista!</h1>
          {linkDirecto ? (
            <>
              <p style={{color: '#ff9999', marginBottom: '1rem', fontSize: '0.9rem'}}>{mensaje || 'Error enviando email'}</p>
              <a href={linkDirecto} style={{...styles.btn, display: 'inline-block', textDecoration: 'none', padding: '16px 32px'}}>
                ✨ Entrar a Mi Magia
              </a>
            </>
          ) : (
            <>
              <p style={{color: '#fff'}}>Revisá tu email <strong>{email}</strong></p>
              <p style={styles.subtitulo}>Te enviamos un enlace mágico para entrar. Revisá también la carpeta de spam.</p>
            </>
          )}
          <button style={styles.btnSec} onClick={() => { setEstado('inicial'); setLinkDirecto(null); }}>
            Usar otro email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        .login-email-input,
        .login-email-input:focus,
        .login-email-input:active,
        .login-email-input:-webkit-autofill,
        .login-email-input:-webkit-autofill:hover,
        .login-email-input:-webkit-autofill:focus,
        .login-email-input:-webkit-autofill:active {
          color: #fff !important;
          background: #0a0a0a !important;
          -webkit-text-fill-color: #fff !important;
          -webkit-box-shadow: 0 0 0 1000px #0a0a0a inset !important;
          caret-color: #fff !important;
        }
        .login-email-input::placeholder { color: rgba(255,255,255,0.3) !important; }
      `}</style>
      <div style={styles.card}>
        <span style={styles.icono}>🔮</span>
        <h1 style={styles.titulo}>Mi Magia</h1>
        <p style={styles.subtitulo}>Tu portal personal en Duendes del Uruguay</p>

        <form onSubmit={enviarMagicLink}>
          <div style={styles.campo}>
            <label style={styles.label}>Tu email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={estado === 'enviando'}
              autoFocus
              className="login-email-input"
              style={styles.input}
            />
          </div>

          {estado === 'error' && (
            <div style={styles.error}>{mensaje}</div>
          )}

          <button
            type="submit"
            style={{...styles.btn, opacity: estado === 'enviando' ? 0.6 : 1}}
            disabled={estado === 'enviando'}
          >
            {estado === 'enviando' ? 'Enviando...' : '✨ Enviar enlace mágico'}
          </button>
        </form>

        <div style={styles.info}>
          <p style={styles.infoText}>Te enviaremos un enlace a tu email para entrar sin contraseña.</p>
          <p style={styles.infoText}>¿Primera vez? Se creará tu cuenta automáticamente.</p>
        </div>

        <div style={styles.ayuda}>
          <a href={`${WORDPRESS_URL}`} style={styles.link}>
            ← Volver a la tienda
          </a>
        </div>
      </div>
    </div>
  );
}

const loginStyles = `
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
    padding: 20px;
    font-family: 'Cormorant Garamond', serif;
  }

  .login-card {
    background: #111;
    border-radius: 20px;
    padding: 3rem 2.5rem;
    max-width: 420px;
    width: 100%;
    text-align: center;
    border: 1px solid #222;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .login-icono {
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
    filter: drop-shadow(0 0 20px #d4af3750);
  }

  .login-card h1 {
    font-family: 'Tangerine', cursive;
    font-size: 3.5rem;
    color: #fff;
    margin: 0 0 0.5rem;
  }

  .login-sub {
    color: rgba(255,255,255,0.6);
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .login-form {
    margin-bottom: 1.5rem;
  }

  .login-campo {
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .login-campo label {
    display: block;
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    font-family: 'Cinzel', serif;
  }

  .login-campo input {
    width: 100%;
    padding: 14px 16px;
    background: #0a0a0a;
    border: 1px solid #333;
    border-radius: 10px;
    color: #fff;
    font-size: 1.1rem;
    font-family: inherit;
    transition: all 0.3s;
  }

  .login-campo input:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 0 15px #d4af3730;
  }

  .login-campo input::placeholder {
    color: rgba(255,255,255,0.3);
  }

  .login-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #d4af37 0%, #b8972e 100%);
    color: #0a0a0a;
    border: none;
    border-radius: 10px;
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .login-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  }

  .login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .login-btn-sec {
    background: transparent;
    color: rgba(255,255,255,0.6);
    border: 1px solid #333;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    margin-top: 1.5rem;
    transition: all 0.3s;
  }

  .login-btn-sec:hover {
    border-color: #666;
    color: #fff;
  }

  .login-error {
    background: rgba(255,100,100,0.1);
    border: 1px solid rgba(255,100,100,0.3);
    color: #ff9999;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .login-info {
    background: #0a0a0a;
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 1.5rem;
  }

  .login-info p {
    color: rgba(255,255,255,0.5);
    font-size: 0.85rem;
    margin: 0.3rem 0;
  }

  .login-ayuda {
    padding-top: 1rem;
    border-top: 1px solid #222;
  }

  .login-link {
    color: rgba(255,255,255,0.4);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s;
  }

  .login-link:hover {
    color: #d4af37;
  }

  .login-success h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .login-success p {
    color: rgba(255,255,255,0.8);
    margin: 0.5rem 0;
  }

  .login-success strong {
    color: #d4af37;
  }

  @media (max-width: 500px) {
    .login-card {
      padding: 2rem 1.5rem;
    }
    .login-card h1 {
      font-size: 2.5rem;
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     FORMULARIO "PARA CONOCERME"
     ═══════════════════════════════════════════════════════════════ */

  .perfil-form-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: linear-gradient(135deg, #0a0a0f 0%, #141420 50%, #0a0a0f 100%);
  }

  .perfil-form-card {
    background: linear-gradient(145deg, #1a1a2e 0%, #16162a 100%);
    border-radius: 20px;
    padding: 2.5rem;
    max-width: 500px;
    width: 100%;
    border: 1px solid rgba(212,175,55,0.2);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .perfil-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .perfil-icono {
    font-size: 2.5rem;
    color: #d4af37;
    display: block;
    margin-bottom: 1rem;
  }

  .perfil-header h1 {
    font-family: 'Cinzel', serif;
    font-size: 1.75rem;
    color: #fff;
    margin: 0 0 0.5rem;
  }

  .perfil-header p {
    color: rgba(255,255,255,0.6);
    font-size: 0.95rem;
  }

  .perfil-progress {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .progress-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.4);
    transition: all 0.3s;
  }

  .progress-dot.active {
    background: linear-gradient(135deg, #d4af37, #c4a030);
    color: #1a1a2e;
    font-weight: 600;
  }

  .perfil-paso {
    margin-bottom: 2rem;
  }

  .perfil-paso h3 {
    font-family: 'Cinzel', serif;
    font-size: 1.25rem;
    color: #fff;
    margin: 0 0 0.5rem;
    text-align: center;
  }

  .perfil-sub {
    color: rgba(255,255,255,0.5);
    font-size: 0.9rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .perfil-date-input {
    width: 100%;
    padding: 1rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(212,175,55,0.3);
    border-radius: 12px;
    color: #fff;
    font-size: 1rem;
    text-align: center;
  }

  .perfil-date-input:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 0 20px rgba(212,175,55,0.2);
  }

  .signo-resultado {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(212,175,55,0.1);
    border-radius: 12px;
    border: 1px solid rgba(212,175,55,0.2);
  }

  .signo-icono {
    font-size: 1.5rem;
  }

  .signo-resultado span {
    color: rgba(255,255,255,0.8);
  }

  .signo-resultado strong {
    color: #d4af37;
  }

  .busquedas-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .busqueda-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 1rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
  }

  .busqueda-btn:hover {
    border-color: rgba(212,175,55,0.4);
    background: rgba(212,175,55,0.1);
  }

  .busqueda-btn.active {
    background: rgba(212,175,55,0.2);
    border-color: #d4af37;
    color: #fff;
  }

  .momentos-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .momento-btn {
    padding: 1rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
  }

  .momento-btn:hover {
    border-color: rgba(212,175,55,0.4);
    background: rgba(212,175,55,0.1);
  }

  .momento-btn.active {
    background: rgba(212,175,55,0.15);
    border-color: #d4af37;
  }

  .momento-btn strong {
    display: block;
    color: #fff;
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }

  .momento-btn small {
    color: rgba(255,255,255,0.5);
    font-size: 0.85rem;
  }

  .momento-btn.active strong {
    color: #d4af37;
  }

  .perfil-field {
    margin-bottom: 1.5rem;
  }

  .perfil-field label {
    display: block;
    color: rgba(255,255,255,0.8);
    font-size: 0.95rem;
    margin-bottom: 0.75rem;
  }

  .radio-group {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .radio-btn {
    flex: 1;
    padding: 0.9rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    transition: all 0.2s;
  }

  .radio-btn:hover {
    border-color: rgba(212,175,55,0.4);
  }

  .radio-btn.active {
    background: rgba(212,175,55,0.2);
    border-color: #d4af37;
    color: #fff;
  }

  .perfil-text-input {
    width: 100%;
    padding: 0.9rem 1rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 10px;
    color: #fff;
    font-size: 0.95rem;
  }

  .perfil-text-input:focus {
    outline: none;
    border-color: #d4af37;
  }

  .fuentes-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .fuente-btn {
    padding: 0.6rem 1rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    color: rgba(255,255,255,0.7);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .fuente-btn:hover {
    border-color: rgba(212,175,55,0.4);
  }

  .fuente-btn.active {
    background: rgba(212,175,55,0.2);
    border-color: #d4af37;
    color: #fff;
  }

  .perfil-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  .perfil-buttons .btn-sec {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.7);
    padding: 0.9rem 1.5rem;
    border-radius: 10px;
    cursor: pointer;
  }

  .perfil-buttons .btn-pri {
    background: linear-gradient(135deg, #d4af37, #c4a030);
    border: none;
    color: #1a1a2e;
    padding: 0.9rem 2rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
  }

  .perfil-buttons .btn-skip {
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.5);
    cursor: pointer;
    font-size: 0.9rem;
    text-decoration: underline;
  }

  .perfil-buttons .btn-gold {
    background: linear-gradient(135deg, #d4af37, #c4a030);
    border: none;
    color: #1a1a2e;
    padding: 0.9rem 2rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
  }

  .perfil-buttons .btn-gold:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .perfil-bonus {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding: 1rem;
    background: rgba(212,175,55,0.1);
    border-radius: 10px;
    border: 1px solid rgba(212,175,55,0.2);
  }

  .perfil-bonus span {
    font-size: 1.25rem;
  }

  .perfil-bonus p {
    color: rgba(255,255,255,0.7);
    font-size: 0.85rem;
    margin: 0;
  }

  @media (max-width: 500px) {
    .perfil-form-card {
      padding: 1.5rem;
    }
    .busquedas-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// ═══════════════════════════════════════════════════════════════
// FORMULARIO "PARA CONOCERME" (después del tour)
// ═══════════════════════════════════════════════════════════════

const SIGNOS_ZODIACALES = [
  { nombre: 'Aries', icono: '♈', inicio: '03-21', fin: '04-19' },
  { nombre: 'Tauro', icono: '♉', inicio: '04-20', fin: '05-20' },
  { nombre: 'Géminis', icono: '♊', inicio: '05-21', fin: '06-20' },
  { nombre: 'Cáncer', icono: '♋', inicio: '06-21', fin: '07-22' },
  { nombre: 'Leo', icono: '♌', inicio: '07-23', fin: '08-22' },
  { nombre: 'Virgo', icono: '♍', inicio: '08-23', fin: '09-22' },
  { nombre: 'Libra', icono: '♎', inicio: '09-23', fin: '10-22' },
  { nombre: 'Escorpio', icono: '♏', inicio: '10-23', fin: '11-21' },
  { nombre: 'Sagitario', icono: '♐', inicio: '11-22', fin: '12-21' },
  { nombre: 'Capricornio', icono: '♑', inicio: '12-22', fin: '01-19' },
  { nombre: 'Acuario', icono: '♒', inicio: '01-20', fin: '02-18' },
  { nombre: 'Piscis', icono: '♓', inicio: '02-19', fin: '03-20' }
];

function calcularSigno(fechaNacimiento) {
  if (!fechaNacimiento) return null;
  const fecha = new Date(fechaNacimiento);
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mmdd = `${mes}-${dia}`;

  for (const signo of SIGNOS_ZODIACALES) {
    if (signo.nombre === 'Capricornio') {
      if (mmdd >= '12-22' || mmdd <= '01-19') return signo;
    } else {
      if (mmdd >= signo.inicio && mmdd <= signo.fin) return signo;
    }
  }
  return null;
}

function FormularioPerfil({ usuario, onComplete, onSkip }) {
  const [paso, setPaso] = useState(1);
  const [guardando, setGuardando] = useState(false);
  const [perfil, setPerfil] = useState({
    fechaNacimiento: usuario?.fechaNacimiento || '',
    queBusca: usuario?.queBusca || [],
    momentoVida: usuario?.momentoVida || '',
    tieneGuardianesFisicos: usuario?.tieneGuardianesFisicos || '',
    guardianesFisicos: usuario?.guardianesFisicos || '',
    comoNosConociste: usuario?.comoNosConociste || ''
  });

  const signoCalculado = calcularSigno(perfil.fechaNacimiento);

  const BUSQUEDAS = [
    { id: 'proteccion', label: 'Protección', icono: '🛡️' },
    { id: 'amor', label: 'Amor', icono: '💕' },
    { id: 'abundancia', label: 'Abundancia', icono: '✨' },
    { id: 'sanacion', label: 'Sanación', icono: '🌿' },
    { id: 'guia', label: 'Guía espiritual', icono: '🔮' },
    { id: 'claridad', label: 'Claridad mental', icono: '💎' },
    { id: 'paz', label: 'Paz interior', icono: '☮️' },
    { id: 'proposito', label: 'Propósito de vida', icono: '⭐' }
  ];

  const MOMENTOS = [
    { id: 'transicion', label: 'En transición', desc: 'Cambios importantes en mi vida' },
    { id: 'crisis', label: 'Atravesando una crisis', desc: 'Momento difícil que necesita luz' },
    { id: 'crecimiento', label: 'En crecimiento', desc: 'Expandiendo mi consciencia' },
    { id: 'estabilidad', label: 'Estable', desc: 'Buscando profundizar mi camino' },
    { id: 'despertar', label: 'Despertando', desc: 'Recién conectando con lo espiritual' }
  ];

  const FUENTES = [
    'Instagram', 'Facebook', 'TikTok', 'Google',
    'Recomendación de amiga', 'YouTube', 'Otro'
  ];

  const guardar = async () => {
    setGuardando(true);
    try {
      const perfilConSigno = {
        ...perfil,
        signoZodiacal: signoCalculado?.nombre || null
      };
      await fetch(`${API_BASE}/api/mi-magia/usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario.email, perfil: perfilConSigno })
      });
      onComplete(perfilConSigno);
    } catch(e) {
      console.error('Error guardando perfil:', e);
    }
    setGuardando(false);
  };

  const toggleBusqueda = (id) => {
    setPerfil(prev => ({
      ...prev,
      queBusca: prev.queBusca.includes(id)
        ? prev.queBusca.filter(x => x !== id)
        : [...prev.queBusca, id]
    }));
  };

  return (
    <div className="perfil-form-container">
      <style jsx global>{loginStyles}</style>
      <div className="perfil-form-card">
        <div className="perfil-header">
          <span className="perfil-icono">✦</span>
          <h1>Para conocerte mejor</h1>
          <p>Esta información nos ayuda a personalizar tus lecturas y experiencias</p>
          <div className="perfil-progress">
            {[1,2,3,4].map(p => (
              <div key={p} className={`progress-dot ${paso >= p ? 'active' : ''}`}>{p}</div>
            ))}
          </div>
        </div>

        {paso === 1 && (
          <div className="perfil-paso">
            <h3>¿Cuándo naciste?</h3>
            <p className="perfil-sub">Para numerología, carta astral y mensajes personalizados</p>
            <input
              type="date"
              value={perfil.fechaNacimiento}
              onChange={e => setPerfil({...perfil, fechaNacimiento: e.target.value})}
              className="perfil-date-input"
              max={new Date().toISOString().split('T')[0]}
            />
            {signoCalculado && (
              <div className="signo-resultado">
                <span className="signo-icono">{signoCalculado.icono}</span>
                <span>Tu signo es <strong>{signoCalculado.nombre}</strong></span>
              </div>
            )}
          </div>
        )}

        {paso === 2 && (
          <div className="perfil-paso">
            <h3>¿Qué estás buscando?</h3>
            <p className="perfil-sub">Elegí todo lo que resuene con vos</p>
            <div className="busquedas-grid">
              {BUSQUEDAS.map(b => (
                <button
                  key={b.id}
                  className={`busqueda-btn ${perfil.queBusca.includes(b.id) ? 'active' : ''}`}
                  onClick={() => toggleBusqueda(b.id)}
                >
                  <span>{b.icono}</span>
                  <span>{b.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {paso === 3 && (
          <div className="perfil-paso">
            <h3>¿Qué momento estás atravesando?</h3>
            <p className="perfil-sub">Para entender cómo acompañarte mejor</p>
            <div className="momentos-list">
              {MOMENTOS.map(m => (
                <button
                  key={m.id}
                  className={`momento-btn ${perfil.momentoVida === m.id ? 'active' : ''}`}
                  onClick={() => setPerfil({...perfil, momentoVida: m.id})}
                >
                  <strong>{m.label}</strong>
                  <small>{m.desc}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {paso === 4 && (
          <div className="perfil-paso">
            <h3>Últimas preguntas</h3>

            <div className="perfil-field">
              <label>¿Tenés guardianes físicos (duendes)?</label>
              <div className="radio-group">
                <button
                  className={`radio-btn ${perfil.tieneGuardianesFisicos === 'si' ? 'active' : ''}`}
                  onClick={() => setPerfil({...perfil, tieneGuardianesFisicos: 'si'})}
                >Sí, tengo</button>
                <button
                  className={`radio-btn ${perfil.tieneGuardianesFisicos === 'no' ? 'active' : ''}`}
                  onClick={() => setPerfil({...perfil, tieneGuardianesFisicos: 'no', guardianesFisicos: ''})}
                >No todavía</button>
              </div>
              {perfil.tieneGuardianesFisicos === 'si' && (
                <input
                  type="text"
                  placeholder="¿Cuáles? (ej: Guardián del Hogar, Duende de la Abundancia)"
                  value={perfil.guardianesFisicos}
                  onChange={e => setPerfil({...perfil, guardianesFisicos: e.target.value})}
                  className="perfil-text-input"
                />
              )}
            </div>

            <div className="perfil-field">
              <label>¿Cómo nos conociste?</label>
              <div className="fuentes-grid">
                {FUENTES.map(f => (
                  <button
                    key={f}
                    className={`fuente-btn ${perfil.comoNosConociste === f ? 'active' : ''}`}
                    onClick={() => setPerfil({...perfil, comoNosConociste: f})}
                  >{f}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="perfil-buttons">
          {paso > 1 && (
            <button className="btn-sec" onClick={() => setPaso(paso - 1)}>Atrás</button>
          )}
          {paso === 1 && (
            <button className="btn-skip" onClick={onSkip}>Completar después</button>
          )}
          {paso < 4 && (
            <button className="btn-pri" onClick={() => setPaso(paso + 1)}>Continuar</button>
          )}
          {paso === 4 && (
            <button className="btn-gold" onClick={guardar} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar y continuar'}
            </button>
          )}
        </div>

        <div className="perfil-bonus">
          <span>🎁</span>
          <p>Al completar tu perfil, tus lecturas serán mucho más precisas y personalizadas</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TOUR DE MI MAGIA (después del onboarding)
// ═══════════════════════════════════════════════════════════════

const PASOS_TOUR = [
  {
    id: 'bienvenida',
    titulo: '¡Bienvenida a Mi Magia!',
    icono: '✨',
    mensaje: 'Este es tu espacio personal en Duendes del Uruguay. Vamos a hacer un recorrido rápido para que sepas todo lo que podés hacer acá.',
    tip: 'El tour dura menos de 2 minutos'
  },
  {
    id: 'runas',
    titulo: 'Tus Runas',
    icono: 'ᚱ',
    mensaje: 'Las runas son tu moneda mágica. Las usás para acceder a experiencias como tiradas de runas, lecturas del alma, oráculos y más. ¡Tenés 100 runas de regalo para empezar!',
    tip: 'Podés comprar más runas cuando las necesites'
  },
  {
    id: 'treboles',
    titulo: 'Tus Tréboles',
    icono: '☘️',
    mensaje: 'Los tréboles son puntos de fidelidad. Ganás 1 trébol por cada $10 USD que gastás en la tienda. Podés canjearlos por descuentos, envío gratis y más.',
    tip: 'Los tréboles nunca expiran'
  },
  {
    id: 'experiencias',
    titulo: 'Experiencias',
    icono: '◈',
    mensaje: 'Acá encontrás todas las experiencias espirituales: tiradas de runas, susurros del guardián, oráculos del mes, lecturas del alma, registros akáshicos y mucho más.',
    tip: 'Cada experiencia tiene un costo en runas diferente'
  },
  {
    id: 'grimorio',
    titulo: 'Tu Grimorio',
    icono: '📖',
    mensaje: 'El Grimorio es tu diario mágico personal. Podés escribir tus sueños, reflexiones, rituales que hiciste, y ver el calendario lunar para planificar tus prácticas.',
    tip: 'Todo lo que escribas queda guardado para siempre'
  },
  {
    id: 'jardin',
    titulo: 'Jardín de Tréboles',
    icono: '☘️',
    mensaje: 'Acá canjeás tus tréboles por beneficios reales: descuentos, envío gratis, runas extra y más. Mientras más tréboles acumulás, mejores premios podés obtener.',
    tip: 'Ganás tréboles con cada compra en la tienda'
  },
  {
    id: 'circulo',
    titulo: 'Círculo de Duendes',
    icono: '★',
    mensaje: 'El Círculo es nuestra membresía premium. Te da un guardián semanal con mensajes personalizados, guía lunar, rituales exclusivos, comunidad privada y 100 runas de regalo.',
    tip: 'Membresía semestral $50 USD o anual $80 USD'
  },
  {
    id: 'tito',
    titulo: 'Tito, tu Asistente',
    icono: '🧙',
    imagen: `${WORDPRESS_URL}/wp-content/uploads/2026/01/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-1_53c2ddf7-82d8-47fa-823e-7b0f3af1398e-scaled.jpg`,
    mensaje: 'Si tenés dudas, Tito está ahí para ayudarte. Es un duende sabio que conoce todo sobre Duendes del Uruguay. Lo encontrás en el botón flotante.',
    tip: 'Preguntale lo que quieras'
  },
  {
    id: 'final',
    titulo: '¡Listo para la magia!',
    icono: '🎉',
    mensaje: 'Ya conocés lo básico. Explorá a tu ritmo, usá tus runas de regalo, y recordá que siempre podés volver a ver este tour desde la sección FAQ.',
    tip: 'Tu aventura mágica comienza ahora'
  }
];

function TourMiMagia({ usuario, onFinish }) {
  const [paso, setPaso] = useState(0);
  const pasoActual = PASOS_TOUR[paso];
  const esUltimo = paso === PASOS_TOUR.length - 1;
  const esPrimero = paso === 0;

  return (
    <div className="tour-container">
      <div className="tour-card">
        <div className="tour-progress">
          {PASOS_TOUR.map((_, i) => (
            <div key={i} className={`tour-dot ${i === paso ? 'activo' : ''} ${i < paso ? 'completado' : ''}`} />
          ))}
        </div>

        <div className="tour-content">
          {pasoActual.imagen ? (
            <img src={pasoActual.imagen} alt={pasoActual.titulo} className="tour-imagen" />
          ) : (
            <span className="tour-icono">{pasoActual.icono}</span>
          )}
          <h1>{pasoActual.titulo}</h1>
          <p className="tour-mensaje">{pasoActual.mensaje}</p>
          <div className="tour-tip">
            <span>💡</span>
            <span>{pasoActual.tip}</span>
          </div>
        </div>

        <div className="tour-nav">
          {!esPrimero && (
            <button className="tour-btn-sec" onClick={() => setPaso(paso - 1)}>
              ← Anterior
            </button>
          )}
          {esPrimero && (
            <button className="tour-btn-skip" onClick={onFinish}>
              Saltar tour
            </button>
          )}
          <button className="tour-btn-primary" onClick={() => esUltimo ? onFinish() : setPaso(paso + 1)}>
            {esUltimo ? '¡Comenzar! ✨' : 'Siguiente →'}
          </button>
        </div>

        <div className="tour-counter">
          {paso + 1} de {PASOS_TOUR.length}
        </div>
      </div>

      <style jsx>{`
        .tour-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
          padding: 20px;
          font-family: 'Cormorant Garamond', serif;
        }

        .tour-card {
          background: #111;
          border-radius: 20px;
          padding: 2.5rem;
          max-width: 480px;
          width: 100%;
          text-align: center;
          border: 1px solid #222;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .tour-progress {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 2rem;
        }

        .tour-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #333;
          transition: all 0.3s;
        }

        .tour-dot.activo {
          background: #d4af37;
          transform: scale(1.3);
          box-shadow: 0 0 10px #d4af3750;
        }

        .tour-dot.completado {
          background: #d4af3780;
        }

        .tour-content {
          margin-bottom: 2rem;
        }

        .tour-icono {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 20px #d4af3750);
        }
        .tour-imagen {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1rem;
          border: 3px solid #d4af37;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        .tour-card h1 {
          font-family: 'Tangerine', cursive;
          font-size: 2.5rem;
          color: #fff;
          margin: 0 0 1rem;
        }

        .tour-mensaje {
          font-size: 1.1rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.8);
          margin: 0;
        }

        .tour-tip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1a1a1a;
          padding: 10px 16px;
          border-radius: 8px;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
        }

        .tour-nav {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .tour-btn-primary {
          background: linear-gradient(135deg, #d4af37 0%, #b8972e 100%);
          color: #0a0a0a;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-family: 'Cinzel', serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tour-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
        }

        .tour-btn-sec {
          background: transparent;
          color: rgba(255,255,255,0.7);
          border: 1px solid #333;
          padding: 14px 20px;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tour-btn-sec:hover {
          border-color: #666;
          color: #fff;
        }

        .tour-btn-skip {
          background: transparent;
          color: rgba(255,255,255,0.4);
          border: none;
          padding: 14px 20px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tour-btn-skip:hover {
          color: rgba(255,255,255,0.7);
        }

        .tour-counter {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.3);
          font-family: 'Cinzel', serif;
        }

        @media (max-width: 500px) {
          .tour-card {
            padding: 1.5rem;
          }
          .tour-card h1 {
            font-size: 2rem;
          }
          .tour-icono {
            font-size: 3rem;
          }
          .tour-mensaje {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════

function MiMagiaContent() {
  const searchParams = useSearchParams();
  const seccionInicial = searchParams.get('seccion') || 'inicio';

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [necesitaLogin, setNecesitaLogin] = useState(false);
  const [seccion, setSeccion] = useState(seccionInicial);
  const [onboarding, setOnboarding] = useState(false);
  const [mostrandoTour, setMostrandoTour] = useState(false);
  const [mostrandoPerfil, setMostrandoPerfil] = useState(false);
  const [mostrandoPerfilado, setMostrandoPerfilado] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [token, setToken] = useState('');
  const [pais, setPais] = useState('UY');
  // FORZAR MOBILE: Siempre mostrar hamburguesa en pantallas pequeñas
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    cargarUsuario();
    detectarPais();
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Actualizar sección cuando cambia la URL
  useEffect(() => {
    const seccionURL = searchParams.get('seccion');
    if (seccionURL && seccionURL !== seccion) {
      setSeccion(seccionURL);
    }
  }, [searchParams]);

  const detectarPais = async () => {
    try { const res = await fetch('https://ipapi.co/json/'); const data = await res.json(); setPais(data.country_code || 'UY'); } catch(e) { setPais('UY'); }
  };

  const cargarUsuario = async () => {
    const params = new URLSearchParams(window.location.search);
    let t = params.get('token');

    // Si no hay token en URL, buscar en localStorage
    if (!t) {
      t = localStorage.getItem('mimagia_token');
    }

    // Si todavía no hay token, mostrar login
    if (!t) {
      setNecesitaLogin(true);
      setCargando(false);
      return;
    }

    setToken(t);
    try {
      const res = await fetch(`${API_BASE}/api/mi-magia/usuario?token=${t}`);
      const data = await res.json();
      if (data.success && data.usuario) {
        setUsuario(data.usuario);
        // Guardar token en localStorage para próximas visitas
        localStorage.setItem('mimagia_token', t);
        // Limpiar token de URL para que quede más limpia
        if (params.get('token')) {
          window.history.replaceState({}, '', '/mi-magia');
        }
        if (!data.usuario.onboardingCompleto) {
          setOnboarding(true);
        } else {
          // Si ya completó onboarding pero nunca vio el tour, mostrarlo
          // Verificar en backend Y localStorage (doble check para robustez)
          const tourVistoLocal = localStorage.getItem('tour_mimagia_visto');
          const tourVistoBackend = data.usuario.tourVisto;
          if (!tourVistoLocal && !tourVistoBackend) {
            setMostrandoTour(true);
          } else if (!tourVistoLocal && tourVistoBackend) {
            // Sincronizar localStorage con backend
            localStorage.setItem('tour_mimagia_visto', 'true');
          }
        }
      } else {
        // Token inválido, mostrar login
        localStorage.removeItem('mimagia_token');
        setNecesitaLogin(true);
      }
    } catch (e) {
      console.error(e);
      setNecesitaLogin(true);
    }
    setCargando(false);
  };

  // Función para renderizar contenido según estado (Tito se renderiza siempre al final)
  const renderContenidoEstado = () => {
    if (cargando) return <Carga />;
    if (necesitaLogin) return <LoginMagicLink onLoginExitoso={() => window.location.reload()} />;
    if (onboarding) return <Onboarding usuario={usuario} token={token} onDone={(d) => { setUsuario({...usuario, ...d, onboardingCompleto: true, runas: 100}); setOnboarding(false); setMostrandoTour(true); }} />;
    if (mostrandoTour) return <TourMiMagia usuario={usuario} onFinish={async () => {
      setMostrandoTour(false);
      localStorage.setItem('tour_mimagia_visto', 'true');
      try {
        await fetch(`${API_BASE}/api/mi-magia/usuario`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: usuario.email, tourVisto: true })
        });
      } catch(e) { console.error('Error guardando tourVisto:', e); }
      if (!usuario?.perfilCompleto) {
        setMostrandoPerfil(true);
      } else if (!usuario?.perfilPsicologico && !usuario?.perfiladoCompletado) {
        setMostrandoPerfilado(true);
      }
    }} />;
    if (mostrandoPerfil) return <FormularioPerfil
      usuario={usuario}
      onComplete={(perfilData) => {
        setUsuario({...usuario, ...perfilData, perfilCompleto: true});
        setMostrandoPerfil(false);
        if (!usuario?.perfilPsicologico) {
          setMostrandoPerfilado(true);
        }
      }}
      onSkip={() => {
        setMostrandoPerfil(false);
        if (!usuario?.perfilPsicologico) {
          setMostrandoPerfilado(true);
        }
      }}
    />;
    if (mostrandoPerfilado) return <TestPerfiladoPsicologico
      usuario={usuario}
      onComplete={(perfilPsicologico) => {
        if (perfilPsicologico) {
          setUsuario({...usuario, perfilPsicologico, perfiladoCompletado: true});
        }
        setMostrandoPerfilado(false);
      }}
      onSkip={() => setMostrandoPerfilado(false)}
    />;
    return null; // Estado normal - renderizar contenido principal
  };

  // Si hay un estado especial (cargando, login, onboarding, etc.), renderizarlo con Tito
  const estadoEspecial = renderContenidoEstado();
  if (estadoEspecial) {
    return (
      <>
        <style jsx global>{estilos}</style>
        {estadoEspecial}
        {!cargando && <Tito usuario={usuario} abierto={chatAbierto} setAbierto={setChatAbierto} />}
      </>
    );
  }

  const renderSeccion = () => {
    switch(seccion) {
      // Componentes extraídos (importados)
      case 'inicio': return <SeccionInicio usuario={usuario} ir={setSeccion} token={token} setUsuario={setUsuario} />;
      case 'canalizaciones': return <SeccionCanalizaciones usuario={usuario} />;
      case 'regalos': return <SeccionRegalos ir={setSeccion} usuario={usuario} setUsuario={setUsuario} />;
      case 'circulo': return <SeccionCirculo usuario={usuario} pais={pais} />;
      case 'grimorio': return <SeccionGrimorio usuario={usuario} token={token} setUsuario={setUsuario} />;
      // Componentes locales (aún no extraídos)
      case 'historial_lecturas': return <SeccionHistorialLecturas token={token} />;
      case 'jardin': return <Jardin usuario={usuario} setUsuario={setUsuario} pais={pais} token={token} />;
      case 'experiencias': return <ExperienciasMagicas usuario={usuario} token={token} setUsuario={setUsuario} />;
      case 'experiencias_catalogo': return <CatalogoExperiencias usuario={usuario} setUsuario={setUsuario} />;
      case 'lecturas_gamificadas': return <CatalogoLecturasGamificado usuario={usuario} token={token} setUsuario={setUsuario} />;
      case 'tienda_runas': return <TiendaRunas usuario={usuario} />;
      case 'tienda_membresias': return <TiendaMembresias usuario={usuario} circulo={circulo} />;
      case 'mundo': return <MundoSec />;
      case 'cuidados': return <CuidadosSec />;
      case 'cristales': return <CristalesSec />;
      case 'guia_cristales': return <GuiaCristales usuario={usuario} />;
      case 'test_elemental': return <TestElemental usuario={usuario} onComplete={(r) => setUsuario({...usuario, elemento: r.elemento_principal})} />;
      case 'test_guardian': return <TestGuardian usuario={usuario} onComplete={(r) => setUsuario({...usuario, testGuardian: r})} />;
      case 'cosmos': return <CosmosMes usuario={usuario} />;
      case 'promociones': return <PromocionesMagicas usuario={usuario} ir={setSeccion} />;
      case 'foro': return <ForoSec usuario={usuario} setUsuario={setUsuario} />;
      case 'utilidades': return <UtilidadesSec usuario={usuario} />;
      case 'faq': return <FaqSec onVerTour={() => setMostrandoTour(true)} />;
      default: return <SeccionInicio usuario={usuario} ir={setSeccion} token={token} setUsuario={setUsuario} />;
    }
  };

  // Estilos inline para móvil (bypass CSS cache)
  // IMPORTANTE: Usar 'none' antes de mount para evitar hidratación
  const showMobileMenu = mounted && isMobile;
  const mobileMenuBtn = {
    display: showMobileMenu ? 'flex' : 'none',
    flexDirection: 'column',
    gap: '5px',
    background: '#d4af37',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    minWidth: '48px',
    minHeight: '48px',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    // TOUCH FIX
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    pointerEvents: 'auto',
    userSelect: 'none',
    zIndex: 101
  };
  const mobileMenuLine = { width: '22px', height: '3px', background: '#fff', borderRadius: '2px', display: 'block' };
  const mobileNav = {
    position: 'fixed', top: '65px', left: 0, bottom: 0, width: '260px',
    background: '#fff', borderRight: '1px solid #e0e0e0', padding: '1rem 0',
    display: 'flex', flexDirection: 'column', zIndex: 99, overflowY: 'auto',
    transform: menuAbierto ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease',
    boxShadow: menuAbierto ? '4px 0 20px rgba(0,0,0,0.2)' : 'none'
  };
  const mobileOverlay = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 98
  };

  return (
    <div className="app">
      <style jsx global>{estilos}</style>
      <header className="mi-magia-header" style={isMobile ? {padding: '0 12px'} : {}}>
        <div className="logo"><span>✦</span> MI MAGIA</div>
        {!isMobile && <div className="user-info">{saludoPersonalizado(usuario?.nombrePreferido, usuario?.genero || usuario?.pronombre)}</div>}
        <div className="hstats" style={isMobile ? {gap: '6px'} : {}}>
          <span style={{background: '#1a1a1a', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: isMobile ? '0.75rem' : '0.85rem'}}>☘ {usuario?.treboles || 0}</span>
          <span style={{background: '#1a1a1a', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: isMobile ? '0.75rem' : '0.85rem'}}>ᚱ {usuario?.runas || 0}</span>
        </div>
        <button
          style={mobileMenuBtn}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuAbierto(!menuAbierto); }}
          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setMenuAbierto(!menuAbierto); }}
          aria-label="Menú"
        >
          <span style={mobileMenuLine}></span>
          <span style={mobileMenuLine}></span>
          <span style={mobileMenuLine}></span>
        </button>
      </header>

      {menuAbierto && isMobile && <div style={mobileOverlay} onClick={() => setMenuAbierto(false)} />}
      <nav className={`nav ${menuAbierto ? 'abierto' : ''}`} style={isMobile ? mobileNav : {}}>
        {[['inicio','◇','Inicio'],['test_guardian','🔮','Test del Guardián'],['canalizaciones','♦','Mis Canalizaciones'],['historial_lecturas','📖','Mis Lecturas'],['jardin','☘','Jardín de Tréboles'],['experiencias','✦','Experiencias'],['experiencias_catalogo','ᚱ','Tienda Runas'],['regalos','❤','Regalos']].map(([k,i,t]) =>
          <button key={k} className={`nav-item ${seccion===k?'activo':''}`} onClick={() => {setSeccion(k);setMenuAbierto(false);}}><span className="nav-i">{i}</span>{t}</button>
        )}
        <div className="nav-sep">El Mundo Elemental</div>
        {[['test_elemental','◈','Tu Elemento'],['mundo','❂','Reino Elemental'],['cuidados','❧','Cuidados'],['guia_cristales','💎','Guía Cristales']].map(([k,i,t]) =>
          <button key={k} className={`nav-item ${seccion===k?'activo':''}`} onClick={() => {setSeccion(k);setMenuAbierto(false);}}><span className="nav-i">{i}</span>{t}</button>
        )}
        <div className="nav-sep">Tu Espacio</div>
        {[['circulo','★','Círculo'],['promociones','🎁','Promociones Mágicas'],['cosmos','☽','Cosmos del Mes'],['grimorio','▣','Grimorio'],['foro','💬','Foro Mágico']].map(([k,i,t]) =>
          <button key={k} className={`nav-item ${seccion===k?'activo':''}`} onClick={() => {setSeccion(k);setMenuAbierto(false);}}><span className="nav-i">{i}</span>{t}</button>
        )}
        <div className="nav-sep">Recursos</div>
        {[['utilidades','⚡','Utilidades'],['faq','❓','FAQ Duendes']].map(([k,i,t]) =>
          <button key={k} className={`nav-item ${seccion===k?'activo':''}`} onClick={() => {setSeccion(k);setMenuAbierto(false);}}><span className="nav-i">{i}</span>{t}</button>
        )}
        <div className="nav-links-externos">
          <a href="/mi-magia/circulo" className="nav-volver nav-circulo">★ Entrar al Círculo</a>
          <a href="/tienda" className="nav-volver nav-tienda">🃏 Tienda Mágica</a>
        </div>
      </nav>
      
      <main className={`contenido ${sidebarAbierto && !isMobile ? 'con-sidebar' : ''}`}>
        {renderSeccion()}
      </main>

      {/* SIDEBAR OPORTUNIDADES MÁGICAS */}
      {!isMobile && (
        <>
          <button
            className={`sidebar-toggle ${sidebarAbierto ? 'abierto' : ''}`}
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            title={sidebarAbierto ? 'Cerrar ofertas' : 'Ver ofertas mágicas'}
          >
            <span className="toggle-icon">{sidebarAbierto ? '→' : '★'}</span>
            {!sidebarAbierto && <span className="toggle-badge">OFERTAS</span>}
          </button>

          <aside className={`sidebar-oportunidades ${sidebarAbierto ? 'abierto' : ''}`}>
            <div className="sidebar-header">
              <h3>✦ Oportunidades Mágicas</h3>
              <p>Ofertas exclusivas para ti</p>
            </div>

            {/* CÍRCULO PROMOCIÓN */}
            {!usuario?.esCirculo && (
              <div className="sidebar-card circulo-promo">
                <div className="promo-badge">15 DÍAS GRATIS</div>
                <span className="promo-icon">★</span>
                <h4>Círculo de Duendes</h4>
                <p>Tu santuario secreto con beneficios exclusivos</p>
                <ul className="promo-beneficios">
                  <li>✓ Contenido semanal exclusivo</li>
                  <li>✓ Runas y tréboles extra</li>
                  <li>✓ Tiradas gratis mensuales</li>
                  <li>✓ Descuentos de 5% a 10%</li>
                  <li>✓ Acceso anticipado</li>
                </ul>
                <a href="/mi-magia/circulo" className="btn-promo" onClick={() => setSidebarAbierto(false)}>
                  Probá 15 días gratis →
                </a>
              </div>
            )}

            {usuario?.esCirculo && (
              <div className="sidebar-card circulo-activo">
                <span className="promo-icon activo">★</span>
                <h4>✓ Sos parte del Círculo</h4>
                <p>Membresía activa</p>
                <a href="/mi-magia/circulo" className="btn-circulo-link" onClick={() => setSidebarAbierto(false)}>
                  Ir al Círculo →
                </a>
              </div>
            )}

            {/* RUNAS DE PODER */}
            <div className="sidebar-card">
              <div className="oferta-mini">
                <span>ᚱ</span>
                <div>
                  <strong>Runas de Poder</strong>
                  <p>Para experiencias mágicas</p>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                <a href={`${WORDPRESS_URL}/producto/runas-chispa/`} target="_blank" rel="noopener" className="btn-outline-sm" style={{display:'flex',justifyContent:'space-between'}}>
                  <span>50 Runas</span><span style={{color:'#d4af37'}}>$7</span>
                </a>
                <a href={`${WORDPRESS_URL}/producto/runas-destello/`} target="_blank" rel="noopener" className="btn-outline-sm" style={{display:'flex',justifyContent:'space-between'}}>
                  <span>100 Runas</span><span style={{color:'#d4af37'}}>$12</span>
                </a>
                <a href={`${WORDPRESS_URL}/producto/runas-fulgor/`} target="_blank" rel="noopener" className="btn-outline-sm" style={{display:'flex',justifyContent:'space-between'}}>
                  <span>200 Runas</span><span style={{color:'#d4af37'}}>$18</span>
                </a>
              </div>
            </div>

            {/* EXPERIENCIA DESTACADA */}
            <div className="sidebar-card">
              <div className="oferta-mini">
                <span>✦</span>
                <div>
                  <strong>Tirada de Runas</strong>
                  <p>5 runas • 20-30 min</p>
                </div>
              </div>
              <button className="btn-outline-sm" onClick={() => {setSeccion('experiencias'); setSidebarAbierto(false);}}>
                Solicitar
              </button>
            </div>

            {/* GUARDIÁN EN ADOPCIÓN */}
            <DuendeDisponible compacto={true} />

            {/* FOOTER SIDEBAR */}
            <div className="sidebar-footer">
              <p>¿Preguntas sobre ofertas?</p>
              <button className="btn-tito" onClick={() => {setChatAbierto(true); setSidebarAbierto(false);}}>
                Preguntale a Tito 🤖
              </button>
            </div>
          </aside>
        </>
      )}

      {!chatAbierto && <TitoBurbuja usuario={usuario} onAbrir={() => setChatAbierto(true)} />}
      <Tito usuario={usuario} abierto={chatAbierto} setAbierto={setChatAbierto} />
    </div>
  );
}

function Carga() {
  return <div className="carga"><style jsx global>{estilos}</style><div className="carga-c"><div className="carga-runa">ᚱ</div><p>Preparando tu magia...</p></div></div>;
}

function Onboarding({ usuario, token, onDone }) {
  const [guardando, setGuardando] = useState(false);
  const [datos, setDatos] = useState({
    nombrePreferido: usuario?.nombre || '',
    genero: '', // 'femenino' o 'masculino'
    pais: '',
    moneda: 'USD'
  });

  const paises = [
    { codigo: 'uruguay', nombre: 'Uruguay', bandera: '🇺🇾', moneda: 'UYU' },
    { codigo: 'argentina', nombre: 'Argentina', bandera: '🇦🇷', moneda: 'USD' },
    { codigo: 'mexico', nombre: 'México', bandera: '🇲🇽', moneda: 'USD' },
    { codigo: 'espana', nombre: 'España', bandera: '🇪🇸', moneda: 'USD' },
    { codigo: 'chile', nombre: 'Chile', bandera: '🇨🇱', moneda: 'USD' },
    { codigo: 'colombia', nombre: 'Colombia', bandera: '🇨🇴', moneda: 'USD' },
    { codigo: 'peru', nombre: 'Perú', bandera: '🇵🇪', moneda: 'USD' },
    { codigo: 'usa', nombre: 'Estados Unidos', bandera: '🇺🇸', moneda: 'USD' },
    { codigo: 'otro', nombre: 'Otro país', bandera: '🌎', moneda: 'USD' },
  ];

  const seleccionarPais = (p) => {
    setDatos({...datos, pais: p.codigo, moneda: p.moneda});
  };

  const guardar = async () => {
    setGuardando(true);
    try {
      await fetch(`${API_BASE}/api/mi-magia/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          ...datos,
          pronombre: datos.genero === 'femenino' ? 'ella' : 'el',
          perfilIncompleto: true // Flag para mostrar banner de completar después
        })
      });
    } catch(e) {}
    onDone(datos);
  };

  const puedeEntrar = datos.nombrePreferido && datos.genero && datos.pais;

  return (
    <div className="onb"><style jsx global>{estilos}</style>
      <div className="onb-card">
        <div className="onb-hero onb-hero-simple">
          <div className="onb-hero-glow"></div>
          <span className="onb-hero-runa">ᛉ</span>
          <h1>¡Bienvenida a Mi Magia!</h1>
          <p className="onb-hero-sub">Solo 3 cositas para personalizar tu experiencia</p>

          {/* Nombre */}
          <div className="onb-campo">
            <label>¿Cómo te llamás?</label>
            <input
              type="text"
              value={datos.nombrePreferido}
              onChange={e => setDatos({...datos, nombrePreferido: e.target.value})}
              placeholder="Tu nombre o apodo"
            />
          </div>

          {/* Género */}
          <div className="onb-campo">
            <label>¿Cómo preferís que te hablemos?</label>
            <div className="onb-genero-btns">
              <button
                type="button"
                className={`onb-genero-btn ${datos.genero === 'femenino' ? 'act' : ''}`}
                onClick={() => setDatos({...datos, genero: 'femenino'})}
              >
                <span className="onb-genero-emoji">👩</span>
                <strong>Femenino</strong>
                <small>querida, ella</small>
              </button>
              <button
                type="button"
                className={`onb-genero-btn ${datos.genero === 'masculino' ? 'act' : ''}`}
                onClick={() => setDatos({...datos, genero: 'masculino'})}
              >
                <span className="onb-genero-emoji">👨</span>
                <strong>Masculino</strong>
                <small>querido, él</small>
              </button>
            </div>
          </div>

          {/* País */}
          <div className="onb-campo">
            <label>¿De dónde sos?</label>
            <div className="onb-paises">
              {paises.map(p => (
                <button
                  key={p.codigo}
                  type="button"
                  className={`onb-pais-btn ${datos.pais === p.codigo ? 'act' : ''}`}
                  onClick={() => seleccionarPais(p)}
                >
                  <span>{p.bandera}</span>
                  <span>{p.nombre}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Regalo */}
          {puedeEntrar && (
            <div className="onb-regalo-mini">
              <span className="regalo-runa">ᚱ</span>
              <div>
                <strong>Tu regalo: 100 Runas de Poder</strong>
                <small>Para descubrir las experiencias mágicas</small>
              </div>
            </div>
          )}

          <button
            className="btn-gold btn-enter"
            onClick={guardar}
            disabled={!puedeEntrar || guardando}
          >
            {guardando ? 'Entrando...' : 'Entrar a Mi Magia ✨'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INICIO
// ═══════════════════════════════════════════════════════════════

// DEPRECATED: Usar SeccionInicio importado
function InicioLocal({ usuario, ir, token, setUsuario }) {
  const rango = getRango(usuario?.gastado);
  const siguiente = getSiguienteRango(usuario?.gastado);
  const progreso = siguiente ? ((usuario?.gastado || 0) / siguiente.min) * 100 : 100;

  // Frases de validación rotativas según intereses del usuario
  const validaciones = {
    'Me siento sola': 'Tu guardián siente tu soledad. No viniste a caminar sola.',
    'Nada me alcanza': 'La abundancia no es acumulación. Es flujo. Tu guardián te enseñará.',
    'Repito patrones': 'Los patrones que se repiten no son mala suerte. Son señales.',
    'Quiero sanar': 'No necesitás sanar sola. Tu guardián ya conoce tus heridas.',
    'Busco protección': 'Hay algo cuidándote desde antes de que supieras que existía.',
    'Necesito claridad': 'La claridad no llega pensando. Llega sintiendo. Dejate guiar.',
    'Quiero paz': 'La paz que buscás afuera ya existe adentro. Te ayudamos a encontrarla.',
    'Busco amor': 'El amor empieza cuando te reconocés. Tu guardián te ve.',
  };
  const interesUsuario = usuario?.intereses?.[0];
  const fraseValidacion = interesUsuario && validaciones[interesUsuario] ? validaciones[interesUsuario] : 'Tu guardián ya sabe que llegaste. Ahora solo falta que lo escuches.';

  return (
    <div className="sec">
      {/* HERO CON VALIDACIÓN EMOCIONAL */}
      <div className="banner banner-neuro">
        <div className="banner-glow"></div>
        <div className="banner-rango">
          <span className="rango-icono">{rango.icono}</span>
          <div className="rango-info">
            <span className="rango-nombre">{rango.nombre}</span>
            <span className="rango-ben">{rango.beneficio}</span>
          </div>
          <BadgeNivelAcceso usuario={usuario} />
        </div>
        <h1 className="hero-title">{usuario?.nombrePreferido}, te estaba esperando.</h1>
        <p className="hero-validation">{fraseValidacion}</p>
        {siguiente && (
          <div className="progreso-rango">
            <div className="progreso-bar"><div className="progreso-fill" style={{width: `${Math.min(progreso, 100)}%`}}></div></div>
            <small>${usuario?.gastado || 0} / ${siguiente.min} para {siguiente.icono} {siguiente.nombre}</small>
          </div>
        )}
      </div>

      {/* ══════ BANNER DE PROMOCIONES ══════ */}
      <BannerPromociones usuario={usuario} ubicacion="mi-magia-inicio" />

      {/* ══════ BANNER DE UPGRADE (si no es Círculo) ══════ */}
      <BannerUpgrade
        usuario={usuario}
        onActivarTrial={(data) => {
          if (setUsuario && data.usuario) {
            setUsuario(prev => ({
              ...prev,
              esCirculo: data.usuario.esCirculo,
              circuloExpira: data.usuario.circuloExpira,
              runas: data.usuario.runas
            }));
          }
        }}
      />

      {/* SEÑAL DEL DÍA */}
      <SenalDelDia usuario={usuario} />

      {/* ══════ COFRE DIARIO - GAMIFICACIÓN ══════ */}
      <CofreDiario
        usuario={usuario}
        token={token}
        onRunasGanadas={(runas) => {
          if (setUsuario) {
            setUsuario(prev => ({
              ...prev,
              runas: (prev?.runas || 0) + runas
            }));
          }
        }}
      />

      {/* ══════ DASHBOARD DE GAMIFICACIÓN ══════ */}
      <div className="gamificacion-section">
        <h2 className="seccion-titulo">
          <span className="titulo-icono">⚔️</span>
          Tu Progreso Mágico
        </h2>
        <DashboardGamificacion usuario={usuario} token={token} />
      </div>

      {/* ══════ MISIONES ══════ */}
      <div className="gamificacion-section">
        <h2 className="seccion-titulo">
          <span className="titulo-icono">📜</span>
          Misiones
        </h2>
        <MisionesPanel token={token} />
      </div>

      {/* ══════ BADGES ══════ */}
      <div className="gamificacion-section">
        <h2 className="seccion-titulo">
          <span className="titulo-icono">🏆</span>
          Tu Colección de Badges
        </h2>
        <ColeccionBadges token={token} />
      </div>

      {/* ══════ LEADERBOARD ══════ */}
      <LeaderboardRachas token={token} />

      {/* ══════ SISTEMA DE REFERIDOS ══════ */}
      <Referidos usuario={usuario} token={token} />

      {/* ══════ TEST DEL GUARDIÁN - EMBEBIDO EN INICIO ══════ */}
      <div className="test-guardian-inicio-wrapper">
        <TestGuardian
          usuario={usuario}
          onComplete={(resultado) => {
            // Recargar usuario con nuevo testGuardian
            window.location.reload();
          }}
        />
      </div>

      {/* STATS CON SIGNIFICADO */}
      <div className="stats-g">
        <div className="stat-c" onClick={() => ir('canalizaciones')}><div className="stat-n">{(usuario?.guardianes?.length || 0) + (usuario?.lecturas?.length || 0)}</div><div className="stat-t">Conexiones</div></div>
        <div className="stat-c" onClick={() => ir('jardin')}><div className="stat-n">{usuario?.treboles || 0}</div><div className="stat-t">Tréboles</div></div>
        <div className="stat-c stat-runas" onClick={() => ir('tienda_runas')}><div className="stat-n">{usuario?.runas || 0}</div><div className="stat-t">Runas</div><div className="stat-plus">+</div></div>
        <div className="stat-c" onClick={() => ir('grimorio')}><div className="stat-n">{usuario?.diario?.length || 0}</div><div className="stat-t">Escritos</div></div>
      </div>

      {/* CATEGORÍAS POR DOLOR/NECESIDAD */}
      <div className="dolor-section">
        <h2 className="dolor-titulo">¿Qué necesitás sanar?</h2>
        <div className="dolor-cards">
          <a href={`${WORDPRESS_URL}/categoria-producto/amor/`} target="_blank" rel="noopener" className="dolor-card dolor-amor">
            <span className="dolor-icon">◈</span>
            <strong>Me siento sola</strong>
            <small>Guardianes de Conexión</small>
          </a>
          <a href={`${WORDPRESS_URL}/categoria-producto/abundancia/`} target="_blank" rel="noopener" className="dolor-card dolor-abundancia">
            <span className="dolor-icon">✦</span>
            <strong>Nada me alcanza</strong>
            <small>Guardianes de Abundancia</small>
          </a>
          <a href={`${WORDPRESS_URL}/categoria-producto/proteccion/`} target="_blank" rel="noopener" className="dolor-card dolor-proteccion">
            <span className="dolor-icon">◇</span>
            <strong>Tengo miedo</strong>
            <small>Guardianes Protectores</small>
          </a>
          <a href={`${WORDPRESS_URL}/categoria-producto/sanacion/`} target="_blank" rel="noopener" className="dolor-card dolor-sanacion">
            <span className="dolor-icon">❧</span>
            <strong>Quiero sanar</strong>
            <small>Guardianes Sanadores</small>
          </a>
        </div>
      </div>

      {/* ACCESOS RÁPIDOS REESCRITOS */}
      <div className="accesos-g">
        <button className="acceso acceso-destacado" onClick={() => ir('experiencias')}><span>✦</span><strong>Experiencias Mágicas</strong><small>30+ lecturas, estudios y rituales</small></button>
        <button className="acceso acceso-runas" onClick={() => ir('experiencias_catalogo')}><span>ᚱ</span><strong>Tienda de Runas</strong><small>Obtené runas para tus lecturas</small></button>
        <button className="acceso acceso-circulo" onClick={() => ir('tienda_membresias')}><span>⭐</span><strong>Círculo de Duendes</strong><small>Membresía con beneficios exclusivos</small></button>
        <button className="acceso" onClick={() => ir('test_elemental')}><span>◈</span><strong>Descubrir quién me eligió</strong><small>Test de elemento y guardián</small></button>
        <button className="acceso" onClick={() => ir('regalos')}><span>❤</span><strong>Regalar magia a alguien</strong><small>Que otro sienta lo que vos sentiste</small></button>
      </div>

      {/* MICRO-VALIDACIÓN */}
      <div className="micro-validation">
        <p>Si llegaste hasta acá, no fue casualidad.</p>
        <p className="micro-highlight">El guardián te encuentra. No al revés.</p>
      </div>

      {!usuario?.esCirculo && (
        <a href="/mi-magia/circulo" className="banner-circ banner-circ-neuro">
          <span className="circ-glow"></span>
          <span>★</span>
          <div>
            <h3>349 elegidas ya son parte del Círculo</h3>
            <p>No es una membresía. Es una hermandad.</p>
          </div>
          <span className="badge badge-pulse">UNIRME</span>
        </a>
      )}

      {/* FOMO ESPIRITUAL */}
      <div className="fomo-box">
        <div className="fomo-content">
          <span className="fomo-icon">ᛉ</span>
          <div>
            <p className="fomo-main">Cada guardián existe una sola vez.</p>
            <p className="fomo-sub">Si se vende, no vuelve. No es marketing. Es canalización.</p>
          </div>
        </div>
        <a href={`${WORDPRESS_URL}/shop/`} target="_blank" rel="noopener" className="fomo-cta">Conocer a mi guardián</a>
      </div>

      {/* Banner Promociones */}
      <div className="banner-promo" onClick={() => ir('promociones')}>
        <span className="promo-icon-banner">✦</span>
        <div className="promo-banner-content">
          <h3>Oportunidades mágicas</h3>
          <p>Ofertas exclusivas que aparecen y desaparecen.</p>
        </div>
        <span className="promo-arrow">→</span>
      </div>

      <div className="info-box info-box-minimal">
        <h3>Tu espacio explicado</h3>
        <div className="info-grid">
          <div><span>☘</span><h4>Tréboles</h4><p>Se ganan comprando. Canjealos por descuentos, envíos gratis, regalos especiales.</p></div>
          <div><span>ᚱ</span><h4>Runas</h4><p>Moneda mágica para experiencias. Tiradas, lecturas, conexiones profundas.</p></div>
          <div><span>▣</span><h4>Grimorio</h4><p>Tu diario espiritual. Todo lo que recibís queda guardado para siempre.</p></div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HISTORIAL DE LECTURAS GAMIFICADAS
// ═══════════════════════════════════════════════════════════════

function SeccionHistorialLecturas({ token }) {
  return (
    <div className="sec historial-sec">
      <div className="sec-header">
        <h1>📖 Mis Lecturas</h1>
        <p>Todas tus lecturas completadas con runas</p>
      </div>
      <HistorialLecturas token={token} />
      <style jsx>{`
        .historial-sec {
          max-width: 800px;
          margin: 0 auto;
        }
        .sec-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .sec-header h1 {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          color: #1a1a2e;
          margin: 0 0 8px;
        }
        .sec-header p {
          color: #666;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MIS CANALIZACIONES (antes Santuario)
// ═══════════════════════════════════════════════════════════════

// DEPRECATED: Usar SeccionCanalizaciones importado
function CanalizacionesLocal({ usuario }) {
  const [tab, setTab] = useState('guardianes');
  const [canalizacionAbierta, setCanalizacionAbierta] = useState(null);

  const guardianes = usuario?.guardianes || [];
  const talismanes = usuario?.talismanes || [];
  const libros = usuario?.libros || [];
  const lecturas = usuario?.lecturas || [];
  const regalosHechos = usuario?.regalosHechos || [];
  const regalosRecibidos = usuario?.regalosRecibidos || [];

  // Buscar canalización para un guardián
  const getCanalizacion = (guardian) => {
    return lecturas.find(l => l.guardianId === guardian.id || l.ordenId === guardian.ordenId);
  };

  // Estado de canalización
  const getEstadoCana = (cana) => {
    if (!cana) return { texto: 'Pendiente', color: '#888', icono: '⏳' };
    if (cana.estado === 'enviada') return { texto: 'Lista', color: '#2ecc71', icono: '✓' };
    if (cana.estado === 'aprobada') return { texto: 'En camino', color: '#d4af37', icono: '✦' };
    return { texto: 'Procesando', color: '#3498db', icono: '◈' };
  };

  return (
    <div className="sec">
      <div className="sec-head"><h1>Mis Canalizaciones</h1><p>Todo lo que ha llegado a tu vida desde el mundo elemental.</p></div>

      <div className="tabs-h">
        {[['guardianes','◆','Guardianes'],['talismanes','✧','Talismanes'],['libros','📖','Libros'],['lecturas','✦','Lecturas'],['regalosH','❤↗','Regalos Hechos'],['regalosR','❤↙','Regalos Recibidos']].map(([k,i,t]) =>
          <button key={k} className={`tab ${tab===k?'act':''}`} onClick={() => setTab(k)}>{i} {t}</button>
        )}
      </div>

      {tab === 'guardianes' && (
        <div className="cana-content">
          {guardianes.length > 0 ? (
            <div className="guardianes-lista-completa">
              {guardianes.map((g, i) => {
                const cana = getCanalizacion(g);
                const estado = getEstadoCana(cana);
                return (
                  <div key={i} className="guardian-card-full">
                    <div className="guardian-foto">
                      {g.imagen ? <img src={g.imagen} alt={g.nombre} /> : <span className="guardian-placeholder">◆</span>}
                    </div>
                    <div className="guardian-info">
                      <h3>{g.nombre}</h3>
                      <div className="guardian-meta">
                        <span className="guardian-tipo">{g.tipo || 'Guardián'}</span>
                        {g.categoria && <span className="guardian-cat">{g.categoria}</span>}
                      </div>
                      <p className="guardian-fecha">Adoptado: {g.fecha || 'Recientemente'}</p>
                      {g.paraQuien && <p className="guardian-para">Para: {g.paraQuien}</p>}
                    </div>
                    <div className="guardian-cana">
                      <div className="cana-estado" style={{color: estado.color}}>
                        <span>{estado.icono}</span>
                        <span>Canalización: {estado.texto}</span>
                      </div>
                      {cana && cana.estado === 'enviada' ? (
                        <button className="btn-ver-cana" onClick={() => setCanalizacionAbierta(cana)}>
                          Ver Canalización
                        </button>
                      ) : (
                        <p className="cana-info-text">Tu canalización personalizada está siendo preparada con amor (4-24hs)</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-tab">
              <span>◆</span>
              <h3>Tus guardianes te esperan</h3>
              <p>Cuando adoptes tu primer guardián, aparecerá acá con toda su información, su historia y cómo cuidarlo.</p>
              <a href={`${WORDPRESS_URL}/shop/`} target="_blank" rel="noopener" className="btn-gold">Explorar Guardianes ↗</a>
            </div>
          )}

          {/* LOS ELEGIDOS - Narrativa Cinematográfica */}
          <div className="elegidos-cinematic">
            <div className="elegidos-titulo">
              <span className="titulo-pre">Ahora formás parte de</span>
              <h2>Los Elegidos</h2>
            </div>

            <div className="elegidos-portal">
              <div className="portal-glow"></div>
              <span className="portal-runa">ᛉ</span>
            </div>

            <div className="elegidos-story">
              <div className="story-scene scene-1">
                <p className="scene-visual">
                  Hay cosas que no se buscan.
                </p>
                <p>
                  Aparecen. Como esa persona que conocés en el momento exacto.
                  Como ese libro que cae de un estante y te cambia la vida.
                  Como un guardián que te mira desde una pantalla y algo
                  en vos dice <em>ahí está</em>.
                </p>
              </div>

              <div className="story-scene scene-2">
                <p className="scene-visual">
                  No sabemos cómo funciona.
                </p>
                <p>
                  Solo sabemos que pasa. Que hay personas que ven veinte,
                  treinta guardianes, y siguen de largo. Y hay otras que ven
                  uno solo y ya no pueden irse. Vuelven. Sueñan con él.
                  Le inventan nombre antes de saber el verdadero.
                </p>
              </div>

              <div className="story-reveal">
                <div className="reveal-line"></div>
                <p className="reveal-text">
                  A esas personas las llamamos<br/>
                  <em>Los Elegidos</em>
                </p>
                <div className="reveal-line"></div>
              </div>

              <div className="story-scene scene-3">
                <p>
                  No es un título. Es un reconocimiento. De algo que ya existía
                  antes de que supieras que existía. Un hilo invisible que
                  conecta al guardián con su humano — o al humano con su guardián,
                  según cómo lo mires.
                </p>
                <p>
                  Cada uno de ellos nace dos veces: cuando lo creamos con las manos,
                  y cuando alguien lo reconoce como suyo.
                </p>
              </div>

              <div className="story-scene scene-final">
                <p className="scene-revelation">
                  Si estás leyendo esto, el hilo ya se tensó.
                </p>
                <p className="scene-direct">
                  Ahora solo falta que tires.
                </p>
              </div>
            </div>

            <div className="elegidos-seal">
              <div className="seal-symbol">ᛉ</div>
              <div className="seal-text">
                <span className="seal-title">Registro de Los Elegidos</span>
                <span className="seal-name">{usuario?.nombrePreferido || 'Tu nombre'}</span>
                <span className="seal-date">Inscripta en {new Date(usuario?.creado || Date.now()).toLocaleDateString('es-UY', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="elegidos-explore">
              <p>Los guardianes siguen esperando.</p>
              <div className="explore-paths">
                <a href={`${WORDPRESS_URL}/categoria-producto/proteccion/`} className="path-link path-proteccion">
                  <div className="path-icon-anim">
                    <svg viewBox="0 0 40 40" className="icon-escudo">
                      <path d="M20 5 L35 12 L35 22 C35 30, 20 38, 20 38 C20 38, 5 30, 5 22 L5 12 Z" fill="none" stroke="#4A90D9" strokeWidth="2" className="escudo-base"/>
                      <path d="M20 10 L30 15 L30 22 C30 27, 20 33, 20 33 C20 33, 10 27, 10 22 L10 15 Z" fill="rgba(74,144,217,0.2)" className="escudo-inner"/>
                      <circle cx="20" cy="20" r="3" fill="#4A90D9" className="escudo-centro"/>
                    </svg>
                    <div className="floating-icons shields">
                      <span className="float-icon fi1">◇</span>
                      <span className="float-icon fi2">◇</span>
                      <span className="float-icon fi3">◇</span>
                    </div>
                  </div>
                  <span className="path-name">Protectores</span>
                  <span className="path-desc">Guardianes del escudo</span>
                </a>
                <a href={`${WORDPRESS_URL}/categoria-producto/amor/`} className="path-link path-amor">
                  <div className="path-icon-anim">
                    <svg viewBox="0 0 40 40" className="icon-corazon">
                      <path d="M20 35 C20 35, 5 25, 5 15 C5 8, 12 5, 20 12 C28 5, 35 8, 35 15 C35 25, 20 35, 20 35" fill="#E91E8C" className="corazon-base"/>
                      <path d="M20 30 C20 30, 10 23, 10 16 C10 12, 14 10, 20 15 C26 10, 30 12, 30 16 C30 23, 20 30, 20 30" fill="rgba(255,255,255,0.2)" className="corazon-inner"/>
                    </svg>
                    <div className="floating-icons hearts">
                      <span className="float-icon fi1">♥</span>
                      <span className="float-icon fi2">♥</span>
                      <span className="float-icon fi3">♥</span>
                    </div>
                  </div>
                  <span className="path-name">Sanadores del Corazón</span>
                  <span className="path-desc">Guardianes del vínculo</span>
                </a>
                <a href={`${WORDPRESS_URL}/categoria-producto/dinero-abundancia-negocios/`} className="path-link path-abundancia">
                  <div className="path-icon-anim">
                    <svg viewBox="0 0 40 40" className="icon-moneda">
                      <circle cx="20" cy="20" r="15" fill="#C6A962" className="moneda-base"/>
                      <circle cx="20" cy="20" r="12" fill="none" stroke="#b8962e" strokeWidth="1" className="moneda-borde"/>
                      <text x="20" y="25" textAnchor="middle" fill="#8B7355" fontSize="14" fontFamily="serif" fontWeight="bold">$</text>
                    </svg>
                    <div className="floating-icons coins">
                      <span className="float-icon fi1">✦</span>
                      <span className="float-icon fi2">✦</span>
                      <span className="float-icon fi3">✦</span>
                    </div>
                  </div>
                  <span className="path-name">Portadores de Oro</span>
                  <span className="path-desc">Guardianes del flujo</span>
                </a>
                <a href={`${WORDPRESS_URL}/categoria-producto/salud/`} className="path-link path-sanacion">
                  <div className="path-icon-anim">
                    <svg viewBox="0 0 40 40" className="icon-vida">
                      <circle cx="20" cy="20" r="15" fill="none" stroke="#2ECC71" strokeWidth="2" className="vida-circulo"/>
                      <path d="M20 8 Q25 15, 20 25 Q15 15, 20 8" fill="#2ECC71" className="vida-hoja1"/>
                      <path d="M12 18 Q18 20, 20 20 Q18 22, 12 22" fill="#27ae60" className="vida-hoja2"/>
                      <path d="M28 18 Q22 20, 20 20 Q22 22, 28 22" fill="#27ae60" className="vida-hoja3"/>
                    </svg>
                    <div className="floating-icons leaves">
                      <span className="float-icon fi1">❋</span>
                      <span className="float-icon fi2">❋</span>
                      <span className="float-icon fi3">❋</span>
                    </div>
                  </div>
                  <span className="path-name">Tejedores de Vida</span>
                  <span className="path-desc">Guardianes del cuerpo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Canalización */}
      {canalizacionAbierta && (
        <div className="modal-cana-overlay" onClick={() => setCanalizacionAbierta(null)}>
          <div className="modal-cana" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCanalizacionAbierta(null)}>×</button>
            <div className="modal-cana-header">
              <span>✦</span>
              <h2>Canalización de {canalizacionAbierta.guardianNombre || 'tu Guardián'}</h2>
              {canalizacionAbierta.paraQuien && <p>Para: {canalizacionAbierta.paraQuien}</p>}
            </div>
            <div className="modal-cana-content">
              {canalizacionAbierta.contenido?.split('\n').map((parrafo, i) => (
                parrafo.trim() && <p key={i}>{limpiarTexto(parrafo)}</p>
              ))}
            </div>
            <div className="modal-cana-footer">
              <small>Esta canalización fue creada especialmente para ti ✦</small>
            </div>
          </div>
        </div>
      )}
      
      {tab === 'talismanes' && (
        <div className="cana-content">
          {talismanes.length > 0 ? (
            <div className="items-grid">{talismanes.map((t,i) => <div key={i} className="item-card"><h4>{t.nombre}</h4><small>{t.fecha}</small></div>)}</div>
          ) : (
            <div className="seccion-cinematica seccion-talismanes">
              <div className="seccion-simbolo">
                <div className="anim-varita">
                  <svg viewBox="0 0 80 80" className="varita-svg">
                    <defs>
                      <linearGradient id="varitaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d4af37"/>
                        <stop offset="50%" stopColor="#9b59b6"/>
                        <stop offset="100%" stopColor="#d4af37"/>
                      </linearGradient>
                    </defs>
                    <line x1="20" y1="60" x2="60" y2="20" stroke="url(#varitaGrad)" strokeWidth="3" strokeLinecap="round" className="varita-line"/>
                    <circle cx="60" cy="20" r="4" fill="#d4af37" className="varita-punta"/>
                    <g className="varita-sparkles">
                      <circle cx="65" cy="15" r="2" fill="#fff" className="sparkle s1"/>
                      <circle cx="70" cy="22" r="1.5" fill="#9b59b6" className="sparkle s2"/>
                      <circle cx="58" cy="10" r="1.5" fill="#d4af37" className="sparkle s3"/>
                      <circle cx="72" cy="12" r="1" fill="#fff" className="sparkle s4"/>
                    </g>
                  </svg>
                </div>
              </div>

              <div className="seccion-narrativa">
                <div className="story-scene scene-1">
                  <p className="scene-visual">
                    Un guardián protege. Un talismán amplifica.
                  </p>
                  <p>
                    Lo vas a sentir cuando lo veas. Un tirón en el pecho.
                    Una certeza que no tiene explicación. Vas a cerrar la página
                    y seguir con tu día — pero va a seguir ahí, en tu cabeza.
                  </p>
                </div>

                <div className="story-scene scene-2">
                  <p>
                    Vas a soñar con él. Te vas a despertar pensando en él.
                    Vas a volver a mirarlo "solo para ver" y cada vez va a costar
                    más cerrar la página.
                  </p>
                  <p>
                    Eso es el llamado. Y las personas especiales lo sienten.
                  </p>
                </div>

                <div className="story-reveal">
                  <div className="reveal-line"></div>
                  <p className="reveal-text">
                    Tu colección de talismanes<br/>
                    <em>empieza cuando vos decidas</em>
                  </p>
                  <div className="reveal-line"></div>
                </div>

                <div className="story-scene scene-final">
                  <p className="scene-direct">
                    Algunos los tienen todos. Otros empiezan con uno y no pueden parar.
                  </p>
                </div>
              </div>

              <a href={`${WORDPRESS_URL}/categoria-producto/talismanes/`} className="seccion-cta">
                <span>Ver los talismanes</span>
                <span className="cta-arrow">→</span>
              </a>
            </div>
          )}
        </div>
      )}
      
      {tab === 'libros' && (
        <div className="cana-content">
          {libros.length > 0 ? (
            <div className="items-grid">{libros.map((l,i) => <div key={i} className="item-card"><h4>{l.nombre}</h4><small>{l.fecha}</small></div>)}</div>
          ) : (
            <div className="seccion-cinematica seccion-libros">
              <div className="seccion-simbolo">
                <div className="anim-libro">
                  <svg viewBox="0 0 80 80" className="libro-svg">
                    <defs>
                      <linearGradient id="libroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B4513"/>
                        <stop offset="50%" stopColor="#D2691E"/>
                        <stop offset="100%" stopColor="#8B4513"/>
                      </linearGradient>
                    </defs>
                    <rect x="15" y="20" width="50" height="40" rx="2" fill="url(#libroGrad)" className="libro-tapa"/>
                    <rect x="18" y="23" width="44" height="34" fill="#FFF8DC" className="libro-paginas"/>
                    <line x1="40" y1="23" x2="40" y2="57" stroke="#D2B48C" strokeWidth="1" className="libro-lomo"/>
                    <g className="libro-lineas">
                      <line x1="22" y1="30" x2="36" y2="30" stroke="#8B4513" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="22" y1="35" x2="34" y2="35" stroke="#8B4513" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="22" y1="40" x2="36" y2="40" stroke="#8B4513" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="44" y1="30" x2="58" y2="30" stroke="#8B4513" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="44" y1="35" x2="56" y2="35" stroke="#8B4513" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="44" y1="40" x2="58" y2="40" stroke="#8B4513" strokeWidth="0.5" opacity="0.5"/>
                    </g>
                    <g className="libro-glow">
                      <circle cx="40" cy="40" r="3" fill="#e67e22" className="glow-center"/>
                      <circle cx="35" cy="48" r="1.5" fill="#d4af37" className="glow-p1"/>
                      <circle cx="45" cy="48" r="1.5" fill="#d4af37" className="glow-p2"/>
                    </g>
                  </svg>
                </div>
              </div>

              <div className="seccion-narrativa">
                <div className="story-scene scene-1">
                  <p className="scene-visual">
                    Hay cosas que no se enseñan. Se transmiten.
                  </p>
                  <p>
                    Durante años guardamos el conocimiento en cuadernos,
                    servilletas, audios de WhatsApp a las 3 de la mañana.
                    Fragmentos de algo más grande que todavía no tenía forma.
                  </p>
                </div>

                <div className="story-scene scene-2">
                  <p>
                    Ahora lo estamos ordenando. Rituales que funcionan.
                    Formas de conectar que no vas a encontrar en Google.
                    Lo que aprendimos en años de trabajar con guardianes
                    — y lo que ellos nos enseñaron a nosotros.
                  </p>
                </div>

                <div className="story-reveal">
                  <div className="reveal-line"></div>
                  <p className="reveal-text">
                    La biblioteca está en construcción.<br/>
                    <em>Algunas cosas llevan tiempo.</em>
                  </p>
                  <div className="reveal-line"></div>
                </div>

                <div className="story-scene scene-final">
                  <p className="scene-direct">
                    Cuando esté lista, vas a ser de las primeras en saberlo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {tab === 'lecturas' && (
        <div className="cana-content">
          {lecturas.length > 0 ? (
            <div className="lecturas-list">{lecturas.map((l,i) => <div key={i} className="lectura-item"><span className="lec-fecha">{l.fecha}</span><h4>{l.tipo}</h4><p>{l.resumen || l.contenido?.substring(0, 200)}...</p><button className="btn-sec">Ver completa</button></div>)}</div>
          ) : (
            <div className="seccion-cinematica seccion-lecturas">
              <div className="seccion-simbolo">
                <div className="anim-cartas">
                  <svg viewBox="0 0 80 80" className="cartas-svg">
                    <defs>
                      <linearGradient id="cartaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a1a2e"/>
                        <stop offset="100%" stopColor="#16213e"/>
                      </linearGradient>
                      <linearGradient id="cartaGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0f3460"/>
                        <stop offset="100%" stopColor="#16213e"/>
                      </linearGradient>
                    </defs>
                    <g className="carta carta-3" transform="rotate(15, 40, 45)">
                      <rect x="25" y="15" width="30" height="45" rx="3" fill="url(#cartaGrad1)" stroke="#3498db" strokeWidth="0.5"/>
                      <circle cx="40" cy="37" r="8" fill="none" stroke="#3498db" strokeWidth="0.5" opacity="0.5"/>
                    </g>
                    <g className="carta carta-2" transform="rotate(-10, 40, 45)">
                      <rect x="25" y="15" width="30" height="45" rx="3" fill="url(#cartaGrad2)" stroke="#9b59b6" strokeWidth="0.5"/>
                      <polygon points="40,25 44,35 40,32 36,35" fill="#9b59b6" opacity="0.6"/>
                    </g>
                    <g className="carta carta-1">
                      <rect x="25" y="15" width="30" height="45" rx="3" fill="#1a1a2e" stroke="#d4af37" strokeWidth="1"/>
                      <circle cx="40" cy="37" r="6" fill="none" stroke="#d4af37" strokeWidth="1"/>
                      <circle cx="40" cy="37" r="2" fill="#d4af37" className="carta-centro"/>
                    </g>
                    <g className="cartas-estrellas">
                      <circle cx="30" cy="12" r="1" fill="#fff" className="estrella e1"/>
                      <circle cx="50" cy="10" r="1.5" fill="#d4af37" className="estrella e2"/>
                      <circle cx="60" cy="20" r="1" fill="#3498db" className="estrella e3"/>
                    </g>
                  </svg>
                </div>
              </div>

              <div className="seccion-narrativa">
                <div className="story-scene scene-1">
                  <p className="scene-visual">
                    A veces necesitás que alguien te diga lo que ya sabés.
                  </p>
                  <p>
                    No porque no lo sepas. Sino porque escucharlo de afuera
                    lo vuelve real. Le da permiso de existir.
                  </p>
                </div>

                <div className="story-scene scene-2">
                  <p>
                    Las lecturas no predicen el futuro — revelan el presente.
                    Eso que sentís pero no nombrás. Eso que intuís pero dudás.
                    Eso que necesitás escuchar para finalmente actuar.
                  </p>
                </div>

                <div className="story-reveal">
                  <div className="reveal-line"></div>
                  <p className="reveal-text">
                    Tu archivo está vacío.<br/>
                    <em>Cada lectura que hagas quedará guardada acá.</em>
                  </p>
                  <div className="reveal-line"></div>
                </div>

                <div className="story-scene scene-final">
                  <p className="scene-direct">
                    Para volver a leerla cuando la necesites. Porque siempre se necesita.
                  </p>
                </div>
              </div>

              <a href={`${WORDPRESS_URL}/categoria-producto/lecturas/`} className="seccion-cta">
                <span>Pedir una lectura</span>
                <span className="cta-arrow">→</span>
              </a>
            </div>
          )}
        </div>
      )}
      
      {tab === 'regalosH' && (
        <div className="cana-content">
          {regalosHechos.length > 0 ? (
            <div className="items-grid">{regalosHechos.map((r,i) => <div key={i} className="item-card"><h4>{r.tipo}</h4><small>Para: {r.para} • {r.fecha}</small></div>)}</div>
          ) : (
            <div className="seccion-cinematica seccion-regalos-h">
              <div className="seccion-simbolo">
                <div className="anim-regalo">
                  <svg viewBox="0 0 80 80" className="regalo-svg">
                    <defs>
                      <linearGradient id="regaloGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e91e63"/>
                        <stop offset="100%" stopColor="#c2185b"/>
                      </linearGradient>
                    </defs>
                    <rect x="20" y="35" width="40" height="30" rx="3" fill="url(#regaloGrad)" className="regalo-caja"/>
                    <rect x="20" y="30" width="40" height="8" rx="2" fill="#ad1457" className="regalo-tapa"/>
                    <rect x="37" y="30" width="6" height="35" fill="#d4af37" className="regalo-cinta-v"/>
                    <rect x="20" y="32" width="40" height="4" fill="#d4af37" className="regalo-cinta-h"/>
                    <g className="regalo-lazo">
                      <ellipse cx="33" cy="26" rx="6" ry="8" fill="#d4af37" transform="rotate(-30, 33, 26)"/>
                      <ellipse cx="47" cy="26" rx="6" ry="8" fill="#d4af37" transform="rotate(30, 47, 26)"/>
                      <circle cx="40" cy="28" r="4" fill="#b8962e"/>
                    </g>
                    <g className="regalo-hearts">
                      <path d="M15 20 C15 15, 20 15, 20 18 C20 15, 25 15, 25 20 C25 25, 20 28, 20 28 C20 28, 15 25, 15 20" fill="#ff6b9d" className="mini-heart h1"/>
                      <path d="M55 15 C55 12, 58 12, 58 14 C58 12, 61 12, 61 15 C61 18, 58 20, 58 20 C58 20, 55 18, 55 15" fill="#ff6b9d" className="mini-heart h2"/>
                      <path d="M62 35 C62 32, 65 32, 65 34 C65 32, 68 32, 68 35 C68 38, 65 40, 65 40 C65 40, 62 38, 62 35" fill="#ff6b9d" className="mini-heart h3"/>
                    </g>
                  </svg>
                </div>
              </div>

              <div className="seccion-narrativa">
                <div className="story-scene scene-1">
                  <p className="scene-visual">
                    Regalar magia es regalar una decisión.
                  </p>
                  <p>
                    Un guardián, una lectura, un talismán, una runa. No importa qué.
                    Es decirle a alguien: <em>"Vi esto y pensé en vos.
                    En lo que necesitás. En lo que merecés."</em>
                  </p>
                </div>

                <div className="story-scene scene-2">
                  <p>
                    Hay regalos que se usan y se olvidan. Y hay regalos que
                    se quedan para siempre, recordándole a esa persona
                    que alguien la vio. Que alguien pensó en ella.
                  </p>
                </div>

                <div className="story-reveal">
                  <div className="reveal-line"></div>
                  <p className="reveal-text">
                    Todavía no regalaste nada.<br/>
                    <em>Pero ya sabés a quién se lo darías.</em>
                  </p>
                  <div className="reveal-line"></div>
                </div>

                <div className="story-scene scene-final">
                  <p className="scene-direct">
                    Cada regalo que hagas queda registrado acá. Tu rastro de magia compartida.
                  </p>
                </div>
              </div>

              <a href={`${WORDPRESS_URL}/tienda/`} className="seccion-cta">
                <span>Elegir un regalo</span>
                <span className="cta-arrow">→</span>
              </a>
            </div>
          )}
        </div>
      )}
      
      {tab === 'regalosR' && (
        <div className="cana-content">
          {regalosRecibidos.length > 0 ? (
            <div className="items-grid">{regalosRecibidos.map((r,i) => <div key={i} className="item-card"><h4>{r.tipo}</h4><small>De: {r.de} • {r.fecha}</small></div>)}</div>
          ) : (
            <div className="seccion-cinematica seccion-regalos-r">
              <div className="seccion-simbolo">
                <div className="anim-recibir">
                  <svg viewBox="0 0 80 80" className="recibir-svg">
                    <defs>
                      <linearGradient id="recibirGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2ecc71"/>
                        <stop offset="100%" stopColor="#27ae60"/>
                      </linearGradient>
                    </defs>
                    <g className="manos">
                      <path d="M20 55 Q25 45, 35 50 L35 60 Q25 65, 20 55" fill="#deb887" className="mano-izq"/>
                      <path d="M60 55 Q55 45, 45 50 L45 60 Q55 65, 60 55" fill="#deb887" className="mano-der"/>
                    </g>
                    <circle cx="40" cy="40" r="15" fill="url(#recibirGrad)" className="esfera-regalo"/>
                    <circle cx="40" cy="40" r="10" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.5"/>
                    <circle cx="40" cy="40" r="5" fill="#fff" opacity="0.3"/>
                    <g className="recibir-sparkles">
                      <polygon points="40,15 42,20 47,20 43,24 45,29 40,26 35,29 37,24 33,20 38,20" fill="#d4af37" className="star-main"/>
                      <circle cx="25" cy="30" r="2" fill="#2ecc71" className="spark s1"/>
                      <circle cx="55" cy="30" r="2" fill="#2ecc71" className="spark s2"/>
                      <circle cx="30" cy="20" r="1.5" fill="#fff" className="spark s3"/>
                      <circle cx="50" cy="22" r="1.5" fill="#fff" className="spark s4"/>
                      <circle cx="20" cy="40" r="1" fill="#d4af37" className="spark s5"/>
                      <circle cx="60" cy="38" r="1" fill="#d4af37" className="spark s6"/>
                    </g>
                  </svg>
                </div>
              </div>

              <div className="seccion-narrativa">
                <div className="story-scene scene-1">
                  <p className="scene-visual">
                    Recibir es más difícil que dar.
                  </p>
                  <p>
                    Requiere aceptar que alguien pensó en vos. Que dedicó tiempo
                    a elegir algo que te represente. Que se animó a decirte,
                    sin palabras: <em>"Te veo. Me importás."</em>
                  </p>
                </div>

                <div className="story-scene scene-2">
                  <p>
                    Cuando alguien te regala algo de acá — un guardián, una lectura,
                    un talismán — está regalándote una pieza de su mundo interior.
                    Algo que eligió para vos.
                  </p>
                </div>

                <div className="story-reveal">
                  <div className="reveal-line"></div>
                  <p className="reveal-text">
                    Nadie te regaló nada todavía.<br/>
                    <em>¿Ya compartiste tu lista de deseos?</em>
                  </p>
                  <div className="reveal-line"></div>
                </div>

                <div className="story-scene scene-final">
                  <p className="scene-direct">
                    A veces solo hace falta que alguien sepa qué deseás.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROMOCIONES MÁGICAS
// ═══════════════════════════════════════════════════════════════

function PromocionesMagicas({ usuario, ir }) {
  const [promociones, setPromociones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cuentasRegresivas, setCuentasRegresivas] = useState({});

  useEffect(() => {
    cargarPromociones();
  }, []);

  // Actualizar cuentas regresivas cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const nuevas = {};
      promociones.forEach(promo => {
        if (promo.cuentaRegresiva) {
          nuevas[promo.id] = promo.cuentaRegresiva;
        }
      });
      setCuentasRegresivas(nuevas);
    }, 60000);
    return () => clearInterval(interval);
  }, [promociones]);

  const cargarPromociones = async () => {
    try {
      const email = usuario?.email || '';
      const res = await fetch(`${API_BASE}/api/mi-magia/promociones?ubicacion=mi-magia-promos&email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        setPromociones(data.promociones || []);
        // Registrar vistas
        data.promociones?.forEach(p => {
          if (p.origen === 'crud') {
            fetch(`${API_BASE}/api/admin/promociones/crud`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accion: 'registrar-vista', id: p.id })
            }).catch(() => {});
          }
        });
      }
    } catch(e) {
      console.error('Error cargando promociones:', e);
    }
    setCargando(false);
  };

  const registrarClick = (promoId) => {
    fetch(`${API_BASE}/api/admin/promociones/crud`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'registrar-click', id: promoId })
    }).catch(() => {});
  };

  // Promociones predefinidas si no hay en la API
  const promosPredefinidas = [
    {
      id: 'circulo-prueba',
      titulo: 'Círculo de Duendes',
      subtitulo: '15 días GRATIS',
      descripcion: 'Tu santuario secreto con beneficios exclusivos: contenido semanal, descuentos permanentes, comunidad privada y lecturas mensuales.',
      beneficios: ['Contenido semanal exclusivo', 'Descuentos permanentes del 15%', 'Lecturas mensuales personalizadas', 'Comunidad privada'],
      icono: '★',
      color: '#d4af37',
      activa: !usuario?.esCirculo,
      accion: () => ir('circulo'),
      textoBoton: 'Probar gratis 15 días'
    },
    {
      id: 'runas-especial',
      titulo: 'Pack de Runas Resplandor',
      subtitulo: '350 runas = mejor valor',
      descripcion: 'El pack más conveniente. 350 runas para múltiples experiencias mágicas: tiradas, oráculos, lecturas del alma y más.',
      beneficios: ['350 runas de poder', 'El mejor precio por runa', 'Para 15-50 experiencias', 'No vencen nunca'],
      icono: 'ᚱ',
      color: '#7B1FA2',
      activa: true,
      url: `${WORDPRESS_URL}/producto/runas-resplandor/`,
      textoBoton: 'Obtener $32 USD'
    }
  ];

  const promosActivas = promociones.length > 0 ? promociones : promosPredefinidas.filter(p => p.activa);

  // Función para obtener el color de fondo seguro
  const getPromoColor = (promo) => {
    if (promo.colores?.textoTitulo) return promo.colores.textoTitulo;
    if (promo.color) return promo.color;
    return '#d4af37';
  };

  // Función para formatear cuenta regresiva
  const formatCuentaRegresiva = (cr) => {
    if (!cr) return null;
    const parts = [];
    if (cr.dias > 0) parts.push(`${cr.dias}d`);
    if (cr.horas > 0) parts.push(`${cr.horas}h`);
    if (cr.minutos > 0 || parts.length === 0) parts.push(`${cr.minutos}m`);
    return parts.join(' ');
  };

  return (
    <div className="sec">
      <div className="sec-head">
        <h1>Promociones Mágicas</h1>
        <p>Ofertas especiales y oportunidades exclusivas para ti.</p>
      </div>

      {cargando ? (
        <div style={{textAlign:'center', padding:'3rem'}}>
          <div style={{fontSize:'2rem', animation:'pulse 1.5s infinite'}}>✦</div>
          <p>Cargando promociones...</p>
        </div>
      ) : promosActivas.length > 0 ? (
        <div className="promos-grid">
          {promosActivas.map(promo => {
            const promoColor = getPromoColor(promo);
            const esNuevoSistema = promo.origen === 'crud';
            const fondoStyle = esNuevoSistema && promo.colores?.fondo
              ? { background: promo.colores.fondo }
              : {};

            return (
              <div
                key={promo.id}
                className={`promo-card ${esNuevoSistema ? 'promo-card-nuevo' : ''}`}
                style={{
                  '--promo-color': promoColor,
                  ...fondoStyle
                }}
              >
                {/* Cuenta regresiva */}
                {promo.cuentaRegresiva && (
                  <div className="promo-countdown">
                    ⏰ Termina en: {formatCuentaRegresiva(promo.cuentaRegresiva)}
                  </div>
                )}

                <div className="promo-header">
                  <span className="promo-icono">{promo.icono}</span>
                  <div className="promo-badge-card" style={esNuevoSistema ? {
                    background: promo.colores?.botonFondo || promoColor,
                    color: promo.colores?.botonTexto || '#fff'
                  } : {}}>
                    {promo.subtitulo}
                  </div>
                </div>

                <h3 style={esNuevoSistema && promo.colores?.textoTitulo ? { color: promo.colores.textoTitulo } : {}}>
                  {promo.titulo}
                </h3>

                {promo.descripcion && (
                  <p className="promo-desc" style={esNuevoSistema && promo.colores?.textoSub ? { color: promo.colores.textoSub } : {}}>
                    {promo.descripcion}
                  </p>
                )}

                {promo.beneficios && promo.beneficios.length > 0 && (
                  <ul className="promo-beneficios-list">
                    {promo.beneficios.map((b, i) => (
                      <li key={i}>✓ {b}</li>
                    ))}
                  </ul>
                )}

                {promo.url ? (
                  <a
                    href={promo.url}
                    target={promo.url.startsWith('/') ? '_self' : '_blank'}
                    rel="noopener"
                    className="btn-promo"
                    onClick={() => registrarClick(promo.id)}
                    style={esNuevoSistema ? {
                      background: promo.colores?.botonFondo || promoColor,
                      color: promo.colores?.botonTexto || '#1a1a1a',
                      border: promo.colores?.botonBorde ? `2px solid ${promo.colores.botonBorde}` : 'none'
                    } : {}}
                  >
                    {promo.textoBoton || 'Obtener'}
                  </a>
                ) : promo.accion ? (
                  <button
                    onClick={() => { registrarClick(promo.id); promo.accion(); }}
                    className="btn-promo"
                    style={esNuevoSistema ? {
                      background: promo.colores?.botonFondo || promoColor,
                      color: promo.colores?.botonTexto || '#1a1a1a'
                    } : {}}
                  >
                    {promo.textoBoton || 'Ver más'}
                  </button>
                ) : null}

                {/* Efectos sparkles */}
                {promo.efectos?.sparkles && (
                  <div className="promo-sparkles"></div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-promos">
          <span>🎁</span>
          <h3>Sin promociones activas ahora</h3>
          <p>Volvé pronto para ver las nuevas ofertas mágicas que preparamos para vos.</p>
        </div>
      )}

      {/* Info adicional */}
      <div className="promo-info-box">
        <h4>¿Cómo funcionan las promociones?</h4>
        <p>Las promociones mágicas son ofertas especiales y temporales que preparamos para vos. Pueden incluir descuentos, beneficios exclusivos, o acceso a servicios especiales. ¡Revisá esta sección seguido!</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// JARDÍN MÁGICO (canjes funcionales + packs runas)
// ═══════════════════════════════════════════════════════════════

function Jardin({ usuario, setUsuario, pais, token }) {
  const [canjeando, setCanjeando] = useState(null);
  const [msg, setMsg] = useState(null);
  const esUY = pais === 'UY';
  
  const canjear = async (canje) => {
    if ((usuario?.treboles || 0) < canje.treboles) return;
    setCanjeando(canje.id); setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/mi-magia/canjear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario.email, canjeId: canje.id })
      });
      const data = await res.json();
      if (data.success) {
        setUsuario({ ...usuario, treboles: (usuario.treboles || 0) - canje.treboles });
        if (data.cupon) {
          setMsg({ t: 'ok', m: `¡Canjeado! Tu cupón: ${data.cupon}. Te llegará por email también.` });
        } else {
          setMsg({ t: 'ok', m: '¡Canjeado! Nos pondremos en contacto para coordinar.' });
        }
      } else {
        setMsg({ t: 'error', m: data.error || 'Error al canjear' });
      }
    } catch(e) {
      setMsg({ t: 'error', m: 'Error de conexión' });
    }
    setCanjeando(null);
  };
  
  return (
    <div className="sec">
      <div className="sec-head"><h1>Jardín de Tréboles</h1><p>Tu riqueza en el mundo elemental.</p></div>
      
      <div className="balances">
        <div className="bal-card">
          <span className="bal-icon">☘</span>
          <div className="bal-info">
            <div className="bal-num">{usuario?.treboles || 0}</div>
            <div className="bal-label">Tréboles</div>
          </div>
        </div>
        <div className="bal-card">
          <span className="bal-icon">ᚱ</span>
          <div className="bal-info">
            <div className="bal-num">{usuario?.runas || 0}</div>
            <div className="bal-label">Runas de Poder</div>
          </div>
        </div>
      </div>
      
      <div className="explicacion-box">
        <h3>☘ ¿Cómo funcionan los Tréboles?</h3>
        <p><strong>{esUY ? '$400 UYU' : '$10 USD'} = 1 trébol.</strong> Se ganan automáticamente con cada compra.</p>
        <p>Canjealos por descuentos, envíos gratis, productos y hasta lecturas. Son tu recompensa por ser parte de la tribu.</p>
      </div>
      
      {msg && <div className={`msg ${msg.t}`}>{msg.m}</div>}
      
      <h2 className="sec-titulo">Canjeá tus Tréboles</h2>
      <div className="canjes-grid">
        {CANJES.map(c => {
          const disponible = (usuario?.treboles || 0) >= c.treboles;
          const esteCanjeando = canjeando === c.id;
          return (
            <div key={c.id} className={`canje-card ${disponible ? '' : 'bloq'}`}>
              <div className="canje-cost">☘ {c.treboles}</div>
              <h4>{c.nombre}</h4>
              <p>{c.desc}</p>
              <button 
                className="btn-canjear" 
                disabled={!disponible || esteCanjeando}
                onClick={() => canjear(c)}
              >
                {esteCanjeando ? 'Canjeando...' : disponible ? 'Canjear' : `Necesitás ${c.treboles}`}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="explicacion-box">
        <h3>ᚱ ¿Cómo funcionan las Runas de Poder?</h3>
        <p>Las Runas son tu moneda para las <strong>experiencias mágicas</strong>: tiradas, lecturas del alma, registros akáshicos y más.</p>
        <p>Podés comprarlas en packs, o ganarlas uniéndote al Círculo (recibís 50 de regalo + beneficios mensuales).</p>
      </div>
      
      <h2 className="sec-titulo">Packs de Runas</h2>
      <div className="packs-grid">
        {PACKS_RUNAS.map(p => (
          <div key={p.nombre} className="pack-card">
            <div className="pack-runas">{p.runas} ᚱ</div>
            <h4>{p.nombre}</h4>
            <p>{p.desc}</p>
            <div className="pack-precio">${p.precio} USD</div>
            <a href={p.url} target="_blank" rel="noopener" className="btn-gold-sm">Comprar ↗</a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPERIENCIAS (con intro humana completa)
// ═══════════════════════════════════════════════════════════════

function SeccionExperiencias({ usuario, setUsuario }) {
  const [selExp, setSelExp] = useState(null);
  const [vista, setVista] = useState('info'); // 'info' o 'form'
  const [form, setForm] = useState({});
  const [esRegalo, setEsRegalo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState(null);
  
  const solicitar = async () => {
    if ((usuario?.runas || 0) < selExp.runas) { setMsg({ t: 'error', m: `Necesitás ${selExp.runas} Runas.` }); return; }
    setEnviando(true); setMsg(null);
    try {
      const payload = esRegalo 
        ? { emailRegalo: form.email_regalo, nombreRegalo: form.nombre_regalo, mensajeRegalo: form.mensaje_regalo, tipo: selExp.id, emailComprador: usuario.email, esRegalo: true }
        : { email: usuario.email, tipo: selExp.id, datos: form, esRegalo: false };
      
      const res = await fetch(`${API_BASE}/api/experiencias/solicitar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { 
        setMsg({ t: 'ok', m: esRegalo ? '¡Regalo enviado! La persona recibirá acceso por email.' : '¡Solicitada! Recibirás tu lectura por email.' }); 
        setUsuario({ ...usuario, runas: (usuario.runas || 0) - selExp.runas }); 
        setTimeout(() => { setSelExp(null); setVista('info'); setForm({}); setEsRegalo(false); setMsg(null); }, 3000);
      } else { setMsg({ t: 'error', m: data.error || 'Error' }); }
    } catch(e) { setMsg({ t: 'error', m: 'Error de conexión' }); }
    setEnviando(false);
  };
  
  if (selExp) {
    return (
      <div className="sec">
        <button className="btn-back" onClick={() => { setSelExp(null); setVista('info'); setForm({}); }}>← Volver a experiencias</button>
        
        {vista === 'info' && (
          <div className="exp-detalle">
            <div className="exp-d-header">
              <span className="exp-d-icon">{selExp.icono}</span>
              <h1>{selExp.nombre}</h1>
              <div className="exp-d-meta"><span>⏱ {selExp.tiempo}</span><span>ᚱ {selExp.runas} runas</span></div>
            </div>
            
            <div className="exp-d-intro">
              {selExp.intro.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
            
            <div className="exp-d-section">
              <h3>¿Qué vas a recibir?</h3>
              <ul>{selExp.queRecibis.map((q, i) => <li key={i}>{q}</li>)}</ul>
            </div>
            
            <div className="exp-d-section">
              <h3>¿Para quién es?</h3>
              <p>{selExp.paraQuien}</p>
            </div>
            
            <div className="exp-d-cta">
              <div className="exp-d-cost"><span>Costo:</span><strong>{selExp.runas} ᚱ</strong><small>Tenés {usuario?.runas || 0}</small></div>
              <button className="btn-gold btn-lg" onClick={() => setVista('form')} disabled={(usuario?.runas || 0) < selExp.runas}>
                {(usuario?.runas || 0) >= selExp.runas ? 'Continuar →' : `Necesitás ${selExp.runas} Runas`}
              </button>
            </div>
          </div>
        )}
        
        {vista === 'form' && (
          <div className="exp-form">
            <h2>{selExp.nombre}</h2>
            
            <div className="regalo-toggle">
              <label><input type="checkbox" checked={esRegalo} onChange={e => setEsRegalo(e.target.checked)} /> <span>🎁 Es un regalo para otra persona</span></label>
            </div>
            
            {esRegalo ? (
              <div className="form-campos">
                <p className="form-note">La persona recibirá un email con acceso a Mi Magia donde completará sus propios datos y recibirá la lectura personalizada.</p>
                <div className="campo"><label>Email de quien recibe *</label><input type="email" value={form.email_regalo || ''} onChange={e => setForm({...form, email_regalo: e.target.value})} placeholder="email@ejemplo.com" /></div>
                <div className="campo"><label>Nombre</label><input type="text" value={form.nombre_regalo || ''} onChange={e => setForm({...form, nombre_regalo: e.target.value})} placeholder="Para personalizar" /></div>
                <div className="campo"><label>Tu mensaje (opcional)</label><textarea value={form.mensaje_regalo || ''} onChange={e => setForm({...form, mensaje_regalo: e.target.value})} placeholder="Un mensaje personal..." rows={3} /></div>
              </div>
            ) : (
              <div className="form-campos">
                <p className="form-note">Completá lo que puedas. Cuanta más información nos des, más personalizada será tu lectura.</p>
                {selExp.campos.includes('pregunta') && <div className="campo"><label>Tu pregunta o tema *</label><textarea value={form.pregunta || ''} onChange={e => setForm({...form, pregunta: e.target.value})} placeholder="¿Qué querés saber o trabajar?" rows={3} /></div>}
                {selExp.campos.includes('contexto') && <div className="campo"><label>Contexto</label><textarea value={form.contexto || ''} onChange={e => setForm({...form, contexto: e.target.value})} placeholder="¿Qué está pasando en tu vida relacionado a esto?" rows={3} /></div>}
                {selExp.campos.includes('guardianes_interes') && <div className="campo"><label>¿Qué guardianes te llaman? *</label><textarea value={form.guardianes_interes || ''} onChange={e => setForm({...form, guardianes_interes: e.target.value})} placeholder="Describí los que te atraen: pueden ser por nombre, por tipo (protección, abundancia), o por algo que notaste..." rows={3} /></div>}
                {selExp.campos.includes('situacion') && <div className="campo"><label>Tu situación actual</label><textarea value={form.situacion || ''} onChange={e => setForm({...form, situacion: e.target.value})} placeholder="¿Qué momento de vida atravesás?" rows={2} /></div>}
                {selExp.campos.includes('que_buscas') && <div className="campo"><label>¿Qué buscás?</label><input type="text" value={form.que_buscas || ''} onChange={e => setForm({...form, que_buscas: e.target.value})} placeholder="Protección, abundancia, amor, claridad..." /></div>}
                {selExp.campos.includes('fecha_nacimiento') && <div className="campo"><label>Fecha de nacimiento *</label><input type="date" value={form.fecha_nacimiento || ''} onChange={e => setForm({...form, fecha_nacimiento: e.target.value})} /></div>}
                {selExp.campos.includes('hora_nacimiento') && <div className="campo"><label>Hora de nacimiento (si la sabés)</label><input type="time" value={form.hora_nacimiento || ''} onChange={e => setForm({...form, hora_nacimiento: e.target.value})} /></div>}
                {selExp.campos.includes('lugar_nacimiento') && <div className="campo"><label>Lugar de nacimiento</label><input type="text" value={form.lugar_nacimiento || ''} onChange={e => setForm({...form, lugar_nacimiento: e.target.value})} placeholder="Ciudad, país" /></div>}
                {selExp.campos.includes('nombre_completo') && <div className="campo"><label>Nombre completo</label><input type="text" value={form.nombre_completo || ''} onChange={e => setForm({...form, nombre_completo: e.target.value})} /></div>}
                {selExp.campos.includes('patrones_repetitivos') && <div className="campo"><label>Patrones que se repiten en tu vida</label><textarea value={form.patrones_repetitivos || ''} onChange={e => setForm({...form, patrones_repetitivos: e.target.value})} placeholder="Situaciones, relaciones, problemas que aparecen una y otra vez..." rows={2} /></div>}
                {selExp.campos.includes('miedos_inexplicables') && <div className="campo"><label>Miedos inexplicables</label><textarea value={form.miedos_inexplicables || ''} onChange={e => setForm({...form, miedos_inexplicables: e.target.value})} placeholder="Miedos que tenés desde siempre sin saber por qué..." rows={2} /></div>}
                {selExp.campos.includes('atracciones_epocas') && <div className="campo"><label>Épocas o culturas que te atraen</label><input type="text" value={form.atracciones_epocas || ''} onChange={e => setForm({...form, atracciones_epocas: e.target.value})} placeholder="Egipto, medieval, celta, oriental..." /></div>}
                {selExp.campos.includes('nombre_ancestro') && <div className="campo"><label>¿A quién querés contactar?</label><input type="text" value={form.nombre_ancestro || ''} onChange={e => setForm({...form, nombre_ancestro: e.target.value})} placeholder="Nombre del ancestro o 'mis ancestros en general'" /></div>}
                {selExp.campos.includes('nacionalidades') && <div className="campo"><label>Nacionalidades de tu familia</label><input type="text" value={form.nacionalidades || ''} onChange={e => setForm({...form, nacionalidades: e.target.value})} placeholder="Española, italiana, uruguaya..." /></div>}
                {selExp.campos.includes('patrones_familia') && <div className="campo"><label>Patrones familiares que notás</label><textarea value={form.patrones_familia || ''} onChange={e => setForm({...form, patrones_familia: e.target.value})} placeholder="Enfermedades, separaciones, temas de dinero..." rows={2} /></div>}
                {selExp.campos.includes('sintomas_fisicos') && <div className="campo"><label>Síntomas físicos</label><textarea value={form.sintomas_fisicos || ''} onChange={e => setForm({...form, sintomas_fisicos: e.target.value})} placeholder="Cansancio, dolores, tensiones..." rows={2} /></div>}
                {selExp.campos.includes('sintomas_emocionales') && <div className="campo"><label>Síntomas emocionales</label><textarea value={form.sintomas_emocionales || ''} onChange={e => setForm({...form, sintomas_emocionales: e.target.value})} placeholder="Ansiedad, tristeza, bloqueos..." rows={2} /></div>}
                {selExp.campos.includes('areas_bloqueadas') && <div className="campo"><label>Áreas que sentís bloqueadas</label><input type="text" value={form.areas_bloqueadas || ''} onChange={e => setForm({...form, areas_bloqueadas: e.target.value})} placeholder="Amor, dinero, creatividad..." /></div>}
                {selExp.campos.includes('opciones') && <div className="campo"><label>Opciones que estás considerando</label><textarea value={form.opciones || ''} onChange={e => setForm({...form, opciones: e.target.value})} placeholder="Si tenés opciones concretas, contanos cuáles..." rows={2} /></div>}
                {selExp.campos.includes('deadline') && <div className="campo"><label>¿Hay una fecha límite?</label><input type="text" value={form.deadline || ''} onChange={e => setForm({...form, deadline: e.target.value})} placeholder="Ej: tengo que decidir antes del viernes" /></div>}
                {selExp.campos.includes('mes') && <div className="campo"><label>Mes a consultar</label><select value={form.mes || ''} onChange={e => setForm({...form, mes: e.target.value})}><option value="">Elegí</option><option value="proximo">Próximo mes</option><option value="actual">Este mes</option></select></div>}
                {selExp.campos.includes('area_principal') && <div className="campo"><label>Área principal de enfoque</label><select value={form.area_principal || ''} onChange={e => setForm({...form, area_principal: e.target.value})}><option value="">Elegí</option><option value="amor">Amor</option><option value="trabajo">Trabajo/Dinero</option><option value="salud">Salud</option><option value="espiritualidad">Espiritualidad</option><option value="general">Visión general</option></select></div>}
              </div>
            )}
            
            {msg && <div className={`msg ${msg.t}`}>{msg.m}</div>}
            
            <div className="form-actions">
              <button className="btn-sec" onClick={() => setVista('info')}>← Volver</button>
              <button className="btn-gold" onClick={solicitar} disabled={enviando}>{enviando ? 'Enviando...' : esRegalo ? 'Enviar Regalo' : 'Solicitar Lectura'}</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="sec">
      <div className="sec-head">
        <h1>Experiencias Mágicas</h1>
        <p>Lecturas personalizadas, mensajes canalizados, guías para tu camino. Cada experiencia queda guardada en tu grimorio para siempre.</p>
      </div>
      
      <div className="runas-header">
        <div className="runas-balance"><span>ᚱ</span><strong>{usuario?.runas || 0}</strong><small>disponibles</small></div>
        <a href={`${WORDPRESS_URL}/producto-categoria/runas/`} target="_blank" rel="noopener" className="btn-gold-sm">Obtener más ↗</a>
      </div>
      
      <div className="exp-grid">
        {EXPERIENCIAS.map(exp => {
          const disponible = (usuario?.runas || 0) >= exp.runas;
          return (
            <div key={exp.id} className={`exp-card ${disponible ? '' : 'bloq'}`} onClick={() => setSelExp(exp)}>
              <div className="exp-card-head"><span className="exp-icon">{exp.icono}</span><span className="exp-runas">{exp.runas} ᚱ</span></div>
              <h3>{exp.nombre}</h3>
              <p className="exp-tiempo">⏱ {exp.tiempo}</p>
              <p className="exp-desc">{exp.intro.substring(0, 120)}...</p>
              <button className="btn-ver">Ver más →</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REGALOS (COMPLETO CON FLUJO DE REGALO DE LECTURAS)
// ═══════════════════════════════════════════════════════════════

const LECTURAS_REGALABLES = [
  // Temática Duendes - Básicas
  { id: 'consejo_bosque', nombre: 'Consejo del Bosque', runas: 15, icono: '🌲', descripcion: 'Mensaje breve del bosque', categoria: 'duendes' },
  { id: 'energia_dia', nombre: 'Energía del Día', runas: 15, icono: '☀️', descripcion: 'Qué energía te rodea hoy', categoria: 'duendes' },
  { id: 'susurro_guardian', nombre: 'Susurro del Guardián', runas: 20, icono: '👂', descripcion: 'Un guardián te susurra un mensaje', categoria: 'duendes' },
  { id: 'mensaje_hogar_protegido', nombre: 'Mensaje del Hogar', runas: 25, icono: '🏠', descripcion: 'Tu guardián habla sobre tu hogar', categoria: 'duendes' },
  { id: 'cuatro_elementales', nombre: 'Los 4 Elementales', runas: 50, icono: '🌍', descripcion: 'Tierra, Agua, Fuego y Aire te hablan', categoria: 'duendes' },

  // Tiradas Clásicas
  { id: 'tirada_3_runas', nombre: 'Tirada de 3 Runas', runas: 25, icono: 'ᚱ', descripcion: 'Pasado, Presente y Futuro', categoria: 'clasicas' },
  { id: 'tirada_5_runas', nombre: 'Tirada de 5 Runas', runas: 40, icono: 'ᚱᛏ', descripcion: 'Situación completa con consejo', categoria: 'clasicas' },
  { id: 'tarot_3_cartas', nombre: 'Tarot 3 Cartas', runas: 50, icono: '🃏', descripcion: 'Tres cartas con interpretación', categoria: 'clasicas' },
  { id: 'tarot_amor', nombre: 'Tarot del Amor', runas: 75, icono: '💕', descripcion: 'Especializado en relaciones', categoria: 'clasicas' },

  // Estudios y Rituales
  { id: 'registros_akashicos', nombre: 'Registros Akáshicos', runas: 75, icono: '📜', descripcion: 'Tu biblioteca cósmica personal', categoria: 'estudios' },
  { id: 'numerologia_personal', nombre: 'Numerología Personal', runas: 65, icono: '🔢', descripcion: 'Tu número de vida y ciclos', categoria: 'estudios' },
  { id: 'ritual_abundancia', nombre: 'Ritual de Abundancia', runas: 65, icono: '🌟', descripcion: 'Abrí los canales de prosperidad', categoria: 'rituales' },
  { id: 'limpieza_energetica', nombre: 'Limpieza Energética', runas: 45, icono: '✨', descripcion: 'Limpieza de energía y espacio', categoria: 'rituales' },

  // Premium
  { id: 'tirada_7_runas', nombre: 'Tirada de 7 Runas', runas: 100, icono: 'ᚱᛏᚠ', descripcion: 'La tirada profunda completa', categoria: 'premium' },
  { id: 'tarot_cruz_celta', nombre: 'Tarot Cruz Celta', runas: 120, icono: '🎴', descripcion: '10 cartas revelando todo', categoria: 'premium' },
  { id: 'lectura_ano_personal', nombre: 'Lectura de Año Personal', runas: 140, icono: '📅', descripcion: 'Los 12 meses que vienen', categoria: 'premium' },
  { id: 'mapa_karmico', nombre: 'Mapa Kármico', runas: 180, icono: '🔄', descripcion: 'Tus lecciones y misión', categoria: 'premium' },
  { id: 'mision_alma', nombre: 'Misión del Alma', runas: 200, icono: '🎯', descripcion: 'Para qué viniste a este mundo', categoria: 'premium' },
  { id: 'estudio_alma', nombre: 'Estudio del Alma', runas: 200, icono: '👁️', descripcion: 'Quién sos realmente, revelado', categoria: 'premium' }
];

// DEPRECATED: Usar SeccionRegalos importado
function RegalosLocal({ ir, usuario, setUsuario }) {
  const [vista, setVista] = useState('menu'); // menu, lecturas, form, enviando, exito
  const [lecturaSeleccionada, setLecturaSeleccionada] = useState(null);
  const [form, setForm] = useState({ nombreDestinatario: '', emailDestinatario: '', mensaje: '' });
  const [error, setError] = useState(null);
  const [codigoRegalo, setCodigoRegalo] = useState(null);

  const enviarRegalo = async () => {
    if (!lecturaSeleccionada || !form.emailDestinatario) {
      setError('Completá todos los campos requeridos');
      return;
    }

    if ((usuario?.runas || 0) < lecturaSeleccionada.runas) {
      setError('No tenés suficientes runas');
      return;
    }

    setVista('enviando');
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/regalos/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailRemitente: usuario.email,
          nombreRemitente: usuario.nombrePreferido || usuario.nombre,
          emailDestinatario: form.emailDestinatario,
          nombreDestinatario: form.nombreDestinatario,
          mensaje: form.mensaje,
          lecturaId: lecturaSeleccionada.id,
          lecturaNombre: lecturaSeleccionada.nombre,
          runasUsadas: lecturaSeleccionada.runas
        })
      });

      const data = await res.json();

      if (data.success) {
        setCodigoRegalo(data.codigo);
        setUsuario({ ...usuario, runas: (usuario.runas || 0) - lecturaSeleccionada.runas });
        setVista('exito');
      } else {
        setError(data.error || 'Error al enviar el regalo');
        setVista('form');
      }
    } catch (e) {
      setError('Error de conexión');
      setVista('form');
    }
  };

  const reset = () => {
    setVista('menu');
    setLecturaSeleccionada(null);
    setForm({ nombreDestinatario: '', emailDestinatario: '', mensaje: '' });
    setCodigoRegalo(null);
    setError(null);
  };

  // Vista de éxito
  if (vista === 'exito') {
    return (
      <div className="sec regalo-exito">
        <div className="exito-card">
          <span className="exito-icono">🎁</span>
          <h1>¡Regalo enviado!</h1>
          <p>{form.nombreDestinatario || 'Tu ser querido'} recibirá un email con el regalo.</p>
          <div className="codigo-box">
            <small>Código del regalo:</small>
            <strong>{codigoRegalo}</strong>
          </div>
          <p className="nota">La persona recibirá instrucciones para canjear su lectura y completar sus propios datos.</p>
          <button className="btn-gold" onClick={reset}>Volver a Regalos</button>
        </div>
      </div>
    );
  }

  // Vista enviando
  if (vista === 'enviando') {
    return (
      <div className="sec regalo-enviando">
        <div className="enviando-card">
          <div className="spinner-regalo"></div>
          <p>Preparando tu regalo mágico...</p>
        </div>
      </div>
    );
  }

  // Vista formulario
  if (vista === 'form' && lecturaSeleccionada) {
    const puedeEnviar = (usuario?.runas || 0) >= lecturaSeleccionada.runas;

    return (
      <div className="sec regalo-form-sec">
        <button className="btn-back" onClick={() => setVista('lecturas')}>← Cambiar lectura</button>

        <div className="regalo-form-card">
          <div className="lectura-seleccionada">
            <span className="lectura-icono">{lecturaSeleccionada.icono}</span>
            <div>
              <h3>{lecturaSeleccionada.nombre}</h3>
              <p>{lecturaSeleccionada.descripcion}</p>
              <span className="lectura-precio">{lecturaSeleccionada.runas} ᚱ</span>
            </div>
          </div>

          <h2>¿A quién le regalás?</h2>

          <div className="form-campos">
            <div className="campo">
              <label>Email del destinatario *</label>
              <input
                type="email"
                value={form.emailDestinatario}
                onChange={e => setForm({ ...form, emailDestinatario: e.target.value })}
                placeholder="email@ejemplo.com"
              />
            </div>
            <div className="campo">
              <label>Nombre (para personalizar)</label>
              <input
                type="text"
                value={form.nombreDestinatario}
                onChange={e => setForm({ ...form, nombreDestinatario: e.target.value })}
                placeholder="¿Cómo se llama?"
              />
            </div>
            <div className="campo">
              <label>Tu mensaje personal (opcional)</label>
              <textarea
                value={form.mensaje}
                onChange={e => setForm({ ...form, mensaje: e.target.value })}
                placeholder="Un mensaje que acompañará el regalo..."
                rows={3}
              />
            </div>
          </div>

          <div className="regalo-resumen">
            <div className="resumen-row">
              <span>Lectura:</span>
              <span>{lecturaSeleccionada.nombre}</span>
            </div>
            <div className="resumen-row">
              <span>Costo:</span>
              <span>{lecturaSeleccionada.runas} ᚱ</span>
            </div>
            <div className="resumen-row">
              <span>Tus runas:</span>
              <span className={puedeEnviar ? '' : 'insuficientes'}>{usuario?.runas || 0} ᚱ</span>
            </div>
            {!puedeEnviar && (
              <div className="resumen-alerta">
                Te faltan {lecturaSeleccionada.runas - (usuario?.runas || 0)} runas
              </div>
            )}
          </div>

          {error && <div className="error-msg">{error}</div>}

          <div className="form-actions">
            <button className="btn-sec" onClick={() => setVista('lecturas')}>Cancelar</button>
            <button
              className="btn-gold"
              onClick={enviarRegalo}
              disabled={!puedeEnviar || !form.emailDestinatario}
            >
              Enviar Regalo 🎁
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista selección de lecturas
  if (vista === 'lecturas') {
    return (
      <div className="sec regalo-lecturas">
        <button className="btn-back" onClick={() => setVista('menu')}>← Volver</button>

        <div className="sec-head">
          <h1>Elegí qué regalar</h1>
          <p>Seleccioná la lectura que querés regalar. La persona recibirá un email y completará sus propios datos.</p>
        </div>

        <div className="runas-header">
          <div className="runas-balance"><span>ᚱ</span><strong>{usuario?.runas || 0}</strong><small>disponibles</small></div>
        </div>

        <div className="lecturas-regalo-grid">
          {LECTURAS_REGALABLES.map(lectura => {
            const puedeRegalar = (usuario?.runas || 0) >= lectura.runas;
            return (
              <div
                key={lectura.id}
                className={`lectura-regalo-card ${puedeRegalar ? '' : 'bloqueada'}`}
                onClick={() => {
                  if (puedeRegalar) {
                    setLecturaSeleccionada(lectura);
                    setVista('form');
                  }
                }}
              >
                <span className="lectura-icono">{lectura.icono}</span>
                <h3>{lectura.nombre}</h3>
                <p>{lectura.descripcion}</p>
                <div className="lectura-precio">{lectura.runas} ᚱ</div>
                {!puedeRegalar && <span className="bloqueado-tag">Runas insuficientes</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vista menú principal
  return (
    <div className="sec">
      <div className="sec-head regalo-head"><span>❤</span><h1>Regalá Magia</h1><p>Un regalo de Duendes del Uruguay es diferente. Es compañía, protección, transformación.</p></div>

      <div className="regalos-grid">
        <div className="regalo-card regalo-card-principal" onClick={() => setVista('lecturas')}>
          <span>✦</span>
          <h3>Regalar una Lectura</h3>
          <p>Tiradas de runas, registros akáshicos, estudios del alma y más.</p>
          <small className="regalo-badge">Pagás con tus runas</small>
        </div>

        <div className="regalo-card" onClick={() => window.open(`${WORDPRESS_URL}/shop/`, '_blank')}>
          <span>◆</span>
          <h3>Regalar un Guardián</h3>
          <p>Un compañero de vida para alguien especial.</p>
          <small>Ir a la tienda ↗</small>
        </div>

        <div className="regalo-card" onClick={() => window.open('/product/circulo-seis-meses/', '_blank')}>
          <span>★</span>
          <h3>Regalar Membresía</h3>
          <p>6 meses de Círculo: contenido, comunidad, descuentos.</p>
          <small>Ver membresías ↗</small>
        </div>

        <div className="regalo-card" onClick={() => window.open('/product/paquete-runas-80/', '_blank')}>
          <span>ᚱ</span>
          <h3>Regalar Runas</h3>
          <p>Que elija qué experiencia mágica quiere tener.</p>
          <small>Ver paquetes ↗</small>
        </div>
      </div>

      <div className="regalo-info">
        <h4>¿Cómo funcionan los regalos de lecturas?</h4>
        <ol>
          <li>Elegís la lectura que querés regalar</li>
          <li>Ponés el email de quien recibe</li>
          <li>Pagás con tus runas</li>
          <li>La persona recibe un email con un código</li>
          <li>Canjea el código y completa SUS propios datos</li>
          <li>Recibe la lectura personalizada para ELLA</li>
        </ol>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MUNDO, CUIDADOS, CRISTALES
// ═══════════════════════════════════════════════════════════════

function MundoSec() {
  const [tab, setTab] = useState('intro');
  const [elementoExpandido, setElementoExpandido] = useState(null);

  return (
    <div className="sec mundo-elemental">
      <div className="sec-head">
        <h1>El Reino Elemental</h1>
        <p>Todo lo que necesitás saber sobre duendes, hadas, gnomos, elementales, alquimia y la conexión entre mundos.</p>
      </div>

      <div className="tabs-h mundo-tabs">
        {[
          ['intro','◈','Qué es'],
          ['elementales','✦','4 Elementos'],
          ['tipos','◆','Tipos de Duendes'],
          ['signos','☽','Señales'],
          ['rituales','❧','Rituales'],
          ['alquimia','★','Alquimia']
        ].map(([k,i,t]) => (
          <button key={k} className={`tab ${tab===k?'act':''}`} onClick={() => setTab(k)}>
            <span className="tab-icon">{i}</span>{t}
          </button>
        ))}
      </div>

      <div className="tab-content mundo-content">
        {tab === 'intro' && (
          <div className="intro-expandida">
            {MUNDO_ELEMENTAL.intro.texto.split('\n\n').map((p,i) => <p key={i}>{p}</p>)}

            <div className="intro-cta">
              <h4>¿Listo para explorar más?</h4>
              <p>Navegá por las pestañas para descubrir cada aspecto del Reino Elemental.</p>
            </div>
          </div>
        )}

        {tab === 'elementales' && (
          <div className="elementos-expandidos">
            <p className="elementos-intro">Los cuatro elementos son la base de toda la creación. Cada uno tiene sus propios seres guardianes, energías específicas, y formas de conexión.</p>

            <div className="elementos-grid-exp">
              {MUNDO_ELEMENTAL.elementales.map((el,i) => (
                <div
                  key={i}
                  className={`elem-card-exp ${elementoExpandido === i ? 'expandido' : ''}`}
                  style={{borderColor: el.color}}
                >
                  <div className="elem-header" style={{background: el.color}} onClick={() => setElementoExpandido(elementoExpandido === i ? null : i)}>
                    <span className="elem-icono">{el.icono}</span>
                    <div className="elem-titulo">
                      <strong>{el.elemento}</strong>
                      <small>{el.nombre}</small>
                    </div>
                    <span className="elem-expand">{elementoExpandido === i ? '−' : '+'}</span>
                  </div>

                  <div className="elem-body">
                    <p className="elem-desc">{el.desc}</p>

                    {elementoExpandido === i && (
                      <div className="elem-detalles">
                        <div className="elem-seccion">
                          <h5>Características</h5>
                          <p>{el.detalles}</p>
                        </div>

                        <div className="elem-seccion">
                          <h5>Cómo Conectar</h5>
                          <p>{el.conectar}</p>
                        </div>

                        <div className="elem-seccion ritual-box">
                          <h5>✦ Ritual de Conexión</h5>
                          <p>{el.ritual}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'tipos' && (
          <div className="tipos-duendes">
            <div className="tipos-intro">
              {MUNDO_ELEMENTAL.duendes.texto.split('\n\n').map((p,i) => <p key={i}>{p}</p>)}
            </div>

            <h3>Tipos de Duendes</h3>
            <div className="tipos-grid">
              {MUNDO_ELEMENTAL.tiposDuendes.map((td,i) => (
                <div key={i} className="tipo-card">
                  <h4>{td.tipo}</h4>
                  <p>{td.desc}</p>
                  <div className="tipo-senales">
                    <strong>Señales de su presencia:</strong>
                    <span>{td.señales}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'signos' && (
          <div className="signos-duende">
            <p className="signos-intro">Los duendes se comunican de formas sutiles. Aprender a reconocer sus señales te permite fortalecer el vínculo y entender sus mensajes.</p>

            <div className="signos-grid">
              {MUNDO_ELEMENTAL.signos.map((s,i) => (
                <div key={i} className="signo-card">
                  <h4>{s.signo}</h4>
                  <ul>
                    {s.señales.map((sen,j) => <li key={j}>{sen}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'rituales' && (
          <div className="rituales-section">
            <p className="rituales-intro">Los rituales son puentes de comunicación. No requieren materiales costosos ni conocimientos avanzados: solo intención pura y corazón abierto.</p>

            <div className="rituales-grid">
              {MUNDO_ELEMENTAL.rituales.map((r,i) => (
                <div key={i} className="ritual-card">
                  <div className="ritual-header">
                    <h4>{r.nombre}</h4>
                    <span className="ritual-duracion">⏱ {r.duracion}</span>
                  </div>
                  <ol className="ritual-pasos">
                    {r.pasos.map((p,j) => <li key={j}>{p}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'alquimia' && (
          <div className="alquimia-section">
            {MUNDO_ELEMENTAL.alquimia.texto.split('\n\n').map((p,i) => <p key={i}>{p}</p>)}

            <div className="piriapolis-highlight">
              <span>★</span>
              <p>Cada guardián canalizado en Piriápolis lleva consigo la energía de este vórtice alquímico único en el mundo.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CuidadosSec() {
  return (
    <div className="sec">
      <div className="sec-head"><h1>Cuidados de tu Guardián</h1><p>Guía para mantener el vínculo fuerte y vibrante.</p></div>
      <div className="cuidados-lista">
        {CUIDADOS.map((c,i) => (
          <div key={i} className={`cuidado-card ${c.esProhibido ? 'prohibido' : ''}`}>
            <div className="cuidado-num">{i+1}</div>
            <div className="cuidado-body">
              <h3>{c.titulo}</h3>
              <p>{c.texto}</p>
              <ul>{c.items.map((it,j) => <li key={j}>{it}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CristalesSec() {
  return (
    <div className="sec">
      <div className="sec-head">
        <h1>Cristales y Gemas</h1>
        <p>Aliados poderosos para tu camino espiritual. Cada piedra tiene su energía única.</p>
      </div>
      <div className="cristales-grid">
        {CRISTALES.map((c,i) => (
          <div key={i} className="cristal-card">
            <div className="cristal-img-container" style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
              <img
                src={c.imagen}
                alt={c.nombre}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: '2rem 1rem 0.8rem',
                textAlign: 'center'
              }}>
                <span style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '1.1rem',
                  color: '#fff',
                  fontWeight: 500,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>{c.nombre}</span>
              </div>
            </div>
            <div className="cristal-body">
              <p className="cristal-props">{c.props}</p>
              <small className="cristal-cuidado">🌿 {c.cuidado}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CÍRCULO DE DUENDES - Dashboard con tema oscuro y neón
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// CÍRCULO - Sección simplificada (redirecciona a página completa)
// ═══════════════════════════════════════════════════════════════

// DEPRECATED: Usar SeccionCirculo importado
function CirculoSecLocal({ usuario, pais }) {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const esUY = pais === 'UY';

  // Cargar historial de mensajes del Duende de la Semana
  useEffect(() => {
    if (usuario?.esCirculo && usuario?.email) {
      cargarHistorial();
    }
  }, [usuario?.esCirculo, usuario?.email]);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const res = await fetch(`/api/circulo/historial-mensajes?email=${encodeURIComponent(usuario.email)}`);
      const data = await res.json();
      if (data.success && data.mensajes) {
        setHistorial(data.mensajes.slice(0, 10)); // Últimos 10 mensajes
      }
    } catch(e) {
      console.error('Error cargando historial:', e);
    }
    setCargando(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // SI ES MIEMBRO DEL CÍRCULO
  // ═══════════════════════════════════════════════════════════════

  if (usuario?.esCirculo) {
    return (
      <div className="sec">
        <div className="circulo-miembro-card">
          <span className="circulo-miembro-icon">★</span>
          <h2>✓ Sos parte del Círculo</h2>
          <p>Tu membresía está activa. Entrá al Círculo para ver todo tu contenido exclusivo.</p>
          <a href="/mi-magia/circulo" className="btn-ir-circulo">
            Ir al Círculo →
          </a>
        </div>

        {/* Historial de mensajes del Duende de la Semana */}
        <div className="historial-mensajes">
          <h3>📜 Mensajes recibidos del Duende de la Semana</h3>
          {cargando ? (
            <p className="historial-cargando">Cargando historial...</p>
          ) : historial.length > 0 ? (
            <div className="mensajes-lista">
              {historial.map((msg, i) => (
                <div key={i} className="mensaje-item">
                  <div className="mensaje-header">
                    <span className="mensaje-guardian">{msg.guardian || 'Guardián'}</span>
                    <span className="mensaje-fecha">{msg.fecha || ''}</span>
                  </div>
                  <p className="mensaje-texto">{msg.mensaje}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="historial-vacio">Tus mensajes del Duende de la Semana aparecerán aquí.</p>
          )}
        </div>

        <style jsx>{`
          .circulo-miembro-card { background: linear-gradient(135deg, #f0fff0, #e8f5e9); border: 2px solid #2a7a2a; border-radius: 16px; padding: 2rem; text-align: center; margin-bottom: 2rem; }
          .circulo-miembro-icon { font-size: 3rem; color: #2a7a2a; display: block; margin-bottom: 1rem; }
          .circulo-miembro-card h2 { font-family: 'Cinzel', serif; color: #2a7a2a; margin: 0 0 0.5rem; }
          .circulo-miembro-card p { color: #555; margin-bottom: 1.5rem; }
          .btn-ir-circulo { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #2a7a2a, #1a5a1a); color: #fff; text-decoration: none; border-radius: 8px; font-family: 'Cinzel', serif; font-weight: 600; transition: all 0.2s; }
          .btn-ir-circulo:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(42,122,42,0.3); }

          .historial-mensajes { background: #fafafa; border: 1px solid #e0e0e0; border-radius: 12px; padding: 1.5rem; }
          .historial-mensajes h3 { font-family: 'Cinzel', serif; color: #1a1a1a; margin: 0 0 1rem; font-size: 1rem; }
          .historial-cargando, .historial-vacio { color: #888; font-style: italic; text-align: center; padding: 2rem; }
          .mensajes-lista { display: flex; flex-direction: column; gap: 1rem; }
          .mensaje-item { background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 1rem; }
          .mensaje-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
          .mensaje-guardian { font-family: 'Cinzel', serif; color: #d4af37; font-weight: 600; }
          .mensaje-fecha { font-size: 0.8rem; color: #999; }
          .mensaje-texto { color: #444; line-height: 1.6; margin: 0; font-size: 0.95rem; }
        `}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SI NO ES MIEMBRO - MOSTRAR PROMOCIÓN
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="sec">
      <div className="circulo-promo-card">
        <span className="circulo-promo-icon">★</span>
        <h2>Círculo de Duendes</h2>
        <p className="circulo-promo-sub">El santuario secreto para quienes sienten el llamado</p>

        <div className="beneficios-lista-simple">
          <div className="beneficio-item">✦ Duende guardián semanal con mensajes únicos</div>
          <div className="beneficio-item">☽ Guía lunar completa cada mes</div>
          <div className="beneficio-item">🕯️ Rituales y prácticas exclusivas</div>
          <div className="beneficio-item">❧ Comunidad privada de buscadores</div>
          <div className="beneficio-item">◈ 5-10% OFF en guardianes</div>
          <div className="beneficio-item destacado">🎁 100 runas de regalo para usar en la tienda</div>
        </div>

        <a href="/mi-magia/circulo" className="btn-unirse-circulo">
          Probá 15 días gratis →
        </a>
      </div>

      <style jsx>{`
        .circulo-promo-card { background: linear-gradient(135deg, #faf8f3, #fff); border: 2px solid #d4af37; border-radius: 16px; padding: 2rem; text-align: center; }
        .circulo-promo-icon { font-size: 3rem; color: #d4af37; display: block; margin-bottom: 1rem; }
        .circulo-promo-card h2 { font-family: 'Tangerine', cursive; font-size: 2.5rem; color: #1a1a1a; margin: 0 0 0.5rem; }
        .circulo-promo-sub { color: #666; margin-bottom: 1.5rem; }
        .beneficios-lista-simple { text-align: left; max-width: 350px; margin: 0 auto 1.5rem; }
        .beneficio-item { padding: 0.6rem 0; border-bottom: 1px dashed #e0e0e0; color: #444; font-size: 0.95rem; }
        .beneficio-item:last-child { border-bottom: none; }
        .beneficio-item.destacado { background: linear-gradient(90deg, rgba(212,175,55,0.1), transparent); padding: 0.8rem 0.5rem; margin: 0.5rem -0.5rem 0; border-radius: 6px; border-bottom: none; font-weight: 600; color: #b8962e; }
        .btn-unirse-circulo { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #d4af37, #b8962e); color: #1a1a1a; text-decoration: none; border-radius: 8px; font-family: 'Cinzel', serif; font-weight: 600; transition: all 0.2s; }
        .btn-unirse-circulo:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(212,175,55,0.3); }
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// GRIMORIO (con explicación completa)
// ═══════════════════════════════════════════════════════════════

// DEPRECATED: Usar SeccionGrimorio importado
function GrimorioSecLocal({ usuario, token, setUsuario }) {
  const [tab, setTab] = useState('intro');
  const [entrada, setEntrada] = useState('');
  const [tipoEntrada, setTipoEntrada] = useState('libre');
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState(null);

  // Estados del calendario interactivo
  const [mesActual, setMesActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [vistaCalendario, setVistaCalendario] = useState(true);

  // Calcular fase lunar para una fecha
  const calcularFaseLunar = (fecha) => {
    const cicloLunar = 29.530588853;
    const lunaLlena = new Date(2024, 0, 25); // Luna llena conocida
    const diff = (fecha - lunaLlena) / (1000 * 60 * 60 * 24);
    const fase = ((diff % cicloLunar) + cicloLunar) % cicloLunar;
    if (fase < 1.84566) return { nombre: 'Nueva', icono: '🌑', energia: 'Nuevos comienzos, introspección' };
    if (fase < 7.38264) return { nombre: 'Creciente', icono: '🌒', energia: 'Manifestación, acción' };
    if (fase < 9.22830) return { nombre: 'Cuarto Creciente', icono: '🌓', energia: 'Decisiones, compromiso' };
    if (fase < 14.76528) return { nombre: 'Gibosa Creciente', icono: '🌔', energia: 'Refinamiento, paciencia' };
    if (fase < 16.61094) return { nombre: 'Llena', icono: '🌕', energia: 'Culminación, gratitud, magia potente' };
    if (fase < 22.14792) return { nombre: 'Gibosa Menguante', icono: '🌖', energia: 'Gratitud, compartir' };
    if (fase < 23.99358) return { nombre: 'Cuarto Menguante', icono: '🌗', energia: 'Soltar, liberar' };
    return { nombre: 'Menguante', icono: '🌘', energia: 'Descanso, limpieza' };
  };

  // Obtener días del mes para el calendario
  const obtenerDiasMes = () => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay();
    const dias = [];

    // Días vacíos al inicio
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push({ vacio: true });
    }

    // Días del mes
    for (let d = 1; d <= diasEnMes; d++) {
      const fecha = new Date(year, month, d);
      const fechaStr = fecha.toLocaleDateString('es-UY');
      const entradasDia = (usuario?.diario || []).filter(e => e.fecha === fechaStr);
      const faseLunar = calcularFaseLunar(fecha);
      const esHoy = new Date().toDateString() === fecha.toDateString();
      dias.push({
        dia: d,
        fecha: fechaStr,
        fechaObj: fecha,
        entradas: entradasDia,
        tieneEntradas: entradasDia.length > 0,
        faseLunar,
        esHoy
      });
    }
    return dias;
  };

  // Obtener entradas del día seleccionado
  const entradasDelDia = diaSeleccionado
    ? (usuario?.diario || []).filter(e => e.fecha === diaSeleccionado)
    : [];
  
  const guardarEntrada = async () => {
    if (!entrada.trim()) return;
    setGuardando(true);
    try {
      const res = await fetch(`${API_BASE}/api/mi-magia/diario`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: usuario.email, tipo: tipoEntrada, contenido: entrada }) });
      const data = await res.json();
      setUsuario({ ...usuario, diario: [...(usuario.diario || []), { tipo: tipoEntrada, contenido: entrada, fecha: new Date().toLocaleDateString('es-UY') }], runas: data.runaOtorgada ? (usuario.runas || 0) + 1 : usuario.runas });
      setEntrada('');
      if (data.runaOtorgada) setMsg({ t: 'ok', m: '+1 Runa por tu práctica diaria!' });
    } catch(e) {}
    setGuardando(false);
  };
  
  return (
    <div className="sec">
      <div className="sec-head"><h1>Tu Grimorio</h1><p>Biblioteca mágica personal. Todo lo que recibís y escribís queda guardado acá para siempre.</p></div>
      
      <div className="tabs-h">
        {[['intro','◇','¿Qué es?'],['lecturas','✦','Mis Lecturas'],['diario','✎','Mi Diario']].map(([k,i,t]) => 
          <button key={k} className={`tab ${tab===k?'act':''}`} onClick={() => setTab(k)}>{i} {t}</button>
        )}
      </div>
      
      {tab === 'intro' && (
        <div className="grim-intro">
          <div className="grim-intro-section">
            <h3>📜 ¿Qué es un Grimorio?</h3>
            <p>En la tradición mágica, un grimorio es el libro personal de una bruja, mago o practicante espiritual. Es donde se guardan hechizos, rituales, sueños, visiones, y todo el conocimiento acumulado en el camino.</p>
            <p>Tu grimorio en Mi Magia tiene dos partes:</p>
          </div>
          
          <div className="grim-intro-cards">
            <div className="grim-card" onClick={() => setTab('lecturas')}>
              <span>✦</span>
              <h4>Mis Lecturas</h4>
              <p>Todas las experiencias mágicas que solicites (tiradas de runas, lecturas del alma, registros akáshicos, etc.) quedan guardadas acá. Podés releerlas cuando quieras, encontrar patrones, ver tu evolución.</p>
            </div>
            <div className="grim-card" onClick={() => setTab('diario')}>
              <span>✎</span>
              <h4>Mi Diario</h4>
              <p>Tu espacio personal para escribir lo que quieras: reflexiones, sueños, señales que recibiste, rituales que hiciste, sincronicidades, gratitud, intenciones. Es privado y solo vos lo ves.</p>
            </div>
          </div>
          
          <div className="grim-tip">
            <strong>💡 Tip:</strong> Mantener un diario espiritual es una de las prácticas más poderosas para desarrollar la intuición. No tiene que ser largo ni elaborado - a veces una frase basta.
          </div>
        </div>
      )}
      
      {tab === 'lecturas' && (
        <div className="grim-lecturas">
          <h2>Mis Lecturas</h2>
          {usuario?.lecturas?.length > 0 ? (
            <div className="lecturas-lista">
              {usuario.lecturas.map((l, i) => (
                <div key={i} className="lectura-card">
                  <div className="lectura-head"><span className="lectura-tipo">{l.tipo}</span><span className="lectura-fecha">{l.fecha}</span></div>
                  <p className="lectura-preview">{l.resumen || l.contenido?.substring(0, 300)}...</p>
                  <button className="btn-sec">Leer completa</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-grim">
              <span>📜</span>
              <h3>Todavía no tenés lecturas</h3>
              <p>Cuando solicites una experiencia mágica (tirada de runas, lectura del alma, etc.), el resultado completo quedará guardado acá. Podrás releerlo cuando quieras, buscar patrones, ver cómo evoluciona tu camino.</p>
            </div>
          )}
        </div>
      )}
      
      {tab === 'diario' && (
        <div className="grim-diario">
          <h2>Mi Diario Mágico</h2>
          <p className="diario-intro">Tu espacio sagrado. Cada entrada es un hechizo, cada reflexión una semilla de magia.</p>

          {/* Barra de vista */}
          <div className="diario-vistas">
            <button className={`vista-btn ${vistaCalendario ? 'act' : ''}`} onClick={() => setVistaCalendario(true)}>
              📅 Calendario Lunar
            </button>
            <button className={`vista-btn ${!vistaCalendario ? 'act' : ''}`} onClick={() => setVistaCalendario(false)}>
              📜 Lista Cronológica
            </button>
          </div>

          {/* VISTA CALENDARIO */}
          {vistaCalendario && (
            <div className="diario-calendario">
              {/* Navegación del mes */}
              <div className="cal-nav">
                <button onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1))} className="cal-nav-btn">◀</button>
                <div className="cal-mes">
                  <span className="cal-mes-nombre">{mesActual.toLocaleDateString('es-UY', { month: 'long', year: 'numeric' })}</span>
                  <span className="cal-fase-hoy">{calcularFaseLunar(new Date()).icono} Luna {calcularFaseLunar(new Date()).nombre}</span>
                </div>
                <button onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1))} className="cal-nav-btn">▶</button>
              </div>

              {/* Cabecera días de la semana */}
              <div className="cal-header">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                  <div key={d} className="cal-header-dia">{d}</div>
                ))}
              </div>

              {/* Grid del calendario */}
              <div className="cal-grid">
                {obtenerDiasMes().map((d, i) => (
                  <div
                    key={i}
                    className={`cal-dia ${d.vacio ? 'vacio' : ''} ${d.esHoy ? 'hoy' : ''} ${d.tieneEntradas ? 'con-entradas' : ''} ${diaSeleccionado === d.fecha ? 'sel' : ''}`}
                    onClick={() => !d.vacio && setDiaSeleccionado(d.fecha === diaSeleccionado ? null : d.fecha)}
                  >
                    {!d.vacio && (
                      <>
                        <span className="cal-dia-num">{d.dia}</span>
                        <span className="cal-dia-luna" title={`Luna ${d.faseLunar.nombre}: ${d.faseLunar.energia}`}>{d.faseLunar.icono}</span>
                        {d.tieneEntradas && <span className="cal-dia-marker">✦</span>}
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Leyenda */}
              <div className="cal-leyenda">
                <span><span className="marker-dot hoy"></span> Hoy</span>
                <span><span className="marker-dot entradas"></span> Tiene entradas</span>
                <span>🌑 Nueva → 🌕 Llena → 🌑</span>
              </div>

              {/* Entradas del día seleccionado */}
              {diaSeleccionado && (
                <div className="dia-seleccionado">
                  <h3>📖 {diaSeleccionado}</h3>
                  {(() => {
                    const fechaSel = obtenerDiasMes().find(d => d.fecha === diaSeleccionado);
                    return fechaSel && (
                      <div className="dia-info-luna">
                        {fechaSel.faseLunar.icono} Luna {fechaSel.faseLunar.nombre}
                        <span className="luna-energia">{fechaSel.faseLunar.energia}</span>
                      </div>
                    );
                  })()}
                  {entradasDelDia.length > 0 ? (
                    <div className="entradas-dia">
                      {entradasDelDia.map((e, i) => {
                        const tipo = TIPOS_DIARIO.find(t => t.id === e.tipo) || TIPOS_DIARIO[TIPOS_DIARIO.length - 1];
                        return (
                          <div key={i} className="entrada-mini">
                            <span className="entrada-mini-tipo">{tipo.i} {tipo.n}</span>
                            <p>{e.contenido}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="sin-entradas">No hay entradas este día. ¿Querés agregar una reflexión?</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VISTA LISTA */}
          {!vistaCalendario && usuario?.diario?.length > 0 && (
            <div className="diario-entradas">
              <h3>Todas tus entradas</h3>
              {usuario.diario.slice().reverse().map((e, i) => {
                const tipo = TIPOS_DIARIO.find(t => t.id === e.tipo) || TIPOS_DIARIO[TIPOS_DIARIO.length - 1];
                return (
                  <div key={i} className="entrada-card">
                    <div className="entrada-head"><span>{tipo.i} {tipo.n}</span><span>{e.fecha}</span></div>
                    <p>{e.contenido}</p>
                  </div>
                );
              })}
            </div>
          )}

          {!vistaCalendario && (!usuario?.diario || usuario.diario.length === 0) && (
            <div className="empty-grim">
              <span>📜</span>
              <h3>Tu diario está vacío</h3>
              <p>Cada entrada que escribas aquí se guarda para siempre. Es tu registro mágico personal.</p>
            </div>
          )}

          {/* NUEVA ENTRADA */}
          <div className="diario-nuevo">
            <h3>✎ Nueva entrada</h3>
            <div className="tipos-entrada">
              {TIPOS_DIARIO.map(t => (
                <button key={t.id} className={`tipo-btn ${tipoEntrada === t.id ? 'act' : ''}`} onClick={() => setTipoEntrada(t.id)} title={t.desc}>
                  <span>{t.i}</span>{t.n}
                </button>
              ))}
            </div>
            <div className="tipo-desc">{TIPOS_DIARIO.find(t => t.id === tipoEntrada)?.desc}</div>
            <textarea
              placeholder="Escribí lo que tengas en mente... No hay reglas, es tu espacio sagrado."
              value={entrada}
              onChange={e => setEntrada(e.target.value)}
              rows={5}
            />
            <div className="diario-acciones">
              <button className="btn-gold" onClick={guardarEntrada} disabled={!entrada.trim() || guardando}>
                {guardando ? 'Guardando...' : 'Guardar en mi grimorio'}
              </button>
              <span className="tip-runa">+1 Runa por día de práctica</span>
            </div>
          </div>

          {/* Estadísticas del diario */}
          {usuario?.diario?.length > 0 && (
            <div className="diario-stats">
              <h4>Tu camino en números</h4>
              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-num">{usuario.diario.length}</span>
                  <span className="stat-label">Entradas</span>
                </div>
                <div className="stat">
                  <span className="stat-num">{[...new Set(usuario.diario.map(e => e.fecha))].length}</span>
                  <span className="stat-label">Días practicando</span>
                </div>
                <div className="stat">
                  <span className="stat-num">{TIPOS_DIARIO.find(t => t.id === (usuario.diario.reduce((acc, e) => { acc[e.tipo] = (acc[e.tipo] || 0) + 1; return acc; }, {}), Object.entries(usuario.diario.reduce((acc, e) => { acc[e.tipo] = (acc[e.tipo] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1])[0]?.[0]))?.i || '✦'}</span>
                  <span className="stat-label">Tipo favorito</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FORO MÁGICO - Comunidad
// ═══════════════════════════════════════════════════════════════

const CATEGORIAS_FORO = [
  { id: 'general', nombre: 'General', icono: '💬', desc: 'Conversaciones libres de la comunidad' },
  { id: 'guardianes', nombre: 'Guardianes', icono: '🧙', desc: 'Experiencias con tus duendes' },
  { id: 'magia', nombre: 'Magia y Rituales', icono: '✨', desc: 'Comparte tus prácticas mágicas' },
  { id: 'suenos', nombre: 'Sueños y Visiones', icono: '🌙', desc: 'Interpretación de sueños' },
  { id: 'cristales', nombre: 'Cristales', icono: '💎', desc: 'Todo sobre cristales' },
  { id: 'ayuda', nombre: 'Ayuda', icono: '❓', desc: 'Preguntas y dudas' }
];

function ForoSec({ usuario, setUsuario }) {
  const [categoria, setCategoria] = useState('general');
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevoPost, setNuevoPost] = useState('');
  const [titulo, setTitulo] = useState('');
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [postSeleccionado, setPostSeleccionado] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarPosts();
  }, [categoria]);

  const cargarPosts = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API_BASE}/api/foro?categoria=${categoria}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (e) {
      setPosts(getPostsEjemplo(categoria));
    }
    setCargando(false);
  };

  const publicar = async () => {
    if (!titulo.trim() || !nuevoPost.trim()) return;
    setEnviando(true);
    try {
      const res = await fetch(`${API_BASE}/api/foro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario.email,
          autor: usuario.nombrePreferido,
          categoria,
          titulo: titulo.trim(),
          contenido: nuevoPost.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        setNuevoPost('');
        setTitulo('');
        setMostrarNuevo(false);
      }
    } catch (e) {
      const nuevoPostLocal = {
        id: Date.now(),
        autor: usuario.nombrePreferido,
        autorEmail: usuario.email,
        titulo: titulo.trim(),
        contenido: nuevoPost.trim(),
        categoria,
        fecha: new Date().toISOString(),
        respuestas: [],
        likes: 0,
        etiqueta: 'nuevo'
      };
      setPosts([nuevoPostLocal, ...posts]);
      setNuevoPost('');
      setTitulo('');
      setMostrarNuevo(false);
    }
    setEnviando(false);
  };

  const responderPost = async () => {
    if (!respuesta.trim() || !postSeleccionado) return;
    setEnviando(true);
    try {
      const res = await fetch(`${API_BASE}/api/foro/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: postSeleccionado.id,
          email: usuario.email,
          autor: usuario.nombrePreferido,
          contenido: respuesta.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        const nuevaRespuesta = {
          id: Date.now(),
          autor: usuario.nombrePreferido,
          contenido: respuesta.trim(),
          fecha: new Date().toISOString()
        };
        setPostSeleccionado({
          ...postSeleccionado,
          respuestas: [...(postSeleccionado.respuestas || []), nuevaRespuesta]
        });
        setRespuesta('');
      }
    } catch (e) {
      const nuevaRespuesta = {
        id: Date.now(),
        autor: usuario.nombrePreferido,
        contenido: respuesta.trim(),
        fecha: new Date().toISOString()
      };
      setPostSeleccionado({
        ...postSeleccionado,
        respuestas: [...(postSeleccionado.respuestas || []), nuevaRespuesta]
      });
      setRespuesta('');
    }
    setEnviando(false);
  };

  const formatearFecha = (fecha) => {
    const d = new Date(fecha);
    const ahora = new Date();
    const diff = Math.floor((ahora - d) / (1000 * 60));
    if (diff < 1) return 'Ahora mismo';
    if (diff < 60) return `Hace ${diff} min`;
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)}h`;
    return d.toLocaleDateString('es-UY', { day: 'numeric', month: 'short' });
  };

  const getPostsEjemplo = (cat) => [
    {
      id: 1,
      autor: 'Valeria',
      titulo: cat === 'guardianes' ? 'Mi Finnegan me salvó el día!' : '¿Cómo limpiar mi espacio?',
      contenido: cat === 'guardianes'
        ? 'Les cuento que ayer tuve un día muy difícil en el trabajo. Cuando llegué a casa, mi Finnegan estaba en un lugar diferente (juro que lo dejé en el altar). Lo tomé en mis manos y sentí una paz increíble. ¿Les pasa que sienten que sus guardianes les "hablan"?'
        : 'Hola a todos! Soy nueva en esto y quería preguntarles cómo hacen para limpiar energéticamente su hogar. Mi guardián acaba de llegar y quiero que su espacio esté impecable.',
      categoria: cat,
      fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      respuestas: [
        { id: 1, autor: 'Mariana', contenido: '¡Me pasa todo el tiempo! Son increíbles.', fecha: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
        { id: 2, autor: 'Lucia', contenido: 'Finnegan es muy especial. Mi Bramble también me acompaña mucho.', fecha: new Date(Date.now() - 30 * 60 * 1000).toISOString() }
      ],
      likes: 12,
      etiqueta: 'destacado'
    },
    {
      id: 2,
      autor: 'Carolina',
      titulo: cat === 'cristales' ? 'Cuarzo rosa vs Rodocrosita' : 'Ritual de luna llena',
      contenido: cat === 'cristales'
        ? 'Estoy buscando un cristal para trabajar el amor propio. ¿Qué me recomiendan, cuarzo rosa o rodocrosita? Mi guardián tiene citrino y cuarzo ahumado.'
        : 'Este viernes es luna llena! ¿Alguien quiere compartir sus rituales? Yo siempre cargo mis cristales y escribo intenciones.',
      categoria: cat,
      fecha: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      respuestas: [],
      likes: 8,
      etiqueta: 'nuevo'
    },
    {
      id: 3,
      autor: 'Sofía',
      titulo: 'Nuevo en la familia!',
      contenido: 'Les presento a mi primer guardián! Es un Willow y estoy emocionadísima. ¿Algún consejo para conectar mejor con él en los primeros días?',
      categoria: cat,
      fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      respuestas: [
        { id: 1, autor: 'Duendes del Uruguay', contenido: '¡Bienvenida Sofía! Lo más importante es hablarle, contarle tus cosas, ponerlo en un lugar especial. La conexión crece con el tiempo. ✨', fecha: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() }
      ],
      likes: 24,
      etiqueta: 'resuelto'
    }
  ];

  const postsFiltrados = busqueda.trim()
    ? posts.filter(p => p.titulo.toLowerCase().includes(busqueda.toLowerCase()) || p.contenido.toLowerCase().includes(busqueda.toLowerCase()))
    : posts;

  const getEtiquetaStyle = (etiqueta) => {
    switch(etiqueta) {
      case 'destacado': return { bg: 'linear-gradient(135deg, #d4af37, #b8962e)', color: '#0a0a0a' };
      case 'resuelto': return { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff' };
      case 'nuevo': return { bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff' };
      default: return null;
    }
  };

  // Vista de post seleccionado
  if (postSeleccionado) {
    return (
      <div className="foro-dark">
        <button className="foro-btn-volver" onClick={() => setPostSeleccionado(null)}>← Volver al foro</button>

        <div className="foro-post-detalle">
          <div className="foro-post-header">
            <div className="foro-avatar-lg">{postSeleccionado.autor.charAt(0)}</div>
            <div className="foro-post-meta">
              <span className="foro-autor">{postSeleccionado.autor}</span>
              <span className="foro-fecha">{formatearFecha(postSeleccionado.fecha)}</span>
            </div>
            {postSeleccionado.etiqueta && (
              <span className="foro-etiqueta" style={{background: getEtiquetaStyle(postSeleccionado.etiqueta)?.bg, color: getEtiquetaStyle(postSeleccionado.etiqueta)?.color}}>
                {postSeleccionado.etiqueta === 'destacado' && '★ '}
                {postSeleccionado.etiqueta === 'resuelto' && '✓ '}
                {postSeleccionado.etiqueta}
              </span>
            )}
          </div>
          <h2 className="foro-post-titulo">{postSeleccionado.titulo}</h2>
          <p className="foro-post-texto">{postSeleccionado.contenido}</p>
          <div className="foro-post-stats">
            <span>❤️ {postSeleccionado.likes || 0}</span>
            <span>💬 {(postSeleccionado.respuestas || []).length}</span>
          </div>
        </div>

        {(postSeleccionado.respuestas || []).length > 0 && (
          <div className="foro-respuestas-sec">
            <h3>💬 Respuestas ({postSeleccionado.respuestas.length})</h3>
            {postSeleccionado.respuestas.map((r, i) => (
              <div key={r.id || i} className="foro-respuesta-card">
                <div className="foro-avatar-sm">{r.autor.charAt(0)}</div>
                <div className="foro-respuesta-body">
                  <div className="foro-respuesta-header">
                    <span className="foro-autor-sm">{r.autor}</span>
                    <span className="foro-fecha-sm">{formatearFecha(r.fecha)}</span>
                  </div>
                  <p>{r.contenido}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="foro-nueva-respuesta">
          <h3>Tu respuesta</h3>
          <textarea
            placeholder="Comparte tu experiencia o ayuda a tu compañera..."
            value={respuesta}
            onChange={e => setRespuesta(e.target.value)}
            rows={3}
          />
          <button className="foro-btn-gold" onClick={responderPost} disabled={!respuesta.trim() || enviando}>
            {enviando ? 'Enviando...' : 'Responder'}
          </button>
        </div>

        <style jsx>{`
          .foro-dark { background: linear-gradient(180deg, #0a0a0f 0%, #0f0f14 100%); min-height: 100vh; padding: 2rem; color: #FDF8F0; font-family: 'Cormorant Garamond', serif; }
          .foro-btn-volver { background: transparent; border: 1px solid rgba(212,175,55,0.3); color: #d4af37; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; margin-bottom: 1.5rem; transition: all 0.3s; }
          .foro-btn-volver:hover { background: rgba(212,175,55,0.1); border-color: #d4af37; }
          .foro-post-detalle { background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,55,0.2); border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem; }
          .foro-post-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
          .foro-avatar-lg { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #d4af37, #b8962e); display: flex; align-items: center; justify-content: center; color: #0a0a0a; font-family: 'Cinzel', serif; font-size: 1.2rem; font-weight: 600; }
          .foro-post-meta { display: flex; flex-direction: column; flex: 1; }
          .foro-autor { font-family: 'Cinzel', serif; color: #d4af37; font-size: 1rem; }
          .foro-fecha { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
          .foro-etiqueta { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
          .foro-post-titulo { font-family: 'Cinzel', serif; font-size: 1.5rem; margin-bottom: 1rem; color: #FDF8F0; }
          .foro-post-texto { color: rgba(255,255,255,0.85); line-height: 1.8; font-size: 1.05rem; }
          .foro-post-stats { display: flex; gap: 1.5rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); font-size: 0.9rem; }
          .foro-respuestas-sec { margin-bottom: 1.5rem; }
          .foro-respuestas-sec h3 { font-family: 'Cinzel', serif; color: #d4af37; margin-bottom: 1rem; }
          .foro-respuesta-card { display: flex; gap: 1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem; transition: all 0.3s; }
          .foro-respuesta-card:hover { border-color: rgba(212,175,55,0.2); }
          .foro-avatar-sm { width: 36px; height: 36px; border-radius: 50%; background: rgba(212,175,55,0.3); display: flex; align-items: center; justify-content: center; color: #d4af37; font-size: 0.9rem; flex-shrink: 0; }
          .foro-respuesta-body { flex: 1; }
          .foro-respuesta-header { display: flex; gap: 0.75rem; margin-bottom: 0.5rem; }
          .foro-autor-sm { color: #d4af37; font-size: 0.9rem; }
          .foro-fecha-sm { color: rgba(255,255,255,0.4); font-size: 0.8rem; }
          .foro-respuesta-body p { color: rgba(255,255,255,0.8); margin: 0; font-size: 0.95rem; line-height: 1.6; }
          .foro-nueva-respuesta { background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,55,0.2); border-radius: 16px; padding: 1.5rem; }
          .foro-nueva-respuesta h3 { font-family: 'Cinzel', serif; color: #d4af37; margin-bottom: 1rem; }
          .foro-nueva-respuesta textarea { width: 100%; padding: 1rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #FDF8F0; font-size: 1rem; font-family: inherit; resize: vertical; margin-bottom: 1rem; }
          .foro-nueva-respuesta textarea:focus { outline: none; border-color: #d4af37; }
          .foro-nueva-respuesta textarea::placeholder { color: rgba(255,255,255,0.4); }
          .foro-btn-gold { background: linear-gradient(135deg, #d4af37, #b8962e); color: #0a0a0a; border: none; padding: 12px 30px; border-radius: 50px; font-family: 'Cinzel', serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
          .foro-btn-gold:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(212,175,55,0.3); }
          .foro-btn-gold:disabled { opacity: 0.5; cursor: not-allowed; }
        `}</style>
      </div>
    );
  }

  // Vista principal del foro
  return (
    <div className="foro-dark">
      {/* Header */}
      <div className="foro-header">
        <div className="foro-header-content">
          <span className="foro-icono">💬</span>
          <div>
            <h1>Foro Mágico</h1>
            <p>Conectá con la comunidad de guardianas y guardianes</p>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="foro-busqueda">
        <input
          type="text"
          placeholder="🔍 Buscar en el foro..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Categorías */}
      <div className="foro-categorias-premium">
        {CATEGORIAS_FORO.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoria(cat.id)}
            className={`foro-cat-btn ${categoria === cat.id ? 'activa' : ''}`}
          >
            <span className="cat-icono">{cat.icono}</span>
            <span className="cat-nombre">{cat.nombre}</span>
          </button>
        ))}
      </div>

      {/* Botón nuevo post */}
      <button className="foro-nuevo-btn" onClick={() => setMostrarNuevo(!mostrarNuevo)}>
        <span>{mostrarNuevo ? '✕' : '+'}</span>
        {mostrarNuevo ? 'Cancelar' : 'Nueva publicación'}
      </button>

      {/* Formulario nuevo post */}
      {mostrarNuevo && (
        <div className="foro-nuevo-form">
          <h3>✦ Nueva publicación en {CATEGORIAS_FORO.find(c => c.id === categoria)?.nombre}</h3>
          <input
            type="text"
            placeholder="Título de tu publicación"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />
          <textarea
            placeholder="¿Qué querés compartir con la comunidad?"
            value={nuevoPost}
            onChange={e => setNuevoPost(e.target.value)}
            rows={5}
          />
          <button className="foro-btn-gold" onClick={publicar} disabled={!titulo.trim() || !nuevoPost.trim() || enviando}>
            {enviando ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      )}

      {/* Lista de posts */}
      {cargando ? (
        <div className="foro-cargando">
          <span className="foro-spinner">✦</span>
          <p>Cargando publicaciones...</p>
        </div>
      ) : postsFiltrados.length === 0 ? (
        <div className="foro-vacio">
          <span>✦</span>
          <h3>Sé la primera en publicar</h3>
          <p>Esta categoría está esperando tu voz. ¡Compartí algo con la comunidad!</p>
        </div>
      ) : (
        <div className="foro-lista">
          {postsFiltrados.map(post => (
            <div key={post.id} className="foro-card" onClick={() => setPostSeleccionado(post)}>
              <div className="foro-card-left">
                <div className="foro-avatar">{post.autor.charAt(0)}</div>
              </div>
              <div className="foro-card-content">
                <div className="foro-card-top">
                  <h4>{post.titulo}</h4>
                  {post.etiqueta && (
                    <span className="foro-etiqueta-mini" style={{background: getEtiquetaStyle(post.etiqueta)?.bg, color: getEtiquetaStyle(post.etiqueta)?.color}}>
                      {post.etiqueta === 'destacado' && '★'}
                      {post.etiqueta === 'resuelto' && '✓'}
                      {post.etiqueta === 'nuevo' && '●'}
                    </span>
                  )}
                </div>
                <p className="foro-card-preview">{post.contenido.substring(0, 120)}{post.contenido.length > 120 ? '...' : ''}</p>
                <div className="foro-card-footer">
                  <span className="foro-card-autor">{post.autor}</span>
                  <span className="foro-card-sep">·</span>
                  <span className="foro-card-fecha">{formatearFecha(post.fecha)}</span>
                  <span className="foro-card-sep">·</span>
                  <span className="foro-card-stats">💬 {(post.respuestas || []).length}</span>
                  <span className="foro-card-stats">❤️ {post.likes || 0}</span>
                </div>
              </div>
              <div className="foro-card-arrow">→</div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .foro-dark { background: linear-gradient(180deg, #0a0a0f 0%, #0f0f14 100%); min-height: 100vh; padding: 0; color: #FDF8F0; font-family: 'Cormorant Garamond', serif; }
        .foro-header { background: linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%); border-bottom: 1px solid rgba(212,175,55,0.2); padding: 2rem; }
        .foro-header-content { display: flex; align-items: center; gap: 1rem; max-width: 900px; margin: 0 auto; }
        .foro-icono { font-size: 2.5rem; }
        .foro-header h1 { font-family: 'Cinzel', serif; font-size: 1.8rem; margin: 0 0 0.25rem; color: #FDF8F0; }
        .foro-header p { color: rgba(255,255,255,0.6); margin: 0; }
        .foro-busqueda { padding: 1.5rem 2rem; max-width: 900px; margin: 0 auto; }
        .foro-busqueda input { width: 100%; padding: 14px 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #FDF8F0; font-size: 1rem; font-family: inherit; transition: all 0.3s; }
        .foro-busqueda input:focus { outline: none; border-color: #d4af37; background: rgba(255,255,255,0.08); }
        .foro-busqueda input::placeholder { color: rgba(255,255,255,0.4); }
        .foro-categorias-premium { display: flex; gap: 0.75rem; padding: 0 2rem 1.5rem; max-width: 900px; margin: 0 auto; flex-wrap: wrap; }
        .foro-cat-btn { display: flex; align-items: center; gap: 8px; padding: 10px 18px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 25px; color: rgba(255,255,255,0.7); font-size: 0.9rem; cursor: pointer; transition: all 0.3s; }
        .foro-cat-btn:hover { border-color: rgba(212,175,55,0.4); background: rgba(212,175,55,0.05); }
        .foro-cat-btn.activa { background: linear-gradient(135deg, #d4af37, #b8962e); border-color: transparent; color: #0a0a0a; }
        .foro-cat-btn .cat-icono { font-size: 1rem; }
        .foro-nuevo-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: calc(100% - 4rem); max-width: 868px; margin: 0 auto 1.5rem; padding: 14px; background: linear-gradient(135deg, #d4af37, #b8962e); border: none; border-radius: 12px; color: #0a0a0a; font-family: 'Cinzel', serif; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .foro-nuevo-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(212,175,55,0.3); }
        .foro-nuevo-btn span { font-size: 1.2rem; }
        .foro-nuevo-form { background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,55,0.3); border-radius: 16px; padding: 1.5rem; margin: 0 2rem 1.5rem; max-width: 868px; margin-left: auto; margin-right: auto; }
        .foro-nuevo-form h3 { font-family: 'Cinzel', serif; color: #d4af37; margin-bottom: 1rem; }
        .foro-nuevo-form input, .foro-nuevo-form textarea { width: 100%; padding: 14px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #FDF8F0; font-size: 1rem; font-family: inherit; margin-bottom: 1rem; box-sizing: border-box; }
        .foro-nuevo-form textarea { resize: vertical; }
        .foro-nuevo-form input:focus, .foro-nuevo-form textarea:focus { outline: none; border-color: #d4af37; }
        .foro-nuevo-form input::placeholder, .foro-nuevo-form textarea::placeholder { color: rgba(255,255,255,0.4); }
        .foro-cargando, .foro-vacio { text-align: center; padding: 4rem 2rem; color: rgba(255,255,255,0.5); }
        .foro-spinner { display: block; font-size: 2.5rem; color: #d4af37; margin-bottom: 1rem; animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .foro-vacio span { display: block; font-size: 3rem; color: #d4af37; margin-bottom: 1rem; }
        .foro-vacio h3 { font-family: 'Cinzel', serif; color: #FDF8F0; margin-bottom: 0.5rem; }
        .foro-lista { padding: 0 2rem 2rem; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
        .foro-card { display: flex; align-items: flex-start; gap: 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.25rem; cursor: pointer; transition: all 0.3s ease; }
        .foro-card:hover { border-color: rgba(212,175,55,0.4); transform: translateX(5px); box-shadow: 0 8px 30px rgba(212,175,55,0.1); }
        .foro-avatar { width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(135deg, #d4af37, #b8962e); display: flex; align-items: center; justify-content: center; color: #0a0a0a; font-family: 'Cinzel', serif; font-weight: 600; flex-shrink: 0; }
        .foro-card-content { flex: 1; min-width: 0; }
        .foro-card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem; }
        .foro-card-top h4 { font-family: 'Cinzel', serif; font-size: 1.1rem; margin: 0; color: #FDF8F0; flex: 1; }
        .foro-etiqueta-mini { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; flex-shrink: 0; }
        .foro-card-preview { color: rgba(255,255,255,0.6); font-size: 0.95rem; margin: 0 0 0.75rem; line-height: 1.5; }
        .foro-card-footer { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.8rem; }
        .foro-card-autor { color: #d4af37; }
        .foro-card-sep { color: rgba(255,255,255,0.3); }
        .foro-card-fecha, .foro-card-stats { color: rgba(255,255,255,0.4); }
        .foro-card-arrow { color: #d4af37; font-size: 1.2rem; opacity: 0; transition: all 0.3s; }
        .foro-card:hover .foro-card-arrow { opacity: 1; }
        .foro-btn-gold { background: linear-gradient(135deg, #d4af37, #b8962e); color: #0a0a0a; border: none; padding: 12px 30px; border-radius: 50px; font-family: 'Cinzel', serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .foro-btn-gold:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(212,175,55,0.3); }
        .foro-btn-gold:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 600px) {
          .foro-header { padding: 1.5rem; }
          .foro-busqueda, .foro-lista, .foro-nuevo-form { padding-left: 1rem; padding-right: 1rem; }
          .foro-categorias-premium { padding-left: 1rem; padding-right: 1rem; }
          .foro-nuevo-btn { width: calc(100% - 2rem); }
          .foro-card { padding: 1rem; }
          .foro-card-arrow { display: none; }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// UTILIDADES MÁGICAS
// ═══════════════════════════════════════════════════════════════

function UtilidadesSec({ usuario }) {
  const [utilidad, setUtilidad] = useState(null);

  const UTILIDADES = [
    {
      id: 'luna',
      nombre: 'Fase Lunar',
      icono: '🌙',
      desc: 'Consulta la fase lunar actual y su energía',
      render: () => {
        const calcularFase = () => {
          const fecha = new Date();
          const cicloLunar = 29.530588853;
          const lunaLlena = new Date(2024, 0, 25);
          const diff = (fecha - lunaLlena) / (1000 * 60 * 60 * 24);
          const fase = ((diff % cicloLunar) + cicloLunar) % cicloLunar;
          if (fase < 1.84566) return { nombre: 'Luna Nueva', icono: '🌑', energia: 'Nuevos comienzos, siembra intenciones, introspección', ritual: 'Escribe tus intenciones en papel, medita sobre lo que quieres crear' };
          if (fase < 7.38264) return { nombre: 'Luna Creciente', icono: '🌒', energia: 'Manifestación, tomar acción, crecimiento', ritual: 'Trabaja activamente hacia tus metas, haz rituales de atracción' };
          if (fase < 9.22830) return { nombre: 'Cuarto Creciente', icono: '🌓', energia: 'Decisiones, compromiso, superar obstáculos', ritual: 'Toma decisiones importantes, rompe bloqueos' };
          if (fase < 14.76528) return { nombre: 'Luna Gibosa', icono: '🌔', energia: 'Refinamiento, paciencia, ajustes', ritual: 'Ajusta tus planes, ten paciencia, confía en el proceso' };
          if (fase < 16.61094) return { nombre: 'Luna Llena', icono: '🌕', energia: 'Culminación, gratitud, magia potente', ritual: 'Carga cristales, celebra logros, haz rituales poderosos' };
          if (fase < 22.14792) return { nombre: 'Luna Diseminante', icono: '🌖', energia: 'Compartir, gratitud, enseñar', ritual: 'Comparte tu sabiduría, practica gratitud' };
          if (fase < 23.99358) return { nombre: 'Cuarto Menguante', icono: '🌗', energia: 'Soltar, liberar, perdonar', ritual: 'Libera lo que no te sirve, rituales de limpieza' };
          return { nombre: 'Luna Balsámica', icono: '🌘', energia: 'Descanso, limpieza, preparación', ritual: 'Descansa, limpia espacios, prepárate para el nuevo ciclo' };
        };
        const fase = calcularFase();
        return (
          <div className="util-content">
            <div className="luna-actual">
              <span className="luna-icono">{fase.icono}</span>
              <h3>{fase.nombre}</h3>
            </div>
            <div className="luna-info">
              <div className="luna-energia">
                <strong>Energía:</strong>
                <p>{fase.energia}</p>
              </div>
              <div className="luna-ritual">
                <strong>Ritual sugerido:</strong>
                <p>{fase.ritual}</p>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: 'numerologia',
      nombre: 'Número del Día',
      icono: '🔢',
      desc: 'Tu número personal para hoy',
      render: () => {
        const hoy = new Date();
        const dia = hoy.getDate();
        const mes = hoy.getMonth() + 1;
        const anio = hoy.getFullYear();
        const suma = String(dia + mes + anio).split('').reduce((a, b) => a + parseInt(b), 0);
        const numero = suma > 9 ? String(suma).split('').reduce((a, b) => a + parseInt(b), 0) : suma;
        const significados = {
          1: { nombre: 'Liderazgo', mensaje: 'Día para iniciar proyectos, tomar la iniciativa. Tu energía es de creador/a.' },
          2: { nombre: 'Cooperación', mensaje: 'Día para trabajar en equipo, escuchar, ser diplomático/a. La paciencia es clave.' },
          3: { nombre: 'Creatividad', mensaje: 'Día para expresarte, crear, comunicar. Tu alegría inspira a otros.' },
          4: { nombre: 'Estabilidad', mensaje: 'Día para construir bases sólidas, organizar, planificar.' },
          5: { nombre: 'Cambio', mensaje: 'Día para aventurarte, cambiar rutinas, ser flexible.' },
          6: { nombre: 'Amor', mensaje: 'Día para nutrir relaciones, el hogar, la familia. El amor sana.' },
          7: { nombre: 'Introspección', mensaje: 'Día para meditar, estudiar, buscar respuestas internas.' },
          8: { nombre: 'Abundancia', mensaje: 'Día para manifestar, trabajar en proyectos materiales.' },
          9: { nombre: 'Completud', mensaje: 'Día para cerrar ciclos, soltar, servir a otros.' }
        };
        const sig = significados[numero] || significados[9];
        return (
          <div className="util-content">
            <div className="numero-dia">
              <span className="numero-grande">{numero}</span>
              <h3>{sig.nombre}</h3>
            </div>
            <p className="numero-mensaje">{sig.mensaje}</p>
            <small>Basado en {hoy.toLocaleDateString('es-UY')}</small>
          </div>
        );
      }
    },
    {
      id: 'color',
      nombre: 'Color del Día',
      icono: '🎨',
      desc: 'Qué color te favorece hoy',
      render: () => {
        const colores = [
          { nombre: 'Rojo', hex: '#e74c3c', energia: 'Pasión, energía, acción. Úsalo cuando necesites motivación.' },
          { nombre: 'Naranja', hex: '#e67e22', energia: 'Creatividad, alegría, socialización. Ideal para conectar.' },
          { nombre: 'Amarillo', hex: '#f1c40f', energia: 'Claridad mental, optimismo, intelecto. Bueno para estudiar.' },
          { nombre: 'Verde', hex: '#27ae60', energia: 'Sanación, equilibrio, naturaleza. Perfecto para sanar.' },
          { nombre: 'Azul', hex: '#3498db', energia: 'Calma, comunicación, verdad. Ideal para hablar desde el corazón.' },
          { nombre: 'Índigo', hex: '#8e44ad', energia: 'Intuición, espiritualidad, visión. Bueno para meditar.' },
          { nombre: 'Violeta', hex: '#9b59b6', energia: 'Transformación, conexión divina, magia. Día de rituales.' }
        ];
        const diaSemana = new Date().getDay();
        const color = colores[diaSemana];
        return (
          <div className="util-content">
            <div className="color-dia" style={{ background: color.hex }}>
              <span className="color-nombre">{color.nombre}</span>
            </div>
            <p className="color-energia">{color.energia}</p>
            <small>Color asociado al día de hoy</small>
          </div>
        );
      }
    },
    {
      id: 'afirmacion',
      nombre: 'Afirmación',
      icono: '✨',
      desc: 'Tu afirmación positiva del día',
      render: () => {
        const afirmaciones = [
          'Soy merecedor/a de todo lo bueno que la vida tiene para mí.',
          'Mi intuición me guía hacia las decisiones correctas.',
          'Cada día me acerco más a la versión más mágica de mí.',
          'El universo conspira a mi favor.',
          'Soy un imán para la abundancia y las bendiciones.',
          'Mi energía es poderosa y transforma todo lo que toca.',
          'Confío en el timing divino de mi vida.',
          'Soy luz, soy magia, soy poder.',
          'Libero lo que no me sirve y abrazo lo nuevo.',
          'Mis sueños son válidos y están en camino.',
          'La magia fluye a través de mí en todo momento.',
          'Merezco amor, paz y felicidad.'
        ];
        const hoy = new Date();
        const indice = (hoy.getDate() + hoy.getMonth()) % afirmaciones.length;
        return (
          <div className="util-content afirmacion-box">
            <div className="afirmacion-icono">✦</div>
            <p className="afirmacion-texto">"{afirmaciones[indice]}"</p>
            <small>Repetí esta afirmación 3 veces frente al espejo</small>
          </div>
        );
      }
    },
    {
      id: 'elemento',
      nombre: 'Elemento del Día',
      icono: '🌍',
      desc: 'Qué elemento te acompaña hoy',
      render: () => {
        const elementos = [
          { nombre: 'Tierra', icono: '🌿', color: '#27ae60', consejo: 'Conectá con la naturaleza, caminá descalza si podés. Hoy es buen día para la estabilidad y la práctica.' },
          { nombre: 'Agua', icono: '💧', color: '#3498db', consejo: 'Fluí con las emociones, tomá un baño ritual, limpiá con agua sagrada. Día de intuición.' },
          { nombre: 'Fuego', icono: '🔥', color: '#e74c3c', consejo: 'Encendé una vela, trabajá con tu pasión. Hoy es día de acción y transformación.' },
          { nombre: 'Aire', icono: '🌬️', color: '#9b59b6', consejo: 'Meditá, respirá profundo, quemá incienso. Día de claridad mental y comunicación.' }
        ];
        const diaDelAnio = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const elemento = elementos[diaDelAnio % 4];
        return (
          <div className="util-content">
            <div className="elemento-dia" style={{ background: elemento.color }}>
              <span className="elemento-icono">{elemento.icono}</span>
              <h3>{elemento.nombre}</h3>
            </div>
            <p className="elemento-consejo">{elemento.consejo}</p>
          </div>
        );
      }
    }
  ];

  if (utilidad) {
    const util = UTILIDADES.find(u => u.id === utilidad);
    return (
      <div className="sec">
        <button className="btn-back" onClick={() => setUtilidad(null)}>← Volver</button>
        <div className="util-header">
          <span className="util-icono-grande">{util.icono}</span>
          <h2>{util.nombre}</h2>
        </div>
        {util.render()}
      </div>
    );
  }

  return (
    <div className="sec">
      <div className="sec-head">
        <h1>⚡ Utilidades Mágicas</h1>
        <p>Herramientas diarias para tu práctica espiritual.</p>
      </div>

      <div className="utils-grid">
        {UTILIDADES.map(util => (
          <div key={util.id} className="util-card" onClick={() => setUtilidad(util.id)}>
            <span className="util-icono">{util.icono}</span>
            <h3>{util.nombre}</h3>
            <p>{util.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FAQ DUENDES
// ═══════════════════════════════════════════════════════════════

const FAQS = [
  {
    categoria: 'Sobre los Guardianes',
    preguntas: [
      {
        q: '¿Qué es un guardián/duende?',
        a: 'Los guardianes son seres elementales que canalizamos en forma física a través de figuras únicas. Cada uno tiene su propia energía, personalidad y propósito. No son simples decoraciones: son compañeros espirituales que te acompañan y protegen.'
      },
      {
        q: '¿Cómo se "activa" mi guardián?',
        a: 'Cada guardián viene ya activado energéticamente. Al recibirlo, te recomendamos presentarte (decirle tu nombre y bienvenirlo), colocarlo en un lugar especial, y hablarle como si fuera un amigo. La conexión se profundiza con el tiempo.'
      },
      {
        q: '¿Puedo tener más de un guardián?',
        a: '¡Absolutamente! Muchas personas tienen varios guardianes, cada uno con diferentes propósitos. Algunos protegen el hogar, otros acompañan la meditación, otros cuidan los sueños. Entre ellos se llevan bien.'
      },
      {
        q: '¿Los guardianes se rompen o dañan?',
        a: 'Físicamente son muy resistentes, pero si alguna vez se daña, no significa que la energía se haya ido. IMPORTANTE: No realizamos reparaciones de guardianes. Si tu guardián se daña, podés agradecerle por su servicio y enterrarlo en la tierra para devolver su energía a la naturaleza.'
      }
    ]
  },
  {
    categoria: 'Tu Compra',
    preguntas: [
      {
        q: '¿Qué es el certificado de canalización?',
        a: 'Es el documento digital oficial que acompaña a cada guardián. Incluye el nombre del guardián, la fecha en que fue canalizado y un mensaje único que el guardián tiene para vos. Es 100% digital: lo podés ver y descargar desde acá en Mi Magia, disponible 24 horas después de tu compra.'
      },
      {
        q: '¿Puedo comprar como regalo?',
        a: 'Sí, en el checkout tenés la opción "Es un regalo". Ahí elegís si es sorpresa o no. Si no es sorpresa, el destinatario recibe un formulario para completar su información y así la canalización se hace con sus datos. Si es sorpresa, vos completás lo que sabés sobre esa persona para que la canalización sea lo más personalizada posible.'
      },
      {
        q: '¿Qué incluye la compra de un guardián?',
        a: 'Tu guardián llega con todo: la figura física articulada hecha a mano, acceso al certificado de canalización digital con su mensaje único desde Mi Magia, acceso al portal donde gestionás tu colección, y runas de bienvenida para que empieces a explorar las experiencias mágicas disponibles.'
      }
    ]
  },
  {
    categoria: 'Runas y Tréboles',
    preguntas: [
      {
        q: '¿Qué son las runas?',
        a: 'Las runas (ᚱ) son nuestra moneda mágica para experiencias. Las podés obtener de tres formas: comprándolas directamente en packs, recibiéndolas como beneficio de tu membresía del Círculo, o como regalo especial en ocasiones. Las usás para acceder a lecturas, tiradas, y experiencias espirituales personalizadas. NO se ganan al comprar guardianes.'
      },
      {
        q: '¿Qué son los tréboles?',
        a: 'Los tréboles (☘️) son nuestra moneda de fidelidad. Ganás 1 trébol por cada $10 USD (o equivalente en pesos uruguayos) que gastás en la tienda. Podés canjearlos por descuentos, envío gratis, días de Círculo, productos y más. A veces también los regalamos en ocasiones especiales.'
      },
      {
        q: '¿Las runas y tréboles expiran?',
        a: 'No, nunca expiran. Permanecen en tu cuenta para siempre hasta que decidas usarlos.'
      }
    ]
  },
  {
    categoria: 'El Círculo de Duendes',
    preguntas: [
      {
        q: '¿Qué es el Círculo?',
        a: 'El Círculo de Duendes es nuestra membresía premium. Te da acceso a contenido exclusivo semanal, runas y tréboles extra cada mes, tiradas gratuitas, acceso anticipado a nuevos guardianes, y más beneficios según tu plan.'
      },
      {
        q: '¿Puedo cancelar cuando quiera?',
        a: 'Sí, podés cancelar en cualquier momento. Tu acceso continúa hasta el final del período pagado.'
      },
      {
        q: '¿Qué incluye cada plan?',
        a: 'Cada plan tiene beneficios diferentes. Consultá la sección Círculo en Mi Magia para ver el detalle de runas, tréboles, tiradas y descuentos de cada uno.'
      }
    ]
  },
  {
    categoria: 'Envíos y Pedidos',
    preguntas: [
      {
        q: '¿Hacen envíos internacionales?',
        a: '¡Sí! Enviamos a todo el mundo. Los guardianes viajan con mucho amor y protección. El envío internacional es por DHL y tarda aproximadamente 7-15 días.'
      },
      {
        q: '¿Cuánto tarda mi pedido?',
        a: 'En Uruguay: 2-5 días hábiles. Internacional: 7-15 días. Cada guardián es único y a veces necesitamos unos días extra para prepararlo con el cuidado que merece.'
      },
      {
        q: '¿Puedo rastrear mi pedido?',
        a: 'Sí, te enviamos el número de seguimiento por email cuando tu guardián sale de viaje hacia vos.'
      }
    ]
  },
  {
    categoria: 'Cristales y Energía',
    preguntas: [
      {
        q: '¿Cómo limpio mis cristales?',
        a: 'Hay varias formas: luz de luna (ideal luna llena), humo de salvia o palo santo, enterrarlos en sal gruesa por 24h, o ponerlos sobre selenita. Cada cristal tiene sus preferencias - consultá nuestra guía de cristales.'
      },
      {
        q: '¿Cada cuánto debo limpiarlos?',
        a: 'Depende del uso. Si trabajás mucho con ellos, una vez por semana. Si son decorativos, una vez al mes en luna llena es suficiente. Confía en tu intuición - si sentís que lo necesitan, limpiálos.'
      }
    ]
  },
  {
    categoria: 'Acceso y Login',
    preguntas: [
      {
        q: '¿Cómo entro a Mi Magia?',
        a: 'Para entrar solo necesitás tu email. Vas a /mi-magia, ponés tu email, y te enviamos un "enlace mágico" que te permite entrar sin contraseña. El enlace es válido por 30 minutos.'
      },
      {
        q: '¿Por qué no usan contraseña?',
        a: 'Usamos "Magic Link" (enlace mágico) porque es más seguro y más fácil. No tenés que recordar ninguna contraseña, no hay riesgo de que te la roben, y es más rápido. Es el mismo sistema que usan apps como Notion y Slack.'
      },
      {
        q: '¿Tengo que pedir el enlace cada vez?',
        a: 'No. Una vez que entrás, quedás conectada por 30 días en ese dispositivo. Solo necesitás pedir un nuevo enlace si: cambiás de dispositivo, borrás los datos del navegador, o pasaron más de 30 días.'
      },
      {
        q: '¿Y si no me llega el email?',
        a: 'Revisá la carpeta de spam o correo no deseado. Si no está ahí, esperá unos minutos y volvé a intentar. Si sigue sin llegar, escribinos a hola@duendesuy.com'
      },
      {
        q: '¿Es seguro?',
        a: 'Muy seguro. El enlace es único, expira en 30 minutos, y solo funciona una vez. Nadie puede entrar a tu cuenta sin acceso a tu email.'
      }
    ]
  },
  {
    categoria: 'Guía y Tour',
    preguntas: [
      {
        q: '¿Cómo funciona Mi Magia?',
        a: 'Mi Magia es tu portal personal en Duendes del Uruguay. Desde acá podés usar tus runas para experiencias, escribir en tu grimorio, ver tus guardianes adoptados, y acceder al Círculo si sos miembro.',
        esTour: true
      },
      {
        q: '¿Qué puedo hacer con las runas?',
        a: 'Las runas te permiten acceder a experiencias como tiradas de runas, susurros del guardián, oráculos del mes, lecturas del alma y más. Cada experiencia tiene un costo diferente en runas.'
      },
      {
        q: '¿Qué es el Grimorio?',
        a: 'El Grimorio es tu diario mágico personal. Podés escribir tus sueños, reflexiones, rituales que hiciste, y ver el calendario lunar para planificar tus prácticas. Todo queda guardado para siempre.'
      },
      {
        q: '¿Puedo volver a ver el tour de bienvenida?',
        a: 'Sí, podés ver el tour cuando quieras tocando el botón "Ver Tour" más abajo.',
        mostrarBotonTour: true
      }
    ]
  }
];

function FaqSec({ onVerTour }) {
  const [categoriaAbierta, setCategoriaAbierta] = useState(FAQS[0].categoria);
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  return (
    <div className="sec">
      <div className="sec-head">
        <h1>❓ Preguntas Frecuentes</h1>
        <p>Todo lo que necesitás saber sobre Duendes del Uruguay.</p>
      </div>

      <div className="faq-categorias">
        {FAQS.map(cat => (
          <button
            key={cat.categoria}
            className={`faq-cat ${categoriaAbierta === cat.categoria ? 'act' : ''}`}
            onClick={() => { setCategoriaAbierta(cat.categoria); setPreguntaAbierta(null); }}
          >
            {cat.categoria}
          </button>
        ))}
      </div>

      <div className="faq-lista">
        {FAQS.find(c => c.categoria === categoriaAbierta)?.preguntas.map((faq, i) => (
          <div
            key={i}
            className={`faq-item ${preguntaAbierta === i ? 'abierta' : ''}`}
          >
            <button
              className="faq-pregunta"
              onClick={() => setPreguntaAbierta(preguntaAbierta === i ? null : i)}
            >
              <span>{faq.q}</span>
              <span className="faq-arrow">{preguntaAbierta === i ? '−' : '+'}</span>
            </button>
            {preguntaAbierta === i && (
              <div className="faq-respuesta">
                <p>{faq.a}</p>
                {faq.mostrarBotonTour && onVerTour && (
                  <button className="btn-gold btn-tour-faq" onClick={onVerTour}>
                    ✨ Ver Tour de Mi Magia
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {categoriaAbierta === 'Guía y Tour' && onVerTour && (
        <div className="faq-tour-box">
          <div className="tour-box-content">
            <span className="tour-box-icon">🎓</span>
            <div>
              <h3>¿Primera vez acá?</h3>
              <p>Hacé el tour para conocer todo lo que podés hacer en Mi Magia.</p>
            </div>
          </div>
          <button className="btn-gold" onClick={onVerTour}>
            ✨ Iniciar Tour
          </button>
        </div>
      )}

      <div className="faq-contacto">
        <h3>¿No encontraste lo que buscabas?</h3>
        <p>Escribinos y te ayudamos.</p>
        <a href="https://wa.me/59898690629" target="_blank" rel="noopener" className="btn-gold">
          💬 Contactar por WhatsApp
        </a>
      </div>

      <style jsx>{`
        .btn-tour-faq {
          margin-top: 1rem;
          display: block;
        }
        .faq-tour-box {
          background: linear-gradient(135deg, #1a1a0a 0%, #111 100%);
          border: 1px solid #d4af3740;
          border-radius: 12px;
          padding: 1.5rem;
          margin: 2rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .tour-box-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .tour-box-icon {
          font-size: 2.5rem;
        }
        .tour-box-content h3 {
          margin: 0 0 0.3rem;
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 1.1rem;
        }
        .tour-box-content p {
          margin: 0;
          color: rgba(255,255,255,0.7);
          font-size: 0.95rem;
        }
        @media (max-width: 500px) {
          .faq-tour-box {
            flex-direction: column;
            text-align: center;
          }
          .tour-box-content {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TITO
// ═══════════════════════════════════════════════════════════════

// BURBUJA DE SUGERENCIAS DE TITO
// DEPRECATED: Usar TitoBurbuja importado desde ./components/Tito
function TitoBurbujaLocal({ usuario, onAbrir }) {
  const [sugerencia, setSugerencia] = useState(null);
  const [visible, setVisible] = useState(false);
  const [cerrada, setCerrada] = useState(false);

  useEffect(() => {
    if (!usuario?.email || cerrada) return;

    // Esperar 3 segundos antes de mostrar la burbuja
    const timer = setTimeout(() => {
      cargarSugerencia();
    }, 3000);

    return () => clearTimeout(timer);
  }, [usuario?.email, cerrada]);

  async function cargarSugerencia() {
    try {
      const res = await fetch('/api/tito/sugerencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario?.email })
      });
      const data = await res.json();

      if (data.success && data.sugerencias?.length > 0) {
        // Mostrar la primera sugerencia de mayor prioridad
        setSugerencia(data.sugerencias[0]);
        setVisible(true);

        // Ocultar después de 15 segundos
        setTimeout(() => {
          setVisible(false);
        }, 15000);
      }
    } catch (err) {
      console.error('Error cargando sugerencias:', err);
    }
  }

  function cerrarBurbuja() {
    setVisible(false);
    setCerrada(true);
  }

  function handleClick() {
    cerrarBurbuja();
    onAbrir();
  }

  if (!visible || !sugerencia) return null;

  return (
    <div className="tito-burbuja" onClick={handleClick}>
      <button className="burbuja-cerrar" onClick={(e) => { e.stopPropagation(); cerrarBurbuja(); }}>✕</button>
      <div className="burbuja-contenido">
        <span className="burbuja-avatar">
          <img src={TITO_IMG} alt="Tito" onError={e => e.target.style.display='none'} />
        </span>
        <div className="burbuja-mensaje">
          <p>{sugerencia.mensaje}</p>
          {sugerencia.producto && (
            <span className="burbuja-tag">{sugerencia.producto.tipo === 'experiencia' ? `${sugerencia.producto.precio} runas` : `$${sugerencia.producto.precio}`}</span>
          )}
        </div>
      </div>
      <style jsx>{`
        .tito-burbuja {
          position: fixed;
          bottom: 140px;
          right: 1.5rem;
          max-width: 280px;
          background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 15px;
          padding: 12px 15px;
          cursor: pointer;
          z-index: 998;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          animation: burbujaEntrar 0.5s ease;
        }
        @keyframes burbujaEntrar {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .burbuja-cerrar {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          background: #333;
          border: 1px solid #555;
          border-radius: 50%;
          color: #999;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .burbuja-cerrar:hover {
          background: #444;
          color: #fff;
        }
        .burbuja-contenido {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .burbuja-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #d4af37;
          flex-shrink: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .burbuja-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .burbuja-mensaje {
          flex: 1;
        }
        .burbuja-mensaje p {
          color: #FDF8F0;
          font-size: 13px;
          line-height: 1.4;
          margin: 0;
          font-family: 'Cormorant Garamond', serif;
        }
        .burbuja-tag {
          display: inline-block;
          margin-top: 6px;
          background: rgba(212, 175, 55, 0.2);
          color: #d4af37;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 10px;
        }
        @media (max-width: 768px) {
          .tito-burbuja {
            bottom: 130px;
            right: 10px;
            max-width: 250px;
          }
        }
      `}</style>
    </div>
  );
}

// DEPRECATED: Usar Tito importado desde ./components/Tito
function TitoLocal({ usuario, abierto, setAbierto }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [env, setEnv] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const enviar = async () => {
    if (!input.trim() || env) return;
    const m = input.trim(); setInput('');
    const nuevosMsgs = [...msgs, { r: 'u', t: m }];
    setMsgs(nuevosMsgs); setEnv(true);
    try {
      const historial = nuevosMsgs.slice(-10).map(msg => ({
        role: msg.r === 'u' ? 'user' : 'assistant',
        content: msg.t
      }));
      const contexto = `[CONTEXTO MI MAGIA: Usuario con ${usuario?.runas||0} runas, ${usuario?.treboles||0} tréboles. Secciones: Canalizaciones (guardianes, lecturas, regalos), Jardín de Tréboles (tréboles/runas), Experiencias (lecturas mágicas), Regalos, Reino Elemental, Cuidados, Cristales, Círculo (membresía), Grimorio (lecturas y diario). 1 trébol = $10 USD. Runas para experiencias.]
IMPORTANTE: Mantené el contexto de la conversación. Si el usuario dice "ayudame" o "sí" o "dale", referite a lo que acabás de decir/ofrecer.
FORMATO: Usá párrafos cortos separados por líneas en blanco. NO escribas todo junto. Hacé el texto fácil de leer.
Mensaje actual: ${m}`;
      const res = await fetch(`${API_BASE}/api/tito/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: contexto, email: usuario?.email, history: historial }) });
      const data = await res.json();
      setMsgs(prev => [...prev, { r: 't', t: data.response || 'Hubo un error, intentá de nuevo.' }]);
    } catch(e) { setMsgs(prev => [...prev, { r: 't', t: 'Error de conexión.' }]); }
    setEnv(false);
  };

  // ESTILOS FORZADOS PARA MÓVIL - Sin depender de CSS externo
  const mobile = mounted && isMobile;
  const btnStyle = {
    position: 'fixed',
    bottom: mobile ? '12px' : '1.5rem',
    right: mobile ? '12px' : '1.5rem',
    width: mobile ? '52px' : '60px',
    height: mobile ? '52px' : '60px',
    borderRadius: '50%',
    background: '#1a1a1a',
    border: '2px solid #d4af37',
    cursor: 'pointer',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent'
  };
  // CHAT: Ancho fijo calculado para no causar overflow
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
  const chatWidth = mobile ? Math.min(screenWidth - 20, 380) : 340;
  const chatStyle = {
    position: 'fixed',
    zIndex: 999,
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxSizing: 'border-box',
    bottom: mobile ? '70px' : '6rem',
    right: mobile ? '10px' : '1.5rem',
    width: `${chatWidth}px`,
    maxWidth: mobile ? 'calc(100vw - 20px)' : '340px',
    maxHeight: mobile ? '50vh' : '450px'
  };
  // MENSAJES: Forzar saltos de línea
  const msgStyle = {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: '1.6',
    margin: 0,
    fontSize: mobile ? '0.85rem' : '0.9rem'
  };

  return (
    <>
      <button
        style={btnStyle}
        onClick={() => setAbierto(!abierto)}
        onTouchEnd={(e) => { e.preventDefault(); setAbierto(!abierto); }}
        aria-label="Abrir chat con Tito"
      >
        <img src={TITO_IMG} alt="Tito" style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute'}} onError={e => e.target.style.display='none'} />
        <span style={{fontFamily:'Cinzel,serif',fontSize:'1.5rem',color:'#d4af37'}}>T</span>
      </button>
      {abierto && (
        <div style={chatStyle}>
          <div className="tito-head" style={{padding: mobile ? '0.6rem' : '1rem', background:'#1a1a1a', display:'flex', alignItems:'center', gap:'0.75rem'}}>
            <img src={TITO_IMG} alt="" style={{width: mobile ? '28px' : '36px', height: mobile ? '28px' : '36px', borderRadius:'50%',objectFit:'cover'}} onError={e => e.target.style.display='none'} />
            <div style={{flex:1}}><strong style={{display:'block',color:'#d4af37',fontFamily:'Cinzel,serif',fontSize:'0.9rem'}}>Tito</strong><small style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.6)'}}>Tu guía</small></div>
            <button onClick={() => setAbierto(false)} onTouchEnd={(e) => { e.preventDefault(); setAbierto(false); }} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:'1.1rem',cursor:'pointer',padding:'8px'}}>✕</button>
          </div>
          <div style={{flex:1,padding: mobile ? '0.6rem' : '1rem',overflowY:'auto',display:'flex',flexDirection:'column',gap:'0.6rem',maxHeight: mobile ? '35vh' : '300px', background:'#fff'}}>
            <div style={{background:'#f5f5f5',padding:'0.6rem 0.9rem',borderRadius:'12px',maxWidth:'85%',alignSelf:'flex-start'}}><p style={msgStyle}>¡Hola {usuario?.nombrePreferido}! Soy Tito. Preguntame lo que necesites.</p></div>
            {msgs.map((m,i) => <div key={i} style={{background: m.r==='u' ? '#1a1a1a' : '#f5f5f5', color: m.r==='u' ? '#fff' : '#1a1a1a', padding:'0.6rem 0.9rem', borderRadius:'12px', maxWidth:'85%', alignSelf: m.r==='u' ? 'flex-end' : 'flex-start'}}><p style={msgStyle}>{m.t}</p></div>)}
            {env && <div style={{background:'#f5f5f5',padding:'0.6rem 0.9rem',borderRadius:'12px',maxWidth:'85%',alignSelf:'flex-start'}}><p style={msgStyle}>...</p></div>}
          </div>
          <div style={{display:'flex',gap:'0.5rem',padding: mobile ? '0.5rem' : '0.75rem',borderTop:'1px solid #f0f0f0',background:'#fff'}}>
            <input placeholder="Tu pregunta..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key==='Enter' && enviar()} style={{flex:1,padding:'0.6rem 1rem',border:'1px solid #e0e0e0',borderRadius:'50px',fontSize:'16px',fontFamily:'Cormorant Garamond,serif'}} />
            <button onClick={enviar} disabled={env} style={{width:'36px',height:'36px',borderRadius:'50%',background:env?'#ddd':'#d4af37',border:'none',color:'#1a1a1a',fontSize:'1.1rem',cursor:env?'not-allowed':'pointer'}}>→</button>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPORT CON SUSPENSE BOUNDARY
// ═══════════════════════════════════════════════════════════════

export default function MiMagiaPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#C6A962'
      }}>
        <p>Cargando Mi Magia...</p>
      </div>
    }>
      <MiMagiaContent />
    </Suspense>
  );
}
