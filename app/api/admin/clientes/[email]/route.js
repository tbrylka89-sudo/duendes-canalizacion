import { kv } from '@vercel/kv';

// GET - Obtener detalle de un cliente
export async function GET(request, { params }) {
  try {
    const email = decodeURIComponent(params.email).toLowerCase();

    // Buscar en ambas claves
    let cliente = await kv.get(`user:${email}`);
    if (!cliente) {
      cliente = await kv.get(`elegido:${email}`);
    }

    if (!cliente) {
      return Response.json({ success: false, error: 'Cliente no encontrado' }, { status: 404 });
    }

    // Obtener datos del circulo si existe
    const circuloData = await kv.get(`circulo:${email}`);
    if (circuloData) {
      cliente.esCirculo = circuloData.activo;
      cliente.circuloExpira = circuloData.expira;
      cliente.circuloPlan = circuloData.plan;
    }

    return Response.json({ success: true, cliente });

  } catch (error) {
    console.error('Error obteniendo cliente:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH - Actualizar cliente
export async function PATCH(request, { params }) {
  try {
    const email = decodeURIComponent(params.email).toLowerCase();
    const body = await request.json();
    const { campo, valor, motivo } = body;

    if (!campo) {
      return Response.json({ success: false, error: 'Campo requerido' }, { status: 400 });
    }

    // Buscar cliente
    let keyUsada = `user:${email}`;
    let cliente = await kv.get(keyUsada);
    if (!cliente) {
      keyUsada = `elegido:${email}`;
      cliente = await kv.get(keyUsada);
    }

    if (!cliente) {
      return Response.json({ success: false, error: 'Cliente no encontrado' }, { status: 404 });
    }

    // Actualizar el campo
    const valorAnterior = cliente[campo];
    cliente[campo] = valor;
    cliente.ultimaModificacion = new Date().toISOString();

    // Guardar historial de cambios (especialmente para monedas)
    if (['runas', 'treboles'].includes(campo)) {
      if (!cliente.historialCambios) cliente.historialCambios = [];
      cliente.historialCambios.push({
        campo,
        de: valorAnterior || 0,
        a: valor,
        motivo: motivo || 'Ajuste admin',
        fecha: new Date().toISOString()
      });
    }

    await kv.set(keyUsada, cliente);

    return Response.json({ success: true, cliente });

  } catch (error) {
    console.error('Error actualizando cliente:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
