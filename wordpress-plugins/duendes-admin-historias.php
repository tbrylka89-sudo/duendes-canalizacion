<?php
/**
 * Plugin Name: Duendes Admin Historias IA
 * Description: Admin para generar historias de guardianes con IA - Sistema inteligente
 * Version: 3.0
 */

if (!defined('ABSPATH')) exit;

add_action('admin_menu', function() {
    add_menu_page('Duendes del Uruguay', 'Duendes', 'manage_woocommerce', 'duendes-admin', 'duendes_admin_page', 'dashicons-star-filled', 56);
    add_submenu_page('duendes-admin', 'Historias IA', 'Historias IA', 'manage_woocommerce', 'duendes-historias', 'duendes_historias_page');
});

function duendes_admin_page() {
    ?>
    <div style="padding:20px;max-width:1200px;">
        <h1 style="color:#C6A962;font-size:32px;">Duendes del Uruguay</h1>
        <p style="font-size:16px;color:#666;">Panel de administracion magico</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;margin-top:30px;">
            <div style="background:#fff;border-radius:12px;padding:25px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin:0 0 10px 0;">Historias con IA</h3>
                <p style="color:#666;">Genera historias magicas para tus guardianes.</p>
                <a href="?page=duendes-historias" style="display:inline-block;background:#C6A962;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:10px;">Ir a Historias</a>
            </div>
            <div style="background:#fff;border-radius:12px;padding:25px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin:0 0 10px 0;">Productos</h3>
                <p style="color:#666;">Administra tus guardianes en WooCommerce.</p>
                <a href="edit.php?post_type=product" style="display:inline-block;background:#0073aa;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:10px;">Ver Productos</a>
            </div>
        </div>
    </div>
    <?php
}

