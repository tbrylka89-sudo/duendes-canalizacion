<?php
/*
Plugin Name: Test Guardian v14 - EXPERIENCIA
Description: Test del Guardian - Experiencia inmersiva cinematografica
Version: 14.1
*/
if (!defined('ABSPATH')) exit;

function duendes_test_guardian_v14_render() {
    $v = '14.1.' . time();
    ob_start();
?>
<!-- TEST GUARDIAN v14.1 - EXPERIENCIA INMERSIVA -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">

<div id="tg-experience" data-v="<?php echo $v; ?>">

<!-- ORBES FLOTANTES DE FONDO (en todas las escenas) -->
<div class="tg-orbs-bg">
    <div class="tg-orb-float tg-orb-1"></div>
    <div class="tg-orb-float tg-orb-2"></div>
    <div class="tg-orb-float tg-orb-3"></div>
    <div class="tg-orb-float tg-orb-4"></div>
    <div class="tg-orb-float tg-orb-5"></div>
</div>

<!-- PANTALLA DE INICIO - ACTIVAR FRECUENCIA -->
<div id="tg-intro" class="tg-scene active">
    <div class="tg-particles"></div>
    <div class="tg-intro-content">
        <h1 class="tg-main-title">DUENDES DEL URUGUAY</h1>
        <p class="tg-subtitle">Canalizados para vos</p>
        <button id="tg-btn-activar" class="tg-btn-magic">
            <span class="tg-btn-text">ACTIVAR FRECUENCIA DE CONEXIÓN</span>
            <span class="tg-btn-glow"></span>
        </button>
    </div>
</div>

<!-- ESCENA 1: LOS ELEGIDOS - REVEAL CINEMATICO -->
<div id="tg-elegidos" class="tg-scene">
    <div class="tg-particles"></div>
    <div class="tg-cinematic-text">
        <div class="tg-text-line tg-line-1">
            <span>Existen personas que fueron llamadas.</span>
        </div>
        <div class="tg-text-line tg-line-2">
            <span>No por su nombre,</span>
        </div>
        <div class="tg-text-line tg-line-3">
            <span>sino por algo más profundo.</span>
        </div>
    </div>
</div>

<!-- ESCENA 2: TÍTULO PRINCIPAL -->
<div id="tg-titulo" class="tg-scene">
    <div class="tg-particles"></div>
    <div class="tg-titulo-container">
        <p class="tg-pre-titulo">Los llaman</p>
        <h1 class="tg-titulo-grande">LOS ELEGIDOS</h1>
        <div class="tg-linea-magica"></div>
    </div>
</div>

<!-- ESCENA 3: EXPLICACIÓN -->
<div id="tg-explicacion" class="tg-scene">
    <div class="tg-particles"></div>
    <div class="tg-cinematic-text">
        <div class="tg-text-line tg-line-1">
            <span>Son quienes cuidan de un guardián.</span>
        </div>
        <div class="tg-text-line tg-line-2 tg-accent">
            <span>O quizás...</span>
        </div>
        <div class="tg-text-line tg-line-3 tg-accent">
            <span>son cuidados por él.</span>
        </div>
    </div>
</div>

<!-- ESCENA 4: PREGUNTA -->
<div id="tg-pregunta" class="tg-scene">
    <div class="tg-particles"></div>
    <div class="tg-pregunta-container">
        <p class="tg-pregunta-texto">¿Sos una de ellas?</p>
        <button id="tg-btn-descubrir" class="tg-btn-magic tg-btn-grande">
            <span class="tg-btn-text">DESCUBRILO</span>
            <span class="tg-btn-glow"></span>
        </button>
    </div>
</div>

<!-- ESCENA: MÚSICA -->
<div id="tg-musica" class="tg-scene">
    <div class="tg-particles"></div>
    <div class="tg-musica-container">
        <div class="tg-musica-icon">♫</div>
        <p class="tg-musica-texto">Para una experiencia completa,<br>te invitamos a activar el sonido.</p>
        <div class="tg-musica-botones">
            <button id="tg-btn-con-musica" class="tg-btn-magic">
                <span class="tg-btn-text">CON MÚSICA</span>
                <span class="tg-btn-glow"></span>
            </button>
            <button id="tg-btn-sin-musica" class="tg-btn-secondary">SIN MÚSICA</button>
        </div>
        <audio id="tg-audio" loop>
            <source src="https://duendesdeluruguay.com/wp-content/uploads/2025/05/Raices-y-Agua-Interior.mp3" type="audio/mpeg">
        </audio>
    </div>
</div>

<!-- ESCENA: TEST DE PREGUNTAS -->
<div id="tg-test" class="tg-scene">
    <div class="tg-particles"></div>
    <div class="tg-test-container">
        <div class="tg-progress">
            <div class="tg-progress-bar"></div>
            <span class="tg-progress-text">1 / 12</span>
        </div>
        <div class="tg-question-area">
            <p class="tg-question"></p>
        </div>
        <div class="tg-options"></div>
    </div>
</div>

<!-- ESCENA: FORMULARIO DE DATOS -->
<div id="tg-datos" class="tg-scene">
    <div class="tg-particles"></div>
    <div class="tg-datos-container">
        <p class="tg-datos-titulo">Para completar tu conexión</p>
        <p class="tg-datos-subtitulo">Tu guardián necesita saber un poco más de vos</p>

        <div class="tg-form">
            <div class="tg-form-group">
                <label>Tu nombre</label>
                <input type="text" id="tg-nombre" placeholder="¿Cómo te llamás?" />
            </div>
            <div class="tg-form-group">
                <label>Fecha de nacimiento</label>
                <input type="date" id="tg-nacimiento" />
            </div>
            <div class="tg-form-group">
                <label>Tu email</label>
                <input type="email" id="tg-email" placeholder="Para enviarte tu resultado" />
            </div>
            <div class="tg-form-group">
                <label>País</label>
                <select id="tg-pais">
                    <option value="">Seleccioná tu país</option>
                    <option value="AR">Argentina</option>
                    <option value="UY">Uruguay</option>
                    <option value="CL">Chile</option>
                    <option value="BR">Brasil</option>
                    <option value="PY">Paraguay</option>
                    <option value="BO">Bolivia</option>
                    <option value="PE">Perú</option>
                    <option value="EC">Ecuador</option>
                    <option value="CO">Colombia</option>
                    <option value="VE">Venezuela</option>
                    <option value="MX">México</option>
                    <option value="ES">España</option>
                    <option value="US">Estados Unidos</option>
                    <option value="OTRO">Otro</option>
                </select>
            </div>
            <div class="tg-form-group">
                <label>WhatsApp (opcional)</label>
                <input type="tel" id="tg-telefono" placeholder="+598 99 123 456" />
            </div>
        </div>

        <button id="tg-btn-ver-resultado" class="tg-btn-magic">
            <span class="tg-btn-text">REVELAR MI GUARDIÁN</span>
            <span class="tg-btn-glow"></span>
        </button>
    </div>
</div>

<!-- ESCENA: PROCESANDO -->
<div id="tg-procesando" class="tg-scene">
    <div class="tg-particles"></div>
    <div class="tg-procesando-container">
        <div class="tg-orb-proceso">
            <div class="tg-orb-inner"></div>
        </div>
        <p class="tg-procesando-texto">Conectando con tu esencia...</p>
    </div>
</div>

<!-- ESCENA: RESULTADO -->
<div id="tg-resultado" class="tg-scene">
    <div class="tg-particles"></div>
    <div class="tg-resultado-container">
        <p class="tg-resultado-saludo"></p>
        <p class="tg-resultado-signo"></p>

        <div class="tg-resultado-foto">
            <img id="tg-duende-img" src="" alt="Tu Guardián" />
        </div>

        <div class="tg-resultado-guardian">
            <p class="tg-resultado-pre">Tu guardián es</p>
            <h1 class="tg-resultado-nombre"></h1>
        </div>

        <div class="tg-resultado-analisis">
            <p class="tg-analisis-titulo">Lo que captamos de vos</p>
            <div class="tg-analisis-items">
                <div class="tg-analisis-item">
                    <span class="tg-analisis-label">Energía dominante</span>
                    <span class="tg-analisis-valor" id="tg-energia"></span>
                </div>
                <div class="tg-analisis-item">
                    <span class="tg-analisis-label">Necesidad principal</span>
                    <span class="tg-analisis-valor" id="tg-necesidad"></span>
                </div>
                <div class="tg-analisis-item">
                    <span class="tg-analisis-label">Compatibilidad</span>
                    <span class="tg-analisis-valor" id="tg-compatibilidad"></span>
                </div>
            </div>
        </div>

        <div class="tg-resultado-reflexion">
            <p class="tg-reflexion-texto"></p>
        </div>

        <div class="tg-resultado-mensaje">
            <p class="tg-mensaje-personal"></p>
        </div>

        <a href="#" class="tg-btn-magic tg-btn-conocer">
            <span class="tg-btn-text">CONOCER A MI GUARDIÁN</span>
            <span class="tg-btn-glow"></span>
        </a>
    </div>
</div>

</div>

<style>
/* ============================================
   EXPERIENCIA INMERSIVA - ESTILOS BASE
   ============================================ */

#tg-experience {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: #000 !important;
    z-index: 999999 !important;
    overflow: hidden !important;
    font-family: 'Cormorant Garamond', Georgia, serif !important;
}

