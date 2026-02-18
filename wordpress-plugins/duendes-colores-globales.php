<?php
/**
 * Plugin Name: Duendes Colores Globales
 * Description: Override TOTAL de colores - Botones dorados en todo el sitio
 * Version: 1.2
 * Updated: 2026-02-15 02:30:00
 */
// Cache bust: 1739590200

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// 1. ENQUEUE CSS como archivo externo (más confiable que output directo)
// ═══════════════════════════════════════════════════════════════════════════
add_action('wp_enqueue_scripts', function() {
    // Agregar CSS inline al style de Elementor (si existe) o crear uno propio
    $css = duendes_get_button_css();

    // Intentar agregarlo a elementor-frontend
    if (wp_style_is('elementor-frontend', 'enqueued')) {
        wp_add_inline_style('elementor-frontend', $css);
    }

    // También registrar nuestro propio style como fallback
    wp_register_style('duendes-colores', false);
    wp_enqueue_style('duendes-colores');
    wp_add_inline_style('duendes-colores', $css);

}, 999999);

// ═══════════════════════════════════════════════════════════════════════════
// 2. CSS TAMBIÉN EN WP_HEAD como backup (doble seguridad)
// ═══════════════════════════════════════════════════════════════════════════
add_action('wp_head', function() {
    echo '<style id="duendes-colores-head">' . duendes_get_button_css() . '</style>';
}, 999999);

// ═══════════════════════════════════════════════════════════════════════════
// 3. CSS EN WP_FOOTER también (triple seguridad)
// ═══════════════════════════════════════════════════════════════════════════
add_action('wp_footer', function() {
    echo '<style id="duendes-colores-footer">' . duendes_get_button_css() . '</style>';
}, 1);

// ═══════════════════════════════════════════════════════════════════════════
// 4. JAVASCRIPT QUE FUERZA LOS COLORES
// ═══════════════════════════════════════════════════════════════════════════
add_action('wp_footer', function() {
    ?>
    <script id="duendes-colores-js">
    (function() {
        'use strict';

        var GOLD = '#B8973A';
        var BLACK = '#070906';

        console.log('[DUENDES COLORES] v1.2 loaded - ' + new Date().toISOString());

        function forceGold(el) {
            if (!el || !el.style) return;
            el.style.setProperty('background', GOLD, 'important');
            el.style.setProperty('background-color', GOLD, 'important');
            el.style.setProperty('background-image', 'none', 'important');
            el.style.setProperty('color', BLACK, 'important');
            el.style.setProperty('border-color', GOLD, 'important');

            // Hijos
            var c = el.querySelectorAll('span, .elementor-button-text, .elementor-button-content-wrapper');
            for (var i = 0; i < c.length; i++) {
                c[i].style.setProperty('color', BLACK, 'important');
            }
        }

        function fixOverlay(el) {
            if (!el) return;
            el.style.setProperty('opacity', '0.2', 'important');
        }

        function fixAll() {
            // Botones por clase
            var btns = document.querySelectorAll('.elementor-button, .e-button, [class*="elementor-button"], a.elementor-button');
            console.log('[DUENDES COLORES] Encontrados ' + btns.length + ' botones');
            for (var i = 0; i < btns.length; i++) {
                forceGold(btns[i]);
            }

            // Overlays
            var ovs = document.querySelectorAll('.elementor-background-overlay');
            for (var j = 0; j < ovs.length; j++) {
                fixOverlay(ovs[j]);
            }
        }

        // Observer para cambios dinámicos
        var obs = new MutationObserver(function(muts) {
            muts.forEach(function(m) {
                if (m.addedNodes) {
                    for (var i = 0; i < m.addedNodes.length; i++) {
                        var n = m.addedNodes[i];
                        if (n.nodeType === 1) {
                            if (n.className && typeof n.className === 'string' && n.className.indexOf('elementor-button') > -1) {
                                forceGold(n);
                            }
                            if (n.querySelectorAll) {
                                var inner = n.querySelectorAll('[class*="elementor-button"]');
                                for (var j = 0; j < inner.length; j++) {
                                    forceGold(inner[j]);
                                }
                            }
                        }
                    }
                }
                if (m.type === 'attributes' && m.target.className) {
                    var cn = typeof m.target.className === 'string' ? m.target.className : '';
                    if (cn.indexOf('elementor-button') > -1) {
                        forceGold(m.target);
                    }
                }
            });
        });

        obs.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        // Ejecutar
        fixAll();
        document.addEventListener('DOMContentLoaded', fixAll);
        window.addEventListener('load', function() {
            fixAll();
            setTimeout(fixAll, 100);
            setTimeout(fixAll, 300);
            setTimeout(fixAll, 600);
            setTimeout(fixAll, 1000);
            setTimeout(fixAll, 2000);
        });

        // Cada 3 segundos
        setInterval(fixAll, 3000);

    })();
    </script>
    <?php
}, 999999);