function duendes_historias_page() {
    $products = wc_get_products(['post_type' => 'product', 'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'title', 'order' => 'ASC']);

    // Contar estadísticas
    $total = count($products);
    $con_historia = 0;
    $sin_historia = 0;
    foreach ($products as $p) {
        if (get_post_meta($p->get_id(), '_guardian_historia', true) || get_post_meta($p->get_id(), '_duendes_historia', true)) {
            $con_historia++;
        } else {
            $sin_historia++;
        }
    }
    ?>
    <div style="padding:20px;max-width:1500px;background:#0d1117;min-height:100vh;margin-left:-20px;padding-left:40px;">
        <!-- Header con estadísticas -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px;flex-wrap:wrap;gap:20px;">
            <div>
                <h1 style="color:#C6A962;font-size:28px;margin:0;">Historias con IA</h1>
                <p style="color:#888;margin:5px 0 0 0;">Sistema inteligente de generacion de contenido</p>
            </div>
            <div style="display:flex;gap:15px;align-items:center;">
                <!-- Stats -->
                <div style="display:flex;gap:20px;background:#161b22;padding:15px 25px;border-radius:10px;border:1px solid #30363d;">
                    <div style="text-align:center;">
                        <div style="font-size:24px;color:#fff;font-weight:bold;"><?php echo $total; ?></div>
                        <div style="font-size:11px;color:#666;text-transform:uppercase;">Total</div>
                    </div>
                    <div style="width:1px;background:#30363d;"></div>
                    <div style="text-align:center;">
                        <div style="font-size:24px;color:#22c55e;font-weight:bold;"><?php echo $con_historia; ?></div>
                        <div style="font-size:11px;color:#666;text-transform:uppercase;">Generadas</div>
                    </div>
                    <div style="width:1px;background:#30363d;"></div>
                    <div style="text-align:center;">
                        <div style="font-size:24px;color:#f59e0b;font-weight:bold;"><?php echo $sin_historia; ?></div>
                        <div style="font-size:11px;color:#666;text-transform:uppercase;">Pendientes</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Botones de acción -->
        <div style="display:flex;gap:12px;margin-bottom:25px;flex-wrap:wrap;">
            <button onclick="generarPendientes()" style="background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;border:none;padding:14px 28px;border-radius:8px;font-weight:600;cursor:pointer;font-size:14px;" <?php echo $sin_historia == 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;background:#333;"' : ''; ?>>
                Generar <?php echo $sin_historia; ?> Pendientes
            </button>
            <button onclick="regenerarTodas()" style="background:#21262d;color:#888;border:1px solid #30363d;padding:14px 28px;border-radius:8px;font-weight:500;cursor:pointer;font-size:14px;">
                Regenerar Todas
            </button>
            <div style="flex:1;"></div>
            <select id="filtro-estado" onchange="filtrarTabla()" style="background:#21262d;color:#fff;border:1px solid #30363d;padding:12px 20px;border-radius:8px;font-size:14px;">
                <option value="todas">Mostrar todas</option>
                <option value="pendientes">Solo pendientes</option>
                <option value="generadas">Solo generadas</option>
            </select>
        </div>

        <!-- Progress bar -->
        <div id="dh-progress" style="display:none;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span id="dh-status" style="color:#C6A962;font-size:14px;">Procesando...</span>
                <span id="dh-counter" style="color:#666;font-size:14px;">0/0</span>
            </div>
            <div style="background:#21262d;border-radius:8px;height:8px;overflow:hidden;">
                <div id="dh-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#C6A962,#22c55e);transition:width 0.3s;"></div>
            </div>
            <p id="dh-current" style="color:#666;font-size:13px;margin-top:8px;"></p>
        </div>

        <!-- Tabla -->
        <div style="background:#161b22;border-radius:12px;overflow:hidden;border:1px solid #30363d;">
            <table style="width:100%;border-collapse:collapse;" id="tabla-productos">
                <thead>
                    <tr style="border-bottom:1px solid #30363d;background:#0d1117;">
                        <th style="padding:15px;text-align:left;color:#C6A962;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Producto</th>
                        <th style="padding:15px;text-align:left;color:#C6A962;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Categoria</th>
                        <th style="padding:15px;text-align:center;color:#C6A962;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Estado</th>
                        <th style="padding:15px;text-align:right;color:#C6A962;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Accion</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $producto):
                        $pid = $producto->get_id();
                        $tiene_historia = get_post_meta($pid, '_guardian_historia', true) || get_post_meta($pid, '_duendes_historia', true);
                        $fecha_generado = get_post_meta($pid, '_historia_fecha', true);
                        $cats = wp_get_post_terms($pid, 'product_cat', ['fields' => 'names']);
                        $img_url = $producto->get_image_id() ? wp_get_attachment_image_url($producto->get_image_id(), 'thumbnail') : '';
                    ?>
                    <tr style="border-bottom:1px solid #21262d;" data-id="<?php echo $pid; ?>" data-estado="<?php echo $tiene_historia ? 'generada' : 'pendiente'; ?>">
                        <td style="padding:15px;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <?php if ($img_url): ?>
                                <img src="<?php echo esc_url($img_url); ?>" style="width:50px;height:50px;border-radius:10px;object-fit:cover;border:2px solid <?php echo $tiene_historia ? '#22c55e' : '#30363d'; ?>;">
                                <?php else: ?>
                                <div style="width:50px;height:50px;border-radius:10px;background:#21262d;border:2px solid #30363d;"></div>
                                <?php endif; ?>
                                <div>
                                    <span style="color:#fff;font-size:15px;display:block;"><?php echo esc_html($producto->get_name()); ?></span>
                                    <span style="color:#666;font-size:12px;">ID: <?php echo $pid; ?></span>
                                </div>
                            </div>
                        </td>
                        <td style="padding:15px;color:#888;font-size:14px;"><?php echo esc_html(implode(', ', $cats)); ?></td>
                        <td style="padding:15px;text-align:center;">
                            <?php if ($tiene_historia): ?>
                            <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(34,197,94,0.1);padding:6px 12px;border-radius:20px;">
                                <span style="color:#22c55e;font-size:14px;">&#10003;</span>
                                <span style="color:#22c55e;font-size:12px;">Generada</span>
                            </div>
                            <?php if ($fecha_generado): ?>
                            <div style="color:#666;font-size:10px;margin-top:4px;"><?php echo date('d/m/Y', strtotime($fecha_generado)); ?></div>
                            <?php endif; ?>
                            <?php else: ?>
                            <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,158,11,0.1);padding:6px 12px;border-radius:20px;">
                                <span style="color:#f59e0b;font-size:14px;">&#9675;</span>
                                <span style="color:#f59e0b;font-size:12px;">Pendiente</span>
                            </div>
                            <?php endif; ?>
                        </td>
                        <td style="padding:15px;text-align:right;">
                            <?php if ($tiene_historia): ?>
                            <button onclick="abrirFormulario(<?php echo $pid; ?>, '<?php echo esc_js($producto->get_name()); ?>', true)"
                                style="background:#21262d;color:#888;border:1px solid #30363d;padding:10px 18px;border-radius:8px;cursor:pointer;font-size:13px;transition:all 0.2s;"
                                onmouseover="this.style.borderColor='#666';this.style.color='#fff'"
                                onmouseout="this.style.borderColor='#30363d';this.style.color='#888'">
                                Regenerar
                            </button>
                            <?php else: ?>
                            <button onclick="abrirFormulario(<?php echo $pid; ?>, '<?php echo esc_js($producto->get_name()); ?>', false)"
                                style="background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;transition:all 0.2s;"
                                onmouseover="this.style.transform='translateY(-1px)'"
                                onmouseout="this.style.transform='translateY(0)'">
                                Generar
                            </button>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal Formulario -->
    <div id="modal-form" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;overflow-y:auto;">
        <div style="max-width:600px;margin:40px auto;background:#161b22;border-radius:16px;border:1px solid #30363d;overflow:hidden;">
            <div style="padding:25px;border-bottom:1px solid #30363d;display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <h2 id="modal-title" style="color:#C6A962;margin:0;font-size:20px;">Generar Historia</h2>
                    <p id="modal-subtitle" style="color:#666;margin:5px 0 0 0;font-size:13px;">Completa los datos basicos</p>
                </div>
                <button onclick="cerrarModal()" style="background:#21262d;border:1px solid #30363d;color:#666;width:36px;height:36px;border-radius:8px;cursor:pointer;font-size:20px;line-height:1;">&times;</button>
            </div>
            <form id="form-guardian" style="padding:25px;">
                <input type="hidden" id="f-productId" value="">
                <input type="hidden" id="f-isRegenerar" value="false">

                <!-- Fila 1: Tipo y Género -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;">
                    <div>
                        <label style="display:block;color:#888;font-size:11px;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Tipo de Ser *</label>
                        <select id="f-tipo" style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;font-size:14px;">
                            <optgroup label="Seres del Bosque">
                                <option value="Duende">Duende</option>
                                <option value="Elfo">Elfo</option>
                                <option value="Hada">Hada</option>
                                <option value="Gnomo">Gnomo</option>
                                <option value="Ninfa">Ninfa</option>
                                <option value="Trasgo">Trasgo</option>
                                <option value="Driade">Driade</option>
                            </optgroup>
                            <optgroup label="Practicantes de Magia">
                                <option value="Bruja">Bruja</option>
                                <option value="Brujo">Brujo</option>
                                <option value="Mago">Mago</option>
                                <option value="Hechicero">Hechicero</option>
                                <option value="Hechicera">Hechicera</option>
                                <option value="Archimago">Archimago</option>
                            </optgroup>
                            <optgroup label="Misticos y Videntes">
                                <option value="Oraculo">Oraculo</option>
                                <option value="Vidente">Vidente</option>
                                <option value="Chaman">Chaman</option>
                                <option value="Druida">Druida</option>
                                <option value="Alquimista">Alquimista</option>
                            </optgroup>
                            <optgroup label="Espiritus y Guardianes">
                                <option value="Espiritu">Espiritu</option>
                                <option value="Guardian">Guardian</option>
                                <option value="Protector">Protector</option>
                                <option value="Sanador">Sanador</option>
                            </optgroup>
                        </select>
                    </div>
                    <div>
                        <label style="display:block;color:#888;font-size:11px;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Genero</label>
                        <select id="f-genero" style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;font-size:14px;">
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="neutro">Neutro</option>
                        </select>
                    </div>
                </div>

                <!-- Fila 2: Altura y Ojos -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;">
                    <div>
                        <label style="display:block;color:#888;font-size:11px;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Altura (cm)</label>
                        <input type="number" id="f-altura" value="25" min="5" max="100" style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;font-size:14px;box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block;color:#888;font-size:11px;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Color de Ojos</label>
                        <input type="text" id="f-ojos" placeholder="ej: verdes brillantes, ambar..." style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;font-size:14px;box-sizing:border-box;">
                    </div>
                </div>

                <!-- Accesorios -->
                <div style="margin-bottom:20px;">
                    <label style="display:block;color:#888;font-size:11px;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Accesorios / Detalles Fisicos</label>
                    <input type="text" id="f-accesorios" placeholder="ej: sombrero puntiagudo, baston de cristal, capa azul, barba larga..." style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;font-size:14px;box-sizing:border-box;">
                </div>

                <!-- Fila 3: Elemento y Propósito -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;">
                    <div>
                        <label style="display:block;color:#888;font-size:11px;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Elemento</label>
                        <select id="f-elemento" style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;font-size:14px;">
                            <option value="Cualquiera">Claude decide</option>
                            <option value="Tierra">Tierra</option>
                            <option value="Agua">Agua</option>
                            <option value="Fuego">Fuego</option>
                            <option value="Aire">Aire</option>
                            <option value="Eter">Eter</option>
                            <option value="Luz">Luz</option>
                            <option value="Sombra">Sombra</option>
                            <option value="Cristal">Cristal</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block;color:#888;font-size:11px;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Proposito / Categoria</label>
                        <select id="f-proposito" style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;font-size:14px;">
                            <option value="Que Claude decida">Claude decide</option>
                            <optgroup label="Categorias principales">
                                <option value="Proteccion">Proteccion</option>
                                <option value="Amor">Amor</option>
                                <option value="Abundancia">Abundancia / Dinero</option>
                                <option value="Sanacion">Sanacion / Salud</option>
                                <option value="Sabiduria">Sabiduria / Guia</option>
                            </optgroup>
                            <optgroup label="Otros propositos">
                                <option value="Guia Espiritual">Guia Espiritual</option>
                                <option value="Armonia del Hogar">Armonia del Hogar</option>
                                <option value="Creatividad">Creatividad</option>
                                <option value="Transformacion">Transformacion</option>
                                <option value="Suerte y Fortuna">Suerte y Fortuna</option>
                                <option value="Claridad Mental">Claridad Mental</option>
                                <option value="Equilibrio Emocional">Equilibrio Emocional</option>
                            </optgroup>
                        </select>
                    </div>
                </div>

                <!-- Notas -->
                <div style="margin-bottom:25px;">
                    <label style="display:block;color:#888;font-size:11px;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Notas adicionales (opcional)</label>
                    <textarea id="f-notas" rows="2" placeholder="Cualquier detalle extra que quieras que Claude considere..." style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;font-size:14px;resize:vertical;box-sizing:border-box;"></textarea>
                </div>

                <div id="form-status" style="color:#C6A962;margin-bottom:15px;text-align:center;min-height:20px;"></div>

                <button type="submit" id="btn-generar" style="width:100%;padding:16px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#0a0a0a;border:none;border-radius:8px;font-weight:600;font-size:15px;cursor:pointer;transition:all 0.2s;">
                    Generar Historia con Claude
                </button>
            </form>
        </div>
    </div>

    <script>
    let currentProductId = null;
    let currentProductName = '';

    function abrirFormulario(id, nombre, isRegenerar) {
        currentProductId = id;
        currentProductName = nombre;
        document.getElementById('modal-title').textContent = (isRegenerar ? 'Regenerar' : 'Generar') + ' Historia';
        document.getElementById('modal-subtitle').textContent = nombre;
        document.getElementById('f-productId').value = id;
        document.getElementById('f-isRegenerar').value = isRegenerar;
        document.getElementById('form-status').textContent = '';
        document.getElementById('btn-generar').textContent = (isRegenerar ? 'Regenerar' : 'Generar') + ' Historia con Claude';
        document.getElementById('modal-form').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function cerrarModal() {
        document.getElementById('modal-form').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function filtrarTabla() {
        const filtro = document.getElementById('filtro-estado').value;
        const filas = document.querySelectorAll('#tabla-productos tbody tr');
        filas.forEach(fila => {
            const estado = fila.dataset.estado;
            if (filtro === 'todas') {
                fila.style.display = '';
            } else if (filtro === 'pendientes' && estado === 'pendiente') {
                fila.style.display = '';
            } else if (filtro === 'generadas' && estado === 'generada') {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        });
    }

    document.getElementById('form-guardian').addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = document.getElementById('btn-generar');
        const status = document.getElementById('form-status');
        const isRegenerar = document.getElementById('f-isRegenerar').value === 'true';

        btn.disabled = true;
        btn.textContent = 'Generando con Claude...';
        status.textContent = 'Esto puede tomar 30-60 segundos...';
        status.style.color = '#C6A962';

        const datos = {
            nombre: currentProductName,
            tipo: document.getElementById('f-tipo').value,
            genero: document.getElementById('f-genero').value,
            altura: document.getElementById('f-altura').value,
            colorOjos: document.getElementById('f-ojos').value || 'no especificado',
            accesorios: document.getElementById('f-accesorios').value || 'ninguno',
            elemento: document.getElementById('f-elemento').value,
            proposito: document.getElementById('f-proposito').value,
            notas: document.getElementById('f-notas').value,
            productId: 'woo_' + currentProductId
        };

        try {
            const res = await fetch('https://duendes-vercel.vercel.app/api/admin/productos/generar-historia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const data = await res.json();

            if (data.success) {
                status.textContent = 'Historia ' + (isRegenerar ? 'regenerada' : 'generada') + '! Categoria: ' + (data.clasificacion?.categoria || 'asignada');
                status.style.color = '#22c55e';
                btn.textContent = 'Completado!';
                btn.style.background = '#22c55e';

                // Actualizar la fila en la tabla
                const row = document.querySelector('tr[data-id="' + currentProductId + '"]');
                if (row) {
                    row.dataset.estado = 'generada';
                    const estadoCell = row.querySelector('td:nth-child(3)');
                    estadoCell.innerHTML = '<div style="display:inline-flex;align-items:center;gap:6px;background:rgba(34,197,94,0.1);padding:6px 12px;border-radius:20px;"><span style="color:#22c55e;font-size:14px;">&#10003;</span><span style="color:#22c55e;font-size:12px;">Generada</span></div><div style="color:#666;font-size:10px;margin-top:4px;">Ahora</div>';

                    const btnCell = row.querySelector('td:nth-child(4)');
                    btnCell.innerHTML = '<button onclick="abrirFormulario(' + currentProductId + ', \'' + currentProductName.replace(/'/g, "\\'") + '\', true)" style="background:#21262d;color:#888;border:1px solid #30363d;padding:10px 18px;border-radius:8px;cursor:pointer;font-size:13px;">Regenerar</button>';

                    // Actualizar borde de imagen
                    const img = row.querySelector('img');
                    if (img) img.style.borderColor = '#22c55e';
                }

                setTimeout(() => {
                    cerrarModal();
                    btn.disabled = false;
                    btn.textContent = 'Generar Historia con Claude';
                    btn.style.background = 'linear-gradient(135deg,#C6A962,#a88a42)';
                    location.reload(); // Recargar para actualizar stats
                }, 1500);
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (e) {
            status.textContent = 'Error: ' + e.message;
            status.style.color = '#ef4444';
            btn.disabled = false;
            btn.textContent = 'Reintentar';
            btn.style.background = 'linear-gradient(135deg,#C6A962,#a88a42)';
        }
    });

    async function generarPendientes() {
        const pendientes = Array.from(document.querySelectorAll('tr[data-estado="pendiente"]'));
        if (pendientes.length === 0) {
            alert('No hay productos pendientes');
            return;
        }

        if (!confirm('Generar ' + pendientes.length + ' historias pendientes?\\n\\nClaude decidira tipo, elemento y proposito basandose en el nombre.\\n\\nEsto tomara aproximadamente ' + Math.ceil(pendientes.length * 45 / 60) + ' minutos.')) {
            return;
        }

        await procesarLote(pendientes, false);
    }

    async function regenerarTodas() {
        const todas = Array.from(document.querySelectorAll('#tabla-productos tbody tr'));
        if (!confirm('ATENCION: Vas a regenerar ' + todas.length + ' historias.\\n\\nEsto sobreescribira las historias existentes.\\n\\nEsta seguro?')) {
            return;
        }
        if (!confirm('SEGUNDA CONFIRMACION:\\n\\nRealmente queres regenerar TODAS las ' + todas.length + ' historias?')) {
            return;
        }

        await procesarLote(todas, true);
    }

    async function procesarLote(filas, isRegenerar) {
        const progress = document.getElementById('dh-progress');
        const status = document.getElementById('dh-status');
        const counter = document.getElementById('dh-counter');
        const bar = document.getElementById('dh-bar');
        const current = document.getElementById('dh-current');

        progress.style.display = 'block';
        status.textContent = isRegenerar ? 'Regenerando historias...' : 'Generando historias pendientes...';

        const tipos = ['Duende', 'Elfo', 'Hada', 'Bruja', 'Mago', 'Guardian', 'Gnomo', 'Druida', 'Sanador'];
        let completadas = 0;
        let errores = 0;

        for (let i = 0; i < filas.length; i++) {
            const fila = filas[i];
            const id = fila.dataset.id;
            const nombre = fila.querySelector('td:first-child span').textContent;

            counter.textContent = (i + 1) + '/' + filas.length;
            bar.style.width = ((i + 1) / filas.length * 100) + '%';
            current.textContent = 'Procesando: ' + nombre;

            try {
                const res = await fetch('https://duendes-vercel.vercel.app/api/admin/productos/generar-historia', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: nombre,
                        tipo: tipos[i % tipos.length],
                        genero: 'masculino',
                        altura: '25',
                        colorOjos: 'no especificado',
                        accesorios: 'ninguno',
                        elemento: 'Cualquiera',
                        proposito: 'Que Claude decida',
                        productId: 'woo_' + id
                    })
                });

                const data = await res.json();
                if (data.success) {
                    completadas++;
                    fila.dataset.estado = 'generada';
                    const estadoCell = fila.querySelector('td:nth-child(3)');
                    estadoCell.innerHTML = '<div style="display:inline-flex;align-items:center;gap:6px;background:rgba(34,197,94,0.1);padding:6px 12px;border-radius:20px;"><span style="color:#22c55e;">&#10003;</span><span style="color:#22c55e;font-size:12px;">Generada</span></div>';
                } else {
                    errores++;
                }
            } catch (e) {
                errores++;
                console.error('Error con ' + nombre + ':', e);
            }

            // Esperar entre requests
            if (i < filas.length - 1) {
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        status.textContent = 'Completado! ' + completadas + ' generadas' + (errores > 0 ? ', ' + errores + ' errores' : '');
        status.style.color = '#22c55e';
        current.textContent = '';

        setTimeout(() => location.reload(), 2000);
    }

    // Cerrar modal con Escape
    document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });
    // Cerrar modal clickeando afuera
    document.getElementById('modal-form').addEventListener('click', e => { if (e.target.id === 'modal-form') cerrarModal(); });
    </script>
    <?php
}
