#!/usr/bin/env node
/**
 * Script de prueba para el webhook de WooCommerce - Membresías del Círculo
 *
 * Uso:
 *   node scripts/test-webhook-membresias.js [local|prod]
 */

const BASE_URLS = {
  local: 'http://localhost:3000',
  prod: 'https://duendes-vercel.vercel.app'
};

const env = process.argv[2] || 'prod';
const BASE_URL = BASE_URLS[env] || BASE_URLS.prod;

console.log(`\n🧪 Testing webhook at: ${BASE_URL}/api/webhooks/woocommerce\n`);

const TESTS = [
  {
    name: '1. Membresía Mensual (CIRCULO-1M) - $15',
    payload: {
      id: 20001,
      status: 'completed',
      total: '15.00',
      billing: {
        email: 'test-circulo-mensual@duendes.test',
        first_name: 'Test Mensual'
      },
      line_items: [
        {
          product_id: 501,
          name: 'Círculo Mensual',
          sku: 'CIRCULO-1M',
          slug: 'circulo-mensual',
          quantity: 1,
          total: '15.00',
          meta_data: [{ key: '_category_slugs', value: ['membresias'] }]
        }
      ]
    },
    expected: { membresias: 1, runasBienvenida: 20 }
  },
  {
    name: '2. Membresía Seis Meses (CIRCULO-6M) - $50',
    payload: {
      id: 20002,
      status: 'completed',
      total: '50.00',
      billing: {
        email: 'test-circulo-semestral@duendes.test',
        first_name: 'Test Semestral'
      },
      line_items: [
        {
          product_id: 502,
          name: 'Círculo Seis Meses',
          sku: 'CIRCULO-6M',
          slug: 'circulo-seis-meses',
          quantity: 1,
          total: '50.00',
          meta_data: [{ key: '_category_slugs', value: ['membresias'] }]
        }
      ]
    },
    expected: { membresias: 1, runasBienvenida: 60 }
  },
  {
    name: '3. Membresía Anual (CIRCULO-12M) - $80',
    payload: {
      id: 20003,
      status: 'completed',
      total: '80.00',
      billing: {
        email: 'test-circulo-anual@duendes.test',
        first_name: 'Test Anual'
      },
      line_items: [
        {
          product_id: 503,
          name: 'Año del Guardián - Círculo Anual',
          sku: 'CIRCULO-12M',
          slug: 'circulo-anual',
          quantity: 1,
          total: '80.00',
          meta_data: [{ key: '_category_slugs', value: ['membresias'] }]
        }
      ]
    },
    expected: { membresias: 1, runasBienvenida: 120 }
  },
  {
    name: '4. Combo: Membresía Mensual + Paquete Destello',
    payload: {
      id: 20004,
      status: 'completed',
      total: '25.00',
      billing: {
        email: 'test-combo-membresia@duendes.test',
        first_name: 'Test Combo'
      },
      line_items: [
        {
          product_id: 501,
          name: 'Círculo Mensual',
          sku: 'CIRCULO-1M',
          slug: 'circulo-mensual',
          quantity: 1,
          total: '15.00',
          meta_data: [{ key: '_category_slugs', value: ['membresias'] }]
        },
        {
          product_id: 102,
          name: 'Paquete Destello - 80 Runas',
          sku: 'RUNAS-80',
          slug: 'paquete-runas-80',
          quantity: 1,
          total: '10.00',
          meta_data: []
        }
      ]
    },
    expected: { membresias: 1, runas: 90 }
  }
];

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
      console.log(`   Membresías: ${data.membresias || 0}`);
      console.log(`   Runas: ${data.runas || 0}`);
      console.log(`   Primera compra: ${data.esPrimeraCompra ? 'Sí (+20 runas bonus)' : 'No'}`);

      // Verificar expectativas
      let passed = true;
      if (test.expected.membresias !== undefined && data.membresias !== test.expected.membresias) {
        console.log(`   ⚠️  Esperaba ${test.expected.membresias} membresías`);
        passed = false;
      }
      if (test.expected.runas !== undefined && data.runas !== test.expected.runas) {
        console.log(`   ⚠️  Esperaba ${test.expected.runas} runas`);
        passed = false;
      }

      return { success: passed, data };
    } else {
      console.log('❌ ERROR');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${data.error || 'Unknown error'}`);
      return { success: false, data };
    }

  } catch (error) {
    console.log('❌ FETCH ERROR');
    console.log(`   ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('═'.repeat(60));
  console.log('  WEBHOOK TEST SUITE - MEMBRESÍAS DEL CÍRCULO');
  console.log('═'.repeat(60));

  const results = [];

  for (const test of TESTS) {
    const result = await runTest(test);
    results.push({ name: test.name, ...result });
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

runAllTests().catch(console.error);
