<?php
/**
 * Plugin Name: Duendes - Círculo Marketing HTMLs
 * Description: Shortcodes para las secciones de marketing del Círculo de Duendes
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════════
// SHORTCODE: [circulo_seccion_home]
// Sección para insertar en el homepage
// ═══════════════════════════════════════════════════════════════════════════════
add_shortcode('circulo_seccion_home', function() {
    ob_start();
    ?>
<!--
═══════════════════════════════════════════════════════════════════════════════
SECCIÓN: EL CÍRCULO DE DUENDES - NUEVA VERSIÓN
Suscripción semestral y anual - Basado en los 4 portales del año
Sin emojis - Solo SVGs animados
═══════════════════════════════════════════════════════════════════════════════
-->

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
    max-width: 800px !important;
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
    max-width: 700px !important;
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
    color: var(--white) !important;
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
    max-width: 600px !important;
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
                    <span class="circulo-badge-text">Membresia Exclusiva</span>
                </div>
                <h2 class="circulo-title">El <span>Circulo de Duendes</span></h2>
                <p class="circulo-subtitle">
                    Un portal donde todo gira en torno a los guardianes.
                    Cada semana, un duende diferente te ensena desde su perspectiva.
                    Rituales, meditaciones, secretos que no compartimos en publico.
                </p>
                <p class="circulo-hook">No es un curso. Es un mundo.</p>
                <div class="header-line"></div>
            </div>

            <div class="portales-section">
                <div class="portales-intro">
                    <h3>Los 4 Portales del Ano</h3>
                    <p>El Circulo sigue el ritmo de las estaciones. Cuatro momentos del ano, cuatro energias diferentes, cuatro oportunidades de transformacion.</p>
                </div>

                <div class="portales-grid">
                    <div class="portal-card yule">
                        <div class="portal-icon">
                            <svg viewBox="0 0 24 24"><path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"/></svg>
                        </div>
                        <h4 class="portal-nombre">Portal de Yule</h4>
                        <span class="portal-fecha">Junio - Agosto</span>
                        <p class="portal-energia">Introspeccion y renacimiento. De la sombra a la luz.</p>
                    </div>

                    <div class="portal-card ostara">
                        <div class="portal-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 3.12 13.38 2 12 2S9.5 3.12 9.5 4.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25z"/></svg>
                        </div>
                        <h4 class="portal-nombre">Portal de Ostara</h4>
                        <span class="portal-fecha">Septiembre - Noviembre</span>
                        <p class="portal-energia">Despertar y nuevos comienzos. Plantar semillas.</p>
                    </div>

                    <div class="portal-card litha">
                        <div class="portal-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>
                        </div>
                        <h4 class="portal-nombre">Portal de Litha</h4>
                        <span class="portal-fecha">Diciembre - Febrero</span>
                        <p class="portal-energia">Abundancia plena. Celebracion y poder maximo.</p>
                    </div>

                    <div class="portal-card mabon">
                        <div class="portal-icon">
                            <svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>
                        </div>
                        <h4 class="portal-nombre">Portal de Mabon</h4>
                        <span class="portal-fecha">Marzo - Mayo</span>
                        <p class="portal-energia">Cosecha y gratitud. Soltar para recibir.</p>
                    </div>
                </div>
            </div>

            <div class="planes-section">
                <div class="planes-grid">
                    <div class="plan-card">
                        <div class="plan-header">
                            <h3 class="plan-nombre">Medio Ano Magico</h3>
                            <span class="plan-duracion">6 meses de magia</span>
                        </div>
                        <div class="plan-precio">
                            <span class="precio-valor"><span class="precio-moneda">$</span>49<sup>.99</sup></span>
                            <span class="precio-periodo">USD por 6 meses</span>
                            <p class="precio-mensual">$8.33 por mes</p>
                        </div>
                        <div class="plan-beneficios">
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">26 guardianes protagonistas</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">Contenido semanal exclusivo</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">Foro privado del Circulo</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">2 portales estacionales</span>
                            </div>
                        </div>
                        <div class="plan-cta">
                            <a href="/circulo-de-duendes/?plan=semestral" class="btn-plan btn-plan-secundario">Comenzar</a>
                        </div>
                    </div>

                    <div class="plan-card destacado">
                        <span class="plan-destacado-badge">Mejor Valor</span>
                        <div class="plan-header">
                            <h3 class="plan-nombre">Ano del Guardian</h3>
                            <span class="plan-duracion">El ciclo completo</span>
                        </div>
                        <div class="plan-precio">
                            <span class="precio-valor"><span class="precio-moneda">$</span>79<sup>.99</sup></span>
                            <span class="precio-periodo">USD por ano</span>
                            <p class="precio-mensual">Solo $6.67 por mes - Ahorra 20%</p>
                        </div>
                        <div class="plan-beneficios">
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">52 guardianes protagonistas</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">Los 4 portales completos</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">10% descuento en la tienda</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">Acceso anticipado a nuevos guardianes</span>
                            </div>
                            <div class="beneficio-item">
                                <span class="beneficio-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>
                                <span class="beneficio-texto">Sorpresa de aniversario</span>
                            </div>
                        </div>
                        <div class="plan-cta">
                            <a href="/circulo-de-duendes/?plan=anual" class="btn-plan btn-plan-primario">Unirme al Circulo</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="incluye-section">
                <div class="incluye-header">
                    <h3>Que Recibis Cada Semana</h3>
                    <p>Un guardian diferente toma la palabra</p>
                </div>

                <div class="incluye-grid">
                    <div class="incluye-card">
                        <div class="incluye-icon">
                            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                        </div>
                        <h4>Ensenanza del Guardian</h4>
                        <p>Sabiduria desde su perspectiva unica. Cristales, rituales, secretos que solo el conoce.</p>
                    </div>

                    <div class="incluye-card">
                        <div class="incluye-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                        </div>
                        <h4>Meditacion Guiada</h4>
                        <p>Viaje interior con la energia del guardian. Audio exclusivo para conectar.</p>
                    </div>

                    <div class="incluye-card">
                        <div class="incluye-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        </div>
                        <h4>Ritual Practico</h4>
                        <p>Practica guiada que podes hacer en casa. El guardian te acompana paso a paso.</p>
                    </div>

                    <div class="incluye-card">
                        <div class="incluye-icon">
                            <svg viewBox="0 0 24 24"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>
                        </div>
                        <h4>Foro del Circulo</h4>
                        <p>Conecta con otros miembros. Comparti experiencias, fotos de altares, preguntas.</p>
                    </div>

                    <div class="incluye-card">
                        <div class="incluye-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/></svg>
                        </div>
                        <h4>Proyecto DIY</h4>
                        <p>Crea algo magico con tus manos. Bolsitas, altares, objetos inspirados en el guardian.</p>
                    </div>

                    <div class="incluye-card">
                        <div class="incluye-icon">
                            <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                        </div>
                        <h4>Mensaje Diario</h4>
                        <p>Cada dia, un guardian random te saluda al entrar. Mensajes unicos generados para vos.</p>
                    </div>
                </div>
            </div>

            <div class="circulo-cta-final">
                <p class="cta-texto">
                    El Circulo no es para todos. Es para quienes <strong>sienten el llamado</strong> de los guardianes
                    y quieren sumergirse en su mundo.
                </p>
                <a href="/circulo-de-duendes" class="btn-cta-final">
                    <svg viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>
                    Entrar al Circulo
                </a>
                <p class="cta-nota">Cancela cuando quieras. Sin letra chica. Sin compromisos ocultos.</p>
            </div>

        </div>
    </section>
</div>
    <?php
    return ob_get_clean();
});
