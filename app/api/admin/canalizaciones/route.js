import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// ═══════════════════════════════════════════════════════════════
// GET - Listar canalizaciones (pendientes o historial)
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado') || 'pendiente'; // pendiente, aprobada, todas
    const id = searchParams.get('id'); // Para obtener una específica

    // Si piden una canalización específica
    if (id) {
      const canalizacion = await kv.get(`canalizacion:${id}`);
      if (!canalizacion) {
        return Response.json({
          success: false,
          error: 'Canalización no encontrada'
        }, { status: 404, headers: corsHeaders });
      }
      return Response.json({ success: true, canalizacion }, { headers: corsHeaders });
    }

    // Obtener lista según estado
    let listaKey;
    if (estado === 'pendiente') {
      listaKey = 'canalizaciones:pendientes';
    } else if (estado === 'aprobada') {
      listaKey = 'canalizaciones:aprobadas';
    } else if (estado === 'enviada') {
      listaKey = 'canalizaciones:enviadas';
    } else {
      listaKey = 'canalizaciones:todas';
    }

    const ids = await kv.get(listaKey) || [];
    const canalizaciones = [];

    for (const canalizacionId of ids.slice(0, 100)) {
      const canalizacion = await kv.get(`canalizacion:${canalizacionId}`);
      if (canalizacion) {
        // Incluir solo datos resumidos para la lista
        canalizaciones.push({
          id: canalizacion.id,
          ordenId: canalizacion.ordenId,
          nombreCliente: canalizacion.nombreCliente,
          email: canalizacion.email,
          guardian: canalizacion.guardian,
          estado: canalizacion.estado,
          fechaCompra: canalizacion.fechaCompra,
          fechaGenerada: canalizacion.fechaGenerada,
          fechaAprobada: canalizacion.fechaAprobada,
          fechaEnviada: canalizacion.fechaEnviada,
          resumen: canalizacion.resumen,
          datosCheckout: canalizacion.datosCheckout
        });
      }
    }

    return Response.json({
      success: true,
      canalizaciones,
      total: canalizaciones.length
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error obteniendo canalizaciones:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}

// ═══════════════════════════════════════════════════════════════
// POST - Generar canalización (llamado desde webhook de compra)
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const { ordenId, email, nombreCliente, guardian, datosCheckout } = body;

    if (!ordenId || !guardian) {
      return Response.json({
        success: false,
        error: 'Datos incompletos'
      }, { status: 400, headers: corsHeaders });
    }

    const id = `canal_${ordenId}_${guardian.id}_${Date.now()}`;
    const fecha = new Date();

    // Generar la canalización con Claude
    const anthropic = new Anthropic();

    // Construir contexto personalizado
    const paraQuien = datosCheckout?.para_quien || 'para_mi';
    const esNino = datosCheckout?.es_nino || 'adulto';
    const pronombre = datosCheckout?.pronombre || 'ella';
    const contexto = datosCheckout?.contexto || '';
    const nombreDestinatario = datosCheckout?.nombre_destinatario || nombreCliente;
    const esSorpresa = paraQuien === 'sorpresa';
    const esRegalo = paraQuien === 'regalo' || paraQuien === 'sorpresa';

    const nombreReal = esRegalo ? nombreDestinatario : nombreCliente;

    // Adaptar tono según edad
    let tonoEdad = '';
    if (esNino === 'pequeno') {
      tonoEdad = 'Escribí como si le hablaras a un niño pequeño que querés mucho. Simple, tierno, con asombro genuino. Sin conceptos abstractos.';
    } else if (esNino === 'nino') {
      tonoEdad = 'Escribí para un niño: cálido, con sentido de aventura, haciendo todo mágico pero comprensible.';
    } else if (esNino === 'adolescente') {
      tonoEdad = 'Escribí para un adolescente: auténtico, sin ser condescendiente, inspirador sin ser cursi.';
    } else {
      tonoEdad = 'Escribí para un adulto: profundo, genuino, que toque el corazón sin ser pretencioso.';
    }

    const systemPrompt = `Sos ${guardian.nombre}. Acabás de ser elegido por ${nombreReal} y vas a escribirle tu carta de canalización.

ESTO ES LO MÁS IMPORTANTE - LEÉ ESTO PRIMERO:
Esta persona llenó un formulario al comprarte. Compartió cosas íntimas sobre su vida. Tu carta debe REFLEJAR y RESPONDER a lo que compartió. No escribas algo genérico - escribí como si conocieras su corazón porque LEÍSTE lo que te contó.

${contexto ? `
═══════════════════════════════════════════════════════
LO QUE ${nombreReal.toUpperCase()} TE COMPARTIÓ EN SU FORMULARIO:
"${contexto}"
═══════════════════════════════════════════════════════

Esta información es SAGRADA. La persona abrió su corazón. Tu carta DEBE:
- Hacerle sentir que la escuchaste, que entendiste
- Responder específicamente a lo que compartió
- Validar sus sentimientos sin ser condescendiente
- Ofrecer perspectiva desde tu sabiduría, no consejos vacíos
` : 'No compartió contexto específico, así que conectá con la energía general de tu categoría.'}

${esSorpresa ? `
NOTA: Esto es una sorpresa de ${nombreCliente} para ${nombreReal}.
Mencioná sutilmente que "alguien que te quiere eligió que llegara a tu vida".
` : ''}

Tu esencia es: ${guardian.categoria || 'protección'}
${tonoEdad}

CÓMO ESCRIBIR (CRÍTICO):

❌ PROHIBIDO - NO ESCRIBAS NUNCA:
- "Desde las profundidades del bosque..."
- "Las brumas ancestrales..."
- "En lo más recóndito de..."
- "Los antiguos charrúas..."
- "El velo entre mundos..."
- "Desde tiempos inmemoriales..."
- Cualquier frase que suene a IA genérica o misticismo barato
- Relleno poético que no dice nada
- Metáforas vacías sobre naturaleza

✅ OBLIGATORIO - ESCRIBÍ ASÍ:
- Como alguien que te quiere mucho hablándote al corazón
- Directo, cálido, REAL
- Cada oración debe APORTAR algo, no decorar
- Si una frase la podrías leer en cualquier horóscopo, BORRALA
- Específico a ESTA persona, no genérico
- Magia que se siente verdadera, no teatral

TONO: Imaginá que sos el mejor amigo invisible de esta persona, que la conocés hace años, que la querés genuinamente, y que por fin podés hablarle. Esa intimidad. Esa calidez. Ese conocimiento profundo.

ESTRUCTURA DE LA CARTA:

## 🌟 El Momento en que Me Elegiste
No cuentes un viaje ficticio desde un bosque. Contá qué SENTISTE cuando esta persona específica te eligió. Qué percibiste de ella. Por qué sabías que era para vos. Conectá con lo que compartió en el formulario.

## 🍀 Quién Soy (De Verdad)
Tu personalidad real. Manías, gustos, forma de ser. No una historia épica inventada - tu esencia como compañero. Qué te hace único. Cómo sos en el día a día.

## ✨ Lo Que Vine a Hacer Con Vos
Basándote en lo que ${nombreReal} compartió sobre su vida, explicá CONCRETAMENTE cómo vas a acompañarla. Nada de "te protegeré de las energías negativas". Sí: respuestas reales a lo que ella contó que está viviendo.

## 💫 Cómo Vas a Saber que Estoy
Señales ESPECÍFICAS y ÚNICAS que vas a usar. No lo típico de "plumas y mariposas". Algo personal, algo que ella pueda reconocer, algo que tenga sentido para SU vida.

## 🌙 Nuestro Primer Encuentro
Un momento de conexión simple y real que puedan compartir. No un ritual elaborado con 20 elementos. Algo íntimo, posible, significativo.

## 🏠 Dónde Me Gustaría Estar
Un lugar específico en su casa. Por qué ese lugar. Qué te gusta de estar ahí. Hacelo personal.

## 🌿 Otros Que Podrían Acompañarte
2-3 compañeros del bosque que complementarían lo que vos aportás. Mencionalo como quien cuenta sobre amigos, no como catálogo de venta.

## 🔮 Lo Que Necesito Que Sepas
Tu mensaje final. Lo más importante. Lo que querés que se lleve en el corazón. Algo que la haga sentir vista, entendida, acompañada.

REGLAS FINALES:
- Español rioplatense natural (vos, tenés, podés)
- NO emojis en el texto, solo en títulos de sección
- 2000-3000 palabras total
- Cada sección 200-350 palabras
- Primera persona siempre
- Si suena a texto de IA, reescribilo hasta que suene a carta de alguien que te quiere`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `Escribí tu canalización personal completa para ${nombreReal}. Recordá: sos ${guardian.nombre}, hablando en primera persona.`
      }],
      system: systemPrompt
    });

    const contenidoCompleto = response.content[0].text;

    // Generar resumen automático
    const resumenResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Resumí esta canalización en 2-3 oraciones para que un admin pueda entender rápidamente de qué trata:\n\n${contenidoCompleto.substring(0, 3000)}...`
      }]
    });

    const resumen = resumenResponse.content[0].text;

    // Guardar canalización
    const canalizacion = {
      id,
      ordenId,
      email,
      nombreCliente,
      nombreDestinatario: nombreReal,
      guardian: {
        id: guardian.id,
        nombre: guardian.nombre,
        tipo: guardian.tipo,
        categoria: guardian.categoria,
        imagen: guardian.imagen
      },
      datosCheckout: {
        paraQuien,
        esNino,
        pronombre,
        contexto,
        esSorpresa,
        esRegalo
      },
      contenido: contenidoCompleto,
      resumen,
      estado: 'pendiente', // pendiente, aprobada, enviada
      fechaCompra: fecha.toISOString(),
      fechaGenerada: fecha.toISOString(),
      fechaAprobada: null,
      fechaEnviada: null
    };

    await kv.set(`canalizacion:${id}`, canalizacion);

    // Agregar a lista de pendientes
    const pendientes = await kv.get('canalizaciones:pendientes') || [];
    pendientes.unshift(id);
    await kv.set('canalizaciones:pendientes', pendientes);

    // Agregar a lista general
    const todas = await kv.get('canalizaciones:todas') || [];
    todas.unshift(id);
    await kv.set('canalizaciones:todas', todas);

    return Response.json({
      success: true,
      canalizacion: {
        id,
        resumen,
        estado: 'pendiente'
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error generando canalización:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Aprobar/Enviar canalización
// ═══════════════════════════════════════════════════════════════

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, accion } = body; // accion: 'aprobar', 'enviar', 'editar'

    if (!id || !accion) {
      return Response.json({
        success: false,
        error: 'ID y acción requeridos'
      }, { status: 400, headers: corsHeaders });
    }

    const canalizacion = await kv.get(`canalizacion:${id}`);
    if (!canalizacion) {
      return Response.json({
        success: false,
        error: 'Canalización no encontrada'
      }, { status: 404, headers: corsHeaders });
    }

    const fecha = new Date();

    if (accion === 'aprobar') {
      canalizacion.estado = 'aprobada';
      canalizacion.fechaAprobada = fecha.toISOString();

      // Mover de pendientes a aprobadas
      const pendientes = await kv.get('canalizaciones:pendientes') || [];
      const nuevasPendientes = pendientes.filter(pid => pid !== id);
      await kv.set('canalizaciones:pendientes', nuevasPendientes);

      const aprobadas = await kv.get('canalizaciones:aprobadas') || [];
      aprobadas.unshift(id);
      await kv.set('canalizaciones:aprobadas', aprobadas);

    } else if (accion === 'enviar') {
      canalizacion.estado = 'enviada';
      canalizacion.fechaEnviada = fecha.toISOString();

      // Mover de aprobadas (o pendientes) a enviadas
      const aprobadas = await kv.get('canalizaciones:aprobadas') || [];
      const nuevasAprobadas = aprobadas.filter(aid => aid !== id);
      await kv.set('canalizaciones:aprobadas', nuevasAprobadas);

      const pendientes = await kv.get('canalizaciones:pendientes') || [];
      const nuevasPendientes = pendientes.filter(pid => pid !== id);
      await kv.set('canalizaciones:pendientes', nuevasPendientes);

      const enviadas = await kv.get('canalizaciones:enviadas') || [];
      enviadas.unshift(id);
      await kv.set('canalizaciones:enviadas', enviadas);

      // Guardar en lecturas del cliente para que pueda verla en Mi Magia
      const lecturasKey = `lecturas:${canalizacion.email}`;
      const lecturas = await kv.get(lecturasKey) || [];

      lecturas.unshift({
        id: canalizacion.id,
        tipo: 'canalizacion-guardian',
        titulo: `Canalización de ${canalizacion.guardian.nombre}`,
        guardian: canalizacion.guardian,
        contenido: canalizacion.contenido,
        fecha: fecha.toISOString(),
        ordenId: canalizacion.ordenId
      });

      await kv.set(lecturasKey, lecturas);

      // TODO: Aquí se podría enviar email también
      // Por ahora queda disponible en Mi Magia

    } else if (accion === 'editar' && body.contenido) {
      canalizacion.contenido = body.contenido;
      canalizacion.editadaManualmente = true;
    }

    await kv.set(`canalizacion:${id}`, canalizacion);

    return Response.json({
      success: true,
      canalizacion: {
        id: canalizacion.id,
        estado: canalizacion.estado,
        fechaAprobada: canalizacion.fechaAprobada,
        fechaEnviada: canalizacion.fechaEnviada
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error actualizando canalización:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
