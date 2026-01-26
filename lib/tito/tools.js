/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TITO 3.0 - SISTEMA DE TOOLS PARA CLAUDE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Este archivo define las herramientas (tools) que Tito puede usar.
 * Claude las llama directamente sin necesidad de parsear JSON.
 */

// ═══════════════════════════════════════════════════════════════
// DEFINICIÓN DE TOOLS PARA CLAUDE
// ═══════════════════════════════════════════════════════════════

export const TITO_TOOLS = [
  // ─────────────────────────────────────────────────────────────
  // PRODUCTOS Y CATÁLOGO
  // ─────────────────────────────────────────────────────────────
  {
    name: "mostrar_productos",
    description: "Muestra productos/guardianes del catálogo. Usar cuando el usuario quiere ver opciones, pide fotos, o pregunta qué hay disponible. También usar cuando querés recomendar guardianes basándote en lo que necesita.",
    input_schema: {
      type: "object",
      properties: {
        necesidad: {
          type: "string",
          description: "Filtrar por necesidad: proteccion, abundancia, amor, sanacion, paz, hogar. Dejar vacío para mostrar variados.",
          enum: ["proteccion", "abundancia", "amor", "sanacion", "paz", "hogar", ""]
        },
        cantidad: {
          type: "number",
          description: "Cantidad de productos a mostrar (1-6). Default: 3",
          default: 3
        },
        tipo: {
          type: "string",
          description: "Filtrar por tipo de guardián",
          enum: ["duende", "elfo", "hada", "gnomo", "mago", "bruja", "dragon", ""]
        }
      },
      required: []
    }
  },

  {
    name: "buscar_producto",
    description: "Buscar un producto específico por nombre. Usar cuando el usuario menciona un guardián por nombre o quiere info de uno en particular.",
    input_schema: {
      type: "object",
      properties: {
        nombre: {
          type: "string",
          description: "Nombre del producto a buscar"
        }
      },
      required: ["nombre"]
    }
  },

  {
    name: "verificar_stock",
    description: "Verificar si un guardián específico está disponible en este momento. Usar antes de confirmar que un producto está disponible o cuando el cliente pregunta si todavía hay stock.",
    input_schema: {
      type: "object",
      properties: {
        producto_id: {
          type: "number",
          description: "ID del producto en WooCommerce"
        },
        nombre_producto: {
          type: "string",
          description: "Nombre del producto (alternativo si no se tiene ID)"
        }
      }
    }
  },

  {
    name: "obtener_guardian_completo",
    description: "Obtener TODA la información de un guardián específico: historia completa, dones, sincrodestino, personalidad. Usar cuando el cliente quiere saber más detalles sobre un guardián en particular.",
    input_schema: {
      type: "object",
      properties: {
        identificador: {
          type: "string",
          description: "Nombre del guardián o su ID"
        }
      },
      required: ["identificador"]
    }
  },

  // ─────────────────────────────────────────────────────────────
  // PEDIDOS
  // ─────────────────────────────────────────────────────────────
  {
    name: "buscar_pedido",
    description: "Buscar información de un pedido existente. Usar cuando el usuario pregunta por su pedido, envío, tracking, o ya pagó.",
    input_schema: {
      type: "object",
      properties: {
        identificador: {
          type: "string",
          description: "Número de pedido, email del cliente, o nombre"
        }
      },
      required: ["identificador"]
    }
  },

  // ─────────────────────────────────────────────────────────────
  // PRECIOS Y MONEDAS
  // ─────────────────────────────────────────────────────────────
  {
    name: "calcular_precio",
    description: "Calcular precio en la moneda del cliente. SIEMPRE usar esto antes de dar un precio, para darlo en la moneda correcta.",
    input_schema: {
      type: "object",
      properties: {
        precio_usd: {
          type: "number",
          description: "Precio en dólares del producto"
        },
        pais: {
          type: "string",
          description: "Código de país del cliente (UY, AR, MX, CO, CL, PE, BR, ES, US)",
          enum: ["UY", "AR", "MX", "CO", "CL", "PE", "BR", "ES", "US", "EC", "PA"]
        },
      },
      required: ["precio_usd", "pais"]
    }
  },

  // ─────────────────────────────────────────────────────────────
  // MEMORIA Y CONTEXTO
  // ─────────────────────────────────────────────────────────────
  {
    name: "guardar_info_cliente",
    description: "Guardar información que el cliente compartió para recordarla después. Usar cuando el cliente dice su nombre, país, qué busca, situación personal, etc.",
    input_schema: {
      type: "object",
      properties: {
        campo: {
          type: "string",
          description: "Qué tipo de información guardar",
          enum: ["nombre", "pais", "necesidad", "situacion", "email", "telefono", "producto_interesado", "objecion", "nota"]
        },
        valor: {
          type: "string",
          description: "El valor a guardar"
        }
      },
      required: ["campo", "valor"]
    }
  },

  {
    name: "obtener_info_cliente",
    description: "Obtener información guardada del cliente actual. Usar para personalizar la conversación.",
    input_schema: {
      type: "object",
      properties: {},
      required: []
    }
  },

  // ─────────────────────────────────────────────────────────────
  // ACCIONES DE CIERRE / VENTA
  // ─────────────────────────────────────────────────────────────
  {
    name: "guiar_compra",
    description: "Guiar al cliente paso a paso para completar la compra en la tienda web. Usar cuando el cliente quiere comprar. Le das el link al producto y le explicás cómo hacer la compra.",
    input_schema: {
      type: "object",
      properties: {
        producto_id: {
          type: "string",
          description: "ID del producto que quiere comprar"
        },
        producto_url: {
          type: "string",
          description: "URL del producto si ya la tenés"
        }
      },
      required: []
    }
  },

  {
    name: "info_envios",
    description: "Dar información sobre envíos. Los datos de envío se completan en la web durante el checkout.",
    input_schema: {
      type: "object",
      properties: {
        pais: {
          type: "string",
          description: "País del cliente para dar info específica"
        }
      },
      required: []
    }
  },

  // ─────────────────────────────────────────────────────────────
  // FAQ Y CONOCIMIENTO
  // ─────────────────────────────────────────────────────────────
  {
    name: "consultar_faq",
    description: "Consultar información del FAQ para responder preguntas frecuentes sobre envíos, pagos, materiales, garantía, etc.",
    input_schema: {
      type: "object",
      properties: {
        tema: {
          type: "string",
          description: "Tema a consultar",
          enum: ["envios", "pagos", "materiales", "tamanos", "garantia", "canalizacion", "reserva", "visitas", "reventa", "miMagia"]
        }
      },
      required: ["tema"]
    }
  },

  {
    name: "info_mi_magia",
    description: "Dar información sobre la sección 'Mi Magia' - el portal exclusivo para clientes. USAR cuando pregunten sobre: cuidados del guardián, qué reciben después de comprar, canalización, cómo acceder a contenido exclusivo, QR del guardián.",
    input_schema: {
      type: "object",
      properties: {},
      required: []
    }
  },

  // ─────────────────────────────────────────────────────────────
  // ADMIN (solo para modo admin)
  // ─────────────────────────────────────────────────────────────
  {
    name: "admin_buscar_cliente",
    description: "[ADMIN] Buscar un cliente en la base de datos por email o nombre.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Email, nombre o teléfono a buscar"
        }
      },
      required: ["query"]
    }
  },

  {
    name: "admin_dar_regalo",
    description: "[ADMIN] Dar runas o tréboles a un cliente.",
    input_schema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Email del cliente"
        },
        tipo: {
          type: "string",
          enum: ["runas", "treboles"],
          description: "Tipo de regalo"
        },
        cantidad: {
          type: "number",
          description: "Cantidad a regalar"
        },
        mensaje: {
          type: "string",
          description: "Mensaje opcional para el cliente"
        }
      },
      required: ["email", "tipo", "cantidad"]
    }
  },

  {
    name: "admin_gestionar_circulo",
    description: "[ADMIN] Activar, extender o desactivar el Círculo de un cliente.",
    input_schema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Email del cliente"
        },
        accion: {
          type: "string",
          enum: ["activar", "extender", "desactivar"],
          description: "Acción a realizar"
        },
        dias: {
          type: "number",
          description: "Días a extender (solo si accion es 'extender')"
        }
      },
      required: ["email", "accion"]
    }
  },

  {
    name: "admin_ver_estadisticas",
    description: "[ADMIN] Ver estadísticas generales del negocio.",
    input_schema: {
      type: "object",
      properties: {
        tipo: {
          type: "string",
          enum: ["general", "ventas_hoy", "ventas_mes", "clientes", "circulo"],
          description: "Tipo de estadísticas"
        }
      },
      required: []
    }
  },

  {
    name: "admin_ver_pedidos",
    description: "[ADMIN] Ver lista de pedidos.",
    input_schema: {
      type: "object",
      properties: {
        estado: {
          type: "string",
          enum: ["pendientes", "procesando", "completados", "todos"],
          description: "Filtrar por estado"
        },
        limite: {
          type: "number",
          description: "Cantidad máxima a mostrar",
          default: 10
        }
      },
      required: []
    }
  },

  {
    name: "admin_enviar_email",
    description: "[ADMIN] Enviar un email a un cliente.",
    input_schema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Email del destinatario"
        },
        asunto: {
          type: "string",
          description: "Asunto del email"
        },
        mensaje: {
          type: "string",
          description: "Contenido del email"
        }
      },
      required: ["email", "asunto", "mensaje"]
    }
  },

  {
    name: "admin_sincronizar_woo",
    description: "[ADMIN] Sincronizar productos con WooCommerce.",
    input_schema: {
      type: "object",
      properties: {},
      required: []
    }
  }
];

// ═══════════════════════════════════════════════════════════════
// TOOLS FILTRADAS POR CONTEXTO
// ═══════════════════════════════════════════════════════════════

/**
 * Obtener tools según el contexto (cliente vs admin)
 */
export function getToolsParaContexto(esAdmin = false) {
  if (esAdmin) {
    return TITO_TOOLS; // Admin tiene acceso a todas
  }

  // Cliente solo tiene acceso a tools no-admin
  return TITO_TOOLS.filter(tool => !tool.name.startsWith('admin_'));
}

/**
 * Obtener tools mínimas para ManyChat (respuestas rápidas)
 */
export function getToolsParaManyChat() {
  const toolsPermitidas = [
    'mostrar_productos',
    'buscar_producto',
    'verificar_stock',
    'obtener_guardian_completo',
    'buscar_pedido',
    'calcular_precio',
    'guardar_info_cliente',
    'obtener_info_cliente',
    'consultar_faq'
  ];

  return TITO_TOOLS.filter(tool => toolsPermitidas.includes(tool.name));
}

export default TITO_TOOLS;
