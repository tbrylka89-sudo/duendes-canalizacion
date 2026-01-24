<?php
/*
Plugin Name: Test Guardian v13 - Verde Musgo Neón
Description: Test del Guardian con frecuencia de conexión + música + matching real con fotos
Version: 13.0
*/
if (!defined('ABSPATH')) exit;

function duendes_test_guardian_v13_render() {
    $v = '13.' . time();
    ob_start();
?>
<!-- TEST GUARDIAN v13 - VERDE MUSGO NEÓN -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">

<div id="tg-app" data-v="<?php echo $v; ?>">

<style>
/* ======================================== PROTECCIÓN ELEMENTOR ======================================== */
.elementor-shortcode:has(#tg-app),
.elementor-widget-shortcode:has(#tg-app),
.elementor-element:has(#tg-app) {
    display: block !important;
    min-height: 100vh !important;
    visibility: visible !important;
    opacity: 1 !important;
    overflow: visible !important;
}

.elementor-shortcode,
.elementor-widget-shortcode {
    min-height: auto;
}

/* ======================================== VARIABLES - AZUL CELESTE ELÉCTRICO ======================================== */
:root {
    --tg-neon: #FF0080;
    --tg-neon-claro: #FF66AA;
    --tg-neon-oscuro: #CC0066;
    --tg-neon-glow: rgba(255, 0, 128, 0.5);
    --tg-negro: #000000;
    --tg-blanco: #ffffff;
}

/* ======================================== BASE ======================================== */
#tg-app {
    display: block !important;
    width: 100% !important;
    min-height: 100vh !important;
    background: #000000 !important;
    font-family: 'Cormorant Garamond', Georgia, serif !important;
    color: #ffffff !important;
    position: relative !important;
    box-sizing: border-box !important;
}

#tg-app * { box-sizing: border-box !important; }

#tg-app::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image:
        radial-gradient(2px 2px at 20% 30%, rgba(255, 0, 128, 0.4), transparent),
        radial-gradient(2px 2px at 80% 20%, rgba(255, 0, 128, 0.3), transparent),
        radial-gradient(2px 2px at 40% 70%, rgba(255, 0, 128, 0.4), transparent),
        radial-gradient(1px 1px at 60% 50%, rgba(255, 0, 128, 0.2), transparent);
    animation: tgTwinkle 4s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
}

@keyframes tgTwinkle {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

.tg-container {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 100vh !important;
    padding: 40px 20px 100px !important;
    position: relative !important;
    z-index: 1 !important;
    text-align: center !important;
}

.tg-screen {
    display: none !important;
    width: 100% !important;
    max-width: 600px !important;
    margin: 0 auto !important;
    text-align: center !important;
    animation: fadeUp 0.6s ease-out !important;
}

.tg-screen.active { display: block !important; }

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

.tg-title {
    font-family: 'Cinzel Decorative', serif !important;
    font-size: 28px !important;
    color: #FF0080 !important;
    margin: 0 0 25px 0 !important;
    text-shadow: 0 0 30px rgba(255, 0, 128, 0.6), 0 0 60px rgba(255, 0, 128, 0.3) !important;
    line-height: 1.3 !important;
}

.tg-subtitle {
    font-size: 19px !important;
    color: #ffffff !important;
    margin: 0 0 20px 0 !important;
    line-height: 1.7 !important;
}

.tg-hint {
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.6) !important;
    margin: 0 0 30px 0 !important;
    font-style: italic !important;
}

/* ======================================== BOTONES ======================================== */
.tg-btn {
    display: inline-block !important;
    padding: 18px 45px !important;
    background: linear-gradient(135deg, #FF0080 0%, #CC0066 100%) !important;
    border: none !important;
    border-radius: 50px !important;
    color: #000000 !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
    cursor: pointer !important;
    transition: all 0.4s ease !important;
    box-shadow: 0 4px 25px rgba(255, 0, 128, 0.5), 0 0 40px rgba(255, 0, 128, 0.3) !important;
    font-family: 'Cinzel', serif !important;
}

.tg-btn:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 8px 35px rgba(255, 0, 128, 0.7), 0 0 60px rgba(255, 0, 128, 0.4) !important;
}

.tg-btn-secondary {
    background: transparent !important;
    border: 2px solid rgba(255, 0, 128, 0.6) !important;
    color: #FF0080 !important;
    box-shadow: 0 0 20px rgba(255, 0, 128, 0.2) !important;
}

.tg-btn-secondary:hover {
    background: rgba(255, 0, 128, 0.1) !important;
    border-color: #FF0080 !important;
}

/* ======================================== BOTÓN FRECUENCIA ESPECIAL ======================================== */
.tg-btn-frecuencia {
    padding: 25px 50px !important;
    font-size: 16px !important;
    background: linear-gradient(135deg, #FF0080 0%, #CC0066 50%, #FF0080 100%) !important;
    background-size: 200% 200% !important;
    animation: pulseGlow 2s ease-in-out infinite, gradientShift 3s ease infinite !important;
    box-shadow:
        0 0 20px rgba(255, 0, 128, 0.6),
        0 0 40px rgba(255, 0, 128, 0.4),
        0 0 60px rgba(255, 0, 128, 0.2),
        inset 0 0 20px rgba(255, 255, 255, 0.1) !important;
}

@keyframes pulseGlow {
    0%, 100% {
        box-shadow:
            0 0 20px rgba(255, 0, 128, 0.6),
            0 0 40px rgba(255, 0, 128, 0.4),
            0 0 60px rgba(255, 0, 128, 0.2);
    }
    50% {
        box-shadow:
            0 0 30px rgba(255, 0, 128, 0.8),
            0 0 60px rgba(255, 0, 128, 0.5),
            0 0 90px rgba(255, 0, 128, 0.3);
    }
}

@keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

/* ======================================== REPRODUCTOR MÚSICA ======================================== */
.tg-audio-control {
    position: fixed !important;
    bottom: 70px !important;
    right: 20px !important;
    z-index: 200 !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    background: rgba(0, 0, 0, 0.8) !important;
    padding: 10px 15px !important;
    border-radius: 30px !important;
    border: 1px solid rgba(255, 0, 128, 0.3) !important;
}

.tg-audio-btn {
    width: 40px !important;
    height: 40px !important;
    border-radius: 50% !important;
    background: linear-gradient(135deg, #FF0080, #CC0066) !important;
    border: none !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 18px !important;
    color: #000 !important;
    transition: all 0.3s ease !important;
}

.tg-audio-btn:hover {
    transform: scale(1.1) !important;
    box-shadow: 0 0 20px rgba(255, 0, 128, 0.5) !important;
}

.tg-audio-label {
    font-size: 11px !important;
    color: rgba(255, 255, 255, 0.7) !important;
    font-family: 'Cinzel', serif !important;
}

/* ======================================== FORMULARIOS ======================================== */
.tg-form {
    width: 100% !important;
    max-width: 420px !important;
    margin: 30px auto 0 !important;
    text-align: left !important;
}

.tg-field { margin-bottom: 22px !important; }

.tg-label {
    display: block !important;
    font-size: 12px !important;
    color: #FF0080 !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    margin-bottom: 10px !important;
    font-family: 'Cinzel', serif !important;
    text-shadow: 0 0 10px rgba(255, 0, 128, 0.3) !important;
}

.tg-input {
    width: 100% !important;
    padding: 15px 18px !important;
    background: rgba(255, 0, 128, 0.05) !important;
    border: 1px solid rgba(255, 0, 128, 0.3) !important;
    border-radius: 10px !important;
    color: #ffffff !important;
    font-size: 16px !important;
    font-family: inherit !important;
    transition: all 0.3s ease !important;
}

.tg-input:focus {
    outline: none !important;
    border-color: #FF0080 !important;
    box-shadow: 0 0 20px rgba(255, 0, 128, 0.2), 0 0 40px rgba(255, 0, 128, 0.1) !important;
}

.tg-input::placeholder { color: rgba(255, 255, 255, 0.4) !important; }

.tg-row {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 15px !important;
}

/* ======================================== PREGUNTAS ======================================== */
.tg-question-block {
    font-size: 11px !important;
    color: #FF0080 !important;
    text-transform: uppercase !important;
    letter-spacing: 4px !important;
    margin-bottom: 20px !important;
    font-family: 'Cinzel', serif !important;
    text-shadow: 0 0 15px rgba(255, 0, 128, 0.4) !important;
}

.tg-question-text {
    font-size: 22px !important;
    font-weight: 400 !important;
    color: #ffffff !important;
    line-height: 1.5 !important;
    margin-bottom: 35px !important;
}

.tg-options {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
    width: 100% !important;
    max-width: 480px !important;
    margin: 0 auto !important;
}

.tg-option {
    display: flex !important;
    align-items: center !important;
    gap: 15px !important;
    padding: 16px 20px !important;
    background: rgba(255, 0, 128, 0.03) !important;
    border: 1px solid rgba(255, 0, 128, 0.2) !important;
    border-radius: 10px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    text-align: left !important;
}

.tg-option:hover {
    background: rgba(255, 0, 128, 0.1) !important;
    border-color: #FF0080 !important;
    transform: translateX(8px) !important;
    box-shadow: 0 0 20px rgba(255, 0, 128, 0.2) !important;
}

.tg-option-dot {
    width: 10px !important;
    height: 10px !important;
    background: #FF0080 !important;
    border-radius: 50% !important;
    flex-shrink: 0 !important;
    box-shadow: 0 0 10px rgba(255, 0, 128, 0.5) !important;
}

.tg-option-text {
    font-size: 16px !important;
    color: #ffffff !important;
}

/* ======================================== ESCALA Y SLIDER ======================================== */
.tg-escala-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 12px !important;
    max-width: 480px !important;
    margin: 0 auto !important;
}

.tg-escala-btn {
    padding: 16px 14px !important;
    background: rgba(255, 0, 128, 0.03) !important;
    border: 1px solid rgba(255, 0, 128, 0.2) !important;
    border-radius: 10px !important;
    color: #ffffff !important;
    font-size: 15px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    font-family: inherit !important;
}

.tg-escala-btn:hover {
    background: rgba(255, 0, 128, 0.12) !important;
    border-color: #FF0080 !important;
    box-shadow: 0 0 15px rgba(255, 0, 128, 0.3) !important;
}

.tg-slider-wrap {
    width: 100% !important;
    max-width: 380px !important;
    margin: 0 auto !important;
    padding: 20px 0 !important;
}

.tg-slider-labels {
    display: flex !important;
    justify-content: space-between !important;
    color: rgba(255,255,255,0.6) !important;
    font-size: 13px !important;
    margin-bottom: 15px !important;
}

.tg-slider {
    -webkit-appearance: none !important;
    width: 100% !important;
    height: 8px !important;
    border-radius: 4px !important;
    background: linear-gradient(to right, #2d5a3d, #FF0080, #8b3a3a) !important;
    outline: none !important;
}

.tg-slider::-webkit-slider-thumb {
    -webkit-appearance: none !important;
    width: 28px !important;
    height: 28px !important;
    border-radius: 50% !important;
    background: #FF0080 !important;
    cursor: pointer !important;
    border: 3px solid #fff !important;
    box-shadow: 0 3px 12px rgba(255, 0, 128, 0.6), 0 0 20px rgba(255, 0, 128, 0.4) !important;
}

.tg-slider-value {
    font-size: 48px !important;
    font-weight: 700 !important;
    color: #FF0080 !important;
    font-family: 'Cinzel Decorative', serif !important;
    margin: 20px 0 !important;
    text-shadow: 0 0 25px rgba(255, 0, 128, 0.5), 0 0 50px rgba(255, 0, 128, 0.3) !important;
}

/* ======================================== TEXTAREA ======================================== */
.tg-textarea-wrap {
    width: 100% !important;
    max-width: 480px !important;
    margin: 0 auto !important;
}

.tg-textarea {
    width: 100% !important;
    min-height: 120px !important;
    padding: 18px !important;
    background: rgba(255, 0, 128, 0.03) !important;
    border: 1px solid rgba(255, 0, 128, 0.25) !important;
    border-radius: 12px !important;
    color: #ffffff !important;
    font-size: 16px !important;
    font-family: inherit !important;
    line-height: 1.6 !important;
    resize: vertical !important;
    transition: all 0.3s ease !important;
}

.tg-textarea:focus {
    outline: none !important;
    border-color: #FF0080 !important;
    box-shadow: 0 0 20px rgba(255, 0, 128, 0.15) !important;
}

.tg-textarea::placeholder { color: rgba(255, 255, 255, 0.35) !important; }

.tg-textarea-hint {
    font-size: 13px !important;
    color: rgba(255, 255, 255, 0.5) !important;
    margin-top: 10px !important;
    font-style: italic !important;
}

/* ======================================== LOADING ======================================== */
.tg-loading {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    padding: 50px 20px !important;
}

.tg-spinner {
    width: 50px !important;
    height: 50px !important;
    border: 3px solid rgba(255, 0, 128, 0.2) !important;
    border-top-color: #FF0080 !important;
    border-radius: 50% !important;
    animation: spin 1s linear infinite !important;
    margin-bottom: 25px !important;
    box-shadow: 0 0 20px rgba(255, 0, 128, 0.3) !important;
}

@keyframes spin { to { transform: rotate(360deg); } }

.tg-loading-text {
    font-size: 18px !important;
    color: #ffffff !important;
}

/* ======================================== PROGRESO ======================================== */
.tg-progress {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    height: 55px !important;
    background: rgba(0, 0, 0, 0.95) !important;
    backdrop-filter: blur(10px) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 100 !important;
    border-top: 1px solid rgba(255, 0, 128, 0.3) !important;
}

.tg-progress-inner {
    width: 100% !important;
    max-width: 380px !important;
    text-align: center !important;
    padding: 0 20px !important;
}

.tg-progress-label {
    font-size: 11px !important;
    color: rgba(255, 255, 255, 0.6) !important;
    margin-bottom: 6px !important;
    font-family: 'Cinzel', serif !important;
    letter-spacing: 1px !important;
}

.tg-progress-bar {
    width: 100% !important;
    height: 4px !important;
    background: rgba(255, 255, 255, 0.1) !important;
    border-radius: 2px !important;
    overflow: hidden !important;
}

.tg-progress-fill {
    height: 100% !important;
    background: linear-gradient(90deg, #FF0080, #FF66AA) !important;
    border-radius: 2px !important;
    transition: width 0.5s ease !important;
    width: 0% !important;
    box-shadow: 0 0 10px rgba(255, 0, 128, 0.5) !important;
}

/* ======================================== RESULTADO ======================================== */
.tg-result-sincro {
    background: linear-gradient(135deg, rgba(255, 0, 128, 0.15), rgba(255, 0, 128, 0.05)) !important;
    border: 1px solid rgba(255, 0, 128, 0.3) !important;
    border-radius: 12px !important;
    padding: 20px !important;
    margin: 25px 0 !important;
}

.tg-sincro-icon {
    font-size: 32px !important;
    margin-bottom: 10px !important;
    color: #FF0080 !important;
    text-shadow: 0 0 20px rgba(255, 0, 128, 0.8), 0 0 40px rgba(255, 0, 128, 0.4) !important;
    animation: iconPulse 2s ease-in-out infinite !important;
}

@keyframes iconPulse {
    0%, 100% { transform: scale(1); opacity: 0.9; }
    50% { transform: scale(1.1); opacity: 1; }
}

.tg-sincro-text {
    font-size: 17px !important;
    color: #FF0080 !important;
    line-height: 1.6 !important;
    font-style: italic !important;
    text-shadow: 0 0 10px rgba(255, 0, 128, 0.3) !important;
}

.tg-guardians-grid {
    display: flex !important;
    justify-content: center !important;
    align-items: flex-end !important;
    gap: 15px !important;
    margin: 35px 0 !important;
    flex-wrap: wrap !important;
}

.tg-guardian-card {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    transition: all 0.3s ease !important;
    cursor: pointer !important;
    text-decoration: none !important;
    padding: 15px !important;
    border-radius: 15px !important;
    background: rgba(255, 0, 128, 0.03) !important;
    border: 1px solid transparent !important;
}

.tg-guardian-card:hover {
    transform: translateY(-8px) scale(1.02) !important;
    border-color: rgba(255, 0, 128, 0.4) !important;
    background: rgba(255, 0, 128, 0.08) !important;
    box-shadow: 0 0 30px rgba(255, 0, 128, 0.2) !important;
}

.tg-guardian-card.main {
    order: 0 !important;
    background: rgba(255, 0, 128, 0.08) !important;
    border-color: rgba(255, 0, 128, 0.3) !important;
}

.tg-guardian-img-wrap {
    position: relative !important;
    margin-bottom: 12px !important;
}

.tg-guardian-img {
    border-radius: 50% !important;
    object-fit: cover !important;
    border: 3px solid #FF0080 !important;
    box-shadow: 0 0 25px rgba(255, 0, 128, 0.4), 0 0 50px rgba(255, 0, 128, 0.2) !important;
}

.tg-guardian-card.main .tg-guardian-img { width: 130px !important; height: 130px !important; }
.tg-guardian-card.secondary .tg-guardian-img { width: 90px !important; height: 90px !important; border-color: rgba(255, 0, 128, 0.6) !important; }

.tg-guardian-match {
    position: absolute !important;
    bottom: -8px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    background: #FF0080 !important;
    color: #000000 !important;
    font-size: 12px !important;
    font-weight: bold !important;
    padding: 4px 12px !important;
    border-radius: 15px !important;
    font-family: 'Cinzel', serif !important;
    box-shadow: 0 0 15px rgba(255, 0, 128, 0.5) !important;
}

.tg-guardian-name {
    font-family: 'Cinzel Decorative', serif !important;
    font-size: 15px !important;
    color: #fff !important;
    margin-top: 8px !important;
}

.tg-guardian-card.main .tg-guardian-name {
    font-size: 18px !important;
    color: #FF0080 !important;
    text-shadow: 0 0 15px rgba(255, 0, 128, 0.4) !important;
}

.tg-guardian-categoria {
    font-size: 11px !important;
    color: rgba(255,255,255,0.6) !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    margin-top: 4px !important;
}

/* ======================================== HOOK ADAPTATIVO ======================================== */
.tg-hook-box {
    background: rgba(255,255,255,0.03) !important;
    border-left: 3px solid #FF0080 !important;
    padding: 20px 25px !important;
    margin: 30px 0 !important;
    text-align: left !important;
}

.tg-hook-text {
    font-size: 18px !important;
    color: #ffffff !important;
    line-height: 1.7 !important;
    font-style: italic !important;
}

/* ======================================== ESCASEZ ======================================== */
.tg-escasez-bar {
    display: flex !important;
    justify-content: center !important;
    gap: 25px !important;
    margin: 20px 0 !important;
    flex-wrap: wrap !important;
}

.tg-escasez-item {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    font-size: 13px !important;
    color: rgba(255,255,255,0.7) !important;
}

.tg-escasez-dot {
    width: 8px !important;
    height: 8px !important;
    background: #e75480 !important;
    border-radius: 50% !important;
    animation: pulse 1.5s infinite !important;
}

.tg-escasez-dot.verde {
    background: #FF0080 !important;
    box-shadow: 0 0 10px rgba(255, 0, 128, 0.5) !important;
}

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
}

/* ======================================== TESTIMONIOS ======================================== */
.tg-testimonio {
    background: rgba(255,255,255,0.02) !important;
    border: 1px solid rgba(255, 0, 128, 0.2) !important;
    border-radius: 12px !important;
    padding: 20px !important;
    margin: 25px 0 !important;
    text-align: left !important;
}

.tg-testimonio-text {
    font-size: 15px !important;
    color: rgba(255,255,255,0.85) !important;
    line-height: 1.6 !important;
    font-style: italic !important;
    margin-bottom: 12px !important;
}

.tg-testimonio-autor {
    font-size: 13px !important;
    color: #FF0080 !important;
}

/* ======================================== OBJECIONES ======================================== */
.tg-objecion {
    background: rgba(255, 0, 128, 0.05) !important;
    border-radius: 10px !important;
    padding: 18px 20px !important;
    margin: 15px 0 !important;
    text-align: left !important;
}

.tg-objecion-pregunta {
    font-size: 14px !important;
    color: rgba(255,255,255,0.6) !important;
    margin-bottom: 8px !important;
}

.tg-objecion-respuesta {
    font-size: 15px !important;
    color: #ffffff !important;
    line-height: 1.5 !important;
}

/* ======================================== MICRO-COMPROMISO ======================================== */
.tg-micro-step {
    background: rgba(255, 0, 128, 0.08) !important;
    border: 1px solid rgba(255, 0, 128, 0.3) !important;
    border-radius: 12px !important;
    padding: 25px !important;
    margin: 30px 0 !important;
}

.tg-micro-title {
    font-family: 'Cinzel', serif !important;
    font-size: 16px !important;
    color: #FF0080 !important;
    margin-bottom: 12px !important;
    text-shadow: 0 0 10px rgba(255, 0, 128, 0.3) !important;
}

.tg-micro-desc {
    font-size: 15px !important;
    color: rgba(255,255,255,0.85) !important;
    line-height: 1.5 !important;
    margin-bottom: 18px !important;
}

/* ======================================== PERFIL CARD ======================================== */
.tg-perfil-card {
    background: rgba(255,255,255,0.02) !important;
    border: 1px solid rgba(255, 0, 128, 0.2) !important;
    border-radius: 12px !important;
    padding: 20px !important;
    margin: 25px 0 !important;
}

.tg-perfil-title {
    font-size: 12px !important;
    color: #FF0080 !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    margin-bottom: 15px !important;
    font-family: 'Cinzel', serif !important;
    text-shadow: 0 0 10px rgba(255, 0, 128, 0.3) !important;
}

.tg-perfil-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 15px !important;
}

.tg-perfil-item { text-align: left !important; }

.tg-perfil-label {
    font-size: 10px !important;
    color: rgba(255,255,255,0.5) !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
}

.tg-perfil-value {
    font-size: 14px !important;
    color: #fff !important;
    text-transform: capitalize !important;
    margin-top: 3px !important;
}

.tg-perfil-value.alta { color: #e75480 !important; }
.tg-perfil-value.media { color: #FF0080 !important; }
.tg-perfil-value.baja { color: #56ab91 !important; }

/* ======================================== EMAIL CONFIRM ======================================== */
.tg-email-sent {
    background: rgba(86, 171, 145, 0.1) !important;
    border: 1px solid rgba(86, 171, 145, 0.3) !important;
    border-radius: 10px !important;
    padding: 15px 20px !important;
    margin: 20px 0 !important;
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.85) !important;
}

/* ======================================== ELEGIDOS INTRO ======================================== */
.tg-elegidos-text {
    font-size: 20px !important;
    color: #ffffff !important;
    line-height: 1.9 !important;
    max-width: 480px !important;
    margin: 0 auto 40px !important;
}

.tg-highlight {
    font-family: 'Cinzel Decorative', serif !important;
    color: #FF0080 !important;
    font-weight: 700 !important;
    font-size: 28px !important;
    display: inline-block !important;
    text-shadow: 0 0 30px rgba(255, 0, 128, 0.5), 0 0 60px rgba(255, 0, 128, 0.3) !important;
}

/* ======================================== PANTALLA FRECUENCIA ======================================== */
.tg-frecuencia-container {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 80vh !important;
    padding: 40px 20px !important;
}

.tg-frecuencia-icon {
    width: 80px !important;
    height: 80px !important;
    margin-bottom: 30px !important;
    position: relative !important;
}

.tg-frecuencia-icon::before {
    content: '' !important;
    position: absolute !important;
    width: 100% !important;
    height: 100% !important;
    border: 3px solid #FF0080 !important;
    border-radius: 50% !important;
    animation: pulseRing 2s ease-out infinite !important;
}

.tg-frecuencia-icon::after {
    content: '' !important;
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    width: 40px !important;
    height: 40px !important;
    transform: translate(-50%, -50%) !important;
    background: radial-gradient(circle, #FF0080 0%, #CC0066 50%, transparent 70%) !important;
    border-radius: 50% !important;
    animation: coreGlow 2s ease-in-out infinite !important;
    box-shadow: 0 0 30px rgba(255, 0, 128, 0.6), 0 0 60px rgba(255, 0, 128, 0.3) !important;
}

@keyframes pulseRing {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.8); opacity: 0; }
}

@keyframes coreGlow {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
}

.tg-frecuencia-title {
    font-family: 'Cinzel Decorative', serif !important;
    font-size: 32px !important;
    color: #FF0080 !important;
    margin-bottom: 20px !important;
    text-shadow: 0 0 40px rgba(255, 0, 128, 0.6) !important;
    line-height: 1.3 !important;
}

.tg-frecuencia-subtitle {
    font-size: 18px !important;
    color: rgba(255, 255, 255, 0.8) !important;
    max-width: 400px !important;
    line-height: 1.7 !important;
    margin-bottom: 50px !important;
}

/* ======================================== NO IMAGEN FALLBACK ======================================== */
.tg-guardian-placeholder {
    width: 130px !important;
    height: 130px !important;
    border-radius: 50% !important;
    background: linear-gradient(135deg, rgba(255, 0, 128, 0.3), rgba(255, 0, 128, 0.1)) !important;
    border: 3px solid #FF0080 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0 0 25px rgba(255, 0, 128, 0.4) !important;
}

.tg-guardian-placeholder-text {
    font-family: 'Cinzel Decorative', serif !important;
    font-size: 48px !important;
    color: #FF0080 !important;
    text-shadow: 0 0 20px rgba(255, 0, 128, 0.5) !important;
}

.tg-guardian-card.secondary .tg-guardian-placeholder {
    width: 90px !important;
    height: 90px !important;
}

.tg-guardian-card.secondary .tg-guardian-placeholder-text {
    font-size: 32px !important;
}

/* ======================================== RESPONSIVE ======================================== */
@media (max-width: 600px) {
    .tg-title { font-size: 22px !important; }
    .tg-subtitle { font-size: 16px !important; }
    .tg-question-text { font-size: 18px !important; }
    .tg-highlight { font-size: 24px !important; }
    .tg-elegidos-text { font-size: 17px !important; }
    .tg-row { grid-template-columns: 1fr !important; }
    .tg-escala-grid { grid-template-columns: 1fr !important; }
    .tg-container { padding: 25px 15px 80px !important; }
    .tg-guardians-grid { gap: 10px !important; }
    .tg-perfil-grid { grid-template-columns: 1fr !important; }
    .tg-escasez-bar { flex-direction: column !important; gap: 10px !important; }
    .tg-frecuencia-title { font-size: 26px !important; }
    .tg-btn-frecuencia { padding: 20px 40px !important; font-size: 14px !important; }
    .tg-audio-control { bottom: 65px !important; right: 10px !important; padding: 8px 12px !important; }
}
</style>

<div class="tg-container">

    <!-- PANTALLA 0: ACTIVAR FRECUENCIA -->
    <div id="screen-frecuencia" class="tg-screen active">
        <div class="tg-frecuencia-container">
            <div class="tg-frecuencia-icon"></div>
            <h1 class="tg-frecuencia-title">Portal de Conexión</h1>
            <p class="tg-frecuencia-subtitle">
                Para encontrar a tu guardián, primero necesitamos sintonizar tu frecuencia energética.<br><br>
                Respirá profundo y cuando estés lista...
            </p>
            <button class="tg-btn tg-btn-frecuencia" onclick="TG13.activarFrecuencia()">
                ACTIVAR FRECUENCIA DE CONEXIÓN
            </button>
        </div>
    </div>

    <!-- PANTALLA ELEGIDOS -->
    <div id="screen-elegidos" class="tg-screen">
        <p class="tg-elegidos-text">
            Existen personas que fueron llamadas.<br>
            No por su nombre, sino por algo más profundo.<br><br>
            Los llaman <span class="tg-highlight">Los Elegidos</span>.<br><br>
            Son quienes cuidan de un guardián.<br>
            O quizás... son cuidados por él.
        </p>
        <button class="tg-btn" onclick="TG13.start()">DESCUBRIR SI SOY UNA</button>
    </div>

    <!-- INTRO -->
    <div id="screen-intro" class="tg-screen">
        <h1 class="tg-title">El portal está abierto</h1>
        <p class="tg-subtitle">No llegaste acá por casualidad.<br>Algo en vos buscaba esto.</p>
        <p class="tg-hint">12 preguntas · 3 minutos · Gratis</p>
        <button class="tg-btn" onclick="TG13.goIdentity()">COMENZAR</button>
    </div>

    <!-- IDENTIDAD -->
    <div id="screen-identity" class="tg-screen">
        <h1 class="tg-title">Contame sobre vos</h1>
        <p class="tg-subtitle">Es la llave del portal.</p>
        <div class="tg-form">
            <div class="tg-field">
                <label class="tg-label">Tu nombre</label>
                <input type="text" id="f-nombre" class="tg-input" placeholder="¿Cómo te llaman?">
            </div>
            <div class="tg-row">
                <div class="tg-field">
                    <label class="tg-label">Nacimiento</label>
                    <input type="date" id="f-nacimiento" class="tg-input">
                </div>
                <div class="tg-field">
                    <label class="tg-label">País</label>
                    <select id="f-pais" class="tg-input">
                        <option value="">Seleccionar...</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Chile">Chile</option>
                        <option value="México">México</option>
                        <option value="Colombia">Colombia</option>
                        <option value="España">España</option>
                        <option value="Perú">Perú</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
            </div>
            <button class="tg-btn" onclick="TG13.saveIdentity()">CONTINUAR</button>
        </div>
    </div>

    <!-- PREGUNTAS -->
    <div id="screen-question" class="tg-screen">
        <div class="tg-question-block" id="q-block">PREGUNTA</div>
        <div class="tg-question-text" id="q-text">Cargando...</div>
        <div id="q-options" class="tg-options"></div>
        <div id="q-escala" class="tg-escala-grid" style="display:none;"></div>
        <div id="q-slider" class="tg-slider-wrap" style="display:none;">
            <div class="tg-slider-labels">
                <span id="slider-min">1</span>
                <span id="slider-max">10</span>
            </div>
            <input type="range" id="slider-input" class="tg-slider" min="1" max="10" value="5">
            <div class="tg-slider-value" id="slider-value">5</div>
            <button class="tg-btn" onclick="TG13.submitSlider()">CONFIRMAR</button>
        </div>
        <div id="q-textarea" class="tg-textarea-wrap" style="display:none;">
            <textarea id="q-input" class="tg-textarea" placeholder="Escribí lo que sientas..."></textarea>
            <p class="tg-textarea-hint">No hay respuesta incorrecta.</p>
            <button class="tg-btn" onclick="TG13.submitText()">CONTINUAR</button>
        </div>
    </div>

    <!-- LOADING -->
    <div id="screen-loading" class="tg-screen">
        <div class="tg-loading">
            <div class="tg-spinner"></div>
            <span class="tg-loading-text" id="loading-msg">Canalizando tu energía...</span>
        </div>
    </div>

    <!-- CONTACTO -->
    <div id="screen-contact" class="tg-screen">
        <h1 class="tg-title">Ya casi llegamos</h1>
        <p class="tg-subtitle">Dejá tus datos para recibir el resultado completo.</p>
        <div class="tg-form">
            <div class="tg-field">
                <label class="tg-label">Email</label>
                <input type="email" id="f-email" class="tg-input" placeholder="tu@email.com">
            </div>
            <div class="tg-row">
                <div class="tg-field">
                    <label class="tg-label">Prefijo</label>
                    <select id="f-prefijo" class="tg-input">
                        <option value="+54">+54 Argentina</option>
                        <option value="+598">+598 Uruguay</option>
                        <option value="+56">+56 Chile</option>
                        <option value="+52">+52 México</option>
                        <option value="+57">+57 Colombia</option>
                        <option value="+34">+34 España</option>
                        <option value="+1">+1 USA/Canadá</option>
                    </select>
                </div>
                <div class="tg-field">
                    <label class="tg-label">WhatsApp</label>
                    <input type="tel" id="f-whatsapp" class="tg-input" placeholder="Ej: 1155667788">
                </div>
            </div>
            <button class="tg-btn" onclick="TG13.saveContact()">VER MI RESULTADO</button>
        </div>
    </div>

    <!-- RESULTADO -->
    <div id="screen-result" class="tg-screen">
        <div id="result-content"></div>
    </div>

    <!-- MICRO COMPROMISO: MENSAJE PREVIEW -->
    <div id="screen-preview" class="tg-screen">
        <div id="preview-content"></div>
    </div>

</div>

<!-- PROGRESO -->
<div class="tg-progress" id="tg-progress">
    <div class="tg-progress-inner">
        <span class="tg-progress-label" id="progress-label">Preparando...</span>
        <div class="tg-progress-bar">
            <div class="tg-progress-fill" id="progress-fill"></div>
        </div>
    </div>
</div>

<!-- AUDIO CONTROL -->
<div class="tg-audio-control" id="tg-audio-control" style="display:none;">
    <button class="tg-audio-btn" id="audio-toggle" onclick="TG13.toggleAudio()"><span class="audio-icon-on">♫</span></button>
    <span class="tg-audio-label">Música</span>
</div>

<!-- AUDIO ELEMENT -->
<audio id="tg-audio" loop>
    <source src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/Raices-y-Agua-Interior.mp3" type="audio/mpeg">
</audio>

</div>

<script>
(function() {
    'use strict';

    // ==================== PROTECCIÓN ELEMENTOR ====================
    (function protegerContenedor() {
        var app = document.getElementById('tg-app');
        if (!app) return;
        var parent = app.parentElement;
        while (parent && parent !== document.body) {
            var classes = parent.className || '';
            if (classes.indexOf('elementor-shortcode') > -1 ||
                classes.indexOf('elementor-widget') > -1 ||
                classes.indexOf('elementor-element') > -1) {
                parent.style.cssText = 'display: block !important; min-height: 100vh !important; visibility: visible !important; opacity: 1 !important;';
            }
            parent = parent.parentElement;
        }
    })();

    var API = 'https://duendes-vercel.vercel.app/api';
    var TOTAL_Q = 12;

    var TG13 = {
        step: 0,
        data: { identity: {}, answers: {}, contact: {}, perfil: null },
        sliderValue: 5,
        products: [],
        startTime: null,
        audioPlaying: false
    };

    // ==================== PREGUNTAS ====================
    var QUESTIONS = [
        { id: 1, block: 'ESPEJO', type: 'select', text: 'Hay personas que sienten que cargan con más de lo que les corresponde. Otras sienten que la vida les debe algo. ¿Cuál te suena más?',
          options: [
            { id: 'carga', text: 'Cargo con todo y nadie me cuida a mí', categoria: 'proteccion', dolor: 'relaciones', dolorTag: 'carga_emocional' },
            { id: 'esquiva', text: 'Las cosas buenas siempre le pasan a otros', categoria: 'abundancia', dolor: 'dinero', dolorTag: 'mala_suerte' },
            { id: 'vacio', text: 'Tengo todo pero siento un vacío', categoria: 'sanacion', dolor: 'proposito', dolorTag: 'vacio_existencial' },
            { id: 'estancada', text: 'Sé que puedo más pero algo me frena', categoria: 'transformacion', dolor: 'proposito', dolorTag: 'bloqueo' }
          ]
        },
        { id: 2, block: 'MOMENTO', type: 'select', text: '¿En qué momento estás ahora?',
          options: [
            { id: 'crisis', text: 'Atravesando algo difícil', momento: 'crisis', urgencia: 90 },
            { id: 'transicion', text: 'Cerrando un ciclo, abriendo otro', momento: 'transicion', urgencia: 60 },
            { id: 'busqueda', text: 'Buscando algo más, no sé qué', momento: 'busqueda', urgencia: 40 },
            { id: 'estable', text: 'Estable, pero quiero potenciar algo', momento: 'estable', urgencia: 20 }
          ]
        },
        { id: 3, block: 'ESPEJO', type: 'select', text: '¿Cuál de estas frases podrías haber dicho vos?',
          options: [
            { id: 'fuerte', text: '"Estoy cansada de ser la fuerte para todos"', arquetipo: 'protectora_agotada', categoria: 'proteccion' },
            { id: 'merece', text: '"A veces siento que no merezco cosas buenas"', arquetipo: 'autoestima_baja', categoria: 'sanacion' },
            { id: 'repite', text: '"Siempre termino en el mismo lugar"', arquetipo: 'patron_repetido', categoria: 'transformacion' },
            { id: 'tarde', text: '"Siento que llego tarde a todo"', arquetipo: 'ansiosa', categoria: 'proteccion' }
          ]
        },
        { id: 4, block: 'BÚSQUEDA', type: 'select', text: 'Si un ser mágico pudiera ayudarte con UNA cosa, ¿cuál elegirías?',
          options: [
            { id: 'proteger', text: 'Que me proteja y cuide mi energía', categoria: 'proteccion', intencion: 'proteccion' },
            { id: 'suerte', text: 'Que me traiga suerte y oportunidades', categoria: 'abundancia', intencion: 'abundancia' },
            { id: 'sanar', text: 'Que me ayude a soltar y sanar', categoria: 'sanacion', intencion: 'sanacion' },
            { id: 'amor', text: 'Que abra mi corazón al amor', categoria: 'amor', intencion: 'amor' }
          ]
        },
        { id: 5, block: 'PROFUNDO', type: 'text', text: 'Si pudieras contarle a alguien lo que de verdad te pesa... ¿qué le dirías?', placeholder: 'No hay respuesta incorrecta. Escribí lo que sientas...' },
        { id: 6, block: 'EXPERIENCIA', type: 'select', text: '¿Tenés experiencia con objetos o seres que te acompañen espiritualmente?',
          options: [
            { id: 'si_varios', text: 'Sí, tengo varios y me encantan', experiencia: 'alta', perfilCompra: 'coleccionista', poderAdq: 80 },
            { id: 'si_uno', text: 'Tengo algo pero quiero más', experiencia: 'media', perfilCompra: 'expansion', poderAdq: 60 },
            { id: 'no_pero', text: 'No, pero siempre me llamó la atención', experiencia: 'baja', perfilCompra: 'primera_vez', poderAdq: 40 },
            { id: 'esceptica', text: 'Soy escéptica pero algo me trajo acá', experiencia: 'ninguna', perfilCompra: 'esceptico_curioso', poderAdq: 50 }
          ]
        },
        { id: 7, block: 'ESTILO', type: 'select', text: '¿Cómo preferís que te hablen?',
          options: [
            { id: 'directo', text: 'Directo, sin vueltas', estilo: 'directo' },
            { id: 'suave', text: 'Suave y contenedor', estilo: 'suave' },
            { id: 'poetico', text: 'Poético y profundo', estilo: 'mistico' },
            { id: 'practico', text: 'Práctico, con acciones claras', estilo: 'practico' }
          ]
        },
        { id: 8, block: 'BLOQUEO', type: 'select', text: '¿Qué te frena más cuando algo te interesa?',
          options: [
            { id: 'que_diran', text: 'El qué dirán / qué van a pensar', bloqueo: 'social', estiloDecision: 'emocional' },
            { id: 'dinero', text: 'No tener la plata en este momento', bloqueo: 'economico', estiloDecision: 'racional', poderAdqMod: -20 },
            { id: 'tiempo', text: 'No tener tiempo para dedicarle', bloqueo: 'tiempo', estiloDecision: 'analitico' },
            { id: 'funciona', text: 'No saber si realmente funciona', bloqueo: 'escepticismo', estiloDecision: 'analitico' }
          ]
        },
        { id: 9, block: 'DECISIÓN', type: 'select', text: 'Cuando algo te interesa de verdad, ¿qué hacés?',
          options: [
            { id: 'enseguida', text: 'Lo compro/hago enseguida', decision: 'impulsivo', velocidad: 'rapido' },
            { id: 'pienso_dias', text: 'Lo pienso unos días', decision: 'analitico', velocidad: 'medio' },
            { id: 'consulto', text: 'Lo consulto con alguien', decision: 'emocional', velocidad: 'lento' },
            { id: 'investigo', text: 'Investigo todo antes', decision: 'analitico', velocidad: 'lento' }
          ]
        },
        { id: 10, block: 'CREENCIAS', type: 'escala', text: '¿Creés en la energía de los objetos?',
          options: [
            { id: 'totalmente', text: 'Totalmente', creencia: 'creyente', apertura: 90 },
            { id: 'a_veces', text: 'A veces sí, a veces no', creencia: 'buscador', apertura: 60 },
            { id: 'no_mucho', text: 'No mucho, pero algo hay', creencia: 'esceptico_curioso', apertura: 35 },
            { id: 'para_nada', text: 'Para nada', creencia: 'esceptico', apertura: 10 }
          ]
        },
        { id: 11, block: 'INTENSIDAD', type: 'slider', text: '¿Cuánto estás sufriendo ahora mismo?', min: 1, max: 10, minLabel: 'Tranquila', maxLabel: 'Mucho' },
        { id: 12, block: 'DURACIÓN', type: 'select', text: 'Última: ¿hace cuánto te sentís así?',
          options: [
            { id: 'dias', text: 'Hace días', duracion: 'dias', cronicidad: 10 },
            { id: 'semanas', text: 'Hace semanas', duracion: 'semanas', cronicidad: 30 },
            { id: 'meses', text: 'Hace meses', duracion: 'meses', cronicidad: 60 },
            { id: 'anios', text: 'Hace años', duracion: 'anios', cronicidad: 90 }
          ]
        }
    ];

    // ==================== HOOKS POR PERFIL ====================
    var HOOKS = {
        vulnerable: [
            "Sé que el cansancio pesa. Este guardián apareció para quienes ya no pueden más.",
            "No tenés que seguir cargando todo. Vino a sostenerte.",
            "Algo en vos pidió ayuda. Por eso estás acá."
        ],
        esceptico: [
            "No te voy a pedir que creas nada. Solo que observes qué sentís al ver esto.",
            "No importa si creés o no. Lo que importa es si algo resonó.",
            "Los guardianes no necesitan que creas en ellos. Ya saben."
        ],
        impulsivo: [
            "Algo te trajo acá. No lo pienses demasiado.",
            "Cuando algo es para vos, lo sentís. ¿Lo sentiste?",
            "El momento es ahora. Después se complica."
        ],
        racional: [
            "Miles de personas encontraron algo real en estos guardianes. Los testimonios hablan.",
            "No es magia inexplicable. Es conexión. Y la conexión se siente.",
            "Podés analizarlo todo. O podés probarlo y ver qué pasa."
        ],
        coleccionista: [
            "Este guardián completa algo que ya empezaste a construir.",
            "Los guardianes trabajan mejor en comunidad. El tuyo te está esperando.",
            "Hay colecciones que cuentan historias. ¿Cuál es la tuya?"
        ]
    };

    // ==================== TESTIMONIOS ====================
    var TESTIMONIOS = {
        vulnerable: { texto: "Llegué sin creer en nada. Mi guardián no me salvó, pero me acompañó. Y a veces eso es todo lo que necesitamos.", autor: "M.R., 34 años" },
        esceptico: { texto: "Yo tampoco creía. Lo compré por curiosidad. Ahora tengo tres y no sé explicar por qué, pero algo cambió.", autor: "L.S., 29 años" },
        impulsivo: { texto: "Lo vi, lo sentí, lo compré. Mejor decisión del año. A veces hay que hacerle caso a la intuición.", autor: "C.M., 41 años" },
        racional: { texto: "Investigué todo antes de comprarlo. Los testimonios me convencieron. Después de tenerlo, entendí por qué.", autor: "V.G., 38 años" },
        economico: { texto: "Junté de a poco durante dos meses. Valió cada peso. Hay cosas en las que vale la pena invertir.", autor: "S.P., 26 años" }
    };

    // ==================== OBJECIONES ====================
    var OBJECIONES = {
        esceptico: { pregunta: "¿Es solo un muñeco?", respuesta: "Sé que una parte tuya está diciendo eso. Esa parte te protegió mucho tiempo. Pero ya no la necesitás acá." },
        economico: { pregunta: "¿El precio?", respuesta: "¿Cuánto gastaste en cosas que no cambiaron nada? Esto es una inversión en vos." },
        tiempo: { pregunta: "¿Y si no tengo tiempo?", respuesta: "Un guardián no pide tiempo. Pide presencia. Y eso podés darlo en un minuto al día." },
        funciona: { pregunta: "¿Realmente funciona?", respuesta: "Funcionó para miles. Pero la única forma de saberlo es probarlo vos misma." }
    };

    // ==================== SINCRONICIDADES ====================
    var DIAS_SEMANA = {
        0: { nombre: 'domingo', mensaje: 'El domingo es el día del sol, de nuevos comienzos. No es casualidad que estés acá hoy.' },
        1: { nombre: 'lunes', mensaje: 'El lunes es el día de la luna, de la intuición. Tu instinto te trajo hasta acá.' },
        2: { nombre: 'martes', mensaje: 'El martes es el día de Marte, de la acción. Hoy es día de decidir.' },
        3: { nombre: 'miércoles', mensaje: 'El miércoles es el día de Mercurio, de la comunicación. Los guardianes te están hablando.' },
        4: { nombre: 'jueves', mensaje: 'El jueves es el día de Júpiter, de la expansión. Algo grande se está abriendo para vos.' },
        5: { nombre: 'viernes', mensaje: 'El viernes es el día de Venus, del amor. El guardián que te elige, te elige con amor.' },
        6: { nombre: 'sábado', mensaje: 'El sábado es el día de Saturno, de la estructura. Es momento de construir algo sólido.' }
    };

    // ==================== FUNCIONES AUXILIARES ====================
    function show(id) {
        document.querySelectorAll('.tg-screen').forEach(function(s) { s.classList.remove('active'); });
        var el = document.getElementById('screen-' + id);
        if (el) el.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function progress(step, total) {
        var pct = Math.round((step / total) * 100);
        var fill = document.getElementById('progress-fill');
        var label = document.getElementById('progress-label');
        if (fill) fill.style.width = pct + '%';
        if (label) {
            if (step === 0) label.textContent = 'Preparando el portal...';
            else if (step <= total) label.textContent = 'Pregunta ' + step + ' de ' + total;
            else label.textContent = 'Procesando...';
        }
    }

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // ==================== AUDIO ====================
    TG13.toggleAudio = function() {
        var audio = document.getElementById('tg-audio');
        var btn = document.getElementById('audio-toggle');
        if (TG13.audioPlaying) {
            audio.pause();
            btn.innerHTML = '♪';
            TG13.audioPlaying = false;
        } else {
            audio.play().catch(function() {});
            btn.innerHTML = '♫';
            TG13.audioPlaying = true;
        }
    };

    // ==================== ACTIVAR FRECUENCIA ====================
    TG13.activarFrecuencia = function() {
        // Mostrar control de audio e intentar reproducir
        document.getElementById('tg-audio-control').style.display = 'flex';
        var audio = document.getElementById('tg-audio');
        audio.volume = 0.3;
        audio.play().then(function() {
            TG13.audioPlaying = true;
            document.getElementById('audio-toggle').innerHTML = '♫';
        }).catch(function() {
            // Si no puede autoplay, el usuario puede activarlo manualmente
            TG13.audioPlaying = false;
            document.getElementById('audio-toggle').innerHTML = '♪';
        });

        // Ir a pantalla elegidos
        show('elegidos');
    };

    // ==================== CÁLCULO DE PERFIL ====================
    TG13.calcularPerfil = function() {
        var r = TG13.data.answers;
        var perfil = {
            vulnerabilidad: { score: 0, nivel: 'baja' },
            dolor_principal: { tipo: 'proposito', intensidad: 50 },
            estilo_decision: { tipo: 'emocional' },
            creencias: { tipo: 'buscador', apertura: 50 },
            poder_adquisitivo: { score: 50, nivel: 'medio' },
            perfil_cierre: 'vulnerable',
            categorias_match: [],
            urgencia: 50
        };

        var vulnScore = 0;
        if (r[2]) {
            vulnScore += r[2].urgencia || 0;
            perfil.urgencia = r[2].urgencia || 50;
        }
        var sufrimiento = (r[11] && r[11].valor) ? r[11].valor : 5;
        vulnScore += sufrimiento * 5;
        if (r[12]) vulnScore += r[12].cronicidad || 0;
        perfil.vulnerabilidad.score = Math.min(100, vulnScore);
        perfil.vulnerabilidad.nivel = vulnScore > 70 ? 'alta' : vulnScore > 40 ? 'media' : 'baja';

        if (r[1] && r[1].dolor) {
            perfil.dolor_principal.tipo = r[1].dolor;
            perfil.dolor_principal.intensidad = sufrimiento * 10;
        }

        var cats = {};
        [1, 3, 4].forEach(function(qid) {
            if (r[qid] && r[qid].categoria) {
                cats[r[qid].categoria] = (cats[r[qid].categoria] || 0) + 1;
            }
        });
        perfil.categorias_match = Object.keys(cats).sort(function(a, b) { return cats[b] - cats[a]; });

        if (r[9] && r[9].decision) {
            perfil.estilo_decision.tipo = r[9].decision;
        }

        if (r[10]) {
            perfil.creencias.tipo = r[10].creencia || 'buscador';
            perfil.creencias.apertura = r[10].apertura || 50;
        }

        var poderBase = 50;
        if (r[6] && r[6].poderAdq) poderBase = r[6].poderAdq;
        if (r[8] && r[8].poderAdqMod) poderBase += r[8].poderAdqMod;
        perfil.poder_adquisitivo.score = Math.max(0, Math.min(100, poderBase));
        perfil.poder_adquisitivo.nivel = poderBase > 60 ? 'alto' : poderBase > 35 ? 'medio' : 'bajo';

        if (perfil.vulnerabilidad.nivel === 'alta') {
            perfil.perfil_cierre = 'vulnerable';
        } else if (perfil.creencias.tipo === 'esceptico' || perfil.creencias.apertura < 30) {
            perfil.perfil_cierre = 'esceptico';
        } else if (perfil.estilo_decision.tipo === 'impulsivo') {
            perfil.perfil_cierre = 'impulsivo';
        } else if (perfil.estilo_decision.tipo === 'analitico') {
            perfil.perfil_cierre = 'racional';
        } else if (r[6] && r[6].perfilCompra === 'coleccionista') {
            perfil.perfil_cierre = 'coleccionista';
        }

        if (r[8] && r[8].bloqueo) {
            perfil.bloqueo_principal = r[8].bloqueo;
        }

        return perfil;
    };

    // ==================== MATCHING DE GUARDIANES ====================
    TG13.matchGuardianes = function(perfil) {
        var productos = TG13.products.filter(function(p) { return p.imagen; });

        if (productos.length < 3) {
            return [
                { nombre: 'Guardián Principal', match: 92, url: 'https://duendesdeluruguay.com/shop/', categoria: perfil.categorias_match[0] || 'proteccion', imagen: null },
                { nombre: 'Guardián Secundario', match: 78, url: 'https://duendesdeluruguay.com/shop/', categoria: perfil.categorias_match[1] || 'sanacion', imagen: null },
                { nombre: 'Guardián Terciario', match: 65, url: 'https://duendesdeluruguay.com/shop/', categoria: perfil.categorias_match[0] || 'proteccion', imagen: null }
            ];
        }

        var scored = productos.map(function(p) {
            var score = 50;
            var catProd = (p.categoria || '').toLowerCase();

            if (perfil.categorias_match[0] && catProd.indexOf(perfil.categorias_match[0]) !== -1) {
                score += 35;
            } else if (perfil.categorias_match[1] && catProd.indexOf(perfil.categorias_match[1]) !== -1) {
                score += 25;
            }

            if (perfil.urgencia > 70) score += 10;
            score += Math.floor(Math.random() * 10) - 5;

            return {
                nombre: p.nombre,
                imagen: p.imagen,
                url: p.url,
                categoria: p.categoria,
                match: Math.min(98, Math.max(55, score))
            };
        });

        scored.sort(function(a, b) { return b.match - a.match; });
        return scored.slice(0, 3);
    };

    // ==================== SINCRONICIDAD ====================
    TG13.generarSincronicidad = function() {
        var sincros = [];
        var nombre = TG13.data.identity.nombre || '';
        var nacimiento = TG13.data.identity.nacimiento;
        var hoy = new Date();
        var diaSemana = hoy.getDay();

        sincros.push({ tipo: 'dia', icono: '◈', texto: DIAS_SEMANA[diaSemana].mensaje });

        if (nombre.length === 5 || nombre.length === 7) {
            sincros.push({ tipo: 'nombre', icono: '◇', texto: 'Tu nombre tiene ' + nombre.length + ' letras. El ' + nombre.length + ' es el número de la transformación. No es casualidad.' });
        }

        if (nacimiento) {
            var nac = new Date(nacimiento);
            var mesNac = nac.getMonth();
            var mesHoy = hoy.getMonth();
            if (mesNac === mesHoy) {
                sincros.push({ tipo: 'cumple', icono: '✦', texto: 'Este es tu mes. Los guardianes que aparecen cerca de tu cumpleaños vienen con mensajes especiales.' });
            }
        }

        return getRandomItem(sincros);
    };

    // ==================== NAVEGACIÓN ====================
    TG13.start = function() {
        TG13.startTime = Date.now();
        show('intro');
    };

    TG13.goIdentity = function() { show('identity'); };

    TG13.saveIdentity = function() {
        var nombre = document.getElementById('f-nombre').value.trim();
        var pais = document.getElementById('f-pais').value;
        if (!nombre || !pais) { alert('Por favor completá nombre y país.'); return; }
        TG13.data.identity = {
            nombre: nombre,
            nacimiento: document.getElementById('f-nacimiento').value,
            pais: pais
        };
        TG13.step = 1;
        TG13.showQuestion();
    };

    TG13.showQuestion = function() {
        progress(TG13.step, TOTAL_Q);

        if (TG13.step > TOTAL_Q) {
            show('contact');
            return;
        }

        var q = QUESTIONS[TG13.step - 1];
        if (!q) { show('contact'); return; }

        document.getElementById('q-block').textContent = q.block;
        document.getElementById('q-text').textContent = q.text;

        document.getElementById('q-options').style.display = 'none';
        document.getElementById('q-escala').style.display = 'none';
        document.getElementById('q-slider').style.display = 'none';
        document.getElementById('q-textarea').style.display = 'none';
        document.getElementById('q-options').innerHTML = '';
        document.getElementById('q-escala').innerHTML = '';

        if (q.type === 'select') {
            var optionsEl = document.getElementById('q-options');
            optionsEl.style.display = 'flex';
            q.options.forEach(function(opt) {
                var div = document.createElement('div');
                div.className = 'tg-option';
                div.innerHTML = '<span class="tg-option-dot"></span><span class="tg-option-text">' + opt.text + '</span>';
                div.onclick = function() { TG13.answer(q.id, opt); };
                optionsEl.appendChild(div);
            });
        } else if (q.type === 'escala') {
            var escalaEl = document.getElementById('q-escala');
            escalaEl.style.display = 'grid';
            q.options.forEach(function(opt) {
                var btn = document.createElement('button');
                btn.className = 'tg-escala-btn';
                btn.textContent = opt.text;
                btn.onclick = function() { TG13.answer(q.id, opt); };
                escalaEl.appendChild(btn);
            });
        } else if (q.type === 'slider') {
            var sliderWrap = document.getElementById('q-slider');
            sliderWrap.style.display = 'block';
            document.getElementById('slider-min').textContent = q.minLabel || '1';
            document.getElementById('slider-max').textContent = q.maxLabel || '10';
            var sliderInput = document.getElementById('slider-input');
            sliderInput.value = 5;
            TG13.sliderValue = 5;
            document.getElementById('slider-value').textContent = '5';
            sliderInput.oninput = function() {
                TG13.sliderValue = parseInt(this.value);
                document.getElementById('slider-value').textContent = this.value;
            };
            sliderInput.dataset.qid = q.id;
        } else if (q.type === 'text') {
            document.getElementById('q-textarea').style.display = 'block';
            var input = document.getElementById('q-input');
            input.value = '';
            input.placeholder = q.placeholder || 'Escribí lo que sientas...';
            input.dataset.qid = q.id;
            setTimeout(function() { input.focus(); }, 100);
        }

        show('question');
    };

    TG13.answer = function(qid, optionData) {
        TG13.data.answers[qid] = optionData;
        TG13.step++;
        TG13.showQuestion();
    };

    TG13.submitSlider = function() {
        var input = document.getElementById('slider-input');
        TG13.data.answers[input.dataset.qid] = { valor: TG13.sliderValue, tipo: 'escala_numerica' };
        TG13.step++;
        TG13.showQuestion();
    };

    TG13.submitText = function() {
        var input = document.getElementById('q-input');
        var text = input.value.trim();
        if (!text) { alert('Por favor escribí algo.'); return; }
        TG13.data.answers[input.dataset.qid] = { texto: text, tipo: 'texto_libre' };
        input.value = '';
        TG13.step++;
        TG13.showQuestion();
    };

    TG13.saveContact = function() {
        var email = document.getElementById('f-email').value.trim();
        if (!email) { alert('Por favor ingresá tu email.'); return; }
        TG13.data.contact = {
            email: email,
            prefijo: document.getElementById('f-prefijo').value,
            whatsapp: document.getElementById('f-whatsapp').value.trim()
        };
        show('loading');
        TG13.processResult();
    };

    // ==================== PROCESAR RESULTADO ====================
    TG13.processResult = function() {
        document.getElementById('loading-msg').textContent = 'Conectando con los guardianes...';

        setTimeout(function() {
            document.getElementById('loading-msg').textContent = 'Analizando tu perfil energético...';
        }, 1000);

        setTimeout(function() {
            document.getElementById('loading-msg').textContent = 'Buscando tu match perfecto...';
        }, 2000);

        var perfil = TG13.calcularPerfil();
        TG13.data.perfil = perfil;

        fetch(API + '/test-guardian', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TG13.data.contact.email,
                nombre: TG13.data.identity.nombre,
                respuestas: TG13.data.answers,
                perfil: perfil
            })
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            setTimeout(function() {
                TG13.renderResult(data, perfil);
            }, 1500);
        })
        .catch(function() {
            setTimeout(function() {
                TG13.renderResult({ success: false }, perfil);
            }, 1500);
        });
    };

    // ==================== RENDERIZAR RESULTADO ====================
    TG13.renderResult = function(apiData, perfil) {
        var nombre = TG13.data.identity.nombre;

        // USAR GUARDIANES DEL SERVIDOR si disponibles
        var guardianes;
        if (apiData.success && apiData.resultado && apiData.resultado.productosRecomendados && apiData.resultado.productosRecomendados.length > 0) {
            guardianes = apiData.resultado.productosRecomendados.map(function(p) {
                return {
                    id: p.id,
                    nombre: p.nombre || p.nombreCompleto,
                    imagen: p.imagen,
                    url: p.url,
                    match: p.matchScore,
                    categoria: p.categoria,
                    razon: p.razon,
                    esUnico: p.esUnico
                };
            });
            console.log('Usando matching del servidor:', guardianes.length, 'guardianes');
        } else {
            guardianes = TG13.matchGuardianes(perfil);
            console.log('Usando matching local (fallback)');
        }

        TG13.data.guardianesRecomendados = guardianes;

        if (apiData.resultado && apiData.resultado.perfilPsicologico) {
            perfil = Object.assign({}, perfil, apiData.resultado.perfilPsicologico);
            perfil.perfil_cierre = apiData.resultado.perfilCierre || perfil.perfil_cierre;
        }

        var sincro = TG13.generarSincronicidad();
        var hook = getRandomItem(HOOKS[perfil.perfil_cierre] || HOOKS.vulnerable);
        var testimonio = TESTIMONIOS[perfil.bloqueo_principal] || TESTIMONIOS[perfil.perfil_cierre] || TESTIMONIOS.vulnerable;
        var objecion = OBJECIONES[perfil.bloqueo_principal] || OBJECIONES.funciona;

        var html = '';

        // Título
        html += '<h1 class="tg-title">' + nombre + ', encontramos a tus guardianes</h1>';

        // Sincronicidad
        html += '<div class="tg-result-sincro">';
        html += '<div class="tg-sincro-icon">' + sincro.icono + '</div>';
        html += '<p class="tg-sincro-text">' + sincro.texto + '</p>';
        html += '</div>';

        // Guardianes con match real
        html += '<div class="tg-guardians-grid">';
        guardianes.forEach(function(g, i) {
            var isMain = i === 0;
            var cardClass = isMain ? 'main' : 'secondary';
            var imgSize = isMain ? 130 : 90;

            html += '<a href="' + (g.url || '#') + '" target="_blank" class="tg-guardian-card ' + cardClass + '">';
            html += '<div class="tg-guardian-img-wrap">';

            // MOSTRAR IMAGEN REAL O PLACEHOLDER ELEGANTE
            if (g.imagen) {
                html += '<img src="' + g.imagen + '" class="tg-guardian-img" style="width:' + imgSize + 'px;height:' + imgSize + 'px;" alt="' + g.nombre + '">';
            } else {
                // Placeholder elegante en lugar de círculo vacío
                html += '<div class="tg-guardian-placeholder" style="width:' + imgSize + 'px;height:' + imgSize + 'px;">';
                html += '<span class="tg-guardian-placeholder-text">' + (g.nombre ? g.nombre.charAt(0).toUpperCase() : 'G') + '</span>';
                html += '</div>';
            }

            html += '<span class="tg-guardian-match">' + g.match + '%</span>';
            html += '</div>';
            html += '<span class="tg-guardian-name">' + g.nombre + '</span>';
            if (g.categoria) {
                html += '<span class="tg-guardian-categoria">' + g.categoria + '</span>';
            }
            html += '</a>';
        });
        html += '</div>';

        // Escasez
        var viendo = Math.floor(Math.random() * 4) + 2;
        var diasDesde = Math.floor(Math.random() * 30) + 15;
        html += '<div class="tg-escasez-bar">';
        html += '<div class="tg-escasez-item"><span class="tg-escasez-dot"></span> ' + viendo + ' personas viendo esto ahora</div>';
        html += '<div class="tg-escasez-item"><span class="tg-escasez-dot verde"></span> Último similar vendido hace ' + diasDesde + ' días</div>';
        html += '</div>';

        // Hook adaptativo
        html += '<div class="tg-hook-box">';
        html += '<p class="tg-hook-text">' + hook + '</p>';
        html += '</div>';

        // Perfil energético
        html += '<div class="tg-perfil-card">';
        html += '<div class="tg-perfil-title">Tu Perfil Energético</div>';
        html += '<div class="tg-perfil-grid">';
        html += '<div class="tg-perfil-item"><div class="tg-perfil-label">Vulnerabilidad</div><div class="tg-perfil-value ' + perfil.vulnerabilidad.nivel + '">' + perfil.vulnerabilidad.nivel + '</div></div>';
        html += '<div class="tg-perfil-item"><div class="tg-perfil-label">Dolor principal</div><div class="tg-perfil-value">' + perfil.dolor_principal.tipo + '</div></div>';
        html += '<div class="tg-perfil-item"><div class="tg-perfil-label">Estilo decisión</div><div class="tg-perfil-value">' + perfil.estilo_decision.tipo + '</div></div>';
        html += '<div class="tg-perfil-item"><div class="tg-perfil-label">Creencias</div><div class="tg-perfil-value">' + perfil.creencias.tipo + '</div></div>';
        html += '</div></div>';

        // Objeción preemptiva
        html += '<div class="tg-objecion">';
        html += '<div class="tg-objecion-pregunta">"' + objecion.pregunta + '"</div>';
        html += '<div class="tg-objecion-respuesta">' + objecion.respuesta + '</div>';
        html += '</div>';

        // Testimonio
        html += '<div class="tg-testimonio">';
        html += '<p class="tg-testimonio-text">"' + testimonio.texto + '"</p>';
        html += '<span class="tg-testimonio-autor">— ' + testimonio.autor + '</span>';
        html += '</div>';

        // Email
        html += '<div class="tg-email-sent">Te enviamos el resultado completo a <strong>' + TG13.data.contact.email + '</strong></div>';

        // Micro-compromiso
        html += '<div class="tg-micro-step">';
        html += '<div class="tg-micro-title">¿Querés ver el mensaje que tiene para vos?</div>';
        html += '<div class="tg-micro-desc">Tu guardián principal ya tiene algo que decirte. Podés verlo antes de decidir.</div>';
        html += '<button class="tg-btn" onclick="TG13.showPreview()">VER MENSAJE</button>';
        html += '</div>';

        // CTA final
        html += '<p style="margin-top:30px;"><a href="https://duendesdeluruguay.com/shop/" class="tg-btn tg-btn-secondary" style="text-decoration:none;">IR DIRECTO A LA TIENDA</a></p>';

        document.getElementById('result-content').innerHTML = html;
        show('result');
        progress(TOTAL_Q + 1, TOTAL_Q);
    };

    // ==================== PREVIEW ====================
    TG13.showPreview = function() {
        var nombre = TG13.data.identity.nombre;
        var perfil = TG13.data.perfil;
        var guardianes = TG13.data.guardianesRecomendados || TG13.matchGuardianes(perfil);
        var guardian = guardianes[0];

        var mensajes = {
            vulnerable: nombre + ', sé que el cansancio pesa. Sé que cargaste más de lo que te tocaba. Vine a decirte que ya no tenés que hacerlo en soledad. Estoy acá.',
            esceptico: nombre + ', no necesito que creas en mí. Solo necesito que me des una oportunidad. Lo que pase después, lo decidís vos.',
            impulsivo: nombre + ', sentiste algo cuando me viste. No lo ignores. Eso que sentiste es real. Es tu intuición hablándote.',
            racional: nombre + ', puedo darte mil razones para que confíes. Pero la mejor razón sos vos. Escuchate.',
            coleccionista: nombre + ', hay guardianes que esperan su momento. Yo esperé el mío para llegar a vos. La colección se completa cuando el corazón lo siente.'
        };

        var mensaje = mensajes[perfil.perfil_cierre] || mensajes.vulnerable;

        var html = '';
        html += '<h1 class="tg-title">Mensaje de ' + guardian.nombre + '</h1>';

        html += '<div style="margin:30px 0;">';
        if (guardian.imagen) {
            html += '<img src="' + guardian.imagen + '" style="width:120px;height:120px;border-radius:50%;border:3px solid #FF0080;box-shadow:0 0 30px rgba(124,252,0,0.5);">';
        } else {
            html += '<div class="tg-guardian-placeholder" style="width:120px;height:120px;margin:0 auto;"><span class="tg-guardian-placeholder-text">' + guardian.nombre.charAt(0) + '</span></div>';
        }
        html += '</div>';

        html += '<div class="tg-hook-box" style="margin:30px 0;">';
        html += '<p class="tg-hook-text" style="font-size:19px;line-height:1.8;">"' + mensaje + '"</p>';
        html += '</div>';

        html += '<p class="tg-hint">Este es solo un adelanto. La canalización completa llega cuando lo adoptás.</p>';

        html += '<div style="margin-top:40px;">';
        html += '<a href="' + (guardian.url || 'https://duendesdeluruguay.com/shop/') + '" class="tg-btn" style="text-decoration:none;margin-bottom:15px;display:inline-block;">CONOCER A ' + guardian.nombre.toUpperCase() + '</a>';
        html += '<br><button class="tg-btn tg-btn-secondary" onclick="show(\'result\')" style="margin-top:15px;">VOLVER AL RESULTADO</button>';
        html += '</div>';

        document.getElementById('preview-content').innerHTML = html;
        show('preview');
    };

    // ==================== CARGAR PRODUCTOS ====================
    fetch(API + '/test-guardian/products')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data.success && data.products && data.products.length > 0) {
                TG13.products = data.products.map(function(p) {
                    return {
                        id: p.id,
                        nombre: p.nombre,
                        imagen: p.imagen,
                        url: p.url,
                        categoria: p.categoria || ''
                    };
                });
                console.log('Productos cargados:', TG13.products.length, 'con imagen:', TG13.products.filter(function(p) { return p.imagen; }).length);
            }
        })
        .catch(function(err) {
            console.log('Error cargando productos:', err);
        });

    window.TG13 = TG13;
    window.show = show;
    progress(0, TOTAL_Q);
})();
</script>
<!-- /TEST GUARDIAN v13 -->
<?php
    return ob_get_clean();
}

// Registrar shortcodes
add_shortcode('test_guardian_v13', 'duendes_test_guardian_v13_render');
add_shortcode('test_guardian', 'duendes_test_guardian_v13_render');
