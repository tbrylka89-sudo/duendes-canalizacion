<?php
/**
 * Plugin Name: Duendes - Header y Footer Garantizado
 * Description: Asegura que header y footer aparezcan SIEMPRE en toda la web
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER GARANTIZADO - Se inyecta directamente via PHP
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_footer', 'duendes_footer_garantizado', 1);

function duendes_footer_garantizado() {
    if (is_admin()) return;
    ?>
    <style id="duendes-footer-garantizado-css">
    /* FOOTER ESTÉTICO COMPLETO */
    .duendes-footer-garantizado {
        background: linear-gradient(180deg, #0a0a0a 0%, #050505 100%);
        border-top: 1px solid rgba(201, 162, 39, 0.2);
        padding: 60px 20px 40px;
        font-family: 'Cormorant Garamond', Georgia, serif;
        position: relative;
        z-index: 100;
    }

    .duendes-footer-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    /* Top Section - Logo y descripción */
    .duendes-footer-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 40px;
        padding-bottom: 40px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        margin-bottom: 40px;
    }

    .duendes-footer-brand {
        flex: 1;
        min-width: 250px;
    }

    .duendes-footer-brand h3 {
        font-family: 'Cinzel', serif;
        font-size: 20px;
        color: #c9a227;
        margin: 0 0 10px 0;
        letter-spacing: 2px;
    }

    .duendes-footer-brand p {
        color: rgba(255,255,255,0.6);
        font-size: 15px;
        line-height: 1.6;
        margin: 0;
        max-width: 300px;
    }

    /* Secciones de links */
    .duendes-footer-links-section {
        display: flex;
        gap: 60px;
        flex-wrap: wrap;
    }

    .duendes-footer-column {
        min-width: 150px;
    }

    .duendes-footer-column h4 {
        font-family: 'Cinzel', serif;
        font-size: 12px;
        color: rgba(255,255,255,0.9);
        text-transform: uppercase;
        letter-spacing: 2px;
        margin: 0 0 20px 0;
    }

    .duendes-footer-column ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .duendes-footer-column li {
        margin-bottom: 12px;
    }

    .duendes-footer-column a {
        color: rgba(255,255,255,0.5);
        text-decoration: none;
        font-size: 14px;
        transition: color 0.3s ease;
    }

    .duendes-footer-column a:hover {
        color: #c9a227;
    }

    /* Redes sociales */
    .duendes-footer-social {
        display: flex;
        gap: 15px;
        margin-top: 20px;
    }

    .duendes-footer-social a {
        width: 40px;
        height: 40px;
        border: 1px solid rgba(201, 162, 39, 0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255,255,255,0.6);
        transition: all 0.3s ease;
    }

    .duendes-footer-social a:hover {
        border-color: #c9a227;
        color: #c9a227;
        transform: translateY(-3px);
    }

    .duendes-footer-social svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
    }

    /* Bottom Section - Copyright */
    .duendes-footer-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
    }

    .duendes-footer-copyright {
        color: rgba(255,255,255,0.4);
        font-size: 13px;
    }

    .duendes-footer-legal {
        display: flex;
        gap: 30px;
        flex-wrap: wrap;
    }

    .duendes-footer-legal a {
        color: rgba(255,255,255,0.4);
        text-decoration: none;
        font-size: 12px;
        letter-spacing: 1px;
        transition: color 0.3s ease;
    }

    .duendes-footer-legal a:hover {
        color: #c9a227;
    }

    /* Métodos de pago */
    .duendes-footer-payments {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-top: 15px;
    }

    .duendes-footer-payments img,
    .duendes-footer-payments svg {
        height: 24px;
        opacity: 0.5;
        transition: opacity 0.3s;
    }

    .duendes-footer-payments img:hover,
    .duendes-footer-payments svg:hover {
        opacity: 0.8;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .duendes-footer-top {
            flex-direction: column;
            text-align: center;
        }

        .duendes-footer-brand {
            align-items: center;
            display: flex;
            flex-direction: column;
        }

        .duendes-footer-brand p {
            max-width: 100%;
        }

        .duendes-footer-links-section {
            justify-content: center;
            gap: 40px;
        }

        .duendes-footer-column {
            text-align: center;
        }

        .duendes-footer-social {
            justify-content: center;
        }

        .duendes-footer-bottom {
            flex-direction: column;
            text-align: center;
        }

        .duendes-footer-legal {
            justify-content: center;
        }
    }

    /* Ocultar footer de Elementor si existe */
    .elementor-location-footer {
        display: none !important;
    }
    </style>

    <footer class="duendes-footer-garantizado">
        <div class="duendes-footer-container">
            <!-- Top Section -->
            <div class="duendes-footer-top">
                <div class="duendes-footer-brand">
                    <h3>Duendes del Uruguay</h3>
                    <p>Guardianes mágicos canalizados artesanalmente en Piriápolis. Cada pieza es única, creada especialmente para quien la recibe.</p>
                    <div class="duendes-footer-social">
                        <a href="https://www.instagram.com/duendesdeluruguay/" target="_blank" rel="noopener" aria-label="Instagram">
                            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                        <a href="https://www.facebook.com/duendesdeluruguay" target="_blank" rel="noopener" aria-label="Facebook">
                            <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href="https://wa.me/59892000000" target="_blank" rel="noopener" aria-label="WhatsApp">
                            <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </a>
                    </div>
                </div>

                <div class="duendes-footer-links-section">
                    <div class="duendes-footer-column">
                        <h4>Explorar</h4>
                        <ul>
                            <li><a href="/shop/">Tienda</a></li>
                            <li><a href="/descubri-que-duende-te-elige/">Test del Guardián</a></li>
                            <li><a href="/como-funciona/">Cómo Funciona</a></li>
                            <li><a href="/testimonios/">Testimonios</a></li>
                        </ul>
                    </div>

                    <div class="duendes-footer-column">
                        <h4>Información</h4>
                        <ul>
                            <li><a href="/nosotros/">Nosotros</a></li>
                            <li><a href="/faq/">Preguntas Frecuentes</a></li>
                            <li><a href="/contacto/">Contacto</a></li>
                            <li><a href="/mi-magia/">Mi Magia</a></li>
                        </ul>
                    </div>

                    <div class="duendes-footer-column">
                        <h4>Contacto</h4>
                        <ul>
                            <li><a href="mailto:hola@duendesdeluruguay.com">hola@duendesdeluruguay.com</a></li>
                            <li><a href="https://wa.me/59892000000">WhatsApp</a></li>
                            <li>Piriápolis, Uruguay</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Bottom Section -->
            <div class="duendes-footer-bottom">
                <div class="duendes-footer-copyright">
                    © 2016 — <?php echo date('Y'); ?> Duendes del Uruguay. Todos los derechos reservados.
                </div>

                <div class="duendes-footer-legal">
                    <a href="/terminos/">Términos y Condiciones</a>
                    <a href="/politica-de-privacidad/">Política de Privacidad</a>
                    <a href="/politica-de-envios/">Política de Envíos</a>
                    <a href="/politica-de-devoluciones/">Devoluciones</a>
                </div>
            </div>
        </div>
    </footer>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// GARANTIZAR HEADER - Verificar que existe y recrearlo si no
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_footer', 'duendes_garantizar_header', 5);

