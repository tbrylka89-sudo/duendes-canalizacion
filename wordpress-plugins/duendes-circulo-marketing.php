<?php
/**
 * Plugin Name: Duendes - Círculo Marketing HTMLs
 * Description: Shortcodes para las secciones de marketing del Círculo de Duendes
 * Version: 3.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════════
// SHORTCODE: [circulo_seccion_home]
// Sección para insertar en el homepage - CENTRADO EN DUENDES
// ═══════════════════════════════════════════════════════════════════════════════
add_shortcode('circulo_seccion_home', function() {
    ob_start();
    ?>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Tangerine:wght@400;700&display=swap');

.sec-circulo-nuevo * {
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
}

.sec-circulo-nuevo {
    --black: #0a0a0a;
    --black-deep: #050508;
    --gold: #d4af37;
    --gold-light: #e8d5a3;
    --gold-dark: #b8972e;
    --gold-glow: rgba(212, 175, 55, 0.5);
    --purple: #6b21a8;
    --purple-light: #7c3aed;
    --purple-glow: rgba(107, 33, 168, 0.4);
    --green: #166534;
    --blue: #1e40af;
    --orange: #c2410c;
    --white: #ffffff;
    font-family: 'Cormorant Garamond', Georgia, serif !important;
    width: 100% !important;
}

@keyframes secCirculoOrbitalFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-10px) rotate(2deg); }
    75% { transform: translateY(10px) rotate(-2deg); }
}

@keyframes secCirculoPortalPulse {
    0%, 100% { box-shadow: 0 0 30px var(--gold-glow), inset 0 0 30px rgba(212, 175, 55, 0.1); }
    50% { box-shadow: 0 0 60px var(--gold-glow), 0 0 90px var(--purple-glow), inset 0 0 50px rgba(212, 175, 55, 0.15); }
}

@keyframes secCirculoStarFloat {
    0%, 100% { opacity: 0.3; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(-5px); }
}

@keyframes secCirculoRuneGlow {
    0%, 100% { text-shadow: 0 0 20px var(--gold-glow); }
    50% { text-shadow: 0 0 40px var(--gold-glow), 0 0 60px var(--purple-glow); }
}

@keyframes secCirculoLineExpand {
    0%, 100% { width: 60px; opacity: 0.5; }
    50% { width: 120px; opacity: 1; }
}

.circulo-nuevo-section {
    background:
        radial-gradient(ellipse at 20% 0%, rgba(107, 33, 168, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 50%, rgba(22, 101, 52, 0.05) 0%, transparent 60%),
        linear-gradient(180deg, var(--black) 0%, var(--black-deep) 50%, var(--black) 100%) !important;
    padding: 140px 40px !important;
    position: relative !important;
    overflow: hidden !important;
}

.circulo-stars {
    position: absolute !important;
    inset: 0 !important;
    pointer-events: none !important;
}

.sec-circulo-nuevo .star {
    position: absolute !important;
    width: 3px !important;
    height: 3px !important;
    background: var(--gold) !important;
    border-radius: 50% !important;
    animation: secCirculoStarFloat 4s ease-in-out infinite !important;
}

.sec-circulo-nuevo .star:nth-child(1) { top: 5%; left: 10%; animation-delay: 0s; }
.sec-circulo-nuevo .star:nth-child(2) { top: 12%; left: 40%; animation-delay: 0.5s; width: 2px !important; height: 2px !important; }
.sec-circulo-nuevo .star:nth-child(3) { top: 8%; right: 15%; animation-delay: 1s; }
.sec-circulo-nuevo .star:nth-child(4) { top: 30%; left: 5%; animation-delay: 1.5s; width: 4px !important; height: 4px !important; }
.sec-circulo-nuevo .star:nth-child(5) { top: 45%; right: 8%; animation-delay: 2s; }
.sec-circulo-nuevo .star:nth-child(6) { top: 65%; left: 25%; animation-delay: 2.5s; width: 2px !important; height: 2px !important; }
.sec-circulo-nuevo .star:nth-child(7) { top: 75%; right: 30%; animation-delay: 3s; }
.sec-circulo-nuevo .star:nth-child(8) { bottom: 20%; left: 12%; animation-delay: 0.8s; }
.sec-circulo-nuevo .star:nth-child(9) { bottom: 10%; right: 20%; animation-delay: 1.8s; width: 4px !important; height: 4px !important; }
.sec-circulo-nuevo .star:nth-child(10) { top: 55%; left: 60%; animation-delay: 2.2s; }

.circulo-container {
    max-width: 1300px !important;
    margin: 0 auto !important;
    position: relative !important;
    z-index: 2 !important;
}

.circulo-header {
    text-align: center !important;
    margin-bottom: 80px !important;
}

.circulo-runa {
    font-size: 50px !important;
    color: var(--gold) !important;
    display: block !important;
    margin-bottom: 25px !important;
    animation: secCirculoRuneGlow 3s ease-in-out infinite !important;
}

.circulo-badge {
    display: inline-flex !important;
    align-items: center !important;
    gap: 12px !important;
    background: linear-gradient(135deg, rgba(107, 33, 168, 0.2), rgba(212, 175, 55, 0.1)) !important;
    border: 1px solid rgba(212, 175, 55, 0.35) !important;
    padding: 12px 28px !important;
    border-radius: 50px !important;
    margin-bottom: 30px !important;
}

.circulo-badge svg {
    width: 18px !important;
    height: 18px !important;
    fill: var(--gold) !important;
}

.circulo-badge-text {
    font-family: 'Cinzel', serif !important;
    font-size: 11px !important;
    letter-spacing: 4px !important;
    text-transform: uppercase !important;
    color: var(--gold) !important;
}

.circulo-title {
    font-family: 'Tangerine', cursive !important;
    font-size: clamp(55px, 12vw, 100px) !important;
    font-weight: 700 !important;
    color: var(--white) !important;
    line-height: 1 !important;
    margin-bottom: 25px !important;
}

.circulo-title span {
    background: linear-gradient(135deg, var(--gold), var(--gold-light), var(--gold)) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
}

.circulo-subtitle {
    font-size: clamp(18px, 2.5vw, 24px) !important;
    font-style: italic !important;
    color: rgba(255, 255, 255, 0.75) !important;
    max-width: 850px !important;
    margin: 0 auto 20px !important;
    line-height: 1.7 !important;
}

.circulo-hook {
    font-family: 'Cinzel', serif !important;
    font-size: 15px !important;
    color: var(--gold) !important;
    letter-spacing: 1px !important;
}

.header-line {
    width: 80px !important;
    height: 2px !important;
    background: linear-gradient(90deg, transparent, var(--gold), transparent) !important;
    margin: 35px auto 0 !important;
    animation: secCirculoLineExpand 4s ease-in-out infinite !important;
}

.portales-section {
    margin-bottom: 80px !important;
}

.portales-intro {
    text-align: center !important;
    margin-bottom: 50px !important;
}

.portales-intro h3 {
    font-family: 'Cinzel', serif !important;
    font-size: 14px !important;
    letter-spacing: 4px !important;
    text-transform: uppercase !important;
    color: var(--gold) !important;
    margin-bottom: 15px !important;
}

.portales-intro p {
    font-size: 18px !important;
    color: rgba(255, 255, 255, 0.6) !important;
    max-width: 750px !important;
    margin: 0 auto !important;
}

.portales-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 25px !important;
}

.portal-card {
    background: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 25px !important;
    padding: 35px 25px !important;
    text-align: center !important;
    position: relative !important;
    overflow: hidden !important;
    transition: all 0.5s ease !important;
}

.portal-card::before {
    content: '' !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    height: 4px !important;
    background: var(--portal-color, var(--gold)) !important;
    opacity: 0.7 !important;
}

.portal-card:hover {
    transform: translateY(-10px) !important;
    border-color: var(--portal-color, var(--gold)) !important;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3) !important;
}

.portal-card.yule { --portal-color: #1e40af; }
.portal-card.ostara { --portal-color: #166534; }
.portal-card.litha { --portal-color: #c2410c; }
.portal-card.mabon { --portal-color: #6b21a8; }

.portal-icon {
    width: 60px !important;
    height: 60px !important;
    margin: 0 auto 20px !important;
    background: rgba(255, 255, 255, 0.05) !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    animation: secCirculoOrbitalFloat 6s ease-in-out infinite !important;
}

.portal-icon svg {
    width: 28px !important;
    height: 28px !important;
    fill: var(--portal-color, var(--gold)) !important;
}

.portal-nombre {
    font-family: 'Cinzel', serif !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    color: var(--white) !important;
    margin-bottom: 8px !important;
}

.portal-fecha {
    font-size: 13px !important;
    color: var(--portal-color, var(--gold)) !important;
    margin-bottom: 12px !important;
}

.portal-energia {
    font-size: 14px !important;
    font-style: italic !important;
    color: rgba(255, 255, 255, 0.6) !important;
    line-height: 1.6 !important;
}

.planes-section {
    margin-bottom: 80px !important;
}

.planes-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 35px !important;
    max-width: 900px !important;
    margin: 0 auto !important;
}

.plan-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01)) !important;
    border: 1px solid rgba(212, 175, 55, 0.2) !important;
    border-radius: 30px !important;
    padding: 45px 40px !important;
    position: relative !important;
    transition: all 0.4s ease !important;
}

.plan-card:hover {
    border-color: rgba(212, 175, 55, 0.5) !important;
    transform: translateY(-5px) !important;
}

.plan-card.destacado {
    border-color: var(--gold) !important;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(107, 33, 168, 0.05)) !important;
    animation: secCirculoPortalPulse 5s ease-in-out infinite !important;
}

.plan-destacado-badge {
    position: absolute !important;
    top: -12px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    background: linear-gradient(135deg, var(--gold), var(--gold-dark)) !important;
    color: var(--black) !important;
    font-family: 'Cinzel', serif !important;
    font-size: 10px !important;
    font-weight: 600 !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
    padding: 8px 25px !important;
    border-radius: 20px !important;
}

.plan-header {
    text-align: center !important;
    margin-bottom: 30px !important;
}

.plan-nombre {
    font-family: 'Cinzel', serif !important;
    font-size: 24px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    margin-bottom: 8px !important;
}

.plan-duracion {
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.5) !important;
}

.plan-precio {
    text-align: center !important;
    margin-bottom: 30px !important;
    padding: 25px 0 !important;
    border-top: 1px solid rgba(212, 175, 55, 0.15) !important;
    border-bottom: 1px solid rgba(212, 175, 55, 0.15) !important;
}

.precio-valor {
    font-family: 'Cinzel', serif !important;
    font-size: 48px !important;
    font-weight: 700 !important;
    color: var(--gold) !important;
}

.precio-moneda {
    font-size: 20px !important;
    vertical-align: top !important;
    color: var(--gold-light) !important;
}

.precio-periodo {
    display: block !important;
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.5) !important;
    margin-top: 5px !important;
}

.precio-pago-unico {
    display: inline-block !important;
    background: rgba(212, 175, 55, 0.2) !important;
    color: var(--gold) !important;
    font-family: 'Cinzel', serif !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
    padding: 8px 20px !important;
    border-radius: 20px !important;
    margin-top: 12px !important;
}

.precio-mensual {
    font-size: 13px !important;
    color: rgba(212, 175, 55, 0.8) !important;
    margin-top: 10px !important;
}

.plan-beneficios {
    margin-bottom: 30px !important;
}

.beneficio-item {
    display: flex !important;
    align-items: flex-start !important;
    gap: 12px !important;
    margin-bottom: 15px !important;
}

.beneficio-check {
    width: 20px !important;
    height: 20px !important;
    flex-shrink: 0 !important;
    margin-top: 2px !important;
}

.beneficio-check svg {
    width: 100% !important;
    height: 100% !important;
    fill: var(--gold) !important;
}

.beneficio-texto {
    font-size: 15px !important;
    color: rgba(255, 255, 255, 0.75) !important;
    line-height: 1.5 !important;
}

.plan-cta {
    text-align: center !important;
}

.btn-plan {
    display: inline-block !important;
    width: 100% !important;
    padding: 18px 30px !important;
    border-radius: 50px !important;
    font-family: 'Cinzel', serif !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
    text-decoration: none !important;
    text-align: center !important;
    transition: all 0.4s ease !important;
    cursor: pointer !important;
}

.btn-plan-secundario {
    background: transparent !important;
    border: 2px solid var(--gold) !important;
    color: var(--gold) !important;
}

.btn-plan-secundario:hover {
    background: rgba(212, 175, 55, 0.1) !important;
}

.btn-plan-primario {
    background: linear-gradient(135deg, var(--gold), var(--gold-dark)) !important;
    border: none !important;
    color: var(--black) !important;
    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3) !important;
}

.btn-plan-primario:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 15px 40px rgba(212, 175, 55, 0.4) !important;
}

.incluye-section {
    margin-bottom: 80px !important;
}

.incluye-header {
    text-align: center !important;
    margin-bottom: 50px !important;
}

.incluye-header h3 {
    font-family: 'Cinzel', serif !important;
    font-size: 14px !important;
    letter-spacing: 4px !important;
    text-transform: uppercase !important;
    color: var(--gold) !important;
    margin-bottom: 15px !important;
}

.incluye-header p {
    font-size: 20px !important;
    font-style: italic !important;
    color: rgba(255, 255, 255, 0.6) !important;
}

.incluye-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 30px !important;
}

.incluye-card {
    background: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 20px !important;
    padding: 35px 28px !important;
    text-align: center !important;
    transition: all 0.4s ease !important;
}

.incluye-card:hover {
    border-color: rgba(212, 175, 55, 0.3) !important;
    transform: translateY(-5px) !important;
}

.incluye-icon {
    width: 55px !important;
    height: 55px !important;
    margin: 0 auto 20px !important;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(107, 33, 168, 0.1)) !important;
    border-radius: 15px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.incluye-icon svg {
    width: 26px !important;
    height: 26px !important;
    fill: var(--gold) !important;
}

.incluye-card h4 {
    font-family: 'Cinzel', serif !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    color: var(--white) !important;
    margin-bottom: 12px !important;
}

.incluye-card p {
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.55) !important;
    line-height: 1.6 !important;
}

.circulo-cta-final {
    text-align: center !important;
    padding: 60px 40px !important;
    background: linear-gradient(135deg, rgba(107, 33, 168, 0.1), rgba(212, 175, 55, 0.05)) !important;
    border: 1px solid rgba(212, 175, 55, 0.2) !important;
    border-radius: 30px !important;
}

.cta-texto {
    font-size: 22px !important;
    font-style: italic !important;
    color: rgba(255, 255, 255, 0.8) !important;
    max-width: 650px !important;
    margin: 0 auto 30px !important;
    line-height: 1.6 !important;
}

.cta-texto strong {
    color: var(--gold) !important;
}

.btn-cta-final {
    display: inline-flex !important;
    align-items: center !important;
    gap: 15px !important;
    background: linear-gradient(135deg, var(--gold), var(--gold-dark)) !important;
    color: var(--black) !important;
    font-family: 'Cinzel', serif !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    letter-spacing: 3px !important;
    text-transform: uppercase !important;
    text-decoration: none !important;
    padding: 22px 50px !important;
    border-radius: 60px !important;
    transition: all 0.4s ease !important;
    box-shadow: 0 15px 45px rgba(212, 175, 55, 0.35) !important;
}

.btn-cta-final:hover {
    transform: translateY(-5px) scale(1.02) !important;
    box-shadow: 0 25px 60px rgba(212, 175, 55, 0.5) !important;
}

.btn-cta-final svg {
    width: 20px !important;
    height: 20px !important;
    fill: var(--black) !important;
}

.cta-nota {
    margin-top: 25px !important;
    font-size: 13px !important;
    color: rgba(255, 255, 255, 0.4) !important;
}

@media (max-width: 1100px) {
    .portales-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .incluye-grid { grid-template-columns: repeat(2, 1fr) !important; }
}

@media (max-width: 768px) {
    .circulo-nuevo-section { padding: 100px 25px !important; }
    .circulo-header { margin-bottom: 60px !important; }
    .circulo-runa { font-size: 40px !important; }
    .circulo-title { font-size: 55px !important; }
    .circulo-subtitle { font-size: 18px !important; }
    .portales-grid { grid-template-columns: 1fr !important; max-width: 400px !important; margin: 0 auto !important; }
    .portal-card { padding: 30px 25px !important; }
    .planes-grid { grid-template-columns: 1fr !important; max-width: 450px !important; }
    .plan-card { padding: 40px 30px !important; }
    .incluye-grid { grid-template-columns: 1fr !important; max-width: 400px !important; margin: 0 auto !important; }
    .circulo-cta-final { padding: 45px 25px !important; }
    .cta-texto { font-size: 18px !important; }
    .btn-cta-final { padding: 18px 40px !important; font-size: 12px !important; }
}

@media (max-width: 480px) {
    .circulo-nuevo-section { padding: 70px 18px !important; }
    .circulo-badge { padding: 10px 20px !important; }
    .circulo-badge-text { font-size: 9px !important; }
    .circulo-title { font-size: 42px !important; }
    .header-line { display: none !important; }
    .precio-valor { font-size: 40px !important; }
    .btn-plan { padding: 16px 25px !important; font-size: 11px !important; }
    .btn-cta-final { width: 100% !important; justify-content: center !important; }
}
</style>

<div class="sec-circulo-nuevo">
    <section class="circulo-nuevo-section">

        <div class="circulo-stars">
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
        </div>

        <div class="circulo-container">

            <div class="circulo-header">
                <span class="circulo-runa">&#5765;</span>
                <div class="circulo-badge">
                    <svg viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>
                    <span class="circulo-badge-text">El Primer Portal de Duendes</span>
                </div>
                <h2 class="circulo-title">El <span>Círculo de Duendes</span></h2>
                <p class="circulo-subtitle">
                    El único lugar del mundo donde los duendes enseñan directamente.
                    Cada semana, un guardián diferente comparte su sabiduría: cristales, tarot, astrología,
                    rituales, meditaciones, ciclos lunares, herbología y todo lo que solo ellos conocen.
                </p>
                <p class="circulo-hook">No aprendés sobre duendes. Aprendés de ellos.</p>
                <div class="header-line"></div>
            </div>

            <div class="portales-section">
                <div class="portales-intro">
                    <h3>Los 4 Ciclos del Guardián</h3>
                    <p>Los duendes siguen el ritmo de la naturaleza. Cuatro estaciones, cuatro energías, cuatro formas diferentes de conectar con su sabiduría ancestral.</p>
                </div>

                <div class="portales-grid">
                    <div class="portal-card yule">
                        <div class="portal-icon">
                            <svg viewBox="0 0 24 24"><path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"/></svg>
                        </div>
                        <h4 class="portal-nombre">Ciclo de Yule</h4>
                        <span class="portal-fecha">Junio - Agosto</span>
                        <p class="portal-energia">Duendes de la sombra y la introspección. Guardianes del silencio interior.</p>
                    </div>

                    <div class="portal-card ostara">
                        <div class="portal-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 3.12 13.38 2 12 2S9.5 3.12 9.5 4.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25z"/></svg>
                        </div>
                        <h4 class="portal-nombre">Ciclo de Ostara</h4>
                        <span class="portal-fecha">Septiembre - Noviembre</span>
                        <p class="portal-energia">Duendes del despertar y los nuevos comienzos. Maestros de las semillas.</p>
                    </div>

                    <div class="portal-card litha">
                        <div class="portal-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>
                        </div>
                        <h4 class="portal-nombre">Ciclo de Litha</h4>
                        <span class="portal-fecha">Diciembre - Febrero</span>
                        <p class="portal-energia">Duendes del fuego y la abundancia. Guardianes del poder pleno.</p>
                    </div>

                    <div class="portal-card mabon">
                        <div class="portal-icon">
                            <svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>
                        </div>
                        <h4 class="portal-nombre">Ciclo de Mabon</h4>
                        <span class="portal-fecha">Marzo - Mayo</span>
                        <p class="portal-energia">Duendes de la cosecha y la gratitud. Maestros del soltar.</p>
                    </div>
                </div>
            </div>

            <div class="planes-section">
                <div class="planes-grid">
                    <div class="plan-card">
                        <div class="plan-header">
                            <h3 class="plan-nombre">Medio Año con Duendes</h3>
                            <span class="plan-duracion">6 meses de sabiduría</span>
                        </div>
                        <div class="plan-precio">
                            <span class="precio-valor"><span class="precio-moneda">$</span>49<sup>.99</sup></span>
                            <span class="precio-periodo">USD - 6 meses de acceso</span>
                            <span class="precio-pago-unico">Pago único</span>
                            <p class="precio-mensual">Equivale a $8.33 por mes</p>
                        </div>
                        <div class="plan-beneficios">
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">Un duende diferente cada semana</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">Rituales, meditaciones, tarot y DIY</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">Foro privado del Círculo</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">2 ciclos estacionales completos</span>
                            </div>
                        </div>
                        <div class="plan-cta">
                            <a href="/circulo-de-duendes/?plan=semestral" class="btn-plan btn-plan-secundario">Comenzar</a>
                        </div>
                    </div>

                    <div class="plan-card destacado">
                        <span class="plan-destacado-badge">Ciclo Completo</span>
                        <div class="plan-header">
                            <h3 class="plan-nombre">Un Año con los Guardianes</h3>
                            <span class="plan-duracion">1 año completo de magia</span>
                        </div>
                        <div class="plan-precio">
                            <span class="precio-valor"><span class="precio-moneda">$</span>79<sup>.99</sup></span>
                            <span class="precio-periodo">USD - 1 año de acceso</span>
                            <span class="precio-pago-unico">Pago único</span>
                            <p class="precio-mensual">Solo $6.67 por mes - Ahorrás 20%</p>
                        </div>
                        <div class="plan-beneficios">
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">Cada semana un guardián diferente te enseña</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">Los 4 ciclos estacionales completos</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">10% descuento en adopciones</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">Conocé nuevos guardianes antes que nadie</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">Regalo sorpresa de aniversario</span>
                            </div>
                        </div>
                        <div class="plan-cta">
                            <a href="/circulo-de-duendes/?plan=anual" class="btn-plan btn-plan-primario">Entrar al Círculo</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="incluye-section">
                <div class="incluye-header">
                    <h3>Cada Semana, Un Duende Diferente</h3>
                    <p>Esto es lo que te enseña cada guardián cuando es su turno</p>
                </div>

                <div class="incluye-grid">
                    <div class="incluye-card">
                        <div class="incluye-icon">
                            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                        </div>
                        <h4>Sabiduría del Guardián</h4>
                        <p>Cristales, hierbas, astrología, tarot, ciclos lunares y los secretos que solo ese duende conoce.</p>
                    </div>

                    <div class="incluye-card">
                        <div class="incluye-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                        </div>
                        <h4>Meditación con el Duende</h4>
                        <p>Un viaje guiado con la energía del guardián. Te lleva a su mundo para que experimentes su magia.</p>
                    </div>

                    <div class="incluye-card">
                        <div class="incluye-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        </div>
                        <h4>Ritual del Guardián</h4>
                        <p>Una práctica que el duende te guía paso a paso. Algo que podés hacer en tu casa con lo que tengas.</p>
                    </div>

                    <div class="incluye-card">
                        <div class="incluye-icon">
                            <svg viewBox="0 0 24 24"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>
                        </div>
                        <h4>Foro de Guardianes</h4>
                        <p>Un espacio donde compartir con otros que también viven con duendes. Fotos de altares, experiencias, preguntas.</p>
                    </div>

                    <div class="incluye-card">
                        <div class="incluye-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/></svg>
                        </div>
                        <h4>DIY del Duende</h4>
                        <p>Creá algo inspirado en el guardián de la semana. Bolsitas, amuletos, decoraciones para su altar.</p>
                    </div>

                    <div class="incluye-card">
                        <div class="incluye-icon">
                            <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                        </div>
                        <h4>Duende del Día</h4>
                        <p>Cada vez que entrás, un guardián diferente te saluda con un mensaje único. Nunca sabés quién te espera.</p>
                    </div>
                </div>
            </div>

            <div class="circulo-cta-final">
                <p class="cta-texto">
                    Este es el <strong>único lugar del mundo</strong> donde los duendes comparten su sabiduría directamente.
                    No existe otro portal así. Y los guardianes ya saben que estás acá.
                </p>
                <a href="/circulo-de-duendes" class="btn-cta-final">
                    <svg viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>
                    Entrar al Círculo
                </a>
                <p class="cta-nota">Pagás una vez, accedés todo el período. Sin renovación automática.</p>
            </div>

        </div>
    </section>
</div>
    <?php
    return ob_get_clean();
});


// ═══════════════════════════════════════════════════════════════════════════════
// SHORTCODE: [circulo_pagina_completa]
// Landing page completa del Círculo de Duendes
// ═══════════════════════════════════════════════════════════════════════════════
add_shortcode('circulo_pagina_completa', function() {
    ob_start();
    ?>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Tangerine:wght@400;700&display=swap');

.circulo-landing * { margin: 0; padding: 0; box-sizing: border-box; }

.circulo-landing {
    --black: #0a0a0a;
    --black-deep: #050508;
    --gold: #d4af37;
    --gold-light: #e8d5a3;
    --gold-dark: #b8972e;
    --gold-glow: rgba(212, 175, 55, 0.5);
    --purple: #6b21a8;
    --purple-glow: rgba(107, 33, 168, 0.4);
    --green: #166534;
    --blue: #1e40af;
    --orange: #c2410c;
    --white: #ffffff;
    font-family: 'Cormorant Garamond', Georgia, serif;
    background: var(--black-deep);
    color: var(--white);
    line-height: 1.6;
}

.circulo-landing a { text-decoration: none; color: inherit; }

@keyframes clFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
@keyframes clPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
@keyframes clGlow { 0%, 100% { text-shadow: 0 0 20px var(--gold-glow); } 50% { text-shadow: 0 0 40px var(--gold-glow), 0 0 60px var(--purple-glow); } }
@keyframes clTwinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
@keyframes clRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.cl-stars { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
.cl-star { position: absolute; width: 3px; height: 3px; background: var(--gold); border-radius: 50%; animation: clTwinkle 3s ease-in-out infinite; }
.cl-star:nth-child(1) { top: 5%; left: 10%; }
.cl-star:nth-child(2) { top: 12%; left: 30%; animation-delay: 0.3s; width: 2px; height: 2px; }
.cl-star:nth-child(3) { top: 8%; left: 50%; animation-delay: 0.6s; }
.cl-star:nth-child(4) { top: 15%; left: 70%; animation-delay: 0.9s; width: 4px; height: 4px; }
.cl-star:nth-child(5) { top: 6%; left: 85%; animation-delay: 1.2s; }
.cl-star:nth-child(6) { top: 25%; left: 5%; animation-delay: 1.5s; }
.cl-star:nth-child(7) { top: 35%; left: 45%; animation-delay: 1.8s; width: 4px; height: 4px; }
.cl-star:nth-child(8) { top: 45%; left: 8%; animation-delay: 2.1s; }
.cl-star:nth-child(9) { top: 55%; left: 92%; animation-delay: 2.4s; }
.cl-star:nth-child(10) { top: 65%; left: 35%; animation-delay: 2.7s; width: 4px; height: 4px; }
.cl-star:nth-child(11) { top: 75%; left: 60%; animation-delay: 0.2s; }
.cl-star:nth-child(12) { top: 85%; left: 20%; animation-delay: 0.8s; }

/* HERO */
.cl-hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    background: radial-gradient(ellipse at 30% 20%, rgba(107, 33, 168, 0.2) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
                linear-gradient(180deg, var(--black-deep) 0%, var(--black) 100%);
    padding: 60px 30px;
    text-align: center;
}

