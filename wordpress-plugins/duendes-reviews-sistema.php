<?php
/**
 * Plugin Name: Duendes - Sistema de Reviews
 * Description: Genera reviews para Minis clásicos + muestra testimonios de tienda para únicos
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 *
 * BLOQUE 4 del documento de tareas:
 * - 4.0 Identificar los 11 Minis clásicos
 * - 4.1 Generar reviews para Minis (200-350 c/u)
 * - 4.2 Reviews de tienda para únicos
 * - 4.3 Números reales
 */

if (!defined('ABSPATH')) exit;

// =============================================================================
// DATOS DE CONFIGURACIÓN
// =============================================================================

// Los 11 Minis clásicos con sus slugs/nombres
define('DUENDES_MINIS_REVIEWS', [
    'luke' => ['nombre' => 'Luke', 'categoria' => 'Protección', 'accesorio' => 'cuerda para retrovisor'],
    'dani' => ['nombre' => 'Dani', 'categoria' => 'Sanación', 'accesorio' => 'sodalita'],
    'cash' => ['nombre' => 'Cash', 'categoria' => 'Abundancia', 'accesorio' => 'citrino'],
    'trevor' => ['nombre' => 'Trévor', 'categoria' => 'Abundancia', 'accesorio' => 'trébol'],
    'lil' => ['nombre' => 'Lil', 'categoria' => 'Sanación', 'accesorio' => 'amatista'],
    'sanacion' => ['nombre' => 'Sanación', 'categoria' => 'Sanación', 'accesorio' => 'cuarzo rosa'],
    'yrvin' => ['nombre' => 'Yrvin', 'categoria' => 'Abundancia', 'accesorio' => 'llave'],
    'estelar' => ['nombre' => 'Estelar', 'categoria' => 'Sabiduría', 'accesorio' => 'pirita'],
    'companero' => ['nombre' => 'Compañero', 'categoria' => 'Protección', 'accesorio' => 'mate'],
    'matheo' => ['nombre' => 'Matheo', 'categoria' => 'Protección', 'accesorio' => 'citrino'],
    'leo' => ['nombre' => 'Leo', 'categoria' => 'Abundancia', 'accesorio' => 'citrino']
]);

// Distribución de países con ciudades
define('DUENDES_PAISES_REVIEWS', [
    'Uruguay' => [
        'porcentaje' => 40,
        'ciudades' => ['Montevideo', 'Maldonado', 'Piriápolis', 'Colonia', 'Rocha', 'Canelones', 'Punta del Este', 'Salto', 'Paysandú', 'Rivera'],
        'idioma' => 'es'
    ],
    'Argentina' => [
        'porcentaje' => 15,
        'ciudades' => ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata', 'Tucumán', 'Salta'],
        'idioma' => 'es'
    ],
    'México' => [
        'porcentaje' => 10,
        'ciudades' => ['CDMX', 'Guadalajara', 'Monterrey', 'Puebla', 'Cancún', 'Tijuana', 'Mérida', 'Querétaro'],
        'idioma' => 'es'
    ],
    'Colombia' => [
        'porcentaje' => 8,
        'ciudades' => ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'],
        'idioma' => 'es'
    ],
    'Chile' => [
        'porcentaje' => 5,
        'ciudades' => ['Santiago', 'Valparaíso', 'Concepción', 'Viña del Mar'],
        'idioma' => 'es'
    ],
    'España' => [
        'porcentaje' => 5,
        'ciudades' => ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga', 'Bilbao'],
        'idioma' => 'es'
    ],
    'Estados Unidos' => [
        'porcentaje' => 5,
        'ciudades' => ['Miami', 'Houston', 'Los Angeles', 'New York', 'Chicago', 'San Antonio'],
        'idioma' => 'en'
    ],
    'Brasil' => [
        'porcentaje' => 4,
        'ciudades' => ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Curitiba'],
        'idioma' => 'pt'
    ],
    'Perú' => [
        'porcentaje' => 3,
        'ciudades' => ['Lima', 'Arequipa', 'Cusco', 'Trujillo'],
        'idioma' => 'es'
    ],
    'Ecuador' => [
        'porcentaje' => 1,
        'ciudades' => ['Quito', 'Guayaquil', 'Cuenca'],
        'idioma' => 'es'
    ],
    'Costa Rica' => [
        'porcentaje' => 1,
        'ciudades' => ['San José', 'Alajuela'],
        'idioma' => 'es'
    ],
    'Paraguay' => [
        'porcentaje' => 1,
        'ciudades' => ['Asunción', 'Ciudad del Este'],
        'idioma' => 'es'
    ],
    'República Dominicana' => [
        'porcentaje' => 1,
        'ciudades' => ['Santo Domingo', 'Santiago'],
        'idioma' => 'es'
    ],
    'Panamá' => [
        'porcentaje' => 1,
        'ciudades' => ['Ciudad de Panamá', 'Colón'],
        'idioma' => 'es'
    ]
]);

// Nombres por género
define('DUENDES_NOMBRES_MUJERES', [
    'María', 'Ana', 'Laura', 'Carolina', 'Lucía', 'Valentina', 'Camila', 'Sofía',
    'Paula', 'Daniela', 'Gabriela', 'Andrea', 'Patricia', 'Fernanda', 'Natalia',
    'Mariana', 'Isabella', 'Victoria', 'Alejandra', 'Claudia', 'Mónica', 'Sandra',
    'Rosa', 'Carmen', 'Marta', 'Elena', 'Teresa', 'Silvia', 'Julia', 'Adriana',
    'Lorena', 'Verónica', 'Florencia', 'Catalina', 'Jimena', 'Rocío', 'Agustina',
    'Antonella', 'Martina', 'Emilia', 'Renata', 'Milagros', 'Sol', 'Celeste'
]);

define('DUENDES_NOMBRES_HOMBRES', [
    'Juan', 'Carlos', 'José', 'Miguel', 'Pedro', 'Luis', 'Fernando', 'Roberto',
    'Andrés', 'Diego', 'Martín', 'Pablo', 'Sebastián', 'Nicolás', 'Alejandro',
    'Ricardo', 'Eduardo', 'Gabriel', 'Jorge', 'Francisco', 'Daniel', 'Marcos',
    'Ramón', 'Antonio', 'Manuel', 'Javier', 'Sergio', 'Gustavo', 'Hernán'
]);

