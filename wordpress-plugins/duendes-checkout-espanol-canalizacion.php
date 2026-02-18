<?php
/**
 * Plugin Name: Duendes - Checkout Espanol + Canalizacion
 * Description: Traduce el checkout de FunnelKit al espanol y agrega formulario de canalizacion en Thank You
 * Version: 2.1
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════════
// AGREGAR MENU DE NAVEGACION EN CHECKOUT
// ═══════════════════════════════════════════════════════════════════════════════

add_action('wp_body_open', 'duendes_agregar_menu_checkout', 1);
add_action('wp_head', 'duendes_menu_checkout_fallback', 999);

function duendes_menu_checkout_fallback() {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, 'checkouts') === false && strpos($uri, 'checkout') === false) return;
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Si no hay menu, inyectarlo
        if (!document.getElementById('duendes-checkout-menu')) {
            var menuHTML = `
            <nav id="duendes-checkout-menu" class="duendes-checkout-nav">
                <a href="https://duendesdeluruguay.com" class="duendes-nav-logo">Duendes del Uruguay</a>
                <div class="duendes-nav-links">
                    <a href="https://duendesdeluruguay.com/shop/">Tienda</a>
                    <a href="https://duendesdeluruguay.com/como-funciona/">Como Funciona</a>
                    <a href="https://duendesdeluruguay.com/nosotros/">Nosotros</a>
                    <a href="https://duendesdeluruguay.com/cart/" class="duendes-nav-cart">Carrito</a>
                </div>
            </nav>
            `;
            document.body.insertAdjacentHTML('afterbegin', menuHTML);
        }
    });
    </script>
    <style>
    .duendes-checkout-nav {
        position: sticky;
        top: 0;
        z-index: 9999;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 30px;
        background: #0a0a0a;
        border-bottom: 1px solid rgba(201,162,39,0.3);
    }
    .duendes-nav-logo {
        font-family: 'Cinzel', serif;
        font-size: 20px;
        color: #c9a227 !important;
        text-decoration: none !important;
        font-weight: 600;
    }
    .duendes-nav-links {
        display: flex;
        gap: 25px;
        align-items: center;
    }
    .duendes-nav-links a {
        font-family: 'Cormorant Garamond', serif;
        font-size: 15px;
        color: rgba(255,255,255,0.85) !important;
        text-decoration: none !important;
        transition: color 0.2s;
    }
    .duendes-nav-links a:hover {
        color: #c9a227 !important;
    }
    .duendes-nav-cart {
        background: #c9a227;
        color: #000 !important;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: 600;
    }
    .duendes-nav-cart:hover {
        background: #e8d48b;
        color: #000 !important;
    }
    @media (max-width: 768px) {
        .duendes-checkout-nav {
            padding: 12px 15px;
            flex-wrap: wrap;
            gap: 10px;
        }
        .duendes-nav-logo {
            font-size: 16px;
        }
        .duendes-nav-links {
            gap: 15px;
            font-size: 13px;
        }
        .duendes-nav-links a {
            font-size: 13px;
        }
    }
    </style>
    <?php
}

function duendes_agregar_menu_checkout() {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, 'checkouts') === false && strpos($uri, 'checkout') === false) return;
    ?>
    <nav id="duendes-checkout-menu" class="duendes-checkout-nav">
        <a href="https://duendesdeluruguay.com" class="duendes-nav-logo">Duendes del Uruguay</a>
        <div class="duendes-nav-links">
            <a href="https://duendesdeluruguay.com/shop/">Tienda</a>
            <a href="https://duendesdeluruguay.com/como-funciona/">Como Funciona</a>
            <a href="https://duendesdeluruguay.com/nosotros/">Nosotros</a>
            <a href="https://duendesdeluruguay.com/cart/" class="duendes-nav-cart">Carrito</a>
        </div>
    </nav>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRADUCCIONES AL ESPAÑOL - VERSION COMPLETA
// ═══════════════════════════════════════════════════════════════════════════════

add_action('wp_head', function() {
    if (!is_checkout() && strpos($_SERVER['REQUEST_URI'], 'checkouts') === false) return;
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        var traducciones = {
            // Encabezados principales
            'Order summary': 'Resumen del pedido',
            'Order Summary': 'Resumen del pedido',
            'Shipping Information': 'Informacion de envio',
            'Shipping Method': 'Metodo de envio',
            'Metodo de Envio': 'Metodo de envio',
            'Payment': 'Pago',
            'Payment Gateway': 'Metodo de pago',
            'Payment Method': 'Metodo de pago',
            'Billing Information': 'Informacion de facturacion',

            // Campos del formulario
            'Enter your address to view shipping options': 'Ingresa tu direccion para ver opciones de envio',
            'Enter your address to view shipping options.': 'Ingresa tu direccion para ver opciones de envio.',
            'Have a coupon? Click here to enter your code': 'Tenes un cupon? Haz clic para ingresar tu codigo',
            'Have a coupon?': 'Tenes un cupon?',
            'Click here to enter your code': 'Haz clic para ingresar tu codigo',
            'Coupon code': 'Codigo de cupon',
            'Apply': 'Aplicar',
            'Apply coupon': 'Aplicar cupon',

            // Resumen
            'Subtotal': 'Subtotal',
            'Total': 'Total',
            'Shipping': 'Envio',
            'Tax': 'Impuestos',
            'Discount': 'Descuento',
            'Free': 'Gratis',

            // Formulario campos
            'Email': 'Email',
            'Email address': 'Correo electronico',
            'Email *': 'Email *',
            'First name': 'Nombre',
            'First Name': 'Nombre',
            'Nombre *': 'Nombre *',
            'Last name': 'Apellido',
            'Last Name': 'Apellido',
            'Apellido *': 'Apellido *',
            'Company': 'Empresa',
            'Company (optional)': 'Empresa (opcional)',
            'Country / Region': 'Pais',
            'Country': 'Pais',
            'Pais *': 'Pais *',
            'Street address': 'Direccion',
            'Address': 'Direccion',
            'Direccion *': 'Direccion *',
            'House number and street name': 'Numero y calle',
            'Apartment, suite, unit, etc.': 'Apartamento, oficina, etc.',
            'Apartment, suite, unit, etc. (optional)': 'Apartamento, oficina, etc. (opcional)',
            'Town / City': 'Ciudad',
            'City': 'Ciudad',
            'Ciudad *': 'Ciudad *',
            'State': 'Departamento',
            'State / County': 'Departamento',
            'Province': 'Provincia',
            'Department': 'Departamento',
            'Department *': 'Departamento *',
            'Postcode / ZIP': 'Codigo postal',
            'ZIP Code': 'Codigo postal',
            'Postcode': 'Codigo postal',
            'Codigo postal *': 'Codigo postal *',
            'Phone': 'Telefono',
            'Phone (optional)': 'Telefono (opcional)',
            'Telefono (opcional)': 'Telefono (opcional)',

            // Billing / Facturacion
            'Use a different billing address': 'Usar una direccion de facturacion diferente',
            'Use a different billing address (optional)': 'Usar una direccion de facturacion diferente (opcional)',
            'Usar una direccion de facturacion diferente (opcional)': 'Usar una direccion de facturacion diferente (opcional)',
            'Billing address': 'Direccion de facturacion',
            'Billing details': 'Datos de facturacion',

            // Pago y transacciones
            'All transactions are secure and protected': 'Todas las transacciones son seguras y protegidas',
            'All transactions are secure and protected.': 'Todas las transacciones son seguras y protegidas.',
            'Place order': 'Realizar pedido',
            'Complete order': 'Completar pedido',
            'Confirm your order': 'Confirmar tu compra',
            'Confirmar tu Compra': 'Confirmar tu compra',
            'Pay now': 'Pagar ahora',
            'Proceed to payment': 'Proceder al pago',

            // Seguridad
            '256-Bit Bank Level Security': 'Seguridad bancaria de 256-Bit',
            '100% Secure Pagos': '100% Pagos Seguros',
            '100% Secure Payments': '100% Pagos Seguros',
            'Secure Payment': 'Pago Seguro',
            'SSL Secured': 'Protegido con SSL',

            // Terminos y privacidad
            'Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our': 'Tus datos personales seran utilizados para procesar tu pedido, mejorar tu experiencia en este sitio web, y para otros propositos descritos en nuestra',
            'privacy policy': 'politica de privacidad',
            'Privacy Policy': 'Politica de Privacidad',
            'I have read and agree to the website': 'He leido y acepto los',
            'terms and conditions': 'terminos y condiciones',
            'Terms and Conditions': 'Terminos y Condiciones',
            'Terms & Conditions': 'Terminos y Condiciones',
            'I have read and agree to the website terms and conditions': 'He leido y acepto los terminos y condiciones del sitio',
            'I agree to the': 'Acepto los',

            // Notas
            'Order notes': 'Notas del pedido',
            'Order notes (optional)': 'Notas del pedido (opcional)',
            'Notes about your order': 'Notas sobre tu pedido',
            'Add a note to your order': 'Agregar una nota a tu pedido',

            // Errores y mensajes
            'Please fill in this field': 'Por favor completa este campo',
            'This field is required': 'Este campo es obligatorio',
            'Invalid email address': 'Email invalido',
            'Please enter a valid email': 'Por favor ingresa un email valido',
            'Processing': 'Procesando',
            'Please wait': 'Por favor espera',
            'Loading': 'Cargando',
            'Error': 'Error',

            // Extras
            'Create an account': 'Crear una cuenta',
            'Create an account?': 'Crear una cuenta?',
            'Ship to a different address': 'Enviar a otra direccion',
            'Ship to a different address?': 'Enviar a otra direccion?',
            'Your cart is empty': 'Tu carrito esta vacio',
            'Return to shop': 'Volver a la tienda',
            'Continue shopping': 'Seguir comprando',
            'Continue to shipping': 'Continuar al envio',
            'Continue to payment': 'Continuar al pago',
            'Back': 'Volver',
            'Previous': 'Anterior',
            'Next': 'Siguiente',

            // Pasos del checkout
            'Cart': 'Carrito',
            'Carrito': 'Carrito',
            'Checkout': 'Checkout',
            'Order Confirmation': 'Confirmacion de Compra',
            'Confirmacion de Compra': 'Confirmacion de Compra',
            'Thank you': 'Gracias',

            // Extras FunnelKit
            "Sell\u00e1s el Pacto": 'Sellaras el Pacto',
            'Sellaras el Pacto': 'Sellaras el Pacto'
        };

        function traducirTextos() {
            // Traducir textos en todo el documento
            var walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            var nodesToTranslate = [];
            while (walker.nextNode()) {
                nodesToTranslate.push(walker.currentNode);
            }

            nodesToTranslate.forEach(function(node) {
                var texto = node.nodeValue.trim();
                if (texto && traducciones[texto]) {
                    node.nodeValue = node.nodeValue.replace(texto, traducciones[texto]);
                }
                // Traduccion parcial para textos largos
                for (var key in traducciones) {
                    if (texto.indexOf(key) !== -1) {
                        node.nodeValue = node.nodeValue.replace(key, traducciones[key]);
                    }
                }
            });

            // Traducir placeholders
            document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function(el) {
                var placeholder = el.getAttribute('placeholder');
                if (placeholder && traducciones[placeholder]) {
                    el.setAttribute('placeholder', traducciones[placeholder]);
                }
            });

            // Traducir labels
            document.querySelectorAll('label').forEach(function(el) {
                var texto = el.textContent.trim();
                if (texto && traducciones[texto]) {
                    el.textContent = traducciones[texto];
                }
            });

            // Traducir botones
            document.querySelectorAll('button, input[type="submit"], .button, .btn').forEach(function(el) {
                var texto = el.textContent.trim();
                if (texto && traducciones[texto]) {
                    el.textContent = traducciones[texto];
                }
                var value = el.getAttribute('value');
                if (value && traducciones[value]) {
                    el.setAttribute('value', traducciones[value]);
                }
            });

            // Traducir links
            document.querySelectorAll('a').forEach(function(el) {
                var texto = el.textContent.trim();
                if (texto && traducciones[texto]) {
                    el.textContent = traducciones[texto];
                }
            });

            // Arreglar links de terminos y privacidad
            document.querySelectorAll('a').forEach(function(el) {
                var texto = el.textContent.trim().toLowerCase();
                if (texto.indexOf('terms') !== -1 || texto.indexOf('terminos') !== -1 || texto.indexOf('conditions') !== -1) {
                    el.href = 'https://duendesdeluruguay.com/terminos-y-condiciones/';
                    el.textContent = 'terminos y condiciones';
                }
                if (texto.indexOf('privacy') !== -1 || texto.indexOf('privacidad') !== -1) {
                    el.href = 'https://duendesdeluruguay.com/politica-de-privacidad/';
                    el.textContent = 'politica de privacidad';
                }
            });
        }

        // Ejecutar traducciones
        traducirTextos();

        // Observer para contenido dinamico
        var observer = new MutationObserver(function(mutations) {
            traducirTextos();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Traducir periodicamente por si FunnelKit carga despues
        setInterval(traducirTextos, 1500);
    });
    </script>
    <?php
});

// ═══════════════════════════════════════════════════════════════════════════════
// GUARDAR TIPO DE DESTINATARIO (si se agrega al checkout en el futuro)
// ═══════════════════════════════════════════════════════════════════════════════

add_action('woocommerce_checkout_update_order_meta', 'duendes_guardar_datos_canalizacion');
function duendes_guardar_datos_canalizacion($order_id) {
    if (!empty($_POST['duendes_tipo_destinatario'])) {
        update_post_meta($order_id, '_duendes_tipo_destinatario', sanitize_text_field($_POST['duendes_tipo_destinatario']));
    }
    if (!empty($_POST['duendes_cuando_formulario'])) {
        update_post_meta($order_id, '_duendes_cuando_formulario', sanitize_text_field($_POST['duendes_cuando_formulario']));
    }
    // Marcar como formulario pendiente
    update_post_meta($order_id, '_duendes_formulario_completado', 'no');
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOTON Y FORMULARIO EN THANK YOU PAGE (CONFIRMACION)
// ═══════════════════════════════════════════════════════════════════════════════

// Mostrar boton/formulario en Thank You page
add_action('woocommerce_thankyou', 'duendes_thankyou_canalizacion', 5);
function duendes_thankyou_canalizacion($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    // Verificar si hay guardianes en el pedido
    $tiene_guardianes = false;
    foreach ($order->get_items() as $item) {
        $product_id = $item->get_product_id();
        $cats = wp_get_post_terms($product_id, 'product_cat', ['fields' => 'slugs']);
        $categorias_guardian = ['guardianes', 'duendes', 'hadas', 'pixies', 'brujos', 'elfos', 'gnomos', 'proteccion', 'abundancia', 'sanacion', 'amor', 'sabiduria'];
        if (array_intersect($cats, $categorias_guardian)) {
            $tiene_guardianes = true;
            break;
        }
    }

    if (!$tiene_guardianes) return;

    // Verificar si ya completo el formulario
    $completado = get_post_meta($order_id, '_duendes_formulario_completado', true);
    if ($completado === 'yes') return;

    // Mostrar boton grande para acceder al formulario
    ?>
    <div id="duendes-canalizacion-cta" class="duendes-cta-container">
        <div class="duendes-cta-badge">SOLO FALTA UN PASO</div>
        <h2 class="duendes-cta-titulo">Tu guardian necesita conocerte</h2>
        <p class="duendes-cta-desc">Para que pueda hablarte de verdad, completa el formulario de conexion.</p>
        <button id="duendes-btn-abrir-formulario" class="duendes-cta-boton">
            TOCA AQUI PARA ACCEDER AL FORMULARIO DE CANALIZACION
        </button>
    </div>

    <div id="duendes-formulario-canalizacion" class="duendes-formulario-container" style="display:none;">
        <div class="duendes-formulario-header">
            <h2>Conexion con tu Guardian</h2>
            <p>Tu guardian quiere conocerte para poder hablarte de verdad.</p>
        </div>

        <!-- Paso 1: Tipo de destinatario -->
        <div id="duendes-paso-tipo" class="duendes-paso">
            <h3 class="duendes-pregunta">Para quien es este guardian?</h3>
            <div class="duendes-opciones">
                <label class="duendes-opcion">
                    <input type="radio" name="duendes_tipo" value="para_mi" checked>
                    <span class="duendes-opcion-contenido">
                        <strong>Para mi</strong>
                        <small>Este guardian viene a acompanarme</small>
                    </span>
                </label>
                <label class="duendes-opcion">
                    <input type="radio" name="duendes_tipo" value="regalo_sabe">
                    <span class="duendes-opcion-contenido">
                        <strong>Es un regalo</strong>
                        <small>La persona que lo recibe lo sabe</small>
                    </span>
                </label>
                <label class="duendes-opcion">
                    <input type="radio" name="duendes_tipo" value="regalo_sorpresa">
                    <span class="duendes-opcion-contenido">
                        <strong>Es un regalo sorpresa</strong>
                        <small>Quiero que sea inesperado</small>
                    </span>
                </label>
                <label class="duendes-opcion">
                    <input type="radio" name="duendes_tipo" value="para_varios">
                    <span class="duendes-opcion-contenido">
                        <strong>Son varios guardianes</strong>
                        <small>Cada uno va a un hogar diferente</small>
                    </span>
                </label>
            </div>

            <h3 class="duendes-pregunta" style="margin-top:25px;">Cuando queres completar el formulario?</h3>
            <div class="duendes-opciones">
                <label class="duendes-opcion">
                    <input type="radio" name="duendes_cuando" value="ahora" checked>
                    <span class="duendes-opcion-contenido">
                        <strong>Ahora mismo</strong>
                        <small>Completar el formulario ahora</small>
                    </span>
                </label>
                <label class="duendes-opcion">
                    <input type="radio" name="duendes_cuando" value="despues">
                    <span class="duendes-opcion-contenido">
                        <strong>Despues por email</strong>
                        <small>Recibir un link para completar cuando quiera</small>
                    </span>
                </label>
            </div>

            <div class="duendes-nav">
                <button type="button" class="duendes-btn-continuar" id="duendes-btn-paso1">CONTINUAR</button>
            </div>
        </div>

        <!-- Paso 2: Formulario segun tipo (se carga dinamicamente) -->
        <div id="duendes-paso-formulario" class="duendes-paso" style="display:none;">
            <form id="duendes-form-datos">
                <input type="hidden" name="order_id" value="<?php echo esc_attr($order_id); ?>">
                <input type="hidden" name="nonce" value="<?php echo wp_create_nonce('duendes_canalizacion'); ?>">
                <input type="hidden" name="tipo" id="duendes-input-tipo" value="para_mi">

                <!-- PARA MI -->
                <div id="duendes-form-para-mi" class="duendes-subform">
                    <label class="duendes-label">Como te llamas? (o como te gustaria que te llame)</label>
                    <input type="text" name="nombre" class="duendes-input" value="<?php echo esc_attr($order->get_billing_first_name()); ?>" required>

                    <label class="duendes-label">Que momento de tu vida estas atravesando?</label>
                    <textarea name="momento" class="duendes-textarea" placeholder="Un cambio, una perdida, un nuevo comienzo, una busqueda..." required></textarea>

                    <label class="duendes-label">Que necesitas en este momento? (podes elegir varios)</label>
                    <div class="duendes-checkboxes">
                        <label><input type="checkbox" name="necesidades[]" value="proteccion"> Proteccion</label>
                        <label><input type="checkbox" name="necesidades[]" value="claridad"> Claridad</label>
                        <label><input type="checkbox" name="necesidades[]" value="abundancia"> Abundancia</label>
                        <label><input type="checkbox" name="necesidades[]" value="sanacion"> Sanacion</label>
                        <label><input type="checkbox" name="necesidades[]" value="amor"> Amor</label>
                        <label><input type="checkbox" name="necesidades[]" value="fuerza"> Fuerza</label>
                    </div>

                    <label class="duendes-label">Algo que tu guardian deberia saber? (opcional)</label>
                    <textarea name="mensaje" class="duendes-textarea" placeholder="Algo que no le contas a nadie..."></textarea>
                </div>

                <!-- REGALO QUE SABE -->
                <div id="duendes-form-regalo-sabe" class="duendes-subform" style="display:none;">
                    <p class="duendes-info">Le enviaremos un formulario a esa persona para que nos cuente sobre si.</p>

                    <label class="duendes-label">Nombre de quien lo recibe</label>
                    <input type="text" name="nombre_destinatario" class="duendes-input">

                    <label class="duendes-label">Email de quien lo recibe</label>
                    <input type="email" name="email_destinatario" class="duendes-input">

                    <label class="duendes-label">Mensaje personal para incluir (opcional)</label>
                    <textarea name="mensaje_personal" class="duendes-textarea" placeholder="Un mensaje que vera junto con la invitacion..."></textarea>
                </div>

                <!-- REGALO SORPRESA -->
                <div id="duendes-form-regalo-sorpresa" class="duendes-subform" style="display:none;">
                    <p class="duendes-info">Como es sorpresa, vos nos contas sobre esta persona.</p>

                    <label class="duendes-label">Como se llama?</label>
                    <input type="text" name="nombre_destinatario" class="duendes-input">

                    <label class="duendes-label">Cual es tu relacion?</label>
                    <select name="relacion" class="duendes-select">
                        <option value="">Selecciona...</option>
                        <option value="pareja">Pareja</option>
                        <option value="mama">Mama</option>
                        <option value="papa">Papa</option>
                        <option value="hermana">Hermana/o</option>
                        <option value="hija">Hija/o</option>
                        <option value="amiga">Amiga/o</option>
                        <option value="otro">Otro</option>
                    </select>

                    <label class="duendes-label">Que momento esta atravesando?</label>
                    <textarea name="momento_dest" class="duendes-textarea" placeholder="Una separacion, un duelo, un logro..."></textarea>

                    <label class="duendes-label">Que crees que necesita escuchar?</label>
                    <textarea name="que_necesita" class="duendes-textarea" placeholder="Algo que vos le dirias..."></textarea>

                    <label class="duendes-label">Como describirias su personalidad?</label>
                    <div class="duendes-checkboxes">
                        <label><input type="checkbox" name="personalidad[]" value="sensible"> Sensible</label>
                        <label><input type="checkbox" name="personalidad[]" value="fuerte"> Fuerte</label>
                        <label><input type="checkbox" name="personalidad[]" value="sonadora"> Sonadora</label>
                        <label><input type="checkbox" name="personalidad[]" value="practica"> Practica</label>
                        <label><input type="checkbox" name="personalidad[]" value="reservada"> Reservada</label>
                        <label><input type="checkbox" name="personalidad[]" value="expresiva"> Expresiva</label>
                    </div>

                    <label class="duendes-checkbox-single">
                        <input type="checkbox" name="es_anonimo" value="1"> Prefiero que sea anonimo
                    </label>
                </div>

                <!-- PARA VARIOS -->
                <div id="duendes-form-para-varios" class="duendes-subform" style="display:none;">
                    <p class="duendes-info">Te enviaremos por email un formulario para cada guardian del pedido.</p>
                    <p>Guardianes en tu pedido:</p>
                    <ul class="duendes-lista-guardianes">
                    <?php
                    foreach ($order->get_items() as $item) {
                        echo '<li>' . esc_html($item->get_name()) . '</li>';
                    }
                    ?>
                    </ul>
                </div>

                <div class="duendes-nav">
                    <button type="button" class="duendes-btn-volver" id="duendes-btn-volver">VOLVER</button>
                    <button type="submit" class="duendes-btn-enviar">ENVIAR</button>
                </div>
            </form>
        </div>

        <!-- Mensaje de exito -->
        <div id="duendes-paso-exito" class="duendes-paso" style="display:none;">
            <div class="duendes-exito">
                <h2>Listo!</h2>
                <p>Tu guardian ya sabe quien sos. Pronto recibiras tu canalizacion personalizada.</p>
            </div>
        </div>

        <!-- Mensaje de despues por email -->
        <div id="duendes-paso-email" class="duendes-paso" style="display:none;">
            <div class="duendes-exito">
                <h2>Te enviamos un email</h2>
                <p>En unos minutos recibiras un email a <strong><?php echo esc_html($order->get_billing_email()); ?></strong> con el link para completar el formulario.</p>
                <p class="duendes-nota">Si no lo ves, revisa tu carpeta de spam.</p>
            </div>
        </div>
    </div>

    <style>
    /* CTA Container - Muy visible */
    .duendes-cta-container {
        background: #ffffff;
        border: 3px solid #c9a227;
        border-radius: 16px;
        padding: 40px 30px;
        margin: 30px 0;
        text-align: center;
        box-shadow: 0 8px 30px rgba(201,162,39,0.15);
    }

    .duendes-cta-badge {
        display: inline-block;
        background: #c9a227;
        color: #000;
        padding: 8px 20px;
        border-radius: 20px;
        font-family: 'Cinzel', serif;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 2px;
        margin-bottom: 20px;
    }

    .duendes-cta-titulo {
        font-family: 'Cinzel', serif;
        font-size: 28px;
        color: #1a1a1a;
        margin: 0 0 15px 0;
    }

    .duendes-cta-desc {
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
        color: #444;
        margin: 0 0 25px 0;
    }

    .duendes-cta-boton {
        display: inline-block;
        background: #000000;
        color: #ffffff !important;
        padding: 18px 40px;
        font-family: 'Cinzel', serif;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 1px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .duendes-cta-boton:hover {
        background: #222;
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    }

    /* Formulario Container */
    .duendes-formulario-container {
        background: #ffffff;
        border: 2px solid #e0e0e0;
        border-radius: 16px;
        padding: 35px;
        margin: 30px 0;
        max-width: 700px;
    }

    .duendes-formulario-header {
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
    }

    .duendes-formulario-header h2 {
        font-family: 'Cinzel', serif;
        font-size: 26px;
        color: #1a1a1a;
        margin: 0 0 10px 0;
    }

    .duendes-formulario-header p {
        font-family: 'Cormorant Garamond', serif;
        font-size: 17px;
        color: #666;
        margin: 0;
    }

    .duendes-paso {
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .duendes-pregunta {
        font-family: 'Cinzel', serif;
        font-size: 16px;
        color: #1a1a1a;
        margin: 0 0 15px 0;
    }

    .duendes-opciones {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .duendes-opcion {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        background: #f9f9f9;
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .duendes-opcion:hover {
        border-color: #c9a227;
        background: #fffdf5;
    }

    .duendes-opcion input[type="radio"] {
        margin-top: 4px;
        accent-color: #c9a227;
        transform: scale(1.2);
    }

    .duendes-opcion input[type="radio"]:checked ~ .duendes-opcion-contenido strong {
        color: #c9a227;
    }

    .duendes-opcion-contenido {
        display: flex;
        flex-direction: column;
        gap: 3px;
    }

    .duendes-opcion-contenido strong {
        font-family: 'Cormorant Garamond', serif;
        font-size: 17px;
        color: #1a1a1a;
        font-weight: 600;
    }

    .duendes-opcion-contenido small {
        font-family: 'Cormorant Garamond', serif;
        font-size: 14px;
        color: #888;
    }

    .duendes-label {
        display: block;
        font-family: 'Cinzel', serif;
        font-size: 14px;
        color: #1a1a1a;
        margin: 20px 0 8px 0;
    }

    .duendes-input, .duendes-textarea, .duendes-select {
        width: 100%;
        padding: 14px 16px;
        background: #ffffff;
        border: 2px solid #ddd;
        border-radius: 8px;
        color: #1a1a1a;
        font-family: 'Cormorant Garamond', serif;
        font-size: 16px;
        outline: none;
        transition: all 0.2s;
        box-sizing: border-box;
    }

    .duendes-input:focus, .duendes-textarea:focus, .duendes-select:focus {
        border-color: #c9a227;
        box-shadow: 0 0 0 3px rgba(201,162,39,0.1);
    }

    .duendes-textarea {
        min-height: 100px;
        resize: vertical;
    }

    .duendes-checkboxes {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .duendes-checkboxes label {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        background: #f5f5f5;
        border: 2px solid #e0e0e0;
        border-radius: 6px;
        cursor: pointer;
        font-family: 'Cormorant Garamond', serif;
        color: #333;
        font-size: 15px;
        transition: all 0.2s;
    }

    .duendes-checkboxes label:hover {
        border-color: #c9a227;
    }

    .duendes-checkboxes input:checked + span,
    .duendes-checkboxes label:has(input:checked) {
        border-color: #c9a227;
        background: #fffdf5;
        color: #8b6914;
    }

    .duendes-checkbox-single {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 15px;
        font-family: 'Cormorant Garamond', serif;
        color: #666;
        cursor: pointer;
    }

    .duendes-info {
        background: #fffdf5;
        border-left: 4px solid #c9a227;
        padding: 15px;
        margin-bottom: 20px;
        font-family: 'Cormorant Garamond', serif;
        color: #555;
        font-style: italic;
    }

    .duendes-nota {
        font-size: 14px;
        color: #888;
        font-style: italic;
        margin-top: 10px;
    }

    .duendes-lista-guardianes {
        list-style: none;
        padding: 0;
        margin: 15px 0;
    }

    .duendes-lista-guardianes li {
        padding: 10px 15px;
        background: #f9f9f9;
        border-radius: 6px;
        margin-bottom: 8px;
        font-family: 'Cormorant Garamond', serif;
        color: #333;
    }

    .duendes-nav {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        gap: 15px;
    }

    .duendes-btn-continuar, .duendes-btn-enviar {
        flex: 1;
        padding: 16px 30px;
        background: #000000;
        color: #ffffff !important;
        font-family: 'Cinzel', serif;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 1px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .duendes-btn-continuar:hover, .duendes-btn-enviar:hover {
        background: #222;
        transform: translateY(-1px);
    }

    .duendes-btn-volver {
        padding: 16px 30px;
        background: #ffffff;
        color: #333 !important;
        font-family: 'Cinzel', serif;
        font-size: 14px;
        letter-spacing: 1px;
        border: 2px solid #ddd;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .duendes-btn-volver:hover {
        border-color: #999;
    }

    .duendes-exito {
        text-align: center;
        padding: 40px 20px;
    }

    .duendes-exito h2 {
        font-family: 'Cinzel', serif;
        color: #c9a227;
        font-size: 32px;
        margin: 0 0 15px 0;
    }

    .duendes-exito p {
        font-family: 'Cormorant Garamond', serif;
        color: #444;
        font-size: 18px;
        margin: 0 0 10px 0;
    }

    @media (max-width: 600px) {
        .duendes-cta-container {
            padding: 30px 20px;
        }
        .duendes-cta-titulo {
            font-size: 22px;
        }
        .duendes-cta-boton {
            padding: 15px 25px;
            font-size: 14px;
        }
        .duendes-formulario-container {
            padding: 20px;
        }
        .duendes-checkboxes {
            flex-direction: column;
        }
        .duendes-nav {
            flex-direction: column;
        }
    }
    </style>

    <script>
    (function() {
        var ctaContainer = document.getElementById('duendes-canalizacion-cta');
        var formContainer = document.getElementById('duendes-formulario-canalizacion');
        var btnAbrir = document.getElementById('duendes-btn-abrir-formulario');
        var btnPaso1 = document.getElementById('duendes-btn-paso1');
        var btnVolver = document.getElementById('duendes-btn-volver');
        var form = document.getElementById('duendes-form-datos');

        var pasoTipo = document.getElementById('duendes-paso-tipo');
        var pasoForm = document.getElementById('duendes-paso-formulario');
        var pasoExito = document.getElementById('duendes-paso-exito');
        var pasoEmail = document.getElementById('duendes-paso-email');

        var subforms = {
            'para_mi': document.getElementById('duendes-form-para-mi'),
            'regalo_sabe': document.getElementById('duendes-form-regalo-sabe'),
            'regalo_sorpresa': document.getElementById('duendes-form-regalo-sorpresa'),
            'para_varios': document.getElementById('duendes-form-para-varios')
        };

        // Abrir formulario
        btnAbrir.addEventListener('click', function() {
            ctaContainer.style.display = 'none';
            formContainer.style.display = 'block';
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        // Paso 1 -> Paso 2
        btnPaso1.addEventListener('click', function() {
            var tipo = document.querySelector('input[name="duendes_tipo"]:checked').value;
            var cuando = document.querySelector('input[name="duendes_cuando"]:checked').value;

            document.getElementById('duendes-input-tipo').value = tipo;

            // Si elige despues, mostrar mensaje de email
            if (cuando === 'despues') {
                pasoTipo.style.display = 'none';
                pasoEmail.style.display = 'block';

                // Guardar en servidor
                var formData = new FormData();
                formData.append('action', 'duendes_guardar_canalizacion');
                formData.append('order_id', '<?php echo esc_js($order_id); ?>');
                formData.append('nonce', '<?php echo wp_create_nonce('duendes_canalizacion'); ?>');
                formData.append('tipo', tipo);
                formData.append('cuando', 'despues');

                fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                    method: 'POST',
                    body: formData
                });
                return;
            }

            // Mostrar subform correcto
            pasoTipo.style.display = 'none';
            pasoForm.style.display = 'block';

            for (var key in subforms) {
                subforms[key].style.display = key === tipo ? 'block' : 'none';
            }
        });

        // Volver
        btnVolver.addEventListener('click', function() {
            pasoForm.style.display = 'none';
            pasoTipo.style.display = 'block';
        });

        // Enviar formulario
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var btn = form.querySelector('.duendes-btn-enviar');
            btn.disabled = true;
            btn.textContent = 'ENVIANDO...';

            var formData = new FormData(form);
            formData.append('action', 'duendes_guardar_canalizacion');

            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                body: formData
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) {
                    pasoForm.style.display = 'none';
                    pasoExito.style.display = 'block';
                } else {
                    alert(data.data || 'Error. Intenta de nuevo.');
                    btn.disabled = false;
                    btn.textContent = 'ENVIAR';
                }
            })
            .catch(function() {
                alert('Error de conexion. Intenta de nuevo.');
                btn.disabled = false;
                btn.textContent = 'ENVIAR';
            });
        });
    })();
    </script>
    <?php
}

