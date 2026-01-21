/**
 * GUARDIAN INTELLIGENCE - SISTEMA DE CROSS-SELLING
 * "Las papas con el combo" - Aumentar ticket promedio
 */

import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG_CROSS_SELLING = {
  // Reglas de compatibilidad por categoría
  compatibilidad: {
    proteccion: ['proteccion', 'sanacion', 'sabiduria'],
    abundancia: ['abundancia', 'proteccion', 'amor'],
    amor: ['amor', 'sanacion', 'abundancia'],
    sanacion: ['sanacion', 'proteccion', 'amor'],
    sabiduria: ['sabiduria', 'proteccion', 'sanacion']
  },

  // Complementos recomendados por tipo de producto
  complementos: {
    duende: ['kit_bienvenida', 'altar_mini', 'vela'],
    bruja: ['kit_hierbas', 'caldero_mini', 'vela'],
    hada: ['cristales', 'luz_led', 'altar_mini'],
    elfo: ['cristales', 'kit_bienvenida', 'vela'],
    gnomo: ['maceta', 'tierra_magica', 'kit_bienvenida']
  },

  // Rangos de precio para sugerencias (en UYU)
  rangosPrecios: {
    economico: { min: 0, max: 3000 },
    medio: { min: 3000, max: 6000 },
    premium: { min: 6000, max: 12000 },
    exclusivo: { min: 12000, max: Infinity }
  },

  // Porcentaje máximo de aumento del carrito sugerido
  maxAumentoCarrito: 50, // No sugerir más del 50% del valor actual

  // Cantidad de productos a sugerir
  cantidadSugerencias: 3,

  // Mensajes de cross-selling
  mensajes: {
    complemento: [
      'Este guardián trabaja muy bien junto a...',
      'Para potenciar su magia, te recomendamos...',
      'Completá la experiencia con...'
    ],
    combo: [
      'Llevá estos dos y el tercero tiene descuento',
      'Combinación perfecta para tu altar',
      'Estos guardianes se complementan'
    ],
    upgrade: [
      '¿Querés conocer la versión premium?',
      'Mirá este guardián con más poder',
      'Upgrade disponible'
    ],
    relacionado: [
      'Otros guardianes que podrían interesarte',
      'Los clientes también vieron',
      'Te puede gustar'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES PRINCIPALES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtener sugerencias de cross-selling para un producto
 */
export async function obtenerSugerencias(producto, catalogoCompleto, opciones = {}) {
  const {
    limite = CONFIG_CROSS_SELLING.cantidadSugerencias,
    incluirComplementos = true,
    incluirRelacionados = true,
    incluirUpgrade = false,
    precioMaximo = null
  } = opciones;

  const sugerencias = {
    complementos: [],
    relacionados: [],
    upgrade: null,
    combo: null
  };

  if (!producto || !catalogoCompleto || catalogoCompleto.length === 0) {
    return sugerencias;
  }

  // Extraer datos del producto
  const {
    id,
    categoria = 'proteccion',
    tipo = 'duende',
    precio = 0
  } = producto;

  // Filtrar productos disponibles (excluir el actual)
  const productosDisponibles = catalogoCompleto.filter(p => p.id !== id);

  // 1. Buscar complementos por categoría compatible
  if (incluirComplementos) {
    const categoriasCompatibles = CONFIG_CROSS_SELLING.compatibilidad[categoria] || [categoria];

    const complementos = productosDisponibles
      .filter(p => {
        const catProducto = p.categoria || 'proteccion';
        const esCompatible = categoriasCompatibles.includes(catProducto);
        const enRangoPrecio = precioMaximo ? p.precio <= precioMaximo : true;
        return esCompatible && enRangoPrecio;
      })
      .sort((a, b) => calcularPuntajeComplemento(producto, a) - calcularPuntajeComplemento(producto, b))
      .slice(0, limite);

    sugerencias.complementos = complementos.map(p => ({
      ...p,
      razon: 'complemento',
      mensaje: seleccionarMensaje('complemento')
    }));
  }

  // 2. Buscar productos relacionados (misma categoría, diferente tipo)
  if (incluirRelacionados) {
    const relacionados = productosDisponibles
      .filter(p => {
        const mismaCat = (p.categoria || 'proteccion') === categoria;
        const diferenteTipo = (p.tipo || 'duende') !== tipo;
        const enRangoPrecio = precioMaximo ? p.precio <= precioMaximo : true;
        return mismaCat && diferenteTipo && enRangoPrecio;
      })
      .sort((a, b) => Math.abs(a.precio - precio) - Math.abs(b.precio - precio))
      .slice(0, limite);

    sugerencias.relacionados = relacionados.map(p => ({
      ...p,
      razon: 'relacionado',
      mensaje: seleccionarMensaje('relacionado')
    }));
  }

  // 3. Buscar upgrade (mismo tipo, precio mayor)
  if (incluirUpgrade) {
    const upgrade = productosDisponibles
      .find(p => {
        const mismoTipo = (p.tipo || 'duende') === tipo;
        const mismaCat = (p.categoria || 'proteccion') === categoria;
        const precioMayor = p.precio > precio * 1.2; // Al menos 20% más caro
        const precioRazonable = p.precio <= precio * 2; // Máximo el doble
        return mismoTipo && mismaCat && precioMayor && precioRazonable;
      });

    if (upgrade) {
      sugerencias.upgrade = {
        ...upgrade,
        razon: 'upgrade',
        mensaje: seleccionarMensaje('upgrade'),
        diferenciaPrecio: upgrade.precio - precio
      };
    }
  }

  return sugerencias;
}

/**
 * Obtener sugerencias para el carrito completo
 */
export async function obtenerSugerenciasCarrito(carrito, catalogoCompleto, opciones = {}) {
  const {
    maxAumento = CONFIG_CROSS_SELLING.maxAumentoCarrito,
    limite = 4
  } = opciones;

  if (!carrito || carrito.length === 0) {
    return {
      sugerencias: [],
      mensaje: 'Agregá productos al carrito para ver sugerencias'
    };
  }

  // Calcular valor total del carrito
  const valorCarrito = carrito.reduce((sum, item) => sum + (item.precio || 0) * (item.cantidad || 1), 0);

  // Precio máximo de sugerencias basado en % del carrito
  const precioMaximo = valorCarrito * (maxAumento / 100);

  // Extraer categorías y tipos del carrito
  const categoriasEnCarrito = [...new Set(carrito.map(p => p.categoria || 'proteccion'))];
  const tiposEnCarrito = [...new Set(carrito.map(p => p.tipo || 'duende'))];
  const idsEnCarrito = carrito.map(p => p.id);

  // Encontrar categorías complementarias que NO estén en el carrito
  let categoriasComplementarias = new Set();
  categoriasEnCarrito.forEach(cat => {
    const compatibles = CONFIG_CROSS_SELLING.compatibilidad[cat] || [];
    compatibles.forEach(c => {
      if (!categoriasEnCarrito.includes(c)) {
        categoriasComplementarias.add(c);
      }
    });
  });

  // Buscar productos complementarios
  const productosDisponibles = catalogoCompleto.filter(p =>
    !idsEnCarrito.includes(p.id) && p.precio <= precioMaximo
  );

  const sugerencias = productosDisponibles
    .map(p => {
      let puntaje = 0;

      // Bonus si es de categoría complementaria
      if (categoriasComplementarias.has(p.categoria)) {
        puntaje += 30;
      }

      // Bonus si es de tipo diferente
      if (!tiposEnCarrito.includes(p.tipo)) {
        puntaje += 20;
      }

      // Bonus por precio adecuado (ni muy barato ni muy caro)
      const precioPerfecto = valorCarrito * 0.25; // 25% del carrito
      const diferenciaPrecio = Math.abs(p.precio - precioPerfecto);
      puntaje += Math.max(0, 20 - (diferenciaPrecio / precioPerfecto) * 20);

      return { ...p, puntaje };
    })
    .sort((a, b) => b.puntaje - a.puntaje)
    .slice(0, limite)
    .map(p => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      imagen: p.imagen,
      categoria: p.categoria,
      tipo: p.tipo,
      razon: determinarRazon(p, categoriasEnCarrito, categoriasComplementarias),
      mensaje: seleccionarMensaje('relacionado')
    }));

  // Verificar si hay combo disponible
  let combo = null;
  if (carrito.length >= 2) {
    combo = {
      activo: true,
      mensaje: 'Agregá uno más y llevá 3x2',
      descuento: '33%'
    };
  }

  return {
    sugerencias,
    combo,
    valorCarrito,
    presupuestoSugerido: precioMaximo,
    mensaje: sugerencias.length > 0
      ? seleccionarMensaje('complemento')
      : 'Tu selección es perfecta'
  };
}

/**
 * Registrar interacción de cross-selling (para aprendizaje)
 */
export async function registrarInteraccion(datos) {
  const {
    productoOrigen,
    productoSugerido,
    tipo, // 'vista', 'click', 'compra'
    valorCompra
  } = datos;

  const interaccion = {
    fecha: new Date().toISOString(),
    origen: productoOrigen,
    sugerido: productoSugerido,
    tipo,
    valorCompra: valorCompra || null
  };

  // Guardar en historial
  await kv.lpush('gi:cross-selling:interacciones', interaccion);
  await kv.ltrim('gi:cross-selling:interacciones', 0, 999); // Últimas 1000

  // Si fue compra, actualizar estadísticas de combinación
  if (tipo === 'compra') {
    const claveCombo = `gi:cross-selling:combo:${productoOrigen}:${productoSugerido}`;
    await kv.incr(claveCombo);
  }

  return interaccion;
}

/**
 * Obtener combinaciones más exitosas
 */
export async function obtenerCombinacionesExitosas(limite = 10) {
  // Obtener interacciones de compra
  const interacciones = await kv.lrange('gi:cross-selling:interacciones', 0, 999) || [];

  // Contar combinaciones
  const combos = {};
  interacciones
    .filter(i => i.tipo === 'compra')
    .forEach(i => {
      const key = `${i.origen}-${i.sugerido}`;
      combos[key] = (combos[key] || 0) + 1;
    });

  // Ordenar por frecuencia
  const ordenados = Object.entries(combos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite)
    .map(([key, count]) => {
      const [origen, sugerido] = key.split('-');
      return { productoOrigen: origen, productoSugerido: sugerido, compras: count };
    });

  return ordenados;
}

/**
 * Obtener estadísticas de cross-selling
 */
export async function obtenerEstadisticas() {
  const interacciones = await kv.lrange('gi:cross-selling:interacciones', 0, 999) || [];

  const stats = {
    totalInteracciones: interacciones.length,
    vistas: interacciones.filter(i => i.tipo === 'vista').length,
    clicks: interacciones.filter(i => i.tipo === 'click').length,
    compras: interacciones.filter(i => i.tipo === 'compra').length,
    valorGenerado: interacciones
      .filter(i => i.tipo === 'compra' && i.valorCompra)
      .reduce((sum, i) => sum + i.valorCompra, 0),
    tasaConversion: 0
  };

  if (stats.clicks > 0) {
    stats.tasaConversion = ((stats.compras / stats.clicks) * 100).toFixed(1);
  }

  return stats;
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calcular puntaje de complemento entre dos productos
 */
function calcularPuntajeComplemento(productoBase, productoCandidato) {
  let puntaje = 0;

  // Diferente tipo es mejor (más variedad)
  if (productoBase.tipo !== productoCandidato.tipo) {
    puntaje += 20;
  }

  // Similar precio es mejor
  const diferenciaPrecio = Math.abs((productoBase.precio || 0) - (productoCandidato.precio || 0));
  const precioBase = productoBase.precio || 1;
  const porcentajeDiferencia = diferenciaPrecio / precioBase;

  if (porcentajeDiferencia < 0.3) puntaje += 15;
  else if (porcentajeDiferencia < 0.5) puntaje += 10;
  else if (porcentajeDiferencia < 1) puntaje += 5;

  return 100 - puntaje; // Menor puntaje = mejor match
}

/**
 * Seleccionar mensaje aleatorio
 */
function seleccionarMensaje(tipo) {
  const mensajes = CONFIG_CROSS_SELLING.mensajes[tipo] || CONFIG_CROSS_SELLING.mensajes.relacionado;
  return mensajes[Math.floor(Math.random() * mensajes.length)];
}

/**
 * Determinar razón de la sugerencia
 */
function determinarRazon(producto, categoriasCarrito, categoriasComplementarias) {
  if (categoriasComplementarias.has(producto.categoria)) {
    return 'complemento';
  }
  if (categoriasCarrito.includes(producto.categoria)) {
    return 'relacionado';
  }
  return 'descubrimiento';
}

// ═══════════════════════════════════════════════════════════════════════════
// WIDGET DE CROSS-SELLING (HTML)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generar HTML del widget de cross-selling
 */
export function generarWidgetHTML(sugerencias, estilo = 'horizontal') {
  if (!sugerencias || sugerencias.length === 0) {
    return '';
  }

  const colores = {
    fondo: '#0f0f0f',
    card: 'rgba(255,255,255,0.05)',
    texto: '#e6edf3',
    acento: '#C6A962',
    borde: 'rgba(198,169,98,0.2)'
  };

  if (estilo === 'horizontal') {
    return `
      <div style="background: ${colores.fondo}; padding: 25px; border-radius: 16px; border: 1px solid ${colores.borde};">
        <h3 style="color: ${colores.acento}; margin: 0 0 20px 0; font-size: 16px;">
          ${sugerencias[0]?.mensaje || 'Te puede interesar'}
        </h3>
        <div style="display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px;">
          ${sugerencias.map(p => `
            <a href="/producto/${p.id}" style="text-decoration: none; flex-shrink: 0; width: 150px;">
              <div style="background: ${colores.card}; border-radius: 12px; overflow: hidden; border: 1px solid ${colores.borde}; transition: transform 0.2s;">
                ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" style="width: 100%; height: 120px; object-fit: cover;">` : ''}
                <div style="padding: 12px;">
                  <div style="color: ${colores.texto}; font-size: 13px; font-weight: 600; margin-bottom: 5px;">${p.nombre}</div>
                  <div style="color: ${colores.acento}; font-weight: 700;">$${p.precio?.toLocaleString() || '0'}</div>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Estilo vertical
  return `
    <div style="background: ${colores.fondo}; padding: 20px; border-radius: 12px; border: 1px solid ${colores.borde};">
      <h3 style="color: ${colores.acento}; margin: 0 0 15px 0; font-size: 14px;">
        ${sugerencias[0]?.mensaje || 'Te puede interesar'}
      </h3>
      ${sugerencias.map(p => `
        <a href="/producto/${p.id}" style="text-decoration: none; display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
          ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">` : ''}
          <div style="flex: 1;">
            <div style="color: ${colores.texto}; font-size: 13px;">${p.nombre}</div>
            <div style="color: ${colores.acento}; font-size: 14px; font-weight: 600;">$${p.precio?.toLocaleString() || '0'}</div>
          </div>
        </a>
      `).join('')}
    </div>
  `;
}

// Exportaciones
export {
  CONFIG_CROSS_SELLING
};
