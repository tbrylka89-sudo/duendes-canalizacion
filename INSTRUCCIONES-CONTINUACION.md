# INSTRUCCIONES PARA CONTINUAR EL TRABAJO - CLAUDE CODE

**Fecha:** 22 Enero 2026, 15:25
**Para:** Cualquier sesión nueva de Claude Code que retome este proyecto

---

# CONTEXTO COMPLETO (LEÉ TODO ESTO PRIMERO)

## ¿Qué es este proyecto?

**Duendes del Uruguay** es un e-commerce de "guardianes canalizados" - figuras artesanales únicas con experiencias digitales personalizadas.

- **Público:** Mujeres 35-65 años, buscadoras de protección/amor/cambio
- **Tono:** Español rioplatense (vos, tenés), místico pero con los pies en la tierra
- **Concepto central:** "El guardián te elige a vos" (no al revés)

## Stack Técnico

```
WORDPRESS (10Web)                    VERCEL (Next.js)
├── Tienda WooCommerce              ├── Mi Magia (portal cliente)
├── Productos/Guardianes            ├── APIs de gamificación
├── Checkout                        ├── Test del Guardián API
├── Plugins MU personalizados       ├── Webhooks WooCommerce
└── Test del Guardián (frontend)    └── Sistema de conversión
```

## Filosofía de Conversión

```
FIJO (público, todos ven igual)     ADAPTATIVO (privado, personalizado)
─────────────────────────────────   ────────────────────────────────────
Historia del guardián               Emails según perfil psicológico
Precio                              Cierres adaptativos en canalizaciones
Descripción producto                "Señales mágicas" basadas en datos
Sincrodestino de creación           Recomendaciones personalizadas
```

**Regla de oro:** Si dos personas comparan la web, ven lo mismo. La magia está en lo que cada una recibe EN PRIVADO (emails, canalizaciones).

## Sistema de Perfilado Psicológico

El Test del Guardián (12 preguntas) detecta:
- **Vulnerabilidad:** alta/media/baja (qué tan en crisis está)
- **Dolor principal:** soledad/dinero/salud/relaciones/propósito
- **Estilo de decisión:** impulsivo/analítico/emocional
- **Creencias:** escéptico/creyente/buscador

Esto mapea a 5 tipos de cierre:
1. **Vulnerable:** "Sé que estás cansada..."
2. **Escéptico:** "No te pido que creas..."
3. **Impulsivo:** "El cuerpo sabe antes que la mente..."
4. **Coleccionista:** "Los guardianes se potencian..."
5. **Racional:** "No es magia, es neurociencia..."

---

# ESTADO ACTUAL DEL PROYECTO

## ✅ YA ESTÁ HECHO
- Test del Guardián con 12 preguntas y perfilado (archivo creado, falta subir)
- APIs de gamificación (runas, niveles, cofre diario, lecturas)
- Sistema de cierres adaptativos (5 perfiles con variaciones)
- Generador de historias con arco emocional
- Documento maestro unificado (PLAN-MAESTRO-CONVERSION.md)
- DNS configurado apuntando a 10Web

## 🔴 PENDIENTE - HACER EN PARALELO
1. Subir test-guardian-v11.php a WordPress
2. Crear motor de sincronicidad (/lib/sincronicidad.js)
3. Activar dominio Make Primary en 10Web (manual)
4. Configurar emails carrito abandonado
5. Verificar DHL Express funciona
6. Configurar SEO con Rank Math (manual)
7. Crear productos de runas en WooCommerce (manual)

---

# CÓMO LANZAR AGENTES EN PARALELO

## Paso 1: Leer el documento maestro
```
Lee el archivo /Users/usuario/Desktop/duendes-vercel/PLAN-MAESTRO-CONVERSION.md completo para entender el proyecto.
```

## Paso 2: Lanzar agentes simultáneos

Usá la herramienta **Task** con múltiples invocaciones en un solo mensaje para que corran en paralelo.

### AGENTES A LANZAR:

```
AGENTE 1: Subir Test a WordPress
──────────────────────────────────
Tipo: Bash
Tarea: Subir el archivo test-guardian-v11.php a WordPress via SFTP y verificar que funciona.

Prompt para el agente:
"Subí el archivo /Users/usuario/Desktop/duendes-vercel/wordpress-plugins/test-guardian-v11.php
a WordPress via SFTP.

Credenciales SFTP:
- Host: 34.70.139.72
- Puerto: 55309
- Usuario: sftp_live_WfP6i
- Password: JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR
- Ruta destino: web/wp-live/wp-content/mu-plugins/

Después de subir:
1. Limpiar caché: curl -X POST 'https://duendesuy.10web.cloud/wp-json/duendes/v1/cache' -H 'X-Duendes-Secret: duendes_vercel_2026_secretkey_XkJ9mN2pL5qR8sT1'
2. Verificar que funciona: curl -s 'https://duendesuy.10web.cloud/descubri-que-duende-te-elige/' | grep -o 'tg-portal'"
```

