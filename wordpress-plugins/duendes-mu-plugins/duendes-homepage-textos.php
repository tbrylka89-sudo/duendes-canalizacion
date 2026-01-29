<?php
/**
 * Plugin Name: Duendes Homepage - Mi Magia Section
 * Description: Solo inyecta la sección Mi Magia en la homepage (sin modificar nada más)
 * Version: 2.0
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// MI MAGIA - SECCIÓN QUE SE AGREGA AL FINAL DEL CONTENIDO
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_footer', function() {
    // Solo en homepage
    if (!is_front_page() && !is_home()) return;

    // Verificar que no se duplique
    static $ya_agregado = false;
    if ($ya_agregado) return;
    $ya_agregado = true;
    ?>

    <style id="mi-magia-styles">
        .duendes-mi-magia {
            position: relative;
            padding: 100px 20px;
            background: linear-gradient(180deg, #0a0a0a 0%, #0f0a18 50%, #0a0a0a 100%);
            overflow: hidden;
            text-align: center;
            margin-top: 0;
        }
        .duendes-mi-magia::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse 600px 500px at 50% 50%, rgba(147, 112, 219, 0.12) 0%, transparent 70%);
            pointer-events: none;
        }
        .duendes-mi-magia-inner {
            position: relative;
            z-index: 2;
            max-width: 700px;
            margin: 0 auto;
        }
        .duendes-mi-magia-icon {
            font-size: 60px;
            margin-bottom: 20px;
            animation: duendeFlotar 3s ease-in-out infinite;
        }
        @keyframes duendeFlotar {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
        }
        .duendes-mi-magia-badge {
            display: inline-block;
            padding: 10px 25px;
            background: rgba(147, 112, 219, 0.15);
            border: 1px solid rgba(147, 112, 219, 0.35);
            border-radius: 50px;
            font-family: 'Cinzel', serif;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: #9370db;
            margin-bottom: 25px;
        }
        .duendes-mi-magia h2 {
            font-family: 'Cinzel', serif;
            font-size: clamp(32px, 6vw, 48px);
            color: #fff;
            margin: 0 0 20px;
            font-weight: 400;
            line-height: 1.2;
        }
        .duendes-mi-magia-desc {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 1.3rem;
            color: rgba(255,255,255,0.7);
            line-height: 1.8;
            margin: 0 0 35px;
            font-style: italic;
        }
        .duendes-mi-magia-btn {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 18px 45px;
            background: linear-gradient(135deg, #9370db 0%, #7b5dbd 100%);
            border-radius: 50px;
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #fff !important;
            text-decoration: none !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 40px rgba(147, 112, 219, 0.4);
        }
        .duendes-mi-magia-btn:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 50px rgba(147, 112, 219, 0.55);
            color: #fff !important;
        }
        .duendes-mi-magia-note {
            margin-top: 25px;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 1rem;
            color: rgba(255,255,255,0.45);
        }
        @media (max-width: 768px) {
            .duendes-mi-magia { padding: 70px 15px; }
            .duendes-mi-magia-icon { font-size: 45px; }
            .duendes-mi-magia-btn { padding: 15px 35px; font-size: 0.9rem; }
        }
    </style>

    <section class="duendes-mi-magia" id="mi-magia-section">
        <div class="duendes-mi-magia-inner">
            <div class="duendes-mi-magia-icon">&#128302;</div>
            <span class="duendes-mi-magia-badge">Portal Exclusivo</span>
            <h2>¿Ya tenés tu guardián?</h2>
            <p class="duendes-mi-magia-desc">
                Tu canalización personal te espera.<br>
                Mensajes que solo vos podés leer. Rituales diseñados para tu energía.
            </p>
            <a href="/mi-magia/" class="duendes-mi-magia-btn">
                <span>&#10024;</span> Entrar a Mi Magia
            </a>
            <p class="duendes-mi-magia-note">
                Usá el código de tu tarjeta o escaneá el QR
            </p>
        </div>
    </section>

    <script>
    (function() {
        // Mover Mi Magia antes del footer
        var miMagia = document.getElementById('mi-magia-section');
        if (!miMagia) return;

        // Buscar el footer de Elementor
        var footer = document.querySelector('.elementor-location-footer') ||
                     document.querySelector('footer.site-footer') ||
                     document.querySelector('footer') ||
                     document.querySelector('#colophon');

        if (footer && footer.parentNode) {
            footer.parentNode.insertBefore(miMagia, footer);
        }
    })();
    </script>

    <?php
}, 50);
