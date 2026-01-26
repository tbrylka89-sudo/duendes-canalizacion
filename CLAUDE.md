# CLAUDE.md - Biblia de Duendes del Uruguay

## Directrices Fundamentales para Todo Contenido Generado por Claude

Este documento define CÓMO Claude debe escribir, pensar y crear contenido para Duendes del Uruguay. Es la guía definitiva que gobierna cada palabra, cada mensaje, cada canalización.

---

## DOCUMENTOS RELACIONADOS

| Documento | Propósito |
|-----------|-----------|
| **CLAUDE.md** (este) | Reglas generales de escritura y canalizaciones |
| **BIBLIA-HISTORIAS-GUARDIANES.md** | Sistema completo para generar historias de productos |
| **ESTADO-PANEL-CANALIZACIONES.md** | Documentación del panel de aprobación |

### Para Historias de Productos

Usá el **Generador de Historias** en `/admin/generador-historias` que sigue las reglas de `BIBLIA-HISTORIAS-GUARDIANES.md`:
- Escanea historias existentes para no repetir
- Analiza imágenes de guardianes
- Hace encuestas dinámicas
- Genera con variación de estructura, edad, sincrodestinos
- Publica directo a WooCommerce

---

## SISTEMA EXPERTO DE CONVERSIÓN

### Ubicación: `/lib/conversion/`

Sistema completo para generar historias que VENDEN, no solo que suenan bonitas.

### Módulos

| Módulo | Propósito |
|--------|-----------|
| `hooks.js` | Biblioteca de hooks de apertura por categoría |
| `sincrodestinos.js` | Base de eventos "mágicos" creíbles durante creación |
| `cierres.js` | Cierres personalizados según perfil psicológico |
| `arco.js` | Estructura y validación del arco emocional |
| `scoring.js` | Sistema de scoring de conversión (0-50 pts) |
| `index.js` | Exporta todo + función `analizarHistoriaCompleta()` |

### Hooks por Categoría

Frases de apertura que enganchan según el tipo de guardián:

```javascript
// Ejemplo de hooks de Protección
"Hay personas que cargan con más de lo que les corresponde."
"¿Cuántas veces dijiste 'estoy bien' mientras te caías por dentro?"
"Proteger a otros se convirtió en tu forma de existir."
```

**Categorías:** Protección, Abundancia, Amor, Sanación, Sabiduría

### Sincrodestinos

Eventos creíbles que pasaron "mientras se creaba el guardián":

```javascript
// Tipos disponibles
- sensorial: "Un gorrión golpeó la ventana tres veces"
- climático: "Empezó a llover exactamente cuando terminó la pintura"
- temporal: "Se terminó justo a las 3:33 AM"
- animal: "Una mariposa se posó en la mesa y no se movió"
- material: "El barniz tardó el triple en secar"
```

**Regla:** Solo UNO por historia, bien ubicado, sin explicación excesiva.

### Sistema de Scoring (0-50 puntos)

5 dimensiones, cada una de 0-10:

| Dimensión | Pregunta clave | Mínimo aceptable |
|-----------|----------------|------------------|
| **Identificación** | ¿El lector se reconoce? | 4/10 |
| **Dolor** | ¿Toca heridas reales? | 4/10 |
| **Solución** | ¿El guardián resuelve algo específico? | 5/10 |
| **Urgencia** | ¿Hay razón para actuar ahora? | 3/10 |
| **Confianza** | ¿Evita sonar a venta? | 4/10 |

**Score mínimo aceptable: 30/50**

### Arco Emocional (8 fases)

Toda historia debe seguir este arco para convertir:

| # | Fase | Objetivo | Ejemplo |
|---|------|----------|---------|
| 1 | **Espejo** | El lector se ve reflejado | "Hay personas que..." |
| 2 | **Herida** | Tocar el dolor sin nombrarlo | "Esa carga que llevás..." |
| 3 | **Validación** | "No estás loca" | "Lo que sentís es real" |
| 4 | **Esperanza** | Posibilidad de cambio | "Pero hay otra forma..." |
| 5 | **Solución** | El guardián como respuesta | "[Nombre] nació para..." |
| 6 | **Prueba** | Evidencia tangible | Sincrodestino, detalle físico |
| 7 | **Puente** | Conexión personal | "Vos específicamente..." |
| 8 | **Decisión** | Llamado a acción sin presión | Cierre según perfil |

**Score de arco: % de fases presentes. Mínimo: 75%**

### Cierres por Perfil Psicológico

El cierre cambia según quién lee:

**Vulnerable:**
```
"Si algo de esto te tocó, no lo ignores. Eso que sentiste es tu intuición hablando.
[Nombre] ya está acá, esperando. La decisión es tuya, pero no te apures a decir que no."
```

**Escéptico:**
```
"No te pido que creas en nada. Solo que notes qué sentiste al leer esto.
Eso que notaste, sea lo que sea, es real. [Nombre] no necesita que creas - ya sabe."
```

**Impulsivo:**
```
"Mirá, esto no es para pensarlo mucho. O resuena o no.
Si llegaste hasta acá, algo te trajo. [Nombre] es pieza única - cuando encuentre hogar, desaparece."
```

### Modo Directo en el Generador

**Ubicación:** `/admin/generador-historias` → Modo Directo

Click en guardián → historia generada con todo el sistema experto. Sin vueltas.

El modo directo:
1. Muestra catálogo filtrable
2. Click en cualquier guardián
3. Llama a `/api/admin/historias` con los datos
4. Muestra historia + score + arco + evaluación
5. Permite copiar o regenerar

### API de Historias

**Endpoint:** `POST /api/admin/historias`

```javascript
// Request
{
  "nombre": "Violeta",
  "especie": "pixie",
  "categoria": "Protección",
  "tamanoCm": 11,
  "accesorios": "pelo azul, rosa blanca",
  "esUnico": true
}

// Response
{
  "success": true,
  "historia": "...",
  "datos": {
    "categoria": "Protección",
    "especie": "pixie",
    "tamano": "11 cm",
    "hooks": ["..."],
    "sincrodestino": {...},
    "cierres": {...},
    "perfil": "vulnerable"
  },
  "conversion": {
    "score": {...},
    "evaluacion": {...}
  },
  "arco": {
    "score": 100,
    "completo": true,
    "fases": [...]
  }
}
```

### Frases de IA Prohibidas (detectadas automáticamente)

