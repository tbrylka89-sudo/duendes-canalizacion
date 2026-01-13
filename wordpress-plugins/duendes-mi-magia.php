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

            app.innerHTML = `
                <div class="mi-magia-container">
                    <div class="estado-guardian">
                        <div class="guardian-header">
                            <div style="background:linear-gradient(135deg,#C6A962,#8B7355);color:#000;padding:8px 20px;border-radius:20px;font-size:12px;letter-spacing:2px;margin-bottom:20px;display:inline-block;">
                                ✨ CANALIZACIÓN EXCLUSIVA PARA VOS ✨
                            </div>
                            <img src="${g.imagenPrincipal || ''}" alt="${g.nombre}" class="guardian-imagen">
                            <h1 class="guardian-nombre">${g.nombre}</h1>
                            <p class="guardian-subtitulo">Tu guardián personal</p>
                        </div>

                        <div class="seccion-magia mensaje-directo" style="border:2px solid #C6A962;">
                            <h3 class="seccion-titulo">
                                <span class="seccion-titulo-icono">🔮</span>
                                Tu Canalización Personal
                            </h3>
                            <div class="seccion-contenido" style="white-space:pre-line;text-align:left;font-size:16px;line-height:1.9;">
                                ${c.contenido || 'Tu canalización está siendo preparada. Volvé a intentar en unas horas.'}
                            </div>
                            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:20px;">
                                Generada el ${c.fecha ? new Date(c.fecha).toLocaleDateString('es-UY', {day:'numeric',month:'long',year:'numeric'}) : 'fecha no disponible'}
                            </p>
                        </div>

                        <button onclick="verInfoGeneral()" class="btn-buscar" style="margin-top:20px;background:transparent;border:2px solid #C6A962;color:#C6A962;">
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

                const res = await fetch(`${API_URL}/${productId}`);
                const data = await res.json();

                if (data.success && data.nombre) {
                    guardianData = data;
                    // Ir al paso de verificación de email
                    estado = 'verificar-email';
                } else {
                    throw new Error('No encontrado');
                }
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
