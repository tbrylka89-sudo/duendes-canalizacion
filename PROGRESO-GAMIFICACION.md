# PROGRESO: Sistema de Gamificación Duendes del Uruguay

**Última actualización:** 2026-01-17 18:00

---

## 1. IDEA GENERAL

Sistema de gamificación tipo videojuegos/casinos para Duendes del Uruguay:
- **Runas** como moneda interna
- **Lecturas/Estudios** que se compran con runas
- **Niveles y XP** para progresión
- **Rachas diarias** con recompensas
- **Misiones y badges** coleccionables
- **Memoria IA** que recuerda lecturas anteriores
- **Integración** con guardianes físicos

---

## 2. DECISIONES TOMADAS

### 2.1 Precios de Paquetes de Runas

| Paquete | Runas | Precio USD | Bonus | Slug WooCommerce |
|---------|-------|------------|-------|------------------|
| Chispa | 30 | $5 | - | paquete-runas-30 |
| Destello | 80 | $10 | +10 | paquete-runas-80 |
| Resplandor | 200 | $20 | +40 | paquete-runas-200 |
| Fulgor | 550 | $50 | +150 | paquete-runas-550 |
| Aurora | 1200 | $100 | +400 | paquete-runas-1200 |

### 2.2 Membresías del Círculo

| Plan | Precio | Runas Bienvenida | Runas/Mes | Slug |
|------|--------|------------------|-----------|------|
| Mensual | $15 | 20 | 12 | circulo-mensual |
| Seis Meses | $50 | 60 | 15 | circulo-seis-meses |
| Anual | $80 | 120 | 25 | circulo-anual |

### 2.3 Runas de Bienvenida

- Registro normal: 20 runas
- Registro con referido: 30 runas
- Compra guardián físico: +10% del precio en runas

### 2.4 Catálogo de Lecturas

**Básicas (15-30 runas) - Nivel Iniciada:**
- Consejo del Bosque: 15 runas
- Susurro del Guardián: 20 runas
- Tirada de 3 Runas: 25 runas
- Energía del Día: 15 runas

**Estándar (40-75 runas) - Nivel Aprendiz:**
- Tirada de 5 Runas: 40 runas
- Oráculo de los Elementales: 50 runas
- Mapa de tu Energía: 60 runas
- Ritual del Mes: 55 runas
- Numerología Personal: 65 runas
- Lectura de Tarot Simple: 50 runas
- Mensaje de tu Guardián: 45 runas (requiere guardián)

**Premium (100-150 runas) - Nivel Guardiana:**
- Tirada de 7 Runas: 100 runas
- Lectura de Tarot Profunda: 120 runas
- Carta Astral Esencial: 130 runas
- Lectura de Año Personal: 140 runas
- Conexión con tu Guardián: 110 runas (requiere guardián)

**Ultra Premium (200-400 runas) - Nivel Maestra:**
- Estudio del Alma: 200 runas
- Conexión con Ancestros: 250 runas
- Mapa de Vidas Pasadas: 300 runas
- Propósito de Vida: 350 runas
- Gran Estudio Anual: 400 runas

### 2.5 Sistema de Niveles

| Nivel | XP Necesaria | Beneficios |
|-------|--------------|------------|
| Iniciada | 0 | Lecturas básicas |
| Aprendiz | 100 | +Lecturas estándar |
| Guardiana | 500 | +Premium, 5% desc |
| Maestra | 1500 | +Ultra, 10% desc |
| Sabia | 4000 | Todo, 15% desc |

### 2.6 Rachas

- Día 7: +15 runas
- Día 14: +30 runas
- Día 30: +75 runas + lectura gratis
- Día 60: +150 runas
- Día 100: +300 runas + badge

---

## 3. COMPLETADO ✅

### WordPress (duendesuy.10web.cloud)

- [x] Página /shop/ con tienda de guardianes físicos
- [x] Página /circulo/ con landing de venta del Círculo
- [x] Enlaces corregidos a circulo-seis-meses y circulo-anual

### Archivos creados:

```
WordPress mu-plugins:
- duendes-tienda-tarot.php (tienda de guardianes)
- duendes-circulo-landing.php (landing del círculo)
```

### Análisis de infraestructura existente (2026-01-17 16:00)

- [x] Base de datos: **Vercel KV (Redis/Upstash)**
- [x] Sistema de usuarios ya existe con: runas, treboles, guardianes, lecturas
- [x] Webhooks WooCommerce ya configurados en `/api/webhooks/woocommerce`
- [x] Sistema de experiencias parcialmente implementado
- [x] Packs de runas ya definidos (pero hardcodeados en frontend)

