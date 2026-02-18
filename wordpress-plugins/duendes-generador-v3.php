<?php
/**
 * Plugin Name: Duendes Generador v3
 * Description: Generador simple: datos básicos + foto = historia + ficha + mensaje. Un click.
 * Version: 3.0.0
 */

if (!defined('ABSPATH')) exit;

class DuendesGeneradorV3 {

    public function __construct() {
        add_action('add_meta_boxes', [$this, 'agregar_metabox'], 5);
        add_action('save_post_product', [$this, 'guardar_datos']);
        add_action('wp_ajax_dg3_generar_todo', [$this, 'ajax_generar_todo']);
        add_action('wp_ajax_dg3_guardar_todo', [$this, 'ajax_guardar_todo']);

        // Frontend
        add_filter('woocommerce_product_tabs', [$this, 'agregar_tab_ficha']);
        add_action('woocommerce_single_product_summary', [$this, 'mostrar_subtitulo'], 6);

        // Limpiar metaboxes viejos
        add_action('add_meta_boxes', [$this, 'limpiar_viejos'], 99);
    }

    public function limpiar_viejos() {
        $viejos = ['duendes_guardian_suite', 'duendes_ficha_guardian', 'duendes_generador_historias'];
        foreach ($viejos as $id) {
            remove_meta_box($id, 'product', 'normal');
            remove_meta_box($id, 'product', 'side');
            remove_meta_box($id, 'product', 'advanced');
        }
    }

    private function get_api_key() {
        $key = get_option('duendes_anthropic_api_key', '');
        if (empty($key) && defined('ANTHROPIC_API_KEY')) {
            $key = ANTHROPIC_API_KEY;
        }
        return $key;
    }

    // ═══════════════════════════════════════════════════════════════
    // METABOX SIMPLE
    // ═══════════════════════════════════════════════════════════════

    public function agregar_metabox() {
        add_meta_box(
            'duendes_generador_v3',
            '🧚 Generador de Guardián',
            [$this, 'render_metabox'],
            'product',
            'normal',
            'high'
        );
    }

