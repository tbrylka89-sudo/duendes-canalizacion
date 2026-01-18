'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ONBOARDING DEL CÍRCULO - Formulario completo de registro
// Incluye: género para personalización, cumpleaños, nivel adquisitivo
// ═══════════════════════════════════════════════════════════════════════════════

// Función para calcular clasificación basada en respuestas
function calcularClasificacion(datos) {
  let puntos = 0;

  // Frecuencia de gustos especiales
  if (datos.frecuenciaGustos === 'seguido') puntos += 3;
  else if (datos.frecuenciaGustos === 'a-veces') puntos += 2;
  else if (datos.frecuenciaGustos === 'rara-vez') puntos += 1;

  // Preferencia calidad vs precio
  if (datos.preferenciaCalidad === 'calidad') puntos += 3;
  else if (datos.preferenciaCalidad === 'equilibrio') puntos += 2;
  else if (datos.preferenciaCalidad === 'precio') puntos += 1;

  // Inversión en felicidad
  if (datos.inversionFelicidad === 'mas-200') puntos += 4;
  else if (datos.inversionFelicidad === '100-200') puntos += 3;
  else if (datos.inversionFelicidad === '50-100') puntos += 2;
  else if (datos.inversionFelicidad === '20-50') puntos += 1;

  // Espacio sagrado
  if (datos.espacioSagrado === 'amplio') puntos += 3;
  else if (datos.espacioSagrado === 'pequeno') puntos += 2;
  else if (datos.espacioSagrado === 'no') puntos += 1;

  // Guardianes adoptados
  if (datos.guardiansAdoptados === 'mas-10') puntos += 3;
  else if (datos.guardiansAdoptados === '4-10') puntos += 2;
  else if (datos.guardiansAdoptados === '1-3') puntos += 1;

  // Colección de cristales
  if (datos.coleccionCristales === 'apasionado') puntos += 2;
  else if (datos.coleccionCristales === 'coleccion') puntos += 1;

  // Clasificación final
  if (puntos >= 15) return { nivel: 'diamante', emoji: '💎', color: '#00d4ff' };
  if (puntos >= 11) return { nivel: 'oro', emoji: '🥇', color: '#d4af37' };
  if (puntos >= 7) return { nivel: 'plata', emoji: '🥈', color: '#c0c0c0' };
  return { nivel: 'bronce', emoji: '🥉', color: '#cd7f32' };
}

// Helper para personalizar texto según género
function personalizarTexto(texto, genero) {
  if (genero === 'ella') {
    return texto
      .replace(/Bienvenido/g, 'Bienvenida')
      .replace(/guardián/g, 'guardiana')
      .replace(/compañero/g, 'compañera');
  }
  if (genero === 'neutro') {
    return texto
      .replace(/Bienvenido/g, 'Bienvenide')
      .replace(/guardián/g, 'guardiane')
      .replace(/compañero/g, 'compañere');
  }
  return texto; // él - masculino por defecto
}