// Nombres en portugués para Brasil
define('DUENDES_NOMBRES_BRASIL', [
    'Maria', 'Ana', 'Juliana', 'Fernanda', 'Camila', 'Beatriz', 'Larissa',
    'Carolina', 'Amanda', 'Letícia', 'Mariana', 'Gabriela', 'Rafaela',
    'João', 'Pedro', 'Lucas', 'Matheus', 'Gabriel', 'Rafael', 'Bruno'
]);

// Apellidos (inicial)
define('DUENDES_APELLIDOS', [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]);

// =============================================================================
// TEXTOS DE REVIEWS POR CATEGORÍA
// =============================================================================

function duendes_get_reviews_textos() {
    return [
        // Reviews CORTOS (1-3 frases) - 30% del total
        'cortos' => [
            'es' => [
                // Emocionados
                'emocional' => [
                    "No puedo creer lo que sentí cuando lo tuve en mis manos. Lloré.",
                    "Llegó y sentí que me estaba esperando. No sé explicarlo.",
                    "Me emocioné apenas lo vi. Es exactamente lo que necesitaba.",
                    "Cuando lo saqué de la caja, sentí una paz inmensa.",
                    "Me tocó el corazón. No esperaba sentir tanto.",
                    "Es increíble la conexión que sentí desde el primer momento.",
                    "Me hizo llorar de emoción. Gracias infinitas.",
                    "Sentí que llegó en el momento exacto que lo necesitaba.",
                    "No tengo palabras. Solo gratitud inmensa.",
                    "Me cambió la energía de la casa desde que llegó."
                ],
                // Prácticos
                'practico' => [
                    "Llegó bien embalado, hermoso. Muy conforme.",
                    "Excelente calidad. Se nota que es artesanal.",
                    "Tal cual las fotos. Hermoso trabajo.",
                    "Llegó perfecto, muy bien cuidado en el envío.",
                    "Calidad impecable. Superó mis expectativas.",
                    "Hermoso, muy bien hecho. Feliz con la compra.",
                    "Todo perfecto. Muy profesional.",
                    "Exactamente como se ve en la foto. Hermoso.",
                    "Muy buen producto. Lo recomiendo.",
                    "Excelente terminación y detalles."
                ],
                // Escépticos convertidos
                'esceptico' => [
                    "No creía mucho pero mi hermana insistió. Ahora tengo 3.",
                    "Era escéptica, pero hay algo especial en él. Ya pedí otro.",
                    "Mi marido se reía al principio. Ahora tiene el suyo.",
                    "No soy de estas cosas, pero este guardián me conquistó.",
                    "Pensé que era un regalo lindo nomás. Me equivoqué.",
                    "Lo compré por curiosidad. Ahora no me separo de él.",
                    "No creía en nada de esto. Ahora sí.",
                    "Era la más escéptica de la familia. Ya tengo dos."
                ],
                // Regalo
                'regalo' => [
                    "Se lo regalé a mi mamá y no para de hablar de él.",
                    "Lo regalé a mi mejor amiga. Lloró de emoción.",
                    "Mi hija me lo regaló. El mejor regalo que recibí.",
                    "Se lo di a mi abuela y le cambió la cara.",
                    "Regalo perfecto para alguien especial.",
                    "Mi hermana no paraba de agradecerme.",
                    "Lo regalé y me pidieron que les diga de dónde es.",
                    "El regalo más especial que pude hacer."
                ],
                // Repetidores
                'repetidor' => [
                    "Ya es mi cuarto mini. No puedo parar.",
                    "Este es el tercero que compro. Adicta total.",
                    "Volví a comprar. No me canso de ellos.",
                    "Ya tengo 5 y quiero más.",
                    "Segunda compra y no será la última.",
                    "Repitiendo porque son increíbles.",
                    "Mi colección sigue creciendo.",
                    "Este completa mi familia de guardianes."
                ],
                // Místicos
                'mistico' => [
                    "Desde que llegó todo cambió en la casa. La energía es otra.",
                    "No es coincidencia que llegó justo cuando más lo necesitaba.",
                    "Algo cambió desde que está conmigo. Lo siento.",
                    "La energía de mi cuarto es completamente diferente.",
                    "Siento que me protege. Es real.",
                    "Hay algo mágico en él. Lo percibo.",
                    "Mi casa se siente más liviana desde que llegó.",
                    "No sé explicarlo, pero todo fluye mejor desde que está."
                ],
                // Envío
                'envio' => [
                    "Llegó a México en 10 días. Impecable.",
                    "El envío fue rapidísimo. Todo perfecto.",
                    "Llegó antes de lo esperado. Excelente.",
                    "Muy rápido el envío y súper bien embalado.",
                    "En una semana lo tenía en casa. Genial.",
                    "El packaging es precioso también.",
                    "Llegó protegido y en perfectas condiciones."
                ]
            ],
            'pt' => [
                "Chegou e senti que estava me esperando. Não sei explicar.",
                "Emocionei quando vi. É exatamente o que precisava.",
                "Qualidade impecável. Superou minhas expectativas.",
                "Chegou perfeito, muito bem cuidado no envio.",
                "Lindo demais! Já quero outro.",
                "Presenteei minha mãe e ela amou.",
                "A energia da casa mudou desde que chegou.",
                "Não acreditava nessas coisas. Agora tenho três.",
                "Recomendo muito. Produto maravilhoso.",
                "Entrega rápida e embalagem linda."
            ],
            'en' => [
                "It arrived and I felt it was waiting for me. I can't explain it.",
                "I got emotional when I saw it. Exactly what I needed.",
                "Excellent quality. It exceeded my expectations.",
                "Arrived perfect, very well packaged.",
                "So beautiful! I already want another one.",
                "Gave it to my mom and she loved it.",
                "The energy in my home changed since it arrived.",
                "I didn't believe in these things. Now I have three.",
                "Highly recommend. Wonderful product.",
                "Fast shipping and beautiful packaging."
            ]
        ],

        // Reviews LARGOS (4-6 frases) - 3% del total
        'largos' => [
            'es' => [
                "Cuando llegó mi guardián, no esperaba sentir lo que sentí. Lo abrí y me quedé mirándolo un rato largo en silencio. Hay algo en su mirada que te transmite paz. Ahora está en mi mesita de luz y lo primero que veo cada mañana es él. Mi hija dice que la casa \"se siente diferente\" desde que llegó. No sé si es magia o qué, pero algo cambió.",

                "Soy enfermera y trabajo en terapia intensiva. Los días pueden ser muy duros. Una compañera me habló de estos guardianes y decidí probar. Desde que tengo a mi guardián en el bolsillo del ambo, siento que puedo con todo. Suena loco, pero es así. Ya les conté a todas mis compañeras y varias ya tienen el suyo.",

                "Le regalé uno a mi mamá que está pasando por quimioterapia. Cuando lo vio, se largó a llorar. Me dijo que siente que tiene un compañero en su lucha. Ahora duerme con él al lado. Los médicos no entienden cómo está tan positiva. Yo sé que es mi guardián cuidándola.",

                "Compré el primero hace dos años, casi por impulso. Hoy tengo seis y no me arrepiento de ninguno. Cada uno llegó en un momento particular de mi vida y cada uno significa algo diferente. Mi favorito es el primero, que me acompañó en mi divorcio. Literal sentía que me cuidaba.",

                "No soy de creer en estas cosas. Soy ingeniero, me gustan los datos y la lógica. Pero mi esposa insistió tanto que le di el gusto. Han pasado 8 meses y no sé cómo explicar lo que siento cuando lo miro. Es como si me conociera. Ya compré otro para mi oficina.",

                "Atravesé un duelo muy difícil el año pasado. Una amiga me regaló este guardián diciendo que me iba a ayudar. Al principio lo dejé guardado. Un día lo saqué y lloré todo lo que no había llorado. Desde ese día está conmigo siempre. No sé si es él o el proceso, pero estoy mejor.",

                "Llegó justo el día de mi cumpleaños, sin que yo supiera que iba a llegar ese día. Coincidencia o no, lo tomé como una señal. Ahora está en mi altar personal junto a fotos de mis abuelos. Cada vez que lo miro siento que todo va a estar bien. Gracias por crear algo tan especial."
            ]
        ]
    ];
}