.cl-hero-content { max-width: 900px; }

.cl-hero-runa { font-size: 80px; color: var(--gold); display: block; margin-bottom: 30px; animation: clGlow 4s ease-in-out infinite; }

.cl-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, rgba(107, 33, 168, 0.25), rgba(212, 175, 55, 0.1));
    border: 1px solid rgba(212, 175, 55, 0.4);
    padding: 14px 32px;
    border-radius: 50px;
    margin-bottom: 35px;
}

.cl-hero-badge svg { width: 20px; height: 20px; fill: var(--gold); }
.cl-hero-badge span { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 5px; text-transform: uppercase; color: var(--gold); }

.cl-hero-title { font-family: 'Tangerine', cursive; font-size: clamp(60px, 15vw, 130px); font-weight: 700; line-height: 0.9; margin-bottom: 30px; }
.cl-hero-title .small { display: block; color: var(--white); font-size: 0.5em; }
.cl-gold-text { background: linear-gradient(135deg, var(--gold), var(--gold-light), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

.cl-hero-subtitle { font-size: clamp(20px, 3vw, 28px); font-style: italic; color: rgba(255,255,255,0.85); max-width: 750px; margin: 0 auto 20px; line-height: 1.6; }
.cl-hero-hook { font-family: 'Cinzel', serif; font-size: 16px; color: var(--gold); letter-spacing: 2px; margin-bottom: 50px; }

.cl-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 15px;
    background: linear-gradient(135deg, var(--gold), var(--gold-dark));
    color: var(--black);
    font-family: 'Cinzel', serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 22px 55px;
    border-radius: 60px;
    transition: all 0.4s ease;
    box-shadow: 0 15px 50px rgba(212, 175, 55, 0.4);
}
.cl-btn-primary:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 25px 70px rgba(212, 175, 55, 0.5); }
.cl-btn-primary svg { width: 20px; height: 20px; fill: var(--black); }

