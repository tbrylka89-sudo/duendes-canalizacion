# CAMBIOS TITO - 29 Enero 2026

## Resumen Ejecutivo
Mejoras completas al chatbot Tito para optimizar ventas, reducir consumo de tokens y mejorar la experiencia del usuario.

---

## 1. CONOCIMIENTO.JS - Información Actualizada

### Cambios realizados:
- **Tiempo de envío Uruguay**: Corregido de "5-7 días" a "3-7 días hábiles"
- **Métodos de pago**:
  - Agregado Plexo (transferencia bancaria para Uruguay y exterior)
  - Mercado Pago marcado como DESACTIVADO temporalmente
- **Mi Magia**:
  - URL actualizada a `magia.duendesdeluruguay.com`
  - Descripción mejorada como "portal exclusivo post-compra"
- **El Círculo**: Nueva sección agregada
  - Estado: pausado/en construcción
  - URL para dejar email: `magia.duendesdeluruguay.com/circulo`
  - Mensaje tipo para Tito cuando pregunten

---

## 2. GPT/ROUTE.JS - Respuestas Rápidas Sin IA

### Nuevos casos de FAQ (sin consumir tokens):
1. **Embalaje**: Protección individual, caja resistente, relleno contra golpes
2. **Garantía/Devoluciones**: NO devoluciones (piezas únicas), solo daño en envío
3. **Qué incluye la compra**: Guardián + certificado + canalización + Mi Magia + packaging
4. **Diferencia de tamaños**: Mini ($70) hasta Gigante ($1050) con explicación
5. **Cómo elegir guardián**: "El guardián te elige a vos" + oferta de Test
6. **Materiales**: Porcelana fría, cristales naturales, ropa cosida a mano
7. **Tiempo de envío detallado**: Uruguay 3-7 días, Internacional 5-10 días
8. **Promo 3x2**: Explicación clara de la promoción
9. **El Círculo**: Respuesta sobre membresía en construcción
10. **Mi Magia**: Explicación completa del portal post-compra

---

## 3. PERSONALIDAD.JS - Mejoras de Comportamiento

### Escalado Inteligente
Nuevas reglas claras:
- **NO escalar**: Consultas de pedido normales, preguntas de productos, objeciones de precio
- **SÍ escalar**:
  - Problema REAL con pedido (perdido, dañado, error)
  - Cliente EXPLÍCITAMENTE pide hablar con persona
  - Queja seria o cliente muy enojado
  - Venta grande (+$500 USD)
  - Preguntas muy específicas (facturación, aduanas)

### Detección de Curiosos vs Compradores

**Señales de COMPRADOR** (dedicar tiempo):
- Pregunta precio específico
- Pregunta envío a SU país
- Menciona que quiere regalar
- Ya eligió un guardián
- Pregunta "¿cómo compro?"

**Señales de CURIOSO** (responder breve):
- Solo preguntas genéricas
- Cuenta su vida sin preguntar nada
- No responde a ofertas de productos
- Mensajes largos de desahogo
- "Amén", "bendiciones", emojis

### Info Mi Magia y El Círculo
Agregada información completa sobre:
- Mi Magia: portal exclusivo, URL, contenido, cómo acceder
- El Círculo: pausado, no ofrecer, solo informar

---

## 4. WIDGET WORDPRESS - Burbujas Mejoradas

### Mejoras realizadas:
- **Copys más efectivos** con técnicas de neuroventas
- **Escasez real**: "Este guardián es único, cuando se va desaparece para siempre"
- **Curiosidad**: "El guardián te elige a vos, no al revés"
- **Test del Guardián**: Promovido en burbujas de tienda

### Configuración verificada:
- ✅ No repetir en 24h (localStorage con expiración)
- ✅ Contextuales a la página (producto, tienda, carrito, general)
- ✅ NO aparecen en checkout (array vacío)
- ✅ NO aparecen si ya interactuó con Tito

---

## 5. REGLAS DE ORO IMPLEMENTADAS

1. ✅ Nunca sonar a robot - Tono cálido y humano
2. ✅ Nunca presionar agresivamente - Persuasión elegante
3. ✅ Nunca mentir sobre stock - Verificar en tiempo real
4. ✅ Nunca inventar precios - Usar datos reales
5. ✅ Nunca interrumpir en checkout - Sin burbujas
6. ✅ Siempre ofrecer el Test del Guardián - Mejor conversor
7. ✅ Siempre mencionar que son ÚNICOS - Escasez real
8. ✅ Siempre detectar el país - Para precios correctos

---

## Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `lib/tito/conocimiento.js` | Envíos, pagos, Mi Magia, El Círculo |
| `app/api/tito/gpt/route.js` | +10 respuestas rápidas sin IA |
| `lib/tito/personalidad.js` | Escalado inteligente, detección curiosos |
| `wordpress-plugins/duendes-tito-widget.php` | Burbujas mejoradas |

---

## Deploy

- **Vercel**: Automático con git push
- **WordPress**: Subir widget via SFTP a mu-plugins

---

*Implementado: 29 enero 2026*
*Por: Claude (autónomo)*
