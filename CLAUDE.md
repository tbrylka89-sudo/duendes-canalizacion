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

*Este documento es la guía viva de cómo creamos magia real en Duendes del Uruguay. Cada palabra cuenta. Cada mensaje importa. Cada persona merece sentirse única.*
