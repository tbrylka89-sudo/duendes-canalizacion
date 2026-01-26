<?php
/**
 * Plugin Name: Duendes Complete System
 * Description: Sistema completo - Grid, Test del Guardián, Tienda, Admin
 * Version: 3.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// SHORTCODE [duendes_grid] - Grid de productos mejorado
// ═══════════════════════════════════════════════════════════════════════════
add_shortcode('duendes_grid', 'duendes_grid_v3');

function duendes_grid_v3($atts) {
    $atts = shortcode_atts(array(
        'cantidad' => 8,
        'categoria' => '',
        'orden' => 'rand',
        'columnas' => 4
    ), $atts);

    $args = array(
        'post_type' => 'product',
        'posts_per_page' => intval($atts['cantidad']),
        'post_status' => 'publish',
        'orderby' => $atts['orden'] === 'rand' ? 'rand' : 'date',
        'order' => 'DESC'
    );

    if (!empty($atts['categoria'])) {
        $args['tax_query'] = array(array(
            'taxonomy' => 'product_cat',
            'field' => 'slug',
            'terms' => $atts['categoria']
        ));
    }

    $products = new WP_Query($args);
    if (!$products->have_posts()) {
        return '<p style="text-align:center;color:#C6A962;padding:40px;">No hay guardianes disponibles</p>';
    }

    $html = '<div class="dg-grid" data-cols="' . esc_attr($atts['columnas']) . '">';

    while ($products->have_posts()) {
        $products->the_post();
        global $product;

        $id = get_the_ID();
        $nombre = get_the_title();
        $precio = $product->get_price();
        $imagen = get_the_post_thumbnail_url($id, 'large');
        $link = get_permalink();
        $cats = wp_get_post_terms($id, 'product_cat', array('fields' => 'names'));
        $tipo = !empty($cats) ? $cats[0] : 'Guardián';

        // Placeholder si no hay imagen
        $img_style = $imagen
            ? "background-image:url('" . esc_url($imagen) . "')"
            : "background:linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)";

        $html .= '
        <a href="' . esc_url($link) . '" class="dg-card">
            <div class="dg-img" style="' . $img_style . '">
                <div class="dg-overlay"></div>
                <div class="dg-orbes">
                    <span class="dg-orbe"></span>
                    <span class="dg-orbe"></span>
                </div>
            </div>
            <div class="dg-content">
                <span class="dg-tipo">' . esc_html($tipo) . '</span>
                <h3 class="dg-nombre">' . esc_html($nombre) . '</h3>
                <span class="dg-precio">$' . number_format($precio, 0, ',', '.') . ' USD</span>
            </div>
            <div class="dg-shine"></div>
        </a>';
    }
    wp_reset_postdata();
    $html .= '</div>';
    return $html;
}

// ═══════════════════════════════════════════════════════════════════════════
// SHORTCODE [test_del_guardian] - Test emocional con IA
// ═══════════════════════════════════════════════════════════════════════════
add_shortcode('test_del_guardian', 'duendes_test_guardian');

function duendes_test_guardian($atts) {
    ob_start();
    ?>
    <div id="test-guardian" class="tg-container">
        <!-- Pantalla de inicio -->
        <div class="tg-screen tg-intro active">
            <div class="tg-orbes">
                <span class="tg-orbe tg-orbe-1"></span>
                <span class="tg-orbe tg-orbe-2"></span>
                <span class="tg-orbe tg-orbe-3"></span>
            </div>
            <h1 class="tg-title">Descubrí qué Guardián te Elige</h1>
            <p class="tg-subtitle">Un viaje de 7 preguntas hacia tu compañero místico.<br>Respondé con el corazón, no con la mente.</p>
            <button class="tg-btn tg-btn-start" onclick="tgStart()">
                <span>✨</span> Comenzar el Viaje
            </button>
            <p class="tg-hint">Solo toma 2 minutos. Tu guardián ya te está esperando.</p>
        </div>

        <!-- Preguntas -->
        <div class="tg-screen tg-questions">
            <div class="tg-progress">
                <div class="tg-progress-bar"></div>
                <span class="tg-progress-text">1 de 7</span>
            </div>

            <div class="tg-question-wrap">
                <p class="tg-question-text"></p>
                <div class="tg-options"></div>
            </div>
        </div>

        <!-- Procesando -->
        <div class="tg-screen tg-processing">
            <div class="tg-spinner"></div>
            <p class="tg-processing-text">Los guardianes están consultando el oráculo...</p>
        </div>

        <!-- Resultado -->
        <div class="tg-screen tg-result">
            <div class="tg-result-card">
                <div class="tg-result-badge">Tu Guardián Ideal</div>
                <div class="tg-result-img"></div>
                <h2 class="tg-result-name"></h2>
                <p class="tg-result-tipo"></p>
                <div class="tg-result-mensaje"></div>
                <div class="tg-result-traits"></div>
                <a href="#" class="tg-btn tg-btn-adopt">
                    <span>💜</span> Conocer a <span class="tg-result-name-btn"></span>
                </a>
                <button class="tg-btn-retry" onclick="tgRestart()">Hacer el test de nuevo</button>
            </div>
        </div>
    </div>

    <style>
    /* ═══════════════════════════════════════════════════════════════
       TEST DEL GUARDIÁN - Estilo místico
    ═══════════════════════════════════════════════════════════════ */
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

    .tg-container {
        min-height: 80vh;
        background: linear-gradient(180deg, #0a0a0a 0%, #0d1117 100%);
        padding: 60px 20px;
        font-family: 'Cormorant Garamond', Georgia, serif;
        position: relative;
        overflow: hidden;
    }

    .tg-screen {
        display: none;
        max-width: 700px;
        margin: 0 auto;
        text-align: center;
    }
    .tg-screen.active { display: block; }

    /* Orbes */
    .tg-orbes {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }
    .tg-orbe {
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(198, 169, 98, 0.2) 0%, transparent 70%);
        filter: blur(40px);
        animation: tgFloat 8s ease-in-out infinite;
    }
    .tg-orbe-1 { width: 200px; height: 200px; top: 10%; left: 10%; }
    .tg-orbe-2 { width: 150px; height: 150px; bottom: 20%; right: 15%; animation-delay: 2s; }
    .tg-orbe-3 { width: 100px; height: 100px; top: 50%; left: 50%; animation-delay: 4s; }

    @keyframes tgFloat {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
        50% { transform: translate(20px, -20px) scale(1.1); opacity: 0.8; }
    }

    /* Intro */
    .tg-title {
        font-family: 'Cinzel', serif;
        font-size: clamp(28px, 5vw, 42px);
        color: #C6A962;
        margin: 0 0 20px 0;
        position: relative;
    }
    .tg-subtitle {
        font-size: 20px;
        color: rgba(255,255,255,0.8);
        margin: 0 0 40px 0;
        line-height: 1.6;
        font-style: italic;
    }
    .tg-hint {
        font-size: 14px;
        color: rgba(255,255,255,0.5);
        margin-top: 20px;
    }

    /* Botones */
    .tg-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 18px 40px;
        background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
        border: none;
        border-radius: 50px;
        font-family: 'Cinzel', serif;
        font-size: 16px;
        font-weight: 600;
        color: #0a0a0a;
        cursor: pointer;
        transition: all 0.4s ease;
        box-shadow: 0 10px 30px rgba(198, 169, 98, 0.3);
        text-decoration: none;
    }
    .tg-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(198, 169, 98, 0.4), 0 0 60px rgba(198, 169, 98, 0.2);
    }

    /* Progress */
    .tg-progress {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 40px;
    }
    .tg-progress-bar {
        flex: 1;
        height: 6px;
        background: rgba(255,255,255,0.1);
        border-radius: 3px;
        overflow: hidden;
    }
    .tg-progress-bar::after {
        content: '';
        display: block;
        height: 100%;
        width: var(--progress, 14%);
        background: linear-gradient(90deg, #C6A962, #D4BC7D);
        transition: width 0.5s ease;
    }
    .tg-progress-text {
        font-size: 14px;
        color: #C6A962;
        white-space: nowrap;
    }

    /* Pregunta */
    .tg-question-text {
        font-size: 24px;
        color: #fff;
        margin: 0 0 40px 0;
        line-height: 1.5;
    }
    .tg-options {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    .tg-option {
        padding: 20px 25px;
        background: rgba(255,255,255,0.03);
        border: 2px solid rgba(198, 169, 98, 0.2);
        border-radius: 16px;
        color: #fff;
        font-size: 17px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
    }
    .tg-option:hover {
        background: rgba(198, 169, 98, 0.1);
        border-color: #C6A962;
        transform: translateX(10px);
    }
    .tg-option.selected {
        background: rgba(198, 169, 98, 0.2);
        border-color: #C6A962;
    }

    /* Processing */
    .tg-processing { padding-top: 100px; }
    .tg-spinner {
        width: 60px;
        height: 60px;
        border: 3px solid rgba(198, 169, 98, 0.2);
        border-top-color: #C6A962;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 30px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .tg-processing-text {
        font-size: 20px;
        color: rgba(255,255,255,0.8);
        font-style: italic;
    }

    /* Resultado */
    .tg-result-card {
        background: rgba(20, 20, 20, 0.9);
        border: 2px solid rgba(198, 169, 98, 0.3);
        border-radius: 24px;
        padding: 40px;
        position: relative;
    }
    .tg-result-badge {
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #C6A962, #a88a42);
        color: #0a0a0a;
        padding: 8px 24px;
        border-radius: 50px;
        font-family: 'Cinzel', serif;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    .tg-result-img {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        margin: 20px auto;
        background-size: cover;
        background-position: center;
        border: 4px solid #C6A962;
        box-shadow: 0 0 40px rgba(198, 169, 98, 0.3);
    }
    .tg-result-name {
        font-family: 'Cinzel', serif;
        font-size: 32px;
        color: #fff;
        margin: 0 0 10px 0;
    }
    .tg-result-tipo {
        color: #C6A962;
        font-size: 16px;
        margin: 0 0 20px 0;
    }
    .tg-result-mensaje {
        font-size: 18px;
        color: rgba(255,255,255,0.8);
        line-height: 1.7;
        margin-bottom: 30px;
        font-style: italic;
    }
    .tg-result-traits {
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
        border-radius: 50px;
        font-size: 13px;
        color: #C6A962;
    }
    .tg-btn-retry {
        background: none;
        border: none;
        color: rgba(255,255,255,0.5);
        font-size: 14px;
        cursor: pointer;
        margin-top: 15px;
    }
    .tg-btn-retry:hover { color: #fff; }
    </style>

    <script>
    (function() {
        const PREGUNTAS = [
            {
                texto: "Cerrá los ojos un segundo. ¿Qué sentís que más te falta en este momento de tu vida?",
                opciones: [
                    { texto: "Protección. Sentirme segura/o en mi propio espacio", valor: "proteccion" },
                    { texto: "Abundancia. Que las cosas fluyan, que llegue lo que necesito", valor: "abundancia" },
                    { texto: "Amor. Conexión profunda, conmigo o con otros", valor: "amor" },
                    { texto: "Claridad. Entender hacia dónde voy, qué decisiones tomar", valor: "sabiduria" }
                ]
            },
            {
                texto: "Si pudieras tener un compañero invisible que siempre esté ahí, ¿qué te gustaría que hiciera?",
                opciones: [
                    { texto: "Que cuide mi hogar y mi energía mientras duermo", valor: "proteccion" },
                    { texto: "Que atraiga oportunidades y prosperidad", valor: "abundancia" },
                    { texto: "Que me recuerde lo valioso/a que soy", valor: "amor" },
                    { texto: "Que me susurre respuestas cuando estoy perdida/o", valor: "sabiduria" }
                ]
            },
            {
                texto: "¿Qué elemento te llama más en este momento?",
                opciones: [
                    { texto: "Tierra - La estabilidad, las raíces, lo firme", valor: "tierra" },
                    { texto: "Agua - Las emociones, la intuición, lo profundo", valor: "agua" },
                    { texto: "Fuego - La pasión, la transformación, la fuerza", valor: "fuego" },
                    { texto: "Aire - Las ideas, la libertad, la comunicación", valor: "aire" }
                ]
            },
            {
                texto: "Si un guardián te hablara, ¿cómo te gustaría que fuera su voz?",
                opciones: [
                    { texto: "Firme y protectora, como un abrazo seguro", valor: "proteccion" },
                    { texto: "Alegre y traviesa, llena de picardía", valor: "abundancia" },
                    { texto: "Suave y cálida, que toque el corazón", valor: "amor" },
                    { texto: "Serena y profunda, llena de sabiduría", valor: "sabiduria" }
                ]
            },
            {
                texto: "¿Qué momento del día te hace sentir más conectada/o con algo más grande?",
                opciones: [
                    { texto: "El amanecer, cuando todo empieza de nuevo", valor: "abundancia" },
                    { texto: "El mediodía, cuando el sol está en su máximo poder", valor: "proteccion" },
                    { texto: "El atardecer, cuando el cielo se pinta de colores", valor: "amor" },
                    { texto: "La noche, cuando el misterio se despierta", valor: "sabiduria" }
                ]
            },
            {
                texto: "¿Qué te haría sonreír si lo vieras en un guardián?",
                opciones: [
                    { texto: "Ojos que parecen ver más allá de lo visible", valor: "sabiduria" },
                    { texto: "Una sonrisa pícara y traviesa", valor: "abundancia" },
                    { texto: "Manos que parecen querer abrazarte", valor: "amor" },
                    { texto: "Una postura firme y vigilante", valor: "proteccion" }
                ]
            },
            {
                texto: "Si pudieras pedirle un solo deseo a tu guardián, ¿cuál sería?",
                opciones: [
                    { texto: "Que nunca me sienta sola/o", valor: "amor" },
                    { texto: "Que siempre esté protegido lo que amo", valor: "proteccion" },
                    { texto: "Que siempre encuentre el camino correcto", valor: "sabiduria" },
                    { texto: "Que la vida me sorprenda con cosas buenas", valor: "abundancia" }
                ]
            }
        ];

        let preguntaActual = 0;
        let respuestas = [];

        window.tgStart = function() {
            document.querySelector('.tg-intro').classList.remove('active');
            document.querySelector('.tg-questions').classList.add('active');
            mostrarPregunta(0);
        };

        window.tgRestart = function() {
            preguntaActual = 0;
            respuestas = [];
            document.querySelector('.tg-result').classList.remove('active');
            document.querySelector('.tg-intro').classList.add('active');
        };

        function mostrarPregunta(index) {
            const pregunta = PREGUNTAS[index];
            const container = document.querySelector('.tg-questions');

            // Update progress
            const progress = ((index + 1) / PREGUNTAS.length) * 100;
            container.querySelector('.tg-progress-bar').style.setProperty('--progress', progress + '%');
            container.querySelector('.tg-progress-text').textContent = (index + 1) + ' de ' + PREGUNTAS.length;

            // Update question
            container.querySelector('.tg-question-text').textContent = pregunta.texto;

            // Update options
            const optionsEl = container.querySelector('.tg-options');
            optionsEl.innerHTML = pregunta.opciones.map((op, i) =>
                '<button class="tg-option" onclick="tgResponder(\'' + op.valor + '\')">' + op.texto + '</button>'
            ).join('');
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
            document.querySelector('.tg-questions').classList.remove('active');
            document.querySelector('.tg-processing').classList.add('active');

            // Calcular perfil dominante
            const conteo = {};
            respuestas.forEach(r => conteo[r] = (conteo[r] || 0) + 1);
            const perfil = Object.keys(conteo).reduce((a, b) => conteo[a] > conteo[b] ? a : b);

            // Llamar a la API para obtener recomendación
            try {
                const res = await fetch('/wp-json/duendes/v1/recomendar-guardian', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ perfil, respuestas, conteo })
                });
                const data = await res.json();
                mostrarResultado(data);
            } catch (e) {
                // Fallback si falla la API
                mostrarResultado({
                    nombre: 'Tu Guardián Perfecto',
                    tipo: 'Guardián de ' + perfil.charAt(0).toUpperCase() + perfil.slice(1),
                    imagen: '',
                    mensaje: 'Basado en tus respuestas, un guardián con energía de ' + perfil + ' es quien te está buscando. Visitá nuestra tienda para encontrarlo.',
                    traits: [perfil, 'conexión', 'energía'],
                    url: '/shop/'
                });
            }
        }

        function mostrarResultado(data) {
            document.querySelector('.tg-processing').classList.remove('active');
            const result = document.querySelector('.tg-result');
            result.classList.add('active');

            result.querySelector('.tg-result-name').textContent = data.nombre;
            result.querySelector('.tg-result-name-btn').textContent = data.nombre;
            result.querySelector('.tg-result-tipo').textContent = data.tipo;
            result.querySelector('.tg-result-mensaje').innerHTML = data.mensaje;
            result.querySelector('.tg-btn-adopt').href = data.url;

            if (data.imagen) {
                result.querySelector('.tg-result-img').style.backgroundImage = 'url(' + data.imagen + ')';
            }

            const traitsEl = result.querySelector('.tg-result-traits');
            traitsEl.innerHTML = (data.traits || []).map(t =>
                '<span class="tg-trait">' + t + '</span>'
            ).join('');
        }
    })();
    </script>
    <?php
    return ob_get_clean();
}

