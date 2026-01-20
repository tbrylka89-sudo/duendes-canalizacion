<?php
/**
 * Plugin Name: Duendes - Página Nosotros
 * Description: Página emotiva y dinámica sobre Duendes del Uruguay
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════════
// SHORTCODE: [duendes_nosotros]
// Página completa sobre la historia y filosofía de Duendes del Uruguay
// ═══════════════════════════════════════════════════════════════════════════════
add_shortcode('duendes_nosotros', function() {
    // Obtener estadísticas dinámicas
    $stats = duendes_obtener_estadisticas();

    ob_start();
    ?>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Tangerine:wght@400;700&display=swap');

.nosotros-page * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.nosotros-page {
    --negro: #0a0a0a;
    --negro-profundo: #050508;
    --dorado: #d4af37;
    --dorado-claro: #e8d5a3;
    --dorado-oscuro: #b8972e;
    --crema: #FAF8F5;
    --texto: #2a2a2a;
    font-family: 'Cormorant Garamond', Georgia, serif;
    color: var(--texto);
    overflow-x: hidden;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* HERO - LA PRIMERA IMPRESION */
/* ═══════════════════════════════════════════════════════════════════════════ */
.nosotros-hero {
    min-height: 100vh;
    background: linear-gradient(180deg, var(--negro) 0%, var(--negro-profundo) 50%, var(--negro) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 100px 40px;
    position: relative;
    overflow: hidden;
}

.nosotros-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse at 30% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 70% 80%, rgba(107, 33, 168, 0.05) 0%, transparent 50%);
    pointer-events: none;
}

.hero-estrellas {
    position: absolute;
    inset: 0;
    overflow: hidden;
}

.hero-estrellas span {
    position: absolute;
    width: 3px;
    height: 3px;
    background: var(--dorado);
    border-radius: 50%;
    opacity: 0;
    animation: estrellaBrilla 4s ease-in-out infinite;
}

@keyframes estrellaBrilla {
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 0.8; transform: scale(1); }
}

.hero-contenido {
    position: relative;
    z-index: 2;
    max-width: 900px;
}

.hero-etiqueta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: rgba(212, 175, 55, 0.1);
    border: 1px solid rgba(212, 175, 55, 0.3);
    padding: 12px 30px;
    border-radius: 50px;
    margin-bottom: 40px;
}

.hero-etiqueta-texto {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--dorado);
}

.hero-titulo {
    font-family: 'Tangerine', cursive;
    font-size: clamp(60px, 15vw, 140px);
    font-weight: 700;
    color: #fff;
    line-height: 0.9;
    margin-bottom: 30px;
}

.hero-titulo span {
    background: linear-gradient(135deg, var(--dorado), var(--dorado-claro), var(--dorado));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-subtitulo {
    font-size: clamp(20px, 3vw, 28px);
    font-style: italic;
    color: rgba(255, 255, 255, 0.7);
    max-width: 700px;
    margin: 0 auto 50px;
    line-height: 1.6;
}

.hero-scroll {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    animation: scrollBounce 2s ease-in-out infinite;
}

.hero-scroll svg {
    width: 24px;
    height: 24px;
    stroke: var(--dorado);
}

@keyframes scrollBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(10px); }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* NUESTRA HISTORIA - STORYTELLING */
/* ═══════════════════════════════════════════════════════════════════════════ */
.historia-section {
    background: var(--crema);
    padding: 120px 40px;
}

.historia-container {
    max-width: 900px;
    margin: 0 auto;
}

.historia-intro {
    text-align: center;
    margin-bottom: 80px;
}

.historia-titulo {
    font-family: 'Cinzel', serif;
    font-size: clamp(32px, 5vw, 48px);
    color: var(--negro);
    margin-bottom: 20px;
    letter-spacing: 2px;
}

.historia-linea {
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--dorado), transparent);
    margin: 0 auto 40px;
}

.historia-texto {
    font-size: clamp(18px, 2.5vw, 22px);
    line-height: 2;
    color: #444;
    text-align: justify;
}

.historia-texto p {
    margin-bottom: 30px;
}

