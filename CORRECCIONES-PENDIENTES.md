# CORRECCIONES PENDIENTES - Duendes del Uruguay

**Creado:** 2026-01-24
**Objetivo:** Documentar todas las fallas encontradas y su estado de corrección

---

## ESTADO GENERAL

| Área | Estado | Prioridad |
|------|--------|-----------|
| **TITO v3 - Tools** | ✅ Sistema completo implementado | ALTA |
| **Mi Magia conocimiento** | ✅ Agregado a Tito | ALTA |
| **Precios por país** | ✅ Tasas actualizadas Ene 2026 | ALTA |
| **FAQ completo** | ✅ Expandido con info de WP | ALTA |
| Header/Navegación | ✅ Conflicto CSS resuelto | ALTA |
| Página de Inicio | ✅ Analizada - OK (landing de APIs) | ALTA |
| Test del Guardián | ✅ v15.2 COMPLETO (email pendiente) | ALTA |
| Mi Magia | ✅ Tito corregido | ALTA |
| Círculo de Duendes | ✅ Tito agregado | MEDIA |
| Chat Tito | ✅ CORREGIDO Mi Magia + Círculo | ALTA |
| Conexión WordPress-Vercel | ✅ Vercel funcionando correctamente | ALTA |
| SEO/Assets | ✅ Favicons + dominio corregidos | MEDIA |
| Config next.config.js | ✅ Wildcard corregido | MEDIA |
| URLs hardcodeadas | ✅ Centralizadas | MEDIA |
| Páginas dinámicas | ✅ Analizadas - OK como están | BAJA |
| Colores dorados | ✅ Unificados con CSS variable | MEDIA |
| Emails Test Guardián | ✅ Gmail SMTP funcionando | MEDIA |

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

### 2026-01-25 (noche) - TITO v3 TOOLS + MI MAGIA + PRECIOS

**TITO 3.0 - Sistema de Tools para Claude:**
- ✅ Creados archivos `/lib/tito/tools.js` (definición de tools)
- ✅ Creado `/lib/tito/tool-executor.js` (ejecución de tools)
- ✅ Creado `/app/api/tito/v3/route.js` (endpoint con Tools API)
- ✅ Creado `/app/api/tito/proactivo/route.js` (mensajes proactivos)
- ✅ Actualizado `/lib/tito/personalidad.js` (quitada seña, agregado anti-psicólogo)
- ✅ Actualizado `/lib/tito/manual-persuasion.js` (quitada seña)

**Mi Magia - Conocimiento agregado:**
- ✅ Agregada sección `miMagia` completa al FAQ en `conocimiento.js`
- ✅ Nueva tool `info_mi_magia` en `tools.js`
- ✅ Implementación en `tool-executor.js`
- ✅ Tito ahora sabe hablar de Mi Magia cuando pregunten sobre cuidados, canalización, QR, etc.

**Precios por país:**
- ✅ Actualizado tasas de cambio a Enero 2026
- ✅ Uruguay: precio fijo en pesos
- ✅ Exterior: USD + (aprox. en moneda local)
- ✅ Países dolarizados (US, EC, PA, SV): solo USD

**FAQ Completo actualizado:**
- ✅ Envíos: DHL Express internacional, DAC Uruguay, envío gratis USD$500+
- ✅ Pagos: Visa/MC/Amex exterior, OCA/Cabal/Abitab Uruguay
- ✅ Productos: materiales, cristales reales, tiempo creación
- ✅ Magia: qué son, cómo elegir, mantenimiento
- ✅ Garantía: sin devoluciones (piezas únicas), excepciones por daño
- ✅ Autenticidad: info sobre imitaciones
- ✅ Removida toda info de seña/reserva 30%

**Reglas importantes para Tito:**
- NO ofrece seña (eliminado)
- NO da datos de pago - guía a la web
- Distingue "quiero comprar" vs "ya compré"
- Limita conversaciones sin avance (anti-psicólogo)
- Siempre verifica precios de la fuente, no de memoria
- Conoce historia del guardián antes de recomendar

