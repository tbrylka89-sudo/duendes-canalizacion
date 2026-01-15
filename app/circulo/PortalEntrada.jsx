'use client';
import { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// PORTAL DE ENTRADA AL CÍRCULO DE DUENDES
// Experiencia inmersiva: bosque mágico + guardián del día
// ═══════════════════════════════════════════════════════════════════════════════

export default function PortalEntrada({ onEntrar, usuarioNombre }) {
  const [fase, setFase] = useState('cargando'); // cargando, bosque, guardian, transicion
  const [duendeDelDia, setDuendeDelDia] = useState(null);
  const [audioReady, setAudioReady] = useState(false);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  // Cargar duende del día
  useEffect(() => {
    async function cargarDuende() {
      try {
        const res = await fetch('/api/circulo/duende-del-dia');
        const data = await res.json();
        if (data.success) {
          setDuendeDelDia(data);
          setTimeout(() => setFase('bosque'), 500);
        }
      } catch (error) {
        console.error('Error cargando duende:', error);
        setFase('bosque');
      }
    }
    cargarDuende();
  }, []);

  // Efecto de partículas/orbes
  useEffect(() => {
    if (fase !== 'bosque' && fase !== 'guardian') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const orbes = [];
    const numOrbes = 30;

    // Crear orbes
    for (let i = 0; i < numOrbes; i++) {
      orbes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5 - 0.3,
        opacity: Math.random() * 0.5 + 0.3,
        hue: Math.random() > 0.5 ? 45 : 280 // Dorado o púrpura
      });
    }

    let animationId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbes.forEach(orb => {
        // Movimiento
        orb.x += orb.speedX;
        orb.y += orb.speedY;

        // Wrap around
        if (orb.y < -10) orb.y = canvas.height + 10;
        if (orb.x < -10) orb.x = canvas.width + 10;
        if (orb.x > canvas.width + 10) orb.x = -10;

        // Dibujar orbe con glow
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius * 3
        );
        gradient.addColorStop(0, `hsla(${orb.hue}, 80%, 70%, ${orb.opacity})`);
        gradient.addColorStop(0.5, `hsla(${orb.hue}, 80%, 60%, ${orb.opacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Núcleo brillante
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${orb.hue}, 90%, 85%, ${orb.opacity + 0.2})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [fase]);

  // Mostrar guardián después de ver el bosque
  useEffect(() => {
    if (fase === 'bosque') {
      const timer = setTimeout(() => setFase('guardian'), 2000);
      return () => clearTimeout(timer);
    }
  }, [fase]);

  // Manejar entrada al círculo
  const handleEntrar = () => {
    setFase('transicion');
    setTimeout(() => {
      onEntrar?.();
    }, 1500);
  };

  return (
    <div className="portal-entrada">
      {/* Canvas de partículas */}
      <canvas ref={canvasRef} className="portal-canvas" />

      {/* Video/Imagen de fondo del bosque */}
      <div className="bosque-fondo" />

      {/* Niebla animada */}
      <div className="niebla niebla-1" />
      <div className="niebla niebla-2" />

      {/* Árboles laterales con parallax */}
      <div className="arbol arbol-izq" />
      <div className="arbol arbol-der" />

      {/* Contenido central */}
      <div className={`portal-contenido ${fase}`}>

        {/* Estado: Cargando */}
        {fase === 'cargando' && (
          <div className="portal-cargando">
            <div className="portal-loader">
              <div className="runa-giro">ᚱ</div>
            </div>
            <p className="cargando-texto">Abriendo el portal...</p>
          </div>
        )}

        {/* Estado: Guardián aparece */}
        {(fase === 'guardian' || fase === 'transicion') && duendeDelDia && (
          <div className={`guardian-aparece ${fase === 'transicion' ? 'saliendo' : ''}`}>
            {/* Imagen del guardián */}
            <div className="guardian-imagen-container">
              <div className="guardian-glow" />
              <img
                src={duendeDelDia.guardian?.imagen}
                alt={duendeDelDia.guardian?.nombre}
                className="guardian-imagen"
              />
              <div className="guardian-particulas" />
            </div>

            {/* Info del guardián */}
            <div className="guardian-info">
              <span className="guardian-tipo">
                {duendeDelDia.guardian?.tipo_ser_nombre} de {duendeDelDia.guardian?.categoria}
              </span>
              <h2 className="guardian-nombre">{duendeDelDia.guardian?.nombre}</h2>
              <p className="guardian-arquetipo">{duendeDelDia.guardian?.arquetipo}</p>
            </div>

            {/* Mensaje del día */}
            <div className="mensaje-del-dia">
              <p className="mensaje-saludo">{duendeDelDia.mensaje?.saludo}</p>
              <p className="mensaje-principal">{duendeDelDia.mensaje?.mensaje}</p>
              <p className="mensaje-consejo">{duendeDelDia.mensaje?.consejo}</p>
            </div>

            {/* Botón de entrada */}
            <button onClick={handleEntrar} className="btn-entrar-circulo">
              <span className="btn-texto">Entrar al Círculo</span>
              <span className="btn-icono">→</span>
            </button>

            {/* Portal actual */}
            <div className="portal-actual">
              <span className="portal-nombre">{duendeDelDia.portal_actual?.nombre}</span>
              <span className="portal-energia">{duendeDelDia.portal_actual?.energia}</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .portal-entrada {
          position: fixed;
          inset: 0;
          z-index: 9999;
          overflow: hidden;
          background: #050508;
        }

        .portal-canvas {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }

        /* Fondo del bosque */
        .bosque-fondo {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 50% 100%, rgba(10, 30, 10, 0.8) 0%, transparent 70%),
            radial-gradient(ellipse at 30% 20%, rgba(20, 10, 30, 0.6) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 30%, rgba(30, 20, 10, 0.4) 0%, transparent 50%),
            linear-gradient(180deg, #0a0a12 0%, #0d1a0d 50%, #050508 100%);
          z-index: 1;
        }

        /* Niebla animada */
        .niebla {
          position: absolute;
          width: 200%;
          height: 30%;
          bottom: 0;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(200, 200, 220, 0.03) 20%,
            rgba(200, 200, 220, 0.05) 50%,
            rgba(200, 200, 220, 0.03) 80%,
            transparent 100%
          );
          z-index: 2;
        }

        .niebla-1 {
          animation: nieblaMove 30s linear infinite;
        }

        .niebla-2 {
          animation: nieblaMove 45s linear infinite reverse;
          opacity: 0.5;
          bottom: 10%;
        }

        @keyframes nieblaMove {
          from { transform: translateX(-50%); }
          to { transform: translateX(0%); }
        }

        /* Árboles */
        .arbol {
          position: absolute;
          bottom: 0;
          width: 300px;
          height: 100%;
          background: linear-gradient(to top, #0a0a0a, transparent 80%);
          z-index: 2;
          pointer-events: none;
        }

        .arbol-izq {
          left: 0;
          transform: scaleX(-1);
        }

        .arbol-der {
          right: 0;
        }

        /* Contenido central */
        .portal-contenido {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 40px 20px;
          transition: opacity 0.8s ease;
        }

        .portal-contenido.transicion {
          opacity: 0;
          transform: scale(1.1);
        }

        /* Cargando */
        .portal-cargando {
          text-align: center;
        }

        .portal-loader {
          width: 100px;
          height: 100px;
          margin: 0 auto 30px;
        }

        .runa-giro {
          font-size: 60px;
          color: #d4af37;
          animation: runaGiro 2s ease-in-out infinite;
          text-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
        }

        @keyframes runaGiro {
          0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.7; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 1; }
        }

        .cargando-texto {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 3px;
        }

        /* Guardián aparece */
        .guardian-aparece {
          text-align: center;
          animation: guardianEntra 1.5s ease-out forwards;
        }

        .guardian-aparece.saliendo {
          animation: guardianSale 1s ease-in forwards;
        }

        @keyframes guardianEntra {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes guardianSale {
          to {
            opacity: 0;
            transform: translateY(-50px) scale(1.1);
          }
        }

        /* Imagen del guardián */
        .guardian-imagen-container {
          position: relative;
          width: 220px;
          height: 220px;
          margin: 0 auto 30px;
        }

        .guardian-glow {
          position: absolute;
          inset: -30px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
          animation: glowPulse 3s ease-in-out infinite;
          border-radius: 50%;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .guardian-imagen {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid rgba(212, 175, 55, 0.6);
          box-shadow:
            0 0 30px rgba(212, 175, 55, 0.3),
            0 0 60px rgba(212, 175, 55, 0.2),
            inset 0 0 30px rgba(0, 0, 0, 0.5);
          animation: imagenFloat 4s ease-in-out infinite;
        }

        @keyframes imagenFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Info del guardián */
        .guardian-info {
          margin-bottom: 30px;
        }

        .guardian-tipo {
          display: inline-block;
          font-family: 'Cinzel', serif;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.8);
          background: rgba(212, 175, 55, 0.1);
          padding: 8px 20px;
          border-radius: 30px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          margin-bottom: 15px;
        }

        .guardian-nombre {
          font-family: 'Tangerine', cursive;
          font-size: clamp(50px, 12vw, 80px);
          font-weight: 700;
          color: #ffffff;
          margin: 10px 0;
          text-shadow: 0 0 40px rgba(212, 175, 55, 0.4);
        }

        .guardian-arquetipo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Mensaje del día */
        .mensaje-del-dia {
          max-width: 600px;
          margin: 0 auto 40px;
          padding: 30px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          border: 1px solid rgba(212, 175, 55, 0.15);
        }

        .mensaje-saludo {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          color: rgba(212, 175, 55, 0.9);
          margin-bottom: 15px;
        }

        .mensaje-principal {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 20px;
        }

        .mensaje-consejo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.6);
          padding-top: 15px;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
        }

        /* Botón de entrada */
        .btn-entrar-circulo {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 20px 50px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.4s ease;
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.3);
        }

        .btn-entrar-circulo:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(212, 175, 55, 0.4);
        }

        .btn-icono {
          font-size: 20px;
          transition: transform 0.3s ease;
        }

        .btn-entrar-circulo:hover .btn-icono {
          transform: translateX(5px);
        }

        /* Portal actual */
        .portal-actual {
          margin-top: 40px;
          text-align: center;
        }

        .portal-nombre {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 13px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.7);
          margin-bottom: 5px;
        }

        .portal-energia {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .guardian-imagen-container {
            width: 180px;
            height: 180px;
          }

          .guardian-nombre {
            font-size: 50px;
          }

          .mensaje-del-dia {
            padding: 20px;
            margin: 0 15px 30px;
          }

          .mensaje-principal {
            font-size: 18px;
          }

          .btn-entrar-circulo {
            padding: 18px 40px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
