import { kv } from '@vercel/kv';
import {
  obtenerFichaCliente,
  crearFichaDesdeElegido,
  analizarCliente,
  obtenerAlertasGlobales,
  calcularSignoZodiacal,
  calcularProximoCumple
} from '@/lib/ficha-cliente';

// ═══════════════════════════════════════════════════════════════
// API ADMIN - GESTIÓN DE CLIENTES CON FICHAS INTELIGENTES
// ═══════════════════════════════════════════════════════════════

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// GET - Listar clientes, obtener ficha o alertas
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const accion = searchParams.get('accion');
    const query = searchParams.get('q')?.toLowerCase() || '';
    const limite = parseInt(searchParams.get('limite') || '100');
    const ordenar = searchParams.get('ordenar') || 'ultimaCompra';

    // Obtener alertas globales
    if (accion === 'alertas') {
      const alertas = await obtenerAlertasGlobales();
      return Response.json({
        success: true,
        alertas,
        total: alertas.length
      }, { headers: CORS_HEADERS });
    }

    // Obtener ficha de cliente específico
    if (email) {
      const ficha = await obtenerFichaCliente(email);

      if (!ficha) {
        return Response.json({
          success: false,
          error: 'Cliente no encontrado'
        }, { status: 404, headers: CORS_HEADERS });
      }

      return Response.json({
        success: true,
        ficha
      }, { headers: CORS_HEADERS });
    }

    // Listar todos los clientes
    const elegidosKeys = await kv.keys('elegido:*');
    const clientes = [];

    for (const key of elegidosKeys) {
      const clienteEmail = key.replace('elegido:', '');

      // Si hay búsqueda, filtrar
      if (query && !clienteEmail.toLowerCase().includes(query)) {
        const elegido = await kv.get(key);
        if (elegido && !((elegido.nombre || '').toLowerCase().includes(query))) {
          continue;
        }
      }

      let ficha = await kv.get(`ficha:${clienteEmail}`);

      if (!ficha) {
        // Crear ficha si no existe
        ficha = await crearFichaDesdeElegido(clienteEmail);
      }

      if (ficha) {
        // Resumen para listado
        clientes.push({
          email: ficha.email,
          nombre: ficha.nombreCompleto || ficha.nombre,
          signo: ficha.signoZodiacal,
          signoEmoji: ficha.signoEmoji,
          guardianes: ficha.cantidadGuardianes,
          guardianesNombres: ficha.guardianes?.map(g => g.nombre || g).slice(0, 3),
          esCirculo: ficha.esCirculo,
          tipoMembresia: ficha.tipoMembresia,
          runas: ficha.runas,
          nivel: ficha.nivel,
          totalCompras: ficha.totalCompras,
          ultimaCompra: ficha.ultimaCompra,
          lecturasRealizadas: ficha.lecturasRealizadas,
          proximoCumple: ficha.proximoCumple,
          tieneAnalisis: !!ficha.analisis,
          alertas: ficha.alertas?.length || 0,
          resumenEjecutivo: ficha.analisis?.resumenEjecutivo
        });
      }

      if (clientes.length >= limite) break;
    }

    // Ordenar
    if (ordenar === 'ultimaCompra') {
      clientes.sort((a, b) => new Date(b.ultimaCompra || 0) - new Date(a.ultimaCompra || 0));
    } else if (ordenar === 'totalCompras') {
      clientes.sort((a, b) => (b.totalCompras || 0) - (a.totalCompras || 0));
    } else if (ordenar === 'nombre') {
      clientes.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
    } else if (ordenar === 'alertas') {
      clientes.sort((a, b) => (b.alertas || 0) - (a.alertas || 0));
    }

    return Response.json({
      success: true,
      clientes,
      total: clientes.length
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error en API clientes:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}

// ═══════════════════════════════════════════════════════════════
// POST - Analizar cliente, actualizar ficha, agregar notas
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, accion, datos, nombre } = body;

    // Crear cliente nuevo (compatibilidad con API anterior)
    if (!accion && email && !await kv.get(`elegido:${email.toLowerCase()}`)) {
      const emailNormalizado = email.toLowerCase().trim();
      const nuevoCliente = {
        email: emailNormalizado,
        nombre: nombre || '',
        runas: 0,
        treboles: 0,
        totalCompras: 0,
        guardianes: [],
        fechaCreacion: new Date().toISOString(),
        creadoPorAdmin: true
      };

      await kv.set(`elegido:${emailNormalizado}`, nuevoCliente);
      await crearFichaDesdeElegido(emailNormalizado);

      return Response.json({
        success: true,
        mensaje: 'Cliente creado',
        cliente: nuevoCliente
      }, { headers: CORS_HEADERS });
    }

    if (!email) {
      return Response.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400, headers: CORS_HEADERS });
    }

    // Acción: analizar cliente con IA
    if (accion === 'analizar') {
      const analisis = await analizarCliente(email);

      if (!analisis) {
        return Response.json({
          success: false,
          error: 'No se pudo analizar el cliente'
        }, { status: 500, headers: CORS_HEADERS });
      }

      return Response.json({
        success: true,
        mensaje: 'Análisis completado',
        analisis
      }, { headers: CORS_HEADERS });
    }

    // Acción: actualizar datos de la ficha
    if (accion === 'actualizar' && datos) {
      let ficha = await obtenerFichaCliente(email);
      if (!ficha) {
        return Response.json({
          success: false,
          error: 'Cliente no encontrado'
        }, { status: 404, headers: CORS_HEADERS });
      }

      // Campos actualizables manualmente
      const camposPermitidos = [
        'nombreCompleto', 'apellido', 'telefono', 'pais', 'ciudad', 'direccion',
        'fechaNacimiento', 'pronombre', 'elementoAfinidad'
      ];

      for (const campo of camposPermitidos) {
        if (datos[campo] !== undefined) {
          ficha[campo] = datos[campo];
        }
      }

      // Recalcular signo si cambió fecha de nacimiento
      if (datos.fechaNacimiento) {
        const signoInfo = calcularSignoZodiacal(datos.fechaNacimiento);
        ficha.signoZodiacal = signoInfo?.signo || null;
        ficha.signoEmoji = signoInfo?.emoji || null;
        ficha.elementoZodiacal = signoInfo?.elemento || null;
        ficha.proximoCumple = calcularProximoCumple(datos.fechaNacimiento);
      }

      ficha.actualizadoEn = new Date().toISOString();
      await kv.set(`ficha:${email}`, ficha);

      // También actualizar elegido
      const elegido = await kv.get(`elegido:${email}`);
      if (elegido) {
        if (datos.fechaNacimiento) elegido.fechaNacimiento = datos.fechaNacimiento;
        if (datos.nombreCompleto) elegido.nombreCompleto = datos.nombreCompleto;
        if (datos.pronombre) elegido.pronombre = datos.pronombre;
        await kv.set(`elegido:${email}`, elegido);
      }

      return Response.json({
        success: true,
        mensaje: 'Ficha actualizada',
        ficha
      }, { headers: CORS_HEADERS });
    }

    // Acción: agregar nota importante
    if (accion === 'agregarNota' && datos?.nota) {
      let ficha = await obtenerFichaCliente(email);
      if (!ficha) {
        return Response.json({
          success: false,
          error: 'Cliente no encontrado'
        }, { status: 404, headers: CORS_HEADERS });
      }

      ficha.notasImportantes = ficha.notasImportantes || [];
      ficha.notasImportantes.unshift({
        texto: datos.nota,
        fecha: new Date().toISOString(),
        autor: datos.autor || 'Admin'
      });
      ficha.actualizadoEn = new Date().toISOString();

      await kv.set(`ficha:${email}`, ficha);

      return Response.json({
        success: true,
        mensaje: 'Nota agregada',
        notas: ficha.notasImportantes
      }, { headers: CORS_HEADERS });
    }

    // Acción: generar fichas de todos los clientes
    if (accion === 'generarTodas') {
      const elegidosKeys = await kv.keys('elegido:*');
      let generadas = 0;

      for (const key of elegidosKeys) {
        const clienteEmail = key.replace('elegido:', '');
        const fichaExistente = await kv.get(`ficha:${clienteEmail}`);

        if (!fichaExistente) {
          await crearFichaDesdeElegido(clienteEmail);
          generadas++;
        }
      }

      return Response.json({
        success: true,
        mensaje: `Fichas generadas: ${generadas}`,
        total: elegidosKeys.length
      }, { headers: CORS_HEADERS });
    }

    // Acción: analizar todos los clientes (batch)
    if (accion === 'analizarTodos') {
      const elegidosKeys = await kv.keys('elegido:*');
      let analizados = 0;
      const limite = datos?.limite || 10;

      for (const key of elegidosKeys.slice(0, limite)) {
        const clienteEmail = key.replace('elegido:', '');
        const ficha = await kv.get(`ficha:${clienteEmail}`);

        // Solo analizar si no tiene análisis reciente (últimas 24h)
        if (!ficha?.ultimoAnalisis ||
            new Date() - new Date(ficha.ultimoAnalisis) > 24 * 60 * 60 * 1000) {
          await analizarCliente(clienteEmail);
          analizados++;
        }
      }

      return Response.json({
        success: true,
        mensaje: `Clientes analizados: ${analizados}`,
        total: elegidosKeys.length
      }, { headers: CORS_HEADERS });
    }

    return Response.json({
      success: false,
      error: 'Acción no reconocida'
    }, { status: 400, headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error en POST clientes:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}
