import cristalesData from '@/lib/cristales.json';

// GET - Obtener guía de cristales
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const chakra = searchParams.get('chakra');
    const elemento = searchParams.get('elemento');
    const signo = searchParams.get('signo');
    const buscar = searchParams.get('q');

    let cristales = cristalesData.cristales;

    // Filtrar por ID específico
    if (id) {
      const cristal = cristales.find(c => c.id === id);
      if (!cristal) {
        return Response.json({
          success: false,
          error: 'Cristal no encontrado'
        }, { status: 404 });
      }
      return Response.json({
        success: true,
        cristal
      });
    }

    // Filtrar por chakra
    if (chakra) {
      cristales = cristales.filter(c =>
        c.chakras.some(ch => ch.toLowerCase().includes(chakra.toLowerCase()))
      );
    }

    // Filtrar por elemento
    if (elemento) {
      cristales = cristales.filter(c =>
        c.elemento.toLowerCase().includes(elemento.toLowerCase())
      );
    }

    // Filtrar por signo zodiacal
    if (signo) {
      cristales = cristales.filter(c =>
        c.signos.some(s => s.toLowerCase().includes(signo.toLowerCase()))
      );
    }

    // Búsqueda general
    if (buscar) {
      const q = buscar.toLowerCase();
      cristales = cristales.filter(c =>
        c.nombre.toLowerCase().includes(q) ||
        c.nombres_alternativos.some(n => n.toLowerCase().includes(q)) ||
        (c.propiedades_energeticas_detalladas || '').toLowerCase().includes(q) ||
        c.color.toLowerCase().includes(q)
      );
    }

    // Versión resumida para listado
    const resumen = cristales.map(c => ({
      id: c.id,
      nombre: c.nombre,
      color: c.color,
      chakras: c.chakras,
      elemento: c.elemento,
      mensaje: c.mensaje,
      propiedades: (c.propiedades_energeticas_detalladas || c.propiedades_energeticas || '').substring(0, 100) + '...'
    }));

    return Response.json({
      success: true,
      total: cristales.length,
      cristales: resumen,
      filtros_disponibles: {
        chakras: ['Raíz', 'Sacro', 'Plexo Solar', 'Corazón', 'Garganta', 'Tercer Ojo', 'Corona'],
        elementos: ['Fuego', 'Agua', 'Tierra', 'Aire', 'Éter'],
        signos: ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
      }
    });

  } catch (error) {
    console.error('Error obteniendo cristales:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