### 2026-01-25 (tarde) - VERIFICACIÓN COMPLETA DEL SISTEMA
- **VERIFICADO:** Vercel está funcionando correctamente
  - Página principal carga: `duendes-vercel.vercel.app` ✅
  - API Tito responde: `/api/tito/chat` ✅
  - Mi Magia carga (app React cliente) ✅
  - Círculo carga (app React cliente) ✅
  - Tienda proxy funciona ✅
- **VERIFICADO:** Test del Guardián en WordPress
  - URL: `/descubri-que-duende-te-elige/` ✅
  - Intro cinematográfica "Los Elegidos" ✅
  - 7 preguntas de perfilado ✅
  - Sistema de audio/música ✅
  - Conexión con productos WooCommerce ✅
- **VERIFICADO:** Código en repositorio
  - Tito importado en Mi Magia (línea 17) ✅
  - Tito importado en Círculo (línea 6) ✅
  - Colores dorados con CSS variable ✅
  - URLs centralizadas en `lib/config/urls.js` ✅
- **ACTUALIZADO:** Este archivo con estado real

### 2026-01-25 - TEST GUARDIAN v15.2 COMPLETO
- **REDISEÑO COMPLETO** del Test del Guardián
- Plugin `test-guardian-v15-completo.php` (67KB) creado y subido via SFTP
- **Intro cinematográfica "Los Elegidos"** restaurada desde v14:
  - 4 pantallas con texto que aparece gradualmente
  - Animaciones CSS `fadeInUp` con timing secuencial
  - Transiciones suaves entre pantallas
- **Sistema de perfilado psicológico** implementado:
  - Vulnerabilidad (alta/media/baja)
  - Dolor principal (soledad/dinero/salud/relaciones)
  - Estilo de decisión (impulsivo/analítico/emocional)
- **Integración IA directa en WordPress**:
  - `tg_generar_mensaje_con_ia()` llama Anthropic API
  - API key movida a wp-config.php (GitHub bloqueó push por key expuesta)
  - Mensajes personalizados según perfil del usuario
- **Conexión WooCommerce real**:
  - `tg_buscar_guardian()` con WP_Query y tax_query
  - Foto, nombre, precio y link del producto real
  - Categorías mapeadas a dolores del usuario
- **Estrategias de conversión** según perfil:
  - Urgencia para impulsivos
  - Escasez para analíticos
  - Social proof para emocionales
- **UI mejorada**:
  - Foto del guardián aumentada a 260px
  - "Guardar para después" con localStorage
  - Formulario de email en resultado
- **Problemas encontrados**:
  - ~~Vercel no despliega nuevos archivos (404/405)~~ ✅ RESUELTO
  - ~~Posible desconexión GitHub-Vercel tras cambio dominio Wix→10web~~ ✅ RESUELTO
  - Email implementado pero no llega (requiere debug SMTP)
- **Solución**: Implementación 100% WordPress, sin depender de Vercel para este test

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

## 12. TEST DEL GUARDIÁN - ✅ REDISEÑO COMPLETO v15.2

### 12.1 Estado Actual - COMPLETADO (2026-01-25)
- ✅ Test funciona visualmente (v15.2, bypasea Elementor con `template_redirect`)
- ✅ Música funciona (audio ambiental integrado)
- ✅ Sistema de perfilado implementado (vulnerabilidad, dolor, estilo decisión)
- ✅ Conexión con productos reales de WooCommerce
- ✅ Intro cinematográfica "Los Elegidos" restaurada
- ✅ IA integrada directamente en WordPress (Anthropic API)
- ✅ Foto del guardián 260px con glow
- ✅ "Guardar para después" con localStorage
- 🟡 Emails no llegan (implementado pero requiere debug)
- ✅ Vercel funcionando correctamente (verificado 2026-01-25)

