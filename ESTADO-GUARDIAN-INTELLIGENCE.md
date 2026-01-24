# 🧠 GUARDIAN INTELLIGENCE - ESTADO DEL DESARROLLO

**Última actualización:** 2026-01-21 04:00 (Uruguay)
**Desarrollador:** Claude Code
**Estado general:** EN PRUEBAS - Analizador y Generador v2 listos

---

## 📋 RESUMEN EJECUTIVO

Guardian Intelligence (GI) es el sistema de inteligencia artificial central de Duendes del Uruguay. Funciona como el "cerebro" que:
- Analiza y corrige historias de guardianes
- Genera contenido único y SEO optimizado
- Monitorea 24/7 que todo funcione
- Alerta cuando hay problemas
- Gestiona promociones y banners
- Implementa cross-selling inteligente
- Aprende y mejora continuamente

---

## 🔥 ACTUALIZACIÓN 21 ENERO 2026 - 04:00 AM

### Problema Detectado
El analizador daba 92/100 a historias que claramente estaban mal (repetitivas, con estructura rígida de template, headers tipo formulario). Era "una mentira más grande que las de Pinocho".

### Soluciones Implementadas

#### 1. Analizador v2 (`analyzer.js`)
Ahora detecta problemas REALES:
- `intro_robotica`: "Esta es X. Tiene Y años..." (penaliza -15)
- `estructura_rigida`: Headers como "QUÉ TE APORTA:", "CÓMO NACIÓ:" (penaliza -20)
- `listas_prohibidas`: Bullets en contenido emocional (penaliza -10)
- `frases_gastadas`: Frases repetidas entre productos (penaliza -5 c/u)
- `sincrodestino_gastado`: Mariposas, flores floreciendo, pétalos... (penaliza -15)
- `falta_mensaje_primera_persona`: Sin mensaje canalizado (penaliza -10)
- `falta_voseo`: Sin español rioplatense (penaliza -5)
- `falta_identificacion_cliente`: Sin "para quien" (penaliza -10)

**Resultado:** Puntajes pasaron de 92/100 falso a 24/100 real (122 de 123 con problemas)

#### 2. Generador v2 (`generator.js`)
- 6 estilos narrativos diferentes (reflexión, sincrodestino, mensaje, cliente, sensorial, diario)
- SIN headers rígidos - todo fluido
- Evita sincrodestinos gastados automáticamente
- Nueva función `corregirHistoria()` para arreglar historias existentes

#### 3. API de Corrección (`/api/guardian-intelligence/corregir`)
- POST con productId: corrige UN producto (modo preview o aplicar)
- POST sin productId: corrige los peores puntajes en batch
- GET: historial de correcciones

#### 4. Base de Productos (`productos-base.json`)
113 productos con datos REALES del PDF:
- Nombre, género, categoría, tamaño (cm), accesorios específicos

**Reglas de Unicidad:**
- Pixies: SIEMPRE únicas (no importa tamaño)
- Mini / Mini especial: Recreables
- Mediano en adelante: ÚNICOS
- Arquetipos históricos (Merlín, Morgana, Leprechaun, etc.): Recreables en cualquier tamaño, pero cada canalización es única

**Tipos de Seres (NO hay hadas):**
pixie, duende, duenda, leprechaun, bruja, brujo, vikingo, vikinga, elfo, chamán, sanadora, maestro, alma maestra, guerrero, guerrera, duende medicina

**Diferenciador de Marca:**
> "Cada guardián es canalizado de manera consciente y voluntaria. No es una artesanía - es un ser que elige nacer. Por eso elegimos este camino de canalización consciente hace 10 años."

### Prueba de Corrección
- Violeta (ID 4740): De 12 puntos → 77 puntos
- Problemas resueltos: 5 de 7

### Pendiente
- Correr correcciones en batch para todos los productos < 50 puntos
- Verificar que el generador use los datos reales de productos-base.json

---

## ✅ COMPLETADO

### 1. Diagnóstico del Sistema Existente
- [x] Titos funcionando: Chat, ManyChat, Admin, Memoria
- [x] Gamificación implementada: Cofre, runas, niveles, badges
- [x] Webhooks WooCommerce activos
- [x] Emails con Resend configurados (6 plantillas)
- [x] 30+ APIs de admin existentes

### 2. Arquitectura Guardian Intelligence
**Ubicación:** `/lib/guardian-intelligence/`

