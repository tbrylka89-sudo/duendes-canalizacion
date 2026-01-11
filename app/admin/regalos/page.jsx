'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// PALETA DE COLORES - REGALOS (Naranja vibrante)
// ═══════════════════════════════════════════════════════════════

const COLORS = {
  bg: '#0a0a0f',
  bgCard: '#12121a',
  bgElevated: '#1a1a25',
  bgInput: '#0d0d14',

  orange: '#F97316',
  orangeLight: '#FB923C',
  orangeDark: '#EA580C',
  orangeGlow: 'rgba(249, 115, 22, 0.15)',

  gold: '#F59E0B',
  amber: '#FBBF24',

  text: '#ffffff',
  textSecondary: '#a0a0b0',
  textMuted: '#6b6b7b',

  border: '#2a2a3a',
  borderLight: '#3a3a4a',

  success: '#10B981',
  error: '#EF4444'
};

// ═══════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════

const TIPOS_REGALO = [
  {
    id: 'runas',
    nombre: 'Runas',
    icono: 'ᚱ',
    desc: 'Moneda magica para experiencias',
    color: '#8B5CF6',
    opciones: [5, 10, 20, 50, 100]
  },
  {
    id: 'treboles',
    nombre: 'Treboles',
    icono: '☘',
    desc: 'Moneda para canjear en la tienda',
    color: '#10B981',
    opciones: [10, 25, 50, 100]
  },
  {
    id: 'circulo',
    nombre: 'Dias de Circulo',
    icono: '★',
    desc: 'Tiempo de membresia premium',
    color: '#F59E0B',
    opciones: [7, 15, 30, 60, 90]
  },
  {
    id: 'lectura',
    nombre: 'Lectura Gratis',
    icono: '📜',
    desc: 'Una lectura de cortesia',
    color: '#EC4899',
    opciones: ['Tirada de Runas', 'Oraculo', 'Lectura Ancestral']
  },
  {
    id: 'descuento',
    nombre: 'Cupon Descuento',
    icono: '🎟️',
    desc: 'Monto fijo USD',
    color: '#06B6D4',
    opciones: ['$5 USD', '$10 USD', '$15 USD', '$20 USD', '$25 USD']
  }
];

// ═══════════════════════════════════════════════════════════════
// REGALOS PAGE
// ═══════════════════════════════════════════════════════════════

