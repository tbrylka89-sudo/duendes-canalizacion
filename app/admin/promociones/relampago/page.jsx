'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: PROMO RELÁMPAGO
// Crear promoción de 24h con 1 click
// ═══════════════════════════════════════════════════════════════════════════════

const TIPOS_PROMO = [
  { id: 'descuento10', nombre: '-10%', icono: '★', cupon: 'RELAMPAGO10', color: '#d4af37' },
  { id: 'descuento15', nombre: '-15%', icono: '★', cupon: 'RELAMPAGO15', color: '#d4af37' },
  { id: 'descuento20', nombre: '-20%', icono: '★', cupon: 'RELAMPAGO20', color: '#e74c3c' },
  { id: 'descuento25', nombre: '-25%', icono: '⚡', cupon: 'RELAMPAGO25', color: '#e74c3c' },
  { id: 'enviogratis', nombre: 'Envío Gratis', icono: '📦', cupon: 'ENVIOGRATIS', color: '#3498db' },
  { id: 'regalo', nombre: 'Regalo Sorpresa', icono: '🎁', cupon: 'REGALOSORPRESA', color: '#9b59b6' }
];

const DURACIONES = [
  { horas: 24, nombre: '24 horas' },
  { horas: 48, nombre: '48 horas' },
  { horas: 72, nombre: '72 horas' }
];

