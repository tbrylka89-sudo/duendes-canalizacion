'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════════
// ASISTENTE DEL CÍRCULO
// Interfaz conversacional para gestionar todo el contenido
// ═══════════════════════════════════════════════════════════════════════════════

export default function AsistenteCirculo() {
  const router = useRouter();
  const [mensajes, setMensajes] = useState([
    {
      rol: 'asistente',
      contenido: 'Soy tu asistente para El Círculo. Decime qué necesitás y te guío paso a paso.\n\nPodés pedirme cosas como:\n• "Generá contenido para una semana"\n• "Cambiá el duende de la semana"\n• "Creá un curso sobre tarot"\n• "Mostrame el contenido de enero"',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [contexto, setContexto] = useState(null); // Para preguntas de seguimiento
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function enviarMensaje(e) {
    e?.preventDefault();
    if (!input.trim() || cargando) return;

    const mensajeUsuario = input.trim();
    setInput('');

    // Agregar mensaje del usuario
    setMensajes(prev => [...prev, {
      rol: 'usuario',
      contenido: mensajeUsuario,
      timestamp: new Date().toISOString()
    }]);

    setCargando(true);

    try {
      const res = await fetch('/api/admin/circulo/asistente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: mensajeUsuario,
          contexto,
          historial: mensajes.slice(-10) // Últimos 10 mensajes para contexto
        })
      });

      const data = await res.json();

      if (data.success) {
        setMensajes(prev => [...prev, {
          rol: 'asistente',
          contenido: data.respuesta,
          acciones: data.acciones,
          preview: data.preview,
          timestamp: new Date().toISOString()
        }]);

        if (data.contexto) {
          setContexto(data.contexto);
        } else {
          setContexto(null);
        }
      } else {
        setMensajes(prev => [...prev, {
          rol: 'asistente',
          contenido: `Hubo un error: ${data.error}`,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      setMensajes(prev => [...prev, {
        rol: 'asistente',
        contenido: `Error de conexión: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    }

    setCargando(false);
  }

  async function ejecutarAccion(accion) {
    setCargando(true);
    setMensajes(prev => [...prev, {
      rol: 'sistema',
      contenido: `Ejecutando: ${accion.label}...`,
      timestamp: new Date().toISOString()
    }]);

    try {
      const res = await fetch('/api/admin/circulo/asistente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ejecutarAccion: accion,
          contexto
        })
      });

      const data = await res.json();

      setMensajes(prev => [...prev, {
        rol: 'asistente',
        contenido: data.respuesta || 'Acción completada.',
        preview: data.preview,
        timestamp: new Date().toISOString()
      }]);

      setContexto(null);
    } catch (error) {
      setMensajes(prev => [...prev, {
        rol: 'asistente',
        contenido: `Error: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    }

    setCargando(false);
  }

  return (
    <div className="asistente-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo-icon">✦</div>
          <div>
            <h1 className="titulo">Asistente del Círculo</h1>
            <p className="subtitulo">Gestión conversacional de contenido</p>
          </div>
        </div>
        <button onClick={() => router.push('/admin/circulo')} className="btn-volver">
          Volver al Hub
        </button>
      </header>

      {/* Chat */}
      <main className="chat-container" ref={chatRef}>
        {mensajes.map((msg, i) => (
          <div key={i} className={`mensaje ${msg.rol}`}>
            {msg.rol === 'asistente' && (
              <div className="avatar-asistente">✦</div>
            )}
            <div className="mensaje-contenido">
              <div className="mensaje-texto" dangerouslySetInnerHTML={{
                __html: formatearMensaje(msg.contenido)
              }} />

              {/* Preview de contenido generado */}
              {msg.preview && (
                <div className="preview-box">
                  <div className="preview-header">Vista previa</div>
                  <div className="preview-content" dangerouslySetInnerHTML={{
                    __html: msg.preview
                  }} />
                </div>
              )}

              {/* Acciones disponibles */}
              {msg.acciones && msg.acciones.length > 0 && (
                <div className="acciones">
                  {msg.acciones.map((accion, j) => (
                    <button
                      key={j}
                      onClick={() => ejecutarAccion(accion)}
                      className="btn-accion"
                      disabled={cargando}
                    >
                      {accion.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {cargando && (
          <div className="mensaje asistente">
            <div className="avatar-asistente">✦</div>
            <div className="mensaje-contenido">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Input */}
      <form onSubmit={enviarMensaje} className="input-container">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí lo que necesitás..."
          className="input-chat"
          disabled={cargando}
        />
        <button type="submit" className="btn-enviar" disabled={cargando || !input.trim()}>
          Enviar
        </button>
      </form>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=MedievalSharp&display=swap');

        .asistente-container {
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          font-family: 'Cinzel', serif;
          color: #e8e0d5;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          background: linear-gradient(180deg, rgba(20,20,20,1) 0%, rgba(10,10,10,0) 100%);
          border-bottom: 1px solid rgba(212,175,55,0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #d4af37, #aa8a2e);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #0a0a0a;
          box-shadow: 0 0 20px rgba(212,175,55,0.3);
        }

        .titulo {
          font-family: 'MedievalSharp', cursive;
          font-size: 1.5rem;
          color: #d4af37;
          margin: 0;
          letter-spacing: 1px;
        }

        .subtitulo {
          font-size: 0.8rem;
          color: #888;
          margin: 0;
          font-weight: 400;
        }

        .btn-volver {
          padding: 0.6rem 1.25rem;
          background: transparent;
          border: 1px solid rgba(212,175,55,0.3);
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-volver:hover {
          background: rgba(212,175,55,0.1);
          border-color: #d4af37;
        }

        /* Chat */
        .chat-container {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }

        .mensaje {
          display: flex;
          gap: 1rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mensaje.usuario {
          justify-content: flex-end;
        }

        .mensaje.usuario .mensaje-contenido {
          background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05));
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 20px 20px 4px 20px;
        }

        .mensaje.asistente .mensaje-contenido {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px 20px 20px 4px;
        }

        .mensaje.sistema .mensaje-contenido {
          background: rgba(100,100,100,0.1);
          border: 1px dashed rgba(255,255,255,0.1);
          font-style: italic;
          color: #888;
        }

        .avatar-asistente {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #1a1a2e, #2d2d44);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .mensaje-contenido {
          max-width: 700px;
          padding: 1rem 1.5rem;
        }

        .mensaje-texto {
          line-height: 1.7;
          white-space: pre-wrap;
        }

        .mensaje-texto strong {
          color: #d4af37;
        }

        /* Preview */
        .preview-box {
          margin-top: 1rem;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px;
          overflow: hidden;
        }

        .preview-header {
          background: rgba(212,175,55,0.1);
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          color: #d4af37;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .preview-content {
          padding: 1rem;
          font-size: 0.9rem;
          max-height: 300px;
          overflow-y: auto;
        }

        /* Acciones */
        .acciones {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .btn-accion {
          padding: 0.6rem 1.25rem;
          background: linear-gradient(135deg, #d4af37, #aa8a2e);
          border: none;
          color: #0a0a0a;
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-accion:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(212,175,55,0.3);
        }

        .btn-accion:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Typing indicator */
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 0.5rem 0;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #d4af37;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Input */
        .input-container {
          display: flex;
          gap: 1rem;
          padding: 1.5rem 2rem;
          background: linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(20,20,20,1) 100%);
          border-top: 1px solid rgba(212,175,55,0.1);
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }

        .input-chat {
          flex: 1;
          padding: 1rem 1.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 30px;
          color: #e8e0d5;
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .input-chat:focus {
          border-color: rgba(212,175,55,0.5);
          box-shadow: 0 0 20px rgba(212,175,55,0.1);
        }

        .input-chat::placeholder {
          color: #666;
        }

        .btn-enviar {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #d4af37, #aa8a2e);
          border: none;
          color: #0a0a0a;
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-enviar:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 0 25px rgba(212,175,55,0.4);
        }

        .btn-enviar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Scrollbar */
        .chat-container::-webkit-scrollbar {
          width: 6px;
        }

        .chat-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-container::-webkit-scrollbar-thumb {
          background: rgba(212,175,55,0.3);
          border-radius: 3px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .chat-container {
            padding: 1rem;
          }

          .input-container {
            padding: 1rem;
          }

          .mensaje-contenido {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
}

function formatearMensaje(texto) {
  if (!texto) return '';

  // Convertir bullets
  texto = texto.replace(/^• /gm, '<span style="color:#d4af37">✦</span> ');

  // Convertir **texto** a negrita
  texto = texto.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convertir saltos de línea
  texto = texto.replace(/\n/g, '<br>');

  return texto;
}
