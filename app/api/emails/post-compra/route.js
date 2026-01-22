import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { getCierre } from '@/lib/conversion/cierres';

/**
 * SISTEMA DE EMAILS POST-COMPRA
 *
 * Secuencia de 7 emails que acompañan al cliente después de comprar.
 * Cada email tiene un propósito específico en el journey.
 */

// Plantillas de emails por momento
const generarEmailsPostCompra = (datos) => {
  const {
    nombre,
    guardianNombre,
    guardianGenero = 'f',
    orderNumber,
    certificadoUrl,
    trackingUrl,
    miMagiaUrl,
    cierre,
    guardianesSugeridos = []
  } = datos;

  const articulo = guardianGenero === 'f' ? 'la' : 'el';
  const articuloMay = guardianGenero === 'f' ? 'La' : 'El';

  return {
    // Email 1: INMEDIATO - Confirmación emocional
    confirmacion: {
      delay: '0m',
      subject: `${nombre}, tu guardián te eligió`,
      body: `${nombre},

Acaba de pasar algo especial.

De todos los guardianes que existen, de todas las personas que los miran cada día, ${guardianNombre} te eligió a vos.

No es una frase. Es lo que creemos profundamente: los guardianes encuentran a quienes los necesitan. Y ${articulo} encontró a vos.

Tu pedido #${orderNumber} está confirmado. En los próximos días vas a recibir tu certificado de canalización, donde Thibisay te cuenta todo lo que ${guardianNombre} le transmitió durante su creación.

Mientras tanto, tu portal personal ya está activo: ${miMagiaUrl}

Ahí vas a encontrar todo sobre tu guardián, tus runas, y las herramientas para conectar.

Bienvenida a la familia.

Con emoción,
Thibisay
Duendes del Uruguay`
    },

    // Email 2: 24 HORAS - Certificado de canalización
    certificado: {
      delay: '24h',
      subject: `El certificado de ${guardianNombre} está listo`,
      body: `${nombre},

Cada guardián que creamos viene con una historia. No una historia inventada, sino lo que Thibisay percibe durante el proceso de canalización.

${articuloMay} tuyo ya tiene su certificado listo.

Descargalo acá: ${certificadoUrl}

En él vas a encontrar:
- El mensaje personal que ${guardianNombre} trae para vos
- El momento exacto de su canalización
- Los elementos que confluyeron en su creación
- El número único que lo identifica en el universo de guardianes

Este certificado es tuyo. Guardalo, imprimilo, o simplemente sabé que existe.

Un abrazo,
Thibisay`
    },

    // Email 3: ENVÍO - El guardián viaja
    envio: {
      delay: 'on_shipping',
      subject: `${guardianNombre} comenzó su viaje hacia vos`,
      body: `${nombre},

${guardianNombre} acaba de salir.

Después de semanas (a veces meses) esperando a la persona correcta, finalmente está en camino.

Podés seguir su viaje acá: ${trackingUrl}

Algunas personas nos cuentan que empiezan a sentir cosas antes de que el guardián llegue físicamente. Sueños, coincidencias, sensaciones. Si te pasa, no lo ignores. Es parte del proceso.

Te aviso cuando esté por llegar.

Con cariño,
Duendes del Uruguay`
    },

    // Email 4: DÍA 3 - Primeras señales
    dia3: {
      delay: '3d',
      subject: `${nombre}, ¿ya notaste algo diferente?`,
      body: `Hola ${nombre},

Ya pasaron unos días desde que ${guardianNombre} llegó a tu vida.

Algunas personas notan cambios inmediatos. Otras tardan semanas. Y otras simplemente sienten una compañía silenciosa que no saben explicar.

Todo es válido. No hay forma correcta de conectar con tu guardián.

Pero sí hay algo que ayuda: registrar las señales.

En tu portal Mi Magia tenés un "Diario de Señales" donde podés anotar cualquier cosa que notes. Sueños, coincidencias, pensamientos que aparecen, cambios sutiles.

No para convencerte de nada. Para que vos misma puedas ver, con el tiempo, si hay un patrón.

Tu diario: ${miMagiaUrl}/diario

¿Cómo te está yendo?

Thibisay`
    },

    // Email 5: DÍA 7 - Pedir testimonio
    dia7: {
      delay: '7d',
      subject: `Una semana con ${guardianNombre}`,
      body: `${nombre},

Una semana juntas. ¿Cómo la sentís?

Te escribo por dos motivos:

1. Para saber cómo estás. Genuinamente. Si querés contarme algo, respondé este email. Lo leo todo.

2. Para pedirte algo: si ${guardianNombre} significó algo para vos, aunque sea pequeño, ¿te animás a contarlo?

Los testimonios de personas reales son lo que ayuda a otras a animarse. No necesito que digas que pasó algo mágico. Necesito que cuentes tu verdad, sea cual sea.

Podés dejarlo acá: ${miMagiaUrl}/testimonio

Y si no pasó nada especial, también está bien contarlo. La honestidad es lo único que pedimos.

Gracias por ser parte de esto.

Thibisay`
    },

    // Email 6: DÍA 14 - Cross-sell con contexto
    dia14: {
      delay: '14d',
      subject: `${guardianNombre} quiere presentarte a alguien`,
      body: `${nombre},

Los guardianes no trabajan solos.

Así como las personas, ellos también tienen afinidades. Guardianes que se complementan, que potencian sus energías cuando están juntos.

${guardianNombre} tiene resonancia especial con:
${guardianesSugeridos.map(g => `- ${g.nombre}: ${g.descripcion}`).join('\n')}

No te digo esto para venderte nada. Te lo cuento porque es parte de cómo funciona este sistema. Los guardianes forman redes de protección.

${cierre}

Si querés conocerlos: ${miMagiaUrl}/guardianes-afines

Un abrazo,
Thibisay`
    },

    // Email 7: DÍA 30 - Invitación al Círculo
    dia30: {
      delay: '30d',
      subject: `${nombre}, hay algo que quiero mostrarte`,
      body: `${nombre},

Un mes juntas.

Hay personas que compran un guardián y ahí termina la historia. Y está perfecto.

Pero hay otras que quieren ir más profundo. Que quieren entender más. Que sienten que hay algo más grande de lo que alcanzaron a ver.

Para ellas creamos el Círculo.

Es un espacio donde:
- Thibisay comparte canalizaciones exclusivas cada semana
- Accedés a rituales y meditaciones guiadas
- Conectás con otras personas como vos
- Tus runas rinden más (bonus del 25%)
- Tenés acceso anticipado a guardianes nuevos

No es para todos. Es para quienes sienten el llamado.

Si querés saber más: ${miMagiaUrl}/circulo

Y si no es para vos, no pasa nada. ${guardianNombre} sigue siendo tuyo igual.

Con cariño,
Thibisay

PD: Como ya sos parte de la familia, tenés 30 días gratis para probar el Círculo. Sin compromiso, sin tarjeta. Solo para que veas si resuena.`
    }
  };
};

