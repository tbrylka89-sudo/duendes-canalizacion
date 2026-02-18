<?php
/**
 * Plugin Name: Duendes - Ficha Neuromarketing
 * Description: Mejoras de conversión para fichas de producto (Bloque 5)
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 *
 * BLOQUE 5 del documento de tareas:
 * - "A quién busca este guardián"
 * - Metadata: Intención | Tamaño | Tipo
 * - Info de envío detallada
 * - Botón "Sellar el pacto · $XXX"
 * - "Lleva X días esperando"
 * - Testimonios rotativos (ya existe, complementamos)
 */

if (!defined('ABSPATH')) exit;

// =============================================================================
// CONFIGURACIÓN
// =============================================================================

define('DUENDES_ENVIO_URUGUAY', '$222 aprox · se paga al recibir');
define('DUENDES_ENVIO_INTERNACIONAL', 'vía DHL Express · calculado al finalizar');
define('DUENDES_ENVIO_GRATIS_UYU', 10000);
define('DUENDES_ENVIO_GRATIS_USD', 1000);

// =============================================================================
// "A QUIÉN BUSCA ESTE GUARDIÁN" - Campo meta y generación
// =============================================================================

// Agregar campo en el editor de producto
add_action('woocommerce_product_options_general_product_data', 'duendes_campo_quien_busca');

function duendes_campo_quien_busca() {
    global $post;

    echo '<div class="options_group" style="border-top: 1px solid #eee; padding-top: 15px;">';
    echo '<h4 style="padding-left: 12px; color: #c9a227;">🎯 Neuromarketing - A Quién Busca</h4>';
    echo '<p style="padding-left: 12px; color: #666; font-size: 12px;">Describe a la PERSONA que este guardián busca, no al guardián. Ej: "Busca a alguien que carga con energías que no le pertenecen."</p>';

    woocommerce_wp_textarea_input([
        'id' => '_duendes_quien_busca',
        'label' => 'A quién busca',
        'description' => '2-3 líneas describiendo a la persona ideal. Si está vacío, se genera automáticamente.',
        'desc_tip' => true,
        'rows' => 3
    ]);

    echo '</div>';
}

// Guardar campo
add_action('woocommerce_process_product_meta', 'duendes_guardar_quien_busca');

function duendes_guardar_quien_busca($post_id) {
    if (isset($_POST['_duendes_quien_busca'])) {
        update_post_meta($post_id, '_duendes_quien_busca', sanitize_textarea_field($_POST['_duendes_quien_busca']));
    }
}