### 12.2 Sistema de Perfilado IMPLEMENTADO

El test clasifica al usuario en:

| Dimensión | Valores | Implementación |
|-----------|---------|----------------|
| **Vulnerabilidad** | Alta / Media / Baja | ✅ Análisis de respuestas emocionales |
| **Dolor Principal** | Soledad / Dinero / Salud / Relaciones | ✅ Preguntas categorizadas |
| **Estilo Decisión** | Impulsivo / Analítico / Emocional | ✅ Detección por patrones |

### 12.3 Intro Cinematográfica "Los Elegidos"

Secuencia de 4 pantallas con texto que aparece gradualmente:

1. **Pantalla Elegidos:**
   - "Existen personas que fueron llamadas."
   - "No por su nombre,"
   - "sino por algo más profundo."

2. **Pantalla Título:**
   - "No encontraste esta página por casualidad."

3. **Pantalla Explicación:**
   - "Vamos a hacerte algunas preguntas."
   - "No hay respuestas correctas o incorrectas."
   - "Solo existe tu verdad."

4. **Pantalla Pregunta Final:**
   - "¿Estás lista para descubrir qué Guardián te eligió?"
   - Botón "Comenzar mi viaje"

### 12.4 Secuencia de Micro-Compromisos IMPLEMENTADA

1. ✅ "¿Querés saber qué guardián te corresponde?" → **Test gratis**
2. ✅ "¿Querés que te avise si aparece uno para vos?" → **Captura email en resultado**
3. ✅ "¿Querés ver el mensaje que tiene para vos?" → **Mensaje generado por IA**
4. ✅ Link directo al producto en WooCommerce
5. ⏳ Reserva/Seña (pendiente implementar)

### 12.5 Pantalla de Resultado - IMPLEMENTADA

Incluye:
- [x] Mensaje personalizado generado por IA (Anthropic)
- [x] Validación emocional basada en perfil psicológico
- [x] Foto REAL del guardián de WooCommerce (260px con glow)
- [x] Nombre y descripción del guardián
- [x] Estrategia de conversión según perfil (urgencia, escasez, social proof)
- [x] Opción: "Guardar para después" (localStorage)
- [x] Opción: "Enviar a mi email" (implementado, no funciona)
- [x] Botón: "Conocer a [nombre]" → Link al producto
- [x] Opción: "Ver otros guardianes" → Tienda

### 12.6 Implementación Técnica COMPLETADA

| Componente | Estado | Detalles |
|------------|--------|----------|
| **Fetch productos** | ✅ | WP_Query con `post_type => 'product'` y `tax_query` |
| **Algoritmo matching** | ✅ | `tg_buscar_guardian()` cruza categoría con perfil |
| **Mensaje IA** | ✅ | `tg_generar_mensaje_con_ia()` llama Anthropic API |
| **Captura email** | ✅ | Formulario en resultado, AJAX `tg_enviar_email` |
| **Guardar local** | ✅ | localStorage con nombre, email, respuestas, resultado |

### 12.7 Archivos Involucrados

**Plugin principal (WordPress mu-plugins):**
- `wordpress-plugins/test-guardian-v15-completo.php` (67KB)

**Endpoints AJAX en WordPress:**
```php
add_action('wp_ajax_nopriv_tg_analizar', 'tg_analizar_resultados');
add_action('wp_ajax_tg_analizar', 'tg_analizar_resultados');
add_action('wp_ajax_nopriv_tg_enviar_email', 'tg_enviar_email');
add_action('wp_ajax_tg_enviar_email', 'tg_enviar_email');
```

**API Key en wp-config.php:**
```php
define( 'ANTHROPIC_API_KEY', 'sk-ant-api03-...' );
```

**Endpoint Vercel:**
- `/app/api/test-guardian/analizar/route.js` - Disponible (Test usa WordPress directamente)

### 12.8 Problemas Pendientes

