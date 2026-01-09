import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';

async function obtenerDatosCompletos(orderId) {
  try {
    const response = await fetch(process.env.WORDPRESS_URL + '/wp-json/duendes/v1/pedido/' + orderId, { headers: { 'X-Duendes-Token': process.env.DUENDES_API_TOKEN } });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) { return null; }
}

export async function POST(request) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    const { orderId } = await request.json();
    const pendingData = await kv.get('pending:' + orderId);
    if (!pendingData) return Response.json({ error: 'Pedido no encontrado' }, { status: 404 });

    const order = pendingData.orderData;
    const datosCompletos = await obtenerDatosCompletos(orderId);
    const compradorEmail = order.billing?.email || '';
    const compradorNombre = ((order.billing?.first_name || '') + ' ' + (order.billing?.last_name || '')).trim();
    
    let esRegalo = false, receptorNombre = compradorNombre, fechaNacimiento = '', numerologia = null, relacionRegalo = '', motivoRegalo = '', mensajeExtra = '', productos = [];
    
    if (datosCompletos?.canalizacion) {
      const c = datosCompletos.canalizacion;
      esRegalo = c.receptor === 'regalo';
      receptorNombre = c.nombre_receptor || receptorNombre;
      fechaNacimiento = c.fecha_nacimiento || '';
      numerologia = c.numerologia || null;
      relacionRegalo = c.relacion || '';
      motivoRegalo = c.motivo_regalo || '';
      mensajeExtra = c.mensaje_extra || '';
      if (datosCompletos.productos?.length > 0) productos = datosCompletos.productos;
    }
    
    if (productos.length === 0 && order.line_items) {
      productos = order.line_items.map(function(i) { return { nombre: i.name, descripcion: i.description || '', cantidad: i.quantity }; });
    }
    
    const nombresProductos = productos.map(function(p) { return p.nombre; }).join(', ');
    const cantidadProductos = productos.length;
    
    let infoProds = '';
    for (let i = 0; i < productos.length; i++) {
      const p = productos[i];
      infoProds += '=== GUARDIAN ' + (i+1) + ': ' + p.nombre + ' ===\n';
      if (p.descripcion) infoProds += 'DESCRIPCION:\n' + p.descripcion + '\n';
      if (p.descripcion_corta) infoProds += 'RESUMEN: ' + p.descripcion_corta + '\n';
      if (p.categorias) infoProds += 'CATEGORIAS: ' + p.categorias.join(', ') + '\n\n';
    }

    let prompt = `Eres el equipo de Duendes del Uruguay escribiendo una guia de canalizacion.

=== NUESTRO TONO (copialo) ===
"Te lo voy a decir sin vueltas: si Finnian aparecio en tu vida, es porque estas en un momento bisagra. Su mirada tranquila no es casualidad. Es la cara de quien ya vio tu pelicula y sabe que el final te va a gustar."

=== REGLAS ===
- Directo, como hablando con una amiga
- NADA de: brumas misticas, oceano susurra, dimensiones superiores
- USA emojis: 🏠 💎 ✨ 📍 💫 🌿 🔮 💌
- USA bullets y listas
- Somos Gabriel y Thibisay desde Piriapolis
- Duendes tienen 4 dedos
- El duende ELIGE a la persona

=== REGLAS DE NEGOCIO (MUY IMPORTANTE) ===
- SIEMPRE fomentar que tengan MAS guardianes (trabajan en equipo, se potencian)
- NUNCA decir que esperen o que no compren mas
- NUNCA limitar la cantidad de duendes
- Los guardianes AMAN tener companeros, se potencian entre si
- Cuantos mas guardianes, mas proteccion/abundancia/etc

`;
    if (esRegalo) {
      prompt += `PEDIDO: REGALO\nCompra: ${compradorNombre}\nPara: ${receptorNombre}\nRelacion: ${relacionRegalo}\nMotivo: ${motivoRegalo}\n${mensajeExtra ? 'Mensaje: ' + mensajeExtra : ''}\n\n`;
    } else {
      prompt += `PEDIDO: PARA ELLA\nNombre: ${receptorNombre}\n${mensajeExtra ? 'Mensaje: ' + mensajeExtra : ''}\n\n`;
    }
    if (fechaNacimiento) prompt += `NACIMIENTO: ${fechaNacimiento}\n`;
    if (numerologia) prompt += `NUMEROLOGIA: ${numerologia.numero_vida} (${numerologia.descripcion_vida}), ${numerologia.elemento}\n`;
    prompt += `\nPRODUCTO(S):\n${infoProds}`;
    if (cantidadProductos > 1) prompt += `*** ${cantidadProductos} GUARDIANES - Explica SINERGIA ***\n`;

    prompt += `
GENERA JSON (sin markdown):
{
  "bienvenida": "Hola ${receptorNombre}! Somos el equipo de Duendes del Uruguay... 100 palabras, calido, sin floreos.",
  "tu_guardian": "Quien es ${nombresProductos}, por que llego a tu vida, que viene a hacer. Basate en la descripcion. 200 palabras.",
  "mensaje_guardian": "💌 MENSAJE DE ${nombresProductos.toUpperCase()}\\n\\nMensaje en PRIMERA PERSONA del duende a ${receptorNombre}. Como si le hablara directo: '${receptorNombre}, te vi...' Intimo, que la haga sentir vista. 150 palabras.",
  "cristales": "💎 CRISTALES\\n\\n- 💛 Nombre: para cuando...\\n- 💚 Nombre: para...\\nBasate en la descripcion del producto.",
  "antes_de_que_llegue": "🏠 PREPARAR TU HOGAR\\n\\n1. ...\\n2. ...\\n3. ...\\n100 palabras.",
  "donde_ponerlo": "📍 DONDE UBICARLO\\n\\nLugar especifico y por que. 80 palabras.",
  "ritual_cuando_llegue": "✨ RITUAL DE ACTIVACION\\n\\n1. ...\\n2. ...\\n3. ...\\nPaso a paso. 150 palabras.",
  "como_pedirle": "🔮 COMO PEDIRLE COSAS\\n\\nEjemplos de frases concretas. 100 palabras.",
  "senales": "💫 SENALES\\n\\nQue coincidencias buscar. 80 palabras.",
  "cuidados": "🌿 CUIDADOS\\n\\n- Limpieza energetica\\n- Ofrendas\\n- Que NO hacer\\n100 palabras.",
  "dudas_frecuentes": "❓ PREGUNTAS FRECUENTES\\n\\nQ: Puedo tener mas guardianes?\\nA: Si! Los guardianes AMAN tener companeros. Se potencian entre si y trabajan en equipo para vos.\\n\\nQ: Puedo tocarlo?\\nA: Claro! El contacto fortalece el vinculo.\\n\\nQ: Y si se cae?\\nA: Limpialo con amor y volvelo a su lugar. Los accidentes pasan.",
  ${cantidadProductos > 1 ? '"sinergia": "🤝 TUS GUARDIANES JUNTOS\\n\\nComo se potencian, donde va cada uno. 150 palabras.",' : ''}
  "cierre": "Mensaje final calido. Invitala a seguir en redes y ver mas guardianes. 50 palabras.",
  "firma": "Con amor y magia desde Piriapolis,\\nGabriel, Thibisay y el equipo 🌿"
}`;

    let content;
    try {
      const response = await anthropic.messages.create({ model: 'claude-sonnet-4-20250514', max_tokens: 8000, messages: [{ role: 'user', content: prompt }] });
      content = JSON.parse(response.content[0].text);
    } catch (e) {
      content = { bienvenida: 'Hola ' + receptorNombre + '!', tu_guardian: nombresProductos + ' llego a vos.', mensaje_guardian: '💌 ' + receptorNombre + ', te estaba esperando.', cristales: '💎 Energia especial.', antes_de_que_llegue: '🏠 Limpia con salvia.', donde_ponerlo: '📍 Donde lo veas.', ritual_cuando_llegue: '✨ Sostenelo y presentate.', como_pedirle: '🔮 Hablale.', senales: '💫 Coincidencias.', cuidados: '🌿 Limpio.', dudas_frecuentes: '❓ Escribinos.', cierre: 'Gracias!', firma: 'Equipo Duendes 🌿' };
    }

    const guideId = orderId + '-' + Date.now();
    const guideUrl = 'https://duendes-vercel.vercel.app/guardian/' + guideId;
    const pdfUrl = 'https://duendes-vercel.vercel.app/api/pdf/' + guideId;

    await kv.set('guide:' + guideId, { orderId, esRegalo, compradorNombre, compradorEmail, receptorNombre, fechaNacimiento, numerologia, productos, content, createdAt: Date.now() });
    await kv.set('pending:' + orderId, { ...pendingData, status: 'generated', guideId });

    if (compradorEmail) {
      try {
        await resend.emails.send({
          from: 'Duendes del Uruguay <onboarding@resend.dev>',
          to: compradorEmail,
          subject: '🌿 Tu Guia de ' + nombresProductos,
          html: '<div style="font-family:Georgia;background:#FDF8F0;padding:40px;max-width:600px;margin:0 auto;"><h1 style="color:#4A5D4A;text-align:center;">🍀 Duendes del Uruguay</h1><div style="background:white;padding:30px;border-radius:10px;"><p>Hola <strong>' + (esRegalo ? compradorNombre : receptorNombre) + '</strong>!</p><p>Tu guia de <strong>' + nombresProductos + '</strong> esta lista.</p><div style="text-align:center;margin:30px;"><a href="' + guideUrl + '" style="background:#4A5D4A;color:white;padding:15px 40px;text-decoration:none;border-radius:5px;">Ver mi Guia ✨</a></div><p style="text-align:center;"><a href="' + pdfUrl + '" style="color:#4A5D4A;">📥 PDF</a></p></div></div>'
        });
      } catch (e) {}
    }

    return Response.json({ success: true, guideId, guideUrl, esRegalo, receptor: receptorNombre, emailSent: !!compradorEmail });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