// Generar automáticamente si no existe
function duendes_get_quien_busca($product_id) {
    $quien_busca = get_post_meta($product_id, '_duendes_quien_busca', true);

    if (!empty($quien_busca)) {
        return $quien_busca;
    }

    // Generar basado en categoría
    $product = wc_get_product($product_id);
    if (!$product) return '';

    $nombre = $product->get_name();
    $cats = wp_get_post_terms($product_id, 'product_cat', ['fields' => 'slugs']);
    $cat = !empty($cats) ? $cats[0] : '';

    // Textos por categoría de intención
    $textos = [
        'proteccion' => [
            "$nombre busca a alguien que carga con energías que no le pertenecen. Alguien que protege a todos menos a sí mismo. Si sentís que el mundo te pesa más de lo que debería, él ya te encontró.",
            "$nombre busca a quien necesita sentirse seguro en un mundo que a veces abruma. A alguien que da más de lo que recibe y necesita un escudo invisible.",
            "$nombre busca a quien lleva demasiado tiempo siendo fuerte para otros. A alguien que merece sentir que también lo cuidan."
        ],
        'amor' => [
            "$nombre busca a quien tiene el corazón abierto pero herido. A alguien que cree en el amor pero le cuesta recibirlo. Si sentís que das más de lo que te dan, llegó tu guardián.",
            "$nombre busca a quien está listo para amar sin miedo. A alguien que sabe que merece conexiones profundas y verdaderas.",
            "$nombre busca a quien necesita sanar antes de volver a abrirse. A alguien que entiende que el amor propio es el primer paso."
        ],
        'dinero' => [
            "$nombre busca a quien trabaja duro pero siente que el dinero se escapa. A alguien que sabe que merece abundancia pero tiene bloqueos invisibles.",
            "$nombre busca a quien está listo para cambiar su relación con el dinero. A alguien que quiere prosperar sin culpa.",
            "$nombre busca a quien emprende, crea y sueña en grande. A alguien que necesita que el universo conspire a su favor."
        ],
        'abundancia' => [
            "$nombre busca a quien trabaja duro pero siente que el dinero se escapa. A alguien que sabe que merece abundancia pero tiene bloqueos invisibles.",
            "$nombre busca a quien está listo para cambiar su relación con el dinero. A alguien que quiere prosperar sin culpa.",
            "$nombre busca a quien emprende, crea y sueña en grande. A alguien que necesita que el universo conspire a su favor."
        ],
        'salud' => [
            "$nombre busca a quien necesita sanar algo que no se ve. A alguien que carga dolores antiguos, propios o heredados.",
            "$nombre busca a quien está en proceso de recuperación. A alguien que sabe que la sanación lleva tiempo pero no quiere hacerlo solo.",
            "$nombre busca a quien cuida de otros pero se olvida de sí mismo. A alguien que necesita recordar que también merece cuidados."
        ],
        'sanacion' => [
            "$nombre busca a quien necesita sanar algo que no se ve. A alguien que carga dolores antiguos, propios o heredados.",
            "$nombre busca a quien está en proceso de recuperación. A alguien que sabe que la sanación lleva tiempo pero no quiere hacerlo solo.",
            "$nombre busca a quien cuida de otros pero se olvida de sí mismo. A alguien que necesita recordar que también merece cuidados."
        ],
        'sabiduria' => [
            "$nombre busca a quien tiene muchas preguntas y pocas certezas. A alguien que sabe que hay más de lo que se ve.",
            "$nombre busca a quien está en un momento de decisiones importantes. A alguien que necesita claridad cuando todo parece confuso.",
            "$nombre busca a quien busca respuestas que no están en los libros. A alguien listo para escuchar su intuición."
        ]
    ];

    // Buscar categoría que coincida
    foreach ($textos as $key => $opciones) {
        if (strpos($cat, $key) !== false) {
            return $opciones[array_rand($opciones)];
        }
    }

    // Default
    return "$nombre busca a alguien especial. Si llegaste hasta acá, probablemente ya te encontró.";
}

// =============================================================================
// "LLEVA X DÍAS ESPERANDO"
// =============================================================================

function duendes_get_dias_esperando($product_id) {
    $post = get_post($product_id);
    if (!$post) return 0;

    $fecha_publicacion = strtotime($post->post_date);
    $ahora = time();
    $diferencia = $ahora - $fecha_publicacion;
    $dias = floor($diferencia / (60 * 60 * 24));

    return max(1, $dias); // Mínimo 1 día
}

function duendes_texto_dias_esperando($product_id) {
    $dias = duendes_get_dias_esperando($product_id);
    $product = wc_get_product($product_id);
    $nombre = $product ? $product->get_name() : 'Este guardián';

    if ($dias == 1) {
        return "$nombre llegó ayer. Recién comenzó su espera.";
    } elseif ($dias < 7) {
        return "$nombre lleva $dias días esperando encontrar a su persona.";
    } elseif ($dias < 30) {
        $semanas = floor($dias / 7);
        $texto_semanas = $semanas == 1 ? 'una semana' : "$semanas semanas";
        return "$nombre lleva $texto_semanas esperando. Su paciencia es infinita.";
    } elseif ($dias < 90) {
        $meses = floor($dias / 30);
        $texto_meses = $meses == 1 ? 'un mes' : "$meses meses";
        return "$nombre lleva $texto_meses esperando. Sabe que el momento correcto llegará.";
    } else {
        return "$nombre lleva mucho tiempo esperando a alguien especial. ¿Serás vos?";
    }
}

// =============================================================================
// INFO DE ENVÍO DETALLADA
// =============================================================================

