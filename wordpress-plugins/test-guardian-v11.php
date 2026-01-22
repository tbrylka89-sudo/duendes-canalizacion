<?php
/*
Plugin Name: Test Guardian v11 - Perfilado Psicologico
Description: Test del Guardian con perfilado psicologico completo (12 preguntas)
Version: 11.0
*/
if (!defined('ABSPATH')) exit;

function duendes_test_guardian_v11_render() {
    $v = '11.' . time();
    ob_start();
?>
<!-- TEST GUARDIAN v11 - CON PERFILADO PSICOLOGICO -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&display=swap" rel="stylesheet">

<div id="tg-app" data-v="<?php echo $v; ?>" style="display:block!important;visibility:visible!important;opacity:1!important;min-height:100vh!important;">

<script>
(function(){
    var count = 0;
    var forceVisible = setInterval(function(){
        var app = document.getElementById('tg-app');
        if(app){
            app.style.cssText = 'display:block!important;visibility:visible!important;opacity:1!important;min-height:100vh!important;height:auto!important;';
            var parent = app.parentElement;
            while(parent && parent !== document.body){
                parent.style.cssText += 'display:block!important;visibility:visible!important;opacity:1!important;height:auto!important;overflow:visible!important;';
                parent = parent.parentElement;
            }
        }
        count++;
        if(count > 50) clearInterval(forceVisible);
    }, 100);
})();
</script>

<style>
/* ======================================== ESTILOS BASE ======================================== */
#tg-app,
.elementor-shortcode:has(#tg-app),
.elementor-widget-shortcode:has(#tg-app),
.elementor-widget:has(#tg-app),
.elementor-element:has(#tg-app),
.elementor-widget-container:has(#tg-app) {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    height: auto !important;
    overflow: visible !important;
}

#tg-app {
    display: block !important;
    width: 100% !important;
    min-height: 100vh !important;
    background: linear-gradient(180deg, #0a0a12 0%, #0d0d1a 50%, #0a0a12 100%) !important;
    font-family: 'Cinzel', 'Segoe UI', Arial, sans-serif !important;
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
        radial-gradient(2px 2px at 20% 30%, rgba(100, 200, 255, 0.3), transparent),
        radial-gradient(2px 2px at 80% 20%, rgba(100, 200, 255, 0.2), transparent),
        radial-gradient(2px 2px at 40% 70%, rgba(100, 200, 255, 0.3), transparent);
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
    padding: 40px 20px !important;
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

.tg-main-icon {
    display: block !important;
    width: 80px !important;
    height: 80px !important;
    margin: 0 auto 40px !important;
    background: linear-gradient(135deg, #00d4ff 0%, #0088cc 100%) !important;
    border-radius: 50% !important;
    box-shadow: 0 0 40px rgba(0, 212, 255, 0.5), 0 0 80px rgba(0, 212, 255, 0.3) !important;
    animation: glow 3s ease-in-out infinite !important;
}

@keyframes glow {
    0%, 100% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.5), 0 0 80px rgba(0, 212, 255, 0.3); }
    50% { box-shadow: 0 0 60px rgba(0, 212, 255, 0.7), 0 0 100px rgba(0, 212, 255, 0.5); }
}

.tg-title {
    font-family: 'Cinzel Decorative', serif !important;
    font-size: 32px !important;
    color: #ffffff !important;
    margin: 0 0 30px 0 !important;
    text-shadow: 0 0 30px rgba(0, 212, 255, 0.5) !important;
}

.tg-subtitle {
    font-size: 18px !important;
    color: rgba(255, 255, 255, 0.8) !important;
    margin: 0 0 20px 0 !important;
    line-height: 1.6 !important;
}

.tg-hint {
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.5) !important;
    margin: 0 0 40px 0 !important;
    font-style: italic !important;
}

.tg-btn {
    display: inline-block !important;
    padding: 18px 50px !important;
    background: transparent !important;
    border: 2px solid #00d4ff !important;
    border-radius: 50px !important;
    color: #ffffff !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
    cursor: pointer !important;
    transition: all 0.4s ease !important;
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.3) !important;
    margin-top: 20px !important;
}

.tg-btn:hover {
    background: rgba(0, 212, 255, 0.15) !important;
    box-shadow: 0 0 50px rgba(0, 212, 255, 0.5) !important;
    transform: translateY(-3px) !important;
}

/* ======================================== FORMULARIOS ======================================== */
.tg-form {
    width: 100% !important;
    max-width: 450px !important;
    margin: 40px auto 0 !important;
    text-align: left !important;
}

.tg-field { margin-bottom: 25px !important; }

.tg-label {
    display: block !important;
    font-size: 12px !important;
    color: #00d4ff !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    margin-bottom: 10px !important;
}

.tg-input {
    width: 100% !important;
    padding: 16px 20px !important;
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(0, 212, 255, 0.3) !important;
    border-radius: 12px !important;
    color: #ffffff !important;
    font-size: 16px !important;
    font-family: inherit !important;
    transition: all 0.3s ease !important;
}

.tg-input:focus {
    outline: none !important;
    border-color: #00d4ff !important;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.2) !important;
}

.tg-input::placeholder { color: rgba(255, 255, 255, 0.3) !important; }

.tg-row {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 20px !important;
}

/* ======================================== PREGUNTAS ======================================== */
.tg-question-block {
    font-size: 11px !important;
    color: #00d4ff !important;
    text-transform: uppercase !important;
    letter-spacing: 4px !important;
    margin-bottom: 25px !important;
}

.tg-question-text {
    font-size: 24px !important;
    font-weight: 300 !important;
    color: #ffffff !important;
    line-height: 1.5 !important;
    margin-bottom: 40px !important;
}

/* ======================================== OPCIONES DE RESPUESTA ======================================== */
.tg-options {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
    width: 100% !important;
    max-width: 500px !important;
    margin: 0 auto !important;
}

.tg-option {
    display: flex !important;
    align-items: center !important;
    gap: 15px !important;
    padding: 18px 22px !important;
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(0, 212, 255, 0.2) !important;
    border-radius: 12px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    text-align: left !important;
}

.tg-option:hover {
    background: rgba(0, 212, 255, 0.1) !important;
    border-color: #00d4ff !important;
    transform: translateX(8px) !important;
}

.tg-option-dot {
    width: 10px !important;
    height: 10px !important;
    background: #00d4ff !important;
    border-radius: 50% !important;
    flex-shrink: 0 !important;
}

.tg-option-text {
    font-size: 16px !important;
    color: rgba(255, 255, 255, 0.9) !important;
}

/* ======================================== ESCALA VISUAL (4 opciones) ======================================== */
.tg-escala-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 12px !important;
    width: 100% !important;
    max-width: 500px !important;
    margin: 0 auto !important;
}

.tg-escala-btn {
    padding: 18px 15px !important;
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(0, 212, 255, 0.2) !important;
    border-radius: 12px !important;
    color: rgba(255, 255, 255, 0.9) !important;
    font-size: 15px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    text-align: center !important;
}

.tg-escala-btn:hover {
    background: rgba(0, 212, 255, 0.15) !important;
    border-color: #00d4ff !important;
    transform: scale(1.02) !important;
}

/* ======================================== ESCALA NUMERICA (1-10) ======================================== */
.tg-slider-wrap {
    width: 100% !important;
    max-width: 400px !important;
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
    height: 10px !important;
    border-radius: 5px !important;
    background: linear-gradient(to right, #56ab91, #d4af37, #e75480) !important;
    outline: none !important;
}

.tg-slider::-webkit-slider-thumb {
    -webkit-appearance: none !important;
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    background: #00d4ff !important;
    cursor: pointer !important;
    border: 4px solid #fff !important;
    box-shadow: 0 4px 15px rgba(0,212,255,0.5) !important;
}

.tg-slider::-moz-range-thumb {
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    background: #00d4ff !important;
    cursor: pointer !important;
    border: 4px solid #fff !important;
}

.tg-slider-value {
    font-size: 56px !important;
    font-weight: 700 !important;
    color: #00d4ff !important;
    font-family: 'Cinzel Decorative', serif !important;
    margin: 25px 0 !important;
    text-shadow: 0 0 30px rgba(0,212,255,0.5) !important;
}

/* ======================================== TEXTAREA ======================================== */
.tg-textarea-wrap {
    width: 100% !important;
    max-width: 500px !important;
    margin: 0 auto !important;
}

.tg-textarea {
    width: 100% !important;
    min-height: 140px !important;
    padding: 20px !important;
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(0, 212, 255, 0.3) !important;
    border-radius: 15px !important;
    color: #ffffff !important;
    font-size: 16px !important;
    font-family: inherit !important;
    line-height: 1.6 !important;
    resize: vertical !important;
    transition: all 0.3s ease !important;
}

.tg-textarea:focus {
    outline: none !important;
    border-color: #00d4ff !important;
    box-shadow: 0 0 25px rgba(0, 212, 255, 0.15) !important;
}

.tg-textarea::placeholder { color: rgba(255, 255, 255, 0.3) !important; }

.tg-textarea-hint {
    font-size: 13px !important;
    color: rgba(255, 255, 255, 0.4) !important;
    margin-top: 12px !important;
    font-style: italic !important;
}

/* ======================================== LOADING ======================================== */
.tg-loading {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    padding: 60px 20px !important;
}

.tg-spinner {
    width: 50px !important;
    height: 50px !important;
    border: 3px solid rgba(0, 212, 255, 0.2) !important;
    border-top-color: #00d4ff !important;
    border-radius: 50% !important;
    animation: spin 1s linear infinite !important;
    margin-bottom: 30px !important;
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
    height: 60px !important;
    background: rgba(10, 10, 18, 0.95) !important;
    backdrop-filter: blur(10px) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 100 !important;
    border-top: 1px solid rgba(0, 212, 255, 0.2) !important;
}

.tg-progress-inner {
    width: 100% !important;
    max-width: 400px !important;
    text-align: center !important;
    padding: 0 20px !important;
}

.tg-progress-label {
    font-size: 12px !important;
    color: rgba(255, 255, 255, 0.5) !important;
    margin-bottom: 8px !important;
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
    background: linear-gradient(90deg, #00d4ff, #00ffcc) !important;
    border-radius: 2px !important;
    transition: width 0.5s ease !important;
    width: 0% !important;
}

/* ======================================== RESULTADO ======================================== */
.tg-guardians-grid {
    display: flex !important;
    justify-content: center !important;
    align-items: flex-end !important;
    gap: 20px !important;
    margin: 40px 0 !important;
    flex-wrap: wrap !important;
}

.tg-guardian-circle {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    transition: all 0.3s ease !important;
    cursor: pointer !important;
    text-decoration: none !important;
}

.tg-guardian-circle:hover {
    transform: translateY(-10px) scale(1.05) !important;
}

.tg-guardian-circle.main { order: 0 !important; }
.tg-guardian-circle.secondary { opacity: 0.85 !important; }

.tg-guardian-img-wrap {
    position: relative !important;
    margin-bottom: 15px !important;
}

.tg-guardian-img {
    border-radius: 50% !important;
    object-fit: cover !important;
    border: 3px solid #00d4ff !important;
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.4) !important;
}

.tg-guardian-circle.main .tg-guardian-img { width: 140px !important; height: 140px !important; }
.tg-guardian-circle.secondary .tg-guardian-img { width: 95px !important; height: 95px !important; border-color: rgba(0,212,255,0.5) !important; }

.tg-guardian-percent {
    position: absolute !important;
    bottom: -10px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    background: #00d4ff !important;
    color: #000 !important;
    font-size: 13px !important;
    font-weight: bold !important;
    padding: 4px 12px !important;
    border-radius: 20px !important;
}

.tg-guardian-name {
    font-family: 'Cinzel Decorative', serif !important;
    font-size: 15px !important;
    color: #fff !important;
    margin-top: 12px !important;
}

.tg-guardian-circle.main .tg-guardian-name { font-size: 20px !important; color: #00d4ff !important; }

.tg-result-phrase {
    background: rgba(0, 212, 255, 0.1) !important;
    border: 1px solid rgba(0, 212, 255, 0.3) !important;
    border-radius: 15px !important;
    padding: 25px !important;
    margin: 30px 0 !important;
}

.tg-result-phrase p {
    font-size: 18px !important;
    color: #00d4ff !important;
    margin: 0 !important;
    font-style: italic !important;
}

.tg-perfil-card {
    background: rgba(255,255,255,0.03) !important;
    border: 1px solid rgba(0,212,255,0.2) !important;
    border-radius: 12px !important;
    padding: 20px !important;
    margin: 25px 0 !important;
}

.tg-perfil-title {
    font-size: 13px !important;
    color: #00d4ff !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    margin-bottom: 15px !important;
}

.tg-perfil-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 15px !important;
}

.tg-perfil-item { text-align: left !important; }

.tg-perfil-label {
    font-size: 11px !important;
    color: rgba(255,255,255,0.5) !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
}

.tg-perfil-value {
    font-size: 15px !important;
    color: #fff !important;
    text-transform: capitalize !important;
    margin-top: 4px !important;
}

.tg-perfil-value.alta { color: #e75480 !important; }
.tg-perfil-value.media { color: #d4af37 !important; }
.tg-perfil-value.baja { color: #56ab91 !important; }

.tg-email-sent {
    background: rgba(0, 255, 150, 0.1) !important;
    border: 1px solid rgba(0, 255, 150, 0.3) !important;
    border-radius: 10px !important;
    padding: 15px 25px !important;
    margin: 20px 0 !important;
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.8) !important;
}

/* ======================================== ELEGIDOS ======================================== */
.tg-elegidos-text {
    font-size: 22px !important;
    color: #00d4ff !important;
    line-height: 1.8 !important;
    max-width: 500px !important;
    margin: 0 auto 50px !important;
    text-shadow: 0 0 30px rgba(0, 212, 255, 0.3) !important;
}

.tg-highlight {
    font-family: 'Cinzel Decorative', serif !important;
    color: #ffffff !important;
    font-weight: 700 !important;
    font-size: 32px !important;
    display: inline-block !important;
    text-shadow: 0 0 40px rgba(0, 212, 255, 0.5) !important;
}

/* ======================================== MUSICA Y FRECUENCIA ======================================== */
.tg-music-activator {
    position: relative !important;
    width: 150px !important;
    height: 150px !important;
    margin: 0 auto !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.tg-frequency-ring {
    position: absolute !important;
    border: 2px solid rgba(0, 212, 255, 0.4) !important;
    border-radius: 50% !important;
    animation: frequencyPulse 2s ease-out infinite !important;
}

.tg-frequency-ring:nth-child(1) { width: 80px !important; height: 80px !important; }
.tg-frequency-ring:nth-child(2) { width: 110px !important; height: 110px !important; animation-delay: 0.5s !important; }
.tg-frequency-ring:nth-child(3) { width: 140px !important; height: 140px !important; animation-delay: 1s !important; }

@keyframes frequencyPulse {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
}

.tg-frequency-icon {
    position: relative !important;
    z-index: 10 !important;
    width: 70px !important;
    height: 70px !important;
    background: rgba(0, 212, 255, 0.2) !important;
    border: 2px solid #00d4ff !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.3s !important;
}

.tg-music-activator:hover .tg-frequency-icon {
    background: rgba(0, 212, 255, 0.3) !important;
    transform: scale(1.1) !important;
}

.tg-skip-btn {
    display: inline-block !important;
    margin-top: 30px !important;
    padding: 10px 20px !important;
    background: transparent !important;
    border: none !important;
    color: rgba(255, 255, 255, 0.5) !important;
    font-size: 14px !important;
    cursor: pointer !important;
    text-decoration: underline !important;
    transition: color 0.3s !important;
}

.tg-skip-btn:hover { color: rgba(255, 255, 255, 0.8) !important; }

.tg-music-toggle {
    position: fixed !important;
    bottom: 80px !important;
    right: 20px !important;
    width: 50px !important;
    height: 50px !important;
    background: rgba(0, 212, 255, 0.2) !important;
    border: 1px solid #00d4ff !important;
    border-radius: 50% !important;
    cursor: pointer !important;
    display: none !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 200 !important;
    transition: all 0.3s !important;
}

.tg-music-toggle.visible { display: flex !important; }

.tg-music-toggle:hover {
    background: rgba(0, 212, 255, 0.3) !important;
    transform: scale(1.1) !important;
}

/* ======================================== RESPONSIVE ======================================== */
@media (max-width: 600px) {
    .tg-title { font-size: 24px !important; }
    .tg-subtitle { font-size: 15px !important; }
    .tg-question-text { font-size: 18px !important; }
    .tg-highlight { font-size: 26px !important; }
    .tg-elegidos-text { font-size: 17px !important; }
    .tg-row { grid-template-columns: 1fr !important; }
    .tg-escala-grid { grid-template-columns: 1fr !important; }
    .tg-container { padding: 30px 15px 80px !important; }
    .tg-guardians-grid { gap: 10px !important; }
    .tg-perfil-grid { grid-template-columns: 1fr !important; }
}
</style>

<!-- AUDIO -->
<audio id="tg-audio" loop preload="auto">
    <source src="https://duendesuy.10web.cloud/wp-content/uploads/2026/01/ES_Words-of-an-Angel-Kikoru.mp3" type="audio/mpeg">
</audio>

<div class="tg-container">

    <!-- PANTALLA ELEGIDOS -->
    <div id="screen-elegidos" class="tg-screen active">
        <p class="tg-elegidos-text">
            Existen personas que fueron llamadas.<br>
            No por su nombre, sino por algo mas profundo.<br><br>
            Los llaman <span class="tg-highlight">Los Elegidos</span>.<br><br>
            Son quienes cuidan de un guardian.<br>
            O quizas... son cuidados por el.
        </p>
        <button class="tg-btn" onclick="TG11.showMusic()">DESCUBRIR SI SOY UNA</button>
    </div>

    <!-- PANTALLA MUSICA -->
    <div id="screen-music" class="tg-screen">
        <div class="tg-music-activator" onclick="TG11.activateFrequency()">
            <div class="tg-frequency-ring"></div>
            <div class="tg-frequency-ring"></div>
            <div class="tg-frequency-ring"></div>
            <div class="tg-frequency-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                </svg>
            </div>
        </div>
        <h2 class="tg-title" style="font-size:26px;margin-top:40px;">Toca para activar<br>la frecuencia de conexion</h2>
        <p class="tg-hint">La musica te ayudara a conectar con tu guardian</p>
        <button class="tg-skip-btn" onclick="TG11.skipMusic()">Continuar sin musica</button>
    </div>

    <!-- BOTON FLOTANTE MUSICA -->
    <div class="tg-music-toggle" id="music-toggle" onclick="TG11.toggleMusic()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
        </svg>
    </div>

    <!-- INTRO -->
    <div id="screen-intro" class="tg-screen">
        <div class="tg-main-icon"></div>
        <h1 class="tg-title">El portal esta abierto</h1>
        <p class="tg-subtitle">No llegaste aca por casualidad.<br>Algo en vos buscaba esto.</p>
        <p class="tg-hint">Este test dura aproximadamente 3 minutos.</p>
        <button class="tg-btn" onclick="TG11.goIdentity()">COMENZAR</button>
    </div>

    <!-- IDENTIDAD -->
    <div id="screen-identity" class="tg-screen">
        <h1 class="tg-title">Contame sobre vos</h1>
        <p class="tg-subtitle">Es la llave del portal.</p>
        <div class="tg-form">
            <div class="tg-field">
                <label class="tg-label">Tu nombre</label>
                <input type="text" id="f-nombre" class="tg-input" placeholder="Como te llaman?">
            </div>
            <div class="tg-row">
                <div class="tg-field">
                    <label class="tg-label">Nacimiento</label>
                    <input type="date" id="f-nacimiento" class="tg-input">
                </div>
                <div class="tg-field">
                    <label class="tg-label">Pais</label>
                    <select id="f-pais" class="tg-input">
                        <option value="">Seleccionar...</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Chile">Chile</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Espana">Espana</option>
                        <option value="Peru">Peru</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
            </div>
            <button class="tg-btn" onclick="TG11.saveIdentity()">CONTINUAR</button>
        </div>
    </div>

    <!-- PREGUNTAS -->
    <div id="screen-question" class="tg-screen">
        <div class="tg-question-block" id="q-block">PREGUNTA</div>
        <div class="tg-question-text" id="q-text">Cargando...</div>

        <!-- Opciones seleccion -->
        <div id="q-options" class="tg-options"></div>

        <!-- Escala visual 4 opciones -->
        <div id="q-escala" class="tg-escala-grid" style="display:none;"></div>

        <!-- Escala numerica 1-10 -->
        <div id="q-slider" class="tg-slider-wrap" style="display:none;">
            <div class="tg-slider-labels">
                <span id="slider-min">1</span>
                <span id="slider-max">10</span>
            </div>
            <input type="range" id="slider-input" class="tg-slider" min="1" max="10" value="5">
            <div class="tg-slider-value" id="slider-value">5</div>
            <button class="tg-btn" onclick="TG11.submitSlider()">CONFIRMAR</button>
        </div>

        <!-- Texto libre -->
        <div id="q-textarea" class="tg-textarea-wrap" style="display:none;">
            <textarea id="q-input" class="tg-textarea" placeholder="Escribi lo que sientas..."></textarea>
            <p class="tg-textarea-hint">No hay respuesta incorrecta.</p>
            <button class="tg-btn" onclick="TG11.submitText()">CONTINUAR</button>
        </div>
    </div>

    <!-- LOADING -->
    <div id="screen-loading" class="tg-screen">
        <div class="tg-loading">
            <div class="tg-spinner"></div>
            <span class="tg-loading-text" id="loading-msg">Canalizando tu energia...</span>
        </div>
    </div>

    <!-- CONTACTO -->
    <div id="screen-contact" class="tg-screen">
        <h1 class="tg-title">Ya casi llegamos</h1>
        <p class="tg-subtitle">Deja tus datos para recibir el resultado.</p>
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
                        <option value="+52">+52 Mexico</option>
                        <option value="+57">+57 Colombia</option>
                        <option value="+34">+34 Espana</option>
                        <option value="+1">+1 USA/Canada</option>
                    </select>
                </div>
                <div class="tg-field">
                    <label class="tg-label">WhatsApp</label>
                    <input type="tel" id="f-whatsapp" class="tg-input" placeholder="Ej: 1155667788">
                </div>
            </div>
            <button class="tg-btn" onclick="TG11.saveContact()">VER MI RESULTADO</button>
        </div>
    </div>

    <!-- RESULTADO -->
    <div id="screen-result" class="tg-screen">
        <div id="result-content"></div>
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

    var TG11 = {
        step: 0,
        data: { identity: {}, answers: {}, contact: {} },
        sliderValue: 5,
        musicPlaying: false,
        audio: null
    };

    // 12 PREGUNTAS CON PERFILADO PSICOLOGICO
    var QUESTIONS = [
        // Originales 1-7
        { id: 1, block: 'ESPEJO', type: 'select', text: 'Hay personas que sienten que cargan con mas de lo que les corresponde. Otras sienten que la vida les debe algo. Cual te suena mas?',
          options: [
            { id: 'carga', text: 'Cargo con todo y nadie me cuida a mi', categoria: 'proteccion', dolor: 'carga_emocional' },
            { id: 'esquiva', text: 'Las cosas buenas siempre le pasan a otros', categoria: 'fortuna', dolor: 'mala_suerte' },
            { id: 'vacio', text: 'Tengo todo pero siento un vacio', categoria: 'sanacion', dolor: 'vacio_existencial' },
            { id: 'estancada', text: 'Se que puedo mas pero algo me frena', categoria: 'transformacion', dolor: 'bloqueo' }
          ]
        },
        { id: 2, block: 'MOMENTO', type: 'select', text: 'En que momento estas ahora?',
          options: [
            { id: 'crisis', text: 'Atravesando algo dificil', momento: 'crisis', urgencia: 'alta' },
            { id: 'transicion', text: 'Cerrando un ciclo, abriendo otro', momento: 'transicion', urgencia: 'media' },
            { id: 'busqueda', text: 'Buscando algo mas, no se que', momento: 'busqueda', urgencia: 'baja' },
            { id: 'estable', text: 'Estable, pero quiero potenciar algo', momento: 'estable', urgencia: 'baja' }
          ]
        },
        { id: 3, block: 'ESPEJO', type: 'select', text: 'Cual de estas frases podrias haber dicho vos?',
          options: [
            { id: 'fuerte', text: '"Estoy cansada de ser la fuerte para todos"', arquetipo: 'protectora_agotada' },
            { id: 'merece', text: '"A veces siento que no merezco cosas buenas"', arquetipo: 'autoestima_baja' },
            { id: 'repite', text: '"Siempre termino en el mismo lugar"', arquetipo: 'patron_repetido' },
            { id: 'tarde', text: '"Siento que llego tarde a todo"', arquetipo: 'ansiosa' }
          ]
        },
        { id: 4, block: 'BUSQUEDA', type: 'select', text: 'Si un ser magico pudiera ayudarte con UNA cosa, cual elegirias?',
          options: [
            { id: 'proteger', text: 'Que me proteja y cuide mi energia', categoria: 'proteccion', intencion: 'proteccion' },
            { id: 'suerte', text: 'Que me traiga suerte y oportunidades', categoria: 'fortuna', intencion: 'abundancia' },
            { id: 'sanar', text: 'Que me ayude a soltar y sanar', categoria: 'sanacion', intencion: 'sanacion' },
            { id: 'amor', text: 'Que abra mi corazon al amor', categoria: 'amor', intencion: 'amor' }
          ]
        },
        { id: 5, block: 'PROFUNDO', type: 'text', text: 'Si pudieras contarle a alguien lo que de verdad te pesa... que le dirias?', placeholder: 'No hay respuesta incorrecta. Escribi lo que sientas...' },
        { id: 6, block: 'EXPERIENCIA', type: 'select', text: 'Tenes experiencia con objetos o seres que te acompanen espiritualmente?',
          options: [
            { id: 'si_varios', text: 'Si, tengo varios y me encantan', experiencia: 'alta', perfil: 'coleccionista' },
            { id: 'si_uno', text: 'Tengo algo pero quiero mas', experiencia: 'media', perfil: 'expansion' },
            { id: 'no_pero', text: 'No, pero siempre me llamo la atencion', experiencia: 'baja', perfil: 'primera_vez' },
            { id: 'esceptica', text: 'Soy esceptica pero algo me trajo aca', experiencia: 'ninguna', perfil: 'esceptico_curioso' }
          ]
        },
        { id: 7, block: 'ESTILO', type: 'select', text: 'Como preferis que te hablen?',
          options: [
            { id: 'directo', text: 'Directo, sin vueltas', estilo: 'directo' },
            { id: 'suave', text: 'Suave y contenedor', estilo: 'suave' },
            { id: 'poetico', text: 'Poetico y profundo', estilo: 'mistico' },
            { id: 'practico', text: 'Practico, con acciones claras', estilo: 'practico' }
          ]
        },
        // NUEVAS 8-12 para PERFILADO PSICOLOGICO
        { id: 8, block: 'BLOQUEO', type: 'select', text: 'Que te frena mas cuando algo te interesa?',
          options: [
            { id: 'que_diran', text: 'El que diran / que van a pensar', bloqueo: 'social', estilo_decision: 'emocional' },
            { id: 'dinero', text: 'No tener la plata en este momento', bloqueo: 'economico', estilo_decision: 'racional' },
            { id: 'tiempo', text: 'No tener tiempo para dedicarle', bloqueo: 'tiempo', estilo_decision: 'analitico' },
            { id: 'funciona', text: 'No saber si realmente funciona', bloqueo: 'escepticismo', estilo_decision: 'analitico' }
          ]
        },
        { id: 9, block: 'DECISION', type: 'select', text: 'Cuando algo te interesa de verdad, que haces?',
          options: [
            { id: 'enseguida', text: 'Lo compro/hago enseguida', decision: 'impulsivo', velocidad: 'rapido' },
            { id: 'pienso_dias', text: 'Lo pienso unos dias', decision: 'analitico', velocidad: 'medio' },
            { id: 'consulto', text: 'Lo consulto con alguien', decision: 'emocional', velocidad: 'lento' },
            { id: 'investigo', text: 'Investigo todo antes', decision: 'analitico', velocidad: 'lento' }
          ]
        },
        { id: 10, block: 'CREENCIAS', type: 'escala', text: 'Crees en la energia de los objetos?',
          options: [
            { id: 'totalmente', text: 'Totalmente', valor: 4, creencia: 'creyente', apertura: 90 },
            { id: 'a_veces', text: 'A veces si, a veces no', valor: 3, creencia: 'buscador', apertura: 60 },
            { id: 'no_mucho', text: 'No mucho, pero algo hay', valor: 2, creencia: 'esceptico', apertura: 30 },
            { id: 'para_nada', text: 'Para nada', valor: 1, creencia: 'esceptico', apertura: 10 }
          ]
        },
        { id: 11, block: 'INTENSIDAD', type: 'slider', text: 'Cuanto estas sufriendo ahora mismo?', min: 1, max: 10, minLabel: 'Tranquila', maxLabel: 'Mucho' },
        { id: 12, block: 'DURACION', type: 'select', text: 'Ultima: hace cuanto te sentis asi?',
          options: [
            { id: 'dias', text: 'Hace dias', duracion: 'dias', cronicidad: 0 },
            { id: 'semanas', text: 'Hace semanas', duracion: 'semanas', cronicidad: 1 },
            { id: 'meses', text: 'Hace meses', duracion: 'meses', cronicidad: 2 },
            { id: 'anios', text: 'Hace anios', duracion: 'anios', cronicidad: 3 }
          ]
        }
    ];

    // Productos fallback
    var PRODUCTS_FALLBACK = [
        { nombre: 'Finnegan', color1: '#00d4ff', color2: '#0066aa', inicial: 'F', url: 'https://duendesdeluruguay.com/shop/' },
        { nombre: 'Willow', color1: '#00ffcc', color2: '#008866', inicial: 'W', url: 'https://duendesdeluruguay.com/shop/' },
        { nombre: 'Bramble', color1: '#aa66ff', color2: '#6622aa', inicial: 'B', url: 'https://duendesdeluruguay.com/shop/' }
    ];

    var PRODUCTS = [];

    // Cargar productos
    fetch(API + '/test-guardian/products')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data.success && data.products && data.products.length > 0) {
                PRODUCTS = data.products.map(function(p) {
                    return { nombre: p.nombre, imagen: p.imagen, url: p.url, inicial: p.nombre.charAt(0) };
                });
            }
        })
        .catch(function() {});

    function show(id) {
        document.querySelectorAll('.tg-screen').forEach(function(s) { s.classList.remove('active'); });
        var el = document.getElementById('screen-' + id);
        if (el) el.classList.add('active');
    }

    function progress(step, total) {
        var pct = Math.round((step / total) * 100);
        var fill = document.getElementById('progress-fill');
        var label = document.getElementById('progress-label');
        if (fill) fill.style.width = pct + '%';
        if (label) {
            if (step === 0) label.textContent = 'Preparando el portal...';
            else if (step <= total) label.textContent = 'Pregunta ' + step + ' de ' + total;
            else label.textContent = 'Procesando resultado...';
        }
    }

    TG11.showMusic = function() { show('music'); };

    TG11.activateFrequency = function() {
        TG11.audio = document.getElementById('tg-audio');
        if (TG11.audio) {
            TG11.audio.volume = 0.3;
            TG11.audio.play().then(function() {
                TG11.musicPlaying = true;
                document.getElementById('music-toggle').classList.add('visible');
                show('intro');
            }).catch(function(e) {
                console.log('Audio blocked:', e);
                show('intro');
            });
        } else {
            show('intro');
        }
    };

    TG11.skipMusic = function() { show('intro'); };

    TG11.toggleMusic = function() {
        if (!TG11.audio) return;
        if (TG11.musicPlaying) {
            TG11.audio.pause();
            TG11.musicPlaying = false;
        } else {
            TG11.audio.play();
            TG11.musicPlaying = true;
        }
    };

    TG11.start = function() { show('intro'); };
    TG11.goIdentity = function() { show('identity'); };

    TG11.saveIdentity = function() {
        var nombre = document.getElementById('f-nombre').value.trim();
        var pais = document.getElementById('f-pais').value;
        if (!nombre || !pais) { alert('Por favor completa nombre y pais.'); return; }
        TG11.data.identity = {
            nombre: nombre,
            nacimiento: document.getElementById('f-nacimiento').value,
            pais: pais
        };
        TG11.step = 1;
        TG11.showQuestion();
    };

    TG11.showQuestion = function() {
        progress(TG11.step, TOTAL_Q);

        if (TG11.step > TOTAL_Q) {
            show('contact');
            return;
        }

        var q = QUESTIONS[TG11.step - 1];
        if (!q) { show('contact'); return; }

        document.getElementById('q-block').textContent = q.block;
        document.getElementById('q-text').textContent = q.text;

        // Ocultar todos los tipos
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
                div.onclick = function() { TG11.answer(q.id, opt); };
                optionsEl.appendChild(div);
            });
        } else if (q.type === 'escala') {
            var escalaEl = document.getElementById('q-escala');
            escalaEl.style.display = 'grid';
            q.options.forEach(function(opt) {
                var btn = document.createElement('button');
                btn.className = 'tg-escala-btn';
                btn.textContent = opt.text;
                btn.onclick = function() { TG11.answer(q.id, opt); };
                escalaEl.appendChild(btn);
            });
        } else if (q.type === 'slider') {
            var sliderWrap = document.getElementById('q-slider');
            sliderWrap.style.display = 'block';
            document.getElementById('slider-min').textContent = q.minLabel || '1';
            document.getElementById('slider-max').textContent = q.maxLabel || '10';
            var sliderInput = document.getElementById('slider-input');
            sliderInput.min = q.min || 1;
            sliderInput.max = q.max || 10;
            sliderInput.value = 5;
            TG11.sliderValue = 5;
            document.getElementById('slider-value').textContent = '5';
            sliderInput.oninput = function() {
                TG11.sliderValue = parseInt(this.value);
                document.getElementById('slider-value').textContent = this.value;
            };
            sliderInput.dataset.qid = q.id;
        } else if (q.type === 'text') {
            document.getElementById('q-textarea').style.display = 'block';
            var input = document.getElementById('q-input');
            input.value = '';
            input.placeholder = q.placeholder || 'Escribi lo que sientas...';
            input.dataset.qid = q.id;
            setTimeout(function() { input.focus(); }, 100);
        }

        show('question');
    };

    TG11.answer = function(qid, optionData) {
        TG11.data.answers[qid] = optionData;
        TG11.step++;
        TG11.showQuestion();
    };

    TG11.submitSlider = function() {
        var input = document.getElementById('slider-input');
        TG11.data.answers[input.dataset.qid] = { valor: TG11.sliderValue, tipo: 'escala_numerica' };
        TG11.step++;
        TG11.showQuestion();
    };

    TG11.submitText = function() {
        var input = document.getElementById('q-input');
        var text = input.value.trim();
        if (!text) { alert('Por favor escribi algo.'); return; }
        TG11.data.answers[input.dataset.qid] = { texto: text, tipo: 'texto_libre' };
        input.value = '';
        TG11.step++;
        TG11.showQuestion();
    };

    TG11.saveContact = function() {
        var email = document.getElementById('f-email').value.trim();
        if (!email) { alert('Por favor ingresa tu email.'); return; }
        TG11.data.contact = {
            email: email,
            prefijo: document.getElementById('f-prefijo').value,
            whatsapp: document.getElementById('f-whatsapp').value.trim()
        };
        show('loading');
        TG11.processResult();
    };

    // Calcular perfil psicologico localmente
    TG11.calcularPerfil = function() {
        var r = TG11.data.answers;
        var vulnScore = 0;

        // Pregunta 2: momento
        if (r[2] && r[2].momento === 'crisis') vulnScore += 40;
        else if (r[2] && r[2].momento === 'transicion') vulnScore += 20;

        // Pregunta 11: sufrimiento
        var sufrimiento = (r[11] && r[11].valor) ? r[11].valor : 5;
        if (sufrimiento >= 8) vulnScore += 30;
        else if (sufrimiento >= 6) vulnScore += 20;
        else if (sufrimiento >= 4) vulnScore += 10;

        // Pregunta 12: cronicidad
        var cronicidad = (r[12] && r[12].cronicidad) ? r[12].cronicidad : 0;
        vulnScore += cronicidad * 10;

        var vulnNivel = vulnScore > 70 ? 'alta' : vulnScore > 40 ? 'media' : 'baja';

        // Dolor principal
        var dolorMap = { 'carga': 'relaciones', 'esquiva': 'soledad', 'vacio': 'proposito', 'estancada': 'dinero' };
        var dolorTipo = (r[1] && dolorMap[r[1].id]) ? dolorMap[r[1].id] : 'proposito';

        // Estilo decision
        var estiloMap = { 'enseguida': 'impulsivo', 'pienso_dias': 'analitico', 'consulto': 'emocional', 'investigo': 'analitico' };
        var estiloTipo = (r[9] && estiloMap[r[9].id]) ? estiloMap[r[9].id] : 'emocional';

        // Creencias
        var creenciaTipo = (r[10] && r[10].creencia) ? r[10].creencia : 'buscador';
        var apertura = (r[10] && r[10].apertura) ? r[10].apertura : 50;

        // Perfil cierre
        var perfilCierre = 'vulnerable';
        if (vulnNivel === 'alta') perfilCierre = 'vulnerable';
        else if (creenciaTipo === 'esceptico') perfilCierre = 'esceptico';
        else if (estiloTipo === 'impulsivo') perfilCierre = 'impulsivo';
        else if (estiloTipo === 'analitico') perfilCierre = 'racional';

        return {
            vulnerabilidad: { nivel: vulnNivel, score: vulnScore },
            dolor_principal: { tipo: dolorTipo, intensidad: sufrimiento * 10 },
            estilo_decision: { tipo: estiloTipo },
            creencias: { tipo: creenciaTipo, apertura: apertura },
            perfil_cierre: perfilCierre
        };
    };

    TG11.processResult = function() {
        document.getElementById('loading-msg').textContent = 'Tu guardian esta despertando...';

        var perfil = TG11.calcularPerfil();
        TG11.data.perfilPsicologico = perfil;

        // Enviar al API
        fetch(API + '/test-guardian', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TG11.data.contact.email,
                nombre: TG11.data.identity.nombre,
                respuestas: TG11.data.answers
            })
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            TG11.renderResult(data, perfil);
        })
        .catch(function() {
            TG11.renderResult({ success: false }, perfil);
        });
    };

    TG11.renderResult = function(apiData, perfil) {
        var nombre = TG11.data.identity.nombre;
        var productList = PRODUCTS.length >= 3 ? PRODUCTS : PRODUCTS_FALLBACK;
        var shuffled = productList.slice().sort(function() { return 0.5 - Math.random(); });
        var g1 = shuffled[0], g2 = shuffled[1], g3 = shuffled[2];
        var pct1 = Math.floor(Math.random() * 15) + 85;
        var pct2 = Math.floor(Math.random() * 20) + 60;
        var pct3 = Math.floor(Math.random() * 20) + 50;

        var html = '<h1 class="tg-title">' + nombre + ', tus guardianes te encontraron</h1>';

        function renderOrb(g, size, isMain) {
            if (g.imagen) {
                return '<img src="' + g.imagen + '" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;object-fit:cover;border:3px solid #00d4ff;" alt="' + g.nombre + '">';
            }
            var fs = isMain ? '48px' : '32px';
            return '<div style="width:' + size + 'px;height:' + size + 'px;background:linear-gradient(135deg,' + (g.color1||'#00d4ff') + ',' + (g.color2||'#0066aa') + ');border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:' + fs + ';font-family:Cinzel Decorative,serif;color:#fff;">' + g.inicial + '</div>';
        }

        html += '<div class="tg-guardians-grid">';
        html += '<a href="' + (g2.url || '#') + '" target="_blank" class="tg-guardian-circle secondary"><div class="tg-guardian-img-wrap">' + renderOrb(g2, 95, false) + '<span class="tg-guardian-percent">' + pct2 + '%</span></div><span class="tg-guardian-name">' + g2.nombre + '</span></a>';
        html += '<a href="' + (g1.url || '#') + '" target="_blank" class="tg-guardian-circle main"><div class="tg-guardian-img-wrap">' + renderOrb(g1, 140, true) + '<span class="tg-guardian-percent">' + pct1 + '%</span></div><span class="tg-guardian-name">' + g1.nombre + '</span></a>';
        html += '<a href="' + (g3.url || '#') + '" target="_blank" class="tg-guardian-circle secondary"><div class="tg-guardian-img-wrap">' + renderOrb(g3, 95, false) + '<span class="tg-guardian-percent">' + pct3 + '%</span></div><span class="tg-guardian-name">' + g3.nombre + '</span></a>';
        html += '</div>';

        html += '<p class="tg-hint">Toca cualquier guardian para conocerlo</p>';

        // Mostrar perfil psicologico
        html += '<div class="tg-perfil-card">';
        html += '<div class="tg-perfil-title">Tu Perfil Energetico</div>';
        html += '<div class="tg-perfil-grid">';
        html += '<div class="tg-perfil-item"><div class="tg-perfil-label">Vulnerabilidad</div><div class="tg-perfil-value ' + perfil.vulnerabilidad.nivel + '">' + perfil.vulnerabilidad.nivel + '</div></div>';
        html += '<div class="tg-perfil-item"><div class="tg-perfil-label">Dolor principal</div><div class="tg-perfil-value">' + perfil.dolor_principal.tipo + '</div></div>';
        html += '<div class="tg-perfil-item"><div class="tg-perfil-label">Estilo decision</div><div class="tg-perfil-value">' + perfil.estilo_decision.tipo + '</div></div>';
        html += '<div class="tg-perfil-item"><div class="tg-perfil-label">Creencias</div><div class="tg-perfil-value">' + perfil.creencias.tipo + '</div></div>';
        html += '</div></div>';

        // Revelacion si viene del API
        if (apiData.success && apiData.resultado && apiData.resultado.revelacion) {
            html += '<div class="tg-result-phrase"><p>"' + (apiData.resultado.revelacion.mensaje || '') + '"</p></div>';
        }

        html += '<div class="tg-email-sent">Te enviamos el resultado completo a <strong>' + TG11.data.contact.email + '</strong></div>';
        html += '<a href="https://duendesdeluruguay.com/shop/" class="tg-btn" style="text-decoration:none;display:inline-block;">VER GUARDIANES EN LA TIENDA</a>';

        document.getElementById('result-content').innerHTML = html;
        show('result');
        progress(TOTAL_Q + 1, TOTAL_Q);
    };

    window.TG11 = TG11;
    progress(0, TOTAL_Q);
})();
</script>
<!-- /TEST GUARDIAN v11 -->
<?php
    return ob_get_clean();
}

// Registrar shortcodes
add_shortcode('test_guardian_v11', 'duendes_test_guardian_v11_render');
add_shortcode('test_guardian', 'duendes_test_guardian_v11_render');
