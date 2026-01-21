/**
 * GUARDIAN INTELLIGENCE - SISTEMA DE PROMOCIONES Y BANNERS
 * Crea, gestiona y rota promociones automáticamente
 */

import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG_PROMOCIONES = {
  // Tipos de promociones
  tipos: {
    descuento: {
      nombre: 'Descuento',
      icono: '💰',
      plantillas: [
        '¡{porcentaje}% OFF en {categoria}!',
        'Solo por hoy: {porcentaje}% de descuento',
        'Oferta especial: -{porcentaje}% en guardianes de {categoria}'
      ]
    },
    envio_gratis: {
      nombre: 'Envío Gratis',
      icono: '🚚',
      plantillas: [
        '¡Envío gratis en compras +${monto}!',
        'Esta semana: envío sin cargo a todo Uruguay',
        'Llevá tu guardián a casa sin costo de envío'
      ]
    },
    combo: {
      nombre: 'Combo/Pack',
      icono: '🎁',
      plantillas: [
        'Llevá 2 y el tercero tiene 50% OFF',
        'Pack especial: guardián + kit de bienvenida',
        'Combo mágico: {producto1} + {producto2}'
      ]
    },
    temporada: {
      nombre: 'Temporada',
      icono: '🌟',
      plantillas: [
        'Colección {temporada} - Edición limitada',
        'Nuevos guardianes de {temporada}',
        'Solo esta {temporada}: diseños exclusivos'
      ]
    },
    fecha_especial: {
      nombre: 'Fecha Especial',
      icono: '🎉',
      plantillas: [
        '¡Feliz {fecha}! -{porcentaje}% en toda la tienda',
        'Celebramos {fecha} con vos',
        'Regalo de {fecha}: envío gratis + descuento'
      ]
    }
  },

  // Fechas especiales predefinidas
  fechasEspeciales: [
    { mes: 1, dia: 1, nombre: 'Año Nuevo' },
    { mes: 2, dia: 14, nombre: 'San Valentín' },
    { mes: 3, dia: 8, nombre: 'Día de la Mujer' },
    { mes: 5, dia: 10, nombre: 'Día de la Madre' }, // Segundo domingo de mayo (aproximado)
    { mes: 6, dia: 21, nombre: 'Solsticio de Invierno' },
    { mes: 7, dia: 17, nombre: 'Día del Padre' }, // Tercer domingo de julio (aproximado)
    { mes: 10, dia: 31, nombre: 'Halloween' },
    { mes: 11, dia: 25, nombre: 'Black Friday' }, // Cuarto viernes (aproximado)
    { mes: 12, dia: 21, nombre: 'Solsticio de Verano' },
    { mes: 12, dia: 25, nombre: 'Navidad' }
  ],

  // Duración por defecto (en horas)
  duracionDefault: 72,

  // Máximo de promociones activas simultáneas
  maxActivas: 3
};

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES PRINCIPALES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Crear nueva promoción
 */
