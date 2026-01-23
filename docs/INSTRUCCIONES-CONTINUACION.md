# INSTRUCCIONES PARA CONTINUAR EL TRABAJO - CLAUDE CODE

**Última actualización:** 23 Enero 2026, 16:45
**Estado:** ACTUALIZADO - Sesión 7 completada

---

# FILOSOFÍA DE CONVERSIÓN (LEER PRIMERO)

**Todo el sistema está diseñado para CONVERTIR, no solo para ser bonito.**

## Sistema de Perfilado Psicológico (YA IMPLEMENTADO)

El Test del Guardián detecta 4 dimensiones:
1. **Vulnerabilidad** (alta/media/baja) - basado en crisis, sufrimiento, cronicidad
2. **Dolor principal** (soledad/dinero/salud/relaciones/proposito)
3. **Estilo de decisión** (impulsivo/analitico/emocional)
4. **Creencias** (creyente/buscador/esceptico)

## 5 Cierres Adaptativos (YA IMPLEMENTADOS)

Cada historia/email termina diferente según perfil:
- **vulnerable**: "Sé que estás cansada... permiso para recibir"
- **esceptico**: "No te pido que creas... observá qué sentiste"
- **impulsivo**: "Los guardianes únicos desaparecen cuando encuentran hogar"
- **coleccionista**: "Los guardianes se potencian entre sí"
- **racional**: "La psicología lo llama anclaje. Funciona."

## Archivos Clave del Sistema de Conversión

| Archivo | Función |
|---------|---------|
| `/lib/conversion/cierres.js` | 5 cierres con variaciones |
| `/lib/conversion/hooks.js` | Frases de apertura por categoría |
| `/lib/conversion/sincrodestinos.js` | Eventos mágicos creíbles |
| `/lib/conversion/arco.js` | 8 fases del arco emocional |
| `/lib/conversion/scoring.js` | Scoring de conversión 0-50 pts |
| `/app/api/test-guardian/route.js:229` | `calcularPerfilPsicologico()` |
| `/app/api/test-guardian/route.js:327` | `perfilACierre()` |

---

# ⚠️ ESTADO EN TIEMPO REAL

## TERMINAL PRINCIPAL (activa)
Trabajando en: Coordinación general y documentación

## TAREAS COMPLETADAS ✅

| Tarea | Estado | Detalle |
|-------|--------|---------|
| Test Guardian v11 WordPress | ✅ | 12 preguntas + perfilado |
| Test Guardian Mi Magia | ✅ | UI completa + slider 1-10 |
| Motor de sincronicidad | ✅ | `/api/sincronicidad` |
| Emails carrito abandonado | ✅ | `/api/emails/carrito-abandonado` |
| **Emails post-compra** | ✅ | `/api/emails/post-compra` - 7 emails con cierres |
| Sistema cierres adaptativos | ✅ | 5 perfiles + variaciones |
| Algoritmo perfilado psicológico | ✅ | En route.js |
| **Certificado página web** | ✅ | `/certificado/[id]` - ver e imprimir |
| Deploy Vercel | ✅ | Funcionando |
| WordPress live | ✅ | HTTP 200 |
| **Creador Inteligente Productos** | ✅ | Fotos → Vision → Historia → WooCommerce (23/01) |
| **Auto-aprendizaje temas** | ✅ | Detecta y aprende categorías (23/01) |
| **Especializaciones nuevas** | ✅ | Viajeros + Bosque/Naturaleza (23/01) |
| **Hub WordPress v2.0** | ✅ | Plugin con todas las rutas (23/01) |
| **Parser texto libre** | ✅ | `/lib/parsers/texto-producto.js` (23/01) |

## TAREAS A y B - ESTADO REAL
- **TAREA A**: ✅ COMPLETADA - `/api/emails/post-compra/route.js` funcional
- **TAREA B**: ⚠️ PARCIAL - Existe página `/certificado/[id]` para ver/imprimir
  - Falta: API `/api/certificado` que genere PDF programático (para emails)

## NUEVAS TAREAS IDENTIFICADAS (23/01)
- **Test del Guardián WP**: ❌ Error 404 - La página fue borrada, hay que rehacerla
- **Rutas Mi Magia 404**: ⚠️ URLs como /mi-magia/elegidos dan 404 (arquitectura SPA)
- **Reportes Gamificación**: ⚠️ 6 botones sin implementar (solo alerts)
- **El Grimorio (Blog)**: ❌ Deliberadamente oculto con CSS display:none

---

# TAREAS PENDIENTES PARA NUEVOS TERMINALES

## PRIORIDAD ALTA - Puede hacer otra terminal

### TAREA A: Crear secuencia completa de emails post-compra
```
Tipo: general-purpose
Prompt: "Creá el sistema de emails post-compra para Duendes del Uruguay.

IMPORTANTE: Leé primero:
- /Users/usuario/Desktop/duendes-vercel/CLAUDE.md (guía de escritura)
- /Users/usuario/Desktop/duendes-vercel/lib/conversion/cierres.js (sistema de cierres)

El sistema usa perfilado psicológico. Cada usuario tiene un perfilCierre guardado
en KV (vulnerable/esceptico/impulsivo/coleccionista/racional).

CREAR: /Users/usuario/Desktop/duendes-vercel/app/api/emails/post-compra/route.js

SECUENCIA CON CIERRES ADAPTATIVOS:
- INMEDIATO: 'Tu guardián te eligió' → cierre según perfil
- 24 HORAS: Certificado de canalización → cierre reforzando confianza
- ENVÍO: 'Tu guardián comenzó su viaje' + tracking
- DÍA 3: '¿Ya notaste algo diferente?' + diario de señales
- DÍA 7: 'Una semana juntos' + pedir testimonio
- DÍA 14: 'Tu guardián quiere presentarte a alguien' → cross-sell con cierre
- DÍA 30: Invitación al Círculo

import { getCierre } from '@/lib/conversion/cierres';
// Ejemplo: getCierre('Violeta', 'vulnerable', 'f')

Resend ya configurado. NO usar frases genéricas de IA (ver CLAUDE.md)."
```