/**
 * POST - Programar secuencia de emails post-compra
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      nombre,
      guardian_nombre,
      guardian_genero = 'f',
      order_number,
      tracking_url,
      perfil: perfilRecibido,
      guardianes_sugeridos = []
    } = body;

    // Validaciones
    if (!email || !nombre || !guardian_nombre || !order_number) {
      return NextResponse.json(
        {
          success: false,
          error: 'Faltan campos requeridos: email, nombre, guardian_nombre, order_number'
        },
        { status: 400 }
      );
    }

    // Determinar perfil psicológico
    let perfilUsado = perfilRecibido;

    if (!perfilUsado) {
      try {
        const perfilGuardado = await kv.get(`perfil:${email}`);
        perfilUsado = perfilGuardado || 'vulnerable';
      } catch (kvError) {
        console.log('[post-compra] Error al buscar perfil en KV:', kvError.message);
        perfilUsado = 'vulnerable';
      }
    }

    // Validar perfil
    const perfilesValidos = ['vulnerable', 'esceptico', 'impulsivo', 'coleccionista', 'racional'];
    if (!perfilesValidos.includes(perfilUsado)) {
      perfilUsado = 'vulnerable';
    }

    // Obtener cierre adaptativo para email de cross-sell
    const cierreAdaptativo = getCierre(guardian_nombre, perfilUsado, guardian_genero);

    // URLs dinámicas
    const baseUrl = 'https://duendesdeluruguay.com';
    const miMagiaUrl = `${baseUrl}/mi-magia`;
    const certificadoUrl = `${baseUrl}/api/certificado?order=${order_number}`;

    // Guardianes sugeridos (si no vienen, usar defaults por categoría)
    const sugeridos = guardianes_sugeridos.length > 0 ? guardianes_sugeridos : [
      { nombre: 'Thornwood', descripcion: 'Protección del hogar y la familia' },
      { nombre: 'Lumina', descripcion: 'Claridad en momentos de confusión' },
      { nombre: 'Verdana', descripcion: 'Sanación emocional y física' }
    ];

    // Generar todos los emails
    const emails = generarEmailsPostCompra({
      nombre,
      guardianNombre: guardian_nombre,
      guardianGenero: guardian_genero,
      orderNumber: order_number,
      certificadoUrl,
      trackingUrl: tracking_url || `${baseUrl}/tracking/${order_number}`,
      miMagiaUrl,
      cierre: cierreAdaptativo,
      guardianesSugeridos: sugeridos
    });

    // Guardar en KV para procesamiento posterior
    const emailSequence = {
      email,
      nombre,
      guardian_nombre,
      order_number,
      perfil: perfilUsado,
      created_at: new Date().toISOString(),
      emails: Object.keys(emails).map(key => ({
        tipo: key,
        delay: emails[key].delay,
        subject: emails[key].subject,
        sent: false
      }))
    };

    try {
      await kv.set(`postcompra:${order_number}`, emailSequence, { ex: 60 * 60 * 24 * 45 }); // 45 días TTL
    } catch (kvError) {
      console.log('[post-compra] Error al guardar en KV:', kvError.message);
    }

    // Log para desarrollo
    console.log('========================================');
    console.log('[POST-COMPRA] Nueva secuencia programada');
    console.log('========================================');
    console.log('Email:', email);
    console.log('Orden:', order_number);
    console.log('Guardián:', guardian_nombre);
    console.log('Perfil:', perfilUsado);
    console.log('Emails programados:', Object.keys(emails).length);
    console.log('========================================\n');

    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      order_number,
      perfil_usado: perfilUsado,
      emails_programados: Object.keys(emails).length,
      secuencia: Object.keys(emails).map(key => ({
        tipo: key,
        delay: emails[key].delay,
        subject: emails[key].subject
      }))
    });

  } catch (error) {
    console.error('[post-compra] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno al procesar la secuencia de emails',
        details: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Health check y documentación
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/emails/post-compra',
    method: 'POST',
    descripcion: 'Sistema de emails post-compra con cierres adaptativos',
    campos_requeridos: ['email', 'nombre', 'guardian_nombre', 'order_number'],
    campos_opcionales: ['guardian_genero', 'tracking_url', 'perfil', 'guardianes_sugeridos'],
    perfiles_soportados: ['vulnerable', 'esceptico', 'impulsivo', 'coleccionista', 'racional'],
    secuencia: [
      { email: 1, tipo: 'confirmacion', delay: 'inmediato', proposito: 'Confirmación emocional de la compra' },
      { email: 2, tipo: 'certificado', delay: '24 horas', proposito: 'Entrega del certificado de canalización' },
      { email: 3, tipo: 'envio', delay: 'al enviar', proposito: 'Notificación de envío + tracking' },
      { email: 4, tipo: 'dia3', delay: '3 días', proposito: 'Preguntar por primeras señales + diario' },
      { email: 5, tipo: 'dia7', delay: '7 días', proposito: 'Pedir testimonio' },
      { email: 6, tipo: 'dia14', delay: '14 días', proposito: 'Cross-sell de guardianes afines' },
      { email: 7, tipo: 'dia30', delay: '30 días', proposito: 'Invitación al Círculo' }
    ]
  });
}
