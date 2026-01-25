/**
 * Actualiza la imagen del contenido "Enraizarte para Florecer"
 */

import { kv } from '@vercel/kv';

const NUEVA_IMAGEN = "https://replicate.delivery/yhqm/bg0iys2IzPrHHlKeQOXgiEa9DtNC0IGi68DHfgz6oXPMjvAWA/out-0.png";
const TITULO_BUSCAR = "Enraizarte para Florecer";

async function actualizarImagenContenido() {
  try {
    console.log('Buscando contenido...');

    // Buscar la key del contenido de enero 2026
    const keys = [
      'circulo:contenido:2026:1',
      'contenido:2026:1',
      'circulo:contenidos:2026-01',
      'contenidos:enero:2026'
    ];

    for (const key of keys) {
      const data = await kv.get(key);
      if (data) {
        console.log(`Encontrado en: ${key}`);

        if (Array.isArray(data)) {
          // Es un array de contenidos
          let actualizado = false;
          const updated = data.map(item => {
            if (item.titulo && item.titulo.includes(TITULO_BUSCAR)) {
              console.log(`Actualizando: ${item.titulo}`);
              actualizado = true;
              return { ...item, imagen: NUEVA_IMAGEN };
            }
            return item;
          });

          if (actualizado) {
            await kv.set(key, updated);
            console.log(`✓ Contenido actualizado en ${key}`);
          }
        } else if (data.contenidos && Array.isArray(data.contenidos)) {
          // Es un objeto con array de contenidos
          let actualizado = false;
          data.contenidos = data.contenidos.map(item => {
            if (item.titulo && item.titulo.includes(TITULO_BUSCAR)) {
              console.log(`Actualizando: ${item.titulo}`);
              actualizado = true;
              return { ...item, imagen: NUEVA_IMAGEN };
            }
            return item;
          });

          if (actualizado) {
            await kv.set(key, data);
            console.log(`✓ Contenido actualizado en ${key}`);
          }
        }
      }
    }

    // También buscar contenidos individuales por fecha
    const fecha = '2026-01-31';
    const keyFecha = `circulo:contenido:${fecha}`;
    const contenidoFecha = await kv.get(keyFecha);

    if (contenidoFecha) {
      console.log(`Encontrado contenido para ${fecha}`);
      contenidoFecha.imagen = NUEVA_IMAGEN;
      await kv.set(keyFecha, contenidoFecha);
      console.log(`✓ Contenido de ${fecha} actualizado`);
    }

    // Buscar en contenido-semana-actual
    const semanaActual = await kv.get('contenido-semana-actual');
    if (semanaActual && semanaActual.titulo && semanaActual.titulo.includes(TITULO_BUSCAR)) {
      semanaActual.imagen = NUEVA_IMAGEN;
      await kv.set('contenido-semana-actual', semanaActual);
      console.log('✓ contenido-semana-actual actualizado');
    }

    console.log('\n✅ Imagen actualizada:', NUEVA_IMAGEN);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

actualizarImagenContenido();
