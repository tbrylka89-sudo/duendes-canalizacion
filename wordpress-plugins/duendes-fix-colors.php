<?php
/**
 * Plugin Name: Duendes Fix Colors v3
 * Description: Arregla colores de botones
 */
if (!defined('ABSPATH')) exit;

add_action('wp_footer', function() {
    ?>
    <script>
    console.log('=== DUENDES FIX COLORS V3 ===');

    function arreglarTodo() {
        var encontrados = 0;

        // Buscar TODOS los elementos
        document.querySelectorAll('*').forEach(function(el) {
            var text = (el.textContent || '').toLowerCase().trim();
            var tag = el.tagName.toLowerCase();

            // Si es un link o botón con texto de CTA
            if ((tag === 'a' || tag === 'button') &&
                (text.includes('guardian') || text.includes('descubr') || text.includes('ver ') || text.includes('explorar'))) {

                encontrados++;
                console.log('>>> Encontrado:', tag, text.substring(0,25));

                el.style.setProperty('background', '#B8973A', 'important');
                el.style.setProperty('background-color', '#B8973A', 'important');
                el.style.setProperty('color', '#070906', 'important');
                el.style.setProperty('border', 'none', 'important');

                // Hijos
                var hijos = el.getElementsByTagName('*');
                for (var i = 0; i < hijos.length; i++) {
                    hijos[i].style.setProperty('color', '#070906', 'important');
                    hijos[i].style.setProperty('background', 'transparent', 'important');
                }
            }
        });

        console.log('Total botones arreglados:', encontrados);

        // Overlay del hero
        document.querySelectorAll('[class*="overlay"]').forEach(function(o) {
            o.style.setProperty('opacity', '0.2', 'important');
        });
    }

    arreglarTodo();
    setTimeout(arreglarTodo, 300);
    setTimeout(arreglarTodo, 1000);
    setTimeout(arreglarTodo, 2500);
    </script>
    <?php
}, 999999);
