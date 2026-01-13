import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';

// ═══════════════════════════════════════════════════════════════
// WEBHOOK DE WOOCOMMERCE - COMPRA COMPLETADA
// Maneja: Guardianes, Runas de Poder, Membresías del Círculo
// ═══════════════════════════════════════════════════════════════

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
      const categorias = item.meta_data?.find(m => m.key === '_category_slugs')?.value || [];
      const categoriasArray = Array.isArray(categorias) ? categorias : [categorias];
      
      // Detectar tipo de producto
      if (sku.startsWith('runas-de-poder-') || categoriasArray.includes('monedas')) {
        // Es compra de Runas de Poder
        const cantidadRunas = extraerCantidadRunas(sku, item.name);
        runasCompradas.push({
          nombre: item.name,
          cantidad: cantidadRunas * item.quantity,
          precio: item.total
        });
      }
      else if (sku.startsWith('circulo-') || categoriasArray.includes('membresias')) {
        // Es membresía del Círculo
        membresias.push({
          nombre: item.name,
          sku: sku,
          precio: item.total
        });
      }
      else if (categoriasArray.some(c => ['proteccion', 'abundancia', 'amor', 'salud', 'sanacion'].includes(c))) {
        // Es un guardián
        guardianes.push({
          id: item.product_id,
          nombre: item.name,
          categoria: categoriasArray[0],
          precio: item.total,
          fecha: new Date().toISOString(),
          imagen: item.image?.src || null
        });
      }
      else {
        otros.push(item);
      }
    }
    
    // ═══════════════════════════════════════════════════════════
    // PROCESAR RUNAS DE PODER
    // ═══════════════════════════════════════════════════════════
    
    if (runasCompradas.length > 0) {
      const totalRunas = runasCompradas.reduce((sum, r) => sum + r.cantidad, 0);
      elegido.runas = (elegido.runas || 0) + totalRunas;
      
      console.log(`Agregadas ${totalRunas} Runas de Poder a ${email}`);
      
      // Enviar email confirmando runas
      await enviarEmailRunas(resend, email, nombre, totalRunas, elegido.runas);
    }
    
    // ═══════════════════════════════════════════════════════════
    // PROCESAR MEMBRESÍAS DEL CÍRCULO
    // ═══════════════════════════════════════════════════════════
    
    if (membresias.length > 0) {
      for (const membresia of membresias) {
        const diasMembresia = calcularDiasMembresia(membresia.sku);
        
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
        circulo.plan = membresia.sku;
        circulo.expira = nuevaExpiracion.toISOString();
        circulo.ultimaCompra = new Date().toISOString();
        
        await kv.set(`circulo:${email}`, circulo);
        
        console.log(`Membresía ${membresia.sku} activada para ${email} hasta ${nuevaExpiracion}`);
        
        // Enviar email de bienvenida al Círculo
        await enviarEmailCirculo(resend, email, nombre, membresia.sku, nuevaExpiracion);
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

      // Generar guía de canalización y tarjeta QR para cada guardián
      for (const guardian of guardianes) {
        await programarCanalizacion(kv, email, guardian, elegido);
        await generarTarjetaQR(kv, ordenId, email, nombre, guardian);
      }

      // Enviar email de compra confirmada (ahora incluye QR)
      await enviarEmailCompraGuardian(resend, email, nombre, guardianes, trebolsGanados, ordenId);
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
    
    // Generar token de acceso si no existe
    if (!elegido.token) {
      elegido.token = generarToken();
      await kv.set(`token:${elegido.token}`, { email, nombre }, { ex: 365 * 24 * 60 * 60 });
    }
    
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
  if (sku.includes('mensual')) return 30;
  if (sku.includes('trimestral')) return 90;
  if (sku.includes('semestral')) return 180;
  if (sku.includes('anual')) return 365;
  return 30; // Default
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
  return `mm_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 12)}`;
}

async function programarCanalizacion(kv, email, guardian, elegido) {
  // Crear solicitud de canalización programada para 4 horas
  const solicitudId = `can_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const fechaEntrega = new Date();
  fechaEntrega.setHours(fechaEntrega.getHours() + 4);
  
  // Verificar horario nocturno
  const horaEntrega = fechaEntrega.getHours();
  if (horaEntrega >= 22 || horaEntrega < 6) {
    fechaEntrega.setDate(fechaEntrega.getDate() + (horaEntrega >= 22 ? 1 : 0));
    fechaEntrega.setHours(6, 30, 0, 0);
  }
  
  const solicitud = {
    id: solicitudId,
    tipo: 'canalizacion-guardian',
    email,
    guardian,
    pronombre: elegido.pronombre || 'ella',
    nombreUsuario: elegido.nombrePreferido || elegido.nombre,
    fechaEntrega: fechaEntrega.toISOString(),
    estado: 'pendiente'
  };
  
  await kv.set(`solicitud:${solicitudId}`, solicitud);
  
  // Agregar a cola
  const cola = await kv.get('cola:experiencias') || [];
  cola.push(solicitudId);
  await kv.set('cola:experiencias', cola);
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

async function enviarEmailRunas(resend, email, nombre, runasAgregadas, totalRunas) {
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
            <p>Ahora tenés un total de <strong style="color: #d4af37;">${totalRunas} Runas</strong> para usar en experiencias mágicas.</p>
            <p style="text-align: center; margin-top: 30px;">
              <a href="https://duendes-vercel.vercel.app/mi-magia" style="background: #d4af37; color: #0a0a0a; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold;">Ir a Mi Magia</a>
            </p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Error enviando email de runas:', error);
  }
}

async function enviarEmailCirculo(resend, email, nombre, plan, expira) {
  const fechaExpira = new Date(expira).toLocaleDateString('es-UY');
  
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
            <p>Tu membresía está activa hasta el <strong style="color: #d4af37;">${fechaExpira}</strong>.</p>
            <p>Ahora tenés acceso a:</p>
            <ul>
              <li>Contenido exclusivo semanal</li>
              <li>Acceso anticipado a nuevos guardianes</li>
              <li>Descuentos permanentes</li>
              <li>Tiradas de runas gratis cada mes</li>
            </ul>
            <p style="text-align: center; margin-top: 30px;">
              <a href="https://duendes-vercel.vercel.app/mi-magia" style="background: #d4af37; color: #0a0a0a; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold;">Entrar al Círculo</a>
            </p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Error enviando email de círculo:', error);
  }
}

async function enviarEmailCompraGuardian(resend, email, nombre, guardianes, treboles) {
  const nombresGuardianes = guardianes.map(g => g.nombre).join(', ');
  
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
            <p>En las próximas <strong>4 horas</strong> recibirás la canalización personalizada de tu guardián: su historia, su mensaje para vos, y cómo cuidarlo.</p>
            ${treboles > 0 ? `<p>Además, ganaste <strong style="color: #d4af37;">🍀 ${treboles} tréboles</strong> que podés canjear por premios.</p>` : ''}
            <p style="text-align: center; margin-top: 30px;">
              <a href="https://duendes-vercel.vercel.app/mi-magia" style="background: #d4af37; color: #0a0a0a; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold;">Ir a Mi Magia</a>
            </p>
            <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 30px;">Con amor mágico,<br>Gabriel y Thibisay</p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Error enviando email de compra:', error);
  }
}