function duendes_get_info_envio($product_id = null) {
    // Detectar país del usuario
    $pais = duendes_detectar_pais_usuario();

    if ($pais === 'UY') {
        return [
            'icono' => '🇺🇾',
            'texto' => 'Uruguay: ' . DUENDES_ENVIO_URUGUAY,
            'gratis_desde' => '$' . number_format(DUENDES_ENVIO_GRATIS_UYU, 0, ',', '.') . ' UYU'
        ];
    } else {
        return [
            'icono' => '🌎',
            'texto' => 'Internacional: ' . DUENDES_ENVIO_INTERNACIONAL,
            'gratis_desde' => '$' . DUENDES_ENVIO_GRATIS_USD . ' USD'
        ];
    }
}

function duendes_detectar_pais_usuario() {
    // 1. Cookie
    if (isset($_COOKIE['duendes_pais'])) {
        return strtoupper($_COOKIE['duendes_pais']);
    }

    // 2. Sesión WooCommerce
    if (function_exists('WC') && WC()->customer) {
        $country = WC()->customer->get_billing_country();
        if ($country) return strtoupper($country);
    }

    // 3. Default
    return 'UY';
}

// =============================================================================
// INYECTAR EN LA FICHA DE PRODUCTO
// =============================================================================

// Hook temprano para agregar "A quién busca" después del título
add_action('woocommerce_single_product_summary', 'duendes_mostrar_quien_busca', 6);

function duendes_mostrar_quien_busca() {
    global $product;
    if (!$product) return;

    $quien_busca = duendes_get_quien_busca($product->get_id());
    if (empty($quien_busca)) return;

    ?>
    <div class="duendes-quien-busca" style="
        margin: 15px 0 25px 0;
        padding: 20px;
        background: linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(201,162,39,0.02) 100%);
        border-left: 3px solid rgba(201,162,39,0.5);
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 17px;
        line-height: 1.7;
        color: rgba(255,255,255,0.9);
        font-style: italic;
    ">
        <?php echo esc_html($quien_busca); ?>
    </div>
    <?php
}

// Metadata: Intención | Tamaño | Tipo
add_action('woocommerce_single_product_summary', 'duendes_mostrar_metadata', 7);

function duendes_mostrar_metadata() {
    global $product;
    if (!$product) return;

    $product_id = $product->get_id();

    // Obtener datos
    $cats = wp_get_post_terms($product_id, 'product_cat', ['fields' => 'names']);
    $intencion = !empty($cats) ? $cats[0] : '';

    $tamano_terms = wp_get_post_terms($product_id, 'tamano_guardian', ['fields' => 'names']);
    $tamano = !empty($tamano_terms) ? $tamano_terms[0] : '';

    $tipo_terms = wp_get_post_terms($product_id, 'tipo_ser', ['fields' => 'names']);
    $tipo = !empty($tipo_terms) ? $tipo_terms[0] : 'Guardián';

    // Ficha para tamaño en cm
    $ficha = get_post_meta($product_id, '_duendes_ficha', true) ?: [];
    $tamano_cm = $ficha['tamano_cm'] ?? '';

    ?>
    <div class="duendes-metadata" style="
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin: 20px 0;
        font-family: 'Cinzel', serif;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: rgba(255,255,255,0.6);
    ">
        <?php if ($intencion): ?>
        <span class="duendes-meta-item" style="padding: 8px 15px; border: 1px solid rgba(201,162,39,0.3); background: rgba(201,162,39,0.05);">
            <?php echo esc_html($intencion); ?>
        </span>
        <?php endif; ?>

        <?php if ($tamano): ?>
        <span class="duendes-meta-item" style="padding: 8px 15px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.03);">
            <?php echo esc_html($tamano); ?>
            <?php if ($tamano_cm): ?>
                <span style="opacity: 0.7;">(~<?php echo esc_html($tamano_cm); ?>cm)</span>
            <?php endif; ?>
        </span>
        <?php endif; ?>

        <?php if ($tipo): ?>
        <span class="duendes-meta-item" style="padding: 8px 15px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.03);">
            <?php echo esc_html($tipo); ?>
        </span>
        <?php endif; ?>
    </div>
    <?php
}

// Info de envío
add_action('woocommerce_single_product_summary', 'duendes_mostrar_info_envio', 25);

