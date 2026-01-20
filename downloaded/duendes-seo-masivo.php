<?php
/**
 * Plugin Name: Duendes - SEO Masivo
 * Description: Generación automática de SEO y tags para todos los productos
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════
// MENÚ DE ADMINISTRACIÓN
// ═══════════════════════════════════════════════════════════════

add_action('admin_menu', function() {
    add_submenu_page(
        'edit.php?post_type=product',
        'SEO Masivo',
        '🚀 SEO Masivo',
        'manage_woocommerce',
        'duendes-seo-masivo',
        'duendes_seo_masivo_page'
    );
});

// ═══════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════════

function duendes_seo_masivo_page() {
    ?>
    <div class="wrap duendes-seo-masivo">
        <h1>🚀 SEO Masivo - Duendes del Uruguay</h1>
        <p class="description">Generá SEO y tags automáticamente para todos tus productos con IA.</p>

        <div class="dsm-stats-bar">
            <div class="dsm-stat">
                <span class="dsm-stat-number" id="dsm-total">-</span>
                <span class="dsm-stat-label">Total productos</span>
            </div>
            <div class="dsm-stat">
                <span class="dsm-stat-number" id="dsm-sin-seo">-</span>
                <span class="dsm-stat-label">Sin SEO</span>
            </div>
            <div class="dsm-stat">
                <span class="dsm-stat-number" id="dsm-sin-tags">-</span>
                <span class="dsm-stat-label">Sin Tags</span>
            </div>
            <div class="dsm-stat">
                <span class="dsm-stat-number" id="dsm-completos">-</span>
                <span class="dsm-stat-label">Completos</span>
            </div>
        </div>

        <div class="dsm-actions-bar">
            <div class="dsm-filter-group">
                <label>Filtrar:</label>
                <select id="dsm-filtro">
                    <option value="todos">Todos los productos</option>
                    <option value="sin-seo">Sin SEO</option>
                    <option value="sin-tags">Sin Tags</option>
                    <option value="incompletos">Incompletos</option>
                    <option value="completos">Completos</option>
                </select>
            </div>

            <div class="dsm-bulk-actions">
                <button type="button" class="button" id="dsm-select-all">Seleccionar todos</button>
                <button type="button" class="button" id="dsm-deselect-all">Deseleccionar</button>
                <span class="dsm-selected-count"><span id="dsm-count">0</span> seleccionados</span>
            </div>

            <div class="dsm-generate-actions">
                <button type="button" class="button button-primary button-hero" id="dsm-generar">
                    🤖 Generar SEO + Tags
                </button>
            </div>
        </div>

        <!-- Progreso -->
        <div class="dsm-progress-container" id="dsm-progress" style="display: none;">
            <div class="dsm-progress-header">
                <h3>⏳ Procesando productos...</h3>
                <button type="button" class="button" id="dsm-cancelar">Cancelar</button>
            </div>
            <div class="dsm-progress-bar">
                <div class="dsm-progress-fill" id="dsm-progress-fill"></div>
            </div>
            <div class="dsm-progress-text">
                <span id="dsm-progress-current">0</span> / <span id="dsm-progress-total">0</span> productos
            </div>
            <div class="dsm-progress-log" id="dsm-log"></div>
        </div>

        <!-- Tabla de productos -->
        <table class="wp-list-table widefat fixed striped" id="dsm-tabla">
            <thead>
                <tr>
                    <th class="check-column"><input type="checkbox" id="dsm-check-all"></th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>SEO Title</th>
                    <th>Focus Keyword</th>
                    <th>Tags</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="dsm-productos">
                <tr><td colspan="8" style="text-align: center; padding: 40px;">Cargando productos...</td></tr>
            </tbody>
        </table>
    </div>

    <style>
    .duendes-seo-masivo {
        max-width: 1400px;
    }

    .dsm-stats-bar {
        display: flex;
        gap: 20px;
        margin: 20px 0;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
    }

    .dsm-stat {
        flex: 1;
        text-align: center;
        color: #fff;
    }

    .dsm-stat-number {
        display: block;
        font-size: 32px;
        font-weight: 700;
    }

    .dsm-stat-label {
        font-size: 12px;
        opacity: 0.9;
        text-transform: uppercase;
    }

    .dsm-actions-bar {
        display: flex;
        align-items: center;
        gap: 20px;
        margin: 20px 0;
        padding: 15px 20px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        flex-wrap: wrap;
    }

    .dsm-filter-group {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .dsm-filter-group select {
        min-width: 180px;
    }

    .dsm-bulk-actions {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .dsm-selected-count {
        background: #f0f0f0;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 13px;
    }

    .dsm-generate-actions {
        margin-left: auto;
    }

    .button-hero {
        padding: 10px 30px !important;
        height: auto !important;
        font-size: 15px !important;
    }

    .dsm-progress-container {
        background: #fff;
        border: 2px solid #667eea;
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
    }

    .dsm-progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }

    .dsm-progress-header h3 {
        margin: 0;
        color: #667eea;
    }

    .dsm-progress-bar {
        height: 24px;
        background: #e0e0e0;
        border-radius: 12px;
        overflow: hidden;
    }

    .dsm-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        width: 0%;
        transition: width 0.3s;
        border-radius: 12px;
    }

    .dsm-progress-text {
        text-align: center;
        margin-top: 10px;
        font-weight: 600;
        color: #333;
    }

    .dsm-progress-log {
        margin-top: 15px;
        max-height: 200px;
        overflow-y: auto;
        background: #f5f5f5;
        padding: 10px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
    }

    .dsm-log-item {
        padding: 4px 0;
        border-bottom: 1px solid #e0e0e0;
    }

    .dsm-log-item.success { color: #22c55e; }
    .dsm-log-item.error { color: #ef4444; }
    .dsm-log-item.info { color: #3b82f6; }

    #dsm-tabla {
        margin-top: 20px;
    }

    #dsm-tabla th, #dsm-tabla td {
        vertical-align: middle;
    }

    .dsm-status {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
    }

    .dsm-status.completo {
        background: #dcfce7;
        color: #166534;
    }

    .dsm-status.parcial {
        background: #fef3c7;
        color: #92400e;
    }

    .dsm-status.vacio {
        background: #fee2e2;
        color: #991b1b;
    }

    .dsm-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }

    .dsm-tag {
        background: #e0e7ff;
        color: #3730a3;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 10px;
    }

    .dsm-tag.empty {
        background: #f3f4f6;
        color: #9ca3af;
    }

    .dsm-cell-truncate {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .dsm-btn-mini {
        padding: 4px 10px !important;
        font-size: 11px !important;
    }
    </style>

    <script>
    jQuery(document).ready(function($) {
        var productos = [];
        var procesando = false;
        var cancelado = false;
        var API_URL = 'https://duendes-vercel.vercel.app/api/admin/canalizar-producto';

        // Cargar productos
        function cargarProductos() {
            $.post(ajaxurl, {
                action: 'dsm_listar_productos'
            }, function(response) {
                if (response.success) {
                    productos = response.data.productos;
                    actualizarStats(response.data.stats);
                    renderTabla();
                }
            });
        }

        // Actualizar estadísticas
        function actualizarStats(stats) {
            $('#dsm-total').text(stats.total);
            $('#dsm-sin-seo').text(stats.sin_seo);
            $('#dsm-sin-tags').text(stats.sin_tags);
            $('#dsm-completos').text(stats.completos);
        }

        // Renderizar tabla
        function renderTabla() {
            var filtro = $('#dsm-filtro').val();
            var html = '';

            productos.forEach(function(p) {
                // Aplicar filtro
                if (filtro === 'sin-seo' && p.tiene_seo) return;
                if (filtro === 'sin-tags' && p.tiene_tags) return;
                if (filtro === 'incompletos' && p.tiene_seo && p.tiene_tags) return;
                if (filtro === 'completos' && (!p.tiene_seo || !p.tiene_tags)) return;

                var estado = '';
                if (p.tiene_seo && p.tiene_tags) {
                    estado = '<span class="dsm-status completo">✓ Completo</span>';
                } else if (p.tiene_seo || p.tiene_tags) {
                    estado = '<span class="dsm-status parcial">◐ Parcial</span>';
                } else {
                    estado = '<span class="dsm-status vacio">○ Vacío</span>';
                }

                var tags = '';
                if (p.tags && p.tags.length > 0) {
                    tags = p.tags.slice(0, 3).map(function(t) {
                        return '<span class="dsm-tag">' + t + '</span>';
                    }).join('');
                    if (p.tags.length > 3) {
                        tags += '<span class="dsm-tag">+' + (p.tags.length - 3) + '</span>';
                    }
                } else {
                    tags = '<span class="dsm-tag empty">Sin tags</span>';
                }

                html += '<tr data-id="' + p.id + '">' +
                    '<td><input type="checkbox" class="dsm-check" value="' + p.id + '"></td>' +
                    '<td><strong>' + p.nombre + '</strong></td>' +
                    '<td>' + (p.categoria || '-') + '</td>' +
                    '<td class="dsm-cell-truncate" title="' + (p.seo_title || '') + '">' + (p.seo_title || '<em style="color:#999">-</em>') + '</td>' +
                    '<td>' + (p.focus_keyword || '<em style="color:#999">-</em>') + '</td>' +
                    '<td><div class="dsm-tags">' + tags + '</div></td>' +
                    '<td>' + estado + '</td>' +
                    '<td><button type="button" class="button dsm-btn-mini dsm-generar-uno" data-id="' + p.id + '">Generar</button></td>' +
                    '</tr>';
            });

            if (!html) {
                html = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No hay productos que coincidan con el filtro</td></tr>';
            }

            $('#dsm-productos').html(html);
            actualizarContador();
        }

        // Actualizar contador de seleccionados
        function actualizarContador() {
            var count = $('.dsm-check:checked').length;
            $('#dsm-count').text(count);
        }

        // Eventos
        $('#dsm-filtro').on('change', renderTabla);

        $('#dsm-check-all').on('change', function() {
            $('.dsm-check').prop('checked', this.checked);
            actualizarContador();
        });

        $(document).on('change', '.dsm-check', actualizarContador);

        $('#dsm-select-all').on('click', function() {
            $('.dsm-check').prop('checked', true);
            $('#dsm-check-all').prop('checked', true);
            actualizarContador();
        });

        $('#dsm-deselect-all').on('click', function() {
            $('.dsm-check').prop('checked', false);
            $('#dsm-check-all').prop('checked', false);
            actualizarContador();
        });

        // Generar uno solo
        $(document).on('click', '.dsm-generar-uno', function() {
            var id = $(this).data('id');
            var ids = [id];
            iniciarProceso(ids);
        });

        // Generar seleccionados
        $('#dsm-generar').on('click', function() {
            var ids = [];
            $('.dsm-check:checked').each(function() {
                ids.push($(this).val());
            });

            if (ids.length === 0) {
                alert('Seleccioná al menos un producto');
                return;
            }

            if (!confirm('¿Generar SEO y tags para ' + ids.length + ' producto(s)?\n\nEsto puede tardar varios minutos.')) {
                return;
            }

            iniciarProceso(ids);
        });

        // Cancelar
        $('#dsm-cancelar').on('click', function() {
            cancelado = true;
            $(this).text('Cancelando...');
        });

        // Proceso de generación
        function iniciarProceso(ids) {
            procesando = true;
            cancelado = false;

            $('#dsm-progress').show();
            $('#dsm-progress-total').text(ids.length);
            $('#dsm-progress-current').text(0);
            $('#dsm-progress-fill').css('width', '0%');
            $('#dsm-log').html('');
            $('#dsm-cancelar').text('Cancelar').prop('disabled', false);

            procesarSiguiente(ids, 0);
        }

        function procesarSiguiente(ids, index) {
            if (cancelado || index >= ids.length) {
                finalizarProceso(cancelado ? 'Cancelado' : 'Completado');
                return;
            }

            var id = ids[index];
            var producto = productos.find(function(p) { return p.id == id; });
            var nombre = producto ? producto.nombre : 'Producto #' + id;

            addLog('info', '⏳ Procesando: ' + nombre + '...');

            // Obtener datos del producto para la API
            $.post(ajaxurl, {
                action: 'dsm_obtener_datos_producto',
                product_id: id
            }, function(response) {
                if (!response.success) {
                    addLog('error', '❌ Error obteniendo datos de ' + nombre);
                    avanzar(ids, index);
                    return;
                }

                var datos = response.data;
                datos.action = 'generate';

                // Llamar a la API de Vercel
                $.ajax({
                    url: API_URL,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(datos),
                    timeout: 120000,
                    success: function(result) {
                        if (result.success) {
                            // Guardar SEO y tags
                            guardarResultado(id, result, function(saved) {
                                if (saved) {
                                    addLog('success', '✅ ' + nombre + ' - SEO y tags guardados');
                                    // Actualizar datos locales
                                    if (producto) {
                                        producto.seo_title = result.seo_title;
                                        producto.focus_keyword = result.focus_keyword;
                                        producto.tiene_seo = true;
                                        producto.tiene_tags = true;
                                        if (result.tags) {
                                            producto.tags = result.tags.split(',').map(function(t) { return t.trim(); });
                                        }
                                    }
                                } else {
                                    addLog('error', '❌ ' + nombre + ' - Error al guardar');
                                }
                                avanzar(ids, index);
                            });
                        } else {
                            addLog('error', '❌ ' + nombre + ' - ' + (result.error || 'Error de API'));
                            avanzar(ids, index);
                        }
                    },
                    error: function(xhr, status, error) {
                        addLog('error', '❌ ' + nombre + ' - Error: ' + error);
                        avanzar(ids, index);
                    }
                });
            });
        }

        function guardarResultado(productId, result, callback) {
            $.post(ajaxurl, {
                action: 'dsm_guardar_seo_tags',
                product_id: productId,
                seo_title: result.seo_title || '',
                seo_description: result.seo_description || '',
                focus_keyword: result.focus_keyword || '',
                tags: result.tags || '',
                titulo: result.titulo || '',
                descripcion: result.descripcion || '',
                descripcion_corta: result.descripcion_corta || ''
            }, function(response) {
                callback(response.success);
            });
        }

        function avanzar(ids, index) {
            var newIndex = index + 1;
            var percent = Math.round((newIndex / ids.length) * 100);

            $('#dsm-progress-current').text(newIndex);
            $('#dsm-progress-fill').css('width', percent + '%');

            // Pequeña pausa para no saturar
            setTimeout(function() {
                procesarSiguiente(ids, newIndex);
            }, 1000);
        }

        function finalizarProceso(estado) {
            procesando = false;
            addLog('info', '🏁 Proceso ' + estado.toLowerCase());
            $('#dsm-cancelar').text('Cerrar').prop('disabled', false).off('click').on('click', function() {
                $('#dsm-progress').hide();
                cargarProductos(); // Recargar datos
            });

            // Actualizar tabla
            renderTabla();

            // Recargar stats
            $.post(ajaxurl, {
                action: 'dsm_listar_productos'
            }, function(response) {
                if (response.success) {
                    productos = response.data.productos;
                    actualizarStats(response.data.stats);
                    renderTabla();
                }
            });
        }

        function addLog(type, message) {
            var time = new Date().toLocaleTimeString();
            $('#dsm-log').append('<div class="dsm-log-item ' + type + '">[' + time + '] ' + message + '</div>');
            $('#dsm-log').scrollTop($('#dsm-log')[0].scrollHeight);
        }

        // Iniciar
        cargarProductos();
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════
// AJAX: LISTAR PRODUCTOS
// ═══════════════════════════════════════════════════════════════

add_action('wp_ajax_dsm_listar_productos', function() {
    $args = [
        'post_type' => 'product',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'title',
        'order' => 'ASC'
    ];

    $products = get_posts($args);
    $lista = [];
    $stats = [
        'total' => 0,
        'sin_seo' => 0,
        'sin_tags' => 0,
        'completos' => 0
    ];

    foreach ($products as $product) {
        $seo_title = get_post_meta($product->ID, 'rank_math_title', true);
        $focus_keyword = get_post_meta($product->ID, 'rank_math_focus_keyword', true);
        $tags = wp_get_post_terms($product->ID, 'product_tag', ['fields' => 'names']);
        $cats = wp_get_post_terms($product->ID, 'product_cat', ['fields' => 'names']);

        $tiene_seo = !empty($seo_title) || !empty($focus_keyword);
        $tiene_tags = !empty($tags);

        $lista[] = [
            'id' => $product->ID,
            'nombre' => $product->post_title,
            'categoria' => !empty($cats) ? $cats[0] : '',
            'seo_title' => $seo_title,
            'focus_keyword' => $focus_keyword,
            'tags' => $tags,
            'tiene_seo' => $tiene_seo,
            'tiene_tags' => $tiene_tags
        ];

        $stats['total']++;
        if (!$tiene_seo) $stats['sin_seo']++;
        if (!$tiene_tags) $stats['sin_tags']++;
        if ($tiene_seo && $tiene_tags) $stats['completos']++;
    }

    wp_send_json_success([
        'productos' => $lista,
        'stats' => $stats
    ]);
});

// ═══════════════════════════════════════════════════════════════
// AJAX: OBTENER DATOS DE PRODUCTO PARA API
// ═══════════════════════════════════════════════════════════════

add_action('wp_ajax_dsm_obtener_datos_producto', function() {
    $product_id = intval($_POST['product_id']);
    if (!$product_id) {
        wp_send_json_error('ID inválido');
        return;
    }

    $product = wc_get_product($product_id);
    if (!$product) {
        wp_send_json_error('Producto no encontrado');
        return;
    }

    // Obtener metadatos del plugin de canalización
    $data = [
        'product_id' => $product_id,
        'categoria' => get_post_meta($product_id, '_dc_categoria', true) ?: 'duende',
        'tipo_ser' => get_post_meta($product_id, '_dc_tipo_ser', true) ?: 'duende',
        'genero' => get_post_meta($product_id, '_dc_genero', true) ?: 'neutro',
        'tamano' => get_post_meta($product_id, '_dc_tamano', true) ?: 'mediano',
        'edicion' => get_post_meta($product_id, '_dc_edicion', true) ?: 'especial',
        'proposito' => get_post_meta($product_id, '_dc_proposito', true) ?: 'proteccion',
        'elemento' => get_post_meta($product_id, '_dc_elemento', true) ?: 'tierra',
        'cristales' => get_post_meta($product_id, '_dc_cristales', true) ?: '',
        'nombre' => $product->get_name(),
        'notas' => get_post_meta($product_id, '_dc_notas', true) ?: ''
    ];

    wp_send_json_success($data);
});

// ═══════════════════════════════════════════════════════════════
// AJAX: GUARDAR SEO Y TAGS
// ═══════════════════════════════════════════════════════════════

add_action('wp_ajax_dsm_guardar_seo_tags', function() {
    $product_id = intval($_POST['product_id']);
    if (!$product_id) {
        wp_send_json_error('ID inválido');
        return;
    }

    // Guardar SEO de Rank Math
    $seo_title = sanitize_text_field($_POST['seo_title']);
    $seo_description = sanitize_text_field($_POST['seo_description']);
    $focus_keyword = sanitize_text_field($_POST['focus_keyword']);

    if ($seo_title) {
        update_post_meta($product_id, 'rank_math_title', $seo_title);
    }
    if ($seo_description) {
        update_post_meta($product_id, 'rank_math_description', $seo_description);
    }
    if ($focus_keyword) {
        update_post_meta($product_id, 'rank_math_focus_keyword', $focus_keyword);
    }

    // Guardar tags
    $tags_string = sanitize_text_field($_POST['tags']);
    if ($tags_string) {
        $tags_array = array_map('trim', explode(',', $tags_string));
        $tags_array = array_filter($tags_array);
        if (!empty($tags_array)) {
            wp_set_object_terms($product_id, $tags_array, 'product_tag', false);
        }
    }

    // Opcionalmente actualizar título y descripción del producto
    $titulo = sanitize_text_field($_POST['titulo']);
    $descripcion = wp_kses_post($_POST['descripcion']);
    $descripcion_corta = wp_kses_post($_POST['descripcion_corta']);

    $update_data = ['ID' => $product_id];

    // Solo actualizar si están vacíos actualmente
    $current_post = get_post($product_id);

    if ($titulo && empty($current_post->post_title)) {
        $update_data['post_title'] = $titulo;
    }
    if ($descripcion && empty($current_post->post_content)) {
        $update_data['post_content'] = $descripcion;
    }
    if ($descripcion_corta && empty($current_post->post_excerpt)) {
        $update_data['post_excerpt'] = $descripcion_corta;
    }

    if (count($update_data) > 1) {
        wp_update_post($update_data);
    }

    error_log("DSM: SEO guardado para producto $product_id - Title: $seo_title, FK: $focus_keyword");

    wp_send_json_success([
        'message' => 'Guardado correctamente',
        'product_id' => $product_id
    ]);
});
