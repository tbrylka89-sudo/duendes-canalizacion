import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const token = 'TEST123';
  
  const elegido = {
    nombre: 'Usuario Test',
    email: 'test@duendes.com',
    genero: null,
    treboles: 45,
    runas: 25,
    totalCompras: 450,
    tiradaGratisUsada: false,
    guardianes: [
      {
        id: 'guardian-1',
        nombre: 'Finnegan el Guardián del Bosque',
        imagen: null,
        categorias: ['proteccion'],
        fechaCompra: '2025-12-15',
        guiaContent: {
          mensaje_canalizado: 'Querida amiga, te he observado desde hace tiempo. Sé de tus luchas, de tus noches sin dormir pensando en el futuro. Vine a decirte que todo va a estar bien. Mi misión es proteger tu hogar y tu corazón.'
        }
      }
    ],
    lecturas: [],
    canjes: [],
    createdAt: new Date().toISOString()
  };

  await kv.set(`elegido:${token}`, elegido);

  return res.status(200).json({ 
    success: true, 
    token,
    url: `https://duendes-vercel.vercel.app/mi-magia?token=${token}`
  });
}
