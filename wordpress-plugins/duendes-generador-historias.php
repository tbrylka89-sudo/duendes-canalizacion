<?php
/**
 * Plugin Name: Duendes - Generador de Historias (Nativo)
 * Description: Genera historias de guardianes directamente desde WordPress usando Claude AI
 * Version: 2.0.0
 * Author: Duendes del Uruguay
 *
 * CONFIGURACIÓN:
 * Agregá esto a tu wp-config.php:
 * define('ANTHROPIC_API_KEY', 'tu-api-key-aqui');
 */

if (!defined('ABSPATH')) exit;

// ============================================
// HOOKS Y SINCRODESTINOS (DATA)
// ============================================

function duendes_get_hooks() {
    return [
        'proteccion' => [
            "Hay personas que cargan con todo y no piden nada.",
            "¿Cuántas veces dijiste que sí cuando querías decir que no?",
            "Algunas personas absorben todo lo que las rodea sin darse cuenta.",
            "Los que más dan son los que menos piden.",
            "Hay quienes sienten todo. Incluso lo que no es suyo.",
            "Cuidar a todos te dejó sin nadie que te cuide a vos.",
            "Ser fuerte todo el tiempo tiene un precio.",
            "A veces el cansancio no es físico.",
            "Hay personas que necesitan un escudo. No porque sean débiles, sino porque sienten demasiado.",
            "El hogar debería ser refugio. Pero el tuyo no siempre lo es."
        ],
        'abundancia' => [
            "El dinero no es malo. Lo que te enseñaron sobre él, sí.",
            "¿Cuántas veces dejaste pasar oportunidades por no sentirte lista?",
            "Hay personas que trabajan el doble y ganan la mitad.",
            "Merecer no se negocia. Se decide.",
            "El bloqueo no está en el mundo. Está en lo que creés sobre vos.",
            "Lo que rechazás, te rechaza.",
            "Hay un techo invisible que vos misma construiste.",
            "Pediste permiso toda tu vida. ¿A quién?",
            "Tu mamá tenía miedo al dinero. ¿Y vos?",
            "No es falta de oportunidades. Es exceso de autosabotaje."
        ],
        'abrecaminos' => [
            "Hay puertas que parecen cerradas pero solo necesitan un empujón.",
            "Los caminos existen. Lo que falta es alguien que te los muestre.",
            "Sentís que estás trabada. Pero el movimiento está más cerca de lo que creés.",
            "A veces el obstáculo no es real. Es una prueba.",
            "El camino se abre para quien se atreve a caminar.",
            "Lo que parece un muro es solo una curva en el camino."
        ],
        'amor' => [
            "Amás a todos menos a vos.",
            "El amor propio no es egoísmo. Es supervivencia.",
            "El amor que merecés empieza por el que te negás.",
            "Elegiste a otros tantas veces. ¿Cuándo te vas a elegir a vos?",
            "El amor no debería doler. Pero el tuyo siempre duele.",
            "Hay patrones que repetís sin darte cuenta.",
            "¿Cuántas veces confundiste intensidad con amor?",
            "Lo que tolerás, lo repetís.",
            "A veces el amor llega cuando dejás de perseguirlo.",
            "La familia que te tocó no siempre es la que merecés."
        ],
        'sanacion' => [
            "Hay heridas que no sangran pero duelen todos los días.",
            "Soltar no es olvidar. Es dejar de cargar.",
            "El cuerpo guarda lo que la mente no procesa.",
            "Sanar no es volver a ser quien eras. Es convertirte en quien podés ser.",
            "No todo lo que duele tiene nombre. Pero existe.",
            "Hay duelos que nunca hiciste.",
            "Lo que no perdonaste te sigue pesando.",
            "El dolor que ignorás no desaparece. Se transforma.",
            "Hay partes tuyas que dejaste atrás hace mucho.",
            "A veces sanar es simplemente dejar de resistir."
        ],
        'sabiduria' => [
            "Sabés más de lo que te permiten recordar.",
            "La intuición habla. El ruido no te deja escucharla.",
            "¿Cuántas veces supiste algo y no le hiciste caso?",
            "La claridad no se busca. Se permite.",
            "Tu mente duda. Tu cuerpo sabe.",
            "Hay respuestas que ya tenés pero no te animás a escuchar.",
            "Buscás afuera lo que siempre estuvo adentro.",
            "Las decisiones más importantes no se piensan. Se sienten.",
            "El miedo a equivocarte te tiene paralizada.",
            "Sabés lo que tenés que hacer. Solo querés que alguien te lo confirme."
        ],
        'estudios' => [
            "La mente se dispersa cuando más la necesitás.",
            "¿Cuántas veces leíste lo mismo sin entender?",
            "El conocimiento está. La concentración no.",
            "Estudiar se volvió una batalla contigo misma.",
            "Los nervios te traicionan cuando más los necesitás controlados.",
            "Sabés más de lo que el examen va a mostrar.",
            "El miedo a fallar te paraliza antes de empezar.",
            "No es falta de estudio. Es exceso de presión."
        ],
        'fortuna' => [
            "Hay personas a las que la suerte les esquiva.",
            "¿Cuántas veces viste a alguien menos preparado llevarse lo que vos merecías?",
            "Hay quienes siempre llegan un paso tarde.",
            "Parece que el universo favorece a todos menos a vos.",
            "Las coincidencias buenas nunca son para vos.",
            "Te preparás, te esforzás, pero el golpe de suerte nunca llega.",
            "La mala racha existe. Y la tuya ya duró demasiado.",
            "Oportunidades hay. El problema es que nunca paran en tu puerta."
        ],
        'viajero' => [
            "Hay personas que viven la misma vida todos los días esperando que algo cambie.",
            "¿Cuántas veces soñaste con dejarlo todo y empezar de nuevo?",
            "La zona de confort se convirtió en tu prisión.",
            "Mirás el horizonte y sentís que hay algo llamándote.",
            "La rutina te está asfixiando y lo sabés.",
            "Tu mundo se volvió chico. Y vos te achicaste con él.",
            "Hay quienes nacieron para moverse, pero la vida los ancló.",
            "Vivís en piloto automático. Pero no elegiste el destino."
        ],
        'transformacion' => [
            "Algo en vos está muriendo. Y eso asusta.",
            "El cambio que necesitás te da miedo.",
            "Ya no sos quien eras. Pero tampoco sabés quién estás siendo.",
            "Transformarse duele. Pero quedarse igual duele más.",
            "Querés cambiar pero no sabés cómo.",
            "Sentís que estás estancada.",
            "La vida que tenés no es la que querés.",
            "La oruga no pide permiso para ser mariposa."
        ],
        'calma' => [
            "Tu mente no para nunca.",
            "La ansiedad te come por dentro.",
            "Vivís en modo alerta permanente.",
            "Olvidaste lo que es sentirte tranquila.",
            "Dormís pero no descansás. Parás pero no frenás.",
            "¿Cuándo fue la última vez que tu mente estuvo en silencio?",
            "Tu sistema nervioso está gritando. Es hora de escucharlo.",
            "El cuerpo que no descansa, colapsa."
        ],
        'naturaleza' => [
            "Hay personas que olvidaron que vienen de la tierra.",
            "¿Cuándo fue la última vez que caminaste descalza sobre el pasto?",
            "La naturaleza te llama pero el cemento te atrapa.",
            "La vida moderna te alejó de tu esencia.",
            "Tu cuerpo, mente y espíritu piden volver a lo natural.",
            "El ritmo de la ciudad no es tu ritmo. Y tu cuerpo lo sabe.",
            "Estás desconectada de las raíces. Y sin raíces no hay fruto."
        ],
        'clarividencia' => [
            "Sabés cosas que no sabés cómo sabés.",
            "¿Cuántas veces supiste algo y no le hiciste caso?",
            "La intuición habla. El ruido no te deja escucharla.",
            "Tu cuerpo sabe antes que tu mente.",
            "Hay mensajes que llegan pero no sabés cómo interpretarlos.",
            "Ves más de lo que mostrás. Sentís más de lo que decís."
        ]
    ];
}

function duendes_get_sincrodestinos() {
    return [
        ['texto' => "Mientras era modelado, el reloj del taller se detuvo. Cuando quedó terminado, volvió a funcionar solo.", 'genero' => 'm'],
        ['texto' => "Mientras era modelada, el reloj del taller se detuvo. Cuando quedó terminada, volvió a funcionar solo.", 'genero' => 'f'],
        ['texto' => "Empezó a tomar forma a las 3:33 de la madrugada. Como si ese fuera el momento exacto.", 'genero' => 'm'],
        ['texto' => "Tardó exactamente 7 horas en quedar lista. Ni más ni menos. Nadie lo planificó.", 'genero' => 'f'],
        ['texto' => "Mientras se elegía su cristal, sonó una canción que no sonaba hace años en el taller.", 'genero' => 'm'],
        ['texto' => "El gato, que nunca entra al taller, se sentó a mirar todo el proceso sin moverse.", 'genero' => 'm'],
        ['texto' => "Un pájaro se posó en la ventana justo cuando quedó terminada. Se quedó varios minutos.", 'genero' => 'f'],
        ['texto' => "Una mariposa entró al taller mientras se secaba. En pleno invierno.", 'genero' => 'm'],
        ['texto' => "El cristal elegido se partió a la mitad. El que quedó era exactamente lo que se necesitaba.", 'genero' => 'm'],
        ['texto' => "Apareció una pluma en la mesa del taller. No hay pájaros cerca.", 'genero' => 'f'],
        ['texto' => "La arcilla tomó una forma diferente a la planeada. Se confió. Salió mejor.", 'genero' => 'f'],
        ['texto' => "Esa noche, antes de empezar a crearlo, su nombre apareció en un sueño.", 'genero' => 'm'],
        ['texto' => "Empezó a llover exactamente cuando quedó sellada. Como un bautismo.", 'genero' => 'f'],
        ['texto' => "El sol entró por la ventana e iluminó exactamente el lugar donde estaba siendo terminado.", 'genero' => 'm'],
        ['texto' => "Las luces del taller titilaron tres veces. Solo pasa cuando algo importante está naciendo.", 'genero' => 'm'],
        ['texto' => "Una de las nenas entró al taller y dijo su nombre antes de que nadie lo decidiera.", 'genero' => 'm'],
        ['texto' => "Hubo un escalofrío cuando quedaron pintados sus ojos. No hacía frío.", 'genero' => 'm'],
        ['texto' => "Hubo que parar tres veces porque los ojos se llenaban de lágrimas. Sin razón aparente.", 'genero' => 'f']
    ];
}

