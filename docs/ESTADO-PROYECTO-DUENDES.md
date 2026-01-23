# ESTADO DEL PROYECTO - DUENDES DEL URUGUAY
**Última actualización:** 23 de Enero 2026 - 18:10

---

## RESUMEN EJECUTIVO

**Duendes del Uruguay** es un negocio de arte espiritual que crea "duendes canalizados" - figuras artesanales únicas que funcionan como guardianes energéticos. El negocio tiene una fuerte presencia digital y vende principalmente a mujeres de 35-65 años interesadas en espiritualidad.

---

## PRESENCIA DIGITAL ACTUAL

### Redes Sociales
| Plataforma | Usuario | Seguidores | Engagement |
|------------|---------|------------|------------|
| Instagram | @duendesdeluruguay | 137,000 | Alto |
| TikTok | @duendesdeluruguay | 102,000 | 843K likes |
| Facebook | duendescanalizados | - | - |
| Pinterest | DuendesdelUruguay | 409 | Medio |

### Sitios Web
| Sitio | URL | Plataforma | Estado |
|-------|-----|------------|--------|
| Web Principal | duendesuy.10web.cloud | WordPress/Elementor | Activo |
| Mi Magia (Portal Elegidos) | duendes-vercel.vercel.app/mi-magia | Next.js/Vercel | Activo |
| Web Oficial (redirect) | duendesdeluruguay.com | - | Redirige a 10web |

---

## AVATAR OBJETIVO

### Perfil Demográfico
- **Género:** Mujeres (95%)
- **Edad:** 35-65 años
- **Ubicación:** Latinoamérica, España, USA hispano
- **NSE:** Medio-Alto
- **Estado:** Buscan significado, conexión espiritual

### 5 Arquetipos del Avatar

1. **La Víctima**
   - "Todo me pasa a mí"
   - Siente que el universo está en su contra
   - Necesita: Validación, protección

2. **La Buscadora**
   - Colecciona métodos pero no profundiza
   - Ha probado tarot, astrología, terapias
   - Necesita: Algo que realmente funcione

3. **La Que Repite Patrones**
   - Relaciones tóxicas cíclicas
   - "Siempre me pasa lo mismo"
   - Necesita: Romper el ciclo

4. **La Sanadora Herida**
   - Cuida a todos menos a sí misma
   - Agotada de ser la fuerte
   - Necesita: Que alguien la sostenga

5. **La Que Busca Amor**
   - Idealiza lo que no tiene
   - "Siempre doy más de lo que recibo"
   - Necesita: Ser elegida primero

---

## ESTRUCTURA WEB ACTUAL (WordPress)

### Homepage - Secciones en Orden:
1. **Hero** - Video de fondo con duende en bosque
2. **Test del Guardián** - "¿Qué Duende Te Está Buscando?"
3. **Categorías** - "Elegí Según Tu Intención" (Protección, Amor, Dinero, Salud)
4. **¿Qué Es Un Duende Canalizado?** - 4 cards explicativas
5. **¿Cómo Reconocer a Tu Duende?** - Carrusel de pasos
6. **Lo Que Incluye Tu Duende** - Certificado, Guía, Punto Energético
7. **Piriápolis** - Sección sobre la ciudad alquimista
8. **Testimonios** - Reviews con fotos
9. **Comparativa** - Artesanía común vs Duendes del Uruguay
10. **Pagos y Envíos** - Métodos y opciones
11. **El Grimorio** - Blog/Contenido
12. **Footer** - Links, newsletter, redes

### Plugins Activos:
```
/wp-content/plugins/
├── duendes-hub-control.php (v2.0) - HUB CENTRAL de control desde WordPress
│   └── Incluye: MODO DIOS, Generador Historias, Estadísticas, etc.

/wp-content/mu-plugins/
├── duendes-neuromarketing.php (v5.0) - Mejoras de conversión
├── duendes-canalizaciones-admin.php - Admin de canalizaciones
├── duendes-canalizador.php - Sistema de canalización
├── duendes-cart-checkout.php - Checkout personalizado
├── duendes-checkout-guardian.php - Checkout con guardián
├── duendes-experiencia-magica.php - Experiencias post-compra
├── duendes-homepage-mods.php - Modificaciones homepage
├── duendes-mi-magia.php - Integración Mi Magia
├── duendes-qr-imprimir.php - QR para impresión
├── duendes-tienda-tarot.php - Tienda con estilo tarot
└── duendes-remote-control.php - Control remoto
```

