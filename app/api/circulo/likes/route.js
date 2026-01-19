import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Sistema de likes para contenido del Círculo
// Permite dar/quitar corazón y ver conteo de likes por día
// ═══════════════════════════════════════════════════════════════════════════════

// GET: Obtener likes de un contenido específico
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dia = searchParams.get('dia');
    const mes = searchParams.get('mes');
    const año = searchParams.get('año') || searchParams.get('ano');
    const email = searchParams.get('email');

    if (!dia || !mes || !año) {
      return Response.json({
        success: false,
        error: 'Se requiere día, mes y año'
      }, { status: 400 });
    }

    const key = `circulo:likes:${año}:${mes}:${dia}`;
    const likesData = await kv.get(key) || { total: 0, usuarios: [] };

    // Verificar si el usuario ya dio like
    let yaDioLike = false;
    if (email) {
      yaDioLike = likesData.usuarios?.includes(email.toLowerCase().trim()) || false;
    }

    return Response.json({
      success: true,
      likes: likesData.total || 0,
      yaDioLike,
      fecha: { año: parseInt(año), mes: parseInt(mes), dia: parseInt(dia) }
    });

  } catch (error) {
    console.error('[LIKES GET] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Dar o quitar like
export async function POST(request) {
  try {
    const { dia, mes, año, email, accion } = await request.json();

    if (!dia || !mes || !año || !email) {
      return Response.json({
        success: false,
        error: 'Se requiere día, mes, año y email'
      }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();

    // Verificar membresía
    let usuario = await kv.get(`user:${emailNorm}`);
    if (!usuario) usuario = await kv.get(`elegido:${emailNorm}`);
    const circuloData = await kv.get(`circulo:${emailNorm}`);

    const esCirculo = circuloData?.activo ||
      (usuario?.esCirculo && usuario?.circuloExpira && new Date(usuario.circuloExpira) > new Date());

    if (!esCirculo) {
      return Response.json({
        success: false,
        error: 'Necesitás ser miembro del Círculo para dar likes'
      }, { status: 403 });
    }

    const key = `circulo:likes:${año}:${mes}:${dia}`;
    let likesData = await kv.get(key) || { total: 0, usuarios: [] };

    const yaTieneLike = likesData.usuarios?.includes(emailNorm) || false;

    if (accion === 'quitar' || (yaTieneLike && accion !== 'dar')) {
      // Quitar like
      if (yaTieneLike) {
        likesData.usuarios = likesData.usuarios.filter(e => e !== emailNorm);
        likesData.total = Math.max(0, (likesData.total || 1) - 1);
        await kv.set(key, likesData);
      }
      return Response.json({
        success: true,
        accion: 'quitado',
        likes: likesData.total,
        yaDioLike: false
      });
    } else {
      // Dar like
      if (!yaTieneLike) {
        if (!likesData.usuarios) likesData.usuarios = [];
        likesData.usuarios.push(emailNorm);
        likesData.total = (likesData.total || 0) + 1;
        await kv.set(key, likesData);
      }
      return Response.json({
        success: true,
        accion: 'agregado',
        likes: likesData.total,
        yaDioLike: true
      });
    }

  } catch (error) {
    console.error('[LIKES POST] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
