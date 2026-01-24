# CÓDIGO MAESTRO - Duendes del Uruguay

## Guía Completa para Reconstruir el Sistema

Este documento contiene TODO lo necesario para reconstruir el sistema desde cero si alguna vez se pierde, se desconecta o necesita recrearse.

---

## 1. STACK TECNOLÓGICO

```
Framework:      Next.js 14.2.0 (App Router)
Frontend:       React 18.3.1
Hosting:        Vercel
Base de datos:  Vercel KV (Redis)
IA Principal:   Anthropic Claude (@anthropic-ai/sdk ^0.30.1)
IA Secundaria:  OpenAI GPT-4 (openai ^6.16.0)
IA Imágenes:    Google Gemini (@google/generative-ai ^0.24.1)
IA Generativa:  Replicate (replicate ^1.4.0)
Emails:         Resend (resend ^4.8.0)
E-commerce:     WooCommerce (API REST)
Node:           >= 18.0.0
```

---

## 2. ESTRUCTURA DE CARPETAS

```
duendes-vercel/
├── app/                          # Next.js App Router
│   ├── admin/                    # Panel de administración
│   │   ├── generador-historias/  # Generador de historias con IA
│   │   ├── canalizaciones/       # Panel de aprobación canalizaciones
│   │   ├── circulo/              # Admin del Círculo Interno
│   │   ├── gamificacion/         # Admin gamificación
│   │   ├── inteligencia/         # Guardian Intelligence
│   │   ├── promociones/          # Gestión de promos
│   │   └── tito/                 # Admin chatbot Tito
│   ├── api/                      # API Routes
│   │   ├── admin/                # Endpoints admin
│   │   ├── circulo/              # Endpoints Círculo
│   │   ├── gamificacion/         # Endpoints gamificación
│   │   └── tito/                 # Endpoints chatbot
│   ├── mi-magia/                 # Portal del cliente
│   │   ├── circulo/              # Círculo Interno (cliente)
│   │   └── comunidad/            # Foro comunidad
│   ├── circulo/                  # Landing Círculo
│   ├── tienda/                   # Tienda online
│   └── portal/[id]/              # Portal post-compra
├── lib/                          # Bibliotecas compartidas
│   ├── conversion/               # Sistema experto de conversión
│   ├── guardian-intelligence/    # IA de análisis de catálogo
│   ├── tito/                     # Lógica del chatbot
│   ├── circulo/                  # Config Círculo Interno
│   ├── gamificacion/             # Config gamificación
│   └── experiencias/             # Catálogo experiencias
├── data/                         # Datos estáticos
│   └── catalogo-guardianes.json  # Catálogo local de productos
├── public/                       # Assets estáticos
├── scripts/                      # Scripts de utilidad
└── server-plugins/               # Plugins WordPress/WooCommerce
```

---

## 3. VARIABLES DE ENTORNO REQUERIDAS

Crear archivo `.env.local`:

```bash
# ===== APIs de IA =====
ANTHROPIC_API_KEY=sk-ant-...          # Claude API
OPENAI_API_KEY=sk-...                 # GPT-4 API
GOOGLE_AI_API_KEY=AI...               # Gemini API
REPLICATE_API_TOKEN=r8_...            # Replicate API

# ===== Vercel KV (Redis) =====
KV_REST_API_URL=https://...           # URL de Vercel KV
KV_REST_API_TOKEN=...                 # Token de Vercel KV
KV_REST_API_READ_ONLY_TOKEN=...       # Token solo lectura

# ===== WooCommerce =====
WOOCOMMERCE_URL=https://duendesdeluruguay.com
WOOCOMMERCE_CONSUMER_KEY=ck_...
WOOCOMMERCE_CONSUMER_SECRET=cs_...

# ===== Email (Resend) =====
RESEND_API_KEY=re_...
EMAIL_FROM=Duendes del Uruguay <noreply@tudominio.com>

# ===== Seguridad =====
ADMIN_SECRET=tu-secreto-admin         # Para proteger rutas admin
CRON_SECRET=tu-secreto-cron           # Para proteger cron jobs
```

