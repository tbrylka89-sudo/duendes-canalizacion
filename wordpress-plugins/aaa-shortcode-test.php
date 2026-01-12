<?php
/**
 * Plugin Name: Duendes Test del Guardian PRO
 * Description: Test emocional con captura de leads y perfil psicologico
 * Version: 3.0
 */

if (!defined('ABSPATH')) exit;

add_shortcode('test_del_guardian', 'duendes_test_guardian_pro');

function duendes_test_guardian_pro() {
    $html = <<<'HTML'
<div id="test-guardian-container">
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

#test-guardian-container {
    min-height: 100vh;
    background: linear-gradient(180deg, #0a0a0a 0%, #0d1117 100%);
    padding: 60px 20px;
    font-family: 'Cormorant Garamond', Georgia, serif;
    position: relative;
    overflow: hidden;
}

#test-guardian-container * {
    box-sizing: border-box;
}

.tg-orbs {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
}

.tg-orb {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(198, 169, 98, 0.12) 0%, transparent 70%);
    filter: blur(50px);
    animation: tgOrbFloat 12s ease-in-out infinite;
}

.tg-orb-1 { width: 350px; height: 350px; top: 5%; left: 5%; }
.tg-orb-2 { width: 250px; height: 250px; bottom: 10%; right: 10%; animation-delay: 4s; }
.tg-orb-3 { width: 180px; height: 180px; top: 40%; right: 20%; animation-delay: 7s; }

@keyframes tgOrbFloat {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
    50% { transform: translate(30px, -30px) scale(1.2); opacity: 0.6; }
}

.tg-screen {
    display: none;
    max-width: 650px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 1;
}

.tg-screen.active {
    display: block;
    animation: tgFadeIn 0.6s ease;
}

@keyframes tgFadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

.tg-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(26px, 5vw, 38px);
    color: #C6A962;
    margin: 0 0 15px 0;
    line-height: 1.2;
}

.tg-subtitle {
    font-size: 19px;
    color: rgba(255,255,255,0.6);
    line-height: 1.6;
    margin-bottom: 35px;
}

/* Botones principales */
.tg-btn-primary {
    background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
    color: #0a0a0a;
    border: none;
    padding: 18px 45px;
    font-family: 'Cinzel', serif;
    font-size: 14px;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.4s ease;
    box-shadow: 0 8px 30px rgba(198, 169, 98, 0.25);
    text-transform: uppercase;
    letter-spacing: 2px;
    text-decoration: none;
    display: inline-block;
}

.tg-btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 45px rgba(198, 169, 98, 0.35);
    color: #0a0a0a;
}

/* Botones secundarios */
.tg-btn-secondary {
    background: transparent;
    border: 1px solid rgba(198, 169, 98, 0.3);
    color: rgba(198, 169, 98, 0.8);
    padding: 14px 30px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    font-family: 'Cormorant Garamond', serif;
}

.tg-btn-secondary:hover {
    border-color: #C6A962;
    color: #C6A962;
    background: rgba(198, 169, 98, 0.05);
}

.tg-hint {
    color: rgba(255,255,255,0.35);
    font-size: 14px;
    margin-top: 25px;
    font-style: italic;
}

/* ══════════════════════════════════════════════
   FORMULARIO DE REGISTRO
══════════════════════════════════════════════ */
.tg-form {
    text-align: left;
    margin-top: 30px;
}

.tg-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
}

.tg-form-row.full {
    grid-template-columns: 1fr;
}

.tg-form-group {
    display: flex;
    flex-direction: column;
}

.tg-form-group label {
    color: rgba(255,255,255,0.5);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
    font-family: 'Cinzel', serif;
}

.tg-form-group input,
.tg-form-group select {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(198, 169, 98, 0.2);
    border-radius: 10px;
    padding: 14px 16px;
    color: #fff;
    font-size: 16px;
    font-family: 'Cormorant Garamond', serif;
    transition: all 0.3s ease;
}

.tg-form-group input:focus,
.tg-form-group select:focus {
    outline: none;
    border-color: #C6A962;
    background: rgba(198, 169, 98, 0.05);
}

.tg-form-group input::placeholder {
    color: rgba(255,255,255,0.3);
}

.tg-form-group select {
    cursor: pointer;
}

.tg-form-group select option {
    background: #1a1a1a;
    color: #fff;
}

