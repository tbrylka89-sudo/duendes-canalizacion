# TITO V3 - Documentación Técnica Completa

## Resumen Ejecutivo

Tito es un chatbot de ventas para "Duendes del Uruguay" que se hace pasar por un duende real. Usa Claude Haiku con herramientas nativas para responder consultas sobre guardianes (figuras artesanales mágicas).

---

## Arquitectura General

```
Usuario → ManyChat/Widget Web
              ↓
         /api/tito/v3 (route.js)
              ↓
    ┌─────────────────────────┐
    │   PRE-FILTRO (40-60%)   │  ← Respuestas sin llamar a Claude
    │   - Saludos simples     │
    │   - País detectado      │
    │   - Intenciones claras  │
    └─────────────────────────┘
              ↓ (si no matchea)
    ┌─────────────────────────┐
    │     CLAUDE HAIKU        │
    │   + 17 Tools nativas    │
    │   + Personalidad Tito   │
    └─────────────────────────┘
              ↓
         Respuesta JSON
```

---

## Endpoints

### Principal: `/api/tito/v3`

**POST** - Endpoint principal para conversaciones

```javascript
// Request
{
  "mensaje": "hola quiero ver guardianes",
  "session_id": "abc123",           // Opcional, genera uno si no viene
  "nombre": "María",                // Opcional
  "subscriber_id": "manychat_123",  // Para ManyChat
  "canal": "whatsapp"               // web | whatsapp | instagram
}

// Response
{
  "respuesta": "¡Ey María! 🍀 Te muestro algunos guardianes...",
  "respuesta_tito": "¡Ey María! 🍀 Te muestro...",  // Campo plano para ManyChat
  "session_id": "abc123",
  "productos": [...],               // Si mostró productos
  "imagenes": ["url1", "url2"],     // URLs de imágenes
  "debug": {...}                    // Solo en desarrollo
}
```

### Otros Endpoints

| Endpoint | Método | Uso |
|----------|--------|-----|
| `/api/tito/test` | GET/POST | Verificar que la API funciona |
| `/api/whatsapp/bienvenida` | POST | Menú de bienvenida WhatsApp |
| `/api/whatsapp/test` | POST | Debug de ManyChat |
| `/api/cotizaciones` | GET | Ver cotizaciones actuales |
| `/api/cotizaciones` | POST | Forzar actualización |

---

## Sistema de Herramientas (Tools)

Tito tiene **17 herramientas** definidas en `/lib/tito/tools.js`:

### Tools de Cliente

| Tool | Descripción | Parámetros |
|------|-------------|------------|
| `mostrar_productos` | Lista guardianes con filtros | `categoria`, `tipo`, `precio_max`, `limite` |
| `buscar_producto` | Busca por nombre específico | `nombre` |
| `recomendar_guardian` | Recomienda según necesidad | `necesidad`, `presupuesto` |
| `calcular_precio` | Precio en moneda local | `producto_id`, `pais` |
| `obtener_detalles_producto` | Info completa de un guardián | `producto_id` |
| `agregar_al_carrito` | Genera link de carrito | `producto_id`, `cantidad` |
| `buscar_pedido` | Estado de orden | `email` o `numero_pedido` |
| `ver_categorias` | Lista categorías disponibles | - |
| `buscar_por_cristal` | Guardianes con cristal específico | `cristal` |
| `obtener_faq` | Respuestas a preguntas frecuentes | `tema` |
| `escalar_a_humano` | Deriva a humano | `motivo`, `email` |
| `guardar_nota` | Guarda nota del cliente | `nota`, `email` |

### Tools de Admin

| Tool | Descripción |
|------|-------------|
| `admin_buscar_cliente` | Busca cliente por email |
| `admin_ver_pedidos` | Lista pedidos recientes |
| `admin_dar_regalo` | Registra regalo/descuento |
| `admin_ver_metricas` | Métricas de ventas |
| `admin_actualizar_stock` | Modifica stock |

---

## Ejecución de Tools

Las tools se ejecutan en `/lib/tito/tool-executor.js`:

```javascript
// Ejemplo de ejecución
const resultado = await ejecutarTool('mostrar_productos', {
  categoria: 'proteccion',
  limite: 3
});

// Retorna
{
  success: true,
  data: [...productos],
  mensaje: "Encontré 3 guardianes de protección..."
}
```

### Fuzzy Matching

Para `buscar_producto`, usa distancia Levenshtein para encontrar nombres aproximados:

```javascript
// Usuario escribe: "violetta"
// Sistema encuentra: "Violeta" (distancia 2)
```

---

## Sistema de Cotizaciones

Archivo: `/lib/tito/cotizaciones.js`

### Fuentes de Datos

1. **exchangerate-api.com** - Tasas generales (gratis)
2. **bluelytics.com.ar** - Dólar blue Argentina
3. **Fallback hardcoded** - Si APIs fallan

### Caché

- Duración: **6 horas**
- Storage: **Vercel KV**
- Key: `tito:cotizaciones`

### Precios Uruguay (FIJOS)

Uruguay NO usa conversión USD→UYU. Tiene tabla fija:

```javascript
const PRECIOS_URUGUAY = {
  convertir: (precioUSD) => {
    if (precioUSD <= 75) return 2500;
    if (precioUSD <= 160) return 5500;
    if (precioUSD <= 210) return 8000;
    if (precioUSD <= 350) return 12500;
    if (precioUSD <= 500) return 16500;
    if (precioUSD <= 700) return 24500;
    return 39800;
  }
};
```

### Países Dolarizados

USA, Ecuador, Panamá → Solo muestran USD, sin conversión.

---

## Personalidad de Tito

Archivo: `/lib/tito/personalidad-media.js` (~8,000 tokens)

### Reglas Clave

1. **NO es chatbot** - Es un duende REAL que usa tecnología
2. **Habla uruguayo** - "vos", "tenés", "dale", "ta"
3. **NUNCA se presenta** - El widget ya dice "Soy Tito"
4. **Directo** - Si piden productos, los muestra SIN preguntar más

### Técnicas de Venta

| Técnica | Uso |
|---------|-----|
| Escasez real | "Es único. Cuando se va, desaparece del mundo" |
| Prueba social por categoría | "Ayer una chica de México adoptó uno de protección" |
| Labeling | "Parece que venís cargando algo pesado..." |
| Reciprocidad | Tips gratis: "La sal gruesa en las esquinas ayuda" |

### Manejo de Objeciones

```
"Es caro" → "¿Caro comparado con qué? ¿Con la paz mental?"
"Lo pienso" → "Este guardián ya te eligió... no esperan para siempre"
"No sé si funciona" → "Algo te trajo hasta acá, ¿no?"
```

### Detección de "Pichis"

Si después de 3-4 mensajes no avanzan:
```
"Mirá, cuando sientas el llamado de verdad, acá voy a estar.
Te dejo el test: https://duendesdeluruguay.com/descubri-que-duende-te-elige/ 🍀"
```

---

## Sistema de Memoria

### Vercel KV Keys

| Key | Contenido | TTL |
|-----|-----------|-----|
| `tito:session:{id}` | Historial de conversación | 24h |
| `tito:cotizaciones` | Tasas de cambio | 6h |
| `tito:productos:cache` | Productos WooCommerce | 5min |
| `tito:productos:invalidacion` | Marca para invalidar | - |
| `stock:bajo:{id}` | Productos con stock <= 2 | 7d |

### Historial de Conversación

Cada mensaje se guarda con:
```javascript
{
  role: 'user' | 'assistant',
  content: 'mensaje',
  timestamp: Date.now(),
  productos_mostrados: [...ids]  // Si aplica
}
```

---

## Integración WooCommerce

Archivo: `/lib/tito/conocimiento.js`

### Sincronización de Productos

```javascript
// Obtener productos (con caché de 5 min)
const productos = await obtenerProductos();

// Estructura de producto
{
  id: 123,
  nombre: "Violeta",
  precio: 70,           // USD
  precioUY: 2500,       // Pesos uruguayos (calculado)
  categoria: "Protección",
  tipo: "pixie",
  descripcion: "...",
  imagen: "https://...",
  stock: 1,
  cristales: ["amatista", "cuarzo rosa"],
  en_stock: true
}
```

### Invalidación de Caché

Cuando llega webhook de WooCommerce (`product.updated`):
1. Se marca `tito:productos:invalidacion` en KV
2. Próxima request detecta la marca y refresca

---

## Pre-Filtro (Sin Claude)

El 40-60% de mensajes se responden sin llamar a Claude:

### Detección de País

```javascript
// Si usuario dice país después de ver productos
const dicePais = /^(de |soy de )?(uruguay|argentina|mexico|...)/.test(msg);
const yaVioProductos = historial.includes('$USD');

if (dicePais && yaVioProductos) {
  // Genera respuesta directa con precios convertidos
  return respuestaDirectaConPrecios(pais, productosVistos);
}
```

