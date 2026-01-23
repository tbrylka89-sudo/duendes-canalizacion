#!/usr/bin/env node
/**
 * Script para insertar contenido de enero 2026 en Vercel KV
 *
 * Uso:
 *   node scripts/seed-contenido-enero.js [local|prod]
 *
 * El contenido se guarda con keys del formato:
 *   contenido:2026-01-01
 *   contenido:2026-01-03
 *   etc.
 *
 * También guarda metadata en:
 *   contenido:enero-2026:meta
 *   guardianes:enero-2026
 */

import { CONTENIDO_ENERO_2026, GUARDIANES_ENERO_2026 } from '../lib/contenido/enero-2026.js';

const BASE_URLS = {
  local: 'http://localhost:3000',
  prod: 'https://duendes-vercel.vercel.app'
};

const env = process.argv[2] || 'local';
const BASE_URL = BASE_URLS[env] || BASE_URLS.local;

console.log(`
═══════════════════════════════════════════════════════════════
  SEED: CONTENIDO DEL CÍRCULO - ENERO 2026
  Portal de Litha (verano, fuego, abundancia)
═══════════════════════════════════════════════════════════════

Entorno: ${env.toUpperCase()}
URL: ${BASE_URL}
Contenidos a insertar: ${CONTENIDO_ENERO_2026.length}
`);

// ═══════════════════════════════════════════════════════════════
// FUNCIONES DE UTILIDAD
// ═══════════════════════════════════════════════════════════════

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setKV(key, value) {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/kv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'set', key, value })
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error(`    Error en ${key}: ${error.message}`);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// INSERCIÓN DE CONTENIDO
// ═══════════════════════════════════════════════════════════════

async function insertarContenidos() {
  console.log('Insertando contenidos...\n');

  let exitos = 0;
  let errores = 0;

  for (const contenido of CONTENIDO_ENERO_2026) {
    const key = `contenido:${contenido.fecha}`;
    const tipoLabel = contenido.tipo.charAt(0).toUpperCase() + contenido.tipo.slice(1);

    process.stdout.write(`  [${contenido.fecha}] ${tipoLabel}: ${contenido.titulo.substring(0, 35)}...`);

    // Preparar el objeto completo para KV
    const dataParaKV = {
      ...contenido,
      fechaCreacion: new Date().toISOString(),
      estado: 'publicado',
      portal: 'litha',
      mes: 'enero',
      anio: 2026
    };

    const success = await setKV(key, dataParaKV);

    if (success) {
      console.log(' OK');
      exitos++;
    } else {
      console.log(' ERROR');
      errores++;
    }

    await sleep(200);
  }

  return { exitos, errores };
}

// ═══════════════════════════════════════════════════════════════
// INSERCIÓN DE GUARDIANES
// ═══════════════════════════════════════════════════════════════

async function insertarGuardianes() {
  console.log('\nInsertando guardianes del mes...\n');

  // Guardar todos los guardianes juntos
  const key = 'guardianes:enero-2026';
  process.stdout.write(`  [${key}] Guardianes de enero 2026...`);

  const success = await setKV(key, {
    mes: 'enero',
    anio: 2026,
    portal: 'litha',
    guardianes: GUARDIANES_ENERO_2026,
    fechaCreacion: new Date().toISOString()
  });

  if (success) {
    console.log(' OK');
  } else {
    console.log(' ERROR');
  }

  // Guardar cada guardián individualmente
  for (const [semana, guardian] of Object.entries(GUARDIANES_ENERO_2026)) {
    const guardianKey = `guardian:${guardian.id}`;
    process.stdout.write(`  [${guardianKey}] ${guardian.nombre}...`);

    const guardianData = {
      ...guardian,
      semana: parseInt(semana.replace('semana', '')),
      mes: 'enero',
      anio: 2026,
      fechaCreacion: new Date().toISOString()
    };

    const guardianSuccess = await setKV(guardianKey, guardianData);

    if (guardianSuccess) {
      console.log(' OK');
    } else {
      console.log(' ERROR');
    }

    await sleep(100);
  }
}

// ═══════════════════════════════════════════════════════════════
// INSERCIÓN DE METADATA
// ═══════════════════════════════════════════════════════════════