---

## LO QUE SE HIZO (Enero 2026)

### 🆕 HOY - 23 ENERO 2026 (18:10)

#### 🔥 Sistema de Rotación de Patrones v3

**Problema resuelto:** Las historias generadas:
1. Empezaban SIEMPRE desde el dolor ("hay quienes cargan con...", "hay personas que...")
2. Usaban el patrón repetitivo "no vino a darte consejos, no vino a X, no vino a Y"
3. Se sentían como copy-paste con diferentes nombres
4. Faltaba variedad y unicidad

**Solución implementada:**

1. **Rotación, NO prohibición:** Un patrón puede reutilizarse después de ~15 historias
2. **Hooks desde el GUARDIÁN:** Prioridad a aperturas como:
   - "{nombre} nació con una misión clara: ser escudo."
   - "{nombre} no llegó por casualidad."
   - "Hay guardianes que nacen para cuidar. {nombre} es uno de ellos."
3. **Patrón PROHIBIDO:** "no vino a X, no vino a Y, no vino a Z" (muy repetitivo)
4. **Score protection:** Al regenerar, si el score nuevo es menor → regenera automáticamente (máx 3 intentos)
5. **Temperatura:** 0.85 (balance creatividad/consistencia)
6. **Aperturas prohibidas siempre:** érase una vez, había una vez, en lo profundo del bosque, las brumas del...

**Archivos modificados:**
- `/lib/guardian-intelligence/config.js` - PATRONES_APERTURA, HOOKS_APERTURA, APERTURAS_PROHIBIDAS_SIEMPRE
- `/lib/guardian-intelligence/generator.js` - Prompt actualizado, temperatura 0.85
- `/app/api/admin/historias/route.js` - Prompt con estructura flexible, score protection
- `/app/admin/generador-historias/page.jsx` - Score protection en frontend

#### 🎯 Trabajo Manual: Primeros 100 Guardianes

**Estado:** EN PROGRESO - Trabajando con Claude para evaluar cada historia

**Flujo de trabajo:**
1. Usuario indica: **"[Nombre del guardián] - [Categoría]"**
2. Claude genera historia usando el sistema con todas las reglas nuevas
3. Muestra historia + score + evaluación
4. Si aprueba → Click "Guardar en WooCommerce"
5. Si no → Ajustar y regenerar

**Categorías disponibles:** Protección, Abundancia, Sabiduría, Salud, Amor, Sanación

**Las categorías se definen a medida que se generan** (no están pre-asignadas)

**Guardado a WooCommerce:**
- Busca producto por nombre exacto
- Actualiza descripción automáticamente
- Convierte markdown a HTML

---

### SEMANA 20-23 ENERO 2026

#### 1. Creador Inteligente de Productos (NUEVO)
Nuevo modo en `/admin/generador-historias` que permite:
- **Subir fotos** de productos nuevos (drag & drop)
- **Análisis con Claude Vision** automático
- **Campo de texto libre** con parseo inteligente (detecta nombre, tamaño, categoría, cristales)
- **Generación de historia** con sistema de conversión completo
- **Publicación directa a WooCommerce** (sube fotos + crea producto)

Flujo: Paso 18 → 19 → 20 → 22 → 23

#### 2. Sistema de Auto-Aprendizaje
El Planificador Visual ahora:
- Detecta categorías con 100+ keywords mapeados
- **Aprende de generaciones exitosas** y las almacena en Vercel KV
- Los temas aprendidos tienen prioridad sobre el mapeo estático
- API: `/api/admin/historias/temas-aprendidos`

#### 3. Nuevas Especializaciones
Agregadas 2 nuevas categorías al sistema de conversión:
- **Viajeros**: Duendes con mochilas, cambio de dirección, nuevos horizontes
  - Subcategorías: aventura, sabiduría, reinvención, horizontes, despegue
