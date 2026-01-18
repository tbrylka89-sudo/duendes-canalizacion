<?php
/**
 * Plugin Name: Duendes Redirects Wix → WordPress
 * Description: Redirects 301 automáticos de URLs de Wix a WordPress para preservar SEO
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

// Evitar acceso directo
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clase principal del plugin
 */
class Duendes_Redirects_Wix {

    private static $instance = null;

    // Redirects de páginas
    private $page_redirects = array(
        'shop-1' => '/shop/',
        'stock' => '/shop/',
        'accesorios' => '/shop/',
        'cuidados' => '/como-funciona/',
        'encargue' => '/contacto/',
        'preguntas-frecuentes' => '/faq/',
        'políticas' => '/politica-de-privacidad/',
        'politicas' => '/politica-de-privacidad/',
        'plans-pricing' => '/circulo-de-duendes/',
        'loyalty' => '/circulo-de-duendes/',
        'members' => '/mi-cuenta/',
        'formulario-de-duende-maestro' => '/descubri-que-duende-te-elige/',
        'maestros' => '/descubri-que-duende-te-elige/',
        'portfolio' => '/testimonios/',
        'copia-de-info' => '/',
    );

    // Redirects de productos específicos (slug Wix => slug WP)
    private $product_redirects = array(
        'dani-tu-compañero-para-los-días-de-ansiedad' => 'dani-para-los-dias-de-ansiedad',
        'dani-tu-companero-para-los-dias-de-ansiedad' => 'dani-para-los-dias-de-ansiedad',
        'élowen' => 'elowen',
        'elowen' => 'elowen',
        'mürh' => 'murh',
        'murh' => 'murh',
        'duende-de-la-sanación-1' => 'duende-de-la-sanacion',
        'duende-de-la-sanacion-1' => 'duende-de-la-sanacion',
        'gaia' => 'gaia-2',
        'lil-el-duende-maestro-1' => 'lil',
        'cash-el-duende-del-dinero-1' => 'cash',
        'duende-compañero-2-1' => 'duende-companero',
        'duende-companero-2-1' => 'duende-companero',
        'trévor' => 'trevor-el-duende-de-la-suerte',
        'trevor' => 'trevor-el-duende-de-la-suerte',
        'estelar' => 'estelar-el-duende-de-los-deseos',
        'luke-duende-viajero' => 'luke-el-duende-viajero-protector',
        'matheo-selección-universo' => 'matheo',
        'matheo-seleccion-universo' => 'matheo',
        'rahmus-1' => 'rahmus',
        'micelio-1' => 'micelio',
        'merlin-1' => 'merlin',
        'rasiel-duende-de-la-transformación-y-éxito' => 'rasiel-duende-de-la-transformacion-y-exito',
        'rasiel-duende-de-la-transformacion-y-exito' => 'rasiel-duende-de-la-transformacion-y-exito',
        'pequeña-aldea' => 'pequena-aldea',
        'pequena-aldea' => 'pequena-aldea',
        'gran-aldea-1' => 'gran-aldea',
        'biblioteca-mágica' => 'biblioteca-magica',
        'biblioteca-magica' => 'biblioteca-magica',
        'duendes-en-tu-vida-guía-básica' => 'duendes-en-tu-vida-guia-basica',
        'duendes-en-tu-vida-guia-basica' => 'duendes-en-tu-vida-guia-basica',
        'box-elemental-opción-4' => 'box-elemental',
        'box-elemental-opcion-4' => 'box-elemental',
        'rejilla-de-cristal-triple-manifestación' => 'rejilla-de-cristal-triple-manifestacion',
        'rejilla-de-cristal-triple-manifestacion' => 'rejilla-de-cristal-triple-manifestacion',
        'promo-3x2' => '',
        'promo-matheo-y-lil-con-mini-set-de-cristales-de-regalo' => '',
    );

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('template_redirect', array($this, 'handle_redirects'), 1);
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    /**
     * Manejar los redirects
     */
    public function handle_redirects() {
        // Obtener la URL actual
        $request_uri = $_SERVER['REQUEST_URI'];
        $path = trim(parse_url($request_uri, PHP_URL_PATH), '/');

        // Decodificar caracteres especiales
        $path_decoded = urldecode($path);

        // 1. Verificar redirects de páginas
        foreach ($this->page_redirects as $old => $new) {
            if ($path === $old || $path_decoded === $old || $path === $old . '/' || $path_decoded === $old . '/') {
                $this->do_redirect($new);
            }
        }

        // 2. Verificar redirects de productos (product-page → product)
        if (strpos($path, 'product-page/') === 0 || strpos($path_decoded, 'product-page/') === 0) {
            $slug = str_replace('product-page/', '', $path_decoded);
            $slug = trim($slug, '/');

            // Verificar si hay un redirect específico
            if (isset($this->product_redirects[$slug])) {
                $new_slug = $this->product_redirects[$slug];
                if (empty($new_slug)) {
                    // Promos que ya no existen, redirigir a tienda
                    $this->do_redirect('/shop/');
                } else {
                    $this->do_redirect('/product/' . $new_slug . '/');
                }
            } else {
                // Redirect genérico: mantener el mismo slug
                $this->do_redirect('/product/' . $slug . '/');
            }
        }

        // 3. URLs con caracteres codificados
        if (strpos($path, 'product-page%2F') !== false) {
            $slug = str_replace('product-page%2F', '', $path);
            $slug = urldecode($slug);
            $slug = trim($slug, '/');

            if (isset($this->product_redirects[$slug])) {
                $new_slug = $this->product_redirects[$slug];
                if (empty($new_slug)) {
                    $this->do_redirect('/shop/');
                } else {
                    $this->do_redirect('/product/' . $new_slug . '/');
                }
            } else {
                $this->do_redirect('/product/' . $slug . '/');
            }
        }
    }

