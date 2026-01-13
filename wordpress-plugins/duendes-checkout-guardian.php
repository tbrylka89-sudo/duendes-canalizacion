<?php
/**
 * Plugin Name: Duendes Checkout Guardian
 * Description: Formulario especial en checkout para personalizar la canalización del guardián
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════
// AGREGAR CAMPOS AL CHECKOUT SI HAY GUARDIANES EN EL CARRITO
// ═══════════════════════════════════════════════════════════════

add_action('woocommerce_after_order_notes', function($checkout) {
    // Verificar si hay guardianes en el carrito
    $tiene_guardian = false;
    foreach (WC()->cart->get_cart() as $item) {
        $cats = wp_get_post_terms($item['product_id'], 'product_cat', ['fields' => 'slugs']);
        if (array_intersect($cats, ['proteccion', 'abundancia', 'amor', 'salud', 'sanacion', 'sabiduria'])) {
            $tiene_guardian = true;
            break;
        }
    }

    if (!$tiene_guardian) return;

    echo '<div id="duendes-checkout-guardian" style="margin-top: 30px;">';
    echo '<h3 style="font-family: Cinzel, serif; color: #C6A962; border-bottom: 2px solid #C6A962; padding-bottom: 10px; margin-bottom: 20px;">✨ Personalizar tu Canalización</h3>';
    echo '<p style="color: #666; margin-bottom: 20px; font-style: italic;">Cada guardián recibe una canalización única. Ayudanos a hacerla perfecta para vos.</p>';

    // ¿Para quién es?
    woocommerce_form_field('guardian_para_quien', [
        'type' => 'select',
        'class' => ['form-row-wide'],
        'label' => '¿Para quién es este guardián?',
        'required' => true,
        'options' => [
            '' => 'Seleccioná una opción',
            'para_mi' => 'Para mí',
            'regalo' => 'Es un regalo (la persona sabe)',
            'sorpresa' => 'Es una sorpresa (no sabe que lo recibirá)',
        ]
    ], $checkout->get_value('guardian_para_quien'));

    // Nombre del destinatario (si es regalo/sorpresa)
    woocommerce_form_field('guardian_nombre_destinatario', [
        'type' => 'text',
        'class' => ['form-row-wide', 'destinatario-field'],
        'label' => 'Nombre de quien recibirá el guardián',
        'placeholder' => 'Nombre de la persona que lo recibirá',
    ], $checkout->get_value('guardian_nombre_destinatario'));

    // ¿Es para un niño?
    woocommerce_form_field('guardian_es_nino', [
        'type' => 'select',
        'class' => ['form-row-wide'],
        'label' => '¿Es para un niño/a?',
        'required' => true,
        'options' => [
            '' => 'Seleccioná',
            'adulto' => 'No, es para adulto',
            'adolescente' => 'Sí, adolescente (13-17 años)',
            'nino' => 'Sí, niño/a (7-12 años)',
            'pequeno' => 'Sí, pequeño/a (menor de 7)',
        ]
    ], $checkout->get_value('guardian_es_nino'));

    // Pronombre preferido
    woocommerce_form_field('guardian_pronombre', [
        'type' => 'select',
        'class' => ['form-row-wide'],
        'label' => 'Pronombre de quien recibirá el guardián',
        'options' => [
            'ella' => 'Ella',
            'el' => 'Él',
            'elle' => 'Elle',
        ]
    ], $checkout->get_value('guardian_pronombre') ?: 'ella');

    // Algo especial que quieras contarnos
    woocommerce_form_field('guardian_contexto', [
        'type' => 'textarea',
        'class' => ['form-row-wide'],
        'label' => '¿Hay algo especial que quieras contarnos?',
        'placeholder' => 'Por ejemplo: está pasando por un momento difícil, acaba de mudarse, necesita protección en su trabajo, es muy sensible a las energías... Todo esto ayuda a personalizar la canalización.',
    ], $checkout->get_value('guardian_contexto'));

    // Fecha de nacimiento (opcional, para numerología)
    woocommerce_form_field('guardian_fecha_nacimiento', [
        'type' => 'date',
        'class' => ['form-row-wide'],
        'label' => 'Fecha de nacimiento (opcional - enriquece la canalización)',
    ], $checkout->get_value('guardian_fecha_nacimiento'));

    echo '</div>';

    // Script para mostrar/ocultar campo de destinatario
    ?>
    <script>
    jQuery(function($) {
        function toggleDestinatario() {
            var val = $('#guardian_para_quien').val();
            if (val === 'regalo' || val === 'sorpresa') {
                $('.destinatario-field').slideDown();
            } else {
                $('.destinatario-field').slideUp();
            }
        }
        toggleDestinatario();
        $('#guardian_para_quien').on('change', toggleDestinatario);
    });
    </script>
    <style>
        #duendes-checkout-guardian {
            background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
            padding: 25px;
            border-radius: 15px;
            border: 1px solid rgba(198,169,98,0.3);
        }
        #duendes-checkout-guardian label {
            color: #333 !important;
            font-weight: 500 !important;
        }
        #duendes-checkout-guardian select,
        #duendes-checkout-guardian input,
        #duendes-checkout-guardian textarea {
            border: 1px solid rgba(198,169,98,0.3) !important;
            border-radius: 8px !important;
        }
        #duendes-checkout-guardian select:focus,
        #duendes-checkout-guardian input:focus,
        #duendes-checkout-guardian textarea:focus {
            border-color: #C6A962 !important;
            box-shadow: 0 0 0 2px rgba(198,169,98,0.1) !important;
        }
        .destinatario-field {
            display: none;
        }
    </style>
    <?php
});

// ═══════════════════════════════════════════════════════════════
// VALIDAR CAMPOS
// ═══════════════════════════════════════════════════════════════

add_action('woocommerce_checkout_process', function() {
    // Verificar si hay guardianes
    $tiene_guardian = false;
    foreach (WC()->cart->get_cart() as $item) {
        $cats = wp_get_post_terms($item['product_id'], 'product_cat', ['fields' => 'slugs']);
        if (array_intersect($cats, ['proteccion', 'abundancia', 'amor', 'salud', 'sanacion', 'sabiduria'])) {
            $tiene_guardian = true;
            break;
        }
    }

    if (!$tiene_guardian) return;

    if (empty($_POST['guardian_para_quien'])) {
        wc_add_notice('Por favor indicá para quién es el guardián.', 'error');
    }

    if (empty($_POST['guardian_es_nino'])) {
        wc_add_notice('Por favor indicá si es para un niño/a o adulto.', 'error');
    }

    // Si es regalo/sorpresa, necesita nombre
    $para_quien = sanitize_text_field($_POST['guardian_para_quien'] ?? '');
    if (($para_quien === 'regalo' || $para_quien === 'sorpresa') && empty($_POST['guardian_nombre_destinatario'])) {
        wc_add_notice('Por favor ingresá el nombre de quien recibirá el guardián.', 'error');
    }
});

// ═══════════════════════════════════════════════════════════════
// GUARDAR CAMPOS EN LA ORDEN
// ═══════════════════════════════════════════════════════════════

add_action('woocommerce_checkout_update_order_meta', function($order_id) {
    $fields = [
        'guardian_para_quien',
        'guardian_nombre_destinatario',
        'guardian_es_nino',
        'guardian_pronombre',
        'guardian_contexto',
        'guardian_fecha_nacimiento'
    ];

    foreach ($fields as $field) {
        if (!empty($_POST[$field])) {
            update_post_meta($order_id, '_' . $field, sanitize_text_field($_POST[$field]));
        }
    }
});

// ═══════════════════════════════════════════════════════════════
// MOSTRAR EN ADMIN DE LA ORDEN
// ═══════════════════════════════════════════════════════════════

add_action('woocommerce_admin_order_data_after_billing_address', function($order) {
    $para_quien = get_post_meta($order->get_id(), '_guardian_para_quien', true);
    if (!$para_quien) return;

    $labels = [
        'para_mi' => 'Para sí mismo/a',
        'regalo' => 'Regalo (sabe)',
        'sorpresa' => 'Sorpresa (no sabe)',
    ];

    $edades = [
        'adulto' => 'Adulto',
        'adolescente' => 'Adolescente (13-17)',
        'nino' => 'Niño/a (7-12)',
        'pequeno' => 'Pequeño/a (-7)',
    ];

    echo '<div style="background: #f9f5eb; padding: 15px; margin-top: 15px; border-radius: 8px; border-left: 4px solid #C6A962;">';
    echo '<h4 style="margin: 0 0 10px 0; color: #C6A962;">✨ Datos para Canalización</h4>';

    echo '<p><strong>Para quién:</strong> ' . ($labels[$para_quien] ?? $para_quien) . '</p>';

    $destinatario = get_post_meta($order->get_id(), '_guardian_nombre_destinatario', true);
    if ($destinatario) {
        echo '<p><strong>Nombre destinatario:</strong> ' . esc_html($destinatario) . '</p>';
    }

    $es_nino = get_post_meta($order->get_id(), '_guardian_es_nino', true);
    if ($es_nino) {
        echo '<p><strong>Edad:</strong> ' . ($edades[$es_nino] ?? $es_nino) . '</p>';
    }

    $pronombre = get_post_meta($order->get_id(), '_guardian_pronombre', true);
    if ($pronombre) {
        echo '<p><strong>Pronombre:</strong> ' . esc_html($pronombre) . '</p>';
    }

    $contexto = get_post_meta($order->get_id(), '_guardian_contexto', true);
    if ($contexto) {
        echo '<p><strong>Contexto:</strong> ' . esc_html($contexto) . '</p>';
    }

    $fecha_nac = get_post_meta($order->get_id(), '_guardian_fecha_nacimiento', true);
    if ($fecha_nac) {
        echo '<p><strong>Fecha nacimiento:</strong> ' . esc_html($fecha_nac) . '</p>';
    }

    echo '</div>';
});

// ═══════════════════════════════════════════════════════════════
// AGREGAR DATOS AL WEBHOOK DE WOOCOMMERCE
// ═══════════════════════════════════════════════════════════════

add_filter('woocommerce_webhook_payload', function($payload, $resource, $resource_id, $webhook_id) {
    if ($resource !== 'order') return $payload;

    // Agregar campos de canalización
    $payload['datos_canalizacion'] = [
        'para_quien' => get_post_meta($resource_id, '_guardian_para_quien', true),
        'nombre_destinatario' => get_post_meta($resource_id, '_guardian_nombre_destinatario', true),
        'es_nino' => get_post_meta($resource_id, '_guardian_es_nino', true),
        'pronombre' => get_post_meta($resource_id, '_guardian_pronombre', true),
        'contexto' => get_post_meta($resource_id, '_guardian_contexto', true),
        'fecha_nacimiento' => get_post_meta($resource_id, '_guardian_fecha_nacimiento', true),
    ];

    return $payload;
}, 10, 4);
