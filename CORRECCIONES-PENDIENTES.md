# CORRECCIONES PENDIENTES - Duendes del Uruguay

**Creado:** 2026-01-24
**Objetivo:** Documentar todas las fallas encontradas y su estado de corrección

---

## ESTADO GENERAL

| Área | Estado | Prioridad |
|------|--------|-----------|
| Header/Navegación | ✅ Conflicto CSS resuelto | ALTA |
| Página de Inicio | ✅ Analizada - OK (landing de APIs) | ALTA |
| Test del Guardián | ✅ Bug corregido | ALTA |
| Mi Magia | ✅ Tito corregido | ALTA |
| Círculo de Duendes | ✅ Tito agregado | MEDIA |
| Chat Tito | ✅ CORREGIDO Mi Magia + Círculo | ALTA |
| Conexión WordPress-Vercel | 🟡 Requiere SFTP (manual) | ALTA |
| SEO/Assets | ✅ Favicons + dominio corregidos | MEDIA |
| Config next.config.js | ✅ Wildcard corregido | MEDIA |
| URLs hardcodeadas | ✅ Centralizadas | MEDIA |
| Páginas dinámicas | ✅ Analizadas - OK como están | BAJA |
| Colores dorados | ✅ Unificados con CSS variable | MEDIA |

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

### 1.5 Estado de correcciones
- [x] Unificar colores dorados → `var(--color-dorado)` en globals.css
- [x] Consolidar headers → Renombrado a `.mi-magia-header` para evitar conflictos
- [x] Revisar URLs entre sitios → Centralizadas en `lib/config/urls.js`
- [ ] Extraer CSS inline de tienda (~500 líneas, no 1200+ como se estimó)
- [ ] Estandarizar breakpoints (mejora opcional)

---

## 2. PÁGINA DE INICIO - ✅ ANALIZADA

### 2.1 Página principal de Vercel (`/app/page.js`)
**Estado:** ✅ OK - Es intencionalmente una landing simple

```javascript
// Muestra "Duendes del Uruguay - Sistema de Canalización"
// con link a duendesdeluruguay.com
```

**Conclusión:** Este diseño es correcto. El app de Vercel es para:
- APIs (`/api/*`)
- Portal Mi Magia (`/mi-magia`)
- Círculo de Duendes (`/mi-magia/circulo`)
- Admin (`/admin/*`)
- Tienda proxy (`/tienda`, `/producto/*`)

La página principal de WordPress (duendesdeluruguay.com) es la entrada real del usuario.

### 2.2 Verificar inicio en WordPress (requiere SFTP)
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

## 4. ASSETS - ✅ CORREGIDO

### 4.1 Favicons
**Estado:** ✅ CORREGIDO - Referencias actualizadas para usar iconos existentes

Se actualizó `app/layout.js` para usar los iconos que SÍ existen:
- `/public/icon-192.png` → Para icon y apple-touch-icon
- `/public/icon-512.png` → Para icon grande

### 4.2 Logo para SEO
**Estado:** ✅ CORREGIDO

Se actualizó `lib/seo/schema.js`:
- Cambió de `/logo.png` (no existe) a `/icon-512.png` (existe)

---

## 5. CONFIGURACIÓN

### 5.1 next.config.js
**Estado:** ✅ CORREGIDO
- Cambió `**.10web.cloud` → `*.10web.cloud` (sintaxis válida Next.js 14)

### 5.2 Google Search Console
**Estado:** 🟡 Pendiente configuración manual
- [ ] Placeholder `TU_CODIGO_DE_VERIFICACION_GOOGLE` sin configurar
  - **Archivo:** `app/layout.js` línea 104
  - **Acción:** Usuario debe obtener código de Google y reemplazarlo

### 5.3 Dominios
**Estado:** ✅ CORREGIDO
- [x] Sitemap actualizado a `duendesdeluruguay.com`
- [x] Robots.txt actualizado a `duendesdeluruguay.com`
- [x] Layout usa `duendesdeluruguay.com` (ya estaba bien)

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

