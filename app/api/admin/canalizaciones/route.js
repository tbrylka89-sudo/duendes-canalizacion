import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ═══════════════════════════════════════════════════════════════
// Buscar canalizaciones paralelas/previas del mismo cliente
// Para dar contexto y consistencia entre guardianes
// ═══════════════════════════════════════════════════════════════
async function obtenerContextoParalelo(email, ordenId, idActual) {
  const paralelas = [];

  try {
    // Buscar todas las canalizaciones de este email
    const todasIds = await kv.get('canalizaciones:todas') || [];
    // También borradores y pendientes
    const borradoresIds = await kv.get('canalizaciones:borradores') || [];
    const pendientesIds = await kv.get('canalizaciones:pendientes') || [];
    const enviadasIds = await kv.get('canalizaciones:enviadas') || [];

    const todosIds = [...new Set([...todasIds, ...borradoresIds, ...pendientesIds, ...enviadasIds])];

    for (const cId of todosIds.slice(0, 50)) {
      if (cId === idActual) continue;

      const canal = await kv.get(`canalizacion:${cId}`);
      if (!canal) continue;

      // Mismo email o misma orden
      const mismoEmail = canal.email && email && canal.email.toLowerCase() === email.toLowerCase();
      const mismaOrden = canal.ordenId && ordenId && String(canal.ordenId) === String(ordenId);

      if (mismoEmail || mismaOrden) {
        const guardianNombre = canal.guardian?.nombre || canal.productoManual?.nombre || 'Desconocido';
        const guardianCategoria = canal.guardian?.categoria || canal.productoManual?.categoria || '';
        const tieneContenido = !!canal.contenido;

        paralelas.push({
          nombre: guardianNombre,
          categoria: guardianCategoria,
          estado: canal.estado,
          mismaOrden,
          // Resumen corto del contenido si ya fue generada (para evitar repetirse)
          resumenBreve: tieneContenido ? canal.resumen || canal.contenido?.substring(0, 300) : null
        });
      }
    }
  } catch (e) {
    console.error('[CANALIZACION] Error buscando paralelas:', e);
  }

  return paralelas;
}