---

## 4. COMANDOS ESENCIALES

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build de producción
npm run build

# Deploy a Vercel
vercel --prod

# Ver logs de producción
vercel logs duendes-vercel --follow
```

---

## 5. SISTEMA EXPERTO DE CONVERSIÓN

### Ubicación: `/lib/conversion/`

Este es el corazón del generador de historias que venden.

### Módulos:

| Archivo | Función |
|---------|---------|
| `hooks.js` | Biblioteca de frases de apertura por categoría |
| `sincrodestinos.js` | Eventos "mágicos" creíbles durante creación |
| `cierres.js` | Cierres según perfil psicológico del lector |
| `arco.js` | Estructura de arco emocional (8 fases) |
| `scoring.js` | Sistema de puntuación 0-50 |
| `index.js` | Exporta todo + `analizarHistoriaCompleta()` |

### Las 5 Dimensiones del Scoring:

```javascript
// Cada dimensión vale 0-10, total máximo 50
{
  identificacion: 0-10,  // ¿El lector se reconoce?
  dolor: 0-10,           // ¿Toca heridas reales?
  solucion: 0-10,        // ¿El guardián resuelve algo?
  urgencia: 0-10,        // ¿Hay razón para actuar ahora?
  confianza: 0-10        // ¿Evita sonar a venta?
}
// Score mínimo aceptable: 30/50
```

### Las 8 Fases del Arco Emocional:

```javascript
const fases = [
  { fase: 'espejo', objetivo: 'El lector se ve reflejado' },
  { fase: 'herida', objetivo: 'Tocar el dolor sin nombrarlo' },
  { fase: 'validación', objetivo: '"No estás loca"' },
  { fase: 'esperanza', objetivo: 'Posibilidad de cambio' },
  { fase: 'solución', objetivo: 'El guardián como respuesta' },
  { fase: 'prueba', objetivo: 'Evidencia tangible (sincrodestino)' },
  { fase: 'puente', objetivo: 'Conexión personal directa' },
  { fase: 'decisión', objetivo: 'Llamado a acción sin presión' }
];
// Score mínimo: 75% de fases presentes
```

### Cierres por Perfil:

```javascript
const perfiles = {
  vulnerable: "Si algo de esto te tocó, no lo ignores...",
  esceptico: "No te pido que creas en nada...",
  impulsivo: "Mirá, esto no es para pensarlo mucho..."
};
```

---

## 6. API DE HISTORIAS

### Endpoint: `POST /api/admin/historias`

```javascript
// Request
{
  "nombre": "Violeta",
  "especie": "pixie",        // duende, pixie, hada, etc.
  "categoria": "Protección", // Protección, Abundancia, Amor, Sanación, Sabiduría
  "tamanoCm": 11,
  "accesorios": "pelo azul, rosa blanca",
  "esUnico": true
}

// Response
{
  "success": true,
  "historia": "Hay personas que cargan con más de lo que les corresponde...",
  "datos": {
    "categoria": "Protección",
    "especie": "pixie",
    "hooks": ["..."],
    "sincrodestino": { tipo: "sensorial", evento: "..." },
    "cierres": { vulnerable: "...", esceptico: "...", impulsivo: "..." },
    "perfil": "vulnerable"
  },
  "conversion": {
    "score": { total: 38, identificacion: 8, dolor: 6, ... },
    "evaluacion": { aceptable: true, advertencias: [], sugerencias: [] }
  },
  "arco": {
    "score": 100,
    "completo": true,
    "fases": [...]
  }
}
```

---

## 7. GENERADOR DE HISTORIAS (UI)

### Ubicación: `/admin/generador-historias`

### Tres Modos:

1. **Modo Guiado** - Paso a paso con encuestas
2. **Modo Rápido** - Solo datos básicos
3. **Modo Directo** - Click en guardián = historia (USA EL SISTEMA EXPERTO)

### Flujo del Modo Directo:

```
1. Muestra catálogo filtrable (buscar por nombre)
2. Click en cualquier guardián
3. Llama a POST /api/admin/historias
4. Muestra: historia + score + arco + evaluación
5. Permite: copiar, regenerar, o elegir otro
```

---

## 8. BASE DE DATOS (Vercel KV)

### Claves principales:

```javascript
// Usuarios del Círculo
`circulo:${email}` → { email, nombre, tipo, runas, ... }

