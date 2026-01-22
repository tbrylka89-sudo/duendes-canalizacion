<?php
/**
 * Plugin Name: Duendes Checkout Guardian
 * Description: Formulario especial en checkout para personalizar la canalización del guardián + Traducciones
 * Version: 2.0
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════
// TRADUCCIONES WOOCOMMERCE AL ESPAÑOL
// ═══════════════════════════════════════════════════════════════

add_filter('gettext', function($translated, $text, $domain) {
    $traducciones = [
        // Checkout
        'Shipping methods' => 'Método de Envío',
        'Shipping method' => 'Método de Envío',
        'Shipping' => 'Envío',
        'Payment' => 'Pago',
        'Payment method' => 'Forma de Pago',
        'Place order' => 'Confirmar Pedido',
        'Order notes' => 'Notas del pedido',
        'Apply coupon' => 'Aplicar',
        'Coupon code' => 'Código de descuento',
        'Have a coupon?' => '¿Tenés un código de descuento?',
        'Use shipping address as billing address' => 'Usar la dirección de envío como dirección de facturación',
        'Ship to a different address?' => '¿Enviar a otra dirección?',
        'Your order' => 'Tu Pedido',
        'Subtotal' => 'Subtotal',
        'Total' => 'Total',
        'Product' => 'Guardián',
        'Price' => 'Precio',
        'Quantity' => 'Cantidad',

        // Cart
        'Cart' => 'Carrito',
        'Cart totals' => 'Total del Carrito',
        'Proceed to checkout' => 'Ir a la Caja',
        'Update cart' => 'Actualizar',
        'Remove this item' => 'Quitar',
        'Coupon:' => 'Descuento:',
        'Apply' => 'Aplicar',

        // Direcciones
        'Billing details' => 'Datos de Facturación',
        'Shipping details' => 'Datos de Envío',
        'First name' => 'Nombre',
        'Last name' => 'Apellido',
        'Company name' => 'Empresa',
        'Country / Region' => 'País',
        'Street address' => 'Dirección',
        'Apartment, suite, unit, etc.' => 'Apartamento, oficina, etc.',
        'Town / City' => 'Ciudad',
        'State / County' => 'Departamento',
        'Postcode / ZIP' => 'Código Postal',
        'Phone' => 'Teléfono',
        'Email address' => 'Email',

        // Mensajes
        'Sorry, this product cannot be purchased.' => 'Este guardián ya encontró su hogar.',
        'This product is currently out of stock and unavailable.' => 'Este guardián ya fue adoptado.',
        'Out of stock' => 'Adoptado',
        'In stock' => 'Disponible',
        'Add to cart' => 'Sellar el Pacto',
        'View cart' => 'Ver Carrito',
        'added to your cart' => 'sumado a tu carrito',
        'has been added to your cart' => 'fue agregado a tu carrito',

        // Otros
        'Select an option' => 'Seleccioná una opción',
        'Choose an option' => 'Elegí una opción',
        'Clear' => 'Limpiar',
        'N/A' => '-',
        'Description' => 'Descripción',
        'Reviews' => 'Reseñas',
        'Additional information' => 'Información adicional',
        'Related products' => 'Guardianes que congenian',
    ];

    return $traducciones[$text] ?? $translated;
}, 20, 3);

// ═══════════════════════════════════════════════════════════════
// MENSAJE DE CONFIANZA SOBRE MONEDA/PAGO
// ═══════════════════════════════════════════════════════════════

add_action('woocommerce_review_order_before_payment', function() {
    ?>
    <div class="duendes-confianza-pago" style="
        background: linear-gradient(135deg, #fff9e6 0%, #fff5d6 100%);
        padding: 20px 25px;
        border-radius: 12px;
        margin-bottom: 25px;
        border: 1px solid rgba(198,169,98,0.4);
    ">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 12px;">
            <span style="font-size: 24px;">🔒</span>
            <h4 style="margin: 0; color: #8B7355; font-family: Cinzel, serif; font-size: 16px; letter-spacing: 1px;">
                PAGO 100% SEGURO
            </h4>
        </div>
        <p style="margin: 0; color: #5d4e37; font-size: 14px; line-height: 1.6;">
            El precio que ves es el precio final. Sin cargos ocultos, sin sorpresas.
            Tu banco procesará el pago en <strong style="color: #8B7355;">dólares (USD)</strong>
            y lo convertirá automáticamente a tu moneda al tipo de cambio del día.
        </p>
        <div style="display: flex; gap: 20px; margin-top: 15px; flex-wrap: wrap;">
            <span style="color: #8B7355; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                <span style="color: #22c55e;">✓</span> Encriptación SSL
            </span>
            <span style="color: #8B7355; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                <span style="color: #22c55e;">✓</span> Protección antifraude
            </span>
            <span style="color: #8B7355; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                <span style="color: #22c55e;">✓</span> Datos protegidos
            </span>
        </div>
    </div>
    <?php
});

// ═══════════════════════════════════════════════════════════════
// FORMULARIO MEJORADO DE CANALIZACIÓN
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

    ?>
    <div id="duendes-checkout-guardian">
        <div class="dcg-header">
            <span class="dcg-icon">✨</span>
            <div>
                <h3>Personalizar tu Canalización</h3>
                <p>Cada guardián recibe un mensaje único canalizado especialmente. Estas respuestas nos ayudan a conectar con su esencia.</p>
            </div>
        </div>

        <div class="dcg-section">
            <label class="dcg-label">¿Quién recibirá este guardián?</label>
            <div class="dcg-options" id="para-quien-options">
                <label class="dcg-option">
                    <input type="radio" name="guardian_para_quien" value="para_mi" checked>
                    <span class="dcg-option-box">
                        <span class="dcg-option-icon">🙋</span>
                        <span class="dcg-option-text">Yo</span>
                    </span>
                </label>
                <label class="dcg-option">
                    <input type="radio" name="guardian_para_quien" value="regalo">
                    <span class="dcg-option-box">
                        <span class="dcg-option-icon">🎁</span>
                        <span class="dcg-option-text">Regalo</span>
                        <span class="dcg-option-sub">Ya sabe</span>
                    </span>
                </label>
                <label class="dcg-option">
                    <input type="radio" name="guardian_para_quien" value="sorpresa">
                    <span class="dcg-option-box">
                        <span class="dcg-option-icon">🤫</span>
                        <span class="dcg-option-text">Sorpresa</span>
                        <span class="dcg-option-sub">No sabe</span>
                    </span>
                </label>
            </div>
        </div>

        <div class="dcg-section dcg-destinatario" style="display: none;">
            <label class="dcg-label" id="label-nombre-dest">Nombre de quien lo recibirá</label>
            <input type="text" name="guardian_nombre_destinatario" class="dcg-input" id="input-nombre-dest" placeholder="Nombre de la persona especial">
        </div>

        <div class="dcg-section">
            <label class="dcg-label" id="label-edad">Tu edad</label>
            <div class="dcg-options dcg-options-edad">
                <label class="dcg-option-small">
                    <input type="radio" name="guardian_edad" value="adulto" checked>
                    <span>Adulto/a</span>
                </label>
                <label class="dcg-option-small">
                    <input type="radio" name="guardian_edad" value="adolescente">
                    <span>Adolescente</span>
                </label>
                <label class="dcg-option-small">
                    <input type="radio" name="guardian_edad" value="nino">
                    <span>Niño/a</span>
                </label>
            </div>
        </div>

        <div class="dcg-section">
            <label class="dcg-label" id="label-pronombre">Tu pronombre preferido</label>
            <div class="dcg-options dcg-options-edad">
                <label class="dcg-option-small">
                    <input type="radio" name="guardian_pronombre" value="ella" checked>
                    <span>Ella</span>
                </label>
                <label class="dcg-option-small">
                    <input type="radio" name="guardian_pronombre" value="el">
                    <span>Él</span>
                </label>
                <label class="dcg-option-small">
                    <input type="radio" name="guardian_pronombre" value="elle">
                    <span>Elle</span>
                </label>
            </div>
        </div>

        <div class="dcg-divider"></div>

        <div class="dcg-section">
            <label class="dcg-label" id="label-porque">
                <span class="dcg-label-icon">🌙</span>
                <span id="texto-porque">¿Por qué sentís que este guardián te eligió?</span>
            </label>
            <textarea name="guardian_porque_eligio" class="dcg-textarea" id="textarea-porque" placeholder="Contanos qué sentiste cuando lo viste, qué te atrajo, por qué creés que llegó a tu vida en este momento..."></textarea>
            <span class="dcg-hint">Esta respuesta es muy importante para la canalización</span>
        </div>

        <div class="dcg-section">
            <label class="dcg-label" id="label-espera">
                <span class="dcg-label-icon">💫</span>
                <span id="texto-espera">¿Qué esperás que aporte a tu vida?</span>
            </label>
            <textarea name="guardian_que_espera" class="dcg-textarea" id="textarea-espera" placeholder="Protección, compañía, tranquilidad, energía para un proyecto, superar un momento difícil..."></textarea>
        </div>

        <div class="dcg-section">
            <label class="dcg-label" id="label-contexto">
                <span class="dcg-label-icon">✍️</span>
                <span id="texto-contexto">¿Hay algo más que quieras que el guardián sepa sobre vos?</span>
                <span class="dcg-optional">(opcional)</span>
            </label>
            <textarea name="guardian_contexto" class="dcg-textarea dcg-textarea-small" id="textarea-contexto" placeholder="Cualquier cosa que sientas importante: un momento de vida, una intención, un sueño..."></textarea>
        </div>

        <div class="dcg-section">
            <label class="dcg-label" id="label-fecha">
                <span class="dcg-label-icon">🎂</span>
                <span id="texto-fecha">Tu fecha de nacimiento</span>
                <span class="dcg-optional">(enriquece la canalización con numerología)</span>
            </label>
            <input type="date" name="guardian_fecha_nacimiento" class="dcg-input dcg-input-date">
        </div>
    </div>

    <style>
        #duendes-checkout-guardian {
            background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
            padding: 30px;
            border-radius: 20px;
            border: 1px solid rgba(198,169,98,0.3);
            margin-top: 30px;
        }
        .dcg-header {
            display: flex;
            gap: 15px;
            align-items: flex-start;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(198,169,98,0.2);
        }
        .dcg-header .dcg-icon {
            font-size: 32px;
            line-height: 1;
        }
        .dcg-header h3 {
            margin: 0 0 8px 0;
            font-family: 'Cinzel', serif;
            color: #C6A962;
            font-size: 22px;
            font-weight: 500;
        }
        .dcg-header p {
            margin: 0;
            color: #666;
            font-size: 14px;
            line-height: 1.5;
            font-style: italic;
        }
        .dcg-section {
            margin-bottom: 25px;
        }
        .dcg-label {
            display: block;
            color: #333;
            font-weight: 600;
            margin-bottom: 12px;
            font-size: 15px;
        }
        .dcg-label-icon {
            margin-right: 8px;
        }
        .dcg-optional {
            font-weight: 400;
            color: #999;
            font-size: 13px;
        }
        .dcg-options {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .dcg-option {
            flex: 1;
            min-width: 100px;
        }
        .dcg-option input {
            display: none;
        }
        .dcg-option-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 15px;
            background: #fff;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .dcg-option input:checked + .dcg-option-box {
            border-color: #C6A962;
            background: linear-gradient(135deg, #fdfbf7 0%, #f9f5eb 100%);
            box-shadow: 0 4px 15px rgba(198,169,98,0.2);
        }
        .dcg-option-box:hover {
            border-color: #C6A962;
        }
        .dcg-option-icon {
            font-size: 28px;
            margin-bottom: 8px;
        }
        .dcg-option-text {
            font-size: 14px;
            color: #333;
            font-weight: 500;
        }
        .dcg-options-edad {
            gap: 10px;
        }
        .dcg-option-small {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 18px;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .dcg-option-small:hover {
            border-color: #C6A962;
        }
        .dcg-option-small input {
            display: none;
        }
        .dcg-option-small input:checked + span {
            color: #C6A962;
            font-weight: 600;
        }
        .dcg-option-small:has(input:checked) {
            border-color: #C6A962;
            background: linear-gradient(135deg, #fdfbf7 0%, #f9f5eb 100%);
        }
        .dcg-option-small span {
            font-size: 14px;
            color: #555;
        }
        .dcg-input, .dcg-textarea {
            width: 100%;
            padding: 15px 18px;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            font-size: 15px;
            font-family: inherit;
            transition: all 0.3s;
            background: #fff;
            box-sizing: border-box;
        }
        .dcg-input:focus, .dcg-textarea:focus {
            outline: none;
            border-color: #C6A962;
            box-shadow: 0 0 0 3px rgba(198,169,98,0.1);
        }
        .dcg-textarea {
            min-height: 100px;
            resize: vertical;
            line-height: 1.6;
        }
        .dcg-textarea-small {
            min-height: 70px;
        }
        .dcg-textarea::placeholder, .dcg-input::placeholder {
            color: #aaa;
            font-style: italic;
        }
        .dcg-input-date {
            max-width: 200px;
        }
        .dcg-hint {
            display: block;
            margin-top: 8px;
            font-size: 12px;
            color: #C6A962;
            font-style: italic;
        }
        .dcg-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(198,169,98,0.3), transparent);
            margin: 30px 0;
        }
        .dcg-destinatario {
            animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
            #duendes-checkout-guardian { padding: 20px; }
            .dcg-option { min-width: 80px; }
            .dcg-option-box { padding: 15px 10px; }
            .dcg-options-edad { flex-wrap: wrap; }
        }
    </style>

    <script>
    jQuery(function($) {
        // Textos para cada caso
        var textos = {
            para_mi: {
                edad: 'Tu edad',
                pronombre: 'Tu pronombre preferido',
                porque: '¿Por qué sentís que este guardián te eligió?',
                espera: '¿Qué esperás que aporte a tu vida?',
                contexto: '¿Hay algo más que quieras que el guardián sepa sobre vos?',
                fecha: 'Tu fecha de nacimiento',
                placeholderPorque: 'Contanos qué sentiste cuando lo viste, qué te atrajo, por qué creés que llegó a tu vida en este momento...',
                placeholderEspera: 'Protección, compañía, tranquilidad, energía para un proyecto, superar un momento difícil...',
                placeholderContexto: 'Cualquier cosa que sientas importante: un momento de vida, una intención, un sueño...'
            },
            regalo: {
                edad: 'Su edad',
                pronombre: 'Su pronombre preferido',
                porque: '¿Por qué sentís que este guardián eligió a esta persona?',
                espera: '¿Qué esperás que aporte a su vida?',
                contexto: '¿Hay algo que el guardián deba saber sobre quien lo recibirá?',
                fecha: 'Su fecha de nacimiento',
                placeholderPorque: 'Contanos por qué sentís que este guardián es perfecto para esta persona, qué conexión ves entre ellos...',
                placeholderEspera: 'Protección, compañía, tranquilidad, energía, apoyo en un momento difícil...',
                placeholderContexto: 'Lo que sientas importante sobre esta persona: qué está atravesando, qué necesita, sus sueños...'
            },
            sorpresa: {
                edad: 'Su edad',
                pronombre: 'Su pronombre preferido',
                porque: '¿Por qué sentís que este guardián eligió a esta persona?',
                espera: '¿Qué esperás que aporte a su vida?',
                contexto: '¿Hay algo que el guardián deba saber sobre quien lo recibirá?',
                fecha: 'Su fecha de nacimiento',
                placeholderPorque: 'Contanos por qué sentís que este guardián es perfecto para esta persona, qué conexión ves entre ellos...',
                placeholderEspera: 'Protección, compañía, tranquilidad, energía, apoyo en un momento difícil...',
                placeholderContexto: 'Lo que sientas importante sobre esta persona: qué está atravesando, qué necesita, sus sueños...'
            }
        };

        function actualizarTextos(tipo) {
            var t = textos[tipo] || textos.para_mi;

            // Actualizar labels
            $('#label-edad').text(t.edad);
            $('#label-pronombre').text(t.pronombre);
            $('#texto-porque').text(t.porque);
            $('#texto-espera').text(t.espera);
            $('#texto-contexto').text(t.contexto);
            $('#texto-fecha').text(t.fecha);

            // Actualizar placeholders
            $('#textarea-porque').attr('placeholder', t.placeholderPorque);
            $('#textarea-espera').attr('placeholder', t.placeholderEspera);
            $('#textarea-contexto').attr('placeholder', t.placeholderContexto);

            // Mostrar/ocultar campo destinatario
            if (tipo === 'regalo' || tipo === 'sorpresa') {
                $('.dcg-destinatario').slideDown();
            } else {
                $('.dcg-destinatario').slideUp();
            }
        }

        // Toggle y actualizar textos
        $('input[name="guardian_para_quien"]').on('change', function() {
            actualizarTextos($(this).val());
        });

        // Cuando escribe nombre, actualizar pregunta con el nombre
        $('#input-nombre-dest').on('input', function() {
            var nombre = $(this).val().trim();
            var tipo = $('input[name="guardian_para_quien"]:checked').val();

            if ((tipo === 'regalo' || tipo === 'sorpresa') && nombre) {
                $('#texto-porque').text('¿Por qué sentís que este guardián eligió a ' + nombre + '?');
                $('#texto-espera').text('¿Qué esperás que aporte a la vida de ' + nombre + '?');
                $('#texto-contexto').text('¿Hay algo que el guardián deba saber sobre ' + nombre + '?');
                $('#texto-fecha').text('Fecha de nacimiento de ' + nombre);
            }
        });
    });
    </script>
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

    // Si es regalo/sorpresa, necesita nombre
    $para_quien = sanitize_text_field($_POST['guardian_para_quien'] ?? 'para_mi');
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
        'guardian_edad',
        'guardian_pronombre',
        'guardian_porque_eligio',
        'guardian_que_espera',
        'guardian_contexto',
        'guardian_fecha_nacimiento'
    ];

    foreach ($fields as $field) {
        if (!empty($_POST[$field])) {
            update_post_meta($order_id, '_' . $field, sanitize_textarea_field($_POST[$field]));
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
        'regalo' => 'Regalo (la persona sabe)',
        'sorpresa' => 'Sorpresa',
    ];

    $edades = [
        'adulto' => 'Adulto',
        'adolescente' => 'Adolescente',
        'nino' => 'Niño/a',
    ];

    echo '<div style="background: linear-gradient(135deg, #f9f5eb 0%, #f5f0e5 100%); padding: 20px; margin-top: 15px; border-radius: 12px; border-left: 4px solid #C6A962;">';
    echo '<h4 style="margin: 0 0 15px 0; color: #C6A962; font-family: Cinzel, serif;">✨ Datos para Canalización</h4>';

    echo '<p><strong>Para quién:</strong> ' . ($labels[$para_quien] ?? $para_quien) . '</p>';

    $destinatario = get_post_meta($order->get_id(), '_guardian_nombre_destinatario', true);
    if ($destinatario) {
        echo '<p><strong>Nombre destinatario:</strong> ' . esc_html($destinatario) . '</p>';
    }

    $edad = get_post_meta($order->get_id(), '_guardian_edad', true);
    if ($edad) {
        echo '<p><strong>Edad:</strong> ' . ($edades[$edad] ?? $edad) . '</p>';
    }

    $pronombre = get_post_meta($order->get_id(), '_guardian_pronombre', true);
    if ($pronombre) {
        echo '<p><strong>Pronombre:</strong> ' . esc_html($pronombre) . '</p>';
    }

    $porque_eligio = get_post_meta($order->get_id(), '_guardian_porque_eligio', true);
    if ($porque_eligio) {
        echo '<div style="background: #fff; padding: 15px; border-radius: 8px; margin: 10px 0;">';
        echo '<strong style="color: #C6A962;">🌙 Por qué la eligió:</strong><br>';
        echo '<p style="margin: 8px 0 0 0; line-height: 1.6;">' . nl2br(esc_html($porque_eligio)) . '</p>';
        echo '</div>';
    }

    $que_espera = get_post_meta($order->get_id(), '_guardian_que_espera', true);
    if ($que_espera) {
        echo '<div style="background: #fff; padding: 15px; border-radius: 8px; margin: 10px 0;">';
        echo '<strong style="color: #C6A962;">💫 Qué espera:</strong><br>';
        echo '<p style="margin: 8px 0 0 0; line-height: 1.6;">' . nl2br(esc_html($que_espera)) . '</p>';
        echo '</div>';
    }

    $contexto = get_post_meta($order->get_id(), '_guardian_contexto', true);
    if ($contexto) {
        echo '<div style="background: #fff; padding: 15px; border-radius: 8px; margin: 10px 0;">';
        echo '<strong style="color: #C6A962;">✍️ Contexto adicional:</strong><br>';
        echo '<p style="margin: 8px 0 0 0; line-height: 1.6;">' . nl2br(esc_html($contexto)) . '</p>';
        echo '</div>';
    }

    $fecha_nac = get_post_meta($order->get_id(), '_guardian_fecha_nacimiento', true);
    if ($fecha_nac) {
        echo '<p><strong>🎂 Fecha nacimiento:</strong> ' . esc_html($fecha_nac) . '</p>';
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
        'edad' => get_post_meta($resource_id, '_guardian_edad', true),
        'pronombre' => get_post_meta($resource_id, '_guardian_pronombre', true),
        'porque_eligio' => get_post_meta($resource_id, '_guardian_porque_eligio', true),
        'que_espera' => get_post_meta($resource_id, '_guardian_que_espera', true),
        'contexto' => get_post_meta($resource_id, '_guardian_contexto', true),
        'fecha_nacimiento' => get_post_meta($resource_id, '_guardian_fecha_nacimiento', true),
    ];

    return $payload;
}, 10, 4);
