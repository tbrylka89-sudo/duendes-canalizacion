# CORRECCIONES PENDIENTES - Duendes del Uruguay

**Creado:** 2026-01-24
**Objetivo:** Documentar todas las fallas encontradas y su estado de corrección

---

## ESTADO GENERAL

| Área | Estado | Prioridad |
|------|--------|-----------|
| Header/Navegación | 🟡 Analizado - pendiente fixes | ALTA |
| Página de Inicio | 🔴 Pendiente análisis | ALTA |
| Test del Guardián | ✅ Bug corregido | ALTA |
| Mi Magia | 🟢 Tito corregido | ALTA |
| Círculo de Duendes | 🟢 Tito agregado | MEDIA |
| Chat Tito | ✅ CORREGIDO Mi Magia + Círculo | ALTA |
| Conexión WordPress-Vercel | 🔴 Pendiente verificar | ALTA |
| SEO/Assets | 🟡 Parcial | MEDIA |

---

## 1. PROBLEMAS DE HEADER Y NAVEGACIÓN

### 1.1 Análisis completado (2026-01-24)

**Ubicación de headers:**
- Mi Magia: `/app/mi-magia/page.jsx` línea 4082 + `components/styles.js` línea 1284
- Tienda: `/app/tienda/page.jsx` línea 145
- Producto: `/app/producto/[slug]/page.jsx` línea 59

### 1.2 Problemas CRÍTICOS encontrados

**CSS Conflictivo:**
- `globals.css` línea 48: `.header { text-align: center; padding: 60px 20px; background: linear-gradient...}`
- `styles.js` línea 1284: `.header{position:fixed;top:0;...padding:0 2rem;...z-index:100}`
- **Solución:** Unificar en un solo archivo o usar clases específicas (`.header-mimagia`, `.header-public`)

**Colores inconsistentes:**
- `#d4af37` vs `#c6a962` vs `#C6A962` - 3 variaciones del dorado
- **Solución:** Elegir UNO y usar variable CSS `:root { --dorado: #d4af37; }`

**URLs hardcodeadas a WordPress:**
- Línea 4187-4195 en Mi Magia: Enlaces a `WORDPRESS_URL/producto/runas-*`
- Puede causar redirecciones circulares
- **Solución:** Verificar flujo entre sitios

### 1.3 Problemas de Responsive

- Breakpoints inconsistentes: `768px` vs `900px` vs `600px` vs `1200px`
- Grid de tienda: `repeat(2, 1fr)` insuficiente para móvil < 380px
- Header Mi Magia: padding `2rem` muy ancho en móvil
- **Solución:** Estandarizar breakpoints: `320px, 480px, 768px, 1024px, 1200px`

### 1.4 CSS inline excesivo
- `/app/tienda/page.jsx`: **1,200+ líneas de CSS inline**
- **Solución:** Extraer a módulo `tienda-styles.js`

### 1.5 Pendientes
- [ ] Unificar colores dorados
- [ ] Extraer CSS inline de tienda
- [ ] Consolidar headers (una definición con variantes)
- [ ] Estandarizar breakpoints
- [ ] Revisar URLs entre sitios

---

## 2. PROBLEMAS DE PÁGINA DE INICIO

### 2.1 Página principal de Vercel (`/app/page.js`)
**Estado:** Es una página de carga simple que redirige

```javascript
// Actual - solo muestra "Duendes del Uruguay - Sistema de Canalización"
// con link a duendesdeluruguay.com
```

**Pregunta:** ¿Esta página debería tener más contenido o es solo landing de APIs?

### 2.2 Verificar inicio en WordPress
- [ ] Revisar página principal de duendesdeluruguay.com via SFTP
- [ ] Verificar plugins activos
- [ ] Verificar elementor/tema

---

## 3. PROBLEMAS DEL TEST DEL GUARDIÁN

### 3.1 Ubicación del código
- **UI:** `/app/mi-magia/test-guardian.js`
- **API:** `/api/test-guardian`
- **Perfilado:** `/lib/circulo/perfilado.js`

### 3.2 Bugs corregidos (2026-01-24)
- [x] **Bug crítico:** `arquetipoScores` no definido en `analizarRespuestas`
  - Causaba error en `combinarAnalisis` línea 568
  - Corregido: Ahora devuelve `arquetipoScores`, `arquetipoPrincipal`, `arquetipoSecundario`, `elemento`