- **Bosque/Naturaleza**: Duendes con hierbas, hongos, conexión con la tierra
  - Subcategorías: sanación, raíces, micelios, hierbas, hongos, equilibrio

#### 4. Hub de WordPress v2.0
Plugin actualizado con todas las rutas de Vercel:
- MODO DIOS (acceso total)
- Generador de Historias
- Mi Magia / Círculo
- Elegidos / Lecturas
- Contenido / Estadísticas
- Regalos / Experiencias

#### 5. Mejoras Técnicas
- API de WooCommerce con mejor manejo de errores
- API de análisis de imagen acepta base64 además de URLs
- Parser de texto libre en `/lib/parsers/texto-producto.js`

---

### SEMANA 13-19 ENERO 2026

#### 1. Análisis Profundo de Neuromarketing
- Revisé Instagram (137K seguidores)
- Revisé TikTok (102K seguidores, 843K likes)
- Analicé toda la estructura de la web
- Identifiqué copies que funcionan en TikTok

#### 2. Plugin Neuromarketing v5.0 (Activo)
Lo que hace actualmente:
- **Oculta shortcodes rotos** ([duendes_grid], [grimorio_ultimas])
- **Partículas doradas sutiles** (12 partículas flotantes)
- **Popup de social proof** ("María de Buenos Aires adoptó su guardián hace 3 min")
- **Shimmer effect en CTAs** (brillo que pasa por botones)
- **Glow dorado en hover** de cards existentes

#### 3. Intentos Previos (Descartados)
- v1.0-v4.1: Varios intentos de agregar secciones nuevas que rompían la estética
- Se decidió respetar la estética actual y solo hacer mejoras sutiles

---

## LO QUE TIENE LA WEB (Fortalezas)

### Diseño
- Paleta de colores premium (oro + verde oscuro + crema)
- Tipografía elegante (Cinzel + Cormorant Garamond)
- Imágenes de alta calidad de los duendes
- Diseño responsive

### Copy
- "No los creamos. Los canalizamos" - Poderoso
- "El duende te elige a vos" - Inversión de poder
- Testimonios reales con fotos
- Narrativa de Piriápolis como punto energético

### Funcionalidad
- Test del Guardián interactivo
- Categorías por intención (Protección, Amor, Dinero, Salud)
- Carrusel de proceso de compra
- Checkout personalizado

### Confianza
- Certificado de autenticidad
- Guía mágica incluida
- Comparativa con artesanía común
- Testimonios con nombres y ubicaciones

---

## LO QUE LE FALTA (Oportunidades)

### Neuromarketing - Nivel 1 (Fácil)
- [ ] **Banner de urgencia real** - "Solo 3 disponibles de esta energía"
- [ ] **Contador de visitas** - "47 personas viendo esto ahora"
- [ ] **Timer de oferta** - Para promociones especiales
- [ ] **Exit intent popup** - Cuando van a cerrar la página

### Neuromarketing - Nivel 2 (Medio)
- [ ] **Categorías por DOLOR** en lugar de producto:
  - "Me siento sola" en vez de "Amor"
  - "Nada me alcanza" en vez de "Abundancia"
  - "Algo me está frenando" en vez de "Protección"
  - "Estoy agotada de ser la fuerte" en vez de "Salud"
- [ ] **Micro-validaciones** para cada avatar
- [ ] **Video testimonios** de clientas reales

### Neuromarketing - Nivel 3 (Avanzado)
- [ ] **Quiz personalizado** que detecte el arquetipo del avatar
- [ ] **Recomendaciones AI** basadas en respuestas
- [ ] **Email sequences** por arquetipo
- [ ] **Retargeting** personalizado

### Técnico
- [ ] **Velocidad** - Optimizar imágenes y lazy loading
- [ ] **SEO** - Meta descriptions, structured data
- [ ] **Analytics** - Tracking de conversión por sección
- [ ] **A/B Testing** - Probar diferentes copies

---

## COPIES DE TIKTOK QUE FUNCIONAN (Para usar en web)

