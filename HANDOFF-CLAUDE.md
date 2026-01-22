# HANDOFF COMPLETO - DUENDES DEL URUGUAY

**INSTRUCCIÓN INICIAL:** Leé este archivo COMPLETO antes de hacer cualquier cosa. Es la memoria del proyecto y la lista de TODO lo que falta.

---

## ARQUITECTURA DEL SISTEMA

```
duendesdeluruguay.com (WordPress/WooCommerce)
├── Tienda principal (productos, checkout)
├── Test del Guardián ← FALTA REHACER (fue borrado)
├── Página Nosotros ← FALTA REHACER
├── Página Cómo Funciona ← FALTA ANALIZAR
├── Páginas de producto con CURCY ← FALTA MEJORAR
├── Enlaces a Mi Magia / El Círculo
└── Tito Chat (ManyChat widget)

duendes-vercel.vercel.app (Next.js)
├── /admin/generador-historias → Panel para crear historias (FUNCIONA)
├── /mi-magia → Portal del cliente post-compra
├── /mi-magia/circulo → Membresía paga
├── APIs de soporte
└── Sistema de conversión (/lib/conversion/)

ManyChat
├── Tito para IG/FB/WhatsApp
└── Flujos de conversación ← FALTA RECONFIGURAR
```

---

## ESTADO ACTUAL - QUÉ FUNCIONA Y QUÉ NO

### ✅ FUNCIONA (en Vercel)
- Generador de historias con sistema experto de conversión
- Hooks por categoría/subcategoría
- Cierres adaptativos por perfil psicológico
- Scoring de conversión (0-50)
- Arco emocional de 8 fases
- Batch inteligente con auto-distribución

### ❌ NO FUNCIONA / FALTA
- **Test del Guardián en WordPress** - FUE BORRADO, hay que rehacerlo
- **Integración WordPress ↔ Vercel** - No existe
- **Sistema completo de emails** - Solo estructura, no configurado
- **ManyChat optimizado** - Existe pero no convierte
- **CURCY bien explicado** - Funciona pero confunde clientes
- **DHL Express en checkout** - API conectada pero no aparece
- **SEO automático** - Rank Math instalado pero no configurado
- **Analytics en tiempo real** - No existe
- **Recuperación de carritos** - No existe
- **App de contenido para redes** - No existe

---

## LISTA COMPLETA DE TAREAS PENDIENTES

### 🔴 PRIORIDAD CRÍTICA

#### 1. TEST DEL GUARDIÁN EN WORDPRESS
**Estado:** Fue borrado accidentalmente. La página existe pero está vacía.
**Qué hacer:** Recrear desde cero en WordPress con las características del sistema inteligente:
- Perfilado psicológico (vulnerabilidad, dolor, estilo decisión, creencias)
- Preguntas que parecen espirituales pero clasifican
- Resultado que guía hacia productos específicos
- Guardar perfil para personalización futura
**Ubicación:** Página en WordPress (no en Vercel)
**IMPORTANTE:** Mantener el audio que ya existe en la página

#### 2. CURCY - PRECIOS POR GEOLOCALIZACIÓN
**Estado:** CURCY instalado pero confunde a los clientes
**Qué hacer:**
- Geolocalización automática
- Uruguay → Precio en pesos uruguayos (fijo)
- Otros países → Precio en USD + "(aproximadamente X en tu moneda)"
- FAQ debajo de cada producto explicando claramente cómo funciona
- Texto tipo: "No te preocupes, al momento de pagar tu banco convierte automáticamente"
- Actualización de tasas 1x día
**Ubicación:** WordPress/WooCommerce

#### 3. CONECTAR WORDPRESS ↔ VERCEL
**Qué hacer:**
- Enlaces desde WordPress a Mi Magia y El Círculo
- Autenticación compartida o flujo claro
- Cuando compran → acceso a Mi Magia
**Decisión pendiente:** ¿Mi Magia visible pero blurreado hasta que compren? ¿O solo accesible post-compra?

### 🟠 PRIORIDAD ALTA

#### 4. SISTEMA POST-COMPRA COMPLETO (CRÍTICO)

