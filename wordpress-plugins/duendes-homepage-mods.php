<?php
/**
 * Plugin Name: Duendes Homepage Modifications
 * Description: Oculta Grimorio y muestra Banner del Círculo con neuromarketing
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

add_action('wp_head', 'duendes_homepage_styles');

function duendes_homepage_styles() {
    if (!is_front_page()) return;
?>
<style>
/* Ocultar Grimorio en Home */
.grimorio-home,
[class*="grimorio"],
.elementor-element-75421c2 {
    display: none !important;
}

/* ═══════════════════════════════════════════════════════════════════
   BANNER DEL CÍRCULO - INVITACIÓN PODEROSA
═══════════════════════════════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.circulo-banner {
    background: linear-gradient(180deg, #0a0a0a 0%, #0d1117 50%, #0a0a0a 100%);
    padding: 80px 20px;
    position: relative;
    overflow: hidden;
}

.circulo-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 600px 400px at 20% 30%, rgba(198, 169, 98, 0.08) 0%, transparent 70%),
        radial-gradient(ellipse 500px 300px at 80% 70%, rgba(198, 169, 98, 0.06) 0%, transparent 70%);
    pointer-events: none;
}

/* Orbes flotantes */
.circulo-banner .cb-orbe {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(198, 169, 98, 0.3) 0%, transparent 70%);
    filter: blur(30px);
    animation: floatOrbe 8s ease-in-out infinite;
}

.cb-orbe-1 { width: 200px; height: 200px; top: 10%; left: 5%; animation-delay: 0s; }
.cb-orbe-2 { width: 150px; height: 150px; top: 60%; right: 10%; animation-delay: 2s; }
.cb-orbe-3 { width: 100px; height: 100px; bottom: 20%; left: 30%; animation-delay: 4s; }

@keyframes floatOrbe {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
    50% { transform: translate(20px, -20px) scale(1.1); opacity: 0.8; }
}

.circulo-banner-inner {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 2;
}

.cb-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(198, 169, 98, 0.1);
    border: 1px solid rgba(198, 169, 98, 0.3);
    padding: 8px 20px;
    border-radius: 50px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #C6A962;
    margin-bottom: 30px;
}

.cb-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 600;
    color: #fff;
    margin: 0 0 20px 0;
    line-height: 1.2;
}

.cb-title span {
    color: #C6A962;
    display: block;
}

.cb-subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    color: rgba(255,255,255,0.8);
    margin: 0 0 40px 0;
    font-style: italic;
    line-height: 1.6;
}

/* Beneficios */
.cb-benefits {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-bottom: 50px;
}

.cb-benefit {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(198, 169, 98, 0.2);
    padding: 12px 20px;
    border-radius: 30px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    color: rgba(255,255,255,0.9);
}

.cb-benefit-icon {
    font-size: 18px;
}

/* CTA */
.cb-cta-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.cb-cta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 18px 40px;
    background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
    border: none;
    border-radius: 50px;
    font-family: 'Cinzel', serif;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #0a0a0a;
    text-decoration: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
    box-shadow:
        0 10px 30px rgba(198, 169, 98, 0.3),
        0 0 40px rgba(198, 169, 98, 0.1);
}

.cb-cta::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #C6A962, #fff, #C6A962, #fff);
    background-size: 400% 400%;
    border-radius: 52px;
    z-index: -1;
    animation: shimmer 3s ease infinite;
    opacity: 0;
    transition: opacity 0.3s;
}

.cb-cta:hover::before {
    opacity: 1;
}

.cb-cta:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow:
        0 15px 40px rgba(198, 169, 98, 0.4),
        0 0 60px rgba(198, 169, 98, 0.2);
}

@keyframes shimmer {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.cb-guarantee {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px;
    color: rgba(255,255,255,0.5);
}

.cb-guarantee span {
    color: #C6A962;
}

/* Urgencia */
.cb-urgency {
    margin-top: 40px;
    padding: 20px 30px;
    background: rgba(198, 169, 98, 0.08);
    border: 1px solid rgba(198, 169, 98, 0.2);
    border-radius: 16px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.cb-urgency-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    color: rgba(255,255,255,0.9);
    margin: 0;
}

.cb-urgency-text strong {
    color: #C6A962;
}

@media (max-width: 768px) {
    .circulo-banner { padding: 60px 15px; }
    .cb-benefits { flex-direction: column; align-items: center; }
    .cb-cta { padding: 16px 30px; font-size: 14px; }
}
</style>
<?php
}

add_action('wp_footer', 'duendes_circulo_banner_html');

function duendes_circulo_banner_html() {
    if (!is_front_page()) return;

    // Calcular miembros (número realista que aumenta)
    $base_members = 127;
    $days_since_launch = floor((time() - strtotime('2024-01-01')) / 86400);
    $growth_rate = 0.3; // ~1 cada 3 días
    $total_members = $base_members + floor($days_since_launch * $growth_rate);
?>
<script>
(function() {
    'use strict';

    // Esperar a que el DOM esté listo
    function insertBanner() {
        // Buscar el grimorio y ocultarlo
        const grimorio = document.querySelector('.grimorio-home') ||
                        document.querySelector('[class*="grimorio"]') ||
                        document.querySelector('.elementor-element-75421c2');

        if (grimorio) {
            grimorio.style.display = 'none';

            // Insertar banner del Círculo después del grimorio
            const banner = document.createElement('div');
            banner.className = 'circulo-banner';
            banner.innerHTML = `
                <div class="cb-orbe cb-orbe-1"></div>
                <div class="cb-orbe cb-orbe-2"></div>
                <div class="cb-orbe cb-orbe-3"></div>

                <div class="circulo-banner-inner">
                    <div class="cb-badge">✨ Para quienes quieren más ✨</div>

                    <h2 class="cb-title">
                        Esto no termina acá.
                        <span>El Círculo</span>
                    </h2>

                    <p class="cb-subtitle">
                        Si sentís que necesitás más que un guardián.<br>
                        Rituales cada semana. Guía constante. Comunidad que entiende.
                    </p>

                    <div class="cb-benefits">
                        <div class="cb-benefit">
                            <span class="cb-benefit-icon">🌙</span>
                            <span>Rituales cada semana</span>
                        </div>
                        <div class="cb-benefit">
                            <span class="cb-benefit-icon">📜</span>
                            <span>Tiradas personales</span>
                        </div>
                        <div class="cb-benefit">
                            <span class="cb-benefit-icon">🍀</span>
                            <span>25 runas gratis/mes</span>
                        </div>
                        <div class="cb-benefit">
                            <span class="cb-benefit-icon">🎁</span>
                            <span>Descuentos exclusivos</span>
                        </div>
                    </div>

                    <div class="cb-cta-wrap">
                        <a href="/circulo/" class="cb-cta">
                            🔮 Quiero entrar al Círculo
                        </a>
                        <p class="cb-guarantee">
                            <span><?php echo $total_members; ?> personas</span> ya encontraron su lugar • Sin compromiso
                        </p>
                    </div>

                    <div class="cb-urgency">
                        <p class="cb-urgency-text">
                            🌟 <strong>No es para cualquiera.</strong>
                            Es para quienes saben que hay algo más allá de lo visible.
                            Para las que buscan respuestas que otros no dan.
                        </p>
                    </div>
                </div>
            `;

            grimorio.parentNode.insertBefore(banner, grimorio.nextSibling);
        }
    }

    // Ejecutar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertBanner);
    } else {
        insertBanner();
    }
})();
</script>
<?php
}
?>
