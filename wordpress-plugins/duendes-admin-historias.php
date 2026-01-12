<?php
/**
 * Plugin Name: Duendes Admin Historias IA
 * Description: Admin para generar historias de guardianes con IA - Formulario simplificado
 * Version: 2.0
 */

if (!defined('ABSPATH')) exit;

// Agregar menu en el admin de WordPress
add_action('admin_menu', function() {
    add_menu_page(
        'Duendes del Uruguay',
        'Duendes',
        'manage_woocommerce',
        'duendes-admin',
        'duendes_admin_page',
        'dashicons-star-filled',
        56
    );

    add_submenu_page(
        'duendes-admin',
        'Historias IA',
        'Historias IA',
        'manage_woocommerce',
        'duendes-historias',
        'duendes_historias_page'
    );
});

function duendes_admin_page() {
    ?>
    <div style="padding:20px;max-width:1200px;">
        <h1 style="color:#C6A962;font-size:32px;">Duendes del Uruguay</h1>
        <p style="font-size:16px;color:#666;">Panel de administracion magico</p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;margin-top:30px;">
            <div style="background:#fff;border-radius:12px;padding:25px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin:0 0 10px 0;">Historias con IA</h3>
                <p style="color:#666;">Genera historias magicas para tus guardianes usando inteligencia artificial.</p>
                <a href="?page=duendes-historias" style="display:inline-block;background:#C6A962;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:10px;">Ir a Historias</a>
            </div>

            <div style="background:#fff;border-radius:12px;padding:25px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin:0 0 10px 0;">Productos</h3>
                <p style="color:#666;">Administra tus guardianes en WooCommerce.</p>
                <a href="edit.php?post_type=product" style="display:inline-block;background:#0073aa;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:10px;">Ver Productos</a>
            </div>

            <div style="background:#fff;border-radius:12px;padding:25px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin:0 0 10px 0;">Circulo de las Elegidas</h3>
                <p style="color:#666;">Gestiona las membresías del círculo.</p>
                <a href="edit.php?post_type=wc_membership" style="display:inline-block;background:#9b59b6;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:10px;">Ver Membresías</a>
            </div>
        </div>
    </div>
    <?php
}

