<?php
/**
 * Plugin Name: Duendes - Fix páginas legales
 * Description: Arregla colores de Política de Privacidad y Términos
 */

if (!defined('ABSPATH')) exit;

add_action('wp_head', function() {
    // Solo en páginas legales
    if (!is_page(['politica-de-privacidad', 'terminos-y-condiciones', 'terminos-condiciones', 'terminos'])) {
        return;
    }
    ?>
    <style id="duendes-legal-fix">
        /* Forzar fondo oscuro y texto claro en páginas legales */
        body.page,
        .elementor-section,
        .elementor-container,
        .elementor-column,
        .elementor-widget-container,
        .elementor-text-editor,
        .e-con,
        .e-con-inner {
            background-color: #0a0a0a !important;
        }

        /* Texto principal en blanco/crema */
        .elementor-widget-text-editor,
        .elementor-widget-text-editor p,
        .elementor-widget-text-editor li,
        .elementor-widget-text-editor span,
        .elementor-text-editor,
        .elementor-text-editor p,
        .elementor-text-editor li,
        .elementor-text-editor span,
        .entry-content,
        .entry-content p,
        .entry-content li,
        .page-content,
        .page-content p,
        article p,
        article li,
        article span,
        .e-con p,
        .e-con li,
        .e-con span {
            color: rgba(255,255,255,0.85) !important;
            font-family: 'Cormorant Garamond', Georgia, serif !important;
            font-size: 1.1rem !important;
            line-height: 1.8 !important;
        }

        /* Títulos en dorado */
        .elementor-widget-text-editor h1,
        .elementor-widget-text-editor h2,
        .elementor-widget-text-editor h3,
        .elementor-widget-text-editor h4,
        .elementor-text-editor h1,
        .elementor-text-editor h2,
        .elementor-text-editor h3,
        .elementor-text-editor h4,
        .entry-content h1,
        .entry-content h2,
        .entry-content h3,
        .entry-content h4,
        .e-con h1,
        .e-con h2,
        .e-con h3,
        .e-con h4,
        article h1,
        article h2,
        article h3,
        article h4 {
            color: #c9a227 !important;
            font-family: 'Cinzel', serif !important;
        }

        /* Links en dorado */
        .elementor-widget-text-editor a,
        .elementor-text-editor a,
        .entry-content a,
        .e-con a,
        article a {
            color: #e8d48b !important;
            text-decoration: underline !important;
        }

        .elementor-widget-text-editor a:hover,
        .elementor-text-editor a:hover,
        .entry-content a:hover,
        .e-con a:hover,
        article a:hover {
            color: #c9a227 !important;
        }

        /* Listas */
        .elementor-widget-text-editor ul,
        .elementor-widget-text-editor ol,
        .elementor-text-editor ul,
        .elementor-text-editor ol,
        .entry-content ul,
        .entry-content ol,
        .e-con ul,
        .e-con ol {
            color: rgba(255,255,255,0.85) !important;
            padding-left: 2rem !important;
        }

        /* Tablas si las hay */
        table, th, td {
            border-color: rgba(201,162,39,0.3) !important;
            color: rgba(255,255,255,0.85) !important;
        }

        th {
            background: rgba(201,162,39,0.1) !important;
            color: #c9a227 !important;
        }

        /* Contenedor principal con padding */
        .elementor-section-wrap > .elementor-section,
        .e-con.e-parent {
            padding: 40px 20px !important;
            max-width: 900px !important;
            margin: 0 auto !important;
        }

        /* Fondo del body */
        body {
            background-color: #0a0a0a !important;
        }

        /* Strong/bold en dorado claro */
        strong, b {
            color: #e8d48b !important;
        }
    </style>
    <?php
});
