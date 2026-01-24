import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';

async function obtenerDatosLectura(orderId) {
  try {
    const response = await fetch(process.env.WORDPRESS_URL + '/wp-json/duendes/v1/lectura/' + orderId, { headers: { 'X-Duendes-Token': process.env.DUENDES_API_TOKEN } });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) { return null; }
}

export async function POST(request) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    const { orderId } = await request.json();
    const datos = await obtenerDatosLectura(orderId);
    if (!datos) return Response.json({ error: 'Pedido no encontrado' }, { status: 404 });

    const { cliente, lectura } = datos;
    const nombreCliente = cliente.nombre.trim();
    const emailCliente = cliente.email;

    let prompt = `Eres un experto canalizador de Duendes del Uruguay. Una persona te pide ayuda para conocer a un duende/guardian que tiene.

=== TU TONO ===
- Directo, calido, como hablando con una amiga
- NADA de: brumas misticas, oceano susurra, dimensiones superiores
- Usa emojis para separar secciones
- Se especifico y util

=== IMPORTANTE ===
- NO es un duende de Duendes del Uruguay (probablemente)
- Puede ser de cualquier origen, material, estilo
- Tu analisis debe ser UTIL pero mas simple que nuestras guias de canalizacion
- Al final, sutilmente menciona que si quiere un guardian canalizado de verdad, puede ver nuestra tienda

=== DATOS DE LA PERSONA ===
Nombre: ${nombreCliente}

=== DATOS DEL DUENDE/GUARDIAN ===
Nombre (si tiene): ${lectura.nombre_duende || 'No sabe'}
Origen: ${lectura.origen || 'No especificado'}
Hace cuanto lo tiene: ${lectura.tiempo || 'No especificado'}
Donde lo tiene ubicado: ${lectura.ubicacion || 'No especificado'}
Lo que sabe de el: ${lectura.que_sabe || 'Nada'}
Que quiere saber: ${lectura.que_quiere_saber || 'Todo'}
Situacion actual: ${lectura.situacion || 'No especificada'}

=== GENERA JSON (sin markdown) ===
{
  "saludo": "Saludo calido a ${nombreCliente}, 2-3 oraciones.",
  "primera_impresion": "PRIMERA IMPRESION - Que energia transmite este ser. 100 palabras.",
  "quien_es": "QUIEN ES ESTE SER - Analisis de que tipo de guardian es. 150 palabras.",
  "donde_ubicarlo": "DONDE UBICARLO - Recomendacion de ubicacion. 80 palabras.",
  "como_conectar": "COMO CONECTAR - Pasos simples. 100 palabras.",
  "que_pedirle": "QUE PODES PEDIRLE - Tipos de ayuda. 80 palabras.",
  "cuidados": "CUIDADOS BASICOS - 3-4 tips. 60 palabras.",
  "mensaje_final": "Cierre calido + invitacion a duendesdeluruguay.com. 50 palabras.",
  "firma": "Con carino, Equipo de Duendes del Uruguay"
}`;

    let content;
    try {
      const response = await anthropic.messages.create({ model: 'claude-sonnet-4-20250514', max_tokens: 4000, messages: [{ role: 'user', content: prompt }] });
      content = JSON.parse(response.content[0].text);
    } catch (e) {
      content = { saludo: 'Hola ' + nombreCliente + '!', primera_impresion: 'Tu guardian tiene energia especial.', quien_es: 'Este ser llego a tu vida por una razon.', donde_ubicarlo: 'Ubicalo donde puedas verlo.', como_conectar: 'Hablale con el corazon.', que_pedirle: 'Pedile proteccion y guia.', cuidados: 'Mantenelo limpio.', mensaje_final: 'Visita duendesdeluruguay.com', firma: 'Equipo Duendes' };
    }

    const lecturaId = 'lectura-' + orderId + '-' + Date.now();
    const lecturaUrl = 'https://duendes-vercel.vercel.app/lectura/' + lecturaId;

    await kv.set('lectura:' + lecturaId, { orderId, nombreCliente, emailCliente, datosLectura: lectura, content, createdAt: Date.now() });

    if (emailCliente) {
      try {
        await resend.emails.send({
          from: 'Duendes del Uruguay <info@duendesdeluruguay.com>',
          to: emailCliente,
          subject: 'Tu Lectura Ancestral esta lista!',
          html: '<div style="font-family:Georgia;background:#FDF8F0;padding:40px;max-width:600px;margin:0 auto;"><h1 style="color:#4A5D4A;text-align:center;">Lectura Ancestral</h1><div style="background:white;padding:30px;border-radius:10px;"><p>Hola <strong>' + nombreCliente + '</strong>!</p><p>Tu lectura esta lista.</p><div style="text-align:center;margin:30px;"><a href="' + lecturaUrl + '" style="background:#4A5D4A;color:white;padding:15px 40px;text-decoration:none;border-radius:5px;">Ver mi Lectura</a></div></div></div>'
        });
      } catch (e) { console.error('Error email:', e); }
    }

    return Response.json({ success: true, lecturaId, lecturaUrl, emailSent: !!emailCliente });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
