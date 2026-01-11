'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// COLORES Y ESTILOS
// ═══════════════════════════════════════════════════════════════
const C = {
  gold: '#C6A962',
  goldDark: '#A68B4B',
  bg: '#0a0a0a',
  bgCard: '#111111',
  bgHover: '#1a1a1a',
  border: '#222',
  text: '#fff',
  textMuted: '#888',
  textDim: '#555',
  success: '#22c55e',
  error: '#ef4444',
  purple: '#8b5cf6',
  blue: '#3b82f6',
  cyan: '#06b6d4',
  pink: '#ec4899',
  orange: '#f97316',
};

const GLASS = {
  background: 'rgba(17,17,17,0.85)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

// ═══════════════════════════════════════════════════════════════
// TIPOS DE CONTENIDO QUE PUEDE CREAR EL GUARDIAN
// ═══════════════════════════════════════════════════════════════
const TIPOS_CONTENIDO = [
  { id: 'meditacion', nombre: 'Meditación Guiada', icono: '🧘', desc: 'El guardián guía una meditación profunda', color: C.purple },
  { id: 'ritual', nombre: 'Ritual Mágico', icono: '🕯️', desc: 'Enseña un ritual desde su sabiduría', color: C.orange },
  { id: 'leccion', nombre: 'Lección Ancestral', icono: '📜', desc: 'Comparte conocimiento antiguo', color: C.blue },
  { id: 'mensaje', nombre: 'Mensaje Personal', icono: '💌', desc: 'Mensaje canalizado directo', color: C.pink },
  { id: 'cuento', nombre: 'Cuento del Bosque', icono: '🌲', desc: 'Narra una historia mágica', color: C.success },
  { id: 'sanacion', nombre: 'Sesión de Sanación', icono: '💚', desc: 'Guía una sanación energética', color: C.cyan },
];

// ═══════════════════════════════════════════════════════════════
// ELEMENTOS Y SUS CARACTERÍSTICAS
// ═══════════════════════════════════════════════════════════════
const ELEMENTOS = {
  tierra: { color: '#8B7355', icono: '🌍', voz: 'anciano', cualidades: 'estabilidad, abundancia, raíces' },
  agua: { color: '#4A90A4', icono: '🌊', voz: 'hada', cualidades: 'intuición, emociones, fluir' },
  fuego: { color: '#D4663A', icono: '🔥', voz: 'hechicero', cualidades: 'transformación, pasión, acción' },
  aire: { color: '#87CEEB', icono: '🌬️', voz: 'druida', cualidades: 'comunicación, ideas, libertad' },
  eter: { color: '#9B59B6', icono: '✨', voz: 'merlin', cualidades: 'espiritualidad, conexión, magia' },
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function PersonajesPage() {
  // Estados
  const [paso, setPaso] = useState(1);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardianSeleccionado, setGuardianSeleccionado] = useState(null);
  const [tipoContenido, setTipoContenido] = useState(null);
  const [tema, setTema] = useState('');
  const [instrucciones, setInstrucciones] = useState('');
  const [contenidoGenerado, setContenidoGenerado] = useState('');
  const [tituloGenerado, setTituloGenerado] = useState('');
  const [audioGenerado, setAudioGenerado] = useState(null);
  const [imagenGenerada, setImagenGenerada] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [generandoAudio, setGenerandoAudio] = useState(false);
  const [generandoImagen, setGenerandoImagen] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [vozSeleccionada, setVozSeleccionada] = useState('auto');
  const [conIntro, setConIntro] = useState(true);

  // Cargar productos/guardianes
  useEffect(() => {
    cargarGuardianes();
  }, []);

  const cargarGuardianes = async () => {
    try {
      const res = await fetch('/api/admin/productos');
      const data = await res.json();
      if (data.success) {
        // Filtrar solo productos que son guardianes
        const guardianes = data.productos.filter(p =>
          p.guardian || p.categoria?.toLowerCase().includes('guardian')
        );
        setProductos(guardianes);
      }
    } catch (e) {
      console.error('Error cargando guardianes:', e);
    }
    setCargando(false);
  };

  // Generar contenido
  const generarContenido = async () => {
    if (!guardianSeleccionado || !tipoContenido || !tema.trim()) {
      setError('Completá todos los campos');
      return;
    }

    setGenerando(true);
    setError('');

    try {
      const elemento = ELEMENTOS[guardianSeleccionado.elemento] || ELEMENTOS.eter;

      const prompt = `Sos ${guardianSeleccionado.guardian || guardianSeleccionado.nombre}, un guardián mágico del elemento ${guardianSeleccionado.elemento || 'eter'}.

TU IDENTIDAD:
- Nombre: ${guardianSeleccionado.guardian || guardianSeleccionado.nombre}
- Elemento: ${guardianSeleccionado.elemento || 'éter'} (${elemento.cualidades})
- Cristales que te acompañan: ${guardianSeleccionado.cristales?.join(', ') || 'cuarzo'}
- Tu propósito: ${guardianSeleccionado.proposito || 'guiar y proteger'}
- Tu historia: ${guardianSeleccionado.descripcion || 'Soy un guardián ancestral del bosque encantado'}

TIPO DE CONTENIDO: ${tipoContenido.nombre}
TEMA SOLICITADO: ${tema}
${instrucciones ? `INSTRUCCIONES ADICIONALES: ${instrucciones}` : ''}

FORMATO DE TU RESPUESTA:
1. Comenzá presentándote brevemente como el guardián que sos
2. Explicá por qué este tema te es significativo
3. Desarrollá el contenido (${tipoContenido.id === 'meditacion' ? 'guía la meditación paso a paso' :
   tipoContenido.id === 'ritual' ? 'explicá el ritual con materiales y pasos' :
   tipoContenido.id === 'cuento' ? 'narrá una historia mágica' :
   'compartí tu sabiduría'})
4. Cerrá con un mensaje personal y una bendición

ESTILO:
- Hablá en primera persona como el guardián
- Usá español rioplatense (vos, tenés, podés)
- Sé cálido pero místico
- Incluí referencias a tu elemento y cristales
- Que sea inmersivo y transformador`;

      const res = await fetch('/api/admin/contenido/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: prompt,
          palabras: tipoContenido.id === 'mensaje' ? 500 : 1200,
          categoria: guardianSeleccionado.elemento || 'esoterico',
          tipo: tipoContenido.id
        })
      });

      const data = await res.json();

      if (data.success) {
        setContenidoGenerado(data.contenido);
        setTituloGenerado(data.titulo || `${tipoContenido.nombre} con ${guardianSeleccionado.guardian}`);
        setPaso(3);
        setExito('¡Contenido canalizado exitosamente!');
        setTimeout(() => setExito(''), 3000);
      } else {
        setError(data.error || 'Error generando contenido');
      }
    } catch (e) {
      setError('Error de conexión: ' + e.message);
    }

    setGenerando(false);
  };

  // Generar audio
  const generarAudio = async () => {
    if (!contenidoGenerado) return;

    setGenerandoAudio(true);
    setError('');

    try {
      const elemento = ELEMENTOS[guardianSeleccionado?.elemento] || ELEMENTOS.eter;
      const voz = vozSeleccionada === 'auto' ? elemento.voz : vozSeleccionada;

      // Limpiar texto para audio
      const textoAudio = contenidoGenerado
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .substring(0, 5000);

      const res = await fetch('/api/admin/voz/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: textoAudio,
          voz: voz,
          tipo: tipoContenido?.id || 'narracion',
          conIntro: conIntro
        })
      });

      const data = await res.json();

      if (data.success) {
        setAudioGenerado(data.audio);
        setExito('¡Audio generado!');
        setTimeout(() => setExito(''), 3000);
      } else {
        setError(data.error || 'Error generando audio');
      }
    } catch (e) {
      setError('Error: ' + e.message);
    }

    setGenerandoAudio(false);
  };

  // Generar imagen
  const generarImagen = async () => {
    if (!guardianSeleccionado) return;

    setGenerandoImagen(true);
    setError('');

    try {
      const elemento = ELEMENTOS[guardianSeleccionado?.elemento] || ELEMENTOS.eter;

      const prompt = `Magical forest guardian named ${guardianSeleccionado.guardian}, ${guardianSeleccionado.elemento} element, mystical ${tipoContenido?.id || 'meditation'} scene, ethereal lighting, ${guardianSeleccionado.cristales?.join(' and ') || 'crystals'}, enchanted atmosphere, fantasy art style, warm golden tones`;

      const res = await fetch('/api/admin/imagen/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          estilo: 'duendes'
        })
      });

      const data = await res.json();

      if (data.success) {
        setImagenGenerada(data.imagen);
        setExito('¡Imagen generada!');
        setTimeout(() => setExito(''), 3000);
      } else {
        setError(data.error || 'Error generando imagen');
      }
    } catch (e) {
      setError('Error: ' + e.message);
    }

    setGenerandoImagen(false);
  };

  // Resetear
  const resetear = () => {
    setPaso(1);
    setGuardianSeleccionado(null);
    setTipoContenido(null);
    setTema('');
    setInstrucciones('');
    setContenidoGenerado('');
    setAudioGenerado(null);
    setImagenGenerada(null);
    setError('');
    setExito('');
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header épico */}
      <div style={{
        background: `linear-gradient(135deg, ${C.bgCard} 0%, #1a1520 100%)`,
        borderBottom: `1px solid ${C.border}`,
        padding: '32px 0',
        marginBottom: 32
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <span style={{ fontSize: 40 }}>🧙</span>
            <div>
              <h1 style={{
                color: C.gold,
                fontSize: 32,
                fontWeight: 700,
                margin: 0,
                textShadow: '0 0 30px rgba(198,169,98,0.3)'
              }}>
                Canalizador de Guardianes
              </h1>
              <p style={{ color: C.textMuted, margin: '4px 0 0', fontSize: 16 }}>
                Crea contenido mágico desde la perspectiva de tus guardianes
              </p>
            </div>
          </div>

          {/* Indicador de pasos */}
          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            {['Elegir Guardián', 'Configurar', 'Resultado'].map((label, i) => (
              <div key={i} style={{
                flex: 1,
                padding: '12px 16px',
                background: paso > i ? `${C.gold}22` : C.bgCard,
                border: `1px solid ${paso > i ? C.gold : C.border}`,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <span style={{
                  width: 24, height: 24,
                  borderRadius: '50%',
                  background: paso > i ? C.gold : C.border,
                  color: paso > i ? '#000' : C.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  {paso > i + 1 ? '✓' : i + 1}
                </span>
                <span style={{ color: paso > i ? C.gold : C.textMuted, fontSize: 13 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Mensajes */}
        {error && (
          <div style={{
            padding: 16,
            background: `${C.error}15`,
            border: `1px solid ${C.error}`,
            borderRadius: 12,
            color: C.error,
            marginBottom: 24
          }}>
            {error}
          </div>
        )}
        {exito && (
          <div style={{
            padding: 16,
            background: `${C.success}15`,
            border: `1px solid ${C.success}`,
            borderRadius: 12,
            color: C.success,
            marginBottom: 24
          }}>
            {exito}
          </div>
        )}

        {/* ═══ PASO 1: ELEGIR GUARDIAN ═══ */}
        {paso === 1 && (
          <div>
            <h2 style={{ color: C.text, fontSize: 20, marginBottom: 24 }}>
              ✨ Elegí el guardián que va a canalizar el contenido
            </h2>

            {cargando ? (
              <div style={{ textAlign: 'center', padding: 60, color: C.textMuted }}>
                <div style={{
                  width: 48, height: 48,
                  border: `3px solid ${C.border}`,
                  borderTopColor: C.gold,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px'
                }} />
                Invocando guardianes...
              </div>
            ) : productos.length === 0 ? (
              <div style={{
                ...GLASS,
                borderRadius: 16,
                padding: 60,
                textAlign: 'center'
              }}>
                <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🌲</span>
                <h3 style={{ color: C.text }}>No hay guardianes disponibles</h3>
                <p style={{ color: C.textMuted }}>
                  Sincronizá tus productos o agregá guardianes en la sección Productos
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 20
              }}>
                {productos.map((producto) => {
                  const elemento = ELEMENTOS[producto.elemento] || ELEMENTOS.eter;
                  const isSelected = guardianSeleccionado?.id === producto.id;

                  return (
                    <button
                      key={producto.id}
                      onClick={() => {
                        setGuardianSeleccionado(producto);
                        setPaso(2);
                      }}
                      style={{
                        ...GLASS,
                        padding: 0,
                        borderRadius: 16,
                        border: isSelected ? `2px solid ${C.gold}` : `1px solid ${C.border}`,
                        cursor: 'pointer',
                        textAlign: 'left',
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                      }}
                    >
                      {/* Imagen del guardian */}
                      <div style={{
                        height: 180,
                        background: producto.imagen
                          ? `url(${producto.imagen}) center/cover`
                          : `linear-gradient(135deg, ${elemento.color}44, ${C.bgCard})`,
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: '40px 16px 12px',
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.9))'
                        }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 10px',
                            background: `${elemento.color}44`,
                            borderRadius: 20,
                            fontSize: 12,
                            color: elemento.color
                          }}>
                            {elemento.icono} {producto.elemento || 'Éter'}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ padding: 16 }}>
                        <h3 style={{
                          color: C.text,
                          fontSize: 18,
                          margin: '0 0 4px',
                          fontWeight: 600
                        }}>
                          {producto.guardian || producto.nombre?.split(' - ')[0] || producto.nombre}
                        </h3>
                        <p style={{
                          color: C.textMuted,
                          fontSize: 13,
                          margin: '0 0 12px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {producto.descripcion?.substring(0, 100) || 'Guardián ancestral del bosque'}
                        </p>

                        {/* Cristales */}
                        {producto.cristales?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {producto.cristales.slice(0, 3).map((cristal, i) => (
                              <span key={i} style={{
                                padding: '2px 8px',
                                background: `${C.purple}22`,
                                borderRadius: 4,
                                fontSize: 10,
                                color: C.purple
                              }}>
                                💎 {cristal}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Propósito */}
                        {producto.proposito && (
                          <div style={{
                            marginTop: 8,
                            padding: '6px 10px',
                            background: `${C.gold}11`,
                            borderRadius: 6,
                            fontSize: 11,
                            color: C.gold
                          }}>
                            ✦ {producto.proposito}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ PASO 2: CONFIGURAR CONTENIDO ═══ */}
        {paso === 2 && guardianSeleccionado && (
          <div>
            {/* Guardian seleccionado */}
            <div style={{
              ...GLASS,
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 12,
                background: guardianSeleccionado.imagen
                  ? `url(${guardianSeleccionado.imagen}) center/cover`
                  : `linear-gradient(135deg, ${ELEMENTOS[guardianSeleccionado.elemento]?.color || C.purple}44, ${C.bgCard})`,
              }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ color: C.gold, fontSize: 20, margin: 0 }}>
                  {guardianSeleccionado.guardian || guardianSeleccionado.nombre}
                </h3>
                <p style={{ color: C.textMuted, fontSize: 13, margin: '4px 0' }}>
                  {ELEMENTOS[guardianSeleccionado.elemento]?.icono} {guardianSeleccionado.elemento || 'Éter'} • {guardianSeleccionado.proposito || 'Guía espiritual'}
                </p>
              </div>
              <button
                onClick={() => setPaso(1)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.textMuted,
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                Cambiar
              </button>
            </div>

            {/* Tipo de contenido */}
            <h2 style={{ color: C.text, fontSize: 18, marginBottom: 16 }}>
              ¿Qué tipo de contenido va a canalizar {guardianSeleccionado.guardian || 'el guardián'}?
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 12,
              marginBottom: 24
            }}>
              {TIPOS_CONTENIDO.map((tipo) => (
                <button
                  key={tipo.id}
                  onClick={() => setTipoContenido(tipo)}
                  style={{
                    padding: 16,
                    background: tipoContenido?.id === tipo.id ? `${tipo.color}22` : C.bgCard,
                    border: `2px solid ${tipoContenido?.id === tipo.id ? tipo.color : C.border}`,
                    borderRadius: 12,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>{tipo.icono}</span>
                  <h4 style={{ color: C.text, fontSize: 14, margin: '0 0 4px' }}>{tipo.nombre}</h4>
                  <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>{tipo.desc}</p>
                </button>
              ))}
            </div>

            {/* Tema */}
            {tipoContenido && (
              <div style={{
                ...GLASS,
                borderRadius: 16,
                padding: 24
              }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', color: C.text, marginBottom: 8, fontWeight: 500 }}>
                    ¿Sobre qué tema específico? *
                  </label>
                  <input
                    type="text"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    placeholder={`Ej: ${
                      tipoContenido.id === 'meditacion' ? 'Conectar con la abundancia' :
                      tipoContenido.id === 'ritual' ? 'Protección del hogar' :
                      tipoContenido.id === 'cuento' ? 'El origen de los guardianes' :
                      'Un mensaje para quien necesita guía'
                    }`}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      color: C.text,
                      fontSize: 15,
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', color: C.text, marginBottom: 8, fontWeight: 500 }}>
                    Instrucciones adicionales (opcional)
                  </label>
                  <textarea
                    value={instrucciones}
                    onChange={(e) => setInstrucciones(e.target.value)}
                    placeholder="Ej: Que mencione la luna llena, que sea muy visual, que incluya respiraciones..."
                    style={{
                      width: '100%',
                      minHeight: 80,
                      padding: '14px 16px',
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      color: C.text,
                      fontSize: 14,
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Opciones de voz */}
                <div style={{
                  padding: 16,
                  background: `${C.purple}11`,
                  borderRadius: 12,
                  marginBottom: 20
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ color: C.text, fontWeight: 500 }}>🎙️ Configuración de Audio</span>
                  </div>

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <select
                      value={vozSeleccionada}
                      onChange={(e) => setVozSeleccionada(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        background: C.bgCard,
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        color: C.text,
                        fontSize: 13
                      }}
                    >
                      <option value="auto">🎭 Voz automática según elemento</option>
                      <option value="thibisay">🌟 Thibisay</option>
                      <option value="merlin">🧙 Merlín (sabio)</option>
                      <option value="hechicero">🔮 Hechicero (misterioso)</option>
                      <option value="anciano">👴 Anciano (ancestral)</option>
                      <option value="hada">🧚 Hada (etérea)</option>
                      <option value="druida">🌿 Druida (natural)</option>
                    </select>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      background: conIntro ? `${C.gold}22` : C.bgCard,
                      border: `1px solid ${conIntro ? C.gold : C.border}`,
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={conIntro}
                        onChange={(e) => setConIntro(e.target.checked)}
                        style={{ display: 'none' }}
                      />
                      <span style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: `2px solid ${conIntro ? C.gold : C.border}`,
                        background: conIntro ? C.gold : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        color: '#000'
                      }}>
                        {conIntro && '✓'}
                      </span>
                      <span style={{ color: conIntro ? C.gold : C.textMuted, fontSize: 13 }}>
                        Incluir presentación del personaje
                      </span>
                    </label>
                  </div>
                </div>

                {/* Botones */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setPaso(1)}
                    style={{
                      padding: '14px 24px',
                      background: 'transparent',
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      color: C.textMuted,
                      cursor: 'pointer'
                    }}
                  >
                    ← Atrás
                  </button>
                  <button
                    onClick={generarContenido}
                    disabled={generando || !tema.trim()}
                    style={{
                      flex: 1,
                      padding: '14px 24px',
                      background: (generando || !tema.trim())
                        ? C.bgHover
                        : `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                      border: 'none',
                      borderRadius: 10,
                      color: (!tema.trim()) ? C.textDim : '#000',
                      fontWeight: 600,
                      cursor: (generando || !tema.trim()) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}
                  >
                    {generando ? (
                      <>
                        <div style={{
                          width: 18, height: 18,
                          border: '2px solid transparent',
                          borderTopColor: C.textMuted,
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Canalizando con {guardianSeleccionado.guardian}...
                      </>
                    ) : (
                      <>✨ Canalizar Contenido</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ PASO 3: RESULTADO ═══ */}
        {paso === 3 && (
          <div>
            <div style={{ display: 'flex', gap: 24 }}>
              {/* Columna principal */}
              <div style={{ flex: 1 }}>
                <div style={{
                  ...GLASS,
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 24
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16
                  }}>
                    <h2 style={{ color: C.gold, fontSize: 18, margin: 0 }}>
                      {tituloGenerado}
                    </h2>
                    <span style={{ color: C.textMuted, fontSize: 12 }}>
                      {contenidoGenerado.split(/\s+/).length} palabras
                    </span>
                  </div>

                  <textarea
                    value={contenidoGenerado}
                    onChange={(e) => setContenidoGenerado(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: 400,
                      padding: 16,
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      color: C.text,
                      fontSize: 14,
                      lineHeight: 1.7,
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Multimedia */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Audio */}
                  <div style={{
                    ...GLASS,
                    borderRadius: 16,
                    padding: 20
                  }}>
                    <h3 style={{ color: C.text, fontSize: 16, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      🎙️ Audio con Personaje
                    </h3>

                    {audioGenerado ? (
                      <div>
                        <audio
                          controls
                          src={`data:audio/mpeg;base64,${audioGenerado}`}
                          style={{ width: '100%', marginBottom: 12 }}
                        />
                        <p style={{ color: C.success, fontSize: 12, textAlign: 'center' }}>
                          ✓ Audio generado
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={generarAudio}
                        disabled={generandoAudio}
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: generandoAudio ? C.bgHover : `linear-gradient(135deg, ${C.purple}, #a855f7)`,
                          border: 'none',
                          borderRadius: 10,
                          color: 'white',
                          fontWeight: 600,
                          cursor: generandoAudio ? 'wait' : 'pointer'
                        }}
                      >
                        {generandoAudio ? 'Generando...' : '🎙️ Generar Audio'}
                      </button>
                    )}
                  </div>

                  {/* Imagen */}
                  <div style={{
                    ...GLASS,
                    borderRadius: 16,
                    padding: 20
                  }}>
                    <h3 style={{ color: C.text, fontSize: 16, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      🖼️ Imagen del Guardián
                    </h3>

                    {imagenGenerada ? (
                      <div>
                        <img
                          src={imagenGenerada}
                          alt="Guardián"
                          style={{ width: '100%', borderRadius: 8, marginBottom: 12 }}
                        />
                        <p style={{ color: C.success, fontSize: 12, textAlign: 'center' }}>
                          ✓ Imagen generada
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={generarImagen}
                        disabled={generandoImagen}
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: generandoImagen ? C.bgHover : `linear-gradient(135deg, ${C.blue}, #60a5fa)`,
                          border: 'none',
                          borderRadius: 10,
                          color: 'white',
                          fontWeight: 600,
                          cursor: generandoImagen ? 'wait' : 'pointer'
                        }}
                      >
                        {generandoImagen ? 'Generando...' : '🖼️ Generar Imagen'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div style={{ width: 280 }}>
                <div style={{
                  ...GLASS,
                  borderRadius: 16,
                  padding: 20,
                  position: 'sticky',
                  top: 20
                }}>
                  <div style={{
                    width: '100%',
                    height: 150,
                    borderRadius: 12,
                    background: guardianSeleccionado?.imagen
                      ? `url(${guardianSeleccionado.imagen}) center/cover`
                      : `linear-gradient(135deg, ${ELEMENTOS[guardianSeleccionado?.elemento]?.color || C.purple}44, ${C.bgCard})`,
                    marginBottom: 16
                  }} />

                  <h3 style={{ color: C.gold, fontSize: 18, margin: '0 0 4px' }}>
                    {guardianSeleccionado?.guardian}
                  </h3>
                  <p style={{ color: C.textMuted, fontSize: 13, margin: '0 0 16px' }}>
                    {tipoContenido?.icono} {tipoContenido?.nombre}
                  </p>

                  <div style={{
                    padding: 12,
                    background: `${C.gold}11`,
                    borderRadius: 8,
                    marginBottom: 16
                  }}>
                    <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>
                      <strong style={{ color: C.gold }}>Tema:</strong> {tema}
                    </p>
                  </div>

                  <button
                    onClick={resetear}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      color: C.text,
                      cursor: 'pointer',
                      marginBottom: 8
                    }}
                  >
                    🔄 Crear otro contenido
                  </button>

                  <button
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: `linear-gradient(135deg, ${C.success}, #16a34a)`,
                      border: 'none',
                      borderRadius: 10,
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    📤 Publicar en el Círculo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
