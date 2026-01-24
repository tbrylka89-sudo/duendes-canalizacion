/**
 * Fix: Actualiza el curso con imágenes placeholder válidas
 */

import { kv } from '@vercel/kv';

const CURSO_ID = 'duendes-elementales-feb-2026';

// Imágenes placeholder de Unsplash (gratuitas, sin necesidad de archivos locales)
const PLACEHOLDERS = {
  curso: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80', // bosque mágico
  modulos: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', // bosque
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80', // agua
    'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600&q=80', // fuego/montaña
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'  // cielo/aire
  ],
  guardianes: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80', // Bramble
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80', // Lira
    'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=400&q=80', // Ember
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80'  // Zephyr
  ],
  badge: 'https://images.unsplash.com/photo-1533422902779-aff35862e462?w=200&q=80' // medalla/cristal
};

async function fixCurso() {
  try {
    console.log('Cargando curso...');
    const curso = await kv.get(`academia:curso:${CURSO_ID}`);

    if (!curso) {
      console.error('Curso no encontrado');
      process.exit(1);
    }

    console.log('Actualizando imágenes...');

    // Actualizar imagen principal
    curso.imagen = PLACEHOLDERS.curso;

    // Actualizar badge
    if (curso.badge) {
      curso.badge.imagen = PLACEHOLDERS.badge;
    }

    // Actualizar módulos y guardianes
    curso.modulos = curso.modulos.map((modulo, i) => ({
      ...modulo,
      imagen: PLACEHOLDERS.modulos[i] || PLACEHOLDERS.modulos[0],
      guardian: {
        ...modulo.guardian,
        imagen: PLACEHOLDERS.guardianes[i] || PLACEHOLDERS.guardianes[0]
      }
    }));

    // Guardar curso actualizado
    await kv.set(`academia:curso:${CURSO_ID}`, curso);
    console.log('✓ Curso actualizado en KV');

    // Actualizar lista de publicados
    const publicados = await kv.get('academia:cursos:publicados') || [];
    const idx = publicados.findIndex(c => c.id === CURSO_ID);
    if (idx >= 0) {
      publicados[idx].imagen = PLACEHOLDERS.curso;
      publicados[idx].badge = curso.badge;
      await kv.set('academia:cursos:publicados', publicados);
      console.log('✓ Lista de publicados actualizada');
    }

    // También actualizar formato viejo
    const cursoViejo = await kv.get(`curso:${CURSO_ID}`);
    if (cursoViejo) {
      cursoViejo.imagen = PLACEHOLDERS.curso;
      cursoViejo.badge = curso.badge;
      cursoViejo.modulos = cursoViejo.modulos.map((m, i) => ({
        ...m,
        duende: {
          ...m.duende,
          imagen: PLACEHOLDERS.guardianes[i] || PLACEHOLDERS.guardianes[0]
        }
      }));
      await kv.set(`curso:${CURSO_ID}`, cursoViejo);
      console.log('✓ Formato viejo actualizado');
    }

    console.log('\n✅ Imágenes actualizadas correctamente');
    console.log('Imagen curso:', PLACEHOLDERS.curso);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixCurso();
