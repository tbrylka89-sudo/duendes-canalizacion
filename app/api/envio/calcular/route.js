// ═══════════════════════════════════════════════════════════════
// API DE CALCULO DE ENVIO - URUGUAY
// ═══════════════════════════════════════════════════════════════

// Tarifas por departamento (en pesos uruguayos)
const TARIFAS_ENVIO = {
  // Montevideo
  montevideo: {
    nombre: 'Montevideo',
    tarifa: 180,
    tiempoEstimado: '1-2 dias habiles',
    zonas: ['Centro', 'Ciudad Vieja', 'Pocitos', 'Carrasco', 'Malvin', 'Buceo', 'Punta Carretas', 'Parque Rodo', 'Cordon', 'La Blanqueada', 'Tres Cruces', 'Prado', 'Aguada', 'La Comercial', 'Goes', 'Union', 'Cerrito', 'Sayago', 'Colon', 'Lezica', 'Cerro', 'La Teja', 'Paso de la Arena', 'Santiago Vazquez', 'Pajas Blancas', 'Manga', 'Piedras Blancas', 'Casavalle', 'Peñarol']
  },

  // Area metropolitana
  canelones: {
    nombre: 'Canelones',
    tarifa: 220,
    tiempoEstimado: '2-3 dias habiles',
    zonas: ['Ciudad de la Costa', 'Las Piedras', 'Pando', 'La Paz', 'Progreso', 'Santa Lucia', 'Canelones ciudad', 'Toledo', 'Solymar', 'Shangrila', 'El Pinar', 'Neptunia', 'Pinamar', 'Salinas', 'Atlantida', 'Parque del Plata', 'La Floresta', 'Costa Azul', 'Marindia', 'Empalme Olmos', 'San Ramon']
  },

  san_jose: {
    nombre: 'San Jose',
    tarifa: 280,
    tiempoEstimado: '2-4 dias habiles',
    zonas: ['San Jose de Mayo', 'Libertad', 'Ciudad del Plata', 'Delta del Tigre', 'Ecilda Paullier', 'Rodriguez', 'Kiyú']
  },

  // Costa
  maldonado: {
    nombre: 'Maldonado',
    tarifa: 320,
    tiempoEstimado: '2-4 dias habiles',
    zonas: ['Maldonado ciudad', 'Punta del Este', 'Piriapolis', 'San Carlos', 'Pan de Azucar', 'Aigua', 'Jose Ignacio', 'La Barra', 'Manantiales', 'Balneario Buenos Aires', 'Ocean Park', 'Pinares', 'Playa Mansa', 'Playa Brava']
  },

  rocha: {
    nombre: 'Rocha',
    tarifa: 350,
    tiempoEstimado: '3-5 dias habiles',
    zonas: ['Rocha ciudad', 'La Paloma', 'La Pedrera', 'Punta del Diablo', 'Cabo Polonio', 'Castillos', 'Chuy', 'Aguas Dulces', 'Barra de Valizas', 'La Coronilla', 'Santa Teresa', 'Lascano']
  },

  // Litoral
  colonia: {
    nombre: 'Colonia',
    tarifa: 300,
    tiempoEstimado: '2-4 dias habiles',
    zonas: ['Colonia del Sacramento', 'Carmelo', 'Juan Lacaze', 'Nueva Helvecia', 'Rosario', 'Nueva Palmira', 'Conchillas', 'Ombues de Lavalle', 'Tarariras']
  },

  soriano: {
    nombre: 'Soriano',
    tarifa: 320,
    tiempoEstimado: '3-5 dias habiles',
    zonas: ['Mercedes', 'Dolores', 'Cardona', 'Palmitas', 'Jose Enrique Rodo', 'Villa Soriano']
  },

  rio_negro: {
    nombre: 'Rio Negro',
    tarifa: 350,
    tiempoEstimado: '3-5 dias habiles',
    zonas: ['Fray Bentos', 'Young', 'San Javier', 'Nuevo Berlin']
  },

  paysandu: {
    nombre: 'Paysandu',
    tarifa: 380,
    tiempoEstimado: '3-5 dias habiles',
    zonas: ['Paysandu ciudad', 'Guichon', 'Quebracho', 'Chapicuy', 'Termas de Guaviyu', 'Termas de Almiron']
  },

  salto: {
    nombre: 'Salto',
    tarifa: 400,
    tiempoEstimado: '4-6 dias habiles',
    zonas: ['Salto ciudad', 'Termas del Dayman', 'Termas de Arapey', 'Constitucion', 'Belen']
  },

  artigas: {
    nombre: 'Artigas',
    tarifa: 450,
    tiempoEstimado: '5-7 dias habiles',
    zonas: ['Artigas ciudad', 'Bella Union', 'Tomas Gomensoro']
  },

  // Centro
  florida: {
    nombre: 'Florida',
    tarifa: 280,
    tiempoEstimado: '2-4 dias habiles',
    zonas: ['Florida ciudad', 'Sarandi Grande', 'Fray Marcos', 'Casupa', '25 de Mayo', '25 de Agosto']
  },

  flores: {
    nombre: 'Flores',
    tarifa: 320,
    tiempoEstimado: '3-5 dias habiles',
    zonas: ['Trinidad', 'Ismael Cortinas']
  },

  durazno: {
    nombre: 'Durazno',
    tarifa: 320,
    tiempoEstimado: '3-5 dias habiles',
    zonas: ['Durazno ciudad', 'Sarandi del Yi', 'Carmen', 'La Paloma']
  },

  // Norte
  tacuarembo: {
    nombre: 'Tacuarembo',
    tarifa: 380,
    tiempoEstimado: '4-6 dias habiles',
    zonas: ['Tacuarembo ciudad', 'Paso de los Toros', 'San Gregorio de Polanco', 'Valle Eden']
  },

  rivera: {
    nombre: 'Rivera',
    tarifa: 420,
    tiempoEstimado: '4-6 dias habiles',
    zonas: ['Rivera ciudad', 'Tranqueras', 'Minas de Corrales', 'Vichadero']
  },

  cerro_largo: {
    nombre: 'Cerro Largo',
    tarifa: 400,
    tiempoEstimado: '4-6 dias habiles',
    zonas: ['Melo', 'Rio Branco', 'Fraile Muerto', 'Acegua', 'Isidoro Noblia']
  },

  treinta_y_tres: {
    nombre: 'Treinta y Tres',
    tarifa: 380,
    tiempoEstimado: '3-5 dias habiles',
    zonas: ['Treinta y Tres ciudad', 'Vergara', 'Santa Clara de Olimar']
  },

  lavalleja: {
    nombre: 'Lavalleja',
    tarifa: 300,
    tiempoEstimado: '2-4 dias habiles',
    zonas: ['Minas', 'Jose Pedro Varela', 'Solis de Mataojo', 'Mariscala', 'Jose Batlle y Ordoñez']
  }
};

