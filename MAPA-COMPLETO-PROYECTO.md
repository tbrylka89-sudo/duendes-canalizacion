# MAPA COMPLETO DEL PROYECTO - DUENDES DEL URUGUAY

> Documento de referencia total. Contiene la ubicacion de cada pieza del sistema,
> como funciona, donde vive, que conecta con que. Si algo se rompe, busca aca.
>
> Ultima actualizacion: 31 de enero 2026

---

## INDICE

1. [Arquitectura General](#1-arquitectura-general)
2. [Infraestructura y Hosting](#2-infraestructura-y-hosting)
3. [Repositorio GitHub + Vercel](#3-repositorio-github--vercel)
4. [Estructura de Archivos del Proyecto](#4-estructura-de-archivos-del-proyecto)
5. [Variables de Entorno](#5-variables-de-entorno)
6. [APIs Externas y Servicios](#6-apis-externas-y-servicios)
7. [Base de Datos (Vercel KV / Redis)](#7-base-de-datos-vercel-kv--redis)
8. [Sistema Tito (Chatbot AI)](#8-sistema-tito-chatbot-ai)
9. [Sistema de Canalizaciones](#9-sistema-de-canalizaciones)
10. [Sistema de Conversion (Historias)](#10-sistema-de-conversion-historias)
11. [WordPress - Paginas y Contenido](#11-wordpress---paginas-y-contenido)
12. [WordPress - Plugins Activos en Servidor](#12-wordpress---plugins-activos-en-servidor)
13. [WordPress - Plugins Locales (todos)](#13-wordpress---plugins-locales-todos)
14. [API Routes Completas (Vercel)](#14-api-routes-completas-vercel)
15. [Paginas Frontend (Next.js)](#15-paginas-frontend-nextjs)
16. [Cron Jobs Automaticos](#16-cron-jobs-automaticos)
17. [Webhooks](#17-webhooks)
18. [Sistema de Emails](#18-sistema-de-emails)
19. [Sistema de Precios y Monedas](#19-sistema-de-precios-y-monedas)
20. [Gamificacion](#20-gamificacion)
21. [El Circulo (Membresia)](#21-el-circulo-membresia)
22. [Mi Magia (Portal del Cliente)](#22-mi-magia-portal-del-cliente)
23. [Guardian Intelligence](#23-guardian-intelligence)
24. [SEO](#24-seo)
25. [Scripts Utilitarios](#25-scripts-utilitarios)
26. [Credenciales y Accesos](#26-credenciales-y-accesos)
27. [Flujo Completo de una Compra](#27-flujo-completo-de-una-compra)
28. [Problemas Conocidos y Lecciones](#28-problemas-conocidos-y-lecciones)

---

## 1. ARQUITECTURA GENERAL

```
                    ┌─────────────────────────┐
                    │   duendesdeluruguay.com  │
                    │   (WordPress + 10Web)    │
                    │   Elementor pages        │
                    │   WooCommerce shop       │
                    │   mu-plugins PHP         │
                    └──────────┬──────────────┘
                               │
                    Webhooks, REST API, Widget JS
                               │
                    ┌──────────▼──────────────┐
                    │  duendes-vercel.vercel.app│
                    │  (Next.js 14 en Vercel)  │
                    │  API Routes (Node.js)    │
                    │  React pages (admin)     │
                    │  Cron jobs               │
                    └──────────┬──────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼────┐  ┌───────▼──────┐  ┌──────▼──────┐
    │  Vercel KV   │  │ Claude API   │  │  WooCommerce│
    │  (Upstash    │  │ (Anthropic)  │  │  REST API   │
    │   Redis)     │  │ Sonnet/Haiku │  │             │
    └──────────────┘  └──────────────┘  └─────────────┘
              │
    ┌─────────┼──────────┬──────────┐
    │         │          │          │
  Brevo   Resend    ElevenLabs  Replicate
  (emails) (emails)  (voz)      (imagenes)
```

**Resumen:**
- **WordPress** (10Web) = la tienda publica, paginas, checkout, WooCommerce
- **Vercel** (Next.js) = backend inteligente, APIs, admin panels, chatbot, canalizaciones
- **Vercel KV** (Upstash Redis) = base de datos principal para todo lo custom
- **Claude API** = inteligencia artificial para Tito, canalizaciones, historias

---

## 2. INFRAESTRUCTURA Y HOSTING

### WordPress / Tienda
| Item | Valor |
|------|-------|
| **Hosting** | 10Web Premium |
| **Panel** | my.10web.io/websites/1453202/main |
| **IP servidor** | 34.70.139.72 |
| **Ubicacion** | Council Bluffs, Iowa, USA |
| **Dominio principal** | duendesdeluruguay.com |
| **Page builder** | Elementor Pro |
| **E-commerce** | WooCommerce |
| **SSL** | Gestionado por 10Web |
| **Cache** | Nginx (arreglado para funcionar con Multi Currency) |

### Vercel / Backend
| Item | Valor |
|------|-------|
| **Proyecto** | duendes-vercel |
| **URL produccion** | https://duendes-vercel.vercel.app |
| **Plan** | Pro |
| **Team** | duendes-del-uruguay |
| **Region** | US (Iowa) |
| **Framework** | Next.js 14.2.0 |
| **Node** | >= 18.0.0 |
| **Auto-deploy** | Push a `main` en GitHub |
| **Cron jobs** | 7 configurados |

### GitHub
| Item | Valor |
|------|-------|
| **Repo** | github.com/tbrylka89-sudo/duendes-canalizacion |
| **Branch principal** | main |
| **Conectado a** | Vercel (auto-deploy) |

### Vercel KV (Base de Datos)
| Item | Valor |
|------|-------|
| **Provider** | Upstash Redis |
| **URL REST** | https://choice-llama-9731.upstash.io |
| **Conexion Redis** | rediss://default:...@choice-llama-9731.upstash.io:6379 |

### SFTP (acceso a WordPress)
| Item | Valor |
|------|-------|
| **Host** | 34.70.139.72 |
| **Puerto** | 55309 |
| **Usuario** | sftp_live_WfP6i |
| **Password** | JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR |
| **Ruta mu-plugins** | web/wp-live/wp-content/mu-plugins/ |

---

## 3. REPOSITORIO GITHUB + VERCEL

### Archivos de Configuracion

| Archivo | Funcion |
|---------|---------|
| `package.json` | Dependencias y scripts (dev, build, start) |
| `next.config.js` | Config Next.js: headers, redirects, imagenes remotas |
| `vercel.json` | Cron jobs, CORS headers, rewrites |
| `jsconfig.json` | Alias `@/*` → `./*` |
| `middleware.js` | Subdominios (magia.* → /mi-magia), CORS |
| `.gitignore` | Excluye node_modules, .env, .next, credenciales |
| `.env.local` | Variables de entorno (NO en git) |
| `.env.example` | Template de variables necesarias |
| `CLAUDE.md` | Instrucciones para Claude (biblia del proyecto) |

### Dependencias (package.json)

| Paquete | Version | Uso |
|---------|---------|-----|
| `next` | 14.2.0 | Framework web |
| `react` / `react-dom` | ^18.3.1 | UI |
| `@anthropic-ai/sdk` | ^0.30.1 | Claude API (Tito, canalizaciones) |
| `@google/generative-ai` | ^0.24.1 | Gemini (imagenes, vision) |
| `openai` | ^6.16.0 | OpenAI / DALL-E |
| `@vercel/kv` | ^2.0.0 | Redis/KV storage |
| `nodemailer` | ^7.0.12 | Emails via Gmail SMTP |
| `resend` | ^4.8.0 | Emails via Resend API |
| `replicate` | ^1.4.0 | Generacion de imagenes |

### Redirects configurados (next.config.js)
- `/shop` → `/tienda` (permanent)
- `/shop/*` → `/tienda/*` (permanent)

### Rewrites (vercel.json)
- `/circulo` → `/circulo/landing`
- Subdominio `magia.duendesdeluruguay.com/*` → `/mi-magia/*`

---

## 4. ESTRUCTURA DE ARCHIVOS DEL PROYECTO

```
duendes-vercel/
│
├── app/                          # Next.js App Router
│   ├── page.js                   # Home (redirect a duendesdeluruguay.com)
│   ├── layout.js                 # Layout global + SEO metadata
│   ├── globals.css               # Estilos globales
│   ├── components/
│   │   ├── SchemaMarkup.jsx      # Schema.org JSON-LD
│   │   └── PrecioProducto.jsx    # Componente de precio
│   │
│   ├── admin/                    # Paneles de admin (React)
│   │   ├── page.jsx              # Dashboard principal
│   │   ├── canalizaciones/       # Panel de canalizaciones
│   │   ├── generador-historias/  # Generador de historias de guardianes
│   │   ├── circulo/              # Admin del Circulo
│   │   ├── tito/                 # Admin de Tito
│   │   ├── gamificacion/         # Admin gamificacion
│   │   ├── contenido/            # Admin contenido
│   │   ├── clientes/             # Ficha de clientes
│   │   ├── productos/            # Admin productos
│   │   ├── imagenes/             # Generador de imagenes
│   │   ├── comunidad/            # Admin comunidad
│   │   ├── voz/                  # Generador de voz
│   │   └── modo-dios/            # Control total
│   │
│   ├── mi-magia/                 # Portal del cliente
│   │   ├── layout.js
│   │   └── page.jsx
│   │
│   ├── circulo/                  # El Circulo (membresia)
│   │   └── landing/
│   │
│   ├── tienda/                   # Tienda (si se usa)
│   ├── formulario/[token]/       # Formulario post-compra
│   ├── certificado/[id]/         # Certificado digital
│   ├── lectura/[id]/             # Lectura/canalizacion
│   ├── guardian/[id]/            # Perfil de guardian
│   ├── portal/[id]/              # Redirect portal
│   │
│   └── api/                      # ← TODAS LAS API ROUTES (ver seccion 14)
│
├── lib/                          # Librerias compartidas
│   ├── tito/                     # Sistema Tito completo
│   │   ├── index.js              # Exports centrales
│   │   ├── personalidad.js       # Personalidad + prompt (961 lineas)
│   │   ├── personalidad-media.js # Version optimizada
│   │   ├── personalidad-compacta.js # Version minima
│   │   ├── conocimiento.js       # Productos, FAQ, precios (918 lineas)
│   │   ├── cotizaciones.js       # Tasas de cambio (188 lineas)
│   │   ├── tools.js              # Definiciones de tools (478 lineas)
│   │   ├── tool-executor.js      # Ejecucion de tools (1194 lineas)
│   │   ├── objeciones.js         # Manejo de objeciones
│   │   ├── persuasion.js         # Tecnicas persuasion + prueba social
│   │   ├── recomendaciones.js    # Motor de recomendaciones
│   │   ├── reglas-comportamiento.js # Crisis, insultos, spam, despedidas
│   │   └── manual-persuasion.js  # Manual de referencia
│   │
│   ├── conversion/               # Sistema de historias/conversion
│   │   ├── index.js              # analizarHistoriaCompleta()
│   │   ├── hooks.js              # Frases de apertura por categoria
│   │   ├── sincrodestinos.js     # Eventos magicos durante creacion
│   │   ├── cierres.js            # Cierres segun perfil psicologico
│   │   ├── arco.js               # Arco emocional (8 fases)
│   │   ├── scoring.js            # Score de conversion (0-50)
│   │   ├── especies.js           # Tipos de guardianes
│   │   ├── especializaciones.js  # Especializaciones
│   │   └── historial.js          # Tracking de historias
│   │
│   ├── guardian-intelligence/    # IA para productos
│   │   ├── index.js
│   │   ├── config.js
│   │   ├── generator.js          # Genera descripciones
│   │   ├── analyzer.js           # Analiza productos
│   │   ├── monitor.js            # Monitoreo
│   │   ├── promotions.js         # Promociones auto
│   │   ├── cross-selling.js      # Cross-sell
│   │   └── daily-report.js       # Reportes diarios
│   │
│   ├── circulo/                  # Sistema del Circulo
│   │   ├── config.js
│   │   ├── conversion.js
│   │   ├── perfilado.js
│   │   ├── sincronicidad.js
│   │   ├── escasez.js
│   │   ├── duendes-semanales-2026.js
│   │   ├── generador-automatico.js
│   │   └── voces-guardianes.js
│   │
│   ├── woocommerce/
│   │   └── api.js                # Helper WooCommerce REST API
│   │
│   ├── seo/
│   │   ├── index.js
│   │   ├── metadata.js
│   │   ├── schema.js             # Schema.org
│   │   ├── tags-generator.js
│   │   └── rankmath.js
│   │
│   ├── comunidad/                # Sistema comunidad
│   ├── academia/                 # Sistema cursos
│   ├── experiencias/             # Experiencias magicas
│   ├── gamificacion/             # Config gamificacion
│   ├── imagenes/                 # Generacion imagenes
│   ├── config/                   # URLs y config
│   ├── contenido/                # Contenido enero 2026
│   ├── parsers/                  # Parsers de texto
│   │
│   ├── emails.js                 # Gmail SMTP + Resend fallback
│   ├── email-templates.js        # Templates HTML
│   ├── ficha-cliente.js          # Perfil de cliente
│   ├── personalizacion.js        # Personalizacion
│   ├── promo-templates.js        # Templates promos
│   ├── sincronicidad.js          # Sincronicidad
│   ├── ciclos-naturales.js       # Ciclos lunares etc
│   └── test-questions.js         # Preguntas del test
│
├── wordpress-plugins/            # Plugins WP (copias locales)
│   ├── duendes-mu-plugins/       # Subfolder de mu-plugins
│   └── [90+ archivos .php]       # Ver seccion 12-13
│
├── scripts/                      # Scripts utilitarios
│   └── [35 scripts]              # Ver seccion 25
│
├── public/                       # Assets estaticos
│   ├── og-image.jpg/png          # Open Graph images
│   ├── icon-192.png, icon-512.png # PWA icons
│   ├── robots.txt
│   ├── site.webmanifest
│   ├── tito-widget.js            # Widget Tito (referencia)
│   ├── tito-maestro.js           # Tito master script
│   ├── img/                      # Imagenes
│   ├── js/                       # JS snippets
│   └── snippets/                 # PHP snippets
│
├── docs/                         # Documentacion
│   ├── BIBLIA-HISTORIAS-GUARDIANES.md
│   ├── ESTADO-PANEL-CANALIZACIONES.md
│   ├── VISION_2026.md
│   ├── PLAN-MAESTRO-CONVERSION.md
│   └── [15+ archivos .md]
│
└── middleware.js                  # Middleware Next.js
```

---

## 5. VARIABLES DE ENTORNO

**Ubicacion en Vercel:** Settings > Environment Variables
**Local:** `.env.local` (no va a git)

### Criticas

| Variable | Servicio | Uso |
|----------|----------|-----|
| `ANTHROPIC_API_KEY` | Anthropic | Claude API (Tito, canalizaciones, historias) |
| `KV_REST_API_URL` | Upstash | URL de la base de datos Redis |
| `KV_REST_API_TOKEN` | Upstash | Token de acceso a Redis |
| `KV_URL` | Upstash | URL Redis completa (rediss://) |
| `REDIS_URL` | Upstash | Alias de KV_URL |
| `WORDPRESS_URL` | WordPress | https://duendesdeluruguay.com |
| `ADMIN_SECRET` | Interno | Password admin panels: `DuendesAdmin2026` |

### Email

| Variable | Servicio | Uso |
|----------|----------|-----|
| `GMAIL_USER` | Gmail | info@duendesdeluruguay.com |
| `GMAIL_APP_PASSWORD` | Gmail | App password para SMTP |
| `RESEND_API_KEY` | Resend | Fallback de email |

### IA y Generacion

| Variable | Servicio | Uso |
|----------|----------|-----|
| `OPENAI_API_KEY` | OpenAI | DALL-E, GPT (backup) |
| `GEMINI_API_KEY` | Google | Gemini vision + generacion |
| `REPLICATE_API_TOKEN` | Replicate | Imagenes AI |
| `ELEVENLABS_API_KEY` | ElevenLabs | Generacion de voz |
| `ELEVENLABS_VOZ_THIBISAY` | ElevenLabs | ID voz Thibisay normal |
| `ELEVENLABS_VOZ_THIBISAY_RAPIDO` | ElevenLabs | ID voz Thibisay rapida |

### Seguridad

| Variable | Valor | Uso |
|----------|-------|-----|
| `CRON_SECRET` | duendes-cron-2024 | Protege cron jobs |
| `WEBHOOK_SECRET` | duendes-webhook-secret-2024 | Webhooks genericos |
| `DUENDES_API_TOKEN` | tyA60hi6sNH1Ftfc1jagbxKkPC35zCCl | Token API interno |

### WooCommerce

Las credenciales WooCommerce REST API se usan en `lib/woocommerce/api.js` y `lib/tito/conocimiento.js`:
- **Consumer Key**: `ck_...` (en Vercel env, no hardcodeada)
- **Consumer Secret**: `cs_...` (en Vercel env, no hardcodeada)
- **Webhook Secret**: `duendes_wh_2026_x7Kp9mNqR3sT5vW8yB2dF4gH6jL`
- **WP Application Password** (usuario tbrylka89@gmail.com): `fAeb 8wHT zGPD nZO4 6CHn i09X`

---

## 6. APIS EXTERNAS Y SERVICIOS

| Servicio | Uso | Donde se configura |
|----------|-----|-------------------|
| **Anthropic Claude** | Tito chatbot, canalizaciones, historias, analisis | `ANTHROPIC_API_KEY` |
| **OpenAI** | DALL-E imagenes, GPT fallback | `OPENAI_API_KEY` |
| **Google Gemini** | Vision (analizar fotos guardianes), imagenes | `GEMINI_API_KEY` |
| **Replicate** | Generacion imagenes AI | `REPLICATE_API_TOKEN` |
| **ElevenLabs** | Voz sintetica (Thibisay) | `ELEVENLABS_API_KEY` |
| **Upstash Redis** | Base de datos KV | `KV_REST_API_URL` + token |
| **Gmail SMTP** | Emails transaccionales (principal) | `GMAIL_USER` + `GMAIL_APP_PASSWORD` |
| **Resend** | Emails (fallback) | `RESEND_API_KEY` |
| **Brevo** | Emails transaccionales (template #15 para formularios) | API key en codigo |
| **WooCommerce REST API** | Productos, ordenes, clientes | Consumer key/secret |
| **WooCommerce Store API** | Productos publicos (sin auth) | Ninguna (publico) |
| **exchangerate-api.com** | Tasas de cambio en tiempo real | Gratis, sin key |
| **ipapi.co** | Geolocalizacion por IP | Gratis, sin key |

### Modelos de IA usados

| Modelo | Donde | Para que |
|--------|-------|---------|
| `claude-3-5-haiku-20241022` | Tito v3 | Chatbot de ventas |
| `claude-sonnet-4-20250514` | Canalizaciones, historias | Generacion creativa |
| `gemini-2.0-flash-exp` | Vision | Analisis de imagenes |
| DALL-E 3 | Admin imagenes | Generacion de imagenes |
| Replicate models | Admin imagenes | Generacion alternativa |

---

## 7. BASE DE DATOS (VERCEL KV / REDIS)

No hay base de datos SQL. Todo se guarda en Vercel KV (Upstash Redis).

### Patrones de Keys

**Usuarios:**
```
elegido:{email}              → Datos del usuario principal
user:{email}                 → Perfil alternativo
token:{token}                → Mapeo token → email
circulo:{email}              → Membresia del Circulo
gamificacion:{email}         → Datos de gamificacion (runas, treboles, nivel)
lecturas:{email}             → Lecturas/canalizaciones del usuario
```

**Tito:**
```
tito:sesion:{subscriberId}   → Sesion de chat (2h TTL)
tito:cliente:{subscriberId}  → Info guardada del cliente (30 dias)
tito:conversacion:{id}       → Historial de conversacion
tito:productos:{hash}        → Cache de productos WooCommerce (5 min)
tito:productos:invalidacion  → Marca de invalidacion distribuida
tito:cotizaciones            → Tasas de cambio (6h TTL)
```

**Canalizaciones:**
```
canalizacion:{id}            → Una canalizacion individual
canalizaciones:todas         → Lista de todas las IDs
canalizaciones:borradores    → IDs en estado borrador
canalizaciones:pendientes    → IDs pendientes de aprobacion
canalizaciones:enviadas      → IDs ya enviadas
form_invite:{token}          → Invitacion a formulario post-compra
form_data:{token}            → Datos del formulario completado
```

**Ordenes:**
```
orden:{ordenId}              → Datos de la orden (certificado)
orden:procesada:{ordenId}    → Flag anti-duplicado de webhook
```

**Stock:**
```
stock:bajo:{productoId}      → Alerta stock bajo (7 dias)
stock:bajo:lista             → Lista global de stock bajo
```

**Escalamientos:**
```
escalamiento:{ticketId}      → Ticket de escalamiento (7 dias)
escalamientos:pendientes     → Lista de pendientes
escalamientos:{tipo}         → Por tipo (venta, pedido, queja)
```

**Circulo:**
```
circulo:contenido:{fecha}    → Contenido diario del Circulo
circulo:duende-dia:{fecha}   → Guardian del dia
circulo:duende-semana:{num}  → Guardian de la semana
```

**Email:**
```
email-programado:{email}:dia{N} → Emails programados
```

---

## 8. SISTEMA TITO (CHATBOT AI)

### Que es Tito
Un chatbot de ventas con IA que vive en la web de Duendes como widget flotante. Se presenta como un duende de 847 anos de Piriapolis. Usa Claude Haiku para responder.

### Donde vive

| Componente | Ubicacion |
|------------|-----------|
| **Widget HTML/CSS/JS** | `wordpress-plugins/duendes-tito-widget.php` (inyectado via `wp_footer`) |
| **API principal** | `app/api/tito/v3/route.js` |
| **Personalidad/prompt** | `lib/tito/personalidad.js` (961 lineas) |
| **Base de conocimiento** | `lib/tito/conocimiento.js` (918 lineas) |
| **Tools (definicion)** | `lib/tito/tools.js` (478 lineas) |
| **Tools (ejecucion)** | `lib/tito/tool-executor.js` (1194 lineas) |
| **Cotizaciones** | `lib/tito/cotizaciones.js` (188 lineas) |
| **Persuasion** | `lib/tito/persuasion.js` |
| **Recomendaciones** | `lib/tito/recomendaciones.js` |
| **Reglas comportamiento** | `lib/tito/reglas-comportamiento.js` |
| **Objeciones** | `lib/tito/objeciones.js` |
| **Sync cron** | `app/api/tito/sync/route.js` (cada hora) |
| **ManyChat** | `app/api/tito/manychat/route.js` |

### Flujo de una conversacion

1. Usuario escribe en widget → POST a `/api/tito/v3`
2. `route.js` recibe mensaje + historial + datos usuario
3. **Pre-filtros**: detecta crisis, insultos, spam, despedida
4. Si pasa filtros → construye prompt con personalidad + conocimiento
5. Envia a Claude Haiku con tools disponibles
6. Claude puede llamar tools: mostrar_productos, calcular_precio, buscar_pedido, etc.
7. `tool-executor.js` ejecuta el tool y devuelve resultado a Claude
8. Claude genera respuesta final
9. Se devuelve al widget

### Tools disponibles (21 total)

**Productos:** mostrar_productos, buscar_producto, recomendar_guardian, verificar_stock, obtener_guardian_completo
**Ordenes:** buscar_pedido
**Precios:** calcular_precio
**Memoria:** guardar_info_cliente, obtener_info_cliente
**Ventas:** guiar_compra, info_envios, info_mi_magia
**FAQ:** consultar_faq
**Admin:** admin_buscar_cliente, admin_dar_regalo, admin_gestionar_circulo, admin_ver_estadisticas, admin_ver_pedidos, admin_enviar_email, admin_sincronizar_woo
**Escalamiento:** escalar_a_humano

### Deteccion automatica

| Tipo | Que detecta | Accion |
|------|-------------|--------|
| Crisis | "quiero morir", "suicidio" | Lineas de ayuda por pais |
| Insultos | groserías directas | Escala a humano |
| Spam | emojis solos, religioso sin intent, cadenas | Respuesta neutral |
| Despedida | "chau", "adios", "bye" | Cierre amable |
| Pais | Dice su pais despues de ver productos | Convierte precios directamente |
| Tipo cliente | Comprador vs curioso | Ajusta tecnica |

---

## 9. SISTEMA DE CANALIZACIONES

### Que es
Una "carta personal" de un guardian a su dueno. Se genera con IA despues de que el cliente compra y llena un formulario.

### Flujo completo

```
1. Cliente compra en WooCommerce
          ↓
2. Checkout: "¿Quien recibe?" (para_mi / regalo_sabe / regalo_sorpresa / para_nino)
   Plugin: duendes-formulario-canalizacion.php
   Hook: woocommerce_after_order_notes
          ↓
3. Thank You page: formulario segun via elegida
   Hook: woocommerce_thankyou
          ↓
4. Webhook order.created llega a Vercel
   Endpoint: /api/webhooks/woocommerce
   Accion: crea borrador de canalizacion en KV + envia invitacion por email
          ↓
5. Cliente recibe email con link al formulario
   Endpoint: /api/formulario/{token}
   Servicio email: Brevo (template #15)
          ↓
6. Cliente completa formulario (nombre, momento vida, necesidades, foto)
   Se guarda en: form_data:{token}
   Se linkea a: canalizacion:{id} con formToken
          ↓
7. Se genera canalizacion automaticamente (o manual desde admin)
   Admin panel: /admin/canalizaciones
   API: PUT /api/admin/canalizaciones con accion:'generar'
   Modelo: Claude Sonnet 4 (claude-sonnet-4-20250514)
          ↓
8. Admin revisa en panel, puede editar con Chat Editor
   Chat: POST /api/admin/canalizaciones/chat
          ↓
9. Admin aprueba y envia
   API: PUT con accion:'enviar'
   Se guarda en: lecturas:{email} + orden:{ordenId}
          ↓
10. Cliente ve su canalizacion en Mi Magia
    + Certificado en: /api/certificado?order=X
```

### Archivos clave

| Archivo | Funcion |
|---------|---------|
| `app/api/admin/canalizaciones/route.js` | CRUD completo + generacion AI |
| `app/api/admin/canalizaciones/chat/route.js` | Chat Editor con acciones |
| `app/api/formulario/[token]/route.js` | Render del formulario |
| `app/api/formulario/upload/route.js` | Subida de fotos |
| `app/admin/canalizaciones/page.jsx` | Panel admin React |
| `wordpress-plugins/duendes-formulario-canalizacion.php` | Formulario en checkout + thank you |

### 4 vias del formulario

| Via | Quien llena | Diferencia |
|-----|-------------|------------|
| `para_mi` | El comprador | Formulario completo + foto |
| `regalo_sabe` | El destinatario (recibe email) | Se envia invitacion por email |
| `regalo_sorpresa` | El comprador (sobre el destinatario) | Preguntas desde perspectiva del comprador |
| `para_nino` | El adulto que compra | SIN foto, preguntas adaptadas |

### Generacion con IA

El prompt incluye:
- Datos del formulario (nombre, momento, necesidades, mensaje)
- Datos del producto/guardian (nombre, categoria, personalidad, historia, accesorios)
- Contexto paralelo (si la persona compro varios, se mencionan sin repetirse)
- Nota admin si existe (MAXIMA PRIORIDAD, override del prompt)
- Reglas: no inventar nombres, no frases de IA, accesorios no hablan como personajes

---

## 10. SISTEMA DE CONVERSION (HISTORIAS)

### Que es
Sistema experto para generar historias de productos que VENDEN.

### Ubicacion: `lib/conversion/`

### Componentes

| Modulo | Funcion |
|--------|---------|
| `hooks.js` | Frases de apertura por categoria (Proteccion, Abundancia, Amor, Sanacion, Sabiduria) |
| `sincrodestinos.js` | Eventos "magicos" durante la creacion (sensorial, climatico, temporal, animal, material) |
| `cierres.js` | Cierres segun perfil psicologico (Vulnerable, Esceptico, Impulsivo) |
| `arco.js` | Arco emocional de 8 fases (Espejo→Herida→Validacion→Esperanza→Solucion→Prueba→Puente→Decision) |
| `scoring.js` | Score de conversion 0-50 (Identificacion, Dolor, Solucion, Urgencia, Confianza) |
| `index.js` | `analizarHistoriaCompleta()` - analisis completo |

### Score minimo: 30/50
### Arco minimo: 75% de fases presentes

### Frases PROHIBIDAS (detectadas automaticamente)
```
"Desde las profundidades..."
"Las brumas ancestrales..."
"El velo entre mundos..."
"Tiempos inmemoriales..."
"El susurro del viento..."
"Danza de las hojas..."
"Vibraciones cosmicas..."
"Campo energetico..."
"847 anos" (numero prohibido)
```

---

## 11. WORDPRESS - PAGINAS Y CONTENIDO

### Como esta hecha la web

La web publica (duendesdeluruguay.com) esta hecha con:
- **Elementor Pro** como page builder principal
- **WooCommerce** para la tienda
- **Plugins mu-plugins** (PHP) para funcionalidad custom
- **10Web Templates** para header/footer
- **WPCode** para snippets de codigo

### Menu de navegacion
- Configurado en **10Web > Appearance > Menus** o via **Elementor templates**
- El item "Mi Magia" se agrega via plugin `duendes-fixes-master.php` con `wp_nav_menu_items`
- El header universal se maneja con `duendes-header-universal.php`

### Paginas principales

| Pagina | URL | Como esta hecha |
|--------|-----|-----------------|
| Home | / | Elementor |
| Tienda | /shop/ | WooCommerce + Elementor |
| Producto | /product/{slug} | WooCommerce + plugins custom |
| Como Funciona | /como-funciona/ | Elementor (+ CSS override via mu-plugin) |
| Test del Guardian | /descubri-que-duende-te-elige/ | Elementor + API Vercel |
| Checkout | /checkout/ | WooCommerce + formulario canalizacion |
| Mi Cuenta | /my-account/ | WooCommerce |
| Carrito | /cart/ | WooCommerce + avisos dinamicos |

### Secciones HTML editadas via plugins

| Seccion | Archivo HTML local | Plugin que la inyecta |
|---------|-------------------|----------------------|
| Pagos y envios | `seccion-pagos-envios.html` | Via Elementor o snippet |
| Mi Magia promo | `seccion-mi-magia-promo.html` | Via Elementor o snippet |
| Porque somos diferentes | `seccion-porque-diferentes.html` | Via Elementor o snippet |

---

## 12. WORDPRESS - PLUGINS ACTIVOS EN SERVIDOR

Los mu-plugins se cargan automaticamente. Estan en:
`web/wp-live/wp-content/mu-plugins/`

### Confirmados activos (subidos via SFTP)

| Plugin | Funcion principal |
|--------|-------------------|
| `duendes-fixes-master.php` | Fixes globales: oculta Grimorio, traducciones rioplatenses, footer, menu Mi Magia |
| `duendes-formulario-canalizacion.php` | Formulario en checkout + thank you page (4 vias) |
| `duendes-tito-widget.php` | Widget flotante de Tito (chat) |
| `duendes-hub-control.php` | Hub de Control admin (links a Vercel) |
| `duendes-avisos-carrito.php` | Avisos dinamicos en carrito (3x2, envio gratis) |
| `duendes-promo-3x2.php` | Promo: compra 2, lleva 1 mini gratis |
| `duendes-emails-magicos.php` | Emails post-compra automaticos |
| `duendes-elementor-emails.php` | Intercepta formularios Elementor y envia emails |
| `duendes-carrito-abandonado.php` | Emails de carrito abandonado (4 emails en secuencia) |
| `duendes-experiencia-magica.php` | Pagina de experiencia de producto |
| `duendes-mi-magia.php` | Backend del portal Mi Magia |
| `duendes-fabrica-banners.php` | Sistema de banners inteligentes |
| `duendes-emails-unificado.php` | Emails unificados con API Vercel |
| `duendes-header-universal.php` | Header responsive universal |
| `duendes-precios-v3.php` | Sistema de precios por pais |
| `duendes-neuromarketing.php` | Tweaks de neuromarketing |
| `duendes-remote-control.php` | Control remoto desde Vercel |
| `duendes-tienda-magica.php` | Mejoras en la tienda |
| `wmc-cache-fix.php` | Fix de cache con Multi Currency |
| `duendes-cache-headers.php` | Headers de cache para nginx |
| `duendes-email-from-fix.php` | Fix del remitente de emails |

### Nota importante
No todos los plugins en `wordpress-plugins/` estan activos. Muchos son versiones antiguas,
tests, o backups. Solo los que estan en el servidor en `mu-plugins/` estan activos.

---

## 13. WORDPRESS - PLUGINS LOCALES (TODOS)

Ubicacion: `/Users/usuario/Desktop/duendes-vercel/wordpress-plugins/`

### Por categoria

**Hub y Admin:**
- `duendes-hub-control.php` - Centro de control (links a Vercel)
- `duendes-admin-hub.php` - Admin hub alternativo
- `duendes-admin-completo.php` - Admin completo (v2.1.0)
- `duendes-admin-simple.php` - Admin simplificado
- `duendes-admin-clientes.php` - Gestion de clientes
- `duendes-remote-control.php` - Control remoto (REST API endpoints)

**E-commerce:**
- `duendes-formulario-canalizacion.php` - **CRITICO** Formulario post-compra
- `duendes-cart-checkout.php` / `duendes-cart-checkout-v2.php` - Cart y checkout
- `duendes-avisos-carrito.php` - Avisos en carrito
- `duendes-promo-3x2.php` - Promocion 3x2
- `duendes-precios-v3.php` / `duendes-precios-unificado.php` / `duendes-precios-inteligentes.php` - Precios
- `duendes-forzar-usd.php` - Forzar USD
- `duendes-pagos-por-pais.php` - Pagos segun pais
- `fix-checkout-cache.php` - Fix cache en checkout
- `zzz-duendes-precios-final.php` - Capa final de precios

**Emails:**
- `duendes-emails-magicos.php` - Emails post-compra
- `duendes-emails-unificado.php` - Sistema unificado
- `duendes-elementor-emails.php` - Formularios Elementor
- `duendes-emails-extras.php` - Emails adicionales
- `duendes-email-from-fix.php` - Fix remitente
- `duendes-carrito-abandonado.php` - Carrito abandonado

**Producto:**
- `duendes-experiencia-magica.php` - Experiencia de producto
- `duendes-ficha-guardian.php` - Ficha de guardian (admin)
- `duendes-canalizar-producto.php` - Canalizar producto
- `duendes-producto-epico.php` / `duendes-producto-magico-final.php` - Templates de producto
- `duendes-categorias-shop.php` - Categorias en tienda
- `duendes-categorizar.php` - Categorizacion automatica
- `duendes-qr-imprimir.php` - QR + impresion

**Contenido y UI:**
- `duendes-fixes-master.php` - **CRITICO** Fixes globales
- `duendes-header-universal.php` - Header
- `duendes-header-footer-garantizado.php` - Header/footer backup
- `duendes-homepage-mods.php` / `duendes-homepage-textos.php` - Mods homepage
- `duendes-shop-fix.php` - Fix tienda
- `duendes-tienda-magica.php` - Tienda magica
- `duendes-tienda-tarot.php` - Tarot tienda

**Mobile:**
- `duendes-mobile-fix-completo.php` - Fix mobile completo
- `duendes-mobile-producto-img.php` - Imagenes mobile
- `duendes-ios-scroll-fix.php` - iOS scroll
- `duendes-touch-fix.php` - Touch events
- `duendes-force-scroll.php` - Forzar scroll
- `duendes-scroll-fix-minimal.php` / `duendes-scroll-simple.php` - Scroll fixes

**Marketing:**
- `duendes-fabrica-banners.php` - Banners inteligentes
- `duendes-neuromarketing.php` - Neuromarketing
- `duendes-circulo-marketing.php` - Marketing del Circulo
- `duendes-mensajes-guardian.php` - Mensajes de guardianes
- `duendes-post-compra.php` - Post-compra

**Portal:**
- `duendes-mi-magia.php` - Mi Magia backend
- `mi-magia-solicitudes.php` - Solicitudes Mi Magia
- `duendes-complete.php` - Sistema completo
- `duendes-checkout-guardian.php` - Guardian en checkout

**Tests (versiones):**
- `test-guardian-v2.php` hasta `test-guardian-v15-completo.php` (10 versiones)
- `aaa-shortcode-test.php` - Test shortcodes
- `duendes-test-muplugin.php` - Test mu-plugin
- `guardian-intelligence.php` / `guardian-intelligence-simple.php` - GI

**Otros:**
- `duendes-domain-redirect.php` - Redirect de dominio
- `duendes-elementor-fix.php` - Fix Elementor
- `duendes-shortcodes.php` - Shortcodes custom
- `duendes-pagina-como-funciona.php` - Pagina como funciona
- `duendes-pagina-nosotros.php` - Pagina nosotros

---

## 14. API ROUTES COMPLETAS (VERCEL)

### Tito (Chatbot)
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| POST | `/api/tito/v3` | Chat principal (Claude + tools) |
| GET | `/api/tito/v3` | Status y debug |
| POST | `/api/tito/chat` | Chat alternativo |
| POST | `/api/tito/manychat` | Integracion ManyChat |
| GET | `/api/tito/sync` | Sync datos (cron horario) |

### Canalizaciones
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| GET | `/api/admin/canalizaciones` | Listar canalizaciones |
| POST | `/api/admin/canalizaciones` | Crear borrador |
| PUT | `/api/admin/canalizaciones` | Actualizar (generar, aprobar, enviar) |
| GET | `/api/admin/canalizaciones/resumen` | Estadisticas |
| GET | `/api/admin/canalizaciones/por-pedido?orden=X` | Por orden |
| POST | `/api/admin/canalizaciones/chat` | Chat Editor |
| POST | `/api/admin/canalizacion-manual` | Crear manual |
| POST | `/api/canalizacion/generar` | Generar canalizacion completa |

### Formulario Post-Compra
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| GET | `/api/formulario/[token]` | Render formulario |
| POST | `/api/formulario/[token]` | Guardar respuestas |
| POST | `/api/formulario/upload` | Subir foto |

### Certificado
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| GET | `/api/certificado?order=X` | Ver certificado |
| POST | `/api/certificado` | Guardar datos certificado |

### Test del Guardian
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| GET | `/api/test-guardian` | Obtener preguntas |
| POST | `/api/test-guardian` | Procesar respuestas + recomendar |

### Tienda
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| GET | `/api/tienda/productos` | Listar productos |
| GET | `/api/producto/[id]` | Detalle de producto |
| GET | `/api/cotizaciones` | Tasas de cambio |
| POST | `/api/cotizaciones` | Forzar actualizacion |

### Mi Magia (Portal)
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| GET | `/api/mi-magia/usuario?token=X` | Perfil completo |
| POST | `/api/mi-magia/usuario` | Actualizar perfil |
| POST | `/api/mi-magia/magic-link` | Generar magic link |
| GET | `/api/mi-magia/lecturas-por-email` | Lecturas del usuario |
| POST | `/api/mi-magia/canjear` | Canjear runas |
| POST | `/api/mi-magia/circulo/prueba` | Trial Circulo 15 dias |
| GET | `/api/mi-magia/diario` | Grimorio personal |
| GET | `/api/mi-magia/onboarding` | Datos onboarding |
| POST | `/api/mi-magia/perfilado` | Perfilado psicologico |

### Circulo (Membresia)
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| GET | `/api/circulo/verificar` | Verificar membresia |
| GET | `/api/circulo/contenido` | Contenido exclusivo |
| GET | `/api/circulo/mi-acceso` | Nivel de acceso |
| GET | `/api/circulo/luna` | Guia lunar |
| GET | `/api/circulo/consejo-del-dia` | Consejo diario |
| GET | `/api/circulo/duende-del-dia` | Guardian del dia |
| GET | `/api/circulo/duende-semana` | Guardian de la semana |
| GET | `/api/circulo/foro` | Posts del foro |

### Gamificacion
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| GET | `/api/gamificacion/usuario` | Stats del usuario |
| GET | `/api/gamificacion/leaderboard` | Top jugadores |
| GET | `/api/gamificacion/cofre-diario` | Cofre diario |
| GET | `/api/gamificacion/badges` | Badges ganados |
| POST | `/api/gamificacion/ejecutar-lectura` | Ejecutar lectura |

### Guardian Intelligence
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| POST | `/api/guardian-intelligence/generate` | Generar datos |
| POST | `/api/guardian-intelligence/analyze` | Analizar productos |
| GET | `/api/guardian-intelligence/monitor` | Monitorear |
| POST | `/api/guardian-intelligence/seo` | Generar SEO |
| GET | `/api/guardian-intelligence/stats` | Estadisticas |

### Webhooks
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| POST | `/api/webhooks/woocommerce` | Webhook WooCommerce principal |
| POST | `/api/webhook/woocommerce` | Alternativo |

### Emails
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| POST | `/api/email/send` | Enviar email |
| POST | `/api/emails/post-compra` | Email post-compra |
| POST | `/api/emails/carrito-abandonado` | Email carrito |
| POST | `/api/newsletter/subscribe` | Suscripcion |

### Admin General
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| POST | `/api/admin/historias` | Generar historias |
| GET | `/api/admin/clientes` | Listar clientes |
| GET | `/api/admin/stats` | Estadisticas |
| GET | `/api/admin/diagnostico` | Diagnostico |
| POST | `/api/admin/imagen/generar` | Generar imagen |
| POST | `/api/admin/voz/generar` | Generar voz |
| POST | `/api/admin/emails/masivo` | Email masivo |
| POST | `/api/admin/formularios/enviar` | Enviar formulario |

### Cron Jobs (API)
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| GET | `/api/tito/sync` | Sync Tito |
| GET | `/api/experiencias/procesar` | Procesar experiencias |
| GET | `/api/admin/circulo/cron` | Cron Circulo |
| GET | `/api/cron/recordatorio-racha` | Recordatorio racha |
| GET | `/api/cron/guardian-intelligence` | GI diario |
| GET | `/api/cron/generar-actividad-diaria` | Actividad diaria |
| GET | `/api/cron/duende-semana-rotacion` | Rotacion semanal |

### Otros
| Metodo | Endpoint | Funcion |
|--------|----------|---------|
| GET | `/api/qr/[id]` | Generar QR |
| GET | `/api/pdf/[id]` | Generar PDF |
| POST | `/api/regalos/crear` | Crear regalo |
| POST | `/api/regalos/canjear` | Canjear regalo |
| POST | `/api/referidos/generar-codigo` | Codigo referido |
| POST | `/api/referidos/aplicar` | Aplicar referido |
| POST | `/api/auth/magic-link` | Auth magic link |
| GET | `/api/senal/diaria` | Senal diaria |

---

## 15. PAGINAS FRONTEND (NEXT.JS)

| Ruta | Archivo | Funcion |
|------|---------|---------|
| `/` | `app/page.js` | Home (redirect a duendesdeluruguay.com) |
| `/admin` | `app/admin/page.jsx` | Dashboard admin |
| `/admin/canalizaciones` | `app/admin/canalizaciones/page.jsx` | Panel canalizaciones |
| `/admin/generador-historias` | `app/admin/generador-historias/page.jsx` | Generador historias |
| `/admin/circulo` | `app/admin/circulo/page.jsx` | Admin Circulo |
| `/admin/tito` | `app/admin/tito/page.jsx` | Admin Tito |
| `/admin/clientes` | `app/admin/clientes/page.jsx` | Clientes |
| `/admin/productos` | `app/admin/productos/page.jsx` | Productos |
| `/admin/gamificacion` | `app/admin/gamificacion/page.jsx` | Gamificacion |
| `/admin/imagenes` | `app/admin/imagenes/page.jsx` | Imagenes AI |
| `/admin/contenido` | `app/admin/contenido/page.jsx` | Contenido |
| `/admin/comunidad` | `app/admin/comunidad/page.jsx` | Comunidad |
| `/admin/voz` | `app/admin/voz/page.jsx` | Generador voz |
| `/admin/modo-dios` | `app/admin/modo-dios/page.jsx` | Control total |
| `/mi-magia` | `app/mi-magia/page.jsx` | Portal cliente |
| `/circulo/landing` | `app/circulo/landing/page.jsx` | Landing Circulo |
| `/formulario/[token]` | `app/formulario/[token]/page.jsx` | Formulario post-compra |
| `/certificado/[id]` | `app/certificado/[id]/page.jsx` | Certificado digital |
| `/lectura/[id]` | `app/lectura/[id]/page.js` | Lectura/canalizacion |
| `/guardian/[id]` | `app/guardian/[id]/page.js` | Perfil guardian |

**Auth admin:** Todos los paneles admin usan `ADMIN_SECRET` = `DuendesAdmin2026`

---

## 16. CRON JOBS AUTOMATICOS

Configurados en `vercel.json`:

| Endpoint | Frecuencia | Que hace |
|----------|-----------|----------|
| `/api/tito/sync` | Cada hora | Sincroniza datos de Tito (productos, cache) |
| `/api/experiencias/procesar` | Cada 10 min | Procesa experiencias pendientes |
| `/api/admin/circulo/cron` | Diario 9 AM | Genera contenido diario del Circulo |
| `/api/cron/recordatorio-racha` | Diario 8 PM | Envia recordatorios de racha |
| `/api/cron/guardian-intelligence` | Diario 10 AM | Analisis de productos |
| `/api/cron/generar-actividad-diaria` | 8 AM, 2 PM, 8 PM | Genera actividad comunidad |
| `/api/cron/duende-semana-rotacion` | Lunes 00:00 | Rota guardian de la semana |

---

## 17. WEBHOOKS

### WooCommerce → Vercel

| Webhook ID | Evento | URL Destino |
|------------|--------|-------------|
| 4 | product.updated | /api/webhooks/woocommerce |
| 5 | product.created | /api/webhooks/woocommerce |
| 6 | product.deleted | /api/webhooks/woocommerce |
| (manual) | order.created | /api/webhooks/woocommerce |

**Secret:** `duendes_wh_2026_x7Kp9mNqR3sT5vW8yB2dF4gH6jL`
**Verificacion:** HMAC-SHA256 via header `X-WC-Webhook-Signature`

### Que hace el webhook de ordenes
1. Verifica firma HMAC
2. Chequea anti-duplicado (`orden:procesada:{id}`)
3. Detecta productos: guardianes, runas, membresias
4. Crea borrador de canalizacion
5. Envia email de formulario al cliente
6. Crea tarjeta QR
7. Otorga XP de gamificacion

### Que hace el webhook de productos
1. Invalida cache de Tito (local + KV distribuido)
2. Actualiza datos si es update
3. Remueve si es delete

---

## 18. SISTEMA DE EMAILS

### Canales de envio

| Canal | Uso | Config |
|-------|-----|--------|
| **Gmail SMTP** (nodemailer) | Emails principales | `GMAIL_USER` + `GMAIL_APP_PASSWORD` |
| **Resend API** | Fallback | `RESEND_API_KEY` |
| **Brevo API** | Formularios post-compra (template #15) | API key en codigo |
| **WordPress wp_mail** | Emails desde plugins WP | Config WP default |

### Tipos de email

| Email | Trigger | Servicio |
|-------|---------|----------|
| Formulario post-compra | Webhook order.created | Brevo (template #15) |
| Recordatorio formulario 24h | Cron | Gmail/Resend |
| Recordatorio formulario 72h | Cron | Gmail/Resend |
| Bienvenida nuevo usuario | user_register (WP) | wp_mail |
| Compra completada | woocommerce_order_status_completed | wp_mail |
| Carrito abandonado (x4) | Cron cada X horas | wp_mail |
| Formulario contacto | Elementor form submit | wp_mail |
| Subida de nivel | Gamificacion | Gmail/Resend |
| Magic link | Mi Magia login | Gmail/Resend |

### Template base
- Fondo: #1a1a2e
- Dorado: #d4af37
- Logo: "Duendes del Uruguay"
- From: info@duendesdeluruguay.com o hola@duendesdeluruguay.com

---

## 19. SISTEMA DE PRECIOS Y MONEDAS

### Precios base: USD

Todos los productos tienen precio en USD en WooCommerce.

### Uruguay: tabla fija (no depende de cotizacion)

| USD | UYU |
|-----|-----|
| $70 (Mini) | $2.500 |
| $150 | $5.500 |
| $200 | $8.000 |
| $350 | $12.500 |
| $450 | $16.500 |
| $650 | $24.500 |
| $1.050 | $39.800 |
| $2.100 | $79.800 |

### Otros paises: USD + moneda local (aproximado)

- Tasas de exchangerate-api.com (cache 6 horas)
- Fallback hardcoded si API falla
- Paises dolarizados (US, EC, PA, SV): solo USD

### Envio gratis

| Destino | Umbral |
|---------|--------|
| Internacional | USD $1.000+ |
| Uruguay | UYU $10.000+ |

### Envios

| Destino | Metodo | Tiempo |
|---------|--------|--------|
| Uruguay | DAC | 3-7 dias |
| Internacional | DHL Express | 5-10 dias |

---

## 20. GAMIFICACION

### Monedas virtuales
- **Runas**: moneda principal (se ganan comprando, participando, etc.)
- **Treboles**: moneda secundaria/premium

### Mecanicas
- XP por compras y participacion
- Niveles
- Badges/insignias
- Cofre diario
- Leaderboard
- Racha diaria (con recordatorios)
- Lecturas canjeables por runas

### Archivos
- Config: `lib/gamificacion/config.js`
- API: `app/api/gamificacion/*`
- Admin: `app/admin/gamificacion/page.jsx`
- Storage: `gamificacion:{email}` en KV

---

## 21. EL CIRCULO (MEMBRESIA)

### Que es
Membresia premium con contenido exclusivo diario.

### Estado actual: PAUSADO (enero 2026)

### Funcionalidades

| Feature | Descripcion |
|---------|-------------|
| Guardian del dia | Un guardian diferente cada dia con mensaje |
| Guardian de la semana | Rotacion semanal (cron lunes) |
| Contenido diario | Generado por IA (cron 9 AM) |
| Cursos | Progreso por modulos |
| Foro | Posts con comentarios + bots IA |
| Comunidad | Actividad automatica generada |
| Sincronicidad | Eventos personalizados |
| Rituales | Rituales diarios/lunares |

### Archivos
- Config: `lib/circulo/config.js`
- API: `app/api/circulo/*`
- Admin: `app/api/admin/circulo/*`
- Landing: `app/circulo/landing/page.jsx`
- Storage: `circulo:{email}` en KV

---

## 22. MI MAGIA (PORTAL DEL CLIENTE)

### Que es
Portal post-compra donde el cliente ve sus guardianes, canalizaciones, certificados.

### URL
- `https://duendesdeluruguay.com/mi-magia`
- O: `magia.duendesdeluruguay.com` (subdominio → rewrite)

### Acceso
- Magic link por email (30 dias de validez)
- Token en URL

### Funcionalidades
- Ver sus guardianes comprados
- Leer canalizaciones recibidas
- Certificado digital
- Gamificacion (runas, treboles, nivel)
- Diario/Grimorio personal
- Perfil editable

### Archivos
- Frontend: `app/mi-magia/page.jsx`
- API: `app/api/mi-magia/*`
- WP plugin: `duendes-mi-magia.php`

---

## 23. GUARDIAN INTELLIGENCE

### Que es
Sistema de IA que analiza, mejora y genera contenido para productos automaticamente.

### Funcionalidades
- Analizar calidad de productos (imagenes, descripciones, SEO)
- Generar descripciones optimizadas
- Detectar stock bajo
- Sugerir promociones
- Cross-selling automatico
- Reportes diarios
- Corregir tamanos y datos

### Archivos
- Lib: `lib/guardian-intelligence/*`
- API: `app/api/guardian-intelligence/*`
- WP plugin: `guardian-intelligence-simple.php`
- Cron: Diario 10 AM

---

## 24. SEO

### Archivos
- `lib/seo/index.js` - Exports
- `lib/seo/metadata.js` - Metadata generation
- `lib/seo/schema.js` - Schema.org JSON-LD
- `lib/seo/tags-generator.js` - Meta tags
- `lib/seo/rankmath.js` - Integracion Rank Math
- `app/components/SchemaMarkup.jsx` - Componente React

### Configuracion en layout.js
- metadataBase: duendesdeluruguay.com
- OpenGraph images: og-image.jpg (1200x630)
- Locale: es_UY
- Keywords: duendes, guardianes, artesania, Piriapolis, etc.

### Otros
- `robots.txt` en /public
- `site.webmanifest` para PWA
- Redirects /shop → /tienda
- No trailing slashes

---

## 25. SCRIPTS UTILITARIOS

Ubicacion: `/scripts/`

| Script | Funcion |
|--------|---------|
| `configure-webhooks.js` | Configurar webhooks WooCommerce via API |
| `subir-plugins-wp.sh` | Subir plugins via SFTP |
| `esperar-y-subir.sh` | Esperar y subir archivo via SFTP |
| `generar-contenido-enero-2026.js` | Generar contenido del mes |
| `generar-historias-bulk.js` | Historias en lote |
| `generar-historias-completo.js` | Historias completas |
| `seed-circulo-enero.js` | Seed enero Circulo |
| `seed-contenido-enero.js` | Seed contenido enero |
| `seed-comunidad-inicial.js` | Seed comunidad |
| `seed-curso-febrero-2026.js` | Seed curso febrero |
| `seo-bulk-update.mjs` | Actualizar SEO en lote |
| `sync-contenido-kv.js` | Sync contenido a KV |
| `sync-todo-real.js` | Sync total |
| `subir-historias-v2.js` | Subir historias a WooCommerce |
| `fix-duendes-reales.js` | Fix datos de guardianes reales |
| `fix-imagenes-expiradas.js` | Fix imagenes expiradas |
| `verificar-sistema.js` | Verificar todo el sistema |
| `test-webhook-membresias.js` | Test webhooks membresias |
| `test-webhook-runas.js` | Test webhooks runas |
| `crear-membresias-circulo.php` | Crear membresias (WP) |
| `crear-productos-runas.php` | Crear productos runas (WP) |
| `borrar-membresias-antiguas.php` | Limpiar membresias viejas |
| `borrar-runas-antiguas.php` | Limpiar runas viejas |

---

## 26. CREDENCIALES Y ACCESOS

### WordPress Admin
- URL: `https://duendesdeluruguay.com/wp-admin`
- Email: `tbrylka89@gmail.com`
- App Password (API): `fAeb 8wHT zGPD nZO4 6CHn i09X`

### WooCommerce REST API
- Consumer Key y Secret: en Vercel env vars
- Webhook Secret: `duendes_wh_2026_x7Kp9mNqR3sT5vW8yB2dF4gH6jL`

### Vercel
- Team: duendes-del-uruguay
- Proyecto: duendes-vercel
- Admin: via dashboard Vercel

### Upstash Redis (KV)
- URL: `https://choice-llama-9731.upstash.io`
- Dashboard: console.upstash.com

### SFTP (servidor WordPress)
- Host: 34.70.139.72:55309
- User: sftp_live_WfP6i
- Pass: JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR

### Email
- Gmail: info@duendesdeluruguay.com
- Admin inbox: duendesdeluruguay@gmail.com

### GitHub
- Repo: github.com/tbrylka89-sudo/duendes-canalizacion
- Deploy: auto en push a main

### Admin Panels (Vercel)
- Password: `DuendesAdmin2026`
- URL base: `https://duendes-vercel.vercel.app/admin`

---

## 27. FLUJO COMPLETO DE UNA COMPRA

```
1. CLIENTE VISITA LA WEB
   duendesdeluruguay.com → WordPress + Elementor
   Tito widget aparece → duendes-tito-widget.php → API /api/tito/v3

2. CLIENTE NAVEGA LA TIENDA
   /shop/ → WooCommerce con estilos custom
   Banners inteligentes → duendes-fabrica-banners.php
   Precios segun pais → duendes-precios-v3.php

3. AGREGA AL CARRITO
   Avisos 3x2 → duendes-avisos-carrito.php
   Progreso envio gratis → barra de progreso visual
   Si abandona → email secuencia 2h/24h/48h/72h

4. CHECKOUT
   Pregunta "¿Quien recibe?" → duendes-formulario-canalizacion.php
   4 opciones: para_mi, regalo_sabe, regalo_sorpresa, para_nino

5. PAGO Y CONFIRMACION
   WooCommerce procesa pago
   Webhook order.created → /api/webhooks/woocommerce
   Se crea borrador canalizacion en KV
   Se envia email formulario via Brevo (template #15)

6. CLIENTE LLENA FORMULARIO
   Link en email → /api/formulario/{token}
   Preguntas: nombre, momento vida, necesidades, foto
   Se guarda en form_data:{token}

7. GENERACION DE CANALIZACION
   Automatica o manual desde admin panel
   Claude Sonnet 4 genera texto personalizado
   Usa datos del formulario + producto + contexto paralelo

8. ADMIN REVISA
   Panel /admin/canalizaciones
   Puede editar con Chat Editor
   Aprueba y envia

9. CLIENTE RECIBE
   Email con canalizacion
   Disponible en Mi Magia (/mi-magia)
   Certificado en /api/certificado?order=X

10. POST-COMPRA
    Gamificacion: gana runas, XP, sube de nivel
    Mi Magia: ve sus guardianes, lecturas, grimorio
    Circulo: puede unirse a la membresia
```

---

## 28. PROBLEMAS CONOCIDOS Y LECCIONES

### Problemas resueltos

| Problema | Solucion | Archivo |
|----------|----------|---------|
| Cache web 2.5s TTFB | Multi Currency fix + headers | wmc-cache-fix.php + duendes-cache-headers.php |
| Tito no convertia precios cuando decian pais | Deteccion directa en backend, sin llamar a Claude | app/api/tito/v3/route.js |
| Chat Editor no aplicaba cambios | Fix parser JSON con brace-counting | app/api/admin/canalizaciones/chat/route.js |
| Canalizaciones inventaban nombres de guardianes | Seccion "La comunidad" generica, prohibicion explicita | app/api/admin/canalizaciones/route.js |
| Altar hablaba como personaje | Admin note override + deteccion accesorios | app/api/admin/canalizaciones/route.js |
| Formularios Elementor no enviaban email | Re-activar duendes-elementor-emails.php | Renombrar .OLD a .php |
| Digits 0-9 matcheaban como emoji | Excluir digitos del regex de spam | app/api/tito/v3/route.js |

### Lecciones tecnicas

1. **Elementor ignora `the_content` filter** - Usar `template_redirect` con `get_header()/get_footer()`
2. **No usar output buffering global en WP** - Rompe menu hamburguesa y JS
3. **Para forzar estilos sobre Elementor** - `!important` + JS con `element.style.setProperty`
4. **mu-plugins no tienen UI de activacion** - Renombrar a `.php.DISABLED` para desactivar
5. **Gemini API key tiene `\n` al final** - Puede causar errores si no se limpia
6. **Brevo API key puede tener `\n` trailing** - Mismo problema
7. **WooCommerce Store API es publica** - Productos se pueden leer sin auth
8. **Vercel KV es Upstash Redis** - Se puede acceder con REST API o Redis protocol

---

*Documento generado el 31 de enero de 2026.*
*Para actualizarlo, pedir a Claude que analice los cambios recientes.*
