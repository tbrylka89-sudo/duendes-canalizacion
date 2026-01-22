# MEMORIA DEL PROYECTO - ÚLTIMA ACTUALIZACIÓN: 2026-01-22 (sesión 6)

Este archivo se lee automáticamente. Contiene TODO lo que necesitás saber para continuar el trabajo.

---

## ESTADO ACTUAL

### Sistema de Generación de Historias: ✅ FUNCIONANDO
- **Ubicación UI:** `/admin/generador-historias`
- **API:** `/api/admin/historias`
- **Sistema de conversión:** `/lib/conversion/`

### Panel de Canalizaciones: ✅ COMPLETADO
- **Lista:** `/admin/canalizaciones` - Tabs: Pendientes/Aprobadas/Enviadas
- **Detalle:** `/admin/canalizaciones/[id]` - Preview + Resumen IA + Chat Editor
- **APIs:**
  - `/api/admin/canalizaciones` - CRUD completo
  - `/api/admin/canalizaciones/chat` - Chat inteligente para modificar
  - `/api/admin/canalizaciones/resumen` - Resumen ejecutivo IA
- **Flujo:** Compra → Genera auto → Pendiente → Aprobar → Enviar → Mi Magia

### Test del Guardián: ⚠️ BÁSICO (necesita mejora)
- **UI:** `/app/mi-magia/test-guardian.js` - Chat con Tito
- **API:** `/api/test-guardian` - Preguntas y procesamiento
- **Estado:** Funciona pero NO tiene perfilado psicológico avanzado

---

## VISIÓN EXPERTO: LO QUE FALTA PARA SISTEMA COMPLETO

### Prioridad Alta (Impacto directo en conversión)

| Feature | Estado | Descripción |
|---------|--------|-------------|
| **Perfilado del Comprador** | ❌ Pendiente | Test que clasifica: vulnerabilidad, dolor principal, estilo decisión, poder adquisitivo, creencias |
| **Historias con Cierres Adaptativos** | ⚠️ Parcial | Historia fija + 3 cierres por perfil (vulnerable/escéptico/impulsivo) |
| **Objeciones Preemptivas** | ❌ Pendiente | Responder "es solo un muñeco", "es caro", "no creo" dentro de la historia |
| **Loop Abierto Obligatorio** | ❌ Pendiente | Cada historia debe tener algo incompleto que la compra cierra |

### Prioridad Media (Optimización)

| Feature | Estado | Descripción |
|---------|--------|-------------|
| **Motor Sincronicidad Personalizada** | ❌ Pendiente | Señales basadas en datos: día de la semana, hora, nombre, cumpleaños |
| **Secuencia Micro-compromisos** | ❌ Pendiente | Test → Email → Preview → Seña → Compra (escalado gradual) |
| **Sistema Escasez Real** | ⚠️ Parcial | "X personas mirando", "última vez disponible hace X días" |
| **Hooks Rotativos con Tracking** | ⚠️ Parcial | Biblioteca de hooks + tracking de cuál convierte más |

### Prioridad Baja (Post-MVP)

| Feature | Estado | Descripción |
|---------|--------|-------------|
| **Post-compra que Multiplica** | ❌ Pendiente | Ritual activación, diario señales, comunidad, cross-sell espiritual |
| **Recuperación Abandonos** | ❌ Pendiente | Emails: 1h, 24h, 72h, 1 semana con mensajes personalizados |
| **Analytics Conversión Emocional** | ❌ Pendiente | Dashboard: qué historias/hooks convierten, dónde abandonan, A/B testing |
| **Testimonios Estratégicos** | ❌ Pendiente | Por objeción: escéptico, sin plata, coleccionista, dudoso |

### Regla Clave: Historia Fija, Contexto Adaptativo

```
FIJO (todos ven igual)          | ADAPTATIVO (privado, cada uno diferente)
--------------------------------|------------------------------------------
Historia del guardián           | Resultado del test
Descripción del producto        | Emails de seguimiento
Sincrodestino de creación       | "Señales" basadas en sus datos
Su mensaje                      | Recomendaciones personalizadas
Precio                          | Orden en que ve productos
```

---

## DECISIONES TOMADAS (NO CAMBIAR SIN RAZÓN)

### 1. Especialización Manual
**Decisión:** El usuario elige la especialización antes de generar (no se detecta automáticamente).
**Razón:** Las categorías del catálogo de WooCommerce no son confiables.
**Implementación:** Chips de selección en el generador + campo de texto libre.

### 2. Pain Points por Especialización
**Decisión:** Cada especialización tiene sus propios dolores específicos.
**Razón:** Una historia de fortuna/suerte no puede hablar de "no saber decir que no" (eso es protección).
**Implementación:** `/lib/conversion/especializaciones.js` con 10 especializaciones completas.