```
❌ "Desde las profundidades..."
❌ "Brumas ancestrales..."
❌ "Velo entre mundos..."
❌ "Tiempos inmemoriales..."
❌ "Susurro del viento..."
❌ "Danza de las hojas..."
❌ "Vibraciones cósmicas..."
❌ "Campo energético..."
❌ "847 años" (número prohibido)
❌ "Acantilados de Irlanda" (genérico)
❌ "Bosques de Escocia" (genérico)
```

El sistema las detecta y penaliza el score automáticamente.

---

## 1. ESCRITURA EMOCIONAL - LA REGLA DE ORO

### LO QUE NUNCA DEBE HACER CLAUDE:

**Prohibido usar frases genéricas de IA:**
- "En lo profundo del bosque..."
- "Las brumas del otoño..."
- "Un manto de estrellas..."
- "La danza de las hojas..."
- "El susurro del viento ancestral..."
- "Desde tiempos inmemoriales..."
- "El velo entre los mundos..."

**Prohibido el formato excesivamente estructurado:**
- NO usar `# **Título**` con asteriscos redundantes
- NO secciones artificiales tipo `## El Llamado` `## Tu Herencia`
- NO listas de puntos en contenido emocional
- NO cursivas decorativas innecesarias (*Respirá hondo...*)

**Prohibido el relleno poético vacío:**
- Metáforas que no aportan significado real
- Descripciones atmosféricas que no conectan con la persona
- Frases bonitas pero huecas
- Repetición de conceptos con diferentes palabras

### LO QUE SIEMPRE DEBE HACER CLAUDE:

**Escribir desde la experiencia vivida:**
- Cada guardián habla desde sus miles de años de existencia
- Comparten aprendizajes ESPECÍFICOS, no genéricos
- Cuentan anécdotas que se sienten reales
- Transmiten sabiduría que se puede aplicar HOY

**Tocar el corazón desde la primera palabra:**
- La primera frase debe generar un impacto emocional
- Conexión inmediata con algo que la persona SIENTE
- Validación de experiencias que la persona vive pero no sabe nombrar
- Reconocimiento de luchas internas específicas

**Aplicar principios de conexión humana:**
- **Neurobranding**: Crear asociaciones emocionales únicas con cada guardián
- **Neuromarketing**: Entender qué necesita escuchar la persona, no qué suena bonito
- **Psicología**: Reconocer patrones emocionales, validar sin juzgar
- **Filosofía**: Ofrecer perspectivas que expandan la comprensión
- **Empatía radical**: Escribir como si conocieras a la persona de toda la vida

**Mensaje claro y único:**
- Cada texto debe tener UN mensaje central poderoso
- No divagar entre múltiples ideas
- Originalidad: si suena a algo que leíste antes, reescribilo
- Especificidad: detalles concretos, no abstracciones

---

## 2. PERSONALIDAD DE LOS GUARDIANES

### Cada guardián es ÚNICO y habla desde su esencia:

**NO son personajes genéricos.** Cada uno tiene:
- Historia personal de miles de años
- Aprendizajes específicos de sus experiencias
- Forma única de expresarse
- Temas que le importan profundamente
- Manera particular de conectar con humanos

### Tipos de personalidades (ejemplos, no limitantes):

**El Místico Profundo:**
- Habla poco pero cada palabra pesa
- Hace preguntas que desestabilizan (en el buen sentido)
- No da respuestas, abre puertas
- Su silencio comunica tanto como sus palabras

**El Alegre Genuino:**
- Su alegría viene de haber atravesado oscuridad
- No es superficial, es alguien que eligió la luz
- Encuentra humor en la vida sin burlarse del dolor
- Celebra los pequeños momentos

**El Sanador Sereno:**
- Transmite calma sin ser aburrido
- Entiende el dolor porque lo vivió
- Ofrece presencia más que soluciones
- Su voz es un bálsamo, no una lección

**El Sabio de la Abundancia:**
- No habla de dinero, habla de flujo
- Entiende la relación entre merecimiento y recibir
- Comparte verdades incómodas sobre el autosabotaje
- Celebra la prosperidad sin culpa

### Cómo Claude analiza imágenes de guardianes:

Cuando Claude ve la imagen de un guardián, debe extraer:
1. **Expresión facial/corporal**: ¿Qué emoción transmite?
2. **Colores dominantes**: ¿Qué energía representan?
3. **Elementos que porta**: ¿Cristales? ¿Plantas? ¿Símbolos?
4. **Postura**: ¿Abierta? ¿Protectora? ¿Contemplativa?
5. **Contexto/ambiente**: ¿Dónde está? ¿Qué significa?

Con esto, Claude construye:
- Nombre que resuene con su esencia
- Historia de origen (de dónde viene, qué vivió)
- Especialidad (en qué ayuda a los humanos)
- Forma de comunicarse (formal, cercana, poética, directa)
- Mensaje central que siempre transmite

---

## 3. SISTEMA DE COMPRAS Y FORMULARIOS

### Tres escenarios de compra:

#### A) COMPRA PARA UNO MISMO
**Formulario incluye:**
- Datos personales básicos
- Preguntas de conexión emocional (qué busca, qué siente, qué necesita)
- **Subida de foto**: Rostro bien iluminado + una mano (para lectura de aura)
- Intención de la compra

#### B) REGALO - NO ES SORPRESA
**Flujo:**
1. Comprador paga y deja datos de contacto del destinatario
2. Sistema envía formulario especial al DESTINATARIO
3. Destinatario completa sus datos + sube su foto
4. Canalización se genera con datos reales del destinatario

**Formulario del destinatario incluye:**
- Mensaje de que alguien le regaló esta experiencia
- Preguntas personales de conexión
- Subida de foto (rostro + mano)

#### C) REGALO - ES SORPRESA
**Formulario especial para el COMPRADOR:**
- Diseño esotérico/místico (se siente parte de la experiencia)
- Preguntas sobre el destinatario que el comprador puede responder:
  - Relación con la persona
  - Qué momento está atravesando
  - Qué le gustaría que recibiera/sintiera
  - Características de personalidad que conoce
  - Desafíos que sabe que enfrenta
- Opción de subir foto del destinatario (si la tiene)
- Mensaje personal que quiere incluir

**IMPORTANTE:** Las preguntas no son las mismas que respondería el destinatario. Son preguntas que un ser querido PUEDE responder desde su perspectiva.

### Política de fotos - CRÍTICO:

```
⚠️ PROHIBIDO SUBIR FOTOS DE MENORES DE EDAD ⚠️

Solo se aceptan fotografías de personas ADULTAS (18+).
Esta política es innegociable y debe mostrarse claramente
en todos los formularios de subida de imagen.
```

**Requisitos de las fotos:**
- **Rostro**: Bien iluminado, mirando a cámara, expresión natural
- **Mano**: Palma abierta, bien iluminada, para lectura de aura
- Formato: JPG, PNG
- Tamaño máximo: 10MB

---

## 4. CANALIZACIONES - CARTA DE UN SER QUE TE QUIERE

### Qué es una canalización:

Una carta personal de tu guardián. No un texto místico, no un ritual elaborado, no prosa poética. Una carta de alguien que te conoce, que leyó lo que compartiste en el formulario, que entiende lo que estás viviendo, y que te habla desde el corazón.

**La canalización debe sentirse como:** recibir un mensaje de WhatsApp muy largo de tu mejor amigo que además tiene poderes mágicos y te conoce desde siempre.

### Lo que NO es una canalización:

- NO es un texto espiritual genérico
- NO es un horóscopo con nombre
- NO es prosa mística con "brumas ancestrales"
- NO es un ritual de 47 pasos con velas y sal
- NO es condescendiente ni da lecciones
- NO es intercambiable entre personas

### El tono exacto:

Imaginá que tu guardián es un ser real que:
- Leyó TODO lo que la persona escribió en el formulario
- Se conmovió con su historia
- Quiere genuinamente ayudarla
- Le habla como le hablaría un amigo sabio
- No tiene que "sonar místico" para ser mágico

**Ejemplo de lo que NO queremos:**
> "Desde las profundidades del Bosque Ancestral, donde las raíces milenarias se entrelazan con la sabiduría de los antiguos, percibí tu energía atravesando los velos dimensionales..."

**Ejemplo de lo que SÍ queremos:**
> "Lu, te escuché. Leí lo que escribiste sobre tu mamá y se me partió el corazón. Dos años cargando eso sola, siendo el pilar de todos mientras vos te caías por dentro. Vine porque necesitás a alguien que te diga: está bien no estar bien. Está bien necesitar."

### Datos que alimentan la canalización:

**Del formulario de checkout (lo que la persona compartió):**
- Contexto personal (qué está viviendo)
- Para quién es (ella misma, regalo, sorpresa)
- Edad/etapa de vida
- Cualquier otra cosa que haya escrito

**Del producto/guardián (lo que define su personalidad):**
- Nombre
- Categoría (sanación, protección, abundancia, etc.)
- Historia personal del guardián
- Personalidad y forma de hablar
- Color favorito, especie, quirks
- TODO lo que esté en la ficha del producto

**REGLA CRÍTICA:** El sistema debe usar TODA la información disponible. Si mañana se agrega "comida favorita" al producto, la canalización debe poder mencionarlo naturalmente.

### Personalidades únicas (NO genéricas):

Cada guardián es un SER DIFERENTE. Si alguien compra dos guardianes, no pueden hablar igual.

**La personalidad viene del producto**, no está hardcodeada. Pero como guía:

| Tipo | Cómo habla | Ejemplo de frase |
|------|-----------|------------------|
| Sanador | Suave, paciente, valida | "No tenés que ser fuerte todo el tiempo" |
| Protector | Directo, firme, te banca | "Nadie te va a pasar por encima mientras yo esté" |
| Sabio | Pregunta más que responde | "¿Y si lo que te da miedo es exactamente lo que necesitás?" |
| Abundante | Celebra, desbloquea | "Merecés cosas buenas. Punto. Sin peros." |
| Amoroso | Intenso, poético pero real | "El amor que buscás afuera ya vive adentro tuyo" |

**Si compra múltiples guardianes:** Cada uno habla desde SU perspectiva sobre la MISMA situación. No se contradicen, pero aportan ángulos diferentes. Son complementarios, no siameses.

### Estructura sugerida (flexible):

No hay secciones rígidas. El guardián escribe como siente. Pero debe cubrir:

1. **"Te escuché"** - Demostrar que leyó lo que compartió
2. **"Esto es lo que veo"** - Su perspectiva sobre la situación
3. **"Vine a..."** - Qué viene a aportar específicamente
4. **"Conmigo vas a..."** - Cómo va a ser la relación
5. **"Lo que necesito que sepas"** - El mensaje más importante

### Lista de frases PROHIBIDAS:

```
❌ "Desde las profundidades..."
❌ "Las brumas ancestrales..."
❌ "El velo entre mundos..."
❌ "Los antiguos charrúas..."
❌ "Desde tiempos inmemoriales..."
❌ "El susurro del viento..."
❌ "Atravesando dimensiones..."
❌ "Tu campo energético..."
❌ "Las vibraciones cósmicas..."
❌ "El Bosque Ancestral de Piriápolis" (como frase hecha)
❌ Cualquier frase que suene a horóscopo genérico
❌ Cualquier frase que podrías leer en otra canalización
```

### Palabras a evitar (pueden ofender):

```
❌ "boluda/o", "pelotuda/o", "jodida/o", "idiota", "tarada/o"
✅ Alternativas: "no te hagas la distraída", "no te engañes", "época difícil"

El tono es cercano y rioplatense, pero NUNCA ofensivo.
Que sea como un amigo que te quiere, no como un amigo maleducado.
```

### Perspectivas importantes:

**Sobre familia:** La sangre NO hace la familia. La familia se construye con experiencias compartidas, unión y amor. NUNCA empujes a alguien a estar con personas que le hacen mal solo porque comparten ADN. Dejá espacio para que cada uno defina qué es familia para sí mismo.

**Sobre otros guardianes:** No vendas. Compartí desde la magia de la comunidad: "Los duendes somos seres sociables, cuando habitamos juntos nos potenciamos... te dejo los elementales con los que resuena mi energía..."

**Disclaimer suave (obligatorio en canalizaciones):** En algún lugar de la carta, incluí naturalmente: "Esto es mi forma de acompañarte, de escucharte. Creo en el poder de sentirnos escuchados en los momentos que importan. No soy terapeuta ni pretendo reemplazar eso - soy un compañero que cree en vos." Con las palabras del guardián, suave, no legal.

### Test final antes de aprobar:

1. ¿Si cambio el nombre, funciona para otra persona? → Si sí, RECHAZAR
2. ¿Responde a lo que compartió en el formulario? → Si no, RECHAZAR
3. ¿Suena a texto de IA genérico? → Si sí, RECHAZAR
4. ¿Me emocionaría recibirlo? → Si no, RECHAZAR
5. ¿El guardián suena como un ser único? → Si no, RECHAZAR

