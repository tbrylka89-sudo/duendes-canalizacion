import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════
// GENERADOR DE RITUALES PERSONALIZADOS
// ═══════════════════════════════════════════════════════════════

const INTENCIONES = {
  proteccion: {
    nombre: 'Proteccion',
    color: '#4B0082',
    elementos: ['turmalina negra', 'obsidiana', 'sal marina'],
    velas: ['negra', 'blanca'],
    hierbas: ['romero', 'ruda', 'albahaca'],
    momentoIdeal: 'Luna menguante o nueva',
    direccion: 'Norte'
  },
  abundancia: {
    nombre: 'Abundancia y Prosperidad',
    color: '#228B22',
    elementos: ['pirita', 'citrino', 'aventurina verde'],
    velas: ['verde', 'dorada'],
    hierbas: ['canela', 'laurel', 'menta'],
    momentoIdeal: 'Luna creciente o llena',
    direccion: 'Este'
  },
  amor: {
    nombre: 'Amor y Relaciones',
    color: '#FF69B4',
    elementos: ['cuarzo rosa', 'rodocrosita', 'jade'],
    velas: ['rosa', 'roja'],
    hierbas: ['rosa', 'lavanda', 'jazmin'],
    momentoIdeal: 'Viernes, Luna creciente',
    direccion: 'Oeste'
  },
  sanacion: {
    nombre: 'Sanacion',
    color: '#00CED1',
    elementos: ['amatista', 'cuarzo cristal', 'selenita'],
    velas: ['blanca', 'azul'],
    hierbas: ['eucalipto', 'salvia', 'manzanilla'],
    momentoIdeal: 'Cualquier momento, idealmente luna nueva',
    direccion: 'Centro'
  },
  claridad: {
    nombre: 'Claridad Mental',
    color: '#4169E1',
    elementos: ['fluorita', 'sodalita', 'lapislazuli'],
    velas: ['azul', 'blanca'],
    hierbas: ['incienso', 'romero', 'menta'],
    momentoIdeal: 'Miercoles, Luna creciente',
    direccion: 'Este'
  },
  soltar: {
    nombre: 'Soltar y Liberar',
    color: '#800080',
    elementos: ['obsidiana', 'cuarzo ahumado', 'labradorita'],
    velas: ['negra', 'violeta'],
    hierbas: ['salvia blanca', 'cedro', 'copal'],
    momentoIdeal: 'Luna menguante',
    direccion: 'Oeste'
  },
  creatividad: {
    nombre: 'Creatividad e Inspiracion',
    color: '#FF8C00',
    elementos: ['cornalina', 'ojo de tigre', 'ambar'],
    velas: ['naranja', 'amarilla'],
    hierbas: ['calendula', 'jengibre', 'naranja'],
    momentoIdeal: 'Domingo, Luna creciente',
    direccion: 'Sur'
  }
};

