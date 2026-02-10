/**
 * JavaScript del Panel Admin de Canalizaciones
 */

(function($) {
    'use strict';

    var currentCanalizacionId = null;

    $(document).ready(function() {
        initModal();
        initAcciones();
        initEditor();
    });

    /**
     * Modal
     */
    function initModal() {
        // Cerrar modal
        $(document).on('click', '.modal-cerrar, .modal-cancelar, #duendes-modal-overlay', function(e) {
            if (e.target === this) {
                cerrarModal();
            }
        });

        // ESC para cerrar
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape') {
                cerrarModal();
            }
        });
    }

    function abrirModal() {
        $('#duendes-modal-overlay').show();
        $('body').css('overflow', 'hidden');
    }

    function cerrarModal() {
        $('#duendes-modal-overlay').hide();
        $('body').css('overflow', '');
        currentCanalizacionId = null;
    }

    function mostrarLoading() {
        $('.modal-loading').show();
        $('.modal-content').hide();
    }

    function mostrarContenido() {
        $('.modal-loading').hide();
        $('.modal-content').show();
    }

    /**
     * Acciones
     */
    function initAcciones() {
        // Ver canalizacion
        $(document).on('click', '.btn-ver, .btn-ver-modal', function(e) {
            e.preventDefault();
            var id = $(this).data('id');
            cargarCanalizacion(id, 'ver');
        });

        // Generar
        $(document).on('click', '.btn-generar, .btn-generar-modal', function(e) {
            e.preventDefault();
            var id = $(this).data('id');
            generarCanalizacion(id);
        });

        // Regenerar
        $(document).on('click', '.btn-regenerar, .btn-regenerar-modal', function(e) {
            e.preventDefault();
            var id = $(this).data('id');
            cargarCanalizacion(id, 'regenerar');
        });

        // Enviar
        $(document).on('click', '.btn-enviar, .btn-enviar-modal', function(e) {
            e.preventDefault();
            var id = $(this).data('id');

            if (confirm(duendesCanalAdmin.strings.confirmEnviar)) {
                enviarCanalizacion(id);
            }
        });

        // Toggle regenerar
        $(document).on('click', '.btn-toggle-regen', function() {
            $('.modal-regenerar').toggle();
        });

        // Ejecutar regeneracion
        $(document).on('click', '.btn-ejecutar-regen', function() {
            var instrucciones = $('.instrucciones-regen').val();
            regenerarCanalizacion(currentCanalizacionId, instrucciones);
        });

        // Guardar cambios
        $(document).on('click', '.btn-guardar', function() {
            guardarCambios(currentCanalizacionId);
        });

        // Enviar desde modal
        $(document).on('click', '.btn-enviar-final', function() {
            if (confirm(duendesCanalAdmin.strings.confirmEnviar)) {
                enviarCanalizacion(currentCanalizacionId);
            }
        });
    }

    /**
     * Cargar canalizacion en modal
     */
    function cargarCanalizacion(id, modo) {
        currentCanalizacionId = id;
        abrirModal();
        mostrarLoading();

        $.ajax({
            url: duendesCanalAdmin.ajaxUrl,
            method: 'POST',
            data: {
                action: 'duendes_obtener_canalizacion',
                nonce: duendesCanalAdmin.nonce,
                canalizacion_id: id
            },
            success: function(response) {
                if (response.success) {
                    renderCanalizacion(response.data, modo);
                    mostrarContenido();
                } else {
                    alert(response.data.message);
                    cerrarModal();
                }
            },
            error: function() {
                alert(duendesCanalAdmin.strings.error);
                cerrarModal();
            }
        });
    }

    function renderCanalizacion(data, modo) {
        // Datos basicos
        $('.dato-cliente').text(data.nombre_cliente);
        $('.dato-email').text(data.email);
        $('.dato-guardian').text(data.guardian_nombre);
        $('.dato-categoria').text(data.guardian_categoria);
        $('.dato-tipo').text(formatearTipo(data.tipo_destinatario));

        // Formulario compartido
        if (data.datos_formulario && Object.keys(data.datos_formulario).length > 0) {
            var html = formatearFormulario(data.datos_formulario);
            $('.formulario-datos').html(html);
            $('.modal-formulario').show();
        } else {
            $('.modal-formulario').hide();
        }

        // Contenido
        if (data.contenido) {
            $('.canalizacion-contenido').text(data.contenido);
            contarPalabras();
        } else {
            $('.canalizacion-contenido').text('(Sin contenido generado)');
        }

        // Version
        var numVersiones = (data.versiones && data.versiones.length) || 0;
        $('.version-num').text('v' + (numVersiones + 1));

        // Historial
        if (data.versiones && data.versiones.length > 0) {
            var histHtml = '';
            data.versiones.forEach(function(v, i) {
                histHtml += '<li>v' + v.numero + ' - ' + v.fecha + ' - ' + (v.motivo || 'Original') + '</li>';
            });
            $('.historial-lista').html(histHtml);
            $('.modal-historial').show();
        } else {
            $('.modal-historial').hide();
        }

        // Mostrar/ocultar botones segun estado
        var estado = data.estado;
        $('.btn-toggle-regen').toggle(estado === 'lista');
        $('.btn-guardar').toggle(estado === 'lista');
        $('.btn-enviar-final').toggle(estado === 'lista');

        // Modo regenerar
        if (modo === 'regenerar') {
            $('.modal-regenerar').show();
        } else {
            $('.modal-regenerar').hide();
        }
    }

    function formatearTipo(tipo) {
        var tipos = {
            'para_mi': 'Para mi',
            'regalo_sabe': 'Regalo (sabe)',
            'regalo_sorpresa': 'Regalo sorpresa',
            'para_nino': 'Para menor'
        };
        return tipos[tipo] || tipo;
    }

    function formatearFormulario(datos) {
        var html = '<ul>';
        if (datos.momento) html += '<li><strong>Momento:</strong> ' + datos.momento + '</li>';
        if (datos.necesidades && datos.necesidades.length) html += '<li><strong>Necesidades:</strong> ' + datos.necesidades.join(', ') + '</li>';
        if (datos.personalidad && datos.personalidad.length) html += '<li><strong>Personalidad:</strong> ' + datos.personalidad.join(', ') + '</li>';
        if (datos.mensaje) html += '<li><strong>Mensaje:</strong> ' + datos.mensaje + '</li>';
        if (datos.relacion) html += '<li><strong>Relacion:</strong> ' + datos.relacion + '</li>';
        html += '</ul>';
        return html;
    }

    /**
     * Generar canalizacion
     */
    function generarCanalizacion(id) {
        currentCanalizacionId = id;
        abrirModal();
        mostrarLoading();
        $('.modal-titulo').text(duendesCanalAdmin.strings.generando);

        $.ajax({
            url: duendesCanalAdmin.ajaxUrl,
            method: 'POST',
            data: {
                action: 'duendes_generar_canalizacion',
                nonce: duendesCanalAdmin.nonce,
                canalizacion_id: id
            },
            success: function(response) {
                if (response.success) {
                    alert(duendesCanalAdmin.strings.exito);
                    location.reload();
                } else {
                    alert(response.data.message);
                    cerrarModal();
                }
            },
            error: function() {
                alert(duendesCanalAdmin.strings.error);
                cerrarModal();
            }
        });
    }

    /**
     * Regenerar con instrucciones
     */
    function regenerarCanalizacion(id, instrucciones) {
        mostrarLoading();
        $('.modal-titulo').text(duendesCanalAdmin.strings.regenerando);

        $.ajax({
            url: duendesCanalAdmin.ajaxUrl,
            method: 'POST',
            data: {
                action: 'duendes_regenerar_canalizacion',
                nonce: duendesCanalAdmin.nonce,
                canalizacion_id: id,
                instrucciones: instrucciones
            },
            success: function(response) {
                if (response.success) {
                    $('.canalizacion-contenido').text(response.data.contenido);
                    $('.version-num').text('v' + response.data.version);
                    contarPalabras();
                    mostrarContenido();
                    $('.instrucciones-regen').val('');
                    $('.modal-regenerar').hide();
                } else {
                    alert(response.data.message);
                    mostrarContenido();
                }
            },
            error: function() {
                alert(duendesCanalAdmin.strings.error);
                mostrarContenido();
            }
        });
    }

    /**
     * Guardar cambios manuales
     */
    function guardarCambios(id) {
        var contenido = $('.canalizacion-contenido').text();

        $.ajax({
            url: duendesCanalAdmin.ajaxUrl,
            method: 'POST',
            data: {
                action: 'duendes_guardar_canalizacion',
                nonce: duendesCanalAdmin.nonce,
                canalizacion_id: id,
                contenido: contenido
            },
            success: function(response) {
                if (response.success) {
                    alert(duendesCanalAdmin.strings.exito);
                } else {
                    alert(response.data.message);
                }
            }
        });
    }

    /**
     * Enviar canalizacion
     */
    function enviarCanalizacion(id) {
        $.ajax({
            url: duendesCanalAdmin.ajaxUrl,
            method: 'POST',
            data: {
                action: 'duendes_enviar_canalizacion',
                nonce: duendesCanalAdmin.nonce,
                canalizacion_id: id
            },
            success: function(response) {
                if (response.success) {
                    alert(response.data.message);
                    cerrarModal();
                    location.reload();
                } else {
                    alert(response.data.message);
                }
            },
            error: function() {
                alert(duendesCanalAdmin.strings.error);
            }
        });
    }

    /**
     * Editor
     */
    function initEditor() {
        // Contar palabras al editar
        $(document).on('input', '.canalizacion-contenido', function() {
            contarPalabras();
        });
    }

    function contarPalabras() {
        var texto = $('.canalizacion-contenido').text();
        var palabras = texto.trim().split(/\s+/).filter(function(w) { return w.length > 0; }).length;
        $('.canalizacion-palabras').text(palabras + ' palabras');
    }

})(jQuery);
