<?php
/**
 * Plugin: Mensajes del Guardián
 *
 * Muestra 6 mensajes progresivos del guardián según el perfil psicológico
 * del visitante (detectado por el test del guardián o por comportamiento).
 *
 * Los mensajes aparecen como notificaciones elegantes tipo:
 * "✨ {Nombre} tiene un mensaje para vos..."
 *
 * Tiempos: 30s, 60s, 90s, 120s, 150s, 180s
 *
 * Perfiles: vulnerable, esceptico, impulsivo, racional, coleccionista, default
 */

if (!defined('ABSPATH')) exit;

// Solo en páginas de producto
add_action('wp_footer', 'duendes_mensajes_guardian_render');

function duendes_mensajes_guardian_render() {
    if (!is_product()) return;

    global $product;
    if (!$product) return;

    // No mostrar mensajes para productos agotados (ya adoptados)
    $stock_status = $product->get_stock_status();
    if ($stock_status === 'outofstock' || !$product->is_in_stock()) {
        return;
    }

    $product_id = $product->get_id();
    $nombre = $product->get_name();

    // Obtener mensajes guardados (si existen)
    $mensajes_json = get_post_meta($product_id, '_duendes_mensajes_guardian', true);

    // Si no hay mensajes específicos, usar los cierres como base
    if (!$mensajes_json) {
        $cierres_json = get_post_meta($product_id, '_cierres_json', true);
        if ($cierres_json) {
            // Convertir cierres a formato de mensajes progresivos
            $cierres = json_decode($cierres_json, true);
            $mensajes_json = json_encode(duendes_generar_mensajes_desde_cierres($nombre, $cierres));
        }
    }

    // Si aún no hay mensajes, usar mensajes por defecto
    if (!$mensajes_json) {
        $categoria = '';
        $terms = get_the_terms($product_id, 'product_cat');
        if ($terms && !is_wp_error($terms)) {
            $categoria = strtolower($terms[0]->slug);
        }
        $mensajes_json = json_encode(duendes_mensajes_default($nombre, $categoria));
    }

    // Obtener imagen del producto
    $imagen = wp_get_attachment_image_url($product->get_image_id(), 'thumbnail') ?: '';

    ?>
    <!-- Mensajes del Guardián -->
    <style>
    .dmg-notificacion {
        position: fixed;
        bottom: 100px;
        right: 20px;
        max-width: 320px;
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        border: 1px solid rgba(201, 162, 39, 0.3);
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(201, 162, 39, 0.1);
        z-index: 99998;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-family: 'Cormorant Garamond', Georgia, serif;
    }
    .dmg-notificacion.visible {
        opacity: 1;
        transform: translateX(0);
    }
    .dmg-notificacion-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
    }
    .dmg-notificacion-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #c9a227;
    }
    .dmg-notificacion-titulo {
        color: #c9a227;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
    }
    .dmg-notificacion-mensaje {
        color: rgba(255,255,255,0.9);
        font-size: 15px;
        line-height: 1.5;
        font-style: italic;
    }
    .dmg-notificacion-cerrar {
        position: absolute;
        top: 8px;
        right: 10px;
        background: none;
        border: none;
        color: rgba(255,255,255,0.4);
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        line-height: 1;
    }
    .dmg-notificacion-cerrar:hover {
        color: #c9a227;
    }
    @media (max-width: 480px) {
        .dmg-notificacion {
            right: 10px;
            left: 10px;
            max-width: none;
            bottom: 80px;
        }
    }
    </style>

    <div id="dmg-container"></div>

    <script>
    (function() {
        'use strict';

        var CONFIG = {
            nombreGuardian: <?php echo json_encode($nombre); ?>,
            imagenGuardian: <?php echo json_encode($imagen); ?>,
            mensajesPorPerfil: <?php echo $mensajes_json; ?>,
            tiempos: [30000, 60000, 90000, 120000, 150000, 180000], // 30s, 60s, 90s, 2min, 2.5min, 3min
            duracionVisible: 8000, // 8 segundos visible
            cookiePerfil: 'ddu_perfil_guardian'
        };

        var estado = {
            mensajeActual: 0,
            timers: [],
            perfilActivo: 'default',
            pausado: false
        };

        // Obtener perfil del test del guardián (cookie)
        function obtenerPerfil() {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.indexOf(CONFIG.cookiePerfil + '=') === 0) {
                    return cookie.substring(CONFIG.cookiePerfil.length + 1);
                }
            }
            // Si no hay cookie, detectar por comportamiento básico
            var hora = new Date().getHours();
            if (hora >= 22 || hora < 6) return 'vulnerable'; // Horario nocturno
            return 'default';
        }

        // Crear notificación
        function crearNotificacion() {
            var container = document.getElementById('dmg-container');
            var notif = document.createElement('div');
            notif.className = 'dmg-notificacion';
            notif.id = 'dmg-notificacion';

            var avatarHtml = CONFIG.imagenGuardian
                ? '<img src="' + CONFIG.imagenGuardian + '" alt="" class="dmg-notificacion-avatar">'
                : '';

            notif.innerHTML =
                '<button class="dmg-notificacion-cerrar" onclick="DMG.cerrar()">&times;</button>' +
                '<div class="dmg-notificacion-header">' +
                    avatarHtml +
                    '<span class="dmg-notificacion-titulo">✨ ' + CONFIG.nombreGuardian + ' tiene un mensaje para vos...</span>' +
                '</div>' +
                '<div class="dmg-notificacion-mensaje" id="dmg-mensaje"></div>';

            container.appendChild(notif);
            return notif;
        }

        // Mostrar mensaje
        function mostrarMensaje(indice) {
            if (estado.pausado) return;

            var mensajes = CONFIG.mensajesPorPerfil[estado.perfilActivo] || CONFIG.mensajesPorPerfil['default'] || [];
            if (indice >= mensajes.length) return;

            var mensaje = mensajes[indice];
            if (!mensaje) return;

            var notif = document.getElementById('dmg-notificacion') || crearNotificacion();
            var msgEl = document.getElementById('dmg-mensaje');

            msgEl.textContent = '"' + mensaje + '"';

            // Mostrar con animación
            setTimeout(function() {
                notif.classList.add('visible');
            }, 100);

            // Ocultar después de X segundos
            setTimeout(function() {
                notif.classList.remove('visible');
            }, CONFIG.duracionVisible);

            estado.mensajeActual = indice + 1;
        }

        // Programar mensajes
        function programarMensajes() {
            var mensajes = CONFIG.mensajesPorPerfil[estado.perfilActivo] || CONFIG.mensajesPorPerfil['default'] || [];

            for (var i = 0; i < Math.min(mensajes.length, CONFIG.tiempos.length); i++) {
                (function(indice) {
                    var timer = setTimeout(function() {
                        mostrarMensaje(indice);
                    }, CONFIG.tiempos[indice]);
                    estado.timers.push(timer);
                })(i);
            }
        }

        // Cerrar notificación
        function cerrar() {
            var notif = document.getElementById('dmg-notificacion');
            if (notif) {
                notif.classList.remove('visible');
            }
        }

        // Pausar/reanudar (para cuando abren el chat de Tito por ejemplo)
        function pausar() {
            estado.pausado = true;
            cerrar();
        }

        function reanudar() {
            estado.pausado = false;
        }

        // Inicializar
        function init() {
            estado.perfilActivo = obtenerPerfil();

            // No mostrar si el usuario ya tiene el chat abierto
            if (document.querySelector('.tito-chat-open')) {
                return;
            }

            programarMensajes();
        }

        // Exponer API
        window.DMG = {
            cerrar: cerrar,
            pausar: pausar,
            reanudar: reanudar,
            getPerfil: function() { return estado.perfilActivo; },
            forzarMensaje: function(i) { mostrarMensaje(i); }
        };

        // Iniciar después de que cargue la página
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(init, 2000); // Esperar 2s después de cargar
            });
        } else {
            setTimeout(init, 2000);
        }

    })();
    </script>
    <?php
}