### Saludos Simples

```javascript
if (/^(hola|hey|buenas|ola)$/i.test(msg)) {
  return "¡Ey! ¿Qué andás buscando? 🍀";
}
```

---

## Formatos de Respuesta

### Para Widget Web

```javascript
{
  respuesta: "Texto con **markdown**",
  productos: [{id, nombre, precio, imagen}],
  imagenes: ["url1", "url2"],
  acciones: [{tipo: "link", url: "...", texto: "Ver tienda"}]
}
```

### Para ManyChat (WhatsApp/Instagram)

```javascript
{
  respuesta_tito: "Texto plano sin markdown",  // Campo que mapea ManyChat
  version: "v2",
  content: {
    messages: [{type: "text", text: "..."}]
  }
}
```

**IMPORTANTE**: ManyChat necesita el campo `respuesta_tito` en el root del JSON para mapearlo a un Custom Field.

---

## Configuración ManyChat

### Paso 1: Crear Custom Field

- Nombre: `respuesta_tito`
- Tipo: Text

### Paso 2: Configurar External Request

- URL: `https://duendes-vercel.vercel.app/api/tito/v3`
- Método: POST
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "mensaje": "{{last_input_text}}",
  "nombre": "{{first_name}}",
  "subscriber_id": "{{id}}",
  "canal": "whatsapp"
}
```

### Paso 3: Response Mapping

- JSONPath: `$.respuesta_tito`
- Guardar en: Custom Field `respuesta_tito`

### Paso 4: Enviar Respuesta

- Bloque de texto con: `{{respuesta_tito}}`

---

## FAQ Sistema

Archivo: `/lib/tito/conocimiento.js` → `FAQ`

Temas disponibles:
- `envios` - Tiempos y costos de envío
- `pagos` - Métodos de pago
- `devoluciones` - Política de devoluciones
- `canalizacion` - Qué es la canalización
- `materiales` - De qué están hechos
- `cuidados` - Cómo cuidar al guardián
- `garantia` - Garantía del producto

---

## Variables de Entorno Requeridas

```env
# Vercel KV
KV_REST_API_URL=...
KV_REST_API_TOKEN=...

# WooCommerce
WOOCOMMERCE_URL=https://duendesdeluruguay.com
WOOCOMMERCE_KEY=ck_...
WOOCOMMERCE_SECRET=cs_...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Webhooks
WOOCOMMERCE_WEBHOOK_SECRET=...
```

---

## Debugging

### Logs Importantes

```javascript
console.log('[TITO v3]', { mensaje, session_id, canal });
console.log('[TITO] Pre-filtro:', { tipo, respuesta });
console.log('[TITO] Tool llamada:', { nombre, params });
console.log('[TITO] Respuesta Claude:', { tokens, tools_usadas });
```

### Endpoint de Test

```bash
curl -X POST https://duendes-vercel.vercel.app/api/tito/v3 \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "hola", "session_id": "test123"}'
```

---

## Flujo Típico de Conversación

```
Usuario: "hola"
Tito: "¡Ey! ¿Qué andás buscando? 🍀"

Usuario: "quiero ver guardianes de protección"
Tito: [Llama mostrar_productos(categoria: proteccion)]
      "Mirá estos guardianes que cuidan tu energía..."
      [Muestra 3 productos con imagen y precio USD]

Usuario: "soy de argentina"
Tito: [Pre-filtro detecta país + productos previos]
      "¡Argentina! Te paso los precios en pesos:
       - Violeta: $70 USD (aprox. $94,500 ARS)
       - Luna: $85 USD (aprox. $114,750 ARS)
       ¿Cuál te llamó más la atención?"

Usuario: "el de violeta me gusta"
Tito: [Llama obtener_detalles_producto(nombre: Violeta)]
      "Violeta es una pixie sanadora... [historia]
       ¿Querés que te arme el link para adoptarla?"
```

---

## Notas para Implementadores

1. **Uruguay siempre usa precios fijos** - No convertir USD→UYU
2. **Cada guardián es ÚNICO** - Nunca decir "alguien compró el mismo"
3. **ManyChat necesita `respuesta_tito`** - Campo plano en root del JSON
4. **El pre-filtro ahorra tokens** - Saludos y países se responden sin Claude
5. **Invalidar caché en deploys** - Los productos se cachean 5 minutos
