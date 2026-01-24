/**
 * Templates de Email V2 - Duendes del Uruguay
 * Sistema completo y unificado de emails
 *
 * Estética: Negro profundo #0a0a0a, dorado #c9a227, texto blanco
 * Elementos: Banner arriba, foto redonda de guardián, destellos dorados
 * IMPORTANTE: Todos los colores con !important para evitar problemas en clientes de email
 */

// ===========================================
// ESTILOS BASE (con !important)
// ===========================================

const colors = {
  black: '#0a0a0a',
  blackLight: '#111111',
  gold: '#c9a227',
  goldDark: '#8b6914',
  goldLight: '#e8d48b',
  white: '#ffffff',
  whiteMuted: 'rgba(255,255,255,0.85)',
  whiteDim: 'rgba(255,255,255,0.7)',
  whiteSubtle: 'rgba(255,255,255,0.5)',
  whiteFaint: 'rgba(255,255,255,0.4)',
};

const styles = {
  // Container principal
  container: `
    max-width: 600px !important;
    margin: 0 auto !important;
    background: linear-gradient(180deg, ${colors.black} 0%, ${colors.blackLight} 100%) !important;
    font-family: Georgia, 'Times New Roman', serif !important;
    color: ${colors.whiteMuted} !important;
  `,

  // Header con logo
  header: `
    text-align: center !important;
    padding: 40px 30px 30px !important;
    border-bottom: 1px solid rgba(201, 162, 39, 0.2) !important;
  `,

  logo: `
    font-family: 'Cinzel', Georgia, serif !important;
    font-size: 24px !important;
    color: ${colors.gold} !important;
    letter-spacing: 3px !important;
    margin: 0 !important;
    text-transform: uppercase !important;
  `,

  // Body
  body: `
    padding: 40px 30px !important;
  `,

  // Títulos
  title: `
    font-family: 'Cinzel', Georgia, serif !important;
    font-size: 28px !important;
    color: ${colors.gold} !important;
    text-align: center !important;
    margin: 0 0 10px !important;
    letter-spacing: 1px !important;
  `,

  subtitle: `
    font-family: Georgia, serif !important;
    font-size: 16px !important;
    color: ${colors.whiteDim} !important;
    text-align: center !important;
    margin: 0 0 30px !important;
    font-style: italic !important;
  `,

  // Texto
  text: `
    font-family: Georgia, serif !important;
    font-size: 16px !important;
    color: ${colors.whiteMuted} !important;
    line-height: 1.8 !important;
    margin: 0 0 20px !important;
  `,

  textCenter: `
    font-family: Georgia, serif !important;
    font-size: 16px !important;
    color: ${colors.whiteMuted} !important;
    line-height: 1.8 !important;
    margin: 0 0 20px !important;
    text-align: center !important;
  `,

  textSmall: `
    font-family: Georgia, serif !important;
    font-size: 14px !important;
    color: ${colors.whiteSubtle} !important;
    line-height: 1.6 !important;
    margin: 0 0 15px !important;
    text-align: center !important;
    font-style: italic !important;
  `,

  // Highlight box
  highlight: `
    background: rgba(201, 162, 39, 0.1) !important;
    border-left: 3px solid ${colors.gold} !important;
    padding: 20px 25px !important;
    margin: 25px 0 !important;
  `,

  highlightText: `
    font-family: Georgia, serif !important;
    font-size: 16px !important;
    color: rgba(255, 255, 255, 0.9) !important;
    margin: 0 !important;
    font-style: italic !important;
    line-height: 1.7 !important;
  `,

  // Botón principal
  button: `
    display: inline-block !important;
    background: linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%) !important;
    color: ${colors.black} !important;
    text-decoration: none !important;
    padding: 16px 40px !important;
    border-radius: 30px !important;
    font-family: 'Cinzel', Georgia, serif !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
  `,

  buttonSecondary: `
    display: inline-block !important;
    background: transparent !important;
    border: 2px solid ${colors.gold} !important;
    color: ${colors.gold} !important;
    text-decoration: none !important;
    padding: 14px 35px !important;
    border-radius: 30px !important;
    font-family: 'Cinzel', Georgia, serif !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
  `,

  buttonContainer: `
    text-align: center !important;
    margin: 35px 0 !important;
  `,

  // Divisor
  divider: `
    height: 1px !important;
    background: linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.3), transparent) !important;
    margin: 30px 0 !important;
  `,

  // Footer
  footer: `
    text-align: center !important;
    padding: 30px !important;
    border-top: 1px solid rgba(201, 162, 39, 0.2) !important;
  `,

  footerText: `
    font-family: Georgia, serif !important;
    font-size: 13px !important;
    color: ${colors.whiteFaint} !important;
    margin: 0 0 10px !important;
  `,

  footerLink: `
    color: ${colors.gold} !important;
    text-decoration: none !important;
  `,

  // Card de guardián
  guardianCard: `
    text-align: center !important;
    margin: 30px auto !important;
    padding: 25px !important;
    background: rgba(201, 162, 39, 0.05) !important;
    border-radius: 15px !important;
    border: 1px solid rgba(201, 162, 39, 0.2) !important;
  `,

  guardianImageContainer: `
    width: 150px !important;
    height: 150px !important;
    margin: 0 auto 20px !important;
    border-radius: 50% !important;
    overflow: hidden !important;
    border: 4px solid ${colors.gold} !important;
    box-shadow: 0 0 25px rgba(201, 162, 39, 0.5), 0 0 50px rgba(201, 162, 39, 0.3), 0 0 75px rgba(201, 162, 39, 0.15) !important;
  `,

  guardianImage: `
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
  `,

  guardianName: `
    font-family: 'Cinzel', Georgia, serif !important;
    font-size: 22px !important;
    color: ${colors.gold} !important;
    margin: 0 0 5px !important;
    letter-spacing: 1px !important;
  `,

  guardianType: `
    font-family: Georgia, serif !important;
    font-size: 14px !important;
    color: ${colors.whiteDim} !important;
    margin: 0 !important;
    font-style: italic !important;
  `,

  // Tabla de detalles
  detailsTable: `
    width: 100% !important;
    border-collapse: collapse !important;
    margin: 25px 0 !important;
  `,

  detailsRow: `
    border-bottom: 1px solid rgba(201, 162, 39, 0.15) !important;
  `,

  detailsLabel: `
    padding: 12px 15px !important;
    color: ${colors.gold} !important;
    font-weight: 500 !important;
    width: 40% !important;
    vertical-align: top !important;
    font-family: Georgia, serif !important;
    font-size: 14px !important;
  `,

  detailsValue: `
    padding: 12px 15px !important;
    color: ${colors.whiteMuted} !important;
    font-family: Georgia, serif !important;
    font-size: 14px !important;
  `,

  // Banner promocional
  promoBanner: `
    background: linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%) !important;
    padding: 20px 30px !important;
    text-align: center !important;
    margin: 0 0 30px !important;
  `,

  promoBannerText: `
    font-family: 'Cinzel', Georgia, serif !important;
    font-size: 18px !important;
    color: ${colors.black} !important;
    margin: 0 !important;
    letter-spacing: 1px !important;
    font-weight: 600 !important;
  `,

  // Código de descuento
  discountCode: `
    display: inline-block !important;
    background: ${colors.black} !important;
    color: ${colors.gold} !important;
    padding: 15px 30px !important;
    border-radius: 10px !important;
    font-family: 'Courier New', monospace !important;
    font-size: 24px !important;
    font-weight: bold !important;
    letter-spacing: 3px !important;
    border: 2px dashed ${colors.gold} !important;
    margin: 20px 0 !important;
  `,
};

