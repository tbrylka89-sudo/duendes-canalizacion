'use client';

import { useState } from 'react';

// Mismo diccionario de correcciones que el generador
const corregirOrtografia = (texto) => {
  if (!texto) return texto;

  const correcciones = {
    // Palabras pegadas con "el"
    'bloqueal ': 'bloquea el ',
    'paral ': 'para el ',
    'fueral ': 'fuera el ',
    'seral ': 'será el ',
    'eral ': 'era el ',
    'hayal ': 'haya el ',
    'tengal ': 'tenga el ',
    'puedal ': 'pueda el ',
    'veal ': 'vea el ',
    'seal ': 'sea el ',
    'cargal ': 'carga el ',
    'ganal ': 'gana el ',
    'tomal ': 'toma el ',
    'tienel ': 'tiene el ',
    'vienel ': 'viene el ',
    'importal ': 'importa ',
    'nadal ': 'nada ',
    'todal ': 'toda ',
    'cadal ': 'cada ',
    // Errores de palabras
    'investáste': 'inventaste',
    'investaste': 'inventaste',
    'herramiestás': 'herramientas',
    'herramiestas': 'herramientas',
    // Conjugaciones incorrectas
    'llegastes': 'llegaste',
    'vistes': 'viste',
    'hicistes': 'hiciste',
    'dijistes': 'dijiste',
    'pudistes': 'pudiste',
    'quisistes': 'quisiste',
    'fuistes': 'fuiste',
    'tuvistes': 'tuviste',
    // Tildes
    'entás': 'estás',
    'entas': 'estás',
    'ví': 'vi',
    'tí': 'ti',
    'fué': 'fue',
    'dió': 'dio',
    'vió': 'vio',
    // Ortografía general
    'vim': 'vine',
    'conciente': 'consciente',
    'travez': 'través',
    'atravez': 'a través',
    'poque': 'porque',
    'porqe': 'porque',
    'aveces': 'a veces',
    'enserio': 'en serio',
    'envez': 'en vez',
    'talvez': 'tal vez',
    'osea': 'o sea',
    'ósea': 'o sea',
    'nose ': 'no sé ',
    'nosé ': 'no sé ',
    ' q ': ' que ',
    'a el ': 'al ',
    'de el ': 'del ',
    // Específicos del proyecto
    'guradián': 'guardián',
    'guaridan': 'guardián',
    'pixe ': 'pixie ',
    'duened': 'duende',
    'duenede': 'duende'
  };

  let resultado = texto;
  Object.entries(correcciones).forEach(([mal, bien]) => {
    resultado = resultado.replace(new RegExp(mal, 'gi'), bien);
  });
  return resultado;
};