// AJAX handler para guardar canalizacion
add_action('wp_ajax_duendes_guardar_canalizacion', 'duendes_ajax_guardar_canalizacion');
add_action('wp_ajax_nopriv_duendes_guardar_canalizacion', 'duendes_ajax_guardar_canalizacion');
function duendes_ajax_guardar_canalizacion() {
    if (!wp_verify_nonce($_POST['nonce'], 'duendes_canalizacion')) {
        wp_send_json_error('Sesion expirada. Recarga la pagina.');
    }

    $order_id = intval($_POST['order_id']);
    $tipo = sanitize_text_field($_POST['tipo']);

    if (!$order_id) {
        wp_send_json_error('Pedido no encontrado.');
    }

    // Si es "despues", solo guardar eso
    if (isset($_POST['cuando']) && $_POST['cuando'] === 'despues') {
        update_post_meta($order_id, '_duendes_tipo_destinatario', $tipo);
        update_post_meta($order_id, '_duendes_cuando_formulario', 'despues');

        // Generar token y enviar email
        $token = wp_generate_password(32, false);
        update_post_meta($order_id, '_duendes_token_formulario', $token);
        do_action('duendes_enviar_email_formulario', $order_id, $token);

        wp_send_json_success(['message' => 'Email programado']);
        return;
    }

    // Recopilar datos segun tipo
    $datos = [
        'tipo' => $tipo,
        'fecha' => current_time('mysql')
    ];

    if ($tipo === 'para_mi') {
        $datos['nombre'] = sanitize_text_field($_POST['nombre']);
        $datos['momento'] = sanitize_textarea_field($_POST['momento']);
        $datos['necesidades'] = isset($_POST['necesidades']) ? array_map('sanitize_text_field', $_POST['necesidades']) : [];
        $datos['mensaje'] = sanitize_textarea_field($_POST['mensaje']);
    } elseif ($tipo === 'regalo_sabe') {
        $datos['nombre_destinatario'] = sanitize_text_field($_POST['nombre_destinatario']);
        $datos['email_destinatario'] = sanitize_email($_POST['email_destinatario']);
        $datos['mensaje_personal'] = sanitize_textarea_field($_POST['mensaje_personal']);
    } elseif ($tipo === 'regalo_sorpresa') {
        $datos['nombre_destinatario'] = sanitize_text_field($_POST['nombre_destinatario']);
        $datos['relacion'] = sanitize_text_field($_POST['relacion']);
        $datos['momento'] = sanitize_textarea_field($_POST['momento_dest']);
        $datos['que_necesita'] = sanitize_textarea_field($_POST['que_necesita']);
        $datos['personalidad'] = isset($_POST['personalidad']) ? array_map('sanitize_text_field', $_POST['personalidad']) : [];
        $datos['es_anonimo'] = isset($_POST['es_anonimo']);
    } elseif ($tipo === 'para_varios') {
        $datos['enviar_emails'] = true;
    }

    // Guardar
    update_post_meta($order_id, '_duendes_tipo_destinatario', $tipo);
    update_post_meta($order_id, '_duendes_datos_canalizacion', json_encode($datos, JSON_UNESCAPED_UNICODE));
    update_post_meta($order_id, '_duendes_formulario_completado', 'yes');
    update_post_meta($order_id, '_duendes_formulario_fecha', current_time('mysql'));

    // Trigger para integracion
    do_action('duendes_formulario_canalizacion_completado', $order_id, $datos);

    wp_send_json_success(['message' => 'Guardado']);
}