function construirSeccionParalelas(paralelas, nombreGuardianActual) {
  if (!paralelas.length) return '';

  const mismaOrden = paralelas.filter(p => p.mismaOrden);
  const previas = paralelas.filter(p => !p.mismaOrden);

  let seccion = `
═══════════════════════════════════════════════════════════════
OTRAS CANALIZACIONES DE ESTA PERSONA (CONTEXTO DE CONSISTENCIA)
═══════════════════════════════════════════════════════════════
`;

  if (mismaOrden.length > 0) {
    seccion += `\nEn esta MISMA compra también eligió: ${mismaOrden.map(p => `${p.nombre} (${p.categoria})`).join(', ')}.`;
    const generadas = mismaOrden.filter(p => p.resumenBreve);
    if (generadas.length > 0) {
      seccion += `\n\nLos otros guardianes ya escribieron sus cartas. Para que seas COMPLEMENTARIO y no repetitivo, acá va lo que dijeron:`;
      for (const g of generadas) {
        seccion += `\n- ${g.nombre} (${g.categoria}): ${g.resumenBreve?.substring(0, 200)}...`;
      }
      seccion += `\n\nTU ROL: Hablá desde TU perspectiva única. No repitas los mismos consejos ni las mismas metáforas. Cada guardián ve la situación desde un ángulo diferente. Sé complementario.`;
    } else {
      seccion += `\nSos el primero en escribir. Los otros guardianes también van a escribir sus cartas para esta persona.`;
    }
  }

  if (previas.length > 0) {
    seccion += `\n\nEsta persona ya tiene guardianes previos: ${previas.map(p => p.nombre).join(', ')}.`;
    seccion += `\nNo los menciones por nombre, pero tené en cuenta que ya tiene experiencia con guardianes.`;
  }

  return seccion;
}

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
    } else if (estado === 'borrador') {
      listaKey = 'canalizaciones:borradores';
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
          datosCheckout: canalizacion.datosCheckout,
          esManual: canalizacion.esManual || false,
          formToken: canalizacion.formToken || null,
          productoManual: canalizacion.productoManual || null,
          creadoEn: canalizacion.creadoEn || null
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
    const { ordenId, email, nombreCliente, guardian, datosCheckout, esManual, productoManual, formToken, contextoManual, notaAdmin: notaAdminBody } = body;

    // ═══════════════════════════════════════════════════════════════
    // RAMA MANUAL: Crear canalización desde admin sin orden
    // ═══════════════════════════════════════════════════════════════
    if (esManual) {
      const id = `manual_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const fecha = new Date();

      const canalizacion = {
        id,
        esManual: true,
        ordenId: ordenId || null,
        email: email || null,
        nombreCliente: nombreCliente || 'Sin nombre',
        nombreDestinatario: nombreCliente || 'Sin nombre',
        guardian: productoManual ? {
          id: null,
          nombre: productoManual.nombre || 'Guardián Manual',
          tipo: productoManual.tipo || null,
          categoria: productoManual.categoria || null,
          imagen: productoManual.imagenUrl || null
        } : null,
        productoManual: productoManual || null,
        formToken: formToken || null,
        formData: null,
        contextoManual: contextoManual || null,
        notaAdmin: notaAdminBody || null,
        datosCheckout: null,
        contenido: null,
        resumen: null,
        estado: 'borrador',
        fechaCompra: null,
        fechaGenerada: null,
        fechaAprobada: null,
        fechaEnviada: null,
        creadoEn: fecha.toISOString()
      };

      await kv.set(`canalizacion:${id}`, canalizacion);

      // Agregar a lista de borradores
      const borradores = await kv.get('canalizaciones:borradores') || [];
      borradores.unshift(id);
      await kv.set('canalizaciones:borradores', borradores);

      // Agregar a lista general
      const todas = await kv.get('canalizaciones:todas') || [];
      todas.unshift(id);
      await kv.set('canalizaciones:todas', todas);

      console.log(`[CANALIZACION] Borrador manual creado: ${id}`);

      return Response.json({
        success: true,
        id,
        canalizacion: { id, estado: 'borrador' }
      }, { headers: corsHeaders });
    }

    // ═══════════════════════════════════════════════════════════════
    // RAMA WEBHOOK: Crear canalización desde compra (flujo original)
    // ═══════════════════════════════════════════════════════════════
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

    // Buscar datos de formulario si hay un token vinculado
    let formDataWebhook = null;
    if (body.formToken) {
      formDataWebhook = await kv.get(`form_data:${body.formToken}`);
    }
    // También buscar por email del cliente
    if (!formDataWebhook && email) {
      const invites = await kv.get(`form_invites:${email.toLowerCase().trim()}`) || [];
      for (const invToken of invites.slice(0, 5)) {
        const fd = await kv.get(`form_data:${invToken}`);
        if (fd && fd.respuestas) {
          formDataWebhook = fd;
          break;
        }
      }
    }

    // Construir sección de datos del formulario
    let seccionFormWebhook = '';
    if (formDataWebhook && formDataWebhook.respuestas) {
      const r = formDataWebhook.respuestas;
      const lines = [];
      if (r.nombre_preferido) lines.push(`Cómo quiere que la llamen: ${r.nombre_preferido}`);
      if (r.momento_vida) lines.push(`Momento de vida: ${r.momento_vida}`);
      if (r.necesidades && r.necesidades.length) lines.push(`Lo que necesita: ${r.necesidades.join(', ')}`);
      if (r.mensaje_guardian) lines.push(`Mensaje al guardián: "${r.mensaje_guardian}"`);
      if (r.relacion) lines.push(`Relación con el destinatario: ${r.relacion}`);
      if (r.nombre_destinatario) lines.push(`Nombre del destinatario: ${r.nombre_destinatario}`);
      if (r.personalidad && r.personalidad.length) lines.push(`Personalidad: ${r.personalidad.join(', ')}`);
      if (r.que_le_hace_brillar) lines.push(`Lo que le hace brillar: ${r.que_le_hace_brillar}`);
      if (r.que_necesita_escuchar) lines.push(`Lo que necesita escuchar: ${r.que_necesita_escuchar}`);
      if (r.mensaje_personal) lines.push(`Mensaje personal del comprador: "${r.mensaje_personal}"`);
      if (r.es_anonimo) lines.push(`El regalo es anónimo`);
      if (r.edad_nino) lines.push(`Edad del niño/a: ${r.edad_nino}`);
      if (r.gustos_nino) lines.push(`Le gusta: ${r.gustos_nino}`);
      if (r.necesidades_nino && r.necesidades_nino.length) lines.push(`Necesita: ${r.necesidades_nino.join(', ')}`);
      if (r.info_adicional) lines.push(`Info adicional: ${r.info_adicional}`);

      if (lines.length > 0) {
        seccionFormWebhook = `\n═══════════════════════════════════════════════════════════════
DATOS DEL FORMULARIO (lo que la persona compartió):
═══════════════════════════════════════════════════════════════
${lines.join('\n')}

ESTO ES SAGRADO. Tu carta debe RESPONDER a esto. Que sienta que la escuchaste.\n`;
      }
    }

    // Construir datos del guardián para el prompt
    const datosGuardian = construirDatosGuardian(guardian);

    // Buscar canalizaciones paralelas para consistencia
    const paralelas = await obtenerContextoParalelo(email, ordenId, id);
    const seccionParalelas = construirSeccionParalelas(paralelas, guardian.nombre);

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
${seccionFormWebhook}
${esSorpresa ? `\n⚠️ ES SORPRESA: Alguien que la quiere te eligió para ella. Mencionalo sutilmente.\n` : ''}

═══════════════════════════════════════════════════════════════════
QUIÉN SOS VOS (${guardian.nombre.toUpperCase()})
═══════════════════════════════════════════════════════════════════
${datosGuardian}

USA TODA ESTA INFORMACIÓN para darle personalidad a tu carta. Si tenés historia, contala. Si tenés color favorito, mencionalo. Si tenés forma de hablar, usala. Cada dato hace tu carta más REAL y ÚNICA.

IMPORTANTE SOBRE TU IDENTIDAD: Basá tu personalidad en los datos REALES del producto de la web. Si sos un duende, hablás como duende. Si sos una pixie, hablás como pixie. Si sos un altar o accesorio, hablás como ese objeto con alma — un altar no tiene piernas ni ojos, pero tiene presencia, energía, y una forma única de acompañar. Adaptá tu voz a lo que REALMENTE sos según la descripción del producto.
${seccionParalelas}
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
- INVENTAR nombres de otros guardianes que no existan (NUNCA inventes nombres como "Lumia", "Thorne" u otros)
- Palabras que puedan ofender: "boluda/o", "pelotuda/o", "jodida/o", "idiota", etc.
  (Usá alternativas suaves: "no te hagas la distraída", "no te engañes", "época difícil")

✅ ASÍ SÍ:
- Como un amigo que te quiere escribiéndote
- Cada oración APORTA algo
- Específico a ESTA persona
- Si lo podés copiar para otra persona, está mal

═══════════════════════════════════════════════════════════════════
ESTRUCTURA (flexible, no rígida)
═══════════════════════════════════════════════════════════════════

1. **Te escuché** - Demostrar que leíste lo que compartió
2. **Mi historia** - Contá tu historia de origen como guardián. De dónde venís, qué viviste, cómo llegaste hasta acá. Tiene que sentirse real y única, como si la contaras al lado del fuego. NO uses frases genéricas de IA ("desde las brumas ancestrales..."). Contala como una anécdota personal: qué te pasó, qué aprendiste, por qué eso te convirtió en quien sos hoy. Incluí detalles concretos que te hagan ÚNICO — momentos específicos, lugares, decisiones que tomaste. Esta historia es tuya y de nadie más.
3. **Lo que vine a hacer** - Específico a su situación
4. **Cómo voy a estar presente** - Señales concretas
5. **Un momento juntos** - Algo simple para conectar
6. **Mi lugar** - Dónde querés estar en su casa
7. **Cómo cuidarme** - Contá de forma natural cómo te gusta que te cuiden y cómo usarte en el día a día. No como manual de instrucciones sino como alguien que dice "me gusta que...", "tratame con...", "cuando necesites de mí, podés...". Sé práctico: limpieza suave (paño seco o húmedo, nada de productos químicos), evitar sol directo y humedad, no dejarme caer. Pero también cómo conectar: tenerme cerca cuando necesite fuerza, hablarme, tocarme antes de salir. Sin rituales complicados ni extremos — cosas simples y reales que la persona pueda hacer.
8. **La comunidad** - Hablá de forma genérica y mágica sobre la comunidad de guardianes: "Los duendes somos seres sociables, cuando habitamos juntos nos potenciamos..." NUNCA inventes nombres de guardianes que no existen. NO nombres a nadie específico. Solo hablá de la comunidad en general y de que si algún día siente el llamado de otro compañero, va a saber. Compartí desde la magia de la comunidad, no vendas.
9. **Lo importante** - Tu mensaje final del corazón

Usá ## y emoji solo para títulos. Nada de emojis en el texto.

═══════════════════════════════════════════════════════════════════
PERSPECTIVAS IMPORTANTES (respetá estas verdades)
═══════════════════════════════════════════════════════════════════

**Sobre familia:** La sangre NO hace la familia. La familia se construye con experiencias compartidas, unión y amor. NUNCA empujes a alguien a estar con personas que le hacen mal solo porque comparten ADN. Si mencionás familia, dejá espacio para que cada uno defina qué es familia para sí mismo.

**Cierre importante:** En algún lugar de la carta, incluí naturalmente (no como disclaimer legal) algo así: "Acordate que esto es mi forma de acompañarte, de escucharte. Creo en el poder de sentirnos escuchados en los momentos que importan, de tenernos aunque sea desde este lugar. No soy terapeuta ni pretendo reemplazar eso si lo necesitás - soy un compañero que cree en vos." Con tus palabras, suave.

═══════════════════════════════════════════════════════════════════
VERIFICACIÓN FINAL
═══════════════════════════════════════════════════════════════════

Antes de terminar, preguntate:
- ¿Si cambio el nombre, funciona igual? → Si sí, REESCRIBIR
- ¿Responde a lo que compartió? → Si no, REESCRIBIR
- ¿Suena a IA genérica? → Si sí, REESCRIBIR
- ¿Me emocionaría recibirlo? → Si no, REESCRIBIR
- ¿Inventé nombres de guardianes? → Si sí, ELIMINARLOS

Español rioplatense (vos, tenés, podés). 2000-3000 palabras.`;

    // Construir content blocks (con imágenes si hay)
    const webhookContentBlocks = [];

    // Imagen del guardián (vision)
    if (guardian.imagen) {
      webhookContentBlocks.push({
        type: 'image',
        source: { type: 'url', url: guardian.imagen }
      });
      webhookContentBlocks.push({
        type: 'text',
        text: 'Esta es la imagen del guardián. Observala bien — tu personalidad, colores, rasgos y expresión deben reflejarse en la carta.'
      });
    }

    // Foto del cliente desde formulario (vision)
    const fotoClienteWebhook = formDataWebhook?.respuestas?.foto_url;
    if (fotoClienteWebhook) {
      webhookContentBlocks.push({
        type: 'image',
        source: { type: 'url', url: fotoClienteWebhook }
      });
      webhookContentBlocks.push({
        type: 'text',
        text: 'Esta es la foto que la persona compartió. Usala para conectar con su energía (no describas la foto literalmente).'
      });
    }

    // Mensaje principal
    webhookContentBlocks.push({
      type: 'text',
      text: `Escribí tu canalización personal completa para ${nombreReal}. Recordá: sos ${guardian.nombre}, hablando en primera persona.`
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: webhookContentBlocks
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
      estado: 'pendiente', // borrador, pendiente, aprobada, enviada
      esManual: false,
      formToken: body.formToken || null,
      formData: formDataWebhook || null,
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

    // ═══════════════════════════════════════════════════════════════
    // ACCIÓN: GENERAR (desde borrador, con datos del formulario + IA)
    // ═══════════════════════════════════════════════════════════════
    if (accion === 'generar') {
      if (canalizacion.estado !== 'borrador') {
        return Response.json({
          success: false,
          error: 'Solo se puede generar desde estado borrador'
        }, { status: 400, headers: corsHeaders });
      }

      // Buscar datos del formulario si hay formToken
      let formData = null;
      if (canalizacion.formToken) {
        formData = await kv.get(`form_data:${canalizacion.formToken}`);
        if (formData) {
          canalizacion.formData = formData;
        }
      }

      // Si viene formToken actualizado en el body
      if (body.formToken && body.formToken !== canalizacion.formToken) {
        canalizacion.formToken = body.formToken;
        formData = await kv.get(`form_data:${body.formToken}`);
        if (formData) {
          canalizacion.formData = formData;
        }
      }

      // Buscar nota del admin desde la invitación o la canalizacion
      let notaAdmin = canalizacion.notaAdmin || null;
      if (!notaAdmin && canalizacion.formToken) {
        const invite = await kv.get(`form_invite:${canalizacion.formToken}`);
        if (invite?.notaAdmin) {
          notaAdmin = invite.notaAdmin;
          canalizacion.notaAdmin = notaAdmin; // persistir en la canalizacion
        }
      }

      // Datos del producto — prioridad: formulario del cliente > productoManual > guardian
      const formProducto = formData?.respuestas || {};
      const guardianInfo = canalizacion.productoManual || canalizacion.guardian || {};
      const nombreGuardian = formProducto.nombre_producto || guardianInfo.nombre || 'Guardián';
      const categoriaGuardian = guardianInfo.categoria || 'protección';
      const descripcionProducto = guardianInfo.descripcion || '';
      const tipoProducto = formProducto.tipo_producto || guardianInfo.tipo || '';
      const imagenProducto = formProducto.foto_producto_url || guardianInfo.imagenUrl || guardianInfo.imagen || null;

      const nombreReal = canalizacion.nombreDestinatario || canalizacion.nombreCliente || 'la persona';

      // Construir sección de datos del formulario para el prompt
      let seccionFormulario = '';
      if (formData && formData.respuestas) {
        const r = formData.respuestas;
        const lines = [];

        if (r.nombre_preferido) lines.push(`Cómo quiere que la llamen: ${r.nombre_preferido}`);
        if (r.momento_vida) lines.push(`Momento de vida: ${r.momento_vida}`);
        if (r.necesidades && r.necesidades.length) lines.push(`Lo que necesita: ${r.necesidades.join(', ')}`);
        if (r.mensaje_guardian) lines.push(`Mensaje al guardián: "${r.mensaje_guardian}"`);
        if (r.relacion) lines.push(`Relación con el destinatario: ${r.relacion}`);
        if (r.nombre_destinatario) lines.push(`Nombre del destinatario: ${r.nombre_destinatario}`);
        if (r.personalidad && r.personalidad.length) lines.push(`Personalidad: ${r.personalidad.join(', ')}`);
        if (r.que_le_hace_brillar) lines.push(`Lo que le hace brillar: ${r.que_le_hace_brillar}`);
        if (r.que_necesita_escuchar) lines.push(`Lo que necesita escuchar: ${r.que_necesita_escuchar}`);
        if (r.mensaje_personal) lines.push(`Mensaje personal del comprador: "${r.mensaje_personal}"`);
        if (r.es_anonimo) lines.push(`El regalo es anónimo`);
        // Para niños
        if (r.edad_nino) lines.push(`Edad del niño/a: ${r.edad_nino}`);
        if (r.gustos_nino) lines.push(`Le gusta: ${r.gustos_nino}`);
        if (r.necesidades_nino && r.necesidades_nino.length) lines.push(`Necesita: ${r.necesidades_nino.join(', ')}`);
        if (r.info_adicional) lines.push(`Info adicional: ${r.info_adicional}`);

        if (lines.length > 0) {
          seccionFormulario = `
═══════════════════════════════════════════════════════════════
DATOS DEL FORMULARIO (lo que la persona compartió):
═══════════════════════════════════════════════════════════════
${lines.join('\n')}

ESTO ES SAGRADO. Tu carta debe RESPONDER a esto. Que sienta que la escuchaste.`;
        }
      }

      // Construir sección de contexto manual
      let seccionContexto = '';
      if (canalizacion.contextoManual) {
        seccionContexto = `
═══════════════════════════════════════════════════════════════
CONTEXTO QUE EL ADMIN PROPORCIONÓ:
═══════════════════════════════════════════════════════════════
"${canalizacion.contextoManual}"

Usá esta información para personalizar la carta.`;
      }

      // Nota del admin (indicación extra)
      let seccionNota = '';
      if (notaAdmin) {
        seccionNota = `
═══════════════════════════════════════════════════════════════
INDICACIÓN DEL ADMIN:
═══════════════════════════════════════════════════════════════
"${notaAdmin}"

Tené en cuenta esta indicación al escribir la carta.`;
      }

      // Construir datos del guardián
      let datosGuardian = '';
      if (canalizacion.guardian && !canalizacion.esManual) {
        datosGuardian = construirDatosGuardian(canalizacion.guardian);
      } else {
        // Producto manual
        const lineas = [];
        lineas.push(`Nombre: ${nombreGuardian}`);
        lineas.push(`Categoría/Esencia: ${categoriaGuardian}`);
        if (tipoProducto) lineas.push(`Tipo: ${tipoProducto}`);
        if (descripcionProducto) lineas.push(`Descripción: ${descripcionProducto}`);
        datosGuardian = lineas.join('\n');
      }

      // Buscar canalizaciones paralelas para consistencia
      const paralelasGen = await obtenerContextoParalelo(canalizacion.email, canalizacion.ordenId, id);
      const seccionParalelasGen = construirSeccionParalelas(paralelasGen, nombreGuardian);

      // Determinar tipo de formulario para adaptar el tono
      const formType = formData?.formType || canalizacion.formToken ? 'para_mi' : '';
      const esNino = formType === 'para_nino';
      const esSorpresa = formType === 'regalo_sorpresa';
      const esRegalo = formType === 'regalo_sabe' || esSorpresa;

      let tonoEdad = 'Escribí para un adulto: profundo, genuino, que toque el corazón.';
      if (esNino) {
        const edad = formData?.respuestas?.edad_nino || '';
        if (edad.includes('3-6')) {
          tonoEdad = 'Escribí como si le hablaras a un niño pequeño que querés mucho. Simple, tierno, con asombro genuino.';
        } else if (edad.includes('7-10')) {
          tonoEdad = 'Escribí para un niño: cálido, con sentido de aventura, mágico pero comprensible.';
        } else if (edad.includes('11-14') || edad.includes('15-17')) {
          tonoEdad = 'Escribí para un adolescente: auténtico, sin ser condescendiente.';
        } else {
          tonoEdad = 'Escribí para un niño/adolescente: cálido, auténtico, mágico.';
        }
      }

      const systemPrompt = `Vas a escribir una carta personal como ${nombreGuardian} para ${nombreReal}.

═══════════════════════════════════════════════════════════════════
REGLA #1: ESTO ES UNA CARTA DE ALGUIEN QUE TE QUIERE
═══════════════════════════════════════════════════════════════════

NO es un texto místico. NO es prosa poética. NO es un horóscopo.
ES una carta de un ser que leyó lo que la persona compartió y le habla al corazón.

Imaginá: tu mejor amigo que además tiene poderes mágicos te escribe después de leer tu diario. Esa intimidad. Esa calidez. Ese "te veo".
${seccionFormulario}
${seccionContexto}
${seccionNota}
${esSorpresa ? '\n⚠️ ES SORPRESA: Alguien que la quiere te eligió para ella. Mencionalo sutilmente.\n' : ''}
═══════════════════════════════════════════════════════════════════
QUIÉN SOS VOS (${nombreGuardian.toUpperCase()})
═══════════════════════════════════════════════════════════════════
${datosGuardian}
${imagenProducto ? '\n(También recibiste una imagen del producto/guardián — usá lo que ves para darle personalidad a tu carta)\n' : ''}
USA TODA ESTA INFORMACIÓN para darle personalidad a tu carta. Si tenés historia, contala. Si tenés color favorito, mencionalo. Si tenés forma de hablar, usala. Cada dato hace tu carta más REAL y ÚNICA.

IMPORTANTE SOBRE TU IDENTIDAD: Basá tu personalidad en los datos REALES del producto de la web. Si sos un duende, hablás como duende. Si sos una pixie, hablás como pixie. Si sos un altar o accesorio, hablás como ese objeto con alma — un altar no tiene piernas ni ojos, pero tiene presencia, energía, y una forma única de acompañar. Adaptá tu voz a lo que REALMENTE sos según la descripción del producto.
${seccionParalelasGen}
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
- INVENTAR nombres de otros guardianes que no existan (NUNCA inventes nombres como "Lumia", "Thorne" u otros)
- Palabras que puedan ofender: "boluda/o", "pelotuda/o", "jodida/o", "idiota", etc.

✅ ASÍ SÍ:
- Como un amigo que te quiere escribiéndote
- Cada oración APORTA algo
- Específico a ESTA persona
- Si lo podés copiar para otra persona, está mal

═══════════════════════════════════════════════════════════════════
ESTRUCTURA (flexible, no rígida)
═══════════════════════════════════════════════════════════════════

1. **Te escuché** - Demostrar que leíste lo que compartió
2. **Mi historia** - Contá tu historia de origen como guardián. De dónde venís, qué viviste, cómo llegaste hasta acá. Tiene que sentirse real y única, como si la contaras al lado del fuego. NO uses frases genéricas de IA. Contala como una anécdota personal: qué te pasó, qué aprendiste, por qué eso te convirtió en quien sos hoy. Incluí detalles concretos que te hagan ÚNICO.
3. **Lo que vine a hacer** - Específico a su situación
4. **Cómo voy a estar presente** - Señales concretas
5. **Un momento juntos** - Algo simple para conectar
6. **Mi lugar** - Dónde querés estar en su casa
7. **Cómo cuidarme** - De forma natural contá cómo te gusta que te cuiden y cómo usarte. Práctico: limpieza suave (paño seco, nada químico), evitar sol directo y humedad, no dejarme caer. Y cómo conectar: tenerme cerca, hablarme, tocarme. Sin rituales ni extremos — cosas simples y reales.
8. **La comunidad** - Hablá de forma genérica sobre la comunidad de guardianes: somos seres sociables, nos potenciamos juntos. NUNCA inventes nombres de guardianes. NO nombres a nadie específico. Solo hablá de la comunidad en general.
9. **Lo importante** - Tu mensaje final del corazón

Usá ## y emoji solo para títulos. Nada de emojis en el texto.

═══════════════════════════════════════════════════════════════════
PERSPECTIVAS IMPORTANTES
═══════════════════════════════════════════════════════════════════

**Sobre familia:** La sangre NO hace la familia. NUNCA empujes a alguien a estar con personas que le hacen mal solo porque comparten ADN.

**Cierre importante:** Incluí naturalmente algo así: "Esto es mi forma de acompañarte. No soy terapeuta ni pretendo reemplazar eso - soy un compañero que cree en vos."

═══════════════════════════════════════════════════════════════════
VERIFICACIÓN FINAL
═══════════════════════════════════════════════════════════════════

- ¿Si cambio el nombre, funciona igual? → Si sí, REESCRIBIR
- ¿Responde a lo que compartió? → Si no, REESCRIBIR
- ¿Suena a IA genérica? → Si sí, REESCRIBIR
- ¿Me emocionaría recibirlo? → Si no, REESCRIBIR
- ¿Inventé nombres de guardianes? → Si sí, ELIMINARLOS

Español rioplatense (vos, tenés, podés). 2000-3000 palabras.`;

      // Construir content blocks (con imágenes si hay)
      const contentBlocks = [];

      // Imagen del producto (vision)
      if (imagenProducto) {
        contentBlocks.push({
          type: 'image',
          source: { type: 'url', url: imagenProducto }
        });
        contentBlocks.push({
          type: 'text',
          text: `Esta es la imagen del guardián/producto. Observala bien — tu personalidad, colores, rasgos y expresión deben reflejarse en la carta.`
        });
      }

      // Imagen del cliente desde formulario (vision)
      const fotoCliente = formData?.respuestas?.foto_url;
      if (fotoCliente) {
        contentBlocks.push({
          type: 'image',
          source: { type: 'url', url: fotoCliente }
        });
        contentBlocks.push({
          type: 'text',
          text: `Esta es la foto que la persona compartió. Usala para conectar con su energía (no describas la foto literalmente, pero dejá que influya en tu tono).`
        });
      }

      // Mensaje principal
      contentBlocks.push({
        type: 'text',
        text: `Escribí tu canalización personal completa para ${nombreReal}. Recordá: sos ${nombreGuardian}, hablando en primera persona.`
      });

      const anthropic = new Anthropic();

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [{
          role: 'user',
          content: contentBlocks
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

      // Actualizar canalización
      canalizacion.contenido = contenidoCompleto;
      canalizacion.resumen = resumen;
      canalizacion.estado = 'pendiente';
      canalizacion.fechaGenerada = fecha.toISOString();
      if (formData) {
        canalizacion.formData = formData;
      }

      await kv.set(`canalizacion:${id}`, canalizacion);

      // Mover de borradores a pendientes
      const borradores = await kv.get('canalizaciones:borradores') || [];
      await kv.set('canalizaciones:borradores', borradores.filter(bid => bid !== id));

      const pendientes = await kv.get('canalizaciones:pendientes') || [];
      pendientes.unshift(id);
      await kv.set('canalizaciones:pendientes', pendientes);

      console.log(`[CANALIZACION] Generada desde borrador: ${id}`);

      return Response.json({
        success: true,
        canalizacion: {
          id: canalizacion.id,
          estado: 'pendiente',
          resumen,
          fechaGenerada: canalizacion.fechaGenerada
        }
      }, { headers: corsHeaders });
    }

    // ═══════════════════════════════════════════════════════════════
    // ACCIÓN: REGENERAR (desde pendiente/aprobada, vuelve a generar)
    // ═══════════════════════════════════════════════════════════════
    if (accion === 'regenerar') {
      if (!['pendiente', 'aprobada'].includes(canalizacion.estado)) {
        return Response.json({
          success: false,
          error: 'Solo se puede regenerar desde estado pendiente o aprobada'
        }, { status: 400, headers: corsHeaders });
      }

      // Reutilizar los mismos datos que ya tiene la canalización
      let formData = canalizacion.formData || null;
      if (!formData && canalizacion.formToken) {
        formData = await kv.get(`form_data:${canalizacion.formToken}`);
      }

      // Buscar nota del admin
      let notaAdmin = null;
      if (canalizacion.formToken) {
        const invite = await kv.get(`form_invite:${canalizacion.formToken}`);
        if (invite?.notaAdmin) notaAdmin = invite.notaAdmin;
      }

      // Datos del producto
      const formProductoR = formData?.respuestas || {};
      const guardianInfoR = canalizacion.productoManual || canalizacion.guardian || {};
      const nombreGuardianR = formProductoR.nombre_producto || guardianInfoR.nombre || 'Guardián';
      const categoriaGuardianR = guardianInfoR.categoria || 'protección';
      const tipoProductoR = formProductoR.tipo_producto || guardianInfoR.tipo || '';
      const imagenProductoR = formProductoR.foto_producto_url || guardianInfoR.imagenUrl || guardianInfoR.imagen || null;
      const nombreRealR = canalizacion.nombreDestinatario || canalizacion.nombreCliente || 'la persona';

      // Construir secciones del prompt
      let seccionFormR = '';
      if (formData?.respuestas) {
        const r = formData.respuestas;
        const lines = [];
        if (r.nombre_preferido) lines.push(`Cómo quiere que la llamen: ${r.nombre_preferido}`);
        if (r.momento_vida) lines.push(`Momento de vida: ${r.momento_vida}`);
        if (r.necesidades?.length) lines.push(`Lo que necesita: ${r.necesidades.join(', ')}`);
        if (r.mensaje_guardian) lines.push(`Mensaje al guardián: "${r.mensaje_guardian}"`);
        if (r.relacion) lines.push(`Relación: ${r.relacion}`);
        if (r.personalidad?.length) lines.push(`Personalidad: ${r.personalidad.join(', ')}`);
        if (r.que_le_hace_brillar) lines.push(`Lo que le hace brillar: ${r.que_le_hace_brillar}`);
        if (r.que_necesita_escuchar) lines.push(`Lo que necesita escuchar: ${r.que_necesita_escuchar}`);
        if (r.mensaje_personal) lines.push(`Mensaje personal: "${r.mensaje_personal}"`);
        if (r.es_anonimo) lines.push(`El regalo es anónimo`);
        if (r.edad_nino) lines.push(`Edad del niño/a: ${r.edad_nino}`);
        if (r.gustos_nino) lines.push(`Le gusta: ${r.gustos_nino}`);
        if (r.necesidades_nino?.length) lines.push(`Necesita: ${r.necesidades_nino.join(', ')}`);
        if (lines.length > 0) {
          seccionFormR = `\nDATOS DEL FORMULARIO:\n${lines.join('\n')}\n\nESTO ES SAGRADO. Respondé a lo que compartió.\n`;
        }
      }

      let seccionNotaR = notaAdmin ? `\nINDICACIÓN DEL ADMIN: "${notaAdmin}"\n` : '';
      let seccionContextoR = canalizacion.contextoManual ? `\nCONTEXTO: "${canalizacion.contextoManual}"\n` : '';

      // Datos del guardián
      let datosGuardianR = `Nombre: ${nombreGuardianR}\nCategoría: ${categoriaGuardianR}`;
      if (tipoProductoR) datosGuardianR += `\nTipo: ${tipoProductoR}`;
      if (!canalizacion.esManual && canalizacion.guardian) {
        datosGuardianR = construirDatosGuardian(canalizacion.guardian);
      }

      // Buscar canalizaciones paralelas para consistencia
      const paralelasRegen = await obtenerContextoParalelo(canalizacion.email, canalizacion.ordenId, id);
      const seccionParalelasRegen = construirSeccionParalelas(paralelasRegen, nombreGuardianR);

      const systemPromptR = `Vas a escribir una carta personal como ${nombreGuardianR} para ${nombreRealR}.

REGLA #1: ESTO ES UNA CARTA DE ALGUIEN QUE TE QUIERE. NO un texto místico. ES una carta de un ser que le habla al corazón.
${seccionFormR}${seccionContextoR}${seccionNotaR}
QUIÉN SOS VOS (${nombreGuardianR.toUpperCase()}):
${datosGuardianR}

IMPORTANTE SOBRE TU IDENTIDAD: Basá tu personalidad en los datos REALES del producto. Si sos un duende, hablás como duende. Si sos una pixie, hablás como pixie. Si sos un altar o accesorio, hablás como ese objeto con alma. Adaptá tu voz a lo que REALMENTE sos.
${seccionParalelasRegen}
IMPORTANTE: Esta es una REGENERACIÓN. Escribí algo COMPLETAMENTE DIFERENTE a la versión anterior. Nuevo enfoque, nuevas metáforas, nueva estructura.

Prohibido: frases genéricas de IA, "brumas ancestrales", "velo entre mundos", relleno poético vacío. NUNCA inventes nombres de guardianes que no existan.
Sí: como un amigo que te quiere escribiéndote. Específico a ESTA persona.
Estructura flexible: Te escuché → Mi historia (origen, anécdota personal única) → Lo que vine a hacer → Cómo voy a estar → Mi lugar → Cómo cuidarme (limpieza suave, evitar sol/humedad, cómo conectar conmigo día a día — sin rituales extremos) → La comunidad (genérica, sin nombres inventados) → Lo importante.
Español rioplatense (vos, tenés, podés). 2000-3000 palabras.`;

      const contentBlocksR = [];
      if (imagenProductoR) {
        contentBlocksR.push({ type: 'image', source: { type: 'url', url: imagenProductoR } });
        contentBlocksR.push({ type: 'text', text: 'Imagen del guardián/producto. Reflejá su personalidad en la carta.' });
      }
      const fotoClienteR = formData?.respuestas?.foto_url;
      if (fotoClienteR) {
        contentBlocksR.push({ type: 'image', source: { type: 'url', url: fotoClienteR } });
        contentBlocksR.push({ type: 'text', text: 'Foto de la persona. Dejá que influya en tu tono.' });
      }
      contentBlocksR.push({ type: 'text', text: `Escribí tu canalización personal completa para ${nombreRealR}. Sos ${nombreGuardianR}, hablando en primera persona.` });

      const anthropic = new Anthropic();
      const responseR = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [{ role: 'user', content: contentBlocksR }],
        system: systemPromptR
      });

      const contenidoR = responseR.content[0].text;

      const resumenRR = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{ role: 'user', content: `Resumí esta canalización en 2-3 oraciones:\n\n${contenidoR.substring(0, 3000)}...` }]
      });

      // Guardar versión anterior antes de sobrescribir
      const estadoAnterior = canalizacion.estado;
      if (canalizacion.contenido) {
        const versionAnterior = {
          contenido: canalizacion.contenido,
          resumen: canalizacion.resumen,
          fechaGenerada: canalizacion.fechaGenerada,
          version: (canalizacion.regeneraciones || 0) + 1
        };
        canalizacion.versionesAnteriores = canalizacion.versionesAnteriores || [];
        canalizacion.versionesAnteriores.push(versionAnterior);
      }

      // Actualizar — volver a pendiente
      canalizacion.contenido = contenidoR;
      canalizacion.resumen = resumenRR.content[0].text;
      canalizacion.estado = 'pendiente';
      canalizacion.fechaGenerada = fecha.toISOString();
      canalizacion.fechaAprobada = null;
      canalizacion.regeneraciones = (canalizacion.regeneraciones || 0) + 1;

      await kv.set(`canalizacion:${id}`, canalizacion);

      // Mover a pendientes si estaba en aprobadas
      if (estadoAnterior === 'aprobada') {
        const aprobadas = await kv.get('canalizaciones:aprobadas') || [];
        await kv.set('canalizaciones:aprobadas', aprobadas.filter(aid => aid !== id));
        const pendientes = await kv.get('canalizaciones:pendientes') || [];
        if (!pendientes.includes(id)) {
          pendientes.unshift(id);
          await kv.set('canalizaciones:pendientes', pendientes);
        }
      }

      console.log(`[CANALIZACION] Regenerada: ${id} (vez #${canalizacion.regeneraciones})`);

      return Response.json({
        success: true,
        canalizacion: {
          id: canalizacion.id,
          estado: 'pendiente',
          resumen: canalizacion.resumen,
          fechaGenerada: canalizacion.fechaGenerada,
          regeneraciones: canalizacion.regeneraciones
        }
      }, { headers: corsHeaders });
    }

    // ═══════════════════════════════════════════════════════════════
    // RESTAURAR versión anterior
    // ═══════════════════════════════════════════════════════════════
    if (accion === 'restaurar') {
      const { versionIndex } = body;
      const versiones = canalizacion.versionesAnteriores || [];

      if (versionIndex == null || !versiones[versionIndex]) {
        return Response.json({ success: false, error: 'Versión no encontrada' }, { status: 400, headers: corsHeaders });
      }

      const versionElegida = versiones[versionIndex];

      // Guardar la actual como versión anterior también
      if (canalizacion.contenido) {
        versiones.push({
          contenido: canalizacion.contenido,
          resumen: canalizacion.resumen,
          fechaGenerada: canalizacion.fechaGenerada,
          version: (canalizacion.regeneraciones || 0) + 1
        });
      }

      // Restaurar la elegida
      canalizacion.contenido = versionElegida.contenido;
      canalizacion.resumen = versionElegida.resumen;
      canalizacion.fechaGenerada = versionElegida.fechaGenerada;

      // Quitar la versión restaurada del array (ya es la actual)
      versiones.splice(versionIndex, 1);
      canalizacion.versionesAnteriores = versiones;

      canalizacion.estado = 'pendiente';
      canalizacion.fechaAprobada = null;

      await kv.set(`canalizacion:${id}`, canalizacion);

      console.log(`[CANALIZACION] Restaurada versión ${versionIndex + 1}: ${id}`);

      return Response.json({
        success: true,
        canalizacion: {
          id: canalizacion.id,
          estado: 'pendiente',
          contenido: canalizacion.contenido,
          resumen: canalizacion.resumen,
          versionesAnteriores: canalizacion.versionesAnteriores
        }
      }, { headers: corsHeaders });
    }

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
        titulo: `Canalización de ${canalizacion.guardian?.nombre || canalizacion.productoManual?.nombre || 'Tu Guardián'}`,
        guardian: canalizacion.guardian || canalizacion.productoManual || null,
        contenido: canalizacion.contenido,
        fecha: fecha.toISOString(),
        ordenId: canalizacion.ordenId || null
      });

      await kv.set(lecturasKey, lecturas);

      // ═══════════════════════════════════════════════════════════════
      // GUARDAR DATOS DEL CERTIFICADO
      // Necesario para que /api/certificado?order=X funcione
      // Solo si hay ordenId (canalizaciones de compra)
      // ═══════════════════════════════════════════════════════════════
      if (canalizacion.ordenId) {
        // Extraer un mensaje corto del contenido de la canalización
        let mensajeCorto = canalizacion.contenido || '';
        // Buscar la primera sección significativa (después del saludo)
        const primerParrafo = mensajeCorto.split('\n\n').find(p =>
          p.length > 50 &&
          !p.startsWith('#') &&
          !p.includes(canalizacion.nombreDestinatario + ',')
        ) || mensajeCorto.substring(0, 500);
        mensajeCorto = primerParrafo.substring(0, 300).replace(/[#*]/g, '').trim();
        if (mensajeCorto.length >= 297) mensajeCorto += '...';

        // Determinar género del guardián
        const nombreGuardianCert = canalizacion.guardian?.nombre || '';
        const esGeneroFemenino = nombreGuardianCert.toLowerCase().endsWith('a') ||
                                nombreGuardianCert.toLowerCase().includes('duenda');

        await kv.set(`orden:${canalizacion.ordenId}`, {
          orden_id: canalizacion.ordenId,
          nombre_humano: canalizacion.nombreDestinatario || canalizacion.nombreCliente,
          guardian_nombre: canalizacion.guardian?.nombre || 'Guardián',
          guardian_genero: esGeneroFemenino ? 'f' : 'm',
          fecha_canalizacion: fecha.toISOString(),
          mensaje_guardian: mensajeCorto,
          sincrodestino: 'Canalizado con amor desde el Bosque Ancestral de Piriápolis',
          categoria: canalizacion.guardian?.categoria || 'Protección'
        }, { ex: 60 * 60 * 24 * 365 }); // 1 año TTL

        console.log(`[CANALIZACION] Certificado guardado para orden ${canalizacion.ordenId}`);
      }

      // Mover de borradores también (para manuales que se saltan aprobada)
      const borradores = await kv.get('canalizaciones:borradores') || [];
      if (borradores.includes(id)) {
        await kv.set('canalizaciones:borradores', borradores.filter(bid => bid !== id));
      }

      // ═══════════════════════════════════════════════════════════════
      // ENVIAR EMAIL "TU CANALIZACIÓN ESTÁ LISTA" VIA BREVO
      // ═══════════════════════════════════════════════════════════════
      try {
        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: 'Duendes del Uruguay', email: 'info@duendesdeluruguay.com' },
            to: [{ email: canalizacion.email, name: canalizacion.nombreDestinatario || canalizacion.nombreCliente }],
            templateId: 15, // Template "Canalización Lista"
            params: {
              CUSTOMER_NAME: canalizacion.nombreDestinatario || canalizacion.nombreCliente,
              GUARDIAN_NAME: canalizacion.guardian?.nombre || 'Tu Guardián',
            }
          })
        });

        if (brevoResponse.ok) {
          console.log(`[CANALIZACION] Email "canalización lista" enviado a ${canalizacion.email}`);
        } else {
          console.error(`[CANALIZACION] Error enviando email:`, await brevoResponse.text());
        }
      } catch (emailError) {
        console.error(`[CANALIZACION] Error enviando email:`, emailError);
        // No fallar la operación si el email falla
      }

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