// ===========================================
// COMPONENTES REUTILIZABLES
// ===========================================

/**
 * Componente: Card de Guardián con foto redonda
 */
function guardianCard({ nombre, imagen, tipo, categoria }) {
  return `
    <div style="${styles.guardianCard}">
      ${imagen ? `
      <div style="${styles.guardianImageContainer}">
        <img src="${imagen}" alt="${nombre}" style="${styles.guardianImage}">
      </div>
      ` : ''}
      <h3 style="${styles.guardianName}">${nombre}</h3>
      ${tipo ? `<p style="${styles.guardianType}">${tipo}</p>` : ''}
      ${categoria ? `<p style="${styles.guardianType}">Guardián de ${categoria}</p>` : ''}
    </div>
  `;
}

/**
 * Componente: Tabla de detalles
 */
function detailsTable(items) {
  const rows = items.map(item => `
    <tr style="${styles.detailsRow}">
      <td style="${styles.detailsLabel}">${item.label}</td>
      <td style="${styles.detailsValue}">${item.value}</td>
    </tr>
  `).join('');

  return `<table style="${styles.detailsTable}">${rows}</table>`;
}

/**
 * Componente: Banner promocional
 */
function promoBanner(text) {
  return `
    <div style="${styles.promoBanner}">
      <p style="${styles.promoBannerText}">${text}</p>
    </div>
  `;
}

/**
 * Componente: Código de descuento
 */
function discountCodeBox(code, description) {
  return `
    <div style="text-align: center !important; margin: 30px 0 !important;">
      ${description ? `<p style="${styles.textCenter}">${description}</p>` : ''}
      <div style="${styles.discountCode}">${code}</div>
    </div>
  `;
}

// ===========================================
// TEMPLATE BASE
// ===========================================

