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
      titulo: 'Ritual de Luna Llena para Manifestacion',
      extracto: 'Descubri como aprovechar la energia de la luna llena para potenciar tus intenciones y manifestar tus deseos mas profundos...',
      categoria: 'cosmos',
      tipo: 'ritual',
      imagen: null,
      autor: 'Thibisay',
      fechaPublicacion: new Date(ahora - 2 * 24 * 60 * 60 * 1000).toISOString(),
      vistas: 127,
      destacado: true
    },
    {
      id: 'ejemplo-2',
      titulo: 'Los Duendes Protectores del Hogar',
      extracto: 'Conoce a los guardianes elementales que cuidan tu espacio y aprende a comunicarte con ellos para fortalecer la proteccion de tu hogar...',
      categoria: 'duendes',
      tipo: 'articulo',
      imagen: null,
      autor: 'Gabriel',
      fechaPublicacion: new Date(ahora - 5 * 24 * 60 * 60 * 1000).toISOString(),
      vistas: 89,
      destacado: false
    },
    {
      id: 'ejemplo-3',
      titulo: 'Como Crear tu Altar Personal',
      extracto: 'Una guia paso a paso para disenar y consagrar un espacio sagrado en tu hogar que refleje tu camino espiritual...',
      categoria: 'diy',
      tipo: 'guia',
      imagen: null,
      autor: 'Thibisay',
      fechaPublicacion: new Date(ahora - 8 * 24 * 60 * 60 * 1000).toISOString(),
      vistas: 156,
      destacado: false
    },
    {
      id: 'ejemplo-4',
      titulo: 'Meditacion Guiada: Conexion con tu Guardian',
      extracto: 'Una meditacion profunda para establecer un vinculo consciente con tu guardian elemental y recibir sus mensajes...',
      categoria: 'sanacion',
      tipo: 'meditacion',
      imagen: null,
      autor: 'Gabriel',
      fechaPublicacion: new Date(ahora - 12 * 24 * 60 * 60 * 1000).toISOString(),
      vistas: 203,
      destacado: true
    }
  ];
}
