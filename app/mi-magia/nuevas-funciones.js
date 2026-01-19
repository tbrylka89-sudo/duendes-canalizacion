'use client';
import { useState, useEffect } from 'react';

const API_BASE = '';

// URLs centralizadas - cambiar aquí cuando migre el dominio
const WORDPRESS_URL = 'https://duendesuy.10web.cloud'; // Cambiar a duendesdeluruguay.com cuando 10Web arregle SSL

// Helper: Limpiar tags HTML que aparecen como texto (ej: <em>, <strong>)
function limpiarTexto(texto) {
  if (!texto) return '';
  // Remover tags HTML y mantener solo el contenido
  return texto
    .replace(/<\/?em>/gi, '')
    .replace(/<\/?strong>/gi, '')
    .replace(/<\/?i>/gi, '')
    .replace(/<\/?b>/gi, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '');
}

// Helper: Formatear fecha sin problemas de timezone
// Evita que "2026-02-01" se muestre como 31/1 por conversión UTC
function formatearFecha(fechaStr) {
  if (!fechaStr) return '-';
  // Si es formato ISO YYYY-MM-DD, parseamos manualmente
  if (typeof fechaStr === 'string' && fechaStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [año, mes, dia] = fechaStr.split('-');
    return `${parseInt(dia)}/${parseInt(mes)}/${año}`;
  }
  // Si tiene hora, usar Date normal
  return new Date(fechaStr).toLocaleDateString('es-UY');
}

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
        <div className="senal-accion" style={{background:'#0a0a0a',padding:'10px',borderRadius:'8px',textAlign:'center'}}>
          <strong style={{color:'#d4af37',display:'block',fontSize:'0.8rem',marginBottom:'5px'}}>Acción sugerida:</strong>
          <p style={{color:'#fff',margin:0,fontSize:'0.85rem'}}>{senal.accion_sugerida}</p>
        </div>

        {senal.cristal_del_dia && (
          <div className="senal-cristal" style={{background:'#0a0a0a',padding:'10px',borderRadius:'8px',textAlign:'center'}}>
            <span style={{fontSize:'1.5rem'}}>💎</span>
            <div>
              <strong style={{color:'#d4af37',fontSize:'0.95rem'}}>{senal.cristal_del_dia.nombre}</strong>
              <small style={{color:'#fff',display:'block',fontSize:'0.75rem'}}>{senal.cristal_del_dia.poder}</small>
            </div>
          </div>
        )}

        <div className="senal-numero-significado" style={{background:'#0a0a0a',padding:'10px',borderRadius:'8px',textAlign:'center'}}>
          <span style={{display:'block',fontSize:'1.5rem',color:'#d4af37'}}>{senal.numero_dia}</span>
          <small style={{color:'#fff',fontSize:'0.75rem'}}>{senal.significado_numero}</small>
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
      // Detectar país del usuario o default a Uruguay
      const pais = usuario?.pais || 'UY';
      const cacheBuster = Date.now();
      const res = await fetch(`${API_BASE}/api/circulo/cosmos?email=${usuario?.email}&pais=${pais}&_=${cacheBuster}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
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
        {cosmos.geolocalizacion && (
          <small style={{color:'#888',fontSize:'0.75rem'}}>
            🌍 Hemisferio {cosmos.geolocalizacion.hemisferio}
          </small>
        )}
      </div>

      {/* Mostrar Sabbat si hay uno próximo */}
      {cosmos.sabbatProximo && cosmos.sabbatProximo.diasRestantes <= 14 && (
        <div style={{background:'linear-gradient(135deg,#2d1f3d,#1a1a2e)',padding:'15px',borderRadius:'12px',marginBottom:'20px',border:'1px solid #d4af3744'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <span style={{fontSize:'2rem'}}>{cosmos.sabbatProximo.emoji}</span>
            <div>
              <strong style={{color:'#d4af37',fontSize:'1.1rem'}}>
                {cosmos.sabbatProximo.esHoy ? `¡Hoy es ${cosmos.sabbatProximo.nombre}!` :
                 cosmos.sabbatProximo.diasRestantes === 1 ? `Mañana: ${cosmos.sabbatProximo.nombre}` :
                 `${cosmos.sabbatProximo.nombre} en ${cosmos.sabbatProximo.diasRestantes} días`}
              </strong>
              <p style={{color:'#fff',margin:'5px 0 0',fontSize:'0.9rem'}}>{cosmos.sabbatProximo.descripcion}</p>
            </div>
          </div>
          {cosmos.sabbatProximo.diasRestantes <= 7 && (
            <div style={{marginTop:'12px',padding:'12px',background:'#0a0a0a',borderRadius:'8px'}}>
              <p style={{color:'#d4af37',margin:'0 0 5px',fontSize:'0.85rem'}}>🧙 Tu guardián:</p>
              <p style={{color:'#fff',margin:0,fontSize:'0.9rem'}}>{cosmos.sabbatProximo.guardian}</p>
            </div>
          )}
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'8px',marginBottom:'20px'}}>
        {[
          ['luna', '☽', 'Luna'],
          ['astro', '✦', 'Astro'],
          ['cristal', '💎', 'Cristal'],
          ['tuGuardian', '🧙', 'Tu Guardián']
        ].map(([key, icon, label]) => (
          <button
            key={key}
            onClick={() => setTabActivo(key)}
            style={{
              display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',
              padding:'12px 8px',background: tabActivo === key ? '#d4af3722' : '#1f1f1f',
              color: tabActivo === key ? '#d4af37' : '#888',
              border:'none',borderRadius:'10px',fontSize:'0.85rem',cursor:'pointer'
            }}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {tabActivo === 'luna' && cosmos.luna && (
        <div className="cosmos-luna">
          <div style={{display:'flex',alignItems:'center',gap:'20px',background:'#0a0a0a',padding:'20px',borderRadius:'16px',marginBottom:'20px'}}>
            <span style={{fontSize:'4rem'}}>{cosmos.luna.emoji}</span>
            <div>
              <h3 style={{color:'#fff',margin:'0 0 5px'}}>{cosmos.luna.nombre}</h3>
              <p style={{color:'#fff',margin:0}}>{cosmos.luna.energia}</p>
              <small style={{color:'#fff'}}>{cosmos.luna.porcentajeIluminacion || cosmos.luna.iluminacion}% iluminada</small>
            </div>
          </div>

          <div style={{background:'#1f1f1f',padding:'15px',borderRadius:'12px',marginBottom:'15px'}}>
            <h4 style={{color:'#d4af37',margin:'0 0 10px'}}>Ritual recomendado:</h4>
            <p style={{color:'#fff',margin:0}}>{cosmos.luna.ritual}</p>
          </div>

          <div>
            <h4 style={{color:'#d4af37',margin:'0 0 15px'}}>Próximas fechas importantes:</h4>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'10px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',background:'#1f1f1f',padding:'12px',borderRadius:'10px'}}>
                <span style={{fontSize:'1.5rem'}}>🌑</span>
                <div>
                  <strong style={{display:'block',color:'#fff'}}>Luna Nueva</strong>
                  <small style={{color:'#fff'}}>{formatearFecha(cosmos.luna.proximaNueva)}</small>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'10px',background:'#1f1f1f',padding:'12px',borderRadius:'10px'}}>
                <span style={{fontSize:'1.5rem'}}>🌕</span>
                <div>
                  <strong style={{display:'block',color:'#fff'}}>Luna Llena</strong>
                  <small style={{color:'#fff'}}>{formatearFecha(cosmos.luna.proximaLlena)}</small>
                </div>
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
              <strong style={{color:'#fff'}}>Sol en {cosmos.astrologia.signo}</strong>
              <p style={{color:'#fff',margin:'5px 0 0'}}>{cosmos.astrologia.energia}</p>
            </div>
          </div>

          <div className="astro-info">
            <div className="astro-item" style={{color:'#fff'}}>
              <strong style={{color:'#d4af37'}}>Elemento:</strong> {cosmos.astrologia.elemento}
            </div>
            <div className="astro-item" style={{color:'#fff'}}>
              <strong style={{color:'#d4af37'}}>Regente:</strong> {cosmos.astrologia.regente}
            </div>
          </div>

          {cosmos.astrologia.mensaje && (
            <div className="energia-colectiva" style={{background:'#1f1f1f',padding:'15px',borderRadius:'12px'}}>
              <h4 style={{color:'#d4af37',margin:'0 0 10px'}}>Energía del mes:</h4>
              <p style={{color:'#fff',margin:0}}>{cosmos.astrologia.mensaje}</p>
            </div>
          )}
        </div>
      )}

      {tabActivo === 'cristal' && cosmos.cristal && (
        <div className="cosmos-cristal">
          <div className="cristal-mes">
            <span>💎</span>
            <h3 style={{color:'#fff',margin:0}}>{cosmos.cristal.nombre}</h3>
          </div>
          <p style={{color:'#fff',fontStyle:'italic',marginBottom:'15px'}}>{cosmos.cristal.poder}</p>
          <div style={{background:'#1f1f1f',padding:'12px',borderRadius:'10px',marginBottom:'10px',color:'#fff'}}>
            <strong style={{color:'#d4af37'}}>Elemento:</strong> {cosmos.cristal.elemento}
          </div>
          <div style={{background:'#1f1f1f',padding:'15px',borderRadius:'12px',marginBottom:'15px'}}>
            <h4 style={{color:'#d4af37',margin:'0 0 10px'}}>Cómo trabajar con él este mes:</h4>
            <p style={{color:'#fff',margin:0}}>{cosmos.cristal.como_usar}</p>
          </div>
          <div style={{background:'#1f1f1f',padding:'15px',borderRadius:'12px',marginBottom:'15px'}}>
            <h4 style={{color:'#d4af37',margin:'0 0 10px'}}>Limpieza:</h4>
            <p style={{color:'#fff',margin:0}}>{cosmos.cristal.limpiar}</p>
          </div>
        </div>
      )}

      {tabActivo === 'tuGuardian' && cosmos.tuGuardian && (
        <div>
          <div style={{background:'linear-gradient(135deg,#1a2a1a,#0a1a0a)',padding:'20px',borderRadius:'16px',marginBottom:'15px',border:'1px solid #4a5d4a'}}>
            <h3 style={{color:'#d4af37',margin:'0 0 5px'}}>🧙 Tu Guardián en {cosmos.tuGuardian.fase}</h3>
            <p style={{color:'#fff',fontSize:'1.1rem',lineHeight:'1.5',margin:'10px 0'}}>{cosmos.tuGuardian.mensaje}</p>
          </div>

          <div style={{background:'#1f1f1f',padding:'15px',borderRadius:'12px',marginBottom:'12px'}}>
            <h4 style={{color:'#d4af37',margin:'0 0 10px'}}>✦ Ritual con tu guardián</h4>
            <p style={{color:'#fff',margin:0,lineHeight:'1.5'}}>{cosmos.tuGuardian.ritual}</p>
          </div>

          <div style={{background:'#1f1f1f',padding:'15px',borderRadius:'12px',marginBottom:'12px'}}>
            <h4 style={{color:'#d4af37',margin:'0 0 10px'}}>⟡ Qué hacer hoy</h4>
            <p style={{color:'#fff',margin:0,lineHeight:'1.5'}}>{cosmos.tuGuardian.accion}</p>
          </div>

          <div style={{background:'#0a0a0a',padding:'15px',borderRadius:'12px',borderLeft:'3px solid #d4af37'}}>
            <h4 style={{color:'#d4af37',margin:'0 0 10px'}}>◈ Elemento potenciado</h4>
            <p style={{color:'#fff',margin:0}}>{cosmos.tuGuardian.elemento_potenciado}</p>
          </div>
        </div>
      )}

      {tabActivo === 'guardian' && cosmos.guardian && (
        <div className="cosmos-guardian">
          <h3 style={{color:'#d4af37',margin:'0 0 10px'}}>Guardián del Mes: {cosmos.guardian.tipo}</h3>
          <p style={{color:'#fff',marginBottom:'15px'}}>{cosmos.guardian.mensaje}</p>

          <div style={{background:'#0a0a0a',padding:'15px',borderRadius:'12px',borderLeft:'3px solid #d4af37'}}>
            <h4 style={{color:'#d4af37',margin:'0 0 10px'}}>✦ Recomendación</h4>
            <p style={{color:'#fff',fontSize:'1.1rem',lineHeight:'1.6',margin:0}}>{cosmos.guardian.recomendacion}</p>
          </div>
        </div>
      )}

      {cosmos.fechas && cosmos.fechas.length > 0 && (
        <div style={{marginTop:'20px',paddingTop:'20px',borderTop:'1px solid #333'}}>
          <h3 style={{color:'#d4af37',margin:'0 0 15px'}}>Fechas Importantes</h3>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {cosmos.fechas.map((f, i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',background:'#1f1f1f',borderRadius:'10px'}}>
                <span style={{fontSize:'1.5rem'}}>{f.emoji || '✦'}</span>
                <div>
                  <strong style={{color:'#fff'}}>{f.evento}</strong>
                  <small style={{display:'block',color:'#ccc'}}>{formatearFecha(f.fecha)}</small>
                  <p style={{color:'#fff',fontSize:'0.85rem',margin:'5px 0 0'}}>{f.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cosmos.afirmacion && (
        <div className="cosmos-afirmacion">
          <h4>✦ Afirmación del Mes</h4>
          <p className="afirmacion-texto">"{limpiarTexto(cosmos.afirmacion)}"</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GUÍA DE CRISTALES - Enciclopedia completa
// ═══════════════════════════════════════════════════════════════

// Colores y gradientes para cada cristal
const COLORES_CRISTALES = {
  'amatista': { gradient: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 50%, #6c3483 100%)', glow: '#9b59b6' },
  'cuarzo rosa': { gradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 50%, #f48fb1 100%)', glow: '#f48fb1' },
  'citrino': { gradient: 'linear-gradient(135deg, #fff9c4 0%, #f4d03f 50%, #f39c12 100%)', glow: '#f4d03f' },
  'turmalina negra': { gradient: 'linear-gradient(135deg, #434343 0%, #1a1a1a 50%, #000000 100%)', glow: '#333' },
  'turmalina': { gradient: 'linear-gradient(135deg, #434343 0%, #1a1a1a 50%, #000000 100%)', glow: '#333' },
  'cuarzo transparente': { gradient: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%)', glow: '#fff' },
  'cuarzo claro': { gradient: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%)', glow: '#fff' },
  'selenita': { gradient: 'linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #f5f5f5 100%)', glow: '#fff' },
  'ojo de tigre': { gradient: 'linear-gradient(135deg, #d4a853 0%, #b8860b 50%, #8b6914 100%)', glow: '#d4a853' },
  'obsidiana': { gradient: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 50%, #0d0d0d 100%)', glow: '#333' },
  'labradorita': { gradient: 'linear-gradient(135deg, #5dade2 0%, #3498db 30%, #2980b9 60%, #1f618d 100%)', glow: '#3498db' },
  'jade': { gradient: 'linear-gradient(135deg, #a8e6cf 0%, #56ab91 50%, #2d6a4f 100%)', glow: '#56ab91' },
  'lapislázuli': { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0d47a1 50%, #1565c0 100%)', glow: '#1565c0' },
  'lapis': { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0d47a1 50%, #1565c0 100%)', glow: '#1565c0' },
  'piedra luna': { gradient: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 30%, #c9d6ff 70%, #e2e2e2 100%)', glow: '#c9d6ff' },
  'aventurina': { gradient: 'linear-gradient(135deg, #81c784 0%, #4caf50 50%, #2e7d32 100%)', glow: '#4caf50' },
  'hematita': { gradient: 'linear-gradient(135deg, #616161 0%, #424242 50%, #212121 100%)', glow: '#616161' },
  'malaquita': { gradient: 'linear-gradient(135deg, #4db6ac 0%, #009688 50%, #00695c 100%)', glow: '#009688' },
  'ágata': { gradient: 'linear-gradient(135deg, #bcaaa4 0%, #8d6e63 50%, #5d4037 100%)', glow: '#8d6e63' },
  'agata': { gradient: 'linear-gradient(135deg, #bcaaa4 0%, #8d6e63 50%, #5d4037 100%)', glow: '#8d6e63' },
  'cornalina': { gradient: 'linear-gradient(135deg, #ff8a65 0%, #e64a19 50%, #bf360c 100%)', glow: '#e64a19' },
  'fluorita': { gradient: 'linear-gradient(135deg, #ce93d8 0%, #ab47bc 30%, #4dd0e1 70%, #00acc1 100%)', glow: '#ab47bc' },
  'sodalita': { gradient: 'linear-gradient(135deg, #5c6bc0 0%, #3949ab 50%, #1a237e 100%)', glow: '#3949ab' },
  'pirita': { gradient: 'linear-gradient(135deg, #ffd54f 0%, #ffb300 50%, #ff8f00 100%)', glow: '#ffb300' },
  'amazonita': { gradient: 'linear-gradient(135deg, #80deea 0%, #4dd0e1 50%, #00acc1 100%)', glow: '#4dd0e1' },
  'ónix': { gradient: 'linear-gradient(135deg, #37474f 0%, #263238 50%, #000a12 100%)', glow: '#37474f' },
  'onix': { gradient: 'linear-gradient(135deg, #37474f 0%, #263238 50%, #000a12 100%)', glow: '#37474f' },
  'rodocrosita': { gradient: 'linear-gradient(135deg, #f48fb1 0%, #ec407a 50%, #c2185b 100%)', glow: '#ec407a' },
  'rodonita': { gradient: 'linear-gradient(135deg, #f48fb1 0%, #e91e63 50%, #880e4f 100%)', glow: '#e91e63' },
  'turquesa': { gradient: 'linear-gradient(135deg, #4dd0e1 0%, #00bcd4 50%, #0097a7 100%)', glow: '#00bcd4' },
  'granate': { gradient: 'linear-gradient(135deg, #c62828 0%, #8e0000 50%, #5d0000 100%)', glow: '#c62828' },
  'jaspe': { gradient: 'linear-gradient(135deg, #d84315 0%, #bf360c 50%, #870000 100%)', glow: '#d84315' },
  'crisocola': { gradient: 'linear-gradient(135deg, #4db6ac 0%, #26a69a 50%, #00897b 100%)', glow: '#26a69a' },
  'cuarzo ahumado': { gradient: 'linear-gradient(135deg, #8d6e63 0%, #6d4c41 50%, #4e342e 100%)', glow: '#8d6e63' },
  'howlita': { gradient: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #e0e0e0 100%)', glow: '#f5f5f5' },
  'kunzita': { gradient: 'linear-gradient(135deg, #f8bbd9 0%, #f48fb1 50%, #ec407a 100%)', glow: '#f48fb1' },
};

function getColorCristal(nombre) {
  const nombreLower = nombre.toLowerCase();
  for (const [key, colors] of Object.entries(COLORES_CRISTALES)) {
    if (nombreLower.includes(key) || key.includes(nombreLower)) return colors;
  }
  return { gradient: 'linear-gradient(135deg, #d4af37 0%, #b8860b 50%, #8b6914 100%)', glow: '#d4af37' };
}

export function GuiaCristales({ usuario }) {
  const [cristales, setCristales] = useState([]);
  const [cristalActivo, setCristalActivo] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [filtroChakra, setFiltroChakra] = useState('');
  const [cargando, setCargando] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const chakras = ['Raíz', 'Sacro', 'Plexo Solar', 'Corazón', 'Garganta', 'Tercer Ojo', 'Corona'];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    cargarCristales();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      if (data.success) setCristales(data.cristales);
    } catch (e) {
      console.error('Error cargando cristales:', e);
    }
    setCargando(false);
  };

  const cargarDetalle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/cristales?id=${id}`);
      const data = await res.json();
      if (data.success) setCristalActivo(data.cristal);
    } catch (e) {
      console.error('Error cargando cristal:', e);
    }
  };

  const cristalesFiltrados = cristales.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.propiedades?.toLowerCase().includes(filtro.toLowerCase())
  );

  // ═══ ESTILOS INLINE FORZADOS ═══
  const estilos = {
    container: { paddingBottom: '20px', maxWidth: '100%', overflowX: 'hidden' },
    header: { textAlign: 'center', marginBottom: '20px' },
    headerH2: { color: '#d4af37', margin: '0 0 5px', fontSize: isMobile ? '1.3rem' : '1.5rem' },
    headerP: { color: '#bbb', fontSize: isMobile ? '0.9rem' : '1rem' },
    filtros: { marginBottom: '20px' },
    input: {
      width: '100%', padding: '12px 15px', background: '#1f1f1f', border: '1px solid #333',
      borderRadius: '10px', color: '#fff', fontSize: '1rem', marginBottom: '10px', boxSizing: 'border-box'
    },
    chakraFiltros: {
      display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '8px', flexWrap: 'nowrap'
    },
    chakraBtn: (activo) => ({
      padding: isMobile ? '6px 10px' : '6px 12px', background: activo ? '#d4af3722' : '#1f1f1f',
      border: 'none', borderRadius: '20px', color: activo ? '#d4af37' : '#888',
      fontSize: isMobile ? '0.75rem' : '0.85rem', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap'
    }),
    cargando: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', color: '#bbb' },
    // GRID: 1 columna en móvil para que se lea bien
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: isMobile ? '12px' : '12px'
    },
    // CARD: Más grande en móvil, horizontal layout
    card: {
      background: '#1f1f1f', borderRadius: '12px', padding: isMobile ? '15px' : '15px',
      cursor: 'pointer', border: '1px solid transparent',
      display: isMobile ? 'flex' : 'block', alignItems: 'center', gap: isMobile ? '15px' : '0',
      textAlign: isMobile ? 'left' : 'center'
    },
    cardEmoji: { fontSize: isMobile ? '2rem' : '2rem', marginBottom: isMobile ? '0' : '10px', flexShrink: 0 },
    cardContent: { flex: 1, minWidth: 0 },
    cardH4: { color: '#fff', margin: '0 0 4px', fontSize: isMobile ? '1.1rem' : '0.95rem', lineHeight: '1.3' },
    cardColor: { color: '#bbb', fontSize: isMobile ? '0.85rem' : '0.8rem', margin: '0 0 6px' },
    cardChakras: { display: 'flex', gap: '5px', marginBottom: '6px', flexWrap: 'wrap', justifyContent: isMobile ? 'flex-start' : 'center' },
    cardChakraTag: { background: '#d4af3722', color: '#d4af37', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem' },
    cardProp: { color: '#aaa', fontSize: isMobile ? '0.85rem' : '0.75rem', margin: 0, lineHeight: '1.4' },
    // DETALLE
    detalle: { padding: '10px 0', maxWidth: '100%' },
    btnVolver: { background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer', padding: '10px 0', fontSize: '1rem' },
    detalleHeader: { marginBottom: '20px' },
    detalleH2: { color: '#d4af37', margin: '0 0 5px', fontSize: isMobile ? '1.4rem' : '1.6rem' },
    nombresAlt: { color: '#bbb', fontSize: '0.9rem' },
    infoGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' },
    infoItem: { background: '#1f1f1f', padding: '10px 12px', borderRadius: '8px', color: '#ccc', fontSize: isMobile ? '0.9rem' : '1rem' },
    seccion: { background: '#1f1f1f', padding: isMobile ? '12px' : '15px', borderRadius: '12px', marginBottom: '12px' },
    seccionH3: { color: '#d4af37', margin: '0 0 10px', fontSize: isMobile ? '1rem' : '1.1rem' },
    seccionP: { color: '#ccc', margin: 0, lineHeight: '1.5', fontSize: isMobile ? '0.9rem' : '1rem' },
    tags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    tag: { background: '#d4af3722', color: '#d4af37', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem' },
    mensaje: { background: 'linear-gradient(135deg, #d4af3722, #1f1f1f)', padding: '20px', borderRadius: '12px', textAlign: 'center', marginTop: '20px' },
    mensajeP: { color: '#d4af37', fontSize: '1.1rem', fontStyle: 'italic', margin: 0, lineHeight: '1.5' }
  };

  if (cristalActivo) {
    return (
      <div style={estilos.detalle}>
        <button style={estilos.btnVolver} onClick={() => setCristalActivo(null)}>← Volver</button>
        <div style={estilos.detalleHeader}>
          <h2 style={estilos.detalleH2}>{cristalActivo.nombre}</h2>
          {cristalActivo.nombres_alternativos?.length > 0 && (
            <p style={estilos.nombresAlt}>También: {cristalActivo.nombres_alternativos.join(', ')}</p>
          )}
        </div>
        <div style={estilos.infoGrid}>
          <div style={estilos.infoItem}><strong>Color:</strong> {cristalActivo.color}</div>
          <div style={estilos.infoItem}><strong>Elemento:</strong> {cristalActivo.elemento}</div>
          <div style={estilos.infoItem}><strong>Chakras:</strong> {cristalActivo.chakras?.join(', ')}</div>
          <div style={estilos.infoItem}><strong>Signos:</strong> {cristalActivo.signos?.join(', ')}</div>
        </div>
        <div style={estilos.seccion}>
          <h3 style={estilos.seccionH3}>Propiedades Energéticas</h3>
          <p style={estilos.seccionP}>{cristalActivo.propiedades_energeticas}</p>
        </div>
        {cristalActivo.propiedades_fisicas && (
          <div style={estilos.seccion}>
            <h3 style={estilos.seccionH3}>Propiedades Físicas</h3>
            <p style={estilos.seccionP}>{cristalActivo.propiedades_fisicas}</p>
          </div>
        )}
        <div style={estilos.seccion}>
          <h3 style={estilos.seccionH3}>Cómo Limpiar</h3>
          <p style={estilos.seccionP}>{cristalActivo.como_limpiar}</p>
        </div>
        <div style={estilos.seccion}>
          <h3 style={estilos.seccionH3}>Cómo Programar</h3>
          <p style={estilos.seccionP}>{cristalActivo.como_programar}</p>
        </div>
        {cristalActivo.combinaciones_potentes?.length > 0 && (
          <div style={estilos.seccion}>
            <h3 style={estilos.seccionH3}>Combinaciones Potentes</h3>
            <div style={estilos.tags}>
              {cristalActivo.combinaciones_potentes.map((c, i) => <span key={i} style={estilos.tag}>{c}</span>)}
            </div>
          </div>
        )}
        {cristalActivo.guardianes_afines?.length > 0 && (
          <div style={estilos.seccion}>
            <h3 style={estilos.seccionH3}>Guardianes Afines</h3>
            <div style={estilos.tags}>
              {cristalActivo.guardianes_afines.map((g, i) => <span key={i} style={estilos.tag}>{g}</span>)}
            </div>
          </div>
        )}
        <div style={{...estilos.seccion, background: 'linear-gradient(135deg, #2a1f0a, #1f1f1f)'}}>
          <h3 style={estilos.seccionH3}>✦ Ritual de Activación</h3>
          <p style={estilos.seccionP}>{cristalActivo.ritual_activacion}</p>
        </div>
        {cristalActivo.advertencias && (
          <div style={{...estilos.seccion, background: '#3a1f1f', borderLeft: '3px solid #ff6b6b'}}>
            <h3 style={{...estilos.seccionH3, color: '#ff6b6b'}}>⚠️ Advertencias</h3>
            <p style={estilos.seccionP}>{cristalActivo.advertencias}</p>
          </div>
        )}
        <div style={estilos.mensaje}>
          <p style={estilos.mensajeP}>"{cristalActivo.mensaje}"</p>
        </div>
      </div>
    );
  }

  return (
    <div style={estilos.container}>
      <div style={estilos.header}>
        <h2 style={estilos.headerH2}>Guía de Cristales</h2>
        <p style={estilos.headerP}>30+ cristales con propiedades, rituales y más</p>
      </div>
      <div style={estilos.filtros}>
        <input
          type="text"
          placeholder="Buscar cristal..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={estilos.input}
        />
        <div style={estilos.chakraFiltros}>
          <button style={estilos.chakraBtn(!filtroChakra)} onClick={() => setFiltroChakra('')}>Todos</button>
          {chakras.map(ch => (
            <button key={ch} style={estilos.chakraBtn(filtroChakra === ch)} onClick={() => setFiltroChakra(ch)}>{ch}</button>
          ))}
        </div>
      </div>
      {cargando ? (
        <div style={estilos.cargando}><span style={{fontSize: '2rem'}}>💎</span><p>Cargando cristales...</p></div>
      ) : (
        <div style={estilos.grid}>
          {cristalesFiltrados.map(cristal => {
            const colores = getColorCristal(cristal.nombre);
            return (
            <div key={cristal.id} style={estilos.card} onClick={() => cargarDetalle(cristal.id)}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: colores.gradient,
                boxShadow: `0 0 20px ${colores.glow}40, inset 0 -10px 20px rgba(0,0,0,0.3), inset 0 10px 20px rgba(255,255,255,0.2)`,
                border: '2px solid rgba(212,175,55,0.5)',
                flexShrink: 0
              }} />
              <div style={estilos.cardContent}>
                <h4 style={estilos.cardH4}>{cristal.nombre}</h4>
                <p style={estilos.cardColor}>{cristal.color}</p>
                <div style={estilos.cardChakras}>
                  {cristal.chakras?.slice(0, 2).map((ch, i) => <span key={i} style={estilos.cardChakraTag}>{ch}</span>)}
                </div>
                <p style={estilos.cardProp}>{cristal.propiedades}</p>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIENDA DE RUNAS - Packs de runas para comprar
// ═══════════════════════════════════════════════════════════════

const PACKS_RUNAS = [
  {
    id: 'chispa',
    nombre: 'Chispa',
    runas: 30,
    bonus: 0,
    precio: 5,
    precioOriginal: null,
    url: `${WORDPRESS_URL}/producto/runas-chispa/`,
    descripcion: 'Para empezar a explorar (30 runas)',
    experienciasAprox: '1-2 experiencias básicas',
    icono: '✦',
    color: '#E8B86D'
  },
  {
    id: 'destello',
    nombre: 'Destello',
    runas: 80,
    bonus: 10,
    precio: 10,
    precioOriginal: null,
    url: `${WORDPRESS_URL}/producto/runas-destello/`,
    descripcion: 'El más popular (80 + 10 bonus = 90 runas)',
    experienciasAprox: '3-6 experiencias',
    popular: true,
    icono: '◆',
    color: '#D4AF37'
  },
  {
    id: 'resplandor',
    nombre: 'Resplandor',
    runas: 200,
    bonus: 40,
    precio: 20,
    precioOriginal: null,
    url: `${WORDPRESS_URL}/producto/runas-resplandor/`,
    descripcion: 'Para varias experiencias (200 + 40 bonus = 240 runas)',
    experienciasAprox: '6-15 experiencias',
    icono: '❋',
    color: '#C0A060'
  },
  {
    id: 'fulgor',
    nombre: 'Fulgor',
    runas: 550,
    bonus: 150,
    precio: 50,
    precioOriginal: null,
    url: `${WORDPRESS_URL}/producto/runas-fulgor/`,
    descripcion: 'Pack potente (550 + 150 bonus = 700 runas)',
    experienciasAprox: '15-40 experiencias',
    icono: '✧',
    color: '#FFD700'
  },
  {
    id: 'aurora',
    nombre: 'Aurora',
    runas: 1200,
    bonus: 400,
    precio: 100,
    precioOriginal: null,
    url: `${WORDPRESS_URL}/producto/runas-aurora/`,
    descripcion: 'El mejor valor (1200 + 400 bonus = 1600 runas)',
    experienciasAprox: '40-100+ experiencias',
    destacado: true,
    icono: '👑',
    color: '#9B59B6'
  }
];

export function CatalogoExperiencias({ usuario, setUsuario }) {
  const styles = {
    container: {
      minHeight: '100%',
      background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
      padding: '0',
      fontFamily: "'Inter', -apple-system, sans-serif"
    },
    header: {
      textAlign: 'center',
      padding: '50px 20px 40px',
      background: 'radial-gradient(ellipse at center top, rgba(212,175,55,0.08) 0%, transparent 60%)'
    },
    title: {
      fontFamily: "'Cinzel', 'Times New Roman', serif",
      fontSize: '2.5rem',
      color: '#d4af37',
      margin: '0 0 12px',
      letterSpacing: '3px',
      textShadow: '0 0 40px rgba(212,175,55,0.3)',
      fontWeight: '400'
    },
    subtitle: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: '1rem',
      margin: '0 0 30px',
      fontWeight: '300',
      letterSpacing: '1px',
      maxWidth: '500px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    runasActuales: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(212,175,55,0.1)',
      border: '1px solid rgba(212,175,55,0.25)',
      padding: '12px 24px',
      borderRadius: '30px',
      color: '#d4af37',
      fontSize: '1.1rem',
      fontFamily: "'Cinzel', serif"
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      padding: '0 24px 40px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: (color, destacado, popular) => ({
      position: 'relative',
      background: 'linear-gradient(165deg, rgba(25,25,35,0.95) 0%, rgba(15,15,22,0.98) 100%)',
      borderRadius: '20px',
      padding: '32px 28px',
      border: destacado ? `2px solid ${color}` : '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: destacado ? `0 0 30px ${color}20` : '0 4px 20px rgba(0,0,0,0.3)'
    }),
    cardGlow: (color) => ({
      position: 'absolute',
      top: '-50%',
      right: '-50%',
      width: '250px',
      height: '250px',
      background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`,
      pointerEvents: 'none'
    }),
    badge: (type) => ({
      position: 'absolute',
      top: '16px',
      right: '16px',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      background: type === 'popular' ? 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)' : 'linear-gradient(135deg, #9370DB 0%, #7B5FB8 100%)',
      color: type === 'popular' ? '#000' : '#fff'
    }),
    iconoContainer: (color) => ({
      width: '70px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${color}20 0%, ${color}08 100%)`,
      borderRadius: '20px',
      marginBottom: '20px',
      fontSize: '2.2rem',
      color: color,
      filter: `drop-shadow(0 0 15px ${color}30)`
    }),
    packName: {
      fontFamily: "'Cinzel', serif",
      color: '#fff',
      fontSize: '1.5rem',
      margin: '0 0 6px',
      fontWeight: '500'
    },
    runas: (color) => ({
      color: color,
      fontSize: '2rem',
      fontFamily: "'Cinzel', serif",
      fontWeight: '600',
      margin: '0 0 16px',
      display: 'flex',
      alignItems: 'baseline',
      gap: '6px'
    }),
    runasSymbol: {
      fontSize: '1.5rem'
    },
    descripcion: {
      color: 'rgba(255,255,255,0.55)',
      fontSize: '0.95rem',
      lineHeight: '1.6',
      marginBottom: '16px'
    },
    experiencias: {
      color: 'rgba(255,255,255,0.4)',
      fontSize: '0.85rem',
      marginBottom: '24px',
      fontStyle: 'italic'
    },
    precioContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px'
    },
    precio: {
      fontSize: '1.8rem',
      color: '#fff',
      fontWeight: '600'
    },
    precioOriginal: {
      fontSize: '1.1rem',
      color: 'rgba(255,255,255,0.35)',
      textDecoration: 'line-through'
    },
    moneda: {
      fontSize: '1rem',
      color: 'rgba(255,255,255,0.5)'
    },
    boton: (color) => ({
      width: '100%',
      padding: '16px',
      background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
      border: 'none',
      color: '#000',
      fontSize: '1rem',
      fontWeight: '600',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'block',
      textAlign: 'center',
      boxShadow: `0 4px 15px ${color}30`
    }),
    infoSection: {
      maxWidth: '800px',
      margin: '40px auto 60px',
      padding: '0 24px'
    },
    infoBox: {
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '16px',
      padding: '30px'
    },
    infoTitle: {
      fontFamily: "'Cinzel', serif",
      color: '#d4af37',
      fontSize: '1.2rem',
      margin: '0 0 20px',
      textAlign: 'center'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px'
    },
    infoItem: {
      textAlign: 'center',
      padding: '20px'
    },
    infoIcon: {
      fontSize: '2rem',
      marginBottom: '12px',
      display: 'block',
      color: '#d4af37'
    },
    infoText: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: '0.9rem',
      lineHeight: '1.5'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tienda de Runas</h1>
        <p style={styles.subtitle}>
          Las runas son la moneda mágica del bosque. Usalas para acceder a experiencias, lecturas y estudios personalizados.
        </p>
        <div style={styles.runasActuales}>
          <span>Tus runas:</span>
          <strong>ᚱ {usuario?.runas || 0}</strong>
        </div>
      </div>

      <div style={styles.grid}>
        {PACKS_RUNAS.map(pack => (
          <div
            key={pack.id}
            style={styles.card(pack.color, pack.destacado, pack.popular)}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 40px ${pack.color}15`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = pack.destacado ? `0 0 30px ${pack.color}20` : '0 4px 20px rgba(0,0,0,0.3)';
            }}
          >
            <div style={styles.cardGlow(pack.color)}></div>

            {pack.popular && <span style={styles.badge('popular')}>Más elegido</span>}
            {pack.destacado && <span style={styles.badge('destacado')}>Mejor valor</span>}

            <div style={styles.iconoContainer(pack.color)}>{pack.icono}</div>

            <h3 style={styles.packName}>{pack.nombre}</h3>

            <div style={styles.runas(pack.color)}>
              <span style={styles.runasSymbol}>ᚱ</span>
              <span>{pack.runas}</span>
            </div>

            <p style={styles.descripcion}>{pack.descripcion}</p>
            <p style={styles.experiencias}>{pack.experienciasAprox}</p>

            <div style={styles.precioContainer}>
              <span style={styles.precio}>US$ {pack.precio}</span>
              {pack.precioOriginal && (
                <span style={styles.precioOriginal}>US$ {pack.precioOriginal}</span>
              )}
            </div>

            <a
              href={pack.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.boton(pack.color)}
            >
              Comprar {pack.nombre}
            </a>
          </div>
        ))}
      </div>

      <div style={styles.infoSection}>
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>¿Cómo funcionan las runas?</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>◈</span>
              <p style={styles.infoText}>Comprás un pack de runas con dinero real</p>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>✧</span>
              <p style={styles.infoText}>Las runas se acreditan instantáneamente en tu cuenta</p>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>❋</span>
              <p style={styles.infoText}>Usás las runas para acceder a experiencias mágicas</p>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>◆</span>
              <p style={styles.infoText}>Las runas nunca vencen, usalas cuando quieras</p>
            </div>
          </div>
        </div>
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
.senal-fase { margin: 0; color: #ddd; font-size: 0.9rem; }
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
  color: #fff !important;
}
.senal-accion p, .senal-cristal p, .senal-numero-significado p,
.senal-accion small, .senal-cristal small {
  color: #fff !important;
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
.senal-cristal div small { color: #ddd; font-size: 0.75rem; display: block; }
.senal-numero-significado span {
  display: block;
  font-size: 1.5rem;
  color: #d4af37;
}
.senal-numero-significado small {
  font-size: 0.75rem;
  color: #ddd;
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
.test-tiempo { color: #bbb; font-size: 0.9rem; }
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
.cosmos-header p { color: #bbb; }
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
  color: #bbb;
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
.luna-actual small { color: #bbb; }
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
.fecha-item small { color: #bbb; }
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
.guardian-tipo { color: #bbb; font-size: 0.9rem; margin-bottom: 10px; }
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
.fecha-item-full small { display: block; color: #bbb; }
.fecha-desc { color: #ddd; font-size: 0.85rem; margin: 5px 0 0; }
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
  color: #fff !important;
}
.astro-item strong { color: #d4af37; }
.sol-actual p { color: #fff !important; margin: 5px 0 0; }
.cristal-elemento, .cristal-limpiar {
  background: #1f1f1f;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 10px;
  color: #fff !important;
}
.cristal-elemento strong, .cristal-limpiar h4 { color: #d4af37; }
.cristal-limpiar p { margin: 5px 0 0; color: #fff !important; }
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
.guia-header p { color: #bbb; }
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
  color: #bbb;
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
.cristal-color { color: #bbb; font-size: 0.8rem; margin: 0 0 8px; }
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
  color: #ddd;
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
.nombres-alt { color: #bbb; font-size: 0.9rem; margin: 0; }
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
.catalogo-header p { color: #bbb; }
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
  color: #bbb;
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
.exp-desc { color: #bbb; font-size: 0.9rem; margin: 0 0 12px; line-height: 1.4; }
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
.runas-info p { margin: 0 0 10px; color: #ddd; }
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
  color: #bbb;
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
  color: #bbb;
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
  color: #bbb;
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