/**
 * Generar mensajes progresivos desde los cierres existentes
 */
function duendes_generar_mensajes_desde_cierres($nombre, $cierres) {
    $mensajes = [];
    $perfiles = ['vulnerable', 'esceptico', 'impulsivo', 'racional', 'coleccionista', 'default'];

    foreach ($perfiles as $perfil) {
        // Si hay cierre para este perfil, crear variaciones
        if (isset($cierres[$perfil]) && $cierres[$perfil]) {
            $mensajes[$perfil] = duendes_crear_variaciones_mensaje($nombre, $perfil, $cierres[$perfil]);
        }
    }

    // Asegurar que siempre haya mensajes default
    if (!isset($mensajes['default']) || empty($mensajes['default'])) {
        $mensajes['default'] = duendes_mensajes_genericos($nombre);
    }

    return $mensajes;
}

/**
 * Crear 6 variaciones de mensaje para un perfil
 */
function duendes_crear_variaciones_mensaje($nombre, $perfil, $cierre_base) {
    // Mensajes base según perfil
    $templates = [
        'vulnerable' => [
            "Se que estas cansada. Por eso estoy aca.",
            "No tenes que ser fuerte todo el tiempo.",
            "Vine porque algo en vos pidio ayuda.",
            "Dejame acompanarte. No tenes que hacerlo sola.",
            "Lo que sentis es real. Yo lo veo.",
            "Cuando estes lista, aca voy a estar."
        ],
        'esceptico' => [
            "No te pido que creas. Solo que observes que sentis.",
            "Los hechos hablan: miles ya me eligieron.",
            "Analiza todo lo que quieras. Yo espero.",
            "Lo que notaste al verme, eso es real.",
            "No necesito que creas en mi. Ya se.",
            "La conexion no se explica. Se siente."
        ],
        'impulsivo' => [
            "Algo te trajo aca. No lo ignores.",
            "Este momento no se repite.",
            "Cuando algo es para vos, lo sentis. ¿Lo sentiste?",
            "No lo pienses demasiado. Confía.",
            "Yo tampoco voy a estar aca para siempre.",
            "El momento es ahora."
        ],
        'racional' => [
            "Mas de 3000 personas ya me eligieron.",
            "Cada guardian es pieza unica, verificable.",
            "La calidad se ve. La conexion se siente.",
            "Tenes 30 dias para probarlo. Sin riesgo.",
            "Lee los testimonios. Son personas reales.",
            "La decision es tuya. Los datos estan."
        ],
        'coleccionista' => [
            "Veo que ya conoces la magia de los guardianes.",
            "Los guardianes trabajan mejor en comunidad.",
            "Yo complemento lo que ya empezaste.",
            "Tu coleccion cuenta una historia. ¿Cual sigue?",
            "Entre nosotros nos potenciamos.",
            "Este vinculo completa algo."
        ],
        'default' => [
            "Algo te trajo hasta aca.",
            "Si llegaste a leer esto, no es casualidad.",
            "Yo ya te estaba esperando.",
            "Hay algo que necesitas saber.",
            "La conexion ya empezo.",
            "Solo vos sabes si es el momento."
        ]
    ];

    return isset($templates[$perfil]) ? $templates[$perfil] : $templates['default'];
}