export default function RegalosPage() {
  // Estados del wizard
  const [paso, setPaso] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [destinatario, setDestinatario] = useState(null);
  const [tipoRegalo, setTipoRegalo] = useState(null);
  const [cantidad, setCantidad] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const buscarCliente = async () => {
    if (!busqueda.trim()) return;
    setBuscando(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/clientes?q=${encodeURIComponent(busqueda)}`);
      const data = await res.json();
      setResultados(data.clientes || []);
      if ((data.clientes || []).length === 0) {
        showToast('No se encontraron clientes', 'error');
      }
    } catch (e) {
      showToast('Error al buscar', 'error');
    }
    setBuscando(false);
  };

  const seleccionarDestinatario = (cliente) => {
    setDestinatario(cliente);
    setPaso(2);
  };

  const seleccionarTipo = (tipo) => {
    setTipoRegalo(tipo);
    setCantidad(null);
    setPaso(3);
  };

  const seleccionarCantidad = (cant) => {
    setCantidad(cant);
    setPaso(4);
  };

  const enviarRegalo = async () => {
    if (!destinatario || !tipoRegalo || cantidad === null) return;
    setEnviando(true);
    setError('');

    try {
      const res = await fetch('/api/admin/regalos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: destinatario.email,
          tipo: tipoRegalo.id,
          cantidad,
          mensaje
        })
      });

      const data = await res.json();
      if (data.success) {
        setEnviado(true);
      } else {
        showToast(data.error || 'Error al enviar regalo', 'error');
      }
    } catch (e) {
      showToast('Error de conexion', 'error');
    }
    setEnviando(false);
  };

  const reiniciar = () => {
    setPaso(1);
    setBusqueda('');
    setResultados([]);
    setDestinatario(null);
    setTipoRegalo(null);
    setCantidad(null);
    setMensaje('');
    setEnviado(false);
    setError('');
  };

  // Vista de exito
  if (enviado) {
    return (
      <div style={estilos.container}>
        {/* Toast */}
        {toast && (
          <div style={{
            ...estilos.toast,
            background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            borderColor: toast.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
            color: toast.type === 'error' ? '#EF4444' : '#10B981'
          }}>
            {toast.message}
          </div>
        )}

        <div style={estilos.exitoCard}>
          <div style={estilos.exitoGlow}></div>
          <div style={estilos.exitoIcono}>🎁</div>
          <h2 style={estilos.exitoTitulo}>Regalo enviado!</h2>
          <p style={estilos.exitoTexto}>
            <span style={{ color: tipoRegalo.color }}>{tipoRegalo.icono}</span> {cantidad} {tipoRegalo.nombre}
          </p>
          <p style={estilos.exitoDestinatario}>
            para <strong>{destinatario.nombre || destinatario.email}</strong>
          </p>
          <button onClick={reiniciar} style={estilos.nuevoBtn}>
            Enviar otro regalo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={estilos.container}>
      {/* Toast */}
      {toast && (
        <div style={{
          ...estilos.toast,
          background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          borderColor: toast.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
          color: toast.type === 'error' ? '#EF4444' : '#10B981'
        }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={estilos.header}>
        <div style={estilos.headerAccent}></div>
        <div style={estilos.headerContent}>
          <h1 style={estilos.titulo}>Regalos</h1>
          <p style={estilos.subtitulo}>Sistema de obsequios para clientes</p>
        </div>
      </div>

      {/* Info Box */}
      <div style={estilos.infoBox}>
        <div style={estilos.infoIcon}>🎁</div>
        <div style={estilos.infoContent}>
          <p style={estilos.infoText}>
            <strong>Envia regalos especiales</strong> a tus clientes mas fieles. Runas, treboles,
            dias de membresia, lecturas gratis o cupones de descuento.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div style={estilos.progress}>
        {[
          { num: 1, label: 'Destinatario', icon: '👤' },
          { num: 2, label: 'Tipo', icon: '🎁' },
          { num: 3, label: 'Cantidad', icon: '✨' },
          { num: 4, label: 'Confirmar', icon: '✓' }
        ].map((p) => (
          <div
            key={p.num}
            style={{
              ...estilos.progressItem,
              opacity: paso >= p.num ? 1 : 0.4
            }}
          >
            <div style={{
              ...estilos.progressNum,
              background: paso >= p.num ? COLORS.orange : COLORS.bgElevated,
              borderColor: paso >= p.num ? COLORS.orange : COLORS.border,
              color: paso >= p.num ? '#fff' : COLORS.textMuted,
              boxShadow: paso >= p.num ? `0 0 20px ${COLORS.orangeGlow}` : 'none'
            }}>
              {paso > p.num ? '✓' : p.icon}
            </div>
            <span style={{
              ...estilos.progressLabel,
              color: paso >= p.num ? COLORS.text : COLORS.textMuted
            }}>{p.label}</span>
          </div>
        ))}
      </div>

      {/* Paso 1: Seleccionar destinatario */}
      {paso === 1 && (
        <div style={estilos.pasoCard}>
          <h3 style={estilos.pasoTitulo}>Selecciona el destinatario</h3>
          <p style={estilos.pasoDesc}>Busca al cliente que recibira el regalo</p>

          <div style={estilos.buscador}>
            <input
              type="text"
              placeholder="Buscar por email o nombre..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscarCliente()}
              style={estilos.input}
            />
            <button onClick={buscarCliente} style={estilos.buscarBtn} disabled={buscando}>
              {buscando ? (
                <span style={estilos.spinner}></span>
              ) : (
                'Buscar'
              )}
            </button>
          </div>

          <div style={estilos.resultadosLista}>
            {resultados.map((cliente, i) => (
              <div
                key={i}
                onClick={() => seleccionarDestinatario(cliente)}
                style={estilos.clienteItem}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = COLORS.orange;
                  e.currentTarget.style.background = COLORS.orangeGlow;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = COLORS.border;
                  e.currentTarget.style.background = COLORS.bgCard;
                }}
              >
                <div style={estilos.clienteAvatar}>
                  {(cliente.nombre || cliente.email || '?')[0].toUpperCase()}
                </div>
                <div style={estilos.clienteInfo}>
                  <div style={estilos.clienteNombre}>
                    {cliente.nombre || cliente.nombrePreferido || 'Sin nombre'}
                  </div>
                  <div style={estilos.clienteEmail}>{cliente.email}</div>
                </div>
                <div style={estilos.clienteStats}>
                  <span style={{ color: '#8B5CF6' }}>ᚱ {cliente.runas || 0}</span>
                  <span style={{ color: '#10B981' }}>☘ {cliente.treboles || 0}</span>
                </div>
              </div>
            ))}
            {resultados.length === 0 && busqueda && !buscando && (
              <p style={estilos.vacio}>No se encontraron resultados</p>
            )}
          </div>
        </div>
      )}

      {/* Paso 2: Seleccionar tipo de regalo */}
      {paso === 2 && (
        <div style={estilos.pasoCard}>
          <div style={estilos.pasoHeader}>
            <button onClick={() => setPaso(1)} style={estilos.volverBtn}>
              ← Atras
            </button>
          </div>
          <h3 style={estilos.pasoTitulo}>Tipo de regalo</h3>
          <p style={estilos.pasoDesc}>
            Para <strong style={{ color: COLORS.orange }}>{destinatario?.nombre || destinatario?.email}</strong>
          </p>

          <div style={estilos.tiposGrid}>
            {TIPOS_REGALO.map(tipo => (
              <div
                key={tipo.id}
                onClick={() => seleccionarTipo(tipo)}
                style={estilos.tipoCard}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = tipo.color;
                  e.currentTarget.style.background = `${tipo.color}15`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = COLORS.border;
                  e.currentTarget.style.background = COLORS.bgCard;
                }}
              >
                <span style={{ ...estilos.tipoIcono, color: tipo.color }}>{tipo.icono}</span>
                <span style={estilos.tipoNombre}>{tipo.nombre}</span>
                <span style={estilos.tipoDesc}>{tipo.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paso 3: Seleccionar cantidad */}
      {paso === 3 && (
        <div style={estilos.pasoCard}>
          <div style={estilos.pasoHeader}>
            <button onClick={() => setPaso(2)} style={estilos.volverBtn}>
              ← Atras
            </button>
          </div>
          <h3 style={estilos.pasoTitulo}>
            <span style={{ color: tipoRegalo?.color }}>{tipoRegalo?.icono}</span> {tipoRegalo?.nombre}
          </h3>
          <p style={estilos.pasoDesc}>Selecciona la cantidad a regalar</p>

          <div style={estilos.cantidadGrid}>
            {tipoRegalo?.opciones.map((opc, i) => (
              <button
                key={i}
                onClick={() => seleccionarCantidad(opc)}
                style={{
                  ...estilos.cantidadBtn,
                  ...(cantidad === opc ? {
                    background: `${tipoRegalo.color}20`,
                    borderColor: tipoRegalo.color,
                    color: tipoRegalo.color
                  } : {})
                }}
                onMouseOver={e => {
                  if (cantidad !== opc) {
                    e.currentTarget.style.borderColor = tipoRegalo.color;
                  }
                }}
                onMouseOut={e => {
                  if (cantidad !== opc) {
                    e.currentTarget.style.borderColor = COLORS.border;
                  }
                }}
              >
                {typeof opc === 'number' ? (
                  <>
                    <span style={{ fontSize: '24px', fontWeight: '600' }}>{opc}</span>
                    <span style={{ fontSize: '13px', color: COLORS.textSecondary }}>{tipoRegalo.nombre}</span>
                  </>
                ) : (
                  <span>{opc}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Paso 4: Confirmar */}
      {paso === 4 && (
        <div style={estilos.pasoCard}>
          <div style={estilos.pasoHeader}>
            <button onClick={() => setPaso(3)} style={estilos.volverBtn}>
              ← Atras
            </button>
          </div>
          <h3 style={estilos.pasoTitulo}>Confirmar regalo</h3>
          <p style={estilos.pasoDesc}>Revisa los detalles antes de enviar</p>

          <div style={estilos.resumen}>
            <div style={estilos.resumenItem}>
              <span style={estilos.resumenLabel}>Destinatario</span>
              <span style={estilos.resumenValor}>{destinatario?.nombre || destinatario?.email}</span>
            </div>
            <div style={estilos.resumenItem}>
              <span style={estilos.resumenLabel}>Regalo</span>
              <span style={{ ...estilos.resumenValor, color: tipoRegalo?.color }}>
                {tipoRegalo?.icono} {cantidad} {tipoRegalo?.nombre}
              </span>
            </div>
          </div>

          <div style={estilos.mensajeGrupo}>
            <label style={estilos.label}>Mensaje personal (opcional)</label>
            <textarea
              placeholder="Escribe un mensaje para acompanar el regalo..."
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              style={estilos.textarea}
              rows={3}
            />
          </div>

          <button
            onClick={enviarRegalo}
            disabled={enviando}
            style={{
              ...estilos.enviarBtn,
              opacity: enviando ? 0.7 : 1
            }}
          >
            {enviando ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span style={estilos.spinnerWhite}></span>
                Enviando...
              </span>
            ) : (
              '🎁 Enviar regalo'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════

const estilos = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative'
  },

  // Toast
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '14px 20px',
    borderRadius: '12px',
    border: '1px solid',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: 1000,
    animation: 'slideIn 0.3s ease'
  },

  // Header
  header: {
    background: COLORS.bgCard,
    borderRadius: '20px',
    overflow: 'hidden',
    marginBottom: '24px',
    border: `1px solid ${COLORS.border}`
  },
  headerAccent: {
    height: '4px',
    background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.gold}, ${COLORS.amber})`
  },
  headerContent: {
    padding: '24px 28px'
  },
  titulo: {
    color: COLORS.text,
    fontSize: '26px',
    fontWeight: '700',
    marginBottom: '6px'
  },
  subtitulo: {
    color: COLORS.textSecondary,
    fontSize: '15px'
  },

  // Info Box
  infoBox: {
    display: 'flex',
    gap: '16px',
    padding: '20px',
    background: COLORS.orangeGlow,
    border: `1px solid ${COLORS.orange}30`,
    borderRadius: '16px',
    marginBottom: '28px'
  },
  infoIcon: {
    fontSize: '28px',
    lineHeight: 1
  },
  infoContent: {
    flex: 1
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: '14px',
    lineHeight: 1.6,
    margin: 0
  },

  // Progress
  progress: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '32px',
    padding: '0 10px'
  },
  progressItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    transition: 'opacity 0.3s'
  },
  progressNum: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  progressLabel: {
    fontSize: '13px',
    fontWeight: '500',
    transition: 'color 0.3s'
  },

  // Paso card
  pasoCard: {
    background: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '20px',
    padding: '28px'
  },
  pasoHeader: {
    marginBottom: '8px'
  },
  pasoTitulo: {
    color: COLORS.text,
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '6px'
  },
  pasoDesc: {
    color: COLORS.textSecondary,
    fontSize: '14px',
    marginBottom: '24px'
  },
  volverBtn: {
    padding: '8px 0',
    background: 'none',
    border: 'none',
    color: COLORS.textMuted,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'color 0.2s'
  },

  // Buscador
  buscador: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  },
  input: {
    flex: 1,
    padding: '16px 18px',
    background: COLORS.bgInput,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '14px',
    color: COLORS.text,
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  buscarBtn: {
    padding: '16px 28px',
    background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDark})`,
    border: 'none',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100px',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: `2px solid rgba(255,255,255,0.3)`,
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  spinnerWhite: {
    width: '18px',
    height: '18px',
    border: `2px solid rgba(255,255,255,0.3)`,
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },

  // Resultados
  resultadosLista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  clienteItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 18px',
    background: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  clienteAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDark})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600'
  },
  clienteInfo: {
    flex: 1
  },
  clienteNombre: {
    color: COLORS.text,
    fontSize: '15px',
    fontWeight: '500'
  },
  clienteEmail: {
    color: COLORS.textMuted,
    fontSize: '13px',
    marginTop: '2px'
  },
  clienteStats: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
    fontWeight: '500'
  },
  vacio: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: '14px',
    padding: '40px'
  },

  // Tipos grid
  tiposGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '14px'
  },
  tipoCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '28px 18px',
    background: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center'
  },
  tipoIcono: {
    fontSize: '36px',
    marginBottom: '4px'
  },
  tipoNombre: {
    color: COLORS.text,
    fontSize: '15px',
    fontWeight: '600'
  },
  tipoDesc: {
    color: COLORS.textMuted,
    fontSize: '12px',
    lineHeight: 1.4
  },

  // Cantidad grid
  cantidadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '14px'
  },
  cantidadBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '24px 18px',
    background: COLORS.bgElevated,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '14px',
    color: COLORS.text,
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },

  // Resumen
  resumen: {
    background: COLORS.bgElevated,
    borderRadius: '14px',
    padding: '20px',
    marginBottom: '24px'
  },
  resumenItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: `1px solid ${COLORS.border}`
  },
  resumenLabel: {
    color: COLORS.textSecondary,
    fontSize: '14px'
  },
  resumenValor: {
    color: COLORS.text,
    fontSize: '15px',
    fontWeight: '500'
  },

  // Mensaje
  mensajeGrupo: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    color: COLORS.textSecondary,
    fontSize: '13px',
    marginBottom: '10px',
    fontWeight: '500'
  },
  textarea: {
    width: '100%',
    padding: '16px 18px',
    background: COLORS.bgInput,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '14px',
    color: COLORS.text,
    fontSize: '15px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },

  // Enviar btn
  enviarBtn: {
    width: '100%',
    padding: '18px',
    background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDark})`,
    border: 'none',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: `0 4px 20px ${COLORS.orangeGlow}`
  },

  // Exito
  exitoCard: {
    background: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '24px',
    padding: '60px 40px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  exitoGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle, ${COLORS.orangeGlow} 0%, transparent 50%)`,
    opacity: 0.5
  },
  exitoIcono: {
    fontSize: '72px',
    marginBottom: '24px',
    position: 'relative',
    zIndex: 1
  },
  exitoTitulo: {
    color: COLORS.text,
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '16px',
    position: 'relative',
    zIndex: 1
  },
  exitoTexto: {
    color: COLORS.text,
    fontSize: '18px',
    marginBottom: '8px',
    position: 'relative',
    zIndex: 1
  },
  exitoDestinatario: {
    color: COLORS.textSecondary,
    fontSize: '16px',
    marginBottom: '36px',
    position: 'relative',
    zIndex: 1
  },
  nuevoBtn: {
    padding: '16px 32px',
    background: COLORS.bgElevated,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '14px',
    color: COLORS.text,
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    zIndex: 1
  }
};

// Add keyframes for animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes slideIn {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  if (!document.querySelector('#regalos-animations')) {
    style.id = 'regalos-animations';
    document.head.appendChild(style);
  }
}