async function insertarMetadata() {
  console.log('\nInsertando metadata...\n');

  // Metadata del mes
  const metaKey = 'contenido:enero-2026:meta';
  process.stdout.write(`  [${metaKey}]...`);

  const metadata = {
    mes: 'enero',
    anio: 2026,
    portal: 'litha',
    tema: 'Verano, fuego, abundancia',
    totalContenidos: CONTENIDO_ENERO_2026.length,
    fechas: CONTENIDO_ENERO_2026.map(c => c.fecha),
    semanas: [
      {
        numero: 1,
        guardian: 'Dorado',
        categoria: 'Abundancia',
        tema: 'Nuevo año, nuevas intenciones',
        fechas: ['2026-01-01', '2026-01-03', '2026-01-05']
      },
      {
        numero: 2,
        guardian: 'Obsidiana',
        categoria: 'Protección',
        tema: 'Limpiar energías del año pasado',
        fechas: ['2026-01-08', '2026-01-10', '2026-01-12']
      },
      {
        numero: 3,
        guardian: 'Índigo',
        categoria: 'Sabiduría',
        tema: 'Claridad y propósito',
        fechas: ['2026-01-15', '2026-01-17', '2026-01-19']
      },
      {
        numero: 4,
        guardian: 'Jade',
        categoria: 'Sanación',
        tema: 'Soltar el pasado',
        fechas: ['2026-01-22', '2026-01-24', '2026-01-26']
      }
    ],
    tipos: {
      presentacion: CONTENIDO_ENERO_2026.filter(c => c.tipo === 'presentacion').length,
      ensenanza: CONTENIDO_ENERO_2026.filter(c => c.tipo === 'ensenanza').length,
      ritual: CONTENIDO_ENERO_2026.filter(c => c.tipo === 'ritual').length
    },
    fechaCreacion: new Date().toISOString()
  };

  const success = await setKV(metaKey, metadata);

  if (success) {
    console.log(' OK');
  } else {
    console.log(' ERROR');
  }

  // Índice de contenido del círculo
  const indexKey = 'circulo:contenido:index';
  process.stdout.write(`  [${indexKey}]...`);

  // Obtener índice existente o crear nuevo
  let existingIndex = [];
  try {
    const res = await fetch(`${BASE_URL}/api/admin/kv?key=${indexKey}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.value) {
        existingIndex = data.value;
      }
    }
  } catch (e) {
    // Si no existe, empezamos con array vacío
  }

  // Agregar las nuevas fechas si no existen
  const nuevasFechas = CONTENIDO_ENERO_2026.map(c => c.fecha);
  const indexActualizado = [...new Set([...existingIndex, ...nuevasFechas])].sort();

  const indexSuccess = await setKV(indexKey, indexActualizado);

  if (indexSuccess) {
    console.log(' OK');
  } else {
    console.log(' ERROR');
  }
}

// ═══════════════════════════════════════════════════════════════
// VERIFICACIÓN
// ═══════════════════════════════════════════════════════════════

async function verificarInsercion() {
  console.log('\nVerificando inserción...\n');

  let verificados = 0;
  let fallidos = 0;

  // Verificar algunos contenidos al azar
  const fechasVerificar = ['2026-01-01', '2026-01-12', '2026-01-26'];

  for (const fecha of fechasVerificar) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/kv?key=contenido:${fecha}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.value && data.value.titulo) {
          console.log(`  [contenido:${fecha}] OK - "${data.value.titulo.substring(0, 30)}..."`);
          verificados++;
        } else {
          console.log(`  [contenido:${fecha}] ERROR - Datos incompletos`);
          fallidos++;
        }
      } else {
        console.log(`  [contenido:${fecha}] ERROR - HTTP ${res.status}`);
        fallidos++;
      }
    } catch (e) {
      console.log(`  [contenido:${fecha}] ERROR - ${e.message}`);
      fallidos++;
    }
  }

  return { verificados, fallidos };
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  const inicio = Date.now();

  try {
    // Insertar contenidos
    const resultadoContenidos = await insertarContenidos();

    // Insertar guardianes
    await insertarGuardianes();

    // Insertar metadata
    await insertarMetadata();

    // Verificar
    const resultadoVerificacion = await verificarInsercion();

    // Resumen final
    const duracion = ((Date.now() - inicio) / 1000).toFixed(2);

    console.log(`
═══════════════════════════════════════════════════════════════
  RESUMEN
═══════════════════════════════════════════════════════════════

  Contenidos insertados: ${resultadoContenidos.exitos}/${CONTENIDO_ENERO_2026.length}
  Contenidos con error: ${resultadoContenidos.errores}
  Verificación: ${resultadoVerificacion.verificados} OK, ${resultadoVerificacion.fallidos} fallidos

  Guardianes: 4 (Dorado, Obsidiana, Índigo, Jade)

  Semana 1: Abundancia - Nuevo año, nuevas intenciones
  Semana 2: Protección - Limpiar energías del año pasado
  Semana 3: Sabiduría - Claridad y propósito
  Semana 4: Sanación - Soltar el pasado

  Tiempo total: ${duracion}s

═══════════════════════════════════════════════════════════════

  Keys creadas:
  - contenido:2026-01-XX (12 contenidos)
  - guardianes:enero-2026
  - guardian:abundancia-dorado
  - guardian:proteccion-obsidiana
  - guardian:sabiduria-indigo
  - guardian:sanacion-jade
  - contenido:enero-2026:meta
  - circulo:contenido:index (actualizado)

═══════════════════════════════════════════════════════════════
`);

    if (resultadoContenidos.errores > 0 || resultadoVerificacion.fallidos > 0) {
      console.log('  ADVERTENCIA: Hubo errores durante la inserción.');
      console.log('  Verificá la conexión con la API o la configuración de KV.');
      process.exit(1);
    }

  } catch (error) {
    console.error('\nError fatal:', error.message);
    process.exit(1);
  }
}

main();
