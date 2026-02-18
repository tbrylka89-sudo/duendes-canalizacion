<?php
/**
 * Plugin Name: Duendes Auto-Categorizar
 * Description: Analiza historias de guardianes y asigna categorías de intención correctas
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// =============================================================================
// ENDPOINT ADMIN PARA EJECUTAR CATEGORIZACIÓN
// =============================================================================

add_action('rest_api_init', function() {
    register_rest_route('duendes/v1', '/auto-categorizar', [
        'methods' => 'POST',
        'callback' => 'duendes_ejecutar_autocategorizacion',
        'permission_callback' => function() {
            return current_user_can('manage_woocommerce');
        }
    ]);

    register_rest_route('duendes/v1', '/preview-categorias', [
        'methods' => 'GET',
        'callback' => 'duendes_preview_categorizacion',
        'permission_callback' => function() {
            return current_user_can('manage_woocommerce');
        }
    ]);
});

// =============================================================================
// KEYWORDS POR INTENCIÓN
// =============================================================================

function duendes_get_keywords_intencion() {
    return [
        'proteccion' => [
            'keywords' => [
                'proteg', 'escudo', 'defensa', 'amparo', 'cuidar', 'guardian', 'vigila',
                'segur', 'resguard', 'blindaje', 'barrera', 'fortaleza', 'refugio',
                'salva', 'cuida', 'vela por', 'preserv', 'inmune', 'invulnerable',
                'energías negativas', 'malas energías', 'envidia', 'mal de ojo',
                'carga', 'absorbe', 'limpia', 'purifica', 'negatividad', 'toxicidad',
                'escuda', 'campo protector', 'aura', 'blindar'
            ],
            'slug' => 'proteccion',
            'nombre' => 'Protección'
        ],
        'amor' => [
            'keywords' => [
                'amor', 'corazón', 'corazon', 'afecto', 'cariño', 'ternura', 'romance',
                'pareja', 'relacion', 'vínculo', 'conexión', 'sentimental', 'enamorar',
                'alma gemela', 'encontrar el amor', 'abrirse al amor', 'sanar el corazón',
                'perdona', 'autoestima', 'quererse', 'amarse', 'merecimiento',
                'soledad', 'acompañ', 'calidez', 'dulzura', 'bondad', 'compasión',
                'familia', 'hijos', 'maternidad', 'paternidad'
            ],
            'slug' => 'amor',
            'nombre' => 'Amor'
        ],
        'abundancia' => [
            'keywords' => [
                'abundancia', 'dinero', 'prosperidad', 'riqueza', 'fortuna', 'éxito',
                'negocio', 'trabajo', 'empleo', 'carrera', 'profesional', 'empresa',
                'finanz', 'económic', 'monetar', 'ganar', 'ingreso', 'sueldo',
                'oportunidad', 'suerte', 'fortuna', 'lotería', 'premio',
                'desbloque', 'flujo', 'recibir', 'merecer', 'atraer', 'manifestar',
                'proyecto', 'emprend', 'invertir', 'ahorro', 'patrimonio',
                'bloqueo económico', 'deudas', 'escasez'
            ],
            'slug' => 'dinero-abundancia-negocios',
            'nombre' => 'Abundancia'
        ],
        'salud' => [
            'keywords' => [
                'salud', 'sanar', 'sanación', 'curar', 'curación', 'enferm', 'dolor',
                'bienestar', 'vitalidad', 'energía vital', 'fuerza', 'recuper',
                'físic', 'cuerpo', 'mente', 'equilibrio', 'armonía', 'paz interior',
                'ansiedad', 'estrés', 'depresión', 'tristeza', 'angustia', 'miedo',
                'trauma', 'herida', 'soltar', 'liberar', 'transformar', 'renacer',
                'descanso', 'sueño', 'dormir', 'insomnio', 'pesadilla',
                'adicción', 'hábito', 'vicio', 'sanarse'
            ],
            'slug' => 'salud',
            'nombre' => 'Sanación'
        ],
        'sabiduria' => [
            'keywords' => [
                'sabiduría', 'sabiduria', 'conocimiento', 'claridad', 'guía', 'guia',
                'intuición', 'intuicion', 'visión', 'percepción', 'entendimiento',
                'decisión', 'decision', 'camino', 'dirección', 'rumbo', 'propósito',
                'confusión', 'confusion', 'duda', 'incertidumbre', 'perdid',
                'respuesta', 'señal', 'mensaje', 'revelación', 'iluminación',
                'espiritual', 'meditación', 'consciencia', 'despertar', 'evolución',
                'estudiar', 'aprender', 'enseñar', 'maestro', 'mentor', 'consejo',
                'tercerojo', 'tercer ojo', 'clarividencia', 'sueños', 'visiones'
            ],
            'slug' => 'sabiduria-guia-claridad',
            'nombre' => 'Sabiduría'
        ]
    ];
}

// =============================================================================
// ANALIZAR TEXTO Y DETERMINAR INTENCIÓN
// =============================================================================

function duendes_analizar_intencion($texto) {
    $texto = strtolower($texto);
    $texto = preg_replace('/[áàäâ]/u', 'a', $texto);
    $texto = preg_replace('/[éèëê]/u', 'e', $texto);
    $texto = preg_replace('/[íìïî]/u', 'i', $texto);
    $texto = preg_replace('/[óòöô]/u', 'o', $texto);
    $texto = preg_replace('/[úùüû]/u', 'u', $texto);
    $texto = preg_replace('/ñ/u', 'n', $texto);

    $intenciones = duendes_get_keywords_intencion();
    $scores = [];

    foreach ($intenciones as $key => $data) {
        $score = 0;
        foreach ($data['keywords'] as $keyword) {
            $keyword = strtolower($keyword);
            $keyword = preg_replace('/[áàäâ]/u', 'a', $keyword);
            $keyword = preg_replace('/[éèëê]/u', 'e', $keyword);
            $keyword = preg_replace('/[íìïî]/u', 'i', $keyword);
            $keyword = preg_replace('/[óòöô]/u', 'o', $keyword);
            $keyword = preg_replace('/[úùüû]/u', 'u', $keyword);
            $keyword = preg_replace('/ñ/u', 'n', $keyword);

            // Contar ocurrencias
            $count = substr_count($texto, $keyword);
            if ($count > 0) {
                // Palabras más largas tienen más peso
                $weight = strlen($keyword) > 6 ? 2 : 1;
                $score += $count * $weight;
            }
        }
        $scores[$key] = $score;
    }

    // Ordenar por score
    arsort($scores);

    // Obtener la intención con mayor score
    $mejor_intencion = key($scores);
    $mejor_score = current($scores);

    // Si el score es muy bajo, podría ser protección por defecto
    if ($mejor_score < 3) {
        return [
            'intencion' => 'proteccion',
            'slug' => 'proteccion',
            'score' => $mejor_score,
            'confianza' => 'baja',
            'scores' => $scores
        ];
    }

    return [
        'intencion' => $mejor_intencion,
        'slug' => $intenciones[$mejor_intencion]['slug'],
        'nombre' => $intenciones[$mejor_intencion]['nombre'],
        'score' => $mejor_score,
        'confianza' => $mejor_score >= 10 ? 'alta' : ($mejor_score >= 5 ? 'media' : 'baja'),
        'scores' => $scores
    ];
}

// =============================================================================
// PREVIEW - VER QUÉ CAMBIARÍA
// =============================================================================

function duendes_preview_categorizacion() {
    $productos = wc_get_products([
        'status' => 'publish',
        'limit' => -1,
    ]);

    $resultados = [];
    $cambios_propuestos = 0;

    $intenciones_slugs = ['proteccion', 'amor', 'dinero-abundancia-negocios', 'salud', 'sabiduria-guia-claridad'];

    foreach ($productos as $producto) {
        $id = $producto->get_id();
        $nombre = $producto->get_name();
        $descripcion = $producto->get_description();
        $short_desc = $producto->get_short_description();

        // Texto completo para analizar
        $texto_completo = $nombre . ' ' . $descripcion . ' ' . $short_desc;

        // Obtener categorías actuales
        $cats_actuales = wp_get_post_terms($id, 'product_cat', ['fields' => 'slugs']);
        $intencion_actual = null;

        foreach ($cats_actuales as $cat) {
            if (in_array($cat, $intenciones_slugs)) {
                $intencion_actual = $cat;
                break;
            }
        }

        // Analizar
        $analisis = duendes_analizar_intencion($texto_completo);

        $necesita_cambio = $intencion_actual !== $analisis['slug'];

        if ($necesita_cambio) {
            $cambios_propuestos++;
        }

        $resultados[] = [
            'id' => $id,
            'nombre' => $nombre,
            'intencion_actual' => $intencion_actual ?: 'SIN CATEGORÍA',
            'intencion_sugerida' => $analisis['slug'],
            'nombre_sugerido' => $analisis['nombre'],
            'score' => $analisis['score'],
            'confianza' => $analisis['confianza'],
            'necesita_cambio' => $necesita_cambio,
            'scores_detalle' => $analisis['scores'],
            'url' => get_permalink($id)
        ];
    }

    // Ordenar por los que necesitan cambio primero
    usort($resultados, function($a, $b) {
        if ($a['necesita_cambio'] === $b['necesita_cambio']) {
            return $b['score'] - $a['score'];
        }
        return $b['necesita_cambio'] - $a['necesita_cambio'];
    });

    return [
        'total_productos' => count($productos),
        'cambios_propuestos' => $cambios_propuestos,
        'productos' => $resultados
    ];
}

// =============================================================================
// EJECUTAR CATEGORIZACIÓN
// =============================================================================

function duendes_ejecutar_autocategorizacion($request) {
    $solo_sin_categoria = $request->get_param('solo_sin_categoria') ?? false;
    $aplicar_cambios = $request->get_param('aplicar') ?? false;

    $productos = wc_get_products([
        'status' => 'publish',
        'limit' => -1,
    ]);

    $intenciones_slugs = ['proteccion', 'amor', 'dinero-abundancia-negocios', 'salud', 'sabiduria-guia-claridad'];
    $cambios = [];

    foreach ($productos as $producto) {
        $id = $producto->get_id();
        $nombre = $producto->get_name();
        $descripcion = $producto->get_description();
        $short_desc = $producto->get_short_description();

        // Texto completo para analizar
        $texto_completo = $nombre . ' ' . $descripcion . ' ' . $short_desc;

        // Obtener categorías actuales
        $cats_actuales = wp_get_post_terms($id, 'product_cat', ['fields' => 'all']);
        $intencion_actual = null;
        $otras_cats = [];

        foreach ($cats_actuales as $cat) {
            if (in_array($cat->slug, $intenciones_slugs)) {
                $intencion_actual = $cat->slug;
            } else {
                $otras_cats[] = $cat->term_id;
            }
        }

        // Si solo procesamos sin categoría y ya tiene una, saltar
        if ($solo_sin_categoria && $intencion_actual) {
            continue;
        }

        // Analizar
        $analisis = duendes_analizar_intencion($texto_completo);

        // Si la categoría sugerida es diferente a la actual
        if ($intencion_actual !== $analisis['slug']) {
            $cambio = [
                'id' => $id,
                'nombre' => $nombre,
                'anterior' => $intencion_actual ?: 'ninguna',
                'nueva' => $analisis['slug'],
                'score' => $analisis['score'],
                'confianza' => $analisis['confianza']
            ];

            if ($aplicar_cambios) {
                // Obtener term_id de la nueva categoría
                $nueva_cat = get_term_by('slug', $analisis['slug'], 'product_cat');

                if ($nueva_cat) {
                    // Agregar nueva categoría manteniendo las otras
                    $otras_cats[] = $nueva_cat->term_id;
                    wp_set_post_terms($id, $otras_cats, 'product_cat');
                    $cambio['aplicado'] = true;
                } else {
                    $cambio['aplicado'] = false;
                    $cambio['error'] = 'Categoría no encontrada: ' . $analisis['slug'];
                }
            }

            $cambios[] = $cambio;
        }
    }

    return [
        'total_productos' => count($productos),
        'cambios' => count($cambios),
        'aplicados' => $aplicar_cambios,
        'detalle' => $cambios
    ];
}

// =============================================================================
// PÁGINA ADMIN PARA VER Y EJECUTAR
// =============================================================================

add_action('admin_menu', function() {
    add_submenu_page(
        'woocommerce',
        'Auto-Categorizar Guardianes',
        'Auto-Categorizar',
        'manage_woocommerce',
        'duendes-auto-categorizar',
        'duendes_admin_page_categorizar'
    );
});

function duendes_admin_page_categorizar() {
    ?>
    <div class="wrap">
        <h1>Auto-Categorizar Guardianes</h1>
        <p>Este sistema analiza las historias de cada guardián y sugiere la categoría de intención correcta.</p>

        <div style="margin:20px 0;padding:20px;background:#fff;border:1px solid #ccc;">
            <h2>Acciones</h2>
            <p>
                <a href="<?php echo rest_url('duendes/v1/preview-categorias'); ?>" target="_blank" class="button">
                    Ver Preview (JSON)
                </a>
                <button id="btn-aplicar" class="button button-primary" style="margin-left:10px;">
                    Aplicar Cambios
                </button>
            </p>
            <div id="resultado" style="margin-top:20px;"></div>
        </div>

        <script>
        document.getElementById('btn-aplicar').addEventListener('click', function() {
            if (!confirm('¿Estás seguro de aplicar la categorización automática a todos los productos?')) return;

            var btn = this;
            btn.disabled = true;
            btn.textContent = 'Procesando...';

            fetch('<?php echo rest_url('duendes/v1/auto-categorizar'); ?>', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': '<?php echo wp_create_nonce('wp_rest'); ?>'
                },
                body: JSON.stringify({aplicar: true})
            })
            .then(r => r.json())
            .then(data => {
                document.getElementById('resultado').innerHTML =
                    '<div style="padding:15px;background:#d4edda;border:1px solid #c3e6cb;border-radius:4px;">' +
                    '<strong>Completado!</strong><br>' +
                    'Total productos: ' + data.total_productos + '<br>' +
                    'Cambios aplicados: ' + data.cambios +
                    '</div>';
                btn.disabled = false;
                btn.textContent = 'Aplicar Cambios';
            })
            .catch(err => {
                document.getElementById('resultado').innerHTML =
                    '<div style="padding:15px;background:#f8d7da;border:1px solid #f5c6cb;border-radius:4px;">' +
                    'Error: ' + err.message +
                    '</div>';
                btn.disabled = false;
                btn.textContent = 'Aplicar Cambios';
            });
        });
        </script>
    </div>
    <?php
}