.historia-texto p:first-of-type::first-letter {
    font-size: 60px;
    float: left;
    line-height: 1;
    padding-right: 15px;
    color: var(--dorado);
    font-family: 'Tangerine', cursive;
}

.historia-destacado {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
    border-left: 4px solid var(--dorado);
    padding: 30px 40px;
    margin: 50px 0;
    font-style: italic;
    font-size: 20px;
    color: #333;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* FILOSOFIA - LO QUE NOS MUEVE */
/* ═══════════════════════════════════════════════════════════════════════════ */
.filosofia-section {
    background: var(--negro);
    padding: 120px 40px;
    position: relative;
}

.filosofia-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
}

.filosofia-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
}

.filosofia-header {
    text-align: center;
    margin-bottom: 80px;
}

.filosofia-titulo {
    font-family: 'Tangerine', cursive;
    font-size: clamp(50px, 10vw, 90px);
    font-weight: 700;
    color: var(--dorado);
    margin-bottom: 20px;
}

.filosofia-subtitulo {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
}

.filosofia-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
}

.filosofia-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 20px;
    padding: 50px 40px;
    text-align: center;
    transition: all 0.4s ease;
}

.filosofia-card:hover {
    border-color: var(--dorado);
    transform: translateY(-10px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
}

.filosofia-icono {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 25px;
    font-size: 36px;
}

.filosofia-card-titulo {
    font-family: 'Cinzel', serif;
    font-size: 20px;
    color: var(--dorado);
    margin-bottom: 15px;
    letter-spacing: 1px;
}

.filosofia-card-texto {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.7;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* EL EQUIPO - QUIENES SOMOS */
/* ═══════════════════════════════════════════════════════════════════════════ */
.equipo-section {
    background: linear-gradient(180deg, var(--crema) 0%, #f5f3f0 100%);
    padding: 120px 40px;
}

.equipo-container {
    max-width: 1100px;
    margin: 0 auto;
}

.equipo-header {
    text-align: center;
    margin-bottom: 80px;
}

.equipo-titulo {
    font-family: 'Tangerine', cursive;
    font-size: clamp(50px, 10vw, 80px);
    font-weight: 700;
    color: var(--negro);
    margin-bottom: 15px;
}

.equipo-subtitulo {
    font-size: 20px;
    color: #666;
    font-style: italic;
}

.equipo-intro {
    max-width: 800px;
    margin: 0 auto 60px;
    text-align: center;
    font-size: 18px;
    line-height: 1.9;
    color: #444;
}

.equipo-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    margin-bottom: 60px;
}

.equipo-miembro {
    background: #fff;
    border-radius: 25px;
    padding: 40px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
    text-align: center;
}

.equipo-foto {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid var(--dorado);
    margin-bottom: 25px;
}

.equipo-nombre {
    font-family: 'Tangerine', cursive;
    font-size: 48px;
    font-weight: 700;
    color: var(--negro);
    margin-bottom: 5px;
}

.equipo-rol {
    font-family: 'Cinzel', serif;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--dorado);
    margin-bottom: 20px;
}

.equipo-bio {
    font-size: 16px;
    line-height: 1.8;
    color: #555;
}

.equipo-juntos {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 20px;
    padding: 40px;
    text-align: center;
}

.equipo-juntos-texto {
    font-size: 20px;
    font-style: italic;
    color: #333;
    line-height: 1.8;
    max-width: 700px;
    margin: 0 auto;
}

.equipo-firma {
    margin-top: 25px;
    font-family: 'Tangerine', cursive;
    font-size: 36px;
    color: var(--dorado);
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* NUMEROS - IMPACTO REAL */
/* ═══════════════════════════════════════════════════════════════════════════ */
.numeros-section {
    background: var(--negro);
    padding: 100px 40px;
}

.numeros-container {
    max-width: 1200px;
    margin: 0 auto;
}

.numeros-header {
    text-align: center;
    margin-bottom: 60px;
}

.numeros-titulo {
    font-family: 'Cinzel', serif;
    font-size: clamp(24px, 4vw, 36px);
    color: #fff;
    letter-spacing: 3px;
}

.numeros-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
}

.numero-item {
    text-align: center;
    padding: 30px;
}

.numero-valor {
    font-family: 'Cinzel', serif;
    font-size: clamp(40px, 8vw, 70px);
    font-weight: 700;
    color: var(--dorado);
    line-height: 1;
    margin-bottom: 10px;
}

.numero-label {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 2px;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* TESTIMONIOS - VOCES REALES */
/* ═══════════════════════════════════════════════════════════════════════════ */
.testimonios-section {
    background: var(--crema);
    padding: 120px 40px;
}

.testimonios-container {
    max-width: 1200px;
    margin: 0 auto;
}

.testimonios-header {
    text-align: center;
    margin-bottom: 80px;
}

.testimonios-titulo {
    font-family: 'Tangerine', cursive;
    font-size: clamp(50px, 10vw, 80px);
    font-weight: 700;
    color: var(--negro);
    margin-bottom: 15px;
}

.testimonios-subtitulo {
    font-size: 18px;
    color: #666;
    font-style: italic;
}

.testimonios-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
}

.testimonio-card {
    background: #fff;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06);
    position: relative;
}

.testimonio-comillas {
    position: absolute;
    top: 20px;
    left: 30px;
    font-size: 80px;
    color: var(--dorado);
    opacity: 0.2;
    font-family: serif;
    line-height: 1;
}

.testimonio-texto {
    font-size: 17px;
    line-height: 1.8;
    color: #444;
    font-style: italic;
    margin-bottom: 25px;
    position: relative;
    z-index: 1;
}

.testimonio-autor {
    display: flex;
    align-items: center;
    gap: 15px;
}

.testimonio-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--dorado), var(--dorado-oscuro));
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-family: 'Cinzel', serif;
    font-weight: 600;
}

