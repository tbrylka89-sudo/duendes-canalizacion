<?php
/*
Plugin Name: Test Guardian v15 - SISTEMA COMPLETO
Description: Test del Guardian con perfilado psicologico, productos reales y sincronicidades
Version: 15.0
*/
if (!defined('ABSPATH')) exit;

// Interceptar la pagina del test ANTES de que Elementor la procese
add_action('template_redirect', function() {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, 'descubri-que-duende-te-elige') === false &&
        strpos($uri, 'test-guardian') === false) {
        return;
    }

    duendes_test_guardian_v15_standalone();
    exit;
}, 1);

function duendes_test_guardian_v15_standalone() {
    $v = '15.0.' . time();
    $api_base = 'https://duendes-vercel.vercel.app'; // Cambiar a produccion
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Descubri que Guardian te Elige - Duendes del Uruguay</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">
    <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
        font-family: 'Cormorant Garamond', Georgia, serif;
        background: #050208;
        min-height: 100vh;
        overflow-x: hidden;
        color: #fff;
    }

    #tg-app {
        position: relative;
        min-height: 100vh;
        background: radial-gradient(ellipse at 50% 30%, #0d0815 0%, #050208 50%, #000 100%);
    }

    /* FONDO ANIMADO */
    .tg-bg-orbs {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    }

    .tg-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        animation: orbFloat 20s ease-in-out infinite;
    }

    .tg-orb-1 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(139,0,255,0.3) 0%, transparent 70%);
        top: -15%;
        left: -10%;
        animation-duration: 25s;
    }

    .tg-orb-2 {
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(255,0,128,0.25) 0%, transparent 70%);
        top: 40%;
        right: -5%;
        animation-duration: 30s;
        animation-delay: -5s;
    }

    .tg-orb-3 {
        width: 350px;
        height: 350px;
        background: radial-gradient(circle, rgba(75,0,130,0.3) 0%, transparent 70%);
        bottom: -10%;
        left: 20%;
        animation-duration: 22s;
        animation-delay: -10s;
    }

    @keyframes orbFloat {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -30px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.95); }
    }

    /* PANTALLAS */
    .tg-screen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.6s ease, visibility 0.6s ease;
        z-index: 1;
    }

    .tg-screen.active {
        opacity: 1;
        visibility: visible;
        position: relative;
    }

    /* CONTENEDOR CENTRAL */
    .tg-container {
        width: 100%;
        max-width: 600px;
        text-align: center;
    }

    /* TIPOGRAFIA */
    .tg-title {
        font-family: 'Cinzel', serif;
        font-size: clamp(28px, 8vw, 52px);
        font-weight: 400;
        letter-spacing: 0.15em;
        color: #fff;
        margin-bottom: 15px;
        text-shadow: 0 0 40px rgba(255,0,128,0.3);
    }

    .tg-subtitle {
        font-size: clamp(16px, 4vw, 22px);
        color: #ff0080;
        font-style: italic;
        letter-spacing: 0.1em;
        margin-bottom: 50px;
    }

    .tg-text {
        font-size: clamp(18px, 4vw, 24px);
        color: rgba(255,255,255,0.85);
        line-height: 1.7;
        margin-bottom: 30px;
    }

    .tg-text-small {
        font-size: 16px;
        color: rgba(255,255,255,0.6);
        margin-bottom: 20px;
    }

    /* BOTONES */
    .tg-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(255,0,128,0.2) 0%, rgba(139,0,255,0.2) 100%);
        border: 2px solid rgba(255,0,128,0.6);
        padding: 20px 50px;
        border-radius: 50px;
        font-family: 'Cinzel', serif;
        font-size: clamp(14px, 3vw, 16px);
        letter-spacing: 0.15em;
        color: #fff;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.4s ease;
        text-decoration: none;
        min-width: 280px;
    }

    .tg-btn:hover {
        background: linear-gradient(135deg, rgba(255,0,128,0.35) 0%, rgba(139,0,255,0.35) 100%);
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(255,0,128,0.3);
    }

    .tg-btn-secondary {
        background: transparent;
        border-color: rgba(255,255,255,0.3);
        min-width: 200px;
        padding: 15px 35px;
    }

    .tg-btn-secondary:hover {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.5);
    }

    .tg-btn-group {
        display: flex;
        gap: 20px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 30px;
    }

    /* FORMULARIO */
    .tg-form-group {
        margin-bottom: 20px;
        text-align: left;
    }

    .tg-label {
        display: block;
        font-size: 14px;
        color: rgba(255,255,255,0.6);
        margin-bottom: 8px;
        letter-spacing: 0.05em;
    }

    .tg-input {
        width: 100%;
        padding: 16px 20px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,0,128,0.3);
        border-radius: 12px;
        color: #fff;
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
        transition: all 0.3s ease;
    }

    .tg-input:focus {
        outline: none;
        border-color: #ff0080;
        box-shadow: 0 0 20px rgba(255,0,128,0.2);
    }

    .tg-input::placeholder {
        color: rgba(255,255,255,0.3);
    }

    .tg-select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ff0080' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 15px center;
        padding-right: 40px;
    }

    .tg-select option {
        background: #1a1a1a;
        color: #fff;
    }

    .tg-textarea {
        min-height: 120px;
        resize: vertical;
    }

    /* PREGUNTAS */
    .tg-question-card {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,0,128,0.2);
        border-radius: 20px;
        padding: 40px 30px;
        margin-bottom: 20px;
    }

    .tg-question-number {
        font-size: 13px;
        color: #ff0080;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        margin-bottom: 20px;
    }

    .tg-question-text {
        font-size: clamp(20px, 5vw, 26px);
        color: #fff;
        line-height: 1.5;
        margin-bottom: 30px;
    }

    .tg-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .tg-option {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,0,128,0.25);
        padding: 18px 24px;
        border-radius: 12px;
        color: #fff;
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
    }

    .tg-option:hover {
        background: rgba(255,0,128,0.15);
        border-color: #ff0080;
        transform: translateX(8px);
    }

    .tg-option.selected {
        background: rgba(255,0,128,0.25);
        border-color: #ff0080;
    }

    /* PROGRESO */
    .tg-progress {
        width: 100%;
        height: 4px;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        margin-top: 30px;
        overflow: hidden;
    }

    .tg-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #ff0080, #8b00ff);
        border-radius: 2px;
        transition: width 0.5s ease;
    }

    /* LOADING */
    .tg-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
    }

    .tg-spinner {
        width: 60px;
        height: 60px;
        border: 3px solid rgba(255,0,128,0.2);
        border-top-color: #ff0080;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* RESULTADO */
    .tg-result-card {
        background: linear-gradient(135deg, rgba(255,0,128,0.1) 0%, rgba(139,0,255,0.1) 100%);
        border: 1px solid rgba(255,0,128,0.3);
        border-radius: 24px;
        padding: 40px 30px;
        margin-bottom: 30px;
    }

    .tg-result-signo {
        font-size: 48px;
        margin-bottom: 10px;
    }

    .tg-result-signo-nombre {
        font-family: 'Cinzel', serif;
        font-size: 24px;
        color: #ff0080;
        margin-bottom: 30px;
    }

    .tg-guardian-img {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #ff0080;
        margin: 0 auto 20px;
        display: block;
        box-shadow: 0 0 40px rgba(255,0,128,0.4);
    }

    .tg-guardian-nombre {
        font-family: 'Cinzel', serif;
        font-size: clamp(24px, 6vw, 32px);
        color: #fff;
        margin-bottom: 10px;
    }

    .tg-guardian-categoria {
        font-size: 14px;
        color: #ff0080;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-bottom: 20px;
    }

    .tg-guardian-precio {
        font-size: 28px;
        color: #fff;
        margin-bottom: 30px;
    }

    .tg-sincronicidad {
        background: rgba(0,0,0,0.3);
        border-left: 3px solid #ff0080;
        padding: 20px;
        margin: 20px 0;
        text-align: left;
    }

    .tg-sincronicidad-titulo {
        font-size: 12px;
        color: #ff0080;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 8px;
    }

    .tg-sincronicidad-texto {
        font-size: 16px;
        color: rgba(255,255,255,0.85);
        font-style: italic;
    }

    .tg-mensaje-guardian {
        background: rgba(255,255,255,0.05);
        border-radius: 16px;
        padding: 30px;
        margin: 30px 0;
        font-size: 18px;
        line-height: 1.7;
        color: rgba(255,255,255,0.9);
        font-style: italic;
    }

    .tg-alternativas {
        margin-top: 40px;
        padding-top: 30px;
        border-top: 1px solid rgba(255,255,255,0.1);
    }

    .tg-alternativas-titulo {
        font-size: 14px;
        color: rgba(255,255,255,0.5);
        margin-bottom: 20px;
    }

    .tg-alternativas-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
    }

    .tg-alt-item {
        text-align: center;
        text-decoration: none;
    }

    .tg-alt-img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(255,0,128,0.4);
        margin-bottom: 8px;
    }

    .tg-alt-nombre {
        font-size: 12px;
        color: rgba(255,255,255,0.7);
    }

    /* CONVERSION ELEMENTS */
    .tg-urgencia-badge {
        background: linear-gradient(90deg, #ff0080 0%, #8b00ff 100%);
        color: white;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 8px 20px;
        border-radius: 20px;
        display: inline-block;
        margin: 10px auto 20px;
        animation: pulse-soft 2s ease-in-out infinite;
    }

    @keyframes pulse-soft {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.02); opacity: 0.9; }
    }

    .tg-conversion-box {
        background: rgba(255,0,128,0.08);
        border-left: 3px solid rgba(255,0,128,0.5);
        padding: 15px 20px;
        margin: 20px 0;
        text-align: left;
        border-radius: 0 12px 12px 0;
    }

    .tg-conversion-texto {
        font-size: 15px;
        color: rgba(255,255,255,0.85);
        font-style: italic;
        margin: 0;
        line-height: 1.5;
    }

    .tg-btn-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin: 25px 0;
    }

    .tg-btn-principal {
        background: linear-gradient(135deg, #ff0080 0%, #8b00ff 100%);
        font-size: 18px;
        padding: 18px 40px;
    }

    .tg-btn-principal:hover {
        transform: scale(1.03);
        box-shadow: 0 8px 30px rgba(255,0,128,0.5);
    }

    /* EMAIL CAPTURE */
    .tg-email-box {
        background: rgba(255,255,255,0.05);
        border-radius: 16px;
        padding: 30px;
        margin: 30px 0;
    }

    .tg-email-title {
        font-family: 'Cinzel', serif;
        font-size: 18px;
        color: #fff;
        margin-bottom: 15px;
    }

    /* AUDIO CONTROL */
    .tg-audio-control {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(255,0,128,0.2);
        border: 1px solid rgba(255,0,128,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 100;
        transition: all 0.3s ease;
    }

    .tg-audio-control:hover {
        background: rgba(255,0,128,0.4);
    }

    .tg-audio-icon {
        font-size: 20px;
    }

    /* RESPONSIVE */
    @media (max-width: 600px) {
        .tg-screen {
            padding: 30px 15px;
        }

        .tg-question-card {
            padding: 30px 20px;
        }

        .tg-btn {
            width: 100%;
            min-width: unset;
        }

        .tg-btn-group {
            flex-direction: column;
        }

        .tg-alternativas-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }

        .tg-alt-img {
            width: 60px;
            height: 60px;
        }
    }
    </style>
</head>
<body>
<div id="tg-app">
    <!-- FONDO ANIMADO -->
    <div class="tg-bg-orbs">
        <div class="tg-orb tg-orb-1"></div>
        <div class="tg-orb tg-orb-2"></div>
        <div class="tg-orb tg-orb-3"></div>
    </div>

    <!-- PANTALLA 1: INICIO -->
    <div id="screen-inicio" class="tg-screen active">
        <div class="tg-container">
            <h1 class="tg-title">DUENDES DEL URUGUAY</h1>
            <p class="tg-subtitle">Canalizados para vos</p>
            <p class="tg-text">Hay un guardian que ya te eligio.<br>Solo falta que lo descubras.</p>
            <button class="tg-btn" onclick="TG.iniciarExperiencia()">
                Descubrir mi Guardian
            </button>
        </div>
    </div>

    <!-- PANTALLA 2: MUSICA -->
    <div id="screen-musica" class="tg-screen">
        <div class="tg-container">
            <div style="font-size: 60px; margin-bottom: 30px;">♫</div>
            <h2 class="tg-title" style="font-size: clamp(22px, 5vw, 32px);">Antes de empezar...</h2>
            <p class="tg-text">¿Queres musica ambiente para conectar mejor?</p>
            <div class="tg-btn-group">
                <button class="tg-btn" onclick="TG.elegirMusica(true)">Si, con musica</button>
                <button class="tg-btn tg-btn-secondary" onclick="TG.elegirMusica(false)">Prefiero silencio</button>
            </div>
        </div>
    </div>

    <!-- PANTALLA 3: DATOS BASICOS -->
    <div id="screen-datos" class="tg-screen">
        <div class="tg-container">
            <h2 class="tg-title" style="font-size: clamp(22px, 5vw, 32px);">Presentate</h2>
            <p class="tg-text-small">Para que tu guardian pueda reconocerte</p>

            <form id="form-datos" style="margin-top: 30px;">
                <div class="tg-form-group">
                    <label class="tg-label">Tu nombre (o como quieras que te llame)</label>
                    <input type="text" id="input-nombre" class="tg-input" placeholder="Ej: Maria, Lu, Caro..." required>
                </div>

                <div class="tg-form-group">
                    <label class="tg-label">Fecha de nacimiento</label>
                    <input type="date" id="input-nacimiento" class="tg-input" required>
                </div>

                <div class="tg-form-group">
                    <label class="tg-label">Email (para enviarte el resultado)</label>
                    <input type="email" id="input-email" class="tg-input" placeholder="tu@email.com" required>
                </div>

                <div class="tg-form-group">
                    <label class="tg-label">Pais</label>
                    <select id="input-pais" class="tg-input tg-select" required>
                        <option value="">Selecciona...</option>
                        <option value="AR">Argentina</option>
                        <option value="UY">Uruguay</option>
                        <option value="CL">Chile</option>
                        <option value="MX">Mexico</option>
                        <option value="CO">Colombia</option>
                        <option value="ES">Espana</option>
                        <option value="US">Estados Unidos</option>
                        <option value="OTHER">Otro</option>
                    </select>
                </div>

                <button type="submit" class="tg-btn" style="margin-top: 20px;">Continuar</button>
            </form>
        </div>
    </div>

    <!-- PANTALLA 4: TEST -->
    <div id="screen-test" class="tg-screen">
        <div class="tg-container">
            <div id="pregunta-container"></div>
        </div>
    </div>

    <!-- PANTALLA 5: PROCESANDO -->
    <div id="screen-procesando" class="tg-screen">
        <div class="tg-container">
            <div class="tg-loading">
                <div class="tg-spinner"></div>
                <p class="tg-text">Conectando con los guardianes...</p>
                <p class="tg-text-small" id="loading-mensaje">Analizando tu energia</p>
            </div>
        </div>
    </div>

    <!-- PANTALLA 6: RESULTADO -->
    <div id="screen-resultado" class="tg-screen">
        <div class="tg-container">
            <div class="tg-result-card">
                <p id="result-saludo" class="tg-text"></p>

                <div id="result-signo-box">
                    <div id="result-signo-emoji" class="tg-result-signo"></div>
                    <div id="result-signo-nombre" class="tg-result-signo-nombre"></div>
                </div>

                <div id="result-sincronicidades"></div>
            </div>

            <div class="tg-result-card">
                <p class="tg-text-small">Tu guardian es...</p>
                <img id="result-guardian-img" class="tg-guardian-img" src="" alt="">
                <h3 id="result-guardian-nombre" class="tg-guardian-nombre"></h3>
                <p id="result-guardian-categoria" class="tg-guardian-categoria"></p>
                <p id="result-guardian-precio" class="tg-guardian-precio"></p>

                <!-- Badge de urgencia (se muestra si aplica) -->
                <div id="result-urgencia" class="tg-urgencia-badge" style="display: none;"></div>

                <div id="result-mensaje" class="tg-mensaje-guardian"></div>

                <!-- Texto de conversion sutil -->
                <div id="result-conversion" class="tg-conversion-box" style="display: none;"></div>

                <div class="tg-btn-container">
                    <a id="result-btn-conocer" href="#" class="tg-btn tg-btn-principal" target="_blank">
                        Conocer a mi Guardian
                    </a>
                    <a id="result-btn-secundario" href="#" class="tg-btn tg-btn-secondary" style="display: none;">
                        Guardar para despues
                    </a>
                </div>

                <div id="result-alternativas" class="tg-alternativas">
                    <p class="tg-alternativas-titulo">Otros guardianes que resuenan con vos:</p>
                    <div id="result-alt-grid" class="tg-alternativas-grid"></div>
                </div>
            </div>

            <div class="tg-email-box">
                <p class="tg-email-title">¿Queres recibir un mensaje personalizado de tu guardian?</p>
                <p class="tg-text-small">Te lo enviamos a tu email junto con tu perfil completo.</p>
                <button class="tg-btn" onclick="TG.enviarResultado()">
                    Si, enviamelo
                </button>
            </div>
        </div>
    </div>

    <!-- CONTROL DE AUDIO -->
    <div id="audio-control" class="tg-audio-control" style="display: none;" onclick="TG.toggleMusica()">
        <span class="tg-audio-icon">🔊</span>
    </div>
</div>

<script>
const TG = {
    // Estado
    pantalla: 'inicio',
    audio: null,
    conMusica: false,
    userData: {},
    respuestas: {},
    preguntaActual: 0,
    resultado: null,

    // Preguntas de perfilado
    preguntas: [
        {
            id: 'sentimiento_actual',
            texto: '¿Como te sentis en este momento de tu vida?',
            tipo: 'opciones',
            opciones: [
                { texto: 'En paz, pero buscando algo mas', valor: 'buscando', vulnerabilidad: 0, dolor: 'proposito' },
                { texto: 'Cansada de cargar con todo', valor: 'carga', vulnerabilidad: 20, dolor: 'relaciones' },
                { texto: 'Perdida, sin saber que camino tomar', valor: 'perdida', vulnerabilidad: 15, dolor: 'proposito' },
                { texto: 'Ansiosa por cambiar algo que no funciona', valor: 'ansiosa', vulnerabilidad: 10, dolor: 'dinero' },
                { texto: 'Triste, aunque no siempre sepa por que', valor: 'triste', vulnerabilidad: 25, dolor: 'soledad' }
            ]
        },
        {
            id: 'necesidad_principal',
            texto: '¿Que es lo que mas necesitas ahora mismo?',
            tipo: 'opciones',
            opciones: [
                { texto: 'Sentirme protegida y segura', valor: 'proteccion', vulnerabilidad: 10, dolor: 'relaciones', categoria: 'proteccion' },
                { texto: 'Desbloquear mi abundancia', valor: 'abundancia', vulnerabilidad: 0, dolor: 'dinero', categoria: 'abundancia' },
                { texto: 'Sanar algo que me duele', valor: 'sanacion', vulnerabilidad: 15, dolor: 'salud', categoria: 'sanacion' },
                { texto: 'Encontrar claridad y direccion', valor: 'claridad', vulnerabilidad: 5, dolor: 'proposito', categoria: 'sabiduria' },
                { texto: 'Conectar con alguien que me entienda', valor: 'conexion', vulnerabilidad: 20, dolor: 'soledad', categoria: 'amor' }
            ]
        },
        {
            id: 'patron_repetido',
            texto: '¿Hay algo que se repite en tu vida y quisieras cambiar?',
            tipo: 'opciones',
            opciones: [
                { texto: 'Siempre termino cuidando a todos menos a mi', valor: 'cuidadora', dolor: 'relaciones' },
                { texto: 'El dinero viene y se va, nunca alcanza', valor: 'escasez', dolor: 'dinero' },
                { texto: 'Empiezo cosas con entusiasmo y las abandono', valor: 'abandono', dolor: 'proposito' },
                { texto: 'Me cuesta confiar en la gente', valor: 'desconfianza', dolor: 'soledad' },
                { texto: 'Pongo las necesidades de otros antes que las mias', valor: 'autopostergacion', dolor: 'relaciones' }
            ]
        },
        {
            id: 'momento_vida',
            texto: '¿Como describirias este momento de tu vida?',
            tipo: 'opciones',
            opciones: [
                { texto: 'Estoy en crisis, necesito ayuda urgente', valor: 'crisis', vulnerabilidad: 30 },
                { texto: 'Estoy en transicion, algo esta cambiando', valor: 'transicion', vulnerabilidad: 10 },
                { texto: 'Estoy estancada, nada se mueve', valor: 'estancamiento', vulnerabilidad: 15 },
                { texto: 'Estoy bien, pero busco crecer', valor: 'crecimiento', vulnerabilidad: 0 },
                { texto: 'Estoy reconstruyendome despues de algo dificil', valor: 'reconstruccion', vulnerabilidad: 20 }
            ]
        },
        {
            id: 'creencias',
            texto: '¿Que pensas sobre la energia y lo espiritual?',
            tipo: 'opciones',
            opciones: [
                { texto: 'Creo firmemente, lo siento en mi vida', valor: 'creyente', creencia: 'creyente' },
                { texto: 'Estoy abierta a explorar, aunque tengo dudas', valor: 'buscador', creencia: 'buscador' },
                { texto: 'Soy esceptica, pero algo me trajo aca', valor: 'esceptico', creencia: 'esceptico' },
                { texto: 'No se bien que creer, pero quiero sentir algo', valor: 'explorando', creencia: 'buscador' }
            ]
        },
        {
            id: 'decision',
            texto: '¿Como tomas decisiones importantes?',
            tipo: 'opciones',
            opciones: [
                { texto: 'Rapido, cuando algo me resuena actuo', valor: 'rapido', estilo: 'impulsivo' },
                { texto: 'Investigo todo antes de decidir', valor: 'investigo', estilo: 'analitico' },
                { texto: 'Consulto con gente de confianza', valor: 'consulto', estilo: 'emocional' },
                { texto: 'Me cuesta decidir, le doy muchas vueltas', valor: 'indeciso', estilo: 'analitico' }
            ]
        },
        {
            id: 'texto_libre',
            texto: '¿Hay algo que quieras contarle a tu guardian? Algo que te pese, que te ilusione, o que necesites soltar...',
            tipo: 'texto',
            placeholder: 'Escribi lo que sientas, sin filtro...'
        }
    ],

    // Iniciar
    init: function() {
        document.getElementById('form-datos').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarDatos();
        });
    },

    // Cambiar pantalla
    irA: function(pantalla) {
        document.querySelectorAll('.tg-screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screen-' + pantalla).classList.add('active');
        this.pantalla = pantalla;
        window.scrollTo(0, 0);
    },

    // Inicio experiencia
    iniciarExperiencia: function() {
        this.irA('musica');
    },

    // Elegir musica
    elegirMusica: function(conMusica) {
        this.conMusica = conMusica;
        if (conMusica) {
            this.audio = new Audio('https://duendesdeluruguay.com/wp-content/uploads/2025/12/Raices-y-Agua-Interior.mp3');
            this.audio.loop = true;
            this.audio.volume = 0.3;
            this.audio.play().then(() => {
                document.getElementById('audio-control').style.display = 'flex';
            }).catch(e => {
                console.log('Audio bloqueado por el navegador');
            });
        }
        this.irA('datos');
    },

    // Toggle musica
    toggleMusica: function() {
        if (!this.audio) return;
        if (this.audio.paused) {
            this.audio.play();
            document.querySelector('.tg-audio-icon').textContent = '🔊';
        } else {
            this.audio.pause();
            document.querySelector('.tg-audio-icon').textContent = '🔇';
        }
    },

    // Guardar datos
    guardarDatos: function() {
        this.userData = {
            nombre: document.getElementById('input-nombre').value.trim(),
            nacimiento: document.getElementById('input-nacimiento').value,
            email: document.getElementById('input-email').value.trim(),
            pais: document.getElementById('input-pais').value
        };
        this.irA('test');
        this.mostrarPregunta(0);
    },

    // Mostrar pregunta
    mostrarPregunta: function(indice) {
        this.preguntaActual = indice;
        const pregunta = this.preguntas[indice];
        const container = document.getElementById('pregunta-container');
        const total = this.preguntas.length;

        let html = '<div class="tg-question-card">';
        html += '<div class="tg-question-number">Pregunta ' + (indice + 1) + ' de ' + total + '</div>';
        html += '<p class="tg-question-text">' + pregunta.texto + '</p>';

        if (pregunta.tipo === 'opciones') {
            html += '<div class="tg-options">';
            pregunta.opciones.forEach((op, i) => {
                html += '<button class="tg-option" onclick="TG.responder(' + i + ')">' + op.texto + '</button>';
            });
            html += '</div>';
        } else if (pregunta.tipo === 'texto') {
            html += '<textarea id="respuesta-texto" class="tg-input tg-textarea" placeholder="' + (pregunta.placeholder || '') + '"></textarea>';
            html += '<button class="tg-btn" style="margin-top: 20px;" onclick="TG.responderTexto()">Continuar</button>';
        }

        html += '<div class="tg-progress"><div class="tg-progress-bar" style="width: ' + (((indice + 1) / total) * 100) + '%"></div></div>';
        html += '</div>';

        container.innerHTML = html;
    },

    // Responder opcion
    responder: function(indiceOpcion) {
        const pregunta = this.preguntas[this.preguntaActual];
        const opcion = pregunta.opciones[indiceOpcion];

        this.respuestas[pregunta.id] = opcion.valor;

        // Guardar metadatos
        if (opcion.vulnerabilidad) this.respuestas._vulnerabilidad = (this.respuestas._vulnerabilidad || 0) + opcion.vulnerabilidad;
        if (opcion.dolor) this.respuestas._dolor = opcion.dolor;
        if (opcion.categoria) this.respuestas._categoria = opcion.categoria;
        if (opcion.creencia) this.respuestas._creencia = opcion.creencia;
        if (opcion.estilo) this.respuestas._estilo = opcion.estilo;

        // Siguiente o finalizar
        if (this.preguntaActual < this.preguntas.length - 1) {
            this.mostrarPregunta(this.preguntaActual + 1);
        } else {
            this.procesarResultados();
        }
    },

    // Responder texto
    responderTexto: function() {
        const texto = document.getElementById('respuesta-texto').value.trim();
        const pregunta = this.preguntas[this.preguntaActual];
        this.respuestas[pregunta.id] = texto;

        if (this.preguntaActual < this.preguntas.length - 1) {
            this.mostrarPregunta(this.preguntaActual + 1);
        } else {
            this.procesarResultados();
        }
    },

    // Procesar resultados
    procesarResultados: async function() {
        this.irA('procesando');

        const mensajes = [
            'Analizando tu energia...',
            'Consultando con los guardianes...',
            'Buscando tu conexion perfecta...',
            'Preparando tu mensaje...'
        ];

        let i = 0;
        const intervalo = setInterval(() => {
            document.getElementById('loading-mensaje').textContent = mensajes[i % mensajes.length];
            i++;
        }, 2000);

        try {
            // Llamar a la API
            const response = await fetch('<?php echo $api_base; ?>/api/test-guardian/analizar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: this.userData.nombre,
                    email: this.userData.email,
                    fechaNacimiento: this.userData.nacimiento,
                    pais: this.userData.pais,
                    respuestas: this.respuestas
                })
            });

            const data = await response.json();
            clearInterval(intervalo);

            if (data.success) {
                this.resultado = data;
                this.mostrarResultado(data);
            } else {
                throw new Error(data.error || 'Error procesando');
            }
        } catch (error) {
            clearInterval(intervalo);
            console.error('Error:', error);
            // Fallback local si la API falla
            this.mostrarResultadoFallback();
        }
    },

    // Mostrar resultado
    mostrarResultado: function(data) {
        // Saludo
        document.getElementById('result-saludo').textContent = data.usuario.nombre + ', esto es lo que los guardianes tienen para vos...';

        // Signo
        if (data.signo) {
            document.getElementById('result-signo-emoji').textContent = data.signo.emoji;
            document.getElementById('result-signo-nombre').textContent = data.signo.nombre;
        }

        // Sincronicidades
        const sincroContainer = document.getElementById('result-sincronicidades');
        sincroContainer.innerHTML = '';
        if (data.sincronicidades && data.sincronicidades.length > 0) {
            data.sincronicidades.forEach(s => {
                sincroContainer.innerHTML += `
                    <div class="tg-sincronicidad">
                        <div class="tg-sincronicidad-titulo">✦ Sincronicidad</div>
                        <div class="tg-sincronicidad-texto">${s.mensaje}</div>
                    </div>
                `;
            });
        }

        // Guardian
        if (data.guardian) {
            document.getElementById('result-guardian-img').src = data.guardian.imagen || '';
            document.getElementById('result-guardian-nombre').textContent = data.guardian.nombre;
            document.getElementById('result-guardian-categoria').textContent = data.guardian.categoria;
            document.getElementById('result-guardian-precio').textContent = '$' + data.guardian.precio + ' USD';
            document.getElementById('result-btn-conocer').href = data.guardian.url;

            // CTAs personalizados segun perfil
            if (data.conversion && data.conversion.cta) {
                const btnConocer = document.getElementById('result-btn-conocer');
                btnConocer.textContent = data.conversion.cta.principal || 'Quiero conocerlo';

                // Boton secundario
                if (data.conversion.cta.secundario) {
                    const btnSecundario = document.getElementById('result-btn-secundario');
                    if (btnSecundario) {
                        btnSecundario.textContent = data.conversion.cta.secundario;
                        btnSecundario.style.display = 'inline-block';
                    }
                }

                // Badge de urgencia si aplica
                if (data.conversion.cta.urgencia) {
                    const urgenciaBadge = document.getElementById('result-urgencia');
                    if (urgenciaBadge) {
                        urgenciaBadge.textContent = data.conversion.cta.urgencia;
                        urgenciaBadge.style.display = 'block';
                    }
                }
            }

            // Estrategias de conversion (mostramos una sutil)
            const conversionContainer = document.getElementById('result-conversion');
            if (data.conversion && data.conversion.estrategias && data.conversion.estrategias.length > 0) {
                const estrategia = data.conversion.estrategias[0];
                if (conversionContainer) {
                    conversionContainer.innerHTML = '<p class="tg-conversion-texto">' + estrategia.texto + '</p>';
                    conversionContainer.style.display = 'block';
                }
            }

            // Alternativas
            const altGrid = document.getElementById('result-alt-grid');
            altGrid.innerHTML = '';
            if (data.guardian.alternativas && data.guardian.alternativas.length > 0) {
                data.guardian.alternativas.forEach(alt => {
                    altGrid.innerHTML += `
                        <a href="${alt.url}" target="_blank" class="tg-alt-item">
                            <img src="${alt.imagen}" class="tg-alt-img" alt="${alt.nombre}">
                            <div class="tg-alt-nombre">${alt.nombre}</div>
                        </a>
                    `;
                });
                document.getElementById('result-alternativas').style.display = 'block';
            } else {
                document.getElementById('result-alternativas').style.display = 'none';
            }
        }

        // Mensaje del guardian
        if (data.mensajeGuardian) {
            document.getElementById('result-mensaje').textContent = '"' + data.mensajeGuardian + '"';
        }

        this.irA('resultado');
    },

    // Fallback si la API falla
    mostrarResultadoFallback: function() {
        // Resultado basico local
        const guardianes = [
            { nombre: 'Guardian Protector', categoria: 'Proteccion', precio: '45', url: 'https://duendesdeluruguay.com/categoria-producto/proteccion/', imagen: '' },
            { nombre: 'Guardian Sanador', categoria: 'Sanacion', precio: '45', url: 'https://duendesdeluruguay.com/categoria-producto/salud/', imagen: '' },
            { nombre: 'Guardian de la Abundancia', categoria: 'Abundancia', precio: '45', url: 'https://duendesdeluruguay.com/categoria-producto/dinero-abundancia-negocios/', imagen: '' }
        ];

        const guardian = guardianes[Math.floor(Math.random() * guardianes.length)];

        document.getElementById('result-saludo').textContent = this.userData.nombre + ', tu guardian te esta esperando...';
        document.getElementById('result-guardian-nombre').textContent = guardian.nombre;
        document.getElementById('result-guardian-categoria').textContent = guardian.categoria;
        document.getElementById('result-guardian-precio').textContent = '$' + guardian.precio + ' USD';
        document.getElementById('result-btn-conocer').href = guardian.url;
        document.getElementById('result-mensaje').textContent = '"Tu busqueda te trajo hasta aca. No es casualidad."';

        document.getElementById('result-alternativas').style.display = 'none';
        document.getElementById('result-sincronicidades').innerHTML = '';

        this.irA('resultado');
    },

    // Enviar resultado por email
    enviarResultado: async function() {
        alert('Enviamos tu resultado a ' + this.userData.email + '. Revisa tu casilla en unos minutos.');
        // TODO: Implementar envio real
    }
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => TG.init());
</script>
</body>
</html>
<?php
}

// Shortcode por si se usa en otro lado
function duendes_test_guardian_v15_shortcode() {
    ob_start();
    duendes_test_guardian_v15_standalone();
    return ob_get_clean();
}
add_shortcode('test_guardian', 'duendes_test_guardian_v15_shortcode');
add_shortcode('test-guardian', 'duendes_test_guardian_v15_shortcode');