| Problema | Estado | Notas |
|----------|--------|-------|
| Email no llega | ✅ RESUELTO | Gmail SMTP desde info@duendesdeluruguay.com |
| Vercel no despliega | ✅ RESUELTO | Verificado 2026-01-25 - APIs funcionan |
| GitHub-Vercel conexión | ✅ RESUELTO | Deploy automático funcionando |

---

## 13. TITO v3 - SISTEMA DE TOOLS PARA CLAUDE

### 13.1 Arquitectura

**Archivos creados:**
- `/lib/tito/tools.js` - Definición de tools para Claude API
- `/lib/tito/tool-executor.js` - Ejecución de tools
- `/app/api/tito/v3/route.js` - Endpoint principal con Tools
- `/app/api/tito/proactivo/route.js` - Mensajes proactivos

**Archivos modificados:**
- `/lib/tito/personalidad.js` - Quitada seña, agregado anti-psicólogo
- `/lib/tito/manual-persuasion.js` - Quitada seña
- `/lib/tito/conocimiento.js` - FAQ expandido, Mi Magia, tasas actualizadas

### 13.2 Tools Disponibles

| Tool | Descripción |
|------|-------------|
| `mostrar_productos` | Muestra guardianes del catálogo filtrados |
| `buscar_producto` | Busca un guardián por nombre |
| `buscar_pedido` | Busca pedido por número/email/nombre |
| `calcular_precio` | Calcula precio en moneda del cliente |
| `guardar_info_cliente` | Guarda info en memoria (KV) |
| `obtener_info_cliente` | Obtiene info guardada |
| `guiar_compra` | Guía al cliente a comprar en la web |
| `info_envios` | Info de envíos según país |
| `info_mi_magia` | Info sobre sección Mi Magia |
| `consultar_faq` | Consulta FAQ ampliado |
| `admin_*` | Tools de admin (buscar, dar regalos, estadísticas, etc.) |

### 13.3 Reglas de Tito

**LO QUE NO HACE:**
- ❌ Ofrecer seña/reserva del 30%
- ❌ Dar datos de pago o cuentas bancarias
- ❌ Procesar pagos
- ❌ Ser psicólogo gratis (límite 6-8 mensajes sin avanzar)
- ❌ Dar precios de memoria (siempre verifica con tool)

**LO QUE SÍ HACE:**
- ✅ Guiar a la tienda web para comprar
- ✅ Distinguir "quiero comprar" vs "ya compré"
- ✅ Conocer historia del guardián antes de recomendar
- ✅ Dar precios según país (UY en pesos, exterior en USD + local)
- ✅ Hablar de Mi Magia cuando pregunten sobre cuidados
- ✅ Detectar tipo de cliente (comprador, seguimiento, pichi, etc.)

### 13.4 Precios por País

**Uruguay:**
- Precios fijos en pesos uruguayos
- Ejemplo: "Mini Clásico $2.500 pesos uruguayos"

**Exterior:**
- Precios en USD + aproximado en moneda local
- Ejemplo: "$70 USD (aprox. $87,500 pesos argentinos)"

**Países dolarizados (US, EC, PA, SV):**
- Solo USD

### 13.5 Mi Magia - Conocimiento

Tito ahora sabe que cuando pregunten sobre:
- Cuidados del guardián
- Qué reciben después de comprar
- Canalización personalizada
- Código QR del guardián

Debe hablar de la sección **Mi Magia**:
- URL: duendesdeluruguay.com/mi-magia/
- Acceso: escaneando QR o con código DU2601-XXXXX
- Contenido: canalización, historia, dones, ritual, cuidados
- Recanalización: gratis si es guardián de DU, $7 si es externo

### 13.6 Pendientes de Tito

- [ ] Probar endpoint v3 en producción
- [ ] Integrar widget de burbujas proactivas en la web
- [ ] Actualizar ManyChat para usar v3
- [ ] Testear flujo completo de conversación

---

*Este archivo se actualiza conforme se corrigen los problemas*
