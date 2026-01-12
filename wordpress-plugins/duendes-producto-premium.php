<?php
/**
 * Plugin Name: Duendes Producto Premium
 * Description: Interfaz premium para crear guardianes con IA integrada
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// AGREGAR PESTAÑA PERSONALIZADA EN PRODUCTO
// ═══════════════════════════════════════════════════════════════════════════

add_filter('woocommerce_product_data_tabs', 'duendes_producto_tab');
function duendes_producto_tab($tabs) {
    $tabs['duendes_guardian'] = [
        'label'    => '🧝 Guardián Mágico',
        'target'   => 'duendes_guardian_data',
        'class'    => ['show_if_simple', 'show_if_variable'],
        'priority' => 5,
    ];
    return $tabs;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENIDO DE LA PESTAÑA
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_product_data_panels', 'duendes_guardian_panel');
function duendes_guardian_panel() {
    global $post;
    ?>
    <div id="duendes_guardian_data" class="panel woocommerce_options_panel">
        <style>
            #duendes_guardian_data {
                padding: 20px !important;
                background: #1a1a1a;
                color: #e8e4dc;
            }
            #duendes_guardian_data h3 {
                color: #C6A962;
                border-bottom: 1px solid #333;
                padding-bottom: 10px;
                margin: 20px 0 15px 0;
                font-size: 16px;
            }
            #duendes_guardian_data h3:first-child {
                margin-top: 0;
            }
            #duendes_guardian_data label {
                color: #C6A962 !important;
                font-weight: 500;
            }
            #duendes_guardian_data input[type="text"],
            #duendes_guardian_data input[type="number"],
            #duendes_guardian_data textarea,
            #duendes_guardian_data select {
                background: #111 !important;
                border: 1px solid #333 !important;
                color: #e8e4dc !important;
                border-radius: 8px !important;
            }
            #duendes_guardian_data .description {
                color: #666 !important;
            }
            .duendes-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
            .duendes-grid-3 {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
            }
            .duendes-btn-group {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 8px;
            }
            .duendes-btn {
                padding: 8px 16px;
                background: #111;
                border: 1px solid #333;
                border-radius: 20px;
                color: #888;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s;
            }
            .duendes-btn:hover {
                border-color: #C6A962;
                color: #C6A962;
            }
            .duendes-btn.active {
                background: rgba(198, 169, 98, 0.15);
                border-color: #C6A962;
                color: #C6A962;
            }
            .duendes-generar {
                padding: 6px 14px;
                background: linear-gradient(135deg, #C6A962, #a88a42);
                border: none;
                border-radius: 6px;
                color: #000;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                margin-left: 10px;
            }
            .duendes-generar:hover {
                opacity: 0.9;
            }
            .duendes-generar-todo {
                display: block;
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, #C6A962, #a88a42);
                border: none;
                border-radius: 10px;
                color: #000;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                margin: 20px 0;
            }
            .duendes-section {
                background: #111;
                border: 1px solid #333;
                border-radius: 12px;
                padding: 20px;
                margin: 15px 0;
            }
            .duendes-innovacion {
                background: linear-gradient(135deg, rgba(198, 169, 98, 0.1), rgba(198, 169, 98, 0.05));
                border: 1px solid rgba(198, 169, 98, 0.3);
                border-radius: 12px;
                padding: 20px;
                margin: 15px 0;
            }
            .duendes-innovacion h4 {
                color: #C6A962;
                margin: 0 0 10px 0;
            }
            .duendes-innovacion p {
                color: #888;
                margin: 0;
                font-size: 13px;
            }
            .duendes-precios-preview {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin-top: 15px;
            }
            .duendes-precio-card {
                background: #0a0a0a;
                padding: 12px;
                border-radius: 8px;
                text-align: center;
            }
            .duendes-precio-card small {
                color: #666;
                display: block;
            }
            .duendes-precio-card strong {
                color: #C6A962;
                font-size: 14px;
            }
            .duendes-loading {
                display: none;
                color: #C6A962;
                font-style: italic;
            }
        </style>

        <!-- ═══════════════════════════════════════════════════════════════
             SECCIÓN: TIPO DE GUARDIÁN
        ═══════════════════════════════════════════════════════════════ -->
        <h3>🧝 Tipo de Guardián</h3>

        <p class="form-field">
            <label>Tipo</label>
            <select id="_duendes_tipo" name="_duendes_tipo" style="width: 100%;">
                <option value="">Seleccionar tipo...</option>
                <option value="duende" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'duende'); ?>>🧝 Duende</option>
                <option value="elfo" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'elfo'); ?>>🧚 Elfo</option>
                <option value="hada" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'hada'); ?>>✨ Hada</option>
                <option value="bruja" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'bruja'); ?>>🧙‍♀️ Bruja</option>
                <option value="brujo" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'brujo'); ?>>🧙 Brujo</option>
                <option value="mago" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'mago'); ?>>🪄 Mago</option>
                <option value="hechicero" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'hechicero'); ?>>⚡ Hechicero</option>
                <option value="merlin" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'merlin'); ?>>🌟 Merlín</option>
                <option value="maestro" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'maestro'); ?>>👁️ Maestro Ascendido</option>
                <option value="gnomo" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'gnomo'); ?>>🍄 Gnomo</option>
                <option value="talisman" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'talisman'); ?>>🔮 Talismán</option>
                <option value="varita" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'varita'); ?>>⚔️ Varita Canalizadora</option>
                <option value="libro" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'libro'); ?>>📚 Libro Digital</option>
                <option value="estudio" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'estudio'); ?>>🎓 Estudio/Curso</option>
                <option value="producto_digital" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'producto_digital'); ?>>💫 Producto Digital</option>
            </select>
        </p>

        <p class="form-field">
            <label>Elemento Principal</label>
        </p>
        <div class="duendes-btn-group" id="duendes-elementos">
            <?php $elemento = get_post_meta($post->ID, '_duendes_elemento', true); ?>
            <button type="button" class="duendes-btn <?php echo $elemento == 'tierra' ? 'active' : ''; ?>" data-value="tierra">🌍 Tierra</button>
            <button type="button" class="duendes-btn <?php echo $elemento == 'agua' ? 'active' : ''; ?>" data-value="agua">💧 Agua</button>
            <button type="button" class="duendes-btn <?php echo $elemento == 'fuego' ? 'active' : ''; ?>" data-value="fuego">🔥 Fuego</button>
            <button type="button" class="duendes-btn <?php echo $elemento == 'aire' ? 'active' : ''; ?>" data-value="aire">💨 Aire</button>
            <button type="button" class="duendes-btn <?php echo $elemento == 'eter' ? 'active' : ''; ?>" data-value="eter">✨ Éter</button>
        </div>
        <input type="hidden" name="_duendes_elemento" id="_duendes_elemento" value="<?php echo esc_attr($elemento); ?>">

        <p class="form-field" style="margin-top: 20px;">
            <label>Propósitos (selecciona varios)</label>
        </p>
        <div class="duendes-btn-group" id="duendes-propositos">
            <?php $propositos = get_post_meta($post->ID, '_duendes_propositos', true) ?: []; ?>
            <button type="button" class="duendes-btn <?php echo in_array('proteccion', $propositos) ? 'active' : ''; ?>" data-value="proteccion">🛡️ Protección</button>
            <button type="button" class="duendes-btn <?php echo in_array('abundancia', $propositos) ? 'active' : ''; ?>" data-value="abundancia">💰 Abundancia</button>
            <button type="button" class="duendes-btn <?php echo in_array('amor', $propositos) ? 'active' : ''; ?>" data-value="amor">💜 Amor</button>
            <button type="button" class="duendes-btn <?php echo in_array('sanacion', $propositos) ? 'active' : ''; ?>" data-value="sanacion">💚 Sanación</button>
            <button type="button" class="duendes-btn <?php echo in_array('sabiduria', $propositos) ? 'active' : ''; ?>" data-value="sabiduria">📖 Sabiduría</button>
            <button type="button" class="duendes-btn <?php echo in_array('creatividad', $propositos) ? 'active' : ''; ?>" data-value="creatividad">🎨 Creatividad</button>
            <button type="button" class="duendes-btn <?php echo in_array('intuicion', $propositos) ? 'active' : ''; ?>" data-value="intuicion">👁️ Intuición</button>
            <button type="button" class="duendes-btn <?php echo in_array('transformacion', $propositos) ? 'active' : ''; ?>" data-value="transformacion">🦋 Transformación</button>
            <button type="button" class="duendes-btn <?php echo in_array('conexion', $propositos) ? 'active' : ''; ?>" data-value="conexion">🙏 Conexión</button>
            <button type="button" class="duendes-btn <?php echo in_array('limpieza', $propositos) ? 'active' : ''; ?>" data-value="limpieza">🌿 Limpieza</button>
        </div>
        <input type="hidden" name="_duendes_propositos" id="_duendes_propositos" value="<?php echo esc_attr(implode(',', $propositos)); ?>">

        <!-- ═══════════════════════════════════════════════════════════════
             SECCIÓN: APARIENCIA FÍSICA
        ═══════════════════════════════════════════════════════════════ -->
        <h3>👁️ Apariencia Física</h3>

        <div class="duendes-grid-3">
            <p class="form-field">
                <label>Altura (cm)</label>
                <input type="number" name="_duendes_altura" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_altura', true)); ?>" placeholder="27">
            </p>
            <p class="form-field">
                <label>Ancho (cm)</label>
                <input type="number" name="_duendes_ancho" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_ancho', true)); ?>" placeholder="15">
            </p>
            <p class="form-field">
                <label>Profundidad (cm)</label>
                <input type="number" name="_duendes_profundidad" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_profundidad', true)); ?>" placeholder="12">
            </p>
        </div>

        <div class="duendes-grid">
            <p class="form-field">
                <label>Color de Ojos</label>
                <input type="text" name="_duendes_color_ojos" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_color_ojos', true)); ?>" placeholder="Verde esmeralda, Ámbar...">
            </p>
            <p class="form-field">
                <label>Color de Cabello</label>
                <input type="text" name="_duendes_color_cabello" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_color_cabello', true)); ?>" placeholder="Pelirrojo, Plateado...">
            </p>
        </div>

        <p class="form-field">
            <label>Colores de Vestimenta</label>
            <input type="text" name="_duendes_colores_vestimenta" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_colores_vestimenta', true)); ?>" placeholder="Dorado, Verde bosque, Rojo ancestral...">
            <span class="description">Separar con comas</span>
        </p>

        <p class="form-field">
            <label>Piedras / Cristales</label>
        </p>
        <div class="duendes-btn-group" id="duendes-piedras">
            <?php $piedras = get_post_meta($post->ID, '_duendes_piedras', true) ?: []; ?>
            <?php foreach(['Cuarzo Rosa', 'Amatista', 'Citrino', 'Turmalina Negra', 'Lapislázuli', 'Obsidiana', 'Jade', 'Ojo de Tigre', 'Selenita', 'Pirita'] as $piedra): ?>
                <button type="button" class="duendes-btn <?php echo in_array($piedra, $piedras) ? 'active' : ''; ?>" data-value="<?php echo $piedra; ?>"><?php echo $piedra; ?></button>
            <?php endforeach; ?>
        </div>
        <input type="hidden" name="_duendes_piedras" id="_duendes_piedras" value="<?php echo esc_attr(implode(',', $piedras)); ?>">

        <p class="form-field">
            <label>Material Principal</label>
            <input type="text" name="_duendes_material" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_material', true)); ?>" placeholder="Porcelana fría profesional, resina, madera...">
        </p>

        <p class="form-field">
            <label>Accesorios Incluidos</label>
            <textarea name="_duendes_accesorios" rows="3" placeholder="Báculo de madera real, péndulo de cuarzo, libro de conjuros en miniatura..."><?php echo esc_textarea(get_post_meta($post->ID, '_duendes_accesorios', true)); ?></textarea>
        </p>

        <!-- ═══════════════════════════════════════════════════════════════
             SECCIÓN: PRECIOS GEOLOCALIZADOS
        ═══════════════════════════════════════════════════════════════ -->
        <h3>💰 Precios (se muestran geolocalizados)</h3>

        <div class="duendes-section">
            <p style="color: #888; margin-top: 0;">El precio en USD se convierte automáticamente. Para Uruguay podés poner un precio diferencial.</p>

            <div class="duendes-grid">
                <p class="form-field">
                    <label>Precio Internacional (USD)</label>
                    <input type="number" name="_duendes_precio_usd" id="_duendes_precio_usd" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_precio_usd', true)); ?>" placeholder="450" oninput="duendesActualizarPrecios()">
                    <span class="description">Este es el precio base</span>
                </p>
                <p class="form-field">
                    <label>Precio Uruguay (USD) - Opcional</label>
                    <input type="number" name="_duendes_precio_uy" id="_duendes_precio_uy" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_precio_uy', true)); ?>" placeholder="Mismo si vacío" oninput="duendesActualizarPrecios()">
                    <span class="description">Dejalo vacío para usar el internacional</span>
                </p>
            </div>

            <div class="duendes-precios-preview" id="duendes-precios-preview">
                <!-- Se llena con JS -->
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════
             SECCIÓN: HISTORIA Y CONTENIDO IA
        ═══════════════════════════════════════════════════════════════ -->
        <h3>📜 Historia del Guardián</h3>

        <button type="button" class="duendes-generar-todo" onclick="duendesGenerarTodo()">
            ✨ Generar Todo con Claude IA
        </button>
        <p class="duendes-loading" id="duendes-loading">Generando con Claude... esto puede tardar unos segundos</p>

        <p class="form-field">
            <label>
                Historia / Origen
                <button type="button" class="duendes-generar" onclick="duendesGenerar('historia')">✨ Generar</button>
            </label>
            <textarea name="_duendes_historia" id="_duendes_historia" rows="8" placeholder="La historia de cómo este guardián llegó al mundo..."><?php echo esc_textarea(get_post_meta($post->ID, '_duendes_historia', true)); ?></textarea>
        </p>

        <p class="form-field">
            <label>
                Personalidad
                <button type="button" class="duendes-generar" onclick="duendesGenerar('personalidad')">✨ Generar</button>
            </label>
            <textarea name="_duendes_personalidad" id="_duendes_personalidad" rows="4" placeholder="Cómo es su carácter, cómo se comunica..."><?php echo esc_textarea(get_post_meta($post->ID, '_duendes_personalidad', true)); ?></textarea>
        </p>

        <p class="form-field">
            <label>
                Fortalezas (una por línea)
                <button type="button" class="duendes-generar" onclick="duendesGenerar('fortalezas')">✨ Generar</button>
            </label>
            <textarea name="_duendes_fortalezas" id="_duendes_fortalezas" rows="5" placeholder="Protección del hogar&#10;Limpieza energética&#10;Conexión con la naturaleza"><?php echo esc_textarea(get_post_meta($post->ID, '_duendes_fortalezas', true)); ?></textarea>
        </p>

        <p class="form-field">
            <label>
                Mensaje de Poder
                <button type="button" class="duendes-generar" onclick="duendesGenerar('mensaje')">✨ Generar</button>
            </label>
            <input type="text" name="_duendes_mensaje_poder" id="_duendes_mensaje_poder" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_mensaje_poder', true)); ?>" placeholder="Una frase que define su esencia...">
        </p>

        <p class="form-field">
            <label>
                Ritual de Bienvenida
                <button type="button" class="duendes-generar" onclick="duendesGenerar('ritual')">✨ Generar</button>
            </label>
            <textarea name="_duendes_ritual" id="_duendes_ritual" rows="4" placeholder="Instrucciones para recibir al guardián en el hogar..."><?php echo esc_textarea(get_post_meta($post->ID, '_duendes_ritual', true)); ?></textarea>
        </p>

        <p class="form-field">
            <label>
                Cuidados
                <button type="button" class="duendes-generar" onclick="duendesGenerar('cuidados')">✨ Generar</button>
            </label>
            <textarea name="_duendes_cuidados" id="_duendes_cuidados" rows="4" placeholder="Ubicación ideal, limpieza energética, fechas especiales..."><?php echo esc_textarea(get_post_meta($post->ID, '_duendes_cuidados', true)); ?></textarea>
        </p>

        <!-- ═══════════════════════════════════════════════════════════════
             SECCIÓN: MÍSTICO
        ═══════════════════════════════════════════════════════════════ -->
        <h3>🔮 Información Mística</h3>

        <p class="form-field">
            <label>Fase Lunar Ideal</label>
        </p>
        <div class="duendes-btn-group" id="duendes-luna">
            <?php $luna = get_post_meta($post->ID, '_duendes_fase_luna', true); ?>
            <button type="button" class="duendes-btn <?php echo $luna == 'nueva' ? 'active' : ''; ?>" data-value="nueva">🌑 Luna Nueva</button>
            <button type="button" class="duendes-btn <?php echo $luna == 'creciente' ? 'active' : ''; ?>" data-value="creciente">🌒 Creciente</button>
            <button type="button" class="duendes-btn <?php echo $luna == 'llena' ? 'active' : ''; ?>" data-value="llena">🌕 Luna Llena</button>
            <button type="button" class="duendes-btn <?php echo $luna == 'menguante' ? 'active' : ''; ?>" data-value="menguante">🌘 Menguante</button>
            <button type="button" class="duendes-btn <?php echo $luna == 'cualquiera' ? 'active' : ''; ?>" data-value="cualquiera">🌙 Cualquiera</button>
        </div>
        <input type="hidden" name="_duendes_fase_luna" id="_duendes_fase_luna" value="<?php echo esc_attr($luna); ?>">

        <p class="form-field">
            <label>Signos del Zodíaco Afines</label>
        </p>
        <div class="duendes-btn-group" id="duendes-signos">
            <?php $signos = get_post_meta($post->ID, '_duendes_signos', true) ?: []; ?>
            <?php foreach(['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'] as $signo): ?>
                <button type="button" class="duendes-btn <?php echo in_array($signo, $signos) ? 'active' : ''; ?>" data-value="<?php echo $signo; ?>"><?php echo $signo; ?></button>
            <?php endforeach; ?>
        </div>
        <input type="hidden" name="_duendes_signos" id="_duendes_signos" value="<?php echo esc_attr(implode(',', $signos)); ?>">

        <div class="duendes-grid">
            <p class="form-field">
                <label>Hora Más Poderosa</label>
                <select name="_duendes_hora_poderosa">
                    <option value="">Seleccionar...</option>
                    <option value="amanecer" <?php selected(get_post_meta($post->ID, '_duendes_hora_poderosa', true), 'amanecer'); ?>>Amanecer (6-8am)</option>
                    <option value="mediodia" <?php selected(get_post_meta($post->ID, '_duendes_hora_poderosa', true), 'mediodia'); ?>>Mediodía (12-14pm)</option>
                    <option value="atardecer" <?php selected(get_post_meta($post->ID, '_duendes_hora_poderosa', true), 'atardecer'); ?>>Atardecer (18-20pm)</option>
                    <option value="medianoche" <?php selected(get_post_meta($post->ID, '_duendes_hora_poderosa', true), 'medianoche'); ?>>Medianoche (0-2am)</option>
                </select>
            </p>
            <p class="form-field">
                <label>Estación Ideal</label>
                <select name="_duendes_estacion">
                    <option value="">Seleccionar...</option>
                    <option value="primavera" <?php selected(get_post_meta($post->ID, '_duendes_estacion', true), 'primavera'); ?>>Primavera</option>
                    <option value="verano" <?php selected(get_post_meta($post->ID, '_duendes_estacion', true), 'verano'); ?>>Verano</option>
                    <option value="otono" <?php selected(get_post_meta($post->ID, '_duendes_estacion', true), 'otono'); ?>>Otoño</option>
                    <option value="invierno" <?php selected(get_post_meta($post->ID, '_duendes_estacion', true), 'invierno'); ?>>Invierno</option>
                </select>
            </p>
        </div>

        <p class="form-field">
            <label>Lugar donde fue canalizada su energía</label>
            <input type="text" name="_duendes_lugar_canalizacion" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_lugar_canalizacion', true)); ?>" placeholder="Bosque de Piriápolis, Cerro Pan de Azúcar...">
        </p>

        <!-- ═══════════════════════════════════════════════════════════════
             SECCIÓN: INNOVACIONES
        ═══════════════════════════════════════════════════════════════ -->
        <h3>🆕 Características Exclusivas</h3>

        <div class="duendes-innovacion">
            <h4>🔐 Código QR de Autenticidad</h4>
            <p>Se genera automáticamente al publicar. El adoptante puede escanearlo para ver el certificado y la historia completa.</p>
        </div>

        <div class="duendes-innovacion">
            <h4>🌐 Portal del Guardián</h4>
            <p>Cada guardián tendrá su propia página privada con actualizaciones de energía y mensajes exclusivos.</p>
            <label style="color: #e8e4dc !important; margin-top: 10px; display: block;">
                <input type="checkbox" name="_duendes_portal_activo" value="1" <?php checked(get_post_meta($post->ID, '_duendes_portal_activo', true), '1'); ?>>
                Activar Portal del Guardián para este producto
            </label>
        </div>

        <div class="duendes-innovacion">
            <h4>📜 Registro de Linaje</h4>
            <p>Sistema de conexiones familiares entre guardianes. Los adoptantes pueden ver el árbol genealógico.</p>
            <p class="form-field" style="margin-top: 10px;">
                <label style="color: #C6A962 !important;">Guardianes Relacionados (IDs separados por coma)</label>
                <input type="text" name="_duendes_relacionados" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_relacionados', true)); ?>" placeholder="123, 456, 789">
            </p>
        </div>

        <script>
        // Tasas de cambio
        const TASAS = {
            USD: { simbolo: '$', tasa: 1, nombre: 'USD' },
            UYU: { simbolo: '$', tasa: 43, nombre: 'UYU' },
            ARS: { simbolo: '$', tasa: 1050, nombre: 'ARS' },
            MXN: { simbolo: '$', tasa: 17, nombre: 'MXN' },
            EUR: { simbolo: '€', tasa: 0.92, nombre: 'EUR' },
            BRL: { simbolo: 'R$', tasa: 5.2, nombre: 'BRL' },
            CLP: { simbolo: '$', tasa: 950, nombre: 'CLP' },
            COP: { simbolo: '$', tasa: 4000, nombre: 'COP' },
        };

        // Actualizar preview de precios
        function duendesActualizarPrecios() {
            const usd = document.getElementById('_duendes_precio_usd').value;
            const uy = document.getElementById('_duendes_precio_uy').value;
            const container = document.getElementById('duendes-precios-preview');

            if (!usd) {
                container.innerHTML = '';
                return;
            }

            let html = '';
            for (const [codigo, config] of Object.entries(TASAS)) {
                const base = codigo === 'UYU' && uy ? uy : usd;
                const local = parseFloat(base) * config.tasa;
                const formateado = local.toLocaleString('es-UY', { maximumFractionDigits: 0 });
                html += `<div class="duendes-precio-card"><small>${codigo}</small><strong>${config.simbolo}${formateado}</strong></div>`;
            }
            container.innerHTML = html;
        }

        // Manejar botones de selección única
        document.querySelectorAll('#duendes-elementos .duendes-btn, #duendes-luna .duendes-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const group = this.parentElement;
                group.querySelectorAll('.duendes-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const inputId = group.id.replace('duendes-', '_duendes_');
                document.getElementById(inputId).value = this.dataset.value;
            });
        });

        // Manejar botones de selección múltiple
        document.querySelectorAll('#duendes-propositos .duendes-btn, #duendes-piedras .duendes-btn, #duendes-signos .duendes-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                const group = this.parentElement;
                const activos = Array.from(group.querySelectorAll('.duendes-btn.active')).map(b => b.dataset.value);
                const inputId = group.id.replace('duendes-', '_duendes_');
                document.getElementById(inputId).value = activos.join(',');
            });
        });

        // Generar con Claude
        async function duendesGenerar(campo) {
            const loading = document.getElementById('duendes-loading');
            loading.style.display = 'block';

            const datos = {
                campo: campo,
                nombre: document.getElementById('title')?.value || '',
                tipo: document.getElementById('_duendes_tipo').value,
                elemento: document.getElementById('_duendes_elemento').value,
                propositos: document.getElementById('_duendes_propositos').value,
                color_ojos: document.querySelector('[name="_duendes_color_ojos"]')?.value,
                color_cabello: document.querySelector('[name="_duendes_color_cabello"]')?.value,
            };

            try {
                const res = await fetch('https://duendes-vercel.vercel.app/api/admin/productos/generar-contenido', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });

                const data = await res.json();
                if (data.success && data[campo]) {
                    document.getElementById('_duendes_' + campo).value = data[campo];
                }
            } catch (e) {
                console.error('Error generando:', e);
                alert('Error al generar. Intentá de nuevo.');
            }

            loading.style.display = 'none';
        }

        // Generar todo
        async function duendesGenerarTodo() {
            const loading = document.getElementById('duendes-loading');
            loading.style.display = 'block';

            const datos = {
                campo: 'todo',
                nombre: document.getElementById('title')?.value || '',
                tipo: document.getElementById('_duendes_tipo').value,
                elemento: document.getElementById('_duendes_elemento').value,
                propositos: document.getElementById('_duendes_propositos').value,
                color_ojos: document.querySelector('[name="_duendes_color_ojos"]')?.value,
                color_cabello: document.querySelector('[name="_duendes_color_cabello"]')?.value,
                piedras: document.getElementById('_duendes_piedras').value,
            };

            try {
                const res = await fetch('https://duendes-vercel.vercel.app/api/admin/productos/generar-contenido', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });

                const data = await res.json();
                if (data.success) {
                    if (data.nombre && !document.getElementById('title').value) {
                        document.getElementById('title').value = data.nombre;
                    }
                    if (data.historia) document.getElementById('_duendes_historia').value = data.historia;
                    if (data.personalidad) document.getElementById('_duendes_personalidad').value = data.personalidad;
                    if (data.fortalezas) document.getElementById('_duendes_fortalezas').value = data.fortalezas;
                    if (data.mensaje) document.getElementById('_duendes_mensaje_poder').value = data.mensaje;
                    if (data.ritual) document.getElementById('_duendes_ritual').value = data.ritual;
                    if (data.cuidados) document.getElementById('_duendes_cuidados').value = data.cuidados;
                }
            } catch (e) {
                console.error('Error generando:', e);
                alert('Error al generar. Intentá de nuevo.');
            }

            loading.style.display = 'none';
        }

        // Init
        duendesActualizarPrecios();
        </script>
    </div>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// GUARDAR META DATA
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_process_product_meta', 'duendes_guardar_meta');
function duendes_guardar_meta($post_id) {
    $campos = [
        '_duendes_tipo',
        '_duendes_elemento',
        '_duendes_altura',
        '_duendes_ancho',
        '_duendes_profundidad',
        '_duendes_color_ojos',
        '_duendes_color_cabello',
        '_duendes_colores_vestimenta',
        '_duendes_material',
        '_duendes_accesorios',
        '_duendes_precio_usd',
        '_duendes_precio_uy',
        '_duendes_historia',
        '_duendes_personalidad',
        '_duendes_fortalezas',
        '_duendes_mensaje_poder',
        '_duendes_ritual',
        '_duendes_cuidados',
        '_duendes_fase_luna',
        '_duendes_hora_poderosa',
        '_duendes_estacion',
        '_duendes_lugar_canalizacion',
        '_duendes_relacionados',
    ];

    foreach ($campos as $campo) {
        if (isset($_POST[$campo])) {
            update_post_meta($post_id, $campo, sanitize_textarea_field($_POST[$campo]));
        }
    }

    // Arrays
    if (isset($_POST['_duendes_propositos'])) {
        $propositos = array_filter(explode(',', sanitize_text_field($_POST['_duendes_propositos'])));
        update_post_meta($post_id, '_duendes_propositos', $propositos);
    }

    if (isset($_POST['_duendes_piedras'])) {
        $piedras = array_filter(explode(',', sanitize_text_field($_POST['_duendes_piedras'])));
        update_post_meta($post_id, '_duendes_piedras', $piedras);
    }

    if (isset($_POST['_duendes_signos'])) {
        $signos = array_filter(explode(',', sanitize_text_field($_POST['_duendes_signos'])));
        update_post_meta($post_id, '_duendes_signos', $signos);
    }

    // Checkbox
    update_post_meta($post_id, '_duendes_portal_activo', isset($_POST['_duendes_portal_activo']) ? '1' : '0');
}

// ═══════════════════════════════════════════════════════════════════════════
// AGREGAR ESTILOS AL ADMIN
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_head', 'duendes_admin_styles');
function duendes_admin_styles() {
    ?>
    <style>
        .duendes_guardian_options a::before {
            content: '🧝' !important;
        }
    </style>
    <?php
}
