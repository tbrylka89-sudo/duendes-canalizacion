# Flujo de Bienvenida WhatsApp - Duendes del Uruguay

## Configuración en ManyChat

### Paso 1: Crear el Trigger
1. Ir a **Automation** > **+ New Automation**
2. Trigger: **WhatsApp** > **New Contact / First Message**
3. O usar: **Keyword** con palabra clave `*` (cualquier mensaje)

---

### Paso 2: Mensaje de Bienvenida (Primer nodo)

**Tipo:** Mensaje de texto

```
✨ Bienvenido/a al refugio de los Duendes del Uruguay ✨

Cada guardián que creamos tiene alma propia, una historia que contar, y está buscando a la persona correcta para acompañarla.

¿En qué puedo ayudarte hoy?
```

---

### Paso 3: Menú con Botones (Segundo nodo)

**Tipo:** Message with Buttons (máximo 3 botones por mensaje en WhatsApp)

#### Mensaje 1 - Primeros 3 botones:

**Texto:**
```
Elegí una opción:
```

**Botones:**
1. 📦 Envíos y precios
2. 🔮 Cómo funciona la canalización
3. 💳 Medios de pago

---

#### Mensaje 2 - Últimos 2 botones:

**Tipo:** Message with Buttons

**Texto:**
```
O si preferís:
```

**Botones:**
1. 🛒 Ver catálogo → URL: `https://www.duendesdeluruguay.com/tienda-magica/`
2. 💬 Hablar con nosotros → URL: `https://wa.me/59898690629`

---

## Respuestas a cada botón

### 📦 Envíos y precios

```
📦 ENVÍOS Y PRECIOS

🇺🇾 Uruguay:
• Montevideo: $350 (24-48hs)
• Interior: $450 (48-72hs)
• Gratis en compras mayores a $10.000

🌎 Internacional (DHL Express):
• Argentina: USD $45 (5-7 días)
• México: USD $55 (5-7 días)
• España: USD $60 (5-7 días)
• USA: USD $50 (5-7 días)
• Envío gratis en compras mayores a USD $1000

Todos los envíos incluyen seguimiento y van protegidos con magia extra ✨
```

**Botón:** ← Volver al menú

---

### 🔮 Cómo funciona la canalización

```
🔮 LA CANALIZACIÓN

Cuando adoptás un guardián, recibís mucho más que una figura artesanal.

1️⃣ Elegís tu guardián (o él te elige a vos)

2️⃣ Completás un breve formulario para que tu guardián te conozca

3️⃣ Thibisay, nuestra canalizadora, se conecta con tu guardián y escribe SU mensaje para vos

4️⃣ Recibís tu guardián en casa junto con:
   • Carta canalizada personal
   • Certificado de autenticidad
   • Guía de activación

Cada canalización es única e irrepetible, escrita especialmente para vos.

¿Querés conocer a los guardianes disponibles?
```

**Botones:**
1. 🛒 Ver guardianes → URL: `https://www.duendesdeluruguay.com/tienda-magica/`
2. ← Volver al menú

---

### 💳 Medios de pago

```
💳 MEDIOS DE PAGO

🇺🇾 Desde Uruguay:
• MercadoPago (tarjetas, transferencia)
• Transferencia bancaria directa
• Abitab / RedPagos

🌎 Desde el exterior:
• PayPal
• Tarjeta de crédito internacional
• Western Union

Todos los pagos son seguros y procesados al momento de la compra.

¿Alguna duda sobre pagos?
```

**Botones:**
1. 💬 Hablar con nosotros → URL: `https://wa.me/59898690629`
2. ← Volver al menú

---

## Flujo Visual (para copiar la estructura)

```
[Trigger: Cualquier mensaje nuevo]
           ↓
[Mensaje de Bienvenida]
           ↓
[Menú Botones 1-3] ←──────────────────┐
           ↓                          │
[Menú Botones 4-5]                    │
           ↓                          │
    ┌──────┼──────┬──────┬──────┐     │
    ↓      ↓      ↓      ↓      ↓     │
 Envíos  Canal  Pagos  Catálogo Hablar│
    │      │      │      │       │    │
    └──────┴──────┴──────┴───────┴────┘
         (Volver al menú)
```

---

## Notas Importantes

1. **WhatsApp limita a 3 botones por mensaje** - por eso dividimos en 2 mensajes

2. **Los botones de URL** (Catálogo y Hablar) abren directamente el link

3. **Los botones de respuesta** (Envíos, Canalización, Pagos) disparan otro mensaje

4. **Para el "Volver al menú"** - crear un botón que vuelva al nodo del menú principal

5. **Default Reply** - Configurar respuesta por defecto si escriben algo que no es un botón:
```
No entendí tu mensaje. Usá los botones del menú o escribí "menu" para ver las opciones.
```

---

## Keywords adicionales sugeridas

| Keyword | Respuesta |
|---------|-----------|
| `menu`, `inicio`, `hola` | Mostrar menú principal |
| `precio`, `envio`, `envío` | Ir a Envíos y precios |
| `canalización`, `canalizacion`, `carta` | Ir a Cómo funciona |
| `pago`, `pagar`, `transferencia` | Ir a Medios de pago |
| `catalogo`, `catálogo`, `tienda` | Enviar link de tienda |
| `humano`, `persona`, `hablar` | Enviar link de WhatsApp directo |

---

## Creado para Duendes del Uruguay
Febrero 2026
