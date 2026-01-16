'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ONBOARDING DEL CÍRCULO DE DUENDES
// Formulario de primera vez para conocer al miembro
// ═══════════════════════════════════════════════════════════════════════════════

export default function Onboarding({ email, onComplete }) {
  const [paso, setPaso] = useState(1);
  const [guardando, setGuardando] = useState(false);
  const [datos, setDatos] = useState({
    nombrePreferido: '',
    pronombres: '',
    fechaNacimiento: '',
    comoLlegaste: '',
    guardiansAdoptados: '',
    areasInteres: [],
    practicaEspiritual: '',
    coleccionCristales: '',
    cursosAnteriores: '',
    tipoContenido: [],
    objetivoPrincipal: ''
  });

  const totalPasos = 4;

  function updateDato(campo, valor) {
    setDatos(prev => ({ ...prev, [campo]: valor }));
  }

  function toggleArray(campo, valor) {
    setDatos(prev => {
      const arr = prev[campo] || [];
      if (arr.includes(valor)) {
        return { ...prev, [campo]: arr.filter(v => v !== valor) };
      } else {
        return { ...prev, [campo]: [...arr, valor] };
      }
    });
  }

  async function finalizarOnboarding() {
    setGuardando(true);
    try {
      const res = await fetch('/api/circulo/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          perfil: {
            ...datos,
            onboardingCompletado: true,
            fechaOnboarding: new Date().toISOString()
          }
        })
      });

      if (res.ok) {
        onComplete(datos);
      }
    } catch (error) {
      console.error('Error guardando perfil:', error);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="onboarding">
      <div className="onboarding-container">
        {/* Progress */}
        <div className="progreso">
          <div className="progreso-bar">
            <div className="progreso-fill" style={{ width: `${(paso / totalPasos) * 100}%` }}></div>
          </div>
          <span className="progreso-texto">Paso {paso} de {totalPasos}</span>
        </div>

        {/* Paso 1: Identidad */}
        {paso === 1 && (
          <div className="paso-contenido">
            <h2>Bienvenido/a al Círculo</h2>
            <p className="subtitulo">Queremos conocerte para personalizar tu experiencia</p>

            <div className="campo">
              <label>¿Cómo te gustaría que te llamemos?</label>
              <input
                type="text"
                value={datos.nombrePreferido}
                onChange={(e) => updateDato('nombrePreferido', e.target.value)}
                placeholder="Tu nombre o apodo"
              />
            </div>

            <div className="campo">
              <label>¿Qué pronombres usás?</label>
              <div className="opciones-grid">
                {[
                  { id: 'ella', label: 'Ella' },
                  { id: 'el', label: 'Él' },
                  { id: 'elle', label: 'Elle' },
                  { id: 'no-decir', label: 'Prefiero no decir' }
                ].map(op => (
                  <button
                    key={op.id}
                    className={`opcion-btn ${datos.pronombres === op.id ? 'selected' : ''}`}
                    onClick={() => updateDato('pronombres', op.id)}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>Fecha de nacimiento</label>
              <p className="campo-hint">Para tu carta astral y numerología personal</p>
              <input
                type="date"
                value={datos.fechaNacimiento}
                onChange={(e) => updateDato('fechaNacimiento', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Paso 2: Conexión con duendes */}
        {paso === 2 && (
          <div className="paso-contenido">
            <h2>Tu conexión con los duendes</h2>
            <p className="subtitulo">Contanos sobre tu camino hasta acá</p>

            <div className="campo">
              <label>¿Cómo llegaste al mundo de los duendes?</label>
              <div className="opciones-vertical">
                {[
                  { id: 'curiosidad', label: 'Curiosidad, vi algo que me llamó' },
                  { id: 'busqueda', label: 'Estaba buscando algo espiritual' },
                  { id: 'regalo', label: 'Me regalaron un guardián' },
                  { id: 'coleccion', label: 'Colecciono figuras mágicas' },
                  { id: 'recomendacion', label: 'Me lo recomendaron' }
                ].map(op => (
                  <button
                    key={op.id}
                    className={`opcion-btn-vertical ${datos.comoLlegaste === op.id ? 'selected' : ''}`}
                    onClick={() => updateDato('comoLlegaste', op.id)}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Cuántos guardianes tenés adoptados?</label>
              <div className="opciones-grid">
                {[
                  { id: '0', label: 'Ninguno aún' },
                  { id: '1-3', label: '1 a 3' },
                  { id: '4-10', label: '4 a 10' },
                  { id: 'mas-10', label: 'Más de 10' }
                ].map(op => (
                  <button
                    key={op.id}
                    className={`opcion-btn ${datos.guardiansAdoptados === op.id ? 'selected' : ''}`}
                    onClick={() => updateDato('guardiansAdoptados', op.id)}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Paso 3: Intereses y práctica */}
        {paso === 3 && (
          <div className="paso-contenido">
            <h2>Tus intereses</h2>
            <p className="subtitulo">Así podemos mostrarte lo que más te resuena</p>

            <div className="campo">
              <label>¿Qué áreas de tu vida querés trabajar? (elegí todas las que apliquen)</label>
              <div className="opciones-grid multi">
                {[
                  { id: 'abundancia', label: '✨ Abundancia' },
                  { id: 'amor', label: '💕 Amor' },
                  { id: 'proteccion', label: '🛡️ Protección' },
                  { id: 'sanacion', label: '💚 Sanación' },
                  { id: 'claridad', label: '🔮 Claridad' },
                  { id: 'creatividad', label: '🎨 Creatividad' }
                ].map(op => (
                  <button
                    key={op.id}
                    className={`opcion-btn ${datos.areasInteres.includes(op.id) ? 'selected' : ''}`}
                    onClick={() => toggleArray('areasInteres', op.id)}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Con qué frecuencia practicás rituales o meditación?</label>
              <div className="opciones-vertical">
                {[
                  { id: 'nunca', label: 'Nunca, pero quiero empezar' },
                  { id: 'ocasional', label: 'De vez en cuando' },
                  { id: 'regular', label: 'Regularmente (semanal)' },
                  { id: 'diario', label: 'Es parte de mi rutina diaria' }
                ].map(op => (
                  <button
                    key={op.id}
                    className={`opcion-btn-vertical ${datos.practicaEspiritual === op.id ? 'selected' : ''}`}
                    onClick={() => updateDato('practicaEspiritual', op.id)}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Coleccionás cristales u objetos mágicos?</label>
              <div className="opciones-grid">
                {[
                  { id: 'no', label: 'No' },
                  { id: 'algunos', label: 'Algunos' },
                  { id: 'coleccion', label: 'Tengo una colección' },
                  { id: 'apasionado', label: 'Es mi pasión' }
                ].map(op => (
                  <button
                    key={op.id}
                    className={`opcion-btn ${datos.coleccionCristales === op.id ? 'selected' : ''}`}
                    onClick={() => updateDato('coleccionCristales', op.id)}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Paso 4: Experiencia previa y objetivos */}
        {paso === 4 && (
          <div className="paso-contenido">
            <h2>Último paso</h2>
            <p className="subtitulo">Para darte la mejor experiencia posible</p>

            <div className="campo">
              <label>¿Has tomado cursos o talleres espirituales antes?</label>
              <div className="opciones-vertical">
                {[
                  { id: 'no', label: 'No, esto es nuevo para mí' },
                  { id: 'gratis', label: 'Sí, contenido gratuito online' },
                  { id: 'pagos', label: 'Sí, cursos online pagos' },
                  { id: 'presencial', label: 'Sí, talleres presenciales' },
                  { id: 'varios', label: 'Varios de todo tipo' }
                ].map(op => (
                  <button
                    key={op.id}
                    className={`opcion-btn-vertical ${datos.cursosAnteriores === op.id ? 'selected' : ''}`}
                    onClick={() => updateDato('cursosAnteriores', op.id)}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Qué tipo de contenido te interesa más? (elegí hasta 3)</label>
              <div className="opciones-grid multi">
                {[
                  { id: 'lecturas', label: '🔮 Lecturas' },
                  { id: 'rituales', label: '🕯️ Rituales' },
                  { id: 'meditaciones', label: '🧘 Meditaciones' },
                  { id: 'diy', label: '✂️ DIY/Manualidades' },
                  { id: 'comunidad', label: '👥 Comunidad' },
                  { id: 'cursos', label: '📚 Cursos' }
                ].map(op => (
                  <button
                    key={op.id}
                    className={`opcion-btn ${datos.tipoContenido.includes(op.id) ? 'selected' : ''}`}
                    onClick={() => toggleArray('tipoContenido', op.id)}
                    disabled={!datos.tipoContenido.includes(op.id) && datos.tipoContenido.length >= 3}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Cuál es tu objetivo principal en el Círculo?</label>
              <textarea
                value={datos.objetivoPrincipal}
                onChange={(e) => updateDato('objetivoPrincipal', e.target.value)}
                placeholder="Contanos qué esperás encontrar acá..."
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Navegación */}
        <div className="navegacion">
          {paso > 1 && (
            <button className="btn-nav btn-anterior" onClick={() => setPaso(paso - 1)}>
              ← Anterior
            </button>
          )}

          {paso < totalPasos ? (
            <button
              className="btn-nav btn-siguiente"
              onClick={() => setPaso(paso + 1)}
              disabled={paso === 1 && !datos.nombrePreferido}
            >
              Siguiente →
            </button>
          ) : (
            <button
              className="btn-nav btn-finalizar"
              onClick={finalizarOnboarding}
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : 'Entrar al Círculo ✨'}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .onboarding {
          min-height: 100vh;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(107, 33, 168, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, #050508 0%, #0a0a0a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          color: #ffffff;
        }

        .onboarding-container {
          width: 100%;
          max-width: 600px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 30px;
          padding: 40px;
        }

        /* Progreso */
        .progreso {
          margin-bottom: 40px;
        }

        .progreso-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progreso-fill {
          height: 100%;
          background: linear-gradient(90deg, #d4af37, #e8d5a3);
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        .progreso-texto {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        /* Contenido del paso */
        .paso-contenido {
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h2 {
          font-family: 'Tangerine', cursive;
          font-size: 48px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 10px;
          text-align: center;
        }

        .subtitulo {
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
          margin-bottom: 40px;
        }

        /* Campos */
        .campo {
          margin-bottom: 30px;
        }

        .campo label {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          color: #d4af37;
          margin-bottom: 12px;
          letter-spacing: 1px;
        }

        .campo-hint {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
          margin: -8px 0 12px;
        }

        input[type="text"],
        input[type="date"],
        textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 15px 20px;
          color: #ffffff;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        input:focus,
        textarea:focus {
          outline: none;
          border-color: rgba(212, 175, 55, 0.5);
          background: rgba(255, 255, 255, 0.08);
        }

        textarea {
          resize: none;
        }

        /* Opciones */
        .opciones-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .opciones-grid.multi {
          grid-template-columns: repeat(3, 1fr);
        }

        .opciones-vertical {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .opcion-btn,
        .opcion-btn-vertical {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          padding: 14px 18px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
        }

        .opcion-btn:hover:not(:disabled),
        .opcion-btn-vertical:hover:not(:disabled) {
          border-color: rgba(212, 175, 55, 0.4);
          background: rgba(212, 175, 55, 0.1);
        }

        .opcion-btn.selected,
        .opcion-btn-vertical.selected {
          background: rgba(212, 175, 55, 0.2);
          border-color: #d4af37;
          color: #d4af37;
        }

        .opcion-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Navegación */
        .navegacion {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-nav {
          padding: 15px 30px;
          border-radius: 30px;
          font-family: 'Cinzel', serif;
          font-size: 13px;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-anterior {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.6);
        }

        .btn-anterior:hover {
          border-color: rgba(255, 255, 255, 0.4);
          color: #ffffff;
        }

        .btn-siguiente,
        .btn-finalizar {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          border: none;
          color: #0a0a0a;
          font-weight: 600;
          margin-left: auto;
        }

        .btn-siguiente:hover:not(:disabled),
        .btn-finalizar:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        .btn-siguiente:disabled,
        .btn-finalizar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .onboarding-container {
            padding: 30px 20px;
          }

          h2 {
            font-size: 36px;
          }

          .opciones-grid {
            grid-template-columns: 1fr;
          }

          .opciones-grid.multi {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