const TIPOS_RITUAL = {
  vela: {
    nombre: 'Ritual de Vela',
    duracion: '15-30 minutos',
    dificultad: 'Principiante',
    descripcion: 'Un ritual simple pero poderoso usando la energia del fuego'
  },
  baño: {
    nombre: 'Baño Ritual',
    duracion: '30-45 minutos',
    dificultad: 'Principiante',
    descripcion: 'Limpieza y renovacion a traves del agua sagrada'
  },
  meditacion: {
    nombre: 'Meditacion Ritual',
    duracion: '20-40 minutos',
    dificultad: 'Intermedio',
    descripcion: 'Trabajo interno profundo con visualizacion y respiracion'
  },
  altar: {
    nombre: 'Ritual de Altar',
    duracion: '30-60 minutos',
    dificultad: 'Intermedio',
    descripcion: 'Ceremonia completa en tu espacio sagrado'
  },
  luna: {
    nombre: 'Ritual Lunar',
    duracion: '20-45 minutos',
    dificultad: 'Principiante',
    descripcion: 'Aprovechando la energia de la fase lunar actual'
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const intencion = searchParams.get('intencion');
    const tipo = searchParams.get('tipo');
    const email = searchParams.get('email');

    // Verificar membresia si hay email
    if (email) {
      const emailNorm = email.toLowerCase().trim();
      let usuario = await kv.get(`user:${emailNorm}`);
      if (!usuario) usuario = await kv.get(`elegido:${emailNorm}`);
      const circuloData = await kv.get(`circulo:${emailNorm}`);

      const esCirculo = circuloData?.activo ||
        (usuario?.esCirculo && usuario?.circuloExpira && new Date(usuario.circuloExpira) > new Date());

      if (!esCirculo) {
        return Response.json({
          success: false,
          error: 'Contenido exclusivo para miembros del Circulo',
          esCirculo: false
        }, { status: 403 });
      }
    }

    // Si no hay intencion, devolver lista de opciones
    if (!intencion) {
      return Response.json({
        success: true,
        intenciones: Object.entries(INTENCIONES).map(([id, data]) => ({
          id,
          ...data
        })),
        tipos: Object.entries(TIPOS_RITUAL).map(([id, data]) => ({
          id,
          ...data
        }))
      });
    }

    // Generar ritual personalizado
    const intencionData = INTENCIONES[intencion];
    if (!intencionData) {
      return Response.json({
        success: false,
        error: 'Intencion no valida'
      }, { status: 400 });
    }

    const tipoRitual = TIPOS_RITUAL[tipo] || TIPOS_RITUAL.vela;
    const faseActual = calcularFaseLunar(new Date());
    const ritual = generarRitual(intencion, intencionData, tipo || 'vela', tipoRitual, faseActual);

    return Response.json({
      success: true,
      ritual,
      faseActual,
      intencion: { id: intencion, ...intencionData },
      tipo: { id: tipo || 'vela', ...tipoRitual }
    });

  } catch (error) {
    console.error('Error generando ritual:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

function generarRitual(intencionId, intencion, tipoId, tipoRitual, faseActual) {
  const ahora = new Date();
  const diaSemana = ahora.toLocaleDateString('es-UY', { weekday: 'long' });

  return {
    titulo: `Ritual de ${intencion.nombre}`,
    subtitulo: tipoRitual.nombre,
    duracion: tipoRitual.duracion,
    dificultad: tipoRitual.dificultad,
    momentoActual: {
      dia: diaSemana,
      fase: faseActual.nombre,
      esIdeal: evaluarMomento(intencionId, faseActual.fase, diaSemana)
    },
    preparacion: {
      titulo: 'Preparacion del espacio',
      pasos: [
        'Limpia el area donde realizaras el ritual con humo de salvia o palo santo',
        'Asegurate de que no seras interrumpido/a durante los proximos ' + tipoRitual.duracion,
        'Apaga dispositivos electronicos o ponelos en silencio',
        'Si tenes un guardian duende, colocalo cerca como testigo y protector',
        'Respira profundo tres veces para centrarte'
      ]
    },
    materiales: {
      cristales: intencion.elementos,
      velas: intencion.velas.map(v => `Vela ${v}`),
      hierbas: intencion.hierbas,
      extras: [
        'Fosforos o encendedor de madera',
        'Un plato o soporte para la vela',
        'Papel y lapiz (si vas a escribir intenciones)',
        'Agua pura en un vaso (para cerrar)'
      ]
    },
    pasos: generarPasosRitual(tipoId, intencion, faseActual),
    cierre: {
      titulo: 'Cierre del ritual',
      pasos: [
        'Agradece a los elementos, guardianes y energias que participaron',
        'Visualiza tu intencion como ya cumplida',
        'Si encendiste vela, dejala consumir completamente si es seguro, o apagala con los dedos (nunca soplando)',
        'Bebe el vaso de agua para integrar las energias',
        'Toca la tierra o el piso para anclarte',
        'Guarda los cristales cerca de ti las proximas 24 horas'
      ]
    },
    consejosExtra: [
      `Momento ideal para este ritual: ${intencion.momentoIdeal}`,
      `Direccion de poder: ${intencion.direccion}`,
      `Repeti este ritual cada ${faseActual.fase === 'llena' ? 'luna llena' : 'luna nueva'} para potenciar resultados`,
      'Tu guardian duende puede asistirte energeticamente - pidele apoyo antes de comenzar'
    ],
    afirmacion: generarAfirmacion(intencionId)
  };
}

function generarPasosRitual(tipo, intencion, faseActual) {
  const pasos = [];

  switch(tipo) {
    case 'vela':
      pasos.push(
        { numero: 1, titulo: 'Consagrar la vela', descripcion: `Toma la vela ${intencion.velas[0]} en tus manos. Cierra los ojos y visualiza tu intencion fluyendo desde tu corazon hacia la vela. Siente como la vela absorbe tu energia.` },
        { numero: 2, titulo: 'Untar con aceite (opcional)', descripcion: 'Si tenes aceite esencial, unta la vela desde el centro hacia los extremos mientras repites tu intencion en voz baja.' },
        { numero: 3, titulo: 'Crear el circulo sagrado', descripcion: `Coloca los cristales (${intencion.elementos.join(', ')}) formando un circulo alrededor de la vela. Esto crea un campo de energia concentrado.` },
        { numero: 4, titulo: 'Encender con intencion', descripcion: 'Enciende la vela diciendo en voz alta: "Con esta llama activo mi intencion de [tu intencion]. Que asi sea."' },
        { numero: 5, titulo: 'Meditacion con la llama', descripcion: 'Observa la llama durante 5-10 minutos. Visualiza tu intencion manifestandose. Siente la energia del fuego trabajando para vos.' },
        { numero: 6, titulo: 'Escribir y quemar (opcional)', descripcion: 'Escribe tu intencion en un papel pequeno. Quemalo en la llama de la vela, liberando tu deseo al universo.' }
      );
      break;

    case 'baño':
      pasos.push(
        { numero: 1, titulo: 'Preparar el agua', descripcion: `Llena la banera con agua caliente. Agrega sal marina (3 puñados) y hierbas: ${intencion.hierbas.join(', ')}.` },
        { numero: 2, titulo: 'Crear ambiente', descripcion: `Enciende velas ${intencion.velas.join(' y ')} alrededor de la banera. Coloca los cristales en los bordes.` },
        { numero: 3, titulo: 'Entrar con intencion', descripcion: 'Antes de entrar, di: "Entro a estas aguas para [tu intencion]. Me limpio, me renuevo, me transformo."' },
        { numero: 4, titulo: 'Inmersion consciente', descripcion: 'Sumergite completamente si es posible. Siente como el agua absorbe lo que necesitas soltar.' },
        { numero: 5, titulo: 'Visualizacion', descripcion: `Visualiza el color ${intencion.color} envolviendote. Imagina que este color llena cada celula de tu cuerpo con la energia de ${intencion.nombre.toLowerCase()}.` },
        { numero: 6, titulo: 'Salir renovada', descripcion: 'Al salir, senti como dejaste lo viejo en el agua. No te seques inmediatamente - deja que el aire complete la limpieza.' }
      );
      break;

    case 'meditacion':
      pasos.push(
        { numero: 1, titulo: 'Posicion y respiracion', descripcion: 'Sentate comoda con la espalda recta. Sostene un cristal de ' + intencion.elementos[0] + ' en tu mano izquierda (receptiva).' },
        { numero: 2, titulo: 'Respiracion 4-7-8', descripcion: 'Inhala 4 segundos, retene 7, exhala 8. Repeti 7 veces para entrar en estado alterado de consciencia.' },
        { numero: 3, titulo: 'Visualizacion del portal', descripcion: `Imagina frente a vos un portal de luz color ${intencion.color}. Este portal te lleva al espacio donde tu intencion ya es realidad.` },
        { numero: 4, titulo: 'Atravesar el portal', descripcion: 'Cruza el portal mentalmente. Del otro lado, observa como seria tu vida con tu intencion cumplida. Usa todos tus sentidos.' },
        { numero: 5, titulo: 'Recibir el mensaje', descripcion: 'Pregunta: "Que necesito saber o hacer para manifestar esto?" Escucha. Puede venir como palabra, imagen, sensacion.' },
        { numero: 6, titulo: 'Anclar la vision', descripcion: 'Toma algo simbolico de ese espacio (una imagen, sensacion o palabra) y traelo contigo mientras regresas lentamente.' }
      );
      break;

    case 'altar':
      pasos.push(
        { numero: 1, titulo: 'Montar el altar', descripcion: `Coloca un mantel o tela de color afin (sugerido: color cercano a ${intencion.color}). Ubica tu guardian duende en el centro.` },
        { numero: 2, titulo: 'Los 4 elementos', descripcion: 'Coloca: una vela (fuego), incienso (aire), agua con sal (agua), cristales o tierra (tierra). Uno en cada direccion.' },
        { numero: 3, titulo: 'Abrir el espacio', descripcion: 'Di: "Abro este espacio sagrado. Invoco a los guardianes del Norte, Sur, Este y Oeste. Invoco a mi guardian duende. Este es un espacio de magia y transformacion."' },
        { numero: 4, titulo: 'Presentar la intencion', descripcion: `En voz alta, declara tu intencion de ${intencion.nombre.toLowerCase()}. Se especifica. Se clara. Habla como si ya fuera realidad.` },
        { numero: 5, titulo: 'Ofrenda', descripcion: `Ofrece las hierbas (${intencion.hierbas.join(', ')}) a la llama del incienso como ofrenda. Di: "Ofrezco esto en gratitud por lo que ya esta en camino."` },
        { numero: 6, titulo: 'Sellado', descripcion: 'Golpea el altar 3 veces con tus palmas. Di: "Asi fue, asi es, asi sera. Este ritual esta sellado." Apaga las velas de afuera hacia adentro.' }
      );
      break;

    case 'luna':
      const esLunaCreciente = ['creciente', 'cuarto-creciente', 'gibosa-creciente'].includes(faseActual.fase);
      pasos.push(
        { numero: 1, titulo: 'Conexion lunar', descripcion: `Si es posible, ubicate donde puedas ver la luna (${faseActual.nombre}). Si no, visualizala claramente.` },
        { numero: 2, titulo: 'Absorber energia', descripcion: 'Extiende tus manos hacia la luna. Senti como su luz plateada entra por tus palmas y llena todo tu ser.' },
        { numero: 3, titulo: esLunaCreciente ? 'Sembrar intenciones' : 'Liberar lo viejo', descripcion: esLunaCreciente ?
          'Escribe tu intencion en un papel. Leelo a la luna 3 veces. Guarda el papel bajo tu almohada hasta luna llena.' :
          'Escribe lo que queres soltar. Quemalo o enterralo. Deja que la luna menguante se lo lleve.' },
        { numero: 4, titulo: 'Cargar cristales', descripcion: `Coloca tus cristales (${intencion.elementos.join(', ')}) bajo la luz de la luna. Dejandolos toda la noche si es posible.` },
        { numero: 5, titulo: 'Agua lunar', descripcion: 'Deja un vaso de agua bajo la luz de la luna. Manana bebela con tu intencion en mente.' },
        { numero: 6, titulo: 'Gratitud', descripcion: 'Agradece a la luna por su guia y energia. Prometele honrar tu intencion con acciones coherentes.' }
      );
      break;

    default:
      pasos.push(
        { numero: 1, titulo: 'Centrarte', descripcion: 'Respira profundo 3 veces, conecta con tu intencion.' },
        { numero: 2, titulo: 'Declarar', descripcion: 'Di tu intencion en voz alta.' },
        { numero: 3, titulo: 'Visualizar', descripcion: 'Imagina tu intencion cumplida.' },
        { numero: 4, titulo: 'Agradecer', descripcion: 'Agradece como si ya hubiera sucedido.' }
      );
  }

  return pasos;
}

function generarAfirmacion(intencionId) {
  const afirmaciones = {
    proteccion: 'Estoy protegida. Un escudo de luz me rodea. Nada que no sea para mi mayor bien puede atravesarlo.',
    abundancia: 'Soy un iman para la abundancia. La prosperidad fluye hacia mi naturalmente. Merezco todo lo bueno que recibo.',
    amor: 'Mi corazon esta abierto al amor. Doy y recibo amor libremente. El amor me encuentra en todas partes.',
    sanacion: 'Mi cuerpo sabe como sanarse. Cada celula vibra con salud. Me permito sanar en todos los niveles.',
    claridad: 'Mi mente es clara como el cristal. Las respuestas vienen a mi facilmente. Confio en mi intuicion.',
    soltar: 'Suelto con amor todo lo que ya no me sirve. Al liberar, creo espacio para lo nuevo. Estoy en paz.',
    creatividad: 'La creatividad fluye a traves de mi. Soy un canal de inspiracion. Mis ideas tienen valor y merecen expresarse.'
  };

  return afirmaciones[intencionId] || 'Estoy alineada con mi proposito mas alto. Todo fluye perfectamente.';
}

function evaluarMomento(intencionId, faseActual, diaSemana) {
  const fasesIdeales = {
    proteccion: ['menguante', 'nueva'],
    abundancia: ['creciente', 'llena'],
    amor: ['creciente', 'llena'],
    sanacion: ['nueva', 'creciente'],
    claridad: ['creciente'],
    soltar: ['menguante'],
    creatividad: ['creciente', 'llena']
  };

  const diasIdeales = {
    proteccion: ['sabado'],
    abundancia: ['jueves'],
    amor: ['viernes'],
    sanacion: ['lunes'],
    claridad: ['miercoles'],
    soltar: ['sabado'],
    creatividad: ['domingo']
  };

  const faseOK = fasesIdeales[intencionId]?.some(f => faseActual.includes(f)) || false;
  const diaOK = diasIdeales[intencionId]?.includes(diaSemana.toLowerCase()) || false;

  if (faseOK && diaOK) return { nivel: 'perfecto', mensaje: 'Momento ideal para este ritual!' };
  if (faseOK || diaOK) return { nivel: 'bueno', mensaje: 'Buen momento para realizar el ritual.' };
  return { nivel: 'neutral', mensaje: 'Cualquier momento es bueno si tu intencion es clara.' };
}

function calcularFaseLunar(fecha) {
  const lunarCycle = 29.53059;
  const knownNewMoon = new Date('2024-01-11T11:57:00Z');
  const daysSinceNew = (fecha - knownNewMoon) / (1000 * 60 * 60 * 24);
  const lunarAge = ((daysSinceNew % lunarCycle) + lunarCycle) % lunarCycle;

  if (lunarAge < 1.85) return { fase: 'nueva', nombre: 'Luna Nueva', emoji: '🌑' };
  if (lunarAge < 7.38) return { fase: 'creciente', nombre: 'Luna Creciente', emoji: '🌒' };
  if (lunarAge < 9.23) return { fase: 'cuarto-creciente', nombre: 'Cuarto Creciente', emoji: '🌓' };
  if (lunarAge < 14.77) return { fase: 'gibosa-creciente', nombre: 'Gibosa Creciente', emoji: '🌔' };
  if (lunarAge < 16.61) return { fase: 'llena', nombre: 'Luna Llena', emoji: '🌕' };
  if (lunarAge < 22.15) return { fase: 'gibosa-menguante', nombre: 'Gibosa Menguante', emoji: '🌖' };
  if (lunarAge < 23.99) return { fase: 'cuarto-menguante', nombre: 'Cuarto Menguante', emoji: '🌗' };
  return { fase: 'menguante', nombre: 'Luna Menguante', emoji: '🌘' };
}
