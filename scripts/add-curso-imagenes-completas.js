/**
 * Agrega imágenes completas al curso: módulos, guardianes, lecciones
 */

import { kv } from '@vercel/kv';

const CURSO_ID = 'duendes-elementales-feb-2026';

// Imágenes temáticas por elemento
const IMAGENES = {
  curso: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
  badge: 'https://images.unsplash.com/photo-1533422902779-aff35862e462?w=200&q=80',

  // Módulo 1: Tierra - Bramble
  modulo1: {
    portada: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    guardian: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&q=80',
    lecciones: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80', // bosque denso
      'https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=600&q=80', // raíces
      'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=600&q=80', // piedras
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'  // tierra
    ]
  },

  // Módulo 2: Agua - Lira
  modulo2: {
    portada: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    guardian: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    lecciones: [
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&q=80', // agua clara
      'https://images.unsplash.com/photo-1494587351196-bbf5f29cff42?w=600&q=80', // río
      'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=600&q=80', // luna agua
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80'  // cascada
    ]
  },

  // Módulo 3: Fuego - Ember
  modulo3: {
    portada: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=80',
    guardian: 'https://images.unsplash.com/photo-1475070929565-c985b496cb9f?w=400&q=80',
    lecciones: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80', // fuego
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80', // amanecer
      'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600&q=80', // vela
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80'  // atardecer
    ]
  },

  // Módulo 4: Aire - Zephyr
  modulo4: {
    portada: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    guardian: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&q=80',
    lecciones: [
      'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=600&q=80', // nubes
      'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&q=80', // viento
      'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=600&q=80', // cielo
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80'  // montaña
    ]
  }
};

async function actualizarImagenes() {
  try {
    console.log('Cargando curso...');
    const curso = await kv.get(`academia:curso:${CURSO_ID}`);

    if (!curso) {
      console.error('Curso no encontrado');
      process.exit(1);
    }

    console.log('Actualizando imágenes completas...\n');

    // Imagen principal y badge
    curso.imagen = IMAGENES.curso;
    curso.badge.imagen = IMAGENES.badge;

    // Actualizar cada módulo
    const modulosKeys = ['modulo1', 'modulo2', 'modulo3', 'modulo4'];

    curso.modulos = curso.modulos.map((modulo, i) => {
      const imgs = IMAGENES[modulosKeys[i]];
      console.log(`Módulo ${i+1}: ${modulo.titulo}`);
      console.log(`  - Portada: ✓`);
      console.log(`  - Guardian: ✓`);
      console.log(`  - Lecciones: ${imgs.lecciones.length}`);

      return {
        ...modulo,
        imagen: imgs.portada,
        guardian: {
          ...modulo.guardian,
          imagen: imgs.guardian
        },
        lecciones: modulo.lecciones.map((leccion, j) => ({
          ...leccion,
          imagen: imgs.lecciones[j] || imgs.lecciones[0]
        }))
      };
    });

    // Guardar
    await kv.set(`academia:curso:${CURSO_ID}`, curso);
    console.log('\n✓ Curso actualizado en KV');

    // Actualizar lista de publicados
    const publicados = await kv.get('academia:cursos:publicados') || [];
    const idx = publicados.findIndex(c => c.id === CURSO_ID);
    if (idx >= 0) {
      publicados[idx].imagen = IMAGENES.curso;
      await kv.set('academia:cursos:publicados', publicados);
      console.log('✓ Lista actualizada');
    }

    console.log('\n✅ Todas las imágenes actualizadas');
    console.log(`   - 1 imagen de curso`);
    console.log(`   - 1 badge`);
    console.log(`   - 4 portadas de módulo`);
    console.log(`   - 4 imágenes de guardianes`);
    console.log(`   - 16 imágenes de lecciones`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

actualizarImagenes();