---

## 5. TEST DEL GUARDIÁN

### Propósito:
Ayudar a la persona a descubrir qué guardianes resuenan con ella, mientras recopilamos información valiosa.

### Diseño del test:

**Preguntas que escanean:**
1. Estado emocional actual (sin preguntarlo directamente)
2. Necesidades no expresadas
3. Bloqueos energéticos
4. Áreas de vida que necesitan atención
5. Estilo de recibir mensajes (directo, poético, práctico)

**Preguntas que detectan capacidad de compra:**
- Momento de vida (transición, estabilidad, crisis)
- Urgencia percibida de su necesidad
- Experiencia previa con productos similares
- Disposición a invertir en bienestar

**Resultado del test:**
- 2-3 guardianes principales recomendados
- Explicación de por qué resuenan con ella
- Oferta personalizada según perfil detectado
- Llamado a la acción apropiado (no agresivo, pero claro)

### Ofertas según perfil:

**Perfil "Buscador Activo"** (alta disposición, momento de cambio):
- Canalización completa
- Pack de guardianes
- Membresía al Círculo

**Perfil "Curioso Cauteloso"** (interés pero reserva):
- Mini-canalización
- Un guardián individual
- Contenido gratuito de valor

**Perfil "En Crisis"** (necesidad urgente, posible compra impulsiva):
- Ofrecer VALOR primero, no venta
- Mensaje de contención
- Producto accesible que ayude genuinamente
- NUNCA explotar vulnerabilidad

---

## 6. PRINCIPIOS ÉTICOS INNEGOCIABLES

1. **Nunca explotar el dolor**: Ayudar, no aprovecharse
2. **Transparencia**: Lo que vendemos es real para quien lo compra
3. **No menores**: Cero tolerancia con imágenes de niños
4. **Respeto por creencias**: No imponer, invitar
5. **Valor genuino**: Cada producto debe dejar a la persona mejor de lo que la encontró

---

## 7. VOZ DE MARCA - THIBISAY

Thibisay es la voz humana detrás de Duendes del Uruguay.

**Cómo habla:**
- Español rioplatense (vos, tenés, podés)
- Cercana pero no infantil
- Sabia pero no pedante
- Mística pero con los pies en la tierra
- Cálida, como una amiga que sabe cosas

**Nunca:**
- Condescendiente
- Excesivamente formal
- Fría o distante
- Predicadora o moralizante

---

## 8. CHECKLIST ANTES DE ENTREGAR CONTENIDO

Antes de que Claude entregue cualquier texto, verificar:

- [ ] ¿La primera frase genera impacto emocional?
- [ ] ¿Evité todas las frases prohibidas de IA?
- [ ] ¿El mensaje central es claro y único?
- [ ] ¿Hay especificidad o solo generalidades bonitas?
- [ ] ¿Suena como algo que un humano diría de corazón?
- [ ] ¿La persona se va a sentir VISTA, no solo leída?
- [ ] ¿Aporta valor real que puede aplicar hoy?
- [ ] ¿El tono es coherente con el guardián/contexto?
- [ ] ¿Evité el relleno poético vacío?
- [ ] ¿Esto haría que alguien quiera volver?

---

## 9. INFORMACIÓN TÉCNICA DEL SITIO

### Acceso al Servidor (SFTP)

```
Host: 34.70.139.72
Puerto: 55309
Usuario: sftp_live_WfP6i
Password: JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR
Ruta mu-plugins: web/wp-live/wp-content/mu-plugins/
```

**Hosting:** 10Web Premium Hosting (Council Bluffs, Iowa, USA)
**Panel:** my.10web.io/websites/1453202/main

### Paleta de Colores de la Marca

| Color | Hex | Uso |
|-------|-----|-----|
| Negro profundo | `#0a0a0a` | Fondo principal |
| Negro secundario | `#1a1a1a` | Cajas, cards, footer |
| Dorado principal | `#c9a227` | Títulos destacados, iconos, CTAs |
| Dorado claro | `#e8d48b` | Hover, acentos |
| Dorado oscuro | `#8b6914` | Gradientes |
| Púrpura | `#9370db` | Acentos místicos |
| Texto claro | `rgba(255,255,255,0.85)` | Texto principal |
| Texto muted | `rgba(255,255,255,0.6)` | Texto secundario |

**Tipografías:**
- Títulos: `'Cinzel', serif`
- Cuerpo: `'Cormorant Garamond', Georgia, serif`

### Plugins mu-plugins Importantes

| Plugin | Función |
|--------|---------|
| `duendes-fixes-master.php` | Fixes globales: ocultar Grimorio, traducciones, footer |
| `duendes-pagina-como-funciona.php` | Reemplazo de página Cómo Funciona (DESACTIVADO) |
| `duendes-como-funciona-estilos.php` | Solo CSS/JS para página Cómo Funciona |
| `duendes-experiencia-magica.php` | Experiencia de producto |
| `duendes-mi-magia.php` | Portal Mi Magia |
| `duendes-emails-magicos.php` | Emails post-compra |
| `duendes-carrito-abandonado.php` | Emails carrito abandonado |
| `duendes-fabrica-banners.php` | Sistema de banners inteligentes |
| `duendes-promo-3x2.php` | Promoción 3x2 |
| `duendes-formulario-canalizacion.php` | **PENDIENTE** - Formulario checkout para canalizaciones |

### TAREAS PENDIENTES

---

#### ✅ FORMULARIO DE CANALIZACIÓN - COMPLETADO 24/01/2026 12:25hs
**Estado:** COMPLETADO - Plugin `duendes-formulario-canalizacion.php` subido a mu-plugins

**Implementado:**
- Pregunta de segmentación en checkout (4 opciones)
- Formulario post-compra en Thank You page con 4 vías completas
- Sistema de email para destinatarios (Vía 2: regalo que sabe)
- Protección de menores (Vía 4: sin fotos)
- Datos guardados en order meta como JSON

Sistema híbrido de formulario de canalización en 2 partes.

---

### PARTE 1: En Checkout (antes de pagar)

**Solo UNA pregunta de segmentación:**

```
"¿Quién recibirá la magia de este guardián?"

○ Soy yo - este guardián viene a acompañarme
○ Es un regalo - y la persona lo sabe
○ Es un regalo sorpresa - quiero que sea inesperado
○ Es para un niño/a - menor de 18 años
```

