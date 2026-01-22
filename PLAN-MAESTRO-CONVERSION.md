# PLAN MAESTRO - SISTEMA DE CONVERSIÓN PSICOLÓGICA

**Creado:** 22 Enero 2026
**Objetivo:** Maximizar conversión usando psicología invisible, no teleshopping

---

## ESTADO ACTUAL - LO QUE YA EXISTE

### Infraestructura Completa
- 204 APIs funcionando
- 119 guardianes en catálogo
- Sistema de canalizaciones con Claude
- Generador de historias (recién mejorado con triggers psicológicos)
- Gamificación (runas, badges, rachas, cofre diario)
- Círculo de suscripción (3 planes)
- Tito (duende IA conversacional)
- Integración WooCommerce bidireccional
- Sistema de referidos
- Ficha de cliente con zodiaco

### Generador de Historias (actualizado hoy)
- Modo batch con filtros por especie/categoría
- Mini-encuesta al regenerar
- Prompt con triggers psicológicos invisibles
- Historia FIJA por guardián (no cambia por persona)

---

## LO QUE FALTA - SISTEMA COMPLETO

### FASE 1: PERFILADO DEL COMPRADOR (Prioridad ALTA)

**Qué es:** Test que parece espiritual pero clasifica al usuario para personalizar TODO lo demás.

**Ubicación:** `/test-guardian` o modal en la home

**Preguntas que clasifican (sin que se den cuenta):**

```
1. "¿Qué sentís cuando alguien te pide ayuda?"
   - Doy todo sin pensar → Alta vulnerabilidad, protección
   - Depende de quién sea → Media, analítico
   - Me cuesta decir que no → Alta, límites
   - Ayudo si puedo → Baja vulnerabilidad

2. "¿Qué te quita el sueño últimamente?"
   - Dinero/trabajo → Abundancia
   - Relaciones/familia → Amor/Sanación
   - Decisiones/futuro → Sabiduría
   - Gente/energías → Protección

3. "Cuando algo te gusta, ¿qué hacés?"
   - Lo compro ya → Impulsivo
   - Lo pienso unos días → Analítico
   - Espero una señal → Emocional/espiritual
   - Consulto con alguien → Social proof needed

4. "¿Cuánto invertiste en tu bienestar este año?"
   (Detecta poder adquisitivo sin preguntar ingresos)
   - Nada, no tengo → Bajo
   - Algo, cuando puedo → Medio
   - Bastante, es prioridad → Alto
   - Todo lo que necesito → Muy alto

5. "¿Qué opinás de la magia/energías?"
   - Creo totalmente → Creyente
   - Algo hay → Buscador
   - No sé, pero me intriga → Escéptico curioso
   - No creo pero... → Escéptico (desafío)
```

**Output del test:** Perfil guardado en Redis
```javascript
{
  email: "usuario@email.com",
  perfil: {
    vulnerabilidad: "alta" | "media" | "baja",
    dolor_principal: "dinero" | "relaciones" | "salud" | "energia",
    estilo_decision: "impulsivo" | "analitico" | "emocional",
    poder_adquisitivo: "bajo" | "medio" | "alto",
    creencia: "creyente" | "buscador" | "esceptico"
  },
  fecha_test: "2026-01-22",
  guardianes_recomendados: ["id1", "id2", "id3"]
}
```

**Archivos a crear:**
- `/app/test-guardian/page.jsx` - UI del test
- `/api/test-guardian/route.js` - Procesar y guardar
- `/lib/perfilado.js` - Lógica de clasificación

---

### FASE 2: MOTOR DE SINCRONICIDAD PERSONALIZADA

**Qué es:** Generar "señales mágicas" usando datos del usuario que parezcan coincidencias.

**Datos a usar:**
- Nombre (cantidad de letras, inicial)
- Fecha de nacimiento (signo, números)
- Día/hora de visita
- Ubicación (si la da)
- Historial de navegación en el sitio

**Ejemplos de sincronicidades generadas:**

```javascript
// Por fecha
if (hoy es martes) {
  "Martes es día de Marte, de acción y coraje.
   Que estés acá hoy no es casualidad."
}

// Por nombre
if (nombreUsuario.length === nombreGuardian.length) {
  "Tu nombre y el de ${guardian} tienen ${n} letras.
   En numerología, eso indica resonancia directa."
}

// Por signo
if (signoUsuario === "escorpio" && categoriaGuardian === "proteccion") {
  "Como Escorpio, tu intuición para detectar energías es potente.
   ${guardian} amplifica ese don."
}

// Por hora
if (hora >= 3 && hora <= 5) {
  "La hora del lobo. Dicen que entre las 3 y las 5
   el velo es más fino. Que estés acá ahora..."
}

// Por comportamiento
if (vioPaginaAntes && volvio) {
  "Volviste. Algo te trajo de nuevo.
   Eso tiene un nombre: reconocimiento."
}
```

**Dónde mostrar:**
- Banner sutil en ficha de producto
- Email de carrito abandonado
- Resultado del test
- Mensaje de Tito

