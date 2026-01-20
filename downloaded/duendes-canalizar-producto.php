<?php
/**
 * Plugin Name: Duendes - Canalizar Producto
 * Description: Sistema de generación de historias con IA para productos místicos
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════
// CONFIGURAR RANKMATH PARA PRODUCTOS
// ═══════════════════════════════════════════════════════════════

// Habilitar RankMath en productos de WooCommerce
add_filter('rank_math/sitemap/post_types', function($post_types) {
    $post_types[] = 'product';
    return array_unique($post_types);
});

// Forzar que RankMath muestre su metabox en productos
add_filter('rank_math/metabox/priority', function($priority) {
    return 'high';
});

// Habilitar SEO para productos si RankMath está activo
add_action('init', function() {
    // Verificar si RankMath está activo
    if (!class_exists('RankMath')) return;

    // Obtener opciones actuales de RankMath
    $titles = get_option('rank-math-options-titles', []);

    // Habilitar para productos si no está configurado
    if (!isset($titles['pt_product_add_meta_box']) || $titles['pt_product_add_meta_box'] !== 'on') {
        $titles['pt_product_add_meta_box'] = 'on';
        $titles['pt_product_bulk_editing'] = 'on';
        $titles['pt_product_link_suggestions'] = 'on';
        update_option('rank-math-options-titles', $titles);
    }
}, 5);

// Asegurar que el metabox de RankMath aparezca en productos
add_filter('rank_math/metabox/post_types', function($post_types) {
    if (!in_array('product', $post_types)) {
        $post_types[] = 'product';
    }
    return $post_types;
});

// ═══════════════════════════════════════════════════════════════
// ESTILOS Y SCRIPTS ADMIN
// ═══════════════════════════════════════════════════════════════

// Cargar estilos
add_action('admin_head', function() {
    global $post;
    if (!$post || get_post_type($post) !== 'product') return;

    echo '<style>' . duendes_canalizar_get_styles() . '</style>';
});

// Cargar scripts en el footer para asegurar que jQuery y TinyMCE estén listos
add_action('admin_footer', function() {
    global $post;
    if (!$post || get_post_type($post) !== 'product') return;

    echo '<script>' . duendes_canalizar_get_scripts() . '</script>';
});

function duendes_canalizar_get_styles() {
    return '
    /* ═══════════════════════════════════════════════════════════════
       ESTILOS METABOX CANALIZAR - FONDO CLARO
       ═══════════════════════════════════════════════════════════════ */

    .duendes-metabox {
        background: #fafbfc !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 12px !important;
        padding: 0 !important;
        margin-top: 20px !important;
    }

    .duendes-metabox .postbox-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border-radius: 12px 12px 0 0 !important;
    }

    .duendes-metabox .postbox-header h2 {
        color: #fff !important;
        font-size: 15px !important;
        padding: 12px 16px !important;
    }

    .duendes-metabox .inside {
        padding: 20px !important;
        margin: 0 !important;
    }

    /* Secciones */
    .dc-section {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
    }

    .dc-section:last-child {
        margin-bottom: 0;
    }

    .dc-section-title {
        font-size: 14px;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 15px 0;
        padding-bottom: 10px;
        border-bottom: 2px solid #e2e8f0;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .dc-section-title span {
        font-size: 18px;
    }

    /* Grid de campos */
    .dc-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }

    .dc-grid-3 {
        grid-template-columns: repeat(3, 1fr);
    }

    .dc-grid-4 {
        grid-template-columns: repeat(4, 1fr);
    }

    .dc-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .dc-field.full-width {
        grid-column: 1 / -1;
    }

    .dc-label {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .dc-input,
    .dc-select,
    .dc-textarea {
        padding: 10px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        font-size: 14px;
        transition: all 0.2s;
        background: #fff;
    }

    .dc-input:focus,
    .dc-select:focus,
    .dc-textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .dc-textarea {
        min-height: 80px;
        resize: vertical;
    }

    /* Radio buttons estilizados */
    .dc-radio-group {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .dc-radio-item {
        position: relative;
    }

    .dc-radio-item input {
        position: absolute;
        opacity: 0;
    }

    .dc-radio-item label {
        display: block;
        padding: 10px 16px;
        background: #f1f5f9;
        border: 2px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
    }

    .dc-radio-item input:checked + label {
        background: #eef2ff;
        border-color: #667eea;
        color: #4338ca;
        font-weight: 600;
    }

    .dc-radio-item label:hover {
        background: #e2e8f0;
    }

    /* Sub-opciones */
    .dc-sub-options {
        margin-left: 20px;
        margin-top: 10px;
        padding: 15px;
        background: #f8fafc;
        border-radius: 8px;
        display: none;
    }

    .dc-sub-options.visible {
        display: block;
    }

    /* Checkbox estilizado */
    .dc-checkbox-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 15px;
        background: #fff7ed;
        border: 1px solid #fed7aa;
        border-radius: 8px;
        margin-top: 15px;
    }

    .dc-checkbox-item input {
        width: 18px;
        height: 18px;
        accent-color: #ea580c;
    }

    .dc-checkbox-item label {
        font-size: 13px;
        color: #9a3412;
    }

    /* Botones de acción */
    .dc-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 2px solid #e2e8f0;
    }

    .dc-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .dc-btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
    }

    .dc-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .dc-btn-secondary {
        background: #f1f5f9;
        color: #475569;
        border: 1px solid #e2e8f0;
    }

    .dc-btn-secondary:hover {
        background: #e2e8f0;
    }

    .dc-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }

    /* Campo de modificación */
    .dc-modify-field {
        flex: 1;
        min-width: 250px;
    }

    .dc-modify-input {
        width: 100%;
        padding: 12px 15px;
        border: 2px dashed #cbd5e1;
        border-radius: 8px;
        font-size: 14px;
        background: #fff;
    }

    .dc-modify-input:focus {
        border-style: solid;
        border-color: #667eea;
        outline: none;
    }

    /* Estilos de regeneración */
    .dc-regen-styles {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;
    }

    .dc-regen-style {
        padding: 8px 14px;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .dc-regen-style:hover {
        border-color: #667eea;
        color: #667eea;
    }

    .dc-regen-style.selected {
        background: #667eea;
        color: #fff;
        border-color: #667eea;
    }

    /* Recordatorio */
    .dc-reminder {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border: 1px solid #f59e0b;
        border-radius: 8px;
        padding: 15px;
        margin-top: 20px;
    }

    .dc-reminder-title {
        font-size: 13px;
        font-weight: 600;
        color: #92400e;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .dc-reminder-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
    }

    .dc-reminder-item {
        font-size: 12px;
        color: #78350f;
        display: flex;
        align-items: flex-start;
        gap: 6px;
    }

    .dc-reminder-item.bad::before {
        content: "✗";
        color: #dc2626;
        font-weight: bold;
    }

    .dc-reminder-item.good::before {
        content: "✓";
        color: #16a34a;
        font-weight: bold;
    }

    /* Loading */
    .dc-loading {
        display: none;
        align-items: center;
        gap: 10px;
        padding: 20px;
        background: #f0fdf4;
        border: 1px solid #86efac;
        border-radius: 8px;
        margin-top: 15px;
    }

    .dc-loading.visible {
        display: flex;
    }

    .dc-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #dcfce7;
        border-top-color: #22c55e;
        border-radius: 50%;
        animation: dc-spin 1s linear infinite;
    }

    @keyframes dc-spin {
        to { transform: rotate(360deg); }
    }

    /* Resultado preview */
    .dc-preview {
        display: none;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 20px;
        margin-top: 15px;
    }

    .dc-preview.visible {
        display: block;
    }

    .dc-preview-title {
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
        margin-bottom: 10px;
    }

    .dc-preview-content {
        font-size: 14px;
        line-height: 1.6;
        color: #334155;
        max-height: 200px;
        overflow-y: auto;
    }

    /* Feedback */
    .dc-feedback {
        display: none;
        margin-top: 15px;
        padding: 15px;
        background: #f8fafc;
        border-radius: 8px;
    }

    .dc-feedback.visible {
        display: block;
    }

    .dc-feedback-title {
        font-size: 13px;
        font-weight: 600;
        color: #475569;
        margin-bottom: 10px;
    }

    .dc-feedback-btns {
        display: flex;
        gap: 10px;
    }

    .dc-feedback-btn {
        padding: 8px 16px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        background: #fff;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
    }

    .dc-feedback-btn:hover {
        border-color: #667eea;
    }

    .dc-feedback-btn.positive:hover {
        background: #dcfce7;
        border-color: #22c55e;
    }

    .dc-feedback-btn.negative:hover {
        background: #fee2e2;
        border-color: #ef4444;
    }

    /* Responsive */
    @media (max-width: 782px) {
        .dc-grid,
        .dc-grid-3,
        .dc-grid-4 {
            grid-template-columns: 1fr;
        }

        .dc-reminder-list {
            grid-template-columns: 1fr;
        }
    }
    ';
}