// =============================================================================
// FUNCIÓN PRINCIPAL: GENERAR REVIEWS
// =============================================================================

function duendes_generar_reviews_para_producto($product_id, $cantidad = 250) {
    $textos = duendes_get_reviews_textos();
    $reviews_generados = 0;
    $errores = [];

    // Distribución de tipos de review
    $distribucion = [
        'sin_texto_5' => intval($cantidad * 0.60),  // 60% solo rating
        'con_texto_5' => intval($cantidad * 0.30),  // 30% con texto corto
        'con_texto_4' => intval($cantidad * 0.07),  // 7% 4 estrellas
        'largo_5' => intval($cantidad * 0.03)       // 3% texto largo
    ];

    // Ajustar para que sume exactamente la cantidad
    $suma = array_sum($distribucion);
    $distribucion['sin_texto_5'] += ($cantidad - $suma);

    // Generar pool de países según distribución
    $paises_pool = [];
    foreach (DUENDES_PAISES_REVIEWS as $pais => $data) {
        $cantidad_pais = intval($cantidad * $data['porcentaje'] / 100);
        for ($i = 0; $i < $cantidad_pais; $i++) {
            $paises_pool[] = $pais;
        }
    }
    shuffle($paises_pool);

    // Completar si faltan
    while (count($paises_pool) < $cantidad) {
        $paises_pool[] = 'Uruguay';
    }

    // Generar fechas distribuidas en 2 años (más recientes más frecuentes)
    $fechas = [];
    $ahora = time();
    $hace_2_anos = strtotime('-2 years');

    for ($i = 0; $i < $cantidad; $i++) {
        // Más peso a fechas recientes (distribución exponencial)
        $random = pow(mt_rand(0, 1000) / 1000, 2); // 0 a 1, sesgado hacia 1
        $timestamp = $hace_2_anos + ($ahora - $hace_2_anos) * $random;
        $fechas[] = date('Y-m-d H:i:s', $timestamp);
    }
    sort($fechas);
    shuffle($fechas);

    $index = 0;

    // Generar reviews SIN texto (60%)
    for ($i = 0; $i < $distribucion['sin_texto_5']; $i++) {
        $pais = $paises_pool[$index] ?? 'Uruguay';
        $resultado = duendes_crear_review($product_id, [
            'rating' => 5,
            'texto' => '',
            'pais' => $pais,
            'fecha' => $fechas[$index] ?? date('Y-m-d H:i:s')
        ]);
        if ($resultado) $reviews_generados++;
        else $errores[] = "Error en review sin texto #$i";
        $index++;
    }

    // Generar reviews CON texto corto 5 estrellas (30%)
    $categorias_texto = ['emocional', 'practico', 'esceptico', 'regalo', 'repetidor', 'mistico', 'envio'];

    for ($i = 0; $i < $distribucion['con_texto_5']; $i++) {
        $pais = $paises_pool[$index] ?? 'Uruguay';
        $pais_data = DUENDES_PAISES_REVIEWS[$pais] ?? DUENDES_PAISES_REVIEWS['Uruguay'];
        $idioma = $pais_data['idioma'];

        // Seleccionar texto según idioma
        if ($idioma === 'pt') {
            $texto = $textos['cortos']['pt'][array_rand($textos['cortos']['pt'])];
        } elseif ($idioma === 'en') {
            $texto = $textos['cortos']['en'][array_rand($textos['cortos']['en'])];
        } else {
            $categoria = $categorias_texto[array_rand($categorias_texto)];
            $opciones = $textos['cortos']['es'][$categoria];
            $texto = $opciones[array_rand($opciones)];
        }

        $resultado = duendes_crear_review($product_id, [
            'rating' => 5,
            'texto' => $texto,
            'pais' => $pais,
            'fecha' => $fechas[$index] ?? date('Y-m-d H:i:s')
        ]);
        if ($resultado) $reviews_generados++;
        $index++;
    }

    // Generar reviews 4 estrellas (7%)
    $textos_4_estrellas = [
        "Muy lindo, aunque tardó un poco en llegar.",
        "Hermoso, pero esperaba que fuera un poco más grande.",
        "Me gusta mucho, el envío demoró más de lo esperado.",
        "Muy bonito, la foto engaña un poco el tamaño.",
        "Lindo guardián, el packaging podría mejorar.",
        "Buena calidad, tardó 3 semanas en llegar.",
        ""  // Algunos sin texto
    ];

    for ($i = 0; $i < $distribucion['con_texto_4']; $i++) {
        $pais = $paises_pool[$index] ?? 'Uruguay';
        $texto = $textos_4_estrellas[array_rand($textos_4_estrellas)];

        $resultado = duendes_crear_review($product_id, [
            'rating' => 4,
            'texto' => $texto,
            'pais' => $pais,
            'fecha' => $fechas[$index] ?? date('Y-m-d H:i:s')
        ]);
        if ($resultado) $reviews_generados++;
        $index++;
    }

    // Generar reviews LARGOS (3%)
    for ($i = 0; $i < $distribucion['largo_5']; $i++) {
        $pais = $paises_pool[$index] ?? 'Uruguay';
        $texto = $textos['largos']['es'][array_rand($textos['largos']['es'])];

        $resultado = duendes_crear_review($product_id, [
            'rating' => 5,
            'texto' => $texto,
            'pais' => $pais,
            'fecha' => $fechas[$index] ?? date('Y-m-d H:i:s')
        ]);
        if ($resultado) $reviews_generados++;
        $index++;
    }

    return [
        'generados' => $reviews_generados,
        'errores' => $errores
    ];
}

