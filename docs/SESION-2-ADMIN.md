# SESIÓN 2: PANEL ADMIN - EL TRONO DE LOS DIOSES
## Tiempo estimado: 2 horas
## Objetivo: Control TOTAL sobre usuarios, regalos y membresías

---

## CONTEXTO PREVIO

Antes de empezar, dile a Claude Code:

```
Completamos la Sesión 1. Ahora vamos con el Panel Admin. 
El admin debe estar en Vercel (NO en WordPress) para tener control total.
Las integraciones disponibles son: Anthropic, Vercel KV, GitHub, Resend, OpenAI.
```

---

## PASO 1: CREAR ESTRUCTURA DEL ADMIN

### Instrucciones para Claude Code:

```
Crea la estructura completa del Panel Admin:

RUTA: /app/admin/

ARCHIVOS A CREAR:
/app/admin/
├── page.jsx              (Dashboard principal)
├── layout.jsx            (Layout con navegación)
├── usuarios/
│   ├── page.jsx          (Lista de usuarios)
│   └── [id]/page.jsx     (Detalle de usuario)
├── regalos/
│   └── page.jsx          (Sistema de regalos)
├── contenido/
│   ├── page.jsx          (Generador de contenido)
│   └── calendario/page.jsx (Calendario editorial)
├── circulo/
│   ├── page.jsx          (Gestión del Círculo)
│   └── duende-semana/page.jsx (Duende de la semana)
└── configuracion/
    └── page.jsx          (Configuración general)

PROTECCIÓN:
- Solo accesible con credenciales de admin
- Crear middleware que verifique admin_token en cookies
- Si no es admin → redirect a /mi-magia

CREDENCIALES ADMIN (guardar en .env):
ADMIN_EMAIL=thibisay@duendesdeluruguay.com
ADMIN_PASSWORD=crear_hash_seguro
ADMIN_SECRET=generar_secret_aleatorio

Crea el sistema de autenticación admin primero.
```

---

## PASO 2: DASHBOARD PRINCIPAL

### Instrucciones para Claude Code:

```
Crea el Dashboard principal del Admin en /app/admin/page.jsx:

MÉTRICAS A MOSTRAR (cards grandes):
1. Total de Usuarios Registrados
2. Usuarios en Trial (15 días)
3. Suscriptores Activos del Círculo
4. Trials que vencen esta semana
5. Runas totales en circulación
6. Ingresos del mes (si es posible desde WooCommerce)

ACCESOS RÁPIDOS (botones):
- ➕ Agregar Usuario
- 🎁 Regalar Algo
- 📝 Crear Contenido
- 👁️ Ver Usuarios en Trial
- 📅 Calendario de Contenido

ACTIVIDAD RECIENTE (lista):
- Últimas 10 acciones (nuevo usuario, regalo enviado, contenido publicado)

ESTÉTICA:
- Fondo: Negro #0a0a0a
- Cards: Fondo semi-transparente con borde dorado sutil
- Texto: Crema #FDF8F0
- Acentos: Dorado #d4af37
- Fuentes: Cinzel para títulos, Cormorant Garamond para cuerpo
- Iconos: Lucide React o similares, estilo elegante

DATOS: Obtener de Vercel KV
- visitors:* para usuarios
- circulo:* para suscriptores
- trials:* para períodos de prueba
```

---

## PASO 3: GESTIÓN DE USUARIOS

### Instrucciones para Claude Code:

