# PLAN: Academia de los Guardianes - Sistema Conectado

## Principio Fundamental: TODO FLUYE

El ecosistema de Duendes del Uruguay es un universo conectado:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DUENDES DEL URUGUAY                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   duendesdeluruguay.com ←──────→ Vercel (APIs)                 │
│         (WooCommerce)              │                            │
│              │                     │                            │
│              ▼                     ▼                            │
│   ┌─────────────────┐    ┌────────────────────┐                │
│   │  119+ Guardianes │←──→│     Mi Magia       │                │
│   │  REALES          │    │  (Portal Usuario)  │                │
│   └────────┬────────┘    └─────────┬──────────┘                │
│            │                       │                            │
│            └───────────┬───────────┘                            │
│                        ▼                                        │
│            ┌─────────────────────┐                              │
│            │ Círculo de Duendes  │                              │
│            │  - Contenido diario │                              │
│            │  - Cursos/Academia  │                              │
│            │  - Comunidad        │                              │
│            └─────────────────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Cada guardián es un nodo que conecta con:
- La tienda (comprarlo)
- El contenido (aprende de él)
- Los cursos (te enseña)
- Las canalizaciones (te habla)
- Tito (lo recomienda)

---

## Investigación Realizada

### Perfil del Público Objetivo

**Demografía:**
- Mujeres 25-55 años (70% tienen creencias New Age según Pew Research)
- Interesadas en espiritualidad, autoconocimiento, crecimiento personal
- Buscan referentes alternativos al patriarcado y judeocristianismo tradicional
- Necesidad de control y regulación emocional
- Valoran la "conciencia" - vivir de manera consciente

**Motivaciones Psicológicas:**
- Búsqueda de significado y propósito
- Necesidad de sentirse vistas, validadas, acompañadas
- Deseo de control sobre sus vidas en medio de la incertidumbre
- Conexión con lo "sagrado femenino"
- Autoconocimiento profundo
- Comunidad de mujeres que las entienden

**Lo que buscan en contenido espiritual:**
- NO contenido genérico de IA
- SÍ contenido que las haga sentir que "habla de mí"
- Herramientas prácticas aplicables HOY
- Rituales que puedan hacer en casa
- Conexión con la naturaleza y los ciclos lunares
- DIY: crear sus propios objetos mágicos

---

## Tendencias 2026 a Incorporar

### Eventos Lunares Clave
- **3 enero**: Superluna del Lobo (ya pasó)
- **17 febrero**: Eclipse solar anular
- **3 marzo**: Eclipse lunar total
- **31 mayo**: Luna Azul
- Todas las lunas llenas tienen nombre y significado

### Cristales en Tendencia
- Cuarzo rosa (chakra corazón, amor propio)
- Turmalina negra (protección)
- Cuarzo claro (amplificación de intención)
- Piedra luna (intuición)
- Amatista (espiritualidad)
- Citrino (abundancia)

### DIY Espiritual Popular
- Spell jars (frascos de protección/abundancia/amor)
- Sachets de hierbas protectoras
- Altares personales
- Velas rituales
- Limpieza con sahumerio

### Temas de Cursos Exitosos
1. Limpieza y protección energética
2. Chakras y aura
3. Cristaloterapia
4. Rituales lunares
5. Manifestación e intención
6. Tarot para autoconocimiento
7. Hierbas mágicas
8. Meditación guiada

---

## Nueva Arquitectura de la Academia

### Principio Central
**Los duendes REALES de la tienda son los profesores.**

Cada duende tiene MÚLTIPLES atributos que determinan qué puede enseñar:

| Atributo | Ejemplo | Qué Desbloquea |
|----------|---------|----------------|
| **Nombre** | Azalea Pixie | Identidad única, voz propia |
| **Categoría** | proteccion, sanacion, abundancia... | Temas principales |
| **Especie** | pixie, bruja, vikingo, elfo, chaman... | Estilo de enseñanza |
| **Cristales** | amatista, citrino, cuarzo rosa... | Temas de cristaloterapia |
| **Accesorios** | mochila, hongos, llaves, hierbas... | Temas especiales |
| **Tamaño** | mini, mediano, grande | Nivel de profundidad |
| **Género** | M/F | Perspectiva |
| **Historia** | Texto de producto | Personalidad y voz |

### Sistema de Conexiones

Un guardián puede enseñar sobre MÚLTIPLES temas según la combinación de sus atributos:

