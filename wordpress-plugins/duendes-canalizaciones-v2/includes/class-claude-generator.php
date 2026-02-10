<?php
/**
 * Generador de Canalizaciones con Claude API
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
     * Generar canalizacion
     */
    public function generar($canalizacion_id) {
        if (empty($this->api_key)) {
            return new WP_Error('no_api_key', 'ANTHROPIC_API_KEY no configurada');
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

        // Llamar a Claude
        $response = $this->llamar_claude($prompt);

        if (is_wp_error($response)) {
            update_post_meta($canalizacion_id, '_estado', 'pendiente');
            update_post_meta($canalizacion_id, '_ultimo_error', $response->get_error_message());
            return $response;
        }

        // Guardar resultado
        wp_update_post([
            'ID' => $canalizacion_id,
            'post_content' => $response['contenido'],
        ]);

        update_post_meta($canalizacion_id, '_estado', 'lista');
        update_post_meta($canalizacion_id, '_fecha_generada', current_time('mysql'));

        // Disparar accion
        do_action('duendes_canalizacion_lista', $canalizacion_id);

        return [
            'contenido' => $response['contenido'],
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
        $post = get_post($canalizacion_id);
        $datos['version_anterior'] = $post->post_content;
        $datos['instrucciones_regeneracion'] = $instrucciones;

        // Construir prompt de regeneracion
        $prompt = $this->construir_prompt_regeneracion($datos);

        // Llamar a Claude
        $response = $this->llamar_claude($prompt);

        if (is_wp_error($response)) {
            update_post_meta($canalizacion_id, '_estado', 'lista');
            return $response;
        }

        // Guardar resultado
        wp_update_post([
            'ID' => $canalizacion_id,
            'post_content' => $response['contenido'],
        ]);

        update_post_meta($canalizacion_id, '_estado', 'lista');
        update_post_meta($canalizacion_id, '_fecha_generada', current_time('mysql'));

        $versiones = get_post_meta($canalizacion_id, '_versiones', true) ?: [];

        return [
            'contenido' => $response['contenido'],
            'version' => count($versiones) + 1,
        ];
    }

    /**
     * Preparar datos para el prompt
     */
    private function preparar_datos($canalizacion_id) {
        $post = get_post($canalizacion_id);
        if (!$post) {
            return new WP_Error('no_post', 'Canalizacion no encontrada');
        }

        $orden_id = get_post_meta($canalizacion_id, '_orden_id', true);
        $guardian_id = get_post_meta($canalizacion_id, '_guardian_id', true);
        $product = wc_get_product($guardian_id);

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
                'descripcion' => $product ? $product->get_description() : '',
            ],
        ];
    }

    /**
     * Construir prompt principal
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

        $prompt = "Genera una canalizacion para {$nombre}.\n\n";

        $prompt .= "## DATOS DEL GUARDIAN\n";
        $prompt .= "Nombre: {$guardian['nombre']}\n";
        $prompt .= "Categoria: {$guardian['categoria']}\n";
        if ($guardian['descripcion']) {
            $prompt .= "Historia/Descripcion:\n{$guardian['descripcion']}\n";
        }
        $prompt .= "\n";

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
                $prompt .= "Es para un menor de edad. Usar lenguaje apropiado y calido.\n";
                if (isset($form['edad_nino'])) {
                    $prompt .= "Rango de edad: {$form['edad_nino']}\n";
                }
                break;
        }
        $prompt .= "\n";

        $prompt .= "## LO QUE COMPARTIO\n";
        if ($momento) {
            $prompt .= "Momento que atraviesa: $momento\n";
        }
        if (!empty($necesidades)) {
            $prompt .= "Necesidades: " . implode(', ', $necesidades) . "\n";
        }
        if (!empty($personalidad)) {
            $prompt .= "Personalidad: " . implode(', ', $personalidad) . "\n";
        }
        if ($mensaje) {
            $prompt .= "Mensaje personal: $mensaje\n";
        }
        $prompt .= "\n";

        $prompt .= "## INSTRUCCIONES\n";
        $prompt .= "Escribe una canalizacion de 2000-3000 palabras.\n";
        $prompt .= "El guardian habla directamente a {$nombre}.\n";
        $prompt .= "Usa segunda persona (vos, tenes, podes - espanol rioplatense).\n";
        $prompt .= "NO uses frases genericas de IA como 'desde las profundidades', 'brumas ancestrales', etc.\n";
        $prompt .= "Hace referencia ESPECIFICA a lo que compartio en el formulario.\n";
        $prompt .= "El tono es de un amigo sabio que te conoce, no de un texto mistico.\n";

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

        return $prompt;
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
Sos un guardian magico de Duendes del Uruguay que escribe cartas personales a los humanos que te adoptan.

## COMO ESCRIBIS

1. **No sos un texto de IA.** Sos un ser con miles de anos de experiencia escribiendo a alguien que acabas de conocer.

2. **Leiste TODO lo que la persona compartio** en el formulario. Hacele saber que la escuchaste. Usa sus palabras, hace referencia a lo que conto.

3. **Tu tono es de amigo sabio**, no de guru mistico. Podes ser profundo sin ser pretencioso.

4. **Usas espanol rioplatense:** vos, tenes, podes, sos. Natural, cercano.

5. **Cada canalizacion es UNICA.** Si cambio el nombre, NO deberia funcionar para otra persona.

## LO QUE NUNCA HACES

- NO usas frases como "desde las profundidades", "brumas ancestrales", "el velo entre mundos"
- NO usas numeros especificos de anos como "847 anos"
- NO mencionas lugares genericos como "acantilados de Irlanda"
- NO das lecciones ni sermones
- NO sos condescendiente

## ESTRUCTURA SUGERIDA (flexible)

1. **"Te escuche"** - Demostras que leiste lo que compartio
2. **"Esto es lo que veo"** - Tu perspectiva sobre su situacion
3. **"Vine a..."** - Que venis a aportar especificamente
4. **"Conmigo vas a..."** - Como va a ser la relacion
5. **"Lo que necesito que sepas"** - El mensaje mas importante

## DISCLAIMER OBLIGATORIO

En algun momento, incluir naturalmente algo como:
"Esto es mi forma de acompanarte, de escucharte. No soy terapeuta ni pretendo reemplazar eso - soy un companero que cree en vos."

Con tus palabras, suave, no legal.

## EXTENSION

2000-3000 palabras. Ni mas ni menos.
PROMPT;
    }
}
