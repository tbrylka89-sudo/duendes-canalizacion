<?php
/**
 * Plugin Name: Duendes - Generador de Historias
 * Description: Genera historias únicas para guardianes usando IA
 * Version: 1.0
 */

// Agregar menú en admin
add_action('admin_menu', function() {
    add_submenu_page(
        'edit.php?post_type=product',
        'Generar Historias',
        '✨ Generar Historias',
        'manage_options',
        'duendes-generar-historias',
        'duendes_generador_historias_page'
    );
});

// Estilos y scripts
add_action('admin_enqueue_scripts', function($hook) {
    if (strpos($hook, 'duendes-generar-historias') === false) return;

    wp_add_inline_style('wp-admin', '
        .duendes-generador { max-width: 900px; margin: 20px auto; }
        .duendes-generador h1 { color: #2e7d32; }
        .duendes-form { background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .duendes-form label { display: block; margin-bottom: 5px; font-weight: 600; color: #333; }
        .duendes-form input, .duendes-form select, .duendes-form textarea {
            width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px;
        }
        .duendes-form textarea { min-height: 120px; }
        .duendes-row { display: flex; gap: 20px; }
        .duendes-row > div { flex: 1; }
        .duendes-btn { background: #2e7d32; color: #fff; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        .duendes-btn:hover { background: #1b5e20; }
        .duendes-btn:disabled { background: #ccc; cursor: not-allowed; }
        .duendes-resultado { margin-top: 20px; padding: 20px; background: #f5f5f5; border-radius: 8px; display: none; }
        .duendes-resultado.visible { display: block; }
        .duendes-historia { background: #fff; padding: 20px; border-left: 4px solid #2e7d32; margin-top: 15px; white-space: pre-wrap; font-family: Georgia, serif; line-height: 1.7; }
        .duendes-loading { text-align: center; padding: 40px; }
        .duendes-loading .spinner { display: inline-block; }
        .duendes-success { color: #2e7d32; font-weight: bold; }
        .duendes-error { color: #c62828; font-weight: bold; }
        .duendes-productos-lista { max-height: 300px; overflow-y: auto; background: #f9f9f9; padding: 10px; border-radius: 4px; margin-bottom: 20px; }
        .duendes-producto-item { padding: 8px; border-bottom: 1px solid #eee; cursor: pointer; }
        .duendes-producto-item:hover { background: #e8f5e9; }
        .duendes-producto-item.selected { background: #c8e6c9; }
    ');
});

// Página principal
function duendes_generador_historias_page() {
    // Obtener API URL de Vercel
    $api_url = get_option('duendes_vercel_api_url', 'https://duendes-vercel.vercel.app');
    ?>
    <div class="wrap duendes-generador">
        <h1>✨ Generador de Historias de Guardianes</h1>

        <div class="duendes-form">
            <!-- Configuración API -->
            <details style="margin-bottom: 20px;">
                <summary style="cursor: pointer; color: #666;">⚙️ Configuración API</summary>
                <div style="padding: 15px; background: #f5f5f5; margin-top: 10px; border-radius: 4px;">
                    <label>URL de API Vercel:</label>
                    <input type="text" id="api_url" value="<?php echo esc_attr($api_url); ?>">
                    <button type="button" class="button" onclick="guardarConfig()">Guardar</button>
                </div>
            </details>

            <!-- Seleccionar producto existente -->
            <h3>📦 Seleccionar Producto (opcional)</h3>
            <p style="color: #666; font-size: 13px;">Seleccioná un producto para pre-cargar sus datos, o completá manualmente abajo.</p>

            <input type="text" id="buscar_producto" placeholder="🔍 Buscar producto por nombre...">
            <div class="duendes-productos-lista" id="lista_productos">
                <?php
                $productos = wc_get_products(['limit' => -1, 'orderby' => 'title', 'order' => 'ASC']);
                foreach ($productos as $prod) {
                    $tiene_historia = strlen($prod->get_description()) > 200;
                    $badge = $tiene_historia ? '✅' : '⚠️';
                    echo '<div class="duendes-producto-item" data-id="' . $prod->get_id() . '" data-nombre="' . esc_attr($prod->get_name()) . '">';
                    echo $badge . ' <strong>' . esc_html($prod->get_name()) . '</strong>';
                    echo '</div>';
                }
                ?>
            </div>

            <hr style="margin: 25px 0;">

            <h3>📝 Datos del Guardián</h3>

            <input type="hidden" id="producto_id" value="">

            <div class="duendes-row">
                <div>
                    <label>Nombre del Guardián *</label>
                    <input type="text" id="nombre" placeholder="Ej: Leprechaun, Luna Pixie, etc.">
                </div>
                <div>
                    <label>Tipo de Ser</label>
                    <select id="tipo">
                        <option value="Duende">Duende</option>
                        <option value="Pixie">Pixie</option>
                        <option value="Guardián">Guardián</option>
                        <option value="Guardiana">Guardiana</option>
                        <option value="Hada">Hada</option>
                        <option value="Elfo">Elfo</option>
                        <option value="Gnomo">Gnomo</option>
                        <option value="Mago">Mago</option>
                        <option value="Hechicera">Hechicera</option>
                    </select>
                </div>
            </div>

            <div class="duendes-row">
                <div>
                    <label>Género</label>
                    <select id="genero">
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                    </select>
                </div>
                <div>
                    <label>Categoría / Propósito</label>
                    <select id="proposito">
                        <option value="Protección">Protección</option>
                        <option value="Abundancia">Abundancia</option>
                        <option value="Amor">Amor</option>
                        <option value="Salud">Salud</option>
                        <option value="Sabiduría">Sabiduría</option>
                        <option value="Sanación">Sanación</option>
                    </select>
                </div>
            </div>

            <div class="duendes-row">
                <div>
                    <label>Tamaño</label>
                    <select id="tamano">
                        <option value="mini">Mini (10cm) - Recreable</option>
                        <option value="especial">Especial (10cm) - Recreable</option>
                        <option value="mediano" selected>Mediano (18cm) - Único</option>
                        <option value="grande">Grande (25cm) - Único</option>
                        <option value="gigante">Gigante - Único</option>
                    </select>
                </div>
                <div>
                    <label>Personalidad</label>
                    <select id="personalidad">
                        <option value="">Claude decide</option>
                        <option value="simpatico">Simpático y cálido</option>
                        <option value="grunon">Gruñón pero tierno</option>
                        <option value="misterioso">Misterioso y profundo</option>
                        <option value="jugueton">Juguetón y travieso</option>
                        <option value="sabio">Sabio y sereno</option>
                        <option value="protector">Protector y firme</option>
                        <option value="dulce">Dulce y maternal/paternal</option>
                        <option value="rebelde">Rebelde e intenso</option>
                        <option value="energetico">Energético y motivador</option>
                    </select>
                </div>
            </div>

            <label>Accesorios (cristales, amuletos, etc.)</label>
            <input type="text" id="accesorios" placeholder="Ej: cuarzo citrino, monedas doradas, trébol de cuatro hojas">

            <label>Instrucciones Especiales (opcional)</label>
            <textarea id="instrucciones" placeholder="Ej: Que sea intenso con la abundancia, que prometa lluvia de dinero... O: Es un vigilante, elegante y protector..."></textarea>

            <div style="margin-top: 20px;">
                <button type="button" class="duendes-btn" id="btn_generar" onclick="generarHistoria()">
                    ✨ Generar Historia con IA
                </button>
            </div>
        </div>

        <div class="duendes-resultado" id="resultado">
            <div class="duendes-loading" id="loading" style="display:none;">
                <span class="spinner is-active"></span>
                <p>Canalizando la historia... esto puede tardar unos segundos</p>
            </div>
            <div id="resultado_contenido"></div>
        </div>
    </div>

    <script>
    jQuery(document).ready(function($) {
        // Filtrar productos
        $('#buscar_producto').on('keyup', function() {
            var filtro = $(this).val().toLowerCase();
            $('.duendes-producto-item').each(function() {
                var nombre = $(this).data('nombre').toLowerCase();
                $(this).toggle(nombre.includes(filtro));
            });
        });

        // Seleccionar producto
        $('.duendes-producto-item').on('click', function() {
            $('.duendes-producto-item').removeClass('selected');
            $(this).addClass('selected');

            var id = $(this).data('id');
            var nombre = $(this).data('nombre');

            $('#producto_id').val(id);
            $('#nombre').val(nombre);

            // Detectar si es Pixie
            if (nombre.toLowerCase().includes('pixie')) {
                $('#tipo').val('Pixie');
                $('#genero').val('femenino');
            }
        });
    });

    function guardarConfig() {
        var url = document.getElementById('api_url').value;
        jQuery.post(ajaxurl, {
            action: 'duendes_guardar_config',
            api_url: url,
            nonce: '<?php echo wp_create_nonce("duendes_config"); ?>'
        }, function(resp) {
            alert('Configuración guardada');
        });
    }

    function generarHistoria() {
        var nombre = document.getElementById('nombre').value.trim();
        if (!nombre) {
            alert('Ingresá el nombre del guardián');
            return;
        }

        var btn = document.getElementById('btn_generar');
        var resultado = document.getElementById('resultado');
        var loading = document.getElementById('loading');
        var contenido = document.getElementById('resultado_contenido');

        btn.disabled = true;
        resultado.classList.add('visible');
        loading.style.display = 'block';
        contenido.innerHTML = '';

        var datos = {
            nombre: nombre,
            tipo: document.getElementById('tipo').value,
            genero: document.getElementById('genero').value,
            proposito: document.getElementById('proposito').value,
            categoriaTamano: document.getElementById('tamano').value,
            personalidad: document.getElementById('personalidad').value,
            accesorios: document.getElementById('accesorios').value,
            instruccionesPersonalizadas: document.getElementById('instrucciones').value,
            productId: document.getElementById('producto_id').value
        };

        var apiUrl = document.getElementById('api_url').value + '/api/admin/productos/generar-historia';

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
        .then(r => r.json())
        .then(data => {
            loading.style.display = 'none';
            btn.disabled = false;

            if (data.success && data.contenido) {
                var historia = data.contenido.historia || 'Historia generada';

                contenido.innerHTML = '<p class="duendes-success">✅ Historia generada correctamente</p>' +
                    '<div class="duendes-historia">' + historia.replace(/\n/g, '<br>') + '</div>' +
                    '<div style="margin-top:20px;">' +
                    '<button class="button button-primary" onclick="guardarEnProducto(\'' + encodeURIComponent(historia) + '\')">💾 Guardar en Producto</button> ' +
                    '<button class="button" onclick="copiarHistoria()">📋 Copiar al Portapapeles</button>' +
                    '</div>';
            } else {
                contenido.innerHTML = '<p class="duendes-error">❌ Error: ' + (data.error || 'Error desconocido') + '</p>';
            }
        })
        .catch(err => {
            loading.style.display = 'none';
            btn.disabled = false;
            contenido.innerHTML = '<p class="duendes-error">❌ Error de conexión: ' + err.message + '</p>';
        });
    }

    function guardarEnProducto(historiaEncoded) {
        var productId = document.getElementById('producto_id').value;
        if (!productId) {
            alert('Seleccioná un producto primero de la lista de arriba');
            return;
        }

        var historia = decodeURIComponent(historiaEncoded);

        jQuery.post(ajaxurl, {
            action: 'duendes_guardar_historia',
            product_id: productId,
            historia: historia,
            nonce: '<?php echo wp_create_nonce("duendes_historia"); ?>'
        }, function(resp) {
            if (resp.success) {
                alert('✅ Historia guardada en el producto');
            } else {
                alert('Error al guardar: ' + resp.data);
            }
        });
    }

    function copiarHistoria() {
        var texto = document.querySelector('.duendes-historia').innerText;
        navigator.clipboard.writeText(texto).then(function() {
            alert('Historia copiada al portapapeles');
        });
    }
    </script>
    <?php
}

// AJAX: Guardar configuración
add_action('wp_ajax_duendes_guardar_config', function() {
    check_ajax_referer('duendes_config', 'nonce');
    if (!current_user_can('manage_options')) wp_die('No autorizado');

    $url = sanitize_url($_POST['api_url']);
    update_option('duendes_vercel_api_url', $url);
    wp_send_json_success();
});

// AJAX: Guardar historia en producto
add_action('wp_ajax_duendes_guardar_historia', function() {
    check_ajax_referer('duendes_historia', 'nonce');
    if (!current_user_can('manage_options')) wp_send_json_error('No autorizado');

    $product_id = intval($_POST['product_id']);
    $historia = wp_kses_post($_POST['historia']);

    if (!$product_id || !$historia) {
        wp_send_json_error('Datos incompletos');
    }

    // Convertir markdown a HTML
    $historia_html = duendes_markdown_to_html($historia);

    $result = wp_update_post([
        'ID' => $product_id,
        'post_content' => $historia_html
    ]);

    if ($result && !is_wp_error($result)) {
        wp_send_json_success();
    } else {
        wp_send_json_error('Error al actualizar producto');
    }
});

function duendes_markdown_to_html($texto) {
    $texto = preg_replace('/\*\*([^*]+)\*\*/', '<strong>$1</strong>', $texto);
    $texto = preg_replace('/\*"([^"]+)"\*/', '<em>"$1"</em>', $texto);
    $texto = preg_replace('/\*([^*\n]+)\*/', '<em>$1</em>', $texto);

    $parrafos = preg_split('/\n\n+/', $texto);
    $html = '';

    foreach ($parrafos as $p) {
        $p = trim($p);
        if (empty($p)) continue;

        if (preg_match('/^- /', $p)) {
            $lineas = explode("\n", $p);
            $html .= '<ul>';
            foreach ($lineas as $linea) {
                $linea = preg_replace('/^- /', '', trim($linea));
                if ($linea) $html .= '<li>' . $linea . '</li>';
            }
            $html .= '</ul>';
        } else {
            $html .= '<p>' . nl2br($p) . '</p>';
        }
    }

    return $html;
}
