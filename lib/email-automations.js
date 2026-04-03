/**
 * Duendes del Uruguay - Email Automation System
 * 18 emails across 4 sequences
 *
 * Sequences:
 * 1. post-adoption (7 days ritual, trigger: order_created)
 * 2. welcome (14 days onboarding, trigger: customer_created)
 * 3. post-shipping (delivery experience, trigger: fulfillment_created)
 * 4. re-engagement (win-back, trigger: cron 60+ days inactive)
 */

// Brand constants
const BRAND = {
  name: 'Duendes del Uruguay',
  senderEmail: 'info@duendesdeluruguay.com',
  senderName: 'Duendes del Uruguay',
  colors: {
    bg: '#080a06',
    container: '#0e110b',
    gold: '#C6A55A',
    cream: '#FAF8F4',
    gray: '#8a8a7a',
    darkGold: '#a8893e',
  },
  domains: {
    us: 'www.duendesdeluruguay.com',
    uy: 'uy.duendesdeluruguay.com',
  },
  signoff: '— Gabriel & Thibisay',
  shortSignoff: '— G & T',
};

function storeUrl(store) {
  if (store && store.includes('duendes-del-uruguay-3')) return `https://${BRAND.domains.uy}`;
  return `https://${BRAND.domains.us}`;
}

