'use client';
import { useState, useEffect } from 'react';
import PortalEntrada from './PortalEntrada';
import CirculoDashboard from './Dashboard';
import Onboarding from './Onboarding';

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL DEL CÍRCULO DE DUENDES
// Flujo: Verificar acceso → Onboarding (primera vez) → Portal de entrada → Dashboard
// ═══════════════════════════════════════════════════════════════════════════════

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
        .trial-icon {
          font-size: 24px;
        }
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

export default function CirculoPage() {
  const [estado, setEstado] = useState('verificando'); // verificando, no_acceso, trial_form, onboarding, portal, dashboard
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);
  const [trialEmail, setTrialEmail] = useState('');
  const [trialNombre, setTrialNombre] = useState('');
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialError, setTrialError] = useState(null);
  const [diasTrial, setDiasTrial] = useState(null);

  useEffect(() => {
    verificarAcceso();
  }, []);

  async function verificarAcceso() {
    // Obtener token de la URL o de localStorage
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || localStorage.getItem('circulo_token');

    if (!token) {
      setEstado('no_acceso');
      return;
    }

    try {
      // Verificar token con el backend
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

        // Si es trial, calcular días restantes
        if (usuarioData?.membresia?.esTrial && usuarioData?.membresia?.fechaVencimiento) {
          const fechaVencimiento = new Date(usuarioData.membresia.fechaVencimiento);
          const hoy = new Date();
          const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
          setDiasTrial(Math.max(0, diasRestantes));
        }

        // Verificar si ya completó el onboarding
        const perfilRes = await fetch(`/api/circulo/perfil?email=${encodeURIComponent(usuarioData.email)}`);
        const perfilData = await perfilRes.json();

        if (!perfilData.existe || !perfilData.perfil?.onboardingCompletado) {
          // Primera vez - mostrar onboarding
          setEstado('onboarding');
        } else {
          // Ya hizo onboarding - verificar si vio el portal hoy
          const hoy = new Date().toISOString().split('T')[0];
          const ultimaVisita = localStorage.getItem('circulo_ultima_visita');

          if (ultimaVisita === hoy) {
            setEstado('dashboard');
          } else {
            setEstado('portal');
          }
        }
      } else {
        setEstado('no_acceso');
        setError(data.error || 'Acceso no válido');
      }
    } catch (err) {
      console.error('Error verificando acceso:', err);
      setEstado('no_acceso');
      setError('Error de conexión');
    }
  }

  function handleOnboardingComplete(datos) {
    // Actualizar usuario con datos del onboarding
    setUsuario(prev => ({
      ...prev,
      nombre: datos.nombrePreferido || prev?.nombre,
      nombrePreferido: datos.nombrePreferido
    }));
    setEstado('portal');
  }

  function handleEntrarAlCirculo() {
    // Guardar que vio el portal hoy
    const hoy = new Date().toISOString().split('T')[0];
    localStorage.setItem('circulo_ultima_visita', hoy);
    setEstado('dashboard');
  }

  // Función para activar Trial
  async function activarTrial(e) {
    e.preventDefault();
    setTrialLoading(true);
    setTrialError(null);

    try {
      const res = await fetch('/api/circulo/activar-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trialEmail, nombre: trialNombre })
      });

      const data = await res.json();

      if (data.success) {
        // Guardar token y redirigir
        localStorage.setItem('circulo_token', data.token);
        setUsuario({ email: trialEmail, nombre: trialNombre });
        setDiasTrial(15);
        setEstado('onboarding');
      } else {
        setTrialError(data.error || 'Error al activar la prueba');
      }
    } catch (err) {
      console.error('Error activando trial:', err);
      setTrialError('Error de conexión. Intentá de nuevo.');
    } finally {
      setTrialLoading(false);
    }
  }

  function mostrarFormularioTrial() {
    setEstado('trial_form');
  }

  // Estado: Verificando
  if (estado === 'verificando') {
    return (
      <div className="circulo-verificando">
        <div className="loader">
          <div className="runa">ᚱ</div>
          <p>Verificando acceso al Círculo...</p>
        </div>

        <style jsx>{`
          .circulo-verificando {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #050508;
            color: #ffffff;
            font-family: 'Cormorant Garamond', serif;
          }

          .loader {
            text-align: center;
          }

          .runa {
            font-size: 60px;
            color: #d4af37;
            animation: pulse 2s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }

          p {
            margin-top: 20px;
            font-size: 18px;
            color: rgba(255, 255, 255, 0.6);
          }
        `}</style>
      </div>
    );
  }

  // Estado: Sin acceso
  if (estado === 'no_acceso') {
    return (
      <div className="circulo-no-acceso">
        <div className="contenido">
          <h1>El Círculo de Duendes</h1>
          <p className="subtitulo">Un portal exclusivo para miembros</p>

          {/* BOTÓN DE TRIAL PROMINENTE */}
          <div className="trial-promo">
            <button onClick={mostrarFormularioTrial} className="btn-trial">
              <span className="trial-estrella">✨</span>
              Prueba 15 días GRATIS
            </button>
            <p className="trial-subtexto">Sin tarjeta de crédito · Acceso completo</p>
          </div>

          <div className="separador">
            <span>o suscribite</span>
          </div>

          <div className="opciones">
            <a href="https://duendesuy.10web.cloud/producto/circulo-semestral/" className="btn-plan">
              Semestral · $50 USD
            </a>
            <a href="https://duendesuy.10web.cloud/producto/circulo-anual/" className="btn-plan destacado">
              Anual · $80 USD <small>MEJOR VALOR · 20% OFF</small>
            </a>
          </div>

          <div className="ya-miembro">
            <p>¿Ya sos miembro?</p>
            <a href="/mi-magia">Entrá desde Mi Magia</a>
          </div>
        </div>

        <style jsx>{`
          .circulo-no-acceso {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background:
              radial-gradient(ellipse at 30% 20%, rgba(107, 33, 168, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
              linear-gradient(180deg, #050508 0%, #0a0a0a 100%);
            color: #ffffff;
            font-family: 'Cormorant Garamond', serif;
            padding: 40px 20px;
          }

          .contenido {
            text-align: center;
            max-width: 600px;
          }

          h1 {
            font-family: 'Tangerine', cursive;
            font-size: clamp(50px, 12vw, 80px);
            font-weight: 700;
            background: linear-gradient(135deg, #d4af37, #e8d5a3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
          }

          .subtitulo {
            font-size: 20px;
            font-style: italic;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 40px;
          }

          .mensaje-error {
            background: rgba(255, 100, 100, 0.1);
            border: 1px solid rgba(255, 100, 100, 0.3);
            color: rgba(255, 200, 200, 0.9);
            padding: 20px 30px;
            border-radius: 15px;
            margin-bottom: 40px;
            font-size: 16px;
          }

          .opciones {
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
          }

          .btn-info {
            display: inline-block;
            background: linear-gradient(135deg, #d4af37, #b8972e);
            color: #0a0a0a;
            font-family: 'Cinzel', serif;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-decoration: none;
            padding: 18px 40px;
            border-radius: 50px;
            transition: all 0.3s ease;
          }

          .btn-info:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(212, 175, 55, 0.3);
          }

          .btn-volver {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .btn-volver:hover {
            color: #ffffff;
          }

          .ya-miembro {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .ya-miembro p {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
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

          /* TRIAL PROMO */
          .trial-promo {
            margin-bottom: 30px;
            text-align: center;
          }

          .btn-trial {
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
            gap: 10px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 40px rgba(212, 175, 55, 0.3);
          }

          .btn-trial:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 50px rgba(212, 175, 55, 0.4);
          }

          .trial-estrella {
            font-size: 24px;
          }

          .trial-subtexto {
            margin-top: 12px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
          }

          .separador {
            display: flex;
            align-items: center;
            gap: 20px;
            margin: 30px 0;
          }

          .separador::before,
          .separador::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
          }

          .separador span {
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }

          .btn-plan {
            display: block;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
            font-family: 'Cormorant Garamond', serif;
            font-size: 16px;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 10px;
            transition: all 0.3s ease;
            margin-bottom: 10px;
          }

          .btn-plan:hover {
            border-color: #d4af37;
            background: rgba(212, 175, 55, 0.1);
          }

          .btn-plan.destacado {
            border-color: #d4af37;
            background: rgba(212, 175, 55, 0.1);
          }

          .btn-plan small {
            background: #d4af37;
            color: #0a0a0a;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            margin-left: 8px;
          }
        `}</style>
      </div>
    );
  }

  // Estado: Formulario de Trial
  if (estado === 'trial_form') {
    return (
      <div className="circulo-trial-form">
        <div className="contenido">
          <button onClick={() => setEstado('no_acceso')} className="btn-volver-trial">
            ← Volver
          </button>

          <span className="icono-grande">✨</span>
          <h1>15 Días Gratis</h1>
          <p className="subtitulo">Acceso completo al Círculo sin compromiso</p>

          <form onSubmit={activarTrial} className="trial-form">
            <div className="campo">
              <label>Tu nombre</label>
              <input
                type="text"
                value={trialNombre}
                onChange={(e) => setTrialNombre(e.target.value)}
                placeholder="¿Cómo te llamás?"
                required
              />
            </div>

            <div className="campo">
              <label>Tu email</label>
              <input
                type="email"
                value={trialEmail}
                onChange={(e) => setTrialEmail(e.target.value)}
                placeholder="tucorreo@email.com"
                required
              />
            </div>

            {trialError && (
              <div className="error-msg">{trialError}</div>
            )}

            <button type="submit" className="btn-activar" disabled={trialLoading}>
              {trialLoading ? 'Activando...' : 'Activar mi prueba gratuita'}
            </button>

            <p className="nota">
              Sin tarjeta de crédito · Solo una vez por email
            </p>
          </form>

          <div className="beneficios-trial">
            <h3>Qué incluye tu prueba:</h3>
            <ul>
              <li>Acceso completo al Círculo por 15 días</li>
              <li>Guardián de la semana con mensajes únicos</li>
              <li>Guía lunar del mes</li>
              <li>Rituales y prácticas exclusivas</li>
              <li>100 runas de regalo para explorar</li>
            </ul>
          </div>
        </div>

        <style jsx>{`
          .circulo-trial-form {
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

          .btn-volver-trial {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
            cursor: pointer;
            margin-bottom: 30px;
          }

          .btn-volver-trial:hover {
            color: #ffffff;
          }

          .icono-grande {
            font-size: 60px;
            display: block;
            margin-bottom: 20px;
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

          .trial-form {
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
            padding-left: 25px;
            position: relative;
          }

          .beneficios-trial li::before {
            content: '✦';
            position: absolute;
            left: 0;
            color: #d4af37;
          }
        `}</style>
      </div>
    );
  }

  // Estado: Onboarding (primera vez)
  if (estado === 'onboarding') {
    return (
      <Onboarding
        email={usuario?.email}
        nombreInicial={usuario?.nombre}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // Estado: Portal de entrada
  if (estado === 'portal') {
    return (
      <PortalEntrada
        onEntrar={handleEntrarAlCirculo}
        usuarioNombre={usuario?.nombrePreferido || usuario?.nombre}
      />
    );
  }

  // Estado: Dashboard
  if (estado === 'dashboard') {
    return (
      <>
        {usuario?.membresia?.esTrial && diasTrial > 0 && (
          <div style={{ padding: '20px 20px 0', maxWidth: '1200px', margin: '0 auto' }}>
            <TrialBanner
              diasRestantes={diasTrial}
              onSuscribirse={() => window.open('https://duendesuy.10web.cloud/producto/circulo-trimestral/', '_blank')}
            />
          </div>
        )}
        <CirculoDashboard usuario={usuario} />
      </>
    );
  }

  return null;
}
