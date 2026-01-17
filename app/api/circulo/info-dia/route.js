import { infoDiaActual, sugerirContenido } from '@/lib/ciclos-naturales';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Información del Día
// Devuelve fase lunar, celebraciones celtas y sugerencias de contenido
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET() {
  try {
    const info = infoDiaActual();
    const sugerencias = sugerirContenido();

    return Response.json({
      success: true,
      ...info,
      sugerencias
    });

  } catch (error) {
    console.error('[INFO-DIA] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