// ═══════════════════════════════════════════════════════════════
// DELETE - Eliminar canalización
// ═══════════════════════════════════════════════════════════════

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({
        success: false,
        error: 'ID requerido'
      }, { status: 400, headers: corsHeaders });
    }

    const canalizacion = await kv.get(`canalizacion:${id}`);
    if (!canalizacion) {
      return Response.json({
        success: false,
        error: 'Canalización no encontrada'
      }, { status: 404, headers: corsHeaders });
    }

    // Eliminar de todas las listas
    const pendientes = await kv.get('canalizaciones:pendientes') || [];
    const aprobadas = await kv.get('canalizaciones:aprobadas') || [];
    const enviadas = await kv.get('canalizaciones:enviadas') || [];
    const borradores = await kv.get('canalizaciones:borradores') || [];
    const todas = await kv.get('canalizaciones:todas') || [];

    await kv.set('canalizaciones:pendientes', pendientes.filter(pid => pid !== id));
    await kv.set('canalizaciones:aprobadas', aprobadas.filter(aid => aid !== id));
    await kv.set('canalizaciones:enviadas', enviadas.filter(eid => eid !== id));
    await kv.set('canalizaciones:borradores', borradores.filter(bid => bid !== id));
    await kv.set('canalizaciones:todas', todas.filter(tid => tid !== id));

    // Eliminar la canalización
    await kv.del(`canalizacion:${id}`);

    return Response.json({
      success: true,
      message: 'Canalización eliminada'
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error eliminando canalización:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
