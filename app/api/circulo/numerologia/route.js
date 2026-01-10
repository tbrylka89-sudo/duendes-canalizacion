import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════
// CALCULADORA DE NUMEROLOGIA COMPLETA
// ═══════════════════════════════════════════════════════════════

const NUMEROS = {
  1: {
    nombre: 'El Lider',
    arquetipos: ['El Pionero', 'El Iniciador', 'El Independiente'],
    energia: 'Masculina, yang, activa',
    elemento: 'Fuego',
    color: 'Rojo, naranja',
    cristales: ['Rubi', 'Granate', 'Cornalina'],
    fortalezas: ['Liderazgo natural', 'Originalidad', 'Determinacion', 'Coraje', 'Innovacion'],
    desafios: ['Terquedad', 'Impaciencia', 'Egocentrismo', 'Dominancia'],
    leccion: 'Aprender a liderar con humildad y a colaborar sin perder la individualidad',
    afirmacion: 'Soy un lider compasivo. Mi camino unico inspira a otros.',
    descripcion: 'El numero 1 es la chispa primordial, el comienzo de todo. Si este es tu numero de vida, viniste a abrir caminos que otros seguiran. Sos pionera en lo que haces, con una fuerza interior que te impulsa a crear e innovar.'
  },
  2: {
    nombre: 'El Mediador',
    arquetipos: ['La Diplomatica', 'La Compañera', 'La Sensible'],
    energia: 'Femenina, yin, receptiva',
    elemento: 'Agua',
    color: 'Plateado, blanco, rosa palido',
    cristales: ['Piedra Luna', 'Perla', 'Cuarzo Rosa'],
    fortalezas: ['Intuicion profunda', 'Diplomacia', 'Cooperacion', 'Sensibilidad', 'Armonia'],
    desafios: ['Indecision', 'Dependencia emocional', 'Hipersensibilidad', 'Pasividad'],
    leccion: 'Encontrar equilibrio entre dar y recibir, y confiar en tu intuicion',
    afirmacion: 'Mi sensibilidad es mi superpoder. Creo armonia donde quiera que voy.',
    descripcion: 'El 2 es la dualidad, el equilibrio entre opuestos. Si este es tu numero, viniste a tejer conexiones entre personas, a ser puente y mediadora. Tu intuicion es tu guia mas confiable.'
  },
  3: {
    nombre: 'El Creador',
    arquetipos: ['El Artista', 'El Comunicador', 'El Optimista'],
    energia: 'Expansiva, expresiva',
    elemento: 'Aire',
    color: 'Amarillo, turquesa',
    cristales: ['Citrino', 'Turquesa', 'Topacio'],
    fortalezas: ['Creatividad', 'Comunicacion', 'Alegria', 'Imaginacion', 'Carisma'],
    desafios: ['Dispersion', 'Superficialidad', 'Critica excesiva', 'Drama'],
    leccion: 'Canalizar la creatividad de forma productiva y profundizar mas alla de la superficie',
    afirmacion: 'Mi creatividad fluye libremente. Mis palabras tienen poder de transformar.',
    descripcion: 'El 3 es la expresion creativa manifestada. Si este es tu numero, viniste a crear belleza, a comunicar verdades, a hacer que la vida sea mas colorida para todos los que te rodean.'
  },
  4: {
    nombre: 'El Constructor',
    arquetipos: ['El Arquitecto', 'El Trabajador', 'El Estabilizador'],
    energia: 'Terrestre, solida',
    elemento: 'Tierra',
    color: 'Verde, marron',
    cristales: ['Jaspe', 'Obsidiana', 'Hematita'],
    fortalezas: ['Disciplina', 'Organizacion', 'Lealtad', 'Persistencia', 'Practicidad'],
    desafios: ['Rigidez', 'Terquedad', 'Exceso de trabajo', 'Resistencia al cambio'],
    leccion: 'Construir estructuras que permitan flexibilidad y no ahoguen el espiritu',
    afirmacion: 'Construyo bases solidas para mis suenos. La disciplina es mi libertad.',
    descripcion: 'El 4 es la base, los cimientos. Si este es tu numero, viniste a construir cosas duraderas, a dar forma concreta a las ideas, a crear seguridad para vos y los tuyos.'
  },
  5: {
    nombre: 'El Aventurero',
    arquetipos: ['El Viajero', 'El Libre', 'El Explorador'],
    energia: 'Dinamica, cambiante',
    elemento: 'Aire/Fuego',
    color: 'Azul electrico, turquesa',
    cristales: ['Aguamarina', 'Labradorita', 'Turquesa'],
    fortalezas: ['Libertad', 'Adaptabilidad', 'Curiosidad', 'Versatilidad', 'Magnetismo'],
    desafios: ['Inconstancia', 'Irresponsabilidad', 'Excesos', 'Miedo al compromiso'],
    leccion: 'Encontrar libertad dentro del compromiso y profundidad en la variedad',
    afirmacion: 'La vida es mi aventura. Abrazo el cambio como maestro.',
    descripcion: 'El 5 es el movimiento, la libertad, la experiencia. Si este es tu numero, viniste a experimentar la vida en toda su variedad, a enseñar que el cambio es la unica constante.'
  },
  6: {
    nombre: 'El Sanador',
    arquetipos: ['El Cuidador', 'El Maestro', 'El Responsable'],
    energia: 'Armonica, maternal',
    elemento: 'Agua/Tierra',
    color: 'Rosa, azul cielo, verde agua',
    cristales: ['Cuarzo Rosa', 'Jade', 'Rodocrosita'],
    fortalezas: ['Amor incondicional', 'Responsabilidad', 'Sanacion', 'Servicio', 'Armonia'],
    desafios: ['Sacrificio excesivo', 'Control', 'Perfeccionismo', 'Culpa'],
    leccion: 'Amarte a vos misma tanto como amas a los demas',
    afirmacion: 'Mi amor sana. Al cuidarme, cuido mejor a otros.',
    descripcion: 'El 6 es el amor, la familia, la responsabilidad. Si este es tu numero, viniste a sanar, a crear hogares, a demostrar que el amor es la fuerza mas poderosa del universo.'
  },
  7: {
    nombre: 'El Mistico',
    arquetipos: ['El Buscador', 'El Filosofo', 'El Ermitaño'],
    energia: 'Introspectiva, espiritual',
    elemento: 'Agua/Eter',
    color: 'Violeta, indigo',
    cristales: ['Amatista', 'Selenita', 'Lapislazuli'],
    fortalezas: ['Sabiduria', 'Introspeccion', 'Espiritualidad', 'Analisis', 'Intuicion profunda'],
    desafios: ['Aislamiento', 'Frialdad emocional', 'Secretismo', 'Escepticismo'],
    leccion: 'Compartir tu sabiduria y conectar con otros sin perder tu esencia',
    afirmacion: 'Mi busqueda interior ilumina el camino de otros. Soy sabiduria encarnada.',
    descripcion: 'El 7 es el misterio, la busqueda espiritual. Si este es tu numero, viniste a buscar verdades profundas, a conectar con dimensiones invisibles, a ser puente entre mundos.'
  },
  8: {
    nombre: 'El Manifestador',
    arquetipos: ['El Empresario', 'El Poderoso', 'El Karmico'],
    energia: 'Poderosa, abundante',
    elemento: 'Tierra/Fuego',
    color: 'Dorado, negro, borgoña',
    cristales: ['Pirita', 'Ojo de Tigre', 'Citrino'],
    fortalezas: ['Manifestacion', 'Liderazgo', 'Abundancia', 'Poder personal', 'Determinacion'],
    desafios: ['Materialismo', 'Abuso de poder', 'Workaholismo', 'Karma de vidas pasadas'],
    leccion: 'Usar el poder para el bien mayor y entender que la abundancia verdadera incluye todas las areas',
    afirmacion: 'Manifiesto con integridad. Mi poder sirve al bien de todos.',
    descripcion: 'El 8 es el infinito, el poder, la manifestacion. Si este es tu numero, viniste a demostrar que la abundancia espiritual y material pueden coexistir, a usar el poder con sabiduria.'
  },
  9: {
    nombre: 'El Humanitario',
    arquetipos: ['El Sanador del Mundo', 'El Sabio', 'El Completador'],
    energia: 'Universal, compasiva',
    elemento: 'Todos',
    color: 'Dorado, blanco puro',
    cristales: ['Cuarzo Cristal', 'Diamante Herkimer', 'Moldavita'],
    fortalezas: ['Compasion universal', 'Sabiduria', 'Desapego', 'Servicio', 'Vision global'],
    desafios: ['Distancia emocional', 'Melancolía', 'Dificultad para recibir', 'Idealismo excesivo'],
    leccion: 'Soltar el pasado, perdonar, y servir sin esperar nada a cambio',
    afirmacion: 'Soy uno con la humanidad. Mi servicio eleva al mundo.',
    descripcion: 'El 9 es la completitud, el servicio universal. Si este es tu numero, viniste a cerrar ciclos, a sanar heridas colectivas, a elevar la consciencia de la humanidad.'
  },
  11: {
    nombre: 'El Visionario',
    arquetipos: ['El Iluminado', 'El Canal', 'El Inspirador'],
    energia: 'Altamente espiritual',
    elemento: 'Luz',
    color: 'Blanco iridiscente, plateado',
    cristales: ['Selenita', 'Cuarzo Cristal', 'Piedra Luna'],
    fortalezas: ['Intuicion extraordinaria', 'Inspiracion', 'Liderazgo espiritual', 'Vision', 'Sensibilidad elevada'],
    desafios: ['Ansiedad', 'Hipersensibilidad', 'Dificultad para materliazar', 'Aislamiento'],
    leccion: 'Encarnar la vision y anclarla en la realidad sin perderte en ella',
    afirmacion: 'Soy canal de luz. Mi vision ilumina el camino.',
    descripcion: 'El 11 es un numero maestro, el primer portal. Si este es tu numero, viniste a ser farol para otros, a canalizar verdades superiores, a inspirar con tu sola presencia.'
  },
  22: {
    nombre: 'El Constructor Maestro',
    arquetipos: ['El Arquitecto Cosmico', 'El Transformador', 'El Visionario Practico'],
    energia: 'Manifestacion elevada',
    elemento: 'Tierra/Luz',
    color: 'Dorado, negro con brillo',
    cristales: ['Moldavita', 'Labradorita', 'Cuarzo Rutilado'],
    fortalezas: ['Vision que materializa', 'Liderazgo transformador', 'Grandes logros', 'Impacto global'],
    desafios: ['Presion interna enorme', 'Miedo al propio poder', 'Perfeccionismo paralizante'],
    leccion: 'Construir el cielo en la tierra sin destruirte en el proceso',
    afirmacion: 'Soy constructor/a de mundos nuevos. Mi vision se materializa.',
    descripcion: 'El 22 es el numero maestro de la manifestacion a gran escala. Si este es tu numero, viniste a construir estructuras que cambien el mundo, a hacer realidad lo que parece imposible.'
  },
  33: {
    nombre: 'El Maestro Sanador',
    arquetipos: ['El Avatar', 'El Amor Encarnado', 'El Redentor'],
    energia: 'Amor cristico',
    elemento: 'Amor puro',
    color: 'Rosa dorado',
    cristales: ['Cuarzo Rosa Estrella', 'Kunzita', 'Morganita'],
    fortalezas: ['Sanacion a nivel alma', 'Amor incondicional total', 'Maestria espiritual', 'Servicio elevado'],
    desafios: ['Mártir', 'Desgaste energetico extremo', 'Dificultad para establecer limites'],
    leccion: 'Ser el amor sin perderte en el dar',
    afirmacion: 'Soy amor que sana. Mi presencia transforma.',
    descripcion: 'El 33 es el mas raro de los numeros maestros. Si este es tu numero, viniste a ser amor encarnado, a sanar a nivel del alma colectiva. Tu sola presencia eleva.'
  }
};