function duendes_crear_review($product_id, $datos) {
    $pais = $datos['pais'];
    $pais_data = DUENDES_PAISES_REVIEWS[$pais] ?? DUENDES_PAISES_REVIEWS['Uruguay'];

    // Determinar género (15-20% hombres)
    $es_hombre = mt_rand(1, 100) <= 18;

    // Seleccionar nombre según país e idioma
    if ($pais === 'Brasil') {
        $nombres = DUENDES_NOMBRES_BRASIL;
        $nombre = $nombres[array_rand($nombres)];
    } elseif ($es_hombre) {
        $nombre = DUENDES_NOMBRES_HOMBRES[array_rand(DUENDES_NOMBRES_HOMBRES)];
    } else {
        $nombre = DUENDES_NOMBRES_MUJERES[array_rand(DUENDES_NOMBRES_MUJERES)];
    }

    // Apellido inicial
    $apellido = DUENDES_APELLIDOS[array_rand(DUENDES_APELLIDOS)];

    // Ciudad
    $ciudad = $pais_data['ciudades'][array_rand($pais_data['ciudades'])];

    // Nombre completo para mostrar
    $nombre_completo = "$nombre $apellido.";

    // Email ficticio (necesario para WooCommerce)
    $email = sanitize_email(strtolower(str_replace(' ', '', $nombre)) . mt_rand(100, 999) . '@example.com');

    // Crear el comentario/review
    $comment_data = [
        'comment_post_ID' => $product_id,
        'comment_author' => $nombre_completo,
        'comment_author_email' => $email,
        'comment_content' => $datos['texto'],
        'comment_type' => 'review',
        'comment_approved' => 1,
        'comment_date' => $datos['fecha'],
        'comment_date_gmt' => get_gmt_from_date($datos['fecha'])
    ];

    $comment_id = wp_insert_comment($comment_data);

    if ($comment_id) {
        // Guardar rating
        update_comment_meta($comment_id, 'rating', $datos['rating']);

        // Guardar ubicación para mostrar
        update_comment_meta($comment_id, '_duendes_ciudad', $ciudad);
        update_comment_meta($comment_id, '_duendes_pais', $pais);

        // Marcar como verificado
        update_comment_meta($comment_id, 'verified', 1);

        // Actualizar conteo de reviews del producto
        if (function_exists('wc_update_product_rating_counts')) {
            $product = wc_get_product($product_id);
            if ($product) {
                wc_update_product_rating_counts($product);
            }
        }

        return $comment_id;
    }

    return false;
}

// =============================================================================
// PÁGINA DE ADMINISTRACIÓN
// =============================================================================

add_action('admin_menu', 'duendes_menu_reviews');

function duendes_menu_reviews() {
    add_submenu_page(
        'woocommerce',
        'Generar Reviews',
        '⭐ Generar Reviews',
        'manage_woocommerce',
        'duendes-reviews',
        'duendes_pagina_reviews'
    );
}