function duendes_garantizar_header() {
    if (is_admin()) return;
    ?>
    <script id="duendes-header-garantizado">
    (function() {
        'use strict';

        function verificarHeader() {
            var header = document.getElementById('duendesHeader') || document.querySelector('.duendes-header');

            if (!header) {
                console.warn('[Duendes] Header no encontrado, recreando...');
                crearHeaderEmergencia();
            } else {
                // Asegurar que el header sea visible
                header.style.display = '';
                header.style.visibility = 'visible';
                header.style.opacity = '1';
            }
        }

        function crearHeaderEmergencia() {
            // Solo crear si realmente no existe
            if (document.getElementById('duendesHeader')) return;

            var headerHTML = `
            <header class="duendes-header duendes-header-emergencia" id="duendesHeader">
                <div class="header-izquierda">
                    <nav class="header-nav">
                        <a href="/shop/">Tienda</a>
                        <a href="/descubri-que-duende-te-elige/">Test</a>
                        <a href="/como-funciona/">Cómo Funciona</a>
                    </nav>
                </div>
                <a href="/" class="header-logo-texto">
                    <span class="header-logo-nombre">Duendes del Uruguay</span>
                </a>
                <div class="header-derecha">
                    <a href="/mi-cuenta/" class="header-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="12" cy="8" r="4"/>
                            <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
                        </svg>
                    </a>
                    <a href="/carrito/" class="header-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                    </a>
                </div>
            </header>`;

            document.body.insertAdjacentHTML('afterbegin', headerHTML);
            console.log('[Duendes] Header de emergencia creado');
        }

        // Verificar inmediatamente y después de cargar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', verificarHeader);
        } else {
            verificarHeader();
        }

        // Verificación periódica por si algo lo elimina
        setTimeout(verificarHeader, 1000);
        setTimeout(verificarHeader, 3000);
        setTimeout(verificarHeader, 5000);

        // Observer para detectar si el header es eliminado
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.removedNodes.forEach(function(node) {
                    if (node.id === 'duendesHeader' || (node.classList && node.classList.contains('duendes-header'))) {
                        console.warn('[Duendes] Header fue eliminado, recreando...');
                        setTimeout(crearHeaderEmergencia, 100);
                    }
                });
            });
        });

        // Observar el body para cambios
        setTimeout(function() {
            observer.observe(document.body, { childList: true, subtree: false });
        }, 1000);
    })();
    </script>

    <style id="duendes-header-emergencia-css">
    /* Estilos para header de emergencia */
    .duendes-header-emergencia {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #0a0a0a;
        border-bottom: 1px solid rgba(201, 162, 39, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 30px;
        z-index: 99999;
    }

    .duendes-header-emergencia .header-nav {
        display: flex;
        gap: 25px;
    }

    .duendes-header-emergencia .header-nav a {
        color: rgba(255,255,255,0.8);
        text-decoration: none;
        font-family: 'Cinzel', serif;
        font-size: 12px;
        letter-spacing: 1px;
        text-transform: uppercase;
    }

    .duendes-header-emergencia .header-logo-texto {
        text-decoration: none;
        text-align: center;
    }

    .duendes-header-emergencia .header-logo-nombre {
        font-family: 'Cinzel', serif;
        font-size: 18px;
        color: #c9a227;
        letter-spacing: 2px;
    }

    .duendes-header-emergencia .header-derecha {
        display: flex;
        gap: 20px;
    }

    .duendes-header-emergencia .header-icon {
        color: rgba(255,255,255,0.8);
    }

    @media (max-width: 768px) {
        .duendes-header-emergencia .header-nav {
            display: none;
        }
    }
    </style>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// REMOVER FOOTER VIEJO DE producto-ajustes.php
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_footer', function() {
    ?>
    <script>
    // Remover footer duplicado si existe
    document.addEventListener('DOMContentLoaded', function() {
        var oldFooter = document.querySelector('.ddu-footer-section');
        if (oldFooter) {
            oldFooter.remove();
        }
    });
    </script>
    <?php
}, 999);
