# TITO 4.0 - ROADMAP DE EVOLUCIÓN

**Última actualización:** 25/01/2026 - 20:45hs

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

## ESTADO ACTUAL

### Problemas Identificados y Estado

| # | Problema | Estado | Notas |
|---|----------|--------|-------|
| 1 | Contexto del producto no se usaba | ✅ RESUELTO | route.js extrae y usa `body.contexto` |
| 2 | Descripción truncada a 500 chars | ✅ RESUELTO | Ahora completa sin truncar |
| 3 | No usaba meta_data custom | ✅ RESUELTO | historia, sincrodestino, dones, elemento |
| 4 | Inventario con 5 min de delay | ✅ RESUELTO | Tool `verificar_stock` consulta en vivo |
| 5 | Sin sistema de objeciones | ✅ RESUELTO | `objeciones.js` con 5 tipos |
| 6 | Burbujas genéricas | ✅ RESUELTO | Contextuales por página |
| 7 | Slug incorrecto /tienda/ | ✅ RESUELTO | Cambiado a /shop/ en 25+ archivos |
| 8 | Burbuja fantasma "agregado al carrito" | ✅ RESUELTO | Flag `acabaDeAgregar` |

---

## FASES COMPLETADAS

### ✅ FASE 1: CONSCIENCIA DEL CONTEXTO
**Completada 25/01/2026**

**Cambios realizados:**
- `app/api/tito/v3/route.js`: Extrae `contexto` del body
- System prompt incluye producto que está viendo el cliente
- Instrucciones: "NO preguntes cuál te interesa - YA SABÉS CUÁL"
- Contexto de página (carrito, checkout) incluido

**Verificación:**
- [x] Tito sabe qué guardián está mirando el cliente
- [x] "Contame más" → habla del guardián visible
- [x] No pregunta "¿cuál te interesa?" si ya sabe

---

### ✅ FASE 2: CONOCIMIENTO COMPLETO DE GUARDIANES
**Completada 25/01/2026**

**Cambios realizados:**
- `lib/tito/conocimiento.js`: Descripción sin truncar
- Nuevos meta_data: `historia_completa`, `sincrodestino`, `dones`, `elemento`, `personalidad_guardian`
- Nueva tool: `obtener_guardian_completo`
- `lib/tito/tool-executor.js`: Implementación de la tool

**Verificación:**
- [x] Descripción completa disponible
- [x] Tool funciona y retorna datos completos
- [x] Tito puede contar historia completa

**Meta fields de WordPress a poblar:**
- `_duendes_historia` - Historia completa
- `_duendes_sincrodestino` - Evento mágico durante creación
- `_duendes_dones` - Capacidades especiales
- `_duendes_elemento` - Tierra, Agua, Fuego, Aire
- `_duendes_personalidad` - Forma de ser del guardián

---

### ✅ FASE 3: INVENTARIO EN TIEMPO REAL
**Completada 25/01/2026**

**Cambios realizados:**
- Nueva tool: `verificar_stock` en `tools.js`
- Implementación en `tool-executor.js` que consulta WooCommerce directo
- Regla en `personalidad.js`: verificar antes de confirmar disponibilidad

**Verificación:**
- [x] Tool consulta WooCommerce en vivo (no caché)
- [x] Si agotado: "Ese guardián ya encontró su hogar..."
- [x] Acepta ID o nombre del producto

---

### ✅ FASE 4: BURBUJAS INTELIGENTES CONTEXTUALES
**Completada 25/01/2026**

**Cambios realizados:**
- `wordpress-plugins/duendes-tito-widget.php` completamente reescrito
- Burbujas por página con delays apropiados
- Persistencia en localStorage (no repetir)
- Bug de burbuja fantasma corregido

**Burbujas por contexto:**

