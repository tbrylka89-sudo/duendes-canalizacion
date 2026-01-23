# Panel de Aprobación de Canalizaciones

**Última actualización:** 21 Enero 2026

## Resumen

Sistema completo para revisar, editar y aprobar canalizaciones antes de enviarlas a los clientes.

---

## URLs

- **Panel Admin:** `/admin/canalizaciones`
- **Detalle:** `/admin/canalizaciones/[id]`
- **API:** `/api/admin/canalizaciones`

---

## Archivos Principales

```
app/admin/canalizaciones/
  page.jsx                    # Lista con tabs (Pendientes/Aprobadas/Enviadas)
  [id]/page.jsx               # Detalle: preview + resumen IA + chat editor

app/api/admin/canalizaciones/
  route.js                    # GET (listar), POST (generar), PUT (aprobar/enviar), DELETE (eliminar)
  chat/route.js               # Chat inteligente para modificar canalizaciones
  resumen/route.js            # Genera resumen ejecutivo con IA
```

---

## Flujo de Estados

```
PENDIENTE → APROBADA → ENVIADA
     ↑         ↓
     └─ editar ─┘
```

1. **Pendiente**: Canalización recién generada, esperando revisión
2. **Aprobada**: Revisada y lista para enviar
3. **Enviada**: Ya visible para el cliente en "Mi Magia"

---

## Estilo de las Canalizaciones

### Lo que SÍ es una canalización:
- Una **carta personal** de alguien que te quiere
- Responde específicamente a lo que la persona compartió en el checkout
- Cada guardián tiene personalidad ÚNICA basada en datos del producto
- Español rioplatense (vos, tenés, podés)

### Lo que NO es:
- Texto místico genérico
- Prosa poética vacía
- Horóscopo con nombre

### Palabras PROHIBIDAS:
```
❌ "Desde las profundidades..."
❌ "Las brumas ancestrales..."
❌ "Los antiguos charrúas..."
❌ "El velo entre mundos..."
❌ "jodida/o", "boluda/o", "pelotuda/o"
```

### Alternativas permitidas:
```
✅ "época difícil" (en vez de "jodida")
✅ "no te hagas la distraída" (en vez de "boluda")
```

---

## Perspectivas Importantes (en el prompt)

### Sobre familia:
> La sangre NO hace la familia. NUNCA empujar a alguien a estar con personas que le hacen mal solo porque comparten ADN.

### Sobre recomendar otros guardianes:
> NO vender. Decir algo como: "Los duendes somos seres sociables, cuando habitamos juntos nos potenciamos... te dejo los elementales con los que resuena mi energía, por si algún día sentís el llamado..."

### Disclaimer obligatorio (suave):
> "Acordate que esto es mi forma de acompañarte, de escucharte. No soy terapeuta ni pretendo reemplazar eso - soy un compañero que cree en vos."

---

## Datos que Alimentan las Canalizaciones

### Del producto (WooCommerce):
- nombre, categoria, descripcion
- personalidad, historia, como_habla
- color_favorito, elemento, don
- Cualquier meta_data nuevo se incluye automáticamente

### Del checkout:
- para_quien (para_mi, regalo, sorpresa)
- es_nino (adulto, adolescente, nino, pequeno)
- pronombre
- contexto (lo que la persona escribió)

---

## API Endpoints

### GET `/api/admin/canalizaciones`
```
?estado=pendiente|aprobada|enviada
?id=canal_xxx  (una específica)
```

### POST `/api/admin/canalizaciones`
Genera nueva canalización (llamado desde webhook de compra)

### PUT `/api/admin/canalizaciones`
```json
{ "id": "canal_xxx", "accion": "aprobar|enviar|editar" }
```

### DELETE `/api/admin/canalizaciones?id=canal_xxx`
Elimina una canalización

---

## Canalizaciones de Prueba Actuales

| ID | Cliente | Guardián | Estado |
|----|---------|----------|--------|
| canal_TEST-003_bramble-001_* | Carolina Méndez | Bramble | pendiente |
| canal_TEST-004_violeta-4740_* | Martina Rodríguez | Violeta | pendiente |

---

## Fixes Aplicados (21 Ene 2026)

1. **Botón volver no funcionaba** → Arreglado con navegación explícita + z-index
2. **Botones Aprobar/Enviar no funcionaban** → El CSS global tenía un patrón SVG cubriendo los botones, se removió con `!important`
3. **Error ordenId.slice()** → Agregado `.toString()` antes de `.slice()` porque ordenId puede ser número
4. **Endpoint DELETE** → Agregado para poder eliminar canalizaciones de prueba

---

## Próximos Pasos

- [ ] Agregar más meta_data de personalidad a los productos en WooCommerce
- [ ] Probar con compra real desde la tienda
- [ ] Implementar envío de email al aprobar/enviar
- [ ] Chat editor para modificar canalizaciones antes de aprobar
