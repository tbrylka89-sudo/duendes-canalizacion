<?php
/**
 * Plugin Name: Duendes Homepage Premium
 * Description: Mejoras visuales premium para la homepage - Intro cinematográfico, animaciones GSAP, cursor custom, micro-interacciones
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

class Duendes_Homepage_Premium {

    public function __construct() {
        add_action('wp_head', [$this, 'add_styles'], 5);
        add_action('wp_footer', [$this, 'add_html'], 5);
        add_action('wp_footer', [$this, 'add_scripts'], 99);
    }

    public function add_styles() {
        if (!is_front_page()) return;
        ?>
        <style id="duendes-premium-styles">
        /* =============================================
           DUENDES HOMEPAGE PREMIUM
           Mejoras visuales y de experiencia
           ============================================= */

        /* ----- CURSOR CUSTOM ----- */
        @media (hover: hover) {
            body.premium-cursor {
                cursor: none !important;
            }
            body.premium-cursor * {
                cursor: none !important;
            }
        }

        .dhp-cursor {
            position: fixed;
            width: 12px;
            height: 12px;
            background: #d4af37;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999999 !important;
            transform: translate(-50%, -50%);
            transition: transform 0.15s ease, width 0.3s, height 0.3s, background 0.3s;
            mix-blend-mode: difference;
        }

        .dhp-cursor.visible {
            /* Cursor siempre visible */
        }

        .dhp-cursor.hover {
            width: 40px;
            height: 40px;
            background: rgba(212, 175, 55, 0.3);
            border: 1px solid #d4af37;
        }

        .dhp-cursor.click {
            transform: translate(-50%, -50%) scale(0.8);
        }

        @media (hover: none), (max-width: 768px) {
            .dhp-cursor { display: none !important; }
        }

        /* ----- INTRO CINEMATOGRÁFICO ----- */
        .dhp-intro {
            position: fixed;
            inset: 0;
            z-index: 999999 !important;
            background: #000 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .dhp-intro.hidden {
            pointer-events: none;
            visibility: hidden;
            opacity: 0;
        }

        .dhp-intro-mist {
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse at 30% 40%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 60%, rgba(212, 175, 55, 0.06) 0%, transparent 50%);
            opacity: 0;
        }

        .dhp-intro-orb {
            position: absolute;
            width: 12px;
            height: 12px;
            background: #d4af37;
            border-radius: 50%;
            opacity: 0;
            box-shadow:
                0 0 80px 30px rgba(212, 175, 55, 0.6),
                0 0 150px 60px rgba(212, 175, 55, 0.3);
        }

        .dhp-intro-content {
            position: relative;
            text-align: center;
            opacity: 0;
            transform: translateY(20px);
            z-index: 10;
        }

        .dhp-intro-logo {
            font-family: 'Cinzel', serif !important;
            font-size: clamp(2.2rem, 8vw, 5rem) !important;
            font-weight: 600 !important;
            letter-spacing: 0.25em !important;
            color: #fff !important;
            margin-bottom: 1.5rem;
            text-shadow:
                0 0 60px rgba(212, 175, 55, 0.5),
                0 0 120px rgba(212, 175, 55, 0.3),
                0 2px 4px rgba(0,0,0,0.8) !important;
        }

        .dhp-intro-sub {
            font-family: 'Cormorant Garamond', serif !important;
            font-size: clamp(1rem, 2.5vw, 1.3rem) !important;
            font-weight: 400 !important;
            letter-spacing: 0.5em !important;
            color: rgba(212, 175, 55, 0.8) !important;
            text-transform: uppercase;
        }

        .dhp-intro-cta {
            margin-top: 3rem;
            opacity: 0;
            transform: translateY(20px);
        }

        .dhp-intro-btn {
            background: transparent !important;
            border: 2px solid #d4af37 !important;
            color: #d4af37 !important;
            font-family: 'Cinzel', serif !important;
            font-size: 0.85rem !important;
            letter-spacing: 0.3em !important;
            padding: 1.2rem 3rem !important;
            cursor: pointer !important;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
            text-transform: uppercase;
        }

        .dhp-intro-btn:hover {
            background: #d4af37 !important;
            color: #000 !important;
            letter-spacing: 0.4em !important;
            box-shadow: 0 0 40px rgba(212, 175, 55, 0.4);
        }

        .dhp-intro-skip {
            position: absolute;
            bottom: 3rem;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Cinzel', serif;
            font-size: 0.7rem;
            letter-spacing: 0.3em;
            color: rgba(255, 255, 255, 0.4);
            cursor: pointer;
            transition: color 0.4s;
            opacity: 0;
            text-decoration: underline;
            text-underline-offset: 4px;
        }

        .dhp-intro-skip:hover {
            color: rgba(255, 255, 255, 0.8);
        }

        /* ----- MODAL GEOLOCALIZACIÓN ----- */
        .dhp-geo-modal {
            position: fixed;
            inset: 0;
            z-index: 999998 !important;
            background: #000 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }

        .dhp-geo-modal.visible {
            opacity: 1;
            visibility: visible;
        }

        .dhp-geo-modal.hidden {
            display: none !important;
        }

        .dhp-geo-content {
            background: transparent !important;
            border: none !important;
            padding: 2rem;
            max-width: 380px;
            width: 90%;
            text-align: center;
            position: relative;
        }

        .dhp-geo-icon {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            display: block;
            opacity: 0.8;
        }

        .dhp-geo-title {
            font-family: 'Cinzel', serif !important;
            font-size: clamp(1.2rem, 4vw, 1.6rem) !important;
            color: #fff !important;
            margin-bottom: 0.5rem !important;
            letter-spacing: 0.15em;
            font-weight: 400 !important;
        }

        .dhp-geo-subtitle {
            font-family: 'Cormorant Garamond', serif;
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 2.5rem;
            line-height: 1.5;
        }

        .dhp-geo-options {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            max-height: 50vh;
            overflow-y: auto;
            padding-right: 0.5rem;
        }

        .dhp-geo-options::-webkit-scrollbar {
            width: 3px;
        }

        .dhp-geo-options::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
        }

        .dhp-geo-options::-webkit-scrollbar-thumb {
            background: rgba(212, 175, 55, 0.3);
        }

        .dhp-geo-btn {
            background: transparent !important;
            border: 1px solid rgba(212, 175, 55, 0.3) !important;
            color: rgba(255, 255, 255, 0.85) !important;
            font-family: 'Cormorant Garamond', serif !important;
            font-size: 1rem !important;
            padding: 0.9rem 1.2rem !important;
            cursor: pointer !important;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
            border-radius: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 0.8rem !important;
        }

        .dhp-geo-btn:hover {
            background: rgba(212, 175, 55, 0.1) !important;
            border-color: #d4af37 !important;
            color: #fff !important;
        }

        .dhp-geo-btn.primary {
            border: 2px solid #d4af37 !important;
            color: #d4af37 !important;
            font-weight: 500 !important;
        }

        .dhp-geo-btn.primary:hover {
            background: #d4af37 !important;
            color: #000 !important;
        }

        .dhp-geo-flag {
            font-size: 1.2rem;
        }

        .dhp-geo-divider {
            color: rgba(255, 255, 255, 0.2);
            font-size: 0.7rem;
            margin: 0.8rem 0;
            letter-spacing: 0.3em;
            text-transform: uppercase;
        }

        @media (max-width: 480px) {
            .dhp-geo-content {
                padding: 1.5rem;
            }
        }

        /* ----- MEJORAS DE ANIMACIÓN ----- */

        /* Elementos que se revelan con scroll */
        .dhp-reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dhp-reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .dhp-reveal-left {
            opacity: 0;
            transform: translateX(-40px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dhp-reveal-left.visible {
            opacity: 1;
            transform: translateX(0);
        }

        .dhp-reveal-right {
            opacity: 0;
            transform: translateX(40px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dhp-reveal-right.visible {
            opacity: 1;
            transform: translateX(0);
        }

        /* Stagger delay classes */
        .dhp-delay-1 { transition-delay: 0.1s; }
        .dhp-delay-2 { transition-delay: 0.2s; }
        .dhp-delay-3 { transition-delay: 0.3s; }
        .dhp-delay-4 { transition-delay: 0.4s; }
        .dhp-delay-5 { transition-delay: 0.5s; }

        /* ----- MEJORAS DE CARDS ----- */

        /* Cards con efecto 3D tilt */
        .dhp-tilt {
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            transform-style: preserve-3d;
        }

        /* Botones magnéticos */
        .dhp-magnetic {
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Glow mejorado en hover */
        .dhp-glow-hover {
            transition: box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dhp-glow-hover:hover {
            box-shadow: 0 0 40px rgba(212, 175, 55, 0.3),
                        0 20px 40px rgba(0, 0, 0, 0.3);
        }

        /* ----- MEJORAS CARRUSELES ----- */

        /* Barra de progreso del carrusel */
        .dhp-carousel-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            background: linear-gradient(90deg, #d4af37, rgba(212, 175, 55, 0.3));
            width: 0%;
            transition: width 0.3s ease;
        }

        /* Cards del carrusel con tilt */
        .dhc-card {
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                        box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .dhc-card:hover {
            box-shadow: 0 20px 50px rgba(212, 175, 55, 0.15),
                        0 10px 30px rgba(0, 0, 0, 0.3) !important;
        }

        /* ----- PARALLAX MEJORADO ----- */

        .dhp-parallax {
            will-change: transform;
        }

        /* ----- MEJORAS DE TEXTO ----- */

        /* Texto que aparece letra por letra */
        .dhp-text-reveal .char {
            display: inline-block;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .dhp-text-reveal.visible .char {
            opacity: 1;
            transform: translateY(0);
        }

        /* ----- LÍNEA DE SCROLL ----- */

        .dhp-scroll-line {
            position: fixed;
            top: 0;
            left: 0;
            height: 2px;
            background: linear-gradient(90deg, #d4af37, rgba(212, 175, 55, 0.5));
            width: 0%;
            z-index: 10000;
            transition: width 0.1s ease;
        }

        /* ----- LOADING STATE ----- */

        body.dhp-loading {
            overflow: hidden;
        }

        /* ----- SMOOTH SCROLL ----- */

        html.dhp-smooth {
            scroll-behavior: smooth;
        }

        /* ----- MEJORAS TESTIMONIOS ----- */

        .testimonio-slide {
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 0.5s ease !important;
        }

        .testimonio-slide:hover {
            transform: translateY(-5px) !important;
        }

        /* ----- MEJORAS SECCIÓN PROCESO ----- */

        .pilar-card {
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                        box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .pilar-card:hover {
            transform: translateY(-8px) !important;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4),
                        0 0 30px rgba(212, 175, 55, 0.1) !important;
        }

        /* ----- OPTIMIZACIÓN PERFORMANCE ----- */

        .video-hero video,
        .sec-parallax-break,
        .dhc-track,
        .testimonio-slide {
            will-change: transform;
        }

        /* Lazy loading placeholder */
        .dhp-lazy {
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        .dhp-lazy.loaded {
            opacity: 1;
        }

        /* ----- NOTIFICACIÓN SOCIAL MEJORADA ----- */

        .dhp-social-notif {
            position: fixed;
            bottom: 100px;
            left: 2rem;
            background: rgba(10, 10, 10, 0.95);
            border: 1px solid rgba(212, 175, 55, 0.2);
            padding: 1rem 1.5rem;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 9999;
            transform: translateX(-120%);
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            backdrop-filter: blur(10px);
            max-width: 320px;
        }

        .dhp-social-notif.visible {
            transform: translateX(0);
        }

        .dhp-social-notif-avatar {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(212, 175, 55, 0.3);
        }

        .dhp-social-notif-text {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.5;
        }

        .dhp-social-notif-text strong {
            color: #fff;
            display: block;
            margin-bottom: 2px;
        }

        .dhp-social-notif-text .time {
            color: #d4af37;
            font-size: 0.75rem;
        }

        .dhp-social-notif-close {
            position: absolute;
            top: 5px;
            right: 8px;
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.3);
            cursor: pointer;
            font-size: 1rem;
            padding: 5px;
        }

        .dhp-social-notif-close:hover {
            color: #fff;
        }

        @media (max-width: 768px) {
            .dhp-social-notif {
                left: 1rem;
                right: 1rem;
                max-width: none;
                bottom: 80px;
            }
        }

        /* ----- ANIMACIONES KEYFRAME ADICIONALES ----- */

        @keyframes dhp-pulse-subtle {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }

        @keyframes dhp-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes dhp-glow-pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
            50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.5); }
        }
        </style>
        <?php
    }

    public function add_html() {
        if (!is_front_page()) return;
        ?>
        <!-- Cursor Custom -->
        <div class="dhp-cursor" id="dhpCursor"></div>

        <!-- Scroll Progress Line -->
        <div class="dhp-scroll-line" id="dhpScrollLine"></div>

        <!-- Intro Cinematográfico - DESACTIVADO
        <div class="dhp-intro" id="dhpIntro">
            <div class="dhp-intro-mist" id="dhpIntroMist"></div>
            <div class="dhp-intro-orb" id="dhpIntroOrb"></div>

            <div class="dhp-intro-content" id="dhpIntroContent">
                <h1 class="dhp-intro-logo">DUENDES DEL URUGUAY</h1>
                <p class="dhp-intro-sub">Guardianes Mágicos · Piriápolis</p>
                <div class="dhp-intro-cta" id="dhpIntroCta">
                    <button class="dhp-intro-btn" id="dhpIntroBtn">ENTRAR AL BOSQUE</button>
                </div>
            </div>

            <span class="dhp-intro-skip" id="dhpIntroSkip">SALTAR INTRO</span>
        </div>
        -->

        <!-- Modal de Geolocalización -->
        <div class="dhp-geo-modal" id="dhpGeoModal">
            <div class="dhp-geo-content">
                <span class="dhp-geo-icon">🌎</span>
                <h2 class="dhp-geo-title">¿Desde dónde nos visitás?</h2>
                <p class="dhp-geo-subtitle">Para mostrarte precios en tu moneda y opciones de envío</p>

                <div class="dhp-geo-options">
                    <button class="dhp-geo-btn primary" data-country="UY">
                        <span class="dhp-geo-flag">🇺🇾</span>
                        Uruguay
                    </button>

                    <div class="dhp-geo-divider">— LATINOAMÉRICA —</div>

                    <button class="dhp-geo-btn" data-country="AR">
                        <span class="dhp-geo-flag">🇦🇷</span>
                        Argentina
                    </button>

                    <button class="dhp-geo-btn" data-country="MX">
                        <span class="dhp-geo-flag">🇲🇽</span>
                        México
                    </button>

                    <button class="dhp-geo-btn" data-country="CL">
                        <span class="dhp-geo-flag">🇨🇱</span>
                        Chile
                    </button>

                    <button class="dhp-geo-btn" data-country="CO">
                        <span class="dhp-geo-flag">🇨🇴</span>
                        Colombia
                    </button>

                    <div class="dhp-geo-divider">— OTROS —</div>

                    <button class="dhp-geo-btn" data-country="ES">
                        <span class="dhp-geo-flag">🇪🇸</span>
                        España
                    </button>

                    <button class="dhp-geo-btn" data-country="US">
                        <span class="dhp-geo-flag">🇺🇸</span>
                        Estados Unidos
                    </button>

                    <button class="dhp-geo-btn" data-country="OTHER">
                        <span class="dhp-geo-flag">🌍</span>
                        Otro país
                    </button>
                </div>
            </div>
        </div>

        <!-- Social Notification - DESACTIVADO (fotos truchas) -->
        <?php
    }

    public function add_scripts() {
        if (!is_front_page()) return;
        ?>
        <script id="duendes-premium-scripts">
        (function() {
            'use strict';

            // =============================================
            // CONFIGURACIÓN
            // =============================================
            const CONFIG = {
                introEnabled: false, // DESACTIVADO - limpieza homepage
                cursorEnabled: true,
                scrollAnimations: true,
                socialNotifications: false, // DESACTIVADO - fotos truchas
                magneticButtons: true,
                tiltCards: true,
                parallaxEnabled: true
            };

            // =============================================
            // VARIABLES
            // =============================================
            let mouseX = 0, mouseY = 0;
            let cursorX = 0, cursorY = 0;
            const cursor = document.getElementById('dhpCursor');
            const intro = document.getElementById('dhpIntro');
            const scrollLine = document.getElementById('dhpScrollLine');

            // =============================================
            // CURSOR CUSTOM
            // =============================================
            function initCursor() {
                if (!CONFIG.cursorEnabled || !cursor) return;
                if (window.matchMedia('(hover: none)').matches) return;

                document.body.classList.add('premium-cursor');

                // Mostrar cursor inmediatamente
                cursor.classList.add('visible');

                document.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                    // Primer movimiento: posicionar inmediatamente
                    if (!cursor.dataset.moved) {
                        cursor.style.left = mouseX + 'px';
                        cursor.style.top = mouseY + 'px';
                        cursorX = mouseX;
                        cursorY = mouseY;
                        cursor.dataset.moved = 'true';
                    }
                });

                function animateCursor() {
                    cursorX += (mouseX - cursorX) * 0.15;
                    cursorY += (mouseY - cursorY) * 0.15;
                    cursor.style.left = cursorX + 'px';
                    cursor.style.top = cursorY + 'px';
                    requestAnimationFrame(animateCursor);
                }
                animateCursor();

                // Hover states - incluyendo botones del intro y geo modal
                function setupHoverStates() {
                    const hoverElements = document.querySelectorAll('a, button, .dhc-card, .pilar-card, .testimonio-slide, input, textarea, .dhp-intro-btn, .dhp-intro-skip, .dhp-geo-btn');
                    hoverElements.forEach(el => {
                        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
                        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
                    });
                }
                setupHoverStates();

                // Click state
                document.addEventListener('mousedown', () => cursor.classList.add('click'));
                document.addEventListener('mouseup', () => cursor.classList.remove('click'));
            }

            // =============================================
            // INTRO CINEMATOGRÁFICO
            // =============================================
            function initIntro() {
                // Si intro desactivado, ir directo a geo modal
                if (!CONFIG.introEnabled || !intro) {
                    checkGeoModal();
                    return;
                }

                // Si ya vio el intro, saltar directo a geolocalización
                if (sessionStorage.getItem('dhp-intro-seen')) {
                    intro.classList.add('hidden');
                    intro.style.display = 'none';
                    checkGeoModal();
                    return;
                }

                document.body.classList.add('dhp-loading');

                const orb = document.getElementById('dhpIntroOrb');
                const mist = document.getElementById('dhpIntroMist');
                const content = document.getElementById('dhpIntroContent');
                const cta = document.getElementById('dhpIntroCta');
                const skip = document.getElementById('dhpIntroSkip');
                const btn = document.getElementById('dhpIntroBtn');

                // Secuencia de animación más visible
                const timeline = [
                    { el: mist, delay: 100, props: { opacity: 0.5 }, duration: 1000 },
                    { el: orb, delay: 200, props: { opacity: 1, transform: 'scale(1)' }, duration: 1200 },
                    { el: orb, delay: 1800, props: { opacity: 0, transform: 'scale(100)' }, duration: 1800 },
                    { el: mist, delay: 2200, props: { opacity: 1 }, duration: 1000 },
                    { el: content, delay: 2800, props: { opacity: 1, transform: 'translateY(0)' }, duration: 1000 },
                    { el: cta, delay: 3600, props: { opacity: 1, transform: 'translateY(0)' }, duration: 800 },
                    { el: skip, delay: 4200, props: { opacity: 1 }, duration: 500 }
                ];

                timeline.forEach(item => {
                    setTimeout(() => {
                        if (item.el) {
                            Object.assign(item.el.style, {
                                transition: `all ${item.duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
                                ...item.props
                            });
                        }
                    }, item.delay);
                });

                // Función para entrar al sitio
                function enterSite() {
                    sessionStorage.setItem('dhp-intro-seen', 'true');

                    intro.style.transition = 'opacity 0.8s ease, visibility 0.8s';
                    intro.style.opacity = '0';

                    setTimeout(() => {
                        intro.classList.add('hidden');
                        intro.style.display = 'none';
                        document.body.classList.remove('dhp-loading');
                        checkGeoModal();
                    }, 800);
                }

                btn.addEventListener('click', enterSite);
                skip.addEventListener('click', enterSite);
            }

            // =============================================
            // MODAL DE GEOLOCALIZACIÓN
            // =============================================
            function checkGeoModal() {
                const geoModal = document.getElementById('dhpGeoModal');
                if (!geoModal) {
                    initScrollAnimations();
                    return;
                }

                // Si ya eligió país, no mostrar
                if (localStorage.getItem('dhp-user-country')) {
                    geoModal.classList.add('hidden');
                    initScrollAnimations();
                    return;
                }

                // Mostrar modal
                document.body.classList.add('dhp-loading');
                setTimeout(() => {
                    geoModal.classList.add('visible');
                }, 100);

                // Event listeners para botones
                const buttons = geoModal.querySelectorAll('.dhp-geo-btn');
                buttons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const country = this.dataset.country;
                        localStorage.setItem('dhp-user-country', country);

                        // Dispatch event para que otros sistemas puedan escuchar
                        window.dispatchEvent(new CustomEvent('dhp-country-selected', {
                            detail: { country: country }
                        }));

                        // También intentar setear en WooCommerce si está disponible
                        if (window.wc_country_select_params || window.woocommerce_params) {
                            try {
                                // Intentar actualizar moneda según país
                                const currencyMap = {
                                    'UY': 'UYU',
                                    'AR': 'ARS',
                                    'MX': 'MXN',
                                    'CL': 'CLP',
                                    'CO': 'COP',
                                    'ES': 'EUR',
                                    'US': 'USD',
                                    'OTHER': 'USD'
                                };
                                const currency = currencyMap[country] || 'USD';
                                // Guardar preferencia de moneda
                                localStorage.setItem('dhp-user-currency', currency);
                            } catch(e) {
                                console.log('No se pudo setear moneda WooCommerce');
                            }
                        }

                        // Cerrar modal
                        geoModal.style.transition = 'opacity 0.5s ease';
                        geoModal.style.opacity = '0';

                        setTimeout(() => {
                            geoModal.classList.remove('visible');
                            geoModal.classList.add('hidden');
                            document.body.classList.remove('dhp-loading');
                            initScrollAnimations();

                            // Log de país seleccionado
                            const countryNames = {
                                'UY': 'Uruguay 🇺🇾',
                                'AR': 'Argentina 🇦🇷',
                                'MX': 'México 🇲🇽',
                                'CL': 'Chile 🇨🇱',
                                'CO': 'Colombia 🇨🇴',
                                'ES': 'España 🇪🇸',
                                'US': 'Estados Unidos 🇺🇸',
                                'OTHER': 'Internacional 🌍'
                            };

                            console.log('🌎 País seleccionado:', countryNames[country] || country);
                        }, 500);
                    });
                });
            }

            // =============================================
            // SCROLL ANIMATIONS
            // =============================================
            function initScrollAnimations() {
                if (!CONFIG.scrollAnimations) return;

                // Agregar clases a elementos existentes
                const revealSelectors = [
                    '.dhc-section .dhc-header',
                    '.seccion-piriapolis',
                    '.sec-testimonios-slider .testimonios-header',
                    '.sec-artesanal .artesanal-grid',
                    '.seccion-porque .porque-header',
                    '.inc-sec .inc-header',
                    '.sec-manifiesto'
                ];

                revealSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        el.classList.add('dhp-reveal');
                    });
                });

                // Cards con stagger
                document.querySelectorAll('.pilar-card').forEach((card, i) => {
                    card.classList.add('dhp-reveal', `dhp-delay-${Math.min(i + 1, 5)}`);
                });

                // Observer para reveals
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

                document.querySelectorAll('.dhp-reveal, .dhp-reveal-left, .dhp-reveal-right').forEach(el => {
                    observer.observe(el);
                });

                // Scroll progress line
                if (scrollLine) {
                    window.addEventListener('scroll', () => {
                        const scrollTop = window.scrollY;
                        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                        const scrollPercent = (scrollTop / docHeight) * 100;
                        scrollLine.style.width = scrollPercent + '%';
                    });
                }
            }

            // =============================================
            // MAGNETIC BUTTONS
            // =============================================
            function initMagneticButtons() {
                if (!CONFIG.magneticButtons) return;

                const buttons = document.querySelectorAll('.btn-test-premium, .dhp-intro-btn, .dhc-flecha');

                buttons.forEach(btn => {
                    btn.classList.add('dhp-magnetic');

                    btn.addEventListener('mousemove', (e) => {
                        const rect = btn.getBoundingClientRect();
                        const x = e.clientX - rect.left - rect.width / 2;
                        const y = e.clientY - rect.top - rect.height / 2;

                        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                    });

                    btn.addEventListener('mouseleave', () => {
                        btn.style.transform = 'translate(0, 0)';
                    });
                });
            }

            // =============================================
            // TILT CARDS
            // =============================================
            function initTiltCards() {
                if (!CONFIG.tiltCards) return;

                const cards = document.querySelectorAll('.dhc-card, .pilar-card');

                cards.forEach(card => {
                    card.addEventListener('mousemove', (e) => {
                        const rect = card.getBoundingClientRect();
                        const x = (e.clientX - rect.left) / rect.width - 0.5;
                        const y = (e.clientY - rect.top) / rect.height - 0.5;

                        card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-5px)`;
                    });

                    card.addEventListener('mouseleave', () => {
                        card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
                    });
                });
            }

            // =============================================
            // SOCIAL NOTIFICATIONS
            // =============================================
            function initSocialNotifications() {
                if (!CONFIG.socialNotifications) return;

                const notif = document.getElementById('dhpSocialNotif');
                const avatar = document.getElementById('dhpNotifAvatar');
                const text = document.getElementById('dhpNotifText');
                const closeBtn = document.getElementById('dhpNotifClose');

                if (!notif) return;

                const notifications = [
                    { name: 'Maria', city: 'Buenos Aires', guardian: 'Luna', img: 1 },
                    { name: 'Carlos', city: 'Ciudad de Mexico', guardian: 'Bosco', img: 3 },
                    { name: 'Laura', city: 'Montevideo', guardian: 'Amara', img: 5 },
                    { name: 'Andrea', city: 'Madrid', guardian: 'Sol', img: 8 },
                    { name: 'Diego', city: 'Lima', guardian: 'Iris', img: 12 },
                    { name: 'Sofia', city: 'Santiago', guardian: 'Aurora', img: 9 },
                    { name: 'Pablo', city: 'Bogota', guardian: 'Terra', img: 11 }
                ];

                let currentIndex = 0;
                let notifTimeout;

                function showNotification() {
                    const data = notifications[currentIndex];
                    avatar.src = `https://i.pravatar.cc/100?img=${data.img}`;
                    text.innerHTML = `
                        <strong>${data.name} de ${data.city}</strong>
                        adopto a ${data.guardian}
                        <span class="time">Hace ${Math.floor(Math.random() * 10) + 1} min</span>
                    `;

                    notif.classList.add('visible');

                    notifTimeout = setTimeout(() => {
                        notif.classList.remove('visible');
                    }, 5000);

                    currentIndex = (currentIndex + 1) % notifications.length;
                }

                closeBtn.addEventListener('click', () => {
                    clearTimeout(notifTimeout);
                    notif.classList.remove('visible');
                });

                // Primera notificación después de 15 segundos
                setTimeout(() => {
                    showNotification();
                    // Luego cada 45 segundos
                    setInterval(showNotification, 45000);
                }, 15000);
            }

            // =============================================
            // PARALLAX SUTIL
            // =============================================
            function initParallax() {
                if (!CONFIG.parallaxEnabled) return;

                const parallaxElements = document.querySelectorAll('.sec-parallax-break');

                window.addEventListener('scroll', () => {
                    const scrollY = window.scrollY;

                    parallaxElements.forEach(el => {
                        const rect = el.getBoundingClientRect();
                        if (rect.top < window.innerHeight && rect.bottom > 0) {
                            const speed = 0.3;
                            const yPos = (rect.top - window.innerHeight) * speed;
                            el.style.backgroundPositionY = `${yPos}px`;
                        }
                    });
                });
            }

            // =============================================
            // MEJORAS DE CARRUSEL
            // =============================================
            function initCarouselEnhancements() {
                // Agregar barra de progreso a carruseles
                document.querySelectorAll('.dhc-carousel-wrap').forEach(carousel => {
                    const progress = document.createElement('div');
                    progress.className = 'dhp-carousel-progress';
                    carousel.style.position = 'relative';
                    carousel.appendChild(progress);

                    const track = carousel.querySelector('.dhc-track');
                    if (track) {
                        track.addEventListener('scroll', () => {
                            const scrollWidth = track.scrollWidth - track.clientWidth;
                            const scrollLeft = track.scrollLeft;
                            const percent = (scrollLeft / scrollWidth) * 100;
                            progress.style.width = percent + '%';
                        });
                    }
                });
            }

            // =============================================
            // SMOOTH SCROLL PARA ANCHORS
            // =============================================
            function initSmoothScroll() {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function(e) {
                        const targetId = this.getAttribute('href');
                        if (targetId === '#') return;

                        const target = document.querySelector(targetId);
                        if (target) {
                            e.preventDefault();
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    });
                });
            }

            // =============================================
            // LAZY LOADING DE IMÁGENES
            // =============================================
            function initLazyLoading() {
                if ('loading' in HTMLImageElement.prototype) {
                    // Browser soporta lazy loading nativo
                    document.querySelectorAll('img:not([loading])').forEach(img => {
                        img.setAttribute('loading', 'lazy');
                    });
                } else {
                    // Fallback con IntersectionObserver
                    const imageObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                if (img.dataset.src) {
                                    img.src = img.dataset.src;
                                    img.classList.add('loaded');
                                }
                                imageObserver.unobserve(img);
                            }
                        });
                    });

                    document.querySelectorAll('img[data-src]').forEach(img => {
                        img.classList.add('dhp-lazy');
                        imageObserver.observe(img);
                    });
                }
            }

            // =============================================
            // INIT
            // =============================================
            function init() {
                console.log('✨ Duendes Homepage Premium - Iniciando...');

                // Modo test: agregar ?reset=1 a la URL para resetear y ver intro de nuevo
                if (window.location.search.includes('reset=1')) {
                    sessionStorage.removeItem('dhp-intro-seen');
                    localStorage.removeItem('dhp-user-country');
                    localStorage.removeItem('dhp-user-currency');
                    console.log('🔄 Reset: Intro y geolocalización reiniciados');
                    // Limpiar URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

                // Cursor siempre se inicia
                initCursor();

                // Intro maneja su propio flujo → geo modal → scroll animations
                initIntro();

                // Estos se pueden iniciar inmediatamente
                initMagneticButtons();
                initTiltCards();
                initSocialNotifications();
                initParallax();
                initCarouselEnhancements();
                initSmoothScroll();
                initLazyLoading();

                console.log('✨ Duendes Homepage Premium - Cargado');
            }

            // Ejecutar cuando el DOM esté listo
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

new Duendes_Homepage_Premium();
