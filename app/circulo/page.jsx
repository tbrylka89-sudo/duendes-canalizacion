'use client';
import { useState, useEffect } from 'react';
import PortalEntrada from './PortalEntrada';
import CirculoDashboard from './Dashboard';
import Onboarding from './Onboarding';

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL DEL CÍRCULO DE DUENDES
// Flujo: Verificar acceso → Onboarding (primera vez) → Portal de entrada → Dashboard
// ═══════════════════════════════════════════════════════════════════════════════

export default function CirculoPage() {
  const [estado, setEstado] = useState('verificando'); // verificando, no_acceso, onboarding, portal, dashboard
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);

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
        setUsuario(data.usuario);
        localStorage.setItem('circulo_token', token);

        // Verificar si ya completó el onboarding
        const perfilRes = await fetch(`/api/circulo/perfil?email=${encodeURIComponent(data.usuario.email)}`);
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

          <div className="mensaje-error">
            {error || 'Necesitás ser miembro del Círculo para acceder a este contenido.'}
          </div>

          <div className="opciones">
            <a href="/circulo-info" className="btn-info">
              Conocer más sobre el Círculo
            </a>
            <a href="/" className="btn-volver">
              Volver al inicio
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
    return <CirculoDashboard usuario={usuario} />;
  }

  return null;
}
