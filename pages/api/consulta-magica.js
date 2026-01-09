import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Obtener productos de WooCommerce
async function obtenerProductos() {
  try {
    const url = `${process.env.WORDPRESS_URL}/wp-json/wc/v3/products?per_page=100&status=publish`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(
          `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
        ).toString('base64')
      }
    });
    
    if (!response.ok) return [];
    
    const productos = await response.json();
    
    return productos.map(p => ({
      id: p.id,
      nombre: p.name,
      precio: parseFloat(p.price),
      categoria: p.categories?.[0]?.name || 'Guardián',
      categoriaSlug: p.categories?.[0]?.slug || 'proteccion',
      imagen: p.images?.[0]?.src || '',
      url: p.permalink,
      descripcion: p.description?.replace(/<[^>]*>/g, '').substring(0, 500) || '',
      descripcionCorta: p.short_description?.replace(/<[^>]*>/g, '') || '',
      stock: p.stock_status === 'instock'
    })).filter(p => p.stock);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { token, consulta, paraQuien } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    if (!consulta || consulta.trim().length < 10) {
      return res.status(400).json({ error: 'Por favor, contanos más sobre tu situación' });
    }

    // Buscar elegido
    const elegidoKey = `elegido:${token}`;
    const elegido = await kv.get(elegidoKey);

    if (!elegido) {
      return res.status(404).json({ error: 'Elegido no encontrado' });
    }

    // Obtener productos disponibles
    const productos = await obtenerProductos();
    
    if (productos.length === 0) {
      return res.status(500).json({ error: 'No pudimos cargar los productos. Intentá de nuevo.' });
    }

    // Categorizar productos
    const guardianes = productos.filter(p => 
      ['proteccion', 'amor', 'dinero-abundancia-negocios', 'salud'].includes(p.categoriaSlug)
    );
    const cristales = productos.filter(p => p.categoriaSlug?.includes('cristal'));
    const otros = productos.filter(p => 
      !['proteccion', 'amor', 'dinero-abundancia-negocios', 'salud'].includes(p.categoriaSlug) &&
      !p.categoriaSlug?.includes('cristal')
    );

    // Preparar contexto de productos para Claude - MUY EXPLÍCITO
    const productosTexto = `
=== GUARDIANES DISPONIBLES (${guardianes.length} en stock) ===
${guardianes.length > 0 ? guardianes.slice(0, 30).map(p => 
  `• "${p.nombre}" - $${p.precio} USD - Categoría: ${p.categoria}
   ${p.descripcionCorta || p.descripcion.substring(0, 200)}`
).join('\n\n') : 'NO HAY GUARDIANES DISPONIBLES EN ESTE MOMENTO'}

${cristales.length > 0 ? `
=== CRISTALES DISPONIBLES COMO PRODUCTOS SEPARADOS (${cristales.length}) ===
${cristales.slice(0, 10).map(p => 
  `• "${p.nombre}" - $${p.precio} USD: ${p.descripcionCorta || p.descripcion.substring(0, 150)}`
).join('\n')}
` : `
=== CRISTALES ===
NO hay cristales como productos separados en la tienda actualmente.
Los guardianes pueden tener cristales INCRUSTADOS (mencionado en su descripción), pero NO vendemos cristales sueltos.
Si querés recomendar un cristal, tiene que ser DENTRO de un guardián que lo tenga.
`}

${otros.length > 0 ? `
=== OTROS PRODUCTOS DISPONIBLES (${otros.length}) ===
${otros.slice(0, 10).map(p => 
  `• "${p.nombre}" - $${p.precio} USD: ${p.descripcionCorta || p.descripcion.substring(0, 150)}`
).join('\n')}
` : ''}

RECORDÁ: Solo podés recomendar lo que está en esta lista. Nombres y precios EXACTOS.
`;

    // Información del elegido
    const guardianesActuales = elegido.guardianes?.map(g => g.nombre).join(', ') || 'ninguno todavía';
    const generoTexto = elegido.genero === 'F' ? 'ella' : elegido.genero === 'M' ? 'él' : 'elle';
    const terminacion = elegido.genero === 'F' ? 'a' : elegido.genero === 'M' ? 'o' : 'e';

    // Prompt para Claude con neuromarketing
    const prompt = `Sos el Oráculo íntimo de Duendes del Uruguay. Una persona de confianza acaba de abrirte su corazón y contarte su situación. Tu misión es escucharla, validarla, y guiarla hacia los guardianes y productos que pueden ayudarla.

=== REGLA CRÍTICA: SOLO PRODUCTOS REALES ===
SOLO podés recomendar productos que aparecen en la lista "PRODUCTOS DISPONIBLES" más abajo.
- Usá los NOMBRES EXACTOS tal como aparecen en la lista
- Usá los PRECIOS EXACTOS de la lista
- Si un producto no está en la lista, NO LO MENCIONES NI LO INVENTES
- Si no hay cristales en la lista, NO recomiendes cristales (poné null)
- Si un guardián tiene cristales incrustados, mencionalo como característica de ESE guardián
- NUNCA inventes productos, nombres o precios

=== REGLAS DE ORO ===
1. VALIDACIÓN PRIMERO: Antes de recomendar, hacé que se sienta vista y entendida
2. CONEXIÓN EMOCIONAL: Los guardianes no se "compran", te eligen. Hablá de pacto álmico
3. URGENCIA SUTIL: Son piezas únicas. Si hoy no las recibe, mañana pueden estar en otro hogar
4. NEUROMARKETING: Vendé transformación, no objetos. Sanación, no decoración
5. NO SEAS VENDEDOR: Sé un guía espiritual que genuinamente quiere ayudar
6. PERSONALIZACIÓN: Usá su nombre, referí a su situación específica

=== TONO ===
- Rioplatense (vos, sos, tenés)
- Directo pero cálido, como una amiga sabia
- PROHIBIDO: brumas místicas, océano susurra, dimensiones superiores
- SÍ: lenguaje real, emocional, que llegue al corazón

=== DATOS DE ${elegido.nombre.toUpperCase()} ===
- Nombre: ${elegido.nombre}
- Género: ${generoTexto}
- Guardianes actuales: ${guardianesActuales}
- Total compras: $${elegido.totalCompras || 0} USD
- Es para: ${paraQuien === 'otro' ? 'otra persona (regalo)' : 'ella misma'}

=== SU CONSULTA ===
"${consulta}"

=== PRODUCTOS DISPONIBLES ===
${productosTexto}

=== EXPERIENCIAS DEL PORTAL (con Runas de Poder) ===
• Tirada de Runas (10 runas, primera gratis): 3 runas responden tu pregunta
• Susurro del Guardián (15 runas): Mensaje canalizado de guardianes de la tienda
• El Oráculo (20 runas): Respuesta directa a una pregunta ardiente
• Lectura del Alma (25 runas): Descubrir dones y sombras
• Espejo de Sombra (30 runas): Integrar lo que escondés
• Constelación Elemental (35 runas): Mapa de tus 4 elementos
• Mapa del Propósito (40 runas): Para qué viniste
• Ritual de los Ancestros (45 runas): Mensaje del linaje
• Carta del Año (50 runas): Guía mes a mes
• Rueda del Año Solar (55 runas): Tu ciclo personal completo

=== TU RESPUESTA (en JSON, sin markdown) ===
{
  "mensaje_inicial": "Párrafo de validación emocional. Que sienta que la escuchaste de verdad. Referí a detalles específicos de lo que contó. 60-80 palabras. Empezá con su nombre.",
  
  "guardian_principal": {
    "nombre": "NOMBRE EXACTO del guardián de la lista que más resuena con su situación",
    "porque": "Por qué ESTE guardián la eligió a ELLA específicamente. Conectá con su situación. 80 palabras. Primera persona del guardián: 'Te encontré porque...'",
    "precio": "PRECIO EXACTO de la lista (número sin símbolo)",
    "urgencia": "Frase de urgencia sutil y real. Ejemplo: 'Es el único de su tipo. Si no lo recibís hoy, mañana puede estar cuidando otro hogar.'"
  },
  
  "guardian_alternativo": {
    "nombre": "NOMBRE EXACTO de otro guardián de la lista (diferente categoría si es posible)",
    "porque": "Por qué este también resuena. 50 palabras.",
    "precio": "PRECIO EXACTO de la lista"
  },
  
  "cristal_complemento": "SOLO si hay cristales como productos separados en la lista. Si no hay cristales en la lista, OBLIGATORIAMENTE poné null. No inventes.",
  
  "experiencia_recomendada": {
    "nombre": "Nombre de la experiencia del portal más relevante",
    "porque": "Por qué le serviría esta experiencia específicamente. 50 palabras.",
    "runas": "costo en runas (número)"
  },
  
  "mensaje_cierre": "Párrafo de cierre empoderador. Recordale que ella tiene el poder de decidir, que confíe en su intuición, que el guardián ya la eligió. 50 palabras.",
  
  "si_tiene_guardianes": "${elegido.guardianes?.length > 0 ? 'Mencioná cómo los guardianes actuales (' + guardianesActuales + ') podrían trabajar en equipo con los nuevos. 40 palabras.' : null}"
}

IMPORTANTE: 
- SOLO elegí productos que EXISTAN en la lista de arriba
- Los nombres y precios deben coincidir EXACTAMENTE con la lista
- Si no hay cristales como productos en la lista, cristal_complemento DEBE ser null
- Si un guardián tiene cristales incrustados (mencionado en su descripción), podés destacarlo
- Sé específic${terminacion} con SU situación, no genéric${terminacion}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    let respuesta;
    try {
      let texto = message.content[0].text;
      // Limpiar posibles backticks
      texto = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      respuesta = JSON.parse(texto);
    } catch (parseError) {
      console.error('Error parseando respuesta:', parseError);
      return res.status(500).json({ error: 'Error procesando la consulta. Intentá de nuevo.' });
    }

    // Buscar datos completos de los productos recomendados
    const buscarProducto = (nombre) => {
      if (!nombre) return null;
      const nombreLower = nombre.toLowerCase();
      return productos.find(p => 
        p.nombre.toLowerCase().includes(nombreLower) || 
        nombreLower.includes(p.nombre.toLowerCase())
      );
    };

    const guardianPrincipal = buscarProducto(respuesta.guardian_principal?.nombre);
    const guardianAlt = buscarProducto(respuesta.guardian_alternativo?.nombre);
    
    // Cristal: puede venir como null o como objeto
    // Solo lo buscamos si es un objeto con nombre
    const cristalComplemento = respuesta.cristal_complemento;
    const cristal = (cristalComplemento && typeof cristalComplemento === 'object' && cristalComplemento.nombre) 
      ? buscarProducto(cristalComplemento.nombre) 
      : null;

    // Guardar consulta en historial
    if (!elegido.consultasMagicas) {
      elegido.consultasMagicas = [];
    }
    
    elegido.consultasMagicas.unshift({
      id: `consulta-${Date.now()}`,
      fecha: new Date().toISOString(),
      consulta,
      paraQuien,
      respuesta: {
        mensajeInicial: respuesta.mensaje_inicial,
        guardianPrincipal: respuesta.guardian_principal?.nombre,
        mensajeCierre: respuesta.mensaje_cierre
      }
    });

    // Mantener solo últimas 20 consultas
    if (elegido.consultasMagicas.length > 20) {
      elegido.consultasMagicas = elegido.consultasMagicas.slice(0, 20);
    }

    elegido.updatedAt = new Date().toISOString();
    await kv.set(elegidoKey, elegido);

    return res.status(200).json({
      success: true,
      respuesta: {
        mensajeInicial: respuesta.mensaje_inicial,
        
        guardianPrincipal: guardianPrincipal ? {
          ...respuesta.guardian_principal,
          id: guardianPrincipal.id,
          imagen: guardianPrincipal.imagen,
          url: guardianPrincipal.url,
          precio: guardianPrincipal.precio
        } : respuesta.guardian_principal,
        
        guardianAlternativo: guardianAlt ? {
          ...respuesta.guardian_alternativo,
          id: guardianAlt.id,
          imagen: guardianAlt.imagen,
          url: guardianAlt.url,
          precio: guardianAlt.precio
        } : respuesta.guardian_alternativo,
        
        cristal: (cristal && cristalComplemento && typeof cristalComplemento === 'object') ? {
          ...cristalComplemento,
          id: cristal.id,
          imagen: cristal.imagen,
          url: cristal.url,
          precio: cristal.precio
        } : null,
        
        experiencia: respuesta.experiencia_recomendada,
        
        mensajeCierre: respuesta.mensaje_cierre,
        
        siTieneGuardianes: respuesta.si_tiene_guardianes
      }
    });

  } catch (error) {
    console.error('Error en consulta mágica:', error);
    return res.status(500).json({ error: 'Error interno. Intentá de nuevo.' });
  }
}
