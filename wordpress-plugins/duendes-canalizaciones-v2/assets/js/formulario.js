/**
 * JavaScript del Formulario de Canalizacion
 */

(function($) {
    'use strict';

    // Inicializar cuando el DOM este listo
    $(document).ready(function() {
        initOpcionesFormulario();
        initFormularioMultiPaso();
        initFotoUpload();
        initMultiGuardian();
    });

    /**
     * Opciones: Ahora o Despues
     */
    function initOpcionesFormulario() {
        $('.opcion-btn').on('click', function() {
            var opcion = $(this).data('opcion');

            $('.opcion-btn').removeClass('active');
            $(this).addClass('active');

            if (opcion === 'ahora') {
                $('.duendes-panel-ahora').show();
                $('.duendes-panel-despues').hide();
            } else {
                $('.duendes-panel-ahora').hide();
                $('.duendes-panel-despues').show();
                // Enviar email con link
                enviarEmailDespues();
            }
        });

        $('.btn-cambiar-ahora').on('click', function() {
            $('.opcion-ahora').click();
        });
    }

    /**
     * Formulario multi-paso
     */
    function initFormularioMultiPaso() {
        // Navegacion entre pasos
        $(document).on('click', '.btn-siguiente', function() {
            var $paso = $(this).closest('.duendes-form-paso');
            var pasoActual = parseInt($paso.data('paso'));

            // Validar paso actual
            if (!validarPaso($paso)) {
                return;
            }

            // Ir al siguiente
            $paso.hide();
            $paso.siblings('[data-paso="' + (pasoActual + 1) + '"]').show();
        });

        $(document).on('click', '.btn-anterior', function() {
            var $paso = $(this).closest('.duendes-form-paso');
            var pasoActual = parseInt($paso.data('paso'));

            $paso.hide();
            $paso.siblings('[data-paso="' + (pasoActual - 1) + '"]').show();
        });

        // Enviar formulario
        $(document).on('click', '.btn-enviar', function(e) {
            e.preventDefault();

            var $form = $(this).closest('.duendes-form');
            var $paso = $(this).closest('.duendes-form-paso');

            if (!validarPaso($paso)) {
                return;
            }

            enviarFormulario($form);
        });

        // Actualizar nombre del destinatario en headers
        $(document).on('input', '#nombre_destinatario, #nombre_nino', function() {
            var nombre = $(this).val();
            $(this).closest('.duendes-form').find('.nombre-destinatario').text(nombre);
        });

        // Limitar seleccion de checkboxes (max-3)
        $(document).on('change', '.max-3 input[type="checkbox"]', function() {
            var $grid = $(this).closest('.opciones-grid');
            var checked = $grid.find('input:checked').length;

            if (checked >= 3) {
                $grid.find('input:not(:checked)').prop('disabled', true);
            } else {
                $grid.find('input').prop('disabled', false);
            }
        });

        // Toggle clase selected
        $(document).on('change', '.opcion-checkbox input, .opcion-radio input', function() {
            var $label = $(this).closest('label');

            if ($(this).is(':radio')) {
                $label.siblings().removeClass('selected');
            }

            $label.toggleClass('selected', $(this).is(':checked'));
        });
    }

    /**
     * Validar paso
     */
    function validarPaso($paso) {
        var valido = true;

        $paso.find('input[required], textarea[required]').each(function() {
            if (!$(this).val().trim()) {
                $(this).css('border-color', '#e74c3c');
                valido = false;
            } else {
                $(this).css('border-color', '');
            }
        });

        // Validar checkbox mayor de 18 si hay foto
        var $mayor18 = $paso.find('input[name="es_mayor_18"]');
        if ($mayor18.length && $mayor18.prop('required') && !$mayor18.is(':checked')) {
            $mayor18.closest('label').css('border-color', '#e74c3c');
            valido = false;
        }

        return valido;
    }

    /**
     * Enviar formulario
     */
    function enviarFormulario($form) {
        var $loading = $form.find('.duendes-form-loading');
        var $pasos = $form.find('.duendes-form-paso');

        // Recolectar datos
        var datos = {
            tipo: $form.find('input[name="tipo"]').val(),
            nombre: $form.find('#nombre').val() || $form.find('#nombre_destinatario').val() || $form.find('#nombre_nino').val(),
            momento: $form.find('#momento').val() || $form.find('textarea[name="momento"]').val(),
            mensaje: $form.find('#mensaje').val() || $form.find('textarea[name="mensaje"]').val(),
            necesidades: [],
            personalidad: [],
            relacion: $form.find('input[name="relacion"]:checked').val(),
            email_destinatario: $form.find('#email_destinatario').val(),
            nombre_destinatario: $form.find('#nombre_destinatario').val(),
            edad_nino: $form.find('input[name="edad_nino"]:checked').val(),
            es_mayor_18: $form.find('input[name="es_mayor_18"]').is(':checked'),
            anonimo: $form.find('input[name="anonimo"]').is(':checked'),
            pasion: $form.find('#pasion').val(),
            gustos: $form.find('#gustos').val(),
            mensaje_tuyo: $form.find('#mensaje_tuyo').val()
        };

        // Arrays
        $form.find('input[name="necesidades[]"]:checked').each(function() {
            datos.necesidades.push($(this).val());
        });

        $form.find('input[name="personalidad[]"]:checked').each(function() {
            datos.personalidad.push($(this).val());
        });

        // Foto
        var fotoFile = $form.find('#foto')[0];
        if (fotoFile && fotoFile.files && fotoFile.files[0]) {
            // Subir foto primero, luego enviar datos
            subirFoto(fotoFile.files[0], function(fotoUrl) {
                datos.foto_url = fotoUrl;
                enviarDatos($form, datos);
            });
        } else {
            enviarDatos($form, datos);
        }
    }

    function enviarDatos($form, datos) {
        var $loading = $form.find('.duendes-form-loading');
        var $pasos = $form.find('.duendes-form-paso');

        $pasos.hide();
        $loading.show();

        $.ajax({
            url: duendesCanal.ajaxUrl,
            method: 'POST',
            data: {
                action: 'duendes_guardar_formulario_v2',
                nonce: duendesCanal.nonce,
                order_id: $form.closest('[data-order]').data('order'),
                guardian_id: $form.data('guardian'),
                datos: datos
            },
            success: function(response) {
                $loading.hide();

                if (response.success) {
                    $('.duendes-exito').show();
                    $form.hide();
                } else {
                    alert(response.data.message || duendesCanal.strings.error);
                    $pasos.first().show();
                }
            },
            error: function() {
                $loading.hide();
                alert(duendesCanal.strings.error);
                $pasos.first().show();
            }
        });
    }

    /**
     * Subir foto
     */
    function subirFoto(file, callback) {
        var formData = new FormData();
        formData.append('action', 'duendes_subir_foto');
        formData.append('nonce', duendesCanal.nonce);
        formData.append('foto', file);

        $.ajax({
            url: duendesCanal.ajaxUrl,
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    callback(response.data.url);
                } else {
                    callback(null);
                }
            },
            error: function() {
                callback(null);
            }
        });
    }

    /**
     * Preview de foto
     */
    function initFotoUpload() {
        $(document).on('click', '.foto-upload', function() {
            $(this).find('input[type="file"]').click();
        });

        $(document).on('change', '.foto-upload input[type="file"]', function() {
            var file = this.files[0];
            var $preview = $(this).siblings('.foto-preview');

            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    $preview.html('<img src="' + e.target.result + '" alt="Preview">');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    /**
     * Multi-guardian
     */
    function initMultiGuardian() {
        // Todos para la misma persona o diferentes
        $('.btn-multi').on('click', function() {
            var multi = $(this).data('multi');

            $('.multi-guardian-pregunta').hide();

            if (multi === 'si') {
                // Mostrar formulario unico
                $('.formulario-container').show();
            } else {
                // Mostrar asignacion por guardian
                $('.multi-guardian-asignar').show();
            }
        });

        // Continuar despues de asignar
        $('.btn-continuar-multi').on('click', function() {
            // Verificar que todos tengan tipo asignado
            var todosAsignados = true;
            $('.guardian-tipo-select').each(function() {
                if (!$(this).val()) {
                    $(this).css('border-color', '#e74c3c');
                    todosAsignados = false;
                } else {
                    $(this).css('border-color', '');
                }
            });

            if (!todosAsignados) {
                return;
            }

            // Crear formularios para cada guardian
            crearFormulariosMulti();
        });
    }

    function crearFormulariosMulti() {
        // TODO: Implementar creacion dinamica de formularios multiples
        // Por ahora, mostrar el primero
        $('.multi-guardian-asignar').hide();
        $('.formulario-container').show();
    }

    /**
     * Enviar email para completar despues
     */
    function enviarEmailDespues() {
        var orderId = $('.duendes-thankyou-form').data('order');

        $.ajax({
            url: duendesCanal.ajaxUrl,
            method: 'POST',
            data: {
                action: 'duendes_enviar_link_formulario',
                nonce: duendesCanal.nonce,
                order_id: orderId
            }
        });
    }

})(jQuery);
