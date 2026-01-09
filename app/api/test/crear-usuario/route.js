import { kv } from '@vercel/kv';

export async function GET() {
  const email = 'test@duendes.com';
  
  await kv.set(`elegido:${email}`, {
    email: email,
    nombre: 'María Test',
    nombrePreferido: 'Mari',
    pronombre: 'ella',
    treboles: 50,
    runas: 30,
    guardianes: [],
    totalCompras: 100,
    onboardingCompleto: true
  });
  
  await kv.set('token:TEST123', {
    email: email,
    nombre: 'María Test'
  });
  
  return Response.json({ 
    success: true, 
    mensaje: 'Usuario de prueba creado',
    url: 'https://duendes-vercel.vercel.app/mi-magia?token=TEST123'
  });
}