#tg-experience * {
    box-sizing: border-box !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* ============================================
   ORBES FLOTANTES DE FONDO
   ============================================ */

.tg-orbs-bg {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    pointer-events: none !important;
    z-index: 1 !important;
    overflow: hidden !important;
}

.tg-orb-float {
    position: absolute !important;
    border-radius: 50% !important;
    filter: blur(60px) !important;
    opacity: 0.7 !important;
    mix-blend-mode: screen !important;
}

.tg-orb-1 {
    width: 350px !important;
    height: 350px !important;
    background: radial-gradient(circle, rgba(255,0,128,0.9) 0%, rgba(255,0,128,0.4) 40%, transparent 70%) !important;
    top: 5% !important;
    left: 5% !important;
    animation: tgOrbMove1 25s ease-in-out infinite !important;
}

.tg-orb-2 {
    width: 400px !important;
    height: 400px !important;
    background: radial-gradient(circle, rgba(150,0,255,0.8) 0%, rgba(150,0,255,0.3) 40%, transparent 70%) !important;
    top: 40% !important;
    right: 5% !important;
    animation: tgOrbMove2 30s ease-in-out infinite !important;
}

.tg-orb-3 {
    width: 300px !important;
    height: 300px !important;
    background: radial-gradient(circle, rgba(255,50,150,0.85) 0%, rgba(255,50,150,0.3) 40%, transparent 70%) !important;
    bottom: 10% !important;
    left: 25% !important;
    animation: tgOrbMove3 20s ease-in-out infinite !important;
}

.tg-orb-4 {
    width: 250px !important;
    height: 250px !important;
    background: radial-gradient(circle, rgba(200,0,255,0.75) 0%, rgba(200,0,255,0.3) 40%, transparent 70%) !important;
    top: 60% !important;
    left: 10% !important;
    animation: tgOrbMove4 22s ease-in-out infinite !important;
}

.tg-orb-5 {
    width: 320px !important;
    height: 320px !important;
    background: radial-gradient(circle, rgba(255,100,180,0.8) 0%, rgba(255,100,180,0.3) 40%, transparent 70%) !important;
    top: 15% !important;
    right: 20% !important;
    animation: tgOrbMove5 28s ease-in-out infinite !important;
}

@keyframes tgOrbMove1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(100px, 150px) scale(1.2); }
    50% { transform: translate(200px, 50px) scale(0.9); }
    75% { transform: translate(50px, 200px) scale(1.1); }
}

@keyframes tgOrbMove2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(-150px, -100px) scale(1.1); }
    50% { transform: translate(-50px, 100px) scale(0.8); }
    75% { transform: translate(-200px, -50px) scale(1.2); }
}

@keyframes tgOrbMove3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(100px, -100px) scale(1.3); }
    66% { transform: translate(-100px, -50px) scale(0.9); }
}

@keyframes tgOrbMove4 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(150px, 100px) scale(1.4); }
}

@keyframes tgOrbMove5 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(-80px, -120px) scale(1.1); }
    75% { transform: translate(80px, 80px) scale(0.9); }
}

/* ============================================
   ESCENAS
   ============================================ */

