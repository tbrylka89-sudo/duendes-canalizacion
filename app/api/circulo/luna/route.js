export const dynamic = 'force-dynamic';

import { kv } from '@vercel/kv';

// GET - Obtener informacion lunar y guia del mes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Verificar membresia si se proporciona email
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
          esCirculo: false,
          preview: obtenerPreviewLuna()
        }, { status: 403 });
      }
    }

    const ahora = new Date();
    const faseActual = calcularFaseLunar(ahora);
    const proximasFases = calcularProximasFases(ahora);
    const energiaMes = obtenerEnergiaMes(ahora);
    const ritualesRecomendados = obtenerRitualesFase(faseActual.fase);
    const cristalesLuna = obtenerCristalesLuna(faseActual.fase);
    const afirmacionDia = obtenerAfirmacionDia(faseActual.fase);

    return Response.json({
      success: true,
      esCirculo: true,
      luna: {
        faseActual,
        iluminacion: calcularIluminacion(ahora),
        signoLunar: calcularSignoLunar(ahora),
        proximasFases,
        energiaMes,
        ritualesRecomendados,
        cristalesLuna,
        afirmacionDia,
        mensajeGuardian: obtenerMensajeGuardian(faseActual.fase)
      },
      calendario: generarCalendarioMes(ahora)
    });

  } catch (error) {
    console.error('Error obteniendo datos lunares:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Calcular fase lunar
function calcularFaseLunar(fecha) {
  const lunarCycle = 29.53059;
  const knownNewMoon = new Date('2024-01-11T11:57:00Z');
  const daysSinceNew = (fecha - knownNewMoon) / (1000 * 60 * 60 * 24);
  const lunarAge = ((daysSinceNew % lunarCycle) + lunarCycle) % lunarCycle;

  const fases = [
    { max: 1.85, fase: 'nueva', emoji: '🌑', nombre: 'Luna Nueva', energia: 'Comienzos, intenciones, plantar semillas' },
    { max: 7.38, fase: 'creciente', emoji: '🌒', nombre: 'Luna Creciente', energia: 'Crecimiento, accion, construir' },
    { max: 9.23, fase: 'cuarto-creciente', emoji: '🌓', nombre: 'Cuarto Creciente', energia: 'Decisiones, superar obstaculos' },
    { max: 14.77, fase: 'gibosa-creciente', emoji: '🌔', nombre: 'Gibosa Creciente', energia: 'Refinamiento, paciencia, ajustes' },
    { max: 16.61, fase: 'llena', emoji: '🌕', nombre: 'Luna Llena', energia: 'Manifestacion, culminacion, liberacion' },
    { max: 22.15, fase: 'gibosa-menguante', emoji: '🌖', nombre: 'Gibosa Menguante', energia: 'Gratitud, compartir, distribuir' },
    { max: 23.99, fase: 'cuarto-menguante', emoji: '🌗', nombre: 'Cuarto Menguante', energia: 'Soltar, perdonar, limpiar' },
    { max: 30, fase: 'menguante', emoji: '🌘', nombre: 'Luna Menguante', energia: 'Descanso, introspeccion, preparar' }
  ];

  for (const f of fases) {
    if (lunarAge < f.max) {
      return { ...f, edadLunar: Math.round(lunarAge * 10) / 10 };
    }
  }
  return { ...fases[0], edadLunar: lunarAge };
}

// Calcular iluminacion
function calcularIluminacion(fecha) {
  const lunarCycle = 29.53059;
  const knownNewMoon = new Date('2024-01-11T11:57:00Z');
  const daysSinceNew = (fecha - knownNewMoon) / (1000 * 60 * 60 * 24);
  const lunarAge = ((daysSinceNew % lunarCycle) + lunarCycle) % lunarCycle;

  // Iluminacion basada en coseno
  const iluminacion = (1 - Math.cos((lunarAge / lunarCycle) * 2 * Math.PI)) / 2;
  return Math.round(iluminacion * 100);
}

// Calcular signo lunar aproximado
function calcularSignoLunar(fecha) {
  const signos = [
    { signo: 'Aries', emoji: '♈', elemento: 'Fuego', energia: 'Iniciativa y accion' },
    { signo: 'Tauro', emoji: '♉', elemento: 'Tierra', energia: 'Estabilidad y sensualidad' },
    { signo: 'Geminis', emoji: '♊', elemento: 'Aire', energia: 'Comunicacion y curiosidad' },
    { signo: 'Cancer', emoji: '♋', elemento: 'Agua', energia: 'Emociones y hogar' },
    { signo: 'Leo', emoji: '♌', elemento: 'Fuego', energia: 'Creatividad y expresion' },
    { signo: 'Virgo', emoji: '♍', elemento: 'Tierra', energia: 'Servicio y detalle' },
    { signo: 'Libra', emoji: '♎', elemento: 'Aire', energia: 'Equilibrio y relaciones' },
    { signo: 'Escorpio', emoji: '♏', elemento: 'Agua', energia: 'Transformacion profunda' },
    { signo: 'Sagitario', emoji: '♐', elemento: 'Fuego', energia: 'Expansion y aventura' },
    { signo: 'Capricornio', emoji: '♑', elemento: 'Tierra', energia: 'Estructura y metas' },
    { signo: 'Acuario', emoji: '♒', elemento: 'Aire', energia: 'Innovacion y comunidad' },
    { signo: 'Piscis', emoji: '♓', elemento: 'Agua', energia: 'Intuicion y espiritualidad' }
  ];

  // Simplificado: la luna cambia de signo cada ~2.5 dias
  const diasAnio = Math.floor((fecha - new Date(fecha.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const indice = Math.floor((diasAnio / 2.5) % 12);
  return signos[indice];
}

// Proximas fases importantes
function calcularProximasFases(fecha) {
  const lunarCycle = 29.53059;
  const knownNewMoon = new Date('2024-01-11T11:57:00Z');
  const daysSinceNew = (fecha - knownNewMoon) / (1000 * 60 * 60 * 24);
  const lunarAge = ((daysSinceNew % lunarCycle) + lunarCycle) % lunarCycle;

  const diasHastaLlena = lunarAge < 14.77 ? 14.77 - lunarAge : lunarCycle - lunarAge + 14.77;
  const diasHastaNueva = lunarCycle - lunarAge;

  return [
    {
      fase: 'Luna Llena',
      emoji: '🌕',
      fecha: new Date(fecha.getTime() + diasHastaLlena * 24 * 60 * 60 * 1000).toISOString(),
      diasRestantes: Math.round(diasHastaLlena)
    },
    {
      fase: 'Luna Nueva',
      emoji: '🌑',
      fecha: new Date(fecha.getTime() + diasHastaNueva * 24 * 60 * 60 * 1000).toISOString(),
      diasRestantes: Math.round(diasHastaNueva)
    }
  ];
}

// Energia del mes
function obtenerEnergiaMes(fecha) {
  const meses = [
    { nombre: 'Enero', tema: 'Nuevos comienzos', cristal: 'Granate', color: '#8B0000' },
    { nombre: 'Febrero', tema: 'Amor y conexion', cristal: 'Amatista', color: '#9966CC' },
    { nombre: 'Marzo', tema: 'Renacimiento', cristal: 'Aguamarina', color: '#7FFFD4' },
    { nombre: 'Abril', tema: 'Crecimiento', cristal: 'Diamante', color: '#B9F2FF' },
    { nombre: 'Mayo', tema: 'Abundancia', cristal: 'Esmeralda', color: '#50C878' },
    { nombre: 'Junio', tema: 'Claridad', cristal: 'Perla', color: '#FDEEF4' },
    { nombre: 'Julio', tema: 'Pasion', cristal: 'Rubi', color: '#E0115F' },
    { nombre: 'Agosto', tema: 'Fortaleza', cristal: 'Peridoto', color: '#ADFF2F' },
    { nombre: 'Septiembre', tema: 'Sabiduria', cristal: 'Zafiro', color: '#0F52BA' },
    { nombre: 'Octubre', tema: 'Transformacion', cristal: 'Opalo', color: '#A8C3BC' },
    { nombre: 'Noviembre', tema: 'Gratitud', cristal: 'Topacio', color: '#FFC87C' },
    { nombre: 'Diciembre', tema: 'Reflexion', cristal: 'Turquesa', color: '#40E0D0' }
  ];
  return meses[fecha.getMonth()];
}

// Rituales por fase
function obtenerRitualesFase(fase) {
  const rituales = {
    'nueva': [
      'Escribir intenciones en papel y guardarlas bajo la almohada',
      'Meditar en la oscuridad visualizando tus deseos',
      'Plantar semillas (fisicas o simbolicas)'
    ],
    'creciente': [
      'Tomar accion hacia tus metas',
      'Comenzar nuevos proyectos',
      'Cargar cristales con intenciones'
    ],
    'cuarto-creciente': [
      'Evaluar obstaculos y buscar soluciones',
      'Hacer ajustes en tus planes',
      'Practicar la toma de decisiones'
    ],
    'gibosa-creciente': [
      'Refinar detalles de tus proyectos',
      'Practicar la paciencia',
      'Conectar con tu guardian para guia'
    ],
    'llena': [
      'Ritual de liberacion: escribir y quemar lo que quieres soltar',
      'Cargar cristales bajo la luz de la luna',
      'Celebrar tus logros con gratitud'
    ],
    'gibosa-menguante': [
      'Compartir tus bendiciones con otros',
      'Practicar la generosidad',
      'Ensenar lo que has aprendido'
    ],
    'cuarto-menguante': [
      'Limpieza energetica del hogar',
      'Perdonar y soltar resentimientos',
      'Deshacerte de objetos que ya no sirven'
    ],
    'menguante': [
      'Descansar y recuperar energia',
      'Meditar y hacer introspeccion',
      'Preparar intenciones para la proxima luna nueva'
    ]
  };
  return rituales[fase] || rituales['nueva'];
}

// Cristales por fase
function obtenerCristalesLuna(fase) {
  const cristales = {
    'nueva': ['Obsidiana', 'Labradorita', 'Piedra Luna Negra'],
    'creciente': ['Citrino', 'Aventurina', 'Pirita'],
    'cuarto-creciente': ['Ojo de Tigre', 'Cornalina', 'Jaspe Rojo'],
    'gibosa-creciente': ['Amatista', 'Fluorita', 'Sodalita'],
    'llena': ['Selenita', 'Cuarzo Claro', 'Piedra Luna'],
    'gibosa-menguante': ['Cuarzo Rosa', 'Rodocrosita', 'Kunzita'],
    'cuarto-menguante': ['Turmalina Negra', 'Hematita', 'Obsidiana Nevada'],
    'menguante': ['Lepidolita', 'Howlita', 'Amatista']
  };
  return cristales[fase] || cristales['nueva'];
}

// Afirmacion del dia
function obtenerAfirmacionDia(fase) {
  const afirmaciones = {
    'nueva': 'Soy un lienzo en blanco lleno de posibilidades infinitas.',
    'creciente': 'Cada paso que doy me acerca a mis suenos.',
    'cuarto-creciente': 'Tengo el poder de superar cualquier obstaculo.',
    'gibosa-creciente': 'Confio en el proceso y permito que las cosas fluyan.',
    'llena': 'Celebro mis logros y libero lo que ya no me sirve.',
    'gibosa-menguante': 'Comparto mi luz con generosidad y gratitud.',
    'cuarto-menguante': 'Perdono, suelto y me libero con amor.',
    'menguante': 'Me permito descansar y renovar mi energia.'
  };
  return afirmaciones[fase] || afirmaciones['nueva'];
}

// Mensaje del guardian
function obtenerMensajeGuardian(fase) {
  const mensajes = {
    'nueva': 'Querida alma, este es el momento de sembrar. Susurra tus deseos al viento y yo los llevare al universo.',
    'creciente': 'Veo tu determinacion brillar. Cada pequena accion cuenta, sigue adelante con confianza.',
    'cuarto-creciente': 'Los obstaculos son maestros disfrazados. Miralos con curiosidad, no con miedo.',
    'gibosa-creciente': 'La paciencia es una forma de fe. Tu momento esta mas cerca de lo que imaginas.',
    'llena': 'Esta noche la magia esta en su punto mas alto. Abre tu corazon y recibe las bendiciones que mereces.',
    'gibosa-menguante': 'Has recibido mucho. Ahora es tiempo de devolver al mundo parte de esa luz.',
    'cuarto-menguante': 'Soltar no es perder, es hacer espacio para lo nuevo. Confio en tu sabiduria.',
    'menguante': 'Descansa, querida alma. El descanso tambien es sagrado. Pronto comenzaremos de nuevo.'
  };
  return mensajes[fase] || mensajes['nueva'];
}

// Generar calendario del mes
function generarCalendarioMes(fecha) {
  const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
  const dias = [];

  for (let d = new Date(primerDia); d <= ultimoDia; d.setDate(d.getDate() + 1)) {
    const fase = calcularFaseLunar(new Date(d));
    dias.push({
      dia: d.getDate(),
      fecha: new Date(d).toISOString().split('T')[0],
      fase: fase.fase,
      emoji: fase.emoji,
      esHoy: d.toDateString() === fecha.toDateString()
    });
  }

  return {
    mes: fecha.toLocaleDateString('es-UY', { month: 'long', year: 'numeric' }),
    dias
  };
}

// Preview para no miembros
function obtenerPreviewLuna() {
  return {
    faseActual: calcularFaseLunar(new Date()),
    mensaje: 'Unete al Circulo para acceder al calendario lunar completo, rituales personalizados y mensajes de tu guardian.'
  };
}