function duendes_get_random_hook($categoria) {
    $hooks = duendes_get_hooks();
    $cat = strtolower($categoria);
    $cat = str_replace(['á','é','í','ó','ú'], ['a','e','i','o','u'], $cat);

    // Mapeo de categorías
    $mapeo = [
        // Protección
        'proteccion' => 'proteccion',
        'protection' => 'proteccion',
        'proteccion del hogar' => 'proteccion',
        'proteccion energetica' => 'proteccion',
        'cortar lazos' => 'proteccion',
        // Abundancia
        'abundancia' => 'abundancia',
        'prosperity' => 'abundancia',
        'negocios' => 'abundancia',
        'trabajo' => 'abundancia',
        'abrecaminos' => 'abrecaminos',
        // Amor
        'amor' => 'amor',
        'love' => 'amor',
        'amor propio' => 'amor',
        'amor de pareja' => 'amor',
        'fertilidad' => 'amor',
        'familia' => 'amor',
        // Sanación
        'sanacion' => 'sanacion',
        'healing' => 'sanacion',
        'sanacion emocional' => 'sanacion',
        'duelo' => 'sanacion',
        'calma' => 'calma',
        // Sabiduría
        'sabiduria' => 'sabiduria',
        'wisdom' => 'sabiduria',
        'clarividencia' => 'clarividencia',
        'estudios' => 'estudios',
        'decisiones' => 'sabiduria',
        'proposito' => 'sabiduria',
        // Fortuna
        'fortuna' => 'fortuna',
        'suerte' => 'fortuna',
        // Transformación
        'transformacion' => 'transformacion',
        'nuevos comienzos' => 'transformacion',
        'soltar' => 'transformacion',
        'superar miedos' => 'transformacion',
        // Naturaleza
        'naturaleza' => 'naturaleza',
        'bosque' => 'naturaleza',
        'plantas' => 'naturaleza',
        // Viajes
        'viajero' => 'viajero',
        'aventura' => 'viajero',
        'proteccion en viajes' => 'proteccion'
    ];

    $key = isset($mapeo[$cat]) ? $mapeo[$cat] : 'proteccion';
    $lista = isset($hooks[$key]) ? $hooks[$key] : $hooks['proteccion'];

    return $lista[array_rand($lista)];
}

function duendes_get_random_sincrodestino($genero = 'm') {
    $sincros = duendes_get_sincrodestinos();
    $filtrados = array_filter($sincros, function($s) use ($genero) {
        return $s['genero'] === $genero;
    });

    if (empty($filtrados)) {
        $filtrados = $sincros;
    }

    $sincro = $filtrados[array_rand($filtrados)];
    return $sincro['texto'];
}

// ============================================
// ANÁLISIS DE IMAGEN CON CLAUDE VISION
// ============================================

function duendes_analizar_imagen($imagen_url, $nombre = '', $categoria = '') {
    $api_key = defined('ANTHROPIC_API_KEY') ? ANTHROPIC_API_KEY : '';

    if (empty($api_key)) {
        return ['error' => 'API key de Anthropic no configurada en wp-config.php'];
    }

    if (empty($imagen_url)) {
        return ['error' => 'No se proporcionó URL de imagen'];
    }

    // Descargar imagen y convertir a base64
    $response = wp_remote_get($imagen_url, ['timeout' => 30]);
    if (is_wp_error($response)) {
        return ['error' => 'No se pudo descargar la imagen: ' . $response->get_error_message()];
    }

    $image_data = wp_remote_retrieve_body($response);

    if (empty($image_data)) {
        return ['error' => 'La imagen está vacía o no se pudo leer'];
    }

    // Verificar tamaño (máx 5MB para evitar timeouts)
    $size_mb = strlen($image_data) / (1024 * 1024);
    if ($size_mb > 5) {
        return ['error' => 'Imagen muy pesada (' . round($size_mb, 1) . 'MB). Máximo 5MB.'];
    }

    $base64_image = base64_encode($image_data);

    // Detectar tipo de imagen
    $content_type = wp_remote_retrieve_header($response, 'content-type');
    $media_type = strpos($content_type, 'png') !== false ? 'image/png' : 'image/jpeg';

    // Llamar a Claude Vision
    $api_response = wp_remote_post('https://api.anthropic.com/v1/messages', [
        'timeout' => 60,
        'headers' => [
            'Content-Type' => 'application/json',
            'x-api-key' => $api_key,
            'anthropic-version' => '2023-06-01'
        ],
        'body' => json_encode([
            'model' => 'claude-sonnet-4-20250514',
            'max_tokens' => 1000,
            'messages' => [
                [
                    'role' => 'user',
                    'content' => [
                        [
                            'type' => 'image',
                            'source' => [
                                'type' => 'base64',
                                'media_type' => $media_type,
                                'data' => $base64_image
                            ]
                        ],
                        [
                            'type' => 'text',
                            'text' => 'Analizá esta imagen de un guardián artesanal llamado "' . $nombre . '" de la categoría "' . $categoria . '".

IMPORTANTE: Es una figura artesanal hecha a mano, NO una persona real. Es un duende/pixie/elemental de fantasía.

Describí en español rioplatense:

1. **EXPRESIÓN**: ¿Qué emoción transmite su rostro? (serenidad, picardía, sabiduría, protección, alegría, misterio)

2. **COLORES**: ¿Qué colores predominan y qué energía representan?

3. **ELEMENTOS/ACCESORIOS**: ¿Qué lleva puesto o porta? (cristales, flores, armas, símbolos, etc.)

4. **POSTURA**: ¿Cómo está posicionado? (abierto, protector, contemplativo, activo)

5. **PERSONALIDAD SUGERIDA**: Basándote en lo visual, ¿qué tipo de personalidad le darías? (3-4 adjetivos)

6. **TIPO DE PERSONA QUE LO ELEGIRÍA**: ¿A quién crees que llamaría este guardián?

7. **DETALLES ÚNICOS**: ¿Qué lo hace diferente de otros guardianes?

Respondé de forma concisa y directa, sin introducción.'
                        ]
                    ]
                ]
            ]
        ])
    ]);

    if (is_wp_error($api_response)) {
        return ['error' => 'Error de conexión con Claude: ' . $api_response->get_error_message()];
    }

    $http_code = wp_remote_retrieve_response_code($api_response);
    $body = json_decode(wp_remote_retrieve_body($api_response), true);

    if ($http_code !== 200) {
        $error_msg = $body['error']['message'] ?? 'Error HTTP ' . $http_code;
        return ['error' => 'Error de API: ' . $error_msg];
    }

    if (isset($body['content'][0]['text'])) {
        return ['success' => true, 'analisis' => $body['content'][0]['text']];
    }

    return ['error' => 'Respuesta inesperada de la API'];
}

// ============================================
// ESCANEO DE HISTORIAS EXISTENTES
// ============================================

function duendes_escanear_historias_existentes() {
    // Obtener todos los productos publicados
    $args = [
        'post_type' => 'product',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'fields' => 'ids'
    ];

    $productos = get_posts($args);

    $analisis = [
        'hooks_usados' => [],
        'sincrodestinos_usados' => [],
        'edades_usadas' => [],
        'patrones_detectados' => [],
        'frases_ia_detectadas' => [],
        'guardianes_con_historia' => 0,
        'guardianes_sin_historia' => 0
    ];

    $frases_ia_prohibidas = [
        'en lo profundo del bosque',
        'a través de las brumas',
        'desde tiempos inmemoriales',
        'las energías ancestrales',
        'el velo entre mundos',
        'vibraciones cósmicas',
        'campos energéticos',
        'este ser feérico',
        'brumas ancestrales',
        'susurro del viento'
    ];

    foreach ($productos as $producto_id) {
        $producto = wc_get_product($producto_id);
        if (!$producto) continue;

        $descripcion = $producto->get_description();

        if (empty($descripcion) || strlen($descripcion) < 100) {
            $analisis['guardianes_sin_historia']++;
            continue;
        }

        $analisis['guardianes_con_historia']++;
        $desc_lower = strtolower($descripcion);

        // Detectar primera línea (posible hook)
        $primera_linea = strip_tags(explode("\n", $descripcion)[0]);
        $primera_linea = trim(strip_tags(explode('</p>', $descripcion)[0]));
        $primera_linea = str_replace(['<p>', '</p>'], '', $primera_linea);
        if (strlen($primera_linea) > 20 && strlen($primera_linea) < 150) {
            $analisis['hooks_usados'][] = $primera_linea;
        }

        // Detectar sincrodestinos
        if (strpos($desc_lower, 'mariposa') !== false) $analisis['sincrodestinos_usados'][] = 'mariposa';
        if (strpos($desc_lower, 'gorrión') !== false || strpos($desc_lower, 'pájaro') !== false) $analisis['sincrodestinos_usados'][] = 'pajaro';
        if (strpos($desc_lower, 'lluvia') !== false || strpos($desc_lower, 'llovió') !== false) $analisis['sincrodestinos_usados'][] = 'lluvia';
        if (strpos($desc_lower, 'gato') !== false) $analisis['sincrodestinos_usados'][] = 'gato';
        if (strpos($desc_lower, '3:33') !== false || strpos($desc_lower, '11:11') !== false) $analisis['sincrodestinos_usados'][] = 'hora_espejo';
        if (strpos($desc_lower, 'reloj') !== false) $analisis['sincrodestinos_usados'][] = 'reloj';
        if (strpos($desc_lower, 'viento') !== false) $analisis['sincrodestinos_usados'][] = 'viento';
        if (strpos($desc_lower, 'pluma') !== false) $analisis['sincrodestinos_usados'][] = 'pluma';

        // Detectar edades
        if (preg_match('/tiene (\d+) años/i', $descripcion, $matches)) {
            $analisis['edades_usadas'][] = $matches[1];
        }

        // Detectar frases de IA
        foreach ($frases_ia_prohibidas as $frase) {
            if (strpos($desc_lower, $frase) !== false) {
                $analisis['frases_ia_detectadas'][] = $frase;
            }
        }
    }

    // Limpiar duplicados y contar frecuencias
    $analisis['hooks_usados'] = array_count_values($analisis['hooks_usados']);
    $analisis['sincrodestinos_usados'] = array_count_values($analisis['sincrodestinos_usados']);
    $analisis['edades_usadas'] = array_count_values($analisis['edades_usadas']);
    $analisis['frases_ia_detectadas'] = array_count_values($analisis['frases_ia_detectadas']);

    return $analisis;
}

// ============================================
// FORMATOS NARRATIVOS VARIADOS
// ============================================