.tg-form-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(198, 169, 98, 0.2), transparent);
    margin: 25px 0;
}

.tg-form-note {
    color: rgba(255,255,255,0.4);
    font-size: 13px;
    text-align: center;
    margin-top: 20px;
}

/* ══════════════════════════════════════════════
   PREGUNTAS
══════════════════════════════════════════════ */
.tg-progress {
    margin-bottom: 45px;
}

.tg-progress-bar {
    height: 3px;
    background: rgba(255,255,255,0.08);
    border-radius: 2px;
    overflow: hidden;
}

.tg-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #C6A962, #d4af37);
    transition: width 0.5s ease;
    width: 0%;
}

.tg-progress-text {
    color: rgba(255,255,255,0.3);
    font-size: 12px;
    margin-top: 12px;
    font-family: 'Cinzel', serif;
    letter-spacing: 3px;
    text-transform: uppercase;
}

.tg-question {
    font-size: clamp(20px, 3vw, 25px);
    color: #fff;
    line-height: 1.6;
    margin-bottom: 35px;
    min-height: 70px;
}

.tg-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Opciones en dorado/oscuro - SIN VERDE */
.tg-option {
    background: rgba(198, 169, 98, 0.03);
    border: 1px solid rgba(198, 169, 98, 0.15);
    border-radius: 14px;
    padding: 20px 24px;
    color: rgba(255,255,255,0.8);
    font-size: 17px;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s ease;
    line-height: 1.5;
    font-family: 'Cormorant Garamond', serif;
}

.tg-option:hover {
    border-color: #C6A962;
    background: rgba(198, 169, 98, 0.1);
    transform: translateX(6px);
    color: #fff;
    box-shadow: 0 5px 20px rgba(198, 169, 98, 0.1);
}

/* ══════════════════════════════════════════════
   PROCESANDO
══════════════════════════════════════════════ */
.tg-spinner {
    width: 60px;
    height: 60px;
    border: 2px solid rgba(198, 169, 98, 0.15);
    border-top-color: #C6A962;
    border-radius: 50%;
    animation: tgSpin 1s linear infinite;
    margin: 0 auto 35px;
}

@keyframes tgSpin {
    to { transform: rotate(360deg); }
}

.tg-processing-text {
    color: rgba(255,255,255,0.5);
    font-size: 18px;
    font-style: italic;
}

/* ══════════════════════════════════════════════
   RESULTADO
══════════════════════════════════════════════ */
.tg-result-card {
    background: rgba(12, 12, 12, 0.95);
    border: 1px solid rgba(198, 169, 98, 0.25);
    border-radius: 24px;
    padding: 45px 35px;
    box-shadow: 0 25px 70px rgba(0,0,0,0.6);
}

.tg-result-badge {
    background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
    color: #0a0a0a;
    font-family: 'Cinzel', serif;
    font-size: 10px;
    padding: 10px 22px;
    border-radius: 50px;
    display: inline-block;
    margin-bottom: 25px;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 600;
}

.tg-result-img {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a1a1a 0%, #252525 100%);
    margin: 0 auto 20px;
    background-size: cover;
    background-position: center;
    border: 2px solid #C6A962;
    box-shadow: 0 10px 40px rgba(198, 169, 98, 0.15);
}

.tg-result-name {
    font-family: 'Cinzel', serif;
    font-size: clamp(26px, 4vw, 34px);
    color: #C6A962;
    margin: 0 0 8px 0;
}

