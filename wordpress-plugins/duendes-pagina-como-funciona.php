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
// Usamos template_redirect para tomar control completo (Elementor ignora the_content)
// ═══════════════════════════════════════════════════════════════════════════════

add_action('template_redirect', 'duendes_como_funciona_redirect');

function duendes_como_funciona_redirect() {
    // Solo aplicar en la pagina como-funciona
    if (!is_page('como-funciona')) return;

    // Renderizar la pagina completa
    get_header();
    duendes_render_como_funciona();
    get_footer();
    exit;
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
            width: 50px;
            height: 50px;
            margin: 0 auto 20px;
            color: var(--gold);
        }

        .dcf-diferenciador-icon svg {
            width: 100%;
            height: 100%;
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
            width: 40px;
            height: 40px;
            margin-bottom: 15px;
            color: var(--gold);
        }

        .dcf-step-icon svg {
            width: 100%;
            height: 100%;
        }

        .dcf-step:nth-child(odd) .dcf-step-icon {
            margin-left: auto;
        }

        .dcf-step-title {
            font-family: 'Cinzel', serif;
            font-size: 1.3rem;
            color: var(--gold) !important;
            margin: 0 0 10px;
            font-weight: 500;
        }

        .dcf-step-desc {
            font-size: 1.05rem;
            color: rgba(255,255,255,0.85) !important;
            margin: 0;
            line-height: 1.7;
        }

        .dcf-step h3 {
            color: var(--gold) !important;
        }

        .dcf-step p {
            color: rgba(255,255,255,0.85) !important;
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
            color: var(--gold);
            padding: 20px;
        }

        .dcf-incluye-card-icon svg {
            width: 100%;
            height: 100%;
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
            width: 32px;
            height: 32px;
            margin: 0 auto 12px;
            color: var(--purple);
        }

        .dcf-mi-magia-feature-icon svg {
            width: 100%;
            height: 100%;
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
           FAQ - Preguntas frecuentes - Diseño Elegante
           ═══════════════════════════════════════════════════════════════════ */
        .dcf-faq {
            padding: 100px 20px;
            background: linear-gradient(180deg, var(--bg-dark) 0%, #0a0812 50%, var(--bg-dark) 100%);
            position: relative;
        }

        .dcf-faq::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse 600px 400px at 50% 30%, rgba(201, 162, 39, 0.03) 0%, transparent 70%);
            pointer-events: none;
        }

        .dcf-faq-inner {
            max-width: 900px;
            margin: 0 auto;
            position: relative;
            z-index: 2;
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
            font-style: italic;
        }

        .dcf-faq-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
        }

        @media (max-width: 480px) {
            .dcf-faq-grid {
                grid-template-columns: 1fr;
            }
        }

        .dcf-faq-item {
            background: rgba(255,255,255,0.015);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.4s ease;
        }

        .dcf-faq-item:hover {
            border-color: rgba(201, 162, 39, 0.25);
            background: rgba(255,255,255,0.025);
        }

        .dcf-faq-question {
            width: 100%;
            padding: 24px 28px;
            background: transparent;
            border: none;
            text-align: left;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.15rem;
            font-weight: 500;
            color: #fff;
            transition: all 0.3s ease;
        }

        .dcf-faq-question:hover {
            color: var(--gold);
        }

        .dcf-faq-toggle {
            width: 28px;
            height: 28px;
            border: 1px solid rgba(201, 162, 39, 0.4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.3s ease;
        }

        .dcf-faq-toggle svg {
            width: 14px;
            height: 14px;
            stroke: var(--gold);
            stroke-width: 2;
            transition: transform 0.3s ease;
        }

        .dcf-faq-item.active .dcf-faq-toggle {
            background: var(--gold);
            border-color: var(--gold);
        }

        .dcf-faq-item.active .dcf-faq-toggle svg {
            stroke: #0a0a0a;
            transform: rotate(45deg);
        }

        .dcf-faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dcf-faq-item.active .dcf-faq-answer {
            max-height: 400px;
        }

        .dcf-faq-answer-inner {
            padding: 0 28px 24px;
            font-size: 1rem;
            color: rgba(255,255,255,0.7);
            line-height: 1.8;
        }

        .dcf-faq-answer-inner strong {
            color: var(--gold);
            font-weight: 500;
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

        .dcf-trust-signal svg {
            width: 20px;
            height: 20px;
            color: var(--gold);
            flex-shrink: 0;
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
        // FORZAR COLORES DEL TIMELINE
        document.querySelectorAll('.dcf-step-title').forEach(function(el) {
            el.style.setProperty('color', '#C9A227', 'important');
        });
        document.querySelectorAll('.dcf-step-desc').forEach(function(el) {
            el.style.setProperty('color', 'rgba(255,255,255,0.85)', 'important');
        });

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
    <style>
    /* CSS INLINE - DENTRO DEL CONTENIDO */
    .dcf-wrapper {
        --gold: #c9a227;
        --gold-light: #e8d48b;
        --purple: #9370db;
        --bg-dark: #0a0a0a;
        --text-light: rgba(255,255,255,0.85);
        --text-muted: rgba(255,255,255,0.6);
        font-family: 'Cormorant Garamond', Georgia, serif;
        color: var(--text-light);
        background: var(--bg-dark);
    }
    .dcf-step-title {
        color: #C9A227 !important;
        font-family: 'Cinzel', serif !important;
    }
    .dcf-step-desc {
        color: rgba(255,255,255,0.85) !important;
    }
    .dcf-faq-question span:first-child {
        color: #fff !important;
    }
    .dcf-faq-answer-inner {
        color: rgba(255,255,255,0.7) !important;
    }
    </style>
    <div class="dcf-wrapper">

        <!-- ═══════════════════════════════════════════════════════════════════
             HERO SECTION
             ═══════════════════════════════════════════════════════════════════ -->
        <section class="dcf-hero">
            <div class="dcf-hero-content">
                <span class="dcf-badge">Una experiencia única</span>
                <h1>No comprás un guardián.<br><span>Él te elige a vos.</span></h1>
                <p class="dcf-hero-subtitle">
                    Cada guardián es una pieza única, creada a mano en Piriápolis.
                    Y cada uno busca a la persona correcta para acompañar.
                </p>
                <a href="/descubri-que-duende-te-elige/" class="dcf-hero-cta">
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
                <h2>Esto no es una tienda común</h2>
                <p class="dcf-intro-text">
                    <strong>No vendemos muñequitos.</strong> Creamos guardianes con historia,
                    personalidad y propósito. Cada uno está hecho a mano, canalizado con intención,
                    y viene con un mensaje personal escrito <strong>específicamente para vos</strong>.
                    <br><br>
                    No es decoración. No es coleccionismo. Es una conexión.
                </p>

                <div class="dcf-diferenciadores">
                    <div class="dcf-diferenciador">
                        <div class="dcf-diferenciador-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                                <path d="M2 2l7.586 7.586"/>
                                <circle cx="11" cy="11" r="2"/>
                            </svg>
                        </div>
                        <h4>100% Hechos a Mano</h4>
                        <p>Cada guardián es modelado, pintado y terminado manualmente. No hay dos iguales.</p>
                    </div>
                    <div class="dcf-diferenciador">
                        <div class="dcf-diferenciador-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                            </svg>
                        </div>
                        <h4>Canalización Personal</h4>
                        <p>Recibís una carta escrita por tu guardián, basada en lo que compartís al comprar.</p>
                    </div>
                    <div class="dcf-diferenciador">
                        <div class="dcf-diferenciador-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </div>
                        <h4>Pieza Única</h4>
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
                        <div class="dcf-step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                        </div>
                        <h3 class="dcf-step-title" style="color: #C9A227 !important;">El Encuentro</h3>
                        <p class="dcf-step-desc" style="color: rgba(255,255,255,0.85) !important;">
                            Hacé el Test del Guardián o explorá la tienda. Algo te detiene en uno.
                            No sabemos por qué, pero pasa. Eso es el llamado.
                        </p>
                    </div>
                </div>

                <!-- Paso 2 -->
                <div class="dcf-step">
                    <div class="dcf-step-number">2</div>
                    <div class="dcf-step-content">
                        <div class="dcf-step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                            </svg>
                        </div>
                        <h3 class="dcf-step-title" style="color: #C9A227 !important;">Tu Historia</h3>
                        <p class="dcf-step-desc" style="color: rgba(255,255,255,0.85) !important;">
                            Al adoptar, te pedimos que compartas un poco de vos: qué estás viviendo,
                            qué buscás, para quién es. Esto alimenta tu canalización.
                        </p>
                    </div>
                </div>

                <!-- Paso 3 -->
                <div class="dcf-step">
                    <div class="dcf-step-number">3</div>
                    <div class="dcf-step-content">
                        <div class="dcf-step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <h3 class="dcf-step-title" style="color: #C9A227 !important;">La Canalización</h3>
                        <p class="dcf-step-desc" style="color: rgba(255,255,255,0.85) !important;">
                            Thibisay lee lo que compartiste y canaliza el mensaje de tu guardián.
                            No es genérico: es una carta personal escrita para vos.
                        </p>
                    </div>
                </div>

                <!-- Paso 4 -->
                <div class="dcf-step">
                    <div class="dcf-step-number">4</div>
                    <div class="dcf-step-content">
                        <div class="dcf-step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            </svg>
                        </div>
                        <h3 class="dcf-step-title" style="color: #C9A227 !important;">La Preparación</h3>
                        <p class="dcf-step-desc" style="color: rgba(255,255,255,0.85) !important;">
                            Tu guardián es preparado con ritual: sahúmo, cristales y la intención
                            de proteger el viaje. Luego es empacado con sumo cuidado.
                        </p>
                    </div>
                </div>

                <!-- Paso 5 -->
                <div class="dcf-step">
                    <div class="dcf-step-number">5</div>
                    <div class="dcf-step-content">
                        <div class="dcf-step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                            </svg>
                        </div>
                        <h3 class="dcf-step-title" style="color: #C9A227 !important;">El Viaje</h3>
                        <p class="dcf-step-desc" style="color: rgba(255,255,255,0.85) !important;">
                            Sale de Piriápolis hacia vos. DHL Express internacional (5-7 días)
                            o DAC para Uruguay (24-72hs). Siempre con seguimiento.
                        </p>
                    </div>
                </div>

                <!-- Paso 6 -->
                <div class="dcf-step">
                    <div class="dcf-step-number">6</div>
                    <div class="dcf-step-content">
                        <div class="dcf-step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </div>
                        <h3 class="dcf-step-title" style="color: #C9A227 !important;">El Encuentro Real</h3>
                        <p class="dcf-step-desc" style="color: rgba(255,255,255,0.85) !important;">
                            Llega a tu puerta. Lo desempacás, leés su carta, hacés el ritual
                            de activación. Y la conexión comienza.
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
                    <span class="dcf-badge">Qué recibís</span>
                    <h2>Mucho más que una figura</h2>
                    <p>Cada adopción incluye todo lo que necesitás para conectar</p>
                </div>

                <div class="dcf-incluye-grid">
                    <div class="dcf-incluye-card">
                        <div class="dcf-incluye-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <h4>Tu Guardián</h4>
                        <p>
                            Pieza única hecha a mano en nuestro taller de Piriápolis.
                            Modelado en arcilla, pintado con amor, preparado con intención.
                        </p>
                        <div class="dcf-incluye-card-highlight">Pieza única e irrepetible</div>
                    </div>

                    <div class="dcf-incluye-card">
                        <div class="dcf-incluye-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        </div>
                        <h4>Canalización Personal</h4>
                        <p>
                            Una carta de tu guardián escrita especialmente para vos,
                            basada en lo que compartiste. No es genérica: es tuya.
                        </p>
                        <div class="dcf-incluye-card-highlight">Mensaje único e irrepetible</div>
                    </div>

                    <div class="dcf-incluye-card">
                        <div class="dcf-incluye-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <h4>Ritual de Activación</h4>
                        <p>
                            Guía paso a paso para activar la conexión con tu guardián
                            cuando lo recibas. Crea el vínculo inicial.
                        </p>
                        <div class="dcf-incluye-card-highlight">Guía impresa + digital</div>
                    </div>

                    <div class="dcf-incluye-card">
                        <div class="dcf-incluye-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                        </div>
                        <h4>Acceso a Mi Magia</h4>
                        <p>
                            Tu portal personal donde guardás tu canalización,
                            podés pedir estudios energéticos y recibir mensajes.
                        </p>
                        <div class="dcf-incluye-card-highlight">Acceso de por vida</div>
                    </div>

                    <div class="dcf-incluye-card">
                        <div class="dcf-incluye-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>
                        </div>
                        <h4>Certificado de Origen</h4>
                        <p>
                            Documento que certifica la autenticidad de tu guardián,
                            su nombre, especie y fecha de canalización.
                        </p>
                        <div class="dcf-incluye-card-highlight">Físico + digital</div>
                    </div>

                    <div class="dcf-incluye-card">
                        <div class="dcf-incluye-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                        </div>
                        <h4>Empaque Protector</h4>
                        <p>
                            Caja con protección múltiple para que tu guardián
                            llegue perfecto. De nuestras manos a las tuyas.
                        </p>
                        <div class="dcf-incluye-card-highlight">Envío asegurado</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════════════════
             MI MAGIA - Portal post-compra
             ═══════════════════════════════════════════════════════════════════ -->
        <section class="dcf-mi-magia">
            <div class="dcf-mi-magia-inner">
                <span class="dcf-mi-magia-badge">Después de recibirlo</span>
                <h2>Tu portal personal: Mi Magia</h2>
                <p class="dcf-mi-magia-desc">
                    Cuando adoptás un guardián, desbloqueamos tu acceso a Mi Magia:
                    un espacio privado donde tu conexión sigue creciendo.
                </p>

                <div class="dcf-mi-magia-features">
                    <div class="dcf-mi-magia-feature">
                        <div class="dcf-mi-magia-feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        </div>
                        <h5>Tu Canalización</h5>
                    </div>
                    <div class="dcf-mi-magia-feature">
                        <div class="dcf-mi-magia-feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        </div>
                        <h5>Estudios Energéticos</h5>
                    </div>
                    <div class="dcf-mi-magia-feature">
                        <div class="dcf-mi-magia-feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        </div>
                        <h5>Mensajes del Guardián</h5>
                    </div>
                    <div class="dcf-mi-magia-feature">
                        <div class="dcf-mi-magia-feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
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
                <h3>El Círculo de Duendes</h3>
                <p>
                    Para quienes quieren ir más profundo. Membresía con contenido exclusivo,
                    canalizaciones mensuales, descuentos especiales y acceso a una comunidad
                    de personas como vos.
                </p>
                <a href="/el-circulo/" class="dcf-circulo-btn">
                    Conocé El Círculo
                </a>
            </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════════════════
             FAQ - Rediseñado
             ═══════════════════════════════════════════════════════════════════ -->
        <section class="dcf-faq">
            <div class="dcf-faq-inner">
                <div class="dcf-faq-header">
                    <h2>Preguntas Frecuentes</h2>
                    <p>Lo que todos quieren saber antes de adoptar</p>
                </div>

                <div class="dcf-faq-grid">
                    <div class="dcf-faq-item">
                        <button class="dcf-faq-question">
                            <span>¿Los guardianes son reales?</span>
                            <span class="dcf-faq-toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
                        </button>
                        <div class="dcf-faq-answer">
                            <div class="dcf-faq-answer-inner">
                                Son tan reales como vos quieras que sean. Son figuras físicas hechas a mano,
                                con historias creadas para conectar con quien las recibe. Si creés en la energía,
                                en la intención, en el poder de los símbolos... entonces sí, son muy reales.
                                Si no, igual tenés una pieza de arte única con un mensaje que te puede remover algo.
                            </div>
                        </div>
                    </div>

                    <div class="dcf-faq-item">
                        <button class="dcf-faq-question">
                            <span>¿Qué es la canalización?</span>
                            <span class="dcf-faq-toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
                        </button>
                        <div class="dcf-faq-answer">
                            <div class="dcf-faq-answer-inner">
                                Es una carta personal de tu guardián para vos. Cuando comprás, te pedimos
                                que compartas un poco de tu momento de vida. Con eso, Thibisay se conecta
                                con la energía del guardián y escribe un mensaje específico para vos.
                                No es genérico: es tuyo. Si cambiaras el nombre, no tendría sentido.
                            </div>
                        </div>
                    </div>

                    <div class="dcf-faq-item">
                        <button class="dcf-faq-question">
                            <span>¿Cuánto tardan en llegar?</span>
                            <span class="dcf-faq-toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
                        </button>
                        <div class="dcf-faq-answer">
                            <div class="dcf-faq-answer-inner">
                                <strong>Uruguay:</strong> 24-72 horas hábiles vía DAC.<br>
                                <strong>Internacional:</strong> 5-7 días hábiles vía DHL Express.<br><br>
                                Antes del envío, tu guardián pasa por la canalización y preparación
                                (2-4 días). Siempre recibís número de seguimiento.
                            </div>
                        </div>
                    </div>

                    <div class="dcf-faq-item">
                        <button class="dcf-faq-question">
                            <span>¿Puedo regalarlo?</span>
                            <span class="dcf-faq-toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
                        </button>
                        <div class="dcf-faq-answer">
                            <div class="dcf-faq-answer-inner">
                                ¡Sí! Tenemos dos opciones:<br><br>
                                <strong>Regalo NO sorpresa:</strong> Vos pagás, y le mandamos el formulario
                                a la persona para que complete sus datos. La canalización se hace para ella.<br><br>
                                <strong>Regalo sorpresa:</strong> Vos completás un formulario especial contando
                                lo que sabés de la persona. La canalización se hace con esa info.
                            </div>
                        </div>
                    </div>

                    <div class="dcf-faq-item">
                        <button class="dcf-faq-question">
                            <span>¿Por qué el precio?</span>
                            <span class="dcf-faq-toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
                        </button>
                        <div class="dcf-faq-answer">
                            <div class="dcf-faq-answer-inner">
                                Cada guardián toma varias horas de trabajo manual: modelado, secado,
                                pintado, detalles, preparación energética. Más la canalización personal,
                                que lleva tiempo de conexión y escritura. No es producción en masa:
                                es artesanía con alma. Y cuando lo recibas, vas a entender.
                            </div>
                        </div>
                    </div>

                    <div class="dcf-faq-item">
                        <button class="dcf-faq-question">
                            <span>¿Qué pasa si se rompe en el viaje?</span>
                            <span class="dcf-faq-toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
                        </button>
                        <div class="dcf-faq-answer">
                            <div class="dcf-faq-answer-inner">
                                Nunca pasó. Pero si pasara, te lo reponemos sin costo.
                                Empacamos con protección extrema precisamente para que tu guardián
                                llegue perfecto. El envío está asegurado.
                            </div>
                        </div>
                    </div>

                    <div class="dcf-faq-item">
                        <button class="dcf-faq-question">
                            <span>¿Es seguro comprar acá?</span>
                            <span class="dcf-faq-toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
                        </button>
                        <div class="dcf-faq-answer">
                            <div class="dcf-faq-answer-inner">
                                Totalmente. Somos un emprendimiento familiar real, con taller en Piriápolis, Uruguay.
                                Trabajamos con pasarelas de pago seguras (Mercado Pago, tarjeta internacional).
                                Tenés nuestros datos de contacto, redes sociales con años de historia,
                                y cientos de clientes felices que pueden dar fe. Si algo sale mal, respondemos.
                            </div>
                        </div>
                    </div>

                    <div class="dcf-faq-item">
                        <button class="dcf-faq-question">
                            <span>¿Hacen envíos internacionales?</span>
                            <span class="dcf-faq-toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
                        </button>
                        <div class="dcf-faq-answer">
                            <div class="dcf-faq-answer-inner">
                                Sí, enviamos a todo el mundo vía DHL Express. El envío incluye seguimiento
                                y seguro. Tu guardián viaja protegido para llegar perfecto a donde estés.
                            </div>
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
                <h2>Tu guardián <span>te está esperando</span></h2>
                <p>
                    No sabemos cómo llegaste acá. Pero si seguiste leyendo hasta el final,
                    quizás hay algo que quiere encontrarte.
                </p>

                <div class="dcf-cta-buttons">
                    <a href="/descubri-que-duende-te-elige/" class="dcf-cta-btn-primary">
                        Hacer el Test del Guardián
                    </a>
                    <a href="/shop/" class="dcf-cta-btn-secondary">
                        Ver la Tienda
                    </a>
                </div>

                <div class="dcf-trust-signals">
                    <div class="dcf-trust-signal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        Pago 100% seguro
                    </div>
                    <div class="dcf-trust-signal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                        Envío con seguimiento
                    </div>
                    <div class="dcf-trust-signal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                        Soporte por WhatsApp
                    </div>
                    <div class="dcf-trust-signal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        Hecho con amor en Uruguay
                    </div>
                </div>
            </div>
        </section>

    </div>
    <?php
}