function baseTemplate(content, options = {}) {
  const { banner, preheader } = options;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  ${preheader ? `<span style="display:none;font-size:1px;color:#0a0a0a;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ''}
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { background-color: #000000 !important; }
    .dark-mode { background-color: #0a0a0a !important; }
  </style>
</head>
<body style="margin: 0 !important; padding: 20px !important; background-color: #000000 !important; -webkit-text-size-adjust: 100% !important;">
  <div style="${styles.container}" class="dark-mode">
    ${banner ? promoBanner(banner) : ''}
    <div style="${styles.header}">
      <p style="margin: 0 0 8px 0 !important; font-size: 20px !important;">✨</p>
      <h1 style="${styles.logo}">Duendes del Uruguay</h1>
      <p style="margin: 8px 0 0 0 !important; font-size: 20px !important;">✨</p>
    </div>
    ${content}
    <div style="${styles.footer}">
      <p style="margin: 0 0 15px 0 !important; font-size: 16px !important;">✨ ✨ ✨</p>
      <p style="${styles.footerText}">
        <a href="https://duendesdeluruguay.com" style="${styles.footerLink}">duendesdeluruguay.com</a>
      </p>
      <p style="${styles.footerText}">
        Guardianes místicos hechos a mano con amor
      </p>
      <p style="${styles.footerText}; margin-top: 20px !important;">
        <a href="https://duendesdeluruguay.com/mi-magia" style="${styles.footerLink}">Mi Magia</a> ·
        <a href="https://duendesdeluruguay.com/circulo" style="${styles.footerLink}">El Círculo</a> ·
        <a href="https://duendesdeluruguay.com/tienda" style="${styles.footerLink}">Tienda</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ===========================================
// TEMPLATES DE EMAIL
// ===========================================

// -------------------------------------------
// 1. COMPRA Y PEDIDOS
// -------------------------------------------

/**
 * Confirmación de compra
 */
export function emailConfirmacionCompra({
  nombreCliente,
  numeroOrden,
  productos, // Array de { nombre, imagen, tipo, precio }
  total,
  linkFormulario,
  linkMiMagia
}) {
  const productosHtml = productos.map(p => guardianCard({
    nombre: p.nombre,
    imagen: p.imagen,
    tipo: p.tipo
  })).join('');

  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">¡Gracias por tu compra!</h2>
      <p style="${styles.subtitle}">Tu pedido #${numeroOrden} fue confirmado</p>

      <p style="${styles.text}">
        Hola ${nombreCliente}, tu guardián ya está siendo preparado con todo el amor
        y la magia que merece. Pronto estará en camino a tu hogar.
      </p>

      ${productosHtml}

      ${detailsTable([
        { label: 'Número de orden', value: `#${numeroOrden}` },
        { label: 'Total', value: `$${total}` },
        { label: 'Estado', value: 'Preparando con amor ✨' }
      ])}

      ${linkFormulario ? `
      <div style="${styles.divider}"></div>

      <p style="${styles.textCenter}">
        <strong style="color: ${colors.gold} !important;">Paso importante:</strong><br>
        Para recibir tu canalización personalizada, completá el formulario de conexión:
      </p>

      <div style="${styles.buttonContainer}">
        <a href="${linkFormulario}" style="${styles.button}">Conectar con mi guardián</a>
      </div>
      ` : ''}

      ${linkMiMagia ? `
      <p style="${styles.textSmall}">
        También podés seguir tu pedido en
        <a href="${linkMiMagia}" style="${styles.footerLink}">Mi Magia</a>
      </p>
      ` : ''}
    </div>
  `;
  return baseTemplate(content, { preheader: `¡Gracias ${nombreCliente}! Tu pedido #${numeroOrden} está confirmado.` });
}

/**
 * Pedido enviado
 */