.tg-scene {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    opacity: 0 !important;
    visibility: hidden !important;
    transition: opacity 1.5s ease, visibility 1.5s ease !important;
    background: radial-gradient(ellipse at center, rgba(10,5,15,0.85) 0%, rgba(0,0,0,0.9) 100%) !important;
    z-index: 2 !important;
    overflow-y: auto !important;
}

.tg-scene.active {
    opacity: 1 !important;
    visibility: visible !important;
}

/* ============================================
   PARTÍCULAS FLOTANTES
   ============================================ */

.tg-particles {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    pointer-events: none !important;
}

.tg-particles::before,
.tg-particles::after {
    content: '' !important;
    position: absolute !important;
    width: 100% !important;
    height: 100% !important;
    background-image:
        radial-gradient(2px 2px at 10% 20%, rgba(255,0,128,0.4), transparent),
        radial-gradient(2px 2px at 30% 60%, rgba(255,0,128,0.3), transparent),
        radial-gradient(2px 2px at 50% 30%, rgba(255,255,255,0.2), transparent),
        radial-gradient(2px 2px at 70% 80%, rgba(255,0,128,0.4), transparent),
        radial-gradient(2px 2px at 90% 40%, rgba(255,0,128,0.3), transparent),
        radial-gradient(3px 3px at 20% 70%, rgba(255,255,255,0.15), transparent),
        radial-gradient(2px 2px at 80% 10%, rgba(255,0,128,0.35), transparent),
        radial-gradient(2px 2px at 40% 90%, rgba(255,255,255,0.2), transparent) !important;
    animation: tgFloat 20s linear infinite !important;
}

.tg-particles::after {
    animation-delay: -10s !important;
    opacity: 0.7 !important;
}

@keyframes tgFloat {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-100vh) rotate(360deg); }
}

/* ============================================
   PANTALLA DE INICIO
   ============================================ */

.tg-intro-content {
    text-align: center !important;
    z-index: 2 !important;
    padding: 0 30px !important;
}

.tg-main-title {
    font-family: 'Cinzel', serif !important;
    font-size: clamp(22px, 6vw, 42px) !important;
    font-weight: 400 !important;
    letter-spacing: 0.25em !important;
    color: #fff !important;
    margin-bottom: 15px !important;
    text-shadow: 0 0 30px rgba(255,0,128,0.3) !important;
}

.tg-subtitle {
    font-size: clamp(14px, 3vw, 18px) !important;
    color: #ff0080 !important;
    font-style: italic !important;
    letter-spacing: 0.2em !important;
    margin-bottom: 60px !important;
}

/* ============================================
   BOTONES MÁGICOS
   ============================================ */

.tg-btn-magic {
    position: relative !important;
    background: transparent !important;
    border: 1px solid rgba(255,0,128,0.6) !important;
    padding: 18px 45px !important;
    cursor: pointer !important;
    overflow: hidden !important;
    transition: all 0.4s ease !important;
}

.tg-btn-text {
    position: relative !important;
    z-index: 2 !important;
    font-family: 'Cinzel', serif !important;
    font-size: clamp(11px, 2.5vw, 14px) !important;
    letter-spacing: 0.25em !important;
    color: #fff !important;
    text-transform: uppercase !important;
}

.tg-btn-glow {
    position: absolute !important;
    top: 0 !important;
    left: -100% !important;
    width: 100% !important;
    height: 100% !important;
    background: linear-gradient(90deg, transparent, rgba(255,0,128,0.3), transparent) !important;
    transition: left 0.6s ease !important;
}

.tg-btn-magic:hover .tg-btn-glow {
    left: 100% !important;
}

.tg-btn-magic:hover {
    border-color: #ff0080 !important;
    box-shadow: 0 0 30px rgba(255,0,128,0.4), inset 0 0 20px rgba(255,0,128,0.1) !important;
}

.tg-btn-secondary {
    background: transparent !important;
    border: 1px solid rgba(255,255,255,0.3) !important;
    padding: 15px 35px !important;
    font-family: 'Cinzel', serif !important;
    font-size: clamp(10px, 2vw, 12px) !important;
    letter-spacing: 0.2em !important;
    color: rgba(255,255,255,0.6) !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
}

.tg-btn-secondary:hover {
    border-color: rgba(255,255,255,0.6) !important;
    color: #fff !important;
}

/* ============================================
   TEXTO CINEMATOGRÁFICO
   ============================================ */

.tg-cinematic-text {
    text-align: center !important;
    padding: 0 30px !important;
    max-width: 800px !important;
}

.tg-text-line {
    overflow: hidden !important;
    margin-bottom: 15px !important;
}

.tg-text-line span {
    display: block !important;
    font-size: clamp(20px, 5vw, 32px) !important;
    color: #fff !important;
    line-height: 1.5 !important;
    font-weight: 400 !important;
    opacity: 0 !important;
    transform: translateY(40px) !important;
    transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

.tg-text-line.visible span {
    opacity: 1 !important;
    transform: translateY(0) !important;
}

.tg-text-line.tg-accent span {
    color: #ff0080 !important;
    font-style: italic !important;
}

/* ============================================
   TÍTULO GRANDE
   ============================================ */

.tg-titulo-container {
    text-align: center !important;
}

.tg-pre-titulo {
    font-size: clamp(16px, 3vw, 22px) !important;
    color: rgba(255,255,255,0.7) !important;
    letter-spacing: 0.3em !important;
    margin-bottom: 20px !important;
    opacity: 0 !important;
    transform: translateY(20px) !important;
    transition: all 1s ease 0.3s !important;
}

.tg-titulo-grande {
    font-family: 'Cinzel', serif !important;
    font-size: clamp(40px, 12vw, 90px) !important;
    font-weight: 400 !important;
    letter-spacing: 0.15em !important;
    color: #fff !important;
    text-shadow:
        0 0 40px rgba(255,0,128,0.5),
        0 0 80px rgba(255,0,128,0.3),
        0 0 120px rgba(255,0,128,0.2) !important;
    opacity: 0 !important;
    transform: scale(0.8) !important;
    transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s !important;
}

.tg-linea-magica {
    width: 0 !important;
    height: 1px !important;
    background: linear-gradient(90deg, transparent, #ff0080, transparent) !important;
    margin: 30px auto 0 !important;
    transition: width 1.5s ease 1s !important;
}

#tg-titulo.active .tg-pre-titulo {
    opacity: 1 !important;
    transform: translateY(0) !important;
}

#tg-titulo.active .tg-titulo-grande {
    opacity: 1 !important;
    transform: scale(1) !important;
}

