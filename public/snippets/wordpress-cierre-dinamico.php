<?php
/**
 * SNIPPET PARA WORDPRESS/WOOCOMMERCE
 * Muestra el cierre dinámico según el perfil del visitante
 *
 * Agregar este código en:
 * - functions.php del tema hijo, o
 * - Plugin de snippets (Code Snippets), o
 * - Elementor Custom Code
 *
 * Luego agregar el shortcode [cierre_dinamico] donde quieras que aparezca
 */

// Registrar el shortcode
add_shortcode('cierre_dinamico', 'ddu_cierre_dinamico_shortcode');

function ddu_cierre_dinamico_shortcode($atts) {
    global $product;

    // Si no estamos en página de producto, salir
    if (!$product && !is_product()) {
        return '';
    }

    // Obtener ID del producto
    $product_id = $product ? $product->get_id() : get_the_ID();

    // Obtener cierres de los meta fields (6 perfiles)
    $perfiles = ['vulnerable', 'esceptico', 'impulsivo', 'coleccionista', 'racional', 'default'];
    $cierres_json = get_post_meta($product_id, '_cierres_json', true);

    // Construir array de cierres
    $cierres = [];

    if ($cierres_json) {
        $cierres = json_decode($cierres_json, true);
    } else {
        // Cargar cada perfil individualmente
        foreach ($perfiles as $perfil) {
            $cierre = get_post_meta($product_id, '_cierre_' . $perfil, true);
            if ($cierre) {
                $cierres[$perfil] = $cierre;
            }
        }
    }

    // Si no hay cierres, no mostrar nada
    if (empty($cierres)) {
        return '';
    }

    // Escapar JSON para HTML
    $cierres_escaped = esc_attr(json_encode($cierres, JSON_UNESCAPED_UNICODE));

    // Generar HTML del contenedor
    ob_start();
    ?>
    <div id="cierre-dinamico"
         data-producto-id="<?php echo esc_attr($product_id); ?>"
         data-cierres="<?php echo $cierres_escaped; ?>"
         class="cierre-dinamico-container"
         style="opacity: 0; transition: opacity 0.5s ease-in-out;">
        <!-- El contenido se llena dinámicamente por JS -->
        <noscript>
            <?php
            // Fallback para usuarios sin JS: mostrar cierre vulnerable (el más común)
            if (isset($cierres['vulnerable'])) {
                echo '<div class="cierre-noscript">' . wp_kses_post($cierres['vulnerable']) . '</div>';
            }
            ?>
        </noscript>
    </div>

    <style>
    .cierre-dinamico-container {
        margin: 2rem 0;
        padding: 1.5rem;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
        border-radius: 12px;
        border-left: 3px solid #8b5cf6;
    }
    .cierre-dinamico-container p {
        margin-bottom: 1rem;
        line-height: 1.8;
        color: #374151;
    }
    .cierre-dinamico-container p:last-child {
        margin-bottom: 0;
    }
    .cierre-transicion {
        animation: fadeIn 0.5s ease-in-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    </style>
    <?php
    return ob_get_clean();
}

// Encolar el script de detección
add_action('wp_enqueue_scripts', 'ddu_encolar_detector_perfil');

function ddu_encolar_detector_perfil() {
    if (is_product()) {
        // Opción 1: Cargar desde Vercel (recomendado para tener siempre la última versión)
        wp_enqueue_script(
            'ddu-detector-perfil',
            'https://duendes-vercel.vercel.app/js/detector-perfil-guardian.js',
            array(),
            '1.0.0',
            true // En footer
        );

        // Opción 2: Si prefieres copiar el archivo al tema
        // wp_enqueue_script(
        //     'ddu-detector-perfil',
        //     get_stylesheet_directory_uri() . '/js/detector-perfil-guardian.js',
        //     array(),
        //     '1.0.0',
        //     true
        // );
    }
}

/**
 * HOOK ALTERNATIVO: Insertar automáticamente después de la descripción
 * Descomentar si no quieres usar shortcode
 */
/*
add_action('woocommerce_after_single_product_summary', 'ddu_insertar_cierre_automatico', 15);

function ddu_insertar_cierre_automatico() {
    echo do_shortcode('[cierre_dinamico]');
}
*/

/**
 * DEBUG: Ver qué perfil se está detectando
 * Agregar ?debug_perfil=1 a la URL del producto
 */
add_action('wp_footer', 'ddu_debug_perfil');

function ddu_debug_perfil() {
    if (!isset($_GET['debug_perfil']) || !is_product()) {
        return;
    }
    ?>
    <script>
    setTimeout(function() {
        if (window.DDU_PerfilDetector) {
            console.log('Estado del detector:', window.DDU_PerfilDetector.getEstado());
            console.log('Perfil detectado:', window.DDU_PerfilDetector.detectarPerfil());
        }
    }, 3000);
    </script>
    <?php
}
?>