// ═══════════════════════════════════════════════════════════════════════════
// 5. HOOK DE ELEMENTOR
// ═══════════════════════════════════════════════════════════════════════════
add_action('elementor/frontend/after_enqueue_styles', function() {
    wp_add_inline_style('elementor-frontend', duendes_get_button_css());
}, 999999);

// ═══════════════════════════════════════════════════════════════════════════
// CSS FUNCTION
// ═══════════════════════════════════════════════════════════════════════════
function duendes_get_button_css() {
    return '
/* DUENDES COLORES GLOBALES v1.2 - Feb 2026 */

/* ═══ BOTONES - Fondo dorado #B8973A, texto negro #070906 ═══ */
html body .elementor-button,
html body .elementor-widget-button .elementor-button,
html body .elementor-button.elementor-size-sm,
html body .elementor-button.elementor-size-md,
html body .elementor-button.elementor-size-lg,
html body .elementor-button.elementor-size-xl,
html body a.elementor-button,
html body a.elementor-button-link,
html body button.elementor-button,
html body .e-button,
html body [class*="elementor-button"],
html body .elementor-element .elementor-button,
html body .woocommerce a.button,
html body .woocommerce button.button,
html body .woocommerce input.button,
html body .woocommerce .button,
html body .wp-block-button__link,
html body input[type="submit"],
html body input[type="button"] {
    background: #B8973A !important;
    background-color: #B8973A !important;
    background-image: none !important;
    color: #070906 !important;
    border: none !important;
    border-color: #B8973A !important;
}

/* Hover - fondo blanco */
html body .elementor-button:hover,
html body .elementor-widget-button .elementor-button:hover,
html body a.elementor-button:hover,
html body a.elementor-button-link:hover,
html body .e-button:hover,
html body [class*="elementor-button"]:hover,
html body .woocommerce a.button:hover,
html body .woocommerce button.button:hover,
html body .wp-block-button__link:hover,
html body input[type="submit"]:hover {
    background: #ffffff !important;
    background-color: #ffffff !important;
    color: #070906 !important;
}

/* Texto de botones */
html body .elementor-button span,
html body .elementor-button .elementor-button-text,
html body .elementor-button .elementor-button-content-wrapper,
html body [class*="elementor-button"] span,
html body [class*="elementor-button"] .elementor-button-text {
    color: inherit !important;
    background: transparent !important;
}

/* Botones outline/secundarios */
html body .elementor-button.e-btn-outline,
html body .elementor-button[class*="outline"],
html body .btn-outline,
html body .btn-secondary {
    background: transparent !important;
    border: 1px solid rgba(184,151,58,0.35) !important;
    color: #B8973A !important;
}

html body .elementor-button.e-btn-outline:hover,
html body .btn-outline:hover,
html body .btn-secondary:hover {
    background: #ffffff !important;
    color: #070906 !important;
    border-color: #ffffff !important;
}

/* ═══ HERO OVERLAY - Más claro para ver imagen ═══ */
html body .elementor-background-overlay,
html body .elementor-section > .elementor-background-overlay,
html body .elementor-element .elementor-background-overlay {
    opacity: 0.2 !important;
}

/* ═══ FORZAR - Eliminar cualquier verde ═══ */
.elementor-button[style*="background-color: rgb(94"],
.elementor-button[style*="background-color: #5"],
.elementor-button[style*="background-color: #4"],
.elementor-button[style*="background: rgb(94"],
.elementor-button[style*="background: #5"],
[style*="background-color: green"],
[style*="background: green"] {
    background: #B8973A !important;
    background-color: #B8973A !important;
}
';
}
