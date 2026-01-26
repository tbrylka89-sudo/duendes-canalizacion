'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════
// LANDING PÚBLICA DEL CÍRCULO DE DUENDES
// Página de ventas - Sin fotos de Tito repetidas, sin botones verdes
// ═══════════════════════════════════════════════════════════════

export default function CirculoLandingPage() {
  const [faqAbierta, setFaqAbierta] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generar partículas con posiciones aleatorias en cliente
    setParticles(Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: `${i * 0.3}s`,
      x: `${Math.random() * 100}%`
    })));
  }, []);

  const portales = [
    {
      nombre: 'Ciclo de Yule',
      fecha: 'Junio - Agosto',
      color: '#1e40af',
      icono: '❄️',
      desc: 'Duendes de la sombra y la introspección. Guardianes del silencio interior y el renacimiento.'
    },
    {
      nombre: 'Ciclo de Ostara',
      fecha: 'Septiembre - Noviembre',
      color: '#166534',
      icono: '🌱',
      desc: 'Duendes del despertar primaveral. Maestros de las semillas y los nuevos comienzos.'
    },
    {
      nombre: 'Ciclo de Litha',
      fecha: 'Diciembre - Febrero',
      color: '#c2410c',
      icono: '☀️',
      desc: 'Duendes del fuego y la abundancia. Guardianes del poder pleno y la celebración.'
    },
    {
      nombre: 'Ciclo de Mabon',
      fecha: 'Marzo - Mayo',
      color: '#6b21a8',
      icono: '🍂',
      desc: 'Duendes de la cosecha y gratitud. Maestros del soltar y recibir.'
    }
  ];

  const contenidoSemanal = [
    { dia: 'Lunes', titulo: 'Sabiduría del Duende', desc: 'Cristales, hierbas y secretos de su especialidad.', icono: '📜' },
    { dia: 'Miércoles', titulo: 'Meditación Guiada', desc: 'Un viaje con la energía del guardián.', icono: '🧘' },
    { dia: 'Viernes', titulo: 'Ritual del Guardián', desc: 'Práctica guiada paso a paso.', icono: '🕯️' },
    { dia: 'Sábado', titulo: 'DIY del Duende', desc: 'Creá algo inspirado en el guardián.', icono: '✨' },
    { dia: 'Siempre', titulo: 'Foro Privado', desc: 'Comunidad que entiende tu camino.', icono: '💬' },
    { dia: 'Cada visita', titulo: 'Duende del Día', desc: 'Un mensaje único generado para vos.', icono: '🎁' }
  ];

  const faqs = [
    {
      q: '¿Necesito tener un duende para entrar?',
      a: 'No. El Círculo es para cualquier persona que sienta el llamado. Muchas personas descubren cuál quieren adoptar después de conocerlos acá.'
    },
    {
      q: '¿Se renueva automáticamente?',
      a: 'No. El pago es único. Pagás una vez y tenés acceso durante todo el período. Sin suscripción ni renovación automática.'
    },
    {
      q: '¿Qué pasa si me pierdo una semana?',
      a: 'Todo el contenido queda en el archivo. Podés acceder a las enseñanzas de cualquier duende en cualquier momento.'
    },
    {
      q: '¿Desde dónde puedo acceder?',
      a: 'Desde cualquier dispositivo con internet. Celulares, tablets y computadoras. Tu magia te acompaña donde vayas.'
    }
  ];

  const testimonios = [
    {
      texto: 'Nunca pensé que un duende de arcilla pudiera hacerme llorar. Pero cuando leí el mensaje que tenía para mí... todo hizo sentido.',
      autor: 'María Eugenia',
      desde: '2024'
    },
    {
      texto: 'El foro es lo mejor que me pasó. Encontré gente que entiende sin tener que explicar.',
      autor: 'Lucía',
      desde: '2023'
    },
    {
      texto: 'El duende del día siempre dice exactamente lo que necesito escuchar. Ya no me sorprende. Confío en ellos.',
      autor: 'Victoria',
      desde: '2024'
    }
  ];

  return (
    <div className="circulo-page">
      {/* HERO */}
      <section className="circulo-hero">
        <div className="hero-bg-effects">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="particles">
            {particles.map(p => (
              <span key={p.id} className="particle" style={{ '--delay': p.delay, '--x': p.x }}></span>
            ))}
          </div>
        </div>
        <div className="hero-content">
          <span className="hero-runa">ᚱ</span>
          <span className="hero-label">Portal Exclusivo</span>
          <h1 className="hero-title">Círculo de <span>Duendes</span></h1>
          <p className="hero-subtitle">El primer y único portal donde los guardianes comparten su sabiduría directamente con vos.</p>
          <div className="hero-features">
            <span>✨ Un duende diferente cada semana</span>
            <span>🌙 Rituales y meditaciones</span>
            <span>💫 Comunidad privada</span>
          </div>
          <a href="#planes" className="hero-cta">
            <span>Entrar al Círculo</span>
            <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
          </a>
        </div>
      </section>

      {/* QUÉ ES */}
      <section className="circulo-section concepto">
        <div className="section-container">
          <span className="section-label">El Concepto</span>
          <h2 className="section-title">¿Qué es el Círculo?</h2>
          <div className="concepto-grid">
            <div className="concepto-text">
              <p>Imaginá un lugar donde cada semana un guardián diferente toma la palabra y comparte contigo todo lo que sabe.</p>
              <p>Sus cristales favoritos. Las hierbas que trabaja. Los rituales que practica. Las meditaciones que guía.</p>
              <p>No es un curso. No es una app. Es un <strong>portal de conexión real</strong> con seres que llevan miles de años caminando entre nosotros.</p>
            </div>
            <div className="concepto-visual">
              <div className="circulo-animado">
                <div className="circulo-ring ring-1"></div>
                <div className="circulo-ring ring-2"></div>
                <div className="circulo-ring ring-3"></div>
                <div className="circulo-centro">
                  <span>52</span>
                  <small>guardianes al año</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTALES */}
      <section className="circulo-section portales">
        <div className="section-container">
          <span className="section-label">Los Ciclos</span>
          <h2 className="section-title">Los 4 Portales</h2>
          <p className="section-subtitle">Los duendes siguen el ritmo de la naturaleza. Cuatro estaciones, cuatro energías.</p>
          <div className="portales-grid">
            {portales.map((portal, i) => (
              <div key={i} className="portal-card" style={{ '--color': portal.color }}>
                <div className="portal-icono">{portal.icono}</div>
                <h3 className="portal-nombre">{portal.nombre}</h3>
                <span className="portal-fecha">{portal.fecha}</span>
                <p className="portal-desc">{portal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENIDO SEMANAL */}
      <section className="circulo-section contenido">
        <div className="section-container">
          <span className="section-label">Cada Semana</span>
          <h2 className="section-title">Un Duende Diferente Enseña</h2>
          <div className="contenido-grid">
            {contenidoSemanal.map((item, i) => (
              <div key={i} className="contenido-card">
                <span className="contenido-icono">{item.icono}</span>
                <h4 className="contenido-titulo">{item.titulo}</h4>
                <p className="contenido-desc">{item.desc}</p>
                <span className="contenido-dia">{item.dia}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="circulo-section planes">
        <div className="section-container">
          <span className="section-label">Tu Camino</span>
          <h2 className="section-title">Elegí Tu Acceso</h2>
          <p className="section-subtitle">Pago único. Sin renovación automática. Sin letra chica.</p>
          <div className="planes-grid">
            {/* Plan Semestral */}
            <div className="plan-card">
              <div className="plan-header">
                <h3>Medio Año con Duendes</h3>
                <span className="plan-duracion">6 meses de sabiduría</span>
              </div>
              <div className="plan-precio">
                <span className="precio-moneda">$</span>
                <span className="precio-valor">49</span>
                <span className="precio-decimales">.99</span>
                <span className="precio-periodo">USD - Pago único</span>
              </div>
              <ul className="plan-beneficios">
                <li>Un duende diferente cada semana</li>
                <li>Rituales, meditaciones y DIY</li>
                <li>Foro privado del Círculo</li>
                <li>2 ciclos estacionales</li>
                <li>Archivo completo</li>
              </ul>
              <a href="https://duendesdeluruguay.com/checkout/?plan=semestral" className="plan-btn secundario">
                Comenzar
              </a>
            </div>

            {/* Plan Anual */}
            <div className="plan-card destacado">
              <span className="plan-badge">Ciclo Completo</span>
              <div className="plan-header">
                <h3>Un Año con los Guardianes</h3>
                <span className="plan-duracion">1 año completo de magia</span>
              </div>
              <div className="plan-precio">
                <span className="precio-moneda">$</span>
                <span className="precio-valor">79</span>
                <span className="precio-decimales">.99</span>
                <span className="precio-periodo">USD - Pago único</span>
                <span className="precio-ahorro">Ahorrás 20%</span>
              </div>
              <ul className="plan-beneficios">
                <li>Los 4 ciclos estacionales completos</li>
                <li>10% descuento en adopciones</li>
                <li>Conocé nuevos guardianes primero</li>
                <li>Regalo sorpresa de aniversario</li>
                <li>Todo lo del plan semestral</li>
              </ul>
              <a href="https://duendesdeluruguay.com/checkout/?plan=anual" className="plan-btn primario">
                Entrar al Círculo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="circulo-section testimonios">
        <div className="section-container">
          <span className="section-label">Voces del Círculo</span>
          <h2 className="section-title">Lo Que Dicen</h2>
          <div className="testimonios-grid">
            {testimonios.map((t, i) => (
              <div key={i} className="testimonio-card">
                <span className="testimonio-quote">"</span>
                <p className="testimonio-texto">{t.texto}</p>
                <div className="testimonio-autor">
                  <div className="autor-avatar">{t.autor[0]}</div>
                  <div className="autor-info">
                    <strong>{t.autor}</strong>
                    <span>Miembro desde {t.desde}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="circulo-section faq">
        <div className="section-container">
          <span className="section-label">Preguntas</span>
          <h2 className="section-title">Dudas Frecuentes</h2>
          <div className="faq-lista">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${faqAbierta === i ? 'abierta' : ''}`} onClick={() => setFaqAbierta(faqAbierta === i ? null : i)}>
                <div className="faq-pregunta">
                  <span>{faq.q}</span>
                  <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
                </div>
                <div className="faq-respuesta">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="circulo-section cta-final">
        <div className="cta-content">
          <span className="cta-runa">ᚱ</span>
          <h2>El Círculo Te Espera</h2>
          <p>Este es el <strong>único lugar del mundo</strong> donde los duendes comparten su sabiduría directamente.</p>
          <p className="cta-hook">Los guardianes ya saben que estás acá.</p>
          <a href="#planes" className="cta-btn">
            Entrar al Círculo
          </a>
          <span className="cta-nota">Pago único. Sin sorpresas.</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="circulo-footer">
        <div className="footer-content">
          <Link href="/mi-magia" className="footer-link">Mi Magia</Link>
          <span className="footer-sep">•</span>
          <a href="https://duendesdeluruguay.com/shop/" className="footer-link">Tienda</a>
          <span className="footer-sep">•</span>
          <a href="https://duendesdeluruguay.com/" className="footer-link">Inicio</a>
        </div>
      </footer>

      <style jsx>{`
        .circulo-page {
          --gold: #d4af37;
          --gold-light: #e8d5a3;
          --gold-dark: #b8972e;
          --black: #0a0a0a;
          --black-deep: #050508;
          --purple: #6b21a8;
          font-family: 'Cormorant Garamond', Georgia, serif;
          color: #fff;
          background: var(--black);
          min-height: 100vh;
        }

        /* ═══════ HERO ═══════ */
        .circulo-hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 60px 20px;
          background: radial-gradient(ellipse at 30% 20%, rgba(107,33,168,0.15) 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 80%, rgba(212,175,55,0.1) 0%, transparent 50%),
                      var(--black);
        }

        .hero-bg-effects {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: var(--purple);
          top: -100px;
          left: -100px;
          animation: orbFloat 15s ease-in-out infinite;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: var(--gold);
          bottom: -50px;
          right: -50px;
          animation: orbFloat 12s ease-in-out infinite reverse;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }

        .particles {
          position: absolute;
          inset: 0;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--gold);
          border-radius: 50%;
          left: var(--x);
          animation: particleRise 8s ease-in-out infinite;
          animation-delay: var(--delay);
          opacity: 0;
        }

        @keyframes particleRise {
          0% { bottom: -10px; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { bottom: 100%; opacity: 0; }
        }

        .hero-content {
          text-align: center;
          position: relative;
          z-index: 2;
          max-width: 800px;
        }

        .hero-runa {
          display: block;
          font-size: 60px;
          color: var(--gold);
          margin-bottom: 20px;
          text-shadow: 0 0 30px rgba(212,175,55,0.5);
          animation: runaGlow 3s ease-in-out infinite;
        }

        @keyframes runaGlow {
          0%, 100% { text-shadow: 0 0 30px rgba(212,175,55,0.5); }
          50% { text-shadow: 0 0 60px rgba(212,175,55,0.8), 0 0 90px rgba(107,33,168,0.4); }
        }

        .hero-label {
          display: inline-block;
          font-family: 'Cinzel', serif;
          font-size: 12px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--gold);
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
          padding: 10px 25px;
          border-radius: 30px;
          margin-bottom: 25px;
        }

        .hero-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(40px, 10vw, 80px);
          font-weight: 600;
          line-height: 1.1;
          margin-bottom: 25px;
        }

        .hero-title span {
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: clamp(18px, 3vw, 24px);
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          margin-bottom: 30px;
          font-style: italic;
        }

        .hero-features {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          margin-bottom: 40px;
        }

        .hero-features span {
          font-size: 15px;
          color: rgba(255,255,255,0.6);
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          color: var(--black);
          font-family: 'Cinzel', serif;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          padding: 18px 40px;
          border-radius: 50px;
          transition: all 0.3s;
        }

        .hero-cta svg {
          width: 20px;
          height: 20px;
          fill: var(--black);
        }

        .hero-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 40px rgba(212,175,55,0.4);
        }

        /* ═══════ SECCIONES ═══════ */
        .circulo-section {
          padding: 100px 20px;
          position: relative;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-label {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 12px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--gold);
          text-align: center;
          margin-bottom: 15px;
        }

        .section-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(28px, 5vw, 42px);
          font-weight: 600;
          text-align: center;
          margin-bottom: 20px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          text-align: center;
          font-size: 18px;
          color: rgba(255,255,255,0.6);
          max-width: 700px;
          margin: 0 auto 50px;
        }

        /* ═══════ CONCEPTO ═══════ */
        .concepto {
          background: linear-gradient(180deg, var(--black) 0%, rgba(107,33,168,0.05) 50%, var(--black) 100%);
        }

        .concepto-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-top: 50px;
        }

        .concepto-text p {
          font-size: 20px;
          line-height: 1.8;
          color: rgba(255,255,255,0.8);
          margin-bottom: 20px;
        }

        .concepto-text strong {
          color: var(--gold);
        }

        .concepto-visual {
          display: flex;
          justify-content: center;
        }

        .circulo-animado {
          position: relative;
          width: 280px;
          height: 280px;
        }

        .circulo-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(212,175,55,0.3);
        }

        .ring-1 {
          inset: 0;
          animation: ringRotate 20s linear infinite;
        }

        .ring-2 {
          inset: 30px;
          border-color: rgba(107,33,168,0.4);
          animation: ringRotate 15s linear infinite reverse;
        }

        .ring-3 {
          inset: 60px;
          animation: ringRotate 10s linear infinite;
        }

        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .circulo-centro {
          position: absolute;
          inset: 90px;
          background: rgba(212,175,55,0.1);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(212,175,55,0.3);
        }

        .circulo-centro span {
          font-family: 'Cinzel', serif;
          font-size: 48px;
          font-weight: 600;
          color: var(--gold);
        }

        .circulo-centro small {
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* ═══════ PORTALES ═══════ */
        .portales {
          background: var(--black-deep);
        }

        .portales-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
        }

        .portal-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 30px 20px;
          text-align: center;
          transition: all 0.4s;
          position: relative;
          overflow: hidden;
        }

        .portal-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--color);
        }

        .portal-card:hover {
          transform: translateY(-8px);
          border-color: var(--color);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .portal-icono {
          font-size: 40px;
          margin-bottom: 15px;
        }

        .portal-nombre {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .portal-fecha {
          display: block;
          font-size: 13px;
          color: var(--color);
          margin-bottom: 12px;
        }

        .portal-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
        }

        /* ═══════ CONTENIDO ═══════ */
        .contenido-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
        }

        .contenido-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          transition: all 0.3s;
        }

        .contenido-card:hover {
          border-color: rgba(212,175,55,0.4);
          transform: translateY(-5px);
        }

        .contenido-icono {
          font-size: 36px;
          display: block;
          margin-bottom: 15px;
        }

        .contenido-titulo {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .contenido-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 15px;
        }

        .contenido-dia {
          display: inline-block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--gold);
          background: rgba(212,175,55,0.1);
          padding: 6px 15px;
          border-radius: 20px;
        }

        /* ═══════ PLANES ═══════ */
        .planes {
          background: linear-gradient(180deg, var(--black) 0%, rgba(212,175,55,0.03) 50%, var(--black) 100%);
        }

        .planes-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          max-width: 900px;
          margin: 0 auto;
        }

        .plan-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 24px;
          padding: 40px 35px;
          position: relative;
          transition: all 0.4s;
        }

        .plan-card:hover {
          transform: translateY(-5px);
          border-color: rgba(212,175,55,0.4);
        }

        .plan-card.destacado {
          border-color: var(--gold);
          background: linear-gradient(135deg, rgba(212,175,55,0.08), rgba(107,33,168,0.05));
          box-shadow: 0 0 40px rgba(212,175,55,0.15);
        }

        .plan-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          color: var(--black);
          font-family: 'Cinzel', serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 8px 20px;
          border-radius: 20px;
        }

        .plan-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .plan-header h3 {
          font-family: 'Cinzel', serif;
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .plan-duracion {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
        }

        .plan-precio {
          text-align: center;
          padding: 25px 0;
          border-top: 1px solid rgba(212,175,55,0.15);
          border-bottom: 1px solid rgba(212,175,55,0.15);
          margin-bottom: 25px;
        }

        .precio-moneda {
          font-size: 24px;
          color: var(--gold-light);
          vertical-align: top;
        }

        .precio-valor {
          font-family: 'Cinzel', serif;
          font-size: 56px;
          font-weight: 700;
          color: var(--gold);
        }

        .precio-decimales {
          font-size: 24px;
          color: var(--gold-light);
          vertical-align: top;
        }

        .precio-periodo {
          display: block;
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin-top: 8px;
        }

        .precio-ahorro {
          display: inline-block;
          background: rgba(34,197,94,0.2);
          color: #22c55e;
          font-size: 12px;
          padding: 5px 12px;
          border-radius: 15px;
          margin-top: 10px;
        }

        .plan-beneficios {
          list-style: none;
          padding: 0;
          margin: 0 0 30px;
        }

        .plan-beneficios li {
          position: relative;
          padding-left: 30px;
          margin-bottom: 12px;
          font-size: 15px;
          color: rgba(255,255,255,0.8);
        }

        .plan-beneficios li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--gold);
          font-weight: bold;
        }

        .plan-btn {
          display: block;
          width: 100%;
          text-align: center;
          font-family: 'Cinzel', serif;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          padding: 16px;
          border-radius: 30px;
          transition: all 0.3s;
        }

        .plan-btn.secundario {
          background: transparent;
          border: 2px solid rgba(212,175,55,0.5);
          color: var(--gold);
        }

        .plan-btn.secundario:hover {
          background: rgba(212,175,55,0.1);
          border-color: var(--gold);
        }

        .plan-btn.primario {
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          color: var(--black);
          border: none;
        }

        .plan-btn.primario:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212,175,55,0.3);
        }

        /* ═══════ TESTIMONIOS ═══════ */
        .testimonios {
          background: var(--black-deep);
        }

        .testimonios-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
        }

        .testimonio-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 30px;
          position: relative;
        }

        .testimonio-quote {
          position: absolute;
          top: 15px;
          left: 25px;
          font-family: 'Cinzel', serif;
          font-size: 60px;
          color: rgba(212,175,55,0.2);
          line-height: 1;
        }

        .testimonio-texto {
          font-size: 16px;
          font-style: italic;
          color: rgba(255,255,255,0.8);
          line-height: 1.7;
          margin-bottom: 20px;
          padding-top: 20px;
        }

        .testimonio-autor {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .autor-avatar {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, var(--gold), var(--purple));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cinzel', serif;
          font-weight: 600;
          color: #fff;
        }

        .autor-info strong {
          display: block;
          font-size: 15px;
        }

        .autor-info span {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
        }

        /* ═══════ FAQ ═══════ */
        .faq-lista {
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-item {
          border-bottom: 1px solid rgba(212,175,55,0.15);
          cursor: pointer;
        }

        .faq-pregunta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px 0;
          font-family: 'Cinzel', serif;
          font-size: 17px;
          font-weight: 500;
        }

        .faq-pregunta svg {
          width: 24px;
          height: 24px;
          fill: var(--gold);
          transition: transform 0.3s;
          flex-shrink: 0;
          margin-left: 15px;
        }

        .faq-item.abierta .faq-pregunta svg {
          transform: rotate(180deg);
        }

        .faq-respuesta {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s, padding 0.3s;
        }

        .faq-item.abierta .faq-respuesta {
          max-height: 200px;
          padding-bottom: 25px;
        }

        .faq-respuesta p {
          font-size: 16px;
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
        }

        /* ═══════ CTA FINAL ═══════ */
        .cta-final {
          background: radial-gradient(ellipse at center, rgba(212,175,55,0.1) 0%, transparent 70%),
                      var(--black);
          text-align: center;
          padding: 120px 20px;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-runa {
          font-size: 50px;
          color: var(--gold);
          display: block;
          margin-bottom: 20px;
          animation: runaGlow 3s ease-in-out infinite;
        }

        .cta-final h2 {
          font-family: 'Cinzel', serif;
          font-size: clamp(28px, 5vw, 40px);
          margin-bottom: 20px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cta-final p {
          font-size: 18px;
          color: rgba(255,255,255,0.7);
          margin-bottom: 10px;
        }

        .cta-final strong {
          color: #fff;
        }

        .cta-hook {
          font-family: 'Cinzel', serif;
          color: var(--gold) !important;
          margin-bottom: 30px !important;
        }

        .cta-btn {
          display: inline-block;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          color: var(--black);
          font-family: 'Cinzel', serif;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          padding: 18px 50px;
          border-radius: 50px;
          transition: all 0.3s;
          margin-bottom: 20px;
        }

        .cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(212,175,55,0.4);
        }

        .cta-nota {
          display: block;
          font-size: 14px;
          color: rgba(255,255,255,0.5);
        }

        /* ═══════ FOOTER ═══════ */
        .circulo-footer {
          background: var(--black-deep);
          padding: 30px 20px;
          text-align: center;
          border-top: 1px solid rgba(212,175,55,0.1);
        }

        .footer-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        .footer-link {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: var(--gold);
        }

        .footer-sep {
          color: rgba(255,255,255,0.3);
        }

        /* ═══════ RESPONSIVE ═══════ */
        @media (max-width: 1024px) {
          .portales-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .circulo-section {
            padding: 70px 20px;
          }

          .concepto-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .portales-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
          }

          .contenido-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
          }

          .planes-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
          }

          .testimonios-grid {
            grid-template-columns: 1fr;
            max-width: 500px;
            margin: 0 auto;
          }

          .hero-features {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