export default function CorregirProductosPage() {
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [descripcionOriginal, setDescripcionOriginal] = useState('');
  const [descripcionCorregida, setDescripcionCorregida] = useState('');
  const [corrigiendo, setCorrigiendo] = useState(false);

  // Buscar productos
  const buscarProductos = async () => {
    if (!busqueda.trim()) return;

    setCargando(true);
    setMensaje(null);

    try {
      const res = await fetch(`/api/woo/productos?search=${encodeURIComponent(busqueda)}`);
      const data = await res.json();

      if (data.productos) {
        setProductos(data.productos);
        if (data.productos.length === 0) {
          setMensaje({ tipo: 'info', texto: 'No se encontraron productos' });
        }
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    }

    setCargando(false);
  };

  // Seleccionar producto para ver/corregir
  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);

    // Convertir HTML a texto plano para mostrar
    const textoPlano = producto.descripcion
      ?.replace(/<[^>]*>/g, '\n')
      .replace(/\n\n+/g, '\n\n')
      .trim() || '';

    setDescripcionOriginal(producto.descripcion || '');
    setDescripcionCorregida(corregirOrtografia(producto.descripcion || ''));
  };

  // Guardar corrección
  const guardarCorreccion = async () => {
    if (!productoSeleccionado) return;

    setCorrigiendo(true);
    setMensaje(null);

    try {
      const res = await fetch('/api/admin/historias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: productoSeleccionado.id,
          historia: descripcionCorregida
            .replace(/<[^>]*>/g, '') // Quitar HTML
            .replace(/\n\n+/g, '\n\n') // Normalizar saltos
        })
      });

      const data = await res.json();

      if (data.success) {
        setMensaje({ tipo: 'success', texto: `Corregido: ${productoSeleccionado.nombre}` });
        setProductoSeleccionado(null);
        // Actualizar lista
        buscarProductos();
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    }

    setCorrigiendo(false);
  };

  // Detectar si hay diferencias
  const hayDiferencias = descripcionOriginal !== descripcionCorregida;

  return (
    <div className="corregir-page">
      <style jsx>{`
        .corregir-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          color: #fff;
        }
        h1 {
          margin-bottom: 0.5rem;
        }
        .subtitulo {
          color: #888;
          margin-bottom: 2rem;
        }
        .busqueda-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .busqueda-container input {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #444;
          background: #1a1a2e;
          color: #fff;
          font-size: 1rem;
        }
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-primary {
          background: #6366f1;
          color: white;
        }
        .btn-primary:hover {
          background: #4f46e5;
        }
        .btn-success {
          background: #10b981;
          color: white;
        }
        .btn-success:hover {
          background: #059669;
        }
        .btn-secondary {
          background: #374151;
          color: white;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .productos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .producto-card {
          background: #1a1a2e;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .producto-card:hover {
          border-color: #6366f1;
          transform: translateY(-2px);
        }
        .producto-card h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
        }
        .producto-card .preview {
          color: #888;
          font-size: 0.85rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .mensaje {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .mensaje.success {
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid #10b981;
        }
        .mensaje.error {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid #ef4444;
        }
        .mensaje.info {
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid #6366f1;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }
        .modal-content {
          background: #1a1a2e;
          border-radius: 16px;
          max-width: 900px;
          width: 100%;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .modal-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h2 {
          margin: 0;
        }
        .modal-header button {
          background: none;
          border: none;
          color: #888;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }
        .comparacion {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .comparacion-col h4 {
          margin: 0 0 0.5rem 0;
          color: #888;
        }
        .comparacion-col pre {
          background: #0d0d1a;
          padding: 1rem;
          border-radius: 8px;
          white-space: pre-wrap;
          font-size: 0.85rem;
          max-height: 400px;
          overflow-y: auto;
        }
        .sin-cambios {
          text-align: center;
          padding: 2rem;
          color: #10b981;
        }
        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #333;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
        .badge-cambios {
          background: #f59e0b;
          color: #000;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }
      `}</style>

      <h1>🔧 Corregir Ortografía en Productos</h1>
      <p className="subtitulo">Busca un producto de WooCommerce y corrige errores automáticamente</p>

      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="busqueda-container">
        <input
          type="text"
          placeholder="Buscar producto por nombre (ej: Leprechaun, Abraham, Edward...)"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && buscarProductos()}
        />
        <button
          className="btn btn-primary"
          onClick={buscarProductos}
          disabled={cargando}
        >
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      <div className="productos-grid">
        {productos.map(producto => (
          <div
            key={producto.id}
            className="producto-card"
            onClick={() => seleccionarProducto(producto)}
          >
            <h3>{producto.nombre}</h3>
            <p className="preview">
              {producto.descripcion?.replace(/<[^>]*>/g, '').substring(0, 150)}...
            </p>
          </div>
        ))}
      </div>

      {/* Modal de corrección */}
      {productoSeleccionado && (
        <div className="modal-overlay" onClick={() => setProductoSeleccionado(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {productoSeleccionado.nombre}
                {hayDiferencias && <span className="badge-cambios">Tiene errores</span>}
              </h2>
              <button onClick={() => setProductoSeleccionado(null)}>×</button>
            </div>

            <div className="modal-body">
              {hayDiferencias ? (
                <div className="comparacion">
                  <div className="comparacion-col">
                    <h4>Original (con errores)</h4>
                    <pre>{descripcionOriginal.replace(/<[^>]*>/g, '\n').replace(/\n\n+/g, '\n\n')}</pre>
                  </div>
                  <div className="comparacion-col">
                    <h4>Corregido</h4>
                    <pre>{descripcionCorregida.replace(/<[^>]*>/g, '\n').replace(/\n\n+/g, '\n\n')}</pre>
                  </div>
                </div>
              ) : (
                <div className="sin-cambios">
                  <p>Este producto no tiene errores de ortografía detectables.</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setProductoSeleccionado(null)}
              >
                Cancelar
              </button>
              {hayDiferencias && (
                <button
                  className="btn btn-success"
                  onClick={guardarCorreccion}
                  disabled={corrigiendo}
                >
                  {corrigiendo ? 'Guardando...' : '✓ Guardar corrección'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