```
Crea el sistema de gestión de usuarios en /app/admin/usuarios/page.jsx:

LISTA DE USUARIOS:
- Tabla con: Email, Nombre, Nivel (Visitante/Mi Magia/Círculo), Runas, Tréboles, Fecha registro
- Filtros: Todos / En Trial / Círculo Activo / Mi Magia / Inactivos
- Búsqueda por email o nombre
- Ordenar por: Fecha, Nombre, Runas, Nivel

ACCIONES POR USUARIO (botones en cada fila):
- 👁️ Ver detalle
- 🎁 Regalar
- ✏️ Editar
- 🔄 Extender trial/membresía
- ❌ Desactivar (NO borrar, solo desactivar)

AGREGAR USUARIO MANUAL (botón prominente arriba):
Al hacer clic, modal con:
- Campo: Email (obligatorio)
- Campo: Nombre (opcional)
- Selector: Nivel de acceso
  - Solo Mi Magia
  - Trial Círculo 15 días
  - Círculo Semestral
  - Círculo Anual
- Campo: Runas de regalo (default 0)
- Campo: Mensaje de bienvenida personalizado (opcional)
- Checkbox: Enviar email de bienvenida

Al guardar:
1. Crear registro en Vercel KV
2. Si tiene email de bienvenida → enviar con Resend
3. Generar link de acceso único
4. Mostrar confirmación con el link para compartir

ESTRUCTURA DE DATOS EN VERCEL KV:
{
  visitorId: "uuid",
  email: "email@example.com",
  nombre: "Nombre",
  nivel: "circulo_anual", // visitante, mi_magia, circulo_trial, circulo_semestral, circulo_anual
  runas: 100,
  treboles: 0,
  created_at: "2026-01-16",
  trial_start: null,
  trial_end: null,
  circulo_start: null,
  circulo_end: null,
  guardianes: [], // IDs de duendes comprados
  estudios: [], // IDs de estudios adquiridos
  admin_created: true, // si fue creado manualmente
  activo: true
}
```

---

## PASO 4: SISTEMA DE REGALOS

### Instrucciones para Claude Code:

```
Crea el sistema de regalos en /app/admin/regalos/page.jsx:

INTERFAZ:
1. Buscador de usuario (por email)
2. Una vez seleccionado, mostrar info del usuario
3. Sección de "¿Qué quieres regalar?"

TIPOS DE REGALOS:

🔮 RUNAS DE PODER
- Input: Cantidad de runas
- Se suman a las runas actuales del usuario
- Registrar en historial: "Admin regaló X runas"

🍀 TRÉBOLES
- Input: Cantidad de tréboles
- Se suman a los tréboles actuales

⭕ ACCESO AL CÍRCULO
- Selector: Trial 15 días / Semestral / Anual
- Si ya tiene acceso → extender desde fecha actual de vencimiento
- Si no tiene → activar desde hoy

📚 ESTUDIOS DEL ALMA
- Selector múltiple de estudios disponibles:
  - Estudio del Alma Básico
  - Estudio del Alma Profundo
  - Lectura de Cristales
  - Mapa Numerológico
  - Lectura de Runas
  - (agregar más según catálogo)
- Se agregan a la lista de estudios del usuario

🎫 CUPÓN DE DESCUENTO
- Input: Porcentaje (5%, 10%, 15%, 20%, 25%, 50%)
- Input: Código del cupón (auto-generar o manual)
- Input: Válido hasta (fecha)
- Input: Usos máximos (1, 5, 10, ilimitado)
- Input: Aplica a: Todo / Solo Guardianes / Solo Círculo / Solo Estudios

🧝 GUARDIÁN VIRTUAL
- Selector de guardianes disponibles en el catálogo
- Se agrega a "Mis Guardianes" del usuario
- NO genera canalización automática (eso es solo para compras reales)
- Marcar como "Guardián de regalo"

⏰ EXTENSIÓN DE TIEMPO
- Solo para usuarios del Círculo
- Input: Días adicionales (7, 15, 30, 60, 90, 180, 365)
- Se suma a la fecha de vencimiento actual

DESPUÉS DE REGALAR:
- Checkbox: "Enviar email notificando el regalo"
- Si está marcado → enviar email bonito con Resend
- Template del email debe ser mágico y personalizado

HISTORIAL DE REGALOS:
- Tabla abajo mostrando últimos 50 regalos enviados
- Columnas: Fecha, Usuario, Tipo, Detalle, Enviado por

API ENDPOINTS NECESARIOS:
POST /api/admin/regalos/runas
POST /api/admin/regalos/treboles
POST /api/admin/regalos/circulo
POST /api/admin/regalos/estudio
POST /api/admin/regalos/cupon
POST /api/admin/regalos/guardian
POST /api/admin/regalos/extension
```

