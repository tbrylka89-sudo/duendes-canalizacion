<?php
/**
 * Plugin Name: Duendes WhatsApp Contacto
 * Description: Botón de WhatsApp discreto solo en /contacto/
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// Número de WhatsApp
define('DUENDES_WHATSAPP_NUMERO', '59898690629');
define('DUENDES_WHATSAPP_MENSAJE', 'Hola! Quiero saber más sobre los guardianes');

// =============================================================================
// INYECTAR EN PÁGINA DE CONTACTO
// =============================================================================

add_action('wp_footer', 'duendes_whatsapp_contacto_boton');

function duendes_whatsapp_contacto_boton() {
    // Solo en página de contacto
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, 'contacto') === false && !is_page('contacto')) {
        return;
    }

    $whatsapp_url = 'https://wa.me/' . DUENDES_WHATSAPP_NUMERO . '?text=' . urlencode(DUENDES_WHATSAPP_MENSAJE);
    ?>
    <style>
    /* WhatsApp Section - Solo contacto */
    .duendes-wa-section {
        text-align: center;
        padding: 40px 20px;
        margin: 40px auto;
        max-width: 600px;
    }

    .duendes-wa-title {
        font-family: 'Cinzel', serif;
        font-size: 14px;
        letter-spacing: 3px;
        color: rgba(255,255,255,0.5);
        text-transform: uppercase;
        margin: 0 0 20px 0;
    }

    .duendes-wa-link {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 16px 32px;
        background: transparent;
        border: 1px solid rgba(37, 211, 102, 0.4);
        color: rgba(255,255,255,0.85);
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
        text-decoration: none;
        transition: all 0.3s ease;
        border-radius: 4px;
    }

    .duendes-wa-link:hover {
        background: rgba(37, 211, 102, 0.1);
        border-color: rgba(37, 211, 102, 0.6);
        color: #fff;
    }

    .duendes-wa-link svg {
        width: 24px;
        height: 24px;
        fill: #25D366;
        transition: transform 0.3s;
    }

    .duendes-wa-link:hover svg {
        transform: scale(1.1);
    }

    .duendes-wa-nota {
        font-family: 'Cormorant Garamond', serif;
        font-size: 14px;
        color: rgba(255,255,255,0.4);
        margin-top: 15px;
        font-style: italic;
    }
    </style>

    <script>
    (function() {
        // Buscar formulario de contacto y agregar sección de WhatsApp después
        function agregarWhatsApp() {
            // Buscar el formulario o sección de contacto
            var contenido = document.querySelector('.elementor-widget-form') ||
                           document.querySelector('.wpcf7') ||
                           document.querySelector('[data-elementor-type="wp-page"]') ||
                           document.querySelector('main');

            if (!contenido) return;

            // Ver si ya existe
            if (document.querySelector('.duendes-wa-section')) return;

            // Crear sección
            var waSection = document.createElement('div');
            waSection.className = 'duendes-wa-section';
            waSection.innerHTML = `
                <p class="duendes-wa-title">O si preferís</p>
                <a href="<?php echo esc_url($whatsapp_url); ?>" class="duendes-wa-link" target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Escribinos por WhatsApp
                </a>
                <p class="duendes-wa-nota">Respondemos de lunes a viernes, 10 a 18hs (Uruguay)</p>
            `;

            // Insertar después del contenido principal
            if (contenido.parentNode) {
                // Buscar el final del contenido de contacto
                var forms = document.querySelectorAll('.elementor-widget-form, .wpcf7');
                if (forms.length > 0) {
                    var lastForm = forms[forms.length - 1];
                    lastForm.parentNode.insertBefore(waSection, lastForm.nextSibling);
                } else {
                    // Agregar al final del main
                    var main = document.querySelector('main') || document.querySelector('.site-main');
                    if (main) {
                        main.appendChild(waSection);
                    }
                }
            }
        }

        // Ejecutar cuando DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(agregarWhatsApp, 500);
            });
        } else {
            setTimeout(agregarWhatsApp, 500);
        }
    })();
    </script>
    <?php
}

// =============================================================================
// SHORTCODE ALTERNATIVO
// =============================================================================

add_shortcode('duendes_whatsapp', function($atts) {
    $atts = shortcode_atts([
        'texto' => 'Escribinos por WhatsApp',
        'mensaje' => DUENDES_WHATSAPP_MENSAJE,
    ], $atts);

    $url = 'https://wa.me/' . DUENDES_WHATSAPP_NUMERO . '?text=' . urlencode($atts['mensaje']);

    ob_start();
    ?>
    <div style="text-align:center;margin:30px 0;">
        <a href="<?php echo esc_url($url); ?>"
           target="_blank"
           rel="noopener"
           style="display:inline-flex;align-items:center;gap:10px;padding:14px 28px;background:transparent;border:1px solid rgba(37,211,102,0.4);color:rgba(255,255,255,0.85);font-family:'Cormorant Garamond',serif;font-size:16px;text-decoration:none;transition:all 0.3s;border-radius:4px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <?php echo esc_html($atts['texto']); ?>
        </a>
    </div>
    <?php
    return ob_get_clean();
});