## 7. COMPONENTES - ESTADO

### 7.1 API_BASE vacío
- **Archivo:** `/app/mi-magia/components/constants.js` línea 5
- **Estado:** ✅ OK - Rutas relativas funcionan correctamente en Next.js
- Las rutas relativas (`/api/...`) funcionan tanto en desarrollo como producción

### 7.2 URLs hardcodeadas
**Estado:** ✅ CORREGIDO
- [x] `/app/tienda/page.jsx` - Ahora importa de `@/lib/config/urls.js`
- [x] `/app/producto/[slug]/page.jsx` - Ahora importa de `@/lib/config/urls.js`

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

## 10. ACCIONES - RESUMEN

### ✅ COMPLETADO (código)
1. [x] Tito visible siempre en Mi Magia
2. [x] Tito agregado al Círculo
3. [x] Bug arquetipoScores corregido
4. [x] Favicons referencias corregidas
5. [x] Wildcard next.config.js corregido
6. [x] URLs centralizadas
7. [x] Dominios unificados (sitemap/robots)
8. [x] Colores dorados unificados
9. [x] Conflicto .header resuelto

### 🟡 REQUIERE ACCIÓN MANUAL (usuario)
1. [ ] Conectar por SFTP y verificar WordPress
2. [ ] Configurar código Google Search Console
3. [ ] Probar header en producción (navegador)
4. [ ] Probar Test del Guardián (navegador)
5. [ ] Verificar flujo de compra completo (navegador)

### 📋 MEJORAS OPCIONALES (baja prioridad)
1. [ ] Extraer CSS inline de tienda (~500 líneas)
2. [ ] Estandarizar breakpoints CSS

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
- **DEPLOYADO (Ronda 1):** 4 commits:
  - `e7f69e3` fix(mi-magia): Tito chat siempre visible
  - `afc42f4` feat(circulo): agregar chat de Tito interactivo
  - `193769e` fix(test-guardian): corregir bug arquetipoScores
  - `bafd740` docs: agregar CORRECCIONES-PENDIENTES.md
- **DEPLOYADO (Ronda 2):** 4 commits adicionales:
  - `d291812` fix(assets): corregir referencias a favicons inexistentes
  - `72afc66` fix(config): corregir wildcard en next.config.js
  - `cb6b03f` refactor: centralizar WORDPRESS_URL
  - `b4eca26` fix(seo): unificar dominio en sitemap y robots.txt
- **DEPLOYADO (Ronda 3):** 2 commits adicionales:
  - `11093c5` refactor(styles): unificar colores dorados con CSS variable
  - `1838d5b` fix(css): renombrar .header a .mi-magia-header
- **Sesión continuada:** Actualización de documento de tracking
  - Página de inicio analizada: Es correctamente una landing simple (OK)
  - Tienda tiene ~500 líneas CSS (no 1200+ como se estimó inicialmente)
  - Todos los items de código críticos están corregidos
  - Pendiente: verificación manual en producción y configuración SFTP

---

## RESUMEN FINAL

### Commits deployados: 10 total
| Commit | Descripción |
|--------|-------------|
| `e7f69e3` | fix(mi-magia): Tito chat siempre visible |
| `afc42f4` | feat(circulo): agregar chat de Tito interactivo |
| `193769e` | fix(test-guardian): corregir bug arquetipoScores |
| `bafd740` | docs: agregar CORRECCIONES-PENDIENTES.md |
| `d291812` | fix(assets): corregir referencias a favicons |
| `72afc66` | fix(config): corregir wildcard en next.config.js |
| `cb6b03f` | refactor: centralizar WORDPRESS_URL |
| `b4eca26` | fix(seo): unificar dominio en sitemap/robots |
| `11093c5` | refactor(styles): unificar colores dorados |
| `1838d5b` | fix(css): renombrar .header a .mi-magia-header |

