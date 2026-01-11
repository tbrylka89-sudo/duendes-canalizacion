'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════

const TIPOS_REGALO = [
  {
    id: 'runas',
    nombre: 'Runas',
    icono: 'ᚱ',
    desc: 'Moneda magica para experiencias',
    opciones: [5, 10, 20, 50, 100]
  },
  {
    id: 'treboles',
    nombre: 'Treboles',
    icono: '☘',
    desc: 'Moneda para canjear en la tienda',
    opciones: [10, 25, 50, 100]
  },
  {
    id: 'circulo',
    nombre: 'Dias de Circulo',
    icono: '★',
    desc: 'Tiempo de membresia premium',
    opciones: [7, 15, 30, 60, 90]
  },
  {
    id: 'lectura',
    nombre: 'Lectura Gratis',
    icono: '📜',
    desc: 'Una lectura de cortesia',
    opciones: ['Tirada de Runas', 'Oraculo', 'Lectura Ancestral']
  },
  {
    id: 'descuento',
    nombre: 'Cupon Descuento',
    icono: '🎟️',
    desc: 'Monto fijo USD',
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

  const buscarCliente = async () => {
    if (!busqueda.trim()) return;
    setBuscando(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/clientes?q=${encodeURIComponent(busqueda)}`);
      const data = await res.json();
      setResultados(data.clientes || []);
    } catch (e) {
      setError('Error al buscar');
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
        setError(data.error || 'Error al enviar regalo');
      }
    } catch (e) {
      setError('Error de conexion');
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
        <div style={estilos.exitoCard}>
          <div style={estilos.exitoIcono}>🎁</div>
          <h2 style={estilos.exitoTitulo}>Regalo enviado!</h2>
          <p style={estilos.exitoTexto}>
            {tipoRegalo.icono} {cantidad} {tipoRegalo.nombre} para {destinatario.nombre || destinatario.email}
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
      {/* Header */}
      <div style={estilos.header}>
        <h1 style={estilos.titulo}>🎁 Regalos</h1>
        <p style={estilos.subtitulo}>Envia regalos a tus clientes</p>
      </div>

      {/* Progress */}
      <div style={estilos.progress}>
        {[
          { num: 1, label: 'Destinatario' },
          { num: 2, label: 'Tipo' },
          { num: 3, label: 'Cantidad' },
          { num: 4, label: 'Confirmar' }
        ].map((p, i) => (
          <div
            key={p.num}
            style={{
              ...estilos.progressItem,
              ...(paso >= p.num ? estilos.progressItemActivo : {})
            }}
          >
            <div style={{
              ...estilos.progressNum,
              ...(paso >= p.num ? estilos.progressNumActivo : {})
            }}>
              {paso > p.num ? '✓' : p.num}
            </div>
            <span style={estilos.progressLabel}>{p.label}</span>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={estilos.error}>{error}</div>
      )}

      {/* Paso 1: Seleccionar destinatario */}
      {paso === 1 && (
        <div style={estilos.pasoCard}>
          <h3 style={estilos.pasoTitulo}>Selecciona el destinatario</h3>

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
              {buscando ? '...' : 'Buscar'}
            </button>
          </div>

          <div style={estilos.resultadosLista}>
            {resultados.map((cliente, i) => (
              <div
                key={i}
                onClick={() => seleccionarDestinatario(cliente)}
                style={estilos.clienteItem}
              >
                <div>
                  <div style={estilos.clienteNombre}>
                    {cliente.nombre || cliente.nombrePreferido || 'Sin nombre'}
                  </div>
                  <div style={estilos.clienteEmail}>{cliente.email}</div>
                </div>
                <div style={estilos.clienteStats}>
                  <span>ᚱ {cliente.runas || 0}</span>
                  <span>☘ {cliente.treboles || 0}</span>
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
            <button onClick={() => setPaso(1)} style={estilos.volverBtn}>← Atras</button>
            <h3 style={estilos.pasoTitulo}>Tipo de regalo para {destinatario?.nombre || destinatario?.email}</h3>
          </div>

          <div style={estilos.tiposGrid}>
            {TIPOS_REGALO.map(tipo => (
              <div
                key={tipo.id}
                onClick={() => seleccionarTipo(tipo)}
                style={estilos.tipoCard}
              >
                <span style={estilos.tipoIcono}>{tipo.icono}</span>
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
            <button onClick={() => setPaso(2)} style={estilos.volverBtn}>← Atras</button>
            <h3 style={estilos.pasoTitulo}>{tipoRegalo?.icono} {tipoRegalo?.nombre}</h3>
          </div>

          <div style={estilos.cantidadGrid}>
            {tipoRegalo?.opciones.map((opc, i) => (
              <button
                key={i}
                onClick={() => seleccionarCantidad(opc)}
                style={{
                  ...estilos.cantidadBtn,
                  ...(cantidad === opc ? estilos.cantidadBtnActivo : {})
                }}
              >
                {typeof opc === 'number' ? `${opc} ${tipoRegalo.nombre}` : opc}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Paso 4: Confirmar */}
      {paso === 4 && (
        <div style={estilos.pasoCard}>
          <div style={estilos.pasoHeader}>
            <button onClick={() => setPaso(3)} style={estilos.volverBtn}>← Atras</button>
            <h3 style={estilos.pasoTitulo}>Confirmar regalo</h3>
          </div>

          <div style={estilos.resumen}>
            <div style={estilos.resumenItem}>
              <span style={estilos.resumenLabel}>Destinatario</span>
              <span style={estilos.resumenValor}>{destinatario?.nombre || destinatario?.email}</span>
            </div>
            <div style={estilos.resumenItem}>
              <span style={estilos.resumenLabel}>Regalo</span>
              <span style={estilos.resumenValor}>
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
            style={estilos.enviarBtn}
          >
            {enviando ? 'Enviando...' : '🎁 Enviar regalo'}
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
    maxWidth: '700px',
    margin: '0 auto'
  },

  // Header
  header: {
    marginBottom: '24px'
  },
  titulo: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  subtitulo: {
    color: '#666',
    fontSize: '14px'
  },

  // Progress
  progress: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '32px',
    padding: '0 20px'
  },
  progressItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    opacity: 0.4
  },
  progressItemActivo: {
    opacity: 1
  },
  progressNum: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#1f1f1f',
    border: '2px solid #2a2a2a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    fontSize: '14px',
    fontWeight: '600'
  },
  progressNumActivo: {
    background: '#C6A962',
    borderColor: '#C6A962',
    color: '#0a0a0a'
  },
  progressLabel: {
    color: '#888',
    fontSize: '12px'
  },

  // Error
  error: {
    padding: '14px 16px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '14px',
    marginBottom: '20px'
  },

  // Paso card
  pasoCard: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '24px'
  },
  pasoHeader: {
    marginBottom: '20px'
  },
  pasoTitulo: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600',
    marginTop: '12px'
  },
  volverBtn: {
    padding: '8px 12px',
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer'
  },

  // Buscador
  buscador: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '14px 16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none'
  },
  buscarBtn: {
    padding: '14px 24px',
    background: '#C6A962',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0a',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  // Resultados
  resultadosLista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  clienteItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  clienteNombre: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500'
  },
  clienteEmail: {
    color: '#666',
    fontSize: '13px',
    marginTop: '2px'
  },
  clienteStats: {
    display: 'flex',
    gap: '16px',
    color: '#888',
    fontSize: '14px'
  },
  vacio: {
    textAlign: 'center',
    color: '#555',
    fontSize: '14px',
    padding: '40px'
  },

  // Tipos grid
  tiposGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px'
  },
  tipoCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '24px 16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center'
  },
  tipoIcono: {
    fontSize: '32px',
    marginBottom: '4px'
  },
  tipoNombre: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500'
  },
  tipoDesc: {
    color: '#666',
    fontSize: '12px'
  },

  // Cantidad grid
  cantidadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px'
  },
  cantidadBtn: {
    padding: '20px 16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    color: '#ccc',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  cantidadBtnActivo: {
    background: 'rgba(198, 169, 98, 0.15)',
    borderColor: 'rgba(198, 169, 98, 0.4)',
    color: '#C6A962'
  },

  // Resumen
  resumen: {
    background: '#0a0a0a',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px'
  },
  resumenItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #1f1f1f'
  },
  resumenLabel: {
    color: '#888',
    fontSize: '14px'
  },
  resumenValor: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500'
  },

  // Mensaje
  mensajeGrupo: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    color: '#888',
    fontSize: '13px',
    marginBottom: '8px'
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit'
  },

  // Enviar btn
  enviarBtn: {
    width: '100%',
    padding: '18px',
    background: 'linear-gradient(135deg, #C6A962 0%, #D4BC7D 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#0a0a0a',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  // Exito
  exitoCard: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '60px 40px',
    textAlign: 'center'
  },
  exitoIcono: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  exitoTitulo: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  exitoTexto: {
    color: '#888',
    fontSize: '16px',
    marginBottom: '32px'
  },
  nuevoBtn: {
    padding: '14px 28px',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#ccc',
    fontSize: '15px',
    cursor: 'pointer'
  }
};