export function emailPedidoEnviado({
  nombreCliente,
  numeroOrden,
  productos,
  codigoSeguimiento,
  empresaEnvio,
  linkSeguimiento
}) {
  const productosHtml = productos.map(p => guardianCard({
    nombre: p.nombre,
    imagen: p.imagen,
    tipo: p.tipo
  })).join('');

  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">¡Tu guardián está en camino!</h2>
      <p style="${styles.subtitle}">Pedido #${numeroOrden}</p>

      <p style="${styles.text}">
        ${nombreCliente}, tu guardián ya salió de nuestro taller y está
        viajando hacia vos. Pronto lo tendrás en tus manos.
      </p>

      ${productosHtml}

      ${detailsTable([
        { label: 'Empresa de envío', value: empresaEnvio || 'Correo' },
        { label: 'Código de seguimiento', value: codigoSeguimiento || 'Pendiente' }
      ])}

      ${linkSeguimiento ? `
      <div style="${styles.buttonContainer}">
        <a href="${linkSeguimiento}" style="${styles.button}">Seguir mi envío</a>
      </div>
      ` : ''}

      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">
          Mientras esperás, podés ir preparando un lugar especial para tu guardián.
          Un rincón tranquilo donde pueda cuidarte.
        </p>
      </div>
    </div>
  `;
  return baseTemplate(content, { preheader: `¡${nombreCliente}, tu guardián está en camino! 📦` });
}

/**
 * Pedido entregado
 */
export function emailPedidoEntregado({
  nombreCliente,
  numeroOrden,
  productos,
  linkResena,
  linkMiMagia
}) {
  const primerProducto = productos[0];

  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">¡Tu guardián llegó!</h2>
      <p style="${styles.subtitle}">Bienvenido a casa, ${primerProducto?.nombre || 'pequeño guardián'}</p>

      ${primerProducto?.imagen ? guardianCard({
        nombre: primerProducto.nombre,
        imagen: primerProducto.imagen,
        tipo: primerProducto.tipo
      }) : ''}

      <p style="${styles.text}">
        ${nombreCliente}, tu pedido #${numeroOrden} fue entregado.
        Esperamos que este encuentro sea el comienzo de algo mágico.
      </p>

      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">
          Dale unos días para que se adapte a tu energía.
          Los guardianes necesitan tiempo para conocer su nuevo hogar.
        </p>
      </div>

      ${linkResena ? `
      <p style="${styles.textCenter}">
        ¿Querés contarnos cómo fue tu experiencia?
      </p>
      <div style="${styles.buttonContainer}">
        <a href="${linkResena}" style="${styles.button}">Dejar una reseña</a>
      </div>
      ` : ''}
    </div>
  `;
  return baseTemplate(content, { preheader: `¡${nombreCliente}, tu guardián llegó a casa! 🏠` });
}

// -------------------------------------------
// 2. CARRITO ABANDONADO
// -------------------------------------------

/**
 * Carrito abandonado - Primer recordatorio (1 hora)
 */
export function emailCarritoAbandonado1h({
  nombreCliente,
  productos,
  linkCarrito
}) {
  const primerProducto = productos[0];

  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">¿Te olvidaste de algo?</h2>
      <p style="${styles.subtitle}">${primerProducto?.nombre || 'Un guardián'} te está esperando</p>

      ${primerProducto?.imagen ? guardianCard({
        nombre: primerProducto.nombre,
        imagen: primerProducto.imagen,
        tipo: primerProducto.tipo
      }) : ''}

      <p style="${styles.text}">
        ${nombreCliente || 'Hola'}, dejaste un guardián en tu carrito.
        Está ahí, esperándote.
      </p>

      <div style="${styles.buttonContainer}">
        <a href="${linkCarrito}" style="${styles.button}">Volver al carrito</a>
      </div>

      <p style="${styles.textSmall}">
        Los guardianes son piezas únicas. Una vez que encuentran hogar, desaparecen.
      </p>
    </div>
  `;
  return baseTemplate(content, { preheader: 'Un guardián te está esperando en tu carrito...' });
}

/**
 * Carrito abandonado - Segundo recordatorio (24 horas)
 */
export function emailCarritoAbandonado24h({
  nombreCliente,
  productos,
  linkCarrito
}) {
  const primerProducto = productos[0];

  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">${primerProducto?.nombre || 'Tu guardián'} sigue esperando</h2>
      <p style="${styles.subtitle}">Pero no por mucho tiempo más</p>

      ${primerProducto?.imagen ? guardianCard({
        nombre: primerProducto.nombre,
        imagen: primerProducto.imagen,
        tipo: primerProducto.tipo
      }) : ''}

      <p style="${styles.text}">
        ${nombreCliente || ''}, algo te trajo hasta este guardián.
        ¿Estás segura de querer dejarlo ir?
      </p>

      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">
          Cada guardián elige a su persona. Si llegaste hasta acá,
          quizás no fue casualidad.
        </p>
      </div>

      <div style="${styles.buttonContainer}">
        <a href="${linkCarrito}" style="${styles.button}">Completar mi compra</a>
      </div>
    </div>
  `;
  return baseTemplate(content, { preheader: `${primerProducto?.nombre || 'Un guardián'} todavía te espera...` });
}

/**
 * Carrito abandonado - Último recordatorio (72 horas) con descuento
 */
