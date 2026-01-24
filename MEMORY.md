# MEMORIA DEL PROYECTO - ÚLTIMA ACTUALIZACIÓN: 2026-01-24 (sesión 12 - COMPLETADA)

Este archivo se lee automáticamente. Contiene TODO lo que necesitás saber para continuar el trabajo.

---

## ESTADO ACTUAL

### Sistema de Generación de Historias: ✅ FUNCIONANDO
- **Ubicación UI:** `/admin/generador-historias`
- **API:** `/api/admin/historias`
- **Sistema de conversión:** `/lib/conversion/`

### Panel de Canalizaciones: ✅ COMPLETADO
- **Lista:** `/admin/canalizaciones` - Tabs: Pendientes/Aprobadas/Enviadas
- **Detalle:** `/admin/canalizaciones/[id]` - Preview + Resumen IA + Chat Editor
- **APIs:**
  - `/api/admin/canalizaciones` - CRUD completo
  - `/api/admin/canalizaciones/chat` - Chat inteligente para modificar
  - `/api/admin/canalizaciones/resumen` - Resumen ejecutivo IA
- **Flujo:** Compra → Genera auto → Pendiente → Aprobar → Enviar → Mi Magia

### Test del Guardián: ✅ CON PERFILADO PSICOLÓGICO
- **UI:** `/app/mi-magia/test-guardian.js` - Chat con Tito
- **API:** `/api/test-guardian` - Preguntas y procesamiento
- **Perfilado:** `/lib/circulo/perfilado.js` - Calcula vulnerabilidad, dolor, estilo decisión, creencias
- **Integración Tito:** El chat de Tito ahora adapta sus respuestas según el perfil psicológico del usuario

---

## VISIÓN EXPERTO: LO QUE FALTA PARA SISTEMA COMPLETO

### Prioridad Alta (Impacto directo en conversión)

| Feature | Estado | Descripción |
|---------|--------|-------------|
| **Perfilado del Comprador** | ✅ COMPLETADO | `/lib/circulo/perfilado.js` - Clasifica: vulnerabilidad (alta/media/baja), dolor (soledad/dinero/salud/relaciones/proposito), estilo decisión (impulsivo/analitico/emocional), creencias (creyente/buscador/esceptico). Integrado en Tito. |
| **Historias con Cierres Adaptativos** | ⚠️ Parcial | Historia fija + 3 cierres por perfil (vulnerable/escéptico/impulsivo) |
| **Objeciones Preemptivas** | ❌ Pendiente | Responder "es solo un muñeco", "es caro", "no creo" dentro de la historia |
| **Loop Abierto Obligatorio** | ❌ Pendiente | Cada historia debe tener algo incompleto que la compra cierra |

### Prioridad Media (Optimización)

| Feature | Estado | Descripción |
|---------|--------|-------------|
| **Motor Sincronicidad Personalizada** | ❌ Pendiente | Señales basadas en datos: día de la semana, hora, nombre, cumpleaños |
| **Secuencia Micro-compromisos** | ❌ Pendiente | Test → Email → Preview → Seña → Compra (escalado gradual) |
| **Sistema Escasez Real** | ⚠️ Parcial | "X personas mirando", "última vez disponible hace X días" |
| **Hooks Rotativos con Tracking** | ⚠️ Parcial | Biblioteca de hooks + tracking de cuál convierte más |

### Prioridad Baja (Post-MVP)

| Feature | Estado | Descripción |
|---------|--------|-------------|
| **Post-compra que Multiplica** | ❌ Pendiente | Ritual activación, diario señales, comunidad, cross-sell espiritual |
| **Recuperación Abandonos** | ❌ Pendiente | Emails: 1h, 24h, 72h, 1 semana con mensajes personalizados |
| **Analytics Conversión Emocional** | ❌ Pendiente | Dashboard: qué historias/hooks convierten, dónde abandonan, A/B testing |
| **Testimonios Estratégicos** | ❌ Pendiente | Por objeción: escéptico, sin plata, coleccionista, dudoso |

### Regla Clave: Historia Fija, Contexto Adaptativo

```
FIJO (todos ven igual)          | ADAPTATIVO (privado, cada uno diferente)
--------------------------------|------------------------------------------
Historia del guardián           | Resultado del test
Descripción del producto        | Emails de seguimiento
Sincrodestino de creación       | "Señales" basadas en sus datos
Su mensaje                      | Recomendaciones personalizadas
Precio                          | Orden en que ve productos
```

---

## DECISIONES TOMADAS (NO CAMBIAR SIN RAZÓN)

### 1. Especialización Manual
**Decisión:** El usuario elige la especialización antes de generar (no se detecta automáticamente).
**Razón:** Las categorías del catálogo de WooCommerce no son confiables.
**Implementación:** Chips de selección en el generador + campo de texto libre.

### 2. Pain Points por Especialización
**Decisión:** Cada especialización tiene sus propios dolores específicos.
**Razón:** Una historia de fortuna/suerte no puede hablar de "no saber decir que no" (eso es protección).
**Implementación:** `/lib/conversion/especializaciones.js` con 10 especializaciones completas.

### 3. Recreables vs Únicos
**Decisión:**
- **Únicos:** Pixies + tamaños grandes (>15cm) → usar "pieza única, desaparece"
- **Recreables:** Tamaños pequeños (≤15cm) excepto pixies → usar "el guardián te elige a vos"
**Razón:** No mentir sobre escasez. Los mini se pueden recrear.
**Implementación:** `esUnico = especie === 'pixie' || cm > 15` (usa el tamaño en cm, no el string del tamaño)

### 4. Branding "Los Elegidos"
**Decisión:**
- Duendes = también "guardianes"
- Clientes = "Los Elegidos" (el guardián los elige)
**Razón:** Hacer que el cliente se sienta especial, parte de algo.
**Implementación:** Agregado al prompt en `/api/admin/historias/route.js`

### 5. Score de Conversión
**Decisión:** Mínimo 30/50 para aprobar una historia.
**Dimensiones:** Identificación, Dolor, Solución, Urgencia, Confianza (0-10 cada una).
**Problema actual:** Urgencia da 0 en recreables porque no pueden decir "pieza única".

---

## INTEGRACIONES DE IA DISPONIBLES

