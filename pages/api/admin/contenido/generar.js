// ADMIN: GENERAR CONTENIDO SEMANAL CON CLAUDE
import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const ADMIN_KEY = process.env.ADMIN_SECRET || 'DuendesAdmin2026';

const TEMATICAS = { 1: 'cosmos', 2: 'duendes', 3: 'diy', 4: 'esoterico' };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const adminKey = req.headers['x-admin-key'] || req.body?.adminKey;
  if (adminKey !== ADMIN_KEY) return res.status(401).json({ error: 'No autorizado' });

  try {
    const { categoria, tipo, tema, opciones = {} } = req.body;
    
    if (!categoria || !tipo) {
      return res.status(400).json({ error: 'Falta categoria o tipo' });
    }
    
    const { tono = 'cercano', longitud = 'medio' } = opciones;
    const palabras = { corto: '300-400', medio: '600-800', largo: '1000-1500' };
    
    const prompt = `Sos parte del equipo de Duendes del Uruguay. Creá contenido para el Círculo.
TIPO: ${tipo} | CATEGORÍA: ${categoria} | TEMA: ${tema || 'Elegí uno apropiado'}
TONO: ${tono} | LONGITUD: ${palabras[longitud]} palabras
REGLAS: Español rioplatense (vos, tenés), cercano pero informativo, sin emojis, conectá con guardianes/duendes.
FORMATO JSON: { "titulo": "...", "subtitulo": "...", "html": "<p>Contenido HTML</p>", "resumen": "..." }`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const texto = response.content[0].text;
    const json = texto.match(/\{[\s\S]*\}/);
    const contenido = JSON.parse(json[0]);
    
    return res.status(200).json({ success: true, contenido });
  } catch (error) {
    console.error('[CONTENIDO] Error:', error);
    return res.status(500).json({ error: 'Error generando', detalle: error.message });
  }
}