/* SECCIONES */
.cl-section { position: relative; z-index: 1; padding: 120px 30px; }
.cl-section.alt-bg { background: linear-gradient(180deg, var(--black) 0%, var(--black-deep) 100%); }
.cl-container { max-width: 1200px; margin: 0 auto; }

.cl-section-header { text-align: center; margin-bottom: 60px; }
.cl-section-label { display: inline-block; font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 5px; text-transform: uppercase; color: var(--gold); margin-bottom: 20px; }
.cl-section-title { font-family: 'Tangerine', cursive; font-size: clamp(50px, 10vw, 80px); font-weight: 700; margin-bottom: 20px; }
.cl-section-subtitle { font-size: 20px; font-style: italic; color: rgba(255,255,255,0.6); max-width: 700px; margin: 0 auto; }

/* CONCEPTO */
.cl-concepto-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.cl-concepto-circle { width: 100%; max-width: 400px; aspect-ratio: 1; margin: 0 auto; position: relative; }
.cl-circle-outer { position: absolute; inset: 0; border: 2px solid rgba(212, 175, 55, 0.2); border-radius: 50%; animation: clRotate 60s linear infinite; }
.cl-circle-outer::before { content: ''; position: absolute; top: -6px; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; background: var(--gold); border-radius: 50%; box-shadow: 0 0 20px var(--gold-glow); }
.cl-circle-inner { position: absolute; inset: 30px; border: 1px solid rgba(107, 33, 168, 0.3); border-radius: 50%; animation: clRotate 40s linear infinite reverse; }
.cl-circle-center { position: absolute; inset: 80px; background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.cl-circle-runa { font-size: 80px; color: var(--gold); opacity: 0.8; animation: clPulse 4s ease-in-out infinite; }

.cl-concepto-texto h2 { font-family: 'Cinzel', serif; font-size: clamp(28px, 4vw, 40px); font-weight: 600; color: var(--white); margin-bottom: 30px; line-height: 1.3; }
.cl-concepto-texto h2 span { color: var(--gold); }
.cl-concepto-texto p { font-size: 18px; color: rgba(255,255,255,0.6); margin-bottom: 25px; line-height: 1.8; }
.cl-concepto-texto p strong { color: rgba(255,255,255,0.85); }

.cl-highlight { background: linear-gradient(135deg, rgba(107, 33, 168, 0.15), rgba(212, 175, 55, 0.08)); border-left: 3px solid var(--gold); padding: 25px 30px; margin: 35px 0; border-radius: 0 15px 15px 0; }
.cl-highlight p { font-size: 20px; font-style: italic; color: rgba(255,255,255,0.85); margin: 0; }

/* QUE APRENDEN */
.cl-aprenden-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; }
.cl-aprenden-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 30px 20px; text-align: center; transition: all 0.4s ease; }
.cl-aprenden-card:hover { border-color: rgba(212, 175, 55, 0.3); transform: translateY(-5px); }
.cl-aprenden-icon { font-size: 36px; margin-bottom: 15px; }
.cl-aprenden-card h4 { font-family: 'Cinzel', serif; font-size: 15px; font-weight: 600; color: var(--white); margin-bottom: 10px; }
.cl-aprenden-card p { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.5; }

