'use client';
import { useState } from 'react';
import { WORDPRESS_URL, limpiarTexto } from './constants';

// ═══════════════════════════════════════════════════════════════
// MIS CANALIZACIONES (antes Santuario)
// ═══════════════════════════════════════════════════════════════

export default function SeccionCanalizaciones({ usuario }) {
  const [tab, setTab] = useState('guardianes');
  const [canalizacionAbierta, setCanalizacionAbierta] = useState(null);

  const guardianes = usuario?.guardianes || [];
  const talismanes = usuario?.talismanes || [];
  const libros = usuario?.libros || [];
  const lecturas = usuario?.lecturas || [];
  const regalosHechos = usuario?.regalosHechos || [];
  const regalosRecibidos = usuario?.regalosRecibidos || [];

  // Buscar canalización para un guardián (prioriza match fuerte antes de caer a ordenId)
  const getCanalizacion = (guardian) => {
    return lecturas.find(l =>
      (l.guardianId && l.guardianId === guardian.id) ||
      (l.guardian?.id && l.guardian.id === guardian.id) ||
      l.guardian?.nombre === guardian.nombre
    ) || lecturas.find(l => l.ordenId === guardian.ordenId);
  };

  // Estado de canalización
  const getEstadoCana = (cana) => {
    if (!cana) return { texto: 'Pendiente', color: '#888', icono: '⏳' };
    if (cana.estado === 'enviada' || cana.contenido) return { texto: 'Lista', color: '#2ecc71', icono: '✓' };
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
                      {cana && (cana.estado === 'enviada' || cana.contenido) ? (
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
              <h2>Canalización de {canalizacionAbierta.guardianNombre || canalizacionAbierta.guardian?.nombre || canalizacionAbierta.titulo?.replace('Canalización de ', '') || 'tu Guardián'}</h2>
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
            <div className="lecturas-list">{lecturas.map((l,i) => <div key={i} className="lectura-item"><span className="lec-fecha">{new Date(l.fecha).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })}</span><h4>{l.titulo || l.tipo}</h4><p>{l.resumen || l.contenido?.substring(0, 200)}...</p><button className="btn-sec" onClick={() => setCanalizacionAbierta(l)}>Ver completa</button></div>)}</div>
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
