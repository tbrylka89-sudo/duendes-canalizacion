<?php
/**
 * Plugin Name: Duendes - SEO Masivo v3
 * Description: Genera SEO perfecto (100/100 Rank Math) - Con reintentos y mejor manejo de errores
 * Version: 3.0
 */

if (!defined('ABSPATH')) exit;

add_action('admin_menu', function() {
    add_submenu_page(
        'edit.php?post_type=product',
        'SEO Masivo',
        '🚀 SEO Masivo',
        'manage_woocommerce',
        'duendes-seo-masivo',
        'duendes_seo_masivo_page_v3'
    );
});

function duendes_seo_masivo_page_v3() {
    ?>
    <div class="wrap duendes-seo">
        <h1>🚀 SEO Masivo v3 - Rank Math 100/100</h1>
        <p>Genera SEO perfecto para tus productos. Con reintentos automáticos y mejor manejo de errores.</p>

        <div class="dsm-stats">
            <div class="dsm-stat"><span id="stat-total">-</span><small>Total</small></div>
            <div class="dsm-stat"><span id="stat-sin-seo">-</span><small>Sin SEO</small></div>
            <div class="dsm-stat"><span id="stat-bajo">-</span><small>SEO &lt;80</small></div>
            <div class="dsm-stat ok"><span id="stat-ok">-</span><small>SEO 80+</small></div>
        </div>

        <div class="dsm-actions">
            <select id="filtro">
                <option value="todos">Todos</option>
                <option value="sin-seo">Sin SEO</option>
                <option value="bajo">SEO bajo (&lt;80)</option>
            </select>
            <button class="button" id="btn-select-all">Seleccionar filtrados</button>
            <span class="dsm-count"><span id="count">0</span> seleccionados</span>
            <button class="button button-primary button-hero" id="btn-generar">🤖 Generar SEO Perfecto</button>
        </div>

        <div class="dsm-progress" id="progress" style="display:none;">
            <h3 id="progress-title">⏳ Generando SEO...</h3>
            <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
            <p>
                <span id="progress-current">0</span> / <span id="progress-total">0</span>
                <span id="progress-status" style="margin-left: 15px; color: #666;"></span>
            </p>
            <div class="progress-stats">
                <span class="stat-ok">✅ <span id="stat-exitos">0</span></span>
                <span class="stat-err">❌ <span id="stat-errores">0</span></span>
                <span class="stat-retry">🔄 <span id="stat-reintentos">0</span> reintentos</span>
            </div>
            <div class="progress-log" id="log"></div>
            <div class="progress-buttons">
                <button class="button" id="btn-pausar">⏸️ Pausar</button>
                <button class="button" id="btn-cancelar">❌ Cancelar</button>
                <button class="button button-primary" id="btn-continuar" style="display:none;">▶️ Continuar</button>
            </div>
        </div>

        <table class="wp-list-table widefat fixed striped" id="tabla">
            <thead>
                <tr>
                    <th width="30"><input type="checkbox" id="check-all"></th>
                    <th>Producto</th>
                    <th>Focus Keyword</th>
                    <th>SEO Title</th>
                    <th width="80">Palabras</th>
                    <th width="80">Score</th>
                    <th width="100">Acción</th>
                </tr>
            </thead>
            <tbody id="tbody"></tbody>
        </table>
    </div>

    <style>
    .duendes-seo { max-width: 1400px; }
    .dsm-stats { display: flex; gap: 15px; margin: 20px 0; }
    .dsm-stat { flex: 1; background: #667eea; color: #fff; padding: 20px; border-radius: 10px; text-align: center; }
    .dsm-stat.ok { background: #22c55e; }
    .dsm-stat span { display: block; font-size: 28px; font-weight: 700; }
    .dsm-stat small { opacity: 0.9; }
    .dsm-actions { display: flex; gap: 15px; align-items: center; margin: 20px 0; padding: 15px; background: #fff; border-radius: 8px; flex-wrap: wrap; }
    .dsm-count { background: #f0f0f0; padding: 5px 15px; border-radius: 20px; }
    .button-hero { padding: 10px 25px !important; height: auto !important; margin-left: auto !important; }
    .dsm-progress { background: #fff; border: 2px solid #667eea; border-radius: 10px; padding: 20px; margin: 20px 0; }
    .progress-bar { height: 24px; background: #e0e0e0; border-radius: 12px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); width: 0%; transition: width 0.3s; }
    .progress-stats { display: flex; gap: 20px; margin: 15px 0; font-size: 14px; }
    .progress-stats .stat-ok { color: #22c55e; }
    .progress-stats .stat-err { color: #ef4444; }
    .progress-stats .stat-retry { color: #f59e0b; }
    .progress-log { max-height: 200px; overflow-y: auto; background: #f5f5f5; padding: 10px; margin: 15px 0; border-radius: 5px; font-family: monospace; font-size: 12px; }
    .progress-buttons { display: flex; gap: 10px; }
    .log-ok { color: #22c55e; }
    .log-err { color: #ef4444; }
    .log-warn { color: #f59e0b; }
    .log-info { color: #3b82f6; }
    .score-badge { padding: 3px 10px; border-radius: 20px; font-weight: 600; font-size: 12px; }
    .score-high { background: #dcfce7; color: #166534; }
    .score-mid { background: #fef3c7; color: #92400e; }
    .score-low { background: #fee2e2; color: #991b1b; }
    .truncate { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    </style>

    <script>
    jQuery(document).ready(function($) {
        var productos = [];
        var cancelado = false;
        var pausado = false;
        var procesandoIds = [];
        var indiceActual = 0;
        var exitos = 0;
        var errores = 0;
        var reintentos = 0;
        var API_URL = 'https://duendes-vercel.vercel.app/api/admin/seo-perfecto';
        var MAX_REINTENTOS = 3;
        var DELAY_ENTRE_PRODUCTOS = 2000;
        var DELAY_REINTENTO = 3000;

        function cargar() {
            $.post(ajaxurl, { action: 'dsm3_listar' }, function(r) {
                if (r.success) {
                    productos = r.data.productos;
                    $('#stat-total').text(r.data.stats.total);
                    $('#stat-sin-seo').text(r.data.stats.sin_seo);
                    $('#stat-bajo').text(r.data.stats.bajo);
                    $('#stat-ok').text(r.data.stats.ok);
                    render();
                }
            });
        }

        function render() {
            var f = $('#filtro').val();
            var html = '';
            productos.forEach(function(p) {
                if (f === 'sin-seo' && p.tiene_seo) return;
                if (f === 'bajo' && p.score >= 80) return;

                var scoreBadge = '';
                if (p.score >= 80) scoreBadge = '<span class="score-badge score-high">' + p.score + '</span>';
                else if (p.score >= 50) scoreBadge = '<span class="score-badge score-mid">' + p.score + '</span>';
                else scoreBadge = '<span class="score-badge score-low">' + (p.score || '?') + '</span>';

                html += '<tr data-id="' + p.id + '">' +
                    '<td><input type="checkbox" class="chk" value="' + p.id + '"></td>' +
                    '<td><strong>' + p.nombre + '</strong></td>' +
                    '<td>' + (p.focus_keyword || '<em style="color:#999">-</em>') + '</td>' +
                    '<td class="truncate">' + (p.seo_title || '<em style="color:#999">-</em>') + '</td>' +
                    '<td>' + (p.palabras || '?') + '</td>' +
                    '<td>' + scoreBadge + '</td>' +
                    '<td><button class="button btn-uno" data-id="' + p.id + '">Generar</button></td>' +
                    '</tr>';
            });
            $('#tbody').html(html || '<tr><td colspan="7" style="text-align:center;padding:30px;">Sin resultados</td></tr>');
            updateCount();
        }

        function updateCount() {
            $('#count').text($('.chk:checked').length);
        }

        $('#filtro').on('change', render);
        $('#check-all').on('change', function() { $('.chk').prop('checked', this.checked); updateCount(); });
        $(document).on('change', '.chk', updateCount);
        $('#btn-select-all').on('click', function() {
            $('.chk:visible').prop('checked', true);
            $('#check-all').prop('checked', true);
            updateCount();
        });

        $(document).on('click', '.btn-uno', function() {
            iniciarProceso([$(this).data('id')]);
        });

        $('#btn-generar').on('click', function() {
            var ids = $('.chk:checked').map(function() { return parseInt($(this).val()); }).get();
            if (!ids.length) { alert('Seleccioná productos'); return; }
            if (!confirm('Generar SEO para ' + ids.length + ' productos?\n\nTiempo estimado: ' + Math.ceil(ids.length * 20 / 60) + ' minutos')) return;
            iniciarProceso(ids);
        });

        $('#btn-cancelar').on('click', function() {
            cancelado = true;
            pausado = false;
            $('#progress-title').text('❌ Cancelado');
            $('#progress-status').text('');
        });

        $('#btn-pausar').on('click', function() {
            pausado = true;
            $(this).hide();
            $('#btn-continuar').show();
            $('#progress-title').text('⏸️ Pausado');
            $('#progress-status').text('Hacé clic en Continuar para seguir');
        });

        $('#btn-continuar').on('click', function() {
            pausado = false;
            $(this).hide();
            $('#btn-pausar').show();
            $('#progress-title').text('⏳ Generando SEO...');
            siguiente();
        });

        function iniciarProceso(ids) {
            cancelado = false;
            pausado = false;
            procesandoIds = ids;
            indiceActual = 0;
            exitos = 0;
            errores = 0;
            reintentos = 0;

            $('#progress').show();
            $('#progress-title').text('⏳ Generando SEO...');
            $('#progress-total').text(ids.length);
            $('#progress-current').text(0);
            $('#progress-fill').css('width', '0%');
            $('#progress-status').text('Iniciando...');
            $('#stat-exitos').text(0);
            $('#stat-errores').text(0);
            $('#stat-reintentos').text(0);
            $('#log').html('');
            $('#btn-pausar').show();
            $('#btn-continuar').hide();

            log('🚀 Iniciando proceso para ' + ids.length + ' productos...', 'info');
            siguiente();
        }

        function siguiente() {
            if (cancelado) {
                finalizar();
                return;
            }

            if (pausado) {
                return; // Se reanuda con btn-continuar
            }

            if (indiceActual >= procesandoIds.length) {
                finalizar();
                return;
            }

            var id = procesandoIds[indiceActual];
            var p = productos.find(function(x) { return x.id == id; });
            var nombre = p ? p.nombre : '#' + id;

            $('#progress-status').text('Procesando: ' + nombre);
            log('⏳ ' + nombre + '...', '');

            procesarProducto(id, nombre, 1);
        }

        function procesarProducto(id, nombre, intento) {
            if (cancelado) {
                siguiente();
                return;
            }

            // Obtener datos del producto
            $.ajax({
                url: ajaxurl,
                method: 'POST',
                data: { action: 'dsm3_datos', product_id: id },
                timeout: 30000,
                success: function(r) {
                    if (!r.success) {
                        manejarError(id, nombre, intento, 'Error obteniendo datos');
                        return;
                    }

                    // Llamar API de SEO
                    $.ajax({
                        url: API_URL,
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(r.data),
                        timeout: 90000,
                        success: function(res) {
                            if (res.success && res.seo) {
                                guardarSEO(id, nombre, res);
                            } else {
                                manejarError(id, nombre, intento, res.error || 'Respuesta inválida');
                            }
                        },
                        error: function(xhr, status, error) {
                            var msg = status === 'timeout' ? 'Timeout (API lenta)' : 'Error de red: ' + (error || status);
                            manejarError(id, nombre, intento, msg);
                        }
                    });
                },
                error: function(xhr, status, error) {
                    manejarError(id, nombre, intento, 'Error AJAX: ' + (error || status));
                }
            });
        }

        function guardarSEO(id, nombre, res) {
            $.ajax({
                url: ajaxurl,
                method: 'POST',
                data: {
                    action: 'dsm3_guardar',
                    product_id: id,
                    focus_keyword: res.seo.focus_keyword,
                    seo_title: res.seo.seo_title,
                    seo_description: res.seo.seo_description,
                    intro_seo: res.seo.intro_seo,
                    faqs_html: res.seo.faqs_html,
                    tags: res.seo.tags
                },
                timeout: 30000,
                success: function(sr) {
                    if (sr.success) {
                        exitos++;
                        $('#stat-exitos').text(exitos);
                        log('✅ ' + nombre + ' — ' + res.stats.total_words + ' palabras', 'ok');

                        // Actualizar datos locales
                        var p = productos.find(function(x) { return x.id == id; });
                        if (p) {
                            p.focus_keyword = res.seo.focus_keyword;
                            p.seo_title = res.seo.seo_title;
                            p.tiene_seo = true;
                            p.palabras = res.stats.total_words;
                            p.score = res.stats.total_words >= 600 ? 90 : 70;
                        }
                    } else {
                        errores++;
                        $('#stat-errores').text(errores);
                        log('❌ ' + nombre + ': Error al guardar', 'err');
                    }
                    avanzar();
                },
                error: function() {
                    errores++;
                    $('#stat-errores').text(errores);
                    log('❌ ' + nombre + ': Error conexión al guardar', 'err');
                    avanzar();
                }
            });
        }

        function manejarError(id, nombre, intento, mensaje) {
            if (intento < MAX_REINTENTOS) {
                reintentos++;
                $('#stat-reintentos').text(reintentos);
                log('🔄 ' + nombre + ': ' + mensaje + ' — Reintento ' + (intento + 1) + '/' + MAX_REINTENTOS, 'warn');

                setTimeout(function() {
                    procesarProducto(id, nombre, intento + 1);
                }, DELAY_REINTENTO);
            } else {
                errores++;
                $('#stat-errores').text(errores);
                log('❌ ' + nombre + ': ' + mensaje + ' — Sin más reintentos', 'err');
                avanzar();
            }
        }

        function avanzar() {
            indiceActual++;
            var total = procesandoIds.length;
            $('#progress-current').text(indiceActual);
            $('#progress-fill').css('width', (indiceActual / total * 100) + '%');

            if (indiceActual < total) {
                setTimeout(siguiente, DELAY_ENTRE_PRODUCTOS);
            } else {
                finalizar();
            }
        }

        function finalizar() {
            var mensaje = cancelado ? '❌ Cancelado' : '✅ Completado';
            $('#progress-title').text(mensaje);
            $('#progress-status').text(exitos + ' exitosos, ' + errores + ' errores');
            $('#btn-pausar').hide();
            $('#btn-continuar').hide();

            log('', '');
            log('═══════════════════════════════════', '');
            log(mensaje + ': ' + exitos + ' exitosos, ' + errores + ' errores, ' + reintentos + ' reintentos', exitos > errores ? 'ok' : 'err');

            cargar(); // Recargar lista
        }

        function log(msg, type) {
            if (!msg) {
                $('#log').append('<div>&nbsp;</div>');
            } else {
                var cls = type ? 'log-' + type : '';
                $('#log').append('<div class="' + cls + '">' + msg + '</div>');
            }
            $('#log').scrollTop($('#log')[0].scrollHeight);
        }

        cargar();
    });
    </script>
    <?php
}

// AJAX: Listar productos
add_action('wp_ajax_dsm3_listar', function() {
    $products = get_posts([
        'post_type' => 'product',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'title',
        'order' => 'ASC'
    ]);

    $lista = [];
    $stats = ['total' => 0, 'sin_seo' => 0, 'bajo' => 0, 'ok' => 0];

    foreach ($products as $p) {
        $seo_title = get_post_meta($p->ID, 'rank_math_title', true);
        $focus_kw = get_post_meta($p->ID, 'rank_math_focus_keyword', true);
        $content = $p->post_content;
        $palabras = str_word_count(strip_tags($content));

        // Estimar score basado en contenido
        $score = 0;
        if ($seo_title) $score += 20;
        if ($focus_kw) $score += 20;
        if ($focus_kw && stripos($content, $focus_kw) !== false) $score += 20;
        if ($palabras >= 600) $score += 30;
        elseif ($palabras >= 300) $score += 15;
        if ($focus_kw && $seo_title && stripos($seo_title, $focus_kw) !== false) $score += 10;

        $tiene_seo = !empty($seo_title) && !empty($focus_kw);

        $lista[] = [
            'id' => $p->ID,
            'nombre' => $p->post_title,
            'seo_title' => $seo_title,
            'focus_keyword' => $focus_kw,
            'palabras' => $palabras,
            'score' => $score,
            'tiene_seo' => $tiene_seo
        ];

        $stats['total']++;
        if (!$tiene_seo) $stats['sin_seo']++;
        if ($score < 80) $stats['bajo']++;
        else $stats['ok']++;
    }

    wp_send_json_success(['productos' => $lista, 'stats' => $stats]);
});

// AJAX: Obtener datos de producto
add_action('wp_ajax_dsm3_datos', function() {
    $id = intval($_POST['product_id']);
    $product = wc_get_product($id);
    if (!$product) { wp_send_json_error('No encontrado'); return; }

    $cats = wp_get_post_terms($id, 'product_cat', ['fields' => 'names']);

    wp_send_json_success([
        'product_id' => $id,
        'nombre' => $product->get_name(),
        'proposito' => !empty($cats) ? $cats[0] : 'protección',
        'tipo' => get_post_meta($id, '_dc_tipo_ser', true) ?: 'guardián',
        'tamano' => get_post_meta($id, '_dc_tamano', true) ?: 'mediano',
        'precio' => $product->get_price(),
        'descripcion' => $product->get_description()
    ]);
});

// AJAX: Guardar SEO
add_action('wp_ajax_dsm3_guardar', function() {
    $id = intval($_POST['product_id']);
    if (!$id) { wp_send_json_error('ID inválido'); return; }

    $focus_kw = sanitize_text_field($_POST['focus_keyword']);
    $seo_title = sanitize_text_field($_POST['seo_title']);
    $seo_desc = sanitize_text_field($_POST['seo_description']);
    $intro = wp_kses_post($_POST['intro_seo']);
    $faqs = wp_kses_post($_POST['faqs_html']);
    $tags = sanitize_text_field($_POST['tags']);

    // Guardar meta de Rank Math
    update_post_meta($id, 'rank_math_focus_keyword', $focus_kw);
    update_post_meta($id, 'rank_math_title', $seo_title);
    update_post_meta($id, 'rank_math_description', $seo_desc);

    // Obtener contenido actual
    $post = get_post($id);
    $contenido_actual = $post->post_content;

    // Limpiar contenido anterior de SEO si existe
    if (strpos($contenido_actual, 'class="seo-intro"') !== false) {
        $contenido_actual = preg_replace('/<div class="seo-intro">.*?<\/div>\s*/s', '', $contenido_actual);
    }
    if (strpos($contenido_actual, 'class="duendes-faqs"') !== false) {
        $contenido_actual = preg_replace('/\s*<div class="duendes-faqs">.*?<\/div>/s', '', $contenido_actual);
    }

    $contenido_actual = trim($contenido_actual);

    // Construir nuevo contenido: INTRO + HISTORIA + FAQs
    $nuevo_contenido = '';

    if ($intro) {
        $nuevo_contenido .= '<div class="seo-intro"><p>' . $intro . '</p></div>' . "\n\n";
    }

    $nuevo_contenido .= $contenido_actual;

    if ($faqs) {
        $nuevo_contenido .= "\n\n" . $faqs;
    }

    // Actualizar post
    $result = wp_update_post([
        'ID' => $id,
        'post_content' => $nuevo_contenido
    ]);

    if (is_wp_error($result)) {
        wp_send_json_error($result->get_error_message());
        return;
    }

    // Guardar tags
    if ($tags) {
        $tags_arr = array_map('trim', explode(',', $tags));
        wp_set_object_terms($id, $tags_arr, 'product_tag', false);
    }

    wp_send_json_success();
});

// Estilos para el front-end de las FAQs
add_action('wp_head', function() {
    if (is_product()) {
        echo '<style>
        .seo-intro { margin-bottom: 25px; font-size: 1.1em; color: #444; line-height: 1.7; }
        .duendes-faqs { margin-top: 40px; padding: 30px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .duendes-faqs h3 { color: #2e7d32; margin-bottom: 25px; font-size: 1.3em; }
        .faq-item { margin-bottom: 20px; padding: 20px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .faq-item:last-child { margin-bottom: 0; }
        .faq-item h4 { color: #333; margin-bottom: 10px; font-size: 1.05em; display: flex; align-items: center; gap: 8px; }
        .faq-item h4 .faq-icon { color: #667eea; }
        .faq-item p { color: #555; margin: 0; font-size: 0.95em; line-height: 1.6; }
        </style>';
    }
});
