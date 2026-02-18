<?php
/**
 * Plugin Name: Duendes Sorprendeme
 * Description: Función "Sorprendeme" con tríadas curadas - Bloque 3
 * Version: 1.0
 * Author: Claude Code
 */

if (!defined('ABSPATH')) exit;

// Tríadas curadas (8-10 combinaciones predefinidas)
function duendes_get_triadas() {
    return [
        [
            'id' => 1,
            'nombre' => 'El Trío del Despertar',
            'narrativa' => 'Cuando la protección se une a la claridad y la abundancia fluye, el despertar es inevitable. Estos tres guardianes trabajan en capas: uno protege tu energía, otra ilumina tu camino, y el tercero abre las puertas que el miedo tenía cerradas.',
            'categorias' => ['proteccion', 'sabiduria-guia-claridad', 'dinero-abundancia-negocios'],
            'roles' => ['Protege tu campo', 'Ilumina tu camino', 'Abre el flujo']
        ],
        [
            'id' => 2,
            'nombre' => 'La Tríada del Corazón',
            'narrativa' => 'El amor propio es el primer paso. Estos tres guardianes trabajan desde adentro hacia afuera: uno sana las heridas antiguas, otro te enseña a recibir, y el tercero atrae lo que vibracionalmente ya sos.',
            'categorias' => ['salud', 'amor', 'amor'],
            'roles' => ['Sana lo antiguo', 'Enseña a recibir', 'Atrae lo tuyo']
        ],
        [
            'id' => 3,
            'nombre' => 'El Círculo de Poder',
            'narrativa' => 'La abundancia verdadera nace de la protección y la sabiduría. Este trío crea un círculo donde lo que entra está protegido, lo que crece tiene dirección, y lo que florece no se pierde.',
            'categorias' => ['proteccion', 'dinero-abundancia-negocios', 'sabiduria-guia-claridad'],
            'roles' => ['Protege lo que crece', 'Multiplica tu energía', 'Dirige tu poder']
        ],
        [
            'id' => 4,
            'nombre' => 'Los Guardianes de la Sanación',
            'narrativa' => 'Sanar es un viaje de tres etapas: soltar, transmutar y renacer. Cada uno de estos guardianes te acompaña en una fase diferente, pero juntos completan el ciclo.',
            'categorias' => ['salud', 'salud', 'proteccion'],
            'roles' => ['Ayuda a soltar', 'Transmuta el dolor', 'Protege el renacimiento']
        ],
        [
            'id' => 5,
            'nombre' => 'La Trinidad del Éxito',
            'narrativa' => 'El éxito sin protección es frágil, sin claridad es ciego, sin amor es vacío. Estos tres guardianes aseguran que tu abundancia sea sostenible, dirigida y con propósito.',
            'categorias' => ['dinero-abundancia-negocios', 'proteccion', 'sabiduria-guia-claridad'],
            'roles' => ['Atrae oportunidades', 'Protege tus logros', 'Guía tus decisiones']
        ],
        [
            'id' => 6,
            'nombre' => 'El Trío del Equilibrio',
            'narrativa' => 'Cuando el corazón, la mente y el cuerpo están en armonía, todo fluye. Estos guardianes representan las tres dimensiones del ser que necesitan atención.',
            'categorias' => ['amor', 'sabiduria-guia-claridad', 'salud'],
            'roles' => ['Equilibra el corazón', 'Aclara la mente', 'Fortalece el cuerpo']
        ],
        [
            'id' => 7,
            'nombre' => 'Los Protectores del Camino',
            'narrativa' => 'Hay momentos en la vida donde necesitamos más escudos que espadas. Estos tres guardianes crean un campo de protección en múltiples niveles.',
            'categorias' => ['proteccion', 'proteccion', 'sabiduria-guia-claridad'],
            'roles' => ['Protege tu energía', 'Protege tus vínculos', 'Ilumina los peligros']
        ],
        [
            'id' => 8,
            'nombre' => 'La Tríada de la Abundancia',
            'narrativa' => 'La abundancia no es solo dinero. Es salud, es amor, es tiempo, es paz. Estos guardianes trabajan para que tu vida sea rica en todas las dimensiones.',
            'categorias' => ['dinero-abundancia-negocios', 'salud', 'amor'],
            'roles' => ['Abre el flujo material', 'Nutre tu vitalidad', 'Expande tu capacidad de amar']
        ],
    ];
}