**A) CERTIFICADO DE CANALIZACIÓN ORIGINAL DIGITAL**
- Diseño profesional y místico
- Generación automática con datos del guardián
- Envío automático post-compra
- Descargable desde Mi Magia

**B) ACOMPAÑAMIENTO COMPLETO (desde ANTES hasta DESPUÉS)**

**ANTES de comprar:**
- Emails de bienvenida si hizo el test
- Recordatorios si vio productos
- "El guardián que miraste sigue esperando"

**CUANDO compra:**
- Email de confirmación inmediato
- "Tu guardián fue elegido, ahora comienza su preparación"
- Acceso a Mi Magia

**MIENTRAS espera:**
- "Tu guardián está siendo canalizado"
- "Tu guardián está recibiendo su energía"
- "Tu guardián está listo para viajar"
- "Tu guardián está en camino" (con tracking)

**DESPUÉS de recibir:**
- Ritual de activación (crea compromiso, justifica la compra)
- Instrucciones de conexión
- Invitación a comunidad

**C) POST-VENTA QUE MULTIPLICA**

1. **Ritual de activación**
   - Guía paso a paso para "activar" el guardián
   - Crea compromiso emocional
   - Justifica la inversión

2. **Diario de señales**
   - Invitar a registrar "coincidencias"
   - Activa confirmation bias
   - Crea engagement continuo

3. **Comunidad privada**
   - Pertenencia al grupo
   - Evangelización natural
   - Testimonios orgánicos

4. **Cross-sell espiritual**
   - "Tu guardián quiere un compañero"
   - "Estos guardianes complementan al tuyo"
   - Lógica de tríadas, complementos

5. **Testimonios**
   - "Contanos tu experiencia"
   - Solicitar reviews
   - Usar en marketing

**D) EMAILS DE TODO EL CICLO DE VIDA**
- Test completado
- Producto visto
- Carrito abandonado
- Compra realizada
- Envío preparándose
- Envío en camino
- Entrega realizada
- Seguimiento 1 semana
- Seguimiento 1 mes
- Cumpleaños
- Fechas especiales
- Nuevos productos relevantes
- Invitaciones a El Círculo
- TODOS orientados a conversión y retención

#### 5. MANYCHAT - TITO RECONFIGURADO
**Problema actual:** La gente lo usa de psicólogo gratis sin comprar
**Qué hacer:**
- Speech orientado a CONVERSIÓN, no a terapia
- Detectar tipo de cliente (va a comprar o no)
- Límites claros en conversación
- Guiar hacia el Test → Productos
- Flujos para: IG, FB, WhatsApp Business (número nuevo porque el original da error)
- Modo "Universo" para admin (acceso completo)
- Fichas inteligentes del cliente
**Ubicación:** ManyChat + integración con WordPress

#### 6. EMAILS DE TODO EL SISTEMA
- Emails de Mi Magia
- Emails del Círculo
- Emails de compras
- Emails de mensajes enviados
- Recuperación de carritos abandonados (secuencia de 4 emails)
- TODOS deben seguir estrategia de conversión

#### 7. DHL EXPRESS EN CHECKOUT
**Estado:** API conectada pero no aparece como opción
**Qué hacer:** Verificar configuración, hacer que aparezca, calcule correctamente

### 🟡 PRIORIDAD MEDIA

#### 8. PÁGINA "NOSOTROS"
**Estado:** Existe en HTML
**Qué hacer:** Rehacer con estructura inteligente de conversión

#### 9. PÁGINA "CÓMO FUNCIONA"
**Qué hacer:** Analizar y optimizar para conversión

#### 10. MI MAGIA - VERIFICAR Y MEJORAR
**Portal del cliente post-compra. Debe incluir:**
- Canalizaciones de sus compras
- Estudios energéticos (lectura de runas, etc.)
- Runas/moneda virtual para canjear
- Historial de compras
- Mensajes de sus guardianes
- Diario de señales
- Acceso a comunidad

**Verificar:**
- ¿Está alineado con la estrategia inteligente?
- ¿La generación de contenido es eficiente como el generador de historias?
- ¿Qué falta agregar?
- ¿Cómo mejorar la experiencia?

