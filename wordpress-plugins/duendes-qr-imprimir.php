<?php
/**
 * Plugin Name: Duendes QR Imprimir
 * Description: Panel para imprimir tarjetas QR de guardianes vendidos
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Agregar menú en admin
add_action('admin_menu', function() {
    add_menu_page(
        'Imprimir QR',
        'Imprimir QR',
        'manage_options',
        'duendes-qr-imprimir',
        'duendes_qr_imprimir_page',
        'dashicons-smartphone',
        30
    );
});

function duendes_qr_imprimir_page() {
    ?>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        .qr-admin-container {
            padding: 20px;
            max-width: 1200px;
        }

        .qr-admin-header {
            background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            color: #fff;
        }

        .qr-admin-header h1 {
            font-family: 'Cinzel', serif;
            color: #C6A962;
            margin: 0 0 10px 0;
        }

        .qr-admin-header p {
            color: rgba(255,255,255,0.7);
            margin: 0;
        }

        .tarjetas-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }

        .tarjeta-preview {
            background: #fff;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .tarjeta-info {
            padding: 20px;
            background: #f9f9f9;
            border-bottom: 1px solid #eee;
        }

        .tarjeta-info h3 {
            margin: 0 0 10px 0;
            font-family: 'Cinzel', serif;
            color: #333;
        }

        .tarjeta-info p {
            margin: 5px 0;
            font-size: 13px;
            color: #666;
        }

        .tarjeta-info strong {
            color: #C6A962;
        }

        .btn-imprimir {
            display: block;
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #C6A962, #a88a42);
            border: none;
            color: #000;
            font-family: 'Cinzel', serif;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-imprimir:hover {
            background: linear-gradient(135deg, #d4bc7a, #C6A962);
        }

        /* ═══════════════════════════════════════════════════════════════
           TARJETA IMPRIMIBLE - Diseño para caja
        ═══════════════════════════════════════════════════════════════ */

        .tarjeta-imprimible {
            width: 90mm;
            min-height: 130mm;
            background: linear-gradient(180deg, #0a0a0a 0%, #1a1510 100%);
            color: #fff;
            padding: 8mm;
            box-sizing: border-box;
            font-family: 'Cormorant Garamond', Georgia, serif;
            position: relative;
            overflow: hidden;
        }

        .tarjeta-imprimible::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(ellipse at center top, rgba(198,169,98,0.1) 0%, transparent 60%);
            pointer-events: none;
        }

        .tarjeta-header {
            text-align: center;
            margin-bottom: 5mm;
            position: relative;
            z-index: 1;
        }

        .tarjeta-logo {
            font-size: 8pt;
            letter-spacing: 3px;
            color: rgba(255,255,255,0.5);
            margin-bottom: 3mm;
        }

        .tarjeta-guardian-nombre {
            font-family: 'Cinzel', serif;
            font-size: 18pt;
            color: #C6A962;
            margin: 0;
            letter-spacing: 2px;
        }

        .tarjeta-subtitulo {
            font-size: 9pt;
            color: rgba(255,255,255,0.6);
            font-style: italic;
            margin-top: 2mm;
        }

        .tarjeta-qr-container {
            text-align: center;
            margin: 5mm 0;
            position: relative;
            z-index: 1;
        }

        .tarjeta-qr-container img {
            width: 35mm;
            height: 35mm;
            padding: 3mm;
            background: #fff;
            border-radius: 3mm;
        }

        .tarjeta-codigo {
            font-family: monospace;
            font-size: 8pt;
            color: #C6A962;
            letter-spacing: 1px;
            margin-top: 2mm;
        }

        .tarjeta-mensaje {
            text-align: center;
            padding: 4mm;
            background: rgba(198,169,98,0.1);
            border: 1px solid rgba(198,169,98,0.3);
            border-radius: 3mm;
            margin: 4mm 0;
            position: relative;
            z-index: 1;
        }

        .tarjeta-mensaje-titulo {
            font-family: 'Cinzel', serif;
            font-size: 9pt;
            color: #C6A962;
            margin-bottom: 2mm;
        }

        .tarjeta-mensaje-texto {
            font-size: 8pt;
            line-height: 1.5;
            color: rgba(255,255,255,0.8);
        }

        .tarjeta-instrucciones {
            position: relative;
            z-index: 1;
        }

        .tarjeta-instrucciones-titulo {
            font-family: 'Cinzel', serif;
            font-size: 8pt;
            color: #C6A962;
            text-align: center;
            margin-bottom: 3mm;
        }

        .tarjeta-paso {
            display: flex;
            align-items: flex-start;
            gap: 2mm;
            margin-bottom: 2mm;
        }

        .tarjeta-paso-num {
            width: 4mm;
            height: 4mm;
            background: #C6A962;
            border-radius: 50%;
            color: #000;
            font-size: 6pt;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .tarjeta-paso-texto {
            font-size: 7pt;
            color: rgba(255,255,255,0.7);
            line-height: 1.4;
        }

        .tarjeta-footer {
            text-align: center;
            margin-top: 4mm;
            padding-top: 3mm;
            border-top: 1px solid rgba(198,169,98,0.2);
            position: relative;
            z-index: 1;
        }

        .tarjeta-footer-texto {
            font-size: 6pt;
            color: rgba(255,255,255,0.4);
            font-style: italic;
        }

        .tarjeta-decoracion {
            position: absolute;
            bottom: 5mm;
            right: 5mm;
            font-size: 24pt;
            opacity: 0.1;
        }

        /* Print styles */
        @media print {
            body * {
                visibility: hidden;
            }
            .print-area, .print-area * {
                visibility: visible;
            }
            .print-area {
                position: absolute;
                left: 0;
                top: 0;
            }
            .tarjeta-imprimible {
                page-break-after: always;
                margin: 0;
                box-shadow: none;
            }
        }

        .estado-vacio {
            text-align: center;
            padding: 60px;
            background: #f9f9f9;
            border-radius: 15px;
        }

        .estado-vacio h2 {
            color: #666;
            margin-bottom: 10px;
        }

        .estado-vacio p {
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
    </style>

    <div class="qr-admin-container">
        <div class="qr-admin-header">
            <h1>🎫 Tarjetas QR para Imprimir</h1>
            <p>Cuando alguien compra un guardián, se genera automáticamente una tarjeta para poner en la caja</p>
        </div>

        <div id="tarjetas-container">
            <div class="cargando">
                <div class="spinner"></div>
                <p>Cargando tarjetas pendientes...</p>
            </div>
        </div>
    </div>

    <!-- Área de impresión (oculta) -->
    <div id="print-area" class="print-area" style="display:none;"></div>

    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
    <script>
    (async function() {
        const container = document.getElementById('tarjetas-container');
        const printArea = document.getElementById('print-area');

        try {
            const res = await fetch('https://duendes-vercel.vercel.app/api/admin/qr-tarjeta');
            const data = await res.json();

            if (!data.success || !data.tarjetas || data.tarjetas.length === 0) {
                container.innerHTML = `
                    <div class="estado-vacio">
                        <h2>✨ No hay tarjetas pendientes</h2>
                        <p>Cuando alguien compre un guardián, aparecerá aquí la tarjeta para imprimir.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = '<div class="tarjetas-grid"></div>';
            const grid = container.querySelector('.tarjetas-grid');

            for (const tarjeta of data.tarjetas) {
                const card = document.createElement('div');
                card.className = 'tarjeta-preview';
                card.innerHTML = `
                    <div class="tarjeta-info">
                        <h3>${tarjeta.guardian?.nombre || 'Guardián'}</h3>
                        <p><strong>Cliente:</strong> ${tarjeta.nombreCliente || 'N/A'}</p>
                        <p><strong>Email:</strong> ${tarjeta.email}</p>
                        <p><strong>Orden:</strong> #${tarjeta.ordenId}</p>
                        <p><strong>Código:</strong> ${tarjeta.codigoQR}</p>
                        <p><strong>Fecha:</strong> ${new Date(tarjeta.fechaCompra).toLocaleDateString('es-UY')}</p>
                    </div>
                    <button class="btn-imprimir" onclick="imprimirTarjeta('${tarjeta.id}')">
                        🖨️ Imprimir Tarjeta
                    </button>
                `;
                grid.appendChild(card);
            }

        } catch (error) {
            console.error(error);
            container.innerHTML = `
                <div class="estado-vacio">
                    <h2>Error al cargar</h2>
                    <p>${error.message}</p>
                </div>
            `;
        }
    })();

    window.imprimirTarjeta = async function(tarjetaId) {
        try {
            const res = await fetch(`https://duendes-vercel.vercel.app/api/admin/qr-tarjeta?id=${tarjetaId}`);
            const data = await res.json();

            if (!data.success || !data.tarjeta) {
                alert('Error al cargar tarjeta');
                return;
            }

            const t = data.tarjeta;

            // Generar QR como data URL
            const qrDataUrl = await QRCode.toDataURL(t.urlMiMagia, {
                width: 200,
                margin: 0,
                color: { dark: '#000', light: '#fff' }
            });

            // Crear tarjeta imprimible
            const printArea = document.getElementById('print-area');
            printArea.innerHTML = `
                <div class="tarjeta-imprimible">
                    <div class="tarjeta-header">
                        <div class="tarjeta-logo">DUENDES DEL URUGUAY</div>
                        <h2 class="tarjeta-guardian-nombre">${t.guardian?.nombre || 'Tu Guardián'}</h2>
                        <p class="tarjeta-subtitulo">Ha elegido acompañarte</p>
                    </div>

                    <div class="tarjeta-qr-container">
                        <img src="${qrDataUrl}" alt="QR Mi Magia">
                        <div class="tarjeta-codigo">${t.codigoQR}</div>
                    </div>

                    <div class="tarjeta-mensaje">
                        <div class="tarjeta-mensaje-titulo">✨ Tu Portal Personal</div>
                        <div class="tarjeta-mensaje-texto">
                            Escaneá este código para acceder a tu<br>
                            <strong style="color:#C6A962;">canalización personalizada exclusiva</strong><br>
                            y toda la magia de tu guardián.
                        </div>
                    </div>

                    <div class="tarjeta-instrucciones">
                        <div class="tarjeta-instrucciones-titulo">Cómo Activar tu Magia</div>

                        <div class="tarjeta-paso">
                            <div class="tarjeta-paso-num">1</div>
                            <div class="tarjeta-paso-texto">Escaneá el código QR con tu celular</div>
                        </div>

                        <div class="tarjeta-paso">
                            <div class="tarjeta-paso-num">2</div>
                            <div class="tarjeta-paso-texto">Ingresá el email de tu compra</div>
                        </div>

                        <div class="tarjeta-paso">
                            <div class="tarjeta-paso-num">3</div>
                            <div class="tarjeta-paso-texto">Descubrí tu canalización única y personal</div>
                        </div>
                    </div>

                    <div class="tarjeta-footer">
                        <div class="tarjeta-footer-texto">
                            Los guardianes eligen tanto como son elegidos.<br>
                            duendesdeluruguay.com
                        </div>
                    </div>

                    <div class="tarjeta-decoracion">🍀</div>
                </div>
            `;

            printArea.style.display = 'block';

            // Imprimir
            window.print();

            // Ocultar después
            setTimeout(() => {
                printArea.style.display = 'none';
            }, 1000);

        } catch (error) {
            console.error(error);
            alert('Error al imprimir: ' + error.message);
        }
    };
    </script>
    <?php
}
