<?php
/**
 * Plugin Name: Duendes Test Guardian v3.5
 * Description: Test del Guardián - Embudo emocional con IA y memoria
 * Version: 3.5
 * Author: Duendes del Uruguay
 */

// Evitar acceso directo
if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════════════════
// TEST DEL GUARDIAN v3.5 - REWORK TOTAL
// Flujo reordenado + UI premium con grilla + Tarjeta digital
// ═══════════════════════════════════════════════════════════════════════════════════════

add_action('wp_footer', 'duendes_test_guardian_v3');

function duendes_test_guardian_v3() {
    if (strpos($_SERVER['REQUEST_URI'], 'descubri') === false) return;
    $ajax_url = admin_url('admin-ajax.php');
    ?>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">

    <style id="tg-v3-styles">
    /* ═══════════════════════════════════════════════════════════════════════════
       VARIABLES Y RESET
       ═══════════════════════════════════════════════════════════════════════════ */
    :root {
        --tg-bg: #05060A;
        --tg-text: #F5F7FF;
        --tg-text-soft: rgba(245, 247, 255, 0.7);
        --tg-text-muted: rgba(245, 247, 255, 0.5);
        --tg-neon: #3B82F6;
        --tg-neon-glow: rgba(59, 130, 246, 0.4);
        --tg-neon-soft: rgba(59, 130, 246, 0.15);
        --tg-gold: #D4AF37;
        --tg-gold-soft: rgba(212, 175, 55, 0.6);
        --tg-glass: rgba(255, 255, 255, 0.03);
        --tg-border: rgba(59, 130, 246, 0.4);
        --tg-card-padding: 32px;
        --tg-card-padding-mobile: 22px;
        --tg-border-width: 2px;
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
        filter: blur(120px);
        animation: tgOrbFloat 25s ease-in-out infinite;
    }

    .tg-orb-1 {
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
        top: -200px;
        left: -200px;
    }

    .tg-orb-2 {
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
        bottom: -150px;
        right: -150px;
        animation-delay: -8s;
    }

    @keyframes tgOrbFloat {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -40px) scale(1.1); }
        66% { transform: translate(-20px, 30px) scale(0.9); }
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
        animation: tgParticleRise 18s linear infinite;
    }

    @keyframes tgParticleRise {
        0% { opacity: 0; transform: translateY(100vh) scale(0); }
        10% { opacity: 0.6; }
        90% { opacity: 0.3; }
        100% { opacity: 0; transform: translateY(-10vh) scale(1); }
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       CONTENIDO PRINCIPAL
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-content {
        position: relative;
        z-index: 10;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
    }

    .tg-screen {
        display: none;
        width: 100%;
        max-width: 650px;
        text-align: center;
    }

    .tg-screen.active {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .tg-screen.wide {
        max-width: 1150px;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       TIPOGRAFÍA
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-title {
        font-family: 'Cinzel', serif !important;
        color: var(--tg-gold) !important;
        font-size: clamp(1.6rem, 4.5vw, 2.3rem) !important;
        font-weight: 600 !important;
        letter-spacing: 2px !important;
        text-transform: uppercase !important;
        margin-bottom: 15px !important;
        text-shadow: 0 0 40px var(--tg-gold-soft) !important;
        background: none !important;
        line-height: 1.3 !important;
    }

    .tg-subtitle {
        color: var(--tg-text-soft) !important;
        font-size: 1.15rem !important;
        font-style: italic;
        margin-bottom: 35px;
        line-height: 1.6;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       INDICADOR DE PROGRESO
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-progress {
        position: fixed;
        top: 25px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        z-index: 100;
    }

    .tg-rune {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid var(--tg-border);
        transition: all 0.5s ease;
    }

    .tg-rune.active {
        background: var(--tg-neon);
        box-shadow: 0 0 15px var(--tg-neon-glow);
    }

    .tg-rune.completed {
        background: var(--tg-gold);
        border-color: var(--tg-gold);
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       FORMULARIO DATOS PERSONALES (PANTALLA 1)
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-personal-form {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
    }

    .tg-form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .tg-form-grid .full-width {
        grid-column: 1 / -1;
    }

    .tg-field {
        text-align: left;
        margin-bottom: 0;
    }

    .tg-field label {
        display: block;
        color: var(--tg-text);
        font-family: 'Cinzel', serif;
        font-size: 0.75rem;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 8px;
    }

    .tg-field .optional-tag {
        color: var(--tg-text-muted);
        font-family: 'Cormorant Garamond', serif;
        font-size: 0.7rem;
        font-style: italic;
        text-transform: none;
        letter-spacing: 0;
        margin-left: 6px;
    }

    .tg-field input,
    .tg-field select {
        width: 100%;
        background: var(--tg-glass);
        border: var(--tg-border-width) solid var(--tg-border);
        border-radius: 12px;
        color: var(--tg-text);
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.05rem;
        padding: 14px 18px;
        outline: none;
        transition: all 0.3s ease;
    }

    .tg-field input:focus,
    .tg-field select:focus {
        border-color: var(--tg-neon);
        box-shadow: 0 0 20px var(--tg-neon-glow);
    }

    .tg-field input::placeholder {
        color: rgba(245, 247, 255, 0.3);
    }

    .tg-field select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233B82F6' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 15px center;
        padding-right: 40px;
    }

    .tg-field select option {
        background: #0a0a0f;
        color: var(--tg-text);
    }

    .tg-form-disclaimer {
        color: var(--tg-text-soft);
        font-size: 0.9rem;
        font-style: italic;
        margin-top: 30px;
        padding: 18px;
        background: var(--tg-glass);
        border-radius: 12px;
        border: 1px solid var(--tg-neon-soft);
        line-height: 1.6;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       PREGUNTAS
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-question {
        text-align: center;
        margin-bottom: 45px;
    }

    .tg-question-num {
        color: var(--tg-neon);
        font-family: 'Cinzel', serif;
        font-size: 0.75rem;
        letter-spacing: 4px;
        margin-bottom: 20px;
        opacity: 0.7;
    }

    .tg-question-text {
        color: var(--tg-text);
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(1.3rem, 4vw, 1.8rem);
        font-style: italic;
        font-weight: 500;
        line-height: 1.5;
        max-width: 580px;
        margin: 0 auto;
    }

    .tg-letter {
        display: inline-block;
        opacity: 0;
        animation: tgLetterIn 0.3s ease forwards;
    }

    @keyframes tgLetterIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       MYSTIC BUBBLE BUTTONS
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-options {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        width: 100%;
        max-width: 480px;
        margin: 0 auto;
    }

    #tg-app .tg-bubble,
    #tg-app button.tg-bubble {
        background: #000000 !important;
        color: var(--tg-text) !important;
        border: var(--tg-border-width) solid var(--tg-neon) !important;
        border-radius: 50px !important;
        padding: 16px 32px !important;
        font-family: 'Cormorant Garamond', serif !important;
        font-size: 1.05rem !important;
        font-weight: 500 !important;
        letter-spacing: 0.3px !important;
        cursor: pointer !important;
        width: 100% !important;
        max-width: 420px !important;
        text-align: center !important;
        opacity: 0;
        transform: translateY(18px);
        transition: all 0.25s ease !important;
        box-shadow:
            0 0 15px var(--tg-neon-glow),
            0 0 30px rgba(59, 130, 246, 0.15),
            inset 0 0 20px rgba(59, 130, 246, 0.05) !important;
        outline: none !important;
    }

    #tg-app .tg-bubble.visible {
        animation: tgBubbleAppear 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes tgBubbleAppear {
        0% { opacity: 0; transform: translateY(18px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    #tg-app .tg-bubble:hover {
        background: rgba(59, 130, 246, 0.1) !important;
        transform: scale(1.02) !important;
        box-shadow:
            0 0 25px var(--tg-neon-glow),
            0 0 50px rgba(59, 130, 246, 0.2) !important;
    }

    #tg-app .tg-bubble:active {
        transform: scale(0.98) !important;
    }

    #tg-app .tg-bubble.selected {
        background: var(--tg-neon) !important;
        color: #000 !important;
        animation: tgBubblePop 0.4s ease forwards;
    }

    @keyframes tgBubblePop {
        0% { transform: scale(1); }
        30% { transform: scale(1.08); }
        100% { transform: scale(0); opacity: 0; }
    }

    /* Botón de acción principal */
    #tg-app .tg-btn-primary {
        background: linear-gradient(135deg, var(--tg-neon), #2563EB) !important;
        color: #fff !important;
        border: none !important;
        padding: 18px 50px !important;
        border-radius: 50px !important;
        font-family: 'Cinzel', serif !important;
        font-size: 0.9rem !important;
        font-weight: 600 !important;
        letter-spacing: 2px !important;
        text-transform: uppercase !important;
        cursor: pointer !important;
        margin-top: 30px !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 0 30px var(--tg-neon-glow) !important;
        outline: none !important;
    }

    #tg-app .tg-btn-primary:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 0 50px var(--tg-neon-glow) !important;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       TEXTO LIBRE
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-freetext {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
    }

    .tg-freetext textarea {
        width: 100%;
        min-height: 120px;
        background: var(--tg-glass);
        border: var(--tg-border-width) solid var(--tg-border);
        border-radius: 16px;
        color: var(--tg-text);
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.15rem;
        font-style: italic;
        padding: 20px;
        resize: none;
        outline: none;
        transition: all 0.3s ease;
        line-height: 1.6;
    }

    .tg-freetext textarea:focus {
        border-color: var(--tg-neon);
        box-shadow: 0 0 20px var(--tg-neon-glow);
    }

    .tg-freetext textarea::placeholder {
        color: rgba(245, 247, 255, 0.35);
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       PANTALLA CONTACTO (WhatsApp + Email)
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-contact-form {
        width: 100%;
        max-width: 450px;
        margin: 0 auto;
    }

    .tg-whatsapp-field {
        display: flex;
        gap: 10px;
    }

    .tg-whatsapp-field .prefix {
        width: 90px;
        flex-shrink: 0;
    }

    .tg-whatsapp-field .number {
        flex: 1;
    }

    .tg-checkbox-field {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        text-align: left;
        margin-top: 25px;
        padding: 15px;
        background: var(--tg-glass);
        border-radius: 12px;
        cursor: pointer;
    }

    .tg-checkbox-field input[type="checkbox"] {
        width: 20px;
        height: 20px;
        margin-top: 2px;
        accent-color: var(--tg-neon);
        cursor: pointer;
    }

    .tg-checkbox-field label {
        color: var(--tg-text-soft);
        font-size: 0.95rem;
        line-height: 1.5;
        cursor: pointer;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       LOADER
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-loader {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 25px;
    }

    .tg-loader-spinner {
        width: 60px;
        height: 60px;
        border: 2px solid var(--tg-border);
        border-top-color: var(--tg-neon);
        border-radius: 50%;
        animation: tgSpin 1s linear infinite;
    }

    @keyframes tgSpin {
        to { transform: rotate(360deg); }
    }

    .tg-loader-text {
        color: var(--tg-text);
        font-size: 1.2rem;
        font-style: italic;
        animation: tgPulse 2s ease-in-out infinite;
    }

    @keyframes tgPulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       PANTALLA FINAL - LAYOUT PREMIUM CON GRILLA
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-result-container {
        width: 100%;
        max-width: 1150px;
        margin: 0 auto;
        padding: 20px;
    }

    /* Header */
    .tg-result-header {
        text-align: center;
        margin-bottom: 50px;
    }

    .tg-result-title {
        font-family: 'Cinzel', serif;
        color: var(--tg-gold);
        font-size: clamp(1.8rem, 5vw, 2.5rem);
        font-weight: 600;
        margin-bottom: 12px;
        text-shadow: 0 0 40px var(--tg-gold-soft);
        line-height: 1.3;
    }

    .tg-result-subtitle {
        color: var(--tg-text-soft);
        font-size: 1.15rem;
        font-style: italic;
    }

    /* Grilla principal */
    .tg-result-grid {
        display: grid;
        grid-template-columns: 55% 45%;
        gap: 36px;
        margin-bottom: 50px;
    }

    /* Cards base */
    .tg-card {
        background: var(--tg-glass);
        border: var(--tg-border-width) solid var(--tg-border);
        border-radius: 20px;
        padding: var(--tg-card-padding);
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.08);
    }

    .tg-card-title {
        font-family: 'Cinzel', serif;
        color: var(--tg-text);
        font-size: 0.85rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 20px;
        opacity: 0.8;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .tg-card-title::before {
        content: '✦';
        color: var(--tg-neon);
        font-size: 0.9rem;
    }

    /* Columna izquierda */
    .tg-result-left {
        display: flex;
        flex-direction: column;
        gap: 28px;
    }

    /* Revelación */
    .tg-revelation p {
        color: var(--tg-text);
        font-size: 1.1rem;
        line-height: 1.8;
        margin-bottom: 18px;
    }

    .tg-revelation p:last-child {
        margin-bottom: 0;
    }

    .tg-revelation .highlight {
        color: var(--tg-neon);
        font-weight: 500;
    }

    /* Por qué estos guardianes */
    .tg-why-list {
        list-style: none;
        padding: 0;
    }

    .tg-why-list li {
        color: var(--tg-text-soft);
        font-size: 1.05rem;
        line-height: 1.6;
        padding: 14px 0 14px 35px;
        position: relative;
        border-bottom: 1px solid rgba(59, 130, 246, 0.1);
    }

    .tg-why-list li:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    .tg-why-list li::before {
        content: '◇';
        position: absolute;
        left: 0;
        top: 14px;
        color: var(--tg-neon);
        font-size: 1rem;
    }

    /* Columna derecha */
    .tg-result-right {
        display: flex;
        flex-direction: column;
        gap: 28px;
    }

    /* Guardian principal */
    .tg-guardian-main {
        text-align: center;
        padding: var(--tg-card-padding);
        background: linear-gradient(180deg, var(--tg-glass) 0%, rgba(59, 130, 246, 0.05) 100%);
        border: var(--tg-border-width) solid var(--tg-border);
        border-radius: 24px;
    }

    .tg-guardian-img {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--tg-neon);
        box-shadow:
            0 0 40px var(--tg-neon-glow),
            0 0 80px rgba(59, 130, 246, 0.2);
        margin-bottom: 22px;
        transition: all 0.3s ease;
    }

    .tg-guardian-main:hover .tg-guardian-img {
        box-shadow:
            0 0 50px var(--tg-neon-glow),
            0 0 100px rgba(59, 130, 246, 0.3);
    }

    .tg-guardian-name {
        font-family: 'Cinzel', serif;
        color: var(--tg-text);
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .tg-guardian-price {
        color: var(--tg-gold);
        font-family: 'Cinzel', serif;
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 12px;
    }

    .tg-guardian-scarcity {
        color: var(--tg-text-muted);
        font-size: 0.9rem;
        font-style: italic;
        margin-bottom: 22px;
        line-height: 1.5;
    }

    .tg-cta-primary {
        display: inline-block;
        background: linear-gradient(135deg, var(--tg-neon), #2563EB) !important;
        color: #fff !important;
        border: none !important;
        padding: 16px 32px !important;
        border-radius: 50px !important;
        font-family: 'Cinzel', serif !important;
        font-size: 0.85rem !important;
        font-weight: 600 !important;
        letter-spacing: 1px !important;
        text-transform: uppercase !important;
        text-decoration: none !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 0 30px var(--tg-neon-glow) !important;
        cursor: pointer !important;
    }

    .tg-cta-primary:hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 0 50px var(--tg-neon-glow) !important;
    }

    .tg-cta-secondary {
        display: block;
        color: var(--tg-text-muted) !important;
        font-size: 0.85rem !important;
        text-decoration: underline !important;
        margin-top: 15px !important;
        transition: color 0.2s !important;
    }

    .tg-cta-secondary:hover {
        color: var(--tg-text) !important;
    }

    /* Ritual */
    .tg-ritual {
        border-color: var(--tg-neon);
    }

    .tg-ritual-text {
        color: var(--tg-text);
        font-size: 1.1rem;
        line-height: 1.8;
        font-style: italic;
    }

    /* Separador */
    .tg-separator {
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--tg-neon), transparent);
        box-shadow: 0 0 20px var(--tg-neon-glow);
        margin: 20px 0 50px;
        opacity: 0.5;
    }

    /* También te recomendamos */
    .tg-also-section {
        margin-bottom: 50px;
    }

    .tg-also-title {
        font-family: 'Cinzel', serif;
        color: var(--tg-text);
        font-size: 1rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        text-align: center;
        margin-bottom: 35px;
        opacity: 0.7;
    }

    .tg-also-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
    }

    .tg-also-item {
        text-align: center;
        text-decoration: none;
        padding: 20px;
        background: var(--tg-glass);
        border: var(--tg-border-width) solid rgba(59, 130, 246, 0.2);
        border-radius: 16px;
        transition: all 0.3s ease;
    }

    .tg-also-item:hover {
        border-color: var(--tg-neon);
        box-shadow: 0 0 30px var(--tg-neon-glow);
        transform: translateY(-5px);
    }

    .tg-also-img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--tg-border);
        margin-bottom: 15px;
        transition: all 0.3s ease;
    }

    .tg-also-item:hover .tg-also-img {
        border-color: var(--tg-neon);
    }

    .tg-also-name {
        font-family: 'Cinzel', serif;
        color: var(--tg-text);
        font-size: 0.95rem;
        font-weight: 500;
        margin-bottom: 8px;
    }

    .tg-also-price {
        color: var(--tg-gold-soft);
        font-size: 0.9rem;
        margin-bottom: 12px;
    }

    .tg-also-cta {
        display: inline-block;
        color: var(--tg-neon) !important;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-family: 'Cinzel', serif;
    }

    /* Frase sellada */
    .tg-sealed {
        text-align: center;
        padding: 35px;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), transparent);
        border: var(--tg-border-width) solid var(--tg-border);
        border-radius: 20px;
        margin-bottom: 40px;
    }

    .tg-sealed-phrase {
        font-family: 'Cinzel', serif;
        color: var(--tg-gold);
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 1.5;
        margin-bottom: 25px;
    }

    .tg-sealed-actions {
        display: flex;
        justify-content: center;
        gap: 15px;
        flex-wrap: wrap;
    }

    .tg-btn-outline {
        background: transparent !important;
        border: var(--tg-border-width) solid var(--tg-gold-soft) !important;
        color: var(--tg-gold) !important;
        padding: 12px 28px !important;
        border-radius: 50px !important;
        font-family: 'Cinzel', serif !important;
        font-size: 0.75rem !important;
        letter-spacing: 1px !important;
        text-transform: uppercase !important;
        cursor: pointer !important;
        transition: all 0.3s !important;
    }

    .tg-btn-outline:hover {
        background: rgba(212, 175, 55, 0.1) !important;
        box-shadow: 0 0 25px var(--tg-gold-soft) !important;
    }

    /* Restart */
    .tg-restart {
        display: block;
        text-align: center;
        color: var(--tg-text-muted);
        font-size: 0.9rem;
        background: none;
        border: none;
        cursor: pointer;
        text-decoration: underline;
        margin: 30px auto 0;
        transition: color 0.2s;
    }

    .tg-restart:hover {
        color: var(--tg-text);
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       RESPONSIVE
       ═══════════════════════════════════════════════════════════════════════════ */
    @media (max-width: 900px) {
        .tg-result-grid {
            grid-template-columns: 1fr;
            gap: 28px;
        }

        .tg-result-left,
        .tg-result-right {
            order: unset;
        }

        .tg-result-right {
            order: -1;
        }

        .tg-also-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 600px) {
        :root {
            --tg-card-padding: var(--tg-card-padding-mobile);
        }

        .tg-form-grid {
            grid-template-columns: 1fr;
        }

        .tg-result-title {
            font-size: 1.5rem;
        }

        .tg-guardian-img {
            width: 160px;
            height: 160px;
        }

        .tg-also-grid {
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .tg-also-img {
            width: 80px;
            height: 80px;
        }

        .tg-whatsapp-field {
            flex-direction: column;
        }

        .tg-whatsapp-field .prefix {
            width: 100%;
        }
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       PANTALLA MÚSICA
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-music-activator {
        width: 150px;
        height: 150px;
        margin: 40px auto;
        position: relative;
        cursor: pointer;
    }

    .tg-music-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .tg-music-icon svg {
        width: 50px;
        height: 50px;
        stroke: var(--tg-neon);
        fill: none;
        stroke-width: 1.5;
        filter: drop-shadow(0 0 15px var(--tg-neon-glow));
    }

    .tg-music-ring {
        position: absolute;
        border: 1px solid var(--tg-border);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: tgRingExpand 3s ease-out infinite;
    }

    .tg-music-ring:nth-child(1) { width: 80px; height: 80px; }
    .tg-music-ring:nth-child(2) { width: 110px; height: 110px; animation-delay: 1s; }
    .tg-music-ring:nth-child(3) { width: 140px; height: 140px; animation-delay: 2s; }

    @keyframes tgRingExpand {
        0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.8); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.3); }
    }

    .tg-skip-music {
        background: transparent !important;
        border: 1px solid var(--tg-border) !important;
        color: var(--tg-text-soft) !important;
        padding: 12px 30px !important;
        border-radius: 50px !important;
        font-family: 'Cinzel', serif !important;
        font-size: 0.8rem !important;
        letter-spacing: 1px !important;
        cursor: pointer !important;
        margin-top: 40px !important;
        transition: all 0.3s !important;
    }

    .tg-skip-music:hover {
        border-color: var(--tg-neon) !important;
        color: var(--tg-text) !important;
    }
    </style>

    <!-- HTML STRUCTURE -->
    <div id="tg-app">
        <div class="tg-bg">
            <div class="tg-orb tg-orb-1"></div>
            <div class="tg-orb tg-orb-2"></div>
            <div class="tg-particles" id="tg-particles"></div>
        </div>

        <div class="tg-content">
            <div class="tg-progress" id="tg-progress"></div>

            <!-- Screen: Music -->
            <div class="tg-screen active" id="screen-music">
                <p class="tg-subtitle">Experiencia inmersiva</p>
                <div class="tg-music-activator" onclick="TG.startWithMusic()">
                    <div class="tg-music-ring"></div>
                    <div class="tg-music-ring"></div>
                    <div class="tg-music-ring"></div>
                    <div class="tg-music-icon">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16"/></svg>
                    </div>
                </div>
                <p style="color: var(--tg-text-soft); font-size: 0.9rem;">Tocá para activar el sonido</p>
                <button class="tg-skip-music" onclick="TG.startWithoutMusic()">Continuar en silencio</button>
            </div>

            <!-- Screen: Intro -->
            <div class="tg-screen" id="screen-intro">
                <h1 class="tg-title">El Test del Guardián</h1>
                <p class="tg-subtitle">El guardián te elige a vos.<br>Descubrí cuál está esperándote.</p>
                <button class="tg-bubble visible" onclick="TG.goToPersonal()" style="opacity:1;transform:none;">Comenzar</button>
            </div>

            <!-- Screen: Personal Data (PANTALLA 1 - PRIMERO) -->
            <div class="tg-screen" id="screen-personal">
                <h2 class="tg-title" style="font-size:1.5rem !important;">Primero, contanos de vos</h2>
                <p class="tg-subtitle">Esto no es un formulario. Es la llave del portal.</p>

                <div class="tg-personal-form">
                    <div class="tg-form-grid">
                        <div class="tg-field full-width">
                            <label>Nombre</label>
                            <input type="text" id="p-name" placeholder="Tu nombre completo...">
                        </div>
                        <div class="tg-field">
                            <label>Edad</label>
                            <input type="number" id="p-age" placeholder="Ej: 35" min="18" max="99">
                        </div>
                        <div class="tg-field">
                            <label>Sexo <span class="optional-tag">(opcional)</span></label>
                            <select id="p-sex">
                                <option value="">Seleccionar...</option>
                                <option value="F">Mujer</option>
                                <option value="M">Hombre</option>
                                <option value="O">Otro</option>
                                <option value="N">Prefiero no decir</option>
                            </select>
                        </div>
                        <div class="tg-field">
                            <label>Nacionalidad</label>
                            <select id="p-nationality">
                                <option value="">Seleccionar...</option>
                                <option value="AR">Argentina</option>
                                <option value="UY">Uruguay</option>
                                <option value="CL">Chile</option>
                                <option value="MX">México</option>
                                <option value="CO">Colombia</option>
                                <option value="PE">Perú</option>
                                <option value="ES">España</option>
                                <option value="US">Estados Unidos</option>
                                <option value="OT">Otra</option>
                            </select>
                        </div>
                        <div class="tg-field">
                            <label>País de residencia</label>
                            <select id="p-country" onchange="TG.updatePhonePrefix()">
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
                            <label>Ciudad <span class="optional-tag">(opcional)</span></label>
                            <input type="text" id="p-city" placeholder="Tu ciudad...">
                        </div>
                        <div class="tg-field full-width">
                            <label>Fecha de nacimiento</label>
                            <input type="date" id="p-birth">
                        </div>
                    </div>

                    <button class="tg-btn-primary" onclick="TG.submitPersonal()">Siguiente</button>
                </div>
            </div>

            <!-- Screen: Questions -->
            <div class="tg-screen" id="screen-questions">
                <div class="tg-question">
                    <div class="tg-question-num" id="q-num"></div>
                    <div class="tg-question-text" id="q-text"></div>
                </div>
                <div class="tg-options" id="q-options"></div>
                <div class="tg-freetext" id="q-freetext" style="display:none;">
                    <textarea id="q-textarea" placeholder=""></textarea>
                    <button class="tg-btn-primary" onclick="TG.submitFreetext()" style="margin-top:25px;">Continuar</button>
                </div>
            </div>

            <!-- Screen: Contact (WhatsApp + Email) -->
            <div class="tg-screen" id="screen-contact">
                <h2 class="tg-title" style="font-size:1.4rem !important;">Último paso</h2>
                <p class="tg-subtitle">¿Dónde te enviamos tu tarjeta?</p>

                <div class="tg-contact-form">
                    <div class="tg-field" style="margin-bottom:20px;">
                        <label>Email</label>
                        <input type="email" id="c-email" placeholder="tu@email.com">
                    </div>

                    <div class="tg-field">
                        <label>WhatsApp <span class="optional-tag">(opcional)</span></label>
                        <div class="tg-whatsapp-field">
                            <input type="text" id="c-prefix" class="prefix" placeholder="+54" value="+54">
                            <input type="tel" id="c-phone" class="number" placeholder="9 11 1234-5678">
                        </div>
                    </div>

                    <div class="tg-checkbox-field" onclick="document.getElementById('c-newsletter').click()">
                        <input type="checkbox" id="c-newsletter">
                        <label for="c-newsletter">También quiero recibir señales (newsletter con rituales y novedades)</label>
                    </div>

                    <p class="tg-form-disclaimer">
                        Te va a llegar al email tu tarjeta del guardián + tu frase sellada.
                    </p>

                    <button class="tg-btn-primary" onclick="TG.submitContact()">Revelar mi Guardián</button>
                </div>
            </div>

            <!-- Screen: Loading -->
            <div class="tg-screen" id="screen-loading">
                <div class="tg-loader">
                    <div class="tg-loader-spinner"></div>
                    <p class="tg-loader-text" id="loader-text">Leyendo tu señal...</p>
                    <p style="color: var(--tg-neon); font-size: 0.95rem;">Tu guardián está siendo revelado</p>
                </div>
            </div>

            <!-- Screen: Result -->
            <div class="tg-screen wide" id="screen-result">
                <div class="tg-result-container" id="result-content">
                    <!-- Populated by JS -->
                </div>
            </div>
        </div>
    </div>

    <audio id="tg-audio" loop src="https://duendesuy.10web.cloud/wp-content/uploads/2026/01/ES_Words-of-an-Angel-Kikoru.mp3"></audio>

    <script>
    var TG = {
        ajaxUrl: '<?php echo $ajax_url; ?>',
        vercelApi: 'https://duendes-vercel.vercel.app/api',
        audio: null,
        currentQ: 0,
        personal: {},
        contact: {},
        answers: {},
        visitorId: null,
        totalSteps: 10, // 1 personal + 7 questions + 1 contact + 1 result

        phonePrefixes: {
            'AR': '+54', 'UY': '+598', 'CL': '+56', 'MX': '+52',
            'CO': '+57', 'PE': '+51', 'ES': '+34', 'US': '+1', 'OT': '+1'
        },

        questions: [
            {
                id: 'q1_for_whom',
                type: 'options',
                text: '¿Este guardián es para vos o para alguien especial?',
                options: [
                    {id: 'self', text: 'Es para mí'},
                    {id: 'gift', text: 'Es un regalo'}
                ]
            },
            {
                id: 'q2_pain',
                type: 'options',
                text: '¿Qué sentís que más estás sosteniendo sola últimamente?',
                options: [
                    {id: 'exhausted', text: 'Estoy agotada de ser la fuerte', pain: 'agotamiento'},
                    {id: 'protection', text: 'Necesito protección (me estoy cargando de todo)', pain: 'proteccion'},
                    {id: 'lonely', text: 'Me siento sola aunque esté con gente', pain: 'soledad'},
                    {id: 'patterns', text: 'Repito patrones y no sé cómo cortarlos', pain: 'patrones'},
                    {id: 'love', text: 'Quiero amor, pero me cuesta confiar', pain: 'amor'}
                ]
            },
            {
                id: 'q3_body',
                type: 'options',
                text: '¿Dónde lo sentís primero en el cuerpo?',
                options: [
                    {id: 'chest', text: 'Pecho apretado', body: 'pecho'},
                    {id: 'throat', text: 'Nudo en la garganta', body: 'garganta'},
                    {id: 'fatigue', text: 'Cansancio que no se va', body: 'cansancio'},
                    {id: 'anxiety', text: 'Ansiedad en la cabeza', body: 'cabeza'},
                    {id: 'gut', text: 'Panza/intuición cargada', body: 'intuicion'}
                ]
            },
            {
                id: 'q4_soul',
                type: 'freetext',
                text: '¿Qué te está pidiendo tu alma hace rato?',
                placeholder: 'Mi alma me pide…'
            },
            {
                id: 'q5_universe',
                type: 'freetext',
                text: 'Si el universo hoy te diera una sola respuesta… ¿qué te gustaría escuchar?',
                placeholder: 'Me gustaría que me diga…'
            },
            {
                id: 'q6_magic_style',
                type: 'options',
                text: '¿Cómo te gusta recibir la magia?',
                options: [
                    {id: 'fast', text: 'Directa y rápida (necesito alivio ya)', style: 'rapida'},
                    {id: 'deep', text: 'Profunda y transformadora', style: 'profunda'},
                    {id: 'soft', text: 'Suave y amorosa', style: 'suave'},
                    {id: 'firm', text: 'Firme y protectora', style: 'protectora'},
                    {id: 'signal', text: 'Como señal para volver a mí', style: 'señal'}
                ]
            }
        ],

        loaderPhrases: [
            'Leyendo tu señal...',
            'Conectando con los portales...',
            'Tu energía está siendo escuchada...',
            'Buscando a quien te espera...'
        ],

        init: function() {
            this.createParticles();
            this.createProgress();
            this.loadVisitorId();
        },

        createParticles: function() {
            var container = document.getElementById('tg-particles');
            if (!container) return;
            for (var i = 0; i < 15; i++) {
                var p = document.createElement('div');
                p.className = 'tg-particle';
                p.style.left = Math.random() * 100 + '%';
                p.style.animationDelay = Math.random() * 18 + 's';
                container.appendChild(p);
            }
        },

        createProgress: function() {
            var container = document.getElementById('tg-progress');
            if (!container) return;
            for (var i = 0; i < this.totalSteps; i++) {
                var rune = document.createElement('div');
                rune.className = 'tg-rune';
                rune.dataset.index = i;
                container.appendChild(rune);
            }
        },

        updateProgress: function(index) {
            var runes = document.querySelectorAll('.tg-rune');
            runes.forEach(function(r, i) {
                r.classList.remove('active', 'completed');
                if (i < index) r.classList.add('completed');
                if (i === index) r.classList.add('active');
            });
        },

        loadVisitorId: function() {
            var stored = localStorage.getItem('duendes_visitor_id');
            if (stored) {
                this.visitorId = stored;
            } else {
                this.visitorId = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('duendes_visitor_id', this.visitorId);
            }
        },

        show: function(screenId) {
            document.querySelectorAll('.tg-screen').forEach(function(s) {
                s.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
            window.scrollTo(0, 0);
        },

        startWithMusic: function() {
            this.audio = document.getElementById('tg-audio');
            if (this.audio) {
                this.audio.volume = 0.3;
                this.audio.play().catch(function() {});
            }
            this.show('screen-intro');
        },

        startWithoutMusic: function() {
            this.show('screen-intro');
        },

        goToPersonal: function() {
            this.updateProgress(0);
            this.show('screen-personal');
        },

        updatePhonePrefix: function() {
            var country = document.getElementById('p-country').value;
            var prefix = this.phonePrefixes[country] || '+1';
            document.getElementById('c-prefix').value = prefix;
        },

        submitPersonal: function() {
            var name = document.getElementById('p-name').value.trim();
            var age = document.getElementById('p-age').value;
            var nationality = document.getElementById('p-nationality').value;
            var country = document.getElementById('p-country').value;
            var birth = document.getElementById('p-birth').value;

            if (!name) { alert('Por favor ingresá tu nombre'); return; }
            if (!age) { alert('Por favor ingresá tu edad'); return; }
            if (!nationality) { alert('Por favor seleccioná tu nacionalidad'); return; }
            if (!country) { alert('Por favor seleccioná tu país de residencia'); return; }
            if (!birth) { alert('Por favor ingresá tu fecha de nacimiento'); return; }

            this.personal = {
                name: name,
                age: age,
                sex: document.getElementById('p-sex').value,
                nationality: nationality,
                country: country,
                city: document.getElementById('p-city').value.trim(),
                birth: birth
            };

            this.currentQ = 0;
            this.answers = {};
            this.updateProgress(1);
            this.show('screen-questions');
            this.showQuestion();
        },

        animateText: function(text, container, callback) {
            container.innerHTML = '';
            var words = text.split(' ');
            var delay = 0;

            words.forEach(function(word, wi) {
                var wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.marginRight = '0.25em';

                word.split('').forEach(function(char) {
                    var charSpan = document.createElement('span');
                    charSpan.className = 'tg-letter';
                    charSpan.textContent = char;
                    charSpan.style.animationDelay = delay + 's';
                    wordSpan.appendChild(charSpan);
                    delay += 0.02;
                });

                container.appendChild(wordSpan);
            });

            if (callback) setTimeout(callback, delay * 1000 + 300);
        },

        showQuestion: function() {
            var q = this.questions[this.currentQ];
            var numEl = document.getElementById('q-num');
            var textEl = document.getElementById('q-text');
            var optionsEl = document.getElementById('q-options');
            var freetextEl = document.getElementById('q-freetext');

            numEl.textContent = (this.currentQ + 1) + ' / ' + this.questions.length;
            this.updateProgress(this.currentQ + 1);

            optionsEl.innerHTML = '';
            optionsEl.style.display = 'none';
            freetextEl.style.display = 'none';

            var self = this;
            this.animateText(q.text, textEl, function() {
                if (q.type === 'options') {
                    optionsEl.style.display = 'flex';
                    q.options.forEach(function(opt, i) {
                        var btn = document.createElement('button');
                        btn.className = 'tg-bubble';
                        btn.textContent = opt.text;
                        btn.onclick = function() { self.selectOption(opt, btn); };
                        optionsEl.appendChild(btn);

                        setTimeout(function() {
                            btn.classList.add('visible');
                        }, i * 100);
                    });
                } else {
                    freetextEl.style.display = 'block';
                    var textarea = document.getElementById('q-textarea');
                    textarea.value = '';
                    textarea.placeholder = q.placeholder || '';
                    setTimeout(function() { textarea.focus(); }, 300);
                }
            });
        },

        selectOption: function(opt, btn) {
            var q = this.questions[this.currentQ];
            this.answers[q.id] = opt;

            btn.classList.add('selected');
            document.querySelectorAll('.tg-bubble').forEach(function(b) {
                if (b !== btn) b.style.opacity = '0';
            });

            var self = this;
            setTimeout(function() {
                self.nextQuestion();
            }, 450);
        },

        submitFreetext: function() {
            var q = this.questions[this.currentQ];
            var text = document.getElementById('q-textarea').value.trim();

            if (!text) {
                alert('Por favor escribí algo antes de continuar');
                return;
            }

            this.answers[q.id] = {text: text};
            this.nextQuestion();
        },

        nextQuestion: function() {
            this.currentQ++;

            if (this.currentQ < this.questions.length) {
                this.showQuestion();
            } else {
                this.updateProgress(8);
                this.show('screen-contact');
            }
        },

        submitContact: function() {
            var email = document.getElementById('c-email').value.trim();

            if (!email) {
                alert('Por favor ingresá tu email');
                return;
            }

            this.contact = {
                email: email,
                phone: document.getElementById('c-prefix').value + document.getElementById('c-phone').value.replace(/\s/g, ''),
                newsletter: document.getElementById('c-newsletter').checked
            };

            this.updateProgress(9);
            this.show('screen-loading');
            this.animateLoader();
            this.processResult();
        },

        animateLoader: function() {
            var self = this;
            var textEl = document.getElementById('loader-text');
            var index = 0;

            var interval = setInterval(function() {
                index = (index + 1) % self.loaderPhrases.length;
                textEl.textContent = self.loaderPhrases[index];
            }, 2000);

            setTimeout(function() {
                clearInterval(interval);
            }, 10000);
        },

        processResult: function() {
            var self = this;

            var testData = {
                visitor_id: this.visitorId,
                personal: this.personal,
                contact: this.contact,
                answers: this.answers,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem('duendes_test_data', JSON.stringify(testData));

            Promise.all([
                this.callInterpretation(testData),
                this.loadProducts()
            ]).then(function(results) {
                var interpretation = results[0];
                var products = results[1];

                self.renderResult(interpretation, products);
                self.saveProfile(testData, interpretation);

            }).catch(function(err) {
                console.error('Error:', err);
                self.renderFallbackResult();
            });
        },

        callInterpretation: function(data) {
            return fetch(this.vercelApi + '/guardian/interpret', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    identity: {
                        name: data.personal.name,
                        birth: data.personal.birth,
                        country: data.personal.country
                    },
                    answers: data.answers
                })
            })
            .then(function(r) { return r.json(); })
            .catch(function() {
                return {
                    summary_emotional: 'Tu energía habla de alguien que ha sostenido demasiado. Pero hay una parte de vos que todavía cree... y esa parte te trajo hasta acá.',
                    mirror_lines: ['Leí tu señal con respeto.', 'Sentí algo claro: estás lista para soltar lo que ya no es tuyo.'],
                    intent: 'proteccion',
                    ritual_text: 'Esta noche, apoyá la mano en tu pecho y decí: "Hoy me elijo. Hoy vuelvo a mí."',
                    sealed_phrase: 'Tu energía no está rota. Está despertando.',
                    why_reasons: ['Porque tu energía pidió protección sin palabras', 'Porque sentí el cansancio de quien ha dado demasiado', 'Porque el guardián que te eligió sabe sostenerte']
                };
            });
        },

        loadProducts: function() {
            var self = this;
            var intent = 'proteccion';

            if (this.answers.q2_pain) {
                var pain = this.answers.q2_pain.pain;
                if (pain === 'amor' || pain === 'soledad') intent = 'amor';
                else if (pain === 'agotamiento' || pain === 'patrones') intent = 'sanacion';
            }

            var formData = new FormData();
            formData.append('action', 'duendes_get_productos');
            formData.append('categoria', intent);
            formData.append('limite', 5);

            return fetch(this.ajaxUrl, {
                method: 'POST',
                body: formData
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success && data.data.length > 0) {
                    return data.data;
                }
                var fd2 = new FormData();
                fd2.append('action', 'duendes_get_productos');
                fd2.append('limite', 5);
                return fetch(self.ajaxUrl, {method: 'POST', body: fd2})
                    .then(function(r) { return r.json(); })
                    .then(function(d) { return d.success ? d.data : []; });
            });
        },

        renderResult: function(interpretation, products) {
            var name = this.personal.name.split(' ')[0];
            var container = document.getElementById('result-content');

            var mainProduct = products[0] || null;
            var alsoProducts = products.slice(1, 5);

            var mainName = mainProduct ? mainProduct.nombre.split(' ')[0] : 'Tu Guardián';

            var html = '';

            // Header
            html += '<div class="tg-result-header">';
            html += '<h1 class="tg-result-title">' + name + ', tu guardián te encontró.</h1>';
            html += '<p class="tg-result-subtitle">No llegaste por casualidad.</p>';
            html += '</div>';

            // Grid principal
            html += '<div class="tg-result-grid">';

            // Columna izquierda
            html += '<div class="tg-result-left">';

            // Card Revelación
            html += '<div class="tg-card tg-revelation">';
            html += '<h3 class="tg-card-title">Tu revelación</h3>';
            if (interpretation.mirror_lines) {
                interpretation.mirror_lines.forEach(function(line) {
                    html += '<p>' + line + '</p>';
                });
            }
            html += '<p>' + (interpretation.summary_emotional || '') + '</p>';
            html += '</div>';

            // Card Por qué estos guardianes
            if (interpretation.why_reasons && interpretation.why_reasons.length > 0) {
                html += '<div class="tg-card">';
                html += '<h3 class="tg-card-title">Por qué estos guardianes</h3>';
                html += '<ul class="tg-why-list">';
                interpretation.why_reasons.forEach(function(reason) {
                    html += '<li>' + reason + '</li>';
                });
                html += '</ul>';
                html += '</div>';
            }

            html += '</div>'; // fin columna izquierda

            // Columna derecha
            html += '<div class="tg-result-right">';

            // Guardian principal
            if (mainProduct) {
                html += '<div class="tg-guardian-main">';
                html += '<img class="tg-guardian-img" src="' + mainProduct.imagen + '" alt="' + mainProduct.nombre + '" onerror="this.style.display=\'none\'">';
                html += '<div class="tg-guardian-name">' + mainProduct.nombre + '</div>';
                html += '<div class="tg-guardian-price">' + mainProduct.precio + '</div>';
                html += '<div class="tg-guardian-scarcity">Pieza única. Si se adopta, no vuelve.</div>';
                html += '<a href="' + mainProduct.url + '" class="tg-cta-primary">Sellar mi pacto con ' + mainName + '</a>';
                html += '<a href="' + mainProduct.url + '" class="tg-cta-secondary">Ver detalles</a>';
                html += '</div>';
            }

            // Ritual
            if (interpretation.ritual_text) {
                html += '<div class="tg-card tg-ritual">';
                html += '<h3 class="tg-card-title">Tu ritual de conexión</h3>';
                html += '<p class="tg-ritual-text">' + interpretation.ritual_text + '</p>';
                html += '</div>';
            }

            html += '</div>'; // fin columna derecha
            html += '</div>'; // fin grid

            // Separador
            html += '<div class="tg-separator"></div>';

            // También te recomendamos
            if (alsoProducts.length > 0) {
                html += '<div class="tg-also-section">';
                html += '<h3 class="tg-also-title">También te recomendamos</h3>';
                html += '<div class="tg-also-grid">';
                alsoProducts.forEach(function(prod) {
                    html += '<a href="' + prod.url + '" class="tg-also-item">';
                    html += '<img class="tg-also-img" src="' + prod.imagen + '" alt="' + prod.nombre + '" onerror="this.style.display=\'none\'">';
                    html += '<div class="tg-also-name">' + prod.nombre + '</div>';
                    html += '<div class="tg-also-price">' + prod.precio + '</div>';
                    html += '<span class="tg-also-cta">Ver →</span>';
                    html += '</a>';
                });
                html += '</div>';
                html += '</div>';
            }

            // Frase sellada
            if (interpretation.sealed_phrase) {
                html += '<div class="tg-sealed">';
                html += '<p class="tg-sealed-phrase">"' + interpretation.sealed_phrase + '"</p>';
                html += '<div class="tg-sealed-actions">';
                html += '<button class="tg-btn-outline" onclick="TG.downloadCard()">Descargar mi tarjeta</button>';
                html += '<button class="tg-btn-outline" onclick="TG.copyPhrase()">Copiar frase</button>';
                html += '</div>';
                html += '</div>';
            }

            html += '<button class="tg-restart" onclick="TG.restart()">Hacer el test de nuevo</button>';

            container.innerHTML = html;
            this.updateProgress(10);
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
                headers: {'Content-Type': 'application/json'},
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

        downloadCard: function() {
            var data = JSON.parse(localStorage.getItem('duendes_test_data') || '{}');
            var name = data.personal?.name || 'Visitante';
            alert('Tu tarjeta está siendo generada. Te llegará al email: ' + (data.contact?.email || ''));
            // TODO: Implementar generación real de PNG/PDF
        },

        copyPhrase: function() {
            var phrase = document.querySelector('.tg-sealed-phrase');
            if (phrase && navigator.clipboard) {
                navigator.clipboard.writeText(phrase.textContent.replace(/"/g, ''));
                alert('Frase copiada. Guardala en un lugar especial.');
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
        }
    };

    TG.init();
    </script>
    <?php
}

add_shortcode('duendes_test_guardian', function(){ return ''; });
// FIN TEST DEL GUARDIAN v3.5
