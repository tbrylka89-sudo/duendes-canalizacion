import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Generar bienvenida personalizada del Guardián de la Semana
// Usa duendes REALES de WooCommerce sincronizados en KV
// ═══════════════════════════════════════════════════════════════════════════════

const anthropic = new Anthropic();

// Obtener guardián de la semana desde rotación de Enero 2026
async function obtenerGuardianSemana() {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = ahora.getMonth() + 1;
  const dia = ahora.getDate();

  // Determinar número de semana del mes
  let semanaNum = 1;
  if (dia >= 22) semanaNum = 4;
  else if (dia >= 15) semanaNum = 3;
  else if (dia >= 8) semanaNum = 2;

  // Buscar en rotación semanal (datos nuevos - Gaia, Noah, Winter, Marcos)
  const semanaKey = `circulo:duende-semana:${año}:${mes}:${semanaNum}`;
  const semanaData = await kv.get(semanaKey);

  if (semanaData?.guardian) {
    return {
      id: semanaData.guardian.slug,
      nombre: semanaData.guardian.nombre,
      nombreCompleto: semanaData.guardian.nombreCompleto,
      imagen: semanaData.guardian.imagen,
      especialidad: semanaData.tema,
      color: semanaData.guardian.color
    };
  }

  // Fallback: buscar en formato antiguo
  const guardianActual = await kv.get('duende-semana:actual');
  if (guardianActual) {
    return guardianActual;
  }

  // Fallback final a Marcos (semana 4 de enero)
  return {
    id: 'marcos',
    nombre: 'Marcos',
    nombreCompleto: 'Marcos, Guardián de la Sabiduría',
    imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/03/Marcos-1.jpg',
    especialidad: 'claridad y nueva perspectiva'
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
      // Asegurar que el guardian tenga especialidad (para caches viejos)
      const guardianConEspecialidad = {
        ...bienvenidaRecibida.guardian,
        especialidad: bienvenidaRecibida.guardian?.especialidad || 'Guía del Círculo'
      };
      return Response.json({
        success: true,
        yaRecibida: true,
        guardian: guardianConEspecialidad,
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
    const guardianData = {
      id: guardian.id || guardian.slug,
      nombre: guardian.nombre,
      nombreCompleto: guardian.nombreCompleto,
      imagen: guardian.imagen,
      especialidad: guardian.especialidad || guardian.categoria || 'Guía del Círculo',
      color: guardian.color || '#D4AF37'
    };

    await kv.set(`bienvenida:${email}`, {
      guardian: guardianData,
      mensaje: mensajeBienvenida,
      fecha: new Date().toISOString()
    });

    return Response.json({
      success: true,
      guardian: guardianData,
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
