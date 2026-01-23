# VISIÓN 2026 - Duendes del Uruguay
## La Plataforma Mística Más Avanzada del Mundo

---

## ARQUITECTURA DE EXPERIENCIA COMPLETA

```
┌─────────────────────────────────────────────────────────────────┐
│                    DUENDES DEL URUGUAY                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   CLAUDE    │  │ ELEVENLABS  │  │   DALL-E    │            │
│  │   Vision    │  │   Voice     │  │   Images    │            │
│  │  + Content  │  │  Synthesis  │  │ Generation  │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                    │
│         └────────────────┼────────────────┘                    │
│                          │                                     │
│                    ┌─────▼─────┐                               │
│                    │  MOTOR DE │                               │
│                    │EXPERIENCIA│                               │
│                    │PERSONALIZA│                               │
│                    └─────┬─────┘                               │
│                          │                                     │
│    ┌─────────────────────┼─────────────────────┐              │
│    │                     │                     │              │
│    ▼                     ▼                     ▼              │
│ ┌──────┐           ┌──────────┐          ┌─────────┐         │
│ │PORTAL│           │CANALIZA- │          │ CÍRCULO │         │
│ │COMPRA│           │  CIONES  │          │ MEMBERS │         │
│ └──────┘           └──────────┘          └─────────┘         │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## FASE 1: SISTEMA DE ANÁLISIS VISUAL CON IA

### 1.1 Análisis de Fotos de Usuarios (Claude Vision)

**Cuando el usuario sube su foto, Claude analiza:**

```javascript
// Análisis de rostro
{
  expresion_dominante: "contemplativa",
  energia_percibida: "agua - fluida, sensible",
  tension_areas: ["mandíbula", "entrecejo"],
  apertura_emocional: 0.7, // 0-1
  colores_aura_rostro: ["azul profundo", "violeta suave"],
  mensaje_inicial: "Veo a alguien que carga más de lo que muestra..."
}

// Análisis de mano (palma)
{
  lineas_dominantes: ["corazón profunda", "vida con bifurcación"],
  energia_manos: "sanadoras",
  elemento_predominante: "agua",
  colores_aura_mano: ["verde esmeralda", "rosa"],
  don_detectado: "empatía extrema, absorbe energías ajenas"
}
```

**API necesaria:** Claude Vision (ya tenés acceso)

### 1.2 Generación Automática de Perfiles de Guardianes

**Claude analiza cada imagen de guardián y genera:**

```javascript
{
  nombre: "Thornwood",
  origen: "Bosques de roble del norte de Europa, era 847",
  historia: "Nació de la última semilla de un roble milenario...",

  personalidad: {
    arquetipo: "El Sabio Silencioso",
    comunicacion: "Habla poco, cada palabra es una semilla",
    humor: "Seco, irónico pero nunca hiriente",
    trigger_emocional: "La impaciencia humana le causa ternura"
  },

  especialidades: [
    "Paciencia en procesos largos",
    "Conexión con ancestros",
    "Sanar heridas de abandono"
  ],

  voz_recomendada: "clyde", // Del catálogo ElevenLabs
  estilo_mensaje: "Metáforas naturales, pausas largas, preguntas que incomodan",

  frases_caracteristicas: [
    "¿Tanto apuro tenés? El roble no se hizo en un verano.",
    "Tu abuela te mira. No con juicio. Con orgullo.",
    "Respirá. Otra vez. Bien. Ahora sí podemos hablar."
  ]
}
```

---

## FASE 2: MOTOR DE CANALIZACIONES INTELIGENTE

### 2.1 Pipeline de Canalización

```
ENTRADA                    PROCESAMIENTO                 SALIDA
────────                   ──────────────                ──────

Foto rostro ──────┐
                  │        ┌──────────────┐
Foto mano ────────┼───────▶│   CLAUDE     │
                  │        │   VISION     │
Formulario ───────┤        │  + ANÁLISIS  │
                  │        └──────┬───────┘
