<?php
/*
Plugin Name: Test Guardian v9 - Preguntas Dinámicas con IA
Description: Test del Guardian con preguntas personalizadas por Claude, header/footer, sistema de aprendizaje
Version: 9.0
*/
if (!defined('ABSPATH')) exit;

function duendes_test_guardian_v9_render() {
    ob_start();
?>
<!-- DUENDES TEST GUARDIAN v9 - PREGUNTAS DINÁMICAS CON IA -->
<div id="tg-portal" class="tg-portal">
<style>
/* === FIX CRÍTICO: Forzar visibilidad del contenedor padre === */
.elementor-shortcode:has(#tg-portal),
.elementor-widget-shortcode:has(#tg-portal),
.elementor-widget:has(#tg-portal) {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    height: auto !important;
    overflow: visible !important;
    min-height: auto !important;
}
#tg-portal {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

/* === RESET Y BASE === */
#tg-portal, #tg-portal * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Georgia', 'Times New Roman', serif;
}

#tg-portal {
    min-height: 100vh;
    background: #050508;
    position: relative;
    overflow: hidden;
}

/* Partículas de fondo */
#tg-portal::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
        radial-gradient(ellipse at 20% 30%, rgba(0, 168, 255, 0.03) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, rgba(0, 168, 255, 0.02) 0%, transparent 50%);
    pointer-events: none;
}

/* === HEADER FIJO === */
.tg-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: rgba(5, 5, 8, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 168, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 1000;
}

.tg-header-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #fff;
    font-size: 16px;
}

.tg-header-logo span {
    color: #00a8ff;
}

.tg-header-back {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.7);
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
}

.tg-header-back:hover {
    border-color: #00a8ff;
    color: #00a8ff;
}

/* === FOOTER FIJO === */
.tg-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: rgba(5, 5, 8, 0.95);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(0, 168, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    z-index: 1000;
}

.tg-progress-container {
    width: 100%;
    max-width: 400px;
}

.tg-progress-text {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    text-align: center;
    margin-bottom: 6px;
}

.tg-progress-bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
}

.tg-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00a8ff, #00d4ff);
    border-radius: 2px;
    transition: width 0.5s ease;
    width: 0%;
}

