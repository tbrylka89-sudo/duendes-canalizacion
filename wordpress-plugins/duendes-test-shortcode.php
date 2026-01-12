<?php
/**
 * Plugin Name: Duendes Test del Guardian Shortcode
 * Description: Shortcode simple para el test del guardian
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Registrar shortcode inmediatamente
add_shortcode('test_del_guardian', 'duendes_simple_test');

function duendes_simple_test($atts) {
    return '
<div id="test-guardian-container" style="
    min-height: 80vh;
    background: linear-gradient(180deg, #0a0a0a 0%, #0d1117 100%);
    padding: 60px 20px;
    font-family: Georgia, serif;
">
    <style>
    @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap");

    #test-guardian-container * {
        box-sizing: border-box;
    }

    .tg-screen {
        display: none;
        max-width: 700px;
        margin: 0 auto;
        text-align: center;
    }
    .tg-screen.active { display: block; }

    .tg-title {
        font-family: "Cinzel", serif;
        font-size: clamp(28px, 5vw, 42px);
        color: #C6A962;
        margin: 0 0 20px 0;
    }

    .tg-subtitle {
        font-size: 20px;
        color: rgba(255,255,255,0.7);
        line-height: 1.6;
        margin-bottom: 40px;
    }

    .tg-btn {
        background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
        color: #0a0a0a;
        border: none;
        padding: 18px 40px;
        font-family: "Cinzel", serif;
        font-size: 16px;
        font-weight: 600;
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 10px 40px rgba(198, 169, 98, 0.3);
    }
    .tg-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 50px rgba(198, 169, 98, 0.4);
    }

    .tg-hint {
        color: rgba(255,255,255,0.5);
        font-size: 14px;
        margin-top: 30px;
    }

    .tg-progress {
        margin-bottom: 40px;
    }
    .tg-progress-bar {
        height: 4px;
        background: #1a1a1a;
        border-radius: 2px;
        overflow: hidden;
    }
    .tg-progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #C6A962, #d4af37);
        transition: width 0.4s ease;
    }
    .tg-progress-text {
        color: #666;
        font-size: 13px;
        margin-top: 10px;
    }

    .tg-question {
        font-family: "Cormorant Garamond", serif;
        font-size: 24px;
        color: #fff;
        line-height: 1.5;
        margin-bottom: 40px;
    }

    .tg-options {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .tg-option {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(198, 169, 98, 0.2);
        border-radius: 12px;
        padding: 20px 25px;
        color: #fff;
        font-family: "Cormorant Garamond", serif;
        font-size: 18px;
        text-align: left;
        cursor: pointer;
        transition: all 0.3s;
    }
    .tg-option:hover {
        border-color: #C6A962;
        background: rgba(198, 169, 98, 0.1);
        transform: translateX(5px);
    }

    .tg-spinner {
        width: 60px;
        height: 60px;
        border: 3px solid rgba(198, 169, 98, 0.2);
        border-top-color: #C6A962;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 30px;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .tg-result-card {
        background: rgba(20, 20, 20, 0.8);
        border: 1px solid rgba(198, 169, 98, 0.3);
        border-radius: 24px;
        padding: 50px 40px;
    }
    .tg-result-badge {
        background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
        color: #0a0a0a;
        font-family: "Cinzel", serif;
        font-size: 12px;
        padding: 8px 20px;
        border-radius: 50px;
        display: inline-block;
        margin-bottom: 30px;
    }
    .tg-result-img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: #1a1a1a;
        margin: 0 auto 20px;
        background-size: cover;
        background-position: center;
        border: 3px solid #C6A962;
    }
    .tg-result-name {
        font-family: "Cinzel", serif;
        font-size: 32px;
        color: #C6A962;
        margin: 0 0 10px 0;
    }
    .tg-result-tipo {
        color: rgba(255,255,255,0.6);
        font-size: 16px;
        margin-bottom: 20px;
    }
    .tg-result-mensaje {
        color: rgba(255,255,255,0.8);
        font-size: 18px;
        line-height: 1.7;
        margin-bottom: 30px;
    }
    .tg-traits {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 30px;
    }
    .tg-trait {
        background: rgba(198, 169, 98, 0.1);
        border: 1px solid rgba(198, 169, 98, 0.3);
        padding: 8px 16px;
        border-radius: 20px;
        color: #C6A962;
        font-size: 14px;
    }
    .tg-btn-retry {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.2);
        color: rgba(255,255,255,0.5);
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 20px;
        font-size: 14px;
    }
    .tg-btn-retry:hover {
        border-color: rgba(255,255,255,0.4);
        color: rgba(255,255,255,0.8);
    }
    </style>

    <!-- Intro -->
    <div class="tg-screen active" id="tg-intro">
        <h1 class="tg-title">Descubri que Guardian te Elige</h1>
        <p class="tg-subtitle">Un viaje de 7 preguntas hacia tu companero mistico.<br>Responde con el corazon, no con la mente.</p>
        <button class="tg-btn" onclick="tgStart()">Comenzar el Viaje</button>
        <p class="tg-hint">Solo toma 2 minutos. Tu guardian ya te esta esperando.</p>
    </div>

    <!-- Questions -->
    <div class="tg-screen" id="tg-questions">
        <div class="tg-progress">
            <div class="tg-progress-bar"><div class="tg-progress-bar-fill" id="tg-progress-fill"></div></div>
            <p class="tg-progress-text" id="tg-progress-text">1 de 7</p>
        </div>
        <p class="tg-question" id="tg-question-text"></p>
        <div class="tg-options" id="tg-options"></div>
    </div>

    <!-- Processing -->
    <div class="tg-screen" id="tg-processing">
        <div class="tg-spinner"></div>
        <p style="color: rgba(255,255,255,0.7); font-size: 20px;">Los guardianes estan consultando el oraculo...</p>
    </div>

    <!-- Result -->
    <div class="tg-screen" id="tg-result">
        <div class="tg-result-card">
            <div class="tg-result-badge">Tu Guardian Ideal</div>
            <div class="tg-result-img" id="tg-result-img"></div>
            <h2 class="tg-result-name" id="tg-result-name"></h2>
            <p class="tg-result-tipo" id="tg-result-tipo"></p>
            <p class="tg-result-mensaje" id="tg-result-mensaje"></p>
            <div class="tg-traits" id="tg-traits"></div>
            <a href="#" class="tg-btn" id="tg-result-link">Conocer a <span id="tg-result-name2"></span></a>
            <button class="tg-btn-retry" onclick="tgRestart()">Hacer el test de nuevo</button>
        </div>
    </div>

    <script>
    (function() {
        const PREGUNTAS = [
            {
                texto: "Cerra los ojos un segundo. Que sentis que mas te falta en este momento de tu vida?",
                opciones: [
                    { texto: "Proteccion. Sentirme segura/o en mi propio espacio", valor: "proteccion" },
                    { texto: "Abundancia. Que las cosas fluyan, que llegue lo que necesito", valor: "abundancia" },
                    { texto: "Amor. Conexion profunda, conmigo o con otros", valor: "amor" },
                    { texto: "Claridad. Entender hacia donde voy, que decisiones tomar", valor: "sabiduria" }
                ]
            },
            {
                texto: "Si pudieras tener un companero invisible que siempre este ahi, que te gustaria que hiciera?",
                opciones: [
                    { texto: "Que cuide mi hogar y mi energia mientras duermo", valor: "proteccion" },
                    { texto: "Que atraiga oportunidades y prosperidad", valor: "abundancia" },
                    { texto: "Que me recuerde lo valioso/a que soy", valor: "amor" },
                    { texto: "Que me susurre respuestas cuando estoy perdida/o", valor: "sabiduria" }
                ]
            },
            {
                texto: "Que elemento te llama mas en este momento?",
                opciones: [
                    { texto: "Tierra - La estabilidad, las raices, lo firme", valor: "tierra" },
                    { texto: "Agua - Las emociones, la intuicion, lo profundo", valor: "agua" },
                    { texto: "Fuego - La pasion, la transformacion, la fuerza", valor: "fuego" },
                    { texto: "Aire - Las ideas, la libertad, la comunicacion", valor: "aire" }
                ]
            },
            {
                texto: "Si un guardian te hablara, como te gustaria que fuera su voz?",
                opciones: [
                    { texto: "Firme y protectora, como un abrazo seguro", valor: "proteccion" },
                    { texto: "Alegre y traviesa, llena de picardia", valor: "abundancia" },
                    { texto: "Suave y calida, que toque el corazon", valor: "amor" },
                    { texto: "Serena y profunda, llena de sabiduria", valor: "sabiduria" }
                ]
            },
            {
                texto: "Que momento del dia te hace sentir mas conectada/o con algo mas grande?",
                opciones: [
                    { texto: "El amanecer, cuando todo empieza de nuevo", valor: "abundancia" },
                    { texto: "El mediodia, cuando el sol esta en su maximo poder", valor: "proteccion" },
                    { texto: "El atardecer, cuando el cielo se pinta de colores", valor: "amor" },
                    { texto: "La noche, cuando el misterio se despierta", valor: "sabiduria" }
                ]
            },
            {
                texto: "Que te haria sonreir si lo vieras en un guardian?",
                opciones: [
                    { texto: "Ojos que parecen ver mas alla de lo visible", valor: "sabiduria" },
                    { texto: "Una sonrisa picara y traviesa", valor: "abundancia" },
                    { texto: "Manos que parecen querer abrazarte", valor: "amor" },
                    { texto: "Una postura firme y vigilante", valor: "proteccion" }
                ]
            },
            {
                texto: "Si pudieras pedirle un solo deseo a tu guardian, cual seria?",
                opciones: [
                    { texto: "Que nunca me sienta sola/o", valor: "amor" },
                    { texto: "Que siempre este protegido lo que amo", valor: "proteccion" },
                    { texto: "Que siempre encuentre el camino correcto", valor: "sabiduria" },
                    { texto: "Que la vida me sorprenda con cosas buenas", valor: "abundancia" }
                ]
            }
        ];

        let preguntaActual = 0;
        let respuestas = [];

        function showScreen(id) {
            document.querySelectorAll(".tg-screen").forEach(s => s.classList.remove("active"));
            document.getElementById(id).classList.add("active");
        }

        window.tgStart = function() {
            showScreen("tg-questions");
            mostrarPregunta(0);
        };

        window.tgRestart = function() {
            preguntaActual = 0;
            respuestas = [];
            showScreen("tg-intro");
        };

        function mostrarPregunta(idx) {
            const p = PREGUNTAS[idx];
            const progress = ((idx + 1) / PREGUNTAS.length) * 100;
            document.getElementById("tg-progress-fill").style.width = progress + "%";
            document.getElementById("tg-progress-text").textContent = (idx + 1) + " de " + PREGUNTAS.length;
            document.getElementById("tg-question-text").textContent = p.texto;
            document.getElementById("tg-options").innerHTML = p.opciones.map(o =>
                "<button class=\"tg-option\" onclick=\"tgResponder(\'" + o.valor + "\')\">" + o.texto + "</button>"
            ).join("");
        }

        window.tgResponder = function(valor) {
            respuestas.push(valor);
            preguntaActual++;
            if (preguntaActual < PREGUNTAS.length) {
                mostrarPregunta(preguntaActual);
            } else {
                procesarResultado();
            }
        };

        async function procesarResultado() {
            showScreen("tg-processing");

            const conteo = {};
            respuestas.forEach(r => conteo[r] = (conteo[r] || 0) + 1);
            const perfil = Object.keys(conteo).reduce((a, b) => conteo[a] > conteo[b] ? a : b);

            try {
                const res = await fetch("/wp-json/duendes/v1/recomendar-guardian", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ perfil, respuestas, conteo })
                });
                const data = await res.json();
                mostrarResultado(data);
            } catch (e) {
                mostrarResultado({
                    nombre: "Tu Guardian Perfecto",
                    tipo: "Guardian de " + perfil.charAt(0).toUpperCase() + perfil.slice(1),
                    imagen: "",
                    mensaje: "Basado en tus respuestas, un guardian con energia de " + perfil + " es quien te esta buscando. Visita nuestra tienda para encontrarlo.",
                    traits: [perfil],
                    url: "/shop/"
                });
            }
        }

        function mostrarResultado(data) {
            showScreen("tg-result");
            document.getElementById("tg-result-name").textContent = data.nombre;
            document.getElementById("tg-result-name2").textContent = data.nombre;
            document.getElementById("tg-result-tipo").textContent = data.tipo;
            document.getElementById("tg-result-mensaje").textContent = data.mensaje;
            document.getElementById("tg-result-link").href = data.url || "/shop/";
            if (data.imagen) {
                document.getElementById("tg-result-img").style.backgroundImage = "url(" + data.imagen + ")";
            }
            const traitsHtml = (data.traits || []).map(t => "<span class=\"tg-trait\">" + t + "</span>").join("");
            document.getElementById("tg-traits").innerHTML = traitsHtml;
        }
    })();
    </script>
</div>';
}
