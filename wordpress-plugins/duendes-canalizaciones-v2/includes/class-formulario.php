<?php
/**
 * Formulario Multi-Paso para Canalizaciones
 */

if (!defined('ABSPATH')) exit;

class Duendes_Canal_Formulario {

    /**
     * Necesidades disponibles por categoria
     */
    public static function get_necesidades() {
        return [
            'proteccion' => 'Proteccion - Sentirme segura',
            'claridad' => 'Claridad - Saber que hacer',
            'abundancia' => 'Abundancia - Desbloquear lo que merezco',
            'sanacion' => 'Sanacion - Soltar lo que me pesa',
            'amor' => 'Amor - Conexion genuina',
            'fuerza' => 'Fuerza - Seguir adelante',
            'paz' => 'Paz - Calma interior',
            'confianza' => 'Confianza - Creer en mi',
        ];
    }

    /**
     * Personalidades disponibles
     */
    public static function get_personalidades() {
        return [
            'sensible' => 'Sensible',
            'fuerte' => 'Fuerte',
            'sonadora' => 'Sonadora',
            'practica' => 'Practica',
            'reservada' => 'Reservada',
            'expresiva' => 'Expresiva',
            'luchadora' => 'Luchadora',
            'tranquila' => 'Tranquila',
            'creativa' => 'Creativa',
            'curiosa' => 'Curiosa',
        ];
    }

    /**
     * Relaciones para regalo
     */
    public static function get_relaciones() {
        return [
            'pareja' => 'Pareja',
            'mama' => 'Mama',
            'papa' => 'Papa',
            'hermana' => 'Hermana/o',
            'hija' => 'Hija/o',
            'amiga' => 'Amiga/o',
            'otro' => 'Otro',
        ];
    }

    /**
     * Rangos de edad para ninos
     */
    public static function get_edades_nino() {
        return [
            '3-6' => '3 a 6 anos',
            '7-10' => '7 a 10 anos',
            '11-14' => '11 a 14 anos',
            '15-17' => '15 a 17 anos',
        ];
    }

    /**
     * Necesidades para ninos
     */
    public static function get_necesidades_nino() {
        return [
            'miedos' => 'Miedos nocturnos',
            'cambios' => 'Cambios en la familia',
            'escuela' => 'Dificultades en la escuela',
            'confianza' => 'Necesita confianza',
            'sensible' => 'Esta muy sensible',
            'amigo' => 'Solo quiero que tenga un amigo magico',
        ];
    }

    /**
     * Render formulario completo segun tipo
     */
    public static function render($order_id, $guardian, $tipo = 'para_mi') {
        $method = "render_via_" . str_replace('-', '_', $tipo);

        if (method_exists(self::class, $method)) {
            return self::$method($order_id, $guardian);
        }

        return self::render_via_para_mi($order_id, $guardian);
    }

