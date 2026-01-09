import { kv } from '@vercel/kv';

export async function GET(request, { params }) {
  const { id } = await params;
  const guide = await kv.get('guide:' + id);

  if (!guide) {
    return new Response('Guia no encontrada', { status: 404 });
  }

  const { receptorNombre, productos, content, esRegalo, compradorNombre } = guide;
  const nombresProductos = productos?.map(p => p.nombre).join(', ') || 'Tu guardian';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Guia de ${nombresProductos}</title>
  <style>
    body { font-family: Georgia, serif; background: #FDF8F0; color: #2C2416; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.8; }
    h1 { color: #4A5D4A; text-align: center; }
    h2 { color: #4A5D4A; margin-top: 30px; }
    .header { text-align: center; border-bottom: 2px solid #C6A962; padding-bottom: 30px; margin-bottom: 30px; }
    .header p { color: #C6A962; font-size: 14px; letter-spacing: 2px; }
    .section { background: white; padding: 25px; border-radius: 10px; margin-bottom: 20px; white-space: pre-wrap; }
    .dark { background: #4A5D4A; color: white; }
    .footer { text-align: center; margin-top: 40px; color: #4A5D4A; }
  </style>
</head>
<body>
  <div class="header">
    <p>🍀 DUENDES DEL URUGUAY</p>
    <h1>Guia de Canalizacion</h1>
    <p style="color: #2C2416; font-size: 18px;">${nombresProductos}</p>
    ${esRegalo ? '<p style="color: #4A5D4A;">🎁 Regalo de ' + compradorNombre + '</p>' : ''}
  </div>

  ${content.bienvenida ? '<div class="section">' + content.bienvenida + '</div>' : ''}
  ${content.tu_guardian ? '<div class="section">' + content.tu_guardian + '</div>' : ''}
  ${content.mensaje_guardian ? '<div class="section dark">' + content.mensaje_guardian + '</div>' : ''}
  ${content.cristales ? '<div class="section">' + content.cristales + '</div>' : ''}
  ${content.antes_de_que_llegue ? '<div class="section">' + content.antes_de_que_llegue + '</div>' : ''}
  ${content.donde_ponerlo ? '<div class="section">' + content.donde_ponerlo + '</div>' : ''}
  ${content.ritual_cuando_llegue ? '<div class="section">' + content.ritual_cuando_llegue + '</div>' : ''}
  ${content.como_pedirle ? '<div class="section">' + content.como_pedirle + '</div>' : ''}
  ${content.senales ? '<div class="section">' + content.senales + '</div>' : ''}
  ${content.cuidados ? '<div class="section">' + content.cuidados + '</div>' : ''}
  ${content.dudas_frecuentes ? '<div class="section">' + content.dudas_frecuentes + '</div>' : ''}
  ${content.sinergia ? '<div class="section">' + content.sinergia + '</div>' : ''}
  
  <div class="footer">
    <p>${content.cierre || ''}</p>
    <p><strong>${content.firma || 'Equipo Duendes del Uruguay 🌿'}</strong></p>
    <p style="margin-top: 20px; font-size: 14px;">www.duendesdeluruguay.com</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'attachment; filename="guia-' + nombresProductos.replace(/[^a-z0-9]/gi, '-') + '.html"'
    }
  });
}
