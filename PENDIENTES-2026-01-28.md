# PENDIENTES - Duendes del Uruguay
## Miércoles 28 de enero 2026

---

## ✅ RESUELTO HOY (28/01/2026)

| Problema | Solución | Estado |
|----------|----------|--------|
| Carrito no cargaba (loop infinito) | Nuevo plugin `duendes-precios-v3.php` sin MutationObserver | ✅ |
| Precios mal en carrito Uruguay | Filtros PHP para carrito agregados | ✅ |
| Botones sin texto | Plugin `duendes-cart-checkout-v2.php` con CSS fixes | ✅ |
| Envío gratis mal calculado | `duendes-avisos-carrito.php` corregido | ✅ |
| Tasas de cambio incorrectas | Actualizadas con nombres legibles | ✅ |

**Git protegido:** Tag `estable-carrito-2026-01-28` creado.

---

## 🔴 TAREAS PENDIENTES (Nueva lista)

### Orden sugerido de trabajo:

| # | Tarea | Descripción | Complejidad |
|---|-------|-------------|-------------|
| 1 | **Nosotros en menú** | La página "Nosotros" no aparece en el menú, pero el contenido ya existe | Fácil |
| 2 | **Redirect mi magia** | Que mi-magia de Vercel redirija a mimagia.duendesdeluruguay.com | Fácil |
| 3 | **HTMLs para mejorar** | Hay HTMLs de la web para mejorar/cambiar | Media |
| 4 | **Emails automáticos** | Verificar que todos los emails funcionen (Resend + Google Workspace) | Media |
| 5 | **Tito (el chat)** | Revisar a fondo que tenga info correcta, funcione en web, Mi Magia y ManyChat | Compleja |
| 6 | **Generador de historias** | Verificar que siga funcionando | Media |
| 7 | **Generador de canalizaciones** | Verificar conexión con formulario de compra | Media |
| 8 | **Mi Magia + WooCommerce** | Verificar que se carguen los guardianes comprados automáticamente | Compleja |
| 9 | **Mi Círculo (suscripción)** | Investigar y perfeccionar para que sea administrable | Compleja |

---

### Detalle de cada tarea:

#### 1. Nosotros en menú
- **Archivo:** `wordpress-plugins/duendes-pagina-nosotros.php`
- **Problema:** Página existe pero no está en navegación
- **Acción:** Agregar al menú de WordPress o header universal

#### 2. Redirect mi magia
- **Verificar:** Configuración en Vercel (`vercel.json`)
- **Destino esperado:** mimagia.duendesdeluruguay.com
- **Acción:** Configurar redirect o rewrite

#### 3. HTMLs para mejorar
- **Esperando:** Usuario debe compartir los HTMLs
- **Acción:** Integrar en WordPress o Vercel según corresponda

#### 4. Emails automáticos
- **Providers:** Resend (backup), Google Workspace (principal)
- **Tipos de email:** Post-compra, carrito abandonado, formulario contacto, canalizaciones
- **Archivos clave:**
  - `lib/emails.js`
  - `lib/email-templates.js`
  - `wordpress-plugins/duendes-emails-*.php`

#### 5. Tito (el chat)
- **Ubicaciones donde debe funcionar:**
  - Web principal (widget)
  - Sección Mi Magia
  - ManyChat (WhatsApp, Instagram, Messenger)
- **Tecnologías mezcladas:** OpenAI, Anthropic (Claude), sin IA
- **Archivos clave:**
  - `lib/tito/personalidad.js` (34KB)
  - `lib/tito/conocimiento.js` (41KB)
  - `app/api/tito/v3/route.js`
  - `wordpress-plugins/duendes-tito-widget.php`

#### 6. Generador de historias
- **Panel:** `/admin/generador-historias`
- **Sistema:** `/lib/conversion/`
- **Verificar:** Que genere historias correctas y publique a WooCommerce

#### 7. Generador de canalizaciones
- **Panel:** `/admin/canalizaciones`
- **Flujo:** Compra → Formulario → Canalización pendiente → Aprobación → Envío
- **Verificar:** Que lleguen los formularios de cada venta

#### 8. Mi Magia + WooCommerce
- **Portal:** `/app/mi-magia/`
- **Verificar:** Que al comprar se carguen los guardianes en la cuenta del cliente
- **APIs:** `/api/mi-magia/usuario`, webhooks WooCommerce

#### 9. Mi Círculo (suscripción mensual)
- **Portal:** `/app/circulo/`
- **Admin:** `/app/admin/circulo/`
- **Contenido:** Cursos, duende del día/semana, rituales, numerología, foro
- **Verificar:** Sistema de suscripción, generación de contenido, administración

---

## SI EL SITIO SE ROMPE - ROLLBACK RÁPIDO

### Restaurar carrito/precios:
```bash
git checkout estable-carrito-2026-01-28 -- wordpress-plugins/duendes-precios-v3.php
git checkout estable-carrito-2026-01-28 -- wordpress-plugins/duendes-cart-checkout-v2.php
git checkout estable-carrito-2026-01-28 -- wordpress-plugins/duendes-avisos-carrito.php
```

