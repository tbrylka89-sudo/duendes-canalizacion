import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: SECUENCIA DE MICRO-COMPROMISOS
// Emails que guían al usuario desde el Test del Guardián hasta la conversión
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

// Pasos del funnel de micro-compromisos
const PASOS = {
  test_completado: 1,
  email_suscrito: 2,
  preview_visto: 3,
  trial_activo: 4,
  membresia_activa: 5
};

// Plantillas de emails por paso del funnel
const SECUENCIAS = {
  // ═══════════════════════════════════════════════════════════════════════════════
  // PASO 1 → 2: Después del Test del Guardián
  // Objetivo: Conseguir que se suscriba a emails
  // ═══════════════════════════════════════════════════════════════════════════════
  test_completado: {
    emails: [
      {
        id: 'test_1h',
        delay: '1h',
        subject: '{nombre}, tu guardián tiene algo que decirte',
        bodyFn: (datos) => `${datos.nombre},

Hiciste el Test del Guardián y ${datos.guardianMatch || 'un guardián especial'} apareció para vos.

Pero hay algo que no te contamos en el test: cada guardián tiene mensajes específicos que solo revela a quienes están listos para escuchar.

No son mensajes genéricos. Son canalizaciones basadas en las respuestas que diste, en el momento que estás atravesando, en lo que dijiste que te pesa.

Si querés recibir estas canalizaciones (son gratis, una por semana), avisanos:

${datos.linkSuscripcion}

No tenés que comprar nada. Solo escuchar lo que tu guardián tiene para decirte.

Con cariño,
Duendes del Uruguay`
      },
      {
        id: 'test_24h',
        delay: '24h',
        subject: 'Lo que no te contamos sobre tu resultado',
        bodyFn: (datos) => `${datos.nombre},

Ayer te cruzaste con ${datos.guardianMatch || 'un guardián que resonó con vos'}.

Lo que quizás no sabés es que los guardianes no aparecen al azar. Cada uno tiene afinidad con ciertos tipos de dolor, de búsqueda, de momento vital.

El tuyo apareció porque detectamos algo en tus respuestas. No te vamos a decir qué (no queremos que lo racionalices). Pero sí queremos que sepas que hay una razón.

Si querés explorar esa razón, empezá por acá:

${datos.linkSuscripcion}

Es solo un email semanal con contenido del Círculo. Sin compromiso, sin spam, sin venta agresiva.

Solo... conexión.

${datos.cierreAdaptado}`
      },
      {
        id: 'test_72h',
        delay: '72h',
        subject: 'Última vez que te escribimos sobre esto',
        bodyFn: (datos) => `${datos.nombre},

Este es el último email sobre el test.

No vamos a insistir más. Si sentís que no es para vos, perfecto. Cada uno sabe lo que necesita.

Pero antes de irme, quiero dejarte algo: el mensaje que ${datos.guardianMatch || 'tu guardián'} dejó para quienes llegan hasta acá pero dudan.

"El miedo a creer no te protege de nada. Solo te mantiene lejos de lo que podría ayudarte."

Si en algún momento cambiás de opinión: ${datos.linkSuscripcion}

Con cariño,
Duendes del Uruguay`
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // PASO 2 → 3: Después de suscribirse
  // Objetivo: Que vea contenido preview del Círculo
  // ═══════════════════════════════════════════════════════════════════════════════
  email_suscrito: {
    emails: [
      {
        id: 'suscrito_bienvenida',
        delay: '0m',
        subject: 'Bienvenida a los mensajes del Círculo',
        bodyFn: (datos) => `${datos.nombre},

Llegaste.

A partir de ahora vas a recibir un mensaje semanal del guardián que esté activo en el Círculo. Cada semana es uno diferente, con su propia voz, sus propias enseñanzas.

No son emails de marketing. Son canalizaciones reales que compartimos con la comunidad.

El próximo llega el lunes. Mientras tanto, te dejamos algo especial: un adelanto de lo que los miembros del Círculo reciben cada semana.

${datos.linkPreview}

No es el contenido completo (eso es exclusivo para miembros), pero te va a dar una idea de lo que estamos creando.

Bienvenida.

Con cariño,
Duendes del Uruguay`
      },
      {
        id: 'suscrito_dia3',
        delay: '3d',
        subject: 'El guardián de esta semana tiene algo para vos',
        bodyFn: (datos) => `${datos.nombre},

${datos.duendeSemana?.nombre || 'El guardián de la semana'} está activo en el Círculo.

${datos.duendeSemana?.mensaje || 'Cada guardián trae un mensaje diferente, una energía única.'}

Los miembros del Círculo ya recibieron su canalización completa. Vos, por ahora, recibís la versión resumida.

Pero hay algo que sí podés ver: el ritual de conexión que preparamos para esta semana.

${datos.linkPreview}

Si resuena, genial. Si no, seguimos hablando el lunes que viene.

${datos.cierreAdaptado}`
      },
      {
        id: 'suscrito_dia7',
        delay: '7d',
        subject: '¿Cómo te está yendo con los mensajes?',
        bodyFn: (datos) => `${datos.nombre},

Una semana recibiendo mensajes del Círculo.

¿Notaste algo? ¿Algún mensaje que llegó en el momento justo? ¿Alguna coincidencia?

Los miembros del Círculo suelen contar que las sincronicidades aumentan cuando empiezan a prestar atención. No porque pase nada mágico, sino porque empiezan a ver lo que siempre estuvo ahí.

Si querés ir más profundo, hay una forma: el Círculo completo.

15 días gratis, sin tarjeta, sin compromiso. Solo para que pruebes si es para vos.

${datos.linkTrial}

Y si no es el momento, seguimos acá. Los mensajes siguen llegando igual.

Con cariño,
Duendes del Uruguay`
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // PASO 3 → 4: Después de ver preview
  // Objetivo: Que active el trial de 15 días
  // ═══════════════════════════════════════════════════════════════════════════════
  preview_visto: {
    emails: [
      {
        id: 'preview_1h',
        delay: '1h',
        subject: 'Lo que viste es solo la superficie',
        bodyFn: (datos) => `${datos.nombre},

Viste el preview. Ahora sabés de qué se trata.

Pero hay algo que no pudiste ver: las canalizaciones completas, los rituales guiados, la comunidad, las runas, el acceso anticipado a guardianes nuevos.

No te lo contamos para venderte nada. Te lo contamos para que sepas qué hay detrás de la puerta.

Si querés ver todo, tenés 15 días gratis para probarlo:

${datos.linkTrial}

Sin tarjeta. Sin compromiso. Solo explorar.

${datos.cierreAdaptado}`
      },
      {
        id: 'preview_48h',
        delay: '48h',
        subject: 'Lo que los miembros del Círculo recibieron esta semana',
        bodyFn: (datos) => `${datos.nombre},

Esta semana los miembros del Círculo recibieron:

- Canalización completa de ${datos.duendeSemana?.nombre || 'el guardián de la semana'}
- Ritual de ${datos.duendeSemana?.ritual || 'conexión'} paso a paso
- Meditación guiada de 12 minutos
- Acceso al foro privado donde comparten experiencias

Vos recibiste el resumen de una página.

No está mal. Pero si querés más, la puerta está abierta:

${datos.linkTrial}

15 días para decidir si es para vos.

Con cariño,
Duendes del Uruguay`
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // PASO 4 → 5: Durante el trial
  // Objetivo: Convertir a membresía paga
  // ═══════════════════════════════════════════════════════════════════════════════
  trial_activo: {
    emails: [
      {
        id: 'trial_dia1',
        delay: '24h',
        subject: 'Tu primer día en el Círculo',
        bodyFn: (datos) => `${datos.nombre},

Bienvenida al Círculo.

Tu trial de 15 días empezó. No hay apuro. No hay presión. Solo explorar.

Te recomiendo que empieces por acá:

1. Conocé al guardián de la semana: ${datos.linkDuendeSemana}
2. Leé tu canalización personalizada: ${datos.linkCanalizacion}
3. Explorá el calendario de contenido: ${datos.linkCalendario}

Y si tenés preguntas, escribinos. Leemos todo.

Con cariño,
Duendes del Uruguay`
      },
      {
        id: 'trial_dia7',
        delay: '7d',
        subject: 'Mitad del camino',
        bodyFn: (datos) => `${datos.nombre},

Una semana en el Círculo.

¿Cómo te está yendo? ¿Encontraste algo que resuene?

Quedan 8 días de trial. No para presionarte, sino para que sepas cuánto tiempo tenés para explorar.

Si ya sabés que querés quedarte: ${datos.linkConvertir}

Si todavía estás viendo, perfecto. Seguí explorando.

¿Hay algo que te gustaría ver que no encontraste?

Con cariño,
Duendes del Uruguay`
      },
      {
        id: 'trial_dia12',
        delay: '12d',
        subject: '3 días para decidir',
        bodyFn: (datos) => `${datos.nombre},

Tu trial termina en 3 días.

No te vamos a decir "apurate" o "últimas horas". Simplemente te avisamos para que no te agarre de sorpresa.

Si querés quedarte en el Círculo, las opciones son:

- Mensual: $${datos.precioMensual || '7'} USD/mes
- Anual: $${datos.precioAnual || '60'} USD/año (ahorrás 3 meses)

${datos.linkConvertir}

Si decidís no quedarte, no pasa nada. Seguís recibiendo los emails semanales gratis. Solo que no tendrás acceso al contenido completo.

La decisión es tuya. Sin presiones.

Con cariño,
Duendes del Uruguay`
      },
      {
        id: 'trial_ultimo',
        delay: '14d',
        subject: 'Último día de trial',
        bodyFn: (datos) => `${datos.nombre},

Mañana termina tu acceso completo al Círculo.

Si fue útil, si encontraste algo, si querés seguir: ${datos.linkConvertir}

Si no fue para vos, gracias por haber probado. Seguís siendo bienvenida a los emails semanales.

No hay rencores. Solo puertas abiertas.

${datos.cierreAdaptado}`
      }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST - Iniciar o avanzar secuencia de micro-compromisos
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const { accion, email, nombre, paso, datos = {} } = body;

    // Validaciones
    if (!email) {
      return Response.json({
        success: false,
        error: 'Se requiere email'
      }, { status: 400 });
    }

    switch (accion) {
      // ─────────────────────────────────────────────────────────────────────────
      // INICIAR: Comenzar secuencia después del test
      // ─────────────────────────────────────────────────────────────────────────
      case 'iniciar': {
        const secuencia = await kv.get(`micro:${email}`) || {
          email,
          nombre: nombre || 'amiga',
          paso_actual: 1,
          paso_nombre: 'test_completado',
          creado: new Date().toISOString(),
          emails_enviados: [],
          perfil: datos.perfil || 'vulnerable',
          guardian_match: datos.guardianMatch || null,
          convertido: false
        };

        // Marcar que completó el test
        secuencia.test_completado = new Date().toISOString();
        secuencia.datos_test = datos;

        await kv.set(`micro:${email}`, secuencia, { ex: 60 * 60 * 24 * 90 }); // 90 días TTL

        // Programar primer email de la secuencia
        const primeraSecuencia = SECUENCIAS.test_completado;
        const primerEmail = primeraSecuencia.emails[0];

        // Guardar en cola de emails
        await encolarEmail(email, 'test_completado', primerEmail.id, primerEmail.delay);

        return Response.json({
          success: true,
          mensaje: 'Secuencia de micro-compromisos iniciada',
          paso_actual: 1,
          emails_programados: primeraSecuencia.emails.length
        });
      }

      // ─────────────────────────────────────────────────────────────────────────
      // AVANZAR: Mover al siguiente paso del funnel
      // ─────────────────────────────────────────────────────────────────────────
      case 'avanzar': {
        const secuencia = await kv.get(`micro:${email}`);

        if (!secuencia) {
          return Response.json({
            success: false,
            error: 'No existe secuencia para este email'
          }, { status: 404 });
        }

        const pasoNuevo = paso || (secuencia.paso_actual + 1);

        if (pasoNuevo > 5) {
          // Ya completó todo el funnel
          secuencia.convertido = true;
          secuencia.convertido_en = new Date().toISOString();
          await kv.set(`micro:${email}`, secuencia);

          return Response.json({
            success: true,
            mensaje: 'Usuario convertido - funnel completado',
            paso_actual: 5,
            convertido: true
          });
        }

        // Mapear paso a nombre
        const pasosNombres = ['', 'test_completado', 'email_suscrito', 'preview_visto', 'trial_activo', 'membresia_activa'];
        const pasoNombre = pasosNombres[pasoNuevo];

        secuencia.paso_actual = pasoNuevo;
        secuencia.paso_nombre = pasoNombre;
        secuencia[`paso_${pasoNuevo}_en`] = new Date().toISOString();

        await kv.set(`micro:${email}`, secuencia);

        // Programar emails del nuevo paso
        const nuevaSecuencia = SECUENCIAS[pasoNombre];
        if (nuevaSecuencia) {
          for (const emailConfig of nuevaSecuencia.emails) {
            await encolarEmail(email, pasoNombre, emailConfig.id, emailConfig.delay);
          }
        }

        return Response.json({
          success: true,
          mensaje: `Avanzado a paso ${pasoNuevo}: ${pasoNombre}`,
          paso_actual: pasoNuevo,
          emails_programados: nuevaSecuencia?.emails.length || 0
        });
      }

      // ─────────────────────────────────────────────────────────────────────────
      // ESTADO: Obtener estado actual del usuario en el funnel
      // ─────────────────────────────────────────────────────────────────────────
      case 'estado': {
        const secuencia = await kv.get(`micro:${email}`);

        if (!secuencia) {
          return Response.json({
            success: true,
            existe: false,
            mensaje: 'No existe secuencia para este email'
          });
        }

        return Response.json({
          success: true,
          existe: true,
          ...secuencia
        });
      }

      // ─────────────────────────────────────────────────────────────────────────
      // GENERAR-EMAIL: Generar contenido de un email específico
      // ─────────────────────────────────────────────────────────────────────────
      case 'generar-email': {
        const { paso_nombre, email_id } = datos;

        const secuencia = await kv.get(`micro:${email}`);
        const secuenciaConfig = SECUENCIAS[paso_nombre];

        if (!secuenciaConfig) {
          return Response.json({
            success: false,
            error: 'Paso no encontrado'
          }, { status: 404 });
        }

        const emailConfig = secuenciaConfig.emails.find(e => e.id === email_id);
        if (!emailConfig) {
          return Response.json({
            success: false,
            error: 'Email no encontrado'
          }, { status: 404 });
        }

        // Obtener datos para el email
        const duendeSemana = await kv.get('duende-semana:actual');

        const datosEmail = {
          nombre: secuencia?.nombre || nombre || 'amiga',
          guardianMatch: secuencia?.guardian_match || datos.guardianMatch,
          duendeSemana: duendeSemana ? {
            nombre: duendeSemana.nombre,
            mensaje: duendeSemana.personalidadGenerada?.frase_caracteristica,
            ritual: duendeSemana.proposito
          } : null,
          cierreAdaptado: obtenerCierreAdaptado(secuencia?.perfil || 'vulnerable'),
          linkSuscripcion: 'https://duendesdeluruguay.com/circulo?utm_source=micro&utm_medium=email&accion=suscribir',
          linkPreview: 'https://duendesdeluruguay.com/circulo/preview?utm_source=micro&utm_medium=email',
          linkTrial: 'https://duendesdeluruguay.com/circulo/trial?utm_source=micro&utm_medium=email',
          linkConvertir: 'https://duendesdeluruguay.com/circulo/unirse?utm_source=micro&utm_medium=email',
          linkDuendeSemana: 'https://duendesdeluruguay.com/mi-magia/circulo',
          linkCanalizacion: 'https://duendesdeluruguay.com/mi-magia/canalizacion',
          linkCalendario: 'https://duendesdeluruguay.com/mi-magia/calendario',
          precioMensual: '7',
          precioAnual: '60'
        };

        const body = emailConfig.bodyFn(datosEmail);
        const subject = emailConfig.subject.replace('{nombre}', datosEmail.nombre);

        return Response.json({
          success: true,
          email: {
            id: emailConfig.id,
            subject,
            body,
            delay: emailConfig.delay
          }
        });
      }

      default:
        return Response.json({
          success: false,
          error: 'Acción no reconocida'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('[MICRO-COMPROMISOS] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET - Documentación y estadísticas
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  const url = new URL(request.url);
  const stats = url.searchParams.get('stats') === '1';

  if (stats) {
    // Obtener estadísticas del funnel
    try {
      const keys = await kv.keys('micro:*');
      const estadisticas = {
        total_usuarios: keys.length,
        por_paso: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        },
        convertidos: 0
      };

      // Limitar a 100 para performance
      for (const key of keys.slice(0, 100)) {
        try {
          const data = await kv.get(key);
          if (data) {
            estadisticas.por_paso[data.paso_actual] = (estadisticas.por_paso[data.paso_actual] || 0) + 1;
            if (data.convertido) estadisticas.convertidos++;
          }
        } catch (e) {
          // Ignorar errores individuales
        }
      }

      return Response.json({
        success: true,
        estadisticas,
        muestreados: Math.min(keys.length, 100)
      });
    } catch (error) {
      return Response.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }
  }

  return Response.json({
    status: 'ok',
    endpoint: '/api/emails/micro-compromisos',
    descripcion: 'Sistema de emails de micro-compromisos para conversión gradual',
    funnel: [
      { paso: 1, nombre: 'test_completado', objetivo: 'Suscribirse a emails', emails: 3 },
      { paso: 2, nombre: 'email_suscrito', objetivo: 'Ver preview del contenido', emails: 3 },
      { paso: 3, nombre: 'preview_visto', objetivo: 'Activar trial de 15 días', emails: 2 },
      { paso: 4, nombre: 'trial_activo', objetivo: 'Convertir a membresía paga', emails: 4 },
      { paso: 5, nombre: 'membresia_activa', objetivo: 'Retención', emails: 0 }
    ],
    acciones: {
      iniciar: 'POST { accion: "iniciar", email, nombre, datos: { perfil, guardianMatch } }',
      avanzar: 'POST { accion: "avanzar", email, paso }',
      estado: 'POST { accion: "estado", email }',
      'generar-email': 'POST { accion: "generar-email", email, datos: { paso_nombre, email_id } }'
    },
    estadisticas: 'GET ?stats=1'
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════

async function encolarEmail(email, paso, emailId, delay) {
  const cola = await kv.get('cola:emails:micro') || [];

  // Calcular fecha de envío según delay
  const ahora = new Date();
  let fechaEnvio = ahora;

  if (delay.endsWith('m')) {
    fechaEnvio = new Date(ahora.getTime() + parseInt(delay) * 60 * 1000);
  } else if (delay.endsWith('h')) {
    fechaEnvio = new Date(ahora.getTime() + parseInt(delay) * 60 * 60 * 1000);
  } else if (delay.endsWith('d')) {
    fechaEnvio = new Date(ahora.getTime() + parseInt(delay) * 24 * 60 * 60 * 1000);
  }

  cola.push({
    email,
    paso,
    emailId,
    programadoPara: fechaEnvio.toISOString(),
    creado: ahora.toISOString(),
    enviado: false
  });

  await kv.set('cola:emails:micro', cola);
}

function obtenerCierreAdaptado(perfil) {
  const cierres = {
    vulnerable: 'Si algo de esto te tocó, escuchalo. No tenés que hacer nada más que estar abierta.',
    esceptico: 'No te pido que creas. Solo que pruebes.',
    impulsivo: 'La decisión ya la tomaste. Solo falta el click.',
    racional: 'Los números están claros. El valor es evidente. La decisión es tuya.',
    coleccionista: 'Vos ya sabés lo que esto significa. Bienvenida de vuelta.'
  };

  return cierres[perfil] || cierres.vulnerable;
}
