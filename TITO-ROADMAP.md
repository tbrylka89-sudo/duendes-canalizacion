# TITO 4.0 - ROADMAP DE EVOLUCIÓN

**Última actualización:** 25/01/2026

---

## VISIÓN

Transformar a Tito de un chatbot básico a un **vendedor experto con consciencia total** del entorno, el cliente y el negocio. Un ser digital que:

- Tiene conocimiento profundo de cada guardián (historia, dones, sincrodestinos)
- Sabe exactamente qué producto está mirando el cliente
- Conoce el inventario en tiempo real
- Domina técnicas de neuroventas y persuasión
- Detecta intención de compra vs "pichis" con precisión
- Se integra completamente con WordPress/WooCommerce

---

## DIAGNÓSTICO ACTUAL (25/01/2026)

### Problemas Críticos Identificados

| # | Problema | Impacto | Estado |
|---|----------|---------|--------|
| 1 | **Contexto del producto NO se usa** | Tito no sabe qué guardián está mirando el cliente | 🔴 CRÍTICO |
| 2 | **Descripción truncada a 500 chars** | No puede contar la historia completa | 🔴 CRÍTICO |
| 3 | **No usa meta_data custom** | Falta sincrodestino, dones, historia completa | 🔴 CRÍTICO |
| 4 | **Inventario con 5 min de delay** | Puede recomendar guardianes agotados | 🟡 MEDIO |
| 5 | **Manual de persuasión no integrado** | 46KB de técnicas sin usar | 🟡 MEDIO |
| 6 | **Sin sistema de upsell/cross-sell** | Pierde ventas adicionales | 🟡 MEDIO |

### Dónde se pierde el contexto del producto

```
Widget WordPress          →  Backend Tito v3          →  Claude
─────────────────────────────────────────────────────────────────
obtenerProductoActual()   →  body.contexto            →  system prompt
      ↓                         ↓                           ↓
   ✅ DETECTA              ❌ NO SE EXTRAE           ❌ NO SE INCLUYE
   nombre, precio,         "contexto" no está        Claude no sabe
   imagen, URL             en desestructuración      qué producto ve
```

**Archivo problemático:** `app/api/tito/v3/route.js` líneas 384-398

---

## FASE 1: CONSCIENCIA DEL CONTEXTO
**Prioridad:** CRÍTICA | **Estimación:** 1-2 días

### 1.1 Extraer contexto del producto en route.js

**Archivo:** `app/api/tito/v3/route.js`

```javascript
// Línea ~395: Agregar a desestructuración
const {
  mensaje, message, nombre, first_name, subscriber_id,
  canal = 'web', historial = [], history,
  esAdmin = false, usuario = null, pais_cliente = null,
  contexto = null  // ← AGREGAR ESTO
} = body;
```

### 1.2 Incluir producto actual en system prompt

**Archivo:** `app/api/tito/v3/route.js`

```javascript
// Después de línea ~494, agregar:
if (contexto?.producto) {
  contextoCliente += `\n📍 PRODUCTO QUE ESTÁ VIENDO AHORA:\n`;
  contextoCliente += `- Guardián: ${contexto.producto.nombre}\n`;
  contextoCliente += `- Precio: ${contexto.producto.precio}\n`;
  contextoCliente += `- URL: ${contexto.producto.url}\n`;
  contextoCliente += `\n⚡ INSTRUCCIÓN: Este cliente está MIRANDO este guardián. `;
  contextoCliente += `Cuando pregunte "contame más" o similar, HABLÁ DE ESTE GUARDIÁN.\n`;
  contextoCliente += `NO preguntes "¿cuál te interesa?" - YA SABÉS CUÁL.\n`;
}

if (contexto?.pagina) {
  contextoCliente += `\n🌐 Página actual: ${contexto.pagina}\n`;
  if (contexto.pagina === 'carrito' && contexto.carrito > 0) {
    contextoCliente += `🛒 TIENE ${contexto.carrito} PRODUCTOS EN CARRITO - ¡EMPUJÁ A CERRAR!\n`;
  }
}
```

### 1.3 Mejorar detección en widget WordPress

**Archivo:** `wordpress-plugins/duendes-tito-widget.php`

