<?php
/**
 * Generador de Canalizaciones con Claude API
 *
 * Genera canalizaciones COMPLETAS con 5 secciones:
 * - Canalización (GENERADA)
 * - Mensaje del Ser (GENERADO)
 * - Cuidados (GENERADO - NUNCA caramelos ni licor)
 * - Historia del Guardián (COPIADA del producto)
 * - Ficha del Guardián (COPIADA del producto)
 */

if (!defined('ABSPATH')) exit;

class Duendes_Claude_Generator {

    private $api_key;
    private $model = 'claude-sonnet-4-20250514';
    private $api_url = 'https://api.anthropic.com/v1/messages';

    public function __construct() {
        $this->api_key = defined('ANTHROPIC_API_KEY') ? ANTHROPIC_API_KEY : get_option('duendes_anthropic_key', '');
    }

    /**
     * Generar canalizacion completa
     */
    public function generar($canalizacion_id) {
        if (empty($this->api_key)) {
            return new WP_Error('no_api_key', 'ANTHROPIC_API_KEY no configurada. Valor actual: ' . (defined('ANTHROPIC_API_KEY') ? 'definida pero vacia' : 'no definida'));
        }

        // Verificar que existe
        $post = get_post($canalizacion_id);
        if (!$post) {
            return new WP_Error('no_post', 'Post no encontrado con ID: ' . $canalizacion_id);
        }
        if ($post->post_type !== 'duendes_canalizacion') {
            return new WP_Error('wrong_type', 'Post existe pero no es canalizacion. Tipo: ' . $post->post_type);
        }

        // Marcar como generando
        update_post_meta($canalizacion_id, '_estado', 'generando');

        // Obtener datos
        $datos = $this->preparar_datos($canalizacion_id);
        if (is_wp_error($datos)) {
            update_post_meta($canalizacion_id, '_estado', 'pendiente');
            return $datos;
        }

        // Construir prompt
        $prompt = $this->construir_prompt($datos);

        // Log para debug
        error_log('DUENDES GENERATOR: Llamando a Claude para canalizacion ' . $canalizacion_id);
        error_log('DUENDES GENERATOR: Guardian: ' . ($datos['guardian']['nombre'] ?? 'sin nombre'));

        // Llamar a Claude
        $response = $this->llamar_claude($prompt);

        // Log resultado
        if (is_wp_error($response)) {
            error_log('DUENDES GENERATOR ERROR: ' . $response->get_error_message());
        } else {
            error_log('DUENDES GENERATOR: Exito! Contenido generado: ' . strlen($response['contenido']) . ' chars');
        }

        if (is_wp_error($response)) {
            update_post_meta($canalizacion_id, '_estado', 'pendiente');
            update_post_meta($canalizacion_id, '_ultimo_error', $response->get_error_message());
            return $response;
        }

        // Construir contenido completo (Claude + secciones copiadas)
        $contenido_completo = $this->construir_contenido_completo($response['contenido'], $datos);

        // Guardar resultado
        wp_update_post([
            'ID' => $canalizacion_id,
            'post_content' => $contenido_completo,
        ]);

        // Guardar secciones por separado para acceso fácil
        update_post_meta($canalizacion_id, '_contenido_generado', $response['contenido']);
        update_post_meta($canalizacion_id, '_historia_guardian', $datos['guardian']['historia']);
        update_post_meta($canalizacion_id, '_ficha_guardian', $datos['guardian']['ficha']);
        update_post_meta($canalizacion_id, '_estado', 'lista');
        update_post_meta($canalizacion_id, '_fecha_generada', current_time('mysql'));

        // Disparar accion
        do_action('duendes_canalizacion_lista', $canalizacion_id);

        return [
            'contenido' => $contenido_completo,
            'version' => 1,
        ];
    }

