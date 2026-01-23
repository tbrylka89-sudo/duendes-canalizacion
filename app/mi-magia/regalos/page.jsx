'use client';
import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RegalosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const url = token ? `/mi-magia?seccion=regalos&token=${token}` : '/mi-magia?seccion=regalos';
    router.replace(url);
  }, [router, token]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#C6A962'
    }}>
      <p>Cargando Regalos...</p>
    </div>
  );
}

export default function RegalosPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#C6A962'
      }}>
        <p>Cargando...</p>
      </div>
    }>
      <RegalosContent />
    </Suspense>
  );
}