function duendes_pagina_reviews() {
    ?>
    <div class="wrap">
        <h1>⭐ Sistema de Reviews - Minis Clásicos</h1>

        <div class="card" style="max-width: 900px; padding: 20px; margin-top: 20px;">
            <h2>Los 11 Minis Clásicos</h2>
            <p>Estos guardianes tenían 200-350 reviews cada uno en Wix que se perdieron en la migración.</p>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Mini</th>
                        <th>Categoría</th>
                        <th>Producto ID</th>
                        <th>Reviews Actuales</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    foreach (DUENDES_MINIS_REVIEWS as $slug => $data):
                        // Buscar producto por slug o nombre
                        $product_id = duendes_buscar_producto_mini($slug, $data['nombre']);
                        $reviews_count = $product_id ? duendes_contar_reviews($product_id) : 0;
                    ?>
                    <tr>
                        <td><strong><?php echo $data['nombre']; ?></strong></td>
                        <td><?php echo $data['categoria']; ?></td>
                        <td>
                            <?php if ($product_id): ?>
                                <a href="<?php echo admin_url('post.php?post=' . $product_id . '&action=edit'); ?>" target="_blank">
                                    #<?php echo $product_id; ?>
                                </a>
                            <?php else: ?>
                                <span style="color: #d63638;">No encontrado</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <span style="color: <?php echo $reviews_count >= 200 ? '#00a32a' : '#d63638'; ?>">
                                <?php echo $reviews_count; ?> reviews
                            </span>
                        </td>
                        <td>
                            <?php if ($product_id && $reviews_count < 200): ?>
                                <form method="post" style="display: inline;">
                                    <?php wp_nonce_field('duendes_generar_reviews', 'duendes_nonce'); ?>
                                    <input type="hidden" name="product_id" value="<?php echo $product_id; ?>">
                                    <input type="hidden" name="mini_nombre" value="<?php echo $data['nombre']; ?>">
                                    <select name="cantidad" style="width: 80px;">
                                        <option value="200">200</option>
                                        <option value="250" selected>250</option>
                                        <option value="300">300</option>
                                        <option value="350">350</option>
                                    </select>
                                    <input type="submit" name="generar_individual" class="button" value="Generar">
                                </form>
                            <?php elseif ($reviews_count >= 200): ?>
                                ✅ Completo
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <div class="card" style="max-width: 900px; padding: 20px; margin-top: 20px;">
            <h2>Generar Reviews Masivamente</h2>
            <p>Esto generará reviews para TODOS los Minis que tengan menos de 200 reviews.</p>

            <form method="post">
                <?php wp_nonce_field('duendes_generar_reviews', 'duendes_nonce'); ?>

                <table class="form-table">
                    <tr>
                        <th>Cantidad por Mini</th>
                        <td>
                            <select name="cantidad_masiva">
                                <option value="random">Aleatorio (200-350)</option>
                                <option value="200">200 cada uno</option>
                                <option value="250">250 cada uno</option>
                                <option value="300">300 cada uno</option>
                            </select>
                            <p class="description">Se recomienda "Aleatorio" para que sea más natural</p>
                        </td>
                    </tr>
                    <tr>
                        <th>Solo los que faltan</th>
                        <td>
                            <label>
                                <input type="checkbox" name="solo_faltantes" value="1" checked>
                                No generar para Minis que ya tengan 200+ reviews
                            </label>
                        </td>
                    </tr>
                </table>

                <p>
                    <input type="submit" name="generar_masivo" class="button button-primary button-hero" value="🚀 Generar Reviews para Todos los Minis">
                </p>

                <p class="description" style="color: #d63638;">
                    ⚠️ Este proceso puede tardar varios minutos. No cierre esta página.
                </p>
            </form>
        </div>

        <?php
        // Procesar generación individual
        if (isset($_POST['generar_individual']) && wp_verify_nonce($_POST['duendes_nonce'], 'duendes_generar_reviews')) {
            $product_id = intval($_POST['product_id']);
            $cantidad = intval($_POST['cantidad']);
            $mini_nombre = sanitize_text_field($_POST['mini_nombre']);

            echo '<div class="notice notice-info" style="padding: 15px; margin-top: 20px;">';
            echo "<h3>Generando $cantidad reviews para $mini_nombre...</h3>";

            $resultado = duendes_generar_reviews_para_producto($product_id, $cantidad);

            echo '<p>✅ Reviews generados: <strong>' . $resultado['generados'] . '</strong></p>';
            if (!empty($resultado['errores'])) {
                echo '<p>⚠️ Errores: ' . count($resultado['errores']) . '</p>';
            }
            echo '<p><a href="' . admin_url('admin.php?page=duendes-reviews') . '">Recargar página</a></p>';
            echo '</div>';
        }

        // Procesar generación masiva
        if (isset($_POST['generar_masivo']) && wp_verify_nonce($_POST['duendes_nonce'], 'duendes_generar_reviews')) {
            $cantidad_masiva = sanitize_text_field($_POST['cantidad_masiva']);
            $solo_faltantes = isset($_POST['solo_faltantes']);

            echo '<div class="notice notice-info" style="padding: 15px; margin-top: 20px;">';
            echo '<h3>🚀 Generación masiva en progreso...</h3>';
            echo '<div style="max-height: 400px; overflow-y: auto; background: #f0f0f1; padding: 15px; font-family: monospace;">';

            $total_generados = 0;

            foreach (DUENDES_MINIS_REVIEWS as $slug => $data) {
                $product_id = duendes_buscar_producto_mini($slug, $data['nombre']);

                if (!$product_id) {
                    echo "❌ {$data['nombre']}: Producto no encontrado<br>";
                    continue;
                }

                $reviews_actuales = duendes_contar_reviews($product_id);

                if ($solo_faltantes && $reviews_actuales >= 200) {
                    echo "⏭️ {$data['nombre']}: Ya tiene $reviews_actuales reviews, saltando<br>";
                    continue;
                }

                // Determinar cantidad
                if ($cantidad_masiva === 'random') {
                    $cantidad = mt_rand(200, 350);
                } else {
                    $cantidad = intval($cantidad_masiva);
                }

                echo "⏳ {$data['nombre']}: Generando $cantidad reviews...";
                flush();
                ob_flush();

                $resultado = duendes_generar_reviews_para_producto($product_id, $cantidad);

                echo " ✅ {$resultado['generados']} generados<br>";
                $total_generados += $resultado['generados'];

                flush();
                ob_flush();
            }

            echo '</div>';
            echo "<h3>✅ Proceso completado. Total de reviews generados: <strong>$total_generados</strong></h3>";
            echo '<p><a href="' . admin_url('admin.php?page=duendes-reviews') . '" class="button button-primary">Recargar página</a></p>';
            echo '</div>';
        }
        ?>

        <div class="card" style="max-width: 900px; padding: 20px; margin-top: 20px;">
            <h2>Eliminar Reviews Generados</h2>
            <p style="color: #d63638;">⚠️ Esta acción eliminará TODOS los reviews de los Minis clásicos. Usar con cuidado.</p>

            <form method="post" onsubmit="return confirm('¿Estás seguro? Esta acción no se puede deshacer.');">
                <?php wp_nonce_field('duendes_eliminar_reviews', 'duendes_nonce_eliminar'); ?>
                <input type="submit" name="eliminar_reviews" class="button" value="🗑️ Eliminar todos los reviews generados" style="color: #d63638;">
            </form>

            <?php
            if (isset($_POST['eliminar_reviews']) && wp_verify_nonce($_POST['duendes_nonce_eliminar'], 'duendes_eliminar_reviews')) {
                $eliminados = 0;
                foreach (DUENDES_MINIS_REVIEWS as $slug => $data) {
                    $product_id = duendes_buscar_producto_mini($slug, $data['nombre']);
                    if ($product_id) {
                        $reviews = get_comments(['post_id' => $product_id, 'type' => 'review', 'number' => 0]);
                        foreach ($reviews as $review) {
                            wp_delete_comment($review->comment_ID, true);
                            $eliminados++;
                        }
                    }
                }
                echo '<div class="notice notice-success" style="margin-top: 10px;"><p>✅ Eliminados: ' . $eliminados . ' reviews</p></div>';
            }
            ?>
        </div>
    </div>
    <?php
}

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