export default function Onboarding({ email, nombreInicial, onComplete }) {
  const [paso, setPaso] = useState(1);
  const [guardando, setGuardando] = useState(false);
  const [datos, setDatos] = useState({
    // PASO 1: DATOS BÁSICOS + GÉNERO
    nombrePreferido: nombreInicial || '',
    nombreCompleto: '',
    genero: '', // ella, el, neutro - IMPORTANTE para personalización
    fechaNacimiento: '', // Para descuento de cumpleaños
    pais: '',
    comoLlegaste: '',

    // PASO 2: INTERESES MÍSTICOS
    atraccionPrincipal: [],
    experienciaEspiritual: '',
    queBusca: [],

    // PASO 3: NIVEL ADQUISITIVO
    frecuenciaGustos: '',
    preferenciaCalidad: '',
    inversionFelicidad: '',
    espacioSagrado: '',

    // PASO 4: HISTORIA
    guardiansAdoptados: '',
    coleccionCristales: '',
    objetivoPrincipal: ''
  });

  function handleChange(campo, valor) {
    setDatos(prev => ({ ...prev, [campo]: valor }));
  }

  function toggleArrayItem(campo, item) {
    setDatos(prev => {
      const arr = prev[campo] || [];
      if (arr.includes(item)) {
        return { ...prev, [campo]: arr.filter(i => i !== item) };
      } else {
        return { ...prev, [campo]: [...arr, item] };
      }
    });
  }

  async function handleFinalizar() {
    setGuardando(true);
    try {
      const clasificacion = calcularClasificacion(datos);

      const res = await fetch('/api/circulo/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          perfil: {
            ...datos,
            clasificacion: clasificacion.nivel,
            clasificacionEmoji: clasificacion.emoji,
            clasificacionColor: clasificacion.color,
            onboardingCompletado: true,
            fechaOnboarding: new Date().toISOString()
          }
        })
      });
      const result = await res.json();
      if (result.success) {
        onComplete({ ...datos, clasificacion });
      }
    } catch (error) {
      console.error('Error guardando perfil:', error);
    } finally {
      setGuardando(false);
    }
  }

  // Texto personalizado según género seleccionado
  const bienvenidaTexto = datos.genero === 'ella' ? 'Bienvenida' : datos.genero === 'neutro' ? 'Bienvenide' : 'Bienvenido';

  return (
    <div className="onboarding">
      <div className="onboarding-card">
        {/* Indicador de pasos */}
        <div className="pasos-indicador">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className={`paso-dot ${paso >= num ? 'activo' : ''} ${paso === num ? 'actual' : ''}`}>
              {paso > num ? '✓' : num}
            </div>
          ))}
        </div>

        {/* PASO 1: DATOS BÁSICOS + GÉNERO */}
        {paso === 1 && (
          <div className="paso-contenido">
            <h2>¡Hola! Queremos conocerte</h2>
            <p className="subtitulo">Esto nos ayuda a personalizar toda tu experiencia</p>

            <div className="campo">
              <label>¿Cómo preferís que te tratemos?</label>
              <div className="genero-opciones">
                {[
                  { valor: 'ella', texto: 'Ella', desc: 'Femenino', ejemplo: 'Bienvenida, guardiana' },
                  { valor: 'el', texto: 'Él', desc: 'Masculino', ejemplo: 'Bienvenido, guardián' },
                  { valor: 'neutro', texto: 'Neutro', desc: 'Inclusivo', ejemplo: 'Bienvenide, guardiane' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`genero-btn ${datos.genero === op.valor ? 'seleccionado' : ''}`}
                    onClick={() => handleChange('genero', op.valor)}
                  >
                    <span className="genero-titulo">{op.texto}</span>
                    <span className="genero-desc">{op.desc}</span>
                    <span className="genero-ejemplo">"{op.ejemplo}"</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Cómo te gustaría que te llamemos?</label>
              <input
                type="text"
                value={datos.nombrePreferido}
                onChange={e => handleChange('nombrePreferido', e.target.value)}
                placeholder="Tu nombre o apodo preferido"
              />
            </div>

            <div className="campo">
              <label>Tu nombre completo</label>
              <input
                type="text"
                value={datos.nombreCompleto}
                onChange={e => handleChange('nombreCompleto', e.target.value)}
                placeholder="Nombre y apellido"
              />
            </div>

            <div className="campos-row">
              <div className="campo">
                <label>Fecha de nacimiento</label>
                <input
                  type="date"
                  value={datos.fechaNacimiento}
                  onChange={e => handleChange('fechaNacimiento', e.target.value)}
                />
                <span className="campo-nota">Te mandamos un regalo en tu cumple</span>
              </div>

              <div className="campo">
                <label>País</label>
                <select
                  value={datos.pais}
                  onChange={e => handleChange('pais', e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="uruguay">🇺🇾 Uruguay</option>
                  <option value="argentina">🇦🇷 Argentina</option>
                  <option value="chile">🇨🇱 Chile</option>
                  <option value="mexico">🇲🇽 México</option>
                  <option value="colombia">🇨🇴 Colombia</option>
                  <option value="peru">🇵🇪 Perú</option>
                  <option value="espana">🇪🇸 España</option>
                  <option value="usa">🇺🇸 Estados Unidos</option>
                  <option value="brasil">🇧🇷 Brasil</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="campo">
              <label>¿Cómo nos conociste?</label>
              <div className="opciones-chips">
                {[
                  { valor: 'instagram', texto: 'Instagram' },
                  { valor: 'facebook', texto: 'Facebook' },
                  { valor: 'tiktok', texto: 'TikTok' },
                  { valor: 'recomendacion', texto: 'Recomendación' },
                  { valor: 'busqueda', texto: 'Google' },
                  { valor: 'otro', texto: 'Otro' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`chip ${datos.comoLlegaste === op.valor ? 'seleccionado' : ''}`}
                    onClick={() => handleChange('comoLlegaste', op.valor)}
                  >
                    {op.texto}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-siguiente"
              onClick={() => setPaso(2)}
              disabled={!datos.nombrePreferido || !datos.genero}
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* PASO 2: INTERESES MÍSTICOS */}
        {paso === 2 && (
          <div className="paso-contenido">
            <h2>Tu camino espiritual</h2>
            <p className="subtitulo">Contanos qué te atrae del mundo místico</p>

            <div className="campo">
              <label>¿Qué te atrae más? (elegí las que quieras)</label>
              <div className="opciones-grid">
                {[
                  { valor: 'cristales', emoji: '💎', texto: 'Cristales' },
                  { valor: 'runas', emoji: 'ᚱ', texto: 'Runas' },
                  { valor: 'tarot', emoji: '🃏', texto: 'Tarot' },
                  { valor: 'meditacion', emoji: '🧘', texto: 'Meditación' },
                  { valor: 'rituales', emoji: '🕯', texto: 'Rituales' },
                  { valor: 'luna', emoji: '🌙', texto: 'Ciclos lunares' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`opcion-card ${datos.atraccionPrincipal.includes(op.valor) ? 'seleccionado' : ''}`}
                    onClick={() => toggleArrayItem('atraccionPrincipal', op.valor)}
                  >
                    <span className="opcion-emoji">{op.emoji}</span>
                    <span className="opcion-texto">{op.texto}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>Tu experiencia espiritual</label>
              <div className="opciones-chips">
                {[
                  { valor: 'ninguna', texto: 'Recién empiezo' },
                  { valor: 'algo', texto: 'Algo de experiencia' },
                  { valor: 'mucha', texto: 'Mucha experiencia' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`chip ${datos.experienciaEspiritual === op.valor ? 'seleccionado' : ''}`}
                    onClick={() => handleChange('experienciaEspiritual', op.valor)}
                  >
                    {op.texto}
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Qué buscás? (elegí las que quieras)</label>
              <div className="opciones-chips">
                {[
                  { valor: 'proteccion', texto: '🛡 Protección' },
                  { valor: 'abundancia', texto: '✨ Abundancia' },
                  { valor: 'amor', texto: '💕 Amor' },
                  { valor: 'sanacion', texto: '💚 Sanación' },
                  { valor: 'guia', texto: '🧭 Guía' },
                  { valor: 'paz', texto: '☮ Paz interior' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`chip ${datos.queBusca.includes(op.valor) ? 'seleccionado' : ''}`}
                    onClick={() => toggleArrayItem('queBusca', op.valor)}
                  >
                    {op.texto}
                  </button>
                ))}
              </div>
            </div>

            <div className="navegacion">
              <button className="btn-anterior" onClick={() => setPaso(1)}>← Anterior</button>
              <button className="btn-siguiente" onClick={() => setPaso(3)}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* PASO 3: NIVEL ADQUISITIVO (preguntas naturales) */}
        {paso === 3 && (
          <div className="paso-contenido">
            <h2>Conocerte mejor</h2>
            <p className="subtitulo">Para recomendarte lo ideal para vos</p>

            <div className="campo">
              <label>¿Con qué frecuencia te das un gusto especial?</label>
              <div className="opciones-visual">
                {[
                  { valor: 'rara-vez', icono: '🌱', texto: 'De vez en cuando' },
                  { valor: 'a-veces', icono: '🌿', texto: 'Cuando puedo' },
                  { valor: 'seguido', icono: '🌳', texto: 'Seguido, me lo merezco' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`visual-btn ${datos.frecuenciaGustos === op.valor ? 'seleccionado' : ''}`}
                    onClick={() => handleChange('frecuenciaGustos', op.valor)}
                  >
                    <span className="visual-icono">{op.icono}</span>
                    <span className="visual-texto">{op.texto}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>En tus compras, ¿qué preferís?</label>
              <div className="opciones-visual">
                {[
                  { valor: 'precio', icono: '💰', texto: 'Buen precio' },
                  { valor: 'equilibrio', icono: '⚖️', texto: 'Equilibrio' },
                  { valor: 'calidad', icono: '👑', texto: 'Calidad premium' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`visual-btn ${datos.preferenciaCalidad === op.valor ? 'seleccionado' : ''}`}
                    onClick={() => handleChange('preferenciaCalidad', op.valor)}
                  >
                    <span className="visual-icono">{op.icono}</span>
                    <span className="visual-texto">{op.texto}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>Cuando algo te conecta profundamente, ¿cómo honrás ese vínculo?</label>
              <div className="opciones-visual">
                {[
                  { valor: '20-50', icono: '🌿', texto: 'Con tiempo y atención' },
                  { valor: '50-100', icono: '✨', texto: 'Con detalles simbólicos' },
                  { valor: '100-200', icono: '🔮', texto: 'Colecciono piezas especiales' },
                  { valor: 'mas-200', icono: '👑', texto: 'Invierto en lo que transforma' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`visual-btn ${datos.inversionFelicidad === op.valor ? 'seleccionado' : ''}`}
                    onClick={() => handleChange('inversionFelicidad', op.valor)}
                  >
                    <span className="visual-icono">{op.icono}</span>
                    <span className="visual-texto">{op.texto}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Tenés un espacio para tus objetos sagrados?</label>
              <div className="opciones-visual">
                {[
                  { valor: 'no', icono: '🌱', texto: 'Todavía no' },
                  { valor: 'pequeno', icono: '🏠', texto: 'Un rinconcito' },
                  { valor: 'amplio', icono: '🏛', texto: 'Sí, amplio' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`visual-btn ${datos.espacioSagrado === op.valor ? 'seleccionado' : ''}`}
                    onClick={() => handleChange('espacioSagrado', op.valor)}
                  >
                    <span className="visual-icono">{op.icono}</span>
                    <span className="visual-texto">{op.texto}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="navegacion">
              <button className="btn-anterior" onClick={() => setPaso(2)}>← Anterior</button>
              <button className="btn-siguiente" onClick={() => setPaso(4)}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* PASO 4: FINALIZACIÓN */}
        {paso === 4 && (
          <div className="paso-contenido">
            <h2>¡Casi {datos.genero === 'ella' ? 'lista' : datos.genero === 'neutro' ? 'liste' : 'listo'}!</h2>
            <p className="subtitulo">Una última cosa y entrás al Círculo</p>

            <div className="campos-row">
              <div className="campo">
                <label>¿Cuántos guardianes tenés?</label>
                <div className="opciones-chips">
                  {[
                    { valor: '0', texto: 'Ninguno' },
                    { valor: '1-3', texto: '1 a 3' },
                    { valor: '4-10', texto: '4 a 10' },
                    { valor: 'mas-10', texto: '+10' }
                  ].map(op => (
                    <button
                      key={op.valor}
                      type="button"
                      className={`chip ${datos.guardiansAdoptados === op.valor ? 'seleccionado' : ''}`}
                      onClick={() => handleChange('guardiansAdoptados', op.valor)}
                    >
                      {op.texto}
                    </button>
                  ))}
                </div>
              </div>

              <div className="campo">
                <label>¿Coleccionás cristales?</label>
                <div className="opciones-chips">
                  {[
                    { valor: 'no', texto: 'No' },
                    { valor: 'algunos', texto: 'Algunos' },
                    { valor: 'coleccion', texto: 'Varios' },
                    { valor: 'apasionado', texto: 'Muchos' }
                  ].map(op => (
                    <button
                      key={op.valor}
                      type="button"
                      className={`chip ${datos.coleccionCristales === op.valor ? 'seleccionado' : ''}`}
                      onClick={() => handleChange('coleccionCristales', op.valor)}
                    >
                      {op.texto}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="campo">
              <label>¿Qué esperás encontrar en el Círculo?</label>
              <textarea
                value={datos.objetivoPrincipal}
                onChange={e => handleChange('objetivoPrincipal', e.target.value)}
                placeholder="Contanos qué buscás, qué momento estás atravesando..."
                rows={3}
              />
            </div>

            {/* Resumen */}
            <div className="resumen">
              <h4>Tu perfil</h4>
              <div className="resumen-grid">
                <span><strong>Nombre:</strong> {datos.nombrePreferido}</span>
                <span><strong>Género:</strong> {datos.genero === 'ella' ? 'Ella' : datos.genero === 'neutro' ? 'Neutro' : 'Él'}</span>
                {datos.atraccionPrincipal.length > 0 && (
                  <span><strong>Intereses:</strong> {datos.atraccionPrincipal.join(', ')}</span>
                )}
                {datos.queBusca.length > 0 && (
                  <span><strong>Busca:</strong> {datos.queBusca.join(', ')}</span>
                )}
              </div>
            </div>

            <div className="navegacion">
              <button className="btn-anterior" onClick={() => setPaso(3)}>← Anterior</button>
              <button
                className="btn-finalizar"
                onClick={handleFinalizar}
                disabled={guardando}
              >
                {guardando ? (
                  <span className="loading-dots">
                    <span></span><span></span><span></span>
                  </span>
                ) : (
                  `✨ ${bienvenidaTexto} al Círculo`
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .onboarding {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #0a0a0f 0%, #12121a 100%);
          padding: 30px 20px;
          font-family: 'Cormorant Garamond', serif;
        }

        .onboarding-card {
          width: 100%;
          max-width: 600px;
          background: #151520;
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 24px;
          padding: 35px 30px;
        }

        .pasos-indicador {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 35px;
        }

        .paso-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.3);
          transition: all 0.3s;
        }

        .paso-dot.activo {
          background: rgba(212, 175, 55, 0.15);
          color: #d4af37;
        }

        .paso-dot.actual {
          background: #d4af37;
          color: #0a0a0a;
        }

        .paso-contenido {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h2 {
          font-family: 'Tangerine', cursive;
          font-size: 44px;
          color: #d4af37;
          text-align: center;
          margin: 0 0 8px;
        }

        .subtitulo {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 15px;
          margin-bottom: 30px;
        }

        .campo {
          margin-bottom: 22px;
        }

        .campo label {
          display: block;
          color: #FDF8F0;
          font-size: 15px;
          margin-bottom: 10px;
        }

        .campo input,
        .campo select,
        .campo textarea {
          width: 100%;
          padding: 14px 16px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #FDF8F0;
          font-size: 15px;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.3s;
        }

        .campo input:focus,
        .campo select:focus,
        .campo textarea:focus {
          outline: none;
          border-color: #d4af37;
        }

        .campo-nota {
          display: block;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 6px;
        }

        .campos-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        /* Género opciones */
        .genero-opciones {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .genero-btn {
          padding: 18px 12px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-align: center;
        }

        .genero-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .genero-btn.seleccionado {
          background: rgba(212, 175, 55, 0.1);
          border-color: #d4af37;
        }

        .genero-titulo {
          font-size: 18px;
          font-weight: 600;
          color: #FDF8F0;
        }

        .genero-btn.seleccionado .genero-titulo {
          color: #d4af37;
        }

        .genero-desc {
          font-size: 12px;
          opacity: 0.6;
        }

        .genero-ejemplo {
          font-size: 11px;
          font-style: italic;
          opacity: 0.5;
          margin-top: 4px;
        }

        /* Chips */
        .opciones-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip {
          padding: 10px 16px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s;
        }

        .chip:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .chip.seleccionado {
          background: rgba(212, 175, 55, 0.15);
          border-color: #d4af37;
          color: #d4af37;
        }

        /* Grid de opciones */
        .opciones-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .opcion-card {
          padding: 16px 10px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .opcion-card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }

        .opcion-card.seleccionado {
          background: rgba(212, 175, 55, 0.1);
          border-color: #d4af37;
        }

        .opcion-emoji {
          font-size: 24px;
        }

        .opcion-texto {
          font-size: 13px;
        }

        .opcion-card.seleccionado .opcion-texto {
          color: #d4af37;
        }

        /* Visual buttons */
        .opciones-visual {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .visual-btn {
          padding: 18px 12px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .visual-btn:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .visual-btn.seleccionado {
          background: rgba(212, 175, 55, 0.1);
          border-color: #d4af37;
        }

        .visual-icono {
          font-size: 26px;
        }

        .visual-texto {
          font-size: 13px;
          text-align: center;
        }

        .visual-btn.seleccionado .visual-texto {
          color: #d4af37;
        }

        /* Rango buttons */
        .opciones-rango {
          display: flex;
          gap: 8px;
        }

        .rango-btn {
          flex: 1;
          padding: 14px 10px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s;
        }

        .rango-btn:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .rango-btn.seleccionado {
          background: rgba(212, 175, 55, 0.15);
          border-color: #d4af37;
          color: #d4af37;
        }

        /* Resumen */
        .resumen {
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 12px;
          padding: 16px;
          margin: 20px 0;
        }

        .resumen h4 {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          color: #d4af37;
          margin: 0 0 12px;
        }

        .resumen-grid {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .resumen-grid span {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .resumen-grid strong {
          color: #FDF8F0;
        }

        /* Navegación */
        .navegacion {
          display: flex;
          gap: 12px;
          margin-top: 25px;
        }

        .btn-anterior {
          padding: 14px 24px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          font-family: 'Cinzel', serif;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-anterior:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .btn-siguiente,
        .btn-finalizar {
          flex: 1;
          padding: 14px 24px;
          background: #d4af37;
          border: none;
          border-radius: 25px;
          color: #0a0a0a;
          font-size: 14px;
          font-family: 'Cinzel', serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-siguiente:disabled,
        .btn-finalizar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-siguiente:not(:disabled):hover,
        .btn-finalizar:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.25);
        }

        /* Loading */
        .loading-dots {
          display: flex;
          gap: 4px;
          justify-content: center;
        }

        .loading-dots span {
          width: 8px;
          height: 8px;
          background: #0a0a0a;
          border-radius: 50%;
          animation: bounce 0.6s infinite alternate;
        }

        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          to { transform: translateY(-5px); }
        }

        @media (max-width: 550px) {
          .onboarding-card { padding: 25px 20px; }
          h2 { font-size: 36px; }
          .genero-opciones { grid-template-columns: 1fr; }
          .campos-row { grid-template-columns: 1fr; }
          .opciones-grid { grid-template-columns: repeat(2, 1fr); }
          .opciones-visual { grid-template-columns: 1fr; }
          .opciones-rango { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
