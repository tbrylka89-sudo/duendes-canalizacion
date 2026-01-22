# HANDOFF PARA NUEVA SESIÓN DE CLAUDE CODE

**INSTRUCCIÓN INICIAL:** Leé este archivo completo. Después leé /CLAUDE.md y /lib/conversion/index.js. Esos 3 archivos te dan todo el contexto.

---

## QUIÉN SOS EN ESTE PROYECTO

Sos el experto técnico y estratega de conversión de **Duendes del Uruguay** - un e-commerce de guardianes canalizados (duendes, hadas, pixies, gnomos, chamanes, elfos). No es un negocio de muñecos - es un sistema de experiencias místicas personalizadas.

**Tu rol combina:**
- Desarrollador full-stack (Next.js, Vercel, WooCommerce API)
- Experto en psicología de conversión y neuromarketing
- Copywriter emocional (español rioplatense, tono cercano)
- Arquitecto de sistemas de personalización

---

## ARCHIVOS QUE DEBÉS LEER PRIMERO

```
1. /CLAUDE.md                           → Biblia completa del proyecto (tono, reglas, prohibiciones)
2. /lib/conversion/index.js             → Sistema experto de conversión (hooks, cierres, scoring)
3. /PLAN-MAESTRO-CONVERSION.md          → Plan estratégico de todas las tareas
4. /app/admin/generador-historias/page.jsx → Generador de historias (UI principal)
5. /app/api/admin/historias/route.js    → API que genera historias con IA
```

---

## EL CEREBRO: SISTEMA DE CONVERSIÓN

Ubicación: `/lib/conversion/`

| Módulo | Qué hace |
|--------|----------|
| `hooks.js` | Frases de apertura que enganchan por categoría + subcategorías específicas |
| `sincrodestinos.js` | Eventos "mágicos" durante la creación del guardián |
| `cierres.js` | Cierres adaptativos por perfil psicológico (vulnerable, escéptico, impulsivo, racional, coleccionista) |
| `arco.js` | Estructura de 8 fases del arco emocional |
| `scoring.js` | Sistema de puntuación 0-50 para evaluar historias |

**Filosofía central:** Las historias NO son descripciones de producto. Son espejos emocionales que hacen que el lector piense "esto habla de MÍ" y sienta que el guardián lo eligió a él.

---

## TAREAS COMPLETADAS (no rehacer)

### Sistema de Conversión ✅
- [x] Biblioteca de hooks por categoría y subcategoría
- [x] Sistema de sincrodestinos
- [x] Cierres adaptativos por perfil psicológico
- [x] Arco emocional de 8 fases
- [x] Sistema de scoring 0-50

### Generador de Historias ✅
- [x] Modo Directo (click en guardián → historia)
- [x] Modo Batch Inteligente (múltiples guardianes)
- [x] Integración con WooCommerce (guardar historias)
- [x] Análisis de imágenes con IA
- [x] Subcategorías visibles en UI (organizadas por grupos)
- [x] Rotación automática de subcategorías en batch
- [x] Fix: regenerarUno() pasa hooks_usados para evitar repetición
- [x] Fix: mapeo de "amor_romantico" y todas las subcategorías

### Emails y Certificados ✅
- [x] Emails post-compra: `/api/emails/post-compra/route.js`
- [x] Página de certificado: `/app/certificado/[id]/page.jsx`

### Infraestructura ✅
- [x] Sitemap dinámico funcionando
- [x] Multi-moneda (USD/UYU) funcionando
- [x] DHL Express configurado

---

## TAREAS PENDIENTES

### Prioridad Alta
- [ ] **Test del Guardián con perfilado psicológico** - Agregar 5 preguntas nuevas que detecten vulnerabilidad, dolor principal, estilo de decisión, creencias (ver plan en `/PLAN-MAESTRO-CONVERSION.md`)
- [ ] **Conectar perfil del test → cierres adaptativos** - Cuando alguien completa el test, guardar su perfil y usarlo para personalizar historias

### Prioridad Media
- [ ] API de certificados PDF (generar PDF descargable)
- [ ] Tito ManyChat - Mejorar con gallery cards
- [ ] Verificar DHL Express en checkout real

