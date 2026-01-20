<?php
/**
 * Plugin Name: Actualizar Historias Guardianes
 * Description: Actualiza las descripciones de productos con las historias generadas
 * Version: 1.1
 */

// Solo ejecutar si se pasa el parámetro correcto Y estamos en admin
if (!is_admin()) {
    return;
}

if (!isset($_GET['actualizar_historias']) || $_GET['actualizar_historias'] !== '1') {
    return;
}

add_action('admin_init', 'duendes_actualizar_historias_run');

function duendes_actualizar_historias_run() {
    // Verificar permisos
    if (!current_user_can('manage_options')) {
        wp_die('No tenes permisos para hacer esto.');
    }

    // Buscar el archivo JSON
    $json_file = __DIR__ . '/historias-para-wordpress.json';

    if (!file_exists($json_file)) {
        wp_die('No se encontro el archivo historias-para-wordpress.json en mu-plugins/');
    }

    $json_content = file_get_contents($json_file);
    if (!$json_content) {
        wp_die('Error al leer el archivo JSON.');
    }

    $historias = json_decode($json_content, true);
    if (!$historias || !is_array($historias)) {
        wp_die('Error al parsear el JSON de historias.');
    }

    // Output
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html><head><title>Actualizando Historias</title>';
    echo '<style>body{font-family:monospace;padding:20px;max-width:900px;margin:0 auto;} .ok{color:green;} .error{color:red;} .skip{color:orange;} p{margin:5px 0;}</style>';
    echo '</head><body>';
    echo '<h1>Actualizando Historias de Guardianes</h1>';
    echo '<p>Total de historias: ' . count($historias) . '</p>';
    echo '<hr>';

    $actualizados = 0;
    $errores = 0;
    $no_encontrados = 0;

    foreach ($historias as $nombre => $historia) {
        echo "<p><strong>" . esc_html($nombre) . ":</strong> ";

        // Flush output
        if (ob_get_level()) ob_flush();
        flush();

        // Buscar producto por titulo exacto
        global $wpdb;
        $product_id = $wpdb->get_var($wpdb->prepare(
            "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'product' AND post_status IN ('publish','draft','private') AND post_title = %s LIMIT 1",
            $nombre
        ));

        // Si no encuentra, buscar por LIKE
        if (!$product_id) {
            $product_id = $wpdb->get_var($wpdb->prepare(
                "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'product' AND post_status IN ('publish','draft','private') AND post_title LIKE %s LIMIT 1",
                $nombre . '%'
            ));
        }

        if ($product_id) {
            // Convertir markdown a HTML
            $historia_html = duendes_markdown_a_html($historia);

            // Actualizar
            $result = wp_update_post(array(
                'ID' => $product_id,
                'post_content' => $historia_html
            ), true);

            if ($result && !is_wp_error($result)) {
                echo "<span class='ok'>OK (ID: $product_id)</span>";
                $actualizados++;
            } else {
                $err = is_wp_error($result) ? $result->get_error_message() : 'Error desconocido';
                echo "<span class='error'>ERROR: " . esc_html($err) . "</span>";
                $errores++;
            }
        } else {
            echo "<span class='skip'>NO ENCONTRADO</span>";
            $no_encontrados++;
        }

        echo "</p>";
    }

    echo '<hr>';
    echo "<h2>Resumen:</h2>";
    echo "<p class='ok'>Actualizados: $actualizados</p>";
    echo "<p class='error'>Errores: $errores</p>";
    echo "<p class='skip'>No encontrados: $no_encontrados</p>";
    echo '<hr>';
    echo '<p><strong>IMPORTANTE:</strong> Ahora borra estos archivos del servidor:</p>';
    echo '<ul><li>mu-plugins/actualizar-historias-guardianes.php</li>';
    echo '<li>mu-plugins/historias-para-wordpress.json</li></ul>';
    echo '</body></html>';

    exit;
}

function duendes_markdown_a_html($texto) {
    // Negrita
    $texto = preg_replace('/\*\*([^*]+)\*\*/', '<strong>$1</strong>', $texto);

    // Italica
    $texto = preg_replace('/\*"([^"]+)"\*/', '<em>"$1"</em>', $texto);
    $texto = preg_replace('/\*([^*\n]+)\*/', '<em>$1</em>', $texto);

    // Procesar por parrafos
    $parrafos = preg_split('/\n\n+/', $texto);
    $html = '';

    foreach ($parrafos as $p) {
        $p = trim($p);
        if (empty($p)) continue;

        // Lista
        if (preg_match('/^- /', $p)) {
            $lineas = explode("\n", $p);
            $html .= '<ul>';
            foreach ($lineas as $linea) {
                $linea = preg_replace('/^- /', '', trim($linea));
                if ($linea) $html .= '<li>' . $linea . '</li>';
            }
            $html .= '</ul>';
        } else {
            $p = nl2br($p);
            $html .= '<p>' . $p . '</p>';
        }
    }

    return $html;
}