/* PORTALES */
.cl-portales-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
.cl-portal { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 30px; padding: 40px 25px; text-align: center; position: relative; overflow: hidden; transition: all 0.5s ease; }
.cl-portal::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: var(--portal-color); opacity: 0.8; }
.cl-portal:hover { transform: translateY(-15px); border-color: var(--portal-color); box-shadow: 0 30px 60px rgba(0,0,0,0.4); }
.cl-portal.yule { --portal-color: var(--blue); }
.cl-portal.ostara { --portal-color: var(--green); }
.cl-portal.litha { --portal-color: var(--orange); }
.cl-portal.mabon { --portal-color: var(--purple); }

.cl-portal-icon { width: 70px; height: 70px; margin: 0 auto 20px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: clFloat 6s ease-in-out infinite; }
.cl-portal-icon svg { width: 32px; height: 32px; fill: var(--portal-color); }
.cl-portal-nombre { font-family: 'Cinzel', serif; font-size: 20px; font-weight: 600; color: var(--white); margin-bottom: 10px; }
.cl-portal-fecha { font-size: 14px; color: var(--portal-color); margin-bottom: 15px; font-weight: 500; }
.cl-portal-desc { font-size: 15px; font-style: italic; color: rgba(255,255,255,0.6); line-height: 1.6; }

