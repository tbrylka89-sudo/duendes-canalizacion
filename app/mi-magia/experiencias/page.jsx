'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ExperienciasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const url = token ? `/mi-magia?seccion=experiencias&token=${token}` : '/mi-magia?seccion=experiencias';
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
      <p>Cargando Experiencias Mágicas...</p>
    </div>
  );
}
