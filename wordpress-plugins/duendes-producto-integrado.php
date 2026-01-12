<?php
/**
 * Plugin Name: Duendes Producto Integrado
 * Description: TODO integrado en la pagina de producto - datos, historia IA, SEO automatico
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════
// METABOX PRINCIPAL EN PAGINA DE PRODUCTO
// ═══════════════════════════════════════════════════════════════

add_action('add_meta_boxes', function() {
    add_meta_box(
        'duendes_producto_magico',
        '✨ Datos del Producto Mágico + IA',
        'duendes_metabox_principal',
        'product',
        'normal',
        'high'
    );
});

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

    // Dimensiones fisicas
    $peso_g = get_post_meta($post->ID, '_guardian_peso', true) ?: '';
    $ancho_cm = get_post_meta($post->ID, '_guardian_ancho', true) ?: '';
    $profundidad_cm = get_post_meta($post->ID, '_guardian_profundidad', true) ?: '';

    // SEO
    $seo_titulo = get_post_meta($post->ID, '_duendes_seo_titulo', true) ?: '';
    $seo_descripcion = get_post_meta($post->ID, '_duendes_seo_descripcion', true) ?: '';
    $seo_keywords = get_post_meta($post->ID, '_duendes_seo_keywords', true) ?: '';

    // Historia generada
    $historia = get_post_meta($post->ID, '_guardian_historia', true);
    $fecha_generado = get_post_meta($post->ID, '_historia_fecha', true);

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
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
        }
        .duendes-row:last-child {
            margin-bottom: 0;
        }
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
        .duendes-field textarea {
            min-height: 80px;
            resize: vertical;
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
            margin-bottom: 20px;
        }
        .tipo-tab {
            padding: 10px 18px;
            background: #21262d;
            border: 1px solid #30363d;
            border-radius: 8px;
            color: #8b949e;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
        }
        .tipo-tab:hover {
            border-color: #C6A962;
            color: #fff;
        }
        .tipo-tab.active {
            background: rgba(198, 169, 98, 0.15);
            border-color: #C6A962;
            color: #C6A962;
        }
        .tipo-tab input {
            display: none;
        }

        /* Secciones condicionales */
        .seccion-guardian { display: none; }
        .seccion-virtual { display: none; }
        .seccion-membresia { display: none; }
        .seccion-cristal { display: none; }
        .seccion-accesorio { display: none; }
        .seccion-libro { display: none; }
        .seccion-estudio { display: none; }

        [data-tipo="guardian"] .seccion-guardian { display: block; }
        [data-tipo="virtual"] .seccion-virtual { display: block; }
        [data-tipo="membresia"] .seccion-membresia { display: block; }
        [data-tipo="cristal"] .seccion-cristal { display: block; }
        [data-tipo="accesorio"] .seccion-accesorio { display: block; }
        [data-tipo="libro"] .seccion-libro { display: block; }
        [data-tipo="estudio"] .seccion-estudio { display: block; }

        /* Boton generar */
        .btn-generar {
            background: linear-gradient(135deg, #C6A962, #a88a42);
            color: #0a0a0a;
            border: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
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
        .btn-generar:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        .btn-secondary {
            background: #21262d;
            color: #8b949e;
            border: 1px solid #30363d;
        }
        .btn-secondary:hover {
            border-color: #C6A962;
            color: #fff;
        }

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

        /* Historia preview */
        .historia-preview {
            background: #21262d;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            max-height: 300px;
            overflow-y: auto;
        }
        .historia-preview h4 {
            color: #C6A962;
            font-size: 13px;
            margin: 0 0 10px 0;
        }
        .historia-preview p {
            color: #8b949e;
            font-size: 13px;
            line-height: 1.6;
            margin: 0;
        }
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

        /* SEO section */
        .seo-preview {
            background: #21262d;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
        }
        .seo-preview-title {
            color: #1a0dab;
            font-size: 18px;
            margin: 0 0 5px 0;
            font-family: Arial, sans-serif;
        }
        .seo-preview-url {
            color: #006621;
            font-size: 13px;
            margin: 0 0 5px 0;
            font-family: Arial, sans-serif;
        }
        .seo-preview-desc {
            color: #545454;
            font-size: 13px;
            line-height: 1.4;
            margin: 0;
            font-family: Arial, sans-serif;
        }
    </style>

    <div class="duendes-box" id="duendes-main-box" data-tipo="<?php echo esc_attr($tipo_producto); ?>">

        <!-- TIPO DE PRODUCTO -->
        <div class="duendes-section">
            <h3 class="duendes-section-title">📦 Tipo de Producto</h3>
            <div class="tipo-producto-tabs">
                <label class="tipo-tab <?php echo $tipo_producto === 'guardian' ? 'active' : ''; ?>">
                    <input type="radio" name="_duendes_tipo_producto" value="guardian" <?php checked($tipo_producto, 'guardian'); ?>>
                    🧙 Guardián Físico
                </label>
                <label class="tipo-tab <?php echo $tipo_producto === 'virtual' ? 'active' : ''; ?>">
                    <input type="radio" name="_duendes_tipo_producto" value="virtual" <?php checked($tipo_producto, 'virtual'); ?>>
                    💎 Runas / Virtual
                </label>
                <label class="tipo-tab <?php echo $tipo_producto === 'membresia' ? 'active' : ''; ?>">
                    <input type="radio" name="_duendes_tipo_producto" value="membresia" <?php checked($tipo_producto, 'membresia'); ?>>
                    ⭐ Membresía Círculo
                </label>
                <label class="tipo-tab <?php echo $tipo_producto === 'cristal' ? 'active' : ''; ?>">
                    <input type="radio" name="_duendes_tipo_producto" value="cristal" <?php checked($tipo_producto, 'cristal'); ?>>
                    💠 Cristal / Piedra
                </label>
                <label class="tipo-tab <?php echo $tipo_producto === 'accesorio' ? 'active' : ''; ?>">
                    <input type="radio" name="_duendes_tipo_producto" value="accesorio" <?php checked($tipo_producto, 'accesorio'); ?>>
                    📿 Accesorio / Joya
                </label>
                <label class="tipo-tab <?php echo $tipo_producto === 'libro' ? 'active' : ''; ?>">
                    <input type="radio" name="_duendes_tipo_producto" value="libro" <?php checked($tipo_producto, 'libro'); ?>>
                    📚 Libro / Ebook
                </label>
                <label class="tipo-tab <?php echo $tipo_producto === 'estudio' ? 'active' : ''; ?>">
                    <input type="radio" name="_duendes_tipo_producto" value="estudio" <?php checked($tipo_producto, 'estudio'); ?>>
                    🔮 Estudio / Consulta
                </label>
            </div>
        </div>

        <!-- SECCION GUARDIAN FISICO -->
        <div class="duendes-section seccion-guardian">
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
                            <option value="Trasgo" <?php selected($tipo_ser, 'Trasgo'); ?>>Trasgo</option>
                            <option value="Driade" <?php selected($tipo_ser, 'Driade'); ?>>Dríade</option>
                        </optgroup>
                        <optgroup label="Practicantes de Magia">
                            <option value="Bruja" <?php selected($tipo_ser, 'Bruja'); ?>>Bruja</option>
                            <option value="Brujo" <?php selected($tipo_ser, 'Brujo'); ?>>Brujo</option>
                            <option value="Mago" <?php selected($tipo_ser, 'Mago'); ?>>Mago</option>
                            <option value="Hechicero" <?php selected($tipo_ser, 'Hechicero'); ?>>Hechicero</option>
                            <option value="Hechicera" <?php selected($tipo_ser, 'Hechicera'); ?>>Hechicera</option>
                            <option value="Archimago" <?php selected($tipo_ser, 'Archimago'); ?>>Archimago</option>
                        </optgroup>
                        <optgroup label="Místicos y Videntes">
                            <option value="Chaman" <?php selected($tipo_ser, 'Chaman'); ?>>Chamán</option>
                            <option value="Druida" <?php selected($tipo_ser, 'Druida'); ?>>Druida</option>
                            <option value="Oraculo" <?php selected($tipo_ser, 'Oraculo'); ?>>Oráculo</option>
                            <option value="Vidente" <?php selected($tipo_ser, 'Vidente'); ?>>Vidente</option>
                            <option value="Alquimista" <?php selected($tipo_ser, 'Alquimista'); ?>>Alquimista</option>
                        </optgroup>
                        <optgroup label="Espíritus y Guardianes">
                            <option value="Guardian" <?php selected($tipo_ser, 'Guardian'); ?>>Guardián</option>
                            <option value="Protector" <?php selected($tipo_ser, 'Protector'); ?>>Protector</option>
                            <option value="Sanador" <?php selected($tipo_ser, 'Sanador'); ?>>Sanador</option>
                            <option value="Espiritu" <?php selected($tipo_ser, 'Espiritu'); ?>>Espíritu</option>
                        </optgroup>
                    </select>
                </div>
                <div class="duendes-field">
                    <label>Género</label>
                    <select name="_guardian_genero" id="guardian_genero">
                        <option value="femenino" <?php selected($genero, 'femenino'); ?>>Femenino</option>
                        <option value="masculino" <?php selected($genero, 'masculino'); ?>>Masculino</option>
                        <option value="neutro" <?php selected($genero, 'neutro'); ?>>Neutro / Sin definir</option>
                    </select>
                </div>
                <div class="duendes-field">
                    <label>Color de Ojos</label>
                    <input type="text" name="_guardian_ojos" id="guardian_ojos" value="<?php echo esc_attr($color_ojos); ?>" placeholder="ej: celestes, verdes brillantes...">
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
                        <option value="Luz" <?php selected($elemento, 'Luz'); ?>>☀️ Luz</option>
                        <option value="Sombra" <?php selected($elemento, 'Sombra'); ?>>🌙 Sombra</option>
                        <option value="Cristal" <?php selected($elemento, 'Cristal'); ?>>💎 Cristal</option>
                    </select>
                </div>
                <div class="duendes-field">
                    <label>Propósito / Categoría</label>
                    <select name="_guardian_proposito" id="guardian_proposito">
                        <option value="Que Claude decida" <?php selected($proposito, 'Que Claude decida'); ?>>Claude decide</option>
                        <option value="Proteccion" <?php selected($proposito, 'Proteccion'); ?>>🛡️ Protección</option>
                        <option value="Amor" <?php selected($proposito, 'Amor'); ?>>💜 Amor</option>
                        <option value="Abundancia" <?php selected($proposito, 'Abundancia'); ?>>✨ Abundancia / Dinero</option>
                        <option value="Sanacion" <?php selected($proposito, 'Sanacion'); ?>>🌿 Sanación / Salud</option>
                        <option value="Sabiduria" <?php selected($proposito, 'Sabiduria'); ?>>🔮 Sabiduría / Guía</option>
                    </select>
                </div>
            </div>

            <div class="duendes-row">
                <div class="duendes-field" style="grid-column: 1 / -1;">
                    <label>Accesorios / Detalles Físicos</label>
                    <input type="text" name="_guardian_accesorios" id="guardian_accesorios" value="<?php echo esc_attr($accesorios); ?>" placeholder="ej: escoba, calabaza, sombrero puntiagudo, flores en el pelo, capa azul...">
                    <small>Describe todo lo que se ve en la figura: ropa, objetos, detalles especiales</small>
                </div>
            </div>

            <div class="duendes-row">
                <div class="duendes-field" style="grid-column: 1 / -1;">
                    <label>Notas adicionales para Claude</label>
                    <textarea name="_guardian_notas" id="guardian_notas" placeholder="ej: es anciana, tiene aspecto misterioso, parece sabio..."><?php echo esc_textarea($notas); ?></textarea>
                </div>
            </div>
        </div>

        <!-- DIMENSIONES FISICAS (para productos fisicos) -->
        <div class="duendes-section seccion-guardian seccion-cristal seccion-accesorio">
            <h3 class="duendes-section-title">📏 Dimensiones Físicas</h3>
            <div class="duendes-row">
                <div class="duendes-field">
                    <label>Altura (cm)</label>
                    <input type="number" name="_guardian_altura" id="guardian_altura" value="<?php echo esc_attr($altura_cm); ?>" min="1" max="200" step="0.5">
                </div>
                <div class="duendes-field">
                    <label>Ancho (cm)</label>
                    <input type="number" name="_guardian_ancho" value="<?php echo esc_attr($ancho_cm); ?>" min="1" max="200" step="0.5">
                </div>
                <div class="duendes-field">
                    <label>Profundidad (cm)</label>
                    <input type="number" name="_guardian_profundidad" value="<?php echo esc_attr($profundidad_cm); ?>" min="1" max="200" step="0.5">
                </div>
                <div class="duendes-field">
                    <label>Peso (gramos)</label>
                    <input type="number" name="_guardian_peso" value="<?php echo esc_attr($peso_g); ?>" min="1" max="50000" step="1">
                </div>
            </div>
        </div>

        <!-- SECCION VIRTUAL -->
        <div class="duendes-section seccion-virtual">
            <h3 class="duendes-section-title">💎 Producto Virtual</h3>
            <div class="duendes-row">
                <div class="duendes-field">
                    <label>Tipo de producto virtual</label>
                    <select name="_virtual_tipo">
                        <option value="runas">Runas de Poder</option>
                        <option value="monedas">Monedas Mágicas</option>
                        <option value="tokens">Tokens Energéticos</option>
                        <option value="creditos">Créditos para servicios</option>
                    </select>
                </div>
                <div class="duendes-field">
                    <label>Cantidad incluida</label>
                    <input type="number" name="_virtual_cantidad" value="1" min="1">
                </div>
            </div>
        </div>

        <!-- SECCION MEMBRESIA -->
        <div class="duendes-section seccion-membresia">
            <h3 class="duendes-section-title">⭐ Plan del Círculo</h3>
            <div class="duendes-row">
                <div class="duendes-field">
                    <label>Tipo de membresía</label>
                    <select name="_membresia_tipo">
                        <option value="mensual">Mensual</option>
                        <option value="trimestral">Trimestral</option>
                        <option value="anual">Anual</option>
                        <option value="vitalicia">Vitalicia</option>
                    </select>
                </div>
                <div class="duendes-field">
                    <label>Beneficios incluidos</label>
                    <textarea name="_membresia_beneficios" placeholder="Lista de beneficios..."></textarea>
                </div>
            </div>
        </div>

        <!-- SECCION CRISTAL -->
        <div class="duendes-section seccion-cristal">
            <h3 class="duendes-section-title">💠 Datos del Cristal</h3>
            <div class="duendes-row">
                <div class="duendes-field">
                    <label>Tipo de piedra</label>
                    <select name="_cristal_tipo">
                        <option value="cuarzo_claro">Cuarzo Claro</option>
                        <option value="amatista">Amatista</option>
                        <option value="cuarzo_rosa">Cuarzo Rosa</option>
                        <option value="citrino">Citrino</option>
                        <option value="obsidiana">Obsidiana</option>
                        <option value="turmalina">Turmalina</option>
                        <option value="labradorita">Labradorita</option>
                        <option value="selenita">Selenita</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>
                <div class="duendes-field">
                    <label>Propiedades energéticas</label>
                    <input type="text" name="_cristal_propiedades" placeholder="ej: limpieza energética, protección...">
                </div>
            </div>
        </div>

        <!-- SECCION ACCESORIO -->
        <div class="duendes-section seccion-accesorio">
            <h3 class="duendes-section-title">📿 Datos del Accesorio</h3>
            <div class="duendes-row">
                <div class="duendes-field">
                    <label>Tipo de accesorio</label>
                    <select name="_accesorio_tipo">
                        <option value="collar">Collar</option>
                        <option value="pulsera">Pulsera</option>
                        <option value="anillo">Anillo</option>
                        <option value="pendientes">Pendientes</option>
                        <option value="colgante">Colgante</option>
                        <option value="amuleto">Amuleto</option>
                    </select>
                </div>
                <div class="duendes-field">
                    <label>Material principal</label>
                    <input type="text" name="_accesorio_material" placeholder="ej: plata, cuero, piedras naturales...">
                </div>
            </div>
        </div>

        <!-- SECCION LIBRO -->
        <div class="duendes-section seccion-libro">
            <h3 class="duendes-section-title">📚 Datos del Libro</h3>
            <div class="duendes-row">
                <div class="duendes-field">
                    <label>Formato</label>
                    <select name="_libro_formato">
                        <option value="ebook">Ebook (PDF)</option>
                        <option value="fisico">Libro físico</option>
                        <option value="ambos">Ambos formatos</option>
                    </select>
                </div>
                <div class="duendes-field">
                    <label>Número de páginas</label>
                    <input type="number" name="_libro_paginas" min="1">
                </div>
                <div class="duendes-field">
                    <label>Tema principal</label>
                    <input type="text" name="_libro_tema" placeholder="ej: magia natural, rituales...">
                </div>
            </div>
        </div>

        <!-- SECCION ESTUDIO -->
        <div class="duendes-section seccion-estudio">
            <h3 class="duendes-section-title">🔮 Datos del Estudio/Consulta</h3>
            <div class="duendes-row">
                <div class="duendes-field">
                    <label>Tipo de servicio</label>
                    <select name="_estudio_tipo">
                        <option value="carta_astral">Carta Astral</option>
                        <option value="lectura_tarot">Lectura de Tarot</option>
                        <option value="canalizacion">Canalización</option>
                        <option value="limpieza">Limpieza Energética</option>
                        <option value="consulta">Consulta General</option>
                    </select>
                </div>
                <div class="duendes-field">
                    <label>Duración aproximada</label>
                    <select name="_estudio_duracion">
                        <option value="30">30 minutos</option>
                        <option value="60">1 hora</option>
                        <option value="90">1.5 horas</option>
                        <option value="120">2 horas</option>
                    </select>
                </div>
                <div class="duendes-field">
                    <label>Modalidad</label>
                    <select name="_estudio_modalidad">
                        <option value="online">Online (Zoom/Meet)</option>
                        <option value="presencial">Presencial</option>
                        <option value="escrito">Informe escrito</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- GENERADOR DE HISTORIA CON IA -->
        <div class="duendes-section seccion-guardian">
            <h3 class="duendes-section-title">🤖 Generador de Historia con IA</h3>

            <?php if ($historia && $fecha_generado): ?>
                <div class="historia-badge">
                    ✓ Historia generada el <?php echo date('d/m/Y H:i', strtotime($fecha_generado)); ?>
                </div>
            <?php else: ?>
                <div class="historia-badge pending">
                    ○ Sin historia generada
                </div>
            <?php endif; ?>

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button type="button" class="btn-generar" id="btn-generar-historia">
                    <?php echo $historia ? '🔄 Regenerar Historia' : '✨ Generar Historia'; ?>
                </button>
                <button type="button" class="btn-generar btn-secondary" id="btn-generar-seo">
                    🎯 Generar SEO
                </button>
                <button type="button" class="btn-generar btn-secondary" id="btn-generar-todo">
                    ⚡ Generar TODO (Historia + SEO)
                </button>
            </div>

            <div class="gen-status" id="gen-status"></div>

            <?php if ($historia):
                $historia_data = json_decode($historia, true);
            ?>
            <div class="historia-preview">
                <h4>Vista previa de la historia</h4>
                <p><?php echo esc_html(mb_substr($historia_data['origen'] ?? '', 0, 500)); ?>...</p>
            </div>
            <?php endif; ?>
        </div>

        <!-- SEO -->
        <div class="duendes-section">
            <h3 class="duendes-section-title">🎯 SEO (Generado por IA)</h3>

            <div class="duendes-row">
                <div class="duendes-field" style="grid-column: 1 / -1;">
                    <label>Título SEO (max 60 caracteres)</label>
                    <input type="text" name="_duendes_seo_titulo" id="seo_titulo" value="<?php echo esc_attr($seo_titulo); ?>" maxlength="60">
                    <small>Caracteres: <span id="seo-titulo-count"><?php echo strlen($seo_titulo); ?></span>/60</small>
                </div>
            </div>

            <div class="duendes-row">
                <div class="duendes-field" style="grid-column: 1 / -1;">
                    <label>Meta Descripción (max 160 caracteres)</label>
                    <textarea name="_duendes_seo_descripcion" id="seo_descripcion" maxlength="160"><?php echo esc_textarea($seo_descripcion); ?></textarea>
                    <small>Caracteres: <span id="seo-desc-count"><?php echo strlen($seo_descripcion); ?></span>/160</small>
                </div>
            </div>

            <div class="duendes-row">
                <div class="duendes-field" style="grid-column: 1 / -1;">
                    <label>Palabras clave (separadas por coma)</label>
                    <input type="text" name="_duendes_seo_keywords" id="seo_keywords" value="<?php echo esc_attr($seo_keywords); ?>">
                </div>
            </div>

            <?php if ($seo_titulo || $seo_descripcion): ?>
            <div class="seo-preview">
                <div class="seo-preview-title"><?php echo esc_html($seo_titulo ?: get_the_title($post->ID)); ?></div>
                <div class="seo-preview-url">duendesuy.10web.cloud › <?php echo sanitize_title(get_the_title($post->ID)); ?></div>
                <div class="seo-preview-desc"><?php echo esc_html($seo_descripcion ?: 'Descripción del producto...'); ?></div>
            </div>
            <?php endif; ?>
        </div>

    </div>

    <script>
    jQuery(document).ready(function($) {
        // Cambio de tipo de producto
        $('.tipo-tab input').on('change', function() {
            const tipo = $(this).val();
            $('.tipo-tab').removeClass('active');
            $(this).closest('.tipo-tab').addClass('active');
            $('#duendes-main-box').attr('data-tipo', tipo);
        });

        // Contador SEO
        $('#seo_titulo').on('input', function() {
            $('#seo-titulo-count').text($(this).val().length);
        });
        $('#seo_descripcion').on('input', function() {
            $('#seo-desc-count').text($(this).val().length);
        });

        // Generar historia
        $('#btn-generar-historia').on('click', function() {
            generarContenido('historia');
        });

        // Generar SEO
        $('#btn-generar-seo').on('click', function() {
            generarContenido('seo');
        });

        // Generar todo
        $('#btn-generar-todo').on('click', function() {
            generarContenido('todo');
        });

        function generarContenido(tipo) {
            const $status = $('#gen-status');
            const $btn = $('#btn-generar-' + (tipo === 'todo' ? 'todo' : tipo === 'historia' ? 'historia' : 'seo'));

            $btn.prop('disabled', true);
            $status.removeClass('success error').addClass('loading').text('Generando con Claude... (30-60 segundos)').show();

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
                generarSeo: tipo === 'seo' || tipo === 'todo',
                generarHistoria: tipo === 'historia' || tipo === 'todo'
            };

            $.ajax({
                url: 'https://duendes-vercel.vercel.app/api/admin/productos/generar-historia',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(datos),
                success: function(res) {
                    if (res.success) {
                        $status.removeClass('loading').addClass('success').text('¡Contenido generado exitosamente! Guardá el producto para aplicar los cambios.');

                        // Actualizar SEO si se generó
                        if (res.contenido?.seo) {
                            $('#seo_titulo').val(res.contenido.seo.titulo).trigger('input');
                            $('#seo_descripcion').val(res.contenido.seo.descripcion).trigger('input');
                            $('#seo_keywords').val(res.contenido.seo.keywords);
                        }

                        // Recargar después de 2 segundos
                        setTimeout(function() {
                            location.reload();
                        }, 2000);
                    } else {
                        $status.removeClass('loading').addClass('error').text('Error: ' + (res.error || 'desconocido'));
                    }
                },
                error: function(xhr, status, error) {
                    $status.removeClass('loading').addClass('error').text('Error de conexión: ' + error);
                },
                complete: function() {
                    $btn.prop('disabled', false);
                }
            });
        }
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════
// GUARDAR DATOS
// ═══════════════════════════════════════════════════════════════

add_action('save_post_product', function($post_id) {
    if (!isset($_POST['duendes_nonce']) || !wp_verify_nonce($_POST['duendes_nonce'], 'duendes_producto_nonce')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    // Guardar tipo de producto
    if (isset($_POST['_duendes_tipo_producto'])) {
        update_post_meta($post_id, '_duendes_tipo_producto', sanitize_text_field($_POST['_duendes_tipo_producto']));
    }

    // Guardar datos del guardian
    $campos_guardian = ['_guardian_tipo', '_guardian_genero', '_guardian_altura', '_guardian_ojos', '_guardian_accesorios', '_guardian_elemento', '_guardian_proposito', '_guardian_notas', '_guardian_peso', '_guardian_ancho', '_guardian_profundidad'];

    foreach ($campos_guardian as $campo) {
        if (isset($_POST[$campo])) {
            update_post_meta($post_id, $campo, sanitize_text_field($_POST[$campo]));
        }
    }

    // Guardar SEO
    $campos_seo = ['_duendes_seo_titulo', '_duendes_seo_descripcion', '_duendes_seo_keywords'];
    foreach ($campos_seo as $campo) {
        if (isset($_POST[$campo])) {
            update_post_meta($post_id, $campo, sanitize_text_field($_POST[$campo]));
        }
    }

    // Guardar campos específicos por tipo
    $campos_extra = ['_virtual_tipo', '_virtual_cantidad', '_membresia_tipo', '_membresia_beneficios', '_cristal_tipo', '_cristal_propiedades', '_accesorio_tipo', '_accesorio_material', '_libro_formato', '_libro_paginas', '_libro_tema', '_estudio_tipo', '_estudio_duracion', '_estudio_modalidad'];

    foreach ($campos_extra as $campo) {
        if (isset($_POST[$campo])) {
            update_post_meta($post_id, $campo, sanitize_textarea_field($_POST[$campo]));
        }
    }
});

// ═══════════════════════════════════════════════════════════════
// AGREGAR META TAGS SEO AL HEAD
// ═══════════════════════════════════════════════════════════════

add_action('wp_head', function() {
    if (!is_product()) return;

    global $post;
    $seo_titulo = get_post_meta($post->ID, '_duendes_seo_titulo', true);
    $seo_descripcion = get_post_meta($post->ID, '_duendes_seo_descripcion', true);
    $seo_keywords = get_post_meta($post->ID, '_duendes_seo_keywords', true);

    if ($seo_descripcion) {
        echo '<meta name="description" content="' . esc_attr($seo_descripcion) . '">' . "\n";
    }
    if ($seo_keywords) {
        echo '<meta name="keywords" content="' . esc_attr($seo_keywords) . '">' . "\n";
    }
}, 1);

// Modificar titulo SEO
add_filter('pre_get_document_title', function($title) {
    if (is_product()) {
        global $post;
        $seo_titulo = get_post_meta($post->ID, '_duendes_seo_titulo', true);
        if ($seo_titulo) {
            return $seo_titulo . ' - Duendes del Uruguay';
        }
    }
    return $title;
}, 999);