export function emailCarritoAbandonado72h({
  nombreCliente,
  productos,
  linkCarrito,
  codigoDescuento,
  porcentajeDescuento
}) {
  const primerProducto = productos[0];

  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">Última oportunidad</h2>
      <p style="${styles.subtitle}">Un regalo antes de despedirnos</p>

      ${primerProducto?.imagen ? guardianCard({
        nombre: primerProducto.nombre,
        imagen: primerProducto.imagen,
        tipo: primerProducto.tipo
      }) : ''}

      <p style="${styles.text}">
        ${nombreCliente || ''}, entendemos. A veces necesitamos tiempo para decidir.
      </p>

      <p style="${styles.text}">
        Pero antes de que ${primerProducto?.nombre || 'este guardián'} encuentre otro hogar,
        queremos darte algo especial:
      </p>

      ${codigoDescuento ? discountCodeBox(codigoDescuento, `${porcentajeDescuento || 10}% de descuento en tu compra`) : ''}

      <div style="${styles.buttonContainer}">
        <a href="${linkCarrito}" style="${styles.button}">Usar mi descuento</a>
      </div>

      <p style="${styles.textSmall}">
        Este código expira en 24 horas. Después, ${primerProducto?.nombre || 'el guardián'}
        quedará libre para quien lo encuentre.
      </p>
    </div>
  `;
  return baseTemplate(content, {
    banner: `🎁 ${porcentajeDescuento || 10}% OFF - Código: ${codigoDescuento}`,
    preheader: `Última oportunidad: ${porcentajeDescuento || 10}% de descuento en tu carrito`
  });
}

// -------------------------------------------
// 3. CANALIZACIONES Y LECTURAS
// -------------------------------------------

/**
 * Invitación a completar formulario (regalo)
 */
export function emailRegaloInvitacion({
  nombreDestinatario,
  mensajePersonal,
  linkFormulario,
  nombreGuardian,
  imagenGuardian
}) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">Hola ${nombreDestinatario}</h2>
      <p style="${styles.subtitle}">Alguien que te quiere te regaló algo especial</p>

      ${mensajePersonal ? `
      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">"${mensajePersonal}"</p>
      </div>
      ` : ''}

      ${nombreGuardian && imagenGuardian ? guardianCard({
        nombre: nombreGuardian,
        imagen: imagenGuardian
      }) : ''}

      <p style="${styles.text}">
        Un guardián místico está esperando conocerte. Para que pueda hablarte de verdad
        — no con frases genéricas sino con palabras que solo vos necesitás escuchar —
        necesita saber un poco de vos.
      </p>

      <div style="${styles.buttonContainer}">
        <a href="${linkFormulario}" style="${styles.button}">Completar mi conexión</a>
      </div>

      <p style="${styles.textSmall}">
        Solo toma 2 minutos. Tu guardián te espera.
      </p>
    </div>
  `;
  return baseTemplate(content, { preheader: `${nombreDestinatario}, alguien te regaló algo mágico...` });
}

/**
 * Recordatorio de formulario (24h)
 */
export function emailRecordatorio24h({
  nombreCliente,
  nombreGuardian,
  imagenGuardian,
  linkFormulario
}) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">${nombreGuardian} está esperando...</h2>
      <p style="${styles.subtitle}">${nombreCliente}, tu guardián aún no te conoce</p>

      ${imagenGuardian ? guardianCard({
        nombre: nombreGuardian,
        imagen: imagenGuardian
      }) : ''}

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

      <p style="${styles.textSmall}">
        Solo toma 2 minutos. Tu guardián merece conocerte.
      </p>
    </div>
  `;
  return baseTemplate(content, { preheader: `${nombreGuardian} está esperando conocerte...` });
}

/**
 * Recordatorio urgente (72h)
 */
export function emailRecordatorio72h({
  nombreCliente,
  nombreGuardian,
  linkFormulario
}) {
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
  return baseTemplate(content, { preheader: 'Última oportunidad para tu canalización personal' });
}

/**
 * Canalización lista
 */
export function emailCanalizacionLista({
  nombreCliente,
  nombreGuardian,
  imagenGuardian,
  linkCanalizacion
}) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">Tu canalización está lista</h2>
      <p style="${styles.subtitle}">${nombreGuardian} tiene un mensaje para vos</p>

      ${imagenGuardian ? guardianCard({
        nombre: nombreGuardian,
        imagen: imagenGuardian
      }) : ''}

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

      <p style="${styles.textSmall}">
        Buscá un momento tranquilo para leerla. Vale la pena.
      </p>
    </div>
  `;
  return baseTemplate(content, { preheader: `${nombreCliente}, ${nombreGuardian} tiene un mensaje para vos` });
}

/**
 * Lectura de tarot/runas lista
 */