/* CONTENIDO */
.cl-contenido-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.cl-contenido-card { background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.08); border-radius: 25px; padding: 40px 30px; text-align: center; transition: all 0.4s ease; }
.cl-contenido-card:hover { border-color: rgba(212, 175, 55, 0.3); transform: translateY(-8px); }

.cl-contenido-icon { width: 70px; height: 70px; margin: 0 auto 25px; background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(107, 33, 168, 0.1)); border-radius: 20px; display: flex; align-items: center; justify-content: center; }
.cl-contenido-icon svg { width: 32px; height: 32px; fill: var(--gold); }
.cl-contenido-card h3 { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; color: var(--white); margin-bottom: 15px; }
.cl-contenido-card p { font-size: 15px; color: rgba(255,255,255,0.6); line-height: 1.7; }
.cl-contenido-card .dia { display: inline-block; font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 2px; color: var(--gold); background: rgba(212, 175, 55, 0.1); padding: 6px 16px; border-radius: 20px; margin-top: 20px; }

/* PLANES */
.cl-planes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; max-width: 1000px; margin: 0 auto; }
.cl-plan { background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 35px; padding: 50px 40px; position: relative; transition: all 0.5s ease; }
.cl-plan:hover { border-color: rgba(212, 175, 55, 0.4); transform: translateY(-8px); }
.cl-plan.destacado { border-color: var(--gold); background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(107, 33, 168, 0.05)); box-shadow: 0 0 60px rgba(212, 175, 55, 0.15); }

.cl-plan-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, var(--gold), var(--gold-dark)); color: var(--black); font-family: 'Cinzel', serif; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 10px 28px; border-radius: 25px; }

.cl-plan-header { text-align: center; margin-bottom: 30px; }
.cl-plan-nombre { font-family: 'Cinzel', serif; font-size: 26px; font-weight: 600; color: #ffffff !important; margin-bottom: 8px; }
.cl-plan-duracion { font-size: 15px; font-style: italic; color: rgba(255,255,255,0.6); }

.cl-plan-precio { text-align: center; padding: 30px 0; margin-bottom: 30px; border-top: 1px solid rgba(212, 175, 55, 0.15); border-bottom: 1px solid rgba(212, 175, 55, 0.15); }
.cl-precio-valor { font-family: 'Cinzel', serif; font-size: 56px; font-weight: 700; color: var(--gold); }
.cl-precio-valor .moneda { font-size: 24px; vertical-align: top; color: var(--gold-light); }
.cl-precio-valor sup { font-size: 24px; color: var(--gold-light); }
.cl-precio-periodo { display: block; font-size: 15px; color: rgba(255,255,255,0.6); margin-top: 5px; }
.cl-precio-pago-unico { display: inline-block; background: rgba(212, 175, 55, 0.2); color: var(--gold); font-family: 'Cinzel', serif; font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; padding: 10px 25px; border-radius: 25px; margin-top: 15px; }
.cl-precio-mensual { font-size: 14px; color: var(--gold-light); margin-top: 12px; }

.cl-plan-beneficios { margin-bottom: 35px; }
.cl-beneficio { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px; }
.cl-beneficio-check { flex-shrink: 0; width: 22px; height: 22px; margin-top: 2px; }
.cl-beneficio-check svg { width: 100%; height: 100%; fill: var(--gold); }
.cl-beneficio span { font-size: 16px; color: rgba(255,255,255,0.85); line-height: 1.5; }

.cl-plan-cta { text-align: center; }
.cl-btn-plan { display: inline-block; width: 100%; padding: 20px 35px; border-radius: 50px; font-family: 'Cinzel', serif; font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; text-align: center; transition: all 0.4s ease; cursor: pointer; }
.cl-btn-secondary { background: transparent; border: 2px solid var(--gold); color: var(--gold); }
.cl-btn-secondary:hover { background: rgba(212, 175, 55, 0.1); transform: translateY(-3px); }
.cl-btn-gold { background: linear-gradient(135deg, var(--gold), var(--gold-dark)); border: none; color: var(--black); box-shadow: 0 15px 40px rgba(212, 175, 55, 0.35); }
.cl-btn-gold:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(212, 175, 55, 0.45); }

