'use client';
import { useState, useEffect } from 'react';

const API_BASE = '';

// ═══════════════════════════════════════════════════════════════
// SEÑAL DEL DÍA - Mensaje personalizado diario
// ═══════════════════════════════════════════════════════════════

export function SenalDelDia({ usuario }) {
  const [senal, setSenal] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [yaVista, setYaVista] = useState(false);

  useEffect(() => {
    cargarSenal();
  }, []);

  const cargarSenal = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/senal/diaria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario?.email })
      });
      const data = await res.json();
      if (data.success) {
        setSenal(data.senal);
        setYaVista(data.yaGenerada);
      }
    } catch (e) {
      console.error('Error cargando señal:', e);
    }
    setCargando(false);
  };

  if (cargando) {
    return (
      <div className="senal-card cargando">
        <div className="senal-loading">
          <span className="pulse">✦</span>
          <p>Consultando las estrellas...</p>
        </div>
      </div>
    );
  }

  if (!senal) return null;

  return (
    <div className="senal-card">
      <div className="senal-header">
        <span className="senal-luna">{senal.luna?.emoji}</span>
        <div>
          <h3>Tu Señal del Día</h3>
          <p className="senal-fase">{senal.luna?.fase}</p>
        </div>
        <span className="senal-numero">#{senal.numero_dia}</span>
      </div>

      <div className="senal-saludo">
        <p>{senal.saludo}</p>
      </div>

      <div className="senal-mensaje-tito">
        <div className="tito-icon">🧙</div>
        <p>{senal.mensaje_tito}</p>
      </div>

      {senal.senal_elemento && (
        <div className="senal-elemento">
          <span>◈</span>
          <p>{senal.senal_elemento}</p>
        </div>
      )}

      {senal.guardian_mensaje && (
        <div className="senal-guardian">
          <span>✦</span>
          <p>{senal.guardian_mensaje}</p>
        </div>
      )}

      <div className="senal-footer">
        <div className="senal-accion">
          <strong>Acción sugerida:</strong>
          <p>{senal.accion_sugerida}</p>
        </div>

        {senal.cristal_del_dia && (
          <div className="senal-cristal">
            <span>💎</span>
            <div>
              <strong>{senal.cristal_del_dia.nombre}</strong>
              <small>{senal.cristal_del_dia.poder}</small>
            </div>
          </div>
        )}

        <div className="senal-numero-significado">
          <span>{senal.numero_dia}</span>
          <small>{senal.significado_numero}</small>
        </div>
      </div>

      <div className="senal-luna-mensaje">
        <p>{senal.luna?.mensaje}</p>
      </div>

      {senal.mensaje_canalizado && (
        <div className="senal-canalizado">
          <h4>✦ Mensaje Canalizado</h4>
          <p>{senal.mensaje_canalizado}</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TEST ELEMENTAL - Descubrí tu elemento
// ═══════════════════════════════════════════════════════════════

export function TestElemental({ usuario, onComplete }) {
  const [paso, setPaso] = useState('intro');
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarPreguntas();
  }, []);

  const cargarPreguntas = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/elemento/test`);
      const data = await res.json();
      if (data.success) {
        setPreguntas(data.preguntas);
      }
    } catch (e) {
      console.error('Error cargando preguntas:', e);
    }
  };

  const responder = (preguntaId, respuesta) => {
    setRespuestas({ ...respuestas, [preguntaId]: respuesta });
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      enviarResultados();
    }
  };

  const enviarResultados = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API_BASE}/api/elemento/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario?.email,
          respuestas
        })
      });
      const data = await res.json();
      if (data.success) {
        setResultado(data.resultado);
        setPaso('resultado');
        if (onComplete) onComplete(data.resultado);
      }
    } catch (e) {
      console.error('Error enviando respuestas:', e);
    }
    setCargando(false);
  };

  if (paso === 'intro') {
    return (
      <div className="test-intro">
        <div className="test-header">
          <span className="test-icono">◈</span>
          <h2>Descubrí Tu Elemento</h2>
        </div>
        <p>Cada persona tiene una afinidad natural con uno de los cuatro elementos. Conocer el tuyo te ayudará a conectar mejor con tu guardián y a entender tu energía.</p>
        <div className="elementos-preview">
          <div className="elem-prev fuego"><span>🔥</span>Fuego</div>
          <div className="elem-prev agua"><span>💧</span>Agua</div>
          <div className="elem-prev tierra"><span>🌿</span>Tierra</div>
          <div className="elem-prev aire"><span>💨</span>Aire</div>
        </div>
        <p className="test-tiempo">12 preguntas • 5 minutos</p>
        <button className="btn-gold" onClick={() => setPaso('test')}>
          Comenzar el Test ✦
        </button>
      </div>
    );
  }

  if (paso === 'test' && preguntas.length > 0) {
    const pregunta = preguntas[preguntaActual];
    const progreso = ((preguntaActual + 1) / preguntas.length) * 100;

    return (
      <div className="test-pregunta">
        <div className="test-progress">
          <div className="progress-bar" style={{ width: `${progreso}%` }}></div>
          <span>{preguntaActual + 1} / {preguntas.length}</span>
        </div>

        <h3>{pregunta.pregunta}</h3>

        <div className="opciones">
          {pregunta.opciones.map((opcion, i) => (
            <button
              key={i}
              className="opcion-btn"
              onClick={() => responder(pregunta.id, opcion.elemento)}
            >
              {opcion.texto}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="test-cargando">
        <span className="pulse">◈</span>
        <p>Analizando tu energía elemental...</p>
      </div>
    );
  }

  if (paso === 'resultado' && resultado) {
    return (
      <div className="test-resultado">
        <div className={`resultado-header ${resultado.elemento_principal}`}>
          <span className="resultado-emoji">{resultado.emoji}</span>
          <h2>Tu Elemento: {resultado.elemento_principal}</h2>
          {resultado.elemento_secundario && (
            <p className="elem-secundario">Con influencia de {resultado.elemento_secundario}</p>
          )}
        </div>

        <div className="resultado-mensaje">
          <p>{resultado.mensaje}</p>
        </div>

        <div className="resultado-guardianes">
          <h4>Guardianes Afines</h4>
          <div className="guardianes-lista">
            {resultado.guardianes_afines?.map((g, i) => (
              <span key={i}>{g}</span>
            ))}
          </div>
        </div>

        {resultado.ritual_activacion && (
          <div className="resultado-ritual">
            <h4>✦ Tu Ritual de Activación</h4>
            <p>{resultado.ritual_activacion}</p>
          </div>
        )}

        <button className="btn-pri" onClick={() => window.location.reload()}>
          Volver a Mi Magia
        </button>
      </div>
    );
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// COSMOS DEL MES - Panel para miembros del Círculo
// ═══════════════════════════════════════════════════════════════

export function CosmosMes({ usuario }) {
  const [cosmos, setCosmos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [tabActivo, setTabActivo] = useState('luna');

  useEffect(() => {
    cargarCosmos();
  }, []);

  const cargarCosmos = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/circulo/cosmos?email=${usuario?.email}`);
      const data = await res.json();
      if (data.success) {
        setCosmos(data.cosmos);
      }
    } catch (e) {
      console.error('Error cargando cosmos:', e);
    }
    setCargando(false);
  };

  if (cargando) {
    return (
      <div className="cosmos-cargando">
        <span className="pulse">☽</span>
        <p>Consultando el cosmos...</p>
      </div>
    );
  }

  if (!cosmos) return null;

  return (
    <div className="cosmos-panel">
      <div className="cosmos-header">
        <h2>Cosmos del Mes</h2>
        <p>{cosmos.mes}</p>
      </div>

      <div className="cosmos-tabs">
        {[
          ['luna', '☽', 'Luna'],
          ['astro', '✦', 'Astro'],
          ['cristal', '💎', 'Cristal'],
          ['guardian', '❧', 'Guardián']
        ].map(([key, icon, label]) => (
          <button
            key={key}
            className={`cosmos-tab ${tabActivo === key ? 'activo' : ''}`}
            onClick={() => setTabActivo(key)}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {tabActivo === 'luna' && cosmos.luna && (
        <div className="cosmos-luna">
          <div className="luna-actual">
            <span className="luna-emoji-xl">{cosmos.luna.emoji}</span>
            <div>
              <h3>{cosmos.luna.nombre}</h3>
              <p>{cosmos.luna.energia}</p>
              <small>{cosmos.luna.porcentajeIluminacion || cosmos.luna.iluminacion}% iluminada</small>
            </div>
          </div>

          <div className="luna-ritual">
            <h4>Ritual recomendado:</h4>
            <p>{cosmos.luna.ritual}</p>
          </div>

          <div className="proximas-fases">
            <h4>Próximas fechas importantes:</h4>
            <div className="fechas-grid">
              <div className="fecha-item">
                <span>🌑</span>
                <strong>Luna Nueva</strong>
                <small>{cosmos.luna.proximaNueva ? new Date(cosmos.luna.proximaNueva).toLocaleDateString('es-UY') : '-'}</small>
              </div>
              <div className="fecha-item">
                <span>🌕</span>
                <strong>Luna Llena</strong>
                <small>{cosmos.luna.proximaLlena ? new Date(cosmos.luna.proximaLlena).toLocaleDateString('es-UY') : '-'}</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {tabActivo === 'astro' && cosmos.astrologia && (
        <div className="cosmos-astro">
          <div className="sol-actual">
            <span>☀️</span>
            <div>
              <strong>Sol en {cosmos.astrologia.signo}</strong>
              <p>{cosmos.astrologia.energia}</p>
            </div>
          </div>

          <div className="astro-info">
            <div className="astro-item">
              <strong>Elemento:</strong> {cosmos.astrologia.elemento}
            </div>
            <div className="astro-item">
              <strong>Regente:</strong> {cosmos.astrologia.regente}
            </div>
          </div>

          {cosmos.astrologia.mensaje && (
            <div className="energia-colectiva">
              <h4>Energía del mes:</h4>
              <p>{cosmos.astrologia.mensaje}</p>
            </div>
          )}
        </div>
      )}

      {tabActivo === 'cristal' && cosmos.cristal && (
        <div className="cosmos-cristal">
          <div className="cristal-mes">
            <span>💎</span>
            <h3>{cosmos.cristal.nombre}</h3>
          </div>
          <p className="cristal-poder">{cosmos.cristal.poder}</p>
          <div className="cristal-elemento">
            <strong>Elemento:</strong> {cosmos.cristal.elemento}
          </div>
          <div className="cristal-ritual">
            <h4>Cómo trabajar con él este mes:</h4>
            <p>{cosmos.cristal.como_usar}</p>
          </div>
          <div className="cristal-limpiar">
            <h4>Limpieza:</h4>
            <p>{cosmos.cristal.limpiar}</p>
          </div>
        </div>
      )}

      {tabActivo === 'guardian' && cosmos.guardian && (
        <div className="cosmos-guardian">
          <h3>Guardián del Mes: {cosmos.guardian.tipo}</h3>
          <p className="guardian-desc">{cosmos.guardian.mensaje}</p>

          <div className="guardian-mensaje">
            <h4>✦ Recomendación</h4>
            <p className="mensaje-destacado">{cosmos.guardian.recomendacion}</p>
          </div>
        </div>
      )}

      {cosmos.fechas && cosmos.fechas.length > 0 && (
        <div className="fechas-importantes">
          <h3>Fechas Importantes del Mes</h3>
          <div className="fechas-lista">
            {cosmos.fechas.map((f, i) => (
              <div key={i} className="fecha-item-full">
                <span>✦</span>
                <div>
                  <strong>{f.evento}</strong>
                  <small>{new Date(f.fecha).toLocaleDateString('es-UY')}</small>
                  <p className="fecha-desc">{f.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cosmos.afirmacion && (
        <div className="cosmos-afirmacion">
          <h4>✦ Afirmación del Mes</h4>
          <p className="afirmacion-texto">"{cosmos.afirmacion}"</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GUÍA DE CRISTALES - Enciclopedia completa
// ═══════════════════════════════════════════════════════════════

export function GuiaCristales({ usuario }) {
  const [cristales, setCristales] = useState([]);
  const [cristalActivo, setCristalActivo] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [filtroChakra, setFiltroChakra] = useState('');
  const [cargando, setCargando] = useState(true);

  const chakras = ['Raíz', 'Sacro', 'Plexo Solar', 'Corazón', 'Garganta', 'Tercer Ojo', 'Corona'];

  useEffect(() => {
    cargarCristales();
  }, [filtroChakra]);

  const cargarCristales = async () => {
    setCargando(true);
    try {
      let url = `${API_BASE}/api/cristales`;
      if (filtroChakra) url += `?chakra=${filtroChakra}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCristales(data.cristales);
      }
    } catch (e) {
      console.error('Error cargando cristales:', e);
    }
    setCargando(false);
  };

  const cargarDetalle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/cristales?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setCristalActivo(data.cristal);
      }
    } catch (e) {
      console.error('Error cargando cristal:', e);
    }
  };

  const cristalesFiltrados = cristales.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.propiedades?.toLowerCase().includes(filtro.toLowerCase())
  );

  if (cristalActivo) {
    return (
      <div className="cristal-detalle">
        <button className="btn-volver" onClick={() => setCristalActivo(null)}>
          ← Volver
        </button>

        <div className="cristal-header-det">
          <h2>{cristalActivo.nombre}</h2>
          {cristalActivo.nombres_alternativos?.length > 0 && (
            <p className="nombres-alt">También: {cristalActivo.nombres_alternativos.join(', ')}</p>
          )}
        </div>

        <div className="cristal-info-grid">
          <div className="info-item">
            <strong>Color:</strong> {cristalActivo.color}
          </div>
          <div className="info-item">
            <strong>Elemento:</strong> {cristalActivo.elemento}
          </div>
          <div className="info-item">
            <strong>Chakras:</strong> {cristalActivo.chakras?.join(', ')}
          </div>
          <div className="info-item">
            <strong>Signos:</strong> {cristalActivo.signos?.join(', ')}
          </div>
        </div>

        <div className="cristal-seccion">
          <h3>Propiedades Energéticas</h3>
          <p>{cristalActivo.propiedades_energeticas}</p>
        </div>

        {cristalActivo.propiedades_fisicas && (
          <div className="cristal-seccion">
            <h3>Propiedades Físicas</h3>
            <p>{cristalActivo.propiedades_fisicas}</p>
          </div>
        )}

        <div className="cristal-seccion">
          <h3>Cómo Limpiar</h3>
          <p>{cristalActivo.como_limpiar}</p>
        </div>

        <div className="cristal-seccion">
          <h3>Cómo Programar</h3>
          <p>{cristalActivo.como_programar}</p>
        </div>

        {cristalActivo.combinaciones_potentes?.length > 0 && (
          <div className="cristal-seccion">
            <h3>Combinaciones Potentes</h3>
            <div className="combinaciones-tags">
              {cristalActivo.combinaciones_potentes.map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </div>
          </div>
        )}

        {cristalActivo.guardianes_afines?.length > 0 && (
          <div className="cristal-seccion">
            <h3>Guardianes Afines</h3>
            <div className="guardianes-tags">
              {cristalActivo.guardianes_afines.map((g, i) => (
                <span key={i}>{g}</span>
              ))}
            </div>
          </div>
        )}

        <div className="cristal-seccion ritual">
          <h3>✦ Ritual de Activación</h3>
          <p>{cristalActivo.ritual_activacion}</p>
        </div>

        {cristalActivo.advertencias && (
          <div className="cristal-seccion advertencia">
            <h3>⚠️ Advertencias</h3>
            <p>{cristalActivo.advertencias}</p>
          </div>
        )}

        <div className="cristal-mensaje">
          <p>"{cristalActivo.mensaje}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guia-cristales">
      <div className="guia-header">
        <h2>Guía de Cristales</h2>
        <p>30+ cristales con propiedades, rituales y más</p>
      </div>

      <div className="guia-filtros">
        <input
          type="text"
          placeholder="Buscar cristal..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="buscar-input"
        />
        <div className="chakra-filtros">
          <button
            className={`chakra-btn ${!filtroChakra ? 'activo' : ''}`}
            onClick={() => setFiltroChakra('')}
          >
            Todos
          </button>
          {chakras.map(ch => (
            <button
              key={ch}
              className={`chakra-btn ${filtroChakra === ch ? 'activo' : ''}`}
              onClick={() => setFiltroChakra(ch)}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {cargando ? (
        <div className="guia-cargando">
          <span className="pulse">💎</span>
          <p>Cargando cristales...</p>
        </div>
      ) : (
        <div className="cristales-grid">
          {cristalesFiltrados.map(cristal => (
            <div
              key={cristal.id}
              className="cristal-card"
              onClick={() => cargarDetalle(cristal.id)}
            >
              <div className="cristal-emoji">💎</div>
              <h4>{cristal.nombre}</h4>
              <p className="cristal-color">{cristal.color}</p>
              <div className="cristal-chakras-mini">
                {cristal.chakras?.slice(0, 2).map((ch, i) => (
                  <span key={i}>{ch}</span>
                ))}
              </div>
              <p className="cristal-prop-mini">{cristal.propiedades}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CATÁLOGO DE EXPERIENCIAS MEJORADO
// ═══════════════════════════════════════════════════════════════

export function CatalogoExperiencias({ usuario, setUsuario }) {
  const [experiencias, setExperiencias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('');
  const [experienciaActiva, setExperienciaActiva] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [solicitando, setSolicitando] = useState(false);
  const [contexto, setContexto] = useState('');
  const [pregunta, setPregunta] = useState('');
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    cargarCatalogo();
  }, [categoriaActiva]);

  const cargarCatalogo = async () => {
    setCargando(true);
    try {
      let url = `${API_BASE}/api/experiencias/catalogo`;
      if (categoriaActiva) url += `?categoria=${categoriaActiva}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setExperiencias(data.experiencias);
        setCategorias(data.categorias);
      }
    } catch (e) {
      console.error('Error cargando catálogo:', e);
    }
    setCargando(false);
  };

  const solicitar = async (exp) => {
    setSolicitando(true);
    try {
      const res = await fetch(`${API_BASE}/api/experiencias/solicitar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario?.email,
          experienciaId: exp.id,
          contexto,
          preguntaEspecifica: pregunta
        })
      });
      const data = await res.json();
      if (data.success) {
        setResultado(data);
        if (data.solicitud?.runasRestantes !== undefined) {
          setUsuario({ ...usuario, runas: data.solicitud.runasRestantes });
        }
      } else {
        alert(data.error || 'Error al solicitar');
      }
    } catch (e) {
      console.error('Error solicitando:', e);
      alert('Error de conexión');
    }
    setSolicitando(false);
  };

  if (resultado) {
    return (
      <div className="exp-resultado">
        <div className="resultado-header-exp">
          <span>✦</span>
          <h2>{resultado.mensaje}</h2>
        </div>

        {resultado.resultado ? (
          <div className="resultado-contenido">
            <h3>{resultado.resultado.titulo}</h3>
            <div className="resultado-texto">
              {resultado.resultado.contenido.split('\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="resultado-palabras">{resultado.resultado.palabras} palabras</p>
          </div>
        ) : (
          <div className="resultado-pendiente">
            <p>Tu solicitud está en proceso. Te notificaremos cuando esté lista.</p>
            <p>ID: {resultado.solicitud?.id}</p>
            <p>Entrega estimada: {new Date(resultado.solicitud?.fechaEntregaEstimada).toLocaleString('es-UY')}</p>
          </div>
        )}

        <button className="btn-pri" onClick={() => { setResultado(null); setExperienciaActiva(null); }}>
          Volver al catálogo
        </button>
      </div>
    );
  }

  if (experienciaActiva) {
    const puedeComprar = (usuario?.runas || 0) >= experienciaActiva.runas;

    return (
      <div className="exp-detalle">
        <button className="btn-volver" onClick={() => setExperienciaActiva(null)}>
          ← Volver
        </button>

        <div className="exp-header-det">
          <span className="exp-icono-lg">{experienciaActiva.icono}</span>
          <div>
            <h2>{experienciaActiva.nombre}</h2>
            <div className="exp-meta">
              <span className="exp-runas-lg">ᚱ {experienciaActiva.runas}</span>
              <span className="exp-duracion">{experienciaActiva.duracion}</span>
            </div>
          </div>
        </div>

        <p className="exp-desc-full">{experienciaActiva.descripcion}</p>

        <div className="exp-entregable">
          <strong>Recibís:</strong> {experienciaActiva.entregable}
        </div>

        <div className="exp-formulario">
          <h4>Contanos un poco más</h4>
          <textarea
            placeholder="Contexto o situación actual (opcional)"
            value={contexto}
            onChange={(e) => setContexto(e.target.value)}
            rows={3}
          />
          <textarea
            placeholder="Pregunta específica (opcional)"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            rows={2}
          />
        </div>

        <div className="exp-accion">
          {puedeComprar ? (
            <button
              className="btn-gold"
              onClick={() => solicitar(experienciaActiva)}
              disabled={solicitando}
            >
              {solicitando ? 'Procesando...' : `Solicitar por ᚱ ${experienciaActiva.runas}`}
            </button>
          ) : (
            <div className="runas-insuficientes">
              <p>Necesitás {experienciaActiva.runas - (usuario?.runas || 0)} runas más</p>
              <a href="https://duendesuy.10web.cloud/producto/runas-chispa/" target="_blank" className="btn-sec">
                Conseguir más runas
              </a>
            </div>
          )}
          <p className="runas-actuales">Tus runas: ᚱ {usuario?.runas || 0}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="catalogo-exp">
      <div className="catalogo-header">
        <h2>Experiencias Mágicas</h2>
        <p>Servicios exclusivos pagados con Runas de Poder</p>
      </div>

      <div className="categorias-tabs">
        <button
          className={`cat-tab ${!categoriaActiva ? 'activo' : ''}`}
          onClick={() => setCategoriaActiva('')}
        >
          Todas
        </button>
        {categorias.map(cat => (
          <button
            key={cat.id}
            className={`cat-tab ${categoriaActiva === cat.id ? 'activo' : ''}`}
            onClick={() => setCategoriaActiva(cat.id)}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="catalogo-cargando">
          <span className="pulse">✦</span>
          <p>Cargando experiencias...</p>
        </div>
      ) : (
        <div className="experiencias-grid-new">
          {experiencias.map(exp => (
            <div
              key={exp.id}
              className={`exp-card-new ${exp.popular ? 'popular' : ''} ${exp.premium ? 'premium' : ''}`}
              onClick={() => setExperienciaActiva(exp)}
            >
              {exp.popular && <span className="badge-popular">Popular</span>}
              {exp.premium && <span className="badge-premium">Premium</span>}
              <span className="exp-icono">{exp.icono}</span>
              <h4>{exp.nombre}</h4>
              <p className="exp-desc">{exp.descripcion.substring(0, 80)}...</p>
              <div className="exp-footer">
                <span className="exp-runas">ᚱ {exp.runas}</span>
                <span className="exp-duracion">{exp.duracion}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="runas-info">
        <p>Tus runas: <strong>ᚱ {usuario?.runas || 0}</strong></p>
        <a href="https://duendesuy.10web.cloud/tienda/?product_cat=runas" target="_blank" className="btn-sec">
          Conseguir más runas
        </a>
      </div>
    </div>
  );
}

// Estilos adicionales para los nuevos componentes
export const estilosNuevos = `
/* SEÑAL DEL DÍA */
.senal-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #d4af3733;
}
.senal-card.cargando {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
.senal-loading {
  text-align: center;
}
.pulse {
  animation: pulse 1.5s infinite;
  display: inline-block;
  font-size: 2rem;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}
.senal-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}
.senal-luna { font-size: 2.5rem; }
.senal-header h3 { margin: 0; color: #d4af37; }
.senal-fase { margin: 0; color: #aaa; font-size: 0.9rem; }
.senal-numero {
  margin-left: auto;
  background: #d4af3722;
  padding: 5px 10px;
  border-radius: 8px;
  color: #d4af37;
  font-size: 0.9rem;
}
.senal-saludo p {
  font-size: 1.1rem;
  color: #eee;
  margin-bottom: 15px;
}
.senal-mensaje-tito {
  display: flex;
  gap: 12px;
  background: #0a0a0a;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 15px;
}
.tito-icon { font-size: 1.5rem; }
.senal-mensaje-tito p {
  margin: 0;
  color: #ccc;
  line-height: 1.5;
}
.senal-elemento, .senal-guardian {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #ffffff08;
  border-radius: 8px;
  margin-bottom: 10px;
}
.senal-elemento span, .senal-guardian span {
  color: #d4af37;
}
.senal-footer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #333;
}
.senal-accion, .senal-cristal, .senal-numero-significado {
  text-align: center;
  padding: 10px;
  background: #0a0a0a;
  border-radius: 8px;
  color: #e0e0e0;
}
.senal-accion p, .senal-cristal p, .senal-numero-significado p,
.senal-accion small, .senal-cristal small {
  color: #ccc;
  margin: 0;
  font-size: 0.85rem;
}
.senal-accion strong, .senal-cristal strong {
  display: block;
  color: #d4af37;
  font-size: 0.8rem;
  margin-bottom: 5px;
}
.senal-cristal span { font-size: 1.5rem; }
.senal-cristal div strong { color: #d4af37; font-size: 0.95rem; }
.senal-cristal div small { color: #aaa; font-size: 0.75rem; display: block; }
.senal-numero-significado span {
  display: block;
  font-size: 1.5rem;
  color: #d4af37;
}
.senal-numero-significado small {
  font-size: 0.75rem;
  color: #aaa;
}
.senal-luna-mensaje {
  margin-top: 15px;
  padding: 12px;
  background: #d4af3711;
  border-radius: 8px;
  border-left: 3px solid #d4af37;
}
.senal-luna-mensaje p {
  margin: 0;
  font-style: italic;
  color: #ccc;
}
.senal-canalizado {
  margin-top: 15px;
  padding: 15px;
  background: linear-gradient(135deg, #1a1a3e, #0a0a2e);
  border-radius: 12px;
  border: 1px solid #d4af3744;
}
.senal-canalizado h4 {
  color: #d4af37;
  margin: 0 0 10px;
}

/* TEST ELEMENTAL */
.test-intro, .test-pregunta, .test-cargando, .test-resultado {
  background: #141414;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
}
.test-header { margin-bottom: 20px; }
.test-icono { font-size: 3rem; color: #d4af37; }
.test-header h2 { color: #fff; margin: 10px 0; }
.elementos-preview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 20px 0;
}
.elem-prev {
  padding: 15px;
  border-radius: 12px;
  text-align: center;
}
.elem-prev span { display: block; font-size: 1.5rem; margin-bottom: 5px; }
.elem-prev.fuego { background: #ff450033; color: #ff6b6b; }
.elem-prev.agua { background: #1e90ff33; color: #74b9ff; }
.elem-prev.tierra { background: #2ecc7133; color: #55efc4; }
.elem-prev.aire { background: #74b9ff33; color: #a29bfe; }
.test-tiempo { color: #888; font-size: 0.9rem; }
.test-progress {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}
.progress-bar {
  flex: 1;
  height: 6px;
  background: #d4af37;
  border-radius: 3px;
  transition: width 0.3s;
}
.test-pregunta h3 {
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 25px;
}
.opciones {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.opcion-btn {
  padding: 15px 20px;
  background: #1f1f1f;
  border: 1px solid #333;
  border-radius: 12px;
  color: #fff;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}
.opcion-btn:hover {
  background: #2a2a2a;
  border-color: #d4af37;
}
.resultado-header {
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 20px;
}
.resultado-header.fuego { background: linear-gradient(135deg, #ff4500, #ff6b6b); }
.resultado-header.agua { background: linear-gradient(135deg, #1e90ff, #74b9ff); }
.resultado-header.tierra { background: linear-gradient(135deg, #2ecc71, #55efc4); }
.resultado-header.aire { background: linear-gradient(135deg, #a29bfe, #dfe6e9); }
.resultado-emoji { font-size: 4rem; }
.resultado-header h2 { color: #fff; margin: 10px 0 0; }
.elem-secundario { color: rgba(255,255,255,0.8); }
.resultado-mensaje {
  background: #1f1f1f;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}
.resultado-guardianes h4 { color: #d4af37; margin-bottom: 10px; }
.guardianes-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.guardianes-lista span {
  background: #d4af3722;
  color: #d4af37;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}
.resultado-ritual {
  background: #0a0a0a;
  padding: 20px;
  border-radius: 12px;
  border-left: 3px solid #d4af37;
  margin-top: 20px;
}
.resultado-ritual h4 { color: #d4af37; margin: 0 0 10px; }

/* COSMOS DEL MES */
.cosmos-panel {
  background: #141414;
  border-radius: 16px;
  padding: 20px;
}
.cosmos-header {
  text-align: center;
  margin-bottom: 20px;
}
.cosmos-header h2 { color: #d4af37; margin: 0; }
.cosmos-header p { color: #888; }
.cosmos-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  margin-bottom: 20px;
}
.cosmos-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 12px;
  background: #1f1f1f;
  border: none;
  border-radius: 10px;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
}
.cosmos-tab span { font-size: 1.2rem; }
.cosmos-tab.activo {
  background: #d4af3722;
  color: #d4af37;
}
.luna-actual {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #0a0a0a;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
}
.luna-emoji-xl { font-size: 4rem; }
.luna-actual h3 { color: #fff; margin: 0 0 5px; }
.luna-actual p { color: #ccc; margin: 0; }
.luna-actual small { color: #888; }
.luna-ritual {
  background: #1f1f1f;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 15px;
}
.luna-ritual h4 { color: #d4af37; margin: 0 0 10px; }
.proximas-fases h4, .energia-colectiva h4 { color: #d4af37; margin: 0 0 15px; }
.fechas-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.fecha-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #1f1f1f;
  padding: 12px;
  border-radius: 10px;
}
.fecha-item span { font-size: 1.5rem; }
.fecha-item strong { display: block; color: #fff; }
.fecha-item small { color: #888; }
.sol-actual {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #0a0a0a;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 15px;
}
.sol-actual span { font-size: 2.5rem; }
.sol-actual strong { display: block; color: #fff; }
.alerta-retrogrado {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ff450022;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #ff4500;
  margin-bottom: 15px;
}
.cristal-mes {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}
.cristal-mes span { font-size: 3rem; }
.cristal-mes h3 { color: #fff; margin: 0; }
.cristal-poder { color: #ccc; font-style: italic; margin-bottom: 15px; }
.cristal-chakra, .cristal-ritual {
  background: #1f1f1f;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 15px;
}
.cosmos-guardian h3 { color: #d4af37; margin: 0 0 5px; }
.guardian-tipo { color: #888; font-size: 0.9rem; margin-bottom: 10px; }
.guardian-mensaje {
  background: #0a0a0a;
  padding: 15px;
  border-radius: 12px;
  margin-top: 15px;
  border-left: 3px solid #d4af37;
}
.guardian-mensaje h4 { color: #d4af37; margin: 0 0 10px; }
.mensaje-destacado {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #eee;
}
.fechas-importantes {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #333;
}
.fechas-importantes h3 { color: #d4af37; margin: 0 0 15px; }
.fechas-lista {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.fecha-item-full {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #1f1f1f;
  border-radius: 10px;
}
.fecha-item-full span { font-size: 1.5rem; }
.fecha-item-full strong { color: #fff; }
.fecha-item-full small { display: block; color: #888; }
.fecha-desc { color: #aaa; font-size: 0.85rem; margin: 5px 0 0; }
.astro-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}
.astro-item {
  background: #1f1f1f;
  padding: 12px;
  border-radius: 10px;
  color: #ccc;
}
.astro-item strong { color: #d4af37; }
.sol-actual p { color: #ccc; margin: 5px 0 0; }
.cristal-elemento, .cristal-limpiar {
  background: #1f1f1f;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 10px;
  color: #ccc;
}
.cristal-elemento strong, .cristal-limpiar h4 { color: #d4af37; }
.cristal-limpiar p { margin: 5px 0 0; }
.cosmos-afirmacion {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #d4af3722, #d4af3711);
  border-radius: 16px;
  border: 1px solid #d4af3744;
  text-align: center;
}
.cosmos-afirmacion h4 { color: #d4af37; margin: 0 0 10px; }
.afirmacion-texto {
  font-size: 1.2rem;
  color: #fff;
  font-style: italic;
  line-height: 1.5;
}

/* GUÍA DE CRISTALES */
.guia-cristales {
  padding-bottom: 20px;
}
.guia-header {
  text-align: center;
  margin-bottom: 20px;
}
.guia-header h2 { color: #d4af37; margin: 0 0 5px; }
.guia-header p { color: #888; }
.guia-filtros {
  margin-bottom: 20px;
}
.buscar-input {
  width: 100%;
  padding: 12px 15px;
  background: #1f1f1f;
  border: 1px solid #333;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 10px;
}
.buscar-input:focus {
  outline: none;
  border-color: #d4af37;
}
.chakra-filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.chakra-btn {
  padding: 6px 12px;
  background: #1f1f1f;
  border: none;
  border-radius: 20px;
  color: #888;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}
.chakra-btn.activo {
  background: #d4af3722;
  color: #d4af37;
}
.cristales-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}
.cristal-card {
  background: #1f1f1f;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}
.cristal-card:hover {
  border-color: #d4af37;
  transform: translateY(-2px);
}
.cristal-emoji { font-size: 2rem; margin-bottom: 10px; }
.cristal-card h4 { color: #fff; margin: 0 0 5px; font-size: 0.95rem; }
.cristal-color { color: #888; font-size: 0.8rem; margin: 0 0 8px; }
.cristal-chakras-mini {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 8px;
}
.cristal-chakras-mini span {
  background: #d4af3722;
  color: #d4af37;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
}
.cristal-prop-mini {
  color: #aaa;
  font-size: 0.75rem;
  margin: 0;
  line-height: 1.3;
}
.cristal-detalle {
  padding: 20px 0;
}
.btn-volver {
  background: none;
  border: none;
  color: #d4af37;
  cursor: pointer;
  padding: 10px 0;
  font-size: 1rem;
}
.cristal-header-det {
  margin-bottom: 20px;
}
.cristal-header-det h2 { color: #d4af37; margin: 0 0 5px; }
.nombres-alt { color: #888; font-size: 0.9rem; margin: 0; }
.cristal-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}
.info-item {
  background: #1f1f1f;
  padding: 12px;
  border-radius: 10px;
}
.info-item strong { color: #d4af37; display: block; margin-bottom: 5px; font-size: 0.85rem; }
.cristal-seccion {
  background: #141414;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 15px;
}
.cristal-seccion h3 {
  color: #d4af37;
  margin: 0 0 10px;
  font-size: 1rem;
}
.cristal-seccion p { color: #ccc; margin: 0; line-height: 1.5; }
.cristal-seccion.ritual {
  background: linear-gradient(135deg, #1a1a2e, #0a0a2e);
  border: 1px solid #d4af3733;
}
.cristal-seccion.advertencia {
  background: #ff450011;
  border: 1px solid #ff450044;
}
.combinaciones-tags, .guardianes-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.combinaciones-tags span, .guardianes-tags span {
  background: #d4af3722;
  color: #d4af37;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
}
.cristal-mensaje {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #d4af3711, #d4af3722);
  border-radius: 12px;
  border: 1px solid #d4af3744;
  margin-top: 20px;
}
.cristal-mensaje p {
  color: #d4af37;
  font-style: italic;
  font-size: 1.1rem;
  margin: 0;
}

/* CATÁLOGO EXPERIENCIAS */
.catalogo-exp {
  padding-bottom: 20px;
}
.catalogo-header {
  text-align: center;
  margin-bottom: 20px;
}
.catalogo-header h2 { color: #d4af37; margin: 0 0 5px; }
.catalogo-header p { color: #888; }
.categorias-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 20px;
}
.cat-tab {
  padding: 8px 15px;
  background: #1f1f1f;
  border: none;
  border-radius: 20px;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
}
.cat-tab.activo {
  background: #d4af3722;
  color: #d4af37;
}
.experiencias-grid-new {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}
.exp-card-new {
  background: #1f1f1f;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  position: relative;
}
.exp-card-new:hover {
  border-color: #d4af37;
  transform: translateY(-2px);
}
.exp-card-new.popular { border-color: #d4af3744; }
.exp-card-new.premium { background: linear-gradient(135deg, #1f1f2f, #1a1a2e); }
.badge-popular, .badge-premium {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}
.badge-popular { background: #d4af37; color: #000; }
.badge-premium { background: #9b59b6; color: #fff; }
.exp-icono { font-size: 2rem; display: block; margin-bottom: 10px; }
.exp-card-new h4 { color: #fff; margin: 0 0 8px; }
.exp-desc { color: #888; font-size: 0.9rem; margin: 0 0 12px; line-height: 1.4; }
.exp-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.exp-runas {
  background: #d4af3722;
  color: #d4af37;
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: 600;
}
.exp-duracion { color: #666; font-size: 0.85rem; }
.runas-info {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #333;
}
.runas-info p { margin: 0 0 10px; color: #aaa; }
.runas-info strong { color: #d4af37; }
.exp-detalle {
  padding: 20px 0;
}
.exp-header-det {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.exp-icono-lg { font-size: 3rem; }
.exp-header-det h2 { color: #fff; margin: 0 0 8px; }
.exp-meta {
  display: flex;
  gap: 15px;
}
.exp-runas-lg {
  background: #d4af37;
  color: #000;
  padding: 5px 12px;
  border-radius: 8px;
  font-weight: 600;
}
.exp-desc-full {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 20px;
}
.exp-entregable {
  background: #1f1f1f;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
}
.exp-entregable strong { color: #d4af37; }
.exp-formulario {
  margin-bottom: 20px;
}
.exp-formulario h4 { color: #d4af37; margin: 0 0 15px; }
.exp-formulario textarea {
  width: 100%;
  padding: 12px;
  background: #1f1f1f;
  border: 1px solid #333;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 10px;
  resize: vertical;
}
.exp-formulario textarea:focus {
  outline: none;
  border-color: #d4af37;
}
.exp-accion {
  text-align: center;
  padding: 20px;
  background: #141414;
  border-radius: 16px;
}
.runas-insuficientes {
  color: #ff6b6b;
  margin-bottom: 15px;
}
.runas-actuales {
  color: #888;
  margin-top: 15px;
}
.exp-resultado {
  padding: 20px;
}
.resultado-header-exp {
  text-align: center;
  margin-bottom: 20px;
}
.resultado-header-exp span { font-size: 3rem; display: block; margin-bottom: 10px; }
.resultado-header-exp h2 { color: #d4af37; margin: 0; }
.resultado-contenido {
  background: #141414;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
}
.resultado-contenido h3 { color: #d4af37; margin: 0 0 15px; }
.resultado-texto p {
  color: #ccc;
  line-height: 1.7;
  margin-bottom: 10px;
}
.resultado-palabras {
  color: #888;
  font-size: 0.85rem;
  text-align: right;
  margin-top: 15px;
}
.resultado-pendiente {
  background: #1f1f1f;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 20px;
}

/* Utilidades */
.btn-gold {
  background: linear-gradient(135deg, #d4af37, #f4c962);
  color: #000;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-gold:hover { transform: scale(1.02); }
.btn-gold:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-pri {
  background: #d4af37;
  color: #000;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
.btn-sec {
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}
.cargando-mini, .guia-cargando, .catalogo-cargando, .cosmos-cargando {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #888;
}

/* ═══ RESPONSIVE MÓVIL ═══ */
@media (max-width: 768px) {
  .cristales-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .cristal-card {
    padding: 12px;
  }
  .cristal-card h4 {
    font-size: 0.85rem;
    line-height: 1.2;
    margin-bottom: 4px;
  }
  .cristal-emoji {
    font-size: 1.5rem;
    margin-bottom: 6px;
  }
  .cristal-color {
    font-size: 0.7rem;
    margin-bottom: 5px;
  }
  .cristal-chakras-mini {
    flex-wrap: wrap;
    margin-bottom: 5px;
  }
  .cristal-chakras-mini span {
    font-size: 0.6rem;
    padding: 2px 5px;
  }
  .cristal-prop-mini {
    font-size: 0.7rem;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .chakra-filtros {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
  }
  .chakra-btn {
    flex-shrink: 0;
    font-size: 0.75rem;
    padding: 5px 10px;
  }
  .cristal-detalle {
    padding: 10px 0;
  }
  .cristal-info-grid {
    grid-template-columns: 1fr;
  }
  .cristal-seccion {
    padding: 12px;
  }
  .cristal-seccion h3 {
    font-size: 1rem;
  }
  .cristal-seccion p {
    font-size: 0.9rem;
  }
}
`;
