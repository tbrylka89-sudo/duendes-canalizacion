'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// EXPLORADOR DE REPLICATE - Todos los modelos con todas las opciones
// ═══════════════════════════════════════════════════════════════════════════════

export default function ReplicateExplorer({ onImagenGenerada }) {
  const [categorias, setCategorias] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('gemini');
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const [params, setParams] = useState({});
  const [imagenRef, setImagenRef] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [historial, setHistorial] = useState([]);
  const [mostrarRefinamiento, setMostrarRefinamiento] = useState(false);
  const [instruccionRefinamiento, setInstruccionRefinamiento] = useState('');

  // Cargar modelos
  useEffect(() => {
    cargarModelos();
  }, [categoriaActiva]);

  async function cargarModelos() {
    try {
      const res = await fetch(`/api/admin/imagen/replicate-explore?categoria=${categoriaActiva}`);
      const data = await res.json();
      if (data.success) {
        setCategorias(data.categorias);
        setModelos(data.modelos);
        if (data.modelos.length > 0 && !modeloSeleccionado) {
          seleccionarModelo(data.modelos[0]);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function seleccionarModelo(modelo) {
    setModeloSeleccionado(modelo);
    // Inicializar params con valores default
    const defaultParams = {};
    Object.entries(modelo.params || {}).forEach(([key, config]) => {
      if (config.default !== undefined) {
        defaultParams[key] = config.default;
      }
    });
    setParams(defaultParams);
    setResultado(null);
  }

  function handleParamChange(key, value) {
    setParams(prev => ({ ...prev, [key]: value }));
  }

  function handleImageUpload(e, paramKey) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (paramKey === 'reference') {
          setImagenRef(event.target.result);
        } else {
          setParams(prev => ({ ...prev, [paramKey]: event.target.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async function generar() {
    if (!modeloSeleccionado) return;

    setGenerando(true);
    setError('');
    setResultado(null);

    try {
      // Preparar parámetros finales
      const finalParams = { ...params };

      // Agregar imagen de referencia si existe y el modelo la acepta
      if (imagenRef) {
        const imageParamKey = Object.keys(modeloSeleccionado.params || {})
          .find(k => modeloSeleccionado.params[k].type === 'image');
        if (imageParamKey) {
          finalParams[imageParamKey] = imagenRef;
        }
      }

      let data;

      // Si es modelo Gemini, usar API de Gemini
      if (modeloSeleccionado.isGemini) {
        const res = await fetch('/api/admin/imagen/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: finalParams.prompt,
            imagenBase64: finalParams.image || imagenRef || null,
            modo: (finalParams.image || imagenRef) ? 'imagen_a_imagen' : 'texto_a_imagen'
          })
        });
        const geminiData = await res.json();

        if (geminiData.success) {
          data = {
            success: true,
            url: geminiData.imagen.url,
            modelo: 'Nano Banana Pro (Gemini 2.0)',
            tiempo: 0,
            type: 'image'
          };
        } else {
          data = { success: false, error: geminiData.error };
        }
      } else {
        // Usar Replicate para otros modelos
        const res = await fetch('/api/admin/imagen/replicate-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            modelId: modeloSeleccionado.id,
            params: finalParams
          })
        });
        data = await res.json();
      }

      if (data.success) {
        setResultado(data);
        setHistorial(prev => [data, ...prev].slice(0, 20));
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerando(false);
    }
  }

  function descargarImagen() {
    if (!resultado?.url) return;

    const link = document.createElement('a');
    link.href = resultado.url;
    link.download = `replicate-${Date.now()}.${resultado.format || 'png'}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function usarEnContenido() {
    if (resultado?.url && onImagenGenerada) {
      onImagenGenerada(resultado.url);
    }
  }

  // Refinar imagen con instrucciones
  async function refinarImagen(instruccion) {
    if (!resultado?.url || !params.prompt) return;

    // Construir nuevo prompt con la instrucción de refinamiento
    const promptOriginal = params.prompt;
    const nuevoPrompt = `${promptOriginal}. IMPORTANT MODIFICATION: ${instruccion}`;

    setParams(prev => ({ ...prev, prompt: nuevoPrompt }));
    setInstruccionRefinamiento('');
    setMostrarRefinamiento(false);

    // Regenerar con el nuevo prompt
    await generar();
  }

  // Opciones rápidas de refinamiento
  const opcionesRefinamiento = [
    { label: '🎨 Colores más suaves', instruccion: 'Use softer, more muted colors. Reduce saturation and redness in skin tones.' },
    { label: '✨ Más mágico', instruccion: 'Add more magical elements: sparkles, glowing particles, ethereal light rays.' },
    { label: '🌙 Más místico', instruccion: 'Make it more mystical and mysterious. Add fog, moonlight, or starlight.' },
    { label: '☀️ Más luminoso', instruccion: 'Brighter lighting, more warmth, golden hour feel.' },
    { label: '🌿 Más natural', instruccion: 'More natural forest elements, leaves, moss, organic textures.' },
    { label: '😊 Cara natural', instruccion: 'Make facial features more natural with healthy skin tone. Remove any redness or unnatural coloring from the face.' },
    { label: '🔮 Más detalle', instruccion: 'Add more intricate details and textures throughout the image.' },
    { label: '💫 Menos saturado', instruccion: 'Reduce color saturation for a more subtle, elegant look.' },
  ];

  const categoriasNombres = {
    gemini: '🍌 Nano Banana Pro',
    text_to_image_quality: '✨ Alta Calidad',
    text_to_image_fast: '⚡ Rápidos',
    text_to_image_photo: '📷 Fotorrealistas',
    text_to_image_art: '🎨 Artísticos',
    image_to_image: '🔄 Img2Img',
    upscale: '🔍 Upscale',
    video: '🎬 Videos'
  };

  return (
    <div className="replicate-explorer">
      {/* Categorías */}
      <div className="re-categorias">
        {categorias.map(cat => (
          <button
            key={cat}
            className={`re-cat-btn ${categoriaActiva === cat ? 'active' : ''}`}
            onClick={() => { setCategoriaActiva(cat); setModeloSeleccionado(null); }}
          >
            {categoriasNombres[cat] || cat}
          </button>
        ))}
      </div>

      <div className="re-content">
        {/* Lista de modelos */}
        <div className="re-modelos-lista">
          {modelos.map(m => (
            <div
              key={m.id}
              className={`re-modelo-card ${modeloSeleccionado?.id === m.id ? 'active' : ''}`}
              onClick={() => seleccionarModelo(m)}
            >
              <div className="re-modelo-nombre">{m.nombre}</div>
              <div className="re-modelo-desc">{m.descripcion}</div>
              <div className="re-modelo-precio">{m.precio}</div>
            </div>
          ))}
        </div>

        {/* Panel de configuración */}
        <div className="re-config-panel">
          {modeloSeleccionado ? (
            <>
              <h3>{modeloSeleccionado.nombre}</h3>
              <p className="re-modelo-id">{modeloSeleccionado.id}</p>

              <div className="re-params">
                {Object.entries(modeloSeleccionado.params || {}).map(([key, config]) => (
                  <div key={key} className="re-param">
                    <label>{key.replace(/_/g, ' ')}</label>

                    {config.type === 'text' && (
                      <textarea
                        value={params[key] || ''}
                        onChange={e => handleParamChange(key, e.target.value)}
                        placeholder={config.prefix || `Escribí el ${key}...`}
                        rows={key === 'prompt' ? 4 : 2}
                      />
                    )}

                    {config.type === 'select' && (
                      <select
                        value={params[key] || config.default}
                        onChange={e => handleParamChange(key, e.target.value)}
                      >
                        {config.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {config.type === 'range' && (
                      <div className="re-range-container">
                        <input
                          type="range"
                          min={config.min}
                          max={config.max}
                          step={config.step || 1}
                          value={params[key] || config.default}
                          onChange={e => handleParamChange(key, parseFloat(e.target.value))}
                        />
                        <span className="re-range-value">{params[key] || config.default}</span>
                      </div>
                    )}

                    {config.type === 'boolean' && (
                      <label className="re-checkbox">
                        <input
                          type="checkbox"
                          checked={params[key] || false}
                          onChange={e => handleParamChange(key, e.target.checked)}
                        />
                        {key}
                      </label>
                    )}

                    {config.type === 'image' && (
                      <div className="re-image-upload">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageUpload(e, key)}
                        />
                        {params[key] && (
                          <img src={params[key]} alt="Preview" className="re-image-preview" />
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Imagen de referencia general */}
                <div className="re-param">
                  <label>📷 Imagen de referencia (opcional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'reference')}
                  />
                  {imagenRef && (
                    <div className="re-ref-preview">
                      <img src={imagenRef} alt="Referencia" />
                      <button onClick={() => setImagenRef(null)}>✕</button>
                    </div>
                  )}
                </div>
              </div>

              <button
                className="re-btn-generar"
                onClick={generar}
                disabled={generando}
              >
                {generando ? '⏳ Generando...' : '🚀 Generar'}
              </button>

              {error && <div className="re-error">{error}</div>}
            </>
          ) : (
            <div className="re-placeholder">
              Seleccioná un modelo de la lista
            </div>
          )}
        </div>

        {/* Panel de resultado */}
        <div className="re-resultado-panel">
          {resultado ? (
            <div className="re-resultado">
              {resultado.type === 'video' ? (
                <video src={resultado.url} controls autoPlay loop className="re-video" />
              ) : (
                <img src={resultado.url} alt="Generado" className="re-imagen" />
              )}

              <div className="re-resultado-info">
                <span>Modelo: {resultado.modelo}</span>
                <span>Tiempo: {resultado.tiempo}s</span>
              </div>

              <div className="re-resultado-acciones">
                <button onClick={descargarImagen} className="re-btn-descargar">
                  💾 Descargar
                </button>
                <a href={resultado.url} target="_blank" rel="noopener noreferrer" className="re-btn-abrir">
                  🔗 Abrir
                </a>
                {onImagenGenerada && (
                  <button onClick={usarEnContenido} className="re-btn-usar">
                    ✅ Usar en contenido
                  </button>
                )}
                <button
                  onClick={() => setMostrarRefinamiento(!mostrarRefinamiento)}
                  className="re-btn-refinar"
                >
                  🔧 {mostrarRefinamiento ? 'Ocultar opciones' : 'Refinar imagen'}
                </button>
              </div>

              {/* Panel de refinamiento */}
              {mostrarRefinamiento && (
                <div className="re-refinamiento-panel">
                  <h4>🔧 Refinar imagen</h4>
                  <p className="re-refinamiento-desc">Seleccioná una opción rápida o escribí tu instrucción:</p>

                  <div className="re-opciones-rapidas">
                    {opcionesRefinamiento.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => refinarImagen(opt.instruccion)}
                        disabled={generando}
                        className="re-opcion-btn"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div className="re-instruccion-custom">
                    <textarea
                      value={instruccionRefinamiento}
                      onChange={e => setInstruccionRefinamiento(e.target.value)}
                      placeholder="Ej: Que el duende tenga la cara con color natural, menos roja. Agregá más hongos brillantes..."
                      rows={3}
                    />
                    <button
                      onClick={() => refinarImagen(instruccionRefinamiento)}
                      disabled={generando || !instruccionRefinamiento.trim()}
                      className="re-btn-aplicar"
                    >
                      {generando ? '⏳ Regenerando...' : '🔄 Aplicar cambios y regenerar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="re-placeholder">
              {generando ? (
                <div className="re-loading">
                  <span>⏳</span>
                  <p>Generando con {modeloSeleccionado?.nombre}...</p>
                </div>
              ) : (
                <>
                  <span>🖼️</span>
                  <p>El resultado aparecerá aquí</p>
                </>
              )}
            </div>
          )}

          {/* Historial */}
          {historial.length > 0 && (
            <div className="re-historial">
              <h4>Historial</h4>
              <div className="re-historial-grid">
                {historial.map((item, i) => (
                  <div key={i} className="re-historial-item" onClick={() => setResultado(item)}>
                    {item.type === 'video' ? (
                      <video src={item.url} muted />
                    ) : (
                      <img src={item.url} alt={`Gen ${i}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