/* === CONTENEDOR PRINCIPAL === */
.tg-wrap {
    max-width: 700px;
    margin: 0 auto;
    padding: 80px 20px 70px;
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* === PANTALLAS === */
.tg-screen {
    display: none;
    animation: tgFadeIn 0.6s ease-out;
}

.tg-screen.tg-active {
    display: block;
}

@keyframes tgFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* === TIPOGRAFÍA === */
.tg-icon {
    font-size: 64px;
    display: block;
    text-align: center;
    margin-bottom: 25px;
    filter: drop-shadow(0 0 20px rgba(0, 168, 255, 0.3));
}

.tg-title {
    font-size: 32px;
    color: #ffffff;
    text-align: center;
    margin-bottom: 20px;
    font-weight: 400;
    line-height: 1.3;
    text-shadow: 0 0 30px rgba(0, 168, 255, 0.2);
}

.tg-subtitle {
    font-size: 17px;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    line-height: 1.7;
    margin-bottom: 15px;
}

.tg-hint {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
    font-style: italic;
    margin-bottom: 30px;
}

/* === BOTONES === */
.tg-btn-primary {
    display: block;
    width: 100%;
    max-width: 320px;
    margin: 30px auto 0;
    padding: 18px 40px;
    background: transparent;
    border: 2px solid #00a8ff;
    color: #fff;
    font-size: 16px;
    font-family: inherit;
    cursor: pointer;
    border-radius: 30px;
    transition: all 0.4s;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.tg-btn-primary:hover {
    background: rgba(0, 168, 255, 0.15);
    box-shadow: 0 0 30px rgba(0, 168, 255, 0.3);
    transform: translateY(-2px);
}

/* === FORMULARIO IDENTIDAD === */
.tg-form-group {
    margin-bottom: 20px;
}

.tg-form-label {
    display: block;
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.tg-form-input,
.tg-form-select {
    width: 100%;
    padding: 14px 18px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(0, 168, 255, 0.3);
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
    font-family: inherit;
    transition: all 0.3s;
}

.tg-form-input:focus,
.tg-form-select:focus {
    outline: none;
    border-color: #00a8ff;
    box-shadow: 0 0 15px rgba(0, 168, 255, 0.2);
}

.tg-form-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

.tg-form-select option {
    background: #0a0a0a;
    color: #fff;
}

.tg-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

/* === PREGUNTAS === */
.tg-question-container {
    text-align: center;
    padding: 20px 0;
}

.tg-question-block {
    font-size: 12px;
    color: #00a8ff;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 15px;
}

.tg-question-text {
    font-size: 24px;
    color: #ffffff;
    line-height: 1.5;
    margin-bottom: 30px;
    min-height: 72px;
}

.tg-question-hint {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
    margin-top: 10px;
}

/* === OPCIONES (BURBUJAS) === */
.tg-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
}

.tg-option {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(0, 168, 255, 0.25);
    border-radius: 12px;
    padding: 16px 20px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0;
    transform: translateY(20px);
}

.tg-option.tg-visible {
    opacity: 1;
    transform: translateY(0);
}

.tg-option:hover {
    background: rgba(0, 168, 255, 0.1);
    border-color: #00a8ff;
    transform: translateX(5px);
}

.tg-option-icon {
    font-size: 24px;
}

.tg-option-text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    text-align: left;
}

/* === TEXTO LIBRE === */
.tg-freetext {
    margin-top: 20px;
}

.tg-freetext textarea {
    width: 100%;
    min-height: 120px;
    padding: 18px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(0, 168, 255, 0.3);
    border-radius: 12px;
    color: #fff;
    font-size: 16px;
    font-family: inherit;
    line-height: 1.6;
    resize: vertical;
    transition: all 0.3s;
}

.tg-freetext textarea:focus {
    outline: none;
    border-color: #00a8ff;
    box-shadow: 0 0 20px rgba(0, 168, 255, 0.15);
}

.tg-freetext textarea::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

.tg-freetext-hint {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 10px;
    text-align: center;
}

/* === LOADING ENTRE PREGUNTAS === */
.tg-loading-question {
    text-align: center;
    padding: 60px 20px;
}

.tg-loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(0, 168, 255, 0.2);
    border-top-color: #00a8ff;
    border-radius: 50%;
    animation: tgSpin 1s linear infinite;
    margin: 0 auto 25px;
}

@keyframes tgSpin {
    to { transform: rotate(360deg); }
}

.tg-loading-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
    line-height: 1.6;
}

.tg-loading-subtext {
    color: rgba(255, 255, 255, 0.4);
    font-size: 14px;
    margin-top: 15px;
    font-style: italic;
}

/* === RESULTADO === */
.tg-result-header {
    text-align: center;
    margin-bottom: 40px;
}

.tg-result-name {
    font-size: 36px;
    color: #00a8ff;
    margin-bottom: 10px;
}

.tg-result-tagline {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
}

.tg-result-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 40px;
}

.tg-result-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(0, 168, 255, 0.2);
    border-radius: 16px;
    padding: 25px;
}

.tg-result-revelation {
    font-size: 17px;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.8;
    margin-bottom: 20px;
}

.tg-result-reasons {
    list-style: none;
}

.tg-result-reasons li {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    padding: 8px 0;
    padding-left: 20px;
    position: relative;
}

.tg-result-reasons li::before {
    content: '✦';
    position: absolute;
    left: 0;
    color: #00a8ff;
}

.tg-guardian-card {
    text-align: center;
}

.tg-guardian-image {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #00a8ff;
    box-shadow: 0 0 30px rgba(0, 168, 255, 0.3);
    margin-bottom: 20px;
}

.tg-guardian-name {
    font-size: 22px;
    color: #fff;
    margin-bottom: 8px;
}

.tg-guardian-price {
    font-size: 18px;
    color: #00a8ff;
    margin-bottom: 15px;
}

.tg-btn-cta {
    display: inline-block;
    padding: 14px 30px;
    background: #00a8ff;
    color: #000;
    font-weight: bold;
    border-radius: 25px;
    text-decoration: none;
    transition: all 0.3s;
    margin-bottom: 20px;
}

.tg-btn-cta:hover {
    background: #00d4ff;
    transform: scale(1.05);
}

.tg-ritual-box {
    background: rgba(0, 168, 255, 0.1);
    border-radius: 10px;
    padding: 15px;
    margin-top: 15px;
}

.tg-ritual-title {
    font-size: 12px;
    color: #00a8ff;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
}