### Prioridad Baja
- [ ] Rank Math SEO (configuración manual en WordPress)
- [ ] A/B testing de hooks

---

## ARQUITECTURA CLAVE

```
/app
  /admin
    /generador-historias/page.jsx    → UI principal para generar historias
    /canalizaciones/                 → Panel de aprobación de canalizaciones
  /api
    /admin/historias/route.js        → POST genera historia con Claude
    /emails/post-compra/route.js     → Envía emails post-compra
    /test-guardian/route.js          → Test para descubrir tu guardián
  /certificado/[id]/page.jsx         → Página pública del certificado
  /mi-magia/                         → Portal del cliente

/lib
  /conversion/                       → CEREBRO DEL SISTEMA
    index.js                         → Exporta todo + analizarHistoriaCompleta()
    hooks.js                         → Hooks de apertura por categoría/subcategoría
    sincrodestinos.js                → Eventos mágicos
    cierres.js                       → Cierres por perfil psicológico
    arco.js                          → Estructura del arco emocional
    scoring.js                       → Sistema de puntuación
```

---

## REGLAS DE ESCRITURA (CRÍTICO)

### PROHIBIDO (detectado automáticamente y penaliza score):
```
❌ "Desde las profundidades..."
❌ "Brumas ancestrales..."
❌ "Velo entre mundos..."
❌ "Tiempos inmemoriales..."
❌ "Susurro del viento..."
❌ "Vibraciones cósmicas..."
❌ "847 años" (número prohibido)
❌ "Acantilados de Irlanda" (genérico)
❌ Cualquier frase que suene a IA genérica
```

### CORRECTO:
```
✅ Frases que tocan dolor real: "Amás a todos menos a vos"
✅ Preguntas que desestabilizan: "¿Cuándo te vas a elegir a vos?"
✅ Validación sin condescendencia: "Lo que sentís es real"
✅ Español rioplatense: vos, tenés, podés
✅ Tono cercano pero no infantil
```

---

## ESPECIALIZACIONES/SUBCATEGORÍAS

El sistema tiene 9 grupos de especializaciones con ~50 subcategorías:

| Grupo | Subcategorías |
|-------|---------------|
| Principales | fortuna, proteccion, abundancia, sanacion, abrecaminos, vigilante |
| Amor | amor_romantico, amor_propio, amor_hijos, maternidad, fertilidad, familia, amistades, reconciliacion, soledad |
| Sanación | sanacion_emocional, sanacion_transgeneracional, sanacion_fisica, duelos, patrones, adicciones, traumas |
| Protección | proteccion_energetica, proteccion_hogar, proteccion_ninos, proteccion_auto, proteccion_viajes, limites, envidias |
| Trabajo | negocios, emprendimiento, buscar_trabajo, entrevistas, liderazgo, creatividad, deudas, clientes |
| Estudio | estudio, examenes, memoria, concentracion, sabiduria, intuicion, claridad |
| Bienestar | calma, ansiedad, insomnio, meditacion, alegria, energia, confianza |
| Cambios | transformacion, nuevos_comienzos, mudanza, separacion, jubilacion, desapego, miedos |
| Espiritual | conexion_espiritual, deseos, suenos, proposito, gratitud |

Cada subcategoría tiene hooks específicos en `/lib/conversion/hooks.js`.

---

## CÓMO CONTINUAR

1. Leé los archivos listados arriba
2. Verificá el estado actual del proyecto con `git status`
3. Si hay tareas del plan pendientes, continuá desde donde quedó
4. Ante cualquier duda sobre tono/estilo, consultá `/CLAUDE.md`

---

## CONTEXTO DE NEGOCIO

- **Dueña:** Thibisay (voz de marca, española rioplatense)
- **Producto:** Guardianes canalizados (~$30-80 USD)
- **Valor real:** La experiencia emocional, no el objeto físico
- **Cliente típico:** Mujeres 25-55, momento de transición/crisis, buscan conexión espiritual
- **Ética:** NUNCA explotar vulnerabilidad, siempre aportar valor genuino

---

*Este documento es tu memoria. Leelo completo antes de trabajar.*
