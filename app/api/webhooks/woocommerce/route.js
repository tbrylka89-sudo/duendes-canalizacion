import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { PAQUETES_RUNAS, MEMBRESIAS, XP_ACCIONES, obtenerNivel } from '@/lib/gamificacion/config';

// ═══════════════════════════════════════════════════════════════
// WEBHOOK DE WOOCOMMERCE - COMPRA COMPLETADA
// Maneja: Guardianes, Runas de Poder, Membresías del Círculo
// ═══════════════════════════════════════════════════════════════

// Mapa de paquetes de runas por SKU y slug para lookup rápido
const RUNAS_POR_SKU = {};
const RUNAS_POR_SLUG = {};
for (const paquete of PAQUETES_RUNAS) {
  RUNAS_POR_SKU[paquete.sku.toLowerCase()] = paquete;
  RUNAS_POR_SLUG[paquete.slug.toLowerCase()] = paquete;
}

// Mapa de membresías por SKU y slug
const MEMBRESIAS_POR_SKU = {};
const MEMBRESIAS_POR_SLUG = {};
for (const [key, membresia] of Object.entries(MEMBRESIAS)) {
  if (membresia.sku) {
    MEMBRESIAS_POR_SKU[membresia.sku.toLowerCase()] = membresia;
  }
  if (membresia.slug) {
    MEMBRESIAS_POR_SLUG[membresia.slug.toLowerCase()] = membresia;
  }
}

