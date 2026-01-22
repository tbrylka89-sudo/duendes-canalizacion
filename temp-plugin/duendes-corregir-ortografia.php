<?php
/**
 * Plugin Name: Duendes - Corregir Ortografía
 * Description: Botón para corregir ortografía en productos de WooCommerce
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// URL de la API de Vercel
define('DUENDES_VERCEL_API', 'https://duendes-vercel.vercel.app');

// Agregar metabox en productos
add_action('add_meta_boxes', function() {
    add_meta_box(
        'duendes_correccion_ortografia',
        '🔧 Corregir Ortografía',
        'duendes_metabox_correccion_render',
        'product',
        'side',
        'high'
    );
});

function duendes_metabox_correccion_render($post) {
    $producto_id = $post->ID;
    ?>
    <div id="duendes-correccion-box">
        <p style="color:#666;margin:0 0 10px 0;font-size:12px;">
            Corrige errores de ortografía en la descripción automáticamente.
        </p>
        <button type="button"
                id="btn-corregir-ortografia"
                class="button button-primary"
                style="width:100%;"
                data-producto="<?php echo esc_attr($producto_id); ?>">
            🔧 Corregir Ortografía
        </button>
        <div id="correccion-resultado" style="display:none;margin-top:10px;padding:8px;border-radius:4px;font-size:12px;"></div>
    </div>

    <script>
    (function() {
        var btn = document.getElementById('btn-corregir-ortografia');
        var resultado = document.getElementById('correccion-resultado');

        if (!btn) return;

        btn.addEventListener('click', function() {
            var productoId = this.getAttribute('data-producto');

            btn.disabled = true;
            btn.textContent = '⏳ Corrigiendo...';
            resultado.style.display = 'none';

            fetch('<?php echo DUENDES_VERCEL_API; ?>/api/admin/corregir-producto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productoId: parseInt(productoId) })
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                resultado.style.display = 'block';

                if (data.success) {
                    if (data.cambios) {
                        resultado.style.background = '#d4edda';
                        resultado.style.border = '1px solid #28a745';
                        resultado.style.color = '#155724';
                        resultado.innerHTML = '✅ <strong>Corregido!</strong><br><small>Recargá para ver cambios</small>';
                        setTimeout(function() {
                            if (confirm('¿Recargar página?')) location.reload();
                        }, 500);
                    } else {
                        resultado.style.background = '#e7f3ff';
                        resultado.style.border = '1px solid #0066cc';
                        resultado.style.color = '#004085';
                        resultado.innerHTML = '✨ Sin errores';
                    }
                } else {
                    resultado.style.background = '#f8d7da';
                    resultado.style.border = '1px solid #dc3545';
                    resultado.style.color = '#721c24';
                    resultado.innerHTML = '❌ ' + (data.error || 'Error');
                }

                btn.disabled = false;
                btn.textContent = '🔧 Corregir Ortografía';
            })
            .catch(function(err) {
                resultado.style.display = 'block';
                resultado.style.background = '#f8d7da';
                resultado.style.border = '1px solid #dc3545';
                resultado.style.color = '#721c24';
                resultado.innerHTML = '❌ Error: ' + err.message;
                btn.disabled = false;
                btn.textContent = '🔧 Corregir Ortografía';
            });
        });
    })();
    </script>
    <?php
}