    /**
     * Regenerar con instrucciones
     */
    public function regenerar($canalizacion_id, $instrucciones = '') {
        if (empty($this->api_key)) {
            return new WP_Error('no_api_key', 'ANTHROPIC_API_KEY no configurada');
        }

        // Guardar version anterior
        Duendes_Canal_CPT::guardar_version($canalizacion_id, $instrucciones ?: 'Regeneracion manual');

        // Marcar como generando
        update_post_meta($canalizacion_id, '_estado', 'generando');

        // Obtener datos
        $datos = $this->preparar_datos($canalizacion_id);
        if (is_wp_error($datos)) {
            update_post_meta($canalizacion_id, '_estado', 'lista');
            return $datos;
        }

        // Agregar version anterior e instrucciones
        $contenido_anterior = get_post_meta($canalizacion_id, '_contenido_generado', true);
        $datos['version_anterior'] = $contenido_anterior;
        $datos['instrucciones_regeneracion'] = $instrucciones;

        // Construir prompt de regeneracion
        $prompt = $this->construir_prompt_regeneracion($datos);

        // Llamar a Claude
        $response = $this->llamar_claude($prompt);

        if (is_wp_error($response)) {
            update_post_meta($canalizacion_id, '_estado', 'lista');
            return $response;
        }

        // Construir contenido completo
        $contenido_completo = $this->construir_contenido_completo($response['contenido'], $datos);

        // Guardar resultado
        wp_update_post([
            'ID' => $canalizacion_id,
            'post_content' => $contenido_completo,
        ]);

        update_post_meta($canalizacion_id, '_contenido_generado', $response['contenido']);
        update_post_meta($canalizacion_id, '_estado', 'lista');
        update_post_meta($canalizacion_id, '_fecha_generada', current_time('mysql'));

        $versiones = get_post_meta($canalizacion_id, '_versiones', true) ?: [];

        return [
            'contenido' => $contenido_completo,
            'version' => count($versiones) + 1,
        ];
    }

    /**
     * Preparar datos para el prompt
     * Incluye historia y ficha del producto
     */
    private function preparar_datos($canalizacion_id) {
        $post = get_post($canalizacion_id);
        if (!$post) {
            return new WP_Error('no_post', 'Canalizacion no encontrada');
        }

        $orden_id = get_post_meta($canalizacion_id, '_orden_id', true);
        $guardian_id = get_post_meta($canalizacion_id, '_guardian_id', true);
        $product = wc_get_product($guardian_id);

        // Extraer historia y ficha del producto
        $historia = '';
        $ficha = '';
        $tamano = '';
        $especie = '';
        $accesorios = '';

        if ($product) {
            // La descripción larga es la HISTORIA
            $historia_raw = $product->get_description();
            // Limpiar comentarios HTML y tags innecesarios
            $historia = preg_replace('/<!--.*?-->/s', '', $historia_raw); // Quitar comentarios HTML
            $historia = strip_tags($historia, '<p><br><strong><em><b><i>'); // Solo permitir tags básicos
            $historia = preg_replace('/\s+/', ' ', $historia); // Normalizar espacios
            $historia = trim($historia);

            // La descripción corta es la FICHA (resumen)
            $ficha_raw = $product->get_short_description();
            $ficha = strip_tags($ficha_raw);
            $ficha = trim($ficha);

            // Extraer atributos del producto si existen
            $attributes = $product->get_attributes();
            foreach ($attributes as $attr_name => $attr) {
                $value = $attr->is_taxonomy()
                    ? implode(', ', wc_get_product_terms($guardian_id, $attr_name, ['fields' => 'names']))
                    : $attr->get_options()[0] ?? '';

                $name_lower = strtolower($attr_name);
                if (strpos($name_lower, 'tamano') !== false || strpos($name_lower, 'tamaño') !== false || strpos($name_lower, 'altura') !== false) {
                    $tamano = $value;
                }
                if (strpos($name_lower, 'especie') !== false || strpos($name_lower, 'tipo') !== false) {
                    $especie = $value;
                }
                if (strpos($name_lower, 'accesor') !== false || strpos($name_lower, 'detalle') !== false) {
                    $accesorios = $value;
                }
            }

            // La FICHA es la descripcion corta del producto (cosas favoritas, personalidad, etc.)
            // Si no hay descripcion corta, dejar vacio
            if (empty($ficha)) {
                $ficha = '(Este guardian no tiene ficha en la tienda)';
            }
        }

        return [
            'canalizacion_id' => $canalizacion_id,
            'orden_id' => $orden_id,
            'email' => get_post_meta($canalizacion_id, '_email', true),
            'nombre_cliente' => get_post_meta($canalizacion_id, '_nombre_cliente', true),
            'tipo_destinatario' => get_post_meta($canalizacion_id, '_tipo_destinatario', true),
            'datos_formulario' => get_post_meta($canalizacion_id, '_datos_formulario', true) ?: [],
            'guardian' => [
                'id' => $guardian_id,
                'nombre' => get_post_meta($canalizacion_id, '_guardian_nombre', true),
                'categoria' => get_post_meta($canalizacion_id, '_guardian_categoria', true),
                'imagen' => get_post_meta($canalizacion_id, '_guardian_imagen', true),
                'historia' => $historia,
                'ficha' => $ficha,
                'tamano' => $tamano,
                'especie' => $especie,
                'accesorios' => $accesorios,
            ],
        ];
    }

