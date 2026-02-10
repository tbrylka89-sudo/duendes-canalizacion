<?php
/**
 * Plugin Name: Duendes - Ficha del Guardián
 * Description: Sistema completo de fichas para guardianes con IA integrada
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN Y DATOS
// ═══════════════════════════════════════════════════════════════

class DuendesFichaGuardian {

    private static $instance = null;
    private $api_url = 'https://duendes-vercel.vercel.app/api';

    public static function instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {
        add_action('add_meta_boxes', [$this, 'agregar_metabox']);
        add_action('save_post_product', [$this, 'guardar_ficha']);
        add_action('admin_enqueue_scripts', [$this, 'cargar_assets_admin']);
        add_action('wp_enqueue_scripts', [$this, 'cargar_assets_frontend']);
        add_filter('woocommerce_product_tabs', [$this, 'agregar_tab_ficha']);
        add_action('woocommerce_single_product_summary', [$this, 'mostrar_subtitulo'], 6);
        add_action('wp_ajax_duendes_generar_ficha_ia', [$this, 'ajax_generar_ficha']);
        add_action('wp_ajax_duendes_auto_completar_ficha', [$this, 'ajax_auto_completar_ficha']);
        add_action('wp_ajax_duendes_guardar_ficha', [$this, 'ajax_guardar_ficha']);

        // Limpiar metaboxes viejos que no se usan
        add_action('add_meta_boxes', [$this, 'limpiar_metaboxes_viejos'], 99);
    }

    // ═══════════════════════════════════════════════════════════════
    // DATOS DE CONFIGURACIÓN
    // ═══════════════════════════════════════════════════════════════

    public function get_especies() {
        return [
            'clasicas' => [
                'duende' => ['nombre' => 'Duende', 'fem' => 'Duenda', 'desc' => 'Seres ancestrales protectores del hogar y la familia.'],
                'pixie' => ['nombre' => 'Pixie', 'fem' => 'Pixie', 'desc' => 'Almas salvajes de la naturaleza, eternas niñas tiernas. Siempre únicas.'],
                'leprechaun' => ['nombre' => 'Leprechaun', 'fem' => 'Leprechaun', 'desc' => 'Guardianes ancestrales irlandeses de fortuna y prosperidad.'],
                'elfo' => ['nombre' => 'Elfo', 'fem' => 'Elfa', 'desc' => 'Seres de luz y sabiduría milenaria.'],
                'hada' => ['nombre' => 'Hada', 'fem' => 'Hada', 'desc' => 'Seres etéreos entre el mundo visible e invisible.'],
                'bruja' => ['nombre' => 'Brujo', 'fem' => 'Bruja', 'desc' => 'Conocedores de las artes antiguas y misterios de la naturaleza.'],
                'vikingo' => ['nombre' => 'Vikingo', 'fem' => 'Vikinga', 'desc' => 'Guerreros del norte con espíritu indomable.'],
                'chaman' => ['nombre' => 'Chamán', 'fem' => 'Chamana', 'desc' => 'Puentes entre mundos, sanadores del alma.'],
                'sanador' => ['nombre' => 'Sanador', 'fem' => 'Sanadora', 'desc' => 'Canalizadores de energía curativa.'],
                'guerrero' => ['nombre' => 'Guerrero', 'fem' => 'Guerrera', 'desc' => 'Protectores fieros que enfrentan cualquier batalla.'],
                'maestro' => ['nombre' => 'Maestro', 'fem' => 'Maestra', 'desc' => 'Seres de sabiduría profunda.'],
                'hechicero' => ['nombre' => 'Hechicero', 'fem' => 'Hechicera', 'desc' => 'Manipuladores de energías sutiles.'],
                'druida' => ['nombre' => 'Druida', 'fem' => 'Druida', 'desc' => 'Sacerdotes de la naturaleza.'],
                'alquimista' => ['nombre' => 'Alquimista', 'fem' => 'Alquimista', 'desc' => 'Transformadores de lo ordinario en extraordinario.'],
                'oraculo' => ['nombre' => 'Oráculo', 'fem' => 'Oráculo', 'desc' => 'Canales de mensajes del universo.'],
            ],
            'exclusivas' => [
                'luminide' => ['nombre' => 'Lumínide', 'fem' => 'Lumínide', 'desc' => 'Seres nacidos de la primera luz del amanecer uruguayo. Disipan confusiones.', 'exclusivo' => true],
                'terralma' => ['nombre' => 'Terralma', 'fem' => 'Terralma', 'desc' => 'Guardianes que fusionan tierra y alma. Arraigan y estabilizan.', 'exclusivo' => true],
                'velarian' => ['nombre' => 'Velarián', 'fem' => 'Velariana', 'desc' => 'Custodios de los velos entre mundos. Protegen en transiciones.', 'exclusivo' => true],
                'florian' => ['nombre' => 'Florián', 'fem' => 'Floriana', 'desc' => 'Encarnan el espíritu del florecimiento. Ayudan a que todo brote.', 'exclusivo' => true],
            ],
            'arquetipos' => [
                'merlin' => ['nombre' => 'Merlín', 'desc' => 'El arquetipo del mago sabio.', 'recreable' => true],
                'gandalf' => ['nombre' => 'Gandalf', 'desc' => 'El caminante gris, guía de los perdidos.', 'recreable' => true],
                'morgana' => ['nombre' => 'Morgana', 'desc' => 'La hechicera de los misterios femeninos.', 'recreable' => true],
            ]
        ];
    }

    public function get_categorias() {
        return [
            'proteccion' => [
                'nombre' => 'Protección',
                'subs' => ['hogar' => 'Del Hogar', 'personal' => 'Personal', 'familiar' => 'Familiar', 'envidias' => 'Contra Envidias', 'energetica' => 'Energética', 'viajes' => 'En Viajes']
            ],
            'abundancia' => [
                'nombre' => 'Abundancia',
                'subs' => ['dinero' => 'Dinero', 'oportunidades' => 'Oportunidades', 'negocios' => 'Negocios', 'trabajo' => 'Trabajo', 'bloqueos' => 'Desbloqueo', 'merecimiento' => 'Merecimiento']
            ],
            'amor' => [
                'nombre' => 'Amor',
                'subs' => ['pareja' => 'Pareja', 'autoamor' => 'Amor Propio', 'familia' => 'Familiar', 'amistades' => 'Amistades', 'perdidas' => 'Pérdidas', 'fertilidad' => 'Fertilidad']
            ],
            'sanacion' => [
                'nombre' => 'Sanación',
                'subs' => ['emocional' => 'Emocional', 'generacional' => 'Generacional', 'fisica' => 'Física', 'energetica' => 'Energética', 'relacional' => 'Relacional', 'trauma' => 'Trauma', 'duelo' => 'Duelo']
            ],
            'salud' => [
                'nombre' => 'Salud',
                'subs' => ['fisica' => 'Física', 'mental' => 'Mental', 'sueno' => 'Sueño', 'habitos' => 'Hábitos', 'vitalidad' => 'Vitalidad']
            ],
            'sabiduria' => [
                'nombre' => 'Sabiduría',
                'subs' => ['estudios' => 'Estudios', 'decisiones' => 'Decisiones', 'intuicion' => 'Intuición', 'creatividad' => 'Creatividad', 'proposito' => 'Propósito']
            ],
            'conexion_espiritual' => [
                'nombre' => 'Conexión Espiritual',
                'subs' => ['ancestros' => 'Ancestros', 'guias' => 'Guías', 'meditacion' => 'Meditación', 'despertar' => 'Despertar', 'proteccion_astral' => 'Astral']
            ],
            'transformacion' => [
                'nombre' => 'Transformación',
                'subs' => ['crisis' => 'Crisis', 'renacimiento' => 'Renacimiento', 'soltar' => 'Soltar', 'empoderamiento' => 'Empoderamiento', 'transiciones' => 'Transiciones']
            ]
        ];
    }

    public function get_tamanos() {
        return [
            'mini' => ['nombre' => 'Mini', 'recreable' => true],
            'mini_especial' => ['nombre' => 'Mini Especial', 'recreable' => true],
            'mediano' => ['nombre' => 'Mediano', 'recreable' => false],
            'mediano_especial' => ['nombre' => 'Mediano Especial', 'recreable' => false],
            'mediano_maestro' => ['nombre' => 'Mediano Maestro Místico', 'recreable' => false],
            'grande' => ['nombre' => 'Grande', 'recreable' => false],
            'grande_especial' => ['nombre' => 'Grande Especial', 'recreable' => false],
            'grande_maestro' => ['nombre' => 'Grande Maestro Místico', 'recreable' => false],
            'gigante' => ['nombre' => 'Gigante', 'recreable' => false],
            'gigante_especial' => ['nombre' => 'Gigante Especial', 'recreable' => false],
            'gigante_maestro' => ['nombre' => 'Gigante Maestro Místico', 'recreable' => false],
        ];
    }

    public function get_personalidades() {
        return [
            'amoroso' => 'Amoroso/a',
            'protector' => 'Protector/a',
            'sabio' => 'Sabio/a',
            'jugueton' => 'Juguetón/a',
            'serio' => 'Serio/a',
            'misterioso' => 'Misterioso/a',
            'dulce' => 'Dulce',
            'intenso' => 'Intenso/a',
            'tranquilo' => 'Tranquilo/a',
            'inquieto' => 'Inquieto/a',
            'gruñon' => 'Gruñón/a',
            'simpatico' => 'Simpático/a',
            'distante' => 'Distante',
            'bondadoso' => 'Bondadoso/a',
            'firme' => 'Firme',
            'leal' => 'Leal',
            'independiente' => 'Independiente',
            'demandante' => 'Requiere atención',
            'timido' => 'Tímido/a',
            'aventurero' => 'Aventurero/a',
            'nostalgico' => 'Nostálgico/a',
            'optimista' => 'Optimista',
            'melancolico' => 'Melancólico/a',
            'rebelde' => 'Rebelde',
        ];
    }

    // ═══════════════════════════════════════════════════════════════
    // LIMPIAR METABOXES VIEJOS
    // ═══════════════════════════════════════════════════════════════

    public function limpiar_metaboxes_viejos() {
        // Lista de metaboxes viejos a remover
        $metaboxes_viejos = [
            'duendes_canalizado_meta_box',
            'duendes_historia_meta_box',
            'duendes_accesorios_meta_box',
            // Agregar más si hay
        ];

        foreach ($metaboxes_viejos as $id) {
            remove_meta_box($id, 'product', 'normal');
            remove_meta_box($id, 'product', 'side');
            remove_meta_box($id, 'product', 'advanced');
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // METABOX PRINCIPAL
    // ═══════════════════════════════════════════════════════════════

    public function agregar_metabox() {
        add_meta_box(
            'duendes_ficha_guardian',
            '🧚 Ficha del Guardián',
            [$this, 'render_metabox'],
            'product',
            'normal',
            'high'
        );
    }

    public function render_metabox($post) {
        wp_nonce_field('duendes_ficha_guardian', 'duendes_ficha_nonce');

        // Obtener datos guardados
        $ficha = get_post_meta($post->ID, '_duendes_ficha', true) ?: [];

        $especies = $this->get_especies();
        $categorias = $this->get_categorias();
        $tamanos = $this->get_tamanos();
        $personalidades = $this->get_personalidades();
        ?>

        <style>
            .duendes-ficha-container { background: #1a1a2e; padding: 20px; border-radius: 12px; color: #fff; }
            .duendes-ficha-section { margin-bottom: 25px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; }
            .duendes-ficha-section h3 { margin: 0 0 15px; color: #c9a962; font-size: 16px; border-bottom: 1px solid rgba(201,169,98,0.3); padding-bottom: 8px; }
            .duendes-ficha-row { display: flex; gap: 15px; margin-bottom: 12px; flex-wrap: wrap; }
            .duendes-ficha-field { flex: 1; min-width: 200px; }
            .duendes-ficha-field label { display: block; margin-bottom: 5px; color: #aaa; font-size: 12px; text-transform: uppercase; }
            .duendes-ficha-field select, .duendes-ficha-field input, .duendes-ficha-field textarea {
                width: 100%; padding: 10px; border: 1px solid #333; border-radius: 6px;
                background: #0d0d1a; color: #fff; font-size: 14px;
            }
            .duendes-ficha-field select:focus, .duendes-ficha-field input:focus { border-color: #c9a962; outline: none; }
            .duendes-checkbox-group { display: flex; flex-wrap: wrap; gap: 8px; }
            .duendes-checkbox-item {
                padding: 6px 12px; background: #0d0d1a; border-radius: 20px; cursor: pointer;
                border: 1px solid #333; transition: all 0.2s;
            }
            .duendes-checkbox-item:hover { border-color: #c9a962; }
            .duendes-checkbox-item.selected { background: #c9a962; color: #1a1a2e; border-color: #c9a962; }
            .duendes-checkbox-item input { display: none; }
            .duendes-btn-ia {
                background: linear-gradient(135deg, #c9a962, #a08030); color: #1a1a2e;
                border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer;
                font-weight: bold; font-size: 16px; margin-top: 15px; width: 100%;
            }
            .duendes-btn-ia:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(201,169,98,0.3); }
            .duendes-preview { background: #0d0d1a; padding: 15px; border-radius: 8px; margin-top: 15px; }
            .duendes-small { font-size: 11px; color: #666; margin-top: 4px; }
            .duendes-unique-badge { display: inline-block; padding: 3px 8px; background: #c9a962; color: #1a1a2e; border-radius: 4px; font-size: 11px; margin-left: 10px; }
            .duendes-recreable-badge { display: inline-block; padding: 3px 8px; background: #4a9962; color: #fff; border-radius: 4px; font-size: 11px; margin-left: 10px; }
        </style>

        <div class="duendes-ficha-container">

            <!-- SECCIÓN: Datos Básicos -->
            <div class="duendes-ficha-section">
                <h3>Datos Básicos</h3>
                <div class="duendes-ficha-row">
                    <div class="duendes-ficha-field">
                        <label>Género</label>
                        <select name="duendes_ficha[genero]" id="df_genero">
                            <option value="M" <?php selected($ficha['genero'] ?? '', 'M'); ?>>Masculino (Guardián)</option>
                            <option value="F" <?php selected($ficha['genero'] ?? '', 'F'); ?>>Femenino (Guardiana)</option>
                        </select>
                    </div>
                    <div class="duendes-ficha-field">
                        <label>Especie</label>
                        <select name="duendes_ficha[especie]" id="df_especie">
                            <option value="">Seleccionar...</option>
                            <optgroup label="Clásicas">
                            <?php foreach ($especies['clasicas'] as $id => $esp): ?>
                                <option value="<?php echo $id; ?>" <?php selected($ficha['especie'] ?? '', $id); ?>><?php echo $esp['nombre']; ?></option>
                            <?php endforeach; ?>
                            </optgroup>
                            <optgroup label="✨ Exclusivas Duendes UY">
                            <?php foreach ($especies['exclusivas'] as $id => $esp): ?>
                                <option value="<?php echo $id; ?>" <?php selected($ficha['especie'] ?? '', $id); ?>><?php echo $esp['nombre']; ?></option>
                            <?php endforeach; ?>
                            </optgroup>
                            <optgroup label="Arquetipos">
                            <?php foreach ($especies['arquetipos'] as $id => $esp): ?>
                                <option value="<?php echo $id; ?>" <?php selected($ficha['especie'] ?? '', $id); ?>><?php echo $esp['nombre']; ?></option>
                            <?php endforeach; ?>
                            </optgroup>
                        </select>
                    </div>
                    <div class="duendes-ficha-field">
                        <label>Familia/Estilo (opcional)</label>
                        <input type="text" name="duendes_ficha[familia]" value="<?php echo esc_attr($ficha['familia'] ?? ''); ?>" placeholder="Ej: Leprechaun, Merlín...">
                        <div class="duendes-small">Si es Duende estilo Leprechaun, ponelo acá</div>
                    </div>
                </div>
            </div>

            <!-- SECCIÓN: Categoría -->
            <div class="duendes-ficha-section">
                <h3>Categoría y Especialidad</h3>
                <div class="duendes-ficha-row">
                    <div class="duendes-ficha-field">
                        <label>Categoría Principal</label>
                        <select name="duendes_ficha[categoria]" id="df_categoria">
                            <option value="">Seleccionar...</option>
                            <?php foreach ($categorias as $id => $cat): ?>
                                <option value="<?php echo $id; ?>" <?php selected($ficha['categoria'] ?? '', $id); ?>><?php echo $cat['nombre']; ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="duendes-ficha-field">
                        <label>Subcategorías</label>
                        <select name="duendes_ficha[subcategorias][]" id="df_subcategorias" multiple style="height: 100px;">
                            <?php
                            $cat_actual = $ficha['categoria'] ?? '';
                            if ($cat_actual && isset($categorias[$cat_actual])):
                                foreach ($categorias[$cat_actual]['subs'] as $id => $nombre):
                                    $selected = in_array($id, $ficha['subcategorias'] ?? []) ? 'selected' : '';
                            ?>
                                <option value="<?php echo $id; ?>" <?php echo $selected; ?>><?php echo $nombre; ?></option>
                            <?php
                                endforeach;
                            endif;
                            ?>
                        </select>
                        <div class="duendes-small">Mantené Ctrl/Cmd para seleccionar varias</div>
                    </div>
                </div>
            </div>

            <!-- SECCIÓN: Tamaño -->
            <div class="duendes-ficha-section">
                <h3>Tamaño</h3>
                <div class="duendes-ficha-row">
                    <div class="duendes-ficha-field">
                        <label>Tipo de Tamaño</label>
                        <select name="duendes_ficha[tipo_tamano]" id="df_tipo_tamano">
                            <option value="">Seleccionar...</option>
                            <?php foreach ($tamanos as $id => $tam): ?>
                                <option value="<?php echo $id; ?>" <?php selected($ficha['tipo_tamano'] ?? '', $id); ?>>
                                    <?php echo $tam['nombre']; ?>
                                    <?php echo $tam['recreable'] ? ' (Recreable)' : ' (Único)'; ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="duendes-ficha-field" style="max-width: 150px;">
                        <label>Tamaño Exacto (cm)</label>
                        <input type="number" name="duendes_ficha[tamano_cm]" value="<?php echo esc_attr($ficha['tamano_cm'] ?? ''); ?>" placeholder="Ej: 23">
                    </div>
                    <div class="duendes-ficha-field">
                        <label>¿Es ser único o recreable?</label>
                        <select name="duendes_ficha[es_unico]" id="df_es_unico">
                            <option value="auto" <?php selected($ficha['es_unico'] ?? 'auto', 'auto'); ?>>Automático (según tamaño)</option>
                            <option value="unico" <?php selected($ficha['es_unico'] ?? '', 'unico'); ?>>Ser Único</option>
                            <option value="recreable" <?php selected($ficha['es_unico'] ?? '', 'recreable'); ?>>Ser Recreable</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- SECCIÓN: Personalidad -->
            <div class="duendes-ficha-section">
                <h3>Personalidad (elegí hasta 3)</h3>
                <div class="duendes-checkbox-group">
                    <?php
                    $personalidad_seleccionada = $ficha['personalidad'] ?? [];
                    foreach ($personalidades as $id => $nombre):
                        $checked = in_array($id, $personalidad_seleccionada);
                    ?>
                        <label class="duendes-checkbox-item <?php echo $checked ? 'selected' : ''; ?>">
                            <input type="checkbox" name="duendes_ficha[personalidad][]" value="<?php echo $id; ?>" <?php checked($checked); ?>>
                            <?php echo $nombre; ?>
                        </label>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- SECCIÓN: Accesorios -->
            <div class="duendes-ficha-section">
                <h3>Accesorios</h3>
                <div class="duendes-ficha-field">
                    <textarea name="duendes_ficha[accesorios]" rows="2" placeholder="Ej: Moneda dorada, capa verde, bastón de roble, cristal de amatista..."><?php echo esc_textarea($ficha['accesorios'] ?? ''); ?></textarea>
                    <div class="duendes-small">Separá con comas los accesorios que tiene este guardián</div>
                </div>
            </div>

            <!-- SECCIÓN: Ficha Generada por IA -->
            <div class="duendes-ficha-section">
                <h3>Ficha Personal (generada por IA)</h3>

                <div class="duendes-ficha-row">
                    <div class="duendes-ficha-field">
                        <label>Flor Favorita</label>
                        <input type="text" name="duendes_ficha[flor_favorita]" value="<?php echo esc_attr($ficha['flor_favorita'] ?? ''); ?>">
                    </div>
                    <div class="duendes-ficha-field">
                        <label>Piedra/Cristal Favorito</label>
                        <input type="text" name="duendes_ficha[piedra_favorita]" value="<?php echo esc_attr($ficha['piedra_favorita'] ?? ''); ?>">
                    </div>
                    <div class="duendes-ficha-field">
                        <label>Color Favorito</label>
                        <input type="text" name="duendes_ficha[color_favorito]" value="<?php echo esc_attr($ficha['color_favorito'] ?? ''); ?>">
                    </div>
                </div>

                <div class="duendes-ficha-row">
                    <div class="duendes-ficha-field">
                        <label>Espacio de la Casa Favorito</label>
                        <input type="text" name="duendes_ficha[espacio_casa]" value="<?php echo esc_attr($ficha['espacio_casa'] ?? ''); ?>">
                    </div>
                    <div class="duendes-ficha-field">
                        <label>Elemento</label>
                        <select name="duendes_ficha[elemento]">
                            <option value="">Seleccionar...</option>
                            <?php foreach (['Fuego', 'Agua', 'Tierra', 'Aire', 'Éter'] as $elem): ?>
                                <option value="<?php echo $elem; ?>" <?php selected($ficha['elemento'] ?? '', $elem); ?>><?php echo $elem; ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="duendes-ficha-field">
                        <label>Estación Favorita</label>
                        <select name="duendes_ficha[estacion]">
                            <option value="">Seleccionar...</option>
                            <?php foreach (['Primavera', 'Verano', 'Otoño', 'Invierno'] as $est): ?>
                                <option value="<?php echo $est; ?>" <?php selected($ficha['estacion'] ?? '', $est); ?>><?php echo $est; ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <div class="duendes-ficha-row">
                    <div class="duendes-ficha-field">
                        <label>Momento del Día Favorito</label>
                        <input type="text" name="duendes_ficha[momento_dia]" value="<?php echo esc_attr($ficha['momento_dia'] ?? ''); ?>" placeholder="Ej: El amanecer, la hora mágica...">
                    </div>
                    <div class="duendes-ficha-field">
                        <label>¿Le gusta salir de paseo?</label>
                        <select name="duendes_ficha[le_gusta_pasear]">
                            <option value="">Seleccionar...</option>
                            <option value="si" <?php selected($ficha['le_gusta_pasear'] ?? '', 'si'); ?>>Sí, le encanta</option>
                            <option value="no" <?php selected($ficha['le_gusta_pasear'] ?? '', 'no'); ?>>Prefiere quedarse</option>
                            <option value="preguntar" <?php selected($ficha['le_gusta_pasear'] ?? '', 'preguntar'); ?>>Que le pregunte primero</option>
                        </select>
                    </div>
                </div>

                <div class="duendes-ficha-row">
                    <div class="duendes-ficha-field">
                        <label>Qué le gusta (3 cosas)</label>
                        <textarea name="duendes_ficha[le_gusta]" rows="2" placeholder="Ej: El silencio de la madrugada, el olor a tierra mojada, las conversaciones profundas"><?php echo esc_textarea($ficha['le_gusta'] ?? ''); ?></textarea>
                    </div>
                    <div class="duendes-ficha-field">
                        <label>Qué no le gusta (3 cosas)</label>
                        <textarea name="duendes_ficha[no_le_gusta]" rows="2" placeholder="Ej: El ruido excesivo, la falsedad, que lo ignoren"><?php echo esc_textarea($ficha['no_le_gusta'] ?? ''); ?></textarea>
                    </div>
                </div>

                <div class="duendes-ficha-row">
                    <div class="duendes-ficha-field">
                        <label>Frase/Lema Característico</label>
                        <input type="text" name="duendes_ficha[frase_lema]" value="<?php echo esc_attr($ficha['frase_lema'] ?? ''); ?>" placeholder="Ej: 'La paciencia es la madre de todas las magias'">
                    </div>
                </div>

                <div class="duendes-ficha-row">
                    <div class="duendes-ficha-field">
                        <label>Dato Curioso (el que hace decir "ayyy es como yo")</label>
                        <textarea name="duendes_ficha[dato_curioso]" rows="2" placeholder="Ej: No puede resistirse a las cosas brillantes, siempre que ve una moneda en el piso la levanta 'por las dudas'"><?php echo esc_textarea($ficha['dato_curioso'] ?? ''); ?></textarea>
                    </div>
                </div>

                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <button type="button" class="duendes-btn-ia" id="btn-auto-completar" style="flex: 1; background: linear-gradient(135deg, #4a9962, #2d7a4a);">
                        🔄 Auto-completar TODO
                    </button>
                    <button type="button" class="duendes-btn-ia" id="btn-generar-ficha-ia" style="flex: 1;">
                        ✨ Solo Ficha IA
                    </button>
                </div>
                <div class="duendes-small" style="text-align: center; margin-top: 10px;">
                    <strong>Auto-completar TODO:</strong> Busca en la base de datos y completa género, especie, categoría, tamaño Y genera la ficha IA.<br>
                    <strong>Solo Ficha IA:</strong> Solo genera la parte de gustos, flor, cristal, etc. (si ya completaste los datos básicos).
                </div>
                <div id="auto-completar-resultado" style="display: none; margin-top: 15px; padding: 15px; background: rgba(74,153,98,0.2); border-radius: 8px; border: 1px solid rgba(74,153,98,0.3);"></div>
            </div>

            <!-- SECCIÓN: Generador de Historias Inteligente -->
            <div class="duendes-ficha-section" style="background: linear-gradient(135deg, rgba(201,169,98,0.15), rgba(201,169,98,0.05)); border: 1px solid rgba(201,169,98,0.3);">
                <h3>📖 Historia del Guardián</h3>
                <p style="color: #aaa; margin-bottom: 15px; font-size: 14px;">
                    Generá la historia para la página del producto usando el sistema inteligente.
                    Analiza imagen, hace preguntas dinámicas, escanea historias existentes para no repetir.
                </p>

                <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
                    <a href="https://duendes-vercel.vercel.app/admin/generador-historias?producto=<?php echo $post->ID; ?>&nombre=<?php echo urlencode($post->post_title); ?>"
                       target="_blank"
                       class="duendes-btn-ia"
                       style="flex: 1; text-align: center; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <span style="font-size: 20px;">📝</span>
                        Abrir Generador de Historias
                    </a>
                    <a href="https://duendes-vercel.vercel.app/admin/generador-historias"
                       target="_blank"
                       style="color: #c9a962; font-size: 13px; text-decoration: underline;">
                        Ver todas las historias
                    </a>
                </div>

                <div class="duendes-small" style="margin-top: 12px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 6px;">
                    <strong>El generador incluye:</strong><br>
                    • Escaneo de historias existentes (no repite edades, sincrodestinos, frases)<br>
                    • Análisis de imagen del guardián con IA<br>
                    • Preguntas dinámicas generadas en el momento<br>
                    • Estructura variable (sorprende, no es siempre igual)<br>
                    • Guarda directo en WooCommerce
                </div>
            </div>

        </div>

        <script>
        jQuery(document).ready(function($) {
            // Toggle de checkboxes de personalidad
            $('.duendes-checkbox-item').click(function(e) {
                if (e.target.tagName !== 'INPUT') {
                    var checkbox = $(this).find('input');
                    var selected = $('.duendes-checkbox-item.selected').length;

                    if (checkbox.is(':checked')) {
                        checkbox.prop('checked', false);
                        $(this).removeClass('selected');
                    } else if (selected < 3) {
                        checkbox.prop('checked', true);
                        $(this).addClass('selected');
                    } else {
                        alert('Máximo 3 rasgos de personalidad');
                    }
                }
            });

            // Actualizar subcategorías cuando cambia la categoría
            var categorias = <?php echo json_encode($categorias); ?>;
            $('#df_categoria').change(function() {
                var cat = $(this).val();
                var $subs = $('#df_subcategorias');
                $subs.empty();

                if (cat && categorias[cat]) {
                    $.each(categorias[cat].subs, function(id, nombre) {
                        $subs.append('<option value="' + id + '">' + nombre + '</option>');
                    });
                }
            });

            // Función para recoger todos los datos del formulario
            function recogerDatosFormulario() {
                var ficha = {
                    genero: $('#df_genero').val(),
                    especie: $('#df_especie').val(),
                    familia: $('input[name="duendes_ficha[familia]"]').val(),
                    categoria: $('#df_categoria').val(),
                    subcategorias: $('#df_subcategorias').val() || [],
                    tipo_tamano: $('#df_tipo_tamano').val(),
                    tamano_cm: $('input[name="duendes_ficha[tamano_cm]"]').val(),
                    es_unico: $('#df_es_unico').val(),
                    accesorios: $('textarea[name="duendes_ficha[accesorios]"]').val(),
                    flor_favorita: $('input[name="duendes_ficha[flor_favorita]"]').val(),
                    piedra_favorita: $('input[name="duendes_ficha[piedra_favorita]"]').val(),
                    color_favorito: $('input[name="duendes_ficha[color_favorito]"]').val(),
                    espacio_casa: $('input[name="duendes_ficha[espacio_casa]"]').val(),
                    elemento: $('select[name="duendes_ficha[elemento]"]').val(),
                    estacion: $('select[name="duendes_ficha[estacion]"]').val(),
                    momento_dia: $('input[name="duendes_ficha[momento_dia]"]').val(),
                    le_gusta_pasear: $('select[name="duendes_ficha[le_gusta_pasear]"]').val(),
                    le_gusta: $('textarea[name="duendes_ficha[le_gusta]"]').val(),
                    no_le_gusta: $('textarea[name="duendes_ficha[no_le_gusta]"]').val(),
                    frase_lema: $('input[name="duendes_ficha[frase_lema]"]').val(),
                    dato_curioso: $('textarea[name="duendes_ficha[dato_curioso]"]').val()
                };

                // Recoger personalidades seleccionadas
                var personalidades = [];
                $('.duendes-checkbox-item.selected input').each(function() {
                    personalidades.push($(this).val());
                });
                ficha.personalidad = personalidades;

                return ficha;
            }

            // Función para guardar automáticamente
            function guardarFichaAuto(callback) {
                var ficha = recogerDatosFormulario();

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'duendes_guardar_ficha',
                        post_id: <?php echo $post->ID; ?>,
                        nonce: '<?php echo wp_create_nonce('duendes_guardar_ficha'); ?>',
                        ficha: ficha
                    },
                    success: function(response) {
                        if (callback) callback(response.success);
                    },
                    error: function() {
                        if (callback) callback(false);
                    }
                });
            }

            // Botón AUTO-COMPLETAR TODO
            $('#btn-auto-completar').click(function() {
                var btn = $(this);
                var resultado = $('#auto-completar-resultado');
                btn.prop('disabled', true).text('Buscando...');
                resultado.hide();

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'duendes_auto_completar_ficha',
                        post_id: <?php echo $post->ID; ?>,
                        nonce: '<?php echo wp_create_nonce('duendes_auto_completar'); ?>'
                    },
                    success: function(response) {
                        if (response.success && response.data) {
                            var d = response.data;

                            // Completar datos básicos
                            if (d.datosBasicos) {
                                var db = d.datosBasicos;
                                $('#df_genero').val(db.genero || 'M');
                                $('#df_especie').val(db.especie || '');
                                $('input[name="duendes_ficha[familia]"]').val(db.familia || '');
                                $('#df_categoria').val(db.categoria || '').trigger('change');
                                $('#df_tipo_tamano').val(db.tipo_tamano || '');
                                $('input[name="duendes_ficha[tamano_cm]"]').val(db.tamano_cm || '');
                                $('#df_es_unico').val(db.es_unico || 'auto');
                                $('textarea[name="duendes_ficha[accesorios]"]').val(db.accesorios || '');
                            }

                            // Completar ficha IA
                            if (d.fichaIA) {
                                var f = d.fichaIA;
                                $('input[name="duendes_ficha[flor_favorita]"]').val(f.flor_favorita || '');
                                $('input[name="duendes_ficha[piedra_favorita]"]').val(f.piedra_favorita || '');
                                $('input[name="duendes_ficha[color_favorito]"]').val(f.color_favorito || '');
                                $('input[name="duendes_ficha[espacio_casa]"]').val(f.espacio_casa || '');
                                $('select[name="duendes_ficha[elemento]"]').val(f.elemento || '');
                                $('select[name="duendes_ficha[estacion]"]').val(f.estacion || '');
                                $('input[name="duendes_ficha[momento_dia]"]').val(f.momento_dia || '');

                                // Mapear le_gusta_pasear
                                var paseoMap = {
                                    'Sí, le encanta': 'si',
                                    'No, prefiere quedarse': 'no',
                                    'Que le pregunte primero': 'preguntar'
                                };
                                var paseoVal = paseoMap[f.le_gusta_pasear] || f.le_gusta_pasear || '';
                                $('select[name="duendes_ficha[le_gusta_pasear]"]').val(paseoVal);

                                var leGusta = Array.isArray(f.le_gusta) ? f.le_gusta.join(', ') : f.le_gusta;
                                var noLeGusta = Array.isArray(f.no_le_gusta) ? f.no_le_gusta.join(', ') : f.no_le_gusta;
                                $('textarea[name="duendes_ficha[le_gusta]"]').val(leGusta || '');
                                $('textarea[name="duendes_ficha[no_le_gusta]"]').val(noLeGusta || '');
                                $('input[name="duendes_ficha[frase_lema]"]').val(f.frase_lema || '');
                                $('textarea[name="duendes_ficha[dato_curioso]"]').val(f.dato_curioso || '');
                            }

                            // AUTO-GUARDAR
                            btn.text('Guardando...');
                            guardarFichaAuto(function(ok) {
                                if (ok) {
                                    resultado.html('<strong style="color: #4a9962;">✓ GUARDADO</strong><br>' +
                                        'Producto: ' + (d.producto_db || 'OK') + '<br>' +
                                        'Tamaño: ' + (d.datosBasicos?.tamano_cm || '?') + ' cm<br>' +
                                        '<span style="color: #4a9962;">La ficha ya está visible en la página del producto.</span>').show();
                                } else {
                                    resultado.html('<span style="color: #c94a4a;">Error al guardar</span>').show();
                                }
                                btn.prop('disabled', false).text('🔄 Auto-completar TODO');
                            });

                        } else {
                            resultado.html('<span style="color: #c94a4a;">No encontrado: ' + (response.data?.error || 'Error') + '</span>').show();
                            btn.prop('disabled', false).text('🔄 Auto-completar TODO');
                        }
                    },
                    error: function() {
                        resultado.html('<span style="color: #c94a4a;">Error de conexión</span>').show();
                        btn.prop('disabled', false).text('🔄 Auto-completar TODO');
                    }
                });
            });

            // Botón generar ficha con IA
            $('#btn-generar-ficha-ia').click(function() {
                var btn = $(this);
                var resultado = $('#auto-completar-resultado');
                btn.prop('disabled', true).text('Generando...');

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'duendes_generar_ficha_ia',
                        post_id: <?php echo $post->ID; ?>,
                        nonce: '<?php echo wp_create_nonce('duendes_generar_ficha'); ?>'
                    },
                    success: function(response) {
                        if (response.success && response.data.ficha) {
                            var f = response.data.ficha;
                            $('input[name="duendes_ficha[flor_favorita]"]').val(f.flor_favorita || '');
                            $('input[name="duendes_ficha[piedra_favorita]"]').val(f.piedra_favorita || '');
                            $('input[name="duendes_ficha[color_favorito]"]').val(f.color_favorito || '');
                            $('input[name="duendes_ficha[espacio_casa]"]').val(f.espacio_casa || '');
                            $('select[name="duendes_ficha[elemento]"]').val(f.elemento || '');
                            $('select[name="duendes_ficha[estacion]"]').val(f.estacion || '');
                            $('input[name="duendes_ficha[momento_dia]"]').val(f.momento_dia || '');

                            // Mapear le_gusta_pasear
                            var paseoMap = {
                                'Sí, le encanta': 'si',
                                'No, prefiere quedarse': 'no',
                                'Que le pregunte primero': 'preguntar'
                            };
                            var paseoVal = paseoMap[f.le_gusta_pasear] || f.le_gusta_pasear || '';
                            $('select[name="duendes_ficha[le_gusta_pasear]"]').val(paseoVal);

                            var leGusta = Array.isArray(f.le_gusta) ? f.le_gusta.join(', ') : f.le_gusta;
                            var noLeGusta = Array.isArray(f.no_le_gusta) ? f.no_le_gusta.join(', ') : f.no_le_gusta;
                            $('textarea[name="duendes_ficha[le_gusta]"]').val(leGusta || '');
                            $('textarea[name="duendes_ficha[no_le_gusta]"]').val(noLeGusta || '');
                            $('input[name="duendes_ficha[frase_lema]"]').val(f.frase_lema || '');
                            $('textarea[name="duendes_ficha[dato_curioso]"]').val(f.dato_curioso || '');

                            // AUTO-GUARDAR
                            btn.text('Guardando...');
                            guardarFichaAuto(function(ok) {
                                if (ok) {
                                    resultado.html('<strong style="color: #4a9962;">✓ FICHA REGENERADA Y GUARDADA</strong><br>' +
                                        '<span style="color: #4a9962;">La nueva personalidad ya está visible en la página del producto.</span>').show();
                                } else {
                                    resultado.html('<span style="color: #c94a4a;">Error al guardar</span>').show();
                                }
                                btn.prop('disabled', false).text('✨ Solo Ficha IA');
                            });
                        } else {
                            resultado.html('<span style="color: #c94a4a;">Error: ' + (response.data?.error || 'No se pudo generar') + '</span>').show();
                            btn.prop('disabled', false).text('✨ Solo Ficha IA');
                        }
                    },
                    error: function() {
                        resultado.html('<span style="color: #c94a4a;">Error de conexión</span>').show();
                        btn.prop('disabled', false).text('✨ Solo Ficha IA');
                    }
                });
            });
        });
        </script>

        <?php
    }

    // ═══════════════════════════════════════════════════════════════
    // GUARDAR FICHA
    // ═══════════════════════════════════════════════════════════════

    public function guardar_ficha($post_id) {
        if (!isset($_POST['duendes_ficha_nonce']) || !wp_verify_nonce($_POST['duendes_ficha_nonce'], 'duendes_ficha_guardian')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;

        if (isset($_POST['duendes_ficha'])) {
            // OBTENER FICHA EXISTENTE para hacer MERGE (no sobrescribir)
            $ficha_existente = get_post_meta($post_id, '_duendes_ficha', true);
            if (!is_array($ficha_existente)) {
                $ficha_existente = [];
            }

            // Procesar datos del formulario
            $ficha_nueva = array_map(function($v) {
                if (is_array($v)) return array_map('sanitize_text_field', $v);
                return sanitize_text_field($v);
            }, $_POST['duendes_ficha']);

            // MERGE: Solo actualizar campos que tienen valor en el formulario
            // Si el campo viene vacío pero ya existía, mantener el valor existente
            foreach ($ficha_nueva as $key => $valor) {
                if ($valor !== '' && $valor !== null && (!is_array($valor) || !empty($valor))) {
                    $ficha_existente[$key] = $valor;
                }
            }

            update_post_meta($post_id, '_duendes_ficha', $ficha_existente);

            // Log para debug
            error_log('FICHA GUARDADA (MERGE): producto=' . $post_id . ' campos=' . implode(',', array_keys($ficha_nueva)));
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // AJAX: GENERAR FICHA CON IA
    // ═══════════════════════════════════════════════════════════════

    public function ajax_generar_ficha() {
        check_ajax_referer('duendes_generar_ficha', 'nonce');

        $post_id = intval($_POST['post_id']);
        $product = wc_get_product($post_id);

        if (!$product) {
            wp_send_json_error(['error' => 'Producto no encontrado']);
        }

        $historia = $product->get_description();
        $nombre = $product->get_name();
        $ficha_actual = get_post_meta($post_id, '_duendes_ficha', true) ?: [];

        if (empty($historia)) {
            wp_send_json_error(['error' => 'El producto no tiene descripción/historia. Generá una historia primero.']);
        }

        // Construir datos básicos desde la ficha actual
        $datosBasicos = [
            'especie' => $ficha_actual['especie'] ?? 'duende',
            'categoria' => $ficha_actual['categoria'] ?? 'proteccion',
            'genero' => $ficha_actual['genero'] ?? 'M',
            'tamano_cm' => $ficha_actual['tamano_cm'] ?? '',
            'accesorios' => $ficha_actual['accesorios'] ?? ''
        ];

        // Llamar a la API de Vercel (endpoint nuevo)
        $response = wp_remote_post($this->api_url . '/guardian-intelligence/solo-ficha-ia', [
            'timeout' => 90,
            'headers' => ['Content-Type' => 'application/json'],
            'body' => json_encode([
                'nombre' => $nombre,
                'historia' => $historia,
                'datosBasicos' => $datosBasicos
            ])
        ]);

        if (is_wp_error($response)) {
            wp_send_json_error(['error' => 'Error de conexión: ' . $response->get_error_message()]);
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);

        if (isset($body['success']) && $body['success'] && isset($body['fichaIA'])) {
            wp_send_json_success(['ficha' => $body['fichaIA']]);
        } else {
            wp_send_json_error(['error' => $body['error'] ?? 'Error generando ficha IA']);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // AJAX: AUTO-COMPLETAR DESDE BASE DE DATOS
    // ═══════════════════════════════════════════════════════════════

    public function ajax_auto_completar_ficha() {
        check_ajax_referer('duendes_auto_completar', 'nonce');

        $post_id = intval($_POST['post_id']);
        $product = wc_get_product($post_id);

        if (!$product) {
            wp_send_json_error(['error' => 'Producto no encontrado']);
        }

        $nombre = $product->get_name();
        $historia = $product->get_description();
        $nombre_lower = strtolower($nombre);

        // ══════════════════════════════════════════════════════════════
        // PASO 1: LEER DATOS BÁSICOS DESDE WORDPRESS (sin llamar API)
        // ══════════════════════════════════════════════════════════════

        // 1. Intentar leer de ficha existente
        $ficha_existente = get_post_meta($post_id, '_duendes_ficha', true) ?: [];

        // 2. Leer de atributos WooCommerce
        $atributos = $product->get_attributes();
        $attr_especie = '';
        $attr_tamano = '';
        $attr_categoria = '';

        foreach ($atributos as $attr_name => $attr) {
            $nombre_attr = strtolower($attr_name);
            $valor = '';

            if ($attr->is_taxonomy()) {
                $terms = wp_get_post_terms($post_id, $attr->get_name(), ['fields' => 'names']);
                $valor = !empty($terms) ? $terms[0] : '';
            } else {
                $opciones = $attr->get_options();
                $valor = !empty($opciones) ? $opciones[0] : '';
            }

            if (strpos($nombre_attr, 'especie') !== false || strpos($nombre_attr, 'tipo') !== false) {
                $attr_especie = $valor;
            }
            if (strpos($nombre_attr, 'altura') !== false || strpos($nombre_attr, 'tamaño') !== false || strpos($nombre_attr, 'cm') !== false) {
                if (preg_match('/(\d+)/', $valor, $m)) {
                    $attr_tamano = $m[1];
                }
            }
        }

        // 3. Inferir de la historia/descripción
        $tamano_historia = null;
        $categoria_historia = 'proteccion';

        if ($historia) {
            // Buscar tamaño en la historia (ej: "28 centímetros", "mide 15 cm")
            if (preg_match('/(\d{1,2})\s*(?:centímetros|centimetros|cm)/i', $historia, $m)) {
                $tamano_historia = intval($m[1]);
            }

            // Inferir categoría
            $historia_lower = strtolower($historia);
            if (strpos($historia_lower, 'abundancia') !== false || strpos($historia_lower, 'prosperidad') !== false) {
                $categoria_historia = 'abundancia';
            } elseif (strpos($historia_lower, 'amor') !== false && strpos($historia_lower, 'propio') === false) {
                $categoria_historia = 'amor';
            } elseif (strpos($historia_lower, 'sanación') !== false || strpos($historia_lower, 'sanar') !== false) {
                $categoria_historia = 'sanacion';
            } elseif (strpos($historia_lower, 'sabiduría') !== false) {
                $categoria_historia = 'sabiduria';
            }
        }

        // 4. Inferir especie del nombre
        $especie_nombre = 'duende';
        if (strpos($nombre_lower, 'pixie') !== false) $especie_nombre = 'pixie';
        elseif (strpos($nombre_lower, 'vikingo') !== false || strpos($nombre_lower, 'vikinga') !== false) $especie_nombre = 'vikingo';
        elseif (strpos($nombre_lower, 'bruja') !== false || strpos($nombre_lower, 'brujo') !== false) $especie_nombre = 'bruja';
        elseif (strpos($nombre_lower, 'hada') !== false) $especie_nombre = 'hada';
        elseif (strpos($nombre_lower, 'elfo') !== false || strpos($nombre_lower, 'elfa') !== false) $especie_nombre = 'elfo';
        elseif (strpos($nombre_lower, 'mago') !== false || strpos($nombre_lower, 'maga') !== false) $especie_nombre = 'mago';
        elseif (strpos($nombre_lower, 'chaman') !== false || strpos($nombre_lower, 'chamana') !== false) $especie_nombre = 'chaman';

        // 5. Inferir género del nombre
        $genero_nombre = 'M';
        if (strpos($nombre_lower, 'pixie') !== false || preg_match('/(a|ina|ella|ana)$/i', $nombre)) {
            $genero_nombre = 'F';
        }

        // 6. Construir datos básicos con prioridad: ficha > atributos > historia > nombre
        $datosBasicos = [
            'genero' => $ficha_existente['genero'] ?? $genero_nombre,
            'especie' => $ficha_existente['especie'] ?? ($attr_especie ?: $especie_nombre),
            'familia' => $ficha_existente['familia'] ?? '',
            'categoria' => $ficha_existente['categoria'] ?? $categoria_historia,
            'tipo_tamano' => $ficha_existente['tipo_tamano'] ?? '',
            'tamano_cm' => $ficha_existente['tamano_cm'] ?? ($attr_tamano ?: $tamano_historia),
            'es_unico' => $ficha_existente['recreable'] === 'no' ? 'unico' : ($ficha_existente['recreable'] === 'si' ? 'recreable' : 'auto'),
            'accesorios' => $ficha_existente['accesorios'] ?? ''
        ];

        // Determinar tipo_tamano si tenemos cm pero no tipo
        if (empty($datosBasicos['tipo_tamano']) && $datosBasicos['tamano_cm']) {
            $cm = intval($datosBasicos['tamano_cm']);
            if ($cm <= 12) $datosBasicos['tipo_tamano'] = 'mini';
            elseif ($cm <= 14) $datosBasicos['tipo_tamano'] = 'mini_especial';
            elseif ($cm <= 20) $datosBasicos['tipo_tamano'] = 'mediano';
            elseif ($cm <= 25) $datosBasicos['tipo_tamano'] = 'mediano_especial';
            elseif ($cm <= 30) $datosBasicos['tipo_tamano'] = 'grande';
            else $datosBasicos['tipo_tamano'] = 'gigante';
        }

        // ══════════════════════════════════════════════════════════════
        // PASO 2: LLAMAR A LA API SOLO PARA FICHA IA (flor, piedra, etc)
        // ══════════════════════════════════════════════════════════════

        $fichaIA = null;

        if (!empty($historia)) {
            $response = wp_remote_post($this->api_url . '/guardian-intelligence/solo-ficha-ia', [
                'timeout' => 90,
                'headers' => ['Content-Type' => 'application/json'],
                'body' => json_encode([
                    'nombre' => $nombre,
                    'historia' => $historia,
                    'datosBasicos' => $datosBasicos
                ])
            ]);

            if (!is_wp_error($response)) {
                $body = json_decode(wp_remote_retrieve_body($response), true);
                if (isset($body['success']) && $body['success'] && isset($body['fichaIA'])) {
                    $fichaIA = $body['fichaIA'];
                }
            }
        }

        // ══════════════════════════════════════════════════════════════
        // RESPUESTA FINAL
        // ══════════════════════════════════════════════════════════════

        wp_send_json_success([
            'success' => true,
            'encontrado' => true,
            'producto_db' => $nombre,
            'datosBasicos' => $datosBasicos,
            'fichaIA' => $fichaIA,
            'fuente' => 'wordpress',
            'mensaje' => 'Datos leídos desde WordPress' . ($fichaIA ? ' + Ficha IA generada' : '')
        ]);
    }

    // ═══════════════════════════════════════════════════════════════
    // AJAX: GUARDAR FICHA (auto-save)
    // ═══════════════════════════════════════════════════════════════

    public function ajax_guardar_ficha() {
        check_ajax_referer('duendes_guardar_ficha', 'nonce');

        $post_id = intval($_POST['post_id']);

        if (!current_user_can('edit_post', $post_id)) {
            wp_send_json_error(['error' => 'Sin permisos']);
        }

        $ficha = isset($_POST['ficha']) ? $_POST['ficha'] : [];

        // Sanitizar todos los campos
        $ficha_limpia = [];
        foreach ($ficha as $key => $value) {
            if (is_array($value)) {
                $ficha_limpia[$key] = array_map('sanitize_text_field', $value);
            } else {
                $ficha_limpia[$key] = sanitize_text_field($value);
            }
        }

        update_post_meta($post_id, '_duendes_ficha', $ficha_limpia);

        wp_send_json_success(['message' => 'Ficha guardada correctamente']);
    }

    // ═══════════════════════════════════════════════════════════════
    // FRONTEND: SUBTÍTULO DEBAJO DEL NOMBRE
    // ═══════════════════════════════════════════════════════════════

    public function mostrar_subtitulo() {
        global $product;

        $ficha = get_post_meta($product->get_id(), '_duendes_ficha', true);
        if (!$ficha || empty($ficha['especie'])) return;

        $especies = $this->get_especies();
        $categorias = $this->get_categorias();

        // Determinar el género del título
        $genero = $ficha['genero'] ?? 'M';
        $titulo_guardian = ($genero === 'F') ? 'GUARDIANA' : 'GUARDIÁN';

        // Obtener nombre de especie
        $especie_id = $ficha['especie'];
        $especie_nombre = '';
        foreach (['clasicas', 'exclusivas', 'arquetipos'] as $grupo) {
            if (isset($especies[$grupo][$especie_id])) {
                $esp = $especies[$grupo][$especie_id];
                $especie_nombre = ($genero === 'F' && isset($esp['fem'])) ? strtoupper($esp['fem']) : strtoupper($esp['nombre']);
                break;
            }
        }

        // Si tiene familia/estilo, usar eso en vez de especie
        if (!empty($ficha['familia'])) {
            $especie_nombre = strtoupper($ficha['familia']);
        }

        // Obtener categoría
        $cat_id = $ficha['categoria'] ?? '';
        $cat_nombre = isset($categorias[$cat_id]) ? strtoupper($categorias[$cat_id]['nombre']) : '';

        // Construir subtítulo
        $partes = array_filter([$titulo_guardian, $especie_nombre, $cat_nombre]);
        $subtitulo = implode(' · ', $partes);

        echo '<div class="duendes-subtitulo-guardian" style="color: #c9a962; font-size: 14px; letter-spacing: 2px; margin-bottom: 15px; font-weight: 500;">' . esc_html($subtitulo) . '</div>';
    }

    // ═══════════════════════════════════════════════════════════════
    // FRONTEND: TAB CON FICHA COMPLETA
    // ═══════════════════════════════════════════════════════════════

    public function agregar_tab_ficha($tabs) {
        global $product;

        $ficha = get_post_meta($product->get_id(), '_duendes_ficha', true);
        if (!$ficha || empty($ficha['especie'])) return $tabs;

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
        $especies = $this->get_especies();
        $categorias = $this->get_categorias();
        $tamanos = $this->get_tamanos();
        $personalidades = $this->get_personalidades();

        // Obtener datos formateados
        $genero = $ficha['genero'] ?? 'M';

        // Especie
        $especie_id = $ficha['especie'] ?? '';
        $especie_info = null;
        foreach (['clasicas', 'exclusivas', 'arquetipos'] as $grupo) {
            if (isset($especies[$grupo][$especie_id])) {
                $especie_info = $especies[$grupo][$especie_id];
                break;
            }
        }

        // Determinar si es único o recreable
        $tipo_tamano = $ficha['tipo_tamano'] ?? '';
        $es_unico = $ficha['es_unico'] ?? 'auto';
        if ($es_unico === 'auto') {
            $es_unico = isset($tamanos[$tipo_tamano]) && !$tamanos[$tipo_tamano]['recreable'] ? 'unico' : 'recreable';
            // Pixies siempre únicas
            if ($especie_id === 'pixie') $es_unico = 'unico';
        }

        ?>
        <style>
            .duendes-ficha-frontend {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                padding: 30px;
                border-radius: 16px;
                color: #fff;
            }
            .duendes-ficha-header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 1px solid rgba(201,169,98,0.3);
            }
            .duendes-ficha-header h3 {
                color: #c9a962;
                font-size: 24px;
                margin: 0 0 10px;
            }
            .duendes-ficha-badge {
                display: inline-block;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 1px;
            }
            .duendes-ficha-badge.unico { background: #c9a962; color: #1a1a2e; }
            .duendes-ficha-badge.recreable { background: #4a9962; color: #fff; }
            .duendes-ficha-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
            }
            .duendes-ficha-item {
                background: rgba(255,255,255,0.05);
                padding: 15px;
                border-radius: 10px;
            }
            .duendes-ficha-item-label {
                color: #c9a962;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
            }
            .duendes-ficha-item-value {
                color: #fff;
                font-size: 16px;
            }
            .duendes-ficha-especie-desc {
                background: rgba(201,169,98,0.1);
                padding: 20px;
                border-radius: 10px;
                margin-top: 20px;
                border-left: 3px solid #c9a962;
            }
            .duendes-ficha-frase {
                text-align: center;
                font-style: italic;
                font-size: 18px;
                color: #c9a962;
                margin: 30px 0;
                padding: 20px;
            }
            .duendes-ficha-dato-curioso {
                background: rgba(255,255,255,0.03);
                padding: 20px;
                border-radius: 10px;
                margin-top: 20px;
            }
            .duendes-ficha-dato-curioso-title {
                color: #c9a962;
                font-size: 14px;
                margin-bottom: 10px;
            }
        </style>

        <div class="duendes-ficha-frontend">
            <div class="duendes-ficha-header">
                <h3>Conocé a <?php echo esc_html($product->get_name()); ?></h3>
                <span class="duendes-ficha-badge <?php echo $es_unico === 'unico' ? 'unico' : 'recreable'; ?>">
                    <?php echo $es_unico === 'unico' ? 'SER ÚNICO' : 'SER RECREABLE'; ?>
                </span>
            </div>

            <div class="duendes-ficha-grid">
                <?php if ($especie_info): ?>
                <div class="duendes-ficha-item">
                    <div class="duendes-ficha-item-label">Especie</div>
                    <div class="duendes-ficha-item-value">
                        <?php echo ($genero === 'F' && isset($especie_info['fem'])) ? $especie_info['fem'] : $especie_info['nombre']; ?>
                    </div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['familia'])): ?>
                <div class="duendes-ficha-item">
                    <div class="duendes-ficha-item-label">Familia/Estilo</div>
                    <div class="duendes-ficha-item-value"><?php echo esc_html($ficha['familia']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['tipo_tamano']) && !empty($ficha['tamano_cm'])): ?>
                <div class="duendes-ficha-item">
                    <div class="duendes-ficha-item-label">Tamaño</div>
                    <div class="duendes-ficha-item-value">
                        <?php echo esc_html($tamanos[$ficha['tipo_tamano']]['nombre'] ?? ''); ?>
                        (<?php echo esc_html($ficha['tamano_cm']); ?> cm)
                    </div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['personalidad'])): ?>
                <div class="duendes-ficha-item">
                    <div class="duendes-ficha-item-label">Personalidad</div>
                    <div class="duendes-ficha-item-value">
                        <?php
                        $rasgos = array_map(function($p) use ($personalidades) {
                            return $personalidades[$p] ?? $p;
                        }, $ficha['personalidad']);
                        echo esc_html(implode(', ', $rasgos));
                        ?>
                    </div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['elemento'])): ?>
                <div class="duendes-ficha-item">
                    <div class="duendes-ficha-item-label">Elemento</div>
                    <div class="duendes-ficha-item-value"><?php echo esc_html($ficha['elemento']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['flor_favorita'])): ?>
                <div class="duendes-ficha-item">
                    <div class="duendes-ficha-item-label">Flor Favorita</div>
                    <div class="duendes-ficha-item-value"><?php echo esc_html($ficha['flor_favorita']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['piedra_favorita'])): ?>
                <div class="duendes-ficha-item">
                    <div class="duendes-ficha-item-label">Cristal Favorito</div>
                    <div class="duendes-ficha-item-value"><?php echo esc_html($ficha['piedra_favorita']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['color_favorito'])): ?>
                <div class="duendes-ficha-item">
                    <div class="duendes-ficha-item-label">Color Favorito</div>
                    <div class="duendes-ficha-item-value"><?php echo esc_html($ficha['color_favorito']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['espacio_casa'])): ?>
                <div class="duendes-ficha-item">
                    <div class="duendes-ficha-item-label">Espacio Favorito de la Casa</div>
                    <div class="duendes-ficha-item-value"><?php echo esc_html($ficha['espacio_casa']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['momento_dia'])): ?>
                <div class="duendes-ficha-item">
                    <div class="duendes-ficha-item-label">Momento del Día Favorito</div>
                    <div class="duendes-ficha-item-value"><?php echo esc_html($ficha['momento_dia']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['estacion'])): ?>
                <div class="duendes-ficha-item">
                    <div class="duendes-ficha-item-label">Estación Favorita</div>
                    <div class="duendes-ficha-item-value"><?php echo esc_html($ficha['estacion']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['le_gusta_pasear'])): ?>
                <div class="duendes-ficha-item">
                    <div class="duendes-ficha-item-label">¿Le gusta salir de paseo?</div>
                    <div class="duendes-ficha-item-value">
                        <?php
                        $paseo_opciones = ['si' => 'Sí, le encanta', 'no' => 'Prefiere quedarse en casa', 'preguntar' => 'Le gusta que le pregunten primero'];
                        echo esc_html($paseo_opciones[$ficha['le_gusta_pasear']] ?? '');
                        ?>
                    </div>
                </div>
                <?php endif; ?>
            </div>

            <?php if (!empty($ficha['le_gusta'])): ?>
            <div class="duendes-ficha-item" style="margin-top: 20px;">
                <div class="duendes-ficha-item-label">Lo que le gusta</div>
                <div class="duendes-ficha-item-value"><?php echo esc_html($ficha['le_gusta']); ?></div>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['no_le_gusta'])): ?>
            <div class="duendes-ficha-item" style="margin-top: 10px;">
                <div class="duendes-ficha-item-label">Lo que no le gusta</div>
                <div class="duendes-ficha-item-value"><?php echo esc_html($ficha['no_le_gusta']); ?></div>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['frase_lema'])): ?>
            <div class="duendes-ficha-frase">
                "<?php echo esc_html($ficha['frase_lema']); ?>"
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['dato_curioso'])): ?>
            <div class="duendes-ficha-dato-curioso">
                <div class="duendes-ficha-dato-curioso-title">✨ Dato curioso</div>
                <div><?php echo esc_html($ficha['dato_curioso']); ?></div>
            </div>
            <?php endif; ?>

            <?php if ($especie_info && !empty($especie_info['desc'])): ?>
            <div class="duendes-ficha-especie-desc">
                <strong>Sobre los <?php echo esc_html($especie_info['nombre']); ?>:</strong><br>
                <?php echo esc_html($especie_info['desc']); ?>
            </div>
            <?php endif; ?>
        </div>
        <?php
    }

    // ═══════════════════════════════════════════════════════════════
    // ASSETS
    // ═══════════════════════════════════════════════════════════════

    public function cargar_assets_admin($hook) {
        if (!in_array($hook, ['post.php', 'post-new.php'])) return;
        // CSS y JS ya están inline por simplicidad
    }

    public function cargar_assets_frontend() {
        // CSS ya está inline en el render
    }
}

// Inicializar
DuendesFichaGuardian::instance();
