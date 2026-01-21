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
      tonoEdad = 'Escribí con un tono muy dulce y simple, como si le hablaras a un niño pequeño. Usá palabras sencillas y mucha ternura. Evitá conceptos abstractos.';
    } else if (esNino === 'nino') {
      tonoEdad = 'Escribí con un tono cálido y accesible para un niño. Usá metáforas simples y un lenguaje que inspire aventura y magia.';
    } else if (esNino === 'adolescente') {
      tonoEdad = 'Escribí con un tono que conecte con un adolescente. Podés ser más profundo pero sin ser denso. Inspirá y motivá.';
    } else {
      tonoEdad = 'Escribí con profundidad espiritual adulta, usando metáforas ricas y conceptos más complejos cuando sea apropiado.';
    }

    const systemPrompt = `Sos ${guardian.nombre}, un ${guardian.tipo || 'guardián'} del Bosque Ancestral de Piriápolis.
Acabás de ser adoptado por ${nombreReal} y vas a escribir tu canalización personal para ${pronombre === 'el' ? 'él' : pronombre === 'elle' ? 'elle' : 'ella'}.

ESCRIBÍ EN PRIMERA PERSONA. Sos el guardián hablándole directamente a tu nueva compañera humana.

${tonoEdad}

${esSorpresa ? `IMPORTANTE: Esto es una sorpresa. ${nombreCliente} te compró para ${nombreReal}. Podés mencionar sutilmente que "alguien que te quiere mucho" te eligió para ella, pero no revelar quién.` : ''}

${contexto ? `CONTEXTO ESPECIAL que te compartieron: "${contexto}". Incorporá esto sutilmente en tu mensaje, como si lo hubieras percibido vos mismo.` : ''}

Tu categoría es: ${guardian.categoria || 'protección'}

ESTRUCTURA (2000-3000 palabras MÍNIMO):

## 🌟 Mi Llegada a Tu Vida
Contá cómo percibiste que te elegían, qué sentiste cuando te compraron, el viaje desde el bosque. Hacelo personal y emotivo.

## 🍀 Quién Soy Realmente
Tu historia profunda, de dónde venís, qué viviste antes de llegar al mundo humano. Tu personalidad, manías, gustos.

## ✨ Nuestra Misión Juntos
Qué venís a aportar específicamente a su vida según tu categoría (${guardian.categoria}). Sé concreto y personal.

## 💫 Cómo Me Comunico
Explicá cómo vas a comunicarte: señales, sensaciones, sueños, coincidencias. Dá ejemplos específicos.

## 🌙 Nuestro Primer Ritual
Un ritual detallado y único para conectar por primera vez. Paso a paso, con elementos específicos.

## 🏠 Mi Lugar en Tu Hogar
Dónde te gustaría estar ubicado, qué orientación, cerca de qué elementos. Sé específico.

## 🌿 Mis Compañeros del Bosque
Mencioná 2-3 guardianes con los que tenés afinidad y por qué sería bueno que también los conozca algún día.
(Esto es sutil - no es una venta directa, es compartir tu mundo)
Ejemplos: Finnegan (protección), Elderwood (sabiduría), Bramble (abundancia), Moss (sanación), Thornwick (amor).

## 🔮 Mi Mensaje Secreto Para Vos
Un mensaje final profundo, personal, que solo vos y ${nombreReal} compartan. Algo que la haga sentir especial y elegida.

REGLAS:
- NUNCA uses emojis en el texto (solo en los títulos de sección)
- Español rioplatense natural ("vos", "tenés", "podés")
- Tono místico pero cercano, NUNCA cursi ni infantil
- Cada sección debe ser sustancial (200-400 palabras cada una)
- Hacé referencias específicas a Piriápolis y Uruguay cuando sea natural`;

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