| Página | Delay | Mensaje |
|--------|-------|---------|
| Producto | 15s | "¿Querés saber más de [nombre del producto]?" |
| Producto | 45s | "Cada guardián tiene una historia única..." |
| Tienda/Shop | 20s | "¿Buscás algo en particular?" |
| Tienda/Shop | 50s | Opciones: Protección / Abundancia / Amor |
| Carrito | 10s | "¿Todo listo para completar la adopción?" |
| Checkout | - | **NO HAY** (no interrumpir) |
| Thank-you | 5s | "¡Felicidades! No olvides el formulario..." |

**Verificación:**
- [x] Burbujas contextuales funcionan
- [x] No aparecen si chat está abierto
- [x] No se repiten (localStorage)
- [x] Checkout sin interrupciones

---

### ✅ FASE 5: SISTEMA DE OBJECIONES
**Completada 25/01/2026**

**Cambios realizados:**
- Nuevo archivo: `lib/tito/objeciones.js`
- 5 tipos de objeciones con detectores regex
- Respuestas sugeridas y estrategias
- Integrado en `route.js` - detección automática

**Tipos de objeciones:**

| Tipo | Detectores | Estrategia |
|------|------------|------------|
| Precio | caro, mucha plata, no alcanza | Seña 30%, opciones accesibles, reencuadrar valor |
| Tiempo | después, lo pienso, no sé | Respetar, urgencia sutil, indagar |
| Desconfianza | es real, funciona, estafa | No confrontar, experiencia personal, testimonios |
| Envío | cómo llega, se rompe | Info clara, transmitir seguridad |
| Regalo | para mi mamá, sorpresa | Entusiasmo, explicar canalización |

**Verificación:**
- [x] Detecta objeciones automáticamente
- [x] Claude recibe instrucciones de manejo
- [x] Respuestas sugeridas apropiadas

---

### ✅ FASE 6: SISTEMA DE ORÍGENES (MULTI-CANAL)
**Completada 25/01/2026 - 20:30hs**

Tito ahora sabe desde dónde habla y adapta su comportamiento:

| Origen | Contexto | Objetivo |
|--------|----------|----------|
| `tienda` | Widget WordPress | VENDER guardianes |
| `mi-magia` | Portal clientes | FIDELIZAR, ofrecer experiencias |
| `circulo` | Membresía VIP | SERVIR, info de beneficios |
| `manychat` | IG/FB/WA | Respuestas cortas, redirigir a web |

**Cambios realizados:**
- `route.js`: Función `getContextoOrigen()` + parámetro `origen`
- `widget.php`: Envía `origen: 'tienda'`
- `Tito.jsx`: Props `origen` y `datosCirculo`
- `circulo/page.jsx`: Pasa datos de membresía
- `manychat/route.js`: Unificado con v3

**Manejo de "pichis" (personas que solo quieren desahogarse):**

| Mensaje | Comportamiento |
|---------|----------------|
| 1-2 | Empatía + guardianes de sanación |
| 3-5 | Sigue mostrando productos |
| 6-7 | "Te dejo el test cuando estés lista" |
| 8-10+ | "No soy psicólogo" + despedida |

**Verificación:**
- [x] Cada origen recibe contexto específico
- [x] Círculo reconoce tiradas gratis y descuentos
- [x] ManyChat redirige a la web
- [x] Pichis se cortan con elegancia

---

## FASES PENDIENTES

### FASE 7: SISTEMA DE RECOMENDACIÓN INTELIGENTE
**Prioridad:** MEDIA | **Estado:** PENDIENTE

**Objetivos:**
- Matching guardián-cliente basado en conversación
- Cross-sell: "¿Sabías que [guardián] y [otro] se potencian juntos?"
- Upsell: Pack 3x2 promocional
- Personalización para clientes repetidos

**Tareas:**
- [ ] Crear sistema de scoring guardián-cliente
- [ ] Implementar lógica de cross-sell por categoría
- [ ] Detectar clientes repetidos y personalizar tono
- [ ] Integrar con promoción 3x2 existente

---

### FASE 8: WEBHOOKS DE WOOCOMMERCE
**Prioridad:** BAJA | **Estado:** PENDIENTE

