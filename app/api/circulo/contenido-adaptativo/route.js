import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { obtenerPerfil, calcularPerfil, TIPOS_DOLOR, TIPOS_CREENCIAS } from '@/lib/circulo/perfilado';
import { generarSincronicidad } from '@/lib/circulo/sincronicidad';
import { CIRCULO_CONFIG, getPortalActual, getDiaContenido } from '@/lib/circulo/config';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * API DE CONTENIDO ADAPTATIVO DEL CIRCULO
 * Adapta el contenido segun el perfil psicologico del usuario
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * El esceptico ve menos "magia", mas contenido practico
 * El creyente ve mas rituales y lenguaje mistico
 * El vulnerable recibe mas contencion y menos presion
 */

// ===== CONTENIDO BASE POR TIPO =====

const CONTENIDO_TEMPLATES = {
  mensaje_diario: {
    mistico: {
      intro: 'Tu guardián del día tiene un mensaje para vos',
      cierre: 'Que la magia te acompañe hoy'
    },
    practico: {
      intro: 'Tu reflexión del día',
      cierre: 'Llevá esto con vos hoy'
    },
    contenedor: {
      intro: 'Hoy quiero que sepas algo importante',
      cierre: 'Estoy acá para vos'
    }
  },
  ensenanza: {
    mistico: {
      intro: 'Enseñanza del guardián de la semana',
      cierre: 'Que esta sabiduría se integre en vos'
    },
    practico: {
      intro: 'Tema de la semana',
      cierre: 'Ponelo en práctica esta semana'
    },
    contenedor: {
      intro: 'Algo que quiero compartir con vos',
      cierre: 'Tomate el tiempo que necesites para procesarlo'
    }
  },
  ritual: {
    mistico: {
      intro: 'Ritual sagrado para esta luna',
      cierre: 'Así sea, así es'
    },
    practico: {
      intro: 'Práctica de la semana',
      cierre: 'Repetí esta práctica cuando lo necesites'
    },
    contenedor: {
      intro: 'Un ejercicio suave para vos',
      cierre: 'Hacelo a tu ritmo, sin presión'
    }
  }
};

// ===== ADAPTADORES DE LENGUAJE =====

const REEMPLAZOS_ESCEPTICO = {
  'guardián': 'compañero',
  'guardianes': 'compañeros',
  'ritual': 'práctica',
  'rituales': 'prácticas',
  'magia': 'bienestar',
  'mágico': 'especial',
  'mágica': 'especial',
  'energía': 'estado de ánimo',
  'energías': 'estados',
  'portal': 'etapa',
  'portales': 'etapas',
  'sagrado': 'importante',
  'sagrada': 'importante',
  'ancestral': 'tradicional',
  'ancestrales': 'tradicionales',
  'canalización': 'mensaje',
  'canalizaciones': 'mensajes',
  'luna': 'momento',
  'cosmos': 'universo',
  'vibración': 'sensación',
  'aura': 'presencia',
  'cristal': 'piedra',
  'cristales': 'piedras'
};

const REEMPLAZOS_CREYENTE = {
  // No hay reemplazos, se usa el lenguaje mistico original
};

// ===== CONTENIDO SEGUN VULNERABILIDAD =====

const CONTENIDO_VULNERABLE = {
  // Mensajes de contencion extra
  mensajesContencion: [
    'Recordá: no tenés que hacer nada que no te haga bien.',
    'Esto es para vos, a tu ritmo, sin presiones.',
    'Si hoy no podés, está bien. Mañana seguimos acá.',
    'Tu bienestar es lo primero. Siempre.',
    'No hay forma correcta de hacer esto. Solo la tuya.'
  ],
  // Evitar
  evitar: ['urgencia', 'escasez', 'presion', 'fechas_limite'],
  // Agregar
  agregar: ['validacion', 'contencion', 'sin_prisa', 'apoyo']
};

