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
    /* FOOTER NEGRO MINIMALISTA */
    .duendes-footer-garantizado {
        background: #000000 !important;
        padding: 50px 20px !important;
        font-family: 'Cormorant Garamond', Georgia, serif !important;
        position: relative !important;
        z-index: 100 !important;
        border-top: 1px solid rgba(201, 162, 39, 0.15) !important;
    }

    .duendes-footer-container {
        max-width: 1200px !important;
        margin: 0 auto !important;
    }

    .duendes-footer-simple {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        text-align: center !important;
        gap: 20px !important;
    }

    .duendes-footer-nombre {
        font-family: 'Cinzel', serif !important;
        font-size: 22px !important;
        color: #c9a227 !important;
        margin: 0 !important;
        letter-spacing: 3px !important;
        text-transform: uppercase !important;
        font-weight: 500 !important;
    }

    .duendes-footer-legal {
        display: flex !important;
        align-items: center !important;
        gap: 15px !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
    }

    .duendes-footer-legal a {
        color: rgba(255,255,255,0.5) !important;
        text-decoration: none !important;
        font-size: 13px !important;
        letter-spacing: 0.5px !important;
        transition: color 0.3s ease !important;
    }

    .duendes-footer-legal a:hover {
        color: #c9a227 !important;
    }

    .duendes-footer-sep {
        color: rgba(255,255,255,0.2) !important;
        font-size: 10px !important;
    }

    .duendes-footer-copyright {
        color: rgba(255,255,255,0.35) !important;
        font-size: 12px !important;
        margin: 10px 0 0 0 !important;
        letter-spacing: 0.5px !important;
    }

    /* Responsive */
    @media (max-width: 500px) {
        .duendes-footer-garantizado {
            padding: 40px 15px !important;
        }

        .duendes-footer-nombre {
            font-size: 18px !important;
            letter-spacing: 2px !important;
        }

        .duendes-footer-legal {
            flex-direction: column !important;
            gap: 10px !important;
        }

        .duendes-footer-sep {
            display: none !important;
        }
    }

    /* Ocultar TODOS los footers excepto el nuestro */
    .elementor-location-footer,
    footer:not(.duendes-footer-garantizado),
    .site-footer,
    .footer-widget-area,
    .footer-main,
    .ast-footer,
    .starter-footer,
    #footer,
    #site-footer,
    .wp-block-template-part footer,
    [data-elementor-type="footer"],
    .elementor-element footer,
    section.elementor-section:has(footer),
    .e-con:has(footer),
    .ddu-footer-section {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
        opacity: 0 !important;
    }

    /* Ocultar footers que contengan "Explorar", "Colecciones", newsletter */
    .elementor-widget-container:has(.elementor-heading-title:contains("Explorar")),
    .elementor-section:has(.elementor-form),
    .elementor-element:has(input[placeholder*="email"]) {
        display: none !important;
    }

    /* Ocultar cualquier imagen circular grande suelta (posibles restos de footers) */
    body > .elementor-section img[style*="border-radius: 50%"],
    body > .elementor-section img[style*="border-radius:50%"],
    body > section img[style*="border-radius: 50%"],
    .elementor-location-footer img,
    [data-elementor-type="footer"] img {
        display: none !important;
    }

    /* PROTEGER TITO - Asegurar que siempre sea visible */
    .tito-widget,
    #titoWidget,
    [class*="tito-"],
    .tito-toggle,
    .tito-panel {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
    }
    .tito-widget {
        z-index: 9999999 !important;
    }
    </style>

    <script>
    // PROTECCIÓN GLOBAL DE TITO - Ejecutar INMEDIATAMENTE
    (function protegerTitoGlobal() {
        // Función que protege a Tito
        function asegurarTito() {
            var tito = document.querySelector('.tito-widget, #titoWidget');
            if (tito) {
                tito.setAttribute('data-protegido', 'si');
                tito.style.setProperty('display', 'block', 'important');
                tito.style.setProperty('visibility', 'visible', 'important');
                tito.style.setProperty('opacity', '1', 'important');
                tito.style.setProperty('z-index', '9999999', 'important');
            }
        }

        // Ejecutar constantemente
        setInterval(asegurarTito, 100);

        // Observer para detectar si Tito es eliminado
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                m.removedNodes.forEach(function(node) {
                    if (node.classList && (node.classList.contains('tito-widget') || node.id === 'titoWidget')) {
                        console.warn('[Footer] Tito fue eliminado! Restaurando...');
                        // Reinsertar Tito al body
                        document.body.appendChild(node);
                        asegurarTito();
                    }
                });
            });
        });

        // Observar el body
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
    })();

    // Remover footers viejos por JavaScript
    function limpiarFootersViejos() {
        // Buscar y OCULTAR (no eliminar) todos los footers excepto el nuestro
        document.querySelectorAll('footer, [data-elementor-type="footer"], .elementor-location-footer, .site-footer, #footer').forEach(function(f) {
            // NO tocar nada que sea o contenga a Tito
            if (f.classList.contains('tito-widget') || f.id === 'titoWidget' ||
                f.querySelector('.tito-widget') || f.querySelector('#titoWidget') ||
                f.closest('.tito-widget')) {
                return;
            }
            if (!f.classList.contains('duendes-footer-garantizado')) {
                // OCULTAR en lugar de eliminar
                f.style.cssText = 'display:none!important;height:0!important;overflow:hidden!important;visibility:hidden!important;';
            }
        });

        // Textos que indican footer viejo
        var textosProhibidos = [
            'Nacidos en Piriápolis',
            'Destinados a encontrarte',
            'Explorar',
            'Colecciones',
            'Atención al Cliente',
            'Suscríbete a nuestra newsletter',
            '© 2025 Duendes',
            'Enter your email',
            'Back to top',
            'circulo de duendes',
            'espacio que se ve el bosque'
        ];

        // Eliminar el footer negro duplicado (Elementor) que tiene MAYÚSCULAS
        document.querySelectorAll('.elementor-section, .e-con, section, div').forEach(function(el) {
            var text = el.textContent || '';
            // El footer de Elementor usa mayúsculas, el nuestro no
            if (text.includes('TÉRMINOS Y CONDICIONES') && text.includes('POLÍTICA DE PRIVACIDAD') &&
                !el.classList.contains('duendes-footer-garantizado') &&
                !el.closest('.duendes-footer-garantizado')) {
                el.style.cssText = 'display:none!important;';
            }
            // También el que dice "2016 — 2026" pero no está en nuestro footer
            if (text.includes('2016') && text.includes('2026') &&
                !el.classList.contains('duendes-footer-garantizado') &&
                !el.closest('.duendes-footer-garantizado') &&
                el.querySelectorAll('*').length < 20) {
                el.style.cssText = 'display:none!important;';
            }
        });

        // Buscar TODAS las secciones y elementos (pero proteger Tito)
        document.querySelectorAll('.elementor-section, .e-con, .e-con-inner, section, .elementor-element, .elementor-widget-wrap').forEach(function(el) {
            // PROTEGER TITO
            if (el.closest('.tito-widget') || el.closest('[class*="tito"]')) return;

            var text = el.textContent || '';
            for (var i = 0; i < textosProhibidos.length; i++) {
                if (text.includes(textosProhibidos[i])) {
                    // Subir al contenedor padre más grande
                    var parent = el;
                    while (parent.parentElement &&
                           parent.parentElement.tagName !== 'BODY' &&
                           parent.parentElement.tagName !== 'MAIN' &&
                           !parent.parentElement.classList.contains('duendes-footer-garantizado') &&
                           !parent.parentElement.classList.contains('tito-widget')) {
                        if (parent.classList.contains('elementor-section') ||
                            parent.classList.contains('e-con') ||
                            parent.tagName === 'SECTION') {
                            break;
                        }
                        parent = parent.parentElement;
                    }
                    // No ocultar si es parte de Tito
                    if (!parent.closest('.tito-widget') && !parent.classList.contains('tito-widget')) {
                        parent.style.cssText = 'display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;';
                    }
                    break;
                }
            }
        });

        // Específicamente buscar el gris con fondo (pero NO tocar Tito)
        document.querySelectorAll('*').forEach(function(el) {
            // PROTEGER TITO - nunca tocar elementos del widget
            if (el.classList.contains('tito-widget') || el.closest('.tito-widget') ||
                el.id && el.id.includes('tito') || el.closest('[id*="tito"]')) {
                return;
            }
            var style = window.getComputedStyle(el);
            var bg = style.backgroundColor;
            // Si tiene fondo gris y contiene texto de footer viejo
            if ((bg.includes('128') || bg.includes('169') || bg.includes('gray') || bg.includes('grey')) &&
                el.textContent && el.textContent.includes('Piriápolis') &&
                !el.classList.contains('tito-footer')) {
                el.style.cssText = 'display:none!important;';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', limpiarFootersViejos);
    window.addEventListener('load', limpiarFootersViejos);
    setTimeout(limpiarFootersViejos, 500);
    setTimeout(limpiarFootersViejos, 1500);
    setTimeout(limpiarFootersViejos, 3000);

    // SOLUCIÓN RADICAL: OCULTAR (no eliminar) todo lo que venga DESPUÉS de nuestro footer
    function eliminarDespuesDeNuestroFooter() {
        var nuestroFooter = document.querySelector('.duendes-footer-garantizado');
        if (nuestroFooter) {
            var siguiente = nuestroFooter.nextElementSibling;
            while (siguiente) {
                var temp = siguiente.nextElementSibling;

                // PROTEGER TITO - verificar de múltiples formas
                var esTito = siguiente.classList.contains('tito-widget') ||
                             siguiente.id === 'titoWidget' ||
                             (siguiente.id && siguiente.id.toLowerCase().includes('tito')) ||
                             siguiente.querySelector('.tito-widget') ||
                             siguiente.querySelector('#titoWidget') ||
                             (siguiente.className && siguiente.className.toLowerCase && siguiente.className.toLowerCase().includes('tito'));

                // PROTEGER MENSAJES DEL GUARDIAN
                var esDMG = (siguiente.id && siguiente.id.includes('dmg')) ||
                            siguiente.querySelector('#dmg-container') ||
                            siguiente.querySelector('.dmg-notificacion');

                if (!esTito && !esDMG) {
                    // OCULTAR en lugar de eliminar
                    siguiente.style.cssText = 'display:none!important;height:0!important;overflow:hidden!important;visibility:hidden!important;';
                }
                siguiente = temp;
            }
        }
    }

    // Eliminar footers de Elementor con imágenes (círculos de productos, etc.)
    function eliminarFootersConImagenes() {
        // Buscar secciones de Elementor que parecen footer y tienen imágenes
        document.querySelectorAll('.elementor-section, .e-con, section').forEach(function(el) {
            // Si tiene imágenes circulares y está cerca del final de la página
            var imagenes = el.querySelectorAll('img');
            var rect = el.getBoundingClientRect();
            var esFooterArea = rect.top > (window.innerHeight * 0.7);

            if (imagenes.length > 0 && esFooterArea &&
                !el.classList.contains('duendes-footer-garantizado') &&
                !el.closest('.duendes-footer-garantizado') &&
                !el.closest('.prod-hero') &&
                !el.closest('.prod-') &&
                !el.closest('#product-')) {
                // Verificar si es un footer viejo
                var texto = el.textContent || '';
                if (texto.includes('Explorar') || texto.includes('Colecciones') ||
                    texto.includes('newsletter') || texto.includes('2016') ||
                    texto.includes('TÉRMINOS') || texto.includes('POLÍTICA') ||
                    texto.includes('Back to top') || texto.includes('circulo')) {
                    el.style.cssText = 'display:none!important;height:0!important;overflow:hidden!important;';
                }
            }
        });

        // Ocultar específicamente .ddu-footer-section si existe
        document.querySelectorAll('.ddu-footer-section').forEach(function(el) {
            el.style.cssText = 'display:none!important;height:0!important;overflow:hidden!important;';
        });

        // Eliminar elementos con "Back to top"
        document.querySelectorAll('a, button, div').forEach(function(el) {
            if (el.textContent && el.textContent.includes('Back to top')) {
                var parent = el.closest('.elementor-section') || el.closest('section') || el.parentElement;
                if (parent && !parent.classList.contains('duendes-footer-garantizado')) {
                    parent.style.cssText = 'display:none!important;';
                }
            }
        });

        // Eliminar secciones con muchas imágenes circulares (típico de footer de productos)
        document.querySelectorAll('.elementor-section, .e-con, section').forEach(function(el) {
            var imgs = el.querySelectorAll('img');
            var circulares = 0;
            imgs.forEach(function(img) {
                var style = window.getComputedStyle(img);
                if (style.borderRadius === '50%' || style.borderRadius.includes('50%')) {
                    circulares++;
                }
            });
            // Si tiene 3+ imágenes circulares, probablemente es un footer de productos
            if (circulares >= 3 &&
                !el.closest('.prod-hero') &&
                !el.closest('.duendes-footer-garantizado') &&
                !el.classList.contains('tito-widget')) {
                el.style.cssText = 'display:none!important;height:0!important;overflow:hidden!important;';
            }
        });
    }

    setTimeout(eliminarDespuesDeNuestroFooter, 100);
    setTimeout(eliminarDespuesDeNuestroFooter, 1000);
    setTimeout(eliminarDespuesDeNuestroFooter, 2000);
    setTimeout(eliminarFootersConImagenes, 500);
    setTimeout(eliminarFootersConImagenes, 1500);
    setTimeout(eliminarFootersConImagenes, 3000);

    // SOLUCIÓN MÁS AGRESIVA: Ocultar CUALQUIER contenido después del producto en páginas de producto
    function limpiezaAgresiva() {
        // Proteger Tito primero
        var tito = document.querySelector('.tito-widget, #titoWidget');
        if (tito) {
            tito.style.cssText = 'display:block!important;visibility:visible!important;opacity:1!important;z-index:9999999!important;';
        }

        // Proteger mensajes del guardián
        var dmg = document.querySelector('#dmg-container');
        if (dmg) {
            dmg.style.cssText = 'display:block!important;visibility:visible!important;';
        }

        // Buscar el footer garantizado y eliminar todo lo que venga después excepto Tito y DMG
        var nuestroFooter = document.querySelector('.duendes-footer-garantizado');
        if (nuestroFooter && nuestroFooter.parentElement) {
            var hermanos = Array.from(nuestroFooter.parentElement.children);
            var indiceFooter = hermanos.indexOf(nuestroFooter);

            hermanos.forEach(function(el, idx) {
                if (idx > indiceFooter &&
                    !el.classList.contains('tito-widget') &&
                    el.id !== 'titoWidget' &&
                    !el.id.includes('tito') &&
                    !el.id.includes('dmg-') &&
                    !el.classList.contains('dmg-') &&
                    el.id !== 'dmg-container') {
                    el.style.cssText = 'display:none!important;height:0!important;overflow:hidden!important;';
                }
            });
        }

        // Buscar secciones con "Back to top" y ocultarlas
        document.querySelectorAll('*').forEach(function(el) {
            if (el.textContent &&
                (el.textContent.includes('Back to top') || el.textContent.includes('circulo de duendes')) &&
                !el.closest('.tito-widget') &&
                !el.closest('#titoWidget')) {
                var section = el.closest('.elementor-section') || el.closest('section') || el.closest('.e-con');
                if (section) {
                    section.style.cssText = 'display:none!important;height:0!important;';
                }
            }
        });
    }

    setTimeout(limpiezaAgresiva, 300);
    setTimeout(limpiezaAgresiva, 800);
    setTimeout(limpiezaAgresiva, 2000);
    setTimeout(limpiezaAgresiva, 4000);
    </script>

    <footer class="duendes-footer-garantizado">
        <div class="duendes-footer-container">
            <div class="duendes-footer-simple">
                <h3 class="duendes-footer-nombre">Duendes del Uruguay</h3>

                <div class="duendes-footer-legal">
                    <a href="/terminos/">Términos y Condiciones</a>
                    <span class="duendes-footer-sep">•</span>
                    <a href="/politica-de-privacidad/">Política de Privacidad</a>
                </div>

                <p class="duendes-footer-copyright">
                    © 2016 — <?php echo date('Y'); ?> Duendes del Uruguay. Todos los derechos reservados.
                </p>
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
    // Ocultar footer duplicado si existe
    document.addEventListener('DOMContentLoaded', function() {
        var oldFooter = document.querySelector('.ddu-footer-section');
        if (oldFooter) {
            oldFooter.style.cssText = 'display:none!important;height:0!important;';
        }
    });
    </script>
    <?php
}, 999);