### Configuración de gamificación (2026-01-17 16:15)

- [x] Crear `lib/gamificacion/config.js` con toda la configuración central
  - Niveles y XP
  - Sistema de rachas
  - Paquetes de runas
  - Membresías
  - Catálogo de 30+ lecturas
  - Misiones
  - Badges
  - Referidos
  - Helpers para obtener datos

### APIs de gamificación (2026-01-17 17:00)

- [x] `app/api/gamificacion/usuario/route.js`
  - GET: datos de gamificación con nivel calculado
  - POST: acciones (login_diario, lectura_completada, compra, referido, mision_completada, publicacion_foro)
- [x] `app/api/gamificacion/cofre-diario/route.js`
  - Rueda de probabilidades (1-10 runas)
  - Sistema de rachas con bonuses
- [x] `app/api/gamificacion/lecturas/route.js`
  - Catálogo filtrado por nivel y requisitos
  - Eventos de luna llena/nueva
  - Portales estacionales
  - Descuentos para miembros Círculo
- [x] `app/api/gamificacion/ejecutar-lectura/route.js`
  - Ejecutar lectura con verificación completa
  - Descuentos combinados (membresía + nivel)
  - Generación IA con prompts específicos por categoría
  - Tracking de XP y progresión

### Integración Experiencias ↔ Gamificación (2026-01-17 19:00)

- [x] `app/api/experiencias/solicitar/route.js`
  - Import de XP_ACCIONES y obtenerNivel
  - Helper actualizarGamificacion para tracking
  - Helper determinarCategoria para mapeo de tipos
  - Tracking automático al completar experiencia inmediata
  - Respuesta incluye datos de gamificación

- [x] `app/api/experiencias/procesar/route.js`
  - Helper actualizarGamificacionAsync para cron
  - Tracking de XP al completar experiencias async
  - Almacenamiento de datos de gamificación en solicitud

### UI de Gamificación (2026-01-17 18:00)

- [x] `app/mi-magia/page.jsx` - Componente CofreDiario
  - Animación de rueda giratoria al abrir cofre
  - Modal de recompensas con efectos visuales
  - Indicador de racha (1-100 días)
  - Barra de progreso hacia próximo bonus
  - Integración con API de cofre diario

- [x] `app/mi-magia/page.jsx` - Componente CatalogoLecturasGamificado
  - Catálogo completo con 6 categorías
  - Tabs navegables por categoría
  - Cards de lecturas con estados (disponible, bloqueada, popular, destacada)
  - Indicadores de nivel y requisitos de guardián
  - Eventos lunares activos destacados
  - Descuentos visibles para miembros Círculo
  - Vista de detalle con info completa
  - Formulario de solicitud
  - Vista de resultado con XP ganado y nivel
  - Ruta: /mi-magia → lecturas_gamificadas

### Tienda de Runas (2026-01-17 19:30)

- [x] `app/mi-magia/page.jsx` - Componente TiendaRunas
  - 5 paquetes de runas (Chispa, Destello, Resplandor, Fulgor, Aurora)
  - Cards con diseño místico y animaciones hover
  - Bonus visibles (+10 a +400 runas gratis)
  - Ratio de runas por dólar
  - Balance actual del usuario
  - Enlaces a WooCommerce para compra
  - Info de pago seguro/entrega instantánea
  - Sección "¿Qué puedo hacer con runas?"
  - Ruta: /mi-magia → tienda_runas
  - Acceso desde: Stat de runas (con +), Botón en accesos rápidos

---

## 4. EN PROGRESO 🔄

**Fase 1: APIs de gamificación - COMPLETADA ✅**

APIs creadas:
- ✅ `lib/gamificacion/config.js` - Configuración central (747 líneas)
- ✅ `app/api/gamificacion/usuario/route.js` - GET/POST datos gamificación
  - GET: obtener nivel, XP, racha, badges, estado cofre
  - POST: registrar acciones (login, lectura, compra, referido, misión, foro)
- ✅ `app/api/gamificacion/cofre-diario/route.js` - Sistema de cofre diario
  - Rueda de runas con probabilidades ponderadas
  - Bonuses por racha (7, 14, 30, 60, 100 días)
  - Lecturas gratis y badges de recompensa
- ✅ `app/api/gamificacion/lecturas/route.js` - Catálogo de lecturas
  - GET: catálogo completo filtrado por nivel/guardián/membresía
  - POST: detalle de lectura específica con acceso y precios
  - Eventos de luna llena/nueva con calendario real
  - Portales estacionales con fechas exactas
  - Descuentos automáticos para miembros del Círculo