.tg-result-tipo {
    color: rgba(255,255,255,0.45);
    font-size: 14px;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.tg-result-mensaje {
    color: rgba(255,255,255,0.75);
    font-size: 17px;
    line-height: 1.8;
    margin-bottom: 25px;
}

.tg-traits {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 30px;
}

.tg-trait {
    background: rgba(198, 169, 98, 0.08);
    border: 1px solid rgba(198, 169, 98, 0.2);
    padding: 8px 18px;
    border-radius: 20px;
    color: #C6A962;
    font-size: 13px;
    text-transform: capitalize;
}

@media (max-width: 600px) {
    #test-guardian-container { padding: 40px 15px; }
    .tg-result-card { padding: 30px 20px; }
    .tg-option { padding: 16px 18px; font-size: 16px; }
    .tg-form-row { grid-template-columns: 1fr; }
}
</style>

<div class="tg-orbs">
    <div class="tg-orb tg-orb-1"></div>
    <div class="tg-orb tg-orb-2"></div>
    <div class="tg-orb tg-orb-3"></div>
</div>

<!-- ══════════════════════════════════════════════
     INTRO + FORMULARIO
══════════════════════════════════════════════ -->
<div class="tg-screen active" id="tg-intro">
    <h1 class="tg-title">El Universo Te Trajo Hasta Aqui</h1>
    <p class="tg-subtitle">Antes de descubrir que guardian te elige, necesitamos conocerte.<br>Cada dato es sagrado y nos ayuda a conectarte con tu guardian perfecto.</p>

    <form class="tg-form" id="tg-form-registro" onsubmit="return tgValidarForm()">
        <div class="tg-form-row">
            <div class="tg-form-group">
                <label>Nombre</label>
                <input type="text" id="tg-nombre" placeholder="Tu nombre" required>
            </div>
            <div class="tg-form-group">
                <label>Apellido</label>
                <input type="text" id="tg-apellido" placeholder="Tu apellido" required>
            </div>
        </div>

        <div class="tg-form-row full">
            <div class="tg-form-group">
                <label>Email</label>
                <input type="email" id="tg-email" placeholder="tu@email.com" required>
            </div>
        </div>

        <div class="tg-form-row">
            <div class="tg-form-group">
                <label>Celular / WhatsApp</label>
                <input type="tel" id="tg-celular" placeholder="+598 99 123 456" required>
            </div>
            <div class="tg-form-group">
                <label>Pais</label>
                <select id="tg-pais" required>
                    <option value="">Selecciona...</option>
                    <option value="UY">Uruguay</option>
                    <option value="AR">Argentina</option>
                    <option value="BR">Brasil</option>
                    <option value="CL">Chile</option>
                    <option value="CO">Colombia</option>
                    <option value="MX">Mexico</option>
                    <option value="ES">Espana</option>
                    <option value="US">Estados Unidos</option>
                    <option value="OTRO">Otro</option>
                </select>
            </div>
        </div>

        <div class="tg-form-divider"></div>

        <div class="tg-form-row">
            <div class="tg-form-group">
                <label>Lugar de Nacimiento</label>
                <input type="text" id="tg-nacimiento" placeholder="Ciudad, Pais" required>
            </div>
            <div class="tg-form-group">
                <label>Donde Vivis Actualmente</label>
                <input type="text" id="tg-ubicacion" placeholder="Ciudad, Pais" required>
            </div>
        </div>

        <div class="tg-form-row">
            <div class="tg-form-group">
                <label>Edad</label>
                <select id="tg-edad" required>
                    <option value="">Selecciona...</option>
                    <option value="18-25">18 - 25 anos</option>
                    <option value="26-35">26 - 35 anos</option>
                    <option value="36-45">36 - 45 anos</option>
                    <option value="46-55">46 - 55 anos</option>
                    <option value="56+">56+ anos</option>
                </select>
            </div>
            <div class="tg-form-group">
                <label>Genero</label>
                <select id="tg-genero" required>
                    <option value="">Selecciona...</option>
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                    <option value="NB">No binario</option>
                    <option value="NS">Prefiero no decir</option>
                </select>
            </div>
        </div>

        <p class="tg-form-note">Tus datos estan protegidos. Solo los usamos para tu experiencia mistica.</p>

        <div style="text-align:center;margin-top:30px;">
            <button type="submit" class="tg-btn-primary">Comenzar Mi Revelacion</button>
        </div>
    </form>
</div>

<!-- ══════════════════════════════════════════════
     PREGUNTAS PROFUNDAS
══════════════════════════════════════════════ -->
<div class="tg-screen" id="tg-questions">
    <div class="tg-progress">
        <div class="tg-progress-bar"><div class="tg-progress-fill" id="tg-progress-fill"></div></div>
        <p class="tg-progress-text" id="tg-progress-text">1 de 10</p>
    </div>
    <p class="tg-question" id="tg-question-text"></p>
    <div class="tg-options" id="tg-options"></div>
</div>

<!-- ══════════════════════════════════════════════
     PROCESANDO
══════════════════════════════════════════════ -->
<div class="tg-screen" id="tg-processing">
    <div class="tg-spinner"></div>
    <p class="tg-processing-text">Los guardianes estan leyendo tu energia...</p>
    <p style="color:rgba(255,255,255,0.3);font-size:14px;margin-top:15px;">Esto puede tomar unos segundos</p>
</div>

<!-- ══════════════════════════════════════════════
     RESULTADO
══════════════════════════════════════════════ -->
<div class="tg-screen" id="tg-result">
    <div class="tg-result-card">
        <div class="tg-result-badge">Tu Guardian Elegido</div>
        <div class="tg-result-img" id="tg-result-img"></div>
        <h2 class="tg-result-name" id="tg-result-name"></h2>
        <p class="tg-result-tipo" id="tg-result-tipo"></p>
        <p class="tg-result-mensaje" id="tg-result-mensaje"></p>
        <div class="tg-traits" id="tg-traits"></div>
        <a href="#" class="tg-btn-primary" id="tg-result-link">Conocer a <span id="tg-result-name2"></span></a>
        <div style="margin-top:20px;">
            <button class="tg-btn-secondary" onclick="tgRestart()">Hacer el test de nuevo</button>
        </div>
    </div>
</div>

<script>
(function() {
    // Datos del usuario
    var userData = {};

    // Preguntas PROFUNDAS - revelan perfil psicologico y poder adquisitivo
    var PREGUNTAS = [
        {
            texto: "Cuando algo te duele profundamente, que haces primero?",
            opciones: [
                { texto: "Me encierro hasta procesarlo sola/o", valor: "introvertido", perfil: "reflexivo" },
                { texto: "Busco a alguien de confianza para hablar", valor: "amor", perfil: "social" },
                { texto: "Me distraigo con trabajo o actividades", valor: "abundancia", perfil: "activo" },
                { texto: "Intento encontrarle un sentido espiritual", valor: "sabiduria", perfil: "espiritual" }
            ]
        },
        {
            texto: "Si manana te depositaran $10.000 dolares inesperados, que harias?",
            opciones: [
                { texto: "Los ahorraria o invertiria para el futuro", valor: "seguridad", poder: "alto" },
                { texto: "Me daria un gusto que tengo pendiente hace tiempo", valor: "abundancia", poder: "medio-alto" },
                { texto: "Ayudaria a mi familia o seres queridos", valor: "amor", poder: "medio" },
                { texto: "Los usaria para algo que me transforme (viaje, curso, experiencia)", valor: "sabiduria", poder: "experiencial" }
            ]
        },
        {
            texto: "En tu casa, que espacio sientes que necesita mas proteccion o energia?",
            opciones: [
                { texto: "Mi habitacion, donde descanso y soy vulnerable", valor: "proteccion", hogar: "personal" },
                { texto: "La entrada, para filtrar lo que entra", valor: "proteccion", hogar: "protector" },
                { texto: "El living o espacio comun, donde se comparte", valor: "amor", hogar: "social" },
                { texto: "Mi espacio de trabajo o creatividad", valor: "abundancia", hogar: "productivo" }
            ]
        },
        {
            texto: "Que frase te describe mejor en este momento de tu vida?",
            opciones: [
                { texto: "Estoy en busqueda de algo que todavia no puedo nombrar", valor: "sabiduria", estado: "busqueda" },
                { texto: "Necesito sentirme mas segura/o y estable", valor: "proteccion", estado: "inestable" },
                { texto: "Quiero manifestar abundancia y nuevas oportunidades", valor: "abundancia", estado: "expansion" },
                { texto: "Busco sanar algo del pasado que todavia me pesa", valor: "sanacion", estado: "sanacion" }
            ]
        },
        {
            texto: "Cuando compras algo especial para vos, que te importa mas?",
            opciones: [
                { texto: "Que sea unico, que nadie mas lo tenga", valor: "exclusividad", compra: "exclusivo" },
                { texto: "Que tenga historia, significado o energia", valor: "sabiduria", compra: "significado" },
                { texto: "Que me haga sentir bien, sin importar el precio", valor: "emocional", compra: "emocional" },
                { texto: "Que sea una buena inversion o tenga calidad duradera", valor: "seguridad", compra: "racional" }
            ]
        },
        {
            texto: "Si un guardian pudiera susurrarte algo al oido cada manana, que elegirias escuchar?",
            opciones: [
                { texto: "Hoy estas protegida/o. Nada malo puede tocarte.", valor: "proteccion", necesidad: "seguridad" },
                { texto: "Todo lo que necesitas viene en camino.", valor: "abundancia", necesidad: "provision" },
                { texto: "Sos digna/o de amor. Tal cual sos.", valor: "amor", necesidad: "validacion" },
                { texto: "Confía. El camino se revela paso a paso.", valor: "sabiduria", necesidad: "guia" }
            ]
        },
        {
            texto: "Que patron notas que se repite en tu vida y quisieras romper?",
            opciones: [
                { texto: "Atraigo relaciones que me hacen dano", valor: "amor", patron: "relaciones" },
                { texto: "El dinero se va tan rapido como llega", valor: "abundancia", patron: "dinero" },
                { texto: "Siento que me cuesta proteger mi energia", valor: "proteccion", patron: "energia" },
                { texto: "Tomo decisiones que despues me arrepiento", valor: "sabiduria", patron: "decisiones" }
            ]
        },
        {
            texto: "Cuando entras a una tienda de cosas misticas o espirituales, que te atrae primero?",
            opciones: [
                { texto: "Las piezas artesanales unicas, hechas a mano", valor: "exclusividad", interes: "artesanal" },
                { texto: "Los cristales y piedras energeticas", valor: "energia", interes: "cristales" },
                { texto: "Los simbolos de proteccion y amuletos", valor: "proteccion", interes: "proteccion" },
                { texto: "Todo lo que promete transformacion o cambio", valor: "sabiduria", interes: "transformacion" }
            ]
        },
        {
            texto: "Si tuvieras que describir tu relacion con el dinero en una palabra, seria:",
            opciones: [
                { texto: "Complicada - a veces fluye, a veces no", valor: "abundancia", dinero: "inestable" },
                { texto: "Estable - tengo lo necesario", valor: "seguridad", dinero: "estable" },
                { texto: "Abundante - me permito disfrutar", valor: "abundancia", dinero: "abundante" },
                { texto: "En construccion - estoy trabajando en mejorarla", valor: "sabiduria", dinero: "crecimiento" }
            ]
        },
        {
            texto: "Ultima pregunta, la mas importante: que esperas sentir cuando tu guardian llegue a tu vida?",
            opciones: [
                { texto: "Que alguien vela por mi, incluso cuando duermo", valor: "proteccion", expectativa: "compania" },
                { texto: "Que mi vida va a cambiar para mejor", valor: "abundancia", expectativa: "cambio" },
                { texto: "Una conexion profunda, como encontrar un amigo del alma", valor: "amor", expectativa: "conexion" },
                { texto: "Respuestas y senales en momentos de confusion", valor: "sabiduria", expectativa: "guia" }
            ]
        }
    ];

    var preguntaActual = 0;
    var respuestas = [];
    var perfilData = {};

    function showScreen(id) {
        var screens = document.querySelectorAll(".tg-screen");
        for (var i = 0; i < screens.length; i++) {
            screens[i].classList.remove("active");
        }
        document.getElementById(id).classList.add("active");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Validar y guardar formulario
    window.tgValidarForm = function() {
        userData = {
            nombre: document.getElementById('tg-nombre').value.trim(),
            apellido: document.getElementById('tg-apellido').value.trim(),
            email: document.getElementById('tg-email').value.trim(),
            celular: document.getElementById('tg-celular').value.trim(),
            pais: document.getElementById('tg-pais').value,
            nacimiento: document.getElementById('tg-nacimiento').value.trim(),
            ubicacion: document.getElementById('tg-ubicacion').value.trim(),
            edad: document.getElementById('tg-edad').value,
            genero: document.getElementById('tg-genero').value,
            timestamp: new Date().toISOString()
        };

        // Validacion basica
        if (!userData.nombre || !userData.email || !userData.pais) {
            alert('Por favor completa todos los campos requeridos');
            return false;
        }

        // Iniciar test
        showScreen("tg-questions");
        mostrarPregunta(0);
        return false;
    };

    window.tgRestart = function() {
        preguntaActual = 0;
        respuestas = [];
        perfilData = {};
        showScreen("tg-intro");
    };

    function mostrarPregunta(idx) {
        var p = PREGUNTAS[idx];
        var progress = ((idx + 1) / PREGUNTAS.length) * 100;
        document.getElementById("tg-progress-fill").style.width = progress + "%";
        document.getElementById("tg-progress-text").textContent = (idx + 1) + " de " + PREGUNTAS.length;
        document.getElementById("tg-question-text").textContent = p.texto;

        var optionsHtml = "";
        for (var i = 0; i < p.opciones.length; i++) {
            var o = p.opciones[i];
            var dataAttrs = 'data-valor="' + o.valor + '"';
            if (o.perfil) dataAttrs += ' data-perfil="' + o.perfil + '"';
            if (o.poder) dataAttrs += ' data-poder="' + o.poder + '"';
            if (o.compra) dataAttrs += ' data-compra="' + o.compra + '"';
            if (o.dinero) dataAttrs += ' data-dinero="' + o.dinero + '"';

            optionsHtml += '<button class="tg-option" onclick="tgResponder(this)" ' + dataAttrs + '>' + o.texto + '</button>';
        }
        document.getElementById("tg-options").innerHTML = optionsHtml;
    }

    window.tgResponder = function(btn) {
        var valor = btn.getAttribute('data-valor');
        var perfil = btn.getAttribute('data-perfil');
        var poder = btn.getAttribute('data-poder');
        var compra = btn.getAttribute('data-compra');
        var dinero = btn.getAttribute('data-dinero');

        respuestas.push(valor);

        // Guardar datos de perfil
        if (perfil) perfilData.perfil = perfil;
        if (poder) perfilData.poder = poder;
        if (compra) perfilData.compra = compra;
        if (dinero) perfilData.dinero = dinero;

        preguntaActual++;
        if (preguntaActual < PREGUNTAS.length) {
            mostrarPregunta(preguntaActual);
        } else {
            procesarResultado();
        }
    };

    function procesarResultado() {
        showScreen("tg-processing");

        // Calcular perfil dominante
        var conteo = {};
        for (var i = 0; i < respuestas.length; i++) {
            var r = respuestas[i];
            conteo[r] = (conteo[r] || 0) + 1;
        }

        var perfil = null;
        var maxCount = 0;
        for (var key in conteo) {
            if (conteo[key] > maxCount) {
                maxCount = conteo[key];
                perfil = key;
            }
        }

        // Combinar datos
        var fullData = {
            usuario: userData,
            respuestas: respuestas,
            conteo: conteo,
            perfilDominante: perfil,
            perfilPsicologico: perfilData,
            timestamp: new Date().toISOString()
        };

        // Enviar a la API
        fetch("/wp-json/duendes/v1/test-guardian", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fullData)
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            mostrarResultado(data);
        })
        .catch(function() {
            // Fallback
            var mensajes = {
                proteccion: "Tu energia pide proteccion. Un guardian velara por tu espacio y paz.",
                abundancia: "Vibras con la abundancia. Un guardian de prosperidad te espera.",
                amor: "Tu corazon busca conexion profunda.",
                sabiduria: "Tu alma busca respuestas y guia.",
                sanacion: "Necesitas sanar heridas del pasado.",
                seguridad: "Buscas estabilidad y certeza.",
                exclusividad: "Valoras lo unico e irrepetible."
            };

            mostrarResultado({
                nombre: "Tu Guardian Perfecto",
                tipo: "Guardian de " + (perfil ? perfil.charAt(0).toUpperCase() + perfil.slice(1) : "Luz"),
                imagen: "",
                mensaje: mensajes[perfil] || "Un guardian especial te esta esperando.",
                traits: Object.keys(conteo).slice(0, 4),
                url: "/shop/"
            });
        });
    }

    function mostrarResultado(data) {
        setTimeout(function() {
            showScreen("tg-result");
            document.getElementById("tg-result-name").textContent = data.nombre;
            document.getElementById("tg-result-name2").textContent = data.nombre;
            document.getElementById("tg-result-tipo").textContent = data.tipo;
            document.getElementById("tg-result-mensaje").textContent = data.mensaje;
            document.getElementById("tg-result-link").href = data.url || "/shop/";

            if (data.imagen) {
                document.getElementById("tg-result-img").style.backgroundImage = "url(" + data.imagen + ")";
            }

            var traitsHtml = "";
            var traits = data.traits || [];
            for (var i = 0; i < traits.length; i++) {
                traitsHtml += '<span class="tg-trait">' + traits[i] + '</span>';
            }
            document.getElementById("tg-traits").innerHTML = traitsHtml;
        }, 2500);
    }
})();
</script>
</div>
HTML;
    return $html;
}