**Archivos a crear:**
- `/lib/sincronicidad.js` - Motor de generación
- `/api/sincronicidad/route.js` - Endpoint
- Componente `<SincronicidadBanner />` para fichas

---

### FASE 3: MENSAJES PERSONALIZADOS (no historias)

**Qué es:** Botón en la ficha del producto que genera un mensaje PERSONAL para ese usuario, basado en su perfil.

**UI:** Botón "¿Qué tiene para decirte?" en cada ficha de guardián

**Flujo:**
1. Usuario ve ficha de Azucena Pixie (historia fija, igual para todos)
2. Click en "¿Qué tiene para decirte?"
3. Sistema genera mensaje usando:
   - Datos del guardián (fijos)
   - Perfil del usuario (del test)
   - Contexto (hora, fecha, comportamiento)
4. Mensaje aparece como si el guardián le hablara directamente

**Ejemplo de mensaje generado:**

```
"María, sé que cargás con mucho. Lo siento en tu energía.
Llegaste acá un martes a las 11 de la noche...
¿otra vez sin poder dormir?

No te voy a prometer que todo se soluciona.
Pero sí que vas a dejar de sentirte sola en esto.

Si estás dudando, es porque una parte tuya ya sabe.
La duda no es miedo. Es el último filtro."
```

**Diferencia con la historia:**
- Historia = fija, pública, la misma para todos
- Mensaje = privado, personalizado, único para ese usuario

**Archivos a crear:**
- `/api/mensaje-personal/route.js` - Genera el mensaje
- Componente `<MensajePersonal />` en ficha
- Prompt específico para mensajes (diferente al de historias)

---

### FASE 4: SECUENCIA DE MICRO-COMPROMISOS

**Qué es:** No pedir la compra directo. Escalar con pequeños "sí".

**Secuencia:**

```
Paso 1: "¿Querés saber qué guardián te corresponde?"
        → Test gratis (Fase 1)
        → Captura email + perfil

Paso 2: "¿Querés que te avise cuando aparezca uno para vos?"
        → Suscripción a alertas
        → Email capturado

Paso 3: "¿Querés ver el mensaje que tiene para vos?"
        → Mensaje personal (Fase 3)
        → Engagement alto

Paso 4: "¿Querés reservarlo antes de que desaparezca?"
        → Seña / Wishlist
        → Compromiso económico pequeño

Paso 5: Compra completa
        → El "sí" grande viene natural
```

**Implementación:**
- Cada paso guarda estado en Redis
- Emails automáticos entre pasos
- Tito puede guiar por cada paso

**Archivos a crear:**
- `/lib/journey.js` - Lógica de secuencia
- `/api/journey/route.js` - Estado del usuario
- Emails para cada transición

---

### FASE 5: ESCASEZ REAL + PERCIBIDA

**Qué es:** Mostrar escasez de forma creíble, no "QUEDAN 3!!!"

**Tipos:**

1. **Escasez real (piezas únicas):**
   ```
   "Pieza única. Cuando se adopte, desaparece para siempre."
   ```

2. **Escasez temporal:**
   ```
   "Última vez que canalizamos uno así: hace 47 días"
   "Este ser eligió nacer ahora. No sabemos cuándo volverá."
   ```

3. **Escasez social (sutil):**
   ```
   "12 personas vieron esto hoy" (real, de analytics)
   "Alguien en Buenos Aires lo está mirando ahora" (si es real)
   ```

4. **Escasez de atención:**
   ```
   "Solo canalizo 3 por mes. Mi energía no da para más."
   ```

**Implementación:**
- Tracker de vistas en tiempo real
- Historial de "última disponibilidad"
- Componente `<EscasezIndicator />` en fichas

**Archivos a crear:**
- `/api/escasez/route.js` - Datos de escasez
- `/lib/escasez.js` - Lógica
- Componente en ficha de producto

---

### FASE 6: EMAILS DE RECUPERACIÓN (Carrito abandonado)

**Secuencia de emails para quien casi compra:**

```
Email 1 (1 hora después):
Asunto: "${nombreGuardian} sigue acá"
"El guardián que miraste sigue disponible. Por ahora."
[Sin CTA agresivo, solo info]

Email 2 (24 horas):
Asunto: "No todos están listos"
"Y está bien. Pero si volvés a pensar en ${guardian}..."
[Link sutil]

Email 3 (72 horas):
Asunto: "Alguien más lo está mirando"
"Solo te aviso. No quiero que después me digas que no sabías."
[Escasez social]

Email 4 (1 semana):
Asunto: "${nombreGuardian} dejó un mensaje"
"Antes de irse, quiso decirte algo..."
[Mensaje personal generado]
```

**Implementación:**
- Webhook de carrito abandonado desde WooCommerce
- Secuencia en Resend o sistema de emails
- Contenido dinámico según perfil

**Archivos a crear:**
- `/api/abandono/route.js` - Procesar abandono
- `/lib/emails/abandono.js` - Templates
- Integración con WooCommerce webhooks

