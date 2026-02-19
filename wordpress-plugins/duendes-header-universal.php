<?php
/**
 * Plugin Name: Duendes Header Universal
 * Description: Header independiente que funciona en todas las páginas sin depender de Elementor
 * Version: 3.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// Versión para cache-busting
define('DH_HEADER_VERSION', '3.0.' . date('His'));

// Inyectar el header apenas abre el body
add_action('wp_body_open', 'duendes_header_universal', 1);

function duendes_header_universal() {
    // Obtener cantidad del carrito
    $cart_count = 0;
    if (function_exists('WC') && WC()->cart) {
        $cart_count = WC()->cart->get_cart_contents_count();
    }

    // URLs
    $home = home_url('/');
    $shop = home_url('/shop/');
    $cart = function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/carrito/');
    $account = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('myaccount') : home_url('/mi-cuenta/');
    ?>

    <style id="duendes-header-v3-<?php echo time(); ?>">
    /* ═══════════════════════════════════════════════════════════════
       DUENDES HEADER UNIVERSAL v3 - Mobile First
       ═══════════════════════════════════════════════════════════════ */

    /* Reset y base */
    * { box-sizing: border-box; }

    body {
        margin: 0 !important;
        padding: 0 !important;
        background: #0a0a0a !important;
    }

    /* Spacer */
    #dh-spacer {
        display: block;
        height: 60px;
        background: #0a0a0a;
        width: 100%;
    }

    /* HEADER PRINCIPAL */
    .dh-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: #0a0a0a;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        box-shadow: 0 2px 20px rgba(0,0,0,0.3);
        font-family: 'Cinzel', serif;
    }

    /* IZQUIERDA - Logo en móvil */
    .dh-left {
        display: flex;
        align-items: center;
    }

    .dh-logo {
        text-decoration: none;
        display: block;
    }

    .dh-logo-text {
        color: #d4af37;
        font-size: 0.85rem;
        font-weight: 600;
        letter-spacing: 1px;
        display: block;
        text-transform: uppercase;
        white-space: nowrap;
    }

    .dh-logo-tagline {
        color: rgba(255,255,255,0.5);
        font-size: 0.5rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        font-family: 'Cormorant Garamond', serif;
        white-space: nowrap;
    }

    /* DERECHA - Carrito + Hamburguesa */
    .dh-right {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .dh-hamburger {
        display: flex;
        flex-direction: column;
        gap: 5px;
        cursor: pointer;
        padding: 8px;
        z-index: 1000001;
    }

    .dh-hamburger span {
        width: 22px;
        height: 2px;
        background: rgba(255,255,255,0.85);
        transition: all 0.3s;
        display: block;
    }

    .dh-hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .dh-hamburger.active span:nth-child(2) {
        opacity: 0;
    }

    .dh-hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
    }

    .dh-icon {
        width: 22px;
        height: 22px;
        stroke: rgba(255,255,255,0.85);
        fill: none;
        transition: stroke 0.3s;
    }

    .dh-icon-link {
        display: flex;
        align-items: center;
    }

    .dh-icon-link:hover .dh-icon {
        stroke: #d4af37;
    }

    /* Carrito con badge */
    .dh-cart {
        position: relative;
    }

    .dh-cart-badge {
        position: absolute;
        top: -6px;
        right: -6px;
        background: #d4af37;
        color: #0a0a0a;
        font-size: 0.6rem;
        font-weight: 700;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: sans-serif;
    }

    .dh-cart-badge:empty,
    .dh-cart-badge[data-count="0"] {
        display: none;
    }

    /* Elementos solo desktop */
    .dh-desktop-only {
        display: none;
    }

    /* ═══════════════════════════════════════════════════════════════
       MENU MOVIL
       ═══════════════════════════════════════════════════════════════ */

    .dh-mobile-menu {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #0a0a0a;
        z-index: 1000000;
        padding: 80px 25px 30px;
        transform: translateX(-100%);
        transition: transform 0.35s ease;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .dh-mobile-menu.active {
        transform: translateX(0);
    }

    .dh-mobile-menu a {
        display: block;
        color: rgba(255,255,255,0.85);
        text-decoration: none;
        font-size: 1.1rem;
        padding: 14px 0;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        font-family: 'Cinzel', serif;
        letter-spacing: 1px;
    }

    .dh-mobile-menu a:active {
        color: #d4af37;
    }

    .dh-mobile-menu .dh-mi-magia-link {
        color: #d4af37;
        border-bottom-color: rgba(212,175,55,0.3);
    }

    .dh-mobile-divider {
        height: 1px;
        background: rgba(212,175,55,0.3);
        margin: 15px 0;
    }

    .dh-mobile-menu .dh-small-link {
        font-size: 0.85rem;
        color: rgba(255,255,255,0.5);
        padding: 10px 0;
    }

    /* Botón cerrar menú */
    .dh-close-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 0;
        margin-bottom: 10px;
        cursor: pointer;
        border-bottom: 2px solid rgba(212,175,55,0.4);
    }

    .dh-close-btn span {
        color: #d4af37;
        font-family: 'Cinzel', serif;
        font-size: 1rem;
        letter-spacing: 1px;
        text-transform: uppercase;
    }

    .dh-close-btn:active {
        opacity: 0.7;
    }

    /* ═══════════════════════════════════════════════════════════════
       DESKTOP (1100px+)
       ═══════════════════════════════════════════════════════════════ */

    @media (min-width: 1100px) {
        .dh-header {
            height: 70px;
            padding: 0 30px;
        }

        #dh-spacer {
            height: 70px;
        }

        /* Hamburguesa visible también en desktop */
        .dh-hamburger {
            display: flex !important;
        }

        /* Mostrar nav desktop */
        .dh-desktop-only {
            display: flex !important;
        }

        .dh-left {
            gap: 25px;
        }

        .dh-desktop-nav {
            display: flex;
            align-items: center;
            gap: 25px;
        }

        .dh-left .dh-nav-link,
        .dh-desktop-nav .dh-nav-link {
            color: rgba(255,255,255,0.85);
            text-decoration: none;
            font-size: 0.8rem;
            letter-spacing: 1px;
            transition: color 0.3s;
            text-transform: uppercase;
        }

        .dh-left .dh-nav-link:hover,
        .dh-desktop-nav .dh-nav-link:hover {
            color: #d4af37;
        }

        /* Dropdown Tienda */
        .dh-dropdown {
            position: relative;
        }

        .dh-dropdown-trigger {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            color: rgba(255,255,255,0.85);
            font-size: 0.8rem;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: color 0.3s;
        }

        .dh-dropdown-trigger:hover {
            color: #d4af37;
        }

        .dh-dropdown-trigger::after {
            content: '▾';
            font-size: 0.55rem;
            opacity: 0.6;
        }

        .dh-dropdown-menu {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: #1a1a1a;
            border: 1px solid rgba(212,175,55,0.2);
            border-radius: 8px;
            padding: 12px 0;
            min-width: 200px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
            box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }

        .dh-dropdown:hover .dh-dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }

        .dh-dropdown-menu a {
            display: block;
            padding: 10px 20px;
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            font-size: 0.8rem;
            transition: all 0.2s;
            text-transform: none;
        }

        .dh-dropdown-menu a:hover {
            background: rgba(212,175,55,0.1);
            color: #d4af37;
            padding-left: 25px;
        }

        /* Logo en desktop */
        .dh-logo-text {
            font-size: 1.1rem;
            letter-spacing: 2px;
        }

        .dh-logo-tagline {
            font-size: 0.55rem;
            letter-spacing: 3px;
        }

        /* Nav derecha desktop */
        .dh-right {
            gap: 20px;
        }

        .dh-right > a.dh-text-link {
            color: rgba(255,255,255,0.85);
            text-decoration: none;
            font-size: 0.8rem;
            letter-spacing: 1px;
            transition: color 0.3s;
            text-transform: uppercase;
        }

        .dh-right > a.dh-text-link:hover {
            color: #d4af37;
        }

        .dh-icon {
            width: 22px;
            height: 22px;
        }
    }

    /* ═══════════════════════════════════════════════════════════════
       SELECTOR DE PAÍS EN HEADER
       ═══════════════════════════════════════════════════════════════ */

    .dh-pais-selector {
        position: relative;
    }

    .dh-pais-btn {
        width: 36px;
        height: 36px;
        background: #0a0a0a !important;
        border: 2px solid rgba(212,175,55,0.5) !important;
        border-radius: 50% !important;
        cursor: pointer;
        font-size: 20px;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: all 0.3s;
        padding: 0 !important;
        line-height: 1;
        overflow: hidden;
    }

    .dh-pais-btn:hover {
        border-color: #d4af37 !important;
        transform: scale(1.1);
    }

    .dh-bandera-emoji {
        font-size: 20px;
        line-height: 1;
        display: block;
    }

    .dh-pais-dropdown {
        position: absolute;
        top: 45px;
        right: 0;
        background: #0a0a0a;
        border: 1px solid rgba(212,175,55,0.4);
        border-radius: 12px;
        padding: 10px 0;
        display: none;
        min-width: 180px;
        max-height: 350px;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        z-index: 9999999;
    }

    .dh-pais-dropdown.visible {
        display: block;
    }

    .dh-pais-titulo {
        padding: 8px 15px 10px;
        font-size: 11px;
        color: rgba(255,255,255,0.5);
        letter-spacing: 1px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        margin-bottom: 5px;
        text-transform: uppercase;
    }

    .dh-pais-dropdown a {
        display: block;
        padding: 8px 15px;
        color: rgba(255,255,255,0.85);
        text-decoration: none;
        font-size: 14px;
        transition: all 0.2s;
        white-space: nowrap;
    }

    .dh-pais-dropdown a:hover {
        background: rgba(212,175,55,0.15);
        color: #d4af37;
    }

    .dh-pais-dropdown a.active {
        color: #d4af37;
        font-weight: 600;
        background: rgba(212,175,55,0.1);
    }

    /* Scrollbar del dropdown */
    .dh-pais-dropdown::-webkit-scrollbar {
        width: 6px;
    }
    .dh-pais-dropdown::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.05);
    }
    .dh-pais-dropdown::-webkit-scrollbar-thumb {
        background: rgba(212,175,55,0.4);
        border-radius: 3px;
    }

    /* ═══════════════════════════════════════════════════════════════
       iOS Safe Area
       ═══════════════════════════════════════════════════════════════ */

    @supports (padding-top: env(safe-area-inset-top)) {
        .dh-header {
            padding-top: env(safe-area-inset-top);
            height: calc(60px + env(safe-area-inset-top));
        }

        #dh-spacer {
            height: calc(60px + env(safe-area-inset-top));
        }

        @media (min-width: 1100px) {
            .dh-header {
                height: calc(70px + env(safe-area-inset-top));
            }

            #dh-spacer {
                height: calc(70px + env(safe-area-inset-top));
            }
        }
    }
    </style>

    <!-- SPACER -->
    <div id="dh-spacer"></div>

    <!-- HEADER -->
    <header class="dh-header" id="duendesHeaderUniversal">

        <!-- IZQUIERDA - Logo -->
        <div class="dh-left">
            <a href="<?php echo esc_url($home); ?>" class="dh-logo">
                <span class="dh-logo-text">Duendes del Uruguay</span>
                <span class="dh-logo-tagline">Canalizados para vos</span>
            </a>

            <!-- Links desktop - Menu de WordPress -->
            <nav class="dh-desktop-nav dh-desktop-only">
            <?php
            wp_nav_menu([
                'theme_location' => 'duendes-menu-principal',
                'container' => false,
                'menu_class' => 'dh-menu-list',
                'fallback_cb' => function() {
                    // Fallback si no hay menu asignado
                    echo '<a href="' . home_url('/') . '" class="dh-nav-link">Inicio</a>';
                    echo '<a href="' . home_url('/shop/') . '" class="dh-nav-link">Tienda</a>';
                },
                'items_wrap' => '%3$s',
                'walker' => new class extends Walker_Nav_Menu {
                    function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
                        $output .= '<a href="' . esc_url($item->url) . '" class="dh-nav-link">' . esc_html($item->title) . '</a>';
                    }
                }
            ]);
            ?>
            </nav>
        </div>

        <!-- DERECHA - Iconos + Hamburguesa -->
        <div class="dh-right">
            <a href="https://magia.duendesdeluruguay.com" class="dh-text-link dh-desktop-only">Mi Magia</a>

            <!-- Selector de País -->
            <?php
            // Obtener país de cookie o detectar por IP
            $pais_actual = isset($_COOKIE['duendes_pais']) ? sanitize_text_field($_COOKIE['duendes_pais']) : '';

            // Si no hay cookie, intentar detectar (el plugin de precios lo hace)
            if (empty($pais_actual) && function_exists('duendes_detectar_pais')) {
                $pais_actual = duendes_detectar_pais();
            }
            if (empty($pais_actual)) {
                $pais_actual = 'US';
            }

            // Banderas con imágenes SVG para evitar problemas de renderizado de emojis
            $banderas_header = [
                'UY' => ['emoji' => '🇺🇾', 'img' => 'uy'],
                'AR' => ['emoji' => '🇦🇷', 'img' => 'ar'],
                'MX' => ['emoji' => '🇲🇽', 'img' => 'mx'],
                'CO' => ['emoji' => '🇨🇴', 'img' => 'co'],
                'CL' => ['emoji' => '🇨🇱', 'img' => 'cl'],
                'PE' => ['emoji' => '🇵🇪', 'img' => 'pe'],
                'BR' => ['emoji' => '🇧🇷', 'img' => 'br'],
                'ES' => ['emoji' => '🇪🇸', 'img' => 'es'],
                'US' => ['emoji' => '🇺🇸', 'img' => 'us'],
                'CA' => ['emoji' => '🇨🇦', 'img' => 'ca'],
                'GB' => ['emoji' => '🇬🇧', 'img' => 'gb'],
                'FR' => ['emoji' => '🇫🇷', 'img' => 'fr'],
                'DE' => ['emoji' => '🇩🇪', 'img' => 'de'],
                'IT' => ['emoji' => '🇮🇹', 'img' => 'it'],
                'PT' => ['emoji' => '🇵🇹', 'img' => 'pt'],
                'EC' => ['emoji' => '🇪🇨', 'img' => 'ec'],
                'VE' => ['emoji' => '🇻🇪', 'img' => 've'],
                'BO' => ['emoji' => '🇧🇴', 'img' => 'bo'],
                'PY' => ['emoji' => '🇵🇾', 'img' => 'py'],
                'CR' => ['emoji' => '🇨🇷', 'img' => 'cr'],
                'PA' => ['emoji' => '🇵🇦', 'img' => 'pa'],
                'GT' => ['emoji' => '🇬🇹', 'img' => 'gt'],
                'DO' => ['emoji' => '🇩🇴', 'img' => 'do'],
                'PR' => ['emoji' => '🇵🇷', 'img' => 'pr'],
                'CU' => ['emoji' => '🇨🇺', 'img' => 'cu'],
                'XX' => ['emoji' => '🌎', 'img' => 'world'],
            ];
            $nombres_paises = [
                'UY' => 'Uruguay',
                'AR' => 'Argentina',
                'MX' => 'México',
                'CO' => 'Colombia',
                'CL' => 'Chile',
                'PE' => 'Perú',
                'BR' => 'Brasil',
                'ES' => 'España',
                'US' => 'Estados Unidos',
                'CA' => 'Canadá',
                'GB' => 'Reino Unido',
                'FR' => 'Francia',
                'DE' => 'Alemania',
                'IT' => 'Italia',
                'PT' => 'Portugal',
                'EC' => 'Ecuador',
                'VE' => 'Venezuela',
                'BO' => 'Bolivia',
                'PY' => 'Paraguay',
                'CR' => 'Costa Rica',
                'PA' => 'Panamá',
                'GT' => 'Guatemala',
                'DO' => 'Rep. Dominicana',
                'PR' => 'Puerto Rico',
                'CU' => 'Cuba',
                'XX' => 'Otro país',
            ];

            $bandera_actual = $banderas_header[$pais_actual]['emoji'] ?? '🌎';
            ?>
            <div class="dh-pais-selector">
                <button class="dh-pais-btn" id="dhPaisBtn" title="Cambiar país">
                    <span class="dh-bandera-emoji"><?php echo $bandera_actual; ?></span>
                </button>
                <div class="dh-pais-dropdown" id="dhPaisDropdown">
                    <div class="dh-pais-titulo">Elegí tu país</div>
                    <?php foreach ($nombres_paises as $codigo => $nombre):
                        $bandera = $banderas_header[$codigo]['emoji'] ?? '🌎';
                    ?>
                        <a href="#" data-pais="<?php echo $codigo; ?>" class="<?php echo $codigo === $pais_actual ? 'active' : ''; ?>">
                            <?php echo $bandera . ' ' . $nombre; ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>

            <a href="<?php echo esc_url($account); ?>" class="dh-icon-link dh-desktop-only" title="Mi Cuenta">
                <svg class="dh-icon" viewBox="0 0 24 24" stroke-width="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            </a>

            <!-- Carrito removido - usar el de FunnelKit en el menú -->

            <!-- Hamburguesa (solo móvil) -->
            <div class="dh-hamburger" id="dhHamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </header>

    <!-- MENU MOVIL -->
    <div class="dh-mobile-menu" id="dhMobileMenu">
        <!-- Botón cerrar visible -->
        <div class="dh-close-btn" id="dhCloseMenu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>Cerrar</span>
        </div>

        <!-- Menu Mobile de WordPress -->
        <?php
        wp_nav_menu([
            'theme_location' => 'duendes-menu-mobile',
            'container' => false,
            'menu_class' => 'dh-mobile-nav',
            'fallback_cb' => function() use ($home, $shop, $account, $cart, $cart_count) {
                // Fallback si no hay menu asignado
                echo '<a href="' . esc_url($home) . '">Inicio</a>';
                echo '<a href="' . esc_url($shop) . '">Tienda</a>';
                echo '<a href="' . esc_url(home_url('/como-funciona/')) . '">Como Funciona</a>';
                echo '<a href="' . esc_url(home_url('/nosotros/')) . '">Nosotros</a>';
            },
            'items_wrap' => '%3$s',
            'walker' => new class extends Walker_Nav_Menu {
                function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
                    $classes = '';
                    if (in_array('dh-mi-magia', $item->classes)) {
                        $classes = ' class="dh-mi-magia-link"';
                    }
                    $output .= '<a href="' . esc_url($item->url) . '"' . $classes . '>' . esc_html($item->title) . '</a>';
                }
            }
        ]);
        ?>

        <div class="dh-mobile-divider"></div>

        <!-- Mi Magia - destacado -->
        <a href="https://magia.duendesdeluruguay.com" class="dh-mi-magia-link">✦ Mi Magia</a>

        <div class="dh-mobile-divider"></div>

        <!-- Links fijos -->
        <a href="<?php echo esc_url($account); ?>">Mi Cuenta</a>
        <a href="<?php echo esc_url($cart); ?>">Carrito<?php if ($cart_count) echo " ($cart_count)"; ?></a>

        <div class="dh-mobile-divider"></div>

        <!-- Legal -->
        <a href="<?php echo esc_url(home_url('/terminos/')); ?>" class="dh-small-link">Términos</a>
        <a href="<?php echo esc_url(home_url('/politica-de-privacidad/')); ?>" class="dh-small-link">Privacidad</a>
    </div>

    <script>
    (function() {
        var hamburger = document.getElementById('dhHamburger');
        var menu = document.getElementById('dhMobileMenu');
        var closeBtn = document.getElementById('dhCloseMenu');

        function cerrarMenu() {
            if (hamburger) hamburger.classList.remove('active');
            if (menu) menu.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (hamburger && menu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                menu.classList.toggle('active');
                document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
            });

            // Botón X para cerrar
            if (closeBtn) {
                closeBtn.addEventListener('click', cerrarMenu);
            }

            // Cerrar al hacer click en un link
            menu.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', cerrarMenu);
            });
        }

        // Actualizar carrito con AJAX
        if (typeof jQuery !== 'undefined') {
            jQuery(document.body).on('added_to_cart removed_from_cart updated_cart_totals', function() {
                jQuery.get('<?php echo admin_url('admin-ajax.php'); ?>?action=duendes_get_cart_count', function(count) {
                    var badge = document.querySelector('.dh-cart-badge');
                    if (badge) {
                        badge.textContent = count > 0 ? count : '';
                        badge.dataset.count = count;
                    }
                });
            });
        }

        // Selector de país
        var paisBtn = document.getElementById('dhPaisBtn');
        var paisDropdown = document.getElementById('dhPaisDropdown');

        if (paisBtn && paisDropdown) {
            paisBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                paisDropdown.classList.toggle('visible');
            });

            paisDropdown.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    var pais = this.dataset.pais;
                    document.cookie = 'duendes_pais=' + pais + '; path=/; max-age=' + (365*24*60*60);
                    location.reload();
                });
            });

            document.addEventListener('click', function(e) {
                if (!e.target.closest('.dh-pais-selector')) {
                    paisDropdown.classList.remove('visible');
                }
            });
        }
        // Sync bandera
        var bm={'UY':'🇺🇾','AR':'🇦🇷','MX':'🇲🇽','CO':'🇨🇴','CL':'🇨🇱','PE':'🇵🇪','BR':'🇧🇷','ES':'🇪🇸','US':'🇺🇸','XX':'🌎'};
        var cm=document.cookie.match(/duendes_pais=([^;]+)/);
        if(cm){var be=document.querySelector('.dh-bandera-emoji');if(be)be.textContent=bm[cm[1]]||'🌎';}
    })();
    </script>
    <?php
}