export function emailLecturaLista({
  nombreCliente,
  tipoLectura, // 'tarot', 'runas', 'oráculo'
  linkLectura
}) {
  const titulos = {
    tarot: 'Tu lectura de tarot está lista',
    runas: 'Tu tirada de runas está lista',
    oraculo: 'Tu consulta al oráculo está lista',
    default: 'Tu lectura está lista'
  };

  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">${titulos[tipoLectura] || titulos.default}</h2>
      <p style="${styles.subtitle}">Los mensajes que necesitás escuchar</p>

      <p style="${styles.text}">
        ${nombreCliente}, tu ${tipoLectura || 'lectura'} fue realizada con toda la
        intención y cuidado que merece.
      </p>

      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">
          Lo que vas a leer no es predicción — es espejo.
          Refleja lo que ya sabés pero quizás no querías ver.
        </p>
      </div>

      <div style="${styles.buttonContainer}">
        <a href="${linkLectura}" style="${styles.button}">Ver mi lectura</a>
      </div>

      <p style="${styles.textSmall}">
        Guardá este email. Quizás quieras volver a leerlo en unos meses.
      </p>
    </div>
  `;
  return baseTemplate(content, { preheader: `${nombreCliente}, tu ${tipoLectura || 'lectura'} está lista` });
}

// -------------------------------------------
// 4. CUMPLEAÑOS Y FECHAS ESPECIALES
// -------------------------------------------

/**
 * Email de cumpleaños con descuento
 */
export function emailCumpleanos({
  nombreCliente,
  codigoDescuento,
  porcentajeDescuento,
  fechaExpiracion
}) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">¡Feliz cumpleaños, ${nombreCliente}!</h2>
      <p style="${styles.subtitle}">Los guardianes quieren celebrar con vos</p>

      <p style="${styles.text}">
        Hoy es tu día, y en Duendes del Uruguay queremos que lo celebres
        con un regalo especial.
      </p>

      ${discountCodeBox(codigoDescuento, `${porcentajeDescuento}% de descuento en tu próxima compra`)}

      <p style="${styles.textCenter}">
        Usá este código durante tu semana de cumpleaños y llevate
        un guardián con ${porcentajeDescuento}% off.
      </p>

      <div style="${styles.buttonContainer}">
        <a href="https://duendesdeluruguay.com/tienda" style="${styles.button}">Explorar guardianes</a>
      </div>

      <p style="${styles.textSmall}">
        Válido hasta el ${fechaExpiracion}. No acumulable con otras promociones.
      </p>

      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">
          Que este nuevo año de vida te traiga toda la magia que merecés. ✨
        </p>
      </div>
    </div>
  `;
  return baseTemplate(content, {
    banner: `🎂 ¡Feliz Cumpleaños! ${porcentajeDescuento}% OFF`,
    preheader: `¡Feliz cumpleaños ${nombreCliente}! Tenemos un regalo para vos 🎁`
  });
}

// -------------------------------------------
// 5. MI MAGIA Y EL CÍRCULO
// -------------------------------------------

/**
 * Bienvenida a Mi Magia
 */
export function emailBienvenidaMiMagia({
  nombreCliente,
  linkMiMagia,
  linkPrimerGuardian
}) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">Bienvenida a Mi Magia</h2>
      <p style="${styles.subtitle}">Tu portal personal está listo</p>

      <p style="${styles.text}">
        ${nombreCliente}, ahora tenés acceso a <strong style="color: ${colors.gold} !important;">Mi Magia</strong>,
        tu espacio personal donde encontrarás:
      </p>

      ${detailsTable([
        { label: '✨ Tus guardianes', value: 'Todos los que adoptaste' },
        { label: '📜 Canalizaciones', value: 'Mensajes de tus guardianes' },
        { label: '🔮 Lecturas', value: 'Tarot, runas, oráculos' },
        { label: '📦 Pedidos', value: 'Estado de tus envíos' }
      ])}

      <div style="${styles.buttonContainer}">
        <a href="${linkMiMagia}" style="${styles.button}">Entrar a Mi Magia</a>
      </div>

      ${linkPrimerGuardian ? `
      <p style="${styles.textSmall}">
        Tu primer guardián ya te está esperando ahí dentro.
      </p>
      ` : ''}
    </div>
  `;
  return baseTemplate(content, { preheader: `${nombreCliente}, tu portal Mi Magia está listo` });
}

/**
 * Bienvenida al Círculo
 */
export function emailBienvenidaCirculo({
  nombreCliente,
  linkCirculo,
  beneficios
}) {
  const beneficiosDefault = [
    { label: '🌙 Contenido exclusivo', value: 'Rituales, meditaciones, guías' },
    { label: '💫 Descuentos especiales', value: 'Ofertas solo para el Círculo' },
    { label: '🔮 Acceso anticipado', value: 'Nuevos guardianes antes que nadie' },
    { label: '✨ Comunidad', value: 'Conectá con otros buscadores' }
  ];

  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">Bienvenida al Círculo</h2>
      <p style="${styles.subtitle}">Ahora sos parte de algo especial</p>

      <p style="${styles.text}">
        ${nombreCliente}, entraste al Círculo de Duendes del Uruguay —
        un espacio reservado para quienes buscan algo más.
      </p>

      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">
          El Círculo no es solo una membresía. Es una comunidad de personas
          que creen en la magia y quieren cultivarla.
        </p>
      </div>

      <p style="${styles.textCenter}">
        <strong style="color: ${colors.gold} !important;">Tus beneficios:</strong>
      </p>

      ${detailsTable(beneficios || beneficiosDefault)}

      <div style="${styles.buttonContainer}">
        <a href="${linkCirculo}" style="${styles.button}">Explorar el Círculo</a>
      </div>
    </div>
  `;
  return baseTemplate(content, { preheader: `${nombreCliente}, bienvenida al Círculo` });
}

// -------------------------------------------
// 6. PROMOCIONES
// -------------------------------------------