// ===== HANDLER GET =====

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const tipoContenido = searchParams.get('tipo') || 'mensaje_diario';
    const idContenido = searchParams.get('id');

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400 });
    }

    const emailNormalizado = email.toLowerCase().trim();

    // Verificar membresia activa
    const elegido = await kv.get(`elegido:${emailNormalizado}`);
    if (!elegido?.membresia?.activa) {
      return NextResponse.json({
        success: false,
        error: 'Membresía no activa',
        requiereMembresia: true
      }, { status: 403 });
    }

    // Obtener o calcular perfil
    let perfil = await obtenerPerfil(emailNormalizado);
    if (!perfil && elegido?.testGuardianRaw) {
      perfil = calcularPerfil(elegido.testGuardianRaw);
    }
    if (!perfil) {
      perfil = getPerfilDefault();
    }

    // Obtener contenido base
    let contenido;
    if (idContenido) {
      contenido = await kv.get(`circulo:contenido:${idContenido}`);
    } else {
      // Obtener contenido del dia
      contenido = await obtenerContenidoDelDia(tipoContenido);
    }

    if (!contenido) {
      return NextResponse.json({
        success: false,
        error: 'Contenido no encontrado'
      }, { status: 404 });
    }

    // Adaptar contenido al perfil
    const contenidoAdaptado = adaptarContenido(contenido, perfil, elegido);

    // Generar sincronicidad si es mensaje diario
    let sincronicidad = null;
    if (tipoContenido === 'mensaje_diario') {
      sincronicidad = generarSincronicidad({
        nombre: elegido?.nombre || '',
        fechaVisita: new Date()
      });
    }

    // Obtener portal actual para contexto
    const portalActual = getPortalActual();

    return NextResponse.json({
      success: true,
      contenido: contenidoAdaptado,
      sincronicidad: sincronicidad ? {
        mensaje: sincronicidad.mensajePrincipal,
        momento: sincronicidad.momento
      } : null,
      portal: {
        nombre: portalActual.nombre,
        energia: portalActual.energia
      },
      adaptaciones: {
        nivelMagia: perfil.creencias?.mostrarMagia || 60,
        vulnerabilidad: perfil.vulnerabilidad?.nivel || 'media',
        dolor: perfil.dolor?.tipo || 'proposito'
      }
    });

  } catch (error) {
    console.error('[CONTENIDO-ADAPTATIVO] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ===== FUNCION DE ADAPTACION =====

function adaptarContenido(contenido, perfil, elegido) {
  // Clonar contenido para no modificar original
  let adaptado = JSON.parse(JSON.stringify(contenido));

  // Determinar nivel de adaptacion
  const nivelMagia = perfil.creencias?.mostrarMagia || 60;
  const vulnerabilidad = perfil.vulnerabilidad?.nivel || 'media';
  const dolor = perfil.dolor?.tipo || 'proposito';

  // 1. ADAPTAR LENGUAJE SEGUN CREENCIAS
  if (nivelMagia < 40) {
    // Esceptico: reemplazar terminologia mistica
    adaptado = reemplazarTerminos(adaptado, REEMPLAZOS_ESCEPTICO);
    adaptado.etiqueta = 'practico';
  } else if (nivelMagia >= 80) {
    // Creyente: mantener y potenciar lo mistico
    adaptado.etiqueta = 'mistico';
  } else {
    // Buscador: balance
    adaptado.etiqueta = 'equilibrado';
  }

  // 2. ADAPTAR SEGUN VULNERABILIDAD
  if (vulnerabilidad === 'alta') {
    // Agregar mensaje de contencion al inicio
    const mensajeContencion = CONTENIDO_VULNERABLE.mensajesContencion[
      Math.floor(Math.random() * CONTENIDO_VULNERABLE.mensajesContencion.length)
    ];
    adaptado.mensajeContencion = mensajeContencion;

    // Suavizar cualquier urgencia
    if (adaptado.cta) {
      adaptado.cta = suavizarCTA(adaptado.cta);
    }

    // Agregar nota de apoyo al final
    adaptado.notaFinal = 'Tomate el tiempo que necesites. No hay apuro.';
  }

  // 3. ADAPTAR SEGUN DOLOR
  const infoDolor = TIPOS_DOLOR[dolor];
  if (infoDolor && adaptado.tipo === 'mensaje_diario') {
    // Agregar mensaje relevante al dolor
    const mensajeDolor = infoDolor.mensajes[
      Math.floor(Math.random() * infoDolor.mensajes.length)
    ];
    adaptado.mensajeRelevante = mensajeDolor;
  }

  // 4. PERSONALIZAR CON NOMBRE
  if (elegido?.nombre) {
    adaptado.saludo = `${elegido.nombre}, `;
    // Insertar nombre en el contenido si hay placeholder
    if (adaptado.texto) {
      adaptado.texto = adaptado.texto.replace(/{nombre}/g, elegido.nombre);
    }
    if (adaptado.mensaje) {
      adaptado.mensaje = adaptado.mensaje.replace(/{nombre}/g, elegido.nombre);
    }
  }

  // 5. AJUSTAR TEMPLATES SEGUN TIPO
  const templates = CONTENIDO_TEMPLATES[adaptado.tipo];
  if (templates) {
    let template;
    if (vulnerabilidad === 'alta') {
      template = templates.contenedor;
    } else if (nivelMagia < 40) {
      template = templates.practico;
    } else {
      template = templates.mistico;
    }

    adaptado.intro = template.intro;
    adaptado.cierre = template.cierre;
  }

  // 6. AGREGAR CONTENIDO EXTRA SEGUN DOLOR
  adaptado.contenidoRelacionado = obtenerContenidoRelacionado(dolor, nivelMagia);

  return adaptado;
}

// ===== FUNCIONES AUXILIARES =====

function reemplazarTerminos(contenido, reemplazos) {
  let json = JSON.stringify(contenido);

  Object.entries(reemplazos).forEach(([original, reemplazo]) => {
    // Reemplazo case-insensitive pero preservando el case original
    const regex = new RegExp(original, 'gi');
    json = json.replace(regex, (match) => {
      // Preservar mayusculas/minusculas
      if (match[0] === match[0].toUpperCase()) {
        return reemplazo.charAt(0).toUpperCase() + reemplazo.slice(1);
      }
      return reemplazo;
    });
  });

  return JSON.parse(json);
}

function suavizarCTA(cta) {
  const ctasSuaves = {
    'Activar ahora': 'Explorar cuando estés lista',
    'Comprar': 'Ver opciones',
    'Unirme': 'Conocer más',
    'Suscribirme': 'Ver beneficios',
    'Empezar': 'Dar el primer paso'
  };

  for (const [fuerte, suave] of Object.entries(ctasSuaves)) {
    if (cta.toLowerCase().includes(fuerte.toLowerCase())) {
      return cta.replace(new RegExp(fuerte, 'gi'), suave);
    }
  }

  return cta;
}

function obtenerContenidoRelacionado(dolor, nivelMagia) {
  const relacionado = {
    soledad: [
      { tipo: 'foro', titulo: nivelMagia >= 50 ? 'Círculo de Guardianes' : 'Comunidad', descripcion: 'Conectá con personas que entienden' },
      { tipo: 'ritual', titulo: nivelMagia >= 50 ? 'Ritual de Conexión' : 'Práctica de Conexión', descripcion: 'Para cuando te sentís sola' }
    ],
    dinero: [
      { tipo: 'ensenanza', titulo: 'Desbloquear la abundancia', descripcion: 'Por qué nos autosaboteamos' },
      { tipo: 'ritual', titulo: nivelMagia >= 50 ? 'Ritual de Prosperidad' : 'Práctica de Prosperidad', descripcion: 'Atraer lo que merecés' }
    ],
    salud: [
      { tipo: 'meditacion', titulo: 'Meditación de sanación', descripcion: 'Conexión cuerpo-mente' },
      { tipo: 'ensenanza', titulo: 'El cuerpo habla', descripcion: 'Escuchar las señales' }
    ],
    relaciones: [
      { tipo: 'ensenanza', titulo: 'Límites sanos', descripcion: 'Proteger tu energía en las relaciones' },
      { tipo: 'ritual', titulo: nivelMagia >= 50 ? 'Ritual de Amor Propio' : 'Práctica de Autocuidado', descripcion: 'Empezar por vos' }
    ],
    proposito: [
      { tipo: 'ensenanza', titulo: 'Encontrar tu camino', descripcion: 'Cuando no sabés para dónde ir' },
      { tipo: 'meditacion', titulo: 'Visión del futuro', descripcion: 'Conectar con tu propósito' }
    ]
  };

  return relacionado[dolor] || relacionado.proposito;
}

async function obtenerContenidoDelDia(tipo) {
  try {
    // Obtener contenido programado para hoy
    const hoy = new Date().toISOString().split('T')[0];
    const contenidoHoy = await kv.get(`circulo:contenido:${hoy}:${tipo}`);

    if (contenidoHoy) {
      return contenidoHoy;
    }

    // Si no hay contenido programado, usar uno generico
    return {
      id: `${tipo}-${hoy}`,
      tipo,
      titulo: tipo === 'mensaje_diario' ? 'Mensaje del día' : 'Contenido de hoy',
      texto: 'Hoy es un buen día para recordar que estás exactamente donde tenés que estar. Confía en el proceso.',
      guardian: {
        nombre: 'Guardián del Día',
        categoria: 'Sabiduría'
      },
      fecha: hoy,
      generadoAutomatico: true
    };

  } catch (error) {
    console.error('[obtenerContenidoDelDia] Error:', error);
    return null;
  }
}

function getPerfilDefault() {
  return {
    vulnerabilidad: { nivel: 'media' },
    dolor: { tipo: 'proposito' },
    estilo: { tipo: 'emocional' },
    creencias: { tipo: 'buscador', mostrarMagia: 60 }
  };
}

// ===== HANDLER POST - Guardar preferencias =====

export async function POST(request) {
  try {
    const { email, preferencias } = await request.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400 });
    }

    const emailNormalizado = email.toLowerCase().trim();

    // Obtener perfil actual
    let perfil = await obtenerPerfil(emailNormalizado);
    if (!perfil) {
      perfil = getPerfilDefault();
    }

    // Actualizar preferencias
    if (preferencias.nivelMagia !== undefined) {
      perfil.creencias = perfil.creencias || {};
      perfil.creencias.mostrarMagia = preferencias.nivelMagia;
    }

    if (preferencias.recibirContencion !== undefined) {
      perfil.preferencias = perfil.preferencias || {};
      perfil.preferencias.recibirContencion = preferencias.recibirContencion;
    }

    // Guardar perfil actualizado
    await kv.set(`perfil:${emailNormalizado}`, {
      ...perfil,
      ultimaActualizacion: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      perfil
    });

  } catch (error) {
    console.error('[CONTENIDO-ADAPTATIVO] Error POST:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