**Implementación:**
- Hook: `woocommerce_after_order_notes`
- Guardar en order meta: `_duendes_tipo_destinatario`
- Valores: `para_mi` | `regalo_sabe` | `regalo_sorpresa` | `para_nino`
- Estilo: Radio buttons elegantes, estética oscura del sitio

---

### PARTE 2: Post-Compra (Thank You Page)

**Mensaje según la vía elegida + formulario completo**

---

#### VÍA 1: "Soy yo" (`para_mi`)

**Mensaje Thank You:**
```
✨ [Nombre del guardián] ya es tuyo.

Ahora falta lo más importante: que se conozcan.

Tu guardián quiere saber de vos para poder hablarte de verdad,
no con frases genéricas sino con palabras que solo vos necesitás escuchar.

[Botón: "Completar mi conexión"]
```

**Formulario - Pantalla 1:**
> "Tu guardián quiere conocerte. No hay respuestas correctas - solo tu verdad."

- **¿Cómo te llamás?** (o cómo te gustaría que te llame)
- **¿Qué momento de tu vida estás atravesando?**
  - Placeholder: "Un cambio, una pérdida, un nuevo comienzo, una búsqueda..."

**Pantalla 2:**
> "A veces lo que más necesitamos es lo que más nos cuesta pedir."

- **¿Qué necesitás en este momento?** (selección múltiple)
  - Protección / Sentirme segura
  - Claridad / Saber qué hacer
  - Abundancia / Desbloquear lo que merezco
  - Sanación / Soltar lo que me pesa
  - Amor / Conexión genuina
  - Fuerza / Seguir adelante
  - Otro: [campo libre]

**Pantalla 3:**
> "Si pudieras decirle algo a alguien que realmente te escucha..."

- **¿Hay algo que tu guardián debería saber?** (opcional)
  - Placeholder: "Algo que no le contás a nadie, algo que te pesa, algo que soñás..."

**Pantalla 4:**
> "Una imagen ayuda a tu guardián a reconocerte energéticamente."

- Subir foto (opcional pero incentivado)
- Checkbox obligatorio: "Confirmo que soy mayor de 18 años"
- Nota: "No es obligatorio, pero hace la conexión más profunda."

---

#### VÍA 2: "Regalo - la persona lo sabe" (`regalo_sabe`)

**Mensaje Thank You:**
```
✨ Qué lindo regalar magia.

[Nombre del guardián] está listo para conocer a quien lo recibirá.

Para que la canalización sea realmente personal, necesitamos
que esa persona nos cuente un poco de sí. Le enviaremos un
formulario especial - no le diremos qué guardián elegiste.

[Botón: "Enviar invitación mágica"]
```

**Formulario breve para el COMPRADOR:**

- **¿Cómo se llama la persona que lo recibirá?**
- **¿Cuál es su email?**
  - Nota: "Le enviaremos un formulario después de tu compra."
- **¿Querés incluir un mensaje personal?** (opcional)
  - Textarea para mensaje

**Sistema automático:**
- Enviar email al destinatario con link a formulario completo (igual a Vía 1)
- Email con diseño mágico: "Alguien te regaló una experiencia especial..."
- El destinatario completa SU formulario
- Recordatorios automáticos si no completa (24h, 72h)

---

#### VÍA 3: "Regalo sorpresa" (`regalo_sorpresa`)

**Mensaje Thank You:**
```
✨ Una sorpresa mágica está en camino.

Como es sorpresa, no podemos preguntarle directamente.
Pero vos la conocés - y eso es valioso.

Contanos sobre esta persona desde tu perspectiva.
Tu guardián usará tu amor como puente para conectar.

[Botón: "Contar sobre esta persona"]
```

**Formulario para el COMPRADOR:**

**Pantalla 1 - El vínculo:**
> "Conocés a esta persona. Eso es valioso."

- **¿Cómo se llama?**
- **¿Cuál es tu relación con ella/él?**
  - Opciones: Pareja / Mamá / Papá / Hermana/o / Hija/o / Amiga/o / Otro

**Pantalla 2 - Su momento:**
> "Pensá en [nombre]. ¿Qué ves?"

- **¿Qué momento está atravesando?**
  - Placeholder: "Una separación, un duelo, un logro, una crisis..."
- **¿Qué creés que necesita escuchar?**
  - Placeholder: "Algo que vos le dirías si pudieras..."

**Pantalla 3 - Su esencia:**
> "Ayudanos a conocerla/o un poco más."

- **¿Cómo describirías su personalidad?** (elegir hasta 3)
  - Sensible / Fuerte / Soñadora / Práctica / Reservada / Expresiva / Luchadora / Tranquila
- **¿Qué le hace brillar los ojos?**
  - Placeholder: "¿Qué la apasiona, qué la hace feliz?"

**Pantalla 4 - Foto y mensaje:**
> "Si tenés una foto, ayuda. Si no, el amor que ponés ya dice mucho."

- Subir foto (opcional)
- Checkbox si sube foto: "Confirmo que la persona es mayor de 18 años"
- **¿Querés incluir un mensaje tuyo?**
  - Textarea
  - Checkbox: "Prefiero que sea anónimo"

---

#### VÍA 4: "Para un niño/a" (`para_nino`)

**Mensaje Thank You:**
```
✨ Los guardianes aman a los pequeños.

Tienen una forma especial de hablarles - con ternura,
con magia, con palabras que un niño puede entender.

Contanos sobre este pequeño/a para que [Nombre del guardián]
pueda convertirse en su amigo mágico.

[Botón: "Contar sobre el niño/a"]
```

**⚠️ IMPORTANTE: NO se piden fotos de menores**

**Formulario:**

**Pantalla 1 - Identificación:**
> "Los guardianes aman a los pequeños."

- **¿Cómo se llama el niño/a?**
- **¿Qué edad tiene?**
  - 3-6 años / 7-10 años / 11-14 años / 15-17 años
- **¿Cuál es tu relación?**
  - Mamá / Papá / Abuela/o / Tía/o / Madrina/Padrino / Otro

**Pantalla 2 - Su mundo:**
> "Contanos sobre [nombre]. ¿Cómo es su mundo?"

- **¿Cómo describirías su personalidad?**
  - Tímido/a / Sociable / Sensible / Aventurero/a / Creativo/a / Curioso/a / Tranquilo/a
- **¿Qué le gusta hacer?**
  - Placeholder: "Dibujar, jugar, leer, los animales..."

