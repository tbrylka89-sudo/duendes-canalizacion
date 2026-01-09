// ═══════════════════════════════════════════════════════════════
// COMPONENTES DEL CÍRCULO PARA MI MAGIA
// Archivo: app/mi-magia/componentes-circulo.js
// Importar y usar en page.js cuando el usuario sea del Círculo
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// 1. SECCIÓN: CONTENIDO SEMANAL
// ═══════════════════════════════════════════════════════════════

export function ContenidoSemanal({ token }) {
  const [contenido, setContenido] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState(null);
  const [semanasAnteriores, setSemanasAnteriores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarContenido();
  }, [token]);

  async function cargarContenido() {
    try {
      const res = await fetch(`/api/circulo/contenido?token=${token}`);
      const data = await res.json();
      if (data.disponible) {
        setContenido(data.contenido);
        setSemanasAnteriores(data.semanasAnteriores || []);
      }
    } catch (error) {
      console.error('Error cargando contenido:', error);
    }
    setLoading(false);
  }

  const tematicasIconos = {
    'cosmos': '🌙',
    'duendes': '🧝',
    'diy': '✂️',
    'esoterico': '🔮'
  };

  const tematicasNombres = {
    'cosmos': 'Cosmos del Mes',
    'duendes': 'Mundo Duende',
    'diy': 'Hacelo Vos Misma',
    'esoterico': 'Esotérico Práctico'
  };

  if (loading) {
    return <div style={styles.loading}>Cargando contenido del Círculo...</div>;
  }

  if (!contenido) {
    return (
      <div style={styles.noContenido}>
        <p>El contenido de esta semana aún no está disponible.</p>
        <p style={styles.small}>Volvé pronto, se publica cada semana.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerSeccion}>
        <span style={styles.badge}>
          {tematicasIconos[contenido.tematica]} {tematicasNombres[contenido.tematica]}
        </span>
        <h2 style={styles.titulo}>{contenido.titulo}</h2>
        <p style={styles.subtitulo}>{contenido.subtitulo}</p>
      </div>

      {/* Cards de contenido */}
      <div style={styles.cardsGrid}>
        {contenido.contenidoPrincipal && Object.entries(contenido.contenidoPrincipal).map(([key, value]) => {
          if (!value) return null;
          
          const iconos = {
            introduccion: '📜',
            luna: '🌙',
            eventosAstrologicos: '⭐',
            sabbat: '🔥',
            consejos: '💡',
            mensajeCierre: '✨',
            desarrollo: '📖',
            actividadPractica: '🎯',
            sabiasQue: '❓',
            mensajeGuardian: '🧝',
            materiales: '🧰',
            pasos: '📋',
            personalizacion: '🎨',
            activacionMagica: '✨',
            contenidoEducativo: '📚',
            guiaPractica: '📝',
            conexionGuardianes: '💫',
            ejercicioSemana: '🎯',
            colorDelMes: '🎨'
          };

          return (
            <div 
              key={key} 
              style={styles.card}
              onClick={() => setSeccionActiva(seccionActiva === key ? null : key)}
            >
              <div style={styles.cardHeader}>
                <span style={styles.cardIcono}>{iconos[key] || '📄'}</span>
                <span style={styles.cardTitulo}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </div>
              
              {seccionActiva === key && (
                <div style={styles.cardContenido}>
                  {typeof value === 'string' ? (
                    <p>{value}</p>
                  ) : Array.isArray(value) ? (
                    <ul style={styles.lista}>
                      {value.map((item, i) => (
                        <li key={i}>
                          {typeof item === 'string' ? item : (
                            <div>
                              <strong>{item.titulo || item.item || `Paso ${item.numero}`}</strong>
                              <p>{item.descripcion || item.alternativa || ''}</p>
                              {item.tip && <small style={styles.tip}>💡 {item.tip}</small>}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : typeof value === 'object' ? (
                    <div>
                      {Object.entries(value).map(([k, v]) => (
                        <p key={k}><strong>{k}:</strong> {v}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Meditación si existe */}
      {contenido.meditacion && (
        <div style={styles.meditacionCard}>
          <div style={styles.meditacionHeader}>
            <span>🧘</span>
            <div>
              <h4>{contenido.meditacion.titulo}</h4>
              <small>{contenido.meditacion.duracion}</small>
            </div>
          </div>
          <button 
            style={styles.btnMeditacion}
            onClick={() => setSeccionActiva(seccionActiva === 'meditacion' ? null : 'meditacion')}
          >
            {seccionActiva === 'meditacion' ? 'Cerrar' : 'Ver guion'}
          </button>
          {seccionActiva === 'meditacion' && (
            <div style={styles.meditacionGuion}>
              <p style={styles.guionTexto}>{contenido.meditacion.guion}</p>
            </div>
          )}
        </div>
      )}

      {/* Semanas anteriores */}
      {semanasAnteriores.length > 0 && (
        <div style={styles.anteriores}>
          <h4>Semanas anteriores</h4>
          {semanasAnteriores.map(sem => (
            <div key={sem.semana} style={styles.anteriorItem}>
              <span>{tematicasIconos[sem.tematica]} {sem.titulo}</span>
              <small>{sem.semana}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. SECCIÓN: ACCESO ANTICIPADO
// ═══════════════════════════════════════════════════════════════

export function AccesoAnticipado({ token }) {
  const [productos, setProductos] = useState([]);
  const [tuPlan, setTuPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
    // Actualizar cada minuto para la cuenta regresiva
    const interval = setInterval(cargarProductos, 60000);
    return () => clearInterval(interval);
  }, [token]);

  async function cargarProductos() {
    try {
      const res = await fetch(`/api/circulo/anticipado?token=${token}`);
      const data = await res.json();
      setProductos(data.productos || []);
      setTuPlan(data.tuPlan);
    } catch (error) {
      console.error('Error cargando anticipado:', error);
    }
    setLoading(false);
  }

  if (loading) {
    return <div style={styles.loading}>Cargando acceso anticipado...</div>;
  }

  if (productos.length === 0) {
    return (
      <div style={styles.noContenido}>
        <span style={styles.iconoGrande}>👁️</span>
        <h3>No hay guardianes en acceso anticipado ahora</h3>
        <p style={styles.small}>
          Te avisaremos por email cuando llegue uno nuevo.
          <br />
          Como miembro, tenés {tuPlan?.horasAnticipado || 24}h de ventaja y {tuPlan?.descuentoAnticipado || 5}% de descuento.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {productos.map(producto => (
        <div key={producto.id} style={styles.productoAnticipado}>
          {producto.imagen && (
            <img src={producto.imagen} alt={producto.nombre} style={styles.productoImagen} />
          )}
          
          <h3 style={styles.productoNombre}>{producto.nombre}</h3>
          
          <div style={styles.cuentaRegresiva}>
            ⏰ {producto.tiempoRestanteFormateado}
          </div>
          
          <div style={styles.precios}>
            <span style={styles.precioOriginal}>${producto.precioOriginal} USD</span>
            <span style={styles.precioDescuento}>${producto.precioConDescuento} USD</span>
            <span style={styles.descuentoBadge}>-{producto.descuento}%</span>
          </div>
          
          {producto.descripcion && (
            <p style={styles.productoDesc}>{producto.descripcion}</p>
          )}
          
          <a 
            href={`/producto/${producto.id}/`} 
            style={styles.btnReclamar}
          >
            Reclamar este Guardián ✦
          </a>
          
          <p style={styles.avisoAnticipado}>
            Después de la cuenta regresiva, pasa a la tienda pública sin descuento.
          </p>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. SECCIÓN: MIS BENEFICIOS
// ═══════════════════════════════════════════════════════════════

export function MisBeneficios({ membresia, nombre }) {
  if (!membresia || !membresia.activa) {
    return null;
  }

  const vencimiento = new Date(membresia.fechaVencimiento);
  const diasRestantes = Math.ceil((vencimiento - new Date()) / (1000 * 60 * 60 * 24));
  
  const lecturas = membresia.lecturasGratis || { tiradas: 0, susurros: 0 };
  
  // Calcular máximos según plan
  const maximos = {
    'mensual': { tiradas: 1, susurros: 0 },
    'trimestral': { tiradas: 2, susurros: 0 },
    'semestral': { tiradas: 2, susurros: 1 },
    'anual': { tiradas: 3, susurros: 2 }
  };
  const max = maximos[membresia.plan] || { tiradas: 1, susurros: 0 };

  return (
    <div style={styles.container}>
      <div style={styles.planHeader}>
        <span style={styles.planBadge}>✦ Plan {membresia.planNombre}</span>
        <p style={styles.planVence}>
          Válido hasta: {vencimiento.toLocaleDateString('es-AR')}
          <br />
          <small style={diasRestantes <= 7 ? styles.alertaVence : {}}>
            ({diasRestantes} días restantes)
          </small>
        </p>
      </div>

      {/* Lecturas gratis */}
      <div style={styles.seccionBeneficio}>
        <h4>Lecturas Gratis este Mes</h4>
        
        <div style={styles.contadorLecturas}>
          <div>
            <span style={styles.contadorLabel}>🔮 Tiradas de Runas</span>
            <div style={styles.contadorVisual}>
              {[...Array(max.tiradas)].map((_, i) => (
                <span 
                  key={i} 
                  style={{
                    ...styles.punto,
                    background: i < lecturas.tiradas ? '#d4af37' : '#333'
                  }}
                />
              ))}
              <span style={styles.contadorNum}>{lecturas.tiradas} de {max.tiradas}</span>
            </div>
          </div>
          
          {max.susurros > 0 && (
            <div>
              <span style={styles.contadorLabel}>💫 Susurros del Guardián</span>
              <div style={styles.contadorVisual}>
                {[...Array(max.susurros)].map((_, i) => (
                  <span 
                    key={i} 
                    style={{
                      ...styles.punto,
                      background: i < lecturas.susurros ? '#d4af37' : '#333'
                    }}
                  />
                ))}
                <span style={styles.contadorNum}>{lecturas.susurros} de {max.susurros}</span>
              </div>
            </div>
          )}
        </div>
        
        <small style={styles.resetInfo}>
          Se renuevan el 1 de cada mes
        </small>
      </div>

      {/* Descuentos */}
      <div style={styles.seccionBeneficio}>
        <h4>Descuentos Activos</h4>
        <div style={styles.descuentosLista}>
          {membresia.descuentoTienda > 0 && (
            <div style={styles.descuentoItem}>
              <span>🏷️</span>
              <span>{membresia.descuentoTienda}% en toda la tienda</span>
              <span style={styles.descuentoAuto}>(automático)</span>
            </div>
          )}
          <div style={styles.descuentoItem}>
            <span>🏷️</span>
            <span>{membresia.descuentoAnticipado}% en acceso anticipado</span>
          </div>
        </div>
      </div>

      {/* Otros beneficios */}
      <div style={styles.seccionBeneficio}>
        <h4>Otros Beneficios</h4>
        <div style={styles.beneficiosLista}>
          <div style={styles.beneficioItem}>
            <span>👁️</span>
            <span>Acceso anticipado {membresia.horasAnticipado}h a nuevos guardianes</span>
          </div>
          {membresia.titoVIP && (
            <div style={styles.beneficioItem}>
              <span>🤖</span>
              <span>Tito VIP+ (respuestas más profundas)</span>
            </div>
          )}
          <div style={styles.beneficioItem}>
            <span>📜</span>
            <span>Contenido semanal exclusivo</span>
          </div>
          {membresia.lecturaAlmaBienvenida && (
            <div style={styles.beneficioItem}>
              <span>🎁</span>
              <span>Lectura del Alma de bienvenida {membresia.lecturaAlmaGenerada ? '✓' : '(en camino)'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4. WIDGET DE CHAT TITO MEJORADO
// ═══════════════════════════════════════════════════════════════

export function ChatTito({ token, nombre, esCirculo }) {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sonidoActivo, setSonidoActivo] = useState(true);

  // Sonido de notificación
  const playSound = () => {
    if (sonidoActivo && typeof Audio !== 'undefined') {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1sb3hxcnN0dnZ2dnZ2dnRycG1saWhmZGJgX15dXFtbWltcXV5fYGJkZmhrbG5wcnR2eHl6e3t7e3t6eXh2dXNxb21raWdlY2FfXl1cW1paWlpcXV5fYWNlZ2lrbW9xc3V3eXp7fHx8fHt6eXd1c3FvbWpnZWNhX15cW1paWVlaW1xeX2FjZWdpbG5wcnR2eHp7fH19fXx7enl3dXNxb2xqZ2ViYF5dXFtaWVlZWltcXmBiZGZpbG5wcnR3eXt8fX5+fn59fHt5d3VzcG5saWdkYmBdXFpZWFhYWFlaXF1fYWRmZ2pscHJ1d3l7fH1+fn5+fXx7eXd1c3BubGpmY2FfXVxbWlpbXF1fYGJkZWhrbW9xc3V3eXt8fHx8fHt6eXd1c3FvbWtpZmRiYF5dXFtbW1tcXV5fYGJjZWhqbG5wc3V3enx9foCBgH98fHt5d3Zzcm9tbGpnZWNhX15cW1tbW1xdXl9hY2VnaWxucHJzd3l6fH1+f39+fXx7eXh2dHJwbmxqZ2ViYV9dXFxbW1xdXl9hY2VnaWxub3J0dnh6fHx9fX19fHt5eHZ0cnBubGpmZGJfXlxbWltcXV5gYmRnaWttb3J0dnh6e3x9fX19fHt5eHZ0cnBubGpmY2FfXVxbWltcXl9gYmRmaWpsbW9xc3Z3eHl6ent6eXh3dnRzcXBubGtpZ2ZkYmBfXl1cXFxdXl9gYmRlaGpsbm9xc3R2dnd3d3d3dnV1dHNycXBvbm1sa2ppaGdmZWRjY2JiYmNjZGVmZ2hpamtsbu3t7e3t7e3t7e0=');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  const enviarMensaje = async () => {
    if (!input.trim() || loading) return;
    
    const nuevoMensaje = { role: 'user', content: input };
    setMensajes([...mensajes, nuevoMensaje]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/tito/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: input,
          token,
          historial: mensajes
        })
      });
      
      const data = await res.json();
      
      setMensajes(prev => [...prev, { 
        role: 'assistant', 
        content: data.respuesta,
        recomendacion: data.recomendacion
      }]);
      
      playSound();
    } catch (error) {
      setMensajes(prev => [...prev, { 
        role: 'assistant', 
        content: 'Ups, algo salió mal. ¿Podés intentar de nuevo?' 
      }]);
    }
    
    setLoading(false);
  };

  if (!abierto) {
    return (
      <button 
        onClick={() => setAbierto(true)}
        style={styles.titoBoton}
      >
        <span style={styles.titoIcono}>🧝</span>
        <span style={styles.titoTexto}>Tito</span>
      </button>
    );
  }

  return (
    <div style={styles.titoChat}>
      <div style={styles.titoChatHeader}>
        <div>
          <span style={styles.titoNombre}>🧝 Tito</span>
          {esCirculo && <span style={styles.titoVip}>VIP</span>}
        </div>
        <div style={styles.titoControles}>
          <button 
            onClick={() => setSonidoActivo(!sonidoActivo)}
            style={styles.titoControlBtn}
          >
            {sonidoActivo ? '🔔' : '🔕'}
          </button>
          <button 
            onClick={() => setAbierto(false)}
            style={styles.titoControlBtn}
          >
            ✕
          </button>
        </div>
      </div>
      
      <div style={styles.titoChatMensajes}>
        {mensajes.length === 0 && (
          <div style={styles.titoBienvenida}>
            <p>¡Hola{nombre ? ` ${nombre}` : ''}! 👋</p>
            <p>Soy Tito, tu asistente mágico. Preguntame lo que quieras sobre duendes, cristales, rituales o cualquier cosa esotérica.</p>
          </div>
        )}
        
        {mensajes.map((msg, i) => (
          <div 
            key={i} 
            style={{
              ...styles.titoMensaje,
              ...(msg.role === 'user' ? styles.titoMensajeUser : styles.titoMensajeBot)
            }}
          >
            <p>{msg.content}</p>
            {msg.recomendacion && (
              <a href={msg.recomendacion.url} style={styles.titoRecomendacion}>
                {msg.recomendacion.texto} →
              </a>
            )}
          </div>
        ))}
        
        {loading && (
          <div style={styles.titoMensajeBot}>
            <p>Pensando...</p>
          </div>
        )}
      </div>
      
      <div style={styles.titoChatInput}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
          placeholder="Escribí tu mensaje..."
          style={styles.titoInput}
        />
        <button onClick={enviarMensaje} style={styles.titoEnviar} disabled={loading}>
          ✦
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════

const styles = {
  container: {
    padding: '20px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#888'
  },
  noContenido: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#1a1a1a',
    borderRadius: '15px'
  },
  iconoGrande: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '20px'
  },
  small: {
    color: '#888',
    fontSize: '14px',
    marginTop: '10px'
  },
  headerSeccion: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  badge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
    color: '#0a0a0a',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  titulo: {
    fontSize: '24px',
    color: '#f5f5f5',
    marginBottom: '10px'
  },
  subtitulo: {
    color: '#888',
    fontStyle: 'italic'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '15px'
  },
  card: {
    background: '#1a1a1a',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    border: '1px solid #2a2a2a'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px'
  },
  cardIcono: {
    fontSize: '24px'
  },
  cardTitulo: {
    fontSize: '16px',
    color: '#f5f5f5'
  },
  cardContenido: {
    padding: '0 20px 20px',
    borderTop: '1px solid #2a2a2a',
    paddingTop: '15px',
    color: '#ccc',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  lista: {
    paddingLeft: '20px',
    margin: '0'
  },
  tip: {
    color: '#d4af37',
    display: 'block',
    marginTop: '5px'
  },
  meditacionCard: {
    background: 'linear-gradient(135deg, #1a1a1a, #0f0f0f)',
    border: '1px solid #d4af37',
    borderRadius: '15px',
    padding: '25px',
    marginTop: '20px'
  },
  meditacionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px'
  },
  btnMeditacion: {
    background: '#d4af37',
    color: '#0a0a0a',
    border: 'none',
    padding: '10px 25px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  meditacionGuion: {
    marginTop: '20px',
    padding: '20px',
    background: '#0a0a0a',
    borderRadius: '10px'
  },
  guionTexto: {
    color: '#ccc',
    lineHeight: '1.8',
    fontStyle: 'italic'
  },
  anteriores: {
    marginTop: '30px',
    padding: '20px',
    background: '#1a1a1a',
    borderRadius: '10px'
  },
  anteriorItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #2a2a2a'
  },
  
  // Acceso anticipado
  productoAnticipado: {
    background: '#1a1a1a',
    borderRadius: '15px',
    padding: '30px',
    textAlign: 'center',
    border: '2px solid #d4af37'
  },
  productoImagen: {
    maxWidth: '100%',
    borderRadius: '10px',
    marginBottom: '20px'
  },
  productoNombre: {
    fontSize: '24px',
    color: '#f5f5f5',
    marginBottom: '15px'
  },
  cuentaRegresiva: {
    background: '#7f1d1d',
    padding: '15px 30px',
    borderRadius: '10px',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    display: 'inline-block'
  },
  precios: {
    marginBottom: '20px'
  },
  precioOriginal: {
    textDecoration: 'line-through',
    color: '#888',
    marginRight: '15px'
  },
  precioDescuento: {
    fontSize: '28px',
    color: '#d4af37',
    fontWeight: 'bold',
    marginRight: '10px'
  },
  descuentoBadge: {
    background: '#065f46',
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '14px'
  },
  productoDesc: {
    color: '#ccc',
    marginBottom: '20px'
  },
  btnReclamar: {
    display: 'inline-block',
    background: '#d4af37',
    color: '#0a0a0a',
    padding: '18px 40px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  avisoAnticipado: {
    marginTop: '20px',
    color: '#888',
    fontSize: '13px'
  },

  // Beneficios
  planHeader: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '25px',
    background: 'linear-gradient(135deg, #1a1a1a, #0f0f0f)',
    borderRadius: '15px',
    border: '1px solid #d4af37'
  },
  planBadge: {
    background: '#d4af37',
    color: '#0a0a0a',
    padding: '8px 25px',
    borderRadius: '25px',
    fontWeight: 'bold'
  },
  planVence: {
    marginTop: '15px',
    color: '#ccc'
  },
  alertaVence: {
    color: '#f87171'
  },
  seccionBeneficio: {
    background: '#1a1a1a',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '15px'
  },
  contadorLecturas: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  contadorLabel: {
    display: 'block',
    marginBottom: '8px',
    color: '#ccc'
  },
  contadorVisual: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  punto: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'inline-block'
  },
  contadorNum: {
    marginLeft: '10px',
    color: '#888',
    fontSize: '14px'
  },
  resetInfo: {
    display: 'block',
    marginTop: '15px',
    color: '#666',
    textAlign: 'center'
  },
  descuentosLista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  descuentoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  descuentoAuto: {
    color: '#888',
    fontSize: '12px'
  },
  beneficiosLista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  beneficioItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#ccc'
  },

  // Tito Chat
  titoBoton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
    border: 'none',
    borderRadius: '50px',
    padding: '15px 25px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
    zIndex: 9999
  },
  titoIcono: {
    fontSize: '24px'
  },
  titoTexto: {
    fontWeight: 'bold',
    color: '#0a0a0a'
  },
  titoChat: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '380px',
    maxHeight: '500px',
    background: '#0a0a0a',
    borderRadius: '20px',
    border: '1px solid #d4af37',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 9999,
    overflow: 'hidden'
  },
  titoChatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    background: '#1a1a1a',
    borderBottom: '1px solid #2a2a2a'
  },
  titoNombre: {
    fontWeight: 'bold',
    fontSize: '16px'
  },
  titoVip: {
    background: '#d4af37',
    color: '#0a0a0a',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '10px',
    marginLeft: '8px'
  },
  titoControles: {
    display: 'flex',
    gap: '5px'
  },
  titoControlBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '5px'
  },
  titoChatMensajes: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '350px'
  },
  titoBienvenida: {
    textAlign: 'center',
    color: '#888',
    padding: '20px'
  },
  titoMensaje: {
    padding: '12px 16px',
    borderRadius: '15px',
    maxWidth: '85%',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  titoMensajeUser: {
    background: '#d4af37',
    color: '#0a0a0a',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px'
  },
  titoMensajeBot: {
    background: '#1a1a1a',
    color: '#f5f5f5',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px'
  },
  titoRecomendacion: {
    display: 'block',
    marginTop: '10px',
    color: '#d4af37',
    textDecoration: 'none',
    fontSize: '13px'
  },
  titoChatInput: {
    display: 'flex',
    padding: '15px',
    borderTop: '1px solid #2a2a2a',
    gap: '10px'
  },
  titoInput: {
    flex: 1,
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '25px',
    padding: '12px 20px',
    color: '#f5f5f5',
    fontSize: '14px'
  },
  titoEnviar: {
    background: '#d4af37',
    color: '#0a0a0a',
    border: 'none',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold'
  }
};