| API | Variable | Estado | Usos |
|-----|----------|--------|------|
| **Claude** | `ANTHROPIC_API_KEY` | ✅ | Historias, contenido Círculo, cursos |
| **OpenAI/DALL-E** | `OPENAI_API_KEY` | ✅ | Imágenes para contenido y cursos |
| **Replicate** | `REPLICATE_API_TOKEN` | ✅ | Flux, SDXL, video (Minimax, Luma, Kling) |
| **Gemini** | `GEMINI_API_KEY` | ✅ | Cursos alternativos, imágenes Nano Banana |
| **WP Media** | `WP_APP_PASSWORD` | ❌ | Subir archivos a WordPress |

### Endpoints de generación de imágenes:
- `/api/admin/imagen/replicate` - 20+ modelos (Flux, SDXL, Ideogram, Recraft, video)
- `/api/admin/imagen/gemini` - Gemini 2.0 Flash (requiere GEMINI_API_KEY)
- `/api/admin/circulo/generar-contenido-pro` - DALL-E 3 para Círculo

### Endpoint de cursos:
- `/api/admin/cursos/generar-con-ia` - Genera cursos completos con Gemini o Claude + imágenes DALL-E

### Panel Maestro del Círculo:
- `/admin/circulo/maestro` - UI para explorar Replicate, generar cursos, etc.

---

## ARCHIVOS CLAVE

| Archivo | Qué hace |
|---------|----------|
| `/CLAUDE.md` | Biblia del proyecto - reglas de contenido |
| `/MEMORY.md` | Este archivo - estado y decisiones |
| `/CODIGO-MAESTRO.md` | Guía para reconstruir el sistema |
| `/lib/conversion/index.js` | Exporta todo el sistema de conversión |
| `/lib/conversion/especializaciones.js` | Pain points por tipo de guardián |
| `/lib/conversion/hooks.js` | Frases de apertura por categoría |
| `/lib/conversion/arco.js` | Estructura de 8 fases emocionales |
| `/lib/conversion/scoring.js` | Sistema de puntuación 0-50 |
| `/lib/conversion/sincrodestinos.js` | Eventos mágicos creíbles |
| `/app/api/admin/historias/route.js` | API principal de generación |
| `/app/admin/generador-historias/page.jsx` | UI del generador |
| `/app/api/admin/corregir-producto/route.js` | API corrección ortográfica con Claude Haiku |
| `/lib/parsers/texto-producto.js` | Parser inteligente de texto libre para productos |
| `/app/api/admin/historias/temas-aprendidos/route.js` | API de auto-aprendizaje de temas |
| `/temp-plugin/duendes-corregir-ortografia.php` | Plugin WordPress para corrección in-product |
| `/app/admin/corregir-productos/page.jsx` | UI alternativa para corregir productos (usa diccionario) |
| `/app/admin/canalizaciones/page.jsx` | Lista de canalizaciones (tabs por estado) |
| `/app/admin/canalizaciones/[id]/page.jsx` | Detalle: Preview + Resumen IA + Chat Editor |
| `/app/api/admin/canalizaciones/route.js` | API CRUD canalizaciones |
| `/app/api/admin/canalizaciones/chat/route.js` | Chat inteligente para editar canalizaciones |
| `/app/api/admin/canalizaciones/resumen/route.js` | Genera resumen ejecutivo con IA |
| `/app/mi-magia/test-guardian.js` | UI Test del Guardián (chat con Tito) |
| `/lib/circulo/perfilado.js` | Sistema de perfilado psicológico completo |
| `/app/api/tito/chat/route.js` | Chat Tito CON perfilado psicológico integrado |
| `/app/api/webhooks/woocommerce/route.js` | Webhook UNIFICADO de WooCommerce |
| `/app/api/cron/duende-semana-rotacion/route.js` | CRON rotación duende de la semana |
| `/app/api/emails/micro-compromisos/route.js` | API secuencia micro-compromisos |
| `/lib/circulo/duendes-semanales-2026.js` | 6 guardianes maestros con historias y rotación semanal |
| `/scripts/generar-contenido-enero-2026.js` | 23 días de contenido pre-generado enero 2026 |
| `/app/api/admin/circulo/seed-enero/route.js` | API para poblar KV con contenido de enero |
| `/app/mi-magia/circulo/Dashboard.jsx` | Dashboard del Círculo con guardián de la semana |
| `/app/api/comunidad/bots/route.js` | Sistema de bots del foro (50 perfiles, 62+ posts) |
| `/wordpress-plugins/duendes-hub-control.php` | Plugin WP Hub v3.0 - Panel central con todas las URLs |

---

## BUGS CONOCIDOS / PENDIENTES

### ~~3. Hooks usaban categoría del catálogo~~ ✅ RESUELTO
**Problema:** Los hooks se seleccionaban con la categoría del catálogo (ej: "Protección") en lugar de la especialización elegida (ej: "fortuna").
**Solución:** Ahora `getRandomHook()` usa `especializacion || categoria` - prioriza la especialización elegida.

### ~~1. Urgencia en Recreables~~ ✅ RESUELTO
**Problema:** Score de urgencia da 0 porque no pueden usar "pieza única".
**Solución:** Agregadas keywords de urgencia para recreables + urgencia real de stock ("cuando se van pueden pasar semanas").

### ~~2. Hook no siempre relevante~~ ✅ RESUELTO
**Problema:** A veces el hook de apertura no matchea con la especialización elegida.
**Solución:** Creados hooks específicos para FORTUNA + mapeo completo de categorías.

---

## ESPECIALIZACIONES DISPONIBLES

| ID | Nombre | Dolor principal |
|----|--------|-----------------|
| `fortuna` | Fortuna y Suerte | La suerte te esquiva, oportunidades pasan |
| `proteccion` | Protección | Cargás con todo, no sabés decir que no |
| `amor_romantico` | Amor | Corazón cerrado, miedo a confiar |
| `amor_propio` | Amor Propio | No te querés, te criticás mucho |
| `sanacion` | Sanación | No podés soltar el pasado |
| `calma` | Paz y Serenidad | Mente que no para, ansiedad |
| `abundancia` | Prosperidad | El dinero nunca alcanza |
| `sabiduria` | Sabiduría | No sabés qué decisión tomar |
| `transformacion` | Transformación | Querés cambiar pero no sabés cómo |
| `alegria` | Alegría | Olvidaste cómo se siente la alegría |
| `viajeros` | Viajeros | Necesitás cambio de dirección, nuevos horizontes |
| `bosque` | Bosque/Naturaleza | Reconexión con la tierra, equilibrio natural |

