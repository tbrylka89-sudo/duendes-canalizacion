<?php
/**
 * Plugin Name: Duendes - Modo Mantenimiento Mágico
 * Description: Página mágica de "En construcción" para Duendes del Uruguay
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

class DuendesMantenimiento {

    public function __construct() {
        add_action('template_redirect', [$this, 'mostrar_pagina_mantenimiento']);
        add_action('admin_menu', [$this, 'agregar_menu_admin']);
        add_action('admin_init', [$this, 'registrar_opciones']);
    }

    public function mostrar_pagina_mantenimiento() {
        // No mostrar si está desactivado
        if (get_option('duendes_mantenimiento_activo', '1') !== '1') {
            return;
        }

        // No mostrar a usuarios logueados
        if (is_user_logged_in()) {
            return;
        }

        // No bloquear login ni admin
        if (is_admin() || $GLOBALS['pagenow'] === 'wp-login.php') {
            return;
        }

        // Mostrar página de mantenimiento
        $this->renderizar_pagina();
        exit;
    }

    public function renderizar_pagina() {
        $titulo = get_option('duendes_mantenimiento_titulo', 'Algo mágico está por suceder...');
        $mensaje = get_option('duendes_mantenimiento_mensaje', 'Los duendes están trabajando en algo especial para vos. Muy pronto podrás descubrirlo.');

        ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo esc_html($titulo); ?> - Duendes del Uruguay</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Quattrocento+Sans&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Quattrocento Sans', sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: #e8e8e8;
            overflow: hidden;
            position: relative;
        }

        /* Estrellas de fondo */
        .stars {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        }

        .star {
            position: absolute;
            background: #fff;
            border-radius: 50%;
            animation: twinkle 3s infinite ease-in-out;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }

        /* Luciérnagas/partículas mágicas */
        .firefly {
            position: absolute;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, #ffd700 0%, transparent 70%);
            border-radius: 50%;
            animation: float 8s infinite ease-in-out;
            opacity: 0.8;
        }

        @keyframes float {
            0%, 100% {
                transform: translate(0, 0) scale(1);
                opacity: 0.4;
            }
            25% {
                transform: translate(30px, -40px) scale(1.3);
                opacity: 1;
            }
            50% {
                transform: translate(-20px, -80px) scale(0.8);
                opacity: 0.6;
            }
            75% {
                transform: translate(40px, -40px) scale(1.1);
                opacity: 0.9;
            }
        }

        .container {
            text-align: center;
            padding: 40px;
            max-width: 600px;
            z-index: 10;
            position: relative;
        }

        .logo {
            width: 120px;
            height: 120px;
            margin: 0 auto 30px;
            background: radial-gradient(circle at 30% 30%, #c9a227, #8b6914);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 60px;
            box-shadow:
                0 0 30px rgba(201, 162, 39, 0.4),
                0 0 60px rgba(201, 162, 39, 0.2),
                inset 0 0 30px rgba(255, 255, 255, 0.1);
            animation: pulse 4s infinite ease-in-out;
        }

        @keyframes pulse {
            0%, 100% {
                box-shadow:
                    0 0 30px rgba(201, 162, 39, 0.4),
                    0 0 60px rgba(201, 162, 39, 0.2);
            }
            50% {
                box-shadow:
                    0 0 50px rgba(201, 162, 39, 0.6),
                    0 0 100px rgba(201, 162, 39, 0.3);
            }
        }

        h1 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.5rem;
            font-weight: 600;
            margin-bottom: 20px;
            color: #c9a227;
            text-shadow: 0 0 20px rgba(201, 162, 39, 0.3);
        }

        p {
            font-size: 1.2rem;
            line-height: 1.8;
            color: #b8b8b8;
            margin-bottom: 30px;
        }

        .magic-line {
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #c9a227, transparent);
            margin: 30px auto;
        }

        .footer-text {
            font-family: 'Cormorant Garamond', serif;
            font-style: italic;
            font-size: 1rem;
            color: #888;
        }

        /* Cristales decorativos */
        .crystal {
            position: absolute;
            opacity: 0.1;
            font-size: 40px;
        }

        .crystal-1 { top: 10%; left: 10%; animation: float 12s infinite; }
        .crystal-2 { top: 20%; right: 15%; animation: float 15s infinite reverse; }
        .crystal-3 { bottom: 15%; left: 20%; animation: float 10s infinite; }
        .crystal-4 { bottom: 25%; right: 10%; animation: float 14s infinite reverse; }
    </style>
