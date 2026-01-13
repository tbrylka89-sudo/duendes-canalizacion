import { kv } from '@vercel/kv';

// Generar token corto
function generarTokenCorto() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// GET: Ver estado de tokens
export async function GET() {
  try {
    const elegidoKeys = await kv.keys('elegido:*');
    const userKeys = await kv.keys('user:*');

    let tokensLargos = 0;
    let tokensCortos = 0;
    let sinToken = 0;
    const detalles = [];

    for (const key of [...elegidoKeys, ...userKeys]) {
      const data = await kv.get(key);
      if (!data?.token) {
        sinToken++;
      } else if (data.token.length > 20) {
        tokensLargos++;
        detalles.push({ email: data.email, tokenLength: data.token.length, tipo: key.startsWith('elegido') ? 'elegido' : 'user' });
      } else {
        tokensCortos++;
      }
    }

    return Response.json({
      success: true,
      resumen: { tokensLargos, tokensCortos, sinToken, total: elegidoKeys.length + userKeys.length },
      detalles: detalles.slice(0, 20) // Mostrar primeros 20
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}

// POST: Migrar todos los tokens largos a cortos
export async function POST(request) {
  try {
    const { accion, email } = await request.json();

    // Migrar un usuario específico
    if (accion === 'migrar_uno' && email) {
      const elegido = await kv.get(`elegido:${email}`);
      const user = await kv.get(`user:${email}`);
      const data = elegido || user;

      if (!data) return Response.json({ success: false, error: 'Usuario no encontrado' });

      const tokenViejo = data.token;
      const tokenNuevo = generarTokenCorto();

      // Actualizar elegido
      if (elegido) {
        elegido.token = tokenNuevo;
        elegido.tokenAnterior = tokenViejo;
        await kv.set(`elegido:${email}`, elegido);
      }

      // Actualizar user
      if (user) {
        user.token = tokenNuevo;
        user.tokenAnterior = tokenViejo;
        await kv.set(`user:${email}`, user);
      }

      // Crear nueva key de token
      await kv.set(`token:${tokenNuevo}`, { email, nombre: data.nombre }, { ex: 365 * 24 * 60 * 60 });

      // Mantener token viejo funcionando (redirige al nuevo)
      if (tokenViejo) {
        await kv.set(`token:${tokenViejo}`, { email, nombre: data.nombre }, { ex: 365 * 24 * 60 * 60 });
      }

      return Response.json({
        success: true,
        mensaje: `Token migrado para ${email}`,
        tokenNuevo,
        linkNuevo: `https://duendes-vercel.vercel.app/mi-magia?token=${tokenNuevo}`
      });
    }

    // Migrar todos los tokens largos
    if (accion === 'migrar_todos') {
      const elegidoKeys = await kv.keys('elegido:*');
      const userKeys = await kv.keys('user:*');
      let migrados = 0;

      for (const key of elegidoKeys) {
        const data = await kv.get(key);
        if (data?.token && data.token.length > 20) {
          const tokenNuevo = generarTokenCorto();
          const tokenViejo = data.token;

          data.token = tokenNuevo;
          data.tokenAnterior = tokenViejo;
          await kv.set(key, data);

          // Crear nueva key de token
          await kv.set(`token:${tokenNuevo}`, { email: data.email, nombre: data.nombre }, { ex: 365 * 24 * 60 * 60 });

          // Mantener token viejo funcionando
          await kv.set(`token:${tokenViejo}`, { email: data.email, nombre: data.nombre }, { ex: 365 * 24 * 60 * 60 });

          migrados++;
        }
      }

      for (const key of userKeys) {
        const data = await kv.get(key);
        if (data?.token && data.token.length > 20) {
          const tokenNuevo = generarTokenCorto();
          const tokenViejo = data.token;

          data.token = tokenNuevo;
          data.tokenAnterior = tokenViejo;
          await kv.set(key, data);

          await kv.set(`token:${tokenNuevo}`, { email: data.email, nombre: data.nombre }, { ex: 365 * 24 * 60 * 60 });
          await kv.set(`token:${tokenViejo}`, { email: data.email, nombre: data.nombre }, { ex: 365 * 24 * 60 * 60 });

          migrados++;
        }
      }

      return Response.json({ success: true, migrados });
    }

    // Resetear tréboles de un usuario
    if (accion === 'resetear_treboles' && email) {
      const elegido = await kv.get(`elegido:${email}`);
      const user = await kv.get(`user:${email}`);

      if (elegido) {
        elegido.treboles = 0;
        await kv.set(`elegido:${email}`, elegido);
      }
      if (user) {
        user.treboles = 0;
        await kv.set(`user:${email}`, user);
      }

      return Response.json({ success: true, mensaje: `Tréboles reseteados para ${email}` });
    }

    // Buscar usuario por token
    if (accion === 'buscar_por_token') {
      const { token } = await request.json();
      const elegidoKeys = await kv.keys('elegido:*');

      for (const key of elegidoKeys) {
        const data = await kv.get(key);
        if (data?.token === token) {
          return Response.json({ success: true, email: data.email, data });
        }
      }

      return Response.json({ success: false, error: 'Token no encontrado' });
    }

    return Response.json({ success: false, error: 'Acción no válida' });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
