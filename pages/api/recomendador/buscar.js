import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, texto, paraMi, descripcionRegalo } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    if (!texto || texto.trim().length < 10) {
      return res.status(400).json({ error: 'Contanos un poco más sobre lo que buscás' });
    }

    // Verificar token
    const email = await kv.get(`token:${token}`);
    if (!email) {
      return res.status(404).json({ error: 'Token no válido' });
    }

    // Obtener usuario
    const usuario = await kv.get(`elegido:${email}`);

    // Catálogo de guardianes disponibles (esto idealmente vendría de WooCommerce)
    // Por ahora hardcodeamos algunos ejemplos
    const catalogoGuardianes = [
      {
        id: 'eldrin-sabio',
        nombre: 'Eldrin el Sabio',
        categorias: ['Sabiduría', 'Protección'],
        cristales: ['Amatista', 'Cuarzo Cristal'],
        descripcion: 'Guardián anciano que porta la luz del conocimiento. Ideal para momentos de confusión, decisiones importantes y búsqueda de claridad.',
        imagen: 'https://duendesdeluruguay.com/wp-content/uploads/eldrin.jpg',
        url: 'https://duendesdeluruguay.com/producto/eldrin-sabio'
      },
      {
        id: 'aurora-corazon',
        nombre: 'Aurora del Corazón',
        categorias: ['Amor', 'Sanación'],
        cristales: ['Cuarzo Rosa', 'Rodocrosita'],
        descripcion: 'Guardiana del amor incondicional. Para sanar heridas emocionales, atraer amor propio y relaciones sanas.',
        imagen: 'https://duendesdeluruguay.com/wp-content/uploads/aurora.jpg',
        url: 'https://duendesdeluruguay.com/producto/aurora-corazon'
      },
      {
        id: 'thor-guardian',
        nombre: 'Thor el Guardián',
        categorias: ['Protección', 'Fuerza'],
        cristales: ['Turmalina Negra', 'Obsidiana'],
        descripcion: 'Protector implacable contra energías negativas. Para quienes necesitan sentirse seguros, proteger su hogar y establecer límites.',
        imagen: 'https://duendesdeluruguay.com/wp-content/uploads/thor.jpg',
        url: 'https://duendesdeluruguay.com/producto/thor-guardian'
      },
      {
        id: 'fortuna-dorada',
        nombre: 'Fortuna la Dorada',
        categorias: ['Abundancia', 'Prosperidad'],
        cristales: ['Citrino', 'Pirita'],
        descripcion: 'Atrae prosperidad y nuevas oportunidades. Para emprendedoras, quienes buscan estabilidad económica o un nuevo comienzo.',
        imagen: 'https://duendesdeluruguay.com/wp-content/uploads/fortuna.jpg',
        url: 'https://duendesdeluruguay.com/producto/fortuna-dorada'
      },
      {
        id: 'luna-sanadora',
        nombre: 'Luna la Sanadora',
        categorias: ['Salud', 'Sanación'],
        cristales: ['Selenita', 'Cuarzo Rosa'],
        descripcion: 'Guardiana de la salud física y emocional. Para procesos de recuperación, equilibrio energético y bienestar integral.',
        imagen: 'https://duendesdeluruguay.com/wp-content/uploads/luna.jpg',
        url: 'https://duendesdeluruguay.com/producto/luna-sanadora'
      },
      {
        id: 'gaia-raices',
        nombre: 'Gaia de las Raíces',
        categorias: ['Tierra', 'Arraigo'],
        cristales: ['Jaspe Rojo', 'Ágata'],
        descripcion: 'Conexión profunda con la tierra. Para quienes se sienten desconectadas, ansiosas o necesitan estabilidad.',
        imagen: 'https://duendesdeluruguay.com/wp-content/uploads/gaia.jpg',
        url: 'https://duendesdeluruguay.com/producto/gaia-raices'
      }
    ];

    // Construir prompt para Claude
    const prompt = `Sos un experto en guardianes mágicos de Duendes del Uruguay. Tu rol es recomendar el guardián ideal basándote en lo que la persona comparte.

CATÁLOGO DE GUARDIANES DISPONIBLES:
${JSON.stringify(catalogoGuardianes, null, 2)}

INFORMACIÓN DEL CONSULTANTE:
${usuario?.nombrePreferido ? `Nombre: ${usuario.nombrePreferido}` : ''}
${usuario?.pronombre ? `Pronombre: ${usuario.pronombre}` : ''}
${usuario?.guardianes?.length ? `Ya tiene estos guardianes: ${usuario.guardianes.map(g => g.nombre).join(', ')}` : 'Aún no tiene guardianes'}

SITUACIÓN QUE COMPARTE:
${texto}

ES PARA: ${paraMi ? 'La misma persona' : 'Un regalo'}
${!paraMi && descripcionRegalo ? `DESCRIPCIÓN DE QUIEN LO RECIBE: ${descripcionRegalo}` : ''}

INSTRUCCIONES:
1. Analizá profundamente lo que comparte
2. Seleccioná 1 a 3 guardianes del catálogo que mejor se ajusten
3. Si ya tiene guardianes, evitá recomendar los mismos
4. Explicá de forma empática y personal POR QUÉ cada uno es ideal

FORMATO DE RESPUESTA (JSON estricto):
{
  "mensaje_intro": "Un mensaje cálido y empático de 2-3 oraciones reconociendo lo que compartió",
  "recomendaciones": [
    {
      "id": "id-del-guardian",
      "nombre": "Nombre completo",
      "razon": "Explicación personalizada de 3-4 oraciones de por qué este guardián es ideal para su situación específica",
      "imagen": "URL de la imagen",
      "url": "URL del producto"
    }
  ]
}

Usá español rioplatense (vos, tenés). Sé cálido pero no cursi. Evitá palabras como "ancestral" o "milenario".`;

    // Llamar a Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extraer respuesta
    const contenido = response.content[0].text;
    
    // Parsear JSON
    let resultado;
    try {
      // Buscar el JSON en la respuesta
      const jsonMatch = contenido.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resultado = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se encontró JSON válido');
      }
    } catch (parseError) {
      console.error('Error parseando respuesta:', parseError);
      return res.status(500).json({ 
        error: 'Error procesando recomendación',
        raw: contenido 
      });
    }

    return res.status(200).json(resultado);

  } catch (error) {
    console.error('Error en recomendador:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}