---

### FASE 7: POST-COMPRA (Multiplicador)

**Qué es:** Maximizar valor después de la compra.

**Secuencia post-compra:**

1. **Inmediato: Ritual de activación**
   ```
   "Tu guardián llegó, pero necesita ser activado.
   Seguí estos pasos para que despierte completamente..."
   [Ritual que crea compromiso y justifica la compra]
   ```

2. **Día 3: Diario de señales**
   ```
   "¿Ya notaste algo diferente? Empezá a registrar las señales.
   Los primeros 7 días son los más intensos."
   [Template de diario, crea confirmation bias]
   ```

3. **Día 7: Primera semana**
   ```
   "Una semana juntos. Contanos cómo te sentís."
   [Captura testimonio]
   ```

4. **Día 14: El compañero**
   ```
   "Tu guardián quiere contarte algo...
   Hay otro ser que complementa su energía."
   [Cross-sell con lógica espiritual]
   ```

5. **Día 30: Invitación al Círculo**
   ```
   "Hay un lugar donde los que tenemos guardianes nos encontramos..."
   [Upsell al Círculo]
   ```

**Archivos a crear:**
- `/api/post-compra/route.js` - Secuencia
- `/lib/emails/post-compra.js` - Templates
- Cron jobs para disparar en los días correctos

---

### FASE 8: TESTIMONIOS ESTRATÉGICOS

**Qué es:** Testimonios que responden objeciones específicas.

**Tipos de testimonios a recolectar:**

| Objeción | Testimonio que la responde |
|----------|---------------------------|
| "No creo en esto" | "Yo tampoco creía, hasta que..." |
| "Es caro" | "Junté de a poco, valió cada peso" |
| "Ya tengo uno" | "Tengo 7 y cada uno trabaja diferente" |
| "No sé si es para mí" | "Casi no lo compro. Fue el mejor error que no cometí" |
| "Es solo un muñeco" | "Pensaba lo mismo. Hasta que..." |

**Sistema de recolección:**
- Email día 7 post-compra pidiendo experiencia
- Formulario simple
- Clasificación automática por tipo de objeción

**Dónde mostrar:**
- Ficha de producto (rotativo según perfil del visitante)
- Carrito de compra
- Emails de recuperación

**Archivos a crear:**
- `/api/testimonios/route.js` - CRUD
- `/lib/testimonios.js` - Clasificación
- Componente `<TestimonioRotativo />` para fichas

---

### FASE 9: ANALYTICS DE CONVERSIÓN

**Qué es:** Dashboard para entender qué funciona.

**Métricas a trackear:**

```
Por historia:
- Vistas
- Tiempo en página
- Clicks en "mensaje personal"
- Conversiones
- Tasa de conversión

Por perfil:
- Qué perfil convierte más
- Qué categoría prefiere cada perfil
- Tiempo promedio de decisión

Por trigger:
- Qué sincronicidades funcionan
- Qué emails abren más
- Qué testimonios convierten

Por abandono:
- Dónde abandonan
- Qué email los recupera
- Tasa de recuperación
```

**Dashboard:** `/admin/analytics-conversion`

**Archivos a crear:**
- `/api/analytics/conversion/route.js` - Datos
- `/app/admin/analytics-conversion/page.jsx` - Dashboard
- Tracking events en cada punto clave

---

## ORDEN DE IMPLEMENTACIÓN

| Fase | Impacto | Esfuerzo | Prioridad |
|------|---------|----------|-----------|
| 1. Perfilado | ALTO | Medio | 1 |
| 3. Mensaje personal | ALTO | Bajo | 2 |
| 2. Sincronicidad | ALTO | Medio | 3 |
| 6. Emails abandono | ALTO | Medio | 4 |
| 5. Escasez | MEDIO | Bajo | 5 |
| 7. Post-compra | MEDIO | Medio | 6 |
| 4. Micro-compromisos | MEDIO | Alto | 7 |
| 8. Testimonios | MEDIO | Bajo | 8 |
| 9. Analytics | BAJO | Alto | 9 |

---

## PRÓXIMOS PASOS INMEDIATOS

1. **Implementar Fase 1 (Perfilado)** - El test que clasifica
2. **Implementar Fase 3 (Mensaje personal)** - Botón en fichas
3. **Implementar Fase 2 (Sincronicidad)** - Banners mágicos

Con estas 3 fases, el sistema ya tiene:
- Clasificación de compradores
- Personalización sin cambiar historias
- "Magia" que parece real

---

## REGLAS DE ORO

1. **La historia del guardián es FIJA** - Todos ven la misma
2. **La personalización es PRIVADA** - Mensajes, emails, sincronicidades
3. **Nunca parecer vendedor** - Todo es sutil, emocional, íntimo
4. **Escasez real > escasez falsa** - Mejor menos pero creíble
5. **El usuario se vende solo** - Nosotros solo guiamos

---

*Este documento es el plan maestro. Actualizar cada vez que se complete una fase.*
