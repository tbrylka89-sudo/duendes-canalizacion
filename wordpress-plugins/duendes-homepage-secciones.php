<?php
/**
 * Plugin Name: Duendes Homepage Secciones Adicionales
 * Description: Agrega secciones de conversión con fotos reales - NO reemplaza nada existente
 * Version: 2.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

class Duendes_Homepage_Secciones {

    // URLs de imágenes reales
    private $images = [
        // Thibisay y Gabriel juntos
        'founders_1' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/IMG_2970-scaled.jpg',
        'founders_2' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/IMG_0933-scaled.jpg',

        // Thibisay sola
        'thibisay' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/tranquil_forest_portrait_1f0cdfbd-310e-62f0-b735-9826e7022bb4_1_1.png',

        // Gabriel solo
        'gabriel' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/gemini-image-2_A_cinematic_portrait_photograph_of_make_this_photo_bigger_9_16_cinematic_photogr-0-scaled.jpg',

        // Gabriel trabajando
        'gabriel_working_1' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/Firefly_Gemini-Flash_Same-artisan.-Holding-three-tiny-277534-IDX.png',
        'gabriel_working_2' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/Firefly_Gemini-Flash_Same-artisan.-Checking-each-due-277534-o07.png',

        // Clientas
        'clienta_1' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/gemini-image-2_a_truly_real_medium_age_person_in_her_40_s_holding_this_exactly_duende_and_is_ha-0.jpg',
        'clienta_2' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/gemini-image-2_artistic_portrait_photography_of_a_truly_real_medium_age_person_black_hair_in_he-0-scaled.jpg',
        'clienta_3' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/gemini-image-2_make_more_raw_real_this_exactly_imagen_reference_not_ia_look.-2.jpg',

        // Duendes hermosos
        'duende_1' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-9ddf1407294d9cd26ee215b57d94fc06-1-scaled.jpg',
        'duende_2' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-8832dc36c9ec5052f05b6ef1c7bf3488-1-scaled.jpg',
        'duende_3' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-c1fc0c65ae0e4748a297f34e9f2d0062-1-scaled.jpg',
        'duende_4' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-c3fc02fc25aeae8731538aa77743c9f8-1-scaled.jpg',
        'duende_zoom' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-9d9516913eaa3c53add3d72ac27534c8-1-scaled.jpg',

        // Mano con varita
        'varita' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/IMG_4891-scaled.jpeg',

        // Taller
        'taller' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/gemini-image-2_A_cinematic_portrait_photograph_of_A_top-down_photograph_looking_inside_an_open_-1_920b6796-3401-4447-bd4d-9ab7fd1416f4-scaled.jpg',
    ];

    public function __construct() {
        add_action('wp_head', [$this, 'add_styles'], 5);
        add_action('wp_footer', [$this, 'add_sections_html'], 10);
        add_action('wp_footer', [$this, 'add_scripts'], 99);
    }

    public function add_styles() {
        if (!is_front_page()) return;
        ?>
        <style id="duendes-secciones-styles">
        /* =============================================
           SECCIONES ADICIONALES - CONVERSIÓN
           ============================================= */

        :root {
            --dhs-black: #0a0a0a;
            --dhs-black-light: #1a1a1a;
            --dhs-gold: #d4af37;
            --dhs-gold-light: #e8d48b;
            --dhs-gold-dark: #8b6914;
            --dhs-text: rgba(255, 255, 255, 0.85);
            --dhs-text-muted: rgba(255, 255, 255, 0.6);
        }

        /* ----- BASE SECTIONS ----- */
        .dhs-section {
            background: var(--dhs-black);
            padding: 80px 20px;
            position: relative;
            overflow: hidden;
        }

        .dhs-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
        }

        .dhs-container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .dhs-title {
            font-family: 'Cinzel', serif;
            font-size: clamp(1.8rem, 4vw, 2.5rem);
            font-weight: 400;
            color: #fff;
            text-align: center;
            margin-bottom: 1rem;
            letter-spacing: 0.1em;
        }

        .dhs-subtitle {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: clamp(1rem, 2vw, 1.2rem);
            color: var(--dhs-text-muted);
            text-align: center;
            margin-bottom: 3rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
        }

        .dhs-gold {
            color: var(--dhs-gold);
        }

        /* ----- SECTION: QUIENES SOMOS ----- */
        .dhs-founders {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
        }

        @media (max-width: 768px) {
            .dhs-founders {
                grid-template-columns: 1fr;
                gap: 40px;
            }
        }

        .dhs-founders-image {
            position: relative;
        }

        .dhs-founders-image img {
            width: 100%;
            height: auto;
            border-radius: 4px;
            filter: grayscale(20%);
            transition: filter 0.5s ease;
        }

        .dhs-founders-image:hover img {
            filter: grayscale(0%);
        }

        .dhs-founders-image::after {
            content: '';
            position: absolute;
            inset: 0;
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 4px;
            pointer-events: none;
        }

        .dhs-founders-text h3 {
            font-family: 'Cinzel', serif;
            font-size: clamp(1.5rem, 3vw, 2rem);
            font-weight: 400;
            color: #fff;
            margin-bottom: 1.5rem;
            letter-spacing: 0.05em;
        }

        .dhs-founders-text p {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 1.1rem;
            color: var(--dhs-text);
            line-height: 1.8;
            margin-bottom: 1.5rem;
        }

        .dhs-location {
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Cinzel', serif;
            font-size: 0.85rem;
            color: var(--dhs-gold);
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-top: 2rem;
        }

        .dhs-location svg {
            width: 18px;
            height: 18px;
            fill: var(--dhs-gold);
        }

        /* ----- SECTION: TESTIMONIOS ----- */
        .dhs-testimonios-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
        }

        @media (max-width: 900px) {
            .dhs-testimonios-grid {
                grid-template-columns: 1fr;
                max-width: 500px;
                margin: 0 auto;
            }
        }

        .dhs-testimonio {
            background: var(--dhs-black-light);
            border: 1px solid rgba(212, 175, 55, 0.15);
            padding: 30px;
            position: relative;
            transition: transform 0.4s ease, border-color 0.4s ease;
        }

        .dhs-testimonio:hover {
            transform: translateY(-5px);
            border-color: rgba(212, 175, 55, 0.4);
        }

        .dhs-testimonio-quote {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 1.05rem;
            font-style: italic;
            color: var(--dhs-text);
            line-height: 1.7;
            margin-bottom: 1.5rem;
        }

        .dhs-testimonio-quote::before {
            content: '"';
            font-size: 3rem;
            color: var(--dhs-gold);
            opacity: 0.3;
            position: absolute;
            top: 15px;
            left: 20px;
            font-family: Georgia, serif;
            line-height: 1;
        }

        .dhs-testimonio-author {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .dhs-testimonio-avatar {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(212, 175, 55, 0.3);
        }

        .dhs-testimonio-info {
            font-family: 'Cormorant Garamond', Georgia, serif;
        }

        .dhs-testimonio-name {
            font-size: 1rem;
            color: #fff;
            font-weight: 600;
            margin-bottom: 2px;
        }

        .dhs-testimonio-place {
            font-size: 0.85rem;
            color: var(--dhs-gold);
        }

        /* ----- SECTION: PROCESO ----- */
        .dhs-proceso-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
        }

        @media (max-width: 768px) {
            .dhs-proceso-grid {
                grid-template-columns: 1fr;
                gap: 30px;
            }
        }

        .dhs-paso {
            text-align: center;
            padding: 30px;
            position: relative;
        }

        .dhs-paso-num {
            font-family: 'Cinzel', serif;
            font-size: 3rem;
            color: var(--dhs-gold);
            opacity: 0.3;
            margin-bottom: 1rem;
            line-height: 1;
        }

        .dhs-paso-title {
            font-family: 'Cinzel', serif;
            font-size: 1.1rem;
            color: #fff;
            letter-spacing: 0.1em;
            margin-bottom: 1rem;
        }

        .dhs-paso-text {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 1rem;
            color: var(--dhs-text-muted);
            line-height: 1.6;
        }

        /* ----- SECTION: CTA FINAL ----- */
        .dhs-cta-section {
            text-align: center;
            padding: 100px 20px;
            background: linear-gradient(180deg, var(--dhs-black) 0%, var(--dhs-black-light) 100%);
        }

        .dhs-cta-title {
            font-family: 'Cinzel', serif;
            font-size: clamp(1.6rem, 4vw, 2.2rem);
            color: #fff;
            margin-bottom: 1rem;
            letter-spacing: 0.08em;
        }

        .dhs-cta-subtitle {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 1.15rem;
            color: var(--dhs-text-muted);
            margin-bottom: 2.5rem;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }

        .dhs-btn {
            display: inline-block;
            font-family: 'Cinzel', serif;
            font-size: 0.85rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            padding: 18px 45px;
            background: transparent;
            border: 2px solid var(--dhs-gold);
            color: var(--dhs-gold);
            text-decoration: none;
            cursor: pointer;
            transition: all 0.4s ease;
        }

        .dhs-btn:hover {
            background: var(--dhs-gold);
            color: var(--dhs-black);
        }

        .dhs-garantias {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 3rem;
            flex-wrap: wrap;
        }

        .dhs-garantia {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 0.9rem;
            color: var(--dhs-text-muted);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .dhs-garantia svg {
            width: 16px;
            height: 16px;
            fill: var(--dhs-gold);
        }

        /* ----- SOCIAL PROOF BADGE ----- */
        .dhs-social-badge {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(10, 10, 10, 0.95);
            border: 1px solid rgba(212, 175, 55, 0.3);
            padding: 15px 20px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9998;
            backdrop-filter: blur(10px);
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
            max-width: 300px;
        }

        .dhs-social-badge.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .dhs-social-badge-icon {
            font-size: 1.5rem;
        }

        .dhs-social-badge-text {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 0.95rem;
            color: var(--dhs-text);
            line-height: 1.4;
        }

        .dhs-social-badge-text strong {
            color: var(--dhs-gold);
            font-weight: 600;
        }

        @media (max-width: 768px) {
            .dhs-social-badge {
                left: 10px;
                right: 10px;
                max-width: none;
            }
        }

        /* ----- ANIMACIONES ----- */
        .dhs-animate {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .dhs-animate.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .dhs-delay-1 { transition-delay: 0.1s; }
        .dhs-delay-2 { transition-delay: 0.2s; }
        .dhs-delay-3 { transition-delay: 0.3s; }

        /* ----- GALERÍA MINI ----- */
        .dhs-mini-gallery {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 2rem;
            flex-wrap: wrap;
        }

        .dhs-mini-img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(212, 175, 55, 0.3);
            transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .dhs-mini-img:hover {
            transform: scale(1.1);
            border-color: var(--dhs-gold);
        }
        </style>
        <?php
    }

    public function add_sections_html() {
        if (!is_front_page()) return;
        $imgs = $this->images;
        ?>
        <!-- SECCIÓN: QUIÉNES SOMOS -->
        <div class="dhs-section dhs-quienes" id="dhs-quienes" style="display:none;">
            <div class="dhs-container">
                <div class="dhs-founders">
                    <div class="dhs-founders-image dhs-animate">
                        <img src="<?php echo esc_url($imgs['founders_1']); ?>" alt="Thibisay y Gabriel - Duendes del Uruguay" loading="lazy">
                    </div>
                    <div class="dhs-founders-text dhs-animate dhs-delay-1">
                        <h3>Desde Piriápolis, con intención</h3>
                        <p>Somos Thibisay y Gabriel. Hace años descubrimos que la magia no es fantasía, es energía que se puede tocar, moldear, compartir.</p>
                        <p>Cada guardián que creamos nace de nuestras manos, con horas de trabajo artesanal y una intención específica. No hay dos iguales porque cada uno viene a encontrar a su persona.</p>
                        <p>Creemos en los seres que nos eligen, en las sincronías que no son casualidad, y en el poder de sentirse acompañado por algo que trasciende lo visible.</p>
                        <div class="dhs-location">
                            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                            Piriápolis, Uruguay
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECCIÓN: TESTIMONIOS -->
        <div class="dhs-section dhs-testimonios-section" id="dhs-testimonios" style="display:none;">
            <div class="dhs-container">
                <h2 class="dhs-title dhs-animate">Historias <span class="dhs-gold">Reales</span></h2>
                <p class="dhs-subtitle dhs-animate dhs-delay-1">Lo que pasa cuando un guardián encuentra su hogar</p>

                <div class="dhs-testimonios-grid">
                    <div class="dhs-testimonio dhs-animate dhs-delay-1">
                        <p class="dhs-testimonio-quote">Estaba pasando por un momento muy difícil. Mi guardián llegó con una canalización que me hizo llorar. Era como si supiera exactamente lo que necesitaba escuchar.</p>
                        <div class="dhs-testimonio-author">
                            <img src="<?php echo esc_url($imgs['clienta_1']); ?>" alt="María" class="dhs-testimonio-avatar" loading="lazy">
                            <div class="dhs-testimonio-info">
                                <div class="dhs-testimonio-name">María L.</div>
                                <div class="dhs-testimonio-place">Buenos Aires</div>
                            </div>
                        </div>
                    </div>

                    <div class="dhs-testimonio dhs-animate dhs-delay-2">
                        <p class="dhs-testimonio-quote">No soy de creer en estas cosas, pero algo me atrajo. Cuando lo recibí y leí su carta, entendí que no era casualidad. Ahora duerme en mi mesa de luz.</p>
                        <div class="dhs-testimonio-author">
                            <img src="<?php echo esc_url($imgs['clienta_2']); ?>" alt="Carolina" class="dhs-testimonio-avatar" loading="lazy">
                            <div class="dhs-testimonio-info">
                                <div class="dhs-testimonio-name">Carolina M.</div>
                                <div class="dhs-testimonio-place">Ciudad de México</div>
                            </div>
                        </div>
                    </div>

                    <div class="dhs-testimonio dhs-animate dhs-delay-3">
                        <p class="dhs-testimonio-quote">Lo compré como regalo para mi mamá que estaba pasando un duelo. Cuando leyó la canalización, me dijo que era exactamente lo que necesitaba. Gracias por tanto.</p>
                        <div class="dhs-testimonio-author">
                            <img src="<?php echo esc_url($imgs['clienta_3']); ?>" alt="Luciana" class="dhs-testimonio-avatar" loading="lazy">
                            <div class="dhs-testimonio-info">
                                <div class="dhs-testimonio-name">Luciana R.</div>
                                <div class="dhs-testimonio-place">Montevideo</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dhs-mini-gallery dhs-animate">
                    <img src="<?php echo esc_url($imgs['duende_1']); ?>" alt="Guardián" class="dhs-mini-img" loading="lazy">
                    <img src="<?php echo esc_url($imgs['duende_2']); ?>" alt="Guardián" class="dhs-mini-img" loading="lazy">
                    <img src="<?php echo esc_url($imgs['duende_zoom']); ?>" alt="Guardián" class="dhs-mini-img" loading="lazy">
                    <img src="<?php echo esc_url($imgs['duende_3']); ?>" alt="Guardián" class="dhs-mini-img" loading="lazy">
                    <img src="<?php echo esc_url($imgs['duende_4']); ?>" alt="Guardián" class="dhs-mini-img" loading="lazy">
                </div>
            </div>
        </div>

        <!-- SECCIÓN: CÓMO FUNCIONA -->
        <div class="dhs-section dhs-proceso-section" id="dhs-proceso" style="display:none;">
            <div class="dhs-container">
                <h2 class="dhs-title dhs-animate">Cómo <span class="dhs-gold">Funciona</span></h2>
                <p class="dhs-subtitle dhs-animate dhs-delay-1">Tres pasos para encontrar tu guardián</p>

                <div class="dhs-proceso-grid">
                    <div class="dhs-paso dhs-animate dhs-delay-1">
                        <div class="dhs-paso-num">01</div>
                        <h4 class="dhs-paso-title">Elegí tu guardián</h4>
                        <p class="dhs-paso-text">Explorá la tienda o hacé el test para descubrir cuál resuena con vos. Cada uno es único, pieza irrepetible.</p>
                    </div>
                    <div class="dhs-paso dhs-animate dhs-delay-2">
                        <div class="dhs-paso-num">02</div>
                        <h4 class="dhs-paso-title">Contanos de vos</h4>
                        <p class="dhs-paso-text">Después de tu compra, completás un breve formulario. Con eso, tu guardián prepara un mensaje personal para vos.</p>
                    </div>
                    <div class="dhs-paso dhs-animate dhs-delay-3">
                        <div class="dhs-paso-num">03</div>
                        <h4 class="dhs-paso-title">Recibilo con su carta</h4>
                        <p class="dhs-paso-text">Tu guardián llega a tu hogar con una canalización escrita especialmente para vos. Palabras que solo vos necesitás leer.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECCIÓN: CTA FINAL -->
        <div class="dhs-section dhs-cta-section" id="dhs-cta" style="display:none;">
            <div class="dhs-container">
                <h2 class="dhs-cta-title dhs-animate">Tu guardián ya sabe que lo estás buscando</h2>
                <p class="dhs-cta-subtitle dhs-animate dhs-delay-1">Es hora de encontrarse.</p>
                <a href="/shop/" class="dhs-btn dhs-animate dhs-delay-2">Explorar Guardianes</a>

                <div class="dhs-garantias dhs-animate dhs-delay-3">
                    <div class="dhs-garantia">
                        <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                        Envío cuidado a todo el mundo
                    </div>
                    <div class="dhs-garantia">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        Pieza única, hecha a mano
                    </div>
                    <div class="dhs-garantia">
                        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        Canalización personal incluida
                    </div>
                </div>
            </div>
        </div>

        <!-- SOCIAL PROOF BADGE -->
        <div class="dhs-social-badge" id="dhs-social-badge">
            <div class="dhs-social-badge-icon">&#10024;</div>
            <div class="dhs-social-badge-text">
                <strong>+3,500</strong> guardianes ya encontraron hogar en todo el mundo
            </div>
        </div>
        <?php
    }

    public function add_scripts() {
        if (!is_front_page()) return;
        ?>
        <script id="duendes-secciones-scripts">
        (function() {
            'use strict';

            function init() {
                console.log('✨ Duendes Secciones Adicionales - Iniciando...');

                // Esperar a que Elementor cargue completamente
                setTimeout(function() {
                    injectSections();
                    initAnimations();
                    initSocialBadge();
                }, 1500);
            }

            function injectSections() {
                // Buscar puntos de inserción en la página existente
                const footer = document.querySelector('footer, .elementor-location-footer, #footer');
                const mainContent = document.querySelector('.elementor-section-wrap, #content, main, .site-main');

                // Secciones a insertar
                const quienes = document.getElementById('dhs-quienes');
                const testimonios = document.getElementById('dhs-testimonios');
                const proceso = document.getElementById('dhs-proceso');
                const cta = document.getElementById('dhs-cta');

                if (footer && quienes && testimonios && proceso && cta) {
                    // Insertar antes del footer
                    footer.parentNode.insertBefore(cta, footer);
                    footer.parentNode.insertBefore(proceso, cta);
                    footer.parentNode.insertBefore(testimonios, proceso);
                    footer.parentNode.insertBefore(quienes, testimonios);

                    // Mostrar secciones
                    quienes.style.display = 'block';
                    testimonios.style.display = 'block';
                    proceso.style.display = 'block';
                    cta.style.display = 'block';

                    console.log('✨ Secciones insertadas correctamente');
                } else if (mainContent) {
                    // Alternativa: insertar al final del contenido principal
                    mainContent.appendChild(quienes);
                    mainContent.appendChild(testimonios);
                    mainContent.appendChild(proceso);
                    mainContent.appendChild(cta);

                    quienes.style.display = 'block';
                    testimonios.style.display = 'block';
                    proceso.style.display = 'block';
                    cta.style.display = 'block';

                    console.log('✨ Secciones insertadas en contenido principal');
                } else {
                    console.log('⚠️ No se encontró punto de inserción');
                }
            }

            function initAnimations() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

                document.querySelectorAll('.dhs-animate').forEach(el => {
                    observer.observe(el);
                });
            }

            function initSocialBadge() {
                const badge = document.getElementById('dhs-social-badge');
                if (!badge) return;

                let shown = false;

                window.addEventListener('scroll', function() {
                    if (!shown && window.scrollY > 500) {
                        shown = true;
                        setTimeout(() => {
                            badge.classList.add('visible');

                            // Ocultar después de 10 segundos
                            setTimeout(() => {
                                badge.classList.remove('visible');
                            }, 10000);
                        }, 2000);
                    }
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        })();
        </script>
        <?php
    }
}

new Duendes_Homepage_Secciones();