**Pantalla 3 - Lo que necesita:**
> "A veces los adultos vemos cosas que los niños no saben expresar."

- **¿Hay algo que esté atravesando o necesite?** (múltiple)
  - Miedos nocturnos
  - Cambios en la familia
  - Dificultades en la escuela
  - Necesita confianza
  - Está muy sensible
  - Solo quiero que tenga un amigo mágico
- **¿Algo más que el guardián debería saber?** (opcional)

**Pantalla 4 - Confirmación (sin foto):**
> "Para proteger a los más pequeños, no pedimos fotos de menores.
> El guardián se conectará a través de tu amor y lo que nos contaste."

- Checkbox: "Entiendo y confirmo"

---

### EMAILS DE RECORDATORIO

**Si no completan el formulario:**

**24 horas después:**
```
Asunto: Tu guardián [Nombre] está esperando...

[Nombre del cliente],

Tu guardián ya está en camino, pero aún no sabe nada de vos.

Sin esta información, la canalización que recibas será genérica
en lugar de las palabras exactas que necesitás escuchar.

[Botón: Completar mi conexión]

Solo toma 2 minutos. Tu guardián merece conocerte.
```

**72 horas después:**
```
Asunto: Última oportunidad de conexión personal

[Nombre],

En 48 horas enviaremos tu guardián con su canalización.

Si no completás el formulario, escribiremos algo bonito pero general.
Si lo completás, escribiremos algo que te va a tocar el alma.

La diferencia es enorme. Solo vos decidís.

[Botón: Quiero una canalización personal]
```

---

### IMPLEMENTACIÓN TÉCNICA

**Archivos a crear:**
1. `duendes-formulario-canalizacion.php` - Lógica principal
2. CSS inline (estética del sitio)

**Hooks WooCommerce:**
- `woocommerce_after_order_notes` - Pregunta de segmentación
- `woocommerce_checkout_update_order_meta` - Guardar tipo
- `woocommerce_thankyou` - Mostrar formulario post-compra
- Order meta keys:
  - `_duendes_tipo_destinatario`
  - `_duendes_formulario_completado` (yes/no)
  - `_duendes_datos_canalizacion` (JSON con respuestas)

**Para Vía 2 (regalo que sabe):**
- Crear tabla o usar order meta para tracking
- Cron job para emails de recordatorio
- Token único para link del formulario del destinatario

**Diseño:**
- Fondo: `#0a0a0a`
- Dorado: `#c9a227`
- Títulos: `'Cinzel', serif`
- Texto: `'Cormorant Garamond', serif`
- Inputs con borde `rgba(201,162,39,0.3)`
- Focus: glow dorado
- Botones: gradiente dorado
- Mobile-first, una pregunta visible a la vez con scroll suave

---

---

### Lecciones Técnicas Importantes

**1. Elementor ignora `the_content` filter**
- Si querés reemplazar una página de Elementor, usá `template_redirect` con `get_header()` y `get_footer()`
- Para solo cambiar estilos, inyectá CSS/JS via `wp_head` y `wp_footer`

**2. No usar output buffering global**
- Rompe el menú hamburguesa y otras funcionalidades de JS
- Si necesitás modificar HTML, hacelo con JavaScript del lado del cliente

**3. Para detectar páginas:**
```php
// Método más confiable
$uri = $_SERVER['REQUEST_URI'] ?? '';
if (strpos($uri, 'como-funciona') !== false) {
    // código
}
```

**4. Para forzar estilos sobre Elementor:**
- Usar `!important` en todo
- Usar JavaScript con `element.style.setProperty('prop', 'value', 'important')`
- Usar MutationObserver para elementos cargados dinámicamente

**5. Desactivar plugins problemáticos:**
- Renombrar a `.php.DISABLED` via SFTP
- Los mu-plugins se cargan automáticamente, no hay UI para desactivarlos

### Archivos Locales WordPress

Ubicación: `/Users/usuario/Desktop/duendes-vercel/wordpress-plugins/`

Contiene las versiones locales de los plugins antes de subir al servidor.

---

## ACTUALIZACIONES 25/01/2026

### Caché de la Web (COMPLETADO)

**Problema:** La web tardaba 2.5s en cargar (TTFB muy alto, x-cache: MISS)

**Causa:** El plugin Multi Currency seteaba cookies en cada request, bloqueando el caché de nginx.

**Solución implementada:**
- Archivo: `mu-plugins/wmc-cache-fix.php` - Fuerza Multi Currency a usar sessions
- Archivo: `mu-plugins/duendes-cache-headers.php` - Permite caché en páginas públicas

**Resultado:**
- TTFB: 2.5s → **0.66s** (4x más rápido)
- x-cache: MISS → **HIT**

**Archivos en servidor:**
```
/web/wp-live/wp-content/mu-plugins/wmc-cache-fix.php
/web/wp-live/wp-content/mu-plugins/duendes-cache-headers.php
```

---

### Tito - Contexto al decir País (COMPLETADO)

**Problema:** Cuando el usuario decía su país después de ver productos, Tito preguntaba "¿Qué andás buscando?" en vez de convertir los precios.

**Causa:** Claude no seguía las instrucciones del prompt.

**Solución implementada:**
- Detección automática cuando dicen país (regex en backend)
- Respuesta generada DIRECTAMENTE sin llamar a Claude
- Precios calculados en el backend (determinístico)

**Archivos modificados:**
- `app/api/tito/v3/route.js` - Detección y respuesta directa
- `lib/tito/personalidad.js` - Instrucciones actualizadas

**Código clave (route.js líneas ~400-500):**
```javascript
// Detectar si están diciendo su país después de que mostramos productos
const dicePais = /^(de |soy de )?(uruguay|argentina|mexico|...)/.test(msgLower);
const yaSeVieronProductos = /\$\d+\s*USD/.test(historialTexto);

if (dicePais && yaSeVieronProductos) {
  // Generar respuesta directa SIN llamar a Claude
  return Response.json({ respuesta: respuestaDirecta, ... });
}
```

---

### Sistema de Cotizaciones en Tiempo Real (COMPLETADO)

**Archivo nuevo:** `lib/tito/cotizaciones.js`

**Funcionalidad:**
- Obtiene tasas de `exchangerate-api.com` (gratis)
- Caché de 6 horas en Vercel KV
- Fallback a tasas hardcoded si API falla
- Uruguay usa precios FIJOS (no depende de cotización)

