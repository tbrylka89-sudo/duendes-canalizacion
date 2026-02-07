<?php
/**
 * Plugin Name: Producto Styles v2
 * Description: Rediseno completo paginas de producto
 */

// CSS para todas las paginas de producto
add_action('wp_head', function() {
    if (!function_exists('is_product') || !is_product()) return;
    ?>
    <style>
    /* ═══════════════════════════════════════════════════════════════
       1. OCULTAR SVGs FEOS (hongos) EN EL HERO
       ═══════════════════════════════════════════════════════════════ */
    .prod-hero svg,
    .prod-hero img[src*="hongo"],
    .prod-hero .prod-decorative-icons,
    .prod-hero [class*="mushroom"],
    .prod-hero .elementor-widget-image:has(svg) {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
    }

    /* ═══════════════════════════════════════════════════════════════
       2. OCULTAR SECCION CARACTERISTICAS GIGANTE
       ═══════════════════════════════════════════════════════════════ */
    .prod-white,
    section.prod-caracteristicas,
    section[class*="caracteristicas"] {
        display: none !important;
    }

    /* ═══════════════════════════════════════════════════════════════
       3. HERO MAS COMPACTO
       ═══════════════════════════════════════════════════════════════ */
    .prod-hero {
        min-height: 50vh !important;
        max-height: 60vh !important;
        padding: 60px 20px 30px !important;
    }

    /* ═══════════════════════════════════════════════════════════════
       4. FICHA CON TAMANO INTEGRADO
       ═══════════════════════════════════════════════════════════════ */
    .prod-ficha {
        position: relative;
        padding: 2.5rem 2rem !important;
    }

    /* Badge de tamano junto al subtitulo */
    .prod-ficha .prod-size-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(212,175,55,0.15);
        border: 1px solid rgba(212,175,55,0.3);
        border-radius: 20px;
        padding: 0.4rem 1rem;
        font-size: 0.85rem;
        color: #D4AF37;
        margin-left: 1rem;
        vertical-align: middle;
    }

    /* ═══════════════════════════════════════════════════════════════
       5. CIERRE DINAMICO COMO BURBUJA DE CHAT
       ═══════════════════════════════════════════════════════════════ */
    #cierre-dinamico,
    .cierre-dinamico-container {
        position: fixed !important;
        bottom: 100px !important;
        right: 20px !important;
        left: auto !important;
        max-width: 350px !important;
        background: linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%) !important;
        border: 1px solid rgba(212,175,55,0.4) !important;
        border-radius: 20px 20px 4px 20px !important;
        padding: 1.5rem !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.1) !important;
        z-index: 9999 !important;
        animation: bubbleIn 0.5s ease-out !important;
        margin: 0 !important;
    }

    #cierre-dinamico::before {
        content: '💬';
        position: absolute;
        top: -15px;
        left: 20px;
        font-size: 1.5rem;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }

    #cierre-dinamico::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: -10px;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-left-color: #0f0f23;
        border-bottom-color: #0f0f23;
    }

    #cierre-dinamico p,
    .cierre-dinamico-container p {
        color: rgba(255,255,255,0.9) !important;
        font-size: 0.95rem !important;
        line-height: 1.6 !important;
        margin: 0 !important;
        font-style: italic;
    }

    /* Boton para cerrar la burbuja */
    #cierre-dinamico .cierre-close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: rgba(255,255,255,0.5);
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        line-height: 1;
    }
    #cierre-dinamico .cierre-close:hover {
        color: #D4AF37;
    }

    @keyframes bubbleIn {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    /* ═══════════════════════════════════════════════════════════════
       6. MENSAJE DEL GUARDIAN MAS DESTACADO
       ═══════════════════════════════════════════════════════════════ */
    .prod-mensaje {
        padding: 3rem 2rem !important;
    }
    .prod-mensaje-texto {
        font-size: 1.4rem !important;
        line-height: 1.8 !important;
    }

    /* ═══════════════════════════════════════════════════════════════
       7. RESPONSIVE
       ═══════════════════════════════════════════════════════════════ */
    @media (max-width: 768px) {
        #cierre-dinamico,
        .cierre-dinamico-container {
            bottom: 80px !important;
            right: 10px !important;
            left: 10px !important;
            max-width: calc(100% - 20px) !important;
        }
    }
    </style>
    <?php
}, 999);

// JavaScript para agregar el badge de tamano y mejorar el cierre
add_action('wp_footer', function() {
    if (!function_exists('is_product') || !is_product()) return;
    ?>
    <script>
    (function() {
        // Extraer tamano de la seccion oculta y agregarlo a la ficha
        const sizeSection = document.querySelector('.prod-white .prod-stat, [class*="caracteristicas"] .prod-stat');
        const fichaSubtitulo = document.querySelector('.prod-ficha .prod-subtitulo, .prod-ficha h2, .prod-ficha [class*="subtitulo"]');

        if (fichaSubtitulo) {
            // Buscar el tamano en el HTML
            const sizeText = document.body.innerHTML.match(/(\d+)\s*(?:cm|centimetros|CENTÍMETROS)/i);
            if (sizeText) {
                const badge = document.createElement('span');
                badge.className = 'prod-size-badge';
                badge.innerHTML = '📏 ' + sizeText[1] + ' cm';
                fichaSubtitulo.appendChild(badge);
            }
        }

        // Mejorar el cierre dinamico con boton de cerrar
        setTimeout(function() {
            const cierre = document.getElementById('cierre-dinamico');
            if (cierre && !cierre.querySelector('.cierre-close')) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'cierre-close';
                closeBtn.innerHTML = '×';
                closeBtn.onclick = function() {
                    cierre.style.display = 'none';
                };
                cierre.insertBefore(closeBtn, cierre.firstChild);
            }
        }, 3000);
    })();
    </script>
    <?php
}, 999);

// Footer styles en todas las paginas
add_action('wp_head', function() {
    ?>
    <style>
    footer,
    #footer,
    .elementor-location-footer {
        background: linear-gradient(180deg, #0a0a14 0%, #050508 100%) !important;
        border-top: 1px solid rgba(212,175,55,0.2) !important;
        padding: 3rem 2rem 2rem !important;
    }
    footer h3,
    footer h4,
    footer .elementor-heading-title {
        color: #D4AF37 !important;
        letter-spacing: 0.1em !important;
        font-size: 0.9rem !important;
    }
    footer a {
        color: rgba(255,255,255,0.6) !important;
        transition: color 0.3s ease !important;
    }
    footer a:hover {
        color: #D4AF37 !important;
    }
    footer input[type="email"] {
        background: rgba(255,255,255,0.05) !important;
        border: 1px solid rgba(212,175,55,0.3) !important;
        color: #fff !important;
    }
    footer .elementor-button {
        background: #D4AF37 !important;
        color: #0a0a14 !important;
    }
    </style>
    <?php
}, 999);
