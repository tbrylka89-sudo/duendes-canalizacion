<?php
/**
 * Plugin Name: Duendes Producto V3
 * Description: Pagina de producto con banner orbes y secciones alternadas
 * Version: 3.0
 */

if (!defined('ABSPATH')) exit;

// Estilos en pagina de producto
add_action('wp_head', function() {
    if (is_product()) {
        echo '<style>' . duendes_producto_styles_v3() . '</style>';
    }
}, 99);

// Reemplazar contenido del producto
add_action('woocommerce_before_single_product', function() {
    // Remover elementos default de WooCommerce
    remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_title', 5);
    remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_price', 10);
    remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_excerpt', 20);
    remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30);
    remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40);
    remove_action('woocommerce_before_single_product_summary', 'woocommerce_show_product_images', 20);
    remove_action('woocommerce_after_single_product_summary', 'woocommerce_output_product_data_tabs', 10);
    remove_action('woocommerce_after_single_product_summary', 'woocommerce_upsell_display', 15);
    remove_action('woocommerce_after_single_product_summary', 'woocommerce_output_related_products', 20);
}, 1);

// Contenido custom
add_action('woocommerce_before_single_product_summary', 'duendes_producto_custom_v3', 5);

function duendes_producto_custom_v3() {
    global $product;
    if (!$product) return;

    $nombre = $product->get_name();
    $precio = $product->get_price_html();
    $descripcion = $product->get_description();
    $short_desc = $product->get_short_description();
    $cats = wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'names']);
    $imagen_id = $product->get_image_id();
    $imagen_url = $imagen_id ? wp_get_attachment_image_url($imagen_id, 'large') : '';
    $gallery_ids = $product->get_gallery_image_ids();

    // Historia guardada
    $historia = get_post_meta($product->get_id(), '_duendes_historia', true);
    $personalidad = get_post_meta($product->get_id(), '_duendes_personalidad', true);
    $fortalezas = get_post_meta($product->get_id(), '_duendes_fortalezas', true);
    $ritual = get_post_meta($product->get_id(), '_duendes_ritual', true);
    ?>

    <!-- BANNER HERO CON ORBES -->
    <section class="dp-hero">
        <div class="dp-orbs">
            <div class="dp-orb dp-orb-1"></div>
            <div class="dp-orb dp-orb-2"></div>
            <div class="dp-orb dp-orb-3"></div>
            <div class="dp-orb dp-orb-4"></div>
            <div class="dp-orb dp-orb-5"></div>
        </div>
        <div class="dp-hero-content">
            <span class="dp-badge">✦ PIEZA UNICA ✦</span>
            <h1 class="dp-nombre"><?php echo esc_html($nombre); ?></h1>
            <p class="dp-tipo">Guardian • <?php echo esc_html(implode(' • ', array_slice($cats, 0, 2))); ?></p>
        </div>
    </section>

    <!-- SECCION CREMA FLOTANTE - GALERIA Y PRECIO -->
    <section class="dp-section dp-cream">
        <div class="dp-floating-card">
            <div class="dp-gallery-precio">
                <div class="dp-gallery">
                    <?php if ($imagen_url): ?>
                    <div class="dp-main-img">
                        <img src="<?php echo esc_url($imagen_url); ?>" alt="<?php echo esc_attr($nombre); ?>">
                    </div>
                    <?php endif; ?>
                    <?php if (!empty($gallery_ids)): ?>
                    <div class="dp-thumbs">
                        <?php if ($imagen_url): ?>
                        <img src="<?php echo esc_url(wp_get_attachment_image_url($imagen_id, 'thumbnail')); ?>"
                             onclick="document.querySelector('.dp-main-img img').src='<?php echo esc_url($imagen_url); ?>'"
                             alt="" class="active">
                        <?php endif; ?>
                        <?php foreach (array_slice($gallery_ids, 0, 4) as $gid): ?>
                        <img src="<?php echo esc_url(wp_get_attachment_image_url($gid, 'thumbnail')); ?>"
                             onclick="this.parentElement.querySelectorAll('img').forEach(i=>i.classList.remove('active'));this.classList.add('active');document.querySelector('.dp-main-img img').src='<?php echo esc_url(wp_get_attachment_image_url($gid, 'large')); ?>'"
                             alt="">
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>
                </div>
                <div class="dp-info">
                    <h2><?php echo esc_html($nombre); ?></h2>
                    <div class="dp-precio"><?php echo $precio; ?></div>
                    <?php if ($short_desc): ?>
                    <p class="dp-short-desc"><?php echo wp_kses_post($short_desc); ?></p>
                    <?php endif; ?>
                    <form class="cart" method="post" enctype="multipart/form-data">
                        <button type="submit" name="add-to-cart" value="<?php echo $product->get_id(); ?>" class="dp-btn-primary">
                            ✦ Sellar el Pacto ✦
                        </button>
                    </form>
                    <div class="dp-garantias">
                        <span>🛡️ Envio seguro</span>
                        <span>✨ Pieza unica</span>
                        <span>💜 30 dias garantia</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECCION NEGRA - SU HISTORIA -->
    <section class="dp-section dp-dark">
        <div class="dp-container">
            <h2 class="dp-section-title">Su Historia</h2>
            <div class="dp-historia">
                <?php if ($historia): ?>
                    <?php echo wp_kses_post(wpautop($historia)); ?>
                <?php elseif ($descripcion): ?>
                    <?php echo wp_kses_post($descripcion); ?>
                <?php else: ?>
                    <p>Este guardian guarda secretos ancestrales que solo revelara a quien lo elija como companero. Su energia ha viajado desde los bosques de Piriapolis hasta encontrar su lugar en el mundo.</p>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- SECCION BLANCA - FORTALEZAS -->
    <section class="dp-section dp-white">
        <div class="dp-container">
            <h2 class="dp-section-title-dark">Sus Fortalezas</h2>
            <div class="dp-fortalezas">
                <?php
                $fortalezas_array = $fortalezas ? array_filter(explode("\n", $fortalezas)) : [
                    'Proteccion del Hogar',
                    'Conexion Ancestral',
                    'Armonia Natural'
                ];
                $iconos = ['🛡️', '✨', '🌿', '💜', '🔮', '🌙'];
                $i = 0;
                foreach (array_slice($fortalezas_array, 0, 3) as $f):
                ?>
                <div class="dp-fortaleza">
                    <span class="dp-fortaleza-icon"><?php echo $iconos[$i % count($iconos)]; ?></span>
                    <h3><?php echo esc_html(trim($f)); ?></h3>
                </div>
                <?php $i++; endforeach; ?>
            </div>
        </div>
    </section>

    <!-- SECCION CREMA FLOTANTE - RITUAL -->
    <section class="dp-section dp-cream">
        <div class="dp-floating-card dp-ritual-card">
            <h2 class="dp-section-title-dark">Ritual de Bienvenida</h2>
            <div class="dp-ritual-content">
                <?php if ($ritual): ?>
                    <?php echo wp_kses_post(wpautop($ritual)); ?>
                <?php else: ?>
                <p>Cuando <?php echo esc_html($nombre); ?> llegue a tu hogar, dedicale un momento especial:</p>
                <ol>
                    <li>Encende una vela y respira profundo tres veces</li>
                    <li>Sostenelo en tus manos y presentate con tu nombre</li>
                    <li>Contale por que lo elegiste y que esperas de su compania</li>
                    <li>Ubicalo en un lugar especial donde pueda ver la entrada</li>
                </ol>
                <p class="dp-ritual-nota">Recorda que los guardianes eligen tanto como son elegidos. Si llego a vos, es porque hay un motivo.</p>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- SECCION NEGRA - CTA FINAL -->
    <section class="dp-section dp-dark dp-cta-final">
        <div class="dp-container">
            <h2 class="dp-cta-titulo"><?php echo esc_html($nombre); ?> te esta esperando</h2>
            <div class="dp-cta-precio"><?php echo $precio; ?></div>
            <form class="cart" method="post" enctype="multipart/form-data">
                <button type="submit" name="add-to-cart" value="<?php echo $product->get_id(); ?>" class="dp-btn-primary dp-btn-large">
                    ✦ Sellar el Pacto ✦
                </button>
            </form>
            <p class="dp-cta-sub">Pieza unica. Cuando se va, desaparece para siempre.</p>
        </div>
    </section>

    <?php
}