export default function PromoRelampago() {
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [duracion, setDuracion] = useState(24);
  const [enviarEmail, setEnviarEmail] = useState(true);
  const [mostrarTodos, setMostrarTodos] = useState(true);
  const [cuentaRegresiva, setCuentaRegresiva] = useState(true);
  const [creando, setCreando] = useState(false);
  const [resultado, setResultado] = useState(null);

  async function crearPromoRelampago() {
    if (!tipoSeleccionado) return;

    const tipo = TIPOS_PROMO.find(t => t.id === tipoSeleccionado);
    if (!tipo) return;

    setCreando(true);
    setResultado(null);

    try {
      const fechaFin = new Date();
      fechaFin.setHours(fechaFin.getHours() + duracion);

      const promocion = {
        tituloInterno: `Relámpago ${tipo.nombre} - ${new Date().toLocaleDateString()}`,
        tituloBanner: `⚡ ${tipo.nombre} - SOLO ${duracion}H`,
        subtitulo: 'Oferta que desaparece pronto',
        descripcion: `Aprovecha ${tipo.nombre} en toda la tienda. Usa el cupón ${tipo.cupon} antes de que termine.`,
        template: 'ultimaOportunidad',
        colores: {
          fondo: '#8b0000',
          textoTitulo: '#ffffff',
          textoSub: '#ffcccb',
          botonFondo: '#ffffff',
          botonTexto: '#8b0000'
        },
        icono: tipo.icono,
        efectos: { sparkles: false, gradiente: false, borde: false },
        ubicaciones: mostrarTodos ? ['header', 'mi-magia-promos', 'mi-magia-popup'] : ['mi-magia-promos'],
        audiencia: 'todos',
        fechaInicio: new Date().toISOString(),
        fechaFin: fechaFin.toISOString(),
        boton: {
          texto: 'APROVECHAR AHORA',
          tipo: 'cupon',
          codigoCupon: tipo.cupon
        },
        cuentaRegresiva,
        prioridad: 'alta',
        permitirCerrar: false,
        estado: 'activa'
      };

      const res = await fetch('/api/admin/promociones/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'crear',
          promocion
        })
      });

      const data = await res.json();

      if (data.success) {
        // Si enviar email está activo, enviar notificación
        if (enviarEmail) {
          await fetch('/api/admin/notificaciones/enviar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tipo: 'promo-relampago',
              asunto: `⚡ ${tipo.nombre} - ¡Solo ${duracion} horas!`,
              contenido: promocion.descripcion,
              cupon: tipo.cupon
            })
          }).catch(() => {}); // Ignorar errores de email
        }

        setResultado({
          tipo: 'exito',
          mensaje: '¡Promo relámpago creada y activa!',
          promo: data.promocion
        });
      } else {
        setResultado({ tipo: 'error', mensaje: data.error });
      }
    } catch (e) {
      setResultado({ tipo: 'error', mensaje: 'Error creando promoción' });
    }

    setCreando(false);
  }

  return (
    <div className="relampago-page">
      <header className="relampago-header">
        <a href="/admin/promociones" className="back-link">← Promociones</a>
        <h1>⚡ Promo Relámpago</h1>
        <p>Crea una promoción urgente en segundos</p>
      </header>

      <main className="relampago-main">
        {resultado ? (
          <div className={`resultado ${resultado.tipo}`}>
            {resultado.tipo === 'exito' ? (
              <>
                <span className="resultado-icono">✓</span>
                <h2>{resultado.mensaje}</h2>
                <p>Cupón: <strong>{TIPOS_PROMO.find(t => t.id === tipoSeleccionado)?.cupon}</strong></p>
                <p>Termina en: {duracion} horas</p>
                <div className="resultado-actions">
                  <a href="/admin/promociones" className="btn-ver">Ver promociones</a>
                  <button onClick={() => { setResultado(null); setTipoSeleccionado(null); }} className="btn-otra">
                    Crear otra
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="resultado-icono error">✗</span>
                <h2>Error</h2>
                <p>{resultado.mensaje}</p>
                <button onClick={() => setResultado(null)} className="btn-otra">Reintentar</button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Paso 1: Tipo de promo */}
            <section className="paso">
              <h2>1. Selecciona el tipo</h2>
              <div className="tipos-grid">
                {TIPOS_PROMO.map(tipo => (
                  <button
                    key={tipo.id}
                    className={`tipo-btn ${tipoSeleccionado === tipo.id ? 'activo' : ''}`}
                    onClick={() => setTipoSeleccionado(tipo.id)}
                    style={{ '--tipo-color': tipo.color }}
                  >
                    <span className="tipo-icono">{tipo.icono}</span>
                    <span className="tipo-nombre">{tipo.nombre}</span>
                    <span className="tipo-cupon">{tipo.cupon}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Paso 2: Duración */}
            <section className="paso">
              <h2>2. Duración</h2>
              <div className="duraciones">
                {DURACIONES.map(d => (
                  <button
                    key={d.horas}
                    className={`duracion-btn ${duracion === d.horas ? 'activo' : ''}`}
                    onClick={() => setDuracion(d.horas)}
                  >
                    {d.nombre}
                  </button>
                ))}
              </div>
            </section>

            {/* Paso 3: Opciones */}
            <section className="paso">
              <h2>3. Opciones</h2>
              <div className="opciones">
                <label className="opcion">
                  <input
                    type="checkbox"
                    checked={enviarEmail}
                    onChange={e => setEnviarEmail(e.target.checked)}
                  />
                  <span>Enviar email a todos los usuarios</span>
                </label>
                <label className="opcion">
                  <input
                    type="checkbox"
                    checked={mostrarTodos}
                    onChange={e => setMostrarTodos(e.target.checked)}
                  />
                  <span>Mostrar en todas las ubicaciones (header + Mi Magia + popup)</span>
                </label>
                <label className="opcion">
                  <input
                    type="checkbox"
                    checked={cuentaRegresiva}
                    onChange={e => setCuentaRegresiva(e.target.checked)}
                  />
                  <span>Mostrar cuenta regresiva</span>
                </label>
              </div>
            </section>

            {/* Preview */}
            {tipoSeleccionado && (
              <section className="preview-section">
                <h2>Vista previa</h2>
                <div className="preview-banner">
                  <span className="preview-icono">{TIPOS_PROMO.find(t => t.id === tipoSeleccionado)?.icono}</span>
                  <div className="preview-content">
                    <h3>⚡ {TIPOS_PROMO.find(t => t.id === tipoSeleccionado)?.nombre} - SOLO {duracion}H</h3>
                    <p>Oferta que desaparece pronto</p>
                  </div>
                  <button className="preview-btn">APROVECHAR AHORA</button>
                  {cuentaRegresiva && <span className="preview-countdown">Termina en: {duracion}h 00m</span>}
                </div>
              </section>
            )}

            {/* Botón crear */}
            <button
              className="btn-crear"
              onClick={crearPromoRelampago}
              disabled={!tipoSeleccionado || creando}
            >
              {creando ? 'Creando...' : '⚡ ACTIVAR PROMO RELÁMPAGO'}
            </button>
          </>
        )}
      </main>

      <style jsx>{`
        .relampago-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #1a0000 0%, #0f0f0f 100%);
          color: #fff;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .relampago-header {
          text-align: center;
          padding: 40px 30px;
          background: linear-gradient(135deg, #8b0000 0%, #5a0000 100%);
        }

        .back-link {
          position: absolute;
          left: 30px;
          top: 40px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
        }

        .relampago-header h1 {
          font-size: 2.5rem;
          margin: 0;
          color: #fff;
        }

        .relampago-header p { color: rgba(255,255,255,0.8); margin: 0.5rem 0 0; }

        .relampago-main { padding: 40px; max-width: 800px; margin: 0 auto; }

        .paso { margin-bottom: 40px; }
        .paso h2 { font-size: 1.2rem; color: #888; margin: 0 0 20px; }

        .tipos-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .tipo-btn {
          background: #1a1a1a;
          border: 2px solid #333;
          border-radius: 12px;
          padding: 25px 15px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .tipo-btn:hover { border-color: var(--tipo-color); }
        .tipo-btn.activo { border-color: var(--tipo-color); background: rgba(139, 0, 0, 0.2); }

        .tipo-icono { font-size: 2rem; }
        .tipo-nombre { font-size: 1.2rem; font-weight: 700; color: #fff; }
        .tipo-cupon { font-size: 0.8rem; color: #888; font-family: monospace; }

        .duraciones { display: flex; gap: 15px; }

        .duracion-btn {
          flex: 1;
          padding: 15px;
          background: #1a1a1a;
          border: 2px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .duracion-btn:hover { border-color: #666; }
        .duracion-btn.activo { border-color: #e74c3c; background: rgba(231, 76, 60, 0.2); }

        .opciones { display: flex; flex-direction: column; gap: 15px; }

        .opcion {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .opcion input {
          width: 20px;
          height: 20px;
          accent-color: #e74c3c;
        }

        .opcion span { color: #ccc; }

        .preview-section {
          background: #0a0a0a;
          border-radius: 16px;
          padding: 25px;
          margin-bottom: 30px;
        }

        .preview-banner {
          background: #8b0000;
          border-radius: 12px;
          padding: 25px;
          text-align: center;
          position: relative;
        }

        .preview-icono { font-size: 2rem; display: block; margin-bottom: 10px; }
        .preview-content h3 { margin: 0; font-size: 1.3rem; }
        .preview-content p { margin: 5px 0 15px; color: rgba(255,255,255,0.8); }

        .preview-btn {
          background: #fff;
          color: #8b0000;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-weight: 700;
          cursor: default;
        }

        .preview-countdown {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.5);
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.85rem;
        }

        .btn-crear {
          width: 100%;
          padding: 20px;
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 1.3rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-crear:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(231, 76, 60, 0.3); }
        .btn-crear:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* Resultado */
        .resultado {
          text-align: center;
          padding: 60px 40px;
          background: #1a1a1a;
          border-radius: 20px;
        }

        .resultado-icono {
          font-size: 4rem;
          display: block;
          margin-bottom: 20px;
          color: #27ae60;
        }

        .resultado-icono.error { color: #e74c3c; }

        .resultado h2 { margin: 0 0 15px; }
        .resultado p { color: #888; margin: 5px 0; }
        .resultado strong { color: #d4af37; }

        .resultado-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }

        .btn-ver, .btn-otra {
          padding: 12px 30px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
        }

        .btn-ver { background: #d4af37; color: #000; border: none; }
        .btn-otra { background: transparent; border: 2px solid #666; color: #fff; }

        @media (max-width: 768px) {
          .tipos-grid { grid-template-columns: repeat(2, 1fr); }
          .duraciones { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
