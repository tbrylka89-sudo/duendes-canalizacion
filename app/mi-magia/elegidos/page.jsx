'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ElegidosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    // Redirigir a mi-magia con la sección elegidos
    const url = token ? `/mi-magia?seccion=elegidos&token=${token}` : '/mi-magia?seccion=elegidos';
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
      <p>Cargando Los Elegidos...</p>
    </div>
  );
}
