import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

// ═══════════════════════════════════════════════════════════════════════════════
// GENERADOR PROFESIONAL DE CONTENIDO DEL CÍRCULO
// Genera contenido de calidad siguiendo CLAUDE.md + imágenes con DALL-E
// ═══════════════════════════════════════════════════════════════════════════════

// Guardianes arquetípicos del contenido
const GUARDIANES = {
  dorado: {
    id: 'guardian-dorado',
    nombre: 'Dorado',
    categoria: 'abundancia',
    personalidad: 'Alegre, celebratorio, directo cuando hay auto-sabotaje',
    temas: ['abundancia', 'prosperidad', 'merecimiento', 'gratitud', 'recibir'],
    cristales: ['citrino', 'pirita', 'jade'],
    elemento: 'tierra',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/04/5-3.png'
  },
  obsidiana: {
    id: 'guardian-obsidiana',
    nombre: 'Obsidiana',
    categoria: 'proteccion',
    personalidad: 'Directa, sin rodeos, con profundo amor',
    temas: ['protección', 'límites', 'seguridad', 'cortar lazos', 'escudo'],
    cristales: ['turmalina negra', 'obsidiana', 'ojo de tigre'],
    elemento: 'tierra',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/04/13-1.png'
  },
  indigo: {
    id: 'guardian-indigo',
    nombre: 'Índigo',
    categoria: 'sabiduria',
    personalidad: 'Pausado, reflexivo, cuenta historias para enseñar',
    temas: ['sabiduría', 'claridad', 'decisiones', 'conocimiento interior', 'paciencia'],
    cristales: ['lapislázuli', 'selenita', 'cuarzo ahumado'],
    elemento: 'aire',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/04/7-2.png'
  },
  jade: {
    id: 'guardian-jade',
    nombre: 'Jade',
    categoria: 'sanacion',
    personalidad: 'Calmo, sin prisa, compasivo',
    temas: ['sanación', 'soltar', 'equilibrio', 'autocuidado', 'liberación'],
    cristales: ['cuarzo rosa', 'aventurina', 'amazonita'],
    elemento: 'agua',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/04/9-1.png'
  },
  coral: {
    id: 'guardian-coral',
    nombre: 'Coral',
    categoria: 'amor',
    personalidad: 'Tierna, poética sin ser cursi, valida antes de guiar',
    temas: ['amor propio', 'relaciones', 'perdón', 'apertura emocional', 'conexión'],
    cristales: ['cuarzo rosa', 'rodocrosita', 'kunzita'],
    elemento: 'agua',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/04/11-1.png'
  },
  aurora: {
    id: 'guardian-aurora',
    nombre: 'Aurora',
    categoria: 'intuicion',
    personalidad: 'Misteriosa, hace preguntas más que dar respuestas',
    temas: ['intuición', 'sueños', 'señales', 'tercer ojo', 'confiar en uno mismo'],
    cristales: ['amatista', 'labradorita', 'fluorita'],
    elemento: 'eter',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/04/3-3.png'
  }
};

// Tipos de contenido por día de la semana
const ESTRUCTURA_SEMANAL = {
  1: { tipo: 'presentacion', nombre: 'Presentación del Guardián' },
  2: { tipo: 'afirmacion', nombre: 'Afirmación Poderosa' },
  3: { tipo: 'ensenanza', nombre: 'Enseñanza Profunda' },
  4: { tipo: 'ejercicio', nombre: 'Ejercicio Práctico' },
  5: { tipo: 'ritual', nombre: 'Ritual Guiado' },
  6: { tipo: 'reflexion', nombre: 'Reflexión del Fin de Semana' },
  0: { tipo: 'cierre', nombre: 'Mensaje de Cierre' }
};