function duendes_get_formatos_narrativos() {
    return [
        'guardian_primero' => [
            'nombre' => 'Desde el Guardián',
            'descripcion' => 'Empezar presentando al guardián, sus poderes, qué lo hace único',
            'estructura' => '1. Presentar guardián y rasgo distintivo → 2. Sus poderes y propósito → 3. Para quién es → 4. Mensaje personal → 5. Cierre'
        ],
        'misterio' => [
            'nombre' => 'Misterio e Intriga',
            'descripcion' => 'Empezar con una contradicción o misterio que intrigue',
            'estructura' => '1. Contradicción/misterio → 2. Revelar al guardián → 3. Explicar el por qué → 4. Conexión personal → 5. Mensaje → 6. Cierre'
        ],
        'objeto_significado' => [
            'nombre' => 'Objeto con Historia',
            'descripcion' => 'Centrar en un accesorio/cristal y contar su significado profundo',
            'estructura' => '1. El objeto (cristal/accesorio) → 2. Su significado → 3. Quién lo porta → 4. Por qué → 5. Mensaje → 6. Cierre'
        ],
        'espejo_dolor' => [
            'nombre' => 'Espejo Emocional',
            'descripcion' => 'Empezar reflejando una situación que el lector reconozca',
            'estructura' => '1. Espejo → 2. Validación → 3. Esperanza → 4. Solución (guardián) → 5. Prueba → 6. Mensaje → 7. Cierre'
        ],
        'viaje_mistico' => [
            'nombre' => 'Viaje Místico',
            'descripcion' => 'Contar de dónde viene el guardián, su travesía',
            'estructura' => '1. Origen → 2. Travesía/aprendizaje → 3. Por qué llegó acá → 4. A quién busca → 5. Mensaje → 6. Cierre'
        ],
        'accion_define' => [
            'nombre' => 'Acción que Define',
            'descripcion' => 'Empezar con algo que HIZO el guardián que define su personalidad',
            'estructura' => '1. Acción distintiva → 2. Por qué la hizo → 3. Qué dice de él/ella → 4. Para quién es → 5. Mensaje → 6. Cierre'
        ]
    ];
}

// ============================================
// PROMPT EXPERTO (ENRIQUECIDO)
// ============================================

function duendes_get_prompt_experto() {
    return <<<'PROMPT'
# SISTEMA EXPERTO DE STORYTELLING PARA GUARDIANES

Sos un maestro del storytelling que combina:
- **FANTASÍA**: Mundos mágicos, seres ancestrales, poderes sobrenaturales
- **METAFÍSICA**: Energías, vibraciones, conexiones invisibles, sincronicidades
- **ESPIRITUALIDAD**: Propósito, alma, camino personal, despertar
- **AUTOAYUDA**: Heridas reales, sanación, crecimiento, transformación
- **MISTICISMO**: Lo oculto, lo sagrado, rituales, símbolos
- **ESOTERISMO**: Cristales, elementos, correspondencias mágicas
- **REALISMO EMOCIONAL**: Por qué ESTA persona conecta con ESTE guardián

## OBJETIVO
Crear textos que hagan que el lector sienta "esto fue escrito para mí" sin que se sienta vendido.

## ESTRUCTURAS NARRATIVAS (VARIÁ ENTRE ELLAS)

**FORMATO A - EL GUARDIÁN PRIMERO:**
Presentar al guardián, su historia, sus poderes → Para quién es → Mensaje personal → Cierre

**FORMATO B - MISTERIO E INTRIGA:**
Contradicción intrigante → Revelación gradual → Significado profundo → Conexión personal

**FORMATO C - OBJETO CON HISTORIA:**
Un cristal/accesorio específico → Su significado esotérico → Por qué ESTE guardián lo porta → Conexión

**FORMATO D - VIAJE MÍSTICO:**
De dónde viene → Qué aprendió en su travesía → Por qué llegó ACÁ → A quién busca

**FORMATO E - ACCIÓN DEFINITORIA:**
Algo que HIZO el guardián → Por qué lo hizo → Qué dice de su esencia → Para quién es

**FORMATO F - ESPEJO EMOCIONAL:**
Reflejar situación del lector → Validar → Esperanza → Solución (guardián) → Mensaje

## CAPAS DE PROFUNDIDAD (OBLIGATORIO COMBINAR)

### CAPA FANTÁSTICA
- El guardián tiene una historia de SIGLOS (no genérica)
- Viene de un lugar específico (no "bosques de Escocia" genérico)
- Tiene poderes CONCRETOS (no "energía positiva" vago)
- Aprendió algo en su travesía que ahora ofrece

### CAPA METAFÍSICA
- Sincrodestino: algo PASÓ durante su creación
- Conexiones invisibles: por qué llegó a este momento
- Energías específicas que trabaja (no "buena vibra")
- El guardián SIENTE, PERCIBE, SABE cosas

### CAPA ESPIRITUAL
- Propósito del guardián en el mundo
- Misión con esta persona específica
- Despertar que facilita
- Camino que acompaña

### CAPA AUTOAYUDA (SIN SER CURSI)
- Herida REAL que la persona tiene (específica)
- Patrón que repite sin darse cuenta
- Lo que necesita escuchar pero nadie le dice
- Promesa de transformación CONCRETA

### CAPA ESOTÉRICA
- Cristales y sus propiedades REALES
- Elementos (tierra, agua, fuego, aire)
- Correspondencias mágicas con colores, plantas, fases lunares
- Símbolos que porta y su significado

### CAPA REALISTA
- Por qué ESTA persona llegó a ESTE guardián (no casualidad)
- Qué situación REAL está atravesando
- Qué va a cambiar en su día a día
- Cómo es la relación guardián-humano

## REGLAS ABSOLUTAS

1. **DATOS EXACTOS:** Especie, tamaño, categoría tal cual se indican
2. **NUNCA 847 AÑOS** - Usá edades DIFERENTES cada vez
3. **ORTOGRAFÍA PERFECTA** - "estás", "vine", "consciente", sin S final en pasados
4. **VOZ PASIVA** - "mientras era modelado" NO "mientras lo modelábamos"
5. **PIXIES SON PIXIES** - Espíritus de plantas, femeninas, NO duendes

## PROHIBIDO

- Frases de IA: "desde tiempos inmemoriales", "brumas ancestrales", "velo entre mundos"
- Lugares genéricos: "acantilados de Irlanda", "bosques de Escocia"
- Patrón repetitivo: "no vino a X, no vino a Y, no vino a Z"
- Venta directa: "llamá ya", "oferta", "no te lo pierdas"
- Genérico espiritual: "buena vibra", "energía positiva", "luz y amor"

## BRANDING - LOS ELEGIDOS

El guardián ELIGE a la persona, no al revés.
- "No todos llegan hasta acá. Vos sí."
- "De todos los guardianes, paraste en este. No fue azar."
- "Si sentís algo leyendo esto, ya sabés por qué."

## TÉCNICAS DE IMPACTO

1. **APERTURA MAGNÉTICA:** Primera frase que enganche (no dolor genérico)
2. **ACCESORIOS CON ALMA:** Cada cristal/elemento tiene historia, no es lista
3. **MENSAJE EN PRIMERA PERSONA:** El guardián habla con promesa ESPECÍFICA
4. **CIERRE ABIERTO:** Dejá que el lector decida, no vendas

## GUÍA DE CRISTALES

- **Amatista**: Protección espiritual, transmuta energías densas, intuición
- **Citrino**: Abundancia solar, atrae oportunidades, desbloquea flujo
- **Cuarzo Rosa**: Amor incondicional, sana el corazón, autoestima
- **Turmalina Negra**: Escudo absoluto, corta energías negativas
- **Fluorita**: Claridad mental, orden en el caos, concentración
- **Pirita**: Voluntad de hierro, manifestación, prosperidad material
- **Cuarzo Cristal**: Amplificador universal, limpieza, claridad
- **Ágata**: Estabilidad, raíces, protección del hogar
- **Piedra Luna**: Intuición femenina, ciclos, fertilidad

## FORMATO

- Párrafos cortos (2-3 líneas)
- **Negritas** solo para nombre del guardián primera vez
- *Cursivas* para mensaje en primera persona del guardián
- Sin títulos ni secciones marcadas
- Flujo natural, como carta íntima
- 300-450 palabras

## CADA HISTORIA DEBE SER ÚNICA

Si leyeras 10 historias seguidas, CADA UNA debe sentirse completamente diferente:
- Diferente estructura narrativa
- Diferente tono (tierno, firme, misterioso, juguetón, sabio)
- Diferente enfoque (desde el guardián, desde la herida, desde el objeto)
- Diferente edad del guardián
- Diferente tipo de conexión con el humano

PROMPT;
}

// ============================================
// LLAMADA A CLAUDE API
// ============================================