| Archivo | Función | Estado |
|---------|---------|--------|
| `config.js` | Configuración central, sincrodestinos, estructuras, SEO | ✅ Completo |
| `analyzer.js` | Analiza historias, detecta repeticiones, calcula puntajes | ✅ Completo |
| `generator.js` | Genera historias únicas con Claude, reescribe secciones, SEO | ✅ Completo |
| `monitor.js` | Monitor 24/7, verificaciones, alertas, saldos | ✅ Completo |
| `promotions.js` | Sistema de banners, promociones, emails promocionales | ✅ Completo |
| `cross-selling.js` | Sugerencias inteligentes, combos, estadísticas | ✅ Completo |
| `index.js` | Exportaciones centrales | ✅ Completo |

### 3. APIs de Guardian Intelligence
**Ubicación:** `/app/api/guardian-intelligence/`

| Endpoint | Método | Función | Estado |
|----------|--------|---------|--------|
| `/analyze` | POST | Analiza una o todas las historias | ✅ |
| `/analyze` | GET | Obtiene último análisis guardado | ✅ |
| `/generate` | POST | Genera historia única / reescribe sección | ✅ |
| `/generate` | GET | Estadísticas de generación | ✅ |
| `/seo` | POST | Genera y opcionalmente aplica SEO | ✅ |
| `/seo` | GET | Estado SEO de productos | ✅ |
| `/monitor` | GET | Estado del monitoreo, alertas, saldos | ✅ |
| `/monitor` | POST | Ejecutar monitoreo, toggle, leer alertas | ✅ |
| `/stats` | GET | Estadísticas completas del sistema | ✅ |
| `/stats` | POST | Registrar estadística | ✅ |
| `/toggle` | GET | Estado de funcionalidades | ✅ |
| `/toggle` | POST | Activar/desactivar funcionalidades | ✅ |
| `/promotions` | GET | Obtener promociones activas/todas/banner | ✅ |
| `/promotions` | POST | Crear, activar, eliminar promociones | ✅ |
| `/cross-selling` | GET | Sugerencias de productos relacionados | ✅ |
| `/cross-selling` | POST | Registrar interacciones de cross-selling | ✅ |
| `/corregir` | POST | Corrige historias (individual o batch) | ✅ |
| `/corregir` | GET | Historial de correcciones | ✅ |

### 4. CRON Job
**Archivo:** `/app/api/cron/guardian-intelligence/route.js`
**Frecuencia:** Cada 15 minutos
**Función:** Ejecuta monitoreo 24/7 automático

**vercel.json actualizado** con el nuevo cron.

### 5. Plugin WordPress
**Archivo:** `/wordpress-plugins/guardian-intelligence.php`

Incluye:
- [x] Panel de administración completo (menú "🧠 Inteligencia")
- [x] Dashboard con métricas y estado del sistema
- [x] Página de análisis de historias
- [x] Página de generación de contenido
- [x] Página de SEO automático
- [x] Página de configuración con toggles
- [x] Metabox en productos individuales
- [x] Botones de acción rápida
- [x] Diseño oscuro profesional acorde a la marca

### 6. Sistema de Promociones
- [x] Crear promociones con múltiples tipos (descuento, envío gratis, combo, temporada, fecha especial)
- [x] Activar/desactivar promociones
- [x] Generar banners HTML (horizontal, cuadrado, mini)
- [x] Generar emails promocionales
- [x] Rotación automática de banners
- [x] Estadísticas de uso (vistas, clicks, usos, ventas)
- [x] Detección de fechas especiales próximas

### 7. Sistema de Cross-Selling
- [x] Sugerencias basadas en categoría compatible
- [x] Sugerencias para carrito completo
- [x] Detección de combos
- [x] Widget HTML generado automáticamente
- [x] Registro de interacciones para aprendizaje
- [x] Estadísticas de conversión
- [x] Combinaciones más exitosas

---

## ⏳ PENDIENTE

### Corto Plazo
1. **Deploy a producción** - git push
2. **Correr análisis inicial** - Ver estado de las ~115 historias
3. **Activar plugin WP** - Subir a WordPress
4. **Crear primera promoción** - Probar sistema

### Mediano Plazo
1. **Corrección de historias problemáticas** - Las que tengan puntaje < 70
2. **Integración con Tito** - Que Tito aprenda de las ventas
3. **Contenido para redes** - Bajo aprobación

### Largo Plazo
1. **IA proactiva** - Sugerir nuevos guardianes faltantes
2. **Optimización por ventas** - Aprender qué sincrodestinos venden más
3. **A/B testing** - Probar diferentes versiones de historias

