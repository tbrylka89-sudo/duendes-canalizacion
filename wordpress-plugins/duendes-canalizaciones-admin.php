<?php
/**
 * Plugin Name: Duendes Canalizaciones Admin
 * Description: Panel para revisar, aprobar y enviar canalizaciones personalizadas
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Agregar menú en admin
add_action('admin_menu', function() {
    add_menu_page(
        'Canalizaciones',
        'Canalizaciones',
        'manage_options',
        'duendes-canalizaciones',
        'duendes_canalizaciones_page',
        'dashicons-star-filled',
        25
    );
});

function duendes_canalizaciones_page() {
    ?>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        .canal-admin-container {
            padding: 20px;
            max-width: 1400px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .canal-admin-header {
            background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            color: #fff;
        }

        .canal-admin-header h1 {
            font-family: 'Cinzel', serif;
            color: #C6A962;
            margin: 0 0 10px 0;
            font-size: 28px;
        }

        .canal-admin-header p {
            color: rgba(255,255,255,0.7);
            margin: 0;
        }

        .canal-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 25px;
        }

        .canal-tab {
            padding: 12px 25px;
            background: #f0f0f0;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s;
        }

        .canal-tab:hover {
            background: #e0e0e0;
        }

        .canal-tab.active {
            background: linear-gradient(135deg, #C6A962, #a88a42);
            color: #000;
        }

        .canal-tab .badge {
            background: #ff4444;
            color: #fff;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            margin-left: 8px;
        }

        .canal-grid {
            display: grid;
            gap: 20px;
        }

        .canal-card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.08);
            overflow: hidden;
            border: 1px solid #eee;
        }

        .canal-card-header {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 20px;
            background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
            border-bottom: 1px solid rgba(198,169,98,0.2);
        }

        .canal-guardian-img {
            width: 70px;
            height: 70px;
            border-radius: 10px;
            object-fit: cover;
            border: 2px solid #C6A962;
        }

        .canal-guardian-info h3 {
            margin: 0 0 5px 0;
            font-family: 'Cinzel', serif;
            color: #333;
            font-size: 18px;
        }

        .canal-guardian-info p {
            margin: 0;
            color: #666;
            font-size: 13px;
        }

        .canal-estado {
            margin-left: auto;
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .canal-estado.pendiente {
            background: #fff3cd;
            color: #856404;
        }

        .canal-estado.aprobada {
            background: #d4edda;
            color: #155724;
        }

        .canal-estado.enviada {
            background: #cce5ff;
            color: #004085;
        }

        .canal-card-body {
            padding: 20px;
        }

        .canal-meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .canal-meta-item {
            background: #f9f9f9;
            padding: 12px;
            border-radius: 8px;
        }

        .canal-meta-item label {
            display: block;
            font-size: 11px;
            color: #888;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .canal-meta-item span {
            font-size: 14px;
            color: #333;
            font-weight: 500;
        }

        .canal-resumen {
            background: linear-gradient(135deg, #f9f5eb 0%, #faf8f5 100%);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #C6A962;
        }

        .canal-resumen h4 {
            margin: 0 0 8px 0;
            color: #C6A962;
            font-size: 13px;
            font-weight: 600;
        }

        .canal-resumen p {
            margin: 0;
            color: #555;
            font-size: 14px;
            line-height: 1.5;
        }

        .canal-acciones {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .canal-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .canal-btn-ver {
            background: #f0f0f0;
            color: #333;
        }

        .canal-btn-ver:hover {
            background: #e0e0e0;
        }

        .canal-btn-aprobar {
            background: linear-gradient(135deg, #28a745, #218838);
            color: #fff;
        }

        .canal-btn-aprobar:hover {
            background: linear-gradient(135deg, #34ce57, #28a745);
        }

        .canal-btn-enviar {
            background: linear-gradient(135deg, #C6A962, #a88a42);
            color: #000;
        }

        .canal-btn-enviar:hover {
            background: linear-gradient(135deg, #d4bc7a, #C6A962);
        }

        /* Modal */
        .canal-modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 99999;
            justify-content: center;
            align-items: flex-start;
            padding: 40px 20px;
            overflow-y: auto;
        }

        .canal-modal-overlay.active {
            display: flex;
        }

        .canal-modal {
            background: #fff;
            border-radius: 15px;
            max-width: 900px;
            width: 100%;
            max-height: calc(100vh - 80px);
            overflow-y: auto;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        }

        .canal-modal-header {
            position: sticky;
            top: 0;
            background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
            padding: 25px;
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
        }

        .canal-modal-header h2 {
            font-family: 'Cinzel', serif;
            color: #C6A962;
            margin: 0;
        }

        .canal-modal-close {
            background: none;
            border: none;
            color: #fff;
            font-size: 28px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s;
        }

        .canal-modal-close:hover {
            opacity: 1;
        }

        .canal-modal-body {
            padding: 30px;
        }

        .canal-contenido {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 17px;
            line-height: 1.8;
            color: #333;
        }

        .canal-contenido h2 {
            font-family: 'Cinzel', serif;
            color: #C6A962;
            font-size: 22px;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(198,169,98,0.3);
        }

        .canal-contenido p {
            margin-bottom: 15px;
        }

        .canal-modal-footer {
            position: sticky;
            bottom: 0;
            background: #f9f9f9;
            padding: 20px 30px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }

        /* Estado vacío */
        .canal-vacio {
            text-align: center;
            padding: 60px;
            background: #f9f9f9;
            border-radius: 15px;
        }

        .canal-vacio h2 {
            color: #666;
            margin-bottom: 10px;
        }

        .canal-vacio p {
            color: #999;
        }

        .cargando {
            text-align: center;
            padding: 60px;
        }

        .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #f0f0f0;
            border-top-color: #C6A962;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Info checkout */
        .canal-checkout-info {
            background: #e8f4ff;
            padding: 12px 15px;
            border-radius: 8px;
            margin-top: 15px;
            font-size: 13px;
        }

        .canal-checkout-info strong {
            color: #0066cc;
        }
    </style>

    <div class="canal-admin-container">
        <div class="canal-admin-header">
            <h1>✨ Canalizaciones Personalizadas</h1>
            <p>Revisá, aprobá y enviá las canalizaciones generadas para cada compra</p>
        </div>

        <div class="canal-tabs">
            <button class="canal-tab active" onclick="cargarCanalizaciones('pendiente')">
                🕐 Pendientes <span class="badge" id="badge-pendientes">0</span>
            </button>
            <button class="canal-tab" onclick="cargarCanalizaciones('aprobada')">
                ✓ Aprobadas
            </button>
            <button class="canal-tab" onclick="cargarCanalizaciones('todas')">
                📋 Historial
            </button>
        </div>

        <div id="canalizaciones-container">
            <div class="cargando">
                <div class="spinner"></div>
                <p>Cargando canalizaciones...</p>
            </div>
        </div>
    </div>

    <!-- Modal para ver canalización completa -->
    <div class="canal-modal-overlay" id="modal-canalizacion">
        <div class="canal-modal">
            <div class="canal-modal-header">
                <h2 id="modal-titulo">Canalización</h2>
                <button class="canal-modal-close" onclick="cerrarModal()">&times;</button>
            </div>
            <div class="canal-modal-body">
                <div class="canal-contenido" id="modal-contenido"></div>
            </div>
            <div class="canal-modal-footer" id="modal-footer"></div>
        </div>
    </div>

    <script>
    let estadoActual = 'pendiente';
    let canalizacionActual = null;

    async function cargarCanalizaciones(estado) {
        estadoActual = estado;

        // Actualizar tabs
        document.querySelectorAll('.canal-tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');

        const container = document.getElementById('canalizaciones-container');
        container.innerHTML = `
            <div class="cargando">
                <div class="spinner"></div>
                <p>Cargando canalizaciones...</p>
            </div>
        `;

        try {
            const res = await fetch(`https://duendes-vercel.vercel.app/api/admin/canalizaciones?estado=${estado}`);
            const data = await res.json();

            if (!data.success) throw new Error(data.error);

            // Actualizar badge de pendientes
            if (estado === 'pendiente') {
                document.getElementById('badge-pendientes').textContent = data.canalizaciones.length;
            }

            if (data.canalizaciones.length === 0) {
                container.innerHTML = `
                    <div class="canal-vacio">
                        <h2>✨ ${estado === 'pendiente' ? 'No hay canalizaciones pendientes' : 'Sin resultados'}</h2>
                        <p>${estado === 'pendiente' ? 'Cuando alguien compre un guardián, aparecerá aquí para revisar.' : 'No hay canalizaciones en esta categoría.'}</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = '<div class="canal-grid"></div>';
            const grid = container.querySelector('.canal-grid');

            for (const canal of data.canalizaciones) {
                const card = document.createElement('div');
                card.className = 'canal-card';

                const paraQuienLabels = {
                    'para_mi': 'Para sí misma',
                    'regalo': 'Regalo (sabe)',
                    'sorpresa': 'Sorpresa'
                };

                const edadLabels = {
                    'adulto': 'Adulto',
                    'adolescente': 'Adolescente',
                    'nino': 'Niño/a',
                    'pequeno': 'Pequeño/a'
                };

                const checkoutInfo = canal.datosCheckout ? `
                    <div class="canal-checkout-info">
                        <strong>${paraQuienLabels[canal.datosCheckout.paraQuien] || 'Para sí misma'}</strong>
                        ${canal.datosCheckout.esNino !== 'adulto' ? ` • ${edadLabels[canal.datosCheckout.esNino] || ''}` : ''}
                        ${canal.datosCheckout.contexto ? ` • "${canal.datosCheckout.contexto.substring(0, 50)}..."` : ''}
                    </div>
                ` : '';

                card.innerHTML = `
                    <div class="canal-card-header">
                        <img src="${canal.guardian?.imagen || 'https://via.placeholder.com/70'}"
                             alt="${canal.guardian?.nombre}"
                             class="canal-guardian-img"
                             onerror="this.src='https://via.placeholder.com/70'">
                        <div class="canal-guardian-info">
                            <h3>${canal.guardian?.nombre || 'Guardián'}</h3>
                            <p>Orden #${canal.ordenId} • ${canal.guardian?.categoria || ''}</p>
                        </div>
                        <span class="canal-estado ${canal.estado}">${canal.estado}</span>
                    </div>
                    <div class="canal-card-body">
                        <div class="canal-meta">
                            <div class="canal-meta-item">
                                <label>Cliente</label>
                                <span>${canal.nombreCliente || 'N/A'}</span>
                            </div>
                            <div class="canal-meta-item">
                                <label>Email</label>
                                <span>${canal.email}</span>
                            </div>
                            <div class="canal-meta-item">
                                <label>Fecha compra</label>
                                <span>${new Date(canal.fechaCompra).toLocaleDateString('es-UY', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            ${canal.fechaEnviada ? `
                            <div class="canal-meta-item">
                                <label>Enviada</label>
                                <span>${new Date(canal.fechaEnviada).toLocaleDateString('es-UY', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            ` : ''}
                        </div>

                        <div class="canal-resumen">
                            <h4>📝 Resumen</h4>
                            <p>${canal.resumen || 'Sin resumen disponible'}</p>
                        </div>

                        ${checkoutInfo}

                        <div class="canal-acciones">
                            <button class="canal-btn canal-btn-ver" onclick="verCanalizacion('${canal.id}')">
                                👁️ Ver completa
                            </button>
                            ${canal.estado === 'pendiente' ? `
                            <button class="canal-btn canal-btn-aprobar" onclick="aprobarCanalizacion('${canal.id}')">
                                ✓ Aprobar
                            </button>
                            ` : ''}
                            ${canal.estado === 'aprobada' ? `
                            <button class="canal-btn canal-btn-enviar" onclick="enviarCanalizacion('${canal.id}')">
                                ✨ Enviar a cliente
                            </button>
                            ` : ''}
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            }

        } catch (error) {
            console.error(error);
            container.innerHTML = `
                <div class="canal-vacio">
                    <h2>Error al cargar</h2>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    async function verCanalizacion(id) {
        try {
            const res = await fetch(`https://duendes-vercel.vercel.app/api/admin/canalizaciones?id=${id}`);
            const data = await res.json();

            if (!data.success) throw new Error(data.error);

            canalizacionActual = data.canalizacion;

            document.getElementById('modal-titulo').textContent =
                `Canalización de ${canalizacionActual.guardian?.nombre || 'Guardián'} para ${canalizacionActual.nombreDestinatario || canalizacionActual.nombreCliente}`;

            // Convertir markdown básico a HTML
            let contenido = canalizacionActual.contenido || '';
            contenido = contenido.replace(/## (.*?)$/gm, '<h2>$1</h2>');
            contenido = contenido.replace(/\n\n/g, '</p><p>');
            contenido = '<p>' + contenido + '</p>';

            document.getElementById('modal-contenido').innerHTML = contenido;

            // Botones del footer según estado
            let footerHtml = '';
            if (canalizacionActual.estado === 'pendiente') {
                footerHtml = `
                    <button class="canal-btn canal-btn-ver" onclick="cerrarModal()">Cerrar</button>
                    <button class="canal-btn canal-btn-aprobar" onclick="aprobarCanalizacion('${id}'); cerrarModal();">✓ Aprobar</button>
                `;
            } else if (canalizacionActual.estado === 'aprobada') {
                footerHtml = `
                    <button class="canal-btn canal-btn-ver" onclick="cerrarModal()">Cerrar</button>
                    <button class="canal-btn canal-btn-enviar" onclick="enviarCanalizacion('${id}'); cerrarModal();">✨ Enviar a cliente</button>
                `;
            } else {
                footerHtml = `<button class="canal-btn canal-btn-ver" onclick="cerrarModal()">Cerrar</button>`;
            }
            document.getElementById('modal-footer').innerHTML = footerHtml;

            document.getElementById('modal-canalizacion').classList.add('active');

        } catch (error) {
            alert('Error al cargar: ' + error.message);
        }
    }

    function cerrarModal() {
        document.getElementById('modal-canalizacion').classList.remove('active');
        canalizacionActual = null;
    }

    async function aprobarCanalizacion(id) {
        if (!confirm('¿Aprobar esta canalización?')) return;

        try {
            const res = await fetch('https://duendes-vercel.vercel.app/api/admin/canalizaciones', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, accion: 'aprobar' })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            alert('✓ Canalización aprobada');
            cargarCanalizaciones(estadoActual);

        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    async function enviarCanalizacion(id) {
        if (!confirm('¿Enviar esta canalización al cliente?\n\nQuedará disponible en su página "Mi Magia".')) return;

        try {
            const res = await fetch('https://duendes-vercel.vercel.app/api/admin/canalizaciones', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, accion: 'enviar' })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            alert('✨ Canalización enviada!\n\nEl cliente puede verla en Mi Magia con su email.');
            cargarCanalizaciones(estadoActual);

        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarModal();
    });

    // Cerrar modal al hacer clic fuera
    document.getElementById('modal-canalizacion').addEventListener('click', (e) => {
        if (e.target.classList.contains('canal-modal-overlay')) cerrarModal();
    });

    // Cargar pendientes al inicio
    cargarCanalizaciones('pendiente');

    // Actualizar badge de pendientes
    async function actualizarBadgePendientes() {
        try {
            const res = await fetch('https://duendes-vercel.vercel.app/api/admin/canalizaciones?estado=pendiente');
            const data = await res.json();
            if (data.success) {
                document.getElementById('badge-pendientes').textContent = data.canalizaciones.length;
            }
        } catch (e) {}
    }
    </script>
    <?php
}