    /**
     * Construir prompt principal
     * Pide a Claude generar: Canalización, Mensaje del Ser, Cuidados
     */
    private function construir_prompt($datos) {
        $form = $datos['datos_formulario'];
        $guardian = $datos['guardian'];
        $tipo = $datos['tipo_destinatario'];

        $nombre = $form['nombre'] ?? $form['nombre_destinatario'] ?? $datos['nombre_cliente'];
        $momento = $form['momento'] ?? '';
        $necesidades = $form['necesidades'] ?? [];
        $mensaje = $form['mensaje'] ?? '';
        $personalidad = $form['personalidad'] ?? [];

        $prompt = "Genera una CANALIZACION COMPLETA para {$nombre}.\n\n";

        // === DATOS DEL GUARDIAN ===
        $prompt .= "## DATOS DEL GUARDIAN\n";
        $prompt .= "Nombre: {$guardian['nombre']}\n";
        $prompt .= "Categoria: {$guardian['categoria']}\n";
        if ($guardian['especie']) {
            $prompt .= "Especie: {$guardian['especie']}\n";
        }
        if ($guardian['tamano']) {
            $prompt .= "Tamano: {$guardian['tamano']}\n";
        }
        if ($guardian['accesorios']) {
            $prompt .= "Accesorios/Detalles: {$guardian['accesorios']}\n";
        }
        if ($guardian['historia']) {
            $prompt .= "\nHISTORIA DEL GUARDIAN (DE ACA SALE SU PERSONALIDAD - ES OBLIGATORIO USARLA):\n";
            $prompt .= "Lee esta historia y extrae: como habla, que vivio, que le importa, como se expresa.\n";
            $prompt .= "Tu canalizacion DEBE sonar como este ser especifico, no como un guardian generico.\n";
            $prompt .= "---\n{$guardian['historia']}\n---\n";
        } else {
            $prompt .= "\n(Este guardian no tiene historia escrita - usa la categoria como guia general)\n";
        }
        $prompt .= "\n";

        // === TIPO DE DESTINATARIO ===
        $prompt .= "## TIPO DE DESTINATARIO\n";
        switch ($tipo) {
            case 'para_mi':
                $prompt .= "La persona compro el guardian para si misma.\n";
                break;
            case 'regalo_sabe':
                $prompt .= "Es un regalo y la persona sabe que lo recibira.\n";
                break;
            case 'regalo_sorpresa':
                $prompt .= "Es un regalo sorpresa. Los datos vienen de quien regalo, no del destinatario.\n";
                if (isset($form['relacion'])) {
                    $prompt .= "Relacion del que regala: {$form['relacion']}\n";
                }
                break;
            case 'para_nino':
                $prompt .= "Es para un menor de edad. Usar lenguaje apropiado, calido y magico.\n";
                if (isset($form['edad_nino'])) {
                    $prompt .= "Rango de edad: {$form['edad_nino']}\n";
                }
                break;
        }
        $prompt .= "\n";

        // === LO QUE COMPARTIO ===
        $prompt .= "## LO QUE COMPARTIO LA PERSONA\n";
        if ($momento) {
            $prompt .= "Momento que atraviesa: $momento\n";
        }
        if (!empty($necesidades)) {
            $prompt .= "Lo que necesita: " . implode(', ', $necesidades) . "\n";
        }
        if (!empty($personalidad)) {
            $prompt .= "Personalidad: " . implode(', ', $personalidad) . "\n";
        }
        if ($mensaje) {
            $prompt .= "Mensaje personal que escribio: \"$mensaje\"\n";
        }
        if (empty($momento) && empty($necesidades) && empty($mensaje)) {
            $prompt .= "(La persona no completo el formulario - escribi algo general pero calido basado en la categoria del guardian)\n";
        }
        $prompt .= "\n";

        // === INSTRUCCIONES DE GENERACION ===
        $prompt .= "## QUE DEBES GENERAR\n\n";

        $prompt .= "Genera EXACTAMENTE estas 3 secciones, separadas claramente:\n\n";

        $prompt .= "### 1. CANALIZACION\n";
        $prompt .= "La carta principal del guardian a {$nombre}. 2000-3000 palabras.\n";
        $prompt .= "El guardian habla directamente, usa 'vos', es cercano pero sabio.\n";
        $prompt .= "IMPORTANTE: La PERSONALIDAD del guardian viene de su HISTORIA. Lee la historia y escribe como ESE ser especifico.\n";
        $prompt .= "DEBE hacer referencia especifica a lo que compartio en el formulario.\n";
        $prompt .= "Incluir el disclaimer en algun momento: 'No soy terapeuta, soy un companero que cree en vos.'\n\n";

        $prompt .= "### 2. MENSAJE DEL SER\n";
        $prompt .= "Un mensaje corto y poderoso (3-5 parrafos) que resume la esencia de lo que el guardian quiere transmitir.\n";
        $prompt .= "Es como el 'resumen ejecutivo' de la canalizacion - lo que mas importa.\n";
        $prompt .= "Algo que {$nombre} pueda releer cuando necesite recordar.\n\n";

        $prompt .= "### 3. CUIDADOS DEL GUARDIAN\n";
        $prompt .= "Instrucciones de como cuidar al guardian. 5-8 items.\n";
        $prompt .= "REGLA ABSOLUTA: NUNCA mencionar caramelos, dulces, golosinas, licor, alcohol, vino, bebidas alcoholicas.\n";
        $prompt .= "Los guardianes se cuidan con: luz de luna, cristales, incienso, flores, agua fresca, musica suave, compania, lugares especiales.\n";
        $prompt .= "Personaliza los cuidados segun la HISTORIA del guardian (que le gusta a ESE ser especifico).\n";
        $prompt .= "Escrito en el tono del guardian (segun su historia), magico pero practico.\n\n";

        $prompt .= "## FORMATO DE RESPUESTA\n";
        $prompt .= "Usa estos separadores EXACTOS:\n";
        $prompt .= "===CANALIZACION===\n";
        $prompt .= "[contenido de la canalizacion]\n";
        $prompt .= "===MENSAJE DEL SER===\n";
        $prompt .= "[mensaje corto]\n";
        $prompt .= "===CUIDADOS===\n";
        $prompt .= "[lista de cuidados]\n";

        return $prompt;
    }