/**
 * Email de promoción general
 */
export function emailPromocion({
  nombreCliente,
  titulo,
  subtitulo,
  mensaje,
  codigoDescuento,
  porcentajeDescuento,
  linkPromo,
  imagenBanner,
  fechaExpiracion
}) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">${titulo}</h2>
      ${subtitulo ? `<p style="${styles.subtitle}">${subtitulo}</p>` : ''}

      ${mensaje ? `<p style="${styles.text}">${nombreCliente ? `${nombreCliente}, ` : ''}${mensaje}</p>` : ''}

      ${codigoDescuento ? discountCodeBox(codigoDescuento, `${porcentajeDescuento}% de descuento`) : ''}

      <div style="${styles.buttonContainer}">
        <a href="${linkPromo}" style="${styles.button}">Ver promoción</a>
      </div>

      ${fechaExpiracion ? `
      <p style="${styles.textSmall}">
        Válido hasta el ${fechaExpiracion}
      </p>
      ` : ''}
    </div>
  `;
  return baseTemplate(content, {
    banner: codigoDescuento ? `🎁 ${porcentajeDescuento}% OFF con código ${codigoDescuento}` : null,
    preheader: subtitulo || titulo
  });
}

/**
 * Email 3x2
 */
export function emailPromo3x2({
  nombreCliente,
  linkPromo,
  fechaExpiracion
}) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">3x2 en Guardianes</h2>
      <p style="${styles.subtitle}">Llevá 3, pagá 2</p>

      <p style="${styles.text}">
        ${nombreCliente ? `${nombreCliente}, ` : ''}esta es tu oportunidad de armar tu propia
        familia de guardianes. Elegí 3 y el de menor valor es gratis.
      </p>

      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">
          Los guardianes son seres sociables. Cuando viven juntos,
          su magia se potencia.
        </p>
      </div>

      <div style="${styles.buttonContainer}">
        <a href="${linkPromo}" style="${styles.button}">Ver guardianes disponibles</a>
      </div>

      ${fechaExpiracion ? `
      <p style="${styles.textSmall}">
        Promoción válida hasta el ${fechaExpiracion}
      </p>
      ` : ''}
    </div>
  `;
  return baseTemplate(content, {
    banner: '🎁 3x2 - Llevá 3, pagá 2',
    preheader: '3x2 en guardianes - Llevá 3, pagá 2'
  });
}

// -------------------------------------------
// 7. POST-VENTA
// -------------------------------------------

/**
 * Seguimiento post-compra (7 días después)
 */
export function emailPostCompra7dias({
  nombreCliente,
  nombreGuardian,
  imagenGuardian,
  linkResena,
  linkMiMagia
}) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">¿Cómo va todo con ${nombreGuardian}?</h2>
      <p style="${styles.subtitle}">Ya pasó una semana juntos</p>

      ${imagenGuardian ? guardianCard({
        nombre: nombreGuardian,
        imagen: imagenGuardian
      }) : ''}

      <p style="${styles.text}">
        ${nombreCliente}, hace una semana que ${nombreGuardian} llegó a tu vida.
        Queremos saber cómo están.
      </p>

      <p style="${styles.text}">
        ¿Sentiste algo diferente? ¿Notaste cambios en tu energía, tu humor,
        tus sueños? Los guardianes trabajan en silencio, pero sus efectos
        se sienten.
      </p>

      <div style="${styles.buttonContainer}">
        <a href="${linkResena}" style="${styles.button}">Contar mi experiencia</a>
      </div>

      <p style="${styles.textSmall}">
        Tu reseña ayuda a otros a encontrar su guardián perfecto.
      </p>
    </div>
  `;
  return baseTemplate(content, { preheader: `${nombreCliente}, ¿cómo va todo con ${nombreGuardian}?` });
}

/**
 * Seguimiento post-compra (30 días)
 */
export function emailPostCompra30dias({
  nombreCliente,
  nombreGuardian,
  linkTienda,
  codigoDescuento
}) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}>Un mes de magia</h2>
      <p style="${styles.subtitle}">Gracias por confiar en nosotros</p>

      <p style="${styles.text}">
        ${nombreCliente}, ya pasó un mes desde que ${nombreGuardian} llegó a tu vida.
        Esperamos que haya sido un mes de transformación.
      </p>

      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">
          Los guardianes no vienen solos. Cuando uno llega, a veces
          trae el mensaje de que otro te está buscando.
        </p>
      </div>

      ${codigoDescuento ? `
      <p style="${styles.textCenter}">
        Como agradecimiento, te dejamos un 10% para tu próxima adopción:
      </p>
      ${discountCodeBox(codigoDescuento, '10% de descuento')}
      ` : ''}

      <div style="${styles.buttonContainer}">
        <a href="${linkTienda}" style="${styles.button}">Explorar guardianes</a>
      </div>
    </div>
  `;
  return baseTemplate(content, { preheader: `${nombreCliente}, un mes de magia con ${nombreGuardian}` });
}

