<?php
/**
 * Plugin Name: Duendes Shop Buscador
 * Description: Buscador de guardianes para la tienda
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

add_action('wp_footer', function() {
    if (!is_shop() && !is_product_category()) return;
    ?>
    <style>
    .dsb-buscador-container {
        max-width: 400px;
        margin: 20px auto 30px;
        padding: 0 20px;
    }

    .dsb-buscador {
        position: relative;
    }

    .dsb-buscador input {
        width: 100%;
        padding: 14px 45px 14px 18px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(201,162,39,0.3);
        color: #fff;
        font-family: "Cormorant Garamond", serif;
        font-size: 16px;
        outline: none;
        transition: all 0.3s;
    }

    .dsb-buscador input::placeholder {
        color: rgba(255,255,255,0.4);
    }

    .dsb-buscador input:focus {
        border-color: rgba(201,162,39,0.6);
        background: rgba(255,255,255,0.05);
    }

    .dsb-search-icon {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        color: rgba(201,162,39,0.5);
        pointer-events: none;
    }

    .dsb-no-results {
        text-align: center;
        padding: 40px 20px;
        font-family: "Cormorant Garamond", serif;
        font-size: 18px;
        color: rgba(255,255,255,0.5);
        display: none;
    }
    </style>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Buscar donde insertar el buscador
        var catPills = document.querySelector('.cat-pill');
        var productosSection = document.querySelector('.productos-section');
        var insertPoint = catPills ? catPills.parentElement : productosSection;

        if (!insertPoint) {
            console.log('DSB: No se encontro punto de insercion');
            return;
        }

        // Crear buscador
        var buscadorHTML = '<div class="dsb-buscador-container">' +
            '<div class="dsb-buscador">' +
            '<input type="text" id="dsb-search" placeholder="Buscar guardian por nombre..." autocomplete="off">' +
            '<svg class="dsb-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<circle cx="11" cy="11" r="8"></circle>' +
            '<path d="m21 21-4.35-4.35"></path>' +
            '</svg>' +
            '</div>' +
            '</div>' +
            '<div class="dsb-no-results">No se encontraron guardianes con ese nombre</div>';

        // Insertar despues de las categorias
        insertPoint.insertAdjacentHTML('afterend', buscadorHTML);

        // Funcionalidad de busqueda
        var searchInput = document.getElementById('dsb-search');
        var noResults = document.querySelector('.dsb-no-results');

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                var query = this.value.toLowerCase().trim();
                var cards = document.querySelectorAll('.guardian-card, .producto-card, li.product');
                var visibleCount = 0;

                cards.forEach(function(card) {
                    var nombre = card.querySelector('.guardian-nombre, .producto-nombre, h2, h3, .woocommerce-loop-product__title');
                    var nombreText = nombre ? nombre.textContent.toLowerCase() : '';

                    if (query === '' || nombreText.includes(query)) {
                        card.style.display = '';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Mostrar mensaje si no hay resultados
                if (noResults) {
                    noResults.style.display = (query !== '' && visibleCount === 0) ? 'block' : 'none';
                }
            });
        }

        console.log('DSB: Buscador inicializado');
    });
    </script>
    <?php
}, 99);
