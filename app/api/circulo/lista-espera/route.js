import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// POST: Agregar interesado a la lista de espera del Círculo
export async function POST(request) {
  try {
    const { email, nombre, fecha } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    // Guardar en lista de interesados
    const interesado = {
      email: email.toLowerCase().trim(),
      nombre: nombre?.trim() || 'Sin nombre',
      fecha: fecha || new Date().toISOString(),
      origen: 'circulo-construccion'
    };

    // Usar el email como key para evitar duplicados
    const key = `circulo:lista-espera:${interesado.email}`;
    await kv.set(key, interesado);

    // También agregar a una lista general para poder obtener todos
    const listaKey = 'circulo:lista-espera:emails';
    const listaActual = await kv.get(listaKey) || [];

    if (!listaActual.includes(interesado.email)) {
      listaActual.push(interesado.email);
      await kv.set(listaKey, listaActual);
    }

    console.log(`[Círculo] Nuevo interesado: ${email}`);

    return NextResponse.json({
      success: true,
      mensaje: 'Guardado correctamente'
    });

  } catch (error) {
    console.error('Error guardando interesado:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// GET: Obtener lista de interesados (solo admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Protección básica
    if (secret !== process.env.DUENDES_REMOTE_SECRET) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const listaKey = 'circulo:lista-espera:emails';
    const emails = await kv.get(listaKey) || [];

    // Obtener datos completos de cada interesado
    const interesados = [];
    for (const email of emails) {
      const data = await kv.get(`circulo:lista-espera:${email}`);
      if (data) {
        interesados.push(data);
      }
    }

    // Ordenar por fecha (más recientes primero)
    interesados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return NextResponse.json({
      success: true,
      total: interesados.length,
      interesados
    });

  } catch (error) {
    console.error('Error obteniendo lista:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
