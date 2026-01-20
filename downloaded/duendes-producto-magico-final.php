<?php
/**
 * Plugin Name: Duendes Producto Magico Final
 * Description: Pagina de producto inmersiva con colores por categoria - Responsive mejorado
 * Version: 3.0
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
        wp_redirect(home_url('/tienda/'));
        exit;
    }

    $nombre = $post->post_title;
    $precio_usd = $product->get_price();
    $precio_uyu = get_post_meta($post->ID, '_duendes_precio_uyu', true) ?: round($precio_usd * 43);
    $sena_uyu = round($precio_uyu * 0.3);

    // Datos del meta originales
    $tipo = get_post_meta($post->ID, '_duendes_tipo', true) ?: 'Guardian';
    $elemento = get_post_meta($post->ID, '_duendes_elemento', true) ?: 'Tierra';

    // ═══════════════════════════════════════════════════════════════════════════
    // NUEVOS CAMPOS: Genero, Tamano exacto, Edicion
    // ═══════════════════════════════════════════════════════════════════════════
    $genero = get_post_meta($post->ID, '_dc_genero', true) ?: 'neutro';
    $tamano_categoria = get_post_meta($post->ID, '_dc_tamano', true) ?: 'mediano';
    $tamano_exacto = get_post_meta($post->ID, '_dc_tamano_exacto', true);
    $edicion = get_post_meta($post->ID, '_dc_edicion', true) ?: 'especial';
    $tipo_ser = get_post_meta($post->ID, '_dc_tipo_ser', true) ?: 'duende';

    // Determinar etiqueta de genero dinamico
    $genero_label = 'Guardian'; // default
    if ($genero === 'femenino') {
        $genero_label = 'Guardiana';
    } elseif ($genero === 'masculino') {
        $genero_label = 'Guardian';
    } else {
        // neutro - usar "Guardian" generico o determinar por tipo
        $genero_label = 'Guardian';
    }

    // Mapeo de tipos de ser para mostrar
    $tipos_ser_display = [
        'duende' => 'Duende',
        'hada' => 'Hada',
        'gnomo' => 'Gnomo',
        'elfo' => 'Elfo',
        'troll' => 'Troll',
        'ninfa' => 'Ninfa',
        'dragon' => 'Dragon',
        'fenix' => 'Fenix',
        'unicornio' => 'Unicornio',
        'pixie' => 'Pixie',
        'sirena' => 'Sirena',
        'silfo' => 'Silfo',
        'otro' => 'Ser Magico'
    ];
    $tipo_ser_display = $tipos_ser_display[$tipo_ser] ?? 'Ser Magico';

    // Mapeo de tamanos para display
    $tamanos_display = [
        'mini' => 'Mini (10-15 cm)',
        'mediano' => 'Mediano (16-26 cm)',
        'grande' => 'Grande (25-40 cm)',
        'gigante' => 'Gigante (50-80 cm)'
    ];
    $tamano_display = $tamano_exacto ?: ($tamanos_display[$tamano_categoria] ?? 'Mediano');

    // Mapeo de ediciones con descripcion
    $ediciones_info = [
        'clasica' => [
            'nombre' => 'Edicion Clasica',
            'badge' => 'Clasica',
            'descripcion' => 'Modelo que puede repetirse - cada pieza sigue siendo unica en detalles',
            'color' => '#6B8E23'
        ],
        'especial' => [
            'nombre' => 'Pieza Unica',
            'badge' => 'Unica',
            'descripcion' => 'Pieza irrepetible - cuando se va, desaparece para siempre',
            'color' => '#C6A962'
        ],
        'mistica' => [
            'nombre' => 'Edicion Mistica',
            'badge' => 'Mistica',
            'descripcion' => 'Edicion especial de coleccion con propiedades extraordinarias',
            'color' => '#9370DB'
        ]
    ];
    $edicion_info = $ediciones_info[$edicion] ?? $ediciones_info['especial'];

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
                --edicion-color: <?php echo $edicion_info['color']; ?>;
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
            /* HERO CON COLOR DE CATEGORIA - RESPONSIVE MEJORADO */
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
                width: 100%;
                padding: 0 15px;
            }

            .hero-categoria {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                background: var(--cat-primario);
                color: #fff;
                padding: 8px 24px;
                border-radius: 30px;
                font-size: clamp(10px, 2.5vw, 12px);
                letter-spacing: clamp(1px, 0.5vw, 3px);
                text-transform: uppercase;
                margin-bottom: 25px;
                font-weight: 500;
            }

            /* NOMBRE DEL PRODUCTO - RESPONSIVE */
            .hero-nombre {
                font-family: 'Cinzel', serif;
                font-size: clamp(28px, 7vw, 72px);
                color: #fff;
                letter-spacing: clamp(2px, 1vw, 8px);
                text-transform: uppercase;
                margin-bottom: 15px;
                text-shadow: 0 4px 30px rgba(0,0,0,0.3);
                line-height: 1.1;
                word-wrap: break-word;
                hyphens: auto;
            }

            /* SUBTITULO CON GENERO - RESPONSIVE */
            .hero-subtitulo {
                font-size: clamp(16px, 4vw, 24px);
                color: var(--dorado);
                font-style: italic;
                margin-bottom: 20px;
                line-height: 1.4;
            }

            /* BADGE DE EDICION */
            .hero-edicion-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: rgba(255,255,255,0.1);
                border: 1px solid var(--edicion-color);
                color: var(--edicion-color);
                padding: 6px 16px;
                border-radius: 20px;
                font-size: clamp(10px, 2vw, 12px);
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-bottom: 25px;
                font-weight: 500;
            }

            /* SPECS - RESPONSIVE GRID */
            .hero-specs {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                gap: clamp(15px, 3vw, 40px);
                max-width: 600px;
                margin: 0 auto;
                padding: 0 10px;
            }

            .hero-spec {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }

            .hero-spec-label {
                font-size: clamp(9px, 2vw, 11px);
                color: rgba(255,255,255,0.5);
                letter-spacing: clamp(1px, 0.3vw, 2px);
                text-transform: uppercase;
            }

            .hero-spec-value {
                font-size: clamp(12px, 3vw, 16px);
                color: #fff;
                font-weight: 500;
                text-align: center;
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
                background: var(--edicion-color);
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

            .etiqueta-edicion {
                background: <?php echo $edicion_info['color']; ?>22;
                color: <?php echo $edicion_info['color']; ?>;
            }

            .etiqueta-tamano {
                background: rgba(100,100,100,0.1);
                color: #666;
            }

            /* INFO DE EDICION ESPECIAL */
            .info-edicion-box {
                background: linear-gradient(135deg, <?php echo $edicion_info['color']; ?>11, transparent);
                border: 1px solid <?php echo $edicion_info['color']; ?>44;
                border-radius: 12px;
                padding: 15px 20px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .info-edicion-box .edicion-icono {
                font-size: 24px;
            }

            .info-edicion-box .edicion-texto {
                flex: 1;
            }

            .info-edicion-box .edicion-titulo {
                font-family: 'Cinzel', serif;
                font-size: 14px;
                color: <?php echo $edicion_info['color']; ?>;
                font-weight: 600;
                margin-bottom: 2px;
            }

            .info-edicion-box .edicion-desc {
                font-size: 13px;
                color: #666;
                line-height: 1.4;
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
                margin-bottom: 15px;
            }

            .precio-loading {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #888;
                font-style: italic;
            }

            .precio-loading::after {
                content: '';
                width: 20px;
                height: 20px;
                border: 2px solid #ddd;
                border-top-color: var(--cat-primario);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .precio-principal {
                font-family: 'Cinzel', serif;
                font-size: clamp(32px, 6vw, 42px);
                color: var(--negro);
                font-weight: 600;
            }

            .precio-moneda {
                font-size: clamp(16px, 3vw, 20px);
                color: #888;
            }

            .precio-alternativo {
                font-size: 14px;
                color: #888;
                margin-top: 5px;
            }

            .precio-bandera {
                font-size: 1.2em;
                margin-right: 5px;
            }

            /* INFO DE PAGO POR PAIS */
            .pago-info-box {
                background: #f9f9f9;
                border: 1px solid #eee;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
            }

            .pago-info-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 12px;
            }

            .pago-info-header h4 {
                font-family: 'Cinzel', serif;
                font-size: 14px;
                color: var(--cat-primario);
                margin: 0;
                font-weight: 600;
            }

            .pago-metodos {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 12px;
            }

            .pago-metodo {
                background: #fff;
                border: 1px solid #ddd;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 12px;
                color: #555;
            }

            .pago-envio {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: #666;
                padding-top: 10px;
                border-top: 1px solid #eee;
            }

            .pago-envio-icono {
                font-size: 16px;
            }

            .pago-cuotas {
                background: linear-gradient(135deg, #4CAF5022, #8BC34A22);
                color: #2E7D32;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 600;
                margin-top: 10px;
                text-align: center;
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
                font-size: clamp(14px, 3vw, 16px);
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
                font-size: clamp(24px, 5vw, 40px);
                text-align: center;
                margin-bottom: 15px;
                letter-spacing: clamp(1px, 0.5vw, 3px);
            }

            .seccion-subtitulo {
                text-align: center;
                font-size: clamp(16px, 3vw, 18px);
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
                font-size: clamp(17px, 3vw, 19px);
                line-height: 2;
                text-align: justify;
                color: #444;
            }

            .historia-texto::first-letter {
                font-size: clamp(40px, 8vw, 60px);
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
                padding: clamp(20px, 5vw, 40px);
                background: rgba(255,255,255,0.03);
                border-radius: 20px;
                border: 1px solid rgba(198,169,98,0.2);
            }

            .mensaje-contenido::before {
                content: '"';
                position: absolute;
                top: -20px;
                left: 30px;
                font-size: clamp(60px, 15vw, 120px);
                color: var(--cat-primario);
                opacity: 0.3;
                font-family: 'Cinzel', serif;
                line-height: 1;
            }

            .mensaje-texto {
                font-size: clamp(18px, 4vw, 22px);
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
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 25px;
            }

            .don-card {
                background: #fff;
                padding: clamp(20px, 4vw, 30px);
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
                font-size: clamp(16px, 3vw, 18px);
                color: var(--cat-primario);
                margin-bottom: 10px;
            }

            .don-descripcion {
                font-size: clamp(14px, 2.5vw, 15px);
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
                width: clamp(50px, 10vw, 70px);
                height: clamp(50px, 10vw, 70px);
                background: var(--cat-primario);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Cinzel', serif;
                font-size: clamp(20px, 4vw, 28px);
                color: #fff;
                font-weight: 600;
                flex-shrink: 0;
            }

            .paso-contenido h4 {
                font-family: 'Cinzel', serif;
                font-size: clamp(16px, 3vw, 20px);
                color: var(--dorado);
                margin-bottom: 10px;
            }

            .paso-contenido p {
                font-size: clamp(14px, 2.5vw, 16px);
                color: rgba(255,255,255,0.8);
                line-height: 1.7;
            }

            /* CTA Final */
            .cta-final {
                background: var(--negro);
                padding: clamp(60px, 12vw, 100px) 40px;
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
                background: <?php echo $edicion_info['color']; ?>22;
                color: <?php echo $edicion_info['color']; ?>;
                padding: 8px 20px;
                border-radius: 20px;
                font-size: clamp(11px, 2.5vw, 13px);
                letter-spacing: clamp(1px, 0.3vw, 2px);
                text-transform: uppercase;
                margin-bottom: 25px;
                position: relative;
                z-index: 1;
            }

            .cta-titulo {
                font-family: 'Cinzel', serif;
                font-size: clamp(24px, 6vw, 48px);
                color: #fff;
                margin-bottom: 15px;
                position: relative;
                z-index: 1;
                line-height: 1.2;
            }

            .cta-nombre {
                color: var(--cat-primario);
            }

            .cta-precio {
                font-family: 'Cinzel', serif;
                font-size: clamp(36px, 8vw, 56px);
                color: var(--dorado);
                margin: 30px 0;
                position: relative;
                z-index: 1;
            }

            .cta-btn {
                display: inline-block;
                padding: clamp(16px, 3vw, 22px) clamp(40px, 8vw, 70px);
                background: linear-gradient(135deg, var(--cat-primario), <?php echo adjustBrightness($colores['primario'], -20); ?>);
                border: none;
                border-radius: 14px;
                color: #fff;
                font-family: 'Cinzel', serif;
                font-size: clamp(14px, 3vw, 18px);
                font-weight: 600;
                letter-spacing: clamp(1px, 0.5vw, 3px);
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
                padding: clamp(40px, 8vw, 60px) 40px;
                text-align: center;
                border-top: 1px solid rgba(198,169,98,0.2);
            }

            .footer-logo {
                font-family: 'Cinzel', serif;
                font-size: clamp(18px, 4vw, 24px);
                color: var(--dorado);
                margin-bottom: 20px;
                letter-spacing: clamp(2px, 0.5vw, 5px);
            }

            .footer-links {
                display: flex;
                justify-content: center;
                gap: clamp(15px, 4vw, 30px);
                margin-bottom: 30px;
                flex-wrap: wrap;
            }

            .footer-links a {
                color: rgba(255,255,255,0.6);
                text-decoration: none;
                font-size: clamp(12px, 2.5vw, 14px);
                transition: color 0.3s;
            }

            .footer-links a:hover {
                color: var(--dorado);
            }

            .footer-copy {
                color: rgba(255,255,255,0.4);
                font-size: clamp(11px, 2vw, 13px);
            }

            /* ═══════════════════════════════════════════════════════════════ */
            /* RESPONSIVE - MOBILE FIRST IMPROVEMENTS */
            /* ═══════════════════════════════════════════════════════════════ */
            @media (max-width: 968px) {
                .main-content {
                    grid-template-columns: 1fr;
                    gap: 40px;
                    padding: 40px 20px;
                }

                .galeria {
                    position: relative;
                    top: 0;
                }

                .header-magico {
                    padding: 12px 20px;
                }

                .header-logo {
                    font-size: 14px;
                    letter-spacing: 2px;
                }

                .header-nav {
                    display: none;
                }

                .hero-producto {
                    min-height: 55vh;
                    padding: 100px 15px 50px;
                }

                .seccion {
                    padding: 50px 20px;
                }

                .seccion-full {
                    padding: 50px 20px;
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
                    gap: 10px;
                }

                .info-edicion-box {
                    flex-direction: column;
                    text-align: center;
                }
            }

            /* TABLET */
            @media (min-width: 769px) and (max-width: 968px) {
                .hero-producto {
                    min-height: 60vh;
                    padding: 110px 30px 60px;
                }

                .hero-specs {
                    grid-template-columns: repeat(4, 1fr);
                }
            }

            /* MOBILE SMALL */
            @media (max-width: 480px) {
                .hero-producto {
                    min-height: 50vh;
                    padding: 90px 10px 40px;
                }

                .hero-categoria {
                    padding: 6px 16px;
                    margin-bottom: 15px;
                }

                .hero-edicion-badge {
                    padding: 5px 12px;
                    margin-bottom: 15px;
                }

                .hero-specs {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }

                .galeria-badge {
                    top: 10px;
                    left: 10px;
                    padding: 6px 12px;
                    font-size: 10px;
                }

                .galeria-thumb {
                    width: 60px;
                    height: 60px;
                }

                .precio-box {
                    padding: 20px 15px;
                }

                .btn-comprar {
                    padding: 16px;
                }

                .dones-grid {
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
                <a href="<?php echo home_url('/tienda/'); ?>">Tienda</a>
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
                <p class="hero-subtitulo"><?php echo esc_html($tipo_ser_display); ?> <?php echo esc_html($genero_label); ?> del <?php echo esc_html($categoria_nombre); ?></p>
                <div class="hero-edicion-badge">
                    <?php
                    $edicion_emoji = ($edicion === 'mistica') ? '✨' : (($edicion === 'especial') ? '💎' : '⭐');
                    echo $edicion_emoji . ' ' . esc_html($edicion_info['badge']);
                    ?>
                </div>
                <div class="hero-specs">
                    <div class="hero-spec">
                        <span class="hero-spec-label">Tipo</span>
                        <span class="hero-spec-value"><?php echo esc_html($tipo_ser_display); ?></span>
                    </div>
                    <div class="hero-spec">
                        <span class="hero-spec-label">Elemento</span>
                        <span class="hero-spec-value"><?php echo esc_html($elemento); ?></span>
                    </div>
                    <div class="hero-spec">
                        <span class="hero-spec-label">Tamano</span>
                        <span class="hero-spec-value"><?php echo esc_html($tamano_display); ?></span>
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
                    <div class="galeria-badge"><?php echo esc_html($edicion_info['badge']); ?></div>
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
                    <span class="etiqueta etiqueta-tipo"><?php echo esc_html($tipo_ser_display); ?></span>
                    <span class="etiqueta etiqueta-elemento"><?php echo esc_html($elemento); ?></span>
                    <span class="etiqueta etiqueta-edicion"><?php echo esc_html($edicion_info['badge']); ?></span>
                    <?php if ($tamano_exacto): ?>
                    <span class="etiqueta etiqueta-tamano"><?php echo esc_html($tamano_exacto); ?></span>
                    <?php endif; ?>
                </div>

                <!-- INFO DE EDICION -->
                <div class="info-edicion-box">
                    <span class="edicion-icono">
                        <?php echo ($edicion === 'mistica') ? '✨' : (($edicion === 'especial') ? '💎' : '⭐'); ?>
                    </span>
                    <div class="edicion-texto">
                        <div class="edicion-titulo"><?php echo esc_html($edicion_info['nombre']); ?></div>
                        <div class="edicion-desc"><?php echo esc_html($edicion_info['descripcion']); ?></div>
                    </div>
                </div>

                <p class="info-descripcion">
                    <?php echo wp_kses_post($product->get_short_description() ?: substr(strip_tags($descripcion), 0, 300) . '...'); ?>
                </p>

                <div class="precio-box" id="precio-box">
                    <div class="precio-loading" id="precio-loading">Detectando tu ubicacion...</div>
                    <div id="precio-contenido" style="display: none;">
                        <div class="precio-principal">
                            <span id="precio-bandera" class="precio-bandera"></span>
                            <span id="precio-formateado">$<?php echo number_format($precio_uyu, 0, ',', '.'); ?></span>
                            <span class="precio-moneda" id="precio-moneda">UYU</span>
                        </div>
                        <div class="precio-alternativo" id="precio-alternativo">
                            o USD $<?php echo number_format($precio_usd, 0); ?>
                        </div>
                    </div>
                </div>

                <!-- INFO DE PAGO DINAMICA -->
                <div class="pago-info-box" id="pago-info-box" style="display: none;">
                    <div class="pago-info-header">
                        <span>💳</span>
                        <h4>Formas de Pago</h4>
                    </div>
                    <div class="pago-metodos" id="pago-metodos">
                        <!-- Se llena con JS -->
                    </div>
                    <div class="pago-cuotas" id="pago-cuotas" style="display: none;">
                        <!-- Se llena con JS -->
                    </div>
                    <div class="pago-envio" id="pago-envio">
                        <span class="pago-envio-icono">📦</span>
                        <span id="pago-envio-texto">Envios a todo el mundo</span>
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
                            <p>Elegi un lugar especial donde pueda observar y proteger. Evita lugares muy transitados o cerca de aparatos electronicos.</p>
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
            <div class="cta-urgencia"><?php echo ($edicion === 'clasica') ? '⭐ Edicion Clasica - Modelo que puede repetirse' : '⚡ ' . esc_html($edicion_info['descripcion']); ?></div>
            <h2 class="cta-titulo"><span class="cta-nombre"><?php echo esc_html($nombre); ?></span> te esta esperando</h2>
            <div class="cta-precio" id="cta-precio">
                <span id="cta-precio-bandera"></span>
                <span id="cta-precio-valor">$<?php echo number_format($precio_uyu, 0, ',', '.'); ?></span>
                <span id="cta-precio-moneda">UYU</span>
            </div>
            <a href="<?php echo esc_url($product->add_to_cart_url()); ?>" class="cta-btn">✦ Sellar el Pacto</a>
        </section>

        <!-- FOOTER -->
        <footer class="footer-producto">
            <div class="footer-logo">DUENDES DEL URUGUAY</div>
            <div class="footer-links">
                <a href="<?php echo home_url('/tienda/'); ?>">Tienda</a>
                <a href="<?php echo home_url('/sobre-nosotros/'); ?>">Nosotros</a>
                <a href="<?php echo home_url('/contacto/'); ?>">Contacto</a>
                <a href="<?php echo home_url('/terminos/'); ?>">Terminos</a>
            </div>
            <p class="footer-copy">© <?php echo date('Y'); ?> Duendes del Uruguay. Todos los derechos reservados.</p>
        </footer>

        <script>
        // ═══════════════════════════════════════════════════════════════════════════
        // DATOS DEL PRODUCTO
        // ═══════════════════════════════════════════════════════════════════════════
        const PRODUCTO = {
            precioUSD: <?php echo $precio_usd; ?>,
            precioUYU: <?php echo $precio_uyu; ?>,
            nombre: '<?php echo esc_js($nombre); ?>'
        };

        // ═══════════════════════════════════════════════════════════════════════════
        // GEOLOCALIZACION Y PRECIOS
        // ═══════════════════════════════════════════════════════════════════════════
        async function inicializarPrecios() {
            const precioLoading = document.getElementById('precio-loading');
            const precioContenido = document.getElementById('precio-contenido');
            const pagoInfoBox = document.getElementById('pago-info-box');

            try {
                // Detectar pais del usuario
                const geoResponse = await fetch('https://ipapi.co/json/');
                const geoData = await geoResponse.json();
                const pais = geoData.country_code || 'US';

                // Obtener precios geolocalizados
                const apiUrl = `https://duendes-vercel.vercel.app/api/divisas?precio=${PRODUCTO.precioUSD}&pais=${pais}`;
                const precioResponse = await fetch(apiUrl);
                const precioData = await precioResponse.json();

                if (precioData.success) {
                    // Actualizar precio principal
                    document.getElementById('precio-bandera').textContent = precioData.precio.config.bandera;
                    document.getElementById('precio-formateado').textContent = precioData.precio.formateado;
                    document.getElementById('precio-moneda').textContent = precioData.precio.moneda;

                    // Mostrar precio alternativo
                    const precioAlt = document.getElementById('precio-alternativo');
                    if (precioData.esUruguay) {
                        // Uruguay: mostrar USD
                        precioAlt.innerHTML = `o <strong>USD $${PRODUCTO.precioUSD}</strong>`;
                    } else {
                        // Otros paises: mostrar moneda local entre parentesis si es diferente
                        let altText = `o <strong>USD $${PRODUCTO.precioUSD}</strong>`;
                        if (precioData.precio.moneda !== 'USD') {
                            altText += ` (aprox. ${precioData.precio.formateado} ${precioData.precio.moneda})`;
                        }
                        precioAlt.innerHTML = altText;
                    }

                    // Mostrar metodos de pago
                    const pagoMetodos = document.getElementById('pago-metodos');
                    pagoMetodos.innerHTML = precioData.pago.metodos.map(m =>
                        `<span class="pago-metodo">${m}</span>`
                    ).join('');

                    // Cuotas (solo Uruguay)
                    const pagoCuotas = document.getElementById('pago-cuotas');
                    if (precioData.pago.cuotas) {
                        pagoCuotas.textContent = '✨ ' + precioData.pago.cuotas;
                        pagoCuotas.style.display = 'block';
                    }

                    // Info de envio
                    document.getElementById('pago-envio-texto').innerHTML =
                        `<strong>${precioData.envio.mensaje}</strong> - ${precioData.envio.tiempoEstimado}`;

                    // Mostrar caja de pago
                    pagoInfoBox.style.display = 'block';

                    // Actualizar CTA final tambien
                    const ctaPrecioBandera = document.getElementById('cta-precio-bandera');
                    const ctaPrecioValor = document.getElementById('cta-precio-valor');
                    const ctaPrecioMoneda = document.getElementById('cta-precio-moneda');
                    if (ctaPrecioBandera && ctaPrecioValor && ctaPrecioMoneda) {
                        ctaPrecioBandera.textContent = precioData.precio.config.bandera + ' ';
                        ctaPrecioValor.textContent = precioData.precio.formateado;
                        ctaPrecioMoneda.textContent = precioData.precio.moneda;
                    }
                }

            } catch (error) {
                console.log('Error detectando ubicacion, usando valores por defecto');
                // Usar valores por defecto (UYU)
                document.getElementById('precio-formateado').textContent =
                    '$' + PRODUCTO.precioUYU.toLocaleString('es-UY');
                document.getElementById('precio-moneda').textContent = 'UYU';
                document.getElementById('precio-alternativo').innerHTML =
                    `o <strong>USD $${PRODUCTO.precioUSD}</strong>`;
            }

            // Mostrar precios, ocultar loading
            precioLoading.style.display = 'none';
            precioContenido.style.display = 'block';
        }

        // Inicializar al cargar
        document.addEventListener('DOMContentLoaded', inicializarPrecios);

        // ═══════════════════════════════════════════════════════════════════════════
        // FUNCIONES DE GALERIA
        // ═══════════════════════════════════════════════════════════════════════════
        function cambiarImagen(url, thumb) {
            document.getElementById('imagen-principal').src = url;
            document.querySelectorAll('.galeria-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        }

        function mostrarModalSena() {
            alert('Funcion de sena - Proximamente');
        }

        // ═══════════════════════════════════════════════════════════════════════════
        // ANIMACIONES AL SCROLL
        // ═══════════════════════════════════════════════════════════════════════════
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