/* TESTIMONIOS */
.cl-testimonios-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 35px; }
.cl-testimonio { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 25px; padding: 40px 30px; position: relative; }
.cl-testimonio-quote { position: absolute; top: 20px; left: 25px; font-size: 60px; font-family: 'Tangerine', cursive; color: var(--gold); opacity: 0.3; line-height: 1; }
.cl-testimonio-texto { font-size: 17px; font-style: italic; color: rgba(255,255,255,0.85); line-height: 1.8; margin-bottom: 25px; position: relative; z-index: 1; }
.cl-testimonio-autor { display: flex; align-items: center; gap: 15px; }
.cl-autor-avatar { width: 50px; height: 50px; background: linear-gradient(135deg, var(--purple), var(--gold)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; color: var(--white); }
.cl-autor-info h5 { font-family: 'Cinzel', serif; font-size: 15px; font-weight: 600; color: var(--white); margin-bottom: 3px; }
.cl-autor-info span { font-size: 13px; color: var(--gold); }

/* FAQ */
.cl-faq-grid { max-width: 900px; margin: 0 auto; }
.cl-faq-item { border-bottom: 1px solid rgba(255,255,255,0.1); padding: 30px 0; }
.cl-faq-item:first-child { border-top: 1px solid rgba(255,255,255,0.1); }
.cl-faq-question { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; color: var(--white); margin-bottom: 15px; display: flex; align-items: flex-start; gap: 15px; }
.cl-faq-question::before { content: 'Q'; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; background: rgba(212, 175, 55, 0.15); color: var(--gold); font-size: 14px; border-radius: 8px; }
.cl-faq-answer { font-size: 16px; color: rgba(255,255,255,0.6); line-height: 1.8; padding-left: 45px; }

/* CTA FINAL */
.cl-cta-final { position: relative; z-index: 1; background: radial-gradient(ellipse at 50% 50%, rgba(107, 33, 168, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 50%), var(--black-deep); padding: 150px 30px; text-align: center; }
.cl-cta-content { max-width: 800px; margin: 0 auto; }
.cl-cta-runa { font-size: 70px; color: var(--gold); display: block; margin-bottom: 30px; animation: clGlow 4s ease-in-out infinite; }
.cl-cta-title { font-family: 'Tangerine', cursive; font-size: clamp(45px, 8vw, 70px); font-weight: 700; margin-bottom: 25px; }
.cl-cta-texto { font-size: 22px; font-style: italic; color: rgba(255,255,255,0.85); margin-bottom: 15px; line-height: 1.7; }
.cl-cta-texto strong { color: var(--gold); }
.cl-cta-hook { font-family: 'Cinzel', serif; font-size: 15px; color: var(--gold); letter-spacing: 2px; margin-bottom: 45px; }
.cl-cta-nota { margin-top: 30px; font-size: 14px; color: rgba(255,255,255,0.4); }

/* RESPONSIVE */
@media (max-width: 1200px) {
    .cl-portales-grid { grid-template-columns: repeat(2, 1fr); }
    .cl-aprenden-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 992px) {
    .cl-concepto-grid { grid-template-columns: 1fr; gap: 60px; }
    .cl-concepto-circle { max-width: 350px; order: -1; }
    .cl-contenido-grid { grid-template-columns: repeat(2, 1fr); }
    .cl-testimonios-grid { grid-template-columns: 1fr; max-width: 600px; margin: 0 auto; }
}

@media (max-width: 768px) {
    .cl-section { padding: 100px 25px; }
    .cl-hero { padding: 100px 25px; }
    .cl-hero-runa { font-size: 60px; }
    .cl-hero-title { font-size: 70px; }
    .cl-portales-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
    .cl-aprenden-grid { grid-template-columns: 1fr 1fr; }
    .cl-contenido-grid { grid-template-columns: 1fr; max-width: 450px; margin: 0 auto; }
    .cl-planes-grid { grid-template-columns: 1fr; max-width: 450px; }
    .cl-section-title { font-size: 55px; }
}

@media (max-width: 480px) {
    .cl-hero-title { font-size: 55px; }
    .cl-hero-badge span { font-size: 9px; letter-spacing: 3px; }
    .cl-btn-primary { padding: 18px 40px; font-size: 12px; }
    .cl-concepto-circle { max-width: 280px; }
    .cl-circle-runa { font-size: 60px; }
    .cl-aprenden-grid { grid-template-columns: 1fr; }
    .cl-precio-valor { font-size: 46px; }
    .cl-btn-plan { padding: 18px 25px; font-size: 12px; }
}
</style>

<div class="circulo-landing">

    <!-- ESTRELLAS -->
    <div class="cl-stars">
        <span class="cl-star"></span><span class="cl-star"></span><span class="cl-star"></span>
        <span class="cl-star"></span><span class="cl-star"></span><span class="cl-star"></span>
        <span class="cl-star"></span><span class="cl-star"></span><span class="cl-star"></span>
        <span class="cl-star"></span><span class="cl-star"></span><span class="cl-star"></span>
    </div>

    <!-- HERO -->
    <section class="cl-hero">
        <div class="cl-hero-content">
            <span class="cl-hero-runa">&#5765;</span>
            <div class="cl-hero-badge">
                <svg viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>
                <span>El Primer Portal de Duendes del Mundo</span>
            </div>
            <h1 class="cl-hero-title">
                <span class="small">El</span>
                <span class="cl-gold-text">Círculo de Duendes</span>
            </h1>
            <p class="cl-hero-subtitle">
                El único lugar donde los duendes enseñan directamente.
                Cada semana, un guardián diferente comparte su sabiduría contigo.
            </p>
            <p class="cl-hero-hook">No aprendés sobre duendes. Aprendés de ellos.</p>
            <a href="#planes" class="cl-btn-primary">
                <svg viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>
                Entrar al Círculo
            </a>
        </div>
    </section>

    <!-- CONCEPTO -->
    <section class="cl-section alt-bg">
        <div class="cl-container">
            <div class="cl-concepto-grid">
                <div class="cl-concepto-circle">
                    <div class="cl-circle-outer"></div>
                    <div class="cl-circle-inner"></div>
                    <div class="cl-circle-center">
                        <span class="cl-circle-runa">&#5765;</span>
                    </div>
                </div>
                <div class="cl-concepto-texto">
                    <h2>Un lugar donde los <span>duendes hablan</span></h2>
                    <p>
                        En ningún otro lugar del mundo existe algo así.
                        Un portal dedicado 100% a los duendes, donde <strong>cada semana un guardián diferente toma la palabra</strong>.
                    </p>
                    <p>
                        Desde su foto, su energía, su personalidad única, te enseña lo que sabe.
                        Los cristales que trabaja. Las hierbas que conoce. Los rituales que practica.
                        Secretos que jamás compartimos en público.
                    </p>
                    <div class="cl-highlight">
                        <p>
                            Cada semana, un guardián diferente. Cada semana, una nueva forma de conectar con la magia.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- QUÉ ENSEÑAN LOS DUENDES -->
    <section class="cl-section">
        <div class="cl-container">
            <div class="cl-section-header">
                <span class="cl-section-label">Todo lo Espiritual</span>
                <h2 class="cl-section-title cl-gold-text">Lo Que Enseñan los Duendes</h2>
                <p class="cl-section-subtitle">Cada guardián es experto en diferentes áreas. Juntos, abarcan todo el universo espiritual.</p>
            </div>
            <div class="cl-aprenden-grid">
                <div class="cl-aprenden-card">
                    <div class="cl-aprenden-icon">💎</div>
                    <h4>Cristales y Piedras</h4>
                    <p>Cada duende trabaja con cristales específicos y te enseña cómo usarlos.</p>
                </div>
                <div class="cl-aprenden-card">
                    <div class="cl-aprenden-icon">🌿</div>
                    <h4>Herbología Mágica</h4>
                    <p>Plantas sagradas, sahumerios, aceites esenciales y sus propiedades.</p>
                </div>
                <div class="cl-aprenden-card">
                    <div class="cl-aprenden-icon">🔮</div>
                    <h4>Tarot y Oráculos</h4>
                    <p>Tiradas especiales, lecturas intuitivas y conexión con las cartas.</p>
                </div>
                <div class="cl-aprenden-card">
                    <div class="cl-aprenden-icon">🌙</div>
                    <h4>Ciclos Lunares</h4>
                    <p>Rituales para cada fase, manifestación y limpieza energética.</p>
                </div>
                <div class="cl-aprenden-card">
                    <div class="cl-aprenden-icon">⭐</div>
                    <h4>Astrología</h4>
                    <p>Cómo los astros influyen en tu energía y la de tus guardianes.</p>
                </div>
                <div class="cl-aprenden-card">
                    <div class="cl-aprenden-icon">🧘</div>
                    <h4>Meditación Guiada</h4>
                    <p>Viajes astrales, visualización y conexión profunda con los duendes.</p>
                </div>
                <div class="cl-aprenden-card">
                    <div class="cl-aprenden-icon">✨</div>
                    <h4>Abundancia</h4>
                    <p>Manifestación, ley de atracción y desbloqueo de prosperidad.</p>
                </div>
                <div class="cl-aprenden-card">
                    <div class="cl-aprenden-icon">🛡️</div>
                    <h4>Protección Energética</h4>
                    <p>Limpiezas, escudos, corte de vínculos y protección del hogar.</p>
                </div>
                <div class="cl-aprenden-card">
                    <div class="cl-aprenden-icon">🕯️</div>
                    <h4>Rituales y Ceremonias</h4>
                    <p>Sabbats, esbats, altares y prácticas mágicas paso a paso.</p>
                </div>
                <div class="cl-aprenden-card">
                    <div class="cl-aprenden-icon">🔢</div>
                    <h4>Numerología</h4>
                    <p>Números personales, fechas importantes y sincronicidades.</p>
                </div>
                <div class="cl-aprenden-card">
                    <div class="cl-aprenden-icon">💫</div>
                    <h4>Chakras y Aura</h4>
                    <p>Equilibrio energético, colores del aura y sanación.</p>
                </div>
                <div class="cl-aprenden-card">
                    <div class="cl-aprenden-icon">🌸</div>
                    <h4>Sanación Emocional</h4>
                    <p>Trabajo con sombras, liberación y transformación interior.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- PORTALES -->
    <section class="cl-section alt-bg">
        <div class="cl-container">
            <div class="cl-section-header">
                <span class="cl-section-label">Los Ciclos de los Guardianes</span>
                <h2 class="cl-section-title cl-gold-text">Los 4 Portales</h2>
                <p class="cl-section-subtitle">Los duendes siguen el ritmo de la naturaleza. Cuatro estaciones, cuatro energías, cuatro formas de conectar.</p>
            </div>
            <div class="cl-portales-grid">
                <div class="cl-portal yule">
                    <div class="cl-portal-icon"><svg viewBox="0 0 24 24"><path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"/></svg></div>
                    <h3 class="cl-portal-nombre">Ciclo de Yule</h3>
                    <span class="cl-portal-fecha">Junio - Agosto</span>
                    <p class="cl-portal-desc">Duendes de la sombra y la introspección. Guardianes del silencio interior y el renacimiento.</p>
                </div>
                <div class="cl-portal ostara">
                    <div class="cl-portal-icon"><svg viewBox="0 0 24 24"><path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 3.12 13.38 2 12 2S9.5 3.12 9.5 4.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25z"/></svg></div>
                    <h3 class="cl-portal-nombre">Ciclo de Ostara</h3>
                    <span class="cl-portal-fecha">Septiembre - Noviembre</span>
                    <p class="cl-portal-desc">Duendes del despertar primaveral. Maestros de las semillas y los nuevos comienzos.</p>
                </div>
                <div class="cl-portal litha">
                    <div class="cl-portal-icon"><svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z"/></svg></div>
                    <h3 class="cl-portal-nombre">Ciclo de Litha</h3>
                    <span class="cl-portal-fecha">Diciembre - Febrero</span>
                    <p class="cl-portal-desc">Duendes del fuego y la abundancia. Guardianes del poder pleno y la celebración.</p>
                </div>
                <div class="cl-portal mabon">
                    <div class="cl-portal-icon"><svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg></div>
                    <h3 class="cl-portal-nombre">Ciclo de Mabon</h3>
                    <span class="cl-portal-fecha">Marzo - Mayo</span>
                    <p class="cl-portal-desc">Duendes de la cosecha y gratitud. Maestros del soltar y recibir.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CONTENIDO -->
    <section class="cl-section">
        <div class="cl-container">
            <div class="cl-section-header">
                <span class="cl-section-label">Cada Semana</span>
                <h2 class="cl-section-title cl-gold-text">Un Duende Diferente Enseña</h2>
                <p class="cl-section-subtitle">Esto es lo que te comparte cada guardián cuando es su turno de tomar la palabra.</p>
            </div>
            <div class="cl-contenido-grid">
                <div class="cl-contenido-card">
                    <div class="cl-contenido-icon"><svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg></div>
                    <h3>Sabiduría del Duende</h3>
                    <p>El guardián comparte los cristales que trabaja, las hierbas que conoce, los secretos de su especialidad.</p>
                    <span class="dia">Lunes</span>
                </div>
                <div class="cl-contenido-card">
                    <div class="cl-contenido-icon"><svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg></div>
                    <h3>Meditación con el Duende</h3>
                    <p>Un viaje guiado con la energía del guardián. Te lleva a su mundo para que experimentes su magia.</p>
                    <span class="dia">Miércoles</span>
                </div>
                <div class="cl-contenido-card">
                    <div class="cl-contenido-icon"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
                    <h3>Ritual del Guardián</h3>
                    <p>Una práctica guiada paso a paso que podés hacer en tu casa. El duende te acompaña en cada momento.</p>
                    <span class="dia">Viernes</span>
                </div>
                <div class="cl-contenido-card">
                    <div class="cl-contenido-icon"><svg viewBox="0 0 24 24"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>
                    <h3>DIY del Duende</h3>
                    <p>Creá algo inspirado en el guardián de la semana. Bolsitas, amuletos, decoraciones para su altar.</p>
                    <span class="dia">Sábado</span>
                </div>
                <div class="cl-contenido-card">
                    <div class="cl-contenido-icon"><svg viewBox="0 0 24 24"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg></div>
                    <h3>Foro de Duendes</h3>
                    <p>Un espacio íntimo donde compartir con otros que viven con guardianes. Fotos de altares, experiencias, preguntas.</p>
                    <span class="dia">Siempre</span>
                </div>
                <div class="cl-contenido-card">
                    <div class="cl-contenido-icon"><svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg></div>
                    <h3>Duende del Día</h3>
                    <p>Cada vez que entrás al portal, un guardián diferente te saluda con un mensaje único generado para vos.</p>
                    <span class="dia">Cada visita</span>
                </div>
            </div>
        </div>
    </section>

    <!-- PLANES -->
    <section id="planes" class="cl-section alt-bg">
        <div class="cl-container">
            <div class="cl-section-header">
                <span class="cl-section-label">Tu Camino</span>
                <h2 class="cl-section-title cl-gold-text">Elegí Tu Acceso</h2>
                <p class="cl-section-subtitle">Dos opciones para entrar al Círculo. Pagás una vez, accedés todo el período. Sin letra chica.</p>
            </div>
            <div class="cl-planes-grid">
                <div class="cl-plan">
                    <div class="cl-plan-header">
                        <h3 class="cl-plan-nombre">Medio Año con Duendes</h3>
                        <span class="cl-plan-duracion">6 meses de sabiduría</span>
                    </div>
                    <div class="cl-plan-precio">
                        <span class="cl-precio-valor"><span class="moneda">$</span>49<sup>.99</sup></span>
                        <span class="cl-precio-periodo">USD - 6 meses de acceso</span>
                        <span class="cl-precio-pago-unico">Pago único</span>
                        <p class="cl-precio-mensual">Equivale a $8.33 por mes</p>
                    </div>
                    <div class="cl-plan-beneficios">
                        <div class="cl-beneficio"><span class="cl-beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span><span>Un duende diferente cada semana</span></div>
                        <div class="cl-beneficio"><span class="cl-beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span><span>Rituales, meditaciones, tarot y DIY</span></div>
                        <div class="cl-beneficio"><span class="cl-beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span><span>Foro privado del Círculo</span></div>
                        <div class="cl-beneficio"><span class="cl-beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span><span>2 ciclos estacionales</span></div>
                        <div class="cl-beneficio"><span class="cl-beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span><span>Acceso al archivo completo</span></div>
                    </div>
                    <div class="cl-plan-cta"><a href="/checkout/?plan=semestral" class="cl-btn-plan cl-btn-secondary">Comenzar</a></div>
                </div>
                <div class="cl-plan destacado">
                    <span class="cl-plan-badge">Ciclo Completo</span>
                    <div class="cl-plan-header">
                        <h3 class="cl-plan-nombre">Un Año con los Guardianes</h3>
                        <span class="cl-plan-duracion">1 año completo de magia</span>
                    </div>
                    <div class="cl-plan-precio">
                        <span class="cl-precio-valor"><span class="moneda">$</span>79<sup>.99</sup></span>
                        <span class="cl-precio-periodo">USD - 1 año de acceso</span>
                        <span class="cl-precio-pago-unico">Pago único</span>
                        <p class="cl-precio-mensual">Solo $6.67/mes - Ahorrás 20%</p>
                    </div>
                    <div class="cl-plan-beneficios">
                        <div class="cl-beneficio"><span class="cl-beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span><span>Cada semana un guardián diferente te enseña</span></div>
                        <div class="cl-beneficio"><span class="cl-beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span><span>Los 4 ciclos estacionales</span></div>
                        <div class="cl-beneficio"><span class="cl-beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span><span>10% descuento en adopciones</span></div>
                        <div class="cl-beneficio"><span class="cl-beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span><span>Conocé nuevos guardianes primero</span></div>
                        <div class="cl-beneficio"><span class="cl-beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span><span>Regalo sorpresa de aniversario</span></div>
                    </div>
                    <div class="cl-plan-cta"><a href="/checkout/?plan=anual" class="cl-btn-plan cl-btn-gold">Entrar al Círculo</a></div>
                </div>
            </div>
        </div>
    </section>

    <!-- TESTIMONIOS -->
    <section class="cl-section">
        <div class="cl-container">
            <div class="cl-section-header">
                <span class="cl-section-label">Voces del Círculo</span>
                <h2 class="cl-section-title cl-gold-text">Lo Que Dicen</h2>
            </div>
            <div class="cl-testimonios-grid">
                <div class="cl-testimonio">
                    <span class="cl-testimonio-quote">"</span>
                    <p class="cl-testimonio-texto">Nunca pensé que un duende de arcilla pudiera hacerme llorar. Pero cuando leí el mensaje que tenía para mí... todo hizo sentido. Esto no es un curso, es algo que no existe en ningún otro lado.</p>
                    <div class="cl-testimonio-autor">
                        <div class="cl-autor-avatar">M</div>
                        <div class="cl-autor-info"><h5>María Eugenia</h5><span>Miembro desde 2024</span></div>
                    </div>
                </div>
                <div class="cl-testimonio">
                    <span class="cl-testimonio-quote">"</span>
                    <p class="cl-testimonio-texto">El foro es lo mejor que me pasó. Encontré gente que entiende sin tener que explicar. Compartimos altares, lloramos juntas, nos reímos. Es familia de duendes.</p>
                    <div class="cl-testimonio-autor">
                        <div class="cl-autor-avatar">L</div>
                        <div class="cl-autor-info"><h5>Lucía</h5><span>Miembro desde 2023</span></div>
                    </div>
                </div>
                <div class="cl-testimonio">
                    <span class="cl-testimonio-quote">"</span>
                    <p class="cl-testimonio-texto">Empecé escéptica, lo admito. Pero el duende del día siempre dice exactamente lo que necesito escuchar. Ya no me sorprende. Confío en ellos.</p>
                    <div class="cl-testimonio-autor">
                        <div class="cl-autor-avatar">V</div>
                        <div class="cl-autor-info"><h5>Victoria</h5><span>Miembro desde 2024</span></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ -->
    <section class="cl-section alt-bg">
        <div class="cl-container">
            <div class="cl-section-header">
                <span class="cl-section-label">Preguntas</span>
                <h2 class="cl-section-title cl-gold-text">Dudas Frecuentes</h2>
            </div>
            <div class="cl-faq-grid">
                <div class="cl-faq-item">
                    <h4 class="cl-faq-question">¿Necesito tener un duende para entrar al Círculo?</h4>
                    <p class="cl-faq-answer">No. El Círculo es para cualquier persona que sienta el llamado de los duendes. Podés ser miembro sin haber adoptado ninguno todavía. De hecho, muchas personas descubren cuál quieren adoptar después de conocerlos en el Círculo.</p>
                </div>
                <div class="cl-faq-item">
                    <h4 class="cl-faq-question">¿Se renueva automáticamente?</h4>
                    <p class="cl-faq-answer">No. El pago es único. Pagás una vez y tenés acceso durante todo el período que elegiste (6 meses o 1 año). No hay suscripción ni renovación automática. Cuando termina, vos decidís si querés renovar.</p>
                </div>
                <div class="cl-faq-item">
                    <h4 class="cl-faq-question">¿Cuántos duendes enseñan por semana?</h4>
                    <p class="cl-faq-answer">Uno diferente cada semana. Cada guardián toma el protagonismo durante 7 días completos, compartiendo su sabiduría, su ritual, su meditación y su proyecto DIY.</p>
                </div>
                <div class="cl-faq-item">
                    <h4 class="cl-faq-question">¿Qué pasa si me pierdo una semana?</h4>
                    <p class="cl-faq-answer">Todo el contenido queda disponible en el archivo. Podés acceder a las enseñanzas de cualquier duende en cualquier momento mientras tu membresía esté activa.</p>
                </div>
                <div class="cl-faq-item">
                    <h4 class="cl-faq-question">¿Desde dónde puedo acceder?</h4>
                    <p class="cl-faq-answer">Desde cualquier dispositivo con internet. El portal funciona en celulares, tablets y computadoras. Tu magia te acompaña donde vayas.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA FINAL -->
    <section class="cl-cta-final">
        <div class="cl-cta-content">
            <span class="cl-cta-runa">&#5765;</span>
            <h2 class="cl-cta-title cl-gold-text">El Círculo Te Espera</h2>
            <p class="cl-cta-texto">Este es el <strong>único lugar del mundo</strong> donde los duendes comparten su sabiduría directamente. No existe otro portal así.</p>
            <p class="cl-cta-hook">Los guardianes ya saben que estás acá.</p>
            <a href="#planes" class="cl-btn-primary">
                <svg viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>
                Entrar al Círculo
            </a>
            <p class="cl-cta-nota">Pago único. Sin renovación automática. Sin sorpresas.</p>
        </div>
    </section>

</div>
    <?php
    return ob_get_clean();
});
