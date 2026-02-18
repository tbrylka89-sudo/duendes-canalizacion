<?php
// Cache bust: 1769039953
/**
 * Plugin Name: Duendes Experiencia Magica
 * Description: Experiencia de tienda completamente custom con animaciones premium
 * Version: 4.0
 */

if (!defined('ABSPATH')) exit;

// =============================================================================
// BLOQUE 5: FUNCIONES DE NEUROMARKETING (con guards para evitar duplicación)
// =============================================================================

// "A quién busca este guardián" - genera texto basado en categoría
if (!function_exists('duendes_get_quien_busca')) {
    function duendes_get_quien_busca($product_id, $nombre, $cat_slug) {
        // Primero verificar si hay uno guardado
        $guardado = get_post_meta($product_id, '_duendes_quien_busca', true);
        if (!empty($guardado)) return $guardado;

        // Generar basado en categoría
        $textos = [
            'proteccion' => [
                "$nombre busca a alguien que carga con energías que no le pertenecen. Alguien que protege a todos menos a sí mismo. Si sentís que el mundo te pesa más de lo que debería, ya te encontró.",
                "$nombre busca a quien necesita sentirse seguro en un mundo que a veces abruma. A alguien que da más de lo que recibe y necesita un escudo invisible."
            ],
            'amor' => [
                "$nombre busca a quien tiene el corazón abierto pero herido. A alguien que cree en el amor pero le cuesta recibirlo. Si sentís que das más de lo que te dan, llegó tu guardián.",
                "$nombre busca a quien está listo para amar sin miedo. A alguien que sabe que merece conexiones profundas y verdaderas."
            ],
            'dinero' => [
                "$nombre busca a quien trabaja duro pero siente que el dinero se escapa. A alguien que sabe que merece abundancia pero tiene bloqueos invisibles.",
                "$nombre busca a quien está listo para cambiar su relación con el dinero. A alguien que quiere prosperar sin culpa."
            ],
            'abundancia' => [
                "$nombre busca a quien trabaja duro pero siente que el dinero se escapa. A alguien que sabe que merece abundancia pero tiene bloqueos invisibles.",
                "$nombre busca a quien emprende, crea y sueña en grande. A alguien que necesita que el universo conspire a su favor."
            ],
            'salud' => [
                "$nombre busca a quien necesita sanar algo que no se ve. A alguien que carga dolores antiguos, propios o heredados.",
                "$nombre busca a quien cuida de otros pero se olvida de sí mismo. A alguien que necesita recordar que también merece cuidados."
            ],
            'sabiduria' => [
                "$nombre busca a quien tiene muchas preguntas y pocas certezas. A alguien que sabe que hay más de lo que se ve.",
                "$nombre busca a quien está en un momento de decisiones importantes. A alguien que necesita claridad cuando todo parece confuso."
            ]
        ];

        foreach ($textos as $key => $opciones) {
            if (strpos($cat_slug, $key) !== false) {
                return $opciones[array_rand($opciones)];
            }
        }

        return "$nombre busca a alguien especial. Si llegaste hasta acá, probablemente ya te encontró.";
    }
}

// Días esperando desde publicación
if (!function_exists('duendes_get_dias_esperando')) {
    function duendes_get_dias_esperando($product_id) {
        $post = get_post($product_id);
        if (!$post) return 1;
        $dias = floor((time() - strtotime($post->post_date)) / 86400);
        return max(1, $dias);
    }
}

if (!function_exists('duendes_texto_dias_esperando')) {
    function duendes_texto_dias_esperando($product_id, $nombre) {
        $dias = duendes_get_dias_esperando($product_id);
        if ($dias == 1) return "$nombre llegó ayer. Recién comenzó su espera.";
        if ($dias < 7) return "$nombre lleva $dias días esperando encontrar a su persona.";
        if ($dias < 30) {
            $semanas = floor($dias / 7);
            return "$nombre lleva " . ($semanas == 1 ? 'una semana' : "$semanas semanas") . " esperando.";
        }
        if ($dias < 90) {
            $meses = floor($dias / 30);
            return "$nombre lleva " . ($meses == 1 ? 'un mes' : "$meses meses") . " esperando.";
        }
        return "$nombre lleva mucho tiempo esperando a alguien especial. ¿Serás vos?";
    }
}

// Detectar país del usuario
if (!function_exists('duendes_detectar_pais')) {
    function duendes_detectar_pais() {
        if (isset($_COOKIE['duendes_pais'])) return strtoupper($_COOKIE['duendes_pais']);
        if (function_exists('WC') && WC()->customer) {
            $country = WC()->customer->get_billing_country();
            if ($country) return strtoupper($country);
        }
        return 'UY';
    }
}

// Texto del botón con precio
if (!function_exists('duendes_texto_boton_pacto')) {
    function duendes_texto_boton_pacto($product) {
        // Obtener precio BASE en USD (meta directo, sin conversión)
        $precio_usd = floatval(get_post_meta($product->get_id(), '_regular_price', true));
        if (!$precio_usd) {
            $precio_usd = floatval(get_post_meta($product->get_id(), '_price', true));
        }
        // Si aún no hay precio, intentar precio base
        if (!$precio_usd || $precio_usd > 2000) {
            // Probablemente ya está en UYU, buscar en mapping inverso
            $uyu_to_usd = [2500 => 70, 5500 => 150, 8000 => 200, 16500 => 450, 39800 => 1050];
            $precio_usd = $uyu_to_usd[intval($precio_usd)] ?? 70;
        }

        $pais = duendes_detectar_pais();
        if ($pais === 'UY') {
            $precios_uyu = [70 => 2500, 150 => 5500, 200 => 8000, 450 => 16500, 1050 => 39800];
            $precio_uyu = $precios_uyu[intval($precio_usd)] ?? intval($precio_usd * 40);
            return 'SELLAR EL PACTO · $' . number_format($precio_uyu, 0, ',', '.');
        }
        return 'SELLAR EL PACTO · $' . number_format($precio_usd, 0) . ' USD';
    }
}