**Ejemplo: Azalea Pixie**
- Categoría: sabiduria → puede enseñar sobre claridad, decisiones
- Especie: pixie → puede enseñar sobre naturaleza, plantas, alegría
- Accesorios: pelo rosa, flor → puede enseñar sobre belleza interior

**Ejemplo: Moon (chaman)**
- Categoría: salud → puede enseñar sobre sanación
- Especie: chaman → puede enseñar sobre tambor, rituales, hierbas
- Accesorios: tambor chamánico, hierbas → puede enseñar sobre sonidoterapia

### Especialidades Existentes (24+)

El sistema ya tiene especializaciones en `/lib/conversion/especializaciones.js`:

```
Principales:
- fortuna, proteccion, amor_romantico, amor_propio
- sanacion, calma, abundancia, sabiduria
- transformacion, alegria

Viajeros (sub-especialidades):
- viajero, viajero_aventura, viajero_sabiduria
- viajero_reinvencion, viajero_horizontes, viajero_despegue

Bosque/Naturaleza (sub-especialidades):
- bosque, bosque_sanacion, bosque_raices
- bosque_micelios, bosque_hierbas, bosque_hongos, bosque_equilibrio
```

Cada especialización tiene definido:
- `dolor[]` - Qué problema tiene quien busca esto
- `espejo[]` - Frases de identificación
- `validacion[]` - Cómo validar su experiencia
- `solucion` - Qué hace el guardián
- `keywords[]` - Para detección automática

### Estructura de Cursos

```
CURSO (mensual)
├── Tema central del mes (ej: "Protección y Límites")
├── Imagen principal (DALL-E)
├── 4 Módulos (1 por semana)
│   ├── Módulo 1 - Semana 1
│   │   ├── Duende profesor (real, de la tienda)
│   │   ├── Imagen del módulo (DALL-E)
│   │   ├── Lección 1: Teoría
│   │   ├── Lección 2: Práctica
│   │   ├── Lección 3: DIY/Ritual
│   │   └── Lección 4: Integración
│   ├── Módulo 2 - Semana 2 (otro duende)
│   ├── Módulo 3 - Semana 3 (otro duende)
│   └── Módulo 4 - Semana 4 (otro duende)
└── Badge de completado
```

### Tipos de Lecciones

1. **Teoría** - El duende explica el concepto desde su sabiduría
2. **Práctica** - Meditación guiada, visualización, ejercicio
3. **DIY/Ritual** - Crear algo físico o hacer un ritual
4. **Integración** - Reflexión, journaling, aplicación en la vida

---

## Plan de Cursos para 2026

### Curso de Febrero: "Protección y Límites"
**Sincronizado con:** Eclipse solar (17 feb)

| Semana | Duende (de categoría Protección) | Tema |
|--------|-----------------------------------|------|
| 1 | Thornwick o similar | Qué es la protección energética |
| 2 | Otro duende Protección | Limpieza de espacios y aura |
| 3 | Otro duende Protección | DIY: Crear tu frasco de protección |
| 4 | Otro duende Protección | Poner límites sin culpa |

### Curso de Marzo: "Sanación y Liberación"
**Sincronizado con:** Eclipse lunar total (3 mar)

| Semana | Duende (de categoría Sanación) | Tema |
|--------|----------------------------------|------|
| 1 | Duende Sanación 1 | Reconocer qué necesita sanar |
| 2 | Duende Sanación 2 | Trabajar con el dolor emocional |
| 3 | Duende Sanación 3 | Ritual de liberación lunar |
| 4 | Duende Sanación 4 | Perdonar sin olvidar |

### Curso de Abril: "Abundancia y Merecimiento"

| Semana | Duende (de categoría Abundancia) | Tema |
|--------|-----------------------------------|------|
| 1 | Duende Abundancia 1 | Creencias limitantes sobre el dinero |
| 2 | Duende Abundancia 2 | La abundancia que ya tenés |
| 3 | Duende Abundancia 3 | DIY: Altar de prosperidad |
| 4 | Duende Abundancia 4 | Manifestar sin forzar |

### Cursos Futuros
- Mayo: "Amor Propio y Conexión" (Luna Azul 31 mayo)
- Junio: "Intuición y Tarot" (Solsticio)
- Julio: "Cristales para la Vida Diaria"
- Agosto: "Magia de las Hierbas"
- Septiembre: "Equilibrio" (Equinoccio)

---

## Calidad del Contenido

### Reglas de Generación (de CLAUDE.md)

