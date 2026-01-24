# PLAN MAESTRO UNIFICADO - DUENDES DEL URUGUAY
## Sistema Inteligente de Conversión + Estado Completo del Proyecto

**Última actualización:** 22 Enero 2026, 15:03
**Objetivo:** Documento único de referencia para todo el proyecto

---

# PARTE 1: CONTEXTO Y ESTADO ACTUAL

## 1.1 Resumen Ejecutivo

**Duendes del Uruguay** es un e-commerce de "guardianes canalizados" - figuras artesanales únicas con experiencias digitales.

**Público objetivo:** Mujeres 35-65 años, sanadoras heridas, buscadoras de protección/amor/cambio.

**Tono:** Español rioplatense (voseo), místico, emocional, "el guardián te elige a vos".

## 1.2 Presencia Digital

### Redes Sociales
| Plataforma | Usuario | Seguidores | Estado |
|------------|---------|------------|--------|
| Instagram | @duendesdeluruguay | 137,000 | Alto engagement |
| TikTok | @duendesdeluruguay | 102,000 | 843K likes |
| Facebook | duendescanalizados | - | Activo |
| Pinterest | DuendesdelUruguay | 409 | Medio |

### Sitios Web
| Sitio | URL | Plataforma | Estado |
|-------|-----|------------|--------|
| Web Principal | duendesuy.10web.cloud | WordPress/Elementor | Activo |
| Mi Magia (Portal) | duendes-vercel.vercel.app/mi-magia | Next.js/Vercel | Activo |
| Dominio oficial | duendesdeluruguay.com | - | Apuntando a 10web |

## 1.3 Avatar Objetivo - 5 Arquetipos

### 1. La Víctima
- "Todo me pasa a mí"
- Siente que el universo está en su contra
- **Necesita:** Validación, protección

### 2. La Buscadora
- Colecciona métodos pero no profundiza
- Ha probado tarot, astrología, terapias
- **Necesita:** Algo que realmente funcione

### 3. La Que Repite Patrones
- Relaciones tóxicas cíclicas
- "Siempre me pasa lo mismo"
- **Necesita:** Romper el ciclo

### 4. La Sanadora Herida
- Cuida a todos menos a sí misma
- Agotada de ser la fuerte
- **Necesita:** Que alguien la sostenga

### 5. La Que Busca Amor
- Idealiza lo que no tiene
- "Siempre doy más de lo que recibo"
- **Necesita:** Ser elegida primero

---

# PARTE 2: FILOSOFÍA DE CONVERSIÓN

## 2.1 Regla de Oro

```
┌──────────────────────────────────┬────────────────────────────────────────────────────┐
│    FIJO (todos ven igual)        │      ADAPTATIVO (privado, cada uno diferente)      │
├──────────────────────────────────┼────────────────────────────────────────────────────┤
│ Historia del guardián            │ Resultado del test ("para vos específicamente...") │
│ Descripción del producto         │ Emails de seguimiento según perfil                 │
│ Sincrodestino de su creación     │ "Señales" basadas en sus datos personales          │
│ Su mensaje (en la ficha)         │ Recomendaciones ("alguien como vos...")            │
│ Precio                           │ Cierres adaptativos en canalizaciones              │
└──────────────────────────────────┴────────────────────────────────────────────────────┘
```

**Si dos personas comparan, ven lo mismo. La magia está en lo que cada una recibe EN PRIVADO.**

## 2.2 Secuencia de Micro-Compromisos

```
PASO 1: "¿Querés saber qué guardián te corresponde?"
        → Test gratis → Captura: email + perfil psicológico

PASO 2: "¿Querés que te avise cuando aparezca uno para vos?"
        → Suscripción a alertas → Email en lista segmentada

PASO 3: "¿Querés ver el mensaje que tiene para vos?"
        → Preview de canalización → Deseo creado

PASO 4: "¿Querés reservarlo antes de que desaparezca?"
        → Wishlist o seña → Compromiso pequeño

PASO 5: Compra completa
        → El "sí" grande viene natural
```

---

# PARTE 3: SISTEMA DE PERFILADO PSICOLÓGICO

## 3.1 Test del Guardián (12 preguntas)

**Estado:** ✅ Implementado

**Archivos:**
- `/app/api/test-guardian/route.js` - API con 12 preguntas + algoritmo
- `/app/mi-magia/test-guardian.js` - UI componente React
- `/wordpress-plugins/test-guardian-v11.php` - Plugin WordPress

**Qué detecta:**
```javascript
perfilPsicologico = {
  vulnerabilidad: {
    nivel: "alta" | "media" | "baja",
    score: 0-100,
    indicadores: ["crisis_actual", "sufrimiento_alto", "dolor_cronico"]
  },
  dolor_principal: {
    tipo: "soledad" | "dinero" | "salud" | "relaciones" | "proposito",
    intensidad: 0-100
  },
  estilo_decision: {
    tipo: "impulsivo" | "analitico" | "emocional",
    velocidad: "rapido" | "medio" | "lento"
  },
  creencias: {
    tipo: "esceptico" | "creyente" | "buscador",
    apertura: 0-100
  }
}
```

**Mapeo a cierres:**
| Perfil detectado | Cierre que recibe |
|------------------|-------------------|
| Vulnerabilidad alta | vulnerable |
| Creencias escépticas | esceptico |
| Decisión impulsiva | impulsivo |
| Decisión analítica | racional |
| Creyente + baja vulnerabilidad | coleccionista |

**Almacenamiento:** Vercel KV con email como key
```javascript
kv.set(`perfil:${email}`, { perfilPsicologico, perfilCierre, fecha })
```

## 3.2 Cierres Adaptativos

**Estado:** ✅ Implementado
**Archivo:** `/lib/conversion/cierres.js`

**5 cierres disponibles (con variaciones cada uno):**

