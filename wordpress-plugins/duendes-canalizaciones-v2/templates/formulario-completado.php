<?php
/**
 * Template: Mensaje de exito al completar formulario
 *
 * Variables disponibles:
 * - $guardian (array con datos del guardian)
 * - $tipo (para_mi, regalo_sabe, regalo_sorpresa, para_nino)
 * - $nombre_cliente
 */

if (!defined('ABSPATH')) exit;

$mensajes = array(
    'para_mi' => array(
        'titulo' => 'Tu guardian ya te conoce',
        'mensaje' => 'Gracias por compartir tu historia. ' . esc_html($guardian['nombre']) . ' ahora sabe quien sos y que necesitas. En las proximas horas recibiras tu canalizacion personal.',
        'icono' => '&#10024;' // sparkles
    ),
    'regalo_sabe' => array(
        'titulo' => 'Invitacion enviada',
        'mensaje' => 'Le enviamos un email especial a la persona que va a recibir este regalo. Cuando complete el formulario, generaremos su canalizacion personal.',
        'icono' => '&#9993;' // envelope
    ),
    'regalo_sorpresa' => array(
        'titulo' => 'Sorpresa preparada',
        'mensaje' => 'Gracias por contarnos sobre esa persona especial. ' . esc_html($guardian['nombre']) . ' va a usar tu amor como puente para conectar con ella.',
        'icono' => '&#127873;' // gift
    ),
    'para_nino' => array(
        'titulo' => 'Amigo magico en camino',
        'mensaje' => esc_html($guardian['nombre']) . ' esta muy emocionado de conocer a su nuevo amigo/a. La canalizacion sera especial, escrita para que un nino la entienda.',
        'icono' => '&#11088;' // star
    )
);

$config = $mensajes[$tipo] ?? $mensajes['para_mi'];
?>

<div class="duendes-completado">
    <div class="completado-icono"><?php echo $config['icono']; ?></div>

    <h2 class="completado-titulo"><?php echo esc_html($config['titulo']); ?></h2>

    <div class="completado-guardian">
        <?php if (!empty($guardian['imagen'])): ?>
        <img src="<?php echo esc_url($guardian['imagen']); ?>" alt="<?php echo esc_attr($guardian['nombre']); ?>">
        <?php endif; ?>
        <span><?php echo esc_html($guardian['nombre']); ?></span>
    </div>

    <p class="completado-mensaje"><?php echo $config['mensaje']; ?></p>

    <div class="completado-pasos">
        <h4>Que sigue ahora:</h4>
        <ol>
            <li>
                <span class="paso-icono">&#9998;</span>
                <span class="paso-texto">Generamos tu canalizacion personal</span>
            </li>
            <li>
                <span class="paso-icono">&#128270;</span>
                <span class="paso-texto">La revisamos para asegurarnos que sea perfecta</span>
            </li>
            <li>
                <span class="paso-icono">&#9993;</span>
                <span class="paso-texto">Te la enviamos por email</span>
            </li>
            <li>
                <span class="paso-icono">&#128230;</span>
                <span class="paso-texto">Tu guardian llega fisicamente a tu hogar</span>
            </li>
        </ol>
    </div>

    <p class="completado-nota">
        Mientras tanto, podes visitar <a href="<?php echo esc_url(home_url('/mi-magia/')); ?>">Mi Magia</a>
        para ver el estado de tu pedido.
    </p>
</div>

<style>
.duendes-completado {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
    padding: 40px 20px;
    font-family: 'Cormorant Garamond', Georgia, serif;
}

.completado-icono {
    font-size: 60px;
    margin-bottom: 20px;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.completado-titulo {
    font-family: 'Cinzel', serif;
    font-size: 28px;
    color: #c9a227;
    margin: 0 0 25px;
}

.completado-guardian {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    background: #f9f6f0;
    padding: 15px 25px;
    border-radius: 30px;
    margin-bottom: 25px;
}

.completado-guardian img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #c9a227;
}

.completado-guardian span {
    font-weight: 600;
    font-size: 18px;
}

.completado-mensaje {
    font-size: 18px;
    line-height: 1.6;
    color: #444;
    margin-bottom: 30px;
}

.completado-pasos {
    background: #fff;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    text-align: left;
    margin-bottom: 25px;
}

.completado-pasos h4 {
    font-family: 'Cinzel', serif;
    margin: 0 0 15px;
    font-size: 16px;
    color: #333;
}

.completado-pasos ol {
    list-style: none;
    margin: 0;
    padding: 0;
    counter-reset: pasos;
}

.completado-pasos li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    counter-increment: pasos;
}

.completado-pasos li:last-child {
    border-bottom: none;
}

.paso-icono {
    width: 30px;
    height: 30px;
    background: rgba(201, 162, 39, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}

.paso-texto {
    flex: 1;
    font-size: 15px;
    color: #555;
}

.completado-nota {
    font-size: 14px;
    color: #888;
}

.completado-nota a {
    color: #c9a227;
    text-decoration: none;
}

.completado-nota a:hover {
    text-decoration: underline;
}
</style>
