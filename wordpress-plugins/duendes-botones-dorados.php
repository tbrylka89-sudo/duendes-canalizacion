<?php
/**
 * Plugin Name: Duendes Botones Dorados
 * Description: Fuerza botones dorados en todo el sitio
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// CSS muy agresivo
add_action('wp_head', function() {
    echo '<style id="duendes-botones-v1">
    /* NUCLEAR - Todos los botones dorados */
    .elementor-button,
    .elementor-widget-button .elementor-button,
    .elementor-button-wrapper .elementor-button,
    a.elementor-button,
    a.elementor-button-link,
    .elementor-widget-button a,
    .e-button,
    button,
    .btn,
    .button,
    input[type="submit"],
    input[type="button"],
    .wp-block-button__link,
    .woocommerce a.button,
    .woocommerce button.button,
    .woocommerce input.button {
        background: #B8973A !important;
        background-color: #B8973A !important;
        background-image: none !important;
        color: #070906 !important;
        border: none !important;
    }

    .elementor-button:hover,
    .elementor-widget-button .elementor-button:hover,
    a.elementor-button:hover,
    .e-button:hover,
    button:hover,
    .btn:hover,
    .button:hover {
        background: #fff !important;
        background-color: #fff !important;
        color: #070906 !important;
    }

    .elementor-button span,
    .elementor-button-text,
    .elementor-button-content-wrapper {
        color: #070906 !important;
    }

    .elementor-button:hover span,
    .elementor-button:hover .elementor-button-text {
        color: #070906 !important;
    }

    /* Hero más claro */
    .elementor-background-overlay {
        opacity: 0.25 !important;
    }
    </style>';
}, 999999);

// JS de respaldo - busca TODOS los posibles botones
add_action('wp_footer', function() {
    ?>
    <script>
    console.log('Duendes botones dorados v2');

    function fixButtons() {
        // Buscar todos los links y botones que parezcan CTAs
        var allLinks = document.querySelectorAll('a, button');
        console.log('Total links/buttons encontrados:', allLinks.length);

        allLinks.forEach(function(el) {
            var text = el.textContent.toLowerCase();
            var classes = el.className.toLowerCase();

            // Si parece un botón de CTA
            if (text.includes('guardian') ||
                text.includes('descubr') ||
                text.includes('ver ') ||
                text.includes('comprar') ||
                text.includes('añadir') ||
                text.includes('agregar') ||
                classes.includes('button') ||
                classes.includes('btn') ||
                classes.includes('cta') ||
                el.getAttribute('role') === 'button') {

                console.log('Botón encontrado:', el.textContent.trim().substring(0,30));

                // Aplicar estilos dorados
                el.style.setProperty('background-color', '#B8973A', 'important');
                el.style.setProperty('background', '#B8973A', 'important');
                el.style.setProperty('background-image', 'none', 'important');
                el.style.setProperty('color', '#070906', 'important');
                el.style.setProperty('border', 'none', 'important');

                // También a los hijos
                el.querySelectorAll('*').forEach(function(child) {
                    child.style.setProperty('color', '#070906', 'important');
                });
            }
        });

        // Hero overlay
        document.querySelectorAll('[class*="overlay"], [class*="background-overlay"]').forEach(function(o) {
            o.style.setProperty('opacity', '0.25', 'important');
        });
    }

    fixButtons();
    setTimeout(fixButtons, 500);
    setTimeout(fixButtons, 1500);
    setTimeout(fixButtons, 3000);
    </script>
    <?php
}, 999999);
