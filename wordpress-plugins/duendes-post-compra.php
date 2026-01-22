<?php
/**
 * Plugin Name: Duendes - Sistema Post-Compra
 * Description: Certificado digital, emails de conversión y ritual de activación
 * Version: 2.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// 1. CERTIFICADO DIGITAL CON CONVERSIÓN
// ═══════════════════════════════════════════════════════════════════════════

function duendes_generar_certificado($datos) {
    $nombre_cliente = $datos['nombre_cliente'] ?? 'Alma Mágica';
    $nombre_guardian = $datos['nombre_guardian'] ?? 'Guardián';
    $fecha_compra = $datos['fecha_compra'] ?? date('d/m/Y');
    $numero_pedido = $datos['numero_pedido'] ?? '0000';
    $categoria = $datos['categoria'] ?? 'Protección';
    $codigo_unico = $datos['codigo_unico'] ?? strtoupper(substr(md5($numero_pedido . $nombre_guardian), 0, 8));
    $product_id = $datos['product_id'] ?? 0;
    $imagen_guardian = $datos['imagen_guardian'] ?? '';

    // Obtener guardianes complementarios (misma categoría, diferentes)
    $guardianes_complementarios = [];
    if ($product_id) {
        $args = [
            'post_type' => 'product',
            'posts_per_page' => 3,
            'post__not_in' => [$product_id],
            'post_status' => 'publish',
            'orderby' => 'rand',
            'tax_query' => [
                [
                    'taxonomy' => 'product_cat',
                    'field' => 'name',
                    'terms' => $categoria
                ]
            ]
        ];
        $query = new WP_Query($args);
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $prod = wc_get_product(get_the_ID());
                if ($prod) {
                    $guardianes_complementarios[] = [
                        'nombre' => $prod->get_name(),
                        'imagen' => wp_get_attachment_url($prod->get_image_id()),
                        'url' => get_permalink(),
                        'precio' => $prod->get_price()
                    ];
                }
            }
            wp_reset_postdata();
        }
    }

    // URL para compartir
    $share_url = home_url('/certificado/' . $numero_pedido);
    $share_text = urlencode("✨ Mi guardián " . $nombre_guardian . " ya está conmigo. Mirá mi certificado de canalización original:");
    $share_hashtags = urlencode("DuendesDelUruguay,Guardianes,Magia");

    // HTML de guardianes complementarios
    $complementarios_html = '';
    if (!empty($guardianes_complementarios)) {
        $complementarios_html = '
        <div class="seccion-complementarios">
            <div class="linea-decorativa"><span class="simbolo">✦</span></div>
            <h3 class="titulo-complementarios">Guardianes que resuenan con ' . esc_html($nombre_guardian) . '</h3>
            <p class="subtitulo-complementarios">Los guardianes trabajan mejor en compañía. Estos tres tienen energía compatible:</p>
            <div class="grid-complementarios">';

        foreach ($guardianes_complementarios as $comp) {
            $complementarios_html .= '
                <a href="' . esc_url($comp['url']) . '" class="guardian-card">
                    <img src="' . esc_url($comp['imagen']) . '" alt="' . esc_attr($comp['nombre']) . '">
                    <span class="guardian-nombre">' . esc_html($comp['nombre']) . '</span>
                    <span class="guardian-precio">$' . esc_html($comp['precio']) . ' USD</span>
                </a>';
        }

        $complementarios_html .= '
            </div>
            <a href="https://duendesdeluruguay.com/tienda/?categoria=' . urlencode($categoria) . '" class="btn-ver-mas">Ver más guardianes de ' . esc_html($categoria) . '</a>
        </div>';
    }

    return '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificado de ' . esc_html($nombre_guardian) . ' | Duendes del Uruguay</title>
    <meta property="og:title" content="Mi guardián ' . esc_html($nombre_guardian) . ' | Duendes del Uruguay">
    <meta property="og:description" content="' . esc_html($nombre_cliente) . ' recibió una canalización original de ' . esc_html($nombre_guardian) . '">
    <meta property="og:image" content="https://duendesdeluruguay.com/wp-content/uploads/certificado-share.jpg">
    <meta property="og:url" content="' . esc_url($share_url) . '">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: "Cormorant Garamond", Georgia, serif;
            background: #0a0a0f;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        .certificado {
            background: linear-gradient(180deg, #1a1a28 0%, #0f0f18 100%);
            border: 2px solid rgba(198, 169, 98, 0.5);
            border-radius: 20px;
            position: relative;
            overflow: hidden;
        }
        .decoracion-top { height: 8px; background: linear-gradient(90deg, transparent, #C6A962, #8B7355, #C6A962, transparent); }
        .esquina { position: absolute; width: 60px; height: 60px; border: 2px solid rgba(198, 169, 98, 0.4); }
        .esquina-tl { top: 20px; left: 20px; border-right: none; border-bottom: none; }
        .esquina-tr { top: 20px; right: 20px; border-left: none; border-bottom: none; }
        .esquina-bl { bottom: 20px; left: 20px; border-right: none; border-top: none; }
        .esquina-br { bottom: 20px; right: 20px; border-left: none; border-top: none; }
        .contenido { padding: 50px 40px; text-align: center; }
        .titulo-certificado {
            font-family: "Cinzel", serif;
            font-size: 12px;
            letter-spacing: 6px;
            color: rgba(198, 169, 98, 0.7);
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        .titulo-principal {
            font-family: "Cinzel", serif;
            font-size: 28px;
            color: #C6A962;
            letter-spacing: 3px;
        }
        .subtitulo { font-size: 15px; color: rgba(255, 255, 255, 0.5); font-style: italic; }
        .linea-decorativa {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 25px 0;
        }
        .linea-decorativa::before, .linea-decorativa::after {
            content: "";
            flex: 1;
            max-width: 120px;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(198, 169, 98, 0.5));
        }
        .linea-decorativa::after { background: linear-gradient(90deg, rgba(198, 169, 98, 0.5), transparent); }
        .linea-decorativa .simbolo { margin: 0 15px; font-size: 20px; color: #C6A962; }
        .imagen-guardian {
            margin-bottom: 20px;
        }
        .imagen-guardian img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid rgba(198, 169, 98, 0.5);
            box-shadow: 0 0 30px rgba(198, 169, 98, 0.3);
        }
        .label-pequeño {
            font-size: 11px;
            letter-spacing: 4px;
            color: rgba(198, 169, 98, 0.6);
            text-transform: uppercase;
            margin-bottom: 6px;
        }
        .nombre-guardian {
            font-family: "Cinzel", serif;
            font-size: 38px;
            color: #fff;
            text-shadow: 0 0 30px rgba(198, 169, 98, 0.3);
            margin-bottom: 8px;
        }
        .categoria-guardian {
            display: inline-block;
            padding: 6px 20px;
            background: rgba(198, 169, 98, 0.15);
            border: 1px solid rgba(198, 169, 98, 0.3);
            border-radius: 20px;
            color: #C6A962;
            font-size: 13px;
            letter-spacing: 2px;
        }
        .seccion-cliente {
            margin: 30px 0;
            padding: 25px;
            background: rgba(198, 169, 98, 0.05);
            border-radius: 12px;
        }
        .texto-certifica { font-size: 15px; color: rgba(255, 255, 255, 0.6); margin-bottom: 10px; }
        .nombre-cliente { font-family: "Cinzel", serif; font-size: 24px; color: #fff; margin-bottom: 12px; }
        .mensaje-conexion {
            font-size: 15px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            font-style: italic;
            max-width: 450px;
            margin: 0 auto;
        }
        .footer-certificado {
            margin-top: 30px;
            padding-top: 25px;
            border-top: 1px solid rgba(198, 169, 98, 0.2);
            display: flex;
            justify-content: center;
            gap: 40px;
            flex-wrap: wrap;
        }
        .dato-footer { text-align: center; }
        .dato-footer .label { font-size: 9px; letter-spacing: 2px; color: rgba(198, 169, 98, 0.5); text-transform: uppercase; margin-bottom: 4px; }
        .dato-footer .valor { font-family: "Cinzel", serif; font-size: 13px; color: rgba(255, 255, 255, 0.8); }
        .codigo-unico { font-family: monospace; font-size: 14px; color: #C6A962; letter-spacing: 2px; }
        .firma { margin-top: 25px; }
        .firma-texto { font-size: 13px; color: rgba(255, 255, 255, 0.5); margin-bottom: 4px; }
        .firma-nombre { font-family: "Cinzel", serif; font-size: 16px; color: #C6A962; letter-spacing: 2px; }
        .decoracion-bottom { height: 4px; background: linear-gradient(90deg, transparent, #C6A962, #8B7355, #C6A962, transparent); }

        /* COMPARTIR */
        .share-section {
            margin-top: 30px;
            padding: 25px;
            background: rgba(198, 169, 98, 0.08);
            border-radius: 15px;
            border: 1px solid rgba(198, 169, 98, 0.2);
        }
        .share-titulo {
            color: #C6A962;
            font-family: "Cinzel", serif;
            font-size: 16px;
            margin-bottom: 15px;
        }
        .share-buttons {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
        }
        .share-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
            font-size: 14px;
            transition: transform 0.2s, opacity 0.2s;
        }
        .share-btn:hover { transform: translateY(-2px); opacity: 0.9; }
        .share-btn.whatsapp { background: #25D366; color: #fff; }
        .share-btn.facebook { background: #1877F2; color: #fff; }
        .share-btn.instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: #fff; }
        .share-btn.copy { background: rgba(198, 169, 98, 0.2); color: #C6A962; border: 1px solid rgba(198, 169, 98, 0.4); }

        /* GUARDIANES COMPLEMENTARIOS */
        .seccion-complementarios {
            margin-top: 40px;
            padding: 30px;
            background: linear-gradient(180deg, #12121a 0%, #0a0a0f 100%);
            border-radius: 20px;
            border: 1px solid rgba(198, 169, 98, 0.2);
        }
        .titulo-complementarios {
            font-family: "Cinzel", serif;
            font-size: 20px;
            color: #C6A962;
            margin-bottom: 8px;
        }
        .subtitulo-complementarios {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            margin-bottom: 25px;
        }
        .grid-complementarios {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }
        .guardian-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 15px;
            background: rgba(198, 169, 98, 0.05);
            border: 1px solid rgba(198, 169, 98, 0.2);
            border-radius: 12px;
            text-decoration: none;
            transition: all 0.3s;
        }
        .guardian-card:hover {
            transform: translateY(-5px);
            border-color: rgba(198, 169, 98, 0.5);
            background: rgba(198, 169, 98, 0.1);
        }
        .guardian-card img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 50%;
            margin-bottom: 10px;
            border: 2px solid rgba(198, 169, 98, 0.3);
        }
        .guardian-nombre {
            color: #fff;
            font-family: "Cinzel", serif;
            font-size: 14px;
            text-align: center;
            margin-bottom: 5px;
        }
        .guardian-precio {
            color: #C6A962;
            font-size: 13px;
        }
        .btn-ver-mas {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
            color: #000;
            text-decoration: none;
            border-radius: 25px;
            font-family: "Cinzel", serif;
            font-size: 14px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        .btn-ver-mas:hover { transform: translateY(-2px); }

        /* ACCIONES */
        .acciones {
            margin-top: 25px;
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .btn-accion {
            padding: 10px 25px;
            border: 1px solid rgba(198, 169, 98, 0.5);
            background: rgba(198, 169, 98, 0.1);
            color: #C6A962;
            font-family: "Cinzel", serif;
            font-size: 13px;
            cursor: pointer;
            border-radius: 25px;
            transition: all 0.3s;
        }
        .btn-accion:hover { background: rgba(198, 169, 98, 0.2); }

        @media print {
            .share-section, .seccion-complementarios, .acciones { display: none !important; }
            body { background: white; }
        }
        @media (max-width: 600px) {
            .contenido { padding: 30px 20px; }
            .nombre-guardian { font-size: 28px; }
            .footer-certificado { gap: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="certificado">
            <div class="decoracion-top"></div>
            <div class="esquina esquina-tl"></div>
            <div class="esquina esquina-tr"></div>
            <div class="esquina esquina-bl"></div>
            <div class="esquina esquina-br"></div>

            <div class="contenido">
                <div class="titulo-certificado">Certificado Oficial</div>
                <h1 class="titulo-principal">Canalización Original</h1>
                <p class="subtitulo">Duendes del Uruguay</p>

                <div class="linea-decorativa"><span class="simbolo">✦</span></div>

                ' . ($imagen_guardian ? '
                <div class="imagen-guardian">
                    <img src="' . esc_url($imagen_guardian) . '" alt="' . esc_attr($nombre_guardian) . '">
                </div>' : '') . '
                <div class="label-pequeño">Guardián Canalizado</div>
                <h2 class="nombre-guardian">' . esc_html($nombre_guardian) . '</h2>
                <span class="categoria-guardian">' . esc_html($categoria) . '</span>

                <div class="seccion-cliente">
                    <p class="texto-certifica">Este certificado acredita que</p>
                    <h3 class="nombre-cliente">' . esc_html($nombre_cliente) . '</h3>
                    <p class="mensaje-conexion">
                        ha establecido una conexión única con este guardián,
                        quien canalizó un mensaje exclusivo para acompañar su camino.
                    </p>
                </div>

                <div class="footer-certificado">
                    <div class="dato-footer">
                        <div class="label">Fecha</div>
                        <div class="valor">' . esc_html($fecha_compra) . '</div>
                    </div>
                    <div class="dato-footer">
                        <div class="label">Código</div>
                        <div class="codigo-unico">' . esc_html($codigo_unico) . '</div>
                    </div>
                    <div class="dato-footer">
                        <div class="label">Pedido</div>
                        <div class="valor">#' . esc_html($numero_pedido) . '</div>
                    </div>
                </div>

                <div class="firma">
                    <p class="firma-texto">Con amor desde el bosque</p>
                    <p class="firma-nombre">Duendes del Uruguay</p>
                </div>
            </div>
            <div class="decoracion-bottom"></div>
        </div>

        <!-- COMPARTIR -->
        <div class="share-section">
            <h3 class="share-titulo">Compartí tu conexión ✨</h3>
            <div class="share-buttons">
                <a href="https://wa.me/?text=' . $share_text . '%20' . urlencode($share_url) . '" target="_blank" class="share-btn whatsapp">
                    📱 WhatsApp
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=' . urlencode($share_url) . '" target="_blank" class="share-btn facebook">
                    👤 Facebook
                </a>
                <a href="https://www.instagram.com/" target="_blank" class="share-btn instagram" onclick="copiarParaIG()">
                    📸 Instagram
                </a>
                <button class="share-btn copy" onclick="copiarLink()">
                    🔗 Copiar link
                </button>
            </div>
        </div>

        ' . $complementarios_html . '

        <div class="acciones">
            <button class="btn-accion" onclick="window.print()">🖨️ Imprimir</button>
            <button class="btn-accion" onclick="descargarImagen()">📥 Descargar imagen</button>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script>
        function descargarImagen() {
            const btn = event.target;
            const textoOriginal = btn.textContent;
            btn.textContent = "⏳ Generando...";
            btn.disabled = true;

            const cert = document.querySelector(".certificado");

            if (typeof html2canvas === "undefined") {
                alert("Error: No se pudo cargar el generador de imágenes. Intentá de nuevo.");
                btn.textContent = textoOriginal;
                btn.disabled = false;
                return;
            }

            html2canvas(cert, {
                scale: 2,
                backgroundColor: "#0a0a0f",
                useCORS: true,
                allowTaint: true,
                logging: false
            }).then(canvas => {
                const link = document.createElement("a");
                link.download = "certificado-' . sanitize_title($nombre_guardian) . '.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
                btn.textContent = textoOriginal;
                btn.disabled = false;
            }).catch(err => {
                console.error("Error al generar imagen:", err);
                alert("Error al generar la imagen. Usá la opción Imprimir como alternativa.");
                btn.textContent = textoOriginal;
                btn.disabled = false;
            });
        }

        function copiarLink() {
            navigator.clipboard.writeText("' . esc_js($share_url) . '").then(() => {
                alert("✅ Link copiado!");
            }).catch(() => {
                prompt("Copiá este link:", "' . esc_js($share_url) . '");
            });
        }

        function copiarParaIG() {
            const texto = "' . esc_js($share_text) . ' ' . esc_js($share_url) . '";
            navigator.clipboard.writeText(texto).then(() => {
                alert("✅ Texto copiado! Pegalo en tu historia o post de Instagram.");
            }).catch(() => {
                prompt("Copiá este texto:", texto);
            });
        }
    </script>
</body>
</html>';
}

// Endpoint para certificado
add_action('init', function() {
    add_rewrite_rule('^certificado/([0-9]+)/?$', 'index.php?certificado_order=$matches[1]', 'top');
});

add_filter('query_vars', function($vars) {
    $vars[] = 'certificado_order';
    return $vars;
});

add_action('template_redirect', function() {
    $order_id = get_query_var('certificado_order');
    if (!$order_id) return;

    $order = wc_get_order($order_id);
    if (!$order) { wp_die('Certificado no encontrado'); }

    $items = $order->get_items();
    $primer_item = reset($items);
    $product_id = $primer_item ? $primer_item->get_product_id() : 0;
    $product = wc_get_product($product_id);

    $categoria = 'Guardián';
    if ($product) {
        $terms = get_the_terms($product_id, 'product_cat');
        if ($terms && !is_wp_error($terms)) {
            $categoria = $terms[0]->name;
        }
    }

    // Obtener imagen del producto
    $imagen_guardian = '';
    if ($product) {
        $imagen_id = $product->get_image_id();
        if ($imagen_id) {
            $imagen_guardian = wp_get_attachment_url($imagen_id);
        }
    }

    $datos = [
        'nombre_cliente' => $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
        'nombre_guardian' => $primer_item ? $primer_item->get_name() : 'Guardián',
        'fecha_compra' => $order->get_date_created()->date('d/m/Y'),
        'numero_pedido' => $order_id,
        'categoria' => $categoria,
        'codigo_unico' => strtoupper(substr(md5($order_id . $order->get_order_key()), 0, 8)),
        'product_id' => $product_id,
        'imagen_guardian' => $imagen_guardian
    ];

    echo duendes_generar_certificado($datos);
    exit;
});

register_activation_hook(__FILE__, function() { flush_rewrite_rules(); });

// ═══════════════════════════════════════════════════════════════════════════
// 2. EMAILS DE CONVERSIÓN
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtener guardianes complementarios para cross-sell
 */
function duendes_get_complementarios($product_id, $cantidad = 3) {
    if (!$product_id) return [];

    $product = wc_get_product($product_id);
    if (!$product) return [];

    $terms = get_the_terms($product_id, 'product_cat');
    $categoria = ($terms && !is_wp_error($terms)) ? $terms[0]->name : '';

    $args = [
        'post_type' => 'product',
        'posts_per_page' => $cantidad,
        'post__not_in' => [$product_id],
        'post_status' => 'publish',
        'orderby' => 'rand'
    ];

    if ($categoria) {
        $args['tax_query'] = [[
            'taxonomy' => 'product_cat',
            'field' => 'name',
            'terms' => $categoria
        ]];
    }

    $complementarios = [];
    $query = new WP_Query($args);
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $prod = wc_get_product(get_the_ID());
            if ($prod) {
                $complementarios[] = [
                    'nombre' => $prod->get_name(),
                    'imagen' => wp_get_attachment_url($prod->get_image_id()),
                    'url' => get_permalink(),
                    'precio' => $prod->get_price()
                ];
            }
        }
        wp_reset_postdata();
    }

    return $complementarios;
}

/**
 * Generar HTML de cross-sell para emails
 */
function duendes_crosssell_html($complementarios, $nombre_guardian) {
    if (empty($complementarios)) return '';

    $html = '
    <div style="margin:30px 0;padding:25px;background:rgba(198,169,98,0.08);border-radius:15px;border:1px solid rgba(198,169,98,0.2);">
        <p style="color:#C6A962;font-size:18px;margin:0 0 8px 0;font-family:Cinzel,Georgia,serif;text-align:center;">
            Guardianes que resuenan con ' . esc_html($nombre_guardian) . '
        </p>
        <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 20px 0;text-align:center;">
            Los guardianes trabajan mejor en compañía. Estas energías son compatibles:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>';

    foreach ($complementarios as $comp) {
        $html .= '
                <td style="text-align:center;padding:10px;">
                    <a href="' . esc_url($comp['url']) . '" style="text-decoration:none;">
                        <img src="' . esc_url($comp['imagen']) . '" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid rgba(198,169,98,0.3);">
                        <p style="color:#fff;font-size:13px;margin:8px 0 4px 0;">' . esc_html($comp['nombre']) . '</p>
                        <p style="color:#C6A962;font-size:12px;margin:0;">$' . esc_html($comp['precio']) . '</p>
                    </a>
                </td>';
    }

    $html .= '
            </tr>
        </table>
        <p style="text-align:center;margin:20px 0 0 0;">
            <a href="https://duendesdeluruguay.com/tienda" style="display:inline-block;padding:12px 25px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-size:14px;font-weight:600;">Ver todos los guardianes</a>
        </p>
    </div>';

    return $html;
}

/**
 * Email: Pedido en preparación (con cross-sell)
 */
add_action('woocommerce_order_status_processing', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    $items = $order->get_items();
    $primer_item = reset($items);
    $nombre_guardian = $primer_item ? $primer_item->get_name() : 'tu guardián';
    $product_id = $primer_item ? $primer_item->get_product_id() : 0;

    $complementarios = duendes_get_complementarios($product_id, 3);
    $crosssell_html = duendes_crosssell_html($complementarios, $nombre_guardian);

    $contenido = '
        <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', tu guardián está siendo preparado ✨</p>

        <p><strong style="color:#C6A962;">' . esc_html($nombre_guardian) . '</strong> sabe que lo elegiste. En este momento está recibiendo los últimos toques antes de viajar hacia vos.</p>

        <div style="text-align:center;padding:25px 0;">
            <div style="font-size:60px;">🌟</div>
        </div>

        <div style="background:rgba(198,169,98,0.1);padding:20px;border-radius:12px;margin:20px 0;">
            <p style="color:#C6A962;margin:0 0 12px 0;font-weight:600;">Mientras esperás:</p>
            <ul style="color:rgba(255,255,255,0.8);margin:0;padding-left:20px;line-height:1.8;">
                <li>Pensá dónde va a vivir tu guardián</li>
                <li>Preparate para el ritual de activación</li>
                <li>Abrí espacio en tu vida para la magia</li>
            </ul>
        </div>

        ' . $crosssell_html . '
    ';

    if (function_exists('duendes_enviar_email')) {
        duendes_enviar_email($email, '🌟 ' . $nombre_guardian . ' está siendo preparado', $contenido, 'En Preparación', 'Tu guardián casi está listo');
    }
});

/**
 * Email: Pedido enviado (con tracking + cross-sell)
 */
add_action('woocommerce_order_status_completed', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;
    if ($order->get_meta('_email_enviado_v2_sent')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    $items = $order->get_items();
    $primer_item = reset($items);
    $nombre_guardian = $primer_item ? $primer_item->get_name() : 'tu guardián';
    $product_id = $primer_item ? $primer_item->get_product_id() : 0;

    $tracking = $order->get_meta('_tracking_number') ?: $order->get_meta('tracking_number') ?: '';
    $tracking_url = $order->get_meta('_tracking_url') ?: '';

    $tracking_html = '';
    if ($tracking) {
        $tracking_html = '
        <div style="background:rgba(198,169,98,0.15);padding:20px;border-radius:12px;margin:20px 0;text-align:center;">
            <p style="color:rgba(255,255,255,0.6);margin:0 0 8px 0;font-size:13px;">Número de seguimiento:</p>
            <p style="color:#C6A962;font-size:18px;font-family:monospace;margin:0;">' . esc_html($tracking) . '</p>
            ' . ($tracking_url ? '<p style="margin:10px 0 0 0;"><a href="' . esc_url($tracking_url) . '" style="color:#C6A962;">🔍 Seguir envío</a></p>' : '') . '
        </div>';
    }

    $complementarios = duendes_get_complementarios($product_id, 3);
    $crosssell_html = duendes_crosssell_html($complementarios, $nombre_guardian);

    $contenido = '
        <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">¡' . esc_html($nombre) . ', ' . esc_html($nombre_guardian) . ' está en camino! 📦</p>

        <p>Tu guardián acaba de salir del bosque y está viajando hacia vos.</p>

        ' . $tracking_html . '

        <div style="background:rgba(198,169,98,0.1);padding:20px;border-radius:12px;margin:20px 0;">
            <p style="color:#C6A962;margin:0 0 12px 0;font-weight:600;">Cuando llegue:</p>
            <ul style="color:rgba(255,255,255,0.8);margin:0;padding-left:20px;line-height:1.8;">
                <li>Abrilo en un momento tranquilo</li>
                <li>Te enviaremos el <strong>ritual de activación</strong></li>
                <li>Tu certificado digital ya está disponible</li>
            </ul>
        </div>

        <p style="text-align:center;margin:25px 0;">
            <a href="' . home_url('/certificado/' . $order_id) . '" style="display:inline-block;padding:14px 30px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;">📜 Ver mi certificado</a>
        </p>

        ' . $crosssell_html . '
    ';

    if (function_exists('duendes_enviar_email')) {
        $enviado = duendes_enviar_email($email, '📦 ¡' . $nombre_guardian . ' está en camino!', $contenido, '¡En Camino!', 'Tu guardián ya salió del bosque');
        if ($enviado) {
            $order->update_meta_data('_email_enviado_v2_sent', true);
            $order->save();
        }
    }

    // Programar ritual de activación
    $pais = $order->get_shipping_country() ?: $order->get_billing_country();
    $dias = ($pais === 'UY') ? 2 : 5;
    wp_schedule_single_event(time() + ($dias * DAY_IN_SECONDS), 'duendes_enviar_ritual_v2', [$order_id]);
}, 5);

// ═══════════════════════════════════════════════════════════════════════════
// 3. RITUAL DE ACTIVACIÓN CON CONVERSIÓN
// ═══════════════════════════════════════════════════════════════════════════

add_action('duendes_enviar_ritual_v2', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order || $order->get_meta('_ritual_v2_sent')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    $items = $order->get_items();
    $primer_item = reset($items);
    $nombre_guardian = $primer_item ? $primer_item->get_name() : 'tu guardián';
    $product_id = $primer_item ? $primer_item->get_product_id() : 0;

    $url_certificado = home_url('/certificado/' . $order_id);
    $complementarios = duendes_get_complementarios($product_id, 3);

    $contenido = '
        <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', es momento de activar tu conexión 🕯️</p>

        <p>Si <strong style="color:#C6A962;">' . esc_html($nombre_guardian) . '</strong> ya llegó, este es el ritual para establecer el vínculo energético:</p>

        <div style="background:rgba(198,169,98,0.1);padding:30px;border-radius:15px;margin:25px 0;border:1px solid rgba(198,169,98,0.2);">
            <h3 style="color:#C6A962;margin:0 0 20px 0;text-align:center;font-family:Cinzel,Georgia,serif;">✨ Ritual de Activación</h3>

            <ol style="color:rgba(255,255,255,0.85);padding-left:25px;line-height:2;margin:0;">
                <li style="margin-bottom:12px;">
                    <strong style="color:#C6A962;">Buscá silencio</strong> — Apagá el celular. Este momento es tuyo.
                </li>
                <li style="margin-bottom:12px;">
                    <strong style="color:#C6A962;">Desempacá con intención</strong> — Despacio. Miralo a los ojos.
                </li>
                <li style="margin-bottom:12px;">
                    <strong style="color:#C6A962;">Sostenelo entre tus manos</strong> — Cerrá los ojos. Tres respiraciones profundas.
                </li>
                <li style="margin-bottom:12px;">
                    <strong style="color:#C6A962;">Presentate</strong> — Decile tu nombre. Contale quién sos.
                </li>
                <li style="margin-bottom:12px;">
                    <strong style="color:#C6A962;">Hacé tu pedido</strong> — ¿En qué necesitás que te acompañe? Decíselo.
                </li>
                <li style="margin-bottom:12px;">
                    <strong style="color:#C6A962;">Elegí su lugar</strong> — Ubicalo donde va a vivir en tu espacio.
                </li>
                <li>
                    <strong style="color:#C6A962;">Leé tu canalización</strong> — Es el mensaje que canalizó para vos.
                </li>
            </ol>
        </div>

        <p style="text-align:center;margin:25px 0;">
            <a href="' . esc_url($url_certificado) . '" style="display:inline-block;padding:14px 30px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;">📜 Ver mi certificado y canalización</a>
        </p>

        <div style="background:rgba(198,169,98,0.05);padding:20px;border-radius:12px;margin:25px 0;text-align:center;">
            <p style="color:#C6A962;font-size:16px;margin:0 0 10px 0;">📔 Diario de Señales</p>
            <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;">
                A partir de hoy, prestá atención. Anotá las coincidencias, los sueños, las sensaciones.
                Los guardianes se comunican de formas sutiles. En una semana te escribimos para saber qué notaste.
            </p>
        </div>

        ' . (!empty($complementarios) ? '
        <div style="margin:30px 0;padding:25px;background:rgba(198,169,98,0.08);border-radius:15px;border:1px solid rgba(198,169,98,0.2);">
            <p style="color:#C6A962;font-size:16px;margin:0 0 8px 0;text-align:center;">
                ¿Sabías que los guardianes trabajan mejor en tríadas?
            </p>
            <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 15px 0;text-align:center;">
                ' . esc_html($nombre_guardian) . ' nos contó que estos guardianes complementarían su energía:
            </p>
            <table width="100%" cellpadding="0" cellspacing="0"><tr>' : '') . '
        ';

    if (!empty($complementarios)) {
        foreach ($complementarios as $comp) {
            $contenido .= '
                <td style="text-align:center;padding:8px;">
                    <a href="' . esc_url($comp['url']) . '" style="text-decoration:none;">
                        <img src="' . esc_url($comp['imagen']) . '" style="width:70px;height:70px;border-radius:50%;object-fit:cover;border:2px solid rgba(198,169,98,0.3);">
                        <p style="color:#fff;font-size:12px;margin:6px 0 2px 0;">' . esc_html($comp['nombre']) . '</p>
                        <p style="color:#C6A962;font-size:11px;margin:0;">$' . esc_html($comp['precio']) . '</p>
                    </a>
                </td>';
        }
        $contenido .= '</tr></table></div>';
    }

    $contenido .= '
        <div style="margin-top:30px;padding:20px;background:rgba(100,180,100,0.1);border-radius:12px;border:1px solid rgba(100,180,100,0.2);text-align:center;">
            <p style="color:#8fbc8f;font-size:16px;margin:0 0 10px 0;">🌿 El Círculo de Duendes</p>
            <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0 0 15px 0;">
                Comunidad exclusiva de Elegidos. Contenido especial, canalizaciones grupales y descuentos únicos.
            </p>
            <a href="https://duendesdeluruguay.com/circulo" style="color:#8fbc8f;font-size:14px;">Conocer más →</a>
        </div>
    ';

    if (function_exists('duendes_enviar_email')) {
        $enviado = duendes_enviar_email($email, '🕯️ Ritual de Activación para ' . $nombre_guardian, $contenido, 'Ritual de Activación', 'Es momento de conectar');
        if ($enviado) {
            $order->update_meta_data('_ritual_v2_sent', true);
            $order->save();
        }
    }

    // Programar email de review/señales (7 días después)
    wp_schedule_single_event(time() + (7 * DAY_IN_SECONDS), 'duendes_email_senales_review', [$order_id]);
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. EMAIL DE SEÑALES + REVIEW (7 DÍAS DESPUÉS)
// ═══════════════════════════════════════════════════════════════════════════

add_action('duendes_email_senales_review', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order || $order->get_meta('_email_senales_sent')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    $items = $order->get_items();
    $primer_item = reset($items);
    $nombre_guardian = $primer_item ? $primer_item->get_name() : 'tu guardián';
    $product_id = $primer_item ? $primer_item->get_product_id() : 0;
    $product_url = $product_id ? get_permalink($product_id) : 'https://duendesdeluruguay.com/tienda';

    $complementarios = duendes_get_complementarios($product_id, 2);

    $contenido = '
        <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', ¿qué señales notaste? 👀</p>

        <p>Ya pasó una semana desde que <strong style="color:#C6A962;">' . esc_html($nombre_guardian) . '</strong> llegó a tu vida.</p>

        <div style="background:rgba(198,169,98,0.1);padding:20px;border-radius:12px;margin:20px 0;">
            <p style="color:#C6A962;margin:0 0 12px 0;font-weight:600;">Algunas preguntas para reflexionar:</p>
            <ul style="color:rgba(255,255,255,0.8);margin:0;padding-left:20px;line-height:1.8;">
                <li>¿Soñaste algo diferente esta semana?</li>
                <li>¿Notaste alguna coincidencia inusual?</li>
                <li>¿Cómo te sentís cuando lo mirás?</li>
                <li>¿Cambió algo en tu día a día?</li>
            </ul>
        </div>

        <p>Tu experiencia puede ayudar a otras personas que están buscando su guardián. ¿Nos contás cómo te fue?</p>

        <p style="text-align:center;margin:25px 0;">
            <a href="' . esc_url($product_url) . '#reviews" style="display:inline-block;padding:14px 30px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;">⭐ Dejar mi experiencia</a>
        </p>

        <p style="color:rgba(255,255,255,0.6);font-size:14px;text-align:center;margin:20px 0;">
            Solo toma un minuto y significa muchísimo para nosotras 💛
        </p>
    ';

    if (!empty($complementarios)) {
        $contenido .= '
        <div style="margin:30px 0;padding:25px;background:rgba(198,169,98,0.08);border-radius:15px;border:1px solid rgba(198,169,98,0.2);">
            <p style="color:#C6A962;font-size:15px;margin:0 0 15px 0;text-align:center;">
                Si sentís que la energía de ' . esc_html($nombre_guardian) . ' te está ayudando, estos guardianes potenciarían su trabajo:
            </p>
            <table width="100%" cellpadding="0" cellspacing="0"><tr>';

        foreach ($complementarios as $comp) {
            $contenido .= '
                <td style="text-align:center;padding:10px;">
                    <a href="' . esc_url($comp['url']) . '" style="text-decoration:none;">
                        <img src="' . esc_url($comp['imagen']) . '" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid rgba(198,169,98,0.3);">
                        <p style="color:#fff;font-size:13px;margin:8px 0 4px 0;">' . esc_html($comp['nombre']) . '</p>
                        <p style="color:#C6A962;font-size:12px;margin:0;">$' . esc_html($comp['precio']) . '</p>
                    </a>
                </td>';
        }

        $contenido .= '</tr></table></div>';
    }

    if (function_exists('duendes_enviar_email')) {
        $enviado = duendes_enviar_email($email, '👀 ¿Qué señales notaste con ' . $nombre_guardian . '?', $contenido, 'Una semana después', '¿Cómo va la conexión?');
        if ($enviado) {
            $order->update_meta_data('_email_senales_sent', true);
            $order->save();
        }
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. ADMIN METABOX
// ═══════════════════════════════════════════════════════════════════════════

add_action('add_meta_boxes', function() {
    add_meta_box('duendes_post_compra_v2', '🌟 Post-Compra', 'duendes_post_compra_metabox_v2', 'shop_order', 'side', 'default');
});

function duendes_post_compra_metabox_v2($post) {
    $order = wc_get_order($post->ID);
    if (!$order) return;

    $enviado = $order->get_meta('_email_enviado_v2_sent') ? '✅' : '⏳';
    $ritual = $order->get_meta('_ritual_v2_sent') ? '✅' : '⏳';
    $senales = $order->get_meta('_email_senales_sent') ? '✅' : '⏳';
    ?>
    <div style="padding:10px 0;">
        <p><strong>Emails:</strong></p>
        <ul style="margin:8px 0;padding-left:18px;">
            <li><?php echo $enviado; ?> Enviado</li>
            <li><?php echo $ritual; ?> Ritual</li>
            <li><?php echo $senales; ?> Señales/Review</li>
        </ul>
        <p style="margin-top:12px;">
            <a href="<?php echo home_url('/certificado/' . $post->ID); ?>" target="_blank" class="button">📜 Certificado</a>
        </p>
        <p style="margin-top:8px;">
            <button type="button" class="button" onclick="if(confirm('¿Enviar ritual ahora?')){jQuery.post(ajaxurl,{action:'duendes_enviar_ritual_manual_v2',order_id:<?php echo $post->ID; ?>,nonce:'<?php echo wp_create_nonce('duendes_admin'); ?>'},function(r){alert(r.success?'✅ Enviado':'❌ Error');location.reload();})}">🕯️ Enviar Ritual</button>
        </p>
    </div>
    <?php
}

add_action('wp_ajax_duendes_enviar_ritual_manual_v2', function() {
    check_ajax_referer('duendes_admin', 'nonce');
    do_action('duendes_enviar_ritual_v2', intval($_POST['order_id']));
    wp_send_json_success();
});