```
"Nuestros duendes no son para cualquiera.
No son para quienes buscan 'una decoración mágica'.
Ni para quien solo quiere una figura bonita en una estantería."

"No son productos. Son compañeros energéticos.
Seres que responden al alma que los reconoce."

"Si buscás una conexión real...
Si sentís el llamado en la piel...
Si sabés que hay algo más allá de lo que se ve...
Entonces sí. Nuestros duendes son para vos.
Y ya te están esperando."

"Cuando un duende aparece en tu camino
no es para adornar tu casa.
Es para acompañarte en algo mucho más profundo."
```

---

## PORTAL MI MAGIA (Vercel)

### URL
`https://duendes-vercel.vercel.app/mi-magia`

### Funcionalidades
- Acceso con token único por cliente
- Sección "Los Elegidos" - Comunidad exclusiva
- Lecturas de tarot personalizadas
- Sistema de runas y tréboles
- Experiencias mágicas post-compra

### Tecnología
- Next.js 14
- Vercel KV (Redis)
- Resend (emails)
- Diseño cinematográfico con animaciones SVG

---

## GENERADOR DE HISTORIAS (Vercel)

### URL
`https://duendes-vercel.vercel.app/admin/generador-historias`

### Modos Disponibles
| Modo | Descripción | Uso |
|------|-------------|-----|
| **Guardián Existente** | Generar historia para guardián del catálogo | Carga automática de datos |
| **Guardián Nuevo** | Encuesta inteligente con Claude | Claude te guía paso a paso |
| **Modo Rápido** | Generar directo desde catálogo | Solo aprobar/rechazar |
| **Modo Directo** | 1 click = 1 historia | Sin vueltas |
| **Batch Inteligente** | Seleccionar varios, agrupar por especialización | Sin repetir hooks/sincrodestinos |
| **Planificador Visual** | Ver todas las fotos, asignar categorías | EL MÁS POTENTE |
| **Crear Producto Nuevo** | Subir fotos, analizar, generar, publicar a WC | TODO EN UNO (NUEVO) |

### Sistema de Conversión
Ubicación: `/lib/conversion/`
- `hooks.js` - Frases de apertura por categoría (100+ hooks)
- `sincrodestinos.js` - Eventos mágicos durante creación
- `cierres.js` - Cierres por perfil psicológico (vulnerable, escéptico, impulsivo)
- `arco.js` - Validación de arco emocional (8 fases)
- `scoring.js` - Sistema de scoring (0-50 puntos)
- `especializaciones.js` - 11 categorías con subcategorías

### Categorías de Especialización
1. **Principales** - Fortuna, suerte, abrecaminos
2. **Protección** - Hogar, energía, envidia, límites
3. **Amor** - Propio, pareja, sanación, fertilidad
4. **Sanación** - Emocional, física, duelo
5. **Abundancia** - Dinero, trabajo, bloqueos
6. **Sabiduría** - Intuición, decisiones, propósito
7. **Magia** - Poder personal, manifestación
8. **Creatividad** - Artistas, bloqueo creativo
9. **Sueños** - Viajes astrales, pesadillas
10. **Viajeros** - Aventura, reinvención, horizontes (NUEVO)
11. **Naturaleza** - Bosque, hierbas, hongos, raíces (NUEVO)

---

## FLUJO DE COMPRA ACTUAL

```
1. Usuario llega a la web
   ↓
2. Ve el hero con video
   ↓
3. Hace el Test del Guardián (o navega categorías)
   ↓
4. Explora productos en Tienda Mágica
   ↓
5. Agrega al carrito
   ↓
6. Checkout personalizado con formulario especial
   ↓
7. Pago (Plexo, Handy, transferencia)
   ↓
8. Confirmación + email con acceso a Mi Magia
   ↓
9. Recibe token único para el portal
   ↓
10. Accede a experiencias exclusivas
```

---

## CREDENCIALES Y ACCESOS

### WordPress (10web)
- **URL Admin:** duendesuy.10web.cloud/wp-admin
- **SFTP Host:** 34.70.139.72
- **SFTP Port:** 55309
- **SFTP User:** sftp_live_WfP6i

### Vercel
- **Proyecto:** duendes-vercel
- **KV Database:** Configurada
- **Dominio:** duendes-vercel.vercel.app