    /**
     * Ejecutar redirect 301
     */
    private function do_redirect($url) {
        wp_redirect(home_url($url), 301);
        exit;
    }

    /**
     * Agregar menú de administración
     */
    public function add_admin_menu() {
        add_options_page(
            'Redirects Wix',
            'Redirects Wix',
            'manage_options',
            'duendes-redirects-wix',
            array($this, 'admin_page')
        );
    }

    /**
     * Registrar settings
     */
    public function register_settings() {
        register_setting('duendes_redirects_wix', 'duendes_redirects_enabled');
    }

    /**
     * Página de administración
     */
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>Redirects Wix → WordPress</h1>

            <div class="card" style="max-width: 800px; padding: 20px; margin-top: 20px;">
                <h2>Estado: <span style="color: green;">✓ Activo</span></h2>
                <p>Los redirects 301 están funcionando automáticamente.</p>
            </div>

            <div class="card" style="max-width: 800px; padding: 20px; margin-top: 20px;">
                <h2>Redirects de Páginas (<?php echo count($this->page_redirects); ?>)</h2>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>URL Wix</th>
                            <th>→</th>
                            <th>URL WordPress</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($this->page_redirects as $old => $new): ?>
                        <tr>
                            <td><code>/<?php echo esc_html($old); ?></code></td>
                            <td>→</td>
                            <td><code><?php echo esc_html($new); ?></code></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <div class="card" style="max-width: 800px; padding: 20px; margin-top: 20px;">
                <h2>Redirects de Productos</h2>
                <p><strong>Regla general:</strong> <code>/product-page/[slug]</code> → <code>/product/[slug]</code></p>

                <h3>Excepciones (<?php echo count($this->product_redirects); ?>)</h3>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Slug Wix</th>
                            <th>→</th>
                            <th>Slug WordPress</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($this->product_redirects as $old => $new): ?>
                        <tr>
                            <td><code><?php echo esc_html($old); ?></code></td>
                            <td>→</td>
                            <td><code><?php echo empty($new) ? '/shop/ (promo eliminada)' : esc_html($new); ?></code></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <div class="card" style="max-width: 800px; padding: 20px; margin-top: 20px;">
                <h2>Probar Redirects</h2>
                <p>Hacé click en estos links para verificar que funcionan:</p>
                <ul>
                    <li><a href="<?php echo home_url('/shop-1/'); ?>" target="_blank">/shop-1/ → /shop/</a></li>
                    <li><a href="<?php echo home_url('/product-page/gaia/'); ?>" target="_blank">/product-page/gaia/ → /product/gaia-2/</a></li>
                    <li><a href="<?php echo home_url('/preguntas-frecuentes/'); ?>" target="_blank">/preguntas-frecuentes/ → /faq/</a></li>
                    <li><a href="<?php echo home_url('/members/'); ?>" target="_blank">/members/ → /mi-cuenta/</a></li>
                </ul>
            </div>

            <div class="card" style="max-width: 800px; padding: 20px; margin-top: 20px; background: #fff3cd;">
                <h2>Nota sobre SEO</h2>
                <p>Los redirects 301 preservan aproximadamente 90-99% del "link juice" de las URLs originales.</p>
                <p>Google puede tardar 2-4 semanas en procesar todos los redirects y actualizar su índice.</p>
                <p><strong>Recomendación:</strong> Mantené este plugin activo por al menos 6 meses después de la migración.</p>
            </div>
        </div>
        <?php
    }
}

// Inicializar el plugin
Duendes_Redirects_Wix::get_instance();
