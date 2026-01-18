import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Generar bienvenida personalizada del Guardián de la Semana
// Usa duendes REALES de WooCommerce sincronizados en KV
// ═══════════════════════════════════════════════════════════════════════════════

const anthropic = new Anthropic();

// Obtener guardián de la semana desde KV (sincronizado de WooCommerce)
async function obtenerGuardianSemana() {
  // Primero intentar obtener el guardián configurado
  const guardianActual = await kv.get('duende-semana-actual');
  if (guardianActual) {
    return guardianActual;
  }

  // Si no hay, obtener de la lista de guardianes reales
  const guardianes = await kv.get('duendes:guardianes');
  if (guardianes && guardianes.length > 0) {
    // Rotar basado en la semana del año
    const ahora = new Date();
    const inicioAno = new Date(ahora.getFullYear(), 0, 1);
    const semanaDelAno = Math.ceil(((ahora - inicioAno) / 86400000 + inicioAno.getDay() + 1) / 7);
    const indice = semanaDelAno % guardianes.length;
    return guardianes[indice];
  }

  // Fallback a un guardián por defecto si no hay datos
  return {
    id: 'finnian',
    nombre: 'Finnian',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/12/Finnian.jpg',
    especialidad: 'protección y sabiduría ancestral'
  };
}

export async function POST(request) {
  try {
    const { email, nombre, perfil } = await request.json();

    if (!email || !nombre) {
      return Response.json({
        success: false,
        error: 'Email y nombre son requeridos'
      }, { status: 400 });
    }

    // Verificar si ya recibió bienvenida
    const bienvenidaRecibida = await kv.get(`bienvenida:${email}`);
    if (bienvenidaRecibida) {
      return Response.json({
        success: true,
        yaRecibida: true,
        guardian: bienvenidaRecibida.guardian,
        mensaje: bienvenidaRecibida.mensaje
      });
    }

    // Obtener guardián de la semana (REAL de WooCommerce)
    const guardian = await obtenerGuardianSemana();

    // Construir contexto del usuario para personalizar el mensaje
    let contextoUsuario = `Nombre: ${nombre}`;
    if (perfil) {
      if (perfil.queBusca?.length > 0) {
        contextoUsuario += `\nBusca: ${perfil.queBusca.join(', ')}`;
      }
      if (perfil.atraccionPrincipal?.length > 0) {
        contextoUsuario += `\nLe atrae: ${perfil.atraccionPrincipal.join(', ')}`;
      }
      if (perfil.experienciaEspiritual) {
        contextoUsuario += `\nExperiencia espiritual: ${perfil.experienciaEspiritual}`;
      }
      if (perfil.objetivoPrincipal) {
        contextoUsuario += `\nObjetivo: ${perfil.objetivoPrincipal}`;
      }
    }

    // Generar mensaje personalizado con Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Sos ${guardian.nombre}, un guardián mágico de Duendes del Uruguay.

Un nuevo miembro acaba de unirse al Círculo de Duendes. Escribí un mensaje de bienvenida PERSONAL y CÁLIDO desde tu perspectiva como guardián.

INFORMACIÓN DEL NUEVO MIEMBRO:
${contextoUsuario}

INSTRUCCIONES:
- El mensaje debe empezar saludando a ${nombre} por su nombre
- Presentate brevemente como guardián
- Conectá con algo que la persona busca o le interesa (si hay info)
- Contale qué van a aprender juntos esta semana
- Máximo 3-4 párrafos cortos
- Tono místico pero cercano, nada genérico
- NO uses frases cliché como "desde tiempos inmemoriales" o "en lo profundo del bosque"
- Escribí en español rioplatense (vos, tenés, etc.)

Escribí SOLO el mensaje, sin explicaciones ni formato markdown.`
      }]
    });

    const mensajeBienvenida = response.content[0].text;

    // Guardar que ya recibió la bienvenida
    await kv.set(`bienvenida:${email}`, {
      guardian: {
        id: guardian.id || guardian.slug,
        nombre: guardian.nombre,
        imagen: guardian.imagen,
        color: '#D4AF37'
      },
      mensaje: mensajeBienvenida,
      fecha: new Date().toISOString()
    });

    return Response.json({
      success: true,
      guardian: {
        id: guardian.id || guardian.slug,
        nombre: guardian.nombre,
        imagen: guardian.imagen,
        color: '#D4AF37'
      },
      mensaje: mensajeBienvenida
    });

  } catch (error) {
    console.error('[BIENVENIDA-GUARDIAN] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET: Obtener guardián de la semana actual (sin generar mensaje)
export async function GET() {
  try {
    const guardian = await obtenerGuardianSemana();
    return Response.json({
      success: true,
      guardian: {
        id: guardian.id || guardian.slug,
        nombre: guardian.nombre,
        imagen: guardian.imagen,
        color: '#D4AF37'
      }
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