---

## 🎛️ FUNCIONALIDADES CONFIGURABLES

Se pueden activar/desactivar desde `/api/guardian-intelligence/toggle`:

| Funcionalidad | Default | Descripción |
|---------------|---------|-------------|
| `monitor_24_7` | ON | Monitoreo automático cada 15 min |
| `seo_automatico` | ON | Genera SEO al crear productos |
| `correccion_automatica` | OFF | Corrige sin aprobación |
| `alertas_whatsapp` | ON | Envía alertas críticas a WhatsApp |
| `alertas_email` | ON | Envía alertas por email |
| `cross_selling` | ON | Muestra productos relacionados |

---

## 📊 BASE DE CONOCIMIENTO

### Sincrodestinos Permitidos
Categorizados por tipo:
- **Animales**: Mariposas, gatos, colibríes, pájaros
- **Naturaleza**: Plantas, hongos, flores, tréboles
- **Clima**: Lluvia, arcoíris, tormentas
- **Objetos**: Monedas, fotos, cristales
- **Personas**: Llamadas, visitas, regalos
- **Tecnología**: Luces, radio, teléfono
- **Sueños**: Sueños reveladores

### Sincrodestinos PROHIBIDOS
- Nada que sea físicamente imposible
- Lluvia de objetos, levitación, voces de muñecos
- Cualquier fantasía de dibujos animados

### Estructuras Narrativas
7 formatos diferentes para variar:
- A: Clásica con secciones
- B: Narrativa fluida
- C: Mensaje primero
- D: Sincrodestino primero
- E: Carta del guardián
- F: Segunda persona
- G: Diario de canalización

---

## 🔔 SISTEMA DE ALERTAS

### Canales Configurados
- **Email**: duendesdeluruguay@gmail.com
- **WhatsApp**: +598 98 690 629 (solo urgentes)
- **Panel WP**: Todas las alertas

### Tipos de Alertas
- 🔴 **Crítico**: Servicio caído → WhatsApp + Email + Panel
- 🟡 **Alto**: Problema de calidad → Email + Panel
- 🟢 **Info**: Sugerencias → Solo Panel

### Verificaciones del Monitor
1. Tito Chat responde
2. WooCommerce conectado
3. Vercel KV funciona
4. WordPress online
5. Resend configurado

---

## 💰 COSTOS ESTIMADOS

### APIs por Mes (Nivel Moderado ~$100)
- Anthropic (Claude): ~$50-70
- OpenAI (backup): ~$10-20
- Resend: Incluido en plan
- Vercel: Plan Pro
- ElevenLabs: Según uso

### URLs para Verificar Saldos
- Anthropic: https://console.anthropic.com/settings/billing
- OpenAI: https://platform.openai.com/usage
- Vercel: https://vercel.com/duendes-del-uruguay/~/usage
- Resend: https://resend.com/emails
- Replicate: https://replicate.com/account/billing

---

## 🛠️ CÓMO USAR LAS APIs

### Analizar una historia
```javascript
POST /api/guardian-intelligence/analyze
{
  "modo": "individual",
  "producto": {
    "id": 123,
    "nombre": "Matheo",
    "descripcion": "Historia del guardián...",
    "accesorios": ["amatista", "capa verde"]
  }
}
```

### Generar historia nueva
```javascript
POST /api/guardian-intelligence/generate
{
  "accion": "generar",
  "datos": {
    "nombre": "Luna",
    "tipo": "pixie",
    "categoria": "amor",
    "genero": "F",
    "tamano": "mini",
    "accesorios": ["cuarzo rosa", "vestido blanco"]
  }
}
```

### Generar SEO
```javascript
POST /api/guardian-intelligence/seo
{
  "producto": {
    "id": 123,
    "nombre": "Matheo",
    "tipo": "duende",
    "categoria": "protección"
  },
  "aplicar": true  // Aplica directo a WooCommerce
}
```

### Toggle funcionalidades
```javascript
POST /api/guardian-intelligence/toggle
{
  "funcionalidad": "monitor_24_7",
  "activo": false
}
```

### Ejecutar monitoreo manual
```javascript
GET /api/guardian-intelligence/monitor?accion=ejecutar
```

### Crear promoción
```javascript
POST /api/guardian-intelligence/promotions
{
  "accion": "crear",
  "datos": {
    "tipo": "descuento",
    "titulo": "15% OFF en guardianes de protección",
    "porcentaje": 15,
    "categorias": ["proteccion"]
  }
}
```

