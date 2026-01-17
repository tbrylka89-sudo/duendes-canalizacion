# SESIÓN 3: GENERADOR DE CONTENIDO IA + DUENDE DE LA SEMANA
## Tiempo estimado: 2 horas
## Objetivo: Sistema automático de contenido mágico diario

---

## CONTEXTO PREVIO

Antes de empezar, dile a Claude Code:

```
Completamos Sesiones 1 y 2. Ahora vamos con el Generador de Contenido IA.
Usamos Anthropic Claude API para generar contenido.
OpenAI para imágenes si es necesario.
El contenido debe ser premium, único, desde la perspectiva de los duendes.
```

---

## PASO 1: SISTEMA DEL DUENDE DE LA SEMANA

### Instrucciones para Claude Code:

```
Crea el sistema de "Duende de la Semana" en /app/admin/circulo/duende-semana/page.jsx:

CONCEPTO:
Cada semana, un duende de los productos publicados "toma el poder" y todo el contenido se genera desde su perspectiva y personalidad.

INTERFAZ:

SECCIÓN 1: DUENDE ACTUAL
- Mostrar el duende que dirige esta semana
- Su imagen (desde WooCommerce o URL)
- Su nombre
- Su personalidad generada
- Fecha inicio/fin de su semana
- Botón: "Ver contenido generado esta semana"

SECCIÓN 2: SELECTOR DE DUENDE
- Dropdown/Grid con todos los duendes DISPONIBLES en productos publicados
- Obtener de WooCommerce API o de una lista en Vercel KV
- Cada duende muestra:
  - Imagen miniatura
  - Nombre
  - Si ya dirigió antes (fecha)
  - Estado: Disponible ✅ / Adoptado ❌
- Al seleccionar uno → mostrar preview de su personalidad

SECCIÓN 3: GENERADOR DE PERSONALIDAD
Cuando se selecciona un duende, Claude debe analizar:
- Nombre del duende
- Descripción del producto
- Cristales asociados
- Tamaño y características físicas
- Historia/backstory si existe

Y GENERAR:
- Personalidad: (ej: "Sabio y tranquilo, habla con pausas reflexivas")
- Tono de voz: (ej: "Cálido, paternal, usa metáforas de la naturaleza")
- Temas que le interesan: (ej: "Protección del hogar, sueños, cristales de cuarzo")
- Frase característica: (ej: "En el silencio del bosque, las respuestas florecen")
- Emoji/Runa asociada: (ej: ᚱ Raido - viaje)

BOTÓN: "Generar personalidad con IA"
- Llama a Claude API con el prompt de análisis
- Muestra resultado
- Botón: "Regenerar" si no gusta
- Botón: "Aprobar y Guardar"

SECCIÓN 4: ACTIVAR DUENDE DE LA SEMANA
- Fecha de inicio (default: próximo lunes)
- Fecha de fin (automático: domingo)
- Checkbox: "Notificar a miembros del Círculo por email"
- Botón: "Activar como Duende de la Semana"

REGLAS:
- Si el duende es ADOPTADO (comprado), marcar como no disponible
- Guardar historial de qué duendes ya dirigieron y cuándo
- No repetir duende en menos de 2 meses (si hay suficientes)
- Si un duende es adoptado DURANTE su semana → mensaje especial: "Este guardián encontró su hogar, pero su sabiduría permanece con nosotros"

DATOS EN VERCEL KV:
duende_semana_actual: {
  duende_id: "xxx",
  nombre: "Rowan",
  imagen: "url",
  personalidad: {...},
  inicio: "2026-01-20",
  fin: "2026-01-26",
  adoptado_durante: false
}

duendes_historial: [
  { duende_id, nombre, semana_inicio, semana_fin, adoptado_durante }
]
```

---

## PASO 2: GENERADOR DE CONTENIDO DIARIO

### Instrucciones para Claude Code:

```
Crea el generador de contenido en /app/admin/contenido/page.jsx:

TIPOS DE CONTENIDO DIARIO:

📅 LUNES - MENSAJE DE BIENVENIDA
- El duende da la bienvenida a la semana
- Presenta el tema/energía de la semana
- 300-500 palabras
- Tono: cálido, inspirador

🧘 MARTES - MEDITACIÓN GUIADA
- Meditación de 10-15 minutos (texto)
- Guiada por el duende
- Incluye: preparación, visualización, cierre
- 800-1200 palabras
- Opcional: generar audio con ElevenLabs después

🛠️ MIÉRCOLES - DIY MÁGICO
- Manualidad o práctica para hacer en casa
- Relacionada con el duende/cristales/naturaleza
- Lista de materiales
- Pasos detallados con instrucciones claras
- 500-800 palabras
- Sugerir imagen a crear

📖 JUEVES - HISTORIA CON ENSEÑANZA
- Cuento corto protagonizado por el duende
- Tiene una moraleja/enseñanza
- Estilo fábula mística
- 600-1000 palabras

🔮 VIERNES - RITUAL DE LA SEMANA
- Ritual sencillo para hacer en casa
- Propósito específico (protección, abundancia, amor, etc.)
- Materiales simples
- Pasos detallados
- Mejor momento para hacerlo
- 500-800 palabras

💫 SÁBADO - REFLEXIÓN Y SABIDURÍA
- Mensaje profundo del duende
- Preguntas para reflexionar
- Ejercicio de journaling
- 400-600 palabras

🌙 DOMINGO - PREPARACIÓN SEMANAL
- Resumen de la semana
- Agradecimiento
- Preview de la próxima semana (si se sabe el duende)
- Intención para la nueva semana
- 300-500 palabras

INTERFAZ DEL GENERADOR:

1. Selector de tipo de contenido (los 7 de arriba)
2. Fecha para la que se genera (default: hoy)
3. Duende actual se carga automáticamente
4. Contexto adicional (opcional):
   - Fase lunar actual (auto-detectar)
   - Estación celta actual (auto-detectar)
   - Tema especial (input manual)
5. Botón grande: "✨ Generar Contenido"

RESULTADO:
- Vista previa del contenido generado
- Con la estética final (fuentes, colores)
- Título sugerido
- Contenido completo
- Botones:
  - "🔄 Regenerar" (nuevo intento)
  - "✏️ Editar" (abrir editor)
  - "💾 Guardar borrador"
  - "📅 Programar" (seleccionar fecha/hora)
  - "🚀 Publicar ahora"

PROMPT PARA CLAUDE API:
```
Eres {nombre_duende}, un guardián místico de Duendes del Uruguay.

Tu personalidad: {personalidad}
Tu tono de voz: {tono}
Tus temas de interés: {temas}
Tu frase característica: "{frase}"

Contexto actual:
- Fase lunar: {fase_lunar}
- Estación celta: {estacion}
- Fecha: {fecha}

Genera un/una {tipo_contenido} para los miembros del Círculo de Duendes.

REGLAS:
- Escribe SIEMPRE en primera persona como el duende
- Usa un tono {tono} 
- El contenido debe ser entre {min_palabras} y {max_palabras} palabras
- Incluye al menos una referencia a tu historia/características
- Menciona la fase lunar o estación si es relevante
- NO uses emojis excesivos (máximo 3 en todo el texto)
- El lenguaje debe ser accesible pero mágico
- Evita clichés espirituales genéricos
- Haz que el lector se sienta especial y parte de algo único

{instrucciones_especificas_del_tipo}

Responde SOLO con el contenido, sin explicaciones adicionales.
```

GUARDAR CONTENIDO EN VERCEL KV:
contenido_{fecha}: {
  tipo: "meditacion",
  duende_id: "xxx",
  duende_nombre: "Rowan",
  titulo: "Meditación del Amanecer Dorado",
  contenido: "...",
  fase_lunar: "Luna Llena",
  estacion: "Imbolc",
  estado: "publicado", // borrador, programado, publicado
  fecha_publicacion: "2026-01-21T08:00:00",
  creado_por: "admin",
  veces_regenerado: 2
}
```

---

## PASO 3: CALENDARIO EDITORIAL

### Instrucciones para Claude Code:

```
Crea el calendario editorial en /app/admin/contenido/calendario/page.jsx:

VISTA MENSUAL:
- Calendario visual del mes actual
- Cada día muestra:
  - Qué tipo de contenido corresponde (según día de semana)
  - Estado: ✅ Publicado / 📝 Programado / ⚠️ Pendiente / ❌ Falta
  - Duende de esa semana
  - Click → ver/editar contenido

NAVEGACIÓN:
- Flechas para mes anterior/siguiente
- Botón "Hoy"
- Vista: Mes / Semana

CÓDIGO DE COLORES:
- Verde: Publicado
- Azul: Programado
- Amarillo: Borrador guardado
- Rojo: Falta generar

PANEL LATERAL (al hacer clic en un día):
- Fecha seleccionada
- Tipo de contenido del día
- Duende de esa semana
- Estado actual
- Preview del contenido si existe
- Botones: Ver completo / Editar / Regenerar / Publicar

ALERTAS AUTOMÁTICAS:
- Banner arriba si hay contenido pendiente para hoy
- Banner si mañana no tiene contenido programado
- Lista de próximos 7 días con estado

GENERACIÓN EN LOTE:
- Botón: "Generar semana completa"
- Genera los 7 contenidos de una semana
- Cada uno como borrador para revisar
- Muestra progreso

MEMORIA (ANTI-REPETICIÓN):
- Antes de generar, Claude recibe lista de temas recientes
- Prompt incluye: "NO repitas estos temas tratados recientemente: {lista}"
- Guardar tags/temas de cada contenido
- No repetir tema exacto en menos de 30 días

DATOS:
calendario_contenido: {
  "2026-01": {
    "01": { tipo, estado, duende_id },
    "02": { tipo, estado, duende_id },
    ...
  }
}

temas_recientes: [
  { fecha, tema: "protección del hogar", tags: ["hogar", "protección"] },
  { fecha, tema: "cristales de cuarzo", tags: ["cuarzo", "cristales"] },
  ...
]
```

---

## PASO 4: INTEGRACIÓN LUNAR Y ESTACIONES CELTAS

### Instrucciones para Claude Code:

```
Crea el sistema de fases lunares y estaciones celtas:

ARCHIVO: /lib/astro/moon-phases.js

FUNCIONES:
getMoonPhase(date) → retorna:
{
  fase: "Luna Llena", // Nueva, Creciente, Llena, Menguante
  emoji: "🌕",
  porcentaje_iluminacion: 98,
  descripcion: "Momento de culminación y celebración",
  rituales_sugeridos: ["gratitud", "manifestación", "liberación"],
  mejor_para: ["cerrar ciclos", "celebrar logros"],
  evitar: ["iniciar proyectos nuevos"]
}

ARCHIVO: /lib/astro/celtic-seasons.js

ESTACIONES CELTAS:
{
  samhain: {
    nombre: "Samhain",
    inicio: { mes: 10, dia: 31 },
    fin: { mes: 11, dia: 1 },
    tema: "El velo entre mundos",
    descripcion: "Honramos a los ancestros y abrazamos la oscuridad",
    colores: ["negro", "naranja", "morado"],
    cristales: ["obsidiana", "amatista"],
    practicas: ["altar ancestral", "meditación con velas", "journaling de gratitud"]
  },
  yule: {
    nombre: "Yule",
    inicio: { mes: 12, dia: 21 },
    tema: "Renacimiento de la luz",
    ...
  },
  imbolc: {
    nombre: "Imbolc",
    inicio: { mes: 2, dia: 1 },
    tema: "Despertar y renovación",
    ...
  },
  ostara: {
    nombre: "Ostara",
    inicio: { mes: 3, dia: 21 },
    tema: "Equilibrio y nuevos comienzos",
    ...
  },
  beltane: {
    nombre: "Beltane",
    inicio: { mes: 5, dia: 1 },
    tema: "Fertilidad y celebración",
    ...
  },
  litha: {
    nombre: "Litha",
    inicio: { mes: 6, dia: 21 },
    tema: "Plenitud del sol",
    ...
  },
  lughnasadh: {
    nombre: "Lughnasadh",
    inicio: { mes: 8, dia: 1 },
    tema: "Primera cosecha",
    ...
  },
  mabon: {
    nombre: "Mabon",
    inicio: { mes: 9, dia: 21 },
    tema: "Equilibrio y gratitud",
    ...
  }
}

getCurrentSeason(date) → retorna la estación actual con toda su info

INTEGRACIÓN CON GENERADOR:
- Auto-detectar fase lunar del día
- Auto-detectar estación celta
- Incluir en el contexto del prompt
- Mostrar en el contenido publicado
- Widget en el Círculo mostrando fase lunar actual
```

---

## PASO 5: VISTA PÚBLICA DEL CONTENIDO (EN EL CÍRCULO)

### Instrucciones para Claude Code:

```
Crea la vista del contenido para miembros del Círculo:

RUTA: /app/mi-magia/circulo/contenido/page.jsx

HEADER DE LA SEMANA:
- Banner con el Duende de la Semana
- Su imagen, nombre, frase característica
- "Esta semana, {Nombre} nos guía"
- Si fue adoptado: "Este guardián encontró su hogar, pero su sabiduría permanece ✨"

CONTENIDO DEL DÍA (destacado):
- Card grande con el contenido de hoy
- Tipo de contenido con icono
- Título
- Contenido completo
- Fase lunar del día
- Botón: "Marcar como leído" (para tracking)

CONTENIDO DE LA SEMANA:
- Grid de 7 cards (Lun-Dom)
- Cada card muestra:
  - Día y fecha
  - Tipo de contenido
  - Título
  - Preview (primeras 100 palabras)
  - Estado: Disponible / Próximamente / Leído ✓
- Click → expande el contenido completo

ARCHIVO DE CONTENIDO:
- Pestaña para ver contenido de semanas anteriores
- Buscador por tema/duende
- Filtros por tipo de contenido

WIDGET DE FASE LUNAR:
- En sidebar o header
- Fase actual con imagen
- "Hoy: Luna Creciente 🌒"
- "Ideal para: {sugerencias}"

WIDGET DE ESTACIÓN:
- Estación celta actual
- Días para la próxima celebración
- Link a contenido especial de la estación

ESTÉTICA:
- Mismo estilo premium del resto
- Imágenes de bosque/naturaleza de fondo sutil
- Contenido fácil de leer
- Espaciado generoso
- Mobile-first
```

---

## PASO 6: NOTIFICACIONES DE CONTENIDO

### Instrucciones para Claude Code:

```
Crea el sistema de notificaciones de contenido nuevo:

EMAIL DIARIO (opcional para usuarios):
- Enviar a las 8:00 AM hora local
- Asunto: "✨ {Nombre_Duende} tiene algo para ti hoy"
- Contenido:
  - Preview del contenido del día
  - Fase lunar
  - Link para ver completo
- Solo a usuarios que optaron por emails diarios

EMAIL SEMANAL (default):
- Enviar domingos a las 10:00 AM
- Asunto: "🌟 Tu semana mágica con {Nombre_Duende}"
- Contenido:
  - Resumen de la semana
  - Highlights de cada día
  - Preview de la próxima semana
  - Duende que viene

CONFIGURACIÓN DE USUARIO:
En /app/mi-magia/configuracion:
- [ ] Recibir email diario con contenido
- [ ] Recibir email semanal
- [ ] No recibir emails de contenido

API CRON JOB (Vercel):
/api/cron/daily-content-email
/api/cron/weekly-content-email

Configurar en vercel.json:
{
  "crons": [
    {
      "path": "/api/cron/daily-content-email",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/weekly-content-email", 
      "schedule": "0 10 * * 0"
    }
  ]
}
```

---

## PASO 7: VERIFICACIÓN FINAL SESIÓN 3

### Instrucciones para Claude Code:

```
Verificación final de la Sesión 3:

1. Ejecuta: npm run build

2. Prueba el sistema del Duende de la Semana:
   - [ ] Seleccionar un duende de la lista
   - [ ] Generar su personalidad con IA
   - [ ] Aprobar y activar como duende de la semana

3. Prueba el generador de contenido:
   - [ ] Generar cada tipo de contenido (7 tipos)
   - [ ] Verificar que el tono sea del duende
   - [ ] Regenerar si no gusta
   - [ ] Guardar borrador
   - [ ] Publicar contenido

4. Prueba el calendario:
   - [ ] Ver vista mensual
   - [ ] Click en día → ver contenido
   - [ ] Generar semana completa

5. Prueba la vista pública:
   - [ ] Entrar como usuario del Círculo
   - [ ] Ver contenido del día
   - [ ] Ver contenido de la semana
   - [ ] Ver fase lunar

6. Dame REPORTE FINAL:
   - Componentes creados
   - APIs de IA funcionando
   - Contenido de ejemplo generado
   - Screenshots

¿Todo listo para la Sesión 4?
```

---

## RESUMEN SESIÓN 3

| Paso | Tarea | Tiempo estimado |
|------|-------|-----------------|
| 1 | Duende de la Semana | 30 min |
| 2 | Generador de Contenido | 35 min |
| 3 | Calendario Editorial | 25 min |
| 4 | Luna y Estaciones | 15 min |
| 5 | Vista Pública | 20 min |
| 6 | Notificaciones | 15 min |
| 7 | Verificación | 15 min |

**Total: ~2 horas 30 min**

---

## DESPUÉS DE COMPLETAR SESIÓN 3:
Continúa con SESION-4-COMUNIDAD.md
