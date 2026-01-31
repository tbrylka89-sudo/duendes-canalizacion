import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

/**
 * GENERADOR DE CERTIFICADOS DE CANALIZACIÓN
 *
 * Genera un certificado HTML digital que se accede online
 * con toda la información del guardián y su canalización.
 */

// Generar número único de certificado
function generarNumeroCertificado(orderId, fecha) {
  const year = new Date(fecha).getFullYear();
  const hash = Buffer.from(`${orderId}-${fecha}`).toString('base64').slice(0, 6).toUpperCase();
  return `DU-${year}-${hash}`;
}

// Generar URL del QR (usa API de QR gratuita)
function generarQRUrl(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
}

/**
 * GET - Generar certificado HTML para impresión
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order');
    const format = searchParams.get('format') || 'html'; // html o json

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Falta parámetro: order' },
        { status: 400 }
      );
    }

    // Buscar datos de la orden en KV
    let ordenData = null;
    try {
      ordenData = await kv.get(`orden:${orderId}`);
    } catch (e) {
      console.log('[certificado] No se encontró orden en KV');
    }

    // Si no hay datos en KV, usar datos de ejemplo/prueba
    const datos = ordenData || {
      orden_id: orderId,
      nombre_humano: 'Querido Humano',
      guardian_nombre: 'Guardián Misterioso',
      guardian_genero: 'f',
      guardian_imagen: null,
      fecha_canalizacion: new Date().toISOString(),
      mensaje_guardian: 'Este guardián fue canalizado especialmente para vos. Su energía única te acompañará en tu camino.',
      sincrodestino: 'Canalizado bajo la luz de la luna creciente',
      categoria: 'Protección'
    };

    const numeroCertificado = generarNumeroCertificado(orderId, datos.fecha_canalizacion);
    const miMagiaUrl = `https://duendesdeluruguay.com/mi-magia?token=${orderId}`;
    const qrUrl = generarQRUrl(miMagiaUrl);
    const fechaFormateada = new Date(datos.fecha_canalizacion).toLocaleDateString('es-UY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Si piden JSON, devolver datos
    if (format === 'json') {
      return NextResponse.json({
        success: true,
        certificado: {
          numero: numeroCertificado,
          orden_id: orderId,
          nombre_humano: datos.nombre_humano,
          guardian_nombre: datos.guardian_nombre,
          fecha_canalizacion: fechaFormateada,
          mensaje: datos.mensaje_guardian,
          sincrodestino: datos.sincrodestino,
          categoria: datos.categoria,
          qr_url: qrUrl,
          mi_magia_url: miMagiaUrl
        }
      });
    }

    // Generar HTML del certificado
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado de Canalización - ${datos.guardian_nombre}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @page {
      size: A4;
      margin: 0;
    }

    body {
      font-family: 'Cormorant Garamond', Georgia, serif;
      background: #0a0a0a;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .certificado {
      width: 210mm;
      min-height: 297mm;
      background: linear-gradient(180deg, #FAF8F5 0%, #F5F0E8 100%);
      padding: 40px 50px;
      position: relative;
      overflow: hidden;
    }

    /* Borde decorativo */
    .certificado::before {
      content: '';
      position: absolute;
      top: 15px;
      left: 15px;
      right: 15px;
      bottom: 15px;
      border: 2px solid #C6A962;
      border-radius: 5px;
      pointer-events: none;
    }

    /* Esquinas decorativas */
    .corner {
      position: absolute;
      width: 40px;
      height: 40px;
      border: 3px solid #C6A962;
    }
    .corner-tl { top: 25px; left: 25px; border-right: none; border-bottom: none; }
    .corner-tr { top: 25px; right: 25px; border-left: none; border-bottom: none; }
    .corner-bl { bottom: 25px; left: 25px; border-right: none; border-top: none; }
    .corner-br { bottom: 25px; right: 25px; border-left: none; border-top: none; }

    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-top: 20px;
    }

    .logo-text {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      letter-spacing: 4px;
      color: #8B7355;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .titulo {
      font-family: 'Cinzel', serif;
      font-size: 32px;
      color: #1a1a1a;
      letter-spacing: 3px;
      margin-bottom: 5px;
    }

    .subtitulo {
      font-size: 16px;
      color: #666;
      font-style: italic;
    }

    .linea-dorada {
      width: 100px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #C6A962, transparent);
      margin: 25px auto;
    }

    .imagen-guardian {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #C6A962;
      box-shadow: 0 4px 20px rgba(198, 169, 98, 0.3);
      margin: 0 auto 20px;
      display: block;
    }

    .contenido {
      text-align: center;
      margin: 30px 0;
    }

    .certifica {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 15px;
    }

    .nombre-guardian {
      font-family: 'Cinzel', serif;
      font-size: 42px;
      color: #C6A962;
      margin-bottom: 10px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }

    .tipo-guardian {
      font-size: 18px;
      color: #8B7355;
      font-style: italic;
      margin-bottom: 30px;
    }

    .elegido-para {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }

    .nombre-humano {
      font-family: 'Cinzel', serif;
      font-size: 28px;
      color: #1a1a1a;
      margin-bottom: 30px;
    }

    .mensaje-box {
      background: rgba(198, 169, 98, 0.08);
      border-left: 3px solid #C6A962;
      padding: 25px 30px;
      margin: 30px 20px;
      text-align: left;
    }

    .mensaje-titulo {
      font-family: 'Cinzel', serif;
      font-size: 12px;
      color: #8B7355;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 10px;
    }

    .mensaje-texto {
      font-size: 16px;
      color: #2a2a2a;
      line-height: 1.7;
      font-style: italic;
    }

    .detalles {
      display: flex;
      justify-content: space-around;
      margin: 40px 0;
      text-align: center;
    }

    .detalle {
      flex: 1;
    }

    .detalle-label {
      font-size: 11px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }

    .detalle-valor {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      color: #1a1a1a;
    }

    .sincrodestino {
      text-align: center;
      margin: 30px 0;
      padding: 20px;
    }

    .sincro-label {
      font-size: 11px;
      color: #C6A962;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }

    .sincro-texto {
      font-size: 15px;
      color: #666;
      font-style: italic;
    }

    .footer {
      margin-top: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 20px;
    }

    .qr-section {
      text-align: center;
    }

    .qr-code {
      width: 100px;
      height: 100px;
      margin-bottom: 5px;
    }

    .qr-texto {
      font-size: 9px;
      color: #999;
    }

    .numero-certificado {
      position: absolute;
      bottom: 35px;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'Cinzel', serif;
      font-size: 10px;
      color: #C6A962;
      letter-spacing: 2px;
    }

    /* Botón de guardar (no aparece al imprimir) */
    .no-print {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 100;
    }

    .btn-guardar {
      background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
      color: #1a1a1a;
      border: none;
      padding: 15px 30px;
      font-family: 'Cinzel', serif;
      font-size: 14px;
      letter-spacing: 2px;
      cursor: pointer;
      border-radius: 50px;
      box-shadow: 0 8px 25px rgba(198, 169, 98, 0.4);
      transition: all 0.3s;
    }

    .btn-guardar:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(198, 169, 98, 0.5);
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      .certificado {
        box-shadow: none;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="certificado">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="header">
      <div class="logo-text">Duendes del Uruguay</div>
      <h1 class="titulo">Certificado de Canalización</h1>
      <p class="subtitulo">Documento oficial de adopción y conexión</p>
    </div>

    <div class="linea-dorada"></div>

    <div class="contenido">
      ${datos.guardian_imagen ? `<img src="${datos.guardian_imagen}" alt="${datos.guardian_nombre}" class="imagen-guardian" />` : ''}
      <p class="certifica">Este documento certifica que</p>
      <h2 class="nombre-guardian">${datos.guardian_nombre}</h2>
      <p class="tipo-guardian">Guardián de ${datos.categoria}</p>

      <p class="elegido-para">Ha elegido como su compañer${datos.guardian_genero === 'f' ? 'a' : 'o'} de vida a</p>
      <h3 class="nombre-humano">${datos.nombre_humano}</h3>
    </div>

    <div class="mensaje-box">
      <p class="mensaje-titulo">Mensaje Canalizado</p>
      <p class="mensaje-texto">"${datos.mensaje_guardian}"</p>
    </div>

    <div class="detalles">
      <div class="detalle">
        <p class="detalle-label">Fecha de Canalización</p>
        <p class="detalle-valor">${fechaFormateada}</p>
      </div>
      <div class="detalle">
        <p class="detalle-label">Número de Orden</p>
        <p class="detalle-valor">#${orderId}</p>
      </div>
      <div class="detalle">
        <p class="detalle-label">Categoría</p>
        <p class="detalle-valor">${datos.categoria}</p>
      </div>
    </div>

    <div class="sincrodestino">
      <p class="sincro-label">Sincrodestino de Creación</p>
      <p class="sincro-texto">${datos.sincrodestino}</p>
    </div>

    <div class="footer">
      <div class="qr-section">
        <img src="${qrUrl}" alt="QR Mi Magia" class="qr-code" />
        <p class="qr-texto">Escaneá para acceder<br>a tu portal Mi Magia</p>
      </div>
    </div>

    <p class="numero-certificado">CERTIFICADO ${numeroCertificado}</p>
  </div>

  <div class="no-print">
    <button class="btn-guardar" onclick="window.print()">
      GUARDAR COMO PDF
    </button>
  </div>
</body>
</html>
`;

    // Devolver HTML
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('[certificado] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al generar certificado', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST - Guardar datos de canalización para certificado
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      orden_id,
      nombre_humano,
      guardian_nombre,
      guardian_genero = 'f',
      guardian_imagen,
      mensaje_guardian,
      sincrodestino,
      categoria
    } = body;

    if (!orden_id || !nombre_humano || !guardian_nombre) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const datos = {
      orden_id,
      nombre_humano,
      guardian_nombre,
      guardian_genero,
      guardian_imagen: guardian_imagen || null,
      mensaje_guardian: mensaje_guardian || 'Tu guardián ha sido canalizado con amor y dedicación.',
      sincrodestino: sincrodestino || 'Canalizado en un momento especial del universo',
      categoria: categoria || 'Protección',
      fecha_canalizacion: new Date().toISOString()
    };

    // Guardar en KV
    await kv.set(`orden:${orden_id}`, datos, { ex: 60 * 60 * 24 * 365 }); // 1 año TTL

    const certificadoUrl = `https://duendesdeluruguay.com/api/certificado?order=${orden_id}`;

    return NextResponse.json({
      success: true,
      mensaje: 'Datos de canalización guardados',
      certificado_url: certificadoUrl,
      numero_certificado: generarNumeroCertificado(orden_id, datos.fecha_canalizacion)
    });

  } catch (error) {
    console.error('[certificado] Error POST:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar datos', details: error.message },
      { status: 500 }
    );
  }
}
