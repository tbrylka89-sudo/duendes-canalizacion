/**
 * Sincroniza los contenidos individuales (circulo:contenido:2026:1:X)
 * con el array del mes (circulo:contenido:2026:1)
 */
import { kv } from '@vercel/kv';

async function sync() {
  console.log('Sincronizando contenidos de KV...\n');

  // Recolectar todos los contenidos individuales
  const contenidos = [];
  for (let dia = 1; dia <= 31; dia++) {
    const c = await kv.get(`circulo:contenido:2026:1:${dia}`);
    if (c) {
      contenidos.push(c);
    }
  }

  console.log(`Encontrados ${contenidos.length} contenidos individuales`);

  // Actualizar el array del mes
  await kv.set('circulo:contenido:2026:1', contenidos);
  console.log('✓ Array circulo:contenido:2026:1 actualizado');

  // También actualizar circulo:contenido:actual con los últimos 18
  const ultimos18 = contenidos.slice(-18);
  await kv.set('circulo:contenido:actual', ultimos18);
  console.log('✓ circulo:contenido:actual actualizado');

  // Verificar
  const arrayActualizado = await kv.get('circulo:contenido:2026:1');
  console.log(`\nVerificación: ${arrayActualizado.length} items en el array`);

  const conImagen = arrayActualizado.filter(c => c.imagen);
  console.log(`Con imagen: ${conImagen.length}`);

  console.log('\n✅ Sincronización completa');
}

sync().catch(console.error);
