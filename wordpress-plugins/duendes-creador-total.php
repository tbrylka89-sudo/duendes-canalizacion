<?php
/**
 * Plugin Name: Duendes Creador Total
 * Description: UN SOLO LUGAR para crear guardianes completos - fotos, datos, precio, historia, TODO
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Registrar el menu
add_action('admin_menu', function() {
    add_menu_page(
        'Crear Guardian',
        'Crear Guardian',
        'manage_woocommerce',
        'duendes-creador',
        'duendes_creador_page',
        'dashicons-star-filled',
        55
    );
});

// Manejar AJAX para crear guardian completo
add_action('wp_ajax_duendes_crear_guardian', 'duendes_crear_guardian_ajax');
function duendes_crear_guardian_ajax() {
    check_ajax_referer('duendes_creador_nonce', 'nonce');

    $nombre = sanitize_text_field($_POST['nombre']);
    $tipo = sanitize_text_field($_POST['tipo']);
    $genero = sanitize_text_field($_POST['genero']);
    $altura = sanitize_text_field($_POST['altura']);
    $ojos = sanitize_text_field($_POST['ojos']);
    $accesorios = sanitize_textarea_field($_POST['accesorios']);
    $elemento = sanitize_text_field($_POST['elemento']);
    $proposito = sanitize_text_field($_POST['proposito']);
    $notas = sanitize_textarea_field($_POST['notas']);
    $precio_usd = floatval($_POST['precio_usd']);
    $imagen_ids = array_map('intval', explode(',', $_POST['imagen_ids']));

    // 1. Crear producto en WooCommerce
    $product = new WC_Product_Simple();
    $product->set_name($nombre);
    $product->set_status('draft'); // Borrador hasta que se genere historia
    $product->set_regular_price($precio_usd);
    $product->set_manage_stock(true);
    $product->set_stock_quantity(1);
    $product->set_stock_status('instock');

    // Imagenes
    if (!empty($imagen_ids) && $imagen_ids[0] > 0) {
        $product->set_image_id($imagen_ids[0]);
        if (count($imagen_ids) > 1) {
            $product->set_gallery_image_ids(array_slice($imagen_ids, 1));
        }
    }

    $product_id = $product->save();

    if (!$product_id) {
        wp_send_json_error(['message' => 'Error creando producto']);
        return;
    }

    // Guardar meta datos del guardian
    update_post_meta($product_id, '_guardian_tipo', $tipo);
    update_post_meta($product_id, '_guardian_genero', $genero);
    update_post_meta($product_id, '_guardian_altura', $altura);
    update_post_meta($product_id, '_guardian_ojos', $ojos);
    update_post_meta($product_id, '_guardian_accesorios', $accesorios);
    update_post_meta($product_id, '_guardian_elemento', $elemento);
    update_post_meta($product_id, '_guardian_proposito', $proposito);

    // 2. Llamar a Vercel para generar historia
    $response = wp_remote_post('https://duendes-vercel.vercel.app/api/admin/productos/generar-historia', [
        'timeout' => 120,
        'headers' => ['Content-Type' => 'application/json'],
        'body' => json_encode([
            'nombre' => $nombre,
            'tipo' => $tipo,
            'genero' => $genero,
            'altura' => $altura,
            'colorOjos' => $ojos,
            'accesorios' => $accesorios,
            'elemento' => $elemento,
            'proposito' => $proposito,
            'notas' => $notas,
            'productId' => 'woo_' . $product_id
        ])
    ]);

    if (is_wp_error($response)) {
        wp_send_json_error([
            'message' => 'Producto creado pero error generando historia: ' . $response->get_error_message(),
            'product_id' => $product_id
        ]);
        return;
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);

    if (!$body['success']) {
        wp_send_json_error([
            'message' => 'Producto creado pero error en historia: ' . ($body['error'] ?? 'desconocido'),
            'product_id' => $product_id
        ]);
        return;
    }

    // 3. Guardar historia en el producto
    $historia = $body['contenido']['historia'] ?? [];
    $neuro = $body['contenido']['neuromarketing'] ?? [];
    $meta = $body['contenido']['metaDatos'] ?? [];

    update_post_meta($product_id, '_guardian_historia', json_encode($historia, JSON_UNESCAPED_UNICODE));
    update_post_meta($product_id, '_guardian_neuro', json_encode($neuro, JSON_UNESCAPED_UNICODE));
    update_post_meta($product_id, '_historia_fecha', date('Y-m-d H:i:s'));

    // Descripcion corta
    if (!empty($meta['descripcionCorta'])) {
        $product->set_short_description($meta['descripcionCorta']);
    }

    // Descripcion larga con la historia
    if (!empty($historia['origen'])) {
        $descripcion = "<h3>Su Historia</h3>\n" . $historia['origen'];
        if (!empty($historia['personalidad'])) {
            $descripcion .= "\n\n<h3>Personalidad</h3>\n" . $historia['personalidad'];
        }
        $product->set_description($descripcion);
    }

    // 4. Asignar categoria
    if (!empty($body['clasificacion']['categoriaId'])) {
        wp_set_object_terms($product_id, [(int)$body['clasificacion']['categoriaId']], 'product_cat');
    }

    // 5. Publicar producto
    $product->set_status('publish');
    $product->save();

    wp_send_json_success([
        'message' => 'Guardian creado exitosamente!',
        'product_id' => $product_id,
        'categoria' => $body['clasificacion']['categoria'] ?? 'asignada',
        'edit_url' => admin_url('post.php?post=' . $product_id . '&action=edit'),
        'view_url' => get_permalink($product_id)
    ]);
}

// Pagina principal
function duendes_creador_page() {
    wp_enqueue_media();

    // Obtener productos existentes
    $products = wc_get_products([
        'limit' => 50,
        'orderby' => 'date',
        'order' => 'DESC'
    ]);

    $con_historia = 0;
    $sin_historia = 0;
    foreach ($products as $p) {
        if (get_post_meta($p->get_id(), '_guardian_historia', true)) {
            $con_historia++;
        } else {
            $sin_historia++;
        }
    }
    ?>
    <style>
        * { box-sizing: border-box; }
        .duendes-creador {
            background: #0d1117;
            min-height: 100vh;
            margin-left: -20px;
            padding: 30px 40px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .dc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .dc-header h1 {
            color: #C6A962;
            font-size: 28px;
            margin: 0;
        }
        .dc-stats {
            display: flex;
            gap: 20px;
            background: #161b22;
            padding: 15px 25px;
            border-radius: 10px;
            border: 1px solid #30363d;
        }
        .dc-stat {
            text-align: center;
        }
        .dc-stat-num {
            font-size: 24px;
            font-weight: bold;
            color: #fff;
        }
        .dc-stat-num.green { color: #22c55e; }
        .dc-stat-num.orange { color: #f59e0b; }
        .dc-stat-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
        }

        .dc-main {
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 30px;
        }

        .dc-form-container {
            background: #161b22;
            border-radius: 16px;
            border: 1px solid #30363d;
            overflow: hidden;
        }
        .dc-form-header {
            padding: 20px 25px;
            border-bottom: 1px solid #30363d;
            background: #0d1117;
        }
        .dc-form-header h2 {
            margin: 0;
            color: #C6A962;
            font-size: 18px;
        }
        .dc-form {
            padding: 25px;
        }

        .dc-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .dc-row.single {
            grid-template-columns: 1fr;
        }

        .dc-field label {
            display: block;
            color: #888;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        .dc-field input,
        .dc-field select,
        .dc-field textarea {
            width: 100%;
            padding: 12px 15px;
            background: #21262d;
            border: 1px solid #30363d;
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
        }
        .dc-field input:focus,
        .dc-field select:focus,
        .dc-field textarea:focus {
            outline: none;
            border-color: #C6A962;
        }
        .dc-field textarea {
            resize: vertical;
            min-height: 60px;
        }

        /* Upload area */
        .dc-upload-area {
            border: 2px dashed #30363d;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            margin-bottom: 20px;
        }
        .dc-upload-area:hover {
            border-color: #C6A962;
            background: rgba(198, 169, 98, 0.05);
        }
        .dc-upload-area.has-images {
            border-style: solid;
            border-color: #22c55e;
        }
        .dc-upload-icon {
            font-size: 40px;
            margin-bottom: 10px;
        }
        .dc-upload-text {
            color: #888;
            font-size: 14px;
        }
        .dc-upload-text strong {
            color: #C6A962;
        }

        .dc-preview-images {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        .dc-preview-img {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            object-fit: cover;
            border: 2px solid #30363d;
        }
        .dc-preview-img.main {
            border-color: #C6A962;
        }

        /* Precio */
        .dc-precio-row {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            background: #21262d;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        .dc-precio-field label {
            color: #888;
            font-size: 10px;
            text-transform: uppercase;
            display: block;
            margin-bottom: 5px;
        }
        .dc-precio-field .value {
            color: #C6A962;
            font-size: 20px;
            font-weight: bold;
        }
        .dc-precio-field input {
            background: #161b22;
            border: 1px solid #30363d;
            color: #C6A962;
            font-size: 20px;
            font-weight: bold;
            padding: 10px;
            border-radius: 8px;
            width: 100%;
        }

        /* Boton crear */
        .dc-submit {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #C6A962, #a88a42);
            border: none;
            border-radius: 12px;
            color: #0a0a0a;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.3s;
        }
        .dc-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(198, 169, 98, 0.3);
        }
        .dc-submit:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .dc-status {
            text-align: center;
            margin-top: 15px;
            min-height: 24px;
            color: #C6A962;
        }

        /* Lista lateral */
        .dc-sidebar {
            background: #161b22;
            border-radius: 16px;
            border: 1px solid #30363d;
            overflow: hidden;
        }
        .dc-sidebar-header {
            padding: 20px;
            border-bottom: 1px solid #30363d;
            background: #0d1117;
        }
        .dc-sidebar-header h3 {
            margin: 0;
            color: #fff;
            font-size: 14px;
        }
        .dc-list {
            max-height: 600px;
            overflow-y: auto;
        }
        .dc-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 15px;
            border-bottom: 1px solid #21262d;
            transition: background 0.2s;
        }
        .dc-item:hover {
            background: #21262d;
        }
        .dc-item-img {
            width: 45px;
            height: 45px;
            border-radius: 8px;
            object-fit: cover;
            background: #21262d;
        }
        .dc-item-info {
            flex: 1;
            min-width: 0;
        }
        .dc-item-name {
            color: #fff;
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .dc-item-meta {
            color: #666;
            font-size: 11px;
        }
        .dc-item-status {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #f59e0b;
        }
        .dc-item-status.ok {
            background: #22c55e;
        }

        /* Responsive */
        @media (max-width: 1200px) {
            .dc-main {
                grid-template-columns: 1fr;
            }
            .dc-sidebar {
                order: -1;
            }
            .dc-list {
                max-height: 300px;
            }
        }
    </style>

    <div class="duendes-creador">
        <div class="dc-header">
            <h1>Crear Guardian</h1>
            <div class="dc-stats">
                <div class="dc-stat">
                    <div class="dc-stat-num"><?php echo count($products); ?></div>
                    <div class="dc-stat-label">Total</div>
                </div>
                <div class="dc-stat">
                    <div class="dc-stat-num green"><?php echo $con_historia; ?></div>
                    <div class="dc-stat-label">Con Historia</div>
                </div>
                <div class="dc-stat">
                    <div class="dc-stat-num orange"><?php echo $sin_historia; ?></div>
                    <div class="dc-stat-label">Sin Historia</div>
                </div>
            </div>
        </div>

        <div class="dc-main">
            <div class="dc-form-container">
                <div class="dc-form-header">
                    <h2>Nuevo Guardian - Todo en un solo lugar</h2>
                </div>
                <form class="dc-form" id="form-crear-guardian">
                    <?php wp_nonce_field('duendes_creador_nonce', 'dc_nonce'); ?>

                    <!-- FOTOS -->
                    <div class="dc-upload-area" id="upload-area">
                        <div class="dc-upload-icon">📸</div>
                        <div class="dc-upload-text">
                            <strong>Click para subir fotos</strong><br>
                            La primera sera la imagen principal
                        </div>
                        <div class="dc-preview-images" id="preview-images"></div>
                    </div>
                    <input type="hidden" id="imagen_ids" name="imagen_ids" value="">

                    <!-- NOMBRE Y TIPO -->
                    <div class="dc-row">
                        <div class="dc-field">
                            <label>Nombre del Guardian *</label>
                            <input type="text" id="nombre" name="nombre" placeholder="ej: Agustina, Elderwood, Bramble..." required>
                        </div>
                        <div class="dc-field">
                            <label>Tipo de Ser *</label>
                            <select id="tipo" name="tipo" required>
                                <optgroup label="Seres del Bosque">
                                    <option value="Duende">Duende</option>
                                    <option value="Elfo">Elfo</option>
                                    <option value="Hada">Hada</option>
                                    <option value="Gnomo">Gnomo</option>
                                    <option value="Ninfa">Ninfa</option>
                                    <option value="Driade">Driade</option>
                                </optgroup>
                                <optgroup label="Practicantes de Magia">
                                    <option value="Bruja">Bruja</option>
                                    <option value="Brujo">Brujo</option>
                                    <option value="Mago">Mago</option>
                                    <option value="Hechicero">Hechicero</option>
                                    <option value="Hechicera">Hechicera</option>
                                </optgroup>
                                <optgroup label="Misticos">
                                    <option value="Chaman">Chaman</option>
                                    <option value="Druida">Druida</option>
                                    <option value="Oraculo">Oraculo</option>
                                    <option value="Vidente">Vidente</option>
                                </optgroup>
                                <optgroup label="Guardianes">
                                    <option value="Guardian">Guardian</option>
                                    <option value="Protector">Protector</option>
                                    <option value="Sanador">Sanador</option>
                                </optgroup>
                            </select>
                        </div>
                    </div>

                    <!-- GENERO Y ALTURA -->
                    <div class="dc-row">
                        <div class="dc-field">
                            <label>Genero</label>
                            <select id="genero" name="genero">
                                <option value="femenino">Femenino</option>
                                <option value="masculino">Masculino</option>
                                <option value="neutro">Neutro</option>
                            </select>
                        </div>
                        <div class="dc-field">
                            <label>Altura (cm)</label>
                            <input type="number" id="altura" name="altura" value="25" min="5" max="100">
                        </div>
                    </div>

                    <!-- OJOS Y ACCESORIOS -->
                    <div class="dc-row">
                        <div class="dc-field">
                            <label>Color de Ojos</label>
                            <input type="text" id="ojos" name="ojos" placeholder="ej: celestes, verdes brillantes, ambar...">
                        </div>
                        <div class="dc-field">
                            <label>Elemento</label>
                            <select id="elemento" name="elemento">
                                <option value="Cualquiera">Claude decide</option>
                                <option value="Tierra">Tierra</option>
                                <option value="Agua">Agua</option>
                                <option value="Fuego">Fuego</option>
                                <option value="Aire">Aire</option>
                                <option value="Eter">Eter</option>
                                <option value="Luz">Luz</option>
                                <option value="Sombra">Sombra</option>
                            </select>
                        </div>
                    </div>

                    <!-- ACCESORIOS -->
                    <div class="dc-row single">
                        <div class="dc-field">
                            <label>Accesorios / Detalles Fisicos</label>
                            <input type="text" id="accesorios" name="accesorios" placeholder="ej: escoba, calabaza, sombrero, flores en el pelo, capa...">
                        </div>
                    </div>

                    <!-- PROPOSITO Y NOTAS -->
                    <div class="dc-row">
                        <div class="dc-field">
                            <label>Proposito / Categoria</label>
                            <select id="proposito" name="proposito">
                                <option value="Que Claude decida">Claude decide</option>
                                <option value="Proteccion">Proteccion</option>
                                <option value="Amor">Amor</option>
                                <option value="Abundancia">Abundancia / Dinero</option>
                                <option value="Sanacion">Sanacion / Salud</option>
                                <option value="Sabiduria">Sabiduria / Guia</option>
                            </select>
                        </div>
                        <div class="dc-field">
                            <label>Notas para Claude (opcional)</label>
                            <input type="text" id="notas" name="notas" placeholder="ej: es anciana, tiene aspecto misterioso...">
                        </div>
                    </div>

                    <!-- PRECIO -->
                    <div class="dc-precio-row">
                        <div class="dc-precio-field">
                            <label>Precio USD *</label>
                            <input type="number" id="precio_usd" name="precio_usd" value="150" min="1" step="1" required>
                        </div>
                        <div class="dc-precio-field">
                            <label>Precio UYU</label>
                            <div class="value" id="precio_uyu">$6,450</div>
                        </div>
                        <div class="dc-precio-field">
                            <label>Precio ARS</label>
                            <div class="value" id="precio_ars">$157,500</div>
                        </div>
                    </div>

                    <button type="submit" class="dc-submit" id="btn-crear">
                        CREAR GUARDIAN COMPLETO
                    </button>
                    <div class="dc-status" id="status-msg"></div>
                </form>
            </div>

            <!-- Lista lateral -->
            <div class="dc-sidebar">
                <div class="dc-sidebar-header">
                    <h3>Ultimos Guardianes</h3>
                </div>
                <div class="dc-list">
                    <?php foreach ($products as $p):
                        $pid = $p->get_id();
                        $tiene_historia = get_post_meta($pid, '_guardian_historia', true);
                        $img = $p->get_image_id() ? wp_get_attachment_image_url($p->get_image_id(), 'thumbnail') : '';
                        $cats = wp_get_post_terms($pid, 'product_cat', ['fields' => 'names']);
                    ?>
                    <div class="dc-item">
                        <?php if ($img): ?>
                        <img src="<?php echo esc_url($img); ?>" class="dc-item-img">
                        <?php else: ?>
                        <div class="dc-item-img"></div>
                        <?php endif; ?>
                        <div class="dc-item-info">
                            <div class="dc-item-name"><?php echo esc_html($p->get_name()); ?></div>
                            <div class="dc-item-meta">$<?php echo $p->get_price(); ?> USD - <?php echo implode(', ', $cats); ?></div>
                        </div>
                        <div class="dc-item-status <?php echo $tiene_historia ? 'ok' : ''; ?>"></div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>

    <script>
    jQuery(document).ready(function($) {
        let imagenIds = [];
        const tasaUYU = 43;
        const tasaARS = 1050;

        // Actualizar precios
        $('#precio_usd').on('input', function() {
            const usd = parseFloat($(this).val()) || 0;
            $('#precio_uyu').text('$' + (usd * tasaUYU).toLocaleString('es-UY'));
            $('#precio_ars').text('$' + (usd * tasaARS).toLocaleString('es-AR'));
        });

        // Upload de imagenes
        $('#upload-area').on('click', function(e) {
            if ($(e.target).closest('.dc-preview-img').length) return;

            const frame = wp.media({
                title: 'Seleccionar fotos del guardian',
                multiple: true,
                library: { type: 'image' }
            });

            frame.on('select', function() {
                const attachments = frame.state().get('selection').toJSON();
                imagenIds = attachments.map(a => a.id);
                $('#imagen_ids').val(imagenIds.join(','));

                // Preview
                const preview = $('#preview-images');
                preview.empty();
                attachments.forEach((att, i) => {
                    preview.append(`<img src="${att.sizes.thumbnail?.url || att.url}" class="dc-preview-img ${i === 0 ? 'main' : ''}">`);
                });

                if (attachments.length > 0) {
                    $('#upload-area').addClass('has-images');
                    $('#upload-area .dc-upload-text').html('<strong>' + attachments.length + ' fotos seleccionadas</strong><br>Click para cambiar');
                }
            });

            frame.open();
        });

        // Submit
        $('#form-crear-guardian').on('submit', function(e) {
            e.preventDefault();

            const btn = $('#btn-crear');
            const status = $('#status-msg');

            if (!$('#nombre').val().trim()) {
                status.css('color', '#ef4444').text('Falta el nombre del guardian');
                return;
            }

            btn.prop('disabled', true).text('CREANDO GUARDIAN...');
            status.css('color', '#C6A962').text('Generando historia con Claude (30-60 seg)...');

            $.ajax({
                url: ajaxurl,
                method: 'POST',
                data: {
                    action: 'duendes_crear_guardian',
                    nonce: $('#dc_nonce').val(),
                    nombre: $('#nombre').val(),
                    tipo: $('#tipo').val(),
                    genero: $('#genero').val(),
                    altura: $('#altura').val(),
                    ojos: $('#ojos').val() || 'no especificado',
                    accesorios: $('#accesorios').val() || 'ninguno',
                    elemento: $('#elemento').val(),
                    proposito: $('#proposito').val(),
                    notas: $('#notas').val(),
                    precio_usd: $('#precio_usd').val(),
                    imagen_ids: imagenIds.join(',')
                },
                success: function(res) {
                    if (res.success) {
                        status.css('color', '#22c55e').html(
                            'Guardian creado! Categoria: ' + res.data.categoria +
                            '<br><a href="' + res.data.view_url + '" target="_blank" style="color:#C6A962;">Ver en tienda</a>'
                        );
                        btn.text('GUARDIAN CREADO!').css('background', '#22c55e');

                        // Reset form despues de 2 seg
                        setTimeout(function() {
                            location.reload();
                        }, 3000);
                    } else {
                        status.css('color', '#ef4444').text('Error: ' + res.data.message);
                        btn.prop('disabled', false).text('REINTENTAR');
                    }
                },
                error: function(xhr, status, error) {
                    status.css('color', '#ef4444').text('Error de conexion: ' + error);
                    btn.prop('disabled', false).text('REINTENTAR');
                }
            });
        });
    });
    </script>
    <?php
}
