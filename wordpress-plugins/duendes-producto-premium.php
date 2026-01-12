<?php
/**
 * Plugin Name: Duendes Producto Premium
 * Description: Interfaz premium para crear guardianes con IA integrada
 * Version: 2.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// AGREGAR METABOX EN PRODUCTO (reemplaza Ficha del Guardián)
// ═══════════════════════════════════════════════════════════════════════════

add_action('add_meta_boxes', 'duendes_agregar_metabox');
function duendes_agregar_metabox() {
    add_meta_box(
        'duendes_guardian_metabox',
        '🧝 Guardián Mágico Premium',
        'duendes_guardian_metabox_html',
        'product',
        'normal',
        'high'
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// HTML DEL METABOX
// ═══════════════════════════════════════════════════════════════════════════

function duendes_guardian_metabox_html($post) {
    wp_nonce_field('duendes_guardian_save', 'duendes_guardian_nonce');
    ?>
    <style>
        #duendes_guardian_metabox .inside {
            padding: 0 !important;
            margin: 0 !important;
        }
        .duendes-container {
            background: linear-gradient(180deg, #0d1117 0%, #161b22 100%);
            color: #e6edf3;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .duendes-header {
            background: linear-gradient(135deg, #1B4D3E 0%, #0d2d24 100%);
            padding: 20px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .duendes-header h2 {
            margin: 0;
            color: #C6A962;
            font-size: 20px;
            font-weight: 600;
        }
        .duendes-header p {
            margin: 5px 0 0 0;
            color: #8b949e;
            font-size: 13px;
        }
        .duendes-header-buttons {
            display: flex;
            gap: 10px;
        }
        .duendes-btn-header {
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }
        .duendes-btn-pendiente {
            background: #21262d;
            color: #8b949e;
            border: 1px solid #30363d;
        }
        .duendes-btn-generar {
            background: linear-gradient(135deg, #C6A962, #a88a42);
            color: #000;
        }
        .duendes-btn-generar:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(198, 169, 98, 0.3);
        }
        .duendes-body {
            padding: 25px;
        }
        .duendes-section {
            background: #21262d;
            border: 1px solid #30363d;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
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
        .duendes-grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
        }
        .duendes-field {
            margin-bottom: 15px;
        }
        .duendes-field:last-child {
            margin-bottom: 0;
        }
        .duendes-label {
            display: block;
            color: #8b949e;
            font-size: 12px;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .duendes-input,
        .duendes-select,
        .duendes-textarea {
            width: 100%;
            padding: 10px 12px;
            background: #0d1117;
            border: 1px solid #30363d;
            border-radius: 8px;
            color: #e6edf3;
            font-size: 14px;
            transition: border-color 0.2s;
        }
        .duendes-input:focus,
        .duendes-select:focus,
        .duendes-textarea:focus {
            outline: none;
            border-color: #C6A962;
        }
        .duendes-input::placeholder {
            color: #484f58;
        }
        .duendes-textarea {
            min-height: 100px;
            resize: vertical;
        }
        .duendes-btn-group {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .duendes-chip {
            padding: 8px 14px;
            background: #0d1117;
            border: 1px solid #30363d;
            border-radius: 20px;
            color: #8b949e;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .duendes-chip:hover {
            border-color: #C6A962;
            color: #C6A962;
        }
        .duendes-chip.active {
            background: rgba(198, 169, 98, 0.15);
            border-color: #C6A962;
            color: #C6A962;
        }
        .duendes-precio-box {
            background: linear-gradient(135deg, rgba(198, 169, 98, 0.1), rgba(198, 169, 98, 0.05));
            border: 1px solid rgba(198, 169, 98, 0.3);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        .duendes-precio-label {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #C6A962;
            font-size: 14px;
            margin-bottom: 12px;
        }
        .duendes-precio-input {
            font-size: 32px;
            font-weight: 700;
            text-align: center;
            background: transparent;
            border: none;
            color: #fff;
            width: 100%;
        }
        .duendes-precio-input:focus {
            outline: none;
        }
        .duendes-precio-hint {
            color: #238636;
            font-size: 12px;
            margin-top: 8px;
        }
        .duendes-conversion-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 15px;
        }
        .duendes-conversion-card {
            background: #0d1117;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
        }
        .duendes-conversion-card small {
            color: #8b949e;
            font-size: 11px;
        }
        .duendes-conversion-card strong {
            display: block;
            color: #C6A962;
            font-size: 13px;
            margin-top: 4px;
        }
        .duendes-gen-btn {
            padding: 6px 12px;
            background: linear-gradient(135deg, #C6A962, #a88a42);
            border: none;
            border-radius: 6px;
            color: #000;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            margin-left: 8px;
        }
        .duendes-gen-btn:hover {
            opacity: 0.9;
        }
        .duendes-loading {
            display: none;
            color: #C6A962;
            font-style: italic;
            padding: 10px;
            text-align: center;
        }
        .duendes-innovacion {
            background: linear-gradient(135deg, rgba(35, 134, 54, 0.1), rgba(35, 134, 54, 0.05));
            border: 1px solid rgba(35, 134, 54, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin-top: 10px;
        }
        .duendes-innovacion h4 {
            color: #3fb950;
            margin: 0 0 8px 0;
            font-size: 13px;
        }
        .duendes-innovacion p {
            color: #8b949e;
            margin: 0;
            font-size: 12px;
        }
        @media (max-width: 782px) {
            .duendes-grid, .duendes-grid-3, .duendes-grid-4 {
                grid-template-columns: 1fr;
            }
            .duendes-header {
                flex-direction: column;
                gap: 15px;
            }
        }
    </style>

    <div class="duendes-container">
        <!-- Header -->
        <div class="duendes-header">
            <div>
                <h2>Ficha del Guardián</h2>
                <p>Completá los datos y generá el contenido mágico</p>
            </div>
            <div class="duendes-header-buttons">
                <button type="button" class="duendes-btn-header duendes-btn-pendiente" id="duendes-estado">
                    ⏳ Pendiente
                </button>
                <button type="button" class="duendes-btn-header duendes-btn-generar" onclick="duendesGenerarTodo()">
                    🤖 Generar con IA
                </button>
            </div>
        </div>

        <div class="duendes-body">
            <p class="duendes-loading" id="duendes-loading">✨ Generando con Claude... esto puede tardar unos segundos</p>

            <!-- PRECIO URUGUAY -->
            <div class="duendes-section">
                <div class="duendes-precio-box">
                    <div class="duendes-precio-label">
                        🇺🇾 Precio para Uruguay (Pesos Uruguayos)
                    </div>
                    <input type="number"
                           name="_duendes_precio_uyu"
                           id="_duendes_precio_uyu"
                           class="duendes-precio-input"
                           value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_precio_uyu', true)); ?>"
                           placeholder="8000"
                           oninput="duendesActualizarPrecios()">
                    <p class="duendes-precio-hint">Este precio se muestra SOLO a visitantes desde Uruguay. El resto del mundo ve el precio en USD de WooCommerce.</p>
                </div>

                <div class="duendes-conversion-grid" id="duendes-conversiones">
                    <!-- Se llena con JS -->
                </div>
            </div>

            <!-- TIPO DE CREACIÓN -->
            <div class="duendes-section">
                <h3 class="duendes-section-title">🎭 Tipo de Creación</h3>

                <div class="duendes-grid">
                    <div class="duendes-field">
                        <label class="duendes-label">¿Qué es? *</label>
                        <select name="_duendes_que_es" id="_duendes_que_es" class="duendes-select">
                            <option value="">Seleccionar...</option>
                            <option value="ser_magico" <?php selected(get_post_meta($post->ID, '_duendes_que_es', true), 'ser_magico'); ?>>Ser Mágico (elegir tipo abajo)</option>
                            <option value="talisman" <?php selected(get_post_meta($post->ID, '_duendes_que_es', true), 'talisman'); ?>>Talismán</option>
                            <option value="varita" <?php selected(get_post_meta($post->ID, '_duendes_que_es', true), 'varita'); ?>>Varita Canalizadora</option>
                            <option value="libro" <?php selected(get_post_meta($post->ID, '_duendes_que_es', true), 'libro'); ?>>Libro Digital</option>
                            <option value="estudio" <?php selected(get_post_meta($post->ID, '_duendes_que_es', true), 'estudio'); ?>>Estudio/Curso</option>
                            <option value="producto_digital" <?php selected(get_post_meta($post->ID, '_duendes_que_es', true), 'producto_digital'); ?>>Producto Digital</option>
                        </select>
                    </div>
                    <div class="duendes-field">
                        <label class="duendes-label">¿Es pieza única?</label>
                        <select name="_duendes_pieza_unica" class="duendes-select">
                            <option value="unico" <?php selected(get_post_meta($post->ID, '_duendes_pieza_unica', true), 'unico'); ?>>✨ ÚNICO - No se repite</option>
                            <option value="serie" <?php selected(get_post_meta($post->ID, '_duendes_pieza_unica', true), 'serie'); ?>>Serie limitada</option>
                            <option value="digital" <?php selected(get_post_meta($post->ID, '_duendes_pieza_unica', true), 'digital'); ?>>Digital (ilimitado)</option>
                        </select>
                    </div>
                </div>

                <div class="duendes-grid">
                    <div class="duendes-field">
                        <label class="duendes-label">Tipo de Ser *</label>
                        <select name="_duendes_tipo" id="_duendes_tipo" class="duendes-select">
                            <option value="">— Seleccionar —</option>
                            <option value="duende" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'duende'); ?>>🧝 Duende</option>
                            <option value="elfo" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'elfo'); ?>>🧚 Elfo</option>
                            <option value="hada" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'hada'); ?>>✨ Hada</option>
                            <option value="bruja" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'bruja'); ?>>🧙‍♀️ Bruja</option>
                            <option value="brujo" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'brujo'); ?>>🧙 Brujo</option>
                            <option value="mago" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'mago'); ?>>🪄 Mago</option>
                            <option value="hechicero" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'hechicero'); ?>>⚡ Hechicero/a</option>
                            <option value="merlin" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'merlin'); ?>>🌟 Merlín</option>
                            <option value="maestro" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'maestro'); ?>>👁️ Maestro Ascendido</option>
                            <option value="gnomo" <?php selected(get_post_meta($post->ID, '_duendes_tipo', true), 'gnomo'); ?>>🍄 Gnomo</option>
                        </select>
                    </div>
                    <div class="duendes-field">
                        <label class="duendes-label">Género</label>
                        <select name="_duendes_genero" class="duendes-select">
                            <option value="masculino" <?php selected(get_post_meta($post->ID, '_duendes_genero', true), 'masculino'); ?>>♂️ Masculino</option>
                            <option value="femenino" <?php selected(get_post_meta($post->ID, '_duendes_genero', true), 'femenino'); ?>>♀️ Femenino</option>
                            <option value="neutro" <?php selected(get_post_meta($post->ID, '_duendes_genero', true), 'neutro'); ?>>⚪ Neutro/Etéreo</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- ELEMENTO Y PROPÓSITOS -->
            <div class="duendes-section">
                <h3 class="duendes-section-title">🔮 Elemento y Propósitos</h3>

                <div class="duendes-field">
                    <label class="duendes-label">Elemento Principal</label>
                    <div class="duendes-btn-group" id="duendes-elementos">
                        <?php $elemento = get_post_meta($post->ID, '_duendes_elemento', true); ?>
                        <button type="button" class="duendes-chip <?php echo $elemento == 'tierra' ? 'active' : ''; ?>" data-value="tierra">🌍 Tierra</button>
                        <button type="button" class="duendes-chip <?php echo $elemento == 'agua' ? 'active' : ''; ?>" data-value="agua">💧 Agua</button>
                        <button type="button" class="duendes-chip <?php echo $elemento == 'fuego' ? 'active' : ''; ?>" data-value="fuego">🔥 Fuego</button>
                        <button type="button" class="duendes-chip <?php echo $elemento == 'aire' ? 'active' : ''; ?>" data-value="aire">💨 Aire</button>
                        <button type="button" class="duendes-chip <?php echo $elemento == 'eter' ? 'active' : ''; ?>" data-value="eter">✨ Éter</button>
                    </div>
                    <input type="hidden" name="_duendes_elemento" id="_duendes_elemento" value="<?php echo esc_attr($elemento); ?>">
                </div>

                <div class="duendes-field">
                    <label class="duendes-label">Propósitos (selecciona varios)</label>
                    <div class="duendes-btn-group" id="duendes-propositos">
                        <?php $propositos = get_post_meta($post->ID, '_duendes_propositos', true) ?: []; ?>
                        <button type="button" class="duendes-chip <?php echo in_array('proteccion', $propositos) ? 'active' : ''; ?>" data-value="proteccion">🛡️ Protección</button>
                        <button type="button" class="duendes-chip <?php echo in_array('abundancia', $propositos) ? 'active' : ''; ?>" data-value="abundancia">💰 Abundancia</button>
                        <button type="button" class="duendes-chip <?php echo in_array('amor', $propositos) ? 'active' : ''; ?>" data-value="amor">💜 Amor</button>
                        <button type="button" class="duendes-chip <?php echo in_array('sanacion', $propositos) ? 'active' : ''; ?>" data-value="sanacion">💚 Sanación</button>
                        <button type="button" class="duendes-chip <?php echo in_array('sabiduria', $propositos) ? 'active' : ''; ?>" data-value="sabiduria">📖 Sabiduría</button>
                        <button type="button" class="duendes-chip <?php echo in_array('creatividad', $propositos) ? 'active' : ''; ?>" data-value="creatividad">🎨 Creatividad</button>
                        <button type="button" class="duendes-chip <?php echo in_array('intuicion', $propositos) ? 'active' : ''; ?>" data-value="intuicion">👁️ Intuición</button>
                        <button type="button" class="duendes-chip <?php echo in_array('transformacion', $propositos) ? 'active' : ''; ?>" data-value="transformacion">🦋 Transformación</button>
                        <button type="button" class="duendes-chip <?php echo in_array('limpieza', $propositos) ? 'active' : ''; ?>" data-value="limpieza">🌿 Limpieza</button>
                    </div>
                    <input type="hidden" name="_duendes_propositos" id="_duendes_propositos" value="<?php echo esc_attr(is_array($propositos) ? implode(',', $propositos) : $propositos); ?>">
                </div>
            </div>

            <!-- APARIENCIA -->
            <div class="duendes-section">
                <h3 class="duendes-section-title">👁️ Apariencia Física</h3>

                <div class="duendes-grid-3">
                    <div class="duendes-field">
                        <label class="duendes-label">Altura (cm)</label>
                        <input type="number" name="_duendes_altura" class="duendes-input" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_altura', true)); ?>" placeholder="27">
                    </div>
                    <div class="duendes-field">
                        <label class="duendes-label">Ancho (cm)</label>
                        <input type="number" name="_duendes_ancho" class="duendes-input" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_ancho', true)); ?>" placeholder="15">
                    </div>
                    <div class="duendes-field">
                        <label class="duendes-label">Profundidad (cm)</label>
                        <input type="number" name="_duendes_profundidad" class="duendes-input" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_profundidad', true)); ?>" placeholder="12">
                    </div>
                </div>

                <div class="duendes-grid">
                    <div class="duendes-field">
                        <label class="duendes-label">Color de Ojos</label>
                        <input type="text" name="_duendes_color_ojos" class="duendes-input" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_color_ojos', true)); ?>" placeholder="Verde esmeralda, Ámbar...">
                    </div>
                    <div class="duendes-field">
                        <label class="duendes-label">Color de Cabello</label>
                        <input type="text" name="_duendes_color_cabello" class="duendes-input" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_color_cabello', true)); ?>" placeholder="Pelirrojo, Plateado...">
                    </div>
                </div>

                <div class="duendes-field">
                    <label class="duendes-label">Colores de Vestimenta</label>
                    <input type="text" name="_duendes_colores_vestimenta" class="duendes-input" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_colores_vestimenta', true)); ?>" placeholder="Dorado, Verde bosque, Rojo ancestral... (separar con comas)">
                </div>

                <div class="duendes-field">
                    <label class="duendes-label">Piedras / Cristales</label>
                    <div class="duendes-btn-group" id="duendes-piedras">
                        <?php $piedras = get_post_meta($post->ID, '_duendes_piedras', true) ?: []; ?>
                        <?php foreach(['Cuarzo Rosa', 'Amatista', 'Citrino', 'Turmalina', 'Lapislázuli', 'Obsidiana', 'Jade', 'Ojo de Tigre', 'Selenita', 'Pirita'] as $piedra): ?>
                            <button type="button" class="duendes-chip <?php echo in_array($piedra, (array)$piedras) ? 'active' : ''; ?>" data-value="<?php echo $piedra; ?>"><?php echo $piedra; ?></button>
                        <?php endforeach; ?>
                    </div>
                    <input type="hidden" name="_duendes_piedras" id="_duendes_piedras" value="<?php echo esc_attr(is_array($piedras) ? implode(',', $piedras) : $piedras); ?>">
                </div>

                <div class="duendes-field">
                    <label class="duendes-label">Accesorios Incluidos</label>
                    <textarea name="_duendes_accesorios" class="duendes-textarea" placeholder="Báculo de madera real, péndulo de cuarzo, libro miniatura..."><?php echo esc_textarea(get_post_meta($post->ID, '_duendes_accesorios', true)); ?></textarea>
                </div>
            </div>

            <!-- HISTORIA Y CONTENIDO IA -->
            <div class="duendes-section">
                <h3 class="duendes-section-title">📜 Historia del Guardián</h3>

                <div class="duendes-field">
                    <label class="duendes-label">
                        Historia / Origen
                        <button type="button" class="duendes-gen-btn" onclick="duendesGenerar('historia')">✨ Generar</button>
                    </label>
                    <textarea name="_duendes_historia" id="_duendes_historia" class="duendes-textarea" style="min-height: 150px;" placeholder="La historia de cómo este guardián llegó al mundo..."><?php echo esc_textarea(get_post_meta($post->ID, '_duendes_historia', true)); ?></textarea>
                </div>

                <div class="duendes-field">
                    <label class="duendes-label">
                        Personalidad
                        <button type="button" class="duendes-gen-btn" onclick="duendesGenerar('personalidad')">✨ Generar</button>
                    </label>
                    <textarea name="_duendes_personalidad" id="_duendes_personalidad" class="duendes-textarea" placeholder="Cómo es su carácter, cómo se comunica..."><?php echo esc_textarea(get_post_meta($post->ID, '_duendes_personalidad', true)); ?></textarea>
                </div>

                <div class="duendes-field">
                    <label class="duendes-label">
                        Fortalezas (una por línea)
                        <button type="button" class="duendes-gen-btn" onclick="duendesGenerar('fortalezas')">✨ Generar</button>
                    </label>
                    <textarea name="_duendes_fortalezas" id="_duendes_fortalezas" class="duendes-textarea" placeholder="Protección del hogar&#10;Limpieza energética&#10;Conexión con la naturaleza"><?php echo esc_textarea(get_post_meta($post->ID, '_duendes_fortalezas', true)); ?></textarea>
                </div>

                <div class="duendes-field">
                    <label class="duendes-label">
                        Mensaje de Poder
                        <button type="button" class="duendes-gen-btn" onclick="duendesGenerar('mensaje')">✨ Generar</button>
                    </label>
                    <input type="text" name="_duendes_mensaje_poder" id="_duendes_mensaje_poder" class="duendes-input" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_mensaje_poder', true)); ?>" placeholder="Una frase que define su esencia...">
                </div>

                <div class="duendes-grid">
                    <div class="duendes-field">
                        <label class="duendes-label">
                            Ritual de Bienvenida
                            <button type="button" class="duendes-gen-btn" onclick="duendesGenerar('ritual')">✨ Generar</button>
                        </label>
                        <textarea name="_duendes_ritual" id="_duendes_ritual" class="duendes-textarea" placeholder="Instrucciones para recibir al guardián..."><?php echo esc_textarea(get_post_meta($post->ID, '_duendes_ritual', true)); ?></textarea>
                    </div>
                    <div class="duendes-field">
                        <label class="duendes-label">
                            Cuidados
                            <button type="button" class="duendes-gen-btn" onclick="duendesGenerar('cuidados')">✨ Generar</button>
                        </label>
                        <textarea name="_duendes_cuidados" id="_duendes_cuidados" class="duendes-textarea" placeholder="Ubicación ideal, limpieza energética..."><?php echo esc_textarea(get_post_meta($post->ID, '_duendes_cuidados', true)); ?></textarea>
                    </div>
                </div>
            </div>

            <!-- MÍSTICO -->
            <div class="duendes-section">
                <h3 class="duendes-section-title">🌙 Información Mística</h3>

                <div class="duendes-field">
                    <label class="duendes-label">Fase Lunar Ideal</label>
                    <div class="duendes-btn-group" id="duendes-luna">
                        <?php $luna = get_post_meta($post->ID, '_duendes_fase_luna', true); ?>
                        <button type="button" class="duendes-chip <?php echo $luna == 'nueva' ? 'active' : ''; ?>" data-value="nueva">🌑 Nueva</button>
                        <button type="button" class="duendes-chip <?php echo $luna == 'creciente' ? 'active' : ''; ?>" data-value="creciente">🌒 Creciente</button>
                        <button type="button" class="duendes-chip <?php echo $luna == 'llena' ? 'active' : ''; ?>" data-value="llena">🌕 Llena</button>
                        <button type="button" class="duendes-chip <?php echo $luna == 'menguante' ? 'active' : ''; ?>" data-value="menguante">🌘 Menguante</button>
                    </div>
                    <input type="hidden" name="_duendes_fase_luna" id="_duendes_luna" value="<?php echo esc_attr($luna); ?>">
                </div>

                <div class="duendes-field">
                    <label class="duendes-label">Signos Afines</label>
                    <div class="duendes-btn-group" id="duendes-signos">
                        <?php $signos = get_post_meta($post->ID, '_duendes_signos', true) ?: []; ?>
                        <?php foreach(['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'] as $signo): ?>
                            <button type="button" class="duendes-chip <?php echo in_array($signo, (array)$signos) ? 'active' : ''; ?>" data-value="<?php echo $signo; ?>"><?php echo $signo; ?></button>
                        <?php endforeach; ?>
                    </div>
                    <input type="hidden" name="_duendes_signos" id="_duendes_signos" value="<?php echo esc_attr(is_array($signos) ? implode(',', $signos) : $signos); ?>">
                </div>

                <div class="duendes-grid">
                    <div class="duendes-field">
                        <label class="duendes-label">Hora Más Poderosa</label>
                        <select name="_duendes_hora_poderosa" class="duendes-select">
                            <option value="">Seleccionar...</option>
                            <option value="amanecer" <?php selected(get_post_meta($post->ID, '_duendes_hora_poderosa', true), 'amanecer'); ?>>🌅 Amanecer</option>
                            <option value="mediodia" <?php selected(get_post_meta($post->ID, '_duendes_hora_poderosa', true), 'mediodia'); ?>>☀️ Mediodía</option>
                            <option value="atardecer" <?php selected(get_post_meta($post->ID, '_duendes_hora_poderosa', true), 'atardecer'); ?>>🌇 Atardecer</option>
                            <option value="medianoche" <?php selected(get_post_meta($post->ID, '_duendes_hora_poderosa', true), 'medianoche'); ?>>🌙 Medianoche</option>
                        </select>
                    </div>
                    <div class="duendes-field">
                        <label class="duendes-label">Estación Ideal</label>
                        <select name="_duendes_estacion" class="duendes-select">
                            <option value="">Seleccionar...</option>
                            <option value="primavera" <?php selected(get_post_meta($post->ID, '_duendes_estacion', true), 'primavera'); ?>>🌸 Primavera</option>
                            <option value="verano" <?php selected(get_post_meta($post->ID, '_duendes_estacion', true), 'verano'); ?>>☀️ Verano</option>
                            <option value="otono" <?php selected(get_post_meta($post->ID, '_duendes_estacion', true), 'otono'); ?>>🍂 Otoño</option>
                            <option value="invierno" <?php selected(get_post_meta($post->ID, '_duendes_estacion', true), 'invierno'); ?>>❄️ Invierno</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- INNOVACIONES -->
            <div class="duendes-section">
                <h3 class="duendes-section-title">🆕 Características Exclusivas</h3>

                <div class="duendes-innovacion">
                    <h4>🔐 Código QR de Autenticidad</h4>
                    <p>Se genera automáticamente al publicar. El adoptante escanea para ver certificado e historia.</p>
                </div>

                <div class="duendes-innovacion" style="background: linear-gradient(135deg, rgba(198, 169, 98, 0.1), rgba(198, 169, 98, 0.05)); border-color: rgba(198, 169, 98, 0.3);">
                    <h4 style="color: #C6A962;">🌐 Portal del Guardián</h4>
                    <p>Página privada con actualizaciones de energía y mensajes exclusivos.</p>
                    <label style="display: flex; align-items: center; gap: 8px; margin-top: 10px; color: #e6edf3;">
                        <input type="checkbox" name="_duendes_portal_activo" value="1" <?php checked(get_post_meta($post->ID, '_duendes_portal_activo', true), '1'); ?>>
                        Activar Portal del Guardián
                    </label>
                </div>

                <div class="duendes-field" style="margin-top: 15px;">
                    <label class="duendes-label">Guardianes Relacionados (IDs)</label>
                    <input type="text" name="_duendes_relacionados" class="duendes-input" value="<?php echo esc_attr(get_post_meta($post->ID, '_duendes_relacionados', true)); ?>" placeholder="123, 456, 789 (para árbol genealógico)">
                </div>
            </div>
        </div>
    </div>

    <script>
    const TASAS = {
        USD: { s: '$', t: 1 },
        UYU: { s: '$', t: 43 },
        ARS: { s: '$', t: 1050 },
        EUR: { s: '€', t: 0.92 },
        BRL: { s: 'R$', t: 5.2 },
        MXN: { s: '$', t: 17 },
        CLP: { s: '$', t: 950 },
        COP: { s: '$', t: 4000 }
    };

    function duendesActualizarPrecios() {
        const uyu = document.getElementById('_duendes_precio_uyu').value;
        const container = document.getElementById('duendes-conversiones');
        if (!uyu) { container.innerHTML = ''; return; }

        const usd = parseFloat(uyu) / TASAS.UYU.t;
        let html = '';
        for (const [cod, cfg] of Object.entries(TASAS)) {
            const val = (usd * cfg.t).toLocaleString('es-UY', {maximumFractionDigits: 0});
            html += `<div class="duendes-conversion-card"><small>${cod}</small><strong>${cfg.s}${val}</strong></div>`;
        }
        container.innerHTML = html;
    }

    // Chips únicos
    document.querySelectorAll('#duendes-elementos .duendes-chip, #duendes-luna .duendes-chip').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.duendes-chip').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const inputId = this.parentElement.id.replace('duendes-', '_duendes_');
            document.getElementById(inputId).value = this.dataset.value;
        });
    });

    // Chips múltiples
    document.querySelectorAll('#duendes-propositos .duendes-chip, #duendes-piedras .duendes-chip, #duendes-signos .duendes-chip').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const activos = Array.from(this.parentElement.querySelectorAll('.duendes-chip.active')).map(b => b.dataset.value);
            const inputId = this.parentElement.id.replace('duendes-', '_duendes_');
            document.getElementById(inputId).value = activos.join(',');
        });
    });

    async function duendesGenerar(campo) {
        const loading = document.getElementById('duendes-loading');
        loading.style.display = 'block';

        const datos = {
            campo: campo,
            nombre: document.getElementById('title')?.value || '',
            tipo: document.getElementById('_duendes_tipo').value,
            elemento: document.getElementById('_duendes_elemento').value,
            propositos: document.getElementById('_duendes_propositos').value
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
            alert('Error al generar. Intentá de nuevo.');
        }
        loading.style.display = 'none';
    }

    async function duendesGenerarTodo() {
        const loading = document.getElementById('duendes-loading');
        loading.style.display = 'block';

        const datos = {
            campo: 'todo',
            nombre: document.getElementById('title')?.value || '',
            tipo: document.getElementById('_duendes_tipo').value,
            elemento: document.getElementById('_duendes_elemento').value,
            propositos: document.getElementById('_duendes_propositos').value,
            piedras: document.getElementById('_duendes_piedras').value
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
                ['historia', 'personalidad', 'fortalezas', 'ritual', 'cuidados'].forEach(c => {
                    if (data[c]) document.getElementById('_duendes_' + c).value = data[c];
                });
                if (data.mensaje) document.getElementById('_duendes_mensaje_poder').value = data.mensaje;
                document.getElementById('duendes-estado').innerHTML = '✅ Generado';
                document.getElementById('duendes-estado').style.background = '#238636';
                document.getElementById('duendes-estado').style.color = '#fff';
            }
        } catch (e) {
            alert('Error al generar. Intentá de nuevo.');
        }
        loading.style.display = 'none';
    }

    duendesActualizarPrecios();
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// GUARDAR META DATA
// ═══════════════════════════════════════════════════════════════════════════

add_action('save_post_product', 'duendes_guardar_meta');
function duendes_guardar_meta($post_id) {
    if (!isset($_POST['duendes_guardian_nonce']) ||
        !wp_verify_nonce($_POST['duendes_guardian_nonce'], 'duendes_guardian_save')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $campos = [
        '_duendes_precio_uyu',
        '_duendes_que_es',
        '_duendes_pieza_unica',
        '_duendes_tipo',
        '_duendes_genero',
        '_duendes_elemento',
        '_duendes_altura',
        '_duendes_ancho',
        '_duendes_profundidad',
        '_duendes_color_ojos',
        '_duendes_color_cabello',
        '_duendes_colores_vestimenta',
        '_duendes_accesorios',
        '_duendes_historia',
        '_duendes_personalidad',
        '_duendes_fortalezas',
        '_duendes_mensaje_poder',
        '_duendes_ritual',
        '_duendes_cuidados',
        '_duendes_fase_luna',
        '_duendes_hora_poderosa',
        '_duendes_estacion',
        '_duendes_relacionados',
    ];

    foreach ($campos as $campo) {
        if (isset($_POST[$campo])) {
            update_post_meta($post_id, $campo, sanitize_textarea_field($_POST[$campo]));
        }
    }

    // Arrays
    foreach (['_duendes_propositos', '_duendes_piedras', '_duendes_signos'] as $campo) {
        if (isset($_POST[$campo])) {
            $valores = array_filter(explode(',', sanitize_text_field($_POST[$campo])));
            update_post_meta($post_id, $campo, $valores);
        }
    }

    // Checkbox
    update_post_meta($post_id, '_duendes_portal_activo', isset($_POST['_duendes_portal_activo']) ? '1' : '0');
}
