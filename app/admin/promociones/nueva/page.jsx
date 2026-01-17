'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PROMO_TEMPLATES, UBICACIONES, AUDIENCIAS, TIPOS_ACCION } from '@/lib/promo-templates';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: CREAR/EDITAR PROMOCIÓN
// Formulario completo con preview en vivo
// ═══════════════════════════════════════════════════════════════════════════════

function NuevaPromocionContent() {
  const searchParams = useSearchParams();
  const editarId = searchParams.get('editar');
  const tipoPreset = searchParams.get('tipo');

  // Estado del formulario
  const [promo, setPromo] = useState({
    tituloInterno: '',
    tituloBanner: '',
    subtitulo: '',
    descripcion: '',
    template: 'descuento',
    colores: { ...PROMO_TEMPLATES.descuento.colores },
    icono: '★',
    imagenFondo: null,
    efectos: { sparkles: true, gradiente: false, borde: false },
    ubicaciones: [],
    audiencia: 'todos',
    fechaInicio: '',
    fechaFin: '',
    activarInmediatamente: true,
    boton: { texto: 'DESCUBRIR AHORA', tipo: 'link', url: '' },
    emailAlActivar: false,
    emailAsunto: '',
    prioridad: 'media',
    permitirCerrar: true,
    cuentaRegresiva: false,
    estado: 'borrador'
  });

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [modoPreview, setModoPreview] = useState('normal');

  // Cargar promoción si estamos editando
  useEffect(() => {
    if (editarId) {
      cargarPromocion(editarId);
    }
    if (tipoPreset === 'relampago') {
      // Preset para promo relámpago 24h
      const mañana = new Date();
      mañana.setDate(mañana.getDate() + 1);
      setPromo(p => ({
        ...p,
        tituloInterno: 'Promo Relámpago 24h',
        tituloBanner: '⚡ SOLO 24 HORAS',
        subtitulo: 'Oferta que desaparece a medianoche',
        template: 'ultimaOportunidad',
        colores: { ...PROMO_TEMPLATES.ultimaOportunidad.colores },
        icono: '⚡',
        fechaFin: mañana.toISOString().split('T')[0],
        cuentaRegresiva: true,
        activarInmediatamente: true
      }));
    }
  }, [editarId, tipoPreset]);

  async function cargarPromocion(id) {
    try {
      const res = await fetch(`/api/admin/promociones/crud?id=${id}`);
      const data = await res.json();
      if (data.success && data.promocion) {
        setPromo(data.promocion);
      }
    } catch (err) {
      console.error('Error cargando promoción:', err);
    }
  }

  function actualizarPromo(campo, valor) {
    setPromo(p => ({ ...p, [campo]: valor }));
  }

  function seleccionarTemplate(templateId) {
    const template = PROMO_TEMPLATES[templateId];
    if (template) {
      setPromo(p => ({
        ...p,
        template: templateId,
        colores: { ...template.colores },
        icono: template.icono,
        efectos: { ...template.efectos }
      }));
    }
  }

  function toggleUbicacion(ubicacion) {
    setPromo(p => {
      const nuevas = p.ubicaciones.includes(ubicacion)
        ? p.ubicaciones.filter(u => u !== ubicacion)
        : [...p.ubicaciones, ubicacion];
      return { ...p, ubicaciones: nuevas };
    });
  }

  async function guardarPromocion(estado = 'borrador') {
    if (!promo.tituloInterno || !promo.tituloBanner) {
      setMensaje({ tipo: 'error', texto: 'Título interno y título del banner son requeridos' });
      return;
    }

    if (promo.ubicaciones.length === 0) {
      setMensaje({ tipo: 'error', texto: 'Seleccioná al menos una ubicación' });
      return;
    }

    setGuardando(true);
    try {
      const promocionFinal = {
        ...promo,
        estado
      };

      const res = await fetch('/api/admin/promociones/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: editarId ? 'actualizar' : 'crear',
          id: editarId,
          promocion: promocionFinal
        })
      });

      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'exito', texto: data.mensaje });
        if (!editarId) {
          // Redirigir al panel después de crear
          setTimeout(() => {
            window.location.href = '/admin/promociones';
          }, 1500);
        }
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error guardando promoción' });
    }
    setGuardando(false);
  }

  return (
    <div className="admin-nueva-promo">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <a href="/admin/promociones" className="back-link">← Promociones</a>
          <h1>{editarId ? 'Editar Promoción' : 'Nueva Promoción'}</h1>
        </div>
        <div className="header-actions">
          <button onClick={() => guardarPromocion('borrador')} disabled={guardando} className="btn-guardar">
            Guardar Borrador
          </button>
          <button onClick={() => guardarPromocion('activa')} disabled={guardando} className="btn-publicar">
            {guardando ? 'Guardando...' : 'Publicar Ahora'}
          </button>
        </div>
      </header>

      {/* Mensaje */}
      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
          <button onClick={() => setMensaje(null)}>×</button>
        </div>
      )}

      <main className="admin-main">
        <div className="form-grid">
          {/* Panel Izquierdo: Formulario */}
          <div className="panel-form">
            {/* Información Básica */}
            <section className="form-section">
              <h2>Información Básica</h2>

              <div className="form-group">
                <label>Título interno (solo admin)</label>
                <input
                  type="text"
                  value={promo.tituloInterno}
                  onChange={e => actualizarPromo('tituloInterno', e.target.value)}
                  placeholder="Ej: Navidad 2026 - Descuento general"
                />
              </div>

              <div className="form-group">
                <label>Título del banner</label>
                <input
                  type="text"
                  value={promo.tituloBanner}
                  onChange={e => actualizarPromo('tituloBanner', e.target.value)}
                  placeholder="Ej: ✨ NAVIDAD MÁGICA"
                />
              </div>

              <div className="form-group">
                <label>Subtítulo</label>
                <input
                  type="text"
                  value={promo.subtitulo}
                  onChange={e => actualizarPromo('subtitulo', e.target.value)}
                  placeholder="Ej: 20% de descuento en todos los guardianes"
                />
              </div>

              <div className="form-group">
                <label>Descripción (para emails)</label>
                <textarea
                  value={promo.descripcion}
                  onChange={e => actualizarPromo('descripcion', e.target.value)}
                  placeholder="Descripción más larga para emails..."
                  rows={3}
                />
              </div>
            </section>

            {/* Diseño */}
            <section className="form-section">
              <h2>Diseño del Banner</h2>

              <div className="form-group">
                <label>Template</label>
                <div className="templates-grid">
                  {Object.entries(PROMO_TEMPLATES).map(([id, template]) => (
                    <div
                      key={id}
                      className={`template-card ${promo.template === id ? 'active' : ''}`}
                      onClick={() => seleccionarTemplate(id)}
                    >
                      <span className="template-icono">{template.icono}</span>
                      <span className="template-nombre">{template.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Color fondo</label>
                  <input
                    type="color"
                    value={promo.colores.fondo?.startsWith('#') ? promo.colores.fondo : '#0a0a0a'}
                    onChange={e => actualizarPromo('colores', { ...promo.colores, fondo: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Color título</label>
                  <input
                    type="color"
                    value={promo.colores.textoTitulo || '#d4af37'}
                    onChange={e => actualizarPromo('colores', { ...promo.colores, textoTitulo: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Color botón</label>
                  <input
                    type="color"
                    value={promo.colores.botonFondo || '#d4af37'}
                    onChange={e => actualizarPromo('colores', { ...promo.colores, botonFondo: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Efectos</label>
                <div className="efectos-grid">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={promo.efectos.sparkles}
                      onChange={e => actualizarPromo('efectos', { ...promo.efectos, sparkles: e.target.checked })}
                    />
                    <span>Sparkles dorados</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={promo.efectos.gradiente}
                      onChange={e => actualizarPromo('efectos', { ...promo.efectos, gradiente: e.target.checked })}
                    />
                    <span>Gradiente sutil</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={promo.efectos.borde}
                      onChange={e => actualizarPromo('efectos', { ...promo.efectos, borde: e.target.checked })}
                    />
                    <span>Borde brillante</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Ubicaciones */}
            <section className="form-section">
              <h2>Ubicaciones</h2>
              <div className="ubicaciones-grid">
                {Object.entries(UBICACIONES).map(([id, ubi]) => (
                  <label key={id} className={`ubicacion-card ${promo.ubicaciones.includes(id) ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={promo.ubicaciones.includes(id)}
                      onChange={() => toggleUbicacion(id)}
                    />
                    <div className="ubi-info">
                      <span className="ubi-nombre">{ubi.nombre}</span>
                      <span className="ubi-desc">{ubi.descripcion}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Audiencia */}
            <section className="form-section">
              <h2>Audiencia</h2>
              <div className="audiencia-grid">
                {Object.entries(AUDIENCIAS).map(([id, aud]) => (
                  <label key={id} className={`audiencia-option ${promo.audiencia === id ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="audiencia"
                      checked={promo.audiencia === id}
                      onChange={() => actualizarPromo('audiencia', id)}
                    />
                    <div className="aud-info">
                      <span className="aud-nombre">{aud.nombre}</span>
                      <span className="aud-desc">{aud.descripcion}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Fechas */}
            <section className="form-section">
              <h2>Fechas y Horarios</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de inicio</label>
                  <input
                    type="date"
                    value={promo.fechaInicio}
                    onChange={e => actualizarPromo('fechaInicio', e.target.value)}
                    disabled={promo.activarInmediatamente}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de fin</label>
                  <input
                    type="date"
                    value={promo.fechaFin}
                    onChange={e => actualizarPromo('fechaFin', e.target.value)}
                  />
                </div>
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={promo.activarInmediatamente}
                  onChange={e => actualizarPromo('activarInmediatamente', e.target.checked)}
                />
                <span>Activar inmediatamente</span>
              </label>
            </section>

            {/* Botón */}
            <section className="form-section">
              <h2>Acción del Botón</h2>
              <div className="form-group">
                <label>Texto del botón</label>
                <input
                  type="text"
                  value={promo.boton.texto}
                  onChange={e => actualizarPromo('boton', { ...promo.boton, texto: e.target.value })}
                  placeholder="DESCUBRIR AHORA"
                />
              </div>
              <div className="form-group">
                <label>Destino</label>
                <select
                  value={promo.boton.tipo}
                  onChange={e => actualizarPromo('boton', { ...promo.boton, tipo: e.target.value })}
                >
                  {Object.entries(TIPOS_ACCION).map(([id, accion]) => (
                    <option key={id} value={id}>{accion.nombre}</option>
                  ))}
                </select>
              </div>
              {promo.boton.tipo === 'link' && (
                <div className="form-group">
                  <label>URL</label>
                  <input
                    type="url"
                    value={promo.boton.url || ''}
                    onChange={e => actualizarPromo('boton', { ...promo.boton, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              )}
              {promo.boton.tipo === 'cupon' && (
                <div className="form-group">
                  <label>Código de cupón</label>
                  <input
                    type="text"
                    value={promo.boton.codigoCupon || ''}
                    onChange={e => actualizarPromo('boton', { ...promo.boton, codigoCupon: e.target.value })}
                    placeholder="NAVIDAD20"
                  />
                </div>
              )}
            </section>

            {/* Opciones Avanzadas */}
            <section className="form-section">
              <h2>Opciones Avanzadas</h2>
              <div className="form-group">
                <label>Prioridad</label>
                <select
                  value={promo.prioridad}
                  onChange={e => actualizarPromo('prioridad', e.target.value)}
                >
                  <option value="alta">Alta (se muestra primero)</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
              <div className="opciones-avanzadas">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={promo.permitirCerrar}
                    onChange={e => actualizarPromo('permitirCerrar', e.target.checked)}
                  />
                  <span>Permitir cerrar/ocultar</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={promo.cuentaRegresiva}
                    onChange={e => actualizarPromo('cuentaRegresiva', e.target.checked)}
                  />
                  <span>Mostrar cuenta regresiva</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={promo.emailAlActivar}
                    onChange={e => actualizarPromo('emailAlActivar', e.target.checked)}
                  />
                  <span>Enviar email al activar</span>
                </label>
              </div>
              {promo.emailAlActivar && (
                <div className="form-group">
                  <label>Asunto del email</label>
                  <input
                    type="text"
                    value={promo.emailAsunto}
                    onChange={e => actualizarPromo('emailAsunto', e.target.value)}
                    placeholder="✨ ¡Llegó la Navidad Mágica!"
                  />
                </div>
              )}
            </section>
          </div>

          {/* Panel Derecho: Preview */}
          <div className="panel-preview">
            <div className="preview-header">
              <h2>Vista Previa</h2>
              <div className="preview-modes">
                {['header', 'normal', 'mini'].map(modo => (
                  <button
                    key={modo}
                    className={modoPreview === modo ? 'active' : ''}
                    onClick={() => setModoPreview(modo)}
                  >
                    {modo}
                  </button>
                ))}
              </div>
            </div>

            <div className="preview-container">
              <div
                className={`banner-preview ${modoPreview}`}
                style={{
                  background: promo.colores.fondo,
                  border: promo.efectos.borde ? `2px solid ${promo.colores.textoTitulo}` : 'none'
                }}
              >
                {promo.efectos.sparkles && <div className="sparkles"></div>}

                <div className="banner-content">
                  {promo.icono && <span className="banner-icono">{promo.icono}</span>}
                  <h3 style={{ color: promo.colores.textoTitulo }}>
                    {promo.tituloBanner || 'Título del Banner'}
                  </h3>
                  {modoPreview !== 'header' && (
                    <p style={{ color: promo.colores.textoSub }}>
                      {promo.subtitulo || 'Subtítulo de la promoción'}
                    </p>
                  )}
                  <button
                    className="banner-btn"
                    style={{
                      background: promo.colores.botonFondo,
                      color: promo.colores.botonTexto,
                      border: promo.colores.botonBorde ? `2px solid ${promo.colores.botonBorde}` : 'none'
                    }}
                  >
                    {promo.boton.texto || 'BOTÓN'}
                  </button>
                </div>

                {promo.permitirCerrar && <span className="banner-close">×</span>}
                {promo.cuentaRegresiva && promo.fechaFin && (
                  <div className="cuenta-regresiva">Termina en: 2d 5h 30m</div>
                )}
              </div>
            </div>

            <div className="preview-info">
              <h4>Resumen</h4>
              <ul>
                <li><strong>Template:</strong> {PROMO_TEMPLATES[promo.template]?.nombre || promo.template}</li>
                <li><strong>Ubicaciones:</strong> {promo.ubicaciones.length > 0 ? promo.ubicaciones.join(', ') : 'Ninguna'}</li>
                <li><strong>Audiencia:</strong> {AUDIENCIAS[promo.audiencia]?.nombre || promo.audiencia}</li>
                <li><strong>Prioridad:</strong> {promo.prioridad}</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .admin-nueva-promo {
          min-height: 100vh;
          background: #0f0f0f;
          color: #fff;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left { display: flex; align-items: center; gap: 20px; }
        .back-link { color: #888; text-decoration: none; }
        .back-link:hover { color: #d4af37; }

        .admin-header h1 {
          font-size: 24px;
          margin: 0;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-actions { display: flex; gap: 10px; }

        .btn-guardar {
          background: #333;
          border: none;
          color: #888;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-guardar:hover { background: #444; color: #fff; }

        .btn-publicar {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          border: none;
          color: #000;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-publicar:hover { transform: translateY(-2px); }

        .mensaje {
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
        }

        .mensaje.exito { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
        .mensaje.error { background: rgba(231, 76, 60, 0.1); color: #e74c3c; }

        .mensaje button { background: none; border: none; color: inherit; font-size: 20px; cursor: pointer; }

        .admin-main { padding: 30px; }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 30px;
        }

        .panel-form, .panel-preview {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 25px;
        }

        .panel-preview {
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .form-section {
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 1px solid #252525;
        }

        .form-section:last-child { border-bottom: none; }

        .form-section h2 {
          font-size: 16px;
          color: #d4af37;
          margin: 0 0 20px 0;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          font-size: 12px;
          color: #888;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .form-group input[type="text"],
        .form-group input[type="url"],
        .form-group input[type="date"],
        .form-group textarea,
        .form-group select {
          width: 100%;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 12px;
          color: #fff;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #d4af37;
        }

        .form-group input[type="color"] {
          width: 50px;
          height: 40px;
          padding: 0;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .form-row {
          display: flex;
          gap: 15px;
        }

        .form-row .form-group { flex: 1; }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 14px;
          color: #aaa;
          margin-bottom: 10px;
        }

        .checkbox-label input { width: 18px; height: 18px; accent-color: #d4af37; }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .template-card {
          background: #252525;
          border: 2px solid transparent;
          border-radius: 10px;
          padding: 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .template-card:hover { border-color: #444; }
        .template-card.active { border-color: #d4af37; background: rgba(212, 175, 55, 0.1); }

        .template-icono { display: block; font-size: 24px; margin-bottom: 8px; }
        .template-nombre { font-size: 12px; color: #888; }

        .ubicaciones-grid, .audiencia-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ubicacion-card, .audiencia-option {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          background: #252525;
          padding: 15px;
          border-radius: 10px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
        }

        .ubicacion-card:hover, .audiencia-option:hover { border-color: #444; }
        .ubicacion-card.active, .audiencia-option.active { border-color: #d4af37; }

        .ubicacion-card input, .audiencia-option input { margin-top: 3px; accent-color: #d4af37; }

        .ubi-info, .aud-info { display: flex; flex-direction: column; gap: 3px; }
        .ubi-nombre, .aud-nombre { font-weight: 500; color: #fff; }
        .ubi-desc, .aud-desc { font-size: 12px; color: #888; }

        .efectos-grid, .opciones-avanzadas {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* Preview */
        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .preview-header h2 {
          font-size: 16px;
          color: #d4af37;
          margin: 0;
        }

        .preview-modes { display: flex; gap: 5px; }

        .preview-modes button {
          background: #252525;
          border: none;
          color: #888;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
        }

        .preview-modes button.active { background: #d4af37; color: #000; }

        .preview-container {
          background: #0a0a0a;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .banner-preview {
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
        }

        .banner-preview.header {
          padding: 15px 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          border-radius: 0;
        }

        .banner-preview.mini {
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .banner-content {
          position: relative;
          z-index: 1;
        }

        .banner-icono {
          font-size: 32px;
          display: block;
          margin-bottom: 10px;
        }

        .banner-preview.header .banner-icono,
        .banner-preview.mini .banner-icono {
          font-size: 20px;
          margin: 0;
        }

        .banner-preview h3 {
          font-size: 24px;
          font-family: 'Cinzel', serif;
          margin: 0 0 10px 0;
        }

        .banner-preview.header h3 { font-size: 16px; margin: 0; }
        .banner-preview.mini h3 { font-size: 14px; margin: 0; }

        .banner-preview p {
          font-size: 14px;
          margin: 0 0 20px 0;
        }

        .banner-preview.mini p { font-size: 12px; margin: 0; }

        .banner-btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }

        .banner-preview.header .banner-btn { padding: 8px 16px; font-size: 12px; }
        .banner-preview.mini .banner-btn { padding: 6px 12px; font-size: 11px; }

        .banner-close {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          color: rgba(255,255,255,0.5);
        }

        .cuenta-regresiva {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.5);
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 12px;
          color: #fff;
        }

        .sparkles {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.3) 0%, transparent 30%),
                      radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.2) 0%, transparent 25%);
          pointer-events: none;
        }

        .preview-info {
          background: #252525;
          border-radius: 10px;
          padding: 15px;
        }

        .preview-info h4 {
          font-size: 14px;
          color: #888;
          margin: 0 0 10px 0;
        }

        .preview-info ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .preview-info li {
          font-size: 13px;
          color: #666;
          margin-bottom: 5px;
        }

        .preview-info li strong { color: #aaa; }

        @media (max-width: 1200px) {
          .form-grid { grid-template-columns: 1fr; }
          .panel-preview { position: static; }
        }

        @media (max-width: 768px) {
          .templates-grid { grid-template-columns: repeat(2, 1fr); }
          .form-row { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}

// Loading fallback para Suspense
function LoadingFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#d4af37',
      fontFamily: 'Inter, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>✨</div>
        <div>Cargando editor de promociones...</div>
      </div>
    </div>
  );
}

// Export default con Suspense boundary
export default function NuevaPromocion() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NuevaPromocionContent />
    </Suspense>
  );
}
