'use client';
import { useState, useEffect } from 'react';
import PortalEntrada from './PortalEntrada';
import CirculoDashboard from './Dashboard';
import Onboarding from './Onboarding';

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL DEL CÍRCULO DE DUENDES
// Diseño premium con landing page completa para no miembros
// ═══════════════════════════════════════════════════════════════════════════════

// URLs centralizadas - cambiar aquí cuando migre el dominio
const WORDPRESS_URL = 'https://duendesuy.10web.cloud'; // Cambiar a duendesdeluruguay.com cuando 10Web arregle SSL

const IMAGEN_TITO = `${WORDPRESS_URL}/wp-content/uploads/2026/01/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-1_53c2ddf7-82d8-47fa-823e-7b0f3af1398e-scaled.jpg`;

const BENEFICIOS_SEMESTRAL = [
  { icono: '✦', texto: '100 runas de bienvenida', valor: 'valor $12' },
  { icono: '☘', texto: '25 tréboles de regalo', valor: '' },
  { icono: '📜', texto: 'Contenido semanal del Duende Guardián', valor: '' },
  { icono: '☽', texto: 'Guía lunar mensual', valor: '' },
  { icono: '💬', texto: 'Acceso al foro privado', valor: '' },
  { icono: '🍂', texto: '2 ciclos estacionales celtas', valor: '' },
  { icono: '🏷', texto: '5% descuento en adopciones', valor: '' },
  { icono: 'ᚱ', texto: '1 Tirada de Runas gratis/mes', valor: 'valor $30 total' },
];

const BENEFICIOS_ANUAL = [
  { icono: '✦', texto: '150 runas de bienvenida', valor: 'valor $18' },
  { icono: '☘', texto: '50 tréboles de regalo', valor: '' },
  { icono: '📜', texto: 'Contenido semanal del Duende Guardián', valor: '' },
  { icono: '☽', texto: 'Guía lunar mensual', valor: '' },
  { icono: '💬', texto: 'Acceso al foro privado', valor: '' },
  { icono: '🍂', texto: 'Los 4 ciclos estacionales completos', valor: '' },
  { icono: '🏷', texto: '10% descuento en adopciones', valor: '' },
  { icono: '◈', texto: '1 Lectura del Alma gratis', valor: 'valor 25 runas' },
  { icono: '🔮', texto: 'Conocé nuevos guardianes primero', valor: '' },
  { icono: '🎁', texto: 'Regalo sorpresa de aniversario', valor: '' },
  { icono: '⚡', texto: 'Acceso anticipado a colecciones', valor: '' },
];

const FAQS = [
  {
    pregunta: '¿Qué pasa cuando termina mi prueba gratuita?',
    respuesta: 'Simplemente dejás de tener acceso al contenido exclusivo. No hay cargos automáticos ni sorpresas. Si querés continuar, elegís el plan que más te guste.'
  },
  {
    pregunta: '¿Puedo cancelar en cualquier momento?',
    respuesta: 'El Círculo no tiene renovación automática. Comprás el período que querés (6 o 12 meses) y cuando termina, decidís si renovar.'
  },
  {
    pregunta: '¿Qué es el "Duende de la Semana"?',
    respuesta: 'Cada semana, un guardián diferente de nuestra colección toma protagonismo y comparte su sabiduría única: rituales, meditaciones, mensajes canalizados y enseñanzas desde su energía particular.'
  },
  {
    pregunta: '¿Las runas y tréboles se acumulan?',
    respuesta: 'Sí, las runas y tréboles que recibís son tuyos para siempre. Podés usarlos cuando quieras para experiencias mágicas o canjearlos por productos.'
  },
  {
    pregunta: '¿Qué son los ciclos estacionales celtas?',
    respuesta: 'Son los 4 grandes festivales del año: Imbolc (febrero), Beltane (mayo), Lughnasadh (agosto) y Samhain (octubre). Cada uno trae contenido especial, rituales y conexiones con la rueda del año.'
  }
];

const TESTIMONIOS = [
  {
    nombre: 'María L.',
    texto: 'El contenido semanal se convirtió en mi ritual de los domingos. Es como tener un guía espiritual que me conoce.',
    tiempo: 'Miembro hace 8 meses'
  },
  {
    nombre: 'Carolina P.',
    texto: 'Las tiradas de runas gratis son increíbles. Ya me ahorraron más de lo que pagué por la membresía.',
    tiempo: 'Miembro hace 5 meses'
  },
  {
    nombre: 'Lucía R.',
    texto: 'La guía lunar me cambió la forma de planificar mi mes. Ahora todo fluye mejor.',
    tiempo: 'Miembro hace 1 año'
  }
];

