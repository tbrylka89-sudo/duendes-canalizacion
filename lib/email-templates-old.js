/**
 * Templates de Email - Duendes del Uruguay
 * Estética: Negro profundo, dorado, elegante, místico
 */

// Estilos base
const styles = {
  container: `
    max-width: 600px;
    margin: 0 auto;
    background: linear-gradient(180deg, #0a0a0a 0%, #111111 100%);
    font-family: Georgia, 'Times New Roman', serif;
  `,
  header: `
    text-align: center;
    padding: 40px 30px 30px;
    border-bottom: 1px solid rgba(201, 162, 39, 0.2);
  `,
  logo: `
    font-family: 'Cinzel', Georgia, serif;
    font-size: 24px;
    color: #c9a227;
    letter-spacing: 3px;
    margin: 0;
    text-transform: uppercase;
  `,
  body: `
    padding: 40px 30px;
  `,
  title: `
    font-family: 'Cinzel', Georgia, serif;
    font-size: 28px;
    color: #c9a227;
    text-align: center;
    margin: 0 0 10px;
    letter-spacing: 1px;
  `,
  subtitle: `
    font-family: Georgia, serif;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    margin: 0 0 30px;
    font-style: italic;
  `,
  text: `
    font-family: Georgia, serif;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.8;
    margin: 0 0 20px;
  `,
  highlight: `
    background: rgba(201, 162, 39, 0.1);
    border-left: 3px solid #c9a227;
    padding: 20px 25px;
    margin: 25px 0;
  `,
  highlightText: `
    font-family: Georgia, serif;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    font-style: italic;
    line-height: 1.7;
  `,
  button: `
    display: inline-block;
    background: linear-gradient(135deg, #c9a227 0%, #8b6914 100%);
    color: #0a0a0a;
    text-decoration: none;
    padding: 16px 40px;
    border-radius: 30px;
    font-family: 'Cinzel', Georgia, serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
  `,
  buttonContainer: `
    text-align: center;
    margin: 35px 0;
  `,
  divider: `
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.3), transparent);
    margin: 30px 0;
  `,
  footer: `
    text-align: center;
    padding: 30px;
    border-top: 1px solid rgba(201, 162, 39, 0.2);
  `,
  footerText: `
    font-family: Georgia, serif;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.4);
    margin: 0 0 10px;
  `,
  footerLink: `
    color: #c9a227;
    text-decoration: none;
  `,
};

// Template base que envuelve todo
function baseTemplate(content) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 20px; background-color: #000000;">
  <div style="${styles.container}">
    <div style="${styles.header}">
      <h1 style="${styles.logo}">Duendes del Uruguay</h1>
    </div>
    ${content}
    <div style="${styles.footer}">
      <p style="${styles.footerText}">
        <a href="https://duendesdeluruguay.com" style="${styles.footerLink}">duendesdeluruguay.com</a>
      </p>
      <p style="${styles.footerText}">
        Guardianes místicos hechos a mano con amor
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Email: Regalo - Invitación al destinatario
 */
export function emailRegaloInvitacion({ nombreDestinatario, mensajePersonal, linkFormulario }) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">Hola ${nombreDestinatario}</h2>
      <p style="${styles.subtitle}">Alguien que te quiere te regaló algo especial</p>

      ${mensajePersonal ? `
      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">"${mensajePersonal}"</p>
      </div>
      ` : ''}

      <p style="${styles.text}">
        Un guardián místico está esperando conocerte. Para que pueda hablarte de verdad
        — no con frases genéricas sino con palabras que solo vos necesitás escuchar —
        necesita saber un poco de vos.
      </p>

      <div style="${styles.buttonContainer}">
        <a href="${linkFormulario}" style="${styles.button}">Completar mi conexión</a>
      </div>

      <p style="text-align: center; color: rgba(255,255,255,0.5); font-size: 14px; font-style: italic;">
        Solo toma 2 minutos. Tu guardián te espera.
      </p>
    </div>
  `;
  return baseTemplate(content);
}

/**
 * Email: Recordatorio - No completó el formulario (24h)
 */
export function emailRecordatorio24h({ nombreCliente, nombreGuardian, linkFormulario }) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">${nombreGuardian} está esperando...</h2>
      <p style="${styles.subtitle}">${nombreCliente}, tu guardián aún no te conoce</p>

      <p style="${styles.text}">
        Tu guardián ya está en camino, pero aún no sabe nada de vos.
      </p>

      <p style="${styles.text}">
        Sin esta información, la canalización que recibas será genérica en lugar de
        las palabras exactas que necesitás escuchar.
      </p>

      <div style="${styles.buttonContainer}">
        <a href="${linkFormulario}" style="${styles.button}">Completar mi conexión</a>
      </div>

      <p style="text-align: center; color: rgba(255,255,255,0.5); font-size: 14px;">
        Solo toma 2 minutos. Tu guardián merece conocerte.
      </p>
    </div>
  `;
  return baseTemplate(content);
}