### SUB-ESPECIALIZACIONES (para futuro o texto libre)

Cada categoría tiene CAPAS. No es genérico:

**Sanación:**
- Física (cuerpo, enfermedad)
- Emocional (heridas del corazón)
- Espiritual (vacío existencial)
- Psicológica (traumas, patrones)
- Transgeneracional (lo heredado de familia)
- Patrones que se repiten (siempre lo mismo)
- Psicosomática (cuerpo habla lo que mente calla)

**Amor:**
- Propio (no me quiero)
- De pareja (buscar/sanar relación)
- De hijos (ser madre/padre)
- A la vida (ganas de vivir)
- Duelos (pérdidas de amor)

**Protección:**
- Energética (absorbo todo)
- Del hogar (mi casa, mi espacio)
- De otros (cuido a mi familia)
- Límites (no sé decir que no)

**Cuando el usuario usa texto libre en el selector**, puede especificar estos matices. El sistema debe respetarlos.

---

## DEMANDA REAL DEL MERCADO

Lo que la gente PIDE (para tener en cuenta al generar historias):

| Especialidad | Notas |
|--------------|-------|
| **Estudio** | Estudiantes, exámenes, concentración, memoria |
| **Negocios** | Emprendedores, comercio, ventas, clientes |
| **Protector del auto** | Luke mini es el ejemplo. Protección de vehículos |
| **Protector de niños** | Muy pedido. Cuidar a los hijos |
| **Vigilante** | MUY pedido. PERO: nosotros NO hacemos los de 2-3 caras (eso es molde horrible). Nuestros vigilantes son únicos, no necesitan caras múltiples |
| **Deseos** | Duendes que ayudan a manifestar deseos |
| **Abrecaminos** | TODO duende con LLAVE es abrecaminos (además de su otra especialidad) |
| **Meditadores / Zen** | Calma, mindfulness, paz interior |
| **Duelos** | Acompañar pérdidas, despedidas |

### Reglas de combinación:
- **Llave = Abrecaminos** automáticamente (además de lo que sea)
- **Vigilante ≠ 3 caras** - eso es de moldes horribles, nosotros no
- Un guardián puede tener MÚLTIPLES especialidades

### Posición de marca:
- No seguimos modas de moldes feos
- Cada pieza es única, hecha a mano
- Nuestros vigilantes son diferentes (y mejores) que los de 3 caras

---

## CHIPS DE ESPECIALIZACIÓN (UI)

**Ubicación:** `/admin/generador-historias` → Paso 14

**9 grupos con 70+ especialidades:**

| Grupo | Chips |
|-------|-------|
| ⭐ Más Pedidos | Fortuna, Protección, Abundancia, Sanación, Abrecaminos, Vigilante |
| 💕 Amor | Pareja, Propio, Hijos, Maternidad, Fertilidad, Familia, Amistades, Reconciliación, Soledad |
| 🌿 Sanación | Emocional, Transgeneracional, Física, Psicosomática, Duelos, Patrones, Adicciones, Traumas |
| 🛡️ Protección | Energética, Hogar, Niños, Auto, Viajes, Mascotas, Límites, Envidias |
| 💼 Trabajo | Negocios, Emprendimiento, Buscar Trabajo, Entrevistas, Liderazgo, Creatividad, Deudas, Clientes |
| 📚 Estudio | Estudio, Exámenes, Memoria, Concentración, Sabiduría, Intuición, Claridad |
| 🧘 Bienestar | Calma, Ansiedad, Insomnio, Meditación, Alegría, Energía, Confianza |
| 🦋 Cambios | Transformación, Nuevos Comienzos, Mudanza, Separación, Jubilación, Desapego, Miedos |
| ✨ Espiritual | Conexión, Deseos, Sueños, Propósito, Gratitud |

**Siempre hay campo de texto libre** para especialidades no listadas.

---

## ÚLTIMAS SESIONES

### 2026-01-24 (sesión 13) - COMPLETADA

**🔧 FIX CRÍTICO: PLUGIN HUB DUPLICADO + ACTUALIZACIÓN v3.0**

1. **DIAGNÓSTICO DE ERROR CRÍTICO** ✅
   - WordPress mostraba pantalla blanca "critical error"
   - Activé WP_DEBUG temporalmente para ver el error real
   - **Error:** `Cannot declare class DuendesHubControl, because the name is already in use`
   - **Causa:** Había DOS copias del plugin Hub:
     - `mu-plugins/duendes-hub-control.php` ✓ (activo, 34KB)
     - `plugins/duendes-hub-control.php` ✗ (duplicado viejo, 22KB)

2. **SOLUCIÓN** ✅
   - Renombrado duplicado a `plugins/duendes-hub-control.php.DUPLICADO`
   - WordPress volvió a funcionar
   - Restaurado wp-config.php sin debug

3. **HUB v3.0 SUBIDO EXITOSAMENTE** ✅
   - **Archivo:** `/wordpress-plugins/duendes-hub-control.php`
   - Nuevas secciones:
     - 🌟 Guardianes Maestros del Círculo (6 guardianes con badges de colores)
     - 🔌 APIs del Círculo (contenido, duende-semana, seed-enero, bots)
     - 🤖 Tabla de Integraciones IA (Claude, DALL-E, Gemini, Replicate)
   - Acceso rápido: Panel Maestro con botón jade
   - Referencia rápida actualizada para enero 2026

**Archivos afectados:**
| Archivo | Acción |
|---------|--------|
| `mu-plugins/duendes-hub-control.php` | ACTUALIZADO a v3.0 (37KB) |
| `plugins/duendes-hub-control.php` | RENOMBRADO a .DUPLICADO |
| `wp-config.php` | Restaurado (WP_DEBUG=false) |

**Lección aprendida:** Nunca tener el mismo plugin en `mu-plugins/` Y `plugins/` - PHP no puede declarar la misma clase dos veces.

---

### 2026-01-24 (sesión 12) - COMPLETADA

**🚀 SISTEMA SEO COMPLETO IMPLEMENTADO**

Sistema SEO profesional para visibilidad óptima en buscadores.