// =============================================================================
// FIN BLOQUE 5
// =============================================================================

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
    // COLORES NEON - intensos y vibrantes
    $configs = [
        'proteccion' => [
            'nombre' => 'Protección',
            'color_primario' => '#00D4FF',  // Azul neon brillante
            'color_femenino' => '#BF5FFF',  // Violeta neon
            'color_secundario' => '#00FFFF',
            'color_orbe' => 'rgba(0, 212, 255, 0.35)',
            'color_orbe2' => 'rgba(0, 255, 255, 0.25)',
            'gradiente' => 'linear-gradient(135deg, #0a1a2a 0%, #050d14 100%)',
            'animacion' => 'escudo',
        ],
        'amor' => [
            'nombre' => 'Amor',
            'color_primario' => '#FF0080',  // Magenta neon
            'color_femenino' => '#FF69B4',  // Rosa neon
            'color_secundario' => '#FF1493',
            'color_orbe' => 'rgba(255, 0, 128, 0.35)',
            'color_orbe2' => 'rgba(255, 20, 147, 0.25)',
            'gradiente' => 'linear-gradient(135deg, #2a0a1a 0%, #140510 100%)',
            'animacion' => 'corazones',
        ],
        'dinero-abundancia-negocios' => [
            'nombre' => 'Abundancia',
            'color_primario' => '#FFD700',  // Dorado neon
            'color_femenino' => '#FFEA00',  // Amarillo neon
            'color_secundario' => '#39FF14',  // Verde neon
            'color_orbe' => 'rgba(255, 215, 0, 0.4)',
            'color_orbe2' => 'rgba(57, 255, 20, 0.25)',
            'gradiente' => 'linear-gradient(135deg, #1a1a05 0%, #0d0d02 100%)',
            'animacion' => 'monedas',
        ],
        'salud' => [
            'nombre' => 'Sanación',
            'color_primario' => '#39FF14',  // Verde neon
            'color_femenino' => '#00FFFF',  // Cyan neon
            'color_secundario' => '#00FF7F',
            'color_orbe' => 'rgba(57, 255, 20, 0.35)',
            'color_orbe2' => 'rgba(0, 255, 127, 0.25)',
            'gradiente' => 'linear-gradient(135deg, #051a05 0%, #020d02 100%)',
            'animacion' => 'hojas',
        ],
        'sabiduria-guia-claridad' => [
            'nombre' => 'Sabiduría',
            'color_primario' => '#BF5FFF',  // Violeta neon
            'color_femenino' => '#FF00FF',  // Magenta neon
            'color_secundario' => '#00D4FF',
            'color_orbe' => 'rgba(191, 95, 255, 0.35)',
            'color_orbe2' => 'rgba(255, 0, 255, 0.25)',
            'gradiente' => 'linear-gradient(135deg, #150520 0%, #0a020f 100%)',
            'animacion' => 'constelaciones',
        ],
    ];

    // Buscar por slug parcial
    foreach ($configs as $key => $config) {
        if (strpos($slug, $key) !== false || strpos($key, $slug) !== false) {
            return $config;
        }
    }

    // Default dorado neon
    return [
        'nombre' => 'Guardian',
        'color_primario' => '#FFD700',  // Dorado neon
        'color_secundario' => '#BF5FFF',  // Violeta neon
        'color_orbe' => 'rgba(255, 215, 0, 0.35)',
        'color_orbe2' => 'rgba(191, 95, 255, 0.25)',
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

    $args = ['post_type' => 'product', 'posts_per_page' => -1, 'post_status' => 'publish']; // -1 = TODOS
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
    <p class="shop-hero-label"><?php echo duendes_ornament('star-small', $color); ?> SERES UNICOS CANALIZADOS <?php echo duendes_ornament('star-small', $color); ?></p>
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
                <span class="shop-product-badge" style="color: <?php echo $prod_cat_config['color_primario']; ?>; border: 1px solid <?php echo $prod_cat_config['color_primario']; ?>33;">SER UNICO</span>
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

    $imagen_id = $product->get_image_id();
    $imagen_url = $imagen_id ? wp_get_attachment_image_url($imagen_id, 'full') : '';
    $gallery_ids = $product->get_gallery_image_ids();

    // Meta datos
    $historia = get_post_meta($post->ID, '_duendes_historia', true);
    $fortalezas = get_post_meta($post->ID, '_duendes_fortalezas', true);
    $ritual = get_post_meta($post->ID, '_duendes_ritual', true);
    // Ficha del Guardián (leer primero para usar en tipo/genero)
    $ficha = get_post_meta($post->ID, '_duendes_ficha', true) ?: [];
    $ficha_especie = $ficha['especie'] ?? '';
    $ficha_familia = $ficha['familia'] ?? '';
    $ficha_genero = $ficha['genero'] ?? '';

    // Tipo: usar ficha_especie si existe, sino el meta _duendes_tipo
    $tipo_meta = get_post_meta($post->ID, '_duendes_tipo', true);
    $tipo = $ficha_especie ?: ($tipo_meta ?: 'guardian');
    $tipo_config = duendes_get_tipo_config($tipo);

    $elemento = get_post_meta($post->ID, '_duendes_elemento', true) ?: 'Tierra';

    // Género: usar ficha_genero si existe, sino el meta _duendes_genero
    $genero_meta = get_post_meta($post->ID, '_duendes_genero', true);
    $genero = $ficha_genero ?: ($genero_meta ?: $tipo);

    // Color según género: femenino usa color_femenino si existe
    $es_femenino = in_array(strtolower($genero), ['femenino', 'f', 'ella', 'female', 'bruja', 'hada', 'hechicera', 'pixie', 'hada', 'm']);
    // Nota: 'F' en ficha_genero significa femenino
    if ($ficha_genero === 'F') $es_femenino = true;
    $color = ($es_femenino && isset($cat_config['color_femenino'])) ? $cat_config['color_femenino'] : $cat_config['color_primario'];

    $altura = get_post_meta($post->ID, '_duendes_altura', true);
    $piedras = get_post_meta($post->ID, '_duendes_piedras', true);
    $ficha_categoria = $ficha['categoria'] ?? '';
    $ficha_tamano_cm = $ficha['tamano_cm'] ?? '';
    $ficha_es_unico = $ficha['es_unico'] ?? 'auto';

    // Mapeo de especies para mostrar
    $especies_nombres = [
        'duende' => ['M' => 'Duende', 'F' => 'Duenda'],
        'pixie' => ['M' => 'Pixie', 'F' => 'Pixie'],
        'leprechaun' => ['M' => 'Leprechaun', 'F' => 'Leprechaun'],
        'elfo' => ['M' => 'Elfo', 'F' => 'Elfa'],
        'hada' => ['M' => 'Hada', 'F' => 'Hada'],
        'bruja' => ['M' => 'Brujo', 'F' => 'Bruja'],
        'vikingo' => ['M' => 'Vikingo', 'F' => 'Vikinga'],
        'chaman' => ['M' => 'Chamán', 'F' => 'Chamana'],
        'sanador' => ['M' => 'Sanador', 'F' => 'Sanadora'],
        'guerrero' => ['M' => 'Guerrero', 'F' => 'Guerrera'],
        'maestro' => ['M' => 'Maestro', 'F' => 'Maestra'],
        'hechicero' => ['M' => 'Hechicero', 'F' => 'Hechicera'],
        'druida' => ['M' => 'Druida', 'F' => 'Druida'],
        'alquimista' => ['M' => 'Alquimista', 'F' => 'Alquimista'],
        'oraculo' => ['M' => 'Oráculo', 'F' => 'Oráculo'],
        'luminide' => ['M' => 'Lumínide', 'F' => 'Lumínide'],
        'terralma' => ['M' => 'Terralma', 'F' => 'Terralma'],
        'velarian' => ['M' => 'Velarián', 'F' => 'Velariana'],
        'florian' => ['M' => 'Florián', 'F' => 'Floriana'],
        'merlin' => ['M' => 'Merlín', 'F' => 'Merlín'],
        'gandalf' => ['M' => 'Gandalf', 'F' => 'Gandalf'],
        'morgana' => ['M' => 'Morgana', 'F' => 'Morgana'],
    ];

    $categorias_nombres = [
        'proteccion' => 'Protección',
        'abundancia' => 'Abundancia',
        'amor' => 'Amor',
        'sanacion' => 'Sanación',
        'salud' => 'Salud',
        'sabiduria' => 'Sabiduría',
        'conexion_espiritual' => 'Conexión Espiritual',
        'transformacion' => 'Transformación',
    ];

    // Construir subtítulo de ficha: GUARDIÁN · ESPECIE · CATEGORÍA
    $subtitulo_guardian = ($ficha_genero === 'F') ? 'GUARDIANA' : 'GUARDIÁN';
    $subtitulo_especie = '';
    if ($ficha_familia) {
        $subtitulo_especie = strtoupper($ficha_familia);
    } elseif ($ficha_especie && isset($especies_nombres[$ficha_especie])) {
        $subtitulo_especie = strtoupper($especies_nombres[$ficha_especie][$ficha_genero] ?? $especies_nombres[$ficha_especie]['M']);
    }
    $subtitulo_categoria = isset($categorias_nombres[$ficha_categoria]) ? strtoupper($categorias_nombres[$ficha_categoria]) : '';

    // Usar ficha si tiene datos, sino usar datos viejos
    $usar_ficha = !empty($ficha_especie);
    if ($usar_ficha && $ficha_tamano_cm) {
        $altura = $ficha_tamano_cm;
    }

    $el_la = duendes_pronombre($genero, 'el_la');
    $El_La = duendes_pronombre($genero, 'El_La');
    $guardian = duendes_pronombre($genero, 'guardian');
    $lo_la = duendes_pronombre($genero, 'lo_la');
    $destinado_a = duendes_pronombre($genero, 'destinado_a');

    // Elegir animacion: primero por tipo de ser, si no por categoria
    $animacion_tipo = $tipo_config['animacion'];

    // Usar header del tema WordPress
    get_header();
    ?>
    <!-- DEBUG-PRODUCTO: v2024-<?php echo time(); ?> -->
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&display=swap');
    body { background: #0a0a0a; color: #fff; }
    .prod-hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; position: relative; overflow: hidden; background: <?php echo $cat_config['gradiente']; ?>; }
    .prod-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, <?php echo $cat_config['color_orbe']; ?> 0%, transparent 60%); pointer-events: none; }
    .prod-hero::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 80% 20%, <?php echo $cat_config['color_orbe2']; ?> 0%, transparent 40%); pointer-events: none; }
    .prod-hero-content { position: relative; z-index: 1; padding: 40px; }
    .prod-badge { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 5px; padding: 15px 40px; border: 1px solid <?php echo $color; ?>66; color: <?php echo $color; ?>; margin-bottom: 50px; display: inline-flex; align-items: center; gap: 15px; }
    .prod-nombre { font-family: 'Cinzel', serif; font-size: clamp(42px, 8vw, 80px); font-weight: 400; color: #fff; letter-spacing: 5px; margin-bottom: 25px; text-shadow: 0 0 100px <?php echo $color; ?>33; }
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
    .prod-btn { display: block; width: 100%; padding: 22px; background: #1a1a1a; color: <?php echo $color; ?>; border: none; font-family: 'Cinzel', serif; font-size: 14px; font-weight: 600; letter-spacing: 4px; cursor: pointer; transition: all 0.4s; margin-bottom: 25px; text-shadow: 0 0 20px <?php echo $color; ?>44; }
    .prod-btn:hover { background: <?php echo $color; ?>; color: #1a1a1a; }
    .prod-trust { display: flex; gap: 25px; padding-top: 25px; border-top: 1px solid #eee; }
    .prod-trust-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #888; }
    .prod-trust-item svg { stroke: <?php echo $color; ?>; width: 18px; height: 18px; }
    .prod-dark { background: #0a0a0a; color: #fff !important; padding: 150px 50px; }
    .prod-dark * { color: inherit; }
    .prod-dark h2, .prod-dark p { color: #fff !important; }
    .prod-section-inner { max-width: 850px; margin: 0 auto; text-align: center; }
    .prod-section-label { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 6px; color: <?php echo $color; ?>; margin-bottom: 25px; display: flex; align-items: center; justify-content: center; gap: 15px; }
    .prod-section-title { font-family: 'Cinzel', serif; font-size: clamp(30px, 5vw, 44px); font-weight: 400; margin-bottom: 50px; letter-spacing: 2px; }
    .prod-dark .prod-section-title { color: #fff !important; }
    .prod-section-ornament { margin-bottom: 40px; }
    .prod-historia { font-size: 19px; line-height: 1.9; color: rgba(255,255,255,0.85) !important; max-width: 700px; margin: 0 auto; text-align: justify; }
    .prod-historia p { color: rgba(255,255,255,0.9) !important; margin-bottom: 2em; padding: 0 10px; }
    .prod-historia p:first-of-type::first-letter { font-size: 3.5em; float: left; line-height: 0.8; padding-right: 12px; color: <?php echo $color; ?>; font-family: 'Cinzel', serif; font-weight: 400; }
    .prod-historia p:last-of-type { font-style: italic; color: <?php echo $color; ?> !important; text-align: center; margin-top: 2.5em; }
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

    /* MENSAJE DEL GUARDIAN */
    .prod-mensaje { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); padding: 100px 50px; position: relative; overflow: hidden; }
    .prod-mensaje::before { content: '"'; position: absolute; top: 30px; left: 50%; transform: translateX(-50%); font-size: 200px; color: <?php echo $color; ?>; opacity: 0.1; font-family: 'Cinzel', serif; line-height: 1; }
    .prod-mensaje-inner { max-width: 800px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
    .prod-mensaje-texto { font-size: 24px; line-height: 1.9; font-style: italic; color: rgba(255,255,255,0.9); margin-bottom: 30px; }
    .prod-mensaje-firma { color: <?php echo $color; ?>; font-family: 'Cinzel', serif; font-size: 18px; letter-spacing: 3px; }

    /* CUIDADOS - TABS INTERACTIVOS */
    .prod-cuidados { background: #faf9f7; padding: 100px 50px; }
    .prod-cuidados-inner { max-width: 1000px; margin: 0 auto; }
    .prod-cuidados-tabs { display: flex; justify-content: center; gap: 10px; margin-bottom: 40px; flex-wrap: wrap; }
    .prod-cuidado-tab { padding: 12px 28px; background: transparent; border: 1px solid #ddd; border-radius: 30px; font-family: 'Cinzel', serif; font-size: 13px; letter-spacing: 2px; cursor: pointer; transition: all 0.3s; color: #666; }
    .prod-cuidado-tab:hover { border-color: <?php echo $color; ?>; color: <?php echo $color; ?>; }
    .prod-cuidado-tab.active { background: <?php echo $color; ?>; border-color: <?php echo $color; ?>; color: #000; }
    .prod-cuidado-content { display: none; animation: fadeIn 0.5s ease; }
    .prod-cuidado-content.active { display: block; }
    .prod-cuidado-card { background: #fff; border-radius: 20px; padding: 50px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
    .prod-cuidado-card h4 { font-family: 'Cinzel', serif; font-size: 22px; color: <?php echo $color; ?>; margin-bottom: 20px; }
    .prod-cuidado-card p { font-size: 17px; line-height: 1.9; color: #555; }
    .prod-cuidado-tips { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px; }
    .prod-cuidado-tip { background: #faf9f7; padding: 20px; border-radius: 12px; text-align: center; }
    .prod-cuidado-tip-icon { font-size: 28px; margin-bottom: 10px; }
    .prod-cuidado-tip-text { font-size: 14px; color: #666; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* TESTIMONIOS - FONDO MAGICO */
    .prod-testimonios {
        background: linear-gradient(180deg, #0a0a0a 0%, #0d0815 30%, #120a1a 50%, #0d0815 70%, #0a0a0a 100%);
        padding: 100px 50px;
        position: relative;
        overflow: hidden;
    }
    .prod-testimonios::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background:
            radial-gradient(ellipse at 20% 30%, rgba(147,112,219,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(201,162,39,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 70%);
        pointer-events: none;
    }
    .prod-testimonios::after {
        content: '✦';
        position: absolute;
        font-size: 200px;
        color: rgba(201,162,39,0.03);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }
    .prod-testimonios-inner { max-width: 900px; margin: 0 auto; position: relative; z-index: 1; }
    .prod-testimonios-slider { position: relative; overflow: hidden; min-height: 200px; }
    .prod-testimonio { display: none; text-align: center; padding: 0 40px; animation: fadeIn 0.5s ease; }
    .prod-testimonio.active { display: block; }
    .prod-testimonio-texto { font-size: 20px; line-height: 1.9; font-style: italic; color: rgba(255,255,255,0.85); margin-bottom: 30px; }
    .prod-testimonio-autor { color: <?php echo $color; ?>; font-family: 'Cinzel', serif; font-size: 14px; letter-spacing: 2px; }
    .prod-testimonio-lugar { color: rgba(255,255,255,0.4); font-size: 13px; margin-top: 5px; }
    .prod-testimonios-dots { display: flex; justify-content: center; gap: 10px; margin-top: 40px; }
    .prod-testimonios-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.2); cursor: pointer; transition: all 0.3s; }
    .prod-testimonios-dot.active { background: <?php echo $color; ?>; transform: scale(1.2); }

    /* ANIMACIONES DE SCROLL - las secciones ahora son visibles por defecto */
    .prod-mensaje, .prod-cuidados, .prod-testimonios, .prod-faq { opacity: 1; transform: translateY(0); transition: opacity 0.8s ease, transform 0.8s ease; }

    /* FAQ ACORDEON */
    .prod-faq { background: #faf9f7; padding: 100px 50px; }
    .prod-faq-inner { max-width: 800px; margin: 0 auto; }
    .prod-faq-item { background: #fff; border-radius: 12px; margin-bottom: 15px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
    .prod-faq-pregunta { width: 100%; padding: 25px 30px; background: none; border: none; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #1a1a1a; text-align: left; transition: all 0.3s; }
    .prod-faq-pregunta:hover { color: <?php echo $color; ?>; }
    .prod-faq-icon { font-size: 24px; color: <?php echo $color; ?>; transition: transform 0.3s; }
    .prod-faq-item.open .prod-faq-icon { transform: rotate(45deg); }
    .prod-faq-respuesta { max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.4s ease; }
    .prod-faq-item.open .prod-faq-respuesta { max-height: 300px; }
    .prod-faq-respuesta-inner { padding: 0 30px 25px; font-size: 16px; line-height: 1.8; color: #666; }

    .prod-cta { background: #0a0a0a; padding: 150px 50px; text-align: center; position: relative; overflow: hidden; }
    .prod-cta-content { position: relative; z-index: 1; }
    .prod-cta-ornament { margin-bottom: 40px; }
    .prod-cta-name { font-family: 'Cinzel', serif; font-size: clamp(36px, 6vw, 56px); font-weight: 400; margin-bottom: 20px; }
    .prod-cta-price { font-family: 'Cinzel', serif; font-size: 38px; color: <?php echo $color; ?>; margin-bottom: 40px; }
    .prod-cta-btn { display: inline-block; padding: 24px 80px; background: <?php echo $color; ?>; color: #0a0a0a; border: none; font-family: 'Cinzel', serif; font-size: 15px; font-weight: 600; letter-spacing: 4px; cursor: pointer; transition: all 0.4s; text-decoration: none; }
    .prod-cta-btn:hover { background: #fff; transform: translateY(-3px); box-shadow: 0 20px 50px <?php echo $color; ?>44; }
    .prod-cta-note { margin-top: 30px; font-size: 15px; color: rgba(255,255,255,0.4); font-style: italic; }

    @media (max-width: 1024px) {
        .prod-grid { grid-template-columns: 1fr; gap: 50px; }
        .prod-gallery { position: relative; top: 0; }
        .prod-specs-grid { grid-template-columns: 1fr; gap: 40px; }
        .prod-strengths-grid { grid-template-columns: 1fr; gap: 30px; }
    }

    @media (max-width: 768px) {
        /* ═══════════════════════════════════════════════════════════════ */
        /* HERO MOVIL CON ANIMACIONES AVANZADAS                           */
        /* ═══════════════════════════════════════════════════════════════ */

        .prod-hero {
            min-height: 100svh;
            padding: 30px 20px 60px;
        }

        .prod-hero-content {
            padding: 20px;
        }

        /* Badge animado con color de categoria */
        .prod-badge {
            font-size: 8px;
            letter-spacing: 3px;
            padding: 12px 25px;
            margin-bottom: 35px;
            animation: badgePulse 3s ease-in-out infinite;
        }

        @keyframes badgePulse {
            0%, 100% {
                box-shadow: 0 0 0 0 currentColor;
            }
            50% {
                box-shadow: 0 0 20px -5px currentColor;
            }
        }

        /* Nombre con animacion de entrada y glow */
        .prod-nombre {
            font-size: clamp(28px, 8vw, 48px);
            letter-spacing: 3px;
            margin-bottom: 18px;
            animation: nombreEntrada 1.2s ease-out, nombreGlow 4s ease-in-out infinite 1.2s;
        }

        @keyframes nombreEntrada {
            0% {
                opacity: 0;
                transform: translateY(30px);
                filter: blur(10px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
                filter: blur(0);
            }
        }

        @keyframes nombreGlow {
            0%, 100% {
                text-shadow: 0 0 30px currentColor;
            }
            50% {
                text-shadow: 0 0 50px currentColor, 0 0 80px currentColor;
            }
        }

        /* Tipo con animacion escalonada */
        .prod-tipo {
            font-size: 11px;
            letter-spacing: 3px;
            animation: tipoEntrada 1s ease-out 0.5s both;
        }

        @keyframes tipoEntrada {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 0.5;
                transform: translateY(0);
            }
        }

        /* Ornamento con animacion de dibujo */
        .prod-hero-ornament {
            margin-top: 40px;
            animation: ornamentDraw 2s ease-out 0.8s both;
        }

        @keyframes ornamentDraw {
            0% {
                opacity: 0;
                transform: scaleX(0);
            }
            100% {
                opacity: 1;
                transform: scaleX(1);
            }
        }

        /* Animaciones de fondo mas sutiles en movil */
        .prod-hero .anim-monedas .moneda,
        .prod-hero .anim-corazones .corazon,
        .prod-hero .anim-hojas .hoja {
            animation-duration: 6s;
            opacity: 0.4;
        }

        .prod-hero .anim-escudo .escudo-central {
            width: 120px;
            height: 150px;
        }

        .prod-hero .anim-constelaciones .constelacion {
            max-width: 280px;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* SECCIONES CON FONDO CREMITA Y VIDA                             */
        /* ═══════════════════════════════════════════════════════════════ */

        .prod-cream {
            padding: 60px 20px;
            background: linear-gradient(180deg,
                #FAF8F5 0%,
                #FDF9F3 40%,
                #F8F3EB 70%,
                #FAF8F5 100%
            );
            position: relative;
        }

        .prod-cream::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at 20% 30%, rgba(198,169,98,0.08) 0%, transparent 50%);
            pointer-events: none;
        }

        .prod-dark, .prod-white, .prod-strengths, .prod-ritual, .prod-cta {
            padding: 70px 20px;
        }

        .prod-ritual-card {
            padding: 40px 25px;
        }

        .prod-details-name {
            font-size: 28px;
            animation: slideInRight 0.8s ease-out;
        }

        @keyframes slideInRight {
            0% {
                opacity: 0;
                transform: translateX(30px);
            }
            100% {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .prod-price {
            font-size: 24px;
        }

        .prod-spec-box {
            padding: 30px 20px;
        }

        .prod-dimensions {
            flex-direction: column;
            gap: 15px;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* GALERIA MOVIL CON EFECTO SWIPE                                  */
        /* ═══════════════════════════════════════════════════════════════ */

        .prod-gallery {
            margin-bottom: 30px;
        }

        .prod-main-img {
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            animation: imgZoom 0.8s ease-out;
        }

        @keyframes imgZoom {
            0% {
                opacity: 0;
                transform: scale(0.95);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        .prod-thumbs {
            gap: 8px;
            margin-top: 15px;
            overflow-x: auto;
            padding-bottom: 10px;
            -webkit-overflow-scrolling: touch;
        }

        .prod-thumb {
            width: 60px;
            height: 75px;
            border-radius: 6px;
            flex-shrink: 0;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* BOTON SELLAR PACTO CON ANIMACION                               */
        /* ═══════════════════════════════════════════════════════════════ */

        .prod-btn {
            padding: 20px;
            font-size: 12px;
            letter-spacing: 3px;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
        }

        .prod-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transform: translateX(-100%);
            animation: btnShine 3s ease-in-out infinite;
        }

        @keyframes btnShine {
            0%, 100% {
                transform: translateX(-100%);
            }
            50% {
                transform: translateX(100%);
            }
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* TRUST BADGES EN MOVIL                                          */
        /* ═══════════════════════════════════════════════════════════════ */

        .prod-trust {
            flex-direction: column;
            gap: 12px;
        }

        .prod-trust-item {
            justify-content: center;
            padding: 10px;
            background: rgba(0,0,0,0.02);
            border-radius: 8px;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* HISTORIA CON ANIMACION DE SCROLL                               */
        /* ═══════════════════════════════════════════════════════════════ */

        .prod-dark .prod-section-inner {
            padding: 0 10px;
        }

        .prod-section-title {
            font-size: clamp(24px, 6vw, 32px);
            margin-bottom: 35px;
        }

        .prod-historia {
            font-size: 17px;
            line-height: 1.9;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* FORTALEZAS GRID MEJORADO                                       */
        /* ═══════════════════════════════════════════════════════════════ */

        .prod-strengths {
            background: linear-gradient(180deg, #F8F6F2 0%, #FAF8F5 100%);
        }

        .prod-strengths-grid {
            gap: 20px;
        }

        .prod-strength {
            padding: 35px 20px;
            border-radius: 12px;
        }

        .prod-strength-title {
            font-size: 16px;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* QUE INCLUYE - ITEMS MEJORADOS                                  */
        /* ═══════════════════════════════════════════════════════════════ */

        .prod-incluye-item {
            padding: 12px;
            margin-bottom: 12px;
            border-radius: 8px;
        }

        .prod-incluye-item-title {
            font-size: 14px;
        }

        .prod-incluye-item-desc {
            font-size: 13px;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* MENSAJES Y SECCIONES INTERACTIVAS                              */
        /* ═══════════════════════════════════════════════════════════════ */

        .prod-mensaje {
            padding: 70px 20px;
        }

        .prod-mensaje-texto {
            font-size: 18px;
            line-height: 1.8;
        }

        .prod-cuidados-tabs {
            gap: 8px;
        }

        .prod-cuidado-tab {
            padding: 10px 18px;
            font-size: 11px;
        }

        .prod-cuidado-card {
            padding: 30px 20px;
        }

        .prod-cuidado-card h4 {
            font-size: 18px;
        }

        .prod-cuidado-card p {
            font-size: 15px;
        }

        .prod-cuidado-tips {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }

        .prod-cuidado-tip {
            padding: 15px 10px;
        }

        .prod-cuidado-tip-icon {
            font-size: 22px;
        }

        .prod-cuidado-tip-text {
            font-size: 11px;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* FAQ MOVIL                                                       */
        /* ═══════════════════════════════════════════════════════════════ */

        .prod-faq {
            padding: 70px 20px;
        }

        .prod-faq-pregunta {
            padding: 20px;
            font-size: 16px;
        }

        .prod-faq-respuesta-inner {
            padding: 0 20px 20px;
            font-size: 15px;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* CTA FINAL MOVIL                                                 */
        /* ═══════════════════════════════════════════════════════════════ */

        .prod-cta-name {
            font-size: clamp(28px, 8vw, 40px);
        }

        .prod-cta-price {
            font-size: 28px;
        }

        .prod-cta-btn {
            padding: 20px 50px;
            font-size: 12px;
            letter-spacing: 3px;
            width: 100%;
            max-width: 300px;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* TESTIMONIOS MOVIL                                               */
        /* ═══════════════════════════════════════════════════════════════ */

        .prod-testimonios {
            padding: 70px 20px;
        }

        .prod-testimonio {
            padding: 0 10px;
        }

        .prod-testimonio-texto {
            font-size: 17px;
        }
    }

    /* ═══════════════════════════════════════════════════════════════ */
    /* EXTRA PEQUENO                                                   */
    /* ═══════════════════════════════════════════════════════════════ */
    @media (max-width: 380px) {
        .prod-nombre {
            font-size: 26px;
        }

        .prod-badge {
            font-size: 7px;
            padding: 10px 20px;
        }

        .prod-details-name {
            font-size: 24px;
        }

        .prod-price {
            font-size: 22px;
        }

        .prod-cuidado-tips {
            grid-template-columns: 1fr;
        }
    }

    /* ═══════════════════════════════════════════════════════════════════════ */
    /* HISTORIA - BLOQUES EN TORRE SEPARADOS                                   */
    /* ═══════════════════════════════════════════════════════════════════════ */
    .prod-historia-blocks {
        display: flex;
        flex-direction: column;
        gap: 25px;
        max-width: 800px;
        margin: 0 auto;
    }
    .historia-block {
        position: relative;
        padding: 35px 40px;
        background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
        border-radius: 16px;
        border: 1px solid <?php echo $color; ?>33;
        border-left: 3px solid <?php echo $color; ?>;
        animation: blockFloat 5s ease-in-out infinite;
        overflow: hidden;
    }
    .historia-block::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, <?php echo $color; ?>, transparent);
        opacity: 0.5;
    }
    .historia-block:nth-child(1) { animation-delay: 0s; }
    .historia-block:nth-child(2) { animation-delay: 0.5s; }
    .historia-block:nth-child(3) { animation-delay: 1s; }
    .historia-block:nth-child(4) { animation-delay: 1.5s; }
    @keyframes blockFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
    }
    .historia-block p {
        color: rgba(255,255,255,0.9) !important;
        font-size: 17px;
        line-height: 1.9;
        margin: 0;
    }
    .historia-block:hover {
        border-color: <?php echo $color; ?>66;
        box-shadow: 0 10px 40px <?php echo $color; ?>15;
        transform: translateY(-4px);
    }
    .historia-block:last-child p {
        font-style: italic;
        color: <?php echo $color; ?> !important;
    }

    /* ═══════════════════════════════════════════════════════════════════════ */
    /* FICHA - HOVER ANIMATIONS                                                */
    /* ═══════════════════════════════════════════════════════════════════════ */
    .ficha-item {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    }
    .ficha-item::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, <?php echo $color; ?>15 0%, transparent 100%);
        opacity: 0;
        transition: opacity 0.4s;
    }
    .ficha-item:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 15px 40px <?php echo $color; ?>25;
        border-color: <?php echo $color; ?>66;
    }
    .ficha-item:hover::before {
        opacity: 1;
    }
    .ficha-label {
        transition: all 0.3s;
    }
    .ficha-item:hover .ficha-label {
        text-shadow: 0 0 15px <?php echo $color; ?>, 0 0 30px <?php echo $color; ?>66;
    }
    /* Icons that pulse on hover */
    .ficha-item:hover .ficha-icon {
        animation: fichaIconPulse 0.6s ease-in-out;
    }
    @keyframes fichaIconPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }

    /* ═══════════════════════════════════════════════════════════════════════ */
    /* FRASE/LEMA - ILUMINADA Y ANIMADA                                        */
    /* ═══════════════════════════════════════════════════════════════════════ */
    .ficha-frase {
        position: relative;
        padding: 40px;
        background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%);
        border-radius: 20px;
        border: 1px solid <?php echo $color; ?>44;
        overflow: hidden;
    }
    .ficha-frase::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, <?php echo $color; ?>20 0%, transparent 70%);
        transform: translate(-50%, -50%);
        animation: fraseGlow 4s ease-in-out infinite;
    }
    @keyframes fraseGlow {
        0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
    }
    .ficha-frase-text {
        position: relative;
        z-index: 1;
        font-size: 20px;
        font-style: italic;
        color: <?php echo $color; ?>;
        text-shadow: 0 0 30px <?php echo $color; ?>44, 0 0 60px <?php echo $color; ?>22;
        animation: fraseShimmer 3s ease-in-out infinite;
    }
    @keyframes fraseShimmer {
        0%, 100% { opacity: 0.9; }
        50% { opacity: 1; text-shadow: 0 0 40px <?php echo $color; ?>, 0 0 80px <?php echo $color; ?>44; }
    }

    /* ═══════════════════════════════════════════════════════════════════════ */
    /* DATO CURIOSO - MAS DESTACADO                                            */
    /* ═══════════════════════════════════════════════════════════════════════ */
    .ficha-dato {
        position: relative;
        padding: 30px;
        background: linear-gradient(135deg, <?php echo $color; ?>15 0%, <?php echo $color; ?>05 100%);
        border-radius: 15px;
        border: 2px solid <?php echo $color; ?>44;
        overflow: hidden;
    }
    .ficha-dato::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, <?php echo $color; ?>, transparent);
        animation: datoLine 2s linear infinite;
    }
    @keyframes datoLine {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    .ficha-dato-icon {
        display: inline-block;
        animation: datoSparkle 1.5s ease-in-out infinite;
    }
    @keyframes datoSparkle {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.1) rotate(-5deg); }
        75% { transform: scale(1.1) rotate(5deg); }
    }

    /* ═══════════════════════════════════════════════════════════════════════ */
    /* QUE INCLUYE - SECTORES RESALTADOS                                       */
    /* ═══════════════════════════════════════════════════════════════════════ */
    .prod-incluye-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 10px;
    }
    .prod-incluye-item:hover {
        transform: translateX(8px);
        background: rgba(255,255,255,0.08) !important;
        border-left-width: 4px;
    }
    .prod-incluye-item svg {
        transition: all 0.3s;
    }
    .prod-incluye-item:hover svg {
        transform: scale(1.15);
        filter: drop-shadow(0 0 8px <?php echo $color; ?>);
    }
    .prod-incluye-highlight {
        animation: includeHighlight 3s ease-in-out infinite;
    }
    @keyframes includeHighlight {
        0%, 100% { box-shadow: 0 0 0 0 <?php echo $color; ?>00; }
        50% { box-shadow: 0 0 25px -5px <?php echo $color; ?>44; }
    }

    /* ═══════════════════════════════════════════════════════════════════════ */
    /* SUS DONES - ANIMADOS                                                    */
    /* ═══════════════════════════════════════════════════════════════════════ */
    .prod-strength {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .prod-strength:hover {
        transform: translateY(-10px);
        box-shadow: 0 30px 60px rgba(0,0,0,0.12);
    }
    .prod-strength:hover::before {
        width: 80px;
    }
    .prod-strength-icon {
        transition: all 0.4s;
    }
    .prod-strength:hover .prod-strength-icon {
        transform: scale(1.2);
    }
    .prod-strength:hover .prod-strength-icon svg {
        filter: drop-shadow(0 0 10px <?php echo $color; ?>);
    }
    .prod-strength:nth-child(1) { animation: donFloat 4s ease-in-out infinite; }
    .prod-strength:nth-child(2) { animation: donFloat 4s ease-in-out infinite 0.5s; }
    .prod-strength:nth-child(3) { animation: donFloat 4s ease-in-out infinite 1s; }
    @keyframes donFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    /* ═══════════════════════════════════════════════════════════════════════ */
    /* TESTIMONIOS - FONDO ANIMADO MEJORADO                                    */
    /* ═══════════════════════════════════════════════════════════════════════ */
    .prod-testimonios {
        position: relative;
        overflow: hidden;
    }
    .prod-testimonios::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 300%;
        height: 100%;
        background: linear-gradient(90deg,
            transparent 0%,
            <?php echo $color; ?>05 25%,
            <?php echo $color; ?>10 50%,
            <?php echo $color; ?>05 75%,
            transparent 100%
        );
        animation: testimonioWave 15s linear infinite;
    }
    @keyframes testimonioWave {
        0% { transform: translateX(0); }
        100% { transform: translateX(33.33%); }
    }
    .prod-testimonios-inner {
        position: relative;
        z-index: 1;
    }

    /* ═══════════════════════════════════════════════════════════════════════ */
    /* QUE INCLUYE - TITULO NEON CON LUZ DESLIZANTE + ORBES                    */
    /* ═══════════════════════════════════════════════════════════════════════ */
    .incluye-orbes {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
    }
    .incluye-orbe {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.15;
        animation: orbeFloat 8s ease-in-out infinite;
    }
    .orbe-1 {
        width: 200px;
        height: 200px;
        background: <?php echo $color; ?>;
        top: -50px;
        right: -50px;
        animation-delay: 0s;
    }
    .orbe-2 {
        width: 150px;
        height: 150px;
        background: <?php echo $color; ?>;
        bottom: -30px;
        left: 20%;
        animation-delay: 2s;
    }
    .orbe-3 {
        width: 100px;
        height: 100px;
        background: <?php echo $color; ?>;
        top: 50%;
        right: 20%;
        animation-delay: 4s;
    }
    @keyframes orbeFloat {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
        50% { transform: translate(20px, -20px) scale(1.2); opacity: 0.25; }
    }
    .incluye-title-neon {
        position: relative;
        color: <?php echo $color; ?> !important;
        text-shadow: 0 0 10px <?php echo $color; ?>66, 0 0 20px <?php echo $color; ?>44, 0 0 40px <?php echo $color; ?>22;
        overflow: hidden;
    }
    .incluye-title-neon::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: neonSlide 3s ease-in-out infinite;
    }
    @keyframes neonSlide {
        0% { left: -100%; }
        50%, 100% { left: 150%; }
    }
    .prod-incluye-box .prod-spec-content {
        position: relative;
        z-index: 2;
    }
    </style>

<div class="duendes-producto-page">
<section class="prod-hero">
    <?php echo duendes_animacion($animacion_tipo, $color); ?>
    <div class="prod-hero-content">
        <span class="prod-badge"><?php
            echo duendes_ornament('star-small', $color);
            // Badge dinámico según tipo y género
            $unico_a = (duendes_pronombre($genero, 'el_la') === 'la') ? 'ÚNICA' : 'ÚNICO';
            echo ' CADA ' . strtoupper($tipo_config['nombre']) . ' ES ' . $unico_a . ' ';
            echo duendes_ornament('star-small', $color);
        ?></span>
        <h1 class="prod-nombre"><?php echo esc_html($nombre); ?></h1>
        <p class="prod-tipo"><?php
            // Siempre mostrar: GUARDIÁN/A · TIPO · CATEGORÍA
            $subtitulo_partes = [
                strtoupper($guardian),
                strtoupper($tipo_config['nombre']),
                strtoupper($cat_config['nombre'])
            ];
            echo esc_html(implode(' · ', $subtitulo_partes));
        ?></p>
        <!-- BLOQUE 5: A QUIÉN BUSCA -->
        <div class="prod-quien-busca" style="max-width: 700px; margin: 25px auto; padding: 20px 25px; background: linear-gradient(135deg, rgba(<?php echo $es_femenino ? '191,95,255' : '201,162,39'; ?>,0.1) 0%, transparent 100%); border-left: 3px solid <?php echo $color; ?>40; font-family: 'Cormorant Garamond', serif; font-size: 18px; line-height: 1.8; color: rgba(255,255,255,0.9); font-style: italic;">
            <?php echo esc_html(duendes_get_quien_busca($post->ID, $nombre, $cat_slug)); ?>
        </div>
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
            <p class="prod-details-meta"><?php echo esc_html($tipo_config['nombre']); ?><?php if ($altura): ?> &bull; <?php echo esc_html($altura); ?> cm<?php endif; ?> &bull; Elemento <?php echo esc_html(ucfirst($elemento)); ?></p>
            <p class="prod-price"><?php echo $precio; ?></p>
            <?php if ($short_desc): ?><p class="prod-short-desc"><?php echo wp_kses_post($short_desc); ?></p><?php endif; ?>
            <form method="post" action="<?php echo esc_url(wc_get_cart_url()); ?>">
                <input type="hidden" name="add-to-cart" value="<?php echo $product->get_id(); ?>">
                <button type="submit" class="prod-btn"><?php echo esc_html(duendes_texto_boton_pacto($product)); ?></button>
            </form>
            <!-- INFO ENVÍO -->
            <div class="prod-envio-info" style="margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%); border-radius: 8px; font-size: 13px; border: 1px solid rgba(201,162,39,0.2);">
                <?php $pais_usuario = duendes_detectar_pais(); ?>
                <?php if ($pais_usuario === 'UY'): ?>
                <div style="color: rgba(255,255,255,0.8);">
                    <span style="font-size: 16px;">🇺🇾</span> Uruguay: $222 aprox · se paga al recibir
                </div>
                <div style="font-size: 12px; color: <?php echo $color; ?>; margin-top: 8px;">
                    ✨ Envío gratis en compras desde $10.000
                </div>
                <?php else: ?>
                <div style="color: rgba(255,255,255,0.8);">
                    <span style="font-size: 16px;">🌎</span> Internacional: vía DHL Express · calculado al finalizar
                </div>
                <div style="font-size: 12px; color: <?php echo $color; ?>; margin-top: 8px;">
                    ✨ Envío gratis en compras desde $1.000 USD
                </div>
                <?php endif; ?>
            </div>
            <div class="prod-trust">
                <span class="prod-trust-item"><?php echo duendes_icon('certificate', 20); ?> Certificado digital</span>
                <span class="prod-trust-item"><?php echo duendes_icon('star', 20); ?> Ser único</span>
                <span class="prod-trust-item"><?php echo duendes_icon('scroll', 20); ?> Canalización incluida</span>
            </div>
        </div>
    </div>
</section>

<section class="prod-dark">
    <div class="prod-section-inner">
        <p class="prod-section-label"><?php echo duendes_ornament('star-small', $color); ?> SU HISTORIA <?php echo duendes_ornament('star-small', $color); ?></p>
        <h2 class="prod-section-title"><?php echo esc_html($El_La); ?> Origen de <?php echo esc_html($nombre); ?></h2>
        <div class="prod-section-ornament"><?php echo duendes_ornament('flourish', $color); ?></div>
        <div class="prod-historia-blocks">
            <?php
            // Obtener el contenido de la historia
            $historia_content = '';
            if ($historia) {
                $historia_content = $historia;
            } elseif ($descripcion) {
                $historia_content = strip_tags($descripcion, '<p>');
            } else {
                $historia_content = $nombre . ' emerge de los antiguos bosques de Piriapolis, donde los velos entre mundos son mas delgados. Su energia ha esperado pacientemente el momento exacto para cruzar y encontrar a quien esta ' . $destinado_a . ' a acompanar.

Los guardianes no se eligen: ellos eligen. Si sentis un llamado hacia ' . $nombre . ', es porque ya te ha reconocido.';
            }

            // Dividir en párrafos y crear bloques
            $parrafos = preg_split('/\n\s*\n|\<\/p\>\s*\<p\>|\<p\>|\<\/p\>/', $historia_content);
            $parrafos = array_filter(array_map('trim', $parrafos));

            // Si hay un solo párrafo muy largo, dividirlo por oraciones
            $parrafos_finales = [];
            foreach ($parrafos as $parrafo) {
                $parrafo = trim($parrafo);
                if (empty($parrafo)) continue;

                // Si el párrafo es muy largo (más de 350 chars), dividir por oraciones
                if (strlen($parrafo) > 350) {
                    // Dividir por punto seguido de espacio y mayúscula
                    $oraciones = preg_split('/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ])/', $parrafo);
                    $bloque_actual = '';

                    foreach ($oraciones as $oracion) {
                        // Acumular oraciones hasta tener un bloque de ~200-400 chars
                        if (strlen($bloque_actual) + strlen($oracion) < 400) {
                            $bloque_actual .= ($bloque_actual ? ' ' : '') . trim($oracion);
                        } else {
                            if (!empty($bloque_actual)) {
                                $parrafos_finales[] = $bloque_actual;
                            }
                            $bloque_actual = trim($oracion);
                        }
                    }
                    if (!empty($bloque_actual)) {
                        $parrafos_finales[] = $bloque_actual;
                    }
                } else {
                    $parrafos_finales[] = $parrafo;
                }
            }

            foreach ($parrafos_finales as $parrafo):
                if (!empty($parrafo)):
            ?>
            <div class="historia-block">
                <p><?php echo wp_kses_post($parrafo); ?></p>
            </div>
            <?php
                endif;
            endforeach;
            ?>
        </div>
    </div>
</section>

<?php if ($usar_ficha): ?>
<!-- FICHA DEL GUARDIÁN -->
<section class="prod-ficha" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 100px 50px;">
    <div style="max-width: 900px; margin: 0 auto;">
        <p class="prod-section-label" style="color: <?php echo $color; ?> !important; text-align: center; margin-bottom: 25px;"><?php echo duendes_ornament('star-small', $color); ?> FICHA DEL GUARDIÁN <?php echo duendes_ornament('star-small', $color); ?></p>
        <h2 style="font-family: 'Cinzel', serif; font-size: 22px; text-align: center; color: #fff !important; margin-bottom: 15px;">Conocé a <?php echo esc_html($nombre); ?></h2>

        <!-- Especie y Familia -->
        <div style="text-align: center; margin-bottom: 40px; padding: 20px; background: rgba(201,169,98,0.1); border-radius: 10px; border-left: 3px solid <?php echo $color; ?>;">
            <p style="color: #fff !important; font-size: 13px; margin: 0;">
                <strong style="color: <?php echo $color; ?> !important;">Especie:</strong> <?php echo esc_html($especies_nombres[$ficha_especie][$ficha_genero] ?? ucfirst($ficha_especie)); ?>
                <?php if ($ficha_familia): ?>
                    <span style="margin: 0 15px; color: rgba(255,255,255,0.3);">|</span>
                    <strong style="color: <?php echo $color; ?> !important;">Familia/Estilo:</strong> <?php echo esc_html($ficha_familia); ?>
                <?php endif; ?>
            </p>
        </div>

        <!-- Badge único/recreable -->
        <div style="text-align: center; margin-bottom: 40px;">
            <?php
            $es_unico_final = $ficha_es_unico;
            if ($ficha_es_unico === 'auto') {
                $es_unico_final = ($ficha_especie === 'pixie') ? 'unico' : 'recreable';
            }
            $badge_bg = ($es_unico_final === 'unico') ? $color : '#4a9962';
            $badge_text = ($es_unico_final === 'unico') ? '#1a1a2e' : '#fff';
            ?>
            <span style="display: inline-block; padding: 6px 20px; background: <?php echo $badge_bg; ?>; color: <?php echo $badge_text; ?>; font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 2px; border-radius: 20px;">
                <?php echo ($es_unico_final === 'unico') ? 'SER ÚNICO' : 'SER RECREABLE'; ?>
            </span>
        </div>

        <!-- Grid de datos -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <?php if (!empty($ficha['flor_favorita'])): ?>
            <div class="ficha-item" style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; border: 1px solid transparent; cursor: default;">
                <p class="ficha-label" style="color: <?php echo $color; ?> !important; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; text-shadow: 0 0 10px <?php echo $color; ?>66, 0 0 20px <?php echo $color; ?>33;">Flor Favorita</p>
                <p style="color: #fff !important; font-size: 14px; margin: 0;"><?php echo esc_html($ficha['flor_favorita']); ?></p>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['piedra_favorita'])): ?>
            <div class="ficha-item" style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; border: 1px solid transparent; cursor: default;">
                <p class="ficha-label" style="color: <?php echo $color; ?> !important; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; text-shadow: 0 0 10px <?php echo $color; ?>66, 0 0 20px <?php echo $color; ?>33;">Cristal Favorito</p>
                <p style="color: #fff !important; font-size: 14px; margin: 0;"><?php echo esc_html($ficha['piedra_favorita']); ?></p>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['color_favorito'])): ?>
            <div class="ficha-item" style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; border: 1px solid transparent; cursor: default;">
                <p class="ficha-label" style="color: <?php echo $color; ?> !important; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; text-shadow: 0 0 10px <?php echo $color; ?>66, 0 0 20px <?php echo $color; ?>33;">Color Favorito</p>
                <p style="color: #fff !important; font-size: 14px; margin: 0;"><?php echo esc_html($ficha['color_favorito']); ?></p>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['espacio_casa'])): ?>
            <div class="ficha-item" style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; border: 1px solid transparent; cursor: default;">
                <p class="ficha-label" style="color: <?php echo $color; ?> !important; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; text-shadow: 0 0 10px <?php echo $color; ?>66, 0 0 20px <?php echo $color; ?>33;">Espacio Favorito</p>
                <p style="color: #fff !important; font-size: 14px; margin: 0;"><?php echo esc_html($ficha['espacio_casa']); ?></p>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['elemento'])): ?>
            <div class="ficha-item" style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; border: 1px solid transparent; cursor: default;">
                <p class="ficha-label" style="color: <?php echo $color; ?> !important; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; text-shadow: 0 0 10px <?php echo $color; ?>66, 0 0 20px <?php echo $color; ?>33;">Elemento</p>
                <p style="color: #fff !important; font-size: 14px; margin: 0;"><?php echo esc_html($ficha['elemento']); ?></p>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['estacion'])): ?>
            <div class="ficha-item" style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; border: 1px solid transparent; cursor: default;">
                <p class="ficha-label" style="color: <?php echo $color; ?> !important; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; text-shadow: 0 0 10px <?php echo $color; ?>66, 0 0 20px <?php echo $color; ?>33;">Estacion Favorita</p>
                <p style="color: #fff !important; font-size: 14px; margin: 0;"><?php echo esc_html($ficha['estacion']); ?></p>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['momento_dia'])): ?>
            <div class="ficha-item" style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; border: 1px solid transparent; cursor: default;">
                <p class="ficha-label" style="color: <?php echo $color; ?> !important; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; text-shadow: 0 0 10px <?php echo $color; ?>66, 0 0 20px <?php echo $color; ?>33;">Momento del Dia</p>
                <p style="color: #fff !important; font-size: 14px; margin: 0;"><?php echo esc_html($ficha['momento_dia']); ?></p>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['le_gusta_pasear'])): ?>
            <div class="ficha-item" style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; border: 1px solid transparent; cursor: default;">
                <p class="ficha-label" style="color: <?php echo $color; ?> !important; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; text-shadow: 0 0 10px <?php echo $color; ?>66, 0 0 20px <?php echo $color; ?>33;">Le gusta pasear?</p>
                <p style="color: #fff !important; font-size: 14px; margin: 0;"><?php
                    $paseo_textos = ['si' => 'Si, le encanta', 'no' => 'Prefiere quedarse en casa', 'preguntar' => 'Le gusta que le pregunten'];
                    echo esc_html($paseo_textos[$ficha['le_gusta_pasear']] ?? $ficha['le_gusta_pasear']);
                ?></p>
            </div>
            <?php endif; ?>
        </div>

        <!-- Le gusta / No le gusta -->
        <?php if (!empty($ficha['le_gusta']) || !empty($ficha['no_le_gusta'])): ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <?php if (!empty($ficha['le_gusta'])): ?>
            <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 10px;">
                <p style="color: <?php echo $color; ?> !important; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; text-shadow: 0 0 10px <?php echo $color; ?>66, 0 0 20px <?php echo $color; ?>33;">Lo que le gusta</p>
                <p style="color: #fff !important; font-size: 13px; line-height: 1.7; margin: 0;"><?php echo esc_html($ficha['le_gusta']); ?></p>
            </div>
            <?php endif; ?>
            <?php if (!empty($ficha['no_le_gusta'])): ?>
            <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 10px;">
                <p style="color: <?php echo $color; ?> !important; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; text-shadow: 0 0 10px <?php echo $color; ?>66, 0 0 20px <?php echo $color; ?>33;">Lo que no le gusta</p>
                <p style="color: #fff !important; font-size: 13px; line-height: 1.7; margin: 0;"><?php echo esc_html($ficha['no_le_gusta']); ?></p>
            </div>
            <?php endif; ?>
        </div>
        <?php endif; ?>

        <!-- Frase/Lema - Animada e iluminada -->
        <?php if (!empty($ficha['frase_lema'])): ?>
        <div class="ficha-frase" style="text-align: center; margin-bottom: 30px;">
            <p class="ficha-frase-text" style="margin: 0;">"<?php echo esc_html($ficha['frase_lema']); ?>"</p>
        </div>
        <?php endif; ?>

        <!-- Dato curioso - Destacado -->
        <?php if (!empty($ficha['dato_curioso'])): ?>
        <div class="ficha-dato">
            <p style="color: <?php echo $color; ?> !important; font-size: 12px; margin-bottom: 12px; font-weight: 500;"><span class="ficha-dato-icon">&#10024;</span> DATO CURIOSO</p>
            <p style="color: #fff !important; font-size: 15px; line-height: 1.8; margin: 0;"><?php echo esc_html($ficha['dato_curioso']); ?></p>
        </div>
        <?php endif; ?>
    </div>
</section>
<?php endif; ?>

<section class="prod-white">
    <div class="prod-specs-grid">
        <div class="prod-spec-box" style="padding: 30px;">
            <div class="prod-spec-header"><?php echo duendes_icon('ruler'); ?><h3>CARACTERÍSTICAS</h3></div>
            <div class="prod-spec-content" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
                <div style="text-align: center; padding: 15px 25px; background: #f8f8f8; border-radius: 8px;">
                    <div style="font-family: 'Cinzel', serif; font-size: 18px; color: #1a1a1a;">Articulad<?php echo ($es_femenino ? 'a' : 'o'); ?></div>
                    <div style="font-size: 10px; letter-spacing: 2px; color: #666; margin-top: 5px;">CAMBIA DE POSICIONES</div>
                </div>
            </div>
        </div>
        <div class="prod-spec-box prod-incluye-box" style="position: relative; overflow: hidden;">
            <!-- Orbes de fondo -->
            <div class="incluye-orbes">
                <div class="incluye-orbe orbe-1"></div>
                <div class="incluye-orbe orbe-2"></div>
                <div class="incluye-orbe orbe-3"></div>
            </div>
            <div class="prod-spec-header" style="position: relative; z-index: 2;"><?php echo duendes_icon('package'); ?><h3 class="incluye-title-neon">QUE INCLUYE TU PACTO</h3></div>
            <div class="prod-spec-content">
                <div class="prod-incluye-item"><?php echo duendes_icon('wand', 24); ?><div class="prod-incluye-item-text"><div class="prod-incluye-item-title"><?php echo esc_html($tipo_config['nombre']); ?> <?php echo esc_html($nombre); ?></div><div class="prod-incluye-item-desc">Ser unic<?php echo ($es_femenino ? 'a' : 'o'); ?> canalizad<?php echo ($es_femenino ? 'a' : 'o'); ?> en Piriapolis</div></div></div>

                <div class="prod-incluye-item"><?php echo duendes_icon('scroll', 24); ?><div class="prod-incluye-item-text"><div class="prod-incluye-item-title">Canalizacion Personalizada</div><div class="prod-incluye-item-desc">Estudio completo de tu guardian: su historia, origen, mensaje personal para vos y guia de cuidados</div></div></div>

                <div class="prod-incluye-item prod-incluye-highlight" style="background: linear-gradient(135deg, <?php echo $color; ?>15 0%, <?php echo $color; ?>05 100%); border: 1px solid <?php echo $color; ?>33; margin: 15px -10px; padding: 20px;">
                    <?php echo duendes_icon('portal', 28); ?>
                    <div class="prod-incluye-item-text">
                        <div class="prod-incluye-item-title" style="color: <?php echo $color; ?>; font-size: 17px;">EL BENEFICIO: Acceso a "Mi Magia"</div>
                        <div class="prod-incluye-item-desc" style="font-size: 15px;">Portal exclusivo donde verás la canalización completa, el mensaje que <?php echo esc_html($nombre); ?> tiene para vos, y experiencias mágicas personalizadas</div>
                    </div>
                </div>

                <div class="prod-incluye-item prod-incluye-highlight"><?php echo duendes_icon('star', 24); ?><div class="prod-incluye-item-text"><div class="prod-incluye-item-title">Seras una Elegida</div><div class="prod-incluye-item-desc">Entras al circulo de personas cuya frecuencia vibratoria fue reconocida por un guardian. No es casualidad que estes aca.</div></div></div>

                <div class="prod-incluye-item"><?php echo duendes_icon('moon', 24); ?><div class="prod-incluye-item-text"><div class="prod-incluye-item-title">15 dias de El Circulo gratis</div><div class="prod-incluye-item-desc">Acceso a lecturas del alma, contenido exclusivo semanal, tiradas de runas y mas</div></div></div>

                <div class="prod-incluye-item"><?php echo duendes_icon('certificate', 24); ?><div class="prod-incluye-item-text"><div class="prod-incluye-item-title">Certificado Digital de Autenticidad</div><div class="prod-incluye-item-desc">Acceso a tu certificado digital unico en el portal Mi Magia que verifica la autenticidad de tu guardian</div></div></div>

                <?php if ($piedras && is_array($piedras) && count($piedras) > 0): ?><div class="prod-incluye-item"><?php echo duendes_icon('crystal', 24); ?><div class="prod-incluye-item-text"><div class="prod-incluye-item-title">Cristales Energeticos</div><div class="prod-incluye-item-desc"><?php echo esc_html(implode(', ', $piedras)); ?></div></div></div><?php endif; ?>
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

<!-- MENSAJE DEL GUARDIAN -->
<section class="prod-mensaje">
    <div class="prod-mensaje-inner">
        <p class="prod-section-label" style="color: <?php echo $color; ?>;"><?php echo duendes_ornament('star-small', $color); ?> SU MENSAJE PARA VOS <?php echo duendes_ornament('star-small', $color); ?></p>
        <p class="prod-mensaje-texto">
            <?php
            $mensajes_default = [
                'proteccion' => 'No vine a protegerte de todo. Vine a recordarte que ya tenés la fuerza. Solo necesitabas a alguien que te lo susurre cada día.',
                'amor' => 'El amor que buscás afuera siempre estuvo adentro. Yo solo vine a hacerte compañía mientras lo recordás.',
                'dinero-abundancia-negocios' => 'La abundancia no es tener más. Es saber que ya tenés suficiente. Dejame mostrarte todo lo que ya sos.',
                'salud' => 'Tu cuerpo sabe sanarse. Tu alma sabe equilibrarse. Yo estoy acá para recordártelo cuando lo olvides.',
                'sabiduria-guia-claridad' => 'Las respuestas que buscás ya las sabés. Solo necesitabas silencio para escucharlas. Yo te ayudo a hacer silencio.',
            ];
            $mensaje_cat = '';
            foreach ($mensajes_default as $key => $msg) {
                if (strpos($categoria_slug, $key) !== false || strpos($key, $categoria_slug) !== false) {
                    $mensaje_cat = $msg;
                    break;
                }
            }
            echo esc_html($mensaje_cat ?: 'Te esperé mucho tiempo. Ahora que me encontraste, vamos a caminar juntos.');
            ?>
        </p>
        <p class="prod-mensaje-firma">— <?php echo esc_html($nombre); ?></p>
    </div>
</section>

<!-- CUIDADOS INTERACTIVOS -->
<section class="prod-cuidados">
    <div class="prod-cuidados-inner">
        <p class="prod-section-label" style="color: <?php echo $color; ?>;"><?php echo duendes_ornament('star-small', $color); ?> CUIDADOS <?php echo duendes_ornament('star-small', $color); ?></p>
        <h2 class="prod-section-title" style="color: #1a1a1a;">Como Cuidar a <?php echo esc_html($nombre); ?></h2>

        <div class="prod-cuidados-tabs">
            <button class="prod-cuidado-tab active" onclick="showCuidado('ubicacion')">UBICACION</button>
            <button class="prod-cuidado-tab" onclick="showCuidado('limpieza')">LIMPIEZA</button>
            <button class="prod-cuidado-tab" onclick="showCuidado('energia')">ENERGIA</button>
            <button class="prod-cuidado-tab" onclick="showCuidado('fechas')">FECHAS ESPECIALES</button>
        </div>

        <div id="cuidado-ubicacion" class="prod-cuidado-content active">
            <div class="prod-cuidado-card">
                <h4>Donde Ubicar<?php echo $lo_la; ?></h4>
                <p>Los guardianes prefieren lugares donde puedan observar. Un estante alto, una repisa cerca de la entrada, o junto a una ventana son ideales. Evita lugares muy transitados o cerca de aparatos electronicos que emiten mucha radiacion.</p>
                <div class="prod-cuidado-tips">
                    <div class="prod-cuidado-tip"><div class="prod-cuidado-tip-icon">🪟</div><div class="prod-cuidado-tip-text">Cerca de luz natural</div></div>
                    <div class="prod-cuidado-tip"><div class="prod-cuidado-tip-icon">🌿</div><div class="prod-cuidado-tip-text">Junto a plantas</div></div>
                    <div class="prod-cuidado-tip"><div class="prod-cuidado-tip-icon">🚫</div><div class="prod-cuidado-tip-text">Lejos de TV/WiFi</div></div>
                </div>
            </div>
        </div>

        <div id="cuidado-limpieza" class="prod-cuidado-content">
            <div class="prod-cuidado-card">
                <h4>Limpieza Fisica</h4>
                <p>Una vez al mes, pasa un paño suave y seco. Si hay polvo acumulado, usa un pincel de cerdas suaves. Nunca uses agua ni productos quimicos. Los guardianes son delicados y su material absorbe las energias.</p>
                <div class="prod-cuidado-tips">
                    <div class="prod-cuidado-tip"><div class="prod-cuidado-tip-icon">🪶</div><div class="prod-cuidado-tip-text">Pincel suave</div></div>
                    <div class="prod-cuidado-tip"><div class="prod-cuidado-tip-icon">💨</div><div class="prod-cuidado-tip-text">Aire comprimido</div></div>
                    <div class="prod-cuidado-tip"><div class="prod-cuidado-tip-icon">🧴</div><div class="prod-cuidado-tip-text">Sin quimicos</div></div>
                </div>
            </div>
        </div>

        <div id="cuidado-energia" class="prod-cuidado-content">
            <div class="prod-cuidado-card">
                <h4>Limpieza Energetica</h4>
                <p>Cada luna llena, pasa humo de sahumerio o palo santo alrededor de <?php echo esc_html($nombre); ?>. Tambien podes dejarlo una noche bajo la luz de la luna. Si sentis que su energia esta densa, colocale un cuarzo cristal cerca por 24 horas.</p>
                <div class="prod-cuidado-tips">
                    <div class="prod-cuidado-tip"><div class="prod-cuidado-tip-icon">🌙</div><div class="prod-cuidado-tip-text">Luz de luna</div></div>
                    <div class="prod-cuidado-tip"><div class="prod-cuidado-tip-icon">🪔</div><div class="prod-cuidado-tip-text">Sahumerio</div></div>
                    <div class="prod-cuidado-tip"><div class="prod-cuidado-tip-icon">💎</div><div class="prod-cuidado-tip-text">Cuarzo cristal</div></div>
                </div>
            </div>
        </div>

        <div id="cuidado-fechas" class="prod-cuidado-content">
            <div class="prod-cuidado-card">
                <h4>Fechas Especiales</h4>
                <p>Los guardianes se activan especialmente en los equinoccios y solsticios. En esas fechas, dedica unos minutos a conectar con <?php echo esc_html($nombre); ?>. Tambien el aniversario de su llegada a tu hogar es un momento poderoso para renovar el pacto.</p>
                <div class="prod-cuidado-tips">
                    <div class="prod-cuidado-tip"><div class="prod-cuidado-tip-icon">🌸</div><div class="prod-cuidado-tip-text">21 Mar - Equinoccio</div></div>
                    <div class="prod-cuidado-tip"><div class="prod-cuidado-tip-icon">☀️</div><div class="prod-cuidado-tip-text">21 Jun - Solsticio</div></div>
                    <div class="prod-cuidado-tip"><div class="prod-cuidado-tip-icon">🎂</div><div class="prod-cuidado-tip-text">Aniversario</div></div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- TESTIMONIOS -->
<?php
// Los 11 Minis clásicos que tienen reviews propias
$minis_clasicos = ['luke', 'dani', 'cash', 'trevor', 'trévor', 'lil', 'sanacion', 'sanación', 'yrvin', 'estelar', 'companero', 'compañero', 'matheo', 'leo'];
$nombre_lower = strtolower($nombre);
$es_mini_clasico = in_array($nombre_lower, $minis_clasicos);

// Testimonios generales de la tienda (para productos únicos)
$testimonios_tienda = [
    (object)['comment_content' => 'Desde que llegó mi guardián, la energía de mi casa cambió completamente. No es algo que pueda explicar, simplemente se siente diferente. Más calma, más armonía.', 'comment_author' => 'María Elena', 'lugar' => 'Montevideo, Uruguay'],
    (object)['comment_content' => 'Lo compré escéptica, lo admito. Pero hay algo en la forma que me mira desde su estante... suena loco, pero siento que me cuida. Ya no duermo con miedo.', 'comment_author' => 'Carolina S.', 'lugar' => 'Buenos Aires, Argentina'],
    (object)['comment_content' => 'Se lo regalé a mi mamá que estaba pasando un momento difícil. Me dijo que siente que tiene un compañero silencioso. Ya no se siente sola.', 'comment_author' => 'Lucía M.', 'lugar' => 'Maldonado, Uruguay'],
    (object)['comment_content' => 'No soy de creer en estas cosas, pero mi esposa insistió. Han pasado 8 meses y no sé cómo explicar lo que siento cuando lo miro. Es como si me conociera.', 'comment_author' => 'Diego R.', 'lugar' => 'Córdoba, Argentina'],
    (object)['comment_content' => 'Llegó justo el día de mi cumpleaños, sin que yo supiera. Coincidencia o no, lo tomé como una señal. Ahora está en mi altar junto a fotos de mis abuelos.', 'comment_author' => 'Fernanda R.', 'lugar' => 'CDMX, México'],
    (object)['comment_content' => 'Compré el primero hace dos años. Hoy tengo seis y no me arrepiento de ninguno. Cada uno llegó en un momento particular de mi vida.', 'comment_author' => 'Patricia L.', 'lugar' => 'Bogotá, Colombia'],
    (object)['comment_content' => 'La calidad es impresionante. Cada detalle está cuidado. Se nota que hay amor en cada guardián que crean.', 'comment_author' => 'Andrea V.', 'lugar' => 'Santiago, Chile'],
    (object)['comment_content' => 'Mi hija me lo regaló y al principio no entendía bien de qué se trataba. Hoy no puedo imaginar mi escritorio sin él.', 'comment_author' => 'Rosa M.', 'lugar' => 'Lima, Perú'],
    (object)['comment_content' => 'Soy enfermera y trabajo en terapia intensiva. Desde que tengo a mi guardián en el bolsillo, siento que puedo con todo.', 'comment_author' => 'Valentina P.', 'lugar' => 'Punta del Este, Uruguay'],
    (object)['comment_content' => 'Atravesé un duelo muy difícil. Una amiga me regaló un guardián diciendo que me iba a ayudar. Desde ese día está conmigo siempre.', 'comment_author' => 'Camila T.', 'lugar' => 'Rosario, Argentina'],
];

$reviews_mostrar = [];
$titulo_testimonios = '';

if ($es_mini_clasico) {
    // Para Minis clásicos: obtener sus reviews reales
    $reviews = get_comments([
        'post_id' => $product_id,
        'type' => 'review',
        'status' => 'approve',
        'number' => 0,
    ]);

    // Filtrar solo los que tienen texto Y eliminar duplicados
    $textos_vistos = [];
    foreach ($reviews as $r) {
        $texto = trim($r->comment_content);
        if (!empty($texto) && !isset($textos_vistos[$texto])) {
            $textos_vistos[$texto] = true;
            $reviews_mostrar[] = $r;
        }
    }
    shuffle($reviews_mostrar);
    $titulo_testimonios = 'Qué dicen l' . ($es_femenino ? 'a' : 'o') . 's elegid' . ($es_femenino ? 'a' : 'o') . 's de ' . $nombre;
} else {
    // Para productos únicos: usar testimonios generales de la tienda
    $reviews_mostrar = $testimonios_tienda;
    shuffle($reviews_mostrar);
    $titulo_testimonios = 'Lo que dicen los Elegidos de nuestra tienda';
}

// Si no hay reviews, usar testimonios de tienda
if (empty($reviews_mostrar)) {
    $reviews_mostrar = $testimonios_tienda;
    shuffle($reviews_mostrar);
    $titulo_testimonios = 'Lo que dicen los Elegidos de nuestra tienda';
}

$total_testimonios = count($reviews_mostrar);
?>
<section class="prod-testimonios">
    <div class="prod-testimonios-inner" style="text-align: center;">
        <p class="prod-section-label" style="color: <?php echo $color; ?>;"><?php echo duendes_ornament('star-small', $color); ?> VOCES DE ELEGID<?php echo ($es_femenino ? 'A' : 'O'); ?>S <?php echo duendes_ornament('star-small', $color); ?></p>
        <h2 class="prod-section-title" style="color: #fff; text-align: center;"><?php echo esc_html($titulo_testimonios); ?></h2>

        <div class="prod-testimonios-slider" data-total="<?php echo $total_testimonios; ?>">
            <?php foreach ($reviews_mostrar as $i => $review):
                // Para reviews de WooCommerce
                if (isset($review->comment_ID) && $review->comment_ID > 0) {
                    $ciudad = get_comment_meta($review->comment_ID, '_duendes_ciudad', true);
                    $pais = get_comment_meta($review->comment_ID, '_duendes_pais', true);
                    $lugar = ($ciudad && $pais) ? "$ciudad, $pais" : 'Uruguay';
                } else {
                    // Para testimonios de tienda predefinidos
                    $lugar = isset($review->lugar) ? $review->lugar : 'Uruguay';
                }
            ?>
            <div class="prod-testimonio <?php echo $i === 0 ? 'active' : ''; ?>">
                <p class="prod-testimonio-texto">"<?php echo esc_html($review->comment_content); ?>"</p>
                <p class="prod-testimonio-autor"><?php echo esc_html(strtoupper($review->comment_author)); ?></p>
                <p class="prod-testimonio-lugar"><?php echo esc_html($lugar); ?></p>
            </div>
            <?php endforeach; ?>
        </div>

        <!-- Sin dots, pasan automaticamente -->
    </div>
</section>

<!-- FAQ ACORDEON -->
<section class="prod-faq">
    <div class="prod-faq-inner">
        <p class="prod-section-label" style="color: <?php echo $color; ?>;"><?php echo duendes_ornament('star-small', $color); ?> PREGUNTAS FRECUENTES <?php echo duendes_ornament('star-small', $color); ?></p>
        <h2 class="prod-section-title" style="color: #1a1a1a;">Todo lo que Necesitas Saber</h2>

        <div class="prod-faq-item">
            <button class="prod-faq-pregunta" onclick="toggleFaq(this)">
                <span>¿Como se que este guardian es para mi?</span>
                <span class="prod-faq-icon">+</span>
            </button>
            <div class="prod-faq-respuesta">
                <div class="prod-faq-respuesta-inner">Si sentis un llamado, una conexion inexplicable, es porque el guardian ya te eligio. Los guardianes no llegan por casualidad a tu pantalla. Si estas aca, leyendo esto, es porque hay un mensaje para vos.</div>
            </div>
        </div>

        <div class="prod-faq-item">
            <button class="prod-faq-pregunta" onclick="toggleFaq(this)">
                <span>¿Cuanto tarda en llegar?</span>
                <span class="prod-faq-icon">+</span>
            </button>
            <div class="prod-faq-respuesta">
                <div class="prod-faq-respuesta-inner">En Montevideo y area metropolitana: 2-3 dias habiles. Interior de Uruguay: 4-5 dias. Argentina y resto del mundo: 7-15 dias dependiendo de la aduana. Cada guardian viaja protegido y con acceso digital a su certificado de autenticidad y portal Mi Magia.</div>
            </div>
        </div>

        <div class="prod-faq-item">
            <button class="prod-faq-pregunta" onclick="toggleFaq(this)">
                <span>¿Puedo regalarlo a alguien especial?</span>
                <span class="prod-faq-icon">+</span>
            </button>
            <div class="prod-faq-respuesta">
                <div class="prod-faq-respuesta-inner">Si. Los guardianes hacen regalos extraordinarios. Incluimos la canalizacion personalizada para quien lo reciba a traves del portal Mi Magia. Solo indicanos el nombre de la persona al momento de la compra y podras agregar un mensaje personal que vera cuando acceda a su portal.</div>
            </div>
        </div>

        <div class="prod-faq-item">
            <button class="prod-faq-pregunta" onclick="toggleFaq(this)">
                <span>¿Como se comunica el guardian conmigo?</span>
                <span class="prod-faq-icon">+</span>
            </button>
            <div class="prod-faq-respuesta">
                <div class="prod-faq-respuesta-inner">Los guardianes no hablan con palabras. Se comunican a traves de sensaciones, intuiciones y pequenas sincronicidades. Con el tiempo, vas a notar que "sabes" cosas sin saber como. Ese es tu guardian guiandote.</div>
            </div>
        </div>
    </div>
</section>

<section class="prod-cta">
    <div class="prod-cta-content">
        <div class="prod-cta-ornament"><?php echo duendes_ornament('flourish', $color); ?></div>
        <h2 class="prod-cta-name"><?php echo esc_html($nombre); ?> te espera</h2>
        <p class="prod-cta-price"><?php echo $precio; ?></p>
        <form method="post" action="<?php echo esc_url(wc_get_cart_url()); ?>" style="display: inline;">
            <input type="hidden" name="add-to-cart" value="<?php echo $product->get_id(); ?>">
            <button type="submit" class="prod-cta-btn">SELLAR EL PACTO</button>
        </form>
        <p class="prod-cta-note">Tiene vida. Cuando se va, desaparece para siempre.</p>
    </div>
</section>

</div><!-- .duendes-producto-page -->

<script>
function changeImg(src, thumb) {
    document.getElementById('main-img').src = src;
    document.querySelectorAll('.prod-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

// Tabs de Cuidados
function showCuidado(tabId) {
    // Ocultar todos los contenidos
    document.querySelectorAll('.prod-cuidado-content').forEach(c => {
        c.classList.remove('active');
    });
    // Desactivar todos los tabs
    document.querySelectorAll('.prod-cuidado-tab').forEach(t => {
        t.classList.remove('active');
    });
    // Mostrar contenido seleccionado
    document.getElementById('cuidado-' + tabId).classList.add('active');
    // Activar tab seleccionado
    event.target.classList.add('active');
}

// Carousel de Testimonios
let currentTestimonio = 1;
function showTestimonio(num) {
    const total = document.querySelectorAll('.prod-testimonio').length;
    currentTestimonio = num;
    if (currentTestimonio > total) currentTestimonio = 1;
    if (currentTestimonio < 1) currentTestimonio = total;

    document.querySelectorAll('.prod-testimonio').forEach((t, i) => {
        t.classList.remove('active');
        if (i + 1 === currentTestimonio) t.classList.add('active');
    });

    document.querySelectorAll('.prod-testimonios-dot').forEach((d, i) => {
        d.classList.remove('active');
        if (i + 1 === currentTestimonio) d.classList.add('active');
    });
}

// Auto-rotate testimonios cada 5 segundos
setInterval(() => {
    showTestimonio(currentTestimonio + 1);
}, 5000);

// FAQ Acordeon
function toggleFaq(btn) {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    // Cerrar todos los demas
    document.querySelectorAll('.prod-faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.prod-faq-icon').textContent = '+';
    });

    // Toggle el seleccionado
    if (!isOpen) {
        item.classList.add('open');
        btn.querySelector('.prod-faq-icon').textContent = '−';
    }
}

// Animacion de entrada para secciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.prod-mensaje, .prod-cuidados, .prod-testimonios, .prod-faq').forEach(section => {
    sectionObserver.observe(section);
});
</script>
<?php
    get_footer();
}
