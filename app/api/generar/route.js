import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Obtener datos del producto desde WordPress
async function getProductData(productId) {
  try {
    const wpUrl = process.env.WORDPRESS_URL
    const response = await fetch(
      `${wpUrl}/wp-json/wc/v3/products/${productId}`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(
            process.env.WC_CONSUMER_KEY + ':' + process.env.WC_CONSUMER_SECRET
          ).toString('base64')
        }
      }
    )
    return await response.json()
  } catch (error) {
    console.error('Error obteniendo producto:', error)
    return null
  }
}

// Generar contenido con Anthropic
async function generarContenido(datos) {
  const { cliente, productos, canalizacion } = datos
  
  // Obtener info detallada del primer producto (guardián principal)
  const productosPrincipales = []
  for (const prod of productos) {
    const detalle = await getProductData(prod.id)
    if (detalle) {
      productosPrincipales.push({
        ...prod,
        descripcion: detalle.description,
        descripcion_corta: detalle.short_description,
        categorias: detalle.categories?.map(c => c.name) || [],
        meta: detalle.meta_data || []
      })
    }
  }
  
  const guardianPrincipal = productosPrincipales[0]
  const hayMultiples = productosPrincipales.length > 1
  
  const prompt = `Sos el canalizador oficial de Duendes del Uruguay. Tu tarea es crear una GUÍA DE CANALIZACIÓN PERSONALIZADA para un cliente que acaba de adoptar un guardián.

═══════════════════════════════════════════════════════════════
DATOS DEL ELEGIDO/A
═══════════════════════════════════════════════════════════════

Nombre: ${canalizacion.nombre_receptor}
Fecha de nacimiento: ${canalizacion.fecha_nacimiento || 'No proporcionada'}
Numerología:
- Número de vida: ${canalizacion.numerologia?.numero_vida || 'Calcular'}
- Descripción: ${canalizacion.numerologia?.descripcion || ''}
- Elemento: ${canalizacion.numerologia?.elemento || ''}

${canalizacion.receptor === 'regalo' ? `
ES UN REGALO:
- Relación: ${canalizacion.relacion}
- Motivo: ${canalizacion.motivo}
` : ''}

Mensaje adicional del cliente: ${canalizacion.mensaje_extra || 'Ninguno'}

═══════════════════════════════════════════════════════════════
GUARDIÁN${hayMultiples ? 'ES' : ''} ADOPTADO${hayMultiples ? 'S' : ''}
═══════════════════════════════════════════════════════════════

${productosPrincipales.map((p, i) => `
GUARDIÁN ${i + 1}: ${p.nombre}
- Categorías: ${p.categorias.join(', ')}
- Descripción: ${p.descripcion || p.descripcion_corta || 'Sin descripción'}
- Imagen: ${p.imagen}
`).join('\n')}

═══════════════════════════════════════════════════════════════
ESTILO DE ESCRITURA OBLIGATORIO
═══════════════════════════════════════════════════════════════

- Español RIOPLATENSE: vos, sos, tenés, querés, podés
- Tono: íntimo, cálido, como una amiga que te abraza
- Emoción: que se le haga un nudo en la garganta
- Personalizado: USA EL NOMBRE "${canalizacion.nombre_receptor}" varias veces
- Validación emocional constante
- PROHIBIDO: bruma, ancestral, etéreo, portal, dimensión, lenguaje de fantasía genérica

═══════════════════════════════════════════════════════════════
GENERAR JSON (sin texto antes ni después)
═══════════════════════════════════════════════════════════════

{
  "historia": "Historia ÚNICA de ${guardianPrincipal?.nombre} escrita especialmente para ${canalizacion.nombre_receptor}. Mencioná su nombre varias veces. Conectá con situaciones de vida reales. 4-5 párrafos emotivos. Mínimo 400 palabras.",
  
  "mensaje": "Mensaje en PRIMERA PERSONA de ${guardianPrincipal?.nombre} dirigido a ${canalizacion.nombre_receptor}. Usá su nombre. Hablale de TU dolor, TU fuerza, lo que VIO en vos. Muy personal e íntimo. Mínimo 150 palabras.",
  
  "numerologia_conexion": "Explicá cómo el número de vida ${canalizacion.numerologia?.numero_vida || ''} y el elemento ${canalizacion.numerologia?.elemento || ''} de ${canalizacion.nombre_receptor} conectan perfectamente con ${guardianPrincipal?.nombre}. Por qué era inevitable que se encontraran. 100 palabras.",
  
  "preparar_casa": "Instrucciones específicas y emotivas para que ${canalizacion.nombre_receptor} prepare su hogar para recibir a ${guardianPrincipal?.nombre}. Incluí limpieza energética, dónde ubicarlo, qué evitar. Personalizado. 150 palabras.",
  
  "ritual": "Ritual de activación paso a paso cuando ${guardianPrincipal?.nombre} llegue a casa de ${canalizacion.nombre_receptor}. Simple pero emotivo. Que sienta que está sellando un pacto real. 5-7 pasos claros.",
  
  "conexion_diaria": "Cómo ${canalizacion.nombre_receptor} puede conectar con ${guardianPrincipal?.nombre} cada día. Momentos para hablarle, qué pedirle, señales que le dará. Práctico y espiritual. 150 palabras.",
  
  ${hayMultiples ? `"sinergia": "Explicá cómo trabajan juntos los ${productosPrincipales.length} guardianes que adoptó ${canalizacion.nombre_receptor}. Cómo se potencian, dónde ubicarlos en relación, qué energía crean juntos. 150 palabras.",` : ''}
  
  "piedras_afines": "4 piedras/cristales que potencian la conexión entre ${canalizacion.nombre_receptor} y ${guardianPrincipal?.nombre}. Para cada una: nombre + frase emotiva de validación. Formato: 'Piedra - Frase'."
}

IMPORTANTE: Respondé SOLO con el JSON, sin texto adicional.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }]
  })
  
  // Extraer JSON de la respuesta
  const texto = response.content[0].text
  const jsonMatch = texto.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No se pudo extraer JSON de la respuesta')
  
  return JSON.parse(jsonMatch[0])
}

// POST: Generar contenido para un pedido específico
export async function POST(request) {
  try {
    const { guardianId, forceGenerate } = await request.json()
    
    if (!guardianId) {
      return NextResponse.json({ error: 'guardianId requerido' }, { status: 400 })
    }
    
    // Obtener datos pendientes
    const pendingData = await kv.get(`pending:${guardianId}`)
    if (!pendingData) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }
    
    // Verificar si ya pasaron las 4 horas (o forzar)
    const generateAt = new Date(pendingData.generate_at)
    const now = new Date()
    
    if (!forceGenerate && now < generateAt) {
      return NextResponse.json({ 
        message: 'Aún no es hora de generar',
        generate_at: pendingData.generate_at,
        remaining_minutes: Math.ceil((generateAt - now) / 60000)
      })
    }
    
    // Generar contenido con Anthropic
    console.log(`Generando contenido para ${guardianId}...`)
    const contenido = await generarContenido(pendingData)
    
    // Preparar datos finales
    const guardianData = {
      nombre_receptor: pendingData.canalizacion.nombre_receptor,
      nombre_guardian: pendingData.productos[0]?.nombre || 'Tu Guardián',
      imagen_guardian: pendingData.productos[0]?.imagen,
      historia: contenido.historia,
      mensaje: contenido.mensaje,
      numerologia: {
        numero_vida: pendingData.canalizacion.numerologia?.numero_vida,
        descripcion: pendingData.canalizacion.numerologia?.descripcion,
        elemento: pendingData.canalizacion.numerologia?.elemento,
        elemento_emoji: getElementoEmoji(pendingData.canalizacion.numerologia?.elemento),
        conexion: contenido.numerologia_conexion
      },
      preparar_casa: contenido.preparar_casa,
      ritual: contenido.ritual,
      conexion_diaria: contenido.conexion_diaria,
      sinergia: contenido.sinergia || null,
      piedras_afines: contenido.piedras_afines,
      recomendaciones: [], // TODO: Agregar lógica de recomendaciones
      fecha_compra: pendingData.created_at,
      generated_at: new Date().toISOString()
    }
    
    // Guardar en KV (permanente)
    await kv.set(`guardian:${guardianId}`, guardianData)
    
    // Actualizar estado del pendiente
    await kv.set(`pending:${guardianId}`, {
      ...pendingData,
      status: 'generated'
    })
    
    // Remover de la lista de pendientes
    await kv.srem('pending_orders', guardianId)
    
    // TODO: Enviar email con link
    // await enviarEmail(pendingData.cliente.email, guardianId)
    
    console.log(`Contenido generado para ${guardianId}`)
    
    return NextResponse.json({ 
      success: true,
      guardianId,
      url: `/guardian/${guardianId}`,
      message: 'Contenido generado exitosamente'
    })
    
  } catch (error) {
    console.error('Error generando contenido:', error)
    return NextResponse.json({ 
      error: 'Error generando contenido',
      details: error.message 
    }, { status: 500 })
  }
}

// GET: Procesar todos los pendientes (para cron job)
export async function GET(request) {
  try {
    // Obtener todos los pedidos pendientes
    const pendingIds = await kv.smembers('pending_orders')
    
    if (!pendingIds || pendingIds.length === 0) {
      return NextResponse.json({ message: 'No hay pedidos pendientes' })
    }
    
    const now = new Date()
    const processed = []
    const skipped = []
    
    for (const guardianId of pendingIds) {
      const pendingData = await kv.get(`pending:${guardianId}`)
      
      if (!pendingData) {
        await kv.srem('pending_orders', guardianId)
        continue
      }
      
      const generateAt = new Date(pendingData.generate_at)
      
      if (now >= generateAt && pendingData.status === 'pending') {
        // Es hora de generar
        try {
          const contenido = await generarContenido(pendingData)
          
          const guardianData = {
            nombre_receptor: pendingData.canalizacion.nombre_receptor,
            nombre_guardian: pendingData.productos[0]?.nombre || 'Tu Guardián',
            imagen_guardian: pendingData.productos[0]?.imagen,
            historia: contenido.historia,
            mensaje: contenido.mensaje,
            numerologia: {
              numero_vida: pendingData.canalizacion.numerologia?.numero_vida,
              descripcion: pendingData.canalizacion.numerologia?.descripcion,
              elemento: pendingData.canalizacion.numerologia?.elemento,
              elemento_emoji: getElementoEmoji(pendingData.canalizacion.numerologia?.elemento),
              conexion: contenido.numerologia_conexion
            },
            preparar_casa: contenido.preparar_casa,
            ritual: contenido.ritual,
            conexion_diaria: contenido.conexion_diaria,
            sinergia: contenido.sinergia || null,
            piedras_afines: contenido.piedras_afines,
            recomendaciones: [],
            fecha_compra: pendingData.created_at,
            generated_at: new Date().toISOString()
          }
          
          await kv.set(`guardian:${guardianId}`, guardianData)
          await kv.set(`pending:${guardianId}`, { ...pendingData, status: 'generated' })
          await kv.srem('pending_orders', guardianId)
          
          processed.push(guardianId)
        } catch (err) {
          console.error(`Error procesando ${guardianId}:`, err)
        }
      } else {
        skipped.push({
          id: guardianId,
          generate_at: pendingData.generate_at
        })
      }
    }
    
    return NextResponse.json({ 
      processed,
      skipped,
      total_pending: pendingIds.length
    })
    
  } catch (error) {
    console.error('Error en cron:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Helper para emoji de elemento
function getElementoEmoji(elemento) {
  const emojis = {
    'Fuego': '🔥',
    'Agua': '💧',
    'Tierra': '🌿',
    'Aire': '💨',
    'Éter': '✨'
  }
  return emojis[elemento] || '✨'
}
