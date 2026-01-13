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
           TARJETA IMPRIMIBLE - Diseño CLARO para impresión
           Colores por categoría del guardián
        ═══════════════════════════════════════════════════════════════ */

        .tarjeta-imprimible {
            width: 90mm;
            height: 130mm;
            background: #fff;
            color: #333;
            padding: 6mm;
            box-sizing: border-box;
            font-family: 'Cormorant Garamond', Georgia, serif;
            position: relative;
            overflow: hidden;
            border: 2px solid var(--cat-color, #C6A962);
            border-radius: 4mm;
        }

        /* Colores por categoría */
        .tarjeta-imprimible.cat-proteccion { --cat-color: #4A6FA5; --cat-light: #E8F0FE; }
        .tarjeta-imprimible.cat-abundancia { --cat-color: #2E7D32; --cat-light: #E8F5E9; }
        .tarjeta-imprimible.cat-amor { --cat-color: #C2185B; --cat-light: #FCE4EC; }
        .tarjeta-imprimible.cat-salud,
        .tarjeta-imprimible.cat-sanacion { --cat-color: #00897B; --cat-light: #E0F2F1; }
        .tarjeta-imprimible.cat-sabiduria { --cat-color: #7B1FA2; --cat-light: #F3E5F5; }

        .tarjeta-header {
            text-align: center;
            padding: 3mm;
            background: var(--cat-light, #faf8f5);
            border-radius: 2mm;
            margin-bottom: 4mm;
        }

        .tarjeta-logo {
            font-size: 7pt;
            letter-spacing: 2px;
            color: #888;
            margin-bottom: 2mm;
            text-transform: uppercase;
        }

        .tarjeta-guardian-nombre {
            font-family: 'Cinzel', serif;
            font-size: 14pt;
            color: var(--cat-color, #C6A962);
            margin: 0;
            letter-spacing: 1px;
            line-height: 1.2;
        }

        .tarjeta-subtitulo {
            font-size: 8pt;
            color: #666;
            font-style: italic;
            margin-top: 1mm;
        }

        .tarjeta-qr-container {
            text-align: center;
            margin: 3mm 0;
            padding: 3mm;
            background: var(--cat-light, #faf8f5);
            border-radius: 2mm;
        }

        .tarjeta-qr-container #qr-code-container {
            padding: 2mm !important;
            background: #fff !important;
            border: 1px solid #eee;
            border-radius: 2mm;
        }

        .tarjeta-codigo {
            font-family: 'Courier New', monospace;
            font-size: 9pt;
            color: var(--cat-color, #C6A962);
            letter-spacing: 1px;
            margin-top: 2mm;
            font-weight: bold;
        }

        .tarjeta-mensaje {
            text-align: center;
            padding: 3mm;
            border: 1px solid var(--cat-color, #C6A962);
            border-radius: 2mm;
            margin: 3mm 0;
            background: var(--cat-light, #faf8f5);
        }

        .tarjeta-mensaje-titulo {
            font-family: 'Cinzel', serif;
            font-size: 8pt;
            color: var(--cat-color, #C6A962);
            margin-bottom: 1mm;
        }

        .tarjeta-mensaje-texto {
            font-size: 7pt;
            line-height: 1.4;
            color: #555;
        }

        .tarjeta-instrucciones {
            margin-top: 2mm;
        }

        .tarjeta-instrucciones-titulo {
            font-family: 'Cinzel', serif;
            font-size: 7pt;
            color: var(--cat-color, #C6A962);
            text-align: center;
            margin-bottom: 2mm;
        }

        .tarjeta-paso {
            display: flex;
            align-items: center;
            gap: 2mm;
            margin-bottom: 1mm;
        }

        .tarjeta-paso-num {
            width: 4mm;
            height: 4mm;
            background: var(--cat-color, #C6A962);
            border-radius: 50%;
            color: #fff;
            font-size: 6pt;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .tarjeta-paso-texto {
            font-size: 7pt;
            color: #555;
            line-height: 1.3;
        }

        .tarjeta-footer {
            text-align: center;
            margin-top: 3mm;
            padding-top: 2mm;
            border-top: 1px solid #ddd;
        }

        .tarjeta-footer-texto {
            font-size: 6pt;
            color: #888;
            font-style: italic;
        }

        .tarjeta-categoria-badge {
            position: absolute;
            top: 3mm;
            right: 3mm;
            background: var(--cat-color, #C6A962);
            color: #fff;
            font-size: 6pt;
            padding: 1mm 2mm;
            border-radius: 2mm;
            text-transform: uppercase;
            letter-spacing: 0.5px;
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
                margin: 0;
                box-shadow: none;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
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

    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script>
    // Esperar a que QRCode esté disponible
    function waitForQRCode(callback, maxAttempts = 50) {
        let attempts = 0;
        const check = () => {
            attempts++;
            if (typeof QRCode !== 'undefined') {
                callback();
            } else if (attempts < maxAttempts) {
                setTimeout(check, 100);
            } else {
                console.error('QRCode library failed to load');
            }
        };
        check();
    }

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
            // Verificar que QRCode está cargado
            if (typeof QRCode === 'undefined') {
                alert('Error: La librería de QR no está cargada. Recargá la página.');
                return;
            }

            const res = await fetch(`https://duendes-vercel.vercel.app/api/admin/qr-tarjeta?id=${tarjetaId}`);
            const data = await res.json();

            if (!data.success || !data.tarjeta) {
                alert('Error al cargar tarjeta');
                return;
            }

            const t = data.tarjeta;
            const categoria = (t.guardian?.categoria || 'proteccion').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            // Mapeo de categorías a nombres bonitos
            const categoriasNombres = {
                'proteccion': 'Protección',
                'abundancia': 'Abundancia',
                'amor': 'Amor',
                'salud': 'Salud',
                'sanacion': 'Sanación',
                'sabiduria': 'Sabiduría'
            };

            // Crear tarjeta imprimible
            const printArea = document.getElementById('print-area');
            printArea.innerHTML = `
                <div class="tarjeta-imprimible cat-${categoria}">
                    <div class="tarjeta-categoria-badge">${categoriasNombres[categoria] || categoria}</div>

                    <div class="tarjeta-header">
                        <div class="tarjeta-logo">Duendes del Uruguay</div>
                        <h2 class="tarjeta-guardian-nombre">${t.guardian?.nombre || 'Tu Guardián'}</h2>
                        <p class="tarjeta-subtitulo">Ha elegido acompañarte</p>
                    </div>

                    <div class="tarjeta-qr-container">
                        <div id="qr-code-container"></div>
                        <div class="tarjeta-codigo">${t.codigoQR}</div>
                    </div>

                    <div class="tarjeta-mensaje">
                        <div class="tarjeta-mensaje-titulo">Tu Portal Personal</div>
                        <div class="tarjeta-mensaje-texto">
                            Escaneá este código para acceder a tu<br>
                            <strong>canalización personalizada exclusiva</strong><br>
                            y toda la magia de tu guardián.
                        </div>
                    </div>

                    <div class="tarjeta-instrucciones">
                        <div class="tarjeta-instrucciones-titulo">Cómo Activar tu Magia</div>

                        <div class="tarjeta-paso">
                            <div class="tarjeta-paso-num">1</div>
                            <div class="tarjeta-paso-texto">Escaneá el QR con tu celular</div>
                        </div>

                        <div class="tarjeta-paso">
                            <div class="tarjeta-paso-num">2</div>
                            <div class="tarjeta-paso-texto">Ingresá el email de tu compra</div>
                        </div>

                        <div class="tarjeta-paso">
                            <div class="tarjeta-paso-num">3</div>
                            <div class="tarjeta-paso-texto">Descubrí tu canalización única</div>
                        </div>
                    </div>

                    <div class="tarjeta-footer">
                        <div class="tarjeta-footer-texto">
                            Los guardianes eligen tanto como son elegidos<br>
                            duendesdeluruguay.com
                        </div>
                    </div>
                </div>
            `;

            // Generar QR en el contenedor
            new QRCode(document.getElementById('qr-code-container'), {
                text: t.urlMiMagia,
                width: 150,
                height: 150,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });

            printArea.style.display = 'block';

            // Esperar un momento para que el QR se renderice
            setTimeout(() => {
                window.print();
                setTimeout(() => {
                    printArea.style.display = 'none';
                }, 1000);
            }, 500);

        } catch (error) {
            console.error(error);
            alert('Error al imprimir: ' + error.message);
        }
    };
    </script>
    <?php
}