#tg-titulo.active .tg-linea-magica {
    width: 200px !important;
}

/* ============================================
   PREGUNTA
   ============================================ */

.tg-pregunta-container {
    text-align: center !important;
}

.tg-pregunta-texto {
    font-size: clamp(24px, 6vw, 40px) !important;
    color: #fff !important;
    margin-bottom: 50px !important;
    opacity: 0 !important;
    transform: translateY(30px) !important;
    transition: all 1s ease !important;
}

#tg-pregunta.active .tg-pregunta-texto {
    opacity: 1 !important;
    transform: translateY(0) !important;
}

.tg-btn-grande {
    padding: 22px 60px !important;
    opacity: 0 !important;
    transform: translateY(20px) !important;
    transition: all 1s ease 0.5s, border-color 0.4s, box-shadow 0.4s !important;
}

#tg-pregunta.active .tg-btn-grande {
    opacity: 1 !important;
    transform: translateY(0) !important;
}

/* ============================================
   MÚSICA
   ============================================ */

.tg-musica-container {
    text-align: center !important;
}

.tg-musica-icon {
    font-size: 50px !important;
    color: #ff0080 !important;
    margin-bottom: 30px !important;
    animation: tgMusicPulse 2s ease-in-out infinite !important;
}

@keyframes tgMusicPulse {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 1; }
}

.tg-musica-texto {
    font-size: clamp(16px, 4vw, 22px) !important;
    color: rgba(255,255,255,0.8) !important;
    line-height: 1.6 !important;
    margin-bottom: 40px !important;
}

.tg-musica-botones {
    display: flex !important;
    flex-direction: column !important;
    gap: 15px !important;
    align-items: center !important;
}

/* ============================================
   TEST
   ============================================ */

.tg-test-container {
    width: 100% !important;
    max-width: 600px !important;
    padding: 0 30px !important;
}

.tg-progress {
    position: relative !important;
    height: 2px !important;
    background: rgba(255,255,255,0.1) !important;
    margin-bottom: 60px !important;
    border-radius: 2px !important;
}