// API REST para guardar datos del test
add_action('rest_api_init', function() {
    register_rest_route('duendes/v1', '/test-guardian', array(
        'methods' => 'POST',
        'callback' => 'duendes_guardar_test',
        'permission_callback' => '__return_true'
    ));
});

function duendes_guardar_test($request) {
    $data = $request->get_json_params();

    // Guardar en la base de datos como lead
    $lead_data = array(
        'post_title' => $data['usuario']['nombre'] . ' ' . $data['usuario']['apellido'],
        'post_type' => 'duende_lead',
        'post_status' => 'publish'
    );

    $lead_id = wp_insert_post($lead_data);

    if ($lead_id) {
        // Guardar todos los meta datos
        update_post_meta($lead_id, '_email', sanitize_email($data['usuario']['email']));
        update_post_meta($lead_id, '_celular', sanitize_text_field($data['usuario']['celular']));
        update_post_meta($lead_id, '_pais', sanitize_text_field($data['usuario']['pais']));
        update_post_meta($lead_id, '_nacimiento', sanitize_text_field($data['usuario']['nacimiento']));
        update_post_meta($lead_id, '_ubicacion', sanitize_text_field($data['usuario']['ubicacion']));
        update_post_meta($lead_id, '_edad', sanitize_text_field($data['usuario']['edad']));
        update_post_meta($lead_id, '_genero', sanitize_text_field($data['usuario']['genero']));
        update_post_meta($lead_id, '_perfil_dominante', sanitize_text_field($data['perfilDominante']));
        update_post_meta($lead_id, '_perfil_psicologico', $data['perfilPsicologico']);
        update_post_meta($lead_id, '_respuestas', $data['respuestas']);
        update_post_meta($lead_id, '_conteo', $data['conteo']);
    }

    // Buscar guardian recomendado
    $perfil = sanitize_text_field($data['perfilDominante']);

    $args = array(
        'post_type' => 'product',
        'posts_per_page' => 1,
        'orderby' => 'rand',
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => '_thumbnail_id',
                'compare' => 'EXISTS'
            )
        )
    );

    $products = new WP_Query($args);

    $mensajes = array(
        'proteccion' => " escucho tu necesidad de seguridad. Es un guardian que creara un escudo invisible alrededor tuyo y de todo lo que amas.",
        'abundancia' => " resono con tu energia de manifestacion. Es un guardian que abrira caminos y atraera oportunidades inesperadas.",
        'amor' => " sintio el latido de tu corazon. Es un guardian que te recordara cada dia lo valiosa/o que sos.",
        'sabiduria' => " fue atraido por tu busqueda de respuestas. Es un guardian antiguo que susurra verdades.",
        'sanacion' => " percibio tus heridas. Es un guardian sanador que te ayudara a soltar lo que ya no te sirve.",
        'seguridad' => " entendio tu necesidad de estabilidad. Es un guardian que te dara raices firmes.",
        'exclusividad' => " reconocio tu alma unica. Es un guardian tan especial e irrepetible como vos."
    );

    if ($products->have_posts()) {
        $products->the_post();
        $id = get_the_ID();
        $nombre = get_the_title();
        $imagen = get_the_post_thumbnail_url($id, 'medium');
        $link = get_permalink();
        $cats = wp_get_post_terms($id, 'product_cat', array('fields' => 'names'));
        $tipo = !empty($cats) ? 'Guardian de ' . $cats[0] : 'Guardian Mistico';

        wp_reset_postdata();

        return array(
            'nombre' => $nombre,
            'tipo' => $tipo,
            'imagen' => $imagen,
            'mensaje' => $nombre . ($mensajes[$perfil] ?? " es un guardian especial que resono con tu energia."),
            'traits' => array_keys($data['conteo']),
            'url' => $link,
            'lead_id' => $lead_id
        );
    }

    wp_reset_postdata();

    return array(
        'nombre' => 'Tu Guardian Ideal',
        'tipo' => 'Guardian de ' . ucfirst($perfil),
        'imagen' => '',
        'mensaje' => 'Un guardian con energia de ' . $perfil . ' te esta esperando.',
        'traits' => array_keys($data['conteo']),
        'url' => '/shop/',
        'lead_id' => $lead_id
    );
}

// Registrar custom post type para leads
add_action('init', function() {
    register_post_type('duende_lead', array(
        'labels' => array(
            'name' => 'Leads del Test',
            'singular_name' => 'Lead'
        ),
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => 'duendes-admin',
        'supports' => array('title'),
        'capability_type' => 'post'
    ));
});
