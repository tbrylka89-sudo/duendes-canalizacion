import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// CRON: ROTACIÓN DE DUENDE DE LA SEMANA
// Se ejecuta cada lunes a las 00:00 (schedule: "0 0 * * 1")
// Activa automáticamente el duende programado para la semana actual
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

// Keys de Vercel KV
const KEYS = {
  actual: 'duende-semana:actual',
  historial: 'duende-semana:historial'
};

export async function GET(request) {
  // Verificar que es llamado por Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.VERCEL_ENV === 'production') {
    // En producción, solo permitir con CRON_SECRET o sin auth si no está configurado
    if (process.env.CRON_SECRET) {
      console.log('[DUENDE-ROTACION] Acceso no autorizado');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    console.log('[DUENDE-ROTACION] Iniciando rotación semanal...');

    const ahora = new Date();
    const semanaKey = calcularSemanaKey(ahora);

    console.log(`[DUENDE-ROTACION] Buscando duende para semana: ${semanaKey}`);

    // Buscar duende programado para esta semana
    let duendeProgramado = await kv.get(`duende-semana:${semanaKey}`);

    // Si no hay programado, buscar uno aleatorio
    if (!duendeProgramado) {
      console.log('[DUENDE-ROTACION] No hay duende programado, seleccionando aleatorio...');
      duendeProgramado = await seleccionarDuendeAleatorio();

      if (!duendeProgramado) {
        console.log('[DUENDE-ROTACION] No hay duendes disponibles');
        return Response.json({
          success: false,
          error: 'No hay duendes disponibles para rotación',
          semanaKey,
          timestamp: ahora.toISOString()
        });
      }

      // Completar datos de semana
      const { inicioSemana, finSemana } = calcularFechasSemana(ahora);
      duendeProgramado.fechaInicio = inicioSemana.toISOString();
      duendeProgramado.fechaFin = finSemana.toISOString();
      duendeProgramado.semanaKey = semanaKey;
      duendeProgramado.seleccionadoAutomaticamente = true;
      duendeProgramado.seleccionadoEn = ahora.toISOString();

      // Guardar en key de semana
      await kv.set(`duende-semana:${semanaKey}`, duendeProgramado);
    }

    // Guardar duende anterior en historial
    const duendeAnterior = await kv.get(KEYS.actual);
    if (duendeAnterior && duendeAnterior.duendeId !== duendeProgramado.duendeId) {
      const historial = await kv.get(KEYS.historial) || [];
      historial.unshift({
        ...duendeAnterior,
        fechaFin: ahora.toISOString(),
        rotadoPorCron: true
      });
      await kv.set(KEYS.historial, historial.slice(0, 50));
      console.log(`[DUENDE-ROTACION] Duende anterior ${duendeAnterior.nombre} movido a historial`);
    }

    // Activar el nuevo duende
    duendeProgramado.activadoEn = ahora.toISOString();
    duendeProgramado.activadoPorCron = true;
    await kv.set(KEYS.actual, duendeProgramado);

    console.log(`[DUENDE-ROTACION] ${duendeProgramado.nombre} activado como Duende de la Semana`);

    return Response.json({
      success: true,
      mensaje: `${duendeProgramado.nombre} es el nuevo Duende de la Semana`,
      duende: {
        nombre: duendeProgramado.nombre,
        categoria: duendeProgramado.categoria,
        imagen: duendeProgramado.imagen
      },
      semanaKey,
      fueAleatorio: duendeProgramado.seleccionadoAutomaticamente || false,
      timestamp: ahora.toISOString()
    });

  } catch (error) {
    console.error('[DUENDE-ROTACION] Error:', error);
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════

function calcularSemanaKey(fecha) {
  const d = new Date(fecha);
  const año = d.getFullYear();
  const mes = d.getMonth() + 1;

  // Calcular número de semana del mes
  const primerDia = new Date(año, mes - 1, 1);
  const diasHastaPrimerLunes = (8 - primerDia.getDay()) % 7;
  const primerLunes = new Date(año, mes - 1, 1 + diasHastaPrimerLunes);

  let numSemana;
  if (d < primerLunes) {
    numSemana = 1;
  } else {
    const diasDesde = Math.floor((d - primerLunes) / (7 * 24 * 60 * 60 * 1000));
    numSemana = Math.floor(diasDesde / 7) + 2;
  }

  return `${año}-${String(mes).padStart(2, '0')}-S${numSemana}`;
}

function calcularFechasSemana(fecha) {
  const hoy = new Date(fecha);
  const diaSemana = hoy.getDay();

  // Inicio de semana (lunes)
  const inicioSemana = new Date(hoy);
  const diasHastaLunes = diaSemana === 0 ? 6 : diaSemana - 1;
  inicioSemana.setDate(hoy.getDate() - diasHastaLunes);
  inicioSemana.setHours(0, 0, 0, 0);

  // Fin de semana (domingo)
  const finSemana = new Date(inicioSemana);
  finSemana.setDate(inicioSemana.getDate() + 6);
  finSemana.setHours(23, 59, 59, 999);

  return { inicioSemana, finSemana };
}

async function seleccionarDuendeAleatorio() {
  // Obtener catálogo de productos
  const productos = await kv.get('productos:catalogo') || [];

  // Obtener historial para evitar repetir recientes
  const historial = await kv.get(KEYS.historial) || [];
  const idsRecientes = historial.slice(0, 8).map(d => d.duendeId);

  // Filtrar disponibles
  let disponibles = productos.filter(p =>
    p.imagen &&
    p.estado === 'publish' &&
    !idsRecientes.includes(p.id)
  );

  // Si no hay disponibles sin repetir, usar todos
  if (disponibles.length === 0) {
    disponibles = productos.filter(p => p.imagen && p.estado === 'publish');
  }

  if (disponibles.length === 0) {
    return null;
  }

  // Seleccionar aleatorio
  const seleccionado = disponibles[Math.floor(Math.random() * disponibles.length)];

  return {
    duendeId: seleccionado.id,
    nombre: seleccionado.guardian || seleccionado.nombre?.split(' - ')[0] || seleccionado.nombre,
    nombreCompleto: seleccionado.nombre,
    imagen: seleccionado.imagen,
    categoria: seleccionado.categoria,
    descripcion: seleccionado.descripcion,
    cristales: seleccionado.cristales || [],
    proposito: extraerProposito(seleccionado.categoria),
    elemento: extraerElemento(seleccionado.categoria)
  };
}

function extraerProposito(categoria) {
  const propositos = {
    'Protección': 'Proteger y crear espacios seguros',
    'Abundancia': 'Atraer prosperidad y oportunidades',
    'Amor': 'Abrir el corazón y sanar vínculos',
    'Sanación': 'Sanar heridas del alma y el cuerpo',
    'Salud': 'Equilibrar energías y promover bienestar',
    'Sabiduría': 'Guiar con conocimiento y claridad'
  };
  return propositos[categoria] || 'Acompañar en el camino';
}

function extraerElemento(categoria) {
  const elementos = {
    'Protección': 'tierra',
    'Abundancia': 'fuego',
    'Amor': 'agua',
    'Sanación': 'agua',
    'Salud': 'aire',
    'Sabiduría': 'aire'
  };
  return elementos[categoria] || 'tierra';
}