```
AGENTE 2: Crear Motor de Sincronicidad
──────────────────────────────────────
Tipo: general-purpose
Tarea: Crear el sistema que genera "señales mágicas" personalizadas basadas en datos del usuario.

Prompt para el agente:
"Creá el motor de sincronicidad para Duendes del Uruguay.

CONTEXTO: Sistema que genera 'coincidencias mágicas' basadas en datos del usuario para que sienta que el universo le habla.

CREAR DOS ARCHIVOS:

1. /Users/usuario/Desktop/duendes-vercel/lib/sincronicidad.js
   - Función generarSincronicidad(datos) que recibe: nombre, fechaNacimiento, guardian, diaSemana, hora, volvioAPagina
   - Genera frases tipo:
     * Por día: 'Los martes son días de Marte, de acción. No es casualidad que estés acá hoy.'
     * Por nombre: 'Tu nombre y el de [guardian] tienen X letras. Los números no mienten.'
     * Por cumpleaños: 'Este mes es tu portal. Los guardianes que aparecen cerca de tu cumpleaños vienen con mensajes especiales.'
     * Por comportamiento: 'Volviste. Algo te trajo de nuevo. Eso tiene un nombre: reconocimiento.'
   - Exportar función

2. /Users/usuario/Desktop/duendes-vercel/app/api/sincronicidad/route.js
   - GET que recibe query params: nombre, fecha_nacimiento, guardian
   - Devuelve JSON con la sincronicidad generada
   - Usar la función de lib/sincronicidad.js

TONO: Místico pero creíble. No exagerar. Una sola sincronicidad por llamada, la más relevante."
```

```
AGENTE 3: Crear Sistema de Emails Carrito Abandonado
────────────────────────────────────────────────────
Tipo: general-purpose
Tarea: Crear el endpoint que maneja emails de carrito abandonado con cierres adaptativos.

Prompt para el agente:
"Creá el sistema de emails de carrito abandonado para Duendes del Uruguay.

CONTEXTO: Cuando alguien abandona el carrito, enviamos emails personalizados según su perfil psicológico.

CREAR:
/Users/usuario/Desktop/duendes-vercel/app/api/emails/carrito-abandonado/route.js

FUNCIONALIDAD:
- POST recibe: email, nombre, guardian_nombre, perfil (opcional)
- Si tiene perfil en KV, usar ese cierre
- Si no tiene perfil, usar cierre 'vulnerable' (default)

SECUENCIA DE EMAILS:
- 1 hora: 'Tu guardián sigue esperándote' (informativo)
- 24 horas: '[Nombre], [guardian] tiene algo que decirte' + cierre según perfil
- 72 horas: 'Alguien más está mirando a [guardian]' (escasez social)

Los cierres están en /Users/usuario/Desktop/duendes-vercel/lib/conversion/cierres.js
Usar la función getCierre(nombreGuardian, perfil)

Integrar con Resend para enviar emails (ya está configurado en el proyecto)."
```

```
AGENTE 4: Verificar Todo el Sistema
───────────────────────────────────
Tipo: Bash
Tarea: Ejecutar tests de verificación de todos los endpoints y servicios.

Prompt para el agente:
"Verificá que todo el sistema de Duendes del Uruguay funciona correctamente.

EJECUTAR ESTOS TESTS:

1. WordPress:
curl -s -o /dev/null -w 'WordPress Homepage: %{http_code}\n' 'https://duendesuy.10web.cloud/'
curl -s -o /dev/null -w 'WordPress Tienda: %{http_code}\n' 'https://duendesuy.10web.cloud/shop/'
curl -s -o /dev/null -w 'WordPress Test: %{http_code}\n' 'https://duendesuy.10web.cloud/descubri-que-duende-te-elige/'

2. Vercel APIs:
curl -s -o /dev/null -w 'Mi Magia: %{http_code}\n' 'https://duendes-vercel.vercel.app/mi-magia'
curl -s 'https://duendes-vercel.vercel.app/api/gamificacion/lecturas?email=test@test.com' | head -100

3. DNS:
dig +short duendesdeluruguay.com A

Reportar qué funciona y qué falla."
```

## Paso 3: Ejemplo de cómo invocar los agentes

En tu mensaje, escribí algo como:

```
Voy a lanzar 4 agentes en paralelo para avanzar con el proyecto Duendes del Uruguay.

[Luego usás la herramienta Task 4 veces en el mismo mensaje, una para cada agente]
```

---

# CREDENCIALES COMPLETAS

## WordPress/SFTP
```
Host: 34.70.139.72
Puerto: 55309
Usuario: sftp_live_WfP6i
Password: JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR
Ruta MU-Plugins: web/wp-live/wp-content/mu-plugins/
URL Admin: https://duendesuy.10web.cloud/wp-admin
```

## Base de Datos WordPress
```
Host: mysql.10web.site
Usuario: live_user_7O9A8
Password: tNsQGgf2PFHRNv9hAZ7TPjmHXHkTnPXKQI
DB: live_7O9A8
```

## Vercel
```
Proyecto: duendes-vercel
URL: https://duendes-vercel.vercel.app/
Deploy: vercel --prod (desde /Users/usuario/Desktop/duendes-vercel)
```

## API Keys
```
DUENDES_REMOTE_SECRET: duendes_vercel_2026_secretkey_XkJ9mN2pL5qR8sT1
INSIGHTS_API_KEY: duendes-insights-2024
```

## 10Web Panel
```
URL: https://my.10web.io/websites/1453202/domains
(para activar Make Primary y SSL)
```

---

# ARCHIVOS CLAVE DEL PROYECTO

| Archivo | Qué contiene |
|---------|--------------|
| `PLAN-MAESTRO-CONVERSION.md` | TODO el proyecto documentado (19 partes) |
| `CLAUDE.md` | Guía de voz, tono, frases prohibidas |
| `wordpress-plugins/test-guardian-v11.php` | Test con 12 preguntas + perfilado |
| `lib/conversion/cierres.js` | 5 cierres adaptativos con variaciones |
| `lib/conversion/hooks.js` | Frases de apertura por categoría |
| `lib/conversion/sincrodestinos.js` | Eventos mágicos durante creación |
| `lib/gamificacion/config.js` | Runas, niveles, lecturas, rachas |
| `app/api/test-guardian/route.js` | API del test (GET preguntas, POST respuestas) |
| `app/api/gamificacion/` | Todas las APIs de gamificación |

---

# TAREAS MANUALES (BROWSER)

Estas NO se pueden automatizar, hay que hacerlas en el navegador:

## 1. Activar Dominio Principal
1. Ir a https://my.10web.io/websites/1453202/domains
2. En duendesdeluruguay.com → 3 puntitos → Make Primary
3. Después: Tools → SSL → Generate Free SSL

## 2. Configurar Rank Math SEO
1. En WordPress Admin → Rank Math → Títulos y Meta
2. Productos: `%title% | Guardián Canalizado | Duendes del Uruguay`
3. Habilitar Schema para productos

## 3. Crear Productos de Runas
1. En WordPress Admin → Productos → Añadir nuevo
2. Crear 5 productos virtuales:
   - Chispa (30 runas) - $5 - SKU: RUNAS-30
   - Destello (80 runas) - $10 - SKU: RUNAS-80
   - Resplandor (200 runas) - $20 - SKU: RUNAS-200
   - Fulgor (550 runas) - $50 - SKU: RUNAS-550
   - Aurora (1200 runas) - $100 - SKU: RUNAS-1200

---

# CHECKLIST DE VERIFICACIÓN FINAL

Cuando todo esté hecho, verificar:

```bash
# WordPress funciona
curl -s -o /dev/null -w "%{http_code}" "https://duendesuy.10web.cloud/" # debe ser 200

# Test del Guardián carga
curl -s "https://duendesuy.10web.cloud/descubri-que-duende-te-elige/" | grep -o "tg-portal" # debe aparecer

# APIs Vercel funcionan
curl -s "https://duendes-vercel.vercel.app/api/gamificacion/lecturas?email=test@test.com" | grep "success" # debe aparecer

# Sincronicidad funciona (después de crearla)
curl -s "https://duendes-vercel.vercel.app/api/sincronicidad?nombre=Maria&guardian=Thornwood"

# DNS correcto
dig +short duendesdeluruguay.com A # debe mostrar 34.70.139.72
```

---

# RESUMEN PARA EMPEZAR RÁPIDO

1. **Leé** `PLAN-MAESTRO-CONVERSION.md` para contexto completo
2. **Lanzá** los 4 agentes en paralelo (copiar prompts de arriba)
3. **Hacé** las tareas manuales en browser mientras los agentes trabajan
4. **Verificá** con el checklist que todo funciona
5. **Actualizá** este archivo marcando qué se completó

---

*Última actualización: 22 Enero 2026, 15:25*
*Si esta sesión se llenó, otra puede retomar leyendo este archivo primero.*
