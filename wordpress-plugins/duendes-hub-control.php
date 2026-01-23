<?php
/**
 * Plugin Name: Duendes Hub de Control
 * Description: Centro de control con todos los accesos a la app de Vercel
 * Version: 2.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// URL de tu app en Vercel
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
            2
        );
    }

    public function pagina_hub() {
        $url = DUENDES_APP_URL;
        ?>
        <style>
            .hub-container { max-width: 1400px; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            .hub-header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; border-radius: 16px; margin-bottom: 30px; text-align: center; }
            .hub-header h1 { margin: 0 0 10px 0; font-size: 32px; }
            .hub-header p { margin: 0; opacity: 0.9; font-size: 16px; }
            .hub-section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
            .hub-section h2 { margin: 0 0 20px 0; padding-bottom: 12px; border-bottom: 2px solid #e0e0e0; display: flex; align-items: center; gap: 10px; font-size: 20px; }
            .hub-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
            .hub-card { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 10px; padding: 16px; transition: all 0.2s; text-decoration: none; color: inherit; display: block; }
            .hub-card:hover { border-color: #2d5a87; background: #f0f7ff; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(45,90,135,0.15); }
            .hub-card-title { font-weight: 600; font-size: 15px; color: #1e3a5f; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
            .hub-card-url { font-size: 11px; color: #666; font-family: monospace; background: #e8e8e8; padding: 2px 6px; border-radius: 4px; margin-bottom: 8px; display: inline-block; }
            .hub-card-desc { font-size: 13px; color: #555; line-height: 1.5; }
            .hub-card-uso { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ddd; font-size: 12px; color: #888; }
            .hub-card-uso strong { color: #2d5a87; }
            .badge { font-size: 10px; padding: 2px 8px; border-radius: 12px; font-weight: 600; text-transform: uppercase; }
            .badge-admin { background: #ffebee; color: #c62828; }
            .badge-user { background: #e3f2fd; color: #1565c0; }
            .badge-public { background: #e8f5e9; color: #2e7d32; }
            .badge-new { background: #d4af37; color: #1a1a1a; }
            .quick-access { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 30px; }
            .quick-btn { background: linear-gradient(135deg, #2d5a87 0%, #1e3a5f 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
            .quick-btn:hover { color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(45,90,135,0.3); }
            .quick-btn.secondary { background: white; color: #1e3a5f; border: 2px solid #1e3a5f; }
            .quick-btn.secondary:hover { background: #f0f7ff; color: #1e3a5f; }
            .quick-btn.gold { background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); color: #1a1a1a; }
            .quick-btn.purple { background: linear-gradient(135deg, #9370DB 0%, #6B4E9F 100%); }
            .quick-btn.green { background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); }
        </style>

        <div class="hub-container">
            <div class="hub-header">
                <h1>🎮 Hub de Control - Duendes del Uruguay</h1>
                <p>Todos tus accesos en un solo lugar. Versión 2.0</p>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- ACCESOS RÁPIDOS -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="quick-access">
                <a href="<?php echo $url; ?>/admin/modo-dios" target="_blank" class="quick-btn gold">⚡ MODO DIOS</a>
                <a href="<?php echo $url; ?>/admin/generador-historias" target="_blank" class="quick-btn green">📖 Generador Historias</a>
                <a href="<?php echo $url; ?>/admin/circulo" target="_blank" class="quick-btn">🏠 Hub Círculo</a>
                <a href="<?php echo $url; ?>/admin/tito" target="_blank" class="quick-btn">🤖 Tito Admin</a>
                <a href="<?php echo $url; ?>/admin/canalizaciones" target="_blank" class="quick-btn purple">📜 Canalizaciones</a>
                <a href="<?php echo $url; ?>/admin/gamificacion" target="_blank" class="quick-btn secondary">🎮 Gamificación</a>
                <a href="<?php echo $url; ?>/admin/inteligencia" target="_blank" class="quick-btn secondary">📊 Analytics</a>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- MODO DIOS -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section" style="border: 2px solid #d4af37; background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(244, 208, 63, 0.05));">
                <h2>⚡ MODO DIOS - Control Total <span class="badge badge-new">NUEVO</span></h2>
                <div class="hub-grid">
                    <a href="<?php echo $url; ?>/admin/modo-dios" target="_blank" class="hub-card" style="border-color: #d4af37;">
                        <div class="hub-card-title" style="color: #b8860b;">⚡ Panel Modo Dios</div>
                        <div class="hub-card-url">/admin/modo-dios</div>
                        <div class="hub-card-desc">Control TOTAL de Mi Magia y El Círculo. Generar contenido, usuarios, regalos, cursos.</div>
                        <div class="hub-card-uso"><strong>Usalo para:</strong> TODO. Panel maestro de la plataforma.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/modo-dios#contenido" target="_blank" class="hub-card">
                        <div class="hub-card-title">✨ Generar Contenido Pro</div>
                        <div class="hub-card-url">/admin/modo-dios → Contenido</div>
                        <div class="hub-card-desc">Claude + DALL-E. Contenido para día, semana o mes con imágenes.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/modo-dios#usuarios" target="_blank" class="hub-card">
                        <div class="hub-card-title">👥 Gestión Usuarios</div>
                        <div class="hub-card-url">/admin/modo-dios → Usuarios</div>
                        <div class="hub-card-desc">Buscar, crear usuarios, regalar runas, activar círculo.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/modo-dios#regalos" target="_blank" class="hub-card">
                        <div class="hub-card-title">🎁 Sistema Regalos</div>
                        <div class="hub-card-url">/admin/modo-dios → Regalos</div>
                        <div class="hub-card-desc">Regalar runas/tréboles a usuarios o a todo el círculo.</div>
                    </a>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- GENERADOR DE HISTORIAS -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section" style="border-left: 4px solid #27ae60;">
                <h2>📖 Generador de Historias <span class="badge badge-admin">ADMIN</span></h2>
                <div class="hub-grid">
                    <a href="<?php echo $url; ?>/admin/generador-historias" target="_blank" class="hub-card" style="border-color: #27ae60;">
                        <div class="hub-card-title" style="color: #27ae60;">📖 Generador de Historias</div>
                        <div class="hub-card-url">/admin/generador-historias</div>
                        <div class="hub-card-desc">Genera historias únicas para cada guardián siguiendo BIBLIA-HISTORIAS-GUARDIANES.md. Analiza imágenes, usa sistema de conversión con scoring.</div>
                        <div class="hub-card-uso"><strong>Usalo para:</strong> Crear descripciones de productos que VENDEN.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/corregir-productos" target="_blank" class="hub-card">
                        <div class="hub-card-title">🔧 Corregir Productos</div>
                        <div class="hub-card-url">/admin/corregir-productos</div>
                        <div class="hub-card-desc">Herramienta para corregir y actualizar productos de WooCommerce en lote.</div>
                        <div class="hub-card-uso"><strong>Usalo para:</strong> Arreglar categorías, precios, stocks masivamente.</div>
                    </a>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- ADMIN: CÍRCULO -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section">
                <h2>🔮 Admin del Círculo <span class="badge badge-admin">ADMIN</span></h2>
                <div class="hub-grid">
                    <a href="<?php echo $url; ?>/admin/circulo" target="_blank" class="hub-card">
                        <div class="hub-card-title">🏠 Hub Central</div>
                        <div class="hub-card-url">/admin/circulo</div>
                        <div class="hub-card-desc">Panel principal con stats, Tito Admin y acceso a todo.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/circulo/asistente" target="_blank" class="hub-card">
                        <div class="hub-card-title">🤖 Asistente IA</div>
                        <div class="hub-card-url">/admin/circulo/asistente</div>
                        <div class="hub-card-desc">IA que genera contenido automático: mensajes, meditaciones, rituales.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/circulo/contenido" target="_blank" class="hub-card">
                        <div class="hub-card-title">✍️ Crear Contenido</div>
                        <div class="hub-card-url">/admin/circulo/contenido</div>
                        <div class="hub-card-desc">Crear mensajes, meditaciones y rituales manualmente.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/circulo/calendario" target="_blank" class="hub-card">
                        <div class="hub-card-title">📅 Calendario</div>
                        <div class="hub-card-url">/admin/circulo/calendario</div>
                        <div class="hub-card-desc">Vista mensual de contenido programado y publicado.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/circulo/duende-semana" target="_blank" class="hub-card">
                        <div class="hub-card-title">⭐ Duende de la Semana</div>
                        <div class="hub-card-url">/admin/circulo/duende-semana</div>
                        <div class="hub-card-desc">Seleccionar guardián protagonista de esta semana.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/circulo/duendes" target="_blank" class="hub-card">
                        <div class="hub-card-title">🧚 Guardianes del Círculo</div>
                        <div class="hub-card-url">/admin/circulo/duendes</div>
                        <div class="hub-card-desc">Gestionar guardianes arquetípicos (Dorado, Jade, etc).</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/circulo/maestro" target="_blank" class="hub-card">
                        <div class="hub-card-title">🎓 Panel Maestro</div>
                        <div class="hub-card-url">/admin/circulo/maestro</div>
                        <div class="hub-card-desc">Control avanzado y configuraciones del círculo.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/circulo-contenido" target="_blank" class="hub-card">
                        <div class="hub-card-title">📝 Contenido Publicado</div>
                        <div class="hub-card-url">/admin/circulo-contenido</div>
                        <div class="hub-card-desc">Gestión de contenidos ya publicados.</div>
                    </a>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- CANALIZACIONES -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section" style="border-left: 4px solid #9370DB;">
                <h2>📜 Panel de Canalizaciones <span class="badge badge-admin">ADMIN</span></h2>
                <div class="hub-grid">
                    <a href="<?php echo $url; ?>/admin/canalizaciones" target="_blank" class="hub-card" style="border-color: #9370DB;">
                        <div class="hub-card-title" style="color: #6B4E9F;">📜 Panel de Aprobación</div>
                        <div class="hub-card-url">/admin/canalizaciones</div>
                        <div class="hub-card-desc">Revisar, editar y aprobar canalizaciones antes de enviar. Con resumen IA y chat editor.</div>
                        <div class="hub-card-uso"><strong>Flujo:</strong> Cliente compra → Pendiente → Revisás → Aprobás → Cliente ve en Mi Magia</div>
                    </a>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- PROMOCIONES -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section">
                <h2>🏷️ Promociones <span class="badge badge-admin">ADMIN</span></h2>
                <div class="hub-grid">
                    <a href="<?php echo $url; ?>/admin/promociones" target="_blank" class="hub-card">
                        <div class="hub-card-title">🏷️ Gestión de Promociones</div>
                        <div class="hub-card-url">/admin/promociones</div>
                        <div class="hub-card-desc">Ver y administrar códigos promocionales activos.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/promociones/nueva" target="_blank" class="hub-card">
                        <div class="hub-card-title">➕ Nueva Promoción</div>
                        <div class="hub-card-url">/admin/promociones/nueva</div>
                        <div class="hub-card-desc">Crear nuevo código de descuento.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/promociones/stats" target="_blank" class="hub-card">
                        <div class="hub-card-title">📈 Estadísticas</div>
                        <div class="hub-card-url">/admin/promociones/stats</div>
                        <div class="hub-card-desc">Ver rendimiento de cada código.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/promociones/automaticas" target="_blank" class="hub-card">
                        <div class="hub-card-title">⚡ Automáticas</div>
                        <div class="hub-card-url">/admin/promociones/automaticas</div>
                        <div class="hub-card-desc">Descuentos por cumpleaños, primera compra, etc.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/promociones/relampago" target="_blank" class="hub-card">
                        <div class="hub-card-title">⚡ Relámpago</div>
                        <div class="hub-card-url">/admin/promociones/relampago</div>
                        <div class="hub-card-desc">Flash sales de tiempo limitado.</div>
                    </a>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- OTRAS HERRAMIENTAS -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section">
                <h2>🛠️ Otras Herramientas <span class="badge badge-admin">ADMIN</span></h2>
                <div class="hub-grid">
                    <a href="<?php echo $url; ?>/admin/tito" target="_blank" class="hub-card">
                        <div class="hub-card-title">🤖 Tito Admin</div>
                        <div class="hub-card-url">/admin/tito</div>
                        <div class="hub-card-desc">Asistente IA. "Dale 50 runas a maria@gmail.com"</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/gamificacion" target="_blank" class="hub-card">
                        <div class="hub-card-title">🎮 Gamificación</div>
                        <div class="hub-card-url">/admin/gamificacion</div>
                        <div class="hub-card-desc">Runas, badges, rachas, niveles.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/inteligencia" target="_blank" class="hub-card">
                        <div class="hub-card-title">📊 Analytics</div>
                        <div class="hub-card-url">/admin/inteligencia</div>
                        <div class="hub-card-desc">Métricas y estadísticas de la plataforma.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/sugerencias" target="_blank" class="hub-card">
                        <div class="hub-card-title">💡 Sugerencias</div>
                        <div class="hub-card-url">/admin/sugerencias</div>
                        <div class="hub-card-desc">Ver y responder sugerencias de usuarios.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/comunidad" target="_blank" class="hub-card">
                        <div class="hub-card-title">👥 Comunidad/Foro</div>
                        <div class="hub-card-url">/admin/comunidad</div>
                        <div class="hub-card-desc">Moderar foro, aprobar posts, eliminar spam.</div>
                    </a>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- MI MAGIA (USUARIO) -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section">
                <h2>👤 Mi Magia - Área de Usuario <span class="badge badge-user">USUARIO</span></h2>
                <div class="hub-grid">
                    <a href="<?php echo $url; ?>/mi-magia/login" target="_blank" class="hub-card" style="border-color: #d4af37;">
                        <div class="hub-card-title" style="color: #b8860b;">🔐 Login Magic Link</div>
                        <div class="hub-card-url">/mi-magia/login</div>
                        <div class="hub-card-desc">Acceso sin contraseña. Si no existe, crea cuenta automáticamente.</div>
                    </a>
                    <a href="<?php echo $url; ?>/mi-magia/perfilado" target="_blank" class="hub-card" style="border-color: #9370DB;">
                        <div class="hub-card-title" style="color: #6B4E9F;">📊 Test Perfilado</div>
                        <div class="hub-card-url">/mi-magia/perfilado</div>
                        <div class="hub-card-desc">Test de 6 preguntas: vulnerabilidad, dolor, estilo decisión, poder adquisitivo, creencias.</div>
                    </a>
                    <a href="<?php echo $url; ?>/mi-magia" target="_blank" class="hub-card">
                        <div class="hub-card-title">✨ Dashboard</div>
                        <div class="hub-card-url">/mi-magia</div>
                        <div class="hub-card-desc">Dashboard personal con guardianes, puntos, accesos.</div>
                    </a>
                    <a href="<?php echo $url; ?>/mi-magia/circulo" target="_blank" class="hub-card">
                        <div class="hub-card-title">🔮 Mi Círculo</div>
                        <div class="hub-card-url">/mi-magia/circulo</div>
                        <div class="hub-card-desc">Acceso al círculo exclusivo.</div>
                    </a>
                    <a href="<?php echo $url; ?>/mi-magia/comunidad" target="_blank" class="hub-card">
                        <div class="hub-card-title">👥 Comunidad</div>
                        <div class="hub-card-url">/mi-magia/comunidad</div>
                        <div class="hub-card-desc">Foro de interacción entre usuarios.</div>
                    </a>
                    <a href="<?php echo $url; ?>/mi-magia/sugerencias" target="_blank" class="hub-card">
                        <div class="hub-card-title">💡 Sugerencias</div>
                        <div class="hub-card-url">/mi-magia/sugerencias</div>
                        <div class="hub-card-desc">Buzón de ideas y votación.</div>
                    </a>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- CÍRCULO EXCLUSIVO -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section">
                <h2>🌟 Círculo Exclusivo <span class="badge badge-user">MIEMBROS</span></h2>
                <div class="hub-grid">
                    <a href="<?php echo $url; ?>/circulo" target="_blank" class="hub-card">
                        <div class="hub-card-title">🌟 Portal del Círculo</div>
                        <div class="hub-card-url">/circulo</div>
                        <div class="hub-card-desc">Entrada principal con onboarding y dashboard.</div>
                    </a>
                    <a href="<?php echo $url; ?>/circulo/cursos" target="_blank" class="hub-card">
                        <div class="hub-card-title">🎓 Academia de Guardianes</div>
                        <div class="hub-card-url">/circulo/cursos</div>
                        <div class="hub-card-desc">Cursos con módulos, lecciones y badges.</div>
                    </a>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- PÁGINAS PÚBLICAS -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section">
                <h2>🌐 Páginas Públicas <span class="badge badge-public">PÚBLICO</span></h2>
                <div class="hub-grid">
                    <a href="<?php echo $url; ?>/" target="_blank" class="hub-card">
                        <div class="hub-card-title">🏠 Inicio</div>
                        <div class="hub-card-url">/</div>
                        <div class="hub-card-desc">Landing que redirige a duendesdeluruguay.com</div>
                    </a>
                    <a href="<?php echo $url; ?>/tienda" target="_blank" class="hub-card">
                        <div class="hub-card-title">🛒 Tienda</div>
                        <div class="hub-card-url">/tienda</div>
                        <div class="hub-card-desc">Catálogo de guardianes con filtros.</div>
                    </a>
                    <a href="<?php echo $url; ?>/auth/magic" target="_blank" class="hub-card">
                        <div class="hub-card-title">🔮 Validar Magic Link</div>
                        <div class="hub-card-url">/auth/magic?token=XXX</div>
                        <div class="hub-card-desc">Página que valida enlaces mágicos.</div>
                    </a>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- URLS DINÁMICAS -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section">
                <h2>🔗 URLs Dinámicas <span class="badge badge-user">POR ID</span></h2>
                <div class="hub-grid">
                    <div class="hub-card" style="cursor: default;">
                        <div class="hub-card-title">💬 Portal del Guardián</div>
                        <div class="hub-card-url">/portal/[id]</div>
                        <div class="hub-card-desc">Chat interactivo con guardián adoptado.</div>
                    </div>
                    <div class="hub-card" style="cursor: default;">
                        <div class="hub-card-title">🏅 Certificado</div>
                        <div class="hub-card-url">/certificado/[id]</div>
                        <div class="hub-card-desc">Certificado de autenticidad imprimible.</div>
                    </div>
                    <div class="hub-card" style="cursor: default;">
                        <div class="hub-card-title">📖 Guía Activación</div>
                        <div class="hub-card-url">/guardian/[id]</div>
                        <div class="hub-card-desc">Instrucciones para activar guardián.</div>
                    </div>
                    <div class="hub-card" style="cursor: default;">
                        <div class="hub-card-title">🔮 Lectura</div>
                        <div class="hub-card-url">/lectura/[id]</div>
                        <div class="hub-card-desc">Lectura personalizada.</div>
                    </div>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- REFERENCIA RÁPIDA -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section" style="background: #f0f7ff;">
                <h2>📋 Referencia Rápida</h2>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <tr style="background: #1e3a5f; color: white;">
                        <th style="padding: 10px; text-align: left;">¿Qué quiero hacer?</th>
                        <th style="padding: 10px; text-align: left;">¿A dónde voy?</th>
                    </tr>
                    <tr style="background: #fff8dc;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Control total de TODO</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/modo-dios</code> ⚡</td>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Generar historia de producto</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/generador-historias</code></td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Aprobar canalizaciones</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/canalizaciones</code></td>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Dar runas a usuario</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/modo-dios</code> → Usuarios o <code>/admin/tito</code></td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Crear contenido del círculo</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/modo-dios</code> → Contenido</td>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Ver calendario programado</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/circulo/calendario</code></td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Crear código descuento</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/promociones/nueva</code></td>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Crear usuario / enviar magic link</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/modo-dios</code> → Usuarios</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Ver perfil psicológico usuario</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/api/mi-magia/perfilado?email=XXX</code></td>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Cambiar duende de la semana</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/circulo/duende-semana</code></td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px;">Ver cómo se ve el círculo</td>
                        <td style="padding: 10px;"><code>/circulo</code></td>
                    </tr>
                </table>
            </div>

            <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
                URL base: <strong><?php echo $url; ?></strong><br>
                Hub v2.0 - Actualizado con todas las funcionalidades
            </div>

        </div>
        <?php
    }
}

new DuendesHubControl();
