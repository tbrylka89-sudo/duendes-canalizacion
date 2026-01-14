<?php
/*
Plugin Name: Test Guardian v8 - Premium Cinematografico
Description: Test del Guardian con estetica azul neon + flujo correcto
Version: 8.0
*/
if (!defined('ABSPATH')) exit;

function duendes_test_guardian_render() {
    ob_start();
?>
<!-- DUENDES TEST GUARDIAN v8 - AZUL NEON PREMIUM -->
<div id="tg-portal" class="tg-portal">
<style>
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
    padding: 60px 20px;
    position: relative;
    overflow: hidden;
}

/* Particulas sutiles de fondo */
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

/* === CONTENEDOR PRINCIPAL === */
.tg-wrap {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
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

/* === TIPOGRAFIA === */
.tg-icon {
    font-size: 72px;
    display: block;
    text-align: center;
    margin-bottom: 30px;
    filter: drop-shadow(0 0 20px rgba(0, 168, 255, 0.3));
}

.tg-title {
    font-size: 36px;
    color: #ffffff;
    text-align: center;
    margin-bottom: 20px;
    font-weight: 400;
    line-height: 1.3;
    text-shadow: 0 0 30px rgba(0, 168, 255, 0.2);
}

.tg-subtitle {
    font-size: 18px;
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
    margin-bottom: 40px;
}

/* === BOTONES PRINCIPALES (AZUL NEON) === */
.tg-btn-main {
    display: inline-block;
    padding: 20px 50px;
    background: transparent;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 3px;
    border: 2px solid #00a8ff;
    cursor: pointer;
    transition: all 0.4s ease;
    text-decoration: none;
    box-shadow: 0 0 20px rgba(0, 168, 255, 0.2), inset 0 0 20px rgba(0, 168, 255, 0.05);
}

.tg-btn-main:hover {
    background: rgba(0, 168, 255, 0.1);
    box-shadow: 0 0 40px rgba(0, 168, 255, 0.4), inset 0 0 30px rgba(0, 168, 255, 0.1);
    transform: translateY(-2px);
}

/* === BARRA DE PROGRESO === */
.tg-progress {
    margin-bottom: 50px;
}

.tg-progress-label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 4px;
    text-align: center;
    margin-bottom: 15px;
}

.tg-progress-bar {
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
}

.tg-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00a8ff, #00d4ff);
    border-radius: 2px;
    transition: width 0.5s ease;
    box-shadow: 0 0 10px rgba(0, 168, 255, 0.5);
}

/* === PREGUNTA === */
.tg-question {
    font-size: 28px;
    color: #ffffff;
    text-align: center;
    margin-bottom: 15px;
    line-height: 1.4;
}

.tg-question-sub {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    font-style: italic;
    margin-bottom: 50px;
}

/* === OPCIONES (BURBUJAS MISTICAS) === */
.tg-options {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 600px;
    margin: 0 auto;
}

.tg-option {
    display: block;
    width: 100%;
    padding: 24px 30px;
    background: rgba(0, 168, 255, 0.03);
    border: 1px solid rgba(0, 168, 255, 0.15);
    border-radius: 12px;
    cursor: pointer;
    text-align: left;
    transition: all 0.4s ease;
    animation: tgBubbleUp 0.5s ease-out backwards;
}

.tg-option:nth-child(1) { animation-delay: 0.1s; }
.tg-option:nth-child(2) { animation-delay: 0.2s; }
.tg-option:nth-child(3) { animation-delay: 0.3s; }
.tg-option:nth-child(4) { animation-delay: 0.4s; }
.tg-option:nth-child(5) { animation-delay: 0.5s; }

@keyframes tgBubbleUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

.tg-option:hover {
    background: rgba(0, 168, 255, 0.08);
    border-color: rgba(0, 168, 255, 0.4);
    transform: translateX(10px);
    box-shadow: 0 0 30px rgba(0, 168, 255, 0.15);
}

.tg-option-label {
    display: block;
    font-size: 18px;
    color: #ffffff;
    font-weight: 500;
    margin-bottom: 6px;
}

.tg-option-desc {
    display: block;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
}

/* === TEXTAREA === */
.tg-textarea {
    width: 100%;
    min-height: 160px;
    padding: 25px;
    background: rgba(0, 168, 255, 0.03);
    border: 1px solid rgba(0, 168, 255, 0.2);
    border-radius: 12px;
    color: #ffffff;
    font-size: 17px;
    font-family: Georgia, serif;
    line-height: 1.7;
    resize: vertical;
    transition: all 0.3s ease;
}