### Subir al servidor:
```bash
expect << 'EOF'
spawn sftp -P 55309 sftp_live_WfP6i@34.70.139.72
expect "password:"
send "JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR\r"
expect "sftp>"
send "put wordpress-plugins/duendes-precios-v3.php web/wp-live/wp-content/mu-plugins/\r"
expect "sftp>"
send "bye\r"
expect eof
EOF
```

---

## CONEXIÓN AL SERVIDOR

### Credenciales SFTP (10Web)
```
Host: 34.70.139.72
Puerto: 55309
Usuario: sftp_live_WfP6i
Password: JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR
```

### Comando para conectar
```bash
sftp -P 55309 sftp_live_WfP6i@34.70.139.72
```

### Ruta de los plugins (mu-plugins)
```
cd web/wp-live/wp-content/mu-plugins
```

### Para subir un archivo
```bash
expect -c '
spawn sftp -P 55309 sftp_live_WfP6i@34.70.139.72
expect "password:"
send "JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR\r"
expect "sftp>"
send "cd web/wp-live/wp-content/mu-plugins\r"
expect "sftp>"
send "put /tmp/ARCHIVO_LOCAL.php ARCHIVO_REMOTO.php\r"
expect "sftp>"
send "bye\r"
expect eof
'
```

---

## ESTADO ACTUAL DEL SITIO (28/01/2026 - Actualizado)

### ✅ SITIO FUNCIONANDO CORRECTAMENTE
- Carrito carga bien desde cualquier país
- Precios correctos para Uruguay (UYU) e internacional (USD + aprox)
- Botones visibles con texto
- Promociones 3x2 y envío gratis funcionando

### Plugins activos en servidor (mu-plugins):
| Plugin | Función | Estado |
|--------|---------|--------|
| `duendes-precios-v3.php` | Sistema de precios limpio | ✅ Activo |
| `duendes-cart-checkout-v2.php` | Estilos carrito/checkout | ✅ Activo |
| `duendes-avisos-carrito.php` | Avisos 3x2 y envío gratis | ✅ Activo |

### Plugins desactivados (renombrados con .OLD):
- `duendes-precios-unificado.php.OLD3`
- `duendes-cart-checkout.php.OLD`
- `duendes-pais-precios.php.BROKEN`

---

## ARCHIVOS CLAVE

### Header universal
`web/wp-live/wp-content/mu-plugins/duendes-header-universal.php`
- Header del sitio
- Bandera/selector de pais
- Menu de navegacion

### Fixes generales
`web/wp-live/wp-content/mu-plugins/duendes-fixes-master.php`
- CSS fixes varios
- Z-index corrections

### Categorias en shop
`web/wp-live/wp-content/mu-plugins/duendes-categorias-shop.php`
- Barra de categorias (Todos, Proteccion, Amor, etc.)

---

## TABLA DE PRECIOS UYU (referencia)

| Rango USD | Precio UYU |
|-----------|------------|
| $0-100    | $2.500     |
| $100-175  | $5.500     |
| $175-350  | $8.000     |
| $350-800  | $16.500    |
| $800+     | $39.800    |

---

## PAISES CONFIGURADOS

| Codigo | Pais      | Moneda | Simbolo |
|--------|-----------|--------|---------|
| UY     | Uruguay   | UYU    | $       |
| AR     | Argentina | ARS    | $       |
| MX     | Mexico    | MXN    | $       |
| CO     | Colombia  | COP    | $       |
| CL     | Chile     | CLP    | $       |
| PE     | Peru      | PEN    | S/      |
| BR     | Brasil    | BRL    | R$      |
| ES     | Espana    | EUR    | E       |
| US     | Otro pais | USD    | $       |

---

## IMPORTANTE - PROTOCOLO DE TRABAJO

1. **Hacer UN cambio a la vez**
2. **Probar en el sitio**
3. **Confirmar que funciona**
4. **Recien ahi pasar al siguiente**

El usuario fue muy claro: "esto no puede pasar" cuando el sitio se rompio por hacer muchos cambios juntos.

---

## SITIO WEB
https://duendesdeluruguay.com

---

## BACKUPS Y VERSIONADO

### Git (local)
- **Commit seguro:** `5e75bb9` - "fix: sistema de precios y carrito reescrito"
- **Tag:** `estable-carrito-2026-01-28`

### Servidor (mu-plugins)
Los plugins viejos están renombrados con `.OLD` o `.BROKEN` como backup.

---

## PROTOCOLO DE TRABAJO

1. **Hacer UN cambio a la vez**
2. **Probar en el sitio**
3. **Confirmar que funciona**
4. **Recién ahí pasar al siguiente**
5. **Commitear cambios importantes con Git**

---

## SITIO WEB
https://duendesdeluruguay.com
