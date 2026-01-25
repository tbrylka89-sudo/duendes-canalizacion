import { kv } from '@vercel/kv';

const NUEVA_IMAGEN = "https://replicate.delivery/yhqm/bg0iys2IzPrHHlKeQOXgiEa9DtNC0IGi68DHfgz6oXPMjvAWA/out-0.png";

async function fix() {
  // Obtener contenidos de enero 2026
  const contenidos = await kv.get('circulo:contenido:2026:1');

  if (!contenidos || !Array.isArray(contenidos)) {
    console.log('No es array, revisando estructura...');
    console.log(typeof contenidos);
    return;
  }

  console.log(`Total contenidos: ${contenidos.length}`);

  // Encontrar y actualizar el día 31
  for (let i = 0; i < contenidos.length; i++) {
    if (contenidos[i].dia === 31 || contenidos[i].titulo?.includes('Enraizarte')) {
      console.log(`Encontrado en índice ${i}:`, contenidos[i].titulo);
      contenidos[i].imagen = NUEVA_IMAGEN;
      console.log('Imagen actualizada a:', NUEVA_IMAGEN);
    }
  }

  // Guardar
  await kv.set('circulo:contenido:2026:1', contenidos);
  console.log('✓ Guardado en KV');

  // Verificar
  const verificar = await kv.get('circulo:contenido:2026:1');
  const item31 = verificar.find(c => c.dia === 31);
  console.log('Verificación - imagen del día 31:', item31?.imagen?.substring(0, 50) + '...');
}

fix().catch(console.error);