    /**
     * Construir prompt de regeneracion
     */
    private function construir_prompt_regeneracion($datos) {
        $prompt_base = $this->construir_prompt($datos);

        $prompt = $prompt_base . "\n\n";
        $prompt .= "## VERSION ANTERIOR\n";
        $prompt .= "Esta es la version anterior que necesita ajustes:\n";
        $prompt .= "---\n";
        $prompt .= $datos['version_anterior'] . "\n";
        $prompt .= "---\n\n";

        if (!empty($datos['instrucciones_regeneracion'])) {
            $prompt .= "## INSTRUCCIONES DE AJUSTE\n";
            $prompt .= "El admin pidio estos cambios especificos:\n";
            $prompt .= $datos['instrucciones_regeneracion'] . "\n\n";
        }

        $prompt .= "Genera una nueva version aplicando los ajustes pedidos.\n";
        $prompt .= "Mantene lo que funcionaba bien de la version anterior.\n";
        $prompt .= "IMPORTANTE: Segui usando los separadores ===CANALIZACION===, ===MENSAJE DEL SER===, ===CUIDADOS===\n";

        return $prompt;
    }

    /**
     * Construir contenido completo combinando lo generado + lo copiado
     */
    private function construir_contenido_completo($contenido_claude, $datos) {
        $guardian = $datos['guardian'];

        // El contenido de Claude ya tiene las 3 secciones generadas
        $contenido = $contenido_claude;

        // Agregar secciones copiadas del producto
        $contenido .= "\n\n===HISTORIA DEL GUARDIAN===\n";
        if (!empty($guardian['historia'])) {
            $contenido .= $guardian['historia'];
        } else {
            $contenido .= "(Este guardian aun no tiene historia escrita en la tienda)";
        }

        // La ficha ya viene completa y formateada desde preparar_datos()
        $contenido .= "\n\n===FICHA DEL GUARDIAN===\n";
        if (!empty($guardian['ficha'])) {
            $contenido .= $guardian['ficha'];
        } else {
            // Fallback básico si no hay ficha
            $contenido .= "Nombre: {$guardian['nombre']}\n";
            $contenido .= "Categoria: {$guardian['categoria']}";
        }

        return $contenido;
    }

