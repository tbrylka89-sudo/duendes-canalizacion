<?php
/*
Plugin Name: Test Guardian v10 - Rediseño Completo
Description: Test del Guardian completamente rediseñado - centrado, legible, elegante
Version: 10.0
*/
if (!defined('ABSPATH')) exit;

function duendes_test_guardian_v10_render() {
    $v = '10.' . time();
    ob_start();
?>
<!-- TEST GUARDIAN v10.4 - CON PROTECCIÓN ANTI-OCULTAMIENTO -->
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&display=swap" rel="stylesheet">

<div id="tg-app" data-v="<?php echo $v; ?>" style="display:block!important;visibility:visible!important;opacity:1!important;min-height:100vh!important;">

<!-- SCRIPT DE PROTECCIÓN - EJECUTA INMEDIATAMENTE -->
<script>
(function(){
    // Forzar visibilidad cada 100ms durante 5 segundos
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
/* ========================================
   FORZAR VISIBILIDAD EN CONTENEDORES
   ======================================== */
#tg-app,
.elementor-shortcode:has(#tg-app),
.elementor-widget-shortcode:has(#tg-app),
.elementor-widget:has(#tg-app),
.elementor-element:has(#tg-app),
.elementor-widget-container:has(#tg-app),
[data-elementor-type]:has(#tg-app),
.e-con:has(#tg-app),
.e-con-inner:has(#tg-app) {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    height: auto !important;
    min-height: auto !important;
    overflow: visible !important;
    max-height: none !important;
    transform: none !important;
    position: relative !important;
}

/* Reset para el app */
#tg-app {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    width: 100% !important;
    min-height: 100vh !important;
    background: linear-gradient(180deg, #0a0a12 0%, #0d0d1a 50%, #0a0a12 100%) !important;
    font-family: 'Cinzel', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
    color: #ffffff !important;
    position: relative !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
}

#tg-app * {
    box-sizing: border-box !important;
}

/* Partículas de fondo */
#tg-app::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image:
        radial-gradient(2px 2px at 20% 30%, rgba(100, 200, 255, 0.3), transparent),
        radial-gradient(2px 2px at 80% 20%, rgba(100, 200, 255, 0.2), transparent),
        radial-gradient(2px 2px at 40% 70%, rgba(100, 200, 255, 0.3), transparent),
        radial-gradient(2px 2px at 90% 80%, rgba(100, 200, 255, 0.2), transparent);
    animation: tgTwinkle 4s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
}

@keyframes tgTwinkle {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

/* ========================================
   CONTENEDOR PRINCIPAL
   ======================================== */
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

/* ========================================
   PANTALLAS
   ======================================== */
.tg-screen {
    display: none !important;
    width: 100% !important;
    max-width: 600px !important;
    margin: 0 auto !important;
    text-align: center !important;
    animation: fadeUp 0.6s ease-out !important;
}

.tg-screen.active {
    display: block !important;
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ========================================
   ICONO PRINCIPAL
   ======================================== */
.tg-main-icon {
    display: block !important;
    width: 80px !important;
    height: 80px !important;
    margin: 0 auto 40px !important;
    background: linear-gradient(135deg, #00d4ff 0%, #0088cc 100%) !important;
    border-radius: 50% !important;
    box-shadow:
        0 0 40px rgba(0, 212, 255, 0.5),
        0 0 80px rgba(0, 212, 255, 0.3),
        inset 0 0 20px rgba(255, 255, 255, 0.2) !important;
    animation: glow 3s ease-in-out infinite !important;
}

@keyframes glow {
    0%, 100% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.5), 0 0 80px rgba(0, 212, 255, 0.3); }
    50% { box-shadow: 0 0 60px rgba(0, 212, 255, 0.7), 0 0 100px rgba(0, 212, 255, 0.5); }
}

/* ========================================
   TIPOGRAFÍA
   ======================================== */
.tg-title {
    display: block !important;
    font-family: 'Cinzel Decorative', 'Cinzel', serif !important;
    font-size: 38px !important;
    font-weight: 400 !important;
    color: #ffffff !important;
    margin: 0 0 30px 0 !important;
    line-height: 1.3 !important;
    text-shadow: 0 0 30px rgba(0, 212, 255, 0.5) !important;
}

.tg-subtitle {
    display: block !important;
    font-size: 20px !important;
    color: rgba(255, 255, 255, 0.8) !important;
    margin: 0 0 20px 0 !important;
    line-height: 1.6 !important;
}

.tg-hint {
    display: block !important;
    font-size: 15px !important;
    color: rgba(255, 255, 255, 0.5) !important;
    margin: 0 0 50px 0 !important;
    font-style: italic !important;
}

/* ========================================
   BOTÓN PRINCIPAL
   ======================================== */
.tg-btn {
    display: inline-block !important;
    padding: 20px 60px !important;
    background: transparent !important;
    border: 2px solid #00d4ff !important;
    border-radius: 50px !important;
    color: #ffffff !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    letter-spacing: 3px !important;
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

/* ========================================
   SELECTOR TIPO (PARA MÍ / REGALO)
   ======================================== */
.tg-type-grid {
    display: flex !important;
    gap: 30px !important;
    justify-content: center !important;
    margin-top: 50px !important;
    flex-wrap: wrap !important;
}

.tg-type-card {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    width: 240px !important;
    height: 200px !important;
    background: rgba(255, 255, 255, 0.03) !important;
    border: 2px solid rgba(0, 212, 255, 0.3) !important;
    border-radius: 20px !important;
    cursor: pointer !important;
    transition: all 0.4s ease !important;
    padding: 30px !important;
}

.tg-type-card:hover {
    border-color: #00d4ff !important;
    background: rgba(0, 212, 255, 0.1) !important;
    transform: translateY(-8px) !important;
    box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2) !important;
}

.tg-type-icon {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 60px !important;
    height: 60px !important;
    background: linear-gradient(135deg, #00d4ff 0%, #0088cc 100%) !important;
    border-radius: 50% !important;
    margin-bottom: 20px !important;
    font-size: 24px !important;
}

.tg-type-label {
    display: block !important;
    font-size: 22px !important;
    font-weight: 500 !important;
    color: #ffffff !important;
    margin-bottom: 10px !important;
}

.tg-type-desc {
    display: block !important;
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.6) !important;
}

/* ========================================
   FORMULARIOS
   ======================================== */
.tg-form {
    display: block !important;
    width: 100% !important;
    max-width: 450px !important;
    margin: 40px auto 0 !important;
    text-align: left !important;
}

.tg-field {
    display: block !important;
    margin-bottom: 25px !important;
}

.tg-label {
    display: block !important;
    font-size: 13px !important;
    color: #00d4ff !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    margin-bottom: 10px !important;
}

.tg-input {
    display: block !important;
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

.tg-input::placeholder {
    color: rgba(255, 255, 255, 0.3) !important;
}

.tg-row {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 20px !important;
}

/* ========================================
   PREGUNTAS
   ======================================== */
.tg-question-block {
    display: block !important;
    font-size: 12px !important;
    color: #00d4ff !important;
    text-transform: uppercase !important;
    letter-spacing: 4px !important;
    margin-bottom: 30px !important;
}

.tg-question-text {
    display: block !important;
    font-size: 28px !important;
    font-weight: 300 !important;
    color: #ffffff !important;
    line-height: 1.5 !important;
    margin-bottom: 50px !important;
}

/* ========================================
   OPCIONES DE RESPUESTA
   ======================================== */
.tg-options {
    display: flex !important;
    flex-direction: column !important;
    gap: 15px !important;
    width: 100% !important;
    max-width: 500px !important;
    margin: 0 auto !important;
}

.tg-option {
    display: flex !important;
    align-items: center !important;
    gap: 15px !important;
    padding: 20px 25px !important;
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(0, 212, 255, 0.2) !important;
    border-radius: 15px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    text-align: left !important;
}

.tg-option:hover {
    background: rgba(0, 212, 255, 0.1) !important;
    border-color: #00d4ff !important;
    transform: translateX(10px) !important;
}

.tg-option-dot {
    display: block !important;
    width: 12px !important;
    height: 12px !important;
    background: #00d4ff !important;
    border-radius: 50% !important;
    flex-shrink: 0 !important;
}

.tg-option-text {
    display: block !important;
    font-size: 17px !important;
    color: rgba(255, 255, 255, 0.9) !important;
}

/* ========================================
   TEXTAREA
   ======================================== */
.tg-textarea-wrap {
    display: block !important;
    width: 100% !important;
    max-width: 500px !important;
    margin: 0 auto !important;
}

.tg-textarea {
    display: block !important;
    width: 100% !important;
    min-height: 150px !important;
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

.tg-textarea::placeholder {
    color: rgba(255, 255, 255, 0.3) !important;
}

.tg-textarea-hint {
    display: block !important;
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.4) !important;
    margin-top: 15px !important;
    font-style: italic !important;
}

/* ========================================
   LOADING
   ======================================== */
.tg-loading {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 60px 20px !important;
}

.tg-spinner {
    display: block !important;
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
    display: block !important;
    font-size: 18px !important;
    color: rgba(255, 255, 255, 0.8) !important;
}

/* ========================================
   PROGRESO
   ======================================== */
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
    padding: 0 20px !important;
    z-index: 100 !important;
    border-top: 1px solid rgba(0, 212, 255, 0.2) !important;
}

.tg-progress-inner {
    display: block !important;
    width: 100% !important;
    max-width: 400px !important;
    text-align: center !important;
}

.tg-progress-label {
    display: block !important;
    font-size: 13px !important;
    color: rgba(255, 255, 255, 0.5) !important;
    margin-bottom: 8px !important;
}

.tg-progress-bar {
    display: block !important;
    width: 100% !important;
    height: 4px !important;
    background: rgba(255, 255, 255, 0.1) !important;
    border-radius: 2px !important;
    overflow: hidden !important;
}

.tg-progress-fill {
    display: block !important;
    height: 100% !important;
    background: linear-gradient(90deg, #00d4ff, #00ffcc) !important;
    border-radius: 2px !important;
    transition: width 0.5s ease !important;
    width: 0% !important;
}

/* ========================================
   REGALO: RECORDATORIO
   ======================================== */
.tg-gift-reminder {
    display: none;
    background: rgba(255, 100, 150, 0.1) !important;
    border: 1px solid rgba(255, 100, 150, 0.3) !important;
    border-radius: 12px !important;
    padding: 15px 25px !important;
    margin-bottom: 30px !important;
    font-size: 15px !important;
    color: rgba(255, 255, 255, 0.8) !important;
}

.tg-gift-reminder.visible {
    display: block !important;
}

/* ========================================
   PANTALLA LOS ELEGIDOS
   ======================================== */
.tg-elegidos-text {
    font-size: 24px !important;
    color: #00d4ff !important;
    line-height: 1.8 !important;
    text-align: center !important;
    max-width: 500px !important;
    margin: 0 auto 50px !important;
    text-shadow: 0 0 30px rgba(0, 212, 255, 0.3) !important;
}

.tg-highlight {
    font-family: 'Cinzel Decorative', 'Cinzel', serif !important;
    color: #ffffff !important;
    font-weight: 700 !important;
    font-size: 36px !important;
    display: inline-block !important;
    text-shadow: 0 0 40px rgba(0, 212, 255, 0.5) !important;
}

/* ========================================
   PANTALLA MÚSICA - FRECUENCIA
   ======================================== */
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

.tg-frequency-ring:nth-child(1) {
    width: 80px !important;
    height: 80px !important;
}

.tg-frequency-ring:nth-child(2) {
    width: 110px !important;
    height: 110px !important;
    animation-delay: 0.5s !important;
}

.tg-frequency-ring:nth-child(3) {
    width: 140px !important;
    height: 140px !important;
    animation-delay: 1s !important;
}

@keyframes frequencyPulse {
    0% {
        transform: scale(0.8);
        opacity: 1;
    }
    100% {
        transform: scale(1.5);
        opacity: 0;
    }
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

.tg-skip-btn:hover {
    color: rgba(255, 255, 255, 0.8) !important;
}

/* ========================================
   BOTON SONIDO
   ======================================== */
.tg-sound-option {
    display: flex !important;
    gap: 20px !important;
    justify-content: center !important;
    margin: 30px 0 !important;
}

.tg-sound-btn {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    padding: 15px 25px !important;
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(0, 212, 255, 0.3) !important;
    border-radius: 30px !important;
    color: #fff !important;
    font-size: 14px !important;
    cursor: pointer !important;
    transition: all 0.3s !important;
}

.tg-sound-btn:hover {
    background: rgba(0, 212, 255, 0.1) !important;
    border-color: #00d4ff !important;
}

.tg-sound-btn.active {
    background: rgba(0, 212, 255, 0.2) !important;
    border-color: #00d4ff !important;
}

.tg-sound-icon {
    width: 20px !important;
    height: 20px !important;
}

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

.tg-music-toggle.visible {
    display: flex !important;
}

.tg-music-toggle:hover {
    background: rgba(0, 212, 255, 0.3) !important;
    transform: scale(1.1) !important;
}

/* ========================================
   RESULTADO CON 3 GUARDIANES
   ======================================== */
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
}

.tg-guardian-circle.main {
    order: 0 !important;
}

.tg-guardian-circle.secondary {
    opacity: 0.8 !important;
}

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

.tg-guardian-circle.main .tg-guardian-img {
    width: 150px !important;
    height: 150px !important;
}

.tg-guardian-circle.secondary .tg-guardian-img {
    width: 100px !important;
    height: 100px !important;
    border-color: rgba(0, 212, 255, 0.5) !important;
}

.tg-guardian-percent {
    position: absolute !important;
    bottom: -10px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    background: #00d4ff !important;
    color: #000 !important;
    font-size: 14px !important;
    font-weight: bold !important;
    padding: 5px 12px !important;
    border-radius: 20px !important;
}

.tg-guardian-circle.secondary .tg-guardian-percent {
    font-size: 12px !important;
    padding: 3px 10px !important;
}

.tg-guardian-name {
    font-family: 'Cinzel Decorative', 'Cinzel', serif !important;
    font-size: 16px !important;
    color: #fff !important;
    margin-bottom: 5px !important;
    margin-top: 15px !important;
}

.tg-guardian-circle.main .tg-guardian-name {
    font-size: 22px !important;
    color: #00d4ff !important;
}

a.tg-guardian-circle {
    transition: all 0.3s ease !important;
    cursor: pointer !important;
}

a.tg-guardian-circle:hover {
    transform: translateY(-10px) scale(1.05) !important;
}

a.tg-guardian-circle:hover .tg-guardian-name {
    color: #00ffcc !important;
}

a.tg-guardian-circle img,
a.tg-guardian-circle div {
    transition: all 0.3s ease !important;
}

a.tg-guardian-circle:hover img,
a.tg-guardian-circle:hover div {
    box-shadow: 0 0 60px rgba(0, 212, 255, 0.8) !important;
}

.tg-result-phrase {
    background: rgba(0, 212, 255, 0.1) !important;
    border: 1px solid rgba(0, 212, 255, 0.3) !important;
    border-radius: 15px !important;
    padding: 30px !important;
    margin: 30px 0 !important;
}

.tg-result-phrase p {
    font-size: 20px !important;
    color: #00d4ff !important;
    margin: 0 !important;
    font-style: italic !important;
}

.tg-email-sent {
    background: rgba(0, 255, 150, 0.1) !important;
    border: 1px solid rgba(0, 255, 150, 0.3) !important;
    border-radius: 10px !important;
    padding: 15px 25px !important;
    margin: 20px 0 !important;
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.8) !important;
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 600px) {
    .tg-title { font-size: 26px !important; }
    .tg-subtitle { font-size: 16px !important; }
    .tg-question-text { font-size: 20px !important; }
    .tg-highlight { font-size: 28px !important; }
    .tg-elegidos-text { font-size: 18px !important; }
    .tg-type-grid { flex-direction: column !important; align-items: center !important; }
    .tg-type-card { width: 100% !important; max-width: 280px !important; }
    .tg-row { grid-template-columns: 1fr !important; }
    .tg-container { padding: 30px 15px 80px !important; }
    .tg-guardians-grid { gap: 10px !important; }
    .tg-guardian-circle.main .tg-guardian-name { font-size: 18px !important; }
    .tg-guardian-circle.secondary .tg-guardian-name { font-size: 14px !important; }
    .tg-sound-option { flex-direction: column !important; align-items: center !important; }
}
</style>

<!-- AUDIO ELEMENTS -->
<audio id="tg-audio" loop preload="auto">
    <source src="https://duendesuy.10web.cloud/wp-content/uploads/2026/01/ES_Words-of-an-Angel-Kikoru.mp3" type="audio/mpeg">
</audio>

<div class="tg-container">

    <!-- PANTALLA INICIAL: LOS ELEGIDOS -->
    <div id="screen-elegidos" class="tg-screen active">
        <p class="tg-elegidos-text">
            Existen personas que fueron llamadas.<br>
            No por su nombre, sino por algo más profundo.<br><br>
            Los llaman <span class="tg-highlight">Los Elegidos</span>.<br><br>
            Son quienes cuidan de un duende.<br>
            O quizás... son cuidados por él.
        </p>
        <button class="tg-btn" onclick="TG.showMusicScreen()">DESCUBRIR SI SOY UNA</button>
    </div>

    <!-- PANTALLA DE MÚSICA -->
    <div id="screen-music" class="tg-screen">
        <div class="tg-music-activator" onclick="TG.activateFrequency()">
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
        <h2 class="tg-title" style="font-size:28px;margin-top:40px;">Tocá para activar<br>la frecuencia de conexión</h2>
        <p class="tg-hint">La música te ayudará a conectar con tu guardián</p>
        <button class="tg-skip-btn" onclick="TG.skipMusic()">Continuar sin música</button>
    </div>

    <!-- INTRO -->
    <div id="screen-intro" class="tg-screen">
        <div class="tg-main-icon"></div>
        <h1 class="tg-title">El portal está abierto</h1>
        <p class="tg-subtitle">No llegaste acá por casualidad.<br>Algo en vos buscaba esto.</p>
        <p class="tg-hint">Este test dura aproximadamente 3 minutos.</p>
        <button class="tg-btn" onclick="TG.goToType()">COMENZAR</button>
    </div>

    <!-- BOTÓN FLOTANTE MÚSICA -->
    <div class="tg-music-toggle" id="music-toggle" onclick="TG.toggleMusic()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
        </svg>
    </div>

    <!-- TIPO -->
    <div id="screen-type" class="tg-screen">
        <h1 class="tg-title">¿Qué querés descubrir?</h1>
        <div class="tg-type-grid">
            <div class="tg-type-card" onclick="TG.selectType('self')">
                <div class="tg-type-icon">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <span class="tg-type-label">¿Qué guardián me pertenece?</span>
                <span class="tg-type-desc">Hacer el test para mí</span>
            </div>
            <div class="tg-type-card" onclick="TG.selectType('gift')">
                <div class="tg-type-icon">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 12 20 22 4 22 4 12"></polyline>
                        <rect x="2" y="7" width="20" height="5"></rect>
                        <line x1="12" y1="22" x2="12" y2="7"></line>
                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                    </svg>
                </div>
                <span class="tg-type-label">Quiero regalar a alguien</span>
                <span class="tg-type-desc">Descubrir qué duende le pertenece</span>
            </div>
        </div>
    </div>

    <!-- IDENTIDAD (PARA MÍ) -->
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
                        <option value="Ecuador">Ecuador</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Brasil">Brasil</option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Panamá">Panamá</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Honduras">Honduras</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Cuba">Cuba</option>
                        <option value="República Dominicana">República Dominicana</option>
                        <option value="Puerto Rico">Puerto Rico</option>
                        <option value="Estados Unidos">Estados Unidos</option>
                        <option value="Canadá">Canadá</option>
                        <option value="Alemania">Alemania</option>
                        <option value="Francia">Francia</option>
                        <option value="Italia">Italia</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Reino Unido">Reino Unido</option>
                        <option value="Suiza">Suiza</option>
                        <option value="Países Bajos">Países Bajos</option>
                        <option value="Bélgica">Bélgica</option>
                        <option value="Australia">Australia</option>
                        <option value="Nueva Zelanda">Nueva Zelanda</option>
                        <option value="Japón">Japón</option>
                        <option value="Israel">Israel</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
            </div>
            <button class="tg-btn" onclick="TG.saveIdentity()">CONTINUAR</button>
        </div>
    </div>

    <!-- IDENTIDAD REGALO: QUIEN REGALA -->
    <div id="screen-giver" class="tg-screen">
        <h1 class="tg-title">Primero, sobre vos</h1>
        <p class="tg-subtitle">Sos quien hace el regalo.</p>
        <div class="tg-form">
            <div class="tg-field">
                <label class="tg-label">Tu nombre</label>
                <input type="text" id="f-giver-nombre" class="tg-input" placeholder="¿Cómo te llaman?">
            </div>
            <div class="tg-field">
                <label class="tg-label">País</label>
                <select id="f-giver-pais" class="tg-input">
                    <option value="">Seleccionar...</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Chile">Chile</option>
                    <option value="México">México</option>
                    <option value="Colombia">Colombia</option>
                    <option value="España">España</option>
                    <option value="Perú">Perú</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Panamá">Panamá</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Honduras">Honduras</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Cuba">Cuba</option>
                    <option value="República Dominicana">República Dominicana</option>
                    <option value="Puerto Rico">Puerto Rico</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="Canadá">Canadá</option>
                    <option value="Alemania">Alemania</option>
                    <option value="Francia">Francia</option>
                    <option value="Italia">Italia</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Reino Unido">Reino Unido</option>
                    <option value="Suiza">Suiza</option>
                    <option value="Países Bajos">Países Bajos</option>
                    <option value="Bélgica">Bélgica</option>
                    <option value="Australia">Australia</option>
                    <option value="Nueva Zelanda">Nueva Zelanda</option>
                    <option value="Japón">Japón</option>
                    <option value="Israel">Israel</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>
            <button class="tg-btn" onclick="TG.saveGiver()">CONTINUAR</button>
        </div>
    </div>

    <!-- IDENTIDAD REGALO: QUIEN RECIBE -->
    <div id="screen-receiver" class="tg-screen">
        <h1 class="tg-title">Ahora, sobre esa persona</h1>
        <p class="tg-subtitle">Contame lo que sepas.</p>
        <div class="tg-form">
            <div class="tg-field">
                <label class="tg-label">Su nombre</label>
                <input type="text" id="f-receiver-nombre" class="tg-input" placeholder="¿Cómo se llama?">
            </div>
            <div class="tg-row">
                <div class="tg-field">
                    <label class="tg-label">Nacimiento (si sabés)</label>
                    <input type="date" id="f-receiver-nacimiento" class="tg-input">
                </div>
                <div class="tg-field">
                    <label class="tg-label">Relación</label>
                    <select id="f-receiver-relacion" class="tg-input">
                        <option value="">Seleccionar...</option>
                        <option value="madre">Mi mamá</option>
                        <option value="hija">Mi hija</option>
                        <option value="hermana">Mi hermana</option>
                        <option value="amiga">Mi amiga</option>
                        <option value="pareja">Mi pareja</option>
                        <option value="otro">Otra</option>
                    </select>
                </div>
            </div>
            <button class="tg-btn" onclick="TG.saveReceiver()">CONTINUAR</button>
        </div>
    </div>

    <!-- PREGUNTAS -->
    <div id="screen-question" class="tg-screen">
        <div id="gift-reminder" class="tg-gift-reminder">
            Recordá: estás respondiendo pensando en <strong id="receiver-name"></strong>
        </div>
        <div class="tg-question-block" id="q-block">PREGUNTA</div>
        <div class="tg-question-text" id="q-text">Cargando...</div>

        <div id="q-options" class="tg-options"></div>

        <div id="q-textarea" class="tg-textarea-wrap" style="display:none;">
            <textarea id="q-input" class="tg-textarea" placeholder="Escribí lo que sientas..."></textarea>
            <p class="tg-textarea-hint">No hay respuesta incorrecta.</p>
            <button class="tg-btn" onclick="TG.submitText()">CONTINUAR</button>
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
        <p class="tg-subtitle" id="contact-subtitle">Dejá tus datos para recibir el resultado.</p>
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
                        <option value="+51">+51 Perú</option>
                        <option value="+593">+593 Ecuador</option>
                        <option value="+58">+58 Venezuela</option>
                        <option value="+591">+591 Bolivia</option>
                        <option value="+595">+595 Paraguay</option>
                        <option value="+55">+55 Brasil</option>
                        <option value="+506">+506 Costa Rica</option>
                        <option value="+507">+507 Panamá</option>
                        <option value="+502">+502 Guatemala</option>
                        <option value="+504">+504 Honduras</option>
                        <option value="+503">+503 El Salvador</option>
                        <option value="+505">+505 Nicaragua</option>
                        <option value="+53">+53 Cuba</option>
                        <option value="+1809">+1809 R. Dominicana</option>
                        <option value="+1787">+1787 Puerto Rico</option>
                        <option value="+1">+1 USA/Canadá</option>
                        <option value="+49">+49 Alemania</option>
                        <option value="+33">+33 Francia</option>
                        <option value="+39">+39 Italia</option>
                        <option value="+351">+351 Portugal</option>
                        <option value="+44">+44 Reino Unido</option>
                        <option value="+41">+41 Suiza</option>
                        <option value="+31">+31 Países Bajos</option>
                        <option value="+32">+32 Bélgica</option>
                        <option value="+61">+61 Australia</option>
                        <option value="+64">+64 Nueva Zelanda</option>
                        <option value="+81">+81 Japón</option>
                        <option value="+972">+972 Israel</option>
                    </select>
                </div>
                <div class="tg-field">
                    <label class="tg-label">WhatsApp</label>
                    <input type="tel" id="f-whatsapp" class="tg-input" placeholder="Ej: 1155667788">
                </div>
            </div>
            <button class="tg-btn" onclick="TG.saveContact()">VER MI RESULTADO</button>
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
    var TOTAL_Q = 8;

    var TG = {
        type: 'self',
        step: 0,
        data: { identity: {}, giver: {}, receiver: {}, answers: {}, contact: {} },
        questions: [],
        musicPlaying: false,
        audio: null
    };

    // Guardianes - se cargan desde WooCommerce
    var GUARDIANES = [];
    var GUARDIANES_LOADED = false;

    // Fallback si no cargan los productos
    var GUARDIANES_FALLBACK = [
        { nombre: 'Finnegan', color1: '#00d4ff', color2: '#0066aa', inicial: 'F', url: 'https://duendesdeluruguay.com/shop/' },
        { nombre: 'Willow', color1: '#00ffcc', color2: '#008866', inicial: 'W', url: 'https://duendesdeluruguay.com/shop/' },
        { nombre: 'Bramble', color1: '#aa66ff', color2: '#6622aa', inicial: 'B', url: 'https://duendesdeluruguay.com/shop/' },
        { nombre: 'Ember', color1: '#ff6644', color2: '#aa2200', inicial: 'E', url: 'https://duendesdeluruguay.com/shop/' },
        { nombre: 'Moss', color1: '#66dd66', color2: '#228822', inicial: 'M', url: 'https://duendesdeluruguay.com/shop/' },
        { nombre: 'Luna', color1: '#ccccff', color2: '#6666aa', inicial: 'L', url: 'https://duendesdeluruguay.com/shop/' }
    ];

    // Cargar productos reales de WooCommerce
    function loadProducts() {
        fetch(API + '/test-guardian/products')
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success && data.products && data.products.length > 0) {
                    GUARDIANES = data.products.map(function(p) {
                        return {
                            nombre: p.nombre,
                            imagen: p.imagen,
                            url: p.url,
                            inicial: p.nombre.charAt(0).toUpperCase(),
                            color1: '#00d4ff',
                            color2: '#0066aa'
                        };
                    });
                    GUARDIANES_LOADED = true;
                    console.log('Productos cargados:', GUARDIANES.length);
                }
            })
            .catch(function(e) {
                console.log('Error cargando productos:', e);
            });
    }

    // Cargar productos al inicio
    loadProducts();

    // Preguntas predefinidas
    var QUESTIONS_SELF = [
        { id: 'q1', block: 'PRESENTE', type: 'text', text: '¿Qué es lo que más te pesa en este momento?', placeholder: 'Escribí sin filtros...' },
        { id: 'q2', block: 'PRESENTE', type: 'select', text: '¿Dónde sentís que se acumula la tensión?', options: ['En el pecho', 'En la garganta', 'En el estómago', 'En todo el cuerpo'] },
        { id: 'q3', block: 'PASADO', type: 'text', text: '¿Hay un recuerdo de tu infancia que aparece sin que lo llames?', placeholder: 'Contame...' },
        { id: 'q4', block: 'PRESENTE', type: 'select', text: '¿Qué patrón familiar sentís que repetís?', options: ['Miedo al abandono', 'Necesidad de control', 'Dificultad para recibir', 'Cargar con todo'] },
        { id: 'q5', block: 'PRESENTE', type: 'text', text: '¿Qué te da miedo admitir?', placeholder: 'Esto queda entre nosotras...' },
        { id: 'q6', block: 'FUTURO', type: 'text', text: '¿Qué le pedirías al universo si supieras que te escucha?', placeholder: 'Tu deseo...' },
        { id: 'q7', block: 'FUTURO', type: 'select', text: '¿Qué necesitás más en este momento?', options: ['Protección', 'Claridad', 'Fuerza', 'Paz interior'] },
        { id: 'q8', block: 'CIERRE', type: 'text', text: '¿Hay algo que te gustaría decirte a vos misma?', placeholder: 'Un mensaje...' }
    ];

    var QUESTIONS_GIFT = [
        { id: 'g1', block: 'VÍNCULO', type: 'text', text: '¿Por qué querés regalarle un guardián?', placeholder: 'Contame...' },
        { id: 'g2', block: 'VÍNCULO', type: 'select', text: '¿Qué momento está atravesando?', options: ['Un momento difícil', 'Un cambio importante', 'Algo para celebrar', 'No estoy segura'] },
        { id: 'g3', block: 'VÍNCULO', type: 'text', text: '¿Qué te gustaría que sienta al recibirlo?', placeholder: 'Describí...' },
        { id: 'g4', block: 'CONOCIMIENTO', type: 'select', text: '¿Cómo describirías su energía?', options: ['Sensible y profunda', 'Fuerte y protectora', 'Luminosa y alegre', 'Misteriosa y reservada'] },
        { id: 'g5', block: 'CONOCIMIENTO', type: 'text', text: '¿Hay algo más que quieras contarme sobre ella?', placeholder: 'Lo que sientas...' }
    ];

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

    TG.showMusicScreen = function() {
        show('music');
    };

    TG.activateFrequency = function() {
        TG.audio = document.getElementById('tg-audio');
        if (TG.audio) {
            TG.audio.volume = 0.3;
            TG.audio.play().then(function() {
                TG.musicPlaying = true;
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

    TG.skipMusic = function() {
        show('intro');
    };

    TG.toggleMusic = function() {
        if (!TG.audio) return;
        if (TG.musicPlaying) {
            TG.audio.pause();
            TG.musicPlaying = false;
        } else {
            TG.audio.play();
            TG.musicPlaying = true;
        }
    };

    TG.goToType = function() {
        show('type');
    };

    TG.selectType = function(type) {
        TG.type = type;
        TG.data.type = type;
        TG.questions = type === 'gift' ? QUESTIONS_GIFT : QUESTIONS_SELF;
        setTimeout(function() {
            show(type === 'gift' ? 'giver' : 'identity');
        }, 200);
    };

    TG.saveIdentity = function() {
        var nombre = document.getElementById('f-nombre').value.trim();
        var pais = document.getElementById('f-pais').value;
        if (!nombre || !pais) { alert('Por favor completá nombre y país.'); return; }
        TG.data.identity = {
            nombre: nombre,
            nacimiento: document.getElementById('f-nacimiento').value,
            pais: pais
        };
        TG.step = 1;
        TG.showQuestion();
    };

    TG.saveGiver = function() {
        var nombre = document.getElementById('f-giver-nombre').value.trim();
        var pais = document.getElementById('f-giver-pais').value;
        if (!nombre || !pais) { alert('Por favor completá nombre y país.'); return; }
        TG.data.giver = { nombre: nombre, pais: pais };
        show('receiver');
    };

    TG.saveReceiver = function() {
        var nombre = document.getElementById('f-receiver-nombre').value.trim();
        if (!nombre) { alert('Por favor ingresá el nombre.'); return; }
        TG.data.receiver = {
            nombre: nombre,
            nacimiento: document.getElementById('f-receiver-nacimiento').value,
            relacion: document.getElementById('f-receiver-relacion').value
        };
        TG.data.identity = {
            nombre: nombre,
            esRegalo: true,
            nombreQuienRegala: TG.data.giver.nombre
        };
        document.getElementById('gift-reminder').classList.add('visible');
        document.getElementById('receiver-name').textContent = nombre;
        document.getElementById('contact-subtitle').textContent = 'Dejá TUS datos. El resultado será para ' + nombre + '.';
        TG.step = 1;
        TG.showQuestion();
    };

    TG.showQuestion = function() {
        var total = TG.questions.length;
        progress(TG.step, total);

        if (TG.step > total) {
            show('contact');
            return;
        }

        var q = TG.questions[TG.step - 1];
        if (!q) { show('contact'); return; }

        document.getElementById('q-block').textContent = q.block;
        document.getElementById('q-text').textContent = q.text;

        var optionsEl = document.getElementById('q-options');
        var textareaEl = document.getElementById('q-textarea');
        var inputEl = document.getElementById('q-input');

        optionsEl.innerHTML = '';
        optionsEl.style.display = 'none';
        textareaEl.style.display = 'none';

        if (q.type === 'select' && q.options) {
            optionsEl.style.display = 'flex';
            q.options.forEach(function(opt, i) {
                var div = document.createElement('div');
                div.className = 'tg-option';
                div.innerHTML = '<span class="tg-option-dot"></span><span class="tg-option-text">' + opt + '</span>';
                div.onclick = function() { TG.answer(q.id, opt); };
                optionsEl.appendChild(div);
            });
        } else {
            textareaEl.style.display = 'block';
            inputEl.value = '';
            inputEl.placeholder = q.placeholder || 'Escribí lo que sientas...';
            inputEl.dataset.qid = q.id;
            setTimeout(function() { inputEl.focus(); }, 100);
        }

        show('question');
    };

    TG.answer = function(qid, value) {
        TG.data.answers[qid] = value;
        TG.step++;
        TG.showQuestion();
    };

    TG.submitText = function() {
        var input = document.getElementById('q-input');
        var text = input.value.trim();
        if (!text) { alert('Por favor escribí algo.'); return; }
        TG.data.answers[input.dataset.qid] = text;
        input.value = ''; // Limpiar para próxima pregunta
        TG.step++;
        TG.showQuestion();
    };

    TG.saveContact = function() {
        var email = document.getElementById('f-email').value.trim();
        if (!email) { alert('Por favor ingresá tu email.'); return; }
        TG.data.contact = {
            email: email,
            prefijo: document.getElementById('f-prefijo').value,
            whatsapp: document.getElementById('f-whatsapp').value.trim()
        };
        show('loading');
        TG.processResult();
    };

    TG.processResult = function() {
        document.getElementById('loading-msg').textContent = 'Tu guardián está despertando...';

        fetch(API + '/test-guardian/process-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TG.data)
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            TG.renderResult(data);
        })
        .catch(function() {
            TG.renderResult({
                guardian: { nombre: 'El Guardián de la Protección' },
                revelation: TG.data.identity.nombre + ', tu energía habla claro. Estás lista para soltar lo que ya no te pertenece.',
                sealedPhrase: 'Tu fuerza es más grande que tu miedo.',
                reasons: ['Porque tu energía pidió protección', 'Porque el cansancio necesita descanso']
            });
        });
    };

    TG.renderResult = function(data) {
        var nombre = TG.data.identity.nombre;
        var isGift = TG.type === 'gift';

        // Usar productos cargados o fallback
        var productList = GUARDIANES_LOADED && GUARDIANES.length >= 3 ? GUARDIANES : GUARDIANES_FALLBACK;

        // Seleccionar 3 guardianes aleatorios con porcentajes
        var shuffled = productList.slice().sort(function() { return 0.5 - Math.random(); });
        var guardian1 = shuffled[0];
        var guardian2 = shuffled[1];
        var guardian3 = shuffled[2];
        var pct1 = Math.floor(Math.random() * 15) + 85; // 85-99%
        var pct2 = Math.floor(Math.random() * 20) + 60; // 60-79%
        var pct3 = Math.floor(Math.random() * 20) + 50; // 50-69%

        var html = '';

        if (isGift) {
            html += '<h1 class="tg-title">' + nombre + ' tiene guardianes esperándola</h1>';
            html += '<p class="tg-subtitle">Un regalo de ' + TG.data.giver.nombre + '</p>';
        } else {
            html += '<h1 class="tg-title">' + nombre + ', tus guardianes te encontraron</h1>';
        }

        // Función para generar el orbe (con imagen o gradiente)
        function renderGuardianOrb(g, size, isMain) {
            var orbHtml = '';
            var fontSize = isMain ? '54px' : '36px';
            var shadow = isMain ? '0 0 50px rgba(0,212,255,0.6)' : '0 0 30px rgba(0,212,255,0.4)';

            if (g.imagen) {
                // Con imagen real del producto
                orbHtml = '<img src="' + g.imagen + '" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;object-fit:cover;border:3px solid #00d4ff;box-shadow:' + shadow + ';" alt="' + g.nombre + '">';
            } else {
                // Fallback con gradiente
                orbHtml = '<div style="width:' + size + 'px;height:' + size + 'px;background:linear-gradient(135deg,' + g.color1 + ' 0%,' + g.color2 + ' 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:' + fontSize + ';font-family:Cinzel Decorative,serif;color:#fff;box-shadow:' + shadow + ';">' + g.inicial + '</div>';
            }
            return orbHtml;
        }

        // Grid de 3 guardianes
        html += '<div class="tg-guardians-grid">';

        // Guardián secundario izquierdo
        html += '<a href="' + (guardian2.url || 'https://duendesdeluruguay.com/shop/') + '" target="_blank" class="tg-guardian-circle secondary" style="text-decoration:none;">';
        html += '<div class="tg-guardian-img-wrap">';
        html += renderGuardianOrb(guardian2, 100, false);
        html += '<span class="tg-guardian-percent">' + pct2 + '%</span>';
        html += '</div>';
        html += '<span class="tg-guardian-name">' + guardian2.nombre + '</span>';
        html += '</a>';

        // Guardián principal (centro)
        html += '<a href="' + (guardian1.url || 'https://duendesdeluruguay.com/shop/') + '" target="_blank" class="tg-guardian-circle main" style="text-decoration:none;">';
        html += '<div class="tg-guardian-img-wrap">';
        html += renderGuardianOrb(guardian1, 150, true);
        html += '<span class="tg-guardian-percent">' + pct1 + '%</span>';
        html += '</div>';
        html += '<span class="tg-guardian-name">' + guardian1.nombre + '</span>';
        html += '</a>';

        // Guardián secundario derecho
        html += '<a href="' + (guardian3.url || 'https://duendesdeluruguay.com/shop/') + '" target="_blank" class="tg-guardian-circle secondary" style="text-decoration:none;">';
        html += '<div class="tg-guardian-img-wrap">';
        html += renderGuardianOrb(guardian3, 100, false);
        html += '<span class="tg-guardian-percent">' + pct3 + '%</span>';
        html += '</div>';
        html += '<span class="tg-guardian-name">' + guardian3.nombre + '</span>';
        html += '</a>';

        html += '</div>'; // fin grid

        html += '<p class="tg-hint" style="margin-top:15px;">Tocá cualquier guardián para conocerlo</p>';

        html += '<p class="tg-subtitle" style="margin-top:40px;">' + (data.revelation || '') + '</p>';

        // Frase sellada
        var phrase = data.sealedPhrase || 'Tu fuerza es más grande que tu miedo.';
        html += '<div class="tg-result-phrase">';
        html += '<p>"' + phrase + '"</p>';
        html += '</div>';

        // Mensaje de email enviado
        html += '<div class="tg-email-sent">';
        html += 'Te enviamos el resultado completo a <strong>' + TG.data.contact.email + '</strong>';
        html += '</div>';

        // Botón para ver guardianes
        html += '<a href="https://duendesdeluruguay.com/shop/" class="tg-btn" style="text-decoration:none;display:inline-block;">VER GUARDIANES EN LA TIENDA</a>';

        document.getElementById('result-content').innerHTML = html;
        show('result');
        progress(TG.questions.length + 1, TG.questions.length);

        // Enviar email con resultado
        TG.sendResultEmail(guardian1, pct1, phrase);
    };

    TG.sendResultEmail = function(guardian, porcentaje, frase) {
        fetch(API + '/test-guardian/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TG.data.contact.email,
                nombre: TG.data.identity.nombre,
                guardian: guardian.nombre,
                porcentaje: porcentaje,
                frase: frase,
                esRegalo: TG.type === 'gift',
                nombreQuienRegala: TG.data.giver.nombre || null
            })
        }).catch(function(e) { console.log('Email error:', e); });
    };

    window.TG = TG;
    progress(0, TOTAL_Q);
})();
</script>
<!-- /TEST GUARDIAN v10 -->
<?php
    return ob_get_clean();
}

// Registrar todos los shortcodes posibles
add_shortcode('test_guardian_v10', 'duendes_test_guardian_v10_render');
add_shortcode('test_guardian_v9', 'duendes_test_guardian_v10_render');
add_shortcode('test_del_guardian', 'duendes_test_guardian_v10_render');
add_shortcode('duendes_test_guardian_v3', 'duendes_test_guardian_v10_render');
