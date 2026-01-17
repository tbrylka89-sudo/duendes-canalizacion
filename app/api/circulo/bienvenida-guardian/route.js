import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Generar bienvenida personalizada del Guardián de la Semana
// Usa Claude AI para generar un mensaje único desde la perspectiva del guardián
// ═══════════════════════════════════════════════════════════════════════════════

const anthropic = new Anthropic();

// Guardianes disponibles para rotar semanalmente
const GUARDIANES_SEMANA = [
  {
    id: 'rowan',
    nombre: 'Rowan',
    elemento: 'tierra',
    especialidad: 'abundancia y prosperidad',
    personalidad: 'sabio y sereno, con voz profunda y cálida',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2024/12/Rowan.jpg',
    color: '#8B4513'
  },
  {
    id: 'luna',
    nombre: 'Luna',
    elemento: 'agua',
    especialidad: 'intuición y sueños',
    personalidad: 'mística y etérea, habla con suavidad y misterio',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2024/12/Luna.jpg',
    color: '#6B5B95'
  },
  {
    id: 'ember',
    nombre: 'Ember',
    elemento: 'fuego',
    especialidad: 'pasión y transformación',
    personalidad: 'energética y apasionada, directa y motivadora',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2024/12/Ember.jpg',
    color: '#FF6B35'
  },
  {
    id: 'sage',
    nombre: 'Sage',
    elemento: 'aire',
    especialidad: 'sanación y paz interior',
    personalidad: 'tranquila y sanadora, transmite calma profunda',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2024/12/Sage.jpg',
    color: '#4A7C59'
  },
  {
    id: 'frost',
    nombre: 'Frost',
    elemento: 'hielo',
    especialidad: 'claridad mental y protección',
    personalidad: 'directo y protector, pocas palabras pero poderosas',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2024/12/Frost.jpg',
    color: '#5DADE2'
  },
  {
    id: 'aurora',
    nombre: 'Aurora',
    elemento: 'luz',
    especialidad: 'nuevos comienzos y esperanza',
    personalidad: 'radiante y optimista, llena de luz y alegría',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2024/12/Aurora.jpg',
    color: '#FFD700'
  }
];

// Obtener guardián de la semana basado en la fecha
function obtenerGuardianSemana() {
  const ahora = new Date();
  const inicioAno = new Date(ahora.getFullYear(), 0, 1);
  const semanaDelAno = Math.ceil(((ahora - inicioAno) / 86400000 + inicioAno.getDay() + 1) / 7);
  const indice = semanaDelAno % GUARDIANES_SEMANA.length;
  return GUARDIANES_SEMANA[indice];
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

    // Obtener guardián de la semana
    const guardian = obtenerGuardianSemana();

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
        content: `Sos ${guardian.nombre}, un guardián de Duendes del Uruguay. Tu elemento es ${guardian.elemento} y tu especialidad es ${guardian.especialidad}. Tu personalidad: ${guardian.personalidad}.

Un nuevo miembro acaba de unirse al Círculo de Duendes. Escribí un mensaje de bienvenida PERSONAL y CÁLIDO desde tu perspectiva como guardián.

INFORMACIÓN DEL NUEVO MIEMBRO:
${contextoUsuario}

INSTRUCCIONES:
- El mensaje debe empezar con "Bienvenida ${nombre}..." o similar
- Mencioná quién sos y tu especialidad brevemente
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
        id: guardian.id,
        nombre: guardian.nombre,
        imagen: guardian.imagen,
        color: guardian.color,
        especialidad: guardian.especialidad
      },
      mensaje: mensajeBienvenida,
      fecha: new Date().toISOString()
    });

    return Response.json({
      success: true,
      guardian: {
        id: guardian.id,
        nombre: guardian.nombre,
        imagen: guardian.imagen,
        color: guardian.color,
        especialidad: guardian.especialidad
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
    const guardian = obtenerGuardianSemana();
    return Response.json({
      success: true,
      guardian: {
        id: guardian.id,
        nombre: guardian.nombre,
        imagen: guardian.imagen,
        color: guardian.color,
        especialidad: guardian.especialidad,
        elemento: guardian.elemento
      }
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
