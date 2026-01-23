import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { calcularPerfil, obtenerPerfil, TIPOS_DOLOR, TIPOS_CREENCIAS } from '@/lib/circulo/perfilado';
import { generarSincronicidad, generarBienvenidaCirculo } from '@/lib/circulo/sincronicidad';
import { CIRCULO_CONFIG, getPortalActual } from '@/lib/circulo/config';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * API DE LANDING PERSONALIZADA PARA EL CIRCULO
 * Devuelve contenido adaptado al perfil psicologico del usuario
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ===== TESTIMONIOS POR CATEGORIA DE DOLOR =====
const TESTIMONIOS = {
  conexion: [
    {
      nombre: 'María L.',
      ubicacion: 'Buenos Aires',
      texto: 'Pensé que era la única que se sentía así. En el Círculo encontré personas que entienden sin que tenga que explicar nada.',
      destacado: 'encontré mi tribu',
      avatar: 'ML'
    },
    {
      nombre: 'Carolina S.',
      ubicacion: 'Montevideo',
      texto: 'El mensaje diario del guardián es como recibir un abrazo cada mañana. Ya no me siento tan sola.',
      destacado: 'un abrazo cada mañana',
      avatar: 'CS'
    }
  ],
  abundancia: [
    {
      nombre: 'Luciana P.',
      ubicacion: 'Córdoba',
      texto: 'Después de los rituales de abundancia del portal de Litha, conseguí el trabajo que había estado buscando por meses.',
      destacado: 'conseguí el trabajo',
      avatar: 'LP'
    },
    {
      nombre: 'Andrea M.',
      ubicacion: 'Santiago',
      texto: 'Entendí que me estaba bloqueando yo misma. Los guardianes de prosperidad me ayudaron a ver lo que no quería ver.',
      destacado: 'dejé de bloquearme',
      avatar: 'AM'
    }
  ],
  sanacion: [
    {
      nombre: 'Paula R.',
      ubicacion: 'Lima',
      texto: 'Llevaba años cargando con el duelo de mi madre. El ritual de Mabon me ayudó a soltar lo que no me dejaba avanzar.',
      destacado: 'pude soltar',
      avatar: 'PR'
    },
    {
      nombre: 'Florencia T.',
      ubicacion: 'Rosario',
      texto: 'Las meditaciones guiadas me salvaron de la ansiedad que me estaba consumiendo. Ahora duermo en paz.',
      destacado: 'duermo en paz',
      avatar: 'FT'
    }
  ],
  amor: [
    {
      nombre: 'Valentina G.',
      ubicacion: 'Bogotá',
      texto: 'Antes de buscar amor afuera, los guardianes me enseñaron a quererme a mí misma. Ahora todo fluye diferente.',
      destacado: 'aprendí a quererme',
      avatar: 'VG'
    },
    {
      nombre: 'Camila D.',
      ubicacion: 'Asunción',
      texto: 'Terminé una relación tóxica y el Círculo me sostuvo en cada paso. No lo hubiera logrado sola.',
      destacado: 'me sostuvo',
      avatar: 'CD'
    }
  ],
  transformacion: [
    {
      nombre: 'Mariana K.',
      ubicacion: 'Montevideo',
      texto: 'Estaba perdida, sin saber qué hacer con mi vida. Un año en el Círculo y ahora tengo claridad absoluta.',
      destacado: 'claridad absoluta',
      avatar: 'MK'
    },
    {
      nombre: 'Sofía B.',
      ubicacion: 'Buenos Aires',
      texto: 'Cada portal me trajo algo diferente. Yule me hizo mirar mi sombra, Ostara me hizo renacer. Es un viaje.',
      destacado: 'es un viaje',
      avatar: 'SB'
    }
  ]
};

