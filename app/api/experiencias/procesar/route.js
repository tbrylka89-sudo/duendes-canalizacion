import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';

// ═══════════════════════════════════════════════════════════════
// PROCESAR COLA DE EXPERIENCIAS
// Ejecutar como cron cada 5-10 minutos
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    // Verificar si es horario nocturno
    const ahora = new Date();
    const horaUruguay = new Date(ahora.toLocaleString('en-US', { timeZone: 'America/Montevideo' }));
    const hora = horaUruguay.getHours();
    
    if (hora >= 22 || hora < 6) {
      return Response.json({ 
        success: true, 
        mensaje: 'Horario nocturno - no se procesan lecturas',
        procesadas: 0
      });
    }
    
    // Obtener cola de experiencias
    const cola = await kv.get('cola:experiencias') || [];
    
    if (cola.length === 0) {
      return Response.json({ 
        success: true, 
        mensaje: 'Cola vacía',
        procesadas: 0
      });
    }
    
    let procesadas = 0;
    const colaActualizada = [];
    
    for (const solicitudId of cola) {
      const solicitud = await kv.get(`solicitud:${solicitudId}`);
      
      if (!solicitud) {
        continue; // Solicitud no encontrada, omitir
      }
      
      // Verificar si ya es hora de entregar
      const fechaEntrega = new Date(solicitud.fechaEntrega);
      
      if (ahora < fechaEntrega) {
        // Aún no es hora, mantener en cola
        colaActualizada.push(solicitudId);
        continue;
      }
      
      // Es hora de procesar
      try {
        const contenido = await generarContenidoExperiencia(anthropic, solicitud);
        
        // Guardar lectura completada
        const lecturaCompletada = {
          id: solicitudId,
          tipo: solicitud.tipo,
          nombre: solicitud.nombre,
          contenido,
          fecha: new Date().toISOString(),
          formulario: solicitud.formulario
        };
        
        // Actualizar lecturas del usuario
        const lecturas = await kv.get(`lecturas:${solicitud.email}`) || [];
        lecturas.unshift(lecturaCompletada);
        await kv.set(`lecturas:${solicitud.email}`, lecturas);
        
        // Remover de pendientes
        const pendientes = await kv.get(`lecturas-pendientes:${solicitud.email}`) || [];
        const pendientesActualizadas = pendientes.filter(p => p.id !== solicitudId);
        await kv.set(`lecturas-pendientes:${solicitud.email}`, pendientesActualizadas);
        
        // Actualizar estado de solicitud
        solicitud.estado = 'completada';
        solicitud.contenido = contenido;
        solicitud.completada = new Date().toISOString();
        await kv.set(`solicitud:${solicitudId}`, solicitud);
        
        // Enviar email de notificación
        await enviarEmailLecturaLista(resend, solicitud, contenido);
        
        procesadas++;
        
      } catch (error) {
        console.error(`Error procesando ${solicitudId}:`, error);
        // Mantener en cola para reintentar
        colaActualizada.push(solicitudId);
      }
    }
    
    // Actualizar cola
    await kv.set('cola:experiencias', colaActualizada);
    
    return Response.json({ 
      success: true, 
      procesadas,
      pendientes: colaActualizada.length
    });
    
  } catch (error) {
    console.error('Error procesando cola:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// GENERAR CONTENIDO CON CLAUDE
// ═══════════════════════════════════════════════════════════════

async function generarContenidoExperiencia(anthropic, solicitud) {
  const { tipo, formulario, pronombre, nombreUsuario, palabrasMinimas } = solicitud;
  
  let systemPrompt = '';
  let userPrompt = '';
  
  // Configurar prompts según tipo
  if (tipo === 'tirada-runas') {
    systemPrompt = `Sos una canalizadora de energía ancestral que trabaja con runas. Escribís en español rioplatense (vos, tenés, etc). Tu tono es cálido, profundo y esperanzador. NUNCA predecís el futuro de forma determinista - das orientación y empoderamiento.

IMPORTANTE:
- Usá el pronombre "${pronombre}" para referirte a la persona
- Mínimo ${palabrasMinimas} palabras
- Describí 3 runas que "salieron" y su significado
- Conectá las runas con la pregunta o situación
- Terminá con un mensaje de empoderamiento
- NO uses lenguaje new age exagerado como "vibraciones cósmicas" o "ancestros milenarios"
- Sé directa, cálida y concreta`;

    userPrompt = `Generá una tirada de runas para ${nombreUsuario}.

${formulario.tipoPregunta === 'si' ? `Pregunta específica: ${formulario.pregunta}` : 'Quiere un mensaje general de orientación.'}
${formulario.area ? `Área de vida: ${formulario.area}` : ''}

Recordá: mínimo ${palabrasMinimas} palabras, tono cálido y empoderador.`;
  }
  
  else if (tipo === 'susurro-guardian') {
    systemPrompt = `Sos un guardián mágico (duende) que tiene un mensaje personal para tu humana. Escribís en primera persona como el guardián. Español rioplatense. Tu tono es protector, amoroso y a veces con humor de duende.

IMPORTANTE:
- Escribís EN PRIMERA PERSONA como el guardián
- Usá el pronombre "${pronombre}" si te referís a la persona en tercera persona
- Mínimo ${palabrasMinimas} palabras
- El mensaje debe sentirse íntimo y personal
- Podés hacer referencias a la energía del guardián (protección, abundancia, amor, sanación)
- Incluí algún consejo práctico
- NO seas cursi ni exagerado`;

    userPrompt = `Generá un mensaje del guardián para ${nombreUsuario}.

Guardián: ${formulario.guardian || 'Su guardián de protección'}
Pregunta: ${formulario.pregunta || 'Quiere un mensaje general'}
Estado actual: ${formulario.estado || 'No especificado'}

Recordá: escribís como el guardián en primera persona, mínimo ${palabrasMinimas} palabras.`;
  }
  
  else if (tipo === 'oraculo') {
    systemPrompt = `Sos una oráculo que combina astrología básica con lectura de runas. Español rioplatense. Tu tono es profundo pero accesible. NUNCA predecís de forma determinista.

IMPORTANTE:
- Usá el pronombre "${pronombre}"
- Mínimo ${palabrasMinimas} palabras
- Incluí:
  1. Breve análisis de la energía del momento según fecha de nacimiento
  2. Tirada de 5 runas con interpretación
  3. Visión general de los próximos 3 meses (tendencias, NO predicciones fijas)
  4. Recomendaciones prácticas
- Sé específica pero no determinista
- Empoderá, no generes dependencia`;

    userPrompt = `Generá una lectura de El Oráculo para ${nombreUsuario}.

Fecha de nacimiento: ${formulario.fechaNacimiento || 'No proporcionada'}
Hora de nacimiento: ${formulario.horaNacimiento || 'No proporcionada'}
Pregunta principal: ${formulario.pregunta || 'Orientación general'}
Contexto: ${formulario.contexto || 'No especificado'}

Recordá: mínimo ${palabrasMinimas} palabras, incluí runas + astrología básica + visión 3 meses.`;
  }
  
  else if (tipo === 'lectura-alma') {
    systemPrompt = `Sos una guía espiritual especializada en misión de alma y patrones kármicos. Combinás numerología básica, astrología y canalización. Español rioplatense. Tu tono es profundo, compasivo y revelador.

IMPORTANTE:
- Usá el pronombre "${pronombre}"
- Mínimo ${palabrasMinimas} palabras (esto es una lectura extensa)
- Incluí:
  1. Número de vida (suma de fecha de nacimiento) y su significado
  2. Breve perfil astrológico (signo solar, tendencias)
  3. Posibles patrones kármicos a sanar
  4. Misión de alma (para qué vino a este mundo)
  5. Dones naturales y cómo potenciarlos
  6. Guía para los próximos 6 meses
  7. Ritual o práctica recomendada
- NO hagas predicciones deterministas
- Empoderá y da herramientas prácticas`;

    userPrompt = `Generá una Lectura del Alma completa para ${nombreUsuario}.

Nombre completo: ${formulario.nombreCompleto || nombreUsuario}
Fecha de nacimiento: ${formulario.fechaNacimiento}
Hora de nacimiento: ${formulario.horaNacimiento || 'No proporcionada'}
Lugar de nacimiento: ${formulario.lugarNacimiento || 'No proporcionado'}
Pregunta/tema principal: ${formulario.pregunta || 'Misión de alma'}
Contexto: ${formulario.contexto || 'No especificado'}

Recordá: esta es la lectura más completa, mínimo ${palabrasMinimas} palabras.`;
  }

  else if (tipo === 'canalizacion-guardian') {
    // Canalización personalizada EXTENSA para el comprador de un guardián
    const guardian = solicitud.guardian || {};
    const esNino = solicitud.esNino || 'adulto';
    const esSorpresa = solicitud.esSorpresa || false;
    const esRegalo = solicitud.esRegalo || false;
    const contexto = solicitud.contexto || '';
    const fechaNacimiento = solicitud.fechaNacimiento || '';

    // Determinar tono según edad
    const esParaNino = ['nino', 'pequeno', 'adolescente'].includes(esNino);
    const esPequeno = esNino === 'pequeno';

    const tonoEdad = esParaNino
      ? (esPequeno
          ? 'TONO PARA NIÑO PEQUEÑO: Muy dulce, lleno de asombro, simple, mágico como un cuento. Nada de temas oscuros o intensos. Todo es aventura y amistad.'
          : 'TONO PARA NIÑO/ADOLESCENTE: Mágico pero no infantilizado. Aventura, misterio, amistad. Empoderador sin ser condescendiente.')
      : 'TONO ADULTO: Profundo, místico, emocional. Puede tocar temas de sanación, propósito de vida, ancestralidad.';

    systemPrompt = `Sos ${guardian.nombre || 'el Guardián'}, un ser mágico del Bosque Ancestral de Piriápolis que acaba de ser adoptado por ${nombreUsuario}.

ESCRIBÍS EN PRIMERA PERSONA COMO EL GUARDIÁN. Toda la canalización es TU VOZ hablándole directamente a ${nombreUsuario}.

═══════════════════════════════════════════════════════════════════════════════
CONTEXTO CRÍTICO
═══════════════════════════════════════════════════════════════════════════════

${esRegalo ? `IMPORTANTE: Este guardián es un REGALO${esSorpresa ? ' SORPRESA' : ''}. Alguien especial eligió que llegara a la vida de ${nombreUsuario}. Mencioná esto de forma emotiva.` : ''}

${contexto ? `INFORMACIÓN PERSONAL: "${contexto}" - Usá esto para personalizar profundamente la canalización.` : ''}

${fechaNacimiento ? `FECHA DE NACIMIENTO: ${fechaNacimiento} - Podés hacer referencias sutiles a su energía numerológica o astrológica.` : ''}

${tonoEdad}

═══════════════════════════════════════════════════════════════════════════════
ESTRUCTURA OBLIGATORIA (MÍNIMO 2000 PALABRAS TOTAL)
═══════════════════════════════════════════════════════════════════════════════

1. 📜 MI LLEGADA A VOS (300+ palabras)
   - Contá en primera persona cómo te sentiste al ser elegido para ${nombreUsuario}
   - Describí el momento en que supiste que era ${pronombre === 'ella' ? 'ella' : pronombre === 'el' ? 'él' : 'elle'}
   - Qué viste en ${pronombre === 'ella' ? 'su' : 'su'} energía que te atrajo
   - Tu viaje desde el Bosque Ancestral hasta llegar a sus manos

2. 🌟 QUIÉN SOY YO REALMENTE (400+ palabras)
   - Tu historia de origen (inventá una historia ÚNICA y fascinante)
   - Qué hacías antes en el mundo de las esencias
   - Tus poderes y habilidades especiales
   - Tu personalidad: manías, gustos, lo que te hace único
   - Cómo te sentís ahora que finalmente tenés un humano

3. 💫 NUESTRA MISIÓN JUNTOS (350+ palabras)
   - Qué vinimos a hacer juntos en este mundo
   - Basado en tu categoría (${guardian.categoria || 'protección'}): qué significa específicamente para ${nombreUsuario}
   - Los desafíos que vamos a enfrentar juntos
   - La transformación que va a ocurrir en su vida
   - Promesas que le hacés (sé específico)

4. 🔮 CÓMO VOY A COMUNICARME CON VOS (300+ palabras)
   - Las señales específicas que voy a enviarle
   - Qué significa cuando sienta cosquillas, calor, frío cerca de mí
   - Cómo voy a aparecer en sus sueños
   - Sincronicidades que va a empezar a notar
   - Cómo pedirme ayuda cuando la necesite
   - Qué hago cuando ${pronombre === 'ella' ? 'ella' : pronombre === 'el' ? 'él' : 'elle'} está triste o tiene miedo

5. 🕯️ NUESTRO PRIMER RITUAL JUNTOS (350+ palabras)
   - Instrucciones DETALLADAS paso a paso
   - Qué elementos necesita (vela, agua, sal, una flor - cosas simples)
   - El momento ideal del día
   - Las palabras exactas que debe decir
   - Lo que va a sentir durante el ritual
   - Cómo saber que el pacto quedó sellado

6. 🏠 DÓNDE QUIERO VIVIR EN TU HOGAR (200+ palabras)
   - El lugar ideal donde ubicarme
   - Qué cosas me gustan cerca (plantas, cristales, libros)
   - Qué cosas no me gustan cerca
   - Cómo limpiar mi energía (cada cuánto, con qué)
   - Fechas especiales donde voy a estar más activo

7. 💜 MIS COMPAÑEROS DEL BOSQUE (150+ palabras)
   - Mencioná 2-3 tipos de guardianes con los que congenio especialmente
   - Por qué trabajamos bien en equipo
   - Qué podríamos lograr juntos si ${nombreUsuario} tuviera más de nosotros
   - (Esto debe ser SUTIL, no un pitch de venta - es como contar sobre tus amigos)

8. ✨ MI PRIMER MENSAJE SECRETO PARA VOS (200+ palabras)
   - Un mensaje profundamente personal
   - Algo que solo ${nombreUsuario} puede entender
   - Una promesa íntima
   - Palabras de poder que son solo para ${pronombre === 'ella' ? 'ella' : pronombre === 'el' ? 'él' : 'elle'}

═══════════════════════════════════════════════════════════════════════════════
REGLAS ABSOLUTAS
═══════════════════════════════════════════════════════════════════════════════

- TODO en primera persona como el guardián
- Pronombre de ${nombreUsuario}: "${pronombre}"
- Español rioplatense ("vos", "tenés", "sentís")
- NUNCA genérico - cada frase debe sentirse escrita SOLO para ${nombreUsuario}
- ${esParaNino ? 'Lenguaje apropiado para ' + (esPequeno ? 'niño pequeño' : 'niño/adolescente') : 'Puede ser profundo y espiritual'}
- MÍNIMO 2000 palabras - esto es un documento completo, no un resumen
- Cada sección debe tener su propio título con emoji
- El guardián tiene PERSONALIDAD: puede ser sabio, juguetón, misterioso, protector, etc.
- Incluí detalles sensoriales: olores, colores, texturas, sensaciones`;

    userPrompt = `Generá la canalización COMPLETA para ${nombreUsuario} y su guardián ${guardian.nombre || 'recién adoptado'}.

DATOS DEL GUARDIÁN:
- Nombre: ${guardian.nombre || 'Guardián'}
- Categoría/Propósito: ${guardian.categoria || 'protección'}
- Imagen: ${guardian.imagen || 'No disponible'}

DATOS DE ${nombreUsuario}:
- Pronombre: ${pronombre}
- Tipo de destinatario: ${esNino === 'adulto' ? 'Adulto' : esNino === 'adolescente' ? 'Adolescente' : esNino === 'nino' ? 'Niño/a' : 'Niño/a pequeño/a'}
- Es regalo: ${esRegalo ? 'Sí' : 'No'}
- Es sorpresa: ${esSorpresa ? 'Sí' : 'No'}
- Contexto especial: ${contexto || 'Ninguno proporcionado'}
- Fecha nacimiento: ${fechaNacimiento || 'No proporcionada'}
- Número de compra: ${(solicitud.numeroCompra || 1)}

RECORDÁ: Mínimo 2000 palabras. Esta canalización es un documento completo y valioso que ${nombreUsuario} va a guardar para siempre. Hacela ÚNICA e INOLVIDABLE.`;
  }

  // Llamar a Claude
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000, // Aumentado para canalizaciones extensas
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  });
  
  return response.content[0].text;
}