1. **Vulnerable:** "Sé que estás cansada. Sé que das más de lo que recibís..."
2. **Escéptico:** "No te pido que creas en nada. Solo que observes qué sentiste..."
3. **Impulsivo:** "Hay momentos en que el cuerpo sabe antes que la mente..."
4. **Coleccionista:** "Los guardianes se potencian entre sí..."
5. **Racional:** "No vamos a decirte que hace magia. Vamos a decirte que funciona..."

---

# PARTE 4: SISTEMA DE GAMIFICACIÓN

## 4.1 Runas (Moneda Virtual)

**Estado:** ✅ APIs creadas

### Paquetes de Runas
| Paquete | Runas | Precio USD | Bonus | Slug WooCommerce |
|---------|-------|------------|-------|------------------|
| Chispa | 30 | $5 | - | paquete-runas-30 |
| Destello | 80 | $10 | +10 | paquete-runas-80 |
| Resplandor | 200 | $20 | +40 | paquete-runas-200 |
| Fulgor | 550 | $50 | +150 | paquete-runas-550 |
| Aurora | 1200 | $100 | +400 | paquete-runas-1200 |

### Runas de Bienvenida
- Registro normal: 20 runas
- Registro con referido: 30 runas
- Compra guardián físico: +10% del precio en runas

## 4.2 Membresías del Círculo

| Plan | Precio | Runas Bienvenida | Runas/Mes | Slug |
|------|--------|------------------|-----------|------|
| Mensual | $15 | 20 | 12 | circulo-mensual |
| Seis Meses | $50 | 60 | 15 | circulo-seis-meses |
| Anual | $80 | 120 | 25 | circulo-anual |

## 4.3 Sistema de Niveles

| Nivel | XP Necesaria | Beneficios |
|-------|--------------|------------|
| Iniciada | 0 | Lecturas básicas |
| Aprendiz | 100 | +Lecturas estándar |
| Guardiana | 500 | +Premium, 5% desc |
| Maestra | 1500 | +Ultra, 10% desc |
| Sabia | 4000 | Todo, 15% desc |

## 4.4 Sistema de Rachas

| Día | Recompensa |
|-----|------------|
| 7 | +15 runas |
| 14 | +30 runas |
| 30 | +75 runas + lectura gratis |
| 60 | +150 runas |
| 100 | +300 runas + badge |

## 4.5 Catálogo de Lecturas

**Básicas (15-30 runas) - Nivel Iniciada:**
- Consejo del Bosque: 15 runas
- Susurro del Guardián: 20 runas
- Tirada de 3 Runas: 25 runas
- Energía del Día: 15 runas

**Estándar (40-75 runas) - Nivel Aprendiz:**
- Tirada de 5 Runas: 40 runas
- Oráculo de los Elementales: 50 runas
- Mensaje de tu Guardián: 45 runas (requiere guardián)

**Premium (100-150 runas) - Nivel Guardiana:**
- Tirada de 7 Runas: 100 runas
- Lectura de Tarot Profunda: 120 runas
- Conexión con tu Guardián: 110 runas (requiere guardián)

**Ultra Premium (200-400 runas) - Nivel Maestra:**
- Estudio del Alma: 200 runas
- Mapa de Vidas Pasadas: 300 runas
- Gran Estudio Anual: 400 runas

## 4.6 APIs de Gamificación Creadas

- ✅ `lib/gamificacion/config.js` - Configuración central (747 líneas)
- ✅ `app/api/gamificacion/usuario/route.js` - GET/POST datos
- ✅ `app/api/gamificacion/cofre-diario/route.js` - Sistema de cofre
- ✅ `app/api/gamificacion/lecturas/route.js` - Catálogo
- ✅ `app/api/gamificacion/ejecutar-lectura/route.js` - Ejecutar lectura
- ✅ `app/api/webhooks/woocommerce/route.js` - Webhook actualizado

---

# PARTE 5: MOTOR DE SINCRONICIDAD PERSONALIZADA

## 5.1 Señales Mágicas Basadas en Datos

**Estado:** 🔴 Por implementar

**Datos a usar:**
- Nombre del usuario (cantidad de letras, inicial)
- Fecha de nacimiento (signo, números)
- Día y hora de visita
- País/ubicación
- Si volvió a la página

**Ejemplos de sincronicidades:**
```javascript
// Por día de la semana
if (diaSemana === "martes") {
  "Los martes son días de Marte, de acción. No es casualidad que estés acá hoy."
}

// Por nombre
if (nombreUsuario.length === nombreGuardian.length) {
  `Tu nombre y el de ${guardian} tienen ${n} letras. Los números no mienten.`
}

// Por cumpleaños
if (cumpleañosEsteMes) {
  "Este mes es tu portal. Los guardianes que aparecen cerca de tu cumpleaños vienen con mensajes especiales."
}

// Por comportamiento
if (volvioAPagina) {
  "Volviste. Algo te trajo de nuevo. Eso tiene un nombre: reconocimiento."
}
```

**Archivos a crear:**
- `/lib/sincronicidad.js` - Motor de generación
- `/api/sincronicidad/route.js` - Endpoint
- Integración en emails y Tito

---

# PARTE 6: PÁGINAS WEB Y SISTEMA

## 6.1 Sistema de Precios con Geolocalización

**Estado:** 🔴 Por implementar
**Plugin actual:** Curcy

**Lógica:**
```
SI país = Uruguay → Mostrar precio en PESOS URUGUAYOS
SI país = Otro    → Mostrar precio en DÓLARES + (aproximadamente X en tu moneda)
```

**Requisitos:**
1. Geolocalización automática por IP
2. Conversión de monedas actualizada 1x/día
3. FAQ en cada producto explicando el proceso

## 6.2 Páginas Principales

