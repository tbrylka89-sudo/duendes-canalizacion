<?php
/**
 * Plugin Name: Duendes Pagina Nosotros
 * Description: Pagina "Nosotros" rediseñada - Historia de Thibisay & Gabriel
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// Registrar shortcode para la pagina Nosotros
add_shortcode('duendes_nosotros', 'duendes_render_nosotros_page');

// Interceptar la pagina /nosotros/ si no usa shortcode
add_action('template_redirect', function() {
    global $post;
    if (is_page('nosotros') && $post) {
        // Solo interceptar si la pagina no tiene contenido significativo
        $content = $post->post_content;
        if (empty($content) || strlen(strip_tags($content)) < 100) {
            duendes_render_nosotros_full_page();
            exit;
        }
    }
});

function duendes_render_nosotros_full_page() {
    ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nosotros - Duendes del Uruguay | Thibisay & Gabriel</title>
    <meta name="description" content="Conoce a Thibisay y Gabriel, los canalizadores detras de Duendes del Uruguay. Descubre como nacio este proyecto magico y por que cada guardian es unico.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Tangerine:wght@400;700&display=swap" rel="stylesheet">
    <?php duendes_nosotros_styles(); ?>
</head>
<body>
    <?php duendes_nosotros_header(); ?>
    <?php duendes_nosotros_content(); ?>
    <?php duendes_nosotros_footer(); ?>
    <?php duendes_nosotros_scripts(); ?>
</body>
</html>
    <?php
}

function duendes_render_nosotros_page() {
    ob_start();
    duendes_nosotros_styles();
    duendes_nosotros_content();
    duendes_nosotros_scripts();
    return ob_get_clean();
}

function duendes_nosotros_styles() {
    ?>
    <style>
        /* ========== RESET & VARIABLES ========== */
        .dn-nosotros * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --dn-gold: #C6A962;
            --dn-gold-light: #e8d5a3;
            --dn-gold-dark: #a68b4a;
            --dn-dark: #050508;
            --dn-dark-blue: #0a0d14;
            --dn-text: #fff;
            --dn-text-muted: rgba(255,255,255,0.75);
            --dn-text-dim: rgba(255,255,255,0.5);
        }

        .dn-nosotros {
            font-family: 'Cormorant Garamond', Georgia, serif;
            background: var(--dn-dark);
            color: var(--dn-text);
            line-height: 1.7;
            overflow-x: hidden;
        }

        /* ========== HEADER ========== */
        .dn-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 99999;
            background: rgba(5,5,8,0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(198,169,98,0.15);
        }
        .dn-header-inner {
            max-width: 1400px;
            margin: 0 auto;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 30px;
        }
        .dn-nav-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .dn-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
            padding: 8px 12px;
            text-decoration: none;
            color: var(--dn-text-muted);
            transition: color 0.3s;
        }
        .dn-nav-item:hover, .dn-nav-item.active { color: var(--dn-gold); }
        .dn-nav-item svg { width: 18px; height: 18px; stroke: currentColor; stroke-width: 1.5; fill: none; }
        .dn-nav-item span { font-family: 'Cinzel', serif; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; }
        .dn-header-logo {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            text-decoration: none;
        }
        .dn-logo-title { font-family: 'Cinzel', serif; font-size: 16px; font-weight: 600; color: #fff; letter-spacing: 3px; }
        .dn-logo-tagline { font-size: 10px; color: var(--dn-gold); font-style: italic; }

        /* ========== HERO SECTION ========== */
        .dn-hero {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 120px 20px 80px;
            position: relative;
            overflow: hidden;
            background:
                radial-gradient(ellipse at 20% 30%, rgba(198,169,98,0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, rgba(75,60,130,0.1) 0%, transparent 50%),
                linear-gradient(180deg, var(--dn-dark-blue) 0%, var(--dn-dark) 100%);
        }
        .dn-particles {
            position: absolute;
            inset: 0;
            pointer-events: none;
            overflow: hidden;
        }
        .dn-particle {
            position: absolute;
            width: 3px;
            height: 3px;
            background: var(--dn-gold);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--dn-gold);
            animation: dn-float 12s ease-in-out infinite;
        }
        @keyframes dn-float {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
            50% { transform: translateY(-40px) scale(1.3); opacity: 0.7; }
        }
        .dn-hero-badge {
            display: inline-block;
            padding: 10px 25px;
            background: linear-gradient(135deg, rgba(198,169,98,0.15), rgba(198,169,98,0.05));
            border: 1px solid rgba(198,169,98,0.4);
            border-radius: 50px;
            font-family: 'Cinzel', serif;
            font-size: 11px;
            color: var(--dn-gold);
            text-transform: uppercase;
            letter-spacing: 4px;
            margin-bottom: 30px;
            animation: dn-fadeDown 1s ease-out;
        }
        @keyframes dn-fadeDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .dn-hero-title {
            font-family: 'Tangerine', cursive;
            font-size: clamp(50px, 10vw, 100px);
            font-weight: 700;
            background: linear-gradient(135deg, var(--dn-gold), var(--dn-gold-light), var(--dn-gold));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.1;
            margin-bottom: 25px;
            animation: dn-fadeUp 1s ease-out 0.2s both;
        }
        .dn-hero-subtitle {
            font-family: 'Cinzel', serif;
            font-size: clamp(14px, 2.5vw, 20px);
            color: var(--dn-text);
            text-transform: uppercase;
            letter-spacing: 6px;
            margin-bottom: 30px;
            animation: dn-fadeUp 1s ease-out 0.4s both;
        }
        .dn-hero-intro {
            font-size: clamp(18px, 2.5vw, 22px);
            color: var(--dn-text-muted);
            max-width: 700px;
            margin: 0 auto;
            font-style: italic;
            animation: dn-fadeUp 1s ease-out 0.6s both;
        }
        @keyframes dn-fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .dn-scroll-hint {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            color: var(--dn-text-dim);
            font-size: 11px;
            letter-spacing: 2px;
            animation: dn-bounce 2s ease-in-out infinite;
        }
        .dn-scroll-hint svg { width: 20px; height: 20px; stroke: var(--dn-gold); }
        @keyframes dn-bounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(8px); }
        }

        /* ========== SECTION BASE ========== */
        .dn-section {
            padding: 100px 20px;
            max-width: 1100px;
            margin: 0 auto;
        }
        .dn-section-full {
            padding: 100px 20px;
            max-width: 100%;
        }
        .dn-section-title {
            font-family: 'Cinzel', serif;
            font-size: clamp(26px, 4vw, 38px);
            text-align: center;
            margin-bottom: 20px;
            color: var(--dn-gold);
        }
        .dn-section-subtitle {
            text-align: center;
            font-size: 18px;
            color: var(--dn-text-muted);
            max-width: 750px;
            margin: 0 auto 60px;
            font-style: italic;
        }

        /* ========== HISTORIA SECTION ========== */
        .dn-historia {
            background: linear-gradient(180deg, var(--dn-dark) 0%, #080810 100%);
        }
        .dn-historia-content {
            max-width: 900px;
            margin: 0 auto;
        }
        .dn-historia-text {
            font-size: 19px;
            color: var(--dn-text-muted);
            line-height: 1.9;
            margin-bottom: 30px;
        }
        .dn-historia-text strong {
            color: var(--dn-gold);
            font-weight: 500;
        }
        .dn-historia-highlight {
            background: rgba(198,169,98,0.08);
            border-left: 3px solid var(--dn-gold);
            padding: 25px 30px;
            margin: 40px 0;
            font-style: italic;
            font-size: 20px;
            color: var(--dn-text);
        }

        /* ========== CREADORES SECTION ========== */
        .dn-creadores {
            background:
                radial-gradient(ellipse at 30% 50%, rgba(198,169,98,0.05) 0%, transparent 50%),
                linear-gradient(180deg, #080810 0%, var(--dn-dark) 100%);
        }
        .dn-creadores-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 50px;
            max-width: 900px;
            margin: 0 auto;
        }
        .dn-creador-card {
            text-align: center;
            padding: 40px 30px;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(198,169,98,0.15);
            border-radius: 20px;
            transition: all 0.4s ease;
        }
        .dn-creador-card:hover {
            transform: translateY(-5px);
            border-color: rgba(198,169,98,0.35);
            background: rgba(255,255,255,0.03);
        }
        .dn-creador-img {
            width: 160px;
            height: 160px;
            border-radius: 50%;
            margin: 0 auto 25px;
            background: linear-gradient(135deg, rgba(198,169,98,0.3), rgba(198,169,98,0.1));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 60px;
            border: 2px solid rgba(198,169,98,0.3);
            overflow: hidden;
        }
        .dn-creador-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .dn-creador-name {
            font-family: 'Cinzel', serif;
            font-size: 26px;
            color: var(--dn-gold);
            margin-bottom: 8px;
        }
        .dn-creador-role {
            font-size: 14px;
            color: var(--dn-text-dim);
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 20px;
        }
        .dn-creador-desc {
            font-size: 17px;
            color: var(--dn-text-muted);
            line-height: 1.8;
        }
        .dn-creador-quote {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid rgba(198,169,98,0.15);
            font-style: italic;
            font-size: 16px;
            color: var(--dn-gold-light);
        }

        /* ========== MISION SECTION ========== */
        .dn-mision {
            background: linear-gradient(180deg, var(--dn-dark) 0%, #0a0a12 100%);
        }
        .dn-mision-box {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            padding: 60px 40px;
            background: rgba(198,169,98,0.03);
            border: 1px solid rgba(198,169,98,0.2);
            border-radius: 20px;
            position: relative;
        }
        .dn-mision-box::before {
            content: '';
            position: absolute;
            top: -1px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background: linear-gradient(90deg, transparent, var(--dn-gold), transparent);
        }
        .dn-mision-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 25px;
            background: linear-gradient(135deg, rgba(198,169,98,0.2), rgba(198,169,98,0.05));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
        }
        .dn-mision-text {
            font-size: 20px;
            color: var(--dn-text-muted);
            line-height: 1.9;
        }

        /* ========== PROCESO SECTION ========== */
        .dn-proceso {
            background:
                radial-gradient(ellipse at 70% 30%, rgba(75,60,130,0.08) 0%, transparent 50%),
                linear-gradient(180deg, #0a0a12 0%, var(--dn-dark) 100%);
        }
        .dn-proceso-steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            max-width: 1000px;
            margin: 0 auto;
        }
        .dn-proceso-step {
            text-align: center;
            padding: 35px 25px;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 16px;
            transition: all 0.4s ease;
            position: relative;
        }
        .dn-proceso-step::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--dn-gold), transparent);
            opacity: 0;
            transition: opacity 0.4s;
        }
        .dn-proceso-step:hover {
            transform: translateY(-3px);
            border-color: rgba(198,169,98,0.25);
        }
        .dn-proceso-step:hover::before { opacity: 1; }
        .dn-proceso-num {
            width: 50px;
            height: 50px;
            margin: 0 auto 20px;
            background: linear-gradient(135deg, var(--dn-gold), var(--dn-gold-dark));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Cinzel', serif;
            font-size: 20px;
            font-weight: 700;
            color: #000;
        }
        .dn-proceso-title {
            font-family: 'Cinzel', serif;
            font-size: 18px;
            color: var(--dn-text);
            margin-bottom: 12px;
        }
        .dn-proceso-desc {
            font-size: 15px;
            color: var(--dn-text-muted);
            line-height: 1.7;
        }

        /* ========== DIFERENCIA SECTION ========== */
        .dn-diferencia {
            background: linear-gradient(180deg, var(--dn-dark) 0%, #080810 100%);
        }
        .dn-diferencia-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            max-width: 1000px;
            margin: 0 auto;
        }
        .dn-diferencia-item {
            display: flex;
            gap: 20px;
            padding: 25px;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px;
            transition: all 0.3s ease;
        }
        .dn-diferencia-item:hover {
            border-color: rgba(198,169,98,0.2);
            background: rgba(255,255,255,0.03);
        }
        .dn-diferencia-icon {
            flex-shrink: 0;
            width: 50px;
            height: 50px;
            background: rgba(198,169,98,0.15);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
        }
        .dn-diferencia-content h4 {
            font-family: 'Cinzel', serif;
            font-size: 17px;
            color: var(--dn-gold);
            margin-bottom: 8px;
        }
        .dn-diferencia-content p {
            font-size: 15px;
            color: var(--dn-text-muted);
            line-height: 1.6;
        }

        /* ========== CTA SECTION ========== */
        .dn-cta-section {
            padding: 100px 20px;
            text-align: center;
            background:
                radial-gradient(ellipse at 50% 50%, rgba(198,169,98,0.1) 0%, transparent 60%),
                linear-gradient(180deg, #080810 0%, var(--dn-dark) 100%);
        }
        .dn-cta-title {
            font-family: 'Tangerine', cursive;
            font-size: clamp(40px, 8vw, 70px);
            background: linear-gradient(135deg, var(--dn-gold), var(--dn-gold-light));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
        }
        .dn-cta-text {
            font-size: 19px;
            color: var(--dn-text-muted);
            max-width: 600px;
            margin: 0 auto 40px;
        }
        .dn-cta-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }
        .dn-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 16px 35px;
            font-family: 'Cinzel', serif;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-decoration: none;
            border-radius: 50px;
            transition: all 0.4s ease;
        }
        .dn-btn-primary {
            background: linear-gradient(135deg, var(--dn-gold), var(--dn-gold-dark));
            color: #000;
            box-shadow: 0 10px 35px rgba(198,169,98,0.3);
        }
        .dn-btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 45px rgba(198,169,98,0.4);
        }
        .dn-btn-secondary {
            background: transparent;
            color: var(--dn-gold);
            border: 1px solid var(--dn-gold);
        }
        .dn-btn-secondary:hover {
            background: rgba(198,169,98,0.1);
            transform: translateY(-2px);
        }

        /* ========== FOOTER ========== */
        .dn-footer {
            padding: 40px 20px;
            text-align: center;
            border-top: 1px solid rgba(198,169,98,0.1);
            background: var(--dn-dark);
        }
        .dn-footer-text {
            font-size: 14px;
            color: var(--dn-text-dim);
        }
        .dn-footer-text a {
            color: var(--dn-gold);
            text-decoration: none;
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 768px) {
            .dn-header-inner { padding: 0 15px; }
            .dn-nav-item { padding: 6px 8px; }
            .dn-nav-item span { font-size: 8px; }
            .dn-logo-title { font-size: 14px; }

            .dn-section { padding: 70px 20px; }
            .dn-creadores-grid { gap: 30px; }
            .dn-proceso-steps { gap: 20px; }

            .dn-cta-buttons { flex-direction: column; align-items: center; }
            .dn-btn { width: 100%; max-width: 300px; justify-content: center; }
        }
    </style>
    <?php
}