    public function render_metabox($post) {
        wp_nonce_field('dg3_nonce', 'dg3_nonce_field');

        $ficha = get_post_meta($post->ID, '_duendes_ficha', true) ?: [];
        $producto = wc_get_product($post->ID);
        $imagen_id = $producto ? $producto->get_image_id() : 0;
        $imagen_url = $imagen_id ? wp_get_attachment_image_url($imagen_id, 'medium') : '';
        $tiene_historia = $producto && !empty($producto->get_description());

        $categorias = [
            'proteccion' => 'Protección',
            'abundancia' => 'Abundancia',
            'amor' => 'Amor',
            'sanacion' => 'Sanación',
            'salud' => 'Salud',
            'sabiduria' => 'Sabiduría',
            'conexion_espiritual' => 'Conexión Espiritual',
            'transformacion' => 'Transformación'
        ];

        $especies = [
            'duende' => 'Duende',
            'pixie' => 'Pixie',
            'elfo' => 'Elfo',
            'bruja' => 'Bruja/Brujo',
            'vikingo' => 'Vikingo/a',
            'leprechaun' => 'Leprechaun',
            'chaman' => 'Chamán',
            'mago' => 'Mago/a',
            'guerrero' => 'Guerrero/a',
            'sanador' => 'Sanador/a',
            'druida' => 'Druida',
            'merlin' => 'Merlín',
            'morgana' => 'Morgana',
            'alquimista' => 'Alquimista'
        ];
        ?>
        <style>
            .dg3 { background: #1a1a2e; padding: 25px; border-radius: 12px; color: #fff; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
            .dg3-grid { display: grid; grid-template-columns: 200px 1fr; gap: 20px; }
            .dg3-foto { text-align: center; }
            .dg3-foto img { max-width: 180px; border-radius: 10px; border: 2px solid #c9a962; }
            .dg3-foto-empty { width: 180px; height: 180px; background: #0d0d1a; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #666; border: 2px dashed #333; margin: 0 auto; }
            .dg3-campos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            .dg3-campo { }
            .dg3-campo.full { grid-column: span 3; }
            .dg3-campo.half { grid-column: span 2; }
            .dg3-campo label { display: block; color: #c9a962; font-size: 11px; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 1px; }
            .dg3-campo input, .dg3-campo select, .dg3-campo textarea {
                width: 100%; padding: 10px 12px; border: 1px solid #333; border-radius: 8px;
                background: #0d0d1a; color: #fff; font-size: 14px;
            }
            .dg3-campo input:focus, .dg3-campo select:focus { border-color: #c9a962; outline: none; }
            .dg3-acciones { margin-top: 20px; display: flex; gap: 15px; align-items: center; flex-wrap: wrap; }
            .dg3-btn {
                background: linear-gradient(135deg, #c9a962, #a08030); color: #1a1a2e;
                border: none; padding: 15px 30px; border-radius: 10px; cursor: pointer;
                font-weight: bold; font-size: 16px; transition: all 0.2s;
            }
            .dg3-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 25px rgba(201,169,98,0.4); }
            .dg3-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
            .dg3-btn-secondary { background: linear-gradient(135deg, #4a4a6a, #3a3a5a); color: #fff; font-size: 14px; padding: 12px 20px; }
            .dg3-status { padding: 12px 15px; border-radius: 8px; margin-top: 15px; font-size: 13px; }
            .dg3-status.success { background: rgba(74,153,98,0.2); border: 1px solid #4a9962; color: #6fc98a; }
            .dg3-status.error { background: rgba(220,53,69,0.2); border: 1px solid #dc3545; color: #f77; }
            .dg3-status.loading { background: rgba(201,169,98,0.2); border: 1px solid #c9a962; color: #c9a962; }
            .dg3-preview { margin-top: 20px; padding: 20px; background: #0d0d1a; border-radius: 10px; max-height: 400px; overflow-y: auto; }
            .dg3-preview h4 { color: #c9a962; margin: 0 0 10px; font-size: 13px; text-transform: uppercase; }
            .dg3-preview-content { color: #ddd; line-height: 1.7; font-size: 14px; }
            .dg3-regenerar { margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 8px; }
            .dg3-regenerar input { margin-top: 10px; }
            .dg3-check { display: flex; align-items: center; gap: 15px; padding: 10px 0; }
            .dg3-check-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #888; }
            .dg3-check-item.ok { color: #4a9962; }
            .dg3-check-item.warn { color: #ffc107; }
        </style>

        <div class="dg3">
            <div class="dg3-grid">
                <!-- Foto -->
                <div class="dg3-foto">
                    <?php if ($imagen_url): ?>
                        <img src="<?php echo esc_url($imagen_url); ?>" alt="Foto del guardián">
                        <p style="margin-top: 8px; font-size: 11px; color: #666;">Esta foto se analiza automáticamente</p>
                    <?php else: ?>
                        <div class="dg3-foto-empty">Sin foto</div>
                        <p style="margin-top: 8px; font-size: 11px; color: #f77;">Subí una foto primero</p>
                    <?php endif; ?>
                </div>

                <!-- Campos -->
                <div class="dg3-campos">
                    <div class="dg3-campo">
                        <label>Tamaño (cm) *</label>
                        <input type="number" name="dg3[tamano_cm]" id="dg3_tamano" value="<?php echo esc_attr($ficha['tamano_cm'] ?? ''); ?>" placeholder="25" required>
                    </div>

                    <div class="dg3-campo">
                        <label>Género *</label>
                        <select name="dg3[genero]" id="dg3_genero">
                            <option value="M" <?php selected($ficha['genero'] ?? '', 'M'); ?>>Masculino</option>
                            <option value="F" <?php selected($ficha['genero'] ?? '', 'F'); ?>>Femenino</option>
                        </select>
                    </div>

                    <div class="dg3-campo">
                        <label>Categoría/Poder *</label>
                        <select name="dg3[categoria]" id="dg3_categoria">
                            <?php foreach ($categorias as $id => $nombre): ?>
                                <option value="<?php echo $id; ?>" <?php selected($ficha['categoria'] ?? '', $id); ?>><?php echo $nombre; ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="dg3-campo">
                        <label>Especie/Familia</label>
                        <select name="dg3[especie]" id="dg3_especie">
                            <?php foreach ($especies as $id => $nombre): ?>
                                <option value="<?php echo $id; ?>" <?php selected($ficha['especie'] ?? 'duende', $id); ?>><?php echo $nombre; ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="dg3-campo half">
                        <label>Accesorios que incluye</label>
                        <input type="text" name="dg3[accesorios]" id="dg3_accesorios" value="<?php echo esc_attr($ficha['accesorios'] ?? ''); ?>" placeholder="Ej: pirita, moneda dorada, capa verde...">
                    </div>

                    <div class="dg3-campo">
                        <label>¿Único o Recreable?</label>
                        <select name="dg3[es_unico]" id="dg3_es_unico">
                            <option value="unico" <?php selected($ficha['es_unico'] ?? '', 'unico'); ?>>Ser Único</option>
                            <option value="recreable" <?php selected($ficha['es_unico'] ?? '', 'recreable'); ?>>Recreable</option>
                        </select>
                    </div>

                    <div class="dg3-campo half">
                        <label>Estructura Narrativa</label>
                        <select name="dg3[tipo_historia]" id="dg3_tipo_historia">
                            <option value="A">A - Clásico con secciones</option>
                            <option value="B">B - Narrativa fluida (sin títulos)</option>
                            <option value="C">C - Empieza por mensaje canalizado</option>
                            <option value="D">D - Empieza por sincrodestino</option>
                            <option value="E">E - Formato carta/diario</option>
                            <option value="F">F - Entrevista al guardián</option>
                            <option value="G">G - Contada por el guardián</option>
                            <option value="H">H - Segunda persona (vos)</option>
                        </select>
                    </div>

                    <div class="dg3-campo full">
                        <label>Notas adicionales (opcional)</label>
                        <input type="text" name="dg3[notas]" id="dg3_notas" value="" placeholder="Algo especial que quieras incluir en la historia...">
                    </div>
                </div>
            </div>

            <!-- Check de requisitos -->
            <div class="dg3-check">
                <div class="dg3-check-item <?php echo $imagen_url ? 'ok' : 'warn'; ?>">
                    <?php echo $imagen_url ? '✓' : '!'; ?> Foto
                </div>
                <div class="dg3-check-item <?php echo !empty($ficha['tamano_cm']) ? 'ok' : ''; ?>">
                    <?php echo !empty($ficha['tamano_cm']) ? '✓' : '○'; ?> Tamaño
                </div>
                <div class="dg3-check-item <?php echo $tiene_historia ? 'ok' : ''; ?>">
                    <?php echo $tiene_historia ? '✓ Tiene historia' : '○ Sin historia'; ?>
                </div>
            </div>

            <!-- Acciones -->
            <div class="dg3-acciones">
                <button type="button" class="dg3-btn" id="dg3-generar" <?php echo !$imagen_url ? 'disabled title="Necesitás subir una foto primero"' : ''; ?>>
                    ✨ GENERAR TODO
                </button>

                <?php if ($tiene_historia): ?>
                <button type="button" class="dg3-btn dg3-btn-secondary" id="dg3-regenerar-btn">
                    🔄 Regenerar
                </button>
                <?php endif; ?>
            </div>

            <!-- Regenerar con indicaciones -->
            <div class="dg3-regenerar" id="dg3-regenerar-panel" style="display: none;">
                <label style="color: #c9a962; font-size: 12px;">¿Qué querés cambiar?</label>
                <input type="text" id="dg3-indicaciones" placeholder="Ej: hacelo más místico, mencioná que es travieso, cambiá el sincrodestino...">
                <button type="button" class="dg3-btn" id="dg3-regenerar-ejecutar" style="margin-top: 10px;">
                    ✨ Regenerar con indicaciones
                </button>
            </div>

            <!-- Status -->
            <div id="dg3-status"></div>

            <!-- Preview -->
            <div id="dg3-preview" style="display: none;">
                <div class="dg3-preview">
                    <h4>📖 Historia generada</h4>
                    <div class="dg3-preview-content" id="dg3-historia-preview"></div>
                </div>
                <div class="dg3-preview" style="margin-top: 10px;">
                    <h4>📋 Ficha del Guardián</h4>
                    <div class="dg3-preview-content" id="dg3-ficha-preview"></div>
                </div>
                <div class="dg3-preview" style="margin-top: 10px;">
                    <h4>💬 Mensaje del Guardián</h4>
                    <div class="dg3-preview-content" id="dg3-mensaje-preview" style="font-style: italic;"></div>
                </div>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button type="button" class="dg3-btn" id="dg3-guardar">💾 Guardar Todo</button>
                    <button type="button" class="dg3-btn dg3-btn-secondary" id="dg3-descartar">Descartar</button>
                </div>
            </div>

            <!-- Campos ocultos para guardar -->
            <input type="hidden" name="dg3[es_unico]" id="dg3_es_unico" value="<?php echo esc_attr($ficha['es_unico'] ?? ''); ?>">
            <input type="hidden" name="dg3[tipo_tamano]" id="dg3_tipo_tamano" value="<?php echo esc_attr($ficha['tipo_tamano'] ?? ''); ?>">
        </div>

        <script>
        jQuery(document).ready(function($) {
            var postId = <?php echo $post->ID; ?>;
            var ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>';
            var nonce = '<?php echo wp_create_nonce('dg3_nonce'); ?>';
            var datosGenerados = null;

            function mostrarStatus(tipo, texto) {
                $('#dg3-status').attr('class', 'dg3-status ' + tipo).html(texto).show();
            }

            function recogerDatos() {
                return {
                    tamano_cm: $('#dg3_tamano').val(),
                    genero: $('#dg3_genero').val(),
                    categoria: $('#dg3_categoria').val(),
                    especie: $('#dg3_especie').val(),
                    accesorios: $('#dg3_accesorios').val(),
                    es_unico: $('#dg3_es_unico').val(),
                    tipo_historia: $('#dg3_tipo_historia').val(),
                    notas: $('#dg3_notas').val()
                };
            }

            // Inferir tipo tamaño y unicidad
            $('#dg3_tamano').on('change', function() {
                var cm = parseInt($(this).val()) || 0;
                var especie = $('#dg3_especie').val();
                var tipo = 'mediano';
                var unico = 'unico';

                if (cm <= 12) { tipo = 'mini'; unico = 'recreable'; }
                else if (cm <= 14) { tipo = 'mini_especial'; unico = 'recreable'; }
                else if (cm <= 20) { tipo = 'mediano'; }
                else if (cm <= 25) { tipo = 'mediano_especial'; }
                else if (cm <= 30) { tipo = 'grande'; }
                else { tipo = 'gigante'; }

                if (especie === 'pixie') unico = 'unico';

                $('#dg3_tipo_tamano').val(tipo);
                $('#dg3_es_unico').val(unico);
            });

            // GENERAR TODO
            $('#dg3-generar').click(function() {
                var btn = $(this);
                var datos = recogerDatos();

                if (!datos.tamano_cm) {
                    mostrarStatus('error', '❌ Ingresá el tamaño en cm');
                    return;
                }

                btn.prop('disabled', true).text('Analizando foto y generando...');
                mostrarStatus('loading', '⏳ Analizando la foto del guardián y generando todo... (puede tardar 30-60 segundos)');

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'dg3_generar_todo',
                        post_id: postId,
                        nonce: nonce,
                        datos: datos,
                        indicaciones: ''
                    },
                    timeout: 120000,
                    success: function(r) {
                        if (r.success && r.data) {
                            datosGenerados = r.data;

                            // Mostrar previews
                            $('#dg3-historia-preview').html(r.data.historia.replace(/\n/g, '<br>'));
                            $('#dg3-mensaje-preview').html('"' + r.data.mensaje + '"');

                            var fichaHtml = '<ul style="margin:0;padding-left:20px;">';
                            if (r.data.ficha.flor_favorita) fichaHtml += '<li><b>Flor:</b> ' + r.data.ficha.flor_favorita + '</li>';
                            if (r.data.ficha.piedra_favorita) fichaHtml += '<li><b>Cristal:</b> ' + r.data.ficha.piedra_favorita + '</li>';
                            if (r.data.ficha.color_favorito) fichaHtml += '<li><b>Color:</b> ' + r.data.ficha.color_favorito + '</li>';
                            if (r.data.ficha.elemento) fichaHtml += '<li><b>Elemento:</b> ' + r.data.ficha.elemento + '</li>';
                            if (r.data.ficha.espacio_casa) fichaHtml += '<li><b>Espacio:</b> ' + r.data.ficha.espacio_casa + '</li>';
                            if (r.data.ficha.frase_lema) fichaHtml += '<li><b>Lema:</b> "' + r.data.ficha.frase_lema + '"</li>';
                            if (r.data.ficha.dato_curioso) fichaHtml += '<li><b>Dato curioso:</b> ' + r.data.ficha.dato_curioso + '</li>';
                            fichaHtml += '</ul>';
                            $('#dg3-ficha-preview').html(fichaHtml);

                            $('#dg3-preview').show();
                            mostrarStatus('success', '✅ Generado correctamente. Revisá y guardá.');
                        } else {
                            mostrarStatus('error', '❌ ' + (r.data?.error || 'Error desconocido'));
                        }
                        btn.prop('disabled', false).text('✨ GENERAR TODO');
                    },
                    error: function(xhr, status, error) {
                        mostrarStatus('error', '❌ Error de conexión: ' + error);
                        btn.prop('disabled', false).text('✨ GENERAR TODO');
                    }
                });
            });

            // Toggle regenerar
            $('#dg3-regenerar-btn').click(function() {
                $('#dg3-regenerar-panel').slideToggle();
            });

            // Regenerar con indicaciones
            $('#dg3-regenerar-ejecutar').click(function() {
                var btn = $(this);
                var datos = recogerDatos();
                var indicaciones = $('#dg3-indicaciones').val();

                btn.prop('disabled', true).text('Regenerando...');
                mostrarStatus('loading', '⏳ Regenerando con tus indicaciones...');

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'dg3_generar_todo',
                        post_id: postId,
                        nonce: nonce,
                        datos: datos,
                        indicaciones: indicaciones
                    },
                    timeout: 120000,
                    success: function(r) {
                        if (r.success && r.data) {
                            datosGenerados = r.data;
                            $('#dg3-historia-preview').html(r.data.historia.replace(/\n/g, '<br>'));
                            $('#dg3-mensaje-preview').html('"' + r.data.mensaje + '"');

                            var fichaHtml = '<ul style="margin:0;padding-left:20px;">';
                            if (r.data.ficha.flor_favorita) fichaHtml += '<li><b>Flor:</b> ' + r.data.ficha.flor_favorita + '</li>';
                            if (r.data.ficha.piedra_favorita) fichaHtml += '<li><b>Cristal:</b> ' + r.data.ficha.piedra_favorita + '</li>';
                            if (r.data.ficha.color_favorito) fichaHtml += '<li><b>Color:</b> ' + r.data.ficha.color_favorito + '</li>';
                            if (r.data.ficha.elemento) fichaHtml += '<li><b>Elemento:</b> ' + r.data.ficha.elemento + '</li>';
                            if (r.data.ficha.frase_lema) fichaHtml += '<li><b>Lema:</b> "' + r.data.ficha.frase_lema + '"</li>';
                            fichaHtml += '</ul>';
                            $('#dg3-ficha-preview').html(fichaHtml);

                            $('#dg3-preview').show();
                            mostrarStatus('success', '✅ Regenerado. Revisá y guardá.');
                        } else {
                            mostrarStatus('error', '❌ ' + (r.data?.error || 'Error'));
                        }
                        btn.prop('disabled', false).text('✨ Regenerar con indicaciones');
                    },
                    error: function() {
                        mostrarStatus('error', '❌ Error de conexión');
                        btn.prop('disabled', false).text('✨ Regenerar con indicaciones');
                    }
                });
            });

            // Guardar todo
            $('#dg3-guardar').click(function() {
                if (!datosGenerados) return;

                var btn = $(this);
                btn.prop('disabled', true).text('Guardando...');

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'dg3_guardar_todo',
                        post_id: postId,
                        nonce: nonce,
                        historia: datosGenerados.historia,
                        mensaje: datosGenerados.mensaje,
                        ficha: datosGenerados.ficha,
                        datos_basicos: recogerDatos()
                    },
                    success: function(r) {
                        if (r.success) {
                            mostrarStatus('success', '✅ ¡Todo guardado! Recargando...');
                            setTimeout(function() { location.reload(); }, 1500);
                        } else {
                            mostrarStatus('error', '❌ Error al guardar');
                            btn.prop('disabled', false).text('💾 Guardar Todo');
                        }
                    }
                });
            });

            // Descartar
            $('#dg3-descartar').click(function() {
                datosGenerados = null;
                $('#dg3-preview').hide();
                $('#dg3-status').hide();
            });
        });
        </script>
        <?php
    }

    // ═══════════════════════════════════════════════════════════════
    // AJAX: GENERAR TODO
    // ═══════════════════════════════════════════════════════════════

    public function ajax_generar_todo() {
        check_ajax_referer('dg3_nonce', 'nonce');

        $post_id = intval($_POST['post_id']);
        $datos = $_POST['datos'];
        $indicaciones = sanitize_textarea_field($_POST['indicaciones'] ?? '');

        $producto = wc_get_product($post_id);
        if (!$producto) {
            wp_send_json_error(['error' => 'Producto no encontrado']);
        }

        $nombre = $producto->get_name();
        $imagen_id = $producto->get_image_id();

        if (!$imagen_id) {
            wp_send_json_error(['error' => 'El producto no tiene foto. Subí una imagen primero.']);
        }

        // Obtener URL de imagen para análisis
        $imagen_url = wp_get_attachment_image_url($imagen_id, 'large');
        $imagen_path = get_attached_file($imagen_id);

        // Convertir imagen a base64
        $imagen_base64 = '';
        $imagen_tipo = '';
        if ($imagen_path && file_exists($imagen_path)) {
            $imagen_data = file_get_contents($imagen_path);
            $imagen_base64 = base64_encode($imagen_data);
            $imagen_tipo = wp_check_filetype($imagen_path)['type'] ?: 'image/jpeg';
        }

        if (empty($imagen_base64)) {
            wp_send_json_error(['error' => 'No se pudo leer la imagen']);
        }

        // Generar con Anthropic
        $resultado = $this->generar_con_vision($nombre, $datos, $imagen_base64, $imagen_tipo, $indicaciones);

        if ($resultado) {
            wp_send_json_success($resultado);
        } else {
            wp_send_json_error(['error' => 'Error generando contenido con IA']);
        }
    }

    private function generar_con_vision($nombre, $datos, $imagen_base64, $imagen_tipo, $indicaciones = '') {
        $api_key = $this->get_api_key();
        if (empty($api_key)) {
            return null;
        }

        $tamano = $datos['tamano_cm'] ?? '';
        $genero = $datos['genero'] ?? 'M';
        $categoria = $datos['categoria'] ?? 'proteccion';
        $especie = $datos['especie'] ?? 'duende';
        $accesorios = $datos['accesorios'] ?? '';
        $es_unico = $datos['es_unico'] ?? 'unico';
        $tipo_historia = $datos['tipo_historia'] ?? 'A';
        $notas = $datos['notas'] ?? '';

        $genero_texto = $genero === 'F' ? 'Femenino' : 'Masculino';

        // Estructuras narrativas (formatos A-H)
        $tipos_historia = [
            'A' => 'ESTRUCTURA A - CLÁSICA CON SECCIONES: 1)Presentación, 2)Backstory/origen, 3)Sincrodestino, 4)Gustos y "no tolera", 5)Especialidad, 6)Para quién es, 7)Mensaje canalizado, 8)Cierre. Con títulos marcados para cada sección.',
            'B' => 'ESTRUCTURA B - NARRATIVA FLUIDA: Sin títulos ni secciones marcadas. Todo fluye como una historia continua, entrelazando presentación, origen, sincrodestino y mensaje de forma natural.',
            'C' => 'ESTRUCTURA C - EMPIEZA POR EL MENSAJE: Arranca directamente con el mensaje canalizado del guardián (lo que vino a decir), luego cuenta quién es y de dónde viene.',
            'D' => 'ESTRUCTURA D - EMPIEZA POR EL SINCRODESTINO: Abre con la señal mágica que ocurrió durante su creación, luego presenta al guardián y desarrolla la historia.',
            'E' => 'ESTRUCTURA E - FORMATO CARTA/DIARIO: Escrito como una carta personal o entrada de diario. Más íntimo, como si el guardián le escribiera directamente al lector.',
            'F' => 'ESTRUCTURA F - ENTREVISTA AL GUARDIÁN: Formato pregunta-respuesta, como si alguien le hiciera preguntas al guardián y él respondiera. Dinámico y revelador.',
            'G' => 'ESTRUCTURA G - CONTADA POR EL GUARDIÁN: El guardián mismo narra su historia en primera persona. "Yo soy...", "Vine porque...", "Mi historia empezó...".',
            'H' => 'ESTRUCTURA H - SEGUNDA PERSONA (VOS): Toda la historia dirigida directamente al lector. "Vos sabés lo que es...", "Cuando me viste...", "Te elegí porque...".'
        ];
        $estilo_historia = $tipos_historia[$tipo_historia] ?? $tipos_historia['A'];

        $categorias_nombres = [
            'proteccion' => 'Protección', 'abundancia' => 'Abundancia', 'amor' => 'Amor',
            'sanacion' => 'Sanación', 'salud' => 'Salud', 'sabiduria' => 'Sabiduría',
            'conexion_espiritual' => 'Conexión Espiritual', 'transformacion' => 'Transformación'
        ];
        $categoria_nombre = $categorias_nombres[$categoria] ?? $categoria;

        // Determinar edad según especie y tipo
        $edad_min = 150; $edad_max = 800;
        if ($especie === 'pixie') { $edad_min = 100; $edad_max = 400; }
        elseif (in_array($especie, ['elfo', 'merlin', 'morgana', 'druida'])) { $edad_min = 500; $edad_max = 2000; }
        elseif (intval($tamano) > 25) { $edad_min = 400; $edad_max = 1500; }

        $edad_sugerida = rand($edad_min, $edad_max);

        $prompt = "Vas a escribir la historia de un guardián místico. Cada historia debe ser ÚNICA - como Las Mil y Una Noches, ninguna se parece a otra.

ESTE GUARDIÁN:
- Nombre: {$nombre}
- Tamaño: {$tamano} cm | Género: {$genero_texto}
- Poder principal: {$categoria_nombre}
- Especie: {$especie}
- Accesorios visibles: " . ($accesorios ?: 'Los que veas en la imagen') . "
- Tipo: " . ($es_unico === 'unico' ? 'Ser único, irrepetible' : 'Puede recrearse') . "
" . ($notas ? "- Nota: {$notas}\n" : "") . "
" . ($indicaciones ? "- Indicación especial: {$indicaciones}\n" : "") . "

ESTRUCTURA ELEGIDA: {$estilo_historia}

FORMATO OBLIGATORIO:
- PROSA PURA. Sin títulos, sin secciones, sin asteriscos, sin markdown.
- La historia fluye como un texto corrido, como lo leerías en un libro.
- PROHIBIDO: **Presentación**, **Origen**, **Sincrodestino**, o cualquier título/encabezado.
- PROHIBIDO: asteriscos, negritas, cursivas, guiones como lista.
- Solo párrafos de texto limpio que se lean naturalmente.

LO QUE HACE UNA HISTORIA MEMORABLE:
- NO ubicar geográficamente. Son seres energéticos, no necesitan mapa.
- NO clichés de IA: \"tiempos inmemoriales\", \"brumas\", \"velo entre mundos\", \"energía poderosa\"
- NO empezar siempre igual. Sorprendé.
- SÍ contar algo que haga decir \"este guardián ES para mí\"
- SÍ ser específico sobre qué HACE por quien lo adopta
- SÍ incluir un sincrodestino creíble (algo real: un pájaro, lluvia, algo que se cayó)
- Mensaje del guardián: como un amigo sabio, no un gurú

VARIÁ TODO:
- La apertura (pregunta, afirmación, escena, reflexión, diálogo)
- El tono (íntimo, misterioso, directo, tierno, desafiante)
- Lo que contás (origen, propósito, anécdota, promesa, advertencia)
- La extensión de cada parte

Historia: ~200-300 palabras, que atrape.
Mensaje: 2-3 oraciones que lleguen al corazón.

FORMATO DE RESPUESTA (JSON exacto):
{
  \"historia\": \"[Historia completa aquí]\",
  \"mensaje\": \"[Mensaje del guardián en primera persona]\",
  \"ficha\": {
    \"flor_favorita\": \"...\",
    \"piedra_favorita\": \"...\",
    \"color_favorito\": \"...\",
    \"espacio_casa\": \"...\",
    \"elemento\": \"Fuego|Agua|Tierra|Aire|Éter\",
    \"estacion\": \"Primavera|Verano|Otoño|Invierno\",
    \"momento_dia\": \"...\",
    \"le_gusta_pasear\": \"si|no|preguntar\",
    \"le_gusta\": \"3 cosas separadas por coma\",
    \"no_le_gusta\": \"3 cosas separadas por coma\",
    \"frase_lema\": \"...\",
    \"dato_curioso\": \"algo que haga decir 'ayyy es como yo'\"
  },
  \"analisis_imagen\": \"[Breve descripción de lo que viste en la imagen]\"
}

Respondé SOLO con el JSON.";

        $response = wp_remote_post('https://api.anthropic.com/v1/messages', [
            'timeout' => 120,
            'headers' => [
                'Content-Type' => 'application/json',
                'x-api-key' => $api_key,
                'anthropic-version' => '2023-06-01'
            ],
            'body' => json_encode([
                'model' => 'claude-sonnet-4-20250514',
                'max_tokens' => 4000,
                'messages' => [[
                    'role' => 'user',
                    'content' => [
                        [
                            'type' => 'image',
                            'source' => [
                                'type' => 'base64',
                                'media_type' => $imagen_tipo,
                                'data' => $imagen_base64
                            ]
                        ],
                        [
                            'type' => 'text',
                            'text' => $prompt
                        ]
                    ]
                ]]
            ])
        ]);

        if (is_wp_error($response)) {
            error_log('[DG3] Error API: ' . $response->get_error_message());
            return null;
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);

        if (!isset($body['content'][0]['text'])) {
            error_log('[DG3] Respuesta inesperada: ' . print_r($body, true));
            return null;
        }

        $texto = $body['content'][0]['text'];

        // Extraer JSON
        if (preg_match('/\{[\s\S]*\}/', $texto, $matches)) {
            $resultado = json_decode($matches[0], true);
            if ($resultado && isset($resultado['historia']) && isset($resultado['ficha'])) {
                return $resultado;
            }
        }

        error_log('[DG3] No se pudo parsear JSON: ' . $texto);
        return null;
    }

    // ═══════════════════════════════════════════════════════════════
    // AJAX: GUARDAR TODO
    // ═══════════════════════════════════════════════════════════════

    public function ajax_guardar_todo() {
        check_ajax_referer('dg3_nonce', 'nonce');

        $post_id = intval($_POST['post_id']);
        $historia = wp_kses_post($_POST['historia']);
        $mensaje = sanitize_textarea_field($_POST['mensaje']);
        $ficha = $_POST['ficha'];
        $datos_basicos = $_POST['datos_basicos'];

        // Guardar historia como descripción
        wp_update_post([
            'ID' => $post_id,
            'post_content' => $historia
        ]);

        // Construir ficha completa
        $ficha_completa = [
            'genero' => strtoupper(sanitize_text_field($datos_basicos['genero'] ?? 'M')),
            'especie' => sanitize_text_field($datos_basicos['especie'] ?? 'duende'),
            'categoria' => sanitize_text_field($datos_basicos['categoria'] ?? 'proteccion'),
            'tamano_cm' => intval($datos_basicos['tamano_cm'] ?? 0),
            'accesorios' => sanitize_text_field($datos_basicos['accesorios'] ?? ''),
            'mensaje_guardian' => $mensaje,
            // Campos de la ficha IA
            'flor_favorita' => sanitize_text_field($ficha['flor_favorita'] ?? ''),
            'piedra_favorita' => sanitize_text_field($ficha['piedra_favorita'] ?? ''),
            'color_favorito' => sanitize_text_field($ficha['color_favorito'] ?? ''),
            'espacio_casa' => sanitize_text_field($ficha['espacio_casa'] ?? ''),
            'elemento' => sanitize_text_field($ficha['elemento'] ?? ''),
            'estacion' => sanitize_text_field($ficha['estacion'] ?? ''),
            'momento_dia' => sanitize_text_field($ficha['momento_dia'] ?? ''),
            'le_gusta_pasear' => sanitize_text_field($ficha['le_gusta_pasear'] ?? ''),
            'le_gusta' => sanitize_text_field($ficha['le_gusta'] ?? ''),
            'no_le_gusta' => sanitize_text_field($ficha['no_le_gusta'] ?? ''),
            'frase_lema' => sanitize_text_field($ficha['frase_lema'] ?? ''),
            'dato_curioso' => sanitize_text_field($ficha['dato_curioso'] ?? ''),
        ];

        // Inferir tipo_tamano y es_unico
        $cm = $ficha_completa['tamano_cm'];
        if ($cm <= 12) { $ficha_completa['tipo_tamano'] = 'mini'; $ficha_completa['es_unico'] = 'recreable'; }
        elseif ($cm <= 14) { $ficha_completa['tipo_tamano'] = 'mini_especial'; $ficha_completa['es_unico'] = 'recreable'; }
        elseif ($cm <= 20) { $ficha_completa['tipo_tamano'] = 'mediano'; $ficha_completa['es_unico'] = 'unico'; }
        elseif ($cm <= 25) { $ficha_completa['tipo_tamano'] = 'mediano_especial'; $ficha_completa['es_unico'] = 'unico'; }
        elseif ($cm <= 30) { $ficha_completa['tipo_tamano'] = 'grande'; $ficha_completa['es_unico'] = 'unico'; }
        else { $ficha_completa['tipo_tamano'] = 'gigante'; $ficha_completa['es_unico'] = 'unico'; }

        // Pixies siempre únicas
        if ($ficha_completa['especie'] === 'pixie') {
            $ficha_completa['es_unico'] = 'unico';
        }

        update_post_meta($post_id, '_duendes_ficha', $ficha_completa);

        wp_send_json_success(['message' => 'Todo guardado']);
    }

    // ═══════════════════════════════════════════════════════════════
    // GUARDAR DATOS BÁSICOS AL GUARDAR PRODUCTO
    // ═══════════════════════════════════════════════════════════════

    public function guardar_datos($post_id) {
        if (!isset($_POST['dg3_nonce_field']) || !wp_verify_nonce($_POST['dg3_nonce_field'], 'dg3_nonce')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;

        if (isset($_POST['dg3'])) {
            $ficha_existente = get_post_meta($post_id, '_duendes_ficha', true) ?: [];

            foreach ($_POST['dg3'] as $key => $value) {
                if ($value !== '') {
                    $ficha_existente[$key] = sanitize_text_field($value);
                }
            }

            update_post_meta($post_id, '_duendes_ficha', $ficha_existente);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // FRONTEND
    // ═══════════════════════════════════════════════════════════════

    public function mostrar_subtitulo() {
        global $product;
        $ficha = get_post_meta($product->get_id(), '_duendes_ficha', true);
        if (!$ficha || empty($ficha['especie'])) return;

        $genero = $ficha['genero'] ?? 'M';
        $especie = $ficha['especie'] ?? 'duende';
        $categoria = $ficha['categoria'] ?? '';

        $especies_nombres = [
            'duende' => ['M' => 'GUARDIÁN', 'F' => 'GUARDIANA'],
            'pixie' => ['M' => 'PIXIE', 'F' => 'PIXIE'],
            'elfo' => ['M' => 'ELFO', 'F' => 'ELFA'],
            'bruja' => ['M' => 'BRUJO', 'F' => 'BRUJA'],
            'vikingo' => ['M' => 'VIKINGO', 'F' => 'VIKINGA'],
        ];

        $categorias_nombres = [
            'proteccion' => 'PROTECCIÓN', 'abundancia' => 'ABUNDANCIA', 'amor' => 'AMOR',
            'sanacion' => 'SANACIÓN', 'salud' => 'SALUD', 'sabiduria' => 'SABIDURÍA'
        ];

        $titulo = $especies_nombres[$especie][$genero] ?? strtoupper($especie);
        $cat_texto = $categorias_nombres[$categoria] ?? '';

        $subtitulo = $titulo;
        if ($cat_texto) $subtitulo .= ' · ' . $cat_texto;

        echo '<div style="color: #c9a962; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px; font-weight: 500;">' . esc_html($subtitulo) . '</div>';
    }

    public function agregar_tab_ficha($tabs) {
        global $product;
        $ficha = get_post_meta($product->get_id(), '_duendes_ficha', true);
        if (!$ficha || empty($ficha['flor_favorita'])) return $tabs;

        $tabs['ficha_guardian'] = [
            'title' => 'Ficha del Guardián',
            'priority' => 15,
            'callback' => [$this, 'render_tab_ficha']
        ];

        return $tabs;
    }

    public function render_tab_ficha() {
        global $product;
        $ficha = get_post_meta($product->get_id(), '_duendes_ficha', true);
        $nombre = $product->get_name();

        $tamano = $ficha['tamano_cm'] ?? '';
        $es_unico = $ficha['es_unico'] ?? 'unico';
        ?>
        <style>
            .dg3-ficha { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 12px; color: #fff; }
            .dg3-ficha-header { text-align: center; margin-bottom: 20px; }
            .dg3-ficha-header h3 { color: #c9a962; margin: 0 0 10px; font-size: 20px; }
            .dg3-ficha-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 11px; font-weight: bold; }
            .dg3-ficha-badge.unico { background: #c9a962; color: #1a1a2e; }
            .dg3-ficha-badge.recreable { background: #4a9962; color: #fff; }
            .dg3-ficha-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
            .dg3-ficha-item { background: rgba(255,255,255,0.05); padding: 12px 15px; border-radius: 8px; }
            .dg3-ficha-label { color: #c9a962; font-size: 10px; text-transform: uppercase; margin-bottom: 4px; }
            .dg3-ficha-value { color: #fff; font-size: 14px; }
            .dg3-ficha-lema { text-align: center; font-style: italic; font-size: 16px; color: #c9a962; margin: 20px 0; padding: 15px; }
            .dg3-ficha-mensaje { background: rgba(201,169,98,0.1); padding: 20px; border-radius: 10px; margin-top: 20px; border-left: 3px solid #c9a962; }
            .dg3-ficha-mensaje h4 { color: #c9a962; margin: 0 0 10px; font-size: 13px; }
            .dg3-ficha-mensaje p { font-style: italic; line-height: 1.7; margin: 0; }
        </style>

        <div class="dg3-ficha">
            <div class="dg3-ficha-header">
                <h3>Conocé a <?php echo esc_html($nombre); ?></h3>
                <span class="dg3-ficha-badge <?php echo $es_unico === 'unico' ? 'unico' : 'recreable'; ?>">
                    <?php echo $es_unico === 'unico' ? 'SER ÚNICO' : 'SER RECREABLE'; ?>
                </span>
            </div>

            <div class="dg3-ficha-grid">
                <?php if (!empty($ficha['flor_favorita'])): ?>
                <div class="dg3-ficha-item">
                    <div class="dg3-ficha-label">Flor Favorita</div>
                    <div class="dg3-ficha-value"><?php echo esc_html($ficha['flor_favorita']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['piedra_favorita'])): ?>
                <div class="dg3-ficha-item">
                    <div class="dg3-ficha-label">Cristal</div>
                    <div class="dg3-ficha-value"><?php echo esc_html($ficha['piedra_favorita']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['color_favorito'])): ?>
                <div class="dg3-ficha-item">
                    <div class="dg3-ficha-label">Color</div>
                    <div class="dg3-ficha-value"><?php echo esc_html($ficha['color_favorito']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['elemento'])): ?>
                <div class="dg3-ficha-item">
                    <div class="dg3-ficha-label">Elemento</div>
                    <div class="dg3-ficha-value"><?php echo esc_html($ficha['elemento']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['espacio_casa'])): ?>
                <div class="dg3-ficha-item">
                    <div class="dg3-ficha-label">Espacio de la Casa</div>
                    <div class="dg3-ficha-value"><?php echo esc_html($ficha['espacio_casa']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['estacion'])): ?>
                <div class="dg3-ficha-item">
                    <div class="dg3-ficha-label">Estación</div>
                    <div class="dg3-ficha-value"><?php echo esc_html($ficha['estacion']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['momento_dia'])): ?>
                <div class="dg3-ficha-item">
                    <div class="dg3-ficha-label">Momento del Día</div>
                    <div class="dg3-ficha-value"><?php echo esc_html($ficha['momento_dia']); ?></div>
                </div>
                <?php endif; ?>

                <?php
                $paseos = ['si' => 'Sí, le encanta', 'no' => 'Prefiere quedarse', 'preguntar' => 'Que le pregunte'];
                if (!empty($ficha['le_gusta_pasear']) && isset($paseos[$ficha['le_gusta_pasear']])): ?>
                <div class="dg3-ficha-item">
                    <div class="dg3-ficha-label">¿Le gusta pasear?</div>
                    <div class="dg3-ficha-value"><?php echo esc_html($paseos[$ficha['le_gusta_pasear']]); ?></div>
                </div>
                <?php endif; ?>
            </div>

            <?php if (!empty($ficha['le_gusta'])): ?>
            <div class="dg3-ficha-item" style="margin-top: 15px;">
                <div class="dg3-ficha-label">Lo que le gusta</div>
                <div class="dg3-ficha-value"><?php echo esc_html($ficha['le_gusta']); ?></div>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['no_le_gusta'])): ?>
            <div class="dg3-ficha-item" style="margin-top: 10px;">
                <div class="dg3-ficha-label">Lo que no le gusta</div>
                <div class="dg3-ficha-value"><?php echo esc_html($ficha['no_le_gusta']); ?></div>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['frase_lema'])): ?>
            <div class="dg3-ficha-lema">"<?php echo esc_html($ficha['frase_lema']); ?>"</div>
            <?php endif; ?>

            <?php if (!empty($ficha['dato_curioso'])): ?>
            <div class="dg3-ficha-item" style="margin-top: 10px;">
                <div class="dg3-ficha-label">✨ Dato curioso</div>
                <div class="dg3-ficha-value"><?php echo esc_html($ficha['dato_curioso']); ?></div>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['mensaje_guardian'])): ?>
            <div class="dg3-ficha-mensaje">
                <h4>💬 Mensaje de <?php echo esc_html($nombre); ?></h4>
                <p>"<?php echo esc_html($ficha['mensaje_guardian']); ?>"</p>
            </div>
            <?php endif; ?>
        </div>
        <?php
    }
}

new DuendesGeneradorV3();