**Siguiente paso - Fase 2:**
- [x] Crear API para ejecutar lectura: `/api/gamificacion/ejecutar-lectura`
  - POST: ejecutar lectura con verificación de nivel, guardián, runas
  - GET: obtener lectura completada
  - Descuentos automáticos por membresía (5-10%) y nivel (5-15%)
  - Integración con sistema de XP y gamificación
  - Generación IA con prompts por categoría
- [x] Crear UI del cofre diario en Mi Magia
  - Componente CofreDiario con animación de rueda
  - Modal de recompensas con efectos visuales
  - Indicador de racha y progreso hacia bonus
  - Integración con API /api/gamificacion/cofre-diario
- [x] Crear UI de catálogo de lecturas gamificado
  - Componente CatalogoLecturasGamificado completo
  - Organizado por categorías (básicas, estándar, premium, ultra, eventos, temporada)
  - Indicadores de nivel con candados para bloqueadas
  - Descuentos visibles para miembros del Círculo
  - Eventos lunares activos destacados
  - Vista de detalle con formulario
  - Vista de resultado con XP y nivel
- [x] Integrar con sistema de experiencias existente
  - `app/api/experiencias/solicitar/route.js` - Tracking de XP en solicitudes inmediatas
  - `app/api/experiencias/procesar/route.js` - Tracking de XP en experiencias async
  - Respuestas incluyen datos de gamificación (XP ganado, nivel, subida de nivel)

---

## 5. PENDIENTE ⏳

### Fase 1: Infraestructura (ACTUAL)
- [ ] Productos WooCommerce (runas + membresías)
- [ ] Esquema de base de datos (usuarios, runas, lecturas, rachas)
- [ ] Webhook WooCommerce → Vercel

### Fase 2: Sistema de Runas
- [ ] API: GET /api/usuario/runas
- [ ] API: POST /api/usuario/runas/gastar
- [ ] UI: Mostrar balance de runas en Mi Magia
- [ ] UI: Sección de compra de runas

### Fase 3: Lecturas con IA
- [ ] API: GET /api/lecturas/catalogo
- [ ] API: POST /api/lecturas/generar
- [ ] Prompts para cada tipo de lectura
- [ ] Sistema de memoria (historial)
- [ ] UI: Catálogo de lecturas
- [ ] UI: Visualización de lectura generada

### Fase 4: Gamificación
- [ ] Sistema de rachas + cofre diario
- [ ] Sistema de XP + niveles
- [ ] Misiones (bienvenida, semanales, mensuales)
- [ ] Badges/insignias

### Fase 5: Integraciones
- [ ] Conexión guardián físico → lecturas exclusivas
- [ ] Sistema de referidos
- [ ] Notificaciones/emails automáticos

### Fase 6: Admin
- [ ] Dashboard de métricas
- [ ] Gestión de usuarios y runas
- [ ] Reportes

---

## 6. CÓMO CONTINUAR

Si la sesión se corta:

1. Leer este archivo: `PROGRESO-GAMIFICACION.md`
2. Ver sección "EN PROGRESO" para saber qué estaba haciendo
3. Continuar desde ese punto
4. Actualizar este archivo después de cada tarea

### Credenciales necesarias:

**SFTP WordPress:**
- Host: 34.70.139.72
- Puerto: 55309
- Usuario: sftp_live_WfP6i
- Password: JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR

**Base de datos WordPress:**
- Host: mysql.10web.site
- Usuario: live_user_7O9A8
- Password: tNsQGgf2PFHRNv9hAZ7TPjmHXHkTnPXKQI
- DB: live_7O9A8

### Archivos clave:

```
/Users/usuario/Desktop/duendes-vercel/
├── app/
│   ├── mi-magia/          # Portal de usuario
│   ├── circulo/           # Área de membresía
│   └── api/               # APIs de backend
├── lib/
│   └── circulo/           # Configuración del círculo
└── PROGRESO-GAMIFICACION.md  # Este archivo
```

---

## 7. NOTAS TÉCNICAS

### Stack:
- Frontend: Next.js (Vercel)
- Backend WordPress: WooCommerce
- Base de datos usuarios: Por definir (Vercel KV, Supabase, o MySQL compartido)
- IA: Claude API (Anthropic)

### Webhooks:
- WooCommerce enviará POST a `/api/webhooks/woocommerce`
- Payload incluye: producto, email, monto, metadata

### Costo IA estimado:
- ~$0.10 por lectura (usando Claude Haiku para lecturas simples)
- ~$0.30 por lectura premium (usando Claude Sonnet)
