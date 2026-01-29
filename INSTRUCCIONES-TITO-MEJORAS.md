# INSTRUCCIONES PARA MEJORAR TITO - EJECUTAR AUTÓNOMO

**Fecha:** 29 enero 2026
**Objetivo:** Mejorar el chatbot Tito para que sea perfecto, sin errores, experto en neuroventas

---

## CONTEXTO DEL PROYECTO

Duendes del Uruguay es un e-commerce de guardianes canalizados (figuras artesanales únicas).
- **WordPress:** duendesdeluruguay.com (tienda)
- **Vercel:** duendes-vercel.vercel.app (APIs, Mi Magia)
- **Tito:** Chatbot de ventas con Claude + GPT híbrido

---

## ARCHIVOS CLAVE DE TITO

```
/app/api/tito/v3/route.js          ← Sistema principal Claude
/app/api/tito/gpt/route.js         ← Modelo híbrido (GPT + Claude)
/lib/tito/tools.js                 ← 18 herramientas disponibles
/lib/tito/tool-executor.js         ← Ejecutor de tools
/lib/tito/conocimiento.js          ← Base de datos productos
/lib/tito/personalidad.js          ← Prompt system (856 líneas)
/lib/tito/objeciones.js            ← Manejo de objeciones
/lib/tito/persuasion.js            ← Técnicas de venta
/wordpress-plugins/duendes-tito-widget.php  ← Widget WordPress
```

---

## QUÉ HAY QUE MEJORAR

### 1. ACTUALIZAR INFO COMPLETA
Tito debe conocer TODO sobre la tienda:

**Precios actuales (verificar en WooCommerce):**
- Mini clásicos: $70 USD / $2.500 UYU
- Mini especiales/Pixies: $150 USD / $5.500 UYU
- Medianos: $200 USD / $8.000 UYU
- Grandes: $450 USD / $16.500 UYU
- Gigantes: $1.050 USD / $39.800 UYU

**Envíos:**
- Uruguay (DAC): 3-7 días hábiles, gratis en compras +$10.000 UYU
- Internacional (DHL Express): 5-10 días, gratis en compras +$1.000 USD
- Todos los guardianes van protegidos con embalaje especial

**Métodos de pago:**
- Plexo (transferencia bancaria) - Uruguay y exterior
- Mercado Pago - DESACTIVADO por ahora

**Promociones:**
- 3x2: Por cada 2 guardianes, 1 mini gratis
- Seña 30%: Reservar cualquier guardián

### 2. MEJORAR RESPUESTAS RÁPIDAS
Archivo: `/app/api/tito/gpt/route.js`

Agregar más casos de FAQ sin usar IA:
- Tiempos de entrega exactos
- Cómo es el embalaje
- Garantía/devoluciones
- Cómo funciona la canalización
- Qué incluye la compra (guardián + certificado + canalización)
- Diferencia entre tamaños
- Cómo elegir el guardián correcto

### 3. ESCALADO INTELIGENTE
Archivo: `/lib/tito/tools.js` y `/app/api/tito/v3/route.js`

Reglas de escalado:
- NO escalar a la primera
- Intentar resolver 2-3 veces antes de escalar
- Escalar SOLO si:
  - Problema con pedido específico (tracking, daño, etc.)
  - Cliente explícitamente pide hablar con persona
  - Queja seria
  - Venta grande (+$500 USD)
  - Pregunta muy específica que no puede responder

Respuesta de escalado debe ser cálida, no robótica.

### 4. DETECCIÓN DE CURIOSOS vs COMPRADORES
Mejorar en `/lib/tito/personalidad.js`:

**Señales de comprador:**
- Pregunta por precio específico
- Pregunta por envío a su país
- Pregunta por métodos de pago
- Menciona que quiere regalar
- Ya eligió un guardián específico

**Señales de curioso/pichi:**
- Solo hace preguntas genéricas
- Cuenta su vida sin preguntar nada
- No responde a ofertas de productos
- Mensajes muy largos de desahogo
- Solo dice "amén", "bendiciones", etc.