// Componente TrialBanner para mostrar días restantes
function TrialBanner({ diasRestantes, onSuscribirse }) {
  return (
    <div className="trial-banner">
      <div className="trial-content">
        <span className="trial-icon">✨</span>
        <div className="trial-text">
          <strong>Prueba gratuita</strong>
          <span>Te quedan {diasRestantes} días</span>
        </div>
        <button onClick={onSuscribirse} className="trial-btn">
          Suscribirme ahora
          <span className="trial-discount">10% OFF</span>
        </button>
      </div>
      <style jsx>{`
        .trial-banner {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 12px 20px;
          margin-bottom: 20px;
        }
        .trial-content {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }
        .trial-icon { font-size: 24px; }
        .trial-text {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .trial-text strong {
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 14px;
        }
        .trial-text span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
        }
        .trial-btn {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          font-family: 'Cinzel', serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        .trial-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
        }
        .trial-discount {
          background: #0a0a0a;
          color: #d4af37;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
        }
        @media (max-width: 500px) {
          .trial-btn {
            width: 100%;
            justify-content: center;
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE PREMIUM PARA NO MIEMBROS
// ═══════════════════════════════════════════════════════════════════════════════

function LandingCirculo({ onTrialClick }) {
  const [faqAbierta, setFaqAbierta] = useState(null);

  return (
    <div className="landing-circulo">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-badge">✦ Membresía Premium ✦</div>
          <h1>El Círculo de Duendes</h1>
          <p className="hero-subtitulo">
            Cada semana, un guardián diferente te acompaña con sabiduría ancestral,
            rituales exclusivos y mensajes canalizados solo para vos.
          </p>

          <button onClick={onTrialClick} className="hero-cta">
            <span className="cta-icon">✨</span>
            Probar 15 días GRATIS
          </button>
          <p className="hero-nota">Sin tarjeta de crédito · Acceso completo</p>
        </div>
        <div className="hero-scroll">
          <span>Descubrí más</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* ¿QUÉ ES EL CÍRCULO? */}
      <section className="seccion que-es">
        <div className="contenedor">
          <h2>¿Qué es el Círculo?</h2>
          <div className="que-es-grid">
            <div className="que-es-texto">
              <p className="destacado">
                El Círculo es nuestra membresía premium para quienes quieren una conexión
                más profunda con la magia de los guardianes.
              </p>
              <p>
                Cada semana, un guardián diferente toma el poder y te acompaña con
                conocimientos ancestrales únicos, rituales exclusivos, meditaciones guiadas
                y enseñanzas desde su mirada mística.
              </p>
              <p>
                Incluye guía lunar mensual para planificar tu mes según las energías cósmicas,
                acceso a nuestra comunidad privada donde conectás con otros elegidos,
                y 100 runas de regalo para explorar las experiencias mágicas.
              </p>
            </div>
            <div className="que-es-imagen">
              <img src={IMAGEN_TITO} alt="Tito, guardián del Círculo" />
              <span className="imagen-caption">Tito, guardián fundador del Círculo</span>
            </div>
          </div>
        </div>
      </section>

      {/* DUENDE DE LA SEMANA */}
      <section className="seccion duende-semana">
        <div className="contenedor">
          <div className="duende-header">
            <span className="duende-icono">🍄</span>
            <h2>El Guardián que te Enseña y Guía</h2>
          </div>
          <p className="duende-intro">
            Cada semana, un guardián diferente toma el protagonismo para enseñarte
            su sabiduría ancestral. No es un duende de regalo: es un maestro espiritual
            que comparte contigo sus conocimientos, rituales y secretos milenarios.
          </p>
          <div className="duende-cards">
            <div className="duende-card">
              <span className="card-num">1</span>
              <h3>Mensaje Canalizado</h3>
              <p>Cada lunes recibís un mensaje único del guardián de turno,
              escrito especialmente para los miembros del Círculo.</p>
            </div>
            <div className="duende-card">
              <span className="card-num">2</span>
              <h3>Ritual Exclusivo</h3>
              <p>Un ritual o práctica semanal diseñada por el guardián
              para trabajar su energía específica.</p>
            </div>
            <div className="duende-card">
              <span className="card-num">3</span>
              <h3>Meditación Guiada</h3>
              <p>Conectá en profundidad con el guardián a través de
              meditaciones y visualizaciones exclusivas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANES Y PRECIOS */}
      <section className="seccion planes">
        <div className="contenedor">
          <h2>Elegí tu Camino</h2>
          <p className="planes-intro">
            Dos opciones pensadas para diferentes momentos. Ambas con acceso completo al Círculo.
          </p>

          <div className="planes-grid">
            {/* PLAN SEMESTRAL */}
            <div className="plan-card">
              <div className="plan-header">
                <h3>Medio Año Mágico</h3>
                <div className="plan-precio">
                  <span className="precio-usd">$50</span>
                  <span className="precio-periodo">USD / 6 meses</span>
                </div>
                <div className="precio-uyu">$2.000 UYU</div>
                <div className="precio-mensual">~$8.33 USD/mes</div>
              </div>
              <ul className="plan-beneficios">
                {BENEFICIOS_SEMESTRAL.map((b, i) => (
                  <li key={i}>
                    <span className="beneficio-icono">{b.icono}</span>
                    <span className="beneficio-texto">{b.texto}</span>
                    {b.valor && <span className="beneficio-valor">{b.valor}</span>}
                  </li>
                ))}
              </ul>
              <a href={`${WORDPRESS_URL}/producto/circulo-semestral/`} className="plan-btn">
                Elegir Semestral
              </a>
            </div>

            {/* PLAN ANUAL */}
            <div className="plan-card destacado">
              <div className="plan-badge">✦ MEJOR VALOR ✦</div>
              <div className="plan-header">
                <h3>Año del Guardián</h3>
                <div className="plan-precio">
                  <span className="precio-usd">$80</span>
                  <span className="precio-periodo">USD / 12 meses</span>
                </div>
                <div className="precio-uyu">$3.200 UYU</div>
                <div className="precio-mensual">~$6.67 USD/mes · <span className="ahorro">Ahorrás 20%</span></div>
              </div>
              <ul className="plan-beneficios">
                {BENEFICIOS_ANUAL.map((b, i) => (
                  <li key={i}>
                    <span className="beneficio-icono">{b.icono}</span>
                    <span className="beneficio-texto">{b.texto}</span>
                    {b.valor && <span className="beneficio-valor">{b.valor}</span>}
                  </li>
                ))}
              </ul>
              <a href={`${WORDPRESS_URL}/producto/circulo-anual/`} className="plan-btn">
                Elegir Anual
              </a>
            </div>
          </div>

          {/* TRIAL CTA */}
          <div className="trial-cta-section">
            <p>¿No estás segura todavía?</p>
            <button onClick={onTrialClick} className="trial-cta-btn">
              Probá 15 días GRATIS
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="seccion testimonios">
        <div className="contenedor">
          <h2>Lo que dicen nuestros miembros</h2>
          <div className="testimonios-grid">
            {TESTIMONIOS.map((t, i) => (
              <div key={i} className="testimonio-card">
                <p className="testimonio-texto">"{t.texto}"</p>
                <div className="testimonio-autor">
                  <span className="autor-nombre">{t.nombre}</span>
                  <span className="autor-tiempo">{t.tiempo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="seccion faq">
        <div className="contenedor">
          <h2>Preguntas Frecuentes</h2>
          <div className="faq-lista">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${faqAbierta === i ? 'abierta' : ''}`}
                onClick={() => setFaqAbierta(faqAbierta === i ? null : i)}
              >
                <div className="faq-pregunta">
                  <span>{faq.pregunta}</span>
                  <span className="faq-toggle">{faqAbierta === i ? '−' : '+'}</span>
                </div>
                {faqAbierta === i && (
                  <div className="faq-respuesta">{faq.respuesta}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="seccion cta-final">
        <div className="contenedor">
          <h2>¿Lista para entrar al Círculo?</h2>
          <p>Únete a cientos de elegidos que ya están transformando su vida
          con la guía de los guardianes.</p>
          <button onClick={onTrialClick} className="cta-final-btn">
            Empezar mi prueba gratuita
          </button>
        </div>
      </section>

      {/* YA MIEMBRO */}
      <div className="ya-miembro">
        <p>¿Ya sos miembro?</p>
        <a href="/mi-magia">Entrá desde Mi Magia</a>
      </div>

      <style jsx>{`
        .landing-circulo {
          background: #050508;
          color: #ffffff;
          font-family: 'Cormorant Garamond', serif;
          min-height: 100vh;
        }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 40px 20px;
          text-align: center;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            url('https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1920&q=80') center/cover,
            radial-gradient(ellipse at 30% 20%, rgba(107, 33, 168, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(212, 175, 55, 0.2) 0%, transparent 50%);
          opacity: 0.3;
          z-index: 0;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 700px;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 8px 20px;
          border-radius: 50px;
          font-family: 'Cinzel', serif;
          font-size: 12px;
          letter-spacing: 3px;
          color: #d4af37;
          margin-bottom: 30px;
        }

        .hero h1 {
          font-family: 'Tangerine', cursive;
          font-size: clamp(60px, 15vw, 100px);
          font-weight: 700;
          background: linear-gradient(135deg, #d4af37, #e8d5a3, #d4af37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 20px;
          line-height: 1;
        }

        .hero-subtitulo {
          font-size: clamp(18px, 3vw, 22px);
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .hero-cta {
          background: linear-gradient(135deg, #d4af37, #c9a227);
          color: #0a0a0a;
          border: none;
          padding: 20px 50px;
          border-radius: 50px;
          font-family: 'Cinzel', serif;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.4);
        }

        .hero-cta:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(212, 175, 55, 0.5);
        }

        .cta-icon {
          font-size: 24px;
        }

        .hero-nota {
          margin-top: 15px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
        }

        .hero-scroll {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          font-size: 14px;
        }

        .scroll-arrow {
          margin-top: 10px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }

        /* SECCIONES GENERALES */
        .seccion {
          padding: 100px 20px;
        }

        .contenedor {
          max-width: 1100px;
          margin: 0 auto;
        }

        .seccion h2 {
          font-family: 'Cinzel', serif;
          font-size: clamp(28px, 5vw, 40px);
          text-align: center;
          margin-bottom: 50px;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* QUÉ ES */
        .que-es {
          background: linear-gradient(180deg, #050508 0%, #0a0a0f 100%);
        }

        .que-es-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .que-es-texto p {
          font-size: 18px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 20px;
        }

        .que-es-texto .destacado {
          font-size: 22px;
          color: #ffffff;
          font-weight: 500;
        }

        .que-es-imagen {
          text-align: center;
        }

        .que-es-imagen img {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(212, 175, 55, 0.4);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 175, 55, 0.2);
        }

        .imagen-caption {
          display: block;
          margin-top: 15px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }

        @media (max-width: 768px) {
          .que-es-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .que-es-imagen {
            order: -1;
          }
        }

        /* DUENDE DE LA SEMANA */
        .duende-semana {
          background:
            radial-gradient(ellipse at 50% 50%, rgba(107, 33, 168, 0.1) 0%, transparent 50%),
            #0a0a0f;
        }

        .duende-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .duende-icono {
          font-size: 40px;
        }

        .duende-intro {
          text-align: center;
          font-size: 20px;
          color: rgba(255, 255, 255, 0.7);
          max-width: 700px;
          margin: 0 auto 50px;
          line-height: 1.7;
        }

        .duende-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .duende-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px 30px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .duende-card:hover {
          border-color: rgba(212, 175, 55, 0.3);
          transform: translateY(-5px);
        }

        .card-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          font-family: 'Cinzel', serif;
          font-size: 20px;
          font-weight: 700;
          border-radius: 50%;
          margin-bottom: 20px;
        }

        .duende-card h3 {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          color: #d4af37;
          margin-bottom: 15px;
        }

        .duende-card p {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .duende-cards {
            grid-template-columns: 1fr;
          }
        }

        /* PLANES */
        .planes {
          background: linear-gradient(180deg, #0a0a0f 0%, #050508 100%);
        }

        .planes-intro {
          text-align: center;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: -30px;
          margin-bottom: 50px;
        }

        .planes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
          max-width: 900px;
          margin: 0 auto;
        }

        .plan-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          padding: 40px 30px;
          position: relative;
          transition: all 0.3s ease;
        }

        .plan-card:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .plan-card.destacado {
          border-color: rgba(212, 175, 55, 0.5);
          background: rgba(212, 175, 55, 0.05);
        }

        .plan-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          padding: 6px 20px;
          border-radius: 20px;
          font-family: 'Cinzel', serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          white-space: nowrap;
        }

        .plan-header {
          text-align: center;
          padding-bottom: 25px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 25px;
        }

        .plan-header h3 {
          font-family: 'Cinzel', serif;
          font-size: 22px;
          color: #ffffff;
          margin-bottom: 20px;
        }

        .plan-precio {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 8px;
        }

        .precio-usd {
          font-size: 48px;
          font-weight: 700;
          color: #d4af37;
        }

        .precio-periodo {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.5);
        }

        .precio-uyu {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 5px;
        }

        .precio-mensual {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 10px;
        }

        .ahorro {
          color: #4ade80;
          font-weight: 600;
        }

        .plan-beneficios {
          list-style: none;
          padding: 0;
          margin: 0 0 30px;
        }

        .plan-beneficios li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 0;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.8);
        }

        .beneficio-icono {
          flex-shrink: 0;
          width: 24px;
          text-align: center;
        }

        .beneficio-texto {
          flex: 1;
        }

        .beneficio-valor {
          font-size: 12px;
          color: rgba(212, 175, 55, 0.8);
          background: rgba(212, 175, 55, 0.1);
          padding: 2px 8px;
          border-radius: 10px;
        }

        .plan-btn {
          display: block;
          width: 100%;
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          padding: 15px;
          border-radius: 50px;
          transition: all 0.3s ease;
        }

        .plan-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .plan-card.destacado .plan-btn {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          border-color: transparent;
          color: #0a0a0a;
        }

        .plan-card.destacado .plan-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        @media (max-width: 768px) {
          .planes-grid {
            grid-template-columns: 1fr;
          }
        }

        .trial-cta-section {
          text-align: center;
          margin-top: 60px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }

        .trial-cta-section p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 20px;
        }

        .trial-cta-btn {
          background: transparent;
          border: 2px solid #d4af37;
          color: #d4af37;
          padding: 15px 40px;
          border-radius: 50px;
          font-family: 'Cinzel', serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .trial-cta-btn:hover {
          background: rgba(212, 175, 55, 0.1);
        }

        /* TESTIMONIOS */
        .testimonios {
          background:
            radial-gradient(ellipse at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
            #0a0a0f;
        }

        .testimonios-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .testimonio-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
        }

        .testimonio-texto {
          font-size: 16px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .testimonio-autor {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .autor-nombre {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          color: #d4af37;
        }

        .autor-tiempo {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 768px) {
          .testimonios-grid {
            grid-template-columns: 1fr;
          }
        }

        /* FAQ */
        .faq {
          background: linear-gradient(180deg, #0a0a0f 0%, #050508 100%);
        }

        .faq-lista {
          max-width: 700px;
          margin: 0 auto;
        }

        .faq-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
        }

        .faq-pregunta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px 0;
          font-size: 18px;
          color: #ffffff;
          transition: color 0.3s ease;
        }

        .faq-item:hover .faq-pregunta {
          color: #d4af37;
        }

        .faq-toggle {
          font-size: 24px;
          color: #d4af37;
        }

        .faq-respuesta {
          padding: 0 0 25px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
        }

        /* CTA FINAL */
        .cta-final {
          background:
            radial-gradient(ellipse at 50% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 60%),
            #050508;
          text-align: center;
          padding: 120px 20px;
        }

        .cta-final h2 {
          font-size: clamp(32px, 6vw, 48px);
          margin-bottom: 20px;
        }

        .cta-final p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 40px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-final-btn {
          background: linear-gradient(135deg, #d4af37, #c9a227);
          color: #0a0a0a;
          border: none;
          padding: 20px 50px;
          border-radius: 50px;
          font-family: 'Cinzel', serif;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.4);
        }

        .cta-final-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(212, 175, 55, 0.5);
        }

        /* YA MIEMBRO */
        .ya-miembro {
          text-align: center;
          padding: 40px 20px 60px;
          background: #050508;
        }

        .ya-miembro p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 10px;
        }

        .ya-miembro a {
          color: #d4af37;
          text-decoration: none;
          font-size: 14px;
        }

        .ya-miembro a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODAL DE PRUEBA GRATUITA (OVERLAY)
// ═══════════════════════════════════════════════════════════════════════════════

function ModalTrialPrueba({ onCerrar, onExito }) {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [intencion, setIntencion] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!aceptaTerminos) {
      setError('Debes aceptar los términos para continuar');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/mi-magia/circulo/prueba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombre, intencion })
      });

      const data = await res.json();

      if (data.success) {
        onExito({ email, nombre, ...data });
      } else {
        setError(data.error || 'Error al activar la prueba');
      }
    } catch (err) {
      console.error('Error activando trial:', err);
      setError('Error de conexión. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-trial-overlay">
      <div className="modal-trial-card">
        <button onClick={onCerrar} className="modal-cerrar">✕</button>

        {/* Contador visual */}
        <div className="countdown-visual">
          <div className="countdown-circle">
            <span className="countdown-number">15</span>
            <span className="countdown-label">días</span>
          </div>
          <p className="countdown-texto">de acceso completo</p>
        </div>

        <h2>Tu prueba gratuita te espera</h2>
        <p className="modal-subtitulo">Sin tarjeta de crédito · Sin compromisos</p>

        <form onSubmit={handleSubmit} className="form-modal-trial">
          <div className="campo-modal">
            <label>Tu nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="¿Cómo te llamás?"
              required
            />
          </div>

          <div className="campo-modal">
            <label>Tu email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@email.com"
              required
            />
          </div>

          <div className="campo-modal">
            <label>¿Qué buscás en el Círculo?</label>
            <textarea
              value={intencion}
              onChange={(e) => setIntencion(e.target.value)}
              placeholder="Contanos qué te gustaría encontrar, qué te atrajo del Círculo, o qué momento estás atravesando..."
              rows={3}
            />
          </div>

          <div className="campo-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span>Acepto los <a href="/terminos" target="_blank">términos y condiciones</a> y la <a href="/privacidad" target="_blank">política de privacidad</a></span>
            </label>
          </div>

          {error && <div className="error-modal">{error}</div>}

          <button type="submit" className="btn-comenzar" disabled={loading || !aceptaTerminos}>
            {loading ? (
              <span className="loading-spinner">Activando tu magia...</span>
            ) : (
              <>✨ Comenzar mi prueba gratuita</>
            )}
          </button>
        </form>

        <div className="beneficios-mini">
          <span>✦ 100 runas de regalo</span>
          <span>✦ 1 tirada gratis</span>
          <span>✦ Acceso completo</span>
        </div>
      </div>

      <style jsx>{`
        .modal-trial-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-trial-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
          border: 1px solid #d4af37;
          border-radius: 20px;
          padding: 2.5rem;
          max-width: 480px;
          width: 100%;
          position: relative;
          box-shadow: 0 0 60px rgba(212, 175, 55, 0.2);
          animation: slideUp 0.4s ease;
          max-height: 90vh;
          overflow-y: auto;
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-cerrar {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          color: #888;
          font-size: 1.5rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .modal-cerrar:hover { color: #d4af37; }

        .countdown-visual {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .countdown-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 3px solid #d4af37;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.5rem;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
          animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
          50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.5); }
        }
        .countdown-number {
          font-family: 'Cinzel', serif;
          font-size: 2.5rem;
          color: #d4af37;
          font-weight: 700;
          line-height: 1;
        }
        .countdown-label {
          font-size: 0.8rem;
          color: #d4af37;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .countdown-texto {
          color: #FDF8F0;
          font-size: 1rem;
          margin: 0;
        }

        h2 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          text-align: center;
          font-size: 1.5rem;
          margin: 0 0 0.5rem;
        }
        .modal-subtitulo {
          text-align: center;
          color: #888;
          font-size: 0.9rem;
          margin: 0 0 1.5rem;
        }

        .form-modal-trial {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .campo-modal label {
          display: block;
          color: #FDF8F0;
          font-size: 0.9rem;
          margin-bottom: 0.4rem;
        }
        .campo-modal input,
        .campo-modal textarea {
          width: 100%;
          padding: 0.8rem 1rem;
          background: #0d0d0d;
          border: 1px solid #333;
          border-radius: 10px;
          color: #FDF8F0;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .campo-modal input:focus,
        .campo-modal textarea:focus {
          outline: none;
          border-color: #d4af37;
        }
        .campo-modal input::placeholder,
        .campo-modal textarea::placeholder {
          color: #666;
        }
        .campo-modal textarea {
          resize: none;
        }

        .campo-checkbox {
          margin: 0.5rem 0;
        }
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          color: #999;
          font-size: 0.85rem;
          line-height: 1.4;
        }
        .checkbox-label input {
          display: none;
        }
        .checkmark {
          width: 20px;
          height: 20px;
          min-width: 20px;
          border: 2px solid #555;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .checkbox-label input:checked + .checkmark {
          background: #d4af37;
          border-color: #d4af37;
        }
        .checkbox-label input:checked + .checkmark::after {
          content: '✓';
          color: #0d0d0d;
          font-size: 14px;
          font-weight: bold;
        }
        .checkbox-label a {
          color: #d4af37;
          text-decoration: underline;
        }

        .error-modal {
          background: rgba(220, 53, 69, 0.15);
          border: 1px solid #dc3545;
          color: #ff6b7a;
          padding: 0.8rem;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
        }

        .btn-comenzar {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #0d0d0d;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 0.5rem;
        }
        .btn-comenzar:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
        }
        .btn-comenzar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .beneficios-mini {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #333;
          flex-wrap: wrap;
        }
        .beneficios-mini span {
          color: #888;
          font-size: 0.8rem;
        }

        @media (max-width: 500px) {
          .modal-trial-card {
            padding: 1.5rem;
          }
          h2 { font-size: 1.3rem; }
          .countdown-circle {
            width: 80px;
            height: 80px;
          }
          .countdown-number { font-size: 2rem; }
          .beneficios-mini {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

// FORMULARIO DE TRIAL (VERSIÓN LEGACY - MANTENER POR COMPATIBILIDAD)
// ═══════════════════════════════════════════════════════════════════════════════

function FormularioTrial({ onVolver, onExito }) {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/mi-magia/circulo/prueba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombre })
      });

      const data = await res.json();

      if (data.success) {
        onExito({ email, nombre, ...data });
      } else {
        setError(data.error || 'Error al activar la prueba');
      }
    } catch (err) {
      console.error('Error activando trial:', err);
      setError('Error de conexión. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="trial-form-page">
      <div className="contenido">
        <button onClick={onVolver} className="btn-volver">← Volver</button>

        <div className="tito-avatar">
          <img src={IMAGEN_TITO} alt="Tito" />
        </div>

        <h1>15 Días Gratis</h1>
        <p className="subtitulo">Acceso completo al Círculo sin compromiso</p>

        <form onSubmit={handleSubmit} className="form-trial">
          <div className="campo">
            <label>Tu nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="¿Cómo te llamás?"
              required
            />
          </div>

          <div className="campo">
            <label>Tu email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@email.com"
              required
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn-activar" disabled={loading}>
            {loading ? 'Activando...' : 'Activar mi prueba gratuita'}
          </button>

          <p className="nota">Sin tarjeta de crédito · Solo una vez por email</p>
        </form>

        <div className="beneficios-trial">
          <h3>Qué incluye tu prueba:</h3>
          <ul>
            <li>✦ Acceso completo al Círculo por 15 días</li>
            <li>✦ Guardián de la semana con mensajes únicos</li>
            <li>✦ Guía lunar del mes</li>
            <li>✦ Rituales y prácticas exclusivas</li>
            <li>✦ 100 runas de regalo para explorar</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .trial-form-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
            linear-gradient(180deg, #050508 0%, #0a0a0a 100%);
          color: #ffffff;
          font-family: 'Cormorant Garamond', serif;
          padding: 40px 20px;
        }

        .contenido {
          text-align: center;
          max-width: 450px;
          width: 100%;
        }

        .btn-volver {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 30px;
        }

        .btn-volver:hover {
          color: #ffffff;
        }

        .tito-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 20px;
          border: 3px solid rgba(212, 175, 55, 0.5);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .tito-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        h1 {
          font-family: 'Tangerine', cursive;
          font-size: 60px;
          font-weight: 700;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 10px;
        }

        .subtitulo {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 40px;
        }

        .form-trial {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
        }

        .campo {
          margin-bottom: 20px;
          text-align: left;
        }

        .campo label {
          display: block;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }

        .campo input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          padding: 14px 18px;
          border-radius: 10px;
          font-size: 16px;
          font-family: inherit;
          box-sizing: border-box;
        }

        .campo input:focus {
          outline: none;
          border-color: #d4af37;
        }

        .campo input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .error-msg {
          background: rgba(255, 100, 100, 0.1);
          border: 1px solid rgba(255, 100, 100, 0.3);
          color: rgba(255, 200, 200, 0.9);
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .btn-activar {
          width: 100%;
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          border: none;
          padding: 18px;
          border-radius: 50px;
          font-family: 'Cinzel', serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-activar:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.3);
        }

        .btn-activar:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .nota {
          margin-top: 15px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
        }

        .beneficios-trial {
          text-align: left;
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 15px;
          padding: 25px;
        }

        .beneficios-trial h3 {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          color: #d4af37;
          margin: 0 0 15px;
        }

        .beneficios-trial ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .beneficios-trial li {
          padding: 8px 0;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BIENVENIDA DEL GUARDIÁN DE LA SEMANA
// ═══════════════════════════════════════════════════════════════════════════════

function BienvenidaGuardian({ usuario, onContinuar }) {
  const [guardian, setGuardian] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarBienvenida();
  }, []);

  async function cargarBienvenida() {
    try {
      const res = await fetch('/api/circulo/bienvenida-guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario?.email,
          nombre: usuario?.nombrePreferido || usuario?.nombre,
          perfil: usuario?.perfil
        })
      });

      const data = await res.json();

      if (data.success) {
        setGuardian(data.guardian);
        setMensaje(data.mensaje);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error cargando bienvenida:', err);
      setError('No pudimos conectar con el guardián');
    } finally {
      setCargando(false);
    }
  }

  if (cargando) {
    return (
      <div className="bienvenida-container">
        <div className="bienvenida-loading">
          <div className="loading-orb"></div>
          <p>Conectando con tu guardián...</p>
        </div>
        <style jsx>{`
          .bienvenida-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(ellipse at center, rgba(107, 33, 168, 0.15) 0%, transparent 50%),
                        linear-gradient(180deg, #050508 0%, #0a0a0a 100%);
            font-family: 'Cormorant Garamond', serif;
          }
          .bienvenida-loading {
            text-align: center;
            color: #fff;
          }
          .loading-orb {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #d4af37, #6b21a8);
            margin: 0 auto 20px;
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          p { font-size: 18px; color: rgba(255,255,255,0.7); }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bienvenida-container">
        <div className="bienvenida-error">
          <p>{error}</p>
          <button onClick={onContinuar}>Continuar de todos modos</button>
        </div>
        <style jsx>{`
          .bienvenida-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(180deg, #050508 0%, #0a0a0a 100%);
            font-family: 'Cormorant Garamond', serif;
          }
          .bienvenida-error {
            text-align: center;
            color: #fff;
          }
          p { margin-bottom: 20px; }
          button {
            background: #d4af37;
            color: #0a0a0a;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-family: 'Cinzel', serif;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="bienvenida-container">
      <div className="bienvenida-card">
        {/* Partículas de fondo */}
        <div className="particulas">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particula" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>

        {/* Imagen del guardián */}
        <div className="guardian-imagen-container">
          <div className="guardian-glow" style={{ background: guardian?.color || '#d4af37' }}></div>
          <img
            src={guardian?.imagen || IMAGEN_TITO}
            alt={guardian?.nombre}
            className="guardian-imagen"
          />
        </div>

        {/* Info del guardián */}
        <div className="guardian-info">
          <span className="guardian-tag">Guardián de la Semana</span>
          <h1>{guardian?.nombre}</h1>
          <p className="guardian-especialidad">✦ {guardian?.especialidad}</p>
        </div>

        {/* Mensaje personalizado */}
        <div className="mensaje-container">
          <div className="mensaje-burbuja">
            {mensaje.split('\n\n').map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>
        </div>

        {/* Botón continuar */}
        <button onClick={onContinuar} className="btn-continuar">
          ✨ Entrar al Círculo
        </button>
      </div>

      <style jsx>{`
        .bienvenida-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at 30% 20%, rgba(107, 33, 168, 0.2) 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                      linear-gradient(180deg, #050508 0%, #0a0a0a 100%);
          padding: 40px 20px;
          font-family: 'Cormorant Garamond', serif;
          overflow: hidden;
        }
        .bienvenida-card {
          position: relative;
          width: 100%;
          max-width: 550px;
          background: rgba(20, 20, 25, 0.9);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 25px;
          padding: 40px 30px;
          text-align: center;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
          animation: cardAppear 0.8s ease;
        }
        @keyframes cardAppear {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .particulas {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
          border-radius: 25px;
        }
        .particula {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #d4af37;
          border-radius: 50%;
          opacity: 0;
          animation: floatUp linear infinite;
        }
        @keyframes floatUp {
          0% { transform: translateY(100%); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }

        .guardian-imagen-container {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto 25px;
        }
        .guardian-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 180px;
          height: 180px;
          border-radius: 50%;
          opacity: 0.3;
          filter: blur(30px);
          animation: glowPulse 3s infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }
        }
        .guardian-imagen {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #d4af37;
          position: relative;
          z-index: 1;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .guardian-info {
          margin-bottom: 25px;
        }
        .guardian-tag {
          display: inline-block;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1));
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 6px 15px;
          border-radius: 20px;
          font-size: 12px;
          color: #d4af37;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 15px;
        }
        h1 {
          font-family: 'Tangerine', cursive;
          font-size: 56px;
          color: #d4af37;
          margin: 0 0 10px;
          text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
        }
        .guardian-especialidad {
          color: rgba(255, 255, 255, 0.7);
          font-size: 16px;
          margin: 0;
        }

        .mensaje-container {
          margin-bottom: 30px;
        }
        .mensaje-burbuja {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 25px;
          text-align: left;
        }
        .mensaje-burbuja p {
          color: #FDF8F0;
          font-size: 16px;
          line-height: 1.7;
          margin: 0 0 15px;
        }
        .mensaje-burbuja p:last-child {
          margin-bottom: 0;
        }

        .btn-continuar {
          width: 100%;
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          border: none;
          padding: 18px 30px;
          border-radius: 50px;
          font-family: 'Cinzel', serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-continuar:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.4);
        }

        @media (max-width: 550px) {
          .bienvenida-card { padding: 30px 20px; }
          h1 { font-size: 44px; }
          .guardian-imagen-container { width: 120px; height: 120px; }
          .guardian-imagen { width: 120px; height: 120px; }
          .mensaje-burbuja { padding: 20px; }
          .mensaje-burbuja p { font-size: 15px; }
        }
      `}</style>
    </div>
  );
}

// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function CirculoPage() {
  const [estado, setEstado] = useState('verificando');
  const [usuario, setUsuario] = useState(null);
  const [diasTrial, setDiasTrial] = useState(null);

  useEffect(() => {
    verificarAcceso();
  }, []);

  async function verificarAcceso() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || localStorage.getItem('circulo_token');

    if (!token) {
      setEstado('landing');
      return;
    }

    try {
      const res = await fetch('/api/circulo/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (data.success && data.acceso) {
        const usuarioData = data.usuario;
        setUsuario(usuarioData);
        localStorage.setItem('circulo_token', token);

        if (usuarioData?.membresia?.esTrial && usuarioData?.membresia?.fechaVencimiento) {
          const fechaVencimiento = new Date(usuarioData.membresia.fechaVencimiento);
          const hoy = new Date();
          const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
          setDiasTrial(Math.max(0, diasRestantes));
        }

        const perfilRes = await fetch(`/api/circulo/perfil?email=${encodeURIComponent(usuarioData.email)}`);
        const perfilData = await perfilRes.json();

        if (!perfilData.existe || !perfilData.perfil?.onboardingCompletado) {
          setEstado('onboarding');
        } else {
          const hoy = new Date().toISOString().split('T')[0];
          const ultimaVisita = localStorage.getItem('circulo_ultima_visita');

          if (ultimaVisita === hoy) {
            setEstado('dashboard');
          } else {
            setEstado('portal');
          }
        }
      } else {
        setEstado('landing');
      }
    } catch (err) {
      console.error('Error verificando acceso:', err);
      setEstado('landing');
    }
  }

  function handleOnboardingComplete(datos) {
    setUsuario(prev => ({
      ...prev,
      nombre: datos.nombrePreferido || prev?.nombre,
      nombrePreferido: datos.nombrePreferido,
      perfil: datos
    }));
    // Ir a bienvenida del guardián en lugar de portal
    setEstado('bienvenida');
  }

  function handleEntrarAlCirculo() {
    const hoy = new Date().toISOString().split('T')[0];
    localStorage.setItem('circulo_ultima_visita', hoy);
    setEstado('dashboard');
  }

  function handleTrialExito(datos) {
    setUsuario({ email: datos.email, nombre: datos.nombre });
    setDiasTrial(15);
    setEstado('onboarding');
  }

  // VERIFICANDO
  if (estado === 'verificando') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050508',
        color: '#fff',
        fontFamily: "'Cormorant Garamond', serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '60px',
            color: '#d4af37',
            animation: 'pulse 2s ease-in-out infinite'
          }}>ᚱ</div>
          <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.6)' }}>
            Verificando acceso al Círculo...
          </p>
        </div>
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        `}</style>
      </div>
    );
  }

  // LANDING (NO ACCESO) - Con modal de trial superpuesto
  if (estado === 'landing' || estado === 'trial_form') {
    return (
      <>
        <div className={estado === 'trial_form' ? 'landing-blur' : ''}>
          <LandingCirculo onTrialClick={() => setEstado('trial_form')} />
        </div>
        {estado === 'trial_form' && (
          <ModalTrialPrueba
            onCerrar={() => setEstado('landing')}
            onExito={handleTrialExito}
          />
        )}
        <style jsx>{`
          .landing-blur {
            filter: blur(5px);
            pointer-events: none;
          }
        `}</style>
      </>
    );
  }

  // ONBOARDING
  if (estado === 'onboarding') {
    return (
      <Onboarding
        email={usuario?.email}
        nombreInicial={usuario?.nombre}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // BIENVENIDA DEL GUARDIÁN DE LA SEMANA
  if (estado === 'bienvenida') {
    return (
      <BienvenidaGuardian
        usuario={usuario}
        onContinuar={() => setEstado('portal')}
      />
    );
  }

  // PORTAL
  if (estado === 'portal') {
    return (
      <PortalEntrada
        onEntrar={handleEntrarAlCirculo}
        usuarioNombre={usuario?.nombrePreferido || usuario?.nombre}
      />
    );
  }

  // DASHBOARD
  if (estado === 'dashboard') {
    return (
      <>
        {usuario?.membresia?.esTrial && diasTrial > 0 && (
          <div style={{ padding: '20px 20px 0', maxWidth: '1200px', margin: '0 auto' }}>
            <TrialBanner
              diasRestantes={diasTrial}
              onSuscribirse={() => window.open(`${WORDPRESS_URL}/producto/circulo-anual/`, '_blank')}
            />
          </div>
        )}
        <CirculoDashboard usuario={usuario} />
      </>
    );
  }

  return null;
}