### 3.3 Pendiente verificar
- [ ] ¿El test carga correctamente?
- [ ] ¿Las preguntas se muestran?
- [ ] ¿La música funciona?
- [ ] ¿El chat con Tito responde?
- [ ] ¿Los resultados se guardan?

---

## 4. ASSETS FALTANTES (Confirmado)

### 4.1 Favicons
- [ ] `/public/favicon.ico` - NO EXISTE
- [ ] `/public/icon.svg` - NO EXISTE
- [ ] `/public/favicon-16x16.png` - NO EXISTE
- [ ] `/public/favicon-32x32.png` - NO EXISTE
- [ ] `/public/apple-touch-icon.png` - NO EXISTE
- [ ] `/public/safari-pinned-tab.svg` - NO EXISTE

**Acción:** Crear o quitar referencias en `app/layout.js`

### 4.2 Logo para SEO
- [ ] `/public/logo.png` - NO EXISTE (usado en `lib/seo/schema.js`)

---

## 5. CONFIGURACIÓN

### 5.1 next.config.js
- [ ] Wildcard `**.10web.cloud` puede no funcionar en Next.js 14
  - **Línea:** 20
  - **Fix:** Cambiar a `*.10web.cloud` o dominio específico

### 5.2 Google Search Console
- [ ] Placeholder `TU_CODIGO_DE_VERIFICACION_GOOGLE` sin configurar
  - **Archivo:** `app/layout.js` línea 104

### 5.3 Dominios inconsistentes
- [ ] Layout usa `duendesdeluruguay.com`
- [ ] Sitemap usa `duendes-vercel.vercel.app`
- [ ] Robots.txt usa `duendes-vercel.vercel.app`

---

## 6. PÁGINAS DINÁMICAS MAL IMPLEMENTADAS

### 6.1 Client Components que deberían ser Server Components
Estas páginas usan `'use client'` + `useParams()` cuando deberían usar Server Components:

| Archivo | Ruta | Estado |
|---------|------|--------|
| `/app/portal/[id]/page.jsx` | `/portal/[id]` | 🔴 Mal |
| `/app/certificado/[id]/page.jsx` | `/certificado/[id]` | 🔴 Mal |
| `/app/admin/canalizaciones/[id]/page.jsx` | `/admin/canalizaciones/[id]` | 🔴 Mal |
| `/app/circulo/cursos/[id]/page.jsx` | `/circulo/cursos/[id]` | 🔴 Mal |

**Nota del usuario:** Certificado se genera cuando alguien compra, así que necesita ser dinámico y eso está OK. Verificar si la implementación actual funciona.

### 6.2 Páginas bien implementadas (referencia)
- `/app/producto/[slug]/page.jsx` ✅
- `/app/lectura/[id]/page.js` ✅
- `/app/guardian/[id]/page.js` ✅

---

## 7. COMPONENTES CON PROBLEMAS POTENCIALES

### 7.1 API_BASE vacío
- **Archivo:** `/app/mi-magia/components/constants.js` línea 5
- **Problema:** `API_BASE = ''` - todos los fetch usan rutas relativas
- **Verificar:** ¿Esto funciona correctamente en producción?

### 7.2 URLs hardcodeadas
- `/app/tienda/page.jsx` línea 18 - define WORDPRESS_URL localmente
- `/app/producto/[slug]/page.jsx` línea 139 - define WORDPRESS_URL localmente
- **Deberían usar:** `@/lib/config/urls.js`

---

## 8. CONEXIÓN WORDPRESS ↔ VERCEL

### 8.1 Plugins en WordPress (mu-plugins)
Según CLAUDE.md:
- `duendes-fixes-master.php` - Fixes globales
- `duendes-como-funciona-estilos.php` - CSS/JS
- `duendes-experiencia-magica.php` - Experiencia producto
- `duendes-mi-magia.php` - Portal Mi Magia
- `duendes-emails-magicos.php` - Emails post-compra
- `duendes-carrito-abandonado.php` - Emails carrito
- `duendes-fabrica-banners.php` - Banners inteligentes
- `duendes-promo-3x2.php` - Promoción 3x2
- `duendes-formulario-canalizacion.php` - Formulario checkout