### Homepage
**Estado:** ✅ Activa
**Secciones:**
1. Hero - Video de fondo con duende en bosque
2. Test del Guardián - "¿Qué Duende Te Está Buscando?"
3. Categorías - "Elegí Según Tu Intención"
4. ¿Qué Es Un Duende Canalizado? - 4 cards explicativas
5. ¿Cómo Reconocer a Tu Duende? - Carrusel de pasos
6. Lo Que Incluye Tu Duende
7. Piriápolis - Sección sobre la ciudad alquimista
8. Testimonios
9. Comparativa
10. Pagos y Envíos
11. El Grimorio - Blog
12. Footer

### Página "Nosotros"
**Estado:** 🟡 Requiere rediseño

**Nueva estructura:**
1. ESPEJO - "¿Alguna vez sentiste que faltaba algo?"
2. HISTORIA - Cómo nacieron los Duendes del Uruguay
3. VALIDACIÓN - "Lo que sentís es real"
4. QUIÉNES SOMOS - Thibisay y el equipo
5. MISIÓN - No vendemos muñecos, creamos compañeros
6. PRUEBA SOCIAL - Testimonios estratégicos
7. CTA - Test del Guardián

### Página "Cómo Funciona"
**Estado:** 🟡 Requiere análisis

**Secciones necesarias:**
1. EL PROCESO (4 pasos)
2. PREGUNTAS FRECUENTES
3. TESTIMONIOS estratégicos
4. CTA → Test del Guardián

### El Círculo de Duendes
**Estado:** 🟡 Verificar alineación
**Ubicación:** `/app/circulo/`

### Mi Magia (Portal del Cliente)
**Estado:** 🟡 Avanzado
**Ubicación:** `/app/mi-magia/`

**Componentes implementados:**
- ✅ Test del Guardián
- ✅ Cofre Diario
- ✅ Catálogo de Lecturas Gamificado
- ✅ Tienda de Runas
- 🟡 Tito personalizado
- 🟡 Historial de compras

---

# PARTE 7: SISTEMA POST-COMPRA

## 7.1 Secuencia Completa

**Estado:** 🔴 Por implementar

```
COMPRA
  ↓
INMEDIATO: Email confirmación + "Tu guardián está siendo preparado"
  ↓
24 HORAS: Certificado de Canalización Original (digital)
  ↓
ENVÍO: "Tu guardián comenzó su viaje" + tracking DHL
  ↓
ENTREGA: "Llegó. Ritual de activación"
  ↓
DÍA 3: "¿Ya notaste algo diferente?" + Diario de señales
  ↓
DÍA 7: "Una semana juntos" + Pedir testimonio
  ↓
DÍA 14: "Tu guardián quiere presentarte a alguien" + Cross-sell
  ↓
DÍA 30: Invitación al Círculo
  ↓
CUMPLEAÑOS: Email especial + descuento + regalo
```

## 7.2 Emails del Sistema

| Momento | Email | Personalización |
|---------|-------|-----------------|
| Test completado | "Tu perfil energético" | Según perfil detectado |
| Carrito abandonado 1h | "Sigue disponible" | Nombre del guardián |
| Carrito abandonado 24h | "No todos están listos" | Cierre según perfil |
| Carrito abandonado 72h | "Alguien más lo mira" | Escasez social |
| Compra confirmada | "Tu guardián te eligió" | Datos del pedido |
| Enviado | "Comenzó el viaje" | Tracking DHL |
| Entregado | "Ritual de activación" | Instrucciones |
| Día 3 | "Diario de señales" | Template |
| Día 7 | "Una semana juntos" | Pedir testimonio |
| Día 14 | "Quiere presentarte a alguien" | Cross-sell |
| Día 30 | "El Círculo te espera" | Upsell membresía |
| Cumpleaños | "Hoy es tu portal" | Descuento + regalo |

## 7.3 Certificado de Canalización

**Formato:** PDF digital descargable
**Contenido:**
- Nombre del guardián
- Nombre del humano elegido
- Fecha de canalización
- Historia/mensaje del guardián
- Firma de Thibisay
- Número único de certificado
- QR que lleva a Mi Magia

---

# PARTE 8: TITO - EL DUENDE IA

## 8.1 Tito Web Principal

**Estado:** 🟡 Existe, requiere entrenamiento
**Integración:** ManyChat + API propia

**Flujos principales:**
```
NUEVO VISITANTE
├── "Hola! Soy Tito. ¿Primera vez acá?"
├── SI → Guiar al Test del Guardián
└── NO → "¿Qué guardián te trajo de vuelta?"

INTERÉS EN PRODUCTO
├── Mostrar foto del guardián
├── Contar algo breve de su historia
├── "¿Querés saber si es para vos?" → Test
└── Link directo al producto

YA COMPRÓ
├── Detectar por email
├── "¿Cómo va todo con [nombre guardián]?"
└── Resolver dudas post-compra
```

**REGLA ANTI-PSICÓLOGO:**
```
Si > 5 mensajes personales sin mención de producto:
  "Entiendo que estás pasando por mucho.
   Te comparto algo: el Test del Guardián ayuda a muchas
   personas a entender qué necesitan. ¿Lo hacemos?"

Si sigue sin hacer test después de 3 intentos:
  "Voy a estar acá cuando lo necesites."
  [Fin conversación activa]
```

## 8.2 Tito Mi Magia (para clientes)

**Estado:** 🟡 Existe
- Acceso a ficha del cliente
- Sabe qué guardianes tiene
- Sabe su perfil psicológico
- Puede dar lecturas de runas

## 8.3 ManyChat - Flujos

**Plataformas:** Instagram, Facebook, WhatsApp Business

**Flujo principal IG/FB:**
```
COMENTARIO EN POST
├── Respuesta automática con gancho
├── "¿Querés saber más de [guardián]?"
├── SI → Link a producto + invitar al test
└── NO → "Dale! Si cambias de idea..."
```

