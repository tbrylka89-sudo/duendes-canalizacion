<?php
/**
 * Plugin Name: Duendes - Administración de Clientes
 * Description: Panel de fichas de clientes inteligentes con análisis psicológico
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

define('DUENDES_CLIENTES_API', 'https://duendes-vercel.vercel.app/api/admin/clientes');

// ═══════════════════════════════════════════════════════════════
// AGREGAR MENÚ DE ADMIN
// ═══════════════════════════════════════════════════════════════

add_action('admin_menu', function() {
    add_menu_page(
        'Clientes Mágicos',
        'Clientes',
        'manage_options',
        'duendes-clientes',
        'duendes_clientes_page',
        'dashicons-groups',
        30
    );

    add_submenu_page(
        'duendes-clientes',
        'Alertas',
        '🔔 Alertas',
        'manage_options',
        'duendes-clientes-alertas',
        'duendes_alertas_page'
    );
});

// ═══════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL DE CLIENTES
// ═══════════════════════════════════════════════════════════════

function duendes_clientes_page() {
    ?>
    <style>
        .duendes-clientes-wrap {
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .duendes-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 12px;
            color: #fff;
        }
        .duendes-header h1 {
            margin: 0;
            color: #d4af37;
        }
        .duendes-search {
            display: flex;
            gap: 10px;
        }
        .duendes-search input {
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
            width: 300px;
        }
        .duendes-search select {
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
        }
        .duendes-btn {
            padding: 10px 20px;
            background: #d4af37;
            color: #000;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        }
        .duendes-btn:hover {
            background: #f0c850;
        }
        .duendes-btn-secondary {
            background: #4a5568;
            color: #fff;
        }
        .clientes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }
        .cliente-card {
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-left: 4px solid #d4af37;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .cliente-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .cliente-card.tiene-alertas {
            border-left-color: #e74c3c;
        }
        .cliente-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        .cliente-nombre {
            font-size: 18px;
            font-weight: bold;
            color: #2d3748;
        }
        .cliente-signo {
            font-size: 24px;
        }
        .cliente-email {
            color: #718096;
            font-size: 13px;
        }
        .cliente-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin: 15px 0;
        }
        .cliente-stat {
            text-align: center;
            padding: 8px;
            background: #f7fafc;
            border-radius: 8px;
        }
        .cliente-stat-value {
            font-size: 18px;
            font-weight: bold;
            color: #d4af37;
        }
        .cliente-stat-label {
            font-size: 11px;
            color: #718096;
        }
        .cliente-badges {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
        }
        .cliente-badge {
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
        }
        .badge-circulo {
            background: #d4af37;
            color: #000;
        }
        .badge-guardianes {
            background: #48bb78;
            color: #fff;
        }
        .badge-alertas {
            background: #e74c3c;
            color: #fff;
        }
        .badge-cumple {
            background: #9f7aea;
            color: #fff;
        }
        .cliente-resumen {
            margin-top: 10px;
            padding: 10px;
            background: #f0f4f8;
            border-radius: 8px;
            font-size: 13px;
            color: #4a5568;
            font-style: italic;
        }

        /* Modal de ficha */
        .ficha-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            overflow-y: auto;
            padding: 20px;
        }
        .ficha-modal.active {
            display: block;
        }
        .ficha-content {
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
        }
        .ficha-header {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #fff;
            padding: 30px;
        }
        .ficha-header h2 {
            margin: 0 0 10px;
            color: #d4af37;
            font-size: 28px;
        }
        .ficha-body {
            padding: 30px;
        }
        .ficha-section {
            margin-bottom: 25px;
        }
        .ficha-section h3 {
            color: #d4af37;
            border-bottom: 2px solid #d4af37;
            padding-bottom: 8px;
            margin-bottom: 15px;
        }
        .ficha-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        .ficha-field {
            padding: 10px;
            background: #f7fafc;
            border-radius: 8px;
        }
        .ficha-field-label {
            font-size: 12px;
            color: #718096;
            margin-bottom: 4px;
        }
        .ficha-field-value {
            font-weight: 500;
            color: #2d3748;
        }
        .ficha-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #fff;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
        }
        .ficha-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        .perfil-psicologico {
            background: #faf5ff;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #9f7aea;
        }
        .recomendacion-item {
            padding: 12px;
            background: #fff;
            border-radius: 8px;
            margin-bottom: 10px;
            border-left: 3px solid #48bb78;
        }
        .alerta-item {
            padding: 12px;
            background: #fff;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        .alerta-item.alta {
            border-left: 3px solid #e74c3c;
        }
        .alerta-item.media {
            border-left: 3px solid #f6ad55;
        }
        .alerta-item.baja {
            border-left: 3px solid #48bb78;
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: #718096;
        }
        .guardianes-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .guardian-chip {
            padding: 8px 15px;
            background: linear-gradient(135deg, #d4af37 0%, #f0c850 100%);
            color: #000;
            border-radius: 20px;
            font-weight: 500;
        }
    </style>

    <div class="duendes-clientes-wrap">
        <div class="duendes-header">
            <h1>✨ Clientes Mágicos</h1>
            <div class="duendes-search">
                <input type="text" id="buscar-cliente" placeholder="Buscar por nombre o email...">
                <select id="ordenar-clientes">
                    <option value="ultimaCompra">Última compra</option>
                    <option value="totalCompras">Total gastado</option>
                    <option value="nombre">Nombre</option>
                    <option value="alertas">Alertas</option>
                </select>
                <button class="duendes-btn" onclick="cargarClientes()">🔍 Buscar</button>
                <button class="duendes-btn duendes-btn-secondary" onclick="generarFichas()">📋 Generar Fichas</button>
            </div>
        </div>

        <div id="clientes-container" class="clientes-grid">
            <div class="loading">Cargando clientes...</div>
        </div>
    </div>

    <!-- Modal de Ficha -->
    <div id="ficha-modal" class="ficha-modal">
        <div class="ficha-content" style="position: relative;">
            <button class="ficha-close" onclick="cerrarFicha()">✕</button>
            <div id="ficha-contenido">
                <div class="loading">Cargando ficha...</div>
            </div>
        </div>
    </div>

    <script>
        const API_URL = '<?php echo DUENDES_CLIENTES_API; ?>';

        async function cargarClientes() {
            const container = document.getElementById('clientes-container');
            container.innerHTML = '<div class="loading">Cargando clientes...</div>';

            const busqueda = document.getElementById('buscar-cliente').value;
            const ordenar = document.getElementById('ordenar-clientes').value;

            try {
                const params = new URLSearchParams({ ordenar });
                if (busqueda) params.append('q', busqueda);

                const res = await fetch(`${API_URL}?${params}`);
                const data = await res.json();

                if (data.success && data.clientes) {
                    renderClientes(data.clientes);
                } else {
                    container.innerHTML = '<div class="loading">Error cargando clientes</div>';
                }
            } catch (error) {
                console.error('Error:', error);
                container.innerHTML = '<div class="loading">Error de conexión</div>';
            }
        }

        function renderClientes(clientes) {
            const container = document.getElementById('clientes-container');

            if (clientes.length === 0) {
                container.innerHTML = '<div class="loading">No se encontraron clientes</div>';
                return;
            }

            container.innerHTML = clientes.map(c => `
                <div class="cliente-card ${c.alertas > 0 ? 'tiene-alertas' : ''}" onclick="verFicha('${c.email}')">
                    <div class="cliente-header">
                        <div>
                            <div class="cliente-nombre">${c.nombre || 'Sin nombre'}</div>
                            <div class="cliente-email">${c.email}</div>
                        </div>
                        <div class="cliente-signo">${c.signoEmoji || '✨'}</div>
                    </div>
                    <div class="cliente-stats">
                        <div class="cliente-stat">
                            <div class="cliente-stat-value">${c.guardianes || 0}</div>
                            <div class="cliente-stat-label">Guardianes</div>
                        </div>
                        <div class="cliente-stat">
                            <div class="cliente-stat-value">${c.runas || 0}</div>
                            <div class="cliente-stat-label">Runas</div>
                        </div>
                        <div class="cliente-stat">
                            <div class="cliente-stat-value">$${(c.totalCompras || 0).toFixed(0)}</div>
                            <div class="cliente-stat-label">Total</div>
                        </div>
                    </div>
                    <div class="cliente-badges">
                        ${c.esCirculo ? `<span class="cliente-badge badge-circulo">⭐ ${c.tipoMembresia || 'Círculo'}</span>` : ''}
                        ${c.guardianes > 0 ? `<span class="cliente-badge badge-guardianes">🛡️ ${c.guardianes} guardianes</span>` : ''}
                        ${c.alertas > 0 ? `<span class="cliente-badge badge-alertas">🔔 ${c.alertas} alertas</span>` : ''}
                        ${c.proximoCumple?.esCumplePronto ? `<span class="cliente-badge badge-cumple">🎂 Cumple pronto</span>` : ''}
                    </div>
                    ${c.resumenEjecutivo ? `<div class="cliente-resumen">"${c.resumenEjecutivo}"</div>` : ''}
                </div>
            `).join('');
        }

        async function verFicha(email) {
            const modal = document.getElementById('ficha-modal');
            const contenido = document.getElementById('ficha-contenido');

            modal.classList.add('active');
            contenido.innerHTML = '<div class="loading">Cargando ficha...</div>';

            try {
                const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
                const data = await res.json();

                if (data.success && data.ficha) {
                    renderFicha(data.ficha);
                } else {
                    contenido.innerHTML = '<div class="loading">Error cargando ficha</div>';
                }
            } catch (error) {
                console.error('Error:', error);
                contenido.innerHTML = '<div class="loading">Error de conexión</div>';
            }
        }

        function renderFicha(f) {
            const contenido = document.getElementById('ficha-contenido');

            contenido.innerHTML = `
                <div class="ficha-header">
                    <h2>${f.signoEmoji || '✨'} ${f.nombreCompleto || f.nombre || 'Cliente'}</h2>
                    <p>${f.email}</p>
                    <p>${f.signoZodiacal || ''} • ${f.elementoZodiacal || ''} • Nivel: ${f.nivel || 'iniciada'}</p>
                </div>
                <div class="ficha-body">
                    <!-- Datos Personales -->
                    <div class="ficha-section">
                        <h3>📋 Datos Personales</h3>
                        <div class="ficha-grid">
                            <div class="ficha-field">
                                <div class="ficha-field-label">Nombre completo</div>
                                <div class="ficha-field-value">${f.nombreCompleto || f.nombre || '-'}</div>
                            </div>
                            <div class="ficha-field">
                                <div class="ficha-field-label">Email</div>
                                <div class="ficha-field-value">${f.email || '-'}</div>
                            </div>
                            <div class="ficha-field">
                                <div class="ficha-field-label">Teléfono</div>
                                <div class="ficha-field-value">${f.telefono || '-'}</div>
                            </div>
                            <div class="ficha-field">
                                <div class="ficha-field-label">País/Ciudad</div>
                                <div class="ficha-field-value">${f.pais || '-'} ${f.ciudad ? '/ ' + f.ciudad : ''}</div>
                            </div>
                            <div class="ficha-field">
                                <div class="ficha-field-label">Fecha de nacimiento</div>
                                <div class="ficha-field-value">${f.fechaNacimiento || '-'}</div>
                            </div>
                            <div class="ficha-field">
                                <div class="ficha-field-label">Próximo cumpleaños</div>
                                <div class="ficha-field-value">${f.proximoCumple ? `${f.proximoCumple.fecha} (${f.proximoCumple.diasFaltan} días)` : '-'}</div>
                            </div>
                            <div class="ficha-field">
                                <div class="ficha-field-label">Signo zodiacal</div>
                                <div class="ficha-field-value">${f.signoEmoji || ''} ${f.signoZodiacal || '-'} (${f.elementoZodiacal || '-'})</div>
                            </div>
                            <div class="ficha-field">
                                <div class="ficha-field-label">Elemento de afinidad</div>
                                <div class="ficha-field-value">${f.elementoAfinidad || '-'}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Guardianes -->
                    ${f.guardianes?.length > 0 ? `
                    <div class="ficha-section">
                        <h3>🛡️ Guardianes (${f.cantidadGuardianes})</h3>
                        <div class="guardianes-list">
                            ${f.guardianes.map(g => `
                                <div class="guardian-chip">${g.nombre || g}</div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Estadísticas -->
                    <div class="ficha-section">
                        <h3>📊 Estadísticas</h3>
                        <div class="ficha-grid">
                            <div class="ficha-field">
                                <div class="ficha-field-label">Membresía</div>
                                <div class="ficha-field-value">${f.esCirculo ? `⭐ ${f.tipoMembresia}` : 'No es miembro'}</div>
                            </div>
                            <div class="ficha-field">
                                <div class="ficha-field-label">Runas</div>
                                <div class="ficha-field-value">${f.runas || 0} ᚱ</div>
                            </div>
                            <div class="ficha-field">
                                <div class="ficha-field-label">XP / Nivel</div>
                                <div class="ficha-field-value">${f.xp || 0} XP • ${f.nivel || 'iniciada'}</div>
                            </div>
                            <div class="ficha-field">
                                <div class="ficha-field-label">Racha máxima</div>
                                <div class="ficha-field-value">${f.rachaMax || 0} días 🔥</div>
                            </div>
                            <div class="ficha-field">
                                <div class="ficha-field-label">Total compras</div>
                                <div class="ficha-field-value">$${(f.totalCompras || 0).toFixed(2)}</div>
                            </div>
                            <div class="ficha-field">
                                <div class="ficha-field-label">Lecturas realizadas</div>
                                <div class="ficha-field-value">${f.lecturasRealizadas || 0}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Perfil Psicológico -->
                    ${f.perfilPsicologico ? `
                    <div class="ficha-section">
                        <h3>🧠 Perfil Psicológico</h3>
                        <div class="perfil-psicologico">
                            <p><strong>Personalidad:</strong> ${f.perfilPsicologico.personalidad || '-'}</p>
                            <p><strong>Fortalezas:</strong> ${f.perfilPsicologico.fortalezas?.join(', ') || '-'}</p>
                            <p><strong>Desafíos:</strong> ${f.perfilPsicologico.desafios?.join(', ') || '-'}</p>
                            <p><strong>Necesidades:</strong> ${f.perfilPsicologico.necesidadesEmocionales?.join(', ') || '-'}</p>
                            ${f.analisis?.etapaVida ? `<p><strong>Etapa de vida:</strong> ${f.analisis.etapaVida}</p>` : ''}
                            ${f.analisis?.nivelEspiritual ? `<p><strong>Nivel espiritual:</strong> ${f.analisis.nivelEspiritual}</p>` : ''}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Recomendaciones -->
                    ${f.recomendaciones?.length > 0 ? `
                    <div class="ficha-section">
                        <h3>💡 Recomendaciones</h3>
                        ${f.recomendaciones.map(r => `
                            <div class="recomendacion-item">
                                <strong>${r.tipo}:</strong> ${r.producto}<br>
                                <small>${r.razon}</small>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}

                    <!-- Alertas -->
                    ${f.alertas?.length > 0 ? `
                    <div class="ficha-section">
                        <h3>🔔 Alertas</h3>
                        ${f.alertas.map(a => `
                            <div class="alerta-item ${a.prioridad}">
                                <strong>${a.tipo}:</strong> ${a.mensaje}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}

                    <!-- Notas -->
                    ${f.notasImportantes?.length > 0 ? `
                    <div class="ficha-section">
                        <h3>📝 Notas Importantes</h3>
                        <ul>
                            ${f.notasImportantes.map(n => `<li>${typeof n === 'string' ? n : n.texto} ${n.fecha ? `<small>(${new Date(n.fecha).toLocaleDateString()})</small>` : ''}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    <!-- Acciones -->
                    <div class="ficha-actions">
                        <button class="duendes-btn" onclick="analizarCliente('${f.email}')">🧠 Analizar con IA</button>
                        <button class="duendes-btn duendes-btn-secondary" onclick="agregarNota('${f.email}')">📝 Agregar Nota</button>
                    </div>
                </div>
            `;
        }

        function cerrarFicha() {
            document.getElementById('ficha-modal').classList.remove('active');
        }

        async function analizarCliente(email) {
            if (!confirm('¿Analizar este cliente con IA? (consume tokens)')) return;

            const contenido = document.getElementById('ficha-contenido');
            contenido.innerHTML = '<div class="loading">Analizando con IA... (puede tardar 30-60 segundos)</div>';

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, accion: 'analizar' })
                });
                const data = await res.json();

                if (data.success) {
                    alert('Análisis completado');
                    verFicha(email);
                } else {
                    alert('Error: ' + data.error);
                }
            } catch (error) {
                alert('Error de conexión');
            }
        }

        async function agregarNota(email) {
            const nota = prompt('Escribí la nota para este cliente:');
            if (!nota) return;

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        accion: 'agregarNota',
                        datos: { nota }
                    })
                });
                const data = await res.json();

                if (data.success) {
                    alert('Nota agregada');
                    verFicha(email);
                } else {
                    alert('Error: ' + data.error);
                }
            } catch (error) {
                alert('Error de conexión');
            }
        }

        async function generarFichas() {
            if (!confirm('¿Generar fichas para todos los clientes que no tienen?')) return;

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ accion: 'generarTodas' })
                });
                const data = await res.json();
                alert(data.mensaje || 'Fichas generadas');
                cargarClientes();
            } catch (error) {
                alert('Error de conexión');
            }
        }

        // Cerrar modal con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') cerrarFicha();
        });

        // Cargar clientes al iniciar
        cargarClientes();
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════
// PÁGINA DE ALERTAS
// ═══════════════════════════════════════════════════════════════

function duendes_alertas_page() {
    ?>
    <style>
        .alertas-wrap {
            padding: 20px;
            max-width: 800px;
        }
        .alertas-header {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: #fff;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        .alertas-header h1 {
            margin: 0;
        }
        .alerta-card {
            background: #fff;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            display: flex;
            gap: 15px;
            align-items: flex-start;
        }
        .alerta-card.alta {
            border-left: 4px solid #e74c3c;
        }
        .alerta-card.media {
            border-left: 4px solid #f6ad55;
        }
        .alerta-card.baja {
            border-left: 4px solid #48bb78;
        }
        .alerta-icono {
            font-size: 32px;
        }
        .alerta-contenido {
            flex: 1;
        }
        .alerta-tipo {
            font-size: 12px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .alerta-mensaje {
            font-size: 16px;
            margin: 8px 0;
        }
        .alerta-cliente {
            color: #d4af37;
            font-weight: 500;
        }
    </style>

    <div class="alertas-wrap">
        <div class="alertas-header">
            <h1>🔔 Alertas de Clientes</h1>
            <p>Eventos importantes que requieren tu atención</p>
        </div>

        <div id="alertas-container">
            <div class="loading">Cargando alertas...</div>
        </div>
    </div>

    <script>
        const API_URL = '<?php echo DUENDES_CLIENTES_API; ?>';

        async function cargarAlertas() {
            const container = document.getElementById('alertas-container');

            try {
                const res = await fetch(`${API_URL}?accion=alertas`);
                const data = await res.json();

                if (data.success && data.alertas) {
                    if (data.alertas.length === 0) {
                        container.innerHTML = '<p>No hay alertas pendientes ✨</p>';
                        return;
                    }

                    const iconos = {
                        'cumpleaños': '🎂',
                        'inactividad': '😴',
                        'oportunidad': '💡',
                        'atencion': '⚠️'
                    };

                    container.innerHTML = data.alertas.map(a => `
                        <div class="alerta-card ${a.prioridad}">
                            <div class="alerta-icono">${iconos[a.tipo] || '🔔'}</div>
                            <div class="alerta-contenido">
                                <div class="alerta-tipo">${a.tipo}</div>
                                <div class="alerta-mensaje">${a.mensaje}</div>
                                <div class="alerta-cliente">👤 ${a.nombre || a.email}</div>
                            </div>
                        </div>
                    `).join('');
                } else {
                    container.innerHTML = '<p>Error cargando alertas</p>';
                }
            } catch (error) {
                container.innerHTML = '<p>Error de conexión</p>';
            }
        }

        cargarAlertas();
    </script>
    <?php
}