**GAMIFICACIÓN:**
- Sistema de puntos/runas
- Niveles de usuario
- Logros desbloqueables
- Recompensas por engagement
- Incentivos para volver
- Badges especiales

#### 11. EL CÍRCULO DE DUENDES
**Membresía paga de suscripción. Debe incluir:**
- Contenido exclusivo
- Canalizaciones especiales
- Acceso a Tito premium
- Comunidad privada
- Eventos especiales
- Descuentos exclusivos

**Verificar:**
- ¿Valor percibido justifica el precio?
- ¿Estrategia de retención funciona?
- ¿Contenido se genera eficientemente?
- ¿Está alineado con la estrategia de conversión?
- ¿Cómo hacer que quieran quedarse?

#### 12. FORMULARIO INTELIGENTE DE COMPRA
**El formulario que llena el cliente al comprar el duende**
- Revisar qué preguntas hace
- ¿Recopila datos útiles para personalización?
- ¿Alimenta el sistema de perfilado?
- ¿Es amigable y no invasivo?
- ¿Las respuestas se usan para la canalización?

**Debe capturar:**
- Datos personales básicos
- Intención de la compra
- Momento de vida
- Para quién es (uno mismo, regalo, sorpresa)
- Preguntas de conexión emocional
- Foto (rostro + mano) para lectura de aura - SOLO MAYORES DE 18

#### 13. SEO CON RANK MATH
**Qué hacer:** Configuración automática al 100 puntos
**Nota:** Usuario no tiene conocimiento de SEO, necesita ser automático

#### 14. VARIABLES DE HISTORIAS - INVESTIGAR
**Pregunta del usuario:** Cuando genera historias en el Batch Inteligente y aprueba, debajo de cada historia aparecen variables (hook usado, sincrodestino, score, etc.). ¿Dónde van a parar cuando se guarda en WooCommerce?

**Investigar:**
- ¿Se guardan como metadatos del producto?
- ¿Se pierden?
- ¿Dónde deberían guardarse?
- ¿Se pueden ver en el admin de WooCommerce?
- ¿Se usan para algo después?

**Si no se guardan:** Implementar que se guarden para:
- Trackear qué hooks convierten más
- No repetir sincrodestinos
- Analytics de conversión

### 🟢 SISTEMA INTELIGENTE COMPLETO (lo que Claude propuso)

#### 15. PERFILADO DEL COMPRADOR
El test debe clasificar sin que lo noten:
- Nivel de vulnerabilidad (alta/media/baja)
- Dolor principal (soledad, dinero, salud, relaciones)
- Estilo de decisión (impulsivo, analítico, emocional)
- Poder adquisitivo (preguntas indirectas)
- Creencias (escéptico, creyente, buscador)
**Resultado:** cada persona ve contenido DIFERENTE según su perfil

#### 16. MOTOR DE SINCRONICIDAD PERSONALIZADA
Usar datos del usuario para crear "señales" que parezcan mágicas:
- Día de la semana → "Los martes son días de Marte, de acción..."
- Letras del nombre → "Tu nombre y el del guardián tienen la misma cantidad..."
- Cumpleaños cerca → "Este mes es tu portal..."
- Hora de visita → "Llegaste a las 3:33, los números hablan..."

#### 17. SECUENCIA DE MICRO-COMPROMISOS
No pedir compra directo. Escalar:
1. "¿Querés saber qué guardián te corresponde?" → Test gratis
2. "¿Querés que te avise si aparece uno para vos?" → Email
3. "¿Querés ver el mensaje que tiene para vos?" → Preview
4. "¿Querés reservarlo antes de que desaparezca?" → Seña
5. Compra completa

#### 18. OBJECIONES PREEMPTIVAS EN HISTORIAS
Dentro de cada historia, responder dudas antes de que las piensen:
- "Sé que una parte tuya está diciendo 'es solo un muñeco'..."
- "El precio puede parecer alto. Pero ¿cuánto gastaste en cosas que no cambiaron nada?"
- "Si pensás 'esto no es para mí', preguntate por qué seguís leyendo"