### TAREA B: Crear API generadora de PDF (PARCIAL - falta solo esto)
```
YA EXISTE: /app/certificado/[id]/page.jsx (página HTML para ver/imprimir)

FALTA CREAR: /Users/usuario/Desktop/duendes-vercel/app/api/certificado/route.js

Este endpoint debe generar PDF programáticamente para enviar por email.
La página ya tiene todo el diseño - solo hay que convertirlo a PDF.

Usar @react-pdf/renderer o similar.
GET /api/certificado?order=123 → devuelve PDF como stream/blob

El email de certificado (día 2 de post-compra) necesita este endpoint
para adjuntar el PDF automáticamente.
```

### TAREA C: Verificar y configurar DHL Express
```
Tipo: Bash
Prompt: "Verificá el estado de DHL Express en WooCommerce.

1. Revisar si el plugin está activo:
curl -s 'https://duendesuy.10web.cloud/wp-json/wc/v3/shipping/zones' (necesita auth)

2. Verificar en checkout si aparece DHL como opción

3. Documentar qué configuración falta"
```

---

# TAREAS MANUALES COMPLETADAS ✅

- ✅ Activar Dominio Make Primary en 10Web - **YA HECHO**
- ✅ Crear Productos de Runas en WooCommerce - **YA HECHO**

# TAREAS MANUALES PENDIENTES (BROWSER)

## Configurar Rank Math SEO
WordPress Admin → Rank Math → Títulos y Meta
- Productos: `%title% | Guardián Canalizado | Duendes del Uruguay`

---

# SISTEMA FUNCIONANDO ACTUALMENTE

```
✅ WordPress Homepage: HTTP 200
✅ WordPress Tienda: HTTP 200
✅ Test Guardian WordPress: HTTP 200 (v11 activo)
✅ Mi Magia (Vercel): HTTP 200
✅ API Sincronicidad: Funcionando
✅ API Carrito Abandonado: Creada
✅ API Gamificación: Funcionando
✅ DNS: 34.70.139.72
```

---

# ARCHIVOS CREADOS HOY

```
✅ /lib/sincronicidad.js - Motor de señales mágicas
✅ /app/api/sincronicidad/route.js - Endpoint GET
✅ /app/api/emails/carrito-abandonado/route.js - Emails adaptativos
✅ test-guardian-v11.php subido a WordPress mu-plugins
```

---

# CONTEXTO RÁPIDO DEL PROYECTO

**Duendes del Uruguay** = E-commerce de guardianes canalizados
- **WordPress** = Tienda, productos, checkout
- **Vercel** = Mi Magia (portal cliente), APIs

**Dos tests del guardián:**
- WordPress (visitantes nuevos) → test-guardian-v11.php ✅ FUNCIONANDO
- Mi Magia (clientes) → /app/mi-magia/test-guardian.js ✅ YA ESTABA

**Sistema de perfilado:**
- 12 preguntas → detecta perfil psicológico
- 5 cierres adaptativos: vulnerable, esceptico, impulsivo, coleccionista, racional

---

# CREDENCIALES

## WordPress/SFTP
```
Host: 34.70.139.72 | Puerto: 55309
Usuario: sftp_live_WfP6i
Password: JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR
Ruta: web/wp-live/wp-content/mu-plugins/
```

## API Keys
```
DUENDES_REMOTE_SECRET: duendes_vercel_2026_secretkey_XkJ9mN2pL5qR8sT1
```

## 10Web Panel
```
https://my.10web.io/websites/1453202/domains
```

---

# PARA OTRA TERMINAL

**Contexto que debe entender:**
1. Este proyecto usa CONVERSIÓN INTELIGENTE (no solo diseño bonito)
2. Cada usuario tiene un `perfilCierre` (vulnerable/esceptico/impulsivo/coleccionista/racional)
3. Todos los textos deben adaptarse al perfil usando `/lib/conversion/cierres.js`
4. NUNCA usar frases genéricas de IA (ver lista prohibida en CLAUDE.md)

**Decile:**
"Leé CLAUDE.md y luego elegí TAREA A (emails post-compra) o TAREA B (certificados PDF).
El sistema de conversión ya está implementado - solo tenés que usarlo con getCierre()."

**Si pregunta qué está funcionando:**
- Test del Guardián: WordPress y Mi Magia ✅
- Perfilado psicológico: 12 preguntas → 5 perfiles ✅
- APIs: sincronicidad, carrito-abandonado, gamificación ✅
- Cierres adaptativos: /lib/conversion/cierres.js ✅

---

*Última actualización: 23 Enero 2026, 16:45*
*Sesión 7 completada - Documentación actualizada*
