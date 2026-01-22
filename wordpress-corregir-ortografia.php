<?php
/**
 * BOTÓN "CORREGIR ORTOGRAFÍA" EN PRODUCTOS DE WOOCOMMERCE
 *
 * Cómo usar:
 * 1. Copiá todo este código
 * 2. Pegalo en: Apariencia > Editor de temas > functions.php
 *    O mejor: usa el plugin "Code Snippets" y creá un snippet nuevo
 * 3. Cambiá TUDOMINIO.vercel.app por tu dominio real
 */

// Cambiar esto por tu dominio de Vercel
define('DUENDES_API_URL', 'https://TUDOMINIO.vercel.app');

// Agregar metabox en la página de edición del producto
add_action('add_meta_boxes', 'duendes_agregar_metabox_correccion');

function duendes_agregar_metabox_correccion() {
    add_meta_box(
        'duendes_correccion_ortografia',
        '🔧 Corregir Ortografía',
        'duendes_metabox_correccion_html',
        'product',
        'side',
        'high'
    );
}

function duendes_metabox_correccion_html($post) {
    $producto_id = $post->ID;
    ?>
    <div id="duendes-correccion-container">
        <p style="margin-bottom: 10px; color: #666;">
            Corrige automáticamente errores de ortografía en la descripción del producto.
        </p>
        <button type="button"
                id="btn-corregir-ortografia"
                class="button button-primary"
                style="width: 100%; margin-bottom: 10px;"
                onclick="corregirOrtografia(<?php echo $producto_id; ?>)">
            🔧 Corregir Ortografía
        </button>
        <div id="resultado-correccion" style="display: none; padding: 10px; border-radius: 4px; margin-top: 10px;"></div>
    </div>

    <script>
    async function corregirOrtografia(productoId) {
        const btn = document.getElementById('btn-corregir-ortografia');
        const resultado = document.getElementById('resultado-correccion');

        btn.disabled = true;
        btn.textContent = '⏳ Corrigiendo...';
        resultado.style.display = 'none';

        try {
            const response = await fetch('<?php echo DUENDES_API_URL; ?>/api/admin/corregir-producto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productoId: productoId })
            });

            const data = await response.json();

            resultado.style.display = 'block';

            if (data.success) {
                if (data.cambios) {
                    resultado.style.background = '#d4edda';
                    resultado.style.border = '1px solid #28a745';
                    resultado.style.color = '#155724';
                    resultado.innerHTML = '✅ <strong>Corregido!</strong><br>Recargá la página para ver los cambios.';

                    // Mostrar botón de recargar
                    setTimeout(() => {
                        if (confirm('¿Recargar la página para ver los cambios?')) {
                            location.reload();
                        }
                    }, 500);
                } else {
                    resultado.style.background = '#e7f3ff';
                    resultado.style.border = '1px solid #0066cc';
                    resultado.style.color = '#004085';
                    resultado.innerHTML = '✨ Sin errores detectados';
                }
            } else {
                resultado.style.background = '#f8d7da';
                resultado.style.border = '1px solid #dc3545';
                resultado.style.color = '#721c24';
                resultado.innerHTML = '❌ Error: ' + data.error;
            }
        } catch (error) {
            resultado.style.display = 'block';
            resultado.style.background = '#f8d7da';
            resultado.style.border = '1px solid #dc3545';
            resultado.style.color = '#721c24';
            resultado.innerHTML = '❌ Error de conexión: ' + error.message;
        }

        btn.disabled = false;
        btn.textContent = '🔧 Corregir Ortografía';
    }
    </script>
    <?php
}

// Mostrar notificación si viene de corrección
add_action('admin_notices', 'duendes_mostrar_notificacion_correccion');

function duendes_mostrar_notificacion_correccion() {
    if (isset($_GET['correccion'])) {
        $tipo = $_GET['correccion'];

        if ($tipo === 'ortografia_corregida') {
            echo '<div class="notice notice-success is-dismissible"><p>✅ Ortografía corregida exitosamente.</p></div>';
        } elseif ($tipo === 'sin_errores') {
            echo '<div class="notice notice-info is-dismissible"><p>✨ No se encontraron errores de ortografía.</p></div>';
        } elseif ($tipo === 'error') {
            echo '<div class="notice notice-error is-dismissible"><p>❌ Hubo un error al corregir. Intentá de nuevo.</p></div>';
        }
    }
}
?>
