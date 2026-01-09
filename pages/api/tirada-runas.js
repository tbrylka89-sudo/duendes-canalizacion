import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Las 24 runas del Futhark Elder
const RUNAS = [
  { simbolo: 'ᚠ', nombre: 'Fehu', significado: 'Abundancia, riqueza, nuevos comienzos, prosperidad material' },
  { simbolo: 'ᚢ', nombre: 'Uruz', significado: 'Fuerza, salud, vitalidad, poder interior' },
  { simbolo: 'ᚦ', nombre: 'Thurisaz', significado: 'Protección, defensa, cambio necesario, romper barreras' },
  { simbolo: 'ᚨ', nombre: 'Ansuz', significado: 'Sabiduría, comunicación, señales divinas, inspiración' },
  { simbolo: 'ᚱ', nombre: 'Raido', significado: 'Viaje, movimiento, evolución, el camino correcto' },
  { simbolo: 'ᚲ', nombre: 'Kenaz', significado: 'Creatividad, pasión, transformación, luz interior' },
  { simbolo: 'ᚷ', nombre: 'Gebo', significado: 'Regalo, generosidad, equilibrio, intercambio sagrado' },
  { simbolo: 'ᚹ', nombre: 'Wunjo', significado: 'Alegría, armonía, éxito, realización de deseos' },
  { simbolo: 'ᚺ', nombre: 'Hagalaz', significado: 'Ruptura necesaria, liberación, crisis transformadora' },
  { simbolo: 'ᚾ', nombre: 'Nauthiz', significado: 'Necesidad, resistencia, paciencia, aprendizaje del dolor' },
  { simbolo: 'ᛁ', nombre: 'Isa', significado: 'Quietud, reflexión, espera, pausa necesaria' },
  { simbolo: 'ᛃ', nombre: 'Jera', significado: 'Ciclos, cosecha, recompensa, el fruto del esfuerzo' },
  { simbolo: 'ᛇ', nombre: 'Eihwaz', significado: 'Resistencia, protección, conexión entre mundos' },
  { simbolo: 'ᛈ', nombre: 'Perthro', significado: 'Misterio, destino, revelación, lo oculto que emerge' },
  { simbolo: 'ᛉ', nombre: 'Algiz', significado: 'Protección divina, despertar espiritual, santuario' },
  { simbolo: 'ᛊ', nombre: 'Sowilo', significado: 'Sol, victoria, energía vital, triunfo garantizado' },
  { simbolo: 'ᛏ', nombre: 'Tiwaz', significado: 'Justicia, honor, sacrificio noble, guerrero interior' },
  { simbolo: 'ᛒ', nombre: 'Berkano', significado: 'Renacimiento, fertilidad, crecimiento, lo femenino' },
  { simbolo: 'ᛖ', nombre: 'Ehwaz', significado: 'Movimiento, progreso, confianza, alianzas' },
  { simbolo: 'ᛗ', nombre: 'Mannaz', significado: 'Humanidad, identidad, cooperación, el yo verdadero' },
  { simbolo: 'ᛚ', nombre: 'Laguz', significado: 'Intuición, flujo emocional, lo inconsciente, sueños' },
  { simbolo: 'ᛜ', nombre: 'Ingwaz', significado: 'Fertilidad, potencial, hogar, semilla de lo nuevo' },
  { simbolo: 'ᛞ', nombre: 'Dagaz', significado: 'Amanecer, claridad, transformación total, despertar' },
  { simbolo: 'ᛟ', nombre: 'Othala', significado: 'Herencia, hogar, ancestros, lo que te pertenece' }
];