function duendes_historias_page() {
    // Obtener todos los productos
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'title',
        'order' => 'ASC'
    );
    $products = wc_get_products($args);
    ?>
    <div style="padding:20px;max-width:1400px;background:#0d1117;min-height:100vh;margin-left:-20px;padding-left:40px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;">
            <div>
                <h1 style="color:#C6A962;font-size:28px;margin:0;">Historias con IA</h1>
                <p style="color:#888;margin:5px 0 0 0;">Genera contenido magico para cada guardian - Formulario simplificado</p>
            </div>
            <button onclick="generarTodas()" style="background:linear-gradient(135deg,#C6A962,#a88a42);color:#0a0a0a;border:none;padding:14px 28px;border-radius:8px;font-weight:600;cursor:pointer;font-size:14px;">
                Generar Todas
            </button>
        </div>

        <div id="dh-status" style="color:#C6A962;margin-bottom:15px;"></div>

        <div id="dh-progress" style="display:none;margin-bottom:20px;">
            <div style="background:#21262d;border-radius:8px;height:10px;overflow:hidden;">
                <div id="dh-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#C6A962,#06b6d4);transition:width 0.3s;"></div>
            </div>
            <p id="dh-current" style="color:#888;font-size:13px;margin-top:10px;"></p>
        </div>

        <div style="background:#161b22;border-radius:12px;overflow:hidden;">
            <table style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr style="border-bottom:1px solid #30363d;">
                        <th style="padding:15px;text-align:left;color:#C6A962;font-size:13px;text-transform:uppercase;">Producto</th>
                        <th style="padding:15px;text-align:left;color:#C6A962;font-size:13px;text-transform:uppercase;">Categoria</th>
                        <th style="padding:15px;text-align:center;color:#C6A962;font-size:13px;text-transform:uppercase;">Historia</th>
                        <th style="padding:15px;text-align:right;color:#C6A962;font-size:13px;text-transform:uppercase;">Accion</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $producto): ?>
                    <?php
                        $tiene_historia = get_post_meta($producto->get_id(), '_guardian_historia', true);
                        $cats = wp_get_post_terms($producto->get_id(), 'product_cat', array('fields' => 'names'));
                        $img_url = $producto->get_image_id() ? wp_get_attachment_image_url($producto->get_image_id(), 'thumbnail') : '';
                    ?>
                    <tr style="border-bottom:1px solid #21262d;" data-id="<?php echo $producto->get_id(); ?>" data-img="<?php echo esc_attr($img_url); ?>">
                        <td style="padding:15px;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <?php if ($producto->get_image_id()): ?>
                                <img src="<?php echo $img_url; ?>" style="width:45px;height:45px;border-radius:10px;object-fit:cover;">
                                <?php else: ?>
                                <div style="width:45px;height:45px;border-radius:10px;background:#21262d;"></div>
                                <?php endif; ?>
                                <span style="color:#fff;font-size:15px;"><?php echo $producto->get_name(); ?></span>
                            </div>
                        </td>
                        <td style="padding:15px;color:#888;"><?php echo implode(', ', $cats); ?></td>
                        <td style="padding:15px;text-align:center;">
                            <?php if ($tiene_historia): ?>
                            <span style="color:#22c55e;font-size:18px;">OK</span>
                            <?php else: ?>
                            <span style="color:#666;">-</span>
                            <?php endif; ?>
                        </td>
                        <td style="padding:15px;text-align:right;">
                            <button onclick="abrirFormulario(<?php echo $producto->get_id(); ?>, '<?php echo esc_js($producto->get_name()); ?>')"
                                style="background:#21262d;color:#C6A962;border:1px solid #30363d;padding:10px 18px;border-radius:8px;cursor:pointer;font-size:13px;transition:all 0.2s;"
                                onmouseover="this.style.borderColor='#C6A962'"
                                onmouseout="this.style.borderColor='#30363d'">
                                Generar
                            </button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal Formulario Simplificado -->
    <div id="modal-form" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;overflow-y:auto;">
        <div style="max-width:600px;margin:50px auto;background:#161b22;border-radius:16px;border:1px solid #30363d;overflow:hidden;">
            <div style="padding:25px;border-bottom:1px solid #30363d;display:flex;justify-content:space-between;align-items:center;">
                <h2 id="modal-title" style="color:#C6A962;margin:0;font-size:20px;">Generar Historia</h2>
                <button onclick="cerrarModal()" style="background:none;border:none;color:#666;font-size:24px;cursor:pointer;">&times;</button>
            </div>
            <form id="form-guardian" style="padding:25px;">
                <input type="hidden" id="f-productId" value="">

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;">
                    <div>
                        <label style="display:block;color:#888;font-size:12px;margin-bottom:5px;text-transform:uppercase;">Tipo de Ser</label>
                        <select id="f-tipo" style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;">
                            <option value="Duende">Duende</option>
                            <option value="Elfo">Elfo</option>
                            <option value="Hada">Hada</option>
                            <option value="Gnomo">Gnomo</option>
                            <option value="Ninfa">Ninfa</option>
                            <option value="Trasgo">Trasgo</option>
                            <option value="Driade">Driade</option>
                            <option value="Bruja">Bruja</option>
                            <option value="Brujo">Brujo</option>
                            <option value="Mago">Mago</option>
                            <option value="Hechicero">Hechicero</option>
                            <option value="Hechicera">Hechicera</option>
                            <option value="Archimago">Archimago</option>
                            <option value="Oraculo">Oraculo</option>
                            <option value="Vidente">Vidente</option>
                            <option value="Chaman">Chaman</option>
                            <option value="Druida">Druida</option>
                            <option value="Alquimista">Alquimista</option>
                            <option value="Espiritu">Espiritu</option>
                            <option value="Guardian">Guardian</option>
                            <option value="Protector">Protector</option>
                            <option value="Sanador">Sanador</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block;color:#888;font-size:12px;margin-bottom:5px;text-transform:uppercase;">Genero</label>
                        <select id="f-genero" style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;">
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="neutro">Neutro/Indefinido</option>
                        </select>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;">
                    <div>
                        <label style="display:block;color:#888;font-size:12px;margin-bottom:5px;text-transform:uppercase;">Altura (cm)</label>
                        <input type="number" id="f-altura" value="25" style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block;color:#888;font-size:12px;margin-bottom:5px;text-transform:uppercase;">Color de Ojos</label>
                        <input type="text" id="f-ojos" placeholder="ej: verdes brillantes" style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;box-sizing:border-box;">
                    </div>
                </div>

                <div style="margin-bottom:20px;">
                    <label style="display:block;color:#888;font-size:12px;margin-bottom:5px;text-transform:uppercase;">Accesorios / Detalles fisicos</label>
                    <input type="text" id="f-accesorios" placeholder="ej: sombrero puntiagudo, baston de cristal, capa azul" style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;box-sizing:border-box;">
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;">
                    <div>
                        <label style="display:block;color:#888;font-size:12px;margin-bottom:5px;text-transform:uppercase;">Elemento (opcional)</label>
                        <select id="f-elemento" style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;">
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
                        <label style="display:block;color:#888;font-size:12px;margin-bottom:5px;text-transform:uppercase;">Proposito (opcional)</label>
                        <select id="f-proposito" style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;">
                            <option value="Que Claude decida">Claude decide</option>
                            <option value="Proteccion">Proteccion</option>
                            <option value="Amor">Amor</option>
                            <option value="Abundancia">Abundancia</option>
                            <option value="Sanacion">Sanacion</option>
                            <option value="Sabiduria">Sabiduria</option>
                            <option value="Guia Espiritual">Guia Espiritual</option>
                            <option value="Armonia del Hogar">Armonia del Hogar</option>
                            <option value="Creatividad">Creatividad</option>
                            <option value="Transformacion">Transformacion</option>
                            <option value="Suerte y Fortuna">Suerte y Fortuna</option>
                            <option value="Claridad Mental">Claridad Mental</option>
                            <option value="Equilibrio Emocional">Equilibrio Emocional</option>
                        </select>
                    </div>
                </div>

                <div style="margin-bottom:20px;">
                    <label style="display:block;color:#888;font-size:12px;margin-bottom:5px;text-transform:uppercase;">Notas adicionales (opcional)</label>
                    <textarea id="f-notas" rows="2" placeholder="Cualquier detalle extra que quieras mencionar..." style="width:100%;padding:12px;background:#21262d;border:1px solid #30363d;border-radius:8px;color:#fff;resize:vertical;box-sizing:border-box;"></textarea>
                </div>

                <div id="form-status" style="color:#C6A962;margin-bottom:15px;text-align:center;"></div>

                <button type="submit" id="btn-generar" style="width:100%;padding:16px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#0a0a0a;border:none;border-radius:8px;font-weight:600;font-size:15px;cursor:pointer;">
                    Generar Historia con Claude
                </button>
            </form>
        </div>
    </div>

    <script>
    let currentProductId = null;
    let currentProductName = '';

    function abrirFormulario(id, nombre) {
        currentProductId = id;
        currentProductName = nombre;
        document.getElementById('modal-title').textContent = 'Generar Historia: ' + nombre;
        document.getElementById('f-productId').value = id;
        document.getElementById('form-status').textContent = '';
        document.getElementById('modal-form').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function cerrarModal() {
        document.getElementById('modal-form').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    document.getElementById('form-guardian').addEventListener('submit', async function(e) {
        e.preventDefault();

        const btn = document.getElementById('btn-generar');
        const status = document.getElementById('form-status');

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
                status.textContent = 'Historia generada! Categoria: ' + (data.clasificacion?.categoria || 'asignada');
                status.style.color = '#22c55e';
                btn.textContent = 'Completado!';
                btn.style.background = '#22c55e';

                // Actualizar la tabla
                const row = document.querySelector('tr[data-id="' + currentProductId + '"]');
                if (row) {
                    const checkCell = row.querySelector('td:nth-child(3) span');
                    checkCell.textContent = 'OK';
                    checkCell.style.color = '#22c55e';
                }

                setTimeout(() => {
                    cerrarModal();
                    btn.disabled = false;
                    btn.textContent = 'Generar Historia con Claude';
                    btn.style.background = 'linear-gradient(135deg,#C6A962,#a88a42)';
                }, 2000);
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (e) {
            status.textContent = 'Error: ' + e.message;
            status.style.color = '#ef4444';
            btn.disabled = false;
            btn.textContent = 'Reintentar';
        }
    });

    async function generarTodas() {
        const rows = document.querySelectorAll('tbody tr');
        const sinHistoria = Array.from(rows).filter(r => {
            const check = r.querySelector('td:nth-child(3) span');
            return check && check.textContent.trim() === '-';
        });

        if (sinHistoria.length === 0) {
            document.getElementById('dh-status').textContent = 'Todos los productos ya tienen historia';
            return;
        }

        if (!confirm('Generar ' + sinHistoria.length + ' historias automaticamente?\n\nClaude decidira el tipo, elemento y proposito basandose en el nombre.\n\nEsto puede tomar varios minutos.')) {
            return;
        }

        document.getElementById('dh-progress').style.display = 'block';
        document.getElementById('dh-status').textContent = 'Generando ' + sinHistoria.length + ' historias...';

        const tipos = ['Duende', 'Elfo', 'Hada', 'Bruja', 'Mago', 'Guardian', 'Gnomo'];

        for (let i = 0; i < sinHistoria.length; i++) {
            const row = sinHistoria[i];
            const id = row.dataset.id;
            const nombre = row.querySelector('td:first-child span').textContent;

            document.getElementById('dh-bar').style.width = ((i + 1) / sinHistoria.length * 100) + '%';
            document.getElementById('dh-current').textContent = 'Procesando: ' + nombre + ' (' + (i + 1) + '/' + sinHistoria.length + ')';

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
                    const checkCell = row.querySelector('td:nth-child(3) span');
                    checkCell.textContent = 'OK';
                    checkCell.style.color = '#22c55e';
                }
            } catch (e) {
                console.error('Error con ' + nombre + ':', e);
            }

            // Esperar 5 segundos entre requests
            if (i < sinHistoria.length - 1) {
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        document.getElementById('dh-status').textContent = 'Completado! Se generaron las historias.';
        document.getElementById('dh-current').textContent = '';
    }

    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') cerrarModal();
    });
    </script>
    <?php
}