// AJAX para actualizar contador del carrito
add_action('wp_ajax_duendes_get_cart_count', 'duendes_ajax_cart_count');
add_action('wp_ajax_nopriv_duendes_get_cart_count', 'duendes_ajax_cart_count');

function duendes_ajax_cart_count() {
    $count = 0;
    if (function_exists('WC') && WC()->cart) {
        $count = WC()->cart->get_cart_contents_count();
    }
    echo $count;
    wp_die();
}

// Ocultar TODOS los headers viejos
add_action('wp_head', function() {
    ?>
    <style id="duendes-hide-old-headers">
    /* Ocultar TODO header viejo */
    .elementor-location-header,
    [data-elementor-type="header"],
    [data-elementor-type="twbb_header"],
    header:not(.dh-header),
    .duendes-header:not(.dh-header),
    #duendesHeader:not(#duendesHeaderUniversal),
    .mobile-menu:not(.dh-mobile-menu),
    .mobile-overlay,
    .site-header:not(.dh-header) {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        left: -9999px !important;
    }

    html, body {
        background: #0a0a0a !important;
    }
    </style>
    <?php
}, 99999);

// Eliminar headers viejos del DOM
add_action('wp_footer', function() {
    ?>
    <script>
    (function() {
        var selectores = [
            '.elementor-location-header',
            '[data-elementor-type="header"]',
            '[data-elementor-type="twbb_header"]',
            'header:not(.dh-header)',
            '.duendes-header:not(.dh-header)',
            '#duendesHeader:not(#duendesHeaderUniversal)',
            '.mobile-menu:not(.dh-mobile-menu)',
            '.mobile-overlay'
        ];

        selectores.forEach(function(sel) {
            document.querySelectorAll(sel).forEach(function(el) {
                if (el && el.id !== 'duendesHeaderUniversal' && !el.classList.contains('dh-header') && !el.classList.contains('dh-mobile-menu')) {
                    el.remove();
                }
            });
        });
    })();
    </script>
    <?php
}, 1);

// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// OVERLAY DE BIENVENIDA - SIMPLE Y ROBUSTO
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_footer', 'duendes_overlay_bienvenida', 5);

function duendes_overlay_bienvenida() {
    if (!empty($_COOKIE['duendes_pais'])) {
        return;
    }
    ?>
    <div id="dob-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:#0a0a0a;z-index:9999999;display:flex;align-items:center;justify-content:center;">

        <!-- Fase 1: Texto -->
        <div id="dob-texto" style="text-align:center;padding:40px;">
            <p style="color:#d4af37;font-family:Cinzel,serif;font-size:clamp(1.4rem,5vw,2.4rem);margin:0;opacity:0;animation:dobFade 1s ease .3s forwards;">Sentiste el llamado.</p>
            <p style="color:rgba(255,255,255,.7);font-family:Cormorant Garamond,serif;font-size:clamp(1rem,3vw,1.4rem);margin-top:20px;font-style:italic;opacity:0;animation:dobFade 1s ease 1.3s forwards;">Y tu guardián ya lo sabe.</p>
        </div>

        <!-- Fase 2: Confirmación -->
        <div id="dob-confirmar" style="text-align:center;padding:40px;display:none;">
            <p style="color:rgba(255,255,255,.5);font-family:Cormorant Garamond,serif;font-size:1rem;margin:0 0 15px;font-style:italic;">Detectamos que estás en</p>
            <p style="color:#d4af37;font-family:Cinzel,serif;font-size:clamp(1.8rem,7vw,3rem);margin:0 0 45px;"><span id="dob-bandera">🌎</span> <span id="dob-pais">...</span></p>
            <div style="display:flex;flex-direction:column;gap:12px;max-width:260px;margin:0 auto;">
                <a href="#" id="dob-si" style="display:block;padding:14px 28px;background:transparent;border:1px solid #d4af37;color:#d4af37;font-family:Cinzel,serif;font-size:.85rem;letter-spacing:2px;text-transform:uppercase;text-decoration:none;text-align:center;">Sí, es correcto</a>
                <a href="#" id="dob-cambiar" style="display:block;padding:10px 20px;background:transparent;border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.4);font-family:Cinzel,serif;font-size:.75rem;letter-spacing:1px;text-transform:uppercase;text-decoration:none;text-align:center;">Cambiar país</a>
            </div>
        </div>

        <!-- Fase 3: Buscador -->
        <div id="dob-buscar" style="text-align:center;padding:40px;display:none;width:100%;max-width:400px;">
            <p style="color:#d4af37;font-family:Cinzel,serif;font-size:clamp(1.1rem,4vw,1.5rem);margin:0 0 25px;">¿Desde dónde nos visitás?</p>
            <input type="text" id="dob-input" placeholder="Escribí tu país..." style="width:100%;max-width:300px;padding:14px;background:transparent;border:1px solid rgba(212,175,55,.3);color:#fff;font-family:Cormorant Garamond,serif;font-size:1.1rem;text-align:center;outline:none;">
            <div id="dob-lista" style="max-height:260px;overflow-y:auto;margin-top:15px;"></div>
            <p style="color:rgba(255,255,255,.25);font-family:Cormorant Garamond,serif;font-size:.8rem;margin-top:25px;font-style:italic;">Esto nos ayuda a mostrarte precios en tu moneda</p>
        </div>
    </div>

    <style>
    @keyframes dobFade { from{opacity:0;transform:translateY(15px)} to{opacity:1;transform:translateY(0)} }
    #dob-si:hover { background:#d4af37 !important; color:#0a0a0a !important; }
    #dob-cambiar:hover { border-color:rgba(255,255,255,.3) !important; color:rgba(255,255,255,.7) !important; }
    #dob-input:focus { border-color:#d4af37 !important; }
    .dob-item { padding:12px 18px; background:transparent; border:1px solid rgba(212,175,55,.12); color:rgba(255,255,255,.8); font-family:Cormorant Garamond,serif; font-size:1rem; cursor:pointer; display:flex; align-items:center; gap:12px; margin-bottom:6px; }
    .dob-item:hover { border-color:#d4af37; background:rgba(212,175,55,.05); }
    </style>

    <script>
    (function(){
        // Si ya tiene cookie, ocultar y salir
        if (document.cookie.indexOf('duendes_pais=') !== -1) {
            var o = document.getElementById('dob-overlay');
            if (o) o.style.display = 'none';
            return;
        }

        var paises = [
            ['UY','Uruguay','🇺🇾'],['AR','Argentina','🇦🇷'],['MX','México','🇲🇽'],
            ['CO','Colombia','🇨🇴'],['CL','Chile','🇨🇱'],['PE','Perú','🇵🇪'],
            ['BR','Brasil','🇧🇷'],['EC','Ecuador','🇪🇨'],['VE','Venezuela','🇻🇪'],
            ['BO','Bolivia','🇧🇴'],['PY','Paraguay','🇵🇾'],['ES','España','🇪🇸'],
            ['US','Estados Unidos','🇺🇸'],['CA','Canadá','🇨🇦'],['FR','Francia','🇫🇷'],
            ['DE','Alemania','🇩🇪'],['IT','Italia','🇮🇹'],['PT','Portugal','🇵🇹'],
            ['GB','Reino Unido','🇬🇧'],['AU','Australia','🇦🇺'],['XX','Otro país','🌎']
        ];

        var paisesObj = {};
        paises.forEach(function(p) { paisesObj[p[0]] = p; });

        var paisElegido = null;

        function guardar(codigo) {
            var d = new Date();
            d.setFullYear(d.getFullYear() + 1);
            document.cookie = 'duendes_pais=' + codigo + '; expires=' + d.toUTCString() + '; path=/';

            // Ocultar overlay
            var o = document.getElementById('dob-overlay');
            if (o) o.style.display = 'none';
            document.body.style.overflow = '';

            // Recargar
            window.location.href = window.location.href;
        }

        function mostrar(id) {
            ['dob-texto','dob-confirmar','dob-buscar'].forEach(function(x) {
                var el = document.getElementById(x);
                if (el) el.style.display = 'none';
            });
            var el = document.getElementById(id);
            if (el) el.style.display = 'block';
        }

        function confirmar(codigo, nombre, bandera) {
            paisElegido = codigo;
            document.getElementById('dob-bandera').textContent = bandera;
            document.getElementById('dob-pais').textContent = nombre;
            mostrar('dob-confirmar');
        }

        function listar(filtro) {
            var html = '';
            var f = (filtro || '').toLowerCase();
            paises.forEach(function(p) {
                if (!f || p[1].toLowerCase().indexOf(f) !== -1) {
                    html += '<div class="dob-item" data-c="'+p[0]+'"><span style="font-size:1.3rem">'+p[2]+'</span>'+p[1]+'</div>';
                }
            });
            document.getElementById('dob-lista').innerHTML = html;
            document.querySelectorAll('.dob-item').forEach(function(el) {
                el.onclick = function() { guardar(this.dataset.c); };
            });
        }

        // Eventos
        document.getElementById('dob-si').onclick = function(e) {
            e.preventDefault();
            if (paisElegido) guardar(paisElegido);
        };

        document.getElementById('dob-cambiar').onclick = function(e) {
            e.preventDefault();
            mostrar('dob-buscar');
            listar('');
            document.getElementById('dob-input').focus();
        };

        document.getElementById('dob-input').oninput = function() {
            listar(this.value);
        };

        // Bloquear scroll
        document.body.style.overflow = 'hidden';

        // Después de 1s, detectar país
        setTimeout(function() {
            mostrar('dob-confirmar');

            // Detectar con ipinfo.io
            fetch('https://ipinfo.io/json')
            .then(function(r) { return r.json(); })
            .then(function(data) {
                var p = paisesObj[data.country];
                if (p) {
                    confirmar(p[0], p[1], p[2]);
                } else {
                    mostrar('dob-buscar');
                    listar('');
                }
            })
            .catch(function() {
                mostrar('dob-buscar');
                listar('');
            });
        }, 1000);
    })();
    </script>
    <?php
}