### Obtener banner rotativo
```javascript
GET /api/guardian-intelligence/promotions?accion=banner
```

### Obtener sugerencias de cross-selling
```javascript
GET /api/guardian-intelligence/cross-selling?accion=sugerencias&producto_id=123
```

### Obtener sugerencias para carrito
```javascript
GET /api/guardian-intelligence/cross-selling?accion=carrito&carrito=123,456,789
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
duendes-vercel/
├── lib/
│   └── guardian-intelligence/
│       ├── config.js          # Configuración central
│       ├── analyzer.js        # Motor de análisis
│       ├── generator.js       # Motor de generación
│       ├── monitor.js         # Monitor 24/7
│       ├── promotions.js      # Sistema de promociones
│       ├── cross-selling.js   # Sistema de cross-selling
│       ├── productos-base.json # 113 productos con datos reales
│       └── index.js           # Exportaciones
│
├── app/api/guardian-intelligence/
│   ├── analyze/route.js       # Análisis de historias
│   ├── generate/route.js      # Generación de contenido
│   ├── seo/route.js           # SEO automático
│   ├── monitor/route.js       # Monitoreo y alertas
│   ├── stats/route.js         # Estadísticas
│   ├── toggle/route.js        # On/Off funcionalidades
│   ├── promotions/route.js    # Promociones y banners
│   └── cross-selling/route.js # Cross-selling
│
├── app/api/cron/
│   └── guardian-intelligence/route.js  # CRON cada 15 min
│
├── wordpress-plugins/
│   └── guardian-intelligence.php       # Plugin WP completo
│
├── ESPECIFICACIONES-APP-GUARDIAN-INTELLIGENCE.md  # Specs originales
└── ESTADO-GUARDIAN-INTELLIGENCE.md     # Este documento
```

---

## 🧪 DATOS EN VERCEL KV

### Claves Principales
```
gi:config:monitor_activo       # Boolean - Monitor 24/7 activo
gi:config:seo_automatico       # Boolean - SEO auto
gi:config:correccion_automatica # Boolean - Corrección auto
gi:config:alertas_whatsapp     # Boolean
gi:config:alertas_email        # Boolean
gi:config:cross_selling        # Boolean

gi:frases:usadas               # Lista - Frases ya usadas
gi:sincrodestinos:usados       # Lista - Sincrodestinos usados
gi:estructuras:recientes       # Lista - Últimas 10 estructuras

gi:monitor:ultimo              # Object - Último monitoreo
gi:monitor:historial           # Lista - Keys de historial
gi:alertas:pendientes          # Lista - Alertas no leídas

gi:analisis:ultimo             # Object - Último análisis completo
gi:stats:historias_generadas   # Number - Contador
gi:stats:historias_corregidas  # Number - Contador
gi:stats:productos_con_seo     # Number - Contador

gi:cron:ultima_ejecucion       # Object - Info último cron
gi:cron:errores                # Lista - Errores del cron

gi:promo:{id}                  # Object - Datos de promoción
gi:promos:lista                # Lista - IDs de promociones
gi:promos:activas              # Set - IDs activas

gi:cross-selling:interacciones # Lista - Historial de interacciones
gi:cross-selling:combo:{a}:{b} # Number - Contador de combo
```

---

## 🚀 PRÓXIMOS PASOS PARA DEPLOY

1. **Git push** - Subir cambios a producción
2. **Subir plugin WP** - Copiar `guardian-intelligence.php` a WordPress
3. **Activar plugin** - Desde WordPress admin
4. **Verificar CRON** - Esperar 15 min y ver si ejecuta
5. **Correr análisis** - Probar con algunos productos
6. **Crear promoción de prueba** - Verificar sistema

---

## 📞 CONTACTO Y AYUDA

### Para continuar en otra sesión:
1. Leer este documento
2. Revisar `/lib/guardian-intelligence/` para el código core
3. Revisar `/app/api/guardian-intelligence/` para las APIs
4. El TODO está en la lista de pendientes de arriba

### Credenciales necesarias (en .env.local):
- ANTHROPIC_API_KEY
- WC_CONSUMER_KEY / WC_CONSUMER_SECRET
- VERCEL_KV credenciales
- RESEND_API_KEY
- WORDPRESS_URL

---

*Documento generado automáticamente por Guardian Intelligence*
*Actualizar después de cada cambio significativo*