.tg-progress-bar {
    height: 100% !important;
    background: linear-gradient(90deg, #ff0080, #ff4da6) !important;
    width: 8.33% !important;
    transition: width 0.5s ease !important;
    border-radius: 2px !important;
    box-shadow: 0 0 10px rgba(255,0,128,0.5) !important;
}

.tg-progress-text {
    position: absolute !important;
    right: 0 !important;
    top: 10px !important;
    font-size: 12px !important;
    color: rgba(255,255,255,0.4) !important;
    letter-spacing: 0.1em !important;
}

.tg-question-area {
    min-height: 80px !important;
    margin-bottom: 50px !important;
}

.tg-question {
    font-size: clamp(18px, 4.5vw, 26px) !important;
    color: #fff !important;
    line-height: 1.5 !important;
    text-align: center !important;
}

.tg-options {
    display: flex !important;
    flex-direction: column !important;
    gap: 18px !important;
}

.tg-option {
    background: rgba(255,0,128,0.05) !important;
    border: 1px solid rgba(255,0,128,0.2) !important;
    padding: 20px 25px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    text-align: left !important;
    border-radius: 8px !important;
}

.tg-option:hover {
    background: rgba(255,0,128,0.15) !important;
    border-color: rgba(255,0,128,0.5) !important;
    transform: translateX(5px) !important;
}

.tg-option span {
    font-size: clamp(14px, 3.5vw, 17px) !important;
    color: rgba(255,255,255,0.9) !important;
    line-height: 1.4 !important;
}

/* ============================================
   FORMULARIO DE DATOS
   ============================================ */

.tg-datos-container {
    width: 100% !important;
    max-width: 450px !important;
    padding: 0 30px !important;
    text-align: center !important;
}

.tg-datos-titulo {
    font-family: 'Cinzel', serif !important;
    font-size: clamp(20px, 5vw, 28px) !important;
    color: #fff !important;
    margin-bottom: 10px !important;
}

.tg-datos-subtitulo {
    font-size: clamp(14px, 3vw, 16px) !important;
    color: rgba(255,255,255,0.6) !important;
    margin-bottom: 40px !important;
    font-style: italic !important;
}

.tg-form {
    display: flex !important;
    flex-direction: column !important;
    gap: 20px !important;
    margin-bottom: 35px !important;
}

.tg-form-group {
    text-align: left !important;
}

.tg-form-group label {
    display: block !important;
    font-size: 12px !important;
    color: #ff0080 !important;
    letter-spacing: 0.15em !important;
    text-transform: uppercase !important;
    margin-bottom: 8px !important;
}

.tg-form-group input,
.tg-form-group select {
    width: 100% !important;
    background: rgba(255,255,255,0.05) !important;
    border: 1px solid rgba(255,0,128,0.3) !important;
    padding: 15px 18px !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 16px !important;
    color: #fff !important;
    border-radius: 8px !important;
    transition: all 0.3s ease !important;
}

.tg-form-group input::placeholder {
    color: rgba(255,255,255,0.4) !important;
}

.tg-form-group input:focus,
.tg-form-group select:focus {
    outline: none !important;
    border-color: #ff0080 !important;
    box-shadow: 0 0 20px rgba(255,0,128,0.2) !important;
}

.tg-form-group select {
    cursor: pointer !important;
    appearance: none !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ff0080' d='M6 8L1 3h10z'/%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important;
    background-position: right 15px center !important;
}

.tg-form-group select option {
    background: #1a1a1a !important;
    color: #fff !important;
}

/* ============================================
   PROCESANDO
   ============================================ */

.tg-procesando-container {
    text-align: center !important;
}

.tg-orb-proceso {
    width: 100px !important;
    height: 100px !important;
    margin: 0 auto 40px !important;
    border-radius: 50% !important;
    background: radial-gradient(circle at 30% 30%, #ff4da6, #ff0080, #990050) !important;
    position: relative !important;
    animation: tgOrbFloatP 3s ease-in-out infinite !important;
}

.tg-orb-proceso::before {
    content: '' !important;
    position: absolute !important;
    top: -10px !important;
    left: -10px !important;
    right: -10px !important;
    bottom: -10px !important;
    border-radius: 50% !important;
    border: 1px solid rgba(255,0,128,0.3) !important;
    animation: tgOrbRing 2s linear infinite !important;
}

@keyframes tgOrbFloatP {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
}

@keyframes tgOrbRing {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
}

.tg-procesando-texto {
    font-size: clamp(16px, 4vw, 20px) !important;
    color: rgba(255,255,255,0.7) !important;
    font-style: italic !important;
}

/* ============================================
   RESULTADO
   ============================================ */

.tg-resultado-container {
    text-align: center !important;
    padding: 30px 25px 50px !important;
    max-width: 550px !important;
    width: 100% !important;
}

.tg-resultado-saludo {
    font-size: clamp(20px, 5vw, 28px) !important;
    color: #fff !important;
    margin-bottom: 5px !important;
}

.tg-resultado-signo {
    font-size: clamp(14px, 3vw, 16px) !important;
    color: #ff0080 !important;
    margin-bottom: 25px !important;
    letter-spacing: 0.1em !important;
}

.tg-resultado-foto {
    width: 140px !important;
    height: 140px !important;
    margin: 0 auto 20px !important;
    border-radius: 50% !important;
    border: 3px solid rgba(255,0,128,0.5) !important;
    overflow: hidden !important;
    box-shadow: 0 0 40px rgba(255,0,128,0.4), 0 0 80px rgba(255,0,128,0.2) !important;
    animation: tgFotoGlow 3s ease-in-out infinite !important;
}

@keyframes tgFotoGlow {
    0%, 100% { box-shadow: 0 0 40px rgba(255,0,128,0.4), 0 0 80px rgba(255,0,128,0.2); }
    50% { box-shadow: 0 0 60px rgba(255,0,128,0.6), 0 0 100px rgba(255,0,128,0.3); }
}

.tg-resultado-foto img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
}

.tg-resultado-guardian {
    margin-bottom: 25px !important;
}

.tg-resultado-pre {
    font-size: clamp(11px, 2.5vw, 13px) !important;
    color: rgba(255,255,255,0.5) !important;
    letter-spacing: 0.3em !important;
    text-transform: uppercase !important;
    margin-bottom: 8px !important;
}

.tg-resultado-nombre {
    font-family: 'Cinzel', serif !important;
    font-size: clamp(24px, 6vw, 36px) !important;
    color: #fff !important;
    text-shadow: 0 0 30px rgba(255,0,128,0.5) !important;
}

.tg-resultado-analisis {
    background: rgba(150,0,255,0.1) !important;
    border: 1px solid rgba(150,0,255,0.3) !important;
    border-radius: 12px !important;
    padding: 20px !important;
    margin-bottom: 20px !important;
}

.tg-analisis-titulo {
    font-size: 11px !important;
    color: rgba(255,255,255,0.5) !important;
    letter-spacing: 0.2em !important;
    text-transform: uppercase !important;
    margin-bottom: 15px !important;
}

.tg-analisis-items {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
}

.tg-analisis-item {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 8px 0 !important;
    border-bottom: 1px solid rgba(255,255,255,0.1) !important;
}

.tg-analisis-item:last-child {
    border-bottom: none !important;
}

.tg-analisis-label {
    font-size: 13px !important;
    color: rgba(255,255,255,0.6) !important;
}

.tg-analisis-valor {
    font-size: 14px !important;
    color: #ff0080 !important;
    font-weight: 500 !important;
}

.tg-resultado-reflexion {
    background: rgba(255,0,128,0.08) !important;
    border: 1px solid rgba(255,0,128,0.2) !important;
    border-radius: 12px !important;
    padding: 20px !important;
    margin-bottom: 20px !important;
}

.tg-reflexion-texto {
    font-size: clamp(14px, 3.5vw, 16px) !important;
    color: rgba(255,255,255,0.85) !important;
    line-height: 1.7 !important;
    font-style: italic !important;
}

.tg-resultado-mensaje {
    margin-bottom: 30px !important;
}

.tg-mensaje-personal {
    font-size: clamp(13px, 3vw, 15px) !important;
    color: rgba(255,255,255,0.7) !important;
    line-height: 1.6 !important;
}

.tg-btn-conocer {
    display: inline-block !important;
    text-decoration: none !important;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 600px) {
    #tg-experience {
        overflow-y: auto !important;
        overflow-x: hidden !important;
    }

    .tg-scene {
        padding: 20px 0 !important;
        min-height: 100vh !important;
        height: auto !important;
        align-items: flex-start !important;
        padding-top: 40px !important;
    }

    #tg-resultado.tg-scene {
        align-items: flex-start !important;
        padding-top: 30px !important;
        padding-bottom: 50px !important;
    }

    .tg-test-container {
        padding: 0 20px !important;
        max-width: 100% !important;
    }

    .tg-options {
        gap: 15px !important;
    }

    .tg-option {
        padding: 18px 20px !important;
    }

    .tg-option span {
        font-size: 15px !important;
        line-height: 1.5 !important;
    }

    .tg-question {
        font-size: 20px !important;
        padding: 0 10px !important;
    }

    .tg-question-area {
        margin-bottom: 35px !important;
    }

    .tg-progress {
        margin-bottom: 40px !important;
    }

    .tg-btn-magic {
        padding: 16px 30px !important;
    }

    .tg-musica-botones {
        width: 100% !important;
        padding: 0 20px !important;
    }

    .tg-btn-magic, .tg-btn-secondary {
        width: 100% !important;
    }

    .tg-intro-content {
        padding: 0 25px !important;
    }

    .tg-main-title {
        letter-spacing: 0.15em !important;
    }

    .tg-datos-container {
        padding: 0 20px !important;
        padding-top: 20px !important;
    }

    .tg-resultado-container {
        padding: 20px 20px 40px !important;
    }

    .tg-resultado-foto {
        width: 120px !important;
        height: 120px !important;
    }

    .tg-resultado-analisis {
        padding: 15px !important;
    }

    .tg-orb-float {
        filter: blur(70px) !important;
        opacity: 0.5 !important;
    }
}
</style>