**Comportamiento:**
- Comprador: dedicar tiempo, persuadir, cerrar venta
- Curioso: responder breve, ofrecer test, no gastar tokens

### 5. BURBUJAS MEJORADAS
Archivo: `/wordpress-plugins/duendes-tito-widget.php`

Verificar que las burbujas:
- No se repitan en 24h
- Sean contextuales a la página
- No aparezcan en checkout (NUNCA interrumpir pago)
- Tengan copy que genere curiosidad

### 6. INFO DE MI MAGIA
Tito debe saber explicar:
- Mi Magia es el portal exclusivo post-compra
- Incluye: canalización del guardián, lecturas de runas, contenido exclusivo
- Se accede en: magia.duendesdeluruguay.com
- Requiere haber comprado un guardián

### 7. EL CÍRCULO (pausado)
Actualmente en construcción. Si preguntan:
- "El Círculo está siendo preparado con algo especial"
- "Podés dejar tu email para ser de los primeros"
- Link: magia.duendesdeluruguay.com/circulo

---

## CÓMO TESTEAR

1. Ir a https://duendesdeluruguay.com
2. Abrir el chat de Tito (esquina inferior derecha)
3. Probar:
   - "Hola" → Debe responder cálido
   - "Cuánto sale un mini?" → Precio exacto
   - "Hacen envíos a México?" → Info de DHL
   - "Es caro" → Manejo de objeción
   - "Quiero hablar con alguien" → Escalado elegante
   - Solo emojis → Respuesta breve, no gastar tokens

---

## REGLAS DE ORO DE TITO

1. **Nunca sonar a robot** - Habla como vendedor experto de 856 años
2. **Nunca presionar agresivamente** - Persuadir con elegancia
3. **Nunca mentir sobre stock** - Verificar en tiempo real
4. **Nunca inventar precios** - Usar datos reales
5. **Nunca interrumpir en checkout** - Sagrado
6. **Siempre ofrecer el Test del Guardián** - Es el mejor conversor
7. **Siempre mencionar que son ÚNICOS** - No hay dos iguales
8. **Siempre detectar el país** - Para dar precios correctos

---

## ARCHIVOS A MODIFICAR

1. `/lib/tito/personalidad.js` - Actualizar prompt con info nueva
2. `/app/api/tito/gpt/route.js` - Agregar respuestas rápidas
3. `/lib/tito/conocimiento.js` - Verificar datos de productos
4. `/wordpress-plugins/duendes-tito-widget.php` - Revisar burbujas

---

## DEPLOY

Después de hacer cambios:
```bash
cd /Users/usuario/Desktop/duendes-vercel
git add -A
git commit -m "fix(tito): mejoras completas - info actualizada, escalado inteligente, detección de curiosos"
git push
```

El deploy es automático en Vercel.

Para WordPress (widget):
```bash
# Subir via SFTP
Host: 34.70.139.72
Puerto: 55309
Usuario: sftp_live_WfP6i
Password: JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR
Ruta: web/wp-live/wp-content/mu-plugins/
```

---

## DOCUMENTACIÓN DE REFERENCIA

- `/CLAUDE.md` - Biblia de escritura y tono
- `/TITO-ROADMAP.md` - Estado de fases implementadas
- `/TITO-HIBRIDO.md` - Explicación del modelo híbrido
- `/PRECIOS-OFICIALES.md` - Precios actualizados

---

## RESULTADO ESPERADO

Tito debe:
1. ✅ Responder SIN errores de información
2. ✅ Conocer TODOS los precios, envíos, políticas
3. ✅ Detectar curiosos y no gastar tokens en ellos
4. ✅ Escalar inteligentemente (no a la primera)
5. ✅ Usar técnicas de neuroventas
6. ✅ Tener burbujas efectivas
7. ✅ Estar listo para producción

---

*Creado: 29 enero 2026 02:40hs*
