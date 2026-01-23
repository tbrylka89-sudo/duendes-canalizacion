'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CirculoRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Construir URL de destino preservando query params (token, etc.)
    const params = searchParams.toString();
    const destino = params
      ? `/mi-magia/circulo?${params}`
      : '/mi-magia/circulo';

    router.replace(destino);
  }, [router, searchParams]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#050508',
      color: '#d4af37',
      fontFamily: "'Cormorant Garamond', serif"
    }}>
      <p>Redirigiendo al Circulo...</p>
    </div>
  );
}

export default function CirculoRedirect() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050508',
        color: '#d4af37',
        fontFamily: "'Cormorant Garamond', serif"
      }}>
        <p>Cargando...</p>
      </div>
    }>
      <CirculoRedirectInner />
    </Suspense>
  );
}