<script>
(function() {
    'use strict';

    const TG = {
        currentScene: 'tg-intro',
        answers: [],
        withMusic: false,
        userData: {},
        answerProfile: {
            protector: 0,
            sanador: 0,
            sabio: 0,
            abundante: 0,
            traits: []
        },

        questions: [
            {
                q: "Cuando entrás a un lugar nuevo, ¿qué sentís primero?",
                opts: [
                    { t: "La energía del espacio", p: { protector: 2, sanador: 1 }, trait: "sensible" },
                    { t: "Si me siento segura o no", p: { protector: 3 }, trait: "protectora" },
                    { t: "Curiosidad por explorarlo", p: { sabio: 2, abundante: 1 }, trait: "curiosa" },
                    { t: "Nada en particular", p: { sanador: 1 }, trait: "practica" }
                ]
            },
            {
                q: "¿Qué te quita el sueño últimamente?",
                opts: [
                    { t: "Preocupaciones por otros", p: { protector: 3, sanador: 1 }, trait: "cuidadora" },
                    { t: "Mis propios miedos", p: { sanador: 3 }, trait: "vulnerable" },
                    { t: "Ideas que no paran", p: { sabio: 2, abundante: 2 }, trait: "creativa" },
                    { t: "Duermo bien", p: { abundante: 2 }, trait: "equilibrada" }
                ]
            },
            {
                q: "Si pudieras cambiar algo de tu vida ahora mismo, sería...",
                opts: [
                    { t: "Sentirme más en paz", p: { sanador: 3 }, trait: "buscadora de paz" },
                    { t: "Tener más abundancia", p: { abundante: 3 }, trait: "ambiciosa" },
                    { t: "Proteger mejor lo que amo", p: { protector: 3 }, trait: "protectora" },
                    { t: "Entender mi propósito", p: { sabio: 3 }, trait: "buscadora" }
                ]
            },
            {
                q: "¿Cómo describirías tu relación con el dinero?",
                opts: [
                    { t: "Complicada", p: { abundante: 3, sanador: 1 }, trait: "en proceso" },
                    { t: "Fluye cuando lo necesito", p: { abundante: 1, sabio: 2 }, trait: "confiada" },
                    { t: "Siempre preocupada", p: { protector: 2, sanador: 2 }, trait: "ansiosa" },
                    { t: "No pienso mucho en eso", p: { sabio: 2 }, trait: "desapegada" }
                ]
            },
            {
                q: "Cuando alguien te lastima, vos...",
                opts: [
                    { t: "Lo guardo adentro", p: { sanador: 3, protector: 1 }, trait: "contenedora" },
                    { t: "Lo hablo y sigo", p: { sabio: 2, abundante: 1 }, trait: "comunicativa" },
                    { t: "Me alejo para protegerme", p: { protector: 3 }, trait: "autoprotectora" },
                    { t: "Busco entender por qué", p: { sabio: 3 }, trait: "analítica" }
                ]
            },
            {
                q: "¿Qué tipo de personas te atraen?",
                opts: [
                    { t: "Las que me hacen sentir segura", p: { protector: 3 }, trait: "busca seguridad" },
                    { t: "Las que me inspiran", p: { sabio: 2, abundante: 2 }, trait: "inspiradora" },
                    { t: "Las que me entienden sin palabras", p: { sanador: 3 }, trait: "profunda" },
                    { t: "Las que tienen buena energía", p: { abundante: 2, sanador: 1 }, trait: "intuitiva" }
                ]
            },
            {
                q: "Tu mayor miedo secreto es...",
                opts: [
                    { t: "Que me abandonen", p: { protector: 2, sanador: 2 }, trait: "miedo al abandono" },
                    { t: "No ser suficiente", p: { sanador: 3, abundante: 1 }, trait: "autoexigente" },
                    { t: "Perder lo que amo", p: { protector: 3 }, trait: "apegada" },
                    { t: "No cumplir mi misión", p: { sabio: 3 }, trait: "con propósito" }
                ]
            },
            {
                q: "¿Cómo te sentís en este momento de tu vida?",
                opts: [
                    { t: "En transición", p: { sabio: 2, sanador: 2 }, trait: "en cambio" },
                    { t: "Luchando", p: { protector: 2, sanador: 2 }, trait: "guerrera" },
                    { t: "Buscando algo más", p: { abundante: 2, sabio: 2 }, trait: "insatisfecha" },
                    { t: "Perdida", p: { sanador: 3, protector: 1 }, trait: "desorientada" }
                ]
            },
            {
                q: "Si tuvieras un poder mágico, elegirías...",
                opts: [
                    { t: "Sanar a otros", p: { sanador: 3 }, trait: "sanadora" },
                    { t: "Crear abundancia", p: { abundante: 3 }, trait: "manifestadora" },
                    { t: "Proteger a los míos", p: { protector: 3 }, trait: "guardiana" },
                    { t: "Ver la verdad", p: { sabio: 3 }, trait: "visionaria" }
                ]
            },
            {
                q: "¿Qué buscás cuando estás mal?",
                opts: [
                    { t: "Estar sola", p: { sanador: 2, protector: 1 }, trait: "introvertida" },
                    { t: "Alguien que me escuche", p: { sanador: 2, sabio: 1 }, trait: "necesita conexión" },
                    { t: "Distraerme", p: { abundante: 2 }, trait: "evasiva" },
                    { t: "Soluciones concretas", p: { protector: 2, sabio: 2 }, trait: "resolutiva" }
                ]
            },
            {
                q: "La naturaleza para vos es...",
                opts: [
                    { t: "Mi refugio", p: { sanador: 3 }, trait: "conectada con la tierra" },
                    { t: "Fuente de energía", p: { abundante: 2, sabio: 1 }, trait: "recargable" },
                    { t: "Un lugar seguro", p: { protector: 2 }, trait: "busca refugio" },
                    { t: "Donde encuentro respuestas", p: { sabio: 3 }, trait: "contemplativa" }
                ]
            },
            {
                q: "¿Qué sentiste al entrar a este test?",
                opts: [
                    { t: "Curiosidad", p: { sabio: 2, abundante: 1 }, trait: "abierta" },
                    { t: "Esperanza", p: { sanador: 2, abundante: 1 }, trait: "esperanzada" },
                    { t: "Que algo me llamaba", p: { protector: 2, sanador: 2 }, trait: "llamada" },
                    { t: "No sé, pero acá estoy", p: { sabio: 1, sanador: 1, protector: 1 }, trait: "receptiva" }
                ]
            }
        ],

        currentQuestion: 0,

        guardianes: {
            protector: {
                nombre: "Guardián Protector",
                url: "/tienda/?filter_categoria=proteccion",
                img: "https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1e1-3fb0-6260-b144-a02f032539b0_1_1_3f3c7c49-8897-4d89-aaf2-b69dde6572aa-747x1024.png",
                energia: "Protectora",
                necesidad: "Seguridad y amparo"
            },
            sanador: {
                nombre: "Guardián Sanador",
                url: "/tienda/?filter_categoria=sanacion",
                img: "https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dc61a-a5e9-68b0-b5d7-0a44cafc4fcc_1_1_5f1aed10-8408-414f-8c02-93e3f7de4642-1-640x1024.png",
                energia: "Sanadora",
                necesidad: "Paz interior"
            },
            sabio: {
                nombre: "Guardián Sabio",
                url: "/tienda/?filter_categoria=sabiduria",
                img: "https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0deae8-6049-6b50-b9a8-1c040800a30b_0_0_f2e4a994-eeb5-4242-b57b-61156b42f065-747x1024.png",
                energia: "Contemplativa",
                necesidad: "Claridad y propósito"
            },
            abundante: {
                nombre: "Guardián de la Abundancia",
                url: "/tienda/?filter_categoria=abundancia",
                img: "https://duendesdeluruguay.com/wp-content/uploads/2026/01/tranquil_forest_portrait_1f0f0df3-2f7a-68b0-b549-e0398911e187_0_0_b5f80caa-cb21-4a65-99e6-ac773604f271-747x1024.png",
                energia: "Manifestadora",
                necesidad: "Flujo y merecimiento"
            }
        },

        signos: {
            capricornio: { nombre: "Capricornio", emoji: "♑", fechas: [[1,1], [1,19], [12,22], [12,31]] },
            acuario: { nombre: "Acuario", emoji: "♒", fechas: [[1,20], [2,18]] },
            piscis: { nombre: "Piscis", emoji: "♓", fechas: [[2,19], [3,20]] },
            aries: { nombre: "Aries", emoji: "♈", fechas: [[3,21], [4,19]] },
            tauro: { nombre: "Tauro", emoji: "♉", fechas: [[4,20], [5,20]] },
            geminis: { nombre: "Géminis", emoji: "♊", fechas: [[5,21], [6,20]] },
            cancer: { nombre: "Cáncer", emoji: "♋", fechas: [[6,21], [7,22]] },
            leo: { nombre: "Leo", emoji: "♌", fechas: [[7,23], [8,22]] },
            virgo: { nombre: "Virgo", emoji: "♍", fechas: [[8,23], [9,22]] },
            libra: { nombre: "Libra", emoji: "♎", fechas: [[9,23], [10,22]] },
            escorpio: { nombre: "Escorpio", emoji: "♏", fechas: [[10,23], [11,21]] },
            sagitario: { nombre: "Sagitario", emoji: "♐", fechas: [[11,22], [12,21]] }
        },

        reflexiones: {
            protector: [
                "Captamos en vos una energía de guardiana. Cargás con el peso de cuidar a otros, muchas veces olvidándote de vos misma.",
                "Tu alma tiene marcas de batallas que no elegiste pero enfrentaste igual. Es hora de que alguien cuide de vos.",
                "Detectamos una fuerza silenciosa en vos. Protegés a los tuyos con una lealtad que pocos entienden."
            ],
            sanador: [
                "Tu sensibilidad es un don, aunque a veces se sienta como una carga. Absorbés el dolor ajeno como si fuera tuyo.",
                "Captamos heridas que aún no terminaron de sanar. Tu guardián viene a recordarte que merecés la misma compasión que das.",
                "Hay una luz en vos que persiste a pesar de todo. Tu capacidad de sentir profundo es tu mayor fortaleza."
            ],
            sabio: [
                "Tu mente no descansa. Buscás respuestas a preguntas que otros ni siquiera se hacen.",
                "Captamos una sed de propósito en vos. Sentís que hay algo más, algo que todavía no encontraste.",
                "Tu intuición te guía más de lo que reconocés. Es hora de confiar en esa voz interior."
            ],
            abundante: [
                "Detectamos bloqueos en tu flujo de abundancia. Hay algo que te impide recibir lo que merecés.",
                "Tu relación con el merecimiento necesita sanar. El universo tiene mucho para vos, pero primero tenés que abrirte.",
                "Captamos una energía de manifestadora dormida. Tu guardián viene a despertar esa capacidad."
            ]
        },

        mensajes: {
            protector: "Tu Guardián Protector ya te eligió. Él entiende tu cansancio de siempre ser fuerte. Juntos van a encontrar el equilibrio entre cuidar y ser cuidada.",
            sanador: "Tu Guardián Sanador te esperaba. Él sabe exactamente qué heridas necesitan atención. No viniste acá por casualidad.",
            sabio: "Tu Guardián Sabio tiene las respuestas que buscás. Pero más importante: tiene las preguntas correctas que todavía no te hiciste.",
            abundante: "Tu Guardián de la Abundancia está listo para desbloquear tu flujo. Lo que el universo tiene para vos es más grande de lo que imaginás."
        },

        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            document.getElementById('tg-btn-activar').addEventListener('click', () => this.startExperience());
            document.getElementById('tg-btn-descubrir').addEventListener('click', () => this.showMusic());
            document.getElementById('tg-btn-con-musica').addEventListener('click', () => this.startTest(true));
            document.getElementById('tg-btn-sin-musica').addEventListener('click', () => this.startTest(false));
            document.getElementById('tg-btn-ver-resultado').addEventListener('click', () => this.processForm());
        },

        goToScene: function(sceneId) {
            document.querySelectorAll('.tg-scene').forEach(s => s.classList.remove('active'));
            const scene = document.getElementById(sceneId);
            scene.classList.add('active');
            this.currentScene = sceneId;
        },

        startExperience: function() {
            this.goToScene('tg-elegidos');
            setTimeout(() => this.animateLines('tg-elegidos'), 500);
            setTimeout(() => this.goToScene('tg-titulo'), 5000);
            setTimeout(() => this.goToScene('tg-explicacion'), 9000);
            setTimeout(() => this.animateLines('tg-explicacion'), 9500);
            setTimeout(() => this.goToScene('tg-pregunta'), 14000);
        },

        animateLines: function(sceneId) {
            const scene = document.getElementById(sceneId);
            const lines = scene.querySelectorAll('.tg-text-line');
            lines.forEach((line, i) => {
                setTimeout(() => line.classList.add('visible'), i * 1200);
            });
        },

        showMusic: function() {
            this.goToScene('tg-musica');
        },

        startTest: function(withMusic) {
            this.withMusic = withMusic;
            if (withMusic) {
                const audio = document.getElementById('tg-audio');
                audio.volume = 0.3;
                audio.play().catch(() => {});
            }
            this.goToScene('tg-test');
            this.showQuestion();
        },

        showQuestion: function() {
            const q = this.questions[this.currentQuestion];
            const container = document.getElementById('tg-test');

            container.querySelector('.tg-question').textContent = q.q;
            container.querySelector('.tg-progress-bar').style.width = ((this.currentQuestion + 1) / 12 * 100) + '%';
            container.querySelector('.tg-progress-text').textContent = (this.currentQuestion + 1) + ' / 12';

            const optionsDiv = container.querySelector('.tg-options');
            optionsDiv.innerHTML = '';

            q.opts.forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = 'tg-option';
                btn.innerHTML = '<span>' + opt.t + '</span>';
                btn.addEventListener('click', () => this.selectOption(i));
                optionsDiv.appendChild(btn);
            });
        },

        selectOption: function(idx) {
            const q = this.questions[this.currentQuestion];
            const opt = q.opts[idx];

            for (let key in opt.p) {
                this.answerProfile[key] += opt.p[key];
            }
            if (opt.trait) {
                this.answerProfile.traits.push(opt.trait);
            }

            this.currentQuestion++;

            if (this.currentQuestion >= this.questions.length) {
                this.goToScene('tg-datos');
            } else {
                this.showQuestion();
            }
        },

        getZodiacSign: function(dateStr) {
            if (!dateStr) return null;
            const date = new Date(dateStr);
            const month = date.getMonth() + 1;
            const day = date.getDate();

            if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'acuario';
            if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'piscis';
            if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
            if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'tauro';
            if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'geminis';
            if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
            if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
            if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
            if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
            if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'escorpio';
            if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagitario';
            return 'capricornio';
        },

        processForm: function() {
            const nombre = document.getElementById('tg-nombre').value.trim();
            const nacimiento = document.getElementById('tg-nacimiento').value;
            const email = document.getElementById('tg-email').value.trim();
            const pais = document.getElementById('tg-pais').value;

            if (!nombre) {
                alert('Por favor ingresá tu nombre');
                return;
            }
            if (!nacimiento) {
                alert('Por favor ingresá tu fecha de nacimiento');
                return;
            }
            if (!email) {
                alert('Por favor ingresá tu email');
                return;
            }

            this.userData = {
                nombre: nombre,
                nacimiento: nacimiento,
                email: email,
                pais: pais,
                telefono: document.getElementById('tg-telefono').value.trim()
            };

            this.goToScene('tg-procesando');
            setTimeout(() => this.showResult(), 3500);
        },

        showResult: function() {
            let maxScore = 0;
            let result = 'sanador';

            for (let key of ['protector', 'sanador', 'sabio', 'abundante']) {
                if (this.answerProfile[key] > maxScore) {
                    maxScore = this.answerProfile[key];
                    result = key;
                }
            }

            const guardian = this.guardianes[result];
            const signoKey = this.getZodiacSign(this.userData.nacimiento);
            const signo = this.signos[signoKey];
            const reflexion = this.reflexiones[result][Math.floor(Math.random() * this.reflexiones[result].length)];
            const mensaje = this.mensajes[result];

            // Calcular compatibilidad basada en signo y guardian
            const compatibilidades = {
                protector: { aries: 85, tauro: 95, geminis: 70, cancer: 98, leo: 80, virgo: 90, libra: 75, escorpio: 92, sagitario: 72, capricornio: 94, acuario: 68, piscis: 88 },
                sanador: { aries: 70, tauro: 88, geminis: 75, cancer: 96, leo: 72, virgo: 85, libra: 90, escorpio: 94, sagitario: 68, capricornio: 82, acuario: 78, piscis: 98 },
                sabio: { aries: 75, tauro: 80, geminis: 95, cancer: 72, leo: 78, virgo: 98, libra: 88, escorpio: 90, sagitario: 92, capricornio: 85, acuario: 96, piscis: 82 },
                abundante: { aries: 92, tauro: 98, geminis: 85, cancer: 78, leo: 96, virgo: 88, libra: 94, escorpio: 80, sagitario: 95, capricornio: 90, acuario: 82, piscis: 75 }
            };
            const compatPct = compatibilidades[result][signoKey] || 85;

            const container = document.getElementById('tg-resultado');

            container.querySelector('.tg-resultado-saludo').textContent = this.userData.nombre + ',';
            container.querySelector('.tg-resultado-signo').textContent = signo.emoji + ' ' + signo.nombre;
            container.querySelector('#tg-duende-img').src = guardian.img;
            container.querySelector('.tg-resultado-nombre').textContent = guardian.nombre;
            container.querySelector('#tg-energia').textContent = guardian.energia;
            container.querySelector('#tg-necesidad').textContent = guardian.necesidad;
            container.querySelector('#tg-compatibilidad').textContent = compatPct + '%';
            container.querySelector('.tg-reflexion-texto').textContent = reflexion;
            container.querySelector('.tg-mensaje-personal').textContent = mensaje;
            container.querySelector('.tg-btn-conocer').href = guardian.url;

            this.goToScene('tg-resultado');
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => TG.init());
    } else {
        TG.init();
    }
})();
</script>

</div>
<?php
    return ob_get_clean();
}

add_shortcode('test_guardian', 'duendes_test_guardian_v14_render');
add_shortcode('test-guardian', 'duendes_test_guardian_v14_render');
