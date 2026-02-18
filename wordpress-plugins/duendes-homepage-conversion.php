<?php
/**
 * Plugin Name: Duendes Homepage Conversion
 * Description: Homepage optimizada para conversión basada en StoryBrand y neuromarketing
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

class Duendes_Homepage_Conversion {

    public function __construct() {
        add_action('wp_head', [$this, 'add_styles'], 999);
        add_action('wp_footer', [$this, 'add_content_and_scripts'], 5);
    }

    public function add_styles() {
        if (!is_front_page()) return;
        ?>
        <style id="dhc-conversion-styles">
        /* Ocultar contenido original de Elementor en homepage */
        body.home .elementor,
        body.home [data-elementor-type="wp-page"],
        body.home .elementor-location-single,
        body.home main > *:not(#dhc-homepage-wrapper) {
            display: none !important;
        }

        /* Variables */
        :root {
            --dhc-black: #0a0a0a;
            --dhc-black-soft: #111;
            --dhc-black-card: #1a1a1a;
            --dhc-gold: #d4af37;
            --dhc-gold-light: #e8c34a;
            --dhc-white: #fff;
            --dhc-white-soft: rgba(255,255,255,0.85);
            --dhc-white-muted: rgba(255,255,255,0.6);
            --dhc-font-title: 'Cinzel', serif;
            --dhc-font-body: 'Cormorant Garamond', Georgia, serif;
        }

        #dhc-homepage-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 100;
            overflow-y: auto;
            background: var(--dhc-black);
        }

        .dhc-homepage {
            background: var(--dhc-black);
            color: var(--dhc-white-soft);
            font-family: var(--dhc-font-body);
            font-size: 1.1rem;
            line-height: 1.7;
            padding-top: 80px; /* Espacio para el header */
        }

        .dhc-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        /* ----- HERO ----- */
        .dhc-hero {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            margin-top: -80px;
            padding-top: 80px;
        }

        .dhc-hero-bg {
            position: absolute;
            inset: 0;
            z-index: 1;
        }

        .dhc-hero-video {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 2;
        }

        .dhc-hero-fallback {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            z-index: 1;
        }

        .dhc-hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%);
            z-index: 3;
        }

        .dhc-hero-content {
            position: relative;
            z-index: 4;
            text-align: center;
            padding: 2rem;
            max-width: 800px;
        }

        .dhc-hero-pre {
            font-size: 0.9rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: var(--dhc-gold);
            margin-bottom: 1.5rem;
        }

        .dhc-hero-title {
            font-family: var(--dhc-font-title);
            font-size: clamp(2.5rem, 7vw, 4.5rem);
            font-weight: 400;
            color: var(--dhc-white);
            line-height: 1.2;
            margin-bottom: 1.5rem;
        }

        .dhc-hero-sub {
            font-size: 1.2rem;
            color: var(--dhc-white-soft);
            margin-bottom: 2.5rem;
        }

        .dhc-hero-ctas {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 3rem;
        }

        .dhc-btn-primary {
            display: inline-block;
            background: var(--dhc-gold);
            color: var(--dhc-black);
            font-family: var(--dhc-font-title);
            font-size: 0.85rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            padding: 1.1rem 2.5rem;
            text-decoration: none;
            transition: all 0.4s ease;
        }

        .dhc-btn-primary:hover {
            background: var(--dhc-gold-light);
            transform: translateY(-2px);
        }

        .dhc-btn-secondary {
            display: inline-block;
            background: transparent;
            color: var(--dhc-white);
            font-family: var(--dhc-font-title);
            font-size: 0.85rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            padding: 1.1rem 2.5rem;
            text-decoration: none;
            border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.4s ease;
        }

        .dhc-btn-secondary:hover {
            border-color: var(--dhc-gold);
            color: var(--dhc-gold);
        }

        .dhc-hero-proof {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            color: var(--dhc-white-muted);
            font-size: 0.9rem;
        }

        .dhc-proof-number {
            color: var(--dhc-gold);
            font-weight: 600;
        }

        /* ----- SECCIONES ----- */
        .dhc-section {
            padding: 6rem 0;
        }

        .dhc-section-dark {
            background: var(--dhc-black-soft);
        }

        .dhc-section-header {
            text-align: center;
            margin-bottom: 4rem;
        }

        .dhc-section-header h2 {
            font-family: var(--dhc-font-title);
            font-size: clamp(1.6rem, 4vw, 2.5rem);
            font-weight: 400;
            color: var(--dhc-white);
            margin-bottom: 0.8rem;
        }

        .dhc-section-header p {
            color: var(--dhc-white-muted);
        }

        /* ----- EMPATÍA ----- */
        .dhc-empathy {
            padding: 8rem 0;
            text-align: center;
        }

        .dhc-empathy-title {
            font-family: var(--dhc-font-title);
            font-size: clamp(1.8rem, 5vw, 3rem);
            font-weight: 400;
            color: var(--dhc-white);
            margin-bottom: 2rem;
        }

        .dhc-empathy-text {
            max-width: 600px;
            margin: 0 auto 3rem;
            color: var(--dhc-white-muted);
            font-size: 1.15rem;
        }

        .dhc-empathy-text p {
            margin-bottom: 1rem;
        }

        .dhc-empathy-bridge {
            max-width: 700px;
            margin: 0 auto;
            padding: 2rem;
            border-left: 2px solid var(--dhc-gold);
            text-align: left;
        }

        .dhc-empathy-bridge p {
            font-size: 1.2rem;
            color: var(--dhc-white-soft);
            margin: 0;
        }

        /* ----- CATEGORÍAS ----- */
        .dhc-cat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }

        .dhc-cat-card {
            background: var(--dhc-black-card);
            border: 1px solid rgba(212, 175, 55, 0.1);
            padding: 2rem 1.5rem;
            text-align: center;
            text-decoration: none;
            transition: all 0.4s ease;
        }

        .dhc-cat-card:hover {
            border-color: var(--dhc-gold);
            transform: translateY(-5px);
        }

        .dhc-cat-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        .dhc-cat-card h3 {
            font-family: var(--dhc-font-title);
            font-size: 1.1rem;
            color: var(--dhc-white);
            margin-bottom: 0.5rem;
        }

        .dhc-cat-card p {
            color: var(--dhc-white-muted);
            font-size: 0.9rem;
            margin: 0;
        }

        .dhc-cat-cta {
            text-align: center;
        }

        .dhc-btn-outline {
            display: inline-block;
            background: transparent;
            color: var(--dhc-gold);
            font-family: var(--dhc-font-title);
            font-size: 0.8rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            padding: 1rem 2rem;
            text-decoration: none;
            border: 1px solid var(--dhc-gold);
            transition: all 0.4s ease;
        }

        .dhc-btn-outline:hover {
            background: var(--dhc-gold);
            color: var(--dhc-black);
        }

        /* ----- PROCESO ----- */
        .dhc-steps {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
            margin-bottom: 3rem;
        }

        .dhc-step {
            flex: 1;
            min-width: 250px;
            max-width: 300px;
            text-align: center;
        }

        .dhc-step-number {
            width: 60px;
            height: 60px;
            border: 2px solid var(--dhc-gold);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--dhc-font-title);
            font-size: 1.5rem;
            color: var(--dhc-gold);
            margin: 0 auto 1.5rem;
        }

        .dhc-step h3 {
            font-family: var(--dhc-font-title);
            font-size: 1.2rem;
            color: var(--dhc-white);
            margin-bottom: 1rem;
        }

        .dhc-step p {
            color: var(--dhc-white-muted);
            font-size: 0.95rem;
        }

        .dhc-step-arrow {
            color: var(--dhc-gold);
            font-size: 1.5rem;
            margin-top: 2rem;
        }

        @media (max-width: 768px) {
            .dhc-step-arrow { display: none; }
        }

        /* ----- TESTIMONIOS ----- */
        .dhc-testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 4rem;
        }

        .dhc-testimonial {
            background: var(--dhc-black-card);
            border: 1px solid rgba(255,255,255,0.05);
            padding: 2rem;
        }

        .dhc-testimonial-content p {
            font-size: 1.05rem;
            font-style: italic;
            color: var(--dhc-white-soft);
            margin-bottom: 1.5rem;
        }

        .dhc-testimonial-author {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .dhc-testimonial-photo {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(212, 175, 55, 0.3);
        }

        .dhc-testimonial-info strong {
            display: block;
            color: var(--dhc-white);
        }

        .dhc-testimonial-info span {
            color: var(--dhc-white-muted);
            font-size: 0.85rem;
        }

        .dhc-testimonials-stats {
            display: flex;
            justify-content: center;
            gap: 4rem;
            flex-wrap: wrap;
        }

        .dhc-stat {
            text-align: center;
        }

        .dhc-stat-number {
            display: block;
            font-family: var(--dhc-font-title);
            font-size: 2.5rem;
            color: var(--dhc-gold);
        }

        .dhc-stat-label {
            color: var(--dhc-white-muted);
            font-size: 0.9rem;
        }

        /* ----- FOUNDERS ----- */
        .dhc-founders-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        @media (max-width: 900px) {
            .dhc-founders-grid {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
        }

        .dhc-founders-image img {
            width: 100%;
            max-width: 500px;
            border-radius: 4px;
        }

        .dhc-founders-content h2 {
            font-family: var(--dhc-font-title);
            font-size: clamp(1.6rem, 4vw, 2.2rem);
            color: var(--dhc-white);
            margin-bottom: 0.5rem;
        }

        .dhc-founders-location {
            color: var(--dhc-gold);
            font-size: 0.9rem;
            letter-spacing: 0.1em;
            margin-bottom: 2rem;
        }

        .dhc-founders-text p {
            margin-bottom: 1.2rem;
            color: var(--dhc-white-soft);
        }

        /* ----- VISUAL BREAK ----- */
        .dhc-visual-break {
            position: relative;
            height: 50vh;
            min-height: 350px;
            overflow: hidden;
        }

        .dhc-visual-image {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }

        @media (max-width: 768px) {
            .dhc-visual-image {
                background-attachment: scroll;
            }
        }

        .dhc-visual-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .dhc-visual-quote {
            font-family: var(--dhc-font-title);
            font-size: clamp(1.3rem, 4vw, 2rem);
            color: var(--dhc-white);
            text-align: center;
            max-width: 600px;
            font-style: italic;
        }

        /* ----- GALERÍA ----- */
        .dhc-gallery-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;
        }

        @media (max-width: 768px) {
            .dhc-gallery-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        .dhc-gallery-item {
            aspect-ratio: 1;
            background-size: cover;
            background-position: center;
        }

        /* ----- TRUST ----- */
        .dhc-trust-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 2rem;
            text-align: center;
        }

        .dhc-trust-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        .dhc-trust-item h3 {
            font-family: var(--dhc-font-title);
            font-size: 1rem;
            color: var(--dhc-white);
            margin-bottom: 0.5rem;
        }

        .dhc-trust-item p {
            color: var(--dhc-white-muted);
            font-size: 0.9rem;
            margin: 0;
        }

        /* ----- CTA FINAL ----- */
        .dhc-final-cta {
            padding: 8rem 0;
            text-align: center;
        }

        .dhc-final-content h2 {
            font-family: var(--dhc-font-title);
            font-size: clamp(2rem, 5vw, 3rem);
            color: var(--dhc-white);
            margin-bottom: 1rem;
        }

        .dhc-final-content > p {
            color: var(--dhc-white-muted);
            font-size: 1.2rem;
            margin-bottom: 2.5rem;
        }

        .dhc-btn-large {
            padding: 1.3rem 3.5rem;
            font-size: 0.9rem;
        }

        .dhc-final-note {
            margin-top: 2rem;
            color: var(--dhc-white-muted);
            font-size: 0.85rem;
        }

        /* ----- FOOTER SPACER ----- */
        .dhc-footer-space {
            height: 100px;
            background: var(--dhc-black);
        }
        </style>
        <?php
    }

    public function add_content_and_scripts() {
        if (!is_front_page()) return;
        ?>
        <div id="dhc-homepage-wrapper">
            <div class="dhc-homepage">

                <!-- HERO -->
                <section class="dhc-hero">
                    <div class="dhc-hero-bg">
                        <video autoplay muted loop playsinline class="dhc-hero-video">
                            <source src="https://duendesdeluruguay.com/wp-content/uploads/2025/01/hero-duendes.mp4" type="video/mp4">
                        </video>
                        <div class="dhc-hero-fallback" style="background-image: url('https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-c1fc0c65ae0e4748a297f34e9f2d0062-1-scaled.jpg');"></div>
                        <div class="dhc-hero-overlay"></div>
                    </div>
                    <div class="dhc-hero-content">
                        <p class="dhc-hero-pre">Desde Piriápolis, Uruguay</p>
                        <h1 class="dhc-hero-title">Tu Guardián Mágico<br>Te Está Esperando</h1>
                        <p class="dhc-hero-sub">Seres únicos, hechos a mano con intención.<br>Cada uno nace para alguien específico.</p>
                        <div class="dhc-hero-ctas">
                            <a href="/shop/" class="dhc-btn-primary">Explorar Guardianes</a>
                            <a href="/descubri-que-duende-te-elige/" class="dhc-btn-secondary">Hacer el Test</a>
                        </div>
                        <div class="dhc-hero-proof">
                            <span class="dhc-proof-number">3,000+</span>
                            <span class="dhc-proof-text">guardianes encontraron hogar en 14 países</span>
                        </div>
                    </div>
                </section>

                <!-- EMPATÍA -->
                <section class="dhc-empathy dhc-section">
                    <div class="dhc-container">
                        <h2 class="dhc-empathy-title">Hay algo que falta.<br>Lo sentís.</h2>
                        <div class="dhc-empathy-text">
                            <p>No es locura. No es inventado.</p>
                            <p>Buscás protección, claridad, abundancia... y el mundo te ofrece soluciones vacías.</p>
                            <p>Algo dentro tuyo sabe que hay otra forma.</p>
                        </div>
                        <div class="dhc-empathy-bridge">
                            <p>Los guardianes no son decoración.<br>Son compañeros que <strong>escuchan, protegen y acompañan</strong>.</p>
                        </div>
                    </div>
                </section>

                <!-- VISUAL BREAK 1 -->
                <section class="dhc-visual-break">
                    <div class="dhc-visual-image" style="background-image: url('https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-9ddf1407294d9cd26ee215b57d94fc06-1-scaled.jpg');"></div>
                </section>

                <!-- CATEGORÍAS -->
                <section class="dhc-section dhc-section-dark">
                    <div class="dhc-container">
                        <div class="dhc-section-header">
                            <h2>¿Qué tipo de magia buscás?</h2>
                            <p>Cada guardián tiene su especialidad</p>
                        </div>
                        <div class="dhc-cat-grid">
                            <a href="/categoria-producto/proteccion/" class="dhc-cat-card">
                                <div class="dhc-cat-icon">🛡️</div>
                                <h3>Protección</h3>
                                <p>Para quienes cargan con más de lo que les corresponde</p>
                            </a>
                            <a href="/categoria-producto/abundancia/" class="dhc-cat-card">
                                <div class="dhc-cat-icon">✨</div>
                                <h3>Abundancia</h3>
                                <p>Para desbloquear lo que te merecés recibir</p>
                            </a>
                            <a href="/categoria-producto/amor/" class="dhc-cat-card">
                                <div class="dhc-cat-icon">💜</div>
                                <h3>Amor</h3>
                                <p>Para sanar el corazón y atraer conexiones reales</p>
                            </a>
                            <a href="/categoria-producto/sanacion/" class="dhc-cat-card">
                                <div class="dhc-cat-icon">🌿</div>
                                <h3>Sanación</h3>
                                <p>Para soltar lo que pesa y encontrar paz</p>
                            </a>
                            <a href="/categoria-producto/sabiduria/" class="dhc-cat-card">
                                <div class="dhc-cat-icon">🔮</div>
                                <h3>Sabiduría</h3>
                                <p>Para claridad en momentos de confusión</p>
                            </a>
                        </div>
                        <div class="dhc-cat-cta">
                            <p style="color: var(--dhc-white-muted); margin-bottom: 1rem;">¿No sabés cuál es para vos?</p>
                            <a href="/descubri-que-duende-te-elige/" class="dhc-btn-outline">Hacer el Test del Guardián</a>
                        </div>
                    </div>
                </section>

                <!-- VISUAL BREAK 2 -->
                <section class="dhc-visual-break">
                    <div class="dhc-visual-image" style="background-image: url('https://duendesdeluruguay.com/wp-content/uploads/2025/11/Firefly_Gemini-Flash_Same-artisan.-Holding-three-tiny-277534-IDX.png');"></div>
                    <div class="dhc-visual-overlay">
                        <p class="dhc-visual-quote">"Cada guardián nace con una intención específica"</p>
                    </div>
                </section>

                <!-- PROCESO -->
                <section class="dhc-section">
                    <div class="dhc-container">
                        <div class="dhc-section-header">
                            <h2>Así funciona la magia</h2>
                            <p>Tres pasos para encontrar a tu guardián</p>
                        </div>
                        <div class="dhc-steps">
                            <div class="dhc-step">
                                <div class="dhc-step-number">1</div>
                                <h3>Elegí tu guardián</h3>
                                <p>Explorá la tienda o hacé el test para descubrir cuál resuena con vos.</p>
                            </div>
                            <div class="dhc-step-arrow">→</div>
                            <div class="dhc-step">
                                <div class="dhc-step-number">2</div>
                                <h3>Contanos de vos</h3>
                                <p>Respondé unas preguntas para que tu guardián pueda escribirte una carta personal.</p>
                            </div>
                            <div class="dhc-step-arrow">→</div>
                            <div class="dhc-step">
                                <div class="dhc-step-number">3</div>
                                <h3>Recibí su carta</h3>
                                <p>Tu guardián llega a casa con un mensaje canalizado que solo vos vas a entender.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- TESTIMONIOS -->
                <section class="dhc-section dhc-section-dark">
                    <div class="dhc-container">
                        <div class="dhc-section-header">
                            <h2>Lo que dicen quienes ya encontraron a su guardián</h2>
                        </div>
                        <div class="dhc-testimonials-grid">
                            <div class="dhc-testimonial">
                                <div class="dhc-testimonial-content">
                                    <p>"Estaba pasando por un duelo terrible. Mi guardián llegó con una canalización que me hizo llorar. Era como si supiera todo."</p>
                                </div>
                                <div class="dhc-testimonial-author">
                                    <img src="https://duendesdeluruguay.com/wp-content/uploads/2025/11/gemini-image-2_a_truly_real_medium_age_person_in_her_40_s_holding_this_exactly_duende_and_is_ha-0.jpg" alt="Cliente" class="dhc-testimonial-photo">
                                    <div class="dhc-testimonial-info">
                                        <strong>María L.</strong>
                                        <span>Buenos Aires, Argentina</span>
                                    </div>
                                </div>
                            </div>
                            <div class="dhc-testimonial">
                                <div class="dhc-testimonial-content">
                                    <p>"Pensé que era un adorno más. Desde que llegó dejé de sentir esa angustia en el pecho. Algo cambió."</p>
                                </div>
                                <div class="dhc-testimonial-author">
                                    <img src="https://duendesdeluruguay.com/wp-content/uploads/2025/11/gemini-image-2_artistic_portrait_photography_of_a_truly_real_medium_age_person_black_hair_in_he-0-scaled.jpg" alt="Cliente" class="dhc-testimonial-photo">
                                    <div class="dhc-testimonial-info">
                                        <strong>Carolina S.</strong>
                                        <span>Ciudad de México</span>
                                    </div>
                                </div>
                            </div>
                            <div class="dhc-testimonial">
                                <div class="dhc-testimonial-content">
                                    <p>"Le regalé uno a mi mamá. Me llamó llorando cuando leyó la carta. Dijo que era exactamente lo que necesitaba escuchar."</p>
                                </div>
                                <div class="dhc-testimonial-author">
                                    <img src="https://duendesdeluruguay.com/wp-content/uploads/2025/11/IMG_4112-scaled.jpeg" alt="Cliente" class="dhc-testimonial-photo">
                                    <div class="dhc-testimonial-info">
                                        <strong>Luciana R.</strong>
                                        <span>Montevideo, Uruguay</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="dhc-testimonials-stats">
                            <div class="dhc-stat">
                                <span class="dhc-stat-number">4.9★</span>
                                <span class="dhc-stat-label">Valoración promedio</span>
                            </div>
                            <div class="dhc-stat">
                                <span class="dhc-stat-number">14</span>
                                <span class="dhc-stat-label">Países alcanzados</span>
                            </div>
                            <div class="dhc-stat">
                                <span class="dhc-stat-number">3,000+</span>
                                <span class="dhc-stat-label">Guardianes adoptados</span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- FOUNDERS -->
                <section class="dhc-section">
                    <div class="dhc-container">
                        <div class="dhc-founders-grid">
                            <div class="dhc-founders-image">
                                <img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/IMG_2970-scaled.jpg" alt="Thibisay y Gabriel" loading="lazy">
                            </div>
                            <div class="dhc-founders-content">
                                <h2>Somos Thibisay y Gabriel</h2>
                                <p class="dhc-founders-location">Desde Piriápolis, Uruguay</p>
                                <div class="dhc-founders-text">
                                    <p>Somos los que estamos detrás de todo esto. Cada guardián pasa por nuestras manos antes de encontrar su hogar.</p>
                                    <p>No es producción en masa. No hay dos iguales. Cada ser que nace en nuestro taller ya sabe a quién pertenece.</p>
                                    <p>Creemos que la magia no es fantasía: es energía que se puede tocar, regalar, sentir.</p>
                                    <p><strong>Esto no es un negocio de adornos. Es un puente entre mundos.</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- GALERÍA -->
                <section class="dhc-gallery">
                    <div class="dhc-gallery-grid">
                        <div class="dhc-gallery-item" style="background-image: url('https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-9d9516913eaa3c53add3d72ac27534c8-1-scaled.jpg');"></div>
                        <div class="dhc-gallery-item" style="background-image: url('https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-8832dc36c9ec5052f05b6ef1c7bf3488-1-scaled.jpg');"></div>
                        <div class="dhc-gallery-item" style="background-image: url('https://duendesdeluruguay.com/wp-content/uploads/2025/12/gemini-image-2_A_cinematic_portrait_photograph_of_Professional_photograph_taken_with_Canon_EOS_-0-1-scaled.jpg');"></div>
                        <div class="dhc-gallery-item" style="background-image: url('https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-c3fc02fc25aeae8731538aa77743c9f8-1-scaled.jpg');"></div>
                    </div>
                </section>

                <!-- TRUST -->
                <section class="dhc-section dhc-section-dark">
                    <div class="dhc-container">
                        <div class="dhc-trust-grid">
                            <div class="dhc-trust-item">
                                <div class="dhc-trust-icon">🌎</div>
                                <h3>Envío a todo el mundo</h3>
                                <p>Llegamos a 14 países. Gratis en compras +$1000 USD.</p>
                            </div>
                            <div class="dhc-trust-item">
                                <div class="dhc-trust-icon">💌</div>
                                <h3>Canalización incluida</h3>
                                <p>Cada guardián viene con su carta personal.</p>
                            </div>
                            <div class="dhc-trust-item">
                                <div class="dhc-trust-icon">🎁</div>
                                <h3>Packaging mágico</h3>
                                <p>Llega listo para regalar o para vos.</p>
                            </div>
                            <div class="dhc-trust-item">
                                <div class="dhc-trust-icon">💬</div>
                                <h3>Soporte humano</h3>
                                <p>Respondemos personalmente. No somos un bot.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA FINAL -->
                <section class="dhc-final-cta">
                    <div class="dhc-container">
                        <div class="dhc-final-content">
                            <h2>Tu guardián ya sabe<br>que lo estás buscando</h2>
                            <p>Es hora de encontrarse.</p>
                            <a href="/shop/" class="dhc-btn-primary dhc-btn-large">Explorar Guardianes</a>
                            <p class="dhc-final-note">Envío gratis en pedidos +$1000 USD · Pago seguro · Canalización incluida</p>
                        </div>
                    </div>
                </section>

                <div class="dhc-footer-space"></div>

            </div>
        </div>

        <script>
        // Video fallback
        document.addEventListener('DOMContentLoaded', function() {
            const video = document.querySelector('.dhc-hero-video');
            if (video) {
                video.addEventListener('error', function() {
                    this.style.display = 'none';
                });
            }
        });
        </script>
        <?php
    }
}

new Duendes_Homepage_Conversion();
