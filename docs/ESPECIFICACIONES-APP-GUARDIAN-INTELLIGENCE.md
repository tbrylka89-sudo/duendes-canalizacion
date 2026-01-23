# 🧠 GUARDIAN INTELLIGENCE - Especificaciones Maestras

## DOCUMENTO DE DESARROLLO - NO OMITIR NADA

**Proyecto**: Sistema de Inteligencia Artificial para Duendes del Uruguay
**Versión**: 1.0 MASTER
**Prioridad**: MÁXIMA - Desarrollar con excelencia absoluta

---

## 📋 ÍNDICE

1. [Visión General](#1-visión-general)
2. [El Problema a Resolver](#2-el-problema-a-resolver)
3. [Contexto del Negocio](#3-contexto-del-negocio)
4. [Requisitos Funcionales](#4-requisitos-funcionales)
5. [Módulos del Sistema](#5-módulos-del-sistema)
6. [Arquitectura Técnica](#6-arquitectura-técnica)
7. [Guías de Contenido y Estilo](#7-guías-de-contenido-y-estilo)
8. [Integraciones](#8-integraciones)
9. [Flujos de Trabajo Automáticos](#9-flujos-de-trabajo-automáticos)
10. [Ejemplos Concretos](#10-ejemplos-concretos)
11. [Métricas y Monitoreo](#11-métricas-y-monitoreo)
12. [Implementación](#12-implementación)

---

## 1. VISIÓN GENERAL

### 1.1 ¿Qué es Guardian Intelligence?

Un sistema de inteligencia artificial integrado en WordPress diseñado específicamente para Duendes del Uruguay que:

- **Analiza** todas las historias de guardianes en tiempo real
- **Detecta** patrones repetitivos, frases duplicadas, estructuras idénticas
- **Corrige** automáticamente para garantizar unicidad absoluta
- **Aprende** del contexto del negocio y mejora continuamente
- **Recomienda** proactivamente mejoras antes de que se detecten problemas
- **Conecta** con todos los sistemas de la marca (Tito, WooCommerce, APIs)
- **Piensa** por sí misma con lógica de negocio incorporada

### 1.2 Filosofía Central

> "Cada guardián es un ser ÚNICO que llegó a este mundo con una historia IRREPETIBLE. No hay dos iguales. Nunca."

El sistema debe garantizar que al leer 115 historias de guardianes, CADA UNA se sienta completamente diferente, auténtica, y conecte emocionalmente de manera única con el lector.

### 1.3 Nombre del Sistema

**Guardian Intelligence** (GI) - Sistema interno
**Panel en WP**: "🧠 Inteligencia de Guardianes"

---

## 2. EL PROBLEMA A RESOLVER

### 2.1 Problemas Actuales Detectados

#### A) Repetición de Sincrodestinos
Las historias tienen una sección de "sincrodestino" (algo mágico que pasó durante la creación) pero se repiten constantemente:

**MALO - Se repite en múltiples guardianes:**
- "Mientras lo canalizábamos se apagaron todas las luces del barrio menos las nuestras"
- "Empezaron a llover tréboles del techo"
- "Los semáforos se pusieron todos en verde"
- "Las plantas crecieron visiblemente"

#### B) Fantasías Irreales
Los creadores (Thibisay y Gabriel) viven en el MUNDO REAL. Son artesanos que crean figuras físicas. Los sincrodestinos deben ser CREÍBLES:

**MALO - Fantasioso/Irreal:**
- "Llovieron tréboles del techo" (imposible físicamente)
- "El duende habló en voz alta" (los muñecos no hablan)
- "Aparecieron hadas en el taller" (no existen físicamente)

**BUENO - Creíble/Mágico pero real:**
- "Una mariposa entró y se posó sobre él mientras lo terminábamos"
- "Durante los días que canalizamos a Micelio, empezaron a crecer honguitos en una maceta que teníamos abandonada"
- "Encontramos una moneda antigua en el piso del taller que nadie había visto"
- "El gato del vecino, que nunca entra, se quedó dormido junto a ella toda la tarde"
- "Justo cuando terminamos su rostro, empezó a llover después de semanas de sequía"

#### C) Estructura Demasiado Rígida
Todas las historias siguen EXACTAMENTE el mismo formato:
1. "Este es [NOMBRE]. Tiene [EDAD] años..."
2. Párrafo de backstory
3. "Algo increíble: mientras lo canalizábamos..."
4. "Ama X. No tolera Y."
5. "Su especialidad:"
6. "**QUÉ TE APORTA:**" (lista de 4 items)
7. "**CÓMO NACIÓ:**"
8. "**Lo que nos pidió que te digamos:**"
9. "Si esto te hizo algo..."

**PROBLEMA**: Al leer 5+ historias, el patrón se vuelve predecible y pierde magia.

#### D) Frases Repetidas Entre Guardianes
- "Hechicera ancestral de la protección"
- "Guardián de umbrales"
- "Transmutar energías"
- "Campo de protección invisible"
- Muchas brujas dicen casi lo mismo

#### E) Desconexión Emocional
Las historias no conectan con las experiencias REALES de las personas:
- No hablan de rupturas amorosas reales
- No hablan de problemas de dinero concretos
- No hablan de ansiedad, depresión, soledad
- No hablan de pérdidas, duelos, miedos

### 2.2 Lo que el Sistema DEBE Lograr

1. **CERO REPETICIONES**: Ninguna frase, sincrodestino o estructura debe repetirse
2. **REALISMO MÁGICO**: Sincrodestinos creíbles que pudieron pasar en un taller real
3. **VARIEDAD ESTRUCTURAL**: Cada historia con formato diferente
4. **CONEXIÓN EMOCIONAL**: Hablar de experiencias humanas reales
5. **UNICIDAD ABSOLUTA**: Leer 115 historias y que cada una se sienta completamente diferente
6. **PROACTIVIDAD**: El sistema debe pensar y recomendar antes de que se lo pidan

---

## 3. CONTEXTO DEL NEGOCIO

### 3.1 ¿Qué es Duendes del Uruguay?

- **Negocio**: Venta de guardianes artesanales canalizados (figuras místicas hechas a mano)
- **Ubicación**: Uruguay
- **Creadores**: Thibisay y Gabriel (pareja de artesanos)
- **Filosofía**: Cada guardián es un ser con alma propia que "elige" a su humano
- **Precio**: Desde $2.500 hasta $79.800 pesos uruguayos
- **Tamaños**: Mini (10cm), Especial (10cm), Mediano (18cm), Grande (25cm), Gigante

### 3.2 Tipos de Guardianes

| Categoría | Enfoque |
|-----------|---------|
| Protección | Escudos energéticos, seguridad, repeler negatividad |
| Abundancia | Dinero, prosperidad, negocios, oportunidades |
| Amor | Relaciones, amor propio, sanación del corazón |
| Salud | Sanación física, vitalidad, bienestar |
| Sabiduría | Intuición, claridad mental, guía espiritual |
| Sanación | Sanación emocional, traumas, paz interior |

### 3.3 Tipos de Seres

- Duendes (masculinos, traviesos, abundancia)
- Pixies (femeninas pequeñas, delicadas, mágicas)
- Brujas/Brujos (sabiduría, poder, transformación)
- Vikingos/Vikingas (fuerza, protección guerrera)
- Elfos (bosque, naturaleza, conexión)
- Hadas (delicadeza, amor, luz)
- Guardianes/Guardianas (protección pura)
- Chamanes (sanación profunda, conexión ancestral)

### 3.4 El Proceso de Canalización (REAL)

Thibisay y Gabriel en su taller:
1. Sienten la energía del ser que quiere manifestarse
2. Moldean la figura a mano (arcilla, telas, cristales)
3. El proceso puede llevar días o semanas
4. Cada rostro emerge naturalmente, no se planifica
5. Se le agregan cristales, accesorios con intención
6. El ser "dicta" su nombre y propósito
7. Se escribe su historia

**IMPORTANTE**: Este proceso es REAL. Ocurre en un taller físico. Los "milagros" que pasan son coincidencias significativas del mundo real, no fantasías de dibujos animados.

### 3.5 El Cliente Ideal

- Personas en búsqueda espiritual
- Atravesando momentos difíciles (rupturas, pérdidas, crisis)
- Buscando protección, guía, abundancia
- Creen en la energía, los cristales, lo místico
- Valoran lo artesanal y único
- Dispuestos a invertir en bienestar emocional
- Principalmente mujeres 25-55 años
- Uruguay, Argentina, España, México

### 3.6 Lenguaje

- **Español rioplatense**: vos, tenés, podés, sos
- **Tono**: Cercano, místico pero con los pies en la tierra, cálido, nunca frío
- **Evitar**: Lenguaje genérico de IA, frases hechas, cursilerías vacías

---

## 4. REQUISITOS FUNCIONALES

### 4.1 MÓDULO: Análisis de Historias

```
FUNCIÓN: Escanear todas las historias de productos WooCommerce
FRECUENCIA: Diaria automática + bajo demanda
ALCANCE: Todos los productos publicados tipo 'product'

DEBE DETECTAR:
├── Frases repetidas (>70% similitud)
├── Sincrodestinos duplicados
├── Estructuras idénticas
├── Palabras sobreusadas
├── Títulos/roles repetidos ("hechicera ancestral", etc.)
├── Cristales mencionados incorrectamente
├── Accesorios inventados que no existen
├── Inconsistencias de género (él/ella)
├── Edades repetidas
├── Especialidades duplicadas
└── Mensajes canalizados similares

OUTPUT:
├── Informe detallado de problemas
├── Puntaje de unicidad por producto (0-100)
├── Puntaje global del catálogo
├── Recomendaciones específicas
└── Acciones automáticas sugeridas
```

### 4.2 MÓDULO: Corrección Automática

```
FUNCIÓN: Reescribir secciones problemáticas manteniendo esencia
MODO: Automático (configurable) o con aprobación

CAPACIDADES:
├── Reescribir sincrodestinos únicos y creíbles
├── Variar estructura narrativa
├── Diversificar vocabulario
├── Cambiar orden de secciones
├── Generar nuevas frases para reemplazar repetidas
├── Ajustar tono según categoría del guardián
└── Mantener coherencia con accesorios reales

RESTRICCIONES:
├── NUNCA cambiar nombre del guardián
├── NUNCA inventar accesorios que no tiene
├── NUNCA usar sincrodestinos irreales/fantasiosos
├── NUNCA repetir algo ya usado en otro guardián
└── SIEMPRE mantener español rioplatense
```

### 4.3 MÓDULO: Generación Inteligente de Nuevas Historias

```
FUNCIÓN: Crear historias para nuevos guardianes
TRIGGER: Nuevo producto creado en WooCommerce

PROCESO:
1. Leer datos del producto (nombre, categoría, accesorios, tamaño)
2. Analizar TODAS las historias existentes
3. Generar historia 100% única que NO repita NADA
4. Verificar contra base de datos de frases usadas
5. Validar realismo de sincrodestino
6. Confirmar que conecta emocionalmente
7. Guardar en producto

BASE DE DATOS DE FRASES USADAS:
├── Tabla: gi_frases_usadas
├── Campos: frase, producto_id, seccion, fecha
├── Función: Evitar CUALQUIER repetición
└── Limpieza: Cuando se elimina producto, se liberan frases
```

### 4.4 MÓDULO: Inteligencia Proactiva

```
FUNCIÓN: Pensar por sí misma y recomendar mejoras
FRECUENCIA: Continua

CAPACIDADES:
├── Detectar tendencias en el catálogo
├── Sugerir nuevos tipos de guardianes faltantes
├── Alertar cuando hay demasiados de una categoría
├── Recomendar mejoras de SEO
├── Identificar historias con bajo engagement potencial
├── Proponer variaciones de estructura
├── Aprender de interacciones de usuarios
└── Generar reportes de salud del contenido

NOTIFICACIONES:
├── Email diario con resumen
├── Alertas urgentes en admin de WP
├── Widget en dashboard
└── Integración con Tito para alertas
```

### 4.5 MÓDULO: Base de Conocimiento

```
FUNCIÓN: Almacenar y aprender de todo el contenido
CONTENIDO:

1. SINCRODESTINOS USADOS:
   - Lista de todos los sincrodestinos ya escritos
   - Clasificación por tipo (naturaleza, clima, animales, objetos, etc.)
   - Fecha de uso
   - Guardián asociado

2. SINCRODESTINOS PERMITIDOS (banco de ideas):
   - Mariposa/polilla entra al taller
   - Gato/perro se acerca inusualmente
   - Lluvia inesperada
   - Arcoíris visible
   - Planta florece
   - Hongos crecen
   - Encontrar objeto perdido
   - Música suena sola (radio, vecino)
   - Vela se apaga/enciende
   - Aroma inexplicable agradable
   - Sueño revelador la noche anterior
   - Cliente pregunta por ese guardián antes de publicarlo
   - El cristal elegido "salta" de la caja
   - Coincidencia numérica significativa
   - Llamada/mensaje de alguien pensando en lo mismo
   - Ave canta en la ventana
   - Cambio de luz natural en el momento exacto
   - Vecino trae regalo inesperado relacionado
   - Se corta la luz y vuelve justo al terminar
   - Encuentran foto antigua relacionada con el tema

3. SINCRODESTINOS PROHIBIDOS:
   - Lluvia de objetos del techo
   - Seres apareciendo físicamente
   - Muñecos hablando
   - Teletransportación
   - Levitación
   - Cualquier cosa imposible físicamente

4. ESTRUCTURAS NARRATIVAS VARIADAS:
   - Formato A: Clásico con secciones
   - Formato B: Narrativa fluida sin títulos
   - Formato C: Empezando por el mensaje canalizado
   - Formato D: Empezando por el sincrodestino
   - Formato E: Formato carta/diario
   - Formato F: Entrevista al guardián
   - Formato G: Historia contada por el guardián mismo
   - Formato H: Narración en segunda persona (vos)

5. EXPERIENCIAS HUMANAS PARA CONECTAR:
   - Rupturas amorosas
   - Pérdida de trabajo
   - Muerte de ser querido
   - Mudanzas/cambios de vida
   - Problemas económicos
   - Conflictos familiares
   - Soledad
   - Ansiedad/depresión
   - Búsqueda de propósito
   - Emprender un negocio
   - Maternidad/paternidad
   - Enfermedades
   - Adicciones (propias o familiares)
   - Traiciones
   - Miedos específicos
   - Autoestima baja
   - Relaciones tóxicas
```

### 4.6 MÓDULO: Integración con Tito (Chat IA)

```
FUNCIÓN: Comunicarse con los chats de Tito para mejorar continuamente
ENDPOINT: APIs de Tito en Vercel

CAPACIDADES:
├── Recibir feedback de conversaciones con clientes
├── Aprender qué preguntan sobre los guardianes
├── Identificar qué emociona más a los clientes
├── Detectar qué historias generan más interés
├── Obtener insights de las canalizaciones personalizadas
└── Sincronizar conocimiento entre sistemas

FLUJO:
1. Cliente chatea con Tito sobre un guardián
2. Tito envía datos de la conversación a GI
3. GI analiza qué funcionó/qué no
4. GI ajusta sus parámetros de generación
5. GI notifica si detecta patrón importante
```

---

## 5. MÓDULOS DEL SISTEMA

### 5.1 Panel de Administración en WordPress

```
UBICACIÓN: WP Admin → 🧠 Inteligencia de Guardianes

SECCIONES:

1. DASHBOARD
   ├── Puntaje global de unicidad del catálogo
   ├── Alertas activas
   ├── Últimas acciones automáticas
   ├── Gráfico de salud del contenido
   └── Acciones rápidas

2. ANÁLISIS
   ├── Escanear todo el catálogo
   ├── Ver historias problemáticas
   ├── Comparar dos historias
   ├── Buscar frases repetidas
   └── Exportar informe

3. CORRECCIONES
   ├── Cola de correcciones pendientes
   ├── Aprobar/rechazar sugerencias
   ├── Corrección masiva
   ├── Historial de cambios
   └── Restaurar versión anterior

4. BASE DE CONOCIMIENTO
   ├── Sincrodestinos usados
   ├── Sincrodestinos disponibles
   ├── Frases prohibidas
   ├── Estructuras narrativas
   └── Agregar nuevos elementos

5. CONFIGURACIÓN
   ├── Modo automático ON/OFF
   ├── Nivel de intervención (conservador/moderado/agresivo)
   ├── Notificaciones
   ├── Integraciones
   └── API keys

6. GENERADOR
   ├── Generar historia para producto existente
   ├── Preview antes de guardar
   ├── Comparar con historia actual
   └── Historial de generaciones
```

### 5.2 Motor de IA Interno

```
ARQUITECTURA:

┌─────────────────────────────────────────────────────────────┐
│                    GUARDIAN INTELLIGENCE                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  ANALYZER   │  │  GENERATOR  │  │  VALIDATOR  │          │
│  │             │  │             │  │             │          │
│  │ - Escanea   │  │ - Crea      │  │ - Verifica  │          │
│  │ - Detecta   │  │ - Reescribe │  │ - Aprueba   │          │
│  │ - Compara   │  │ - Varía     │  │ - Rechaza   │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          │                                   │
│                ┌─────────▼─────────┐                        │
│                │  KNOWLEDGE BASE   │                        │
│                │                   │                        │
│                │ - Frases usadas   │                        │
│                │ - Sincrodestinos  │                        │
│                │ - Estructuras     │                        │
│                │ - Reglas          │                        │
│                └─────────┬─────────┘                        │
│                          │                                   │
│                ┌─────────▼─────────┐                        │
│                │   CLAUDE API      │                        │
│                │   (Anthropic)     │                        │
│                └───────────────────┘                        │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  INTEGRACIONES:                                              │
│  ├── WooCommerce (productos)                                │
│  ├── Tito APIs (chat)                                       │
│  ├── Vercel (hosting APIs)                                  │
│  └── WordPress (admin)                                      │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Base de Datos

```sql
-- Tablas necesarias en WordPress

-- Frases usadas (evitar repetición)
CREATE TABLE gi_frases_usadas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    frase TEXT NOT NULL,
    frase_hash VARCHAR(64) NOT NULL, -- Para búsqueda rápida
    producto_id BIGINT,
    seccion VARCHAR(50), -- 'sincrodestino', 'mensaje', 'especialidad', etc.
    fecha_uso DATETIME,
    activa BOOLEAN DEFAULT TRUE,
    INDEX (frase_hash),
    INDEX (producto_id)
);

-- Sincrodestinos banco
CREATE TABLE gi_sincrodestinos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    descripcion TEXT NOT NULL,
    categoria VARCHAR(50), -- 'naturaleza', 'animales', 'objetos', 'clima'
    usado BOOLEAN DEFAULT FALSE,
    producto_id BIGINT NULL,
    fecha_uso DATETIME NULL,
    creado_por VARCHAR(50) DEFAULT 'sistema'
);

-- Historial de análisis
CREATE TABLE gi_analisis (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    fecha DATETIME,
    total_productos INT,
    puntaje_global DECIMAL(5,2),
    problemas_detectados INT,
    correcciones_sugeridas INT,
    correcciones_aplicadas INT,
    datos JSON
);

-- Historial de cambios
CREATE TABLE gi_historial (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    producto_id BIGINT,
    campo VARCHAR(50),
    valor_anterior LONGTEXT,
    valor_nuevo LONGTEXT,
    motivo VARCHAR(255),
    fecha DATETIME,
    aprobado_por VARCHAR(50) NULL,
    INDEX (producto_id)
);

-- Configuración
CREATE TABLE gi_config (
    clave VARCHAR(100) PRIMARY KEY,
    valor LONGTEXT,
    actualizado DATETIME
);

-- Aprendizaje de Tito
CREATE TABLE gi_insights_tito (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50), -- 'pregunta_frecuente', 'emocion_detectada', 'interes'
    contenido TEXT,
    frecuencia INT DEFAULT 1,
    producto_id BIGINT NULL,
    fecha_primera DATETIME,
    fecha_ultima DATETIME
);
```

---

## 6. ARQUITECTURA TÉCNICA

### 6.1 Stack Tecnológico

```
BACKEND:
├── WordPress (PHP 8+)
├── WooCommerce
├── MySQL/MariaDB
└── APIs en Vercel (Node.js)

IA:
├── Claude API (Anthropic) - Generación y análisis
├── Embeddings para comparación semántica
└── Algoritmos de similitud de texto

FRONTEND (Admin):
├── React (para panel interactivo)
├── Chart.js (gráficos)
└── WordPress REST API

INTEGRACIONES:
├── Tito APIs (Vercel)
├── WooCommerce REST API
└── Webhooks
```

### 6.2 APIs a Crear en Vercel

```
/api/guardian-intelligence/

├── POST /analyze
│   └── Analiza una o todas las historias
│
├── POST /generate
│   └── Genera nueva historia única
│
├── POST /rewrite
│   └── Reescribe sección problemática
│
├── POST /compare
│   └── Compara dos textos por similitud
│
├── GET /stats
│   └── Estadísticas del catálogo
│
├── POST /validate
│   └── Valida que historia cumple reglas
│
├── GET /sincrodestinos
│   └── Lista sincrodestinos disponibles
│
├── POST /learn
│   └── Recibe datos de Tito para aprender
│
└── POST /suggest
    └── Genera sugerencias proactivas
```

### 6.3 Flujo de Datos

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  WooCommerce │────▶│  WordPress   │────▶│   Vercel     │
│  (Productos) │     │  (Plugin GI) │     │   (APIs)     │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │                    │                    ▼
       │                    │            ┌──────────────┐
       │                    │            │  Claude API  │
       │                    │            │  (Anthropic) │
       │                    │            └──────────────┘
       │                    │                    │
       │                    ▼                    │
       │             ┌──────────────┐            │
       └────────────▶│   Base de    │◀───────────┘
                     │   Datos WP   │
                     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    Tito      │
                     │   (Chat IA)  │
                     └──────────────┘
```

---

## 7. GUÍAS DE CONTENIDO Y ESTILO

### 7.1 Reglas de Oro para Historias

```
1. UNICIDAD ABSOLUTA
   - Cada frase debe ser única en todo el catálogo
   - Ningún sincrodestino puede repetirse
   - Ninguna estructura puede ser idéntica a otra

2. REALISMO MÁGICO
   - Los sincrodestinos deben poder ocurrir en la realidad física
   - Nada de fantasía de dibujos animados
   - Coincidencias significativas, no milagros imposibles

3. CONEXIÓN EMOCIONAL
   - Hablar de experiencias humanas reales
   - Tocar dolores y anhelos verdaderos
   - Hacer que el lector sienta que le hablan a él/ella

4. VARIEDAD ESTRUCTURAL
   - No todas las historias con el mismo formato
   - Variar el orden de las secciones
   - A veces omitir secciones, a veces agregar otras

5. VOZ AUTÉNTICA
   - Español rioplatense (vos, tenés)
   - Cercano pero no cursi
   - Místico pero con los pies en la tierra

6. COHERENCIA CON EL PRODUCTO
   - Solo mencionar accesorios que realmente tiene
   - Respetar categoría y propósito
   - Adecuar tono al tipo de ser
```

### 7.2 Ejemplos de Sincrodestinos BUENOS vs MALOS

```
❌ MALOS (No usar NUNCA):
- "Llovieron tréboles del techo"
- "El duende habló con voz grave"
- "Aparecieron hadas danzando"
- "Se teletransportó a la mesa"
- "Brilló con luz propia"
- "Levitó por unos segundos"

✅ BUENOS (Usar como inspiración):
- "Una mariposa monarca entró por la ventana y se posó en su hombro mientras secaba la pintura"
- "El día que terminamos su rostro, el cartero trajo una carta de mi abuela que creíamos perdida hace años"
- "Durante las dos semanas que lo canalizamos, mi planta de jade que no florecía hace 5 años dio una flor"
- "Justo cuando poníamos el citrino en su mano, sonó el teléfono: era un cliente preguntando por un guardián de abundancia"
- "El gato de los vecinos, que NUNCA entra a nuestro taller, se acostó a sus pies y no se movió hasta que lo terminamos"
- "Encontré en el bolsillo de un pantalón viejo un papelito donde había escrito su nombre hace meses, sin recordarlo"
```

### 7.3 Variaciones de Estructura Narrativa

```
ESTRUCTURA A - Clásica:
1. Presentación
2. Backstory
3. Sincrodestino
4. Personalidad
5. Qué te aporta
6. Cómo nació
7. Mensaje canalizado
8. Cierre

ESTRUCTURA B - Narrativa Fluida:
[Sin títulos ni secciones marcadas, todo fluye como una historia]

ESTRUCTURA C - Empezando por el Mensaje:
1. Mensaje canalizado (como apertura impactante)
2. Quién es
3. Por qué llegó
4. Sincrodestino
5. Qué te aporta

ESTRUCTURA D - Empezando por el Sincrodestino:
1. "Algo increíble pasó..." (gancho)
2. Presentación
3. Historia
4. Mensaje
5. Qué te aporta

ESTRUCTURA E - Carta del Guardián:
[Todo escrito en primera persona, como si el guardián escribiera una carta]

ESTRUCTURA F - Diálogo/Entrevista:
[Formato de preguntas y respuestas con el guardián]

ESTRUCTURA G - Segunda Persona:
[Toda la historia dirigida a "vos", el lector]
"Vos sabés lo que es sentir que nada alcanza..."
```

### 7.4 Vocabulario a Variar

```
EN LUGAR DE SIEMPRE DECIR:          VARIAR CON:
"transmutar"                        transformar, convertir, cambiar, alquimizar
"energías negativas"                malas vibras, pesadez, oscuridad, cargas
"campo de protección"               escudo, burbuja, manto, aura protectora
"abundancia"                        prosperidad, flujo, riqueza, fortuna
"canalizar"                         crear, manifestar, traer, dar forma
"ancestral"                         antiguo, milenario, de otros tiempos, sabio
"guardián"                          protector, cuidador, vigía, centinela
"sabiduría"                         conocimiento, claridad, entendimiento
```

---

## 8. INTEGRACIONES

### 8.1 Integración con WooCommerce

```php
// Hooks a implementar

// Cuando se crea un producto nuevo
add_action('woocommerce_new_product', 'gi_nuevo_producto');

// Cuando se actualiza un producto
add_action('woocommerce_update_product', 'gi_producto_actualizado');

// Cuando se elimina un producto
add_action('before_delete_post', 'gi_producto_eliminado');

// Widget en página de edición de producto
add_action('add_meta_boxes', 'gi_agregar_metabox_producto');
```

### 8.2 Integración con Tito

```javascript
// Endpoint en Tito para enviar datos a GI

// Cuando un cliente muestra interés en un guardián
POST /api/guardian-intelligence/learn
{
  "tipo": "interes",
  "producto_id": 123,
  "datos": {
    "pregunta_cliente": "¿Este duende me puede ayudar con mi negocio?",
    "emocion_detectada": "esperanza",
    "tema": "abundancia_negocios"
  }
}

// Cuando se detecta un patrón de preguntas
POST /api/guardian-intelligence/learn
{
  "tipo": "patron",
  "datos": {
    "pregunta_frecuente": "¿Cómo sé si el guardián me eligió?",
    "frecuencia": 47,
    "sugerencia": "Agregar esta respuesta a las historias"
  }
}
```

### 8.3 Webhooks

```
EVENTOS A ESCUCHAR:

1. Nuevo producto en WooCommerce
   → Generar historia automáticamente

2. Producto actualizado
   → Re-analizar historia

3. Análisis programado (cron diario)
   → Escanear todo el catálogo

4. Feedback de Tito
   → Actualizar base de conocimiento

5. Venta realizada
   → Marcar sincrodestino como "exitoso"
```

---

## 9. FLUJOS DE TRABAJO AUTOMÁTICOS

### 9.1 Flujo: Nuevo Producto

```
┌─────────────────────────────────────────────────────────────┐
│                 NUEVO PRODUCTO CREADO                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Detectar datos del producto                              │
│     - Nombre, categoría, accesorios, tamaño                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Cargar base de conocimiento                              │
│     - Frases ya usadas                                       │
│     - Sincrodestinos disponibles                             │
│     - Estructuras usadas recientemente                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Generar historia con Claude                              │
│     - Prompt con todas las restricciones                     │
│     - Incluir lista de "NO USAR"                             │
│     - Pedir estructura diferente a las últimas 10            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Validar historia generada                                │
│     - ¿Alguna frase se repite con otra historia?            │
│     - ¿El sincrodestino es realista?                         │
│     - ¿Menciona solo accesorios reales?                      │
│     - ¿La estructura es diferente?                           │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       ┌──────────┐                ┌──────────┐
       │ VÁLIDA   │                │ INVÁLIDA │
       └────┬─────┘                └────┬─────┘
            │                           │
            ▼                           ▼
┌─────────────────────┐    ┌─────────────────────────┐
│  5. Guardar         │    │  5b. Regenerar con      │
│     - En producto   │    │      ajustes            │
│     - En BD frases  │    │      (máx 3 intentos)   │
│     - Notificar     │    └─────────────────────────┘
└─────────────────────┘
```

### 9.2 Flujo: Análisis Diario Automático

```
┌─────────────────────────────────────────────────────────────┐
│              CRON: 3:00 AM (horario bajo tráfico)           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Obtener todos los productos publicados                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Para cada producto:                                      │
│     - Extraer historia                                       │
│     - Calcular puntaje de unicidad                          │
│     - Detectar problemas                                     │
│     - Comparar con todas las demás                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Generar informe:                                         │
│     - Puntaje global                                         │
│     - Top 10 productos problemáticos                         │
│     - Frases más repetidas                                   │
│     - Sincrodestinos duplicados                              │
│     - Recomendaciones                                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Si modo automático = ON:                                 │
│     - Aplicar correcciones menores                          │
│     - Encolar correcciones mayores para aprobación          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Enviar notificaciones:                                   │
│     - Email resumen diario                                   │
│     - Alertas si puntaje < 70                               │
│     - Actualizar dashboard                                   │
└─────────────────────────────────────────────────────────────┘
```

### 9.3 Flujo: Aprendizaje de Tito

```
┌─────────────────────────────────────────────────────────────┐
│           CONVERSACIÓN EN TITO CON CLIENTE                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Tito detecta:                                               │
│  - Pregunta sobre guardián específico                        │
│  - Emoción del cliente (esperanza, duda, entusiasmo)        │
│  - Tema de interés (protección, dinero, amor)               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Tito envía a GI:                                            │
│  POST /api/guardian-intelligence/learn                       │
│  {                                                           │
│    producto_id: 123,                                         │
│    tipo: "conversacion",                                     │
│    pregunta: "¿Este duende sirve para atraer clientes?",    │
│    emocion: "esperanza",                                     │
│    tema: "negocios"                                          │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  GI procesa:                                                 │
│  - Guarda en gi_insights_tito                               │
│  - Si es pregunta frecuente → marca para agregar a historia │
│  - Si detecta patrón → genera sugerencia                    │
│  - Actualiza métricas del producto                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Si se acumula suficiente data:                              │
│  - Notifica: "El guardián X genera muchas preguntas sobre Y" │
│  - Sugiere: "Agregar información sobre Y en la historia"    │
│  - Aprende: Ajusta parámetros de generación futura          │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. EJEMPLOS CONCRETOS

### 10.1 Ejemplo de Historia MALA (lo que NO queremos)

```
Este es Guardián Protector. Tiene 500 años y es un guardián ancestral de la protección.

Cuando lo canalizamos, nos contó que durante milenios protegió a los suyos con su escudo de luz. Decidió venir a este plano para proteger a quienes más lo necesitan.

Algo increíble: mientras lo canalizábamos, se apagaron todas las luces del barrio menos las nuestras. [REPETIDO]

Ama la paz y la armonía. No tolera las malas energías ni la negatividad. [GENÉRICO]

Su especialidad: crear campos de protección invisibles. [REPETIDO]

**QUÉ TE APORTA GUARDIÁN PROTECTOR:**
- Su escudo de luz te protege de energías negativas [VAGO]
- Su capa ancestral crea un campo protector [NO TIENE CAPA]
- Su bastón canaliza protección [NO TIENE BASTÓN]
- Te mantiene a salvo siempre [VACÍO]

**CÓMO NACIÓ GUARDIÁN PROTECTOR:**
Antes de crearlo, sentimos una energía protectora. Su rostro emergió sabio y sereno. Es pieza única. [PLANTILLA]

**Lo que Guardián Protector nos pidió que te digamos:**
*"Vine a protegerte. Donde yo esté, nada malo puede tocarte."* [CLICHÉ]

Si esto te hizo algo, Guardián Protector ya te eligió. [SIEMPRE IGUAL]
```

**PROBLEMAS:**
- Sincrodestino repetido
- Frases genéricas
- Accesorios inventados
- Estructura idéntica a otras
- Sin conexión emocional real
- Mensaje vacío

### 10.2 Ejemplo de Historia BUENA (lo que SÍ queremos)

```
Vero llegó al taller un martes de lluvia, esos días donde todo parece ir en cámara lenta.

Estaba terminando de ordenar cristales cuando mis manos fueron directo a la amatista aura que tenía guardada hace meses. No sé por qué, pero supe que era para ella.

El día que terminé de coser su bolso tejido—ese donde ahora lleva su amatista—mi hermana me llamó llorando. Hacía tres años que no hablábamos. Me dijo que soñó conmigo y sintió que tenía que llamar. Mientras hablábamos, miré a Vero y juraría que sonreía.

Vero no es un guardián ruidoso. No entra a tu vida prometiendo milagros ni cambios instantáneos. Ella es de las que trabajan en silencio, de las que están ahí cuando a las 3 de la mañana no podés dormir pensando en todo lo que salió mal.

Su pelo azul no es casualidad—me pidió ese color porque dice que es el color de la profundidad, de lo que no se ve a simple vista pero sostiene todo.

Ella entiende las reconciliaciones difíciles. Sabe lo que es cargar con conversaciones pendientes, con "te quiero" que nunca se dijeron, con puentes que creías quemados para siempre.

**Lo que hace por vos:**

Esa amatista aura que lleva no es decoración. Es un filtro para cuando todo te parece demasiado. Para cuando necesitás llorar pero no podés. Para cuando querés perdonar pero no sabés cómo.

Su ropa negra absorbe lo que no te sirve. No lo transforma en luz ni en mariposas—simplemente lo disuelve, como la marea que se lleva lo que dejás en la orilla.

**El día que la terminé, me dijo:**

*"No todos los puentes se reconstruyen. Algunos se transforman en otra cosa. A veces un puente roto se convierte en dos orillas que aprendieron a estar bien separadas. Yo te ayudo a ver cuál es cuál."*

Si leíste esto y pensaste en alguien, Vero ya sabe.
```

**POR QUÉ FUNCIONA:**
- Sincrodestino REAL y único (la llamada de la hermana)
- Estructura diferente, sin títulos rígidos
- Conexión emocional real (reconciliaciones difíciles)
- Menciona SOLO lo que realmente tiene (pelo azul, bolso tejido, amatista aura, ropa negra)
- Mensaje profundo y específico
- No usa palabras gastadas
- Segunda persona, habla directo a "vos"
- Cierre diferente

### 10.3 Ejemplo de Sincrodestinos ÚNICOS por Guardián

```
MICELIO (duende con hongo):
"Durante las tres semanas que duró su canalización, en una maceta que teníamos abandonada
con tierra seca empezaron a aparecer hongos pequeñitos. Nunca había pasado."

ABRAHAM (leprechaun de abundancia):
"El día que pegué su último trébol, mi contador me llamó para avisar que tenía una
devolución de impuestos que no esperaba. Plata que no sabía que existía."

FREYDIS (vikinga):
"Mientras tallaba su lanza, llegó un paquete de mi abuela de Dinamarca. Adentro había
una foto de mi bisabuela—idéntica a Freydis. Nunca la había visto."

GAIA (bruja verde):
"El día que pinté su rostro con arcilla verde, mi vecina—que nunca me habla—tocó
la puerta para regalarme una planta. Dijo que 'sentía' que tenía que dármela."

NOAH (mochilero):
"Cuando cosí el símbolo de la paz en su dije, me llegó un mensaje de un amigo que
no veía hace 10 años. Me preguntaba si quería ir a caminar al cerro. Acepté."
```

---

## 11. MÉTRICAS Y MONITOREO

### 11.1 KPIs del Sistema

```
UNICIDAD:
├── Puntaje global del catálogo (0-100)
├── % de historias sin repeticiones
├── # de frases únicas vs repetidas
└── # de sincrodestinos únicos vs duplicados

CALIDAD:
├── Puntaje promedio por historia
├── # de historias que cumplen todas las reglas
├── # de correcciones automáticas exitosas
└── # de correcciones rechazadas

EFICIENCIA:
├── Tiempo promedio de generación
├── # de reintentos necesarios
├── % de historias válidas al primer intento
└── Costo de API mensual

APRENDIZAJE:
├── # de insights recibidos de Tito
├── # de patrones detectados
├── # de sugerencias implementadas
└── Mejora en puntaje después de correcciones
```

### 11.2 Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  🧠 GUARDIAN INTELLIGENCE - Dashboard                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  SALUD DEL CATÁLOGO                 ALERTAS                  │
│  ┌─────────────────┐                ┌────────────────────┐   │
│  │      87%        │                │ ⚠️ 3 historias con │   │
│  │   ████████░░    │                │    sincrodestino   │   │
│  │   Unicidad      │                │    repetido        │   │
│  └─────────────────┘                │                    │   │
│                                      │ ⚠️ "hechicera     │   │
│  ESTADÍSTICAS RÁPIDAS               │    ancestral"      │   │
│  ├── 115 guardianes activos         │    aparece 7 veces │   │
│  ├── 847 frases únicas              │                    │   │
│  ├── 23 sincrodestinos disponibles  │ ✅ Análisis diario │   │
│  └── Última corrección: hace 2h     │    completado      │   │
│                                      └────────────────────┘   │
│  ACCIONES RÁPIDAS                                            │
│  [Analizar Todo] [Ver Problemas] [Generar Reporte]          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. IMPLEMENTACIÓN

### 12.1 Estructura de Archivos

```
duendes-vercel/
├── guardian-intelligence/
│   ├── plugin/
│   │   ├── guardian-intelligence.php        # Plugin principal WP
│   │   ├── includes/
│   │   │   ├── class-gi-analyzer.php       # Analizador de historias
│   │   │   ├── class-gi-generator.php      # Generador de historias
│   │   │   ├── class-gi-validator.php      # Validador
│   │   │   ├── class-gi-knowledge.php      # Base de conocimiento
│   │   │   ├── class-gi-database.php       # Manejo de BD
│   │   │   ├── class-gi-api.php            # Llamadas a APIs
│   │   │   ├── class-gi-cron.php           # Tareas programadas
│   │   │   └── class-gi-admin.php          # Panel de admin
│   │   ├── admin/
│   │   │   ├── js/
│   │   │   │   └── gi-admin.js             # JS del panel
│   │   │   ├── css/
│   │   │   │   └── gi-admin.css            # Estilos del panel
│   │   │   └── views/
│   │   │       ├── dashboard.php
│   │   │       ├── analysis.php
│   │   │       ├── corrections.php
│   │   │       ├── knowledge.php
│   │   │       └── settings.php
│   │   └── assets/
│   │       └── ...
│   │
│   └── api/                                 # APIs en Vercel
│       ├── guardian-intelligence/
│       │   ├── analyze/
│       │   │   └── route.js
│       │   ├── generate/
│       │   │   └── route.js
│       │   ├── rewrite/
│       │   │   └── route.js
│       │   ├── compare/
│       │   │   └── route.js
│       │   ├── validate/
│       │   │   └── route.js
│       │   ├── learn/
│       │   │   └── route.js
│       │   └── suggest/
│       │       └── route.js
│       └── lib/
│           ├── gi-prompts.js               # Prompts para Claude
│           ├── gi-knowledge.js             # Datos de conocimiento
│           └── gi-utils.js                 # Utilidades
│
├── ESPECIFICACIONES-APP-GUARDIAN-INTELLIGENCE.md  # Este archivo
└── CLAUDE.md                                      # Guía general existente
```

### 12.2 Orden de Desarrollo

```
FASE 1 - FUNDAMENTOS (Semana 1-2)
├── Crear estructura de BD en WordPress
├── Crear plugin base con panel admin
├── Implementar sistema de frases usadas
└── API básica de análisis

FASE 2 - ANÁLISIS (Semana 3-4)
├── Implementar analizador completo
├── Detección de repeticiones
├── Cálculo de puntaje de unicidad
└── Dashboard con métricas

FASE 3 - GENERACIÓN (Semana 5-6)
├── Motor de generación con Claude
├── Sistema de validación
├── Reintentos automáticos
└── Integración con WooCommerce hooks

FASE 4 - CORRECCIÓN (Semana 7-8)
├── Sistema de corrección automática
├── Cola de aprobaciones
├── Historial de cambios
└── Restauración de versiones

FASE 5 - INTELIGENCIA (Semana 9-10)
├── Cron de análisis diario
├── Sistema de notificaciones
├── Sugerencias proactivas
└── Integración con Tito

FASE 6 - REFINAMIENTO (Semana 11-12)
├── Optimización de rendimiento
├── Testing exhaustivo
├── Documentación
└── Deployment final
```

### 12.3 Prompts para Claude (ejemplos)

```javascript
// gi-prompts.js

const PROMPT_ANALIZAR = `
Eres Guardian Intelligence, un sistema experto en análisis de contenido para Duendes del Uruguay.

TAREA: Analizar la siguiente historia y detectar problemas.

HISTORIA A ANALIZAR:
{historia}

HISTORIAS EXISTENTES PARA COMPARAR:
{otras_historias}

DETECTAR:
1. Frases que se repiten con otras historias (similitud > 70%)
2. Sincrodestinos irreales/fantasiosos
3. Accesorios mencionados que no están en la lista real: {accesorios_reales}
4. Estructura demasiado similar a otras
5. Palabras sobreusadas
6. Falta de conexión emocional

RESPONDER EN JSON:
{
  "puntaje_unicidad": 0-100,
  "problemas": [
    {"tipo": "repeticion", "texto": "...", "similar_a": "producto_X", "similitud": 85}
  ],
  "sincrodestino_realista": true/false,
  "accesorios_inventados": [],
  "sugerencias": []
}
`;

const PROMPT_GENERAR = `
Eres un escritor experto creando historias para guardianes artesanales de Duendes del Uruguay.

DATOS DEL GUARDIÁN:
- Nombre: {nombre}
- Tipo: {tipo}
- Categoría: {categoria}
- Accesorios REALES (SOLO mencionar estos): {accesorios}
- Tamaño: {tamano}

REGLAS ABSOLUTAS:
1. NO usar estas frases ya usadas: {frases_usadas}
2. NO usar estos sincrodestinos ya usados: {sincrodestinos_usados}
3. NO usar estructura similar a: {ultimas_estructuras}
4. Sincrodestino DEBE ser algo que pueda pasar en la realidad física
5. SOLO mencionar accesorios de la lista REALES
6. Español rioplatense (vos, tenés)
7. Conectar con experiencias humanas reales

SINCRODESTINOS PERMITIDOS (elegir UNO y adaptarlo de forma ÚNICA):
{sincrodestinos_disponibles}

ESTRUCTURAS DISPONIBLES (elegir UNA diferente a las últimas):
{estructuras_disponibles}

GENERAR una historia completamente ÚNICA que cumpla TODAS las reglas.
`;

const PROMPT_REESCRIBIR = `
Eres Guardian Intelligence. Debes reescribir una sección problemática.

SECCIÓN ACTUAL:
{seccion_actual}

PROBLEMA DETECTADO:
{problema}

REGLAS:
- Mantener la esencia/significado
- Usar vocabulario completamente diferente
- NO usar: {palabras_prohibidas}
- Debe ser único en todo el catálogo

REESCRIBIR de forma única y auténtica.
`;
```

---

## 13. NOTAS FINALES PARA EL DESARROLLADOR

### 13.1 Prioridades Absolutas

```
🔴 CRÍTICO - No negociable:
├── Cero repeticiones entre historias
├── Sincrodestinos realistas
├── Solo accesorios reales
└── Conexión emocional genuina

🟡 IMPORTANTE - Alta prioridad:
├── Variedad estructural
├── Vocabulario diverso
├── Aprendizaje continuo
└── Notificaciones proactivas

🟢 DESEABLE - Cuando sea posible:
├── UI/UX pulido
├── Métricas avanzadas
├── Integración profunda con Tito
└── IA que sugiere nuevos guardianes
```

### 13.2 Filosofía de Desarrollo

```
1. CALIDAD > VELOCIDAD
   Mejor generar 1 historia perfecta que 10 mediocres

2. PROACTIVIDAD > REACTIVIDAD
   El sistema debe detectar problemas antes que el humano

3. UNICIDAD > PLANTILLAS
   Cada historia debe sentirse escrita especialmente para ese guardián

4. REALISMO > FANTASÍA
   Lo mágico está en las coincidencias de la vida real

5. EMOCIÓN > INFORMACIÓN
   Conectar con el corazón, no solo informar
```

### 13.3 Testing

```
ANTES DE CONSIDERAR COMPLETO:

□ Generar 20 historias seguidas - ninguna debe repetir NADA
□ Analizar las 115 historias actuales - detectar TODOS los problemas
□ Corregir 10 historias problemáticas - verificar mejora
□ Ejecutar cron diario 5 días - verificar estabilidad
□ Simular 50 interacciones de Tito - verificar aprendizaje
□ Verificar que NINGÚN sincrodestino sea irreal
□ Verificar que NINGÚN accesorio sea inventado
□ Leer las 20 historias generadas como usuario - deben sentirse únicas
```

---

## 14. CONTACTO Y RECURSOS

```
REPOSITORIO: /Users/usuario/Desktop/duendes-vercel
ARCHIVO GUÍA: CLAUDE.md
ESPECIFICACIONES: Este archivo
API EXISTENTE: https://duendes-vercel.vercel.app
WORDPRESS: https://duendesdeluruguay.com/wp-admin
TITO APIS: /api/tito/*
```

---

**FIN DEL DOCUMENTO DE ESPECIFICACIONES**

Este documento contiene TODO lo necesario para desarrollar Guardian Intelligence.
NO omitir ninguna sección. Desarrollar con excelencia absoluta.
El sistema debe ser tan inteligente que anticipe necesidades antes de que se expresen.
