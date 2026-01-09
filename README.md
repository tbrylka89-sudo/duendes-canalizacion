# 🍀 Duendes del Uruguay - Sistema de Canalización

Sistema automático que genera guías de canalización personalizadas para cada compra.

## ¿Qué hace?

1. **Recibe webhook de WooCommerce** cuando alguien compra
2. **Espera 4 horas** (crea expectativa)
3. **Genera con IA (Claude)** una guía ÚNICA y personalizada
4. **Crea página web hermosa** donde el cliente puede verla
5. **Permite descargar PDF**
6. **Envía email** con el link (próximamente)

## 📋 INSTRUCCIONES DE INSTALACIÓN

### Paso 1: Subir a GitHub

1. Creá un repositorio nuevo en GitHub (privado)
2. Subí todos estos archivos

### Paso 2: Conectar con Vercel

1. En Vercel, hacé clic en **"Add New Project"**
2. Seleccioná **"Import Git Repository"**
3. Conectá tu cuenta de GitHub
4. Elegí el repositorio que creaste
5. Hacé clic en **"Deploy"**

### Paso 3: Agregar Vercel KV (Base de datos)

1. En tu proyecto de Vercel, andá a **"Storage"**
2. Hacé clic en **"Create Database"**
3. Elegí **"KV"**
4. Dale un nombre: `duendes-kv`
5. Hacé clic en **"Create"**

### Paso 4: Configurar Variables de Entorno

En Vercel, andá a **Settings > Environment Variables** y agregá:

| Variable | Valor |
|----------|-------|
| `ANTHROPIC_API_KEY` | Tu API key de Claude |
| `WORDPRESS_URL` | `https://duendesuy.10web.cloud` |
| `WC_CONSUMER_KEY` | Tu consumer key de WooCommerce |
| `WC_CONSUMER_SECRET` | Tu consumer secret de WooCommerce |

### Paso 5: Configurar Webhook en WooCommerce

1. En WordPress, andá a **WooCommerce > Ajustes > Avanzado > Webhooks**
2. Hacé clic en **"Añadir webhook"**
3. Configurá:
   - **Nombre:** Canalización Vercel
   - **Estado:** Activo
   - **Tema:** Pedido creado
   - **URL de entrega:** `https://TU-PROYECTO.vercel.app/api/webhook`
   - **Secreto:** (dejalo vacío o poné uno)
4. Guardá

### Paso 6: Obtener claves de WooCommerce

1. En WordPress, andá a **WooCommerce > Ajustes > Avanzado > API REST**
2. Hacé clic en **"Añadir clave"**
3. Configurá:
   - **Descripción:** Vercel Canalización
   - **Usuario:** Tu usuario admin
   - **Permisos:** Lectura
4. Generá y copiá las claves

## 🔗 URLs del sistema

- **Webhook:** `https://TU-PROYECTO.vercel.app/api/webhook`
- **Guía del cliente:** `https://TU-PROYECTO.vercel.app/guardian/[ID]`
- **Cron automático:** Se ejecuta cada hora

## 🧪 Probar manualmente

Para generar una guía manualmente (sin esperar 4 horas):

```bash
curl -X POST https://TU-PROYECTO.vercel.app/api/generar \
  -H "Content-Type: application/json" \
  -d '{"guardianId": "ID-DEL-PEDIDO", "forceGenerate": true}'
```

## 📁 Estructura del proyecto

```
/
├── app/
│   ├── layout.js          # Layout principal
│   ├── globals.css        # Estilos premium
│   ├── page.js            # Página inicio
│   ├── guardian/
│   │   └── [id]/
│   │       ├── page.js    # Guía personalizada
│   │       └── not-found.js
│   └── api/
│       ├── webhook/
│       │   └── route.js   # Recibe compras
│       └── generar/
│           └── route.js   # Genera contenido
├── package.json
├── vercel.json            # Config + cron
└── .env.example           # Variables ejemplo
```

## ❓ Problemas comunes

**"No hay pedidos pendientes"**
- El webhook no está llegando. Verificá la URL en WooCommerce.

**"Error de API Key"**
- Verificá que la variable ANTHROPIC_API_KEY esté bien configurada.

**"Producto no encontrado"**
- Las claves de WooCommerce no tienen permisos de lectura.

---

Con amor y magia 🍀
Duendes del Uruguay
