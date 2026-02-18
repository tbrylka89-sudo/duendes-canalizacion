<?php
/**
 * Plugin Name: Duendes FunnelKit Tags
 * Description: Auto-tagging de clientes para segmentación en FunnelKit
 * Version: 1.1
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

/**
 * TAGS QUE SE CREAN:
 * - compro_mini, compro_pixie, compro_mediano, compro_grande, compro_gigante
 * - compro_proteccion, compro_amor, compro_abundancia, compro_sanacion, compro_sabiduria
 * - cliente_recurrente (2+ compras)
 * - cliente_internacional, cliente_uruguay
 */

// =============================================================================
// TAGEAR CLIENTE CUANDO COMPLETA UNA ORDEN
// =============================================================================

add_action('woocommerce_order_status_completed', 'duendes_fk_auto_tag_cliente', 10, 1);
add_action('woocommerce_order_status_processing', 'duendes_fk_auto_tag_cliente', 10, 1);

if (!function_exists('duendes_fk_auto_tag_cliente')) {
    function duendes_fk_auto_tag_cliente($order_id) {
        $order = wc_get_order($order_id);
        if (!$order) return;

        $email = $order->get_billing_email();
        $pais = $order->get_billing_country();

        if (!$email) return;

        $tags_a_agregar = [];

        // =========================================================================
        // 1. TAGS POR TAMAÑO DE GUARDIÁN
        // =========================================================================
        foreach ($order->get_items() as $item) {
            $product_id = $item->get_product_id();
            $product = wc_get_product($product_id);

            if (!$product) continue;

            // Detectar tamaño por categoría o meta
            $tamano = duendes_fk_detectar_tamano($product_id);
            if ($tamano) {
                $tags_a_agregar[] = 'compro_' . $tamano;
            }

            // =====================================================================
            // 2. TAGS POR INTENCIÓN (CATEGORÍA)
            // =====================================================================
            $categorias = wp_get_post_terms($product_id, 'product_cat', ['fields' => 'slugs']);

            $intenciones_map = [
                'proteccion' => 'compro_proteccion',
                'amor' => 'compro_amor',
                'dinero-abundancia-negocios' => 'compro_abundancia',
                'salud' => 'compro_sanacion',
                'sabiduria-guia-claridad' => 'compro_sabiduria',
            ];

            foreach ($categorias as $cat_slug) {
                if (isset($intenciones_map[$cat_slug])) {
                    $tags_a_agregar[] = $intenciones_map[$cat_slug];
                }
            }
        }

        // =========================================================================
        // 3. TAG POR UBICACIÓN
        // =========================================================================
        if ($pais === 'UY') {
            $tags_a_agregar[] = 'cliente_uruguay';
        } else {
            $tags_a_agregar[] = 'cliente_internacional';
        }

        // =========================================================================
        // 4. TAG CLIENTE RECURRENTE (2+ COMPRAS)
        // =========================================================================
        $ordenes_anteriores = wc_get_orders([
            'customer' => $email,
            'status' => ['completed', 'processing'],
            'limit' => 5,
        ]);

        if (count($ordenes_anteriores) >= 2) {
            $tags_a_agregar[] = 'cliente_recurrente';
        }

        // =========================================================================
        // GUARDAR TAGS
        // =========================================================================
        $tags_a_agregar = array_unique($tags_a_agregar);

        // Intentar con FunnelKit si está activo
        if (function_exists('bwfan_add_contact_tags')) {
            foreach ($tags_a_agregar as $tag) {
                bwfan_add_contact_tags($email, [$tag]);
            }
        }

        // También guardar en user meta si está registrado
        $user = get_user_by('email', $email);
        if ($user) {
            $tags_existentes = get_user_meta($user->ID, '_duendes_tags', true) ?: [];
            $tags_nuevos = array_unique(array_merge($tags_existentes, $tags_a_agregar));
            update_user_meta($user->ID, '_duendes_tags', $tags_nuevos);
        }

        // Guardar en order meta para referencia
        update_post_meta($order_id, '_duendes_tags_aplicados', $tags_a_agregar);

        // Log para debugging
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log("Duendes Tags: Cliente $email - Tags: " . implode(', ', $tags_a_agregar));
        }
    }
}

// =============================================================================
// DETECTAR TAMAÑO DEL PRODUCTO (nombre único para evitar conflictos)
// =============================================================================

if (!function_exists('duendes_fk_detectar_tamano')) {
    function duendes_fk_detectar_tamano($product_id) {
        // Primero buscar en categorías
        $categorias = wp_get_post_terms($product_id, 'product_cat', ['fields' => 'slugs']);

        $tamanos_map = [
            'mini' => 'mini',
            'minis' => 'mini',
            'pixie' => 'pixie',
            'pixies' => 'pixie',
            'mediano' => 'mediano',
            'medianos' => 'mediano',
            'grande' => 'grande',
            'grandes' => 'grande',
            'gigante' => 'gigante',
            'gigantes' => 'gigante',
        ];

        foreach ($categorias as $cat_slug) {
            if (isset($tamanos_map[$cat_slug])) {
                return $tamanos_map[$cat_slug];
            }
        }

        // Si no hay categoría, buscar en el precio
        $product = wc_get_product($product_id);
        if (!$product) return null;

        $precio = floatval($product->get_price());

        // Rangos aproximados por precio USD
        if ($precio <= 35) return 'mini';
        if ($precio <= 55) return 'pixie';
        if ($precio <= 90) return 'mediano';
        if ($precio <= 130) return 'grande';
        return 'gigante';
    }
}