/**
 * Mensajes genéricos por categoría
 */
function duendes_mensajes_default($nombre, $categoria) {
    $base = [
        'proteccion' => [
            "Se que cargas con mucho. Por eso estoy aca.",
            "No tenes que protegerte de todo sola.",
            "Vine a cuidarte. Dejame.",
            "Lo que te preocupa, yo lo veo.",
            "Cuando necesites fuerza, aca voy a estar.",
            "Tu paz es mi mision."
        ],
        'abundancia' => [
            "Mereces cosas buenas. Sin peros.",
            "El flujo de abundancia ya empezo.",
            "Vine a desbloquear lo que te frena.",
            "La prosperidad busca llegar a vos.",
            "Dejame ayudarte a recibir.",
            "Lo bueno esta en camino."
        ],
        'amor' => [
            "El amor que buscas ya vive en vos.",
            "Vine a recordarte lo que vales.",
            "Tu corazon sabe. Escuchalo.",
            "La conexion que necesitas empieza adentro.",
            "Dejame mostrarte lo que no estas viendo.",
            "Sos mas de lo que crees."
        ],
        'sanacion' => [
            "Las heridas sanan. Yo lo vi muchas veces.",
            "No tenes que cargar ese peso para siempre.",
            "Vine a acompanarte en el proceso.",
            "Soltar no es rendirse. Es liberarse.",
            "Tu bienestar importa.",
            "La sanacion ya empezo."
        ],
        'sabiduria' => [
            "La claridad que buscas esta mas cerca de lo que pensas.",
            "Vine a iluminar lo que no ves.",
            "Las respuestas vienen cuando estas lista.",
            "Tu intuicion sabe. Confia.",
            "Dejame guiarte.",
            "El camino se revela paso a paso."
        ]
    ];

    $mensajes_categoria = isset($base[$categoria]) ? $base[$categoria] : $base['proteccion'];

    return [
        'vulnerable' => $mensajes_categoria,
        'esceptico' => $mensajes_categoria,
        'impulsivo' => $mensajes_categoria,
        'racional' => $mensajes_categoria,
        'coleccionista' => $mensajes_categoria,
        'default' => $mensajes_categoria
    ];
}

/**
 * Mensajes genéricos de fallback
 */
function duendes_mensajes_genericos($nombre) {
    return [
        "Algo te trajo hasta aca.",
        "Si llegaste a leer esto, no es casualidad.",
        "Yo ya te estaba esperando.",
        "Hay algo que necesitas saber.",
        "La conexion ya empezo.",
        "Solo vos sabes si es el momento."
    ];
}

// ============================================
// AJAX para guardar mensajes personalizados
// ============================================

add_action('wp_ajax_duendes_guardar_mensajes_guardian', 'duendes_guardar_mensajes_guardian');
function duendes_guardar_mensajes_guardian() {
    if (!current_user_can('edit_products')) {
        wp_send_json_error('Sin permisos');
    }

    $product_id = intval($_POST['product_id']);
    $mensajes = $_POST['mensajes'];

    if ($product_id && $mensajes) {
        update_post_meta($product_id, '_duendes_mensajes_guardian', wp_json_encode($mensajes));
        wp_send_json_success('Mensajes guardados');
    }

    wp_send_json_error('Datos inválidos');
}
