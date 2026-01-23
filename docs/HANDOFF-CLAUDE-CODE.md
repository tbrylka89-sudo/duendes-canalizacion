# HANDOFF COMPLETO - DUENDES DEL URUGUAY
## Fecha: 14 Enero 2026

---

## 1. CONTEXTO DEL PROYECTO

**Qué es**: E-commerce de "guardianes canalizados" - figuras artesanales únicas con experiencias digitales.

**Público**: Mujeres 35-65, sanadoras heridas, buscadoras de protección/amor/cambio.

**Tono**: Español rioplatense (voseo), místico, emocional, "el guardián te elige".

---

## 2. PLATAFORMAS Y ACCESOS

### WordPress (10Web)
- **URL Staging**: https://duendesuy.10web.cloud/
- **URL Producción**: https://duendesdeluruguay.com/
- **Tienda**: https://duendesuy.10web.cloud/shop/
- **Test del Guardián**: https://duendesuy.10web.cloud/descubri-que-duende-te-elige/

### SFTP (MU-Plugins)
```
Host: 34.70.139.72
Puerto: 55309
Usuario: sftp_live_WfP6i
Password: JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR
Ruta: web/wp-live/wp-content/mu-plugins/
```

### Vercel (Mi Magia + APIs)
- **URL**: https://duendes-vercel.vercel.app/
- **Mi Magia**: https://duendes-vercel.vercel.app/mi-magia?token=TEST123
- **Repo Git**: https://github.com/tbrylka89-sudo/duendes-canalizacion.git

### API Keys
```
DUENDES_REMOTE_SECRET: duendes_vercel_2026_secretkey_XkJ9mN2pL5qR8sT1
INSIGHTS_API_KEY: duendes-insights-2024
```

---

## 3. ARCHIVOS CRÍTICOS EN WORDPRESS (mu-plugins)

| Archivo | Función |
|---------|---------|
| `test-guardian-v3.php` | Test del Guardián v8 (azul neón) |
| `duendes-neuromarketing.php` | CSS/JS neuromarketing + intro cinematográfica |
| `duendes-fixes-master.php` | Fixes generales, traducciones, redirects |
| `duendes-experiencia-magica.php` | Template producto físico |
| `duendes-remote-control.php` | API REST para control remoto |
| `duendes-mi-magia.php` | Shortcodes Mi Magia |

---

## 4. ESTADO ACTUAL DEL TEST DEL GUARDIÁN

