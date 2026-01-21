<?php
/**
 * Plugin Name: Guardian Intelligence Simple
 * Description: Panel simple de Guardian Intelligence
 * Version: 2.0
 */

if (!defined('ABSPATH')) exit;

add_action('admin_menu', function() {
    add_menu_page(
        'Guardian Intelligence',
        'GI Panel',
        'manage_woocommerce',
        'gi-panel',
        'gi_render_panel',
        'dashicons-chart-area',
        56
    );
});

function gi_render_panel() {
    $api_base = 'https://duendes-vercel.vercel.app/api/guardian-intelligence';
    ?>
    <style>
        .gi-wrap { max-width: 1200px; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
        .gi-card { background: #1e1e2e; border-radius: 12px; padding: 25px; margin-bottom: 20px; color: #fff; }
        .gi-card h2 { margin-top: 0; color: #ffd700; }
        .gi-btn { background: #ffd700; color: #000; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; }
        .gi-btn:hover { background: #ffed4a; }
        .gi-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .gi-result { margin-top: 20px; padding: 15px; background: #2a2a3e; border-radius: 8px; }
        .gi-loading { color: #888; }
        .gi-error { color: #ff6b6b; }
        .gi-success { color: #69db7c; }
        .gi-metric { display: inline-block; background: #3a3a4e; padding: 15px 25px; border-radius: 8px; margin: 5px; text-align: center; }
        .gi-metric-value { font-size: 28px; font-weight: bold; color: #ffd700; }
        .gi-metric-label { font-size: 12px; color: #888; margin-top: 5px; }
        table.gi-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        table.gi-table th, table.gi-table td { padding: 10px; text-align: left; border-bottom: 1px solid #3a3a4e; }
        table.gi-table th { color: #ffd700; }
        .puntaje-alto { color: #69db7c; }
        .puntaje-medio { color: #ffd43b; }
        .puntaje-bajo { color: #ff6b6b; }
    </style>

    <div class="gi-wrap">
        <h1 style="color: #333;">🧠 Guardian Intelligence</h1>

        <!-- Análisis -->
        <div class="gi-card">
            <h2>📊 Análisis del Catálogo</h2>
            <p style="color: #888;">Analiza todas las historias de guardianes</p>
            <button class="gi-btn" id="btn-analizar" onclick="giAnalizar()">Analizar Todo</button>
            <div id="resultado-analisis" class="gi-result" style="display:none;"></div>
        </div>

        <!-- Reporte Diario -->
        <div class="gi-card">
            <h2>📧 Reporte Diario</h2>
            <p style="color: #888;">Genera y envía el reporte por email</p>
            <button class="gi-btn" id="btn-reporte" onclick="giReporte()">Generar Reporte</button>
            <div id="resultado-reporte" class="gi-result" style="display:none;"></div>
        </div>

        <!-- Estado del Sistema -->
        <div class="gi-card">
            <h2>🔌 Estado del Sistema</h2>
            <button class="gi-btn" id="btn-estado" onclick="giEstado()">Verificar Estado</button>
            <div id="resultado-estado" class="gi-result" style="display:none;"></div>
        </div>
    </div>

    <script>
    const API = '<?php echo $api_base; ?>';

    async function giAnalizar() {
        const btn = document.getElementById('btn-analizar');
        const resultado = document.getElementById('resultado-analisis');

        btn.disabled = true;
        btn.textContent = 'Analizando...';
        resultado.style.display = 'block';
        resultado.innerHTML = '<span class="gi-loading">⏳ Analizando catálogo completo...</span>';

        try {
            const res = await fetch(API + '/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ modo: 'completo' })
            });
            const data = await res.json();

            if (data.success && data.resultado) {
                const r = data.resultado;
                let html = `
                    <div style="margin-bottom: 20px;">
                        <div class="gi-metric">
                            <div class="gi-metric-value">${r.totalProductos || 0}</div>
                            <div class="gi-metric-label">Productos</div>
                        </div>
                        <div class="gi-metric">
                            <div class="gi-metric-value">${r.puntajeGlobal || 0}/100</div>
                            <div class="gi-metric-label">Puntaje Global</div>
                        </div>
                    </div>
                `;

                if (r.productosAnalizados && r.productosAnalizados.length > 0) {
                    html += '<table class="gi-table"><tr><th>Producto</th><th>Puntaje</th><th>Problemas</th></tr>';
                    r.productosAnalizados.slice(0, 20).forEach(p => {
                        const clase = p.puntaje >= 80 ? 'puntaje-alto' : p.puntaje >= 60 ? 'puntaje-medio' : 'puntaje-bajo';
                        const problemas = p.problemas ? p.problemas.map(x => x.tipo).join(', ') : '-';
                        html += `<tr>
                            <td>${p.nombre}</td>
                            <td class="${clase}">${p.puntaje}/100</td>
                            <td style="color:#888;font-size:12px;">${problemas}</td>
                        </tr>`;
                    });
                    html += '</table>';
                    if (r.productosAnalizados.length > 20) {
                        html += `<p style="color:#888;margin-top:10px;">Mostrando 20 de ${r.productosAnalizados.length} productos</p>`;
                    }
                }

                resultado.innerHTML = '<span class="gi-success">✅ Análisis completado</span>' + html;
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (e) {
            resultado.innerHTML = '<span class="gi-error">❌ Error: ' + e.message + '</span>';
        }

        btn.disabled = false;
        btn.textContent = 'Analizar Todo';
    }

    async function giReporte() {
        const btn = document.getElementById('btn-reporte');
        const resultado = document.getElementById('resultado-reporte');

        btn.disabled = true;
        btn.textContent = 'Generando...';
        resultado.style.display = 'block';
        resultado.innerHTML = '<span class="gi-loading">⏳ Generando reporte...</span>';

        try {
            const res = await fetch(API + '/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accion: 'generar', enviarEmail: true })
            });
            const data = await res.json();

            if (data.success) {
                let html = '<span class="gi-success">✅ Reporte generado</span>';
                html += `<p>Email enviado: ${data.emailEnviado ? 'Sí' : 'No'}</p>`;

                if (data.reporte) {
                    const r = data.reporte;
                    html += `<p>Fecha: ${r.fecha}</p>`;
                    html += `<p>Alertas: ${r.alertas ? r.alertas.length : 0}</p>`;
                }
                resultado.innerHTML = html;
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (e) {
            resultado.innerHTML = '<span class="gi-error">❌ Error: ' + e.message + '</span>';
        }

        btn.disabled = false;
        btn.textContent = 'Generar Reporte';
    }

    async function giEstado() {
        const btn = document.getElementById('btn-estado');
        const resultado = document.getElementById('resultado-estado');

        btn.disabled = true;
        btn.textContent = 'Verificando...';
        resultado.style.display = 'block';
        resultado.innerHTML = '<span class="gi-loading">⏳ Verificando servicios...</span>';

        try {
            const res = await fetch(API + '/stats');
            const data = await res.json();

            if (data.success) {
                let html = '<span class="gi-success">✅ Sistema operativo</span>';
                html += '<div style="margin-top:15px;">';

                if (data.stats) {
                    html += `<p>Historias generadas: ${data.stats.historiasGeneradas || 0}</p>`;
                    html += `<p>Historias corregidas: ${data.stats.historiasCorregidas || 0}</p>`;
                }

                html += '</div>';
                resultado.innerHTML = html;
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (e) {
            resultado.innerHTML = '<span class="gi-error">❌ Error: ' + e.message + '</span>';
        }

        btn.disabled = false;
        btn.textContent = 'Verificar Estado';
    }
    </script>
    <?php
}