/**
 * Email: Recordatorio urgente (72h)
 */
export function emailRecordatorio72h({ nombreCliente, nombreGuardian, linkFormulario }) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">Última oportunidad</h2>
      <p style="${styles.subtitle}">Tu canalización personal te espera</p>

      <p style="${styles.text}">
        ${nombreCliente}, en 48 horas enviaremos tu guardián con su canalización.
      </p>

      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">
          Si no completás el formulario, escribiremos algo bonito pero general.<br><br>
          Si lo completás, escribiremos algo que te va a tocar el alma.
        </p>
      </div>

      <p style="${styles.text}">
        La diferencia es enorme. Solo vos decidís.
      </p>

      <div style="${styles.buttonContainer}">
        <a href="${linkFormulario}" style="${styles.button}">Quiero una canalización personal</a>
      </div>
    </div>
  `;
  return baseTemplate(content);
}

/**
 * Email: Confirmación de compra
 */
export function emailConfirmacionCompra({ nombreCliente, nombreGuardian, numeroOrden, linkFormulario }) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">¡Gracias por tu compra!</h2>
      <p style="${styles.subtitle}">${nombreGuardian} ya es tuyo</p>

      <p style="${styles.text}">
        Hola ${nombreCliente}, tu pedido #${numeroOrden} fue confirmado.
      </p>

      <p style="${styles.text}">
        Tu guardián está siendo preparado con todo el amor y la magia que merece.
        Pronto estará en camino a tu hogar.
      </p>

      ${linkFormulario ? `
      <div style="${styles.divider}"></div>

      <p style="${styles.text}">
        <strong style="color: #c9a227;">Paso importante:</strong> Para recibir tu canalización
        personalizada, completá el formulario de conexión:
      </p>

      <div style="${styles.buttonContainer}">
        <a href="${linkFormulario}" style="${styles.button}">Conectar con mi guardián</a>
      </div>
      ` : ''}
    </div>
  `;
  return baseTemplate(content);
}

/**
 * Email: Canalización lista
 */
export function emailCanalizacionLista({ nombreCliente, nombreGuardian, linkCanalizacion }) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">Tu canalización está lista</h2>
      <p style="${styles.subtitle}">${nombreGuardian} tiene un mensaje para vos</p>

      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">
          Tu guardián te escuchó, leyó todo lo que compartiste, y tiene
          palabras especialmente para vos.
        </p>
      </div>

      <p style="${styles.text}">
        ${nombreCliente}, este mensaje fue canalizado únicamente para vos.
        No es un texto genérico — es una carta personal de ${nombreGuardian}.
      </p>

      <div style="${styles.buttonContainer}">
        <a href="${linkCanalizacion}" style="${styles.button}">Leer mi canalización</a>
      </div>

      <p style="text-align: center; color: rgba(255,255,255,0.5); font-size: 14px; font-style: italic;">
        Buscá un momento tranquilo para leerla. Vale la pena.
      </p>
    </div>
  `;
  return baseTemplate(content);
}

/**
 * Email: Test / Prueba
 */
export function emailTest({ nombre }) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">Email de prueba</h2>
      <p style="${styles.subtitle}">¡Hola ${nombre}!</p>

      <p style="${styles.text}">
        Este es un email de prueba del sistema de Duendes del Uruguay.
      </p>

      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">
          Si estás viendo esto, el sistema de emails está funcionando correctamente.
        </p>
      </div>

      <div style="${styles.buttonContainer}">
        <a href="https://duendesdeluruguay.com" style="${styles.button}">Visitar la tienda</a>
      </div>

      <p style="text-align: center; color: rgba(255,255,255,0.4); font-size: 12px;">
        Enviado: ${new Date().toLocaleString('es-AR')}
      </p>
    </div>
  `;
  return baseTemplate(content);
}

export default {
  emailRegaloInvitacion,
  emailRecordatorio24h,
  emailRecordatorio72h,
  emailConfirmacionCompra,
  emailCanalizacionLista,
  emailTest,
};