```javascript
function obtenerProductoActual() {
  if (estado.paginaActual !== 'producto') return null;

  // Selectores mejorados para Elementor y WooCommerce
  const titulo = document.querySelector(
    '.product_title, .entry-title, h1.elementor-heading-title, ' +
    '.woocommerce-loop-product__title'
  );

  // Obtener ID del producto si está disponible
  const productId = document.body.classList.toString().match(/postid-(\d+)/)?.[1];

  // Obtener categoría
  const categoria = document.querySelector('.posted_in a, .product_meta .posted_in a');

  if (titulo) {
    return {
      id: productId,
      nombre: titulo.textContent.trim(),
      precio: document.querySelector('.price .amount')?.textContent,
      imagen: document.querySelector('.woocommerce-product-gallery__image img')?.src,
      url: window.location.href,
      categoria: categoria?.textContent.trim()
    };
  }
  return null;
}
```

### Verificación Fase 1

- [ ] Abrir página de producto, escribir "hola" → Tito menciona el guardián
- [ ] Preguntar "contame más" → Tito habla del guardián visible, no pregunta cuál
- [ ] En consola: ver que `body.contexto.producto` llega al backend
- [ ] En logs: ver que system prompt incluye "PRODUCTO QUE ESTÁ VIENDO"

---

## FASE 2: CONOCIMIENTO COMPLETO DE GUARDIANES
**Prioridad:** CRÍTICA | **Estimación:** 2-3 días

### 2.1 No truncar descripción

**Archivo:** `lib/tito/conocimiento.js` línea ~76

```javascript
// ANTES (truncado):
descripcion: p.description?.replace(/<[^>]*>/g, '').substring(0, 500)

// DESPUÉS (completo):
descripcion: p.description?.replace(/<[^>]*>/g, '')
```

### 2.2 Obtener meta_data custom de WooCommerce

**Archivo:** `lib/tito/conocimiento.js`

```javascript
// En la función obtenerProductosWoo(), agregar al mapeo:
return {
  // ... campos existentes ...

  // Meta datos custom del guardián
  historia_completa: p.meta_data?.find(m => m.key === '_duendes_historia')?.value,
  sincrodestino: p.meta_data?.find(m => m.key === '_duendes_sincrodestino')?.value,
  dones: p.meta_data?.find(m => m.key === '_duendes_dones')?.value,
  elemento: p.meta_data?.find(m => m.key === '_duendes_elemento')?.value,
  propositos: p.meta_data?.find(m => m.key === '_duendes_propositos')?.value,
  personalidad: p.meta_data?.find(m => m.key === '_duendes_personalidad')?.value,
};
```

### 2.3 Crear tool para obtener guardián completo

**Archivo:** `lib/tito/tools.js`

```javascript
{
  name: "obtener_guardian_completo",
  description: "Obtener toda la información de un guardián específico: historia completa, dones, sincrodestino, personalidad. Usar cuando el cliente quiere saber más sobre un guardián.",
  input_schema: {
    type: "object",
    properties: {
      identificador: {
        type: "string",
        description: "Nombre o ID del guardián"
      }
    },
    required: ["identificador"]
  }
}
```

**Archivo:** `lib/tito/tool-executor.js`

```javascript
case 'obtener_guardian_completo':
  return await obtenerGuardianCompleto(input);

// Nueva función:
async function obtenerGuardianCompleto({ identificador }) {
  const productos = await obtenerProductosWoo();
  const guardian = productos.find(p =>
    p.nombre.toLowerCase().includes(identificador.toLowerCase()) ||
    p.id.toString() === identificador
  );

  if (!guardian) {
    return { success: false, mensaje: `No encontré un guardián llamado "${identificador}"` };
  }

  return {
    success: true,
    guardian: {
      nombre: guardian.nombre,
      precio_usd: guardian.precio,
      precio_uyu: guardian.precioUYU,
      historia: guardian.historia_completa || guardian.descripcion,
      sincrodestino: guardian.sincrodestino,
      dones: guardian.dones,
      elemento: guardian.elemento,
      propositos: guardian.propositos,
      personalidad: guardian.personalidad,
      categoria: guardian.categorias?.join(', '),
      imagen: guardian.imagen,
      url: guardian.url,
      disponible: guardian.disponible
    }
  };
}
```

