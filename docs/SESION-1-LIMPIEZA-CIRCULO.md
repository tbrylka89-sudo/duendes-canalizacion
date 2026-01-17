# SESIÓN 1: LIMPIEZA + CÍRCULO DE DUENDES
## Tiempo estimado: 1 hora
## Objetivo: Dejar la base limpia y el Círculo funcional con trial

---

## PASO 1: AUDITORÍA COMPLETA DEL PROYECTO

### Instrucciones para Claude Code:

```
Necesito una auditoría COMPLETA del proyecto. Haz esto:

1. Lista TODOS los archivos en /app con su propósito
2. Identifica:
   - Archivos duplicados o redundantes
   - Código muerto (funciones que no se usan)
   - Imports rotos
   - Componentes que hacen lo mismo
3. Revisa /api y lista todos los endpoints
4. Revisa /components y lista todos los componentes
5. NO TOQUES NADA de Tito (/api/tito, componentes de chat, etc.) - solo reporta su estado

Dame un reporte estructurado así:
- ARCHIVOS OK: (lista)
- ARCHIVOS A BORRAR: (lista con razón)
- ARCHIVOS A FUSIONAR: (lista)
- IMPORTS ROTOS: (lista)
- ESTADO DE TITO: (funciona/no funciona/qué necesita)
```

---

## PASO 2: EJECUTAR LIMPIEZA

### Instrucciones para Claude Code:

```
Basándote en la auditoría, ejecuta la limpieza:

1. BORRA los archivos redundantes que identificaste (excepto todo lo de Tito)
2. ARREGLA los imports rotos
3. FUSIONA componentes duplicados
4. Asegúrate de no romper nada - verifica que el proyecto compile después de cada cambio

Después de cada acción, dime qué hiciste. Al final haz:
npm run build

Y confirma que no hay errores.
```

---

## PASO 3: ACTUALIZAR PRECIOS DEL CÍRCULO

### Instrucciones para Claude Code:

```
Busca TODOS los lugares donde aparecen precios del Círculo de Duendes y actualízalos:

PRECIOS CORRECTOS:
- Plan Semestral: $3.600 UYU (6 meses de magia)
- Plan Anual: $5.900 UYU (12 meses de magia)
  - Badge: "MEJOR VALOR"
  - Texto: "Ahorrás 25%"

Busca en:
1. /app/mi-magia/page.jsx (sección del Círculo)
2. /app/circulo/ si existe
3. Cualquier constante CIRCULO_PLANES o similar
4. Cualquier archivo de configuración de precios
5. La página principal de WordPress si hay precios hardcodeados

USA estos comandos para encontrar todo:
grep -rn "3600\|3.600\|2000\|2.000\|5900\|5.900\|3200\|3.200" /app
grep -rn "precio\|price\|UYU\|USD" /app
grep -rn "semestral\|anual\|mensual" /app

Muéstrame TODOS los lugares donde encontraste precios y actualízalos UNO POR UNO confirmando cada cambio.
```

---

## PASO 4: AGREGAR TRIAL 15 DÍAS GRATIS

### Instrucciones para Claude Code:

```
Agrega el sistema de PRUEBA GRATUITA de 15 días al Círculo:

1. En la página del Círculo, agrega un botón prominente:
   - Texto: "✨ Prueba 15 días GRATIS"
   - Subtexto: "Sin tarjeta de crédito · Acceso completo"
   - Color: Dorado (#d4af37) con fondo negro
   - Posición: ARRIBA de los planes de pago, muy visible

2. Crea la lógica del trial:
   - Cuando alguien hace clic → se registra/logea
   - Se le asigna: circulo_trial = true, trial_end_date = hoy + 15 días
   - Tiene acceso completo al Círculo durante esos 15 días
   - Después de 15 días → se muestra mensaje invitando a suscribirse

3. En la base de datos (Vercel KV), guarda:
   {
     visitorId: "xxx",
     circulo_trial: true,
     trial_start_date: "2026-01-16",
     trial_end_date: "2026-01-31",
     trial_converted: false
   }

4. Crea un componente TrialBanner que muestre:
   - "Te quedan X días de prueba gratuita"
   - Botón "Suscribirme ahora" (con 10% descuento por convertir desde trial)

ESTÉTICA:
- Fuentes: Cinzel (títulos), Cormorant Garamond (cuerpo)
- Colores: Negro #0a0a0a, Dorado #d4af37, Crema #FDF8F0
- Estilo: Premium, elegante, mágico
```

---

## PASO 5: TOUR INTERACTIVO DE MI MAGIA

### Instrucciones para Claude Code:

```
Crea un tour interactivo de bienvenida para Mi Magia:

CUÁNDO SE MUESTRA:
- Primera vez que el usuario entra a Mi Magia
- O cuando hace clic en "Ver tour" en el menú

PASOS DEL TOUR (modal/overlay elegante):

PASO 1: "Bienvenido/a a tu Santuario Mágico"
- "Este es Mi Magia, tu espacio personal donde la conexión con tu guardián cobra vida."
- Imagen: bosque encantado con luz dorada

PASO 2: "Tus Guardianes"
- "Aquí encontrarás a todos los guardianes que te han elegido."
- "Cada uno tiene su canalización única, su guía de cuidados y mensajes especiales para ti."
- Highlight: sección de guardianes

PASO 3: "Tus Runas de Poder"
- "Las runas son tu moneda mágica. Úsalas para adquirir estudios del alma, lecturas y más."
- "Recibes runas con cada compra y puedes adquirir más cuando lo necesites."
- Highlight: contador de runas

PASO 4: "Tus Tréboles de la Suerte"
- "Los tréboles son puntos de lealtad. Ganas 1 trébol por cada $10 de compra."
- "Acumúlalos y canjéalos por descuentos exclusivos."
- Highlight: contador de tréboles

PASO 5: "El Círculo de Duendes"
- "¿Quieres ir más profundo? El Círculo es nuestra comunidad secreta."
- "Contenido diario, rituales, meditaciones, y la guía de un duende diferente cada semana."
- Botón: "Conocer el Círculo" / "Ya soy miembro"

PASO 6: "Tito, tu Guía"
- "¿Tienes dudas? Tito está aquí para ayudarte. Es nuestro duende asistente."
- "Pregúntale lo que necesites."
- Highlight: botón de Tito

FINAL: "¡Tu aventura comienza!"
- Botón: "Explorar Mi Magia"

TÉCNICO:
- Guarda en localStorage: tour_mi_magia_completed = true
- Componente: /components/TourMiMagia.jsx
- Usar librería como react-joyride o crear custom con Framer Motion
- Estética premium con las fuentes y colores de la marca
```

---

## PASO 6: TOUR INTERACTIVO DEL CÍRCULO

### Instrucciones para Claude Code:

```
Crea un tour interactivo para el Círculo de Duendes:

CUÁNDO SE MUESTRA:
- Primera vez que entra al Círculo (trial o suscriptor)
- O cuando hace clic en "Ver tour"

PASOS DEL TOUR:

PASO 1: "Bienvenido/a al Círculo de Duendes"
- "Has entrado al santuario secreto. Aquí la magia fluye cada día."
- Imagen: círculo de duendes en el bosque

PASO 2: "El Duende de la Semana"
- "Cada semana, un duende diferente toma el poder y guía nuestra comunidad."
- "Todo el contenido de la semana viene desde su mirada y sabiduría única."
- "Si ese duende es adoptado... desaparece, pero su sabiduría permanece."

PASO 3: "Contenido Diario"
- "Cada día recibes algo especial:"
- "🌅 Lunes: Mensaje de bienvenida del duende"
- "🧘 Martes: Meditación guiada"
- "🛠️ Miércoles: DIY mágico"
- "📖 Jueves: Historia con enseñanza"
- "🔮 Viernes: Ritual de la semana"
- "💫 Sábado: Reflexión y sabiduría"
- "🌙 Domingo: Preparación para la nueva semana"

PASO 4: "Las Estaciones del Alma"
- "Seguimos el calendario celta con 4 grandes celebraciones:"
- "🍂 Samhain (Oct-Nov): Honrar ancestros"
- "❄️ Imbolc (Feb): Renovación"
- "🌸 Beltane (May): Celebración"
- "🌾 Lughnasadh (Ago): Gratitud"

PASO 5: "Guía Lunar"
- "Cada mes recibes la guía lunar completa."
- "Rituales, intenciones y prácticas alineadas con la luna."

PASO 6: "La Comunidad"
- "Conecta con otros buscadores en nuestro foro privado."
- "Comparte experiencias, pregunta, sugiere temas."

PASO 7: "Tus Regalos"
- "Como miembro del Círculo tienes:"
- "🎁 100 Runas de Poder de bienvenida"
- "💎 5-10% de descuento en guardianes"
- "📚 Estudios exclusivos según tu plan"

FINAL: "La magia te espera"
- Botón: "Comenzar mi viaje"

TÉCNICO:
- Guarda: tour_circulo_completed = true
- Componente: /components/TourCirculo.jsx
- Misma estética premium
```

---

## PASO 7: VERIFICACIÓN FINAL SESIÓN 1

### Instrucciones para Claude Code:

```
Verificación final de la Sesión 1:

1. Ejecuta: npm run build
   - Debe compilar sin errores

2. Ejecuta: npm run dev
   - Abre localhost:3000

3. Verifica manualmente:
   - [ ] Página de Mi Magia carga correctamente
   - [ ] Tour de Mi Magia aparece la primera vez
   - [ ] Sección del Círculo muestra precios correctos ($3.600 / $5.900)
   - [ ] Botón de Trial 15 días es visible y prominente
   - [ ] Tito sigue funcionando (NO debe estar roto)
   - [ ] No hay errores en consola

4. Dame un REPORTE FINAL:
   - Archivos modificados
   - Archivos eliminados
   - Nuevos componentes creados
   - Problemas encontrados (si hay)
   - Screenshots o confirmación de que funciona

¿Todo listo para la Sesión 2?
```

---

## RESUMEN SESIÓN 1

| Paso | Tarea | Tiempo estimado |
|------|-------|-----------------|
| 1 | Auditoría completa | 10 min |
| 2 | Limpieza de código | 15 min |
| 3 | Actualizar precios | 10 min |
| 4 | Trial 15 días | 15 min |
| 5 | Tour Mi Magia | 15 min |
| 6 | Tour Círculo | 15 min |
| 7 | Verificación | 10 min |

**Total: ~1 hora 30 min**

---

## DESPUÉS DE COMPLETAR SESIÓN 1:
Continúa con SESION-2-ADMIN.md
