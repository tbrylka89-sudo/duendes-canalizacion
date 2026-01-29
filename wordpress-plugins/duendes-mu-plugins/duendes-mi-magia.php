<?php
/**
 * Plugin Name: Duendes Mi Magia
 * Description: Pagina personalizada donde el cliente ve su guardian escaneando el QR
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Shortcode [mi_magia]
add_shortcode('mi_magia', function() {
    ob_start();
    ?>
    <div id="mi-magia-app"></div>

    <style>
    #mi-magia-app {
        font-family: 'Inter', -apple-system, sans-serif;
        background: linear-gradient(180deg, #0a0a0a 0%, #1a1510 100%);
        min-height: 100vh;
        color: #fff;
        padding: 40px 20px;
    }

    .mi-magia-container {
        max-width: 800px;
        margin: 0 auto;
    }

    /* Estado inicial - ingreso de codigo */
    .estado-codigo {
        text-align: center;
        padding: 60px 20px;
    }

    .logo-magia {
        font-size: 80px;
        margin-bottom: 30px;
        animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    .titulo-magia {
        font-family: 'Cinzel', serif;
        font-size: clamp(28px, 6vw, 42px);
        color: #C6A962;
        margin-bottom: 15px;
        letter-spacing: 3px;
    }

    .subtitulo-magia {
        color: rgba(255,255,255,0.6);
        font-size: 16px;
        margin-bottom: 40px;
        font-style: italic;
    }

    .input-codigo-container {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 30px;
    }

    .input-codigo {
        padding: 18px 25px;
        font-size: 18px;
        font-family: 'Cinzel', serif;
        background: rgba(0,0,0,0.4);
        border: 2px solid rgba(198,169,98,0.3);
        border-radius: 12px;
        color: #C6A962;
        text-align: center;
        width: 280px;
        letter-spacing: 3px;
        transition: all 0.3s;
    }

    .input-codigo:focus {
        outline: none;
        border-color: #C6A962;
        box-shadow: 0 0 30px rgba(198,169,98,0.2);
    }

    .input-codigo::placeholder {
        color: rgba(198,169,98,0.4);
        letter-spacing: 1px;
    }

    .btn-buscar {
        padding: 18px 35px;
        background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
        border: none;
        border-radius: 12px;
        color: #000;
        font-family: 'Cinzel', serif;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }

    .btn-buscar:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(198,169,98,0.3);
    }

    .info-escaneo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: rgba(255,255,255,0.4);
        font-size: 14px;
    }

    /* Estado cargando */
    .estado-cargando {
        text-align: center;
        padding: 100px 20px;
    }

    .spinner-magia {
        width: 80px;
        height: 80px;
        border: 3px solid rgba(198,169,98,0.2);
        border-top-color: #C6A962;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 30px;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .texto-cargando {
        font-family: 'Cinzel', serif;
        font-size: 20px;
        color: #C6A962;
    }

    /* Estado guardian encontrado */
    .estado-guardian {
        animation: fadeIn 0.8s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .guardian-header {
        text-align: center;
        padding: 40px 20px;
        background: linear-gradient(180deg, rgba(198,169,98,0.1) 0%, transparent 100%);
        border-radius: 24px;
        margin-bottom: 40px;
    }

    .guardian-imagen {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #C6A962;
        margin-bottom: 25px;
        box-shadow: 0 0 50px rgba(198,169,98,0.3);
    }

    .guardian-nombre {
        font-family: 'Cinzel', serif;
        font-size: clamp(32px, 8vw, 48px);
        color: #C6A962;
        margin-bottom: 10px;
        letter-spacing: 4px;
    }

    .guardian-subtitulo {
        color: rgba(255,255,255,0.6);
        font-size: 18px;
        font-style: italic;
        margin-bottom: 20px;
    }

    .guardian-badges {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
    }

    .guardian-badge {
        padding: 8px 20px;
        background: rgba(198,169,98,0.15);
        border: 1px solid rgba(198,169,98,0.3);
        border-radius: 30px;
        font-size: 13px;
        color: #C6A962;
    }

    /* Secciones de contenido */
    .seccion-magia {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(198,169,98,0.15);
        border-radius: 20px;
        padding: 30px;
        margin-bottom: 25px;
    }

    .seccion-titulo {
        font-family: 'Cinzel', serif;
        font-size: 20px;
        color: #C6A962;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .seccion-titulo-icono {
        font-size: 24px;
    }

    .seccion-contenido {
        color: rgba(255,255,255,0.8);
        line-height: 1.8;
        font-size: 15px;
    }

    /* Mensaje directo especial */
    .mensaje-directo {
        background: linear-gradient(135deg, rgba(198,169,98,0.15) 0%, rgba(198,169,98,0.05) 100%);
        border-color: rgba(198,169,98,0.3);
        text-align: center;
        padding: 40px;
    }

    .mensaje-directo .seccion-contenido {
        font-family: 'Cormorant Garamond', serif;
        font-size: 20px;
        font-style: italic;
        color: rgba(255,255,255,0.9);
    }

    /* Dones lista */
    .dones-lista {
        display: grid;
        gap: 15px;
    }

    .don-item {
        display: flex;
        gap: 15px;
        padding: 15px;
        background: rgba(0,0,0,0.2);
        border-radius: 12px;
    }

    .don-icono {
        font-size: 24px;
        flex-shrink: 0;
    }

    .don-nombre {
        color: #C6A962;
        font-weight: 500;
        margin-bottom: 5px;
    }

    .don-desc {
        color: rgba(255,255,255,0.6);
        font-size: 14px;
    }

    /* Ritual pasos */
    .ritual-pasos {
        display: grid;
        gap: 20px;
    }

    .ritual-paso {
        display: flex;
        gap: 20px;
        align-items: flex-start;
    }

    .ritual-numero {
        width: 40px;
        height: 40px;
        background: rgba(198,169,98,0.2);
        border: 1px solid #C6A962;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Cinzel', serif;
        color: #C6A962;
        flex-shrink: 0;
    }

    .ritual-paso-contenido h4 {
        color: #C6A962;
        margin-bottom: 5px;
        font-size: 16px;
    }

    .ritual-paso-contenido p {
        color: rgba(255,255,255,0.7);
        font-size: 14px;
        margin: 0;
    }

    /* Estado error */
    .estado-error {
        text-align: center;
        padding: 80px 20px;
    }

    .error-icono {
        font-size: 60px;
        margin-bottom: 20px;
        opacity: 0.5;
    }

    .error-titulo {
        font-family: 'Cinzel', serif;
        font-size: 24px;
        color: rgba(255,255,255,0.6);
        margin-bottom: 15px;
    }

    .error-mensaje {
        color: rgba(255,255,255,0.4);
        margin-bottom: 30px;
    }

    /* ═══════════════════════════════════════════════════════════════
       CONTENIDO BORROSO PARA NO COMPRADORES
    ═══════════════════════════════════════════════════════════════ */
    .contenido-bloqueado {
        position: relative;
        overflow: hidden;
    }

    .contenido-borroso {
        filter: blur(8px);
        pointer-events: none;
        user-select: none;
    }

    .overlay-desbloquear {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.95) 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        text-align: center;
    }

    .desbloquear-icono {
        font-size: 50px;
        margin-bottom: 20px;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
    }

    .desbloquear-titulo {
        font-family: 'Cinzel', serif;
        font-size: 24px;
        color: #C6A962;
        margin-bottom: 15px;
    }

    .desbloquear-texto {
        color: rgba(255,255,255,0.7);
        margin-bottom: 25px;
        max-width: 400px;
        line-height: 1.6;
    }

    .btn-comprar {
        padding: 16px 40px;
        background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
        border: none;
        border-radius: 30px;
        color: #000;
        font-family: 'Cinzel', serif;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        transition: all 0.3s;
        margin-bottom: 15px;
    }

    .btn-comprar:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(198,169,98,0.4);
    }

    /* ═══════════════════════════════════════════════════════════════
       FORMULARIO DE RECANALIZACIÓN
    ═══════════════════════════════════════════════════════════════ */
    .recanalizacion-card {
        background: linear-gradient(135deg, rgba(198,169,98,0.1) 0%, rgba(198,169,98,0.05) 100%);
        border: 2px solid rgba(198,169,98,0.3);
        border-radius: 20px;
        padding: 30px;
        margin-top: 30px;
    }

    .recan-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
    }

    .recan-icono {
        font-size: 36px;
    }

    .recan-titulo {
        font-family: 'Cinzel', serif;
        font-size: 22px;
        color: #C6A962;
    }

    .recan-subtitulo {
        color: rgba(255,255,255,0.6);
        font-size: 14px;
    }

    .recan-descripcion {
        color: rgba(255,255,255,0.7);
        line-height: 1.7;
        margin-bottom: 25px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(198,169,98,0.2);
    }

    .recan-tipos {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 20px;
    }

    .recan-tipo {
        background: rgba(0,0,0,0.3);
        border: 2px solid rgba(198,169,98,0.2);
        border-radius: 12px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s;
        text-align: center;
    }

    .recan-tipo:hover, .recan-tipo.selected {
        border-color: #C6A962;
        background: rgba(198,169,98,0.15);
    }

    .recan-tipo-icono {
        font-size: 28px;
        margin-bottom: 10px;
    }

    .recan-tipo-titulo {
        font-family: 'Cinzel', serif;
        color: #C6A962;
        font-size: 15px;
        margin-bottom: 5px;
    }

    .recan-tipo-precio {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
    }

    .recan-tipo-desc {
        font-size: 12px;
        color: rgba(255,255,255,0.5);
        margin-top: 8px;
    }

    .recan-form-group {
        margin-bottom: 20px;
    }

    .recan-label {
        display: block;
        color: #C6A962;
        font-size: 14px;
        margin-bottom: 8px;
        font-family: 'Cinzel', serif;
    }

    .recan-input, .recan-textarea {
        width: 100%;
        padding: 14px 18px;
        background: rgba(0,0,0,0.4);
        border: 1px solid rgba(198,169,98,0.3);
        border-radius: 10px;
        color: #fff;
        font-size: 15px;
        box-sizing: border-box;
        transition: border-color 0.3s;
    }

    .recan-input:focus, .recan-textarea:focus {
        outline: none;
        border-color: #C6A962;
    }

    .recan-textarea {
        min-height: 100px;
        resize: vertical;
    }

    .recan-file-label {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 20px;
        background: rgba(0,0,0,0.3);
        border: 2px dashed rgba(198,169,98,0.3);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .recan-file-label:hover {
        border-color: #C6A962;
        background: rgba(198,169,98,0.1);
    }

    .recan-file-input {
        display: none;
    }

    .btn-enviar-recan {
        width: 100%;
        padding: 18px;
        background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
        border: none;
        border-radius: 12px;
        color: #000;
        font-family: 'Cinzel', serif;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        margin-top: 10px;
    }

    .btn-enviar-recan:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(198,169,98,0.3);
    }

    .btn-enviar-recan:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    .recan-success {
        text-align: center;
        padding: 40px;
    }

    .recan-success-icono {
        font-size: 60px;
        margin-bottom: 20px;
    }

    .recan-success-titulo {
        font-family: 'Cinzel', serif;
        font-size: 24px;
        color: #C6A962;
        margin-bottom: 15px;
    }

    .recan-success-texto {
        color: rgba(255,255,255,0.7);
        line-height: 1.6;
    }

    @media (max-width: 600px) {
        .recan-tipos {
            grid-template-columns: 1fr;
        }
    }

    /* Responsive */
    @media (max-width: 600px) {
        .input-codigo-container {
            flex-direction: column;
            align-items: center;
        }

        .input-codigo, .btn-buscar {
            width: 100%;
            max-width: 300px;
        }

        .guardian-imagen {
            width: 150px;
            height: 150px;
        }

        .seccion-magia {
            padding: 20px;
        }
    }

    /* ═══════════════════════════════════════════════════════════════
       FORZAR COLORES - Evitar conflictos con WooCommerce/Theme
    ═══════════════════════════════════════════════════════════════ */

    #mi-magia-app,
    #mi-magia-app * {
        color: #fff !important;
    }

    #mi-magia-app {
        background: linear-gradient(180deg, #0a0a0a 0%, #1a1510 100%) !important;
    }

    .titulo-magia,
    .guardian-nombre,
    .seccion-titulo,
    .texto-cargando,
    .don-nombre,
    .ritual-numero,
    .ritual-paso-contenido h4,
    .guardian-badge {
        color: #C6A962 !important;
    }

    .subtitulo-magia,
    .guardian-subtitulo,
    .info-escaneo,
    .error-titulo {
        color: rgba(255,255,255,0.6) !important;
    }

    .seccion-contenido,
    .ritual-paso-contenido p,
    .don-desc {
        color: rgba(255,255,255,0.8) !important;
    }

    .input-codigo {
        color: #C6A962 !important;
        background: rgba(0,0,0,0.4) !important;
        border-color: rgba(198,169,98,0.3) !important;
    }

    .btn-buscar {
        color: #000 !important;
        background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%) !important;
    }

    /* Ocultar elementos del tema que interfieren */
    #mi-magia-app .site-header,
    #mi-magia-app header:not(.guardian-header),
    #mi-magia-app .main-navigation {
        display: none !important;
    }
    </style>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">

    <script>
    (function() {
        const API_URL = 'https://duendes-vercel.vercel.app/api/producto';
        const API_USUARIO = 'https://duendes-vercel.vercel.app/api/mi-magia/usuario';
        const API_LECTURAS = 'https://duendes-vercel.vercel.app/api/mi-magia/lecturas';
        const app = document.getElementById('mi-magia-app');

        // Obtener codigo de URL si existe
        const urlParams = new URLSearchParams(window.location.search);
        const codigoUrl = urlParams.get('codigo');

        // Estado inicial
        let estado = 'codigo';
        let guardianData = null;
        let canalizacionPersonal = null;
        let usuarioData = null;
        let codigoActual = '';

        function render() {
            if (estado === 'codigo') {
                renderEstadoCodigo();
            } else if (estado === 'cargando') {
                renderEstadoCargando();
            } else if (estado === 'verificar-email') {
                renderVerificarEmail();
            } else if (estado === 'cargando-personal') {
                renderCargandoPersonal();
            } else if (estado === 'canalizado') {
                renderCanalizacionPersonal();
            } else if (estado === 'guardian') {
                renderEstadoGuardian();
            } else if (estado === 'error') {
                renderEstadoError();
            }
        }

        function renderEstadoCodigo() {
            app.innerHTML = `
                <div class="mi-magia-container">
                    <div class="estado-codigo">
                        <div class="logo-magia">🔮</div>
                        <h1 class="titulo-magia">Mi Magia</h1>
                        <p class="subtitulo-magia">Ingresá el código de tu guardián para acceder a su espacio mágico</p>

                        <div class="input-codigo-container">
                            <input type="text"
                                   id="input-codigo"
                                   class="input-codigo"
                                   placeholder="DU2601-00001"
                                   value="${codigoUrl || ''}"
                                   maxlength="13">
                            <button class="btn-buscar" onclick="buscarGuardian()">
                                Conectar
                            </button>
                        </div>

                        <div class="info-escaneo">
                            <span>📱</span>
                            <span>Escaneá el QR de tu guardián para acceder automáticamente</span>
                        </div>
                    </div>
                </div>
            `;

            // Si hay codigo en URL, buscar automaticamente
            if (codigoUrl) {
                setTimeout(buscarGuardian, 500);
            }

            // Enter para buscar
            document.getElementById('input-codigo')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') buscarGuardian();
            });
        }

        function renderEstadoCargando() {
            app.innerHTML = `
                <div class="mi-magia-container">
                    <div class="estado-cargando">
                        <div class="spinner-magia"></div>
                        <div class="texto-cargando">Conectando con tu guardián...</div>
                    </div>
                </div>
            `;
        }

        function renderEstadoGuardian() {
            const g = guardianData;

            app.innerHTML = `
                <div class="mi-magia-container">
                    <div class="estado-guardian">
                        <div class="guardian-header">
                            <img src="${g.imagenPrincipal || ''}" alt="${g.nombre}" class="guardian-imagen">
                            <h1 class="guardian-nombre">${g.nombre}</h1>
                            <p class="guardian-subtitulo">${g.encabezado?.subtitulo || g.encabezado?.tagline || ''}</p>
                            <div class="guardian-badges">
                                <span class="guardian-badge">${g.tipo || 'Guardián'}</span>
                                <span class="guardian-badge">${g.elemento || 'Tierra'}</span>
                                <span class="guardian-badge">${g.proposito || 'Protección'}</span>
                            </div>
                        </div>

                        ${g.mensajeDirecto?.mensaje ? `
                        <div class="seccion-magia mensaje-directo">
                            <h3 class="seccion-titulo">
                                <span class="seccion-titulo-icono">💬</span>
                                ${g.mensajeDirecto?.titulo || g.nombre + ' te dice...'}
                            </h3>
                            <div class="seccion-contenido">"${g.mensajeDirecto.mensaje}"</div>
                        </div>
                        ` : ''}

                        ${g.vidaAnterior?.texto ? `
                        <div class="seccion-magia">
                            <h3 class="seccion-titulo">
                                <span class="seccion-titulo-icono">📜</span>
                                ${g.vidaAnterior?.titulo || 'Su Historia'}
                            </h3>
                            <div class="seccion-contenido">${g.vidaAnterior.texto}</div>
                        </div>
                        ` : ''}

                        ${g.personalidad?.texto ? `
                        <div class="seccion-magia">
                            <h3 class="seccion-titulo">
                                <span class="seccion-titulo-icono">✨</span>
                                ${g.personalidad?.titulo || 'Personalidad'}
                            </h3>
                            <div class="seccion-contenido">${g.personalidad.texto}</div>
                        </div>
                        ` : ''}

                        ${g.dones?.lista?.length > 0 ? `
                        <div class="seccion-magia">
                            <h3 class="seccion-titulo">
                                <span class="seccion-titulo-icono">🎁</span>
                                ${g.dones?.titulo || 'Sus Dones'}
                            </h3>
                            <div class="dones-lista">
                                ${g.dones.lista.map((d, i) => `
                                    <div class="don-item">
                                        <span class="don-icono">${['🌟', '💫', '⭐', '✨', '🔮'][i % 5]}</span>
                                        <div>
                                            <div class="don-nombre">${d.nombre}</div>
                                            <div class="don-desc">${d.descripcion}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        ${g.ritual?.pasos?.length > 0 ? `
                        <div class="seccion-magia">
                            <h3 class="seccion-titulo">
                                <span class="seccion-titulo-icono">🕯️</span>
                                ${g.ritual?.titulo || 'Ritual de Bienvenida'}
                            </h3>
                            ${g.ritual.intro ? `<p class="seccion-contenido" style="margin-bottom: 20px;">${g.ritual.intro}</p>` : ''}
                            <div class="ritual-pasos">
                                ${g.ritual.pasos.map(p => `
                                    <div class="ritual-paso">
                                        <div class="ritual-numero">${p.paso}</div>
                                        <div class="ritual-paso-contenido">
                                            <h4>${p.titulo}</h4>
                                            <p>${p.descripcion}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        ${g.cuidados ? `
                        <div class="seccion-magia">
                            <h3 class="seccion-titulo">
                                <span class="seccion-titulo-icono">🌿</span>
                                ${g.cuidados?.titulo || 'Cómo Cuidarlo'}
                            </h3>
                            <div class="seccion-contenido">
                                ${g.cuidados.ubicacion ? `<p><strong>Ubicación:</strong> ${g.cuidados.ubicacion}</p>` : ''}
                                ${g.cuidados.limpieza ? `<p><strong>Limpieza energética:</strong> ${g.cuidados.limpieza}</p>` : ''}
                                ${g.cuidados.fechasEspeciales ? `<p><strong>Fechas especiales:</strong> ${g.cuidados.fechasEspeciales}</p>` : ''}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        function renderEstadoError() {
            app.innerHTML = `
                <div class="mi-magia-container">
                    <div class="estado-error">
                        <div class="error-icono">🔍</div>
                        <h2 class="error-titulo">Guardián no encontrado</h2>
                        <p class="error-mensaje">El código ingresado no corresponde a ningún guardián canalizado.</p>
                        <button class="btn-buscar" onclick="volverInicio()">Intentar de nuevo</button>
                    </div>
                </div>
            `;
        }

        function renderVerificarEmail() {
            const g = guardianData;
            app.innerHTML = `
                <div class="mi-magia-container">
                    <div class="estado-codigo">
                        <img src="${g.imagenPrincipal || ''}" alt="${g.nombre}" class="guardian-imagen" style="width:120px;height:120px;margin-bottom:20px;">
                        <h1 class="titulo-magia">${g.nombre}</h1>
                        <p class="subtitulo-magia">${g.encabezado?.subtitulo || 'Guardián del Bosque Ancestral'}</p>

                        <div style="background:rgba(198,169,98,0.1);border:1px solid rgba(198,169,98,0.3);border-radius:16px;padding:30px;margin:30px 0;max-width:500px;">
                            <h3 style="color:#C6A962;margin-bottom:15px;font-family:'Cinzel',serif;">¿Sos el/la dueño/a de ${g.nombre}?</h3>
                            <p style="color:rgba(255,255,255,0.7);margin-bottom:20px;font-size:14px;">
                                Ingresá el email con el que realizaste la compra para acceder a tu <strong style="color:#C6A962;">canalización personalizada exclusiva</strong>.
                            </p>

                            <input type="email"
                                   id="input-email"
                                   class="input-codigo"
                                   placeholder="tu@email.com"
                                   style="width:100%;margin-bottom:15px;">

                            <button class="btn-buscar" onclick="verificarEmail()" style="width:100%;margin-bottom:10px;">
                                Ver mi canalización
                            </button>

                            <button onclick="verInfoGeneral()" style="background:transparent;border:1px solid rgba(198,169,98,0.3);color:rgba(255,255,255,0.6);padding:12px;border-radius:8px;cursor:pointer;width:100%;font-size:13px;">
                                Solo quiero ver la info general
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('input-email')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') verificarEmail();
            });
        }

        function renderCargandoPersonal() {
            app.innerHTML = `
                <div class="mi-magia-container">
                    <div class="estado-cargando">
                        <div class="spinner-magia"></div>
                        <div class="texto-cargando">Buscando tu canalización personal...</div>
                        <p style="color:rgba(255,255,255,0.5);margin-top:15px;font-size:14px;">
                            Esto puede tomar unos segundos
                        </p>
                    </div>
                </div>
            `;
        }

        function renderCanalizacionPersonal() {
            const g = guardianData;
            const c = canalizacionPersonal;

            // Convertir markdown básico a HTML
            let contenidoHTML = (c.contenido || 'Tu canalización está siendo preparada.')
                .replace(/^# (.*?)$/gm, '<h2 class="canal-h1">$1</h2>')
                .replace(/^## (.*?)$/gm, '<h3 class="canal-h2">$1</h3>')
                .replace(/^### (.*?)$/gm, '<h4 class="canal-h3">$1</h4>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br>');
            contenidoHTML = '<p>' + contenidoHTML + '</p>';

            app.innerHTML = `
                <style>
                    .canal-contenido-personal {
                        text-align: left !important;
                        font-size: 17px !important;
                        line-height: 1.9 !important;
                        font-family: 'Cormorant Garamond', Georgia, serif !important;
                    }
                    .canal-contenido-personal p {
                        margin-bottom: 20px !important;
                    }
                    .canal-contenido-personal .canal-h1,
                    .canal-contenido-personal .canal-h2 {
                        font-family: 'Cinzel', serif !important;
                        color: #C6A962 !important;
                        margin-top: 40px !important;
                        margin-bottom: 20px !important;
                        padding-bottom: 10px !important;
                        border-bottom: 1px solid rgba(198,169,98,0.3) !important;
                    }
                    .canal-contenido-personal .canal-h1 { font-size: 26px !important; }
                    .canal-contenido-personal .canal-h2 { font-size: 22px !important; }
                    .canal-contenido-personal .canal-h3 {
                        font-family: 'Cinzel', serif !important;
                        color: #C6A962 !important;
                        font-size: 18px !important;
                        margin-top: 25px !important;
                        margin-bottom: 15px !important;
                    }
                    .canal-contenido-personal strong {
                        color: #C6A962 !important;
                    }
                </style>
                <div class="mi-magia-container">
                    <div class="estado-guardian">
                        <div class="guardian-header">
                            <div style="background:linear-gradient(135deg,#C6A962,#8B7355);color:#000;padding:8px 20px;border-radius:20px;font-size:12px;letter-spacing:2px;margin-bottom:20px;display:inline-block;">
                                ✨ CANALIZACIÓN EXCLUSIVA PARA VOS ✨
                            </div>
                            <img src="${g.imagenPrincipal || c.guardian?.imagen || ''}" alt="${g.nombre}" class="guardian-imagen">
                            <h1 class="guardian-nombre">${c.guardian?.nombre || g.nombre}</h1>
                            <p class="guardian-subtitulo">Tu guardián personal</p>
                        </div>

                        <div class="seccion-magia" style="border:2px solid #C6A962;padding:40px;">
                            <div class="canal-contenido-personal">
                                ${contenidoHTML}
                            </div>
                            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:30px;text-align:center;border-top:1px solid rgba(198,169,98,0.2);padding-top:20px;">
                                Canalización generada el ${c.fecha ? new Date(c.fecha).toLocaleDateString('es-UY', {day:'numeric',month:'long',year:'numeric'}) : 'fecha no disponible'}
                            </p>
                        </div>

                        <button onclick="verInfoGeneral()" class="btn-buscar" style="margin-top:20px;background:transparent;border:2px solid #C6A962;color:#C6A962 !important;">
                            Ver también la info general de ${g.nombre}
                        </button>
                    </div>
                </div>
            `;
        }

        window.buscarGuardian = async function() {
            const input = document.getElementById('input-codigo');
            const codigo = input?.value?.trim();

            if (!codigo) {
                alert('Ingresá el código de tu guardián');
                return;
            }

            codigoActual = codigo;
            estado = 'cargando';
            render();

            try {
                // Extraer ID del producto del codigo (DU2601-00048 -> 48)
                const match = codigo.match(/DU\d{4}-(\d{5})/);
                if (!match) {
                    throw new Error('Código inválido');
                }

                const productId = parseInt(match[1], 10);

                // Primero intentar buscar el producto en WooCommerce
                try {
                    const res = await fetch(`${API_URL}/${productId}`);
                    const data = await res.json();

                    if (data.success && data.nombre) {
                        guardianData = data;
                        estado = 'verificar-email';
                        render();
                        return;
                    }
                } catch (e) {
                    console.log('Producto no encontrado en WooCommerce, buscando en tarjetas QR...');
                }

                // Si no se encontró en WooCommerce, buscar la tarjeta QR directamente
                const tarjetaRes = await fetch(`https://duendes-vercel.vercel.app/api/admin/qr-tarjeta?codigo=${encodeURIComponent(codigo)}`);
                const tarjetaData = await tarjetaRes.json();

                if (tarjetaData.success && tarjetaData.tarjeta) {
                    // Crear guardianData desde la tarjeta
                    const t = tarjetaData.tarjeta;
                    guardianData = {
                        id: t.guardian?.id || productId,
                        nombre: t.guardian?.nombre || 'Tu Guardián',
                        imagenPrincipal: t.guardian?.imagen || '',
                        categoria: t.guardian?.categoria || 'protección',
                        tipo: 'Guardián',
                        elemento: 'Tierra',
                        proposito: t.guardian?.categoria || 'Protección',
                        encabezado: {
                            subtitulo: 'Guardián del Bosque Ancestral'
                        }
                    };
                    estado = 'verificar-email';
                    render();
                    return;
                }

                throw new Error('No encontrado');
            } catch (e) {
                console.error(e);
                estado = 'error';
            }

            render();
        };

        window.verificarEmail = async function() {
            const input = document.getElementById('input-email');
            const email = input?.value?.trim().toLowerCase();

            if (!email || !email.includes('@')) {
                alert('Ingresá un email válido');
                return;
            }

            estado = 'cargando-personal';
            render();

            try {
                // Buscar lecturas del usuario por email
                const res = await fetch(`https://duendes-vercel.vercel.app/api/mi-magia/lecturas-por-email?email=${encodeURIComponent(email)}`);
                const data = await res.json();

                if (data.success && data.lecturas && data.lecturas.length > 0) {
                    // Buscar canalización de este guardián
                    const canalizacion = data.lecturas.find(l =>
                        l.tipo === 'canalizacion-guardian' &&
                        (l.guardian?.nombre === guardianData.nombre || l.nombre === guardianData.nombre)
                    );

                    if (canalizacion) {
                        canalizacionPersonal = canalizacion;
                        estado = 'canalizado';
                    } else {
                        // No hay canalización para este guardián específico
                        alert('No encontramos una canalización personalizada para este guardián. Puede que aún esté siendo preparada (toma unas horas después de la compra).');
                        estado = 'guardian';
                    }
                } else {
                    // Email no encontrado o sin lecturas
                    alert('No encontramos compras con ese email. Si recién compraste, tu canalización estará lista en unas horas.');
                    estado = 'guardian';
                }
            } catch (e) {
                console.error(e);
                alert('Error al buscar. Mostrando info general.');
                estado = 'guardian';
            }

            render();
        };

        window.verInfoGeneral = function() {
            estado = 'guardian';
            render();
        };

        window.volverInicio = function() {
            estado = 'codigo';
            guardianData = null;
            canalizacionPersonal = null;
            usuarioData = null;
            render();
        };

        // ═══════════════════════════════════════════════════════════════
        // RECANALIZACIÓN - Formulario para clientes
        // ═══════════════════════════════════════════════════════════════

        let tipoRecanSeleccionado = 'nuestro';
        let recanEnviada = false;

        window.mostrarFormRecanalización = function() {
            estado = 'recanalizacion';
            render();
        };

        function renderRecanalizacion() {
            if (recanEnviada) {
                return renderRecanExito();
            }

            const g = guardianData;
            app.innerHTML = `
                <div class="mi-magia-container">
                    <div class="estado-guardian">
                        <div style="text-align:center;margin-bottom:30px;">
                            <button onclick="verInfoGeneral()" style="background:transparent;border:1px solid rgba(198,169,98,0.3);color:rgba(255,255,255,0.6);padding:10px 20px;border-radius:20px;cursor:pointer;font-size:13px;">
                                ← Volver a ${g?.nombre || 'tu guardián'}
                            </button>
                        </div>

                        <div class="recanalizacion-card">
                            <div class="recan-header">
                                <span class="recan-icono">✨</span>
                                <div>
                                    <h3 class="recan-titulo">Solicitar Recanalización</h3>
                                    <p class="recan-subtitulo">Recibí un nuevo mensaje actualizado de tu guardián</p>
                                </div>
                            </div>

                            <p class="recan-descripcion">
                                La recanalización es una nueva conexión con tu guardián que refleja tu momento actual.
                                Ideal si han pasado meses desde tu primera canalización o estás atravesando una etapa diferente.
                            </p>

                            <p style="color:#C6A962;margin-bottom:15px;font-family:'Cinzel',serif;font-size:14px;">¿De qué tipo es tu guardián?</p>

                            <div class="recan-tipos">
                                <div class="recan-tipo ${tipoRecanSeleccionado === 'nuestro' ? 'selected' : ''}" onclick="selectTipoRecan('nuestro')">
                                    <div class="recan-tipo-icono">🏠</div>
                                    <div class="recan-tipo-titulo">Duende de Duendes</div>
                                    <div class="recan-tipo-precio">GRATIS</div>
                                    <div class="recan-tipo-desc">Lo compraste en Duendes del Uruguay</div>
                                </div>

                                <div class="recan-tipo ${tipoRecanSeleccionado === 'ajeno' ? 'selected' : ''}" onclick="selectTipoRecan('ajeno')">
                                    <div class="recan-tipo-icono">🌍</div>
                                    <div class="recan-tipo-titulo">Duende Externo</div>
                                    <div class="recan-tipo-precio">$7 USD</div>
                                    <div class="recan-tipo-desc">Es de otro lugar o fue un regalo</div>
                                </div>
                            </div>

                            <form id="form-recanalizacion" onsubmit="enviarRecanalizacion(event)">
                                <div class="recan-form-group">
                                    <label class="recan-label">Nombre del guardián</label>
                                    <input type="text" class="recan-input" id="recan-nombre-duende" value="${g?.nombre || ''}" required>
                                </div>

                                <div class="recan-form-group">
                                    <label class="recan-label">Tu email de compra</label>
                                    <input type="email" class="recan-input" id="recan-email" placeholder="tu@email.com" required>
                                </div>

                                <div class="recan-form-group">
                                    <label class="recan-label">Foto del guardián (opcional)</label>
                                    <label class="recan-file-label" id="label-foto">
                                        <span>📷</span>
                                        <span id="foto-texto">Seleccionar imagen</span>
                                        <input type="file" class="recan-file-input" id="recan-foto" accept="image/*" onchange="updateFotoLabel(this)">
                                    </label>
                                </div>

                                <div class="recan-form-group">
                                    <label class="recan-label">¿Qué momento estás atravesando?</label>
                                    <textarea class="recan-textarea" id="recan-momento" placeholder="Contanos brevemente qué está pasando en tu vida, qué sentís, qué necesitás..." required></textarea>
                                </div>

                                <div class="recan-form-group">
                                    <label class="recan-label">¿Qué te gustaría preguntarle a tu guardián?</label>
                                    <textarea class="recan-textarea" id="recan-pregunta" placeholder="Una pregunta específica o tema que querés que aborde..." style="min-height:80px;"></textarea>
                                </div>

                                <button type="submit" class="btn-enviar-recan" id="btn-enviar-recan">
                                    ${tipoRecanSeleccionado === 'nuestro' ? '✨ Solicitar Recanalización Gratuita' : '✨ Solicitar Recanalización ($7 USD)'}
                                </button>

                                ${tipoRecanSeleccionado === 'nuestro' ? `
                                    <p style="color:rgba(255,255,255,0.5);font-size:12px;text-align:center;margin-top:15px;">
                                        Tu solicitud será revisada para verificar la compra
                                    </p>
                                ` : ''}
                            </form>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderRecanExito() {
            app.innerHTML = `
                <div class="mi-magia-container">
                    <div class="estado-guardian">
                        <div class="recanalizacion-card">
                            <div class="recan-success">
                                <div class="recan-success-icono">✨</div>
                                <h3 class="recan-success-titulo">¡Solicitud Enviada!</h3>
                                <p class="recan-success-texto">
                                    ${tipoRecanSeleccionado === 'nuestro'
                                        ? 'Revisaremos tu solicitud y te contactaremos pronto. Si todo está en orden, recibirás tu nueva canalización en tu email en 24-48 horas.'
                                        : 'Te enviaremos un link de pago por email. Una vez confirmado el pago, recibirás tu nueva canalización en 24-48 horas.'
                                    }
                                </p>
                                <button onclick="volverInicio()" class="btn-buscar" style="margin-top:25px;">
                                    Volver al inicio
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        window.selectTipoRecan = function(tipo) {
            tipoRecanSeleccionado = tipo;
            renderRecanalizacion();
        };

        window.updateFotoLabel = function(input) {
            const texto = document.getElementById('foto-texto');
            if (input.files && input.files[0]) {
                texto.textContent = input.files[0].name;
            } else {
                texto.textContent = 'Seleccionar imagen';
            }
        };

        window.enviarRecanalizacion = async function(e) {
            e.preventDefault();

            const btn = document.getElementById('btn-enviar-recan');
            const originalText = btn.textContent;
            btn.textContent = '⏳ Enviando...';
            btn.disabled = true;

            const formData = new FormData();
            formData.append('action', 'duendes_solicitar_recanalizacion');
            formData.append('nonce', '<?php echo wp_create_nonce("duendes_public"); ?>');
            formData.append('tipo', tipoRecanSeleccionado);
            formData.append('nombre_duende', document.getElementById('recan-nombre-duende').value);
            formData.append('email', document.getElementById('recan-email').value);
            formData.append('momento_actual', document.getElementById('recan-momento').value);
            formData.append('pregunta', document.getElementById('recan-pregunta').value || '');

            const fotoInput = document.getElementById('recan-foto');
            if (fotoInput.files && fotoInput.files[0]) {
                formData.append('foto', fotoInput.files[0]);
            }

            try {
                const res = await fetch('<?php echo admin_url("admin-ajax.php"); ?>', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();

                if (data.success) {
                    recanEnviada = true;
                    renderRecanExito();
                } else {
                    alert('Error: ' + (data.data?.message || 'Intenta de nuevo'));
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
            } catch (err) {
                alert('Error de conexión. Intenta de nuevo.');
                btn.textContent = originalText;
                btn.disabled = false;
            }
        };

        // ═══════════════════════════════════════════════════════════════
        // CONTENIDO BORROSO - Vista previa para no compradores
        // ═══════════════════════════════════════════════════════════════

        function renderVistaPrevia() {
            const g = guardianData;
            const urlCompra = g?.permalink || '/tienda/';

            app.innerHTML = `
                <div class="mi-magia-container">
                    <div class="estado-guardian">
                        <div class="guardian-header">
                            <img src="${g?.imagenPrincipal || ''}" alt="${g?.nombre || 'Guardián'}" class="guardian-imagen">
                            <h1 class="guardian-nombre">${g?.nombre || 'Tu Guardián'}</h1>
                            <p class="guardian-subtitulo">${g?.encabezado?.subtitulo || 'Guardián del Bosque Ancestral'}</p>
                        </div>

                        <!-- Contenido borroso -->
                        <div class="contenido-bloqueado">
                            <div class="contenido-borroso">
                                <div class="seccion-magia mensaje-directo">
                                    <h3 class="seccion-titulo">💬 Mensaje Personal</h3>
                                    <div class="seccion-contenido">"Este es un mensaje que solo el verdadero guardián de ${g?.nombre || 'este duende'} puede leer. Contiene guía específica para tu camino actual..."</div>
                                </div>

                                <div class="seccion-magia">
                                    <h3 class="seccion-titulo">📜 Historia del Guardián</h3>
                                    <div class="seccion-contenido">La historia ancestral de este guardián abarca siglos de sabiduría acumulada. Su origen se remonta a tiempos donde la magia fluía libremente entre los mundos...</div>
                                </div>

                                <div class="seccion-magia">
                                    <h3 class="seccion-titulo">🎁 Dones Especiales</h3>
                                    <div class="seccion-contenido">
                                        <div class="don-item" style="margin-bottom:10px;"><span class="don-icono">🌟</span> Don de la protección ancestral</div>
                                        <div class="don-item" style="margin-bottom:10px;"><span class="don-icono">💫</span> Don del equilibrio emocional</div>
                                        <div class="don-item"><span class="don-icono">⭐</span> Don de la claridad mental</div>
                                    </div>
                                </div>
                            </div>

                            <div class="overlay-desbloquear">
                                <div class="desbloquear-icono">🔒</div>
                                <h3 class="desbloquear-titulo">Contenido Exclusivo</h3>
                                <p class="desbloquear-texto">
                                    Esta canalización es exclusiva para quien adoptó a ${g?.nombre || 'este guardián'}.
                                    Si ya lo tenés, verificá tu email para acceder.
                                </p>
                                <a href="${urlCompra}" class="btn-comprar">Adoptar a ${g?.nombre || 'este Guardián'}</a>
                                <button onclick="estado='verificar-email';render();" style="background:transparent;border:1px solid rgba(198,169,98,0.5);color:#C6A962;padding:12px 25px;border-radius:20px;cursor:pointer;font-size:14px;">
                                    Ya lo tengo, verificar email
                                </button>
                            </div>
                        </div>

                        <!-- Botón de recanalización -->
                        <div class="recanalizacion-card" style="margin-top:40px;text-align:center;">
                            <h3 style="font-family:'Cinzel',serif;color:#C6A962;margin-bottom:10px;">¿Ya tenés un duende?</h3>
                            <p style="color:rgba(255,255,255,0.6);margin-bottom:20px;">
                                Solicitá una recanalización actualizada para conectar con tu guardián en tu momento actual.
                            </p>
                            <button onclick="mostrarFormRecanalización()" class="btn-buscar" style="padding:14px 30px;">
                                ✨ Solicitar Recanalización
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Actualizar el render principal
        const originalRender = render;
        render = function() {
            if (estado === 'recanalizacion') {
                renderRecanalizacion();
            } else if (estado === 'vista-previa') {
                renderVistaPrevia();
            } else {
                originalRender();
            }
        };

        window.verVistaPrevia = function() {
            estado = 'vista-previa';
            render();
        };

        // Inicializar
        render();
    })();
    </script>
    <?php
    return ob_get_clean();
});

// Crear pagina automaticamente si no existe
add_action('init', function() {
    $page = get_page_by_path('mi-magia');
    if (!$page) {
        wp_insert_post([
            'post_title' => 'Mi Magia',
            'post_name' => 'mi-magia',
            'post_content' => '[mi_magia]',
            'post_status' => 'publish',
            'post_type' => 'page'
        ]);
    }
});