### 2.4 Agregar meta fields en WordPress

Verificar/crear estos meta fields en WooCommerce para cada producto:
- `_duendes_historia` - Historia completa del guardián
- `_duendes_sincrodestino` - Evento mágico durante creación
- `_duendes_dones` - Capacidades especiales
- `_duendes_elemento` - Tierra, Agua, Fuego, Aire
- `_duendes_propositos` - Array de propósitos (protección, abundancia, etc)
- `_duendes_personalidad` - Cómo es su forma de ser

### Verificación Fase 2

- [ ] `obtenerProductosWoo()` retorna historia completa (no truncada)
- [ ] Meta fields custom aparecen en respuesta de API
- [ ] Tool `obtener_guardian_completo` funciona
- [ ] Tito puede contar historia completa cuando se le pide

---

## FASE 3: INVENTARIO EN TIEMPO REAL
**Prioridad:** ALTA | **Estimación:** 1 día

### 3.1 Tool para verificar stock

**Archivo:** `lib/tito/tools.js`

```javascript
{
  name: "verificar_stock",
  description: "Verificar si un guardián específico está disponible AHORA MISMO. Usar antes de confirmar disponibilidad.",
  input_schema: {
    type: "object",
    properties: {
      producto_id: { type: "number", description: "ID del producto" }
    },
    required: ["producto_id"]
  }
}
```

### 3.2 Implementar verificación directa

**Archivo:** `lib/tito/tool-executor.js`

