# PENDIENTES ANTES DE LANZAR WEB
## Duendes del Uruguay - Auditoría 25 Enero 2026

---

## 🔴 CRÍTICOS (Arreglar sí o sí)

### 1. Link de Términos y Condiciones roto
- **Problema:** El footer apunta a `/terminos-y-condiciones/` que da 404
- **Solución:** La página existe en `/terminos/` - corregir el link en el plugin `duendes-header-footer-garantizado.php`
- **Tiempo estimado:** 5 minutos

### 2. Emails con "www" extra
- **Problema:** En Contacto y Política de Privacidad aparece `info@www.duendesdeluruguay.com`
- **Solución:** Corregir a `info@duendesdeluruguay.com` en Elementor
- **Ubicaciones:** `/contacto/`, `/politica-de-privacidad/`

### 3. Categoría Sabiduría da 404
- **Problema:** `/product-category/sabiduria/` no funciona
- **Solución:** Verificar slug en WooCommerce > Productos > Categorías

### 4. Shortcode del Círculo no renderiza
- **Problema:** `/circulo-de-duendes/` muestra `[circulo_pagina_completa]` como texto
- **Solución:** Verificar que el plugin que define ese shortcode esté activo

---

## 🟡 IMPORTANTES (Recomendado antes de lanzar)

### 5. Agregar Mercado Pago
- **Estado:** Configurado, falta activarlo en checkout
- **Impacto:** Clientes uruguayos y latinoamericanos prefieren MP

### 6. Mi Magia sin link en navegación
- **Problema:** Los usuarios no saben que existe `/mi-magia/`
- **Solución:** Agregar link en menú o en Mi Cuenta

### 7. Subpáginas de Mi Magia no existen
- **URLs que dan 404:**
  - `/mi-magia/mi-duende/`
  - `/mi-magia/lecturas/`
  - `/mi-magia/runas/`
  - `/mi-magia/estudios/`
  - `/mi-magia/certificado/`
- **Decisión:** ¿Crearlas o eliminar referencias?

---

## 🟢 OPCIONALES (Pueden esperar post-lanzamiento)

### 8. Página de Gift Cards / Regalos
- No existe, oportunidad de negocio para fechas especiales

### 9. Explicar sistema de Runas
- Los usuarios no saben para qué sirven ni qué pueden canjear

### 10. Preview de contenido del Círculo
- No hay ejemplos de lo que incluye la membresía

### 11. FAQ sobre el Círculo
- Las preguntas frecuentes no cubren la membresía

### 12. Testimonios de miembros del Círculo
- Solo hay reviews de productos físicos

---

## ✅ FUNCIONANDO CORRECTAMENTE

| Página | Estado |
|--------|--------|
| Homepage | ✅ |
| Tienda (54 productos) | ✅ |
| Test del Guardián | ✅ |
| Cómo Funciona | ✅ |
| FAQ (50+ preguntas) | ✅ |
| Contacto | ✅ |
| Nosotros | ✅ |
| Testimonios (150+) | ✅ |
| Mi Cuenta | ✅ |
| Carrito | ✅ |
| Checkout | ✅ |
| Productos individuales | ✅ |
| Política de Privacidad | ✅ |
| Términos (en /terminos/) | ✅ |
| Header fijo | ✅ |
| Footer negro minimalista | ✅ |
| Tito chat widget | ✅ |
| Multi-moneda | ✅ |
| Plexo/Handy pagos | ✅ |

---

## RESUMEN

| Prioridad | Cantidad | Estado |
|-----------|----------|--------|
| 🔴 Críticos | 4 | Pendientes |
| 🟡 Importantes | 3 | Pendientes |
| 🟢 Opcionales | 5 | Pueden esperar |
| ✅ Funcionando | 20+ | OK |

**Calificación actual: ~85% lista para lanzar**

**Con los 4 críticos resueltos: ~95% lista**

---

## CHECKLIST RÁPIDO

- [ ] Corregir link `/terminos-y-condiciones/` → `/terminos/`
- [ ] Corregir email `info@www.duendesdeluruguay.com`
- [ ] Verificar categoría Sabiduría
- [ ] Verificar shortcode `[circulo_pagina_completa]`
- [ ] Activar Mercado Pago en checkout
- [ ] Agregar link a Mi Magia

---

*Generado automáticamente - Auditoría web en vivo*
