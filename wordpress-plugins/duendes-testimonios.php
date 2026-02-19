<?php
/**
 * Plugin Name: Duendes - Sistema de Testimonios
 * Description: Sistema completo de testimonios con formulario, galería y panel de aprobación
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// ============================================================
// 1. CUSTOM POST TYPE
// ============================================================

add_action('init', function() {
    register_post_type('testimonio', [
        'labels' => [
            'name' => 'Testimonios',
            'singular_name' => 'Testimonio',
            'add_new' => 'Agregar Testimonio',
            'add_new_item' => 'Agregar Nuevo Testimonio',
            'edit_item' => 'Editar Testimonio',
            'view_item' => 'Ver Testimonio',
            'all_items' => 'Todos los Testimonios',
            'search_items' => 'Buscar Testimonios',
            'not_found' => 'No se encontraron testimonios',
            'menu_name' => 'Testimonios'
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-format-quote',
        'supports' => ['title', 'editor', 'thumbnail'],
        'has_archive' => false,
        'rewrite' => false
    ]);
});

// ============================================================
// 2. META BOXES PARA ADMIN
// ============================================================

add_action('add_meta_boxes', function() {
    add_meta_box(
        'testimonio_datos',
        'Datos del Testimonio',
        'duendes_testimonio_metabox',
        'testimonio',
        'normal',
        'high'
    );

    add_meta_box(
        'testimonio_media',
        'Fotos y Video',
        'duendes_testimonio_media_metabox',
        'testimonio',
        'normal',
        'default'
    );
});

function duendes_testimonio_metabox($post) {
    $nombre = get_post_meta($post->ID, '_testimonio_nombre', true);
    $email = get_post_meta($post->ID, '_testimonio_email', true);
    $guardian = get_post_meta($post->ID, '_testimonio_guardian', true);
    $pais = get_post_meta($post->ID, '_testimonio_pais', true);
    $rating = get_post_meta($post->ID, '_testimonio_rating', true) ?: 5;
    $destacado = get_post_meta($post->ID, '_testimonio_destacado', true);

    wp_nonce_field('duendes_testimonio_save', 'duendes_testimonio_nonce');
    ?>
    <style>
        .testimonio-field { margin-bottom: 15px; }
        .testimonio-field label { display: block; font-weight: 600; margin-bottom: 5px; }
        .testimonio-field input[type="text"],
        .testimonio-field input[type="email"] { width: 100%; padding: 8px; }
        .testimonio-field select { padding: 8px; min-width: 200px; }
        .rating-stars { font-size: 24px; color: #B8973A; }
    </style>

    <div class="testimonio-field">
        <label>Nombre del Cliente</label>
        <input type="text" name="testimonio_nombre" value="<?php echo esc_attr($nombre); ?>" />
    </div>

    <div class="testimonio-field">
        <label>Email</label>
        <input type="email" name="testimonio_email" value="<?php echo esc_attr($email); ?>" />
    </div>

    <div class="testimonio-field">
        <label>Guardián Adoptado</label>
        <input type="text" name="testimonio_guardian" value="<?php echo esc_attr($guardian); ?>" placeholder="Ej: Violeta, Duende de Protección" />
    </div>

    <div class="testimonio-field">
        <label>País</label>
        <input type="text" name="testimonio_pais" value="<?php echo esc_attr($pais); ?>" placeholder="Ej: Argentina, México, Uruguay" />
    </div>

    <div class="testimonio-field">
        <label>Calificación</label>
        <select name="testimonio_rating">
            <?php for ($i = 5; $i >= 1; $i--): ?>
                <option value="<?php echo $i; ?>" <?php selected($rating, $i); ?>>
                    <?php echo str_repeat('★', $i) . str_repeat('☆', 5-$i); ?>
                </option>
            <?php endfor; ?>
        </select>
    </div>

    <div class="testimonio-field">
        <label>
            <input type="checkbox" name="testimonio_destacado" value="1" <?php checked($destacado, '1'); ?> />
            Testimonio Destacado (aparece primero y más grande)
        </label>
    </div>
    <?php
}

function duendes_testimonio_media_metabox($post) {
    $fotos = get_post_meta($post->ID, '_testimonio_fotos', true) ?: [];
    $video_url = get_post_meta($post->ID, '_testimonio_video_url', true);
    ?>
    <style>
        .media-preview { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
        .media-preview img { max-width: 150px; max-height: 150px; object-fit: cover; border-radius: 8px; }
        .media-preview video { max-width: 300px; border-radius: 8px; }
    </style>

    <div class="testimonio-field">
        <label>Fotos del Cliente</label>
        <div class="media-preview">
            <?php if (!empty($fotos)): ?>
                <?php foreach ($fotos as $foto_id): ?>
                    <?php echo wp_get_attachment_image($foto_id, 'thumbnail'); ?>
                <?php endforeach; ?>
            <?php else: ?>
                <p style="color: #666;">No hay fotos</p>
            <?php endif; ?>
        </div>
    </div>

    <div class="testimonio-field">
        <label>Video</label>
        <?php if ($video_url): ?>
            <video controls style="max-width: 400px;">
                <source src="<?php echo esc_url($video_url); ?>" type="video/mp4">
            </video>
            <p><a href="<?php echo esc_url($video_url); ?>" target="_blank">Ver video completo</a></p>
        <?php else: ?>
            <p style="color: #666;">No hay video</p>
        <?php endif; ?>
    </div>
    <?php
}

// Guardar meta datos
add_action('save_post_testimonio', function($post_id) {
    if (!isset($_POST['duendes_testimonio_nonce']) ||
        !wp_verify_nonce($_POST['duendes_testimonio_nonce'], 'duendes_testimonio_save')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;

    $fields = ['nombre', 'email', 'guardian', 'pais', 'rating'];
    foreach ($fields as $field) {
        if (isset($_POST['testimonio_' . $field])) {
            update_post_meta($post_id, '_testimonio_' . $field, sanitize_text_field($_POST['testimonio_' . $field]));
        }
    }

    $destacado = isset($_POST['testimonio_destacado']) ? '1' : '0';
    update_post_meta($post_id, '_testimonio_destacado', $destacado);
});

// ============================================================
// 3. COLUMNAS EN ADMIN
// ============================================================

add_filter('manage_testimonio_posts_columns', function($columns) {
    $new = [];
    $new['cb'] = $columns['cb'];
    $new['title'] = 'Testimonio';
    $new['nombre'] = 'Cliente';
    $new['guardian'] = 'Guardián';
    $new['rating'] = 'Rating';
    $new['destacado'] = 'Destacado';
    $new['date'] = 'Fecha';
    return $new;
});

add_action('manage_testimonio_posts_custom_column', function($column, $post_id) {
    switch ($column) {
        case 'nombre':
            $nombre = get_post_meta($post_id, '_testimonio_nombre', true);
            $pais = get_post_meta($post_id, '_testimonio_pais', true);
            echo esc_html($nombre);
            if ($pais) echo '<br><small style="color:#666;">' . esc_html($pais) . '</small>';
            break;
        case 'guardian':
            echo esc_html(get_post_meta($post_id, '_testimonio_guardian', true));
            break;
        case 'rating':
            $rating = get_post_meta($post_id, '_testimonio_rating', true) ?: 5;
            echo '<span style="color:#B8973A;">' . str_repeat('★', $rating) . '</span>';
            break;
        case 'destacado':
            $destacado = get_post_meta($post_id, '_testimonio_destacado', true);
            echo $destacado ? '<span style="color:#B8973A;">★ Sí</span>' : '—';
            break;
    }
}, 10, 2);

// ============================================================
// 4. FORMULARIO PÚBLICO (/mi-testimonio)
// ============================================================

add_action('init', function() {
    add_rewrite_rule('^mi-testimonio/?$', 'index.php?duendes_testimonio_form=1', 'top');
});

add_filter('query_vars', function($vars) {
    $vars[] = 'duendes_testimonio_form';
    return $vars;
});

add_action('template_redirect', function() {
    if (!get_query_var('duendes_testimonio_form')) return;

    // Procesar envío del formulario
    $mensaje = '';
    $tipo_mensaje = '';

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['duendes_testimonio_submit'])) {
        $resultado = duendes_procesar_testimonio();
        $mensaje = $resultado['mensaje'];
        $tipo_mensaje = $resultado['tipo'];
    }

    // Mostrar página
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Compartí tu Experiencia | Duendes del Uruguay</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }

            body {
                background: #0f120d;
                color: #e8e6e3;
                font-family: Georgia, 'Times New Roman', serif;
                line-height: 1.7;
                min-height: 100vh;
            }

            .container {
                max-width: 700px;
                margin: 0 auto;
                padding: 40px 20px;
            }

            .header {
                text-align: center;
                margin-bottom: 40px;
            }

            .logo {
                width: 80px;
                height: 80px;
                margin-bottom: 20px;
            }

            h1 {
                font-family: 'Cinzel', serif;
                color: #B8973A;
                font-size: 2rem;
                font-weight: 600;
                margin-bottom: 15px;
            }

            .intro {
                color: rgba(255,255,255,0.7);
                font-size: 1.1rem;
                max-width: 500px;
                margin: 0 auto;
            }

            .form-card {
                background: rgba(20, 25, 18, 0.8);
                border: 1px solid rgba(184, 151, 58, 0.3);
                border-radius: 16px;
                padding: 40px;
                margin-top: 30px;
            }

            .form-group {
                margin-bottom: 25px;
            }

            label {
                display: block;
                font-family: 'Cinzel', serif;
                color: #B8973A;
                font-size: 0.9rem;
                margin-bottom: 8px;
                letter-spacing: 0.5px;
            }

            input[type="text"],
            input[type="email"],
            textarea,
            select {
                width: 100%;
                padding: 14px 16px;
                background: rgba(15, 18, 13, 0.9);
                border: 1px solid rgba(184, 151, 58, 0.3);
                border-radius: 8px;
                color: #e8e6e3;
                font-family: Georgia, serif;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            input:focus,
            textarea:focus,
            select:focus {
                outline: none;
                border-color: #B8973A;
                box-shadow: 0 0 15px rgba(184, 151, 58, 0.2);
            }

            textarea {
                min-height: 150px;
                resize: vertical;
            }

            .rating-selector {
                display: flex;
                gap: 10px;
                flex-direction: row-reverse;
                justify-content: flex-end;
            }

            .rating-selector input {
                display: none;
            }

            .rating-selector label {
                font-size: 2rem;
                color: rgba(184, 151, 58, 0.3);
                cursor: pointer;
                transition: all 0.2s;
                margin: 0;
            }

            .rating-selector label:hover,
            .rating-selector label:hover ~ label,
            .rating-selector input:checked ~ label {
                color: #B8973A;
                text-shadow: 0 0 10px rgba(184, 151, 58, 0.5);
            }

            .file-upload {
                border: 2px dashed rgba(184, 151, 58, 0.3);
                border-radius: 12px;
                padding: 30px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                position: relative;
            }

            .file-upload:hover {
                border-color: #B8973A;
                background: rgba(184, 151, 58, 0.05);
            }

            .file-upload input {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
            }

            .file-upload-icon {
                font-size: 2.5rem;
                margin-bottom: 10px;
            }

            .file-upload-text {
                color: rgba(255,255,255,0.6);
            }

            .file-upload-hint {
                font-size: 0.85rem;
                color: rgba(255,255,255,0.4);
                margin-top: 8px;
            }

            .preview-container {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                margin-top: 15px;
            }

            .preview-item {
                position: relative;
                width: 100px;
                height: 100px;
                border-radius: 8px;
                overflow: hidden;
            }

            .preview-item img,
            .preview-item video {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .preview-item .remove {
                position: absolute;
                top: 5px;
                right: 5px;
                width: 24px;
                height: 24px;
                background: rgba(0,0,0,0.7);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                font-size: 14px;
            }

            .submit-btn {
                width: 100%;
                padding: 18px 30px;
                background: linear-gradient(135deg, #B8973A 0%, #8B6914 100%);
                border: none;
                border-radius: 8px;
                color: #0f120d;
                font-family: 'Cinzel', serif;
                font-size: 1.1rem;
                font-weight: 600;
                letter-spacing: 1px;
                cursor: pointer;
                transition: all 0.3s;
                margin-top: 20px;
            }

            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(184, 151, 58, 0.3);
            }

            .submit-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .mensaje {
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 30px;
                text-align: center;
            }

            .mensaje.exito {
                background: rgba(76, 175, 80, 0.2);
                border: 1px solid rgba(76, 175, 80, 0.5);
                color: #a5d6a7;
            }

            .mensaje.error {
                background: rgba(244, 67, 54, 0.2);
                border: 1px solid rgba(244, 67, 54, 0.5);
                color: #ef9a9a;
            }

            .mensaje h3 {
                font-family: 'Cinzel', serif;
                margin-bottom: 10px;
            }

            .opcional {
                font-size: 0.8rem;
                color: rgba(255,255,255,0.4);
                font-weight: normal;
            }

            .footer-note {
                text-align: center;
                margin-top: 30px;
                padding-top: 30px;
                border-top: 1px solid rgba(184, 151, 58, 0.2);
                color: rgba(255,255,255,0.5);
                font-size: 0.9rem;
            }

            @media (max-width: 600px) {
                .container { padding: 20px 15px; }
                .form-card { padding: 25px 20px; }
                h1 { font-size: 1.6rem; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://duendesdeluruguay.com/wp-content/uploads/2024/03/logo-duendes.png" alt="Duendes del Uruguay" class="logo" onerror="this.style.display='none'">
                <h1>Compartí tu Experiencia</h1>
                <p class="intro">Tu historia puede inspirar a otros. Contanos cómo fue tu encuentro con tu guardián.</p>
            </div>

            <?php if ($mensaje): ?>
                <div class="mensaje <?php echo esc_attr($tipo_mensaje); ?>">
                    <?php if ($tipo_mensaje === 'exito'): ?>
                        <h3>Gracias por compartir tu experiencia</h3>
                        <p><?php echo esc_html($mensaje); ?></p>
                    <?php else: ?>
                        <h3>Hubo un problema</h3>
                        <p><?php echo esc_html($mensaje); ?></p>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <?php if ($tipo_mensaje !== 'exito'): ?>
            <form method="post" enctype="multipart/form-data" class="form-card" id="testimonioForm">
                <?php wp_nonce_field('duendes_testimonio_publico', 'testimonio_nonce'); ?>

                <div class="form-group">
                    <label for="nombre">Tu Nombre</label>
                    <input type="text" id="nombre" name="nombre" required placeholder="Como querés que aparezca">
                </div>

                <div class="form-group">
                    <label for="email">Tu Email <span class="opcional">(no se publica)</span></label>
                    <input type="email" id="email" name="email" required placeholder="Para contactarte si es necesario">
                </div>

                <div class="form-group">
                    <label for="pais">Tu País</label>
                    <input type="text" id="pais" name="pais" required placeholder="Ej: Argentina, México, Uruguay...">
                </div>

                <div class="form-group">
                    <label for="guardian">Tu Guardián <span class="opcional">(opcional)</span></label>
                    <input type="text" id="guardian" name="guardian" placeholder="Ej: Violeta, Duende de Protección">
                </div>

                <div class="form-group">
                    <label>Tu Experiencia</label>
                    <textarea name="experiencia" required placeholder="Contanos tu historia... ¿Qué te llevó a buscar un guardián? ¿Cómo fue recibirlo? ¿Qué cambió desde entonces?"></textarea>
                </div>

                <div class="form-group">
                    <label>¿Cómo calificás tu experiencia?</label>
                    <div class="rating-selector">
                        <input type="radio" id="star5" name="rating" value="5" checked>
                        <label for="star5">★</label>
                        <input type="radio" id="star4" name="rating" value="4">
                        <label for="star4">★</label>
                        <input type="radio" id="star3" name="rating" value="3">
                        <label for="star3">★</label>
                        <input type="radio" id="star2" name="rating" value="2">
                        <label for="star2">★</label>
                        <input type="radio" id="star1" name="rating" value="1">
                        <label for="star1">★</label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Fotos <span class="opcional">(hasta 3 imágenes)</span></label>
                    <div class="file-upload" id="fotosUpload">
                        <div class="file-upload-icon">📸</div>
                        <div class="file-upload-text">Hacé click o arrastrá tus fotos acá</div>
                        <div class="file-upload-hint">JPG, PNG o WEBP - Máximo 5MB cada una</div>
                        <input type="file" name="fotos[]" id="fotos" accept="image/*" multiple>
                    </div>
                    <div class="preview-container" id="fotosPreview"></div>
                </div>

                <div class="form-group">
                    <label>Video <span class="opcional">(opcional - máximo 2 minutos)</span></label>
                    <div class="file-upload" id="videoUpload">
                        <div class="file-upload-icon">🎬</div>
                        <div class="file-upload-text">Subí un video corto contando tu experiencia</div>
                        <div class="file-upload-hint">MP4, MOV o WEBM - Máximo 100MB</div>
                        <input type="file" name="video" id="video" accept="video/*">
                    </div>
                    <div class="preview-container" id="videoPreview"></div>
                </div>

                <button type="submit" name="duendes_testimonio_submit" class="submit-btn">
                    Enviar mi Testimonio
                </button>

                <p class="footer-note">
                    Tu testimonio será revisado antes de publicarse.<br>
                    Nos reservamos el derecho de editar por claridad o extensión.
                </p>
            </form>
            <?php endif; ?>
        </div>

        <script>
            // Preview de fotos
            document.getElementById('fotos').addEventListener('change', function(e) {
                const preview = document.getElementById('fotosPreview');
                preview.innerHTML = '';

                const files = Array.from(e.target.files).slice(0, 3);

                files.forEach((file, index) => {
                    if (!file.type.startsWith('image/')) return;
                    if (file.size > 5 * 1024 * 1024) {
                        alert('La imagen ' + file.name + ' es muy grande. Máximo 5MB.');
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const div = document.createElement('div');
                        div.className = 'preview-item';
                        div.innerHTML = '<img src="' + e.target.result + '" alt="Preview">';
                        preview.appendChild(div);
                    };
                    reader.readAsDataURL(file);
                });
            });

            // Preview de video
            document.getElementById('video').addEventListener('change', function(e) {
                const preview = document.getElementById('videoPreview');
                preview.innerHTML = '';

                const file = e.target.files[0];
                if (!file) return;

                if (file.size > 100 * 1024 * 1024) {
                    alert('El video es muy grande. Máximo 100MB.');
                    e.target.value = '';
                    return;
                }

                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.controls = true;
                video.style.maxWidth = '200px';
                video.style.borderRadius = '8px';

                video.onloadedmetadata = function() {
                    if (video.duration > 120) {
                        alert('El video es muy largo. Máximo 2 minutos.');
                        e.target.value = '';
                        preview.innerHTML = '';
                    }
                };

                const div = document.createElement('div');
                div.className = 'preview-item';
                div.style.width = 'auto';
                div.style.height = 'auto';
                div.appendChild(video);
                preview.appendChild(div);
            });
        </script>
    </body>
    </html>
    <?php
    exit;
});

function duendes_procesar_testimonio() {
    // Verificar nonce
    if (!isset($_POST['testimonio_nonce']) ||
        !wp_verify_nonce($_POST['testimonio_nonce'], 'duendes_testimonio_publico')) {
        return ['tipo' => 'error', 'mensaje' => 'Error de seguridad. Recargá la página e intentá de nuevo.'];
    }

    // Validar campos requeridos
    $nombre = sanitize_text_field($_POST['nombre'] ?? '');
    $email = sanitize_email($_POST['email'] ?? '');
    $pais = sanitize_text_field($_POST['pais'] ?? '');
    $guardian = sanitize_text_field($_POST['guardian'] ?? '');
    $experiencia = sanitize_textarea_field($_POST['experiencia'] ?? '');
    $rating = intval($_POST['rating'] ?? 5);

    if (empty($nombre) || empty($email) || empty($experiencia)) {
        return ['tipo' => 'error', 'mensaje' => 'Por favor completá todos los campos requeridos.'];
    }

    if (!is_email($email)) {
        return ['tipo' => 'error', 'mensaje' => 'El email no es válido.'];
    }

    // Crear post (como borrador/pendiente)
    $post_id = wp_insert_post([
        'post_type' => 'testimonio',
        'post_status' => 'pending',
        'post_title' => wp_trim_words($experiencia, 10, '...'),
        'post_content' => $experiencia
    ]);

    if (is_wp_error($post_id)) {
        return ['tipo' => 'error', 'mensaje' => 'Hubo un error guardando tu testimonio. Intentá de nuevo.'];
    }

    // Guardar meta datos
    update_post_meta($post_id, '_testimonio_nombre', $nombre);
    update_post_meta($post_id, '_testimonio_email', $email);
    update_post_meta($post_id, '_testimonio_pais', $pais);
    update_post_meta($post_id, '_testimonio_guardian', $guardian);
    update_post_meta($post_id, '_testimonio_rating', $rating);

    // Procesar fotos
    if (!empty($_FILES['fotos']['name'][0])) {
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');

        $foto_ids = [];
        $files = $_FILES['fotos'];

        for ($i = 0; $i < min(3, count($files['name'])); $i++) {
            if (empty($files['name'][$i])) continue;

            // Validar tamaño
            if ($files['size'][$i] > 5 * 1024 * 1024) continue;

            // Validar tipo
            $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!in_array($files['type'][$i], $allowed)) continue;

            $_FILES['upload_file'] = [
                'name' => $files['name'][$i],
                'type' => $files['type'][$i],
                'tmp_name' => $files['tmp_name'][$i],
                'error' => $files['error'][$i],
                'size' => $files['size'][$i]
            ];

            $attachment_id = media_handle_upload('upload_file', $post_id);
            if (!is_wp_error($attachment_id)) {
                $foto_ids[] = $attachment_id;
            }
        }

        if (!empty($foto_ids)) {
            update_post_meta($post_id, '_testimonio_fotos', $foto_ids);
            // Usar primera foto como thumbnail
            set_post_thumbnail($post_id, $foto_ids[0]);
        }
    }

    // Procesar video
    if (!empty($_FILES['video']['name'])) {
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');

        $video = $_FILES['video'];

        // Validar tamaño (100MB)
        if ($video['size'] <= 100 * 1024 * 1024) {
            $allowed = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];

            if (in_array($video['type'], $allowed)) {
                $attachment_id = media_handle_upload('video', $post_id);
                if (!is_wp_error($attachment_id)) {
                    $video_url = wp_get_attachment_url($attachment_id);
                    update_post_meta($post_id, '_testimonio_video_id', $attachment_id);
                    update_post_meta($post_id, '_testimonio_video_url', $video_url);
                }
            }
        }
    }

    // Notificar por email al admin
    $admin_email = get_option('admin_email');
    $subject = '[Duendes] Nuevo testimonio de ' . $nombre;
    $message = "Nuevo testimonio recibido:\n\n";
    $message .= "Nombre: $nombre\n";
    $message .= "Email: $email\n";
    $message .= "País: $pais\n";
    $message .= "Guardián: $guardian\n";
    $message .= "Rating: " . str_repeat('★', $rating) . "\n\n";
    $message .= "Experiencia:\n$experiencia\n\n";
    $message .= "Ver en admin: " . admin_url("post.php?post=$post_id&action=edit");

    wp_mail($admin_email, $subject, $message);

    return ['tipo' => 'exito', 'mensaje' => 'Tu testimonio fue enviado correctamente. Lo revisaremos pronto.'];
}

// ============================================================
// 5. PÁGINA PÚBLICA DE TESTIMONIOS (/testimonios)
// ============================================================

add_action('init', function() {
    add_rewrite_rule('^testimonios/?$', 'index.php?duendes_testimonios_galeria=1', 'top');
});

add_filter('query_vars', function($vars) {
    $vars[] = 'duendes_testimonios_galeria';
    return $vars;
}, 20);

add_action('template_redirect', function() {
    if (!get_query_var('duendes_testimonios_galeria')) return;

    // Obtener testimonios publicados
    $destacados = get_posts([
        'post_type' => 'testimonio',
        'post_status' => 'publish',
        'posts_per_page' => 3,
        'meta_query' => [
            ['key' => '_testimonio_destacado', 'value' => '1']
        ],
        'orderby' => 'date',
        'order' => 'DESC'
    ]);

    $destacados_ids = wp_list_pluck($destacados, 'ID');

    $normales = get_posts([
        'post_type' => 'testimonio',
        'post_status' => 'publish',
        'posts_per_page' => 50,
        'post__not_in' => $destacados_ids,
        'orderby' => 'date',
        'order' => 'DESC'
    ]);

    $total_testimonios = count($destacados) + count($normales);

    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Testimonios | Duendes del Uruguay</title>
        <meta name="description" content="Historias reales de quienes encontraron a su guardián mágico. Descubrí las experiencias de nuestra comunidad.">
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }

            body {
                background: #0f120d;
                color: #e8e6e3;
                font-family: Georgia, 'Times New Roman', serif;
                line-height: 1.7;
                min-height: 100vh;
            }

            .hero {
                text-align: center;
                padding: 80px 20px 60px;
                background: linear-gradient(180deg, rgba(184,151,58,0.1) 0%, transparent 100%);
            }

            .hero h1 {
                font-family: 'Cinzel', serif;
                color: #B8973A;
                font-size: 2.8rem;
                font-weight: 600;
                margin-bottom: 20px;
                letter-spacing: 2px;
            }

            .hero p {
                color: rgba(255,255,255,0.7);
                font-size: 1.2rem;
                max-width: 600px;
                margin: 0 auto 30px;
            }

            .stats {
                display: flex;
                justify-content: center;
                gap: 50px;
                margin-top: 40px;
            }

            .stat {
                text-align: center;
            }

            .stat-number {
                font-family: 'Cinzel', serif;
                font-size: 3rem;
                color: #B8973A;
                font-weight: 700;
            }

            .stat-label {
                color: rgba(255,255,255,0.5);
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 20px 80px;
            }

            .section-title {
                font-family: 'Cinzel', serif;
                color: #B8973A;
                font-size: 1.5rem;
                text-align: center;
                margin-bottom: 40px;
                position: relative;
            }

            .section-title::after {
                content: '';
                display: block;
                width: 60px;
                height: 2px;
                background: linear-gradient(90deg, transparent, #B8973A, transparent);
                margin: 15px auto 0;
            }

            /* Destacados */
            .destacados {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 30px;
                margin-bottom: 60px;
            }

            .testimonio-destacado {
                background: linear-gradient(135deg, rgba(184,151,58,0.15) 0%, rgba(20,25,18,0.9) 100%);
                border: 1px solid rgba(184,151,58,0.4);
                border-radius: 20px;
                padding: 35px;
                position: relative;
                overflow: hidden;
            }

            .testimonio-destacado::before {
                content: '★';
                position: absolute;
                top: 20px;
                right: 20px;
                font-size: 1.5rem;
                color: #B8973A;
            }

            .testimonio-destacado .foto-container {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }

            .testimonio-destacado .foto {
                width: 80px;
                height: 80px;
                border-radius: 12px;
                object-fit: cover;
                border: 2px solid rgba(184,151,58,0.3);
            }

            .testimonio-destacado .contenido {
                font-size: 1.1rem;
                line-height: 1.8;
                margin-bottom: 20px;
                font-style: italic;
            }

            .testimonio-destacado .autor {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .testimonio-destacado .autor-info h4 {
                font-family: 'Cinzel', serif;
                color: #B8973A;
                font-size: 1rem;
                margin-bottom: 3px;
            }

            .testimonio-destacado .autor-info span {
                color: rgba(255,255,255,0.5);
                font-size: 0.85rem;
            }

            .rating {
                color: #B8973A;
                font-size: 1.1rem;
                letter-spacing: 2px;
            }

            /* Grid normal */
            .testimonios-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 25px;
            }

            .testimonio-card {
                background: rgba(20, 25, 18, 0.8);
                border: 1px solid rgba(184, 151, 58, 0.2);
                border-radius: 16px;
                padding: 25px;
                transition: all 0.3s ease;
            }

            .testimonio-card:hover {
                border-color: rgba(184, 151, 58, 0.5);
                transform: translateY(-5px);
                box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            }

            .testimonio-card .foto-mini {
                width: 50px;
                height: 50px;
                border-radius: 8px;
                object-fit: cover;
                float: right;
                margin-left: 15px;
                margin-bottom: 10px;
            }

            .testimonio-card .contenido {
                font-size: 0.95rem;
                line-height: 1.7;
                margin-bottom: 15px;
                display: -webkit-box;
                -webkit-line-clamp: 5;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .testimonio-card .meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 15px;
                border-top: 1px solid rgba(184,151,58,0.15);
            }

            .testimonio-card .autor-nombre {
                font-family: 'Cinzel', serif;
                color: #B8973A;
                font-size: 0.9rem;
            }

            .testimonio-card .autor-pais {
                color: rgba(255,255,255,0.4);
                font-size: 0.8rem;
            }

            .testimonio-card .guardian {
                font-size: 0.8rem;
                color: rgba(255,255,255,0.5);
                background: rgba(184,151,58,0.1);
                padding: 4px 10px;
                border-radius: 20px;
            }

            /* Video badge */
            .video-badge {
                display: inline-block;
                background: rgba(184,151,58,0.2);
                color: #B8973A;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 0.75rem;
                margin-left: 10px;
            }

            /* Lightbox */
            .lightbox {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                z-index: 10000;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }

            .lightbox.active {
                display: flex;
            }

            .lightbox-content {
                max-width: 900px;
                width: 100%;
                background: #0f120d;
                border: 1px solid rgba(184,151,58,0.3);
                border-radius: 20px;
                padding: 40px;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }

            .lightbox-close {
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 2rem;
                color: #B8973A;
                background: none;
                border: none;
                cursor: pointer;
            }

            .lightbox-fotos {
                display: flex;
                gap: 15px;
                margin-bottom: 25px;
                flex-wrap: wrap;
            }

            .lightbox-fotos img {
                max-width: 200px;
                max-height: 200px;
                border-radius: 12px;
                object-fit: cover;
            }

            .lightbox-video {
                width: 100%;
                max-height: 400px;
                border-radius: 12px;
                margin-bottom: 25px;
            }

            .lightbox-texto {
                font-size: 1.1rem;
                line-height: 1.9;
                margin-bottom: 25px;
            }

            .lightbox-autor {
                font-family: 'Cinzel', serif;
                color: #B8973A;
            }

            /* CTA */
            .cta-section {
                text-align: center;
                padding: 60px 20px;
                background: linear-gradient(180deg, transparent 0%, rgba(184,151,58,0.1) 100%);
                margin-top: 60px;
            }

            .cta-section h2 {
                font-family: 'Cinzel', serif;
                color: #B8973A;
                font-size: 1.8rem;
                margin-bottom: 15px;
            }

            .cta-section p {
                color: rgba(255,255,255,0.7);
                margin-bottom: 25px;
            }

            .cta-btn {
                display: inline-block;
                padding: 15px 40px;
                background: linear-gradient(135deg, #B8973A 0%, #8B6914 100%);
                color: #0f120d;
                text-decoration: none;
                font-family: 'Cinzel', serif;
                font-weight: 600;
                border-radius: 8px;
                transition: all 0.3s;
            }

            .cta-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(184,151,58,0.3);
            }

            .empty-state {
                text-align: center;
                padding: 80px 20px;
                color: rgba(255,255,255,0.5);
            }

            .empty-state h2 {
                font-family: 'Cinzel', serif;
                color: #B8973A;
                margin-bottom: 15px;
            }

            @media (max-width: 768px) {
                .hero h1 { font-size: 2rem; }
                .stats { gap: 30px; }
                .stat-number { font-size: 2rem; }
                .destacados { grid-template-columns: 1fr; }
                .testimonios-grid { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>
        <div class="hero">
            <h1>Historias Reales</h1>
            <p>Experiencias de quienes encontraron a su guardián mágico y transformaron algo en sus vidas.</p>

            <?php if ($total_testimonios > 0): ?>
            <div class="stats">
                <div class="stat">
                    <div class="stat-number"><?php echo $total_testimonios; ?>+</div>
                    <div class="stat-label">Testimonios</div>
                </div>
                <div class="stat">
                    <div class="stat-number">★★★★★</div>
                    <div class="stat-label">Valoración Promedio</div>
                </div>
            </div>
            <?php endif; ?>
        </div>

        <div class="container">
            <?php if (empty($destacados) && empty($normales)): ?>
                <div class="empty-state">
                    <h2>Pronto habrá historias aquí</h2>
                    <p>Sé el primero en compartir tu experiencia con tu guardián.</p>
                    <a href="/mi-testimonio" class="cta-btn">Compartir mi Historia</a>
                </div>
            <?php else: ?>

            <?php if (!empty($destacados)): ?>
                <h2 class="section-title">Experiencias Destacadas</h2>
                <div class="destacados">
                    <?php foreach ($destacados as $t):
                        $nombre = get_post_meta($t->ID, '_testimonio_nombre', true);
                        $pais = get_post_meta($t->ID, '_testimonio_pais', true);
                        $guardian = get_post_meta($t->ID, '_testimonio_guardian', true);
                        $rating = get_post_meta($t->ID, '_testimonio_rating', true) ?: 5;
                        $fotos = get_post_meta($t->ID, '_testimonio_fotos', true) ?: [];
                        $video_url = get_post_meta($t->ID, '_testimonio_video_url', true);
                    ?>
                    <div class="testimonio-destacado" data-id="<?php echo $t->ID; ?>">
                        <?php if (!empty($fotos)): ?>
                        <div class="foto-container">
                            <?php foreach (array_slice($fotos, 0, 3) as $foto_id): ?>
                                <img src="<?php echo wp_get_attachment_image_url($foto_id, 'thumbnail'); ?>" alt="" class="foto">
                            <?php endforeach; ?>
                        </div>
                        <?php endif; ?>

                        <div class="contenido">
                            "<?php echo esc_html(wp_trim_words($t->post_content, 80, '...')); ?>"
                        </div>

                        <div class="autor">
                            <div class="autor-info">
                                <h4>
                                    <?php echo esc_html($nombre); ?>
                                    <?php if ($video_url): ?>
                                        <span class="video-badge">🎬 Video</span>
                                    <?php endif; ?>
                                </h4>
                                <span>
                                    <?php echo esc_html($pais); ?>
                                    <?php if ($guardian): ?>
                                        · <?php echo esc_html($guardian); ?>
                                    <?php endif; ?>
                                </span>
                            </div>
                        </div>
                        <div class="rating" style="margin-top: 15px;">
                            <?php echo str_repeat('★', $rating); ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($normales)): ?>
                <h2 class="section-title">Más Experiencias</h2>
                <div class="testimonios-grid">
                    <?php foreach ($normales as $t):
                        $nombre = get_post_meta($t->ID, '_testimonio_nombre', true);
                        $pais = get_post_meta($t->ID, '_testimonio_pais', true);
                        $guardian = get_post_meta($t->ID, '_testimonio_guardian', true);
                        $rating = get_post_meta($t->ID, '_testimonio_rating', true) ?: 5;
                        $fotos = get_post_meta($t->ID, '_testimonio_fotos', true) ?: [];
                        $video_url = get_post_meta($t->ID, '_testimonio_video_url', true);
                    ?>
                    <div class="testimonio-card" data-id="<?php echo $t->ID; ?>">
                        <?php if (!empty($fotos)): ?>
                            <img src="<?php echo wp_get_attachment_image_url($fotos[0], 'thumbnail'); ?>" alt="" class="foto-mini">
                        <?php endif; ?>

                        <div class="contenido">
                            "<?php echo esc_html($t->post_content); ?>"
                        </div>

                        <div class="meta">
                            <div>
                                <div class="autor-nombre">
                                    <?php echo esc_html($nombre); ?>
                                    <?php if ($video_url): ?>
                                        <span class="video-badge">🎬</span>
                                    <?php endif; ?>
                                </div>
                                <div class="autor-pais"><?php echo esc_html($pais); ?></div>
                            </div>
                            <?php if ($guardian): ?>
                                <div class="guardian"><?php echo esc_html($guardian); ?></div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <?php endif; ?>
        </div>

        <div class="cta-section">
            <h2>¿Ya tenés tu guardián?</h2>
            <p>Compartí tu experiencia y ayudá a otros a encontrar el suyo.</p>
            <a href="/mi-testimonio" class="cta-btn">Compartir mi Historia</a>
        </div>

        <!-- Lightbox para ver completo -->
        <div class="lightbox" id="lightbox">
            <div class="lightbox-content">
                <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
                <div id="lightbox-body"></div>
            </div>
        </div>

        <script>
            // Data de testimonios para lightbox
            const testimoniosData = <?php
                $all = array_merge($destacados, $normales);
                $data = [];
                foreach ($all as $t) {
                    $fotos = get_post_meta($t->ID, '_testimonio_fotos', true) ?: [];
                    $foto_urls = [];
                    foreach ($fotos as $fid) {
                        $foto_urls[] = wp_get_attachment_image_url($fid, 'large');
                    }
                    $data[$t->ID] = [
                        'nombre' => get_post_meta($t->ID, '_testimonio_nombre', true),
                        'pais' => get_post_meta($t->ID, '_testimonio_pais', true),
                        'guardian' => get_post_meta($t->ID, '_testimonio_guardian', true),
                        'rating' => get_post_meta($t->ID, '_testimonio_rating', true) ?: 5,
                        'contenido' => $t->post_content,
                        'fotos' => $foto_urls,
                        'video' => get_post_meta($t->ID, '_testimonio_video_url', true)
                    ];
                }
                echo json_encode($data);
            ?>;

            document.querySelectorAll('.testimonio-card, .testimonio-destacado').forEach(el => {
                el.style.cursor = 'pointer';
                el.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const t = testimoniosData[id];
                    if (!t) return;

                    let html = '';

                    if (t.fotos && t.fotos.length) {
                        html += '<div class="lightbox-fotos">';
                        t.fotos.forEach(url => {
                            html += '<img src="' + url + '" alt="">';
                        });
                        html += '</div>';
                    }

                    if (t.video) {
                        html += '<video controls class="lightbox-video"><source src="' + t.video + '" type="video/mp4"></video>';
                    }

                    html += '<div class="lightbox-texto">"' + t.contenido + '"</div>';
                    html += '<div class="lightbox-autor">' + t.nombre + ' · ' + t.pais;
                    if (t.guardian) html += ' · ' + t.guardian;
                    html += '</div>';
                    html += '<div class="rating" style="margin-top:10px;">' + '★'.repeat(t.rating) + '</div>';

                    document.getElementById('lightbox-body').innerHTML = html;
                    document.getElementById('lightbox').classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });

            function closeLightbox() {
                document.getElementById('lightbox').classList.remove('active');
                document.body.style.overflow = '';
                // Pausar video si hay
                const video = document.querySelector('.lightbox-video');
                if (video) video.pause();
            }

            document.getElementById('lightbox').addEventListener('click', function(e) {
                if (e.target === this) closeLightbox();
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closeLightbox();
            });
        </script>
    </body>
    </html>
    <?php
    exit;
});