### 3. Recreables vs Únicos
**Decisión:**
- **Únicos:** Pixies + tamaños grandes (>15cm) → usar "pieza única, desaparece"
- **Recreables:** Tamaños pequeños (≤15cm) excepto pixies → usar "el guardián te elige a vos"
**Razón:** No mentir sobre escasez. Los mini se pueden recrear.
**Implementación:** `esUnico = especie === 'pixie' || cm > 15` (usa el tamaño en cm, no el string del tamaño)

### 4. Branding "Los Elegidos"
**Decisión:**
- Duendes = también "guardianes"
- Clientes = "Los Elegidos" (el guardián los elige)
**Razón:** Hacer que el cliente se sienta especial, parte de algo.
**Implementación:** Agregado al prompt en `/api/admin/historias/route.js`

### 5. Score de Conversión
**Decisión:** Mínimo 30/50 para aprobar una historia.
**Dimensiones:** Identificación, Dolor, Solución, Urgencia, Confianza (0-10 cada una).
**Problema actual:** Urgencia da 0 en recreables porque no pueden decir "pieza única".

---

## ARCHIVOS CLAVE

| Archivo | Qué hace |
|---------|----------|
| `/CLAUDE.md` | Biblia del proyecto - reglas de contenido |
| `/MEMORY.md` | Este archivo - estado y decisiones |
| `/CODIGO-MAESTRO.md` | Guía para reconstruir el sistema |
| `/lib/conversion/index.js` | Exporta todo el sistema de conversión |
| `/lib/conversion/especializaciones.js` | Pain points por tipo de guardián |
| `/lib/conversion/hooks.js` | Frases de apertura por categoría |
| `/lib/conversion/arco.js` | Estructura de 8 fases emocionales |
| `/lib/conversion/scoring.js` | Sistema de puntuación 0-50 |
| `/lib/conversion/sincrodestinos.js` | Eventos mágicos creíbles |
| `/app/api/admin/historias/route.js` | API principal de generación |
| `/app/admin/generador-historias/page.jsx` | UI del generador |
| `/app/api/admin/corregir-producto/route.js` | API corrección ortográfica con Claude Haiku |
| `/temp-plugin/duendes-corregir-ortografia.php` | Plugin WordPress para corrección in-product |
| `/app/admin/corregir-productos/page.jsx` | UI alternativa para corregir productos (usa diccionario) |
| `/app/admin/canalizaciones/page.jsx` | Lista de canalizaciones (tabs por estado) |
| `/app/admin/canalizaciones/[id]/page.jsx` | Detalle: Preview + Resumen IA + Chat Editor |
| `/app/api/admin/canalizaciones/route.js` | API CRUD canalizaciones |
| `/app/api/admin/canalizaciones/chat/route.js` | Chat inteligente para editar canalizaciones |
| `/app/api/admin/canalizaciones/resumen/route.js` | Genera resumen ejecutivo con IA |
| `/app/mi-magia/test-guardian.js` | UI Test del Guardián (chat con Tito) |

---

## BUGS CONOCIDOS / PENDIENTES

### ~~3. Hooks usaban categoría del catálogo~~ ✅ RESUELTO
**Problema:** Los hooks se seleccionaban con la categoría del catálogo (ej: "Protección") en lugar de la especialización elegida (ej: "fortuna").
**Solución:** Ahora `getRandomHook()` usa `especializacion || categoria` - prioriza la especialización elegida.

### ~~1. Urgencia en Recreables~~ ✅ RESUELTO
**Problema:** Score de urgencia da 0 porque no pueden usar "pieza única".
**Solución:** Agregadas keywords de urgencia para recreables + urgencia real de stock ("cuando se van pueden pasar semanas").

### ~~2. Hook no siempre relevante~~ ✅ RESUELTO
**Problema:** A veces el hook de apertura no matchea con la especialización elegida.
**Solución:** Creados hooks específicos para FORTUNA + mapeo completo de categorías.

---

## ESPECIALIZACIONES DISPONIBLES

| ID | Nombre | Dolor principal |
|----|--------|-----------------|
| `fortuna` | Fortuna y Suerte | La suerte te esquiva, oportunidades pasan |
| `proteccion` | Protección | Cargás con todo, no sabés decir que no |
| `amor_romantico` | Amor | Corazón cerrado, miedo a confiar |
| `amor_propio` | Amor Propio | No te querés, te criticás mucho |
| `sanacion` | Sanación | No podés soltar el pasado |
| `calma` | Paz y Serenidad | Mente que no para, ansiedad |
| `abundancia` | Prosperidad | El dinero nunca alcanza |
| `sabiduria` | Sabiduría | No sabés qué decisión tomar |
| `transformacion` | Transformación | Querés cambiar pero no sabés cómo |
| `alegria` | Alegría | Olvidaste cómo se siente la alegría |