// Configuracion de envio gratis
const ENVIO_GRATIS_MINIMO = 3000; // En pesos uruguayos
const RECARGO_PAGO_DESTINO = 50;

export async function POST(request) {
  try {
    const { departamento, localidad, codigoPostal, total } = await request.json();

    // Normalizar departamento
    const deptoNormalizado = normalizarDepartamento(departamento);

    if (!deptoNormalizado || !TARIFAS_ENVIO[deptoNormalizado]) {
      return Response.json({
        success: false,
        error: 'Departamento no reconocido',
        departamentosDisponibles: Object.keys(TARIFAS_ENVIO).map(k => TARIFAS_ENVIO[k].nombre)
      });
    }

    const infoDepto = TARIFAS_ENVIO[deptoNormalizado];
    let costoEnvio = infoDepto.tarifa;
    let envioGratis = false;
    let mensajeEnvio = '';

    // Verificar si aplica envio gratis
    if (total && total >= ENVIO_GRATIS_MINIMO) {
      envioGratis = true;
      costoEnvio = 0;
      mensajeEnvio = 'Envio gratis por compra mayor a $' + ENVIO_GRATIS_MINIMO;
    } else if (total) {
      const faltaParaGratis = ENVIO_GRATIS_MINIMO - total;
      mensajeEnvio = `Agrega $${faltaParaGratis} mas para envio gratis`;
    }

    return Response.json({
      success: true,
      departamento: infoDepto.nombre,
      localidad: localidad || null,
      costoEnvio,
      envioGratis,
      tiempoEstimado: infoDepto.tiempoEstimado,
      mensajeEnvio,
      recargoPagoDestino: RECARGO_PAGO_DESTINO,
      minimoEnvioGratis: ENVIO_GRATIS_MINIMO,
      zonasCobertura: infoDepto.zonas
    });

  } catch (error) {
    console.error('Error calculando envio:', error);
    return Response.json({
      success: false,
      error: error.message
    });
  }
}

// GET - Obtener todas las tarifas y departamentos
export async function GET() {
  const departamentos = Object.entries(TARIFAS_ENVIO).map(([id, info]) => ({
    id,
    nombre: info.nombre,
    tarifa: info.tarifa,
    tiempoEstimado: info.tiempoEstimado,
    zonasCount: info.zonas.length
  }));

  // Ordenar por nombre
  departamentos.sort((a, b) => a.nombre.localeCompare(b.nombre));

  return Response.json({
    success: true,
    departamentos,
    envioGratisMinimo: ENVIO_GRATIS_MINIMO,
    recargoPagoDestino: RECARGO_PAGO_DESTINO
  });
}

// Funcion auxiliar para normalizar nombres de departamento
function normalizarDepartamento(nombre) {
  if (!nombre) return null;

  const normalizado = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9\s]/g, '')
    .trim();

  const mapeo = {
    'montevideo': 'montevideo',
    'canelones': 'canelones',
    'san jose': 'san_jose',
    'san josé': 'san_jose',
    'maldonado': 'maldonado',
    'punta del este': 'maldonado',
    'rocha': 'rocha',
    'colonia': 'colonia',
    'colonia del sacramento': 'colonia',
    'soriano': 'soriano',
    'rio negro': 'rio_negro',
    'río negro': 'rio_negro',
    'paysandu': 'paysandu',
    'paysandú': 'paysandu',
    'salto': 'salto',
    'artigas': 'artigas',
    'florida': 'florida',
    'flores': 'flores',
    'durazno': 'durazno',
    'tacuarembo': 'tacuarembo',
    'tacuarembó': 'tacuarembo',
    'rivera': 'rivera',
    'cerro largo': 'cerro_largo',
    'treinta y tres': 'treinta_y_tres',
    '33': 'treinta_y_tres',
    'lavalleja': 'lavalleja',
    'minas': 'lavalleja'
  };

  // Buscar coincidencia exacta
  if (mapeo[normalizado]) {
    return mapeo[normalizado];
  }

  // Buscar coincidencia parcial
  for (const [clave, valor] of Object.entries(mapeo)) {
    if (normalizado.includes(clave) || clave.includes(normalizado)) {
      return valor;
    }
  }

  return null;
}