.tg-ritual-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    font-style: italic;
}

/* === ALTAR FINAL === */
.tg-altar {
    text-align: center;
    padding: 40px 20px;
    background: rgba(0, 168, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(0, 168, 255, 0.2);
    margin-top: 30px;
}

.tg-altar-phrase {
    font-size: 22px;
    color: #00a8ff;
    margin-bottom: 20px;
    line-height: 1.5;
}

.tg-altar-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.tg-btn-secondary {
    padding: 12px 25px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
}

.tg-btn-secondary:hover {
    border-color: #00a8ff;
    color: #00a8ff;
}

/* === NEWSLETTER === */
.tg-newsletter {
    margin-top: 30px;
    padding-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.tg-newsletter-title {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 15px;
}

.tg-newsletter-form {
    display: flex;
    gap: 10px;
    max-width: 400px;
    margin: 0 auto;
}

.tg-newsletter-input {
    flex: 1;
    padding: 12px 18px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(0, 168, 255, 0.3);
    border-radius: 25px;
    color: #fff;
    font-size: 14px;
}

.tg-newsletter-btn {
    padding: 12px 25px;
    background: #00a8ff;
    color: #000;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s;
}

.tg-newsletter-status {
    margin-top: 10px;
    font-size: 14px;
    text-align: center;
}

.tg-newsletter-status.loading { color: #00a8ff; }
.tg-newsletter-status.success { color: #4ecdc4; }
.tg-newsletter-status.error { color: #ff6b6b; }

/* === MODAL === */
.tg-modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 2000;
    align-items: center;
    justify-content: center;
}

.tg-modal-overlay.tg-active {
    display: flex;
}

.tg-modal {
    background: #0a0a0f;
    border: 1px solid rgba(0, 168, 255, 0.3);
    border-radius: 16px;
    padding: 40px;
    max-width: 400px;
    text-align: center;
    animation: tgFadeIn 0.3s ease;
}

.tg-modal-icon {
    font-size: 48px;
    margin-bottom: 20px;
}

.tg-modal-title {
    font-size: 20px;
    color: #fff;
    margin-bottom: 15px;
}

.tg-modal-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 25px;
}

.tg-modal-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.tg-modal-btn {
    padding: 12px 30px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
}

.tg-modal-btn.tg-stay {
    background: #00a8ff;
    color: #000;
    border: none;
}

.tg-modal-btn.tg-leave {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
    .tg-result-grid {
        grid-template-columns: 1fr;
    }

    .tg-form-row {
        grid-template-columns: 1fr;
    }

    .tg-title {
        font-size: 26px;
    }

    .tg-question-text {
        font-size: 20px;
    }

    .tg-newsletter-form {
        flex-direction: column;
    }
}
</style>

<!-- HEADER -->
<div class="tg-header">
    <div class="tg-header-logo">
        <span>✦</span> Test del Guardián
    </div>
    <button class="tg-header-back" onclick="TG.confirmExit()">← Volver</button>
</div>

<!-- FOOTER -->
<div class="tg-footer">
    <div class="tg-progress-container">
        <div class="tg-progress-text" id="tg-progress-text">Preparando el portal...</div>
        <div class="tg-progress-bar">
            <div class="tg-progress-fill" id="tg-progress-fill"></div>
        </div>
    </div>
</div>

<!-- MODAL DE CONFIRMACIÓN -->
<div class="tg-modal-overlay" id="tg-exit-modal">
    <div class="tg-modal">
        <div class="tg-modal-icon">🌙</div>
        <div class="tg-modal-title">¿Estás segura de irte?</div>
        <div class="tg-modal-text">Tu guardián está esperándote. Si te vas ahora, tendrás que empezar de nuevo.</div>
        <div class="tg-modal-buttons">
            <button class="tg-modal-btn tg-stay" onclick="TG.closeModal()">Quedarme</button>
            <button class="tg-modal-btn tg-leave" onclick="TG.exit()">Salir</button>
        </div>
    </div>
</div>

<div class="tg-wrap">

    <!-- PANTALLA: INTRO -->
    <div id="tg-intro" class="tg-screen tg-active">
        <div class="tg-icon">🔮</div>
        <h1 class="tg-title">El portal está abierto.</h1>
        <p class="tg-subtitle">
            No llegaste acá por casualidad.<br>
            Algo en vos buscaba esto.
        </p>
        <p class="tg-hint">Este test dura aproximadamente 3 minutos.<br>Cada pregunta es personalizada para vos.</p>
        <button class="tg-btn-primary" onclick="TG.start()">ESTOY LISTA</button>
    </div>

    <!-- PANTALLA: IDENTIDAD -->
    <div id="tg-identity" class="tg-screen">
        <div class="tg-icon">✨</div>
        <h2 class="tg-title">Antes de empezar, necesito conocerte.</h2>
        <p class="tg-subtitle">Esto no es un formulario. Es la llave del portal.</p>

        <div class="tg-form-group">
            <label class="tg-form-label">¿Cómo te llaman?</label>
            <input type="text" id="tg-nombre" class="tg-form-input" placeholder="Tu nombre..." autocomplete="given-name">
        </div>

        <div class="tg-form-row">
            <div class="tg-form-group">
                <label class="tg-form-label">Fecha de nacimiento</label>
                <input type="date" id="tg-nacimiento" class="tg-form-input">
            </div>
            <div class="tg-form-group">
                <label class="tg-form-label">Sexo (opcional)</label>
                <select id="tg-sexo" class="tg-form-select">
                    <option value="">Prefiero no decir</option>
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                    <option value="O">Otro</option>
                </select>
            </div>
        </div>

        <div class="tg-form-row">
            <div class="tg-form-group">
                <label class="tg-form-label">Nacionalidad</label>
                <select id="tg-nacionalidad" class="tg-form-select">
                    <option value="">Seleccionar...</option>
                    <option value="AR">Argentina</option>
                    <option value="UY">Uruguay</option>
                    <option value="CL">Chile</option>
                    <option value="MX">México</option>
                    <option value="CO">Colombia</option>
                    <option value="PE">Perú</option>
                    <option value="ES">España</option>
                    <option value="US">Estados Unidos</option>
                    <option value="BR">Brasil</option>
                    <option value="OT">Otro</option>
                </select>
            </div>
            <div class="tg-form-group">
                <label class="tg-form-label">País donde vivís</label>
                <select id="tg-pais" class="tg-form-select">
                    <option value="">Seleccionar...</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Chile">Chile</option>
                    <option value="México">México</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Perú">Perú</option>
                    <option value="España">España</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>
        </div>

        <div class="tg-form-group">
            <label class="tg-form-label">Ciudad (opcional)</label>
            <input type="text" id="tg-ciudad" class="tg-form-input" placeholder="Tu ciudad...">
        </div>

        <button class="tg-btn-primary" onclick="TG.saveIdentity()">CONTINUAR</button>
    </div>

    <!-- PANTALLA: PREGUNTAS -->
    <div id="tg-questions" class="tg-screen">
        <div class="tg-question-container">
            <div class="tg-question-block" id="tg-q-block"></div>
            <div class="tg-question-text" id="tg-q-text"></div>
            <div class="tg-question-hint" id="tg-q-hint"></div>
        </div>
        <div class="tg-options" id="tg-q-options"></div>
        <div class="tg-freetext" id="tg-q-freetext" style="display:none;">
            <textarea id="tg-q-textarea" placeholder=""></textarea>
            <p class="tg-freetext-hint">Escribí lo que sientas. No hay respuesta incorrecta.</p>
            <button class="tg-btn-primary" onclick="TG.submitFreetext()">CONTINUAR</button>
        </div>
    </div>

    <!-- PANTALLA: LOADING PREGUNTA -->
    <div id="tg-loading-q" class="tg-screen">
        <div class="tg-loading-question">
            <div class="tg-loading-spinner"></div>
            <div class="tg-loading-text" id="tg-loading-msg">Tu guardián está preparando la siguiente pregunta...</div>
            <div class="tg-loading-subtext" id="tg-loading-sub">Las preguntas personalizadas toman un momento.</div>
        </div>
    </div>

    <!-- PANTALLA: CONTACTO -->
    <div id="tg-contact" class="tg-screen">
        <div class="tg-icon">📬</div>
        <h2 class="tg-title">Ya casi llegamos.</h2>
        <p class="tg-subtitle">Dejá tus datos para recibir tu resultado completo y tu tarjeta del guardián.</p>

        <div class="tg-form-group">
            <label class="tg-form-label">Email</label>
            <input type="email" id="tg-email" class="tg-form-input" placeholder="tu@email.com" autocomplete="email">
        </div>

        <div class="tg-form-row">
            <div class="tg-form-group">
                <label class="tg-form-label">Prefijo</label>
                <select id="tg-prefijo" class="tg-form-select">
                    <option value="+54">+54 (AR)</option>
                    <option value="+598">+598 (UY)</option>
                    <option value="+56">+56 (CL)</option>
                    <option value="+52">+52 (MX)</option>
                    <option value="+57">+57 (CO)</option>
                    <option value="+51">+51 (PE)</option>
                    <option value="+34">+34 (ES)</option>
                    <option value="+1">+1 (US)</option>
                    <option value="+55">+55 (BR)</option>
                </select>
            </div>
            <div class="tg-form-group">
                <label class="tg-form-label">WhatsApp</label>
                <input type="tel" id="tg-whatsapp" class="tg-form-input" placeholder="Ej: 1155667788">
            </div>
        </div>

        <button class="tg-btn-primary" onclick="TG.saveContact()">VER MI RESULTADO</button>
    </div>

    <!-- PANTALLA: LOADING RESULTADO -->
    <div id="tg-loading" class="tg-screen">
        <div class="tg-loading-question">
            <div class="tg-loading-spinner"></div>
            <div class="tg-loading-text">Tu guardián está despertando...</div>
            <div class="tg-loading-subtext">Estamos canalizando tu resultado personalizado.</div>
        </div>
    </div>

    <!-- PANTALLA: RESULTADO -->
    <div id="tg-result" class="tg-screen">
        <!-- Se genera dinámicamente -->
    </div>

</div>
</div>

<script>
(function() {
    'use strict';

    var API_URL = 'https://duendes-vercel.vercel.app/api';
    var TOTAL_QUESTIONS = 11;

    var TG = {
        step: 0,
        currentQuestion: null,
        data: {
            identity: {},
            answers: {},
            contact: {}
        }
    };

    // Helpers
    function show(id) {
        document.querySelectorAll('.tg-screen').forEach(function(s) {
            s.classList.remove('tg-active');
        });
        var el = document.getElementById(id);
        if (el) el.classList.add('tg-active');
    }

    function updateProgress(step, total) {
        var pct = Math.round((step / total) * 100);
        var fill = document.getElementById('tg-progress-fill');
        var text = document.getElementById('tg-progress-text');
        if (fill) fill.style.width = pct + '%';
        if (text) {
            if (step === 0) {
                text.textContent = 'Preparando el portal...';
            } else if (step <= total) {
                text.textContent = 'Pregunta ' + step + ' de ' + total;
            } else {
                text.textContent = 'Procesando tu resultado...';
            }
        }
    }

    // Iniciar test
    TG.start = function() {
        show('tg-identity');
        updateProgress(0, TOTAL_QUESTIONS);
    };

    // Guardar identidad
    TG.saveIdentity = function() {
        var nombre = document.getElementById('tg-nombre').value.trim();
        var nacimiento = document.getElementById('tg-nacimiento').value;
        var nacionalidad = document.getElementById('tg-nacionalidad').value;
        var pais = document.getElementById('tg-pais').value;

        if (!nombre || !nacimiento || !nacionalidad || !pais) {
            alert('Por favor completá los campos obligatorios.');
            return;
        }

        TG.data.identity = {
            nombre: nombre,
            nacimiento: nacimiento,
            sexo: document.getElementById('tg-sexo').value,
            nacionalidad: nacionalidad,
            pais: pais,
            ciudad: document.getElementById('tg-ciudad').value.trim()
        };

        // Preseleccionar prefijo según país
        var prefijos = {
            'Argentina': '+54',
            'Uruguay': '+598',
            'Chile': '+56',
            'México': '+52',
            'Colombia': '+57',
            'Perú': '+51',
            'España': '+34',
            'Estados Unidos': '+1',
            'Brasil': '+55'
        };
        var prefijo = prefijos[pais] || '+54';
        document.getElementById('tg-prefijo').value = prefijo;

        TG.step = 1;
        TG.loadNextQuestion();
    };

    // Cargar siguiente pregunta desde API
    TG.loadNextQuestion = function() {
        show('tg-loading-q');
        updateProgress(TG.step, TOTAL_QUESTIONS);

        // Mensajes de loading variados
        var msgs = [
            'Tu guardián está preparando la siguiente pregunta...',
            'Canalizando la energía de tus respuestas...',
            'El portal está alineándose...',
            'Escuchando lo que tu alma necesita preguntar...'
        ];
        var subs = [
            'Las preguntas personalizadas toman un momento.',
            'Cada pregunta es única para vos.',
            'Tu guardián está muy atento.',
            'La magia necesita su tiempo.'
        ];
        document.getElementById('tg-loading-msg').textContent = msgs[Math.floor(Math.random() * msgs.length)];
        document.getElementById('tg-loading-sub').textContent = subs[Math.floor(Math.random() * subs.length)];

        // Timeout para mostrar mensaje adicional si demora
        var extraMsgTimeout = setTimeout(function() {
            document.getElementById('tg-loading-sub').textContent = 'Esto está tardando más de lo normal, pero vale la pena esperar...';
        }, 4000);

        fetch(API_URL + '/test-guardian/next-question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                step: TG.step,
                previousAnswers: TG.data.answers,
                identity: TG.data.identity
            })
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            clearTimeout(extraMsgTimeout);

            if (data.error) {
                console.error('Error:', data.error);
                TG.loadFallbackQuestion();
                return;
            }

            TG.currentQuestion = data.question;
            TG.renderQuestion(data.question);
        })
        .catch(function(err) {
            clearTimeout(extraMsgTimeout);
            console.error('Fetch error:', err);
            TG.loadFallbackQuestion();
        });
    };

    // Fallback si API falla
    TG.loadFallbackQuestion = function() {
        var fallbacks = [
            { id: 'fallback_1', type: 'text', text: '¿Qué es lo que más te pesa en este momento?', placeholder: 'Escribí lo que sientas...', hint: '', block: 'presente' },
            { id: 'fallback_2', type: 'select', text: '¿Dónde sentís que se acumula la tensión?', options: [
                { id: 'pecho', label: 'En el pecho', icon: '💔' },
                { id: 'garganta', label: 'En la garganta', icon: '🗣️' },
                { id: 'estomago', label: 'En el estómago', icon: '🌀' },
                { id: 'todo', label: 'En todo el cuerpo', icon: '😔' }
            ], block: 'presente' }
        ];
        var q = fallbacks[TG.step % fallbacks.length];
        TG.currentQuestion = q;
        TG.renderQuestion(q);
    };

    // Renderizar pregunta
    TG.renderQuestion = function(q) {
        var blockNames = {
            'pasado': '✦ PASADO',
            'presente': '✦ PRESENTE',
            'futuro': '✦ FUTURO',
            'cierre': '✦ CIERRE'
        };

        document.getElementById('tg-q-block').textContent = blockNames[q.block] || '✦ PREGUNTA ' + TG.step;
        document.getElementById('tg-q-text').textContent = q.text;
        document.getElementById('tg-q-hint').textContent = q.hint || '';

        var optionsEl = document.getElementById('tg-q-options');
        var freetextEl = document.getElementById('tg-q-freetext');

        optionsEl.innerHTML = '';
        optionsEl.style.display = 'none';
        freetextEl.style.display = 'none';

        if (q.type === 'select' && q.options) {
            optionsEl.style.display = 'flex';

            q.options.forEach(function(opt, i) {
                var div = document.createElement('div');
                div.className = 'tg-option';
                div.innerHTML = '<span class="tg-option-icon">' + (opt.icon || '✦') + '</span><span class="tg-option-text">' + opt.label + '</span>';
                div.onclick = function() {
                    TG.answerSelect(q.id, opt);
                };
                optionsEl.appendChild(div);

                // Animación stagger
                setTimeout(function() {
                    div.classList.add('tg-visible');
                }, 100 + (i * 80));
            });
        } else {
            freetextEl.style.display = 'block';
            var textarea = document.getElementById('tg-q-textarea');
            textarea.value = '';
            textarea.placeholder = q.placeholder || 'Escribí lo que sientas...';
            textarea.focus();
        }

        show('tg-questions');
    };

    // Responder opción
    TG.answerSelect = function(qid, opt) {
        TG.data.answers[qid] = opt;
        TG.nextQuestion();
    };

    // Responder texto libre
    TG.submitFreetext = function() {
        var text = document.getElementById('tg-q-textarea').value.trim();
        if (!text || text.length < 3) {
            alert('Por favor escribí algo antes de continuar.');
            return;
        }
        TG.data.answers[TG.currentQuestion.id] = text;
        TG.nextQuestion();
    };

    // Siguiente pregunta o contacto
    TG.nextQuestion = function() {
        TG.step++;

        if (TG.step > TOTAL_QUESTIONS) {
            show('tg-contact');
            updateProgress(TOTAL_QUESTIONS, TOTAL_QUESTIONS);
        } else {
            TG.loadNextQuestion();
        }
    };

    // Guardar contacto y procesar resultado
    TG.saveContact = function() {
        var email = document.getElementById('tg-email').value.trim();
        var whatsapp = document.getElementById('tg-whatsapp').value.trim();

        if (!email) {
            alert('Por favor ingresá tu email.');
            return;
        }

        TG.data.contact = {
            email: email,
            prefijo: document.getElementById('tg-prefijo').value,
            whatsapp: whatsapp
        };

        show('tg-loading');
        updateProgress(TOTAL_QUESTIONS + 1, TOTAL_QUESTIONS);
        TG.processResult();
    };

    // Procesar resultado con API
    TG.processResult = function() {
        fetch(API_URL + '/test-guardian/process-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TG.data)
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data.error) {
                console.error('Error:', data.error);
                TG.renderFallbackResult();
                return;
            }
            TG.renderResult(data);
        })
        .catch(function(err) {
            console.error('Fetch error:', err);
            TG.renderFallbackResult();
        });
    };

    // Renderizar resultado
    TG.renderResult = function(data) {
        var nombre = TG.data.identity.nombre;
        var guardian = data.guardian;
        var reasons = data.reasons || [];

        var html = '';

        // Header
        html += '<div class="tg-result-header">';
        html += '<h1 class="tg-result-name">' + nombre + ', tu guardián te encontró.</h1>';
        html += '<p class="tg-result-tagline">No llegaste por casualidad.</p>';
        html += '</div>';

        // Grid
        html += '<div class="tg-result-grid">';

        // Columna izquierda: Revelación
        html += '<div class="tg-result-card">';
        html += '<div class="tg-result-revelation">' + (data.revelation || '') + '</div>';
        if (reasons.length > 0) {
            html += '<h4 style="color:#00a8ff;font-size:14px;margin-bottom:10px;">POR QUÉ ESTE GUARDIÁN</h4>';
            html += '<ul class="tg-result-reasons">';
            reasons.forEach(function(r) {
                html += '<li>' + r + '</li>';
            });
            html += '</ul>';
        }
        html += '</div>';

        // Columna derecha: Guardián
        html += '<div class="tg-result-card tg-guardian-card">';
        html += '<img src="' + (guardian.imagen || 'https://duendesdeluruguay.com/wp-content/uploads/2024/guardian-default.jpg') + '" alt="' + guardian.nombre + '" class="tg-guardian-image">';
        html += '<h3 class="tg-guardian-name">' + (guardian.nombre || 'Tu Guardián') + '</h3>';
        html += '<p class="tg-guardian-price">Pieza única. Si se adopta, no vuelve.</p>';
        html += '<a href="https://duendesdeluruguay.com/shop/" class="tg-btn-cta">VER GUARDIANES</a>';

        // Ritual
        if (data.ritual) {
            html += '<div class="tg-ritual-box">';
            html += '<div class="tg-ritual-title">✦ Tu Ritual de Conexión</div>';
            html += '<div class="tg-ritual-text">' + data.ritual + '</div>';
            html += '</div>';
        }
        html += '</div>';

        html += '</div>'; // Fin grid

        // Altar final
        html += '<div class="tg-altar">';
        html += '<div class="tg-altar-phrase">"' + (data.sealedPhrase || 'Tu fuerza es más grande que tu miedo.') + '"</div>';
        html += '<div class="tg-altar-buttons">';
        html += '<button class="tg-btn-secondary" onclick="TG.copyPhrase()">📋 Copiar frase</button>';
        html += '<button class="tg-btn-secondary" onclick="TG.retry()">🔄 Hacer test de nuevo</button>';
        html += '</div>';

        // Newsletter
        html += '<div class="tg-newsletter">';
        html += '<div class="tg-newsletter-title">Suscribite para recibir mensajes de tu guardián</div>';
        html += '<div class="tg-newsletter-form">';
        html += '<input type="email" id="tg-nl-email" class="tg-newsletter-input" placeholder="Tu email..." value="' + TG.data.contact.email + '">';
        html += '<button class="tg-newsletter-btn" onclick="TG.subscribe()">SELLAR SEÑAL</button>';
        html += '</div>';
        html += '<div id="tg-nl-status" class="tg-newsletter-status"></div>';
        html += '</div>';

        html += '</div>'; // Fin altar

        document.getElementById('tg-result').innerHTML = html;

        // Guardar frase para copiar
        TG.sealedPhrase = data.sealedPhrase || 'Tu fuerza es más grande que tu miedo.';

        show('tg-result');
    };

    // Fallback de resultado
    TG.renderFallbackResult = function() {
        TG.renderResult({
            guardian: {
                nombre: 'El Guardián de la Protección',
                imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2024/guardian-default.jpg'
            },
            revelation: TG.data.identity.nombre + ', leí tu señal con respeto. Sentí algo claro: estás lista para soltar lo que ya no es tuyo. Tu energía habla de alguien que ha sostenido demasiado. Pero hay una parte de vos que todavía cree... y esa parte te trajo hasta acá.',
            sealedPhrase: 'Tu energía no está rota. Está despertando.',
            ritual: 'Esta noche, apoyá la mano en tu pecho y decí: "Hoy me elijo. Hoy vuelvo a mí."',
            reasons: [
                'Porque tu energía pidió protección sin palabras',
                'Porque sentí el cansancio de quien ha dado demasiado',
                'Porque el guardián que te eligió sabe sostenerte'
            ]
        });
    };

    // Copiar frase
    TG.copyPhrase = function() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(TG.sealedPhrase).then(function() {
                alert('Frase copiada ✨');
            });
        }
    };

    // Newsletter
    TG.subscribe = function() {
        var email = document.getElementById('tg-nl-email').value.trim();
        var status = document.getElementById('tg-nl-status');

        if (!email) {
            status.className = 'tg-newsletter-status error';
            status.textContent = 'Ingresá tu email';
            return;
        }

        status.className = 'tg-newsletter-status loading';
        status.textContent = 'Sellando señal...';

        fetch(API_URL + '/newsletter/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, source: 'test-guardian-v9' })
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data.success) {
                status.className = 'tg-newsletter-status success';
                status.textContent = 'Señal recibida. Bienvenida al portal. ✨';
            } else {
                status.className = 'tg-newsletter-status error';
                status.textContent = data.error || 'Error. Intentá de nuevo.';
            }
        })
        .catch(function() {
            status.className = 'tg-newsletter-status error';
            status.textContent = 'Error de conexión. Intentá de nuevo.';
        });
    };

    // Retry
    TG.retry = function() {
        TG.data = { identity: {}, answers: {}, contact: {} };
        TG.step = 0;
        TG.currentQuestion = null;
        show('tg-intro');
        updateProgress(0, TOTAL_QUESTIONS);
    };

    // Modal de salida
    TG.confirmExit = function() {
        document.getElementById('tg-exit-modal').classList.add('tg-active');
    };

    TG.closeModal = function() {
        document.getElementById('tg-exit-modal').classList.remove('tg-active');
    };

    TG.exit = function() {
        window.location.href = 'https://duendesdeluruguay.com/';
    };

    // Exponer globalmente
    window.TG = TG;

    // Inicializar progreso
    updateProgress(0, TOTAL_QUESTIONS);
})();

// FALLBACK: Forzar visibilidad del contenedor padre
(function() {
    var portal = document.getElementById('tg-portal');
    if (portal) {
        var parent = portal.closest('.elementor-shortcode');
        if (parent) {
            parent.style.cssText = 'display:block!important;visibility:visible!important;opacity:1!important;height:auto!important;overflow:visible!important;';
        }
        var widget = portal.closest('.elementor-widget');
        if (widget) {
            widget.style.cssText = 'display:block!important;visibility:visible!important;opacity:1!important;';
        }
    }
})();
</script>
<!-- /DUENDES TEST GUARDIAN v9 -->
<?php
    return ob_get_clean();
}

// Registrar shortcodes
add_shortcode('test_guardian_v9', 'duendes_test_guardian_v9_render');
add_shortcode('test_del_guardian', 'duendes_test_guardian_v9_render');
add_shortcode('duendes_test_guardian_v3', 'duendes_test_guardian_v9_render');
