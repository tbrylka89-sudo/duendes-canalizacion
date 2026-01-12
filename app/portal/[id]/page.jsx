'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';

export default function PortalGuardianPage() {
  const params = useParams();
  const [guardian, setGuardian] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [lunaActual, setLunaActual] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    cargarGuardian();
    calcularLuna();
  }, [params.id]);

  async function cargarGuardian() {
    try {
      const res = await fetch(`/api/producto/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setGuardian(data);
        // Mensaje de bienvenida
        setMensajes([{
          rol: 'guardian',
          texto: `Bienvenido/a a mi portal. Soy ${data.nombre}. ¿En qué puedo guiarte hoy?`
        }]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  function calcularLuna() {
    // Cálculo simplificado de fase lunar
    const hoy = new Date();
    const ciclo = 29.53;
    const lunaLlena = new Date(2024, 0, 25); // Luna llena conocida
    const dias = (hoy - lunaLlena) / (1000 * 60 * 60 * 24);
    const fase = ((dias % ciclo) + ciclo) % ciclo;

    let nombreFase, emoji, energia;
    if (fase < 1.85) {
      nombreFase = 'Luna Nueva'; emoji = '🌑'; energia = 60;
    } else if (fase < 7.38) {
      nombreFase = 'Cuarto Creciente'; emoji = '🌒'; energia = 75;
    } else if (fase < 14.77) {
      nombreFase = 'Luna Llena'; emoji = '🌕'; energia = 100;
    } else if (fase < 22.15) {
      nombreFase = 'Cuarto Menguante'; emoji = '🌘'; energia = 80;
    } else {
      nombreFase = 'Luna Nueva'; emoji = '🌑'; energia = 60;
    }

    setLunaActual({ nombre: nombreFase, emoji, energia });
  }

  async function enviarMensaje(e) {
    e.preventDefault();
    if (!input.trim() || enviando) return;

    const mensaje = input.trim();
    setInput('');
    setMensajes(prev => [...prev, { rol: 'humano', texto: mensaje }]);
    setEnviando(true);

    try {
      const res = await fetch('/api/guardian/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guardianId: params.id,
          nombre: guardian.nombre,
          tipo: guardian.tipo,
          elemento: guardian.elemento,
          personalidad: guardian.historia?.personalidad,
          mensaje
        })
      });

      const data = await res.json();
      if (data.success) {
        setMensajes(prev => [...prev, { rol: 'guardian', texto: data.respuesta }]);
      }
    } catch (e) {
      console.error(e);
    }

    setEnviando(false);
    setTimeout(() => chatRef.current?.scrollTo(0, chatRef.current.scrollHeight), 100);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C6A962' }}>
        <p>Abriendo portal...</p>
      </div>
    );
  }

  if (!guardian) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <p>Guardián no encontrado</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #0d1117 100%)',
      fontFamily: "'Cormorant Garamond', Georgia, serif"
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1B4D3E 0%, #0d2d24 100%)',
        padding: '30px 20px',
        textAlign: 'center',
        borderBottom: '2px solid #C6A962'
      }}>
        <p style={{ color: '#C6A962', fontSize: '12px', letterSpacing: '3px', margin: '0 0 10px 0' }}>
          PORTAL DEL GUARDIÁN
        </p>
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          color: '#fff',
          fontSize: '36px',
          margin: 0
        }}>
          {guardian.nombre}
        </h1>
        <p style={{ color: '#888', margin: '10px 0 0 0' }}>
          {guardian.tipo} • {guardian.elemento}
        </p>
      </div>

      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '30px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: '30px'
      }}>
        {/* Columna principal */}
        <div>
          {/* Estado energético */}
          <div style={{
            background: '#161b22',
            borderRadius: '16px',
            padding: '25px',
            marginBottom: '20px',
            border: '1px solid #30363d'
          }}>
            <h3 style={{ color: '#C6A962', margin: '0 0 20px 0', fontSize: '16px' }}>
              🔮 Estado Energético Actual
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '50px' }}>{lunaActual?.emoji}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '18px' }}>
                  {lunaActual?.nombre}
                </p>
                <p style={{ color: '#888', margin: '0 0 10px 0', fontSize: '14px' }}>
                  {guardian.nombre} está en sintonía con la luna
                </p>
                <div style={{
                  background: '#21262d',
                  borderRadius: '10px',
                  height: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: 'linear-gradient(90deg, #C6A962, #3fb950)',
                    height: '100%',
                    width: `${lunaActual?.energia}%`,
                    transition: 'width 0.5s'
                  }} />
                </div>
                <p style={{ color: '#3fb950', fontSize: '13px', margin: '5px 0 0 0' }}>
                  Nivel de energía: {lunaActual?.energia}%
                </p>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div style={{
            background: '#161b22',
            borderRadius: '16px',
            border: '1px solid #30363d',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#21262d',
              padding: '15px 20px',
              borderBottom: '1px solid #30363d'
            }}>
              <h3 style={{ color: '#C6A962', margin: 0, fontSize: '16px' }}>
                💬 Comunicate con {guardian.nombre}
              </h3>
            </div>

            <div
              ref={chatRef}
              style={{
                height: '400px',
                overflowY: 'auto',
                padding: '20px'
              }}
            >
              {mensajes.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: msg.rol === 'humano' ? 'flex-end' : 'flex-start',
                    marginBottom: '15px'
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background: msg.rol === 'humano'
                      ? 'linear-gradient(135deg, #C6A962, #a88a42)'
                      : '#21262d',
                    color: msg.rol === 'humano' ? '#000' : '#e6edf3'
                  }}>
                    {msg.rol === 'guardian' && (
                      <p style={{ color: '#C6A962', fontSize: '12px', margin: '0 0 5px 0' }}>
                        {guardian.nombre}
                      </p>
                    )}
                    <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.texto}</p>
                  </div>
                </div>
              ))}

              {enviando && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background: '#21262d',
                    color: '#888'
                  }}>
                    <p style={{ margin: 0 }}>✨ {guardian.nombre} está canalizando...</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={enviarMensaje} style={{
              padding: '15px 20px',
              borderTop: '1px solid #30363d',
              display: 'flex',
              gap: '10px'
            }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Escribí tu mensaje..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '10px',
                  color: '#e6edf3',
                  fontSize: '15px'
                }}
              />
              <button
                type="submit"
                disabled={enviando}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #C6A962, #a88a42)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#000',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Imagen */}
          {guardian.imagenes?.[0] && (
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '20px',
              border: '2px solid #C6A962'
            }}>
              <img
                src={guardian.imagenes[0]}
                alt={guardian.nombre}
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          )}

          {/* Info rápida */}
          <div style={{
            background: '#161b22',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #30363d',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#C6A962', margin: '0 0 15px 0', fontSize: '14px' }}>
              📋 Información
            </h4>

            {[
              ['Tipo', guardian.tipo],
              ['Elemento', guardian.elemento],
              ['Propósito', guardian.proposito]
            ].map(([label, value]) => value && (
              <div key={label} style={{ marginBottom: '10px' }}>
                <p style={{ color: '#888', fontSize: '12px', margin: '0 0 3px 0' }}>{label}</p>
                <p style={{ color: '#e6edf3', margin: 0, textTransform: 'capitalize' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Links */}
          <div style={{
            background: '#161b22',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #30363d'
          }}>
            <a
              href={`/certificado/${params.id}`}
              style={{
                display: 'block',
                padding: '12px',
                background: '#21262d',
                borderRadius: '8px',
                color: '#e6edf3',
                textDecoration: 'none',
                textAlign: 'center',
                marginBottom: '10px'
              }}
            >
              🎫 Ver Certificado
            </a>

            <a
              href={`https://duendesdeluruguay.com/?p=${params.id}`}
              style={{
                display: 'block',
                padding: '12px',
                background: 'linear-gradient(135deg, #C6A962, #a88a42)',
                borderRadius: '8px',
                color: '#000',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: 600
              }}
            >
              🛒 Ver en Tienda
            </a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
      `}</style>
    </div>
  );
}