.tg-textarea:focus {
    outline: none;
    border-color: rgba(0, 168, 255, 0.5);
    box-shadow: 0 0 30px rgba(0, 168, 255, 0.1);
}

.tg-textarea::placeholder {
    color: rgba(255, 255, 255, 0.3);
    font-style: italic;
}

.tg-textarea-hint {
    margin-top: 15px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.35);
    font-style: italic;
    text-align: center;
}

/* === BOTON CONTINUAR === */
.tg-btn-next {
    display: inline-block;
    margin-top: 35px;
    padding: 16px 45px;
    background: transparent;
    color: #00a8ff;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 2px;
    border: 1px solid rgba(0, 168, 255, 0.4);
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tg-btn-next:hover {
    background: rgba(0, 168, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 168, 255, 0.2);
}

/* === INPUTS DE FORMULARIO === */
.tg-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    max-width: 600px;
    margin: 0 auto 30px;
}

@media (max-width: 600px) {
    .tg-form-grid {
        grid-template-columns: 1fr;
    }
}

.tg-field {
    text-align: left;
}

.tg-field.tg-full {
    grid-column: 1 / -1;
}

.tg-label {
    display: block;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 10px;
}

.tg-input {
    width: 100%;
    padding: 16px 20px;
    background: rgba(0, 168, 255, 0.03);
    border: 1px solid rgba(0, 168, 255, 0.2);
    border-radius: 8px;
    color: #ffffff;
    font-size: 16px;
    font-family: Georgia, serif;
    transition: all 0.3s ease;
}

.tg-input:focus {
    outline: none;
    border-color: rgba(0, 168, 255, 0.5);
    box-shadow: 0 0 20px rgba(0, 168, 255, 0.1);
}

.tg-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

.tg-select {
    width: 100%;
    padding: 16px 20px;
    background: rgba(0, 168, 255, 0.03);
    border: 1px solid rgba(0, 168, 255, 0.2);
    border-radius: 8px;
    color: #ffffff;
    font-size: 16px;
    font-family: Georgia, serif;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2300a8ff' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 15px center;
}

.tg-select option {
    background: #0a0a0f;
    color: #ffffff;
}

/* === LOADING === */
.tg-loading {
    text-align: center;
    padding: 100px 20px;
}

.tg-loading-spinner {
    width: 60px;
    height: 60px;
    border: 2px solid rgba(0, 168, 255, 0.1);
    border-top-color: #00a8ff;
    border-radius: 50%;
    margin: 0 auto 30px;
    animation: tgSpin 1s linear infinite;
}

@keyframes tgSpin {
    to { transform: rotate(360deg); }
}

/* === RESULTADO FINAL - GRILLA PREMIUM === */
.tg-result-header {
    text-align: center;
    margin-bottom: 60px;
}

.tg-result-name {
    font-size: 14px;
    color: #00a8ff;
    text-transform: uppercase;
    letter-spacing: 5px;
    margin-bottom: 15px;
}

.tg-result-title {
    font-size: 38px;
    color: #ffffff;
    font-weight: 400;
    margin-bottom: 10px;
}

.tg-result-subtitle {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
}

/* Grilla 2 columnas */
.tg-result-grid {
    display: grid;
    grid-template-columns: 55% 45%;
    gap: 40px;
    margin-bottom: 60px;
}

@media (max-width: 768px) {
    .tg-result-grid {
        grid-template-columns: 1fr;
    }
}

/* Card Revelacion (izquierda) */
.tg-revelation-card {
    background: rgba(0, 168, 255, 0.02);
    border: 1px solid rgba(0, 168, 255, 0.12);
    border-radius: 16px;
    padding: 40px;
}

.tg-revelation-title {
    font-size: 12px;
    color: #00a8ff;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 20px;
}

.tg-revelation-text {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.9;
    font-style: italic;
    margin-bottom: 30px;
}

.tg-why-title {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 15px;
    padding-top: 25px;
    border-top: 1px solid rgba(0, 168, 255, 0.1);
}

.tg-why-list {
    list-style: none;
}

.tg-why-list li {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.6);
    padding: 8px 0;
    padding-left: 20px;
    position: relative;
}