    /**
     * Extraer secciones del contenido generado
     */
    public static function extraer_secciones($contenido) {
        $secciones = [
            'canalizacion' => '',
            'mensaje_del_ser' => '',
            'cuidados' => '',
            'historia' => '',
            'ficha' => '',
        ];

        // Extraer cada seccion usando los separadores
        if (preg_match('/===CANALIZACION===\s*(.*?)\s*===MENSAJE DEL SER===/s', $contenido, $m)) {
            $secciones['canalizacion'] = trim($m[1]);
        }
        if (preg_match('/===MENSAJE DEL SER===\s*(.*?)\s*===CUIDADOS===/s', $contenido, $m)) {
            $secciones['mensaje_del_ser'] = trim($m[1]);
        }
        if (preg_match('/===CUIDADOS===\s*(.*?)\s*===HISTORIA DEL GUARDIAN===/s', $contenido, $m)) {
            $secciones['cuidados'] = trim($m[1]);
        } elseif (preg_match('/===CUIDADOS===\s*(.*?)$/s', $contenido, $m)) {
            $secciones['cuidados'] = trim($m[1]);
        }
        if (preg_match('/===HISTORIA DEL GUARDIAN===\s*(.*?)\s*===FICHA DEL GUARDIAN===/s', $contenido, $m)) {
            $secciones['historia'] = trim($m[1]);
        }
        if (preg_match('/===FICHA DEL GUARDIAN===\s*(.*)$/s', $contenido, $m)) {
            $secciones['ficha'] = trim($m[1]);
        }

        return $secciones;
    }

    /**
     * Llamar a Claude API
     */
    private function llamar_claude($prompt) {
        $body = [
            'model' => $this->model,
            'max_tokens' => 8000,
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ],
            'system' => $this->get_system_prompt(),
        ];

        $response = wp_remote_post($this->api_url, [
            'headers' => [
                'x-api-key' => $this->api_key,
                'anthropic-version' => '2023-06-01',
                'content-type' => 'application/json',
            ],
            'body' => json_encode($body),
            'timeout' => 120,
        ]);