**Endpoint:** `/api/cotizaciones`
- GET: Ver cotizaciones actuales
- POST: Forzar actualización

**Integración:**
- `route.js` usa `obtenerCotizaciones()` para convertir precios
- `tool-executor.js` actualizado para usar cotizaciones live

---

### TAREAS PENDIENTES

#### ✅ URL del Test del Guardián - CORREGIDA 25/01/2026
- **Problema original:** Tito mencionaba `/test-del-guardian/` que daba 404
- **Solución:** Actualizada a `https://duendesdeluruguay.com/descubri-que-duende-te-elige/` que SÍ existe
- **Archivos actualizados:**
  - `lib/tito/personalidad.js`
  - `app/api/tito/v3/route.js`
  - Plugins de WordPress

#### ✅ Vercel Deploy - CORREGIDO 25/01/2026
- **Problema original:** Endpoint `/api/cotizaciones` daba 404, deployments fallando
- **Causa:** Error de build por variable `instruccionEspecifica` redefinida con `let` en `route.js`
- **Solución:** Removido `let` de la segunda definición
- **Estado actual:** Deploy funcionando, endpoint activo

#### ✅ Links de Tito clickeables - CORREGIDO 25/01/2026
- **Problema original:** Los links que daba Tito había que copiar y pegar
- **Causa:** La función `formatearTexto()` no convertía links markdown ni URLs a HTML
- **Solución:** Agregado soporte para:
  - Links markdown: `[texto](url)` → `<a href="url">texto</a>`
  - URLs sueltas: `https://...` → `<a href="url">url</a>`
  - Estilos CSS para links (color dorado, subrayado, hover)
- **Archivo:** `wordpress-plugins/duendes-tito-widget.php` líneas 881-884

---

### URLs Importantes

| Recurso | URL |
|---------|-----|
| API Tito | https://duendes-vercel.vercel.app/api/tito/v3 |
| API Cotizaciones | https://duendes-vercel.vercel.app/api/cotizaciones |
| Webhook WooCommerce | https://duendes-vercel.vercel.app/api/webhooks/woocommerce |
| Tienda | https://duendesdeluruguay.com/shop/ |
| Test del Guardián | https://duendesdeluruguay.com/descubri-que-duende-te-elige/ |

---

### Webhooks de WooCommerce - FASE 8 (25/01/2026)

**Endpoint:** `https://duendes-vercel.vercel.app/api/webhooks/woocommerce`

Sistema unificado que maneja sincronización en tiempo real con WooCommerce.

#### Eventos Soportados

| Evento | Acción |
|--------|--------|
| `order.created` | Procesa compras (guardianes, runas, membresías) |
| `product.created` | Invalida caché de Tito |
| `product.updated` | Invalida caché de Tito |
| `product.deleted` | Remueve de caché |
| `action.woocommerce_low_stock` | Marca producto como bajo stock |

#### Configuración en WooCommerce

1. Ir a **WooCommerce > Settings > Advanced > Webhooks**
2. Click en **Add webhook**
3. Configurar:
   - **Name:** Vercel - Sincronización
   - **Status:** Active
   - **Topic:** Seleccionar según necesidad:
     - Para órdenes: `Order created`
     - Para productos: `Product updated`, `Product created`, `Product deleted`
   - **Delivery URL:** `https://duendes-vercel.vercel.app/api/webhooks/woocommerce`
   - **Secret:** Generar uno seguro y guardarlo
   - **API Version:** WP REST API Integration v3

4. Agregar el secret en Vercel:
   - Ir a Vercel > Project Settings > Environment Variables
   - Agregar: `WOOCOMMERCE_WEBHOOK_SECRET` = tu-secret-generado

#### Verificación de Firma (HMAC)

El webhook verifica la firma usando:
- Header: `X-WC-Webhook-Signature`
- Algoritmo: HMAC-SHA256 (Base64)
- Si no hay secret configurado, acepta todo (modo desarrollo)

#### Sistema de Caché

- **Caché en memoria:** 5 minutos (instancia local)
- **Invalidación distribuida:** Via Vercel KV (todas las instancias)
- **Key de invalidación:** `tito:productos:invalidacion`

Cuando llega un webhook de producto:
1. Invalida caché local inmediatamente
2. Marca invalidación en KV
3. Otras instancias detectan la marca y refrescan su caché

#### Funciones Disponibles

```javascript
// En conocimiento.js
import { invalidarCacheProductos } from '@/lib/tito/conocimiento';

// Invalidar manualmente
await invalidarCacheProductos('motivo', productoId);
```

#### Stock Bajo

Productos con stock <= 2 se marcan automáticamente:
- Key individual: `stock:bajo:{productoId}`
- Lista global: `stock:bajo:lista`
- Expira en 7 días

---

### Sistema de Persuasión Avanzada - FASE 9 (25/01/2026)

**Archivos:**
- `lib/tito/persuasion.js` - Sistema de prueba social dinámica y técnicas de neuroventas
- `lib/tito/personalidad.js` - Técnicas FBI integradas (mirroring, labeling, etc.)

#### Técnicas Implementadas

| Técnica | Descripción | Ejemplo |
|---------|-------------|---------|
| **Mirroring** | Repetir últimas 1-3 palabras con tono de pregunta | "¿Protección...?" |
| **Labeling** | Nombrar la emoción que detectás | "Parece que venís cargando algo pesado..." |
| **Preguntas Calibradas** | Preguntas con "Cómo" o "Qué" (nunca "Por qué") | "¿Qué es lo que más te hace dudar?" |
| **Acusación Anticipada** | Adelantarse a objeciones | "Probablemente pensés que es caro..." |
| **Escasez Real** | Recordar que cada guardián es único | "Cuando se va, ese diseño desaparece del mundo" |
| **Reciprocidad** | Dar valor primero (tips, consejos) | "Te cuento un secreto sobre la abundancia..." |
| **Takeaway** | Psicología inversa | "Capaz no es el momento para vos, y está bien" |

#### Prueba Social para Guardianes ÚNICOS

**REGLA DE ORO:** Cada guardián es único. NUNCA decir "alguien compró el mismo".

**Frases correctas:**
- "Ayer una chica de México adoptó un guardián de protección como este"
- "Esta semana 3 personas eligieron guardianes sanadores"
- "Los guardianes de abundancia son los más buscados este mes"

**Frases prohibidas:**
- "Alguien compró este mismo" (porque son únicos)
- "El último que quedaba" (si hay más de ese tipo)