**WhatsApp Business:**
- Número nuevo (el original da error en API)
- Mensajes de confirmación de pedido
- Updates de envío
- Atención post-compra

---

# PARTE 9: GENERADOR DE HISTORIAS

## 9.1 Sistema Experto de Conversión

**Estado:** ✅ Funcionando
**Ubicación:** `/admin/generador-historias`
**API:** `/api/admin/historias`

**Módulos en `/lib/conversion/`:**
| Módulo | Propósito |
|--------|-----------|
| `hooks.js` | Biblioteca de hooks de apertura por categoría |
| `sincrodestinos.js` | Base de eventos "mágicos" durante creación |
| `cierres.js` | Cierres personalizados según perfil psicológico |
| `arco.js` | Estructura y validación del arco emocional |
| `scoring.js` | Sistema de scoring de conversión (0-50 pts) |

## 9.2 Arco Emocional (8 fases)

| # | Fase | Objetivo |
|---|------|----------|
| 1 | Espejo | El lector se ve reflejado |
| 2 | Herida | Tocar el dolor sin nombrarlo |
| 3 | Validación | "No estás loca" |
| 4 | Esperanza | Posibilidad de cambio |
| 5 | Solución | El guardián como respuesta |
| 6 | Prueba | Evidencia tangible |
| 7 | Puente | Conexión personal |
| 8 | Decisión | Llamado a acción sin presión |

**Score mínimo aceptable: 30/50**
**Arco mínimo: 75% de fases presentes**

---

# PARTE 10: MIGRACIÓN DE DOMINIO

## 10.1 Estado Actual

| Paso | Estado | Notas |
|------|--------|-------|
| DNS en Wix configurado | ✅ LISTO | A record → 34.70.139.72 |
| DNS propagado | ✅ LISTO | Verificado |
| Redirects Wix→WP instalados | ✅ LISTO | Plugin activo |
| 10Web detecta dominio | ✅ POINTED | Reconoce correctamente |
| Make Primary | ⏳ PENDIENTE | Esperando terminar sitio |
| SSL generado | ⏳ PENDIENTE | Hacer después de Make Primary |
| URLs WordPress actualizadas | ⏳ PENDIENTE | Después del SSL |

## 10.2 URLs Migradas de Wix

**Páginas principales:** 17 URLs mapeadas
**Productos:** 62 productos con redirects configurados

**Redirects críticos:**
```
/shop-1 → /shop/
/stock → /shop/
/product-page/* → /product/*
/formulario-de-duende-maestro → /descubri-que-duende-te-elige/
```

## 10.3 Próximos Pasos de Migración

1. En 10Web → Domains → **Make Primary**
2. En 10Web → Tools → SSL → **Generate Free SSL**
3. Cambiar URLs de WordPress automáticamente
4. Verificar propiedad en Google Search Console
5. Enviar sitemap nuevo

---

# PARTE 11: INTEGRACIONES TÉCNICAS

## 11.1 Credenciales y Accesos

### WordPress (10Web)
```
URL Admin: duendesuy.10web.cloud/wp-admin
URL Producción: duendesdeluruguay.com
Tienda: duendesuy.10web.cloud/shop/
Test del Guardián: duendesuy.10web.cloud/descubri-que-duende-te-elige/
```

### SFTP (MU-Plugins)
```
Host: 34.70.139.72
Puerto: 55309
Usuario: sftp_live_WfP6i
Password: JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR
Ruta: web/wp-live/wp-content/mu-plugins/
```

### Vercel
```
URL: https://duendes-vercel.vercel.app/
Mi Magia: https://duendes-vercel.vercel.app/mi-magia?token=TEST123
Repo Git: https://github.com/tbrylka89-sudo/duendes-canalizacion.git
```

### API Keys
```
DUENDES_REMOTE_SECRET: duendes_vercel_2026_secretkey_XkJ9mN2pL5qR8sT1
INSIGHTS_API_KEY: duendes-insights-2024
```

### Base de datos WordPress
```
Host: mysql.10web.site
Usuario: live_user_7O9A8
Password: tNsQGgf2PFHRNv9hAZ7TPjmHXHkTnPXKQI
DB: live_7O9A8
```

## 11.2 Plugins MU Activos en WordPress

```
/wp-content/mu-plugins/
├── test-guardian-v11.php - Test del Guardián con perfilado
├── duendes-neuromarketing.php - CSS/JS neuromarketing
├── duendes-fixes-master.php - Fixes generales
├── duendes-experiencia-magica.php - Template producto
├── duendes-remote-control.php - API REST control remoto
├── duendes-mi-magia.php - Shortcodes Mi Magia
├── duendes-cart-checkout.php - Checkout personalizado
├── duendes-canalizaciones-admin.php - Admin de canalizaciones
├── duendes-redirects-wix.php - Redirects de Wix
```

## 11.3 DHL Express API

**Estado:** 🟡 Conectada pero no funciona en checkout

**Por hacer:**
- Verificar credenciales API
- Verificar plugin de DHL activo
- Configurar zonas de envío en WooCommerce
- Testear con dirección real

## 11.4 SEO con Rank Math

**Estado:** 🔴 Requiere configuración

**Por hacer:**
- Configurar plantillas automáticas de meta títulos
- Configurar plantillas de meta descripciones
- Schema markup para productos
- Sitemap automático
- Redirecciones 301 automáticas

## 11.5 APIs Disponibles/Necesarias

| Servicio | Uso | Estado |
|----------|-----|--------|
| Claude API | Contenido, análisis, chat | ✅ Activo |
| ElevenLabs | Voces de guardianes | ✅ Activo |
| OpenAI DALL-E | Generación de imágenes | ✅ Activo |
| Resend | Emails transaccionales | ✅ Activo |
| Vercel KV | Base de datos | ✅ Activo |
| Stripe | Pagos, suscripciones | 🔴 Por configurar |
| Cloudinary | Upload de fotos | 🟡 Por considerar |
| PostHog | Analytics de comportamiento | 🟡 Por considerar |