const LETRAS_A_NUMEROS = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, ñ: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
};

const VOCALES = ['a', 'e', 'i', 'o', 'u'];

export async function POST(request) {
  try {
    const body = await request.json();
    const { fechaNacimiento, nombreCompleto, email } = body;

    // Verificar membresia
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

    if (!fechaNacimiento) {
      return Response.json({
        success: false,
        error: 'Fecha de nacimiento requerida'
      }, { status: 400 });
    }

    // Calcular numero de vida
    const numeroVida = calcularNumeroVida(fechaNacimiento);

    // Resultado base
    const resultado = {
      numeroVida: {
        numero: numeroVida,
        ...NUMEROS[numeroVida]
      },
      fechaNacimiento,
      calculoVida: explicarCalculoVida(fechaNacimiento)
    };

    // Si hay nombre completo, calcular numeros adicionales
    if (nombreCompleto && nombreCompleto.trim()) {
      const nombre = nombreCompleto.toLowerCase().trim();

      resultado.numeroExpresion = calcularNumeroExpresion(nombre);
      resultado.numeroAlma = calcularNumeroAlma(nombre);
      resultado.numeroPersonalidad = calcularNumeroPersonalidad(nombre);
      resultado.nombreAnalizado = nombreCompleto;

      // Compatibilidad entre numeros
      resultado.compatibilidad = analizarCompatibilidadInterna(
        numeroVida,
        resultado.numeroExpresion.numero,
        resultado.numeroAlma.numero,
        resultado.numeroPersonalidad.numero
      );

      // Ciclos de vida
      resultado.ciclosVida = calcularCiclosVida(fechaNacimiento);

      // Año personal actual
      resultado.añoPersonal = calcularAñoPersonal(fechaNacimiento);
    }

    return Response.json({
      success: true,
      ...resultado
    });

  } catch (error) {
    console.error('Error en numerologia:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

function reducirNumero(num, permitirMaestros = true) {
  // Si es numero maestro y permitimos maestros, no reducir
  if (permitirMaestros && [11, 22, 33].includes(num)) {
    return num;
  }

  while (num > 9) {
    if (permitirMaestros && [11, 22, 33].includes(num)) {
      return num;
    }
    num = num.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return num;
}

function calcularNumeroVida(fecha) {
  // fecha formato: YYYY-MM-DD o DD/MM/YYYY
  let dia, mes, año;

  if (fecha.includes('-')) {
    [año, mes, dia] = fecha.split('-').map(Number);
  } else if (fecha.includes('/')) {
    [dia, mes, año] = fecha.split('/').map(Number);
  } else {
    throw new Error('Formato de fecha no valido');
  }

  const suma = dia + mes + año;
  return reducirNumero(suma);
}

function explicarCalculoVida(fecha) {
  let dia, mes, año;

  if (fecha.includes('-')) {
    [año, mes, dia] = fecha.split('-').map(Number);
  } else if (fecha.includes('/')) {
    [dia, mes, año] = fecha.split('/').map(Number);
  }

  const suma = dia + mes + año;
  const pasos = [`${dia} + ${mes} + ${año} = ${suma}`];

  let num = suma;
  while (num > 9 && ![11, 22, 33].includes(num)) {
    const nuevoNum = num.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    pasos.push(`${num.toString().split('').join(' + ')} = ${nuevoNum}`);
    num = nuevoNum;
  }

  return {
    pasos,
    resultado: num
  };
}

function calcularNumeroExpresion(nombre) {
  const soloLetras = nombre.replace(/[^a-zñ]/g, '');
  let suma = 0;
  const desglose = [];

  for (const letra of soloLetras) {
    const valor = LETRAS_A_NUMEROS[letra] || 0;
    suma += valor;
    desglose.push({ letra, valor });
  }

  const numero = reducirNumero(suma);

  return {
    numero,
    significado: 'El Numero de Expresion muestra tus talentos naturales y como te expresas en el mundo',
    suma,
    reduccion: numero !== suma ? `${suma} → ${numero}` : `${suma}`,
    info: NUMEROS[numero] ? {
      nombre: NUMEROS[numero].nombre,
      fortalezas: NUMEROS[numero].fortalezas
    } : null
  };
}

function calcularNumeroAlma(nombre) {
  const soloLetras = nombre.replace(/[^a-zñ]/g, '');
  let suma = 0;

  for (const letra of soloLetras) {
    if (VOCALES.includes(letra)) {
      suma += LETRAS_A_NUMEROS[letra] || 0;
    }
  }

  const numero = reducirNumero(suma);

  return {
    numero,
    significado: 'El Numero del Alma revela tus deseos mas profundos, lo que realmente te mueve por dentro',
    suma,
    reduccion: numero !== suma ? `${suma} → ${numero}` : `${suma}`,
    info: NUMEROS[numero] ? {
      nombre: NUMEROS[numero].nombre,
      descripcion: NUMEROS[numero].descripcion
    } : null
  };
}

function calcularNumeroPersonalidad(nombre) {
  const soloLetras = nombre.replace(/[^a-zñ]/g, '');
  let suma = 0;

  for (const letra of soloLetras) {
    if (!VOCALES.includes(letra)) {
      suma += LETRAS_A_NUMEROS[letra] || 0;
    }
  }

  const numero = reducirNumero(suma);

  return {
    numero,
    significado: 'El Numero de Personalidad muestra la imagen que proyectas al mundo, tu mascara social',
    suma,
    reduccion: numero !== suma ? `${suma} → ${numero}` : `${suma}`,
    info: NUMEROS[numero] ? {
      nombre: NUMEROS[numero].nombre,
      arquetipos: NUMEROS[numero].arquetipos
    } : null
  };
}

function analizarCompatibilidadInterna(vida, expresion, alma, personalidad) {
  const numeros = [vida, expresion, alma, personalidad].map(n => reducirNumero(n, false));
  const unicos = [...new Set(numeros)];

  let mensaje = '';

  if (unicos.length === 1) {
    mensaje = 'Hay una coherencia absoluta en tu mapa numerologico. Sos una persona muy autentica, lo que sientes, expresas y muestras esta alineado.';
  } else if (unicos.length === 2) {
    mensaje = 'Hay una buena armonia entre tus numeros. Tus partes internas y externas trabajan bien juntas la mayor parte del tiempo.';
  } else if (unicos.length === 3) {
    mensaje = 'Hay algo de tension creativa entre tus numeros. Esto puede generar complejidad pero tambien profundidad y versatilidad.';
  } else {
    mensaje = 'Tus numeros son muy diversos, lo que indica una personalidad multifacetica. Podes sentirte diferente persona en diferentes contextos.';
  }

  // Analizar alma vs personalidad
  if (alma !== personalidad) {
    mensaje += ' Lo que deseas por dentro (alma) difiere de lo que muestras (personalidad), lo cual es comun pero puede crear tension.';
  }

  return {
    mensaje,
    coherencia: `${((4 - unicos.length + 1) / 4 * 100).toFixed(0)}%`
  };
}

function calcularCiclosVida(fecha) {
  let dia, mes, año;

  if (fecha.includes('-')) {
    [año, mes, dia] = fecha.split('-').map(Number);
  } else if (fecha.includes('/')) {
    [dia, mes, año] = fecha.split('/').map(Number);
  }

  const ciclo1 = reducirNumero(mes, false);
  const ciclo2 = reducirNumero(dia, false);
  const ciclo3 = reducirNumero(año, false);

  const edadTransicion1 = 36 - reducirNumero(dia + mes + año, false);
  const edadTransicion2 = edadTransicion1 + 9;

  return [
    {
      nombre: 'Ciclo Formativo',
      numero: ciclo1,
      edades: `0 - ${edadTransicion1} años`,
      descripcion: `Numero ${ciclo1}: ${NUMEROS[ciclo1]?.nombre || 'Energia de base'}`,
      leccion: 'Las lecciones de la infancia y juventud'
    },
    {
      nombre: 'Ciclo Productivo',
      numero: ciclo2,
      edades: `${edadTransicion1} - ${edadTransicion2} años`,
      descripcion: `Numero ${ciclo2}: ${NUMEROS[ciclo2]?.nombre || 'Energia central'}`,
      leccion: 'Las lecciones de la madurez y construccion'
    },
    {
      nombre: 'Ciclo de Cosecha',
      numero: ciclo3,
      edades: `${edadTransicion2}+ años`,
      descripcion: `Numero ${ciclo3}: ${NUMEROS[ciclo3]?.nombre || 'Energia de culminacion'}`,
      leccion: 'Las lecciones de la sabiduria y legado'
    }
  ];
}

function calcularAñoPersonal(fecha) {
  let dia, mes, año;

  if (fecha.includes('-')) {
    [año, mes, dia] = fecha.split('-').map(Number);
  } else if (fecha.includes('/')) {
    [dia, mes, año] = fecha.split('/').map(Number);
  }

  const añoActual = new Date().getFullYear();
  const numeroAño = reducirNumero(dia + mes + añoActual, false);

  const significadosAño = {
    1: { nombre: 'Año de Nuevos Comienzos', descripcion: 'Es momento de iniciar proyectos, sembrar semillas, tomar la iniciativa. Lo que empieces ahora define los proximos 9 años.' },
    2: { nombre: 'Año de Paciencia y Asociaciones', descripcion: 'Tiempo de espera, cooperacion, y desarrollo de relaciones. No fuerces, deja que las cosas maduren.' },
    3: { nombre: 'Año de Expresion Creativa', descripcion: 'Expande tu creatividad, comunica, socializa. Es un año para expresarte y disfrutar la vida.' },
    4: { nombre: 'Año de Trabajo y Cimientos', descripcion: 'Construir bases solidas, trabajar duro, organizar. No es año de grandes cambios sino de consolidacion.' },
    5: { nombre: 'Año de Cambios y Libertad', descripcion: 'Cambios inesperados, viajes, libertad. Flexibilidad es clave. Sal de tu zona de confort.' },
    6: { nombre: 'Año de Hogar y Responsabilidades', descripcion: 'Familia, hogar, responsabilidades. Puede haber matrimonios, divorcios, mudanzas. El amor es central.' },
    7: { nombre: 'Año de Reflexion e Introspeccion', descripcion: 'Tiempo de ir hacia adentro, estudiar, meditar. No es año para accion externa sino para crecimiento interno.' },
    8: { nombre: 'Año de Cosecha Material', descripcion: 'Logros profesionales, dinero, reconocimiento. Lo que sembraste se cosecha. Poder y responsabilidad.' },
    9: { nombre: 'Año de Cierre y Limpieza', descripcion: 'Terminar ciclos, soltar lo viejo, perdonar. Preparacion para el nuevo ciclo de 9 años.' }
  };

  return {
    año: añoActual,
    numero: numeroAño,
    ...significadosAño[numeroAño]
  };
}
