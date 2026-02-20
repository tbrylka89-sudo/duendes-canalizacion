'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import './mi-magia.css';

const API_BASE = '';
const WORDPRESS_URL = 'https://duendesdeluruguay.com';

// ═══════════════════════════════════════════════════════════════
// MI MAGIA - VERSIÓN SIMPLIFICADA Y ELEGANTE
// ═══════════════════════════════════════════════════════════════

function MiMagiaContent() {
  const searchParams = useSearchParams();
  const seccionInicial = searchParams.get('seccion') || 'inicio';

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [necesitaLogin, setNecesitaLogin] = useState(false);
  const [seccion, setSeccion] = useState(seccionInicial);
  const [token, setToken] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    const params = new URLSearchParams(window.location.search);
    let t = params.get('token');

    if (!t) {
      t = localStorage.getItem('mimagia_token');
    }

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
        localStorage.setItem('mimagia_token', t);
        if (params.get('token')) {
          window.history.replaceState({}, '', '/mi-magia');
        }
      } else {
        localStorage.removeItem('mimagia_token');
        setNecesitaLogin(true);
      }
    } catch (e) {
      console.error(e);
      setNecesitaLogin(true);
    }
    setCargando(false);
  };

  if (cargando) return <Cargando />;
  if (necesitaLogin) return <LoginMagicLink />;

  const secciones = [
    { id: 'inicio', nombre: 'Inicio', icono: '◇' },
    { id: 'guardianes', nombre: 'Mis Guardianes', icono: '◆' },
    { id: 'estudios', nombre: 'Estudios', icono: '☽' },
    { id: 'runas', nombre: 'Runas', icono: 'ᚱ' },
    { id: 'contenido', nombre: 'Sabiduría', icono: '✦' },
    { id: 'grimorio', nombre: 'Grimorio', icono: '▣' }
  ];

  return (
    <div className="mi-magia-app">
      {/* Header elegante */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-symbol">✦</span>
            <span className="logo-text">MI MAGIA</span>
          </div>

          <nav className="nav-desktop">
            {secciones.map(s => (
              <button
                key={s.id}
                className={`nav-btn ${seccion === s.id ? 'activo' : ''}`}
                onClick={() => setSeccion(s.id)}
              >
                <span className="nav-icono">{s.icono}</span>
                <span className="nav-nombre">{s.nombre}</span>
              </button>
            ))}
          </nav>

          <button className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* Menú móvil */}
      {menuAbierto && (
        <>
          <div className="overlay" onClick={() => setMenuAbierto(false)} />
          <nav className="nav-mobile">
            {secciones.map(s => (
              <button
                key={s.id}
                className={`nav-btn-mobile ${seccion === s.id ? 'activo' : ''}`}
                onClick={() => { setSeccion(s.id); setMenuAbierto(false); }}
              >
                <span className="nav-icono">{s.icono}</span>
                <span className="nav-nombre">{s.nombre}</span>
              </button>
            ))}
            <div className="nav-separator" />
            <a href={`${WORDPRESS_URL}/shop/`} target="_blank" rel="noopener" className="nav-link-externo">
              Tienda Mágica ↗
            </a>
          </nav>
        </>
      )}

      {/* Contenido principal */}
      <main className="contenido-principal">
        {seccion === 'inicio' && <SeccionInicio usuario={usuario} ir={setSeccion} />}
        {seccion === 'guardianes' && <SeccionGuardianes usuario={usuario} />}
        {seccion === 'estudios' && <SeccionEstudios usuario={usuario} token={token} setUsuario={setUsuario} />}
        {seccion === 'runas' && <SeccionRunas usuario={usuario} ir={setSeccion} />}
        {seccion === 'contenido' && <SeccionContenido />}
        {seccion === 'grimorio' && <SeccionGrimorio usuario={usuario} token={token} setUsuario={setUsuario} />}
      </main>

      {/* Footer sutil */}
      <footer className="footer">
        <p>Duendes del Uruguay · Tu espacio mágico personal</p>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTES DE CARGA Y LOGIN
// ═══════════════════════════════════════════════════════════════

function Cargando() {
  return (
    <div className="pantalla-carga">
      <div className="carga-contenido">
        <div className="carga-simbolo">✦</div>
        <p>Preparando tu magia...</p>
      </div>
    </div>
  );
}

function LoginMagicLink() {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const enviarMagicLink = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Ingresá un email válido');
      return;
    }

    setEnviando(true);
    setError('');

    try {
      const res = await fetch('/api/mi-magia/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (data.success) {
        setEnviado(true);
      } else {
        setError(data.error || 'Error al enviar. Intentá de nuevo.');
      }
    } catch (e) {
      setError('Error de conexión. Intentá de nuevo.');
    }
    setEnviando(false);
  };

  return (
    <div className="pantalla-login">
      <div className="login-card">
        <div className="login-header">
          <span className="login-simbolo">✦</span>
          <h1>Mi Magia</h1>
          <p>Tu espacio personal en Duendes del Uruguay</p>
        </div>

        {!enviado ? (
          <form onSubmit={enviarMagicLink} className="login-form">
            <div className="campo">
              <label>Tu email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={enviando}
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={enviando} className="btn-dorado">
              {enviando ? 'Enviando...' : 'Enviar enlace mágico'}
            </button>

            <p className="login-nota">
              Te enviaremos un enlace seguro a tu email para acceder.
              Sin contraseñas, sin complicaciones.
            </p>
          </form>
        ) : (
          <div className="login-exito">
            <span className="exito-icono">✓</span>
            <h2>¡Enlace enviado!</h2>
            <p>Revisá tu casilla de email (y spam) y hacé click en el enlace mágico.</p>
            <button onClick={() => { setEnviado(false); setEmail(''); }} className="btn-secundario">
              Usar otro email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECCIÓN INICIO
// ═══════════════════════════════════════════════════════════════

function SeccionInicio({ usuario, ir }) {
  const nombre = usuario?.nombrePreferido || usuario?.nombre || 'viajera';
  const guardianes = usuario?.guardianes || [];
  const tieneGuardianes = guardianes.length > 0;

  const saludoHora = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <section className="seccion seccion-inicio">
      <div className="inicio-bienvenida">
        <p className="saludo-hora">{saludoHora()},</p>
        <h1 className="nombre-usuario">{nombre}</h1>
        <p className="mensaje-bienvenida">
          Bienvenida a tu espacio mágico personal
        </p>
      </div>

      <div className="inicio-cards">
        {tieneGuardianes ? (
          <div className="card card-destacada" onClick={() => ir('guardianes')}>
            <div className="card-icono">◆</div>
            <h3>Mis Guardianes</h3>
            <p>Tenés {guardianes.length} guardián{guardianes.length > 1 ? 'es' : ''} a tu lado</p>
            <span className="card-link">Ver mis guardianes →</span>
          </div>
        ) : (
          <div className="card card-vacia">
            <div className="card-icono">◇</div>
            <h3>Tu primer guardián te espera</h3>
            <p>Cuando adoptes un guardián, aparecerá acá con su canalización personal</p>
            <a href={`${WORDPRESS_URL}/shop/`} target="_blank" rel="noopener" className="btn-dorado-sm">
              Explorar guardianes ↗
            </a>
          </div>
        )}

        <div className="card card-destacada" onClick={() => ir('estudios')}>
          <div className="card-icono">☽</div>
          <h3>Estudios Místicos</h3>
          <p>Lecturas, numerología, registros akáshicos y más</p>
          <span className="card-link">Explorar estudios →</span>
        </div>

        <div className="card" onClick={() => ir('runas')}>
          <div className="card-icono">ᚱ</div>
          <h3>Runas de Poder</h3>
          <p>Tenés {usuario?.runas || 0} runas para experiencias mágicas</p>
          <span className="card-link">Ver runas →</span>
        </div>

        <div className="card" onClick={() => ir('contenido')}>
          <div className="card-icono">✦</div>
          <h3>Sabiduría Guardiana</h3>
          <p>Cuidados, rituales y secretos ancestrales</p>
          <span className="card-link">Explorar →</span>
        </div>

        <div className="card" onClick={() => ir('grimorio')}>
          <div className="card-icono">▣</div>
          <h3>Tu Grimorio</h3>
          <p>Tu diario mágico personal</p>
          <span className="card-link">Escribir →</span>
        </div>
      </div>

      <div className="inicio-mensaje">
        <p>
          "Los guardianes no llegan por casualidad. Cada uno encuentra a su humano
          en el momento exacto en que más lo necesita."
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECCIÓN MIS GUARDIANES
// ═══════════════════════════════════════════════════════════════

function SeccionGuardianes({ usuario }) {
  const [canalizacionAbierta, setCanalizacionAbierta] = useState(null);
  const guardianes = usuario?.guardianes || [];
  const lecturas = usuario?.lecturas || [];

  // Buscar canalización para un guardián
  const getCanalizacion = (guardian) => {
    return lecturas.find(l =>
      (l.guardianId && l.guardianId === guardian.id) ||
      (l.guardian?.id && l.guardian.id === guardian.id) ||
      l.guardian?.nombre === guardian.nombre
    ) || lecturas.find(l => l.ordenId === guardian.ordenId);
  };

  // Descargar certificado
  const descargarCertificado = (ordenId) => {
    window.open(`/api/certificado?order=${ordenId}`, '_blank');
  };

  if (guardianes.length === 0) {
    return (
      <section className="seccion seccion-guardianes">
        <div className="seccion-header">
          <h1>Mis Guardianes</h1>
          <p>Tu familia mágica personal</p>
        </div>

        <div className="vacio-elegante">
          <div className="vacio-simbolo">◇</div>
          <h2>Tu primer guardián te está esperando</h2>
          <p>
            Hay guardianes que esperan pacientemente a que su humano los encuentre.
            Cuando lo hagas, aparecerá acá con su historia, su canalización personal,
            y su certificado de adopción.
          </p>
          <a href={`${WORDPRESS_URL}/shop/`} target="_blank" rel="noopener" className="btn-dorado">
            Explorar guardianes ↗
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="seccion seccion-guardianes">
      <div className="seccion-header">
        <h1>Mis Guardianes</h1>
        <p>{guardianes.length} compañero{guardianes.length > 1 ? 's' : ''} mágico{guardianes.length > 1 ? 's' : ''}</p>
      </div>

      <div className="guardianes-grid">
        {guardianes.map((guardian, idx) => {
          const cana = getCanalizacion(guardian);
          const tieneCana = cana && (cana.estado === 'enviada' || cana.contenido);

          return (
            <div key={idx} className="guardian-card">
              <div className="guardian-imagen">
                {guardian.imagen ? (
                  <img src={guardian.imagen} alt={guardian.nombre} />
                ) : (
                  <div className="guardian-placeholder">◆</div>
                )}
              </div>

              <div className="guardian-info">
                <h3>{guardian.nombre}</h3>
                <div className="guardian-meta">
                  {guardian.tipo && <span className="guardian-tipo">{guardian.tipo}</span>}
                  {guardian.categoria && <span className="guardian-categoria">{guardian.categoria}</span>}
                </div>
                <p className="guardian-fecha">
                  Adoptado el {guardian.fecha || 'recientemente'}
                </p>
                {guardian.paraQuien && (
                  <p className="guardian-para">Para: {guardian.paraQuien}</p>
                )}
              </div>

              <div className="guardian-acciones">
                {tieneCana ? (
                  <button
                    className="btn-cana"
                    onClick={() => setCanalizacionAbierta(cana)}
                  >
                    ✦ Ver Canalización
                  </button>
                ) : guardian.formularioPendiente ? (
                  <a
                    href={`https://duendesdeluruguay.com/formulario-canalizacion/?order=${guardian.ordenId}`}
                    className="btn-formulario-pendiente"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="formulario-icono">📝</span>
                    <span>Completá tu formulario</span>
                    <small>Para recibir tu canalización personalizada</small>
                  </a>
                ) : guardian.formularioCompletado ? (
                  <div className="cana-pendiente formulario-ok">
                    <span className="pendiente-icono">✓</span>
                    <span>Formulario completado</span>
                    <small>Tu canalización está en preparación</small>
                  </div>
                ) : (
                  <div className="cana-pendiente">
                    <span className="pendiente-icono">⏳</span>
                    <span>Canalización en preparación</span>
                    <small>Estará lista en 4-24 horas</small>
                  </div>
                )}

                {guardian.ordenId && (
                  <button
                    className="btn-certificado"
                    onClick={() => descargarCertificado(guardian.ordenId)}
                  >
                    📜 Descargar Certificado
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Canalización */}
      {canalizacionAbierta && (
        <div className="modal-overlay" onClick={() => setCanalizacionAbierta(null)}>
          <div className="modal-cana" onClick={e => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setCanalizacionAbierta(null)}>×</button>

            <div className="modal-header">
              <span className="modal-simbolo">✦</span>
              <h2>
                Canalización de {canalizacionAbierta.guardianNombre ||
                  canalizacionAbierta.guardian?.nombre ||
                  canalizacionAbierta.titulo?.replace('Canalización de ', '') ||
                  'tu Guardián'}
              </h2>
              {canalizacionAbierta.paraQuien && (
                <p className="modal-para">Para: {canalizacionAbierta.paraQuien}</p>
              )}
            </div>

            <div className="modal-contenido">
              {canalizacionAbierta.contenido?.split('\n').map((parrafo, i) => (
                parrafo.trim() && <p key={i}>{parrafo}</p>
              ))}
            </div>

            <div className="modal-footer">
              <small>✦ Esta canalización fue creada especialmente para ti</small>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECCIÓN RUNAS DE PODER
// ═══════════════════════════════════════════════════════════════

function SeccionRunas({ usuario, ir }) {
  const runasActuales = usuario?.runas || 0;

  // Paquetes de runas (coinciden con productos en WooCommerce)
  const paquetes = [
    {
      id: 'chispa',
      nombre: 'Chispa',
      runas: 30,
      precio: 5,
      bonus: 0,
      slug: 'paquete-runas-30',
      descripcion: 'Perfecto para empezar'
    },
    {
      id: 'destello',
      nombre: 'Destello',
      runas: 90,
      precio: 10,
      bonus: 10,
      slug: 'paquete-runas-80',
      popular: true,
      descripcion: '80 + 10 de regalo'
    },
    {
      id: 'resplandor',
      nombre: 'Resplandor',
      runas: 240,
      precio: 20,
      bonus: 40,
      slug: 'paquete-runas-200',
      descripcion: '200 + 40 de regalo'
    },
    {
      id: 'fulgor',
      nombre: 'Fulgor',
      runas: 700,
      precio: 50,
      bonus: 150,
      slug: 'paquete-runas-550',
      descripcion: '550 + 150 de regalo'
    },
    {
      id: 'aurora',
      nombre: 'Aurora',
      runas: 1600,
      precio: 100,
      bonus: 400,
      slug: 'paquete-runas-1200',
      destacado: true,
      descripcion: '1200 + 400 de regalo'
    }
  ];

  return (
    <section className="seccion seccion-runas">
      <div className="seccion-header">
        <h1>Runas de Poder</h1>
        <p>Tu moneda mágica para experiencias únicas</p>
      </div>

      {/* Balance actual */}
      <div className="runas-balance">
        <span className="balance-icono">ᚱ</span>
        <div className="balance-info">
          <span className="balance-cantidad">{runasActuales.toLocaleString()}</span>
          <span className="balance-label">runas disponibles</span>
        </div>
      </div>

      {/* Qué son las runas */}
      <div className="runas-explicacion">
        <h3>¿Qué podés hacer con tus runas?</h3>
        <ul>
          <li>✦ Tiradas de runas nórdicas y oráculos</li>
          <li>✦ Registros akáshicos y mensajes del alma</li>
          <li>✦ Numerología y carta astral</li>
          <li>✦ Estudios de linaje élfico y sanación ancestral</li>
        </ul>
        <p className="runas-nota">Las runas nunca expiran. Usalas cuando quieras.</p>
        {ir && (
          <button className="btn-dorado-sm" onClick={() => ir('estudios')} style={{marginTop: '1rem'}}>
            Explorar estudios místicos →
          </button>
        )}
      </div>

      {/* Paquetes */}
      <div className="runas-paquetes">
        <h3>Conseguir más runas</h3>
        <div className="paquetes-grid">
          {paquetes.map((paq) => (
            <a
              key={paq.id}
              href={`${WORDPRESS_URL}/product/${paq.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className={`paquete-card ${paq.popular ? 'popular' : ''} ${paq.destacado ? 'destacado' : ''}`}
            >
              {paq.popular && <span className="paquete-badge">Popular</span>}
              {paq.destacado && <span className="paquete-badge destacado">Mejor valor</span>}

              <div className="paquete-runas">
                <span className="paquete-cantidad">{paq.runas}</span>
                <span className="paquete-unidad">runas</span>
              </div>

              <div className="paquete-nombre">{paq.nombre}</div>

              {paq.bonus > 0 && (
                <div className="paquete-bonus">+{paq.bonus} gratis</div>
              )}

              <div className="paquete-precio">USD ${paq.precio}</div>

              <div className="paquete-descripcion">{paq.descripcion}</div>

              <span className="paquete-btn">Conseguir →</span>
            </a>
          ))}
        </div>
      </div>

      {/* Nota de acreditación */}
      <div className="runas-acreditacion">
        <p>
          <strong>¿Cómo funciona?</strong> Comprás el paquete en nuestra tienda y
          las runas se acreditan automáticamente en tu cuenta dentro de los próximos minutos.
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECCIÓN ESTUDIOS MÍSTICOS
// ═══════════════════════════════════════════════════════════════

function SeccionEstudios({ usuario, token, setUsuario }) {
  const [catalogo, setCatalogo] = useState(null);
  const [categorias, setCategorias] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState('simple');
  const [estudioSeleccionado, setEstudioSeleccionado] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [verHistorial, setVerHistorial] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  // Campos del formulario
  const [pregunta, setPregunta] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [horaNacimiento, setHoraNacimiento] = useState('');
  const [momento, setMomento] = useState('');

  const runasActuales = usuario?.runas || 0;

  // Cargar catálogo al montar
  useEffect(() => {
    cargarCatalogo();
    cargarHistorial();
  }, []);

  const cargarCatalogo = async () => {
    try {
      const res = await fetch('/api/mi-magia/estudios?accion=catalogo');
      const data = await res.json();
      if (data.success) {
        setCatalogo(data.estudios);
        setCategorias(data.categorias);
      }
    } catch (e) {
      console.error('Error cargando catálogo:', e);
    }
  };

  const cargarHistorial = async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/mi-magia/estudios?accion=historial&token=${token}`);
      const data = await res.json();
      if (data.success) {
        setHistorial(data.historial || []);
      }
    } catch (e) {
      console.error('Error cargando historial:', e);
    }
  };

  const generarEstudio = async () => {
    if (!estudioSeleccionado) return;

    const estudio = catalogo.find(e => e.id === estudioSeleccionado);
    if (!estudio) return;

    // Validaciones
    if (estudio.requierePregunta && !pregunta.trim()) {
      setError('Escribí tu pregunta o situación');
      return;
    }
    if (estudio.requiereFechaNacimiento && !fechaNacimiento) {
      setError('Ingresá tu fecha de nacimiento');
      return;
    }
    if (runasActuales < estudio.runas) {
      setError(`Necesitás ${estudio.runas} runas. Tenés ${runasActuales}.`);
      return;
    }

    setGenerando(true);
    setError('');
    setResultado(null);

    try {
      const res = await fetch('/api/mi-magia/estudios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          estudioId: estudioSeleccionado,
          datos: {
            pregunta: pregunta.trim(),
            fechaNacimiento,
            horaNacimiento,
            momento: momento.trim()
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        setResultado(data.estudio);
        // Actualizar runas del usuario
        setUsuario(prev => ({
          ...prev,
          runas: data.runasRestantes
        }));
        // Actualizar historial
        cargarHistorial();
        // Limpiar formulario
        setPregunta('');
        setMomento('');
      } else {
        setError(data.error || 'Error al generar el estudio');
      }
    } catch (e) {
      setError('Error de conexión. Intentá de nuevo.');
    }

    setGenerando(false);
  };

  const verEstudioHistorial = async (estudioId) => {
    try {
      const res = await fetch(`/api/mi-magia/estudios?accion=ver&token=${token}&id=${estudioId}`);
      const data = await res.json();
      if (data.success) {
        setResultado(data.estudio);
        setVerHistorial(false);
      }
    } catch (e) {
      console.error('Error cargando estudio:', e);
    }
  };

  // Vista de resultado
  if (resultado) {
    return (
      <section className="seccion seccion-estudios">
        <div className="estudio-resultado">
          <button className="btn-volver" onClick={() => { setResultado(null); setEstudioSeleccionado(null); }}>
            ← Volver a estudios
          </button>

          <div className="resultado-header">
            <span className="resultado-icono">{resultado.icono}</span>
            <h2>{resultado.nombre}</h2>
            <p className="resultado-fecha">
              {new Date(resultado.fechaGenerado).toLocaleDateString('es-UY', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>

          <div className="resultado-contenido">
            {resultado.contenido?.split('\n').map((linea, i) => {
              if (linea.startsWith('**') && linea.endsWith('**')) {
                return <h3 key={i} className="resultado-subtitulo">{linea.replace(/\*\*/g, '')}</h3>;
              }
              if (linea.trim()) {
                return <p key={i}>{linea}</p>;
              }
              return <br key={i} />;
            })}
          </div>

          <div className="resultado-footer">
            <small>✦ Este estudio fue generado especialmente para vos</small>
          </div>
        </div>
      </section>
    );
  }

  // Vista de historial
  if (verHistorial) {
    return (
      <section className="seccion seccion-estudios">
        <div className="seccion-header">
          <h1>Mis Estudios</h1>
          <p>Tu historial de lecturas y estudios</p>
        </div>

        <button className="btn-volver" onClick={() => setVerHistorial(false)}>
          ← Volver al catálogo
        </button>

        {historial.length === 0 ? (
          <div className="historial-vacio">
            <p>Todavía no tenés estudios. ¡Hacé tu primera lectura!</p>
          </div>
        ) : (
          <div className="historial-lista">
            {historial.map((item, idx) => (
              <div key={idx} className="historial-item" onClick={() => verEstudioHistorial(item.id)}>
                <span className="historial-icono">{item.icono}</span>
                <div className="historial-info">
                  <h4>{item.nombre}</h4>
                  <p className="historial-preview">{item.preview}</p>
                  <span className="historial-fecha">
                    {new Date(item.fecha).toLocaleDateString('es-UY')}
                  </span>
                </div>
                <span className="historial-ver">Ver →</span>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  // Vista de formulario para estudio seleccionado
  if (estudioSeleccionado && catalogo) {
    const estudio = catalogo.find(e => e.id === estudioSeleccionado);
    if (!estudio) return null;

    const puedePagar = runasActuales >= estudio.runas;

    return (
      <section className="seccion seccion-estudios">
        <button className="btn-volver" onClick={() => { setEstudioSeleccionado(null); setError(''); }}>
          ← Volver al catálogo
        </button>

        <div className="estudio-formulario">
          <div className="formulario-header">
            <span className="formulario-icono">{estudio.icono}</span>
            <h2>{estudio.nombre}</h2>
            <p>{estudio.descripcion}</p>
            <div className="formulario-costo">
              <span className="costo-runas">{estudio.runas} runas</span>
              <span className="costo-tengo">Tenés: {runasActuales}</span>
            </div>
          </div>

          <div className="formulario-campos">
            {estudio.requierePregunta && (
              <div className="campo-estudio">
                <label>Tu pregunta o situación</label>
                <textarea
                  value={pregunta}
                  onChange={(e) => setPregunta(e.target.value)}
                  placeholder="¿Qué querés saber? ¿Qué situación estás atravesando?"
                  rows={3}
                />
              </div>
            )}

            {estudio.requiereFechaNacimiento && (
              <div className="campo-estudio">
                <label>Fecha de nacimiento</label>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                />
              </div>
            )}

            {estudio.requiereHoraNacimiento && (
              <div className="campo-estudio">
                <label>Hora de nacimiento (opcional)</label>
                <input
                  type="time"
                  value={horaNacimiento}
                  onChange={(e) => setHoraNacimiento(e.target.value)}
                />
                <small>Si no sabés la hora exacta, dejalo vacío</small>
              </div>
            )}

            {!estudio.requierePregunta && !estudio.requiereFechaNacimiento && (
              <div className="campo-estudio">
                <label>¿Hay algo que quieras compartir? (opcional)</label>
                <textarea
                  value={momento}
                  onChange={(e) => setMomento(e.target.value)}
                  placeholder="Tu momento actual, lo que estás sintiendo..."
                  rows={2}
                />
              </div>
            )}
          </div>

          {error && <p className="error-estudio">{error}</p>}

          <button
            className={`btn-generar ${!puedePagar ? 'disabled' : ''}`}
            onClick={generarEstudio}
            disabled={generando || !puedePagar}
          >
            {generando ? (
              <>Generando tu estudio...</>
            ) : !puedePagar ? (
              <>Te faltan {estudio.runas - runasActuales} runas</>
            ) : (
              <>✦ Generar {estudio.nombre}</>
            )}
          </button>

          {!puedePagar && (
            <p className="nota-runas">
              Podés conseguir más runas en la sección <strong>Runas</strong>
            </p>
          )}
        </div>
      </section>
    );
  }

  // Vista principal - catálogo
  if (!catalogo || !categorias) {
    return (
      <section className="seccion seccion-estudios">
        <div className="cargando-estudios">
          <span>✦</span>
          <p>Cargando estudios...</p>
        </div>
      </section>
    );
  }

  const estudiosCategoria = catalogo.filter(e => e.categoria === categoriaActiva);

  return (
    <section className="seccion seccion-estudios">
      <div className="seccion-header">
        <h1>Estudios Místicos</h1>
        <p>Lecturas personalizadas generadas con magia ancestral</p>
      </div>

      {/* Balance de runas */}
      <div className="estudios-balance">
        <span className="balance-mini-icono">ᚱ</span>
        <span className="balance-mini-cantidad">{runasActuales}</span>
        <span className="balance-mini-label">runas disponibles</span>
        {historial.length > 0 && (
          <button className="btn-historial" onClick={() => setVerHistorial(true)}>
            Ver mis estudios ({historial.length})
          </button>
        )}
      </div>

      {/* Categorías */}
      <div className="estudios-categorias">
        {Object.entries(categorias).map(([key, cat]) => (
          <button
            key={key}
            className={`categoria-btn ${categoriaActiva === key ? 'activa' : ''}`}
            onClick={() => setCategoriaActiva(key)}
            style={{ '--cat-color': cat.color }}
          >
            <span className="categoria-nombre">{cat.nombre}</span>
            <span className="categoria-desc">{cat.descripcion}</span>
          </button>
        ))}
      </div>

      {/* Grid de estudios */}
      <div className="estudios-grid">
        {estudiosCategoria.map((estudio) => {
          const puedePagar = runasActuales >= estudio.runas;
          return (
            <div
              key={estudio.id}
              className={`estudio-card ${!puedePagar ? 'sin-runas' : ''}`}
              onClick={() => setEstudioSeleccionado(estudio.id)}
            >
              <div className="estudio-icono">{estudio.icono}</div>
              <h3 className="estudio-nombre">{estudio.nombre}</h3>
              <p className="estudio-descripcion">{estudio.descripcion}</p>
              <div className="estudio-meta">
                <span className="estudio-runas">{estudio.runas} runas</span>
                <span className="estudio-duracion">{estudio.duracion}</span>
              </div>
              <span className="estudio-cta">
                {puedePagar ? 'Hacer estudio →' : 'Necesitás más runas'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="estudios-info">
        <h4>¿Cómo funciona?</h4>
        <p>
          Cada estudio es único y generado especialmente para vos en el momento.
          Pagás con runas y recibís tu lectura personalizada al instante.
          Todos tus estudios quedan guardados en tu historial.
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECCIÓN CONTENIDO EXCLUSIVO
// ═══════════════════════════════════════════════════════════════

function SeccionContenido() {
  const [tabActivo, setTabActivo] = useState('cuidados');

  const contenidos = {
    cuidados: {
      titulo: 'Cuidados del Guardián',
      icono: '❧',
      contenido: [
        {
          subtitulo: 'Su espacio sagrado',
          texto: `Tu guardián necesita un lugar propio. No tiene que ser un altar elaborado — puede ser una repisa, una mesita de luz, un rincón de tu escritorio. Lo importante es que sea un espacio donde pueda estar tranquilo, donde no lo muevan constantemente, donde pueda observar su nuevo hogar.

Algunos guardianes prefieren lugares con luz natural. Otros eligen rincones más recogidos. Observá dónde parece estar más "cómodo" — vas a notarlo.`
        },
        {
          subtitulo: 'Limpieza energética',
          texto: `Una vez por semana, o cuando sientas que es necesario, pasá suavemente un paño seco por tu guardián. Mientras lo hacés, agradecé su presencia. No hace falta decir palabras elaboradas — un simple "gracias por estar" alcanza.

Si sentís que la energía está muy densa, podés pasar humo de salvia, palo santo o incienso alrededor (no directamente sobre él). El sonido de un cuenco tibetano o campanitas también limpia la energía.`
        },
        {
          subtitulo: 'Ofrendas simples',
          texto: `No necesitás ofrendas elaboradas. Un vaso de agua limpia cerca, una flor del jardín, una piedrita que encontraste en un paseo. Lo que importa es la intención, no el objeto.

Algunos guardianes "piden" cosas específicas — vas a sentirlo como una idea que aparece de la nada. Si te llega, hacele caso.`
        }
      ]
    },
    ritual: {
      titulo: 'Ritual de Conexión',
      icono: '◈',
      contenido: [
        {
          subtitulo: 'Antes de empezar',
          texto: `Este ritual es para profundizar tu vínculo con tu guardián. Podés hacerlo una vez, o repetirlo cada luna llena, o cuando sientas que lo necesitás.

Necesitás: un momento de tranquilidad (5-10 minutos), tu guardián frente a vos, y opcionalmente una vela.`
        },
        {
          subtitulo: 'El ritual',
          texto: `1. Sentate cómodamente frente a tu guardián. Si tenés una vela, encendela.

2. Cerrá los ojos y respirá profundo tres veces. Con cada exhalación, soltá las tensiones del día.

3. Abrí los ojos y mirá a tu guardián. Observalo como si fuera la primera vez. Notá cada detalle de su forma, sus colores, su expresión.

4. Ponele un nombre si todavía no lo tiene. O confirmá el nombre que ya sentiste. Decilo en voz alta: "Te llamo [nombre]".

5. Contale algo. Lo que estás viviendo, lo que necesitás, lo que agradecés. No tiene que ser largo ni elaborado.

6. Quedáte en silencio un momento. Escuchá si llega algo — una sensación, una palabra, una imagen.

7. Agradecé. Apagá la vela si la encendiste.`
        },
        {
          subtitulo: 'Después del ritual',
          texto: `No esperes fuegos artificiales. A veces la conexión es sutil — un sueño esa noche, una sincronicidad al día siguiente, una sensación de calma que no estaba antes.

Anotá en tu Grimorio lo que sentiste. Con el tiempo, vas a ver patrones.`
        }
      ]
    },
    historia: {
      titulo: 'Historia Secreta',
      icono: '◆',
      contenido: [
        {
          subtitulo: 'El origen',
          texto: `Los guardianes no siempre fueron figuras de cerámica. Hace mucho, mucho tiempo — antes de que los humanos aprendieran a escribir — ya existían. Eran energías, presencias, guardianes del equilibrio natural.

Habitaban en los bosques, las cuevas, los ríos. Protegían a los que sabían verlos. Guiaban a los perdidos. Sanaban a los heridos que buscaban su ayuda.`
        },
        {
          subtitulo: 'La transformación',
          texto: `Con el tiempo, los humanos dejaron de creer. Los guardianes seguían ahí, pero ya nadie los veía. Así que encontraron otra forma: empezaron a habitar objetos. Talismanes, amuletos, figuras talladas.

No es que "entraran" en el objeto — es que el objeto les daba una forma visible, un ancla en el mundo físico. Una manera de ser vistos de nuevo.`
        },
        {
          subtitulo: 'El presente',
          texto: `Cada guardián que llega a tus manos eligió estar ahí. No es casualidad. No es "solo una compra". Es un encuentro que estaba escrito antes de que supieras que lo necesitabas.

Tu guardián te esperó. Ahora está acá. Y mientras vos creas en él, él va a cuidar de vos.`
        }
      ]
    }
  };

  const contenidoActual = contenidos[tabActivo];

  return (
    <section className="seccion seccion-contenido">
      <div className="seccion-header">
        <h1>Sabiduría Guardiana</h1>
        <p>Conocimiento ancestral para tu camino</p>
      </div>

      <div className="contenido-tabs">
        {Object.entries(contenidos).map(([key, value]) => (
          <button
            key={key}
            className={`tab ${tabActivo === key ? 'activo' : ''}`}
            onClick={() => setTabActivo(key)}
          >
            <span className="tab-icono">{value.icono}</span>
            <span className="tab-nombre">{value.titulo}</span>
          </button>
        ))}
      </div>

      <div className="contenido-principal">
        <div className="contenido-header">
          <span className="contenido-icono">{contenidoActual.icono}</span>
          <h2>{contenidoActual.titulo}</h2>
        </div>

        <div className="contenido-texto">
          {contenidoActual.contenido.map((seccion, idx) => (
            <div key={idx} className="contenido-seccion">
              <h3>{seccion.subtitulo}</h3>
              {seccion.texto.split('\n\n').map((parrafo, pIdx) => (
                <p key={pIdx}>{parrafo}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECCIÓN GRIMORIO - DIARIO MÁGICO COMPLETO
// ═══════════════════════════════════════════════════════════════

// Tipos de entrada del grimorio
const TIPOS_ENTRADA = {
  sueno: { id: 'sueno', nombre: 'Sueño', icono: '🌙', color: '#9b59b6', placeholder: 'Describí tu sueño... ¿qué viste? ¿qué sentiste?' },
  senal: { id: 'senal', nombre: 'Señal', icono: '✦', color: '#c9a227', placeholder: 'Una sincronicidad, un número repetido, algo que llamó tu atención...' },
  gratitud: { id: 'gratitud', nombre: 'Gratitud', icono: '🙏', color: '#2ecc71', placeholder: '¿Por qué estás agradecida/o hoy?' },
  ritual: { id: 'ritual', nombre: 'Ritual', icono: '🔮', color: '#3498db', placeholder: '¿Qué ritual hiciste? ¿Cómo te sentiste?' },
  intencion: { id: 'intencion', nombre: 'Intención', icono: '💫', color: '#e74c3c', placeholder: '¿Qué querés manifestar? ¿Qué intención sembrás?' },
  libre: { id: 'libre', nombre: 'Libre', icono: '📝', color: '#95a5a6', placeholder: 'Escribí lo que quieras...' }
};

// Prompts mágicos rotativos
const PROMPTS_MAGICOS = [
  "¿Qué mensaje te está dando el universo hoy?",
  "Si tu guardián pudiera hablarte, ¿qué te diría?",
  "¿Qué patrón de tu vida querés romper?",
  "Describí un momento de hoy donde sentiste magia",
  "¿Qué te está costando soltar?",
  "¿Qué versión de vos querés invocar?",
  "Si pudieras hablar con tu yo del pasado, ¿qué le dirías?",
  "¿Qué sueño recurrente tenés? ¿Qué significa?",
  "¿Dónde sentís que necesitás protección?",
  "¿Qué abundancia ya está presente en tu vida?",
  "¿Cuál es tu miedo más profundo? Nombralo.",
  "¿Qué estás evitando ver?",
  "Describí tu día perfecto con todos los sentidos",
  "¿Qué ancestro sentís que te acompaña?",
  "¿Qué talento tenés que no estás usando?"
];

function SeccionGrimorio({ usuario, token, setUsuario }) {
  const [vista, setVista] = useState('escribir'); // 'escribir' | 'calendario' | 'intenciones'
  const [entrada, setEntrada] = useState('');
  const [tipoEntrada, setTipoEntrada] = useState('libre');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [mesActual, setMesActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [entradaExpandida, setEntradaExpandida] = useState(null);

  const diario = usuario?.diario || [];

  // Prompt del día (basado en la fecha)
  const promptDelDia = PROMPTS_MAGICOS[new Date().getDate() % PROMPTS_MAGICOS.length];

  // Calcular fase lunar con más detalle
  const calcularFaseLunar = () => {
    const cicloLunar = 29.530588853;
    const lunaLlena = new Date(2024, 0, 25);
    const hoy = new Date();
    const diff = (hoy - lunaLlena) / (1000 * 60 * 60 * 24);
    const fase = ((diff % cicloLunar) + cicloLunar) % cicloLunar;
    const porcentaje = Math.round((fase / cicloLunar) * 100);

    let info = { porcentaje };
    if (fase < 1.84) {
      info = { ...info, nombre: 'Luna Nueva', icono: '🌑', energia: 'Momento de sembrar intenciones y comenzar ciclos nuevos.' };
    } else if (fase < 7.38) {
      info = { ...info, nombre: 'Luna Creciente', icono: '🌒', energia: 'Tus intenciones cobran fuerza. Actuá hacia tus metas.' };
    } else if (fase < 9.22) {
      info = { ...info, nombre: 'Cuarto Creciente', icono: '🌓', energia: 'Momento de decisión. Superá obstáculos.' };
    } else if (fase < 14.76) {
      info = { ...info, nombre: 'Gibosa Creciente', icono: '🌔', energia: 'Refiná tus planes. La manifestación se acerca.' };
    } else if (fase < 16.61) {
      info = { ...info, nombre: 'Luna Llena', icono: '🌕', energia: 'Máxima energía. Celebrá logros y liberá lo que no sirve.' };
    } else if (fase < 22.14) {
      info = { ...info, nombre: 'Gibosa Menguante', icono: '🌖', energia: 'Tiempo de agradecer y compartir lo aprendido.' };
    } else if (fase < 23.99) {
      info = { ...info, nombre: 'Cuarto Menguante', icono: '🌗', energia: 'Soltá, perdoná, dejá ir lo que ya cumplió su ciclo.' };
    } else {
      info = { ...info, nombre: 'Luna Menguante', icono: '🌘', energia: 'Descanso y preparación. El nuevo ciclo se acerca.' };
    }
    return info;
  };

  const luna = calcularFaseLunar();

  // Estadísticas del grimorio
  const stats = {
    totalEntradas: diario.length,
    entradasEsteMes: diario.filter(e => {
      const fecha = new Date(e.fechaISO || e.fecha);
      const ahora = new Date();
      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
    }).length,
    tipoMasUsado: (() => {
      const conteo = {};
      diario.forEach(e => {
        conteo[e.tipo] = (conteo[e.tipo] || 0) + 1;
      });
      return Object.entries(conteo).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    })(),
    racha: (() => {
      // Calcular días consecutivos escribiendo
      const hoy = new Date();
      let racha = 0;
      for (let i = 0; i < 30; i++) {
        const dia = new Date(hoy);
        dia.setDate(dia.getDate() - i);
        const diaStr = dia.toISOString().split('T')[0];
        const tieneEntrada = diario.some(e => (e.fechaISO || '').startsWith(diaStr));
        if (tieneEntrada || i === 0) racha++;
        else break;
      }
      return racha;
    })()
  };

  // Guardar entrada
  const guardarEntrada = async () => {
    if (!entrada.trim()) return;

    setGuardando(true);
    try {
      const fechaISO = new Date().toISOString();
      const res = await fetch(`${API_BASE}/api/mi-magia/diario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario.email,
          tipo: tipoEntrada,
          contenido: entrada,
          fechaISO,
          faseLunar: luna.nombre
        })
      });
      const data = await res.json();

      if (data.success) {
        const nuevaEntrada = {
          tipo: tipoEntrada,
          contenido: entrada,
          fecha: new Date().toLocaleDateString('es-UY'),
          fechaISO,
          faseLunar: luna.nombre
        };
        setUsuario({
          ...usuario,
          diario: [...diario, nuevaEntrada]
        });
        setEntrada('');
        setMensaje({ tipo: 'ok', texto: '✦ Guardado en tu grimorio' });
        setTimeout(() => setMensaje(null), 3000);
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar' });
    }
    setGuardando(false);
  };

  // Generar días del calendario
  const generarCalendario = () => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicio = primerDia.getDay(); // 0 = domingo

    const dias = [];
    // Días vacíos al inicio
    for (let i = 0; i < diaInicio; i++) {
      dias.push({ dia: null, entradas: [] });
    }
    // Días del mes
    for (let d = 1; d <= diasEnMes; d++) {
      const fechaStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const entradasDia = diario.filter(e => (e.fechaISO || '').startsWith(fechaStr));
      dias.push({ dia: d, fecha: fechaStr, entradas: entradasDia });
    }
    return dias;
  };

  // Filtrar entradas
  const entradasFiltradas = filtroTipo === 'todos'
    ? diario
    : diario.filter(e => e.tipo === filtroTipo);

  // Vista de escribir
  const renderEscribir = () => (
    <>
      {/* Panel de la luna */}
      <div className="grimorio-luna-panel">
        <div className="luna-grande">
          <span className="luna-icono-grande">{luna.icono}</span>
          <div className="luna-info">
            <span className="luna-nombre-grande">{luna.nombre}</span>
            <p className="luna-energia">{luna.energia}</p>
          </div>
        </div>
      </div>

      {/* Prompt del día */}
      <div className="grimorio-prompt">
        <span className="prompt-label">✦ Pregunta del día</span>
        <p className="prompt-texto">{promptDelDia}</p>
      </div>

      {/* Selector de tipo */}
      <div className="grimorio-tipos">
        {Object.values(TIPOS_ENTRADA).map(tipo => (
          <button
            key={tipo.id}
            className={`tipo-btn ${tipoEntrada === tipo.id ? 'activo' : ''}`}
            onClick={() => setTipoEntrada(tipo.id)}
            style={{ '--tipo-color': tipo.color }}
          >
            <span className="tipo-icono">{tipo.icono}</span>
            <span className="tipo-nombre">{tipo.nombre}</span>
          </button>
        ))}
      </div>

      {/* Área de escritura */}
      <div className="grimorio-escribir">
        <textarea
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder={TIPOS_ENTRADA[tipoEntrada].placeholder}
          rows={6}
        />
        <div className="grimorio-escribir-footer">
          <span className="escribir-fecha">
            {new Date().toLocaleDateString('es-UY', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <div className="escribir-acciones">
            {mensaje && (
              <span className={`grimorio-mensaje ${mensaje.tipo}`}>
                {mensaje.texto}
              </span>
            )}
            <button
              className="btn-guardar-grimorio"
              onClick={guardarEntrada}
              disabled={guardando || !entrada.trim()}
            >
              {guardando ? 'Guardando...' : `Guardar ${TIPOS_ENTRADA[tipoEntrada].icono}`}
            </button>
          </div>
        </div>
      </div>

      {/* Stats rápidas */}
      {diario.length > 0 && (
        <div className="grimorio-stats">
          <div className="stat">
            <span className="stat-numero">{stats.totalEntradas}</span>
            <span className="stat-label">entradas</span>
          </div>
          <div className="stat">
            <span className="stat-numero">{stats.entradasEsteMes}</span>
            <span className="stat-label">este mes</span>
          </div>
          <div className="stat">
            <span className="stat-numero">{stats.racha}</span>
            <span className="stat-label">días seguidos</span>
          </div>
          {stats.tipoMasUsado && (
            <div className="stat">
              <span className="stat-numero">{TIPOS_ENTRADA[stats.tipoMasUsado]?.icono}</span>
              <span className="stat-label">más usado</span>
            </div>
          )}
        </div>
      )}
    </>
  );

  // Vista de calendario
  const renderCalendario = () => {
    const dias = generarCalendario();
    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

    return (
      <>
        <div className="calendario-nav">
          <button onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1))}>
            ←
          </button>
          <span className="calendario-mes">
            {mesActual.toLocaleDateString('es-UY', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1))}>
            →
          </button>
        </div>

        <div className="calendario-grid">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
            <div key={d} className="calendario-dia-nombre">{d}</div>
          ))}
          {dias.map((d, idx) => (
            <div
              key={idx}
              className={`calendario-dia ${d.dia ? '' : 'vacio'} ${d.fecha === hoyStr ? 'hoy' : ''} ${d.entradas.length > 0 ? 'tiene-entradas' : ''} ${diaSeleccionado === d.fecha ? 'seleccionado' : ''}`}
              onClick={() => d.dia && d.entradas.length > 0 && setDiaSeleccionado(d.fecha === diaSeleccionado ? null : d.fecha)}
            >
              {d.dia && (
                <>
                  <span className="dia-numero">{d.dia}</span>
                  {d.entradas.length > 0 && (
                    <div className="dia-indicadores">
                      {[...new Set(d.entradas.map(e => e.tipo))].slice(0, 3).map(tipo => (
                        <span key={tipo} className="indicador" style={{ background: TIPOS_ENTRADA[tipo]?.color || '#c9a227' }} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Entradas del día seleccionado */}
        {diaSeleccionado && (
          <div className="calendario-entradas-dia">
            <h4>
              {new Date(diaSeleccionado + 'T12:00:00').toLocaleDateString('es-UY', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h4>
            {dias.find(d => d.fecha === diaSeleccionado)?.entradas.map((e, idx) => (
              <div key={idx} className="entrada-mini" style={{ '--tipo-color': TIPOS_ENTRADA[e.tipo]?.color }}>
                <span className="entrada-mini-icono">{TIPOS_ENTRADA[e.tipo]?.icono}</span>
                <p>{e.contenido}</p>
              </div>
            ))}
          </div>
        )}

        {/* Leyenda */}
        <div className="calendario-leyenda">
          {Object.values(TIPOS_ENTRADA).map(tipo => (
            <span key={tipo.id} className="leyenda-item">
              <span className="leyenda-color" style={{ background: tipo.color }} />
              {tipo.nombre}
            </span>
          ))}
        </div>
      </>
    );
  };

  // Vista de intenciones (manifestaciones)
  const renderIntenciones = () => {
    const intenciones = diario.filter(e => e.tipo === 'intencion');

    return (
      <>
        <div className="intenciones-header">
          <h3>Tus Intenciones Sembradas</h3>
          <p>Cada intención que escribís es una semilla. Mirá tu jardín crecer.</p>
        </div>

        {intenciones.length === 0 ? (
          <div className="intenciones-vacio">
            <span className="intenciones-vacio-icono">💫</span>
            <p>Todavía no sembraste intenciones.</p>
            <button className="btn-dorado-sm" onClick={() => { setVista('escribir'); setTipoEntrada('intencion'); }}>
              Sembrar mi primera intención
            </button>
          </div>
        ) : (
          <div className="intenciones-lista">
            {[...intenciones].reverse().map((e, idx) => (
              <div key={idx} className="intencion-card">
                <div className="intencion-fecha">
                  <span className="intencion-luna">{e.faseLunar || '🌙'}</span>
                  <span>{e.fecha}</span>
                </div>
                <p className="intencion-contenido">{e.contenido}</p>
                <div className="intencion-estado">
                  <button className="estado-btn">🌱 Germinando</button>
                  <button className="estado-btn">🌿 Creciendo</button>
                  <button className="estado-btn">🌸 Floreciendo</button>
                  <button className="estado-btn">✨ Manifestada</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  // Vista de historial con filtros
  const renderHistorial = () => (
    <>
      <div className="historial-filtros">
        <button
          className={`filtro-btn ${filtroTipo === 'todos' ? 'activo' : ''}`}
          onClick={() => setFiltroTipo('todos')}
        >
          Todas
        </button>
        {Object.values(TIPOS_ENTRADA).map(tipo => (
          <button
            key={tipo.id}
            className={`filtro-btn ${filtroTipo === tipo.id ? 'activo' : ''}`}
            onClick={() => setFiltroTipo(tipo.id)}
            style={{ '--tipo-color': tipo.color }}
          >
            {tipo.icono}
          </button>
        ))}
      </div>

      {entradasFiltradas.length === 0 ? (
        <div className="grimorio-vacio">
          <p>No hay entradas {filtroTipo !== 'todos' ? `de tipo "${TIPOS_ENTRADA[filtroTipo]?.nombre}"` : ''}.</p>
        </div>
      ) : (
        <div className="entradas-lista">
          {[...entradasFiltradas].reverse().map((e, idx) => (
            <div
              key={idx}
              className={`entrada ${entradaExpandida === idx ? 'expandida' : ''}`}
              style={{ '--tipo-color': TIPOS_ENTRADA[e.tipo]?.color }}
              onClick={() => setEntradaExpandida(entradaExpandida === idx ? null : idx)}
            >
              <div className="entrada-header">
                <span className="entrada-tipo-icono">{TIPOS_ENTRADA[e.tipo]?.icono}</span>
                <span className="entrada-fecha">{e.fecha}</span>
                {e.faseLunar && <span className="entrada-luna">{e.faseLunar}</span>}
              </div>
              <p className="entrada-contenido">{e.contenido}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <section className="seccion seccion-grimorio">
      <div className="seccion-header">
        <h1>Tu Grimorio</h1>
        <p>Diario mágico · Registro de tu camino</p>
      </div>

      {/* Navegación del grimorio */}
      <div className="grimorio-nav">
        <button
          className={`grim-nav-btn ${vista === 'escribir' ? 'activo' : ''}`}
          onClick={() => setVista('escribir')}
        >
          <span>✎</span> Escribir
        </button>
        <button
          className={`grim-nav-btn ${vista === 'calendario' ? 'activo' : ''}`}
          onClick={() => setVista('calendario')}
        >
          <span>◐</span> Calendario
        </button>
        <button
          className={`grim-nav-btn ${vista === 'intenciones' ? 'activo' : ''}`}
          onClick={() => setVista('intenciones')}
        >
          <span>💫</span> Intenciones
        </button>
        <button
          className={`grim-nav-btn ${vista === 'historial' ? 'activo' : ''}`}
          onClick={() => setVista('historial')}
        >
          <span>☰</span> Historial
        </button>
      </div>

      {/* Contenido según vista */}
      <div className="grimorio-contenido">
        {vista === 'escribir' && renderEscribir()}
        {vista === 'calendario' && renderCalendario()}
        {vista === 'intenciones' && renderIntenciones()}
        {vista === 'historial' && renderHistorial()}
      </div>
    </section>
  );
}
// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════

export default function MiMagiaPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBF8F1' }}>
        <div style={{ textAlign: 'center', color: '#2D5A4A' }}>
          <div style={{ fontSize: '3rem', animation: 'pulse 2s infinite' }}>✦</div>
          <p style={{ color: '#666', marginTop: '1rem' }}>Cargando...</p>
        </div>
      </div>
    }>
      <MiMagiaContent />
    </Suspense>
  );
}