**Objetivos:**
- Actualización instantánea cuando producto se agota
- Notificación cuando hay nuevo pedido
- Sincronización bidireccional

**Tareas:**
- [ ] Crear endpoint `app/api/webhooks/woocommerce/route.js`
- [ ] Configurar webhooks en WooCommerce
- [ ] Invalidar caché cuando hay cambios

---

### FASE 9: INTEGRACIÓN MANUAL DE PERSUASIÓN
**Prioridad:** BAJA | **Estado:** PENDIENTE

**Objetivos:**
- Usar los 46KB de técnicas en `manual-persuasion.js`
- Integrar técnicas FBI (mirroring, labeling)
- Prueba social dinámica

**Tareas:**
- [ ] Revisar y seleccionar técnicas más efectivas
- [ ] Integrar en personalidad.js
- [ ] Crear sistema de prueba social con datos reales

---

## MÉTRICAS DE ÉXITO

| Métrica | Antes | Objetivo | Estado |
|---------|-------|----------|--------|
| Conversión chat → compra | ~2% | 8-10% | Por medir |
| Tito sabe qué producto ve | NO | SÍ | ✅ |
| Responde con historia completa | NO | SÍ | ✅ |
| Verifica stock en vivo | NO | SÍ | ✅ |
| Detecta objeciones | NO | SÍ | ✅ |
| Burbujas contextuales | NO | SÍ | ✅ |

---

## ARCHIVOS MODIFICADOS (25/01/2026)

### Backend Vercel

| Archivo | Cambios |
|---------|---------|
| `app/api/tito/v3/route.js` | Contexto producto, objeciones, geolocalización |
| `lib/tito/tools.js` | +`obtener_guardian_completo`, +`verificar_stock` |
| `lib/tito/tool-executor.js` | Implementación de nuevas tools |
| `lib/tito/conocimiento.js` | Descripción completa, meta_data custom |
| `lib/tito/personalidad.js` | Regla de stock |
| `lib/tito/objeciones.js` | **NUEVO** - Sistema de objeciones |

### WordPress Plugins

| Archivo | Cambios |
|---------|---------|
| `duendes-tito-widget.php` | Burbujas inteligentes, fix burbuja fantasma |
| `duendes-producto-epico.php` | Geolocalización de precios |
| +24 archivos | Slug /tienda/ → /shop/ |

---

## CHANGELOG

### 25/01/2026 - 20:30hs - SISTEMA DE ORÍGENES ✅ COMPLETO Y TESTEADO

Tito ahora sabe desde dónde habla y adapta su contexto:

| Origen | Descripción | Estado |
|--------|-------------|--------|
| `tienda` | Widget en WordPress - visitantes de la tienda | ✅ Desplegado |
| `mi-magia` | Portal de clientes que ya compraron | ✅ Testeado |
| `circulo` | Miembros del Círculo (VIP) | ✅ Testeado |
| `manychat` | Instagram, Facebook, WhatsApp | ✅ Testeado |

**Bug corregido:** El contexto de origen se perdía porque `contextoCliente =` sobrescribía en vez de `+=`.

**Tests realizados:**

| # | Origen | Escenario | Resultado |
|---|--------|-----------|-----------|
| 1 | tienda | Visitante busca protección | ✅ Mostró Diana, Stan, Ekris en UYU |
| 2 | tienda | Pregunta precio Uruguay | ✅ Precios en pesos uruguayos |
| 3 | tienda | Objeción "es caro" | ✅ Opciones accesibles + reserva 30% |
| 4 | mi-magia | Cliente saluda | ✅ Usó nombre, preguntó por guardianes |
| 5 | mi-magia | Pregunta sobre runas | ✅ Explicó usos de runas |
| 6 | circulo | Miembro pregunta tiradas | ✅ "Tenés 3 tiradas gratis disponibles" |
| 7 | manychat | Instagram - son reales? | ✅ Respuesta corta, pregunta al final |
| 8 | manychat | Cómo comprar | ✅ 3 opciones + links a la web |
| 9 | manychat | WhatsApp - envíos Argentina | ✅ DHL Express, 5-10 días |