// ═══════════════════════════════════════════════════════════════════════════
// API REST para recomendación con IA
// ═══════════════════════════════════════════════════════════════════════════
add_action('rest_api_init', function() {
    register_rest_route('duendes/v1', '/recomendar-guardian', array(
        'methods' => 'POST',
        'callback' => 'duendes_recomendar_guardian',
        'permission_callback' => '__return_true'
    ));
});

function duendes_recomendar_guardian($request) {
    $data = $request->get_json_params();
    $perfil = sanitize_text_field($data['perfil']);
    $conteo = $data['conteo'];

    // Buscar productos que coincidan con el perfil
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => 1,
        'orderby' => 'rand',
        'post_status' => 'publish',
        'meta_query' => array(
            'relation' => 'OR',
            array(
                'key' => '_proposito',
                'value' => $perfil,
                'compare' => 'LIKE'
            )
        ),
        'tax_query' => array(
            array(
                'taxonomy' => 'product_cat',
                'field' => 'name',
                'terms' => array($perfil, ucfirst($perfil)),
                'operator' => 'IN'
            )
        )
    );

    // Si no encontramos por categoría, buscar cualquier producto
    $products = new WP_Query($args);
    if (!$products->have_posts()) {
        $products = new WP_Query(array(
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
        ));
    }

    if ($products->have_posts()) {
        $products->the_post();
        $id = get_the_ID();
        $nombre = get_the_title();
        $imagen = get_the_post_thumbnail_url($id, 'medium');
        $link = get_permalink();
        $cats = wp_get_post_terms($id, 'product_cat', array('fields' => 'names'));
        $tipo = !empty($cats) ? 'Guardián de ' . $cats[0] : 'Guardián Místico';

        // Generar mensaje personalizado
        $mensajes = array(
            'proteccion' => "$nombre ha escuchado tu llamado. Es un guardián que entiende la necesidad de sentirse seguro/a, de tener un escudo invisible que cuide tu espacio y tu energía. Fue creado para quienes, como vos, buscan esa paz que solo da saberse protegido/a.",
            'abundancia' => "$nombre vibra con la misma frecuencia que tu deseo de prosperidad. Es un guardián que atrae oportunidades, que abre puertas que parecían cerradas. Para quienes sueñan en grande y están listos para recibir.",
            'amor' => "$nombre sintió el latido de tu corazón desde el momento que empezaste este test. Es un guardián que entiende el lenguaje del amor en todas sus formas: el amor propio, el amor que das, el amor que esperás recibir.",
            'sabiduria' => "$nombre fue atraído por tu sed de respuestas. Es un guardián antiguo, de los que guardan secretos y susurran verdades. Para quienes buscan ver más allá de lo evidente."
        );

        wp_reset_postdata();

        return array(
            'nombre' => $nombre,
            'tipo' => $tipo,
            'imagen' => $imagen,
            'mensaje' => $mensajes[$perfil] ?? "Este guardián resonó con tu energía de forma especial. Hay algo en tu esencia que lo llamó.",
            'traits' => array_keys($conteo),
            'url' => $link
        );
    }

    wp_reset_postdata();
    return array(
        'nombre' => 'Tu Guardián Ideal',
        'tipo' => 'Guardián de ' . ucfirst($perfil),
        'imagen' => '',
        'mensaje' => 'Basado en tus respuestas, tu guardián ideal tiene energía de ' . $perfil . '. Explorá nuestra tienda para encontrar el que resuene con vos.',
        'traits' => array_keys($conteo),
        'url' => '/shop/'
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS GLOBALES - Grid, Tienda, General
// ═══════════════════════════════════════════════════════════════════════════
add_action('wp_head', 'duendes_global_styles', 5);

function duendes_global_styles() {
?>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

/* ═══════════════════════════════════════════════════════════════
   GRID DE PRODUCTOS [duendes_grid]
═══════════════════════════════════════════════════════════════ */
.dg-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 25px;
    padding: 40px 20px;
    max-width: 1400px;
    margin: 0 auto;
}
.dg-grid[data-cols="3"] { grid-template-columns: repeat(3, 1fr); }
.dg-grid[data-cols="2"] { grid-template-columns: repeat(2, 1fr); }

@media (max-width: 1200px) { .dg-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 900px) { .dg-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
@media (max-width: 500px) { .dg-grid { grid-template-columns: 1fr; } }

.dg-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: #0a0a0a;
    border: 2px solid #1a1a1a;
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    transition: all 0.4s ease;
}
.dg-card:hover {
    border-color: #C6A962;
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 40px rgba(198, 169, 98, 0.15);
}

.dg-img {
    position: relative;
    aspect-ratio: 3/4;
    background-size: cover;
    background-position: center;
}
.dg-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.9) 100%);
}
.dg-orbes {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.5s;
}
.dg-card:hover .dg-orbes { opacity: 1; }
.dg-orbe {
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(198,169,98,0.4) 0%, transparent 70%);
    filter: blur(20px);
    animation: dgFloat 4s ease-in-out infinite;
}
.dg-orbe:first-child { top: 20%; left: 10%; }
.dg-orbe:last-child { bottom: 30%; right: 10%; animation-delay: 2s; }
@keyframes dgFloat {
    0%, 100% { transform: translate(0,0); }
    50% { transform: translate(10px, -10px); }
}

