<?php
/**
 * Plugin Name: Duendes - Thank You + Canalizacion
 * Description: Traduce la pagina de confirmacion y agrega formulario de canalizacion
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Agregar traducciones y boton de canalizacion
add_action('wp_footer', function() {
    // Solo en paginas de thank you / confirmacion
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, 'thank') === false &&
        strpos($uri, 'confirmacion') === false &&
        strpos($uri, 'order-received') === false &&
        !is_wc_endpoint_url('order-received')) {
        return;
    }
    ?>
    <style>
    /* Boton de canalizacion */
    .duendes-canalizacion-section {
        max-width: 600px;
        margin: 40px auto;
        padding: 30px;
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        border: 2px solid #c9a227;
        border-radius: 12px;
        text-align: center;
    }

    .duendes-canalizacion-section h3 {
        font-family: 'Cinzel', serif;
        color: #c9a227;
        font-size: 24px;
        margin-bottom: 15px;
    }

    .duendes-canalizacion-section p {
        color: rgba(255,255,255,0.85);
        font-family: 'Cormorant Garamond', serif;
        font-size: 16px;
        margin-bottom: 25px;
        line-height: 1.6;
    }

    .duendes-canalizacion-btn {
        display: inline-block;
        background: #000;
        color: #fff !important;
        padding: 16px 40px;
        font-family: 'Cinzel', serif;
        font-size: 14px;
        letter-spacing: 2px;
        text-transform: uppercase;
        text-decoration: none;
        border: 1px solid #c9a227;
        border-radius: 6px;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .duendes-canalizacion-btn:hover {
        background: #c9a227;
        color: #000 !important;
        transform: translateY(-2px);
    }

    /* Formulario de canalizacion */
    .duendes-form-container {
        display: none;
        max-width: 700px;
        margin: 30px auto;
        padding: 40px;
        background: #f5f5f0;
        border-radius: 12px;
        border: 2px solid #c9a227;
    }

    .duendes-form-container.active {
        display: block;
    }

    .duendes-form-container h3 {
        font-family: 'Cinzel', serif;
        color: #1a1a1a;
        font-size: 22px;
        text-align: center;
        margin-bottom: 25px;
    }

    .duendes-form-container label {
        display: block;
        font-family: 'Cormorant Garamond', serif;
        font-size: 16px;
        color: #333;
        margin-bottom: 8px;
        font-weight: 600;
    }

    .duendes-form-container input,
    .duendes-form-container select,
    .duendes-form-container textarea {
        width: 100%;
        padding: 12px 15px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-family: 'Cormorant Garamond', serif;
        font-size: 16px;
        color: #333;
        background: #fff;
    }

    .duendes-form-container textarea {
        min-height: 120px;
        resize: vertical;
    }

    .duendes-form-container input:focus,
    .duendes-form-container select:focus,
    .duendes-form-container textarea:focus {
        outline: none;
        border-color: #c9a227;
        box-shadow: 0 0 0 2px rgba(201,162,39,0.2);
    }

    .duendes-form-submit {
        width: 100%;
        background: #000;
        color: #fff;
        padding: 16px;
        font-family: 'Cinzel', serif;
        font-size: 14px;
        letter-spacing: 2px;
        text-transform: uppercase;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .duendes-form-submit:hover {
        background: #c9a227;
        color: #000;
    }

    .duendes-form-success {
        text-align: center;
        padding: 30px;
        color: #2e7d32;
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
    }
    </style>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            // Traducciones para Thank You page
            var t = {
                'Thank You': 'Gracias',
                'Thank you': 'Gracias',
                'Your Order is Confirmed': 'Tu Pedido esta Confirmado',
                'Your order is confirmed': 'Tu pedido esta confirmado',
                'Order Confirmed': 'Pedido Confirmado',
                'We have accepted your order': 'Hemos aceptado tu pedido',
                'and we\'re getting it ready': 'y lo estamos preparando',
                'we\'re getting it ready': 'lo estamos preparando',
                'A confirmation email has been sent': 'Te hemos enviado un email de confirmacion',
                'A confirmation mail has been sent to': 'Te enviamos un email de confirmacion a',
                'confirmation mail has been sent': 'email de confirmacion enviado',
                'Customer Details': 'Datos del Cliente',
                'Order Details': 'Detalles del Pedido',
                'Order details': 'Detalles del pedido',
                'Order Number': 'Numero de Pedido',
                'Order number': 'Numero de pedido',
                'Date': 'Fecha',
                'Email': 'Correo electronico',
                'Phone': 'Telefono',
                'Payment Method': 'Metodo de Pago',
                'Payment method': 'Metodo de pago',
                'Billing Address': 'Direccion de Facturacion',
                'Billing address': 'Direccion de facturacion',
                'Shipping Address': 'Direccion de Envio',
                'Shipping address': 'Direccion de envio',
                'Total': 'Total',
                'Subtotal': 'Subtotal',
                'Shipping': 'Envio',
                'Product': 'Producto',
                'Quantity': 'Cantidad',
                'Price': 'Precio',
                'Continue Shopping': 'Seguir Comprando',
                'View Order': 'Ver Pedido',
                'Track Order': 'Rastrear Pedido',
                'United States (US)': 'Estados Unidos',
                'United States': 'Estados Unidos',
                'Argentina': 'Argentina',
                'Mexico': 'Mexico',
                'Uruguay': 'Uruguay',
                'Spain': 'Espana',
                'Chile': 'Chile',
                'Colombia': 'Colombia',
                'Peru': 'Peru'
            };

            function traducirThankYou() {
                // Traducir texto nodo por nodo
                var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
                var nodosAModificar = [];

                while (walker.nextNode()) {
                    nodosAModificar.push(walker.currentNode);
                }

                nodosAModificar.forEach(function(node) {
                    var txt = node.nodeValue;
                    if (!txt) return;

                    // Frases largas primero (orden importa)
                    txt = txt.replace(/and we're getting it ready\. A confirmation mail has been sent to/gi, 'y lo estamos preparando. Te enviamos un email de confirmacion a');
                    txt = txt.replace(/and we're getting it ready/gi, 'y lo estamos preparando');
                    txt = txt.replace(/A confirmation mail has been sent to/gi, 'Te enviamos un email de confirmacion a');
                    txt = txt.replace(/A confirmation email has been sent to/gi, 'Te enviamos un email de confirmacion a');
                    txt = txt.replace(/We have accepted your order,/gi, 'Hemos aceptado tu pedido,');
                    txt = txt.replace(/We have accepted your order/gi, 'Hemos aceptado tu pedido');
                    txt = txt.replace(/United States \(US\)/gi, 'Estados Unidos');

                    // Traducciones del diccionario
                    for (var key in t) {
                        if (txt.indexOf(key) !== -1) {
                            txt = txt.split(key).join(t[key]);
                        }
                    }

                    if (txt !== node.nodeValue) {
                        node.nodeValue = txt;
                    }
                });

                // Traducir "Thank You [Nombre]!"
                document.querySelectorAll('h1, h2, h3, .wfacp-thankyou-title, [class*="thank"]').forEach(function(el) {
                    var text = el.textContent || el.innerText;
                    if (text.match(/Thank\s*You/i)) {
                        el.innerHTML = el.innerHTML.replace(/Thank\s*You/gi, 'Gracias');
                    }
                });
            }

            traducirThankYou();
            setInterval(traducirThankYou, 2000);

            // Agregar seccion de canalizacion si no existe
            if (!document.querySelector('.duendes-canalizacion-section')) {
                var container = document.querySelector('.wfacp-thankyou-wrap, .woocommerce-order, .entry-content, main');
                if (container) {
                    var section = document.createElement('div');
                    section.className = 'duendes-canalizacion-section';
                    section.innerHTML = '<h3>SOLO FALTA UN PASO</h3>' +
                        '<p>Para completar tu experiencia con Los Duendes del Uruguay, necesitamos algunos datos adicionales para la canalizacion de tu producto.</p>' +
                        '<button class="duendes-canalizacion-btn" onclick="mostrarFormCanalizacion()">COMPLETAR FORMULARIO DE CANALIZACION</button>';
                    container.appendChild(section);

                    // Agregar formulario
                    var form = document.createElement('div');
                    form.className = 'duendes-form-container';
                    form.id = 'formCanalizacion';
                    form.innerHTML = '<h3>Formulario de Canalizacion</h3>' +
                        '<form id="canalizacionForm">' +
                        '<label>Nombre completo de quien recibe el producto *</label>' +
                        '<input type="text" name="nombre_receptor" required placeholder="Nombre y apellido">' +
                        '<label>Fecha de nacimiento *</label>' +
                        '<input type="date" name="fecha_nacimiento" required>' +
                        '<label>Signo zodiacal</label>' +
                        '<select name="signo">' +
                        '<option value="">Seleccionar...</option>' +
                        '<option>Aries</option><option>Tauro</option><option>Geminis</option>' +
                        '<option>Cancer</option><option>Leo</option><option>Virgo</option>' +
                        '<option>Libra</option><option>Escorpio</option><option>Sagitario</option>' +
                        '<option>Capricornio</option><option>Acuario</option><option>Piscis</option>' +
                        '</select>' +
                        '<label>Intencion o deseo para el producto *</label>' +
                        '<textarea name="intencion" required placeholder="Describe tu intencion, deseo o proposito para este producto..."></textarea>' +
                        '<label>Informacion adicional (opcional)</label>' +
                        '<textarea name="info_adicional" placeholder="Cualquier otra informacion que quieras compartir..."></textarea>' +
                        '<button type="submit" class="duendes-form-submit">ENVIAR FORMULARIO</button>' +
                        '</form>';
                    container.appendChild(form);
                }
            }
        }, 1000);
    });

    function mostrarFormCanalizacion() {
        var form = document.getElementById('formCanalizacion');
        if (form) {
            form.classList.add('active');
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Manejar envio del formulario
    document.addEventListener('submit', function(e) {
        if (e.target && e.target.id === 'canalizacionForm') {
            e.preventDefault();
            var formData = new FormData(e.target);
            var data = {};
            formData.forEach(function(value, key) { data[key] = value; });

            // Guardar en localStorage como backup
            localStorage.setItem('duendes_canalizacion', JSON.stringify(data));

            // Mostrar mensaje de exito
            e.target.innerHTML = '<div class="duendes-form-success">' +
                '<p style="font-size: 24px; margin-bottom: 15px;">✨</p>' +
                '<p><strong>Gracias!</strong></p>' +
                '<p>Tu formulario de canalizacion ha sido enviado correctamente.</p>' +
                '<p>Nos pondremos en contacto contigo pronto.</p>' +
                '</div>';
        }
    });
    </script>
    <?php
}, 9999);
