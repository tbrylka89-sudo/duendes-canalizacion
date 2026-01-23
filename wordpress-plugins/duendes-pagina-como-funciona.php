<?php
/**
 * Plugin Name: Duendes - Pagina Como Funciona Optimizada
 * Description: Reemplaza el contenido de la pagina "Como Funciona" con una version mejorada para conversion
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTAR Y REEMPLAZAR CONTENIDO DE LA PAGINA COMO FUNCIONA
// ═══════════════════════════════════════════════════════════════════════════════

add_filter('the_content', 'duendes_como_funciona_content', 999);

function duendes_como_funciona_content($content) {
    // Solo aplicar en la pagina como-funciona
    if (!is_page('como-funciona')) return $content;

    ob_start();
    duendes_render_como_funciona();
    return ob_get_clean();
}

// ═══════════════════════════════════════════════════════════════════════════════
// ESTILOS CSS
// ═══════════════════════════════════════════════════════════════════════════════

add_action('wp_head', function() {
    if (!is_page('como-funciona')) return;
    ?>
    <style id="duendes-como-funciona-styles">
        /* Reset y base */
        .dcf-wrapper {
            --gold: #c9a227;
            --gold-light: #e8d48b;
            --gold-dark: #8b6914;
            --purple: #9370db;
            --purple-dark: #6b4db3;
            --bg-dark: #0a0a0a;
            --bg-section: #0d0d0d;
            --text-light: rgba(255,255,255,0.85);
            --text-muted: rgba(255,255,255,0.6);

            font-family: 'Cormorant Garamond', Georgia, serif;
            color: var(--text-light);
            line-height: 1.7;
            background: var(--bg-dark);
        }

        .dcf-wrapper * {
            box-sizing: border-box;
        }

        /* ═══════════════════════════════════════════════════════════════════
           HERO SECTION
           ═══════════════════════════════════════════════════════════════════ */
        .dcf-hero {
            position: relative;
            min-height: 85vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 120px 20px 80px;
            background: linear-gradient(180deg, #0a0a0a 0%, #0d0815 50%, #0a0a0a 100%);
            overflow: hidden;
        }

        .dcf-hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse 800px 600px at 50% 30%, rgba(201, 162, 39, 0.08) 0%, transparent 60%),
                radial-gradient(ellipse 400px 400px at 30% 70%, rgba(147, 112, 219, 0.05) 0%, transparent 50%);
            pointer-events: none;
        }

        .dcf-hero-content {
            position: relative;
            z-index: 2;
            max-width: 800px;
        }

        .dcf-badge {
            display: inline-block;
            padding: 12px 30px;
            background: rgba(201, 162, 39, 0.1);
            border: 1px solid rgba(201, 162, 39, 0.3);
            border-radius: 50px;
            font-family: 'Cinzel', serif;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 4px;
            color: var(--gold);
            margin-bottom: 30px;
        }

        .dcf-hero h1 {
            font-family: 'Cinzel', serif;
            font-size: clamp(36px, 7vw, 64px);
            font-weight: 400;
            color: #fff;
            margin: 0 0 25px;
            line-height: 1.15;
        }

        .dcf-hero h1 span {
            color: var(--gold);
        }

        .dcf-hero-subtitle {
            font-size: clamp(1.1rem, 2.5vw, 1.4rem);
            color: var(--text-muted);
            max-width: 600px;
            margin: 0 auto 40px;
            font-style: italic;
        }

        .dcf-hero-cta {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 18px 45px;
            background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
            border-radius: 50px;
            font-family: 'Cinzel', serif;
            font-size: 0.95rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #0a0a0a !important;
            text-decoration: none !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 40px rgba(201, 162, 39, 0.3);
        }

        .dcf-hero-cta:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 50px rgba(201, 162, 39, 0.45);
            color: #0a0a0a !important;
        }

        .dcf-scroll-hint {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            color: var(--text-muted);
            font-size: 0.85rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            animation: dcf-bounce 2s infinite;
        }

        @keyframes dcf-bounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(10px); }
        }

        /* ═══════════════════════════════════════════════════════════════════
           INTRODUCCION - Por que somos diferentes
           ═══════════════════════════════════════════════════════════════════ */
        .dcf-intro {
            padding: 100px 20px;
            background: var(--bg-section);
            text-align: center;
        }

        .dcf-intro-inner {
            max-width: 800px;
            margin: 0 auto;
        }

        .dcf-intro h2 {
            font-family: 'Cinzel', serif;
            font-size: clamp(28px, 5vw, 42px);
            color: #fff;
            margin: 0 0 30px;
            font-weight: 400;
        }

        .dcf-intro-text {
            font-size: 1.2rem;
            color: var(--text-muted);
            line-height: 1.9;
            margin-bottom: 50px;
        }

        .dcf-intro-text strong {
            color: var(--gold);
            font-weight: 500;
        }

        .dcf-diferenciadores {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }

        .dcf-diferenciador {
            padding: 35px 25px;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(201, 162, 39, 0.15);
            border-radius: 16px;
            transition: all 0.3s ease;
        }

        .dcf-diferenciador:hover {
            border-color: rgba(201, 162, 39, 0.35);
            transform: translateY(-5px);
        }

        .dcf-diferenciador-icon {
            font-size: 40px;
            margin-bottom: 20px;
        }

        .dcf-diferenciador h4 {
            font-family: 'Cinzel', serif;
            font-size: 1.1rem;
            color: var(--gold);
            margin: 0 0 12px;
            font-weight: 500;
        }

        .dcf-diferenciador p {
            font-size: 1rem;
            color: var(--text-muted);
            margin: 0;
            line-height: 1.7;
        }

        /* ═══════════════════════════════════════════════════════════════════
           TIMELINE - Los 6 pasos
           ═══════════════════════════════════════════════════════════════════ */
        .dcf-timeline {
            padding: 100px 20px;
            background: linear-gradient(180deg, var(--bg-dark) 0%, #0d0815 50%, var(--bg-dark) 100%);
        }

        .dcf-timeline-header {
            text-align: center;
            max-width: 700px;
            margin: 0 auto 80px;
        }

        .dcf-timeline-header h2 {
            font-family: 'Cinzel', serif;
            font-size: clamp(28px, 5vw, 42px);
            color: #fff;
            margin: 0 0 20px;
            font-weight: 400;
        }

        .dcf-timeline-header p {
            font-size: 1.15rem;
            color: var(--text-muted);
            font-style: italic;
        }

        .dcf-timeline-steps {
            max-width: 900px;
            margin: 0 auto;
            position: relative;
        }

        /* Linea central */
        .dcf-timeline-steps::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(180deg, transparent 0%, var(--gold) 10%, var(--gold) 90%, transparent 100%);
            transform: translateX(-50%);
            opacity: 0.3;
        }

        .dcf-step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 60px;
            position: relative;
        }

        .dcf-step:nth-child(even) {
            flex-direction: row-reverse;
        }

        .dcf-step-number {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 50px;
            height: 50px;
            background: var(--bg-dark);
            border: 2px solid var(--gold);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Cinzel', serif;
            font-size: 1.2rem;
            color: var(--gold);
            z-index: 2;
        }

        .dcf-step-content {
            width: calc(50% - 60px);
            padding: 30px;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(201, 162, 39, 0.15);
            border-radius: 16px;
            transition: all 0.3s ease;
        }

        .dcf-step:nth-child(odd) .dcf-step-content {
            margin-right: auto;
            text-align: right;
        }

        .dcf-step:nth-child(even) .dcf-step-content {
            margin-left: auto;
            text-align: left;
        }

        .dcf-step-content:hover {
            border-color: rgba(201, 162, 39, 0.4);
            background: rgba(255,255,255,0.03);
        }

        .dcf-step-icon {
            font-size: 32px;
            margin-bottom: 15px;
        }

        .dcf-step-title {
            font-family: 'Cinzel', serif;
            font-size: 1.3rem;
            color: var(--gold);
            margin: 0 0 10px;
            font-weight: 500;
        }

        .dcf-step-desc {
            font-size: 1.05rem;
            color: var(--text-muted);
            margin: 0;
            line-height: 1.7;
        }

        /* Mobile timeline */
        @media (max-width: 768px) {
            .dcf-timeline-steps::before {
                left: 25px;
            }

            .dcf-step,
            .dcf-step:nth-child(even) {
                flex-direction: column;
                padding-left: 70px;
            }

            .dcf-step-number {
                left: 25px;
                top: 0;
            }

            .dcf-step-content,
            .dcf-step:nth-child(odd) .dcf-step-content,
            .dcf-step:nth-child(even) .dcf-step-content {
                width: 100%;
                margin: 0;
                text-align: left;
            }
        }

        /* ═══════════════════════════════════════════════════════════════════
           QUE INCLUYE - Lo que recibis
           ═══════════════════════════════════════════════════════════════════ */
        .dcf-incluye {
            padding: 100px 20px;
            background: var(--bg-section);
        }

        .dcf-incluye-inner {
            max-width: 1100px;
            margin: 0 auto;
        }

        .dcf-incluye-header {
            text-align: center;
            margin-bottom: 60px;
        }

        .dcf-incluye-header h2 {
            font-family: 'Cinzel', serif;
            font-size: clamp(28px, 5vw, 42px);
            color: #fff;
            margin: 0 0 15px;
            font-weight: 400;
        }

        .dcf-incluye-header p {
            font-size: 1.15rem;
            color: var(--text-muted);
            font-style: italic;
        }

        .dcf-incluye-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .dcf-incluye-card {
            padding: 40px 30px;
            background: linear-gradient(135deg, rgba(201, 162, 39, 0.05) 0%, rgba(147, 112, 219, 0.03) 100%);
            border: 1px solid rgba(201, 162, 39, 0.2);
            border-radius: 20px;
            text-align: center;
            transition: all 0.4s ease;
        }

        .dcf-incluye-card:hover {
            transform: translateY(-8px);
            border-color: var(--gold);
            box-shadow: 0 20px 60px rgba(201, 162, 39, 0.15);
        }

        .dcf-incluye-card-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 25px;
            background: rgba(201, 162, 39, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
        }

        .dcf-incluye-card h4 {
            font-family: 'Cinzel', serif;
            font-size: 1.25rem;
            color: #fff;
            margin: 0 0 15px;
            font-weight: 500;
        }

        .dcf-incluye-card p {
            font-size: 1rem;
            color: var(--text-muted);
            margin: 0;
            line-height: 1.7;
        }

        .dcf-incluye-card-highlight {
            margin-top: 20px;
            padding: 12px 20px;
            background: rgba(201, 162, 39, 0.1);
            border-radius: 30px;
            font-family: 'Cinzel', serif;
            font-size: 0.85rem;
            color: var(--gold);
            letter-spacing: 1px;
        }

        /* ═══════════════════════════════════════════════════════════════════
           MI MAGIA - Portal post-compra
           ═══════════════════════════════════════════════════════════════════ */
        .dcf-mi-magia {
            padding: 100px 20px;
            background: linear-gradient(180deg, var(--bg-dark) 0%, #0f0a18 50%, var(--bg-dark) 100%);
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .dcf-mi-magia::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse 600px 500px at 50% 50%, rgba(147, 112, 219, 0.1) 0%, transparent 70%);
            pointer-events: none;
        }

        .dcf-mi-magia-inner {
            position: relative;
            z-index: 2;
            max-width: 900px;
            margin: 0 auto;
        }

        .dcf-mi-magia-badge {
            display: inline-block;
            padding: 12px 30px;
            background: rgba(147, 112, 219, 0.15);
            border: 1px solid rgba(147, 112, 219, 0.35);
            border-radius: 50px;
            font-family: 'Cinzel', serif;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 4px;
            color: var(--purple);
            margin-bottom: 30px;
        }

        .dcf-mi-magia h2 {
            font-family: 'Cinzel', serif;
            font-size: clamp(28px, 5vw, 42px);
            color: #fff;
            margin: 0 0 20px;
            font-weight: 400;
        }

        .dcf-mi-magia-desc {
            font-size: 1.2rem;
            color: var(--text-muted);
            line-height: 1.9;
            margin-bottom: 50px;
            font-style: italic;
        }

        .dcf-mi-magia-features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 25px;
            margin-bottom: 50px;
        }

        .dcf-mi-magia-feature {
            padding: 25px 20px;
            background: rgba(147, 112, 219, 0.08);
            border: 1px solid rgba(147, 112, 219, 0.2);
            border-radius: 12px;
        }

        .dcf-mi-magia-feature-icon {
            font-size: 28px;
            margin-bottom: 12px;
        }

        .dcf-mi-magia-feature h5 {
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            color: var(--purple);
            margin: 0;
            font-weight: 500;
        }

        /* ═══════════════════════════════════════════════════════════════════
           EL CIRCULO
           ═══════════════════════════════════════════════════════════════════ */
        .dcf-circulo {
            padding: 80px 20px;
            background: var(--bg-section);
            text-align: center;
        }

        .dcf-circulo-inner {
            max-width: 700px;
            margin: 0 auto;
            padding: 50px 40px;
            background: linear-gradient(135deg, rgba(201, 162, 39, 0.08) 0%, rgba(147, 112, 219, 0.05) 100%);
            border: 1px solid rgba(201, 162, 39, 0.25);
            border-radius: 24px;
        }

        .dcf-circulo h3 {
            font-family: 'Cinzel', serif;
            font-size: clamp(24px, 4vw, 32px);
            color: #fff;
            margin: 0 0 15px;
            font-weight: 400;
        }

        .dcf-circulo p {
            font-size: 1.1rem;
            color: var(--text-muted);
            line-height: 1.8;
            margin-bottom: 30px;
        }

        .dcf-circulo-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 15px 35px;
            background: transparent;
            border: 2px solid var(--gold);
            border-radius: 50px;
            font-family: 'Cinzel', serif;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--gold) !important;
            text-decoration: none !important;
            transition: all 0.3s ease;
        }

        .dcf-circulo-btn:hover {
            background: var(--gold);
            color: #0a0a0a !important;
        }

        /* ═══════════════════════════════════════════════════════════════════
           FAQ - Preguntas frecuentes
           ═══════════════════════════════════════════════════════════════════ */
        .dcf-faq {
            padding: 100px 20px;
            background: var(--bg-dark);
        }

        .dcf-faq-inner {
            max-width: 800px;
            margin: 0 auto;
        }

        .dcf-faq-header {
            text-align: center;
            margin-bottom: 60px;
        }

        .dcf-faq-header h2 {
            font-family: 'Cinzel', serif;
            font-size: clamp(28px, 5vw, 42px);
            color: #fff;
            margin: 0 0 15px;
            font-weight: 400;
        }

        .dcf-faq-header p {
            font-size: 1.1rem;
            color: var(--text-muted);
        }

        .dcf-faq-item {
            margin-bottom: 20px;
            border: 1px solid rgba(201, 162, 39, 0.15);
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .dcf-faq-item:hover {
            border-color: rgba(201, 162, 39, 0.35);
        }

        .dcf-faq-question {
            width: 100%;
            padding: 25px 30px;
            background: rgba(255,255,255,0.02);
            border: none;
            text-align: left;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            font-family: 'Cinzel', serif;
            font-size: 1.1rem;
            color: #fff;
            transition: all 0.3s ease;
        }

        .dcf-faq-question:hover {
            background: rgba(255,255,255,0.04);
        }

        .dcf-faq-question::after {
            content: '+';
            font-size: 1.5rem;
            color: var(--gold);
            transition: transform 0.3s ease;
        }

        .dcf-faq-item.active .dcf-faq-question::after {
            transform: rotate(45deg);
        }

        .dcf-faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease;
        }

        .dcf-faq-item.active .dcf-faq-answer {
            max-height: 500px;
        }

        .dcf-faq-answer-inner {
            padding: 0 30px 25px;
            font-size: 1.05rem;
            color: var(--text-muted);
            line-height: 1.8;
        }

        /* ═══════════════════════════════════════════════════════════════════
           CTA FINAL
           ═══════════════════════════════════════════════════════════════════ */
        .dcf-cta-final {
            padding: 120px 20px;
            background: linear-gradient(180deg, var(--bg-section) 0%, #0d0815 50%, var(--bg-dark) 100%);
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .dcf-cta-final::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse 800px 500px at 50% 60%, rgba(201, 162, 39, 0.08) 0%, transparent 60%);
            pointer-events: none;
        }

        .dcf-cta-final-inner {
            position: relative;
            z-index: 2;
            max-width: 700px;
            margin: 0 auto;
        }

        .dcf-cta-final h2 {
            font-family: 'Cinzel', serif;
            font-size: clamp(32px, 6vw, 52px);
            color: #fff;
            margin: 0 0 25px;
            font-weight: 400;
            line-height: 1.2;
        }

        .dcf-cta-final h2 span {
            color: var(--gold);
        }

        .dcf-cta-final p {
            font-size: 1.25rem;
            color: var(--text-muted);
            margin-bottom: 45px;
            font-style: italic;
        }

        .dcf-cta-buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            margin-bottom: 40px;
        }

        .dcf-cta-btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 20px 50px;
            background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
            border-radius: 50px;
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #0a0a0a !important;
            text-decoration: none !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 15px 50px rgba(201, 162, 39, 0.35);
        }

        .dcf-cta-btn-primary:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 60px rgba(201, 162, 39, 0.5);
            color: #0a0a0a !important;
        }

        .dcf-cta-btn-secondary {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 18px 40px;
            background: transparent;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50px;
            font-family: 'Cinzel', serif;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #fff !important;
            text-decoration: none !important;
            transition: all 0.3s ease;
        }

        .dcf-cta-btn-secondary:hover {
            border-color: var(--gold);
            color: var(--gold) !important;
        }

        .dcf-trust-signals {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 30px;
            padding-top: 30px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }

        .dcf-trust-signal {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.95rem;
            color: var(--text-muted);
        }

        .dcf-trust-signal span {
            font-size: 1.3rem;
        }

        /* ═══════════════════════════════════════════════════════════════════
           RESPONSIVE
           ═══════════════════════════════════════════════════════════════════ */
        @media (max-width: 768px) {
            .dcf-hero {
                min-height: 70vh;
                padding: 100px 15px 60px;
            }

            .dcf-intro,
            .dcf-timeline,
            .dcf-incluye,
            .dcf-mi-magia,
            .dcf-faq,
            .dcf-cta-final {
                padding: 70px 15px;
            }

            .dcf-diferenciadores {
                grid-template-columns: 1fr;
            }

            .dcf-incluye-grid {
                grid-template-columns: 1fr;
            }

            .dcf-mi-magia-features {
                grid-template-columns: 1fr 1fr;
            }

            .dcf-cta-buttons {
                flex-direction: column;
                align-items: center;
            }

            .dcf-trust-signals {
                flex-direction: column;
                gap: 15px;
            }
        }

        @media (max-width: 480px) {
            .dcf-mi-magia-features {
                grid-template-columns: 1fr;
            }
        }
    </style>
    <?php
});

