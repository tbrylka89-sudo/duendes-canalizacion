<?php
/**
 * Plugin Name: Duendes Hub de Control
 * Description: Centro de control con todos los accesos a la app de Vercel
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// URL de tu app en Vercel - cambiar si usas dominio personalizado
define('DUENDES_APP_URL', 'https://duendes-vercel.vercel.app');

class DuendesHubControl {

    public function __construct() {
        add_action('admin_menu', [$this, 'agregar_menu']);
    }

    public function agregar_menu() {
        add_menu_page(
            'Hub de Control',
            '🎮 Hub Control',
            'manage_options',
            'duendes-hub',
            [$this, 'pagina_hub'],
            'dashicons-screenoptions',
            2 // Posición alta para que aparezca arriba
        );
    }

    public function pagina_hub() {
        $url = DUENDES_APP_URL;
        ?>
        <style>
            .hub-container {
                max-width: 1400px;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .hub-header {
                background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
                color: white;
                padding: 30px;
                border-radius: 16px;
                margin-bottom: 30px;
                text-align: center;
            }
            .hub-header h1 {
                margin: 0 0 10px 0;
                font-size: 32px;
            }
            .hub-header p {
                margin: 0;
                opacity: 0.9;
                font-size: 16px;
            }
            .hub-section {
                background: white;
                border-radius: 12px;
                padding: 24px;
                margin-bottom: 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
            .hub-section h2 {
                margin: 0 0 20px 0;
                padding-bottom: 12px;
                border-bottom: 2px solid #e0e0e0;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 20px;
            }
            .hub-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 16px;
            }
            .hub-card {
                background: #f8f9fa;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                padding: 16px;
                transition: all 0.2s;
                text-decoration: none;
                color: inherit;
                display: block;
            }
            .hub-card:hover {
                border-color: #2d5a87;
                background: #f0f7ff;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(45,90,135,0.15);
            }
            .hub-card-title {
                font-weight: 600;
                font-size: 15px;
                color: #1e3a5f;
                margin-bottom: 6px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .hub-card-url {
                font-size: 12px;
                color: #666;
                font-family: monospace;
                background: #e8e8e8;
                padding: 2px 6px;
                border-radius: 4px;
                margin-bottom: 8px;
                display: inline-block;
            }
            .hub-card-desc {
                font-size: 13px;
                color: #555;
                line-height: 1.5;
            }
            .hub-card-uso {
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px dashed #ddd;
                font-size: 12px;
                color: #888;
            }
            .hub-card-uso strong {
                color: #2d5a87;
            }
            .badge {
                font-size: 10px;
                padding: 2px 8px;
                border-radius: 12px;
                font-weight: 600;
                text-transform: uppercase;
            }
            .badge-admin { background: #ffebee; color: #c62828; }
            .badge-user { background: #e3f2fd; color: #1565c0; }
            .badge-public { background: #e8f5e9; color: #2e7d32; }
            .badge-api { background: #fff3e0; color: #e65100; }
            .quick-access {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                margin-bottom: 30px;
            }
            .quick-btn {
                background: linear-gradient(135deg, #2d5a87 0%, #1e3a5f 100%);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 14px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s;
            }
            .quick-btn:hover {
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(45,90,135,0.3);
            }
            .quick-btn.secondary {
                background: white;
                color: #1e3a5f;
                border: 2px solid #1e3a5f;
            }
            .quick-btn.secondary:hover {
                background: #f0f7ff;
                color: #1e3a5f;
            }
        </style>

        <div class="hub-container">
            <div class="hub-header">
                <h1>🎮 Hub de Control - Duendes del Uruguay</h1>
                <p>Todos tus accesos en un solo lugar. No pierdas nada.</p>
            </div>

            <!-- ACCESOS RÁPIDOS -->
            <div class="quick-access">
                <a href="<?php echo $url; ?>/admin/circulo" target="_blank" class="quick-btn">
                    🏠 Hub Admin Principal
                </a>
                <a href="<?php echo $url; ?>/admin/tito" target="_blank" class="quick-btn">
                    🤖 Tito Admin
                </a>
                <a href="<?php echo $url; ?>/admin/canalizaciones" target="_blank" class="quick-btn" style="background: linear-gradient(135deg, #9370DB 0%, #6B4E9F 100%);">
                    📜 Canalizaciones
                </a>
                <a href="<?php echo $url; ?>/admin/gamificacion" target="_blank" class="quick-btn secondary">
                    🎮 Gamificación
                </a>
                <a href="<?php echo $url; ?>/admin/inteligencia" target="_blank" class="quick-btn secondary">
                    📊 Analytics
                </a>
            </div>

            <!-- ADMIN: CÍRCULO -->
            <div class="hub-section">
                <h2>🔮 Admin del Círculo <span class="badge badge-admin">ADMIN</span></h2>
                <div class="hub-grid">

                    <a href="<?php echo $url; ?>/admin/circulo" target="_blank" class="hub-card">
                        <div class="hub-card-title">🏠 Hub Central del Círculo</div>
                        <div class="hub-card-url">/admin/circulo</div>
                        <div class="hub-card-desc">
                            Panel principal con Tito Admin, estadísticas rápidas y acceso a todas las funciones.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Ver stats, hablar con Tito, ejecutar acciones rápidas, acceder a todo.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/circulo/asistente" target="_blank" class="hub-card">
                        <div class="hub-card-title">🤖 Asistente del Círculo</div>
                        <div class="hub-card-url">/admin/circulo/asistente</div>
                        <div class="hub-card-desc">
                            IA que genera contenido automáticamente: mensajes, meditaciones, rituales.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Generar contenido del mes completo con un click.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/circulo/contenido" target="_blank" class="hub-card">
                        <div class="hub-card-title">✍️ Generador de Contenido</div>
                        <div class="hub-card-url">/admin/circulo/contenido</div>
                        <div class="hub-card-desc">
                            Crear mensajes, meditaciones y rituales personalizados manualmente.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Crear contenido específico que querés escribir vos.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/circulo/calendario" target="_blank" class="hub-card">
                        <div class="hub-card-title">📅 Calendario de Contenidos</div>
                        <div class="hub-card-url">/admin/circulo/calendario</div>
                        <div class="hub-card-desc">
                            Vista mensual de todo el contenido programado y publicado.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Ver qué hay programado, reprogramar, detectar huecos.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/circulo/duende-semana" target="_blank" class="hub-card">
                        <div class="hub-card-title">⭐ Duende de la Semana</div>
                        <div class="hub-card-url">/admin/circulo/duende-semana</div>
                        <div class="hub-card-desc">
                            Seleccionar qué guardián será el protagonista de esta semana.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Rotar el guardián destacado cada semana.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/circulo/maestro" target="_blank" class="hub-card">
                        <div class="hub-card-title">🎓 Panel Maestro</div>
                        <div class="hub-card-url">/admin/circulo/maestro</div>
                        <div class="hub-card-desc">
                            Control avanzado y configuraciones del círculo.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Configuraciones avanzadas y control total.
                        </div>
                    </a>

                </div>
            </div>

            <!-- ADMIN: CANALIZACIONES -->
            <div class="hub-section" style="border-left: 4px solid #9370DB;">
                <h2>📜 Panel de Canalizaciones <span class="badge badge-admin">ADMIN</span></h2>
                <div class="hub-grid">

                    <a href="<?php echo $url; ?>/admin/canalizaciones" target="_blank" class="hub-card" style="border-color: #9370DB; background: linear-gradient(135deg, rgba(147, 112, 219, 0.1), rgba(147, 112, 219, 0.02));">
                        <div class="hub-card-title" style="color: #6B4E9F;">📜 Panel de Aprobación</div>
                        <div class="hub-card-url">/admin/canalizaciones</div>
                        <div class="hub-card-desc">
                            Revisá, editá y aprobá canalizaciones antes de enviarlas al cliente. Con resumen IA y chat editor.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Ver canalizaciones pendientes, aprobar, enviar a Mi Magia del cliente.
                        </div>
                    </a>

                    <div class="hub-card">
                        <div class="hub-card-title">✨ Flujo de Aprobación</div>
                        <div class="hub-card-desc">
                            <strong>1.</strong> Cliente compra → canalización se genera automáticamente<br>
                            <strong>2.</strong> Aparece en "Pendientes" del panel<br>
                            <strong>3.</strong> Revisás con preview + resumen IA<br>
                            <strong>4.</strong> Chat editor para ajustes ("acortá el ritual")<br>
                            <strong>5.</strong> Aprobás → Enviás → Cliente ve en Mi Magia
                        </div>
                    </div>

                </div>
            </div>

            <!-- ADMIN: PROMOCIONES -->
            <div class="hub-section">
                <h2>🏷️ Promociones <span class="badge badge-admin">ADMIN</span></h2>
                <div class="hub-grid">

                    <a href="<?php echo $url; ?>/admin/promociones" target="_blank" class="hub-card">
                        <div class="hub-card-title">🏷️ Gestión de Promociones</div>
                        <div class="hub-card-url">/admin/promociones</div>
                        <div class="hub-card-desc">
                            Ver y administrar todos los códigos promocionales activos.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Ver promos activas, desactivar, editar.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/promociones/nueva" target="_blank" class="hub-card">
                        <div class="hub-card-title">➕ Nueva Promoción</div>
                        <div class="hub-card-url">/admin/promociones/nueva</div>
                        <div class="hub-card-desc">
                            Crear un nuevo código de descuento o promoción.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Crear descuentos para fechas especiales, influencers, etc.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/promociones/stats" target="_blank" class="hub-card">
                        <div class="hub-card-title">📈 Estadísticas de Promos</div>
                        <div class="hub-card-url">/admin/promociones/stats</div>
                        <div class="hub-card-desc">
                            Ver rendimiento: cuántas veces se usó cada código, ventas generadas.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Saber qué promos funcionan y cuáles no.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/promociones/automaticas" target="_blank" class="hub-card">
                        <div class="hub-card-title">⚡ Promos Automáticas</div>
                        <div class="hub-card-url">/admin/promociones/automaticas</div>
                        <div class="hub-card-desc">
                            Configurar reglas que activan descuentos automáticamente.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Descuento automático por cumpleaños, primera compra, etc.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/promociones/relampago" target="_blank" class="hub-card">
                        <div class="hub-card-title">⚡ Promos Relámpago</div>
                        <div class="hub-card-url">/admin/promociones/relampago</div>
                        <div class="hub-card-desc">
                            Flash sales: ofertas de tiempo muy limitado (horas).
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Crear urgencia: "Solo por 2 horas, 50% off".
                        </div>
                    </a>

                </div>
            </div>

            <!-- ADMIN: OTROS -->
            <div class="hub-section">
                <h2>🛠️ Otras Herramientas Admin <span class="badge badge-admin">ADMIN</span></h2>
                <div class="hub-grid">

                    <a href="<?php echo $url; ?>/admin/tito" target="_blank" class="hub-card">
                        <div class="hub-card-title">🤖 Tito Admin</div>
                        <div class="hub-card-url">/admin/tito</div>
                        <div class="hub-card-desc">
                            Asistente IA todopoderoso. Hablale en lenguaje natural.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> "Dale 50 runas a maria@gmail.com", "Activá el círculo para juan", etc.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/gamificacion" target="_blank" class="hub-card">
                        <div class="hub-card-title">🎮 Gamificación</div>
                        <div class="hub-card-url">/admin/gamificacion</div>
                        <div class="hub-card-desc">
                            Sistema de puntos (runas), badges, rachas, niveles de usuarios.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Ver puntos de usuarios, dar runas, ver rankings.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/inteligencia" target="_blank" class="hub-card">
                        <div class="hub-card-title">📊 Inteligencia / Analytics</div>
                        <div class="hub-card-url">/admin/inteligencia</div>
                        <div class="hub-card-desc">
                            Métricas y estadísticas de toda la plataforma.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Ver qué funciona, tendencias, comportamiento de usuarios.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/sugerencias" target="_blank" class="hub-card">
                        <div class="hub-card-title">💡 Sugerencias</div>
                        <div class="hub-card-url">/admin/sugerencias</div>
                        <div class="hub-card-desc">
                            Ver y responder sugerencias que envían los usuarios.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Leer feedback, responder, marcar como implementado.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/comunidad" target="_blank" class="hub-card">
                        <div class="hub-card-title">👥 Comunidad / Foro</div>
                        <div class="hub-card-url">/admin/comunidad</div>
                        <div class="hub-card-desc">
                            Moderar el foro: aprobar posts, eliminar spam, responder.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Moderar la comunidad, participar en conversaciones.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/admin/circulo-contenido" target="_blank" class="hub-card">
                        <div class="hub-card-title">📝 Círculo Contenido</div>
                        <div class="hub-card-url">/admin/circulo-contenido</div>
                        <div class="hub-card-desc">
                            Gestión específica de contenidos publicados en el círculo.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Usalo para:</strong> Editar, eliminar o reprogramar contenido existente.
                        </div>
                    </a>

                </div>
            </div>

            <!-- ÁREA DE USUARIO -->
            <div class="hub-section">
                <h2>👤 Área de Usuario (Mi Magia) <span class="badge badge-user">USUARIO</span></h2>
                <div class="hub-grid">

                    <a href="<?php echo $url; ?>/mi-magia" target="_blank" class="hub-card">
                        <div class="hub-card-title">✨ Mi Magia - Dashboard</div>
                        <div class="hub-card-url">/mi-magia</div>
                        <div class="hub-card-desc">
                            Dashboard personal del usuario con acceso a todas sus funciones.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Qué ve el usuario:</strong> Sus guardianes, puntos, accesos rápidos.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/mi-magia/circulo" target="_blank" class="hub-card">
                        <div class="hub-card-title">🔮 Mi Magia → Círculo</div>
                        <div class="hub-card-url">/mi-magia/circulo</div>
                        <div class="hub-card-desc">
                            Acceso al círculo desde el área personal.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Qué ve el usuario:</strong> Entrada al círculo exclusivo.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/mi-magia/comunidad" target="_blank" class="hub-card">
                        <div class="hub-card-title">👥 Mi Magia → Comunidad</div>
                        <div class="hub-card-url">/mi-magia/comunidad</div>
                        <div class="hub-card-desc">
                            Foro donde los usuarios interactúan entre sí.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Qué ve el usuario:</strong> Posts de otros, puede crear temas, comentar.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/mi-magia/sugerencias" target="_blank" class="hub-card">
                        <div class="hub-card-title">💡 Mi Magia → Sugerencias</div>
                        <div class="hub-card-url">/mi-magia/sugerencias</div>
                        <div class="hub-card-desc">
                            Buzón donde usuarios envían ideas y votan las de otros.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Qué ve el usuario:</strong> Puede sugerir, votar, ver estado de sus ideas.
                        </div>
                    </a>

                </div>
            </div>

            <!-- CÍRCULO EXCLUSIVO -->
            <div class="hub-section">
                <h2>🌟 Círculo Exclusivo (Membresía) <span class="badge badge-user">MIEMBROS</span></h2>
                <div class="hub-grid">

                    <a href="<?php echo $url; ?>/circulo" target="_blank" class="hub-card">
                        <div class="hub-card-title">🌟 Portal del Círculo</div>
                        <div class="hub-card-url">/circulo</div>
                        <div class="hub-card-desc">
                            Entrada principal al círculo con onboarding y dashboard.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Qué ve el miembro:</strong> Contenido diario, duende de la semana, actividades.
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/circulo/cursos" target="_blank" class="hub-card">
                        <div class="hub-card-title">🎓 Academia de Guardianes</div>
                        <div class="hub-card-url">/circulo/cursos</div>
                        <div class="hub-card-desc">
                            Cursos educativos con módulos, lecciones y badges.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Qué ve el miembro:</strong> Catálogo de cursos, su progreso, badges ganados.
                        </div>
                    </a>

                </div>
            </div>

            <!-- PÁGINAS PÚBLICAS -->
            <div class="hub-section">
                <h2>🌐 Páginas Públicas <span class="badge badge-public">PÚBLICO</span></h2>
                <div class="hub-grid">

                    <a href="<?php echo $url; ?>/" target="_blank" class="hub-card">
                        <div class="hub-card-title">🏠 Inicio</div>
                        <div class="hub-card-url">/</div>
                        <div class="hub-card-desc">
                            Landing page que redirige a la tienda de WordPress.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Función:</strong> Punto de entrada, redirige a duendesdeluruguay.com
                        </div>
                    </a>

                    <a href="<?php echo $url; ?>/tienda" target="_blank" class="hub-card">
                        <div class="hub-card-title">🛒 Tienda de Guardianes</div>
                        <div class="hub-card-url">/tienda</div>
                        <div class="hub-card-desc">
                            Catálogo visual de guardianes con filtros por categoría.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Función:</strong> Mostrar guardianes, conecta con WooCommerce.
                        </div>
                    </a>

                </div>
            </div>

            <!-- CANALIZACIONES -->
            <div class="hub-section">
                <h2>📜 Canalizaciones (Por ID) <span class="badge badge-user">DINÁMICO</span></h2>
                <div class="hub-grid">

                    <div class="hub-card" style="cursor: default;">
                        <div class="hub-card-title">💬 Portal del Guardián</div>
                        <div class="hub-card-url">/portal/[id]</div>
                        <div class="hub-card-desc">
                            Chat interactivo con un guardián adoptado. Cada cliente tiene su ID único.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Ejemplo:</strong> /portal/abc123 → Chat con el guardián de ese pedido.
                        </div>
                    </div>

                    <div class="hub-card" style="cursor: default;">
                        <div class="hub-card-title">🏅 Certificado de Autenticidad</div>
                        <div class="hub-card-url">/certificado/[id]</div>
                        <div class="hub-card-desc">
                            Certificado imprimible del guardián con código único.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Ejemplo:</strong> /certificado/abc123 → PDF del certificado.
                        </div>
                    </div>

                    <div class="hub-card" style="cursor: default;">
                        <div class="hub-card-title">📖 Guía de Activación</div>
                        <div class="hub-card-url">/guardian/[id]</div>
                        <div class="hub-card-desc">
                            Instrucciones para activar y usar el guardián.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Ejemplo:</strong> /guardian/abc123 → Guía completa del guardián.
                        </div>
                    </div>

                    <div class="hub-card" style="cursor: default;">
                        <div class="hub-card-title">🔮 Lectura Ancestral</div>
                        <div class="hub-card-url">/lectura/[id]</div>
                        <div class="hub-card-desc">
                            Lectura personalizada basada en la energía del usuario.
                        </div>
                        <div class="hub-card-uso">
                            <strong>Ejemplo:</strong> /lectura/abc123 → Lectura única generada.
                        </div>
                    </div>

                </div>
            </div>

            <!-- REFERENCIA RÁPIDA -->
            <div class="hub-section" style="background: #f0f7ff;">
                <h2>📋 Referencia Rápida</h2>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <tr style="background: #1e3a5f; color: white;">
                        <th style="padding: 10px; text-align: left;">¿Qué quiero hacer?</th>
                        <th style="padding: 10px; text-align: left;">¿A dónde voy?</th>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Ver estadísticas generales</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/circulo</code> o <code>/admin/inteligencia</code></td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Dar runas/puntos a un usuario</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/tito</code> → "Dale X runas a email"</td>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Aprobar y enviar canalizaciones</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/canalizaciones</code></td>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Crear contenido para el círculo</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/circulo/asistente</code> (auto) o <code>/admin/circulo/contenido</code> (manual)</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Ver qué hay programado</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/circulo/calendario</code></td>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Crear un código de descuento</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/promociones/nueva</code></td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Ver sugerencias de usuarios</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/sugerencias</code></td>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Moderar el foro</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/comunidad</code></td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Cambiar el duende de la semana</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/circulo/duende-semana</code></td>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px;">Ver cómo se ve el círculo para usuarios</td>
                        <td style="padding: 10px;"><code>/circulo</code></td>
                    </tr>
                </table>
            </div>

            <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
                URL base: <strong><?php echo $url; ?></strong><br>
                Si cambiás de dominio, editá <code>DUENDES_APP_URL</code> en el plugin.
            </div>

        </div>
        <?php
    }
}

new DuendesHubControl();