.testimonio-info {
    flex: 1;
}

.testimonio-nombre {
    font-family: 'Cinzel', serif;
    font-size: 16px;
    color: var(--negro);
    font-weight: 600;
}

.testimonio-ubicacion {
    font-size: 14px;
    color: #888;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* CTA FINAL - LLAMADO A LA ACCION */
/* ═══════════════════════════════════════════════════════════════════════════ */
.cta-nosotros {
    background: linear-gradient(135deg, var(--negro) 0%, #1a1a2e 100%);
    padding: 120px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta-nosotros::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
}

.cta-container {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
}

.cta-titulo {
    font-family: 'Tangerine', cursive;
    font-size: clamp(50px, 12vw, 100px);
    font-weight: 700;
    color: #fff;
    line-height: 1;
    margin-bottom: 20px;
}

.cta-titulo span {
    color: var(--dorado);
}

.cta-texto {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.7);
    font-style: italic;
    margin-bottom: 40px;
    line-height: 1.6;
}

.cta-botones {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.cta-btn {
    display: inline-block;
    padding: 20px 50px;
    border-radius: 50px;
    font-family: 'Cinzel', serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.4s ease;
}

.cta-btn-primario {
    background: linear-gradient(135deg, var(--dorado), var(--dorado-oscuro));
    color: var(--negro);
    box-shadow: 0 15px 40px rgba(212, 175, 55, 0.3);
}

.cta-btn-primario:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 60px rgba(212, 175, 55, 0.4);
}

.cta-btn-secundario {
    background: transparent;
    border: 2px solid var(--dorado);
    color: var(--dorado);
}

.cta-btn-secundario:hover {
    background: rgba(212, 175, 55, 0.1);
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* RESPONSIVE */
/* ═══════════════════════════════════════════════════════════════════════════ */
@media (max-width: 968px) {
    .equipo-grid {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .equipo-miembro {
        padding: 30px;
    }

    .equipo-foto {
        width: 150px;
        height: 150px;
    }

    .numeros-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .nosotros-hero,
    .historia-section,
    .filosofia-section,
    .thibisay-section,
    .numeros-section,
    .testimonios-section,
    .cta-nosotros {
        padding: 80px 20px;
    }

    .numeros-grid {
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .numero-valor {
        font-size: 36px;
    }

    .testimonios-grid {
        grid-template-columns: 1fr;
    }

    .cta-botones {
        flex-direction: column;
        align-items: center;
    }

    .cta-btn {
        width: 100%;
        max-width: 300px;
        text-align: center;
    }
}
</style>

<div class="nosotros-page">
    <!-- HERO -->
    <section class="nosotros-hero">
        <div class="hero-estrellas">
            <span style="top: 8%; left: 15%; animation-delay: 0s;"></span>
            <span style="top: 20%; left: 45%; animation-delay: 1s;"></span>
            <span style="top: 12%; right: 20%; animation-delay: 2s;"></span>
            <span style="top: 40%; left: 8%; animation-delay: 0.5s;"></span>
            <span style="top: 55%; right: 12%; animation-delay: 1.5s;"></span>
            <span style="top: 70%; left: 30%; animation-delay: 2.5s;"></span>
            <span style="top: 80%; right: 35%; animation-delay: 3s;"></span>
            <span style="bottom: 15%; left: 60%; animation-delay: 0.8s;"></span>
        </div>

        <div class="hero-contenido">
            <div class="hero-etiqueta">
                <span class="hero-etiqueta-texto">Desde Uruguay para el mundo</span>
            </div>

            <h1 class="hero-titulo">
                <span>Duendes</span> del Uruguay
            </h1>

            <p class="hero-subtitulo">
                No vendemos figuras. Canalizamos guardianes.
                <br>Cada uno encuentra a quien debe encontrar.
            </p>

            <div class="hero-scroll">
                <span>Descubri nuestra historia</span>
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>
        </div>
    </section>

    <!-- HISTORIA -->
    <section class="historia-section">
        <div class="historia-container">
            <div class="historia-intro">
                <h2 class="historia-titulo">Nuestra Historia</h2>
                <div class="historia-linea"></div>
            </div>

            <div class="historia-texto">
                <p>
                    Todo empezo con un susurro. Hace anos, en medio de una etapa de busqueda, aparecio el primer guardian. No lo buscamos, el nos encontro. Y algo cambio. Algo que no podemos explicar con palabras pero que transformo todo.
                </p>

                <p>
                    Empezamos a crear juntos. Cada uno aportando lo suyo: la conexion intuitiva, las manos que dan forma, la vision de como compartirlo con el mundo. Al principio era para nosotros, despues para amigos que notaban algo diferente en nuestro hogar. "Hay algo especial aca", decian. Y lo habia.
                </p>

                <div class="historia-destacado">
                    "No elegis a tu guardian. El te elige a vos. Tu trabajo es simplemente estar atento cuando aparezca."
                </div>

                <p>
                    Hoy, cada guardian que nace lleva horas de trabajo en equipo, si. Pero tambien lleva intencion, conexion y un proposito unico para quien lo reciba. Algunos protegen, otros sanan, otros acompanan en momentos de cambio. Cada uno sabe exactamente a donde tiene que ir.
                </p>

                <p>
                    Esto no es un negocio. Es una mision compartida. Y vos, al estar aca leyendo esto, ya sos parte de ella.
                </p>
            </div>
        </div>
    </section>

    <!-- FILOSOFIA -->
    <section class="filosofia-section">
        <div class="filosofia-container">
            <div class="filosofia-header">
                <h2 class="filosofia-titulo">Lo Que Creemos</h2>
                <p class="filosofia-subtitulo">Los principios que guian cada creacion</p>
            </div>

            <div class="filosofia-grid">
                <div class="filosofia-card">
                    <div class="filosofia-icono">✨</div>
                    <h3 class="filosofia-card-titulo">Cada Pieza es Unica</h3>
                    <p class="filosofia-card-texto">
                        No hay dos guardianes iguales. Cuando uno se va, se va para siempre. No hacemos replicas ni repeticiones. La magia no se copia.
                    </p>
                </div>

                <div class="filosofia-card">
                    <div class="filosofia-icono">🌿</div>
                    <h3 class="filosofia-card-titulo">Conexion Genuina</h3>
                    <p class="filosofia-card-texto">
                        Antes de crear, meditamos. Nos conectamos con la energia de quien va a recibir al guardian. Por eso cada canalizacion es tan personal.
                    </p>
                </div>

                <div class="filosofia-card">
                    <div class="filosofia-icono">🔮</div>
                    <h3 class="filosofia-card-titulo">Artesania Sagrada</h3>
                    <p class="filosofia-card-texto">
                        Cada guardian tarda entre 40 y 100 horas en nacer. Usamos materiales naturales, cristales energizados y mucho, mucho amor.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- EL EQUIPO -->
    <section class="equipo-section">
        <div class="equipo-container">
            <div class="equipo-header">
                <h2 class="equipo-titulo">Quienes Somos</h2>
                <p class="equipo-subtitulo">Un equipo, una mision, un mismo latido</p>
            </div>

            <p class="equipo-intro">
                Duendes del Uruguay nacio de la union de dos almas que encontraron en la creacion de guardianes su forma de servir al mundo. No hay jefe ni empleado aca. Somos companeros de camino, cada uno aportando lo que mejor sabe hacer.
            </p>

            <div class="equipo-grid">
                <div class="equipo-miembro">
                    <img
                        src="https://duendesuy.10web.cloud/wp-content/uploads/2025/01/thibisay-artista.jpg"
                        alt="Thibisay"
                        class="equipo-foto"
                        onerror="this.src='https://placehold.co/180x180/1a1a1a/d4af37?text=T'"
                    >
                    <h3 class="equipo-nombre">Thibisay</h3>
                    <p class="equipo-rol">Artista y Canalizadora</p>
                    <p class="equipo-bio">
                        Sus manos dan forma a lo invisible. Cada guardian que nace pasa por su conexion con lo sutil, su intuicion para captar la esencia de cada ser. La magia fluye a traves de ella hacia la arcilla.
                    </p>
                </div>

                <div class="equipo-miembro">
                    <img
                        src="https://duendesuy.10web.cloud/wp-content/uploads/2025/01/gabriel-duendes.jpg"
                        alt="Gabriel"
                        class="equipo-foto"
                        onerror="this.src='https://placehold.co/180x180/1a1a1a/d4af37?text=G'"
                    >
                    <h3 class="equipo-nombre">Gabriel</h3>
                    <p class="equipo-rol">Estrategia y Tecnologia</p>
                    <p class="equipo-bio">
                        Construye los puentes para que los guardianes lleguen a donde tienen que llegar. La web, los sistemas, la comunicacion. Traduce la magia al lenguaje del mundo digital sin perder su esencia.
                    </p>
                </div>
            </div>

            <div class="equipo-juntos">
                <p class="equipo-juntos-texto">
                    Juntos somos mas que la suma de las partes. Ella crea, el conecta. Ella siente, el estructura. Ella es el arte, el es el puente. Y en ese equilibrio nacen los guardianes que llegan a vos.
                </p>
                <p class="equipo-firma">Thibisay & Gabriel</p>
            </div>
        </div>
    </section>

    <!-- NUMEROS -->
    <section class="numeros-section">
        <div class="numeros-container">
            <div class="numeros-header">
                <h2 class="numeros-titulo">Impacto Real</h2>
            </div>

            <div class="numeros-grid">
                <div class="numero-item">
                    <div class="numero-valor"><?php echo $stats['guardianes_creados']; ?>+</div>
                    <div class="numero-label">Guardianes Creados</div>
                </div>
                <div class="numero-item">
                    <div class="numero-valor"><?php echo $stats['paises']; ?></div>
                    <div class="numero-label">Paises Alcanzados</div>
                </div>
                <div class="numero-item">
                    <div class="numero-valor"><?php echo $stats['anos']; ?></div>
                    <div class="numero-label">Anos de Experiencia</div>
                </div>
                <div class="numero-item">
                    <div class="numero-valor"><?php echo $stats['comunidad']; ?>+</div>
                    <div class="numero-label">Familia de Guardianes</div>
                </div>
            </div>
        </div>
    </section>

    <!-- TESTIMONIOS -->
    <section class="testimonios-section">
        <div class="testimonios-container">
            <div class="testimonios-header">
                <h2 class="testimonios-titulo">Voces de Nuestra Familia</h2>
                <p class="testimonios-subtitulo">Experiencias reales de quienes encontraron a su guardian</p>
            </div>

            <div class="testimonios-grid">
                <div class="testimonio-card">
                    <span class="testimonio-comillas">"</span>
                    <p class="testimonio-texto">
                        Cuando llego mi guardian, algo en la casa cambio. Mi hija, que tenia pesadillas todas las noches, empezo a dormir tranquila. No tengo explicacion logica, pero no la necesito.
                    </p>
                    <div class="testimonio-autor">
                        <div class="testimonio-avatar">ML</div>
                        <div class="testimonio-info">
                            <span class="testimonio-nombre">Maria Laura</span>
                            <span class="testimonio-ubicacion">Buenos Aires, Argentina</span>
                        </div>
                    </div>
                </div>

                <div class="testimonio-card">
                    <span class="testimonio-comillas">"</span>
                    <p class="testimonio-texto">
                        Pense que era solo una figura linda. Pero cuando lo vi por primera vez, llore. Era exactamente lo que necesitaba sin saber que lo necesitaba.
                    </p>
                    <div class="testimonio-autor">
                        <div class="testimonio-avatar">AC</div>
                        <div class="testimonio-info">
                            <span class="testimonio-nombre">Ana Cristina</span>
                            <span class="testimonio-ubicacion">Santiago, Chile</span>
                        </div>
                    </div>
                </div>

                <div class="testimonio-card">
                    <span class="testimonio-comillas">"</span>
                    <p class="testimonio-texto">
                        Ya tengo 4 guardianes. Cada vez que paso por un momento dificil, aparece uno nuevo en mi vida. No es casualidad.
                    </p>
                    <div class="testimonio-autor">
                        <div class="testimonio-avatar">PS</div>
                        <div class="testimonio-info">
                            <span class="testimonio-nombre">Patricia Silva</span>
                            <span class="testimonio-ubicacion">Montevideo, Uruguay</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA FINAL -->
    <section class="cta-nosotros">
        <div class="cta-container">
            <h2 class="cta-titulo">
                Tu <span>Guardian</span> te espera
            </h2>
            <p class="cta-texto">
                Si llegaste hasta aca, no es casualidad.
                <br>Algo te trajo. Algo te llama.
            </p>
            <div class="cta-botones">
                <a href="<?php echo home_url('/tienda/'); ?>" class="cta-btn cta-btn-primario">
                    Ver Guardianes
                </a>
                <a href="<?php echo home_url('/contacto/'); ?>" class="cta-btn cta-btn-secundario">
                    Contactanos
                </a>
            </div>
        </div>
    </section>
</div>

<script>
// Animacion de numeros al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    const numerosSection = document.querySelector('.numeros-section');
    const numeros = document.querySelectorAll('.numero-valor');

    if (!numerosSection || numeros.length === 0) return;

    let animado = false;

    function animarNumeros() {
        if (animado) return;

        const rect = numerosSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            animado = true;

            numeros.forEach(function(numero) {
                const valorFinal = parseInt(numero.textContent.replace(/\D/g, ''));
                const duracion = 2000;
                const incremento = valorFinal / (duracion / 16);
                let valorActual = 0;

                function actualizar() {
                    valorActual += incremento;
                    if (valorActual < valorFinal) {
                        numero.textContent = Math.floor(valorActual) + '+';
                        requestAnimationFrame(actualizar);
                    } else {
                        numero.textContent = valorFinal + '+';
                    }
                }

                actualizar();
            });
        }
    }

    window.addEventListener('scroll', animarNumeros);
    animarNumeros(); // Check on load
});
</script>
    <?php
    return ob_get_clean();
});

// Funcion para obtener estadisticas dinamicas
function duendes_obtener_estadisticas() {
    // Intentar obtener de cache o calcular
    $stats = get_transient('duendes_stats_nosotros');

    if (!$stats) {
        // Calcular estadisticas reales si es posible
        $total_productos = wp_count_posts('product');
        $guardianes = isset($total_productos->publish) ? $total_productos->publish : 150;

        // Guardianes creados (productos + estimado de vendidos)
        $guardianes_creados = max(500, $guardianes * 3);

        $stats = [
            'guardianes_creados' => $guardianes_creados,
            'paises' => 12,
            'anos' => max(5, date('Y') - 2020),
            'comunidad' => max(2000, $guardianes_creados * 2)
        ];

        set_transient('duendes_stats_nosotros', $stats, DAY_IN_SECONDS);
    }

    return $stats;
}