export async function crearPromocion(datos) {
  const {
    tipo,
    titulo,
    descripcion,
    codigo,
    porcentaje,
    monto,
    productos,
    categorias,
    fechaInicio,
    fechaFin,
    activa = true,
    imagen,
    colorFondo,
    colorTexto
  } = datos;

  const id = `promo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const promocion = {
    id,
    tipo: tipo || 'descuento',
    titulo: titulo || generarTituloAutomatico(datos),
    descripcion: descripcion || '',
    codigo: codigo || generarCodigo(),
    porcentaje: porcentaje || null,
    monto: monto || null,
    productos: productos || [],
    categorias: categorias || [],
    fechaCreacion: new Date().toISOString(),
    fechaInicio: fechaInicio || new Date().toISOString(),
    fechaFin: fechaFin || calcularFechaFin(CONFIG_PROMOCIONES.duracionDefault),
    activa,
    imagen: imagen || null,
    colorFondo: colorFondo || '#1B4D3E',
    colorTexto: colorTexto || '#C6A962',
    estadisticas: {
      vistas: 0,
      clicks: 0,
      usos: 0,
      ventasGeneradas: 0
    }
  };

  // Guardar en KV
  await kv.set(`gi:promo:${id}`, promocion);

  // Agregar a lista de promociones
  await kv.lpush('gi:promos:lista', id);
  await kv.ltrim('gi:promos:lista', 0, 99); // Mantener últimas 100

  // Si está activa, agregar a activas
  if (activa) {
    await kv.sadd('gi:promos:activas', id);
  }

  return promocion;
}

/**
 * Obtener promociones activas
 */
export async function obtenerPromocionesActivas() {
  const ids = await kv.smembers('gi:promos:activas') || [];
  const promociones = [];

  for (const id of ids) {
    const promo = await kv.get(`gi:promo:${id}`);
    if (promo) {
      // Verificar si sigue vigente
      if (new Date(promo.fechaFin) > new Date()) {
        promociones.push(promo);
      } else {
        // Expiró, desactivar
        await desactivarPromocion(id);
      }
    }
  }

  return promociones;
}

/**
 * Obtener todas las promociones
 */
export async function obtenerTodasPromociones(limite = 50) {
  const ids = await kv.lrange('gi:promos:lista', 0, limite - 1) || [];
  const promociones = [];

  for (const id of ids) {
    const promo = await kv.get(`gi:promo:${id}`);
    if (promo) {
      promociones.push(promo);
    }
  }

  return promociones;
}

/**
 * Activar/desactivar promoción
 */
export async function togglePromocion(id, activa) {
  const promo = await kv.get(`gi:promo:${id}`);
  if (!promo) return null;

  promo.activa = activa;
  await kv.set(`gi:promo:${id}`, promo);

  if (activa) {
    await kv.sadd('gi:promos:activas', id);
  } else {
    await kv.srem('gi:promos:activas', id);
  }

  return promo;
}

/**
 * Desactivar promoción
 */
export async function desactivarPromocion(id) {
  return togglePromocion(id, false);
}

/**
 * Eliminar promoción
 */
export async function eliminarPromocion(id) {
  await kv.del(`gi:promo:${id}`);
  await kv.lrem('gi:promos:lista', 0, id);
  await kv.srem('gi:promos:activas', id);
  return true;
}

/**
 * Registrar estadística de promoción
 */
export async function registrarEstadisticaPromo(id, tipo) {
  const promo = await kv.get(`gi:promo:${id}`);
  if (!promo) return null;

  if (tipo === 'vista') promo.estadisticas.vistas++;
  if (tipo === 'click') promo.estadisticas.clicks++;
  if (tipo === 'uso') promo.estadisticas.usos++;
  if (tipo === 'venta') promo.estadisticas.ventasGeneradas++;

  await kv.set(`gi:promo:${id}`, promo);
  return promo;
}

// ═══════════════════════════════════════════════════════════════════════════
// BANNERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generar HTML del banner para una promoción
 */
export function generarHTMLBanner(promocion, estilo = 'horizontal') {
  const { titulo, descripcion, codigo, colorFondo, colorTexto, imagen, tipo } = promocion;
  const config = CONFIG_PROMOCIONES.tipos[tipo] || CONFIG_PROMOCIONES.tipos.descuento;

  if (estilo === 'horizontal') {
    return `
      <div style="background: ${colorFondo}; color: ${colorTexto}; padding: 20px 30px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; gap: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <div>
          <div style="font-size: 14px; opacity: 0.8; margin-bottom: 5px;">${config.icono} ${config.nombre}</div>
          <div style="font-size: 24px; font-weight: 700;">${titulo}</div>
          ${descripcion ? `<div style="font-size: 14px; margin-top: 8px; opacity: 0.9;">${descripcion}</div>` : ''}
        </div>
        ${codigo ? `
          <div style="background: rgba(255,255,255,0.15); padding: 15px 25px; border-radius: 8px; text-align: center;">
            <div style="font-size: 11px; opacity: 0.8;">CÓDIGO</div>
            <div style="font-size: 20px; font-weight: 700; letter-spacing: 2px;">${codigo}</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  if (estilo === 'cuadrado') {
    return `
      <div style="background: ${colorFondo}; color: ${colorTexto}; padding: 30px; border-radius: 16px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <div style="font-size: 40px; margin-bottom: 15px;">${config.icono}</div>
        <div style="font-size: 28px; font-weight: 700; margin-bottom: 10px;">${titulo}</div>
        ${descripcion ? `<div style="font-size: 14px; opacity: 0.9; margin-bottom: 20px;">${descripcion}</div>` : ''}
        ${codigo ? `
          <div style="background: rgba(255,255,255,0.15); padding: 15px 25px; border-radius: 8px; display: inline-block;">
            <div style="font-size: 11px; opacity: 0.8;">USA EL CÓDIGO</div>
            <div style="font-size: 24px; font-weight: 700; letter-spacing: 2px;">${codigo}</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Mini banner
  return `
    <div style="background: ${colorFondo}; color: ${colorTexto}; padding: 12px 20px; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <span>${config.icono}</span>
      <span style="font-weight: 600;">${titulo}</span>
      ${codigo ? `<span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 4px; font-size: 12px;">${codigo}</span>` : ''}
    </div>
  `;
}

/**
 * Obtener banner rotativo (para mostrar en la web)
 */
export async function obtenerBannerRotativo() {
  const activas = await obtenerPromocionesActivas();

  if (activas.length === 0) {
    return null;
  }

  // Rotación basada en hora actual
  const indice = Math.floor(Date.now() / (1000 * 60 * 60)) % activas.length;
  const promocion = activas[indice];

  // Registrar vista
  await registrarEstadisticaPromo(promocion.id, 'vista');

  return {
    promocion,
    html: {
      horizontal: generarHTMLBanner(promocion, 'horizontal'),
      cuadrado: generarHTMLBanner(promocion, 'cuadrado'),
      mini: generarHTMLBanner(promocion, 'mini')
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERACIÓN AUTOMÁTICA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generar título automático basado en datos
 */
function generarTituloAutomatico(datos) {
  const { tipo, porcentaje, categoria, temporada, fecha } = datos;
  const config = CONFIG_PROMOCIONES.tipos[tipo || 'descuento'];

  if (!config) return 'Promoción Especial';

  const plantilla = config.plantillas[Math.floor(Math.random() * config.plantillas.length)];

  return plantilla
    .replace('{porcentaje}', porcentaje || '15')
    .replace('{categoria}', categoria || 'guardianes')
    .replace('{temporada}', temporada || 'esta temporada')
    .replace('{fecha}', fecha || 'hoy')
    .replace('{monto}', datos.monto || '5000');
}

/**
 * Generar código de descuento único
 */
function generarCodigo() {
  const prefijos = ['DUENDE', 'MAGIA', 'GUARDIAN', 'BOSQUE'];
  const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)];
  const numero = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefijo}${numero}`;
}

/**
 * Calcular fecha de fin
 */
function calcularFechaFin(horas) {
  const fecha = new Date();
  fecha.setHours(fecha.getHours() + horas);
  return fecha.toISOString();
}

/**
 * Verificar si hay fecha especial próxima
 */
export function verificarFechaEspecialProxima(diasAntelacion = 7) {
  const hoy = new Date();
  const fechasProximas = [];

  for (const fecha of CONFIG_PROMOCIONES.fechasEspeciales) {
    const fechaEspecial = new Date(hoy.getFullYear(), fecha.mes - 1, fecha.dia);

    // Si ya pasó este año, verificar el próximo
    if (fechaEspecial < hoy) {
      fechaEspecial.setFullYear(fechaEspecial.getFullYear() + 1);
    }

    const diasRestantes = Math.ceil((fechaEspecial - hoy) / (1000 * 60 * 60 * 24));

    if (diasRestantes <= diasAntelacion && diasRestantes >= 0) {
      fechasProximas.push({
        ...fecha,
        diasRestantes,
        fecha: fechaEspecial.toISOString()
      });
    }
  }

  return fechasProximas;
}

/**
 * Generar promoción automática para fecha especial
 */
export async function generarPromocionFechaEspecial(fechaEspecial) {
  const promocion = await crearPromocion({
    tipo: 'fecha_especial',
    titulo: `¡Celebramos ${fechaEspecial.nombre}!`,
    descripcion: `Descuento especial por ${fechaEspecial.nombre}`,
    porcentaje: 15,
    fechaInicio: new Date().toISOString(),
    fechaFin: fechaEspecial.fecha,
    colorFondo: '#1B4D3E',
    colorTexto: '#C6A962'
  });

  return promocion;
}

/**
 * Generar texto de promoción con IA
 */
export async function generarTextoPromocionIA(datos) {
  const anthropic = new Anthropic();

  const prompt = `Generá un texto promocional corto y atractivo para Duendes del Uruguay.

DATOS DE LA PROMOCIÓN:
- Tipo: ${datos.tipo || 'descuento'}
- Porcentaje: ${datos.porcentaje || 'no especificado'}%
- Categoría: ${datos.categoria || 'general'}
- Ocasión: ${datos.ocasion || 'promoción regular'}

INSTRUCCIONES:
1. Usá español rioplatense (vos, tenés)
2. Máximo 2 oraciones
3. Tono mágico pero no cursi
4. Incluí el beneficio principal
5. Si hay código, mencionalo

Devolvé SOLO el texto, sin comillas ni explicaciones.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.content[0].text;
}

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL DE PROMOCIONES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generar HTML de email promocional
 */
export function generarEmailPromocion(promocion, productos = []) {
  const { titulo, descripcion, codigo, colorFondo, colorTexto, tipo } = promocion;
  const config = CONFIG_PROMOCIONES.tipos[tipo] || CONFIG_PROMOCIONES.tipos.descuento;

  let productosHTML = '';
  if (productos.length > 0) {
    productosHTML = `
      <div style="margin-top: 30px;">
        <h3 style="color: ${colorTexto}; margin-bottom: 20px;">Productos destacados</h3>
        <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
          ${productos.slice(0, 3).map(p => `
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; text-align: center; width: 150px;">
              ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">` : ''}
              <div style="font-weight: 600; color: ${colorTexto};">${p.nombre}</div>
              <div style="color: rgba(255,255,255,0.7); font-size: 14px;">$${p.precio}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://duendesdeluruguay.com/wp-content/uploads/2024/duendes-logo.png" alt="Duendes del Uruguay" style="max-width: 150px;">
        </div>

        <!-- Banner Principal -->
        <div style="background: ${colorFondo}; color: ${colorTexto}; padding: 40px; border-radius: 20px; text-align: center;">
          <div style="font-size: 50px; margin-bottom: 20px;">${config.icono}</div>
          <h1 style="margin: 0 0 15px 0; font-size: 32px;">${titulo}</h1>
          ${descripcion ? `<p style="margin: 0 0 25px 0; font-size: 16px; opacity: 0.9;">${descripcion}</p>` : ''}

          ${codigo ? `
            <div style="background: rgba(255,255,255,0.15); padding: 20px 40px; border-radius: 10px; display: inline-block; margin-top: 10px;">
              <div style="font-size: 12px; opacity: 0.8; margin-bottom: 5px;">USA EL CÓDIGO</div>
              <div style="font-size: 28px; font-weight: 700; letter-spacing: 3px;">${codigo}</div>
            </div>
          ` : ''}
        </div>

        ${productosHTML}

        <!-- CTA -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://duendesdeluruguay.com/tienda" style="display: inline-block; background: ${colorTexto}; color: ${colorFondo}; padding: 18px 40px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px;">
            Ver Tienda
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1);">
          <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">
            Duendes del Uruguay<br>
            Artesanías mágicas hechas con amor
          </p>
          <div style="margin-top: 15px;">
            <a href="https://instagram.com/duendesdeluruguay" style="color: rgba(255,255,255,0.5); text-decoration: none; margin: 0 10px;">Instagram</a>
            <a href="https://duendesdeluruguay.com" style="color: rgba(255,255,255,0.5); text-decoration: none; margin: 0 10px;">Web</a>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;
}

// Exportaciones
export {
  CONFIG_PROMOCIONES
};