function emailWrapper(innerHtml, store) {
  const c = BRAND.colors;
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background-color:${c.bg};font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${c.bg};">
<tr><td align="center" style="padding:20px 10px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${c.container};border-radius:4px;overflow:hidden;">
<!-- Logo -->
<tr><td align="center" style="padding:40px 30px 20px;">
  <table role="presentation" cellpadding="0" cellspacing="0">
    <tr><td style="border-bottom:1px solid ${c.gold};padding-bottom:15px;">
      <span style="font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:6px;color:${c.gold};text-transform:uppercase;">DUENDES DEL URUGUAY</span>
    </td></tr>
  </table>
</td></tr>
<!-- Body -->
<tr><td style="padding:10px 40px 40px;color:${c.cream};font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;">
${innerHtml}
</td></tr>
<!-- Divider -->
<tr><td style="padding:0 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="border-top:1px solid ${c.gold};opacity:0.3;">&nbsp;</td></tr>
  </table>
</td></tr>
<!-- Footer -->
<tr><td align="center" style="padding:20px 40px 30px;">
  <p style="font-family:Georgia,'Times New Roman',serif;font-size:12px;color:${c.gray};line-height:1.5;margin:0;">
    ${BRAND.name}<br>
    <a href="${storeUrl(store)}" style="color:${c.gray};text-decoration:underline;">${store && store.includes('duendes-del-uruguay-3') ? BRAND.domains.uy : BRAND.domains.us}</a>
  </p>
  <p style="font-family:Georgia,'Times New Roman',serif;font-size:11px;color:${c.gray};margin:15px 0 0;">
    Si ya no querés recibir estos emails, podés <a href="${storeUrl(store)}/pages/unsubscribe?email={{email}}" style="color:${c.gray};text-decoration:underline;">darte de baja aquí</a>.
  </p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function ctaButton(text, url) {
  const c = BRAND.colors;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:30px auto;">
<tr><td align="center" style="background-color:${c.gold};border-radius:3px;">
  <a href="${url}" style="display:inline-block;padding:14px 36px;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:${c.bg};text-decoration:none;font-weight:bold;letter-spacing:1px;">${text}</a>
</td></tr>
</table>`;
}

function goldDivider() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:25px 0;">
<tr><td style="border-top:1px solid ${BRAND.colors.gold};opacity:0.2;">&nbsp;</td></tr>
</table>`;
}

// ============================================================
// SEQUENCE 1: POST-ADOPTION (trigger: order_created)
// ============================================================

const postAdoption = [
  {
    id: 'post-adoption-0',
    sequence: 'post-adoption',
    index: 0,
    delay_hours: 1,
    subject: 'El portal se abrió, {{name}}',
    preview_text: 'Tu ritual de siete días acaba de comenzar.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">El portal se abrió</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Esto que acabás de hacer no fue una compra. Fue una decisión. Y en el mundo de los duendes, las decisiones son portales.</p>

<p style="color:${BRAND.colors.cream};">A partir de este momento comienza un proceso de <strong style="color:${BRAND.colors.gold};">siete días</strong>. Durante este tiempo, tu guardián será canalizado especialmente para vos. Cada día te enviaremos un mensaje con una pequeña tarea o reflexión.</p>

<p style="color:${BRAND.colors.cream};">No es obligatorio hacerlas, pero quienes las hicieron nos dicen que el encuentro con su guardián fue mucho más intenso.</p>

${goldDivider()}

<p style="color:${BRAND.colors.gold};font-style:italic;text-align:center;font-size:18px;">Tu primera tarea:</p>

<p style="color:${BRAND.colors.cream};text-align:center;">Completá el formulario de conexión. Nos ayuda a canalizar a tu guardián con más precisión.</p>

${ctaButton('Completar formulario de conexión', storeUrl(store) + '/pages/formulario-canalizacion')}

<p style="color:${BRAND.colors.gray};font-size:14px;text-align:center;">El ritual empezó. No hay vuelta atrás.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
  {
    id: 'post-adoption-1',
    sequence: 'post-adoption',
    index: 1,
    delay_hours: 25,
    subject: 'Tu guardián empieza a tomar forma',
    preview_text: 'Día 2: algo está pasando.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">Día 2</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Mientras leés esto, algo está pasando. No es visible. No es ruidoso. Pero está pasando.</p>

<p style="color:${BRAND.colors.cream};">Tu guardián está empezando a tomar forma. No solo la forma física &mdash; esa la esculpimos con nuestras manos &mdash; sino la forma energética. La que conecta con vos.</p>

<p style="color:${BRAND.colors.cream};">Hay quienes dicen que en estos primeros días sueñan cosas extrañas. Otros sienten una calma inesperada. Otros simplemente se olvidan. Todo es parte del proceso.</p>

${goldDivider()}

<p style="color:${BRAND.colors.gold};font-style:italic;text-align:center;font-size:18px;">Tu tarea de hoy:</p>

<p style="color:${BRAND.colors.cream};text-align:center;">Antes de dormir, pensá en una sola palabra que represente lo que necesitás ahora mismo. No la escribas. Solo pensala. Tu guardián la va a escuchar.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
  {
    id: 'post-adoption-2',
    sequence: 'post-adoption',
    index: 2,
    delay_hours: 49,
    subject: 'La alquimia no se apura',
    preview_text: 'Día 3: tradiciones elementales.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">Día 3</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">En las tradiciones elementales de Uruguay, los guardianes no se fabrican: se despiertan. Cada pieza pasa por las manos de un canalizador que trabaja con arcilla, con fuego, con intención.</p>

<p style="color:${BRAND.colors.cream};">No usamos moldes. No hay dos iguales. Y no es un capricho estético &mdash; es porque cada guardián tiene un destino único. El tuyo solo puede ser tuyo.</p>

<p style="color:${BRAND.colors.cream};">La alquimia requiere tiempo. El barro necesita secarse. El fuego necesita arder. Y vos necesitás prepararte.</p>

${goldDivider()}

<p style="color:${BRAND.colors.gold};font-style:italic;text-align:center;font-size:18px;">Tu tarea de hoy:</p>

<p style="color:${BRAND.colors.cream};text-align:center;">Cerrá los ojos un momento y pensá en un lugar donde te sentís en paz. Un rincón de tu casa, un lugar de la infancia, un paisaje real o imaginario. Ese es el lugar donde tu guardián va a habitar. Empezá a prepararlo mentalmente.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
  {
    id: 'post-adoption-3',
    sequence: 'post-adoption',
    index: 3,
    delay_hours: 73,
    subject: 'A mitad de camino (y esto es lo que sienten otros)',
    preview_text: 'Día 4: testimonios del ritual.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">Día 4</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Estás a mitad de camino. Queríamos compartir algo con vos.</p>

<p style="color:${BRAND.colors.cream};">Esto es lo que nos escribió Valentina, de Montevideo, al tercer día de su ritual:</p>

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
<tr><td style="border-left:3px solid ${BRAND.colors.gold};padding:15px 20px;background-color:rgba(198,165,90,0.05);">
  <p style="color:${BRAND.colors.cream};font-style:italic;margin:0;font-size:17px;">&ldquo;No sé cómo explicarlo. Soñé con un ser pequeño que me miraba con una ternura que me hizo llorar. Cuando llegó el guardián y lo vi... era él. Era exactamente él.&rdquo;</p>
  <p style="color:${BRAND.colors.gold};font-size:13px;margin:10px 0 0;text-align:right;">&mdash; Valentina M., Montevideo</p>
</td></tr>
</table>

<p style="color:${BRAND.colors.cream};">No te contamos esto para generar expectativas. Te lo contamos para que sepas que lo que sentís (o lo que no sentís todavía) es completamente normal.</p>

${goldDivider()}

<p style="color:${BRAND.colors.gold};font-style:italic;text-align:center;font-size:18px;">Tu tarea de hoy:</p>

<p style="color:${BRAND.colors.cream};text-align:center;">Escuchá una canción que te emocione. La que sea. Ponela, cerrá los ojos, y dejá que suene. Tu guardián está escuchando con vos.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
  {
    id: 'post-adoption-4',
    sequence: 'post-adoption',
    index: 4,
    delay_hours: 97,
    subject: 'Algo que no te contamos hasta ahora',
    preview_text: 'Día 5: tu guardián tiene un nombre.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">Día 5</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Hay algo que no te contamos hasta ahora, porque no era el momento.</p>

<p style="color:${BRAND.colors.cream};"><strong style="color:${BRAND.colors.gold};">Tu guardián tiene un nombre.</strong></p>

<p style="color:${BRAND.colors.cream};">No es un nombre que nosotros elegimos. Es un nombre que aparece durante la canalización, como un susurro. A veces llega en el primer día. A veces tarda. Pero siempre llega.</p>

<p style="color:${BRAND.colors.cream};">Todavía no podemos revelártelo. El nombre se completa con el último paso del ritual, y recién lo vas a conocer cuando tu guardián esté listo.</p>

<p style="color:${BRAND.colors.cream};">Pero queríamos que supieras: ya tiene uno. Y es perfecto.</p>

${goldDivider()}

<p style="color:${BRAND.colors.gold};font-style:italic;text-align:center;font-size:18px;">Tu tarea de hoy:</p>

<p style="color:${BRAND.colors.cream};text-align:center;">Si pudieras hacerle una sola pregunta a tu guardián, ¿cuál sería? No la escribas en ningún lado. Solo formulala mentalmente, con claridad. Cuando lo conozcas, vas a tener la respuesta.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
  {
    id: 'post-adoption-5',
    sequence: 'post-adoption',
    index: 5,
    delay_hours: 121,
    subject: 'Preparate',
    preview_text: 'Día 6: el ritual está por completarse.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">Día 6</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Mañana termina el ritual. Mañana conocés a tu guardián.</p>

<p style="color:${BRAND.colors.cream};">Hoy no vamos a contarte nada sobre el proceso, ni sobre las tradiciones, ni sobre lo que otros sintieron. Hoy es un día de preparación interior.</p>

<p style="color:${BRAND.colors.cream};">Pensá en estos seis días. En la palabra que elegiste. En el lugar de paz. En la canción. En la pregunta. Todo eso fue tejiendo algo invisible entre vos y tu guardián.</p>

${goldDivider()}

<p style="color:${BRAND.colors.gold};font-style:italic;text-align:center;font-size:18px;">Tu última tarea antes del encuentro:</p>

<p style="color:${BRAND.colors.cream};text-align:center;">Limpiá el espacio donde vas a poner a tu guardián. No tiene que ser un altar ni nada elaborado. Solo un lugar limpio, tranquilo, que se sienta como suyo. Que esté listo para recibirlo.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
  {
    id: 'post-adoption-6',
    sequence: 'post-adoption',
    index: 6,
    delay_hours: 145,
    subject: 'Mañana se completa',
    preview_text: 'Día 7: el último día del ritual.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">Día 7</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Este es el último día.</p>

<p style="color:${BRAND.colors.cream};">Mañana vas a recibir un email con el nombre de tu guardián, su historia, y el acceso a tu espacio personal de magia. Todo lo que tejimos durante estos siete días se va a materializar.</p>

<p style="color:${BRAND.colors.cream};">No hace falta que hagas nada especial. No hace falta que estés en un estado particular. Tu guardián ya te eligió, y lo que viene es inevitable.</p>

${goldDivider()}

<p style="color:${BRAND.colors.gold};font-style:italic;text-align:center;font-size:18px;">La tarea final:</p>

<p style="color:${BRAND.colors.cream};text-align:center;">Cerrá los ojos. Respirá profundo. Y agradecé. No a nosotros, no al guardián. Agradecé a esa parte de vos que decidió abrirse a algo distinto. Esa valentía es la que abrió el portal.</p>

<p style="color:${BRAND.colors.cream};">Hasta mañana.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
  {
    id: 'post-adoption-7',
    sequence: 'post-adoption',
    index: 7,
    delay_hours: 169,
    subject: 'Tu guardián está listo. Se llama...',
    preview_text: 'El ritual se completó. Conocé a tu guardián.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">El ritual se completó</h1>

<p style="color:${BRAND.colors.cream};">{{name}},</p>

<p style="color:${BRAND.colors.cream};">Siete días. Siete tareas. Siete capas de conexión entre vos y un ser que cruzó un portal para encontrarte.</p>

<p style="color:${BRAND.colors.cream};font-size:20px;text-align:center;"><strong style="color:${BRAND.colors.gold};">Tu guardián está listo.</strong></p>

<p style="color:${BRAND.colors.cream};">Su nombre, su historia, su elemento, todo lo que necesitás saber te espera en tu espacio personal. Este espacio es solo tuyo: ahí vas a encontrar los mensajes de tu guardián, su ficha completa, y herramientas para profundizar la conexión.</p>

${ctaButton('Conocer a mi guardián', storeUrl(store) + '/pages/mi-magia')}

<p style="color:${BRAND.colors.cream};">Gracias por confiar en este proceso. Gracias por la paciencia, por las tareas, por mantener el portal abierto.</p>

<p style="color:${BRAND.colors.cream};">Esto recién empieza.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
];

// ============================================================
// SEQUENCE 2: WELCOME (trigger: customer_created)
// ============================================================

const welcome = [
  {
    id: 'welcome-0',
    sequence: 'welcome',
    index: 0,
    delay_hours: 0,
    subject: 'Si estás acá, ya sos parte',
    preview_text: 'Bienvenido/a al mundo de los duendes.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">Bienvenido/a</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Si estás leyendo esto, algo te trajo hasta acá. No sabemos exactamente qué fue &mdash; un link, una recomendación, una corazonada &mdash; pero eso ya no importa. Lo que importa es que llegaste.</p>

<p style="color:${BRAND.colors.cream};">Duendes del Uruguay no es una tienda. Es un espacio donde la artesanía, la espiritualidad y la tradición elemental se encuentran para crear algo que no tiene nombre fácil.</p>

<p style="color:${BRAND.colors.cream};">Creamos guardianes. Seres de arcilla que se canalizan para una persona específica. Cada uno tiene un nombre, un elemento, una historia. Y cada uno encuentra a quien tiene que encontrar.</p>

<p style="color:${BRAND.colors.cream};">No hace falta que compres nada. No hace falta que creas en nada. Solo hace falta que estés abierto/a.</p>

${ctaButton('Explorar los guardianes', storeUrl(store) + '/collections/all')}

<p style="color:${BRAND.colors.cream};">Bienvenido/a al otro lado del portal.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
  {
    id: 'welcome-1',
    sequence: 'welcome',
    index: 1,
    delay_hours: 72,
    subject: 'Lo que nadie te contó sobre los duendes',
    preview_text: 'No son lo que pensás.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">Lo que nadie te contó</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Cuando decimos "duendes", la mayoría piensa en gnomos de jardín, seres de cuentos infantiles, figuritas decorativas. Y lo entendemos.</p>

<p style="color:${BRAND.colors.cream};">Pero los duendes de los que hablamos nosotros son otra cosa.</p>

<p style="color:${BRAND.colors.cream};">En las tradiciones elementales de Uruguay &mdash; esas que mezclan raíces guaraníes, charrúas y la mística del campo &mdash; los duendes son guardianes. Seres conectados a los elementos de la naturaleza que eligen acompañar a una persona en un momento específico de su vida.</p>

<p style="color:${BRAND.colors.cream};">Hay guardianes de fuego, que llegan cuando necesitás coraje. De agua, cuando necesitás soltar. De tierra, cuando necesitás arraigo. De aire, cuando necesitás perspectiva.</p>

<p style="color:${BRAND.colors.cream};">No son decoración. No son juguetes. Son compañeros silenciosos.</p>

<p style="color:${BRAND.colors.cream};">Y la verdad es que no los elegís vos. <strong style="color:${BRAND.colors.gold};">Ellos te eligen a vos.</strong></p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
  {
    id: 'welcome-2',
    sequence: 'welcome',
    index: 2,
    delay_hours: 168,
    subject: '"No sabía que iba a llorar cuando lo abrí"',
    preview_text: 'Esto es lo que pasa cuando llega un guardián.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">Historias reales</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Queríamos compartir algo con vos. Estas son palabras reales de personas que recibieron a su guardián:</p>

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
<tr><td style="border-left:3px solid ${BRAND.colors.gold};padding:15px 20px;background-color:rgba(198,165,90,0.05);margin-bottom:15px;">
  <p style="color:${BRAND.colors.cream};font-style:italic;margin:0;">&ldquo;No sabía que iba a llorar cuando lo abrí. Pero cuando lo vi, sentí que ya lo conocía. Como si me hubiera estado esperando.&rdquo;</p>
  <p style="color:${BRAND.colors.gold};font-size:13px;margin:10px 0 0;text-align:right;">&mdash; Carolina, Buenos Aires</p>
</td></tr>
</table>

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
<tr><td style="border-left:3px solid ${BRAND.colors.gold};padding:15px 20px;background-color:rgba(198,165,90,0.05);">
  <p style="color:${BRAND.colors.cream};font-style:italic;margin:0;">&ldquo;Mi hija de 6 años lo vio y dijo: 'Mamá, este tiene magia de verdad.' No le habíamos dicho nada.&rdquo;</p>
  <p style="color:${BRAND.colors.gold};font-size:13px;margin:10px 0 0;text-align:right;">&mdash; Lucía, Bogotá</p>
</td></tr>
</table>

<p style="color:${BRAND.colors.cream};">No te contamos esto para venderte nada. Te lo contamos porque es real, y porque tal vez en alguna de estas historias reconozcas algo tuyo.</p>

${ctaButton('Ver los guardianes disponibles', storeUrl(store) + '/collections/all')}

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
  {
    id: 'welcome-3',
    sequence: 'welcome',
    index: 3,
    delay_hours: 336,
    subject: 'Hay un guardián que te está buscando',
    preview_text: 'No es casualidad que sigas acá.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">Un guardián te busca</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Han pasado dos semanas desde que llegaste a nuestro mundo. No te hemos presionado, no te vamos a presionar. Esa no es nuestra forma.</p>

<p style="color:${BRAND.colors.cream};">Pero queremos contarte algo que creemos con todo el corazón: <strong style="color:${BRAND.colors.gold};">hay un guardián que te está buscando</strong>.</p>

<p style="color:${BRAND.colors.cream};">No sabemos cuál es. No sabemos si es de fuego o de agua, si es grande o pequeño, si tiene nombre antiguo o moderno. Pero sabemos que existe, porque vos llegaste hasta acá. Y en nuestra experiencia, eso nunca es casualidad.</p>

<p style="color:${BRAND.colors.cream};">Tal vez hoy no es el día. Tal vez es mañana, o el mes que viene, o el año que viene. Los guardianes no tienen apuro. Pero están ahí.</p>

<p style="color:${BRAND.colors.cream};">Cuando estés listo/a, acá vamos a estar.</p>

${ctaButton('Encontrar a mi guardián', storeUrl(store) + '/collections/all')}

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
];

// ============================================================
// SEQUENCE 3: POST-SHIPPING (trigger: fulfillment_created)
// ============================================================

const postShipping = [
  {
    id: 'post-shipping-0',
    sequence: 'post-shipping',
    index: 0,
    delay_hours: 2,
    subject: 'Tu guardián salió a buscarte',
    preview_text: 'Ya está en camino.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">En camino</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};font-size:20px;text-align:center;"><strong style="color:${BRAND.colors.gold};">Tu guardián salió a buscarte.</strong></p>

<p style="color:${BRAND.colors.cream};">Ya dejó nuestro taller y está en camino hacia vos. Viaja protegido, envuelto con cuidado, como se envuelve algo sagrado.</p>

<p style="color:${BRAND.colors.cream};">Podés seguir su viaje con el enlace de tracking:</p>

${ctaButton('Seguir el envío', '{{tracking_url}}')}

<p style="color:${BRAND.colors.cream};">Mientras llega, te pedimos una sola cosa: no lo abras apurado/a. Cuando llegue, buscá un momento tranquilo. Ese primer encuentro es importante.</p>

<p style="color:${BRAND.colors.cream};">Te vamos a contar cómo prepararte en los próximos días.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
  {
    id: 'post-shipping-1',
    sequence: 'post-shipping',
    index: 1,
    delay_hours: 50,
    subject: 'Preparate para el primer encuentro',
    preview_text: 'Cómo abrir el paquete cuando llegue.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">El primer encuentro</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Tu guardián está cada vez más cerca. Y queremos que el momento en que lo conozcas sea especial.</p>

<p style="color:${BRAND.colors.cream};">Esto es lo que te recomendamos:</p>

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
<tr><td style="padding:10px 0;">
  <p style="color:${BRAND.colors.cream};margin:0;"><span style="color:${BRAND.colors.gold};font-size:20px;">1.</span>&nbsp;&nbsp;Elegí un momento de calma. No lo abras entre el ruido del día. Esperá a la noche, o a un momento donde estés solo/a.</p>
</td></tr>
<tr><td style="padding:10px 0;">
  <p style="color:${BRAND.colors.cream};margin:0;"><span style="color:${BRAND.colors.gold};font-size:20px;">2.</span>&nbsp;&nbsp;Abrí el paquete con las manos, despacio. Cada capa fue puesta con intención.</p>
</td></tr>
<tr><td style="padding:10px 0;">
  <p style="color:${BRAND.colors.cream};margin:0;"><span style="color:${BRAND.colors.gold};font-size:20px;">3.</span>&nbsp;&nbsp;Cuando lo veas por primera vez, no digas nada. Solo miralo. Dejá que la primera impresión sea silenciosa.</p>
</td></tr>
<tr><td style="padding:10px 0;">
  <p style="color:${BRAND.colors.cream};margin:0;"><span style="color:${BRAND.colors.gold};font-size:20px;">4.</span>&nbsp;&nbsp;Ponelo en el lugar que preparaste. Y dejalo ahí, al menos una noche, antes de moverlo.</p>
</td></tr>
</table>

<p style="color:${BRAND.colors.cream};">Muchas personas nos cuentan que el primer encuentro fue uno de los momentos más emocionantes que vivieron. No porque sea un objeto impresionante, sino porque algo dentro de ellos se reconoció.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
  {
    id: 'post-shipping-2',
    sequence: 'post-shipping',
    index: 2,
    delay_hours: 98,
    subject: '¿Cómo fue el encuentro?',
    preview_text: 'Queremos saber.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">¿Cómo fue?</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Ya pasaron unos días desde que tu guardián llegó. Y queremos preguntarte algo simple:</p>

<p style="color:${BRAND.colors.cream};font-size:20px;text-align:center;font-style:italic;"><strong style="color:${BRAND.colors.gold};">¿Cómo fue el encuentro?</strong></p>

<p style="color:${BRAND.colors.cream};">No esperamos una reseña ni una calificación con estrellas. Nos interesa saber cómo te sentiste. Qué pasó cuando lo viste. Si algo te sorprendió.</p>

<p style="color:${BRAND.colors.cream};">Cada historia que nos comparten nos ayuda a seguir canalizando con más profundidad. Y si querés, nos encantaría que compartas tu experiencia con la comunidad.</p>

${ctaButton('Compartir mi experiencia', 'https://www.instagram.com/duendesdeluruguay/')}

<p style="color:${BRAND.colors.cream};">También podés respondernos directamente a este email. Leemos todos los mensajes, uno por uno.</p>

<p style="color:${BRAND.colors.cream};">Gracias por ser parte de esto.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
];

// ============================================================
// SEQUENCE 4: RE-ENGAGEMENT (cron-based, 60+ days inactive)
// ============================================================

const reEngagement = [
  {
    id: 're-engagement-0',
    sequence: 're-engagement',
    index: 0,
    delay_hours: 0,
    subject: 'A veces no es el momento. Y está bien.',
    preview_text: 'No venimos a venderte nada.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">&nbsp;</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Hace un tiempo que no sabemos de vos. Y eso está perfecto.</p>

<p style="color:${BRAND.colors.cream};">No te escribimos para ofrecerte un descuento ni para recordarte que "olvidaste algo en tu carrito". No es nuestro estilo. Nunca lo va a ser.</p>

<p style="color:${BRAND.colors.cream};">Te escribimos porque hay algo que aprendimos en todos estos años canalizando guardianes: <strong style="color:${BRAND.colors.gold};">a veces no es el momento. Y cuando no es el momento, forzar es peor que esperar.</strong></p>

<p style="color:${BRAND.colors.cream};">Tal vez la vida te llevó para otro lado. Tal vez lo que necesitabas ya lo encontraste. Tal vez todavía no. No lo sabemos, y no nos corresponde saberlo.</p>

<p style="color:${BRAND.colors.cream};">Solo queríamos que supieras que seguimos acá. Que el portal no se cierra. Y que si algún día sentís que es el momento, vamos a estar esperando.</p>

<p style="color:${BRAND.colors.cream};">Sin apuro. Sin presión. Como los guardianes.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
  {
    id: 're-engagement-1',
    sequence: 're-engagement',
    index: 1,
    delay_hours: 96,
    subject: 'Este guardián apareció hoy',
    preview_text: 'Algo nuevo salió del taller.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">Algo nuevo</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Hoy salió un guardián nuevo del taller. Y por alguna razón, mientras lo canalizábamos, pensamos en mandártelo.</p>

<p style="color:${BRAND.colors.cream};">No sabemos por qué. No siempre hay una razón lógica. Pero en este mundo, los "por alguna razón" suelen ser los mensajes más importantes.</p>

<p style="color:${BRAND.colors.cream};">No te pedimos que lo compres. Te pedimos que lo mires. Nada más. Miralo y fijate si algo se mueve adentro tuyo.</p>

${ctaButton('Ver los guardianes nuevos', storeUrl(store) + '/collections/all')}

<p style="color:${BRAND.colors.cream};">Si no pasa nada, no pasa nada. Pero si algo pasa... ya sabés dónde encontrarnos.</p>

<p style="color:${BRAND.colors.cream};">${BRAND.shortSignoff}</p>
`, store),
  },
  {
    id: 're-engagement-2',
    sequence: 're-engagement',
    index: 2,
    delay_hours: 240,
    subject: 'Última carta',
    preview_text: 'Nos despedimos. Por ahora.',
    body_html: (store) => emailWrapper(`
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:${BRAND.colors.gold};text-align:center;font-weight:normal;margin:20px 0 30px;">Última carta</h1>

<p style="color:${BRAND.colors.cream};">Hola {{name}},</p>

<p style="color:${BRAND.colors.cream};">Esta es nuestra última carta. No porque estemos enojados, ni porque "te sacamos de la lista". Simplemente porque no queremos ser una molestia en tu bandeja de entrada.</p>

<p style="color:${BRAND.colors.cream};">Creemos que hay pocas cosas más sagradas que la atención de alguien. Y si la tuya está en otro lado ahora, no vamos a pelear por ella.</p>

<p style="color:${BRAND.colors.cream};">Pero antes de irnos, queremos decirte algo:</p>

<p style="color:${BRAND.colors.cream};text-align:center;font-size:18px;font-style:italic;"><strong style="color:${BRAND.colors.gold};">Gracias por haber estado.</strong></p>

<p style="color:${BRAND.colors.cream};">Aunque haya sido por un momento. Aunque haya sido por curiosidad. Aunque no hayas comprado nada. Tu presencia en este espacio dejó una huella, y eso para nosotros tiene valor.</p>

<p style="color:${BRAND.colors.cream};">Si algún día querés volver, el portal siempre va a estar abierto.</p>

${ctaButton('Volver al portal', storeUrl(store))}

<p style="color:${BRAND.colors.cream};">Con cariño,</p>

<p style="color:${BRAND.colors.cream};">${BRAND.signoff}</p>
`, store),
  },
];

// ============================================================
// EXPORTS
// ============================================================

const ALL_EMAILS = [...postAdoption, ...welcome, ...postShipping, ...reEngagement];

const SEQUENCES = {
  'post-adoption': postAdoption,
  'welcome': welcome,
  'post-shipping': postShipping,
  're-engagement': reEngagement,
};

// Trigger mapping: Shopify webhook topic -> sequence name
const TRIGGER_MAP = {
  'orders/create': 'post-adoption',
  'customers/create': 'welcome',
  'fulfillments/create': 'post-shipping',
  'orders/fulfilled': 'post-shipping',
};

function getEmailById(id) {
  return ALL_EMAILS.find(e => e.id === id);
}

function getSequenceEmails(sequenceName) {
  return SEQUENCES[sequenceName] || [];
}

function renderEmail(emailDef, { name, email, store, tracking_url }) {
  const html = typeof emailDef.body_html === 'function'
    ? emailDef.body_html(store)
    : emailDef.body_html;

  return {
    subject: emailDef.subject.replace(/\{\{name\}\}/g, name || ''),
    html: html
      .replace(/\{\{name\}\}/g, name || '')
      .replace(/\{\{email\}\}/g, email || '')
      .replace(/\{\{tracking_url\}\}/g, tracking_url || '#'),
  };
}

module.exports = {
  BRAND,
  ALL_EMAILS,
  SEQUENCES,
  TRIGGER_MAP,
  getEmailById,
  getSequenceEmails,
  renderEmail,
};