### 8.2 Verificar via SFTP
- [ ] ¿Todos los plugins están activos?
- [ ] ¿Hay errores en los plugins?
- [ ] ¿El Hub Control está funcionando?

---

## 9. FLUJO COMPLETO A VERIFICAR

```
1. Usuario entra a duendesdeluruguay.com
   └── ¿Header funciona?
   └── ¿Navegación funciona?
   └── ¿Productos cargan?

2. Usuario hace el Test del Guardián
   └── ¿Carga la página?
   └── ¿Funciona el chat con Tito?
   └── ¿Se guardan los resultados?

3. Usuario compra un guardián
   └── ¿Checkout funciona?
   └── ¿Formulario de canalización aparece?
   └── ¿Webhook llega a Vercel?

4. Usuario accede a Mi Magia
   └── ¿Login magic link funciona?
   └── ¿Se ve su guardián?
   └── ¿Funciona la canalización?

5. Usuario accede al Círculo
   └── ¿Contenido diario carga?
   └── ¿Guardián de la semana aparece?
   └── ¿Cursos funcionan?
```

---

## 10. ACCIONES INMEDIATAS

### Prioridad CRÍTICA
1. [ ] Conectar por SFTP y verificar WordPress
2. [ ] Probar header en producción
3. [ ] Probar Test del Guardián
4. [ ] Verificar flujo de compra completo

### Prioridad ALTA
5. [ ] Crear/agregar favicons faltantes
6. [ ] Corregir wildcard en next.config.js
7. [ ] Unificar URLs hardcodeadas

### Prioridad MEDIA
8. [ ] Corregir páginas dinámicas (si hay errores reales)
9. [ ] Configurar Google Search Console
10. [ ] Unificar dominios en sitemap/robots

---

## 11. CHAT DE TITO - SISTEMA COMPLETO

### 11.1 Estructura de Titos

| Tito | Ubicación | Estado |
|------|-----------|--------|
| **Mi Magia** | `/app/mi-magia/page.jsx` + `/components/Tito.jsx` | ✅ CORREGIDO |
| **Círculo** | `/app/mi-magia/circulo/page.jsx` | ✅ CORREGIDO |
| **WordPress** | Plugin en WP | 🔴 Verificar |
| **Admin** | `/admin/tito/page.jsx` | ✅ Funciona (página separada) |

### 11.2 APIs de Tito
- `/api/tito/chat` - Chat principal
- `/api/tito/sugerencias` - TitoBurbuja sugerencias
- `/api/tito/v2` - Versión 2
- `/api/tito/memoria` - Contexto/memoria
- `/api/tito/maestro` - Para el Círculo
- `/api/tito/manychat`, `/api/tito/mc`, `/api/tito/mc-direct` - ManyChat
- `/api/tito/woo` - WooCommerce
- `/api/tito/sync` - Sincronización

### 11.3 Correcciones realizadas

**Mi Magia (CORREGIDO 2026-01-24):**
- Problema: Tito no aparecía en pantallas de login, onboarding, tour, perfil
- Causa: Múltiples `return` tempranos sin incluir Tito
- Solución: Reestructurado con `renderContenidoEstado()` + Tito siempre al final

**Círculo (CORREGIDO 2026-01-24):**
- Problema: Solo había imagen estática de Tito, no chat interactivo
- Solución: Agregado import de Tito + chat siempre visible en todas las vistas

---

## NOTAS DE SESIÓN

### 2026-01-24
- Archivo creado
- Análisis inicial completado con 5 agentes
- Pendiente conexión SFTP y pruebas en producción
- **CORREGIDO:** Chat de Tito en Mi Magia (ahora aparece siempre)
- **CORREGIDO:** Chat de Tito en Círculo (agregado chat interactivo)
- **CORREGIDO:** Bug en Test del Guardián (`arquetipoScores` no definido)
- **DEPLOYADO:** 4 commits pusheados a producción:
  - `e7f69e3` fix(mi-magia): Tito chat siempre visible
  - `afc42f4` feat(circulo): agregar chat de Tito interactivo
  - `193769e` fix(test-guardian): corregir bug arquetipoScores
  - `bafd740` docs: agregar CORRECCIONES-PENDIENTES.md

---

*Este archivo se actualiza conforme se corrigen los problemas*