function duendes_canalizar_get_scripts() {
    $api_url = 'https://duendes-vercel.vercel.app/api';
    $nonce = wp_create_nonce('duendes_canalizar');

    return "
    (function() {
        'use strict';

        console.log('Duendes Canalizar: Script cargado');

        var API = '{$api_url}';
        var nonce = '{$nonce}';

        window.DuendesCanalizar = {
            selectedStyle: null,

            init: function() {
                console.log('Duendes Canalizar: Inicializando...');
                this.bindEvents();
                this.updateSubOptions();
                console.log('Duendes Canalizar: Listo!');
            },

            bindEvents: function() {
                // Toggle sub-opciones según tamaño
                var tamanoRadios = document.querySelectorAll('input[name=\"dc_tamano\"]');
                console.log('Duendes Canalizar: Encontrados ' + tamanoRadios.length + ' radios de tamaño');

                tamanoRadios.forEach(function(radio) {
                    radio.addEventListener('change', function() {
                        DuendesCanalizar.updateSubOptions();
                    });
                });

                // Estilos de regeneración
                document.querySelectorAll('.dc-regen-style').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        document.querySelectorAll('.dc-regen-style').forEach(function(b) {
                            b.classList.remove('selected');
                        });
                        this.classList.add('selected');
                        DuendesCanalizar.selectedStyle = this.dataset.style;
                    });
                });

                // Detectar cambios en producto virtual de WooCommerce
                var virtualCheckbox = document.getElementById('_virtual');
                if (virtualCheckbox) {
                    virtualCheckbox.addEventListener('change', function() {
                        DuendesCanalizar.toggleVirtualSection(this.checked);
                    });
                    // Verificar estado inicial
                    DuendesCanalizar.toggleVirtualSection(virtualCheckbox.checked);
                }
            },

            toggleVirtualSection: function(isVirtual) {
                var seccionVirtual = document.getElementById('dc_seccion_virtual');
                var seccionTamano = document.querySelector('.dc-section:has(#dc_tamano_mini)');

                if (seccionVirtual) {
                    seccionVirtual.style.display = isVirtual ? '' : 'none';
                }
                // La sección de tamaño siempre visible pero con nota si es virtual
                if (seccionTamano && isVirtual) {
                    var notaVirtual = seccionTamano.querySelector('.dc-nota-virtual');
                    if (!notaVirtual) {
                        var nota = document.createElement('div');
                        nota.className = 'dc-nota-virtual';
                        nota.style.cssText = 'background: #fef3c7; border: 1px solid #f59e0b; padding: 10px; border-radius: 8px; margin-bottom: 15px; color: #92400e;';
                        nota.innerHTML = '<strong>Producto Virtual:</strong> El tamaño físico no se mostrará en la página de producto, pero podés configurarlo si el ser tiene una versión física.';
                        seccionTamano.insertBefore(nota, seccionTamano.firstChild.nextSibling);
                    }
                } else if (seccionTamano) {
                    var notaVirtual = seccionTamano.querySelector('.dc-nota-virtual');
                    if (notaVirtual) notaVirtual.remove();
                }
            },

            updateSubOptions: function() {
                var selected = document.querySelector('input[name=\"dc_tamano\"]:checked');
                document.querySelectorAll('.dc-sub-options').forEach(function(el) {
                    el.classList.remove('visible');
                });
                if (selected) {
                    var subEl = document.getElementById('dc-sub-' + selected.value);
                    if (subEl) subEl.classList.add('visible');
                }
            },

            getFormData: function() {
                var esVirtual = document.getElementById('_virtual')?.checked || false;
                return {
                    // Clasificación
                    categoria: document.getElementById('dc_categoria')?.value || '',
                    tipo_ser: document.getElementById('dc_tipo_ser')?.value || '',
                    genero: document.querySelector('input[name=\"dc_genero\"]:checked')?.value || '',
                    especie_nueva: document.getElementById('dc_especie_nueva')?.checked || false,

                    // Tamaño y edición
                    tamano: document.querySelector('input[name=\"dc_tamano\"]:checked')?.value || '',
                    tamano_exacto: document.getElementById('dc_tamano_exacto')?.value || '',
                    edicion: document.querySelector('input[name=\"dc_edicion\"]:checked')?.value || '',
                    es_literatura: document.getElementById('dc_es_literatura')?.checked || false,

                    // Producto Virtual
                    es_virtual: esVirtual,
                    tipo_virtual: esVirtual ? (document.getElementById('dc_tipo_virtual')?.value || '') : '',
                    formato_virtual: esVirtual ? (document.getElementById('dc_formato_virtual')?.value || '') : '',
                    caracteristicas_virtual: esVirtual ? (document.getElementById('dc_caracteristicas_virtual')?.value || '') : '',

                    // Nacimiento
                    fecha_nacimiento: document.getElementById('dc_fecha_nacimiento')?.value || '',
                    hora_nacimiento: document.getElementById('dc_hora_nacimiento')?.value || '',
                    lugar_nacimiento: document.getElementById('dc_lugar_nacimiento')?.value || '',

                    // Info del ser
                    nombre: document.getElementById('dc_nombre')?.value || '',
                    proposito: document.getElementById('dc_proposito')?.value || '',
                    elemento: document.getElementById('dc_elemento')?.value || '',
                    cristales: document.getElementById('dc_cristales')?.value || '',
                    edad_aparente: document.getElementById('dc_edad_aparente')?.value || '',
                    notas: document.getElementById('dc_notas')?.value || '',

                    // NUEVOS CAMPOS - Categoría, personalidad e instrucciones
                    categoriaTamano: document.getElementById('dc_categoria_tamano')?.value || 'clasico',
                    tamanoExacto: document.getElementById('dc_tamano_exacto')?.value || '',
                    personalidad: document.getElementById('dc_personalidad')?.value || '',
                    instruccionesPersonalizadas: document.getElementById('dc_instrucciones_claude')?.value || '',

                    // Producto ID para obtener imágenes
                    product_id: document.getElementById('post_ID')?.value || ''
                };
            },

            generar: function() {
                console.log('Duendes Canalizar: Iniciando generación...');

                var btn = document.getElementById('dc-btn-generar');
                var loading = document.getElementById('dc-loading');
                var loadingText = loading ? loading.querySelector('span') : null;
                var preview = document.getElementById('dc-preview');
                var feedback = document.getElementById('dc-feedback');

                if (!btn) {
                    console.error('Duendes Canalizar: No se encontró el botón');
                    return;
                }

                btn.disabled = true;
                btn.textContent = 'Generando...';

                if (loading) loading.classList.add('visible');
                if (preview) preview.classList.remove('visible');
                if (feedback) feedback.classList.remove('visible');

                var data = this.getFormData();
                data.action = 'generate';

                console.log('Duendes Canalizar: Enviando datos:', data);
                console.log('Duendes Canalizar: URL:', API + '/admin/canalizar-producto');

                // Mensaje de progreso que va cambiando
                var mensajes = [
                    'Claude está canalizando la historia...',
                    'Analizando imágenes del producto...',
                    'Conectando con la esencia del ser...',
                    'Tejiendo la narrativa...',
                    'Casi listo, puliendo detalles...'
                ];
                var msgIndex = 0;
                var msgInterval = setInterval(function() {
                    msgIndex = (msgIndex + 1) % mensajes.length;
                    if (loadingText) loadingText.textContent = mensajes[msgIndex];
                }, 8000);

                // AbortController con timeout de 90 segundos
                var controller = new AbortController();
                var timeoutId = setTimeout(function() {
                    controller.abort();
                }, 90000);

                fetch(API + '/admin/canalizar-producto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    signal: controller.signal
                })
                .then(function(r) {
                    clearTimeout(timeoutId);
                    clearInterval(msgInterval);
                    console.log('Duendes Canalizar: Respuesta recibida, status:', r.status);
                    return r.json();
                })
                .then(function(result) {
                    console.log('Duendes Canalizar: Resultado:', result);

                    btn.disabled = false;
                    btn.innerHTML = '<span>🔮</span> Generar Historia';
                    if (loading) loading.classList.remove('visible');

                    if (result.success) {
                        DuendesCanalizar.applyResult(result);
                        if (preview) preview.classList.add('visible');
                        if (feedback) feedback.classList.add('visible');
                        var previewContent = document.getElementById('dc-preview-content');
                        if (previewContent) previewContent.innerHTML = result.descripcion_corta || 'Historia generada correctamente';
                        alert('Historia generada! Revisá los campos del producto.');
                    } else {
                        alert('Error: ' + (result.error || 'Error desconocido'));
                    }
                })
                .catch(function(err) {
                    clearTimeout(timeoutId);
                    clearInterval(msgInterval);
                    console.error('Duendes Canalizar: Error:', err);
                    btn.disabled = false;
                    btn.innerHTML = '<span>🔮</span> Generar Historia';
                    if (loading) loading.classList.remove('visible');

                    if (err.name === 'AbortError') {
                        alert('La generación tardó demasiado. Intentá de nuevo o usá menos opciones.');
                    } else {
                        alert('Error de conexión: ' + err.message);
                    }
                });
            },

            mejorar: function() {
                var btn = document.getElementById('dc-btn-mejorar');
                var loading = document.getElementById('dc-loading');
                var loadingText = loading ? loading.querySelector('span') : null;
                var modificacion = document.getElementById('dc_modificacion')?.value || '';

                if (!modificacion.trim()) {
                    alert('Escribí qué cambio querés hacer');
                    return;
                }

                btn.disabled = true;
                if (loading) loading.classList.add('visible');
                if (loadingText) loadingText.textContent = 'Aplicando mejoras...';

                var data = this.getFormData();
                data.action = 'improve';
                data.modificacion = modificacion;
                data.descripcion_actual = this.getDescripcionActual();

                var controller = new AbortController();
                var timeoutId = setTimeout(function() { controller.abort(); }, 90000);

                fetch(API + '/admin/canalizar-producto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    signal: controller.signal
                })
                .then(function(r) { clearTimeout(timeoutId); return r.json(); })
                .then(function(result) {
                    btn.disabled = false;
                    if (loading) loading.classList.remove('visible');

                    if (result.success) {
                        DuendesCanalizar.applyResult(result);
                        var previewContent = document.getElementById('dc-preview-content');
                        if (previewContent) previewContent.innerHTML = result.descripcion_corta || '';
                        alert('Historia mejorada!');
                    } else {
                        alert('Error: ' + (result.error || 'Error desconocido'));
                    }
                })
                .catch(function(err) {
                    clearTimeout(timeoutId);
                    btn.disabled = false;
                    if (loading) loading.classList.remove('visible');
                    if (err.name === 'AbortError') {
                        alert('La mejora tardó demasiado. Intentá de nuevo.');
                    } else {
                        alert('Error de conexión: ' + err.message);
                    }
                });
            },

            regenerar: function() {
                var btn = document.getElementById('dc-btn-regenerar');
                var loading = document.getElementById('dc-loading');
                var loadingText = loading ? loading.querySelector('span') : null;

                if (!this.selectedStyle) {
                    alert('Seleccioná un estilo de regeneración');
                    return;
                }

                btn.disabled = true;
                if (loading) loading.classList.add('visible');
                if (loadingText) loadingText.textContent = 'Regenerando con estilo ' + this.selectedStyle + '...';

                var data = this.getFormData();
                data.action = 'regenerate';
                data.estilo = this.selectedStyle;
                data.descripcion_actual = this.getDescripcionActual();

                var controller = new AbortController();
                var timeoutId = setTimeout(function() { controller.abort(); }, 90000);

                fetch(API + '/admin/canalizar-producto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    signal: controller.signal
                })
                .then(function(r) { clearTimeout(timeoutId); return r.json(); })
                .then(function(result) {
                    btn.disabled = false;
                    if (loading) loading.classList.remove('visible');

                    if (result.success) {
                        DuendesCanalizar.applyResult(result);
                        var previewContent = document.getElementById('dc-preview-content');
                        if (previewContent) previewContent.innerHTML = result.descripcion_corta || '';
                        alert('Historia regenerada!');
                    } else {
                        alert('Error: ' + (result.error || 'Error desconocido'));
                    }
                })
                .catch(function(err) {
                    clearTimeout(timeoutId);
                    btn.disabled = false;
                    if (loading) loading.classList.remove('visible');
                    if (err.name === 'AbortError') {
                        alert('La regeneración tardó demasiado. Intentá de nuevo.');
                    } else {
                        alert('Error de conexión: ' + err.message);
                    }
                });
            },

            applyResult: function(result) {
                console.log('Aplicando resultado:', result);

                // Función auxiliar para convertir texto a HTML con párrafos
                function textoAHtml(texto) {
                    if (!texto) return '';
                    // Dividir por doble salto de línea y envolver en <p>
                    var parrafos = texto.split(/\\n\\n+/);
                    return parrafos.map(function(p) {
                        p = p.trim();
                        if (!p) return '';
                        // Reemplazar saltos simples por <br>
                        p = p.replace(/\\n/g, '<br>');
                        return '<p>' + p + '</p>';
                    }).filter(function(p) { return p; }).join('\\n');
                }

                // Título del producto
                if (result.titulo) {
                    var titleField = document.getElementById('title');
                    if (titleField) {
                        titleField.value = result.titulo;
                        titleField.dispatchEvent(new Event('input', { bubbles: true }));
                        // También actualizar el slug si está vacío
                        var slugField = document.getElementById('editable-post-name');
                        if (slugField && !slugField.innerText) {
                            // WordPress generará el slug automáticamente
                        }
                    }
                }

                // Descripción larga CON FORMATO HTML
                if (result.descripcion) {
                    var descripcionHtml = textoAHtml(result.descripcion);
                    var editor = typeof tinyMCE !== 'undefined' ? tinyMCE.get('content') : null;
                    if (editor) {
                        editor.setContent(descripcionHtml);
                    }
                    // También actualizar el textarea por si acaso
                    var contentField = document.getElementById('content');
                    if (contentField) {
                        contentField.value = descripcionHtml;
                    }
                    console.log('Descripción aplicada con formato HTML');
                }

                // Descripción corta de WooCommerce
                if (result.descripcion_corta) {
                    var excerptHtml = '<p>' + result.descripcion_corta + '</p>';
                    var excerptEditor = typeof tinyMCE !== 'undefined' ? tinyMCE.get('excerpt') : null;
                    if (excerptEditor) {
                        excerptEditor.setContent(excerptHtml);
                    }
                    var excerptField = document.getElementById('excerpt');
                    if (excerptField) excerptField.value = excerptHtml;
                }

                // ═══════════════════════════════════════════════════════════
                // TAGS - Múltiples métodos
                // ═══════════════════════════════════════════════════════════
                if (result.tags) {
                    console.log('Intentando aplicar tags:', result.tags);

                    // Método 1: Campo de texto de tags
                    var tagsField = document.getElementById('new-tag-product_tag');
                    if (tagsField) {
                        tagsField.value = result.tags;
                        // Simular Enter o click en Add
                        var addBtn = document.querySelector('#product_tag .tagadd');
                        if (addBtn) {
                            setTimeout(function() {
                                addBtn.click();
                                console.log('Tags: Click en botón Add');
                            }, 200);
                        }
                    }

                    // Método 2: Guardar en campo oculto para procesamiento PHP
                    var hiddenTagsField = document.getElementById('dc_generated_tags');
                    if (!hiddenTagsField) {
                        hiddenTagsField = document.createElement('input');
                        hiddenTagsField.type = 'hidden';
                        hiddenTagsField.id = 'dc_generated_tags';
                        hiddenTagsField.name = 'dc_generated_tags';
                        document.querySelector('form#post').appendChild(hiddenTagsField);
                    }
                    hiddenTagsField.value = result.tags;
                    console.log('Tags guardados en campo oculto para PHP');
                }

                // ═══════════════════════════════════════════════════════════
                // CATEGORÍA - Seleccionar automáticamente
                // ═══════════════════════════════════════════════════════════
                if (result.categoria_sugerida) {
                    console.log('Categoría sugerida:', result.categoria_sugerida);

                    // Buscar checkboxes de categoría de producto
                    var catCheckboxes = document.querySelectorAll('#product_catchecklist input[type=\"checkbox\"]');
                    var categoriaLower = result.categoria_sugerida.toLowerCase();

                    catCheckboxes.forEach(function(cb) {
                        var label = cb.parentElement ? cb.parentElement.textContent.toLowerCase().trim() : '';
                        // Buscar coincidencia parcial
                        if (label.includes(categoriaLower) || categoriaLower.includes(label.split(' ')[0])) {
                            cb.checked = true;
                            cb.dispatchEvent(new Event('change', { bubbles: true }));
                            console.log('Categoría seleccionada:', label);
                        }
                    });

                    // Guardar en campo oculto para procesamiento PHP
                    var hiddenCatField = document.getElementById('dc_generated_categoria');
                    if (!hiddenCatField) {
                        hiddenCatField = document.createElement('input');
                        hiddenCatField.type = 'hidden';
                        hiddenCatField.id = 'dc_generated_categoria';
                        hiddenCatField.name = 'dc_generated_categoria';
                        document.querySelector('form#post').appendChild(hiddenCatField);
                    }
                    hiddenCatField.value = result.categoria_sugerida;
                }

                // ═══════════════════════════════════════════════════════════
                // RANK MATH SEO - Mostrar datos generados
                // ═══════════════════════════════════════════════════════════

                console.log('SEO generado - Title:', result.seo_title);
                console.log('SEO generado - Description:', result.seo_description);
                console.log('SEO generado - Focus Keyword:', result.focus_keyword);

                // Actualizar nombre en el campo si se generó
                if (result.nombre_generado) {
                    var nombreField = document.getElementById('dc_nombre');
                    if (nombreField && !nombreField.value) {
                        nombreField.value = result.nombre_generado;
                    }
                }

                // ═══════════════════════════════════════════════════════════
                // MOSTRAR PANEL DE RESULTADOS
                // ═══════════════════════════════════════════════════════════
                var previewEl = document.getElementById('dc-preview-content');
                if (previewEl) {
                    previewEl.innerHTML = '<div style=\"background:#f0fdf4;padding:15px;border-radius:8px;border:1px solid #86efac;\">' +
                        '<h4 style=\"margin:0 0 10px;color:#166534;\">Historia Generada</h4>' +
                        '<p><strong>Título:</strong> ' + (result.titulo || 'N/A') + '</p>' +
                        '<p><strong>SEO Title:</strong> ' + (result.seo_title || 'N/A') + '</p>' +
                        '<p><strong>Focus Keyword:</strong> ' + (result.focus_keyword || 'N/A') + '</p>' +
                        '<p><strong>Categoría:</strong> ' + (result.categoria_sugerida || 'N/A') + '</p>' +
                        '<p><strong>Tags:</strong> ' + (result.tags || 'N/A') + '</p>' +
                        '<p style=\"color:#666;font-size:12px;margin-top:10px;\">Los campos SEO se guardarán al publicar/actualizar el producto</p>' +
                        '</div>';
                }

                console.log('=== RESUMEN DE GENERACIÓN ===');
                console.log('Título:', result.titulo || 'N/A');
                console.log('SEO Title:', result.seo_title || 'N/A');
                console.log('SEO Desc:', result.seo_description || 'N/A');
                console.log('Focus Keyword:', result.focus_keyword || 'N/A');
                console.log('Tags:', result.tags || 'N/A');
                console.log('Categoría sugerida:', result.categoria_sugerida || 'N/A');
                console.log('============================');
            },

            getDescripcionActual: function() {
                var editor = tinyMCE.get('content');
                if (editor) {
                    return editor.getContent();
                }
                var contentField = document.getElementById('content');
                return contentField ? contentField.value : '';
            },

            feedback: function(type) {
                var feedbackEl = document.getElementById('dc-feedback');
                var formData = this.getFormData();

                if (type === 'like') {
                    // Guardar historia para aprendizaje
                    var previewContent = document.getElementById('dc-preview-content');
                    var historiaTexto = previewContent ? previewContent.innerText : '';

                    // Llamar a la API de generar-historia con flag de aprobación
                    fetch(API + '/admin/productos/generar-historia', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            nombre: formData.nombre || 'Sin nombre',
                            proposito: formData.proposito || 'General',
                            aprobarHistoria: true,
                            historiaAprobadaExtracto: historiaTexto.substring(0, 500)
                        })
                    }).then(function() {
                        feedbackEl.innerHTML = '<p style=\"color:#22c55e;font-weight:600;\">✅ ¡Historia guardada! Claude aprenderá de este estilo.</p>';
                    });
                } else {
                    // Feedback negativo - limpiar para regenerar
                    feedbackEl.innerHTML = '<p style=\"color:#f59e0b;font-weight:600;\">💡 Usá las instrucciones arriba para guiar a Claude y regenerá.</p>';
                    // Scroll hacia las instrucciones
                    document.getElementById('dc_instrucciones_claude')?.focus();
                }

                // Log del feedback
                fetch(API + '/admin/canalizar-producto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'feedback',
                        type: type,
                        product_id: document.getElementById('post_ID')?.value || '',
                        form_data: formData
                    })
                });
            }
        };

        // Inicializar inmediatamente ya que estamos en admin_footer (DOM ya está listo)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                DuendesCanalizar.init();
            });
        } else {
            // DOM ya está listo
            DuendesCanalizar.init();
        }
    })();
    ";
}

