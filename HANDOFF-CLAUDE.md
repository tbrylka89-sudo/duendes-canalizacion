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

#### 4. SISTEMA POST-COMPRA COMPLETO
**Incluye:**
- Certificado de canalización digital (diseño, generación, envío)
- Secuencia de emails:
  - Confirmación de compra
  - "Tu guardián está siendo preparado"
  - "Tu guardián está en camino"
  - "Ritual de activación" (post-entrega)
  - Seguimiento a la semana
  - Cumpleaños (descuento + regalo de runas)
- Integración con Mi Magia

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
**Qué verificar:**
- Alineación con estrategia inteligente
- Gamificación funcionando
- Generación de contenido eficiente
- Runas/moneda virtual
- Estudios energéticos

#### 11. EL CÍRCULO DE DUENDES
**Qué verificar:**
- Membresía funcionando
- Contenido exclusivo
- Valor percibido
- Estrategia de retención

#### 12. FORMULARIO INTELIGENTE DE COMPRA
**Qué hacer:** Revisar el formulario que llena el cliente al comprar

#### 13. SEO CON RANK MATH
**Qué hacer:** Configuración automática al 100 puntos
**Nota:** Usuario no tiene conocimiento de SEO, necesita ser automático

#### 14. VARIABLES DE HISTORIAS
**Pregunta del usuario:** Cuando genera historias y aprueba, ¿dónde van las variables que aparecen abajo?
**Investigar:** Verificar si se guardan en WooCommerce correctamente

### 🟢 PRIORIDAD BAJA (pero importante)

#### 15. ANALYTICS EN TIEMPO REAL
- Quién está conectado
- De dónde es
- Qué está mirando
- Si agrega al carrito
- Predicción de compra

#### 16. RECUPERACIÓN DE CARRITOS ABANDONADOS
Secuencia:
- Email 1 (1h): "El guardián sigue disponible"
- Email 2 (24h): "No todos están listos..."
- Email 3 (72h): "Alguien más lo está mirando"
- Email 4 (1 semana): "Dejó un mensaje para vos"

#### 17. APP DE CONTENIDO PARA REDES
**Nueva app integrada que:**
- Analice estadísticas de IG, FB, TikTok, Pinterest
- Sugiera contenido basado en lo que convierte
- Cree estrategias de contenido
- Genere ideas y posts

#### 18. HUB DE URLS ACTUALIZADO
Actualizar con todas las URLs importantes (WordPress + Vercel)

#### 19. DOCUMENTACIÓN MAESTRA
Actualizar las escrituras maestras para poder reconstruir todo si algo falla

#### 20. LIMPIEZA GENERAL
Eliminar lo que no sirve, lo que ya no se usa

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