// Gamificación
`gamificacion:${email}` → { runas, racha, badges, ... }

// Canalizaciones
`canalizacion:${orderId}` → { contenido, estado, ... }

// Contenido del Círculo
`circulo:contenido:${fecha}` → { ritual, mensaje, ... }

// Configuración
`circulo:config` → { duendeSemana, tema, ... }
```

---

## 9. WOOCOMMERCE INTEGRATION

### Endpoints usados:

```javascript
// Productos
GET  /wp-json/wc/v3/products
POST /wp-json/wc/v3/products
PUT  /wp-json/wc/v3/products/{id}

// Órdenes
GET  /wp-json/wc/v3/orders
GET  /wp-json/wc/v3/orders/{id}

// Clientes
GET  /wp-json/wc/v3/customers
```

### Autenticación:

```javascript
const auth = Buffer.from(
  `${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`
).toString('base64');

headers: {
  'Authorization': `Basic ${auth}`
}
```

---

## 10. REGLAS DE CONTENIDO (CRÍTICAS)

### NUNCA usar estas frases:

```
❌ "Desde las profundidades..."
❌ "Las brumas ancestrales..."
❌ "El velo entre mundos..."
❌ "Tiempos inmemoriales..."
❌ "Susurro del viento..."
❌ "Danza de las hojas..."
❌ "Vibraciones cósmicas..."
❌ "Campo energético..."
❌ "847 años" (número prohibido)
❌ Cualquier frase genérica de IA
```

### SIEMPRE:

```
✅ Español rioplatense (vos, tenés, podés)
✅ Primera frase con impacto emocional
✅ Especificidad > generalidades bonitas
✅ Valor real que se puede aplicar HOY
✅ El guardián habla desde su experiencia
```

---

## 11. DEPLOY A VERCEL

### Primera vez:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Primer deploy (configura el proyecto)
vercel

# Deploy a producción
vercel --prod
```

### Variables de entorno en Vercel:

1. Ir a vercel.com → proyecto → Settings → Environment Variables
2. Agregar cada variable de `.env.local`
3. Marcar todas como Production + Preview + Development

---

## 12. DOCUMENTOS RELACIONADOS

| Documento | Contenido |
|-----------|-----------|
| `CLAUDE.md` | Reglas de escritura y canalizaciones |
| `BIBLIA-HISTORIAS-GUARDIANES.md` | Sistema completo de historias |
| `ESTADO-PANEL-CANALIZACIONES.md` | Panel de aprobación |
| `HISTORIAL-SESIONES.md` | Log de cambios por sesión |

---

## 13. TROUBLESHOOTING

### "Error de conexión a WooCommerce"
- Verificar keys en `.env.local`
- Verificar que la URL sea `https://`
- Verificar que las keys tengan permisos read/write

### "Error de Vercel KV"
- Verificar que el proyecto esté conectado a KV en Vercel dashboard
- Copiar las variables de KV a `.env.local`

### "Historia no se genera"
- Verificar `ANTHROPIC_API_KEY`
- Verificar límites de API
- Ver logs: `vercel logs --follow`

### "Deploy falla"
- Verificar `npm run build` local
- Ver errores en Vercel dashboard
- Verificar Node version >= 18

---

## 14. CONTACTO DE EMERGENCIA

Si el sistema se pierde completamente:

1. Este documento tiene TODO lo necesario
2. El código fuente está en GitHub (si conectado) o en backups locales
3. Las variables de entorno están en Vercel dashboard
4. La base de datos (Vercel KV) persiste independiente del código

---

*Última actualización: 2026-01-22*
*Versión: 1.0*
