<?php
/**
 * Plugin Name: Duendes Experiencia Magica
 * Description: Experiencia de tienda completamente custom con animaciones premium
 * Version: 4.0
 */

if (!defined('ABSPATH')) exit;

// Solo interceptar paginas de PRODUCTO individual (no la tienda)
// La tienda usa el tema normal con su menu
add_action('template_redirect', function() {
    // NO interceptar tienda - dejar que use el tema normal con menu
    // if (is_shop() || is_product_category()) { ... }

    // Solo producto individual
    if (is_product()) {
        duendes_render_producto();
        exit;
    }
});

// ============================================================================
// CONFIGURACION DE CATEGORIAS Y TIPOS
// ============================================================================
function duendes_get_categoria_config($slug) {
    $configs = [
        'proteccion' => [
            'nombre' => 'Protección',
            'color_primario' => '#4A90D9',
            'color_secundario' => '#C0C0C0',
            'color_orbe' => 'rgba(74, 144, 217, 0.25)',
            'color_orbe2' => 'rgba(192, 192, 192, 0.2)',
            'gradiente' => 'linear-gradient(135deg, #1a2a4a 0%, #0a1628 100%)',
            'animacion' => 'escudo',
        ],
        'amor' => [
            'nombre' => 'Amor',
            'color_primario' => '#E91E8C',
            'color_secundario' => '#FF6B9D',
            'color_orbe' => 'rgba(233, 30, 140, 0.25)',
            'color_orbe2' => 'rgba(255, 107, 157, 0.2)',
            'gradiente' => 'linear-gradient(135deg, #2a1a2a 0%, #1a0a1a 100%)',
            'animacion' => 'corazones',
        ],
        'dinero-abundancia-negocios' => [
            'nombre' => 'Abundancia',
            'color_primario' => '#C6A962',
            'color_secundario' => '#2ECC71',
            'color_orbe' => 'rgba(198, 169, 98, 0.3)',
            'color_orbe2' => 'rgba(46, 204, 113, 0.2)',
            'gradiente' => 'linear-gradient(135deg, #1a1a0a 0%, #0a0a00 100%)',
            'animacion' => 'monedas',
        ],
        'salud' => [
            'nombre' => 'Sanación',
            'color_primario' => '#2ECC71',
            'color_secundario' => '#1ABC9C',
            'color_orbe' => 'rgba(46, 204, 113, 0.25)',
            'color_orbe2' => 'rgba(26, 188, 156, 0.2)',
            'gradiente' => 'linear-gradient(135deg, #0a1a0a 0%, #001a0a 100%)',
            'animacion' => 'hojas',
        ],
        'sabiduria-guia-claridad' => [
            'nombre' => 'Sabiduría',
            'color_primario' => '#9B59B6',
            'color_secundario' => '#3498DB',
            'color_orbe' => 'rgba(155, 89, 182, 0.25)',
            'color_orbe2' => 'rgba(52, 152, 219, 0.2)',
            'gradiente' => 'linear-gradient(135deg, #1a0a2a 0%, #0a0a1a 100%)',
            'animacion' => 'constelaciones',
        ],
    ];

    // Buscar por slug parcial
    foreach ($configs as $key => $config) {
        if (strpos($slug, $key) !== false || strpos($key, $slug) !== false) {
            return $config;
        }
    }

    // Default dorado
    return [
        'nombre' => 'Guardian',
        'color_primario' => '#C6A962',
        'color_secundario' => '#9370DB',
        'color_orbe' => 'rgba(198, 169, 98, 0.25)',
        'color_orbe2' => 'rgba(147, 112, 219, 0.2)',
        'gradiente' => 'linear-gradient(135deg, #0a0a0a 0%, #050505 100%)',
        'animacion' => 'orbes',
    ];
}

function duendes_get_tipo_config($tipo) {
    $tipos = [
        'duende' => [
            'nombre' => 'Duende',
            'animacion' => 'hongos',
            'icono' => 'mushroom',
        ],
        'elfo' => [
            'nombre' => 'Elfo',
            'animacion' => 'estrellas',
            'icono' => 'bow',
        ],
        'hada' => [
            'nombre' => 'Hada',
            'animacion' => 'polvo_magico',
            'icono' => 'wings',
        ],
        'bruja' => [
            'nombre' => 'Bruja',
            'animacion' => 'escoba',
            'icono' => 'cauldron',
        ],
        'brujo' => [
            'nombre' => 'Brujo',
            'animacion' => 'caldero',
            'icono' => 'cauldron',
        ],
        'mago' => [
            'nombre' => 'Mago',
            'animacion' => 'varita',
            'icono' => 'wand',
        ],
        'hechicero' => [
            'nombre' => 'Hechicero',
            'animacion' => 'runas',
            'icono' => 'runes',
        ],
        'hechicera' => [
            'nombre' => 'Hechicera',
            'animacion' => 'runas',
            'icono' => 'runes',
        ],
    ];

    $tipo_lower = strtolower($tipo);
    return $tipos[$tipo_lower] ?? [
        'nombre' => ucfirst($tipo),
        'animacion' => 'orbes',
        'icono' => 'sparkle',
    ];
}

// ============================================================================
// ICONOS SVG PREMIUM
// ============================================================================
function duendes_icon($name, $size = 32) {
    $icons = [
        'shield' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        'heart' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
        'coin' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h6M9 15h6"/></svg>',
        'leaf' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
        'eye' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
        'star' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        'moon' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
        'compass' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
        'sun' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>',
        'package' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"/><polyline points="2.32 6.16 12 11 21.68 6.16"/><line x1="12" y1="22.76" x2="12" y2="11"/></svg>',
        'ruler' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/></svg>',
        'check' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
        'truck' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
        'gift' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',
        'cart' => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
        'crystal' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h12l4 8-10 10L2 11z"/><path d="M12 21V11"/><path d="M2 11h20"/><path d="M6 3l6 8 6-8"/></svg>',
        'scroll' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 3H9v13h12V5a2 2 0 0 0-2-2Z"/></svg>',
        'wand' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/></svg>',
        'certificate' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>',
        'portal' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
        'cauldron' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="8" rx="9" ry="4"/><path d="M3 8v6c0 2.2 4 4 9 4s9-1.8 9-4V8"/><path d="M3 14c0 2.2 4 4 9 4s9-1.8 9-4"/><circle cx="5" cy="20" r="2"/><circle cx="19" cy="20" r="2"/></svg>',
        'broom' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 20L16 8"/><path d="M16 8l4-4"/><path d="M16 8c-4 4-2 8 2 12"/><path d="M16 8c4 4 8 2 12-2"/></svg>',
        'mushroom' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4C6 4 2 8 2 12h20c0-4-4-8-10-8z"/><path d="M8 12v8"/><path d="M16 12v8"/><path d="M8 20h8"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="14" cy="9" r="1" fill="currentColor"/></svg>',
        'wings' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 12c-4-4-8-2-10 2 4 1 7 0 10-2z"/><path d="M12 12c4-4 8-2 10 2-4 1-7 0-10-2z"/><path d="M12 12v8"/><circle cx="12" cy="8" r="3"/></svg>',
    ];
    return $icons[$name] ?? $icons['star'];
}

