'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ONBOARDING DEL CÍRCULO - Encuesta completa de perfil + Nivel adquisitivo
// Sistema de clasificación: Bronce, Plata, Oro, Diamante
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

  // Guardianes adoptados (más guardianes = más inversión previa)
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

export default function Onboarding({ email, nombreInicial, onComplete }) {
  const [paso, setPaso] = useState(1);
  const [guardando, setGuardando] = useState(false);
  const [datos, setDatos] = useState({
    // DATOS BÁSICOS
    nombrePreferido: nombreInicial || '',
    nombreCompleto: '',
    pais: '',
    comoLlegaste: '',

    // PREFERENCIAS MÍSTICAS
    atraccionPrincipal: [],
    experienciaEspiritual: '',
    queBusca: [],

    // NIVEL ADQUISITIVO (preguntas indirectas)
    frecuenciaGustos: '',
    preferenciaCalidad: '',
    inversionFelicidad: '',
    espacioSagrado: '',

    // DATOS ADICIONALES (del onboarding anterior)
    pronombres: '',
    fechaNacimiento: '',
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

  const totalPasos = 5;

  return (
    <div className="onboarding">
      <div className="contenedor">
        <div className="pasos-indicador">
          {[1, 2, 3, 4, 5].map(num => (
            <div key={num} className={`paso-dot ${paso >= num ? 'activo' : ''} ${paso === num ? 'actual' : ''}`}>
              {paso > num ? '✓' : num}
            </div>
          ))}
        </div>

        {/* PASO 1: DATOS BÁSICOS */}
        {paso === 1 && (
          <div className="paso-contenido animate-fade">
            <h2>Bienvenida al Círculo</h2>
            <p className="subtitulo">Queremos conocerte para personalizar tu experiencia</p>

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

            <div className="campo">
              <label>¿De qué país sos?</label>
              <select
                value={datos.pais}
                onChange={e => handleChange('pais', e.target.value)}
                className="select-campo"
              >
                <option value="">Seleccionar país</option>
                <option value="uruguay">Uruguay</option>
                <option value="argentina">Argentina</option>
                <option value="chile">Chile</option>
                <option value="mexico">México</option>
                <option value="colombia">Colombia</option>
                <option value="peru">Perú</option>
                <option value="espana">España</option>
                <option value="usa">Estados Unidos</option>
                <option value="brasil">Brasil</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="campo">
              <label>¿Cómo nos conociste?</label>
              <div className="opciones-vertical">
                {[
                  { valor: 'instagram', texto: 'Por Instagram' },
                  { valor: 'facebook', texto: 'Por Facebook' },
                  { valor: 'tiktok', texto: 'Por TikTok' },
                  { valor: 'recomendacion', texto: 'Me lo recomendó alguien' },
                  { valor: 'busqueda', texto: 'Buscando en Google' },
                  { valor: 'otro', texto: 'De otra forma' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`opcion-vertical ${datos.comoLlegaste === op.valor ? 'seleccionada' : ''}`}
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
              disabled={!datos.nombrePreferido}
            >
              Siguiente
            </button>
          </div>
        )}

        {/* PASO 2: PREFERENCIAS MÍSTICAS */}
        {paso === 2 && (
          <div className="paso-contenido animate-fade">
            <h2>Tu Camino Espiritual</h2>
            <p className="subtitulo">Contanos sobre tus intereses místicos</p>

            <div className="campo">
              <label>¿Qué te atrae más? (podés elegir varias)</label>
              <div className="opciones-grid">
                {[
                  { valor: 'cristales', texto: '💎 Cristales', desc: 'Energía mineral' },
                  { valor: 'runas', texto: 'ᚱ Runas', desc: 'Sabiduría nórdica' },
                  { valor: 'tarot', texto: '🃏 Tarot', desc: 'Lectura de cartas' },
                  { valor: 'meditacion', texto: '🧘 Meditación', desc: 'Paz interior' },
                  { valor: 'rituales', texto: '🕯 Rituales', desc: 'Magia práctica' },
                  { valor: 'luna', texto: '🌙 Ciclos lunares', desc: 'Energía cósmica' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`opcion-card ${datos.atraccionPrincipal.includes(op.valor) ? 'seleccionada' : ''}`}
                    onClick={() => toggleArrayItem('atraccionPrincipal', op.valor)}
                  >
                    <span className="opcion-card-emoji">{op.texto.split(' ')[0]}</span>
                    <span className="opcion-card-titulo">{op.texto.split(' ').slice(1).join(' ')}</span>
                    <span className="opcion-card-desc">{op.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Tenés experiencia previa con lo espiritual?</label>
              <div className="opciones-grupo">
                {[
                  { valor: 'ninguna', texto: 'Recién empiezo' },
                  { valor: 'algo', texto: 'Algo de experiencia' },
                  { valor: 'mucha', texto: 'Mucha experiencia' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`opcion ${datos.experienciaEspiritual === op.valor ? 'seleccionada' : ''}`}
                    onClick={() => handleChange('experienciaEspiritual', op.valor)}
                  >
                    {op.texto}
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Qué buscás? (podés elegir varias)</label>
              <div className="opciones-grid-3">
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
                    className={`opcion-tag ${datos.queBusca.includes(op.valor) ? 'seleccionada' : ''}`}
                    onClick={() => toggleArrayItem('queBusca', op.valor)}
                  >
                    {op.texto}
                  </button>
                ))}
              </div>
            </div>

            <div className="navegacion">
              <button className="btn-anterior" onClick={() => setPaso(1)}>Anterior</button>
              <button className="btn-siguiente" onClick={() => setPaso(3)}>Siguiente</button>
            </div>
          </div>
        )}

        {/* PASO 3: NIVEL ADQUISITIVO (preguntas indirectas) */}
        {paso === 3 && (
          <div className="paso-contenido animate-fade">
            <h2>Conocerte Mejor</h2>
            <p className="subtitulo">Para recomendarte lo mejor para vos</p>

            <div className="campo">
              <label>¿Con qué frecuencia te das un gusto especial?</label>
              <div className="opciones-visual">
                {[
                  { valor: 'rara-vez', texto: 'De vez en cuando', icono: '🌱', desc: 'Prefiero ahorrar' },
                  { valor: 'a-veces', texto: 'Cuando puedo', icono: '🌿', desc: 'Balance es clave' },
                  { valor: 'seguido', texto: 'Seguido', icono: '🌳', desc: 'Me lo merezco' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`opcion-visual ${datos.frecuenciaGustos === op.valor ? 'seleccionada' : ''}`}
                    onClick={() => handleChange('frecuenciaGustos', op.valor)}
                  >
                    <span className="opcion-visual-icono">{op.icono}</span>
                    <span className="opcion-visual-texto">{op.texto}</span>
                    <span className="opcion-visual-desc">{op.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>En tus compras, ¿qué preferís?</label>
              <div className="opciones-visual">
                {[
                  { valor: 'precio', texto: 'Buen precio', icono: '💰', desc: 'Lo económico' },
                  { valor: 'equilibrio', texto: 'Equilibrio', icono: '⚖️', desc: 'Precio y calidad' },
                  { valor: 'calidad', texto: 'Calidad premium', icono: '👑', desc: 'Lo mejor' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`opcion-visual ${datos.preferenciaCalidad === op.valor ? 'seleccionada' : ''}`}
                    onClick={() => handleChange('preferenciaCalidad', op.valor)}
                  >
                    <span className="opcion-visual-icono">{op.icono}</span>
                    <span className="opcion-visual-texto">{op.texto}</span>
                    <span className="opcion-visual-desc">{op.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Cuánto invertirías en algo que te haga realmente feliz?</label>
              <div className="opciones-rango">
                {[
                  { valor: '20-50', texto: '$20-50', width: '25%' },
                  { valor: '50-100', texto: '$50-100', width: '50%' },
                  { valor: '100-200', texto: '$100-200', width: '75%' },
                  { valor: 'mas-200', texto: '+$200', width: '100%' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`opcion-rango ${datos.inversionFelicidad === op.valor ? 'seleccionada' : ''}`}
                    onClick={() => handleChange('inversionFelicidad', op.valor)}
                    style={{ '--fill-width': op.width }}
                  >
                    {op.texto}
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Tenés un espacio especial para tus objetos sagrados?</label>
              <div className="opciones-visual">
                {[
                  { valor: 'no', texto: 'Todavía no', icono: '🌱', desc: 'Quiero empezar' },
                  { valor: 'pequeno', texto: 'Un rinconcito', icono: '🏠', desc: 'Pequeño pero mío' },
                  { valor: 'amplio', texto: 'Sí, amplio', icono: '🏛', desc: 'Mi altar sagrado' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`opcion-visual ${datos.espacioSagrado === op.valor ? 'seleccionada' : ''}`}
                    onClick={() => handleChange('espacioSagrado', op.valor)}
                  >
                    <span className="opcion-visual-icono">{op.icono}</span>
                    <span className="opcion-visual-texto">{op.texto}</span>
                    <span className="opcion-visual-desc">{op.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="navegacion">
              <button className="btn-anterior" onClick={() => setPaso(2)}>Anterior</button>
              <button className="btn-siguiente" onClick={() => setPaso(4)}>Siguiente</button>
            </div>
          </div>
        )}

        {/* PASO 4: TU HISTORIA */}
        {paso === 4 && (
          <div className="paso-contenido animate-fade">
            <h2>Tu Historia Mágica</h2>
            <p className="subtitulo">Nos encanta saber más de vos</p>

            <div className="campo">
              <label>¿Cuántos guardianes tenés?</label>
              <div className="opciones-grupo">
                {[
                  { valor: '0', texto: 'Ninguno aún' },
                  { valor: '1-3', texto: '1 a 3' },
                  { valor: '4-10', texto: '4 a 10' },
                  { valor: 'mas-10', texto: 'Más de 10' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`opcion ${datos.guardiansAdoptados === op.valor ? 'seleccionada' : ''}`}
                    onClick={() => handleChange('guardiansAdoptados', op.valor)}
                  >
                    {op.texto}
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Coleccionás cristales?</label>
              <div className="opciones-grupo">
                {[
                  { valor: 'no', texto: 'No' },
                  { valor: 'algunos', texto: 'Tengo algunos' },
                  { valor: 'coleccion', texto: 'Tengo varios' },
                  { valor: 'apasionado', texto: 'Me encantan' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`opcion ${datos.coleccionCristales === op.valor ? 'seleccionada' : ''}`}
                    onClick={() => handleChange('coleccionCristales', op.valor)}
                  >
                    {op.texto}
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Con qué pronombres te sentís cómodo/a?</label>
              <div className="opciones-grupo">
                {[
                  { valor: 'ella', texto: 'Ella' },
                  { valor: 'el', texto: 'Él' },
                  { valor: 'elle', texto: 'Elle' },
                  { valor: 'no-decir', texto: 'Prefiero no decir' }
                ].map(op => (
                  <button
                    key={op.valor}
                    type="button"
                    className={`opcion ${datos.pronombres === op.valor ? 'seleccionada' : ''}`}
                    onClick={() => handleChange('pronombres', op.valor)}
                  >
                    {op.texto}
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                value={datos.fechaNacimiento}
                onChange={e => handleChange('fechaNacimiento', e.target.value)}
              />
              <span className="campo-nota">Para calcular tu signo y número de vida</span>
            </div>

            <div className="navegacion">
              <button className="btn-anterior" onClick={() => setPaso(3)}>Anterior</button>
              <button className="btn-siguiente" onClick={() => setPaso(5)}>Siguiente</button>
            </div>
          </div>
        )}

        {/* PASO 5: FINALIZACIÓN */}
        {paso === 5 && (
          <div className="paso-contenido animate-fade">
            <h2>¡Casi listo!</h2>
            <p className="subtitulo">Una última pregunta para personalizar tu experiencia</p>

            <div className="campo">
              <label>¿Cuál es tu mayor deseo o intención al unirte al Círculo?</label>
              <textarea
                value={datos.objetivoPrincipal}
                onChange={e => handleChange('objetivoPrincipal', e.target.value)}
                placeholder="Contanos qué buscás, qué esperás encontrar, qué momento estás atravesando..."
                rows={4}
              />
            </div>

            <div className="resumen-box">
              <h3>Tu perfil mágico</h3>
              <div className="resumen-items">
                {datos.atraccionPrincipal.length > 0 && (
                  <p><strong>Te atrae:</strong> {datos.atraccionPrincipal.join(', ')}</p>
                )}
                {datos.queBusca.length > 0 && (
                  <p><strong>Buscás:</strong> {datos.queBusca.join(', ')}</p>
                )}
                {datos.experienciaEspiritual && (
                  <p><strong>Experiencia:</strong> {datos.experienciaEspiritual}</p>
                )}
              </div>
            </div>

            <div className="navegacion">
              <button className="btn-anterior" onClick={() => setPaso(4)}>Anterior</button>
              <button
                className="btn-finalizar"
                onClick={handleFinalizar}
                disabled={guardando}
              >
                {guardando ? (
                  <span className="loading">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                ) : (
                  '✨ Entrar al Círculo'
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
          background: radial-gradient(ellipse at 30% 20%, rgba(107, 33, 168, 0.15) 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                      linear-gradient(180deg, #050508 0%, #0a0a0a 100%);
          padding: 40px 20px;
          font-family: 'Cormorant Garamond', serif;
        }
        .contenedor {
          width: 100%;
          max-width: 650px;
          background: rgba(20, 20, 25, 0.95);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .pasos-indicador {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 40px;
        }
        .paso-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }
        .paso-dot.activo {
          background: rgba(212, 175, 55, 0.2);
          color: #d4af37;
        }
        .paso-dot.actual {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
        }
        .animate-fade {
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .paso-contenido h2 {
          font-family: 'Tangerine', cursive;
          font-size: 48px;
          color: #d4af37;
          text-align: center;
          margin-bottom: 10px;
        }
        .subtitulo {
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
          margin-bottom: 35px;
        }
        .campo {
          margin-bottom: 25px;
        }
        .campo label {
          display: block;
          color: #FDF8F0;
          font-size: 16px;
          margin-bottom: 12px;
        }
        .campo input[type="text"],
        .campo input[type="date"],
        .campo textarea,
        .select-campo {
          width: 100%;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          color: #FDF8F0;
          font-size: 16px;
          font-family: 'Cormorant Garamond', serif;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .campo input:focus,
        .campo textarea:focus,
        .select-campo:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
        }
        .campo-nota {
          display: block;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 8px;
        }

        /* Opciones grupo horizontal */
        .opciones-grupo {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .opcion {
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 25px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-family: 'Cormorant Garamond', serif;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .opcion:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .opcion.seleccionada {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          border-color: #d4af37;
          font-weight: 600;
        }

        /* Opciones vertical */
        .opciones-vertical {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .opcion-vertical {
          padding: 15px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 15px;
          font-family: 'Cormorant Garamond', serif;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }
        .opcion-vertical:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .opcion-vertical.seleccionada {
          background: rgba(212, 175, 55, 0.15);
          border-color: #d4af37;
          color: #d4af37;
        }

        /* Opciones cards (para intereses) */
        .opciones-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .opciones-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .opcion-card {
          padding: 15px 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Cormorant Garamond', serif;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .opcion-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        .opcion-card.seleccionada {
          background: rgba(212, 175, 55, 0.2);
          border-color: #d4af37;
          color: #d4af37;
        }
        .opcion-card-emoji {
          font-size: 24px;
        }
        .opcion-card-titulo {
          font-size: 13px;
          font-weight: 600;
        }
        .opcion-card-desc {
          font-size: 11px;
          opacity: 0.6;
        }

        .opcion-tag {
          padding: 10px 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          font-family: 'Cormorant Garamond', serif;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .opcion-tag:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .opcion-tag.seleccionada {
          background: rgba(212, 175, 55, 0.2);
          border-color: #d4af37;
          color: #d4af37;
        }

        /* Opciones visuales (para nivel adquisitivo) */
        .opciones-visual {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .opcion-visual {
          padding: 20px 15px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Cormorant Garamond', serif;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }
        .opcion-visual:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-3px);
        }
        .opcion-visual.seleccionada {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1));
          border-color: #d4af37;
        }
        .opcion-visual-icono {
          font-size: 28px;
        }
        .opcion-visual-texto {
          font-size: 14px;
          font-weight: 600;
          color: #FDF8F0;
        }
        .opcion-visual.seleccionada .opcion-visual-texto {
          color: #d4af37;
        }
        .opcion-visual-desc {
          font-size: 11px;
          opacity: 0.6;
        }

        /* Opciones rango (para inversión) */
        .opciones-rango {
          display: flex;
          gap: 10px;
        }
        .opcion-rango {
          flex: 1;
          padding: 15px 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-family: 'Cormorant Garamond', serif;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .opcion-rango::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: var(--fill-width);
          height: 3px;
          background: linear-gradient(90deg, #d4af37, #f4d03f);
          opacity: 0.3;
        }
        .opcion-rango:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .opcion-rango.seleccionada {
          background: rgba(212, 175, 55, 0.15);
          border-color: #d4af37;
          color: #d4af37;
        }
        .opcion-rango.seleccionada::before {
          opacity: 1;
        }

        /* Resumen box */
        .resumen-box {
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 15px;
          padding: 20px;
          margin: 25px 0;
        }
        .resumen-box h3 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          font-size: 16px;
          margin: 0 0 15px;
        }
        .resumen-items p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin: 8px 0;
        }
        .resumen-items strong {
          color: #FDF8F0;
        }

        /* Navegación */
        .navegacion {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          gap: 15px;
        }
        .btn-anterior {
          padding: 15px 30px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 25px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-family: 'Cinzel', serif;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-anterior:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
        .btn-siguiente,
        .btn-finalizar {
          flex: 1;
          padding: 15px 30px;
          background: linear-gradient(135deg, #d4af37, #b8972e);
          border: none;
          border-radius: 25px;
          color: #0a0a0a;
          font-size: 14px;
          font-family: 'Cinzel', serif;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-siguiente:disabled,
        .btn-finalizar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-siguiente:not(:disabled):hover,
        .btn-finalizar:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        /* Loading animation */
        .loading {
          display: flex;
          gap: 4px;
          justify-content: center;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: #0a0a0a;
          border-radius: 50%;
          animation: bounce 0.6s infinite alternate;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          to { transform: translateY(-5px); }
        }

        @media (max-width: 600px) {
          .contenedor { padding: 30px 20px; }
          .paso-contenido h2 { font-size: 38px; }
          .pasos-indicador { gap: 10px; }
          .paso-dot { width: 35px; height: 35px; font-size: 12px; }
          .opciones-grid { grid-template-columns: repeat(2, 1fr); }
          .opciones-grid-3 { grid-template-columns: repeat(2, 1fr); }
          .opciones-visual { grid-template-columns: 1fr; }
          .opciones-rango { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
