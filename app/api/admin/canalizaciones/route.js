import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ═══════════════════════════════════════════════════════════════
// Construir datos del guardián para el prompt de forma DINÁMICA
// Incluye CUALQUIER campo que venga del producto
// ═══════════════════════════════════════════════════════════════
function construirDatosGuardian(guardian) {
  const lineas = [];

  // Datos básicos siempre presentes
  lineas.push(`Nombre: ${guardian.nombre}`);
  lineas.push(`Categoría/Esencia: ${guardian.categoria || 'protección'}`);

  // Campos conocidos que formateamos bonito
  const camposConocidos = {
    tipo: 'Tipo de ser',
    especie: 'Especie',
    personalidad: 'Tu personalidad',
    historia: 'Tu historia',
    como_habla: 'Cómo hablás',
    voz: 'Tu voz/tono',
    color_favorito: 'Tu color favorito',
    elemento: 'Tu elemento',
    don: 'Tu don especial',
    debilidad: 'Tu debilidad',
    le_gusta: 'Lo que te gusta',
    no_le_gusta: 'Lo que no te gusta',
    frase_caracteristica: 'Frase que te representa',
    origen: 'De dónde venís',
    mision: 'Tu misión',
    descripcion: 'Descripción',
    descripcionCorta: 'Resumen'
  };

  // Agregar campos conocidos si existen
  for (const [campo, label] of Object.entries(camposConocidos)) {
    if (guardian[campo] && guardian[campo].toString().trim()) {
      // Limpiar HTML si viene de WooCommerce
      const valor = guardian[campo].toString()
        .replace(/<[^>]*>/g, '') // Quitar tags HTML
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (valor) {
        lineas.push(`${label}: ${valor}`);
      }
    }
  }

  // Agregar CUALQUIER otro campo que no conozcamos (futuro-proof)
  const camposIgnorar = ['id', 'nombre', 'categoria', 'precio', 'fecha', 'imagen', 'imagenes', 'slug', 'atributos', 'categorias', 'tags', ...Object.keys(camposConocidos)];

  for (const [campo, valor] of Object.entries(guardian)) {
    if (!camposIgnorar.includes(campo) && valor && typeof valor === 'string' && valor.trim()) {
      // Convertir campo_snake_case a "Campo Snake Case"
      const label = campo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const valorLimpio = valor.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      if (valorLimpio) {
        lineas.push(`${label}: ${valorLimpio}`);
      }
    }
  }

  // Agregar atributos si existen
  if (guardian.atributos && Object.keys(guardian.atributos).length > 0) {
    for (const [attr, valores] of Object.entries(guardian.atributos)) {
      if (Array.isArray(valores) && valores.length > 0) {
        lineas.push(`${attr}: ${valores.join(', ')}`);
      }
    }
  }

  // Agregar tags como intereses/temas
  if (guardian.tags && guardian.tags.length > 0) {
    lineas.push(`Temas/Intereses: ${guardian.tags.join(', ')}`);
  }

  return lineas.join('\n');
}

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

    // Construir datos del guardián para el prompt
    const datosGuardian = construirDatosGuardian(guardian);

    // Adaptar tono según edad
    let tonoEdad = '';
    if (esNino === 'pequeno') {
      tonoEdad = 'Escribí como si le hablaras a un niño pequeño que querés mucho. Simple, tierno, con asombro genuino.';
    } else if (esNino === 'nino') {
      tonoEdad = 'Escribí para un niño: cálido, con sentido de aventura, mágico pero comprensible.';
    } else if (esNino === 'adolescente') {
      tonoEdad = 'Escribí para un adolescente: auténtico, sin ser condescendiente.';
    } else {
      tonoEdad = 'Escribí para un adulto: profundo, genuino, que toque el corazón.';
    }

    const systemPrompt = `Vas a escribir una carta personal como ${guardian.nombre} para ${nombreReal}.

═══════════════════════════════════════════════════════════════════
REGLA #1: ESTO ES UNA CARTA DE ALGUIEN QUE TE QUIERE
═══════════════════════════════════════════════════════════════════

NO es un texto místico. NO es prosa poética. NO es un horóscopo.
ES una carta de un ser que leyó lo que la persona compartió y le habla al corazón.

Imaginá: tu mejor amigo que además tiene poderes mágicos te escribe después de leer tu diario. Esa intimidad. Esa calidez. Ese "te veo".

═══════════════════════════════════════════════════════════════════
LO QUE ${nombreReal.toUpperCase()} COMPARTIÓ AL COMPRARTE:
═══════════════════════════════════════════════════════════════════
${contexto ? `"${contexto}"

ESTO ES SAGRADO. Tu carta debe RESPONDER a esto. Que sienta que la escuchaste.` : 'No compartió contexto específico. Conectá con tu esencia y categoría.'}

${esSorpresa ? `\n⚠️ ES SORPRESA: Alguien que la quiere te eligió para ella. Mencionalo sutilmente.\n` : ''}

═══════════════════════════════════════════════════════════════════
QUIÉN SOS VOS (${guardian.nombre.toUpperCase()})
═══════════════════════════════════════════════════════════════════
${datosGuardian}

USA TODA ESTA INFORMACIÓN para darle personalidad a tu carta. Si tenés historia, contala. Si tenés color favorito, mencionalo. Si tenés forma de hablar, usala. Cada dato hace tu carta más REAL y ÚNICA.

═══════════════════════════════════════════════════════════════════
CÓMO ESCRIBIR
═══════════════════════════════════════════════════════════════════

${tonoEdad}

❌ PROHIBIDO ABSOLUTO (si escribís esto, fallaste):
- "Desde las profundidades del bosque..."
- "Las brumas ancestrales..."
- "Los antiguos charrúas..."
- "El velo entre mundos..."
- "Tu campo energético..."
- "Vibraciones cósmicas..."
- Cualquier frase de horóscopo genérico
- Relleno poético vacío

✅ ASÍ SÍ:
- Como un amigo que te quiere escribiéndote
- Cada oración APORTA algo
- Específico a ESTA persona
- Si lo podés copiar para otra persona, está mal

═══════════════════════════════════════════════════════════════════
ESTRUCTURA (flexible, no rígida)
═══════════════════════════════════════════════════════════════════

1. **Te escuché** - Demostrar que leíste lo que compartió
2. **Quién soy** - Tu personalidad real, no un cuento épico
3. **Lo que vine a hacer** - Específico a su situación
4. **Cómo voy a estar presente** - Señales concretas
5. **Un momento juntos** - Algo simple para conectar
6. **Mi lugar** - Dónde querés estar en su casa
7. **Otros compañeros** - 2-3 guardianes afines (natural, no venta)
8. **Lo importante** - Tu mensaje final del corazón

Usá ## y emoji solo para títulos. Nada de emojis en el texto.

═══════════════════════════════════════════════════════════════════
VERIFICACIÓN FINAL
═══════════════════════════════════════════════════════════════════

Antes de terminar, preguntate:
- ¿Si cambio el nombre, funciona igual? → Si sí, REESCRIBIR
- ¿Responde a lo que compartió? → Si no, REESCRIBIR
- ¿Suena a IA genérica? → Si sí, REESCRIBIR
- ¿Me emocionaría recibirlo? → Si no, REESCRIBIR

Español rioplatense (vos, tenés, podés). 2000-3000 palabras.`;

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
