<?php
/*
Plugin Name: Test Guardian v12 - Sistema Completo de Conversión
Description: Test del Guardian con perfilado psicológico + matching real + sincronicidades + escasez + hooks adaptativos
Version: 12.0
*/
if (!defined('ABSPATH')) exit;

function duendes_test_guardian_v12_render() {
    $v = '12.' . time();
    ob_start();
?>
<!-- TEST GUARDIAN v12 - SISTEMA COMPLETO DE CONVERSIÓN -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">

<div id="tg-app" data-v="<?php echo $v; ?>">

<style>
/* ======================================== BASE ======================================== */
#tg-app {
    display: block !important;
    width: 100% !important;
    min-height: 100vh !important;
    background: linear-gradient(180deg, #0a0a12 0%, #0d0d1a 50%, #0a0a12 100%) !important;
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
        radial-gradient(2px 2px at 20% 30%, rgba(212, 175, 55, 0.3), transparent),
        radial-gradient(2px 2px at 80% 20%, rgba(212, 175, 55, 0.2), transparent),
        radial-gradient(2px 2px at 40% 70%, rgba(212, 175, 55, 0.3), transparent);
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
    color: #d4af37 !important;
    margin: 0 0 25px 0 !important;
    text-shadow: 0 0 30px rgba(212, 175, 55, 0.4) !important;
    line-height: 1.3 !important;
}

.tg-subtitle {
    font-size: 19px !important;
    color: rgba(255, 255, 255, 0.85) !important;
    margin: 0 0 20px 0 !important;
    line-height: 1.7 !important;
}

.tg-hint {
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.5) !important;
    margin: 0 0 30px 0 !important;
    font-style: italic !important;
}

.tg-btn {
    display: inline-block !important;
    padding: 18px 45px !important;
    background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%) !important;
    border: none !important;
    border-radius: 50px !important;
    color: #0a0a12 !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
    cursor: pointer !important;
    transition: all 0.4s ease !important;
    box-shadow: 0 4px 25px rgba(212, 175, 55, 0.4) !important;
    font-family: 'Cinzel', serif !important;
}

.tg-btn:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 8px 35px rgba(212, 175, 55, 0.5) !important;
}

.tg-btn-secondary {
    background: transparent !important;
    border: 2px solid rgba(212, 175, 55, 0.5) !important;
    color: #d4af37 !important;
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
    color: #d4af37 !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    margin-bottom: 10px !important;
    font-family: 'Cinzel', serif !important;
}

.tg-input {
    width: 100% !important;
    padding: 15px 18px !important;
    background: rgba(212, 175, 55, 0.05) !important;
    border: 1px solid rgba(212, 175, 55, 0.3) !important;
    border-radius: 10px !important;
    color: #ffffff !important;
    font-size: 16px !important;
    font-family: inherit !important;
    transition: all 0.3s ease !important;
}

.tg-input:focus {
    outline: none !important;
    border-color: #d4af37 !important;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.15) !important;
}

.tg-input::placeholder { color: rgba(255, 255, 255, 0.35) !important; }

.tg-row {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 15px !important;
}

/* ======================================== PREGUNTAS ======================================== */
.tg-question-block {
    font-size: 11px !important;
    color: #d4af37 !important;
    text-transform: uppercase !important;
    letter-spacing: 4px !important;
    margin-bottom: 20px !important;
    font-family: 'Cinzel', serif !important;
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
    background: rgba(212, 175, 55, 0.03) !important;
    border: 1px solid rgba(212, 175, 55, 0.2) !important;
    border-radius: 10px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    text-align: left !important;
}

.tg-option:hover {
    background: rgba(212, 175, 55, 0.1) !important;
    border-color: #d4af37 !important;
    transform: translateX(8px) !important;
}

.tg-option-dot {
    width: 10px !important;
    height: 10px !important;
    background: #d4af37 !important;
    border-radius: 50% !important;
    flex-shrink: 0 !important;
}