```javascript
async function verificarStock({ producto_id }) {
  try {
    const url = `${WP_URL}/wp-json/wc/v3/products/${producto_id}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Basic ${getWooAuth()}` }
    });
    const producto = await response.json();

    return {
      success: true,
      disponible: producto.stock_status === 'instock',
      cantidad: producto.stock_quantity,
      nombre: producto.name
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### 3.3 Instrucción para usar verificación

Agregar a `personalidad.js`:
```
ANTES de confirmar que un guardián está disponible, USA la tool verificar_stock.
Si el guardián ya fue adoptado, decí: "Ese guardián ya encontró su hogar, pero tengo otros que podrían resonar contigo..."
```

### Verificación Fase 3

- [ ] Tool `verificar_stock` consulta WooCommerce en vivo
- [ ] Si producto está agotado, Tito lo indica
- [ ] No recomienda productos sin stock

---

## FASE 4: INTEGRACIÓN PROFUNDA CON WORDPRESS
**Prioridad:** ALTA | **Estimación:** 2-3 días

### 4.1 Webhooks de WooCommerce

Crear endpoint para recibir webhooks cuando:
- Producto se agota
- Nuevo pedido creado
- Pedido completado
- Producto actualizado

**Archivo nuevo:** `app/api/webhooks/woocommerce/route.js`

### 4.2 Sincronización de estados de pedido

Mejorar `buscar_pedido` para incluir:
- Tracking de DHL/DAC
- Fecha estimada de entrega
- Link de seguimiento

### 4.3 Burbujas inteligentes contextuales

**Archivo:** `wordpress-plugins/duendes-tito-widget.php`

Burbujas según contexto:
- En producto: "¿Querés saber más de [nombre]?"
- En carrito: "¿Te ayudo a completar tu adopción?"
- En checkout: "¿Alguna duda sobre el proceso?"
- Post-compra: "¡Felicidades! ¿Completaste tu formulario de canalización?"

### Verificación Fase 4

- [ ] Webhook recibe eventos de WooCommerce
- [ ] Caché se actualiza instantáneamente
- [ ] Burbujas aparecen según página
- [ ] Tracking de pedidos funciona

---

## FASE 5: NEUROVENTAS Y PERSUASIÓN AVANZADA
**Prioridad:** MEDIA | **Estimación:** 2-3 días

### 5.1 Integrar manual de persuasión

**Archivo:** `lib/tito/personalidad.js`

Agregar sección con técnicas específicas:
- Mirroring (reflejar lenguaje del cliente)
- Labeling (etiquetar emociones)
- Escasez genuina ("Este guardián es pieza única")
- Prueba social ("Ya encontró hogar con 47 personas")
- Reciprocidad (dar valor antes de pedir)

### 5.2 Sistema de detección de objeciones

**Archivo nuevo:** `lib/tito/objeciones.js`

```javascript
const OBJECIONES = {
  precio: {
    detectores: ['caro', 'mucha plata', 'no me alcanza', 'precio'],
    respuestas: [
      "Entiendo. ¿Sabías que podés reservar con seña del 30%?",
      "¿Caro comparado con qué? Este guardián te acompaña toda la vida.",
      "Hay guardianes desde $70 USD. ¿Querés que te muestre opciones?"
    ]
  },
  tiempo: {
    detectores: ['después', 'más adelante', 'lo pienso', 'no sé'],
    respuestas: [
      "Dale, sin presión. Pero este guardián es pieza única...",
      "Entiendo. ¿Qué te haría sentir más segura/o para decidir?"
    ]
  },
  // ... más objeciones
};
```

### 5.3 Scoring de intención de compra mejorado

Mejorar `analizarCliente()` para detectar:
- Micro-señales de compra (preguntas de precio, envío, pago)
- Micro-señales de abandono (respuestas cortas, cambios de tema)
- Momento óptimo para cierre

### Verificación Fase 5

- [ ] Tito usa técnicas de persuasión naturalmente
- [ ] Detecta y maneja objeciones
- [ ] Scoring de intención es más preciso

---

## FASE 6: SISTEMA DE RECOMENDACIÓN INTELIGENTE
**Prioridad:** MEDIA | **Estimación:** 3-5 días

### 6.1 Matching guardián-cliente

Crear sistema que analice:
- Respuestas del cliente en conversación
- Necesidades expresadas
- Estilo de comunicación
- Momento de vida

Y recomiende guardianes con score de compatibilidad.

### 6.2 Cross-sell y upsell

- Después de elegir un guardián: "¿Sabías que [guardián] y [otro] se potencian juntos?"
- Pack de 3x2 promocional
- Complementarios por categoría

### 6.3 Personalización por historial

Si es cliente repetido:
- Recordar guardianes anteriores
- Sugerir complementarios a los que ya tiene
- Tono más familiar

### Verificación Fase 6

- [ ] Recomendaciones son relevantes al perfil
- [ ] Cross-sell aparece en momento oportuno
- [ ] Clientes repetidos reciben trato especial

---

## MÉTRICAS DE ÉXITO

| Métrica | Actual | Objetivo |
|---------|--------|----------|
| Conversión chat → compra | ~2% | 8-10% |
| Tiempo promedio de conversación | 8 min | 4 min |
| Tasa de "pichis" | ~40% | <20% |
| Satisfacción (NPS) | ? | >8 |
| Guardianes agotados recomendados | ~5% | 0% |

---

## CHANGELOG

### 25/01/2026
- Documento creado
- Diagnóstico inicial completado
- Identificados 6 problemas críticos
- Planificadas 6 fases de desarrollo
- Prioridad inmediata: Fase 1 (contexto del producto)

---

## NOTAS TÉCNICAS

### Archivos clave del sistema Tito

| Archivo | Función | Tamaño |
|---------|---------|--------|
| `app/api/tito/v3/route.js` | Orquestador principal | 28KB |
| `lib/tito/personalidad.js` | Personalidad y reglas | 19KB |
| `lib/tito/tools.js` | Definición de herramientas | 13KB |
| `lib/tito/tool-executor.js` | Ejecutor de tools | 30KB |
| `lib/tito/conocimiento.js` | Base de datos/WooCommerce | 36KB |
| `lib/tito/cotizaciones.js` | Conversión de monedas | 5KB |
| `lib/tito/manual-persuasion.js` | Técnicas (sin usar) | 46KB |
| `wordpress-plugins/duendes-tito-widget.php` | Widget frontend | 45KB |

### Endpoints

| Endpoint | Función |
|----------|---------|
| `/api/tito/v3` | Chat principal |
| `/api/tito/chat` | Chat alternativo (mejor contexto) |
| `/api/tito/woo` | Consultas WooCommerce |
| `/api/divisas` | Cotizaciones de monedas |
| `/api/cotizaciones` | Alias de divisas |

### Credenciales y accesos

Ver `CLAUDE.md` sección "Información Técnica del Sitio"