.tg-why-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 6px;
    height: 6px;
    background: #00a8ff;
    border-radius: 50%;
    transform: translateY(-50%);
    box-shadow: 0 0 10px rgba(0, 168, 255, 0.5);
}

/* Card Guardian Principal (derecha) */
.tg-guardian-card {
    text-align: center;
}

.tg-guardian-photo {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    margin: 0 auto 25px;
    border: 3px solid rgba(0, 168, 255, 0.3);
    overflow: hidden;
    box-shadow: 0 0 40px rgba(0, 168, 255, 0.2);
}

.tg-guardian-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.tg-guardian-label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 8px;
}

.tg-guardian-name {
    font-size: 26px;
    color: #ffffff;
    margin-bottom: 25px;
}

.tg-guardian-cta {
    display: block;
    width: 100%;
    padding: 18px;
    background: transparent;
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-decoration: none;
    border: 2px solid #00a8ff;
    border-radius: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 0 20px rgba(0, 168, 255, 0.15);
}

.tg-guardian-cta:hover {
    background: rgba(0, 168, 255, 0.1);
    box-shadow: 0 0 40px rgba(0, 168, 255, 0.3);
}

.tg-ritual-box {
    margin-top: 30px;
    padding: 20px;
    background: rgba(0, 168, 255, 0.03);
    border-left: 2px solid #00a8ff;
    text-align: left;
}

.tg-ritual-label {
    font-size: 10px;
    color: #00a8ff;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 10px;
}

.tg-ritual-text {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
}

/* Separador elegante */
.tg-separator {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 168, 255, 0.2), transparent);
    margin: 50px 0;
}

/* Tambien te recomendamos - Cards livianas */
.tg-also-section {
    margin-bottom: 60px;
}

.tg-also-title {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 3px;
    text-align: center;
    margin-bottom: 30px;
}

.tg-also-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

@media (max-width: 600px) {
    .tg-also-grid {
        grid-template-columns: 1fr;
    }
}

.tg-also-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s ease;
    text-decoration: none;
}

.tg-also-card:hover {
    background: rgba(0, 168, 255, 0.05);
    border-color: rgba(0, 168, 255, 0.2);
    transform: translateY(-5px);
}

.tg-also-photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin: 0 auto 15px;
    overflow: hidden;
    border: 2px solid rgba(0, 168, 255, 0.15);
}

.tg-also-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.tg-also-name {
    font-size: 14px;
    color: #ffffff;
    margin-bottom: 5px;
}

