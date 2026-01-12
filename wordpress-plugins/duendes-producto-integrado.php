<?php
/**
 * Plugin Name: Duendes Producto Integrado
 * Description: Panel completo en pagina de producto - datos, historia IA, SEO, QR, certificado
 * Version: 2.0
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════
// METABOX PRINCIPAL EN PAGINA DE PRODUCTO
// ═══════════════════════════════════════════════════════════════

add_action('add_meta_boxes', function() {
    add_meta_box(
        'duendes_producto_magico',
        '✨ Datos del Guardián + IA',
        'duendes_metabox_principal',
        'product',
        'normal',
        'high'
    );
}, 5);

// Ocultar metaboxes innecesarios de WooCommerce
add_action('add_meta_boxes', function() {
    remove_meta_box('postexcerpt', 'product', 'normal');
}, 99);

function duendes_metabox_principal($post) {
    wp_nonce_field('duendes_producto_nonce', 'duendes_nonce');

    // Obtener datos guardados
    $tipo_producto = get_post_meta($post->ID, '_duendes_tipo_producto', true) ?: 'guardian';
    $tipo_ser = get_post_meta($post->ID, '_guardian_tipo', true) ?: 'Duende';
    $genero = get_post_meta($post->ID, '_guardian_genero', true) ?: 'masculino';
    $altura_cm = get_post_meta($post->ID, '_guardian_altura', true) ?: '25';
    $color_ojos = get_post_meta($post->ID, '_guardian_ojos', true) ?: '';
    $accesorios = get_post_meta($post->ID, '_guardian_accesorios', true) ?: '';
    $elemento = get_post_meta($post->ID, '_guardian_elemento', true) ?: 'Cualquiera';
    $proposito = get_post_meta($post->ID, '_guardian_proposito', true) ?: '';
    $notas = get_post_meta($post->ID, '_guardian_notas', true) ?: '';

    // Precios
    $product = wc_get_product($post->ID);
    $precio_usd = $product ? $product->get_regular_price() : '';
    $precio_uyu = get_post_meta($post->ID, '_precio_uyu', true) ?: '';

    // SEO
    $seo_titulo = get_post_meta($post->ID, '_duendes_seo_titulo', true) ?: '';
    $seo_descripcion = get_post_meta($post->ID, '_duendes_seo_descripcion', true) ?: '';
    $seo_keywords = get_post_meta($post->ID, '_duendes_seo_keywords', true) ?: '';

    // Historia y certificado
    $historia = get_post_meta($post->ID, '_guardian_historia', true);
    $fecha_generado = get_post_meta($post->ID, '_historia_fecha', true);
    $codigo_guardian = get_post_meta($post->ID, '_codigo_guardian', true);
    if (!$codigo_guardian && $post->ID) {
        $codigo_guardian = 'DU' . str_pad($post->ID, 5, '0', STR_PAD_LEFT);
        update_post_meta($post->ID, '_codigo_guardian', $codigo_guardian);
    }

    ?>
    <style>
        .duendes-box {
            background: #0d1117;
            border-radius: 12px;
            padding: 25px;
            margin: -6px -12px;
        }
        .duendes-section {
            background: #161b22;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid #30363d;
        }
        .duendes-section-title {
            color: #C6A962;
            font-size: 14px;
            font-weight: 600;
            margin: 0 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #30363d;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .duendes-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
        }
        .duendes-row:last-child { margin-bottom: 0; }
        .duendes-field label {
            display: block;
            color: #8b949e;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        .duendes-field input,
        .duendes-field select,
        .duendes-field textarea {
            width: 100%;
            padding: 10px 12px;
            background: #21262d;
            border: 1px solid #30363d;
            border-radius: 6px;
            color: #fff;
            font-size: 14px;
        }
        .duendes-field input:focus,
        .duendes-field select:focus,
        .duendes-field textarea:focus {
            outline: none;
            border-color: #C6A962;
        }
        .duendes-field small {
            display: block;
            color: #6e7681;
            font-size: 11px;
            margin-top: 4px;
        }

        /* Tipo de producto tabs */
        .tipo-producto-tabs {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }
        .tipo-tab {
            padding: 8px 16px;
            background: #21262d;
            border: 1px solid #30363d;
            border-radius: 6px;
            color: #8b949e;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }
        .tipo-tab:hover { border-color: #C6A962; color: #fff; }
        .tipo-tab.active {
            background: rgba(198, 169, 98, 0.15);
            border-color: #C6A962;
            color: #C6A962;
        }
        .tipo-tab input { display: none; }

        /* Precios */
        .precio-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }
        .precio-box {
            background: #21262d;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }
        .precio-box label {
            display: block;
            color: #8b949e;
            font-size: 10px;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        .precio-box input {
            background: transparent;
            border: none;
            color: #C6A962;
            font-size: 22px;
            font-weight: bold;
            text-align: center;
            width: 100%;
        }
        .precio-box input:focus { outline: none; }
        .precio-box .currency {
            color: #C6A962;
            font-size: 22px;
            font-weight: bold;
        }
        .precio-box.calculated {
            background: #1a1f24;
            border: 1px dashed #30363d;
        }

        /* Botones */
        .btn-generar {
            background: linear-gradient(135deg, #C6A962, #a88a42);
            color: #0a0a0a;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .btn-generar:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(198, 169, 98, 0.3);
        }
        .btn-generar:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-secondary {
            background: #21262d;
            color: #8b949e;
            border: 1px solid #30363d;
        }
        .btn-secondary:hover { border-color: #C6A962; color: #fff; }

        /* Status */
        .gen-status {
            margin-top: 15px;
            padding: 12px 15px;
            border-radius: 8px;
            font-size: 13px;
            display: none;
        }
        .gen-status.loading {
            display: block;
            background: rgba(198, 169, 98, 0.1);
            border: 1px solid rgba(198, 169, 98, 0.3);
            color: #C6A962;
        }
        .gen-status.success {
            display: block;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #22c55e;
        }
        .gen-status.error {
            display: block;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #ef4444;
        }

        /* Badge historia */
        .historia-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-bottom: 15px;
        }
        .historia-badge.pending {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }

        /* QR Section */
        .qr-section {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 20px;
            align-items: start;
        }
        .qr-preview {
            background: #fff;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
        }
        .qr-preview img {
            width: 100%;
            max-width: 170px;
        }
        .qr-code-text {
            font-family: monospace;
            font-size: 11px;
            color: #333;
            margin-top: 10px;
            word-break: break-all;
        }
        .qr-info h4 {
            color: #C6A962;
            margin: 0 0 10px 0;
            font-size: 14px;
        }
        .qr-info p {
            color: #8b949e;
            font-size: 13px;
            margin: 0 0 15px 0;
            line-height: 1.5;
        }
        .qr-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        /* Certificado info */
        .cert-info {
            background: #21262d;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
        }
        .cert-info p {
            margin: 0;
            color: #8b949e;
            font-size: 13px;
        }
        .cert-info strong {
            color: #C6A962;
        }
    </style>

    <div class="duendes-box" id="duendes-main-box">

        <!-- TIPO DE PRODUCTO -->
        <div class="duendes-section">
            <h3 class="duendes-section-title">📦 Tipo de Producto</h3>
            <div class="tipo-producto-tabs">
                <label class="tipo-tab <?php echo $tipo_producto === 'guardian' ? 'active' : ''; ?>">
                    <input type="radio" name="_duendes_tipo_producto" value="guardian" <?php checked($tipo_producto, 'guardian'); ?>>
                    🧙 Guardián
                </label>
                <label class="tipo-tab <?php echo $tipo_producto === 'virtual' ? 'active' : ''; ?>">
                    <input type="radio" name="_duendes_tipo_producto" value="virtual" <?php checked($tipo_producto, 'virtual'); ?>>
                    💎 Runas/Virtual
                </label>
                <label class="tipo-tab <?php echo $tipo_producto === 'membresia' ? 'active' : ''; ?>">
                    <input type="radio" name="_duendes_tipo_producto" value="membresia" <?php checked($tipo_producto, 'membresia'); ?>>
                    ⭐ Círculo
                </label>
                <label class="tipo-tab <?php echo $tipo_producto === 'cristal' ? 'active' : ''; ?>">
                    <input type="radio" name="_duendes_tipo_producto" value="cristal" <?php checked($tipo_producto, 'cristal'); ?>>
                    💠 Cristal
                </label>
                <label class="tipo-tab <?php echo $tipo_producto === 'accesorio' ? 'active' : ''; ?>">
                    <input type="radio" name="_duendes_tipo_producto" value="accesorio" <?php checked($tipo_producto, 'accesorio'); ?>>
                    📿 Accesorio
                </label>
                <label class="tipo-tab <?php echo $tipo_producto === 'estudio' ? 'active' : ''; ?>">
                    <input type="radio" name="_duendes_tipo_producto" value="estudio" <?php checked($tipo_producto, 'estudio'); ?>>
                    🔮 Estudio
                </label>
            </div>
        </div>

        <!-- DATOS DEL GUARDIAN -->
        <div class="duendes-section" id="seccion-guardian">
            <h3 class="duendes-section-title">🧙 Datos del Guardián</h3>

            <div class="duendes-row">
                <div class="duendes-field">
                    <label>Tipo de Ser</label>
                    <select name="_guardian_tipo" id="guardian_tipo">
                        <optgroup label="Seres del Bosque">
                            <option value="Duende" <?php selected($tipo_ser, 'Duende'); ?>>Duende</option>
                            <option value="Elfo" <?php selected($tipo_ser, 'Elfo'); ?>>Elfo</option>
                            <option value="Hada" <?php selected($tipo_ser, 'Hada'); ?>>Hada</option>
                            <option value="Gnomo" <?php selected($tipo_ser, 'Gnomo'); ?>>Gnomo</option>
                            <option value="Ninfa" <?php selected($tipo_ser, 'Ninfa'); ?>>Ninfa</option>
                            <option value="Driade" <?php selected($tipo_ser, 'Driade'); ?>>Dríade</option>
                        </optgroup>
                        <optgroup label="Practicantes de Magia">
                            <option value="Bruja" <?php selected($tipo_ser, 'Bruja'); ?>>Bruja</option>
                            <option value="Brujo" <?php selected($tipo_ser, 'Brujo'); ?>>Brujo</option>
                            <option value="Mago" <?php selected($tipo_ser, 'Mago'); ?>>Mago</option>
                            <option value="Hechicero" <?php selected($tipo_ser, 'Hechicero'); ?>>Hechicero</option>
                            <option value="Hechicera" <?php selected($tipo_ser, 'Hechicera'); ?>>Hechicera</option>
                        </optgroup>
                        <optgroup label="Místicos">
                            <option value="Chaman" <?php selected($tipo_ser, 'Chaman'); ?>>Chamán</option>
                            <option value="Druida" <?php selected($tipo_ser, 'Druida'); ?>>Druida</option>
                            <option value="Oraculo" <?php selected($tipo_ser, 'Oraculo'); ?>>Oráculo</option>
                            <option value="Vidente" <?php selected($tipo_ser, 'Vidente'); ?>>Vidente</option>
                        </optgroup>
                        <optgroup label="Guardianes">
                            <option value="Guardian" <?php selected($tipo_ser, 'Guardian'); ?>>Guardián</option>
                            <option value="Protector" <?php selected($tipo_ser, 'Protector'); ?>>Protector</option>
                            <option value="Sanador" <?php selected($tipo_ser, 'Sanador'); ?>>Sanador</option>
                        </optgroup>
                    </select>
                </div>
                <div class="duendes-field">
                    <label>Género</label>
                    <select name="_guardian_genero" id="guardian_genero">
                        <option value="femenino" <?php selected($genero, 'femenino'); ?>>Femenino</option>
                        <option value="masculino" <?php selected($genero, 'masculino'); ?>>Masculino</option>
                        <option value="neutro" <?php selected($genero, 'neutro'); ?>>Neutro</option>
                    </select>
                </div>
                <div class="duendes-field">
                    <label>Altura (cm)</label>
                    <input type="number" name="_guardian_altura" id="guardian_altura" value="<?php echo esc_attr($altura_cm); ?>" min="5" max="100">
                </div>
                <div class="duendes-field">
                    <label>Color de Ojos</label>
                    <input type="text" name="_guardian_ojos" id="guardian_ojos" value="<?php echo esc_attr($color_ojos); ?>" placeholder="celestes, verdes...">
                </div>
            </div>

            <div class="duendes-row">
                <div class="duendes-field">
                    <label>Elemento</label>
                    <select name="_guardian_elemento" id="guardian_elemento">
                        <option value="Cualquiera" <?php selected($elemento, 'Cualquiera'); ?>>Claude decide</option>
                        <option value="Tierra" <?php selected($elemento, 'Tierra'); ?>>🌍 Tierra</option>
                        <option value="Agua" <?php selected($elemento, 'Agua'); ?>>💧 Agua</option>
                        <option value="Fuego" <?php selected($elemento, 'Fuego'); ?>>🔥 Fuego</option>
                        <option value="Aire" <?php selected($elemento, 'Aire'); ?>>💨 Aire</option>
                        <option value="Eter" <?php selected($elemento, 'Eter'); ?>>✨ Éter</option>
                    </select>
                </div>
                <div class="duendes-field">
                    <label>Propósito</label>
                    <select name="_guardian_proposito" id="guardian_proposito">
                        <option value="Que Claude decida" <?php selected($proposito, 'Que Claude decida'); ?>>Claude decide</option>
                        <option value="Proteccion" <?php selected($proposito, 'Proteccion'); ?>>🛡️ Protección</option>
                        <option value="Amor" <?php selected($proposito, 'Amor'); ?>>💜 Amor</option>
                        <option value="Abundancia" <?php selected($proposito, 'Abundancia'); ?>>✨ Abundancia</option>
                        <option value="Sanacion" <?php selected($proposito, 'Sanacion'); ?>>🌿 Sanación</option>
                        <option value="Sabiduria" <?php selected($proposito, 'Sabiduria'); ?>>🔮 Sabiduría</option>
                    </select>
                </div>
            </div>

            <div class="duendes-row">
                <div class="duendes-field" style="grid-column: 1 / -1;">
                    <label>Accesorios / Detalles Físicos</label>
                    <input type="text" name="_guardian_accesorios" id="guardian_accesorios" value="<?php echo esc_attr($accesorios); ?>" placeholder="escoba, sombrero, flores, capa...">
                </div>
            </div>

            <div class="duendes-row">
                <div class="duendes-field" style="grid-column: 1 / -1;">
                    <label>Notas para Claude (opcional)</label>
                    <textarea name="_guardian_notas" id="guardian_notas" rows="2" placeholder="es anciana, aspecto misterioso..."><?php echo esc_textarea($notas); ?></textarea>
                </div>
            </div>
        </div>

        <!-- PRECIOS -->
        <div class="duendes-section">
            <h3 class="duendes-section-title">💰 Precios</h3>
            <div class="precio-grid">
                <div class="precio-box">
                    <label>Precio USD</label>
                    <input type="number" id="precio_usd" value="<?php echo esc_attr($precio_usd); ?>" min="1" step="1" placeholder="150">
                </div>
                <div class="precio-box">
                    <label>Precio UYU</label>
                    <input type="number" name="_precio_uyu" id="precio_uyu" value="<?php echo esc_attr($precio_uyu); ?>" min="1" step="1" placeholder="6450">
                    <small style="color:#6e7681;font-size:10px;">Manual o auto x43</small>
                </div>
                <div class="precio-box calculated">
                    <label>Precio ARS (ref)</label>
                    <span class="currency" id="precio_ars">$<?php echo number_format(($precio_usd ?: 0) * 1050, 0, ',', '.'); ?></span>
                </div>
            </div>
        </div>

        <!-- GENERADOR IA -->
        <div class="duendes-section" id="seccion-ia">
            <h3 class="duendes-section-title">🤖 Generador con IA</h3>

            <?php if ($historia && $fecha_generado): ?>
                <div class="historia-badge">✓ Historia generada el <?php echo date('d/m/Y H:i', strtotime($fecha_generado)); ?></div>
            <?php else: ?>
                <div class="historia-badge pending">○ Sin historia generada</div>
            <?php endif; ?>

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button type="button" class="btn-generar" id="btn-generar-todo">
                    ⚡ Generar Historia + SEO
                </button>
                <button type="button" class="btn-generar btn-secondary" id="btn-solo-seo">
                    🎯 Solo SEO
                </button>
            </div>

            <div class="gen-status" id="gen-status"></div>
        </div>

        <!-- SEO -->
        <div class="duendes-section">
            <h3 class="duendes-section-title">🎯 SEO</h3>
            <div class="duendes-row">
                <div class="duendes-field" style="grid-column: 1 / -1;">
                    <label>Título SEO (max 60)</label>
                    <input type="text" name="_duendes_seo_titulo" id="seo_titulo" value="<?php echo esc_attr($seo_titulo); ?>" maxlength="60">
                </div>
            </div>
            <div class="duendes-row">
                <div class="duendes-field" style="grid-column: 1 / -1;">
                    <label>Meta Descripción (max 160)</label>
                    <textarea name="_duendes_seo_descripcion" id="seo_descripcion" maxlength="160" rows="2"><?php echo esc_textarea($seo_descripcion); ?></textarea>
                </div>
            </div>
            <div class="duendes-row">
                <div class="duendes-field" style="grid-column: 1 / -1;">
                    <label>Keywords</label>
                    <input type="text" name="_duendes_seo_keywords" id="seo_keywords" value="<?php echo esc_attr($seo_keywords); ?>">
                </div>
            </div>
        </div>

        <!-- QR Y CERTIFICADO -->
        <div class="duendes-section">
            <h3 class="duendes-section-title">📜 Certificado y QR para Caja</h3>

            <div class="qr-section">
                <div class="qr-preview">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=<?php echo urlencode(home_url('/mi-magia/?codigo=' . $codigo_guardian)); ?>" alt="QR Code">
                    <div class="qr-code-text"><?php echo esc_html($codigo_guardian); ?></div>
                </div>
                <div class="qr-info">
                    <h4>Código único: <?php echo esc_html($codigo_guardian); ?></h4>
                    <p>Este QR lleva a la página "Mi Magia" donde el cliente puede ver el certificado de autenticidad, la historia completa del guardián y contenido exclusivo.</p>

                    <div class="qr-actions">
                        <a href="<?php echo admin_url('admin-ajax.php?action=duendes_imprimir_qr&id=' . $post->ID); ?>" target="_blank" class="btn-generar btn-secondary">
                            🖨️ Imprimir QR (Tarot)
                        </a>
                        <a href="<?php echo admin_url('admin-ajax.php?action=duendes_ver_certificado&id=' . $post->ID); ?>" target="_blank" class="btn-generar btn-secondary">
                            📜 Ver Certificado
                        </a>
                    </div>

                    <div class="cert-info">
                        <p><strong>URL para el cliente:</strong><br>
                        <?php echo home_url('/mi-magia/'); ?></p>
                        <p style="margin-top:10px;"><strong>Con código:</strong><br>
                        <?php echo home_url('/mi-magia/?codigo=' . $codigo_guardian); ?></p>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <script>
    jQuery(document).ready(function($) {
        // Tabs tipo producto
        $('.tipo-tab input').on('change', function() {
            $('.tipo-tab').removeClass('active');
            $(this).closest('.tipo-tab').addClass('active');
        });

        // Calcular precios
        $('#precio_usd').on('input', function() {
            const usd = parseFloat($(this).val()) || 0;
            // Auto calcular UYU si está vacío
            if (!$('#precio_uyu').val()) {
                $('#precio_uyu').attr('placeholder', Math.round(usd * 43));
            }
            $('#precio_ars').text('$' + (usd * 1050).toLocaleString('es-AR'));
        });

        // Generar con IA
        $('#btn-generar-todo, #btn-solo-seo').on('click', function() {
            const soloSeo = $(this).attr('id') === 'btn-solo-seo';
            const $btn = $(this);
            const $status = $('#gen-status');

            $btn.prop('disabled', true);
            $status.removeClass('success error').addClass('loading')
                   .text('Generando con Claude... (30-60 seg)').show();

            const datos = {
                nombre: $('#title').val() || $('input[name="post_title"]').val(),
                tipo: $('#guardian_tipo').val(),
                genero: $('#guardian_genero').val(),
                altura: $('#guardian_altura').val(),
                colorOjos: $('#guardian_ojos').val() || 'no especificado',
                accesorios: $('#guardian_accesorios').val() || 'ninguno',
                elemento: $('#guardian_elemento').val(),
                proposito: $('#guardian_proposito').val(),
                notas: $('#guardian_notas').val(),
                productId: 'woo_<?php echo $post->ID; ?>',
                soloSeo: soloSeo
            };

            $.ajax({
                url: 'https://duendes-vercel.vercel.app/api/admin/productos/generar-historia',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(datos),
                timeout: 120000,
                success: function(res) {
                    if (res.success) {
                        $status.removeClass('loading').addClass('success')
                               .text('¡Generado! Guardá el producto para aplicar.');

                        if (res.contenido?.seo) {
                            $('#seo_titulo').val(res.contenido.seo.titulo);
                            $('#seo_descripcion').val(res.contenido.seo.descripcion);
                            $('#seo_keywords').val(res.contenido.seo.keywords);
                        }

                        setTimeout(() => location.reload(), 2000);
                    } else {
                        $status.removeClass('loading').addClass('error')
                               .text('Error: ' + (res.error || 'desconocido'));
                    }
                },
                error: function(xhr, status, error) {
                    $status.removeClass('loading').addClass('error')
                           .text('Error: ' + error);
                },
                complete: function() {
                    $btn.prop('disabled', false);
                }
            });
        });
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════
// GUARDAR DATOS
// ═══════════════════════════════════════════════════════════════

add_action('save_post_product', function($post_id) {
    if (!isset($_POST['duendes_nonce']) || !wp_verify_nonce($_POST['duendes_nonce'], 'duendes_producto_nonce')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $campos = [
        '_duendes_tipo_producto', '_guardian_tipo', '_guardian_genero', '_guardian_altura',
        '_guardian_ojos', '_guardian_accesorios', '_guardian_elemento', '_guardian_proposito',
        '_guardian_notas', '_precio_uyu', '_duendes_seo_titulo', '_duendes_seo_descripcion',
        '_duendes_seo_keywords'
    ];

    foreach ($campos as $campo) {
        if (isset($_POST[$campo])) {
            update_post_meta($post_id, $campo, sanitize_textarea_field($_POST[$campo]));
        }
    }

    // Generar código único si no existe
    if (!get_post_meta($post_id, '_codigo_guardian', true)) {
        update_post_meta($post_id, '_codigo_guardian', 'DU' . str_pad($post_id, 5, '0', STR_PAD_LEFT));
    }
});

// ═══════════════════════════════════════════════════════════════
// AJAX: IMPRIMIR QR ESTILO TAROT
// ═══════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_imprimir_qr', function() {
    $id = intval($_GET['id'] ?? 0);
    if (!$id) wp_die('ID inválido');

    $product = wc_get_product($id);
    if (!$product) wp_die('Producto no encontrado');

    $nombre = $product->get_name();
    $codigo = get_post_meta($id, '_codigo_guardian', true) ?: 'DU' . str_pad($id, 5, '0', STR_PAD_LEFT);
    $tipo = get_post_meta($id, '_guardian_tipo', true) ?: 'Guardián';
    $url_mi_magia = home_url('/mi-magia/?codigo=' . $codigo);
    $qr_url = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' . urlencode($url_mi_magia);

    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>QR - <?php echo esc_html($nombre); ?></title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital@0;1&display=swap" rel="stylesheet">
        <style>
            @page { size: 10cm 14cm; margin: 0; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Cormorant Garamond', serif;
                background: #0a0a0a;
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                padding: 20px;
            }
            .qr-card {
                width: 10cm;
                height: 14cm;
                background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
                border: 2px solid #C6A962;
                border-radius: 20px;
                padding: 25px;
                position: relative;
                overflow: hidden;
            }
            .card-frame {
                position: absolute;
                inset: 8px;
                border: 1px solid rgba(198,169,98,0.3);
                border-radius: 16px;
                pointer-events: none;
            }
            .corner {
                position: absolute;
                width: 30px;
                height: 30px;
                border: 2px solid #C6A962;
            }
            .corner.tl { top: 15px; left: 15px; border-right: none; border-bottom: none; border-radius: 8px 0 0 0; }
            .corner.tr { top: 15px; right: 15px; border-left: none; border-bottom: none; border-radius: 0 8px 0 0; }
            .corner.bl { bottom: 15px; left: 15px; border-right: none; border-top: none; border-radius: 0 0 0 8px; }
            .corner.br { bottom: 15px; right: 15px; border-left: none; border-top: none; border-radius: 0 0 8px 0; }

            .header {
                text-align: center;
                margin-bottom: 15px;
            }
            .header h1 {
                font-family: 'Cinzel', serif;
                font-size: 16px;
                color: #C6A962;
                letter-spacing: 3px;
                text-transform: uppercase;
                margin-bottom: 5px;
            }
            .header p {
                font-size: 12px;
                color: rgba(255,255,255,0.6);
                font-style: italic;
            }

            .qr-container {
                background: #fff;
                border-radius: 15px;
                padding: 15px;
                margin: 15px auto;
                width: fit-content;
            }
            .qr-container img {
                display: block;
                width: 180px;
                height: 180px;
            }

            .guardian-name {
                text-align: center;
                margin: 15px 0;
            }
            .guardian-name h2 {
                font-family: 'Cinzel', serif;
                font-size: 22px;
                color: #fff;
                margin-bottom: 5px;
            }
            .guardian-name span {
                font-size: 11px;
                color: rgba(255,255,255,0.5);
                text-transform: uppercase;
                letter-spacing: 2px;
            }

            .codigo {
                text-align: center;
                margin: 10px 0;
            }
            .codigo span {
                font-family: 'Cinzel', serif;
                font-size: 14px;
                color: #C6A962;
                letter-spacing: 3px;
            }

            .instructions {
                text-align: center;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(198,169,98,0.2);
            }
            .instructions p {
                font-size: 11px;
                color: rgba(255,255,255,0.6);
                line-height: 1.5;
                margin-bottom: 8px;
            }
            .instructions .url {
                font-family: monospace;
                font-size: 9px;
                color: #C6A962;
                word-break: break-all;
            }

            .logo {
                text-align: center;
                margin-top: 15px;
                font-family: 'Cinzel', serif;
                font-size: 10px;
                color: rgba(198,169,98,0.5);
                letter-spacing: 2px;
            }

            @media print {
                body { background: white; }
                .qr-card { box-shadow: none; }
            }
        </style>
    </head>
    <body>
        <div class="qr-card">
            <div class="card-frame"></div>
            <div class="corner tl"></div>
            <div class="corner tr"></div>
            <div class="corner bl"></div>
            <div class="corner br"></div>

            <div class="header">
                <h1>✨ Tu Guardián te Espera</h1>
                <p>Escaneá el código para acceder a tu espacio mágico</p>
            </div>

            <div class="qr-container">
                <img src="<?php echo esc_url($qr_url); ?>" alt="QR Code">
            </div>

            <div class="guardian-name">
                <h2><?php echo esc_html($nombre); ?></h2>
                <span><?php echo esc_html($tipo); ?></span>
            </div>

            <div class="codigo">
                <span><?php echo esc_html($codigo); ?></span>
            </div>

            <div class="instructions">
                <p>Escaneá el QR o ingresá a:</p>
                <p class="url"><?php echo esc_html(str_replace(['https://', 'http://'], '', home_url('/mi-magia/'))); ?></p>
                <p style="margin-top:5px;">e ingresá tu código: <strong style="color:#C6A962;"><?php echo esc_html($codigo); ?></strong></p>
            </div>

            <div class="logo">Duendes del Uruguay</div>
        </div>

        <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
    <?php
    exit;
});

// ═══════════════════════════════════════════════════════════════
// AJAX: VER CERTIFICADO
// ═══════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_ver_certificado', function() {
    $id = intval($_GET['id'] ?? 0);
    if (!$id) wp_die('ID inválido');

    $product = wc_get_product($id);
    if (!$product) wp_die('Producto no encontrado');

    $nombre = $product->get_name();
    $codigo = get_post_meta($id, '_codigo_guardian', true) ?: 'DU' . str_pad($id, 5, '0', STR_PAD_LEFT);
    $tipo = get_post_meta($id, '_guardian_tipo', true) ?: 'Guardián';
    $elemento = get_post_meta($id, '_guardian_elemento', true) ?: 'Misterioso';
    $proposito = get_post_meta($id, '_guardian_proposito', true) ?: 'Protección';
    $altura = get_post_meta($id, '_guardian_altura', true) ?: '25';
    $fecha = get_the_date('d/m/Y', $id);
    $img = get_the_post_thumbnail_url($id, 'medium');

    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Certificado - <?php echo esc_html($nombre); ?></title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
        <style>
            @page { size: A4 landscape; margin: 0; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Cormorant Garamond', serif;
                background: #0a0a0a;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            .certificado {
                width: 29.7cm;
                height: 21cm;
                background: linear-gradient(145deg, #1a1510 0%, #0a0a0a 100%);
                border: 3px solid #C6A962;
                border-radius: 20px;
                padding: 40px 50px;
                position: relative;
                overflow: hidden;
            }
            .cert-pattern {
                position: absolute;
                inset: 0;
                opacity: 0.03;
                background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='%23C6A962'/%3E%3C/svg%3E");
                background-size: 40px 40px;
            }
            .cert-frame {
                position: absolute;
                inset: 15px;
                border: 1px solid rgba(198,169,98,0.3);
                border-radius: 15px;
            }
            .cert-frame::before {
                content: '';
                position: absolute;
                inset: 8px;
                border: 1px solid rgba(198,169,98,0.15);
                border-radius: 12px;
            }

            .cert-header {
                text-align: center;
                position: relative;
                z-index: 1;
                margin-bottom: 30px;
            }
            .cert-header h1 {
                font-family: 'Cinzel', serif;
                font-size: 42px;
                color: #C6A962;
                letter-spacing: 8px;
                text-transform: uppercase;
                margin-bottom: 10px;
            }
            .cert-header p {
                font-size: 18px;
                color: rgba(255,255,255,0.6);
                font-style: italic;
            }

            .cert-body {
                display: grid;
                grid-template-columns: 250px 1fr;
                gap: 40px;
                position: relative;
                z-index: 1;
            }
            .cert-image {
                width: 250px;
                height: 300px;
                border-radius: 15px;
                overflow: hidden;
                border: 2px solid #C6A962;
            }
            .cert-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .cert-details {
                padding: 20px 0;
            }
            .cert-name {
                font-family: 'Cinzel', serif;
                font-size: 36px;
                color: #fff;
                margin-bottom: 10px;
            }
            .cert-tipo {
                font-size: 14px;
                color: rgba(255,255,255,0.5);
                text-transform: uppercase;
                letter-spacing: 3px;
                margin-bottom: 25px;
            }

            .cert-info-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin-bottom: 25px;
            }
            .cert-info-item {
                background: rgba(198,169,98,0.05);
                border: 1px solid rgba(198,169,98,0.2);
                border-radius: 10px;
                padding: 15px;
            }
            .cert-info-item label {
                display: block;
                font-size: 10px;
                color: rgba(255,255,255,0.5);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
            }
            .cert-info-item span {
                font-family: 'Cinzel', serif;
                font-size: 16px;
                color: #C6A962;
            }

            .cert-message {
                font-size: 16px;
                color: rgba(255,255,255,0.7);
                line-height: 1.6;
                font-style: italic;
                border-left: 2px solid #C6A962;
                padding-left: 20px;
            }

            .cert-footer {
                position: absolute;
                bottom: 40px;
                left: 50px;
                right: 50px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            }
            .cert-codigo {
                font-family: 'Cinzel', serif;
                font-size: 14px;
                color: rgba(198,169,98,0.6);
                letter-spacing: 3px;
            }
            .cert-logo {
                font-family: 'Cinzel', serif;
                font-size: 12px;
                color: rgba(198,169,98,0.4);
                text-align: right;
            }

            @media print {
                body { background: white; }
            }
        </style>
    </head>
    <body>
        <div class="certificado">
            <div class="cert-pattern"></div>
            <div class="cert-frame"></div>

            <div class="cert-header">
                <h1>Certificado de Autenticidad</h1>
                <p>Pieza única canalizada en Piriápolis, Uruguay</p>
            </div>

            <div class="cert-body">
                <div class="cert-image">
                    <?php if ($img): ?>
                    <img src="<?php echo esc_url($img); ?>" alt="<?php echo esc_attr($nombre); ?>">
                    <?php endif; ?>
                </div>

                <div class="cert-details">
                    <h2 class="cert-name"><?php echo esc_html($nombre); ?></h2>
                    <p class="cert-tipo"><?php echo esc_html($tipo); ?></p>

                    <div class="cert-info-grid">
                        <div class="cert-info-item">
                            <label>Código Único</label>
                            <span><?php echo esc_html($codigo); ?></span>
                        </div>
                        <div class="cert-info-item">
                            <label>Elemento</label>
                            <span><?php echo esc_html($elemento); ?></span>
                        </div>
                        <div class="cert-info-item">
                            <label>Propósito</label>
                            <span><?php echo esc_html($proposito); ?></span>
                        </div>
                        <div class="cert-info-item">
                            <label>Altura</label>
                            <span><?php echo esc_html($altura); ?> cm</span>
                        </div>
                    </div>

                    <p class="cert-message">
                        "Este guardián ha cruzado el portal ancestral para encontrarte. No fue casualidad que llegara a vos. Cuidalo, respetalo, y él te acompañará con su energía protectora por el resto de tus días."
                    </p>
                </div>
            </div>

            <div class="cert-footer">
                <div class="cert-codigo">N° <?php echo esc_html($codigo); ?> · <?php echo esc_html($fecha); ?></div>
                <div class="cert-logo">
                    Duendes del Uruguay<br>
                    <span style="font-size:10px;">Canalizados en Piriápolis</span>
                </div>
            </div>
        </div>

        <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
    <?php
    exit;
});

// ═══════════════════════════════════════════════════════════════
// META TAGS SEO
// ═══════════════════════════════════════════════════════════════

add_action('wp_head', function() {
    if (!is_product()) return;
    global $post;

    $seo_desc = get_post_meta($post->ID, '_duendes_seo_descripcion', true);
    $seo_keys = get_post_meta($post->ID, '_duendes_seo_keywords', true);

    if ($seo_desc) echo '<meta name="description" content="' . esc_attr($seo_desc) . '">' . "\n";
    if ($seo_keys) echo '<meta name="keywords" content="' . esc_attr($seo_keys) . '">' . "\n";
}, 1);

add_filter('pre_get_document_title', function($title) {
    if (is_product()) {
        global $post;
        $seo_titulo = get_post_meta($post->ID, '_duendes_seo_titulo', true);
        if ($seo_titulo) return $seo_titulo . ' - Duendes del Uruguay';
    }
    return $title;
}, 999);
