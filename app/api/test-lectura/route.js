import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  
  try {
    const datos = await request.json();
    const nombreCliente = datos.nombre || 'Persona de Prueba';
    const lectura = {
      nombre_duende: datos.nombre_duende || '',
      origen: datos.origen || 'regalo',
      tiempo: datos.tiempo || '',
      ubicacion: datos.ubicacion || '',
      que_sabe: datos.que_sabe || '',
      que_quiere_saber: datos.que_quiere_saber || '',
      situacion: datos.situacion || ''
    };

    let prompt = `Eres un experto canalizador de Duendes del Uruguay analizando un duende/guardian que NO es de nuestra marca.

=== TU TONO ===
- Directo, calido, como hablando con una amiga
- NADA de: brumas misticas, oceano susurra, dimensiones superiores
- Usa emojis para separar secciones
- Se ESPECIFICO y UTIL

=== DATOS ===
Persona: ${nombreCliente}
Nombre del duende: ${lectura.nombre_duende || 'No tiene / No sabe'}
Origen: ${lectura.origen}
Hace cuanto lo tiene: ${lectura.tiempo || 'No especificado'}
Donde lo tiene: ${lectura.ubicacion || 'No especificado'}
Lo que sabe de el: ${lectura.que_sabe || 'Nada'}
Que quiere saber: ${lectura.que_quiere_saber}
Situacion actual: ${lectura.situacion || 'No especificada'}

=== INSTRUCCIONES IMPORTANTES ===
1. Si tiene nombre, usalo y destacalo. Si no tiene, sugerile uno que encaje con su energia.
2. CLASIFICA el tipo de guardian: Proteccion, Abundancia, Amor, Sanacion, Guia, Compania, o Mixto.
3. Se honesto: los guardianes no canalizados tienen energia mas GENERAL y DIFUSA que uno canalizado especificamente.
4. Dale info UTIL y concreta que pueda aplicar.
5. Al final, menciona sutilmente que si quiere un guardian canalizado con energia especifica para ella, puede conocer los nuestros.

=== GENERA JSON (sin markdown, sin backticks) ===
{
  "saludo": "Saludo calido a ${nombreCliente}. 2-3 oraciones.",
  
  "nombre_guardian": "🏷️ SOBRE SU NOMBRE\\n\\nSi tiene nombre, explicar que significa esa eleccion. Si no tiene, sugerir 2-3 nombres que encajen con su energia y por que. 60 palabras.",
  
  "tipo_guardian": "⚡ TIPO DE GUARDIAN\\n\\nClasificacion clara: es de PROTECCION, ABUNDANCIA, AMOR, SANACION, GUIA o COMPANIA? Explicar por que lo clasificas asi basandote en lo que conto. 80 palabras.",
  
  "nivel_energia": "💫 SU NIVEL DE ENERGIA\\n\\nSer honesto: los guardianes de produccion masiva o no canalizados tienen energia mas general. No es malo, pero es diferente a uno canalizado especificamente. Explicar esto con tacto. 80 palabras.",
  
  "donde_ubicarlo": "📍 DONDE UBICARLO\\n\\nLugar especifico segun su tipo. 60 palabras.",
  
  "como_activarlo": "✨ COMO ACTIVARLO\\n\\nRitual simple para conectar con el. 80 palabras.",
  
  "que_pedirle": "🙏 QUE PODES PEDIRLE\\n\\nSegun su tipo, que cosas especificas puede ayudarla. 60 palabras.",
  
  "limitaciones": "⚠️ SUS LIMITACIONES\\n\\nQue cosas NO esperar de un guardian no canalizado. Con tacto pero honesto. 50 palabras.",
  
  "cuidados": "🌿 CUIDADOS\\n\\n3 tips concretos. 50 palabras.",
  
  "mensaje_final": "💚 PARA CERRAR\\n\\nMensaje calido. Mencionar que si algun dia quiere un guardian canalizado especificamente para su energia y situacion, puede conocer los nuestros en duendesdeluruguay.com - son unicos, hechos a mano, y eligen a su persona. Pero sin presion, sutil. 70 palabras.",
  
  "firma": "Con carino desde Piriapolis,\\nEquipo de Duendes del Uruguay 🌿"
}`;

    const response = await anthropic.messages.create({ model: 'claude-sonnet-4-20250514', max_tokens: 5000, messages: [{ role: 'user', content: prompt }] });
    const content = JSON.parse(response.content[0].text);

    const lecturaId = 'test-' + Date.now();
    await kv.set('lectura:' + lecturaId, { orderId: 'test', nombreCliente, datosLectura: lectura, content, createdAt: Date.now() });

    return Response.json({ success: true, lecturaId, url: 'https://duendes-vercel.vercel.app/lectura/' + lecturaId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