function duendes_generar_historia_claude($datos) {
    $api_key = defined('ANTHROPIC_API_KEY') ? ANTHROPIC_API_KEY : get_option('duendes_anthropic_key', '');

    if (empty($api_key)) {
        return ['success' => false, 'error' => 'API key de Anthropic no configurada. Agregá ANTHROPIC_API_KEY en wp-config.php'];
    }

    // Construir prompt
    $prompt_base = duendes_get_prompt_experto();

    // Determinar género - PRIORIDAD al campo explícito
    $especie = strtolower($datos['especie'] ?? 'duende');
    if (!empty($datos['genero'])) {
        $genero = $datos['genero'] === 'f' ? 'f' : 'm';
    } else {
        // Fallback: inferir de especie solo si no hay género explícito
        $genero = ($especie === 'pixie' || $especie === 'hada') ? 'f' : 'm';
    }

    // Texto para el prompt según género
    $genero_texto = $genero === 'f' ? 'FEMENINO (ella, terminaciones en -a)' : 'MASCULINO (él, terminaciones en -o)';

    // Obtener hook y sincrodestino
    $hook = duendes_get_random_hook($datos['categoria'] ?? 'proteccion');
    $sincro = !empty($datos['sincrodestino']) ? $datos['sincrodestino'] : duendes_get_random_sincrodestino($genero);

    // ============ FORMATO NARRATIVO ============
    $formatos = duendes_get_formatos_narrativos();
    $formato_elegido = $datos['formato'] ?? '';

    if (empty($formato_elegido) || !isset($formatos[$formato_elegido])) {
        // Elegir formato aleatorio para variar
        $keys = array_keys($formatos);
        $formato_elegido = $keys[array_rand($keys)];
    }

    $formato_info = $formatos[$formato_elegido];

    // ============ ESCANEO DE HISTORIAS EXISTENTES ============
    $contexto_repeticion = '';
    if (!empty($datos['evitar_repeticion'])) {
        $analisis = duendes_escanear_historias_existentes();

        if (!empty($analisis['edades_usadas'])) {
            $edades_frecuentes = array_keys(array_filter($analisis['edades_usadas'], function($count) {
                return $count >= 2;
            }));
            if (!empty($edades_frecuentes)) {
                $contexto_repeticion .= "\n**EDADES A EVITAR (muy usadas):** " . implode(', ', $edades_frecuentes) . " años\n";
            }
        }

        if (!empty($analisis['sincrodestinos_usados'])) {
            $sincros_frecuentes = array_keys(array_filter($analisis['sincrodestinos_usados'], function($count) {
                return $count >= 3;
            }));
            if (!empty($sincros_frecuentes)) {
                $contexto_repeticion .= "**SINCRODESTINOS MUY USADOS (evitar):** " . implode(', ', $sincros_frecuentes) . "\n";
            }
        }
    }

    // ============ ANÁLISIS DE IMAGEN ============
    $analisis_imagen = '';
    if (!empty($datos['analisis_imagen'])) {
        $analisis_imagen = $datos['analisis_imagen'];
    }

    // Datos del guardián
    $prompt = $prompt_base . "\n\n---\n\n# DATOS DEL GUARDIÁN\n\n";
    $prompt .= "**Nombre:** " . ($datos['nombre'] ?? 'Sin nombre') . "\n";
    $prompt .= "**GÉNERO:** " . $genero_texto . "\n";
    $prompt .= "IMPORTANTE: Tratá a este guardián como " . ($genero === 'f' ? 'FEMENINA' : 'MASCULINO') . ". Usá: ";
    $prompt .= $genero === 'f'
        ? "'ella', 'la', 'esta', 'una', terminaciones en -a (sabia, protectora, guardiana, etc.)\n"
        : "'él', 'el', 'este', 'un', terminaciones en -o (sabio, protector, guardián, etc.)\n";
    $prompt .= "**Especie:** " . strtoupper($especie);
    if ($especie === 'pixie') {
        $prompt .= " (espíritu de planta, NO duende)";
    }
    $prompt .= "\n";
    $prompt .= "**Tamaño:** " . ($datos['tamano_cm'] ?? 18) . " centímetros EXACTOS\n";
    $prompt .= "**Categoría/Propósito:** " . ($datos['categoria'] ?? 'Protección') . "\n";
    $prompt .= "**Tipo:** " . (($datos['es_unico'] ?? false) ? 'PIEZA ÚNICA' : 'RECREABLE') . "\n";

    // Estilo/Personalidad
    if (!empty($datos['estilo'])) {
        $estilos_desc = [
            // Culturales
            'gaucho' => 'estilo Gaucho/Gaucha uruguayo - rústico, de campo, con mate y tradición',
            'mexicano' => 'estilo Mexicano/Mexicana - colorido, con elementos de la cultura mexicana',
            'celta' => 'estilo Celta - con nudos celtas, símbolos druídicos, conexión con la antigua tradición',
            'nordico' => 'estilo Nórdico - vikingo, runas, mitología nórdica',
            'andino' => 'estilo Andino - con elementos de pueblos originarios sudamericanos',
            'oriental' => 'estilo Oriental - zen, equilibrio, sabiduría oriental',
            // Apariencia
            'fancy' => 'estilo Fancy/De Gala - elegante, con vestimenta de fiesta, sofisticado/a',
            'elegante' => 'estilo Elegante - refinado/a, con porte distinguido',
            'rustico' => 'estilo Rústico - natural, de campo, conectado con la tierra',
            'bohemio' => 'estilo Bohemio - libre, artístico, espíritu nómade',
            'mistico' => 'estilo Místico - enigmático/a, conectado con lo oculto',
            'salvaje' => 'estilo Salvaje - indómito/a, espíritu libre de la naturaleza',
            // Rol
            'viajero' => 'es un Viajero/a - con mochila, bastón, espíritu aventurero',
            'mensajero' => 'es un Mensajero/a - trae mensajes del universo, conecta mundos',
            'sembrador' => 'es un Sembrador/a - planta semillas de cambio, hace crecer lo bueno',
            'guardian' => 'es un Guardián/Guardiana - protector/a firme y leal',
            'companero' => 'es un Compañero/a Fiel - acompaña en todo momento, presencia constante',
            'protector' => 'es un Protector/a - escudo contra todo mal',
            'guia' => 'es un Guía Espiritual - ilumina el camino, da claridad',
            // Especiales
            'estudiante' => 'especial para Estudiantes - ayuda con concentración, memoria, exámenes',
            'emprendedor' => 'especial para Emprendedores - impulsa negocios, abre caminos de prosperidad',
            'mama' => 'especial para Mamás - protege a los hijos, da fuerza maternal',
            'ninos' => 'especial para Niños - protector/a de los más pequeños, dulce y cuidador/a',
            'artista' => 'especial para Artistas - inspira creatividad, desbloquea el arte',
            'sanador' => 'especial para Sanadores - potencia las habilidades de sanación',
            // Personalidad
            'dulce' => 'personalidad Dulce/Tierna - cariñoso/a, suave, reconfortante',
            'serio' => 'personalidad Seria/Solemne - formal, respetable, de pocas palabras',
            'jugueton' => 'personalidad Juguetona - alegre, travieso/a, lleno/a de vida',
            'sabio' => 'personalidad Sabia - conocedor/a de secretos antiguos',
            'intenso' => 'personalidad Intensa - apasionado/a, profundo/a',
            'tranquilo' => 'personalidad Tranquila - sereno/a, transmite paz',
            'picaro' => 'personalidad Pícara - astuto/a, con un brillo de travesura en los ojos'
        ];
        $estilo_key = strtolower($datos['estilo']);
        $estilo_desc = isset($estilos_desc[$estilo_key]) ? $estilos_desc[$estilo_key] : $datos['estilo'];
        $prompt .= "**Estilo/Personalidad:** " . $estilo_desc . "\n";
        $prompt .= "IMPORTANTE: La historia DEBE reflejar este estilo en la descripción y personalidad del guardián.\n";
    }

    if (!empty($datos['accesorios'])) {
        $prompt .= "\n**Accesorios/Cristales:** " . $datos['accesorios'] . "\n";
        $prompt .= "IMPORTANTE: Mencioná estos accesorios y explicá qué HACE cada cristal.\n";
    }

    if (!empty($datos['tema'])) {
        $prompt .= "\n**Tema libre:** " . $datos['tema'] . "\n";
        $prompt .= "Incorporá este detalle en la historia de forma natural.\n";
    }

    // ============ FORMATO NARRATIVO ELEGIDO ============
    $prompt .= "\n\n## FORMATO NARRATIVO OBLIGATORIO\n";
    $prompt .= "**Usá este formato:** " . $formato_info['nombre'] . "\n";
    $prompt .= "**Descripción:** " . $formato_info['descripcion'] . "\n";
    $prompt .= "**Estructura:** " . $formato_info['estructura'] . "\n";
    $prompt .= "\nIMPORTANTE: Seguí esta estructura específica. NO uses otra.\n";

    // ============ ANÁLISIS DE IMAGEN ============
    if (!empty($analisis_imagen)) {
        $prompt .= "\n\n## ANÁLISIS VISUAL DEL GUARDIÁN (inspirate en esto)\n";
        $prompt .= $analisis_imagen . "\n";
        $prompt .= "\nIMPORTANTE: Usá estos detalles visuales para hacer la historia más rica y específica.\n";
    }

    // ============ CONTEXTO DE REPETICIÓN ============
    if (!empty($contexto_repeticion)) {
        $prompt .= "\n\n## EVITAR REPETICIONES\n";
        $prompt .= $contexto_repeticion;
        $prompt .= "\nElegí valores DIFERENTES a los listados arriba para que esta historia sea única.\n";
    }

    // Elementos pre-seleccionados
    $prompt .= "\n\n## ELEMENTOS PRE-SELECCIONADOS (USAR OBLIGATORIAMENTE)\n";
    $prompt .= "\n**HOOK DE APERTURA:**\n\"" . $hook . "\"\n";
    $prompt .= "\n**SINCRODESTINO:**\n\"" . $sincro . "\"\n";

    // Instrucción final
    $genero_check = $genero === 'f' ? 'FEMENINO (ella, -a)' : 'MASCULINO (él, -o)';
    $prompt .= "\n---\n\nGENERÁ EL TEXTO DE CONVERSIÓN PARA " . strtoupper($datos['nombre'] ?? 'ESTE GUARDIÁN') . ".

CHECKLIST OBLIGATORIO:
□ GÉNERO CORRECTO: " . $genero_check . " - TODO el texto debe usar este género
□ Empezar desde el GUARDIÁN (quién es, qué trae, sus poderes)
□ Especie correcta: " . $especie . "
□ Tamaño correcto: " . ($datos['tamano_cm'] ?? 18) . "cm
□ Sin 847 años
□ Incluir sincrodestino naturalmente
□ Mensaje en primera persona del guardián
□ Cierre con loop abierto (sin vender)
□ Mencionar los ACCESORIOS/CRISTALES y explicar QUÉ HACEN
□ Generar sensación de \"ser elegido/a\"

IMPORTANTE: El texto debe hacer que el lector piense \"esto habla de mí\".
" . ($genero === 'f' ? "RECORDÁ: Es ELLA, LA, ESTA guardiana. Terminaciones en -A." : "RECORDÁ: Es ÉL, EL, ESTE guardián. Terminaciones en -O.");

    // Llamar a Claude API
    $response = wp_remote_post('https://api.anthropic.com/v1/messages', [
        'timeout' => 60,
        'headers' => [
            'Content-Type' => 'application/json',
            'x-api-key' => $api_key,
            'anthropic-version' => '2023-06-01'
        ],
        'body' => json_encode([
            'model' => 'claude-sonnet-4-20250514',
            'max_tokens' => 2500,
            'temperature' => 0.5,
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ]
        ])
    ]);

    if (is_wp_error($response)) {
        return ['success' => false, 'error' => $response->get_error_message()];
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);

    if (isset($body['error'])) {
        return ['success' => false, 'error' => $body['error']['message'] ?? 'Error de API'];
    }

    $historia = $body['content'][0]['text'] ?? '';

    // Post-procesamiento: corregir errores comunes
    $correcciones = [
        'aveces' => 'a veces',
        'enserio' => 'en serio',
        'talvez' => 'tal vez',
        'conciente' => 'consciente',
        'llegastes' => 'llegaste',
        'vistes' => 'viste',
        'hicistes' => 'hiciste',
        '847' => strval(rand(200, 1200))
    ];

    foreach ($correcciones as $mal => $bien) {
        $historia = str_ireplace($mal, $bien, $historia);
    }

    // Correcciones de género
    if ($genero === 'f') {
        // Corregir si quedó en masculino cuando debería ser femenino
        $historia = preg_replace('/\bel guardián\b/i', 'la guardiana', $historia);
        $historia = preg_replace('/\bun guardián\b/i', 'una guardiana', $historia);
        $historia = preg_replace('/\beste guardián\b/i', 'esta guardiana', $historia);
        $historia = preg_replace('/\bes un duende\b/i', 'es una duenda', $historia);
        $historia = preg_replace('/\bel duende\b/i', 'la duenda', $historia);
        $historia = preg_replace('/\bun duende\b/i', 'una duenda', $historia);
        $historia = preg_replace('/\beste duende\b/i', 'esta duenda', $historia);
        // Pixies siempre femeninas
        if ($especie === 'pixie') {
            $historia = preg_replace('/\bes una? duend[ea]\b/i', 'es una pixie', $historia);
            $historia = preg_replace('/\bl[ao] duend[ea]\b/i', 'la pixie', $historia);
            $historia = preg_replace('/\bun[ao] duend[ea]\b/i', 'una pixie', $historia);
        }
    } else {
        // Corregir si quedó en femenino cuando debería ser masculino
        $historia = preg_replace('/\bla guardiana\b/i', 'el guardián', $historia);
        $historia = preg_replace('/\buna guardiana\b/i', 'un guardián', $historia);
        $historia = preg_replace('/\besta guardiana\b/i', 'este guardián', $historia);
        $historia = preg_replace('/\bla duenda\b/i', 'el duende', $historia);
        $historia = preg_replace('/\buna duenda\b/i', 'un duende', $historia);
        $historia = preg_replace('/\besta duenda\b/i', 'este duende', $historia);
    }

    return [
        'success' => true,
        'historia' => $historia,
        'hook_usado' => $hook,
        'sincrodestino_usado' => $sincro,
        'genero_usado' => $genero,
        'formato_usado' => $formato_info['nombre'],
        'analisis_imagen' => !empty($analisis_imagen) ? 'Sí' : 'No'
    ];
}

