#!/usr/bin/env node
/**
 * Script de prueba para el webhook de WooCommerce
 * Simula compras de runas y membresías
 *
 * Uso:
 *   node scripts/test-webhook-runas.js [local|prod]
 *
 * Ejemplos:
 *   node scripts/test-webhook-runas.js local   # Prueba en localhost:3000
 *   node scripts/test-webhook-runas.js prod    # Prueba en Vercel
 */

const BASE_URLS = {
  local: 'http://localhost:3000',
  prod: 'https://duendes-vercel.vercel.app'
};

const env = process.argv[2] || 'local';
const BASE_URL = BASE_URLS[env] || BASE_URLS.local;

console.log(`\n🧪 Testing webhook at: ${BASE_URL}/api/webhooks/woocommerce\n`);

// ═══════════════════════════════════════════════════════════════
// PAYLOADS DE PRUEBA
// ═══════════════════════════════════════════════════════════════

const TESTS = [
  {
    name: '1. Compra de Paquete Destello (80 runas + 10 bonus)',
    payload: {
      id: 10001,
      status: 'completed',
      total: '10.00',
      billing: {
        email: 'test-runas@duendes.test',
        first_name: 'Test Runas'
      },
      line_items: [
        {
          product_id: 101,
          name: 'Paquete Destello - 80 Runas',
          sku: 'RUNAS-80',
          slug: 'paquete-runas-80',
          quantity: 1,
          total: '10.00',
          meta_data: []
        }
      ]
    }
  },
  {
    name: '2. Compra de Paquete Aurora (1200 runas + 400 bonus)',
    payload: {
      id: 10002,
      status: 'completed',
      total: '100.00',
      billing: {
        email: 'test-runas@duendes.test',
        first_name: 'Test Runas'
      },
      line_items: [
        {
          product_id: 105,
          name: 'Paquete Aurora - 1200 Runas',
          sku: 'RUNAS-1200',
          slug: 'paquete-runas-1200',
          quantity: 1,
          total: '100.00',
          meta_data: []
        }
      ]
    }
  },
  {
    name: '3. Compra de Membresía Mensual del Círculo',
    payload: {
      id: 10003,
      status: 'completed',
      total: '15.00',
      billing: {
        email: 'test-circulo@duendes.test',
        first_name: 'Test Círculo'
      },
      line_items: [
        {
          product_id: 201,
          name: 'Círculo Mensual',
          sku: 'CIRCULO-1M',
          slug: 'circulo-mensual',
          quantity: 1,
          total: '15.00',
          meta_data: [{ key: '_category_slugs', value: ['membresias'] }]
        }
      ]
    }
  },
  {
    name: '4. Compra combinada: Runas + Membresía Anual',
    payload: {
      id: 10004,
      status: 'completed',
      total: '130.00',
      billing: {
        email: 'test-combo@duendes.test',
        first_name: 'Test Combo'
      },
      line_items: [
        {
          product_id: 103,
          name: 'Paquete Resplandor - 200 Runas',
          sku: 'RUNAS-200',
          slug: 'paquete-runas-200',
          quantity: 2,
          total: '40.00',
          meta_data: []
        },
        {
          product_id: 203,
          name: 'Año del Guardián - Membresía Anual',
          sku: 'CIRCULO-12M',
          slug: 'circulo-anual',
          quantity: 1,
          total: '80.00',
          meta_data: [{ key: '_category_slugs', value: ['membresias'] }]
        }
      ]
    }
  },
  {
    name: '5. Compra de Guardián (para verificar que no se confunde)',
    payload: {
      id: 10005,
      status: 'completed',
      total: '45.00',
      billing: {
        email: 'test-guardian@duendes.test',
        first_name: 'Test Guardián'
      },
      line_items: [
        {
          product_id: 301,
          name: 'Guardián de la Abundancia - Duende Dorado',
          sku: 'GUARDIAN-001',
          quantity: 1,
          total: '45.00',
          image: { src: 'https://example.com/guardian.jpg' },
          meta_data: [{ key: '_category_slugs', value: ['abundancia'] }]
        }
      ]
    }
  },
  {
    name: '6. Formato legacy: runas-de-poder-30',
    payload: {
      id: 10006,
      status: 'completed',
      total: '5.00',
      billing: {
        email: 'test-legacy@duendes.test',
        first_name: 'Test Legacy'
      },
      line_items: [
        {
          product_id: 99,
          name: '30 Runas de Poder',
          sku: 'runas-de-poder-30',
          quantity: 1,
          total: '5.00',
          meta_data: [{ key: '_category_slugs', value: ['monedas'] }]
        }
      ]
    }
  }
];

// ═══════════════════════════════════════════════════════════════
// EJECUTAR TESTS
// ═══════════════════════════════════════════════════════════════

async function runTest(test) {
  console.log(`\n📦 ${test.name}`);
  console.log('─'.repeat(60));

  try {
    const response = await fetch(`${BASE_URL}/api/webhooks/woocommerce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(test.payload)
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ SUCCESS');
      console.log(`   Guardianes: ${data.guardianes || 0}`);
      console.log(`   Runas: ${data.runas || 0}`);
      console.log(`   Membresías: ${data.membresias || 0}`);
      console.log(`   Primera compra: ${data.esPrimeraCompra ? 'Sí (+20 runas bonus)' : 'No'}`);
    } else {
      console.log('❌ ERROR');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${data.error || 'Unknown error'}`);
    }

    return { success: response.ok, data };

  } catch (error) {
    console.log('❌ FETCH ERROR');
    console.log(`   ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('═'.repeat(60));
  console.log('  WEBHOOK TEST SUITE - DUENDES DEL URUGUAY');
  console.log('═'.repeat(60));

  const results = [];

  for (const test of TESTS) {
    const result = await runTest(test);
    results.push({ name: test.name, ...result });

    // Pequeña pausa entre tests
    await new Promise(r => setTimeout(r, 500));
  }

  // Resumen
  console.log('\n' + '═'.repeat(60));
  console.log('  RESUMEN');
  console.log('═'.repeat(60));

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${results.length}\n`);

  if (failed > 0) {
    console.log('Tests fallidos:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}`);
    });
  }
}

// Ejecutar
runAllTests().catch(console.error);