export async function POST(request) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    const orden = await request.json();
    
    // Verificar que es una orden válida
    if (!orden || !orden.id || !orden.billing?.email) {
      return Response.json({ success: false, error: 'Orden inválida' }, { status: 400 });
    }
    
    const email = orden.billing.email.toLowerCase();
    const nombre = orden.billing.first_name || 'Amiga';
    const ordenId = orden.id;
    const total = parseFloat(orden.total) || 0;
    
    console.log(`Procesando orden #${ordenId} de ${email}`);
    
    // Cargar o crear datos del elegido
    let elegido = await kv.get(`elegido:${email}`) || {
      email,
      nombre,
      treboles: 0,
      runas: 0,
      guardianes: [],
      totalCompras: 0,
      nivel: 1,
      primeraCompra: null,
      ordenes: []
    };
    
    // Verificar si es primera compra
    const esPrimeraCompra = !elegido.primeraCompra;
    
    // Clasificar items
    const items = orden.line_items || [];
    const guardianes = [];
    const runasCompradas = [];
    const membresias = [];
    const otros = [];
    
    for (const item of items) {
      const sku = item.sku?.toLowerCase() || '';
      const slug = item.slug?.toLowerCase() || '';
      const categorias = item.meta_data?.find(m => m.key === '_category_slugs')?.value || [];
      const categoriasArray = Array.isArray(categorias) ? categorias : [categorias];

      // Detectar tipo de producto
      // 1. Buscar por SKU/slug en paquetes de runas de gamificación
      const paqueteRunas = RUNAS_POR_SKU[sku] || RUNAS_POR_SLUG[slug] ||
        PAQUETES_RUNAS.find(p => sku.includes(p.id) || item.name?.toLowerCase().includes(p.nombre.toLowerCase()));

      if (paqueteRunas || sku.startsWith('runas-de-poder-') || sku.startsWith('runas-') || categoriasArray.includes('monedas') || categoriasArray.includes('runas')) {
        // Es compra de Runas de Poder
        let cantidadRunas = 0;
        let bonusRunas = 0;

        if (paqueteRunas) {
          // Paquete conocido de gamificación - incluye bonus
          cantidadRunas = paqueteRunas.runas;
          bonusRunas = paqueteRunas.bonus || 0;
        } else {
          // Fallback: extraer de SKU/nombre
          cantidadRunas = extraerCantidadRunas(sku, item.name);
        }

        runasCompradas.push({
          nombre: item.name,
          paqueteId: paqueteRunas?.id || null,
          cantidadBase: cantidadRunas * item.quantity,
          bonus: bonusRunas * item.quantity,
          cantidad: (cantidadRunas + bonusRunas) * item.quantity,
          precio: parseFloat(item.total) || 0
        });
      }
      // 2. Buscar membresía del Círculo
      else if (MEMBRESIAS_POR_SKU[sku] || MEMBRESIAS_POR_SLUG[slug] || sku.startsWith('circulo-') || categoriasArray.includes('membresias')) {
        const membresiaConfig = MEMBRESIAS_POR_SKU[sku] || MEMBRESIAS_POR_SLUG[slug] || null;
        membresias.push({
          nombre: item.name,
          sku: sku,
          precio: parseFloat(item.total) || 0,
          config: membresiaConfig // Info de gamificación si existe
        });
      }
      // 3. Guardianes
      else if (categoriasArray.some(c => ['proteccion', 'abundancia', 'amor', 'salud', 'sanacion'].includes(c))) {
        guardianes.push({
          id: item.product_id,
          nombre: item.name,
          categoria: categoriasArray[0],
          precio: parseFloat(item.total) || 0,
          fecha: new Date().toISOString(),
          imagen: item.image?.src || null
        });
      }
      else {
        otros.push(item);
      }
    }
    
    // ═══════════════════════════════════════════════════════════
    // GENERAR TOKEN DE ACCESO SI NO EXISTE (necesario para emails)
    // ═══════════════════════════════════════════════════════════

    if (!elegido.token) {
      elegido.token = generarToken();
      await kv.set(`token:${elegido.token}`, { email, nombre }, { ex: 365 * 24 * 60 * 60 });
    }

    // ═══════════════════════════════════════════════════════════
    // PROCESAR RUNAS DE PODER
    // ═══════════════════════════════════════════════════════════

    if (runasCompradas.length > 0) {
      const totalRunasBase = runasCompradas.reduce((sum, r) => sum + r.cantidadBase, 0);
      const totalBonus = runasCompradas.reduce((sum, r) => sum + r.bonus, 0);
      const totalRunas = runasCompradas.reduce((sum, r) => sum + r.cantidad, 0);
      const totalGastado = runasCompradas.reduce((sum, r) => sum + r.precio, 0);

      elegido.runas = (elegido.runas || 0) + totalRunas;

      console.log(`Agregadas ${totalRunas} Runas de Poder a ${email} (${totalRunasBase} base + ${totalBonus} bonus)`);

      // === GAMIFICACIÓN: Actualizar XP por compra ===
      try {
        let gamificacion = await kv.get(`gamificacion:${email}`);

        if (!gamificacion) {
          gamificacion = {
            xp: 0,
            nivel: 'iniciada',
            racha: 0,
            rachaMax: 0,
            ultimoLogin: null,
            ultimoCofre: null,
            lecturasCompletadas: [],
            tiposLecturaUsados: [],
            misionesCompletadas: [],
            badges: [],
            referidos: [],
            codigoReferido: null,
            comprasRunas: [],
            creadoEn: new Date().toISOString()
          };
        }

        // XP por compra: 1 XP por cada dólar gastado
        const xpGanado = Math.floor(totalGastado * XP_ACCIONES.compraPorDolar);
        gamificacion.xp = (gamificacion.xp || 0) + xpGanado;

        // Registrar compra
        if (!gamificacion.comprasRunas) gamificacion.comprasRunas = [];
        gamificacion.comprasRunas.push({
          fecha: new Date().toISOString(),
          ordenId,
          runas: totalRunas,
          bonus: totalBonus,
          gastado: totalGastado,
          xpGanado
        });

        // Actualizar nivel si corresponde
        const nuevoNivel = obtenerNivel(gamificacion.xp);
        const subioNivel = nuevoNivel.id !== gamificacion.nivel;
        gamificacion.nivel = nuevoNivel.id;

        await kv.set(`gamificacion:${email}`, gamificacion);

        console.log(`Gamificación: +${xpGanado} XP, nivel: ${nuevoNivel.nombre}${subioNivel ? ' (¡SUBIÓ!)' : ''}`);
      } catch (gamError) {
        console.error('Error actualizando gamificación:', gamError);
      }

      // Enviar email confirmando runas (incluye bonus si hay)
      await enviarEmailRunas(resend, email, nombre, totalRunas, totalBonus, elegido.runas, elegido.token);
    }
    
    // ═══════════════════════════════════════════════════════════
    // PROCESAR MEMBRESÍAS DEL CÍRCULO
    // ═══════════════════════════════════════════════════════════
    
    if (membresias.length > 0) {
      for (const membresia of membresias) {
        const membresiaConfig = membresia.config;
        const diasMembresia = membresiaConfig ? (membresiaConfig.meses * 30) : calcularDiasMembresia(membresia.sku);

        let circulo = await kv.get(`circulo:${email}`) || {
          activo: false,
          plan: null,
          expira: null
        };

        const fechaBase = circulo.expira && new Date(circulo.expira) > new Date()
          ? new Date(circulo.expira)
          : new Date();

        const nuevaExpiracion = new Date(fechaBase);
        nuevaExpiracion.setDate(nuevaExpiracion.getDate() + diasMembresia);

        circulo.activo = true;
        circulo.plan = membresiaConfig?.id || membresia.sku;
        circulo.planNombre = membresiaConfig?.nombre || membresia.nombre;
        circulo.expira = nuevaExpiracion.toISOString();
        circulo.ultimaCompra = new Date().toISOString();
        circulo.descuentoTienda = membresiaConfig?.descuentoTienda || 0;
        circulo.runasMensuales = membresiaConfig?.runasMensuales || 0;

        await kv.set(`circulo:${email}`, circulo);

        // También guardar en el elegido para fácil acceso
        elegido.circulo = {
          activo: true,
          plan: circulo.plan,
          expira: circulo.expira
        };

        // Dar runas de bienvenida si tiene config
        if (membresiaConfig?.runasBienvenida > 0) {
          elegido.runas = (elegido.runas || 0) + membresiaConfig.runasBienvenida;
          console.log(`Runas de bienvenida del Círculo: +${membresiaConfig.runasBienvenida}`);
        }

        console.log(`Membresía ${circulo.planNombre || membresia.sku} activada para ${email} hasta ${nuevaExpiracion}`);

        // Enviar email de bienvenida al Círculo
        await enviarEmailCirculo(resend, email, nombre, circulo.planNombre || membresia.sku, nuevaExpiracion, membresiaConfig?.runasBienvenida || 0, elegido.token);
      }
    }
    
    // ═══════════════════════════════════════════════════════════
    // PROCESAR GUARDIANES
    // ═══════════════════════════════════════════════════════════
    
    if (guardianes.length > 0) {
      // Agregar guardianes al elegido
      elegido.guardianes = [...(elegido.guardianes || []), ...guardianes];
      
      // Calcular tréboles (1 trébol por cada $10 USD)
      const totalGuardianes = guardianes.reduce((sum, g) => sum + parseFloat(g.precio), 0);
      const trebolsGanados = Math.floor(totalGuardianes / 10);
      elegido.treboles = (elegido.treboles || 0) + trebolsGanados;
      
      console.log(`Agregados ${guardianes.length} guardianes y ${trebolsGanados} tréboles a ${email}`);

      // Obtener datos de canalización del formulario de checkout
      const datosCanalizacion = orden.datos_canalizacion || {};

      // Generar guía de canalización y tarjeta QR para cada guardián
      for (const guardian of guardianes) {
        await programarCanalizacion(kv, email, guardian, elegido, datosCanalizacion, ordenId);
        await generarTarjetaQR(kv, ordenId, email, nombre, guardian);
      }

      // Enviar email de compra confirmada (ahora incluye QR y link con token)
      await enviarEmailCompraGuardian(resend, email, nombre, guardianes, trebolsGanados, ordenId, elegido.token);
    }
    
    // ═══════════════════════════════════════════════════════════
    // BONOS DE PRIMERA COMPRA
    // ═══════════════════════════════════════════════════════════
    
    if (esPrimeraCompra) {
      elegido.primeraCompra = new Date().toISOString();
      
      // 20 runas gratis en primera compra
      elegido.runas = (elegido.runas || 0) + 20;
      
      // 15 días de Círculo gratis
      let circulo = await kv.get(`circulo:${email}`) || { activo: false };
      if (!circulo.activo) {
        const expiraPrueba = new Date();
        expiraPrueba.setDate(expiraPrueba.getDate() + 15);
        
        circulo.activo = true;
        circulo.plan = 'prueba-gratis';
        circulo.expira = expiraPrueba.toISOString();
        circulo.esPrueba = true;
        
        await kv.set(`circulo:${email}`, circulo);
        
        // Programar emails de conversión
        await programarEmailsConversion(kv, email, nombre, expiraPrueba);
      }
      
      console.log(`Bonos de primera compra aplicados a ${email}: 20 runas + 15 días Círculo`);
    }
    
    // ═══════════════════════════════════════════════════════════
    // ACTUALIZAR STATS GENERALES
    // ═══════════════════════════════════════════════════════════
    
    elegido.totalCompras = (elegido.totalCompras || 0) + total;
    elegido.ultimaCompra = new Date().toISOString();
    elegido.ordenes = [...(elegido.ordenes || []), ordenId];
    elegido.nivel = calcularNivel(elegido.totalCompras);
    
    // Guardar elegido actualizado
    await kv.set(`elegido:${email}`, elegido);
    
    return Response.json({ 
      success: true, 
      mensaje: 'Orden procesada correctamente',
      guardianes: guardianes.length,
      runas: runasCompradas.reduce((s, r) => s + r.cantidad, 0),
      membresias: membresias.length,
      esPrimeraCompra
    });
    
  } catch (error) {
    console.error('Error en webhook:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

function extraerCantidadRunas(sku, nombre) {
  // Buscar número en SKU: runas-de-poder-15, runas-de-poder-30, etc
  const matchSku = sku.match(/runas-de-poder-(\d+)/);
  if (matchSku) return parseInt(matchSku[1]);
  
  // Buscar número en nombre
  const matchNombre = nombre.match(/(\d+)\s*runas/i);
  if (matchNombre) return parseInt(matchNombre[1]);
  
  return 0;
}

function calcularDiasMembresia(sku) {
  if (sku.includes('mensual') || sku.includes('1m')) return 30;
  if (sku.includes('semestral') || sku.includes('seis-meses') || sku.includes('6m')) return 180;
  if (sku.includes('anual') || sku.includes('12m')) return 365;
  return 30; // Default: mensual
}

function calcularNivel(totalCompras) {
  if (totalCompras >= 1000) return 6; // Elegida
  if (totalCompras >= 500) return 5;  // Guardián
  if (totalCompras >= 300) return 4;  // Raíz
  if (totalCompras >= 150) return 3;  // Trébol
  if (totalCompras >= 50) return 2;   // Brote
  return 1; // Semilla
}

function generarToken() {
  // Token corto y amigable: 12 caracteres alfanuméricos
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

async function programarCanalizacion(kv, email, guardian, elegido, datosCanalizacion = {}, ordenId) {
  // Llamar a la API de canalizaciones para generar inmediatamente
  // La canalización quedará pendiente de aprobación en el panel admin

  try {
    const nombreCliente = elegido.nombrePreferido || elegido.nombre;

    // Auto-traducir campos de texto si están en otro idioma
    const datosTraducidos = await traducirDatosCanalizacion(datosCanalizacion);

    const response = await fetch('https://duendes-vercel.vercel.app/api/admin/canalizaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ordenId,
        email,
        nombreCliente,
        guardian,
        datosCheckout: datosTraducidos
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log(`Canalización generada para ${guardian.nombre} - pendiente de aprobación`);
    } else {
      console.error('Error generando canalización:', result.error);
    }
  } catch (error) {
    console.error('Error llamando API de canalizaciones:', error);
  }
}

// ═══════════════════════════════════════════════════════════════
// AUTO-TRADUCCIÓN DE CAMPOS
// ═══════════════════════════════════════════════════════════════

async function traducirDatosCanalizacion(datos) {
  if (!datos || Object.keys(datos).length === 0) return datos;

  const camposATraducir = ['porque_eligio', 'que_espera', 'contexto'];
  const textosParaAnalizar = [];

  // Recolectar textos no vacíos
  for (const campo of camposATraducir) {
    if (datos[campo] && datos[campo].trim().length > 10) {
      textosParaAnalizar.push({ campo, texto: datos[campo] });
    }
  }

  if (textosParaAnalizar.length === 0) return datos;

  // Combinar textos para un solo análisis
  const textoCombinado = textosParaAnalizar.map(t => t.texto).join('\n---\n');

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `Analiza el siguiente texto y responde en JSON:

1. ¿Está escrito principalmente en español? (true/false)
2. Si NO está en español, ¿en qué idioma está?
3. Si NO está en español, tradúcelo al español manteniendo la emoción y el sentido

Texto a analizar:
${textoCombinado}

Responde SOLO con JSON válido en este formato exacto:
{
  "esEspanol": true/false,
  "idiomaOriginal": "nombre del idioma" o null si es español,
  "textoTraducido": "texto traducido" o null si ya es español
}`
      }]
    });

    const respuestaTexto = response.content[0].text;

    // Extraer JSON de la respuesta
    const jsonMatch = respuestaTexto.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return datos;

    const analisis = JSON.parse(jsonMatch[0]);

    // Si está en español, devolver datos originales
    if (analisis.esEspanol) return datos;

    // Si no está en español, agregar traducciones
    const datosConTraduccion = { ...datos };

    // Si hay traducción, procesar
    if (analisis.textoTraducido && analisis.idiomaOriginal) {
      const traducciones = analisis.textoTraducido.split('\n---\n');

      for (let i = 0; i < textosParaAnalizar.length; i++) {
        const { campo, texto } = textosParaAnalizar[i];
        const traduccion = traducciones[i] || analisis.textoTraducido;

        // Guardar original y agregar traducción con nota
        datosConTraduccion[`${campo}_original`] = texto;
        datosConTraduccion[`${campo}_idioma`] = analisis.idiomaOriginal;
        datosConTraduccion[campo] = traduccion;
      }

      // Agregar nota de traducción
      datosConTraduccion._traducido_desde = analisis.idiomaOriginal;
      datosConTraduccion._nota_traduccion = `📝 Traducción automática desde ${analisis.idiomaOriginal}. Los textos originales se conservan.`;

      console.log(`Texto traducido desde ${analisis.idiomaOriginal}`);
    }

    return datosConTraduccion;

  } catch (error) {
    console.error('Error en traducción automática:', error);
    return datos; // En caso de error, devolver datos originales
  }
}

