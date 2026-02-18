<?php
/**
 * Plugin Name: Duendes - Experiencia Ajustes
 * Description: Ajustes de estilo y sonido para la experiencia magica
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Agregar estilos y scripts de ajuste
add_action('wp_head', function() {
    if (!is_product()) return;
    ?>
    <style>
    /* Ocultar animaciones SVG del banner - son confusas */
    .prod-hero .anim-monedas,
    .prod-hero .anim-corazones,
    .prod-hero .anim-hojas,
    .prod-hero .anim-escudo,
    .prod-hero .anim-constelaciones,
    .prod-hero .anim-escoba,
    .prod-hero .anim-caldero,
    .prod-hero .anim-polvo,
    .prod-hero .anim-varita,
    .prod-hero .anim-runas,
    .prod-hero .anim-hongos,
    .prod-hero .anim-estrellas,
    .prod-hero .anim-orbes-default {
        display: none !important;
    }

    /* Tipografia mas elegante - Cormorant en vez de Cinzel para textos largos */
    .prod-hero-name {
        font-family: 'Cinzel', serif !important;
        letter-spacing: 6px !important;
    }

    /* Colores dorados elegantes en vez de neon chillon */
    :root {
        --duendes-dorado: #c9a227;
        --duendes-dorado-claro: #e8d48b;
        --duendes-dorado-oscuro: #8b6914;
    }

    /* Sobrescribir colores chillones */
    .prod-hero-label,
    .prod-hero-name,
    .prod-hero-subtitle,
    .ficha-valor,
    .historia-text,
    .prod-cta-btn {
        color: var(--duendes-dorado) !important;
    }

    /* Boton sellar pacto - dorado elegante */
    .prod-cta-btn {
        background: linear-gradient(135deg, var(--duendes-dorado) 0%, var(--duendes-dorado-oscuro) 100%) !important;
        border-color: var(--duendes-dorado) !important;
        color: #0a0a0a !important;
    }

    .prod-cta-btn:hover {
        background: linear-gradient(135deg, var(--duendes-dorado-claro) 0%, var(--duendes-dorado) 100%) !important;
        box-shadow: 0 0 30px rgba(201, 162, 39, 0.4) !important;
    }

    /* Ornamentos dorados */
    .dm-ornament path,
    .dm-ornament circle,
    .dm-ornament line {
        stroke: var(--duendes-dorado) !important;
        fill: var(--duendes-dorado) !important;
    }

    /* Fondo del hero mas sutil */
    .prod-hero::before,
    .prod-hero::after {
        opacity: 0.3 !important;
    }
    </style>
    <?php
}, 9999);

// Sonido etereo al sellar el pacto (agregar al carrito)
add_action('wp_footer', function() {
    if (!is_product()) return;
    ?>
    <script>
    (function() {
        console.log('Duendes: Sonido inicializado');

        // Sonido etereo magico - suave, con fade in/out largo
        function playEtherealSound() {
            try {
                var ctx = new (window.AudioContext || window.webkitAudioContext)();
                var now = ctx.currentTime;

                // Master gain para controlar volumen general (muy suave)
                var master = ctx.createGain();
                master.gain.setValueAtTime(0, now);
                master.gain.linearRampToValueAtTime(0.06, now + 0.8);  // Fade in lento
                master.gain.linearRampToValueAtTime(0.06, now + 2);
                master.gain.exponentialRampToValueAtTime(0.001, now + 5); // Fade out muy largo
                master.connect(ctx.destination);

                // Reverb simulado con convolver
                var convolver = ctx.createConvolver();
                var reverbTime = 3;
                var sampleRate = ctx.sampleRate;
                var length = sampleRate * reverbTime;
                var impulse = ctx.createBuffer(2, length, sampleRate);
                for (var channel = 0; channel < 2; channel++) {
                    var impulseData = impulse.getChannelData(channel);
                    for (var i = 0; i < length; i++) {
                        impulseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
                    }
                }
                convolver.buffer = impulse;
                convolver.connect(master);

                // Dry/wet mix
                var dryGain = ctx.createGain();
                var wetGain = ctx.createGain();
                dryGain.gain.value = 0.4;
                wetGain.gain.value = 0.6;
                dryGain.connect(master);
                wetGain.connect(convolver);

                // Notas etereasen escala pentatonica (mas armonioso)
                var notes = [
                    { freq: 392.00, delay: 0, dur: 4 },      // G4
                    { freq: 523.25, delay: 0.15, dur: 3.8 }, // C5
                    { freq: 659.25, delay: 0.3, dur: 3.5 },  // E5
                    { freq: 783.99, delay: 0.5, dur: 3.2 },  // G5
                    { freq: 1046.50, delay: 0.8, dur: 2.8 }, // C6 (campanita alta)
                ];

                notes.forEach(function(note) {
                    // Oscilador principal (sine puro = suave)
                    var osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.value = note.freq;

                    // Segundo oscilador levemente detuned (brillo etereo)
                    var osc2 = ctx.createOscillator();
                    osc2.type = 'sine';
                    osc2.frequency.value = note.freq * 1.002; // Muy leve detune

                    // Gain individual con envelope suave
                    var gain = ctx.createGain();
                    var startTime = now + note.delay;
                    gain.gain.setValueAtTime(0, startTime);
                    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.4); // Fade in suave
                    gain.gain.linearRampToValueAtTime(0.1, startTime + note.dur * 0.6);
                    gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);

                    osc.connect(gain);
                    osc2.connect(gain);
                    gain.connect(dryGain);
                    gain.connect(wetGain);

                    osc.start(startTime);
                    osc2.start(startTime);
                    osc.stop(startTime + note.dur + 0.5);
                    osc2.stop(startTime + note.dur + 0.5);
                });

            } catch (e) {
                console.log('Audio error:', e);
            }
        }

        // Escuchar clicks en toda la pagina
        document.addEventListener('click', function(e) {
            // Buscar si clickearon un boton de compra
            var target = e.target;
            var isButton = target.classList.contains('prod-btn') ||
                           target.classList.contains('prod-cta-btn') ||
                           target.classList.contains('single_add_to_cart_button') ||
                           target.type === 'submit' ||
                           (target.closest && target.closest('.prod-btn, .prod-cta-btn, button[type="submit"]'));

            if (isButton) {
                console.log('Duendes: Click en boton detectado');
                playEtherealSound();
            }
        }, true);

        // Escuchar submit de formularios
        document.addEventListener('submit', function(e) {
            if (e.target.classList.contains('cart') || e.target.querySelector('[name="add-to-cart"]')) {
                console.log('Duendes: Submit de carrito detectado');
                playEtherealSound();
            }
        }, true);
    })();
    </script>
    <?php
});
