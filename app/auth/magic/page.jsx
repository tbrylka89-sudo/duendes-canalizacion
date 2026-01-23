'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA DE MAGIC LINK - Valida token y redirige
// ═══════════════════════════════════════════════════════════════════════════════

export default function MagicLinkPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [estado, setEstado] = useState('validando');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setEstado('error');
      setError('Enlace inválido');
      return;
    }

    validarToken(token);
  }, [searchParams]);

  const validarToken = async (token) => {
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (data.success) {
        setEstado('exito');
        // Guardar token en localStorage
        localStorage.setItem('duendes_token', data.usuario.token);
        localStorage.setItem('duendes_email', data.usuario.email);
        localStorage.setItem('duendes_nombre', data.usuario.nombre || '');

        // Redirigir a Mi Magia con token
        setTimeout(() => {
          router.push(`/mi-magia?token=${data.usuario.token}`);
        }, 1500);
      } else {
        setEstado('error');
        setError(data.error || 'Enlace inválido o expirado');
      }
    } catch (err) {
      setEstado('error');
      setError('Error de conexión. Intentá de nuevo.');
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
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        {estado === 'validando' && (
          <>
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 20px',
              border: '3px solid rgba(212, 175, 55, 0.3)',
              borderTopColor: '#d4af37',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <h2 style={{ color: '#d4af37', marginBottom: '10px' }}>Verificando...</h2>
            <p style={{ color: '#a0a0a0' }}>Un momento mientras validamos tu enlace mágico</p>
          </>
        )}

        {estado === 'exito' && (
          <>
            <div style={{
              fontSize: '60px',
              marginBottom: '20px'
            }}>✨</div>
            <h2 style={{ color: '#d4af37', marginBottom: '10px' }}>¡Bienvenida!</h2>
            <p style={{ color: '#a0a0a0' }}>Redirigiendo a Mi Magia...</p>
          </>
        )}

        {estado === 'error' && (
          <>
            <div style={{
              fontSize: '60px',
              marginBottom: '20px'
            }}>🔮</div>
            <h2 style={{ color: '#d4af37', marginBottom: '10px' }}>Enlace expirado</h2>
            <p style={{ color: '#a0a0a0', marginBottom: '20px' }}>{error}</p>
            <button
              onClick={() => router.push('/mi-magia/login')}
              style={{
                background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
                color: '#1a1a1a',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Solicitar nuevo enlace
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