// Obtener productos de una categoría
function duendes_get_productos_categoria($cat_slug, $exclude_ids = [], $limit = 10) {
    $args = [
        'post_type' => 'product',
        'posts_per_page' => $limit,
        'post_status' => 'publish',
        'orderby' => 'rand',
        'tax_query' => [
            [
                'taxonomy' => 'product_cat',
                'field' => 'slug',
                'terms' => $cat_slug,
            ]
        ],
        'post__not_in' => $exclude_ids,
    ];

    $query = new WP_Query($args);
    $productos = [];

    while ($query->have_posts()) {
        $query->the_post();
        $product = wc_get_product(get_the_ID());
        if (!$product) continue;

        $productos[] = [
            'id' => get_the_ID(),
            'nombre' => $product->get_name(),
            'precio' => $product->get_price(),
            'precio_html' => $product->get_price_html(),
            'imagen' => get_the_post_thumbnail_url(get_the_ID(), 'medium'),
            'url' => get_permalink(),
            'descripcion' => wp_trim_words($product->get_short_description(), 15, '...'),
        ];
    }
    wp_reset_postdata();

    return $productos;
}

// API endpoint para obtener tríada
add_action('rest_api_init', function() {
    register_rest_route('duendes/v1', '/sorprendeme', [
        'methods' => 'GET',
        'callback' => 'duendes_api_sorprendeme',
        'permission_callback' => '__return_true',
    ]);
});

function duendes_api_sorprendeme($request) {
    $triadas = duendes_get_triadas();

    // Obtener tríadas ya vistas de cookie
    $vistas = isset($_COOKIE['duendes_triadas_vistas']) ? explode(',', $_COOKIE['duendes_triadas_vistas']) : [];

    // Filtrar tríadas no vistas
    $disponibles = array_filter($triadas, function($t) use ($vistas) {
        return !in_array($t['id'], $vistas);
    });

    // Si ya vio todas, resetear
    if (empty($disponibles)) {
        $disponibles = $triadas;
    }

    // Elegir una al azar
    $triada = $disponibles[array_rand($disponibles)];

    // Obtener productos para cada categoría
    $productos = [];
    $exclude_ids = [];

    foreach ($triada['categorias'] as $index => $cat_slug) {
        $prods = duendes_get_productos_categoria($cat_slug, $exclude_ids, 5);
        if (!empty($prods)) {
            $producto = $prods[array_rand($prods)];
            $producto['rol'] = $triada['roles'][$index];
            $productos[] = $producto;
            $exclude_ids[] = $producto['id'];
        }
    }

    // Guardar en cookie
    $vistas[] = $triada['id'];
    setcookie('duendes_triadas_vistas', implode(',', array_unique($vistas)), time() + (86400 * 7), '/');

    return [
        'success' => true,
        'triada' => [
            'nombre' => $triada['nombre'],
            'narrativa' => $triada['narrativa'],
        ],
        'productos' => $productos,
    ];
}