async function programarEmailsConversion(kv, email, nombre, fechaExpira) {
  // Programar emails para días 13, 14 y 15
  const emails = [
    { dia: 13, asunto: 'Quedan 2 días de tu prueba del Círculo' },
    { dia: 14, asunto: 'Mañana termina tu acceso al Círculo' },
    { dia: 15, asunto: 'Tu prueba del Círculo terminó. El Santuario te espera.' }
  ];

  for (const emailConfig of emails) {
    const fechaEnvio = new Date(fechaExpira);
    fechaEnvio.setDate(fechaEnvio.getDate() - (15 - emailConfig.dia));

    const emailProgramado = {
      email,
      nombre,
      asunto: emailConfig.asunto,
      tipo: 'conversion-circulo',
      dia: emailConfig.dia,
      fechaEnvio: fechaEnvio.toISOString()
    };

    await kv.set(`email-programado:${email}:dia${emailConfig.dia}`, emailProgramado);
  }
}

// ═══════════════════════════════════════════════════════════════
// GENERAR TARJETA QR PARA IMPRIMIR
// ═══════════════════════════════════════════════════════════════

async function generarTarjetaQR(kv, ordenId, email, nombreCliente, guardian) {
  const fecha = new Date();
  const codigoQR = `DU${fecha.getFullYear().toString().slice(-2)}${(fecha.getMonth()+1).toString().padStart(2,'0')}-${guardian.id.toString().padStart(5,'0')}`;

  // URL que contendrá el QR (incluye email para autocompletar)
  const urlMiMagia = `https://duendesuy.10web.cloud/mi-magia?codigo=${codigoQR}&email=${encodeURIComponent(email)}`;

  // Guardar tarjeta en KV
  const tarjeta = {
    id: `tarjeta_${ordenId}_${guardian.id}`,
    ordenId,
    email,
    nombreCliente,
    guardian: {
      id: guardian.id,
      nombre: guardian.nombre,
      categoria: guardian.categoria,
      imagen: guardian.imagen
    },
    codigoQR,
    urlMiMagia,
    fechaCompra: fecha.toISOString(),
    impresa: false
  };

  await kv.set(`tarjeta:${tarjeta.id}`, tarjeta);

  // Agregar a lista de tarjetas pendientes
  const pendientes = await kv.get('tarjetas:pendientes') || [];
  pendientes.unshift(tarjeta.id);
  await kv.set('tarjetas:pendientes', pendientes);

  // Guardar también asociada al guardián para fácil acceso
  await kv.set(`qr:guardian:${guardian.id}:orden:${ordenId}`, tarjeta);

  console.log(`Tarjeta QR generada para ${guardian.nombre} - Orden #${ordenId}`);

  return tarjeta;
}