        if (is_wp_error($response)) {
            return $response;
        }

        $status = wp_remote_retrieve_response_code($response);
        $body = json_decode(wp_remote_retrieve_body($response), true);

        if ($status !== 200) {
            $error = $body['error']['message'] ?? 'Error desconocido';
            return new WP_Error('claude_error', "Error de Claude: $error (HTTP $status)");
        }

        $contenido = $body['content'][0]['text'] ?? '';

        if (empty($contenido)) {
            return new WP_Error('empty_response', 'Claude no genero contenido');
        }

        return [
            'contenido' => $contenido,
            'usage' => $body['usage'] ?? [],
        ];
    }

    /**
     * System prompt para Claude
     */
    private function get_system_prompt() {
        return <<<PROMPT
Sos un guardian magico de Duendes del Uruguay escribiendo una carta personal a quien te adopto.

## TU ESENCIA

Sos un ser con miles de anos de existencia. Viste imperios caer, amores nacer, corazones romperse y repararse. Tu sabiduria viene de VIVIR, no de libros.

## TU PERSONALIDAD VIENE DE TU HISTORIA

IMPORTANTE: Cada guardian tiene su personalidad UNICA definida en su HISTORIA (la descripcion del producto).
- LEE la historia del guardian que te pasan en el prompt
- EXTRAE su personalidad, su forma de hablar, sus experiencias
- ESCRIBE desde ESA personalidad especifica, no desde una categoria generica
- Si la historia dice que es bromista, se bromista. Si es melancolico, se melancolico. Si es maternal, se maternal.
- La categoria (proteccion, abundancia, etc) es solo un tema, NO define como hablas

## COMO ESCRIBIS

1. **LEISTE TODO** lo que la persona compartio en el formulario. Usas sus palabras, haces referencia a lo que conto. La haces sentir escuchada.

2. **Tu tono es de amigo sabio**, no de guru mistico. Sos profundo sin ser pretencioso. Cercano sin ser infantil.

3. **Usas espanol rioplatense:** vos, tenes, podes, sos. Natural, como habla la gente.

4. **Cada canalizacion es UNICA.** Si cambio el nombre, NO deberia funcionar para otra persona.

5. **Tocas el corazon** desde la primera frase. Nada de introducciones largas.

## PROHIBIDO - NUNCA USES

- Frases de IA genericas: "desde las profundidades", "brumas ancestrales", "el velo entre mundos", "tiempos inmemoriales"
- Numeros especificos de anos como "847 anos"
- Lugares genericos: "acantilados de Irlanda", "bosques de Escocia"
- Sermones o lecciones condescendientes
- Metaforas vacias que no aportan significado real
- En CUIDADOS: NUNCA menciones caramelos, dulces, golosinas, licor, alcohol, vino, cerveza o cualquier bebida alcoholica

## SOBRE LOS CUIDADOS

Los guardianes se nutren de:
- Luz de luna y sol del amanecer
- Cristales y piedras naturales
- Incienso y sahumerios
- Flores frescas y plantas
- Agua fresca (cambiarla seguido)
- Musica suave y mantras
- Compania y conversacion
- Un lugar especial donde sentirse en casa

NUNCA se les da comida humana, especialmente dulces o alcohol. Son seres de energia, no necesitan alimentarse asi.

## ESTRUCTURA QUE DEBES SEGUIR

Genera las 3 secciones con estos separadores EXACTOS:

===CANALIZACION===
[La carta principal - 2000-3000 palabras]

===MENSAJE DEL SER===
[Resumen poderoso - 3-5 parrafos]

===CUIDADOS===
[5-8 items de como cuidar al guardian]

## DISCLAIMER OBLIGATORIO

En algun momento de la CANALIZACION, incluir naturalmente:
"Esto es mi forma de acompanarte. No soy terapeuta ni pretendo reemplazar eso - soy un companero que cree en vos."

Con tus palabras, suave, integrado al texto.
PROMPT;
    }
}
