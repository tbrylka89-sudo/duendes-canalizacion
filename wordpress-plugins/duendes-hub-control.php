<?php
/**
 * Plugin Name: Duendes Hub de Control
 * Description: Centro de control con todos los accesos a la app de Vercel
 * Version: 3.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// URL de tu app en Vercel (solo definir si no existe)
if (!defined('DUENDES_APP_URL')) {
    define('DUENDES_APP_URL', 'https://duendes-vercel.vercel.app');
}

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
            .badge-api { background: #f3e5f5; color: #7b1fa2; }
            .quick-access { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 30px; }
            .quick-btn { background: linear-gradient(135deg, #2d5a87 0%, #1e3a5f 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
            .quick-btn:hover { color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(45,90,135,0.3); }
            .quick-btn.secondary { background: white; color: #1e3a5f; border: 2px solid #1e3a5f; }
            .quick-btn.secondary:hover { background: #f0f7ff; color: #1e3a5f; }
            .quick-btn.gold { background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); color: #1a1a1a; }
            .quick-btn.purple { background: linear-gradient(135deg, #9370DB 0%, #6B4E9F 100%); }
            .quick-btn.green { background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); }
            .quick-btn.jade { background: linear-gradient(135deg, #00A86B 0%, #2E8B57 100%); }
            .guardian-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .guardian-dorado { background: linear-gradient(135deg, #FFD700, #FFA500); color: #1a1a1a; }
            .guardian-obsidiana { background: linear-gradient(135deg, #1a1a1a, #333); color: white; }
            .guardian-indigo { background: linear-gradient(135deg, #4B0082, #6A5ACD); color: white; }
            .guardian-jade { background: linear-gradient(135deg, #00A86B, #2E8B57); color: white; }
        </style>

        <div class="hub-container">
            <div class="hub-header">
                <h1>🎮 Hub de Control - Duendes del Uruguay</h1>
                <p>Todos tus accesos en un solo lugar. Versión 3.0 - Enero 2026</p>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- ACCESOS RÁPIDOS -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="quick-access">
                <a href="<?php echo $url; ?>/admin/modo-dios" target="_blank" class="quick-btn gold">⚡ MODO DIOS</a>
                <a href="<?php echo $url; ?>/admin/generador-historias" target="_blank" class="quick-btn green">📖 Generador Historias</a>
                <a href="<?php echo $url; ?>/admin/circulo" target="_blank" class="quick-btn">🏠 Hub Círculo</a>
                <a href="<?php echo $url; ?>/admin/circulo/maestro" target="_blank" class="quick-btn jade">🎓 Panel Maestro</a>
                <a href="<?php echo $url; ?>/admin/canalizaciones" target="_blank" class="quick-btn purple">📜 Canalizaciones</a>
                <a href="<?php echo $url; ?>/admin/gamificacion" target="_blank" class="quick-btn secondary">🎮 Gamificación</a>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- GUARDIANES SEMANALES - NUEVO -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section" style="border: 2px solid #00A86B; background: linear-gradient(135deg, rgba(0,168,107,0.1), rgba(46,139,87,0.05));">
                <h2>🧚 Guardianes Maestros del Círculo <span class="badge badge-new">NUEVO v3.0</span></h2>
                <p style="margin-bottom: 20px; color: #555;">Sistema de rotación semanal. Cada guardián guía el contenido de su semana.</p>

                <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px;">
                    <span class="guardian-badge guardian-dorado">🌟 Dorado - Abundancia</span>
                    <span class="guardian-badge guardian-obsidiana">🛡️ Obsidiana - Protección</span>
                    <span class="guardian-badge guardian-indigo">📚 Índigo - Sabiduría</span>
                    <span class="guardian-badge guardian-jade">💚 Jade - Sanación</span>
                </div>

                <div class="hub-grid">
                    <a href="<?php echo $url; ?>/admin/circulo/duende-semana" target="_blank" class="hub-card" style="border-color: #00A86B;">
                        <div class="hub-card-title" style="color: #00A86B;">⭐ Duende de la Semana</div>
                        <div class="hub-card-url">/admin/circulo/duende-semana</div>
                        <div class="hub-card-desc">Seleccionar y configurar el guardián protagonista de esta semana.</div>
                        <div class="hub-card-uso"><strong>Rotación Enero:</strong> Dorado (1-7) → Obsidiana (8-14) → Índigo (15-21) → Jade (22-31)</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/circulo/duendes" target="_blank" class="hub-card">
                        <div class="hub-card-title">🧚 Gestión de Guardianes</div>
                        <div class="hub-card-url">/admin/circulo/duendes</div>
                        <div class="hub-card-desc">Ver y editar los 6 guardianes maestros: historias, personalidades, cristales, colores.</div>
                    </a>
                    <a href="<?php echo $url; ?>/api/circulo/duende-semana" target="_blank" class="hub-card">
                        <div class="hub-card-title">🔌 API Duende Semana</div>
                        <div class="hub-card-url">/api/circulo/duende-semana</div>
                        <div class="hub-card-desc">Endpoint público que devuelve el guardián actual con su personalidad y contenido.</div>
                        <div class="hub-card-uso"><strong>Params:</strong> ?mensaje=1 (genera saludo IA), ?contenido=0 (sin contenido)</div>
                    </a>
                    <a href="<?php echo $url; ?>/api/admin/circulo/seed-enero" target="_blank" class="hub-card">
                        <div class="hub-card-title">🌱 Seed Enero 2026</div>
                        <div class="hub-card-url">/api/admin/circulo/seed-enero</div>
                        <div class="hub-card-desc">POST para poblar contenido de enero (23 días pre-generados).</div>
                        <div class="hub-card-uso"><strong>Ya ejecutado:</strong> 23 días, 4 semanas, 6 guardianes</div>
                    </a>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- MODO DIOS -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section" style="border: 2px solid #d4af37; background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(244, 208, 63, 0.05));">
                <h2>⚡ MODO DIOS - Control Total</h2>
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
                        <div class="hub-card-desc">Genera historias únicas para cada guardián. Modo directo, batch inteligente, creador de productos.</div>
                        <div class="hub-card-uso"><strong>Sistema:</strong> Hooks + Sincrodestinos + Scoring (mín 30/50) + Cierres adaptativos</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/corregir-productos" target="_blank" class="hub-card">
                        <div class="hub-card-title">🔧 Corregir Productos</div>
                        <div class="hub-card-url">/admin/corregir-productos</div>
                        <div class="hub-card-desc">Claude Haiku corrige ortografía respetando español rioplatense.</div>
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
                    <a href="<?php echo $url; ?>/admin/circulo/maestro" target="_blank" class="hub-card" style="border-color: #00A86B;">
                        <div class="hub-card-title" style="color: #00A86B;">🎓 Panel Maestro</div>
                        <div class="hub-card-url">/admin/circulo/maestro</div>
                        <div class="hub-card-desc">Explorar Replicate (20+ modelos), generar cursos con Gemini, imágenes con DALL-E.</div>
                        <div class="hub-card-uso"><strong>IAs:</strong> Claude, Gemini, DALL-E 3, Replicate (Flux, SDXL, video)</div>
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
                    <a href="<?php echo $url; ?>/admin/circulo/asistente" target="_blank" class="hub-card">
                        <div class="hub-card-title">🤖 Asistente IA</div>
                        <div class="hub-card-url">/admin/circulo/asistente</div>
                        <div class="hub-card-desc">IA que genera contenido automático: mensajes, meditaciones, rituales.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/circulo-contenido" target="_blank" class="hub-card">
                        <div class="hub-card-title">📝 Contenido Publicado</div>
                        <div class="hub-card-url">/admin/circulo-contenido</div>
                        <div class="hub-card-desc">Gestión de contenidos ya publicados por mes.</div>
                    </a>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- APIs DEL CÍRCULO - NUEVO -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section" style="border-left: 4px solid #7b1fa2;">
                <h2>🔌 APIs del Círculo <span class="badge badge-api">API</span></h2>
                <div class="hub-grid">
                    <a href="<?php echo $url; ?>/api/circulo/contenido?tipo=hoy" target="_blank" class="hub-card">
                        <div class="hub-card-title">📄 Contenido del Día</div>
                        <div class="hub-card-url">/api/circulo/contenido?tipo=hoy</div>
                        <div class="hub-card-desc">Contenido de hoy con título, afirmación, enseñanza, cierre.</div>
                        <div class="hub-card-uso"><strong>Params:</strong> tipo=hoy|semana|mes|archivo, dia=X, mes=X, ano=X</div>
                    </a>
                    <a href="<?php echo $url; ?>/api/admin/circulo/contenidos?mes=1&ano=2026" target="_blank" class="hub-card">
                        <div class="hub-card-title">📋 Listar Contenidos</div>
                        <div class="hub-card-url">/api/admin/circulo/contenidos</div>
                        <div class="hub-card-desc">Lista todos los contenidos del mes. POST para crear, PATCH para publicar, DELETE para borrar.</div>
                    </a>
                    <a href="<?php echo $url; ?>/api/comunidad/bots?tipo=stats" target="_blank" class="hub-card">
                        <div class="hub-card-title">🤖 Bots del Foro</div>
                        <div class="hub-card-url">/api/comunidad/bots</div>
                        <div class="hub-card-desc">Sistema de 50 bots con 62+ posts sobre guardianes.</div>
                        <div class="hub-card-uso"><strong>Params:</strong> tipo=stats|actividad|feed|posts</div>
                    </a>
                    <a href="<?php echo $url; ?>/api/admin/cursos/generar-con-ia" target="_blank" class="hub-card">
                        <div class="hub-card-title">🎓 Generar Cursos</div>
                        <div class="hub-card-url">/api/admin/cursos/generar-con-ia</div>
                        <div class="hub-card-desc">Genera cursos completos con Gemini o Claude + imágenes DALL-E.</div>
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
                        <div class="hub-card-uso"><strong>Flujo:</strong> Compra → Pendiente → Revisás → Aprobás → Mi Magia</div>
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
                        <div class="hub-card-desc">Asistente IA con perfilado psicológico integrado.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/gamificacion" target="_blank" class="hub-card">
                        <div class="hub-card-title">🎮 Gamificación</div>
                        <div class="hub-card-url">/admin/gamificacion</div>
                        <div class="hub-card-desc">Runas, badges, rachas, niveles, cofre diario.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/inteligencia" target="_blank" class="hub-card">
                        <div class="hub-card-title">📊 Analytics</div>
                        <div class="hub-card-url">/admin/inteligencia</div>
                        <div class="hub-card-desc">Métricas y estadísticas de la plataforma.</div>
                    </a>
                    <a href="<?php echo $url; ?>/admin/promociones" target="_blank" class="hub-card">
                        <div class="hub-card-title">🏷️ Promociones</div>
                        <div class="hub-card-url">/admin/promociones</div>
                        <div class="hub-card-desc">Códigos de descuento, flash sales, automáticas.</div>
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
                        <div class="hub-card-desc">Acceso sin contraseña. Si no existe, crea cuenta.</div>
                    </a>
                    <a href="<?php echo $url; ?>/mi-magia" target="_blank" class="hub-card">
                        <div class="hub-card-title">✨ Dashboard</div>
                        <div class="hub-card-url">/mi-magia</div>
                        <div class="hub-card-desc">Dashboard personal con guardianes, puntos, gamificación.</div>
                    </a>
                    <a href="<?php echo $url; ?>/mi-magia/circulo" target="_blank" class="hub-card">
                        <div class="hub-card-title">🔮 Mi Círculo</div>
                        <div class="hub-card-url">/mi-magia/circulo</div>
                        <div class="hub-card-desc">Dashboard del Círculo con guardián de la semana.</div>
                    </a>
                    <a href="<?php echo $url; ?>/mi-magia/comunidad" target="_blank" class="hub-card">
                        <div class="hub-card-title">👥 Comunidad</div>
                        <div class="hub-card-url">/mi-magia/comunidad</div>
                        <div class="hub-card-desc">Foro de interacción entre usuarios + bots.</div>
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
                        <div class="hub-card-desc">Cursos generados con Gemini, módulos y badges.</div>
                    </a>
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
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Cambiar guardián de la semana</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/circulo/duende-semana</code></td>
                    </tr>
                    <tr style="background: #e8f5e9;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Ver contenido de enero 2026</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/api/admin/circulo/contenidos?mes=1&ano=2026</code></td>
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
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/modo-dios</code> → Usuarios</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Crear contenido del círculo</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/modo-dios</code> → Contenido</td>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Generar curso con IA</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/admin/circulo/maestro</code></td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Ver stats de bots/foro</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>/api/comunidad/bots?tipo=stats</code></td>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px;">Ver calendario programado</td>
                        <td style="padding: 10px;"><code>/admin/circulo/calendario</code></td>
                    </tr>
                </table>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <!-- INTEGRACIONES DE IA -->
            <!-- ═══════════════════════════════════════════════════════════════════════ -->
            <div class="hub-section" style="background: linear-gradient(135deg, #f3e5f5, #e8f5e9);">
                <h2>🤖 Integraciones de IA Disponibles</h2>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <tr style="background: #7b1fa2; color: white;">
                        <th style="padding: 10px; text-align: left;">API</th>
                        <th style="padding: 10px; text-align: left;">Modelo</th>
                        <th style="padding: 10px; text-align: left;">Usos</th>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Claude</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">claude-sonnet-4</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Historias, canalizaciones, contenido círculo, chat Tito</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>OpenAI</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">DALL-E 3</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Imágenes para contenido del círculo y cursos</td>
                    </tr>
                    <tr style="background: white;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Gemini</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">gemini-2.0-flash-exp</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Cursos, imágenes alternativas</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px;"><strong>Replicate</strong></td>
                        <td style="padding: 10px;">Flux, SDXL, Ideogram, video</td>
                        <td style="padding: 10px;">20+ modelos de imagen y video</td>
                    </tr>
                </table>
            </div>

            <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
                URL base: <strong><?php echo $url; ?></strong><br>
                Hub v3.0 - Sistema Círculo de Duendes Completo - Enero 2026
            </div>

        </div>
        <?php
    }
}

new DuendesHubControl();
