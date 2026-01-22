import { NextResponse } from 'next/server';

// Configuración WooCommerce
const WC_URL = process.env.WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

// Obtener todos los productos de WooCommerce
async function obtenerTodosProductos() {
  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
  const productos = [];

  for (let page = 1; page <= 5; page++) {
    const response = await fetch(
      `${WC_URL}/wp-json/wc/v3/products?per_page=100&page=${page}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.length === 0) break;
      productos.push(...data);
    } else {
      break;
    }
  }

  return productos;
}

// Extraer patrones de una historia
function extraerPatrones(descripcion) {
  if (!descripcion) return null;

  const patrones = {
    inicios: [],
    cierres: [],
    sincrodestinos: [],
    edades: [],
    especies: [],
    frases_repetidas: []
  };

  // Detectar inicio
  const inicioMatch = descripcion.match(/^(Este es|Esta es|Te presentamos|Hay duendes que|Cuando canalizamos)/i);
  if (inicioMatch) patrones.inicios.push(inicioMatch[0]);

  // Detectar cierre
  const cierreMatch = descripcion.match(/(ya te eligió|el llamado se activó|no es casualidad|tiene algo para decirte)[.\s]*$/i);
  if (cierreMatch) patrones.cierres.push(cierreMatch[0]);

  // Detectar sincrodestino
  const sincroMatch = descripcion.match(/SINCRODESTINO[:\s]+([^.]+\.)/i);
  if (sincroMatch) patrones.sincrodestinos.push(sincroMatch[1].trim());

  // Detectar edad
  const edadMatch = descripcion.match(/Tiene (\d+) años/i);
  if (edadMatch) patrones.edades.push(edadMatch[1]);

  // Detectar especie
  const especieMatch = descripcion.match(/es (un|una) (duende|pixie|elfo|hada|gnomo)/i);
  if (especieMatch) patrones.especies.push(especieMatch[2].toLowerCase());

  // Detectar frases de IA prohibidas
  const frasesProhibidas = [
    'en lo profundo del bosque',
    'a través de las brumas',
    'desde tiempos inmemoriales',
    'las energías ancestrales',
    'el velo entre mundos',
    'vibraciones cósmicas',
    'campos energéticos',
    'este ser feérico'
  ];

  frasesProhibidas.forEach(frase => {
    if (descripcion.toLowerCase().includes(frase)) {
      patrones.frases_repetidas.push(frase);
    }
  });

  return patrones;
}

// GET - Escanear todas las historias existentes
export async function GET(request) {
  try {
    const productos = await obtenerTodosProductos();

    // Filtrar solo guardianes (excluir círculos, paquetes, etc)
    const guardianes = productos.filter(p => {
      const nombre = p.name.toLowerCase();
      return !nombre.includes('círculo') &&
             !nombre.includes('paquete') &&
             !nombre.includes('runas') &&
             !nombre.includes('lectura') &&
             !nombre.includes('prueba');
    });

    // Análisis global
    const analisis = {
      total_guardianes: guardianes.length,
      con_historia: 0,
      sin_historia: 0,
      patrones_detectados: {
        inicios: {},
        cierres: {},
        sincrodestinos: [],
        edades: {},
        especies: {},
        frases_ia_detectadas: {}
      },
      guardianes_sin_historia: [],
      guardianes_con_problemas: [],
      por_categoria: {}
    };

    guardianes.forEach(g => {
      const tieneHistoria = g.description && g.description.length > 100;

      if (tieneHistoria) {
        analisis.con_historia++;

        const patrones = extraerPatrones(g.description);
        if (patrones) {
          // Contar inicios
          patrones.inicios.forEach(i => {
            analisis.patrones_detectados.inicios[i] = (analisis.patrones_detectados.inicios[i] || 0) + 1;
          });

          // Contar cierres
          patrones.cierres.forEach(c => {
            analisis.patrones_detectados.cierres[c] = (analisis.patrones_detectados.cierres[c] || 0) + 1;
          });

          // Registrar sincrodestinos
          patrones.sincrodestinos.forEach(s => {
            analisis.patrones_detectados.sincrodestinos.push({
              guardian: g.name,
              sincrodestino: s
            });
          });

          // Contar edades
          patrones.edades.forEach(e => {
            analisis.patrones_detectados.edades[e] = (analisis.patrones_detectados.edades[e] || 0) + 1;
          });

          // Contar especies
          patrones.especies.forEach(e => {
            analisis.patrones_detectados.especies[e] = (analisis.patrones_detectados.especies[e] || 0) + 1;
          });

          // Detectar frases de IA
          if (patrones.frases_repetidas.length > 0) {
            analisis.guardianes_con_problemas.push({
              id: g.id,
              nombre: g.name,
              problemas: patrones.frases_repetidas
            });
            patrones.frases_repetidas.forEach(f => {
              analisis.patrones_detectados.frases_ia_detectadas[f] =
                (analisis.patrones_detectados.frases_ia_detectadas[f] || 0) + 1;
            });
          }
        }
      } else {
        analisis.sin_historia++;
        analisis.guardianes_sin_historia.push({
          id: g.id,
          nombre: g.name,
          slug: g.slug
        });
      }

      // Categorías
      g.categories?.forEach(cat => {
        if (!analisis.por_categoria[cat.name]) {
          analisis.por_categoria[cat.name] = { total: 0, con_historia: 0 };
        }
        analisis.por_categoria[cat.name].total++;
        if (tieneHistoria) analisis.por_categoria[cat.name].con_historia++;
      });
    });

    // Detectar edades repetidas (problema de las historias actuales)
    const edadMasUsada = Object.entries(analisis.patrones_detectados.edades)
      .sort((a, b) => b[1] - a[1])[0];

    if (edadMasUsada && edadMasUsada[1] > 10) {
      analisis.alerta = `ALERTA: La edad "${edadMasUsada[0]} años" se repite ${edadMasUsada[1]} veces. Las historias necesitan variación.`;
    }

    return NextResponse.json({
      success: true,
      analisis,
      guardianes: guardianes.map(g => ({
        id: g.id,
        nombre: g.name,
        slug: g.slug,
        tiene_historia: g.description && g.description.length > 100,
        categorias: g.categories?.map(c => c.name) || [],
        imagen: g.images?.[0]?.src || null
      }))
    });

  } catch (error) {
    console.error('Error escaneando historias:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