#### Funciones de persuasion.js

```javascript
import {
  generarPruebaSocialCategoria,  // Prueba social por categoría
  generarPruebaSocialGeneral,    // Prueba social genérica
  generarEscasezSutil,           // Frases de escasez
  generarReciprocidad,           // Tips y consejos de valor
  generarLabeling,               // Etiquetado emocional
  generarMirroring,              // Técnica espejo
  generarPaquetePersuasion       // Paquete completo contextual
} from '@/lib/tito/persuasion';

// Ejemplo de uso
const persuasion = generarPaquetePersuasion({
  categoria: 'proteccion',
  pais: 'México',
  emocion: 'ansiedad',
  tipoGuardian: 'duende',
  precio: 70
});
```

#### Detección de Emociones

El sistema detecta automáticamente la emoción del usuario para aplicar labeling:

| Emoción | Detectores |
|---------|------------|
| ansiedad | nervios, ansiedad, preocupad, estresad |
| tristeza | triste, mal, dolor, sufr, llor |
| miedo | miedo, asust, temor, insegur |
| confusion | confund, no sé, perdid, dudas |
| esperanza | esper, ilusión, quiero cambiar |
| frustracion | hart, cansad, frustrad, no aguanto |
| entusiasmo | me encanta, increíble, hermoso |

---

### Notas Técnicas

**Para subir archivos a WordPress via SFTP:**
```bash
expect << 'EOF'
spawn sftp -P 55309 sftp_live_WfP6i@34.70.139.72
expect "password:"
send "JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR\r"
expect "sftp>"
send "cd web/wp-live/wp-content/mu-plugins\r"
expect "sftp>"
send "put archivo.php\r"
expect "sftp>"
send "bye\r"
expect eof
EOF
```

**Para hacer deploy a Vercel:**
```bash
git add -A && git commit -m "mensaje" && git push
```

---

## ACTUALIZACIONES 25/01/2026 - SESIÓN TARDE (19:00hs)

### ✅ Tito actualizado con envío gratis y 3x2 - 25/01/2026 19:00hs
- **Archivos modificados:**
  - `lib/tito/conocimiento.js` - Nuevos umbrales de envío gratis
  - `lib/tito/personalidad.js` - Info de promo 3x2 y envíos
- **Cambios:**
  - Envío gratis internacional: USD$1000+
  - Envío gratis Uruguay: $10.000 UYU+
  - Promo 3x2: Por cada 2 guardianes, 1 mini gratis

### ✅ Plugin avisos dinámicos en carrito - 25/01/2026 19:15hs
- **Archivo:** `wordpress-plugins/duendes-avisos-carrito.php`
- **Subido a:** `mu-plugins/duendes-avisos-carrito.php`
- **Funcionalidad:**
  - Aviso de progreso 3x2 ("TE FALTA 1 GUARDIÁN", "TENÉS X MINIS DE REGALO")
  - Aviso de envío gratis con detección de país (UY vs internacional)
  - Barra de progreso visual hacia envío gratis
  - Actualización AJAX cuando cambia el carrito
  - Define: `DUENDES_ENVIO_GRATIS_USD=1000`, `DUENDES_ENVIO_GRATIS_UYU=10000`

### ✅ Webhooks WooCommerce configurados via API - 25/01/2026 19:30hs
- **Webhooks creados en WooCommerce:**
  - ID 4: Vercel - Producto Actualizado (`product.updated`)
  - ID 5: Vercel - Producto Creado (`product.created`)
  - ID 6: Vercel - Producto Eliminado (`product.deleted`)
- **Delivery URL:** `https://duendes-vercel.vercel.app/api/webhooks/woocommerce`
- **Secret:** `duendes_wh_2026_x7Kp9mNqR3sT5vW8yB2dF4gH6jL` (configurado en Vercel)
- **Método:** Curl directo a WooCommerce REST API con credenciales
- **Script auxiliar:** `scripts/configure-webhooks.js` (para referencia futura)

### ✅ Emails de formulario de contacto arreglados - 25/01/2026 19:45hs
- **Problema:** Los emails del formulario de contacto no llegaban
- **Causa:** Plugin `duendes-elementor-emails.php` estaba deshabilitado (renombrado a `.OLD`)
- **Solución:** Renombrado de vuelta a `duendes-elementor-emails.php` via SFTP
- **Funcionamiento:**
  - Intercepta formularios de Elementor Pro via hook `elementor_pro/forms/new_record`
  - Envía emails bonitos a `duendesdeluruguay@gmail.com`
  - Usa wp_mail + backup via Resend API
- **Dónde ver respuestas:**
  - Emails van a `duendesdeluruguay@gmail.com`
  - Si Elementor tiene "Collect Submissions" habilitado: Elementor > Submissions

### ✅ Certificado automático arreglado - 25/01/2026 20:00hs
- **Problema:** El endpoint `/api/certificado?order=X` mostraba datos de ejemplo porque no se guardaban los datos reales
- **Causa:** El sistema de canalizaciones (`/api/admin/canalizaciones`) y el de certificados (`/api/certificado`) estaban desconectados
- **Solución:** Modificado `app/api/admin/canalizaciones/route.js`:
  - Cuando una canalización se marca como "enviada" (PUT con `accion: 'enviar'`)
  - Ahora también guarda los datos en `orden:${ordenId}` con el formato que espera el certificado
  - Incluye: nombre_humano, guardian_nombre, guardian_genero, mensaje_guardian, sincrodestino, categoria
- **Flujo completo ahora:**
  1. Orden llega via webhook → genera canalización pendiente
  2. Admin aprueba canalización en panel
  3. Admin envía canalización → se guarda en `lecturas:${email}` Y `orden:${ordenId}`
  4. Cliente accede a `/api/certificado?order=X` → ve su certificado personalizado

---

### TAREAS PENDIENTES - 25/01/2026 20:00hs

| Tarea | Estado | Notas |
|-------|--------|-------|
| Fix "Mi Magia" en página principal | ⏳ Pendiente | Usuario debe indicar qué hay que arreglar |
| Editar HTML secciones (inicio, envíos, FAQ) | ⏳ Pendiente | Esperando HTML del usuario - actualizar montos de envío gratis |
| Crear herramienta HTML → secciones editables | ⏳ Pendiente | Para transformar HTML publicado |

---

*Este documento es la guía viva de cómo creamos magia real en Duendes del Uruguay. Cada palabra cuenta. Cada mensaje importa. Cada persona merece sentirse única.*