function duendes_nosotros_header() {
    ?>
    <header class="dn-header">
        <div class="dn-header-inner">
            <nav class="dn-nav-group">
                <a href="<?php echo home_url('/tienda/'); ?>" class="dn-nav-item">
                    <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span>Tienda</span>
                </a>
                <a href="<?php echo home_url('/test-del-guardian/'); ?>" class="dn-nav-item">
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span>Test</span>
                </a>
            </nav>

            <a href="<?php echo home_url(); ?>" class="dn-header-logo">
                <div class="dn-logo-title">DUENDES DEL URUGUAY</div>
                <div class="dn-logo-tagline">Guardianes del Alma</div>
            </a>

            <nav class="dn-nav-group">
                <a href="<?php echo home_url('/nosotros/'); ?>" class="dn-nav-item active">
                    <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span>Nosotros</span>
                </a>
                <a href="<?php echo home_url('/circulo/'); ?>" class="dn-nav-item">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                    <span>Circulo</span>
                </a>
            </nav>
        </div>
    </header>
    <?php
}

function duendes_nosotros_content() {
    ?>
    <div class="dn-nosotros">

        <!-- HERO -->
        <section class="dn-hero">
            <div class="dn-particles">
                <?php for($i = 1; $i <= 15; $i++): ?>
                <div class="dn-particle" style="left: <?php echo rand(5, 95); ?>%; top: <?php echo rand(10, 90); ?>%; animation-delay: <?php echo $i * 0.5; ?>s;"></div>
                <?php endfor; ?>
            </div>

            <div class="dn-hero-badge">Desde Piriapolis, Uruguay</div>
            <h1 class="dn-hero-title">Thibisay & Gabriel</h1>
            <p class="dn-hero-subtitle">Los Canalizadores</p>
            <p class="dn-hero-intro">
                No fabricamos munhecos. Canalizamos seres que ya existian,
                esperando encontrar a la persona correcta.
            </p>

            <div class="dn-scroll-hint">
                <span>Nuestra historia</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>
        </section>

        <!-- HISTORIA -->
        <section class="dn-section-full dn-historia">
            <div class="dn-section">
                <h2 class="dn-section-title">Como Empezo Todo</h2>
                <p class="dn-section-subtitle">Una historia que no planeamos, pero que cambio todo</p>

                <div class="dn-historia-content">
                    <p class="dn-historia-text">
                        <strong>2015, Ciudad del Plata.</strong> Thibisay trabajaba como artesana, creando figuras de porcelana fria
                        por encargo. Un dia, sin pensarlo, modelo un pequenio ser diferente a todo lo que habia hecho antes.
                        No era un pedido. No tenia destino. Simplemente... aparecio.
                    </p>

                    <p class="dn-historia-text">
                        Algo extranio paso cuando lo termino: sintio que no lo habia creado ella.
                        <strong>Sintio que lo habia canalizado.</strong> Como si ese ser ya existiera en algun lugar
                        y solo hubiera usado sus manos para manifestarse.
                    </p>

                    <div class="dn-historia-highlight">
                        "Cuando subimos la primera foto a Instagram, alguien escribio:
                        'Siento que ese duende me esta mirando'. Ahi supimos que habia algo mas."
                    </div>

                    <p class="dn-historia-text">
                        Gabriel, escultor de formacion, empezo a participar. Juntos desarrollaron la tecnica
                        que hoy define cada guardian: <strong>sin moldes, sin repeticiones, cada uno unico.</strong>
                        No por eleccion artistica, sino porque cada ser que canalizan tiene su propia esencia.
                    </p>

                    <p class="dn-historia-text">
                        En 2020, la pandemia los obligo a replantearse todo. En ese mismo momento,
                        sus mellizos fueron diagnosticados con autismo. La mayoria hubiera abandonado.
                        Ellos se aferraron a los guardianes. <strong>Y los guardianes los sostuvieron.</strong>
                    </p>

                    <p class="dn-historia-text">
                        Hoy, desde Piriapolis -uno de los puntos energeticos mas poderosos de Uruguay-
                        siguen canalizando. Cada guardian que nace en su taller lleva una parte de esa historia:
                        de prueba, de fe, de resistencia.
                    </p>
                </div>
            </div>
        </section>

        <!-- CREADORES -->
        <section class="dn-section-full dn-creadores">
            <div class="dn-section">
                <h2 class="dn-section-title">Quienes Somos</h2>
                <p class="dn-section-subtitle">Dos almas, una mision</p>

                <div class="dn-creadores-grid">
                    <div class="dn-creador-card">
                        <div class="dn-creador-img">
                            <!-- Placeholder - reemplazar con imagen real si existe -->
                            <svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="currentColor" stroke-width="1" style="color: var(--dn-gold);">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                        <h3 class="dn-creador-name">Thibisay</h3>
                        <p class="dn-creador-role">Canalizadora & Conexion Energetica</p>
                        <p class="dn-creador-desc">
                            Desde nina supo que percibia cosas que otros no veian.
                            Con los anios aprendio a usar ese don para conectar a las personas
                            con los seres que las cuidan. Cada guardian que canaliza
                            viene con un mensaje especifico para quien lo recibe.
                        </p>
                        <p class="dn-creador-quote">
                            "No elijo a los guardianes. Ellos eligen a sus personas."
                        </p>
                    </div>

                    <div class="dn-creador-card">
                        <div class="dn-creador-img">
                            <svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="currentColor" stroke-width="1" style="color: var(--dn-gold);">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                        <h3 class="dn-creador-name">Gabriel</h3>
                        <p class="dn-creador-role">Escultor & Maestro Artesano</p>
                        <p class="dn-creador-desc">
                            Escultor de profesion, aprendio a trabajar sin moldes
                            porque entendio que cada guardian necesita su propia forma.
                            Sus manos dan cuerpo a lo que Thibisay percibe,
                            creando piezas que son arte y portal al mismo tiempo.
                        </p>
                        <p class="dn-creador-quote">
                            "Mis manos son herramientas. El guardian decide su forma."
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- MISION -->
        <section class="dn-section-full dn-mision">
            <div class="dn-section">
                <h2 class="dn-section-title">Nuestra Mision</h2>

                <div class="dn-mision-box">
                    <div class="dn-mision-icon">
                        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--dn-gold);">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <p class="dn-mision-text">
                        Creemos que cada persona tiene un guardian esperandola.
                        Alguien -o algo- que ya la conoce, que entiende sus luchas,
                        que vino a acompanarla en este tramo del camino.<br><br>
                        Nuestra mision es ser el puente. <strong>Conectar personas con los seres
                        que ya las estaban buscando.</strong> No vendemos objetos decorativos.
                        Facilitamos encuentros que estaban destinados a suceder.
                    </p>
                </div>
            </div>
        </section>

        <!-- PROCESO -->
        <section class="dn-section-full dn-proceso">
            <div class="dn-section">
                <h2 class="dn-section-title">El Proceso de Creacion</h2>
                <p class="dn-section-subtitle">Cada guardian pasa por un viaje antes de llegar a vos</p>

                <div class="dn-proceso-steps">
                    <div class="dn-proceso-step">
                        <div class="dn-proceso-num">1</div>
                        <h4 class="dn-proceso-title">Canalizacion</h4>
                        <p class="dn-proceso-desc">
                            Thibisay entra en estado meditativo y percibe al guardian:
                            su forma, su energia, su proposito. No hay bocetos previos.
                        </p>
                    </div>

                    <div class="dn-proceso-step">
                        <div class="dn-proceso-num">2</div>
                        <h4 class="dn-proceso-title">Escultura</h4>
                        <p class="dn-proceso-desc">
                            Gabriel modela a mano, sin moldes. Cada detalle -expresion,
                            postura, accesorios- emerge durante el proceso.
                        </p>
                    </div>

                    <div class="dn-proceso-step">
                        <div class="dn-proceso-num">3</div>
                        <h4 class="dn-proceso-title">Activacion</h4>
                        <p class="dn-proceso-desc">
                            Una vez terminado, el guardian es activado energeticamente.
                            Se le asigna nombre y se documenta su historia.
                        </p>
                    </div>

                    <div class="dn-proceso-step">
                        <div class="dn-proceso-num">4</div>
                        <h4 class="dn-proceso-title">Encuentro</h4>
                        <p class="dn-proceso-desc">
                            El guardian espera a su persona. Cuando la encuentra,
                            preparamos todo para que llegue con su mensaje personal.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- DIFERENCIA -->
        <section class="dn-section-full dn-diferencia">
            <div class="dn-section">
                <h2 class="dn-section-title">Por Que Somos Diferentes</h2>
                <p class="dn-section-subtitle">Esto no es artesania comun</p>

                <div class="dn-diferencia-grid">
                    <div class="dn-diferencia-item">
                        <div class="dn-diferencia-icon">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--dn-gold);">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 6v6l4 2"/>
                            </svg>
                        </div>
                        <div class="dn-diferencia-content">
                            <h4>Piezas Unicas, Nunca Repetidas</h4>
                            <p>Cada guardian existe una sola vez. No hay moldes, no hay copias.
                            Cuando encuentra su hogar, desaparece para siempre del catalogo.</p>
                        </div>
                    </div>

                    <div class="dn-diferencia-item">
                        <div class="dn-diferencia-icon">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--dn-gold);">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                        </div>
                        <div class="dn-diferencia-content">
                            <h4>Mensaje Personalizado</h4>
                            <p>Con cada guardian viene una canalizacion escrita especificamente
                            para vos. Un mensaje que tu guardian tiene para decirte.</p>
                        </div>
                    </div>

                    <div class="dn-diferencia-item">
                        <div class="dn-diferencia-icon">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--dn-gold);">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </div>
                        <div class="dn-diferencia-content">
                            <h4>Certificado de Autenticidad</h4>
                            <p>Cada guardian viene con su certificado de canalizacion original,
                            con la historia de su nacimiento y activacion.</p>
                        </div>
                    </div>

                    <div class="dn-diferencia-item">
                        <div class="dn-diferencia-icon">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--dn-gold);">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </div>
                        <div class="dn-diferencia-content">
                            <h4>No Son Munhecos</h4>
                            <p>Son seres. Tienen historia, personalidad, proposito.
                            La gente que los recibe lo siente inmediatamente.</p>
                        </div>
                    </div>

                    <div class="dn-diferencia-item">
                        <div class="dn-diferencia-icon">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--dn-gold);">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="2" y1="12" x2="22" y2="12"/>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                        </div>
                        <div class="dn-diferencia-content">
                            <h4>Envio Mundial</h4>
                            <p>Llegamos a cualquier parte del mundo. Tu guardian viaja
                            protegido, con todo el cuidado que merece.</p>
                        </div>
                    </div>

                    <div class="dn-diferencia-item">
                        <div class="dn-diferencia-icon">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--dn-gold);">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <div class="dn-diferencia-content">
                            <h4>Comunidad</h4>
                            <p>Al adoptar un guardian, entras a una comunidad de personas
                            que comparten esta conexion. No estas sola.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="dn-cta-section">
            <h2 class="dn-cta-title">Tu Guardian Te Espera</h2>
            <p class="dn-cta-text">
                Hay un ser que ya te conoce, que entiende por lo que estas pasando,
                que vino a acompanharte. Tal vez hoy sea el dia de encontrarlo.
            </p>
            <div class="dn-cta-buttons">
                <a href="<?php echo home_url('/test-del-guardian/'); ?>" class="dn-btn dn-btn-primary">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Descubri Tu Guardian
                </a>
                <a href="<?php echo home_url('/tienda/'); ?>" class="dn-btn dn-btn-secondary">
                    Ver Todos los Guardianes
                </a>
            </div>
        </section>

    </div>
    <?php
}

function duendes_nosotros_footer() {
    ?>
    <footer class="dn-footer">
        <p class="dn-footer-text">
            &copy; <?php echo date('Y'); ?> <a href="<?php echo home_url(); ?>">Duendes del Uruguay</a>.
            Todos los derechos reservados. Hecho con amor en Piriapolis.
        </p>
    </footer>
    <?php
}

function duendes_nosotros_scripts() {
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Scroll suave para el indicador
        const scrollHint = document.querySelector('.dn-scroll-hint');
        if (scrollHint) {
            scrollHint.addEventListener('click', function() {
                const nextSection = document.querySelector('.dn-historia');
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
            scrollHint.style.cursor = 'pointer';
        }

        // Animacion de entrada para elementos
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Aplicar a elementos animables
        const animatables = document.querySelectorAll('.dn-creador-card, .dn-proceso-step, .dn-diferencia-item');
        animatables.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    });
    </script>
    <?php
}
