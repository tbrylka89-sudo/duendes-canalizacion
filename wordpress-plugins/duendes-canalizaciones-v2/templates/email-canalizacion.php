<?php
/**
 * Template: Email de Canalizacion
 *
 * Variables disponibles:
 * - $nombre_cliente
 * - $guardian_nombre
 * - $guardian_categoria
 * - $contenido (la canalizacion)
 * - $foto_guardian_url
 */

if (!defined('ABSPATH')) exit;
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tu Canalizacion - <?php echo esc_html($guardian_nombre); ?></title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Georgia, 'Times New Roman', serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">

                <!-- Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1a1a; border-radius: 15px; overflow: hidden;">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 30px; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);">
                            <?php if ($foto_guardian_url): ?>
                            <img src="<?php echo esc_url($foto_guardian_url); ?>" alt="<?php echo esc_attr($guardian_nombre); ?>"
                                 style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #c9a227; margin-bottom: 20px;">
                            <?php endif; ?>

                            <h1 style="color: #c9a227; font-family: 'Cinzel', Georgia, serif; font-size: 28px; margin: 0 0 10px; letter-spacing: 2px;">
                                <?php echo esc_html($guardian_nombre); ?>
                            </h1>
                            <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
                                Guardian de <?php echo esc_html($guardian_categoria); ?>
                            </p>
                        </td>
                    </tr>

                    <!-- Saludo -->
                    <tr>
                        <td style="padding: 30px 40px 0;">
                            <p style="color: rgba(255,255,255,0.85); font-size: 18px; line-height: 1.6; margin: 0;">
                                <?php echo esc_html($nombre_cliente); ?>,
                            </p>
                        </td>
                    </tr>

                    <!-- Contenido de la Canalizacion -->
                    <tr>
                        <td style="padding: 20px 40px 40px;">
                            <div style="color: rgba(255,255,255,0.85); font-size: 16px; line-height: 1.8; white-space: pre-wrap;">
<?php echo nl2br(esc_html($contenido)); ?>
                            </div>
                        </td>
                    </tr>

                    <!-- Separador -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <hr style="border: none; border-top: 1px solid rgba(201,162,39,0.3); margin: 0;">
                        </td>
                    </tr>

                    <!-- Certificado CTA -->
                    <tr>
                        <td align="center" style="padding: 30px 40px;">
                            <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0 0 20px;">
                                Tu certificado de adopcion esta disponible
                            </p>
                            <a href="<?php echo esc_url(home_url('/mi-magia/')); ?>"
                               style="display: inline-block; background: linear-gradient(135deg, #c9a227 0%, #e8d48b 100%); color: #0a0a0a; text-decoration: none; padding: 15px 35px; border-radius: 8px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                                Ver Mi Magia
                            </a>
                        </td>
                    </tr>

                    <!-- Disclaimer -->
                    <tr>
                        <td style="padding: 20px 40px; background: rgba(0,0,0,0.3);">
                            <p style="color: rgba(255,255,255,0.4); font-size: 12px; line-height: 1.6; margin: 0; text-align: center;">
                                Esta canalizacion es un mensaje de tu guardian, canalizado especialmente para vos.
                                Es un acompanamiento espiritual y no reemplaza consejo medico o profesional.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 30px; background: #0a0a0a;">
                            <p style="color: #c9a227; font-size: 16px; margin: 0 0 10px; font-family: 'Cinzel', Georgia, serif;">
                                Duendes del Uruguay
                            </p>
                            <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">
                                Donde la magia encuentra hogar
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>
</body>
</html>
