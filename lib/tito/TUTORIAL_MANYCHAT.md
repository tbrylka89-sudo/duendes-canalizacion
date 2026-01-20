# TITO + MANYCHAT - Guía de Configuración

## Resumen

Tito es el asistente de ventas de Duendes del Uruguay que funciona en Instagram vía ManyChat. Usa Claude (Anthropic) para generar respuestas inteligentes y muestra productos de WooCommerce.

---

## Arquitectura

```
Instagram DM → ManyChat → Endpoint Vercel → Claude AI → ManyChat → Instagram DM
                              ↓
                         WooCommerce
                       (productos/imágenes)
```

---

## Endpoint Principal

**URL:** `https://duendes-vercel.vercel.app/api/tito/mc-direct`

**Método:** POST

**Body que envía ManyChat:**
```json
{
  "mensaje": "texto del usuario",
  "nombre": "nombre del usuario",
  "subscriber_id": "ID de ManyChat"
}
```

**Respuesta del endpoint:**
```json
{
  "respuesta": "Texto de respuesta de Tito",
  "hay_productos": "si" | "no",
  "imagen_1": "URL de imagen 1",
  "imagen_2": "URL de imagen 2",
  "imagen_3": "URL de imagen 3",
  "total_productos": 3
}
```

---

## Campos Personalizados en ManyChat

Estos campos deben existir en ManyChat (Settings → Custom Fields):

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `respuesta_tito` | Text | Respuesta de Tito |
| `hay_productos` | Text | "si" o "no" |
| `imagen_url` | Text | URL imagen 1 |
| `imagen_url_2` | Text | URL imagen 2 |
| `imagen_url_3` | Text | URL imagen 3 |

---

## Configuración del Flow en ManyChat

### 1. Disparador (Trigger)
- **Tipo:** "Cuando el usuario envía un mensaje"
- **Condición:** Cualquier mensaje
- **Canal:** Instagram

### 2. Solicitud Externa (External Request)
- **Tipo:** POST
- **URL:** `https://duendes-vercel.vercel.app/api/tito/mc-direct`
- **Headers:** ninguno especial
- **Body (JSON):**
```json
{
  "mensaje": "{{last_input_text}}",
  "nombre": "{{first_name}}",
  "subscriber_id": "{{id}}"
}
```

### 3. Mapeo de Respuesta
En la pestaña "Mapeo de respuesta":

| JSONPath | Campo ManyChat |
|----------|----------------|
| `respuesta` | `respuesta_tito` |
| `hay_productos` | `hay_productos` |
| `imagen_1` | `imagen_url` |
| `imagen_2` | `imagen_url_2` |
| `imagen_3` | `imagen_url_3` |

### 4. Condición
- **Si:** `hay_productos` es igual a `si`
- **Entonces:** Ir a bloque con galería
- **Si no:** Ir a bloque solo texto

### 5. Bloque "Sí tiene productos" (Instagram)
1. **Mensaje de texto:** `{{respuesta_tito}}`
2. **Galería con 3 tarjetas:**
   - Tarjeta 1: Imagen = `{{imagen_url}}`, Título = "Guardián 🍀"
   - Tarjeta 2: Imagen = `{{imagen_url_2}}`, Título = "Guardián 🍀"
   - Tarjeta 3: Imagen = `{{imagen_url_3}}`, Título = "Guardián 🍀"

### 6. Bloque "No tiene productos" (Instagram)
- **Mensaje de texto:** `{{respuesta_tito}}`

---

## Diagrama del Flow

```
┌─────────────────────┐
│  Usuario envía DM   │
│    en Instagram     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Solicitud Externa  │
│   /api/tito/mc-direct│
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│     Condición       │
│ hay_productos = si? │
└──────────┬──────────┘
           ↓
    ┌──────┴──────┐
    ↓             ↓
┌───────┐    ┌───────┐
│  SÍ   │    │  NO   │
└───┬───┘    └───┬───┘
    ↓            ↓
┌───────────┐ ┌─────────┐
│ Texto +   │ │  Solo   │
│ Galería   │ │  Texto  │
└───────────┘ └─────────┘
```

---

## Detección de Intenciones

El endpoint detecta automáticamente qué quiere el usuario:

| Intención | Ejemplos | Acción |
|-----------|----------|--------|
| **Quiere comprar** | "quiero pagar", "cómo compro", "me lo llevo" | Pide datos de envío |
| **Pedido existente** | "mi pedido", "ya pagué", "cuándo llega" | Pide número de pedido |
| **Ver productos** | "mostrame", "qué tienen", "fotos" | Muestra galería |
| **Recomendación** | "cuál me sirve", "recomiéndame" | Sugiere según necesidad |
| **Precio** | "cuánto cuesta", "precio" | Da precio (pesos si es de UY) |

---

## Archivos Clave

```
/app/api/tito/mc-direct/route.js    ← Endpoint principal para ManyChat
/app/api/tito/manychat/route.js     ← Endpoint anterior (backup)
/app/api/tito/v2/route.js           ← Endpoint web
/lib/tito/personalidad.js           ← Personalidad de Tito
/lib/tito/conocimiento.js           ← FAQ, productos, precios
```

---

## Variables de Entorno Necesarias

```
ANTHROPIC_API_KEY=sk-ant-...        # API de Claude
MANYCHAT_API_KEY=2002343:...        # API de ManyChat (opcional)
WC_CONSUMER_KEY=ck_...              # WooCommerce
WC_CONSUMER_SECRET=cs_...           # WooCommerce
WORDPRESS_URL=https://duendesdeluruguay.com
```

---

## Solución de Problemas

### Las imágenes no cargan
1. Verificar que WordPress esté funcionando
2. Verificar que los productos tengan imágenes en WooCommerce
3. Probar las URLs directamente en el navegador

### No llega respuesta en Instagram
1. Verificar que la automatización esté ACTIVA (no STOPPED)
2. Verificar que el trigger esté encendido (toggle azul)
3. Revisar si hay otra automatización que capture mensajes primero

### Tito confunde intenciones
1. Revisar la función `detectarIntencion()` en `/app/api/tito/mc-direct/route.js`
2. Ajustar las expresiones regulares según casos reales

### La galería muestra "Unable to load" en preview
- Esto es normal en el preview de ManyChat
- Las imágenes cargan correctamente cuando se envía el mensaje real

---

## Mejoras Pendientes

- [ ] Agregar nombres dinámicos de productos en galería
- [ ] Agregar precios en subtítulos de galería
- [ ] Agregar botón "Comprar" en cada tarjeta
- [ ] Entrenar a Tito con contenido del sitio web actual
- [ ] Agregar más intenciones de detección

---

## Fecha de última actualización
20 de enero de 2026