// =============================================================================
// TAG DE CARRITO ABANDONADO
// =============================================================================

add_action('duendes_carrito_abandonado_detectado', 'duendes_fk_tag_carrito_abandonado', 10, 1);

if (!function_exists('duendes_fk_tag_carrito_abandonado')) {
    function duendes_fk_tag_carrito_abandonado($email) {
        if (!$email) return;

        // FunnelKit
        if (function_exists('bwfan_add_contact_tags')) {
            bwfan_add_contact_tags($email, ['abandono_carrito']);
        }

        // User meta
        $user = get_user_by('email', $email);
        if ($user) {
            $tags_existentes = get_user_meta($user->ID, '_duendes_tags', true) ?: [];
            if (!in_array('abandono_carrito', $tags_existentes)) {
                $tags_existentes[] = 'abandono_carrito';
                update_user_meta($user->ID, '_duendes_tags', $tags_existentes);
            }
        }
    }
}

// =============================================================================
// QUITAR TAG DE ABANDONO CUANDO COMPRA
// =============================================================================

add_action('woocommerce_order_status_completed', 'duendes_fk_quitar_tag_abandono', 20, 1);

if (!function_exists('duendes_fk_quitar_tag_abandono')) {
    function duendes_fk_quitar_tag_abandono($order_id) {
        $order = wc_get_order($order_id);
        if (!$order) return;

        $email = $order->get_billing_email();
        if (!$email) return;

        // FunnelKit
        if (function_exists('bwfan_remove_contact_tags')) {
            bwfan_remove_contact_tags($email, ['abandono_carrito']);
        }

        // User meta
        $user = get_user_by('email', $email);
        if ($user) {
            $tags = get_user_meta($user->ID, '_duendes_tags', true) ?: [];
            $tags = array_diff($tags, ['abandono_carrito']);
            update_user_meta($user->ID, '_duendes_tags', array_values($tags));
        }
    }
}

// =============================================================================
// ENDPOINT PARA VER TAGS DE UN CLIENTE (ADMIN ONLY)
// =============================================================================

add_action('rest_api_init', function() {
    register_rest_route('duendes/v1', '/cliente-tags/(?P<email>.+)', [
        'methods' => 'GET',
        'callback' => 'duendes_fk_get_cliente_tags',
        'permission_callback' => function() {
            return current_user_can('manage_woocommerce');
        }
    ]);
});

if (!function_exists('duendes_fk_get_cliente_tags')) {
    function duendes_fk_get_cliente_tags($request) {
        $email = sanitize_email($request['email']);

        $user = get_user_by('email', $email);
        $tags_user = $user ? (get_user_meta($user->ID, '_duendes_tags', true) ?: []) : [];

        // Buscar también en órdenes
        $ordenes = wc_get_orders([
            'customer' => $email,
            'status' => ['completed', 'processing'],
            'limit' => 10,
        ]);

        $tags_ordenes = [];
        foreach ($ordenes as $orden) {
            $tags_orden = get_post_meta($orden->get_id(), '_duendes_tags_aplicados', true) ?: [];
            $tags_ordenes = array_merge($tags_ordenes, $tags_orden);
        }

        return [
            'email' => $email,
            'tags_usuario' => $tags_user,
            'tags_ordenes' => array_unique($tags_ordenes),
            'total_ordenes' => count($ordenes),
        ];
    }
}

// =============================================================================
// MOSTRAR TAGS EN ORDEN (ADMIN)
// =============================================================================

add_action('woocommerce_admin_order_data_after_billing_address', 'duendes_fk_mostrar_tags_en_orden');

if (!function_exists('duendes_fk_mostrar_tags_en_orden')) {
    function duendes_fk_mostrar_tags_en_orden($order) {
        $tags = get_post_meta($order->get_id(), '_duendes_tags_aplicados', true);

        if (!empty($tags) && is_array($tags)) {
            echo '<p><strong>Tags aplicados:</strong><br>';
            foreach ($tags as $tag) {
                $color = strpos($tag, 'proteccion') !== false ? '#9370db' :
                        (strpos($tag, 'amor') !== false ? '#ff6b6b' :
                        (strpos($tag, 'abundancia') !== false ? '#c9a227' :
                        (strpos($tag, 'uruguay') !== false ? '#4ecdc4' : '#666')));
                echo '<span style="display:inline-block;background:'.$color.';color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;margin:2px;">' . esc_html($tag) . '</span>';
            }
            echo '</p>';
        }
    }
}

// =============================================================================
// GUARDAR TAGS EN OPCIÓN (para referencia, no necesita activation hook en mu-plugins)
// =============================================================================

add_action('init', function() {
    if (get_option('duendes_tags_segmentacion_initialized')) return;

    $tags_requeridos = [
        'compro_mini',
        'compro_pixie',
        'compro_mediano',
        'compro_grande',
        'compro_gigante',
        'compro_proteccion',
        'compro_amor',
        'compro_abundancia',
        'compro_sanacion',
        'compro_sabiduria',
        'abandono_carrito',
        'cliente_recurrente',
        'cliente_internacional',
        'cliente_uruguay',
    ];

    // Si FunnelKit está activo, crear tags
    if (function_exists('bwfan_create_tag')) {
        foreach ($tags_requeridos as $tag) {
            bwfan_create_tag($tag);
        }
    }

    // Guardar lista de tags para referencia
    update_option('duendes_tags_segmentacion', $tags_requeridos);
    update_option('duendes_tags_segmentacion_initialized', true);
}, 999);
