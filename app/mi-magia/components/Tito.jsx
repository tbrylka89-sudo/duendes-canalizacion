'use client';
import { useState, useEffect } from 'react';
import { API_BASE, TITO_IMG } from './constants';

// ═══════════════════════════════════════════════════════════════
// BURBUJA DE SUGERENCIAS DE TITO
// ═══════════════════════════════════════════════════════════════

export function TitoBurbuja({ usuario, onAbrir }) {
  const [sugerencia, setSugerencia] = useState(null);
  const [visible, setVisible] = useState(false);
  const [cerrada, setCerrada] = useState(false);

  useEffect(() => {
    if (!usuario?.email || cerrada) return;

    // Esperar 3 segundos antes de mostrar la burbuja
    const timer = setTimeout(() => {
      cargarSugerencia();
    }, 3000);

    return () => clearTimeout(timer);
  }, [usuario?.email, cerrada]);

  async function cargarSugerencia() {
    try {
      const res = await fetch('/api/tito/sugerencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario?.email })
      });
      const data = await res.json();

      if (data.success && data.sugerencias?.length > 0) {
        // Mostrar la primera sugerencia de mayor prioridad
        setSugerencia(data.sugerencias[0]);
        setVisible(true);

        // Ocultar después de 15 segundos
        setTimeout(() => {
          setVisible(false);
        }, 15000);
      }
    } catch (err) {
      console.error('Error cargando sugerencias:', err);
    }
  }

  function cerrarBurbuja() {
    setVisible(false);
    setCerrada(true);
  }

  function handleClick() {
    cerrarBurbuja();
    onAbrir();
  }

  if (!visible || !sugerencia) return null;

  return (
    <div className="tito-burbuja" onClick={handleClick}>
      <button className="burbuja-cerrar" onClick={(e) => { e.stopPropagation(); cerrarBurbuja(); }}>✕</button>
      <div className="burbuja-contenido">
        <span className="burbuja-avatar">
          <img src={TITO_IMG} alt="Tito" onError={e => e.target.style.display='none'} />
        </span>
        <div className="burbuja-mensaje">
          <p>{sugerencia.mensaje}</p>
          {sugerencia.producto && (
            <span className="burbuja-tag">{sugerencia.producto.tipo === 'experiencia' ? `${sugerencia.producto.precio} runas` : `$${sugerencia.producto.precio}`}</span>
          )}
        </div>
      </div>
      <style jsx>{`
        .tito-burbuja {
          position: fixed;
          bottom: 140px;
          right: 1.5rem;
          max-width: 280px;
          background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 15px;
          padding: 12px 15px;
          cursor: pointer;
          z-index: 998;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          animation: burbujaEntrar 0.5s ease;
        }
        @keyframes burbujaEntrar {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .burbuja-cerrar {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          background: #333;
          border: 1px solid #555;
          border-radius: 50%;
          color: #999;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .burbuja-cerrar:hover {
          background: #444;
          color: #fff;
        }
        .burbuja-contenido {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .burbuja-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #d4af37;
          flex-shrink: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .burbuja-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .burbuja-mensaje {
          flex: 1;
        }
        .burbuja-mensaje p {
          color: #FDF8F0;
          font-size: 13px;
          line-height: 1.4;
          margin: 0;
          font-family: 'Cormorant Garamond', serif;
        }
        .burbuja-tag {
          display: inline-block;
          margin-top: 6px;
          background: rgba(212, 175, 55, 0.2);
          color: #d4af37;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 10px;
        }
        @media (max-width: 768px) {
          .tito-burbuja {
            bottom: 130px;
            right: 10px;
            max-width: 250px;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TITO CHAT PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export function Tito({ usuario, abierto, setAbierto, origen = 'mi-magia', datosCirculo = null }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [env, setEnv] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const enviar = async () => {
    if (!input.trim() || env) return;
    const m = input.trim(); setInput('');
    const nuevosMsgs = [...msgs, { r: 'u', t: m }];
    setMsgs(nuevosMsgs); setEnv(true);
    try {
      const historial = nuevosMsgs.slice(-10).map(msg => ({
        role: msg.r === 'u' ? 'user' : 'assistant',
        content: msg.t
      }));

      // Usar Tito v3 con origen dinámico (mi-magia o circulo)
      const res = await fetch(`${API_BASE}/api/tito/v3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: m,
          origen, // Puede ser 'mi-magia' o 'circulo'
          history: historial,
          // Datos del usuario para contexto
          usuario: {
            nombre: usuario?.nombrePreferido || usuario?.nombre,
            email: usuario?.email,
            runas: usuario?.runas || 0,
            treboles: usuario?.treboles || 0,
            guardianes: usuario?.guardianes?.map(g => g.nombre) || [],
            esCliente: true // Si está en Mi Magia, ya es cliente
          },
          // Datos del Círculo (si es miembro)
          datosCirculo: datosCirculo || null
        })
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { r: 't', t: data.respuesta || data.response || 'Hubo un error, intentá de nuevo.' }]);
    } catch(e) { setMsgs(prev => [...prev, { r: 't', t: 'Error de conexión.' }]); }
    setEnv(false);
  };

  // ESTILOS FORZADOS PARA MÓVIL - Sin depender de CSS externo
  const mobile = mounted && isMobile;
  const btnStyle = {
    position: 'fixed',
    bottom: mobile ? '12px' : '1.5rem',
    right: mobile ? '12px' : '1.5rem',
    width: mobile ? '52px' : '60px',
    height: mobile ? '52px' : '60px',
    borderRadius: '50%',
    background: '#1a1a1a',
    border: '2px solid #d4af37',
    cursor: 'pointer',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent'
  };
  // CHAT: Ancho fijo calculado para no causar overflow
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
  const chatWidth = mobile ? Math.min(screenWidth - 20, 380) : 340;
  const chatStyle = {
    position: 'fixed',
    zIndex: 999,
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxSizing: 'border-box',
    bottom: mobile ? '70px' : '6rem',
    right: mobile ? '10px' : '1.5rem',
    width: `${chatWidth}px`,
    maxWidth: mobile ? 'calc(100vw - 20px)' : '340px',
    maxHeight: mobile ? '50vh' : '450px'
  };
  // MENSAJES: Forzar saltos de línea
  const msgStyle = {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: '1.6',
    margin: 0,
    fontSize: mobile ? '0.85rem' : '0.9rem'
  };

  return (
    <>
      <button
        style={btnStyle}
        onClick={() => setAbierto(!abierto)}
        onTouchEnd={(e) => { e.preventDefault(); setAbierto(!abierto); }}
        aria-label="Abrir chat con Tito"
      >
        <img src={TITO_IMG} alt="Tito" style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute'}} onError={e => e.target.style.display='none'} />
        <span style={{fontFamily:'Cinzel,serif',fontSize:'1.5rem',color:'#d4af37'}}>T</span>
      </button>
      {abierto && (
        <div style={chatStyle}>
          <div className="tito-head" style={{padding: mobile ? '0.6rem' : '1rem', background:'#1a1a1a', display:'flex', alignItems:'center', gap:'0.75rem'}}>
            <img src={TITO_IMG} alt="" style={{width: mobile ? '28px' : '36px', height: mobile ? '28px' : '36px', borderRadius:'50%',objectFit:'cover'}} onError={e => e.target.style.display='none'} />
            <div style={{flex:1}}><strong style={{display:'block',color:'#d4af37',fontFamily:'Cinzel,serif',fontSize:'0.9rem'}}>Tito</strong><small style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.6)'}}>Tu guía</small></div>
            <button onClick={() => setAbierto(false)} onTouchEnd={(e) => { e.preventDefault(); setAbierto(false); }} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:'1.1rem',cursor:'pointer',padding:'8px'}}>✕</button>
          </div>
          <div style={{flex:1,padding: mobile ? '0.6rem' : '1rem',overflowY:'auto',display:'flex',flexDirection:'column',gap:'0.6rem',maxHeight: mobile ? '35vh' : '300px', background:'#fff'}}>
            <div style={{background:'#f5f5f5',padding:'0.6rem 0.9rem',borderRadius:'12px',maxWidth:'85%',alignSelf:'flex-start'}}><p style={msgStyle}>¡Hola {usuario?.nombrePreferido}! Soy Tito. Preguntame lo que necesites.</p></div>
            {msgs.map((m,i) => <div key={i} style={{background: m.r==='u' ? '#1a1a1a' : '#f5f5f5', color: m.r==='u' ? '#fff' : '#1a1a1a', padding:'0.6rem 0.9rem', borderRadius:'12px', maxWidth:'85%', alignSelf: m.r==='u' ? 'flex-end' : 'flex-start'}}><p style={msgStyle}>{m.t}</p></div>)}
            {env && <div style={{background:'#f5f5f5',padding:'0.6rem 0.9rem',borderRadius:'12px',maxWidth:'85%',alignSelf:'flex-start'}}><p style={msgStyle}>...</p></div>}
          </div>
          <div style={{display:'flex',gap:'0.5rem',padding: mobile ? '0.5rem' : '0.75rem',borderTop:'1px solid #f0f0f0',background:'#fff'}}>
            <input placeholder="Tu pregunta..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key==='Enter' && enviar()} style={{flex:1,padding:'0.6rem 1rem',border:'1px solid #e0e0e0',borderRadius:'50px',fontSize:'16px',fontFamily:'Cormorant Garamond,serif'}} />
            <button onClick={enviar} disabled={env} style={{width:'36px',height:'36px',borderRadius:'50%',background:env?'#ddd':'#d4af37',border:'none',color:'#1a1a1a',fontSize:'1.1rem',cursor:env?'not-allowed':'pointer'}}>→</button>
          </div>
        </div>
      )}
    </>
  );
}
