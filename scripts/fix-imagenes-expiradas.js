import { kv } from '@vercel/kv';

// Imagen generada con Replicate (permanente)
const IMAGEN_TIERRA = "https://replicate.delivery/yhqm/bg0iys2IzPrHHlKeQOXgiEa9DtNC0IGi68DHfgz6oXPMjvAWA/out-0.png";

// Usar imagen del guardián de la semana como fallback
const IMAGEN_GUARDIAN = "https://duendesdeluruguay.com/wp-content/uploads/2026/01/tranquil_forest_portrait_1f0f0db2-9ef5-6460-a1d6-781bda6f7d78_1_1_fd46f474-3510-43f0-bf1f-0d74b028c768.png";

async function fix() {
  console.log('Actualizando imágenes expiradas...\n');

  // Días 25-31 tienen DALL-E URLs
  for (let dia = 25; dia <= 31; dia++) {
    const key = `circulo:contenido:2026:1:${dia}`;
    const contenido = await kv.get(key);

    if (contenido && contenido.imagen && contenido.imagen.includes('oaidalleapiprodscus.blob.core.windows.net')) {
      console.log(`Día ${dia}: ${contenido.titulo}`);
      console.log(`  Imagen vieja: ${contenido.imagen.substring(0, 50)}...`);

      // Usar la imagen de Replicate para día 31, guardián para otros
      contenido.imagen = dia === 31 ? IMAGEN_TIERRA : IMAGEN_GUARDIAN;

      await kv.set(key, contenido);
      console.log(`  ✓ Nueva imagen: ${contenido.imagen.substring(0, 50)}...`);
    }
  }

  // También actualizar el array general
  const contenidos = await kv.get('circulo:contenido:2026:1');
  if (contenidos && Array.isArray(contenidos)) {
    let actualizados = 0;
    for (let i = 0; i < contenidos.length; i++) {
      if (contenidos[i].imagen && contenidos[i].imagen.includes('oaidalleapiprodscus.blob.core.windows.net')) {
        contenidos[i].imagen = contenidos[i].dia === 31 ? IMAGEN_TIERRA : IMAGEN_GUARDIAN;
        actualizados++;
      }
    }
    if (actualizados > 0) {
      await kv.set('circulo:contenido:2026:1', contenidos);
      console.log(`\n✓ Array general: ${actualizados} imágenes actualizadas`);
    }
  }

  // Actualizar contenido:actual también
  const actual = await kv.get('circulo:contenido:actual');
  if (actual && Array.isArray(actual)) {
    let actualizados = 0;
    for (let i = 0; i < actual.length; i++) {
      if (actual[i].imagen && actual[i].imagen.includes('oaidalleapiprodscus.blob.core.windows.net')) {
        actual[i].imagen = actual[i].dia === 31 ? IMAGEN_TIERRA : IMAGEN_GUARDIAN;
        actualizados++;
      }
    }
    if (actualizados > 0) {
      await kv.set('circulo:contenido:actual', actual);
      console.log(`✓ Contenido actual: ${actualizados} imágenes actualizadas`);
    }
  }

  console.log('\n✅ Todas las imágenes expiradas fueron reemplazadas');

  // Verificar día 31
  const verificar = await kv.get('circulo:contenido:2026:1:31');
  console.log(`\nVerificación día 31: ${verificar.imagen.substring(0, 60)}...`);
}

fix().catch(console.error);
