<?php
/**
 * Plugin Name: Duendes Canalizador
 * Description: Sistema de canalización automática - La IA analiza la foto y genera TODO
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// AGREGAR PÁGINA DE ADMIN
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_menu', function() {
    add_menu_page(
        'Canalizar Guardianes',
        '🪄 Canalizar',
        'manage_woocommerce',
        'duendes-canalizar',
        'duendes_canalizador_page',
        'dashicons-visibility',
        56
    );
});

function duendes_canalizador_page() {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: #0a0a0a;
                color: #e0e0e0;
                min-height: 100vh;
            }

            .canalizador-app {
                max-width: 1600px;
                margin: 0 auto;
                padding: 40px;
            }

            /* Header */
            .header {
                text-align: center;
                margin-bottom: 60px;
                padding: 40px;
                background: linear-gradient(135deg, rgba(198,169,98,0.1) 0%, rgba(198,169,98,0.02) 100%);
                border: 1px solid rgba(198,169,98,0.2);
                border-radius: 24px;
            }

            .header h1 {
                font-family: 'Cinzel', serif;
                font-size: 48px;
                color: #C6A962;
                margin-bottom: 15px;
                letter-spacing: 4px;
            }

            .header p {
                font-size: 18px;
                color: rgba(255,255,255,0.6);
                max-width: 600px;
                margin: 0 auto;
            }

            .stats {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin-top: 30px;
            }

            .stat {
                text-align: center;
            }

            .stat-number {
                font-family: 'Cinzel', serif;
                font-size: 36px;
                color: #C6A962;
            }

            .stat-label {
                font-size: 12px;
                color: rgba(255,255,255,0.4);
                text-transform: uppercase;
                letter-spacing: 2px;
            }

            /* Tabs */
            .tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 30px;
            }

            .tab {
                padding: 15px 30px;
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px;
                color: rgba(255,255,255,0.6);
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s;
            }

            .tab:hover {
                border-color: rgba(198,169,98,0.3);
                color: #fff;
            }

            .tab.active {
                background: rgba(198,169,98,0.15);
                border-color: #C6A962;
                color: #C6A962;
            }

            .tab .count {
                display: inline-block;
                background: rgba(198,169,98,0.3);
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 12px;
                margin-left: 8px;
            }

            /* Grid de productos */
            .productos-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 25px;
            }

            .producto-card {
                background: linear-gradient(145deg, #151515 0%, #0d0d0d 100%);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 20px;
                overflow: hidden;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .producto-card:hover {
                transform: translateY(-8px);
                border-color: rgba(198,169,98,0.3);
                box-shadow: 0 30px 60px rgba(0,0,0,0.4);
            }

            .producto-imagen {
                position: relative;
                aspect-ratio: 1;
                overflow: hidden;
                background: #1a1a1a;
            }

            .producto-imagen img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.5s;
            }

            .producto-card:hover .producto-imagen img {
                transform: scale(1.08);
            }

            .producto-badge {
                position: absolute;
                top: 15px;
                right: 15px;
                padding: 6px 14px;
                background: rgba(0,0,0,0.7);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .producto-badge.pendiente {
                border: 1px solid #f59e0b;
                color: #f59e0b;
            }

            .producto-badge.canalizado {
                border: 1px solid #22c55e;
                color: #22c55e;
            }

            .producto-info {
                padding: 25px;
            }

            .producto-nombre {
                font-family: 'Cinzel', serif;
                font-size: 20px;
                color: #fff;
                margin-bottom: 8px;
            }

            .producto-meta {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
                font-size: 13px;
                color: rgba(255,255,255,0.4);
            }

            .producto-precio {
                color: #C6A962;
            }

            .btn-canalizar {
                width: 100%;
                padding: 16px;
                background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
                border: none;
                border-radius: 12px;
                color: #000;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .btn-canalizar:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(198,169,98,0.3);
            }

            .btn-canalizar:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .btn-ver {
                width: 100%;
                padding: 14px;
                background: transparent;
                border: 1px solid rgba(198,169,98,0.3);
                border-radius: 12px;
                color: #C6A962;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s;
                text-decoration: none;
                text-align: center;
                display: block;
            }

            .btn-ver:hover {
                background: rgba(198,169,98,0.1);
                border-color: #C6A962;
            }

            /* Info adicional del canalizado */
            .producto-canalizado-info {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .canalizado-tipo {
                display: inline-block;
                padding: 4px 12px;
                background: rgba(198,169,98,0.15);
                border-radius: 20px;
                font-size: 12px;
                color: #C6A962;
                margin-bottom: 10px;
            }

            .canalizado-fecha {
                font-size: 12px;
                color: rgba(255,255,255,0.3);
            }

            .canalizado-qr {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-top: 15px;
                padding: 15px;
                background: rgba(0,0,0,0.3);
                border-radius: 12px;
            }

            .canalizado-qr img {
                width: 60px;
                height: 60px;
                border-radius: 8px;
            }

            .canalizado-qr-info {
                flex: 1;
            }

            .canalizado-codigo {
                font-family: 'Cinzel', serif;
                font-size: 14px;
                color: #C6A962;
            }

            .canalizado-qr-actions {
                display: flex;
                gap: 8px;
                margin-top: 8px;
            }

            .btn-qr-action {
                padding: 6px 12px;
                background: rgba(198,169,98,0.2);
                border: none;
                border-radius: 6px;
                color: #C6A962;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .btn-qr-action:hover {
                background: rgba(198,169,98,0.3);
            }

            /* Modal de canalización */
            .modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.9);
                backdrop-filter: blur(10px);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                padding: 40px;
            }

            .modal-overlay.visible {
                display: flex;
            }

            .modal {
                background: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%);
                border: 1px solid rgba(198,169,98,0.3);
                border-radius: 24px;
                max-width: 700px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
            }

            .modal-header {
                padding: 30px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .modal-header h2 {
                font-family: 'Cinzel', serif;
                font-size: 24px;
                color: #C6A962;
            }

            .modal-close {
                width: 40px;
                height: 40px;
                background: rgba(255,255,255,0.05);
                border: none;
                border-radius: 50%;
                color: #fff;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .modal-close:hover {
                background: rgba(255,255,255,0.1);
            }

            .modal-body {
                padding: 30px;
            }

            .canalizando-estado {
                text-align: center;
                padding: 40px;
                position: relative;
                overflow: hidden;
            }

            /* Efecto de particulas magicas */
            .canalizando-estado::before {
                content: '';
                position: absolute;
                inset: 0;
                background: radial-gradient(circle at 50% 50%, rgba(198,169,98,0.1) 0%, transparent 70%);
                animation: pulse-bg 2s ease-in-out infinite;
            }

            @keyframes pulse-bg {
                0%, 100% { opacity: 0.5; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.1); }
            }

            .canalizando-spinner {
                width: 100px;
                height: 100px;
                position: relative;
                margin: 0 auto 30px;
            }

            .canalizando-spinner::before,
            .canalizando-spinner::after {
                content: '';
                position: absolute;
                inset: 0;
                border: 3px solid transparent;
                border-radius: 50%;
            }

            .canalizando-spinner::before {
                border-top-color: #C6A962;
                animation: spin 1s linear infinite;
            }

            .canalizando-spinner::after {
                border-right-color: rgba(198,169,98,0.5);
                animation: spin 1.5s linear infinite reverse;
            }

            .canalizando-spinner-inner {
                position: absolute;
                inset: 15px;
                border: 2px solid rgba(198,169,98,0.3);
                border-top-color: #C6A962;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }

            .canalizando-icono {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                animation: float-icon 2s ease-in-out infinite;
            }

            @keyframes float-icon {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-5px) scale(1.1); }
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .canalizando-mensaje {
                font-family: 'Cinzel', serif;
                font-size: 20px;
                color: #C6A962;
                margin-bottom: 15px;
                position: relative;
                animation: glow-text 2s ease-in-out infinite;
            }

            @keyframes glow-text {
                0%, 100% { text-shadow: 0 0 10px rgba(198,169,98,0.3); }
                50% { text-shadow: 0 0 30px rgba(198,169,98,0.6); }
            }

            .canalizando-detalle {
                font-size: 14px;
                color: rgba(255,255,255,0.5);
                position: relative;
            }

            .canalizando-fases {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin-top: 30px;
                position: relative;
            }

            .canalizando-fase {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                opacity: 0.3;
                transition: all 0.5s;
            }

            .canalizando-fase.activa {
                opacity: 1;
            }

            .canalizando-fase.completada {
                opacity: 0.7;
            }

            .canalizando-fase.completada .fase-icono {
                color: #22c55e;
            }

            .fase-icono {
                font-size: 24px;
                transition: all 0.3s;
            }

            .fase-texto {
                font-size: 11px;
                color: rgba(255,255,255,0.6);
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            /* Resultado de canalización */
            .resultado-exitoso {
                text-align: center;
            }

            .resultado-icono {
                font-size: 80px;
                margin-bottom: 20px;
            }

            .resultado-nombre {
                font-family: 'Cinzel', serif;
                font-size: 32px;
                color: #C6A962;
                margin-bottom: 10px;
            }

            .resultado-subtitulo {
                font-size: 16px;
                color: rgba(255,255,255,0.6);
                font-style: italic;
                margin-bottom: 30px;
            }

            .resultado-datos {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-bottom: 30px;
                text-align: center;
            }

            .resultado-dato {
                padding: 15px;
                background: rgba(0,0,0,0.3);
                border-radius: 12px;
            }

            .resultado-dato-label {
                font-size: 11px;
                color: rgba(255,255,255,0.4);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
            }

            .resultado-dato-valor {
                font-size: 16px;
                color: #C6A962;
            }

            .resultado-qr-box {
                display: flex;
                align-items: center;
                gap: 20px;
                padding: 20px;
                background: rgba(198,169,98,0.1);
                border: 1px solid rgba(198,169,98,0.3);
                border-radius: 16px;
                margin-bottom: 30px;
            }

            .resultado-qr-box img {
                width: 100px;
                height: 100px;
                border-radius: 12px;
            }

            .resultado-qr-info h4 {
                font-family: 'Cinzel', serif;
                color: #C6A962;
                margin-bottom: 5px;
            }

            .resultado-qr-info p {
                font-size: 13px;
                color: rgba(255,255,255,0.5);
            }

            .resultado-preview {
                text-align: left;
                padding: 20px;
                background: rgba(0,0,0,0.2);
                border-radius: 12px;
                margin-bottom: 30px;
            }

            .resultado-preview h4 {
                color: #C6A962;
                margin-bottom: 15px;
                font-size: 14px;
            }

            .resultado-preview p {
                font-size: 14px;
                color: rgba(255,255,255,0.7);
                line-height: 1.7;
            }

            .resultado-acciones {
                display: flex;
                gap: 15px;
            }

            .resultado-acciones .btn-canalizar {
                flex: 1;
            }

            /* Empty state */
            .empty-state {
                text-align: center;
                padding: 80px 40px;
                background: rgba(255,255,255,0.02);
                border: 1px dashed rgba(255,255,255,0.1);
                border-radius: 20px;
            }

            .empty-state-icon {
                font-size: 60px;
                margin-bottom: 20px;
                opacity: 0.3;
            }

            .empty-state h3 {
                font-family: 'Cinzel', serif;
                font-size: 24px;
                color: rgba(255,255,255,0.4);
                margin-bottom: 10px;
            }

            .empty-state p {
                color: rgba(255,255,255,0.3);
            }

            /* Loading state */
            .loading-productos {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 100px;
            }

            .loading-productos .canalizando-spinner {
                margin-bottom: 20px;
            }

            /* Campo de notas */
            .notas-container {
                margin-bottom: 15px;
                padding: 15px;
                background: rgba(0,0,0,0.3);
                border-radius: 12px;
                border: 1px solid rgba(255,255,255,0.1);
            }

            .notas-label {
                display: block;
                font-size: 13px;
                color: #C6A962;
                margin-bottom: 8px;
                font-weight: 500;
            }

            .notas-input {
                width: 100%;
                padding: 12px;
                background: rgba(0,0,0,0.4);
                border: 1px solid rgba(198,169,98,0.3);
                border-radius: 8px;
                color: #fff;
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                resize: vertical;
                transition: all 0.3s;
            }

            .notas-input:focus {
                outline: none;
                border-color: #C6A962;
                box-shadow: 0 0 20px rgba(198,169,98,0.2);
            }

            .notas-input::placeholder {
                color: rgba(255,255,255,0.3);
                font-style: italic;
            }

            .notas-hint {
                font-size: 11px;
                color: rgba(255,255,255,0.4);
                margin-top: 6px;
                font-style: italic;
            }

            /* Botones secundarios */
            .btn-recanalizar {
                width: 100%;
                padding: 12px;
                background: transparent;
                border: 1px solid rgba(245,158,11,0.5);
                border-radius: 10px;
                color: #f59e0b;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.3s;
                margin-top: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .btn-recanalizar:hover {
                background: rgba(245,158,11,0.1);
                border-color: #f59e0b;
            }

            .botones-canalizado {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-top: 15px;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .canalizador-app {
                    padding: 20px;
                }

                .header h1 {
                    font-size: 32px;
                }

                .stats {
                    flex-direction: column;
                    gap: 20px;
                }

                .productos-grid {
                    grid-template-columns: 1fr;
                }

                .resultado-datos {
                    grid-template-columns: 1fr;
                }

                .notas-input {
                    font-size: 14px;
                }
            }
        </style>
    </head>
    <body>
        <div class="canalizador-app">
            <!-- Header -->
            <header class="header">
                <h1>🪄 Canalizador de Guardianes</h1>
                <p>La IA analiza la foto del guardián y genera automáticamente toda su historia, personalidad, y datos mágicos</p>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-number" id="stat-pendientes">-</div>
                        <div class="stat-label">Pendientes</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number" id="stat-canalizados">-</div>
                        <div class="stat-label">Canalizados</div>
                    </div>
                </div>
            </header>

            <!-- Tabs -->
            <div class="tabs">
                <div class="tab active" data-tab="pendientes" onclick="cambiarTab('pendientes')">
                    Pendientes <span class="count" id="count-pendientes">0</span>
                </div>
                <div class="tab" data-tab="canalizados" onclick="cambiarTab('canalizados')">
                    Canalizados <span class="count" id="count-canalizados">0</span>
                </div>
            </div>

            <!-- Contenido -->
            <div id="contenido-pendientes" class="productos-grid">
                <div class="loading-productos">
                    <div class="canalizando-spinner"></div>
                    <p>Cargando productos...</p>
                </div>
            </div>

            <div id="contenido-canalizados" class="productos-grid" style="display: none;">
            </div>
        </div>

        <!-- Modal de canalización -->
        <div class="modal-overlay" id="modal">
            <div class="modal">
                <div class="modal-header">
                    <h2 id="modal-titulo">Canalizando...</h2>
                    <button class="modal-close" onclick="cerrarModal()">×</button>
                </div>
                <div class="modal-body" id="modal-body">
                    <!-- Contenido dinámico -->
                </div>
            </div>
        </div>

        <script>
        const API_URL = 'https://duendes-vercel.vercel.app/api/admin/canalizar';
        let productosData = { pendientes: [], canalizados: [] };

        // Cargar productos al iniciar
        document.addEventListener('DOMContentLoaded', cargarProductos);

        async function cargarProductos() {
            try {
                const res = await fetch(API_URL);
                const data = await res.json();

                productosData = data;

                // Actualizar stats
                document.getElementById('stat-pendientes').textContent = data.pendientes?.length || 0;
                document.getElementById('stat-canalizados').textContent = data.canalizados?.length || 0;
                document.getElementById('count-pendientes').textContent = data.pendientes?.length || 0;
                document.getElementById('count-canalizados').textContent = data.canalizados?.length || 0;

                // Renderizar
                renderizarPendientes(data.pendientes || []);
                renderizarCanalizados(data.canalizados || []);

            } catch (e) {
                console.error('Error cargando productos:', e);
                document.getElementById('contenido-pendientes').innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">⚠️</div>
                        <h3>Error al cargar</h3>
                        <p>${e.message}</p>
                    </div>
                `;
            }
        }

        function renderizarPendientes(productos) {
            const container = document.getElementById('contenido-pendientes');

            if (productos.length === 0) {
                container.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <div class="empty-state-icon">✨</div>
                        <h3>Todos los guardianes están canalizados</h3>
                        <p>Subí un producto nuevo con foto para canalizarlo</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = productos.map(p => `
                <div class="producto-card" data-id="${p.id}">
                    <div class="producto-imagen">
                        <img src="${p.imagen}" alt="${p.nombre}">
                        <div class="producto-badge pendiente">Pendiente</div>
                    </div>
                    <div class="producto-info">
                        <h3 class="producto-nombre">${p.nombre || 'Sin nombre'}</h3>
                        <div class="producto-meta">
                            <span class="producto-precio">$${p.precio || 0} USD</span>
                            <span>ID: ${p.id}</span>
                        </div>

                        <!-- Campo de notas personalizadas -->
                        <div class="notas-container">
                            <label class="notas-label">📝 Notas para la IA (opcional)</label>
                            <textarea
                                id="notas-${p.id}"
                                class="notas-input"
                                placeholder="Ej: Mide 25 cm, tiene amatista en el báculo, es anciana, femenino, energía tranquila..."
                                rows="3"
                            ></textarea>
                            <div class="notas-hint">La IA interpretará estas notas e incluirá los detalles en la historia</div>
                        </div>

                        <button class="btn-canalizar" onclick="iniciarCanalizacion(${p.id}, '${p.imagen}', '${p.nombre || ''}')">
                            🪄 Canalizar con IA
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function renderizarCanalizados(productos) {
            const container = document.getElementById('contenido-canalizados');

            if (productos.length === 0) {
                container.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <div class="empty-state-icon">🪄</div>
                        <h3>Ningún guardián canalizado aún</h3>
                        <p>Canalizá tu primer guardián en la pestaña Pendientes</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = productos.map(p => {
                const codigo = `DU${new Date(p.fechaCanalizacion || Date.now()).getFullYear().toString().slice(-2)}${(new Date(p.fechaCanalizacion || Date.now()).getMonth()+1).toString().padStart(2,'0')}-${p.id.toString().padStart(5,'0')}`;
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://duendesuy.10web.cloud/mi-magia/?codigo=' + codigo)}`;

                return `
                <div class="producto-card" data-id="${p.id}">
                    <div class="producto-imagen">
                        <img src="${p.imagen}" alt="${p.nombre}">
                        <div class="producto-badge canalizado">Canalizado</div>
                    </div>
                    <div class="producto-info">
                        <h3 class="producto-nombre">${p.nombre}</h3>
                        <div class="producto-meta">
                            <span class="producto-precio">$${p.precio || 0} USD</span>
                            <span>${p.tipo || 'Guardián'}</span>
                        </div>

                        <div class="producto-canalizado-info">
                            <div class="canalizado-tipo">${p.tipo || 'Guardián'}</div>
                            <div class="canalizado-fecha">Canalizado: ${new Date(p.fechaCanalizacion || Date.now()).toLocaleDateString('es-UY')}</div>

                            <div class="canalizado-qr">
                                <img src="${qrUrl}" alt="QR">
                                <div class="canalizado-qr-info">
                                    <div class="canalizado-codigo">${codigo}</div>
                                    <div class="canalizado-qr-actions">
                                        <button class="btn-qr-action" onclick="imprimirQR('${qrUrl}', '${p.nombre}', '${codigo}')">🖨️ Imprimir</button>
                                        <button class="btn-qr-action" onclick="copiarCodigo('${codigo}')">📋 Copiar</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Notas para recanalización -->
                        <div class="notas-container" style="margin-top: 15px;">
                            <label class="notas-label">📝 Notas para recanalizar (opcional)</label>
                            <textarea
                                id="notas-rec-${p.id}"
                                class="notas-input"
                                placeholder="Agregar detalles nuevos o corregir información..."
                                rows="2"
                            ></textarea>
                        </div>

                        <div class="botones-canalizado">
                            <a href="${p.url}" target="_blank" class="btn-ver">
                                Ver producto →
                            </a>
                            <button class="btn-recanalizar" onclick="recanalizar(${p.id}, '${p.imagen}', '${p.nombre || ''}')">
                                🔄 Recanalizar
                            </button>
                        </div>
                    </div>
                </div>
            `}).join('');
        }

        function cambiarTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');

            document.getElementById('contenido-pendientes').style.display = tab === 'pendientes' ? 'grid' : 'none';
            document.getElementById('contenido-canalizados').style.display = tab === 'canalizados' ? 'grid' : 'none';
        }

        async function iniciarCanalizacion(productId, imageUrl, nombrePrevio) {
            const modal = document.getElementById('modal');
            const modalTitulo = document.getElementById('modal-titulo');
            const modalBody = document.getElementById('modal-body');

            // Obtener notas del textarea
            const notasTextarea = document.getElementById(`notas-${productId}`);
            const notas = notasTextarea ? notasTextarea.value.trim() : '';

            modal.classList.add('visible');
            modalTitulo.textContent = 'Canalizando...';

            // Reproducir sonido místico
            playMagicSound();

            modalBody.innerHTML = `
                <div class="canalizando-estado">
                    <div class="canalizando-spinner">
                        <div class="canalizando-spinner-inner"></div>
                        <div class="canalizando-icono">🔮</div>
                    </div>
                    <div class="canalizando-mensaje">Conectando con el plano etérico...</div>
                    <div class="canalizando-detalle">Claude está canalizando la esencia del guardián${notas ? ' con tus notas' : ''}</div>

                    <div class="canalizando-fases">
                        <div class="canalizando-fase activa" id="fase-1">
                            <span class="fase-icono">👁️</span>
                            <span class="fase-texto">Observando</span>
                        </div>
                        <div class="canalizando-fase" id="fase-2">
                            <span class="fase-icono">✨</span>
                            <span class="fase-texto">Canalizando</span>
                        </div>
                        <div class="canalizando-fase" id="fase-3">
                            <span class="fase-icono">📜</span>
                            <span class="fase-texto">Escribiendo</span>
                        </div>
                        <div class="canalizando-fase" id="fase-4">
                            <span class="fase-icono">🔮</span>
                            <span class="fase-texto">Sellando</span>
                        </div>
                    </div>
                </div>
            `;

            // Animar fases
            animarFases();

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productId,
                        imageUrl,
                        nombrePrevio: nombrePrevio || null,
                        notas: notas || null
                    })
                });

                const data = await res.json();

                if (data.success) {
                    mostrarResultadoExitoso(data);
                } else {
                    throw new Error(data.error || 'Error desconocido');
                }

            } catch (e) {
                modalBody.innerHTML = `
                    <div class="canalizando-estado">
                        <div style="font-size: 60px; margin-bottom: 20px;">❌</div>
                        <div class="canalizando-mensaje" style="color: #ef4444;">Error en la canalización</div>
                        <div class="canalizando-detalle">${e.message}</div>
                        <button class="btn-canalizar" style="margin-top: 30px; max-width: 200px;" onclick="cerrarModal()">
                            Cerrar
                        </button>
                    </div>
                `;
            }
        }

        // Función para recanalizar un guardián ya canalizado
        async function recanalizar(productId, imageUrl, nombrePrevio) {
            if (!confirm('¿Estás segura de que querés recanalizar este guardián? Se generará una nueva historia y datos.')) {
                return;
            }

            const modal = document.getElementById('modal');
            const modalTitulo = document.getElementById('modal-titulo');
            const modalBody = document.getElementById('modal-body');

            // Obtener notas del textarea de recanalización
            const notasTextarea = document.getElementById(`notas-rec-${productId}`);
            const notas = notasTextarea ? notasTextarea.value.trim() : '';

            modal.classList.add('visible');
            modalTitulo.textContent = 'Recanalizando...';
            modalBody.innerHTML = `
                <div class="canalizando-estado">
                    <div class="canalizando-spinner"></div>
                    <div class="canalizando-mensaje">Reconectando con la esencia del guardián...</div>
                    <div class="canalizando-detalle">Claude está recanalizando${notas ? ' con las nuevas notas' : ''}. Esto puede tardar 30-60 segundos.</div>
                </div>
            `;

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productId,
                        imageUrl,
                        nombrePrevio: nombrePrevio || null,
                        notas: notas || null,
                        recanalizar: true
                    })
                });

                const data = await res.json();

                if (data.success) {
                    mostrarResultadoExitoso(data, true);
                } else {
                    throw new Error(data.error || 'Error desconocido');
                }

            } catch (e) {
                modalBody.innerHTML = `
                    <div class="canalizando-estado">
                        <div style="font-size: 60px; margin-bottom: 20px;">❌</div>
                        <div class="canalizando-mensaje" style="color: #ef4444;">Error en la recanalización</div>
                        <div class="canalizando-detalle">${e.message}</div>
                        <button class="btn-canalizar" style="margin-top: 30px; max-width: 200px;" onclick="cerrarModal()">
                            Cerrar
                        </button>
                    </div>
                `;
            }
        }

        function mostrarResultadoExitoso(data, esRecanalizado = false) {
            const modalTitulo = document.getElementById('modal-titulo');
            const modalBody = document.getElementById('modal-body');
            const c = data.contenido;

            modalTitulo.textContent = esRecanalizado ? '¡Guardián Recanalizado!' : '¡Guardián Canalizado!';

            modalBody.innerHTML = `
                <div class="resultado-exitoso">
                    <div class="resultado-icono">✨</div>
                    <div class="resultado-nombre">${c.datosGenerados?.nombre || 'Guardián'}</div>
                    <div class="resultado-subtitulo">${c.encabezado?.subtitulo || ''}</div>

                    <div class="resultado-datos">
                        <div class="resultado-dato">
                            <div class="resultado-dato-label">Tipo</div>
                            <div class="resultado-dato-valor">${c.datosGenerados?.tipo || '-'}</div>
                        </div>
                        <div class="resultado-dato">
                            <div class="resultado-dato-label">Elemento</div>
                            <div class="resultado-dato-valor">${c.datosGenerados?.elemento || '-'}</div>
                        </div>
                        <div class="resultado-dato">
                            <div class="resultado-dato-label">Propósito</div>
                            <div class="resultado-dato-valor">${c.datosGenerados?.proposito || '-'}</div>
                        </div>
                    </div>

                    <div class="resultado-qr-box">
                        <img src="${data.qrUrl}" alt="QR">
                        <div class="resultado-qr-info">
                            <h4>${data.codigo}</h4>
                            <p>Código único del guardián. Escaneá para acceder a Mi Magia.</p>
                        </div>
                    </div>

                    ${c.vidaAnterior?.texto ? `
                    <div class="resultado-preview">
                        <h4>Preview de la Historia</h4>
                        <p>${c.vidaAnterior.texto.substring(0, 400)}...</p>
                    </div>
                    ` : ''}

                    <div class="resultado-acciones">
                        <button class="btn-canalizar" onclick="cerrarModalYRecargar()">
                            ✓ Perfecto
                        </button>
                        <a href="<?php echo admin_url('post.php?action=edit&post='); ?>${data.contenido.productId || ''}" class="btn-ver" style="flex: 1;">
                            Editar producto
                        </a>
                    </div>
                </div>
            `;
        }

        function cerrarModal() {
            document.getElementById('modal').classList.remove('visible');
        }

        function cerrarModalYRecargar() {
            cerrarModal();
            cargarProductos();
        }

        function imprimirQR(qrUrl, nombre, codigo) {
            const win = window.open('', '_blank');
            win.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>QR ${nombre}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap" rel="stylesheet">
                    <style>
                        body {
                            font-family: 'Cinzel', serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            margin: 0;
                            background: #0a0a0a;
                        }
                        .qr-card {
                            width: 350px;
                            background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
                            border: 2px solid #C6A962;
                            border-radius: 20px;
                            padding: 40px;
                            text-align: center;
                            color: #fff;
                        }
                        .qr-card h1 {
                            color: #C6A962;
                            font-size: 28px;
                            margin: 0 0 10px 0;
                            letter-spacing: 3px;
                        }
                        .qr-card .subtitulo {
                            color: rgba(255,255,255,0.6);
                            font-size: 12px;
                            letter-spacing: 2px;
                            margin-bottom: 30px;
                        }
                        .qr-card img {
                            width: 200px;
                            height: 200px;
                            border-radius: 16px;
                            margin-bottom: 25px;
                        }
                        .qr-card .codigo {
                            color: #C6A962;
                            font-size: 18px;
                            margin-bottom: 10px;
                        }
                        .qr-card .instruccion {
                            color: rgba(255,255,255,0.5);
                            font-size: 11px;
                            line-height: 1.6;
                        }
                        .qr-card .url {
                            color: rgba(255,255,255,0.3);
                            font-size: 10px;
                            margin-top: 20px;
                            word-break: break-all;
                        }
                        @media print {
                            body { background: #fff; }
                            .qr-card {
                                box-shadow: none;
                                border: 2px solid #C6A962;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="qr-card">
                        <h1>${nombre}</h1>
                        <div class="subtitulo">DUENDES DEL URUGUAY</div>
                        <img src="${qrUrl}" alt="QR">
                        <div class="codigo">${codigo}</div>
                        <div class="instruccion">
                            Escaneá este código para acceder<br>a tu espacio mágico personal
                        </div>
                        <div class="url">duendesuy.10web.cloud/mi-magia</div>
                    </div>
                    <script>window.print();<\/script>
                </body>
                </html>
            `);
        }

        function copiarCodigo(codigo) {
            navigator.clipboard.writeText(codigo);
            alert('Código copiado: ' + codigo);
        }

        // ═══════════════════════════════════════════════════════════════
        // EFECTOS DE SONIDO MÍSTICOS
        // ═══════════════════════════════════════════════════════════════

        let audioCtx = null;

        function initAudio() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            return audioCtx;
        }

        function playMagicSound() {
            try {
                const ctx = initAudio();

                // Crear un sonido místico con múltiples frecuencias
                const frequencies = [220, 277, 330, 440, 554];
                const duration = 3;

                frequencies.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.frequency.setValueAtTime(freq, ctx.currentTime);
                    osc.type = 'sine';

                    const delay = i * 0.3;

                    // Fade in suave
                    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
                    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + delay + 0.5);
                    // Mantener
                    gain.gain.setValueAtTime(0.08, ctx.currentTime + delay + duration - 1);
                    // Fade out
                    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration);

                    osc.start(ctx.currentTime + delay);
                    osc.stop(ctx.currentTime + delay + duration);
                });
            } catch(e) {
                console.log('Audio no disponible');
            }
        }

        function playSuccessSound() {
            try {
                const ctx = initAudio();

                // Arpegio ascendente de éxito
                const notes = [523, 659, 784, 1047, 1319, 1568];

                notes.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.frequency.setValueAtTime(freq, ctx.currentTime);
                    osc.type = 'sine';

                    const delay = i * 0.1;

                    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
                    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.5);

                    osc.start(ctx.currentTime + delay);
                    osc.stop(ctx.currentTime + delay + 1.5);
                });
            } catch(e) {}
        }

        // ═══════════════════════════════════════════════════════════════
        // ANIMACIÓN DE FASES
        // ═══════════════════════════════════════════════════════════════

        let faseInterval = null;

        function animarFases() {
            let faseActual = 1;
            const mensajes = [
                'Observando los detalles físicos...',
                'Canalizando la esencia ancestral...',
                'Escribiendo su historia milenaria...',
                'Sellando el pacto mágico...'
            ];

            faseInterval = setInterval(() => {
                // Marcar fase anterior como completada
                const faseAnterior = document.getElementById(`fase-${faseActual}`);
                if (faseAnterior) {
                    faseAnterior.classList.remove('activa');
                    faseAnterior.classList.add('completada');
                }

                faseActual++;

                if (faseActual <= 4) {
                    // Activar siguiente fase
                    const faseSiguiente = document.getElementById(`fase-${faseActual}`);
                    if (faseSiguiente) {
                        faseSiguiente.classList.add('activa');
                    }

                    // Actualizar mensaje
                    const mensajeEl = document.querySelector('.canalizando-mensaje');
                    if (mensajeEl) {
                        mensajeEl.textContent = mensajes[faseActual - 1];
                    }
                } else {
                    clearInterval(faseInterval);
                }
            }, 8000); // Cada 8 segundos cambiar de fase
        }

        function detenerAnimacionFases() {
            if (faseInterval) {
                clearInterval(faseInterval);
                faseInterval = null;
            }
        }

        // Inicializar audio en primer click
        document.addEventListener('click', function initOnClick() {
            initAudio();
            document.removeEventListener('click', initOnClick);
        }, { once: true });
        </script>
    </body>
    </html>
    <?php
    exit; // Importante: salir para no cargar el admin de WP encima
}

// ═══════════════════════════════════════════════════════════════════════════
// QUITAR METABOXES VIEJOS DE PRODUCTOS
// ═══════════════════════════════════════════════════════════════════════════

add_action('add_meta_boxes', function() {
    // Quitar metaboxes de otros plugins duendes
    remove_meta_box('duendes_guardian_metabox', 'product', 'normal');
    remove_meta_box('duendes_ficha_guardian', 'product', 'normal');
    remove_meta_box('duendes_historia_ia', 'product', 'side');
    remove_meta_box('duendes_simple', 'product', 'normal');
}, 99);

// ═══════════════════════════════════════════════════════════════════════════
// MOSTRAR ESTADO EN LISTA DE PRODUCTOS
// ═══════════════════════════════════════════════════════════════════════════

add_filter('manage_product_posts_columns', function($columns) {
    $new_columns = [];
    foreach ($columns as $key => $value) {
        $new_columns[$key] = $value;
        if ($key === 'name') {
            $new_columns['canalizado'] = '🪄 Estado';
        }
    }
    return $new_columns;
});

add_action('manage_product_posts_custom_column', function($column, $post_id) {
    if ($column === 'canalizado') {
        $canalizado = get_post_meta($post_id, '_duendes_canalizado', true);
        if ($canalizado === 'si') {
            $tipo = get_post_meta($post_id, '_duendes_tipo', true);
            echo '<span style="color: #22c55e;">✓ ' . esc_html($tipo ?: 'Canalizado') . '</span>';
        } else {
            $has_image = has_post_thumbnail($post_id);
            if ($has_image) {
                echo '<span style="color: #f59e0b;">⏳ Pendiente</span>';
            } else {
                echo '<span style="color: #888;">Sin imagen</span>';
            }
        }
    }
}, 10, 2);

// ═══════════════════════════════════════════════════════════════════════════
// INTEGRACIÓN CON CURRENCY (precio geolocalizado)
// ═══════════════════════════════════════════════════════════════════════════

// Guardar precio UYU
add_action('woocommerce_process_product_meta', function($post_id) {
    if (isset($_POST['_duendes_precio_uyu'])) {
        update_post_meta($post_id, '_duendes_precio_uyu', sanitize_text_field($_POST['_duendes_precio_uyu']));
    }
});

// Mostrar precio UYU en frontend si es de Uruguay
add_filter('woocommerce_get_price_html', function($price_html, $product) {
    // Detectar país por IP (simplificado)
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';

    // En producción usarías una API de geolocalización
    // Por ahora, mostrar ambos precios
    $precio_uyu = get_post_meta($product->get_id(), '_duendes_precio_uyu', true);

    if ($precio_uyu) {
        $precio_uyu_formatted = '$' . number_format($precio_uyu, 0, ',', '.');
        return $price_html . '<br><small style="color: #C6A962;">🇺🇾 ' . $precio_uyu_formatted . ' UYU</small>';
    }

    return $price_html;
}, 10, 2);
