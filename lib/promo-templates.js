// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES DE PROMOCIONES
// Diseños predefinidos para banners promocionales
// ═══════════════════════════════════════════════════════════════════════════════

export const PROMO_TEMPLATES = {
  descuento: {
    nombre: 'Descuento',
    icono: '★',
    colores: {
      fondo: '#0a0a0a',
      textoTitulo: '#d4af37',
      textoSub: '#FDF8F0',
      botonFondo: '#d4af37',
      botonTexto: '#0a0a0a'
    },
    efectos: { sparkles: true, gradiente: false, borde: false },
    ejemploTitulo: '-20% EN TODO',
    ejemploSub: 'Por tiempo limitado'
  },

  nuevoGuardian: {
    nombre: 'Nuevo Guardián',
    icono: '✨',
    colores: {
      fondo: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      textoTitulo: '#d4af37',
      textoSub: '#FDF8F0',
      botonFondo: '#d4af37',
      botonTexto: '#0a0a0a'
    },
    efectos: { sparkles: true, gradiente: true, borde: false },
    ejemploTitulo: 'NUEVO: FINNIAN',
    ejemploSub: 'El Guardián del Bosque Dorado'
  },

  lunaNueva: {
    nombre: 'Evento Lunar',
    icono: '🌙',
    colores: {
      fondo: '#0d1b2a',
      textoTitulo: '#e0e1dd',
      textoSub: '#778da9',
      botonFondo: '#e0e1dd',
      botonTexto: '#0d1b2a'
    },
    efectos: { sparkles: false, gradiente: true, borde: false },
    ejemploTitulo: 'LUNA LLENA',
    ejemploSub: 'Ritual especial esta noche'
  },

  celebracionCelta: {
    nombre: 'Celebración Celta',
    icono: '☀',
    colores: {
      fondo: 'linear-gradient(135deg, #2d3a3a 0%, #1a2626 100%)',
      textoTitulo: '#c9a227',
      textoSub: '#a8b5a2',
      botonFondo: '#c9a227',
      botonTexto: '#1a2626'
    },
    efectos: { sparkles: false, gradiente: true, borde: true },
    ejemploTitulo: 'IMBOLC',
    ejemploSub: 'Despertar de la tierra'
  },

  vipCirculo: {
    nombre: 'VIP Círculo',
    icono: '◆',
    colores: {
      fondo: '#1a1a1a',
      textoTitulo: '#d4af37',
      textoSub: '#b8860b',
      botonFondo: 'transparent',
      botonTexto: '#d4af37',
      botonBorde: '#d4af37'
    },
    efectos: { sparkles: true, gradiente: false, borde: true },
    ejemploTitulo: 'EXCLUSIVO VIP',
    ejemploSub: 'Solo para el Círculo'
  },

  ultimaOportunidad: {
    nombre: 'Urgencia',
    icono: '⏰',
    colores: {
      fondo: '#8b0000',
      textoTitulo: '#ffffff',
      textoSub: '#ffcccb',
      botonFondo: '#ffffff',
      botonTexto: '#8b0000'
    },
    efectos: { sparkles: false, gradiente: false, borde: false },
    ejemploTitulo: 'ÚLTIMAS 24H',
    ejemploSub: 'Después desaparece'
  },

  estacion: {
    nombre: 'Estación',
    icono: '🌸',
    colores: {
      fondo: 'linear-gradient(135deg, #fdf8f0 0%, #f5e6d3 100%)',
      textoTitulo: '#2d3a3a',
      textoSub: '#5c6b5c',
      botonFondo: '#2d3a3a',
      botonTexto: '#fdf8f0'
    },
    efectos: { sparkles: false, gradiente: true, borde: false },
    ejemploTitulo: 'VERANO MÁGICO',
    ejemploSub: 'Colección especial'
  }
};

