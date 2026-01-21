/**
 * GENERADOR DE HISTORIAS DE GUARDIANES - Duendes del Uruguay
 *
 * Este script lee un CSV con datos de productos y genera historias únicas
 * para cada guardián usando la API de Claude.
 *
 * USO:
 *   node scripts/generar-historias-completo.js
 *
 * REQUISITOS:
 *   - Archivo CSV en: /Users/usuario/Desktop/productos-datos-completos.csv
 *   - API de Vercel funcionando
 *   - Node.js instalado
 *
 * SALIDA:
 *   - /Users/usuario/Desktop/HISTORIAS-PARA-REVISAR.txt (para revisar)
 *   - /Users/usuario/Desktop/duendes-vercel/historias-generadas-nuevo.json (para WooCommerce)
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
    // Archivo de entrada (CSV con datos de productos)
    CSV_PATH: '/Users/usuario/Desktop/productos-datos-completos.csv',

    // Archivos de salida
    OUTPUT_TXT: '/Users/usuario/Desktop/HISTORIAS-PARA-REVISAR.txt',
    OUTPUT_JSON: path.join(__dirname, '..', 'historias-generadas-nuevo.json'),

    // API de generación
    API_URL: 'https://duendes-vercel.vercel.app/api/admin/productos/generar-historia',

    // Configuración de procesamiento
    DELAY_ENTRE_PRODUCTOS: 3000,  // 3 segundos entre cada producto
    MAX_REINTENTOS: 3,
    DELAY_REINTENTO: 5000,  // 5 segundos antes de reintentar

    // Delimitador del CSV (puede ser ; o ,)
    CSV_DELIMITER: ';'
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

function leerCSV(filepath) {
    const contenido = fs.readFileSync(filepath, 'utf8');
    const lineas = contenido.trim().split('\n');
    const headers = lineas[0].split(CONFIG.CSV_DELIMITER).map(h => h.trim());

    const productos = [];
    for (let i = 1; i < lineas.length; i++) {
        const valores = lineas[i].split(CONFIG.CSV_DELIMITER);
        if (valores[0] && valores[0].trim()) {
            const producto = {};
            headers.forEach((header, index) => {
                producto[header] = valores[index] ? valores[index].trim() : '';
            });
            productos.push(producto);
        }
    }

    return productos;
}

function determinarTipo(nombre, genero) {
    const nombreLower = nombre.toLowerCase();

    if (nombreLower.includes('pixie')) {
        return 'Pixie';
    }

    // Basado en género para tipos genéricos
    if (genero === 'F') {
        const tiposFemeninos = ['Guardiana', 'Hada', 'Bruja', 'Hechicera'];
        return tiposFemeninos[Math.floor(Math.random() * tiposFemeninos.length)];
    } else {
        const tiposMasculinos = ['Duende', 'Guardián', 'Mago', 'Gnomo'];
        return tiposMasculinos[Math.floor(Math.random() * tiposMasculinos.length)];
    }
}

function mapearCategoria(categoria) {
    const mapeo = {
        'Protección': 'Protección',
        'Proteccion': 'Protección',
        'Abundancia': 'Abundancia',
        'Amor': 'Amor',
        'Salud': 'Salud',
        'Sabiduría': 'Sabiduría',
        'Sabiduria': 'Sabiduría',
        'Sanación': 'Sanación',
        'Sanacion': 'Sanación'
    };
    return mapeo[categoria] || 'Protección';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generarHistoria(producto, intento = 1) {
    const datos = {
        nombre: producto.NOMBRE,
        tipo: determinarTipo(producto.NOMBRE, producto.GENERO),
        genero: producto.GENERO === 'F' ? 'femenino' : 'masculino',
        proposito: mapearCategoria(producto.CATEGORIA),
        categoriaTamano: producto.TAMANO || 'mediano',
        accesorios: producto.ACCESORIOS || '',
        instruccionesPersonalizadas: producto.ACCESORIOS
            ? `Incluir estos elementos en la historia y en "QUÉ TE APORTA": ${producto.ACCESORIOS}`
            : ''
    };

    try {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.contenido && result.contenido.historia) {
            return {
                success: true,
                historia: result.contenido.historia
            };
        } else {
            throw new Error(result.error || 'Respuesta sin historia');
        }
    } catch (error) {
        if (intento < CONFIG.MAX_REINTENTOS) {
            console.log(`   ⚠️  Error: ${error.message} - Reintento ${intento + 1}/${CONFIG.MAX_REINTENTOS}`);
            await sleep(CONFIG.DELAY_REINTENTO);
            return generarHistoria(producto, intento + 1);
        }
        return {
            success: false,
            error: error.message
        };
    }
}

// ═══════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════

async function main() {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('   🧙 GENERADOR DE HISTORIAS - DUENDES DEL URUGUAY');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');

    // Verificar que existe el archivo CSV
    if (!fs.existsSync(CONFIG.CSV_PATH)) {
        console.log('❌ ERROR: No se encontró el archivo CSV');
        console.log(`   Esperado en: ${CONFIG.CSV_PATH}`);
        console.log('');
        console.log('   Creá el archivo CSV con las columnas:');
        console.log('   NOMBRE;GENERO;CATEGORIA;TAMANO;TAMANO_CM;ACCESORIOS');
        console.log('');
        process.exit(1);
    }

    // Leer productos
    console.log('📂 Leyendo archivo CSV...');
    const productos = leerCSV(CONFIG.CSV_PATH);
    console.log(`   Encontrados: ${productos.length} productos`);
    console.log('');

    // Preparar resultados
    const resultados = {};
    const errores = [];
    let exitosos = 0;

    // Procesar cada producto
    console.log('🚀 Iniciando generación de historias...');
    console.log(`   Tiempo estimado: ${Math.ceil(productos.length * 20 / 60)} minutos`);
    console.log('');

    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        const progreso = `[${i + 1}/${productos.length}]`;

        console.log(`${progreso} ${producto.NOMBRE}...`);

        const resultado = await generarHistoria(producto);

        if (resultado.success) {
            resultados[producto.NOMBRE] = resultado.historia;
            exitosos++;
            console.log(`   ✅ Generada (${resultado.historia.split(' ').length} palabras)`);
        } else {
            errores.push({ nombre: producto.NOMBRE, error: resultado.error });
            console.log(`   ❌ Error: ${resultado.error}`);
        }

        // Delay entre productos (excepto el último)
        if (i < productos.length - 1) {
            await sleep(CONFIG.DELAY_ENTRE_PRODUCTOS);
        }
    }

    // Guardar resultados en JSON
    console.log('');
    console.log('💾 Guardando resultados...');
    fs.writeFileSync(CONFIG.OUTPUT_JSON, JSON.stringify(resultados, null, 2));
    console.log(`   JSON: ${CONFIG.OUTPUT_JSON}`);

    // Crear archivo de texto para revisar
    let textoRevisar = '';
    textoRevisar += '═══════════════════════════════════════════════════════════════\n';
    textoRevisar += '           HISTORIAS DE GUARDIANES - PARA REVISAR\n';
    textoRevisar += `           Generadas: ${new Date().toISOString().split('T')[0]}\n`;
    textoRevisar += `           Total: ${exitosos} historias\n`;
    textoRevisar += '═══════════════════════════════════════════════════════════════\n\n';

    let contador = 0;
    for (const [nombre, historia] of Object.entries(resultados)) {
        contador++;
        textoRevisar += '───────────────────────────────────────────────────────────────\n';
        textoRevisar += `PRODUCTO #${contador}: ${nombre.toUpperCase()}\n`;
        textoRevisar += '───────────────────────────────────────────────────────────────\n\n';
        textoRevisar += historia + '\n\n\n';
    }

    if (errores.length > 0) {
        textoRevisar += '═══════════════════════════════════════════════════════════════\n';
        textoRevisar += '                    ⚠️ ERRORES\n';
        textoRevisar += '═══════════════════════════════════════════════════════════════\n\n';
        errores.forEach(e => {
            textoRevisar += `❌ ${e.nombre}: ${e.error}\n`;
        });
    }

    textoRevisar += '\n═══════════════════════════════════════════════════════════════\n';
    textoRevisar += '                    FIN DEL DOCUMENTO\n';
    textoRevisar += '═══════════════════════════════════════════════════════════════\n';

    fs.writeFileSync(CONFIG.OUTPUT_TXT, textoRevisar);
    console.log(`   TXT: ${CONFIG.OUTPUT_TXT}`);

    // Resumen final
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                    📊 RESUMEN');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`   ✅ Exitosos: ${exitosos}`);
    console.log(`   ❌ Errores: ${errores.length}`);
    console.log('');
    console.log('   📄 Archivo para revisar:');
    console.log(`      ${CONFIG.OUTPUT_TXT}`);
    console.log('');

    if (errores.length > 0) {
        console.log('   ⚠️ Productos con error:');
        errores.forEach(e => console.log(`      - ${e.nombre}`));
        console.log('');
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
}

// Ejecutar
main().catch(console.error);
