import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

// ═══════════════════════════════════════════════════════════════════════════════
// API: DUENDE DE LA SEMANA
// Sistema para seleccionar y gestionar el duende protagonista semanal
// ═══════════════════════════════════════════════════════════════════════════════

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// GET - Obtener duende actual e historial
export async function GET() {
  try {
    // Duende actual
    const duendeActual = await kv.get('duende-semana-actual');

    // Historial de duendes
    const historial = await kv.get('duende-semana-historial') || [];

    // Obtener lista de productos/guardianes disponibles
    const productos = await kv.get('productos:catalogo') || [];
    const guardianes = productos.filter(p => p.imagen);

    return Response.json({
      success: true,
      duendeActual,
      historial: historial.slice(0, 10),
      guardianes
    });

  } catch (error) {
    console.error('[DUENDE-SEMANA] Error GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Acciones: seleccionar duende, generar personalidad, etc.
export async function POST(request) {
  try {
    const body = await request.json();
    const { accion, duendeId, datos } = body;

    switch (accion) {
      case 'seleccionar': {
        // Obtener datos del duende desde productos
        const productos = await kv.get('productos:catalogo') || [];
        const duende = productos.find(p => p.id === duendeId);

        if (!duende) {
          return Response.json({ success: false, error: 'Duende no encontrado' }, { status: 404 });
        }

        // Guardar duende actual en historial
        const duendeAnterior = await kv.get('duende-semana-actual');
        if (duendeAnterior) {
          const historial = await kv.get('duende-semana-historial') || [];
          historial.unshift({
            ...duendeAnterior,
            fechaFin: new Date().toISOString()
          });
          await kv.set('duende-semana-historial', historial.slice(0, 50));
        }

        // Calcular fechas de la semana
        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);

        const nuevoDuende = {
          duendeId: duende.id,
          nombre: duende.guardian || duende.nombre?.split(' ')[0] || duende.nombre,
          nombreCompleto: duende.nombre,
          imagen: duende.imagen,
          categoria: duende.categoria,
          descripcion: duende.descripcion,
          cristales: duende.cristales || [],
          proposito: duende.proposito,
          elemento: duende.elemento,
          personalidadGenerada: null,
          fechaInicio: inicioSemana.toISOString(),
          fechaFin: finSemana.toISOString(),
          seleccionadoEn: new Date().toISOString()
        };

        await kv.set('duende-semana-actual', nuevoDuende);

        return Response.json({
          success: true,
          duende: nuevoDuende,
          mensaje: `${nuevoDuende.nombre} es ahora el Duende de la Semana`
        });
      }

      case 'generar-personalidad': {
        const duendeActual = await kv.get('duende-semana-actual');

        if (!duendeActual) {
          return Response.json({ success: false, error: 'No hay duende seleccionado' }, { status: 400 });
        }

        // Generar personalidad con Claude
        const prompt = `Eres un experto en crear personalidades únicas para guardianes mágicos (duendes elementales).

Basándote en esta información del duende:
- Nombre: ${duendeActual.nombre}
- Nombre completo: ${duendeActual.nombreCompleto || duendeActual.nombre}
- Descripción: ${duendeActual.descripcion || 'Un guardián mágico protector'}
- Cristales que porta: ${duendeActual.cristales?.join(', ') || 'cuarzo'}
- Propósito principal: ${duendeActual.proposito || 'protección y guía'}
- Elemento: ${duendeActual.elemento || 'tierra'}

Genera una personalidad ÚNICA y MEMORABLE que incluya:

1. manera_de_hablar: Cómo se expresa (formal/informal, usa acertijos, poético, directo, con humor). 2-3 oraciones describiendo su estilo.

2. temas_favoritos: Array de 3-5 temas que le apasionan (pueden ser: naturaleza, estrellas, cocina mágica, música, cristales, plantas, sueños, etc.)

3. hora_preferida: Su momento del día favorito y por qué (amanecer, mediodía, atardecer, medianoche, etc.)

4. elemento_favorito: Un elemento natural específico que lo representa (no solo "tierra" sino algo como "la tierra húmeda después de la lluvia")

5. como_da_consejos: Su estilo para dar consejos (directo, con metáforas, haciendo preguntas, contando historias, etc.)

6. frase_caracteristica: UNA frase distintiva que siempre usa o que lo representa. Debe ser memorable y única.

7. despedida: Cómo se despide de manera única y personal.

8. curiosidad: Un dato curioso o manía adorable que lo hace único.

9. tono_emocional: El tono predominante de sus mensajes (esperanzador, misterioso, juguetón, sabio, reconfortante, etc.)

IMPORTANTE:
- La personalidad debe ser coherente con su propósito y cristales
- Debe sentirse auténtica, no genérica
- Evita clichés de fantasía
- Hazlo sentir como un ser con miles de años de experiencia

Responde SOLO con un JSON válido, sin explicaciones adicionales.`;

        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }]
        });

        let personalidad;
        try {
          const contenido = response.content[0].text;
          // Limpiar posibles marcadores de código
          const jsonLimpio = contenido.replace(/```json\n?|\n?```/g, '').trim();
          personalidad = JSON.parse(jsonLimpio);
        } catch (parseError) {
          console.error('Error parseando personalidad:', parseError);
          return Response.json({
            success: false,
            error: 'Error interpretando la personalidad generada',
            raw: response.content[0].text
          }, { status: 500 });
        }

        // Actualizar duende con personalidad
        duendeActual.personalidadGenerada = personalidad;
        duendeActual.personalidadGeneradaEn = new Date().toISOString();
        await kv.set('duende-semana-actual', duendeActual);

        return Response.json({
          success: true,
          personalidad,
          duende: duendeActual
        });
      }

      case 'editar-personalidad': {
        const duendeActual = await kv.get('duende-semana-actual');

        if (!duendeActual) {
          return Response.json({ success: false, error: 'No hay duende seleccionado' }, { status: 400 });
        }

        duendeActual.personalidadGenerada = {
          ...duendeActual.personalidadGenerada,
          ...datos
        };
        duendeActual.personalidadEditadaEn = new Date().toISOString();
        await kv.set('duende-semana-actual', duendeActual);

        return Response.json({
          success: true,
          duende: duendeActual
        });
      }

      case 'aleatorio': {
        // Seleccionar duende aleatorio que no haya sido reciente
        const productos = await kv.get('productos:catalogo') || [];
        const historial = await kv.get('duende-semana-historial') || [];
        const idsRecientes = historial.slice(0, 4).map(d => d.duendeId);

        const disponibles = productos.filter(p =>
          p.imagen && !idsRecientes.includes(p.id)
        );

        if (disponibles.length === 0) {
          return Response.json({ success: false, error: 'No hay duendes disponibles' }, { status: 400 });
        }

        const aleatorio = disponibles[Math.floor(Math.random() * disponibles.length)];

        // Llamar recursivamente con acción seleccionar
        const bodySeleccionar = { accion: 'seleccionar', duendeId: aleatorio.id };
        return POST(new Request(request.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodySeleccionar)
        }));
      }

      default:
        return Response.json({ success: false, error: 'Acción no reconocida' }, { status: 400 });
    }

  } catch (error) {
    console.error('[DUENDE-SEMANA] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
