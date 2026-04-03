export const dynamic = "force-dynamic";
import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Sugerencias inteligentes de Tito
// Genera sugerencias personalizadas basadas en perfil y comportamiento del usuario
// ═══════════════════════════════════════════════════════════════════════════════

// Productos sugeridos por nivel adquisitivo
const PRODUCTOS_POR_NIVEL = {
  bronce: [
    { tipo: 'experiencia', nombre: 'Tirada de Runas', precio: 8, desc: 'Guía rápida con runas', categoria: 'lectura' },
    { tipo: 'experiencia', nombre: 'Pregunta Específica', precio: 12, desc: 'Respuesta directa', categoria: 'lectura' },
    { tipo: 'pack', nombre: 'Pack Chispa', precio: 7, desc: '50 runas para empezar', categoria: 'runas' }
  ],
  plata: [
    { tipo: 'guardian', nombre: 'Pixie Protector', precio: 35, desc: 'Pequeño guardián', categoria: 'guardian' },
    { tipo: 'guardian', nombre: 'Mini Guardián', precio: 45, desc: 'Compañero de bolsillo', categoria: 'guardian' },
    { tipo: 'experiencia', nombre: 'Oráculo del Mes', precio: 18, desc: 'Guía mensual', categoria: 'lectura' },
    { tipo: 'pack', nombre: 'Pack Destello', precio: 12, desc: '100 runas', categoria: 'runas' }
  ],
  oro: [
    { tipo: 'guardian', nombre: 'Guardián Mediano', precio: 85, desc: 'Protector del hogar', categoria: 'guardian' },
    { tipo: 'guardian', nombre: 'Guardián con Cristal', precio: 120, desc: 'Energía amplificada', categoria: 'guardian' },
    { tipo: 'experiencia', nombre: 'Lectura del Alma', precio: 45, desc: 'Análisis profundo', categoria: 'lectura' },
    { tipo: 'pack', nombre: 'Pack Fulgor', precio: 18, desc: '200 runas', categoria: 'runas' }
  ],
  diamante: [
    { tipo: 'guardian', nombre: 'Guardián Premium', precio: 180, desc: 'Pieza de colección', categoria: 'guardian' },
    { tipo: 'guardian', nombre: 'Guardián Exclusivo', precio: 250, desc: 'Edición limitada', categoria: 'guardian' },
    { tipo: 'experiencia', nombre: 'Registros Akáshicos', precio: 60, desc: 'Viaje al alma', categoria: 'lectura' },
    { tipo: 'pack', nombre: 'Pack Resplandor', precio: 32, desc: '350 runas', categoria: 'runas' }
  ]
};

// Mensajes por contexto
const MENSAJES = {
  bienvenida: [
    '¡Hola {nombre}! ¿Qué tal va tu día mágico?',
    '¡{nombre}! Qué bueno verte por acá.',
    'Bienvenida de vuelta, {nombre}. ¿En qué te ayudo?'
  ],
  intereses: {
    cristales: '💎 Vi que te interesan los cristales... ¿Viste los guardianes con amatista?',
    runas: 'ᚱ Como te gustan las runas, quizás te interese una tirada personalizada.',
    tarot: '🃏 Para alguien que le atrae el tarot, el Oráculo del Mes puede encantarte.',
    meditacion: '🧘 Para tu práctica de meditación, Sage es un guardián perfecto.',
    rituales: '🕯 ¿Sabías que tenemos rituales personalizados? Perfectos para vos.',
    luna: '🌙 Esta semana la luna está perfecta para una lectura energética.'
  },
  objetivos: {
    proteccion: '🛡 Si buscás protección, Frost es especialista en escudos energéticos.',
    abundancia: '✨ Para atraer abundancia, Rowan tiene la energía perfecta.',
    amor: '💕 Luna puede ayudarte con temas del corazón...',
    sanacion: '💚 Sage es la guardiana de la sanación. ¿La conocés?',
    guia: '🧭 Necesitás guía? Una tirada de runas te puede dar claridad.',
    paz: '☮ Aurora trae paz y nuevos comienzos. Puede ser tu aliada.'
  },
  treboles: {
    pocos: '☘ Tenés {cantidad} tréboles. Con {faltante} más podrías canjear un cupón de $5.',
    medios: '☘ ¡{cantidad} tréboles! Estás cerca de un envío gratis.',
    muchos: '☘ Wow, {cantidad} tréboles. ¿Sabías que podés canjearlos por experiencias gratis?'
  },
  inactividad: [
    '¡Te extrañamos! Mirá las novedades que llegaron...',
    'Hace tiempo no te veo. ¿Querés ver los nuevos guardianes?',
    '¿Sabías que agregamos experiencias nuevas? Te van a encantar.'
  ],
  productoVisto: '¿Seguís pensando en {producto}? Es uno de los favoritos.',
  primerCompra: '🎁 Para tu primera compra, tenés 100 runas de regalo esperándote.'
};

