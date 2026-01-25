import { kv } from '@vercel/kv';
import crypto from 'crypto';

const email = 'test' + Date.now() + '@duendes.test';
const token = crypto.randomBytes(32).toString('hex');

// Crear usuario con membresía activa
const usuario = {
  email,
  nombre: 'Usuario Test',
  activo: true,
  membresia: {
    tipo: 'anual',
    activa: true,
    fechaInicio: new Date().toISOString(),
    fechaVencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  },
  token,
  creadoEn: new Date().toISOString()
};

// Guardar en múltiples keys para compatibilidad
await kv.set(`circulo:${email}`, usuario);
await kv.set(`user:${email}`, usuario);
await kv.set(`elegido:${email}`, usuario);
await kv.set(`token:${token}`, { email, tipo: 'circulo' });

console.log('Usuario creado:');
console.log('Email:', email);
console.log('');
console.log('URL de acceso:');
console.log(`https://duendes-vercel.vercel.app/mi-magia/circulo?token=${token}`);