</head>
<body>
    <div class="stars" id="stars"></div>

    <div class="crystal crystal-1">💎</div>
    <div class="crystal crystal-2">✨</div>
    <div class="crystal crystal-3">🔮</div>
    <div class="crystal crystal-4">⭐</div>

    <div class="container">
        <div class="logo">🧝</div>

        <h1><?php echo esc_html($titulo); ?></h1>

        <div class="magic-line"></div>

        <p><?php echo nl2br(esc_html($mensaje)); ?></p>

        <div class="magic-line"></div>

        <p class="footer-text">Duendes del Uruguay</p>
    </div>

    <script>
        // Crear estrellas
        const starsContainer = document.getElementById('stars');
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.width = star.style.height = (Math.random() * 3 + 1) + 'px';
            star.style.animationDelay = Math.random() * 3 + 's';
            starsContainer.appendChild(star);
        }

        // Crear luciérnagas
        for (let i = 0; i < 15; i++) {
            const firefly = document.createElement('div');
            firefly.className = 'firefly';
            firefly.style.left = Math.random() * 100 + '%';
            firefly.style.top = Math.random() * 100 + '%';
            firefly.style.animationDelay = Math.random() * 8 + 's';
            firefly.style.animationDuration = (Math.random() * 4 + 6) + 's';
            document.body.appendChild(firefly);
        }
    </script>
</body>
</html>
        <?php
    }

    public function agregar_menu_admin() {
        add_options_page(
            'Modo Mantenimiento',
            '🧝 Mantenimiento',
            'manage_options',
            'duendes-mantenimiento',
            [$this, 'pagina_opciones']
        );
    }

    public function registrar_opciones() {
        register_setting('duendes_mantenimiento', 'duendes_mantenimiento_activo');
        register_setting('duendes_mantenimiento', 'duendes_mantenimiento_titulo');
        register_setting('duendes_mantenimiento', 'duendes_mantenimiento_mensaje');
    }

    public function pagina_opciones() {
        ?>
        <div class="wrap">
            <h1>🧝 Modo Mantenimiento Mágico</h1>
            <form method="post" action="options.php">
                <?php settings_fields('duendes_mantenimiento'); ?>
                <table class="form-table">
                    <tr>
                        <th>Estado</th>
                        <td>
                            <label>
                                <input type="checkbox" name="duendes_mantenimiento_activo" value="1"
                                    <?php checked(get_option('duendes_mantenimiento_activo', '1'), '1'); ?>>
                                Activar modo mantenimiento
                            </label>
                            <p class="description">Cuando está activo, los visitantes ven la página mágica. Vos podés ver el sitio normal porque estás logueada.</p>
                        </td>
                    </tr>
                    <tr>
                        <th>Título</th>
                        <td>
                            <input type="text" name="duendes_mantenimiento_titulo" class="regular-text"
                                value="<?php echo esc_attr(get_option('duendes_mantenimiento_titulo', 'Algo mágico está por suceder...')); ?>">
                        </td>
                    </tr>
                    <tr>
                        <th>Mensaje</th>
                        <td>
                            <textarea name="duendes_mantenimiento_mensaje" rows="4" class="large-text"><?php
                                echo esc_textarea(get_option('duendes_mantenimiento_mensaje',
                                    'Los duendes están trabajando en algo especial para vos. Muy pronto podrás descubrirlo.'));
                            ?></textarea>
                        </td>
                    </tr>
                </table>
                <?php submit_button('Guardar cambios'); ?>
            </form>

            <hr>
            <h2>Vista previa</h2>
            <p><a href="<?php echo home_url('/?preview_mantenimiento=1'); ?>" target="_blank" class="button">Ver página de mantenimiento</a></p>
        </div>
        <?php
    }
}

new DuendesMantenimiento();
