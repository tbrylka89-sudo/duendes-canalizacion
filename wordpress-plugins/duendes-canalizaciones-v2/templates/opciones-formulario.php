<?php
/**
 * Template: Opciones de formulario en Thank You page
 */

if (!defined('ABSPATH')) exit;
?>

<div class="duendes-thankyou-form" data-order="<?php echo esc_attr($order_id); ?>">

    <div class="duendes-intro">
        <h2><?php echo count($guardianes) > 1 ? 'Tus guardianes quieren conocerte' : 'Tu guardian quiere conocerte'; ?></h2>
        <p>Para que la canalizacion sea realmente personal, necesitamos que nos cuentes un poco de vos.</p>
    </div>

    <!-- Opcion: Ahora o Despues -->
    <div class="duendes-opciones-cuando">
        <button type="button" class="opcion-btn opcion-ahora active" data-opcion="ahora">
            <span class="opcion-icono">&#9889;</span>
            <span class="opcion-titulo">Completar ahora</span>
            <span class="opcion-desc">Solo toma 2 minutos</span>
        </button>
        <button type="button" class="opcion-btn opcion-despues" data-opcion="despues">
            <span class="opcion-icono">&#9993;</span>
            <span class="opcion-titulo">Completar despues</span>
            <span class="opcion-desc">Te enviamos un link por email</span>
        </button>
    </div>

    <!-- Panel: Completar ahora -->
    <div class="duendes-panel-ahora">
        <?php if (count($guardianes) > 1): ?>
            <!-- Multi-guardian -->
            <div class="multi-guardian-pregunta">
                <h3>Compraste <?php echo count($guardianes); ?> guardianes</h3>
                <p>Todos son para la misma persona?</p>
                <div class="multi-opciones">
                    <button type="button" class="btn-multi" data-multi="si">Si, todos para mi</button>
                    <button type="button" class="btn-multi" data-multi="no">No, son para diferentes personas</button>
                </div>
            </div>

            <!-- Si son para diferentes personas -->
            <div class="multi-guardian-asignar" style="display:none;">
                <h3>Para quien es cada guardian?</h3>
                <?php foreach ($guardianes as $i => $guardian): ?>
                <div class="guardian-asignar" data-guardian="<?php echo esc_attr($guardian['id']); ?>">
                    <div class="guardian-info">
                        <?php if ($guardian['imagen']): ?>
                            <img src="<?php echo esc_url($guardian['imagen']); ?>" alt="">
                        <?php endif; ?>
                        <span class="guardian-nombre"><?php echo esc_html($guardian['nombre']); ?></span>
                    </div>
                    <select name="tipo_guardian_<?php echo $guardian['id']; ?>" class="guardian-tipo-select">
                        <option value="">Seleccionar...</option>
                        <option value="para_mi">Para mi</option>
                        <option value="regalo_sabe">Regalo (la persona lo sabe)</option>
                        <option value="regalo_sorpresa">Regalo sorpresa</option>
                        <option value="para_nino">Para un menor de edad</option>
                    </select>
                </div>
                <?php endforeach; ?>
                <button type="button" class="btn-continuar-multi">Continuar</button>
            </div>
        <?php endif; ?>

        <!-- Formulario segun tipo -->
        <div class="formulario-container">
            <?php
            // Si es un solo guardian o todos para la misma persona
            if (count($guardianes) === 1) {
                echo Duendes_Canal_Formulario::render($order_id, $guardianes[0], $tipo ?: 'para_mi');
            }
            ?>
        </div>
    </div>

    <!-- Panel: Completar despues -->
    <div class="duendes-panel-despues" style="display:none;">
        <div class="despues-mensaje">
            <span class="icono-email">&#9993;</span>
            <h3>Te enviamos un email</h3>
            <p>Revisa tu casilla de <strong><?php echo esc_html($order->get_billing_email()); ?></strong></p>
            <p class="nota">El link es valido por 7 dias. Mientras mas pronto completes el formulario, mas rapido recibiras tu canalizacion.</p>
        </div>
        <button type="button" class="btn-cambiar-ahora">Mejor lo completo ahora</button>
    </div>

    <!-- Mensaje de exito -->
    <div class="duendes-exito" style="display:none;">
        <span class="icono-check">&#10003;</span>
        <h3>Tus respuestas fueron guardadas</h3>
        <p>Tu guardian ya te conoce. En las proximas horas recibiras tu canalizacion personal.</p>
    </div>

</div>

<style>
.duendes-thankyou-form {
    max-width: 600px;
    margin: 30px auto;
    font-family: 'Cormorant Garamond', Georgia, serif;
}

.duendes-intro {
    text-align: center;
    margin-bottom: 30px;
}

.duendes-intro h2 {
    font-family: 'Cinzel', serif;
    color: #c9a227;
    font-size: 28px;
    margin-bottom: 10px;
}

.duendes-opciones-cuando {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
}

.opcion-btn {
    flex: 1;
    padding: 20px;
    border: 2px solid #ddd;
    background: #fff;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    transition: all 0.3s;
}

.opcion-btn:hover,
.opcion-btn.active {
    border-color: #c9a227;
    background: #fffef5;
}

.opcion-icono {
    font-size: 30px;
    display: block;
    margin-bottom: 10px;
}

.opcion-titulo {
    display: block;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 5px;
}

.opcion-desc {
    font-size: 13px;
    color: #666;
}

.multi-guardian-pregunta,
.multi-guardian-asignar {
    background: #f9f6f0;
    padding: 25px;
    border-radius: 10px;
    margin-bottom: 20px;
}

.multi-opciones {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.btn-multi {
    flex: 1;
    padding: 15px;
    border: 2px solid #c9a227;
    background: #fff;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
}

.btn-multi:hover {
    background: #c9a227;
    color: #fff;
}

.guardian-asignar {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 10px;
}

.guardian-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
}

.guardian-info img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
}

.guardian-tipo-select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    min-width: 200px;
}

.btn-continuar-multi {
    width: 100%;
    padding: 15px;
    background: #c9a227;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 15px;
}

.despues-mensaje {
    text-align: center;
    padding: 40px 20px;
    background: #f0f7ff;
    border-radius: 10px;
}

.icono-email {
    font-size: 50px;
    display: block;
    margin-bottom: 15px;
}

.btn-cambiar-ahora {
    display: block;
    margin: 20px auto 0;
    padding: 10px 20px;
    background: transparent;
    border: 1px solid #666;
    border-radius: 5px;
    cursor: pointer;
}

.duendes-exito {
    text-align: center;
    padding: 50px 20px;
    background: #f0fff0;
    border-radius: 10px;
}

.icono-check {
    font-size: 60px;
    color: #5cb85c;
    display: block;
    margin-bottom: 15px;
}
</style>