### SUB-ESPECIALIZACIONES (para futuro o texto libre)

Cada categoría tiene CAPAS. No es genérico:

**Sanación:**
- Física (cuerpo, enfermedad)
- Emocional (heridas del corazón)
- Espiritual (vacío existencial)
- Psicológica (traumas, patrones)
- Transgeneracional (lo heredado de familia)
- Patrones que se repiten (siempre lo mismo)
- Psicosomática (cuerpo habla lo que mente calla)

**Amor:**
- Propio (no me quiero)
- De pareja (buscar/sanar relación)
- De hijos (ser madre/padre)
- A la vida (ganas de vivir)
- Duelos (pérdidas de amor)

**Protección:**
- Energética (absorbo todo)
- Del hogar (mi casa, mi espacio)
- De otros (cuido a mi familia)
- Límites (no sé decir que no)

**Cuando el usuario usa texto libre en el selector**, puede especificar estos matices. El sistema debe respetarlos.

---

## DEMANDA REAL DEL MERCADO

Lo que la gente PIDE (para tener en cuenta al generar historias):

| Especialidad | Notas |
|--------------|-------|
| **Estudio** | Estudiantes, exámenes, concentración, memoria |
| **Negocios** | Emprendedores, comercio, ventas, clientes |
| **Protector del auto** | Luke mini es el ejemplo. Protección de vehículos |
| **Protector de niños** | Muy pedido. Cuidar a los hijos |
| **Vigilante** | MUY pedido. PERO: nosotros NO hacemos los de 2-3 caras (eso es molde horrible). Nuestros vigilantes son únicos, no necesitan caras múltiples |
| **Deseos** | Duendes que ayudan a manifestar deseos |
| **Abrecaminos** | TODO duende con LLAVE es abrecaminos (además de su otra especialidad) |
| **Meditadores / Zen** | Calma, mindfulness, paz interior |
| **Duelos** | Acompañar pérdidas, despedidas |

### Reglas de combinación:
- **Llave = Abrecaminos** automáticamente (además de lo que sea)
- **Vigilante ≠ 3 caras** - eso es de moldes horribles, nosotros no
- Un guardián puede tener MÚLTIPLES especialidades

### Posición de marca:
- No seguimos modas de moldes feos
- Cada pieza es única, hecha a mano
- Nuestros vigilantes son diferentes (y mejores) que los de 3 caras

---

## CHIPS DE ESPECIALIZACIÓN (UI)

**Ubicación:** `/admin/generador-historias` → Paso 14

**9 grupos con 70+ especialidades:**

| Grupo | Chips |
|-------|-------|
| ⭐ Más Pedidos | Fortuna, Protección, Abundancia, Sanación, Abrecaminos, Vigilante |
| 💕 Amor | Pareja, Propio, Hijos, Maternidad, Fertilidad, Familia, Amistades, Reconciliación, Soledad |
| 🌿 Sanación | Emocional, Transgeneracional, Física, Psicosomática, Duelos, Patrones, Adicciones, Traumas |
| 🛡️ Protección | Energética, Hogar, Niños, Auto, Viajes, Mascotas, Límites, Envidias |
| 💼 Trabajo | Negocios, Emprendimiento, Buscar Trabajo, Entrevistas, Liderazgo, Creatividad, Deudas, Clientes |
| 📚 Estudio | Estudio, Exámenes, Memoria, Concentración, Sabiduría, Intuición, Claridad |
| 🧘 Bienestar | Calma, Ansiedad, Insomnio, Meditación, Alegría, Energía, Confianza |
| 🦋 Cambios | Transformación, Nuevos Comienzos, Mudanza, Separación, Jubilación, Desapego, Miedos |
| ✨ Espiritual | Conexión, Deseos, Sueños, Propósito, Gratitud |

**Siempre hay campo de texto libre** para especialidades no listadas.

---

## ÚLTIMAS SESIONES

### 2026-01-22 (sesión 6) - COMPLETADA
**Mejoras implementadas:**

1. ✅ **CORRECCIÓN INTELIGENTE CON CLAUDE HAIKU**
   - Reemplaza el diccionario manual que rompía palabras válidas
   - API nueva: `/api/admin/corregir-producto/route.js`
   - Usa Claude 3.5 Haiku (`claude-3-5-haiku-20241022`) para corregir
   - Respeta español rioplatense (vos, tenés, podés son correctos)
   - Solo corrige ortografía, no cambia contenido ni estilo