#### 19. SISTEMA DE ESCASEZ REAL + PERCIBIDA
En ficha del producto:
- "3 personas mirando esto ahora" (real o simulado)
- "Última vez que uno así estuvo disponible: hace 47 días"
- "Este guardián solo se canaliza cuando él quiere"

#### 20. TESTIMONIOS ESTRATÉGICOS POR OBJECIÓN
No genéricos. Específicos:
- Para escéptico: "Yo tampoco creía, hasta que..."
- Para el que no tiene plata: "Junté de a poco, valió cada peso"
- Para el que tiene muchos: "Tengo 7 y cada uno trabaja diferente"
- Para el que duda: "Casi no lo compro. Fue el mejor error que no cometí"

#### 21. ANALYTICS DE CONVERSIÓN EMOCIONAL
Dashboard que muestre:
- Qué historias convierten más
- Qué hooks funcionan por perfil
- Dónde abandonan (qué párrafo)
- Qué palabras correlacionan con compra
- A/B testing automático de variantes

### 🔵 MANYCHAT COMPLETO

#### 22. SPEECH DE TITO (no solo flujos)
**Problema:** Lo usan de psicólogo gratis
**Solución:**
- Orientado a CONVERSIÓN, no terapia
- Límites claros: guiar al Test → Productos
- Detectar si va a comprar o no
- Si solo quiere hablar: cortar amablemente y redirigir

#### 23. FLUJOS COMPLETOS PARA:
- Instagram (DM + comentarios)
- Facebook (Messenger + comentarios)
- WhatsApp Business (NÚMERO NUEVO - el original da error con API de FB)
- Flujo de comentarios inteligente que convierta

#### 24. TITO MODO UNIVERSO (para admin)
- Acceso completo a todo
- Fichas inteligentes del cliente
- Ver historial de conversaciones
- Estadísticas de conversión

### 🟣 EMAILS ESPECÍFICOS

#### 25. SECUENCIA DE CUMPLEAÑOS
- Mail automático la semana del cumpleaños
- Descuento especial
- Regalo de runas o estudio energético
- Pensado para ella específicamente

#### 26. RECUPERACIÓN DE CARRITOS ABANDONADOS
- Email 1 (1h): "El guardián que viste sigue disponible. Por ahora."
- Email 2 (24h): "No todos están listos. Pero si volvés a pensar en él..."
- Email 3 (72h): "Alguien más lo está mirando. Solo te aviso."
- Email 4 (1 semana): "[Nombre del guardián] dejó un mensaje para vos antes de irse."

### 🟤 INFRAESTRUCTURA

#### 27. ANALYTICS EN TIEMPO REAL
- Quién está conectado
- De dónde es
- Qué está mirando
- Si agrega al carrito
- Predicción de compra

#### 28. APP DE CONTENIDO PARA REDES SOCIALES
**Nueva app integrada que:**
- Se conecte a IG, FB, TikTok, Pinterest
- Analice estadísticas de cada red
- Vea qué contenido funciona mejor
- Sugiera y genere contenido basado en conversión
- Cree estrategias basadas en perfil de cliente objetivo
- Aconseje qué tipo de contenido necesitamos
- Sea experta en todo lo que ya sabemos del proyecto

#### 29. HUB DE URLS ACTUALIZADO
Todas las URLs importantes:
- WordPress (páginas, productos, admin)
- Vercel (Mi Magia, Círculo, admin)
- ManyChat
- APIs
- Todo accesible de forma fácil e inteligente

#### 30. DOCUMENTACIÓN MAESTRA ACTUALIZADA
Las "escrituras maestras" para poder reconstruir todo si algo falla:
- Generador de historias
- Sistema de conversión
- Todo lo que se modificó
- Actualizar con los últimos cambios

#### 31. LIMPIEZA GENERAL
- Eliminar lo que no sirve
- Eliminar lo que ya no se usa
- Código muerto
- Páginas obsoletas