---

# PARTE 12: VISIÓN 2026 - FUTURO

## 12.1 Sistema de Análisis Visual con Claude Vision

**Cuando el usuario sube su foto:**
```javascript
{
  expresion_dominante: "contemplativa",
  energia_percibida: "agua - fluida, sensible",
  tension_areas: ["mandíbula", "entrecejo"],
  apertura_emocional: 0.7,
  mensaje_inicial: "Veo a alguien que carga más de lo que muestra..."
}
```

## 12.2 Motor de Canalizaciones Inteligente

```
ENTRADA                    PROCESAMIENTO                 SALIDA
────────                   ──────────────                ──────

Foto rostro ──────┐
                  │        ┌──────────────┐
Foto mano ────────┼───────▶│   CLAUDE     │
                  │        │   VISION     │
Formulario ───────┤        │  + ANÁLISIS  │
                  │        └──────┬───────┘
Historial ────────┘               │
                                  ▼
                          ┌──────────────┐      ┌────────────────┐
                          │   MATCHING   │─────▶│  CANALIZACIÓN  │
                          │  GUARDIANES  │      │  PERSONALIZADA │
                          └──────────────┘      └────────────────┘
```

## 12.3 Automatizaciones Futuras

```
COMPRA NUEVA
    ├──▶ Email de bienvenida (inmediato)
    ├──▶ Email "Tu canalización está lista"
    ├──▶ Email de seguimiento (3 días)
    └──▶ Email de reconexión (14 días)

CARRITO ABANDONADO
    ├──▶ Email 1 hora después
    └──▶ Email 24 horas después (con descuento)

LUNA LLENA
    └──▶ Email a toda la base con ritual especial
```

## 12.4 Métricas de Éxito

| Métrica | Objetivo |
|---------|----------|
| Conversión visita → compra | >3% |
| Retención Círculo | >70% mes a mes |
| NPS (satisfacción) | >70 |
| Tasa de recompra | >40% en 90 días |
| Tiempo en sitio | >5 minutos |

---

# PARTE 13: ESTÉTICA Y VOZ

## 13.1 Estética Obligatoria

```
✅ Fondo: Negro profundo (#050508 o #0a0a0a)
✅ Texto: Blanco suave (#ffffff, #e0e0e0)
✅ Glow/borde: AZUL NEÓN (#00a8ff)
✅ Botones: fondo negro/transparente + borde azul + texto blanco
✅ Paleta secundaria: oro (#c9a227) + verde oscuro + crema

❌ PROHIBIDO: botones verdes
❌ PROHIBIDO: colores pastel o gradientes colorinches
```

## 13.2 Voz de Marca - Thibisay

**Cómo habla:**
- Español rioplatense (vos, tenés, podés)
- Cercana pero no infantil
- Sabia pero no pedante
- Mística pero con los pies en la tierra
- Cálida, como una amiga que sabe cosas

**Nunca:**
- Condescendiente
- Excesivamente formal
- Fría o distante
- Predicadora o moralizante

## 13.3 Frases de IA Prohibidas

```
❌ "Desde las profundidades..."
❌ "Brumas ancestrales..."
❌ "Velo entre mundos..."
❌ "Tiempos inmemoriales..."
❌ "Susurro del viento..."
❌ "Danza de las hojas..."
❌ "Vibraciones cósmicas..."
❌ "Campo energético..."
❌ "847 años" (número prohibido)
❌ "Acantilados de Irlanda" (genérico)
❌ "Bosques de Escocia" (genérico)
```

---

# PARTE 14: ORDEN DE IMPLEMENTACIÓN

## PRIORIDAD 1 - INMEDIATO

| Tarea | Estado | Impacto |
|-------|--------|---------|
| Test del Guardián v11 WordPress | ✅ Creado | ALTO |
| Cierres adaptativos | ✅ Hecho | ALTO |
| APIs gamificación | ✅ Hecho | ALTO |
| Verificar formulario checkout | 🔴 Pendiente | ALTO |
| Emails carrito abandonado | 🔴 Pendiente | ALTO |

## PRIORIDAD 2 - ESTA SEMANA

| Tarea | Estado | Impacto |
|-------|--------|---------|
| Motor de sincronicidad | 🔴 Pendiente | ALTO |
| Precios con geolocalización | 🔴 Pendiente | ALTO |
| Tito ManyChat entrenado | 🔴 Pendiente | MEDIO |
| DHL funcionando | 🔴 Pendiente | MEDIO |
| Activar Make Primary dominio | ⏳ Esperando | ALTO |

## PRIORIDAD 3 - PRÓXIMAS 2 SEMANAS

| Tarea | Estado | Impacto |
|-------|--------|---------|
| Secuencia post-compra completa | 🔴 Pendiente | ALTO |
| Certificado digital | 🔴 Pendiente | MEDIO |
| Página Nosotros rediseño | 🔴 Pendiente | MEDIO |
| SEO automático Rank Math | 🔴 Pendiente | MEDIO |
| Productos WooCommerce runas | 🔴 Pendiente | MEDIO |

## PRIORIDAD 4 - MES

| Tarea | Estado | Impacto |
|-------|--------|---------|
| Dashboard analytics | 🔴 Pendiente | MEDIO |
| A/B testing | 🔴 Pendiente | MEDIO |
| Claude Vision para fotos | 🔴 Pendiente | BAJO |
| Limpieza código | 🔴 Pendiente | BAJO |

---

# PARTE 15: COMANDOS DE TERMINAL

## 16.1 Subir archivo a WordPress (SFTP)

