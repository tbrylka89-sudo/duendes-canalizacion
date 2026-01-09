import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { mensaje } = await request.json();
    
    const keys = await kv.keys('user:*');
    const usuarios = [];
    for (const k of keys.slice(0, 100)) {
      const u = await kv.get(k);
      if (u) usuarios.push({ 
        email: u.email, 
        nombre: u.nombre || 'Sin nombre', 
        runas: u.runas || 0, 
        treboles: u.treboles || 0, 
        esCirculo: u.esCirculo,
        gastado: u.gastado || 0
      });
    }

    const systemPrompt = `Sos Tito, el asistente de Duendes del Uruguay. Thibisay te habla.

PODÉS HACER:
- buscar_cliente: {query}
- dar_acceso: {email, nombre}
- dar_circulo: {email, dias}
- regalar_runas: {email, cantidad, mensaje?}
- regalar_treboles: {email, cantidad}
- enviar_email: {email, asunto, mensaje}
- enviar_masivo: {grupo, asunto, mensaje}
- crear_cupon: {codigo, descuento}
- crear_anticipado: {nombre, precio, imagen, horas}

USUARIOS (${usuarios.length}):
${usuarios.slice(0,20).map(u => `- ${u.nombre} (${u.email}): ᚱ${u.runas} ☘${u.treboles} ${u.esCirculo?'★':''}`).join('\n')}

Si te piden HACER algo, respondé con JSON: {"accion": "nombre", "datos": {...}}
Usá español rioplatense, sé cálido y eficiente.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: mensaje }]
    });

    let respuesta = response.content[0].text;
    let accion = null;
    
    const jsonMatch = respuesta.match(/\{[\s\S]*?"accion"[\s\S]*?\}/);
    if (jsonMatch) {
      try { accion = JSON.parse(jsonMatch[0]); respuesta = respuesta.replace(jsonMatch[0], '').trim(); } catch(e) {}
    }

    return Response.json({ success: true, respuesta, accion });
  } catch (error) {
    return Response.json({ success: false, respuesta: 'Error: ' + error.message });
  }
}