// ═══════════════════════════════════════════════════════════════════════════════
// JAVASCRIPT PARA FAQ
// ═══════════════════════════════════════════════════════════════════════════════

add_action('wp_footer', function() {
    if (!is_page('como-funciona')) return;
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // FAQ Accordion
        var faqItems = document.querySelectorAll('.dcf-faq-item');
        faqItems.forEach(function(item) {
            var question = item.querySelector('.dcf-faq-question');
            if (question) {
                question.addEventListener('click', function() {
                    // Cerrar otros
                    faqItems.forEach(function(other) {
                        if (other !== item) other.classList.remove('active');
                    });
                    // Toggle actual
                    item.classList.toggle('active');
                });
            }
        });

        // Smooth scroll para links internos
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                var target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    });
    </script>
    <?php
});

// ═══════════════════════════════════════════════════════════════════════════════
// RENDER DEL CONTENIDO
// ═══════════════════════════════════════════════════════════════════════════════

function duendes_render_como_funciona() {
    ?>
    <div class="dcf-wrapper">

        <!-- ═══════════════════════════════════════════════════════════════════
             HERO SECTION
             ═══════════════════════════════════════════════════════════════════ -->
        <section class="dcf-hero">
            <div class="dcf-hero-content">
                <span class="dcf-badge">Una experiencia unica</span>
                <h1>No compras un guardian.<br><span>El te elige a vos.</span></h1>
                <p class="dcf-hero-subtitle">
                    Cada guardian es una pieza unica, creada a mano en Piriapolis.
                    Y cada uno busca a la persona correcta para acompanar.
                </p>
                <a href="/test-del-guardian/" class="dcf-hero-cta">
                    Descubri quien te espera
                </a>
            </div>
            <div class="dcf-scroll-hint">
                <span>Como funciona</span>
                <span style="font-size: 1.5rem;">&#8595;</span>
            </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════════════════
             INTRODUCCION - Por que somos diferentes
             ═══════════════════════════════════════════════════════════════════ -->
        <section class="dcf-intro">
            <div class="dcf-intro-inner">
                <h2>Esto no es una tienda comun</h2>
                <p class="dcf-intro-text">
                    <strong>No vendemos munequitos.</strong> Creamos guardianes con historia,
                    personalidad y proposito. Cada uno esta hecho a mano, canalizado con intencion,
                    y viene con un mensaje personal escrito <strong>especificamente para vos</strong>.
                    <br><br>
                    No es decoracion. No es coleccionismo. Es una conexion.
                </p>

                <div class="dcf-diferenciadores">
                    <div class="dcf-diferenciador">
                        <div class="dcf-diferenciador-icon">&#9997;</div>
                        <h4>100% Hechos a Mano</h4>
                        <p>Cada guardian es modelado, pintado y terminado manualmente. No hay dos iguales.</p>
                    </div>
                    <div class="dcf-diferenciador">
                        <div class="dcf-diferenciador-icon">&#128156;</div>
                        <h4>Canalizacion Personal</h4>
                        <p>Recibis una carta escrita por tu guardian, basada en lo que compartis al comprar.</p>
                    </div>
                    <div class="dcf-diferenciador">
                        <div class="dcf-diferenciador-icon">&#127775;</div>
                        <h4>Pieza Unica</h4>
                        <p>Cuando alguien lo adopta, desaparece de la tienda. Solo existe uno de cada.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════════════════
             TIMELINE - Los 6 pasos
             ═══════════════════════════════════════════════════════════════════ -->
        <section class="dcf-timeline" id="pasos">
            <div class="dcf-timeline-header">
                <span class="dcf-badge">El viaje de tu guardian</span>
                <h2>De nuestro taller a tu hogar</h2>
                <p>Desde el momento que te encuentra hasta que llega a tus manos</p>
            </div>

            <div class="dcf-timeline-steps">
                <!-- Paso 1 -->
                <div class="dcf-step">
                    <div class="dcf-step-number">1</div>
                    <div class="dcf-step-content">
                        <div class="dcf-step-icon">&#128270;</div>
                        <h3 class="dcf-step-title">El Encuentro</h3>
                        <p class="dcf-step-desc">
                            Hace el Test del Guardian o explora la tienda. Algo te detiene en uno.
                            No sabemos por que, pero pasa. Eso es el llamado.
                        </p>
                    </div>
                </div>

                <!-- Paso 2 -->
                <div class="dcf-step">
                    <div class="dcf-step-number">2</div>
                    <div class="dcf-step-content">
                        <div class="dcf-step-icon">&#128221;</div>
                        <h3 class="dcf-step-title">Tu Historia</h3>
                        <p class="dcf-step-desc">
                            Al adoptar, te pedimos que compartas un poco de vos: que estas viviendo,
                            que buscas, para quien es. Esto alimenta tu canalizacion.
                        </p>
                    </div>
                </div>

                <!-- Paso 3 -->
                <div class="dcf-step">
                    <div class="dcf-step-number">3</div>
                    <div class="dcf-step-content">
                        <div class="dcf-step-icon">&#10024;</div>
                        <h3 class="dcf-step-title">La Canalizacion</h3>
                        <p class="dcf-step-desc">
                            Thibisay lee lo que compartiste y canaliza el mensaje de tu guardian.
                            No es generico: es una carta personal escrita para vos.
                        </p>
                    </div>
                </div>

                <!-- Paso 4 -->
                <div class="dcf-step">
                    <div class="dcf-step-number">4</div>
                    <div class="dcf-step-content">
                        <div class="dcf-step-icon">&#127873;</div>
                        <h3 class="dcf-step-title">La Preparacion</h3>
                        <p class="dcf-step-desc">
                            Tu guardian es preparado con ritual: sahumo, cristales y la intencion
                            de proteger el viaje. Luego es empacado con sumo cuidado.
                        </p>
                    </div>
                </div>

                <!-- Paso 5 -->
                <div class="dcf-step">
                    <div class="dcf-step-number">5</div>
                    <div class="dcf-step-content">
                        <div class="dcf-step-icon">&#9992;</div>
                        <h3 class="dcf-step-title">El Viaje</h3>
                        <p class="dcf-step-desc">
                            Sale de Piriapolis hacia vos. DHL Express internacional (5-7 dias)
                            o DAC para Uruguay (24-72hs). Siempre con seguimiento.
                        </p>
                    </div>
                </div>

                <!-- Paso 6 -->
                <div class="dcf-step">
                    <div class="dcf-step-number">6</div>
                    <div class="dcf-step-content">
                        <div class="dcf-step-icon">&#128150;</div>
                        <h3 class="dcf-step-title">El Encuentro Real</h3>
                        <p class="dcf-step-desc">
                            Llega a tu puerta. Lo desempacas, lees su carta, haces el ritual
                            de activacion. Y la conexion comienza.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════════════════
             QUE INCLUYE - Lo que recibis
             ═══════════════════════════════════════════════════════════════════ -->
        <section class="dcf-incluye">
            <div class="dcf-incluye-inner">
                <div class="dcf-incluye-header">
                    <span class="dcf-badge">Que recibis</span>
                    <h2>Mucho mas que una figura</h2>
                    <p>Cada adopcion incluye todo lo que necesitas para conectar</p>
                </div>

                <div class="dcf-incluye-grid">
                    <div class="dcf-incluye-card">
                        <div class="dcf-incluye-card-icon">&#129668;</div>
                        <h4>Tu Guardian</h4>
                        <p>
                            Pieza unica hecha a mano en nuestro taller de Piriapolis.
                            Modelado en arcilla, pintado con amor, preparado con intencion.
                        </p>
                        <div class="dcf-incluye-card-highlight">Pieza unica e irrepetible</div>
                    </div>

                    <div class="dcf-incluye-card">
                        <div class="dcf-incluye-card-icon">&#128220;</div>
                        <h4>Canalizacion Personal</h4>
                        <p>
                            Una carta de tu guardian escrita especialmente para vos,
                            basada en lo que compartiste. No es generica: es tuya.
                        </p>
                        <div class="dcf-incluye-card-highlight">Mensaje unico e irrepetible</div>
                    </div>

                    <div class="dcf-incluye-card">
                        <div class="dcf-incluye-card-icon">&#128302;</div>
                        <h4>Ritual de Activacion</h4>
                        <p>
                            Guia paso a paso para activar la conexion con tu guardian
                            cuando lo recibas. Crea el vinculo inicial.
                        </p>
                        <div class="dcf-incluye-card-highlight">Guia impresa + digital</div>
                    </div>

                    <div class="dcf-incluye-card">
                        <div class="dcf-incluye-card-icon">&#127919;</div>
                        <h4>Acceso a Mi Magia</h4>
                        <p>
                            Tu portal personal donde guardas tu canalizacion,
                            podes pedir estudios energeticos y recibir mensajes.
                        </p>
                        <div class="dcf-incluye-card-highlight">Acceso de por vida</div>
                    </div>

                    <div class="dcf-incluye-card">
                        <div class="dcf-incluye-card-icon">&#128197;</div>
                        <h4>Certificado de Origen</h4>
                        <p>
                            Documento que certifica la autenticidad de tu guardian,
                            su nombre, especie y fecha de canalizacion.
                        </p>
                        <div class="dcf-incluye-card-highlight">Fisico + digital</div>
                    </div>

                    <div class="dcf-incluye-card">
                        <div class="dcf-incluye-card-icon">&#128230;</div>
                        <h4>Empaque Protector</h4>
                        <p>
                            Caja con proteccion multiple para que tu guardian
                            llegue perfecto. De nuestras manos a las tuyas.
                        </p>
                        <div class="dcf-incluye-card-highlight">Envio asegurado</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════════════════
             MI MAGIA - Portal post-compra
             ═══════════════════════════════════════════════════════════════════ -->
        <section class="dcf-mi-magia">
            <div class="dcf-mi-magia-inner">
                <span class="dcf-mi-magia-badge">Despues de recibirlo</span>
                <h2>Tu portal personal: Mi Magia</h2>
                <p class="dcf-mi-magia-desc">
                    Cuando adoptas un guardian, desbloqueamos tu acceso a Mi Magia:
                    un espacio privado donde tu conexion sigue creciendo.
                </p>

                <div class="dcf-mi-magia-features">
                    <div class="dcf-mi-magia-feature">
                        <div class="dcf-mi-magia-feature-icon">&#128220;</div>
                        <h5>Tu Canalizacion</h5>
                    </div>
                    <div class="dcf-mi-magia-feature">
                        <div class="dcf-mi-magia-feature-icon">&#128302;</div>
                        <h5>Estudios Energeticos</h5>
                    </div>
                    <div class="dcf-mi-magia-feature">
                        <div class="dcf-mi-magia-feature-icon">&#128172;</div>
                        <h5>Mensajes del Guardian</h5>
                    </div>
                    <div class="dcf-mi-magia-feature">
                        <div class="dcf-mi-magia-feature-icon">&#127775;</div>
                        <h5>Runas para Canjear</h5>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════════════════
             EL CIRCULO
             ═══════════════════════════════════════════════════════════════════ -->
        <section class="dcf-circulo">
            <div class="dcf-circulo-inner">
                <h3>El Circulo de Duendes</h3>
                <p>
                    Para quienes quieren ir mas profundo. Membresia con contenido exclusivo,
                    canalizaciones mensuales, descuentos especiales y acceso a una comunidad
                    de personas como vos.
                </p>
                <a href="/el-circulo/" class="dcf-circulo-btn">
                    Conoce El Circulo
                </a>
            </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════════════════
             FAQ
             ═══════════════════════════════════════════════════════════════════ -->
        <section class="dcf-faq">
            <div class="dcf-faq-inner">
                <div class="dcf-faq-header">
                    <h2>Preguntas Frecuentes</h2>
                    <p>Lo que todos quieren saber antes de adoptar</p>
                </div>

                <div class="dcf-faq-item">
                    <button class="dcf-faq-question">Los guardianes son reales?</button>
                    <div class="dcf-faq-answer">
                        <div class="dcf-faq-answer-inner">
                            Son tan reales como vos quieras que sean. Son figuras fisicas hechas a mano,
                            con historias creadas para conectar con quien las recibe. Si crees en la energia,
                            en la intencion, en el poder de los simbolos... entonces si, son muy reales.
                            Si no, igual tenes una pieza de arte unica con un mensaje que te puede remover algo.
                        </div>
                    </div>
                </div>

                <div class="dcf-faq-item">
                    <button class="dcf-faq-question">Que es la canalizacion?</button>
                    <div class="dcf-faq-answer">
                        <div class="dcf-faq-answer-inner">
                            Es una carta personal de tu guardian para vos. Cuando compras, te pedimos
                            que compartas un poco de tu momento de vida. Con eso, Thibisay se conecta
                            con la energia del guardian y escribe un mensaje especifico para vos.
                            No es generico: es tuyo. Si cambiaras el nombre, no tendria sentido.
                        </div>
                    </div>
                </div>

                <div class="dcf-faq-item">
                    <button class="dcf-faq-question">Cuanto tardan en llegar?</button>
                    <div class="dcf-faq-answer">
                        <div class="dcf-faq-answer-inner">
                            <strong>Uruguay:</strong> 24-72 horas habiles via DAC.<br>
                            <strong>Internacional:</strong> 5-7 dias habiles via DHL Express.<br><br>
                            Antes del envio, tu guardian pasa por la canalizacion y preparacion
                            (2-4 dias). Siempre recibis numero de seguimiento.
                        </div>
                    </div>
                </div>

                <div class="dcf-faq-item">
                    <button class="dcf-faq-question">Puedo regalarlo?</button>
                    <div class="dcf-faq-answer">
                        <div class="dcf-faq-answer-inner">
                            Si! Tenemos dos opciones:<br><br>
                            <strong>Regalo NO sorpresa:</strong> Vos pagas, y le mandamos el formulario
                            a la persona para que complete sus datos. La canalizacion se hace para ella.<br><br>
                            <strong>Regalo sorpresa:</strong> Vos completas un formulario especial contando
                            lo que sabes de la persona. La canalizacion se hace con esa info.
                        </div>
                    </div>
                </div>

                <div class="dcf-faq-item">
                    <button class="dcf-faq-question">Por que el precio?</button>
                    <div class="dcf-faq-answer">
                        <div class="dcf-faq-answer-inner">
                            Cada guardian toma varias horas de trabajo manual: modelado, secado,
                            pintado, detalles, preparacion energetica. Mas la canalizacion personal,
                            que lleva tiempo de conexion y escritura. No es produccion en masa:
                            es artesania con alma. Y cuando lo recibas, vas a entender.
                        </div>
                    </div>
                </div>

                <div class="dcf-faq-item">
                    <button class="dcf-faq-question">Que pasa si se rompe en el viaje?</button>
                    <div class="dcf-faq-answer">
                        <div class="dcf-faq-answer-inner">
                            Nunca paso. Pero si pasara, te lo reponemos sin costo.
                            Empacamos con proteccion extrema precisamente para que tu guardian
                            llegue perfecto. El envio esta asegurado.
                        </div>
                    </div>
                </div>

                <div class="dcf-faq-item">
                    <button class="dcf-faq-question">Esto es una estafa?</button>
                    <div class="dcf-faq-answer">
                        <div class="dcf-faq-answer-inner">
                            Entendemos la pregunta. Hay mucho humo en internet.
                            Somos un emprendimiento familiar real, con taller en Piriapolis, Uruguay.
                            Trabajamos con pasarelas de pago seguras (Mercado Pago, tarjeta internacional).
                            Tenes nuestros datos de contacto, redes sociales con anos de historia,
                            y cientos de clientes felices que pueden dar fe. Si algo sale mal, respondemos.
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════════════════
             CTA FINAL
             ═══════════════════════════════════════════════════════════════════ -->
        <section class="dcf-cta-final">
            <div class="dcf-cta-final-inner">
                <h2>Tu guardian <span>te esta esperando</span></h2>
                <p>
                    No sabemos como llegaste aca. Pero si seguiste leyendo hasta el final,
                    quizas hay algo que quiere encontrarte.
                </p>

                <div class="dcf-cta-buttons">
                    <a href="/test-del-guardian/" class="dcf-cta-btn-primary">
                        Hacer el Test del Guardian
                    </a>
                    <a href="/tienda/" class="dcf-cta-btn-secondary">
                        Ver la Tienda
                    </a>
                </div>

                <div class="dcf-trust-signals">
                    <div class="dcf-trust-signal">
                        <span>&#128274;</span>
                        Pago 100% seguro
                    </div>
                    <div class="dcf-trust-signal">
                        <span>&#9992;</span>
                        Envio con seguimiento
                    </div>
                    <div class="dcf-trust-signal">
                        <span>&#128172;</span>
                        Soporte por WhatsApp
                    </div>
                    <div class="dcf-trust-signal">
                        <span>&#10084;</span>
                        Hecho con amor en Uruguay
                    </div>
                </div>
            </div>
        </section>

    </div>
    <?php
}