.tg-option-text {
    font-size: 16px !important;
    color: rgba(255, 255, 255, 0.9) !important;
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
    background: rgba(212, 175, 55, 0.03) !important;
    border: 1px solid rgba(212, 175, 55, 0.2) !important;
    border-radius: 10px !important;
    color: rgba(255, 255, 255, 0.9) !important;
    font-size: 15px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    font-family: inherit !important;
}

.tg-escala-btn:hover {
    background: rgba(212, 175, 55, 0.12) !important;
    border-color: #d4af37 !important;
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
    color: rgba(255,255,255,0.5) !important;
    font-size: 13px !important;
    margin-bottom: 15px !important;
}

.tg-slider {
    -webkit-appearance: none !important;
    width: 100% !important;
    height: 8px !important;
    border-radius: 4px !important;
    background: linear-gradient(to right, #2d5a3d, #d4af37, #8b3a3a) !important;
    outline: none !important;
}

.tg-slider::-webkit-slider-thumb {
    -webkit-appearance: none !important;
    width: 28px !important;
    height: 28px !important;
    border-radius: 50% !important;
    background: #d4af37 !important;
    cursor: pointer !important;
    border: 3px solid #fff !important;
    box-shadow: 0 3px 12px rgba(212,175,55,0.5) !important;
}

.tg-slider-value {
    font-size: 48px !important;
    font-weight: 700 !important;
    color: #d4af37 !important;
    font-family: 'Cinzel Decorative', serif !important;
    margin: 20px 0 !important;
    text-shadow: 0 0 25px rgba(212,175,55,0.4) !important;
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
    background: rgba(212, 175, 55, 0.03) !important;
    border: 1px solid rgba(212, 175, 55, 0.25) !important;
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
    border-color: #d4af37 !important;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.12) !important;
}

.tg-textarea::placeholder { color: rgba(255, 255, 255, 0.3) !important; }

.tg-textarea-hint {
    font-size: 13px !important;
    color: rgba(255, 255, 255, 0.4) !important;
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
    border: 3px solid rgba(212, 175, 55, 0.2) !important;
    border-top-color: #d4af37 !important;
    border-radius: 50% !important;
    animation: spin 1s linear infinite !important;
    margin-bottom: 25px !important;
}

@keyframes spin { to { transform: rotate(360deg); } }

.tg-loading-text {
    font-size: 18px !important;
    color: rgba(255, 255, 255, 0.8) !important;
}

/* ======================================== PROGRESO ======================================== */
.tg-progress {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    height: 55px !important;
    background: rgba(10, 10, 18, 0.95) !important;
    backdrop-filter: blur(10px) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 100 !important;
    border-top: 1px solid rgba(212, 175, 55, 0.2) !important;
}

.tg-progress-inner {
    width: 100% !important;
    max-width: 380px !important;
    text-align: center !important;
    padding: 0 20px !important;
}

.tg-progress-label {
    font-size: 11px !important;
    color: rgba(255, 255, 255, 0.5) !important;
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
    background: linear-gradient(90deg, #d4af37, #f4d03f) !important;
    border-radius: 2px !important;
    transition: width 0.5s ease !important;
    width: 0% !important;
}

/* ======================================== RESULTADO ======================================== */
.tg-result-sincro {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05)) !important;
    border: 1px solid rgba(212, 175, 55, 0.3) !important;
    border-radius: 12px !important;
    padding: 20px !important;
    margin: 25px 0 !important;
}

.tg-sincro-icon {
    font-size: 28px !important;
    margin-bottom: 10px !important;
}

.tg-sincro-text {
    font-size: 17px !important;
    color: #d4af37 !important;
    line-height: 1.6 !important;
    font-style: italic !important;
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
    background: rgba(212, 175, 55, 0.03) !important;
    border: 1px solid transparent !important;
}

