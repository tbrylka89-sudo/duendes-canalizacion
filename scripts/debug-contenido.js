import { kv } from '@vercel/kv';

async function debug() {
  const contenidos = await kv.get('circulo:contenido:2026:1');

  if (!contenidos || !Array.isArray(contenidos)) {
    console.log('Estructura:', typeof contenidos, contenidos);
    return;
  }

  console.log(`Total: ${contenidos.length}\n`);

  // Mostrar estructura del primero
  console.log('Estructura del primer item:');
  console.log(JSON.stringify(contenidos[0], null, 2));

  // Buscar "Enraizarte"
  console.log('\n--- Buscando "Enraizarte" ---');
  for (let i = 0; i < contenidos.length; i++) {
    const c = contenidos[i];
    if (c.titulo && c.titulo.includes('Enraizarte')) {
      console.log(`Índice ${i}:`);
      console.log(JSON.stringify(c, null, 2));
    }
  }
}

debug().catch(console.error);
