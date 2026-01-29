# Sistema de Precios v3 - Duendes del Uruguay

## Resumen de la Solucion

Se crearon 2 plugins nuevos que reemplazan los anteriores:

| Plugin Viejo | Plugin Nuevo | Funcion |
|--------------|--------------|---------|
| `duendes-precios-unificado.php` | `duendes-precios-v3.php` | Sistema de precios por pais |
| `duendes-cart-checkout.php` | `duendes-cart-checkout-v2.php` | Estilos y traducciones carrito |

## Problemas que Solucionan

### 1. Carrito Trabado
**Causa:** El plugin anterior usaba MutationObserver observando TODO el body, lo que causaba loops infinitos cuando WooCommerce actualizaba el carrito via AJAX.

**Solucion:**
- Se elimino MutationObserver completamente
- JavaScript solo se ejecuta UNA vez al cargar
- Re-ejecucion SOLO cuando WooCommerce dispara eventos especificos (`updated_cart_totals`)

### 2. Botones sin Texto
**Causa:** WooCommerce a veces renderiza botones vacios, y el CSS anterior no los manejaba.

**Solucion:**
- CSS con `:empty::before` que inyecta texto si el boton esta vacio
- JavaScript que fuerza el texto en el evento DOMContentLoaded
- PHP con filtros de WooCommerce para textos de botones

### 3. Loops de JavaScript
**Causa:** El plugin anterior tenia:
- MutationObserver observando el body entero
- setTimeout x3 (500ms, 1500ms, 3000ms)
- Logica que modificaba precios en el carrito via JS

**Solucion:**
- Zero MutationObserver
- JavaScript ejecuta UNA sola vez
- Precios se modifican SOLO via PHP (filtro `woocommerce_get_price_html`)

## Como Funciona el Sistema de Precios

```
WooCommerce (interno) --> SIEMPRE USD
                |
                v
         Filtro PHP (woocommerce_get_price_html)
                |
                v
         Detectar pais (cookie > IP > default US)
                |
        +-------+-------+
        |               |
    Uruguay          Resto del Mundo
        |               |
        v               v
    $X.XXX UYU      $XX USD
    (precio fijo)   + (aprox. en moneda local)
```

### Precios Fijos Uruguay

| Rango USD | Precio UYU |
|-----------|------------|
| $0-100    | $2.500     |
| $100-175  | $5.500     |
| $175-350  | $8.000     |
| $350-800  | $16.500    |
| $800+     | $39.800    |

### Aproximado Internacional

Para paises con moneda configurada (AR, MX, CO, CL, PE, BR, ES, GB), se muestra:
```
$70 USD (aprox. $84.000 ARS)
```

## Instalacion

### Paso 1: Desactivar plugins viejos

Via SFTP, renombrar los plugins viejos:
```
mu-plugins/duendes-precios-unificado.php --> duendes-precios-unificado.php.OLD
mu-plugins/duendes-cart-checkout.php --> duendes-cart-checkout.php.OLD
```

### Paso 2: Subir plugins nuevos

Subir a `mu-plugins/`:
```
duendes-precios-v3.php
duendes-cart-checkout-v2.php
```

### Paso 3: Limpiar cache

1. Ir a 10Web dashboard
2. Limpiar cache de Nginx/LiteSpeed
3. En WordPress: Purgar cache de cualquier plugin de cache

### Paso 4: Probar

1. Ir al carrito con productos
2. Verificar que carga sin trabarse
3. Verificar que botones tienen texto
4. Verificar precios segun pais (usar `?debug_precios=1` como admin)

## Archivos

```
/wordpress-plugins/
  duendes-precios-v3.php          <-- Sistema de precios NUEVO
  duendes-cart-checkout-v2.php    <-- Carrito/checkout NUEVO
  duendes-precios-unificado.php   <-- VIEJO (desactivar)
  duendes-cart-checkout.php       <-- VIEJO (desactivar)
```

## Debug

Para ver informacion de debug (solo admins):
```
https://duendesdeluruguay.com/carrito/?debug_precios=1
```

Esto muestra en un comentario HTML:
- Pais detectado
- Cookie actual
- IP detectada
- Si es Uruguay o no

## Compatibilidad

- WooCommerce 8.x
- Elementor (no interfiere)
- Plexo y MercadoPago (pasarelas siguen cobrando en su moneda nativa)

## Pasarelas de Pago

El sistema NO modifica las pasarelas. Cada una cobra en su moneda:

| Pasarela | Moneda | Disponible |
|----------|--------|------------|
| Plexo | USD | Internacional + Uruguay |
| MercadoPago | UYU | Solo Uruguay |

WooCommerce internamente siempre opera en USD. La conversion visual es solo para mostrar al usuario.