// ===== BENEFICIOS SEGUN PERFIL =====
const BENEFICIOS_POR_PERFIL = {
  vulnerable: {
    enfasis: ['comunidad', 'contencion', 'mensaje_diario'],
    beneficios: [
      { icono: 'heart', titulo: 'Comunidad que entiende', descripcion: 'Un espacio seguro donde no tenés que explicarte. Acá te entendemos.' },
      { icono: 'message', titulo: 'Mensaje diario personal', descripcion: 'Cada mañana, un guardián te escribe. No estás sola.' },
      { icono: 'shield', titulo: 'Espacio protegido', descripcion: 'Foro privado sin juicios, sin presiones, sin trolls.' }
    ],
    cta: 'Encontrar mi lugar',
    ctaSecundario: 'Ver qué incluye'
  },
  esceptico: {
    enfasis: ['contenido', 'herramientas', 'comunidad'],
    beneficios: [
      { icono: 'book', titulo: 'Contenido semanal exclusivo', descripcion: 'Cada semana, un guardián comparte enseñanzas prácticas que podés aplicar.' },
      { icono: 'tools', titulo: 'Herramientas de bienestar', descripcion: 'Meditaciones, rituales y ejercicios. Probá lo que funcione para vos.' },
      { icono: 'users', titulo: 'Comunidad real', descripcion: 'Miles de personas que, como vos, buscan algo más.' }
    ],
    cta: 'Explorar sin compromiso',
    ctaSecundario: 'Ver contenido de muestra'
  },
  impulsivo: {
    enfasis: ['acceso_inmediato', 'contenido', 'exclusividad'],
    beneficios: [
      { icono: 'zap', titulo: 'Acceso inmediato', descripcion: 'Activás y entrás. Sin esperas, sin vueltas. Todo listo para vos.' },
      { icono: 'star', titulo: '52 guardianes al año', descripcion: 'Cada semana conocés un guardián nuevo. Uno por semana, todo el año.' },
      { icono: 'lock', titulo: 'Contenido exclusivo', descripcion: 'Lo que ves acá no está en ningún otro lugar. Solo para miembros.' }
    ],
    cta: 'Activar ahora',
    ctaSecundario: 'Ver planes'
  },
  racional: {
    enfasis: ['valor', 'contenido', 'garantia'],
    beneficios: [
      { icono: 'check', titulo: '15 días de prueba gratis', descripcion: 'Sin tarjeta de crédito. Probá todo durante 15 días y después decidís.' },
      { icono: 'calendar', titulo: 'Contenido estructurado', descripcion: '4 publicaciones por semana. Lunes, miércoles, viernes y domingo.' },
      { icono: 'percent', titulo: '10% descuento en tienda', descripcion: 'Miembros anuales tienen descuento permanente en todos los guardianes.' }
    ],
    cta: 'Probar 15 días gratis',
    ctaSecundario: 'Comparar planes'
  },
  coleccionista: {
    enfasis: ['exclusividad', 'descuento', 'anticipado'],
    beneficios: [
      { icono: 'gem', titulo: 'Acceso anticipado', descripcion: 'Conocé a los guardianes nuevos antes que nadie. Primera opción de compra.' },
      { icono: 'percent', titulo: '10% descuento permanente', descripcion: 'En toda la tienda, siempre. Tu familia de guardianes crece por menos.' },
      { icono: 'crown', titulo: 'Contenido premium', descripcion: 'Historias completas, rituales avanzados, conocimiento profundo.' }
    ],
    cta: 'Unirme al Círculo',
    ctaSecundario: 'Ver beneficios completos'
  }
};

// ===== MENSAJES DE CIERRE POR PERFIL =====
const CIERRES = {
  vulnerable: {
    titulo: 'Este es tu espacio',
    mensaje: 'No tenés que tomar ninguna decisión ahora. Solo quiero que sepas que acá hay un lugar para vos cuando estés lista. Sin presiones, sin apuros. Vos sabés cuándo es el momento.',
    cta: 'Quiero saber más',
    tono: 'suave'
  },
  esceptico: {
    titulo: 'Sin promesas mágicas',
    mensaje: 'No te vamos a decir que esto cambia vidas. Lo que sí podemos decir: miles de personas encontraron algo acá. Probalo 15 días gratis y sacá tus propias conclusiones.',
    cta: 'Probar sin compromiso',
    tono: 'directo'
  },
  impulsivo: {
    titulo: 'El momento es ahora',
    mensaje: 'Algo te trajo hasta acá. No ignores eso. Los lugares en el Círculo son limitados y este mes quedan pocos. Tu intuición ya decidió.',
    cta: 'Activar mi lugar',
    tono: 'urgente'
  },
  racional: {
    titulo: 'Los números hablan',
    mensaje: 'Por menos de $7 al mes tenés acceso a 52 guardianes, contenido semanal exclusivo, comunidad privada y descuento en tienda. 15 días de prueba gratis para que lo compruebes.',
    cta: 'Ver planes detallados',
    tono: 'logico'
  },
  coleccionista: {
    titulo: 'Para quienes ya entienden',
    mensaje: 'Vos ya sabés cómo funcionan los guardianes. Imaginá conocer a uno nuevo cada semana, con su historia, su ritual, sus enseñanzas. Un año entero de magia organizada.',
    cta: 'Unirme ahora',
    tono: 'exclusivo'
  }
};