function duendes_mostrar_info_envio() {
    $envio = duendes_get_info_envio();

    ?>
    <div class="duendes-envio-info" style="
        margin: 20px 0;
        padding: 15px;
        background: rgba(0,0,0,0.3);
        border-radius: 8px;
        font-size: 13px;
        color: rgba(255,255,255,0.7);
    ">
        <div style="margin-bottom: 8px;">
            <span style="font-size: 16px;"><?php echo $envio['icono']; ?></span>
            <span style="margin-left: 8px;"><?php echo esc_html($envio['texto']); ?></span>
        </div>
        <div style="font-size: 12px; color: rgba(201,162,39,0.8);">
            ✨ Envío gratis en compras desde <?php echo esc_html($envio['gratis_desde']); ?>
        </div>
    </div>
    <?php
}

// Días esperando
add_action('woocommerce_single_product_summary', 'duendes_mostrar_dias_esperando', 35);

function duendes_mostrar_dias_esperando() {
    global $product;
    if (!$product) return;

    // Solo para productos únicos
    $es_unico = get_post_meta($product->get_id(), '_es_unico', true);
    if ($es_unico === 'no') return;

    $texto = duendes_texto_dias_esperando($product->get_id());

    ?>
    <div class="duendes-dias-esperando" style="
        margin: 15px 0;
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 14px;
        font-style: italic;
        color: rgba(255,255,255,0.5);
    ">
        ⏳ <?php echo esc_html($texto); ?>
    </div>
    <?php
}

// Badge "Guardián único" mejorado
add_action('woocommerce_single_product_summary', 'duendes_mostrar_badge_unico', 4);

function duendes_mostrar_badge_unico() {
    global $product;
    if (!$product) return;

    $es_unico = get_post_meta($product->get_id(), '_es_unico', true);

    if ($es_unico === 'yes') {
        ?>
        <div class="duendes-badge-unico-grande" style="
            display: inline-block;
            margin-bottom: 10px;
            padding: 6px 15px;
            background: linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.05) 100%);
            border: 1px solid rgba(201,162,39,0.4);
            font-family: 'Cinzel', serif;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: #c9a227;
        ">
            ✦ Guardián único · Cuando se adopta, desaparece ✦
        </div>
        <?php
    }
}

// =============================================================================
// MEJORAR BOTÓN "SELLAR EL PACTO"
// =============================================================================

// Reemplazar texto del botón de añadir al carrito
add_filter('woocommerce_product_single_add_to_cart_text', 'duendes_texto_boton_pacto');

function duendes_texto_boton_pacto($text) {
    global $product;
    if (!$product) return $text;

    $precio = $product->get_price();

    // Detectar moneda
    $pais = duendes_detectar_pais_usuario();
    if ($pais === 'UY') {
        // Convertir a UYU
        $precios_uyu = [
            70 => 2500,
            150 => 5500,
            200 => 8000,
            450 => 16500,
            1050 => 39800
        ];
        $precio_uyu = $precios_uyu[intval($precio)] ?? intval($precio * 40);
        return 'SELLAR EL PACTO · $' . number_format($precio_uyu, 0, ',', '.');
    }

    return 'SELLAR EL PACTO · $' . number_format($precio, 0) . ' USD';
}

// Estilos del botón
add_action('wp_head', 'duendes_estilos_boton_pacto');

function duendes_estilos_boton_pacto() {
    if (!is_product()) return;
    ?>
    <style>
    /* Botón Sellar el Pacto - Estilo Premium */
    .single_add_to_cart_button,
    .prod-btn,
    .prod-cta-btn {
        background: transparent !important;
        border: 2px solid #c9a227 !important;
        color: #c9a227 !important;
        font-family: 'Cinzel', serif !important;
        font-size: 14px !important;
        text-transform: uppercase !important;
        letter-spacing: 3px !important;
        padding: 18px 40px !important;
        cursor: pointer !important;
        transition: all 0.4s ease !important;
        position: relative !important;
        overflow: hidden !important;
    }

    .single_add_to_cart_button:hover,
    .prod-btn:hover,
    .prod-cta-btn:hover {
        background: #c9a227 !important;
        color: #0a0a0a !important;
        box-shadow: 0 0 30px rgba(201,162,39,0.4) !important;
    }

    /* Ocultar otros botones que compiten */
    .woocommerce-variation-add-to-cart .quantity,
    .single-product .product .cart .quantity {
        display: none !important;
    }

    /* Quitar botones duplicados */
    .single-product form.cart > .button:not(.single_add_to_cart_button) {
        display: none !important;
    }
    </style>
    <?php
}

