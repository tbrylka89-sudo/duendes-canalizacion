<?php
/**
 * Plugin Name: Duendes Homepage Copy Optimization
 * Description: Mejoras sutiles de copy para conversión - NO reemplaza contenido, solo optimiza textos existentes
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

class Duendes_Homepage_Copy {

    public function __construct() {
        add_action('wp_footer', [$this, 'add_copy_optimizations'], 100);
    }

    public function add_copy_optimizations() {
        if (!is_front_page()) return;
        ?>
        <script id="duendes-copy-optimizations">
        (function() {
            'use strict';

            // =============================================
            // COPY OPTIMIZATION - NON-DESTRUCTIVE
            // Solo mejora textos existentes, no reemplaza secciones
            // =============================================

            // Esperar a que el DOM esté listo
            function init() {
                console.log('✨ Duendes Copy Optimization - Iniciando...');

                // 1. SOCIAL PROOF - Agregar contador sutil si hay espacio
                addSocialProofBadge();

                // 2. ESCASEZ - Recordar que cada guardián es único
                addScarcityReminder();

                // 3. TRUST SIGNALS - Mejorar señales de confianza existentes
                enhanceTrustSignals();

                console.log('✨ Duendes Copy Optimization - Completado');
            }

            // =============================================
            // 1. SOCIAL PROOF BADGE
            // Agrega un badge sutil con número de guardianes adoptados
            // =============================================
            function addSocialProofBadge() {
                // Buscar el hero o área principal
                const hero = document.querySelector('.video-hero, .elementor-section-wrap > section:first-child');
                if (!hero) return;

                // Verificar si ya existe
                if (document.getElementById('dhp-social-proof-badge')) return;

                // Crear badge sutil
                const badge = document.createElement('div');
                badge.id = 'dhp-social-proof-badge';
                badge.innerHTML = `
                    <span class="dhp-spb-icon">✨</span>
                    <span class="dhp-spb-text">
                        <strong>+3,500</strong> guardianes encontraron hogar
                    </span>
                `;

                // Estilos inline para el badge
                badge.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: rgba(10, 10, 10, 0.95);
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    padding: 12px 18px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 9998;
                    font-family: 'Cormorant Garamond', Georgia, serif;
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(10px);
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.5s ease, transform 0.5s ease;
                    max-width: 280px;
                `;

                // Estilo del icono
                const icon = badge.querySelector('.dhp-spb-icon');
                if (icon) {
                    icon.style.cssText = `
                        font-size: 1.2rem;
                    `;
                }

                // Estilo del strong
                const strong = badge.querySelector('strong');
                if (strong) {
                    strong.style.cssText = `
                        color: #d4af37;
                        font-weight: 600;
                    `;
                }

                document.body.appendChild(badge);

                // Mostrar después de 5 segundos de scroll
                let hasScrolled = false;
                let shown = false;

                window.addEventListener('scroll', function() {
                    if (!hasScrolled && window.scrollY > 300) {
                        hasScrolled = true;

                        setTimeout(() => {
                            if (!shown) {
                                badge.style.opacity = '1';
                                badge.style.transform = 'translateY(0)';
                                shown = true;

                                // Ocultar después de 8 segundos
                                setTimeout(() => {
                                    badge.style.opacity = '0';
                                    badge.style.transform = 'translateY(20px)';
                                }, 8000);
                            }
                        }, 2000);
                    }
                });

                // Mobile: posicionar diferente
                if (window.innerWidth < 768) {
                    badge.style.right = '10px';
                    badge.style.left = '10px';
                    badge.style.maxWidth = 'none';
                }
            }

            // =============================================
            // 2. ESCASEZ REMINDER
            // Agrega tooltip sutil en cards de productos
            // =============================================
            function addScarcityReminder() {
                // Buscar cards de productos
                const productCards = document.querySelectorAll('.dhc-card, .product-card, .woocommerce-loop-product');

                productCards.forEach(card => {
                    // No agregar si ya tiene
                    if (card.querySelector('.dhp-scarcity-tag')) return;

                    const tag = document.createElement('div');
                    tag.className = 'dhp-scarcity-tag';
                    tag.innerHTML = 'Pieza única';

                    tag.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: rgba(10, 10, 10, 0.9);
                        border: 1px solid rgba(212, 175, 55, 0.4);
                        padding: 4px 10px;
                        font-family: 'Cinzel', serif;
                        font-size: 0.65rem;
                        letter-spacing: 0.1em;
                        color: #d4af37;
                        text-transform: uppercase;
                        z-index: 10;
                    `;

                    // Solo agregar si la card tiene position relative o absolute
                    const cardPosition = window.getComputedStyle(card).position;
                    if (cardPosition === 'static') {
                        card.style.position = 'relative';
                    }

                    card.appendChild(tag);
                });
            }

            // =============================================
            // 3. TRUST SIGNALS
            // Mejora las señales de confianza existentes
            // =============================================
            function enhanceTrustSignals() {
                // Buscar sección de envíos/confianza
                const trustSections = document.querySelectorAll('[class*="envio"], [class*="shipping"], [class*="garantia"], [class*="trust"]');

                trustSections.forEach(section => {
                    // Agregar micro-animación de atención
                    section.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

                    section.addEventListener('mouseenter', () => {
                        section.style.transform = 'translateY(-2px)';
                        section.style.boxShadow = '0 5px 20px rgba(212, 175, 55, 0.1)';
                    });

                    section.addEventListener('mouseleave', () => {
                        section.style.transform = 'translateY(0)';
                        section.style.boxShadow = 'none';
                    });
                });

                // Agregar indicador de seguridad en checkout links
                const checkoutLinks = document.querySelectorAll('a[href*="checkout"], a[href*="cart"], .add_to_cart_button');

                checkoutLinks.forEach(link => {
                    // Agregar title con mensaje de confianza
                    if (!link.title) {
                        link.title = 'Compra 100% segura - Envío cuidado a todo el mundo';
                    }
                });
            }

            // =============================================
            // INIT
            // =============================================
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                // Esperar un poco para que Elementor cargue todo
                setTimeout(init, 1000);
            }

        })();
        </script>
        <?php
    }
}

new Duendes_Homepage_Copy();