```bash
expect << 'EOF'
spawn sftp -o StrictHostKeyChecking=no -P 55309 sftp_live_WfP6i@34.70.139.72
expect "password:"
send "JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR\r"
expect "sftp>"
send "cd web/wp-live/wp-content/mu-plugins\r"
expect "sftp>"
send "put /ruta/local/archivo.php\r"
expect "sftp>"
send "bye\r"
expect eof
EOF
```

## 16.2 Verificar estado del sitio

```bash
# Verificar que el sitio carga
curl -s -o /dev/null -w "%{http_code}" "https://duendesuy.10web.cloud/"

# Verificar tienda
curl -s -o /dev/null -w "%{http_code}" "https://duendesuy.10web.cloud/shop/"

# Verificar test del guardián
curl -s -o /dev/null -w "%{http_code}" "https://duendesuy.10web.cloud/descubri-que-duende-te-elige/"
```

## 16.3 Ver versión del Test del Guardián

```bash
# Ver si HTML se genera (debería mostrar "tg-portal"):
curl -s "https://duendesuy.10web.cloud/descubri-que-duende-te-elige/?v=$(date +%s)" | grep -o 'tg-portal'

# Ver qué versión se sirve:
curl -s "https://duendesuy.10web.cloud/descubri-que-duende-te-elige/?v=$(date +%s)" | grep -o 'TEST GUARDIAN v[0-9]\|tg-portal'
```

## 16.4 Limpiar caché de WordPress

```bash
# Limpiar caché via API REST
curl -X POST "https://duendesuy.10web.cloud/wp-json/duendes/v1/cache" \
  -H "X-Duendes-Secret: duendes_vercel_2026_secretkey_XkJ9mN2pL5qR8sT1"
```

## 16.5 Verificar propagación DNS

```bash
# Verificar DNS con Google
dig @8.8.8.8 duendesdeluruguay.com A

# Verificar DNS con Cloudflare
dig @1.1.1.1 duendesdeluruguay.com A

# Ver todos los registros
dig duendesdeluruguay.com ANY
```

## 16.6 Probar APIs de Vercel

```bash
# Newsletter Subscribe
curl -X POST "https://duendes-vercel.vercel.app/api/newsletter/subscribe" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "source": "test-guardian"}'

# Test Guardian Save
curl -X POST "https://duendes-vercel.vercel.app/api/test-guardian/save" \
  -H "Content-Type: application/json" \
  -d '{"identity": {}, "answers": {}, "contact": {}}'

# Test Guardian Insights
curl "https://duendes-vercel.vercel.app/api/test-guardian/insights?key=duendes-insights-2024"

# Gamificación - Usuario
curl "https://duendes-vercel.vercel.app/api/gamificacion/usuario?email=test@test.com"

# Gamificación - Cofre Diario
curl -X POST "https://duendes-vercel.vercel.app/api/gamificacion/cofre-diario" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com"}'

# Gamificación - Catálogo Lecturas
curl "https://duendes-vercel.vercel.app/api/gamificacion/lecturas?email=test@test.com"
```

## 16.7 Deploy a Vercel

```bash
# Desde el directorio del proyecto
cd /Users/usuario/Desktop/duendes-vercel

# Deploy a producción
vercel --prod

# Deploy preview
vercel

# Ver logs
vercel logs duendes-vercel.vercel.app
```

## 16.8 Git - Operaciones comunes

```bash
# Ver estado
git status

# Ver cambios
git diff

# Agregar todo y commitear
git add . && git commit -m "Mensaje del commit"

# Push a origen
git push origin main

# Pull cambios
git pull origin main
```

## 16.9 Conectar a base de datos WordPress

```bash
# MySQL desde terminal (requiere mysql-client)
mysql -h mysql.10web.site -u live_user_7O9A8 -p live_7O9A8
# Password: tNsQGgf2PFHRNv9hAZ7TPjmHXHkTnPXKQI
```

## 16.10 Listar plugins MU en WordPress

```bash
# Via SFTP - listar archivos
expect << 'EOF'
spawn sftp -o StrictHostKeyChecking=no -P 55309 sftp_live_WfP6i@34.70.139.72
expect "password:"
send "JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR\r"
expect "sftp>"
send "cd web/wp-live/wp-content/mu-plugins\r"
expect "sftp>"
send "ls -la\r"
expect "sftp>"
send "bye\r"
expect eof
EOF
```

## 16.11 Descargar archivo de WordPress

```bash
# Descargar un plugin específico
expect << 'EOF'
spawn sftp -o StrictHostKeyChecking=no -P 55309 sftp_live_WfP6i@34.70.139.72
expect "password:"
send "JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR\r"
expect "sftp>"
send "cd web/wp-live/wp-content/mu-plugins\r"
expect "sftp>"
send "get nombre-archivo.php /Users/usuario/Desktop/\r"
expect "sftp>"
send "bye\r"
expect eof
EOF
```

## 16.12 Verificar Webhook WooCommerce

```bash
# Simular webhook de WooCommerce (para testing)
curl -X POST "https://duendes-vercel.vercel.app/api/webhooks/woocommerce" \
  -H "Content-Type: application/json" \
  -H "X-WC-Webhook-Topic: order.completed" \
  -d '{
    "id": 12345,
    "billing": {"email": "test@test.com", "first_name": "Test"},
    "line_items": [{"name": "Guardian Test", "sku": "GUARDIAN-001"}],
    "total": "55.00"
  }'
```

---

# PARTE 16: GUÍAS DE IMPLEMENTACIÓN PASO A PASO

## 17.1 Subir Test Guardian v11 a WordPress

**Contexto:** El test-guardian-v11.php tiene las 12 preguntas con perfilado psicológico.