**Tests de "pichis" (personas que quieren desahogarse sin comprar):**

| Escenario | Comportamiento de Tito |
|-----------|------------------------|
| Tienda - Primera vez | Valida brevemente, muestra guardianes de sanación |
| Tienda - Persiste sin avanzar | Corta cortés: "te dejo el test, cuando estés lista" |
| ManyChat - Desahogo | Respuesta corta, muestra 3 guardianes sanadores |
| Mi Magia - Cliente triste | Más empático, pregunta por guardianes existentes |

**Progresión con pichi insistente (10+ mensajes):**

| Mensaje | Respuesta de Tito |
|---------|-------------------|
| 1-2 | Empatía + muestra guardianes sanadores (Micelio, Moon, Izara) |
| 3-5 | Sigue mostrando productos, intenta redirigir |
| 6-7 | "Te dejo el test cuando estés lista" + despedida cálida |
| 8-10+ | "No soy psicólogo" + link al test + "¡Que estés bien!" |

Tito es empático pero no se queda de terapeuta gratis. Corta con elegancia.

**Archivos modificados:**
- `app/api/tito/v3/route.js` - Función `getContextoOrigen()` + fix del bug
- `wordpress-plugins/duendes-tito-widget.php` - Envía `origen: 'tienda'` (subido a WP)
- `app/mi-magia/components/Tito.jsx` - Acepta props `origen` y `datosCirculo`
- `app/mi-magia/circulo/page.jsx` - Pasa `origen: 'circulo'` con datos membresía
- `app/api/tito/manychat/route.js` - Unificado: usa v3 internamente

### 25/01/2026 - 19:30hs
- Corregidos métodos de pago: eliminado PayPal (no disponible)
- Agregado Mercado Pago para Uruguay
- Actualizada info de pagos en conocimiento.js y personalidad.js

### 25/01/2026 - 19:00hs
- Actualizado roadmap con estado real de todas las fases
- Documentación de verificaciones completadas

### 25/01/2026 - 18:30hs - IMPLEMENTACIÓN COMPLETA
- Fases 1-5 implementadas en paralelo con agentes
- Bug de burbuja fantasma corregido
- Slug /tienda/ → /shop/ en 25+ archivos
- Deploy a Vercel y WordPress completado

### 25/01/2026 - 15:00hs
- Documento creado
- Diagnóstico inicial completado
- Planificadas 8 fases de desarrollo

---

## NOTAS TÉCNICAS

### Archivos clave del sistema Tito

| Archivo | Función |
|---------|---------|
| `app/api/tito/v3/route.js` | Orquestador principal |
| `lib/tito/personalidad.js` | Personalidad y reglas |
| `lib/tito/tools.js` | Definición de herramientas |
| `lib/tito/tool-executor.js` | Ejecutor de tools |
| `lib/tito/conocimiento.js` | Base de datos/WooCommerce |
| `lib/tito/objeciones.js` | Sistema de objeciones |
| `lib/tito/cotizaciones.js` | Conversión de monedas |
| `wordpress-plugins/duendes-tito-widget.php` | Widget frontend |

### Endpoints

| Endpoint | Función |
|----------|---------|
| `/api/tito/v3` | Chat principal |
| `/api/divisas` | Cotizaciones de monedas |
| `/api/cotizaciones` | Alias de divisas |

### URLs importantes

| Recurso | URL |
|---------|-----|
| API Tito | https://duendes-vercel.vercel.app/api/tito/v3 |
| Tienda | https://duendesdeluruguay.com/shop/ |
| Test del Guardián | https://duendesdeluruguay.com/descubri-que-duende-te-elige/ |

### Credenciales

Ver `CLAUDE.md` sección "Información Técnica del Sitio"
