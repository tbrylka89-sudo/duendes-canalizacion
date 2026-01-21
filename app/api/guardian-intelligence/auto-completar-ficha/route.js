/**
 * GUARDIAN INTELLIGENCE - AUTO-COMPLETAR FICHA
 * POST: Busca producto en base de datos y completa todos los campos + genera ficha IA
 */

import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import productosDB from '@/lib/productos-base-datos.json';
import fichaConfig from '@/lib/ficha-guardian-config.json';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

// Normalizar nombre para búsqueda
function normalizarNombre(nombre) {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/pixie/gi, '')
    .replace(/guardiana?/gi, '')
    .replace(/duende/gi, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Buscar producto en base de datos
function buscarProducto(nombreBuscado) {
  const nombreNorm = normalizarNombre(nombreBuscado);

  // Buscar coincidencia exacta primero
  let producto = productosDB.productos.find(p =>
    normalizarNombre(p.nombre) === nombreNorm
  );

  // Si no, buscar parcial
  if (!producto) {
    producto = productosDB.productos.find(p =>
      nombreNorm.includes(normalizarNombre(p.nombre)) ||
      normalizarNombre(p.nombre).includes(nombreNorm)
    );
  }

  // Si no, buscar por primera palabra
  if (!producto) {
    const primeraPalabra = nombreNorm.split(' ')[0];
    producto = productosDB.productos.find(p =>
      normalizarNombre(p.nombre).split(' ')[0] === primeraPalabra
    );
  }

  return producto;
}

// Inferir especie del nombre o datos
function inferirEspecie(producto, nombreCompleto) {
  // Si ya tiene especie definida
  if (producto.especie) return producto.especie;

  const nombreLower = nombreCompleto.toLowerCase();

  // Detectar del nombre
  if (nombreLower.includes('pixie')) return 'pixie';
  if (nombreLower.includes('vikingo') || nombreLower.includes('vikinga')) return 'vikingo';
  if (nombreLower.includes('bruja') || nombreLower.includes('brujo')) return 'bruja';
  if (nombreLower.includes('hada')) return 'hada';
  if (nombreLower.includes('elfo') || nombreLower.includes('elfa')) return 'elfo';
  if (nombreLower.includes('chaman') || nombreLower.includes('chamana')) return 'chaman';
  if (nombreLower.includes('merlin')) return 'hechicero';
  if (nombreLower.includes('guerrero') || nombreLower.includes('guerrera')) return 'guerrero';

  // Detectar de accesorios
  if (producto.accesorios) {
    const acc = producto.accesorios.toLowerCase();
    if (acc.includes('vikingo') || acc.includes('vikinga')) return 'vikingo';
    if (acc.includes('bruja') || acc.includes('brujo') || acc.includes('escoba')) return 'bruja';
    if (acc.includes('chaman') || acc.includes('tambor chamanico')) return 'chaman';
    if (acc.includes('leprechaun')) return 'duende'; // leprechaun es familia, especie es duende
  }

  // Por defecto
  return 'duende';
}

// Determinar si es único o recreable
function determinarUnico(producto) {
  // Pixies siempre únicas
  if (producto.especie === 'pixie') return 'unico';

  // Mini son recreables (excepto mini_especial con pixie)
  if (producto.tipo_tamano === 'mini') return 'recreable';

  // Mini especial: depende si es arquetipo conocido
  if (producto.tipo_tamano === 'mini_especial') {
    const familia = (producto.familia || '').toLowerCase();
    if (['leprechaun', 'merlin', 'gandalf', 'morgana'].includes(familia)) {
      return 'recreable';
    }
  }

  // Mediano en adelante son únicos
  return 'unico';
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, historia, soloBaseDatos = false } = body;

    if (!nombre) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere el nombre del producto'
      }, { status: 400, headers: corsHeaders });
    }

    // Buscar en base de datos
    const productoEncontrado = buscarProducto(nombre);

    if (!productoEncontrado) {
      return NextResponse.json({
        success: false,
        error: `No se encontró "${nombre}" en la base de datos. Verificá el nombre.`,
        sugerencia: 'Podés completar los campos manualmente o agregar el producto a la base de datos.'
      }, { status: 404, headers: corsHeaders });
    }

    // Construir datos básicos
    const especie = inferirEspecie(productoEncontrado, nombre);
    const esUnico = determinarUnico({ ...productoEncontrado, especie });

    const datosBasicos = {
      genero: productoEncontrado.genero,
      especie: especie,
      familia: productoEncontrado.familia || '',
      categoria: productoEncontrado.categoria,
      tipo_tamano: productoEncontrado.tipo_tamano,
      tamano_cm: productoEncontrado.tamano_cm,
      es_unico: esUnico,
      accesorios: productoEncontrado.accesorios || ''
    };

    // Si solo quieren datos de base de datos, retornar ahora
    if (soloBaseDatos || !historia) {
      return NextResponse.json({
        success: true,
        encontrado: true,
        producto_db: productoEncontrado.nombre,
        datosBasicos,
        mensaje: 'Datos encontrados en base de datos. Para generar ficha IA, incluí la historia.'
      }, { headers: corsHeaders });
    }

    // Generar ficha IA
    const anthropic = new Anthropic();

    const infoEspecie = fichaConfig.especies.clasicas.find(e => e.id === especie) ||
                        fichaConfig.especies.exclusivas.find(e => e.id === especie);
    const infoCategoria = fichaConfig.categorias[productoEncontrado.categoria];

    const prompt = `Sos un experto en crear fichas de personalidad para guardianes místicos de "Duendes del Uruguay".
Basándote en la historia y datos de este guardián, generá una ficha coherente con su esencia.

GUARDIÁN:
- Nombre: ${nombre}
- Especie: ${especie} ${infoEspecie ? `(${infoEspecie.descripcion})` : ''}
- Familia/Estilo: ${productoEncontrado.familia || 'N/A'}
- Categoría: ${productoEncontrado.categoria} ${infoCategoria ? `(${infoCategoria.descripcion})` : ''}
- Género: ${productoEncontrado.genero === 'F' ? 'Femenino' : 'Masculino'}
- Tamaño: ${productoEncontrado.tamano_cm} cm
- Accesorios: ${productoEncontrado.accesorios || 'No especificados'}

HISTORIA:
${historia}

INSTRUCCIONES:
Generá una ficha que sea COHERENTE con la historia, los accesorios y la personalidad del guardián.
- La flor debe resonar con su energía y colores
- La piedra/cristal debe conectar con los que ya tiene o su propósito
- El color debe reflejar su esencia visual
- Los gustos deben ser específicos y únicos, basados en su historia
- El dato curioso debe hacer que alguien diga "ayyy es como yo"
- La frase/lema debe ser algo que ESTE guardián DIRÍA, no genérico

FORMATO DE RESPUESTA (JSON exacto):
{
  "flor_favorita": "nombre de la flor",
  "piedra_favorita": "nombre del cristal/piedra",
  "color_favorito": "color específico (ej: violeta profundo)",
  "espacio_casa": "lugar específico de la casa",
  "elemento": "Fuego|Agua|Tierra|Aire|Éter",
  "estacion": "Primavera|Verano|Otoño|Invierno",
  "momento_dia": "momento específico",
  "le_gusta_pasear": "Sí, le encanta|No, prefiere quedarse|Que le pregunte primero",
  "le_gusta": ["cosa1", "cosa2", "cosa3"],
  "no_le_gusta": ["cosa1", "cosa2", "cosa3"],
  "frase_lema": "frase que diría este guardián",
  "dato_curioso": "algo único y entrañable"
}

Respondé SOLO con el JSON.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    });

    const respuestaTexto = message.content[0].text;

    // Parsear JSON
    let fichaIA;
    try {
      const jsonMatch = respuestaTexto.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        fichaIA = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se encontró JSON');
      }
    } catch (parseError) {
      return NextResponse.json({
        success: true,
        encontrado: true,
        datosBasicos,
        fichaIA: null,
        error_ia: 'Error parseando respuesta de IA'
      }, { headers: corsHeaders });
    }

    // Asegurar arrays
    if (!Array.isArray(fichaIA.le_gusta)) {
      fichaIA.le_gusta = [fichaIA.le_gusta];
    }
    if (!Array.isArray(fichaIA.no_le_gusta)) {
      fichaIA.no_le_gusta = [fichaIA.no_le_gusta];
    }

    return NextResponse.json({
      success: true,
      encontrado: true,
      producto_db: productoEncontrado.nombre,
      datosBasicos,
      fichaIA,
      mensaje: 'Ficha completada automáticamente'
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('[GI Auto-completar] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}

// GET: Ver todos los productos en base de datos
export async function GET() {
  try {
    const productos = productosDB.productos.map(p => ({
      nombre: p.nombre,
      genero: p.genero,
      categoria: p.categoria,
      tamano_cm: p.tamano_cm
    }));

    return NextResponse.json({
      success: true,
      total: productos.length,
      productos
    }, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