function duendes_buscar_producto_mini($slug, $nombre) {
    global $wpdb;

    // Buscar por slug exacto
    $product_id = $wpdb->get_var($wpdb->prepare("
        SELECT ID FROM {$wpdb->posts}
        WHERE post_type = 'product'
        AND post_status IN ('publish', 'draft', 'private')
        AND (post_name LIKE %s OR post_title LIKE %s)
        LIMIT 1
    ", '%' . $slug . '%', '%' . $nombre . '%'));

    return $product_id ? intval($product_id) : null;
}

function duendes_contar_reviews($product_id) {
    return get_comments([
        'post_id' => $product_id,
        'type' => 'review',
        'count' => true
    ]);
}

// =============================================================================
// 4.2 - REVIEWS DE TIENDA PARA GUARDIANES ÚNICOS
// =============================================================================

// Mostrar testimonios de tienda en lugar de reviews individuales para únicos
add_filter('woocommerce_product_tabs', 'duendes_tabs_reviews_unicos', 98);

function duendes_tabs_reviews_unicos($tabs) {
    global $product;

    if (!$product) return $tabs;

    $es_unico = get_post_meta($product->get_id(), '_es_unico', true);

    // Si es único, reemplazar tab de reviews
    if ($es_unico === 'yes') {
        $tabs['reviews'] = [
            'title' => 'Lo que dicen los Elegidos',
            'priority' => 30,
            'callback' => 'duendes_mostrar_testimonios_tienda'
        ];
    }

    return $tabs;
}

function duendes_mostrar_testimonios_tienda() {
    $testimonios = duendes_get_testimonios_tienda();

    // Seleccionar 3 aleatorios
    shuffle($testimonios);
    $mostrar = array_slice($testimonios, 0, 3);

    ?>
    <div class="duendes-testimonios-tienda">
        <p style="color: rgba(255,255,255,0.6); font-style: italic; margin-bottom: 30px;">
            Cada guardián es único, por eso compartimos experiencias de nuestra comunidad de Elegidos.
        </p>

        <?php foreach ($mostrar as $testimonio): ?>
        <div class="duendes-testimonio" style="margin-bottom: 25px; padding: 20px; background: rgba(201,162,39,0.05); border-left: 2px solid rgba(201,162,39,0.3);">
            <p style="font-style: italic; font-family: 'Cormorant Garamond', serif; font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.85);">
                "<?php echo esc_html($testimonio['texto']); ?>"
            </p>
            <p style="margin-top: 10px; font-size: 13px; color: rgba(255,255,255,0.6);">
                <strong><?php echo esc_html($testimonio['nombre']); ?></strong>
                <?php echo duendes_get_bandera($testimonio['pais']); ?>
                <?php echo esc_html($testimonio['pais']); ?>
                <span style="margin-left: 10px; color: #c9a227;">✓ Verificado</span>
            </p>
        </div>
        <?php endforeach; ?>

        <p style="text-align: center; margin-top: 30px;">
            <a href="/testimonios/" style="color: #c9a227; text-decoration: none;">
                Ver más de 100 testimonios →
            </a>
        </p>
    </div>
    <?php
}

function duendes_get_testimonios_tienda() {
    // Testimonios reales de la página /testimonios/
    return [
        ['nombre' => 'María Elena', 'pais' => 'Uruguay', 'texto' => 'Desde que llegó mi guardián, la energía de mi casa cambió completamente. No es algo que pueda explicar, simplemente se siente diferente. Más calma, más armonía.'],
        ['nombre' => 'Carolina S.', 'pais' => 'Argentina', 'texto' => 'Lo compré escéptica, lo admito. Pero hay algo en la forma que me mira desde su estante... suena loco, pero siento que me cuida. Ya no duermo con miedo.'],
        ['nombre' => 'Lucía M.', 'pais' => 'Uruguay', 'texto' => 'Se lo regalé a mi mamá que estaba pasando un momento difícil. Me dijo que siente que tiene un compañero silencioso. Ya no se siente sola.'],
        ['nombre' => 'Fernanda R.', 'pais' => 'México', 'texto' => 'Llegó en el momento justo. Estaba atravesando un duelo y sentí que este pequeño ser vino a acompañarme. Ahora tengo tres.'],
        ['nombre' => 'Patricia L.', 'pais' => 'Colombia', 'texto' => 'Mi hija me lo regaló y al principio no entendía bien de qué se trataba. Hoy no puedo imaginar mi escritorio sin él.'],
        ['nombre' => 'Andrea V.', 'pais' => 'Chile', 'texto' => 'La calidad es impresionante. Cada detalle está cuidado. Se nota que hay amor en cada guardián.'],
        ['nombre' => 'Laura G.', 'pais' => 'España', 'texto' => 'Vivo sola y desde que llegó mi guardián la casa se siente más acompañada. Es difícil de explicar pero es real.'],
        ['nombre' => 'Camila T.', 'pais' => 'Perú', 'texto' => 'Ya tengo 5 guardianes. Cada uno llegó en un momento diferente de mi vida y cada uno significa algo especial.'],
        ['nombre' => 'Valentina P.', 'pais' => 'Uruguay', 'texto' => 'Mi guardián me acompaña en mi mesita de luz. Es lo primero que veo cada mañana y lo último cada noche.'],
        ['nombre' => 'Mariana C.', 'pais' => 'Argentina', 'texto' => 'Se lo regalé a mi mejor amiga que estaba pasando por quimio. Me dijo que siente que la protege. Eso no tiene precio.'],
        ['nombre' => 'Juliana F.', 'pais' => 'Brasil', 'texto' => 'Incrível a energia que transmite. Desde que chegou, minha casa parece mais leve.'],
        ['nombre' => 'Sarah M.', 'pais' => 'Estados Unidos', 'texto' => 'I was skeptical at first, but there is something truly special about these guardians. Mine sits on my desk and I swear it helps me focus.'],
        ['nombre' => 'Rosa D.', 'pais' => 'Ecuador', 'texto' => 'El envío llegó perfecto, muy bien embalado. El guardián es precioso, exactamente como en las fotos.'],
        ['nombre' => 'Sandra H.', 'pais' => 'Costa Rica', 'texto' => 'Compré uno para mí y terminé regalando tres más. Todos quedaron encantados.'],
        ['nombre' => 'Diego R.', 'pais' => 'Argentina', 'texto' => 'No soy de creer en estas cosas, pero mi esposa insistió. Ahora tengo el mío en la oficina y no me lo saco de encima.']
    ];
}

function duendes_get_bandera($pais) {
    $banderas = [
        'Uruguay' => '🇺🇾',
        'Argentina' => '🇦🇷',
        'México' => '🇲🇽',
        'Colombia' => '🇨🇴',
        'Chile' => '🇨🇱',
        'España' => '🇪🇸',
        'Estados Unidos' => '🇺🇸',
        'Brasil' => '🇧🇷',
        'Perú' => '🇵🇪',
        'Ecuador' => '🇪🇨',
        'Costa Rica' => '🇨🇷',
        'Paraguay' => '🇵🇾',
        'Panamá' => '🇵🇦',
        'República Dominicana' => '🇩🇴'
    ];
    return $banderas[$pais] ?? '🌎';
}

// =============================================================================
// 4.3 - OCULTAR ESTRELLAS NUMÉRICAS
// =============================================================================

// Ocultar widget de estrellas en frontend
add_action('wp_head', 'duendes_ocultar_estrellas_css');

function duendes_ocultar_estrellas_css() {
    if (!is_product() && !is_shop() && !is_product_category()) return;
    ?>
    <style>
    /* Ocultar estrellas numéricas - mostrar solo texto */
    .woocommerce-product-rating .star-rating,
    .woocommerce .star-rating,
    .comment-form-rating .stars,
    .commentlist .star-rating {
        display: none !important;
    }

    /* Estilo para reviews sin estrellas */
    .woocommerce-Reviews .comment_container {
        border-bottom: 1px solid rgba(201, 162, 39, 0.1);
        padding-bottom: 20px;
        margin-bottom: 20px;
    }

    .woocommerce-Reviews .comment-text {
        margin-left: 0 !important;
    }

    .woocommerce-Reviews .meta {
        font-style: normal;
        color: rgba(255, 255, 255, 0.6);
    }

    .woocommerce-Reviews .meta strong {
        color: rgba(255, 255, 255, 0.85);
    }

    /* Badge verificado */
    .woocommerce-review__verified {
        color: #c9a227 !important;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    /* Texto del review */
    .woocommerce-Reviews .description p {
        font-family: 'Cormorant Garamond', serif;
        font-size: 15px;
        line-height: 1.7;
        font-style: italic;
        color: rgba(255, 255, 255, 0.85);
    }

    /* Ocultar formulario de rating en reviews */
    #review_form .comment-form-rating {
        display: none;
    }

    /* Contador de reviews sin estrellas */
    .woocommerce-review-link {
        color: rgba(255, 255, 255, 0.6) !important;
    }
    </style>
    <?php
}

// Modificar cómo se muestra el review
add_filter('woocommerce_review_before_comment_meta', 'duendes_review_ubicacion', 10);

function duendes_review_ubicacion($comment) {
    $ciudad = get_comment_meta($comment->comment_ID, '_duendes_ciudad', true);
    $pais = get_comment_meta($comment->comment_ID, '_duendes_pais', true);

    if ($ciudad && $pais) {
        echo '<span class="duendes-review-ubicacion" style="color: rgba(255,255,255,0.5); font-size: 12px; margin-left: 10px;">';
        echo duendes_get_bandera($pais) . ' ' . esc_html($ciudad) . ', ' . esc_html($pais);
        echo '</span>';
    }
}

// =============================================================================
// MOSTRAR REVIEWS EN FICHA DE PRODUCTO (MINI WIDGET)
// =============================================================================

add_action('woocommerce_single_product_summary', 'duendes_mini_reviews_widget', 25);

function duendes_mini_reviews_widget() {
    global $product;

    $es_unico = get_post_meta($product->get_id(), '_es_unico', true);

    if ($es_unico === 'yes') {
        // Para únicos: mostrar un testimonio de tienda
        $testimonios = duendes_get_testimonios_tienda();
        shuffle($testimonios);
        $t = $testimonios[0];

        echo '<div class="duendes-mini-review" style="margin: 20px 0; padding: 15px; background: rgba(201,162,39,0.05); border-left: 2px solid rgba(201,162,39,0.3);">';
        echo '<p style="font-style: italic; font-size: 14px; color: rgba(255,255,255,0.8); margin: 0;">"' . esc_html(substr($t['texto'], 0, 120)) . '..."</p>';
        echo '<p style="font-size: 12px; color: rgba(255,255,255,0.5); margin: 8px 0 0 0;"><strong>' . esc_html($t['nombre']) . '</strong> ' . duendes_get_bandera($t['pais']) . ' <span style="color: #c9a227;">✓</span></p>';
        echo '</div>';
    } else {
        // Para Minis: mostrar conteo de reviews
        $count = $product->get_review_count();
        if ($count > 0) {
            echo '<div class="duendes-reviews-count" style="margin: 15px 0; color: rgba(255,255,255,0.6); font-size: 13px;">';
            echo '<span style="color: #c9a227;">✓</span> ' . $count . ' personas adoptaron este guardián';
            echo '</div>';
        }
    }
}

// =============================================================================
// AUTO-GENERACIÓN DE REVIEWS (SE EJECUTA UNA SOLA VEZ)
// =============================================================================

add_action('init', 'duendes_auto_generar_reviews_init', 999);

function duendes_auto_generar_reviews_init() {
    // Solo ejecutar en admin y si WooCommerce está activo
    if (!is_admin() || !class_exists('WooCommerce')) return;

    // Verificar si ya se ejecutó
    if (get_option('duendes_reviews_generados_v1') === 'done') return;

    // Marcar como en progreso para evitar doble ejecución
    update_option('duendes_reviews_generados_v1', 'in_progress');

    // Programar la generación para que no bloquee
    if (!wp_next_scheduled('duendes_generar_reviews_cron')) {
        wp_schedule_single_event(time() + 5, 'duendes_generar_reviews_cron');
    }
}

add_action('duendes_generar_reviews_cron', 'duendes_ejecutar_auto_generacion');

function duendes_ejecutar_auto_generacion() {
    // Aumentar límites para proceso largo
    @set_time_limit(600);
    @ini_set('memory_limit', '512M');

    $log = [];
    $total_generados = 0;

    foreach (DUENDES_MINIS_REVIEWS as $slug => $data) {
        $product_id = duendes_buscar_producto_mini($slug, $data['nombre']);

        if (!$product_id) {
            $log[] = "❌ {$data['nombre']}: No encontrado";
            continue;
        }

        // Verificar si ya tiene reviews
        $reviews_actuales = duendes_contar_reviews($product_id);
        if ($reviews_actuales >= 150) {
            $log[] = "⏭️ {$data['nombre']}: Ya tiene $reviews_actuales reviews";
            continue;
        }

        // Cantidad aleatoria entre 200-350
        $cantidad = mt_rand(200, 350);

        $resultado = duendes_generar_reviews_para_producto($product_id, $cantidad);
        $total_generados += $resultado['generados'];
        $log[] = "✅ {$data['nombre']}: {$resultado['generados']} reviews generados";
    }

    // Marcar como completado
    update_option('duendes_reviews_generados_v1', 'done');
    update_option('duendes_reviews_log', $log);
    update_option('duendes_reviews_total', $total_generados);
}

// Alternativa: generar inmediatamente si se accede al admin de reviews
add_action('admin_init', 'duendes_generar_reviews_si_necesario');

function duendes_generar_reviews_si_necesario() {
    // Solo en la página de reviews
    if (!isset($_GET['page']) || $_GET['page'] !== 'duendes-reviews') return;

    // Si hay parámetro de forzar generación
    if (!isset($_GET['auto_generar'])) return;

    // Verificar nonce
    if (!wp_verify_nonce($_GET['_wpnonce'] ?? '', 'duendes_auto_generar')) return;

    // Resetear flag para permitir regeneración
    delete_option('duendes_reviews_generados_v1');

    // Ejecutar
    duendes_ejecutar_auto_generacion();

    // Redirigir
    wp_redirect(admin_url('admin.php?page=duendes-reviews&generado=1'));
    exit;
}

// =============================================================================
// ENDPOINT REST PARA GENERAR REVIEWS (TEMPORAL)
// =============================================================================

add_action('rest_api_init', 'duendes_registrar_endpoint_generar_reviews');

function duendes_registrar_endpoint_generar_reviews() {
    register_rest_route('duendes/v1', '/generar-reviews', [
        'methods' => 'GET',
        'callback' => 'duendes_api_generar_reviews',
        'permission_callback' => function() {
            // Token simple de seguridad
            return isset($_GET['token']) && $_GET['token'] === 'duendes2026generar';
        }
    ]);
}

// AJAX endpoint (no requiere login)
add_action('wp_ajax_nopriv_duendes_generar_reviews_ajax', 'duendes_ajax_generar_reviews');
add_action('wp_ajax_duendes_generar_reviews_ajax', 'duendes_ajax_generar_reviews');

function duendes_ajax_generar_reviews() {
    // Verificar token
    if (!isset($_GET['token']) || $_GET['token'] !== 'duendes2026generar') {
        wp_send_json_error('Token inválido');
    }

    // Ejecutar
    $resultado = duendes_api_generar_reviews(null);
    wp_send_json_success($resultado);
}

// Hook directo via init para URL especial
add_action('init', 'duendes_generar_reviews_url_directa', 1);

function duendes_generar_reviews_url_directa() {
    if (!isset($_GET['duendes_generar_reviews']) || $_GET['duendes_generar_reviews'] !== 'duendes2026generar') {
        return;
    }

    // Limpiar cualquier output anterior
    while (ob_get_level()) {
        ob_end_clean();
    }

    // Aumentar límites
    @set_time_limit(900);
    @ini_set('memory_limit', '1024M');
    ignore_user_abort(true);

    // Headers limpios
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-cache, no-store, must-revalidate');

    $total_generados = 0;
    $log = [];

    foreach (DUENDES_MINIS_REVIEWS as $slug => $data) {
        $product_id = duendes_buscar_producto_mini($slug, $data['nombre']);

        if (!$product_id) {
            $log[] = ['mini' => $data['nombre'], 'status' => 'error', 'mensaje' => 'No encontrado'];
            continue;
        }

        // Verificar si ya tiene reviews
        $reviews_actuales = duendes_contar_reviews($product_id);
        if ($reviews_actuales >= 150) {
            $log[] = ['mini' => $data['nombre'], 'status' => 'skip', 'mensaje' => "Ya tiene $reviews_actuales reviews"];
            continue;
        }

        // Cantidad aleatoria entre 200-350
        $cantidad = mt_rand(200, 350);

        $resultado = duendes_generar_reviews_para_producto($product_id, $cantidad);
        $total_generados += $resultado['generados'];

        $log[] = [
            'mini' => $data['nombre'],
            'status' => 'success',
            'product_id' => $product_id,
            'generados' => $resultado['generados']
        ];
    }

    // Guardar estado
    update_option('duendes_reviews_generados_v1', 'done');
    update_option('duendes_reviews_log', $log);
    update_option('duendes_reviews_total', $total_generados);

    echo json_encode([
        'success' => true,
        'total_generados' => $total_generados,
        'detalle' => $log
    ], JSON_PRETTY_PRINT);

    exit;
}

function duendes_api_generar_reviews($request) {
    // Aumentar límites
    @set_time_limit(900);
    @ini_set('memory_limit', '1024M');
    ignore_user_abort(true);

    $total_generados = 0;
    $log = [];

    foreach (DUENDES_MINIS_REVIEWS as $slug => $data) {
        $product_id = duendes_buscar_producto_mini($slug, $data['nombre']);

        if (!$product_id) {
            $log[] = ['mini' => $data['nombre'], 'status' => 'error', 'mensaje' => 'No encontrado'];
            continue;
        }

        // Verificar si ya tiene reviews
        $reviews_actuales = duendes_contar_reviews($product_id);
        if ($reviews_actuales >= 150) {
            $log[] = ['mini' => $data['nombre'], 'status' => 'skip', 'mensaje' => "Ya tiene $reviews_actuales reviews"];
            continue;
        }

        // Cantidad aleatoria entre 200-350
        $cantidad = mt_rand(200, 350);

        $resultado = duendes_generar_reviews_para_producto($product_id, $cantidad);
        $total_generados += $resultado['generados'];

        $log[] = [
            'mini' => $data['nombre'],
            'status' => 'success',
            'product_id' => $product_id,
            'generados' => $resultado['generados']
        ];
    }

    // Guardar estado
    update_option('duendes_reviews_generados_v1', 'done');
    update_option('duendes_reviews_log', $log);
    update_option('duendes_reviews_total', $total_generados);

    return [
        'success' => true,
        'total_generados' => $total_generados,
        'detalle' => $log
    ];
}
