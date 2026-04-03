export const dynamic = "force-dynamic";
import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Sistema de Mensajes según Frecuencia de Visitas
// Trackea cuántas veces entra el usuario al día y devuelve mensajes apropiados
// ═══════════════════════════════════════════════════════════════════════════════

// Mensajes de bienvenida para segunda visita (después de 2+ horas)
const MENSAJES_SEGUNDA_VISITA = [
  { texto: "¡Qué alegría verte de nuevo!", complemento: "Los guardianes siempre celebran tu regreso." },
  { texto: "¡Volviste!", complemento: "Tu energía ilumina este espacio." },
  { texto: "¡Qué bueno tenerte acá otra vez!", complemento: "Cada visita fortalece tu conexión." },
  { texto: "¡Bienvenido/a de vuelta!", complemento: "Los duendes notaron tu presencia." },
  { texto: "¡Me alegra verte!", complemento: "Tu camino sigue brillando." }
];

// Chistes y mensajes simpáticos para tercera visita
const MENSAJES_TERCERA_VISITA = [
  { guardian: "duende", mensaje: "¡Tres veces en un día! ¿Será que te gusta esto? 😏 Los duendes apostamos tréboles a que volvías." },
  { guardian: "hada", mensaje: "¿Otra vez por acá? Me encanta. Empiezo a pensar que somos amigos de verdad. ✨" },
  { guardian: "gnomo", mensaje: "Veo que no podés estar lejos mucho tiempo... Los gnomos entendemos esa obsesión. Nosotros somos iguales con los cristales." },
  { guardian: "elemental", mensaje: "Tu energía ya dejó huella acá hoy. Los elementales sentimos cada visita. Esta es la tercera... interesante." },
  { guardian: "brujo", mensaje: "Mmm, tres visitas. En magia, el tres es un número poderoso. Quizás algo importante viene en camino para vos." },
  { guardian: "criatura", mensaje: "¡Llegaste justo! Estábamos hablando de vos. Bueno, no, pero me gusta hacerte sentir especial. 🦋" }
];

// Función para personalizar texto según género
function personalizarPorGenero(texto, genero) {
  if (!genero || genero === 'el') return texto.replace(/Bienvenido\/a/g, 'Bienvenido');
  if (genero === 'ella') return texto.replace(/Bienvenido\/a/g, 'Bienvenida');
  if (genero === 'neutro') return texto.replace(/Bienvenido\/a/g, 'Bienvenide');
  return texto;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const nombre = searchParams.get('nombre') || 'viajero';
    const genero = searchParams.get('genero') || 'el';

    if (!email) {
      return Response.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400 });
    }

    const hoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const keyVisitas = `visitas:${email}:${hoy}`;

    // Obtener visitas de hoy
    const visitasData = await kv.get(keyVisitas) || {
      count: 0,
      timestamps: [],
      mensajesMostrados: []
    };

    const ahora = Date.now();
    const ultimaVisita = visitasData.timestamps[visitasData.timestamps.length - 1] || 0;
    const tiempoDesdeUltima = ahora - ultimaVisita;
    const dosHorasEnMs = 2 * 60 * 60 * 1000;

    // Determinar si contar como nueva visita
    // Nueva visita si: primera del día O pasaron más de 30 minutos
    const esNuevaVisita = visitasData.count === 0 || tiempoDesdeUltima > 30 * 60 * 1000;

    let resultado = {
      success: true,
      visitaNumero: visitasData.count + (esNuevaVisita ? 1 : 0),
      mostrarMensaje: false,
      tipoMensaje: null,
      mensaje: null
    };

    // Lógica de mensajes según número de visita
    if (esNuevaVisita) {
      const nuevaVisitaNum = visitasData.count + 1;

      if (nuevaVisitaNum === 1) {
        // Primera visita del día: mostrar mensaje completo de bienvenida
        resultado.mostrarMensaje = true;
        resultado.tipoMensaje = 'bienvenida_completa';
        resultado.mensaje = {
          titulo: personalizarPorGenero(`¡Bienvenido/a, ${nombre}!`, genero),
          texto: 'Los guardianes te estaban esperando. Hoy es un buen día para la magia.',
          mostrarConsejo: true // Indica que debe mostrarse el consejo del día completo
        };

      } else if (nuevaVisitaNum === 2 && tiempoDesdeUltima >= dosHorasEnMs) {
        // Segunda visita (después de 2+ horas): mensaje corto
        const msgBase = MENSAJES_SEGUNDA_VISITA[Math.floor(Math.random() * MENSAJES_SEGUNDA_VISITA.length)];
        resultado.mostrarMensaje = true;
        resultado.tipoMensaje = 'segunda_visita';
        resultado.mensaje = {
          titulo: personalizarPorGenero(msgBase.texto, genero).replace('[nombre]', nombre),
          texto: msgBase.complemento,
          mostrarConsejo: false
        };

      } else if (nuevaVisitaNum === 3) {
        // Tercera visita: chiste/mensaje simpático
        const msgChiste = MENSAJES_TERCERA_VISITA[Math.floor(Math.random() * MENSAJES_TERCERA_VISITA.length)];
        resultado.mostrarMensaje = true;
        resultado.tipoMensaje = 'tercera_visita';
        resultado.mensaje = {
          titulo: `Mensaje de un ${msgChiste.guardian}`,
          texto: msgChiste.mensaje.replace('[nombre]', nombre),
          mostrarConsejo: false,
          esChiste: true
        };

      } else {
        // Cuarta visita en adelante: sin mensaje, acceso directo
        resultado.mostrarMensaje = false;
        resultado.tipoMensaje = 'acceso_directo';
        resultado.mensaje = null;
      }

      // Actualizar registro de visitas
      visitasData.count = nuevaVisitaNum;
      visitasData.timestamps.push(ahora);
      if (resultado.tipoMensaje) {
        visitasData.mensajesMostrados.push({
          tipo: resultado.tipoMensaje,
          timestamp: ahora
        });
      }

      // Guardar con expiración a medianoche (máximo 24 horas)
      await kv.set(keyVisitas, visitasData, { ex: 86400 });

      // También actualizar última actividad del usuario
      await actualizarUltimaActividad(email);
    }

    return Response.json(resultado);

  } catch (error) {
    console.error('[CIRCULO/VISITAS] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST: Registrar visita manualmente (útil para testing o ajustes)
export async function POST(request) {
  try {
    const { email, reset } = await request.json();

    if (!email) {
      return Response.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400 });
    }

    const hoy = new Date().toISOString().split('T')[0];
    const keyVisitas = `visitas:${email}:${hoy}`;

    if (reset) {
      // Resetear visitas del día (para testing)
      await kv.del(keyVisitas);
      return Response.json({
        success: true,
        mensaje: 'Visitas reseteadas para hoy'
      });
    }

    return Response.json({
      success: true
    });

  } catch (error) {
    console.error('[CIRCULO/VISITAS] Error POST:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Función auxiliar para actualizar última actividad
async function actualizarUltimaActividad(email) {
  try {
    const userKey = `user:${email}`;
    const usuario = await kv.get(userKey);
    if (usuario) {
      usuario.ultimaActividad = new Date().toISOString();
      await kv.set(userKey, usuario);
    }
  } catch (error) {
    console.error('Error actualizando última actividad:', error);
  }
}