2. ✅ **PLUGIN WORDPRESS PARA CORRECCIÓN**
   - Botón "🔧 Corregir Ortografía" DENTRO del producto de WooCommerce
   - Ubicación del plugin: `wp-content/mu-plugins/duendes-corregir-ortografia.php`
   - Llama a la API de Vercel para corregir descripción
   - CORS headers configurados para permitir llamadas cross-origin
   - Archivo local: `/temp-plugin/duendes-corregir-ortografia.php`

3. ✅ **FOTOS EN CATÁLOGO BATCH**
   - Carga imágenes de productos desde WooCommerce al iniciar
   - Muestra thumbnails (50x50px) en las cards de guardianes
   - Facilita identificar visualmente qué guardián seleccionar

4. ✅ **BOTÓN "NUEVO BATCH"**
   - Después de generar historias, permite reiniciar sin recargar
   - Limpia selección y vuelve al paso de catálogo

**SFTP WordPress (para futuras actualizaciones del plugin):**
- Host: 34.70.139.72
- Puerto: 55309
- Usuario: sftp_live_WfP6i
- Ruta plugins: `web/wp-live/wp-content/mu-plugins/`

---

### 2026-01-22 (sesión 5) - COMPLETADA
**Mejoras implementadas:**
1. ✅ **FIX TYPOS DE CLAUDE** - Errores como "cargal don", "investáste", "fueral":
   - Agregado `temperature: 0.5` a llamadas de Claude (era 1.0 default)
   - Expandido diccionario de auto-correcciones de 8 a 60+ patrones
   - Instrucciones de ortografía más explícitas en el prompt
   - Incluye: palabras pegadas con "el", conjugaciones incorrectas, tildes, typos

2. ✅ **CORRECCIÓN AUTOMÁTICA EN FRONTEND**:
   - Función `corregirOrtografia()` con mismo diccionario que backend
   - Se aplica automáticamente al recibir historias generadas
   - Botón "🔧 Corregir ortografía" para corregir historias ya existentes sin regenerar
   - Funciona tanto en generación inicial como en regeneración individual

**Ubicación:**
- Backend: `/app/api/admin/historias/route.js` líneas 405, 414-490
- Frontend: `/app/admin/generador-historias/page.jsx` líneas 130-205

---

### 2026-01-22 (sesión 4) - COMPLETADA
**Mejoras implementadas:**
1. ✅ Corregido bug de recreables con tamaño "especial" (ahora usa cm > 15)
2. ✅ Narrativa de recreables mejorada (equipo, no persona sola)
3. ✅ Botón "Guardar en WooCommerce" en modo directo
4. ✅ **BATCH INTELIGENTE** - Nueva funcionalidad completa:
   - Selección múltiple de guardianes del catálogo
   - Agrupación por especialización (fortuna, protección, etc.)
   - Generación masiva con tracking de hooks/sincrodestinos usados
   - NO repite hooks ni sincrodestinos dentro del mismo grupo
   - Revisión con score, aprobación individual o masiva
   - Guardado masivo en WooCommerce

**Acceso:** `/admin/generador-historias` → "🚀 Batch Inteligente"

---

### 2026-01-22 (sesión 3)
**Tarea:** Rehacer Test del Guardián con enfoque de conversión (pendiente)

**Archivos a modificar:**
- `/app/api/test-guardian/route.js` - Preguntas y lógica
- `/app/mi-magia/test-guardian.js` - UI (mantener chat con Tito y música)

---

### 2026-01-22 (sesión 2)
- Creado sistema de memoria persistente (MEMORY.md)
- Agregados hooks específicos para FORTUNA/SUERTE
- Corregida urgencia de recreables: ahora usa escasez real de stock
- Score de Finnegan (fortuna, mini): 30/50 ✅ aprobada
- Historia ahora usa dolor correcto según especialización

### 2026-01-22 (sesión 1)
- Creado sistema completo de especializaciones
- Implementado branding "Los Elegidos" y "Guardianes"
- Corregido bug de recreables diciendo "pieza única"
- Creado prompt de configuración para nuevas sesiones

---

## PARA CONTINUAR TRABAJANDO

1. Leé este archivo primero
2. Si hay algo en "BUGS CONOCIDOS", considerá arreglarlo
3. Si hay algo en "PENDIENTES" del plan, continuá desde ahí
4. Actualizá este archivo cuando tomes decisiones importantes

---

## COMANDOS ÚTILES

```bash
# Iniciar servidor local
npm run dev

# Ver logs de Vercel
vercel logs

# Probar API de historias
curl -X POST http://localhost:3000/api/admin/historias \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","especie":"duende","categoria":"Fortuna","especializacion":"fortuna"}'
```
