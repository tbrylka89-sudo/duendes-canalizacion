<?php
/**
 * Plugin Name: Duendes - Elementor Fix
 * Description: Arregla error elementorFrontendConfig is not defined
 * Version: 6.0
 */

if (!defined('ABSPATH')) exit;

// Definir elementorFrontendConfig ANTES de que cargue Elementor
add_action('wp_head', function() {
    ?>
    <script id="duendes-elementor-fix">
    // Fix para error: elementorFrontendConfig is not defined
    if (typeof elementorFrontendConfig === 'undefined') {
        window.elementorFrontendConfig = {
            environmentMode: { edit: false, wpPreview: false },
            i18n: {},
            is_rtl: false,
            breakpoints: { xs: 0, sm: 480, md: 768, lg: 1025, xl: 1440, xxl: 1600 },
            responsive: { breakpoints: {} },
            version: '3.0.0',
            urls: { assets: '' },
            settings: { page: [], editorPreferences: [] },
            kit: { active_breakpoints: ['viewport_mobile', 'viewport_tablet'], global_image_lightbox: 'yes' },
            post: { id: 0, title: '', excerpt: '' }
        };
        console.log('[Elementor Fix] elementorFrontendConfig definido');
    }
    </script>
    <?php
}, 1);

// CSS de scroll básico
add_action('wp_head', function() {
    ?>
    <style id="duendes-scroll-basic">
    html, body {
        overflow-y: auto !important;
        overflow-x: hidden !important;
    }
    body.menu-movil-abierto {
        overflow: hidden !important;
    }
    </style>
    <?php
}, 99999);
