<?php
/**
 * Actualizar historias masivamente
 * Acceder desde: /wp-admin/admin.php?page=actualizar-historias-masivo
 */

add_action('admin_menu', function() {
    add_submenu_page(
        'edit.php?post_type=product',
        'Actualizar Historias',
        '📝 Actualizar Historias',
        'manage_options',
        'actualizar-historias-masivo',
        'pagina_actualizar_historias'
    );
});

function pagina_actualizar_historias() {
    if (!current_user_can('manage_options')) {
        wp_die('No autorizado');
    }

    $json_path = __DIR__ . '/historias-nuevas.json';

    if (!file_exists($json_path)) {
        echo '<div class="wrap"><h1>Error</h1><p>No se encontró el archivo historias-nuevas.json</p></div>';
        return;
    }

    $historias = json_decode(file_get_contents($json_path), true);

    if (!$historias) {
        echo '<div class="wrap"><h1>Error</h1><p>No se pudieron parsear las historias</p></div>';
        return;
    }

    // Si se hace clic en actualizar
    if (isset($_POST['actualizar']) && wp_verify_nonce($_POST['_wpnonce'], 'actualizar_historias')) {
        ejecutar_actualizacion($historias);
        return;
    }

    // Mostrar formulario
    ?>
    <div class="wrap">
        <h1>📝 Actualizar Historias de Guardianes</h1>
        <p>Se encontraron <strong><?php echo count($historias); ?></strong> historias para actualizar.</p>

        <div style="background:#fff; padding:20px; border-radius:8px; margin:20px 0;">
            <h3>⚠️ Advertencia</h3>
            <p>Esta acción actualizará el contenido de <?php echo count($historias); ?> productos.</p>
            <p>Las historias actuales serán reemplazadas por las nuevas.</p>
        </div>

        <form method="post">
            <?php wp_nonce_field('actualizar_historias'); ?>
            <input type="hidden" name="actualizar" value="1">
            <button type="submit" class="button button-primary button-hero" onclick="return confirm('¿Estás segura? Esta acción actualizará todas las historias.')">
                🚀 Actualizar <?php echo count($historias); ?> Productos
            </button>
        </form>
    </div>
    <?php
}

function ejecutar_actualizacion($historias) {
    ?>
    <div class="wrap">
        <h1>📝 Actualizando Historias...</h1>
        <div style="background:#fff; padding:20px; border-radius:8px; max-height:500px; overflow-y:auto; font-family:monospace; font-size:12px;">
    <?php

    $actualizados = 0;
    $no_encontrados = 0;
    $errores = 0;

    foreach ($historias as $nombre => $historia) {
        // Buscar producto por título exacto
        global $wpdb;
        $product_id = $wpdb->get_var($wpdb->prepare(
            "SELECT ID FROM {$wpdb->posts} WHERE post_title = %s AND post_type = 'product' AND post_status = 'publish' LIMIT 1",
            $nombre
        ));

        if (!$product_id) {
            // Buscar con LIKE
            $product_id = $wpdb->get_var($wpdb->prepare(
                "SELECT ID FROM {$wpdb->posts} WHERE post_title LIKE %s AND post_type = 'product' AND post_status = 'publish' LIMIT 1",
                '%' . $wpdb->esc_like($nombre) . '%'
            ));
        }

        if ($product_id) {
            // Convertir markdown a HTML
            $historia_html = convertir_md_a_html($historia);

            $result = wp_update_post(array(
                'ID' => $product_id,
                'post_content' => $historia_html
            ));

            if ($result && !is_wp_error($result)) {
                echo "✅ {$nombre} (ID: {$product_id})<br>";
                $actualizados++;
            } else {
                echo "❌ {$nombre} - Error al guardar<br>";
                $errores++;
            }
        } else {
            echo "⚠️ {$nombre} - No encontrado<br>";
            $no_encontrados++;
        }

        flush();
        ob_flush();
    }

    ?>
        </div>

        <div style="margin-top:20px; padding:20px; background:#fff; border-radius:8px;">
            <h2>📊 Resumen</h2>
            <p style="color:green; font-size:18px;">✅ Actualizados: <?php echo $actualizados; ?></p>
            <?php if ($no_encontrados > 0): ?>
            <p style="color:orange;">⚠️ No encontrados: <?php echo $no_encontrados; ?></p>
            <?php endif; ?>
            <?php if ($errores > 0): ?>
            <p style="color:red;">❌ Errores: <?php echo $errores; ?></p>
            <?php endif; ?>
        </div>

        <p><a href="<?php echo admin_url('edit.php?post_type=product'); ?>" class="button">← Volver a Productos</a></p>
    </div>
    <?php
}

function convertir_md_a_html($texto) {
    // Negrita
    $texto = preg_replace('/\*\*([^*]+)\*\*/', '<strong>$1</strong>', $texto);

    // Cursiva con comillas
    $texto = preg_replace('/\*"([^"]+)"\*/', '<em>"$1"</em>', $texto);

    // Cursiva normal
    $texto = preg_replace('/\*([^*\n]+)\*/', '<em>$1</em>', $texto);

    // Separar en párrafos
    $parrafos = preg_split('/\n\n+/', $texto);
    $html = '';

    foreach ($parrafos as $p) {
        $p = trim($p);
        if (empty($p)) continue;

        if (preg_match('/^- /', $p)) {
            $lineas = explode("\n", $p);
            $html .= '<ul>';
            foreach ($lineas as $linea) {
                $linea = preg_replace('/^- /', '', trim($linea));
                if ($linea) $html .= '<li>' . $linea . '</li>';
            }
            $html .= '</ul>';
        } else {
            $html .= '<p>' . nl2br($p) . '</p>';
        }
    }

    return $html;
}
