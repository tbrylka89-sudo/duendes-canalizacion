export const dynamic = "force-dynamic";
import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: PROMOCIONES AUTOMÁTICAS (GATILLOS)
// Promociones que se activan por condiciones específicas
// ═══════════════════════════════════════════════════════════════════════════════

const GATILLOS_DISPONIBLES = [
  { id: 'cumpleanos', nombre: 'Cumpleaños del usuario', icono: '🎂' },
  { id: 'carrito_abandonado', nombre: 'Carrito abandonado', icono: '🛒' },
  { id: 'inactividad', nombre: 'Inactividad (días sin visitar)', icono: '😴' },
  { id: 'primera_compra', nombre: 'Primera compra', icono: '🎉' },
  { id: 'aniversario', nombre: 'Aniversario de primera compra', icono: '🎊' },
  { id: 'luna_llena', nombre: 'Luna llena', icono: '🌕' },
  { id: 'luna_nueva', nombre: 'Luna nueva', icono: '🌑' },
  { id: 'celebracion_celta', nombre: 'Celebración celta', icono: '☀️' },
  { id: 'treboles', nombre: 'Usuario alcanza X tréboles', icono: '☘️' },
  { id: 'rango', nombre: 'Usuario sube de rango', icono: '⭐' },
  { id: 'guardian_nuevo', nombre: 'Nuevo guardián disponible', icono: '✨' }
];

const ACCIONES_DISPONIBLES = [
  { id: 'popup', nombre: 'Mostrar popup personalizado', icono: '📢' },
  { id: 'email', nombre: 'Enviar email', icono: '📧' },
  { id: 'cupon', nombre: 'Dar cupón automático', icono: '🎟️' },
  { id: 'treboles', nombre: 'Regalar tréboles', icono: '☘️' },
  { id: 'runas', nombre: 'Regalar runas', icono: 'ᚱ' }
];

// GET - Listar promociones automáticas
export async function GET() {
  try {
    const automaticas = await kv.get('promociones:automaticas') || [];

    // Stats
    const activas = automaticas.filter(a => a.activa).length;
    const pausadas = automaticas.filter(a => !a.activa).length;

    // Historial de activaciones recientes
    const historial = await kv.get('promociones:automaticas:historial') || [];

    return Response.json({
      success: true,
      automaticas,
      stats: { total: automaticas.length, activas, pausadas },
      historial: historial.slice(0, 50),
      gatillos: GATILLOS_DISPONIBLES,
      acciones: ACCIONES_DISPONIBLES
    });

  } catch (error) {
    console.error('[PROMOS/AUTO] Error GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Crear, editar, eliminar promo automática
export async function POST(request) {
  try {
    const body = await request.json();
    const { accion } = body;

    switch (accion) {
      case 'crear': {
        const { nombre, gatillo, configuracionGatillo, accionPromo, configuracionAccion, limite } = body;

        if (!nombre || !gatillo || !accionPromo) {
          return Response.json({ success: false, error: 'Faltan campos requeridos' }, { status: 400 });
        }

        const nuevaAuto = {
          id: `auto_${Date.now()}`,
          nombre,
          gatillo,
          configuracionGatillo: configuracionGatillo || {},
          accionPromo,
          configuracionAccion: configuracionAccion || {},
          limite: limite || 'una_vez', // una_vez, mensual, anual, ilimitado
          activa: true,
          activaciones: 0,
          usuariosActivados: [],
          creadaEn: new Date().toISOString()
        };

        const automaticas = await kv.get('promociones:automaticas') || [];
        automaticas.push(nuevaAuto);
        await kv.set('promociones:automaticas', automaticas);

        return Response.json({ success: true, automatica: nuevaAuto, mensaje: 'Promo automática creada' });
      }

      case 'editar': {
        const { id, ...cambios } = body;

        const automaticas = await kv.get('promociones:automaticas') || [];
        const idx = automaticas.findIndex(a => a.id === id);

        if (idx === -1) {
          return Response.json({ success: false, error: 'No encontrada' }, { status: 404 });
        }

        automaticas[idx] = { ...automaticas[idx], ...cambios, editadaEn: new Date().toISOString() };
        await kv.set('promociones:automaticas', automaticas);

        return Response.json({ success: true, mensaje: 'Actualizada' });
      }

      case 'toggle': {
        const { id } = body;

        const automaticas = await kv.get('promociones:automaticas') || [];
        const idx = automaticas.findIndex(a => a.id === id);

        if (idx === -1) {
          return Response.json({ success: false, error: 'No encontrada' }, { status: 404 });
        }

        automaticas[idx].activa = !automaticas[idx].activa;
        await kv.set('promociones:automaticas', automaticas);

        return Response.json({ success: true, activa: automaticas[idx].activa });
      }

      case 'eliminar': {
        const { id } = body;

        const automaticas = await kv.get('promociones:automaticas') || [];
        const filtradas = automaticas.filter(a => a.id !== id);
        await kv.set('promociones:automaticas', filtradas);

        return Response.json({ success: true, mensaje: 'Eliminada' });
      }

      case 'ejecutar-manual': {
        // Ejecutar manualmente una promo automática para un usuario
        const { id, email } = body;

        const automaticas = await kv.get('promociones:automaticas') || [];
        const auto = automaticas.find(a => a.id === id);

        if (!auto) {
          return Response.json({ success: false, error: 'No encontrada' }, { status: 404 });
        }

        // Registrar activación
        const historial = await kv.get('promociones:automaticas:historial') || [];
        historial.unshift({
          autoId: id,
          nombreAuto: auto.nombre,
          email,
          fecha: new Date().toISOString(),
          manual: true
        });
        await kv.set('promociones:automaticas:historial', historial.slice(0, 1000));

        // Actualizar contador
        const idx = automaticas.findIndex(a => a.id === id);
        automaticas[idx].activaciones++;
        if (!automaticas[idx].usuariosActivados.includes(email)) {
          automaticas[idx].usuariosActivados.push(email);
        }
        await kv.set('promociones:automaticas', automaticas);

        return Response.json({ success: true, mensaje: 'Ejecutada manualmente' });
      }

      default:
        return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }

  } catch (error) {
    console.error('[PROMOS/AUTO] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
