import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// PERFIL DEL MIEMBRO DEL CÍRCULO
// Guardar y recuperar datos del onboarding y preferencias
// ═══════════════════════════════════════════════════════════════════════════════

// GET - Obtener perfil
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email')?.toLowerCase();

    if (!email) {
      return Response.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    const perfil = await kv.get(`circulo:perfil:${email}`);

    if (!perfil) {
      return Response.json({
        success: true,
        existe: false,
        perfil: null
      });
    }

    // Calcular datos derivados
    const datosDerivados = calcularDatosDerivados(perfil);

    return Response.json({
      success: true,
      existe: true,
      perfil: {
        ...perfil,
        ...datosDerivados
      }
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Guardar/actualizar perfil
export async function POST(request) {
  try {
    const { email, perfil } = await request.json();

    if (!email) {
      return Response.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    const emailLower = email.toLowerCase();

    // Obtener perfil existente si hay
    const perfilExistente = await kv.get(`circulo:perfil:${emailLower}`) || {};

    // Calcular el perfil de cliente (poder adquisitivo, engagement, etc.)
    const perfilCliente = calcularPerfilCliente(perfil);

    // Combinar datos
    const perfilCompleto = {
      ...perfilExistente,
      ...perfil,
      perfilCliente,
      ultimaActualizacion: new Date().toISOString()
    };

    // Guardar
    await kv.set(`circulo:perfil:${emailLower}`, perfilCompleto);

    // También actualizar datos en circulo:{email}
    const circuloData = await kv.get(`circulo:${emailLower}`);
    if (circuloData) {
      await kv.set(`circulo:${emailLower}`, {
        ...circuloData,
        nombrePreferido: perfil.nombrePreferido,
        pronombres: perfil.pronombres,
        onboardingCompletado: true
      });
    }

    return Response.json({
      success: true,
      perfil: perfilCompleto
    });

  } catch (error) {
    console.error('Error guardando perfil:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE ANÁLISIS DE PERFIL
// ═══════════════════════════════════════════════════════════════════════════════

function calcularPerfilCliente(perfil) {
  let score = {
    poderAdquisitivo: 0,
    engagement: 0,
    madurezEspiritual: 0,
    potencialCompra: 0
  };

  // PODER ADQUISITIVO
  const guardianes = perfil.guardiansAdoptados;
  if (guardianes === '0') score.poderAdquisitivo += 10;
  else if (guardianes === '1-3') score.poderAdquisitivo += 30;
  else if (guardianes === '4-10') score.poderAdquisitivo += 60;
  else if (guardianes === 'mas-10') score.poderAdquisitivo += 90;

  const cristales = perfil.coleccionCristales;
  if (cristales === 'no') score.poderAdquisitivo += 0;
  else if (cristales === 'algunos') score.poderAdquisitivo += 15;
  else if (cristales === 'coleccion') score.poderAdquisitivo += 35;
  else if (cristales === 'apasionado') score.poderAdquisitivo += 50;

  const cursos = perfil.cursosAnteriores;
  if (cursos === 'no') score.poderAdquisitivo += 0;
  else if (cursos === 'gratis') score.poderAdquisitivo += 10;
  else if (cursos === 'pagos') score.poderAdquisitivo += 30;
  else if (cursos === 'presencial') score.poderAdquisitivo += 45;
  else if (cursos === 'varios') score.poderAdquisitivo += 55;

  score.poderAdquisitivo = Math.min(100, score.poderAdquisitivo);

  // ENGAGEMENT
  const practica = perfil.practicaEspiritual;
  if (practica === 'nunca') score.engagement += 20;
  else if (practica === 'ocasional') score.engagement += 40;
  else if (practica === 'regular') score.engagement += 70;
  else if (practica === 'diario') score.engagement += 95;

  const areasCount = (perfil.areasInteres || []).length;
  score.engagement += areasCount * 8;

  const tipoCount = (perfil.tipoContenido || []).length;
  score.engagement += tipoCount * 10;

  score.engagement = Math.min(100, score.engagement);

  // MADUREZ ESPIRITUAL
  if (practica === 'nunca') score.madurezEspiritual += 15;
  else if (practica === 'ocasional') score.madurezEspiritual += 35;
  else if (practica === 'regular') score.madurezEspiritual += 65;
  else if (practica === 'diario') score.madurezEspiritual += 85;

  if (cursos === 'varios') score.madurezEspiritual += 30;
  else if (cursos === 'presencial') score.madurezEspiritual += 25;
  else if (cursos === 'pagos') score.madurezEspiritual += 15;

  score.madurezEspiritual = Math.min(100, score.madurezEspiritual);

  // POTENCIAL DE COMPRA
  score.potencialCompra = Math.round(
    (score.poderAdquisitivo * 0.5) +
    (score.engagement * 0.3) +
    (score.madurezEspiritual * 0.2)
  );

  // Determinar segmento
  let segmento = 'explorador';
  if (score.potencialCompra >= 70) segmento = 'vip';
  else if (score.potencialCompra >= 50) segmento = 'comprometido';
  else if (score.potencialCompra >= 30) segmento = 'interesado';

  return {
    scores: score,
    segmento,
    recomendaciones: generarRecomendaciones(perfil, score)
  };
}

function generarRecomendaciones(perfil, scores) {
  const recs = [];

  const areas = perfil.areasInteres || [];
  if (areas.includes('abundancia')) recs.push('guardianes-abundancia');
  if (areas.includes('proteccion')) recs.push('guardianes-proteccion');
  if (areas.includes('amor')) recs.push('rituales-amor');
  if (areas.includes('sanacion')) recs.push('cristales-sanacion');

  if (scores.poderAdquisitivo >= 60) {
    recs.push('colecciones-exclusivas');
    recs.push('canalizaciones-premium');
  }

  if (perfil.practicaEspiritual === 'diario') {
    recs.push('rituales-avanzados');
  } else if (perfil.practicaEspiritual === 'nunca') {
    recs.push('guia-principiantes');
  }

  return recs;
}

function calcularDatosDerivados(perfil) {
  const datos = {};

  if (perfil.fechaNacimiento) {
    datos.signoZodiacal = calcularSigno(perfil.fechaNacimiento);
    datos.numeroVida = calcularNumeroVida(perfil.fechaNacimiento);
  }

  return datos;
}

function calcularSigno(fecha) {
  const [año, mes, dia] = fecha.split('-').map(Number);
  const signos = [
    { nombre: 'Capricornio', inicio: [12, 22], fin: [1, 19] },
    { nombre: 'Acuario', inicio: [1, 20], fin: [2, 18] },
    { nombre: 'Piscis', inicio: [2, 19], fin: [3, 20] },
    { nombre: 'Aries', inicio: [3, 21], fin: [4, 19] },
    { nombre: 'Tauro', inicio: [4, 20], fin: [5, 20] },
    { nombre: 'Géminis', inicio: [5, 21], fin: [6, 20] },
    { nombre: 'Cáncer', inicio: [6, 21], fin: [7, 22] },
    { nombre: 'Leo', inicio: [7, 23], fin: [8, 22] },
    { nombre: 'Virgo', inicio: [8, 23], fin: [9, 22] },
    { nombre: 'Libra', inicio: [9, 23], fin: [10, 22] },
    { nombre: 'Escorpio', inicio: [10, 23], fin: [11, 21] },
    { nombre: 'Sagitario', inicio: [11, 22], fin: [12, 21] }
  ];

  for (const signo of signos) {
    const [mesInicio, diaInicio] = signo.inicio;
    const [mesFin, diaFin] = signo.fin;

    if (
      (mes === mesInicio && dia >= diaInicio) ||
      (mes === mesFin && dia <= diaFin)
    ) {
      return signo.nombre;
    }
  }

  return 'Capricornio';
}

function calcularNumeroVida(fecha) {
  const digitos = fecha.replace(/-/g, '').split('').map(Number);
  let suma = digitos.reduce((a, b) => a + b, 0);

  while (suma > 9 && suma !== 11 && suma !== 22 && suma !== 33) {
    suma = suma.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }

  return suma;
}