// ═══════════════════════════════════════════════════════════════
// METABOX 1: CLASIFICACIÓN DEL SER
// ═══════════════════════════════════════════════════════════════

add_action('add_meta_boxes', function() {
    add_meta_box(
        'duendes_clasificacion',
        'Clasificación del Ser',
        'duendes_clasificacion_metabox_html',
        'product',
        'normal',
        'high'
    );

    add_meta_box(
        'duendes_canalizar',
        'Canalizar Historia',
        'duendes_canalizar_metabox_html',
        'product',
        'normal',
        'high'
    );
});

function duendes_clasificacion_metabox_html($post) {
    $categorias = [
        'guardian' => 'Guardián / Protector',
        'duende' => 'Duende',
        'bruja' => 'Brujo / Bruja',
        'mago' => 'Mago / Maga',
        'chaman' => 'Chamán / Chamana',
        'hada' => 'Hada / Hado',
        'elfo' => 'Elfo / Elfa',
        'elemental' => 'Elemental',
        'angel' => 'Ser Celestial',
        'ancestro' => 'Ancestro / Espíritu Guía',
        'criatura' => 'Criatura Mítica',
        'sanador' => 'Sanador / Sanadora',
        'guerrero' => 'Guerrero/a Místico',
        'luminide' => 'Lumínide (exclusivo)',
        'cristalino' => 'Cristalino/a (exclusivo)',
        'raizmadre' => 'Raízmadre/Raízpadre (exclusivo)',
        'neblino' => 'Neblino/a (exclusivo)',
        'sonante' => 'Soñante (exclusivo)',
        'tejedor' => 'Tejedor/a de Destinos (exclusivo)',
        'susurrante' => 'Susurrante (exclusivo)',
        'memoriante' => 'Memoriante (exclusivo)',
        'libro' => 'Libro / Grimorio',
        'accesorio' => 'Accesorio Místico',
        'virtual' => 'Producto Virtual',
        'otro' => 'Otro'
    ];

    $tipos_ser = [
        // Guardianes y Duendes
        'duende' => 'Duende', 'duenda' => 'Duenda',
        'guardian' => 'Guardián', 'guardiana' => 'Guardiana',
        'protector' => 'Protector', 'protectora' => 'Protectora',

        // Abundancia y Fortuna
        'duende_abundancia' => 'Duende de la Abundancia',
        'guardian_fortuna' => 'Guardián de la Fortuna',
        'atrae_dinero' => 'Atrae Dinero',
        'prosperidad' => 'Ser de Prosperidad',
        'abre_caminos' => 'Abrecaminos',
        'suerte' => 'Duende de la Suerte',
        'riqueza' => 'Guardián de la Riqueza',
        'oro' => 'Guardián del Oro',
        'negocios' => 'Protector de Negocios',
        'exito' => 'Duende del Éxito',

        // Místicos y Sabios
        'brujo' => 'Brujo', 'bruja' => 'Bruja',
        'mago' => 'Mago', 'maga' => 'Maga',
        'hechicero' => 'Hechicero', 'hechicera' => 'Hechicera',
        'chaman' => 'Chamán', 'chamana' => 'Chamana',
        'druida' => 'Druida',
        'oraculo' => 'Oráculo', 'vidente' => 'Vidente',
        'alquimista' => 'Alquimista',

        // Seres del Bosque
        'hada' => 'Hada', 'hado' => 'Hado',
        'elfo' => 'Elfo', 'elfa' => 'Elfa',
        'gnomo' => 'Gnomo', 'gnoma' => 'Gnoma',
        'ninfa' => 'Ninfa', 'ninfo' => 'Ninfo',
        'silfide' => 'Sílfide',
        'trasgo' => 'Trasgo',
        'kobold' => 'Kobold',
        'pixie' => 'Pixie',

        // Celestiales
        'angel' => 'Ángel Guardián',
        'serafin' => 'Serafín',
        'arcangel' => 'Arcángel',
        'ser_luz' => 'Ser de Luz',

        // Criaturas Míticas
        'fenix' => 'Fénix',
        'dragon' => 'Dragón', 'dragona' => 'Dragona',
        'unicornio' => 'Unicornio',
        'grifo' => 'Grifo',
        'pegaso' => 'Pegaso',

        // Sanadores
        'sanador' => 'Sanador', 'sanadora' => 'Sanadora',
        'curandero' => 'Curandero', 'curandera' => 'Curandera',
        'herbolario' => 'Herbolario', 'herbolaria' => 'Herbolaria',

        // Guerreros
        'guerrero_luz' => 'Guerrero/a de Luz',
        'valquiria' => 'Valquiria',
        'paladin' => 'Paladín', 'paladina' => 'Paladina',

        // Literatura Clásica
        'leprechaun' => 'Leprechaun',
        'merlin' => 'Merlín',
        'gandalf' => 'Gandalf',

        // Especies Exclusivas Duendes del Uruguay
        'luminide' => 'Lumínide',
        'cristalino' => 'Cristalino/a',
        'raizmadre' => 'Raízmadre/Raízpadre',
        'neblino' => 'Neblino/a',
        'sonante' => 'Soñante',
        'tejedor_destinos' => 'Tejedor/a de Destinos',
        'susurrante' => 'Susurrante',
        'memoriante' => 'Memoriante',
        'centelleo' => 'Centelleo',
    ];

    // Obtener valores guardados
    $cat_value = get_post_meta($post->ID, '_dc_categoria', true);
    $tipo_value = get_post_meta($post->ID, '_dc_tipo_ser', true);
    $genero_value = get_post_meta($post->ID, '_dc_genero', true) ?: 'neutro';
    $especie_nueva = get_post_meta($post->ID, '_dc_especie_nueva', true);
    $tamano_value = get_post_meta($post->ID, '_dc_tamano', true) ?: 'mediano';
    $tamano_exacto = get_post_meta($post->ID, '_dc_tamano_exacto', true);
    $edicion_value = get_post_meta($post->ID, '_dc_edicion', true) ?: 'especial';
    $es_literatura = get_post_meta($post->ID, '_dc_es_literatura', true);
    $fecha_nac = get_post_meta($post->ID, '_dc_fecha_nacimiento', true);
    $hora_nac = get_post_meta($post->ID, '_dc_hora_nacimiento', true);
    $lugar_nac = get_post_meta($post->ID, '_dc_lugar_nacimiento', true);

    // Campos para productos virtuales
    $es_virtual = get_post_meta($post->ID, '_virtual', true) === 'yes';
    $tipo_virtual = get_post_meta($post->ID, '_dc_tipo_virtual', true);
    $caracteristicas_virtual = get_post_meta($post->ID, '_dc_caracteristicas_virtual', true);
    $formato_virtual = get_post_meta($post->ID, '_dc_formato_virtual', true);

    ?>
    <div class="duendes-metabox-content">

        <!-- SECCIÓN: Tipo de Ser -->
        <div class="dc-section">
            <h3 class="dc-section-title"><span>🔮</span> Tipo de Ser</h3>

            <div class="dc-grid">
                <div class="dc-field">
                    <label class="dc-label">Categoría Principal</label>
                    <select id="dc_categoria" name="dc_categoria" class="dc-select">
                        <option value="">Seleccionar...</option>
                        <?php foreach ($categorias as $key => $label): ?>
                            <option value="<?php echo esc_attr($key); ?>" <?php selected($cat_value, $key); ?>><?php echo esc_html($label); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="dc-field">
                    <label class="dc-label">Tipo de Ser</label>
                    <select id="dc_tipo_ser" name="dc_tipo_ser" class="dc-select">
                        <option value="">Seleccionar...</option>
                        <?php foreach ($tipos_ser as $key => $label): ?>
                            <option value="<?php echo esc_attr($key); ?>" <?php selected($tipo_value, $key); ?>><?php echo esc_html($label); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <div class="dc-grid" style="margin-top: 15px;">
                <div class="dc-field">
                    <label class="dc-label">Género / Energía</label>
                    <div class="dc-radio-group">
                        <div class="dc-radio-item">
                            <input type="radio" name="dc_genero" id="dc_genero_m" value="masculino" <?php checked($genero_value, 'masculino'); ?>>
                            <label for="dc_genero_m">Masculino</label>
                        </div>
                        <div class="dc-radio-item">
                            <input type="radio" name="dc_genero" id="dc_genero_f" value="femenino" <?php checked($genero_value, 'femenino'); ?>>
                            <label for="dc_genero_f">Femenino</label>
                        </div>
                        <div class="dc-radio-item">
                            <input type="radio" name="dc_genero" id="dc_genero_n" value="neutro" <?php checked($genero_value, 'neutro'); ?>>
                            <label for="dc_genero_n">Neutro/Fluido</label>
                        </div>
                    </div>
                </div>

                <div class="dc-field">
                    <label class="dc-label">Especie Única</label>
                    <div class="dc-checkbox-item" style="background: #f0fdf4; border-color: #86efac;">
                        <input type="checkbox" id="dc_especie_nueva" name="dc_especie_nueva" value="1" <?php checked($especie_nueva, '1'); ?>>
                        <label for="dc_especie_nueva" style="color: #166534;">Claude inventará una especie única para este ser</label>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECCIÓN ELIMINADA: Tamaño y Edición (movida a Categoría de Exclusividad) -->

        <!-- SECCIÓN: Producto Virtual (solo si es virtual) -->
        <div class="dc-section dc-section-virtual" id="dc_seccion_virtual" style="<?php echo $es_virtual ? '' : 'display: none;'; ?> background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-color: #7dd3fc;">
            <h3 class="dc-section-title"><span>💫</span> Producto Virtual / Digital</h3>

            <div class="dc-grid">
                <div class="dc-field">
                    <label class="dc-label">Tipo de Producto Virtual</label>
                    <select id="dc_tipo_virtual" name="dc_tipo_virtual" class="dc-select">
                        <option value="">Seleccionar...</option>
                        <option value="runas" <?php selected($tipo_virtual, 'runas'); ?>>Runas de Poder (moneda virtual)</option>
                        <option value="ebook" <?php selected($tipo_virtual, 'ebook'); ?>>Libro Digital / eBook</option>
                        <option value="curso" <?php selected($tipo_virtual, 'curso'); ?>>Curso / Programa</option>
                        <option value="canalizacion" <?php selected($tipo_virtual, 'canalizacion'); ?>>Canalización Digital</option>
                        <option value="meditacion" <?php selected($tipo_virtual, 'meditacion'); ?>>Meditación / Audio</option>
                        <option value="lectura" <?php selected($tipo_virtual, 'lectura'); ?>>Lectura Personalizada</option>
                        <option value="suscripcion" <?php selected($tipo_virtual, 'suscripcion'); ?>>Suscripción / Membresía</option>
                        <option value="pack" <?php selected($tipo_virtual, 'pack'); ?>>Pack Digital</option>
                        <option value="otro" <?php selected($tipo_virtual, 'otro'); ?>>Otro</option>
                    </select>
                </div>

                <div class="dc-field">
                    <label class="dc-label">Formato de Entrega</label>
                    <select id="dc_formato_virtual" name="dc_formato_virtual" class="dc-select">
                        <option value="">Seleccionar...</option>
                        <option value="pdf" <?php selected($formato_virtual, 'pdf'); ?>>PDF</option>
                        <option value="video" <?php selected($formato_virtual, 'video'); ?>>Video</option>
                        <option value="audio" <?php selected($formato_virtual, 'audio'); ?>>Audio / MP3</option>
                        <option value="acceso_plataforma" <?php selected($formato_virtual, 'acceso_plataforma'); ?>>Acceso a Plataforma</option>
                        <option value="email" <?php selected($formato_virtual, 'email'); ?>>Entrega por Email</option>
                        <option value="descarga" <?php selected($formato_virtual, 'descarga'); ?>>Descarga Directa</option>
                        <option value="mixto" <?php selected($formato_virtual, 'mixto'); ?>>Múltiples Formatos</option>
                    </select>
                </div>
            </div>

            <div class="dc-field" style="margin-top: 15px;">
                <label class="dc-label">Características del Producto</label>
                <textarea id="dc_caracteristicas_virtual" name="dc_caracteristicas_virtual" class="dc-textarea" rows="4"
                    placeholder="Describí qué incluye el producto: cantidad de runas, páginas del libro, duración del curso, etc."><?php echo esc_textarea($caracteristicas_virtual); ?></textarea>
                <small style="color: #666; display: block; margin-top: 5px;">Esta información se usará para generar la descripción y aparecerá en la página de producto</small>
            </div>
        </div>

        <!-- SECCIÓN: Datos de Nacimiento - ELIMINADA -->

    </div>
    <?php
    wp_nonce_field('duendes_clasificacion_save', 'duendes_clasificacion_nonce');
}

