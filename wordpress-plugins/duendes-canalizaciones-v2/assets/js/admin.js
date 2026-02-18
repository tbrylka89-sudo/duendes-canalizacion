/**
 * JavaScript del Panel Admin de Canalizaciones
 * Con soporte para 5 secciones (tabs)
 */

(function($) {
    'use strict';

    var currentCanalizacionId = null;
    var currentData = null;

    $(document).ready(function() {
        initModal();
        initTabs();
        initAcciones();
        initEditor();
    });

    /**
     * Tabs
     */
    function initTabs() {
        $(document).on('click', '.tab-btn', function() {
            var tab = $(this).data('tab');

            // Activar tab button
            $('.tab-btn').removeClass('active');
            $(this).addClass('active');

            // Mostrar contenido
            $('.tab-content').removeClass('active');
            $('.tab-content[data-tab="' + tab + '"]').addClass('active');
        });
    }

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
        currentData = null;

        // Reset tabs
        $('.tab-btn').removeClass('active').first().addClass('active');
        $('.tab-content').removeClass('active').first().addClass('active');
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
                    currentData = response.data;
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

        // Renderizar las 5 secciones en tabs
        var secciones = data.secciones || {};

        // Tab 1: Canalizacion (editable)
        if (secciones.canalizacion) {
            $('.canalizacion-contenido').text(secciones.canalizacion);
        } else if (data.contenido) {
            // Fallback: contenido completo si no hay secciones
            $('.canalizacion-contenido').text(data.contenido);
        } else {
            $('.canalizacion-contenido').text('(Sin contenido generado)');
        }
        contarPalabras();

        // Tab 2: Mensaje del Ser (editable)
        if (secciones.mensaje_del_ser) {
            $('.mensaje-contenido').text(secciones.mensaje_del_ser);
        } else {
            $('.mensaje-contenido').text('(Se generara junto con la canalizacion)');
        }

        // Tab 3: Cuidados (editable)
        if (secciones.cuidados) {
            $('.cuidados-contenido').text(secciones.cuidados);
        } else {
            $('.cuidados-contenido').text('(Se generaran junto con la canalizacion)');
        }

        // Tab 4: Historia (solo lectura)
        if (secciones.historia && secciones.historia !== '(Este guardian aun no tiene historia escrita en la tienda)') {
            $('.historia-contenido').html(formatearHTML(secciones.historia));
        } else {
            $('.historia-contenido').html('<em>Este guardian aun no tiene historia escrita en la tienda</em>');
        }

        // Tab 5: Ficha (solo lectura)
        if (secciones.ficha) {
            $('.ficha-contenido').html(formatearHTML(secciones.ficha));
        } else {
            $('.ficha-contenido').html('<em>Sin datos de ficha</em>');
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
        if (datos.nombre) html += '<li><strong>Nombre:</strong> ' + datos.nombre + '</li>';
        if (datos.momento) html += '<li><strong>Momento:</strong> ' + datos.momento + '</li>';
        if (datos.necesidades && datos.necesidades.length) html += '<li><strong>Necesidades:</strong> ' + datos.necesidades.join(', ') + '</li>';
        if (datos.personalidad && datos.personalidad.length) html += '<li><strong>Personalidad:</strong> ' + datos.personalidad.join(', ') + '</li>';
        if (datos.mensaje) html += '<li><strong>Mensaje:</strong> ' + datos.mensaje + '</li>';
        if (datos.relacion) html += '<li><strong>Relacion:</strong> ' + datos.relacion + '</li>';
        if (datos.nombre_destinatario) html += '<li><strong>Destinatario:</strong> ' + datos.nombre_destinatario + '</li>';
        if (datos.edad_nino) html += '<li><strong>Edad:</strong> ' + datos.edad_nino + '</li>';
        html += '</ul>';
        return html;
    }

    function formatearHTML(texto) {
        // Convertir saltos de linea a <br> y escapar HTML
        return $('<div/>').text(texto).html().replace(/\n/g, '<br>');
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
            timeout: 180000, // 3 minutos para generacion
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
            timeout: 180000,
            success: function(response) {
                if (response.success) {
                    // Recargar datos para actualizar todas las secciones
                    cargarCanalizacion(id, 'ver');
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
     * Guardar cambios manuales (reconstruye contenido desde secciones editables)
     */
    function guardarCambios(id) {
        // Reconstruir contenido completo desde las secciones editables
        var canalizacion = $('.canalizacion-contenido').text();
        var mensaje = $('.mensaje-contenido').text();
        var cuidados = $('.cuidados-contenido').text();

        // Las secciones historia y ficha no se editan, las tomamos de currentData
        var historia = (currentData && currentData.secciones && currentData.secciones.historia) || '';
        var ficha = (currentData && currentData.secciones && currentData.secciones.ficha) || '';

        // Reconstruir con separadores
        var contenidoCompleto = '===CANALIZACION===\n' + canalizacion + '\n\n';
        contenidoCompleto += '===MENSAJE DEL SER===\n' + mensaje + '\n\n';
        contenidoCompleto += '===CUIDADOS===\n' + cuidados + '\n\n';
        contenidoCompleto += '===HISTORIA DEL GUARDIAN===\n' + historia + '\n\n';
        contenidoCompleto += '===FICHA DEL GUARDIAN===\n' + ficha;

        $.ajax({
            url: duendesCanalAdmin.ajaxUrl,
            method: 'POST',
            data: {
                action: 'duendes_guardar_canalizacion',
                nonce: duendesCanalAdmin.nonce,
                canalizacion_id: id,
                contenido: contenidoCompleto
            },
            success: function(response) {
                if (response.success) {
                    alert(duendesCanalAdmin.strings.exito);
                } else {
                    alert(response.data.message || duendesCanalAdmin.strings.error);
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
        // Contar palabras al editar canalizacion
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
