# Plan de Migración a FunnelKit

## Resumen Ejecutivo

Migrar de WooCommerce + Elementor checkout a FunnelKit para:
- Agregar order bumps (runas, minis)
- Upsells post-compra (membresías, guardianes complementarios)
- Mejor integración del formulario de canalización
- A/B testing nativo
- Mejor UX de checkout

---

## Fase 1: Instalación y Configuración (1-2 horas)

### 1.1 Instalar FunnelKit
```
WordPress Admin → Plugins → Agregar nuevo → "FunnelKit"
Instalar versión gratuita primero para probar
Luego activar licencia Plus ($179/año)
```

### 1.2 Configurar pasarelas de pago
- Stripe: Funciona nativo
- Mercado Pago: Verificar compatibilidad (debería funcionar para checkout/bumps)
- Plexo: Verificar compatibilidad

### 1.3 Importar template de checkout
FunnelKit tiene templates pre-diseñados. Elegir uno oscuro/elegante y personalizarlo con:
- Colores: #0a0a0a (fondo), #d4af37 (dorado)
- Tipografías: Cinzel, Cormorant Garamond
- Logo de Duendes

---

## Fase 2: Diseño del Funnel (2-3 horas)

### 2.1 Estructura del Funnel

```
CHECKOUT PAGE
├── Datos del cliente (nombre, email, dirección)
├── Pregunta: "¿Para quién es este guardián?"
│   ○ Para mí
│   ○ Es un regalo (la persona lo sabe)
│   ○ Es un regalo sorpresa
│   ○ Es para un menor de edad
├── Order Bumps:
│   ├── [+$15] Agregá 50 Runas de Poder
│   ├── [+$25] Mini guardián protector
│   └── [+$X] Membresía del Círculo (1 mes gratis)
├── Resumen del pedido
└── Botón PAGAR

↓ (después de pagar)

UPSELL PAGE (opcional, solo si pagó con Stripe)
├── "¡Tu guardián está en camino!"
├── Oferta: "Agregá un compañero por 30% off"
└── [Sí, lo quiero] o [No, gracias]

↓

THANK YOU PAGE
├── Confirmación del pedido
├── FORMULARIO DE CANALIZACIÓN
│   ├── Pantalla 1: Datos personales
│   ├── Pantalla 2: Momento de vida
│   ├── Pantalla 3: Necesidades
│   ├── Pantalla 4: Mensaje al guardián
│   └── Pantalla 5: Foto (opcional)
├── QR para Mi Magia
└── Próximos pasos
```

### 2.2 Order Bumps a configurar

| Bump | Producto | Precio | Ubicación |
|------|----------|--------|-----------|
| Runas Express | 50 Runas de Poder | $15 USD | Debajo del carrito |
| Mini Guardián | Mini aleatorio | $25 USD | Antes del pago |
| Círculo Trial | 1 mes gratis | $0 | Después del email |

### 2.3 Reglas de Order Bumps

```javascript
// Mostrar bump de Runas solo si:
- Carrito tiene guardián
- Cliente NO tiene runas activas

// Mostrar bump de Mini solo si:
- Carrito tiene 1 guardián grande
- Total > $50

// Mostrar Círculo Trial solo si:
- Cliente nuevo (primera compra)
- No es miembro del Círculo
```

---

## Fase 3: Integrar Formulario de Canalización (2-3 horas)

### 3.1 Opción A: Shortcode (recomendado)

Crear shortcode en el plugin actual:
```php
// En duendes-formulario-canalizacion.php

add_shortcode('duendes_formulario_canalizacion', function($atts) {
    // Si estamos en thank you page de FunnelKit
    $order_id = get_query_var('order-received') ?: $atts['order_id'];
    if (!$order_id) return '';

    ob_start();
    duendes_mostrar_formulario_canalizacion($order_id);
    return ob_get_clean();
});
```

En la Thank You page de FunnelKit:
```
[duendes_formulario_canalizacion]
```

### 3.2 Opción B: Integración nativa

Usar campos custom de FunnelKit para la pregunta inicial, y JavaScript para mostrar el formulario completo dinámicamente.

### 3.3 Mantener webhook a Vercel