// ═══════════════════════════════════════════════════════════════
// METABOX 2: CANALIZAR HISTORIA
// ═══════════════════════════════════════════════════════════════

function duendes_canalizar_metabox_html($post) {
    $propositos = [
        'proteccion' => 'Protección',
        'abundancia' => 'Abundancia',
        'sanacion' => 'Sanación',
        'claridad' => 'Claridad Mental',
        'amor' => 'Amor',
        'transformacion' => 'Transformación',
        'equilibrio' => 'Equilibrio',
        'intuicion' => 'Intuición',
        'creatividad' => 'Creatividad',
        'paz' => 'Paz Interior',
        'fuerza' => 'Fuerza',
        'suerte' => 'Suerte',
        'viajes' => 'Protección en Viajes',
        'suenos' => 'Sueños',
        'ancestral' => 'Conexión Ancestral'
    ];

    $elementos = [
        'tierra' => 'Tierra',
        'agua' => 'Agua',
        'fuego' => 'Fuego',
        'aire' => 'Aire',
        'eter' => 'Éter'
    ];

    $edades = [
        'joven' => 'Joven',
        'adulto' => 'Adulto',
        'anciano' => 'Anciano/Sabio',
        'atemporal' => 'Atemporal'
    ];

    // Valores guardados
    $nombre = get_post_meta($post->ID, '_dc_nombre', true);
    $proposito = get_post_meta($post->ID, '_dc_proposito', true);
    $elemento = get_post_meta($post->ID, '_dc_elemento', true);
    $cristales = get_post_meta($post->ID, '_dc_cristales', true);
    $edad = get_post_meta($post->ID, '_dc_edad_aparente', true);
    $notas = get_post_meta($post->ID, '_dc_notas', true);

    ?>
    <div class="duendes-metabox-content">

        <!-- SECCIÓN: Información del Ser -->
        <div class="dc-section">
            <h3 class="dc-section-title"><span>✨</span> Información del Ser</h3>

            <div class="dc-grid">
                <div class="dc-field">
                    <label class="dc-label">Nombre (opcional - Claude genera si está vacío)</label>
                    <input type="text" id="dc_nombre" name="dc_nombre" class="dc-input" placeholder="Ej: Finnegan, Willow, Bramble..." value="<?php echo esc_attr($nombre); ?>">
                </div>

                <div class="dc-field">
                    <label class="dc-label">Propósito Principal</label>
                    <select id="dc_proposito" name="dc_proposito" class="dc-select">
                        <option value="">Seleccionar...</option>
                        <?php foreach ($propositos as $key => $label): ?>
                            <option value="<?php echo esc_attr($key); ?>" <?php selected($proposito, $key); ?>><?php echo esc_html($label); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <div class="dc-grid dc-grid-3" style="margin-top: 15px;">
                <div class="dc-field">
                    <label class="dc-label">Elemento</label>
                    <select id="dc_elemento" name="dc_elemento" class="dc-select">
                        <option value="">Seleccionar...</option>
                        <?php foreach ($elementos as $key => $label): ?>
                            <option value="<?php echo esc_attr($key); ?>" <?php selected($elemento, $key); ?>><?php echo esc_html($label); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="dc-field">
                    <label class="dc-label">Cristales</label>
                    <input type="text" id="dc_cristales" name="dc_cristales" class="dc-input" placeholder="Ej: citrino, cuarzo rosa" value="<?php echo esc_attr($cristales); ?>">
                </div>

                <div class="dc-field">
                    <label class="dc-label">Edad Aparente</label>
                    <select id="dc_edad_aparente" name="dc_edad_aparente" class="dc-select">
                        <option value="">Seleccionar...</option>
                        <?php foreach ($edades as $key => $label): ?>
                            <option value="<?php echo esc_attr($key); ?>" <?php selected($edad, $key); ?>><?php echo esc_html($label); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <div class="dc-field full-width" style="margin-top: 15px;">
                <label class="dc-label">Notas Adicionales</label>
                <textarea id="dc_notas" name="dc_notas" class="dc-textarea" placeholder="Cualquier detalle extra: tiene una cicatriz, lleva un bastón, mirada penetrante, etc."><?php echo esc_textarea($notas); ?></textarea>
            </div>
        </div>

        <!-- SECCIÓN: Categoría y Personalidad -->
        <div class="dc-section" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-color: #f59e0b;">
            <h3 class="dc-section-title"><span>👑</span> Categoría, Tamaño y Personalidad</h3>

            <div class="dc-grid">
                <div class="dc-field">
                    <label class="dc-label">Tipo de Pieza (Exclusividad)</label>
                    <select id="dc_categoria_tamano" name="dc_categoria_tamano" class="dc-select" style="font-weight: 600;">
                        <option value="mini" <?php selected(get_post_meta($post->ID, '_dc_categoria_tamano', true), 'mini'); ?>>🔸 MINI - Se recrea, rostro único</option>
                        <option value="clasico" <?php selected(get_post_meta($post->ID, '_dc_categoria_tamano', true), 'clasico'); ?>>🔸 CLÁSICO - Hecho a mano</option>
                        <option value="especial" <?php selected(get_post_meta($post->ID, '_dc_categoria_tamano', true), 'especial'); ?>>🔸 ESPECIAL - Edición limitada</option>
                        <option value="mediano" <?php selected(get_post_meta($post->ID, '_dc_categoria_tamano', true), 'mediano'); ?>>⚠️ MEDIANO - ÚNICO</option>
                        <option value="grande" <?php selected(get_post_meta($post->ID, '_dc_categoria_tamano', true), 'grande'); ?>>⚠️ GRANDE - ÚNICO</option>
                        <option value="gigante" <?php selected(get_post_meta($post->ID, '_dc_categoria_tamano', true), 'gigante'); ?>>⚠️ GIGANTE - ÚNICO</option>
                        <option value="pixie" <?php selected(get_post_meta($post->ID, '_dc_categoria_tamano', true), 'pixie'); ?>>⚠️ PIXIE - ÚNICA</option>
                    </select>
                </div>
                <div class="dc-field">
                    <label class="dc-label">Tamaño Exacto</label>
                    <input type="text" id="dc_tamano_exacto" name="dc_tamano_exacto" class="dc-input"
                        placeholder="Ej: 23 cm de alto x 15 cm de ancho"
                        value="<?php echo esc_attr(get_post_meta($post->ID, '_dc_tamano_exacto', true)); ?>">
                </div>
            </div>

            <div class="dc-field" style="margin-top: 15px;">
                <label class="dc-label">🎭 Tipo de Personalidad</label>
                <select id="dc_personalidad" name="dc_personalidad" class="dc-select">
                    <option value="">Claude decide...</option>
                    <option value="simpatico" <?php selected(get_post_meta($post->ID, '_dc_personalidad', true), 'simpatico'); ?>>😊 Simpático y cálido</option>
                    <option value="grunon" <?php selected(get_post_meta($post->ID, '_dc_personalidad', true), 'grunon'); ?>>😤 Gruñón pero tierno</option>
                    <option value="misterioso" <?php selected(get_post_meta($post->ID, '_dc_personalidad', true), 'misterioso'); ?>>🌙 Misterioso y profundo</option>
                    <option value="jugueton" <?php selected(get_post_meta($post->ID, '_dc_personalidad', true), 'jugueton'); ?>>🎈 Juguetón y travieso</option>
                    <option value="sabio" <?php selected(get_post_meta($post->ID, '_dc_personalidad', true), 'sabio'); ?>>📚 Sabio y sereno</option>
                    <option value="protector" <?php selected(get_post_meta($post->ID, '_dc_personalidad', true), 'protector'); ?>>🛡️ Protector y firme</option>
                    <option value="dulce" <?php selected(get_post_meta($post->ID, '_dc_personalidad', true), 'dulce'); ?>>💕 Dulce y maternal/paternal</option>
                    <option value="rebelde" <?php selected(get_post_meta($post->ID, '_dc_personalidad', true), 'rebelde'); ?>>⚡ Rebelde e intenso</option>
                    <option value="timido" <?php selected(get_post_meta($post->ID, '_dc_personalidad', true), 'timido'); ?>>🌸 Tímido pero leal</option>
                    <option value="energetico" <?php selected(get_post_meta($post->ID, '_dc_personalidad', true), 'energetico'); ?>>🔥 Energético y motivador</option>
                </select>
                <small style="color: #92400e; display: block; margin-top: 4px;">Claude inventará automáticamente el "sincrodestino" (momento mágico de la canalización).</small>
            </div>

            <div style="padding: 10px; background: #fff; border-radius: 6px; font-size: 12px; color: #78350f; margin-top: 15px;">
                <strong>Mini/Clásico/Especial:</strong> El duende elige a la persona, pero puede haber otros similares.<br>
                <strong>Mediano/Grande/Gigante/Pixie:</strong> ÚNICO. Una vez adoptado, desaparece del universo. Exclusivo. Para coleccionistas.
            </div>
        </div>

        <!-- SECCIÓN: Instrucciones para Claude -->
        <div class="dc-section" style="background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border-color: #8b5cf6;">
            <h3 class="dc-section-title"><span>💬</span> Instrucciones Directas para Claude</h3>
            <p style="color: #5b21b6; font-size: 13px; margin-bottom: 15px;">Si la historia generada no te convence, escribí acá EXACTAMENTE qué querés. Claude aprenderá de tus preferencias.</p>

            <div class="dc-field full-width">
                <textarea id="dc_instrucciones_claude" name="dc_instrucciones_claude" class="dc-textarea" rows="4" placeholder="Ej: 'Quiero que la historia sea más directa, menos poética. Que hable específicamente de dinero y cómo va a ayudar a conseguir trabajo. Que tenga un tono más cercano, como si fuera un amigo. No uses la palabra ancestral.'"><?php echo esc_textarea(get_post_meta($post->ID, '_dc_instrucciones_claude', true)); ?></textarea>
                <small style="color: #7c3aed; display: block; margin-top: 6px;">✨ Estas instrucciones tienen PRIORIDAD ABSOLUTA sobre todo lo demás.</small>
            </div>
        </div>

        <!-- SECCIÓN: Generación -->
        <div class="dc-section">
            <h3 class="dc-section-title"><span>🔮</span> Generación de Historia</h3>

            <div class="dc-actions">
                <button type="button" id="dc-btn-generar" class="dc-btn dc-btn-primary" onclick="DuendesCanalizar.generar()">
                    <span>🔮</span> Generar Historia
                </button>

                <div class="dc-modify-field">
                    <input type="text" id="dc_modificacion" class="dc-modify-input" placeholder="Ej: más misterioso, conectalo con la luna, menos texto...">
                </div>

                <button type="button" id="dc-btn-mejorar" class="dc-btn dc-btn-secondary" onclick="DuendesCanalizar.mejorar()">
                    <span>✨</span> Mejorar Historia
                </button>
            </div>

            <div class="dc-regen-styles">
                <span style="font-size: 12px; color: #64748b; margin-right: 10px;">Regenerar con estilo:</span>
                <button type="button" class="dc-regen-style" data-style="mistico">Más místico</button>
                <button type="button" class="dc-regen-style" data-style="terrenal">Más terrenal</button>
                <button type="button" class="dc-regen-style" data-style="emotivo">Más emotivo</button>
                <button type="button" class="dc-regen-style" data-style="conciso">Más conciso</button>
                <button type="button" class="dc-regen-style" data-style="poetico">Más poético</button>
                <button type="button" id="dc-btn-regenerar" class="dc-btn dc-btn-secondary" onclick="DuendesCanalizar.regenerar()" style="margin-left: auto;">
                    <span>🔄</span> Regenerar
                </button>
            </div>

            <!-- Loading -->
            <div id="dc-loading" class="dc-loading">
                <div class="dc-spinner"></div>
                <span>Claude está canalizando la historia... analizando imágenes del producto...</span>
            </div>

            <!-- Preview -->
            <div id="dc-preview" class="dc-preview">
                <div class="dc-preview-title">Vista previa (descripción corta):</div>
                <div id="dc-preview-content" class="dc-preview-content"></div>
            </div>

            <!-- Feedback -->
            <div id="dc-feedback" class="dc-feedback">
                <div class="dc-feedback-title">¿Qué te pareció?</div>
                <div class="dc-feedback-btns">
                    <button type="button" class="dc-feedback-btn positive" onclick="DuendesCanalizar.feedback('like')" style="background: linear-gradient(135deg, #10b981, #059669);">
                        👍 Me encanta - GUARDAR para aprendizaje
                    </button>
                    <button type="button" class="dc-feedback-btn negative" onclick="DuendesCanalizar.feedback('dislike')">
                        👎 No me convence - Regenerar
                    </button>
                </div>
                <p style="font-size: 11px; color: #666; margin-top: 8px; text-align: center;">
                    Al dar "Me encanta", Claude aprenderá de esta historia para futuras generaciones.
                </p>
            </div>
        </div>

        <!-- RECORDATORIO -->
        <div class="dc-reminder">
            <div class="dc-reminder-title">
                <span>⚠️</span> Lo que Claude DEBE hacer
            </div>
            <div class="dc-reminder-list">
                <div class="dc-reminder-item bad">NO: "En lo profundo del bosque..."</div>
                <div class="dc-reminder-item bad">NO: "Entre las brumas del horizonte..."</div>
                <div class="dc-reminder-item bad">NO: Metáforas vacías sin significado</div>
                <div class="dc-reminder-item bad">NO: Escritura genérica de IA</div>
                <div class="dc-reminder-item good">SÍ: Edad específica (847 años, 2300 años...)</div>
                <div class="dc-reminder-item good">SÍ: Promesa CLARA de qué aspecto trabaja</div>
                <div class="dc-reminder-item good">SÍ: Personalidad ÚNICA con vivencias</div>
                <div class="dc-reminder-item good">SÍ: Primera frase que IMPACTE</div>
                <div class="dc-reminder-item good">SÍ: El duende ELIGE a la persona</div>
                <div class="dc-reminder-item good">SÍ: Conexión que eriza la piel</div>
            </div>
        </div>

    </div>
    <?php
}

