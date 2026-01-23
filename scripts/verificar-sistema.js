#!/usr/bin/env node
/**
 * =========================================================================
 * VERIFICADOR DEL SISTEMA COMPLETO DEL CIRCULO
 * =========================================================================
 *
 * Este script testea todos los endpoints y verifica la integridad del sistema.
 *
 * Uso:
 *   node scripts/verificar-sistema.js [local|prod]
 *
 * =========================================================================
 */

const BASE_URLS = {
  local: 'http://localhost:3000',
  prod: 'https://duendes-vercel.vercel.app'
};

const env = process.argv[2] || 'local';
const BASE_URL = BASE_URLS[env] || BASE_URLS.local;

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) { log(`  [OK] ${message}`, 'green'); }
function error(message) { log(`  [ERROR] ${message}`, 'red'); }
function warn(message) { log(`  [WARN] ${message}`, 'yellow'); }
function info(message) { log(`  ${message}`, 'cyan'); }

// =========================================================================
// TESTS DE ENDPOINTS
// =========================================================================

async function testEndpoint(name, url, options = {}) {
  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const data = await res.json();

    if (res.ok && (data.success !== false)) {
      success(`${name} (${res.status})`);
      return { success: true, data };
    } else {
      error(`${name} (${res.status}): ${data.error || 'Sin mensaje'}`);
      return { success: false, error: data.error };
    }
  } catch (err) {
    error(`${name}: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// =========================================================================
// TESTS POR CATEGORIA
// =========================================================================

async function testDuendeSemana() {
  log('\n1. DUENDE DE LA SEMANA', 'blue');
  log('   ' + '-'.repeat(50));

  const results = [];

  // Test GET publico
  results.push(await testEndpoint(
    'GET /api/circulo/duende-semana',
    `${BASE_URL}/api/circulo/duende-semana`
  ));

  // Test GET admin
  results.push(await testEndpoint(
    'GET /api/admin/duende-semana',
    `${BASE_URL}/api/admin/duende-semana`
  ));

  return results;
}

async function testCursos() {
  log('\n2. SISTEMA DE CURSOS', 'blue');
  log('   ' + '-'.repeat(50));

  const results = [];

  // Test listar cursos
  results.push(await testEndpoint(
    'GET /api/admin/cursos',
    `${BASE_URL}/api/admin/cursos`
  ));

  // Test curso especifico de enero
  results.push(await testEndpoint(
    'GET /api/circulo/cursos/enero-2026',
    `${BASE_URL}/api/circulo/cursos/enero-2026-nuevo-comienzo-magico`
  ));

  return results;
}

async function testLandingPersonalizada() {
  log('\n3. LANDING PERSONALIZADA', 'blue');
  log('   ' + '-'.repeat(50));

  const results = [];

  // Test sin email (visitante nuevo)
  results.push(await testEndpoint(
    'GET /api/circulo/landing-personalizada (visitante)',
    `${BASE_URL}/api/circulo/landing-personalizada`
  ));

  // Test con email
  results.push(await testEndpoint(
    'POST /api/circulo/landing-personalizada (con perfil)',
    `${BASE_URL}/api/circulo/landing-personalizada`,
    {
      method: 'POST',
      body: {
        email: 'test@example.com',
        origen: 'verificacion'
      }
    }
  ));

  return results;
}

async function testWordPress() {
  log('\n4. CONEXION WORDPRESS', 'blue');
  log('   ' + '-'.repeat(50));

  const results = [];

  // Test verificar circulo
  results.push(await testEndpoint(
    'POST /api/wordpress/verificar-circulo',
    `${BASE_URL}/api/wordpress/verificar-circulo`,
    {
      method: 'POST',
      body: {
        email: 'test@example.com'
      }
    }
  ));

  return results;
}

async function testContenido() {
  log('\n5. CONTENIDO DE ENERO', 'blue');
  log('   ' + '-'.repeat(50));

  const results = [];

  // Test contenido adaptativo
  results.push(await testEndpoint(
    'GET /api/circulo/contenido-adaptativo',
    `${BASE_URL}/api/circulo/contenido-adaptativo`
  ));

  return results;
}

async function testComunidad() {
  log('\n6. COMUNIDAD', 'blue');
  log('   ' + '-'.repeat(50));

  const results = [];

  // Test estadisticas de comunidad
  results.push(await testEndpoint(
    'GET /api/admin/comunidad/estadisticas',
    `${BASE_URL}/api/admin/comunidad/estadisticas`
  ));

  return results;
}

async function testKVData() {
  log('\n7. DATOS EN KV', 'blue');
  log('   ' + '-'.repeat(50));

  const keysToCheck = [
    'duende:actual',
    'curso:enero-2026-nuevo-comienzo-magico',
    'contenido:enero-2026:meta',
    'guardianes:enero-2026'
  ];

  const results = [];

  for (const key of keysToCheck) {
    const result = await testEndpoint(
      `KV: ${key}`,
      `${BASE_URL}/api/admin/kv?key=${key}`
    );
    results.push(result);
  }

  return results;
}

// =========================================================================
// EJECUCION PRINCIPAL
// =========================================================================

async function main() {
  console.log('\n' + '='.repeat(60));
  log('  VERIFICADOR DEL SISTEMA - CIRCULO DE DUENDES', 'cyan');
  console.log('='.repeat(60));
  info(`Entorno: ${env.toUpperCase()}`);
  info(`URL: ${BASE_URL}`);
  info(`Fecha: ${new Date().toLocaleString()}`);
  console.log('='.repeat(60));

  const allResults = [];

  try {
    // Ejecutar todos los tests
    allResults.push(...await testDuendeSemana());
    allResults.push(...await testCursos());
    allResults.push(...await testLandingPersonalizada());
    allResults.push(...await testWordPress());
    allResults.push(...await testContenido());
    allResults.push(...await testComunidad());
    allResults.push(...await testKVData());

  } catch (err) {
    error(`Error fatal: ${err.message}`);
  }

  // Resumen
  const exitosos = allResults.filter(r => r.success).length;
  const fallidos = allResults.filter(r => !r.success).length;

  console.log('\n' + '='.repeat(60));
  log('  RESUMEN', 'cyan');
  console.log('='.repeat(60));

  if (fallidos === 0) {
    success(`Todos los tests pasaron (${exitosos}/${allResults.length})`);
  } else {
    warn(`Tests: ${exitosos} OK, ${fallidos} FALLIDOS de ${allResults.length}`);
  }

  console.log('\n' + '='.repeat(60));
  log('  ENDPOINTS DISPONIBLES', 'cyan');
  console.log('='.repeat(60));

  const endpoints = [
    { path: '/api/circulo/duende-semana', desc: 'Duende de la semana actual' },
    { path: '/api/circulo/cursos/[id]', desc: 'Detalle de un curso' },
    { path: '/api/circulo/landing-personalizada', desc: 'Landing adaptativa' },
    { path: '/api/circulo/contenido-adaptativo', desc: 'Contenido segun perfil' },
    { path: '/api/wordpress/verificar-circulo', desc: 'Verificar acceso desde WP' },
    { path: '/api/admin/duende-semana', desc: 'Admin duende semana' },
    { path: '/api/admin/cursos', desc: 'Admin cursos' },
    { path: '/api/admin/comunidad/estadisticas', desc: 'Stats comunidad' }
  ];

  endpoints.forEach(ep => {
    console.log(`  ${ep.path}`);
    console.log(`    -> ${ep.desc}`);
  });

  console.log('\n' + '='.repeat(60));
  log('  CRONS CONFIGURADOS', 'cyan');
  console.log('='.repeat(60));

  const crons = [
    { path: '/api/cron/actividad-diaria', schedule: '0 8 * * *', desc: 'Actividad diaria (8 AM)' },
    { path: '/api/cron/duende-semana-rotacion', schedule: '0 0 * * 1', desc: 'Rotacion duende (Lunes 00:00)' },
    { path: '/api/cron/recordatorio-racha', schedule: '0 20 * * *', desc: 'Recordatorio racha (20:00)' },
    { path: '/api/cron/guardian-intelligence', schedule: '0 10 * * *', desc: 'Guardian Intelligence (10:00)' }
  ];

  crons.forEach(c => {
    console.log(`  ${c.path}`);
    console.log(`    -> ${c.schedule} | ${c.desc}`);
  });

  console.log('\n' + '='.repeat(60));

  if (fallidos > 0) {
    console.log('\n');
    warn('Algunos tests fallaron. Revisar los errores arriba.');
    process.exit(1);
  } else {
    log('\n  Sistema verificado correctamente!\n', 'green');
    process.exit(0);
  }
}

main().catch(err => {
  error(`Error fatal: ${err.message}`);
  process.exit(1);
});
