# Actualización 28 de Enero 2026

## Resumen
Se reescribió completamente el sistema de precios y carrito para solucionar problemas de rendimiento y cálculos incorrectos.

---

## Problema Original
- El carrito se trababa y no cargaba (especialmente desde Uruguay)
- Loop infinito causado por MutationObserver en JavaScript
- Precios mal calculados en el carrito para Uruguay
- Botones sin texto visible
- Tasas de cambio desactualizadas

---

## Solución Implementada

### Arquitectura Nueva (Limpia)

```
WooCommerce (interno) → SIEMPRE USD
         ↓
    Filtro PHP (prioridad 100)
         ↓
    Detectar país (cookie > IP > default US)
         ↓
    ┌────┴────┐
 Uruguay    Internacional
    ↓           ↓
 $5.500      $150 USD
  UYU        (aprox. $217.500 pesos argentinos)
```

### Reglas de Oro
1. WooCommerce siempre opera en USD internamente
2. Los precios visuales se modifican SOLO con PHP (no JavaScript)
3. Sin MutationObserver, sin loops
4. El checkout cobra en la moneda de la pasarela (Plexo/MercadoPago)

---

## Archivos Modificados

### Plugins NUEVOS (activos en servidor)

| Archivo | Ubicación Servidor | Función |
|---------|-------------------|---------|
| `duendes-precios-v3.php` | `mu-plugins/` | Sistema de precios limpio |
| `duendes-cart-checkout-v2.php` | `mu-plugins/` | Estilos del carrito/checkout |
| `duendes-avisos-carrito.php` | `mu-plugins/` | Avisos de 3x2 y envío gratis |

### Plugins DESACTIVADOS (renombrados con .OLD)

| Archivo | Estado |
|---------|--------|
| `duendes-precios-unificado.php.OLD3` | Desactivado |
| `duendes-cart-checkout.php.OLD` | Desactivado |

### Copias Locales

Todos los archivos están en:
```
/Users/usuario/Desktop/duendes-vercel/wordpress-plugins/
```

---

## Detalle de cada Plugin

### 1. duendes-precios-v3.php

**Función:** Modifica el display de precios según país

**Características:**
- Detecta país por cookie `duendes_pais` o por IP
- Uruguay: muestra precios fijos en UYU (tabla hardcodeada)
- Internacional: muestra USD + aproximado en moneda local
- SIN MutationObserver
- SIN setTimeout múltiples
- Filtros de carrito incluidos (precio unitario, subtotal, total)

**Tabla de precios Uruguay:**
```
USD $70    → UYU $2.500   (Mini clásico)
USD $150   → UYU $5.500   (Pixie, Mini especial)
USD $200   → UYU $8.000   (Mediano)
USD $450   → UYU $16.500  (Grande)
USD $1050  → UYU $39.800  (Gigante)
```

**Tasas de cambio (hardcodeadas):**
```php
'AR' => ['simbolo' => '$', 'nombre' => 'pesos argentinos', 'tasa' => 1450],
'MX' => ['simbolo' => '$', 'nombre' => 'pesos mexicanos', 'tasa' => 20.5],
'CO' => ['simbolo' => '$', 'nombre' => 'pesos colombianos', 'tasa' => 4400],
'CL' => ['simbolo' => '$', 'nombre' => 'pesos chilenos', 'tasa' => 990],
'PE' => ['simbolo' => 'S/', 'nombre' => 'soles', 'tasa' => 3.75],
'BR' => ['simbolo' => 'R$', 'nombre' => 'reales', 'tasa' => 6.1],
'ES' => ['simbolo' => '€', 'nombre' => 'euros', 'tasa' => 0.92],
'GB' => ['simbolo' => '£', 'nombre' => 'libras', 'tasa' => 0.79],
```

**Filtros WordPress usados:**
- `woocommerce_get_price_html` (prioridad 100)
- `woocommerce_cart_item_price` (prioridad 100)
- `woocommerce_cart_item_subtotal` (prioridad 100)
- `woocommerce_cart_subtotal` (prioridad 100)
- `woocommerce_cart_total` (prioridad 100)

---

### 2. duendes-cart-checkout-v2.php

**Función:** Estilos visuales del carrito y checkout

**Características:**
- Tema "cremita" (fondo claro, dorado)
- Botones dorados con texto visible
- CSS para botón vacío (`:empty::before`)
- JavaScript mínimo solo para traducir textos
- Header del checkout personalizado

**Correcciones de botones:**
- Botón "ACTUALIZAR CARRITO" siempre visible
- Botón "FINALIZAR COMPRA" creado si no existe

---

### 3. duendes-avisos-carrito.php

**Función:** Muestra avisos de promociones en el carrito

**Avisos incluidos:**
1. Promo 3x2 (progreso hacia mini gratis)
2. Envío gratis (progreso hacia umbral)

**Umbrales de envío gratis:**
```php
DUENDES_ENVIO_GRATIS_USD = 1000   // Internacional
DUENDES_ENVIO_GRATIS_UYU = 10000  // Uruguay
```

**Corrección importante:**
- Antes asumía que el subtotal de WooCommerce estaba en UYU para Uruguay (ERROR)
- Ahora calcula el total UYU sumando cada producto con la tabla fija

---

## Cómo Funciona la Detección de País

1. **Cookie `duendes_pais`** (prioridad máxima) - seteada por selector de banderas
2. **Cache de sesión** - para no repetir llamadas
3. **Detección por IP** - usa api ip-api.com
4. **Default: US** - si todo falla

El selector de banderas está en `duendes-header-universal.php` (NO fue modificado).

---

## Acceso al Servidor

```
Host: 34.70.139.72
Puerto: 55309
Usuario: sftp_live_WfP6i
Password: JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR
Ruta mu-plugins: web/wp-live/wp-content/mu-plugins/
```

**Comando para subir archivo:**
```bash
expect << 'EOF'
spawn sftp -P 55309 sftp_live_WfP6i@34.70.139.72
expect "password:"
send "JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR\r"
expect "sftp>"
send "put ARCHIVO_LOCAL web/wp-live/wp-content/mu-plugins/ARCHIVO_REMOTO\r"
expect "sftp>"
send "bye\r"
expect eof
EOF
```

---

## Si Algo Se Rompe

### El carrito no carga
1. Verificar que `duendes-precios-v3.php` no tenga MutationObserver
2. Buscar errores de función no definida (ej: `duendes_v3_formatear`)
3. Verificar sintaxis PHP

### Precios incorrectos en Uruguay
1. Verificar tabla de precios en `duendes-precios-v3.php` líneas 167-175
2. Verificar filtros de carrito (líneas 270-350)

### Aviso de envío gratis mal calculado
1. Verificar `duendes-avisos-carrito.php`
2. Verificar función `duendes_avisos_usd_a_uyu()` (línea ~25)

### Para restaurar versión anterior
```bash
# En el servidor via SFTP:
rename duendes-precios-v3.php duendes-precios-v3.php.BACKUP
rename duendes-precios-unificado.php.OLD3 duendes-precios-unificado.php
```

---

## Pendientes para el Futuro

- [ ] API de cotizaciones automáticas (para actualizar tasas)
- [ ] Verificar que Plexo cobre en UYU a Uruguay
- [ ] Verificar que MercadoPago funcione correctamente
- [ ] Testear checkout completo con compra real

---

## Contacto

Documentación creada por Claude Code el 28/01/2026.
