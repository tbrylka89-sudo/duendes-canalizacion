import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import crypto from 'crypto';
import { PAQUETES_RUNAS, MEMBRESIAS, XP_ACCIONES, obtenerNivel } from '@/lib/gamificacion/config';
import { registrarEvento, TIPOS_EVENTO } from '@/lib/guardian-intelligence/daily-report';
import { invalidarCacheProductos } from '@/lib/tito/conocimiento';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════
// WEBHOOK UNIFICADO DE WOOCOMMERCE
// Maneja: Guardianes, Runas de Poder, Membresías del Círculo,
// Lecturas Ancestrales, Productos, Stock, Verificación de firma
// ═══════════════════════════════════════════════════════════════

// Verificar firma del webhook de WooCommerce
function verificarFirma(payload, signature, secret) {
  if (!secret) return true; // Si no hay secret configurado, aceptar todo (dev)
  if (!signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64');

  return signature === expectedSignature;
}

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
    // ═══════════════════════════════════════════════════════════
    // VERIFICACIÓN DE FIRMA Y PARSING
    // ═══════════════════════════════════════════════════════════

    const webhookSecret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;
    const signature = request.headers.get('x-wc-webhook-signature');
    const webhookTopic = request.headers.get('x-wc-webhook-topic');
    const webhookResource = request.headers.get('x-wc-webhook-resource');
    const rawBody = await request.text();

    // Verificar firma si hay secret configurado
    if (webhookSecret && !verificarFirma(rawBody, signature, webhookSecret)) {
      console.log('[WEBHOOK-WOO] Firma inválida');
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // ═══════════════════════════════════════════════════════════
    // DETECTAR TIPO DE EVENTO Y ENRUTAR
    // ═══════════════════════════════════════════════════════════

    // Eventos de PRODUCTOS (product.updated, product.deleted, product.created)
    if (webhookTopic?.startsWith('product.') || webhookResource === 'product') {
      return await manejarEventoProducto(payload, webhookTopic);
    }

    // Eventos de STOCK (action.woocommerce_low_stock, etc.)
    if (webhookTopic?.includes('stock') || webhookTopic === 'action.woocommerce_low_stock') {
      return await manejarEventoStock(payload, webhookTopic);
    }

    // Si no tiene billing.email, podría ser otro tipo de evento
    const orden = payload;

    // Verificar que es una orden válida
    if (!orden || !orden.id || !orden.billing?.email) {
      // Podría ser un ping de prueba o evento desconocido
      if (orden?.webhook_id || webhookTopic === 'action.woocommerce_webhook_ping') {
        console.log('[WEBHOOK-WOO] Ping recibido');
        return Response.json({ success: true, message: 'Ping acknowledged' });
      }
      console.log('[WEBHOOK-WOO] Evento no reconocido:', webhookTopic || 'sin topic');
      return Response.json({ success: false, error: 'Evento no manejado' }, { status: 400 });
    }

    const email = orden.billing.email.toLowerCase();
    const nombre = orden.billing.first_name || 'Amiga';
    const ordenId = orden.id;
    const total = parseFloat(orden.total) || 0;

    // ═══════════════════════════════════════════════════════════
    // VERIFICAR DUPLICADOS
    // ═══════════════════════════════════════════════════════════

    const ordenKey = `orden:procesada:${ordenId}`;
    const yaProc = await kv.get(ordenKey);
    if (yaProc) {
      console.log(`[WEBHOOK-WOO] Orden ${ordenId} ya procesada anteriormente`);
      return Response.json({ success: true, ignored: true, reason: 'already_processed' });
    }

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
      // 3. Guardianes - detectar por categorías del line_item O consultando WooCommerce
      else if (categoriasArray.some(c => ['proteccion', 'abundancia', 'amor', 'salud', 'sanacion'].includes(c))) {
        const datosCompletos = await obtenerDatosCompletoProducto(item.product_id);
        guardianes.push({
          id: item.product_id,
          nombre: item.name,
          categoria: categoriasArray[0],
          precio: parseFloat(item.total) || 0,
          fecha: new Date().toISOString(),
          imagen: item.image?.src || null,
          ...datosCompletos
        });
      }
      // 4. Fallback: si no matcheó nada, consultar producto en WooCommerce para ver si es guardián
      else if (item.product_id) {
        const datosCompletos = await obtenerDatosCompletoProducto(item.product_id);
        const categoriasProducto = datosCompletos.categorias || [];
        const categoriaSlugs = datosCompletos.categoriaSlugs || [];
        const CATS_GUARDIAN = ['proteccion', 'abundancia', 'amor', 'salud', 'sanacion', 'protección', 'sanación'];
        const esGuardian = categoriaSlugs.some(c => CATS_GUARDIAN.includes(c)) ||
          categoriasProducto.some(c => CATS_GUARDIAN.some(cg => c.toLowerCase().includes(cg)));

        if (esGuardian) {
          const catDetectada = categoriaSlugs.find(c => CATS_GUARDIAN.includes(c)) || categoriasProducto[0] || 'proteccion';
          guardianes.push({
            id: item.product_id,
            nombre: item.name,
            categoria: catDetectada,
            precio: parseFloat(item.total) || 0,
            fecha: new Date().toISOString(),
            imagen: item.image?.src || null,
            ...datosCompletos
          });
          console.log(`[WEBHOOK-WOO] Guardián detectado via WooCommerce API: ${item.name} (${catDetectada})`);
        } else {
          otros.push(item);
        }
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

        // ═══════════════════════════════════════════════════════════
        // SINCRONIZACIÓN COMPLETA: Guardar en los 3 lugares
        // ═══════════════════════════════════════════════════════════

        // 1. Guardar en circulo:${email}
        await kv.set(`circulo:${email}`, circulo);

        // 2. También guardar en el elegido para fácil acceso
        elegido.circulo = {
          activo: true,
          plan: circulo.plan,
          expira: circulo.expira
        };
        elegido.esCirculo = true;
        elegido.circuloPlan = circulo.plan;
        elegido.circuloExpira = circulo.expira;

        // 3. Guardar/actualizar user:${email} con datos del Círculo
        let userData = await kv.get(`user:${email}`) || {
          email,
          nombre,
          createdAt: new Date().toISOString()
        };
        userData.esCirculo = true;
        userData.circuloPlan = circulo.plan;
        userData.circuloPlanNombre = circulo.planNombre;
        userData.circuloExpira = circulo.expira;
        userData.circuloUltimaCompra = new Date().toISOString();
        userData.nombre = userData.nombre || nombre;
        await kv.set(`user:${email}`, userData);

        // 4. Crear/actualizar mapeo token:${token} -> {email, nombre}
        // (El token ya se generó arriba si no existía)
        if (elegido.token) {
          await kv.set(`token:${elegido.token}`, {
            email,
            nombre,
            esCirculo: true,
            circuloPlan: circulo.plan,
            circuloExpira: circulo.expira
          }, { ex: 365 * 24 * 60 * 60 }); // 1 año
        }

        // Dar runas de bienvenida si tiene config
        if (membresiaConfig?.runasBienvenida > 0) {
          elegido.runas = (elegido.runas || 0) + membresiaConfig.runasBienvenida;
          console.log(`Runas de bienvenida del Círculo: +${membresiaConfig.runasBienvenida}`);
        }

        console.log(`Membresía ${circulo.planNombre || membresia.sku} activada para ${email} hasta ${nuevaExpiracion}`);
        console.log(`Sincronizado en: circulo:${email}, elegido:${email}, user:${email}, token:${elegido.token}`);

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

      // Extraer tipo de destinatario y datos de canalización del meta_data
      const tipoDestinatarioMeta = orden.meta_data?.find(m => m.key === '_duendes_tipo_destinatario');
      const tipoDestinatario = tipoDestinatarioMeta?.value || null;
      const datosCanalizacionMeta = orden.meta_data?.find(m => m.key === '_duendes_datos_canalizacion');
      let datosCanalizacionParsed = null;
      if (datosCanalizacionMeta?.value) {
        try {
          datosCanalizacionParsed = typeof datosCanalizacionMeta.value === 'string'
            ? JSON.parse(datosCanalizacionMeta.value)
            : datosCanalizacionMeta.value;
        } catch { /* ignorar parse errors */ }
      }

      // Crear borradores de canalización y enviar formulario al cliente
      const itemsConCanal = [];
      for (const guardian of guardianes) {
        const borradorId = await crearBorradorCanalizacion(email, nombre, guardian, ordenId);
        if (borradorId) {
          itemsConCanal.push({
            nombre: guardian.nombre,
            product_id: guardian.id,
            imagen: guardian.imagen || null,
            canalizacionId: borradorId
          });
        }
        await generarTarjetaQR(kv, ordenId, email, nombre, guardian);
      }

      // Enviar formulario de Vercel al cliente
      if (itemsConCanal.length > 0) {
        await enviarFormularioAlCliente(email, nombre, ordenId, itemsConCanal);
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
        circulo.planNombre = 'Prueba Gratuita';
        circulo.expira = expiraPrueba.toISOString();
        circulo.esPrueba = true;

        // ═══════════════════════════════════════════════════════════
        // SINCRONIZACIÓN COMPLETA para prueba gratis también
        // ═══════════════════════════════════════════════════════════

        // 1. Guardar en circulo:${email}
        await kv.set(`circulo:${email}`, circulo);

        // 2. Actualizar elegido
        elegido.circulo = {
          activo: true,
          plan: 'prueba-gratis',
          expira: expiraPrueba.toISOString(),
          esPrueba: true
        };
        elegido.esCirculo = true;
        elegido.circuloPlan = 'prueba-gratis';
        elegido.circuloExpira = expiraPrueba.toISOString();
        elegido.circuloPrueba = true;

        // 3. Guardar/actualizar user:${email}
        let userData = await kv.get(`user:${email}`) || {
          email,
          nombre,
          createdAt: new Date().toISOString()
        };
        userData.esCirculo = true;
        userData.circuloPlan = 'prueba-gratis';
        userData.circuloPlanNombre = 'Prueba Gratuita';
        userData.circuloExpira = expiraPrueba.toISOString();
        userData.circuloPrueba = true;
        userData.nombre = userData.nombre || nombre;
        await kv.set(`user:${email}`, userData);

        // 4. Actualizar mapeo token con info de prueba
        if (elegido.token) {
          await kv.set(`token:${elegido.token}`, {
            email,
            nombre,
            esCirculo: true,
            circuloPlan: 'prueba-gratis',
            circuloExpira: expiraPrueba.toISOString(),
            circuloPrueba: true
          }, { ex: 365 * 24 * 60 * 60 });
        }

        // Programar emails de conversión
        await programarEmailsConversion(kv, email, nombre, expiraPrueba);

        console.log(`Prueba gratis del Círculo sincronizada en todos los lugares para ${email}`);
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

    // ═══════════════════════════════════════════════════════════
    // DETECTAR LECTURAS ANCESTRALES Y PROGRAMAR GENERACIÓN
    // ═══════════════════════════════════════════════════════════

    let esLectura = false;
    let tieneGuardianes = guardianes.length > 0;

    for (const item of items) {
      const nombreItem = item.name?.toLowerCase() || '';
      const skuItem = item.sku?.toLowerCase() || '';
      if (nombreItem.includes('lectura ancestral') || skuItem.includes('lectura-ancestral')) {
        esLectura = true;
      }
    }

    // Programar generación de contenido según horario
    if (esLectura || tieneGuardianes) {
      const ahora = new Date();
      const hora = ahora.getHours();
      let generateAt;

      if (esLectura && !tieneGuardianes) {
        // Lectura ancestral sola: 20 minutos
        generateAt = Date.now() + (20 * 60 * 1000);
      } else if (hora >= 6 && hora < 18) {
        // 06:00 - 17:59: esperar 4 horas
        generateAt = Date.now() + (4 * 60 * 60 * 1000);
      } else if (hora >= 18 && hora < 22) {
        // 18:00 - 21:59: esperar hasta las 08:00 del día siguiente
        const manana = new Date(ahora);
        manana.setDate(manana.getDate() + 1);
        manana.setHours(8, 0, 0, 0);
        generateAt = manana.getTime();
      } else {
        // 22:00 - 05:59: esperar hasta las 10:00
        const objetivo = new Date(ahora);
        if (hora >= 22) objetivo.setDate(objetivo.getDate() + 1);
        objetivo.setHours(10, 0, 0, 0);
        generateAt = objetivo.getTime();
      }

      // Guardar orden pendiente de generación
      const tipoPendiente = esLectura && tieneGuardianes ? 'ambos' : esLectura ? 'lectura' : 'portal';
      await kv.set(`pending:${ordenId}`, {
        orderId: ordenId,
        orderData: orden,
        createdAt: Date.now(),
        generateAt,
        status: 'pending',
        tipo: tipoPendiente,
        esLectura,
        tieneGuardianes
      });

      // Agregar a lista de pendientes
      const pendingOrders = await kv.get('pending_orders') || [];
      if (!pendingOrders.includes(ordenId.toString())) {
        pendingOrders.push(ordenId.toString());
        await kv.set('pending_orders', pendingOrders);
      }
    }

    // ═══════════════════════════════════════════════════════════
    // REGISTRAR EVENTO PARA REPORTE DIARIO
    // ═══════════════════════════════════════════════════════════

    registrarEvento(TIPOS_EVENTO.VENTA, {
      orderId: ordenId,
      total,
      moneda: orden.currency,
      productos: items.map(i => i.name).join(', '),
      cantidadItems: items.length,
      pais: orden.billing?.country,
      tipo: esLectura ? (tieneGuardianes ? 'ambos' : 'lectura') : 'guardian',
      esLectura,
      tieneGuardianes,
      guardianes: guardianes.length,
      runas: runasCompradas.reduce((s, r) => s + r.cantidad, 0),
      membresias: membresias.length,
      esPrimeraCompra
    });

    // ═══════════════════════════════════════════════════════════
    // MARCAR ORDEN COMO PROCESADA (anti-duplicados)
    // ═══════════════════════════════════════════════════════════

    await kv.set(ordenKey, {
      email,
      procesado: new Date().toISOString(),
      guardianes: guardianes.length,
      runas: runasCompradas.reduce((s, r) => s + r.cantidad, 0),
      membresias: membresias.length
    }, { ex: 30 * 24 * 60 * 60 }); // Expira en 30 días

    return Response.json({
      success: true,
      mensaje: 'Orden procesada correctamente',
      guardianes: guardianes.length,
      runas: runasCompradas.reduce((s, r) => s + r.cantidad, 0),
      membresias: membresias.length,
      esPrimeraCompra,
      esLectura,
      tieneGuardianes
    });

  } catch (error) {
    console.error('Error en webhook:', error);

    // Registrar error para reporte
    registrarEvento(TIPOS_EVENTO.ERROR_API, {
      endpoint: '/api/webhooks/woocommerce',
      error: error.message
    });

    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET para verificar que el webhook está activo
export async function GET() {
  return Response.json({
    status: 'active',
    endpoint: '/api/webhooks/woocommerce',
    message: 'Webhook unificado de WooCommerce. Maneja: Guardianes, Runas, Membresías, Lecturas, Productos, Stock.',
    features: [
      'Verificación de firma HMAC',
      'Protección anti-duplicados',
      'Gamificación automática',
      'Emails transaccionales',
      'Programación de canalizaciones',
      'Registro para reporte diario',
      'Invalidación de caché de productos',
      'Detección de stock bajo'
    ],
    eventos_soportados: [
      'order.created - Procesar compras',
      'product.created - Invalidar caché',
      'product.updated - Invalidar caché',
      'product.deleted - Remover de caché',
      'action.woocommerce_low_stock - Marcar bajo stock'
    ],
    configuracion_woocommerce: {
      url: 'https://duendes-vercel.vercel.app/api/webhooks/woocommerce',
      secret: 'Configurar WOOCOMMERCE_WEBHOOK_SECRET en Vercel',
      version: 'WC API Version 3',
      metodo: 'POST + JSON'
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// MANEJO DE EVENTOS DE PRODUCTOS
// ═══════════════════════════════════════════════════════════════

async function manejarEventoProducto(producto, topic) {
  const productoId = producto?.id;
  const productoNombre = producto?.name || 'Desconocido';

  console.log(`[WEBHOOK-WOO] Evento de producto: ${topic} - ID: ${productoId} - ${productoNombre}`);

  try {
    // Determinar acción según el topic
    if (topic === 'product.deleted') {
      // Producto eliminado - invalidar caché y registrar
      await invalidarCacheProductos('product.deleted', productoId);

      // Registrar evento para reporte
      registrarEvento(TIPOS_EVENTO.PRODUCTO, {
        accion: 'eliminado',
        productoId,
        productoNombre
      });

      console.log(`[WEBHOOK-WOO] Producto ${productoId} (${productoNombre}) eliminado - caché invalidado`);

      return Response.json({
        success: true,
        evento: 'product.deleted',
        productoId,
        accion: 'cache_invalidado'
      });
    }

    if (topic === 'product.updated' || topic === 'product.created') {
      // Producto actualizado o creado - invalidar caché
      await invalidarCacheProductos(topic, productoId);

      // Detectar si el producto tiene stock bajo
      const stockStatus = producto?.stock_status;
      const stockQuantity = producto?.stock_quantity;
      const manageStock = producto?.manage_stock;

      let stockBajo = false;
      if (manageStock && stockQuantity !== null && stockQuantity <= 2) {
        stockBajo = true;
        await marcarProductoStockBajo(productoId, productoNombre, stockQuantity);
      }

      // Registrar evento
      registrarEvento(TIPOS_EVENTO.PRODUCTO, {
        accion: topic === 'product.created' ? 'creado' : 'actualizado',
        productoId,
        productoNombre,
        stockStatus,
        stockQuantity,
        stockBajo
      });

      console.log(`[WEBHOOK-WOO] Producto ${productoId} (${productoNombre}) ${topic === 'product.created' ? 'creado' : 'actualizado'} - caché invalidado${stockBajo ? ' - STOCK BAJO' : ''}`);

      return Response.json({
        success: true,
        evento: topic,
        productoId,
        accion: 'cache_invalidado',
        stockBajo
      });
    }

    // Evento de producto desconocido
    return Response.json({
      success: true,
      evento: topic || 'unknown',
      productoId,
      message: 'Evento recibido pero no requiere acción específica'
    });

  } catch (error) {
    console.error('[WEBHOOK-WOO] Error procesando evento de producto:', error);
    return Response.json({
      success: false,
      error: error.message,
      evento: topic
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// MANEJO DE EVENTOS DE STOCK
// ═══════════════════════════════════════════════════════════════

async function manejarEventoStock(payload, topic) {
  console.log(`[WEBHOOK-WOO] Evento de stock: ${topic}`);

  try {
    // El payload puede ser el producto o un objeto con info de stock
    const productoId = payload?.id || payload?.product_id;
    const productoNombre = payload?.name || payload?.product_name || 'Desconocido';
    const stockQuantity = payload?.stock_quantity ?? payload?.quantity;

    if (productoId) {
      await marcarProductoStockBajo(productoId, productoNombre, stockQuantity);
      await invalidarCacheProductos('stock.low', productoId);

      registrarEvento(TIPOS_EVENTO.PRODUCTO, {
        accion: 'stock_bajo',
        productoId,
        productoNombre,
        stockQuantity
      });

      console.log(`[WEBHOOK-WOO] ⚠️ Stock bajo detectado: ${productoNombre} (${stockQuantity} unidades)`);
    }

    return Response.json({
      success: true,
      evento: topic,
      productoId,
      accion: 'stock_bajo_registrado'
    });

  } catch (error) {
    console.error('[WEBHOOK-WOO] Error procesando evento de stock:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * Marca un producto como de stock bajo en KV
 * para mostrar alertas o notificaciones
 */
async function marcarProductoStockBajo(productoId, nombre, cantidad) {
  try {
    const key = `stock:bajo:${productoId}`;
    await kv.set(key, {
      productoId,
      nombre,
      cantidad,
      detectadoEn: new Date().toISOString()
    }, { ex: 7 * 24 * 60 * 60 }); // Expira en 7 días

    // Agregar a lista de productos con stock bajo
    const lista = await kv.get('stock:bajo:lista') || [];
    if (!lista.includes(productoId)) {
      lista.push(productoId);
      await kv.set('stock:bajo:lista', lista);
    }

    console.log(`[WEBHOOK-WOO] Producto ${productoId} marcado como stock bajo`);
  } catch (e) {
    console.error('[WEBHOOK-WOO] Error marcando stock bajo:', e.message);
  }
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

// Obtener TODOS los datos del producto desde WooCommerce API
async function obtenerDatosCompletoProducto(productId) {
  try {
    const wcKey = process.env.WC_CONSUMER_KEY;
    const wcSecret = process.env.WC_CONSUMER_SECRET;
    const wcUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';

    const auth = Buffer.from(`${wcKey}:${wcSecret}`).toString('base64');

    const response = await fetch(
      `${wcUrl}/wp-json/wc/v3/products/${productId}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error(`Error obteniendo producto ${productId}: ${response.status}`);
      return {};
    }

    const producto = await response.json();

    // Extraer meta_data como objeto plano
    const metaData = {};
    if (producto.meta_data) {
      for (const meta of producto.meta_data) {
        // Ignorar campos internos de WooCommerce
        if (!meta.key.startsWith('_')) {
          metaData[meta.key] = meta.value;
        }
      }
    }

    // Devolver todos los datos relevantes del producto
    return {
      // Datos básicos
      descripcion: producto.description || '',
      descripcionCorta: producto.short_description || '',
      slug: producto.slug || '',

      // Meta data personalizada (personalidad, historia, color, etc.)
      // Esto incluye CUALQUIER campo personalizado que se agregue en el futuro
      ...metaData,

      // Atributos del producto
      atributos: producto.attributes?.reduce((acc, attr) => {
        acc[attr.name.toLowerCase()] = attr.options;
        return acc;
      }, {}) || {},

      // Categorías completas
      categorias: producto.categories?.map(c => c.name) || [],
      categoriaSlugs: producto.categories?.map(c => c.slug) || [],

      // Tags
      tags: producto.tags?.map(t => t.name) || [],

      // Imágenes adicionales
      imagenes: producto.images?.map(img => img.src) || []
    };

  } catch (error) {
    console.error('Error obteniendo datos completos del producto:', error);
    return {};
  }
}

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

async function crearBorradorCanalizacion(email, nombre, guardian, ordenId) {
  // Crear borrador de canalización (sin generar con IA todavía)
  // El cliente llenará el formulario primero, después Claude genera la carta
  try {
    const response = await fetch('https://duendes-vercel.vercel.app/api/admin/canalizaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        esManual: true,
        ordenId,
        email,
        nombreCliente: nombre,
        productoManual: {
          nombre: guardian.nombre,
          tipo: 'guardian',
          categoria: guardian.categoria || 'proteccion',
          productId: guardian.id,
          imagenUrl: guardian.imagen || null
        },
        formType: null,
        notaAdmin: `Auto - Pedido #${ordenId}`
      })
    });

    const result = await response.json();
    if (result.success) {
      console.log(`[WEBHOOK-WOO] Borrador creado para ${guardian.nombre}: ${result.id}`);
      return result.id;
    } else {
      console.error('[WEBHOOK-WOO] Error creando borrador:', result.error);
      return null;
    }
  } catch (error) {
    console.error('[WEBHOOK-WOO] Error creando borrador:', error);
    return null;
  }
}

async function enviarFormularioAlCliente(email, nombre, ordenId, itemsConCanal) {
  // Enviar UN email con formulario para todos los guardianes del pedido
  try {
    const response = await fetch('https://duendes-vercel.vercel.app/api/admin/formularios/enviar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        nombre,
        formType: null, // El cliente elige el tipo
        ordenId,
        productName: itemsConCanal.map(i => i.nombre).join(', '),
        items: itemsConCanal
      })
    });

    const result = await response.json();
    if (result.success) {
      console.log(`[WEBHOOK-WOO] Formulario enviado a ${email} para ${itemsConCanal.length} guardianes`);
    } else {
      console.error('[WEBHOOK-WOO] Error enviando formulario:', result.error);
    }
  } catch (error) {
    console.error('[WEBHOOK-WOO] Error enviando formulario:', error);
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
  const urlMiMagia = `https://duendesdeluruguay.com/mi-magia?codigo=${codigoQR}&email=${encodeURIComponent(email)}`;

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

  // Link principal al Círculo con token
  const linkCirculo = token
    ? `https://duendes-vercel.vercel.app/mi-magia/circulo?token=${token}`
    : 'https://duendes-vercel.vercel.app/mi-magia/circulo';

  // Link secundario a Mi Magia
  const linkMiMagia = token
    ? `https://duendes-vercel.vercel.app/mi-magia?token=${token}`
    : 'https://duendes-vercel.vercel.app/mi-magia';

  const runasMsg = runasBienvenida > 0
    ? `<div style="background: rgba(46,204,113,0.15); border: 1px solid rgba(46,204,113,0.3); border-radius: 10px; padding: 15px; text-align: center; margin: 20px 0;">
        <p style="margin: 0; color: #2ecc71; font-size: 16px;">🎁 Regalo de bienvenida</p>
        <p style="margin: 5px 0 0; color: #d4af37; font-size: 24px; font-weight: bold;">${runasBienvenida} ᚱ Runas</p>
      </div>`
    : '';

  try {
    await resend.emails.send({
      from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
      to: email,
      subject: `✦ Bienvenida al Círculo de Duendes, ${nombre}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
          <h1 style="color: #d4af37; font-size: 28px; text-align: center;">✦ Bienvenida al Círculo ✦</h1>

          <p style="font-size: 18px; line-height: 1.8;">
            ${nombre},
          </p>

          <p style="font-size: 16px; line-height: 1.8;">
            Acabás de entrar al santuario secreto. A partir de ahora, tenés acceso a contenido exclusivo,
            experiencias mágicas, y privilegios que solo los miembros del Círculo conocen.
          </p>

          <div style="background: #1a1a1a; border: 1px solid #d4af37; border-radius: 10px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #d4af37; margin-top: 0;">Tu Plan: ${plan}</h3>
            <p style="margin: 0; color: #888;">Activo hasta: <strong style="color: #f5f5f5;">${fechaExpira}</strong></p>
            <ul style="list-style: none; padding: 0; line-height: 2; margin-top: 15px;">
              <li>✦ Contenido semanal exclusivo</li>
              <li>✦ Tiradas de runas gratis cada mes</li>
              <li>✦ Acceso anticipado a nuevos guardianes</li>
              <li>✦ Descuentos permanentes en la tienda</li>
              <li>✦ Runas de regalo mensuales</li>
            </ul>
          </div>

          ${runasMsg}

          <div style="text-align: center; margin: 40px 0;">
            <a href="${linkCirculo}" style="display: inline-block; background: #d4af37; color: #0a0a0a; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 16px;">
              Acceder al Círculo ✦
            </a>
          </div>

          <div style="background: rgba(212,175,55,0.1); border-radius: 10px; padding: 20px; margin: 30px 0;">
            <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.7);">
              <strong>Tu enlace personal:</strong><br>
              <a href="${linkCirculo}" style="color: #d4af37; word-break: break-all;">${linkCirculo}</a>
            </p>
            <p style="margin: 10px 0 0; font-size: 12px; color: rgba(255,255,255,0.5);">
              Guardá este email. Este enlace es tuyo y te da acceso directo al Círculo.
            </p>
          </div>

          <p style="font-size: 14px; color: #888; text-align: center;">
            También podés acceder a tu portal personal en <a href="${linkMiMagia}" style="color: #d4af37;">Mi Magia</a>
          </p>

          <p style="font-size: 16px; line-height: 1.8; margin-top: 40px;">
            Con cariño desde Piriápolis,<br>
            <strong style="color: #d4af37;">El equipo de Duendes del Uruguay</strong>
          </p>
        </div>
      `
    });
    console.log(`[EMAIL] Bienvenida Círculo enviado a ${email}`);
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
            <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 30px; text-align: center;">Con amor mágico,<br>Duendes del Uruguay</p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Error enviando email de compra:', error);
  }
}
