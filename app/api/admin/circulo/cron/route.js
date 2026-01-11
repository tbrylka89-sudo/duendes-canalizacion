import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// ═══════════════════════════════════════════════════════════════
// CRON JOB PARA AUTOMATIZACIÓN DE EL CÍRCULO
// Ejecutar diariamente para: publicar contenido, enviar regalos
// ═══════════════════════════════════════════════════════════════

const FECHAS_ESPECIALES = {
  '02-02': { nombre: 'Imbolc', tipo: 'sabbat', regalo: 'lectura' },
  '03-20': { nombre: 'Ostara', tipo: 'sabbat', regalo: 'runas' },
  '05-01': { nombre: 'Beltane', tipo: 'sabbat', regalo: 'treboles' },
  '06-21': { nombre: 'Litha', tipo: 'sabbat', regalo: 'meditacion' },
  '08-01': { nombre: 'Lammas', tipo: 'sabbat', regalo: 'treboles' },
  '09-22': { nombre: 'Mabon', tipo: 'sabbat', regalo: 'runas' },
  '10-31': { nombre: 'Samhain', tipo: 'sabbat', regalo: 'lectura' },
  '12-21': { nombre: 'Yule', tipo: 'sabbat', regalo: 'lectura' },
};

// Calcular fase lunar
function calcularFaseLunar(fecha) {
  const conocido = new Date('2024-01-11'); // Luna nueva conocida
  const ciclo = 29.53059;
  const diff = (fecha - conocido) / (1000 * 60 * 60 * 24);
  const fase = ((diff % ciclo) + ciclo) % ciclo;

  if (fase < 1.85) return 'nueva';
  if (fase < 7.38) return 'creciente';
  if (fase < 9.23) return 'cuarto-creciente';
  if (fase < 14.77) return 'gibosa-creciente';
  if (fase < 16.61) return 'llena';
  if (fase < 22.15) return 'gibosa-menguante';
  if (fase < 23.99) return 'cuarto-menguante';
  if (fase < 27.68) return 'menguante';
  return 'nueva';
}

async function obtenerMiembrosActivos() {
  const circuloKeys = await kv.keys('circulo:*');
  const miembros = [];

  for (const key of circuloKeys) {
    if (key.includes(':contenido:') || key.includes(':indice:') || key.includes(':config') || key.includes(':regalo:') || key.includes(':regalos:')) {
      continue;
    }

    try {
      const data = await kv.get(key);
      if (data?.activo) {
        const email = key.replace('circulo:', '');
        miembros.push({ email, ...data });
      }
    } catch (e) {}
  }

  return miembros;
}

async function enviarRegaloATodos(tipo, motivo) {
  const miembros = await obtenerMiembrosActivos();
  let exitosos = 0;

  const cantidades = {
    lectura: 1,
    runas: 10,
    treboles: 25,
    meditacion: 1,
    ritual: 1
  };

  for (const miembro of miembros) {
    try {
      let userData = await kv.get(`user:${miembro.email}`);
      let userKey = `user:${miembro.email}`;

      if (!userData) {
        userData = await kv.get(`elegido:${miembro.email}`);
        userKey = `elegido:${miembro.email}`;
      }

      if (!userData) continue;

      if (tipo === 'lectura') userData.lecturaGratis = (userData.lecturaGratis || 0) + 1;
      else if (tipo === 'runas') userData.runas = (userData.runas || 0) + cantidades.runas;
      else if (tipo === 'treboles') userData.treboles = (userData.treboles || 0) + cantidades.treboles;
      else if (tipo === 'meditacion') userData.meditacionExclusiva = (userData.meditacionExclusiva || 0) + 1;

      if (!userData.historialRegalos) userData.historialRegalos = [];
      userData.historialRegalos.push({
        tipo,
        cantidad: cantidades[tipo] || 1,
        motivo,
        fecha: new Date().toISOString(),
        automatico: true
      });

      await kv.set(userKey, userData);
      exitosos++;
    } catch (e) {}
  }

  return exitosos;
}

export async function GET(request) {
  // Verificar autorización (cron secret o desde admin)
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET && !request.headers.get('referer')?.includes('/admin')) {
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const config = await kv.get('circulo:config:automatizacion') || {
      autoPublicar: true,
      regaloLunaLlena: true,
      regalosSabbats: true
    };

    const ahora = new Date();
    const hoy = `${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;
    const dia = ahora.getDate();
    const mes = ahora.getMonth() + 1;
    const año = ahora.getFullYear();

    const acciones = [];

    // 1. Auto-publicar contenido del día
    if (config.autoPublicar) {
      const contenido = await kv.get(`circulo:contenido:${año}:${mes}:${dia}`);
      if (contenido && contenido.estado === 'borrador') {
        contenido.estado = 'publicado';
        contenido.publicadoEn = ahora.toISOString();
        await kv.set(`circulo:contenido:${año}:${mes}:${dia}`, contenido);
        acciones.push({ tipo: 'publicacion', contenido: contenido.titulo });
      }
    }

    // 2. Regalos en Sabbats
    if (config.regalosSabbats && FECHAS_ESPECIALES[hoy]) {
      const especial = FECHAS_ESPECIALES[hoy];
      const exitosos = await enviarRegaloATodos(especial.regalo, `Regalo de ${especial.nombre}`);
      acciones.push({
        tipo: 'regalo_sabbat',
        sabbat: especial.nombre,
        regalo: especial.regalo,
        miembros: exitosos
      });
    }

    // 3. Regalos en Luna Llena
    if (config.regaloLunaLlena) {
      const fase = calcularFaseLunar(ahora);
      if (fase === 'llena') {
        // Verificar si ya se envió hoy
        const yaEnviado = await kv.get(`circulo:regalo-luna:${año}:${mes}:${dia}`);
        if (!yaEnviado) {
          const exitosos = await enviarRegaloATodos('runas', 'Regalo de Luna Llena');
          await kv.set(`circulo:regalo-luna:${año}:${mes}:${dia}`, true);
          acciones.push({
            tipo: 'regalo_luna_llena',
            miembros: exitosos
          });
        }
      }
    }

    // Registrar ejecución
    await kv.set(`circulo:cron:${año}:${mes}:${dia}`, {
      ejecutadoEn: ahora.toISOString(),
      acciones
    });

    return Response.json({
      success: true,
      fecha: ahora.toISOString(),
      acciones
    });

  } catch (error) {
    console.error('Error cron:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