// Ubicaciones disponibles para banners
export const UBICACIONES = {
  header: {
    nombre: 'Header Principal',
    descripcion: 'Barra superior fija, visible en toda la web',
    size: 'header'
  },
  'mi-magia-promos': {
    nombre: 'Mi Magia - Sección Promociones',
    descripcion: 'Carrusel en la sección "Promociones Mágicas"',
    size: 'normal'
  },
  'mi-magia-popup': {
    nombre: 'Mi Magia - Popup al Entrar',
    descripcion: 'Modal que aparece 1 vez por sesión',
    size: 'popup'
  },
  'mi-magia-lateral': {
    nombre: 'Mi Magia - Lateral Flotante',
    descripcion: 'Banner pequeño en esquina inferior derecha',
    size: 'mini'
  },
  'circulo-exclusivo': {
    nombre: 'Círculo - Banner Exclusivo',
    descripcion: 'Solo visible para miembros del Círculo',
    size: 'normal'
  },
  'tienda-arriba': {
    nombre: 'Tienda - Arriba de Productos',
    descripcion: 'Banner horizontal sobre el grid de productos',
    size: 'normal'
  },
  'checkout': {
    nombre: 'Checkout - Antes de Pagar',
    descripcion: 'Recordatorio de la promo en el checkout',
    size: 'mini'
  }
};

// Audiencias disponibles
export const AUDIENCIAS = {
  todos: {
    nombre: 'Todos los visitantes',
    descripcion: 'Cualquier persona que visite la web'
  },
  circulo: {
    nombre: 'Solo miembros del Círculo',
    descripcion: 'Usuarios con membresía activa'
  },
  clientes: {
    nombre: 'Solo clientes',
    descripcion: 'Usuarios que han realizado al menos una compra'
  },
  nuevos: {
    nombre: 'Solo visitantes nuevos',
    descripcion: 'Usuarios que nunca han comprado'
  }
};

// Tipos de acción del botón
export const TIPOS_ACCION = {
  link: {
    nombre: 'Link personalizado',
    requiere: 'url'
  },
  cupon: {
    nombre: 'Tienda con cupón automático',
    requiere: 'codigoCupon'
  },
  producto: {
    nombre: 'Producto específico',
    requiere: 'productoId'
  },
  circulo: {
    nombre: 'Página del Círculo',
    requiere: null
  },
  whatsapp: {
    nombre: 'WhatsApp con mensaje',
    requiere: 'mensajeWhatsapp'
  }
};

// Función para generar CSS del banner
export function generarEstilosBanner(promo, size = 'normal') {
  const colores = promo.colores || PROMO_TEMPLATES.descuento.colores;
  const efectos = promo.efectos || {};

  const alturas = {
    header: '50px',
    normal: '200px',
    popup: '400px',
    mini: '80px'
  };

  return {
    container: {
      background: colores.fondo,
      height: alturas[size],
      borderRadius: size === 'header' ? '0' : '16px',
      border: efectos.borde ? `2px solid ${colores.textoTitulo}` : 'none',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px'
    },
    titulo: {
      color: colores.textoTitulo,
      fontSize: size === 'header' ? '16px' : size === 'mini' ? '14px' : '28px',
      fontWeight: '700',
      fontFamily: "'Cinzel', serif",
      marginBottom: size === 'header' ? '0' : '10px'
    },
    subtitulo: {
      color: colores.textoSub,
      fontSize: size === 'header' ? '14px' : size === 'mini' ? '12px' : '16px',
      fontFamily: "'Cormorant Garamond', serif"
    },
    boton: {
      background: colores.botonFondo,
      color: colores.botonTexto,
      border: colores.botonBorde ? `2px solid ${colores.botonBorde}` : 'none',
      padding: size === 'mini' ? '6px 12px' : '12px 24px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: size === 'mini' ? '12px' : '14px',
      cursor: 'pointer',
      marginTop: '15px'
    }
  };
}

export default {
  PROMO_TEMPLATES,
  UBICACIONES,
  AUDIENCIAS,
  TIPOS_ACCION,
  generarEstilosBanner
};