El webhook actual (`/api/webhooks/formulario-canalizacion`) sigue funcionando igual. Solo cambia dónde se muestra el formulario.

---

## Fase 4: Upsells Post-Compra (1-2 horas)

### 4.1 Upsell 1: Guardián complementario
- Trigger: Compró guardián de protección
- Oferta: Guardián de abundancia con 25% off
- Copy: "Los guardianes trabajan mejor en equipo..."

### 4.2 Upsell 2: Membresía del Círculo
- Trigger: Primera compra
- Oferta: 3 meses de Círculo por precio de 1
- Copy: "Accedé a contenido exclusivo..."

### 4.3 Downsell (si rechaza upsell)
- Oferta: Pack de 100 Runas con 40% off
- Copy: "¿Preferís algo más pequeño?"

**NOTA:** Los upsells solo funcionan con Stripe. Para Mercado Pago, mostrar ofertas en Thank You page sin one-click.

---

## Fase 5: Migración de Checkout Actual (1 hora)

### 5.1 Backup
```bash
# Exportar configuración actual de Elementor
# Backup de la página /caja/
```

### 5.2 Cambiar checkout
```
WooCommerce → Settings → Advanced → Page Setup
Checkout page: [Nueva página FunnelKit]
```

### 5.3 Redirects
Si hay links directos a /caja/, crear redirect a nueva URL de FunnelKit.

---

## Fase 6: Testing (2-3 horas)

### 6.1 Tests de checkout
- [ ] Compra con Stripe
- [ ] Compra con Mercado Pago
- [ ] Compra con Plexo
- [ ] Order bump funciona
- [ ] Formulario de canalización aparece
- [ ] Webhook a Vercel dispara
- [ ] Datos llegan a KV

### 6.2 Tests de upsells (solo Stripe)
- [ ] Upsell aparece después de pagar
- [ ] Acepta upsell, se agrega a la orden
- [ ] Rechaza upsell, va a thank you

### 6.3 Tests mobile
- [ ] Checkout responsive
- [ ] Order bumps visibles
- [ ] Formulario usable en móvil

---

## Cronograma Estimado

| Fase | Tiempo | Prioridad |
|------|--------|-----------|
| 1. Instalación | 1-2h | Alta |
| 2. Diseño funnel | 2-3h | Alta |
| 3. Formulario canalización | 2-3h | Alta |
| 4. Upsells | 1-2h | Media |
| 5. Migración | 1h | Alta |
| 6. Testing | 2-3h | Alta |
| **TOTAL** | **9-14 horas** | |

---

## Cambios al Sistema Actual

### Lo que NO cambia:
- Webhook de WooCommerce a Vercel
- Sistema de canalizaciones en Vercel KV
- Panel de admin de canalizaciones
- Generación de canalizaciones con Claude
- Emails transaccionales

### Lo que SÍ cambia:
- Página de checkout (de Elementor a FunnelKit)
- Ubicación del formulario (integrado en funnel)
- Thank You page (diseño FunnelKit)

### Plugins a desactivar después:
- (Ninguno crítico, Elementor sigue para otras páginas)

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Mitigación |
|--------|--------------|------------|
| Mercado Pago no funciona | Baja | Probar en staging primero |
| Formulario no aparece | Media | Shortcode como fallback |
| Upsells no funcionan con MP | Alta (esperado) | Solo activar upsells para Stripe |
| Diseño no matchea | Baja | Personalizar CSS |

---

## Próximos Pasos

1. **Decisión:** ¿Procedemos con FunnelKit?
2. **Licencia:** Comprar plan Plus ($179/año)
3. **Staging:** Configurar en ambiente de prueba
4. **Migración:** Ejecutar en producción
5. **Monitoreo:** Verificar conversiones

---

## Recursos

- [FunnelKit Docs](https://funnelkit.com/docs/)
- [Order Bumps](https://funnelkit.com/woocommerce-order-bump/)
- [Custom Thank You Pages](https://funnelkit.com/woocommerce-custom-thank-you-page/)
- [Custom Fields](https://funnelkit.com/docs/checkout-pages/fields/how-to-create-a-custom-field/)
- [Payment Gateways](https://funnelkit.com/docs/one-click-upsells/supported-payment-methods/list/)