Historial ────────┘               │
(si existe)                       ▼
                          ┌──────────────┐      ┌────────────────┐
                          │   MATCHING   │─────▶│  CANALIZACIÓN  │
                          │  GUARDIANES  │      │  PERSONALIZADA │
                          └──────────────┘      └───────┬────────┘
                                                        │
                                                        ▼
                                               ┌────────────────┐
                                               │  AUDIO + PDF   │
                                               │  + RITUAL      │
                                               └────────────────┘
```

### 2.2 Estructura de una Canalización Premium

```markdown
# Tu Canalización Personal
## [Nombre de la persona] - [Fecha] - Luna en [Fase]

---

### LECTURA DE TU ENERGÍA

[Análisis profundo basado en foto + respuestas]
[NO genérico - específico a lo que Claude VIO]

---

### TUS GUARDIANES

#### 🌿 THORNWOOD - Guardián Principal
[Mensaje personal de 300-500 palabras]
[Audio generado con ElevenLabs - voz Clyde, settings emotivos]

#### 🌙 LUNARA - Guardiana de Apoyo
[Mensaje personal de 200-300 palabras]
[Audio con voz Serena]

#### ✨ PYRIS - Guardián Activador
[Mensaje corto pero potente - 100-150 palabras]
[Audio con voz energética]

---

### RITUAL PERSONALIZADO

[Ritual diseñado específicamente para esta persona]
[Ingredientes que TIENE en su casa]
[Momento ideal según luna actual]

---

### TU CRISTAL ALIADO
[Recomendación basada en el análisis]

### TU ELEMENTO DOMINANTE
[Agua/Fuego/Tierra/Aire/Éter + explicación personal]

---

### MENSAJE DE CIERRE
[Integración de todo + llamado a la acción emocional]
```

---

## FASE 3: FORMULARIOS MÁGICOS

### 3.1 UI/UX de Siguiente Nivel

**Tecnologías:**
- **Framer Motion** - Animaciones fluidas
- **React Hook Form** - Validación
- **Uploadcare o Cloudinary** - Subida de imágenes con preview
- **Lottie** - Animaciones místicas durante carga

**Experiencia del formulario:**

```
PASO 1: Bienvenida animada
        ↓ (transición mágica)
PASO 2: "¿Para quién es?" [Yo / Regalo / Regalo Sorpresa]
        ↓ (formulario se adapta)
PASO 3: Preguntas emocionales (una por pantalla, con animación)
        ↓
PASO 4: Subida de foto (con guía visual de cómo tomarla)
        ↓
PASO 5: Preview de lo que recibirá
        ↓
PASO 6: Pago (Stripe integrado, sin salir)
        ↓
PASO 7: Confirmación mágica + email hermoso
```

### 3.2 Preguntas Inteligentes (Adaptan según respuestas)

```javascript
const FLUJO_PREGUNTAS = {
  inicio: {
    pregunta: "¿Qué te trajo hasta acá hoy?",
    opciones: [
      { texto: "Busco claridad", siguiente: "claridad" },
      { texto: "Necesito sanar algo", siguiente: "sanacion" },
      { texto: "Quiero conectar con algo más grande", siguiente: "conexion" },
      { texto: "Curiosidad", siguiente: "curiosidad" }
    ]
  },

  claridad: {
    pregunta: "¿En qué área de tu vida sentís más niebla?",
    opciones: [
      { texto: "Amor y relaciones", tags: ["amor", "vinculos"] },
      { texto: "Trabajo y propósito", tags: ["proposito", "abundancia"] },
      { texto: "Familia", tags: ["ancestros", "sanacion"] },
      { texto: "Conmigo misma", tags: ["autoconocimiento", "sombra"] }
    ]
  },
  // ... continúa adaptándose
}
```

---

## FASE 4: TEST DEL GUARDIÁN AVANZADO

### 4.1 Algoritmo de Matching

```javascript
// Cada guardián tiene un perfil de compatibilidad
const GUARDIAN_PROFILES = {
  thornwood: {
    elementos: { tierra: 0.9, agua: 0.4, fuego: 0.1, aire: 0.3 },
    necesidades: ["paciencia", "ancestros", "arraigo", "abandono"],
    personalidad_compatible: ["introvertido", "sensible", "buscador"],
    momento_vida: ["transicion", "duelo", "reconstruccion"]
  },
  // ...
};

