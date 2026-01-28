<?php
/**
 * Plugin Name: Duendes - Avisos Dinámicos en Carrito
 * Description: Muestra progreso hacia 3x2 y envío gratis con detección de país
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

define('DUENDES_ENVIO_GRATIS_USD', 1000);      // $1000 USD para internacional
define('DUENDES_ENVIO_GRATIS_UYU', 10000);     // $10.000 UYU para Uruguay
define('DUENDES_PROMO_3X2_MIN', 2);            // Mínimo 2 guardianes para 3x2

// ═══════════════════════════════════════════════════════════════════════════
// TABLA DE PRECIOS USD → UYU (fijos, no conversión)
// ═══════════════════════════════════════════════════════════════════════════

function duendes_avisos_usd_a_uyu($precio_usd) {
    // Si el precio viene muy alto, probablemente ya está en UYU
    if ($precio_usd > 1500) {
        $precio_usd = round($precio_usd / 43);
    }

    // Tabla de precios fijos
    if ($precio_usd <= 100) return 2500;       // Mini clásico ~$70 USD
    if ($precio_usd <= 175) return 5500;       // Pixie, Mini especial ~$150 USD
    if ($precio_usd <= 350) return 8000;       // Mediano ~$200 USD
    if ($precio_usd <= 800) return 16500;      // Grande ~$450 USD
    return 39800;                               // Gigante ~$1050 USD
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK PARA MOSTRAR AVISOS EN CARRITO
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_before_cart_table', 'duendes_mostrar_avisos_carrito', 5);
add_action('woocommerce_before_cart_collaterals', 'duendes_mostrar_avisos_carrito_inferior', 10);

function duendes_mostrar_avisos_carrito() {
    if (!WC()->cart) return;

    $info = duendes_calcular_info_carrito();

    // Contenedor principal de avisos
    echo '<div id="duendes-avisos-carrito" style="margin-bottom: 25px;">';

    // Aviso de 3x2
    duendes_mostrar_aviso_3x2($info);

    // Aviso de envío gratis
    duendes_mostrar_aviso_envio_gratis($info);

    echo '</div>';

    // Estilos
    duendes_avisos_styles();
}

function duendes_mostrar_avisos_carrito_inferior() {
    // Este hook se puede usar para avisos adicionales si se necesitan
}

// ═══════════════════════════════════════════════════════════════════════════
// CALCULAR INFO DEL CARRITO
// ═══════════════════════════════════════════════════════════════════════════

function duendes_calcular_info_carrito() {
    $cart = WC()->cart;
    $subtotal = floatval($cart->get_subtotal()); // Siempre en USD

    // Detectar país del cliente
    $pais = duendes_detectar_pais_cliente();
    $es_uruguay = ($pais === 'UY');

    // WooCommerce SIEMPRE opera en USD internamente
    // Para Uruguay, calcular el total UYU sumando cada producto con la tabla fija
    $total_usd = $subtotal;
    $total_uyu = 0;

    if ($es_uruguay) {
        // Calcular total UYU usando la tabla de precios fijos
        foreach ($cart->get_cart() as $item) {
            $product = $item['data'];
            $precio_usd = floatval($product->get_price());
            // Convertir a UYU con tabla fija
            $precio_uyu = duendes_avisos_usd_a_uyu($precio_usd);
            $total_uyu += $precio_uyu * $item['quantity'];
        }
    }

    // Contar guardianes (excluyendo minis gratis)
    $guardianes = 0;
    $minis_gratis = 0;

    foreach ($cart->get_cart() as $item) {
        if (!empty($item['duendes_mini_gratis'])) {
            $minis_gratis++;
            continue;
        }
        // No contar minis en el conteo de guardianes para la promo
        if (!has_term('mini', 'product_cat', $item['product_id'])) {
            $guardianes += $item['quantity'];
        }
    }

    // Calcular cuántos minis merecen
    $minis_merecidos = floor($guardianes / DUENDES_PROMO_3X2_MIN);

    // Cuánto falta para envío gratis
    if ($es_uruguay) {
        $falta_envio = max(0, DUENDES_ENVIO_GRATIS_UYU - $total_uyu);
        $umbral_envio = DUENDES_ENVIO_GRATIS_UYU;
        $moneda = 'UYU';
    } else {
        $falta_envio = max(0, DUENDES_ENVIO_GRATIS_USD - $total_usd);
        $umbral_envio = DUENDES_ENVIO_GRATIS_USD;
        $moneda = 'USD';
    }

    return [
        'guardianes' => $guardianes,
        'minis_gratis' => $minis_gratis,
        'minis_merecidos' => $minis_merecidos,
        'total_usd' => $total_usd,
        'total_uyu' => $total_uyu,
        'es_uruguay' => $es_uruguay,
        'pais' => $pais,
        'falta_envio' => $falta_envio,
        'umbral_envio' => $umbral_envio,
        'moneda' => $moneda,
        'envio_gratis' => $falta_envio <= 0
    ];
}

function duendes_detectar_pais_cliente() {
    // PRIMERO: usar la cookie de geolocalización (la más confiable)
    if (!empty($_COOKIE['duendes_pais'])) {
        return strtoupper(sanitize_text_field($_COOKIE['duendes_pais']));
    }

    // Segundo: desde la dirección de envío/facturación
    $pais = WC()->customer ? WC()->customer->get_billing_country() : '';
    if (empty($pais)) {
        $pais = WC()->customer ? WC()->customer->get_shipping_country() : '';
    }

    // Si aún no hay país, intentar geolocalización de WC
    if (empty($pais) && class_exists('WC_Geolocation')) {
        $geo = WC_Geolocation::geolocate_ip();
        $pais = $geo['country'] ?? '';
    }

    // Default: no es Uruguay (cobrar en USD)
    return !empty($pais) ? $pais : 'US';
}

// ═══════════════════════════════════════════════════════════════════════════
// AVISO DE PROMO 3x2
// ═══════════════════════════════════════════════════════════════════════════

function duendes_mostrar_aviso_3x2($info) {
    // Si la promo 3x2 no está activa, no mostrar
    if (!defined('DUENDES_PROMO_3X2_ACTIVA') || !DUENDES_PROMO_3X2_ACTIVA) {
        return;
    }

    $guardianes = $info['guardianes'];
    $minis_gratis = $info['minis_gratis'];
    $minis_merecidos = $info['minis_merecidos'];

    // Calcular cuántos guardianes faltan para el próximo mini
    $para_siguiente = DUENDES_PROMO_3X2_MIN - ($guardianes % DUENDES_PROMO_3X2_MIN);
    if ($para_siguiente == DUENDES_PROMO_3X2_MIN && $guardianes > 0) {
        $para_siguiente = 0; // Ya alcanzó el umbral
    }

    ?>
    <div class="duendes-aviso duendes-aviso-3x2">
        <div class="duendes-aviso-icono">3x2</div>
        <div class="duendes-aviso-contenido">
            <?php if ($guardianes == 0): ?>
                <span class="duendes-aviso-titulo">PROMO 3x2 ACTIVA</span>
                <span class="duendes-aviso-texto">Llevá 2 guardianes y te <strong>regalamos un mini</strong></span>
            <?php elseif ($guardianes == 1): ?>
                <span class="duendes-aviso-titulo">TE FALTA 1 GUARDIÁN</span>
                <span class="duendes-aviso-texto">Agregá otro y te <strong>regalamos un mini</strong></span>
            <?php elseif ($minis_gratis < $minis_merecidos): ?>
                <span class="duendes-aviso-titulo">TENÉS <?php echo $minis_merecidos - $minis_gratis; ?> MINI<?php echo ($minis_merecidos - $minis_gratis) > 1 ? 'S' : ''; ?> DE REGALO</span>
                <span class="duendes-aviso-texto">Elegí tu regalo en la sección de abajo</span>
            <?php elseif ($para_siguiente > 0): ?>
                <span class="duendes-aviso-titulo">PROMO 3x2</span>
                <span class="duendes-aviso-texto">Agregá <?php echo $para_siguiente; ?> guardián<?php echo $para_siguiente > 1 ? 'es' : ''; ?> más y te <strong>regalamos otro mini</strong></span>
            <?php else: ?>
                <span class="duendes-aviso-titulo">PROMO 3x2 APLICADA</span>
                <span class="duendes-aviso-texto">Ya tenés <?php echo $minis_gratis; ?> mini<?php echo $minis_gratis > 1 ? 's' : ''; ?> de regalo incluido<?php echo $minis_gratis > 1 ? 's' : ''; ?></span>
            <?php endif; ?>
        </div>
    </div>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// AVISO DE ENVÍO GRATIS
// ═══════════════════════════════════════════════════════════════════════════

function duendes_mostrar_aviso_envio_gratis($info) {
    $falta = $info['falta_envio'];
    $moneda = $info['moneda'];
    $es_uruguay = $info['es_uruguay'];
    $envio_gratis = $info['envio_gratis'];
    $total = $es_uruguay ? $info['total_uyu'] : $info['total_usd'];
    $umbral = $info['umbral_envio'];

    // Calcular porcentaje para la barra de progreso
    $porcentaje = min(100, ($total / $umbral) * 100);

    // Formatear montos
    if ($es_uruguay) {
        $falta_fmt = '$' . number_format($falta, 0, ',', '.') . ' pesos uruguayos';
        $umbral_fmt = '$' . number_format($umbral, 0, ',', '.') . ' UYU';
    } else {
        $falta_fmt = 'USD$' . number_format($falta, 0);
        $umbral_fmt = 'USD$' . number_format($umbral, 0);
    }

    ?>
    <div class="duendes-aviso duendes-aviso-envio <?php echo $envio_gratis ? 'duendes-aviso-logrado' : ''; ?>">
        <div class="duendes-aviso-icono"><?php echo $envio_gratis ? '✓' : '📦'; ?></div>
        <div class="duendes-aviso-contenido">
            <?php if ($envio_gratis): ?>
                <span class="duendes-aviso-titulo">ENVÍO GRATIS DESBLOQUEADO</span>
                <span class="duendes-aviso-texto"><?php echo $es_uruguay ? 'Envío gratis en Uruguay' : 'Envío internacional gratis por DHL Express'; ?></span>
            <?php elseif ($total == 0): ?>
                <span class="duendes-aviso-titulo">ENVÍO GRATIS EN COMPRAS DE <?php echo $umbral_fmt; ?>+</span>
                <span class="duendes-aviso-texto"><?php echo $es_uruguay ? 'Para envíos en Uruguay' : 'Envío internacional por DHL Express'; ?></span>
            <?php else: ?>
                <span class="duendes-aviso-titulo">TE FALTAN <?php echo $falta_fmt; ?> PARA ENVÍO GRATIS</span>
                <span class="duendes-aviso-texto">Agregá un guardián más y llegás al envío gratis</span>

                <!-- Barra de progreso -->
                <div class="duendes-progreso-barra">
                    <div class="duendes-progreso-fill" style="width: <?php echo $porcentaje; ?>%"></div>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════════════════

function duendes_avisos_styles() {
    ?>
    <style>
        #duendes-avisos-carrito {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .duendes-aviso {
            display: flex;
            align-items: center;
            gap: 15px;
            background: linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%);
            border: 1px solid rgba(201, 162, 39, 0.3);
            border-radius: 12px;
            padding: 15px 20px;
            transition: all 0.3s ease;
        }

        .duendes-aviso:hover {
            border-color: rgba(201, 162, 39, 0.5);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }

        .duendes-aviso-logrado {
            border-color: rgba(39, 201, 100, 0.5) !important;
            background: linear-gradient(145deg, #0a1a0a 0%, #1a2a1a 100%) !important;
        }

        .duendes-aviso-icono {
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, #c9a227 0%, #8b6914 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Cinzel', serif;
            font-size: 14px;
            font-weight: 700;
            color: #0a0a0a;
            flex-shrink: 0;
            box-shadow: 0 3px 10px rgba(201, 162, 39, 0.3);
        }

        .duendes-aviso-logrado .duendes-aviso-icono {
            background: linear-gradient(135deg, #27c964 0%, #1a8f47 100%);
            box-shadow: 0 3px 10px rgba(39, 201, 100, 0.3);
        }

        .duendes-aviso-contenido {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .duendes-aviso-titulo {
            font-family: 'Cinzel', serif;
            font-size: 13px;
            font-weight: 600;
            color: #c9a227;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .duendes-aviso-logrado .duendes-aviso-titulo {
            color: #27c964;
        }

        .duendes-aviso-texto {
            font-family: 'Cormorant Garamond', serif;
            font-size: 15px;
            color: rgba(255, 255, 255, 0.8);
        }

        .duendes-aviso-texto strong {
            color: #c9a227;
        }

        /* Barra de progreso */
        .duendes-progreso-barra {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            margin-top: 8px;
            overflow: hidden;
        }

        .duendes-progreso-fill {
            height: 100%;
            background: linear-gradient(90deg, #c9a227, #e8d48b);
            border-radius: 3px;
            transition: width 0.5s ease;
        }

        /* Mobile */
        @media (max-width: 600px) {
            .duendes-aviso {
                padding: 12px 15px;
                gap: 12px;
            }

            .duendes-aviso-icono {
                width: 40px;
                height: 40px;
                font-size: 12px;
            }

            .duendes-aviso-titulo {
                font-size: 11px;
            }

            .duendes-aviso-texto {
                font-size: 13px;
            }
        }
    </style>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// AJAX PARA ACTUALIZAR AVISOS DINÁMICAMENTE
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_get_cart_notices', 'duendes_ajax_get_cart_notices');
add_action('wp_ajax_nopriv_duendes_get_cart_notices', 'duendes_ajax_get_cart_notices');

function duendes_ajax_get_cart_notices() {
    ob_start();
    $info = duendes_calcular_info_carrito();
    duendes_mostrar_aviso_3x2($info);
    duendes_mostrar_aviso_envio_gratis($info);
    $html = ob_get_clean();

    wp_send_json_success([
        'html' => $html,
        'info' => $info
    ]);
}

// Script para actualizar avisos cuando cambia el carrito
add_action('wp_footer', function() {
    if (!is_cart()) return;
    ?>
    <script>
    jQuery(function($) {
        // Actualizar avisos cuando el carrito se actualiza
        $(document.body).on('updated_cart_totals', function() {
            $.post('<?php echo admin_url('admin-ajax.php'); ?>', {
                action: 'duendes_get_cart_notices'
            }, function(response) {
                if (response.success && response.data.html) {
                    $('#duendes-avisos-carrito').html(response.data.html);
                }
            });
        });
    });
    </script>
    <?php
});