.tg-also-cat {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* Altar Final - Frase + Botones */
.tg-altar {
    text-align: center;
    padding: 50px 30px;
    background: linear-gradient(180deg, rgba(0, 168, 255, 0.02) 0%, transparent 100%);
    border-radius: 20px;
}

.tg-phrase {
    font-size: 24px;
    color: #00a8ff;
    font-style: italic;
    margin-bottom: 35px;
    line-height: 1.6;
}

.tg-altar-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.tg-altar-btn {
    padding: 14px 30px;
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    border: 1px solid rgba(0, 168, 255, 0.3);
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tg-altar-btn:hover {
    color: #ffffff;
    border-color: #00a8ff;
    box-shadow: 0 0 20px rgba(0, 168, 255, 0.2);
}

/* Newsletter */
.tg-newsletter {
    margin-top: 50px;
    padding-top: 40px;
    border-top: 1px solid rgba(0, 168, 255, 0.1);
    text-align: center;
}

.tg-newsletter-title {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 20px;
}

.tg-newsletter-form {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
    max-width: 500px;
    margin: 0 auto;
}

.tg-newsletter-input {
    flex: 1;
    min-width: 200px;
    padding: 14px 20px;
    background: rgba(0, 168, 255, 0.03);
    border: 1px solid rgba(0, 168, 255, 0.2);
    border-radius: 8px;
    color: #ffffff;
    font-size: 15px;
}

.tg-newsletter-btn {
    padding: 14px 30px;
    background: transparent;
    color: #00a8ff;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    border: 1px solid #00a8ff;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tg-newsletter-btn:hover {
    background: rgba(0, 168, 255, 0.1);
}

.tg-newsletter-status {
    margin-top: 15px;
    font-size: 14px;
    font-style: italic;
}

.tg-newsletter-status.loading { color: rgba(255, 255, 255, 0.5); }
.tg-newsletter-status.success { color: #00ff88; }
.tg-newsletter-status.error { color: #ff6b6b; }

/* Retry link */
.tg-retry {
    display: inline-block;
    margin-top: 40px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.3s;
}

.tg-retry:hover {
    color: rgba(255, 255, 255, 0.7);
}

/* Centro texto */
.tg-center { text-align: center; }
</style>

<div class="tg-wrap">
    <!-- PANTALLA 0: INTRO -->
    <div id="tg-intro" class="tg-screen tg-active">
        <span class="tg-icon">&#127769;</span>
        <h1 class="tg-title">El portal se esta abriendo...</h1>
        <p class="tg-subtitle">Algo te estaba esperando.<br>Y no llegaste aca por casualidad.</p>
        <p class="tg-subtitle">Este test no es un juego. Es un espejo.<br>Te voy a hacer preguntas que quizas nadie te hizo antes.</p>
        <p class="tg-hint">Tomate tu tiempo. Respira. Y responde con el corazon.</p>
        <div class="tg-center">
            <button class="tg-btn-main" onclick="TG.start()">ESTOY LISTA</button>
        </div>
    </div>

    <!-- PANTALLA 1: IDENTIDAD -->
    <div id="tg-identity" class="tg-screen">
        <span class="tg-icon">&#128273;</span>
        <h2 class="tg-title">Primero, contanos de vos</h2>
        <p class="tg-hint">Esto no es un formulario. Es la llave del portal.</p>

        <div class="tg-form-grid">
            <div class="tg-field">
                <label class="tg-label">Tu nombre *</label>
                <input type="text" class="tg-input" id="tg-nombre" placeholder="Como te llamas?">
            </div>
            <div class="tg-field">
                <label class="tg-label">Fecha de nacimiento *</label>
                <input type="date" class="tg-input" id="tg-nacimiento">
            </div>
            <div class="tg-field">
                <label class="tg-label">Sexo</label>
                <select class="tg-select" id="tg-sexo">
                    <option value="">Prefiero no decir</option>
                    <option value="mujer">Mujer</option>
                    <option value="hombre">Hombre</option>
                    <option value="otro">Otro</option>
                </select>
            </div>
            <div class="tg-field">
                <label class="tg-label">Nacionalidad *</label>
                <input type="text" class="tg-input" id="tg-nacionalidad" placeholder="Uruguaya, Argentina...">
            </div>
            <div class="tg-field">
                <label class="tg-label">Pais de residencia *</label>
                <select class="tg-select" id="tg-pais">
                    <option value="">Selecciona...</option>
                    <option value="UY">Uruguay</option>
                    <option value="AR">Argentina</option>
                    <option value="ES">Espana</option>
                    <option value="MX">Mexico</option>
                    <option value="CO">Colombia</option>
                    <option value="CL">Chile</option>
                    <option value="US">Estados Unidos</option>
                    <option value="BR">Brasil</option>
                    <option value="otro">Otro</option>
                </select>
            </div>
            <div class="tg-field">
                <label class="tg-label">Ciudad</label>
                <input type="text" class="tg-input" id="tg-ciudad" placeholder="Tu ciudad (opcional)">
            </div>
        </div>

        <div class="tg-center">
            <button class="tg-btn-main" onclick="TG.saveIdentity()">CONTINUAR</button>
        </div>
    </div>

    <!-- PANTALLA 2: PREGUNTAS -->
    <div id="tg-questions" class="tg-screen"></div>

    <!-- PANTALLA 3: CONTACTO -->
    <div id="tg-contact" class="tg-screen">
        <span class="tg-icon">&#128140;</span>
        <h2 class="tg-title">Tu guardian quiere encontrarte</h2>
        <p class="tg-hint">Te va a llegar por email tu tarjeta del guardian + tu frase sellada.</p>

        <div class="tg-form-grid">
            <div class="tg-field tg-full">
                <label class="tg-label">Tu email *</label>
                <input type="email" class="tg-input" id="tg-email" placeholder="tu@email.com">
            </div>
            <div class="tg-field" style="width:120px;">
                <label class="tg-label">Prefijo</label>
                <select class="tg-select" id="tg-prefijo">
                    <option value="+598">+598</option>
                    <option value="+54">+54</option>
                    <option value="+34">+34</option>
                    <option value="+52">+52</option>
                    <option value="+57">+57</option>
                    <option value="+56">+56</option>
                    <option value="+1">+1</option>
                    <option value="+55">+55</option>
                </select>
            </div>
            <div class="tg-field" style="flex:1;">
                <label class="tg-label">WhatsApp *</label>
                <input type="tel" class="tg-input" id="tg-whatsapp" placeholder="Tu numero sin prefijo">
            </div>
        </div>

        <div class="tg-center">
            <button class="tg-btn-main" onclick="TG.saveContact()">REVELAR MI GUARDIAN</button>
        </div>
    </div>

    <!-- PANTALLA 4: LOADING -->
    <div id="tg-loading" class="tg-screen">
        <div class="tg-loading">
            <div class="tg-loading-spinner"></div>
            <h2 class="tg-title">Tu guardian esta despertando...</h2>
            <p class="tg-subtitle">Estamos leyendo tu energia</p>
        </div>
    </div>

    <!-- PANTALLA 5: RESULTADO -->
    <div id="tg-result" class="tg-screen"></div>
</div>
</div>

<script>
(function(){
    var TG = {
        data: { identity: {}, answers: {}, contact: {} },
        step: 0,
        questions: [
            {type:"select", id:"momento", title:"Que momento estas atravesando?", subtitle:"No hay respuestas correctas, solo honestas", options:[
                {id:"buscando", label:"Estoy buscando algo", desc:"Paz, claridad, un cambio..."},
                {id:"sanando", label:"Estoy sanando algo", desc:"Heridas, perdidas, ciclos que cierran"},
                {id:"transicion", label:"Estoy en transicion", desc:"Cambios grandes, incertidumbre"},
                {id:"proteccion", label:"Necesito proteccion", desc:"Me siento vulnerable, expuesta"}
            ]},
            {type:"select", id:"cuerpo", title:"Donde lo sentis en el cuerpo?", subtitle:"El cuerpo siempre sabe antes que la mente", options:[
                {id:"pecho", label:"En el pecho", desc:"Apretado, pesado, como si cargara algo"},
                {id:"garganta", label:"En la garganta", desc:"Cosas que no puedo decir, que trago"},
                {id:"estomago", label:"En el estomago", desc:"Ansiedad, nervios, nudo constante"},
                {id:"espalda", label:"En la espalda", desc:"Cargas, responsabilidades, tension"},
                {id:"todo", label:"En todo el cuerpo", desc:"Un cansancio profundo que no se va"}
            ]},
            {type:"text", id:"dolor", title:"Que es lo que MAS te duele HOY?", subtitle:"Aca podes ser completamente honesta. Nadie te va a juzgar.", placeholder:"Escribi lo que sientas... esto es sagrado.", hint:"Solo vos y tu guardian lo van a saber."},
            {type:"text", id:"deseo", title:"Si pudieras pedirle UNA cosa al universo...", subtitle:"Que le pedirias?", placeholder:"Sin filtros. Sin verguenza. Que necesitas de verdad?", hint:"Esto queda entre vos y el universo."},
            {type:"select", id:"patron", title:"Hay algo que sentis que se repite en tu vida?", subtitle:"Patrones que no logras romper, ciclos que vuelven", options:[
                {id:"relaciones", label:"En mis relaciones", desc:"Siempre termino en el mismo lugar"},
                {id:"dinero", label:"Con el dinero", desc:"Nunca alcanza o se va rapido"},
                {id:"autoestima", label:"Conmigo misma", desc:"No me valoro como deberia"},
                {id:"familia", label:"Con mi familia", desc:"Conflictos que se repiten"},
                {id:"ninguno", label:"No identifico ninguno claro", desc:"O prefiero no pensarlo ahora"}
            ]},
            {type:"text", id:"alma", title:"Cerra los ojos un segundo...", subtitle:"Que recuerdo de tu infancia te viene a la mente AHORA?", placeholder:"Puede ser feliz, triste, confuso...", hint:"No lo pienses. Escribi lo primero que llegue."},
            {type:"select", id:"estilo", title:"Como preferis que te llegue la magia?", subtitle:"Tu guardian se va a comunicar con vos de esta forma", options:[
                {id:"suave", label:"Suave y amorosa", desc:"Con paciencia, ternura, sin presion"},
                {id:"directa", label:"Directa y clara", desc:"Sin vueltas, al punto, honesta"},
                {id:"mistica", label:"Mistica y profunda", desc:"Senales, simbolos, suenos"},
                {id:"practica", label:"Practica y concreta", desc:"Rituales simples, pasos claros"}
            ]}
        ]
    };

    var PREFIJOS = {UY:"+598",AR:"+54",ES:"+34",MX:"+52",CO:"+57",CL:"+56",US:"+1",BR:"+55"};
    var IMG_DEFAULT = "https://duendesdeluruguay.com/wp-content/uploads/2024/guardian-default.jpg";
    var SHOP_URL = "https://duendesdeluruguay.com/shop/";
    var API_URL = "https://duendes-vercel.vercel.app/api";

    function show(id) {
        document.querySelectorAll('.tg-screen').forEach(function(s){ s.classList.remove('tg-active'); });
        document.getElementById(id).classList.add('tg-active');
        document.getElementById('tg-portal').scrollIntoView({behavior:'smooth'});
    }

    TG.start = function() {
        show('tg-identity');
    };

    TG.saveIdentity = function() {
        var nombre = document.getElementById('tg-nombre').value.trim();
        var nacimiento = document.getElementById('tg-nacimiento').value;
        var nacionalidad = document.getElementById('tg-nacionalidad').value.trim();
        var pais = document.getElementById('tg-pais').value;

        if (!nombre || !nacimiento || !nacionalidad || !pais) {
            alert('Por favor completa los campos obligatorios');
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

        // Setear prefijo segun pais
        var prefijo = PREFIJOS[pais] || "+598";
        document.getElementById('tg-prefijo').value = prefijo;

        TG.step = 0;
        show('tg-questions');
        renderQuestion();
    };

    function renderQuestion() {
        var q = TG.questions[TG.step];
        var progress = ((TG.step + 1) / TG.questions.length) * 100;
        var html = '';

        html += '<div class="tg-progress">';
        html += '<div class="tg-progress-label">Pregunta ' + (TG.step + 1) + ' de ' + TG.questions.length + '</div>';
        html += '<div class="tg-progress-bar"><div class="tg-progress-fill" style="width:' + progress + '%"></div></div>';
        html += '</div>';

        html += '<h2 class="tg-question">' + q.title + '</h2>';
        html += '<p class="tg-question-sub">' + q.subtitle + '</p>';

        if (q.type === 'select') {
            html += '<div class="tg-options">';
            for (var i = 0; i < q.options.length; i++) {
                var opt = q.options[i];
                html += '<button class="tg-option" onclick="TG.answer(\'' + q.id + '\',\'' + opt.id + '\')">';
                html += '<span class="tg-option-label">' + opt.label + '</span>';
                html += '<span class="tg-option-desc">' + opt.desc + '</span>';
                html += '</button>';
            }
            html += '</div>';
        } else {
            html += '<textarea class="tg-textarea" id="tg-textarea" placeholder="' + q.placeholder + '"></textarea>';
            html += '<p class="tg-textarea-hint">' + q.hint + '</p>';
            html += '<div class="tg-center"><button class="tg-btn-next" onclick="TG.answerText(\'' + q.id + '\')">Continuar</button></div>';
        }

        document.getElementById('tg-questions').innerHTML = html;

        if (q.type === 'text') {
            setTimeout(function() {
                var ta = document.getElementById('tg-textarea');
                if (ta) ta.focus();
            }, 300);
        }
    }

    TG.answer = function(qid, aid) {
        TG.data.answers[qid] = aid;
        nextQuestion();
    };

    TG.answerText = function(qid) {
        var ta = document.getElementById('tg-textarea');
        TG.data.answers[qid] = ta ? ta.value : '';
        nextQuestion();
    };

    function nextQuestion() {
        if (TG.step < TG.questions.length - 1) {
            TG.step++;
            renderQuestion();
            document.getElementById('tg-portal').scrollIntoView({behavior:'smooth'});
        } else {
            show('tg-contact');
        }
    }

    TG.saveContact = function() {
        var email = document.getElementById('tg-email').value.trim();
        var whatsapp = document.getElementById('tg-whatsapp').value.trim();

        if (!email || !whatsapp) {
            alert('Por favor completa email y WhatsApp');
            return;
        }

        TG.data.contact = {
            email: email,
            prefijo: document.getElementById('tg-prefijo').value,
            whatsapp: whatsapp
        };

        show('tg-loading');
        setTimeout(processResult, 2500);
    };

    function processResult() {
        var ans = TG.data.answers;
        var nombre = TG.data.identity.nombre || 'Alma';

        var guardianName = 'El Guardian de la Proteccion';
        var message = 'Tu energia habla de alguien que ha cargado mucho sobre sus hombros. Alguien que da mas de lo que recibe. Y eso, aunque a veces duele, es tu forma de amar.';
        var ritual = 'Esta noche, antes de dormir, pone una mano en tu corazon y deci en voz alta: Merezco ser cuidada. Merezco recibir.';
        var whyReasons = ['Tu energia pide proteccion', 'Cargas mas de lo que deberias', 'Necesitas un guardian que cuide de vos'];

        if (ans.momento === 'sanando' || ans.patron === 'relaciones' || ans.patron === 'autoestima') {
            guardianName = 'El Guardian de la Sanacion';
            message = 'Hay heridas antiguas que todavia pesan en tu energia. No porque no hayas intentado sanarlas, sino porque nadie te enseno como. Tu guardian viene a mostrarte el camino.';
            ritual = 'Pone ambas manos en tu pecho. Respira profundo tres veces. Decile a tu nina interior: Ya no estas sola. Yo estoy aca.';
            whyReasons = ['Tu alma esta sanando heridas viejas', 'Los patrones vienen de lejos', 'Es momento de cerrar ciclos'];
        } else if (ans.momento === 'buscando' || ans.patron === 'dinero') {
            guardianName = 'El Guardian de la Abundancia';
            message = 'Algo en vos sabe que merece mas. Pero hay una parte que todavia no se lo cree. Tu guardian viene a recordarte que la abundancia es tu derecho de nacimiento.';
            ritual = 'Cada manana al despertar, antes de abrir los ojos, deci: Hoy estoy abierta a recibir todo lo bueno que el universo tiene para mi.';
            whyReasons = ['Tu energia esta lista para recibir', 'Los bloqueos son creencias, no realidades', 'La abundancia te esta buscando'];
        }

        var phrases = [
            'Lo que te eligio, no se equivoca.',
            'No buscas un objeto. Buscas un companero del alma.',
            'Ya no tenes que caminar sola.',
            'El universo conspiro para que llegues aca.'
        ];
        var phrase = phrases[Math.floor(Math.random() * phrases.length)];

        // Render resultado
        var html = '';

        // Header
        html += '<div class="tg-result-header">';
        html += '<div class="tg-result-name">' + nombre + '</div>';
        html += '<h1 class="tg-result-title">Tu guardian te encontro.</h1>';
        html += '<p class="tg-result-subtitle">No llegaste por casualidad.</p>';
        html += '</div>';

        // Grilla 2 columnas
        html += '<div class="tg-result-grid">';

        // Izquierda - Revelacion
        html += '<div class="tg-revelation-card">';
        html += '<div class="tg-revelation-title">Tu revelacion</div>';
        html += '<p class="tg-revelation-text">"' + message + '"</p>';
        html += '<div class="tg-why-title">Por que este guardian</div>';
        html += '<ul class="tg-why-list">';
        for (var i = 0; i < whyReasons.length; i++) {
            html += '<li>' + whyReasons[i] + '</li>';
        }
        html += '</ul>';
        html += '</div>';

        // Derecha - Guardian
        html += '<div class="tg-guardian-card">';
        html += '<div class="tg-guardian-photo"><img src="' + IMG_DEFAULT + '" alt="Guardian"></div>';
        html += '<div class="tg-guardian-label">Tu guardian es</div>';
        html += '<h2 class="tg-guardian-name">' + guardianName + '</h2>';
        html += '<a href="' + SHOP_URL + '" class="tg-guardian-cta">CONOCER A MI GUARDIAN</a>';
        html += '<div class="tg-ritual-box">';
        html += '<div class="tg-ritual-label">Tu primer ritual</div>';
        html += '<p class="tg-ritual-text">' + ritual + '</p>';
        html += '</div>';
        html += '</div>';

        html += '</div>'; // fin grilla

        // Separador
        html += '<div class="tg-separator"></div>';

        // Tambien te recomendamos
        html += '<div class="tg-also-section">';
        html += '<div class="tg-also-title">Tambien resuenan con vos</div>';
        html += '<div class="tg-also-grid">';
        html += '<a href="' + SHOP_URL + '" class="tg-also-card">';
        html += '<div class="tg-also-photo"><img src="' + IMG_DEFAULT + '" alt=""></div>';
        html += '<div class="tg-also-name">Guardian del Amor</div>';
        html += '<div class="tg-also-cat">Amor</div>';
        html += '</a>';
        html += '<a href="' + SHOP_URL + '" class="tg-also-card">';
        html += '<div class="tg-also-photo"><img src="' + IMG_DEFAULT + '" alt=""></div>';
        html += '<div class="tg-also-name">Guardian de la Calma</div>';
        html += '<div class="tg-also-cat">Sanacion</div>';
        html += '</a>';
        html += '<a href="' + SHOP_URL + '" class="tg-also-card">';
        html += '<div class="tg-also-photo"><img src="' + IMG_DEFAULT + '" alt=""></div>';
        html += '<div class="tg-also-name">Guardian del Camino</div>';
        html += '<div class="tg-also-cat">Proteccion</div>';
        html += '</a>';
        html += '</div>';
        html += '</div>';

        // Altar final
        html += '<div class="tg-altar">';
        html += '<p class="tg-phrase">"' + phrase + '"</p>';
        html += '<div class="tg-altar-buttons">';
        html += '<button class="tg-altar-btn" onclick="TG.download()">DESCARGAR MI TARJETA</button>';
        html += '<button class="tg-altar-btn" onclick="TG.copyPhrase(\'' + phrase.replace(/'/g, "\\'") + '\')">COPIAR FRASE</button>';
        html += '</div>';

        // Newsletter
        html += '<div class="tg-newsletter">';
        html += '<div class="tg-newsletter-title">Recibir senales del portal</div>';
        html += '<div class="tg-newsletter-form">';
        html += '<input type="email" class="tg-newsletter-input" id="tg-nl-email" placeholder="tu@email.com" value="' + (TG.data.contact.email || '') + '">';
        html += '<button class="tg-newsletter-btn" onclick="TG.subscribe()">SELLAR SENAL</button>';
        html += '</div>';
        html += '<div id="tg-nl-status" class="tg-newsletter-status"></div>';
        html += '</div>';

        html += '<span class="tg-retry" onclick="TG.retry()">Hacer el test de nuevo</span>';
        html += '</div>';

        document.getElementById('tg-result').innerHTML = html;
        show('tg-result');

        // Guardar datos en backend
        saveToBackend();
    }

    function saveToBackend() {
        // Intenta guardar en Vercel KV
        try {
            fetch(API_URL + '/test-guardian/save', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(TG.data)
            }).catch(function(){});
        } catch(e) {}
    }

    TG.download = function() {
        alert('Funcion de descarga en desarrollo. Tu tarjeta llegara a tu email.');
    };

    TG.copyPhrase = function(phrase) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(phrase);
            alert('Frase copiada al portapapeles');
        }
    };

    TG.subscribe = function() {
        var email = document.getElementById('tg-nl-email').value.trim();
        var status = document.getElementById('tg-nl-status');

        if (!email) {
            status.className = 'tg-newsletter-status error';
            status.textContent = 'Ingresa tu email';
            return;
        }

        status.className = 'tg-newsletter-status loading';
        status.textContent = 'Sellando senal...';

        fetch(API_URL + '/newsletter/subscribe', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: email, source: 'test-guardian'})
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data.success) {
                status.className = 'tg-newsletter-status success';
                status.textContent = 'Senal recibida. Bienvenida al portal.';
            } else {
                status.className = 'tg-newsletter-status error';
                status.textContent = data.error || 'El portal fallo. Intenta de nuevo.';
            }
        })
        .catch(function() {
            status.className = 'tg-newsletter-status error';
            status.textContent = 'El portal fallo. Intenta de nuevo.';
        });
    };

    TG.retry = function() {
        TG.data = { identity: {}, answers: {}, contact: {} };
        TG.step = 0;
        show('tg-intro');
    };

    // Exponer globalmente
    window.TG = TG;
})();
</script>
<!-- /DUENDES TEST GUARDIAN v8 -->
<?php
    return ob_get_clean();
}

add_shortcode('duendes_test_guardian_v3', 'duendes_test_guardian_render');
add_shortcode('test_del_guardian', 'duendes_test_guardian_render');
