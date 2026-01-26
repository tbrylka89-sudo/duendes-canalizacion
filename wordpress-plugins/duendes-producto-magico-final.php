<?php
/**
 * Plugin Name: Duendes Producto Magico Final
 * Description: Pagina de producto inmersiva con colores por categoria
 * Version: 2.0
 */

if (!defined('ABSPATH')) exit;

// Interceptar pagina de producto
add_action('template_redirect', function() {
    if (is_product()) {
        duendes_render_producto_magico();
        exit;
    }
});

function duendes_render_producto_magico() {
    global $post, $product;

    $product = wc_get_product($post->ID);
    if (!$product) {
        wp_redirect(home_url('/shop/'));
        exit;
    }

    $nombre = $post->post_title;
    $precio_usd = $product->get_price();
    $precio_uyu = get_post_meta($post->ID, '_duendes_precio_uyu', true) ?: round($precio_usd * 43);
    $sena_uyu = round($precio_uyu * 0.3);

    // Datos del meta
    $tipo = get_post_meta($post->ID, '_duendes_tipo', true) ?: 'Guardian';
    $elemento = get_post_meta($post->ID, '_duendes_elemento', true) ?: 'Tierra';

    // Imagenes
    $imagen_principal = get_the_post_thumbnail_url($post->ID, 'full');
    $gallery_ids = $product->get_gallery_image_ids();

    // Detectar categoria para colores
    $cats = wp_get_post_terms($post->ID, 'product_cat', ['fields' => 'slugs']);
    $categoria_slug = !empty($cats) ? $cats[0] : 'proteccion';

    // Colores por categoria
    $colores_categoria = [
        'proteccion' => ['primario' => '#4A6FA5', 'claro' => '#E8F0FE', 'oscuro' => '#1a2a4a', 'nombre' => 'Proteccion'],
        'abundancia' => ['primario' => '#2E7D32', 'claro' => '#E8F5E9', 'oscuro' => '#1a3a1a', 'nombre' => 'Abundancia'],
        'amor' => ['primario' => '#C2185B', 'claro' => '#FCE4EC', 'oscuro' => '#4a1a2a', 'nombre' => 'Amor'],
        'salud' => ['primario' => '#00897B', 'claro' => '#E0F2F1', 'oscuro' => '#1a3a3a', 'nombre' => 'Salud'],
        'sanacion' => ['primario' => '#00897B', 'claro' => '#E0F2F1', 'oscuro' => '#1a3a3a', 'nombre' => 'Sanacion'],
        'sabiduria' => ['primario' => '#7B1FA2', 'claro' => '#F3E5F5', 'oscuro' => '#2a1a3a', 'nombre' => 'Sabiduria'],
    ];

    $colores = $colores_categoria[$categoria_slug] ?? $colores_categoria['proteccion'];
    $categoria_nombre = $colores['nombre'];

    // Obtener descripcion larga
    $descripcion = $product->get_description();

    // Obtener datos de Vercel si existen
    $historia = get_post_meta($post->ID, '_duendes_historia', true) ?: '';
    $mensaje = get_post_meta($post->ID, '_duendes_mensaje', true) ?: '';
    $dones = get_post_meta($post->ID, '_duendes_dones', true) ?: [];
    $ritual = get_post_meta($post->ID, '_duendes_ritual', true) ?: '';

    ?>
    <!DOCTYPE html>
    <html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo('charset'); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?php echo esc_html($nombre); ?> - Duendes del Uruguay</title>
        <?php wp_head(); ?>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">
        <style>
            :root {
                --cat-primario: <?php echo $colores['primario']; ?>;
                --cat-claro: <?php echo $colores['claro']; ?>;
                --cat-oscuro: <?php echo $colores['oscuro']; ?>;
                --dorado: #C6A962;
                --dorado-claro: #d4bc7a;
                --negro: #0a0a0a;
                --crema: #FAF8F5;
            }

            * { box-sizing: border-box; margin: 0; padding: 0; }

            body {
                font-family: 'Cormorant Garamond', Georgia, serif;
                background: var(--crema);
                color: #2a2a2a;
                line-height: 1.6;
            }

            /* ═══════════════════════════════════════════════════════════════ */
            /* HEADER FIJO */
            /* ═══════════════════════════════════════════════════════════════ */
            .header-magico {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                background: rgba(10,10,10,0.95);
                backdrop-filter: blur(10px);
                padding: 15px 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(198,169,98,0.2);
            }

            .header-logo {
                font-family: 'Cinzel', serif;
                font-size: 18px;
                color: var(--dorado);
                text-decoration: none;
                letter-spacing: 3px;
            }

            .header-nav {
                display: flex;
                gap: 30px;
            }

            .header-nav a {
                color: rgba(255,255,255,0.7);
                text-decoration: none;
                font-size: 14px;
                letter-spacing: 1px;
                transition: color 0.3s;
            }

            .header-nav a:hover {
                color: var(--dorado);
            }

            .header-cart {
                position: relative;
                color: var(--dorado);
                text-decoration: none;
                font-size: 20px;
            }

            /* ═══════════════════════════════════════════════════════════════ */
            /* HERO CON COLOR DE CATEGORIA */
            /* ═══════════════════════════════════════════════════════════════ */
            .hero-producto {
                min-height: 70vh;
                background: linear-gradient(135deg, var(--negro) 0%, var(--cat-oscuro) 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 120px 40px 80px;
                position: relative;
                overflow: hidden;
            }

            .hero-producto::before {
                content: '';
                position: absolute;
                inset: 0;
                background: radial-gradient(ellipse at center, var(--cat-primario) 0%, transparent 70%);
                opacity: 0.15;
            }

            .hero-producto::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 150px;
                background: linear-gradient(to top, var(--crema), transparent);
            }

            .hero-content {
                position: relative;
                z-index: 2;
                text-align: center;
                max-width: 900px;
            }

            .hero-categoria {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                background: var(--cat-primario);
                color: #fff;
                padding: 8px 24px;
                border-radius: 30px;
                font-size: 12px;
                letter-spacing: 3px;
                text-transform: uppercase;
                margin-bottom: 25px;
                font-weight: 500;
            }

            .hero-nombre {
                font-family: 'Cinzel', serif;
                font-size: clamp(42px, 8vw, 72px);
                color: #fff;
                letter-spacing: 8px;
                text-transform: uppercase;
                margin-bottom: 15px;
                text-shadow: 0 4px 30px rgba(0,0,0,0.3);
            }

            .hero-subtitulo {
                font-size: 22px;
                color: var(--dorado);
                font-style: italic;
                margin-bottom: 30px;
            }

            .hero-specs {
                display: flex;
                justify-content: center;
                gap: 40px;
                flex-wrap: wrap;
            }

            .hero-spec {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }

            .hero-spec-label {
                font-size: 11px;
                color: rgba(255,255,255,0.5);
                letter-spacing: 2px;
                text-transform: uppercase;
            }

            .hero-spec-value {
                font-size: 16px;
                color: #fff;
                font-weight: 500;
            }

            /* ═══════════════════════════════════════════════════════════════ */
            /* CONTENIDO PRINCIPAL - 2 COLUMNAS */
            /* ═══════════════════════════════════════════════════════════════ */
            .main-content {
                max-width: 1400px;
                margin: 0 auto;
                padding: 60px 40px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 60px;
            }

            /* GALERIA */
            .galeria {
                position: sticky;
                top: 100px;
                height: fit-content;
            }

            .galeria-principal {
                position: relative;
                border-radius: 20px;
                overflow: hidden;
                background: #fff;
                box-shadow: 0 30px 60px rgba(0,0,0,0.1);
                border: 3px solid var(--cat-claro);
            }

            .galeria-principal img {
                width: 100%;
                aspect-ratio: 4/5;
                object-fit: cover;
                cursor: zoom-in;
                transition: transform 0.5s;
            }

            .galeria-principal:hover img {
                transform: scale(1.02);
            }

            .galeria-badge {
                position: absolute;
                top: 20px;
                left: 20px;
                background: var(--cat-primario);
                color: #fff;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 1px;
                text-transform: uppercase;
            }

            .galeria-thumbs {
                display: flex;
                gap: 12px;
                margin-top: 15px;
                overflow-x: auto;
                padding-bottom: 5px;
            }

            .galeria-thumb {
                width: 80px;
                height: 80px;
                border-radius: 10px;
                overflow: hidden;
                cursor: pointer;
                border: 3px solid transparent;
                transition: all 0.3s;
                flex-shrink: 0;
            }

            .galeria-thumb:hover,
            .galeria-thumb.active {
                border-color: var(--cat-primario);
                transform: translateY(-3px);
            }

            .galeria-thumb img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            /* INFO PRODUCTO */
            .info-producto {
                padding-top: 20px;
            }

            .info-etiquetas {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                margin-bottom: 20px;
            }

            .etiqueta {
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
            }

            .etiqueta-tipo {
                background: var(--cat-claro);
                color: var(--cat-primario);
            }

            .etiqueta-elemento {
                background: rgba(198,169,98,0.15);
                color: var(--dorado);
            }

            .etiqueta-unico {
                background: #ff6b6b22;
                color: #ff6b6b;
            }

            .info-descripcion {
                font-size: 18px;
                line-height: 1.8;
                color: #555;
                margin-bottom: 30px;
            }

            .precio-box {
                background: linear-gradient(135deg, var(--cat-claro), #fff);
                border: 2px solid var(--cat-primario);
                border-radius: 16px;
                padding: 25px;
                margin-bottom: 25px;
            }

            .precio-principal {
                font-family: 'Cinzel', serif;
                font-size: 42px;
                color: var(--negro);
                font-weight: 600;
            }

            .precio-moneda {
                font-size: 20px;
                color: #888;
            }

            .precio-alternativo {
                font-size: 14px;
                color: #888;
                margin-top: 5px;
            }

            .btn-comprar {
                display: block;
                width: 100%;
                padding: 20px;
                background: linear-gradient(135deg, var(--cat-primario), <?php echo adjustBrightness($colores['primario'], -20); ?>);
                border: none;
                border-radius: 12px;
                color: #fff;
                font-family: 'Cinzel', serif;
                font-size: 16px;
                font-weight: 600;
                letter-spacing: 2px;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.3s;
                text-decoration: none;
                text-align: center;
                margin-bottom: 12px;
            }

            .btn-comprar:hover {
                transform: translateY(-3px);
                box-shadow: 0 15px 40px <?php echo $colores['primario']; ?>44;
            }

            .btn-sena {
                display: block;
                width: 100%;
                padding: 15px;
                background: transparent;
                border: 2px solid var(--cat-primario);
                border-radius: 12px;
                color: var(--cat-primario);
                font-family: 'Cinzel', serif;
                font-size: 14px;
                letter-spacing: 1px;
                cursor: pointer;
                transition: all 0.3s;
                text-decoration: none;
                text-align: center;
            }

            .btn-sena:hover {
                background: var(--cat-claro);
            }

            .garantias-mini {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-top: 25px;
                padding: 20px;
                background: #f8f8f8;
                border-radius: 12px;
            }

            .garantia-mini {
                text-align: center;
                font-size: 12px;
                color: #666;
            }

            .garantia-mini span {
                display: block;
                font-size: 24px;
                margin-bottom: 5px;
            }

            /* ═══════════════════════════════════════════════════════════════ */
            /* SECCIONES DE CONTENIDO */
            /* ═══════════════════════════════════════════════════════════════ */
            .seccion {
                padding: 80px 40px;
                max-width: 1000px;
                margin: 0 auto;
            }

            .seccion-full {
                max-width: 100%;
                padding: 80px 40px;
            }

            .seccion-inner {
                max-width: 1000px;
                margin: 0 auto;
            }

            .seccion-titulo {
                font-family: 'Cinzel', serif;
                font-size: clamp(28px, 5vw, 40px);
                text-align: center;
                margin-bottom: 15px;
                letter-spacing: 3px;
            }

            .seccion-subtitulo {
                text-align: center;
                font-size: 18px;
                color: #888;
                font-style: italic;
                margin-bottom: 40px;
            }

            /* Historia - fondo con color de categoria */
            .seccion-historia {
                background: linear-gradient(180deg, var(--cat-claro) 0%, var(--crema) 100%);
            }

            .seccion-historia .seccion-titulo {
                color: var(--cat-primario);
            }

            .historia-texto {
                font-size: 19px;
                line-height: 2;
                text-align: justify;
                color: #444;
            }

            .historia-texto::first-letter {
                font-size: 60px;
                float: left;
                line-height: 1;
                padding-right: 15px;
                color: var(--cat-primario);
                font-family: 'Cinzel', serif;
            }

            /* Mensaje del Guardian */
            .seccion-mensaje {
                background: var(--negro);
                color: #fff;
            }

            .seccion-mensaje .seccion-titulo {
                color: var(--dorado);
            }

            .mensaje-contenido {
                position: relative;
                padding: 40px;
                background: rgba(255,255,255,0.03);
                border-radius: 20px;
                border: 1px solid rgba(198,169,98,0.2);
            }

            .mensaje-contenido::before {
                content: '"';
                position: absolute;
                top: -20px;
                left: 30px;
                font-size: 120px;
                color: var(--cat-primario);
                opacity: 0.3;
                font-family: 'Cinzel', serif;
                line-height: 1;
            }

            .mensaje-texto {
                font-size: 22px;
                line-height: 1.9;
                font-style: italic;
                color: rgba(255,255,255,0.9);
                position: relative;
                z-index: 1;
            }

            .mensaje-firma {
                margin-top: 30px;
                text-align: right;
                color: var(--dorado);
                font-family: 'Cinzel', serif;
            }

            /* Dones */
            .seccion-dones .seccion-titulo {
                color: var(--cat-primario);
            }

            .dones-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 25px;
            }

            .don-card {
                background: #fff;
                padding: 30px;
                border-radius: 16px;
                border: 2px solid transparent;
                box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                transition: all 0.3s;
                position: relative;
                overflow: hidden;
            }

            .don-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: var(--cat-primario);
                transform: scaleX(0);
                transition: transform 0.3s;
            }

            .don-card:hover {
                border-color: var(--cat-primario);
                transform: translateY(-5px);
            }

            .don-card:hover::before {
                transform: scaleX(1);
            }

            .don-icono {
                width: 50px;
                height: 50px;
                background: var(--cat-claro);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                margin-bottom: 15px;
            }

            .don-nombre {
                font-family: 'Cinzel', serif;
                font-size: 18px;
                color: var(--cat-primario);
                margin-bottom: 10px;
            }

            .don-descripcion {
                font-size: 15px;
                color: #666;
                line-height: 1.6;
            }

            /* Ritual de Bienvenida */
            .seccion-ritual {
                background: linear-gradient(180deg, var(--negro), var(--cat-oscuro));
                color: #fff;
            }

            .seccion-ritual .seccion-titulo {
                color: var(--dorado);
            }

            .ritual-pasos {
                display: grid;
                gap: 30px;
            }

            .ritual-paso {
                display: grid;
                grid-template-columns: 70px 1fr;
                gap: 25px;
                align-items: start;
            }

            .paso-numero {
                width: 70px;
                height: 70px;
                background: var(--cat-primario);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Cinzel', serif;
                font-size: 28px;
                color: #fff;
                font-weight: 600;
                flex-shrink: 0;
            }

            .paso-contenido h4 {
                font-family: 'Cinzel', serif;
                font-size: 20px;
                color: var(--dorado);
                margin-bottom: 10px;
            }

            .paso-contenido p {
                font-size: 16px;
                color: rgba(255,255,255,0.8);
                line-height: 1.7;
            }

            /* CTA Final */
            .cta-final {
                background: var(--negro);
                padding: 100px 40px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }

            .cta-final::before {
                content: '';
                position: absolute;
                inset: 0;
                background: radial-gradient(ellipse at center, var(--cat-primario) 0%, transparent 70%);
                opacity: 0.1;
            }

            .cta-urgencia {
                display: inline-block;
                background: #ff6b6b22;
                color: #ff6b6b;
                padding: 8px 20px;
                border-radius: 20px;
                font-size: 13px;
                letter-spacing: 2px;
                text-transform: uppercase;
                margin-bottom: 25px;
                position: relative;
                z-index: 1;
            }

            .cta-titulo {
                font-family: 'Cinzel', serif;
                font-size: clamp(32px, 5vw, 48px);
                color: #fff;
                margin-bottom: 15px;
                position: relative;
                z-index: 1;
            }

            .cta-nombre {
                color: var(--cat-primario);
            }

            .cta-precio {
                font-family: 'Cinzel', serif;
                font-size: 56px;
                color: var(--dorado);
                margin: 30px 0;
                position: relative;
                z-index: 1;
            }

            .cta-btn {
                display: inline-block;
                padding: 22px 70px;
                background: linear-gradient(135deg, var(--cat-primario), <?php echo adjustBrightness($colores['primario'], -20); ?>);
                border: none;
                border-radius: 14px;
                color: #fff;
                font-family: 'Cinzel', serif;
                font-size: 18px;
                font-weight: 600;
                letter-spacing: 3px;
                text-transform: uppercase;
                cursor: pointer;
                text-decoration: none;
                transition: all 0.3s;
                position: relative;
                z-index: 1;
            }

            .cta-btn:hover {
                transform: translateY(-4px);
                box-shadow: 0 25px 60px <?php echo $colores['primario']; ?>55;
            }

            /* ═══════════════════════════════════════════════════════════════ */
            /* FOOTER */
            /* ═══════════════════════════════════════════════════════════════ */
            .footer-producto {
                background: #0a0a0a;
                padding: 60px 40px;
                text-align: center;
                border-top: 1px solid rgba(198,169,98,0.2);
            }

            .footer-logo {
                font-family: 'Cinzel', serif;
                font-size: 24px;
                color: var(--dorado);
                margin-bottom: 20px;
                letter-spacing: 5px;
            }

            .footer-links {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin-bottom: 30px;
                flex-wrap: wrap;
            }

            .footer-links a {
                color: rgba(255,255,255,0.6);
                text-decoration: none;
                font-size: 14px;
                transition: color 0.3s;
            }

            .footer-links a:hover {
                color: var(--dorado);
            }

            .footer-copy {
                color: rgba(255,255,255,0.4);
                font-size: 13px;
            }

            /* ═══════════════════════════════════════════════════════════════ */
            /* RESPONSIVE */
            /* ═══════════════════════════════════════════════════════════════ */
            @media (max-width: 968px) {
                .main-content {
                    grid-template-columns: 1fr;
                    gap: 40px;
                }

                .galeria {
                    position: relative;
                    top: 0;
                }

                .header-nav {
                    display: none;
                }

                .hero-producto {
                    min-height: 50vh;
                    padding: 100px 20px 60px;
                }

                .hero-nombre {
                    letter-spacing: 4px;
                }

                .seccion {
                    padding: 60px 20px;
                }

                .ritual-paso {
                    grid-template-columns: 1fr;
                    text-align: center;
                }

                .paso-numero {
                    margin: 0 auto 15px;
                }

                .garantias-mini {
                    grid-template-columns: 1fr;
                }
            }

            /* Animaciones */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .animate-in {
                animation: fadeInUp 0.6s ease forwards;
            }
        </style>
    </head>
    <body>
        <!-- HEADER -->
        <header class="header-magico">
            <a href="<?php echo home_url(); ?>" class="header-logo">DUENDES DEL URUGUAY</a>
            <nav class="header-nav">
                <a href="<?php echo home_url('/shop/'); ?>">Tienda</a>
                <a href="<?php echo home_url('/sobre-nosotros/'); ?>">Nosotros</a>
                <a href="<?php echo home_url('/contacto/'); ?>">Contacto</a>
            </nav>
            <a href="<?php echo wc_get_cart_url(); ?>" class="header-cart">🛒</a>
        </header>

        <!-- HERO -->
        <section class="hero-producto">
            <div class="hero-content">
                <div class="hero-categoria">
                    <span>✦</span>
                    <?php echo esc_html($categoria_nombre); ?>
                </div>
                <h1 class="hero-nombre"><?php echo esc_html($nombre); ?></h1>
                <p class="hero-subtitulo">Guardian del <?php echo esc_html($categoria_nombre); ?></p>
                <div class="hero-specs">
                    <div class="hero-spec">
                        <span class="hero-spec-label">Tipo</span>
                        <span class="hero-spec-value"><?php echo esc_html($tipo); ?></span>
                    </div>
                    <div class="hero-spec">
                        <span class="hero-spec-label">Elemento</span>
                        <span class="hero-spec-value"><?php echo esc_html($elemento); ?></span>
                    </div>
                    <div class="hero-spec">
                        <span class="hero-spec-label">Proposito</span>
                        <span class="hero-spec-value"><?php echo esc_html($categoria_nombre); ?></span>
                    </div>
                </div>
            </div>
        </section>

        <!-- CONTENIDO PRINCIPAL -->
        <main class="main-content">
            <!-- GALERIA -->
            <div class="galeria">
                <div class="galeria-principal">
                    <div class="galeria-badge">Pieza Unica</div>
                    <?php if ($imagen_principal): ?>
                        <img src="<?php echo esc_url($imagen_principal); ?>" alt="<?php echo esc_attr($nombre); ?>" id="imagen-principal">
                    <?php endif; ?>
                </div>
                <?php if (!empty($gallery_ids)): ?>
                <div class="galeria-thumbs">
                    <div class="galeria-thumb active" onclick="cambiarImagen('<?php echo esc_url($imagen_principal); ?>', this)">
                        <img src="<?php echo esc_url($imagen_principal); ?>" alt="Principal">
                    </div>
                    <?php foreach ($gallery_ids as $img_id):
                        $img_url = wp_get_attachment_image_url($img_id, 'full');
                    ?>
                    <div class="galeria-thumb" onclick="cambiarImagen('<?php echo esc_url($img_url); ?>', this)">
                        <img src="<?php echo esc_url($img_url); ?>" alt="Galeria">
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>

            <!-- INFO -->
            <div class="info-producto">
                <div class="info-etiquetas">
                    <span class="etiqueta etiqueta-tipo"><?php echo esc_html($tipo); ?></span>
                    <span class="etiqueta etiqueta-elemento"><?php echo esc_html($elemento); ?></span>
                    <span class="etiqueta etiqueta-unico">Pieza Unica</span>
                </div>

                <p class="info-descripcion">
                    <?php echo wp_kses_post($product->get_short_description() ?: substr(strip_tags($descripcion), 0, 300) . '...'); ?>
                </p>

                <div class="precio-box">
                    <div class="precio-principal">
                        $<?php echo number_format($precio_uyu, 0, ',', '.'); ?> <span class="precio-moneda">UYU</span>
                    </div>
                    <div class="precio-alternativo">
                        o USD $<?php echo number_format($precio_usd, 0); ?>
                    </div>
                </div>

                <a href="<?php echo esc_url($product->add_to_cart_url()); ?>" class="btn-comprar">
                    ✦ Sellar el Pacto
                </a>
                <button class="btn-sena" onclick="mostrarModalSena()">
                    Reservar con sena $<?php echo number_format($sena_uyu, 0, ',', '.'); ?> UYU
                </button>

                <div class="garantias-mini">
                    <div class="garantia-mini">
                        <span>🛡️</span>
                        30 dias garantia
                    </div>
                    <div class="garantia-mini">
                        <span>📦</span>
                        Envio seguro
                    </div>
                    <div class="garantia-mini">
                        <span>✨</span>
                        Canalizacion incluida
                    </div>
                </div>
            </div>
        </main>

        <!-- HISTORIA -->
        <?php if ($historia || $descripcion): ?>
        <section class="seccion seccion-historia">
            <h2 class="seccion-titulo">Su Historia</h2>
            <p class="seccion-subtitulo">El origen de <?php echo esc_html($nombre); ?></p>
            <div class="historia-texto">
                <?php echo wp_kses_post($historia ?: $descripcion); ?>
            </div>
        </section>
        <?php endif; ?>

        <!-- MENSAJE DEL GUARDIAN -->
        <?php if ($mensaje): ?>
        <section class="seccion-full seccion-mensaje">
            <div class="seccion-inner">
                <h2 class="seccion-titulo">Su Mensaje Para Vos</h2>
                <div class="mensaje-contenido">
                    <p class="mensaje-texto"><?php echo wp_kses_post($mensaje); ?></p>
                    <p class="mensaje-firma">— <?php echo esc_html($nombre); ?></p>
                </div>
            </div>
        </section>
        <?php endif; ?>

        <!-- DONES -->
        <section class="seccion seccion-dones">
            <h2 class="seccion-titulo">Sus Dones</h2>
            <p class="seccion-subtitulo">Lo que <?php echo esc_html($nombre); ?> puede aportar a tu vida</p>
            <div class="dones-grid">
                <?php
                $dones_default = [
                    ['icono' => '🛡️', 'nombre' => ucfirst($categoria_nombre), 'desc' => 'Te acompana en el proposito de ' . strtolower($categoria_nombre)],
                    ['icono' => '✨', 'nombre' => 'Energia positiva', 'desc' => 'Transforma la energia de tu espacio'],
                    ['icono' => '🌿', 'nombre' => 'Conexion natural', 'desc' => 'Te conecta con el mundo elemental'],
                    ['icono' => '💫', 'nombre' => 'Guia espiritual', 'desc' => 'Te acompana en tu camino interior'],
                ];
                $dones_mostrar = !empty($dones) ? $dones : $dones_default;
                foreach ($dones_mostrar as $don):
                ?>
                <div class="don-card">
                    <div class="don-icono"><?php echo esc_html($don['icono'] ?? '✦'); ?></div>
                    <h3 class="don-nombre"><?php echo esc_html($don['nombre']); ?></h3>
                    <p class="don-descripcion"><?php echo esc_html($don['desc'] ?? $don['descripcion'] ?? ''); ?></p>
                </div>
                <?php endforeach; ?>
            </div>
        </section>

        <!-- RITUAL -->
        <section class="seccion-full seccion-ritual">
            <div class="seccion-inner">
                <h2 class="seccion-titulo">Ritual de Bienvenida</h2>
                <p class="seccion-subtitulo" style="color: rgba(255,255,255,0.6);">Como recibir a <?php echo esc_html($nombre); ?> en tu hogar</p>
                <div class="ritual-pasos">
                    <div class="ritual-paso">
                        <div class="paso-numero">1</div>
                        <div class="paso-contenido">
                            <h4>Prepara el espacio</h4>
                            <p>Limpia el lugar donde vivira. Podes usar sahumerio, incienso o simplemente abrir las ventanas para renovar la energia.</p>
                        </div>
                    </div>
                    <div class="ritual-paso">
                        <div class="paso-numero">2</div>
                        <div class="paso-contenido">
                            <h4>Presentate</h4>
                            <p>Cuando llegue, tomalo con ambas manos. Dile tu nombre y que estas feliz de recibirlo. Puede sonar simple, pero ellos escuchan.</p>
                        </div>
                    </div>
                    <div class="ritual-paso">
                        <div class="paso-numero">3</div>
                        <div class="paso-contenido">
                            <h4>Ubicalo con intencion</h4>
                            <p>Elegí un lugar especial donde pueda observar y proteger. Evita lugares muy transitados o cerca de aparatos electronicos.</p>
                        </div>
                    </div>
                    <div class="ritual-paso">
                        <div class="paso-numero">4</div>
                        <div class="paso-contenido">
                            <h4>Ofrenda inicial</h4>
                            <p>Un vaso de agua, una vela, o simplemente tu gratitud. Los guardianes aprecian los gestos sinceros mas que las ofrendas elaboradas.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA FINAL -->
        <section class="cta-final">
            <div class="cta-urgencia">⚡ Pieza unica - Cuando se va, desaparece para siempre</div>
            <h2 class="cta-titulo"><span class="cta-nombre"><?php echo esc_html($nombre); ?></span> te esta esperando</h2>
            <div class="cta-precio">$<?php echo number_format($precio_uyu, 0, ',', '.'); ?> UYU</div>
            <a href="<?php echo esc_url($product->add_to_cart_url()); ?>" class="cta-btn">✦ Sellar el Pacto</a>
        </section>

        <!-- FOOTER -->
        <footer class="footer-producto">
            <div class="footer-logo">DUENDES DEL URUGUAY</div>
            <div class="footer-links">
                <a href="<?php echo home_url('/shop/'); ?>">Tienda</a>
                <a href="<?php echo home_url('/sobre-nosotros/'); ?>">Nosotros</a>
                <a href="<?php echo home_url('/contacto/'); ?>">Contacto</a>
                <a href="<?php echo home_url('/terminos/'); ?>">Terminos</a>
            </div>
            <p class="footer-copy">© <?php echo date('Y'); ?> Duendes del Uruguay. Todos los derechos reservados.</p>
        </footer>

        <script>
        function cambiarImagen(url, thumb) {
            document.getElementById('imagen-principal').src = url;
            document.querySelectorAll('.galeria-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        }

        function mostrarModalSena() {
            alert('Funcion de sena - Proximamente');
        }

        // Animaciones al scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.seccion, .don-card, .ritual-paso').forEach(el => {
            observer.observe(el);
        });
        </script>

        <?php wp_footer(); ?>
    </body>
    </html>
    <?php
    exit;
}

// Funcion para ajustar brillo de color
function adjustBrightness($hex, $percent) {
    $hex = ltrim($hex, '#');
    $r = hexdec(substr($hex, 0, 2));
    $g = hexdec(substr($hex, 2, 2));
    $b = hexdec(substr($hex, 4, 2));

    $r = max(0, min(255, $r + ($r * $percent / 100)));
    $g = max(0, min(255, $g + ($g * $percent / 100)));
    $b = max(0, min(255, $b + ($b * $percent / 100)));

    return sprintf("#%02x%02x%02x", $r, $g, $b);
}

// Obtener datos de Vercel (si existe endpoint)
function duendes_obtener_datos_vercel($product_id) {
    $response = wp_remote_get("https://duendes-vercel.vercel.app/api/producto/{$product_id}", [
        'timeout' => 5
    ]);

    if (is_wp_error($response)) {
        return null;
    }

    $body = wp_remote_retrieve_body($response);
    return json_decode($body, true);
}
