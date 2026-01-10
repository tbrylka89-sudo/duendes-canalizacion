import { kv } from '@vercel/kv';

// GET - Buscar clientes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query) {
      return Response.json({ success: true, clientes: [] });
    }

    // Obtener todas las claves de usuarios
    const userKeys = await kv.keys('user:*');
    const elegidoKeys = await kv.keys('elegido:*');
    const allKeys = [...new Set([...userKeys, ...elegidoKeys])];

    const clientes = [];

    for (const k of allKeys) {
      try {
        const user = await kv.get(k);
        if (!user) continue;

        // Buscar en email y nombre
        const email = (user.email || '').toLowerCase();
        const nombre = (user.nombre || '').toLowerCase();
        const nombrePreferido = (user.nombrePreferido || '').toLowerCase();

        if (email.includes(query) || nombre.includes(query) || nombrePreferido.includes(query)) {
          clientes.push({
            email: user.email,
            nombre: user.nombre,
            nombrePreferido: user.nombrePreferido,
            runas: user.runas || 0,
            treboles: user.treboles || 0,
            gastado: user.gastado || user.totalCompras || 0,
            esCirculo: user.esCirculo || false
          });
        }
      } catch (e) {
        // Ignorar errores individuales
      }
    }

    // Ordenar por gastado
    clientes.sort((a, b) => (b.gastado || 0) - (a.gastado || 0));

    return Response.json({
      success: true,
      clientes: clientes.slice(0, 50)
    });

  } catch (error) {
    console.error('Error buscando clientes:', error);
    return Response.json({
      success: false,
      error: error.message,
      clientes: []
    });
  }
}

// POST - Crear cliente
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, nombre } = body;

    if (!email) {
      return Response.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    const emailNormalizado = email.toLowerCase().trim();

    // Verificar si ya existe
    const existente = await kv.get(`user:${emailNormalizado}`);
    if (existente) {
      return Response.json({ success: false, error: 'El cliente ya existe' }, { status: 400 });
    }

    // Crear nuevo cliente
    const nuevoCliente = {
      email: emailNormalizado,
      nombre: nombre || '',
      runas: 0,
      treboles: 0,
      gastado: 0,
      esCirculo: false,
      guardianes: [],
      lecturas: [],
      fechaCreacion: new Date().toISOString(),
      creadoPorAdmin: true
    };

    await kv.set(`user:${emailNormalizado}`, nuevoCliente);

    return Response.json({ success: true, cliente: nuevoCliente });

  } catch (error) {
    console.error('Error creando cliente:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
