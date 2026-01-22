import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { getCierre } from '@/lib/conversion/cierres';

/**
 * SISTEMA DE EMAILS DE CARRITO ABANDONADO
 *
 * Envía secuencia de 3 emails personalizados según perfil psicológico.
 * Los emails se adaptan usando los cierres del sistema de conversión.
 */

// Plantillas de emails por timing
const generarEmails = (nombre, guardianNombre, guardianUrl, cierre) => {
  return {
    // Email 1: 1 hora - Informativo, sin presión
    email1: {
      delay: '1h',
      subject: 'Tu guardián sigue esperándote',
      body: `Hola ${nombre},

Pasaste un rato conociendo a ${guardianNombre} y después te fuiste.

No pasa nada. A veces necesitamos tiempo. A veces la vida interrumpe. A veces no es el momento.

${guardianNombre} sigue acá, en el mismo lugar donde lo dejaste. Sin apuro, sin presión.

Si querés volver a verlo: ${guardianUrl}

Un abrazo,
Duendes del Uruguay`
    },

    // Email 2: 24 horas - Con cierre adaptativo según perfil
    email2: {
      delay: '24h',
      subject: `${nombre}, ${guardianNombre} tiene algo que decirte`,
      body: `${nombre},

Ayer estuviste mirando a ${guardianNombre}.

Hay algo que necesito contarte sobre este guardián en particular:

${cierre}

Si algo de esto resuena, ${guardianNombre} sigue disponible: ${guardianUrl}

Con cariño,
Duendes del Uruguay`
    },

    // Email 3: 72 horas - Escasez social suave
    email3: {
      delay: '72h',
      subject: `Alguien más está mirando a ${guardianNombre}`,
      body: `${nombre},

Te escribo porque ${guardianNombre} tuvo varias visitas en estos días.

No te digo esto para presionarte. Te lo digo porque sé lo que se siente encontrar a tu guardián y después descubrir que ya encontró otro hogar.

Cada uno de nuestros guardianes es único. Literalmente irrepetible. Cuando se va, no vuelve.

Si ${guardianNombre} estaba resonando con vos, quizás sea momento de escuchar eso: ${guardianUrl}

Y si no era el tuyo, está perfecto también. A veces miramos varios antes de encontrar el indicado.

Un abrazo grande,
Duendes del Uruguay`
    }
  };
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, nombre, guardian_nombre, guardian_url, perfil: perfilRecibido } = body;

    // Validaciones básicas
    if (!email || !nombre || !guardian_nombre || !guardian_url) {
      return NextResponse.json(
        {
          success: false,
          error: 'Faltan campos requeridos: email, nombre, guardian_nombre, guardian_url'
        },
        { status: 400 }
      );
    }

    // Determinar perfil psicológico
    let perfilUsado = perfilRecibido;

    if (!perfilUsado) {
      // Buscar en Vercel KV
      try {
        const perfilGuardado = await kv.get(`perfil:${email}`);
        perfilUsado = perfilGuardado || 'vulnerable'; // Default si no hay nada
      } catch (kvError) {
        console.log('[carrito-abandonado] Error al buscar perfil en KV:', kvError.message);
        perfilUsado = 'vulnerable';
      }
    }

    // Validar que el perfil sea válido
    const perfilesValidos = ['vulnerable', 'esceptico', 'impulsivo', 'coleccionista', 'racional'];
    if (!perfilesValidos.includes(perfilUsado)) {
      perfilUsado = 'vulnerable';
    }

    // Obtener cierre adaptativo según perfil
    const cierreAdaptativo = getCierre(guardian_nombre, perfilUsado);

    // Generar los 3 emails
    const emails = generarEmails(nombre, guardian_nombre, guardian_url, cierreAdaptativo);

    // Por ahora simulamos con console.log (integración con Resend después)
    console.log('========================================');
    console.log('[CARRITO ABANDONADO] Nueva secuencia programada');
    console.log('========================================');
    console.log('Email:', email);
    console.log('Nombre:', nombre);
    console.log('Guardián:', guardian_nombre);
    console.log('URL:', guardian_url);
    console.log('Perfil usado:', perfilUsado);
    console.log('----------------------------------------');

    console.log('\n[EMAIL 1 - 1 HORA]');
    console.log('Subject:', emails.email1.subject);
    console.log('Body:', emails.email1.body);

    console.log('\n[EMAIL 2 - 24 HORAS]');
    console.log('Subject:', emails.email2.subject);
    console.log('Body:', emails.email2.body);

    console.log('\n[EMAIL 3 - 72 HORAS]');
    console.log('Subject:', emails.email3.subject);
    console.log('Body:', emails.email3.body);

    console.log('\n========================================');
    console.log('[CARRITO ABANDONADO] Secuencia lista para envío');
    console.log('========================================\n');

    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      perfil_usado: perfilUsado,
      emails_programados: 3,
      cierre_aplicado: cierreAdaptativo,
      // Incluir preview de los subjects para debugging
      preview: {
        email1_subject: emails.email1.subject,
        email2_subject: emails.email2.subject,
        email3_subject: emails.email3.subject
      }
    });

  } catch (error) {
    console.error('[carrito-abandonado] Error:', error);
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

// GET para health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/emails/carrito-abandonado',
    method: 'POST',
    descripcion: 'Sistema de emails de carrito abandonado con cierres adaptativos',
    perfiles_soportados: ['vulnerable', 'esceptico', 'impulsivo', 'coleccionista', 'racional'],
    secuencia: [
      { email: 1, delay: '1 hora', tipo: 'informativo' },
      { email: 2, delay: '24 horas', tipo: 'cierre adaptativo' },
      { email: 3, delay: '72 horas', tipo: 'escasez social' }
    ]
  });
}
