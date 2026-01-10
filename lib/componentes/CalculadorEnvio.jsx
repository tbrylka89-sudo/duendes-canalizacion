'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// CALCULADOR DE ENVIO - COMPONENTE
// ═══════════════════════════════════════════════════════════════

export function CalculadorEnvio({ total = 0, onEnvioCalculado, compacto = false }) {
  const [departamentos, setDepartamentos] = useState([]);
  const [departamento, setDepartamento] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarZonas, setMostrarZonas] = useState(false);

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  useEffect(() => {
    if (departamento) {
      calcularEnvio();
    }
  }, [departamento, total]);

  const cargarDepartamentos = async () => {
    try {
      const res = await fetch('/api/envio/calcular');
      const data = await res.json();
      if (data.success) {
        setDepartamentos(data.departamentos);
      }
    } catch (e) {
      console.error('Error cargando departamentos:', e);
    }
  };

  const calcularEnvio = async () => {
    setCargando(true);
    try {
      const res = await fetch('/api/envio/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departamento, localidad, total })
      });
      const data = await res.json();
      if (data.success) {
        setResultado(data);
        if (onEnvioCalculado) {
          onEnvioCalculado(data);
        }
      }
    } catch (e) {
      console.error('Error calculando envio:', e);
    }
    setCargando(false);
  };

  if (compacto) {
    return (
      <div style={estilos.compacto}>
        <select
          value={departamento}
          onChange={(e) => setDepartamento(e.target.value)}
          style={estilos.selectCompacto}
        >
          <option value="">Selecciona departamento</option>
          {departamentos.map(d => (
            <option key={d.id} value={d.nombre}>{d.nombre} - ${d.tarifa}</option>
          ))}
        </select>
        {resultado && (
          <div style={estilos.resultadoCompacto}>
            {resultado.envioGratis ? (
              <span style={estilos.envioGratis}>Envio gratis</span>
            ) : (
              <span>${resultado.costoEnvio}</span>
            )}
            <small>{resultado.tiempoEstimado}</small>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={estilos.contenedor}>
      <h3 style={estilos.titulo}>Calcula tu envio</h3>

      <div style={estilos.form}>
        <div style={estilos.campo}>
          <label style={estilos.label}>Departamento</label>
          <select
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            style={estilos.select}
          >
            <option value="">Selecciona tu departamento</option>
            {departamentos.map(d => (
              <option key={d.id} value={d.nombre}>{d.nombre}</option>
            ))}
          </select>
        </div>

        <div style={estilos.campo}>
          <label style={estilos.label}>Localidad (opcional)</label>
          <input
            type="text"
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
            placeholder="Barrio o ciudad"
            style={estilos.input}
          />
        </div>
      </div>

      {cargando && (
        <div style={estilos.cargando}>
          <span style={estilos.spinner}></span>
          Calculando...
        </div>
      )}

      {resultado && !cargando && (
        <div style={estilos.resultado}>
          <div style={estilos.resultadoHeader}>
            <span style={estilos.resultadoDepto}>{resultado.departamento}</span>
            {resultado.envioGratis ? (
              <span style={estilos.envioGratisBadge}>ENVIO GRATIS</span>
            ) : (
              <span style={estilos.costoEnvio}>${resultado.costoEnvio}</span>
            )}
          </div>

          <div style={estilos.resultadoInfo}>
            <div style={estilos.infoItem}>
              <span style={estilos.infoIcono}>⏱</span>
              <span>{resultado.tiempoEstimado}</span>
            </div>
          </div>

          {resultado.mensajeEnvio && !resultado.envioGratis && (
            <div style={estilos.mensajeEnvio}>
              <span style={estilos.mensajeIcono}>💡</span>
              {resultado.mensajeEnvio}
            </div>
          )}

          <button
            onClick={() => setMostrarZonas(!mostrarZonas)}
            style={estilos.btnZonas}
          >
            {mostrarZonas ? 'Ocultar zonas' : 'Ver zonas de cobertura'}
          </button>

          {mostrarZonas && resultado.zonasCobertura && (
            <div style={estilos.zonasLista}>
              {resultado.zonasCobertura.map((zona, i) => (
                <span key={i} style={estilos.zonaBadge}>{zona}</span>
              ))}
            </div>
          )}

          <div style={estilos.notaPagoDestino}>
            <small>Pago en destino: +${resultado.recargoPagoDestino}</small>
          </div>
        </div>
      )}

      {!departamento && (
        <div style={estilos.infoEnvio}>
          <p>Envios a todo Uruguay</p>
          <p style={estilos.envioGratisInfo}>
            Envio gratis en compras mayores a ${departamentos[0]?.envioGratisMinimo || 3000}
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FORMULARIO DE DIRECCION COMPLETO
// ═══════════════════════════════════════════════════════════════

export function FormularioDireccion({ onDireccionCompleta, valorInicial = {} }) {
  const [departamentos, setDepartamentos] = useState([]);
  const [form, setForm] = useState({
    nombre: valorInicial.nombre || '',
    telefono: valorInicial.telefono || '',
    departamento: valorInicial.departamento || '',
    localidad: valorInicial.localidad || '',
    direccion: valorInicial.direccion || '',
    referencias: valorInicial.referencias || '',
    codigoPostal: valorInicial.codigoPostal || ''
  });
  const [errores, setErrores] = useState({});
  const [envioInfo, setEnvioInfo] = useState(null);

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  const cargarDepartamentos = async () => {
    try {
      const res = await fetch('/api/envio/calcular');
      const data = await res.json();
      if (data.success) {
        setDepartamentos(data.departamentos);
      }
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const handleChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setErrores(prev => ({ ...prev, [campo]: null }));

    // Calcular envio cuando cambia departamento
    if (campo === 'departamento' && valor) {
      calcularEnvio(valor);
    }
  };

  const calcularEnvio = async (depto) => {
    try {
      const res = await fetch('/api/envio/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departamento: depto })
      });
      const data = await res.json();
      if (data.success) {
        setEnvioInfo(data);
      }
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!form.nombre.trim()) nuevosErrores.nombre = 'Nombre requerido';
    if (!form.telefono.trim()) nuevosErrores.telefono = 'Telefono requerido';
    if (!form.departamento) nuevosErrores.departamento = 'Selecciona departamento';
    if (!form.localidad.trim()) nuevosErrores.localidad = 'Localidad requerida';
    if (!form.direccion.trim()) nuevosErrores.direccion = 'Direccion requerida';

    // Validar formato telefono
    const telLimpio = form.telefono.replace(/\D/g, '');
    if (telLimpio.length < 8 || telLimpio.length > 11) {
      nuevosErrores.telefono = 'Telefono invalido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = () => {
    if (validar()) {
      onDireccionCompleta({
        ...form,
        envio: envioInfo
      });
    }
  };

  return (
    <div style={estilos.formDireccion}>
      <h3 style={estilos.titulo}>Datos de envio</h3>

      <div style={estilos.formGrid}>
        <div style={estilos.campo}>
          <label style={estilos.label}>Nombre completo *</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Tu nombre"
            style={{
              ...estilos.input,
              ...(errores.nombre ? estilos.inputError : {})
            }}
          />
          {errores.nombre && <span style={estilos.error}>{errores.nombre}</span>}
        </div>

        <div style={estilos.campo}>
          <label style={estilos.label}>Telefono/Celular *</label>
          <input
            type="tel"
            value={form.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            placeholder="099 123 456"
            style={{
              ...estilos.input,
              ...(errores.telefono ? estilos.inputError : {})
            }}
          />
          {errores.telefono && <span style={estilos.error}>{errores.telefono}</span>}
        </div>

        <div style={estilos.campo}>
          <label style={estilos.label}>Departamento *</label>
          <select
            value={form.departamento}
            onChange={(e) => handleChange('departamento', e.target.value)}
            style={{
              ...estilos.select,
              ...(errores.departamento ? estilos.inputError : {})
            }}
          >
            <option value="">Selecciona departamento</option>
            {departamentos.map(d => (
              <option key={d.id} value={d.nombre}>{d.nombre}</option>
            ))}
          </select>
          {errores.departamento && <span style={estilos.error}>{errores.departamento}</span>}
        </div>

        <div style={estilos.campo}>
          <label style={estilos.label}>Ciudad/Localidad *</label>
          <input
            type="text"
            value={form.localidad}
            onChange={(e) => handleChange('localidad', e.target.value)}
            placeholder="Ciudad o barrio"
            style={{
              ...estilos.input,
              ...(errores.localidad ? estilos.inputError : {})
            }}
          />
          {errores.localidad && <span style={estilos.error}>{errores.localidad}</span>}
        </div>

        <div style={{ ...estilos.campo, gridColumn: '1 / -1' }}>
          <label style={estilos.label}>Direccion *</label>
          <input
            type="text"
            value={form.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
            placeholder="Calle, numero, apto"
            style={{
              ...estilos.input,
              ...(errores.direccion ? estilos.inputError : {})
            }}
          />
          {errores.direccion && <span style={estilos.error}>{errores.direccion}</span>}
        </div>

        <div style={{ ...estilos.campo, gridColumn: '1 / -1' }}>
          <label style={estilos.label}>Referencias (opcional)</label>
          <input
            type="text"
            value={form.referencias}
            onChange={(e) => handleChange('referencias', e.target.value)}
            placeholder="Entre calles, color de casa, etc."
            style={estilos.input}
          />
        </div>

        <div style={estilos.campo}>
          <label style={estilos.label}>Codigo postal (opcional)</label>
          <input
            type="text"
            value={form.codigoPostal}
            onChange={(e) => handleChange('codigoPostal', e.target.value)}
            placeholder="11000"
            style={estilos.input}
            maxLength={5}
          />
        </div>
      </div>

      {envioInfo && (
        <div style={estilos.envioResumen}>
          <div style={estilos.envioResumenHeader}>
            <span>Envio a {envioInfo.departamento}</span>
            {envioInfo.envioGratis ? (
              <span style={estilos.envioGratisBadge}>GRATIS</span>
            ) : (
              <span style={estilos.costoEnvio}>${envioInfo.costoEnvio}</span>
            )}
          </div>
          <small style={estilos.tiempoEnvio}>
            Tiempo estimado: {envioInfo.tiempoEstimado}
          </small>
        </div>
      )}

      <button onClick={handleSubmit} style={estilos.btnContinuar}>
        Continuar con el pago
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════

const estilos = {
  contenedor: {
    background: '#141414',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #2a2a2a'
  },
  titulo: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    marginTop: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    color: '#888',
    fontSize: '13px'
  },
  input: {
    padding: '12px 14px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  inputError: {
    borderColor: '#f44336'
  },
  select: {
    padding: '12px 14px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer'
  },
  error: {
    color: '#f44336',
    fontSize: '12px'
  },
  cargando: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#888',
    padding: '16px 0'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #333',
    borderTopColor: '#C6A962',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  resultado: {
    marginTop: '16px',
    padding: '16px',
    background: '#0a0a0a',
    borderRadius: '8px',
    border: '1px solid #2a2a2a'
  },
  resultadoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  resultadoDepto: {
    color: '#fff',
    fontWeight: '600'
  },
  costoEnvio: {
    color: '#C6A962',
    fontSize: '20px',
    fontWeight: '700'
  },
  envioGratisBadge: {
    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  resultadoInfo: {
    display: 'flex',
    gap: '16px',
    marginBottom: '12px'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#888',
    fontSize: '14px'
  },
  infoIcono: {
    fontSize: '16px'
  },
  mensajeEnvio: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    background: 'rgba(198,169,98,0.1)',
    borderRadius: '6px',
    color: '#C6A962',
    fontSize: '13px',
    marginBottom: '12px'
  },
  mensajeIcono: {
    fontSize: '16px'
  },
  btnZonas: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '0',
    textDecoration: 'underline'
  },
  zonasLista: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '12px'
  },
  zonaBadge: {
    background: '#1f1f1f',
    color: '#aaa',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px'
  },
  notaPagoDestino: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #2a2a2a',
    color: '#666',
    fontSize: '12px'
  },
  infoEnvio: {
    textAlign: 'center',
    padding: '16px',
    color: '#888',
    fontSize: '14px'
  },
  envioGratisInfo: {
    color: '#4CAF50',
    marginTop: '4px'
  },

  // Compacto
  compacto: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  selectCompacto: {
    flex: 1,
    padding: '10px 12px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none'
  },
  resultadoCompacto: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    color: '#C6A962',
    fontWeight: '600'
  },
  envioGratis: {
    color: '#4CAF50',
    fontWeight: '600'
  },

  // Formulario direccion
  formDireccion: {
    background: '#141414',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #2a2a2a'
  },
  envioResumen: {
    marginTop: '20px',
    padding: '16px',
    background: '#0a0a0a',
    borderRadius: '8px',
    border: '1px solid #2a2a2a'
  },
  envioResumenHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff'
  },
  tiempoEnvio: {
    color: '#888',
    marginTop: '4px',
    display: 'block'
  },
  btnContinuar: {
    width: '100%',
    marginTop: '20px',
    padding: '14px',
    background: 'linear-gradient(135deg, #C6A962 0%, #D4BC7D 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0a',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  }
};

export default CalculadorEnvio;
