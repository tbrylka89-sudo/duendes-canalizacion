<?php
/**
 * Plugin Name: Duendes Producto Epico
 * Description: Pagina de producto inmersiva con todas las secciones magicas
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Interceptar pagina de producto
add_action('template_redirect', function() {
    if (is_product()) {
        duendes_render_producto_epico();
        exit;
    }
});

function duendes_render_producto_epico() {
    global $post, $product;

    $product = wc_get_product($post->ID);
    if (!$product) {
        wp_redirect(home_url('/tienda/'));
        exit;
    }

    $nombre = $post->post_title;
    $precio_usd = $product->get_price();
    $precio_uyu = get_post_meta($post->ID, '_duendes_precio_uyu', true) ?: ($precio_usd * 43);

    // Obtener datos de Vercel KV
    $datos_vercel = duendes_obtener_datos_vercel($post->ID);

    // Datos del meta de WordPress (fallback)
    $tipo = get_post_meta($post->ID, '_duendes_tipo', true) ?: 'Guardián';
    $elemento = get_post_meta($post->ID, '_duendes_elemento', true) ?: 'Tierra';
    $propositos = get_post_meta($post->ID, '_duendes_propositos', true) ?: [];
    $proposito_principal = is_array($propositos) && !empty($propositos) ? ucfirst($propositos[0]) : 'Protección';

    // Imagenes
    $imagen_principal = get_the_post_thumbnail_url($post->ID, 'full');
    $gallery_ids = $product->get_gallery_image_ids();

    // Categorias
    $cats = wp_get_post_terms($post->ID, 'product_cat');
    $categoria = !empty($cats) ? $cats[0]->name : 'Guardián';

    get_header();
    ?>
    <style>
        :root {
            --dorado: #C6A962;
            --dorado-claro: #d4bc7a;
            --negro: #0a0a0a;
            --gris-oscuro: #1a1a1a;
            --crema: #FAF8F5;
        }

        * { box-sizing: border-box; }

        body {
            background: var(--crema);
        }

        .producto-epico {
            font-family: 'Cormorant Garamond', Georgia, serif;
            color: #2a2a2a;
        }

        /* HERO BANNER */
        .hero-banner {
            position: relative;
            height: 70vh;
            min-height: 500px;
            background: linear-gradient(180deg, var(--negro) 0%, #1a1510 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .hero-bg {
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at center, rgba(198,169,98,0.1) 0%, transparent 60%);
        }

        .hero-content {
            position: relative;
            z-index: 2;
            text-align: center;
            padding: 40px;
        }

        .hero-badge {
            display: inline-block;
            background: rgba(198,169,98,0.15);
            border: 1px solid var(--dorado);
            padding: 8px 24px;
            border-radius: 30px;
            color: var(--dorado);
            font-size: 12px;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 20px;
        }

        .hero-nombre {
            font-family: 'Cinzel', serif;
            font-size: clamp(48px, 10vw, 80px);
            color: #fff;
            margin: 0 0 10px 0;
            letter-spacing: 8px;
            text-transform: uppercase;
        }

        .hero-subtitulo {
            font-size: 20px;
            color: var(--dorado);
            font-style: italic;
            margin: 0;
        }

        .hero-specs {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 30px;
            flex-wrap: wrap;
        }

        .hero-spec {
            color: rgba(255,255,255,0.6);
            font-size: 14px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .hero-spec span {
            color: var(--dorado);
        }

        /* CONTENIDO PRINCIPAL */
        .contenido-principal {
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
        }

        .galeria-principal img {
            width: 100%;
            aspect-ratio: 4/5;
            object-fit: cover;
        }

        .galeria-thumbs {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        .galeria-thumb {
            width: 80px;
            height: 80px;
            border-radius: 10px;
            overflow: hidden;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.3s;
        }

        .galeria-thumb:hover, .galeria-thumb.active {
            border-color: var(--dorado);
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

        .producto-precio {
            margin-bottom: 30px;
        }

        .precio-principal {
            font-family: 'Cinzel', serif;
            font-size: 42px;
            color: var(--negro);
            font-weight: 600;
        }

        .precio-secundario {
            color: #888;
            font-size: 16px;
            margin-top: 5px;
        }

        .btn-sellar-pacto {
            display: block;
            width: 100%;
            padding: 20px 40px;
            background: linear-gradient(135deg, var(--dorado), #a88a42);
            border: none;
            border-radius: 12px;
            color: #000;
            font-family: 'Cinzel', serif;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            text-align: center;
            margin-bottom: 15px;
        }

        .btn-sellar-pacto:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(198,169,98,0.3);
        }

        .btn-sena {
            display: block;
            width: 100%;
            padding: 15px 40px;
            background: transparent;
            border: 2px solid var(--dorado);
            border-radius: 12px;
            color: var(--dorado);
            font-family: 'Cinzel', serif;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            text-align: center;
        }

        .btn-sena:hover {
            background: rgba(198,169,98,0.1);
        }

        .garantias {
            display: flex;
            gap: 20px;
            margin-top: 30px;
            padding: 20px;
            background: rgba(198,169,98,0.05);
            border-radius: 12px;
        }

        .garantia-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            color: #666;
        }

        .garantia-item span {
            font-size: 20px;
        }

        /* SECCIONES */
        .seccion {
            padding: 80px 40px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .seccion-oscura {
            background: var(--negro);
            color: #fff;
            max-width: 100%;
        }

        .seccion-oscura .seccion-inner {
            max-width: 1000px;
            margin: 0 auto;
        }

        .seccion-titulo {
            font-family: 'Cinzel', serif;
            font-size: clamp(28px, 5vw, 42px);
            color: var(--dorado);
            text-align: center;
            margin-bottom: 40px;
            letter-spacing: 3px;
        }

        .seccion-oscura .seccion-titulo {
            color: var(--dorado);
        }

        .seccion-texto {
            font-size: 19px;
            line-height: 1.9;
            text-align: justify;
            color: #444;
        }

        .seccion-oscura .seccion-texto {
            color: rgba(255,255,255,0.8);
        }

        /* VIDA ANTERIOR - la seccion mas importante */
        .vida-anterior {
            background: linear-gradient(180deg, var(--crema) 0%, #f0ebe4 100%);
            position: relative;
        }

        .vida-anterior::before {
            content: '"';
            position: absolute;
            top: 40px;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Cinzel', serif;
            font-size: 200px;
            color: rgba(198,169,98,0.1);
            line-height: 1;
        }

        .vida-anterior .seccion-texto {
            position: relative;
            z-index: 1;
            font-size: 21px;
            font-style: italic;
        }

        /* MENSAJE DIRECTO */
        .mensaje-directo {
            background: var(--negro);
            color: #fff;
            text-align: center;
        }

        .mensaje-directo .mensaje-texto {
            font-size: 24px;
            font-style: italic;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            color: rgba(255,255,255,0.9);
        }

        .mensaje-firma {
            margin-top: 30px;
            color: var(--dorado);
            font-family: 'Cinzel', serif;
            font-size: 18px;
        }

        /* DONES */
        .dones-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }

        .don-card {
            background: #fff;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            border: 1px solid rgba(198,169,98,0.2);
            transition: all 0.3s;
        }

        .don-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            border-color: var(--dorado);
        }

        .don-nombre {
            font-family: 'Cinzel', serif;
            font-size: 18px;
            color: var(--dorado);
            margin-bottom: 10px;
        }

        .don-descripcion {
            font-size: 15px;
            color: #666;
            line-height: 1.6;
        }

        /* SENALES */
        .senales-lista {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .senales-lista li {
            padding: 20px 0;
            border-bottom: 1px solid rgba(198,169,98,0.2);
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .senales-lista li::before {
            content: '✧';
            color: var(--dorado);
            font-size: 24px;
        }

        /* RITUAL */
        .ritual-pasos {
            display: grid;
            gap: 30px;
            margin-top: 40px;
        }

        .ritual-paso {
            display: grid;
            grid-template-columns: 60px 1fr;
            gap: 20px;
            align-items: start;
        }

        .paso-numero {
            width: 60px;
            height: 60px;
            background: var(--dorado);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Cinzel', serif;
            font-size: 24px;
            color: #000;
            font-weight: 600;
        }

        .paso-contenido h4 {
            font-family: 'Cinzel', serif;
            font-size: 20px;
            color: var(--dorado);
            margin: 0 0 10px 0;
        }

        .paso-contenido p {
            font-size: 16px;
            color: rgba(255,255,255,0.7);
            margin: 0;
            line-height: 1.6;
        }

        /* CUIDADOS */
        .cuidados-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin-top: 40px;
        }

        .cuidado-card {
            background: rgba(198,169,98,0.05);
            padding: 25px;
            border-radius: 12px;
            border-left: 3px solid var(--dorado);
        }

        .cuidado-card h4 {
            font-family: 'Cinzel', serif;
            color: var(--dorado);
            margin: 0 0 10px 0;
            font-size: 16px;
        }

        .cuidado-card p {
            margin: 0;
            font-size: 15px;
            color: #555;
            line-height: 1.6;
        }

        /* AFINIDADES */
        .afinidades-grid {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 40px;
        }

        .afinidad-card {
            background: #fff;
            padding: 20px 30px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            border: 1px solid rgba(198,169,98,0.2);
            min-width: 200px;
        }

        .afinidad-nombre {
            font-family: 'Cinzel', serif;
            font-size: 18px;
            color: var(--negro);
            margin-bottom: 5px;
        }

        .afinidad-porque {
            font-size: 13px;
            color: #888;
            font-style: italic;
        }

        /* GARANTIA */
        .garantia-magica {
            background: linear-gradient(135deg, rgba(198,169,98,0.1), rgba(198,169,98,0.05));
            border: 2px solid var(--dorado);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
        }

        .garantia-titulo {
            font-family: 'Cinzel', serif;
            font-size: 28px;
            color: var(--dorado);
            margin-bottom: 20px;
        }

        .garantia-puntos {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 30px;
            flex-wrap: wrap;
        }

        .garantia-punto {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 15px;
            color: #555;
        }

        .garantia-punto::before {
            content: '✓';
            color: var(--dorado);
            font-weight: bold;
        }

        /* CTA FINAL */
        .cta-final {
            background: var(--negro);
            padding: 80px 40px;
            text-align: center;
        }

        .cta-urgencia {
            font-size: 16px;
            color: #ff6b6b;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 20px;
        }

        .cta-titulo {
            font-family: 'Cinzel', serif;
            font-size: 36px;
            color: #fff;
            margin-bottom: 30px;
        }

        .cta-precio {
            font-family: 'Cinzel', serif;
            font-size: 48px;
            color: var(--dorado);
            margin-bottom: 30px;
        }

        .cta-btn {
            display: inline-block;
            padding: 20px 60px;
            background: linear-gradient(135deg, var(--dorado), #a88a42);
            border: none;
            border-radius: 12px;
            color: #000;
            font-family: 'Cinzel', serif;
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 3px;
            text-transform: uppercase;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s;
        }

        .cta-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 50px rgba(198,169,98,0.4);
        }

        /* RELACIONADOS */
        .relacionados {
            padding: 60px 40px;
            background: var(--crema);
        }

        .relacionados-titulo {
            font-family: 'Cinzel', serif;
            font-size: 28px;
            text-align: center;
            color: var(--negro);
            margin-bottom: 40px;
        }

        .relacionados-grid {
            display: flex;
            gap: 30px;
            justify-content: center;
            flex-wrap: wrap;
            max-width: 1200px;
            margin: 0 auto;
        }

        .relacionado-card {
            width: 250px;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            transition: all 0.3s;
            text-decoration: none;
        }

        .relacionado-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .relacionado-img {
            aspect-ratio: 1;
            overflow: hidden;
        }

        .relacionado-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s;
        }

        .relacionado-card:hover .relacionado-img img {
            transform: scale(1.1);
        }

        .relacionado-info {
            padding: 20px;
            text-align: center;
        }

        .relacionado-nombre {
            font-family: 'Cinzel', serif;
            font-size: 18px;
            color: var(--negro);
            margin-bottom: 5px;
        }

        .relacionado-precio {
            color: var(--dorado);
            font-size: 16px;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
            .contenido-principal {
                grid-template-columns: 1fr;
                padding: 40px 20px;
            }

            .galeria {
                position: relative;
                top: 0;
            }

            .hero-banner {
                height: 50vh;
                min-height: 400px;
            }

            .seccion {
                padding: 60px 20px;
            }

            .cuidados-grid {
                grid-template-columns: 1fr;
            }

            .garantias {
                flex-direction: column;
            }
        }

        /* ═══════════════════════════════════════════════════════════════
           FORZAR COLORES - Evitar conflictos con WooCommerce/Theme
        ═══════════════════════════════════════════════════════════════ */

        /* Secciones con fondo oscuro = texto blanco */
        .hero-banner,
        .hero-banner *,
        .seccion.fondo-oscuro,
        .seccion.fondo-oscuro *,
        .mensaje-directo-seccion,
        .mensaje-directo-seccion * {
            color: #fff !important;
        }

        .hero-banner .hero-badge,
        .hero-banner .hero-subtitulo,
        .seccion.fondo-oscuro .seccion-titulo,
        .seccion.fondo-oscuro h2,
        .seccion.fondo-oscuro h3,
        .mensaje-directo-seccion .seccion-titulo {
            color: var(--dorado) !important;
        }

        .hero-banner .hero-spec {
            color: rgba(255,255,255,0.6) !important;
        }

        .hero-banner .hero-spec span {
            color: var(--dorado) !important;
        }

        /* Secciones con fondo claro = texto oscuro */
        .contenido-principal,
        .contenido-principal *,
        .seccion:not(.fondo-oscuro),
        .seccion:not(.fondo-oscuro) * {
            color: #2a2a2a;
        }

        .contenido-principal .seccion-titulo,
        .contenido-principal h2,
        .contenido-principal h3,
        .seccion:not(.fondo-oscuro) .seccion-titulo {
            color: var(--dorado) !important;
        }

        /* Info producto */
        .info-producto, .info-producto * {
            color: #2a2a2a !important;
        }

        .info-producto .precio-principal {
            color: var(--negro) !important;
        }

        .info-producto .precio-secundario {
            color: #888 !important;
        }

        /* Dones */
        .don-nombre {
            color: var(--dorado) !important;
        }

        .don-descripcion {
            color: #666 !important;
        }

        /* ═══════════════════════════════════════════════════════════════
           MÓVIL - Estilos completos
        ═══════════════════════════════════════════════════════════════ */

        @media (max-width: 768px) {
            /* Asegurar que el body tenga fondo correcto */
            body {
                background: var(--crema) !important;
            }

            /* Header de WordPress visible */
            .site-header,
            header,
            #masthead,
            .main-navigation,
            nav {
                position: relative !important;
                z-index: 9999 !important;
            }

            /* Ocultar admin bar en móvil si molesta */
            #wpadminbar {
                display: none !important;
            }

            html {
                margin-top: 0 !important;
            }

            /* Hero más pequeño en móvil */
            .hero-banner {
                height: auto !important;
                min-height: 350px !important;
                padding: 60px 20px !important;
            }

            .hero-nombre {
                font-size: 32px !important;
                letter-spacing: 3px !important;
            }

            .hero-subtitulo {
                font-size: 16px !important;
            }

            .hero-specs {
                gap: 15px !important;
            }

            .hero-spec {
                font-size: 12px !important;
            }

            /* Galería en móvil */
            .galeria-principal img {
                aspect-ratio: 1/1 !important;
            }

            .galeria-thumbs {
                overflow-x: auto !important;
                padding-bottom: 10px !important;
            }

            .galeria-thumb {
                flex-shrink: 0 !important;
            }

            /* Precios en móvil */
            .precio-principal {
                font-size: 32px !important;
            }

            /* Botones en móvil */
            .btn-sellar-pacto,
            .btn-sena {
                padding: 15px 20px !important;
                font-size: 14px !important;
            }

            /* Secciones en móvil */
            .seccion {
                padding: 40px 15px !important;
            }

            .seccion-titulo {
                font-size: 24px !important;
            }

            /* Ritual en móvil */
            .ritual-paso {
                grid-template-columns: 50px 1fr !important;
            }

            .paso-numero {
                width: 50px !important;
                height: 50px !important;
                font-size: 20px !important;
            }

            /* CTA final en móvil */
            .cta-final {
                padding: 40px 20px !important;
            }

            .cta-nombre {
                font-size: 28px !important;
            }
        }

        /* FONTS */
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
    </style>

    <div class="producto-epico">
        <!-- HERO BANNER -->
        <section class="hero-banner">
            <div class="hero-bg"></div>
            <div class="hero-content">
                <div class="hero-badge">Pieza Única</div>
                <h1 class="hero-nombre"><?php echo esc_html($nombre); ?></h1>
                <p class="hero-subtitulo"><?php echo esc_html($datos_vercel['encabezado']['subtitulo'] ?? 'Guardián de ' . $proposito_principal); ?></p>
                <div class="hero-specs">
                    <div class="hero-spec"><span><?php echo ucfirst($tipo); ?></span></div>
                    <div class="hero-spec">•</div>
                    <div class="hero-spec"><span><?php echo ucfirst($elemento); ?></span></div>
                    <div class="hero-spec">•</div>
                    <div class="hero-spec"><span><?php echo $proposito_principal; ?></span></div>
                </div>
            </div>
        </section>

        <!-- CONTENIDO PRINCIPAL -->
        <section class="contenido-principal">
            <!-- GALERIA -->
            <div class="galeria">
                <div class="galeria-principal">
                    <img src="<?php echo esc_url($imagen_principal); ?>" alt="<?php echo esc_attr($nombre); ?>" id="imagen-principal">
                </div>
                <?php if (!empty($gallery_ids)): ?>
                <div class="galeria-thumbs">
                    <div class="galeria-thumb active" onclick="cambiarImagen('<?php echo esc_url($imagen_principal); ?>', this)">
                        <img src="<?php echo esc_url($imagen_principal); ?>" alt="">
                    </div>
                    <?php foreach ($gallery_ids as $img_id):
                        $img_url = wp_get_attachment_image_url($img_id, 'large');
                    ?>
                    <div class="galeria-thumb" onclick="cambiarImagen('<?php echo esc_url($img_url); ?>', this)">
                        <img src="<?php echo esc_url($img_url); ?>" alt="">
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>

            <!-- INFO PRODUCTO -->
            <div class="info-producto">
                <div class="producto-precio">
                    <div class="precio-principal" id="precio-mostrar">$<?php echo number_format($precio_uyu, 0, ',', '.'); ?> UYU</div>
                    <div class="precio-secundario">o $<?php echo number_format($precio_usd, 0); ?> USD</div>
                </div>

                <a href="<?php echo esc_url($product->add_to_cart_url()); ?>" class="btn-sellar-pacto">
                    Sellar el Pacto
                </a>

                <button class="btn-sena" onclick="mostrarModalSena()">
                    Reservar con seña (30% = $<?php echo number_format($precio_uyu * 0.3, 0, ',', '.'); ?>)
                </button>

                <div class="garantias">
                    <div class="garantia-item">
                        <span>🔒</span> Pago seguro
                    </div>
                    <div class="garantia-item">
                        <span>✨</span> Pieza única
                    </div>
                    <div class="garantia-item">
                        <span>🌍</span> Envío mundial
                    </div>
                </div>
            </div>
        </section>

        <!-- VIDA ANTERIOR -->
        <?php if (!empty($datos_vercel['vidaAnterior'])): ?>
        <section class="seccion vida-anterior">
            <h2 class="seccion-titulo"><?php echo esc_html($datos_vercel['vidaAnterior']['titulo'] ?? 'Antes de encontrarte...'); ?></h2>
            <div class="seccion-texto">
                <?php echo nl2br(esc_html($datos_vercel['vidaAnterior']['texto'] ?? '')); ?>
            </div>
        </section>
        <?php else: ?>
        <section class="seccion vida-anterior">
            <h2 class="seccion-titulo">Su Historia</h2>
            <div class="seccion-texto">
                <?php echo nl2br(esc_html(get_post_meta($post->ID, '_duendes_historia', true) ?: $post->post_content)); ?>
            </div>
        </section>
        <?php endif; ?>

        <!-- EL ENCUENTRO -->
        <?php if (!empty($datos_vercel['elEncuentro'])): ?>
        <section class="seccion seccion-oscura">
            <div class="seccion-inner">
                <h2 class="seccion-titulo"><?php echo esc_html($datos_vercel['elEncuentro']['titulo']); ?></h2>
                <div class="seccion-texto">
                    <?php echo nl2br(esc_html($datos_vercel['elEncuentro']['texto'])); ?>
                </div>
            </div>
        </section>
        <?php endif; ?>

        <!-- MENSAJE DIRECTO -->
        <?php if (!empty($datos_vercel['mensajeDirecto'])): ?>
        <section class="seccion mensaje-directo seccion-oscura">
            <div class="seccion-inner">
                <h2 class="seccion-titulo"><?php echo esc_html($datos_vercel['mensajeDirecto']['titulo'] ?? $nombre . ' tiene algo que decirte'); ?></h2>
                <div class="mensaje-texto">
                    "<?php echo esc_html($datos_vercel['mensajeDirecto']['mensaje']); ?>"
                </div>
                <div class="mensaje-firma">— <?php echo esc_html($nombre); ?></div>
            </div>
        </section>
        <?php endif; ?>

        <!-- DONES -->
        <?php if (!empty($datos_vercel['dones']['lista'])): ?>
        <section class="seccion">
            <h2 class="seccion-titulo"><?php echo esc_html($datos_vercel['dones']['titulo'] ?? 'Sus Dones'); ?></h2>
            <?php if (!empty($datos_vercel['dones']['intro'])): ?>
            <p class="seccion-texto" style="text-align: center; margin-bottom: 40px;">
                <?php echo esc_html($datos_vercel['dones']['intro']); ?>
            </p>
            <?php endif; ?>
            <div class="dones-grid">
                <?php foreach ($datos_vercel['dones']['lista'] as $don): ?>
                <div class="don-card">
                    <div class="don-nombre"><?php echo esc_html($don['nombre']); ?></div>
                    <div class="don-descripcion"><?php echo esc_html($don['descripcion']); ?></div>
                </div>
                <?php endforeach; ?>
            </div>
        </section>
        <?php else: ?>
        <!-- Fallback con fortalezas de meta -->
        <?php
        $fortalezas = get_post_meta($post->ID, '_duendes_fortalezas', true);
        if ($fortalezas):
            $fortalezas_arr = array_filter(array_map('trim', explode("\n", $fortalezas)));
        ?>
        <section class="seccion">
            <h2 class="seccion-titulo">Sus Dones</h2>
            <div class="dones-grid">
                <?php foreach ($fortalezas_arr as $fortaleza): ?>
                <div class="don-card">
                    <div class="don-nombre"><?php echo esc_html($fortaleza); ?></div>
                </div>
                <?php endforeach; ?>
            </div>
        </section>
        <?php endif; ?>
        <?php endif; ?>

        <!-- SENALES -->
        <?php if (!empty($datos_vercel['señales']['lista'])): ?>
        <section class="seccion seccion-oscura">
            <div class="seccion-inner">
                <h2 class="seccion-titulo"><?php echo esc_html($datos_vercel['señales']['titulo'] ?? 'Señales de que es para vos'); ?></h2>
                <ul class="senales-lista">
                    <?php foreach ($datos_vercel['señales']['lista'] as $senal): ?>
                    <li><?php echo esc_html($senal); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </section>
        <?php endif; ?>

        <!-- RITUAL -->
        <?php if (!empty($datos_vercel['ritual']['pasos'])): ?>
        <section class="seccion seccion-oscura">
            <div class="seccion-inner">
                <h2 class="seccion-titulo"><?php echo esc_html($datos_vercel['ritual']['titulo'] ?? 'Ritual de Bienvenida'); ?></h2>
                <?php if (!empty($datos_vercel['ritual']['intro'])): ?>
                <p class="seccion-texto" style="text-align: center; margin-bottom: 40px;">
                    <?php echo esc_html($datos_vercel['ritual']['intro']); ?>
                </p>
                <?php endif; ?>
                <div class="ritual-pasos">
                    <?php foreach ($datos_vercel['ritual']['pasos'] as $paso): ?>
                    <div class="ritual-paso">
                        <div class="paso-numero"><?php echo esc_html($paso['paso']); ?></div>
                        <div class="paso-contenido">
                            <h4><?php echo esc_html($paso['titulo']); ?></h4>
                            <p><?php echo esc_html($paso['descripcion']); ?></p>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php if (!empty($datos_vercel['ritual']['cierre'])): ?>
                <p style="text-align: center; color: var(--dorado); font-style: italic; margin-top: 40px; font-size: 18px;">
                    <?php echo esc_html($datos_vercel['ritual']['cierre']); ?>
                </p>
                <?php endif; ?>
            </div>
        </section>
        <?php endif; ?>

        <!-- CUIDADOS -->
        <?php if (!empty($datos_vercel['cuidados'])): ?>
        <section class="seccion">
            <h2 class="seccion-titulo"><?php echo esc_html($datos_vercel['cuidados']['titulo'] ?? 'Cómo cuidar a ' . $nombre); ?></h2>
            <div class="cuidados-grid">
                <?php if (!empty($datos_vercel['cuidados']['ubicacion'])): ?>
                <div class="cuidado-card">
                    <h4>Ubicación</h4>
                    <p><?php echo esc_html($datos_vercel['cuidados']['ubicacion']); ?></p>
                </div>
                <?php endif; ?>
                <?php if (!empty($datos_vercel['cuidados']['limpieza'])): ?>
                <div class="cuidado-card">
                    <h4>Limpieza Energética</h4>
                    <p><?php echo esc_html($datos_vercel['cuidados']['limpieza']); ?></p>
                </div>
                <?php endif; ?>
                <?php if (!empty($datos_vercel['cuidados']['fechasEspeciales'])): ?>
                <div class="cuidado-card">
                    <h4>Fechas Especiales</h4>
                    <p><?php echo esc_html($datos_vercel['cuidados']['fechasEspeciales']); ?></p>
                </div>
                <?php endif; ?>
                <?php if (!empty($datos_vercel['cuidados']['queSiente'])): ?>
                <div class="cuidado-card">
                    <h4>Qué Podés Sentir</h4>
                    <p><?php echo esc_html($datos_vercel['cuidados']['queSiente']); ?></p>
                </div>
                <?php endif; ?>
            </div>
        </section>
        <?php endif; ?>

        <!-- AFINIDADES -->
        <?php if (!empty($datos_vercel['afinidades']['guardianes'])): ?>
        <section class="seccion" style="background: #f5f0e8;">
            <h2 class="seccion-titulo"><?php echo esc_html($datos_vercel['afinidades']['titulo'] ?? 'Guardianes con los que congenia'); ?></h2>
            <?php if (!empty($datos_vercel['afinidades']['texto'])): ?>
            <p class="seccion-texto" style="text-align: center; margin-bottom: 30px;">
                <?php echo esc_html($datos_vercel['afinidades']['texto']); ?>
            </p>
            <?php endif; ?>
            <div class="afinidades-grid">
                <?php foreach ($datos_vercel['afinidades']['guardianes'] as $guardian): ?>
                <div class="afinidad-card">
                    <div class="afinidad-nombre"><?php echo esc_html($guardian['nombre']); ?></div>
                    <div class="afinidad-porque"><?php echo esc_html($guardian['porque']); ?></div>
                </div>
                <?php endforeach; ?>
            </div>
        </section>
        <?php endif; ?>

        <!-- GARANTIA MAGICA -->
        <?php if (!empty($datos_vercel['garantiaMagica'])): ?>
        <section class="seccion">
            <div class="garantia-magica">
                <h3 class="garantia-titulo"><?php echo esc_html($datos_vercel['garantiaMagica']['titulo'] ?? 'Nuestra Garantía Mágica'); ?></h3>
                <p class="seccion-texto" style="text-align: center;">
                    <?php echo esc_html($datos_vercel['garantiaMagica']['texto']); ?>
                </p>
                <?php if (!empty($datos_vercel['garantiaMagica']['puntos'])): ?>
                <div class="garantia-puntos">
                    <?php foreach ($datos_vercel['garantiaMagica']['puntos'] as $punto): ?>
                    <div class="garantia-punto"><?php echo esc_html($punto); ?></div>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>
        </section>
        <?php endif; ?>

        <!-- CTA FINAL -->
        <section class="cta-final">
            <?php if (!empty($datos_vercel['urgencia'])): ?>
            <div class="cta-urgencia"><?php echo esc_html($datos_vercel['urgencia']['principal']); ?></div>
            <?php else: ?>
            <div class="cta-urgencia"><?php echo esc_html($nombre); ?> eligió manifestarse UNA sola vez</div>
            <?php endif; ?>

            <h2 class="cta-titulo"><?php echo esc_html($nombre); ?> te está esperando</h2>
            <div class="cta-precio">$<?php echo number_format($precio_uyu, 0, ',', '.'); ?> UYU</div>

            <a href="<?php echo esc_url($product->add_to_cart_url()); ?>" class="cta-btn">
                Sellar el Pacto
            </a>

            <?php if (!empty($datos_vercel['urgencia']['llamadoFinal'])): ?>
            <p style="color: rgba(255,255,255,0.6); margin-top: 30px; font-style: italic;">
                <?php echo esc_html($datos_vercel['urgencia']['llamadoFinal']); ?>
            </p>
            <?php endif; ?>
        </section>

        <!-- RELACIONADOS -->
        <?php
        $relacionados = wc_get_related_products($post->ID, 4);
        if (!empty($relacionados)):
        ?>
        <section class="relacionados">
            <h2 class="relacionados-titulo">Otros guardianes que podrían elegirte</h2>
            <div class="relacionados-grid">
                <?php foreach ($relacionados as $rel_id):
                    $rel_product = wc_get_product($rel_id);
                    if (!$rel_product) continue;
                ?>
                <a href="<?php echo get_permalink($rel_id); ?>" class="relacionado-card">
                    <div class="relacionado-img">
                        <img src="<?php echo get_the_post_thumbnail_url($rel_id, 'medium'); ?>" alt="<?php echo esc_attr($rel_product->get_name()); ?>">
                    </div>
                    <div class="relacionado-info">
                        <div class="relacionado-nombre"><?php echo esc_html($rel_product->get_name()); ?></div>
                        <div class="relacionado-precio">$<?php echo number_format($rel_product->get_price(), 0); ?> USD</div>
                    </div>
                </a>
                <?php endforeach; ?>
            </div>
        </section>
        <?php endif; ?>
    </div>

    <script>
    function cambiarImagen(url, thumb) {
        document.getElementById('imagen-principal').src = url;
        document.querySelectorAll('.galeria-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    }

    function mostrarModalSena() {
        alert('Próximamente: Sistema de reservas con seña');
    }

    // Geolocalizar precio
    (async function() {
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            const pais = data.country_code;

            const precioUSD = <?php echo $precio_usd; ?>;
            const tasas = {
                UY: { moneda: 'UYU', tasa: 43, simbolo: '$' },
                AR: { moneda: 'ARS', tasa: 1050, simbolo: '$' },
                BR: { moneda: 'BRL', tasa: 5.2, simbolo: 'R$' },
                DEFAULT: { moneda: 'USD', tasa: 1, simbolo: '$' }
            };

            const config = tasas[pais] || tasas.DEFAULT;
            const precioLocal = Math.round(precioUSD * config.tasa);

            document.getElementById('precio-mostrar').textContent =
                config.simbolo + precioLocal.toLocaleString('es-UY') + ' ' + config.moneda;
        } catch(e) {}
    })();
    </script>

    <?php
    get_footer();
}

// Obtener datos de Vercel KV
function duendes_obtener_datos_vercel($product_id) {
    $url = 'https://duendes-vercel.vercel.app/api/producto/' . $product_id;

    $response = wp_remote_get($url, [
        'timeout' => 10,
        'headers' => ['Accept' => 'application/json']
    ]);

    if (is_wp_error($response)) {
        return [];
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    return is_array($data) ? $data : [];
}