---

## PRÓXIMOS PASOS RECOMENDADOS

### ✅ COMPLETADO (Enero 2026)
- [x] Creador Inteligente de Productos
- [x] Sistema de auto-aprendizaje de temas
- [x] Especializaciones Viajeros y Bosque
- [x] Hub de WordPress v2.0
- [x] Mejoras en APIs de WooCommerce
- [x] **Sistema de rotación de patrones v3** (23/01)
- [x] **Hooks desde el guardián** (no siempre dolor) (23/01)
- [x] **Score protection para regeneración** (23/01)
- [x] **Guardado automático a WooCommerce por nombre** (23/01)

### 🔜 EN CURSO - Trabajo Manual 100 Guardianes
**PROCESO ACTIVO:** Generando historias 1 a 1 con Claude para los primeros 100 guardianes
- Usuario indica nombre + categoría
- Claude genera con el nuevo sistema
- Si aprueba → guarda en WooCommerce
- Si no → ajusta y regenera

### 📋 Próximo

### 📋 Corto Plazo (Este mes)
1. **Editar productos existentes** - Agregar opción de editar además de crear
2. **Preview antes de publicar** - Vista previa del producto en WC
3. Implementar categorías por dolor en la web
4. Agregar más testimonios en video

### 🎯 Mediano Plazo (Este trimestre)
1. **Quiz avanzado de arquetipo** con detección de perfil psicológico
2. **Email sequences personalizados** por arquetipo
3. **Sistema de retargeting** personalizado
4. **Sincronización bidireccional** WooCommerce ↔ Vercel KV
5. **Generación masiva de historias** para catálogo completo

---

## NOTAS IMPORTANTES

1. **No usar frases genéricas de IA** - Ver CLAUDE.md para guía de escritura
2. **El guardián elige, no al revés** - Concepto central de la marca
3. **Cada duende es único** - Si se vende, no vuelve (FOMO real, no marketing)
4. **Piriápolis = Punto energético** - Usar como diferenciador
5. **Thibisay = Voz humana** - Usar español rioplatense (vos, tenés)

---

---

## ARCHIVOS IMPORTANTES

| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| CLAUDE.md | `/duendes-vercel/` | Biblia de escritura y canalizaciones |
| BIBLIA-HISTORIAS-GUARDIANES.md | `/duendes-vercel/` | Sistema completo para historias |
| ESTADO-PROYECTO-DUENDES.md | `/duendes-vercel/` | Este archivo |
| ESTADO-GUARDIAN-INTELLIGENCE.md | `/duendes-vercel/` | Documentación del sistema AI |
| duendes-hub-control.php | `/wordpress-plugins/` | Hub de control en WP |

---

*Documento actualizado el 23 de Enero 2026 - 18:10*
*Para uso interno de Duendes del Uruguay*

---

## CÓMO CONTINUAR DESDE AQUÍ

### Si vas a generar historias:
1. Leer este documento + CLAUDE.md
2. Usuario te dice: "[Nombre guardián] - [Categoría]"
3. Usás el Modo Directo en `/admin/generador-historias`
4. Evaluás score + historia
5. Si aprueba → Guardar en WooCommerce

### Archivos clave del sistema de generación:
```
/lib/guardian-intelligence/config.js    → Patrones, hooks, prohibiciones
/lib/guardian-intelligence/generator.js → Lógica de generación
/app/api/admin/historias/route.js       → API principal (ESTA ES LA QUE SE USA)
/app/admin/generador-historias/page.jsx → Frontend del generador
/lib/guardian-intelligence/productos-base.json → 113 guardianes con datos
```

### Reglas actuales del sistema:
1. **Rotación de patrones** - Usar después de 15 historias, no prohibir
2. **Hooks desde el guardián** - Priorizar "{nombre} nació con...", "{nombre} llegó..."
3. **Prohibido "no vino a X"** - Patrón muy repetitivo
4. **Score protection** - Al regenerar, nunca bajar el score
5. **Temperatura 0.85** - Balance creatividad/consistencia
6. **Categorías se definen al generar** - No están pre-asignadas