### Lo que SE HIZO:
1. **Test Guardian v8** subido a WordPress con:
   - Estética azul neón (#00a8ff) - NO oro
   - Fondo negro (#050508)
   - Flujo: Identidad → 7 Preguntas → Contacto → Resultado
   - Final con grilla 2 columnas (revelación + guardián)
   - Burbujas místicas con animación stagger
   - Newsletter con feedback (loading/success/error)

2. **APIs en Vercel** (ya desplegadas):
   - `POST /api/newsletter/subscribe` - Guarda suscripción en KV
   - `POST /api/test-guardian/save` - Guarda datos del test
   - `GET /api/test-guardian/insights?key=duendes-insights-2024` - Estadísticas

### LO QUE ESTÁ MAL (PROBLEMA ACTUAL):

**EL TEST NO SE VE EN EL BROWSER** aunque el HTML sí se genera.

**Causa identificada**: CSS en `duendes-neuromarketing.php` que oculta shortcodes:
```css
.elementor-shortcode:empty {
    display: none !important;
}
```

**Se intentó arreglar** agregando excepción para `#tg-portal` pero el caché del CDN de 10Web sigue sirviendo CSS viejo.

### Para verificar si funciona:
```bash
# Ver si HTML se genera (debería mostrar "tg-portal"):
curl -s "https://duendesuy.10web.cloud/descubri-que-duende-te-elige/?v=$(date +%s)" | grep -o 'tg-portal'

# Limpiar caché WordPress:
curl -X POST "https://duendesuy.10web.cloud/wp-json/duendes/v1/cache" -H "X-Duendes-Secret: duendes_vercel_2026_secretkey_XkJ9mN2pL5qR8sT1"
```

---

## 5. ESTÉTICA OBLIGATORIA (NO NEGOCIABLE)

```
✅ Fondo: Negro profundo (#050508 o #0a0a0a)
✅ Texto: Blanco suave (#ffffff, #e0e0e0)
✅ Glow/borde: AZUL NEÓN (#00a8ff) - color de categoría Protección
✅ Botones: fondo negro/transparente + borde azul + texto blanco
✅ Opciones: burbujas que suben desde abajo (stagger animation)

❌ PROHIBIDO: botones verdes
❌ PROHIBIDO: oro/dorado como color principal
❌ PROHIBIDO: colores pastel o gradientes colorinches
```

---

## 6. FLUJO CORRECTO DEL TEST

### Paso 1: IDENTIDAD (al inicio)
- Nombre (obligatorio)
- Fecha nacimiento (obligatorio)
- Sexo (opcional)
- Nacionalidad (obligatorio)
- País residencia (obligatorio)
- Ciudad (opcional)
- Copy: "Esto no es un formulario. Es la llave del portal."

### Paso 2: PREGUNTAS (7 total)
1. Momento actual (select)
2. Dónde lo sentís en el cuerpo (select)
3. Qué te duele HOY (texto libre)
4. Pedido al universo (texto libre)
5. Patrones que se repiten (select)
6. Recuerdo de infancia (texto libre)
7. Cómo preferís recibir la magia (select)

### Paso 3: CONTACTO (antes del resultado)
- Email (obligatorio)
- WhatsApp con prefijo automático según país
- Copy: "Te va a llegar tu tarjeta del guardián + frase sellada"

### Paso 4: RESULTADO (layout premium)
- Header: "{Nombre}, tu guardián te encontró"
- Grilla 2 columnas:
  - IZQ: Card revelación + por qué este guardián
  - DER: Foto guardián + CTA + ritual
- Sección: "También resuenan con vos" (3 cards)
- Altar final: frase sellada + botones DESCARGAR/COPIAR
- Newsletter con feedback

---

## 7. APIs EN VERCEL

### Newsletter Subscribe
```
POST https://duendes-vercel.vercel.app/api/newsletter/subscribe
Body: { "email": "x@x.com", "source": "test-guardian" }
Response: { "success": true, "message": "Señal recibida" }
```

### Test Guardian Save
```
POST https://duendes-vercel.vercel.app/api/test-guardian/save
Body: { "identity": {...}, "answers": {...}, "contact": {...} }
Response: { "success": true, "visitor_id": "tg:xxx" }
```

### Test Guardian Insights
```
GET https://duendes-vercel.vercel.app/api/test-guardian/insights?key=duendes-insights-2024
Response: { "success": true, "insights": { ... } }
```

### Cache Clear (WordPress)
```
POST https://duendesuy.10web.cloud/wp-json/duendes/v1/cache
Header: X-Duendes-Secret: duendes_vercel_2026_secretkey_XkJ9mN2pL5qR8sT1
```

---

## 8. PROBLEMAS CONOCIDOS

### A) Test no se ve aunque HTML existe
- El HTML se genera (verificado con curl)
- Algún CSS lo oculta
- El caché del CDN de 10Web es muy persistente
- **Solución posible**: Purgar caché desde panel 10Web o esperar

### B) Caché de 10Web
- El object-cache se limpia con la API
- Pero el CDN tiene su propio caché que no se limpia fácil
- Probar con `?v=timestamp` para bypass

### C) Tienda usa /shop/ no /tienda/
- La página real tiene slug "shop"
- Se configuró redirect /tienda/ → /shop/
- Esto funciona correctamente

---

## 9. TAREAS PENDIENTES (PRIORIDAD)

### URGENTE:
1. **Arreglar visualización del test** - El HTML se genera pero no se ve
2. **Purgar caché CDN de 10Web** - Desde el panel de 10Web

### SIGUIENTE:
3. Tarjeta descargable (PNG/PDF) con nombre + frase + guardián
4. Guardar memoria por persona (visitas futuras: "Volviste...")
5. Conectar con productos reales de WooCommerce

### FUTURO:
6. Análisis de textos libres con IA
7. Recomendaciones inteligentes basadas en respuestas

---

## 10. COMANDOS ÚTILES

### Subir archivo a WordPress:
```bash
expect << 'EOF'
spawn sftp -o StrictHostKeyChecking=no -P 55309 sftp_live_WfP6i@34.70.139.72
expect "password:"
send "JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR\r"
expect "sftp>"
send "cd web/wp-live/wp-content/mu-plugins\r"
expect "sftp>"
send "put /ruta/local/archivo.php\r"
expect "sftp>"
send "bye\r"
expect eof
EOF
```

### Verificar estado del sitio:
```bash
curl -s -o /dev/null -w "%{http_code}" "https://duendesuy.10web.cloud/"
curl -s -o /dev/null -w "%{http_code}" "https://duendesuy.10web.cloud/shop/"
curl -s -o /dev/null -w "%{http_code}" "https://duendesuy.10web.cloud/descubri-que-duende-te-elige/"
```

### Ver qué versión del test se sirve:
```bash
curl -s "https://duendesuy.10web.cloud/descubri-que-duende-te-elige/?v=$(date +%s)" | grep -o 'TEST GUARDIAN v[0-9]\|tg-portal'
```

---

## 11. ARCHIVOS LOCALES IMPORTANTES

```
/Users/usuario/Desktop/duendes-vercel/
├── app/api/
│   ├── newsletter/subscribe/route.js
│   ├── test-guardian/save/route.js
│   └── test-guardian/insights/route.js
├── wordpress-plugins/
│   ├── test-guardian-v3.php (v8 actual)
│   ├── duendes-neuromarketing.php
│   └── duendes-fixes-master.php
├── CLAUDE.md (guía de voz/tono)
└── HANDOFF-CLAUDE-CODE.md (este documento)
```

```
/tmp/wp-mu/ (archivos temporales para subir)
├── test-guardian-v8.php
├── duendes-neuromarketing.php
└── duendes-fixes-master.php
```

---

## 12. CRITERIOS DE ÉXITO

```
✅ Test se ve en browser (actualmente NO)
✅ Sin botones verdes
✅ Estética azul neón + negro
✅ Final con grilla 2 columnas, no cajas apiladas
✅ Newsletter guarda y muestra feedback
✅ Usa nombre de la persona en resultado
✅ Tienda funciona en /shop/
```

---

## 13. NOTAS FINALES

- El proyecto usa Next.js 14 en Vercel + WordPress con Elementor en 10Web
- Los mu-plugins se cargan automáticamente, no necesitan activación
- El tono debe ser místico pero NO cliché ("el velo entre mundos", "brumas ancestrales" están PROHIBIDOS)
- Revisar CLAUDE.md para guía completa de voz y personalidad

**EL PROBLEMA PRINCIPAL AHORA**: El test genera HTML correcto pero no se ve visualmente. Hay CSS que lo oculta y el caché del CDN no se refresca.
