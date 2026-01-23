import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import { generarBannerDuendeSemana, generarImagenDuende, verificarConfiguracion } from '@/lib/imagenes/generador';

// ═══════════════════════════════════════════════════════════════════════════════
// API ADMIN: DUENDE DE LA SEMANA
// Sistema mejorado para gestionar el guardián protagonista semanal del Círculo
// Con generación automática de imágenes cuando se activa un duende
// ═══════════════════════════════════════════════════════════════════════════════

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Keys de Vercel KV
const KEYS = {
  actual: 'duende-semana:actual',
  historial: 'duende-semana:historial',
  semana: (año, mes, num) => `duende-semana:${año}-${String(mes).padStart(2, '0')}-S${num}`
};

// ═══════════════════════════════════════════════════════════════════════════════
// GET - Obtener duende actual, por semana específica, o historial
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const semana = url.searchParams.get('semana'); // Formato: 2026-01-S1
    const soloActual = url.searchParams.get('actual') === '1';

    // Si piden una semana específica
    if (semana) {
      const duendeSemana = await kv.get(`duende-semana:${semana}`);
      return Response.json({
        success: true,
        semana,
        duende: duendeSemana || null
      });
    }

    // Duende actual
    const duendeActual = await kv.get(KEYS.actual);

    if (soloActual) {
      return Response.json({
        success: true,
        duendeActual
      });
    }

    // Historial de duendes (últimos 50)
    const historial = await kv.get(KEYS.historial) || [];

    // Obtener lista de productos/guardianes disponibles
    const productos = await kv.get('productos:catalogo') || [];
    const guardianes = productos
      .filter(p => p.imagen && p.estado === 'publish')
      .map(p => ({
        id: p.id,
        nombre: p.guardian || p.nombre?.split(' - ')[0] || p.nombre,
        nombreCompleto: p.nombre,
        imagen: p.imagen,
        categoria: p.categoria,
        descripcion: p.descripcion?.substring(0, 200),
        cristales: p.cristales || [],
        elemento: p.elemento
      }));

    // Obtener semanas programadas del mes actual
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = ahora.getMonth() + 1;
    const semanasDelMes = [];

    for (let s = 1; s <= 5; s++) {
      const key = KEYS.semana(año, mes, s);
      const duende = await kv.get(key);
      if (duende) {
        semanasDelMes.push({ semana: s, key, ...duende });
      }
    }

    return Response.json({
      success: true,
      duendeActual,
      historial: historial.slice(0, 10),
      semanasDelMes,
      guardianes,
      totalGuardianes: guardianes.length
    });

  } catch (error) {
    console.error('[DUENDE-SEMANA] Error GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST - Acciones: seleccionar, programar, generar personalidad, etc.
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const { accion, duendeId, datos } = body;

    switch (accion) {
      // ─────────────────────────────────────────────────────────────────────────
      // SELECCIONAR: Establecer duende como actual (inmediato)
      // ─────────────────────────────────────────────────────────────────────────
      case 'seleccionar': {
        const productos = await kv.get('productos:catalogo') || [];
        const duende = productos.find(p => p.id === duendeId);

        if (!duende) {
          return Response.json({ success: false, error: 'Duende no encontrado' }, { status: 404 });
        }

        // Guardar duende anterior en historial
        const duendeAnterior = await kv.get(KEYS.actual);
        if (duendeAnterior) {
          const historial = await kv.get(KEYS.historial) || [];
          historial.unshift({
            ...duendeAnterior,
            fechaFin: new Date().toISOString()
          });
          await kv.set(KEYS.historial, historial.slice(0, 50));
        }

        // Calcular fechas de la semana
        const hoy = new Date();
        const diaSemana = hoy.getDay();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - diaSemana);
        inicioSemana.setHours(0, 0, 0, 0);
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);
        finSemana.setHours(23, 59, 59, 999);

        const nuevoDuende = {
          duendeId: duende.id,
          nombre: duende.guardian || duende.nombre?.split(' - ')[0] || duende.nombre,
          nombreCompleto: duende.nombre,
          imagen: duende.imagen,
          categoria: duende.categoria,
          descripcion: duende.descripcion,
          cristales: duende.cristales || [],
          proposito: duende.proposito || extraerProposito(duende.categoria),
          elemento: duende.elemento || extraerElemento(duende.categoria),
          personalidadGenerada: null,
          fechaInicio: inicioSemana.toISOString(),
          fechaFin: finSemana.toISOString(),
          semanaKey: calcularSemanaKey(inicioSemana),
          seleccionadoEn: new Date().toISOString()
        };

        await kv.set(KEYS.actual, nuevoDuende);

        // También guardar en la key de semana específica
        await kv.set(`duende-semana:${nuevoDuende.semanaKey}`, nuevoDuende);

        return Response.json({
          success: true,
          duende: nuevoDuende,
          mensaje: `${nuevoDuende.nombre} es ahora el Duende de la Semana`
        });
      }

      // ─────────────────────────────────────────────────────────────────────────
      // PROGRAMAR: Establecer duende para una semana específica
      // ─────────────────────────────────────────────────────────────────────────
      case 'programar': {
        const { fechaInicio, fechaFin, semanaKey, personalidad } = datos || {};

        if (!duendeId) {
          return Response.json({ success: false, error: 'Se requiere duendeId' }, { status: 400 });
        }

        // Buscar en catálogo o usar datos directos si se proveen
        let duendeData = datos?.duende;

        if (!duendeData) {
          const productos = await kv.get('productos:catalogo') || [];
          const producto = productos.find(p => p.id === duendeId);

          if (!producto) {
            return Response.json({ success: false, error: 'Duende no encontrado en catálogo' }, { status: 404 });
          }

          duendeData = producto;
        }

        const duendeProgramado = {
          duendeId: duendeId,
          nombre: duendeData.guardian || duendeData.nombre?.split(' - ')[0] || duendeData.nombre,
          nombreCompleto: duendeData.nombreCompleto || duendeData.nombre,
          imagen: duendeData.imagen,
          categoria: duendeData.categoria,
          descripcion: duendeData.descripcion,
          cristales: duendeData.cristales || [],
          proposito: duendeData.proposito || extraerProposito(duendeData.categoria),
          elemento: duendeData.elemento || extraerElemento(duendeData.categoria),
          personalidadGenerada: personalidad || null,
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          semanaKey: semanaKey,
          programadoEn: new Date().toISOString()
        };

        // Guardar en key de semana específica
        const key = `duende-semana:${semanaKey}`;
        await kv.set(key, duendeProgramado);

        // Si la semana es la actual, también actualizar duende actual
        const hoy = new Date();
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (hoy >= inicio && hoy <= fin) {
          await kv.set(KEYS.actual, duendeProgramado);
        }

        return Response.json({
          success: true,
          duende: duendeProgramado,
          key,
          mensaje: `${duendeProgramado.nombre} programado para semana ${semanaKey}`
        });
      }

      // ─────────────────────────────────────────────────────────────────────────
      // GENERAR PERSONALIDAD: Crear voz única con Claude
      // ─────────────────────────────────────────────────────────────────────────
      case 'generar-personalidad': {
        const semanaKey = datos?.semanaKey;
        let duendeActual;

        if (semanaKey) {
          duendeActual = await kv.get(`duende-semana:${semanaKey}`);
        } else {
          duendeActual = await kv.get(KEYS.actual);
        }

        if (!duendeActual) {
          return Response.json({ success: false, error: 'No hay duende seleccionado' }, { status: 400 });
        }

        // Generar personalidad con Claude
        const personalidad = await generarPersonalidadConClaude(duendeActual);

        // Actualizar duende con personalidad
        duendeActual.personalidadGenerada = personalidad;
        duendeActual.personalidadGeneradaEn = new Date().toISOString();

        if (semanaKey) {
          await kv.set(`duende-semana:${semanaKey}`, duendeActual);
        }
        await kv.set(KEYS.actual, duendeActual);

        return Response.json({
          success: true,
          personalidad,
          duende: duendeActual
        });
      }

      // ─────────────────────────────────────────────────────────────────────────
      // EDITAR PERSONALIDAD: Modificar campos específicos
      // ─────────────────────────────────────────────────────────────────────────
      case 'editar-personalidad': {
        const semanaKey = datos?.semanaKey;
        let duendeActual;

        if (semanaKey) {
          duendeActual = await kv.get(`duende-semana:${semanaKey}`);
        } else {
          duendeActual = await kv.get(KEYS.actual);
        }

        if (!duendeActual) {
          return Response.json({ success: false, error: 'No hay duende seleccionado' }, { status: 400 });
        }

        duendeActual.personalidadGenerada = {
          ...duendeActual.personalidadGenerada,
          ...datos.personalidad
        };
        duendeActual.personalidadEditadaEn = new Date().toISOString();

        if (semanaKey) {
          await kv.set(`duende-semana:${semanaKey}`, duendeActual);
        }
        await kv.set(KEYS.actual, duendeActual);

        return Response.json({
          success: true,
          duende: duendeActual
        });
      }

      // ─────────────────────────────────────────────────────────────────────────
      // ALEATORIO: Seleccionar duende random que no haya sido reciente
      // ─────────────────────────────────────────────────────────────────────────
      case 'aleatorio': {
        const { categoria } = datos || {};
        const productos = await kv.get('productos:catalogo') || [];
        const historial = await kv.get(KEYS.historial) || [];
        const idsRecientes = historial.slice(0, 8).map(d => d.duendeId);

        let disponibles = productos.filter(p =>
          p.imagen &&
          p.estado === 'publish' &&
          !idsRecientes.includes(p.id)
        );

        // Filtrar por categoría si se especifica
        if (categoria) {
          disponibles = disponibles.filter(p =>
            p.categoria?.toLowerCase() === categoria.toLowerCase()
          );
        }

        if (disponibles.length === 0) {
          // Si no hay disponibles con filtro, usar todos
          disponibles = productos.filter(p => p.imagen && p.estado === 'publish');
        }

        if (disponibles.length === 0) {
          return Response.json({ success: false, error: 'No hay duendes disponibles' }, { status: 400 });
        }

        const aleatorio = disponibles[Math.floor(Math.random() * disponibles.length)];

        // Llamar recursivamente con acción seleccionar
        return POST(new Request(request.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accion: 'seleccionar', duendeId: aleatorio.id })
        }));
      }

      // ─────────────────────────────────────────────────────────────────────────
      // ACTIVAR SEMANA: Activar un duende programado como actual
      // ─────────────────────────────────────────────────────────────────────────
      case 'activar-semana': {
        const { semanaKey } = datos || {};

        if (!semanaKey) {
          return Response.json({ success: false, error: 'Se requiere semanaKey' }, { status: 400 });
        }

        const duendeProgramado = await kv.get(`duende-semana:${semanaKey}`);

        if (!duendeProgramado) {
          return Response.json({ success: false, error: 'No hay duende programado para esa semana' }, { status: 404 });
        }

        // Guardar actual en historial
        const duendeAnterior = await kv.get(KEYS.actual);
        if (duendeAnterior && duendeAnterior.duendeId !== duendeProgramado.duendeId) {
          const historial = await kv.get(KEYS.historial) || [];
          historial.unshift({
            ...duendeAnterior,
            fechaFin: new Date().toISOString()
          });
          await kv.set(KEYS.historial, historial.slice(0, 50));
        }

        // Activar el programado
        await kv.set(KEYS.actual, duendeProgramado);

        return Response.json({
          success: true,
          duende: duendeProgramado,
          mensaje: `${duendeProgramado.nombre} activado como Duende de la Semana`
        });
      }

      // ─────────────────────────────────────────────────────────────────────────
      // SEED BULK: Crear múltiples semanas de una vez
      // ─────────────────────────────────────────────────────────────────────────
      case 'seed-bulk': {
        const { semanas } = datos || {};

        if (!semanas || !Array.isArray(semanas)) {
          return Response.json({ success: false, error: 'Se requiere array de semanas' }, { status: 400 });
        }

        const resultados = [];

        for (const semana of semanas) {
          try {
            const key = `duende-semana:${semana.semanaKey}`;
            await kv.set(key, semana);
            resultados.push({ key, success: true, nombre: semana.nombre });
          } catch (e) {
            resultados.push({ key: semana.semanaKey, success: false, error: e.message });
          }
        }

        return Response.json({
          success: true,
          resultados,
          total: resultados.length,
          exitosos: resultados.filter(r => r.success).length
        });
      }

      // ─────────────────────────────────────────────────────────────────────────
      // GENERAR IMAGEN: Crear imagen IA para el duende de la semana
      // ─────────────────────────────────────────────────────────────────────────
      case 'generar-imagen': {
        const semanaKey = datos?.semanaKey;
        const tipoImagen = datos?.tipo || 'banner'; // 'banner' o 'avatar'
        const api = datos?.api || 'replicate';
        const modelo = datos?.modelo || 'flux-schnell';

        // Verificar que hay APIs configuradas
        const config = verificarConfiguracion();
        if (!config.replicate && !config.openai) {
          return Response.json({
            success: false,
            error: 'No hay APIs de imágenes configuradas (REPLICATE_API_TOKEN o OPENAI_API_KEY)'
          }, { status: 400 });
        }

        // Obtener duende
        let duendeActual;
        if (semanaKey) {
          duendeActual = await kv.get(`duende-semana:${semanaKey}`);
        } else {
          duendeActual = await kv.get(KEYS.actual);
        }

        if (!duendeActual) {
          return Response.json({ success: false, error: 'No hay duende seleccionado' }, { status: 400 });
        }

        console.log(`[DUENDE-SEMANA] Generando imagen ${tipoImagen} para ${duendeActual.nombre}`);

        // Generar imagen según tipo
        let resultado;
        const opciones = { api, modelo };

        if (tipoImagen === 'banner') {
          resultado = await generarBannerDuendeSemana(duendeActual, { ...opciones, aspectRatio: '16:9' });
        } else {
          resultado = await generarImagenDuende(duendeActual, { ...opciones, aspectRatio: '1:1' });
        }

        if (!resultado.success) {
          return Response.json({
            success: false,
            error: resultado.error || 'Error generando imagen'
          }, { status: 500 });
        }

        // Guardar URL en el duende
        if (tipoImagen === 'banner') {
          duendeActual.imagenBanner = resultado.url;
          duendeActual.imagenBannerGeneradaEn = new Date().toISOString();
        } else {
          duendeActual.imagenGenerada = resultado.url;
          duendeActual.imagenGeneradaEn = new Date().toISOString();
        }

        // Actualizar en KV
        if (semanaKey) {
          await kv.set(`duende-semana:${semanaKey}`, duendeActual);
        }
        await kv.set(KEYS.actual, duendeActual);

        return Response.json({
          success: true,
          imagen: {
            url: resultado.url,
            tipo: tipoImagen,
            api: api,
            modelo: resultado.modelo
          },
          duende: duendeActual,
          mensaje: `Imagen ${tipoImagen} generada para ${duendeActual.nombre}`
        });
      }

      // ─────────────────────────────────────────────────────────────────────────
      // ACTIVAR CON IMAGEN: Activar duende y generar imagen si no tiene
      // ─────────────────────────────────────────────────────────────────────────
      case 'activar-con-imagen': {
        const { semanaKey, generarSiNoTiene = true } = datos || {};

        if (!semanaKey) {
          return Response.json({ success: false, error: 'Se requiere semanaKey' }, { status: 400 });
        }

        const duendeProgramado = await kv.get(`duende-semana:${semanaKey}`);

        if (!duendeProgramado) {
          return Response.json({ success: false, error: 'No hay duende programado para esa semana' }, { status: 404 });
        }

        // Guardar actual en historial
        const duendeAnterior = await kv.get(KEYS.actual);
        if (duendeAnterior && duendeAnterior.duendeId !== duendeProgramado.duendeId) {
          const historial = await kv.get(KEYS.historial) || [];
          historial.unshift({
            ...duendeAnterior,
            fechaFin: new Date().toISOString()
          });
          await kv.set(KEYS.historial, historial.slice(0, 50));
        }

        // Generar imagen banner si no tiene y está configurado
        let imagenGenerada = null;
        if (generarSiNoTiene && !duendeProgramado.imagenBanner) {
          const config = verificarConfiguracion();
          if (config.replicate || config.openai) {
            console.log(`[DUENDE-SEMANA] Generando imagen automática para ${duendeProgramado.nombre}`);
            const resultado = await generarBannerDuendeSemana(duendeProgramado, {
              api: config.preferida,
              modelo: 'flux-schnell',
              aspectRatio: '16:9'
            });

            if (resultado.success) {
              duendeProgramado.imagenBanner = resultado.url;
              duendeProgramado.imagenBannerGeneradaEn = new Date().toISOString();
              imagenGenerada = resultado.url;
              // Actualizar también en la key de semana
              await kv.set(`duende-semana:${semanaKey}`, duendeProgramado);
            }
          }
        }

        // Activar el programado
        await kv.set(KEYS.actual, duendeProgramado);

        return Response.json({
          success: true,
          duende: duendeProgramado,
          imagenGenerada,
          mensaje: `${duendeProgramado.nombre} activado como Duende de la Semana${imagenGenerada ? ' (imagen generada)' : ''}`
        });
      }

      default:
        return Response.json({ success: false, error: 'Acción no reconocida' }, { status: 400 });
    }

  } catch (error) {
    console.error('[DUENDE-SEMANA] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════

async function generarPersonalidadConClaude(duende) {
  const prompt = `Sos un experto en crear personalidades únicas para guardianes mágicos (duendes elementales de Uruguay).

Basándote en esta información del duende:
- Nombre: ${duende.nombre}
- Nombre completo: ${duende.nombreCompleto || duende.nombre}
- Descripción: ${duende.descripcion || 'Un guardián mágico protector'}
- Cristales que porta: ${duende.cristales?.join(', ') || 'cuarzo'}
- Propósito principal: ${duende.proposito || 'protección y guía'}
- Categoría: ${duende.categoria || 'Protección'}
- Elemento: ${duende.elemento || 'tierra'}

Genera una personalidad ÚNICA y MEMORABLE que incluya:

1. manera_de_hablar: Cómo se expresa (formal/coloquial/poético/directo). Usá español rioplatense (vos, tenés, podés). 2-3 oraciones describiendo su estilo ÚNICO.

2. temas_favoritos: Array de 3-5 temas que le apasionan profundamente. Sean específicos, no genéricos.

3. como_da_consejos: Su estilo ÚNICO para dar consejos (¿con metáforas? ¿preguntas? ¿historias? ¿directo al grano?). 2 oraciones.

4. frase_caracteristica: UNA frase distintiva que usa frecuentemente. Debe ser memorable, profunda, y SOLO de este duende. Nada genérico.

5. forma_de_despedirse: Cómo se despide de manera única y personal. 1 oración.

6. curiosidad_unica: Un dato curioso, manía o quirk adorable que lo hace único. Algo inesperado.

7. tono_emocional: El tono predominante de sus mensajes (ej: "esperanzador pero realista", "misterioso con toques de humor", "firme pero cálido").

8. hora_magica: Su momento del día favorito y por qué (no solo "amanecer" - sé específico).

9. elemento_especifico: Un elemento natural MUY específico que lo representa (no solo "tierra" sino algo como "la tierra húmeda después de la lluvia de verano").

IMPORTANTE:
- La personalidad debe ser coherente con su categoría (${duende.categoria}) y propósito
- Debe sentirse AUTÉNTICA, no genérica de fantasía
- Evitá clichés como "brumas ancestrales", "tiempos inmemoriales", "el velo entre mundos"
- Hacelo sentir como un ser REAL con miles de años de experiencia viviendo en Uruguay
- El español debe ser rioplatense natural

Responde SOLO con un JSON válido, sin explicaciones adicionales ni markdown.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });

    const contenido = response.content[0].text;
    const jsonLimpio = contenido.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonLimpio);
  } catch (error) {
    console.error('Error generando personalidad:', error);
    // Fallback básico
    return {
      manera_de_hablar: "Habla de forma directa pero cálida, usando el voseo uruguayo.",
      temas_favoritos: ["naturaleza", "ciclos de la vida", "pequeñas alegrías"],
      como_da_consejos: "Da consejos prácticos con metáforas de la naturaleza.",
      frase_caracteristica: "Lo que buscás ya está en vos, solo hay que mirarlo.",
      forma_de_despedirse: "Hasta que nos volvamos a encontrar.",
      curiosidad_unica: "Le gusta recolectar piedras del río.",
      tono_emocional: "Sereno pero esperanzador",
      hora_magica: "El momento justo antes del amanecer, cuando el mundo está en silencio.",
      elemento_especifico: "Las raíces de los ombúes viejos."
    };
  }
}

function calcularSemanaKey(fecha) {
  const d = new Date(fecha);
  const año = d.getFullYear();
  const mes = d.getMonth() + 1;

  // Calcular número de semana del mes
  const primerDia = new Date(año, mes - 1, 1);
  const diasHastaPrimerLunes = (8 - primerDia.getDay()) % 7;
  const primerLunes = new Date(año, mes - 1, 1 + diasHastaPrimerLunes);

  let numSemana;
  if (d < primerLunes) {
    numSemana = 1;
  } else {
    const diasDesde = Math.floor((d - primerLunes) / (7 * 24 * 60 * 60 * 1000));
    numSemana = Math.floor(diasDesde / 7) + 2;
  }

  return `${año}-${String(mes).padStart(2, '0')}-S${numSemana}`;
}

function extraerProposito(categoria) {
  const propositos = {
    'Protección': 'Proteger y crear espacios seguros',
    'Abundancia': 'Atraer prosperidad y oportunidades',
    'Amor': 'Abrir el corazón y sanar vínculos',
    'Sanación': 'Sanar heridas del alma y el cuerpo',
    'Salud': 'Equilibrar energías y promover bienestar',
    'Sabiduría': 'Guiar con conocimiento y claridad'
  };
  return propositos[categoria] || 'Acompañar en el camino';
}

function extraerElemento(categoria) {
  const elementos = {
    'Protección': 'tierra',
    'Abundancia': 'fuego',
    'Amor': 'agua',
    'Sanación': 'agua',
    'Salud': 'aire',
    'Sabiduría': 'aire'
  };
  return elementos[categoria] || 'tierra';
}
