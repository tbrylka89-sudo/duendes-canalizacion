<?php
/**
 * Plugin Name: Duendes Admin Hub
 * Description: Hub central con todas las herramientas de administración de Duendes del Uruguay
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// URL base de Vercel
define('DUENDES_VERCEL_URL', 'https://duendes-vercel.vercel.app');

// Agregar menú en wp-admin
add_action('admin_menu', function() {
    add_menu_page(
        'Hub Duendes',
        '🏰 Hub Duendes',
        'manage_options',
        'duendes-hub',
        'duendes_render_hub_page',
        'dashicons-superhero',
        2 // Posición alta en el menú
    );
});

// Renderizar la página del hub
function duendes_render_hub_page() {
    $vercel_url = DUENDES_VERCEL_URL;
    ?>
    <style>
        .duendes-hub {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1400px;
            margin: 20px auto;
            padding: 0 20px;
        }
        .duendes-hub * {
            box-sizing: border-box;
        }
        .duendes-hub-header {
            background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
            color: #fff;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
        }
        .duendes-hub-header h1 {
            color: #c9a227;
            font-size: 2rem;
            margin: 0 0 10px 0;
        }
        .duendes-hub-header p {
            color: rgba(255,255,255,0.7);
            margin: 0;
        }
        .duendes-hub-search {
            margin-top: 20px;
        }
        .duendes-hub-search input {
            padding: 12px 20px;
            width: 100%;
            max-width: 400px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(201,162,39,0.3);
            border-radius: 8px;
            color: #fff;
            font-size: 1rem;
        }
        .duendes-hub-search input::placeholder {
            color: rgba(255,255,255,0.5);
        }
        .duendes-section {
            background: #fff;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .duendes-section h2 {
            color: #1a1a2e;
            font-size: 1.4rem;
            margin: 0 0 8px 0;
            padding-bottom: 12px;
            border-bottom: 2px solid #c9a227;
        }
        .duendes-section > p {
            color: #666;
            margin: 0 0 20px 0;
        }
        .duendes-tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 16px;
        }
        .duendes-tool {
            display: block;
            padding: 20px;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 10px;
            text-decoration: none;
            color: inherit;
            transition: all 0.2s ease;
        }
        .duendes-tool:hover {
            transform: translateY(-2px);
            border-color: #c9a227;
            box-shadow: 0 4px 12px rgba(201,162,39,0.15);
        }
        .duendes-tool.destacado {
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border-color: #c9a227;
        }
        .duendes-tool-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .duendes-tool h3 {
            margin: 0;
            font-size: 1.1rem;
            color: #1a1a2e;
        }
        .duendes-tool.destacado h3 {
            color: #92400e;
        }
        .duendes-tool-status {
            font-size: 0.7rem;
            padding: 4px 10px;
            border-radius: 20px;
            font-weight: 500;
        }
        .duendes-tool-status.activo {
            background: #d1fae5;
            color: #065f46;
        }
        .duendes-tool-status.construccion {
            background: #fef3c7;
            color: #92400e;
        }
        .duendes-tool p {
            margin: 0;
            font-size: 0.9rem;
            color: #6b7280;
            line-height: 1.5;
        }
        .duendes-apis {
            background: #1a1a2e;
            border-radius: 10px;
            overflow: hidden;
        }
        .duendes-api {
            display: flex;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            gap: 16px;
        }
        .duendes-api:last-child {
            border-bottom: none;
        }
        .duendes-api-method {
            background: rgba(201,162,39,0.2);
            color: #c9a227;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-family: monospace;
            font-weight: 600;
        }
        .duendes-api-info {
            flex: 1;
        }
        .duendes-api-url {
            color: #fbbf24;
            font-family: monospace;
            font-size: 0.9rem;
            text-decoration: none;
        }
        .duendes-api-url:hover {
            text-decoration: underline;
        }
        .duendes-api-desc {
            color: rgba(255,255,255,0.6);
            font-size: 0.85rem;
            margin-top: 4px;
        }
        .duendes-pages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 12px;
        }
        .duendes-page {
            display: block;
            padding: 16px;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            text-decoration: none;
            color: inherit;
            transition: all 0.2s ease;
        }
        .duendes-page:hover {
            border-color: #c9a227;
        }
        .duendes-page h4 {
            margin: 0 0 6px 0;
            font-size: 1rem;
            color: #1a1a2e;
        }
        .duendes-page p {
            margin: 0;
            font-size: 0.85rem;
            color: #6b7280;
        }
        .duendes-footer {
            text-align: center;
            padding: 30px;
            color: #6b7280;
            font-size: 0.9rem;
        }
        .duendes-footer code {
            background: #f3f4f6;
            padding: 4px 8px;
            border-radius: 4px;
            color: #92400e;
        }
    </style>

    <div class="duendes-hub">
        <div class="duendes-hub-header">
            <h1>🏰 Hub de Administración</h1>
            <p>Todas las herramientas de Duendes del Uruguay en un solo lugar</p>
            <div class="duendes-hub-search">
                <input type="text" id="duendes-search" placeholder="🔍 Buscar herramienta...">
            </div>
        </div>

        <!-- VENTAS & CONVERSIÓN -->
        <div class="duendes-section" data-section="ventas">
            <h2>🎯 Ventas & Conversión</h2>
            <p>Herramientas para vender más y mejor</p>
            <div class="duendes-tools-grid">
                <a href="<?php echo $vercel_url; ?>/admin/tito" target="_blank" class="duendes-tool" data-keywords="tito chat conversaciones metricas">
                    <div class="duendes-tool-header">
                        <h3>Panel de Tito</h3>
                        <span class="duendes-tool-status activo">● Activo</span>
                    </div>
                    <p>Ver conversaciones, métricas y escalamientos del chatbot</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/admin/promociones" target="_blank" class="duendes-tool" data-keywords="promociones cupones ofertas descuentos">
                    <div class="duendes-tool-header">
                        <h3>Promociones</h3>
                        <span class="duendes-tool-status activo">● Activo</span>
                    </div>
                    <p>Crear y gestionar promociones, cupones y ofertas</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/admin/promociones/automaticas" target="_blank" class="duendes-tool" data-keywords="automaticas carrito abandonado cumpleaños">
                    <div class="duendes-tool-header">
                        <h3>Promos Automáticas</h3>
                        <span class="duendes-tool-status activo">● Activo</span>
                    </div>
                    <p>Promociones que se activan solas (carrito abandonado, cumpleaños)</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/admin/promociones/relampago" target="_blank" class="duendes-tool" data-keywords="flash relampago urgente tiempo limitado">
                    <div class="duendes-tool-header">
                        <h3>Promos Relámpago</h3>
                        <span class="duendes-tool-status activo">● Activo</span>
                    </div>
                    <p>Crear ofertas flash de tiempo limitado</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/admin/promociones/stats" target="_blank" class="duendes-tool" data-keywords="estadisticas stats metricas rendimiento">
                    <div class="duendes-tool-header">
                        <h3>Stats de Promos</h3>
                        <span class="duendes-tool-status activo">● Activo</span>
                    </div>
                    <p>Ver rendimiento de promociones activas</p>
                </a>
            </div>
        </div>

        <!-- CONTENIDO & PRODUCTOS -->
        <div class="duendes-section" data-section="contenido">
            <h2>✨ Contenido & Productos</h2>
            <p>Generar y gestionar contenido de guardianes</p>
            <div class="duendes-tools-grid">
                <a href="<?php echo $vercel_url; ?>/admin/generador-historias" target="_blank" class="duendes-tool destacado" data-keywords="generador historias ia contenido productos">
                    <div class="duendes-tool-header">
                        <h3>⭐ Generador de Historias</h3>
                        <span class="duendes-tool-status activo">● Activo</span>
                    </div>
                    <p>Crear historias únicas para guardianes usando IA. Analiza imagen, hace encuesta, genera historia con scoring de conversión.</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/admin/corregir-productos" target="_blank" class="duendes-tool" data-keywords="corregir productos editar fichas woocommerce">
                    <div class="duendes-tool-header">
                        <h3>Corregir Productos</h3>
                        <span class="duendes-tool-status activo">● Activo</span>
                    </div>
                    <p>Editar fichas de productos en WooCommerce (descripciones, SEO, categorías)</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/admin/inteligencia" target="_blank" class="duendes-tool" data-keywords="guardian intelligence ia automatico seo">
                    <div class="duendes-tool-header">
                        <h3>Guardian Intelligence</h3>
                        <span class="duendes-tool-status activo">● Activo</span>
                    </div>
                    <p>IA que analiza y mejora automáticamente los productos (descripciones, SEO, cross-selling)</p>
                </a>
            </div>
        </div>

        <!-- CANALIZACIONES -->
        <div class="duendes-section" data-section="canalizaciones">
            <h2>📜 Canalizaciones</h2>
            <p>Sistema de mensajes personalizados post-compra</p>
            <div class="duendes-tools-grid">
                <a href="<?php echo $vercel_url; ?>/admin/canalizaciones" target="_blank" class="duendes-tool destacado" data-keywords="canalizaciones mensajes aprobar enviar">
                    <div class="duendes-tool-header">
                        <h3>⭐ Panel de Canalizaciones</h3>
                        <span class="duendes-tool-status activo">● Activo</span>
                    </div>
                    <p>Ver canalizaciones pendientes, aprobar, editar y enviar a clientes</p>
                </a>
            </div>
        </div>

        <!-- EL CÍRCULO -->
        <div class="duendes-section" data-section="circulo">
            <h2>🔮 El Círculo</h2>
            <p>Membresía exclusiva (PAUSADO - en construcción)</p>
            <div class="duendes-tools-grid">
                <a href="<?php echo $vercel_url; ?>/admin/circulo/maestro" target="_blank" class="duendes-tool destacado" data-keywords="circulo maestro membresia control">
                    <div class="duendes-tool-header">
                        <h3>⭐ Panel Maestro</h3>
                        <span class="duendes-tool-status construccion">🚧 En construcción</span>
                    </div>
                    <p>Control completo del Círculo: miembros, contenido, configuración</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/admin/circulo/contenido" target="_blank" class="duendes-tool" data-keywords="circulo contenido rituales consejos">
                    <div class="duendes-tool-header">
                        <h3>Generador de Contenido</h3>
                        <span class="duendes-tool-status construccion">🚧 En construcción</span>
                    </div>
                    <p>Crear rituales, consejos diarios, mensajes de guardianes</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/admin/circulo/calendario" target="_blank" class="duendes-tool" data-keywords="circulo calendario programar">
                    <div class="duendes-tool-header">
                        <h3>Calendario Editorial</h3>
                        <span class="duendes-tool-status construccion">🚧 En construcción</span>
                    </div>
                    <p>Programar publicaciones por fecha</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/admin/circulo/duende-semana" target="_blank" class="duendes-tool" data-keywords="duende semana destacado rotar">
                    <div class="duendes-tool-header">
                        <h3>Duende de la Semana</h3>
                        <span class="duendes-tool-status construccion">🚧 En construcción</span>
                    </div>
                    <p>Rotar guardián destacado semanalmente</p>
                </a>
            </div>
        </div>

        <!-- GAMIFICACIÓN -->
        <div class="duendes-section" data-section="gamificacion">
            <h2>🎮 Gamificación</h2>
            <p>Sistema de puntos, runas y recompensas</p>
            <div class="duendes-tools-grid">
                <a href="<?php echo $vercel_url; ?>/admin/gamificacion" target="_blank" class="duendes-tool" data-keywords="gamificacion runas badges puntos">
                    <div class="duendes-tool-header">
                        <h3>Panel Gamificación</h3>
                        <span class="duendes-tool-status activo">● Activo</span>
                    </div>
                    <p>Ver usuarios, dar runas, gestionar badges y recompensas</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/admin/comunidad" target="_blank" class="duendes-tool" data-keywords="comunidad foro moderar usuarios">
                    <div class="duendes-tool-header">
                        <h3>Comunidad</h3>
                        <span class="duendes-tool-status activo">● Activo</span>
                    </div>
                    <p>Moderar foro, ver actividad, gestionar contenido de usuarios</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/admin/sugerencias" target="_blank" class="duendes-tool" data-keywords="sugerencias ideas usuarios">
                    <div class="duendes-tool-header">
                        <h3>Sugerencias</h3>
                        <span class="duendes-tool-status activo">● Activo</span>
                    </div>
                    <p>Ver sugerencias de usuarios para nuevos guardianes</p>
                </a>
            </div>
        </div>

        <!-- MODO DIOS -->
        <div class="duendes-section" data-section="modo-dios">
            <h2>⚡ Modo Dios</h2>
            <p>Control total del sistema</p>
            <div class="duendes-tools-grid">
                <a href="<?php echo $vercel_url; ?>/admin/modo-dios" target="_blank" class="duendes-tool destacado" data-keywords="modo dios control total sistema kv">
                    <div class="duendes-tool-header">
                        <h3>⭐ Modo Dios</h3>
                        <span class="duendes-tool-status activo">● Activo</span>
                    </div>
                    <p>Panel de control general: KV, estadísticas, diagnóstico, acciones masivas</p>
                </a>
            </div>
        </div>

        <!-- APIs ÚTILES -->
        <div class="duendes-section" data-section="apis">
            <h2>🔌 APIs Útiles</h2>
            <p>Endpoints que podés usar directamente</p>
            <div class="duendes-apis">
                <div class="duendes-api" data-keywords="cotizaciones divisas cambio">
                    <span class="duendes-api-method">GET/POST</span>
                    <div class="duendes-api-info">
                        <a href="<?php echo $vercel_url; ?>/api/cotizaciones" target="_blank" class="duendes-api-url">/api/cotizaciones</a>
                        <div class="duendes-api-desc">Ver/actualizar tasas de cambio para precios internacionales</div>
                    </div>
                </div>
                <div class="duendes-api" data-keywords="certificado orden pedido">
                    <span class="duendes-api-method">GET</span>
                    <div class="duendes-api-info">
                        <a href="<?php echo $vercel_url; ?>/api/certificado?order=NUMERO" target="_blank" class="duendes-api-url">/api/certificado?order=NUMERO</a>
                        <div class="duendes-api-desc">Generar certificado de guardián por número de orden</div>
                    </div>
                </div>
                <div class="duendes-api" data-keywords="productos tienda woocommerce">
                    <span class="duendes-api-method">GET</span>
                    <div class="duendes-api-info">
                        <a href="<?php echo $vercel_url; ?>/api/tienda/productos" target="_blank" class="duendes-api-url">/api/tienda/productos</a>
                        <div class="duendes-api-desc">Lista de productos de la tienda</div>
                    </div>
                </div>
                <div class="duendes-api" data-keywords="tito web chat gpt">
                    <span class="duendes-api-method">POST</span>
                    <div class="duendes-api-info">
                        <a href="<?php echo $vercel_url; ?>/api/tito/gpt" target="_blank" class="duendes-api-url">/api/tito/gpt</a>
                        <div class="duendes-api-desc">Endpoint activo del widget web - Híbrido GPT + Claude</div>
                    </div>
                </div>
                <div class="duendes-api" data-keywords="tito manychat instagram facebook">
                    <span class="duendes-api-method">POST</span>
                    <div class="duendes-api-info">
                        <a href="<?php echo $vercel_url; ?>/api/tito/mc-direct" target="_blank" class="duendes-api-url">/api/tito/mc-direct</a>
                        <div class="duendes-api-desc">Endpoint activo para Instagram/Facebook vía ManyChat</div>
                    </div>
                </div>
                <div class="duendes-api" data-keywords="escalamientos atencion humana">
                    <span class="duendes-api-method">GET</span>
                    <div class="duendes-api-info">
                        <a href="<?php echo $vercel_url; ?>/api/tito/escalamientos" target="_blank" class="duendes-api-url">/api/tito/escalamientos</a>
                        <div class="duendes-api-desc">Ver conversaciones escaladas que requieren atención humana</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PÁGINAS EN VERCEL -->
        <div class="duendes-section" data-section="paginas">
            <h2>🌐 Páginas en Vercel</h2>
            <p>Páginas públicas alojadas en Vercel (no en WordPress)</p>
            <div class="duendes-pages-grid">
                <a href="<?php echo $vercel_url; ?>/mi-magia" target="_blank" class="duendes-page" data-keywords="mi magia portal cliente">
                    <h4>Mi Magia</h4>
                    <p>Portal post-compra para clientes</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/tienda" target="_blank" class="duendes-page" data-keywords="tienda vercel alternativa">
                    <h4>Tienda Vercel</h4>
                    <p>Versión alternativa de la tienda</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/circulo-landing" target="_blank" class="duendes-page" data-keywords="circulo landing captura">
                    <h4>Círculo Landing</h4>
                    <p>Página de captura para El Círculo</p>
                </a>
                <a href="<?php echo $vercel_url; ?>/mi-magia/login" target="_blank" class="duendes-page" data-keywords="login acceso email">
                    <h4>Login Mi Magia</h4>
                    <p>Acceso al portal con email</p>
                </a>
            </div>
        </div>

        <div class="duendes-footer">
            <p>URL base de Vercel: <code><?php echo $vercel_url; ?></code></p>
            <p style="margin-top: 8px; font-size: 0.85rem;">Todas las herramientas se abren en nueva pestaña</p>
        </div>
    </div>

    <script>
    document.getElementById('duendes-search').addEventListener('input', function(e) {
        const busqueda = e.target.value.toLowerCase();
        const tools = document.querySelectorAll('.duendes-tool, .duendes-api, .duendes-page');
        const sections = document.querySelectorAll('.duendes-section');

        tools.forEach(tool => {
            const keywords = (tool.dataset.keywords || '') + ' ' + tool.textContent.toLowerCase();
            tool.style.display = keywords.includes(busqueda) ? '' : 'none';
        });

        // Ocultar secciones vacías
        sections.forEach(section => {
            const visibleTools = section.querySelectorAll('.duendes-tool:not([style*="display: none"]), .duendes-api:not([style*="display: none"]), .duendes-page:not([style*="display: none"])');
            section.style.display = visibleTools.length > 0 ? '' : 'none';
        });
    });
    </script>
    <?php
}

// Agregar enlace rápido en la barra de admin
add_action('admin_bar_menu', function($wp_admin_bar) {
    $wp_admin_bar->add_node([
        'id'    => 'duendes-hub',
        'title' => '🏰 Hub',
        'href'  => admin_url('admin.php?page=duendes-hub'),
        'meta'  => ['title' => 'Hub de Administración Duendes']
    ]);
}, 100);