```bash
# 1. Ir al directorio del proyecto
cd /Users/usuario/Desktop/duendes-vercel

# 2. Verificar que el archivo existe
ls -la wordpress-plugins/test-guardian-v11.php

# 3. Subir a WordPress
expect << 'EOF'
spawn sftp -o StrictHostKeyChecking=no -P 55309 sftp_live_WfP6i@34.70.139.72
expect "password:"
send "JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR\r"
expect "sftp>"
send "cd web/wp-live/wp-content/mu-plugins\r"
expect "sftp>"
send "put wordpress-plugins/test-guardian-v11.php\r"
expect "sftp>"
send "bye\r"
expect eof
EOF

# 4. Limpiar caché
curl -X POST "https://duendesuy.10web.cloud/wp-json/duendes/v1/cache" \
  -H "X-Duendes-Secret: duendes_vercel_2026_secretkey_XkJ9mN2pL5qR8sT1"

# 5. Verificar que carga
curl -s "https://duendesuy.10web.cloud/descubri-que-duende-te-elige/?v=$(date +%s)" | grep -o 'tg-portal'
```

## 17.2 Activar Dominio Principal (Make Primary)

**Contexto:** El DNS ya apunta a 10Web. Falta activar el dominio como primario.

```
PASOS MANUALES (en browser):

1. Ir a: https://my.10web.io/websites/1453202/domains
2. Buscar "duendesdeluruguay.com" en la lista
3. Click en los 3 puntitos (⋮)
4. Seleccionar "Make Primary"
5. Confirmar

DESPUÉS - Generar SSL:
1. En 10Web → Tools → SSL
2. Click "Generate Free SSL"
3. Seleccionar duendesdeluruguay.com
4. Click "Apply"
5. Esperar 5-10 minutos

DESPUÉS - Verificar:
```
```bash
# Verificar que el sitio carga con HTTPS
curl -s -o /dev/null -w "%{http_code}" "https://www.duendesdeluruguay.com/"

# Verificar certificado SSL
openssl s_client -connect www.duendesdeluruguay.com:443 -servername www.duendesdeluruguay.com 2>/dev/null | openssl x509 -noout -dates
```

## 17.3 Crear Motor de Sincronicidad

**Contexto:** Sistema que genera "señales mágicas" basadas en datos del usuario.

```bash
# 1. Crear el archivo de librería
cd /Users/usuario/Desktop/duendes-vercel

# 2. El archivo debe crearse en:
# /lib/sincronicidad.js

# 3. El endpoint debe crearse en:
# /app/api/sincronicidad/route.js

# 4. Después de crear, deploy a Vercel:
vercel --prod

# 5. Probar:
curl "https://duendes-vercel.vercel.app/api/sincronicidad?nombre=Maria&fecha_nacimiento=1985-03-15&guardian=Thornwood"
```

**Estructura del archivo `/lib/sincronicidad.js`:**
```javascript
// Tipos de sincronicidades
// - Por día de la semana (lunes=luna, martes=marte, etc.)
// - Por nombre (cantidad de letras, inicial)
// - Por fecha nacimiento (signo, números maestros)
// - Por comportamiento (volvió a la página, tiempo en sitio)
// - Por hora del día (madrugada, amanecer, etc.)
```

## 17.4 Configurar Emails de Carrito Abandonado

**Contexto:** WooCommerce puede enviar emails automáticos. Necesita configuración.

```
OPCIÓN A - Plugin WooCommerce:

1. En WordPress Admin → Plugins → Añadir nuevo
2. Buscar "AutomateWoo" o "Abandoned Cart for WooCommerce"
3. Instalar y activar
4. Configurar secuencia:
   - 1 hora: "Tu guardián sigue esperándote"
   - 24 horas: "No todos están listos" + cierre según perfil
   - 72 horas: "Alguien más lo está mirando"

OPCIÓN B - Via API Vercel (más control):

1. Crear endpoint: /app/api/emails/carrito-abandonado/route.js
2. WooCommerce webhook dispara cuando se abandona carrito
3. Endpoint programa emails con Resend
```

## 17.5 Configurar DHL Express

**Contexto:** El plugin está instalado pero no aparece en checkout.

```
PASOS MANUALES (en WordPress Admin):

1. Ir a: WooCommerce → Configuración → Envío
2. Verificar que existe zona "Internacional" o "Resto del mundo"
3. Dentro de la zona, agregar método "DHL Express"
4. Configurar credenciales DHL:
   - Site ID
   - Password
   - Account Number
5. En "Métodos de envío" → DHL Express → Habilitar
6. Probar con checkout real
```

```bash
# Verificar que el plugin de DHL está activo
curl -s "https://duendesuy.10web.cloud/wp-json/wc/v3/shipping/zones" \
  -u "consumer_key:consumer_secret"
```

## 17.6 Configurar SEO con Rank Math

**Contexto:** Necesita plantillas automáticas para que cada producto tenga SEO perfecto.

```
PASOS MANUALES (en WordPress Admin):

1. Ir a: Rank Math → Títulos y Meta
2. En "Productos":
   - Título: %title% | Guardián Canalizado | Duendes del Uruguay
   - Descripción: Conocé a %title%, tu nuevo guardián canalizado. %excerpt%
3. En "Categorías de producto":
   - Título: Guardianes de %term% | Duendes del Uruguay
4. En "General":
   - Habilitar Schema automático para productos
5. Ir a: Rank Math → Mapa del sitio
   - Verificar que productos están incluidos
   - Excluir páginas innecesarias

VERIFICAR:
```
```bash
# Ver si sitemap existe
curl -s "https://duendesuy.10web.cloud/sitemap_index.xml" | head -20

# Enviar a Google Search Console
# 1. Ir a https://search.google.com/search-console
# 2. Agregar propiedad: duendesdeluruguay.com
# 3. Verificar con DNS TXT record
# 4. Ir a Sitemaps → Agregar: sitemap_index.xml
```

## 17.7 Crear Productos de Runas en WooCommerce

**Contexto:** Los paquetes de runas necesitan existir como productos virtuales.