    /**
     * VIA 1: Para mi
     */
    private static function render_via_para_mi($order_id, $guardian) {
        ob_start();
        ?>
        <div class="duendes-form" data-tipo="para_mi" data-order="<?php echo esc_attr($order_id); ?>" data-guardian="<?php echo esc_attr($guardian['id']); ?>">

            <!-- Paso 1: Nombre -->
            <div class="duendes-form-paso" data-paso="1">
                <div class="paso-header">
                    <span class="paso-numero">1 de 5</span>
                    <h3>Tu guardian quiere conocerte</h3>
                    <p class="paso-subtitulo">No hay respuestas correctas - solo tu verdad.</p>
                </div>
                <div class="paso-contenido">
                    <label for="nombre">Como te llamas? (o como te gustaria que te llame)</label>
                    <input type="text" id="nombre" name="nombre" required placeholder="Tu nombre...">
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-siguiente">Siguiente</button>
                </div>
            </div>

            <!-- Paso 2: Momento -->
            <div class="duendes-form-paso" data-paso="2" style="display:none;">
                <div class="paso-header">
                    <span class="paso-numero">2 de 5</span>
                    <h3>Contanos sobre vos</h3>
                </div>
                <div class="paso-contenido">
                    <label for="momento">Que momento de tu vida estas atravesando?</label>
                    <textarea id="momento" name="momento" rows="4" placeholder="Un cambio, una perdida, un nuevo comienzo, una busqueda..."></textarea>
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-anterior">Anterior</button>
                    <button type="button" class="btn-siguiente">Siguiente</button>
                </div>
            </div>

            <!-- Paso 3: Necesidades -->
            <div class="duendes-form-paso" data-paso="3" style="display:none;">
                <div class="paso-header">
                    <span class="paso-numero">3 de 5</span>
                    <h3>A veces lo que mas necesitamos es lo que mas nos cuesta pedir</h3>
                </div>
                <div class="paso-contenido">
                    <label>Que necesitas en este momento? (podes elegir varias)</label>
                    <div class="opciones-grid">
                        <?php foreach (self::get_necesidades() as $key => $label): ?>
                            <label class="opcion-checkbox">
                                <input type="checkbox" name="necesidades[]" value="<?php echo esc_attr($key); ?>">
                                <span><?php echo esc_html($label); ?></span>
                            </label>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-anterior">Anterior</button>
                    <button type="button" class="btn-siguiente">Siguiente</button>
                </div>
            </div>

            <!-- Paso 4: Mensaje -->
            <div class="duendes-form-paso" data-paso="4" style="display:none;">
                <div class="paso-header">
                    <span class="paso-numero">4 de 5</span>
                    <h3>Si pudieras decirle algo a alguien que realmente te escucha...</h3>
                </div>
                <div class="paso-contenido">
                    <label for="mensaje">Hay algo que tu guardian deberia saber? (opcional)</label>
                    <textarea id="mensaje" name="mensaje" rows="4" placeholder="Algo que no le contas a nadie, algo que te pesa, algo que sonas..."></textarea>
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-anterior">Anterior</button>
                    <button type="button" class="btn-siguiente">Siguiente</button>
                </div>
            </div>

            <!-- Paso 5: Foto -->
            <div class="duendes-form-paso" data-paso="5" style="display:none;">
                <div class="paso-header">
                    <span class="paso-numero">5 de 5</span>
                    <h3>Una imagen ayuda a tu guardian a reconocerte</h3>
                </div>
                <div class="paso-contenido">
                    <div class="foto-upload">
                        <input type="file" id="foto" name="foto" accept="image/*">
                        <div class="foto-preview"></div>
                        <p class="foto-nota">No es obligatorio, pero hace la conexion mas profunda.</p>
                    </div>
                    <label class="opcion-checkbox mayor-18">
                        <input type="checkbox" name="es_mayor_18" value="1" required>
                        <span>Confirmo que soy mayor de 18 anos</span>
                    </label>
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-anterior">Anterior</button>
                    <button type="submit" class="btn-enviar">Completar conexion</button>
                </div>
            </div>

            <input type="hidden" name="tipo" value="para_mi">
            <div class="duendes-form-loading" style="display:none;">
                <div class="spinner"></div>
                <p>Guardando tu conexion...</p>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * VIA 2: Regalo que sabe
     */
    private static function render_via_regalo_sabe($order_id, $guardian) {
        ob_start();
        ?>
        <div class="duendes-form" data-tipo="regalo_sabe" data-order="<?php echo esc_attr($order_id); ?>" data-guardian="<?php echo esc_attr($guardian['id']); ?>">

            <div class="duendes-form-paso" data-paso="1">
                <div class="paso-header">
                    <span class="paso-numero">1 de 2</span>
                    <h3>Que lindo regalar magia</h3>
                    <p class="paso-subtitulo"><?php echo esc_html($guardian['nombre']); ?> esta listo para conocer a quien lo recibira.</p>
                </div>
                <div class="paso-contenido">
                    <label for="nombre_destinatario">Como se llama la persona que lo recibira?</label>
                    <input type="text" id="nombre_destinatario" name="nombre_destinatario" required>

                    <label for="email_destinatario">Cual es su email?</label>
                    <input type="email" id="email_destinatario" name="email_destinatario" required placeholder="Le enviaremos un formulario especial">
                    <p class="campo-nota">No le diremos que guardian elegiste - sera una sorpresa parcial.</p>
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-siguiente">Siguiente</button>
                </div>
            </div>

            <div class="duendes-form-paso" data-paso="2" style="display:none;">
                <div class="paso-header">
                    <span class="paso-numero">2 de 2</span>
                    <h3>Queres incluir un mensaje personal?</h3>
                </div>
                <div class="paso-contenido">
                    <label for="mensaje">Tu mensaje (opcional)</label>
                    <textarea id="mensaje" name="mensaje" rows="4" placeholder="Unas palabras tuyas que acompanen el regalo..."></textarea>
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-anterior">Anterior</button>
                    <button type="submit" class="btn-enviar">Enviar invitacion magica</button>
                </div>
            </div>

            <input type="hidden" name="tipo" value="regalo_sabe">
            <div class="duendes-form-loading" style="display:none;">
                <div class="spinner"></div>
                <p>Enviando invitacion...</p>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * VIA 3: Regalo sorpresa
     */
    private static function render_via_regalo_sorpresa($order_id, $guardian) {
        ob_start();
        ?>
        <div class="duendes-form" data-tipo="regalo_sorpresa" data-order="<?php echo esc_attr($order_id); ?>" data-guardian="<?php echo esc_attr($guardian['id']); ?>">

            <!-- Paso 1: Vinculo -->
            <div class="duendes-form-paso" data-paso="1">
                <div class="paso-header">
                    <span class="paso-numero">1 de 5</span>
                    <h3>Conoces a esta persona. Eso es valioso.</h3>
                </div>
                <div class="paso-contenido">
                    <label for="nombre_destinatario">Como se llama?</label>
                    <input type="text" id="nombre_destinatario" name="nombre_destinatario" required>

                    <label>Cual es tu relacion con ella/el?</label>
                    <div class="opciones-inline">
                        <?php foreach (self::get_relaciones() as $key => $label): ?>
                            <label class="opcion-radio">
                                <input type="radio" name="relacion" value="<?php echo esc_attr($key); ?>">
                                <span><?php echo esc_html($label); ?></span>
                            </label>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-siguiente">Siguiente</button>
                </div>
            </div>

            <!-- Paso 2: Su momento -->
            <div class="duendes-form-paso" data-paso="2" style="display:none;">
                <div class="paso-header">
                    <span class="paso-numero">2 de 5</span>
                    <h3>Pensa en <span class="nombre-destinatario"></span>. Que ves?</h3>
                </div>
                <div class="paso-contenido">
                    <label for="momento">Que momento esta atravesando?</label>
                    <textarea id="momento" name="momento" rows="3" placeholder="Una separacion, un duelo, un logro, una crisis..."></textarea>

                    <label for="mensaje_tuyo">Que crees que necesita escuchar?</label>
                    <textarea id="mensaje_tuyo" name="mensaje_tuyo" rows="3" placeholder="Algo que vos le dirias si pudieras..."></textarea>
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-anterior">Anterior</button>
                    <button type="button" class="btn-siguiente">Siguiente</button>
                </div>
            </div>

            <!-- Paso 3: Personalidad -->
            <div class="duendes-form-paso" data-paso="3" style="display:none;">
                <div class="paso-header">
                    <span class="paso-numero">3 de 5</span>
                    <h3>Ayudanos a conocerla/o un poco mas</h3>
                </div>
                <div class="paso-contenido">
                    <label>Como describirias su personalidad? (elegir hasta 3)</label>
                    <div class="opciones-grid max-3">
                        <?php foreach (self::get_personalidades() as $key => $label): ?>
                            <label class="opcion-checkbox">
                                <input type="checkbox" name="personalidad[]" value="<?php echo esc_attr($key); ?>">
                                <span><?php echo esc_html($label); ?></span>
                            </label>
                        <?php endforeach; ?>
                    </div>

                    <label for="pasion">Que le hace brillar los ojos?</label>
                    <input type="text" id="pasion" name="pasion" placeholder="Que la apasiona, que la hace feliz?">
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-anterior">Anterior</button>
                    <button type="button" class="btn-siguiente">Siguiente</button>
                </div>
            </div>

            <!-- Paso 4: Foto y mensaje -->
            <div class="duendes-form-paso" data-paso="4" style="display:none;">
                <div class="paso-header">
                    <span class="paso-numero">4 de 5</span>
                    <h3>Si tenes una foto, ayuda</h3>
                    <p class="paso-subtitulo">Si no, el amor que pones ya dice mucho.</p>
                </div>
                <div class="paso-contenido">
                    <div class="foto-upload">
                        <input type="file" id="foto" name="foto" accept="image/*">
                        <div class="foto-preview"></div>
                    </div>
                    <label class="opcion-checkbox mayor-18">
                        <input type="checkbox" name="es_mayor_18" value="1">
                        <span>Confirmo que la persona es mayor de 18 anos</span>
                    </label>
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-anterior">Anterior</button>
                    <button type="button" class="btn-siguiente">Siguiente</button>
                </div>
            </div>

            <!-- Paso 5: Mensaje personal -->
            <div class="duendes-form-paso" data-paso="5" style="display:none;">
                <div class="paso-header">
                    <span class="paso-numero">5 de 5</span>
                    <h3>Queres incluir un mensaje tuyo?</h3>
                </div>
                <div class="paso-contenido">
                    <label for="mensaje">Tu mensaje personal</label>
                    <textarea id="mensaje" name="mensaje" rows="4" placeholder="Unas palabras que acompanen el regalo..."></textarea>

                    <label class="opcion-checkbox">
                        <input type="checkbox" name="anonimo" value="1">
                        <span>Prefiero que sea anonimo</span>
                    </label>
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-anterior">Anterior</button>
                    <button type="submit" class="btn-enviar">Completar</button>
                </div>
            </div>

            <input type="hidden" name="tipo" value="regalo_sorpresa">
            <div class="duendes-form-loading" style="display:none;">
                <div class="spinner"></div>
                <p>Guardando...</p>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * VIA 4: Para menor
     */
    private static function render_via_para_nino($order_id, $guardian) {
        ob_start();
        ?>
        <div class="duendes-form" data-tipo="para_nino" data-order="<?php echo esc_attr($order_id); ?>" data-guardian="<?php echo esc_attr($guardian['id']); ?>">

            <!-- Paso 1: Identificacion -->
            <div class="duendes-form-paso" data-paso="1">
                <div class="paso-header">
                    <span class="paso-numero">1 de 4</span>
                    <h3>Los guardianes aman a los pequenos</h3>
                </div>
                <div class="paso-contenido">
                    <label for="nombre_nino">Como se llama el nino/a?</label>
                    <input type="text" id="nombre_nino" name="nombre_destinatario" required>

                    <label>Que edad tiene?</label>
                    <div class="opciones-inline">
                        <?php foreach (self::get_edades_nino() as $key => $label): ?>
                            <label class="opcion-radio">
                                <input type="radio" name="edad_nino" value="<?php echo esc_attr($key); ?>">
                                <span><?php echo esc_html($label); ?></span>
                            </label>
                        <?php endforeach; ?>
                    </div>

                    <label>Cual es tu relacion?</label>
                    <div class="opciones-inline">
                        <label class="opcion-radio"><input type="radio" name="relacion" value="mama"><span>Mama</span></label>
                        <label class="opcion-radio"><input type="radio" name="relacion" value="papa"><span>Papa</span></label>
                        <label class="opcion-radio"><input type="radio" name="relacion" value="abuelo"><span>Abuela/o</span></label>
                        <label class="opcion-radio"><input type="radio" name="relacion" value="tio"><span>Tia/o</span></label>
                        <label class="opcion-radio"><input type="radio" name="relacion" value="padrino"><span>Madrina/Padrino</span></label>
                        <label class="opcion-radio"><input type="radio" name="relacion" value="otro"><span>Otro</span></label>
                    </div>
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-siguiente">Siguiente</button>
                </div>
            </div>

            <!-- Paso 2: Su mundo -->
            <div class="duendes-form-paso" data-paso="2" style="display:none;">
                <div class="paso-header">
                    <span class="paso-numero">2 de 4</span>
                    <h3>Contanos sobre <span class="nombre-destinatario"></span></h3>
                </div>
                <div class="paso-contenido">
                    <label>Como describirias su personalidad?</label>
                    <div class="opciones-grid">
                        <label class="opcion-checkbox"><input type="checkbox" name="personalidad[]" value="timido"><span>Timido/a</span></label>
                        <label class="opcion-checkbox"><input type="checkbox" name="personalidad[]" value="sociable"><span>Sociable</span></label>
                        <label class="opcion-checkbox"><input type="checkbox" name="personalidad[]" value="sensible"><span>Sensible</span></label>
                        <label class="opcion-checkbox"><input type="checkbox" name="personalidad[]" value="aventurero"><span>Aventurero/a</span></label>
                        <label class="opcion-checkbox"><input type="checkbox" name="personalidad[]" value="creativo"><span>Creativo/a</span></label>
                        <label class="opcion-checkbox"><input type="checkbox" name="personalidad[]" value="curioso"><span>Curioso/a</span></label>
                        <label class="opcion-checkbox"><input type="checkbox" name="personalidad[]" value="tranquilo"><span>Tranquilo/a</span></label>
                    </div>

                    <label for="gustos">Que le gusta hacer?</label>
                    <input type="text" id="gustos" name="gustos" placeholder="Dibujar, jugar, leer, los animales...">
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-anterior">Anterior</button>
                    <button type="button" class="btn-siguiente">Siguiente</button>
                </div>
            </div>

            <!-- Paso 3: Necesidades -->
            <div class="duendes-form-paso" data-paso="3" style="display:none;">
                <div class="paso-header">
                    <span class="paso-numero">3 de 4</span>
                    <h3>A veces los adultos vemos cosas que los ninos no saben expresar</h3>
                </div>
                <div class="paso-contenido">
                    <label>Hay algo que este atravesando o necesite?</label>
                    <div class="opciones-grid">
                        <?php foreach (self::get_necesidades_nino() as $key => $label): ?>
                            <label class="opcion-checkbox">
                                <input type="checkbox" name="necesidades[]" value="<?php echo esc_attr($key); ?>">
                                <span><?php echo esc_html($label); ?></span>
                            </label>
                        <?php endforeach; ?>
                    </div>

                    <label for="mensaje">Algo mas que el guardian deberia saber? (opcional)</label>
                    <textarea id="mensaje" name="mensaje" rows="3"></textarea>
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-anterior">Anterior</button>
                    <button type="button" class="btn-siguiente">Siguiente</button>
                </div>
            </div>

            <!-- Paso 4: Confirmacion (SIN FOTO) -->
            <div class="duendes-form-paso" data-paso="4" style="display:none;">
                <div class="paso-header">
                    <span class="paso-numero">4 de 4</span>
                    <h3>Protegemos a los mas pequenos</h3>
                </div>
                <div class="paso-contenido">
                    <div class="aviso-importante">
                        <p>Para proteger a los mas pequenos, <strong>no pedimos fotos de menores</strong>.</p>
                        <p>El guardian se conectara a traves de tu amor y lo que nos contaste.</p>
                    </div>
                    <label class="opcion-checkbox">
                        <input type="checkbox" name="confirmo" value="1" required>
                        <span>Entiendo y confirmo</span>
                    </label>
                </div>
                <div class="paso-acciones">
                    <button type="button" class="btn-anterior">Anterior</button>
                    <button type="submit" class="btn-enviar">Completar</button>
                </div>
            </div>

            <input type="hidden" name="tipo" value="para_nino">
            <div class="duendes-form-loading" style="display:none;">
                <div class="spinner"></div>
                <p>Guardando...</p>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
