import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE AUTOMATIZACIÓN DE EL CÍRCULO
// ═══════════════════════════════════════════════════════════════

const CONFIG_KEY = 'circulo:config:automatizacion';

const CONFIG_DEFAULT = {
  autoGenerar: true,
  autoPublicar: true,
  horaPublicacion: '09:00',
  regaloLunaLlena: true,
  regalosSabbats: true,
  notificarEmail: true,
  diasAnticipacion: 7,
  generarImagenes: true,
  generarAudio: false,
};

export async function GET() {
  try {
    const config = await kv.get(CONFIG_KEY);

    return Response.json({
      success: true,
      config: config || CONFIG_DEFAULT
    });

  } catch (error) {
    console.error('Error obteniendo config:', error);
    return Response.json({
      success: true,
      config: CONFIG_DEFAULT
    });
  }
}

export async function POST(request) {
  try {
    const nuevaConfig = await request.json();

    // Validar campos
    const configValidada = {
      autoGenerar: Boolean(nuevaConfig.autoGenerar),
      autoPublicar: Boolean(nuevaConfig.autoPublicar),
      horaPublicacion: nuevaConfig.horaPublicacion || '09:00',
      regaloLunaLlena: Boolean(nuevaConfig.regaloLunaLlena),
      regalosSabbats: Boolean(nuevaConfig.regalosSabbats),
      notificarEmail: Boolean(nuevaConfig.notificarEmail),
      diasAnticipacion: parseInt(nuevaConfig.diasAnticipacion) || 7,
      generarImagenes: Boolean(nuevaConfig.generarImagenes),
      generarAudio: Boolean(nuevaConfig.generarAudio),
      ultimaModificacion: new Date().toISOString()
    };

    await kv.set(CONFIG_KEY, configValidada);

    return Response.json({
      success: true,
      config: configValidada,
      mensaje: 'Configuración guardada'
    });

  } catch (error) {
    console.error('Error guardando config:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