// -------------------------------------------
// 8. NOTIFICACIONES ADMIN
// -------------------------------------------

/**
 * Notificación de nuevo pedido (para admin)
 */
export function emailNuevoPedidoAdmin({
  numeroOrden,
  nombreCliente,
  emailCliente,
  productos,
  total,
  direccion,
  linkAdmin
}) {
  const productosLista = productos.map(p => `• ${p.nombre} - $${p.precio}`).join('<br>');

  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">🎉 Nuevo Pedido #${numeroOrden}</h2>
      <p style="${styles.subtitle}">¡Tenemos trabajo!</p>

      ${detailsTable([
        { label: 'Cliente', value: nombreCliente },
        { label: 'Email', value: emailCliente },
        { label: 'Productos', value: productosLista },
        { label: 'Total', value: `$${total}` },
        { label: 'Dirección', value: direccion || 'Ver en admin' }
      ])}

      <div style="${styles.buttonContainer}">
        <a href="${linkAdmin}" style="${styles.button}">Ver pedido en admin</a>
      </div>
    </div>
  `;
  return baseTemplate(content, { preheader: `Nuevo pedido #${numeroOrden} de ${nombreCliente}` });
}

/**
 * Notificación de formulario completado (para admin)
 */
export function emailFormularioCompletadoAdmin({
  numeroOrden,
  nombreCliente,
  tipoFormulario,
  linkAdmin
}) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">📝 Formulario Completado</h2>
      <p style="${styles.subtitle}">Pedido #${numeroOrden}</p>

      ${detailsTable([
        { label: 'Cliente', value: nombreCliente },
        { label: 'Tipo', value: tipoFormulario },
        { label: 'Estado', value: 'Listo para canalizar' }
      ])}

      <div style="${styles.buttonContainer}">
        <a href="${linkAdmin}" style="${styles.button}">Ver datos del formulario</a>
      </div>
    </div>
  `;
  return baseTemplate(content, { preheader: `${nombreCliente} completó el formulario para #${numeroOrden}` });
}

// -------------------------------------------
// 9. TEST
// -------------------------------------------

/**
 * Email de prueba
 */
export function emailTest({ nombre }) {
  const content = `
    <div style="${styles.body}">
      <h2 style="${styles.title}">✨ Tu guardián te espera ✨</h2>
      <p style="${styles.subtitle}">Hola ${nombre}, este es un email de prueba</p>

      ${guardianCard({
        nombre: 'Lumina',
        imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2024/01/guardian-ejemplo.jpg',
        tipo: 'Guardiana de la Luz',
        categoria: 'Protección'
      })}

      <p style="${styles.text}">
        Este email muestra cómo se ven los mensajes de Duendes del Uruguay.
        Fondo negro profundo, acentos dorados, y toda la magia que merecés.
      </p>

      <div style="${styles.highlight}">
        <p style="${styles.highlightText}">
          ✨ "Cada guardián elige a su persona. Si llegaste hasta acá,
          no fue casualidad." ✨
        </p>
      </div>

      ${discountCodeBox('MAGIA15', '15% de descuento en tu próxima compra')}

      <div style="${styles.buttonContainer}">
        <a href="https://duendesdeluruguay.com/tienda" style="${styles.button}">Explorar guardianes</a>
      </div>

      <p style="${styles.textSmall}">
        Email de prueba · ${new Date().toLocaleString('es-AR')}
      </p>
    </div>
  `;
  return baseTemplate(content, {
    banner: '✨ Guardianes místicos hechos a mano ✨',
    preheader: `${nombre}, tu guardián te está esperando...`
  });
}

// ===========================================
// EXPORTAR TODO
// ===========================================

export default {
  // Compra y pedidos
  emailConfirmacionCompra,
  emailPedidoEnviado,
  emailPedidoEntregado,

  // Carrito abandonado
  emailCarritoAbandonado1h,
  emailCarritoAbandonado24h,
  emailCarritoAbandonado72h,

  // Canalizaciones y lecturas
  emailRegaloInvitacion,
  emailRecordatorio24h,
  emailRecordatorio72h,
  emailCanalizacionLista,
  emailLecturaLista,

  // Cumpleaños
  emailCumpleanos,

  // Mi Magia y Círculo
  emailBienvenidaMiMagia,
  emailBienvenidaCirculo,

  // Promociones
  emailPromocion,
  emailPromo3x2,

  // Post-venta
  emailPostCompra7dias,
  emailPostCompra30dias,

  // Admin
  emailNuevoPedidoAdmin,
  emailFormularioCompletadoAdmin,

  // Test
  emailTest,

  // Componentes reutilizables
  guardianCard,
  detailsTable,
  promoBanner,
  discountCodeBox,
  baseTemplate,

  // Estilos y colores (para uso externo)
  styles,
  colors,
};