// Inyectar overlay en el footer del shop
add_action('wp_footer', function() {
    if (!is_shop() && !is_product_category()) return;
    ?>
    <div id="dsp-sorprendeme-overlay" class="dsp-overlay">
        <div class="dsp-overlay-content">
            <!-- Fase 1: Canalización -->
            <div class="dsp-fase dsp-fase-1 active">
                <span class="dsp-canalizando-symbol">✦</span>
                <h2 class="dsp-canalizando-titulo">Leyendo tu energía</h2>
                <p class="dsp-canalizando-texto">Tres guardianes están respondiendo a lo que necesitás. No es azar.</p>
                <div class="dsp-canalizando-linea"></div>
            </div>

            <!-- Fase 2: Revelación -->
            <div class="dsp-fase dsp-fase-2">
                <h2 class="dsp-triada-nombre"></h2>
                <div class="dsp-productos-grid">
                    <div class="dsp-producto dsp-producto-1"></div>
                    <div class="dsp-producto dsp-producto-2"></div>
                    <div class="dsp-producto dsp-producto-3"></div>
                </div>
                <div class="dsp-narrativa">
                    <h3>Por qué estos tres juntos</h3>
                    <p class="dsp-narrativa-texto"></p>
                </div>
                <div class="dsp-acciones">
                    <button class="dsp-btn-secundario" onclick="dspCerrarOverlay()">Volver a la tienda</button>
                    <button class="dsp-btn-primario" onclick="dspCanalizar()">Canalizar de nuevo</button>
                </div>
            </div>
        </div>
        <button class="dsp-cerrar" onclick="dspCerrarOverlay()">×</button>
    </div>

    <style>
    .dsp-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(5, 5, 10, 0.98);
        z-index: 9999999;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        overflow-y: auto;
    }

    .dsp-overlay.visible { display: flex; }

    .dsp-overlay-content {
        max-width: 1000px;
        width: 100%;
        text-align: center;
    }

    .dsp-cerrar {
        position: fixed;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: rgba(255,255,255,0.5);
        font-size: 32px;
        cursor: pointer;
        z-index: 10000000;
    }

    .dsp-cerrar:hover { color: #C9A227; }

    /* Fases */
    .dsp-fase { display: none; }
    .dsp-fase.active { display: block; }

    /* Fase 1 - Canalización */
    .dsp-canalizando-symbol {
        font-size: 60px;
        color: #C9A227;
        display: block;
        margin-bottom: 30px;
        animation: dsp-pulse 2s ease-in-out infinite;
    }

    @keyframes dsp-pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }

    .dsp-canalizando-titulo {
        font-family: "Cinzel", serif;
        font-size: 28px;
        color: #C9A227;
        margin: 0 0 20px 0;
        letter-spacing: 3px;
    }

    .dsp-canalizando-texto {
        font-family: "Cormorant Garamond", serif;
        font-size: 18px;
        font-style: italic;
        color: rgba(255,255,255,0.6);
        margin: 0 0 40px 0;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }

    .dsp-canalizando-linea {
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #C9A227, transparent);
        margin: 0 auto;
        animation: dsp-linea-pulse 1.5s ease-in-out infinite;
    }

    @keyframes dsp-linea-pulse {
        0%, 100% { opacity: 0.3; width: 100px; }
        50% { opacity: 1; width: 200px; }
    }

    /* Fase 2 - Revelación */
    .dsp-triada-nombre {
        font-family: "Cinzel", serif;
        font-size: 24px;
        color: #C9A227;
        margin: 0 0 40px 0;
        letter-spacing: 2px;
        opacity: 0;
        animation: dsp-fadeIn 0.5s ease-out forwards;
    }

    .dsp-productos-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
        margin-bottom: 40px;
    }

    @media (max-width: 768px) {
        .dsp-productos-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }
    }

    .dsp-producto {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(201,162,39,0.1);
        padding: 20px;
        opacity: 0;
        transform: translateY(20px);
    }

    .dsp-producto.visible {
        animation: dsp-slideIn 0.6s ease-out forwards;
    }

    .dsp-producto-1.visible { animation-delay: 0.4s; }
    .dsp-producto-2.visible { animation-delay: 1s; }
    .dsp-producto-3.visible { animation-delay: 1.6s; }

    @keyframes dsp-slideIn {
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes dsp-fadeIn {
        to { opacity: 1; }
    }

    .dsp-producto-rol {
        font-family: "Cinzel", serif;
        font-size: 10px;
        letter-spacing: 2px;
        color: #C9A227;
        margin-bottom: 15px;
        text-transform: uppercase;
    }

    .dsp-producto-img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        margin-bottom: 15px;
    }

    .dsp-producto-nombre {
        font-family: "Cinzel", serif;
        font-size: 16px;
        color: #fff;
        margin: 0 0 10px 0;
    }

    .dsp-producto-desc {
        font-family: "Cormorant Garamond", serif;
        font-size: 14px;
        font-style: italic;
        color: rgba(255,255,255,0.5);
        margin: 0 0 15px 0;
        line-height: 1.5;
    }

    .dsp-producto-precio {
        font-family: "Cormorant Garamond", serif;
        font-size: 16px;
        color: rgba(255,255,255,0.7);
        margin-bottom: 15px;
    }

    .dsp-producto-link {
        display: inline-block;
        font-family: "Cinzel", serif;
        font-size: 11px;
        letter-spacing: 1px;
        color: #C9A227;
        text-decoration: none;
        border-bottom: 1px solid rgba(201,162,39,0.3);
        padding-bottom: 3px;
    }

    .dsp-producto-link:hover {
        border-color: #C9A227;
    }

    /* Narrativa */
    .dsp-narrativa {
        max-width: 600px;
        margin: 0 auto 40px;
        padding: 30px;
        background: rgba(201,162,39,0.05);
        border-left: 2px solid rgba(201,162,39,0.3);
        text-align: left;
        opacity: 0;
        animation: dsp-fadeIn 0.5s ease-out 2.2s forwards;
    }

    .dsp-narrativa h3 {
        font-family: "Cinzel", serif;
        font-size: 12px;
        letter-spacing: 2px;
        color: rgba(255,255,255,0.5);
        margin: 0 0 15px 0;
        text-transform: uppercase;
    }

    .dsp-narrativa-texto {
        font-family: "Cormorant Garamond", serif;
        font-size: 16px;
        font-style: italic;
        color: rgba(255,255,255,0.7);
        margin: 0;
        line-height: 1.7;
    }

    /* Botones */
    .dsp-acciones {
        display: flex;
        gap: 20px;
        justify-content: center;
        opacity: 0;
        animation: dsp-fadeIn 0.5s ease-out 2.5s forwards;
    }

    .dsp-btn-primario,
    .dsp-btn-secundario {
        font-family: "Cinzel", serif;
        font-size: 11px;
        letter-spacing: 2px;
        padding: 15px 30px;
        cursor: pointer;
        transition: all 0.3s;
        text-transform: uppercase;
    }

    .dsp-btn-primario {
        background: #C9A227;
        color: #0a0a0a;
        border: none;
    }

    .dsp-btn-primario:hover {
        background: #d4b43a;
    }

    .dsp-btn-secundario {
        background: transparent;
        color: rgba(255,255,255,0.6);
        border: 1px solid rgba(255,255,255,0.2);
    }

    .dsp-btn-secundario:hover {
        border-color: rgba(255,255,255,0.4);
        color: #fff;
    }
    </style>

    <script>
    // Redifinir la función de click de Sorprendeme
    window.duendesSorprendeme = function() {
        dspCanalizar();
    };

    function dspCanalizar() {
        var overlay = document.getElementById('dsp-sorprendeme-overlay');
        overlay.classList.add('visible');

        // Reset fases
        document.querySelector('.dsp-fase-1').classList.add('active');
        document.querySelector('.dsp-fase-2').classList.remove('active');

        // Fetch triada
        fetch('/wp-json/duendes/v1/sorprendeme')
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (!data.success) {
                    console.error('Error cargando triada');
                    return;
                }

                // Después de 4 segundos, mostrar fase 2
                setTimeout(function() {
                    document.querySelector('.dsp-fase-1').classList.remove('active');
                    document.querySelector('.dsp-fase-2').classList.add('active');

                    // Llenar datos
                    document.querySelector('.dsp-triada-nombre').textContent = data.triada.nombre;
                    document.querySelector('.dsp-narrativa-texto').textContent = data.triada.narrativa;

                    // Llenar productos
                    data.productos.forEach(function(prod, i) {
                        var el = document.querySelector('.dsp-producto-' + (i + 1));
                        el.innerHTML = '<div class="dsp-producto-rol">' + prod.rol + '</div>' +
                            '<img src="' + (prod.imagen || '') + '" class="dsp-producto-img" alt="' + prod.nombre + '">' +
                            '<h4 class="dsp-producto-nombre">' + prod.nombre + '</h4>' +
                            '<p class="dsp-producto-desc">' + (prod.descripcion || '') + '</p>' +
                            '<div class="dsp-producto-precio">' + prod.precio_html + '</div>' +
                            '<a href="' + prod.url + '" class="dsp-producto-link">Conocer su historia</a>';
                        el.classList.add('visible');
                    });
                }, 4000);
            })
            .catch(function(err) {
                console.error('Error:', err);
                dspCerrarOverlay();
            });
    }

    function dspCerrarOverlay() {
        var overlay = document.getElementById('dsp-sorprendeme-overlay');
        overlay.classList.remove('visible');

        // Limpiar productos
        document.querySelectorAll('.dsp-producto').forEach(function(el) {
            el.classList.remove('visible');
            el.innerHTML = '';
        });
    }

    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') dspCerrarOverlay();
    });
    </script>
    <?php
}, 100);