// ═══════════════════════════════════════════════════════════════
// EMAILS
// ═══════════════════════════════════════════════════════════════

async function enviarEmailRunas(resend, email, nombre, runasAgregadas, bonusRunas, totalRunas, token) {
  const linkMiMagia = token
    ? `https://duendes-vercel.vercel.app/mi-magia?token=${token}`
    : 'https://duendes-vercel.vercel.app/mi-magia';

  const bonusMsg = bonusRunas > 0
    ? `<p style="background: rgba(46,204,113,0.15); border: 1px solid rgba(46,204,113,0.3); border-radius: 10px; padding: 12px; text-align: center; color: #2ecc71;">🎁 ¡Incluye <strong>${bonusRunas} runas de regalo</strong>!</p>`
    : '';

  try {
    await resend.emails.send({
      from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
      to: email,
      subject: `✨ ${runasAgregadas} Runas de Poder agregadas a tu cuenta`,
      html: `
        <div style="font-family: Georgia; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
          <div style="max-width: 500px; margin: 0 auto; background: #141420; padding: 40px; border-radius: 15px; border: 1px solid rgba(212,175,55,0.2);">
            <h1 style="color: #d4af37; text-align: center;">ᚱ Runas de Poder</h1>
            <p>Hola ${nombre},</p>
            <p>Se agregaron <strong style="color: #d4af37;">${runasAgregadas} Runas de Poder</strong> a tu cuenta.</p>
            ${bonusMsg}
            <p>Ahora tenés un total de <strong style="color: #d4af37;">${totalRunas} Runas</strong> para usar en experiencias mágicas.</p>
            <div style="background: rgba(212,175,55,0.1); border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 14px; color: rgba(255,255,255,0.7);">¿Qué podés hacer con tus runas?</p>
              <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.5);">Tiradas de runas · Lecturas del alma · Oráculos · Registros akáshicos</p>
            </div>
            <p style="text-align: center; margin-top: 30px;">
              <a href="${linkMiMagia}" style="background: #d4af37; color: #0a0a0a; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold;">Usar mis runas ✦</a>
            </p>
            <p style="color: rgba(255,255,255,0.4); font-size: 12px; text-align: center; margin-top: 25px;">Tus runas nunca expiran. Usalas cuando quieras.</p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Error enviando email de runas:', error);
  }
}

async function enviarEmailCirculo(resend, email, nombre, plan, expira, runasBienvenida, token) {
  const fechaExpira = new Date(expira).toLocaleDateString('es-UY');
  const linkMiMagia = token
    ? `https://duendes-vercel.vercel.app/mi-magia?token=${token}`
    : 'https://duendes-vercel.vercel.app/mi-magia';

  const runasMsg = runasBienvenida > 0
    ? `<div style="background: rgba(46,204,113,0.15); border: 1px solid rgba(46,204,113,0.3); border-radius: 10px; padding: 15px; text-align: center; margin: 20px 0;">
        <p style="margin: 0; color: #2ecc71; font-size: 16px;">🎁 ¡Regalo de bienvenida!</p>
        <p style="margin: 5px 0 0; color: #d4af37; font-size: 24px; font-weight: bold;">${runasBienvenida} ᚱ Runas</p>
      </div>`
    : '';

  try {
    await resend.emails.send({
      from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
      to: email,
      subject: '⭐ Bienvenida al Círculo de Duendes',
      html: `
        <div style="font-family: Georgia; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
          <div style="max-width: 500px; margin: 0 auto; background: #141420; padding: 40px; border-radius: 15px; border: 1px solid rgba(212,175,55,0.2);">
            <h1 style="color: #d4af37; text-align: center;">⭐ Círculo de Duendes</h1>
            <p>Bienvenida al Santuario, ${nombre}.</p>
            <p>Tu membresía <strong style="color: #d4af37;">${plan}</strong> está activa hasta el <strong style="color: #d4af37;">${fechaExpira}</strong>.</p>
            ${runasMsg}
            <p>Ahora tenés acceso a:</p>
            <ul style="line-height: 1.8;">
              <li>Contenido exclusivo semanal</li>
              <li>Foro privado de la comunidad</li>
              <li>Acceso anticipado a nuevos guardianes</li>
              <li>Descuentos permanentes en la tienda</li>
              <li>Runas mensuales de regalo</li>
            </ul>
            <p style="text-align: center; margin-top: 30px;">
              <a href="${linkMiMagia}" style="background: #d4af37; color: #0a0a0a; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold;">Entrar al Círculo ✦</a>
            </p>
            <p style="color: rgba(255,255,255,0.4); font-size: 12px; text-align: center; margin-top: 25px;">El Santuario te espera. No sos una más. Sos parte de la familia.</p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Error enviando email de círculo:', error);
  }
}

async function enviarEmailCompraGuardian(resend, email, nombre, guardianes, treboles, ordenId, token) {
  const nombresGuardianes = guardianes.map(g => g.nombre).join(', ');
  const linkMiMagia = token
    ? `https://duendes-vercel.vercel.app/mi-magia?token=${token}`
    : 'https://duendes-vercel.vercel.app/mi-magia';

  try {
    await resend.emails.send({
      from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
      to: email,
      subject: '👑 Tu guardián ya sabe que viene contigo',
      html: `
        <div style="font-family: Georgia; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
          <div style="max-width: 500px; margin: 0 auto; background: #141420; padding: 40px; border-radius: 15px; border: 1px solid rgba(212,175,55,0.2);">
            <h1 style="color: #d4af37; text-align: center;">👑 ¡Gracias por tu compra!</h1>
            <p>Querida ${nombre},</p>
            <p>Tu guardián <strong style="color: #d4af37;">${nombresGuardianes}</strong> ya sabe que viene contigo.</p>
            <p>En las próximas <strong>4-24 horas</strong> recibirás la canalización personalizada de tu guardián: su historia, su mensaje para vos, y cómo cuidarlo.</p>
            ${treboles > 0 ? `<p>Además, ganaste <strong style="color: #d4af37;">🍀 ${treboles} tréboles</strong> que podés canjear por premios.</p>` : ''}
            <div style="background: rgba(212,175,55,0.1); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
              <p style="margin: 0 0 15px; color: #d4af37; font-weight: bold;">🌟 Tu espacio mágico personal está listo</p>
              <p style="margin: 0 0 15px; font-size: 14px;">En "Mi Magia" podrás ver tu guardián, su canalización cuando esté lista, y acceder a experiencias exclusivas.</p>
              <a href="${linkMiMagia}" style="display: inline-block; background: #d4af37; color: #0a0a0a; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold;">Ir a Mi Magia ✦</a>
            </div>
            <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 30px; text-align: center;">Con amor mágico,<br>Gabriel y Thibisay</p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Error enviando email de compra:', error);
  }
}