// =============================================================================
// TESTIMONIOS MEJORADOS (si no existen ya)
// =============================================================================

function duendes_get_testimonios_premium() {
    return [
        [
            'texto' => 'Desde que llegó mi guardián, la energía de mi casa cambió completamente. No es algo que pueda explicar, simplemente se siente diferente.',
            'nombre' => 'María Elena',
            'ubicacion' => 'Montevideo, Uruguay',
            'bandera' => '🇺🇾'
        ],
        [
            'texto' => 'Lo compré escéptica, lo admito. Pero hay algo en la forma que me mira desde su estante... siento que me cuida.',
            'nombre' => 'Carolina S.',
            'ubicacion' => 'Buenos Aires, Argentina',
            'bandera' => '🇦🇷'
        ],
        [
            'texto' => 'Se lo regalé a mi mamá que estaba pasando un momento difícil. Me dijo que siente que tiene un compañero silencioso.',
            'nombre' => 'Lucía M.',
            'ubicacion' => 'Maldonado, Uruguay',
            'bandera' => '🇺🇾'
        ],
        [
            'texto' => 'Ya tengo 5 guardianes. Cada uno llegó en un momento diferente de mi vida y cada uno significa algo especial.',
            'nombre' => 'Camila T.',
            'ubicacion' => 'CDMX, México',
            'bandera' => '🇲🇽'
        ],
        [
            'texto' => 'No soy de creer en estas cosas. Soy ingeniero. Pero mi esposa insistió tanto que le di el gusto. Han pasado 8 meses y no sé cómo explicar lo que siento.',
            'nombre' => 'Diego R.',
            'ubicacion' => 'Santiago, Chile',
            'bandera' => '🇨🇱'
        ]
    ];
}

// =============================================================================
// CSS GLOBAL PARA FICHA
// =============================================================================

add_action('wp_head', 'duendes_estilos_ficha_neuromarketing');

function duendes_estilos_ficha_neuromarketing() {
    if (!is_product()) return;
    ?>
    <style>
    /* Estilos Neuromarketing para Ficha de Producto */

    /* Quien busca */
    .duendes-quien-busca {
        animation: fadeInUp 0.6s ease;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Metadata responsive */
    @media (max-width: 768px) {
        .duendes-metadata {
            justify-content: center;
        }

        .duendes-meta-item {
            font-size: 10px !important;
            padding: 6px 12px !important;
        }

        .duendes-quien-busca {
            font-size: 15px !important;
            padding: 15px !important;
        }

        .duendes-envio-info {
            font-size: 12px !important;
        }
    }

    /* Badge único animado */
    .duendes-badge-unico-grande {
        animation: pulseGold 3s ease-in-out infinite;
    }

    @keyframes pulseGold {
        0%, 100% {
            box-shadow: 0 0 5px rgba(201,162,39,0.2);
        }
        50% {
            box-shadow: 0 0 20px rgba(201,162,39,0.4);
        }
    }

    /* Días esperando */
    .duendes-dias-esperando {
        border-left: 2px solid rgba(255,255,255,0.1);
        padding-left: 15px;
    }
    </style>
    <?php
}

// =============================================================================
// API PARA OBTENER DATOS DE NEUROMARKETING
// =============================================================================

add_action('rest_api_init', 'duendes_registrar_api_neuromarketing');

function duendes_registrar_api_neuromarketing() {
    register_rest_route('duendes/v1', '/producto/(?P<id>\d+)/neuromarketing', [
        'methods' => 'GET',
        'callback' => 'duendes_api_get_neuromarketing',
        'permission_callback' => '__return_true'
    ]);
}

function duendes_api_get_neuromarketing($request) {
    $product_id = $request['id'];

    return [
        'quien_busca' => duendes_get_quien_busca($product_id),
        'dias_esperando' => duendes_get_dias_esperando($product_id),
        'texto_dias' => duendes_texto_dias_esperando($product_id),
        'envio' => duendes_get_info_envio($product_id),
        'es_unico' => get_post_meta($product_id, '_es_unico', true) === 'yes'
    ];
}