.tg-guardian-card:hover {
    transform: translateY(-8px) scale(1.02) !important;
    border-color: rgba(212, 175, 55, 0.3) !important;
    background: rgba(212, 175, 55, 0.08) !important;
}

.tg-guardian-card.main {
    order: 0 !important;
    background: rgba(212, 175, 55, 0.08) !important;
    border-color: rgba(212, 175, 55, 0.25) !important;
}

.tg-guardian-img-wrap {
    position: relative !important;
    margin-bottom: 12px !important;
}

.tg-guardian-img {
    border-radius: 50% !important;
    object-fit: cover !important;
    border: 3px solid #d4af37 !important;
    box-shadow: 0 0 25px rgba(212, 175, 55, 0.35) !important;
}

.tg-guardian-card.main .tg-guardian-img { width: 130px !important; height: 130px !important; }
.tg-guardian-card.secondary .tg-guardian-img { width: 90px !important; height: 90px !important; border-color: rgba(212,175,55,0.5) !important; }

.tg-guardian-match {
    position: absolute !important;
    bottom: -8px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    background: #d4af37 !important;
    color: #0a0a12 !important;
    font-size: 12px !important;
    font-weight: bold !important;
    padding: 4px 12px !important;
    border-radius: 15px !important;
    font-family: 'Cinzel', serif !important;
}

.tg-guardian-name {
    font-family: 'Cinzel Decorative', serif !important;
    font-size: 15px !important;
    color: #fff !important;
    margin-top: 8px !important;
}

