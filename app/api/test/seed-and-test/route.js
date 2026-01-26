import { kv } from '@vercel/kv';

// Endpoint de prueba - BORRAR DESPUÉS DE TESTEAR
export async function GET(request) {
  const testEmail = 'test-claude@prueba.com';
  const testToken = 'test-token-claude-2026';

  try {
    // 1. Crear usuario de prueba
    const elegido = {
      email: testEmail,
      nombre: 'Usuario de Prueba',
      nombrePreferido: 'Prueba',
      pronombre: 'ella',
      runas: 100, // 100 runas para probar
      treboles: 5,
      onboardingCompleto: true,
      tourVisto: true,
      perfilCompleto: true,
      guardianes: [],
      createdAt: new Date().toISOString()
    };

    await kv.set(`elegido:${testEmail}`, elegido);
    await kv.set(`token:${testToken}`, { email: testEmail, nombre: 'Usuario de Prueba' });

    // 2. Verificar que se creó
    const elegidoVerify = await kv.get(`elegido:${testEmail}`);
    const tokenVerify = await kv.get(`token:${testToken}`);

    // 3. Verificar historial actual (debería estar vacío)
    const historialAntes = await kv.get(`historial:${testEmail}`) || [];

    return Response.json({
      success: true,
      mensaje: 'Usuario de prueba creado',
      datos: {
        email: testEmail,
        token: testToken,
        runas: elegidoVerify?.runas,
        historialAntes: historialAntes.length,
        urlParaProbar: `https://duendes-vercel.vercel.app/mi-magia?token=${testToken}`
      },
      instrucciones: [
        '1. Ahora llamá a POST /api/experiencias/solicitar con el token',
        '2. Luego verificá GET /api/gamificacion/historial-lecturas?token=...',
        '3. Deberías ver la lectura en el historial'
      ]
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  const testEmail = 'test-claude@prueba.com';
  const testToken = 'test-token-claude-2026';

  try {
    // Solicitar una experiencia barata
    const solicitarRes = await fetch('https://duendes-vercel.vercel.app/api/experiencias/solicitar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: testToken,
        experienciaId: 'consejo_bosque', // 15 runas, instantáneo
        generarInmediato: true
      })
    });

    const solicitarData = await solicitarRes.json();

    // Verificar historial después
    const historialDespues = await kv.get(`historial:${testEmail}`) || [];

    // Verificar runas restantes
    const elegidoDespues = await kv.get(`elegido:${testEmail}`);

    return Response.json({
      success: true,
      resultadoSolicitud: solicitarData,
      verificacion: {
        historialTiene: historialDespues.length,
        primeraLectura: historialDespues[0] ? {
          id: historialDespues[0].id,
          nombre: historialDespues[0].nombre,
          estado: historialDespues[0].estado,
          tieneContenido: !!historialDespues[0].contenido
        } : null,
        runasRestantes: elegidoDespues?.runas,
        runasDescontadas: 100 - (elegidoDespues?.runas || 0)
      }
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

// DELETE para limpiar después
export async function DELETE(request) {
  const testEmail = 'test-claude@prueba.com';
  const testToken = 'test-token-claude-2026';

  try {
    await kv.del(`elegido:${testEmail}`);
    await kv.del(`token:${testToken}`);
    await kv.del(`historial:${testEmail}`);
    await kv.del(`lecturas:${testEmail}`);

    return Response.json({
      success: true,
      mensaje: 'Datos de prueba eliminados'
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
