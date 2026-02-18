<?php
/**
 * Plugin Name: Duendes Tienda Experiencia
 * Description: Reorganiza la tienda en carruseles por tamano
 * Version: 3.1
 */

if (!defined('ABSPATH')) exit;

add_action('wp_footer', function() {
    if (!is_shop() && !is_product_category()) return;

    // Detectar si es página de categoría (para mostrar grilla) o shop principal (carruseles)
    $es_categoria = is_product_category();
    $categoria_actual = '';
    $categoria_nombre = '';
    if ($es_categoria) {
        $term = get_queried_object();
        if ($term) {
            $categoria_actual = $term->slug;
            $categoria_nombre = $term->name;
        }
    }
    ?>
    <style>
    /* Ocultar el grid original pero no los datos */
    .productos-grid,
    .cat-pill,
    .duendes-cats,
    ul.products {
        position: absolute !important;
        left: -9999px !important;
        visibility: hidden !important;
    }

    /* =====================================================
       BANNER DEL SHOP - Bajar para que no quede tapado
       ===================================================== */
    /* El header fijo tapa el contenido, agregar espacio arriba */
    body.post-type-archive-product,
    body.tax-product_cat,
    body.woocommerce-shop {
        padding-top: 80px !important;
    }

    /* Todos los posibles contenedores del banner */
    .tienda-hero,
    .productos-section,
    .shop-header,
    .woocommerce-products-header,
    .elementor-location-archive .elementor-section:first-child,
    .elementor-location-archive > .elementor > .elementor-section:first-child,
    .archive.woocommerce .elementor-section:first-child {
        margin-top: 20px !important;
    }

    /* Si hay un hero de Elementor, también bajarlo */
    .elementor-location-archive .elementor-element:first-child,
    .woocommerce-page .elementor-widget-container:first-child {
        padding-top: 20px !important;
    }

    /* Contenedor principal */
    .dte-tienda {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
        background: #0a0a0a !important;
    }

    /* =====================================================
       ADOPTADOS - Estilo Lejano Oeste
       ===================================================== */
    .guardian-card.adoptado,
    .dte-card.adoptado {
        position: relative;
        opacity: 0.85;
    }

    .guardian-card.adoptado .guardian-img,
    .guardian-card.adoptado img,
    .dte-card.adoptado .dte-card-img {
        border-radius: 50% !important;
        filter: grayscale(40%);
    }

    /* Cartel ADOPTADO estilo wanted poster - sobresale de la imagen */
    .guardian-card.adoptado::before {
        content: 'ADOPTADO';
        position: absolute;
        top: 15px;
        left: 50%;
        transform: translateX(-50%) rotate(-8deg);
        background: linear-gradient(135deg, #8B0000 0%, #a00000 50%, #6B0000 100%);
        color: #fff;
        font-family: "Cinzel", serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 2px;
        padding: 6px 15px;
        border: 2px solid #f4e4bc;
        border-radius: 3px;
        box-shadow:
            0 4px 15px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.15);
        z-index: 20;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
    }

    /* Ocultar cualquier otro badge de adoptado que venga de otro plugin */
    .guardian-card.adoptado .adoptado-badge,
    .guardian-card.adoptado .badge-adoptado,
    .guardian-card.adoptado [class*="adoptado"] span,
    .guardian-card.adoptado .cartel-adoptado,
    .cartel-adoptado {
        display: none !important;
    }

    .dte-header {
        display: none; /* Ocultar porque ya hay header de Elementor */
    }

    .dte-titulo {
        font-family: "Cinzel", serif;
        font-size: clamp(24px, 5vw, 36px);
        letter-spacing: 8px;
        color: #fff;
        margin: 0 0 15px 0;
        font-weight: 400;
    }

    .dte-subtitulo {
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(16px, 3vw, 22px);
        font-style: italic;
        color: rgba(255,255,255,0.6);
        margin: 0;
    }

    /* Categorias */
    .dte-categorias {
        display: flex;
        justify-content: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 30px;
    }

    .dte-cat {
        font-family: "Cinzel", serif;
        font-size: 11px;
        letter-spacing: 1px;
        text-transform: uppercase;
        padding: 10px 20px;
        border: 1px solid rgba(201,162,39,0.25);
        background: transparent;
        color: rgba(255,255,255,0.6);
        text-decoration: none;
        transition: all 0.3s;
    }

    .dte-cat:hover,
    .dte-cat.active {
        border-color: #C9A227;
        color: #C9A227;
        background: rgba(201,162,39,0.1);
    }

    /* Buscador - Premium */
    .dte-buscador-wrap {
        display: flex;
        justify-content: center;
        margin: 40px 0 50px;
        padding: 0 20px;
    }

    .dte-buscador {
        position: relative;
        width: 100%;
        max-width: 600px;
    }

    .dte-buscador input {
        width: 100%;
        padding: 18px 50px 18px 25px;
        background: rgba(10,10,10,0.8);
        border: 1px solid rgba(201,162,39,0.4);
        border-radius: 30px;
        color: #fff;
        font-family: "Cormorant Garamond", serif;
        font-size: 18px;
        outline: none;
        transition: all 0.4s;
        text-align: left;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .dte-buscador input::placeholder {
        color: rgba(255,255,255,0.5);
    }

    .dte-buscador input:focus {
        border-color: #C9A227;
        background: rgba(15,15,15,0.95);
        box-shadow: 0 4px 30px rgba(201,162,39,0.15);
    }

    .dte-buscador::after {
        content: '🔍';
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 18px;
        opacity: 0.5;
        pointer-events: none;
    }

    /* Acciones circulares */
    .dte-acciones {
        display: flex;
        justify-content: center;
        gap: 60px;
        margin-bottom: 50px;
    }

    .dte-accion {
        text-align: center;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.3s;
    }

    .dte-accion:hover {
        transform: scale(1.05);
    }

    .dte-accion-circulo {
        width: 90px;
        height: 90px;
        border: 2px solid #C9A227;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 15px;
        background: radial-gradient(circle at 30% 30%, rgba(201,162,39,0.15), transparent);
        transition: all 0.4s;
        box-shadow: 0 0 20px rgba(201,162,39,0.1);
    }

    .dte-accion-circulo span {
        font-size: 32px;
        color: #C9A227;
    }

    .dte-accion:hover .dte-accion-circulo {
        background: radial-gradient(circle at 30% 30%, rgba(201,162,39,0.25), transparent);
        box-shadow: 0 0 40px rgba(201,162,39,0.3);
        transform: rotate(10deg);
    }

    .dte-accion-texto {
        font-family: "Cinzel", serif;
        font-size: 10px;
        letter-spacing: 2px;
        color: rgba(255,255,255,0.8);
        text-transform: uppercase;
        display: block;
    }

    /* Secciones por tamano */
    .dte-seccion-tamano {
        margin-bottom: 70px;
        padding: 25px 0;
        border-top: 1px solid rgba(0,245,255,0.15);
    }

    .dte-seccion-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        padding-bottom: 15px;
    }

    .dte-seccion-info {
        display: flex;
        align-items: baseline;
        gap: 15px;
    }

    .dte-seccion-nombre {
        font-family: "Cinzel", serif;
        font-size: 18px;
        letter-spacing: 4px;
        color: #fff;
        text-transform: uppercase;
        margin: 0;
        position: relative;
        padding-left: 15px;
    }

    .dte-seccion-nombre::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background: linear-gradient(to bottom, #ff00ff, #00f5ff);
        box-shadow: 0 0 10px #ff00ff;
    }

    .dte-seccion-precio {
        font-family: "Cormorant Garamond", serif;
        font-size: 16px;
        color: #ff00ff;
        text-shadow: 0 0 8px rgba(255,0,255,0.5);
    }

    .dte-seccion-cm {
        font-family: "Cormorant Garamond", serif;
        font-size: 14px;
        color: rgba(255,255,255,0.5);
        font-style: italic;
    }


    /* Textos de neuromarketing */
    .dte-seccion-copy {
        margin: 5px 0 25px 15px;
        max-width: 650px;
        padding-left: 15px;
        border-left: 1px solid rgba(255,0,255,0.3);
    }

    .dte-hook {
        font-family: "Cormorant Garamond", serif;
        font-size: 18px;
        font-style: italic;
        color: rgba(255,255,255,0.9);
        margin: 0 0 8px 0;
        line-height: 1.5;
    }

    .dte-beneficio {
        font-family: "Cormorant Garamond", serif;
        font-size: 14px;
        color: rgba(0,245,255,0.7);
        margin: 0;
    }

    /* =====================================================
       CARRUSEL - Con indicadores claros de scroll
       ===================================================== */
    .dte-carrusel-wrap {
        position: relative;
    }

    /* Gradiente de fade para mostrar que hay más */
    .dte-carrusel-wrap::before,
    .dte-carrusel-wrap::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 60px;
        z-index: 5;
        pointer-events: none;
    }

    .dte-carrusel-wrap::before {
        left: 0;
        background: linear-gradient(to right, #0a0a0a 0%, transparent 100%);
        opacity: 0;
        transition: opacity 0.3s;
    }

    .dte-carrusel-wrap::after {
        right: 0;
        background: linear-gradient(to left, #0a0a0a 0%, transparent 100%);
    }

    .dte-carrusel-wrap.scrolled::before {
        opacity: 1;
    }

    .dte-carrusel {
        display: flex;
        gap: 20px;
        overflow-x: auto;
        scroll-behavior: smooth;
        scrollbar-width: none;
        padding: 15px 0 25px;
        /* Padding horizontal para centrar primer y ultimo elemento */
        padding-left: calc(50% - 85px);
        padding-right: calc(50% - 85px);
        scroll-snap-type: x mandatory;
    }

    .dte-carrusel::-webkit-scrollbar {
        display: none;
    }

    /* Indicador DESLIZA animado */
    .dte-desliza {
        position: absolute;
        right: 70px;
        bottom: -5px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: "Cinzel", serif;
        font-size: 10px;
        letter-spacing: 2px;
        color: #00f5ff;
        text-transform: uppercase;
        animation: deslizaPulse 2s ease-in-out infinite;
        z-index: 6;
        text-shadow: 0 0 10px #00f5ff, 0 0 20px #00f5ff;
    }

    .dte-desliza::after {
        content: '→→';
        animation: deslizaMove 1s ease-in-out infinite;
    }

    @keyframes deslizaPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    @keyframes deslizaMove {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(5px); }
    }

    .dte-card {
        flex: 0 0 170px;
        text-decoration: none;
        transition: transform 0.3s;
        text-align: center;
        scroll-snap-align: center;
    }

    .dte-card:hover {
        transform: scale(1.08);
    }

    .dte-card-img {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 auto 15px;
        transition: all 0.4s;
        border: 2px solid transparent;
        box-shadow: 0 0 0 transparent;
    }

    .dte-card:hover .dte-card-img {
        border-color: #ff00ff;
        box-shadow: 0 0 25px rgba(255,0,255,0.4), 0 0 50px rgba(255,0,255,0.2);
    }

    .dte-card-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
    }

    .dte-card:hover .dte-card-img img {
        transform: scale(1.1);
    }

    .dte-card-nombre {
        font-family: "Cinzel", serif;
        font-size: 13px;
        color: #fff;
        margin-bottom: 5px;
    }

    .dte-card-precio {
        font-family: "Cormorant Garamond", serif;
        font-size: 13px;
        color: #00f5ff;
        text-shadow: 0 0 8px rgba(0,245,255,0.5);
    }

    /* Botón CONOCER en cada card */
    .dte-card-btn {
        display: inline-block;
        margin-top: 10px;
        padding: 8px 20px;
        font-family: "Cinzel", serif;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #ff00ff;
        background: transparent;
        border: 1px solid rgba(255,0,255,0.5);
        border-radius: 20px;
        transition: all 0.3s;
    }

    .dte-card:hover .dte-card-btn {
        background: rgba(255,0,255,0.15);
        border-color: #ff00ff;
        box-shadow: 0 0 15px rgba(255,0,255,0.3);
    }

    /* =====================================================
       BOTON VER TODOS - Grande y visible
       ===================================================== */
    .dte-ver-todos-btn {
        display: block;
        width: 100%;
        max-width: 300px;
        margin: 25px auto 0;
        padding: 15px 30px;
        font-family: "Cinzel", serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 3px;
        text-transform: uppercase;
        text-align: center;
        color: #0a0a0a;
        background: linear-gradient(135deg, #00f5ff 0%, #00d4ff 50%, #00f5ff 100%);
        border: none;
        border-radius: 30px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 20px rgba(0,245,255,0.4);
        text-decoration: none;
    }

    .dte-ver-todos-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 30px rgba(0,245,255,0.6);
        background: linear-gradient(135deg, #ff00ff 0%, #cc00cc 50%, #ff00ff 100%);
    }

    /* Vista grilla cuando se toca Ver Todos */
    .dte-grilla-view {
        display: none;
        padding: 20px 15px;
        width: 100%;
        box-sizing: border-box;
    }

    .dte-grilla-view.active {
        display: block;
    }

    .dte-grilla-productos {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 20px;
        width: 100%;
        padding: 0;
        margin: 0;
    }

    .dte-grilla-productos .dte-card {
        flex: none;
        width: 100%;
        min-width: 0;
        max-width: 100%;
    }

    .dte-grilla-productos .dte-card-img {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
        max-width: 180px;
        margin: 0 auto 15px;
    }

    .dte-volver-carrusel {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-family: "Cormorant Garamond", serif;
        font-size: 16px;
        color: #00f5ff;
        background: none;
        border: none;
        cursor: pointer;
        margin-bottom: 25px;
        transition: all 0.3s;
    }

    .dte-volver-carrusel:hover {
        color: #ff00ff;
        text-shadow: 0 0 10px currentColor;
    }

    /* Controles de navegación - DEBAJO del carrusel */
    .dte-nav-controles {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 20px;
        padding: 15px 0;
    }

    .dte-flecha {
        width: 60px;
        height: 60px;
        background: rgba(0,0,0,0.9);
        border: 2px solid #00f5ff;
        border-radius: 50%;
        color: #00f5ff;
        font-size: 28px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        box-shadow: 0 0 20px rgba(0,245,255,0.3);
    }

    .dte-flecha:hover {
        background: #00f5ff;
        color: #0a0a0a;
        box-shadow: 0 0 35px rgba(0,245,255,0.6);
        transform: scale(1.1);
    }

    .dte-flecha:active {
        transform: scale(0.95);
    }

    /* Contador entre las flechas */
    .dte-contador {
        font-family: "Cormorant Garamond", serif;
        font-size: 14px;
        color: rgba(255,255,255,0.5);
        font-style: italic;
        min-width: 100px;
        text-align: center;
    }

    /* Modal */
    .dte-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.95);
        z-index: 999999;
        justify-content: center;
        align-items: center;
    }

    .dte-modal.active { display: flex; }

    .dte-modal-content {
        text-align: center;
        padding: 40px;
        max-width: 100%;
    }

    .dte-modal-titulo {
        font-family: "Cinzel", serif;
        font-size: 12px;
        letter-spacing: 4px;
        color: #C9A227;
        margin-bottom: 8px;
        text-transform: uppercase;
    }

    .dte-modal-sub {
        font-family: "Cormorant Garamond", serif;
        font-size: 18px;
        font-style: italic;
        color: rgba(255,255,255,0.4);
        margin-bottom: 50px;
    }

    .dte-modal-productos {
        display: flex;
        gap: 30px;
        justify-content: center;
        margin-bottom: 50px;
        flex-wrap: wrap;
    }

    .dte-modal-card {
        width: 200px;
        text-decoration: none;
        opacity: 0;
        transform: scale(0.8) translateY(20px);
        transition: all 0.6s ease;
    }

    .dte-modal-card.show {
        opacity: 1;
        transform: scale(1) translateY(0);
    }

    .dte-modal-card img {
        width: 100%;
        aspect-ratio: 3/4;
        object-fit: cover;
        border: 1px solid rgba(201,162,39,0.2);
        margin-bottom: 15px;
    }

    .dte-modal-card-nombre {
        font-family: "Cinzel", serif;
        font-size: 13px;
        color: #fff;
        margin-bottom: 5px;
    }

    .dte-modal-card-precio {
        font-family: "Cormorant Garamond", serif;
        font-size: 14px;
        color: rgba(201,162,39,0.8);
    }

    .dte-modal-spinner {
        font-size: 50px;
        color: #C9A227;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .dte-modal-btns {
        display: flex;
        gap: 15px;
        justify-content: center;
    }

    .dte-modal-btn {
        font-family: "Cinzel", serif;
        font-size: 11px;
        letter-spacing: 2px;
        padding: 14px 30px;
        cursor: pointer;
        transition: all 0.3s;
        text-transform: uppercase;
    }

    .dte-modal-btn-reintentar {
        background: transparent;
        border: 1px solid rgba(201,162,39,0.3);
        color: #C9A227;
    }

    .dte-modal-btn-reintentar:hover {
        background: rgba(201,162,39,0.1);
    }

    .dte-modal-btn-cerrar {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.15);
        color: rgba(255,255,255,0.5);
    }

    .dte-modal-btn-cerrar:hover {
        border-color: rgba(255,255,255,0.3);
        color: rgba(255,255,255,0.8);
    }

    @media (max-width: 768px) {
        .dte-categorias { gap: 5px; }
        .dte-cat { padding: 8px 12px; font-size: 10px; }
        .dte-acciones { gap: 30px; }
        .dte-accion-circulo { width: 70px; height: 70px; }
        .dte-accion-circulo span { font-size: 26px; }

        /* MOBILE: 1 card a la vez, centrada perfectamente */
        .dte-carrusel {
            scroll-snap-type: x mandatory;
            /* Padding para centrar el primer y ultimo elemento */
            padding: 15px calc(50vw - 100px) 25px;
            gap: 15px;
        }
        .dte-card {
            flex: 0 0 200px;
            min-width: 200px;
            max-width: 200px;
            scroll-snap-align: center;
        }
        .dte-card-img {
            width: 180px;
            height: 180px;
        }
        .dte-card-nombre { font-size: 14px; }
        .dte-card-precio { font-size: 13px; }
        .dte-modal-card { width: 150px; }
        .dte-desliza {
            right: 10px;
            font-size: 10px;
        }
        .dte-seccion-nombre {
            font-size: 14px;
            letter-spacing: 2px;
        }
        .dte-seccion-precio {
            font-size: 13px;
        }
        .dte-hook {
            font-size: 15px;
        }
        .dte-beneficio {
            font-size: 12px;
        }
        .dte-seccion-header {
            flex-wrap: wrap;
            gap: 10px;
        }
        /* Controles grandes en mobile */
        .dte-nav-controles {
            gap: 15px;
            margin-top: 15px;
        }
        .dte-flecha {
            width: 55px;
            height: 55px;
            font-size: 26px;
        }
        .dte-contador {
            font-size: 12px;
            min-width: 80px;
        }
        /* Grilla: 2 columnas en mobile - RESETEAR padding del carrusel */
        .dte-grilla-view {
            padding: 15px 10px !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }
        .dte-grilla,
        .dte-grilla-productos {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        .dte-grilla .dte-card,
        .dte-grilla-productos .dte-card {
            flex: none !important;
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
            margin: 0 !important;
        }
        .dte-grilla .dte-card-img,
        .dte-grilla-productos .dte-card-img {
            width: 100% !important;
            height: auto !important;
            max-width: 100% !important;
            margin: 0 auto !important;
        }
        .dte-ver-todos-btn {
            font-size: 11px;
            padding: 12px 20px;
            max-width: 260px;
        }
    }

    /* ============================================
       VISTA GRILLA (para páginas de categoría)
       ============================================ */
    .dte-categoria-header {
        text-align: center;
        margin-bottom: 40px;
    }

    .dte-categoria-titulo {
        font-family: "Cinzel", serif;
        font-size: clamp(28px, 5vw, 42px);
        letter-spacing: 6px;
        color: #fff;
        margin: 0 0 10px 0;
        text-transform: uppercase;
    }

    .dte-categoria-count {
        font-family: "Cormorant Garamond", serif;
        font-size: 16px;
        color: rgba(255,255,255,0.5);
        font-style: italic;
    }

    .dte-grilla {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 30px;
        padding: 20px 0;
    }

    .dte-grilla .dte-card {
        flex: none;
        width: 100%;
    }

    .dte-grilla .dte-card-img {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
        max-width: 200px;
        margin: 0 auto 15px;
    }

    .dte-volver {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-family: "Cormorant Garamond", serif;
        font-size: 14px;
        color: rgba(201,162,39,0.7);
        text-decoration: none;
        margin-bottom: 30px;
        transition: color 0.3s;
    }

    .dte-volver:hover {
        color: #C9A227;
    }

    @media (max-width: 768px) {
        .dte-grilla {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        .dte-grilla .dte-card-img {
            max-width: 150px;
        }
    }
    </style>

    <div id="dte-container"></div>

    <script>
    (function() {
        // Datos desde PHP
        var esCategoria = <?php echo $es_categoria ? 'true' : 'false'; ?>;
        var categoriaSlug = '<?php echo esc_js($categoria_actual); ?>';
        var categoriaNombre = '<?php echo esc_js($categoria_nombre); ?>';

        var infoTamanos = {
            'mini': {
                nombre: 'MINI',
                nombrePlural: 'MINIS',
                precio: '$70 USD',
                cm: '~10cm',
                orden: 1,
                hook: 'Para llevar contigo a todos lados. Una guía silenciosa que solo vos percibís.',
                beneficio: 'Cabe en tu bolsillo, tu escritorio, tu mesa de luz. Siempre cerca, siempre presente.'
            },
            'mini-especial': {
                nombre: 'MINI ESPECIALES',
                nombrePlural: 'MINI ESPECIALES',
                precio: '$150 USD',
                cm: '~10cm',
                orden: 1.5,
                hook: 'Guardianes con poderes amplificados. Edición limitada con cristales premium.',
                beneficio: 'La misma portabilidad, el triple de magia. Para quienes buscan algo extraordinario.'
            },
            'pixie': {
                nombre: 'PIXIE',
                nombrePlural: 'PIXIES',
                precio: '$150 USD',
                cm: '10-13cm',
                orden: 2,
                hook: 'El tamaño perfecto para tu altar personal o rincón sagrado.',
                beneficio: 'Suficientemente pequeño para ser discreto, suficientemente presente para sentirlo.'
            },
            'mediano': {
                nombre: 'MEDIANOS',
                nombrePlural: 'MEDIANOS',
                precio: '$200 USD',
                cm: '17-22cm',
                orden: 3,
                hook: 'Presencia que transforma espacios. La pieza que todos admiran y preguntan de dónde salió.',
                beneficio: 'Ideal para tu escritorio, living o entrada. El tamaño que más eligen.'
            },
            'grande': {
                nombre: 'GRANDES',
                nombrePlural: 'GRANDES',
                precio: '$450 USD',
                cm: '25-28cm',
                orden: 4,
                hook: 'Un guardián imponente. Para quienes quieren que la magia sea innegable.',
                beneficio: 'Pieza central de cualquier espacio. Conversación garantizada, protección absoluta.'
            },
            'gigante': {
                nombre: 'GIGANTES',
                nombrePlural: 'GIGANTES',
                precio: '$1.050 USD',
                cm: '30+cm',
                orden: 5,
                hook: 'Obras maestras de protección. Guardianes ancestrales en su máxima expresión.',
                beneficio: 'Para coleccionistas y espacios que merecen lo extraordinario. Piezas de museo.'
            }
        };

        function initTienda() {
            // Leer productos del DOM existente (renderizado por duendes-clasificacion-productos)
            var cards = document.querySelectorAll('.guardian-card:not(.adoptado)');
            var productosPorTamano = {};
            var todosProductos = [];

            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];

                // Obtener tamano del span
                var tamanoEl = card.querySelector('.guardian-tamano');
                var tamanoText = tamanoEl ? tamanoEl.textContent.trim().toLowerCase() : 'mediano';

                // Obtener datos
                var img = card.querySelector('img');
                var nombreEl = card.querySelector('.guardian-nombre');
                var precioEl = card.querySelector('.guardian-precio');

                // Detectar Mini Especiales por PRECIO ($5500 UYU / $150 USD) + nombre
                var nombreProd = nombreEl ? nombreEl.textContent.trim().toLowerCase() : '';
                var precioTextoRaw = precioEl ? precioEl.textContent.trim() : '';
                var precioUSDAttr = precioEl ? precioEl.getAttribute('data-usd') : '';

                // Detectar si es precio de mini especial ($5500 UYU o $150 USD)
                var esPrecioMiniEspecial = false;
                if (precioTextoRaw.indexOf('5500') >= 0 || precioTextoRaw.indexOf('5.500') >= 0) {
                    esPrecioMiniEspecial = true;
                }
                if (precioUSDAttr === '150' || precioTextoRaw.indexOf('$150') >= 0) {
                    esPrecioMiniEspecial = true;
                }

                // Si tiene precio de mini especial Y nombre Merlin/Leprechaun
                var esMerlin = nombreProd.indexOf('merlin') >= 0;
                var esLeprechaun = nombreProd.indexOf('leprechaun') >= 0;

                if (esPrecioMiniEspecial && (esMerlin || esLeprechaun)) {
                    tamanoText = 'mini-especial';
                }

                if (!img || !nombreEl) continue;

                // Obtener precio USD del data attribute
                var precioUSD = precioEl ? precioEl.getAttribute('data-usd') : '';
                var precioTexto = precioUSD ? ('$' + precioUSD + ' USD') : (precioEl ? precioEl.textContent.trim() : '');

                var producto = {
                    url: card.href || '#',
                    img: img.src || '',
                    nombre: nombreEl.textContent.trim(),
                    precio: precioTexto,
                    tamano: tamanoText
                };

                if (!productosPorTamano[tamanoText]) {
                    productosPorTamano[tamanoText] = [];
                }
                productosPorTamano[tamanoText].push(producto);
                todosProductos.push(producto);
            }

            if (todosProductos.length === 0) {
                console.log('DTE: No se encontraron productos');
                return;
            }

            // Construir HTML - diferente para categoría vs shop principal
            var html = '<div class="dte-tienda">';

            if (esCategoria) {
                // ========== VISTA CATEGORIA: Grilla vertical ==========
                html += '<a href="/shop/" class="dte-volver">&larr; Volver a todos los guardianes</a>';
                html += '<div class="dte-categoria-header">';
                html += '<h1 class="dte-categoria-titulo">' + (categoriaNombre || categoriaSlug) + '</h1>';
                html += '<p class="dte-categoria-count">' + todosProductos.length + ' guardianes disponibles</p>';
                html += '</div>';

                // Buscador
                html += '<div class="dte-buscador-wrap">';
                html += '<div class="dte-buscador">';
                html += '<input type="text" id="dte-search" placeholder="Buscar en esta categoria..." autocomplete="off">';
                html += '</div></div>';

                // Grilla de productos
                html += '<div class="dte-grilla">';
                for (var g = 0; g < todosProductos.length; g++) {
                    var prod = todosProductos[g];
                    html += '<a href="' + prod.url + '" class="dte-card" data-nombre="' + prod.nombre.toLowerCase() + '">';
                    html += '<div class="dte-card-img"><img src="' + prod.img + '" alt="' + prod.nombre + '" loading="lazy"></div>';
                    html += '<div class="dte-card-nombre">' + prod.nombre + '</div>';
                    html += '<div class="dte-card-precio">' + prod.precio + '</div>';
                    html += '<span class="dte-card-btn">Leer su historia</span>';
                    html += '</a>';
                }
                html += '</div>';
                html += '</div>'; // cierra dte-tienda

            } else {
                // ========== VISTA SHOP PRINCIPAL: Carruseles ==========
                html += '<div class="dte-header">';
                html += '<h1 class="dte-titulo">ENCONTRA TU GUARDIAN</h1>';
                html += '<p class="dte-subtitulo">Cada uno nacio para alguien. Uno de ellos, para vos.</p>';
                html += '</div>';

                // Categorias por intencion
                html += '<div class="dte-categorias">';
                html += '<a href="/shop/" class="dte-cat active" data-cat="todos">Todos</a>';
                html += '<a href="/product-category/proteccion/" class="dte-cat" data-cat="proteccion">Proteccion</a>';
                html += '<a href="/product-category/amor/" class="dte-cat" data-cat="amor">Amor</a>';
                html += '<a href="/product-category/dinero-abundancia-negocios/" class="dte-cat" data-cat="abundancia">Abundancia</a>';
                html += '<a href="/product-category/salud/" class="dte-cat" data-cat="salud">Sanacion</a>';
                html += '<a href="/product-category/sabiduria-guia-claridad/" class="dte-cat" data-cat="sabiduria">Sabiduria</a>';
                html += '</div>';

                // Buscador elegante
                html += '<div class="dte-buscador-wrap">';
                html += '<div class="dte-buscador">';
                html += '<input type="text" id="dte-search" placeholder="Buscar guardian por nombre..." autocomplete="off">';
                html += '</div></div>';

                // Acciones circulares
                html += '<div class="dte-acciones">';
            html += '<div class="dte-accion" id="dte-universo">';
            html += '<div class="dte-accion-circulo"><span>&#10022;</span></div>';
            html += '<span class="dte-accion-texto">Que elija el universo</span>';
            html += '</div>';
            html += '<a href="/descubri-que-duende-te-elige/" class="dte-accion">';
            html += '<div class="dte-accion-circulo"><span>&#9734;</span></div>';
            html += '<span class="dte-accion-texto">Test del Guardian</span>';
            html += '</a>';
            html += '</div>';

                // Ordenar tamanos (incluyendo mini-especial)
                var tamanosOrdenados = ['mini', 'mini-especial', 'pixie', 'mediano', 'grande', 'gigante'];

                for (var t = 0; t < tamanosOrdenados.length; t++) {
                    var tamano = tamanosOrdenados[t];
                    var prods = productosPorTamano[tamano];
                    if (!prods || prods.length === 0) continue;

                    var info = infoTamanos[tamano] || { nombre: tamano.toUpperCase(), precio: '', cm: '', orden: 99, hook: '', beneficio: '' };

                    html += '<section class="dte-seccion-tamano" data-tamano="' + tamano + '">';
                    html += '<div class="dte-seccion-header">';
                    html += '<div class="dte-seccion-info">';
                    html += '<h2 class="dte-seccion-nombre">' + info.nombre + '</h2>';
                    html += '<span class="dte-seccion-precio">' + info.precio + '</span>';
                    html += '<span class="dte-seccion-cm">' + info.cm + '</span>';
                    html += '</div>';
                    html += '</div>';
                    // Texto de neuromarketing
                    if (info.hook) {
                        html += '<div class="dte-seccion-copy">';
                        html += '<p class="dte-hook">' + info.hook + '</p>';
                        html += '<p class="dte-beneficio">' + info.beneficio + '</p>';
                        html += '</div>';
                    }

                    // Vista carrusel
                    html += '<div class="dte-carrusel-view" id="carrusel-view-' + tamano + '">';
                    html += '<div class="dte-carrusel-wrap" data-id="' + tamano + '">';
                    html += '<div class="dte-carrusel" id="carrusel-' + tamano + '">';

                    for (var p = 0; p < prods.length; p++) {
                        var prod = prods[p];
                        html += '<a href="' + prod.url + '" class="dte-card" data-nombre="' + prod.nombre.toLowerCase() + '">';
                        html += '<div class="dte-card-img"><img src="' + prod.img + '" alt="' + prod.nombre + '" loading="lazy"></div>';
                        html += '<div class="dte-card-nombre">' + prod.nombre + '</div>';
                        html += '<div class="dte-card-precio">' + prod.precio + '</div>';
                        html += '<span class="dte-card-btn">Leer su historia</span>';
                        html += '</a>';
                    }

                    html += '</div>';
                    html += '<span class="dte-desliza">Desliza</span>';
                    html += '</div>';
                    // Controles de navegación DEBAJO
                    html += '<div class="dte-nav-controles">';
                    html += '<button class="dte-flecha" data-carrusel="carrusel-' + tamano + '" data-dir="-1">&#8249;</button>';
                    html += '<span class="dte-contador">' + prods.length + ' guardianes</span>';
                    html += '<button class="dte-flecha" data-carrusel="carrusel-' + tamano + '" data-dir="1">&#8250;</button>';
                    html += '</div>';
                    // BOTON VER TODOS - Grande y visible (usa plural)
                    html += '<button class="dte-ver-todos-btn" data-tamano="' + tamano + '">VER TODOS LOS ' + info.nombrePlural + ' ↓</button>';
                    html += '</div>'; // fin carrusel-view

                    // Vista grilla (oculta por defecto)
                    html += '<div class="dte-grilla-view" id="grilla-view-' + tamano + '">';
                    html += '<button class="dte-volver-carrusel" data-tamano="' + tamano + '">← Volver al carrusel</button>';
                    html += '<div class="dte-grilla-productos">';
                    for (var g = 0; g < prods.length; g++) {
                        var gp = prods[g];
                        html += '<a href="' + gp.url + '" class="dte-card">';
                        html += '<div class="dte-card-img"><img src="' + gp.img + '" alt="' + gp.nombre + '" loading="lazy"></div>';
                        html += '<div class="dte-card-nombre">' + gp.nombre + '</div>';
                        html += '<div class="dte-card-precio">' + gp.precio + '</div>';
                        html += '<span class="dte-card-btn">Leer su historia</span>';
                        html += '</a>';
                    }
                    html += '</div></div>'; // fin grilla-view

                    html += '</section>';
                }

                html += '</div>';

                // Modal
                html += '<div class="dte-modal" id="dte-modal">';
                html += '<div class="dte-modal-content">';
                html += '<div class="dte-modal-titulo">El universo ha elegido</div>';
                html += '<div class="dte-modal-sub">Estos 3 guardianes resuenan con tu energia</div>';
                html += '<div class="dte-modal-productos" id="dte-modal-prods"></div>';
                html += '<div class="dte-modal-btns">';
                html += '<button class="dte-modal-btn dte-modal-btn-reintentar" id="dte-reintentar">Elegir de nuevo</button>';
                html += '<button class="dte-modal-btn dte-modal-btn-cerrar" id="dte-cerrar">Cerrar</button>';
                html += '</div></div></div>';
            } // Fin del else (shop principal)

            // Insertar ANTES del grid de productos original
            var productosGrid = document.querySelector('.productos-grid');
            var productosSection = document.querySelector('.productos-section');
            var insertPoint = productosGrid || productosSection;

            if (insertPoint && insertPoint.parentNode) {
                var tiendaDiv = document.createElement('div');
                tiendaDiv.innerHTML = html;
                insertPoint.parentNode.insertBefore(tiendaDiv.firstChild, insertPoint);
            } else {
                // Fallback: usar el container
                var container = document.getElementById('dte-container');
                if (container) {
                    container.innerHTML = html;
                }
            }

            // Mover adoptados al final
            var adoptadosSection = document.querySelector('.adoptados-section');
            var tiendaEl = document.querySelector('.dte-tienda');
            if (adoptadosSection && tiendaEl) {
                tiendaEl.parentNode.insertBefore(adoptadosSection, tiendaEl.nextSibling);
            }

            // Event listeners
            var searchInput = document.getElementById('dte-search');
            if (searchInput) {
                searchInput.onkeyup = function() {
                    var query = this.value.toLowerCase();
                    var dteCards = document.querySelectorAll('.dte-card');
                    var secciones = document.querySelectorAll('.dte-seccion-tamano');

                    for (var k = 0; k < dteCards.length; k++) {
                        var c = dteCards[k];
                        var nombreAttr = c.getAttribute('data-nombre') || '';
                        c.style.display = (query === '' || nombreAttr.indexOf(query) >= 0) ? '' : 'none';
                    }

                    for (var s = 0; s < secciones.length; s++) {
                        var sec = secciones[s];
                        var secCards = sec.querySelectorAll('.dte-card');
                        var visible = 0;
                        for (var m = 0; m < secCards.length; m++) {
                            if (secCards[m].style.display !== 'none') visible++;
                        }
                        sec.style.display = visible > 0 ? '' : 'none';
                    }
                };
            }

            // Flechas - ahora usan data-carrusel para identificar el carrusel
            var flechas = document.querySelectorAll('.dte-flecha');
            for (var f = 0; f < flechas.length; f++) {
                flechas[f].onclick = function() {
                    var carruselId = this.getAttribute('data-carrusel');
                    var carrusel = document.getElementById(carruselId);
                    if (!carrusel) return;
                    var dir = parseInt(this.getAttribute('data-dir'), 10);
                    // Mover de a 1 card (calcula el ancho real)
                    var card = carrusel.querySelector('.dte-card');
                    var cardWidth = card ? card.offsetWidth + 20 : 200;
                    carrusel.scrollLeft += dir * cardWidth;
                };
            }

            // Detectar scroll en carruseles para mostrar/ocultar gradiente izquierdo
            var carruseles = document.querySelectorAll('.dte-carrusel');
            for (var cc = 0; cc < carruseles.length; cc++) {
                carruseles[cc].addEventListener('scroll', function() {
                    var wrap = this.parentElement;
                    if (this.scrollLeft > 20) {
                        wrap.classList.add('scrolled');
                    } else {
                        wrap.classList.remove('scrolled');
                    }
                    // Ocultar indicador "Desliza" si ya scrollearon
                    var desliza = wrap.querySelector('.dte-desliza');
                    if (desliza && this.scrollLeft > 50) {
                        desliza.style.opacity = '0';
                    } else if (desliza) {
                        desliza.style.opacity = '1';
                    }
                });
            }

            // VER TODOS - Mostrar grilla
            var verTodosBtns = document.querySelectorAll('.dte-ver-todos-btn');
            for (var vt = 0; vt < verTodosBtns.length; vt++) {
                verTodosBtns[vt].onclick = function() {
                    var tamano = this.getAttribute('data-tamano');
                    var carruselView = document.getElementById('carrusel-view-' + tamano);
                    var grillaView = document.getElementById('grilla-view-' + tamano);
                    if (carruselView) carruselView.style.display = 'none';
                    if (grillaView) grillaView.classList.add('active');
                    // Scroll al inicio de la sección
                    var seccion = this.closest('.dte-seccion-tamano');
                    if (seccion) {
                        seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                };
            }

            // VOLVER AL CARRUSEL
            var volverBtns = document.querySelectorAll('.dte-volver-carrusel');
            for (var vb = 0; vb < volverBtns.length; vb++) {
                volverBtns[vb].onclick = function() {
                    var tamano = this.getAttribute('data-tamano');
                    var carruselView = document.getElementById('carrusel-view-' + tamano);
                    var grillaView = document.getElementById('grilla-view-' + tamano);
                    if (grillaView) grillaView.classList.remove('active');
                    if (carruselView) carruselView.style.display = 'block';
                };
            }

            // Modal
            var modal = document.getElementById('dte-modal');
            var modalProds = document.getElementById('dte-modal-prods');
            var btnUniverso = document.getElementById('dte-universo');
            var btnReintentar = document.getElementById('dte-reintentar');
            var btnCerrar = document.getElementById('dte-cerrar');

            function mostrarElegidos() {
                if (!modal || !modalProds) return;
                modal.className = 'dte-modal active';
                modalProds.innerHTML = '<div class="dte-modal-spinner">&#10022;</div>';

                setTimeout(function() {
                    var shuffled = todosProductos.slice();
                    for (var x = shuffled.length - 1; x > 0; x--) {
                        var r = Math.floor(Math.random() * (x + 1));
                        var temp = shuffled[x];
                        shuffled[x] = shuffled[r];
                        shuffled[r] = temp;
                    }
                    var elegidos = shuffled.slice(0, 3);

                    var modalHtml = '';
                    for (var e = 0; e < elegidos.length; e++) {
                        var ep = elegidos[e];
                        modalHtml += '<a href="' + ep.url + '" class="dte-modal-card" style="transition-delay: ' + (e * 0.15) + 's">';
                        modalHtml += '<img src="' + ep.img + '" alt="' + ep.nombre + '">';
                        modalHtml += '<div class="dte-modal-card-nombre">' + ep.nombre + '</div>';
                        modalHtml += '<div class="dte-modal-card-precio">' + ep.precio + '</div>';
                        modalHtml += '</a>';
                    }
                    modalProds.innerHTML = modalHtml;

                    setTimeout(function() {
                        var mCards = document.querySelectorAll('.dte-modal-card');
                        for (var mc = 0; mc < mCards.length; mc++) {
                            mCards[mc].className += ' show';
                        }
                    }, 50);
                }, 1200);
            }

            if (btnUniverso) btnUniverso.onclick = mostrarElegidos;
            if (btnReintentar) btnReintentar.onclick = mostrarElegidos;
            if (btnCerrar) btnCerrar.onclick = function() { modal.className = 'dte-modal'; };
            if (modal) modal.onclick = function(e) { if (e.target === modal) modal.className = 'dte-modal'; };

            console.log('DTE v3.0 - ' + todosProductos.length + ' productos en ' + Object.keys(productosPorTamano).length + ' tamanos');
        }

        // Esperar a que el DOM tenga los productos
        function esperarYIniciar() {
            var cards = document.querySelectorAll('.guardian-card:not(.adoptado)');
            if (cards.length > 0) {
                initTienda();
            } else {
                // Reintentar hasta 10 veces
                if (!window.dteIntentos) window.dteIntentos = 0;
                window.dteIntentos++;
                if (window.dteIntentos < 10) {
                    setTimeout(esperarYIniciar, 300);
                } else {
                    console.log('DTE: No se encontraron productos despues de 10 intentos');
                }
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(esperarYIniciar, 200);
            });
        } else {
            setTimeout(esperarYIniciar, 200);
        }
    })();
    </script>
    <?php
}, 999); // Prioridad alta para que corra despues de otros plugins