// System prompt basado en CLAUDE.md
const SYSTEM_PROMPT = `Sos un experto creador de contenido espiritual para Duendes del Uruguay.

REGLAS ABSOLUTAS DE ESCRITURA (de CLAUDE.md):

PROHIBIDO:
- Frases genéricas de IA: "En lo profundo del bosque...", "Las brumas del otoño...", "Desde tiempos inmemoriales...", "El velo entre mundos..."
- Formato excesivamente estructurado con ### y **
- Relleno poético vacío - cada párrafo debe APORTAR
- Tono infantil o de cuento para niños
- Nombres vulgares (Panchito, Juanito)

OBLIGATORIO:
- Español rioplatense (vos, tenés, podés)
- Primera frase = IMPACTO EMOCIONAL DIRECTO
- Escribir como si conocieras a la persona de toda la vida
- Cada guardián habla desde su personalidad ÚNICA
- Contenido PRÁCTICO y aplicable HOY
- El lector es el protagonista, no el guardián
- Tono cercano pero NUNCA infantil - hablás con adultas

ESTRUCTURA DEL CONTENIDO:
- Título: corto, impactante, que genere curiosidad
- Subtítulo: expansión del título, promesa de valor
- Cuerpo: 600-1000 palabras, párrafos separados por líneas vacías
- Afirmación: frase poderosa para repetir
- Cierre: despedida cálida del guardián

FORMATO DE RESPUESTA (JSON válido):
{
  "titulo": "...",
  "subtitulo": "...",
  "cuerpo": "Párrafo 1...\\n\\nPárrafo 2...\\n\\nPárrafo 3...",
  "afirmacion": "...",
  "cierre": "..."
}`;

// Generar imagen con DALL-E
async function generarImagen(titulo, guardian, tipo) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) return guardian.imagen; // Fallback a imagen del guardián

  const estilos = {
    presentacion: 'majestic guardian portrait in enchanted forest, golden light',
    ensenanza: 'mystical study scene with ancient books and crystals',
    ritual: 'sacred altar with candles, herbs, and crystals in moonlight',
    meditacion: 'peaceful meditation scene in magical forest clearing',
    afirmacion: 'powerful sunrise over mystical landscape, rays of golden light',
    reflexion: 'contemplative twilight scene with soft purple and pink sky',
    ejercicio: 'active magical energy flow, dynamic and vibrant colors',
    cierre: 'gentle moonlit forest path leading to warm glowing portal'
  };

  try {
    const prompt = `${estilos[tipo] || estilos.presentacion}. Theme: "${titulo}". Duendes del Uruguay magical aesthetic. NO text, NO letters, NO words. Ethereal, mystical, professional quality. 4K resolution.`;

    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1792x1024',
        quality: 'standard'
      })
    });

    const data = await res.json();
    return data.data?.[0]?.url || guardian.imagen;
  } catch (e) {
    console.error('[GEN-PRO] Error imagen:', e.message);
    return guardian.imagen;
  }
}

