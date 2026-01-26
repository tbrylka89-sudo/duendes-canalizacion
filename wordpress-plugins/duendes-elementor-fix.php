<?php
/**
 * Plugin Name: Duendes - Elementor Fix
 * Description: Fuerza la carga de scripts de Elementor en páginas con templates customizados
 * Version: 1.1
 */

if (!defined('ABSPATH')) exit;

// Detectar si estamos en una página con template customizado
function duendes_es_pagina_customizada() {
    return is_product() || is_shop() || is_product_category() || is_product_tag();
}

// Forzar que Elementor cargue sus scripts
add_action('wp_enqueue_scripts', function() {
    if (duendes_es_pagina_customizada() && class_exists('\Elementor\Plugin')) {
        // Forzar que Elementor sepa que debe cargar scripts del frontend
        \Elementor\Plugin::$instance->frontend->enqueue_scripts();
        \Elementor\Plugin::$instance->frontend->enqueue_styles();
    }
}, 5);

// Asegurar que elementorFrontendConfig se defina
add_action('wp_footer', function() {
    if (duendes_es_pagina_customizada() && class_exists('\Elementor\Plugin')) {
        // Verificar si elementorFrontendConfig ya existe
        ?>
        <script>
        if (typeof elementorFrontendConfig === 'undefined') {
            // Definir configuración mínima de Elementor para evitar errores
            window.elementorFrontendConfig = {
                environmentMode: {
                    edit: false,
                    wpPreview: false,
                    isScriptDebug: false,
                },
                i18n: {
                    shareOnFacebook: 'Share on Facebook',
                    shareOnTwitter: 'Share on Twitter',
                    pinIt: 'Pin it',
                    download: 'Download',
                    downloadImage: 'Download image',
                    fullscreen: 'Fullscreen',
                    zoom: 'Zoom',
                    share: 'Share',
                    playVideo: 'Play Video',
                    previous: 'Previous',
                    next: 'Next',
                    close: 'Close',
                },
                is_rtl: false,
                breakpoints: {
                    xs: 0,
                    sm: 480,
                    md: 768,
                    lg: 1025,
                    xl: 1440,
                    xxl: 1600
                },
                responsive: {
                    breakpoints: {
                        mobile: { label: 'Mobile Portrait', value: 767, default_value: 767, direction: 'max', is_enabled: true },
                        mobile_extra: { label: 'Mobile Landscape', value: 880, default_value: 880, direction: 'max', is_enabled: false },
                        tablet: { label: 'Tablet Portrait', value: 1024, default_value: 1024, direction: 'max', is_enabled: true },
                        tablet_extra: { label: 'Tablet Landscape', value: 1200, default_value: 1200, direction: 'max', is_enabled: false },
                        laptop: { label: 'Laptop', value: 1366, default_value: 1366, direction: 'max', is_enabled: false },
                        widescreen: { label: 'Widescreen', value: 2400, default_value: 2400, direction: 'min', is_enabled: false },
                    }
                },
                version: '3.34.0',
                is_static: false,
                experimentalFeatures: {
                    e_optimized_assets_loading: true,
                    additional_custom_breakpoints: true,
                    e_swiper_latest: true,
                    container_grid: true,
                },
                urls: {
                    assets: '<?php echo esc_url(ELEMENTOR_ASSETS_URL); ?>',
                },
                swiperClass: 'swiper',
                settings: {
                    page: [],
                    editorPreferences: []
                },
                kit: {
                    active_breakpoints: ['viewport_mobile', 'viewport_tablet'],
                    global_image_lightbox: 'yes',
                    lightbox_enable_counter: 'yes',
                    lightbox_enable_fullscreen: 'yes',
                    lightbox_enable_zoom: 'yes',
                    lightbox_enable_share: 'yes',
                    lightbox_title_src: 'title',
                    lightbox_description_src: 'description'
                },
                post: {
                    id: <?php echo get_the_ID(); ?>,
                    title: '<?php echo esc_js(get_the_title()); ?>',
                    excerpt: '',
                }
            };
            console.log('[Duendes] elementorFrontendConfig inicializado manualmente');
        }
        </script>
        <?php
    }
}, 1);
