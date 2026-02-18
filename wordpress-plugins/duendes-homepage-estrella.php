<?php
/**
 * Plugin Name: Duendes Homepage Estrella
 * Description: Homepage mágica - Sección de dos caminos después del hero
 * Version: 4.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

class Duendes_Homepage_Estrella {

    private $imgs;

    public function __construct() {
        $this->imgs = [
            'founders' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/IMG_2970-scaled.jpg',
            'gabriel_working' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/Firefly_Gemini-Flash_Same-artisan.-Holding-three-tiny-277534-IDX.png',
            'clienta_1' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/gemini-image-2_a_truly_real_medium_age_person_in_her_40_s_holding_this_exactly_duende_and_is_ha-0.jpg',
            'clienta_2' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/gemini-image-2_artistic_portrait_photography_of_a_truly_real_medium_age_person_black_hair_in_he-0-scaled.jpg',
            'clienta_3' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/gemini-image-2_make_more_raw_real_this_exactly_imagen_reference_not_ia_look.-2.jpg',
            'duende_1' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-9ddf1407294d9cd26ee215b57d94fc06-1-scaled.jpg',
            'duende_2' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-8832dc36c9ec5052f05b6ef1c7bf3488-1-scaled.jpg',
            'duende_3' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-c1fc0c65ae0e4748a297f34e9f2d0062-1-scaled.jpg',
            'duende_4' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-c3fc02fc25aeae8731538aa77743c9f8-1-scaled.jpg',
            'duende_zoom' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-9d9516913eaa3c53add3d72ac27534c8-1-scaled.jpg',
            'varita' => 'https://duendesdeluruguay.com/wp-content/uploads/2025/11/IMG_4891-scaled.jpeg',
        ];

        add_action('wp_footer', [$this, 'render_all'], 5);
    }

    public function render_all() {
        if (!is_front_page()) return;

        $this->render_styles();
        $this->render_sections();
        $this->render_scripts();
    }

    private function render_styles() {
        ?>
        <style id="dhe-styles">
        /* =============================================
           DUENDES HOMEPAGE ESTRELLA v4
           Todo oscuro, mágico, claro
           ============================================= */

        :root {
            --dhe-black: #0a0a0a;
            --dhe-black-soft: #0f0f0f;
            --dhe-black-card: #141414;
            --dhe-gold: #c9a227;
            --dhe-gold-glow: rgba(201, 162, 39, 0.15);
            --dhe-text: rgba(255,255,255,0.9);
            --dhe-text-muted: rgba(255,255,255,0.55);
        }

        /* ===== DOS CAMINOS - PRIMERA SECCIÓN ===== */
        .dhe-caminos {
            background: var(--dhe-black);
            padding: 0;
            position: relative;
        }

        .dhe-caminos::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100px;
            background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%);
            pointer-events: none;
            z-index: 2;
        }

        .dhe-caminos-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: 500px;
            max-height: 600px;
        }

        @media (max-width: 600px) {
            .dhe-caminos-grid {
                grid-template-columns: 1fr;
                min-height: auto;
                max-height: none;
            }
        }

        .dhe-camino {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 50px 30px;
            text-align: center;
            overflow: hidden;
            transition: all 0.5s ease;
        }

        .dhe-camino::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg,
                rgba(0,0,0,0.75) 0%,
                rgba(0,0,0,0.5) 30%,
                rgba(0,0,0,0.3) 70%,
                rgba(0,0,0,0.6) 100%);
            z-index: 1;
        }

        .dhe-camino:hover::before {
            background: linear-gradient(180deg,
                rgba(0,0,0,0.65) 0%,
                rgba(0,0,0,0.4) 30%,
                rgba(0,0,0,0.2) 70%,
                rgba(0,0,0,0.5) 100%);
        }

        .dhe-camino-bg {
            position: absolute;
            inset: 0;
            z-index: 0;
        }

        .dhe-camino-bg img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.7;
            transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .dhe-camino:hover .dhe-camino-bg img {
            opacity: 0.85;
            transform: scale(1.03);
        }

        /* Línea divisoria vertical */
        .dhe-camino-tienda {
            border-right: 1px solid rgba(201,162,39,0.2);
        }

        @media (max-width: 900px) {
            .dhe-camino-tienda {
                border-right: none;
                border-bottom: 1px solid rgba(201,162,39,0.2);
            }
        }

        .dhe-camino-content {
            position: relative;
            z-index: 3;
            max-width: 400px;
        }

        .dhe-camino-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            display: block;
            color: #fff;
            text-shadow: 0 0 20px rgba(255,255,255,0.5);
        }

        .dhe-camino h3 {
            font-family: 'Cinzel', serif;
            font-size: clamp(1.4rem, 2.5vw, 1.8rem);
            color: #fff;
            margin-bottom: 1.2rem;
            letter-spacing: 0.15em;
            font-weight: 500;
            text-transform: uppercase;
            text-shadow: 0 2px 15px rgba(0,0,0,0.9), 0 4px 25px rgba(0,0,0,0.6);
        }

        .dhe-camino p {
            font-family: 'Cinzel', serif;
            font-size: 0.75rem;
            color: #fff;
            line-height: 1.8;
            margin-bottom: 1.5rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            text-shadow: 0 2px 10px rgba(0,0,0,0.8);
        }

        .dhe-camino-fotos {
            display: none;
        }

        .dhe-camino-foto {
            display: none;
        }

        .dhe-camino:hover .dhe-camino-foto {
            transform: scale(1.1);
        }

        .dhe-btn {
            display: inline-block;
            font-family: 'Cinzel', serif !important;
            font-size: 0.85rem !important;
            letter-spacing: 0.12em !important;
            text-transform: uppercase !important;
            padding: 18px 45px !important;
            background: #000 !important;
            border: none !important;
            color: #fff !important;
            text-decoration: none !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        }

        .dhe-btn:hover {
            background: #1a1a1a !important;
            color: #fff !important;
        }

        .dhe-camino-hint {
            font-family: 'Cinzel', serif;
            font-size: 0.65rem;
            color: rgba(255,255,255,0.7);
            margin-top: 1.2rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-shadow: 0 1px 5px rgba(0,0,0,0.6);
        }

        /* ===== SECCIÓN BASE OSCURA ===== */
        .dhe-section {
            background: var(--dhe-black);
            padding: 100px 24px;
            position: relative;
        }

        .dhe-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 10%;
            right: 10%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(201,162,39,0.2), transparent);
        }

        .dhe-container {
            max-width: 1140px;
            margin: 0 auto;
        }

        .dhe-title {
            font-family: 'Cinzel', serif;
            font-size: clamp(1.6rem, 4vw, 2.2rem);
            font-weight: 400;
            color: #fff;
            text-align: center;
            margin-bottom: 0.5rem;
            letter-spacing: 0.08em;
        }

        .dhe-subtitle {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 1.1rem;
            color: var(--dhe-text-muted);
            text-align: center;
            margin-bottom: 4rem;
            max-width: 550px;
            margin-left: auto;
            margin-right: auto;
        }

        .dhe-gold { color: var(--dhe-gold); }

        /* ===== QUIÉNES SOMOS ===== */
        .dhe-about-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            align-items: center;
        }

        @media (max-width: 900px) {
            .dhe-about-grid {
                grid-template-columns: 1fr;
                gap: 40px;
            }
        }

        .dhe-about-img {
            position: relative;
        }

        .dhe-about-img img {
            width: 100%;
            border-radius: 2px;
        }

        .dhe-about-img::before {
            content: '';
            position: absolute;
            inset: -15px;
            border: 1px solid rgba(201,162,39,0.15);
            border-radius: 2px;
            z-index: -1;
        }

        .dhe-about-text h3 {
            font-family: 'Cinzel', serif;
            font-size: 1.5rem;
            color: #fff;
            margin-bottom: 1.5rem;
            letter-spacing: 0.05em;
        }

        .dhe-about-text p {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 1.1rem;
            color: var(--dhe-text);
            line-height: 1.8;
            margin-bottom: 1.2rem;
        }

        .dhe-location {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-family: 'Cinzel', serif;
            font-size: 0.75rem;
            color: var(--dhe-gold);
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(201,162,39,0.2);
        }

        /* ===== TESTIMONIOS ===== */
        .dhe-testimonios-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
        }

        @media (max-width: 900px) {
            .dhe-testimonios-grid {
                grid-template-columns: 1fr;
                max-width: 450px;
                margin: 0 auto;
            }
        }

        .dhe-testimonio {
            background: var(--dhe-black-card);
            border: 1px solid rgba(201,162,39,0.1);
            padding: 35px 30px;
            transition: border-color 0.4s ease, transform 0.4s ease;
        }

        .dhe-testimonio:hover {
            border-color: rgba(201,162,39,0.3);
            transform: translateY(-5px);
        }

        .dhe-testimonio-stars {
            color: var(--dhe-gold);
            font-size: 0.85rem;
            letter-spacing: 3px;
            margin-bottom: 1.2rem;
        }

        .dhe-testimonio-quote {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 1rem;
            font-style: italic;
            color: var(--dhe-text);
            line-height: 1.7;
            margin-bottom: 1.5rem;
        }

        .dhe-testimonio-author {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .dhe-testimonio-avatar {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            object-fit: cover;
            border: 1px solid rgba(201,162,39,0.3);
        }

        .dhe-testimonio-name {
            font-family: 'Cinzel', serif;
            font-size: 0.8rem;
            color: #fff;
            letter-spacing: 0.05em;
        }

        .dhe-testimonio-place {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 0.85rem;
            color: var(--dhe-gold);
        }

        /* ===== CTA FINAL ===== */
        .dhe-cta {
            text-align: center;
            padding: 120px 24px;
            background: linear-gradient(180deg, var(--dhe-black) 0%, var(--dhe-black-soft) 100%);
            position: relative;
        }

        .dhe-cta::before {
            content: '';
            position: absolute;
            top: 0;
            left: 20%;
            right: 20%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(201,162,39,0.3), transparent);
        }

        .dhe-cta h2 {
            font-family: 'Cinzel', serif;
            font-size: clamp(1.5rem, 4vw, 2rem);
            color: #fff;
            margin-bottom: 0.8rem;
            letter-spacing: 0.08em;
        }

        .dhe-cta > p {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 1.15rem;
            color: var(--dhe-text-muted);
            margin-bottom: 2.5rem;
        }

        .dhe-garantias {
            display: flex;
            justify-content: center;
            gap: 50px;
            margin-top: 4rem;
            flex-wrap: wrap;
        }

        .dhe-garantia {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 0.9rem;
            color: var(--dhe-text-muted);
        }

        .dhe-garantia strong {
            color: var(--dhe-gold);
        }

        /* ===== ANIMACIONES ===== */
        .dhe-fade {
            opacity: 0;
            transform: translateY(25px);
            transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .dhe-fade.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .dhe-delay-1 { transition-delay: 0.1s; }
        .dhe-delay-2 { transition-delay: 0.2s; }
        .dhe-delay-3 { transition-delay: 0.3s; }

        /* ===== OCULTAR WRAPPER ORIGINAL ===== */
        #dhe-wrapper { display: none; }

        /* ===== ARMONIZAR COLORES DEL CARRUSEL (solo clases dhc-) ===== */
        .dhc-subtitulo {
            color: var(--dhe-gold) !important;
        }

        .dhc-tags,
        .dhc-card .dhc-tags {
            color: rgba(255, 255, 255, 0.7) !important;
        }

        .dhc-header::before {
            background: var(--dhe-gold) !important;
        }

        .dhc-flecha {
            background: transparent !important;
            border: 1px solid var(--dhe-gold) !important;
            color: var(--dhe-gold) !important;
        }

        .dhc-flecha:hover {
            background: var(--dhe-gold) !important;
            color: #000 !important;
        }

        .dhc-ver-todos {
            background: transparent !important;
            border: 1px solid var(--dhe-gold) !important;
            color: var(--dhe-gold) !important;
        }

        .dhc-ver-todos:hover {
            background: var(--dhe-gold) !important;
            color: #000 !important;
        }

        .dhc-desliza {
            color: var(--dhe-gold) !important;
        }

        .dhc-precio {
            color: #fff !important;
        }

        .dhc-card span:not(.dhc-nombre):not(.dhc-precio) {
            color: rgba(255, 255, 255, 0.6) !important;
        }

        .dhc-nombre {
            color: #fff !important;
        }

        /* ===== TEST DEL GUARDIÁN - BORRARLO DESDE ELEMENTOR ===== */
        /* La sección con "Hay uno que ya te eligió" hay que borrarla manualmente */

        /* ===== ARREGLAR ESPACIADO DESLIZA ===== */
        .dhc-desliza {
            margin-top: 30px !important;
            padding-top: 15px !important;
        }

        /* ===== VER TODOS - NEGRO CON BORDE DORADO ===== */
        .dhc-ver-todos,
        a.dhc-ver-todos,
        .dhc-section .dhc-ver-todos {
            background: #000 !important;
            border: 1px solid var(--dhe-gold) !important;
            color: var(--dhe-gold) !important;
            padding: 12px 30px !important;
        }

        .dhc-ver-todos:hover {
            background: var(--dhe-gold) !important;
            color: #000 !important;
        }
        </style>
        <?php
    }

    private function render_sections() {
        $i = $this->imgs;
        ?>
        <div id="dhe-wrapper">

            <!-- DOS CAMINOS -->
            <section class="dhe-caminos" id="dhe-caminos">
                <div class="dhe-caminos-grid">

                    <!-- CAMINO 1: TIENDA -->
                    <div class="dhe-camino dhe-camino-tienda">
                        <div class="dhe-camino-bg">
                            <img src="<?php echo esc_url($i['duende_1']); ?>" alt="Guardianes">
                        </div>
                        <div class="dhe-camino-content">
                            <span class="dhe-camino-icon">&#10022;</span>
                            <h3>Ya sé lo que busco</h3>
                            <p>Explorá todos los guardianes disponibles. Cada uno es pieza única, hecho a mano. Cuando uno encuentra hogar, desaparece para siempre.</p>
                            <div class="dhe-camino-fotos">
                                <img src="<?php echo esc_url($i['duende_2']); ?>" alt="Guardián" class="dhe-camino-foto">
                                <img src="<?php echo esc_url($i['duende_zoom']); ?>" alt="Guardián" class="dhe-camino-foto">
                                <img src="<?php echo esc_url($i['duende_3']); ?>" alt="Guardián" class="dhe-camino-foto">
                                <img src="<?php echo esc_url($i['duende_4']); ?>" alt="Guardián" class="dhe-camino-foto">
                            </div>
                            <a href="/shop/" class="dhe-btn">Explorar Guardianes</a>
                            <p class="dhe-camino-hint">+200 guardianes esperando</p>
                        </div>
                    </div>

                    <!-- CAMINO 2: TEST -->
                    <div class="dhe-camino dhe-camino-test">
                        <div class="dhe-camino-bg">
                            <img src="<?php echo esc_url($i['varita']); ?>" alt="Test del Guardián">
                        </div>
                        <div class="dhe-camino-content">
                            <span class="dhe-camino-icon">&#10038;</span>
                            <h3>No sé cuál elegir</h3>
                            <p>Respondé unas preguntas y descubrí qué tipo de guardián resuena con tu energía. El test analiza lo que necesitás y te muestra los que te eligen a vos.</p>
                            <div class="dhe-camino-fotos">
                                <img src="<?php echo esc_url($i['clienta_1']); ?>" alt="Clienta" class="dhe-camino-foto">
                                <img src="<?php echo esc_url($i['clienta_2']); ?>" alt="Clienta" class="dhe-camino-foto">
                                <img src="<?php echo esc_url($i['clienta_3']); ?>" alt="Clienta" class="dhe-camino-foto">
                            </div>
                            <a href="/descubri-que-duende-te-elige/" class="dhe-btn">Hacer el Test</a>
                            <p class="dhe-camino-hint">2 minutos, sin compromiso</p>
                        </div>
                    </div>

                </div>
            </section>

            <!-- QUIÉNES SOMOS -->
            <section class="dhe-section" id="dhe-about">
                <div class="dhe-container">
                    <div class="dhe-about-grid">
                        <div class="dhe-about-img dhe-fade">
                            <img src="<?php echo esc_url($i['founders']); ?>" alt="Thibisay y Gabriel" loading="lazy">
                        </div>
                        <div class="dhe-about-text dhe-fade dhe-delay-1">
                            <h3>Desde Piriápolis, Uruguay</h3>
                            <p>Cada guardián es una pieza única, moldeada a mano. Cuando lo recibís, viene con una carta escrita especialmente para vos: palabras que solo vos necesitás leer.</p>
                            <p>No es un objeto decorativo. Es un compañero que llega con un mensaje personal basado en lo que compartís con nosotros después de tu compra.</p>
                            <div class="dhe-location">
                                Thibisay y Gabriel
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- TESTIMONIOS -->
            <section class="dhe-section" id="dhe-testimonios">
                <div class="dhe-container">
                    <h2 class="dhe-title dhe-fade">Historias <span class="dhe-gold">Reales</span></h2>
                    <p class="dhe-subtitle dhe-fade">Lo que pasa cuando un guardián encuentra su hogar</p>

                    <div class="dhe-testimonios-grid">
                        <div class="dhe-testimonio dhe-fade dhe-delay-1">
                                                        <p class="dhe-testimonio-quote">"Estaba pasando por un momento muy difícil. Mi guardián llegó con una canalización que me hizo llorar. Era como si supiera exactamente lo que necesitaba escuchar."</p>
                            <div class="dhe-testimonio-author">
                                <img src="<?php echo esc_url($i['clienta_1']); ?>" alt="María" class="dhe-testimonio-avatar" loading="lazy">
                                <div>
                                    <div class="dhe-testimonio-name">María L.</div>
                                    <div class="dhe-testimonio-place">Buenos Aires</div>
                                </div>
                            </div>
                        </div>

                        <div class="dhe-testimonio dhe-fade dhe-delay-2">
                                                        <p class="dhe-testimonio-quote">"No soy de creer en estas cosas, pero algo me atrajo. Cuando lo recibí y leí su carta, entendí que no era casualidad. Ahora duerme en mi mesa de luz."</p>
                            <div class="dhe-testimonio-author">
                                <img src="<?php echo esc_url($i['clienta_2']); ?>" alt="Carolina" class="dhe-testimonio-avatar" loading="lazy">
                                <div>
                                    <div class="dhe-testimonio-name">Carolina M.</div>
                                    <div class="dhe-testimonio-place">Ciudad de México</div>
                                </div>
                            </div>
                        </div>

                        <div class="dhe-testimonio dhe-fade dhe-delay-3">
                                                        <p class="dhe-testimonio-quote">"Lo compré como regalo para mi mamá que estaba pasando un duelo. Cuando leyó la canalización, me dijo que era exactamente lo que necesitaba."</p>
                            <div class="dhe-testimonio-author">
                                <img src="<?php echo esc_url($i['clienta_3']); ?>" alt="Luciana" class="dhe-testimonio-avatar" loading="lazy">
                                <div>
                                    <div class="dhe-testimonio-name">Luciana R.</div>
                                    <div class="dhe-testimonio-place">Montevideo</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- CTA FINAL -->
            <section class="dhe-cta" id="dhe-cta">
                <h2 class="dhe-fade">Tu guardián ya sabe que lo estás buscando</h2>
                <p class="dhe-fade dhe-delay-1">Es hora de encontrarse.</p>
                <a href="/shop/" class="dhe-btn dhe-fade dhe-delay-2">Explorar Guardianes</a>

                <div class="dhe-garantias dhe-fade dhe-delay-3">
                    <div class="dhe-garantia"><strong>Envío</strong> a todo el mundo</div>
                    <div class="dhe-garantia"><strong>Pieza única</strong> hecha a mano</div>
                    <div class="dhe-garantia"><strong>Canalización</strong> personal incluida</div>
                </div>
            </section>

        </div>
        <?php
    }

    private function render_scripts() {
        ?>
        <script id="dhe-scripts">
        (function() {
            'use strict';

            function init() {
                console.log('✨ Duendes Estrella v4 - Iniciando...');

                // Intentar inmediatamente y después de un delay
                insertarSecciones();
                setTimeout(insertarSecciones, 1000);
                setTimeout(insertarSecciones, 2500);
                setTimeout(insertarSecciones, 4000);
            }

            let yaInsertado = false;

            function insertarSecciones() {
                if (yaInsertado) return;

                const wrapper = document.getElementById('dhe-wrapper');
                if (!wrapper) {
                    console.log('⚠️ Wrapper no encontrado');
                    return;
                }

                // MÉTODO AGRESIVO: Buscar CUALQUIER sección de Elementor
                const todasSecciones = document.querySelectorAll('.elementor-section, .elementor-element, section');
                console.log('🔍 Secciones encontradas:', todasSecciones.length);

                // Buscar la primera sección que tenga video o sea el hero
                let hero = document.querySelector('.video-hero');

                if (!hero) {
                    // Buscar por clase que contenga "hero" o "video"
                    hero = document.querySelector('[class*="hero"], [class*="video"]');
                }

                if (!hero) {
                    // Tomar la primera sección de Elementor
                    hero = document.querySelector('.elementor-section');
                }

                if (!hero) {
                    // Último recurso: el primer elemento grande del body
                    const elementos = document.body.children;
                    for (let el of elementos) {
                        if (el.offsetHeight > 200 && !el.id.includes('dhe') && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
                            hero = el;
                            break;
                        }
                    }
                }

                console.log('🎯 Hero encontrado:', hero ? hero.className || hero.tagName : 'NO');

                // Clonar la sección DOS CAMINOS
                const caminos = document.getElementById('dhe-caminos');

                if (caminos && hero) {
                    const caminosClone = caminos.cloneNode(true);
                    caminosClone.id = 'dhe-caminos-live';
                    caminosClone.style.display = 'block';

                    // Insertar después del hero
                    if (hero.nextSibling) {
                        hero.parentNode.insertBefore(caminosClone, hero.nextSibling);
                    } else {
                        hero.parentNode.appendChild(caminosClone);
                    }

                    console.log('✅ DOS CAMINOS insertado después de:', hero.className || hero.tagName);
                    yaInsertado = true;
                } else if (caminos) {
                    // Si no hay hero, insertar al principio del body
                    const caminosClone = caminos.cloneNode(true);
                    caminosClone.id = 'dhe-caminos-live';
                    caminosClone.style.display = 'block';

                    const primerElemento = document.body.firstChild;
                    document.body.insertBefore(caminosClone, primerElemento);

                    console.log('✅ DOS CAMINOS insertado al principio del body (fallback)');
                    yaInsertado = true;
                }

                // Resto de secciones al final, antes del footer o al final del body
                const footer = document.querySelector('footer, [class*="footer"]');
                const seccionesIds = ['dhe-about', 'dhe-testimonios', 'dhe-cta'];

                seccionesIds.forEach(id => {
                    const sec = document.getElementById(id);
                    if (sec) {
                        const clone = sec.cloneNode(true);
                        clone.id = id + '-live';
                        clone.style.display = 'block';

                        if (footer && footer.parentNode) {
                            footer.parentNode.insertBefore(clone, footer);
                        } else {
                            document.body.appendChild(clone);
                        }
                    }
                });

                console.log('✅ Todas las secciones insertadas');

                // Animaciones
                initAnimations();
            }

            function initAnimations() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                }, { threshold: 0.1 });

                document.querySelectorAll('.dhe-fade').forEach(el => observer.observe(el));
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

new Duendes_Homepage_Estrella();
