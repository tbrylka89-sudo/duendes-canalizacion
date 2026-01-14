<?php
/**
 * Plugin Name: Duendes Test Guardian v3.6
 * Description: Test del Guardián - Diseño cinematográfico premium
 * Version: 3.6
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

add_action('wp_footer', 'duendes_test_guardian_v3');

function duendes_test_guardian_v3() {
    if (strpos($_SERVER['REQUEST_URI'], 'descubri') === false) return;
    $ajax_url = admin_url('admin-ajax.php');
    ?>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">

    <style id="tg-v3-styles">
    /* ═══════════════════════════════════════════════════════════════════════════
       VARIABLES - PALETA CINEMATOGRÁFICA
       ═══════════════════════════════════════════════════════════════════════════ */
    :root {
        --tg-bg: #05060A;
        --tg-bg-glass: rgba(10, 12, 18, 0.85);
        --tg-text: #F5F7FF;
        --tg-text-soft: rgba(245, 247, 255, 0.75);
        --tg-text-muted: rgba(245, 247, 255, 0.5);
        --tg-neon: #3B82F6;
        --tg-neon-glow: rgba(59, 130, 246, 0.35);
        --tg-neon-soft: rgba(59, 130, 246, 0.12);
        --tg-gold: #D4AF37;
        --tg-gold-soft: rgba(212, 175, 55, 0.7);
    }

    #tg-app {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: var(--tg-bg);
        z-index: 2147483647;
        font-family: 'Cormorant Garamond', Georgia, serif;
        overflow-y: auto;
        overflow-x: hidden;
    }

    #tg-app * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       FONDO CINEMATOGRÁFICO
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-bg {
        position: fixed;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
    }

    .tg-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(140px);
        animation: tgOrbFloat 30s ease-in-out infinite;
    }

    .tg-orb-1 {
        width: 700px;
        height: 700px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
        top: -250px;
        left: -250px;
    }

    .tg-orb-2 {
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
        bottom: -150px;
        right: -150px;
        animation-delay: -10s;
    }

    @keyframes tgOrbFloat {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(40px, -50px) scale(1.1); }
        66% { transform: translate(-30px, 40px) scale(0.95); }
    }

    .tg-particles {
        position: absolute;
        inset: 0;
    }

    .tg-particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--tg-neon);
        border-radius: 50%;
        opacity: 0;
        animation: tgParticle 8s ease-in-out infinite;
    }

    @keyframes tgParticle {
        0%, 100% { opacity: 0; transform: translateY(0); }
        50% { opacity: 0.6; transform: translateY(-30px); }
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       CONTAINER Y LAYOUT
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-container {
        position: relative;
        z-index: 10;
        max-width: 1200px;
        margin: 0 auto;
        padding: 60px 24px;
    }

    .tg-screen {
        display: none;
        min-height: 100vh;
    }

    .tg-screen.active {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       TIPOGRAFÍA
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-title {
        font-family: 'Cinzel', serif;
        font-size: clamp(28px, 5vw, 42px);
        font-weight: 600;
        color: var(--tg-text);
        text-align: center;
        line-height: 1.3;
        margin-bottom: 16px;
    }

    .tg-subtitle {
        font-size: clamp(18px, 3vw, 22px);
        color: var(--tg-text-soft);
        text-align: center;
        line-height: 1.6;
        max-width: 50ch;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       BOTONES BURBUJA
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-bubble {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 16px 36px;
        background: rgba(10, 10, 14, 0.9);
        border: 2px solid var(--tg-neon);
        border-radius: 50px;
        color: var(--tg-text);
        font-family: 'Cinzel', serif;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 20px var(--tg-neon-glow), inset 0 0 20px rgba(59, 130, 246, 0.05);
        text-transform: uppercase;
    }

    .tg-bubble:hover {
        transform: translateY(-3px);
        box-shadow: 0 0 35px var(--tg-neon-glow), 0 8px 25px rgba(0,0,0,0.4), inset 0 0 25px rgba(59, 130, 246, 0.1);
    }

    .tg-bubble-small {
        padding: 12px 24px;
        font-size: 13px;
    }

    .tg-bubble-gold {
        border-color: var(--tg-gold);
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
    }

    .tg-bubble-gold:hover {
        box-shadow: 0 0 35px rgba(212, 175, 55, 0.4), 0 8px 25px rgba(0,0,0,0.4);
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       PANTALLAS DE FLUJO (música, intro, personal, preguntas, contacto)
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-music-container {
        text-align: center;
    }

    .tg-music-icon {
        font-size: 60px;
        margin-bottom: 30px;
        animation: tgPulse 2s ease-in-out infinite;
    }

    @keyframes tgPulse {
        0%, 100% { opacity: 0.7; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.05); }
    }

    .tg-music-activator {
        cursor: pointer;
        transition: transform 0.3s;
    }

    .tg-music-activator:hover {
        transform: scale(1.02);
    }

    .tg-skip-music {
        background: none;
        border: none;
        color: var(--tg-text-muted);
        font-size: 14px;
        margin-top: 30px;
        cursor: pointer;
        text-decoration: underline;
        transition: color 0.3s;
    }

    .tg-skip-music:hover {
        color: var(--tg-text-soft);
    }

    /* Progress bar */
    .tg-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--tg-neon), var(--tg-gold));
        z-index: 100;
        transition: width 0.5s ease;
        box-shadow: 0 0 10px var(--tg-neon-glow);
    }

    /* Formularios */
    .tg-form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        width: 100%;
        max-width: 600px;
        margin: 40px auto;
    }

    .tg-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .tg-field.full-width {
        grid-column: 1 / -1;
    }

    .tg-field label {
        font-size: 14px;
        color: var(--tg-text-soft);
        font-weight: 500;
    }

    .tg-field input, .tg-field select {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(59, 130, 246, 0.25);
        border-radius: 12px;
        padding: 14px 18px;
        color: var(--tg-text);
        font-family: inherit;
        font-size: 16px;
        transition: all 0.3s;
    }

    .tg-field input:focus, .tg-field select:focus {
        outline: none;
        border-color: var(--tg-neon);
        box-shadow: 0 0 15px var(--tg-neon-soft);
    }

    .tg-field input::placeholder {
        color: var(--tg-text-muted);
    }

    /* Preguntas */
    .tg-question-container {
        text-align: center;
        width: 100%;
        max-width: 700px;
    }

    .tg-question-text {
        font-size: clamp(22px, 4vw, 30px);
        color: var(--tg-text);
        line-height: 1.5;
        margin-bottom: 40px;
    }

    .tg-options {
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin-bottom: 30px;
    }

    .tg-option {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 16px;
        padding: 18px 24px;
        color: var(--tg-text);
        font-size: 17px;
        cursor: pointer;
        transition: all 0.3s;
        text-align: left;
    }

    .tg-option:hover {
        border-color: var(--tg-neon);
        background: rgba(59, 130, 246, 0.08);
        transform: translateX(5px);
    }

    .tg-option.selected {
        border-color: var(--tg-neon);
        background: rgba(59, 130, 246, 0.12);
        box-shadow: 0 0 20px var(--tg-neon-soft);
    }

    .tg-freetext {
        width: 100%;
        min-height: 120px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 16px;
        padding: 20px;
        color: var(--tg-text);
        font-family: inherit;
        font-size: 17px;
        line-height: 1.6;
        resize: none;
    }

    .tg-freetext:focus {
        outline: none;
        border-color: var(--tg-neon);
        box-shadow: 0 0 20px var(--tg-neon-soft);
    }

    /* Loading */
    .tg-loader-container {
        text-align: center;
    }

    .tg-loader-orb {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: radial-gradient(circle, var(--tg-neon) 0%, transparent 70%);
        margin: 0 auto 40px;
        animation: tgLoaderPulse 2s ease-in-out infinite;
    }

    @keyframes tgLoaderPulse {
        0%, 100% { transform: scale(0.9); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 1; }
    }

    .tg-loader-text {
        font-size: 20px;
        color: var(--tg-text-soft);
        font-style: italic;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       RESULTADO - DISEÑO CINEMATOGRÁFICO
       ═══════════════════════════════════════════════════════════════════════════ */
    #screen-result.active {
        display: block;
        padding-top: 40px;
    }

    .tg-result-container {
        max-width: 1140px;
        margin: 0 auto;
        padding: 0 20px;
    }

    /* FILA 1: Header cinematográfico */
    .tg-result-header {
        text-align: center;
        margin-bottom: 70px;
        padding: 40px 0;
    }

    .tg-result-header h1 {
        font-family: 'Cinzel', serif;
        font-size: clamp(32px, 6vw, 52px);
        font-weight: 600;
        color: var(--tg-text);
        margin-bottom: 16px;
        letter-spacing: 1px;
    }

    .tg-result-header h1 span {
        color: var(--tg-gold);
    }

    .tg-result-header p {
        font-size: 20px;
        color: var(--tg-text-muted);
        font-style: italic;
    }

    /* FILA 2: Grid 7/5 columnas */
    .tg-result-grid {
        display: grid;
        grid-template-columns: 7fr 5fr;
        gap: 50px;
        margin-bottom: 80px;
    }

    /* Columna izquierda */
    .tg-col-left {
        display: flex;
        flex-direction: column;
        gap: 50px;
    }

    /* Bloque revelación - glass con borde suave */
    .tg-revelation-block {
        background: var(--tg-bg-glass);
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 24px;
        padding: 40px;
        backdrop-filter: blur(10px);
    }

    .tg-revelation-title {
        font-family: 'Cinzel', serif;
        font-size: 14px;
        font-weight: 600;
        color: var(--tg-neon);
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 20px;
    }

    .tg-revelation-text {
        font-size: 20px;
        color: var(--tg-text);
        line-height: 1.7;
        max-width: 52ch;
    }

    .tg-mirror-lines {
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .tg-mirror-line {
        font-size: 17px;
        color: var(--tg-text-soft);
        font-style: italic;
        margin-bottom: 8px;
    }

    /* Bloque "Por qué" - SIN caja, lista editorial */
    .tg-why-block {
        padding: 0 10px;
    }

    .tg-why-title {
        font-family: 'Cinzel', serif;
        font-size: 18px;
        font-weight: 600;
        color: var(--tg-text);
        margin-bottom: 28px;
    }

    .tg-why-list {
        list-style: none;
    }

    .tg-why-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }

    .tg-why-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }

    .tg-why-icon {
        flex-shrink: 0;
        width: 8px;
        height: 8px;
        background: var(--tg-neon);
        border-radius: 50%;
        margin-top: 10px;
        box-shadow: 0 0 10px var(--tg-neon-glow);
    }

    .tg-why-text {
        font-size: 17px;
        color: var(--tg-text-soft);
        line-height: 1.6;
    }

    /* Columna derecha */
    .tg-col-right {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    /* Bloque guardián - EL protagonista con borde fuerte */
    .tg-guardian-block {
        background: var(--tg-bg-glass);
        border: 2px solid var(--tg-neon);
        border-radius: 28px;
        padding: 36px;
        text-align: center;
        box-shadow: 0 0 40px var(--tg-neon-soft), inset 0 0 60px rgba(59, 130, 246, 0.03);
    }

    .tg-guardian-label {
        font-size: 12px;
        color: var(--tg-gold);
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 20px;
    }

    .tg-guardian-photo {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--tg-neon);
        box-shadow: 0 0 30px var(--tg-neon-glow);
        margin-bottom: 20px;
    }

    .tg-guardian-name {
        font-family: 'Cinzel', serif;
        font-size: 24px;
        font-weight: 600;
        color: var(--tg-text);
        margin-bottom: 8px;
    }

    .tg-guardian-price {
        font-size: 18px;
        color: var(--tg-gold);
        margin-bottom: 24px;
    }

    .tg-guardian-cta {
        display: block;
        width: 100%;
        padding: 18px 24px;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
        border: 2px solid var(--tg-neon);
        border-radius: 50px;
        color: var(--tg-text);
        font-family: 'Cinzel', serif;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-decoration: none;
        transition: all 0.4s;
        box-shadow: 0 0 25px var(--tg-neon-glow);
    }

    .tg-guardian-cta:hover {
        transform: translateY(-3px);
        box-shadow: 0 0 40px var(--tg-neon-glow), 0 10px 30px rgba(0,0,0,0.3);
    }

    .tg-guardian-micro {
        font-size: 13px;
        color: var(--tg-text-muted);
        margin-top: 16px;
        font-style: italic;
    }

    /* Bloque ritual - minimal */
    .tg-ritual-block {
        padding: 24px;
        border-left: 2px solid rgba(212, 175, 55, 0.4);
    }

    .tg-ritual-label {
        font-size: 12px;
        color: var(--tg-gold-soft);
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 14px;
    }

    .tg-ritual-text {
        font-size: 17px;
        color: var(--tg-text-soft);
        line-height: 1.7;
        font-style: italic;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       FILA 3: También te recomendamos - CARRUSEL MODERNO
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-also-section {
        margin-bottom: 80px;
    }

    .tg-also-header {
        text-align: center;
        margin-bottom: 40px;
    }

    .tg-also-title {
        font-family: 'Cinzel', serif;
        font-size: 20px;
        font-weight: 500;
        color: var(--tg-text);
        position: relative;
        display: inline-block;
    }

    .tg-also-title::before,
    .tg-also-title::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 60px;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3));
    }

    .tg-also-title::before {
        right: calc(100% + 20px);
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3));
    }

    .tg-also-title::after {
        left: calc(100% + 20px);
        background: linear-gradient(-90deg, transparent, rgba(59, 130, 246, 0.3));
    }

    .tg-also-scroll {
        display: flex;
        gap: 24px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding: 20px 10px;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .tg-also-scroll::-webkit-scrollbar {
        display: none;
    }

    /* Cards livianas - SIN borde pesado */
    .tg-also-card {
        flex: 0 0 220px;
        scroll-snap-align: start;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 20px;
        padding: 20px;
        text-align: center;
        text-decoration: none;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid transparent;
    }

    .tg-also-card:hover {
        transform: translateY(-8px);
        background: rgba(59, 130, 246, 0.06);
        border-color: rgba(59, 130, 246, 0.3);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px var(--tg-neon-soft);
    }

    .tg-also-photo {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 16px;
        border: 2px solid transparent;
        transition: all 0.4s;
    }

    .tg-also-card:hover .tg-also-photo {
        border-color: var(--tg-neon);
        box-shadow: 0 0 20px var(--tg-neon-glow);
    }

    .tg-also-name {
        font-family: 'Cinzel', serif;
        font-size: 15px;
        font-weight: 500;
        color: var(--tg-text);
        margin-bottom: 8px;
        line-height: 1.3;
    }

    .tg-also-price {
        font-size: 14px;
        color: var(--tg-gold);
        margin-bottom: 14px;
    }

    .tg-also-btn {
        display: inline-block;
        padding: 8px 20px;
        background: transparent;
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 20px;
        color: var(--tg-text-soft);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.3s;
    }

    .tg-also-card:hover .tg-also-btn {
        border-color: var(--tg-neon);
        color: var(--tg-text);
        box-shadow: 0 0 15px var(--tg-neon-soft);
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       FILA 4: Altar final - Cierre elegante
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-altar {
        text-align: center;
        padding: 60px 20px;
        border-top: 1px solid rgba(212, 175, 55, 0.15);
    }

    .tg-sealed-phrase {
        font-family: 'Cinzel', serif;
        font-size: clamp(22px, 4vw, 30px);
        font-weight: 500;
        color: var(--tg-gold);
        line-height: 1.5;
        margin-bottom: 40px;
        text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
    }

    .tg-altar-actions {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       NEWSLETTER - Sección elegante
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-newsletter {
        margin: 60px 0;
        padding: 50px 30px;
        text-align: center;
        background: linear-gradient(180deg, rgba(59, 130, 246, 0.03) 0%, transparent 100%);
        border-radius: 24px;
    }

    .tg-newsletter-title {
        font-family: 'Cinzel', serif;
        font-size: 20px;
        color: var(--tg-text);
        margin-bottom: 12px;
    }

    .tg-newsletter-sub {
        font-size: 16px;
        color: var(--tg-text-muted);
        margin-bottom: 30px;
    }

    .tg-newsletter-form {
        display: flex;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;
        max-width: 500px;
        margin: 0 auto;
    }

    .tg-newsletter-input {
        flex: 1;
        min-width: 250px;
        padding: 14px 20px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(59, 130, 246, 0.25);
        border-radius: 50px;
        color: var(--tg-text);
        font-size: 16px;
        font-family: inherit;
    }

    .tg-newsletter-input:focus {
        outline: none;
        border-color: var(--tg-neon);
        box-shadow: 0 0 20px var(--tg-neon-soft);
    }

    .tg-newsletter-input::placeholder {
        color: var(--tg-text-muted);
    }

    .tg-newsletter-status {
        margin-top: 20px;
        font-size: 15px;
        min-height: 24px;
    }

    .tg-newsletter-status.loading {
        color: var(--tg-neon);
    }

    .tg-newsletter-status.success {
        color: var(--tg-gold);
    }

    .tg-newsletter-status.error {
        color: #ef4444;
    }

    /* Restart */
    .tg-restart-link {
        display: block;
        margin-top: 50px;
        color: var(--tg-text-muted);
        font-size: 14px;
        text-decoration: underline;
        cursor: pointer;
        transition: color 0.3s;
    }

    .tg-restart-link:hover {
        color: var(--tg-text-soft);
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       RESPONSIVE
       ═══════════════════════════════════════════════════════════════════════════ */
    @media (max-width: 900px) {
        .tg-result-grid {
            grid-template-columns: 1fr;
            gap: 40px;
        }

        .tg-col-right {
            order: -1;
        }

        .tg-result-header {
            margin-bottom: 50px;
        }
    }

    @media (max-width: 600px) {
        .tg-container {
            padding: 40px 16px;
        }

        .tg-form-grid {
            grid-template-columns: 1fr;
        }

        .tg-revelation-block {
            padding: 28px 22px;
        }

        .tg-guardian-block {
            padding: 28px 22px;
        }

        .tg-also-card {
            flex: 0 0 180px;
        }

        .tg-also-photo {
            width: 80px;
            height: 80px;
        }

        .tg-altar-actions {
            flex-direction: column;
            align-items: center;
        }

        .tg-newsletter-form {
            flex-direction: column;
        }

        .tg-newsletter-input {
            min-width: 100%;
        }
    }
    </style>

    <div id="tg-app">
        <div class="tg-bg">
            <div class="tg-orb tg-orb-1"></div>
            <div class="tg-orb tg-orb-2"></div>
            <div class="tg-particles">
                <div class="tg-particle" style="left:10%;top:20%;animation-delay:0s"></div>
                <div class="tg-particle" style="left:85%;top:15%;animation-delay:1s"></div>
                <div class="tg-particle" style="left:20%;top:80%;animation-delay:2s"></div>
                <div class="tg-particle" style="left:70%;top:70%;animation-delay:3s"></div>
                <div class="tg-particle" style="left:40%;top:40%;animation-delay:4s"></div>
            </div>
        </div>

        <div class="tg-progress" id="tg-progress"></div>

        <div class="tg-container">
            <!-- PANTALLA: Música -->
            <div class="tg-screen active" id="screen-music">
                <div class="tg-music-container">
                    <div class="tg-music-icon">🎧</div>
                    <h1 class="tg-title">Antes de comenzar...</h1>
                    <p class="tg-subtitle">Te recomendamos usar auriculares para una experiencia más profunda.</p>
                    <div class="tg-music-activator" onclick="TG.startWithMusic()" style="margin-top:40px;">
                        <button class="tg-bubble">Activar audio y comenzar</button>
                    </div>
                    <button class="tg-skip-music" onclick="TG.startWithoutMusic()">Continuar en silencio</button>
                </div>
            </div>

            <!-- PANTALLA: Intro -->
            <div class="tg-screen" id="screen-intro">
                <h1 class="tg-title">El portal se está abriendo...</h1>
                <p class="tg-subtitle" style="margin-bottom:50px;">Algo te estaba esperando. Y no llegaste por casualidad.</p>
                <button class="tg-bubble" onclick="TG.begin()">Comenzar</button>
            </div>

            <!-- PANTALLA: Datos personales -->
            <div class="tg-screen" id="screen-personal">
                <h1 class="tg-title">Primero, contanos de vos</h1>
                <p class="tg-subtitle">Para que tu guardián pueda encontrarte.</p>
                <div class="tg-form-grid">
                    <div class="tg-field full-width">
                        <label>Nombre *</label>
                        <input type="text" id="p-name" placeholder="Tu nombre o cómo querés que te llame...">
                    </div>
                    <div class="tg-field">
                        <label>Edad</label>
                        <input type="number" id="p-age" placeholder="Años" min="18" max="99">
                    </div>
                    <div class="tg-field">
                        <label>Género (opcional)</label>
                        <select id="p-sex">
                            <option value="">Prefiero no decir</option>
                            <option value="F">Femenino</option>
                            <option value="M">Masculino</option>
                            <option value="O">Otro</option>
                        </select>
                    </div>
                    <div class="tg-field">
                        <label>País *</label>
                        <select id="p-country">
                            <option value="">Seleccionar...</option>
                            <option value="AR">Argentina</option>
                            <option value="UY">Uruguay</option>
                            <option value="CL">Chile</option>
                            <option value="MX">México</option>
                            <option value="CO">Colombia</option>
                            <option value="PE">Perú</option>
                            <option value="ES">España</option>
                            <option value="US">Estados Unidos</option>
                            <option value="OT">Otro</option>
                        </select>
                    </div>
                    <div class="tg-field">
                        <label>Ciudad (opcional)</label>
                        <input type="text" id="p-city" placeholder="Tu ciudad...">
                    </div>
                    <div class="tg-field full-width">
                        <label>Fecha de nacimiento (opcional)</label>
                        <input type="date" id="p-birth">
                    </div>
                </div>
                <button class="tg-bubble" onclick="TG.submitPersonal()">Continuar</button>
            </div>

            <!-- PANTALLA: Preguntas -->
            <div class="tg-screen" id="screen-question">
                <div class="tg-question-container">
                    <p class="tg-question-text" id="q-text"></p>
                    <div class="tg-options" id="q-options"></div>
                    <textarea class="tg-freetext" id="q-freetext" placeholder="Escribí lo que sientas..." style="display:none;"></textarea>
                    <button class="tg-bubble" id="q-continue" style="display:none;" onclick="TG.submitFreetext()">Continuar</button>
                </div>
            </div>

            <!-- PANTALLA: Contacto -->
            <div class="tg-screen" id="screen-contact">
                <h1 class="tg-title">Un último paso...</h1>
                <p class="tg-subtitle">Para enviarte tu revelación y mantenerte en el círculo.</p>
                <div class="tg-form-grid">
                    <div class="tg-field full-width">
                        <label>Email *</label>
                        <input type="email" id="c-email" placeholder="tu@email.com">
                    </div>
                    <div class="tg-field">
                        <label>Prefijo</label>
                        <input type="text" id="c-prefix" value="+598" readonly style="max-width:100px;">
                    </div>
                    <div class="tg-field" style="flex:1;">
                        <label>WhatsApp (opcional)</label>
                        <input type="tel" id="c-whatsapp" placeholder="Tu número...">
                    </div>
                </div>
                <button class="tg-bubble" onclick="TG.submitContact()">Revelar mi guardián</button>
            </div>

            <!-- PANTALLA: Loading -->
            <div class="tg-screen" id="screen-loading">
                <div class="tg-loader-container">
                    <div class="tg-loader-orb"></div>
                    <p class="tg-loader-text" id="loader-text">Conectando con el portal...</p>
                </div>
            </div>

            <!-- PANTALLA: Resultado -->
            <div class="tg-screen" id="screen-result">
                <div class="tg-result-container" id="result-content"></div>
            </div>
        </div>
    </div>

    <script>
    var TG = {
        audio: null,
        currentQ: 0,
        personal: {},
        contact: {},
        answers: {},
        ajaxUrl: '<?php echo $ajax_url; ?>',
        vercelApi: 'https://duendes-vercel.vercel.app/api',
        visitorId: null,

        questions: [
            {
                id: 'q1_for_whom',
                text: '¿Para quién estás buscando hoy?',
                type: 'single',
                options: [
                    { id: 'mi', label: 'Para mí' },
                    { id: 'regalo', label: 'Es un regalo' },
                    { id: 'ambos', label: 'Todavía no sé bien' }
                ]
            },
            {
                id: 'q2_pain',
                text: '¿Qué es lo que más te pesa últimamente?',
                type: 'single',
                options: [
                    { id: 'agotamiento', label: 'Estoy agotada de ser la fuerte', pain: 'agotamiento' },
                    { id: 'proteccion', label: 'Siento que necesito protección', pain: 'proteccion' },
                    { id: 'soledad', label: 'Me siento sola aunque esté acompañada', pain: 'soledad' },
                    { id: 'patrones', label: 'Repito los mismos patrones', pain: 'patrones' },
                    { id: 'amor', label: 'Quiero amor pero me cuesta confiar', pain: 'amor' }
                ]
            },
            {
                id: 'q3_body',
                text: '¿Dónde lo sentís en el cuerpo?',
                type: 'single',
                options: [
                    { id: 'pecho', label: 'En el pecho, como opresión', body: 'pecho' },
                    { id: 'garganta', label: 'En la garganta, como un nudo', body: 'garganta' },
                    { id: 'cansancio', label: 'Un cansancio que no se va', body: 'cansancio' },
                    { id: 'cabeza', label: 'En la cabeza, ansiedad', body: 'cabeza' },
                    { id: 'intuicion', label: 'En la panza, mi intuición está cargada', body: 'intuicion' }
                ]
            },
            {
                id: 'q4_soul',
                text: '¿Qué te está pidiendo tu alma últimamente?',
                type: 'freetext',
                placeholder: 'No hay respuesta incorrecta. Escribí lo primero que te venga...'
            },
            {
                id: 'q5_universe',
                text: 'Si el universo pudiera decirte algo esta noche, ¿qué te gustaría escuchar?',
                type: 'freetext',
                placeholder: 'Escribí desde el corazón...'
            },
            {
                id: 'q6_magic_style',
                text: '¿Cómo te gustaría que fuera la magia que recibas?',
                type: 'single',
                options: [
                    { id: 'rapida', label: 'Directa y rápida', style: 'rapida' },
                    { id: 'profunda', label: 'Profunda y transformadora', style: 'profunda' },
                    { id: 'suave', label: 'Suave y amorosa', style: 'suave' },
                    { id: 'protectora', label: 'Firme y protectora', style: 'protectora' },
                    { id: 'senal', label: 'Como una señal para volver a mí', style: 'señal' }
                ]
            },
            {
                id: 'q7_ready',
                text: '¿Estás lista para conocer al guardián que te eligió?',
                type: 'single',
                options: [
                    { id: 'si', label: 'Sí, estoy lista' },
                    { id: 'nerviosa', label: 'Un poco nerviosa, pero sí' },
                    { id: 'curiosa', label: 'Tengo curiosidad' }
                ]
            }
        ],

        loaderPhrases: [
            'Conectando con el portal...',
            'Leyendo tu energía...',
            'Los guardianes están escuchando...',
            'Buscando el que resuena con vos...',
            'Preparando tu revelación...'
        ],

        phonePrefixes: {
            'AR': '+54', 'UY': '+598', 'CL': '+56', 'MX': '+52',
            'CO': '+57', 'PE': '+51', 'ES': '+34', 'US': '+1', 'OT': '+1'
        },

        init: function() {
            this.visitorId = this.getVisitorId();
            this.updateProgress(0);
            document.getElementById('p-country').addEventListener('change', this.updatePhonePrefix.bind(this));
        },

        getVisitorId: function() {
            var id = localStorage.getItem('duendes_visitor_id');
            if (!id) {
                id = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('duendes_visitor_id', id);
            }
            return id;
        },

        updateProgress: function(step) {
            var total = 11;
            var pct = Math.min((step / total) * 100, 100);
            document.getElementById('tg-progress').style.width = pct + '%';
        },

        show: function(screenId) {
            document.querySelectorAll('.tg-screen').forEach(function(s) {
                s.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
            window.scrollTo(0, 0);
        },

        startWithMusic: function() {
            this.audio = new Audio('https://duendes-vercel.vercel.app/audio/ambient-mystical.mp3');
            this.audio.loop = true;
            this.audio.volume = 0.3;
            this.audio.play().catch(function() {});
            this.show('screen-intro');
            this.updateProgress(1);
        },

        startWithoutMusic: function() {
            this.show('screen-intro');
            this.updateProgress(1);
        },

        begin: function() {
            this.show('screen-personal');
            this.updateProgress(2);
        },

        updatePhonePrefix: function() {
            var country = document.getElementById('p-country').value;
            var prefix = this.phonePrefixes[country] || '+1';
            document.getElementById('c-prefix').value = prefix;
        },

        submitPersonal: function() {
            var name = document.getElementById('p-name').value.trim();
            var country = document.getElementById('p-country').value;

            if (!name) {
                alert('Por favor, ingresá tu nombre');
                return;
            }
            if (!country) {
                alert('Por favor, seleccioná tu país');
                return;
            }

            this.personal = {
                name: name,
                age: document.getElementById('p-age').value,
                sex: document.getElementById('p-sex').value,
                country: country,
                city: document.getElementById('p-city').value,
                birth: document.getElementById('p-birth').value
            };

            this.updatePhonePrefix();
            this.currentQ = 0;
            this.showQuestion();
        },

        showQuestion: function() {
            var q = this.questions[this.currentQ];
            document.getElementById('q-text').textContent = q.text;

            var optContainer = document.getElementById('q-options');
            var freetext = document.getElementById('q-freetext');
            var continueBtn = document.getElementById('q-continue');

            optContainer.innerHTML = '';
            freetext.style.display = 'none';
            freetext.value = '';
            continueBtn.style.display = 'none';

            if (q.type === 'single') {
                var self = this;
                q.options.forEach(function(opt) {
                    var div = document.createElement('div');
                    div.className = 'tg-option';
                    div.textContent = opt.label;
                    div.onclick = function() {
                        self.selectOption(q.id, opt);
                    };
                    optContainer.appendChild(div);
                });
            } else if (q.type === 'freetext') {
                freetext.style.display = 'block';
                freetext.placeholder = q.placeholder || 'Escribí lo que sientas...';
                continueBtn.style.display = 'inline-flex';
            }

            this.show('screen-question');
            this.updateProgress(3 + this.currentQ);
        },

        selectOption: function(qId, opt) {
            this.answers[qId] = opt;

            document.querySelectorAll('.tg-option').forEach(function(el) {
                el.classList.remove('selected');
            });
            event.target.classList.add('selected');

            var self = this;
            setTimeout(function() {
                self.nextQuestion();
            }, 400);
        },

        submitFreetext: function() {
            var q = this.questions[this.currentQ];
            var text = document.getElementById('q-freetext').value.trim();

            if (!text) {
                alert('Por favor, escribí algo antes de continuar');
                return;
            }

            this.answers[q.id] = { text: text };
            this.nextQuestion();
        },

        nextQuestion: function() {
            this.currentQ++;
            if (this.currentQ < this.questions.length) {
                this.showQuestion();
            } else {
                this.showContactScreen();
            }
        },

        showContactScreen: function() {
            this.show('screen-contact');
            this.updateProgress(10);
        },

        submitContact: function() {
            var email = document.getElementById('c-email').value.trim();

            if (!email || !email.includes('@')) {
                alert('Por favor, ingresá un email válido');
                return;
            }

            this.contact = {
                email: email,
                whatsapp: document.getElementById('c-prefix').value + document.getElementById('c-whatsapp').value.trim()
            };

            this.processResults();
        },

        processResults: function() {
            this.show('screen-loading');

            var self = this;
            var phraseIndex = 0;
            var loaderText = document.getElementById('loader-text');

            var phraseInterval = setInterval(function() {
                phraseIndex = (phraseIndex + 1) % self.loaderPhrases.length;
                loaderText.textContent = self.loaderPhrases[phraseIndex];
            }, 2000);

            var testData = {
                personal: this.personal,
                contact: this.contact,
                answers: this.answers
            };

            localStorage.setItem('duendes_test_data', JSON.stringify(testData));

            Promise.all([
                fetch(this.vercelApi + '/guardian/interpret', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        identity: { name: this.personal.name, country: this.personal.country },
                        answers: this.answers
                    })
                }).then(function(r) { return r.json(); }),

                this.fetchProducts()
            ]).then(function(results) {
                clearInterval(phraseInterval);
                var interpretation = results[0];
                var products = results[1];
                self.saveProfile(testData, interpretation);
                self.renderResult(interpretation, products);
            }).catch(function(err) {
                clearInterval(phraseInterval);
                console.error('Error:', err);
                self.renderFallbackResult();
            });
        },

        fetchProducts: function() {
            var intent = this.answers.q2_pain?.pain || 'proteccion';
            var categoryMap = {
                'proteccion': 'proteccion',
                'amor': 'amor',
                'agotamiento': 'sanacion',
                'soledad': 'amor',
                'patrones': 'proteccion'
            };
            var cat = categoryMap[intent] || 'proteccion';

            var formData = new FormData();
            formData.append('action', 'duendes_get_productos');
            formData.append('categoria', cat);
            formData.append('limite', '5');

            return fetch(this.ajaxUrl, {
                method: 'POST',
                body: formData
            }).then(function(r) { return r.json(); });
        },

        renderResult: function(interpretation, products) {
            var name = this.personal.name || 'Viajera';
            var firstName = name.split(' ')[0];
            var mainProduct = products && products.length > 0 ? products[0] : null;
            var alsoProducts = products && products.length > 1 ? products.slice(1) : [];

            var html = '';

            // FILA 1: Header cinematográfico
            html += '<div class="tg-result-header">';
            html += '<h1><span>' + firstName + '</span>, tu guardián te encontró.</h1>';
            html += '<p>No llegaste por casualidad.</p>';
            html += '</div>';

            // FILA 2: Grid 7/5
            html += '<div class="tg-result-grid">';

            // Columna izquierda (7 col)
            html += '<div class="tg-col-left">';

            // Bloque revelación
            html += '<div class="tg-revelation-block">';
            html += '<div class="tg-revelation-title">Tu Revelación</div>';
            html += '<p class="tg-revelation-text">' + (interpretation.summary_emotional || 'Tu energía habla de alguien que busca. Y el hecho de estar acá dice mucho.') + '</p>';

            if (interpretation.mirror_lines && interpretation.mirror_lines.length > 0) {
                html += '<div class="tg-mirror-lines">';
                interpretation.mirror_lines.forEach(function(line) {
                    html += '<p class="tg-mirror-line">' + line + '</p>';
                });
                html += '</div>';
            }
            html += '</div>';

            // Bloque "Por qué" - lista editorial
            if (interpretation.why_reasons && interpretation.why_reasons.length > 0) {
                html += '<div class="tg-why-block">';
                html += '<h3 class="tg-why-title">Por qué estos guardianes son para vos</h3>';
                html += '<ul class="tg-why-list">';
                interpretation.why_reasons.forEach(function(reason) {
                    html += '<li class="tg-why-item">';
                    html += '<span class="tg-why-icon"></span>';
                    html += '<span class="tg-why-text">' + reason + '</span>';
                    html += '</li>';
                });
                html += '</ul>';
                html += '</div>';
            }

            html += '</div>'; // fin col izquierda

            // Columna derecha (5 col)
            html += '<div class="tg-col-right">';

            // Bloque guardián principal
            if (mainProduct) {
                html += '<div class="tg-guardian-block">';
                html += '<div class="tg-guardian-label">Tu guardián recomendado</div>';
                if (mainProduct.imagen) {
                    html += '<img class="tg-guardian-photo" src="' + mainProduct.imagen + '" alt="' + mainProduct.nombre + '" onerror="this.style.display=\'none\'">';
                }
                html += '<div class="tg-guardian-name">' + mainProduct.nombre + '</div>';
                html += '<div class="tg-guardian-price">' + mainProduct.precio + '</div>';
                html += '<a href="' + mainProduct.url + '" class="tg-guardian-cta">Sellar mi pacto</a>';
                html += '<p class="tg-guardian-micro">Pieza única. Si se adopta, no vuelve.</p>';
                html += '</div>';
            }

            // Bloque ritual
            if (interpretation.ritual_text) {
                html += '<div class="tg-ritual-block">';
                html += '<div class="tg-ritual-label">Tu ritual de conexión</div>';
                html += '<p class="tg-ritual-text">' + interpretation.ritual_text + '</p>';
                html += '</div>';
            }

            html += '</div>'; // fin col derecha
            html += '</div>'; // fin grid

            // FILA 3: También te recomendamos (carrusel)
            if (alsoProducts.length > 0) {
                html += '<div class="tg-also-section">';
                html += '<div class="tg-also-header">';
                html += '<h3 class="tg-also-title">También te recomendamos</h3>';
                html += '</div>';
                html += '<div class="tg-also-scroll">';
                alsoProducts.forEach(function(prod) {
                    html += '<a href="' + prod.url + '" class="tg-also-card">';
                    if (prod.imagen) {
                        html += '<img class="tg-also-photo" src="' + prod.imagen + '" alt="' + prod.nombre + '" onerror="this.parentElement.style.display=\'none\'">';
                    }
                    html += '<div class="tg-also-name">' + prod.nombre + '</div>';
                    html += '<div class="tg-also-price">' + prod.precio + '</div>';
                    html += '<span class="tg-also-btn">Ver</span>';
                    html += '</a>';
                });
                html += '</div>';
                html += '</div>';
            }

            // Newsletter
            html += '<div class="tg-newsletter">';
            html += '<h3 class="tg-newsletter-title">Recibí señales del universo</h3>';
            html += '<p class="tg-newsletter-sub">No son newsletters. Son mensajes cuando el universo tenga algo que decirte.</p>';
            html += '<div class="tg-newsletter-form">';
            html += '<input type="email" class="tg-newsletter-input" id="nl-email" placeholder="Tu email..." value="' + (this.contact.email || '') + '">';
            html += '<button class="tg-bubble tg-bubble-small" onclick="TG.submitNewsletter()">Recibir señales</button>';
            html += '</div>';
            html += '<div class="tg-newsletter-status" id="nl-status"></div>';
            html += '</div>';

            // FILA 4: Altar final
            html += '<div class="tg-altar">';
            if (interpretation.sealed_phrase) {
                html += '<p class="tg-sealed-phrase">"' + interpretation.sealed_phrase + '"</p>';
            }
            html += '<div class="tg-altar-actions">';
            html += '<button class="tg-bubble tg-bubble-small tg-bubble-gold" onclick="TG.downloadCard()">Descargar mi tarjeta</button>';
            html += '<button class="tg-bubble tg-bubble-small" onclick="TG.copyPhrase()">Copiar frase</button>';
            html += '</div>';
            html += '<span class="tg-restart-link" onclick="TG.restart()">Hacer el test de nuevo</span>';
            html += '</div>';

            document.getElementById('result-content').innerHTML = html;
            this.updateProgress(11);
            this.show('screen-result');
        },

        renderFallbackResult: function() {
            this.renderResult({
                summary_emotional: 'Tu energía habla de alguien que busca. Y el hecho de estar acá dice mucho.',
                mirror_lines: ['Leí tu señal.', 'Algo en vos sabe que es momento de cambiar.'],
                ritual_text: 'Esta noche, apoyá la mano en tu pecho y respirá profundo tres veces.',
                sealed_phrase: 'Lo que te eligió no se equivoca.',
                why_reasons: ['Porque tu energía lo llamó', 'Porque llegaste hasta acá', 'Porque estás lista']
            }, []);
        },

        saveProfile: function(testData, interpretation) {
            fetch(this.vercelApi + '/guardian/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitor_id: this.visitorId,
                    identity: {
                        name: testData.personal.name,
                        birth: testData.personal.birth,
                        country: testData.personal.country,
                        email: testData.contact.email
                    },
                    answers: testData.answers,
                    interpretation: interpretation,
                    timestamp: new Date().toISOString()
                })
            }).catch(function(e) { console.log('Profile save error:', e); });
        },

        submitNewsletter: function() {
            var email = document.getElementById('nl-email').value.trim();
            var status = document.getElementById('nl-status');

            if (!email || !email.includes('@')) {
                status.className = 'tg-newsletter-status error';
                status.textContent = 'Ingresá un email válido.';
                return;
            }

            status.className = 'tg-newsletter-status loading';
            status.textContent = 'Sellando señal...';

            var self = this;
            fetch(this.vercelApi + '/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    name: this.personal.name || '',
                    country: this.personal.country || '',
                    source: 'test_guardian'
                })
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) {
                    status.className = 'tg-newsletter-status success';
                    status.textContent = data.already_subscribed
                        ? 'Ya estás en el círculo. Las señales llegarán.'
                        : 'Señal recibida. Te va a llegar un mensaje.';
                    self.trackEvent('tg_newsletter_success');
                } else {
                    throw new Error(data.error);
                }
            })
            .catch(function(err) {
                status.className = 'tg-newsletter-status error';
                status.textContent = 'El portal falló. Probá de nuevo.';
                self.trackEvent('tg_newsletter_error');
            });

            this.trackEvent('tg_newsletter_submitted');
        },

        downloadCard: function() {
            var data = JSON.parse(localStorage.getItem('duendes_test_data') || '{}');
            var name = data.personal?.name || 'Visitante';
            alert('Tu tarjeta está siendo generada, ' + name + '. Te llegará al email.');
        },

        copyPhrase: function() {
            var phrase = document.querySelector('.tg-sealed-phrase');
            if (phrase && navigator.clipboard) {
                navigator.clipboard.writeText(phrase.textContent.replace(/"/g, ''));
                alert('Frase copiada. Guardala en un lugar especial.');
            }
        },

        trackEvent: function(event, data) {
            if (typeof gtag === 'function') {
                gtag('event', event, data || {});
            }
        },

        restart: function() {
            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0;
            }
            this.currentQ = 0;
            this.personal = {};
            this.contact = {};
            this.answers = {};
            this.show('screen-music');
            this.updateProgress(0);
        }
    };

    TG.init();
    </script>
    <?php
}

add_shortcode('duendes_test_guardian', function(){ return ''; });
