import { kv } from '@vercel/kv';

async function buscar() {
  // Buscar en diferentes keys posibles
  const keysToCheck = [
    'contenido-semana-actual',
    'circulo:contenido-semana',
    'circulo:contenido:actual',
    'circulo:semanal',
    'contenido:semanal',
    'circulo:contenido:2026:enero',
    'semana-actual'
  ];

  for (const key of keysToCheck) {
    const data = await kv.get(key);
    if (data) {
      console.log(`\n=== ${key} ===`);
      console.log(JSON.stringify(data, null, 2).substring(0, 500));
    }
  }

  // También buscar con scan
  console.log('\n=== Buscando keys con SCAN ===');
  const keys = await kv.keys('*enraiz*');
  console.log('Keys con "enraiz":', keys);

  const keys2 = await kv.keys('*semana*');
  console.log('Keys con "semana":', keys2);

  const keys3 = await kv.keys('*actual*');
  console.log('Keys con "actual":', keys3);

  const keys4 = await kv.keys('circulo:*');
  console.log('Keys "circulo:*":', keys4);
}

buscar().catch(console.error);