function duendes_producto_styles_v3() {
    return '
    @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap");

    /* Ocultar elementos default */
    .woocommerce-breadcrumb,
    .product_title,
    .woocommerce-product-gallery,
    .summary.entry-summary,
    .woocommerce-tabs,
    .related.products,
    .up-sells,
    .elementor-widget-woocommerce-product-images,
    .elementor-widget-woocommerce-product-title,
    .elementor-widget-woocommerce-product-price,
    .elementor-widget-woocommerce-product-add-to-cart,
    .product-page-header { display: none !important; }

    body.single-product { background: #0a0a0a; }

    /* HERO CON ORBES */
    .dp-hero {
        min-height: 70vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        background: #0a0a0a;
    }

    .dp-orbs {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .dp-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        animation: dpFloat 12s ease-in-out infinite;
    }

    .dp-orb-1 { width: 500px; height: 500px; background: rgba(198, 169, 98, 0.35); top: -150px; left: 0%; animation-delay: 0s; }
    .dp-orb-2 { width: 350px; height: 350px; background: rgba(232, 121, 249, 0.25); top: 30%; right: 5%; animation-delay: -3s; }
    .dp-orb-3 { width: 400px; height: 400px; background: rgba(129, 140, 248, 0.25); bottom: -100px; left: 25%; animation-delay: -6s; }
    .dp-orb-4 { width: 250px; height: 250px; background: rgba(52, 211, 153, 0.2); top: 50%; left: 60%; animation-delay: -9s; }
    .dp-orb-5 { width: 300px; height: 300px; background: rgba(198, 169, 98, 0.25); bottom: 10%; right: 15%; animation-delay: -4s; }

    @keyframes dpFloat {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
        33% { transform: translate(30px, -40px) scale(1.1); opacity: 0.8; }
        66% { transform: translate(-20px, 30px) scale(0.9); opacity: 0.5; }
    }

    .dp-hero-content {
        text-align: center;
        z-index: 1;
        padding: 40px 20px;
    }

    .dp-badge {
        display: inline-block;
        background: transparent;
        border: 1px solid rgba(198, 169, 98, 0.5);
        color: #C6A962;
        font-family: "Cinzel", serif;
        font-size: 11px;
        padding: 14px 35px;
        border-radius: 50px;
        letter-spacing: 4px;
        margin-bottom: 40px;
    }

    .dp-nombre {
        font-family: "Cinzel", serif;
        font-size: clamp(52px, 12vw, 120px);
        color: #fff;
        margin: 0 0 25px 0;
        font-weight: 400;
        letter-spacing: 6px;
        text-shadow: 0 0 80px rgba(198, 169, 98, 0.4);
    }

    .dp-tipo {
        font-family: "Cormorant Garamond", serif;
        font-size: 22px;
        color: rgba(255,255,255,0.45);
        font-style: italic;
        letter-spacing: 3px;
    }

    /* SECCIONES */
    .dp-section { padding: 100px 20px; }
    .dp-container { max-width: 900px; margin: 0 auto; }

    /* Seccion Crema */
    .dp-cream {
        background: linear-gradient(180deg, #FAF8F5 0%, #F5F1EB 100%);
        position: relative;
    }

    .dp-floating-card {
        background: #fff;
        border-radius: 28px;
        padding: 60px;
        max-width: 1100px;
        margin: -80px auto 0;
        box-shadow:
            0 30px 100px rgba(0,0,0,0.12),
            0 15px 40px rgba(0,0,0,0.08),
            0 0 0 1px rgba(0,0,0,0.03);
        position: relative;
        z-index: 10;
    }

    .dp-gallery-precio {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 60px;
        align-items: start;
    }

    .dp-main-img img {
        width: 100%;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }

    .dp-thumbs {
        display: flex;
        gap: 12px;
        margin-top: 18px;
    }

    .dp-thumbs img {
        width: 75px;
        height: 75px;
        object-fit: cover;
        border-radius: 12px;
        cursor: pointer;
        opacity: 0.6;
        transition: all 0.3s;
        border: 3px solid transparent;
    }

    .dp-thumbs img:hover,
    .dp-thumbs img.active {
        opacity: 1;
        border-color: #C6A962;
    }

    .dp-info h2 {
        font-family: "Cinzel", serif;
        font-size: 38px;
        color: #1a1a1a;
        margin: 0 0 18px 0;
        font-weight: 500;
    }

    .dp-precio {
        font-family: "Cinzel", serif;
        font-size: 34px;
        color: #C6A962;
        margin-bottom: 25px;
    }

    .dp-short-desc {
        font-family: "Cormorant Garamond", serif;
        font-size: 19px;
        color: #555;
        line-height: 1.8;
        margin-bottom: 35px;
    }

    .dp-btn-primary {
        display: block;
        width: 100%;
        background: #1a1a1a;
        color: #C6A962;
        border: none;
        padding: 22px 40px;
        font-family: "Cinzel", serif;
        font-size: 15px;
        letter-spacing: 3px;
        cursor: pointer;
        border-radius: 10px;
        transition: all 0.4s;
        margin-bottom: 28px;
    }

    .dp-btn-primary:hover {
        background: #C6A962;
        color: #0a0a0a;
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(198, 169, 98, 0.35);
    }

    .dp-garantias {
        display: flex;
        gap: 25px;
        flex-wrap: wrap;
    }

    .dp-garantias span {
        font-size: 14px;
        color: #888;
    }

    /* Seccion Oscura */
    .dp-dark {
        background: #0a0a0a;
    }

    .dp-section-title {
        font-family: "Cinzel", serif;
        font-size: 38px;
        color: #C6A962;
        text-align: center;
        margin: 0 0 50px 0;
        font-weight: 400;
        letter-spacing: 3px;
    }

    .dp-historia {
        font-family: "Cormorant Garamond", serif;
        font-size: 21px;
        color: rgba(255,255,255,0.75);
        line-height: 2;
        text-align: center;
        max-width: 800px;
        margin: 0 auto;
    }

    .dp-historia p { margin-bottom: 1.8em; }

    /* Seccion Blanca */
    .dp-white {
        background: #fff;
    }

    .dp-section-title-dark {
        font-family: "Cinzel", serif;
        font-size: 38px;
        color: #1a1a1a;
        text-align: center;
        margin: 0 0 60px 0;
        font-weight: 400;
        letter-spacing: 3px;
    }

    .dp-fortalezas {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 50px;
        max-width: 1000px;
        margin: 0 auto;
    }

    .dp-fortaleza {
        text-align: center;
        padding: 40px 30px;
        background: #FAFAFA;
        border-radius: 20px;
        transition: all 0.3s;
    }

    .dp-fortaleza:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 50px rgba(0,0,0,0.08);
    }

    .dp-fortaleza-icon {
        font-size: 50px;
        display: block;
        margin-bottom: 25px;
    }

    .dp-fortaleza h3 {
        font-family: "Cinzel", serif;
        font-size: 20px;
        color: #1a1a1a;
        margin: 0;
        font-weight: 500;
    }

    /* Card Ritual */
    .dp-ritual-card {
        max-width: 850px;
        text-align: center;
        margin-top: 0;
    }

    .dp-ritual-content {
        font-family: "Cormorant Garamond", serif;
        font-size: 19px;
        color: #444;
        line-height: 1.9;
    }

    .dp-ritual-content ol {
        text-align: left;
        max-width: 550px;
        margin: 35px auto;
        padding-left: 25px;
    }

    .dp-ritual-content li {
        margin-bottom: 18px;
        padding-left: 12px;
    }

    .dp-ritual-nota {
        font-style: italic;
        color: #888;
        margin-top: 35px;
        font-size: 17px;
    }

    /* CTA Final */
    .dp-cta-final {
        text-align: center;
        padding: 120px 20px;
    }

    .dp-cta-titulo {
        font-family: "Cinzel", serif;
        font-size: clamp(34px, 5vw, 52px);
        color: #fff;
        margin: 0 0 25px 0;
        font-weight: 400;
    }

    .dp-cta-precio {
        font-family: "Cinzel", serif;
        font-size: 40px;
        color: #C6A962;
        margin-bottom: 40px;
    }

    .dp-btn-large {
        display: inline-block;
        width: auto;
        padding: 25px 70px;
        font-size: 17px;
    }

    .dp-cta-sub {
        font-family: "Cormorant Garamond", serif;
        font-size: 17px;
        color: rgba(255,255,255,0.4);
        font-style: italic;
        margin-top: 30px;
    }

    /* Responsive */
    @media (max-width: 900px) {
        .dp-gallery-precio {
            grid-template-columns: 1fr;
            gap: 40px;
        }

        .dp-floating-card {
            padding: 35px 25px;
            margin: -60px 15px 0;
            border-radius: 20px;
        }

        .dp-fortalezas {
            grid-template-columns: 1fr;
            gap: 25px;
        }

        .dp-hero { min-height: 55vh; }
        .dp-section { padding: 70px 15px; }
        .dp-nombre { letter-spacing: 2px; }
        .dp-info h2 { font-size: 28px; }
        .dp-precio { font-size: 26px; }
    }
    ';
}
