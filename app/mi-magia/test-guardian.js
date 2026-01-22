'use client';
import { useState, useEffect, useRef } from 'react';
import { WORDPRESS_URL } from '@/lib/config/urls';

// Componente Test del Guardian Evolutivo - Chat con Tito
export default function TestGuardian({ usuario, onComplete }) {
  const [paso, setPaso] = useState('intro'); // intro, chat, procesando, resultado
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [mensajes, setMensajes] = useState([]);
  const [typing, setTyping] = useState(false);
  const [textoLibre, setTextoLibre] = useState('');
  const [valorEscala, setValorEscala] = useState(5); // Para escala numérica
  const [resultado, setResultado] = useState(null);
  const chatRef = useRef(null);

  // Cargar preguntas al inicio
  useEffect(() => {
    cargarPreguntas();
  }, []);

  // Auto-scroll al ultimo mensaje
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes, typing]);

  const cargarPreguntas = async () => {
    try {
      const res = await fetch('/api/test-guardian');
      const data = await res.json();
      if (data.success) {
        setPreguntas(data.preguntas);
      }
    } catch (error) {
      console.error('Error cargando preguntas:', error);
    }
  };

  const iniciarTest = () => {
    setPaso('chat');
    // Mensaje inicial de Tito
    setTimeout(() => {
      agregarMensajeTito('Hola ' + (usuario?.nombrePreferido || usuario?.nombre || '') + '... Soy Tito.');
      setTimeout(() => {
        agregarMensajeTito('Voy a hacerte algunas preguntas para ayudarte a encontrar al guardian que resuena con tu energia.');
        setTimeout(() => {
          mostrarPregunta(0);
        }, 1500);
      }, 2000);
    }, 500);
  };

  const agregarMensajeTito = (texto) => {
    setMensajes(prev => [...prev, { tipo: 'tito', texto }]);
  };

  const agregarMensajeUsuario = (texto) => {
    setMensajes(prev => [...prev, { tipo: 'usuario', texto }]);
  };

  const mostrarPregunta = (index) => {
    if (index >= preguntas.length) {
      finalizarTest();
      return;
    }

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      agregarMensajeTito(preguntas[index].mensaje);
      setPreguntaActual(index);
    }, 1200);
  };

  const responderSeleccion = (opcion) => {
    const pregunta = preguntas[preguntaActual];

    // Guardar respuesta
    const nuevasRespuestas = {
      ...respuestas,
      [pregunta.id]: opcion
    };
    setRespuestas(nuevasRespuestas);

    // Guardar en localStorage
    localStorage.setItem('duendes_test_guardian', JSON.stringify({
      estado: 'en_progreso',
      ultimaPregunta: preguntaActual + 1,
      respuestas: nuevasRespuestas
    }));

    // Mostrar respuesta del usuario
    agregarMensajeUsuario(opcion.texto);

    // Feedback de Tito
    setTimeout(() => {
      const feedbacks = [
        'Mmm... interesante.',
        'Entiendo...',
        'Siento algo ahi.',
        'Ya veo...',
        'Gracias por compartirlo.'
      ];
      agregarMensajeTito(feedbacks[Math.floor(Math.random() * feedbacks.length)]);

      // Siguiente pregunta
      setTimeout(() => {
        mostrarPregunta(preguntaActual + 1);
      }, 1000);
    }, 800);
  };

  const responderTextoLibre = () => {
    if (!textoLibre.trim()) return;

    const pregunta = preguntas[preguntaActual];

    // Guardar respuesta
    const nuevasRespuestas = {
      ...respuestas,
      [pregunta.id]: { texto: textoLibre, tipo: 'texto_libre' }
    };
    setRespuestas(nuevasRespuestas);

    // Guardar en localStorage
    localStorage.setItem('duendes_test_guardian', JSON.stringify({
      estado: 'en_progreso',
      ultimaPregunta: preguntaActual + 1,
      respuestas: nuevasRespuestas
    }));

    // Mostrar respuesta
    agregarMensajeUsuario(textoLibre);
    setTextoLibre('');

    // Feedback empatico
    setTimeout(() => {
      const feedbacks = [
        'Gracias por abrirte asi.',
        'Te escucho.',
        'Eso tiene mucho peso.',
        'Puedo sentir lo que decis.'
      ];
      agregarMensajeTito(feedbacks[Math.floor(Math.random() * feedbacks.length)]);

      setTimeout(() => {
        mostrarPregunta(preguntaActual + 1);
      }, 1200);
    }, 1000);
  };

  // Responder escala numérica (1-10)
  const responderEscalaNumerica = () => {
    const pregunta = preguntas[preguntaActual];

    // Guardar respuesta
    const nuevasRespuestas = {
      ...respuestas,
      [pregunta.id]: { valor: valorEscala, tipo: 'escala_numerica' }
    };
    setRespuestas(nuevasRespuestas);

    // Guardar en localStorage
    localStorage.setItem('duendes_test_guardian', JSON.stringify({
      estado: 'en_progreso',
      ultimaPregunta: preguntaActual + 1,
      respuestas: nuevasRespuestas
    }));

    // Mostrar respuesta
    agregarMensajeUsuario(`${valorEscala}/10`);

    // Reset para próxima pregunta
    setValorEscala(5);

    // Feedback
    setTimeout(() => {
      const feedbacks = valorEscala >= 7
        ? ['Siento esa carga...', 'Entiendo...', 'Te escucho.']
        : ['Ya veo...', 'Mmm...', 'Entiendo.'];
      agregarMensajeTito(feedbacks[Math.floor(Math.random() * feedbacks.length)]);

      setTimeout(() => {
        mostrarPregunta(preguntaActual + 1);
      }, 1000);
    }, 800);
  };

  const finalizarTest = async () => {
    setPaso('procesando');
    agregarMensajeTito('Dame un momento... estoy conectando con tu energia...');

    try {
      const res = await fetch('/api/test-guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario?.email,
          nombre: usuario?.nombrePreferido || usuario?.nombre,
          respuestas
        })
      });

      const data = await res.json();

      if (data.success) {
        setResultado(data.resultado);
        setPaso('resultado');

        // Guardar en localStorage
        localStorage.setItem('duendes_test_guardian', JSON.stringify({
          estado: 'completado',
          resultado: data.resultado
        }));

        // Notificar al componente padre
        if (onComplete) onComplete(data.resultado);
      } else {
        agregarMensajeTito('Hubo un problema... pero tu energia quedo registrada. Intenta de nuevo mas tarde.');
      }
    } catch (error) {
      console.error('Error finalizando test:', error);
      agregarMensajeTito('Algo salio mal. Tu energia es fuerte, intenta de nuevo.');
    }
  };

  const pregunta = preguntas[preguntaActual];

  return (
    <div className="test-guardian-container">
      <style>{estilosTestGuardian}</style>

      {/* INTRO */}
      {paso === 'intro' && (
        <div className="test-intro">
          <div className="intro-visual">
            <span className="intro-icono">🔮</span>
            <div className="intro-particulas"></div>
          </div>
          <h2>Test del Guardian</h2>
          <p className="intro-desc">
            Descubri que guardian resuena con tu energia. Solo toma 2 minutos.
          </p>
          <p className="intro-nota">
            No hay respuestas correctas ni incorrectas. Solo honestidad.
          </p>
          <button onClick={iniciarTest} className="btn-comenzar">
            Comenzar ✨
          </button>
        </div>
      )}

      {/* CHAT */}
      {(paso === 'chat' || paso === 'procesando') && (
        <div className="test-chat">
          <div className="chat-header">
            <img src="/tito-avatar.png" alt="Tito" className="tito-avatar" onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="chat-header-info">
              <span className="chat-header-nombre">Tito</span>
              <span className="chat-header-status">
                {typing ? 'escribiendo...' : 'conectado'}
              </span>
            </div>
            <div className="chat-progress">
              <div
                className="chat-progress-bar"
                style={{ width: `${((preguntaActual + 1) / preguntas.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="chat-mensajes" ref={chatRef}>
            {mensajes.map((msg, i) => (
              <div key={i} className={`mensaje mensaje-${msg.tipo}`}>
                {msg.tipo === 'tito' && <span className="msg-avatar">🧙</span>}
                <div className="msg-burbuja">{msg.texto}</div>
              </div>
            ))}

            {typing && (
              <div className="mensaje mensaje-tito">
                <span className="msg-avatar">🧙</span>
                <div className="msg-burbuja typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
          </div>

          {/* Opciones de respuesta */}
          {paso === 'chat' && pregunta && !typing && (
            <div className="chat-input-area">
              {pregunta.tipo === 'seleccion' && (
                <div className="opciones-container">
                  {pregunta.opciones.map((op, i) => (
                    <button
                      key={i}
                      className="opcion-btn"
                      onClick={() => responderSeleccion(op)}
                    >
                      {op.texto}
                    </button>
                  ))}
                </div>
              )}

              {pregunta.tipo === 'escala' && (
                <div className="escala-container">
                  {pregunta.opciones.map((op, i) => (
                    <button
                      key={i}
                      className="escala-btn"
                      onClick={() => responderSeleccion(op)}
                    >
                      {op.texto}
                    </button>
                  ))}
                </div>
              )}

              {pregunta.tipo === 'escala_numerica' && (
                <div className="escala-numerica-container">
                  <div className="escala-labels">
                    <span>{pregunta.minLabel || '1'}</span>
                    <span>{pregunta.maxLabel || '10'}</span>
                  </div>
                  <input
                    type="range"
                    min={pregunta.min || 1}
                    max={pregunta.max || 10}
                    value={valorEscala}
                    onChange={(e) => setValorEscala(parseInt(e.target.value))}
                    className="escala-slider"
                  />
                  <div className="escala-valor">{valorEscala}</div>
                  <button
                    className="btn-enviar"
                    onClick={responderEscalaNumerica}
                  >
                    Confirmar →
                  </button>
                </div>
              )}

              {pregunta.tipo === 'texto_libre' && (
                <div className="texto-libre-container">
                  <textarea
                    value={textoLibre}
                    onChange={(e) => setTextoLibre(e.target.value)}
                    placeholder={pregunta.placeholder || 'Escribi lo que sientas...'}
                    rows={3}
                  />
                  <button
                    className="btn-enviar"
                    onClick={responderTextoLibre}
                    disabled={!textoLibre.trim()}
                  >
                    Enviar →
                  </button>
                </div>
              )}
            </div>
          )}

          {paso === 'procesando' && (
            <div className="procesando-container">
              <div className="procesando-spinner"></div>
              <p>Conectando con tu energia...</p>
            </div>
          )}
        </div>
      )}

      {/* RESULTADO */}
      {paso === 'resultado' && resultado && (
        <div className="test-resultado">
          <div className="resultado-header" style={{ background: `linear-gradient(135deg, ${resultado.revelacion?.colorEnergetico || '#d4af37'}22, #1a1a1a)` }}>
            <span className="resultado-emoji">✨</span>
            <h2>{resultado.revelacion?.titulo}</h2>
            <p className="resultado-subtitulo">{resultado.revelacion?.subtitulo}</p>
          </div>

          <div className="resultado-mensaje">
            <p>{resultado.revelacion?.mensaje}</p>
          </div>

          <div className="resultado-guardian-mensaje">
            <span className="guardian-icono">🧙</span>
            <p>"{resultado.revelacion?.mensajeGuardian}"</p>
          </div>

          {resultado.revelacion?.ritualSugerido && (
            <div className="resultado-ritual">
              <h4>✦ Ritual Sugerido</h4>
              <p>{resultado.revelacion.ritualSugerido}</p>
            </div>
          )}

          {resultado.perfilPsicologico && (
            <div className="resultado-perfil">
              <h4>✦ Tu Perfil Energético</h4>
              <div className="perfil-grid">
                <div className="perfil-item">
                  <span className="perfil-label">Vulnerabilidad</span>
                  <span className={`perfil-value vuln-${resultado.perfilPsicologico.vulnerabilidad?.nivel}`}>
                    {resultado.perfilPsicologico.vulnerabilidad?.nivel}
                  </span>
                </div>
                <div className="perfil-item">
                  <span className="perfil-label">Dolor principal</span>
                  <span className="perfil-value">
                    {resultado.perfilPsicologico.dolor_principal?.tipo}
                  </span>
                </div>
                <div className="perfil-item">
                  <span className="perfil-label">Estilo decisión</span>
                  <span className="perfil-value">
                    {resultado.perfilPsicologico.estilo_decision?.tipo}
                  </span>
                </div>
                <div className="perfil-item">
                  <span className="perfil-label">Creencias</span>
                  <span className="perfil-value">
                    {resultado.perfilPsicologico.creencias?.tipo}
                  </span>
                </div>
              </div>
            </div>
          )}

          {resultado.productosRecomendados?.length > 0 && (
            <div className="resultado-recomendados">
              <h4>Guardianes que Resuenan Contigo</h4>
              <div className="recomendados-lista">
                {resultado.productosRecomendados.map((prod, i) => (
                  <div key={i} className="recomendado-card">
                    <div className="recomendado-match">{prod.matchScore}% match</div>
                    <h5>{prod.nombre}</h5>
                    <p>{prod.razon}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="btn-explorar" onClick={() => window.open(`${WORDPRESS_URL}/tienda/`, '_blank')}>
            Explorar Guardianes →
          </button>
        </div>
      )}
    </div>
  );
}

// Estilos del componente
const estilosTestGuardian = `
  .test-guardian-container {
    max-width: 600px;
    margin: 0 auto;
    min-height: 500px;
  }

  /* INTRO */
  .test-intro {
    text-align: center;
    padding: 50px 30px;
  }
  .test-intro .intro-visual {
    position: relative;
    margin-bottom: 30px;
  }
  .test-intro .intro-icono {
    font-size: 4rem;
    display: block;
    animation: float 3s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .test-intro h2 {
    font-family: 'Cinzel', serif;
    color: #fff;
    font-size: 1.8rem;
    margin: 0 0 15px;
  }
  .test-intro .intro-desc {
    color: rgba(255,255,255,0.8);
    font-size: 1.1rem;
    margin: 0 0 10px;
  }
  .test-intro .intro-nota {
    color: rgba(255,255,255,0.5);
    font-size: 0.9rem;
    font-style: italic;
    margin: 0 0 30px;
  }
  .test-intro .btn-comenzar {
    background: linear-gradient(135deg, #d4af37, #c9a227);
    color: #0a0a0a;
    border: none;
    padding: 16px 45px;
    border-radius: 50px;
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  .test-intro .btn-comenzar:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(212,175,55,0.3);
  }

  /* CHAT */
  .test-chat {
    display: flex;
    flex-direction: column;
    height: 550px;
    background: #1a1a1a;
    border-radius: 16px;
    overflow: hidden;
  }
  .chat-header {
    padding: 15px 20px;
    background: #111;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #333;
  }
  .tito-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #d4af37;
  }
  .chat-header-info {
    flex: 1;
  }
  .chat-header-nombre {
    display: block;
    color: #fff;
    font-weight: 600;
  }
  .chat-header-status {
    color: #56ab91;
    font-size: 0.8rem;
  }
  .chat-progress {
    width: 80px;
    height: 4px;
    background: #333;
    border-radius: 2px;
    overflow: hidden;
  }
  .chat-progress-bar {
    height: 100%;
    background: #d4af37;
    transition: width 0.3s;
  }

  .chat-mensajes {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .mensaje {
    display: flex;
    gap: 10px;
    max-width: 85%;
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .mensaje-tito {
    align-self: flex-start;
  }
  .mensaje-usuario {
    align-self: flex-end;
    flex-direction: row-reverse;
  }
  .msg-avatar {
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  .msg-burbuja {
    padding: 12px 16px;
    border-radius: 16px;
    line-height: 1.5;
  }
  .mensaje-tito .msg-burbuja {
    background: linear-gradient(135deg, #2a2a2a, #222);
    color: #fff;
    border-radius: 16px 16px 16px 4px;
  }
  .mensaje-usuario .msg-burbuja {
    background: #d4af37;
    color: #0a0a0a;
    border-radius: 16px 16px 4px 16px;
  }

  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 12px 18px !important;
  }
  .typing-indicator .dot {
    width: 8px;
    height: 8px;
    background: #d4af37;
    border-radius: 50%;
    animation: bounce 1.4s infinite;
  }
  .typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-8px); }
  }

  .chat-input-area {
    padding: 15px;
    border-top: 1px solid #333;
    background: #111;
  }
  .opciones-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .opcion-btn {
    background: #222;
    border: 1px solid #444;
    color: #fff;
    padding: 14px 18px;
    border-radius: 12px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
  }
  .opcion-btn:hover {
    border-color: #d4af37;
    background: #2a2a2a;
  }

  .texto-libre-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .texto-libre-container textarea {
    background: #222;
    border: 1px solid #444;
    color: #fff;
    padding: 14px;
    border-radius: 12px;
    resize: none;
    font-family: inherit;
    font-size: 0.95rem;
  }
  .texto-libre-container textarea:focus {
    outline: none;
    border-color: #d4af37;
  }
  .btn-enviar {
    align-self: flex-end;
    background: #d4af37;
    color: #0a0a0a;
    border: none;
    padding: 12px 25px;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-enviar:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn-enviar:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  /* ESCALA VISUAL (4 opciones horizontales) */
  .escala-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .escala-btn {
    background: #222;
    border: 1px solid #444;
    color: #fff;
    padding: 14px 12px;
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
  }
  .escala-btn:hover {
    border-color: #d4af37;
    background: #2a2a2a;
  }

  /* ESCALA NUMÉRICA (slider 1-10) */
  .escala-numerica-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 10px 0;
  }
  .escala-labels {
    display: flex;
    justify-content: space-between;
    color: rgba(255,255,255,0.6);
    font-size: 0.85rem;
  }
  .escala-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(to right, #56ab91, #d4af37, #e75480);
    outline: none;
  }
  .escala-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #d4af37;
    cursor: pointer;
    border: 3px solid #fff;
    box-shadow: 0 2px 10px rgba(212,175,55,0.4);
  }
  .escala-slider::-moz-range-thumb {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #d4af37;
    cursor: pointer;
    border: 3px solid #fff;
  }
  .escala-valor {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    color: #d4af37;
    font-family: 'Cinzel', serif;
  }

  .procesando-container {
    padding: 40px;
    text-align: center;
  }
  .procesando-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #333;
    border-top-color: #d4af37;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .procesando-container p {
    color: rgba(255,255,255,0.7);
    font-style: italic;
  }

  /* RESULTADO */
  .test-resultado {
    padding: 30px;
  }
  .resultado-header {
    text-align: center;
    padding: 40px 30px;
    border-radius: 16px;
    margin-bottom: 25px;
  }
  .resultado-emoji {
    font-size: 3rem;
    display: block;
    margin-bottom: 15px;
  }
  .resultado-header h2 {
    font-family: 'Cinzel', serif;
    color: #fff;
    font-size: 1.6rem;
    margin: 0 0 8px;
  }
  .resultado-subtitulo {
    color: rgba(255,255,255,0.7);
    font-size: 1rem;
    margin: 0;
  }

  .resultado-mensaje {
    background: #1f1f1f;
    padding: 25px;
    border-radius: 12px;
    margin-bottom: 20px;
  }
  .resultado-mensaje p {
    color: rgba(255,255,255,0.9);
    line-height: 1.7;
    margin: 0;
    font-size: 1.05rem;
  }

  .resultado-guardian-mensaje {
    display: flex;
    gap: 15px;
    background: linear-gradient(135deg, rgba(212,175,55,0.1), #1a1a1a);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(212,175,55,0.2);
    margin-bottom: 20px;
  }
  .guardian-icono {
    font-size: 2rem;
    flex-shrink: 0;
  }
  .resultado-guardian-mensaje p {
    color: #d4af37;
    font-style: italic;
    margin: 0;
    line-height: 1.6;
  }

  .resultado-ritual {
    background: #1a1a1a;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 25px;
  }
  .resultado-ritual h4 {
    color: #d4af37;
    margin: 0 0 10px;
    font-size: 1rem;
  }
  .resultado-ritual p {
    color: rgba(255,255,255,0.8);
    margin: 0;
    line-height: 1.6;
  }

  .resultado-recomendados {
    margin-bottom: 30px;
  }
  .resultado-recomendados h4 {
    color: #fff;
    margin: 0 0 15px;
    font-size: 1.1rem;
  }
  .recomendados-lista {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .recomendado-card {
    background: #1f1f1f;
    padding: 18px;
    border-radius: 12px;
    border: 1px solid #333;
    position: relative;
  }
  .recomendado-match {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #d4af37;
    color: #0a0a0a;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  .recomendado-card h5 {
    color: #fff;
    margin: 0 0 6px;
    font-size: 1rem;
  }
  .recomendado-card p {
    color: rgba(255,255,255,0.6);
    margin: 0;
    font-size: 0.9rem;
  }

  .btn-explorar {
    width: 100%;
    background: linear-gradient(135deg, #d4af37, #c9a227);
    color: #0a0a0a;
    border: none;
    padding: 18px;
    border-radius: 12px;
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  .btn-explorar:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(212,175,55,0.3);
  }

  /* PERFIL PSICOLÓGICO */
  .resultado-perfil {
    background: #1a1a1a;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 25px;
    border: 1px solid rgba(212,175,55,0.2);
  }
  .resultado-perfil h4 {
    color: #d4af37;
    margin: 0 0 15px;
    font-size: 1rem;
  }
  .perfil-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .perfil-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .perfil-label {
    color: rgba(255,255,255,0.5);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .perfil-value {
    color: #fff;
    font-size: 0.95rem;
    text-transform: capitalize;
  }
  .vuln-alta { color: #e75480; }
  .vuln-media { color: #d4af37; }
  .vuln-baja { color: #56ab91; }
`;