// El test genera un perfil del usuario
const USER_PROFILE = {
  elementos: { agua: 0.8, tierra: 0.5, fuego: 0.3, aire: 0.6 },
  necesidades_detectadas: ["sanacion", "claridad", "proposito"],
  personalidad: ["sensible", "empatico", "ansioso"],
  momento: "transicion"
};

// Matching con score
function matchGuardians(userProfile) {
  return Object.entries(GUARDIAN_PROFILES)
    .map(([id, guardian]) => ({
      id,
      score: calculateCompatibility(userProfile, guardian),
      porque: generateExplanation(userProfile, guardian)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
```

### 4.2 Detección de Perfil de Compra (Ético)

```javascript
const PERFILES_COMPRA = {
  explorador: {
    // Curiosidad alta, compromiso bajo
    indicadores: ["primera visita", "muchas preguntas", "indecisión"],
    oferta: "contenido gratuito de valor",
    mensaje: "Tomate tu tiempo. La magia no se apura."
  },

  buscador_activo: {
    // Necesidad clara, disposición a invertir
    indicadores: ["búsqueda específica", "engagement alto", "urgencia moderada"],
    oferta: "canalización completa",
    mensaje: "Siento que estás lista para este paso."
  },

  momento_vulnerable: {
    // Señales de crisis o compulsividad
    indicadores: ["respuestas muy emocionales", "urgencia extrema", "múltiples compras rápidas"],
    oferta: "NUNCA upsell agresivo",
    mensaje: "Antes de continuar, respiremos juntas...",
    accion: "ofrecer contenido de contención gratuito"
  }
};
```

---

## FASE 5: CÍRCULO DE MIEMBROS

### 5.1 Área Privada Premium

```
/circulo
├── /inicio (dashboard personal)
├── /mis-guardianes (colección con audios)
├── /canalizaciones (historial + nueva)
├── /rituales-del-mes (contenido exclusivo)
├── /comunidad (foro privado)
├── /luna (calendario lunar personalizado)
└── /biblioteca (todos los contenidos)
```

### 5.2 Features del Círculo

- **Notificaciones lunares**: Push/email en lunas importantes
- **Ritual del mes**: Contenido nuevo cada luna nueva
- **Chat con Thibisay**: Respuestas personalizadas (limitadas)
- **Descuentos exclusivos**: En canalizaciones y productos
- **Acceso anticipado**: A nuevos guardianes

---

## FASE 6: INTEGRACIONES Y APIs

### APIs Recomendadas

| Servicio | Uso | Prioridad |
|----------|-----|-----------|
| **Claude API** | Contenido, análisis de imágenes, chat | ✅ Ya tenés |
| **ElevenLabs** | Voces de guardianes | ✅ Ya tenés |
| **OpenAI DALL-E** | Generación de imágenes | ✅ Ya tenés |
| **Stripe** | Pagos, suscripciones | 🔴 CRÍTICO |
| **Resend** | Emails transaccionales | ✅ Ya tenés |
| **Cloudinary** | Upload y transformación de fotos | 🟡 ALTO |
| **Vercel KV** | Base de datos | ✅ Ya tenés |
| **PostHog** | Analytics de comportamiento | 🟢 MEDIO |
| **Calendly** | Agendar sesiones 1:1 | 🟢 OPCIONAL |

### Nuevas APIs a Considerar

| Servicio | Uso | Por qué |
|----------|-----|---------|
| **Replicate** | Modelos de IA adicionales | Estilos de imagen únicos |
| **AssemblyAI** | Transcripción si hay audios de usuarios | Para analizar voz del cliente |
| **Twilio** | SMS para notificaciones | Lunas, recordatorios |
| **Notion API** | CRM simple de clientes | Tracking manual cuando necesites |

---

## FASE 7: AUTOMATIZACIONES

### 7.1 Flujos Automáticos

```
COMPRA NUEVA
    │
    ├──▶ Email de bienvenida (inmediato)
    │
    ├──▶ Email "Tu canalización está lista" (cuando se genera)
    │
    ├──▶ Email de seguimiento (3 días después)
    │    "¿Cómo te sentiste con tu canalización?"
    │
    └──▶ Email de reconexión (14 días)
         "Tus guardianes tienen un mensaje nuevo..."
```

```
CARRITO ABANDONADO
    │
    ├──▶ Email 1 hora después
    │    "¿Te quedaste pensando?"
    │
    └──▶ Email 24 horas después
         "Tu guardián sigue esperándote..."
         (con descuento sutil)
```

```
LUNA LLENA
    │
    └──▶ Email a toda la base
         Ritual especial del mes
         (diferenciado para Círculo vs. público)
```

---

## FASE 8: CONTENIDO GENERATIVO

### 8.1 Sistema de Historias de Guardianes

Cada guardián tiene un banco de historias generadas por Claude:

```javascript
const HISTORIA_GUARDIAN = {
  tipo: "origen",
  guardian: "thornwood",
  titulo: "El Último Roble",
  contenido: `[Historia de 800-1200 palabras]
              [Escrita según las reglas de CLAUDE.md]
              [Con momentos de emoción real]`,
  audio: "[ID de audio generado]",
  usos: ["email", "circulo", "redes"]
};
```

### 8.2 Contenido para Redes (Generado)

```javascript
// Claude genera posts según calendario
const POST_INSTAGRAM = {
  fecha: "2026-01-15",
  fase_lunar: "luna_nueva",
  guardian_protagonista: "lunara",

  caption: `[Texto de 150-200 palabras]
            [Sin clichés de IA]
            [Call to action sutil]`,

  hashtags: ["#duendesdeluruguay", "#magia", "..."],

  imagen_sugerida: {
    descripcion: "[Para generar con DALL-E]",
    estilo: "duendes"
  }
};
```

---

## PRIORIDADES DE IMPLEMENTACIÓN

### Sprint 1 (Inmediato)
1. ✅ Mejorar voces ElevenLabs (HECHO)
2. ⬜ Implementar formularios con los 3 flujos
3. ⬜ Subida de fotos con Cloudinary
4. ⬜ Stripe para pagos

### Sprint 2 (Corto plazo)
5. ⬜ Análisis de fotos con Claude Vision
6. ⬜ Generación de perfiles de guardianes
7. ⬜ Test del Guardián completo
8. ⬜ Emails automatizados con Resend

### Sprint 3 (Medio plazo)
9. ⬜ Área del Círculo completa
10. ⬜ Sistema de canalizaciones automáticas
11. ⬜ Analytics con PostHog
12. ⬜ Contenido generativo para redes

### Sprint 4 (Expansión)
13. ⬜ App móvil / PWA
14. ⬜ Comunidad dentro del Círculo
15. ⬜ Chat con guardianes (experimental)
16. ⬜ Marketplace de productos físicos

---

## MÉTRICAS DE ÉXITO

| Métrica | Objetivo |
|---------|----------|
| Conversión visita → compra | >3% |
| Retención Círculo | >70% mes a mes |
| NPS (satisfacción) | >70 |
| Tasa de recompra | >40% en 90 días |
| Tiempo en sitio | >5 minutos |

---

*Este documento es la visión completa. Cada fase se puede implementar de forma independiente, pero todas conectan hacia la misma experiencia mágica.*
