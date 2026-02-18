<?php
/**
 * Plugin Name: Duendes - Header con Menus WordPress
 * Description: Registra ubicaciones de menu para el header
 * Version: 1.1
 */

if (!defined('ABSPATH')) exit;

// Desregistrar menus del tema que no usamos
add_action('after_setup_theme', function() {
    // Primero desregistrar los menus viejos del tema
    unregister_nav_menu('primary');
    unregister_nav_menu('secondary');
    unregister_nav_menu('menu-1');
    unregister_nav_menu('menu-2');
    unregister_nav_menu('menu-3');
    unregister_nav_menu('menu-4');
    unregister_nav_menu('footer');
    unregister_nav_menu('footer-menu');
    unregister_nav_menu('social');
}, 100);

// Registrar SOLO nuestras ubicaciones de menu
add_action('after_setup_theme', function() {
    register_nav_menus([
        'duendes-menu-principal' => 'Menu Principal (Header)',
        'duendes-menu-mobile' => 'Menu Mobile (Hamburguesa)',
    ]);
}, 101);

// Crear menus por defecto si no existen
add_action('init', function() {
    // Solo ejecutar una vez
    if (get_option('duendes_menus_creados')) return;

    // Crear menu principal
    $menu_principal_id = wp_create_nav_menu('Menu Header Duendes');
    if (!is_wp_error($menu_principal_id)) {
        // Agregar items por defecto
        $items = [
            ['title' => 'Inicio', 'url' => home_url('/')],
            ['title' => 'Tienda', 'url' => home_url('/shop/')],
            ['title' => 'Test del Guardian', 'url' => home_url('/descubri-que-duende-te-elige/')],
            ['title' => 'Reviews', 'url' => home_url('/testimonios/')],
            ['title' => 'Como Funciona', 'url' => home_url('/como-funciona/')],
            ['title' => 'Nosotros', 'url' => home_url('/nosotros/')],
        ];

        foreach ($items as $item) {
            wp_update_nav_menu_item($menu_principal_id, 0, [
                'menu-item-title' => $item['title'],
                'menu-item-url' => $item['url'],
                'menu-item-status' => 'publish',
                'menu-item-type' => 'custom',
            ]);
        }

        // Asignar a la ubicacion
        $locations = get_theme_mod('nav_menu_locations', []);
        $locations['duendes-menu-principal'] = $menu_principal_id;
        $locations['duendes-menu-mobile'] = $menu_principal_id;
        set_theme_mod('nav_menu_locations', $locations);
    }

    update_option('duendes_menus_creados', true);
});
