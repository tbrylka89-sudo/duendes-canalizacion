# TITO HÍBRIDO - Documentación Técnica

## Resumen

Tito ahora usa un **modelo híbrido** que combina:
- **Respuestas rápidas sin IA** ($0) para preguntas frecuentes
- **GPT-4o-mini** (barato) para consultas normales
- **Claude Sonnet** (inteligente) para situaciones importantes

---

## Archivos Modificados

### 1. `/app/api/tito/gpt/route.js` - Endpoint Principal

Este es el endpoint híbrido que usa el widget web y ManyChat.

**Ubicación de cada funcionalidad:**

| Línea aprox. | Funcionalidad |
|--------------|---------------|
| 22-72 | `necesitaClaude()` - Detecta cuándo usar Claude vs GPT |
| 568-750 | **Respuestas rápidas sin IA** (ver detalle abajo) |
| 242-315 | Definición de TOOLS (mostrar_productos, consultar_pedido, etc.) |
| 318-530 | `ejecutarTool()` - Ejecuta las herramientas |
| 554-760 | Handler POST principal |
| 669-734 | Lógica de Claude Sonnet para situaciones importantes |

### 2. `/app/api/tito/manychat/route.js` - ManyChat

Redirige a `/api/tito/gpt` (el híbrido) en lugar de v3.

**Cambio clave (línea ~118):**
```javascript
const gptResponse = await fetch(`${baseUrl}/api/tito/gpt`, { ... });
```

### 3. `/lib/tito/conocimiento.js` - Base de Conocimiento

**`formatearPedido()` (línea ~235)** ahora incluye:
- `pais_envio` - País de envío (shipping, no billing)
- `tiempo_envio` - "3-7 días por DAC" o "5-10 días por DHL"
- `metodo_envio` - DAC o DHL Express
- `mensaje_estado` - Mensaje tranquilizador según estado

### 4. `/lib/tito/tool-executor.js` - Ejecutor de Tools

**`buscarPedido()` (línea ~548)** ahora devuelve:
- País de envío correcto
- Instrucciones explícitas de tiempos
- Mensajes tranquilizadores

### 5. `/lib/tito/personalidad.js` - Personalidad de Tito

**Secciones actualizadas:**

| Línea aprox. | Sección |
|--------------|---------|
| 527-554 | Instrucciones de pedidos con país de envío |
| 555-590 | "Regla de la Magia" para cortar desahogos |
| 540-554 | Tiempos de envío según país |

---

## Respuestas Rápidas Sin IA

Ubicación: `/app/api/tito/gpt/route.js` líneas 568-750

Estas respuestas NO llaman a ninguna IA, cuestan $0:

| Patrón | Respuesta | Razón |
|--------|-----------|-------|
| `hola`, `buenas` (primer mensaje) | Saludo + pide país | `saludo` |
| `amén`, `bendiciones`, `dame suerte`, lotería | "Que la magia te acompañe" | `spam` |
| Solo emojis, mensajes < 3 chars | "Que la magia te acompañe" | `spam` |
| `cuánto cuestan` (sin país) | Pide país | `precio_sin_pais` |
| `de dónde son`, `dónde están` | Piriápolis, Uruguay | `ubicacion` |
| `hacen envíos`, `envían a` | Sí, a todo el mundo por DHL | `envios` |
| `cuánto tarda` | UY: 3-7 días / Intl: 5-10 días | `tiempo_envio` |
| `métodos de pago` | Lista según país (UY vs intl) | `metodos_pago` |
| `paypal` | No tenemos + alternativas | `paypal` |
| `es seguro`, `confiable` | Sí, años enviando a 30+ países | `confianza` |
| `personalizado`, `encargo` | No hacemos, nacen cuando nacen | `personalizados` |
| `tienda física` | Piriápolis pero solo online | `tienda_fisica` |
| `cuánto miden`, `tamaño` | Cada uno tiene su medida en la web | `medidas` |
| `descuento`, `promo` | 3x2 + envío gratis | `promos` |
| `cómo funciona` | Explicación completa + test | `como_funciona` |
| `test`, `cuál es para mí` | Link al test | `test` |
| `qué significa canalizado` | Explicación de canalización | `canalizacion` |
| `gracias` | Despedida corta | `gracias` |
| `chau`, `adiós` | Despedida | `despedida` |
| `ok`, `dale`, `sí` (sin contexto) | ¿En qué te ayudo? | `confirmacion_vacia` |

---

## Cuándo Usa Cada Modelo

### Sin IA (modelo: "ninguno")
- Todas las respuestas rápidas de arriba
- Costo: $0

### GPT-4o-mini
- Ver productos
- Consultas normales
- Preguntas que no matchean respuestas rápidas
- Costo: ~$0.0001 por mensaje