**PROHIBIDO:**
- Frases genéricas de IA ("brumas ancestrales", "velo entre mundos")
- Contenido que podría aplicar a cualquier persona
- Tono cursi o infantil
- Ejercicios vagos sin pasos concretos

**OBLIGATORIO:**
- Primera frase = impacto emocional
- El lector debe sentir que "habla de mí"
- Ejercicios con materiales específicos y pasos claros
- Tono adulto, profundo, cercano (español rioplatense)
- Contenido que SOLO el duende específico diría (su personalidad)

### Estructura de Cada Lección

```markdown
# [Título de la Lección]

[Imagen generada con DALL-E relacionada al tema]

## Introducción del Duende
[150 palabras - Gancho emocional desde la perspectiva del duende]

## Enseñanza
[400 palabras - Contenido profundo, específico, aplicable]

## Práctica
[300 palabras - Ejercicio con pasos claros]
- Materiales necesarios (si aplica)
- Tiempo estimado
- Pasos numerados
- Variaciones para principiantes/avanzados

## Reflexión
[100 palabras - Preguntas para journaling o cierre]

## Mensaje de Cierre
[50 palabras - Desde la voz del duende]
```

---

## Mejoras Visuales

### Diseño de Cards de Curso
- Imagen principal grande (DALL-E, horizontal 16:9)
- Badge del duende profesor principal en esquina
- Barra de progreso elegante
- Tags: nivel, duración, categoría

### Diseño de Página de Curso
- Hero con imagen del curso
- Sidebar con lista de módulos (colapsables)
- Avatar del duende de cada módulo visible
- Indicador de progreso por módulo
- Badge a desbloquear visible

### Diseño de Lección
- Imagen del tema (DALL-E)
- Avatar del duende profesor
- Contenido con tipografía legible
- Sección de práctica destacada visualmente
- Botón de completar al final
- Navegación anterior/siguiente

---

## Implementación Técnica

### Fase 1: Base de Datos de Duendes Profesores
1. Filtrar duendes por categoría (Protección, Sanación, Abundancia, etc.)
2. Asegurar que cada uno tenga: nombre, imagen, cristales, elemento
3. Crear sistema de asignación a módulos

### Fase 2: API de Generación de Cursos
```javascript
POST /api/admin/cursos/generar
{
  mes: 2,
  year: 2026,
  tema: "Protección y Límites",
  categoria: "proteccion", // filtra duendes de esta categoría
  eventoLunar: "Eclipse solar 17 feb"
}
```

Genera:
- Estructura del curso
- 4 módulos con duendes asignados
- Contenido de cada lección con IA
- Imágenes con DALL-E

### Fase 3: UI Mejorada
1. Rediseñar página de listado de cursos
2. Rediseñar página de curso individual
3. Rediseñar página de lección
4. Agregar animaciones y transiciones
5. Optimizar para móvil

### Fase 4: Sistema de Progreso
1. Marcar lecciones completadas
2. Calcular % por módulo y curso
3. Desbloquear badges
4. Notificaciones de logros

---

## Métricas de Éxito

- **Engagement:** Tasa de completado de cursos > 40%
- **Retención:** Usuarios que vuelven a los cursos > 60%
- **Calidad:** Feedback positivo en comentarios
- **Conversión:** Usuarios del Círculo que compran duendes relacionados

---

## Cronograma

| Semana | Tarea |
|--------|-------|
| Semana 1 | Implementar sistema de duendes profesores + API |
| Semana 2 | Generar curso de Febrero con contenido |
| Semana 3 | Rediseñar UI de cursos |
| Semana 4 | Testing y ajustes |
| Lanzamiento | 1 de Febrero 2026 |

---

## Fuentes de Investigación

- [Pew Research - Creencias New Age en mujeres](https://pijamasurf.com/2018/10/mujeres_tienen_mas_creencias_new_age_a_que_se_debe_esto/)
- [Espiritualidad femenina en círculos de mujeres](https://www.redalyc.org/journal/2654/265475272005/html/)
- [Lunas Llenas 2026 - María Elena Esoterismo](https://mariaelenaesoterismo.com/lunas-llenas-de-2026)
- [Cursos de Limpieza Energética - Udemy](https://www.udemy.com/course/curso-de-limpieza-y-proteccion-energetica/)
- [DIY Spell Jars - The Moon School](https://www.themoonschool.org/magick/protection-spell-jar/)
- [Crystal Healing Trends 2025](https://womanspellcaster.com/crystals/)