// Obtener guardián de la semana
function obtenerGuardianSemana(semanaDelMes) {
  const guardianes = Object.values(GUARDIANES);
  const idx = (semanaDelMes - 1) % guardianes.length;
  return guardianes[idx];
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      accion,
      fecha, // "2026-01-25"
      fechaInicio, // para rango
      fechaFin, // para rango
      guardianOverride, // forzar un guardián específico
      tipoOverride, // forzar un tipo específico
      instruccionExtra,
      generarImagenes = true,
      publicarDirecto = false
    } = body;

    // ═══════════════════════════════════════════════════════════════════════
    // GENERAR DÍA ESPECÍFICO
    // ═══════════════════════════════════════════════════════════════════════
    if (accion === 'generar-dia' || (!accion && fecha)) {
      const [año, mes, dia] = fecha.split('-').map(Number);
      const fechaObj = new Date(año, mes - 1, dia);
      const diaSemana = fechaObj.getDay();
      const semanaDelMes = Math.ceil(dia / 7);

      const estructura = tipoOverride
        ? { tipo: tipoOverride, nombre: tipoOverride }
        : ESTRUCTURA_SEMANAL[diaSemana];

      const guardian = guardianOverride
        ? GUARDIANES[guardianOverride.toLowerCase()] || Object.values(GUARDIANES)[0]
        : obtenerGuardianSemana(semanaDelMes);

      // Generar contenido con Claude
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const userPrompt = `Generá contenido del Círculo de Duendes para:

FECHA: ${dia}/${mes}/${año} (${fechaObj.toLocaleDateString('es-ES', { weekday: 'long' })})
TIPO DE CONTENIDO: ${estructura.tipo} - ${estructura.nombre}

GUARDIÁN QUE HABLA:
- Nombre: ${guardian.nombre}
- Personalidad: ${guardian.personalidad}
- Categoría: ${guardian.categoria}
- Temas que domina: ${guardian.temas.join(', ')}
- Cristales: ${guardian.cristales.join(', ')}
- Elemento: ${guardian.elemento}

${instruccionExtra ? `INSTRUCCIÓN ESPECIAL: ${instruccionExtra}` : ''}

IMPORTANTE:
- El guardián habla en PRIMERA PERSONA
- Debe sentirse como un mensaje personal, no un artículo
- Incluí referencias a sus cristales o elemento de forma natural
- El contenido debe ser PRÁCTICO y aplicable HOY
- Mínimo 600 palabras en el cuerpo

Respondé SOLO con el JSON válido.`;

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
      });

      const texto = message.content[0].text;
      const jsonMatch = texto.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('No se pudo parsear la respuesta de Claude');
      }

      const contenidoGenerado = JSON.parse(jsonMatch[0]);

      // Generar imagen si está habilitado
      let imagen = guardian.imagen;
      if (generarImagenes) {
        imagen = await generarImagen(contenidoGenerado.titulo, guardian, estructura.tipo);
      }

      // Construir contenido final en formato del Dashboard
      const contenidoFinal = {
        fecha,
        tipo: estructura.tipo,
        duendeId: guardian.id,
        duendeNombre: guardian.nombre,
        titulo: contenidoGenerado.titulo,
        subtitulo: contenidoGenerado.subtitulo,
        cuerpo: contenidoGenerado.cuerpo,
        afirmacion: contenidoGenerado.afirmacion,
        cierre: contenidoGenerado.cierre,
        imagen,
        imagenGuardian: guardian.imagen,
        guardian: {
          id: guardian.id,
          nombre: guardian.nombre,
          categoria: guardian.categoria,
          personalidad: guardian.personalidad
        },
        estado: publicarDirecto ? 'publicado' : 'borrador',
        generadoEn: new Date().toISOString(),
        generadoPor: 'claude-sonnet',
        palabras: contenidoGenerado.cuerpo?.split(/\s+/).length || 0
      };

      // Guardar en KV
      await kv.set(`contenido:${fecha}`, contenidoFinal);

      // También guardar en formato alternativo para compatibilidad
      await kv.set(`circulo:contenido:${año}:${mes}:${dia}`, contenidoFinal);

      return Response.json({
        success: true,
        contenido: contenidoFinal,
        mensaje: `Contenido generado para ${fecha}`
      });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // GENERAR SEMANA COMPLETA
    // ═══════════════════════════════════════════════════════════════════════
    if (accion === 'generar-semana') {
      const [año, mes, dia] = (fechaInicio || fecha).split('-').map(Number);
      const resultados = [];

      for (let i = 0; i < 7; i++) {
        const fechaActual = new Date(año, mes - 1, dia + i);
        const fechaStr = fechaActual.toISOString().split('T')[0];

        try {
          // Llamada recursiva para generar cada día
          const res = await fetch(request.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              accion: 'generar-dia',
              fecha: fechaStr,
              guardianOverride,
              generarImagenes,
              publicarDirecto
            })
          });

          const data = await res.json();
          resultados.push({
            fecha: fechaStr,
            success: data.success,
            titulo: data.contenido?.titulo
          });

          // Pausa para no saturar APIs
          await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
          resultados.push({
            fecha: fechaStr,
            success: false,
            error: e.message
          });
        }
      }

      return Response.json({
        success: true,
        resultados,
        generados: resultados.filter(r => r.success).length,
        errores: resultados.filter(r => !r.success).length
      });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // GENERAR MES COMPLETO
    // ═══════════════════════════════════════════════════════════════════════
    if (accion === 'generar-mes') {
      const [año, mes] = (fechaInicio || fecha).split('-').map(Number);
      const diasEnMes = new Date(año, mes, 0).getDate();
      const resultados = [];

      for (let dia = 1; dia <= diasEnMes; dia++) {
        const fechaStr = `${año}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

        try {
          const res = await fetch(request.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              accion: 'generar-dia',
              fecha: fechaStr,
              generarImagenes,
              publicarDirecto
            })
          });

          const data = await res.json();
          resultados.push({
            fecha: fechaStr,
            success: data.success,
            titulo: data.contenido?.titulo
          });

          // Pausa más larga para generación masiva
          await new Promise(r => setTimeout(r, 3000));
        } catch (e) {
          resultados.push({
            fecha: fechaStr,
            success: false,
            error: e.message
          });
        }
      }

      return Response.json({
        success: true,
        mes: `${año}-${mes}`,
        resultados,
        generados: resultados.filter(r => r.success).length,
        errores: resultados.filter(r => !r.success).length
      });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PROGRAMAR CONTENIDO
    // ═══════════════════════════════════════════════════════════════════════
    if (accion === 'programar') {
      const { fechas, horaPublicacion = '09:00' } = body;

      if (!fechas || !Array.isArray(fechas)) {
        return Response.json({
          success: false,
          error: 'Se requiere array de fechas'
        }, { status: 400 });
      }

      const programacion = await kv.get('circulo:contenido:programacion') || [];

      for (const fecha of fechas) {
        // Verificar que existe contenido para esa fecha
        const contenido = await kv.get(`contenido:${fecha}`);
        if (contenido) {
          programacion.push({
            fecha,
            horaPublicacion,
            programadoEn: new Date().toISOString(),
            estado: 'pendiente'
          });
        }
      }

      await kv.set('circulo:contenido:programacion', programacion);

      return Response.json({
        success: true,
        programados: fechas.length,
        mensaje: `${fechas.length} contenidos programados para publicar a las ${horaPublicacion}`
      });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LISTAR GUARDIANES DISPONIBLES
    // ═══════════════════════════════════════════════════════════════════════
    if (accion === 'guardianes') {
      return Response.json({
        success: true,
        guardianes: Object.entries(GUARDIANES).map(([key, g]) => ({
          id: key,
          ...g
        }))
      });
    }

    return Response.json({
      success: false,
      error: 'Acción no válida. Usar: generar-dia, generar-semana, generar-mes, programar, guardianes'
    }, { status: 400 });

  } catch (error) {
    console.error('[GEN-PRO] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET - Info del generador
export async function GET() {
  const programacion = await kv.get('circulo:contenido:programacion') || [];
  const pendientes = programacion.filter(p => p.estado === 'pendiente');

  return Response.json({
    success: true,
    info: {
      nombre: 'Generador Profesional de Contenido',
      version: '2.0',
      guardianes: Object.keys(GUARDIANES).length,
      tiposContenido: Object.keys(ESTRUCTURA_SEMANAL).length,
      integraciones: ['Claude Sonnet', 'DALL-E 3']
    },
    programacion: {
      pendientes: pendientes.length,
      proximos: pendientes.slice(0, 5)
    },
    acciones: [
      'generar-dia: Genera contenido para una fecha específica',
      'generar-semana: Genera 7 días de contenido',
      'generar-mes: Genera todo el mes',
      'programar: Programa fechas para publicación automática',
      'guardianes: Lista guardianes disponibles'
    ]
  });
}
