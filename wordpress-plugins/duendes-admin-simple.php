<?php
/**
 * Plugin Name: Duendes Admin Simple
 * Description: UN SOLO panel para crear guardianes con TODO generado por IA
 * Version: 3.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// METABOX SIMPLIFICADO - Solo lo esencial + botón mágico
// ═══════════════════════════════════════════════════════════════════════════

add_action('add_meta_boxes', function() {
    // Quitar otros metaboxes de duendes que puedan existir
    remove_meta_box('duendes_guardian_metabox', 'product', 'normal');
    remove_meta_box('duendes_ficha_guardian', 'product', 'normal');
    remove_meta_box('duendes_historia_ia', 'product', 'side');

    add_meta_box(
        'duendes_simple',
        '🪄 Crear Guardián Mágico',
        'duendes_simple_metabox_html',
        'product',
        'normal',
        'high'
    );
});

function duendes_simple_metabox_html($post) {
    wp_nonce_field('duendes_simple_save', 'duendes_simple_nonce');

    // Obtener datos existentes
    $tipo = get_post_meta($post->ID, '_duendes_tipo', true) ?: '';
    $genero = get_post_meta($post->ID, '_duendes_genero', true) ?: 'masculino';
    $altura = get_post_meta($post->ID, '_duendes_altura', true) ?: '';
    $color_ojos = get_post_meta($post->ID, '_duendes_color_ojos', true) ?: '';
    $accesorios = get_post_meta($post->ID, '_duendes_accesorios', true) ?: '';
    $elemento = get_post_meta($post->ID, '_duendes_elemento', true) ?: '';
    $proposito = get_post_meta($post->ID, '_duendes_proposito', true) ?: '';
    $precio_uyu = get_post_meta($post->ID, '_duendes_precio_uyu', true) ?: '';
    $contenido_generado = get_post_meta($post->ID, '_duendes_contenido_generado', true);
    ?>
    <style>
        #duendes_simple .inside { padding: 0 !important; margin: 0 !important; }

        .ds-container {
            background: linear-gradient(180deg, #0f0f0f 0%, #1a1510 100%);
            color: #e6edf3;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 0;
        }

        .ds-header {
            background: linear-gradient(135deg, #1B4D3E 0%, #0d2d24 100%);
            padding: 25px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #C6A962;
        }

        .ds-header h2 {
            margin: 0;
            color: #C6A962;
            font-family: 'Cinzel', serif;
            font-size: 22px;
        }

        .ds-header p {
            margin: 5px 0 0 0;
            color: rgba(255,255,255,0.6);
            font-size: 13px;
        }

        .ds-btn-magic {
            padding: 15px 30px;
            background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
            border: none;
            border-radius: 10px;
            color: #000;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ds-btn-magic:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(198,169,98,0.4);
        }

        .ds-btn-magic:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .ds-body {
            padding: 30px;
        }

        .ds-section {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(198,169,98,0.2);
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
        }

        .ds-section-title {
            color: #C6A962;
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(198,169,98,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ds-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .ds-field label {
            display: block;
            color: rgba(255,255,255,0.6);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .ds-input, .ds-select {
            width: 100%;
            padding: 12px 15px;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(198,169,98,0.3);
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
        }

        .ds-input:focus, .ds-select:focus {
            outline: none;
            border-color: #C6A962;
        }

        .ds-input::placeholder {
            color: rgba(255,255,255,0.3);
        }

        .ds-textarea {
            width: 100%;
            min-height: 80px;
            padding: 12px 15px;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(198,169,98,0.3);
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            resize: vertical;
        }

        .ds-precio-box {
            background: linear-gradient(135deg, rgba(198,169,98,0.1), rgba(198,169,98,0.05));
            border: 2px solid #C6A962;
            border-radius: 12px;
            padding: 25px;
            text-align: center;
        }

        .ds-precio-label {
            color: #C6A962;
            font-size: 14px;
            margin-bottom: 10px;
        }

        .ds-precio-input {
            font-size: 36px;
            font-weight: 700;
            text-align: center;
            background: transparent;
            border: none;
            color: #fff;
            width: 100%;
        }

        .ds-precio-input:focus { outline: none; }

        .ds-conversion {
            color: rgba(255,255,255,0.5);
            font-size: 13px;
            margin-top: 10px;
        }

        /* Estado de generación */
        .ds-status {
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 25px;
            display: none;
        }

        .ds-status.loading {
            display: block;
            background: rgba(198,169,98,0.1);
            border: 1px solid rgba(198,169,98,0.3);
            color: #C6A962;
        }

        .ds-status.success {
            display: block;
            background: rgba(34,197,94,0.1);
            border: 1px solid rgba(34,197,94,0.3);
            color: #22c55e;
        }

        .ds-status.error {
            display: block;
            background: rgba(239,68,68,0.1);
            border: 1px solid rgba(239,68,68,0.3);
            color: #ef4444;
        }

        /* Preview de contenido generado */
        .ds-preview {
            background: rgba(0,0,0,0.2);
            border: 1px solid rgba(198,169,98,0.2);
            border-radius: 12px;
            padding: 25px;
            margin-top: 25px;
            display: none;
        }

        .ds-preview.visible {
            display: block;
        }

        .ds-preview-title {
            color: #C6A962;
            font-size: 18px;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .ds-preview-section {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .ds-preview-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .ds-preview-section h4 {
            color: #C6A962;
            font-size: 14px;
            margin: 0 0 10px 0;
        }

        .ds-preview-section p {
            color: rgba(255,255,255,0.8);
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
        }

        /* Spinner */
        .ds-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(198,169,98,0.3);
            border-radius: 50%;
            border-top-color: #C6A962;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Chips para elementos/propósitos */
        .ds-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .ds-chip {
            padding: 10px 18px;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(198,169,98,0.3);
            border-radius: 25px;
            color: rgba(255,255,255,0.7);
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .ds-chip:hover {
            border-color: #C6A962;
            color: #C6A962;
        }

        .ds-chip.active {
            background: rgba(198,169,98,0.2);
            border-color: #C6A962;
            color: #C6A962;
        }

        /* Info box */
        .ds-info {
            background: rgba(59,130,246,0.1);
            border: 1px solid rgba(59,130,246,0.3);
            border-radius: 8px;
            padding: 15px;
            color: #60a5fa;
            font-size: 13px;
            margin-top: 15px;
        }

        @media (max-width: 782px) {
            .ds-header {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
            .ds-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>

    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap" rel="stylesheet">

    <div class="ds-container">
        <div class="ds-header">
            <div>
                <h2>Crear Guardián Mágico</h2>
                <p>Completá los datos básicos y la IA genera TODO automáticamente</p>
            </div>
            <button type="button" class="ds-btn-magic" onclick="duendesGenerarTodo()" id="ds-btn-generar">
                <span>🪄</span>
                <span id="ds-btn-texto">Generar Todo con IA</span>
            </button>
        </div>

        <div class="ds-body">
            <!-- Estado de generación -->
            <div class="ds-status" id="ds-status"></div>

            <!-- DATOS DEL GUARDIÁN -->
            <div class="ds-section">
                <h3 class="ds-section-title">✨ Datos del Guardián</h3>

                <div class="ds-grid">
                    <div class="ds-field">
                        <label>Tipo de Ser *</label>
                        <select name="_duendes_tipo" id="ds-tipo" class="ds-select" required>
                            <option value="">Seleccionar...</option>
                            <option value="Duende" <?php selected($tipo, 'Duende'); ?>>🧝 Duende</option>
                            <option value="Bruja" <?php selected($tipo, 'Bruja'); ?>>🧙‍♀️ Bruja</option>
                            <option value="Brujo" <?php selected($tipo, 'Brujo'); ?>>🧙 Brujo</option>
                            <option value="Mago" <?php selected($tipo, 'Mago'); ?>>🪄 Mago</option>
                            <option value="Hada" <?php selected($tipo, 'Hada'); ?>>✨ Hada</option>
                            <option value="Elfo" <?php selected($tipo, 'Elfo'); ?>>🧚 Elfo</option>
                            <option value="Gnomo" <?php selected($tipo, 'Gnomo'); ?>>🍄 Gnomo</option>
                            <option value="Chamán" <?php selected($tipo, 'Chamán'); ?>>🌿 Chamán</option>
                            <option value="Oráculo" <?php selected($tipo, 'Oráculo'); ?>>🔮 Oráculo</option>
                        </select>
                    </div>

                    <div class="ds-field">
                        <label>Género</label>
                        <select name="_duendes_genero" id="ds-genero" class="ds-select">
                            <option value="masculino" <?php selected($genero, 'masculino'); ?>>♂️ Masculino</option>
                            <option value="femenino" <?php selected($genero, 'femenino'); ?>>♀️ Femenino</option>
                            <option value="neutro" <?php selected($genero, 'neutro'); ?>>⚪ Neutro</option>
                        </select>
                    </div>

                    <div class="ds-field">
                        <label>Altura (cm)</label>
                        <input type="number" name="_duendes_altura" id="ds-altura" class="ds-input"
                               value="<?php echo esc_attr($altura); ?>" placeholder="25">
                    </div>

                    <div class="ds-field">
                        <label>Color de Ojos</label>
                        <input type="text" name="_duendes_color_ojos" id="ds-ojos" class="ds-input"
                               value="<?php echo esc_attr($color_ojos); ?>" placeholder="Verde esmeralda, Ámbar...">
                    </div>
                </div>

                <div class="ds-field" style="margin-top: 20px;">
                    <label>Accesorios / Elementos que lleva</label>
                    <textarea name="_duendes_accesorios" id="ds-accesorios" class="ds-textarea"
                              placeholder="Ej: Calabaza, escoba, rosas blancas, trébol de cuarzo verde, báculo de madera..."><?php echo esc_textarea($accesorios); ?></textarea>
                </div>
            </div>

            <!-- ELEMENTO Y PROPÓSITO (opcionales - IA decide si no se eligen) -->
            <div class="ds-section">
                <h3 class="ds-section-title">🔮 Elemento y Propósito (opcional)</h3>
                <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin-bottom: 20px;">
                    Si no elegís, la IA decidirá basándose en las características del guardián
                </p>

                <div class="ds-field">
                    <label>Elemento</label>
                    <div class="ds-chips" id="ds-elementos">
                        <?php
                        $elementos = ['Tierra', 'Agua', 'Fuego', 'Aire', 'Éter'];
                        foreach ($elementos as $el):
                        ?>
                        <div class="ds-chip <?php echo $elemento == $el ? 'active' : ''; ?>"
                             data-value="<?php echo $el; ?>" onclick="seleccionarChip(this, 'ds-elemento')">
                            <?php echo $el; ?>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <input type="hidden" name="_duendes_elemento" id="ds-elemento" value="<?php echo esc_attr($elemento); ?>">
                </div>

                <div class="ds-field" style="margin-top: 20px;">
                    <label>Propósito Principal</label>
                    <div class="ds-chips" id="ds-propositos">
                        <?php
                        $propositos_list = ['Protección', 'Abundancia', 'Amor', 'Sanación', 'Sabiduría'];
                        foreach ($propositos_list as $prop):
                        ?>
                        <div class="ds-chip <?php echo $proposito == $prop ? 'active' : ''; ?>"
                             data-value="<?php echo $prop; ?>" onclick="seleccionarChip(this, 'ds-proposito')">
                            <?php echo $prop; ?>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <input type="hidden" name="_duendes_proposito" id="ds-proposito" value="<?php echo esc_attr($proposito); ?>">
                </div>
            </div>

            <!-- PRECIO -->
            <div class="ds-section">
                <h3 class="ds-section-title">💰 Precio</h3>

                <div class="ds-precio-box">
                    <div class="ds-precio-label">Precio en Pesos Uruguayos (UYU)</div>
                    <input type="number" name="_duendes_precio_uyu" id="ds-precio-uyu" class="ds-precio-input"
                           value="<?php echo esc_attr($precio_uyu); ?>" placeholder="8000" oninput="calcularConversiones()">
                    <div class="ds-conversion" id="ds-conversiones">
                        <!-- Se llena con JS -->
                    </div>
                </div>

                <div class="ds-info">
                    💡 Este precio se muestra a visitantes de Uruguay. El resto del mundo ve el precio en USD de WooCommerce.
                </div>
            </div>

            <!-- PREVIEW DEL CONTENIDO GENERADO -->
            <div class="ds-preview <?php echo $contenido_generado ? 'visible' : ''; ?>" id="ds-preview">
                <div class="ds-preview-title">✅ Contenido Generado</div>
                <div id="ds-preview-content">
                    <?php if ($contenido_generado): ?>
                        <?php echo duendes_mostrar_preview($contenido_generado); ?>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Campo oculto para guardar el contenido generado -->
            <input type="hidden" name="_duendes_contenido_generado" id="ds-contenido-json"
                   value="<?php echo esc_attr($contenido_generado ? json_encode($contenido_generado) : ''); ?>">
        </div>
    </div>

    <script>
    function seleccionarChip(chip, inputId) {
        // Quitar active de hermanos
        chip.parentElement.querySelectorAll('.ds-chip').forEach(c => c.classList.remove('active'));
        // Agregar active al clickeado
        chip.classList.add('active');
        // Actualizar input
        document.getElementById(inputId).value = chip.dataset.value;
    }

    function calcularConversiones() {
        const uyu = document.getElementById('ds-precio-uyu').value;
        const container = document.getElementById('ds-conversiones');
        if (!uyu) { container.innerHTML = ''; return; }

        const usd = parseFloat(uyu) / 43;
        container.innerHTML = `≈ $${usd.toFixed(0)} USD · $${Math.round(usd * 1050).toLocaleString()} ARS · R$${(usd * 5.2).toFixed(0)} BRL`;
    }

    async function duendesGenerarTodo() {
        const btn = document.getElementById('ds-btn-generar');
        const btnTexto = document.getElementById('ds-btn-texto');
        const status = document.getElementById('ds-status');
        const preview = document.getElementById('ds-preview');
        const previewContent = document.getElementById('ds-preview-content');

        // Obtener nombre del producto
        const nombre = document.getElementById('title')?.value;
        if (!nombre) {
            alert('Por favor, primero poné un nombre al producto');
            return;
        }

        // Obtener datos
        const datos = {
            nombre: nombre,
            tipo: document.getElementById('ds-tipo').value || 'Guardián',
            genero: document.getElementById('ds-genero').value || 'masculino',
            altura: document.getElementById('ds-altura').value || '25',
            colorOjos: document.getElementById('ds-ojos').value || 'no especificado',
            accesorios: document.getElementById('ds-accesorios').value || 'ninguno',
            elemento: document.getElementById('ds-elemento').value || 'Que Claude decida',
            proposito: document.getElementById('ds-proposito').value || 'Que Claude decida',
            productId: '<?php echo $post->ID; ?>',
            notas: ''
        };

        // Estado: cargando
        btn.disabled = true;
        btnTexto.innerHTML = '<span class="ds-spinner"></span> Generando...';
        status.className = 'ds-status loading';
        status.innerHTML = '✨ Canalizando la esencia de ' + nombre + '... esto puede tardar 30-60 segundos';

        try {
            const res = await fetch('https://duendes-vercel.vercel.app/api/admin/productos/generar-historia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const data = await res.json();

            if (data.success && data.contenido) {
                // Éxito
                status.className = 'ds-status success';
                status.innerHTML = '✅ ¡Contenido generado exitosamente! Se guardará al publicar/actualizar el producto.';

                // Mostrar preview
                preview.classList.add('visible');
                previewContent.innerHTML = generarPreviewHTML(data.contenido);

                // Guardar JSON para el submit
                document.getElementById('ds-contenido-json').value = JSON.stringify(data.contenido);

                // También actualizar la descripción del producto si existe el editor
                if (data.contenido.vidaAnterior?.texto) {
                    const contentEditor = document.getElementById('content');
                    if (contentEditor) {
                        contentEditor.value = data.contenido.vidaAnterior.texto;
                    }
                    // Si usa TinyMCE
                    if (typeof tinymce !== 'undefined' && tinymce.get('content')) {
                        tinymce.get('content').setContent(data.contenido.vidaAnterior.texto);
                    }
                }

            } else {
                throw new Error(data.error || 'Error desconocido');
            }

        } catch (e) {
            status.className = 'ds-status error';
            status.innerHTML = '❌ Error: ' + e.message + '. Intentá de nuevo.';
        }

        // Restaurar botón
        btn.disabled = false;
        btnTexto.textContent = 'Generar Todo con IA';
    }

    function generarPreviewHTML(contenido) {
        let html = '';

        if (contenido.encabezado?.subtitulo) {
            html += `<div class="ds-preview-section">
                <h4>Subtítulo</h4>
                <p>${contenido.encabezado.subtitulo}</p>
            </div>`;
        }

        if (contenido.vidaAnterior?.texto) {
            html += `<div class="ds-preview-section">
                <h4>${contenido.vidaAnterior.titulo || 'Su Historia'}</h4>
                <p>${contenido.vidaAnterior.texto.substring(0, 500)}...</p>
            </div>`;
        }

        if (contenido.mensajeDirecto?.mensaje) {
            html += `<div class="ds-preview-section">
                <h4>Mensaje del Guardián</h4>
                <p>"${contenido.mensajeDirecto.mensaje}"</p>
            </div>`;
        }

        if (contenido.dones?.lista?.length > 0) {
            html += `<div class="ds-preview-section">
                <h4>Dones (${contenido.dones.lista.length})</h4>
                <p>${contenido.dones.lista.map(d => d.nombre).join(' • ')}</p>
            </div>`;
        }

        if (contenido.datosGenerados) {
            html += `<div class="ds-preview-section">
                <h4>Clasificación Automática</h4>
                <p>Tipo: ${contenido.datosGenerados.tipo} • Elemento: ${contenido.datosGenerados.elemento} • Propósito: ${contenido.datosGenerados.proposito}</p>
            </div>`;
        }

        return html || '<p style="color: rgba(255,255,255,0.5);">No hay contenido para mostrar</p>';
    }

    // Inicializar
    calcularConversiones();
    </script>
    <?php
}

// Mostrar preview del contenido guardado
function duendes_mostrar_preview($contenido) {
    if (!is_array($contenido)) {
        $contenido = json_decode($contenido, true);
    }
    if (!$contenido) return '';

    ob_start();
    ?>
    <?php if (!empty($contenido['encabezado']['subtitulo'])): ?>
    <div class="ds-preview-section">
        <h4>Subtítulo</h4>
        <p><?php echo esc_html($contenido['encabezado']['subtitulo']); ?></p>
    </div>
    <?php endif; ?>

    <?php if (!empty($contenido['vidaAnterior']['texto'])): ?>
    <div class="ds-preview-section">
        <h4><?php echo esc_html($contenido['vidaAnterior']['titulo'] ?? 'Su Historia'); ?></h4>
        <p><?php echo esc_html(substr($contenido['vidaAnterior']['texto'], 0, 500)); ?>...</p>
    </div>
    <?php endif; ?>

    <?php if (!empty($contenido['mensajeDirecto']['mensaje'])): ?>
    <div class="ds-preview-section">
        <h4>Mensaje del Guardián</h4>
        <p>"<?php echo esc_html($contenido['mensajeDirecto']['mensaje']); ?>"</p>
    </div>
    <?php endif; ?>

    <?php if (!empty($contenido['dones']['lista'])): ?>
    <div class="ds-preview-section">
        <h4>Dones</h4>
        <p><?php echo esc_html(implode(' • ', array_column($contenido['dones']['lista'], 'nombre'))); ?></p>
    </div>
    <?php endif; ?>
    <?php
    return ob_get_clean();
}

// ═══════════════════════════════════════════════════════════════════════════
// GUARDAR META DATA
// ═══════════════════════════════════════════════════════════════════════════

add_action('save_post_product', function($post_id) {
    if (!isset($_POST['duendes_simple_nonce']) ||
        !wp_verify_nonce($_POST['duendes_simple_nonce'], 'duendes_simple_save')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    // Campos simples
    $campos = [
        '_duendes_tipo',
        '_duendes_genero',
        '_duendes_altura',
        '_duendes_color_ojos',
        '_duendes_accesorios',
        '_duendes_elemento',
        '_duendes_proposito',
        '_duendes_precio_uyu'
    ];

    foreach ($campos as $campo) {
        if (isset($_POST[$campo])) {
            update_post_meta($post_id, $campo, sanitize_textarea_field($_POST[$campo]));
        }
    }

    // Contenido generado (JSON)
    if (isset($_POST['_duendes_contenido_generado']) && !empty($_POST['_duendes_contenido_generado'])) {
        $json_content = wp_unslash($_POST['_duendes_contenido_generado']);
        $contenido = json_decode($json_content, true);

        if ($contenido) {
            update_post_meta($post_id, '_duendes_contenido_generado', $contenido);

            // También guardar campos individuales para compatibilidad
            if (!empty($contenido['vidaAnterior']['texto'])) {
                update_post_meta($post_id, '_duendes_historia', $contenido['vidaAnterior']['texto']);
            }
            if (!empty($contenido['personalidad']['texto'])) {
                update_post_meta($post_id, '_duendes_personalidad', $contenido['personalidad']['texto']);
            }
            if (!empty($contenido['ritual']['pasos'])) {
                $ritual_texto = implode("\n\n", array_map(function($p) {
                    return $p['titulo'] . ': ' . $p['descripcion'];
                }, $contenido['ritual']['pasos']));
                update_post_meta($post_id, '_duendes_ritual', $ritual_texto);
            }
            if (!empty($contenido['mensajeDirecto']['mensaje'])) {
                update_post_meta($post_id, '_duendes_mensaje_poder', $contenido['mensajeDirecto']['mensaje']);
            }
        }
    }
});