.tg-guardian-card.main .tg-guardian-name { font-size: 18px !important; color: #d4af37 !important; }

.tg-guardian-categoria {
    font-size: 11px !important;
    color: rgba(255,255,255,0.5) !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    margin-top: 4px !important;
}

/* ======================================== HOOK ADAPTATIVO ======================================== */
.tg-hook-box {
    background: rgba(255,255,255,0.03) !important;
    border-left: 3px solid #d4af37 !important;
    padding: 20px 25px !important;
    margin: 30px 0 !important;
    text-align: left !important;
}

.tg-hook-text {
    font-size: 18px !important;
    color: rgba(255,255,255,0.9) !important;
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

.tg-escasez-dot.gold { background: #d4af37 !important; }

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
}

/* ======================================== TESTIMONIOS ======================================== */
.tg-testimonio {
    background: rgba(255,255,255,0.02) !important;
    border: 1px solid rgba(212,175,55,0.15) !important;
    border-radius: 12px !important;
    padding: 20px !important;
    margin: 25px 0 !important;
    text-align: left !important;
}

.tg-testimonio-text {
    font-size: 15px !important;
    color: rgba(255,255,255,0.8) !important;
    line-height: 1.6 !important;
    font-style: italic !important;
    margin-bottom: 12px !important;
}

.tg-testimonio-autor {
    font-size: 13px !important;
    color: #d4af37 !important;
}

/* ======================================== OBJECIONES ======================================== */
.tg-objecion {
    background: rgba(212,175,55,0.05) !important;
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
    color: rgba(255,255,255,0.9) !important;
    line-height: 1.5 !important;
}

/* ======================================== MICRO-COMPROMISO ======================================== */
.tg-micro-step {
    background: rgba(212,175,55,0.08) !important;
    border: 1px solid rgba(212,175,55,0.25) !important;
    border-radius: 12px !important;
    padding: 25px !important;
    margin: 30px 0 !important;
}

.tg-micro-title {
    font-family: 'Cinzel', serif !important;
    font-size: 16px !important;
    color: #d4af37 !important;
    margin-bottom: 12px !important;
}

.tg-micro-desc {
    font-size: 15px !important;
    color: rgba(255,255,255,0.8) !important;
    line-height: 1.5 !important;
    margin-bottom: 18px !important;
}

/* ======================================== PERFIL CARD ======================================== */
.tg-perfil-card {
    background: rgba(255,255,255,0.02) !important;
    border: 1px solid rgba(212,175,55,0.2) !important;
    border-radius: 12px !important;
    padding: 20px !important;
    margin: 25px 0 !important;
}

.tg-perfil-title {
    font-size: 12px !important;
    color: #d4af37 !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    margin-bottom: 15px !important;
    font-family: 'Cinzel', serif !important;
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
.tg-perfil-value.media { color: #d4af37 !important; }
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
    color: rgba(255,255,255,0.85) !important;
    line-height: 1.9 !important;
    max-width: 480px !important;
    margin: 0 auto 40px !important;
}

.tg-highlight {
    font-family: 'Cinzel Decorative', serif !important;
    color: #d4af37 !important;
    font-weight: 700 !important;
    font-size: 28px !important;
    display: inline-block !important;
    text-shadow: 0 0 30px rgba(212, 175, 55, 0.4) !important;
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
}
</style>

<div class="tg-container">

    <!-- PANTALLA ELEGIDOS -->
    <div id="screen-elegidos" class="tg-screen active">
        <p class="tg-elegidos-text">
            Existen personas que fueron llamadas.<br>
            No por su nombre, sino por algo más profundo.<br><br>
            Los llaman <span class="tg-highlight">Los Elegidos</span>.<br><br>
            Son quienes cuidan de un guardián.<br>
            O quizás... son cuidados por él.
        </p>
        <button class="tg-btn" onclick="TG12.start()">DESCUBRIR SI SOY UNA</button>
    </div>

    <!-- INTRO -->
    <div id="screen-intro" class="tg-screen">
        <h1 class="tg-title">El portal está abierto</h1>
        <p class="tg-subtitle">No llegaste acá por casualidad.<br>Algo en vos buscaba esto.</p>
        <p class="tg-hint">12 preguntas · 3 minutos · Gratis</p>
        <button class="tg-btn" onclick="TG12.goIdentity()">COMENZAR</button>
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
            <button class="tg-btn" onclick="TG12.saveIdentity()">CONTINUAR</button>
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
            <button class="tg-btn" onclick="TG12.submitSlider()">CONFIRMAR</button>
        </div>
        <div id="q-textarea" class="tg-textarea-wrap" style="display:none;">
            <textarea id="q-input" class="tg-textarea" placeholder="Escribí lo que sientas..."></textarea>
            <p class="tg-textarea-hint">No hay respuesta incorrecta.</p>
            <button class="tg-btn" onclick="TG12.submitText()">CONTINUAR</button>
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
            <button class="tg-btn" onclick="TG12.saveContact()">VER MI RESULTADO</button>
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

</div>

<script>
(function() {
    'use strict';

    var API = 'https://duendes-vercel.vercel.app/api';
    var TOTAL_Q = 12;

    var TG12 = {
        step: 0,
        data: { identity: {}, answers: {}, contact: {}, perfil: null },
        sliderValue: 5,
        products: [],
        startTime: null
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
            "Sé que estás agotada. Este guardián apareció para los que ya no pueden más.",
            "No tenés que seguir cargando todo sola. Él vino a sostenerte.",
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

    // ==================== TESTIMONIOS POR PERFIL ====================
    var TESTIMONIOS = {
        vulnerable: {
            texto: "Llegué destrozada, sin creer en nada. Mi guardián no me salvó, pero me acompañó. Y a veces eso es todo lo que necesitamos.",
            autor: "Marina, 34 años"
        },
        esceptico: {
            texto: "Yo tampoco creía. Lo compré por curiosidad. Ahora tengo tres y no sé explicar por qué, pero algo cambió.",
            autor: "Lucía, 29 años"
        },
        impulsivo: {
            texto: "Lo vi, lo sentí, lo compré. Mejor decisión del año. A veces hay que hacerle caso a la intuición.",
            autor: "Carla, 41 años"
        },
        racional: {
            texto: "Investigué todo antes de comprarlo. Los testimonios me convencieron. Después de tenerlo, entendí por qué.",
            autor: "Valentina, 38 años"
        },
        economico: {
            texto: "Junté de a poco durante dos meses. Valió cada peso. Hay cosas en las que vale la pena invertir.",
            autor: "Sol, 26 años"
        }
    };

    // ==================== OBJECIONES PREEMPTIVAS ====================
    var OBJECIONES = {
        esceptico: {
            pregunta: "¿Es solo un muñeco?",
            respuesta: "Sé que una parte tuya está diciendo eso. Esa parte te protegió mucho tiempo. Pero ya no la necesitás acá."
        },
        economico: {
            pregunta: "¿El precio?",
            respuesta: "¿Cuánto gastaste en cosas que no cambiaron nada? Esto es una inversión en vos."
        },
        tiempo: {
            pregunta: "¿Y si no tengo tiempo?",
            respuesta: "Un guardián no pide tiempo. Pide presencia. Y eso podés darlo en un minuto al día."
        },
        funciona: {
            pregunta: "¿Realmente funciona?",
            respuesta: "Funcionó para miles. Pero la única forma de saberlo es probarlo vos misma."
        }
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

    // ==================== CÁLCULO DE PERFIL PSICOLÓGICO ====================
    TG12.calcularPerfil = function() {
        var r = TG12.data.answers;
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

        // Vulnerabilidad
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

        // Dolor principal
        if (r[1] && r[1].dolor) {
            perfil.dolor_principal.tipo = r[1].dolor;
            perfil.dolor_principal.intensidad = sufrimiento * 10;
        }

        // Categorías preferidas (para matching)
        var cats = {};
        [1, 3, 4].forEach(function(qid) {
            if (r[qid] && r[qid].categoria) {
                cats[r[qid].categoria] = (cats[r[qid].categoria] || 0) + 1;
            }
        });
        perfil.categorias_match = Object.keys(cats).sort(function(a, b) { return cats[b] - cats[a]; });

        // Estilo de decisión
        if (r[9] && r[9].decision) {
            perfil.estilo_decision.tipo = r[9].decision;
        }

        // Creencias
        if (r[10]) {
            perfil.creencias.tipo = r[10].creencia || 'buscador';
            perfil.creencias.apertura = r[10].apertura || 50;
        }

        // Poder adquisitivo
        var poderBase = 50;
        if (r[6] && r[6].poderAdq) poderBase = r[6].poderAdq;
        if (r[8] && r[8].poderAdqMod) poderBase += r[8].poderAdqMod;
        perfil.poder_adquisitivo.score = Math.max(0, Math.min(100, poderBase));
        perfil.poder_adquisitivo.nivel = poderBase > 60 ? 'alto' : poderBase > 35 ? 'medio' : 'bajo';

        // Perfil de cierre
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

        // Bloqueo principal (para objeciones)
        if (r[8] && r[8].bloqueo) {
            perfil.bloqueo_principal = r[8].bloqueo;
        }

        return perfil;
    };

    // ==================== MATCHING DE GUARDIANES ====================
    TG12.matchGuardianes = function(perfil) {
        var productos = TG12.products.length > 0 ? TG12.products : [];
        if (productos.length < 3) {
            // Fallback
            return [
                { nombre: 'Guardián Principal', match: 92, url: 'https://duendesdeluruguay.com/shop/', categoria: perfil.categorias_match[0] || 'proteccion' },
                { nombre: 'Guardián Secundario', match: 78, url: 'https://duendesdeluruguay.com/shop/', categoria: perfil.categorias_match[1] || 'sanacion' },
                { nombre: 'Guardián Terciario', match: 65, url: 'https://duendesdeluruguay.com/shop/', categoria: perfil.categorias_match[0] || 'proteccion' }
            ];
        }

        // Calcular match real basado en categorías
        var scored = productos.map(function(p) {
            var score = 50; // base
            var catProd = (p.categoria || '').toLowerCase();

            // Match por categoría principal
            if (perfil.categorias_match[0] && catProd.indexOf(perfil.categorias_match[0]) !== -1) {
                score += 35;
            } else if (perfil.categorias_match[1] && catProd.indexOf(perfil.categorias_match[1]) !== -1) {
                score += 25;
            }

            // Boost por urgencia
            if (perfil.urgencia > 70) score += 10;

            // Variación para que no sean todos iguales
            score += Math.floor(Math.random() * 10) - 5;

            return {
                nombre: p.nombre,
                imagen: p.imagen,
                url: p.url,
                categoria: p.categoria,
                match: Math.min(98, Math.max(55, score))
            };
        });

        // Ordenar por match y tomar top 3
        scored.sort(function(a, b) { return b.match - a.match; });
        return scored.slice(0, 3);
    };

    // ==================== GENERAR SINCRONICIDAD ====================
    TG12.generarSincronicidad = function() {
        var sincros = [];
        var nombre = TG12.data.identity.nombre || '';
        var nacimiento = TG12.data.identity.nacimiento;
        var hoy = new Date();
        var diaSemana = hoy.getDay();

        // Sincro por día de la semana
        sincros.push({
            tipo: 'dia',
            icono: '✨',
            texto: DIAS_SEMANA[diaSemana].mensaje
        });

        // Sincro por nombre (si tiene longitud especial)
        if (nombre.length === 5 || nombre.length === 7) {
            sincros.push({
                tipo: 'nombre',
                icono: '🔮',
                texto: 'Tu nombre tiene ' + nombre.length + ' letras. El ' + nombre.length + ' es el número de la transformación. No es casualidad.'
            });
        }

        // Sincro por cumpleaños cercano
        if (nacimiento) {
            var nac = new Date(nacimiento);
            var mesNac = nac.getMonth();
            var mesHoy = hoy.getMonth();
            if (mesNac === mesHoy) {
                sincros.push({
                    tipo: 'cumple',
                    icono: '🌟',
                    texto: 'Este es tu mes. Los guardianes que aparecen cerca de tu cumpleaños vienen con mensajes especiales.'
                });
            } else if ((mesNac === mesHoy + 1) || (mesHoy === 11 && mesNac === 0)) {
                sincros.push({
                    tipo: 'cumple',
                    icono: '🌙',
                    texto: 'Tu cumpleaños se acerca. Este es el momento en que los portales se abren más fácil para vos.'
                });
            }
        }

        // Sincro por hora
        var hora = hoy.getHours();
        if (hora >= 0 && hora < 5) {
            sincros.push({
                tipo: 'hora',
                icono: '🌌',
                texto: 'Estás acá en las horas más silenciosas. Es cuando mejor se escucha a los guardianes.'
            });
        } else if (hora >= 22 || hora < 1) {
            sincros.push({
                tipo: 'hora',
                icono: '🌙',
                texto: 'La noche es el momento de la introspección. Tu guardián te habla más claro ahora.'
            });
        }

        // Retornar una random de las disponibles
        return getRandomItem(sincros);
    };

    // ==================== NAVEGACIÓN ====================
    TG12.start = function() {
        TG12.startTime = Date.now();
        show('intro');
    };

    TG12.goIdentity = function() { show('identity'); };

    TG12.saveIdentity = function() {
        var nombre = document.getElementById('f-nombre').value.trim();
        var pais = document.getElementById('f-pais').value;
        if (!nombre || !pais) { alert('Por favor completá nombre y país.'); return; }
        TG12.data.identity = {
            nombre: nombre,
            nacimiento: document.getElementById('f-nacimiento').value,
            pais: pais
        };
        TG12.step = 1;
        TG12.showQuestion();
    };

    TG12.showQuestion = function() {
        progress(TG12.step, TOTAL_Q);

        if (TG12.step > TOTAL_Q) {
            show('contact');
            return;
        }

        var q = QUESTIONS[TG12.step - 1];
        if (!q) { show('contact'); return; }

        document.getElementById('q-block').textContent = q.block;
        document.getElementById('q-text').textContent = q.text;

        // Ocultar todos
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
                div.onclick = function() { TG12.answer(q.id, opt); };
                optionsEl.appendChild(div);
            });
        } else if (q.type === 'escala') {
            var escalaEl = document.getElementById('q-escala');
            escalaEl.style.display = 'grid';
            q.options.forEach(function(opt) {
                var btn = document.createElement('button');
                btn.className = 'tg-escala-btn';
                btn.textContent = opt.text;
                btn.onclick = function() { TG12.answer(q.id, opt); };
                escalaEl.appendChild(btn);
            });
        } else if (q.type === 'slider') {
            var sliderWrap = document.getElementById('q-slider');
            sliderWrap.style.display = 'block';
            document.getElementById('slider-min').textContent = q.minLabel || '1';
            document.getElementById('slider-max').textContent = q.maxLabel || '10';
            var sliderInput = document.getElementById('slider-input');
            sliderInput.value = 5;
            TG12.sliderValue = 5;
            document.getElementById('slider-value').textContent = '5';
            sliderInput.oninput = function() {
                TG12.sliderValue = parseInt(this.value);
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

    TG12.answer = function(qid, optionData) {
        TG12.data.answers[qid] = optionData;
        TG12.step++;
        TG12.showQuestion();
    };

    TG12.submitSlider = function() {
        var input = document.getElementById('slider-input');
        TG12.data.answers[input.dataset.qid] = { valor: TG12.sliderValue, tipo: 'escala_numerica' };
        TG12.step++;
        TG12.showQuestion();
    };

    TG12.submitText = function() {
        var input = document.getElementById('q-input');
        var text = input.value.trim();
        if (!text) { alert('Por favor escribí algo.'); return; }
        TG12.data.answers[input.dataset.qid] = { texto: text, tipo: 'texto_libre' };
        input.value = '';
        TG12.step++;
        TG12.showQuestion();
    };

    TG12.saveContact = function() {
        var email = document.getElementById('f-email').value.trim();
        if (!email) { alert('Por favor ingresá tu email.'); return; }
        TG12.data.contact = {
            email: email,
            prefijo: document.getElementById('f-prefijo').value,
            whatsapp: document.getElementById('f-whatsapp').value.trim()
        };
        show('loading');
        TG12.processResult();
    };

    // ==================== PROCESAR RESULTADO ====================
    TG12.processResult = function() {
        document.getElementById('loading-msg').textContent = 'Conectando con los guardianes...';

        setTimeout(function() {
            document.getElementById('loading-msg').textContent = 'Analizando tu perfil energético...';
        }, 1000);

        setTimeout(function() {
            document.getElementById('loading-msg').textContent = 'Buscando tu match perfecto...';
        }, 2000);

        // Calcular perfil
        var perfil = TG12.calcularPerfil();
        TG12.data.perfil = perfil;

        // Enviar al API
        fetch(API + '/test-guardian', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TG12.data.contact.email,
                nombre: TG12.data.identity.nombre,
                respuestas: TG12.data.answers,
                perfil: perfil
            })
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            setTimeout(function() {
                TG12.renderResult(data, perfil);
            }, 1500);
        })
        .catch(function() {
            setTimeout(function() {
                TG12.renderResult({ success: false }, perfil);
            }, 1500);
        });
    };

    // ==================== RENDERIZAR RESULTADO ====================
    TG12.renderResult = function(apiData, perfil) {
        var nombre = TG12.data.identity.nombre;
        var guardianes = TG12.matchGuardianes(perfil);
        var sincro = TG12.generarSincronicidad();
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
            if (g.imagen) {
                html += '<img src="' + g.imagen + '" class="tg-guardian-img" style="width:' + imgSize + 'px;height:' + imgSize + 'px;" alt="' + g.nombre + '">';
            } else {
                html += '<div class="tg-guardian-img" style="width:' + imgSize + 'px;height:' + imgSize + 'px;background:linear-gradient(135deg,#d4af37,#b8962e);display:flex;align-items:center;justify-content:center;font-size:' + (isMain ? 48 : 32) + 'px;color:#fff;">' + g.nombre.charAt(0) + '</div>';
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
        html += '<div class="tg-escasez-item"><span class="tg-escasez-dot gold"></span> Último similar vendido hace ' + diasDesde + ' días</div>';
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

        // Testimonio estratégico
        html += '<div class="tg-testimonio">';
        html += '<p class="tg-testimonio-text">"' + testimonio.texto + '"</p>';
        html += '<span class="tg-testimonio-autor">— ' + testimonio.autor + '</span>';
        html += '</div>';

        // Email confirmación
        html += '<div class="tg-email-sent">Te enviamos el resultado completo a <strong>' + TG12.data.contact.email + '</strong></div>';

        // Micro-compromiso antes de tienda
        html += '<div class="tg-micro-step">';
        html += '<div class="tg-micro-title">¿Querés ver el mensaje que tiene para vos?</div>';
        html += '<div class="tg-micro-desc">Tu guardián principal ya tiene algo que decirte. Podés verlo antes de decidir.</div>';
        html += '<button class="tg-btn" onclick="TG12.showPreview()">VER MENSAJE</button>';
        html += '</div>';

        // CTA final
        html += '<p style="margin-top:30px;"><a href="https://duendesdeluruguay.com/shop/" class="tg-btn tg-btn-secondary" style="text-decoration:none;">IR DIRECTO A LA TIENDA</a></p>';

        document.getElementById('result-content').innerHTML = html;
        show('result');
        progress(TOTAL_Q + 1, TOTAL_Q);
    };

    // ==================== MICRO-COMPROMISO: PREVIEW ====================
    TG12.showPreview = function() {
        var nombre = TG12.data.identity.nombre;
        var perfil = TG12.data.perfil;
        var guardianes = TG12.matchGuardianes(perfil);
        var guardian = guardianes[0];

        var mensajes = {
            vulnerable: nombre + ', sé que estás cansada. Sé que cargaste más de lo que te tocaba. Vine a decirte que ya no tenés que hacerlo sola. Estoy acá.',
            esceptico: nombre + ', no necesito que creas en mí. Solo necesito que me des una oportunidad. Lo que pase después, lo decidís vos.',
            impulsivo: nombre + ', sentiste algo cuando me viste. No lo ignores. Eso que sentiste es real. Es tu intuición hablándote.',
            racional: nombre + ', puedo darte mil razones para que confíes. Pero la mejor razón sos vos misma. Escuchate.',
            coleccionista: nombre + ', hay guardianes que esperan su momento. Yo esperé el mío para llegar a vos. La colección se completa cuando el corazón lo siente.'
        };

        var mensaje = mensajes[perfil.perfil_cierre] || mensajes.vulnerable;

        var html = '';
        html += '<h1 class="tg-title">Mensaje de ' + guardian.nombre + '</h1>';

        html += '<div style="margin:30px 0;">';
        if (guardian.imagen) {
            html += '<img src="' + guardian.imagen + '" style="width:120px;height:120px;border-radius:50%;border:3px solid #d4af37;box-shadow:0 0 30px rgba(212,175,55,0.4);">';
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
                TG12.products = data.products.map(function(p) {
                    return {
                        nombre: p.nombre,
                        imagen: p.imagen,
                        url: p.url,
                        categoria: p.categoria || ''
                    };
                });
            }
        })
        .catch(function() {});

    window.TG12 = TG12;
    window.show = show;
    progress(0, TOTAL_Q);
})();
</script>
<!-- /TEST GUARDIAN v12 -->
<?php
    return ob_get_clean();
}

// Registrar shortcodes
add_shortcode('test_guardian_v12', 'duendes_test_guardian_v12_render');
add_shortcode('test_guardian', 'duendes_test_guardian_v12_render');
