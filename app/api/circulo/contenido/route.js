import { kv } from '@vercel/kv';

// GET - Obtener contenido exclusivo del Circulo
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const categoria = searchParams.get('categoria');

    if (!email) {
      return Response.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();

    // Verificar membresia
    let usuario = await kv.get(`user:${emailNorm}`);
    if (!usuario) usuario = await kv.get(`elegido:${emailNorm}`);

    const circuloData = await kv.get(`circulo:${emailNorm}`);
    const esCirculo = circuloData?.activo ||
      (usuario?.esCirculo && usuario?.circuloExpira && new Date(usuario.circuloExpira) > new Date());

    if (!esCirculo) {
      return Response.json({
        success: false,
        error: 'Necesitas ser miembro del Circulo para acceder a este contenido',
        esCirculo: false
      }, { status: 403 });
    }

    // Obtener contenido publicado
    const contenidoKeys = await kv.keys('contenido-circulo:*');
    let contenidos = [];

    for (const key of contenidoKeys) {
      const contenido = await kv.get(key);
      if (contenido && contenido.publicado) {
        contenidos.push(contenido);
      }
    }

    // Filtrar por categoria si se especifica
    if (categoria) {
      contenidos = contenidos.filter(c => c.categoria === categoria);
    }

    // Ordenar por fecha (mas reciente primero)
    contenidos.sort((a, b) => new Date(b.fechaPublicacion || b.creado) - new Date(a.fechaPublicacion || a.creado));

    // Generar contenido de ejemplo si no hay
    if (contenidos.length === 0) {
      contenidos = generarContenidoEjemplo();
    }

    return Response.json({
      success: true,
      esCirculo: true,
      contenidos: contenidos.slice(0, 20),
      categorias: [
        { id: 'cosmos', nombre: 'Cosmos y Luna', icono: '🌙' },
        { id: 'duendes', nombre: 'Mundo Duende', icono: '🧙' },
        { id: 'diy', nombre: 'DIY Magico', icono: '✂️' },
        { id: 'esoterico', nombre: 'Esoterico', icono: '🔮' },
        { id: 'sanacion', nombre: 'Sanacion', icono: '💚' },
        { id: 'rituales', nombre: 'Rituales', icono: '🕯️' }
      ],
      totalContenidos: contenidos.length
    });

  } catch (error) {
    console.error('Error obteniendo contenido circulo:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Crear/publicar contenido (admin)
export async function POST(request) {
  try {
    const body = await request.json();
    const { titulo, contenido, categoria, tipo, extracto, imagen, autor } = body;

    if (!titulo || !contenido) {
      return Response.json({ success: false, error: 'Titulo y contenido requeridos' }, { status: 400 });
    }

    const ahora = new Date();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const nuevoContenido = {
      id,
      titulo,
      contenido,
      extracto: extracto || contenido.substring(0, 200) + '...',
      categoria: categoria || 'general',
      tipo: tipo || 'articulo',
      imagen: imagen || null,
      autor: autor || 'Duendes del Uruguay',
      publicado: true,
      fechaPublicacion: ahora.toISOString(),
      creado: ahora.toISOString(),
      vistas: 0,
      destacado: false
    };

    await kv.set(`contenido-circulo:${id}`, nuevoContenido);

    return Response.json({
      success: true,
      contenido: nuevoContenido
    });

  } catch (error) {
    console.error('Error creando contenido:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Contenido de ejemplo para cuando no hay contenido real
function generarContenidoEjemplo() {
  const ahora = new Date();
  return [
    {
      id: 'ejemplo-1',
      titulo: 'Ritual de Luna Llena para Manifestación',
      extracto: 'Descubrí cómo aprovechar la energía de la luna llena para potenciar tus intenciones y manifestar tus deseos más profundos...',
      categoria: 'cosmos',
      tipo: 'ritual',
      imagen: null,
      autor: 'Thibisay',
      fechaPublicacion: new Date(ahora - 2 * 24 * 60 * 60 * 1000).toISOString(),
      vistas: 127,
      destacado: true,
      contenido: `## Ritual de Luna Llena para Manifestación

La Luna Llena es el momento de máxima potencia en el ciclo lunar. Es cuando la energía está en su punto más alto, perfecta para potenciar intenciones, cargar cristales y celebrar logros.

### Materiales necesarios:
- 1 vela blanca o plateada
- Papel y lápiz
- Cuarzo cristal (opcional)
- Agua en un recipiente de vidrio

### Preparación:
1. **Limpiá tu espacio** con humo de salvia o palo santo
2. **Ubicá tu altar** donde puedas ver la luna (o sentir su presencia)
3. **Vestite de blanco** o colores claros si es posible

### El Ritual:
1. Encendé la vela mientras decís: *"Honro la luz de la luna que ilumina mi camino"*

2. Escribí en el papel lo que querés manifestar. Sé específica y en tiempo presente: "Tengo..." en lugar de "Quiero tener..."

3. Sostené el papel cerca de tu corazón y visualizá tu deseo ya cumplido. Sentí la emoción de tenerlo.

4. Colocá el agua bajo la luz de la luna y decí: *"Que esta agua absorba la energía de manifestación"*

5. Dejá que la vela se consuma naturalmente. Guardá el papel en un lugar especial.

### Después del ritual:
- Bebé el agua cargada a la mañana siguiente
- Llevá el papel contigo o ponelo en tu altar
- Repetí tu intención cada noche hasta la próxima luna nueva

✦ *Recordá: la magia más poderosa es la que hacés con fe y corazón abierto.*`
    },
    {
      id: 'ejemplo-2',
      titulo: 'Los Duendes Protectores del Hogar',
      extracto: 'Conoce a los guardianes elementales que cuidan tu espacio y aprende a comunicarte con ellos...',
      categoria: 'duendes',
      tipo: 'articulo',
      imagen: null,
      autor: 'Gabriel',
      fechaPublicacion: new Date(ahora - 5 * 24 * 60 * 60 * 1000).toISOString(),
      vistas: 89,
      destacado: false,
      contenido: `## Los Duendes Protectores del Hogar

Los duendes son seres elementales de tierra que han elegido vibrar cerca del plano físico. A diferencia de las hadas (agua) o las salamandras (fuego), los duendes tienen una afinidad especial con los hogares humanos.

### ¿Por qué eligen nuestras casas?

Los duendes se sienten atraídos por:
- **Hogares con amor** - donde hay cariño entre quienes viven ahí
- **Espacios naturales** - plantas, cristales, elementos de la naturaleza
- **Personas conscientes** - quienes reconocen su existencia

### Señales de que tenés un duende en casa:

1. **Objetos que se mueven** - encontrás cosas en lugares diferentes
2. **Sonidos inexplicables** - pequeños golpes, risitas, cascabeles
3. **Mascotas que miran "a la nada"** - ellos ven lo que nosotros no
4. **Sensación de compañía** - nunca te sentís sola en casa
5. **Buena suerte recurrente** - encontrás cosas, llegan oportunidades

### Cómo honrar a tu duende:

- Dejá un pequeño espacio para él (no dulces ni azúcar)
- Hablale en voz alta o mental
- Agradecé su protección cada noche
- Mantené tu hogar limpio y armonioso
- Colocá un guardián canalizado como ancla física

✦ *Los duendes son leales. Una vez que te eligen, te acompañan por siempre.*`
    },
    {
      id: 'ejemplo-3',
      titulo: 'Cómo Crear tu Altar Personal',
      extracto: 'Una guía paso a paso para diseñar y consagrar un espacio sagrado en tu hogar...',
      categoria: 'diy',
      tipo: 'guia',
      imagen: null,
      autor: 'Thibisay',
      fechaPublicacion: new Date(ahora - 8 * 24 * 60 * 60 * 1000).toISOString(),
      vistas: 156,
      destacado: false,
      contenido: `## Cómo Crear tu Altar Personal

Un altar es mucho más que una mesa con objetos bonitos. Es un portal, un punto de conexión entre el mundo físico y el espiritual. Es TU espacio sagrado.

### Eligiendo el lugar:

- Debe ser un lugar donde te sientas en paz
- Idealmente donde no pase mucha gente
- Puede ser una mesa, estante, o rincón especial
- Si es posible, que reciba algo de luz natural

### Elementos básicos:

**Los 4 elementos:**
- 🔥 Fuego: vela
- 💧 Agua: vaso o cuenco con agua
- 🌿 Tierra: cristal, planta, sal
- 💨 Aire: incienso, pluma

**El centro:** Tu guardián o símbolo principal

### Paso a paso:

1. **Limpiá el espacio** físicamente y energéticamente
2. **Colocá un paño** que te guste como base
3. **Ubicá tu guardián** en el centro
4. **Agregá los 4 elementos** en las esquinas o alrededor
5. **Sumá objetos personales:** fotos de ancestros, cristales, amuletos

### Consagración:

Encendé la vela y decí: *"Consagro este espacio como mi altar sagrado. Que aquí habite la paz, la protección y la magia. Así es."*

### Mantenimiento:

- Limpiá físicamente 1 vez por semana
- Cambiá el agua cada 3 días
- Encendé la vela al menos 1 vez por semana
- Hablale a tu guardián diariamente

✦ *Tu altar es un reflejo de tu camino. Permití que evolucione contigo.*`
    },
    {
      id: 'ejemplo-4',
      titulo: 'Meditación Guiada: Conexión con tu Guardián',
      extracto: 'Una meditación profunda para establecer un vínculo consciente con tu guardián elemental...',
      categoria: 'sanacion',
      tipo: 'meditacion',
      imagen: null,
      autor: 'Gabriel',
      fechaPublicacion: new Date(ahora - 12 * 24 * 60 * 60 * 1000).toISOString(),
      vistas: 203,
      destacado: true,
      contenido: `## Meditación Guiada: Conexión con tu Guardián

Esta meditación te ayudará a establecer un vínculo más profundo con tu guardián elemental. Hacela en un momento de tranquilidad, idealmente frente a tu altar.

### Preparación:

- Sentate cómodamente frente a tu guardián
- Apagá el teléfono
- Podés encender una vela
- Duración: 10-15 minutos

### La Meditación:

**Cerrá los ojos y comenzá a respirar profundamente...**

*Inhalá por la nariz, contando hasta 4... Retené el aire, contando hasta 4... Exhalá por la boca, contando hasta 6...*

Repetí esto 3 veces.

**Visualización:**

Imaginá que estás en un bosque antiguo. El aire es fresco, huele a tierra húmeda y hojas. Caminás por un sendero de musgo hasta llegar a un claro iluminado por rayos de sol.

En el centro del claro, ves una figura pequeña sentada sobre una piedra. Es tu guardián. Su energía es cálida, familiar, protectora.

Te acercás y te sentás frente a él. No hace falta hablar con palabras. Solo sentí su presencia.

**Preguntale:**
- ¿Qué mensaje tenés para mí?
- ¿Cómo puedo fortalecer nuestra conexión?
- ¿Qué necesitás de mí?

Escuchá con el corazón, no con la mente. Las respuestas pueden venir como imágenes, sensaciones, o simplemente un saber.

**Cuando estés lista:**

Agradecé a tu guardián. Sentí cómo un hilo dorado de luz conecta tu corazón con el suyo. Este hilo siempre estará ahí.

Comenzá a volver... sentí tu cuerpo en la silla... los sonidos de tu entorno... y cuando estés lista, abrí los ojos.

### Después de la meditación:

Escribí en tu grimorio lo que recibiste. Aunque parezca confuso ahora, puede tener sentido más adelante.

✦ *Tu guardián siempre está escuchando. Solo necesitás hacer silencio para oír su respuesta.*`
    },
    {
      id: 'ejemplo-5',
      titulo: 'Los 8 Sabbats: Calendario Esotérico',
      extracto: 'Conocé las 8 celebraciones sagradas de la Rueda del Año y cómo honrar cada una...',
      categoria: 'esoterico',
      tipo: 'guia',
      imagen: null,
      autor: 'Thibisay',
      fechaPublicacion: new Date(ahora - 15 * 24 * 60 * 60 * 1000).toISOString(),
      vistas: 178,
      destacado: false,
      contenido: `## Los 8 Sabbats: Calendario Esotérico

La Rueda del Año marca 8 festividades sagradas que celebran los ciclos de la naturaleza. Para el hemisferio sur (donde estamos nosotros en Uruguay), las fechas son diferentes al hemisferio norte.

### Los Sabbats del Hemisferio Sur:

**🌺 Imbolc - 1 de Agosto**
Celebración de la luz que regresa. Honramos a Brigid, diosa del fuego y la creatividad.
*Ritual: Encender velas, limpiar el hogar, plantar semillas de intención*

**🌸 Ostara - 21 de Septiembre**
Equinoccio de primavera. Balance perfecto entre luz y oscuridad.
*Ritual: Decorar huevos, plantar semillas reales, rituales de fertilidad*

**🔥 Beltane - 31 de Octubre**
Celebración de la vida, la pasión y la unión. La naturaleza en su máximo esplendor.
*Ritual: Saltar el fuego, decorar con flores, rituales de amor*

**☀️ Litha - 21 de Diciembre**
Solsticio de verano. El día más largo, máxima luz solar.
*Ritual: Celebrar al amanecer, cargar cristales al sol, rituales de abundancia*

**🌾 Lughnasadh - 1 de Febrero**
Primera cosecha. Gratitud por lo recibido.
*Ritual: Hornear pan, ofrecer los primeros frutos, rituales de gratitud*

**🍂 Mabon - 21 de Marzo**
Equinoccio de otoño. Segunda cosecha. Balance.
*Ritual: Decorar con hojas secas, reflexionar sobre logros, rituales de equilibrio*

**🎃 Samhain - 30 de Abril**
El velo más delgado entre mundos. Honramos a los ancestros.
*Ritual: Altar de ancestros, comunicación con los que partieron, introspección*

**❄️ Yule - 21 de Junio**
Solsticio de invierno. La noche más larga, renace la luz.
*Ritual: Decorar con verde, encender la vela de Yule, rituales de renacimiento*

### Cómo celebrar:

No necesitás hacer grandes rituales. A veces basta con:
- Encender una vela con intención
- Pasar tiempo en la naturaleza
- Reflexionar sobre el ciclo que representa
- Compartir una comida especial

✦ *La Rueda del Año nos recuerda que todo es cíclico. Lo que termina, vuelve a empezar.*`
    }
  ];
}