// ============================================
// METABOX EN EDICIÓN DE PRODUCTO
// ============================================

add_action('add_meta_boxes', 'duendes_agregar_metabox_historias');

function duendes_agregar_metabox_historias() {
    add_meta_box(
        'duendes_generador_historia',
        '✨ Generador de Historias',
        'duendes_metabox_historias_contenido',
        'product',
        'normal',
        'high'
    );
}

function duendes_metabox_historias_contenido($post) {
    $producto = wc_get_product($post->ID);
    if (!$producto) {
        echo '<p>Error: No se pudo cargar el producto.</p>';
        return;
    }

    // Obtener datos existentes del producto
    $nombre = $producto->get_name();

    // ====== PRIORIDAD 1: Leer de la Ficha del Guardián ======
    $ficha = get_post_meta($post->ID, '_duendes_ficha', true) ?: [];

    $especie = '';
    $tamano_cm = '';
    $accesorios = '';
    $categoria_principal = '';

    // Especie desde ficha
    if (!empty($ficha['especie'])) {
        $especie = $ficha['especie'];
    }

    // Tamaño desde ficha - PRIORIDAD a tamano_cm
    if (!empty($ficha['tamano_cm'])) {
        $tamano_cm = $ficha['tamano_cm'];
    } elseif (!empty($ficha['altura_cm'])) {
        $tamano_cm = $ficha['altura_cm'];
    } elseif (!empty($ficha['tamano'])) {
        // Si es un nombre de tamaño, convertir a cm aproximado
        $mapeo_tamanos = [
            'mini' => 10, 'mini_especial' => 11,
            'mediano' => 15, 'mediano_especial' => 17, 'mediano_maestro' => 18,
            'grande' => 22, 'grande_especial' => 25, 'grande_maestro' => 28,
            'gigante' => 35, 'gigante_especial' => 40, 'gigante_maestro' => 45
        ];
        $key = strtolower($ficha['tamano']);
        if (isset($mapeo_tamanos[$key])) {
            $tamano_cm = $mapeo_tamanos[$key];
        } elseif (preg_match('/(\d+)/', $ficha['tamano'], $m)) {
            $tamano_cm = $m[1];
        }
    }

    // Accesorios/Cristales desde ficha
    if (!empty($ficha['cristales']) && is_array($ficha['cristales'])) {
        $accesorios = implode(', ', $ficha['cristales']);
    } elseif (!empty($ficha['cristales'])) {
        $accesorios = $ficha['cristales'];
    }
    if (!empty($ficha['accesorios'])) {
        $accesorios .= ($accesorios ? ', ' : '') . $ficha['accesorios'];
    }

    // Categoría desde ficha
    if (!empty($ficha['categoria'])) {
        $categoria_principal = ucfirst($ficha['categoria']);
    }

    // ====== PRIORIDAD 2: Fallback a taxonomías de WooCommerce ======
    if (empty($categoria_principal)) {
        $categorias = wp_get_post_terms($post->ID, 'product_cat', ['fields' => 'names']);
        $categoria_principal = !empty($categorias) ? $categorias[0] : '';
    }

    // ====== PRIORIDAD 3: Fallback a atributos de WooCommerce ======
    if (empty($especie) || empty($tamano_cm)) {
        $atributos = $producto->get_attributes();

        foreach ($atributos as $attr_name => $attr) {
            $nombre_attr = strtolower($attr_name);
            $valor = '';

            if ($attr->is_taxonomy()) {
                $terms = wp_get_post_terms($post->ID, $attr->get_name(), ['fields' => 'names']);
                $valor = !empty($terms) ? implode(', ', $terms) : '';
            } else {
                $valor = implode(', ', $attr->get_options());
            }

            if (empty($especie) && (strpos($nombre_attr, 'especie') !== false || strpos($nombre_attr, 'tipo') !== false)) {
                $especie = $valor;
            }
            if (empty($tamano_cm) && (strpos($nombre_attr, 'altura') !== false || strpos($nombre_attr, 'tamaño') !== false || strpos($nombre_attr, 'medida') !== false || strpos($nombre_attr, 'cm') !== false)) {
                if (preg_match('/(\d+)/', $valor, $matches)) {
                    $tamano_cm = $matches[1];
                }
            }
            if (empty($accesorios) && (strpos($nombre_attr, 'accesorio') !== false || strpos($nombre_attr, 'cristal') !== false || strpos($nombre_attr, 'incluye') !== false)) {
                $accesorios = $valor;
            }
        }
    }

    // Determinar si es único (desde ficha o stock)
    $es_unico = false;
    if (!empty($ficha['recreable'])) {
        $es_unico = ($ficha['recreable'] === 'no' || $ficha['recreable'] === false);
    } else {
        $stock = $producto->get_stock_quantity();
        $es_unico = ($stock !== null && $stock <= 1);
    }

    // Nonce para seguridad
    wp_nonce_field('duendes_generar_historia', 'duendes_historia_nonce');
    ?>

    <style>
        .duendes-generador {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .duendes-generador .campo-grupo {
            margin-bottom: 15px;
        }
        .duendes-generador label {
            display: block;
            font-weight: 600;
            margin-bottom: 5px;
            color: #1d2327;
        }
        .duendes-generador input[type="text"],
        .duendes-generador input[type="number"],
        .duendes-generador select,
        .duendes-generador textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #8c8f94;
            border-radius: 4px;
            font-size: 14px;
        }
        .duendes-generador input:focus,
        .duendes-generador select:focus,
        .duendes-generador textarea:focus {
            border-color: #c9a227;
            box-shadow: 0 0 0 1px #c9a227;
            outline: none;
        }
        .duendes-generador .campos-fila {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }
        @media (max-width: 782px) {
            .duendes-generador .campos-fila {
                grid-template-columns: 1fr;
            }
        }
        .duendes-generador .campo-check {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .duendes-generador .campo-check input {
            width: auto;
        }
        .duendes-generador .btn-generar {
            background: linear-gradient(135deg, #c9a227 0%, #8b6914 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 6px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
        }
        .duendes-generador .btn-generar:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(201, 162, 39, 0.4);
        }
        .duendes-generador .btn-generar:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .duendes-generador .btn-secundario {
            background: #2271b1;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 500;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
        }
        .duendes-generador .btn-secundario:hover {
            background: #135e96;
        }
        .duendes-generador .resultado-historia {
            margin-top: 20px;
            padding: 20px;
            background: #f6f7f7;
            border: 1px solid #c3c4c7;
            border-radius: 6px;
            display: none;
        }
        .duendes-generador .resultado-historia.visible {
            display: block;
        }
        .duendes-generador .historia-texto {
            background: white;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
            line-height: 1.7;
            max-height: 400px;
            overflow-y: auto;
            white-space: pre-wrap;
            font-family: 'Georgia', serif;
            font-size: 15px;
        }
        .duendes-generador .historia-meta {
            margin-top: 15px;
            padding: 12px;
            background: #e8f0fe;
            border: 1px solid #c2d7f0;
            border-radius: 4px;
            font-size: 13px;
        }
        .duendes-generador .acciones-historia {
            margin-top: 15px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .duendes-generador .spinner-wp {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: dh-spin 1s linear infinite;
        }
        @keyframes dh-spin {
            to { transform: rotate(360deg); }
        }
        .duendes-generador .nota {
            font-size: 12px;
            color: #646970;
            margin-top: 4px;
        }
        .duendes-generador .seccion-titulo {
            font-size: 14px;
            font-weight: 600;
            color: #1d2327;
            margin: 20px 0 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
        }
        .duendes-generador .alerta {
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        .duendes-generador .alerta-error {
            background: #fcf0f0;
            border: 1px solid #d63638;
            color: #8a0000;
        }
        .duendes-generador .alerta-ok {
            background: #edfaef;
            border: 1px solid #00a32a;
            color: #005c00;
        }
    </style>

    <div class="duendes-generador">
        <?php if (!defined('ANTHROPIC_API_KEY') && !get_option('duendes_anthropic_key')): ?>
        <div class="alerta alerta-error">
            <strong>API Key no configurada.</strong> Agregá <code>define('ANTHROPIC_API_KEY', 'tu-key');</code> en wp-config.php
        </div>
        <?php endif; ?>

        <?php
        // Indicador de origen de datos
        $tiene_ficha = !empty($ficha) && (!empty($ficha['especie']) || !empty($ficha['tamano']) || !empty($ficha['altura_cm']));
        ?>
        <div class="alerta <?php echo $tiene_ficha ? 'alerta-ok' : 'alerta-error'; ?>" style="margin-bottom:15px;">
            <?php if ($tiene_ficha): ?>
                ✅ <strong>Datos desde Ficha del Guardián</strong> - Los campos se auto-completan desde la ficha.
            <?php else: ?>
                ⚠️ <strong>Sin ficha guardada</strong> - Completá los campos manualmente o usá el metabox "Ficha del Guardián" primero.
            <?php endif; ?>
        </div>

        <!-- Datos del guardián -->
        <div class="campos-fila" style="grid-template-columns: 2fr 1fr 1fr 1fr;">
            <div class="campo-grupo">
                <label for="dh_nombre">Nombre del Guardián</label>
                <input type="text" id="dh_nombre" value="<?php echo esc_attr($nombre); ?>" />
            </div>

            <div class="campo-grupo">
                <label for="dh_genero">Género <strong style="color:#c9a227">*</strong></label>
                <select id="dh_genero">
                    <option value="m">♂ Masculino</option>
                    <option value="f">♀ Femenino</option>
                </select>
                <p class="nota">Determina cómo se le trata en la historia</p>
            </div>

            <div class="campo-grupo">
                <label for="dh_especie">Especie</label>
                <select id="dh_especie">
                    <optgroup label="🧝 Clásicos">
                        <option value="duende" <?php selected(strtolower($especie), 'duende'); ?>>Duende</option>
                        <option value="pixie" <?php selected(strtolower($especie), 'pixie'); ?>>Pixie</option>
                        <option value="elfo" <?php selected(strtolower($especie), 'elfo'); ?>>Elfo</option>
                        <option value="hada" <?php selected(strtolower($especie), 'hada'); ?>>Hada</option>
                        <option value="gnomo" <?php selected(strtolower($especie), 'gnomo'); ?>>Gnomo</option>
                        <option value="leprechaun" <?php selected(strtolower($especie), 'leprechaun'); ?>>Leprechaun</option>
                    </optgroup>
                    <optgroup label="🔮 Místicos">
                        <option value="mago" <?php selected(strtolower($especie), 'mago'); ?>>Mago</option>
                        <option value="hechicero" <?php selected(strtolower($especie), 'hechicero'); ?>>Hechicero</option>
                        <option value="brujo" <?php selected(strpos(strtolower($especie), 'bruj') !== false); ?>>Brujo</option>
                        <option value="chaman" <?php selected(strtolower($especie), 'chaman'); ?>>Chamán</option>
                        <option value="druida" <?php selected(strtolower($especie), 'druida'); ?>>Druida</option>
                        <option value="oraculo" <?php selected(strtolower($especie), 'oraculo'); ?>>Oráculo</option>
                        <option value="clarividente" <?php selected(strtolower($especie), 'clarividente'); ?>>Clarividente</option>
                        <option value="alquimista" <?php selected(strtolower($especie), 'alquimista'); ?>>Alquimista</option>
                        <option value="mistico" <?php selected(strtolower($especie), 'mistico'); ?>>Místico</option>
                    </optgroup>
                    <optgroup label="⚔️ Guerreros">
                        <option value="vikingo" <?php selected(strpos(strtolower($especie), 'viking') !== false); ?>>Vikingo</option>
                        <option value="guerrero" <?php selected(strtolower($especie), 'guerrero'); ?>>Guerrero</option>
                        <option value="guardian" <?php selected(strtolower($especie), 'guardian'); ?>>Guardián</option>
                        <option value="protector" <?php selected(strtolower($especie), 'protector'); ?>>Protector</option>
                    </optgroup>
                    <optgroup label="🌿 Naturaleza">
                        <option value="sanador" <?php selected(strtolower($especie), 'sanador'); ?>>Sanador</option>
                        <option value="sembrador" <?php selected(strtolower($especie), 'sembrador'); ?>>Sembrador</option>
                        <option value="yuyero" <?php selected(strtolower($especie), 'yuyero'); ?>>Yuyero</option>
                        <option value="botanico" <?php selected(strtolower($especie), 'botanico'); ?>>Botánico</option>
                    </optgroup>
                    <optgroup label="🎭 Roles">
                        <option value="maestro" <?php selected(strtolower($especie), 'maestro'); ?>>Maestro</option>
                        <option value="sabio" <?php selected(strtolower($especie), 'sabio'); ?>>Sabio</option>
                        <option value="mensajero" <?php selected(strtolower($especie), 'mensajero'); ?>>Mensajero</option>
                        <option value="companero" <?php selected(strtolower($especie), 'companero'); ?>>Compañero</option>
                        <option value="viajero" <?php selected(strtolower($especie), 'viajero'); ?>>Viajero</option>
                        <option value="guardian_astral" <?php selected(strtolower($especie), 'guardian_astral'); ?>>Guardián Astral</option>
                    </optgroup>
                    <optgroup label="🌎 Culturales">
                        <option value="gaucho" <?php selected(strtolower($especie), 'gaucho'); ?>>Gaucho</option>
                        <option value="mexicano" <?php selected(strtolower($especie), 'mexicano'); ?>>Mexicano</option>
                    </optgroup>
                    <optgroup label="🌟 Arquetipos">
                        <option value="merlin" <?php selected(strtolower($especie), 'merlin'); ?>>Merlín</option>
                        <option value="morgana" <?php selected(strtolower($especie), 'morgana'); ?>>Morgana</option>
                        <option value="gandalf" <?php selected(strtolower($especie), 'gandalf'); ?>>Gandalf</option>
                    </optgroup>
                </select>
            </div>

            <div class="campo-grupo">
                <label for="dh_tamano">Tamaño (cm) <strong style="color:#c9a227">*</strong></label>
                <input type="number" id="dh_tamano" value="<?php echo esc_attr($tamano_cm); ?>" min="5" max="50" step="1" />
                <p class="nota">Este valor se usará EXACTO en la historia</p>
            </div>
        </div>

        <div class="campos-fila">
            <div class="campo-grupo">
                <label for="dh_categoria">Categoría / Propósito</label>
                <select id="dh_categoria">
                    <optgroup label="🛡️ Protección">
                        <option value="Protección" <?php selected($categoria_principal, 'Protección'); ?>>Protección General</option>
                        <option value="Protección del Hogar" <?php selected($categoria_principal, 'Protección del Hogar'); ?>>Protección del Hogar</option>
                        <option value="Protección Energética" <?php selected($categoria_principal, 'Protección Energética'); ?>>Protección Energética</option>
                        <option value="Cortar Lazos" <?php selected($categoria_principal, 'Cortar Lazos'); ?>>Cortar Lazos Tóxicos</option>
                    </optgroup>
                    <optgroup label="💰 Abundancia">
                        <option value="Abundancia" <?php selected($categoria_principal, 'Abundancia'); ?>>Abundancia General</option>
                        <option value="Abrecaminos" <?php selected($categoria_principal, 'Abrecaminos'); ?>>Abrecaminos</option>
                        <option value="Negocios" <?php selected($categoria_principal, 'Negocios'); ?>>Negocios / Emprendimiento</option>
                        <option value="Trabajo" <?php selected($categoria_principal, 'Trabajo'); ?>>Trabajo / Oportunidades</option>
                        <option value="Fortuna" <?php selected($categoria_principal, 'Fortuna'); ?>>Fortuna / Suerte</option>
                    </optgroup>
                    <optgroup label="💕 Amor">
                        <option value="Amor" <?php selected($categoria_principal, 'Amor'); ?>>Amor General</option>
                        <option value="Amor Propio" <?php selected($categoria_principal, 'Amor Propio'); ?>>Amor Propio</option>
                        <option value="Amor de Pareja" <?php selected($categoria_principal, 'Amor de Pareja'); ?>>Amor de Pareja</option>
                        <option value="Fertilidad" <?php selected($categoria_principal, 'Fertilidad'); ?>>Fertilidad / Maternidad</option>
                        <option value="Familia" <?php selected($categoria_principal, 'Familia'); ?>>Familia / Armonía</option>
                    </optgroup>
                    <optgroup label="💚 Sanación">
                        <option value="Sanación" <?php selected($categoria_principal, 'Sanación'); ?>>Sanación General</option>
                        <option value="Sanación Emocional" <?php selected($categoria_principal, 'Sanación Emocional'); ?>>Sanación Emocional</option>
                        <option value="Duelo" <?php selected($categoria_principal, 'Duelo'); ?>>Duelo / Pérdidas</option>
                        <option value="Calma" <?php selected($categoria_principal, 'Calma'); ?>>Calma / Ansiedad</option>
                    </optgroup>
                    <optgroup label="🔮 Sabiduría">
                        <option value="Sabiduría" <?php selected($categoria_principal, 'Sabiduría'); ?>>Sabiduría General</option>
                        <option value="Clarividencia" <?php selected($categoria_principal, 'Clarividencia'); ?>>Clarividencia / Intuición</option>
                        <option value="Estudios" <?php selected($categoria_principal, 'Estudios'); ?>>Estudios / Concentración</option>
                        <option value="Decisiones" <?php selected($categoria_principal, 'Decisiones'); ?>>Tomar Decisiones</option>
                        <option value="Propósito" <?php selected($categoria_principal, 'Propósito'); ?>>Encontrar Propósito</option>
                    </optgroup>
                    <optgroup label="🦋 Transformación">
                        <option value="Transformación" <?php selected($categoria_principal, 'Transformación'); ?>>Transformación Personal</option>
                        <option value="Nuevos Comienzos" <?php selected($categoria_principal, 'Nuevos Comienzos'); ?>>Nuevos Comienzos</option>
                        <option value="Soltar" <?php selected($categoria_principal, 'Soltar'); ?>>Soltar / Dejar Ir</option>
                        <option value="Superar Miedos" <?php selected($categoria_principal, 'Superar Miedos'); ?>>Superar Miedos</option>
                    </optgroup>
                    <optgroup label="🌿 Naturaleza">
                        <option value="Naturaleza" <?php selected($categoria_principal, 'Naturaleza'); ?>>Conexión con Naturaleza</option>
                        <option value="Bosque" <?php selected($categoria_principal, 'Bosque'); ?>>Bosque / Raíces</option>
                        <option value="Plantas" <?php selected($categoria_principal, 'Plantas'); ?>>Plantas / Yuyos</option>
                    </optgroup>
                    <optgroup label="✈️ Viajes">
                        <option value="Viajero" <?php selected($categoria_principal, 'Viajero'); ?>>Viajero/a</option>
                        <option value="Aventura" <?php selected($categoria_principal, 'Aventura'); ?>>Aventura</option>
                        <option value="Protección en Viajes" <?php selected($categoria_principal, 'Protección en Viajes'); ?>>Protección en Viajes</option>
                    </optgroup>
                </select>
            </div>

            <div class="campo-grupo">
                <label for="dh_estilo">Estilo / Personalidad</label>
                <select id="dh_estilo">
                    <option value="">Sin estilo específico</option>
                    <optgroup label="🎭 Culturales">
                        <option value="gaucho">Gaucho/Gaucha</option>
                        <option value="mexicano">Mexicano/Mexicana</option>
                        <option value="celta">Celta</option>
                        <option value="nordico">Nórdico/a</option>
                        <option value="andino">Andino/a</option>
                        <option value="oriental">Oriental</option>
                    </optgroup>
                    <optgroup label="✨ Apariencia">
                        <option value="fancy">Fancy / De Gala</option>
                        <option value="elegante">Elegante</option>
                        <option value="rustico">Rústico/a</option>
                        <option value="bohemio">Bohemio/a</option>
                        <option value="mistico">Místico/a</option>
                        <option value="salvaje">Salvaje</option>
                    </optgroup>
                    <optgroup label="🚶 Rol / Actitud">
                        <option value="viajero">Viajero/a</option>
                        <option value="mensajero">Mensajero/a</option>
                        <option value="sembrador">Sembrador/a</option>
                        <option value="guardian">Guardián/Guardiana</option>
                        <option value="companero">Compañero/a Fiel</option>
                        <option value="protector">Protector/a</option>
                        <option value="guia">Guía Espiritual</option>
                    </optgroup>
                    <optgroup label="📚 Especiales">
                        <option value="estudiante">Para Estudiantes</option>
                        <option value="emprendedor">Para Emprendedores</option>
                        <option value="mama">Para Mamás</option>
                        <option value="ninos">Para Niños</option>
                        <option value="artista">Para Artistas</option>
                        <option value="sanador">Para Sanadores</option>
                    </optgroup>
                    <optgroup label="💫 Personalidad">
                        <option value="dulce">Dulce / Tierno</option>
                        <option value="serio">Serio / Solemne</option>
                        <option value="jugueton">Juguetón/a</option>
                        <option value="sabio">Sabio/a</option>
                        <option value="intenso">Intenso/a</option>
                        <option value="tranquilo">Tranquilo/a</option>
                        <option value="picaro">Pícaro/a</option>
                    </optgroup>
                </select>
            </div>

            <div class="campo-grupo campo-check" style="padding-top: 28px;">
                <input type="checkbox" id="dh_unico" <?php checked($es_unico); ?> />
                <label for="dh_unico" style="display: inline; font-weight: normal;">Es pieza única</label>
            </div>
        </div>

        <div class="campo-grupo">
            <label for="dh_tema">Tema libre (opcional)</label>
            <input type="text" id="dh_tema" placeholder="Ej: para personas que cuidan a otros, para quienes buscan su camino..." />
            <p class="nota">Agregá cualquier detalle extra que quieras que aparezca en la historia</p>
        </div>

        <div class="campo-grupo">
            <label for="dh_accesorios">Accesorios / Cristales que incluye</label>
            <textarea id="dh_accesorios" rows="2" placeholder="Ej: citrino en el pecho, sombrero con lavanda, escoba de madera..."><?php echo esc_textarea($accesorios); ?></textarea>
            <p class="nota">La historia explicará el significado de cada accesorio</p>
        </div>

        <p class="seccion-titulo">🖼️ Análisis Visual (Opcional)</p>

        <div class="campo-grupo">
            <?php
            $imagen_url = '';
            $imagen_id = $producto->get_image_id();
            if ($imagen_id) {
                $imagen_url = wp_get_attachment_url($imagen_id);
            }
            ?>
            <?php if ($imagen_url): ?>
            <div style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 15px;">
                <img src="<?php echo esc_url($imagen_url); ?>" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 2px solid #c9a227;" />
                <div>
                    <button type="button" class="btn-secundario" id="btn_analizar_imagen" data-imagen="<?php echo esc_url($imagen_url); ?>">
                        🔍 Analizar Imagen con IA
                    </button>
                    <p class="nota">Claude Vision analizará la imagen para inspirar la historia</p>
                    <div id="resultado_analisis" style="display: none; margin-top: 10px; padding: 10px; background: #f0f6ff; border: 1px solid #c2d7f0; border-radius: 4px; font-size: 13px; max-height: 200px; overflow-y: auto;"></div>
                </div>
            </div>
            <?php else: ?>
            <p class="alerta alerta-error" style="margin: 0;">⚠️ Este producto no tiene imagen. Subí una imagen primero para poder analizarla.</p>
            <?php endif; ?>
            <input type="hidden" id="dh_analisis_imagen" value="" />
        </div>

        <p class="seccion-titulo">📝 Formato Narrativo</p>

        <div class="campos-fila" style="grid-template-columns: 1fr 1fr;">
            <div class="campo-grupo">
                <label for="dh_formato">Estructura de la historia</label>
                <select id="dh_formato">
                    <option value="">🎲 Aleatorio (variar automáticamente)</option>
                    <?php
                    $formatos = duendes_get_formatos_narrativos();
                    foreach ($formatos as $key => $formato) {
                        echo '<option value="' . esc_attr($key) . '">' . esc_html($formato['nombre']) . ' - ' . esc_html($formato['descripcion']) . '</option>';
                    }
                    ?>
                </select>
                <p class="nota">Cada formato produce historias con estructuras diferentes</p>
            </div>

            <div class="campo-grupo campo-check" style="padding-top: 28px;">
                <input type="checkbox" id="dh_evitar_repeticion" checked />
                <label for="dh_evitar_repeticion" style="display: inline; font-weight: normal;">Evitar repetir edades y patrones ya usados</label>
            </div>
        </div>

        <p class="seccion-titulo">⚙️ Opciones avanzadas</p>

        <div class="campo-grupo">
            <label for="dh_sincrodestino">Sincrodestino personalizado (opcional)</label>
            <input type="text" id="dh_sincrodestino" placeholder="Ej: Una mariposa azul entró al taller mientras se secaba..." />
            <p class="nota">Dejalo vacío para usar uno aleatorio</p>
        </div>

        <div style="margin-top: 20px;">
            <button type="button" class="btn-generar" id="btn_generar_historia">
                <span class="texto">✨ Generar Historia</span>
                <span class="spinner-wp" style="display: none;"></span>
            </button>
        </div>

        <!-- Resultado -->
        <div class="resultado-historia" id="resultado_historia">
            <h4 style="margin-top: 0;">Historia generada:</h4>

            <div class="historia-texto" id="historia_texto"></div>

            <div class="historia-meta" id="historia_meta"></div>

            <div class="acciones-historia">
                <button type="button" class="btn-generar" id="btn_guardar_historia">
                    💾 Guardar en Producto
                </button>
                <button type="button" class="btn-secundario" id="btn_copiar_historia">
                    📋 Copiar
                </button>
                <button type="button" class="btn-secundario" id="btn_regenerar_historia">
                    🔄 Regenerar
                </button>
            </div>
        </div>
    </div>

    <script>
    jQuery(document).ready(function($) {
        const PRODUCTO_ID = <?php echo $post->ID; ?>;
        const STORAGE_KEY = 'duendes_historia_borrador_' + PRODUCTO_ID;
        let ultimaHistoria = null;
        let historiaGuardada = true; // Para trackear si se guardó

        // ============ RECUPERAR BORRADOR AL CARGAR ============
        const borrador = localStorage.getItem(STORAGE_KEY);
        if (borrador) {
            try {
                const datos = JSON.parse(borrador);
                if (datos.historia && confirm('🔄 Se encontró una historia sin guardar:\n\n"' + datos.historia.substring(0, 100) + '..."\n\n¿Querés recuperarla?')) {
                    ultimaHistoria = datos;
                    $('#historia_texto').text(datos.historia);
                    let meta = '<strong>📝 Formato:</strong> ' + (datos.formato_usado || 'Recuperado') + '<br>';
                    meta += '<strong>🎣 Hook:</strong> ' + (datos.hook_usado || 'N/A') + '<br>';
                    meta += '<strong>⚠️ BORRADOR NO GUARDADO</strong>';
                    $('#historia_meta').html(meta);
                    $('#resultado_historia').addClass('visible');
                    historiaGuardada = false;
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch(e) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }

        // ============ ADVERTENCIA AL SALIR SIN GUARDAR ============
        $(window).on('beforeunload', function(e) {
            if (ultimaHistoria && !historiaGuardada) {
                e.preventDefault();
                return '⚠️ Tenés una historia sin guardar. ¿Seguro querés salir?';
            }
        });

        // ============ ANALIZAR IMAGEN ============
        $('#btn_analizar_imagen').on('click', function() {
            const btn = $(this);
            const imagenUrl = btn.data('imagen');

            if (!imagenUrl) {
                alert('No hay imagen para analizar');
                return;
            }

            btn.prop('disabled', true).text('🔍 Analizando...');

            $.post(ajaxurl, {
                action: 'duendes_analizar_imagen',
                nonce: '<?php echo wp_create_nonce('duendes_analizar_imagen'); ?>',
                imagen_url: imagenUrl,
                nombre: $('#dh_nombre').val(),
                categoria: $('#dh_categoria').val()
            }, function(response) {
                if (response.success && response.data.analisis) {
                    $('#dh_analisis_imagen').val(response.data.analisis);
                    $('#resultado_analisis').html('<strong>Análisis:</strong><br>' + response.data.analisis.replace(/\n/g, '<br>')).show();
                    btn.text('✅ Analizado');
                } else {
                    alert('Error: ' + (response.data || 'No se pudo analizar la imagen'));
                    btn.text('🔍 Analizar Imagen con IA');
                }
            }).fail(function() {
                alert('Error de conexión');
                btn.text('🔍 Analizar Imagen con IA');
            }).always(function() {
                btn.prop('disabled', false);
            });
        });

        // ============ GENERAR HISTORIA ============
        $('#btn_generar_historia, #btn_regenerar_historia').on('click', function() {
            const btn = $('#btn_generar_historia');
            const spinner = btn.find('.spinner-wp');
            const texto = btn.find('.texto');

            // Recopilar datos
            const datos = {
                action: 'duendes_generar_historia',
                nonce: '<?php echo wp_create_nonce('duendes_generar_historia'); ?>',
                producto_id: PRODUCTO_ID,
                nombre: $('#dh_nombre').val(),
                genero: $('#dh_genero').val(),
                especie: $('#dh_especie').val(),
                tamano_cm: parseInt($('#dh_tamano').val()) || 18,
                categoria: $('#dh_categoria').val(),
                estilo: $('#dh_estilo').val(),
                accesorios: $('#dh_accesorios').val(),
                es_unico: $('#dh_unico').is(':checked') ? 1 : 0,
                tema: $('#dh_tema').val(),
                sincrodestino: $('#dh_sincrodestino').val(),
                // Nuevos parámetros
                formato: $('#dh_formato').val(),
                evitar_repeticion: $('#dh_evitar_repeticion').is(':checked') ? 1 : 0,
                analisis_imagen: $('#dh_analisis_imagen').val()
            };

            // Validar
            if (!datos.nombre) {
                alert('Por favor ingresá el nombre del guardián');
                return;
            }
            if (!datos.tamano_cm || datos.tamano_cm < 5 || datos.tamano_cm > 50) {
                alert('Por favor ingresá un tamaño válido (5-50 cm)');
                return;
            }

            // UI: cargando
            btn.prop('disabled', true);
            spinner.show();
            texto.text('Generando...');

            // Llamar AJAX
            $.post(ajaxurl, datos, function(response) {
                if (response.success) {
                    ultimaHistoria = response.data;
                    historiaGuardada = false; // Marcar como NO guardada

                    // ⭐ AUTO-GUARDAR BORRADOR EN LOCALSTORAGE
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));

                    // Mostrar historia
                    $('#historia_texto').text(response.data.historia);

                    // Mostrar meta
                    let meta = '<strong>📝 Formato:</strong> ' + (response.data.formato_usado || 'Estándar') + '<br>';
                    meta += '<strong>🎣 Hook usado:</strong> ' + response.data.hook_usado + '<br>';
                    meta += '<strong>✨ Sincrodestino:</strong> ' + response.data.sincrodestino_usado;
                    if (response.data.analisis_imagen === 'Sí') {
                        meta += '<br><strong>🖼️ Imagen analizada:</strong> Sí';
                    }
                    meta += '<br><strong style="color:#d63638;">⚠️ NO GUARDADA - Tocá "Guardar en Producto"</strong>';
                    $('#historia_meta').html(meta);

                    // Mostrar resultado
                    $('#resultado_historia').addClass('visible');
                } else {
                    alert('Error: ' + (response.data || 'No se pudo generar la historia'));
                }
            }).fail(function(xhr, status, error) {
                alert('Error de conexión: ' + error);
            }).always(function() {
                btn.prop('disabled', false);
                spinner.hide();
                texto.text('✨ Generar Historia');
            });
        });

        // Guardar en producto
        $('#btn_guardar_historia').on('click', function() {
            if (!ultimaHistoria) return;

            const btn = $(this);
            btn.prop('disabled', true).text('Guardando...');

            // Enviar historia + datos de la ficha para sincronizar
            $.post(ajaxurl, {
                action: 'duendes_guardar_historia',
                nonce: '<?php echo wp_create_nonce('duendes_guardar_historia'); ?>',
                producto_id: PRODUCTO_ID,
                historia: ultimaHistoria.historia,
                // Datos de la ficha para sincronizar
                ficha_nombre: $('#dh_nombre').val(),
                ficha_genero: $('#dh_genero').val(),
                ficha_especie: $('#dh_especie').val(),
                ficha_tamano: $('#dh_tamano').val(),
                ficha_categoria: $('#dh_categoria').val(),
                ficha_estilo: $('#dh_estilo').val(),
                ficha_accesorios: $('#dh_accesorios').val(),
                ficha_es_unico: $('#dh_unico').is(':checked') ? 1 : 0
            }, function(response) {
                if (response.success) {
                    // ⭐ MARCAR COMO GUARDADA Y LIMPIAR BORRADOR
                    historiaGuardada = true;
                    localStorage.removeItem(STORAGE_KEY);
                    alert('✅ Historia guardada correctamente.');
                    location.reload();
                } else {
                    alert('Error: ' + (response.data || 'No se pudo guardar'));
                }
            }).always(function() {
                btn.prop('disabled', false).text('💾 Guardar en Producto');
            });
        });

        // Copiar al portapapeles
        $('#btn_copiar_historia').on('click', function() {
            if (!ultimaHistoria) return;

            navigator.clipboard.writeText(ultimaHistoria.historia).then(function() {
                const btn = $('#btn_copiar_historia');
                const textoOriginal = btn.text();
                btn.text('✅ Copiado!');
                setTimeout(() => btn.text(textoOriginal), 2000);
            });
        });
    });
    </script>

    <?php
}

// ============================================
// AJAX HANDLERS
// ============================================

// ============ AJAX: Analizar Imagen ============
add_action('wp_ajax_duendes_analizar_imagen', 'duendes_ajax_analizar_imagen');

function duendes_ajax_analizar_imagen() {
    check_ajax_referer('duendes_analizar_imagen', 'nonce');

    if (!current_user_can('edit_products')) {
        wp_send_json_error('Sin permisos');
    }

    $imagen_url = esc_url_raw($_POST['imagen_url'] ?? '');
    $nombre = sanitize_text_field($_POST['nombre'] ?? '');
    $categoria = sanitize_text_field($_POST['categoria'] ?? '');

    if (empty($imagen_url)) {
        wp_send_json_error('No se proporcionó imagen');
    }

    $resultado = duendes_analizar_imagen($imagen_url, $nombre, $categoria);

    if (isset($resultado['error'])) {
        wp_send_json_error($resultado['error']);
    } elseif (isset($resultado['analisis'])) {
        wp_send_json_success(['analisis' => $resultado['analisis']]);
    } else {
        wp_send_json_error('Respuesta inesperada del analizador');
    }
}

// ============ AJAX: Generar Historia ============
add_action('wp_ajax_duendes_generar_historia', 'duendes_ajax_generar_historia');

function duendes_ajax_generar_historia() {
    check_ajax_referer('duendes_generar_historia', 'nonce');

    if (!current_user_can('edit_products')) {
        wp_send_json_error('Sin permisos');
    }

    $datos = [
        'nombre' => sanitize_text_field($_POST['nombre'] ?? ''),
        'genero' => sanitize_text_field($_POST['genero'] ?? 'm'),
        'especie' => sanitize_text_field($_POST['especie'] ?? 'duende'),
        'tamano_cm' => intval($_POST['tamano_cm'] ?? 18),
        'categoria' => sanitize_text_field($_POST['categoria'] ?? 'Protección'),
        'estilo' => sanitize_text_field($_POST['estilo'] ?? ''),
        'accesorios' => sanitize_textarea_field($_POST['accesorios'] ?? ''),
        'es_unico' => ($_POST['es_unico'] ?? 0) == 1,
        'tema' => sanitize_text_field($_POST['tema'] ?? ''),
        'sincrodestino' => sanitize_text_field($_POST['sincrodestino'] ?? ''),
        // Nuevos parámetros
        'formato' => sanitize_text_field($_POST['formato'] ?? ''),
        'evitar_repeticion' => ($_POST['evitar_repeticion'] ?? 0) == 1,
        'analisis_imagen' => sanitize_textarea_field($_POST['analisis_imagen'] ?? '')
    ];

    $resultado = duendes_generar_historia_claude($datos);

    if ($resultado['success']) {
        wp_send_json_success($resultado);
    } else {
        wp_send_json_error($resultado['error']);
    }
}

add_action('wp_ajax_duendes_guardar_historia', 'duendes_ajax_guardar_historia');

function duendes_ajax_guardar_historia() {
    check_ajax_referer('duendes_guardar_historia', 'nonce');

    if (!current_user_can('edit_products')) {
        wp_send_json_error('Sin permisos');
    }

    $producto_id = intval($_POST['producto_id'] ?? 0);
    $historia = wp_kses_post($_POST['historia'] ?? '');

    if (!$producto_id || !$historia) {
        wp_send_json_error('Datos incompletos');
    }

    // Convertir markdown a HTML
    $historia_html = $historia;
    $historia_html = preg_replace('/\*\*([^*]+)\*\*/', '<strong>$1</strong>', $historia_html);
    $historia_html = preg_replace('/\*"([^"]+)"\*/', '<em>"$1"</em>', $historia_html);
    $historia_html = preg_replace('/\*([^*]+)\*/', '<em>$1</em>', $historia_html);

    // Convertir párrafos
    $parrafos = explode("\n\n", $historia_html);
    $historia_html = '';
    foreach ($parrafos as $p) {
        $p = trim($p);
        if ($p) {
            $historia_html .= '<p>' . nl2br($p) . '</p>';
        }
    }

    // Agregar marcador
    $marcador = '<!-- historia-generador-duendes-v2 -->';
    $historia_html = $marcador . "\n" . $historia_html;

    // Actualizar producto
    $producto = wc_get_product($producto_id);
    if (!$producto) {
        wp_send_json_error('Producto no encontrado');
    }

    $producto->set_description($historia_html);
    $producto->save();

    // ============ SINCRONIZAR FICHA DEL GUARDIÁN ============
    $ficha_actual = get_post_meta($producto_id, '_duendes_ficha', true);
    if (!is_array($ficha_actual)) {
        $ficha_actual = [];
    }

    // FORZAR actualización del tamaño (el problema principal)
    $nuevo_tamano = intval($_POST['ficha_tamano'] ?? 0);
    if ($nuevo_tamano > 0) {
        // Borrar TODOS los campos de tamaño viejos y poner el nuevo
        unset($ficha_actual['altura_cm']);
        unset($ficha_actual['tamano']);
        $ficha_actual['tamano_cm'] = $nuevo_tamano;
    }

    // Actualizar otros campos
    if (isset($_POST['ficha_especie']) && $_POST['ficha_especie'] !== '') {
        $ficha_actual['especie'] = sanitize_text_field($_POST['ficha_especie']);
    }
    if (isset($_POST['ficha_categoria']) && $_POST['ficha_categoria'] !== '') {
        $ficha_actual['categoria'] = sanitize_text_field($_POST['ficha_categoria']);
    }
    if (isset($_POST['ficha_estilo'])) {
        $ficha_actual['estilo'] = sanitize_text_field($_POST['ficha_estilo']);
    }
    if (isset($_POST['ficha_accesorios'])) {
        $ficha_actual['accesorios'] = sanitize_textarea_field($_POST['ficha_accesorios']);
    }
    if (isset($_POST['ficha_genero']) && $_POST['ficha_genero'] !== '') {
        $ficha_actual['genero'] = sanitize_text_field($_POST['ficha_genero']);
    }
    if (isset($_POST['ficha_es_unico'])) {
        $ficha_actual['recreable'] = ($_POST['ficha_es_unico'] == 1) ? 'no' : 'si';
    }

    // Guardar ficha actualizada
    update_post_meta($producto_id, '_duendes_ficha', $ficha_actual);

    // DEBUG: Log para verificar
    error_log('DUENDES FICHA GUARDADA: producto=' . $producto_id . ' tamano=' . $nuevo_tamano . ' ficha=' . print_r($ficha_actual, true));

    wp_send_json_success('Historia y ficha guardadas');
}

// ============================================
// ESTILOS ADMIN
// ============================================

add_action('admin_head', 'duendes_generador_admin_styles');

function duendes_generador_admin_styles() {
    global $pagenow, $typenow;

    if ($pagenow === 'post.php' && $typenow === 'product') {
        echo '<style>
            #duendes_generador_historia {
                border: 2px solid #c9a227;
            }
            #duendes_generador_historia .postbox-header {
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            }
            #duendes_generador_historia .postbox-header h2 {
                color: #c9a227 !important;
            }
            #duendes_generador_historia .handle-actions button {
                color: #c9a227 !important;
            }
        </style>';
    }
}