function seleccionarRunas(cantidad = 3) {
  const seleccionadas = [];
  const indices = [];
  
  while (seleccionadas.length < cantidad) {
    const idx = Math.floor(Math.random() * RUNAS.length);
    if (!indices.includes(idx)) {
      indices.push(idx);
      seleccionadas.push(RUNAS[idx]);
    }
  }
  
  return seleccionadas;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { token, pregunta, usarGratis, gratis } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    // CORREGIDO: Primero buscar el email del token
    const email = await kv.get(`token:${token}`);
    
    if (!email) {
      return res.status(404).json({ error: 'Token inválido' });
    }

    // Luego buscar el elegido con el email
    const elegidoKey = `elegido:${email}`;
    const elegido = await kv.get(elegidoKey);

    if (!elegido) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si puede usar tirada gratis o tiene runas
    const COSTO_TIRADA = 10;
    const puedeUsarGratis = !elegido.tiradaGratisUsada && (usarGratis || gratis);
    
    if (!puedeUsarGratis) {
      if (typeof elegido.runas !== 'number') {
        elegido.runas = 0;
      }
      
      if (elegido.runas < COSTO_TIRADA) {
        return res.status(400).json({ 
          error: 'Runas insuficientes',
          runas: elegido.runas,
          costo: COSTO_TIRADA
        });
      }
    }

    // Seleccionar 3 runas
    const runasSeleccionadas = seleccionarRunas(3);
    
    // Generar interpretación con Claude
    const prompt = `Sos el Oráculo de la Ciudad Alquimista de Piriápolis, Uruguay. Una persona acaba de tirar las runas del Futhark y cayeron estas tres:

**Primera runa:** ${runasSeleccionadas[0].simbolo} ${runasSeleccionadas[0].nombre} - ${runasSeleccionadas[0].significado}
**Segunda runa:** ${runasSeleccionadas[1].simbolo} ${runasSeleccionadas[1].nombre} - ${runasSeleccionadas[1].significado}
**Tercera runa:** ${runasSeleccionadas[2].simbolo} ${runasSeleccionadas[2].nombre} - ${runasSeleccionadas[2].significado}

${pregunta ? `La persona preguntó: "${pregunta}"` : 'La persona pidió guía general para su momento actual.'}

**Información de la persona:**
- Nombre: ${elegido.nombrePreferido || elegido.nombre}
- Pronombre: ${elegido.pronombre || 'ella'}

**Tu tarea:**
Escribí una interpretación de esta tirada de runas. Mínimo 300 palabras.

**Lineamientos:**
- Hablale de vos (tuteo rioplatense)
- Interpretá la combinación de las tres runas como una narrativa
- Si hay pregunta específica, respondela directamente
- Sé profundo pero accesible, místico pero práctico
- No predecir eventos específicos, iluminar el camino
- Terminá con un mensaje de empoderamiento
- NO uses frases como "ancestrales susurros" o "místicas brumas" - sé directo
- Usá el nombre de la persona al menos una vez`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const interpretacion = message.content[0].text;

    // Descontar runas o marcar gratis usada
    if (puedeUsarGratis) {
      elegido.tiradaGratisUsada = true;
    } else {
      elegido.runas -= COSTO_TIRADA;
    }

    // Guardar lectura en historial
    if (!elegido.lecturas) {
      elegido.lecturas = [];
    }

    const nuevaLectura = {
      id: `tirada-${Date.now()}`,
      tipo: 'Tirada de Runas',
      fecha: new Date().toISOString(),
      pregunta: pregunta || 'Guía general',
      runas: runasSeleccionadas.map(r => ({
        simbolo: r.simbolo,
        nombre: r.nombre
      })),
      contenido: interpretacion,
      gratis: puedeUsarGratis
    };

    elegido.lecturas.unshift(nuevaLectura);
    elegido.updatedAt = new Date().toISOString();

    await kv.set(elegidoKey, elegido);

    return res.status(200).json({
      success: true,
      runas: runasSeleccionadas,
      interpretacion,
      gratis: puedeUsarGratis,
      runasRestantes: elegido.runas
    });

  } catch (error) {
    console.error('Error en tirada de runas:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