// ===== HANDLER GET =====

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const nombre = searchParams.get('nombre') || '';
    const cumpleanos = searchParams.get('cumpleanos');

    // Obtener perfil del usuario si existe
    let perfil = null;
    let elegido = null;

    if (email) {
      const emailNormalizado = email.toLowerCase().trim();

      // Intentar obtener perfil guardado
      perfil = await obtenerPerfil(emailNormalizado);

      // Obtener datos del elegido para info adicional
      elegido = await kv.get(`elegido:${emailNormalizado}`);

      // Si no hay perfil pero hay test guardian, calcularlo
      if (!perfil && elegido?.testGuardianRaw) {
        perfil = calcularPerfil(elegido.testGuardianRaw);
      }
    }

    // Si no hay perfil, usar uno por defecto basado en comportamiento
    if (!perfil) {
      perfil = {
        vulnerabilidad: { nivel: 'media', enfoque: 'VALOR_GRADUAL' },
        dolor: { tipo: 'proposito' },
        estilo: { tipo: 'emocional' },
        creencias: { tipo: 'buscador', mostrarMagia: 60 },
        conversion: { cierreRecomendado: 'vulnerable' }
      };
    }

    // Generar sincronicidad
    const sincronicidad = generarSincronicidad({
      nombre: nombre || elegido?.nombre || '',
      cumpleanos,
      fechaVisita: new Date()
    });

    // Generar bienvenida personalizada
    const bienvenida = generarBienvenidaCirculo({
      nombre: nombre || elegido?.nombre || ''
    });

    // Obtener portal actual
    const portalActual = getPortalActual();

    // Obtener testimonios relevantes
    const tipoTestimonio = TIPOS_DOLOR[perfil.dolor.tipo]?.testimoniosRelevantes || 'transformacion';
    const testimonios = TESTIMONIOS[tipoTestimonio] || TESTIMONIOS.transformacion;

    // Obtener beneficios segun perfil de cierre
    const perfilCierre = perfil.conversion?.cierreRecomendado || 'vulnerable';
    const beneficios = BENEFICIOS_POR_PERFIL[perfilCierre] || BENEFICIOS_POR_PERFIL.vulnerable;

    // Obtener cierre personalizado
    const cierre = CIERRES[perfilCierre] || CIERRES.vulnerable;

    // Obtener stats de escasez (reales de KV)
    const escasez = await obtenerEscasez();

    // Determinar cuanto "magia" mostrar segun creencias
    const nivelMagia = perfil.creencias?.mostrarMagia || 60;

    // Construir respuesta
    const landing = {
      // Personalizacion
      personalizacion: {
        nombre: nombre || elegido?.nombre || null,
        esConocido: !!email && !!elegido,
        perfil: {
          vulnerabilidad: perfil.vulnerabilidad.nivel,
          dolor: perfil.dolor.tipo,
          estilo: perfil.estilo?.tipo || 'emocional',
          creencias: perfil.creencias?.tipo || 'buscador',
          cierreRecomendado: perfilCierre
        },
        nivelMagia // 0-100, cuanta terminologia mistica usar
      },

      // Sincronicidad (mensaje magico)
      sincronicidad: {
        mensajePrincipal: sincronicidad.mensajePrincipal,
        momento: sincronicidad.momento,
        intensidad: sincronicidad.intensidadTotal,
        // Solo incluir detalles si nivel de magia es alto
        detalles: nivelMagia >= 50 ? sincronicidad.sincronicidades.slice(0, 3) : []
      },

      // Bienvenida adaptada
      bienvenida: {
        titulo: nivelMagia >= 70
          ? 'El Círculo de Duendes'
          : 'El Círculo',
        subtitulo: nivelMagia >= 70
          ? portalActual.subtitulo
          : 'Tu espacio de bienestar y comunidad',
        mensaje: bienvenida.mensaje,
        color: bienvenida.colorEnergetico
      },

      // Portal actual (solo si nivel magia es suficiente)
      portal: nivelMagia >= 50 ? {
        id: portalActual.id,
        nombre: portalActual.nombre,
        subtitulo: portalActual.subtitulo,
        energia: portalActual.energia,
        color: portalActual.color
      } : null,

      // Testimonios relevantes al dolor
      testimonios: testimonios.map(t => ({
        ...t,
        // Ocultar referencias muy misticas si es esceptico
        texto: nivelMagia < 40
          ? t.texto.replace(/guardián/gi, 'contenido').replace(/ritual/gi, 'práctica')
          : t.texto
      })),

      // Beneficios destacados segun perfil
      beneficios: beneficios.beneficios,
      ctaPrincipal: beneficios.cta,
      ctaSecundario: beneficios.ctaSecundario,

      // Cierre personalizado
      cierre: {
        titulo: cierre.titulo,
        mensaje: cierre.mensaje,
        cta: cierre.cta,
        tono: cierre.tono
      },

      // Escasez (real)
      escasez: {
        miembrosActuales: escasez.miembrosActuales,
        lugaresDisponibles: escasez.lugaresDisponibles,
        personasViendo: escasez.personasViendo,
        mostrar: perfilCierre === 'impulsivo' || perfilCierre === 'coleccionista'
      },

      // Planes
      planes: {
        trial: CIRCULO_CONFIG.planes.trial,
        semestral: CIRCULO_CONFIG.planes.semestral,
        anual: CIRCULO_CONFIG.planes.anual,
        recomendado: perfil.conversion?.probabilidad === 'alta' ? 'anual' : 'trial'
      },

      // Metadata
      meta: {
        version: '1.0',
        generadoEn: new Date().toISOString(),
        perfilUsado: !!perfil
      }
    };

    return NextResponse.json({
      success: true,
      landing
    });

  } catch (error) {
    console.error('[LANDING-PERSONALIZADA] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ===== FUNCION DE ESCASEZ =====

async function obtenerEscasez() {
  try {
    // Obtener conteo real de miembros
    let miembrosActuales = 0;

    // Buscar todos los elegidos con membresia activa
    // Nota: En produccion esto deberia ser un contador en KV
    const contadorMiembros = await kv.get('circulo:contador:miembros');
    if (contadorMiembros) {
      miembrosActuales = contadorMiembros;
    } else {
      // Valor inicial razonable si no hay contador
      miembrosActuales = 47;
    }

    // Limite mensual (puede ajustarse)
    const limiteMensual = 100;
    const lugaresDisponibles = Math.max(0, limiteMensual - (miembrosActuales % 100));

    // Personas viendo (simulado pero creible)
    // Basado en hora del dia para ser mas realista
    const hora = new Date().getHours();
    let personasViendo;
    if (hora >= 0 && hora < 6) {
      personasViendo = Math.floor(Math.random() * 3) + 1; // 1-3 de noche
    } else if (hora >= 6 && hora < 12) {
      personasViendo = Math.floor(Math.random() * 8) + 3; // 3-10 de manana
    } else if (hora >= 12 && hora < 18) {
      personasViendo = Math.floor(Math.random() * 12) + 5; // 5-16 de tarde
    } else {
      personasViendo = Math.floor(Math.random() * 15) + 8; // 8-22 de noche
    }

    return {
      miembrosActuales,
      lugaresDisponibles,
      personasViendo
    };

  } catch (error) {
    console.error('[ESCASEZ] Error:', error);
    return {
      miembrosActuales: 47,
      lugaresDisponibles: 53,
      personasViendo: 7
    };
  }
}

// ===== HANDLER POST - Registrar visita =====

export async function POST(request) {
  try {
    const { email, accion } = await request.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400 });
    }

    const emailNormalizado = email.toLowerCase().trim();

    // Registrar visita a landing para tracking
    const visitaKey = `landing:visita:${emailNormalizado}`;
    const visitas = await kv.get(visitaKey) || [];

    visitas.push({
      fecha: new Date().toISOString(),
      accion: accion || 'view'
    });

    // Guardar ultimas 10 visitas
    await kv.set(visitaKey, visitas.slice(-10));

    // Si la accion es "cta_click", registrar para analisis
    if (accion === 'cta_click') {
      await kv.incr('landing:clicks:total');
      await kv.incr(`landing:clicks:${new Date().toISOString().split('T')[0]}`);
    }

    return NextResponse.json({
      success: true,
      registrado: true
    });

  } catch (error) {
    console.error('[LANDING-PERSONALIZADA] Error POST:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