// ============================================================
// 6. FLUSH REWRITE RULES ON ACTIVATION
// ============================================================

// Flush rules cuando se carga el plugin por primera vez
add_action('init', function() {
    if (get_option('duendes_testimonios_flush_rules') !== 'done') {
        flush_rewrite_rules();
        update_option('duendes_testimonios_flush_rules', 'done');
    }
}, 999);

// ============================================================
// 7. ADMIN NOTICES
// ============================================================

add_action('admin_notices', function() {
    $screen = get_current_screen();
    if ($screen->post_type !== 'testimonio') return;

    $pending = wp_count_posts('testimonio')->pending;
    if ($pending > 0) {
        echo '<div class="notice notice-warning"><p>';
        echo '<strong>Testimonios pendientes:</strong> Tenés ' . $pending . ' testimonio(s) esperando aprobación. ';
        echo '<a href="' . admin_url('edit.php?post_type=testimonio&post_status=pending') . '">Ver pendientes</a>';
        echo '</p></div>';
    }
});

// ============================================================
// 8. QUICK ACTIONS
// ============================================================

add_filter('post_row_actions', function($actions, $post) {
    if ($post->post_type !== 'testimonio') return $actions;

    if ($post->post_status === 'pending') {
        $approve_url = wp_nonce_url(
            admin_url("post.php?post={$post->ID}&action=duendes_aprobar_testimonio"),
            'aprobar_testimonio_' . $post->ID
        );
        $actions['aprobar'] = '<a href="' . $approve_url . '" style="color:#46b450;font-weight:bold;">Aprobar</a>';
    }

    return $actions;
}, 10, 2);

add_action('admin_action_duendes_aprobar_testimonio', function() {
    $post_id = intval($_GET['post'] ?? 0);

    if (!$post_id || !wp_verify_nonce($_GET['_wpnonce'], 'aprobar_testimonio_' . $post_id)) {
        wp_die('Error de seguridad');
    }

    wp_update_post([
        'ID' => $post_id,
        'post_status' => 'publish'
    ]);

    wp_redirect(admin_url('edit.php?post_type=testimonio&approved=1'));
    exit;
});

add_action('admin_notices', function() {
    if (isset($_GET['approved']) && $_GET['approved'] == '1' && isset($_GET['post_type']) && $_GET['post_type'] === 'testimonio') {
        echo '<div class="notice notice-success is-dismissible"><p>Testimonio aprobado y publicado.</p></div>';
    }
});