```
CREAR VIA WP-CLI (si está disponible):
```
```bash
# Conectar por SSH (si 10Web lo permite) o hacer manualmente:

# MANUAL en WordPress Admin:
# 1. Productos → Añadir nuevo
# 2. Crear 5 productos virtuales:

# Producto 1:
# - Nombre: Paquete Chispa - 30 Runas
# - Precio: $5
# - SKU: RUNAS-30
# - Virtual: Sí
# - Categoría: Runas

# Producto 2:
# - Nombre: Paquete Destello - 80 Runas (+10 bonus)
# - Precio: $10
# - SKU: RUNAS-80
# - Virtual: Sí

# ... repetir para los 5 paquetes
```

## 17.8 Verificar y Testear Todo el Sistema

```bash
# === TEST COMPLETO DEL SISTEMA ===

# 1. Verificar sitio WordPress
echo "=== WordPress ==="
curl -s -o /dev/null -w "Homepage: %{http_code}\n" "https://duendesuy.10web.cloud/"
curl -s -o /dev/null -w "Tienda: %{http_code}\n" "https://duendesuy.10web.cloud/shop/"
curl -s -o /dev/null -w "Test: %{http_code}\n" "https://duendesuy.10web.cloud/descubri-que-duende-te-elige/"

# 2. Verificar APIs Vercel
echo "=== APIs Vercel ==="
curl -s -o /dev/null -w "Newsletter: %{http_code}\n" "https://duendes-vercel.vercel.app/api/newsletter/subscribe" -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com"}'
curl -s -o /dev/null -w "Gamificación: %{http_code}\n" "https://duendes-vercel.vercel.app/api/gamificacion/usuario?email=test@test.com"
curl -s -o /dev/null -w "Lecturas: %{http_code}\n" "https://duendes-vercel.vercel.app/api/gamificacion/lecturas?email=test@test.com"

# 3. Verificar Mi Magia
echo "=== Mi Magia ==="
curl -s -o /dev/null -w "Portal: %{http_code}\n" "https://duendes-vercel.vercel.app/mi-magia"

# 4. Verificar DNS del dominio principal
echo "=== DNS ==="
dig +short duendesdeluruguay.com A

echo "=== TESTS COMPLETADOS ==="
```

---

# PARTE 17: REGLAS DE ORO

1. **La historia del guardián es FIJA** - Todos ven la misma
2. **La personalización es PRIVADA** - Emails, cierres, sincronicidades
3. **Nunca parecer vendedor** - Todo es sutil, emocional, íntimo
4. **Escasez real > escasez falsa** - Mejor menos pero creíble
5. **El usuario se vende solo** - Nosotros solo guiamos
6. **Tito no es psicólogo** - Guía a conversión, no a terapia
7. **Todo conectado** - Cada acción alimenta el perfil
8. **Medir todo** - Lo que no se mide no se mejora
9. **El guardián elige, no al revés** - Concepto central de la marca
10. **Cada duende es único** - Si se vende, no vuelve (FOMO real)

---

# PARTE 18: ESTRUCTURA DEL PROYECTO

## Estructura del Proyecto

```
/Users/usuario/Desktop/duendes-vercel/
├── app/
│   ├── mi-magia/           # Portal de usuario
│   │   ├── page.jsx        # Página principal
│   │   └── test-guardian.js # Componente del test
│   ├── circulo/            # Área de membresía
│   ├── admin/
│   │   └── generador-historias/ # Generador de historias
│   └── api/
│       ├── test-guardian/  # API del test
│       ├── gamificacion/   # APIs de gamificación
│       ├── webhooks/       # Webhooks WooCommerce
│       ├── admin/historias/ # Generador de historias
│       └── newsletter/     # Suscripciones
├── lib/
│   ├── conversion/         # Sistema experto de conversión
│   │   ├── hooks.js
│   │   ├── sincrodestinos.js
│   │   ├── cierres.js
│   │   ├── arco.js
│   │   └── scoring.js
│   └── gamificacion/
│       └── config.js       # Configuración completa
├── wordpress-plugins/      # Plugins WordPress
│   ├── test-guardian-v11.php
│   └── ...
├── PLAN-MAESTRO-CONVERSION.md  # ESTE DOCUMENTO
├── CLAUDE.md               # Guía de voz y escritura
└── BIBLIA-HISTORIAS-GUARDIANES.md # Sistema de historias
```

---

# PARTE 19: DOCUMENTOS CONSOLIDADOS

Este documento UNIFICA y REEMPLAZA:
- ✅ ESTADO-PROYECTO-DUENDES.md (13 enero 2026)
- ✅ HANDOFF-CLAUDE-CODE.md (14 enero 2026)
- ✅ PROGRESO-GAMIFICACION.md (17 enero 2026)
- ✅ VISION_2026.md
- ✅ MIGRACION-DOMINIO.md (17 enero 2026)

**Este es el ÚNICO documento de referencia del proyecto.**

---

# ÍNDICE RÁPIDO

| Parte | Contenido |
|-------|-----------|
| 1 | Contexto y Estado Actual |
| 2 | Filosofía de Conversión |
| 3 | Sistema de Perfilado Psicológico |
| 4 | Sistema de Gamificación |
| 5 | Motor de Sincronicidad |
| 6 | Páginas Web y Sistema |
| 7 | Sistema Post-Compra |
| 8 | Tito - El Duende IA |
| 9 | Generador de Historias |
| 10 | Migración de Dominio |
| 11 | Integraciones Técnicas |
| 12 | Visión 2026 - Futuro |
| 13 | Estética y Voz |
| 14 | Orden de Implementación |
| 15 | **Comandos de Terminal** |
| 16 | **Guías de Implementación Paso a Paso** |
| 17 | Reglas de Oro |
| 18 | Estructura del Proyecto |
| 19 | Documentos Consolidados |

---

*Última actualización: 22 Enero 2026, 15:15*
*Este documento es la fuente única de verdad del sistema.*