// ═══════════════════════════════════════════════════════════════
// GUARDAR METABOXES
// ═══════════════════════════════════════════════════════════════

add_action('save_post_product', function($post_id) {
    if (!isset($_POST['duendes_clasificacion_nonce'])) return;
    if (!wp_verify_nonce($_POST['duendes_clasificacion_nonce'], 'duendes_clasificacion_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;

    $fields = [
        'dc_categoria', 'dc_tipo_ser', 'dc_genero', 'dc_especie_nueva',
        'dc_tamano', 'dc_tamano_exacto', 'dc_edicion', 'dc_es_literatura',
        // dc_fecha_nacimiento, dc_hora_nacimiento, dc_lugar_nacimiento - ELIMINADOS
        'dc_nombre', 'dc_proposito', 'dc_elemento', 'dc_cristales',
        'dc_edad_aparente', 'dc_notas',
        // Campos para productos virtuales
        'dc_tipo_virtual', 'dc_formato_virtual', 'dc_caracteristicas_virtual',
        // NUEVOS: Categoría, personalidad e instrucciones para Claude (sincrodestino lo inventa Claude)
        'dc_categoria_tamano', 'dc_tamano_exacto', 'dc_personalidad', 'dc_instrucciones_claude'
    ];

    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
        } else {
            delete_post_meta($post_id, '_' . $field);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // PROCESAR TAGS GENERADOS POR IA
    // ═══════════════════════════════════════════════════════════════
    if (!empty($_POST['dc_generated_tags'])) {
        $tags_string = sanitize_text_field($_POST['dc_generated_tags']);
        $tags_array = array_map('trim', explode(',', $tags_string));
        $tags_array = array_filter($tags_array); // Eliminar vacíos

        if (!empty($tags_array)) {
            wp_set_object_terms($post_id, $tags_array, 'product_tag', true); // true = append
            error_log("Duendes: Tags aplicados al producto $post_id: " . implode(', ', $tags_array));
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // PROCESAR CATEGORÍA SUGERIDA
    // ═══════════════════════════════════════════════════════════════
    if (!empty($_POST['dc_generated_categoria'])) {
        $categoria_sugerida = sanitize_text_field($_POST['dc_generated_categoria']);

        // Buscar categoría existente que coincida
        $categorias = get_terms([
            'taxonomy' => 'product_cat',
            'hide_empty' => false
        ]);

        $categoria_lower = strtolower($categoria_sugerida);
        foreach ($categorias as $cat) {
            $cat_name_lower = strtolower($cat->name);
            // Buscar coincidencia parcial
            if (strpos($cat_name_lower, $categoria_lower) !== false ||
                strpos($categoria_lower, $cat_name_lower) !== false) {
                wp_set_object_terms($post_id, [$cat->term_id], 'product_cat', true);
                error_log("Duendes: Categoría aplicada al producto $post_id: {$cat->name}");
                break;
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // GUARDAR SEO DE RANK MATH
    // ═══════════════════════════════════════════════════════════════
    $seo_fields = ['rank_math_title', 'rank_math_description', 'rank_math_focus_keyword'];

    foreach ($seo_fields as $seo_field) {
        if (!empty($_POST[$seo_field])) {
            $value = sanitize_text_field($_POST[$seo_field]);
            update_post_meta($post_id, $seo_field, $value);
            error_log("Duendes: SEO $seo_field guardado para producto $post_id: $value");
        }
    }
});

// ═══════════════════════════════════════════════════════════════
// AGREGAR CLASE CSS AL METABOX
// ═══════════════════════════════════════════════════════════════

add_filter('postbox_classes_product_duendes_clasificacion', function($classes) {
    $classes[] = 'duendes-metabox';
    return $classes;
});

add_filter('postbox_classes_product_duendes_canalizar', function($classes) {
    $classes[] = 'duendes-metabox';
    return $classes;
});
