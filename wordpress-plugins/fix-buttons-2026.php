<?php
/**
 * Plugin Name: Fix Buttons 2026
 * Description: Fuerza botones dorados
 * Version: 1.0
 * Time: 1739590800
 */

if (!defined('ABSPATH')) exit;

add_action('wp_footer', function() {
    ?>
    <script id="fix-buttons-2026">
    (function(){
        console.log('[FIX BUTTONS 2026] v1.0 loaded');

        var G = '#B8973A';
        var B = '#070906';

        // Inyectar CSS
        var s = document.createElement('style');
        s.textContent = '.elementor-button,.e-button,[class*="elementor-button"]{background:'+G+' !important;background-color:'+G+' !important;color:'+B+' !important;border:none !important}.elementor-button:hover{background:#fff !important}.elementor-button span{color:inherit !important}.elementor-background-overlay{opacity:0.2 !important}';
        document.head.appendChild(s);

        function fix() {
            var btns = document.querySelectorAll('.elementor-button, [class*="elementor-button"], a.elementor-button');
            console.log('[FIX BUTTONS 2026] Encontré ' + btns.length + ' botones');
            btns.forEach(function(b) {
                b.style.cssText = 'background:'+G+' !important;background-color:'+G+' !important;color:'+B+' !important;border:none !important;';
                b.querySelectorAll('span').forEach(function(c) {
                    c.style.cssText = 'color:'+B+' !important;background:transparent !important;';
                });
            });
            document.querySelectorAll('.elementor-background-overlay').forEach(function(o) {
                o.style.cssText = 'opacity:0.2 !important;';
            });
        }

        fix();
        document.addEventListener('DOMContentLoaded', fix);
        window.addEventListener('load', function() {
            fix();
            setTimeout(fix, 100);
            setTimeout(fix, 500);
            setTimeout(fix, 1000);
            setTimeout(fix, 2000);
        });
        setInterval(fix, 3000);
    })();
    </script>
    <?php
}, 999999);

add_action('wp_head', function() {
    ?>
    <style id="fix-buttons-2026-css">
    .elementor-button,
    .elementor-widget-button .elementor-button,
    a.elementor-button,
    [class*="elementor-button"] {
        background: #B8973A !important;
        background-color: #B8973A !important;
        color: #070906 !important;
        border: none !important;
    }
    .elementor-button:hover {
        background: #ffffff !important;
        color: #070906 !important;
    }
    .elementor-button span,
    .elementor-button .elementor-button-text {
        color: inherit !important;
    }
    .elementor-background-overlay {
        opacity: 0.2 !important;
    }
    </style>
    <?php
}, 999999);