// ============================================================================
// ANIMACIONES SVG PREMIUM
// ============================================================================
function duendes_animacion($tipo, $color = '#C6A962') {
    $animaciones = [];

    // MONEDAS CAYENDO (Abundancia)
    $animaciones['monedas'] = '
    <div class="anim-monedas">
        <svg class="moneda m1" viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="18" ry="18" fill="'.$color.'" opacity="0.9"/><ellipse cx="20" cy="20" rx="14" ry="14" fill="none" stroke="#fff" stroke-width="1" opacity="0.5"/><text x="20" y="26" text-anchor="middle" fill="#1a1a1a" font-size="16" font-family="serif">$</text></svg>
        <svg class="moneda m2" viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="18" ry="18" fill="'.$color.'" opacity="0.8"/><ellipse cx="20" cy="20" rx="14" ry="14" fill="none" stroke="#fff" stroke-width="1" opacity="0.5"/><text x="20" y="26" text-anchor="middle" fill="#1a1a1a" font-size="16" font-family="serif">$</text></svg>
        <svg class="moneda m3" viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="18" ry="18" fill="'.$color.'" opacity="0.7"/><ellipse cx="20" cy="20" rx="14" ry="14" fill="none" stroke="#fff" stroke-width="1" opacity="0.5"/><text x="20" y="26" text-anchor="middle" fill="#1a1a1a" font-size="16" font-family="serif">$</text></svg>
        <svg class="moneda m4" viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="18" ry="18" fill="'.$color.'" opacity="0.6"/><ellipse cx="20" cy="20" rx="14" ry="14" fill="none" stroke="#fff" stroke-width="1" opacity="0.5"/><text x="20" y="26" text-anchor="middle" fill="#1a1a1a" font-size="16" font-family="serif">$</text></svg>
        <svg class="moneda m5" viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="18" ry="18" fill="'.$color.'" opacity="0.5"/><ellipse cx="20" cy="20" rx="14" ry="14" fill="none" stroke="#fff" stroke-width="1" opacity="0.5"/><text x="20" y="26" text-anchor="middle" fill="#1a1a1a" font-size="16" font-family="serif">$</text></svg>
    </div>
    <style>
    .anim-monedas { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    .moneda { position: absolute; width: 50px; height: 50px; animation: caerMoneda 4s ease-in infinite; }
    .m1 { left: 10%; animation-delay: 0s; }
    .m2 { left: 30%; animation-delay: 0.8s; width: 40px; }
    .m3 { left: 50%; animation-delay: 1.6s; width: 45px; }
    .m4 { left: 70%; animation-delay: 2.4s; width: 35px; }
    .m5 { left: 85%; animation-delay: 3.2s; width: 42px; }
    @keyframes caerMoneda {
        0% { top: -60px; transform: rotateY(0deg) rotateX(0deg); opacity: 1; }
        100% { top: 110%; transform: rotateY(720deg) rotateX(360deg); opacity: 0; }
    }
    </style>';

    // CORAZONES FLOTANDO (Amor)
    $animaciones['corazones'] = '
    <div class="anim-corazones">
        <svg class="corazon c1" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="'.$color.'" opacity="0.6"/></svg>
        <svg class="corazon c2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="'.$color.'" opacity="0.5"/></svg>
        <svg class="corazon c3" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="'.$color.'" opacity="0.4"/></svg>
        <svg class="corazon c4" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="'.$color.'" opacity="0.3"/></svg>
    </div>
    <style>
    .anim-corazones { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    .corazon { position: absolute; animation: flotar 6s ease-in-out infinite; }
    .c1 { width: 40px; left: 15%; bottom: -50px; animation-delay: 0s; }
    .c2 { width: 30px; left: 40%; bottom: -50px; animation-delay: 1.5s; }
    .c3 { width: 35px; left: 65%; bottom: -50px; animation-delay: 3s; }
    .c4 { width: 25px; left: 85%; bottom: -50px; animation-delay: 4.5s; }
    @keyframes flotar {
        0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-120vh) scale(0.5) rotate(20deg); opacity: 0; }
    }
    </style>';

    // ESCUDO BRILLANTE (Protección)
    $animaciones['escudo'] = '
    <div class="anim-escudo">
        <svg class="escudo-central" viewBox="0 0 100 120">
            <defs>
                <linearGradient id="escudoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:'.$color.';stop-opacity:0.8"/>
                    <stop offset="100%" style="stop-color:#C0C0C0;stop-opacity:0.6"/>
                </linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <path d="M50 5 L90 25 L90 55 C90 85 50 115 50 115 C50 115 10 85 10 55 L10 25 Z" fill="url(#escudoGrad)" filter="url(#glow)" class="escudo-path"/>
            <path d="M50 20 L75 35 L75 55 C75 75 50 95 50 95 C50 95 25 75 25 55 L25 35 Z" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
        </svg>
        <div class="escudo-pulso"></div>
    </div>
    <style>
    .anim-escudo { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
    .escudo-central { width: 200px; height: 240px; opacity: 0.3; animation: escudoPulse 3s ease-in-out infinite; }
    .escudo-path { animation: escudoBrillo 3s ease-in-out infinite; }
    .escudo-pulso { position: absolute; width: 250px; height: 250px; border: 2px solid '.$color.'; border-radius: 50%; opacity: 0; animation: pulsarEscudo 3s ease-out infinite; }
    @keyframes escudoPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    @keyframes escudoBrillo { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
    @keyframes pulsarEscudo { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }
    </style>';

    // HOJAS CAYENDO (Salud)
    $animaciones['hojas'] = '
    <div class="anim-hojas">
        <svg class="hoja h1" viewBox="0 0 30 40"><path d="M15 0 C25 10 25 30 15 40 C5 30 5 10 15 0" fill="'.$color.'" opacity="0.7"/><path d="M15 5 L15 35" stroke="rgba(255,255,255,0.3)" stroke-width="1"/></svg>
        <svg class="hoja h2" viewBox="0 0 30 40"><path d="M15 0 C25 10 25 30 15 40 C5 30 5 10 15 0" fill="'.$color.'" opacity="0.6"/><path d="M15 5 L15 35" stroke="rgba(255,255,255,0.3)" stroke-width="1"/></svg>
        <svg class="hoja h3" viewBox="0 0 30 40"><path d="M15 0 C25 10 25 30 15 40 C5 30 5 10 15 0" fill="'.$color.'" opacity="0.5"/><path d="M15 5 L15 35" stroke="rgba(255,255,255,0.3)" stroke-width="1"/></svg>
        <svg class="hoja h4" viewBox="0 0 30 40"><path d="M15 0 C25 10 25 30 15 40 C5 30 5 10 15 0" fill="'.$color.'" opacity="0.4"/><path d="M15 5 L15 35" stroke="rgba(255,255,255,0.3)" stroke-width="1"/></svg>
        <svg class="hoja h5" viewBox="0 0 30 40"><path d="M15 0 C25 10 25 30 15 40 C5 30 5 10 15 0" fill="'.$color.'" opacity="0.5"/><path d="M15 5 L15 35" stroke="rgba(255,255,255,0.3)" stroke-width="1"/></svg>
    </div>
    <style>
    .anim-hojas { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    .hoja { position: absolute; top: -50px; animation: caerHoja 8s linear infinite; }
    .h1 { width: 30px; left: 10%; animation-delay: 0s; }
    .h2 { width: 25px; left: 30%; animation-delay: 1.5s; }
    .h3 { width: 35px; left: 50%; animation-delay: 3s; }
    .h4 { width: 28px; left: 70%; animation-delay: 4.5s; }
    .h5 { width: 32px; left: 88%; animation-delay: 6s; }
    @keyframes caerHoja {
        0% { top: -50px; transform: rotate(0deg) translateX(0); }
        25% { transform: rotate(90deg) translateX(30px); }
        50% { transform: rotate(180deg) translateX(-30px); }
        75% { transform: rotate(270deg) translateX(30px); }
        100% { top: 110%; transform: rotate(360deg) translateX(0); }
    }
    </style>';

    // CONSTELACIONES (Sabiduría)
    $animaciones['constelaciones'] = '
    <div class="anim-constelaciones">
        <svg class="constelacion" viewBox="0 0 400 300">
            <defs>
                <filter id="starGlow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <!-- Lineas de constelacion -->
            <line x1="50" y1="50" x2="120" y2="80" stroke="'.$color.'" stroke-width="0.5" opacity="0.3" class="linea-const"/>
            <line x1="120" y1="80" x2="180" y2="40" stroke="'.$color.'" stroke-width="0.5" opacity="0.3" class="linea-const"/>
            <line x1="180" y1="40" x2="250" y2="90" stroke="'.$color.'" stroke-width="0.5" opacity="0.3" class="linea-const"/>
            <line x1="250" y1="90" x2="320" y2="60" stroke="'.$color.'" stroke-width="0.5" opacity="0.3" class="linea-const"/>
            <line x1="120" y1="80" x2="150" y2="150" stroke="'.$color.'" stroke-width="0.5" opacity="0.3" class="linea-const"/>
            <line x1="250" y1="90" x2="280" y2="170" stroke="'.$color.'" stroke-width="0.5" opacity="0.3" class="linea-const"/>
            <!-- Estrellas -->
            <circle cx="50" cy="50" r="4" fill="'.$color.'" filter="url(#starGlow)" class="estrella-const e1"/>
            <circle cx="120" cy="80" r="5" fill="'.$color.'" filter="url(#starGlow)" class="estrella-const e2"/>
            <circle cx="180" cy="40" r="3" fill="'.$color.'" filter="url(#starGlow)" class="estrella-const e3"/>
            <circle cx="250" cy="90" r="6" fill="'.$color.'" filter="url(#starGlow)" class="estrella-const e4"/>
            <circle cx="320" cy="60" r="4" fill="'.$color.'" filter="url(#starGlow)" class="estrella-const e5"/>
            <circle cx="150" cy="150" r="3" fill="'.$color.'" filter="url(#starGlow)" class="estrella-const e6"/>
            <circle cx="280" cy="170" r="4" fill="'.$color.'" filter="url(#starGlow)" class="estrella-const e7"/>
        </svg>
    </div>
    <style>
    .anim-constelaciones { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; opacity: 0.6; }
    .constelacion { width: 100%; max-width: 600px; }
    .estrella-const { animation: brillar 2s ease-in-out infinite; }
    .e1 { animation-delay: 0s; }
    .e2 { animation-delay: 0.3s; }
    .e3 { animation-delay: 0.6s; }
    .e4 { animation-delay: 0.9s; }
    .e5 { animation-delay: 1.2s; }
    .e6 { animation-delay: 1.5s; }
    .e7 { animation-delay: 1.8s; }
    .linea-const { animation: lineaBrillar 4s ease-in-out infinite; }
    @keyframes brillar { 0%, 100% { opacity: 0.5; r: attr(r); } 50% { opacity: 1; } }
    @keyframes lineaBrillar { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.5; } }
    </style>';

    // BRUJA EN ESCOBA
    $animaciones['escoba'] = '
    <div class="anim-escoba">
        <svg class="bruja-volando" viewBox="0 0 120 60">
            <!-- Escoba -->
            <rect x="20" y="35" width="80" height="4" rx="2" fill="#8B4513"/>
            <path d="M90 30 L120 25 L120 45 L90 40 Z" fill="#654321"/>
            <!-- Capa -->
            <path d="M35 20 Q45 35 30 50 L55 40 Q50 25 35 20" fill="'.$color.'" opacity="0.8"/>
            <!-- Cuerpo -->
            <circle cx="45" cy="25" r="10" fill="#2a2a2a"/>
            <!-- Sombrero -->
            <path d="M35 18 L45 0 L55 18" fill="#1a1a1a"/>
            <ellipse cx="45" cy="18" rx="15" ry="4" fill="#1a1a1a"/>
        </svg>
        <div class="estela-magica"></div>
    </div>
    <style>
    .anim-escoba { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    .bruja-volando { position: absolute; width: 120px; animation: volar 12s linear infinite; }
    .estela-magica { position: absolute; width: 100px; height: 2px; background: linear-gradient(90deg, transparent, '.$color.', transparent); animation: volarEstela 12s linear infinite; opacity: 0.5; }
    @keyframes volar {
        0% { left: -150px; top: 20%; transform: rotate(-5deg); }
        25% { top: 30%; transform: rotate(5deg); }
        50% { top: 15%; transform: rotate(-5deg); }
        75% { top: 25%; transform: rotate(5deg); }
        100% { left: 110%; top: 20%; transform: rotate(-5deg); }
    }
    @keyframes volarEstela {
        0% { left: -250px; top: calc(20% + 25px); }
        25% { top: calc(30% + 25px); }
        50% { top: calc(15% + 25px); }
        75% { top: calc(25% + 25px); }
        100% { left: calc(110% - 100px); top: calc(20% + 25px); }
    }
    </style>';

    // CALDERO BURBUJEANDO
    $animaciones['caldero'] = '
    <div class="anim-caldero">
        <svg class="caldero-central" viewBox="0 0 100 100">
            <ellipse cx="50" cy="75" rx="40" ry="15" fill="#1a1a1a"/>
            <path d="M15 40 Q10 75 20 80 L80 80 Q90 75 85 40 Q70 35 50 35 Q30 35 15 40" fill="#2a2a2a"/>
            <ellipse cx="50" cy="40" rx="35" ry="12" fill="'.$color.'" opacity="0.6"/>
            <circle class="burbuja b1" cx="35" cy="42" r="4" fill="'.$color.'" opacity="0.8"/>
            <circle class="burbuja b2" cx="55" cy="38" r="3" fill="'.$color.'" opacity="0.7"/>
            <circle class="burbuja b3" cx="65" cy="43" r="5" fill="'.$color.'" opacity="0.6"/>
            <circle class="burbuja b4" cx="45" cy="40" r="3" fill="'.$color.'" opacity="0.8"/>
        </svg>
        <div class="vapor v1"></div>
        <div class="vapor v2"></div>
        <div class="vapor v3"></div>
    </div>
    <style>
    .anim-caldero { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
    .caldero-central { width: 200px; opacity: 0.4; }
    .burbuja { animation: burbujear 2s ease-in-out infinite; }
    .b1 { animation-delay: 0s; }
    .b2 { animation-delay: 0.5s; }
    .b3 { animation-delay: 1s; }
    .b4 { animation-delay: 1.5s; }
    .vapor { position: absolute; width: 30px; height: 60px; background: linear-gradient(to top, '.$color.' 0%, transparent 100%); border-radius: 50%; opacity: 0; animation: subirVapor 3s ease-out infinite; }
    .v1 { left: calc(50% - 30px); animation-delay: 0s; }
    .v2 { left: 50%; animation-delay: 1s; }
    .v3 { left: calc(50% + 30px); animation-delay: 2s; }
    @keyframes burbujear { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-5px) scale(1.2); } }
    @keyframes subirVapor { 0% { bottom: 50%; opacity: 0; transform: scale(0.5); } 50% { opacity: 0.3; } 100% { bottom: 90%; opacity: 0; transform: scale(1.5); } }
    </style>';

    // POLVO MAGICO (Hadas)
    $animaciones['polvo_magico'] = '
    <div class="anim-polvo">
        <div class="particula p1"></div>
        <div class="particula p2"></div>
        <div class="particula p3"></div>
        <div class="particula p4"></div>
        <div class="particula p5"></div>
        <div class="particula p6"></div>
        <div class="particula p7"></div>
        <div class="particula p8"></div>
        <div class="particula p9"></div>
        <div class="particula p10"></div>
        <div class="particula p11"></div>
        <div class="particula p12"></div>
    </div>
    <style>
    .anim-polvo { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    .particula { position: absolute; width: 6px; height: 6px; background: '.$color.'; border-radius: 50%; box-shadow: 0 0 10px '.$color.', 0 0 20px '.$color.'; animation: flotarPolvo 8s ease-in-out infinite; }
    .p1 { left: 10%; top: 20%; animation-delay: 0s; }
    .p2 { left: 20%; top: 60%; animation-delay: 0.5s; width: 4px; height: 4px; }
    .p3 { left: 35%; top: 30%; animation-delay: 1s; }
    .p4 { left: 45%; top: 70%; animation-delay: 1.5s; width: 5px; height: 5px; }
    .p5 { left: 55%; top: 40%; animation-delay: 2s; }
    .p6 { left: 65%; top: 80%; animation-delay: 2.5s; width: 4px; height: 4px; }
    .p7 { left: 75%; top: 25%; animation-delay: 3s; }
    .p8 { left: 85%; top: 55%; animation-delay: 3.5s; width: 5px; height: 5px; }
    .p9 { left: 15%; top: 85%; animation-delay: 4s; width: 4px; height: 4px; }
    .p10 { left: 90%; top: 35%; animation-delay: 4.5s; }
    .p11 { left: 5%; top: 45%; animation-delay: 5s; width: 5px; height: 5px; }
    .p12 { left: 50%; top: 15%; animation-delay: 5.5s; }
    @keyframes flotarPolvo {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        25% { transform: translate(20px, -30px) scale(1.5); opacity: 1; }
        50% { transform: translate(-10px, -60px) scale(1); opacity: 0.6; }
        75% { transform: translate(30px, -40px) scale(1.3); opacity: 0.8; }
    }
    </style>';

    // VARITA CON CHISPAS (Magos)
    $animaciones['varita'] = '
    <div class="anim-varita">
        <svg class="varita-svg" viewBox="0 0 100 100">
            <line x1="20" y1="80" x2="60" y2="40" stroke="#8B4513" stroke-width="4" stroke-linecap="round"/>
            <circle cx="60" cy="40" r="6" fill="'.$color.'"/>
            <circle class="chispa ch1" cx="65" cy="35" r="2" fill="'.$color.'"/>
            <circle class="chispa ch2" cx="55" cy="35" r="2" fill="'.$color.'"/>
            <circle class="chispa ch3" cx="60" cy="30" r="2" fill="'.$color.'"/>
            <circle class="chispa ch4" cx="70" cy="40" r="2" fill="'.$color.'"/>
            <circle class="chispa ch5" cx="55" cy="45" r="2" fill="'.$color.'"/>
        </svg>
        <div class="rayo-magico"></div>
    </div>
    <style>
    .anim-varita { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; opacity: 0.5; }
    .varita-svg { width: 150px; animation: agitarVarita 4s ease-in-out infinite; }
    .chispa { animation: brillarChispa 0.5s ease-in-out infinite; }
    .ch1 { animation-delay: 0s; }
    .ch2 { animation-delay: 0.1s; }
    .ch3 { animation-delay: 0.2s; }
    .ch4 { animation-delay: 0.3s; }
    .ch5 { animation-delay: 0.4s; }
    .rayo-magico { position: absolute; width: 2px; height: 100px; background: linear-gradient(to bottom, '.$color.', transparent); transform: rotate(-45deg); animation: rayoMagico 4s ease-in-out infinite; opacity: 0; }
    @keyframes agitarVarita { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } }
    @keyframes brillarChispa { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
    @keyframes rayoMagico { 0%, 40%, 100% { opacity: 0; } 45%, 55% { opacity: 0.8; } }
    </style>';

    // RUNAS BRILLANTES (Hechiceros)
    $animaciones['runas'] = '
    <div class="anim-runas">
        <svg class="runa r1" viewBox="0 0 40 50"><path d="M20 5 L35 25 L20 45 L5 25 Z" fill="none" stroke="'.$color.'" stroke-width="2"/><path d="M20 15 L20 35 M10 25 L30 25" stroke="'.$color.'" stroke-width="1.5"/></svg>
        <svg class="runa r2" viewBox="0 0 40 50"><path d="M10 5 L30 5 L30 45 L10 45 Z" fill="none" stroke="'.$color.'" stroke-width="2"/><path d="M10 25 L30 25" stroke="'.$color.'" stroke-width="1.5"/></svg>
        <svg class="runa r3" viewBox="0 0 40 50"><path d="M20 5 L35 45 M20 5 L5 45 M10 30 L30 30" fill="none" stroke="'.$color.'" stroke-width="2"/></svg>
        <svg class="runa r4" viewBox="0 0 40 50"><circle cx="20" cy="25" r="15" fill="none" stroke="'.$color.'" stroke-width="2"/><path d="M20 10 L20 40 M5 25 L35 25" stroke="'.$color.'" stroke-width="1.5"/></svg>
    </div>
    <style>
    .anim-runas { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 30px; pointer-events: none; opacity: 0.4; }
    .runa { width: 60px; animation: brillarRuna 3s ease-in-out infinite; }
    .r1 { animation-delay: 0s; }
    .r2 { animation-delay: 0.75s; }
    .r3 { animation-delay: 1.5s; }
    .r4 { animation-delay: 2.25s; }
    @keyframes brillarRuna { 0%, 100% { opacity: 0.2; transform: scale(1); filter: drop-shadow(0 0 5px '.$color.'); } 50% { opacity: 1; transform: scale(1.1); filter: drop-shadow(0 0 20px '.$color.'); } }
    </style>';

    // HONGOS (Duendes)
    $animaciones['hongos'] = '
    <div class="anim-hongos">
        <svg class="hongo h1" viewBox="0 0 50 60">
            <ellipse cx="25" cy="25" rx="22" ry="18" fill="'.$color.'"/>
            <rect x="18" y="25" width="14" height="30" rx="3" fill="#f5f5dc"/>
            <circle cx="15" cy="20" r="4" fill="rgba(255,255,255,0.5)"/>
            <circle cx="30" cy="15" r="3" fill="rgba(255,255,255,0.5)"/>
            <circle cx="35" cy="25" r="2" fill="rgba(255,255,255,0.5)"/>
        </svg>
        <svg class="hongo h2" viewBox="0 0 50 60">
            <ellipse cx="25" cy="25" rx="20" ry="16" fill="'.$color.'" opacity="0.8"/>
            <rect x="19" y="25" width="12" height="25" rx="3" fill="#f5f5dc"/>
            <circle cx="18" cy="18" r="3" fill="rgba(255,255,255,0.5)"/>
            <circle cx="32" cy="22" r="2" fill="rgba(255,255,255,0.5)"/>
        </svg>
        <svg class="hongo h3" viewBox="0 0 50 60">
            <ellipse cx="25" cy="25" rx="18" ry="14" fill="'.$color.'" opacity="0.6"/>
            <rect x="20" y="25" width="10" height="20" rx="2" fill="#f5f5dc"/>
            <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.5)"/>
        </svg>
    </div>
    <style>
    .anim-hongos { position: absolute; bottom: 10%; left: 0; right: 0; display: flex; justify-content: center; gap: 40px; pointer-events: none; opacity: 0.5; }
    .hongo { animation: crecerHongo 4s ease-in-out infinite; }
    .h1 { width: 80px; animation-delay: 0s; }
    .h2 { width: 60px; animation-delay: 1s; }
    .h3 { width: 50px; animation-delay: 2s; }
    @keyframes crecerHongo { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.1); } }
    </style>';

    // ESTRELLAS BRILLANTES (Elfos)
    $animaciones['estrellas'] = '
    <div class="anim-estrellas">
        <svg class="estrella-elf e1" viewBox="0 0 30 30"><polygon points="15,0 18,11 30,11 21,18 24,30 15,23 6,30 9,18 0,11 12,11" fill="'.$color.'"/></svg>
        <svg class="estrella-elf e2" viewBox="0 0 30 30"><polygon points="15,0 18,11 30,11 21,18 24,30 15,23 6,30 9,18 0,11 12,11" fill="'.$color.'"/></svg>
        <svg class="estrella-elf e3" viewBox="0 0 30 30"><polygon points="15,0 18,11 30,11 21,18 24,30 15,23 6,30 9,18 0,11 12,11" fill="'.$color.'"/></svg>
        <svg class="estrella-elf e4" viewBox="0 0 30 30"><polygon points="15,0 18,11 30,11 21,18 24,30 15,23 6,30 9,18 0,11 12,11" fill="'.$color.'"/></svg>
        <svg class="estrella-elf e5" viewBox="0 0 30 30"><polygon points="15,0 18,11 30,11 21,18 24,30 15,23 6,30 9,18 0,11 12,11" fill="'.$color.'"/></svg>
    </div>
    <style>
    .anim-estrellas { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    .estrella-elf { position: absolute; opacity: 0; animation: parpadearEstrella 4s ease-in-out infinite; }
    .e1 { width: 20px; left: 15%; top: 20%; animation-delay: 0s; }
    .e2 { width: 15px; left: 35%; top: 40%; animation-delay: 0.8s; }
    .e3 { width: 25px; left: 60%; top: 15%; animation-delay: 1.6s; }
    .e4 { width: 18px; left: 80%; top: 35%; animation-delay: 2.4s; }
    .e5 { width: 22px; left: 45%; top: 60%; animation-delay: 3.2s; }
    @keyframes parpadearEstrella {
        0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
        50% { opacity: 0.8; transform: scale(1) rotate(180deg); }
    }
    </style>';

    // ORBES DEFAULT
    $animaciones['orbes'] = '
    <div class="anim-orbes-default">
        <div class="orbe-def o1"></div>
        <div class="orbe-def o2"></div>
        <div class="orbe-def o3"></div>
    </div>
    <style>
    .anim-orbes-default { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    .orbe-def { position: absolute; border-radius: 50%; filter: blur(80px); animation: floatOrbe 15s ease-in-out infinite; }
    .o1 { width: 400px; height: 400px; background: '.$color.'; opacity: 0.2; top: -100px; left: -100px; }
    .o2 { width: 300px; height: 300px; background: '.$color.'; opacity: 0.15; bottom: -50px; right: -50px; animation-delay: -5s; }
    .o3 { width: 350px; height: 350px; background: '.$color.'; opacity: 0.1; top: 40%; left: 30%; animation-delay: -10s; }
    @keyframes floatOrbe { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(30px, -30px) scale(1.1); } }
    </style>';

    return $animaciones[$tipo] ?? $animaciones['orbes'];
}

// ============================================================================
// ORNAMENTOS DECORATIVOS
// ============================================================================
function duendes_ornament($type = 'divider', $color = '#C6A962') {
    $ornaments = [
        'divider' => '<svg width="200" height="20" viewBox="0 0 200 20" fill="none" class="dm-ornament"><path d="M0 10h70" stroke="'.$color.'" stroke-width="0.5"/><circle cx="80" cy="10" r="2" fill="'.$color.'"/><circle cx="100" cy="10" r="4" fill="'.$color.'"/><circle cx="120" cy="10" r="2" fill="'.$color.'"/><path d="M130 10h70" stroke="'.$color.'" stroke-width="0.5"/></svg>',
        'flourish' => '<svg width="120" height="30" viewBox="0 0 120 30" fill="none" class="dm-ornament"><path d="M0 15 Q30 0 60 15 Q90 30 120 15" stroke="'.$color.'" stroke-width="0.8" fill="none"/><circle cx="60" cy="15" r="3" fill="'.$color.'"/></svg>',
        'star-small' => '<svg width="12" height="12" viewBox="0 0 24 24" fill="'.$color.'" class="dm-star-small"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>',
        'diamond' => '<svg width="12" height="12" viewBox="0 0 16 16" fill="'.$color.'" class="dm-diamond"><path d="M8 0L16 8L8 16L0 8Z"/></svg>',
    ];
    return $ornaments[$type] ?? '';
}

// ============================================================================
// HELPER PARA GENERO
// ============================================================================
function duendes_pronombre($genero, $tipo) {
    $femenino = in_array(strtolower($genero), ['femenino', 'f', 'ella', 'female', 'bruja', 'hada', 'hechicera']);
    $pronombres = [
        'el_la' => $femenino ? 'la' : 'el',
        'El_La' => $femenino ? 'La' : 'El',
        'guardian' => $femenino ? 'Guardiana' : 'Guardian',
        'lo_la' => $femenino ? 'la' : 'lo',
        'el_ella' => $femenino ? 'ella' : 'el',
        'destinado_a' => $femenino ? 'destinada' : 'destinado',
    ];
    return $pronombres[$tipo] ?? '';
}

// ============================================================================
// HEADER
// ============================================================================
function duendes_header() {
    $cart_count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
    ?>
    <header class="dm-header">
        <div class="dm-header-inner">
            <a href="<?php echo home_url(); ?>" class="dm-logo">DUENDES DEL URUGUAY</a>
            <nav class="dm-nav-menu">
                <a href="<?php echo home_url('/shop'); ?>">Guardianes</a>
                <a href="<?php echo home_url('/circulo'); ?>">El Circulo</a>
                <a href="<?php echo home_url('/nosotros'); ?>">Nuestra Historia</a>
            </nav>
            <a href="<?php echo wc_get_cart_url(); ?>" class="dm-cart">
                <?php echo duendes_icon('cart', 22); ?>
                <?php if ($cart_count > 0): ?>
                <span class="dm-cart-badge"><?php echo $cart_count; ?></span>
                <?php endif; ?>
            </a>
        </div>
    </header>
    <?php
}

// ============================================================================
// ESTILOS BASE
// ============================================================================
function duendes_styles_base($color_primario = '#C6A962') {
    ?>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Cormorant Garamond', Georgia, serif; -webkit-font-smoothing: antialiased; }
    .dm-ornament, .dm-star-small, .dm-diamond { opacity: 0.6; }
    .dm-header { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 0 50px; background: #0a0a0a; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .dm-header-inner { max-width: 1400px; margin: 0 auto; height: 80px; display: flex; justify-content: space-between; align-items: center; }
    .dm-logo { font-family: 'Cinzel', serif; font-size: 16px; letter-spacing: 5px; color: <?php echo $color_primario; ?>; text-decoration: none; font-weight: 500; }
    .dm-nav-menu { display: flex; gap: 50px; }
    .dm-nav-menu a { font-family: 'Cinzel', serif; font-size: 13px; letter-spacing: 2px; color: #fff; text-decoration: none; transition: color 0.3s; }
    .dm-nav-menu a:hover { color: <?php echo $color_primario; ?>; }
    .dm-cart { color: #fff; position: relative; display: flex; align-items: center; }
    .dm-cart svg { stroke: #fff; }
    .dm-cart-badge { position: absolute; top: -8px; right: -12px; background: <?php echo $color_primario; ?>; color: #000; font-family: 'Cinzel', serif; font-size: 10px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    @media (max-width: 768px) {
        .dm-header { padding: 0 20px; }
        .dm-header-inner { height: 65px; }
        .dm-logo { font-size: 11px; letter-spacing: 3px; }
        .dm-nav-menu { display: none; }
    }
    </style>
    <?php
}

// ============================================================================
// PAGINA DE TIENDA
// ============================================================================
function duendes_render_tienda() {
    $categoria_actual = is_product_category() ? get_queried_object() : null;
    $cat_config = $categoria_actual ? duendes_get_categoria_config($categoria_actual->slug) : duendes_get_categoria_config('default');
    $color = $cat_config['color_primario'];

    $args = ['post_type' => 'product', 'posts_per_page' => 50, 'post_status' => 'publish'];
    if ($categoria_actual) {
        $args['tax_query'] = [['taxonomy' => 'product_cat', 'field' => 'term_id', 'terms' => $categoria_actual->term_id]];
    }
    $productos = new WP_Query($args);
    $categorias = get_terms(['taxonomy' => 'product_cat', 'hide_empty' => true, 'exclude' => [get_option('default_product_cat')]]);
    ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $categoria_actual ? $cat_config['nombre'] : 'Guardianes'; ?> - Duendes del Uruguay</title>
    <?php wp_head(); ?>
    <?php duendes_styles_base($color); ?>
    <style>
    body { background: #0a0a0a; color: #fff; }
    .shop-hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 120px 40px 80px; position: relative; overflow: hidden; }
    .shop-hero-label { font-family: 'Cinzel', serif; font-size: 12px; letter-spacing: 6px; color: <?php echo $color; ?>; margin-bottom: 30px; display: flex; align-items: center; justify-content: center; gap: 15px; }
    .shop-hero-title { font-family: 'Cinzel', serif; font-size: clamp(48px, 10vw, 100px); font-weight: 400; color: #fff; margin-bottom: 25px; letter-spacing: 4px; position: relative; z-index: 1; }
    .shop-hero-subtitle { font-family: 'Cormorant Garamond', serif; font-size: 22px; color: rgba(255,255,255,0.6); font-style: italic; max-width: 550px; line-height: 1.7; position: relative; z-index: 1; }
    .shop-hero-ornament { margin-top: 50px; position: relative; z-index: 1; }
    .shop-filters { padding: 50px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; background: #0d0d0d; border-top: 1px solid rgba(<?php
        $hex = ltrim($color, '#');
        echo hexdec(substr($hex,0,2)).','.hexdec(substr($hex,2,2)).','.hexdec(substr($hex,4,2));
    ?>, 0.2); border-bottom: 1px solid rgba(<?php echo hexdec(substr($hex,0,2)).','.hexdec(substr($hex,2,2)).','.hexdec(substr($hex,4,2)); ?>, 0.2); }
    .shop-filter { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 2px; padding: 12px 25px; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; text-decoration: none; transition: all 0.3s; }
    .shop-filter:hover, .shop-filter.active { background: <?php echo $color; ?>; border-color: <?php echo $color; ?>; color: #0a0a0a; }
    .shop-filter[data-cat="proteccion"] { border-color: rgba(74, 144, 217, 0.5); }
    .shop-filter[data-cat="proteccion"]:hover, .shop-filter[data-cat="proteccion"].active { background: #4A90D9; border-color: #4A90D9; }
    .shop-filter[data-cat="amor"] { border-color: rgba(233, 30, 140, 0.5); }
    .shop-filter[data-cat="amor"]:hover, .shop-filter[data-cat="amor"].active { background: #E91E8C; border-color: #E91E8C; }
    .shop-filter[data-cat="dinero-abundancia-negocios"] { border-color: rgba(198, 169, 98, 0.5); }
    .shop-filter[data-cat="dinero-abundancia-negocios"]:hover, .shop-filter[data-cat="dinero-abundancia-negocios"].active { background: #C6A962; border-color: #C6A962; }
    .shop-filter[data-cat="salud"] { border-color: rgba(46, 204, 113, 0.5); }
    .shop-filter[data-cat="salud"]:hover, .shop-filter[data-cat="salud"].active { background: #2ECC71; border-color: #2ECC71; }
    .shop-filter[data-cat="sabiduria-guia-claridad"] { border-color: rgba(155, 89, 182, 0.5); }
    .shop-filter[data-cat="sabiduria-guia-claridad"]:hover, .shop-filter[data-cat="sabiduria-guia-claridad"].active { background: #9B59B6; border-color: #9B59B6; }
    .shop-products { padding: 80px 50px; max-width: 1500px; margin: 0 auto; }
    .shop-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 50px; }
    .shop-product { cursor: pointer; }
    .shop-product-img { position: relative; aspect-ratio: 3/4; overflow: hidden; background: #111; margin-bottom: 25px; }
    .shop-product-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; }
    .shop-product:hover .shop-product-img img { transform: scale(1.05); }
    .shop-product-badge { position: absolute; top: 20px; left: 20px; font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 2px; padding: 10px 18px; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); }
    .shop-product-info { text-align: center; }
    .shop-product-cat { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 3px; margin-bottom: 12px; }
    .shop-product-name { font-family: 'Cinzel', serif; font-size: 24px; color: #fff; margin-bottom: 12px; font-weight: 400; }
    .shop-product-price { font-family: 'Cinzel', serif; font-size: 18px; color: rgba(255,255,255,0.7); }
    .shop-footer { padding: 100px 50px; text-align: center; border-top: 1px solid rgba(<?php echo hexdec(substr($hex,0,2)).','.hexdec(substr($hex,2,2)).','.hexdec(substr($hex,4,2)); ?>, 0.2); background: #050505; }
    .shop-footer-ornament { margin-bottom: 40px; }
    .shop-footer-logo { font-family: 'Cinzel', serif; font-size: 14px; letter-spacing: 6px; color: <?php echo $color; ?>; margin-bottom: 15px; }
    .shop-footer-tagline { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: rgba(255,255,255,0.5); font-style: italic; }
    @media (max-width: 1024px) { .shop-grid { grid-template-columns: repeat(2, 1fr); gap: 30px; } }
    @media (max-width: 600px) { .shop-hero { padding: 100px 20px 60px; } .shop-filters { padding: 30px 20px; gap: 10px; } .shop-filter { padding: 10px 15px; font-size: 9px; } .shop-products { padding: 50px 20px; } .shop-grid { grid-template-columns: 1fr 1fr; gap: 20px; } .shop-product-name { font-size: 16px; } }
    </style>
</head>
<body>
<?php duendes_header(); ?>
<section class="shop-hero">
    <?php echo duendes_animacion($cat_config['animacion'], $color); ?>
    <p class="shop-hero-label"><?php echo duendes_ornament('star-small', $color); ?> PIEZAS UNICAS CANALIZADAS <?php echo duendes_ornament('star-small', $color); ?></p>
    <h1 class="shop-hero-title"><?php echo $categoria_actual ? esc_html($cat_config['nombre']) : 'Guardianes'; ?></h1>
    <p class="shop-hero-subtitle">Cada guardian es unico. Canalizado en el bosque de Piriapolis. Cuando uno encuentra su hogar, desaparece para siempre.</p>
    <div class="shop-hero-ornament"><?php echo duendes_ornament('divider', $color); ?></div>
</section>
<div class="shop-filters">
    <a href="<?php echo home_url('/shop'); ?>" class="shop-filter <?php echo !$categoria_actual ? 'active' : ''; ?>">TODOS</a>
    <?php foreach ($categorias as $cat):
        if (in_array($cat->slug, ['uncategorized', 'circulo', 'monedas'])) continue;
        $cat_cfg = duendes_get_categoria_config($cat->slug);
    ?>
    <a href="<?php echo get_term_link($cat); ?>" class="shop-filter <?php echo ($categoria_actual && $categoria_actual->term_id === $cat->term_id) ? 'active' : ''; ?>" data-cat="<?php echo esc_attr($cat->slug); ?>" style="<?php echo ($categoria_actual && $categoria_actual->term_id === $cat->term_id) ? '' : 'color:'.$cat_cfg['color_primario'].';border-color:rgba('.hexdec(substr(ltrim($cat_cfg['color_primario'],'#'),0,2)).','.hexdec(substr(ltrim($cat_cfg['color_primario'],'#'),2,2)).','.hexdec(substr(ltrim($cat_cfg['color_primario'],'#'),4,2)).',0.5);'; ?>">
        <?php echo esc_html(strtoupper($cat_cfg['nombre'])); ?>
    </a>
    <?php endforeach; ?>
</div>
<section class="shop-products">
    <div class="shop-grid">
        <?php while ($productos->have_posts()): $productos->the_post();
            $product = wc_get_product(get_the_ID());
            $cats = wp_get_post_terms(get_the_ID(), 'product_cat');
            $cat_slug = !empty($cats) ? $cats[0]->slug : '';
            $prod_cat_config = duendes_get_categoria_config($cat_slug);
            $imagen = get_the_post_thumbnail_url(get_the_ID(), 'large');
        ?>
        <article class="shop-product" onclick="window.location='<?php the_permalink(); ?>'">
            <div class="shop-product-img">
                <?php if ($imagen): ?><img src="<?php echo esc_url($imagen); ?>" alt="<?php the_title_attribute(); ?>"><?php endif; ?>
                <span class="shop-product-badge" style="color: <?php echo $prod_cat_config['color_primario']; ?>; border: 1px solid <?php echo $prod_cat_config['color_primario']; ?>33;">PIEZA UNICA</span>
            </div>
            <div class="shop-product-info">
                <p class="shop-product-cat" style="color: <?php echo $prod_cat_config['color_primario']; ?>;"><?php echo esc_html(strtoupper($prod_cat_config['nombre'])); ?></p>
                <h3 class="shop-product-name"><?php the_title(); ?></h3>
                <p class="shop-product-price"><?php echo $product->get_price_html(); ?></p>
            </div>
        </article>
        <?php endwhile; wp_reset_postdata(); ?>
    </div>
</section>
<footer class="shop-footer">
    <div class="shop-footer-ornament"><?php echo duendes_ornament('flourish', $color); ?></div>
    <p class="shop-footer-logo">DUENDES DEL URUGUAY</p>
    <p class="shop-footer-tagline">Canalizados para vos</p>
</footer>
<?php wp_footer(); ?>
</body>
</html>
    <?php
}

// ============================================================================
// PAGINA DE PRODUCTO
// ============================================================================
function duendes_render_producto() {
    global $post;
    $product = wc_get_product($post->ID);
    if (!$product) return;

    $nombre = $product->get_name();
    $precio = $product->get_price_html();
    $descripcion = $product->get_description();
    $short_desc = $product->get_short_description();
    $cats = wp_get_post_terms($post->ID, 'product_cat');
    $cat_slug = !empty($cats) ? $cats[0]->slug : '';
    $cat_config = duendes_get_categoria_config($cat_slug);
    $color = $cat_config['color_primario'];

    $imagen_id = $product->get_image_id();
    $imagen_url = $imagen_id ? wp_get_attachment_image_url($imagen_id, 'full') : '';
    $gallery_ids = $product->get_gallery_image_ids();

    // Meta datos
    $historia = get_post_meta($post->ID, '_duendes_historia', true);
    $fortalezas = get_post_meta($post->ID, '_duendes_fortalezas', true);
    $ritual = get_post_meta($post->ID, '_duendes_ritual', true);
    $tipo = get_post_meta($post->ID, '_duendes_tipo', true) ?: 'guardian';
    $tipo_config = duendes_get_tipo_config($tipo);
    $elemento = get_post_meta($post->ID, '_duendes_elemento', true) ?: 'Tierra';
    $genero = get_post_meta($post->ID, '_duendes_genero', true) ?: $tipo;
    $altura = get_post_meta($post->ID, '_duendes_altura', true);
    $piedras = get_post_meta($post->ID, '_duendes_piedras', true);

    $el_la = duendes_pronombre($genero, 'el_la');
    $El_La = duendes_pronombre($genero, 'El_La');
    $guardian = duendes_pronombre($genero, 'guardian');
    $lo_la = duendes_pronombre($genero, 'lo_la');
    $destinado_a = duendes_pronombre($genero, 'destinado_a');

    // Elegir animacion: primero por tipo de ser, si no por categoria
    $animacion_tipo = $tipo_config['animacion'];
    ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo esc_html($nombre); ?> - Duendes del Uruguay</title>
    <?php wp_head(); ?>
    <?php duendes_styles_base($color); ?>
    <style>
    body { background: #0a0a0a; color: #fff; }
    .prod-hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; position: relative; overflow: hidden; }
    .prod-hero-content { position: relative; z-index: 1; padding: 40px; }
    .prod-badge { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 5px; padding: 15px 40px; border: 1px solid <?php echo $color; ?>66; color: <?php echo $color; ?>; margin-bottom: 50px; display: inline-flex; align-items: center; gap: 15px; }
    .prod-nombre { font-family: 'Cinzel', serif; font-size: clamp(60px, 15vw, 140px); font-weight: 400; color: #fff; letter-spacing: 6px; margin-bottom: 25px; text-shadow: 0 0 100px <?php echo $color; ?>33; }
    .prod-tipo { font-family: 'Cinzel', serif; font-size: 14px; letter-spacing: 4px; color: rgba(255,255,255,0.5); }
    .prod-hero-ornament { margin-top: 60px; }
    .prod-cream { background: #FAF8F5; color: #1a1a1a; padding: 120px 50px; }
    .prod-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 80px; max-width: 1300px; margin: 0 auto; align-items: start; }
    .prod-gallery { position: sticky; top: 120px; }
    .prod-main-img { width: 100%; aspect-ratio: 4/5; object-fit: cover; box-shadow: 0 40px 100px rgba(0,0,0,0.12); }
    .prod-thumbs { display: flex; gap: 12px; margin-top: 20px; }
    .prod-thumb { width: 80px; height: 100px; object-fit: cover; cursor: pointer; opacity: 0.5; transition: all 0.3s; border: 2px solid transparent; }
    .prod-thumb:hover, .prod-thumb.active { opacity: 1; border-color: <?php echo $color; ?>; }
    .prod-details { padding-top: 20px; }
    .prod-details-cat { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 4px; color: <?php echo $color; ?>; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
    .prod-details-name { font-family: 'Cinzel', serif; font-size: 40px; font-weight: 400; margin-bottom: 10px; }
    .prod-details-meta { font-family: 'Cinzel', serif; font-size: 13px; letter-spacing: 2px; color: #888; margin-bottom: 30px; }
    .prod-price { font-family: 'Cinzel', serif; font-size: 34px; margin-bottom: 15px; }
    .prod-short-desc { font-size: 18px; line-height: 1.8; color: #555; margin-bottom: 35px; }
    .prod-btn { display: block; width: 100%; padding: 22px; background: #1a1a1a; color: <?php echo $color; ?>; border: none; font-family: 'Cinzel', serif; font-size: 13px; letter-spacing: 4px; cursor: pointer; transition: all 0.4s; margin-bottom: 25px; }
    .prod-btn:hover { background: <?php echo $color; ?>; color: #1a1a1a; }
    .prod-trust { display: flex; gap: 25px; padding-top: 25px; border-top: 1px solid #eee; }
    .prod-trust-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #888; }
    .prod-trust-item svg { stroke: <?php echo $color; ?>; width: 18px; height: 18px; }
    .prod-dark { background: #0a0a0a; color: #fff; padding: 150px 50px; }
    .prod-section-inner { max-width: 850px; margin: 0 auto; text-align: center; }
    .prod-section-label { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 6px; color: <?php echo $color; ?>; margin-bottom: 25px; display: flex; align-items: center; justify-content: center; gap: 15px; }
    .prod-section-title { font-family: 'Cinzel', serif; font-size: clamp(30px, 5vw, 44px); font-weight: 400; margin-bottom: 50px; letter-spacing: 2px; }
    .prod-section-ornament { margin-bottom: 40px; }
    .prod-historia { font-size: 20px; line-height: 2; color: rgba(255,255,255,0.7); }
    .prod-historia p { margin-bottom: 1.5em; }
    .prod-white { background: #fff; color: #1a1a1a; padding: 120px 50px; }
    .prod-specs-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 60px; max-width: 1100px; margin: 0 auto; }
    .prod-spec-box { padding: 50px; background: #FAFAFA; border: 1px solid #f0f0f0; position: relative; }
    .prod-spec-box::before, .prod-spec-box::after { content: ''; position: absolute; width: 20px; height: 20px; border-color: <?php echo $color; ?>; border-style: solid; }
    .prod-spec-box::before { top: 15px; left: 15px; border-width: 1px 0 0 1px; }
    .prod-spec-box::after { bottom: 15px; right: 15px; border-width: 0 1px 1px 0; }
    .prod-spec-header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
    .prod-spec-header svg { stroke: <?php echo $color; ?>; }
    .prod-spec-header h3 { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 500; letter-spacing: 2px; }
    .prod-spec-content { font-size: 17px; line-height: 2; color: #555; }
    .prod-dimensions { display: flex; gap: 30px; justify-content: center; }
    .prod-dim { text-align: center; padding: 25px 35px; background: #fff; border: 1px solid #f0f0f0; }
    .prod-dim-value { font-family: 'Cinzel', serif; font-size: 36px; color: #1a1a1a; margin-bottom: 5px; }
    .prod-dim-label { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 2px; color: #999; }
    .prod-incluye-box { background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%); color: #fff; border: 1px solid <?php echo $color; ?>44; }
    .prod-incluye-box .prod-spec-header { border-bottom-color: rgba(255,255,255,0.1); }
    .prod-incluye-box .prod-spec-header h3 { color: <?php echo $color; ?>; }
    .prod-incluye-box .prod-spec-content { color: rgba(255,255,255,0.8); }
    .prod-incluye-item { display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.03); border-left: 2px solid <?php echo $color; ?>; }
    .prod-incluye-item svg { stroke: <?php echo $color; ?>; flex-shrink: 0; }
    .prod-incluye-item-text { flex: 1; }
    .prod-incluye-item-title { font-family: 'Cinzel', serif; font-size: 15px; color: #fff; margin-bottom: 4px; }
    .prod-incluye-item-desc { font-size: 14px; color: rgba(255,255,255,0.5); }
    .prod-strengths { background: #F8F6F2; padding: 120px 50px; }
    .prod-strengths-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 50px; max-width: 1100px; margin: 60px auto 0; }
    .prod-strength { text-align: center; padding: 50px 30px; background: #fff; box-shadow: 0 20px 60px rgba(0,0,0,0.05); position: relative; }
    .prod-strength::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 40px; height: 2px; background: <?php echo $color; ?>; }
    .prod-strength-icon { margin-bottom: 25px; color: <?php echo $color; ?>; }
    .prod-strength-icon svg { stroke: <?php echo $color; ?>; }
    .prod-strength-title { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 500; color: #1a1a1a; }
    .prod-ritual { background: linear-gradient(180deg, #FAF8F5 0%, #F5F1EB 100%); padding: 120px 50px; }
    .prod-ritual-card { max-width: 800px; margin: 0 auto; background: #fff; padding: 70px; box-shadow: 0 30px 80px rgba(0,0,0,0.06); text-align: center; position: relative; }
    .prod-ritual-card::before, .prod-ritual-card::after { content: ''; position: absolute; width: 30px; height: 30px; border-color: <?php echo $color; ?>; border-style: solid; }
    .prod-ritual-card::before { top: 20px; left: 20px; border-width: 1px 0 0 1px; }
    .prod-ritual-card::after { bottom: 20px; right: 20px; border-width: 0 1px 1px 0; }
    .prod-ritual-content { font-size: 18px; line-height: 2; color: #555; }
    .prod-ritual-content ol { text-align: left; max-width: 500px; margin: 40px auto; counter-reset: ritual; list-style: none; }
    .prod-ritual-content li { margin-bottom: 25px; padding-left: 55px; position: relative; counter-increment: ritual; }
    .prod-ritual-content li::before { content: counter(ritual); position: absolute; left: 0; top: 0; width: 32px; height: 32px; background: <?php echo $color; ?>; color: #fff; font-family: 'Cinzel', serif; font-size: 14px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
    .prod-cta { background: #0a0a0a; padding: 150px 50px; text-align: center; position: relative; overflow: hidden; }
    .prod-cta-content { position: relative; z-index: 1; }
    .prod-cta-ornament { margin-bottom: 40px; }
    .prod-cta-name { font-family: 'Cinzel', serif; font-size: clamp(36px, 6vw, 56px); font-weight: 400; margin-bottom: 20px; }
    .prod-cta-price { font-family: 'Cinzel', serif; font-size: 38px; color: <?php echo $color; ?>; margin-bottom: 40px; }
    .prod-cta-btn { display: inline-block; padding: 24px 80px; background: <?php echo $color; ?>; color: #0a0a0a; border: none; font-family: 'Cinzel', serif; font-size: 14px; letter-spacing: 4px; cursor: pointer; transition: all 0.4s; text-decoration: none; }
    .prod-cta-btn:hover { background: #fff; transform: translateY(-3px); box-shadow: 0 20px 50px <?php echo $color; ?>44; }
    .prod-cta-note { margin-top: 30px; font-size: 15px; color: rgba(255,255,255,0.4); font-style: italic; }
    @media (max-width: 1024px) { .prod-grid { grid-template-columns: 1fr; gap: 50px; } .prod-gallery { position: relative; top: 0; } .prod-specs-grid { grid-template-columns: 1fr; gap: 40px; } .prod-strengths-grid { grid-template-columns: 1fr; gap: 30px; } }
    @media (max-width: 768px) { .prod-cream, .prod-dark, .prod-white, .prod-strengths, .prod-ritual, .prod-cta { padding: 80px 25px; } .prod-ritual-card { padding: 50px 30px; } .prod-details-name { font-size: 30px; } .prod-price { font-size: 26px; } .prod-spec-box { padding: 35px 25px; } .prod-dimensions { flex-direction: column; gap: 15px; } }
    </style>
</head>
<body>
<?php duendes_header(); ?>

<section class="prod-hero">
    <?php echo duendes_animacion($animacion_tipo, $color); ?>
    <div class="prod-hero-content">
        <span class="prod-badge"><?php echo duendes_ornament('star-small', $color); ?> PIEZA UNICA <?php echo duendes_ornament('star-small', $color); ?></span>
        <h1 class="prod-nombre"><?php echo esc_html($nombre); ?></h1>
        <p class="prod-tipo"><?php echo esc_html(strtoupper($tipo_config['nombre'])); ?> &bull; <?php echo esc_html(strtoupper($elemento)); ?> &bull; <?php echo esc_html(strtoupper($cat_config['nombre'])); ?></p>
        <div class="prod-hero-ornament"><?php echo duendes_ornament('divider', $color); ?></div>
    </div>
</section>

<section class="prod-cream">
    <div class="prod-grid">
        <div class="prod-gallery">
            <?php if ($imagen_url): ?><img src="<?php echo esc_url($imagen_url); ?>" alt="<?php echo esc_attr($nombre); ?>" class="prod-main-img" id="main-img"><?php endif; ?>
            <?php if (!empty($gallery_ids)): ?>
            <div class="prod-thumbs">
                <?php if ($imagen_url): ?><img src="<?php echo esc_url(wp_get_attachment_image_url($imagen_id, 'thumbnail')); ?>" class="prod-thumb active" onclick="changeImg('<?php echo esc_url($imagen_url); ?>', this)"><?php endif; ?>
                <?php foreach ($gallery_ids as $gid): ?><img src="<?php echo esc_url(wp_get_attachment_image_url($gid, 'thumbnail')); ?>" class="prod-thumb" onclick="changeImg('<?php echo esc_url(wp_get_attachment_image_url($gid, 'full')); ?>', this)"><?php endforeach; ?>
            </div>
            <?php endif; ?>
        </div>
        <div class="prod-details">
            <p class="prod-details-cat"><?php echo duendes_ornament('diamond', $color); ?> <?php echo esc_html(strtoupper($cat_config['nombre'])); ?></p>
            <h2 class="prod-details-name"><?php echo esc_html($nombre); ?></h2>
            <p class="prod-details-meta"><?php echo esc_html($tipo_config['nombre']); ?> &bull; Elemento <?php echo esc_html(ucfirst($elemento)); ?></p>
            <p class="prod-price"><?php echo $precio; ?></p>
            <?php if ($short_desc): ?><p class="prod-short-desc"><?php echo wp_kses_post($short_desc); ?></p><?php endif; ?>
            <form method="post" action="<?php echo esc_url(wc_get_cart_url()); ?>">
                <input type="hidden" name="add-to-cart" value="<?php echo $product->get_id(); ?>">
                <button type="submit" class="prod-btn">SELLAR EL PACTO</button>
            </form>
            <div class="prod-trust">
                <span class="prod-trust-item"><?php echo duendes_icon('truck', 20); ?> Envio seguro</span>
                <span class="prod-trust-item"><?php echo duendes_icon('star', 20); ?> Pieza unica</span>
                <span class="prod-trust-item"><?php echo duendes_icon('gift', 20); ?> 30 dias garantia</span>
            </div>
        </div>
    </div>
</section>

<section class="prod-dark">
    <div class="prod-section-inner">
        <p class="prod-section-label"><?php echo duendes_ornament('star-small', $color); ?> SU HISTORIA <?php echo duendes_ornament('star-small', $color); ?></p>
        <h2 class="prod-section-title"><?php echo esc_html($El_La); ?> Origen de <?php echo esc_html($nombre); ?></h2>
        <div class="prod-section-ornament"><?php echo duendes_ornament('flourish', $color); ?></div>
        <div class="prod-historia">
            <?php if ($historia): echo wp_kses_post(wpautop($historia));
            elseif ($descripcion): echo wp_kses_post($descripcion);
            else: ?>
            <p><?php echo esc_html($nombre); ?> emerge de los antiguos bosques de Piriapolis, donde los velos entre mundos son mas delgados. Su energia ha esperado pacientemente el momento exacto para cruzar y encontrar a quien esta <?php echo $destinado_a; ?> a acompanar.</p>
            <p>Los guardianes no se eligen: ellos eligen. Si sentis un llamado hacia <?php echo esc_html($nombre); ?>, es porque ya te ha reconocido.</p>
            <?php endif; ?>
        </div>
    </div>
</section>

<section class="prod-white">
    <div class="prod-specs-grid">
        <div class="prod-spec-box">
            <div class="prod-spec-header"><?php echo duendes_icon('ruler'); ?><h3>ALTURA</h3></div>
            <div class="prod-spec-content">
                <div class="prod-dimensions">
                    <div class="prod-dim">
                        <div class="prod-dim-value"><?php echo $altura ? esc_html($altura) : '~25'; ?></div>
                        <div class="prod-dim-label">CENTIMETROS</div>
                    </div>
                </div>
                <?php if (!$altura): ?><p style="margin-top: 25px; font-size: 14px; color: #999; text-align: center;">Medida aproximada. Cada pieza es unica.</p><?php endif; ?>
            </div>
        </div>
        <div class="prod-spec-box prod-incluye-box">
            <div class="prod-spec-header"><?php echo duendes_icon('package'); ?><h3>QUE INCLUYE TU PACTO</h3></div>
            <div class="prod-spec-content">
                <div class="prod-incluye-item"><?php echo duendes_icon('wand', 24); ?><div class="prod-incluye-item-text"><div class="prod-incluye-item-title"><?php echo esc_html($tipo_config['nombre']); ?> <?php echo esc_html($nombre); ?></div><div class="prod-incluye-item-desc">Pieza unica canalizada en Piriapolis</div></div></div>
                <div class="prod-incluye-item"><?php echo duendes_icon('certificate', 24); ?><div class="prod-incluye-item-text"><div class="prod-incluye-item-title">Certificado de Autenticidad</div><div class="prod-incluye-item-desc">Con codigo QR unico verificable</div></div></div>
                <div class="prod-incluye-item"><?php echo duendes_icon('scroll', 24); ?><div class="prod-incluye-item-text"><div class="prod-incluye-item-title">Guia del Ritual de Bienvenida</div><div class="prod-incluye-item-desc">Como recibir<?php echo $lo_la; ?> en tu hogar</div></div></div>
                <?php if ($piedras && is_array($piedras) && count($piedras) > 0): ?><div class="prod-incluye-item"><?php echo duendes_icon('crystal', 24); ?><div class="prod-incluye-item-text"><div class="prod-incluye-item-title">Cristales Energeticos</div><div class="prod-incluye-item-desc"><?php echo esc_html(implode(', ', $piedras)); ?></div></div></div><?php endif; ?>
                <div class="prod-incluye-item"><?php echo duendes_icon('portal', 24); ?><div class="prod-incluye-item-text"><div class="prod-incluye-item-title">Acceso al Portal del Guardian</div><div class="prod-incluye-item-desc">Comunidad exclusiva de elegidas</div></div></div>
            </div>
        </div>
    </div>
</section>

<section class="prod-strengths">
    <div class="prod-section-inner">
        <p class="prod-section-label" style="color: <?php echo $color; ?>;"><?php echo duendes_ornament('star-small', $color); ?> SUS DONES <?php echo duendes_ornament('star-small', $color); ?></p>
        <h2 class="prod-section-title" style="color: #1a1a1a;">Lo que <?php echo esc_html($nombre); ?> Aporta</h2>
    </div>
    <div class="prod-strengths-grid">
        <?php
        $fortalezas_array = $fortalezas ? array_filter(array_map('trim', explode("\n", $fortalezas))) : ['Proteccion energetica del hogar', 'Conexion con sabiduria ancestral', 'Armonia y equilibrio vital'];
        $iconos_svg = ['shield', 'star', 'leaf', 'heart', 'moon', 'compass'];
        $i = 0;
        foreach (array_slice($fortalezas_array, 0, 3) as $f): ?>
        <div class="prod-strength"><div class="prod-strength-icon"><?php echo duendes_icon($iconos_svg[$i % count($iconos_svg)]); ?></div><h3 class="prod-strength-title"><?php echo esc_html($f); ?></h3></div>
        <?php $i++; endforeach; ?>
    </div>
</section>

<section class="prod-ritual">
    <div class="prod-ritual-card">
        <p class="prod-section-label" style="color: <?php echo $color; ?>;"><?php echo duendes_ornament('star-small', $color); ?> RITUAL DE BIENVENIDA <?php echo duendes_ornament('star-small', $color); ?></p>
        <h2 class="prod-section-title" style="color: #1a1a1a;">Como Recibir<?php echo $lo_la; ?></h2>
        <div class="prod-ritual-content">
            <?php if ($ritual): echo wp_kses_post(wpautop($ritual)); else: ?>
            <p>Cuando <?php echo esc_html($nombre); ?> llegue a tu hogar:</p>
            <ol>
                <li>Elegi un momento de calma. Encende una vela si lo sentis apropiado.</li>
                <li>Sostene<?php echo $lo_la; ?> entre tus manos y presentate. Decile tu nombre.</li>
                <li>Contale por que <?php echo $lo_la; ?> elegiste y que esperas de su compania.</li>
                <li>Ubica<?php echo $lo_la; ?> en un lugar especial donde pueda observar tu hogar.</li>
            </ol>
            <p style="color: #999; font-style: italic; margin-top: 30px;">Los guardianes eligen tanto como son elegidos.</p>
            <?php endif; ?>
        </div>
    </div>
</section>

<section class="prod-cta">
    <?php echo duendes_animacion($cat_config['animacion'], $color); ?>
    <div class="prod-cta-content">
        <div class="prod-cta-ornament"><?php echo duendes_ornament('flourish', $color); ?></div>
        <h2 class="prod-cta-name"><?php echo esc_html($nombre); ?> te espera</h2>
        <p class="prod-cta-price"><?php echo $precio; ?></p>
        <form method="post" action="<?php echo esc_url(wc_get_cart_url()); ?>" style="display: inline;">
            <input type="hidden" name="add-to-cart" value="<?php echo $product->get_id(); ?>">
            <button type="submit" class="prod-cta-btn">SELLAR EL PACTO</button>
        </form>
        <p class="prod-cta-note">Pieza unica. Cuando se va, desaparece para siempre.</p>
    </div>
</section>

<script>
function changeImg(src, thumb) {
    document.getElementById('main-img').src = src;
    document.querySelectorAll('.prod-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}
</script>
<?php wp_footer(); ?>
</body>
</html>
    <?php
}