### Estado: ✅ Todos los bugs de código corregidos
Las tareas pendientes son verificación manual y configuración que requiere acceso SFTP o acciones del usuario.

---

## 12. TEST DEL GUARDIÁN - REDISEÑO COMPLETO (PRIORIDAD MÁXIMA)

### 12.1 Estado Actual
- ✅ Test funciona visualmente (v14.3 standalone, bypasea Elementor)
- 🔴 Música no suena (verificar URL)
- 🔴 Falta sistema de perfilado real
- 🔴 Falta conexión con productos reales de WooCommerce
- 🔴 Falta secuencia de micro-compromisos

### 12.2 Sistema de Perfilado Requerido

El test debe clasificar al usuario en:

| Dimensión | Valores | Cómo detectar |
|-----------|---------|---------------|
| **Vulnerabilidad** | Alta / Media / Baja | Preguntas emocionales, urgencia |
| **Dolor Principal** | Soledad / Dinero / Salud / Relaciones | Preguntas directas disfrazadas |
| **Estilo Decisión** | Impulsivo / Analítico / Emocional | Cómo responde, velocidad |
| **Poder Adquisitivo** | Alto / Medio / Bajo | Preguntas indirectas sobre estilo vida |
| **Creencias** | Escéptico / Creyente / Buscador | Preguntas sobre experiencias previas |

### 12.3 Motor de Sincronicidad Personalizada

Crear "señales mágicas" usando datos del usuario:

```javascript
// Ejemplos:
// Si entró un martes:
"Los martes son días de Marte, de acción. No es casualidad que estés acá hoy."

// Si su nombre tiene misma cantidad de letras que el guardián:
"Tu nombre y el de [guardián] tienen la misma cantidad de letras. Los números no mienten."

// Si es su cumpleaños este mes:
"Este mes es tu portal. Los guardianes que aparecen cerca de tu cumpleaños vienen con mensajes especiales."
```

### 12.4 Secuencia de Micro-Compromisos

Escalar gradualmente, no pedir compra directa:

1. "¿Querés saber qué guardián te corresponde?" → **Test gratis**
2. "¿Querés que te avise si aparece uno para vos?" → **Captura email**
3. "¿Querés ver el mensaje que tiene para vos?" → **Preview personalizado**
4. "¿Querés reservarlo antes de que desaparezca?" → **Seña/Reserva**
5. **Compra completa**

### 12.5 Pantalla de Resultado Requerida

Debe incluir:
- [ ] Mini estudio personalizado (basado en respuestas + signo)
- [ ] Validación emocional ("lo que sentís es real")
- [ ] Signo zodiacal con interpretación
- [ ] Foto REAL del guardián recomendado (de WooCommerce)
- [ ] Escanear TODOS los productos y elegir el mejor match
- [ ] Opción: "Enviar resultado a mi email"
- [ ] Botón: Mensaje personalizado del guardián (lenguaje neutro)
- [ ] Link directo al producto recomendado

### 12.6 Requisitos Técnicos

| Componente | Implementación |
|------------|----------------|
| **Fetch productos** | API WooCommerce → traer todos los guardianes con categorías |
| **Algoritmo matching** | Cruzar perfil usuario con atributos del guardián |
| **Sincronicidad** | JavaScript con datos: día, hora, nombre, cumpleaños |
| **Captura email** | Integración ManyChat o formulario propio |
| **Mensaje guardián** | Generar con IA o templates por categoría |
| **Base datos** | Guardar perfil en Vercel KV o WP user meta |

### 12.7 Archivos Involucrados

- `wordpress-plugins/test-guardian-v14-experiencia.php` - Plugin actual
- `/api/tienda/productos` - API para traer productos (ya existe)
- `/api/tito/chat` - Podría generar mensajes personalizados
- `/lib/circulo/perfilado.js` - Sistema de perfilado existente (revisar)

---

*Este archivo se actualiza conforme se corrigen los problemas*