export async function POST(request) {
  try {
    const { email, contexto } = await request.json();

    if (!email) {
      return Response.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    // Obtener datos del usuario
    const usuario = await kv.get(`user:${email}`) || await kv.get(`elegido:${email}`);
    const perfil = await kv.get(`perfil:${email}`);

    if (!usuario) {
      return Response.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    const sugerencias = [];
    const clasificacion = perfil?.clasificacion || 'bronce';
    const nombre = perfil?.nombrePreferido || usuario?.nombre || 'amiga';

    // 1. Sugerencia de bienvenida si es primera vez del día
    const hoy = new Date().toISOString().split('T')[0];
    const ultimaSugerencia = await kv.get(`sugerencia:${email}:${hoy}`);

    if (!ultimaSugerencia) {
      const msgBienvenida = MENSAJES.bienvenida[Math.floor(Math.random() * MENSAJES.bienvenida.length)];
      sugerencias.push({
        tipo: 'bienvenida',
        mensaje: msgBienvenida.replace('{nombre}', nombre),
        prioridad: 1
      });
      await kv.set(`sugerencia:${email}:${hoy}`, true, { ex: 86400 });
    }

    // 2. Sugerencia basada en intereses
    if (perfil?.atraccionPrincipal?.length > 0) {
      const interes = perfil.atraccionPrincipal[Math.floor(Math.random() * perfil.atraccionPrincipal.length)];
      if (MENSAJES.intereses[interes]) {
        sugerencias.push({
          tipo: 'interes',
          mensaje: MENSAJES.intereses[interes],
          categoria: interes,
          prioridad: 2
        });
      }
    }

    // 3. Sugerencia basada en qué busca
    if (perfil?.queBusca?.length > 0) {
      const objetivo = perfil.queBusca[Math.floor(Math.random() * perfil.queBusca.length)];
      if (MENSAJES.objetivos[objetivo]) {
        sugerencias.push({
          tipo: 'objetivo',
          mensaje: MENSAJES.objetivos[objetivo],
          categoria: objetivo,
          prioridad: 2
        });
      }
    }

    // 4. Sugerencia de tréboles
    const treboles = usuario?.treboles || 0;
    if (treboles > 0) {
      let msgTreboles;
      if (treboles < 30) {
        msgTreboles = MENSAJES.treboles.pocos
          .replace('{cantidad}', treboles)
          .replace('{faltante}', 30 - treboles);
      } else if (treboles < 60) {
        msgTreboles = MENSAJES.treboles.medios.replace('{cantidad}', treboles);
      } else {
        msgTreboles = MENSAJES.treboles.muchos.replace('{cantidad}', treboles);
      }
      sugerencias.push({
        tipo: 'treboles',
        mensaje: msgTreboles,
        treboles,
        prioridad: 3
      });
    }

    // 5. Sugerencia de primera compra si nunca compró
    if (!usuario?.compras || usuario.compras.length === 0) {
      sugerencias.push({
        tipo: 'primera-compra',
        mensaje: MENSAJES.primerCompra,
        prioridad: 1
      });
    }

    // 6. Productos recomendados por nivel
    const productosNivel = PRODUCTOS_POR_NIVEL[clasificacion] || PRODUCTOS_POR_NIVEL.bronce;
    const productoRecomendado = productosNivel[Math.floor(Math.random() * productosNivel.length)];

    sugerencias.push({
      tipo: 'producto',
      mensaje: `Te recomiendo: ${productoRecomendado.nombre} - ${productoRecomendado.desc}`,
      producto: productoRecomendado,
      prioridad: 4
    });

    // Ordenar por prioridad y limitar a 3
    sugerencias.sort((a, b) => a.prioridad - b.prioridad);
    const sugerenciasFinales = sugerencias.slice(0, 3);

    return Response.json({
      success: true,
      sugerencias: sugerenciasFinales,
      usuario: {
        nombre,
        clasificacion,
        treboles,
        runas: usuario?.runas || 0
      }
    });

  } catch (error) {
    console.error('[TITO/SUGERENCIAS] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: Obtener una sugerencia rápida
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const tipo = searchParams.get('tipo'); // bienvenida, producto, etc.

    if (!email) {
      return Response.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    const usuario = await kv.get(`user:${email}`) || await kv.get(`elegido:${email}`);
    const perfil = await kv.get(`perfil:${email}`);
    const nombre = perfil?.nombrePreferido || usuario?.nombre || 'amiga';
    const clasificacion = perfil?.clasificacion || 'bronce';

    let sugerencia;

    switch (tipo) {
      case 'bienvenida':
        const msg = MENSAJES.bienvenida[Math.floor(Math.random() * MENSAJES.bienvenida.length)];
        sugerencia = { tipo: 'bienvenida', mensaje: msg.replace('{nombre}', nombre) };
        break;

      case 'producto':
        const productos = PRODUCTOS_POR_NIVEL[clasificacion] || PRODUCTOS_POR_NIVEL.bronce;
        const prod = productos[Math.floor(Math.random() * productos.length)];
        sugerencia = {
          tipo: 'producto',
          mensaje: `Te puede interesar: ${prod.nombre}`,
          producto: prod
        };
        break;

      default:
        sugerencia = {
          tipo: 'general',
          mensaje: `¡Hola ${nombre}! ¿En qué te puedo ayudar hoy?`
        };
    }

    return Response.json({ success: true, sugerencia });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
