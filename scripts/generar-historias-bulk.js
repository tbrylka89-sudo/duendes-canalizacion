#!/usr/bin/env node

/**
 * Script para generar historias de todos los guardianes
 * Usa Claude API directamente para generar contenido único
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

// Cargar API key desde .env.local o .env
function cargarApiKey() {
  const archivos = ['.env.local', '.env'];
  for (const archivo of archivos) {
    const ruta = path.join(process.cwd(), archivo);
    if (fs.existsSync(ruta)) {
      const contenido = fs.readFileSync(ruta, 'utf-8');
      const match = contenido.match(/ANTHROPIC_API_KEY=["']?([^"'\n]+)["']?/);
      if (match) return match[1];
    }
  }
  return process.env.ANTHROPIC_API_KEY;
}

// Configuración
const ANTHROPIC_API_KEY = cargarApiKey();
const OUTPUT_FILE = path.join(process.cwd(), 'historias-generadas-output.json');
const PRODUCTOS_CSV = '/Users/usuario/Desktop/productos-completar-accesorios.csv';

// Accesorios por defecto según categoría
const ACCESORIOS_POR_CATEGORIA = {
  'Protección': ['escudo de cuarzo ahumado', 'amuleto de obsidiana', 'capa protectora', 'piedra turmalina negra', 'espada diminuta', 'medallón guardián'],
  'Abundancia': ['monedas doradas', 'saco de prosperidad', 'trébol de cuatro hojas', 'cuarzo citrino', 'llave dorada', 'cofre diminuto', 'pirita'],
  'Amor': ['corazón de cuarzo rosa', 'pétalos de rosa', 'lazo rojo del destino', 'rodocrosita', 'pluma de cisne'],
  'Sanación': ['cristal de cuarzo verde', 'hierbas medicinales', 'vial de agua sagrada', 'amatista', 'bolsa de hierbas'],
  'Salud': ['frasco de esencia vital', 'hoja de eucalipto', 'cuarzo verde', 'agua de manantial', 'semillas de vida'],
  'Sabiduría': ['libro antiguo', 'cristal de amatista', 'báculo de conocimiento', 'ojo que todo lo ve', 'pergamino', 'llave de plata', 'piedra lunar']
};

// System prompt actualizado
const SYSTEM_PROMPT = `Sos el escriba de Duendes del Uruguay. NOSOTROS (el equipo canalizador) presentamos a cada ser.

═══════════════════════════════════════════════════════════════
⛔ ESTO ESTÁ MAL - NUNCA ESCRIBIR ASÍ:
═══════════════════════════════════════════════════════════════

MAL: "Hay personas que se convirtieron en el refugio de todos..."
MAL: "Yo fui el duende que decía sí a todo..."
MAL: "Mi trabajo es recordarte cada día..."
MAL: "En lo profundo del bosque, entre las brumas ancestrales..."

El duende NO HABLA en primera persona (excepto en su mensaje canalizado). NOSOTROS lo presentamos.

═══════════════════════════════════════════════════════════════
✅ FORMATO CORRECTO:
═══════════════════════════════════════════════════════════════

Este es [nombre]. Tiene [edad] años y es un [tipo] de [propósito].

Nos contó que [historia en tercera persona].

[SINCRODESTINO: algo mágico que pasó durante la canalización]

Le encanta [2-3 cosas]. No tolera [1-2 cosas].

Su especialidad: [una línea potente]

**QUÉ TE APORTA [NOMBRE]:**
- [Poder de sus accesorios: qué hace cada cristal/amuleto]
- [Beneficio concreto 1]
- [Beneficio concreto 2]

**CÓMO NACIÓ [NOMBRE] - El trabajo de canalización:**
[Párrafo detallado sobre: sincronicidades ANTES de crearlo, el momento energético cuando surgió, cuánto tiempo llevó (varía según tamaño), si hubo pausas porque el ser las pidió, el trabajo artesanal a mano, que cada rostro es único. Para minis/especiales: aclarar que se recrean pero cada uno elige a su persona.]

**Lo que [nombre] nos pidió que te digamos:**
*"[Mensaje en primera persona del duende, 2-3 oraciones directas al alma]"*

Si esto te hizo algo, [nombre] ya te eligió.

═══════════════════════════════════════════════════════════════
REGLAS OBLIGATORIAS:
═══════════════════════════════════════════════════════════════

1. SIEMPRE empezar con: "Este/a es [nombre]. Tiene [edad] años y es..."
2. SIEMPRE incluir SINCRODESTINO: algo mágico durante la canalización
3. SIEMPRE usar "Nos contó que...", "Cuando lo/la canalizamos...", "Percibimos que..."
4. SIEMPRE incluir qué le gusta y qué no tolera
5. SIEMPRE incluir "**QUÉ TE APORTA [NOMBRE]:**" con poderes de accesorios
6. SIEMPRE incluir "**CÓMO NACIÓ [NOMBRE]:**" detallado
7. SIEMPRE terminar con "Si esto te hizo algo, [nombre] ya te eligió"
8. El ÚNICO momento en primera persona es el mensaje canalizado entre comillas

SOBRE LAS PIXIES:
- Son almas salvajes del bosque, tiernas, hermosas, eternamente jóvenes
- No son duendes comunes, son seres de naturaleza pura
- Tienen conexión especial con flores y plantas

TIEMPO DE CREACIÓN (mencionar en "Cómo nació"):
- Mini (10cm): 1-2 semanas de trabajo
- Especial (10cm): 2-3 semanas, más detallado
- Mediano (18cm): 3-4 semanas
- Grande (25cm): 1-2 meses
- Gigante: varios meses

PARA MINIS Y ESPECIALES:
- Son recreables (pueden existir otros similares)
- PERO cada rostro es único, moldeado a mano
- El que está en la foto es referencia - el tuyo tendrá su propia expresión
- La magia está en dejarte elegir por el que resuene con vos

VARIEDAD DE INTENSIDAD:
- Algunos guardianes son INTENSOS: prometen lluvia de abundancia, negocios explotando, suerte desbordante
- Otros son más sutiles: protección silenciosa, compañía, guía suave
- Para ABUNDANCIA: algunos deben ser POTENTES - "hace llover dinero", "dispara negocios"

NUNCA:
- Escribir desde el duende ("Yo soy...", "Mi trabajo es...")
- Usar "este duende canalizado" - tiene NOMBRE
- Párrafos de más de 4 líneas
- Más de 400 palabras total
- Diminutivos (-ito/-ita)
- Frases de IA ("En lo profundo del bosque", "entre las brumas")
- NUNCA nombres individuales (Thibisay, Gabriel) - siempre "nosotros", "el equipo", "en el taller"

Español rioplatense: vos, tenés, sentís, podés`;

// Cargar productos del CSV
function cargarProductos() {
  const contenido = fs.readFileSync(PRODUCTOS_CSV, 'utf-8');
  const lineas = contenido.trim().split('\n');
  const headers = lineas[0].split(';');

  const productos = [];
  for (let i = 1; i < lineas.length; i++) {
    if (!lineas[i].trim()) continue;

    const valores = lineas[i].split(';');
    const producto = {};
    headers.forEach((h, idx) => {
      producto[h.trim()] = valores[idx]?.trim() || '';
    });

    // Excluir Rasiel y Altair (adoptados)
    if (producto.NOMBRE === 'Rasiel' || producto.NOMBRE === 'Altair') {
      console.log(`⏭️  Saltando ${producto.NOMBRE} (ya adoptado)`);
      continue;
    }

    productos.push(producto);
  }

  return productos;
}

// Obtener accesorios aleatorios para una categoría
function obtenerAccesorios(categoria, esPixie) {
  const accesoriosCategoria = ACCESORIOS_POR_CATEGORIA[categoria] || ACCESORIOS_POR_CATEGORIA['Protección'];

  // Seleccionar 2-3 accesorios aleatorios
  const cantidad = Math.floor(Math.random() * 2) + 2; // 2 o 3
  const seleccionados = [];
  const disponibles = [...accesoriosCategoria];

  for (let i = 0; i < cantidad && disponibles.length > 0; i++) {
    const idx = Math.floor(Math.random() * disponibles.length);
    seleccionados.push(disponibles.splice(idx, 1)[0]);
  }

  // Si es pixie, agregar algo floral
  if (esPixie) {
    const florales = ['corona de flores', 'pétalos mágicos', 'semillas de luz', 'rocío de luna'];
    seleccionados.push(florales[Math.floor(Math.random() * florales.length)]);
  }

  return seleccionados.join(', ');
}

// Determinar tipo de ser
function determinarTipo(nombre, genero, categoria) {
  const esPixie = nombre.toLowerCase().includes('pixie');

  if (esPixie) {
    return 'Pixie';
  }

  const tiposMasculinos = ['Duende', 'Gnomo', 'Guardián', 'Elfo'];
  const tiposFemeninos = ['Hada', 'Guardiana', 'Ninfa', 'Elfa'];

  // Algunos nombres especiales
  if (nombre === 'Merlin' || nombre === 'Morgana') return genero === 'F' ? 'Hechicera' : 'Mago';
  if (nombre === 'Leprechaun') return 'Duende Leprechaun';
  if (categoria === 'Sabiduría') {
    return genero === 'F' ? 'Guardiana de la Sabiduría' : 'Guardián de la Sabiduría';
  }

  const tipos = genero === 'F' ? tiposFemeninos : tiposMasculinos;
  return tipos[Math.floor(Math.random() * tipos.length)];
}

// Generar prompt para un producto
function generarPrompt(producto) {
  const nombre = producto.NOMBRE;
  const genero = producto.GENERO === 'F' ? 'femenino' : 'masculino';
  const categoria = producto.CATEGORIA;
  const tamano = producto.TAMANO;
  const tamanoCm = producto.TAMANO_CM;
  const esPixie = nombre.toLowerCase().includes('pixie');

  const tipo = determinarTipo(nombre, producto.GENERO, categoria);
  const accesorios = producto.ACCESORIOS || obtenerAccesorios(categoria, esPixie);

  // Instrucciones especiales según categoría
  let instruccionesEspeciales = '';

  if (categoria === 'Abundancia') {
    const intensidad = Math.random();
    if (intensidad > 0.5) {
      instruccionesEspeciales = `
⚡ ESTE GUARDIÁN ES INTENSO CON LA ABUNDANCIA:
- Promete hacer LLOVER el dinero
- Dispara negocios, abre puertas cerradas
- No es tibio - es POTENTE
- Su mensaje debe ser directo sobre prosperidad
- Incluir frases como "la abundancia te persigue" o "el dinero fluye hacia vos"`;
    }
  }

  if (esPixie) {
    instruccionesEspeciales += `
🌸 ESTA ES UNA PIXIE:
- Alma salvaje del bosque, tierna, eternamente joven
- Conexión profunda con la naturaleza y las flores
- Su energía es ligera pero poderosa
- Traviesa y amorosa a la vez`;
  }

  if (tamano === 'grande' || tamano === 'gigante') {
    instruccionesEspeciales += `
👑 PIEZA ÚNICA E IRREPETIBLE:
- Enfatizar que es ÚNICO en el universo
- Una vez adoptado, desaparece para siempre
- Para coleccionistas serios, almas que entienden lo irrepetible
- El trabajo de creación llevó mucho tiempo (mencionar 1-2 meses mínimo)`;
  }

  if (tamano === 'mini' || tamano === 'especial') {
    instruccionesEspeciales += `
✨ SER RECREABLE:
- Se pueden hacer otros similares
- PERO cada rostro es único, moldeado a mano
- El de la foto es referencia - el tuyo tendrá su propia expresión
- La magia está en dejarte elegir por el que resuene
- Hacerlo emocionante: "¿Cuál te elegirá a vos?"`;
  }

  return `GENERÁ LA HISTORIA DE: ${nombre}

DATOS DEL SER:
- Nombre: ${nombre}
- Tipo: ${tipo}
- Género: ${genero}
- Propósito/Categoría: ${categoria}
- Tamaño: ${tamano} (${tamanoCm}cm)
- Accesorios: ${accesorios}

${instruccionesEspeciales}

DEVOLVÉ SOLO LA HISTORIA EN TEXTO PLANO (no JSON), siguiendo EXACTAMENTE el formato del system prompt.
Empezá directamente con "${genero === 'femenino' ? 'Esta es' : 'Este es'} ${nombre}. Tiene..."`;
}

// Generar historia con Claude
async function generarHistoria(cliente, producto, indice, total) {
  const prompt = generarPrompt(producto);
  const genero = producto.GENERO === 'F' ? 'femenino' : 'masculino';
  const nombre = producto.NOMBRE;

  console.log(`\n📝 [${indice + 1}/${total}] Generando historia para ${nombre}...`);

  try {
    const response = await cliente.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.6,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: prompt },
        { role: 'assistant', content: `${genero === 'femenino' ? 'Esta es' : 'Este es'} ${nombre}. Tiene` }
      ]
    });

    const textoRespuesta = response.content?.[0]?.text || '';
    const historiaCompleta = `${genero === 'femenino' ? 'Esta es' : 'Este es'} ${nombre}. Tiene${textoRespuesta}`;

    console.log(`✅ Historia generada para ${nombre} (${historiaCompleta.length} caracteres)`);

    return {
      nombre: nombre,
      genero: genero,
      categoria: producto.CATEGORIA,
      tamano: producto.TAMANO,
      tamanoCm: producto.TAMANO_CM,
      historia: historiaCompleta,
      generadoEn: new Date().toISOString()
    };

  } catch (error) {
    console.error(`❌ Error generando historia para ${nombre}:`, error.message);
    return {
      nombre: nombre,
      error: error.message,
      generadoEn: new Date().toISOString()
    };
  }
}

// Función principal
async function main() {
  if (!ANTHROPIC_API_KEY) {
    console.error('❌ Falta ANTHROPIC_API_KEY en las variables de entorno');
    process.exit(1);
  }

  console.log('🧙 Generador de Historias de Guardianes');
  console.log('═══════════════════════════════════════\n');

  // Cargar productos
  const productos = cargarProductos();
  console.log(`📦 ${productos.length} productos a procesar\n`);

  // Cargar progreso anterior si existe
  let resultados = { productos: [], generados: 0, total: productos.length, fecha: new Date().toISOString() };
  let productosYaGenerados = new Set();

  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      const anterior = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
      resultados = anterior;
      anterior.productos.forEach(p => {
        if (p.historia && !p.error) {
          productosYaGenerados.add(p.nombre);
        }
      });
      console.log(`📂 Continuando desde progreso anterior: ${productosYaGenerados.size} ya generados\n`);
    } catch (e) {
      console.log('📂 Iniciando desde cero\n');
    }
  }

  // Crear cliente Anthropic
  const cliente = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  // Procesar productos
  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];

    // Saltar si ya fue generado
    if (productosYaGenerados.has(producto.NOMBRE)) {
      console.log(`⏭️  [${i + 1}/${productos.length}] ${producto.NOMBRE} ya generado, saltando...`);
      continue;
    }

    const resultado = await generarHistoria(cliente, producto, i, productos.length);

    // Buscar si ya existe en resultados y actualizar, o agregar nuevo
    const existeIdx = resultados.productos.findIndex(p => p.nombre === resultado.nombre);
    if (existeIdx >= 0) {
      resultados.productos[existeIdx] = resultado;
    } else {
      resultados.productos.push(resultado);
    }

    if (!resultado.error) {
      resultados.generados++;
    }

    // Guardar progreso después de cada generación
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(resultados, null, 2));

    // Pausa entre requests para no sobrecargar la API
    if (i < productos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Generación completada!`);
  console.log(`📊 ${resultados.generados}/${resultados.total} historias generadas`);
  console.log(`📁 Resultados guardados en: ${OUTPUT_FILE}`);
}

main().catch(console.error);