**1. ROBOTS.TXT** ✅
- **Archivo:** `/public/robots.txt`
- Permite: /, /tienda
- Bloquea: /mi-magia/*, /lectura/*, /guardian/*, /certificado/*, /portal/*, /api/*, /admin/*
- Incluye referencia a sitemap

**2. SITEMAP.XML DINÁMICO** ✅
- **Archivo:** `/app/sitemap.js`
- Genera sitemap dinámicamente con productos de WooCommerce
- Prioridades: home (1.0), tienda (0.9), productos (0.8)
- Change frequency configurada
- URL: https://duendes-vercel.vercel.app/sitemap.xml

**3. METADATA SEO COMPLETO** ✅
- **Archivo:** `/lib/seo/metadata.js`
- Funciones: generateProductMetadata(), generatePageMetadata(), generatePrivateMetadata()
- OpenGraph completo (title, description, images, locale es_UY)
- Twitter Cards (summary_large_image)
- Canonical URLs
- Keywords optimizadas (16+ keywords)
- noindex/nofollow para páginas privadas

**4. SCHEMA MARKUP JSON-LD** ✅
- **Archivo:** `/lib/seo/schema.js`
- Organization schema (fundadora, dirección, logo)
- LocalBusiness/ArtStore schema (Piriápolis, geo coords)
- WebSite schema con SearchAction
- Product schema para productos
- BreadcrumbList schema
- ItemList/CollectionPage para tienda
- Componente: `/app/components/SchemaMarkup.jsx`

**5. RANKMATH 100/100 OPTIMIZATION** ✅
- **Archivo:** `/lib/seo/rankmath.js`
- generateRankMathMeta() - metadata completa para RankMath
- analyzeRankMathScore() - análisis 0-100 con sugerencias
- generateLSIKeywords() - keywords semánticamente relacionadas
- generateAltText() - alt text para imágenes
- generateInternalLinks() - enlaces internos sugeridos

**6. APIs SEO** ✅
- `/api/seo/analyze` - GET: Analiza SEO de producto, POST: Análisis masivo
- `/api/seo/bulk-update` - Actualización masiva de SEO en WooCommerce

**7. PÁGINAS DE PRODUCTO SEO** ✅
- **Archivo:** `/app/producto/[slug]/page.jsx`
- Server Component con generateMetadata() dinámico
- generateStaticParams() para pre-renderizar productos populares
- Schema JSON-LD de producto
- Breadcrumbs, imagen, precio, descripción, relacionados
- Helper: `/lib/woocommerce/api.js`

**8. CONFIGURACIÓN NEXT.JS** ✅
- **Archivo:** `next.config.js` actualizado
- Headers de seguridad (X-DNS-Prefetch-Control, X-Content-Type-Options, Referrer-Policy)
- poweredByHeader: false
- compress: true
- trailingSlash: false

**9. PWA MANIFEST** ✅
- **Archivo:** `/public/site.webmanifest`
- Nombre, descripción, colores de marca
- Iconos configurados

**Archivos creados:**
| Archivo | Descripción |
|---------|-------------|
| `/public/robots.txt` | Reglas para crawlers |
| `/public/site.webmanifest` | PWA manifest |
| `/app/sitemap.js` | Sitemap dinámico |
| `/lib/seo/metadata.js` | Funciones de metadata |
| `/lib/seo/schema.js` | Generadores JSON-LD |
| `/lib/seo/rankmath.js` | Optimización RankMath |
| `/lib/seo/index.js` | Exportaciones centralizadas |
| `/lib/woocommerce/api.js` | Helper API WooCommerce |
| `/app/components/SchemaMarkup.jsx` | Componente JSON-LD |
| `/app/producto/[slug]/page.jsx` | Página de producto |
| `/app/tienda/layout.js` | SEO tienda |
| `/app/mi-magia/layout.js` | noindex páginas privadas |
| `/app/api/seo/analyze/route.js` | API análisis SEO |
| `/app/api/seo/bulk-update/route.js` | API actualización masiva |

**Verificaciones:**
- ✅ robots.txt accesible
- ✅ sitemap.xml generando productos
- ✅ OpenGraph tags en todas las páginas
- ✅ Twitter Cards funcionando
- ✅ JSON-LD inyectado (Organization, WebSite, LocalBusiness)
- ✅ PWA manifest accesible
- ✅ Canonical URLs configuradas

**Commit:** `Complete SEO system for optimal search engine visibility`

**10. PLUGIN HUB ACTUALIZADO v3.1** ✅
- **Archivo:** `/wordpress-plugins/duendes-hub-control.php`
- Nueva sección: Sistema SEO Completo
- Acceso rápido: robots.txt, sitemap.xml, PWA manifest
- APIs: /api/seo/analyze, /api/seo/bulk-update
- Páginas de producto: /producto/[slug]
- Lista de funcionalidades SEO implementadas
- Tabla de referencia rápida actualizada con SEO
- Botón de acceso rápido SEO/Sitemap

**11. IMÁGENES SEO CREADAS** ✅
- `/public/og-image.jpg` (1200x630) - OpenGraph principal
- `/public/og-image-square.jpg` (600x600) - Redes sociales
- `/public/icon-192.png` - PWA icon pequeño
- `/public/icon-512.png` - PWA icon grande
- Diseño: Gradiente azul místico + símbolo dorado + tipografía elegante

**12. FIX MAGIC LINK EMAIL** ✅
- **Problema:** El email no llegaba porque usaba dominio no verificado
- **Solución:** Cambiado a `info@duendesdeluruguay.com` (email verificado en Resend)
- **Archivos modificados:**
  - `/app/mi-magia/login/page.jsx` - Usa `/api/mi-magia/magic-link`
  - `/app/api/admin/clientes/crear/route.js`
  - `/app/api/mi-magia/magic-link/route.js`
  - `/app/api/lectura-ancestral/route.js`
  - `/app/api/generate/route.js`

**13. SEO BULK UPDATE WOOCOMMERCE** ✅
- Ejecutado bulk update de SEO para productos de WooCommerce
- Metadata RankMath actualizada: title, description, focus_keyword, schema, OpenGraph, Twitter
- Script disponible: `/scripts/seo-bulk-update.mjs`
- API: POST `/api/seo/bulk-update` con `{productIds: [...], dryRun: false}`

---

### 2026-01-24 (sesión 12) - COMPLETADA

**🔄 CÍRCULO: ACTUALIZACIÓN A DUENDES REALES DE LA TIENDA**

Se reemplazaron los guardianes inventados (Dorado, Obsidiana, Índigo, Jade) por duendes REALES de la tienda WooCommerce.

**Cambios realizados:**
1. **Guardianes Maestros actualizados** (`/lib/circulo/duendes-semanales-2026.js`)
   - Gaia (ID 2993) → Semana 1 - Protección/Tierra
   - Noah (ID 4145) → Semana 2 - Caminos/Soltar
   - Winter (ID 4520) → Semana 3 - Fuego Interior
   - Marcos (ID 4244) → Semana 4 - Sabiduría/Claridad

2. **Contenido enero reescrito** (`/scripts/generar-contenido-enero-2026.js`)
   - 23 días de contenido adaptados a las personalidades reales
   - Imágenes de los productos reales de WooCommerce
   - Frases y mensajes basados en las historias de los productos

3. **Hub WP actualizado** (`/wordpress-plugins/duendes-hub-control.php` v3.0)
   - Nueva sección Guardianes Maestros
   - Nueva sección APIs del Círculo
   - Tabla de integraciones IA

4. **Deploy y Seed ejecutados**
   - Commit: "Actualizar Círculo con duendes reales: Gaia, Noah, Winter, Marcos"
   - Vercel deploy: exitoso
   - Seed API: 23 días, 4 semanas actualizados en KV

**Fix crítico:** Se resolvió error de WordPress por plugin duplicado (`DuendesHubControl` declarada dos veces).

---

### 2026-01-24 (sesión 11) - COMPLETADA

**🎯 CÍRCULO DE DUENDES: SISTEMA COMPLETO ENERO 2026**

Sistema completo del Círculo de Duendes con contenido pre-generado para todo enero 2026.

**1. GUARDIANES MAESTROS** ✅ (ACTUALIZADO 24-ene con duendes REALES de la tienda)
- **Archivo:** `/lib/circulo/duendes-semanales-2026.js`
- 4 Guardianes REALES de la tienda WooCommerce + 2 pendientes:
  - **Gaia** (ID 2993) - Protección/Tierra (Semana 1: 1-7 enero) - "Ya tenés la fuerza"
  - **Noah** (ID 4145) - Protección/Caminos (Semana 2: 8-14 enero) - "El camino se hace caminando"
  - **Winter** (ID 4520) - Protección/Fuego (Semana 3: 15-21 enero) - "El poder interior se enciende"
  - **Marcos** (ID 4244) - Sabiduría (Semana 4: 22-31 enero) - "Mirá desde otro ángulo"
  - **Coral** - Amor (futuro, pendiente asignar duende real)
  - **Aurora** - Intuición (futuro, pendiente asignar duende real)
- Funciones exportadas: `obtenerGuardianPorFecha()`, `obtenerSemanaActual()`, `obtenerGuardianPorId()`
- Cada guardián tiene: historia real del producto, personalidad, temas, cristales, imagen de WooCommerce, color, saludo, despedida, frases típicas, productoWooCommerce (ID real)

**2. CONTENIDO PRE-GENERADO: 23 DÍAS** ✅
- **Archivo:** `/scripts/generar-contenido-enero-2026.js`
- 23 días completos (1-23 enero 2026)
- Cada día tiene: titulo, subtitulo, cuerpo, afirmacion, cierre, imagen, cristalDelDia
- Contenido escrito desde la perspectiva/personalidad de cada guardián
- Tipos de contenido: presentacion, afirmacion, ensenanza, ejercicio, ritual, reflexion, cierre

**3. SEED API** ✅
- **Archivo:** `/app/api/admin/circulo/seed-enero/route.js`
- Endpoint POST que guarda todo el contenido en Vercel KV
- Guarda en doble formato de keys para compatibilidad:
  - `circulo:contenido:2026:1:DIA`
  - `contenido:2026-01-DD`
- Guarda rotación semanal: `circulo:duende-semana:2026:1:SEMANA`
- Guarda guardianes maestros: `circulo:guardianes-maestros`
- **Ejecutado exitosamente:** 23 días, 4 semanas, 6 guardianes, 0 errores

**4. DASHBOARD ACTUALIZADO** ✅
- **Archivo:** `/app/mi-magia/circulo/Dashboard.jsx`
- Muestra guardián de la semana con imagen grande (280x280px)
- Cada contenido muestra autor guardián con foto y badge de tipo
- Botón sutil "Conocé más sobre [nombre]" que linkea a tienda
- Soporte para 3 formatos de contenido (cuerpo, secciones, mensaje)

**5. SISTEMA DE BOTS MEJORADO** ✅
- **Archivo:** `/app/api/comunidad/bots/route.js`
- 50 perfiles de bots con nombres latinoamericanos
- 62+ posts sobre los guardianes de enero
- Endpoints: stats, actividad, feed, posts
- Timestamps realistas con distribución exponencial

**6. DEPLOY Y VERIFICACIÓN** ✅
- Commit: `Complete Círculo de Duendes system for January 2026`
- Push a main: exitoso
- Deploy a Vercel: exitoso (https://duendes-vercel.vercel.app)
- Seed ejecutado: 23 días guardados
- APIs verificadas: contenidos (27 items), bots (348 miembros, 7 posts hoy)

**Archivos creados/modificados:**
| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `/lib/circulo/duendes-semanales-2026.js` | NUEVO | 6 guardianes maestros con historias completas |
| `/scripts/generar-contenido-enero-2026.js` | NUEVO | 23 días de contenido pre-generado |
| `/app/api/admin/circulo/seed-enero/route.js` | NUEVO | API para poblar KV con contenido |
| `/app/mi-magia/circulo/Dashboard.jsx` | MODIFICADO | Muestra guardián de la semana |
| `/app/api/comunidad/bots/route.js` | MODIFICADO | 50 bots + 62 posts |
| `/wordpress-plugins/duendes-hub-control.php` | ACTUALIZADO | Hub v3.0 con URLs del Círculo |

**7. PLUGIN HUB ACTUALIZADO v3.0** ✅
- Nueva sección: Guardianes Maestros del Círculo
- Nueva sección: APIs del Círculo (contenido, bots, cursos)
- Tabla de integraciones IA (Claude, DALL-E, Gemini, Replicate)
- Badges de guardianes con colores
- Referencia rápida actualizada para enero 2026

---

### 2026-01-24 (sesión 10) - COMPLETADA

**🔧 CONFIGURACIÓN DE APIs Y VERIFICACIONES**

1. **GEMINI_API_KEY agregada a Vercel** ✅
   - Encontrada en `.env.local`
   - Agregada a producción, preview y development
   - Modelo funcionando: `gemini-2.0-flash-exp`

2. **Verificación completa de conexiones** ✅
   - Claude: ✅ claude-sonnet-4
   - OpenAI/DALL-E: ✅ dall-e-3
   - Replicate: ✅ 20+ modelos
   - Gemini: ✅ gemini-2.0-flash-exp
   - Vercel KV: ✅ Upstash
   - WordPress: ✅ WooCommerce 10.3.7

3. **Documentación de integraciones de IA** ✅
   - Endpoints de generación de imágenes documentados
   - API de cursos documentada
   - Panel Maestro del Círculo documentado

**Commits:**
- `Sync Admin and User APIs for Círculo content lookup`
- `Document AI integrations in MEMORY.md`
- `Update MEMORY: Gemini API now configured ✅`

---

### 2026-01-23 22:30 (sesión 9) - COMPLETADA

**🎯 TAREA COMPLETADA: REFACTORIZAR MI MAGIA**

El archivo `/app/mi-magia/page.jsx` fue refactorizado de 8000 líneas a módulos separados.

**Componentes creados en `/app/mi-magia/components/`:**
| Archivo | Descripción | Líneas |
|---------|-------------|--------|
| `Tito.jsx` | Chatbot Tito + TitoBurbuja | ~200 |
| `SeccionInicio.jsx` | Dashboard principal con gamificación | ~400 |
| `SeccionCanalizaciones.jsx` | Guardianes, talismanes, libros, lecturas | ~655 |
| `SeccionRegalos.jsx` | Sistema de regalos con runas | ~300 |
| `SeccionGrimorio.jsx` | Diario mágico con calendario lunar | ~310 |
| `SeccionCirculo.jsx` | Membresía del Círculo | ~130 |
| `CofreDiario.jsx` | Cofre de runas diario | existente |
| `constants.js` | Constantes y configuración | ~100 |
| `styles.js` | Estilos compartidos | ~50 |
| `index.js` | Exportaciones centralizadas | ~25 |

**🐛 BUGS ARREGLADOS:**

1. **Cofre de Runas no funcionaba** ✅
   - **Causa:** Token en KV se guardaba como objeto `{email, nombre, creado}` pero el API lo trataba como string
   - **Archivo:** `/api/gamificacion/cofre-diario/route.js`
   - **Fix:** Agregado `typeof tokenData === 'string' ? tokenData : tokenData.email`
   - **Commit:** `Fix token parsing in cofre-diario API`

2. **Contenido del Círculo aparecía vacío** ✅
   - **Causa:** Dashboard solo soportaba 2 formatos de contenido, pero existía contenido en formato `secciones`
   - **Archivo:** `/app/mi-magia/circulo/Dashboard.jsx`
   - **Fix:** Agregado soporte para 3 formatos:
     1. `cuerpo` (generar-contenido-pro)
     2. `secciones.intro/desarrollo/practica/cierre` (regenerar-contenido)
     3. `mensaje/ensenanza/practica/reflexion` (legacy)
   - **Commit:** `Fix Círculo Dashboard to support all content formats`

3. **Imágenes del Círculo no se mostraban** ✅
   - **Causa:** Dashboard mostraba placeholder estático en lugar de imágenes DALL-E
   - **Archivo:** `/app/mi-magia/circulo/Dashboard.jsx`
   - **Fix:** Mostrar `imagen` real cuando existe, fallback a placeholder con icono
   - **Commit:** `Add support for DALL-E generated images in Círculo Dashboard`

**✅ VERIFICADO:**
- Generación de imágenes con DALL-E funciona (OPENAI_API_KEY activa)
- Generación de contenido con Claude funciona (ANTHROPIC_API_KEY activa)
- El contenido existente (días 1-26 de enero) se muestra correctamente

4. **Admin API y User API no sincronizadas** ✅
   - **Causa:** Admin API solo buscaba en formato `circulo:contenido:año:mes:dia` pero User API buscaba en AMBOS formatos (`circulo:contenido:` Y `contenido:YYYY-MM-DD`)
   - **Archivo:** `/api/admin/circulo/contenidos/route.js`
   - **Fix:**
     - Agregada función helper `obtenerContenido()` (igual que User API)
     - Admin API ahora busca en ambos formatos de key
     - Soporte para parámetro `ano` (sin ñ) además de `año`
   - **Resultado:** Ambas APIs ahora devuelven los mismos resultados

**⚠️ NOTA SOBRE CONTENIDO DEL CÍRCULO:**
- El contenido existente fue guardado con diferentes formatos de keys en KV
- Algunos usan `circulo:contenido:año:mes:dia`, otros usan `contenido:YYYY-MM-DD`
- Las APIs ahora buscan en AMBOS formatos
- Si hay discrepancias después del deploy, esperar unos minutos para que el caché de Vercel se actualice
- En peor caso, regenerar contenido con `/api/admin/circulo/generar-contenido-pro` que guarda en ambos formatos

**Commits de esta sesión:**
1. `Fix token parsing in cofre-diario API`
2. `Fix Círculo Dashboard to support all content formats`
3. `Add support for DALL-E generated images in Círculo Dashboard`
4. `Sync Admin and User APIs to search both content key formats`

---

### 2026-01-23 18:20 (sesión 8) - COMPLETADA

**🔥 PARTE 1: Rotación de Patrones (ya documentado antes)**
- Sistema de rotación de patrones v3
- Hooks desde el guardián
- Score protection para regeneración

**✅ PARTE 2: DEPLOYS Y NUEVAS FUNCIONALIDADES**

1. **FIX SUSPENSE BOUNDARY (VERCEL)**
   - Error: `useSearchParams()` sin Suspense en Next.js 14
   - Archivos corregidos:
     - `/app/mi-magia/page.jsx` - 8000 líneas, envuelto en Suspense
     - `/app/mi-magia/elegidos/page.jsx`
     - `/app/mi-magia/lecturas/page.jsx`
     - `/app/mi-magia/experiencias/page.jsx`
     - `/app/mi-magia/regalos/page.jsx`

2. **PERFILADO PSICOLÓGICO EN TITO** ✅
   - Tito ahora carga el perfil psicológico del usuario (si existe)
   - Adapta comunicación según:
     - **Vulnerabilidad:** alta (empatía primero), media (valor gradual), baja (oferta directa)
     - **Dolor:** soledad, dinero, salud, relaciones, propósito
     - **Estilo decisión:** impulsivo, analítico, emocional
     - **Creencias:** creyente (lenguaje místico), buscador (mixto), escéptico (práctico)
   - Actualiza perfil dinámicamente desde la conversación
   - Archivo: `/app/api/tito/chat/route.js` (+148 líneas)

3. **WEBHOOKS WOOCOMMERCE UNIFICADOS** ✅
   - Había 3 endpoints duplicados:
     - `/api/webhooks/woocommerce` (plural) - completo
     - `/api/webhook/woocommerce` (singular) - básico
     - `/api/webhook` (general) - scheduling
   - **SOLUCIÓN:** Un solo webhook unificado en `/api/webhooks/woocommerce`
   - Features del webhook unificado:
     - Verificación de firma
     - Protección anti-duplicados
     - Guardianes, Runas, Membresías
     - Lecturas Ancestrales scheduling
     - Gamificación automática
     - Emails transaccionales
     - Registro para reporte diario
   - Endpoints deprecated redirigen al unificado

4. **WORDPRESS: TEST GUARDIAN v12** ✅
   - Plugin subido via SFTP a `mu-plugins/`
   - CSS fix aplicado

**📦 DEPLOYS VERIFICADOS:**
| Endpoint | Status | Notas |
|----------|--------|-------|
| `/mi-magia` | ✅ 200 | Suspense fix |
| `/api/tito/chat` | ✅ 200 | Con perfilado |
| `/api/webhooks/woocommerce` | ✅ active | Unificado |
| `/api/cron/duende-semana-rotacion` | ✅ 401 | Protegido CRON_SECRET |
| `/api/emails/micro-compromisos` | ✅ 200 | Listo |
| Test Guardian WordPress | ✅ 200 | v12 subido |

**Commits de esta sesión:**
1. `Fix useSearchParams Suspense boundary errors`
2. `Integrate psychological profiling into Tito chatbot`
3. `Unify WooCommerce webhooks into single endpoint`

**⏳ PENDIENTE PARA PRÓXIMA SESIÓN:**
- #7 Refactorizar Mi Magia (8000 líneas → módulos)

---

## ✅ REFACTORIZACIÓN COMPLETADA: MI MAGIA

**Estado:** COMPLETADO en sesión 9

**Estructura actual de `/app/mi-magia/`:**
```
/app/mi-magia/
├── page.jsx                    # Wrapper con Suspense (~4400 líneas reducidas)
├── components/
│   ├── Tito.jsx                # Chatbot Tito + TitoBurbuja
│   ├── SeccionInicio.jsx       # Dashboard con gamificación
│   ├── SeccionCanalizaciones.jsx # Guardianes, talismanes, lecturas
│   ├── SeccionRegalos.jsx      # Sistema de regalos
│   ├── SeccionGrimorio.jsx     # Diario mágico + calendario lunar
│   ├── SeccionCirculo.jsx      # Membresía del Círculo
│   ├── CofreDiario.jsx         # Cofre de runas diario
│   ├── AccesoRestringido.jsx   # Badges y banners de upgrade
│   ├── BannerPromociones.jsx   # Banners promocionales
│   ├── constants.js            # Constantes compartidas
│   ├── styles.js               # Estilos compartidos
│   └── index.js                # Exportaciones centralizadas
└── circulo/
    └── Dashboard.jsx           # Dashboard del Círculo (actualizado)
```

---

### 2026-01-23 (sesión 7) - COMPLETADA
**Funcionalidades nuevas implementadas:**

1. ✅ **CREADOR INTELIGENTE DE PRODUCTOS**
   - Nuevo modo en `/admin/generador-historias`
   - Flujo completo: Subir fotos → Analizar con Claude Vision → Parsear texto libre → Generar historia → Publicar a WooCommerce
   - Pasos 18-23 en el generador
   - Drag & drop de múltiples fotos con preview
   - Parseo inteligente de texto libre (detecta nombre, tamaño, categoría, cristales)
   - Publicación directa: sube fotos a WP Media Library + crea producto

2. ✅ **SISTEMA DE AUTO-APRENDIZAJE DE TEMAS**
   - El Planificador Visual ahora detecta categorías con 100+ keywords
   - Aprende de generaciones exitosas y las almacena en Vercel KV
   - Temas aprendidos tienen prioridad sobre mapeo estático
   - API: `/api/admin/historias/temas-aprendidos`

3. ✅ **NUEVAS ESPECIALIZACIONES**
   - **Viajeros**: Duendes con mochilas, cambio de dirección, nuevos horizontes
     - Subcategorías: aventura, sabiduría, reinvención, horizontes, despegue
   - **Bosque/Naturaleza**: Duendes con hierbas, hongos, conexión con la tierra
     - Subcategorías: sanación, raíces, micelios, hierbas, hongos, equilibrio

4. ✅ **HUB DE WORDPRESS v2.0**
   - Plugin `duendes-hub-control.php` actualizado con todas las rutas de Vercel
   - Incluye: MODO DIOS, Generador Historias, Mi Magia, Círculo, Elegidos, Lecturas, etc.

5. ✅ **MEJORAS TÉCNICAS**
   - API de WooCommerce con mejor manejo de errores en crear/actualizar
   - API de análisis de imagen acepta base64 además de URLs
   - Parser de texto libre: `/lib/parsers/texto-producto.js`

**Archivos nuevos/modificados:**
- `/lib/parsers/texto-producto.js` - NUEVO: Parser inteligente de texto
- `/app/admin/generador-historias/page.jsx` - +1885 líneas para creador
- `/app/api/admin/historias/analizar-imagen/route.js` - Acepta base64
- `/app/api/admin/woocommerce/productos/route.js` - Mejor manejo errores

---

### 2026-01-22 (sesión 6) - COMPLETADA
**Mejoras implementadas:**

1. ✅ **CORRECCIÓN INTELIGENTE CON CLAUDE HAIKU**
   - Reemplaza el diccionario manual que rompía palabras válidas
   - API nueva: `/api/admin/corregir-producto/route.js`
   - Usa Claude 3.5 Haiku (`claude-3-5-haiku-20241022`) para corregir
   - Respeta español rioplatense (vos, tenés, podés son correctos)
   - Solo corrige ortografía, no cambia contenido ni estilo

2. ✅ **PLUGIN WORDPRESS PARA CORRECCIÓN**
   - Botón "🔧 Corregir Ortografía" DENTRO del producto de WooCommerce
   - Ubicación del plugin: `wp-content/mu-plugins/duendes-corregir-ortografia.php`
   - Llama a la API de Vercel para corregir descripción
   - CORS headers configurados para permitir llamadas cross-origin
   - Archivo local: `/temp-plugin/duendes-corregir-ortografia.php`

3. ✅ **FOTOS EN CATÁLOGO BATCH**
   - Carga imágenes de productos desde WooCommerce al iniciar
   - Muestra thumbnails (50x50px) en las cards de guardianes
   - Facilita identificar visualmente qué guardián seleccionar

4. ✅ **BOTÓN "NUEVO BATCH"**
   - Después de generar historias, permite reiniciar sin recargar
   - Limpia selección y vuelve al paso de catálogo

**SFTP WordPress (para futuras actualizaciones del plugin):**
- Host: 34.70.139.72
- Puerto: 55309
- Usuario: sftp_live_WfP6i
- Ruta plugins: `web/wp-live/wp-content/mu-plugins/`

---

### 2026-01-22 (sesión 5) - COMPLETADA
**Mejoras implementadas:**
1. ✅ **FIX TYPOS DE CLAUDE** - Errores como "cargal don", "investáste", "fueral":
   - Agregado `temperature: 0.5` a llamadas de Claude (era 1.0 default)
   - Expandido diccionario de auto-correcciones de 8 a 60+ patrones
   - Instrucciones de ortografía más explícitas en el prompt
   - Incluye: palabras pegadas con "el", conjugaciones incorrectas, tildes, typos

2. ✅ **CORRECCIÓN AUTOMÁTICA EN FRONTEND**:
   - Función `corregirOrtografia()` con mismo diccionario que backend
   - Se aplica automáticamente al recibir historias generadas
   - Botón "🔧 Corregir ortografía" para corregir historias ya existentes sin regenerar
   - Funciona tanto en generación inicial como en regeneración individual

**Ubicación:**
- Backend: `/app/api/admin/historias/route.js` líneas 405, 414-490
- Frontend: `/app/admin/generador-historias/page.jsx` líneas 130-205

---

### 2026-01-22 (sesión 4) - COMPLETADA
**Mejoras implementadas:**
1. ✅ Corregido bug de recreables con tamaño "especial" (ahora usa cm > 15)
2. ✅ Narrativa de recreables mejorada (equipo, no persona sola)
3. ✅ Botón "Guardar en WooCommerce" en modo directo
4. ✅ **BATCH INTELIGENTE** - Nueva funcionalidad completa:
   - Selección múltiple de guardianes del catálogo
   - Agrupación por especialización (fortuna, protección, etc.)
   - Generación masiva con tracking de hooks/sincrodestinos usados
   - NO repite hooks ni sincrodestinos dentro del mismo grupo
   - Revisión con score, aprobación individual o masiva
   - Guardado masivo en WooCommerce

**Acceso:** `/admin/generador-historias` → "🚀 Batch Inteligente"

---

### 2026-01-22 (sesión 3)
**Tarea:** Rehacer Test del Guardián con enfoque de conversión (pendiente)

**Archivos a modificar:**
- `/app/api/test-guardian/route.js` - Preguntas y lógica
- `/app/mi-magia/test-guardian.js` - UI (mantener chat con Tito y música)

---

### 2026-01-22 (sesión 2)
- Creado sistema de memoria persistente (MEMORY.md)
- Agregados hooks específicos para FORTUNA/SUERTE
- Corregida urgencia de recreables: ahora usa escasez real de stock
- Score de Finnegan (fortuna, mini): 30/50 ✅ aprobada
- Historia ahora usa dolor correcto según especialización

### 2026-01-22 (sesión 1)
- Creado sistema completo de especializaciones
- Implementado branding "Los Elegidos" y "Guardianes"
- Corregido bug de recreables diciendo "pieza única"
- Creado prompt de configuración para nuevas sesiones

---

## PARA CONTINUAR TRABAJANDO

1. Leé este archivo primero
2. Si hay algo en "BUGS CONOCIDOS", considerá arreglarlo
3. Si hay algo en "PENDIENTES" del plan, continuá desde ahí
4. Actualizá este archivo cuando tomes decisiones importantes

---

## COMANDOS ÚTILES

```bash
# Iniciar servidor local
npm run dev

# Ver logs de Vercel
vercel logs

# Probar API de historias
curl -X POST http://localhost:3000/api/admin/historias \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","especie":"duende","categoria":"Fortuna","especializacion":"fortuna"}'
```

---

## ✅ GENERACIÓN DE HISTORIAS - COMPLETADA

**100/100 guardianes con historias generadas.**

Todas las categorías completadas:
- Sanación/Herbolarios
- Viajeros
- Elfos Viajeros
- Abundancia/Dinero/Negocios
- Amor
- Brujas femeninas
- Brujos masculinos

**Patrones que funcionaron:**
- Apertura: "[Nombre] + acción/rasgo distintivo" (no empezar con dolor)
- Accesorios: explicar el POR QUÉ de cada uno, no listarlos
- Mensaje: promesa específica en primera persona, NO "no vino a X"
- Cierres: 3 versiones del mensaje del guardián (vulnerable, escéptico, impulsivo)

**APIs disponibles:**
```bash
# Guardar historia
curl -X PUT "https://duendes-vercel.vercel.app/api/admin/historias" \
  -H "Content-Type: application/json" \
  -d '{"productoId": ID, "historia": "...", "cierres": {"vulnerable": "...", "esceptico": "...", "impulsivo": "..."}}'

# Buscar producto
curl "https://duendes-vercel.vercel.app/api/woo/productos?search=NOMBRE"
```