.dg-content {
    padding: 20px;
    background: #0a0a0a;
}
.dg-tipo {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #C6A962;
    margin-bottom: 8px;
}
.dg-nombre {
    font-family: 'Cinzel', serif;
    font-size: 18px;
    font-weight: 500;
    color: #fff;
    margin: 0 0 12px 0;
    line-height: 1.3;
}
.dg-precio {
    font-family: 'Cinzel', serif;
    font-size: 16px;
    color: #C6A962;
}

.dg-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: skewX(-25deg);
    transition: left 0.7s;
}
.dg-card:hover .dg-shine { left: 150%; }

/* ═══════════════════════════════════════════════════════════════
   TIENDA WOOCOMMERCE - Estilo oscuro
═══════════════════════════════════════════════════════════════ */
.woocommerce ul.products li.product,
.woocommerce-page ul.products li.product {
    background: #0a0a0a !important;
    border: 2px solid #1a1a1a !important;
    border-radius: 16px !important;
    overflow: hidden !important;
    transition: all 0.3s ease !important;
}
.woocommerce ul.products li.product:hover {
    border-color: #C6A962 !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
}
.woocommerce ul.products li.product a img {
    border-radius: 0 !important;
}
.woocommerce ul.products li.product .woocommerce-loop-product__title,
.woocommerce ul.products li.product h2 {
    font-family: 'Cinzel', serif !important;
    color: #fff !important;
    font-size: 16px !important;
    padding: 15px !important;
}
.woocommerce ul.products li.product .price {
    color: #C6A962 !important;
    font-family: 'Cinzel', serif !important;
    padding: 0 15px 15px !important;
}
.woocommerce ul.products li.product .button,
.woocommerce ul.products li.product .add_to_cart_button {
    background: linear-gradient(135deg, #C6A962, #a88a42) !important;
    color: #0a0a0a !important;
    border: none !important;
    border-radius: 8px !important;
    margin: 0 15px 15px !important;
    font-family: 'Cinzel', serif !important;
    font-weight: 600 !important;
}

/* Ocultar diseños viejos que interfieren */
.dupc-grid,
[class*="dupc-"],
.elementor-shortcode:has([duendes_grid]) {
    /* No ocultar, dejar que nuestro CSS tome precedencia */
}
</style>
<?php
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN DENTRO DE WORDPRESS - Menú y página
// ═══════════════════════════════════════════════════════════════════════════
add_action('admin_menu', 'duendes_admin_menu');

function duendes_admin_menu() {
    add_menu_page(
        'Duendes Mágico',
        '🧙 Duendes',
        'manage_options',
        'duendes-admin',
        'duendes_admin_page',
        'dashicons-star-filled',
        30
    );

    add_submenu_page(
        'duendes-admin',
        'Generar Historias',
        '✨ Historias IA',
        'manage_options',
        'duendes-historias',
        'duendes_historias_page'
    );
}

function duendes_admin_page() {
    ?>
    <div class="wrap" style="background:#0a0a0a;margin:-20px -20px 0;padding:40px;min-height:100vh;color:#fff;font-family:system-ui;">
        <h1 style="color:#C6A962;font-size:28px;margin-bottom:30px;">🧙 Panel de Duendes del Uruguay</h1>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1200px;">
            <a href="<?php echo admin_url('admin.php?page=duendes-historias'); ?>" style="background:#161b22;border:2px solid #30363d;border-radius:16px;padding:30px;text-decoration:none;transition:all 0.3s;">
                <span style="font-size:40px;display:block;margin-bottom:15px;">✨</span>
                <h3 style="color:#fff;margin:0 0 10px;font-size:18px;">Generar Historias</h3>
                <p style="color:#888;margin:0;font-size:14px;">Creá historias únicas con IA para tus guardianes</p>
            </a>

            <a href="<?php echo admin_url('edit.php?post_type=product'); ?>" style="background:#161b22;border:2px solid #30363d;border-radius:16px;padding:30px;text-decoration:none;transition:all 0.3s;">
                <span style="font-size:40px;display:block;margin-bottom:15px;">📦</span>
                <h3 style="color:#fff;margin:0 0 10px;font-size:18px;">Productos</h3>
                <p style="color:#888;margin:0;font-size:14px;">Administrar guardianes en WooCommerce</p>
            </a>

            <a href="https://duendes-vercel.vercel.app/admin" target="_blank" style="background:#161b22;border:2px solid #30363d;border-radius:16px;padding:30px;text-decoration:none;transition:all 0.3s;">
                <span style="font-size:40px;display:block;margin-bottom:15px;">🔮</span>
                <h3 style="color:#fff;margin:0 0 10px;font-size:18px;">Panel Avanzado</h3>
                <p style="color:#888;margin:0;font-size:14px;">Estudio, estadísticas, configuración</p>
            </a>
        </div>
    </div>
    <?php
}

function duendes_historias_page() {
    // Obtener productos
    $productos = wc_get_products(array('limit' => -1, 'status' => 'publish'));
    ?>
    <div class="wrap" style="background:#0a0a0a;margin:-20px -20px 0;padding:40px;min-height:100vh;color:#fff;font-family:system-ui;">
        <h1 style="color:#C6A962;font-size:24px;margin-bottom:10px;">✨ Generar Historias con IA</h1>
        <p style="color:#888;margin-bottom:30px;">Seleccioná los productos y generá historias únicas con Claude</p>

        <div style="background:#161b22;border:1px solid #30363d;border-radius:16px;padding:30px;max-width:1000px;">
            <div style="margin-bottom:20px;">
                <button onclick="generarTodas()" style="background:linear-gradient(135deg,#8B5CF6,#06b6d4);color:#fff;border:none;padding:15px 30px;border-radius:8px;font-size:16px;cursor:pointer;font-weight:600;">
                    🚀 Generar TODAS las historias faltantes
                </button>
                <span id="dh-status" style="margin-left:15px;color:#888;"></span>
            </div>

            <div id="dh-progress" style="display:none;margin-bottom:20px;">
                <div style="background:#21262d;border-radius:8px;height:10px;overflow:hidden;">
                    <div id="dh-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#C6A962,#06b6d4);transition:width 0.3s;"></div>
                </div>
                <p id="dh-current" style="color:#888;font-size:13px;margin-top:10px;"></p>
            </div>

            <table style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr style="border-bottom:1px solid #30363d;">
                        <th style="padding:12px;text-align:left;color:#C6A962;font-size:13px;">Producto</th>
                        <th style="padding:12px;text-align:left;color:#C6A962;font-size:13px;">Categoría</th>
                        <th style="padding:12px;text-align:center;color:#C6A962;font-size:13px;">Historia</th>
                        <th style="padding:12px;text-align:right;color:#C6A962;font-size:13px;">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($productos as $producto): ?>
                    <?php
                        $tiene_historia = get_post_meta($producto->get_id(), '_guardian_historia', true);
                        $cats = wp_get_post_terms($producto->get_id(), 'product_cat', array('fields' => 'names'));
                    ?>
                    <tr style="border-bottom:1px solid #21262d;" data-id="<?php echo $producto->get_id(); ?>">
                        <td style="padding:12px;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <?php if ($producto->get_image_id()): ?>
                                <img src="<?php echo wp_get_attachment_image_url($producto->get_image_id(), 'thumbnail'); ?>" style="width:40px;height:40px;border-radius:8px;object-fit:cover;">
                                <?php endif; ?>
                                <span style="color:#fff;"><?php echo $producto->get_name(); ?></span>
                            </div>
                        </td>
                        <td style="padding:12px;color:#888;"><?php echo implode(', ', $cats); ?></td>
                        <td style="padding:12px;text-align:center;">
                            <?php if ($tiene_historia): ?>
                            <span style="color:#22c55e;">✓</span>
                            <?php else: ?>
                            <span style="color:#666;">—</span>
                            <?php endif; ?>
                        </td>
                        <td style="padding:12px;text-align:right;">
                            <button onclick="generarHistoria(<?php echo $producto->get_id(); ?>, '<?php echo esc_js($producto->get_name()); ?>')"
                                style="background:#21262d;color:#C6A962;border:1px solid #30363d;padding:8px 16px;border-radius:6px;cursor:pointer;font-size:13px;">
                                Generar
                            </button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script>
    async function generarHistoria(id, nombre) {
        const btn = event.target;
        btn.disabled = true;
        btn.textContent = 'Generando...';

        try {
            const res = await fetch('https://duendes-vercel.vercel.app/api/admin/productos/generar-historia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: nombre,
                    tipo: 'Duende',
                    elemento: 'Tierra',
                    proposito: 'Protección',
                    productId: 'woo_' + id
                })
            });
            const data = await res.json();
            if (data.success) {
                btn.textContent = '✓ Listo';
                btn.style.color = '#22c55e';
                const row = btn.closest('tr');
                row.querySelector('td:nth-child(3) span').textContent = '✓';
                row.querySelector('td:nth-child(3) span').style.color = '#22c55e';
            } else {
                throw new Error(data.error);
            }
        } catch (e) {
            btn.textContent = 'Error';
            btn.style.color = '#ef4444';
            console.error(e);
        }
    }

    async function generarTodas() {
        const rows = document.querySelectorAll('tbody tr');
        const sinHistoria = Array.from(rows).filter(r => r.querySelector('td:nth-child(3) span').textContent === '—');

        if (sinHistoria.length === 0) {
            document.getElementById('dh-status').textContent = 'Todos los productos ya tienen historia';
            return;
        }

        document.getElementById('dh-progress').style.display = 'block';
        document.getElementById('dh-status').textContent = 'Generando ' + sinHistoria.length + ' historias...';

        for (let i = 0; i < sinHistoria.length; i++) {
            const row = sinHistoria[i];
            const id = row.dataset.id;
            const nombre = row.querySelector('td:first-child span').textContent;

            document.getElementById('dh-bar').style.width = ((i + 1) / sinHistoria.length * 100) + '%';
            document.getElementById('dh-current').textContent = 'Procesando: ' + nombre + ' (' + (i + 1) + '/' + sinHistoria.length + ')';

            try {
                await fetch('https://duendes-vercel.vercel.app/api/admin/productos/generar-historia', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: nombre,
                        tipo: 'Duende',
                        elemento: ['Tierra', 'Agua', 'Fuego', 'Aire', 'Éter'][i % 5],
                        proposito: ['Protección', 'Abundancia', 'Amor', 'Sanación', 'Sabiduría'][Math.floor(Math.random() * 5)],
                        productId: 'woo_' + id
                    })
                });
                row.querySelector('td:nth-child(3) span').textContent = '✓';
                row.querySelector('td:nth-child(3) span').style.color = '#22c55e';
            } catch (e) {
                console.error(e);
            }

            // Esperar 3 segundos entre requests
            if (i < sinHistoria.length - 1) {
                await new Promise(r => setTimeout(r, 3000));
            }
        }

        document.getElementById('dh-status').textContent = '¡Completado!';
        document.getElementById('dh-current').textContent = 'Todas las historias han sido generadas';
    }
    </script>
    <?php
}
?>
