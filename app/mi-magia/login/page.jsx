'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA DE LOGIN - Acceso con email y magic link
// ═══════════════════════════════════════════════════════════════════════════════

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState('inicial'); // inicial, enviando, enviado, error
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setEstado('error');
      setMensaje('Ingresá un email válido');
      return;
    }

    setEstado('enviando');

    try {
      // Usar la API de crear cliente que maneja anti-duplicados
      const res = await fetch('/api/admin/clientes/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          enviarEmail: true
        })
      });

      const data = await res.json();

      if (data.success) {
        setEstado('enviado');
        if (data.yaExistia) {
          setMensaje('Te enviamos un enlace mágico a tu email. Revisá tu bandeja de entrada.');
        } else {
          setMensaje('¡Cuenta creada! Te enviamos un email de bienvenida con tu acceso.');
        }
      } else {
        setEstado('error');
        setMensaje(data.error || 'Algo salió mal. Intentá de nuevo.');
      }
    } catch (err) {
      setEstado('error');
      setMensaje('Error de conexión. Intentá de nuevo.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(26, 26, 46, 0.9)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '420px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '28px',
            color: '#d4af37',
            marginBottom: '10px'
          }}>
            Mi Magia ✨
          </h1>
          <p style={{ color: '#a0a0a0' }}>
            Entrá a tu espacio personal
          </p>
        </div>

        {estado === 'enviado' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>📧</div>
            <h3 style={{ color: '#d4af37', marginBottom: '15px' }}>¡Revisá tu email!</h3>
            <p style={{ color: '#a0a0a0', lineHeight: '1.6' }}>{mensaje}</p>
            <button
              onClick={() => setEstado('inicial')}
              style={{
                marginTop: '20px',
                background: 'transparent',
                border: '1px solid #d4af37',
                color: '#d4af37',
                padding: '10px 20px',
                borderRadius: '50px',
                cursor: 'pointer'
              }}
            >
              Usar otro email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#d4af37',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                Tu email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hola@ejemplo.com"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '10px',
                  color: '#f5f5dc',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {estado === 'error' && (
              <p style={{
                color: '#ff6b6b',
                fontSize: '14px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                {mensaje}
              </p>
            )}

            <button
              type="submit"
              disabled={estado === 'enviando'}
              style={{
                width: '100%',
                padding: '14px',
                background: estado === 'enviando'
                  ? 'rgba(212, 175, 55, 0.5)'
                  : 'linear-gradient(135deg, #d4af37, #f4d03f)',
                border: 'none',
                borderRadius: '50px',
                color: '#1a1a1a',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: estado === 'enviando' ? 'wait' : 'pointer'
              }}
            >
              {estado === 'enviando' ? 'Enviando...' : 'Enviarme el enlace mágico'}
            </button>

            <p style={{
              marginTop: '20px',
              textAlign: 'center',
              color: '#666',
              fontSize: '13px'
            }}>
              Sin contraseñas. Te enviamos un enlace seguro a tu email.
            </p>
          </form>
        )}

        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          textAlign: 'center'
        }}>
          <a
            href="/"
            style={{
              color: '#888',
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