### Claude Sonnet
Se activa cuando `necesitaClaude()` detecta (línea 22-72):

```javascript
// Palabras que activan Claude:

// PROBLEMAS
'problema', 'queja', 'mal', 'error', 'no llegó',
'dañado', 'roto', 'equivocado', 'devolver',
'reembolso', 'cancelar', 'enojad', 'frustrad'

// PEDIDOS
'mi pedido', 'mi compra', 'estado de mi',
'donde está', 'tracking', 'cuando llega'

// OBJECIONES
'es caro', 'muy caro', 'no sé', 'lo pienso',
'después', 'no puedo', 'no tengo plata'

// CIERRE DE VENTA
'quiero comprar', 'cómo compro', 'cómo pago',
'métodos de pago', 'precio final'
```

Costo: ~$0.003 por mensaje (solo para situaciones importantes)

---

## Flujo de una Consulta

```
1. Llega mensaje
         ↓
2. ¿Es respuesta rápida?
    SÍ → Responder directo ($0)
    NO ↓
3. ¿Necesita Claude? (necesitaClaude())
    SÍ → Marcar para usar Claude después
    NO ↓
4. Llamar GPT-4o-mini con tools
         ↓
5. ¿Usó tools? (mostrar_productos, consultar_pedido)
    SÍ → Ejecutar tools y continuar
    NO ↓
6. ¿Estaba marcado para Claude?
    SÍ → Llamar Claude Sonnet con contexto
    NO → Usar respuesta de GPT
         ↓
7. Devolver respuesta + productos
```

---

## Consulta de Pedidos

Cuando alguien pregunta por su pedido:

1. GPT llama a `consultar_pedido` con el email/número
2. Se consulta WooCommerce API
3. Se extrae `pais_envio` del campo `shipping.country`
4. Se calculan tiempos según país:
   - **Uruguay (UY)**: 3-7 días por DAC
   - **Cualquier otro**: 5-10 días por DHL Express
5. Si es situación importante, Claude genera la respuesta final

**Importante:** Siempre usa `shipping.country`, no `billing.country`

---

## "Regla de la Magia" - Cortar Desahogos

Ubicación: `/lib/tito/personalidad.js` línea ~555

Cuando alguien empieza a contar todos sus problemas:

> "Pará, pará... si me contás todo, después cuando tu guardián te hable va a parecer que 'ya lo sabía'. La magia de verdad se siente cuando el guardián conecta con vos SIN que le cuentes nada. Dejá que te elija y te sorprenda."

Esto:
- Corta el desahogo sin ser grosero
- Tiene sentido en la narrativa mágica
- Redirige a la compra
- Ahorra tokens

---

## ManyChat

Endpoint: `/api/tito/manychat`

Ahora redirige a `/api/tito/gpt` (híbrido) en lugar de `/api/tito/v3`.

Beneficios:
- Mismo modelo híbrido que el widget web
- Respuestas rápidas sin IA
- Claude para situaciones importantes

---

## Costos Estimados

| Tipo de mensaje | Modelo | Costo aprox. |
|-----------------|--------|--------------|
| Spam, FAQ, saludos | ninguno | $0 |
| Ver productos, consultas | GPT-4o-mini | $0.0001 |
| Quejas, objeciones, cierres | Claude Sonnet | $0.003 |

Con las respuestas rápidas, ~60-70% de mensajes cuestan $0.

---

## Testing

```bash
# Saludo (sin IA)
curl -X POST https://duendes-vercel.vercel.app/api/tito/gpt \
  -H "Content-Type: application/json" \
  -d '{"mensaje":"hola"}'

# Spam (sin IA)
curl -X POST https://duendes-vercel.vercel.app/api/tito/gpt \
  -H "Content-Type: application/json" \
  -d '{"mensaje":"amen"}'

# Ver productos (GPT)
curl -X POST https://duendes-vercel.vercel.app/api/tito/gpt \
  -H "Content-Type: application/json" \
  -d '{"mensaje":"mostrame guardianes","pais":"AR"}'

# Queja (Claude)
curl -X POST https://duendes-vercel.vercel.app/api/tito/gpt \
  -H "Content-Type: application/json" \
  -d '{"mensaje":"tengo un problema con mi pedido"}'
```

---

## Commits Relacionados

1. `Unificar lógica de pedidos en todos los endpoints Tito`
2. `ManyChat: usar modelo híbrido (GPT + Claude Sonnet)`
3. `Filtrar spam y desahogos para ahorrar tokens`
4. `Respuestas rápidas sin IA para preguntas frecuentes`
5. `Agregar respuesta rápida: qué significa canalizado`

---

*Última actualización: 27 enero 2026*