#### 32. TODO CONECTADO Y FUNCIONANDO
**CRÍTICO:** Verificar que:
- Ningún flujo en la web falle
- Mi Magia conecte correctamente
- El Círculo conecte correctamente
- WordPress ↔ Vercel funcione perfecto
- ManyChat ↔ Todo lo demás funcione
- No haya UN SOLO punto de falla
- Todo funcione a la PERFECCIÓN

#### 33. DECISIÓN PENDIENTE: ACCESO A MI MAGIA
¿Cómo manejar el acceso queriendo CONVERTIR siempre?
**Opciones:**
- A) Visible pero blurreado hasta que compren (genera curiosidad)
- B) Accesible solo cuando pagan (exclusividad)
- C) Algunas secciones gratis, otras de pago
**Definir con el usuario**

---

## FILOSOFÍA DEL SISTEMA INTELIGENTE

Todo debe diseñarse para CONVERTIR. Esto incluye:

### Perfilado del Comprador
El test clasifica sin que lo noten:
- Nivel de vulnerabilidad (alta/media/baja)
- Dolor principal (soledad, dinero, salud, relaciones)
- Estilo de decisión (impulsivo, analítico, emocional)
- Creencias (escéptico, creyente, buscador)

### Contenido Fijo vs Adaptativo
| FIJO (todos ven igual) | ADAPTATIVO (privado) |
|------------------------|----------------------|
| Historia del guardián | Resultado del test |
| Descripción producto | Emails de seguimiento |
| Sincrodestino | Recomendaciones personalizadas |
| Precio | Orden de productos |

### Motor de Sincronicidad
Usar datos del usuario para crear "señales" que parezcan mágicas:
- Día de la semana → "Los martes son días de Marte..."
- Letras del nombre → "Tu nombre y el del guardián tienen la misma cantidad..."
- Cumpleaños cerca → "Este mes es tu portal..."

### Secuencia de Micro-compromisos
1. "¿Querés saber qué guardián te corresponde?" → Test
2. "¿Querés que te avise si aparece uno?" → Email
3. "¿Querés ver su mensaje?" → Preview
4. "¿Querés reservarlo?" → Seña
5. Compra completa

---

## ACCESOS DISPONIBLES

### WordPress/WooCommerce
- URL: https://duendesdeluruguay.com
- WC API: Credenciales en .env.local (WC_CONSUMER_KEY, WC_CONSUMER_SECRET)

### Vercel
- URL: https://duendes-vercel.vercel.app
- Repo: GitHub (auto-deploy en push a main)

### ManyChat
- Requiere acceso separado (preguntar credenciales)

---

## ARCHIVOS CLAVE EN VERCEL

```
/CLAUDE.md                    → Biblia del proyecto (tono, reglas)
/lib/conversion/              → Sistema experto de conversión
  ├── hooks.js               → Hooks de apertura por categoría
  ├── sincrodestinos.js      → Eventos mágicos
  ├── cierres.js             → Cierres por perfil psicológico
  ├── arco.js                → Estructura emocional
  └── scoring.js             → Puntuación de conversión
/app/admin/generador-historias/ → UI del generador
/app/api/admin/historias/     → API que genera con Claude
/app/mi-magia/                → Portal del cliente
```

---

## CÓMO EMPEZAR

1. **Si vas a trabajar en WordPress:** Necesitás acceso a wp-admin
2. **Si vas a trabajar en Vercel:** Todo está en este repo
3. **Si vas a trabajar en ManyChat:** Pedí credenciales

**Prioridad sugerida:**
1. Test del Guardián (crítico - está roto)
2. CURCY (clientes confundidos)
3. Conexión WordPress ↔ Vercel
4. Sistema de emails
5. El resto en orden

---

## RECORDATORIO FINAL

- La web principal es WordPress (duendesdeluruguay.com)
- Mi Magia y El Círculo están en Vercel
- El generador de historias es para ADMIN, no para clientes
- Todo debe orientarse a CONVERSIÓN
- El cliente típico: mujeres 25-55, momento de transición/crisis
- NUNCA explotar vulnerabilidad, siempre aportar valor genuino

---

*Última actualización: 2026-01-22*