---

## PASO 5: GESTIÓN DEL CÍRCULO

### Instrucciones para Claude Code:

```
Crea la gestión del Círculo en /app/admin/circulo/page.jsx:

SECCIÓN 1: ESTADÍSTICAS
- Total miembros activos
- En trial: X (vencen próximos 3 días: Y)
- Semestrales activos: X
- Anuales activos: X
- Tasa de conversión trial → pago: X%
- Churn mensual: X%

SECCIÓN 2: MIEMBROS DEL CÍRCULO
- Lista filtrable de todos los miembros
- Columnas: Email, Plan, Inicio, Vence en, Estado
- Estados: Activo ✅ / Por vencer ⚠️ / Vencido ❌ / Trial 🎁
- Acciones: Extender, Cambiar plan, Contactar

SECCIÓN 3: TRIALS ACTIVOS
- Lista de usuarios en período de prueba
- Columnas: Email, Inicio trial, Días restantes, Actividad
- Botón: "Enviar recordatorio" (email personalizado)
- Botón masivo: "Enviar recordatorio a todos los que vencen en 3 días"

SECCIÓN 4: CONTENIDO DEL CÍRCULO (acceso rápido)
- Duende de la Semana actual: [Nombre] - Cambiar
- Contenido de hoy: [Publicado/Pendiente]
- Ir al generador de contenido
- Ir al calendario

SECCIÓN 5: CONFIGURACIÓN DEL CÍRCULO
- Precio Semestral: $______ UYU (editable)
- Precio Anual: $______ UYU (editable)
- Días de trial: ______ (default 15)
- Runas de bienvenida: ______ (default 100)
- Descuento por conversión desde trial: ______% (default 10)
- Guardar cambios → actualiza en toda la app
```

---

## PASO 6: API ENDPOINTS DEL ADMIN

### Instrucciones para Claude Code:

```
Crea todos los API endpoints necesarios para el Admin:

/api/admin/auth/
├── login.js          POST - Login admin
├── logout.js         POST - Logout admin
└── verify.js         GET  - Verificar sesión

/api/admin/usuarios/
├── list.js           GET  - Lista usuarios (con filtros)
├── create.js         POST - Crear usuario manual
├── [id]/get.js       GET  - Detalle usuario
├── [id]/update.js    PUT  - Actualizar usuario
└── [id]/deactivate.js POST - Desactivar usuario

/api/admin/regalos/
├── runas.js          POST - Regalar runas
├── treboles.js       POST - Regalar tréboles
├── circulo.js        POST - Regalar acceso círculo
├── estudio.js        POST - Regalar estudio
├── cupon.js          POST - Crear cupón
├── guardian.js       POST - Regalar guardián
└── extension.js      POST - Extender membresía

/api/admin/circulo/
├── stats.js          GET  - Estadísticas
├── members.js        GET  - Lista miembros
├── trials.js         GET  - Lista trials
├── config.js         GET/PUT - Configuración
└── reminder.js       POST - Enviar recordatorio

/api/admin/dashboard/
└── stats.js          GET  - Métricas dashboard

SEGURIDAD:
- Todos los endpoints verifican admin_token
- Rate limiting: máximo 100 requests/minuto
- Logs de todas las acciones admin
- Validación de inputs con Zod o similar
```

---

## PASO 7: EMAILS CON RESEND

### Instrucciones para Claude Code:

```
Crea las plantillas de email para el Admin:

PLANTILLA 1: Bienvenida Usuario Creado Manualmente
Archivo: /lib/emails/welcome-admin-created.jsx

Asunto: "✨ Tu acceso a Mi Magia está listo"
Contenido:
- Saludo personalizado con nombre
- Explicación de que tienen acceso especial
- Link de acceso único
- Qué pueden hacer en Mi Magia
- Si tienen trial del Círculo → mencionarlo
- Firma de Duendes del Uruguay

PLANTILLA 2: Regalo Recibido
Archivo: /lib/emails/gift-received.jsx

Asunto: "🎁 ¡Tienes un regalo mágico esperándote!"
Contenido:
- Qué recibieron (runas, acceso, estudio, etc.)
- Cómo usarlo
- Link a Mi Magia
- Mensaje personalizado del admin (si lo escribió)

PLANTILLA 3: Trial por Vencer
Archivo: /lib/emails/trial-ending.jsx

Asunto: "⏰ Tu prueba del Círculo termina en [X] días"
Contenido:
- Recordatorio amable
- Lo que perderán si no se suscriben
- Oferta especial: 10% descuento por suscribirse ahora
- Botón prominente: "Continuar mi viaje"
- Testimonios de miembros (2-3 cortos)

PLANTILLA 4: Membresía por Vencer
Archivo: /lib/emails/membership-ending.jsx

Asunto: "🔄 Tu membresía del Círculo vence pronto"
Contenido:
- Fecha de vencimiento
- Opción de renovar
- Beneficios de quedarse
- Botón: "Renovar ahora"

ESTÉTICA DE EMAILS:
- Fondo: Crema suave
- Header: Logo de Duendes
- Fuente: Georgia o similar serif
- Colores: Dorado para botones, negro para texto
- Imágenes: Usar URLs de imágenes de la web
- Footer: Links a redes, info de contacto

CONFIGURAR RESEND:
- Dominio: duendesdeluruguay.com (o el que tengan)
- From: magia@duendesdeluruguay.com
- Reply-to: hola@duendesdeluruguay.com
```

---

## PASO 8: VERIFICACIÓN FINAL SESIÓN 2

### Instrucciones para Claude Code:

```
Verificación final de la Sesión 2:

1. Ejecuta: npm run build
   - Debe compilar sin errores

2. Prueba el flujo completo:
   - [ ] Acceder a /admin (debe pedir login)
   - [ ] Login con credenciales admin
   - [ ] Dashboard carga con métricas
   - [ ] Crear un usuario de prueba manualmente
   - [ ] Regalarle 50 runas
   - [ ] Regalarle trial del Círculo
   - [ ] Ver que aparece en lista de usuarios
   - [ ] Ver que aparece en trials activos
   - [ ] Enviar email de prueba (verificar que llega)

3. Verificar APIs (con curl o Postman):
   - [ ] POST /api/admin/auth/login funciona
   - [ ] GET /api/admin/usuarios/list devuelve usuarios
   - [ ] POST /api/admin/regalos/runas funciona

4. Dame REPORTE FINAL:
   - Endpoints creados
   - Componentes creados
   - Emails configurados
   - Problemas encontrados
   - Screenshots del admin funcionando

¿Todo listo para la Sesión 3?
```

---

## RESUMEN SESIÓN 2

| Paso | Tarea | Tiempo estimado |
|------|-------|-----------------|
| 1 | Estructura Admin | 15 min |
| 2 | Dashboard | 20 min |
| 3 | Gestión Usuarios | 25 min |
| 4 | Sistema Regalos | 25 min |
| 5 | Gestión Círculo | 20 min |
| 6 | API Endpoints | 20 min |
| 7 | Emails Resend | 15 min |
| 8 | Verificación | 15 min |

**Total: ~2 horas 30 min**

---

## DESPUÉS DE COMPLETAR SESIÓN 2:
Continúa con SESION-3-CONTENIDO-IA.md
