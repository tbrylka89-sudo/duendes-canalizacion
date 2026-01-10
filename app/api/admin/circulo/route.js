import { kv } from '@vercel/kv';

// GET - Listar miembros del circulo
export async function GET() {
  try {
    // Obtener usuarios de ambas claves
    const userKeys = await kv.keys('user:*');
    const elegidoKeys = await kv.keys('elegido:*');
    const circuloKeys = await kv.keys('circulo:*');

    const miembros = [];
    const procesados = new Set();

    // Procesar datos del circulo primero
    for (const ck of circuloKeys) {
      try {
        const email = ck.replace('circulo:', '');
        const circuloData = await kv.get(ck);

        if (!circuloData) continue;

        // Buscar datos del usuario
        let userData = await kv.get(`user:${email}`);
        if (!userData) {
          userData = await kv.get(`elegido:${email}`);
        }

        miembros.push({
          email,
          nombre: userData?.nombre || userData?.nombrePreferido || '',
          nombrePreferido: userData?.nombrePreferido || '',
          activo: circuloData.activo || false,
          plan: circuloData.plan || '',
          expira: circuloData.expira || null,
          esPrueba: circuloData.esPrueba || false
        });

        procesados.add(email);
      } catch (e) {
        // Ignorar errores individuales
      }
    }

    // Tambien buscar usuarios con esCirculo flag
    const allUserKeys = [...new Set([...userKeys, ...elegidoKeys])];
    for (const uk of allUserKeys) {
      try {
        const user = await kv.get(uk);
        if (!user || !user.esCirculo) continue;

        const email = user.email?.toLowerCase();
        if (!email || procesados.has(email)) continue;

        miembros.push({
          email,
          nombre: user.nombre || user.nombrePreferido || '',
          nombrePreferido: user.nombrePreferido || '',
          activo: user.esCirculo || false,
          plan: user.circuloPlan || '',
          expira: user.circuloExpira || null,
          esPrueba: user.circuloPrueba || false
        });
      } catch (e) {
        // Ignorar errores individuales
      }
    }

    // Ordenar por fecha de expiracion (los mas proximos primero)
    miembros.sort((a, b) => {
      if (!a.expira) return 1;
      if (!b.expira) return -1;
      return new Date(a.expira) - new Date(b.expira);
    });

    return Response.json({
      success: true,
      miembros,
      total: miembros.length
    });

  } catch (error) {
    console.error('Error listando circulo:', error);
    return Response.json({
      success: false,
      error: error.message,
      miembros: []
    }, { status: 500 });
  }
}