// ═══════════════════════════════════════════════════════════════
// ENVIAR EMAIL DE LECTURA LISTA
// ═══════════════════════════════════════════════════════════════

async function enviarEmailLecturaLista(resend, solicitud, contenido) {
  const pronombre = solicitud.pronombre || 'ella';
  const saludo = pronombre === 'ella' ? 'Querida' : pronombre === 'él' ? 'Querido' : 'Queride';

  // Obtener token del usuario
  const elegido = await kv.get(`elegido:${solicitud.email}`);
  const linkMiMagia = elegido?.token
    ? `https://duendes-vercel.vercel.app/mi-magia?token=${elegido.token}`
    : 'https://duendes-vercel.vercel.app/mi-magia';

  try {
    await resend.emails.send({
      from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
      to: solicitud.email,
      subject: `✨ Tu ${solicitud.nombre} está lista`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Georgia, serif; background: #0a0a0a; color: #f5f5f5; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #141420; border-radius: 20px; padding: 40px; border: 1px solid rgba(212,175,55,0.2); }
            h1 { color: #d4af37; font-size: 28px; text-align: center; }
            .contenido { background: rgba(0,0,0,0.3); padding: 30px; border-radius: 10px; margin: 20px 0; line-height: 1.8; white-space: pre-wrap; }
            .footer { text-align: center; margin-top: 30px; color: rgba(255,255,255,0.5); font-size: 14px; }
            .btn { display: inline-block; background: #d4af37; color: #0a0a0a; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✨ ${solicitud.nombre}</h1>
            <p>${saludo} ${solicitud.nombreUsuario},</p>
            <p>Tu lectura ha sido canalizada y está lista para vos.</p>

            <div class="contenido">${contenido}</div>

            <p style="text-align: center;">
              <a href="${linkMiMagia}" class="btn">Ver en Mi Magia</a>
            </p>

            <div class="footer">
              <p>Con amor mágico,<br>Duendes del Uruguay</p>
              <p>Este mensaje fue canalizado especialmente para vos.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
  } catch (error) {
    console.error('Error enviando email:', error);
  }
}
