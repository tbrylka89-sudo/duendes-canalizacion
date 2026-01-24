import { kv } from '@vercel/kv';
import { generarPerfilGuardian } from '@/lib/circulo/voces-guardianes';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSEJO DEL DÍA - DUENDE DE LA SEMANA
// Cada semana hay un duende diferente, pero cada visita genera un mensaje único
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const nombreUsuario = url.searchParams.get('nombre') || 'viajero';
    const emailUsuario = url.searchParams.get('email') || '';

    // Obtener la semana actual del año
    const ahora = new Date();
    const hoy = ahora.toISOString().split('T')[0];
    const semanaDelAno = obtenerSemanaDelAno(ahora);
    const claveGuardianSemanal = `circulo:guardian-semana:${ahora.getFullYear()}-W${semanaDelAno}`;

    // PRIORIDAD 1: Buscar en la rotación semanal REAL (Gaia, Noah, Winter, Marcos)
    const mes = ahora.getMonth() + 1;
    const dia = ahora.getDate();
    let semanaMes = 1;
    if (dia >= 22) semanaMes = 4;
    else if (dia >= 15) semanaMes = 3;
    else if (dia >= 8) semanaMes = 2;

    const rotacionKey = `circulo:duende-semana:${ahora.getFullYear()}:${mes}:${semanaMes}`;
    const rotacionData = await kv.get(rotacionKey);

    let guardianSemana;

    if (rotacionData?.guardian) {
      // Usar el guardián de la rotación REAL
      const g = rotacionData.guardian;
      guardianSemana = {
        id: g.slug || g.id,
        nombre: g.nombre,
        imagen: g.imagen,
        categoria: g.categoria || 'Guardián',
        tipo_ser: 'guardian',
        tipo_ser_nombre: 'Guardián',
        arquetipo: g.descripcion || 'Sabiduría ancestral',
        elemento: g.elemento || 'todos',
        tono_voz: g.personalidad || 'Cálido y sabio',
        forma_hablar: 'Con claridad y cercanía',
        frase_tipica: g.frasesTipicas?.[0] || 'Confía en tu camino',
        url_tienda: g.productoWooCommerce ? `https://duendesdeluruguay.com/?p=${g.productoWooCommerce}` : null
      };
    } else {
      // FALLBACK: Verificar cache viejo o seleccionar del catálogo
      guardianSemana = await kv.get(claveGuardianSemanal);

      if (!guardianSemana) {
        guardianSemana = await seleccionarGuardianSemana(semanaDelAno, ahora.getFullYear());

        if (!guardianSemana) {
          // FALLBACK FINAL: Marcos
          guardianSemana = {
            id: 'marcos',
            nombre: 'Marcos',
            imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/03/Marcos-1.jpg',
            categoria: 'Sabiduría',
            tipo_ser: 'guardian',
            tipo_ser_nombre: 'Guardián',
            arquetipo: 'La claridad que ilumina el camino',
            elemento: 'aire',
            tono_voz: 'Sereno y profundo',
            forma_hablar: 'Con preguntas que abren puertas',
            frase_tipica: 'A veces la respuesta está en la pregunta'
          };
        }

        // Guardar para toda la semana
        await kv.set(claveGuardianSemanal, guardianSemana, { ex: 604800 });
      }
    }

    // Contar visitas del día para esta persona (solo si pasaron 2+ horas desde última)
    let visitasHoy = 1;
    let mensajeRepetido = false;
    const dosHorasMs = 2 * 60 * 60 * 1000; // 2 horas en milisegundos

    if (emailUsuario) {
      const claveVisitas = `circulo:visitas-dia:${emailUsuario}:${hoy}`;
      const visitasData = await kv.get(claveVisitas) || { contador: 0, ultimaVisita: 0 };

      const tiempoDesdeUltima = Date.now() - (visitasData.ultimaVisita || 0);

      if (tiempoDesdeUltima >= dosHorasMs) {
        // Han pasado 2+ horas, cuenta como nueva visita
        visitasHoy = visitasData.contador + 1;
        await kv.set(claveVisitas, {
          contador: visitasHoy,
          ultimaVisita: Date.now()
        }, { ex: 86400 });
      } else {
        // No han pasado 2 horas, mantener mismo contador
        visitasHoy = visitasData.contador || 1;
        mensajeRepetido = true;
      }
    }

    // Generar mensaje según número de visitas del día
    let mensaje;
    let tipoMensaje = 'primera';

    // Si es mensaje repetido (menos de 2h), devolver el último mensaje guardado
    if (mensajeRepetido && emailUsuario) {
      const ultimoMensaje = await kv.get(`circulo:ultimo-mensaje:${emailUsuario}:${hoy}`);
      if (ultimoMensaje) {
        return Response.json({
          success: true,
          semana: semanaDelAno,
          diasRestantes: 7 - ahora.getDay(),
          visitaDelDia: visitasHoy,
          guardian: {
            id: guardianSemana.id,
            nombre: guardianSemana.nombre,
            imagen: guardianSemana.imagen,
            categoria: guardianSemana.categoria,
            tipo_ser: guardianSemana.tipo_ser,
            tipo_ser_nombre: guardianSemana.tipo_ser_nombre,
            arquetipo: guardianSemana.arquetipo,
            elemento: guardianSemana.elemento,
            url_tienda: guardianSemana.url_tienda
          },
          consejo: ultimoMensaje,
          portal: obtenerPortalActual(),
          mensajeRepetido: true
        });
      }
    }

    if (visitasHoy === 1) {
      // Primera visita: mensaje normal (consejo del día)
      tipoMensaje = 'primera';
      mensaje = await generarConsejoUnico(guardianSemana, nombreUsuario, 'primera');
    } else if (visitasHoy === 2) {
      // Segunda visita: comentario extra del duende
      tipoMensaje = 'comentario';
      mensaje = await generarConsejoUnico(guardianSemana, nombreUsuario, 'regreso');
    } else {
      // Tercera visita o más: mensaje gracioso/simpático
      tipoMensaje = 'gracioso';
      mensaje = await generarConsejoUnico(guardianSemana, nombreUsuario, 'chiste');
    }

    // Guardar último mensaje para no regenerar si vuelve antes de 2h
    if (emailUsuario) {
      await kv.set(`circulo:ultimo-mensaje:${emailUsuario}:${hoy}`, mensaje, { ex: 86400 });
    }

    // Calcular cuántos días quedan de esta semana
    const diasRestantes = 7 - ahora.getDay();

    return Response.json({
      success: true,
      semana: semanaDelAno,
      diasRestantes: diasRestantes,
      visitaDelDia: visitasHoy,
      tipoMensaje: tipoMensaje,
      guardian: {
        id: guardianSemana.id,
        nombre: guardianSemana.nombre,
        imagen: guardianSemana.imagen,
        categoria: guardianSemana.categoria,
        tipo_ser: guardianSemana.tipo_ser,
        tipo_ser_nombre: guardianSemana.tipo_ser_nombre,
        arquetipo: guardianSemana.arquetipo,
        elemento: guardianSemana.elemento,
        url_tienda: guardianSemana.url_tienda
      },
      consejo: mensaje,
      portal: obtenerPortalActual()
    });

  } catch (error) {
    console.error('Error generando consejo del día:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SELECCIONAR GUARDIÁN DE LA SEMANA
// ═══════════════════════════════════════════════════════════════════════════════

async function seleccionarGuardianSemana(semana, ano) {
  const catalogo = await kv.get('productos:catalogo') || [];

  if (catalogo.length === 0) return null;

  // Filtrar guardianes válidos
  const guardianesValidos = catalogo.filter(p =>
    p.imagen &&
    p.estado === 'publish' &&
    p.stockStatus !== 'outofstock'
  );

  if (guardianesValidos.length === 0) return null;

  // Selección basada en semana y año (rotativo)
  const seed = (ano * 100 + semana) % guardianesValidos.length;
  const productoSeleccionado = guardianesValidos[seed];

  // Generar perfil completo
  const guardian = generarPerfilGuardian(productoSeleccionado);

  return {
    id: guardian.id,
    nombre: guardian.nombre,
    imagen: guardian.imagen,
    categoria: guardian.categoria,
    tipo_ser: guardian.tipo_ser,
    tipo_ser_nombre: guardian.tipo_ser_info?.nombre || 'Guardián',
    arquetipo: guardian.arquetipo,
    elemento: guardian.elemento,
    tono_voz: guardian.tono_voz,
    forma_hablar: guardian.forma_hablar,
    frase_tipica: guardian.frase_tipica,
    url_tienda: guardian.url_tienda
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERAR CONSEJO ÚNICO POR VISITA
// ═══════════════════════════════════════════════════════════════════════════════

async function generarConsejoUnico(guardian, nombreUsuario, tipoVisita = 'primera') {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Fallbacks según tipo de visita
  const fallbacks = {
    primera: {
      titulo: `Consejo del día de ${guardian.nombre}`,
      mensaje: `${nombreUsuario}, hoy te acompaño en tu camino. Recordá que cada momento es una oportunidad para conectar con la magia.`,
      reflexion: `¿Qué pequeño paso podés dar hoy hacia lo que más deseás?`
    },
    regreso: {
      titulo: `¡Qué lindo verte de nuevo!`,
      mensaje: `${nombreUsuario}, volviste. Eso me pone feliz. Significa que algo de lo que compartimos antes resonó en vos.`,
      reflexion: `¿Qué te trajo de vuelta hoy?`
    },
    chiste: {
      titulo: `${guardian.nombre} quiere hacerte reír`,
      mensaje: `${nombreUsuario}, ¿sabés qué le dijo un duende a otro cuando se perdieron en el bosque? "¡Tranquilo, que la magia siempre encuentra el camino!" Bueno, yo tampoco sé contar chistes... pero al menos te saqué una sonrisa.`,
      reflexion: `¿Cuándo fue la última vez que te reíste de verdad?`
    }
  };

  if (!apiKey) {
    return fallbacks[tipoVisita] || fallbacks.primera;
  }

  const portal = obtenerPortalActual();
  const hora = new Date().getHours();
  const momento = hora < 6 ? 'madrugada' : hora < 12 ? 'mañana' : hora < 19 ? 'tarde' : 'noche';
  const dia = obtenerDiaSemana();

  // Generar un factor de variación para que cada mensaje sea diferente
  const variacion = Date.now().toString().slice(-4);

  // Prompts diferentes según tipo de visita
  const prompts = {
    primera: `Es ${dia} a la ${momento}. ${nombreUsuario} acaba de entrar al Círculo.
Estamos en ${portal.nombre} (${portal.energia}).

Generá un consejo del día ÚNICO con este formato:

TITULO: Consejo del día de ${guardian.nombre}
MENSAJE: [2-3 oraciones directas a ${nombreUsuario}, algo profundo pero práctico para este momento específico]
REFLEXION: [Una pregunta poderosa para que reflexione hoy]

Que sea diferente a cualquier otro consejo. Que ${nombreUsuario} sienta que es solo para él/ella en este momento exacto.`,

    regreso: `Es ${dia} a la ${momento}. ${nombreUsuario} VOLVIÓ al Círculo hoy por segunda vez.
Estamos en ${portal.nombre} (${portal.energia}).

Generá un mensaje de BIENVENIDA DE REGRESO con este formato:

TITULO: ¡${nombreUsuario} volvió!
MENSAJE: [2-3 oraciones expresando genuina alegría de que volvió, algo cálido y cercano. Hacele sentir que notaste que regresó. Puede incluir algo como "me alegra", "qué lindo", etc.]
REFLEXION: [Una pregunta suave sobre qué lo/la trajo de vuelta o qué está buscando]

Que se sienta especial por haber vuelto.`,

    chiste: `Es ${dia} a la ${momento}. ${nombreUsuario} entró al Círculo por TERCERA VEZ hoy. Le gusta venir seguido.
Estamos en ${portal.nombre} (${portal.energia}).

Generá un CHISTE o algo gracioso con este formato:

TITULO: ${guardian.nombre} tiene algo que contarte...
MENSAJE: [Un chiste, comentario gracioso o anécdota divertida relacionada con duendes, magia, naturaleza o tu personalidad. Puede ser un juego de palabras, algo absurdo, o una observación cómica sobre la vida. Tiene que ser simpático y hacer sonreír.]
REFLEXION: [Una pregunta liviana sobre la risa, la alegría o algo no muy profundo]

Que ${nombreUsuario} se ría o al menos sonría. No tiene que ser un chiste perfecto, solo algo que aliviane el momento.`
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: `Sos ${guardian.nombre}, un ${guardian.tipo_ser_nombre} que esta semana está guiando al Círculo de Duendes.

Tu personalidad: ${guardian.tono_voz}
Tu forma de hablar: ${guardian.forma_hablar}
Tu frase característica: "${guardian.frase_tipica}"
Tu elemento: ${guardian.elemento || 'todos los elementos'}
Tu arquetipo: ${guardian.arquetipo || 'sabiduría ancestral'}

REGLAS CRÍTICAS:
- Escribí en español rioplatense (vos, tenés, podés, querés)
- Sé breve pero profundo - máximo 3 oraciones por sección
- NO uses asteriscos, markdown ni formato especial
- Cada mensaje debe ser ÚNICO - usá el código ${variacion} como inspiración sutil
- Hablás en primera persona - SOS ${guardian.nombre}`,
        messages: [{
          role: 'user',
          content: prompts[tipoVisita] || prompts.primera
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Error en API');
    }

    const data = await response.json();
    const texto = data.content?.[0]?.text || '';

    // Parsear la respuesta
    const tituloMatch = texto.match(/TITULO:\s*(.+?)(?=MENSAJE:|$)/s);
    const mensajeMatch = texto.match(/MENSAJE:\s*(.+?)(?=REFLEXION:|$)/s);
    const reflexionMatch = texto.match(/REFLEXION:\s*(.+?)$/s);

    return {
      titulo: tituloMatch?.[1]?.trim() || fallbacks[tipoVisita]?.titulo || `Mensaje de ${guardian.nombre}`,
      mensaje: mensajeMatch?.[1]?.trim() || fallbacks[tipoVisita]?.mensaje || `${nombreUsuario}, gracias por estar acá.`,
      reflexion: reflexionMatch?.[1]?.trim() || fallbacks[tipoVisita]?.reflexion || `¿Qué te trajo hoy?`
    };

  } catch (error) {
    console.error('Error generando consejo:', error);
    return fallbacks[tipoVisita] || fallbacks.primera;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

function obtenerSemanaDelAno(fecha) {
  const primerDia = new Date(fecha.getFullYear(), 0, 1);
  const dias = Math.floor((fecha - primerDia) / (24 * 60 * 60 * 1000));
  return Math.ceil((dias + primerDia.getDay() + 1) / 7);
}

function obtenerDiaSemana() {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return dias[new Date().getDay()];
}

function obtenerPortalActual() {
  const mes = new Date().getMonth();

  if (mes >= 5 && mes <= 7) return { id: 'yule', nombre: 'Portal de Yule', energia: 'Introspección y renacimiento' };
  if (mes >= 8 && mes <= 10) return { id: 'ostara', nombre: 'Portal de Ostara', energia: 'Nuevos comienzos' };
  if (mes === 11 || mes <= 1) return { id: 'litha', nombre: 'Portal de Litha', energia: 'Abundancia plena' };
  return { id: 'mabon', nombre: 'Portal de Mabon', energia: 'Gratitud y cosecha' };
}
