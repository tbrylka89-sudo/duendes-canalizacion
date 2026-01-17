# SESIÓN 4: COMUNIDAD + FORO + REFINAMIENTO FINAL
## Tiempo estimado: 1.5 horas
## Objetivo: Foro, sugerencias, y pulir todo

---

## CONTEXTO PREVIO

Antes de empezar, dile a Claude Code:

```
Completamos Sesiones 1, 2 y 3. Ahora vamos con la comunidad y el refinamiento final.
Necesitamos el foro, buzón de sugerencias, y asegurarnos que todo esté perfecto.
```

---

## PASO 1: FORO / COMUNIDAD PRIVADA

### Instrucciones para Claude Code:

```
Crea el foro de la comunidad del Círculo:

RUTA: /app/mi-magia/circulo/comunidad/page.jsx

ESTRUCTURA DEL FORO:

CATEGORÍAS:
1. 🏠 General
   - Presentaciones ("Hola, soy nueva...")
   - Charla libre
   
2. 🧝 Sobre los Guardianes
   - Experiencias con mi guardián
   - Preguntas sobre cuidados
   - Historias de conexión
   
3. 🔮 Prácticas y Rituales
   - Compartir rituales propios
   - Dudas sobre rituales del Círculo
   - Resultados y experiencias
   
4. 🌙 Luna y Estaciones
   - Discusión de fases lunares
   - Celebraciones celtas
   - Altares y decoración

5. 💡 Sugerencias para el Círculo
   - Ideas de contenido
   - Mejoras sugeridas
   - Votación de temas

INTERFAZ:

LISTA DE CATEGORÍAS:
- Icono + Nombre de categoría
- Descripción corta
- Número de posts
- Último post (título + fecha + autor)

DENTRO DE CATEGORÍA:
- Lista de posts/hilos
- Cada post muestra:
  - Título
  - Autor (nombre + avatar si tiene)
  - Fecha
  - Número de respuestas
  - Preview del contenido
- Botón: "+ Nuevo Post"
- Ordenar por: Recientes / Más respondidos / Sin respuesta

CREAR POST:
- Campo: Título (obligatorio)
- Campo: Contenido (editor rich text básico)
- Selector: Categoría
- Checkbox: "Notificarme respuestas por email"
- Botón: "Publicar"

VER POST:
- Título grande
- Autor + fecha + categoría
- Contenido completo
- Respuestas en orden cronológico
- Cada respuesta: autor + fecha + contenido
- Campo para responder abajo
- Botón: "Responder"

MODERACIÓN (solo admin):
- Eliminar posts/respuestas
- Fijar posts importantes
- Cerrar hilos
- Advertir usuarios

REGLAS DEL FORO (mostrar al crear post):
- Sé respetuoso/a con todos
- No spam ni autopromoción
- Mantén el tema místico y positivo
- No compartir contenido del Círculo fuera

DATOS EN VERCEL KV:
foro_categorias: [{id, nombre, icono, descripcion}]

foro_posts: {
  [post_id]: {
    titulo,
    contenido,
    autor_id,
    autor_nombre,
    categoria_id,
    fecha,
    respuestas_count,
    fijado,
    cerrado
  }
}

foro_respuestas: {
  [post_id]: [
    { respuesta_id, autor_id, autor_nombre, contenido, fecha }
  ]
}

NOTIFICACIONES:
- Email cuando alguien responde a tu post (si está activado)
- Email cuando admin responde (siempre)
```

---

## PASO 2: BUZÓN DE SUGERENCIAS

### Instrucciones para Claude Code:

```
Crea el buzón de sugerencias (separado del foro):

RUTA USUARIO: /app/mi-magia/circulo/sugerencias/page.jsx
RUTA ADMIN: /app/admin/sugerencias/page.jsx

INTERFAZ USUARIO:

FORMULARIO DE SUGERENCIA:
- Título: "¿Qué te gustaría ver en el Círculo?"
- Campo: Tipo de sugerencia
  - Tema para contenido
  - Nueva funcionalidad
  - Mejora existente
  - Duende que te gustaría que dirija
  - Otro
- Campo: Tu sugerencia (textarea grande)
- Campo: ¿Por qué te gustaría esto? (opcional)
- Checkbox: "Publicar anónimamente"
- Botón: "Enviar sugerencia ✨"

MIS SUGERENCIAS:
- Lista de sugerencias que envié
- Estado de cada una: Pendiente / En revisión / Aceptada / Implementada / Descartada
- Respuesta del admin si hay

SUGERENCIAS POPULARES (votación):
- Lista de sugerencias públicas
- Botón "Me gustaría esto" (voto)
- Ordenadas por votos
- Las más votadas tienen prioridad

INTERFAZ ADMIN:

LISTA DE SUGERENCIAS:
- Tabla con todas las sugerencias
- Columnas: Fecha, Usuario, Tipo, Sugerencia, Votos, Estado
- Filtros: Todos / Pendientes / En revisión / Implementadas
- Ordenar por: Fecha / Votos / Estado

GESTIONAR SUGERENCIA:
- Ver sugerencia completa
- Cambiar estado
- Escribir respuesta (se envía al usuario)
- Marcar para implementar
- Descartar con razón

ACCIONES MASIVAS:
- Seleccionar varias → cambiar estado
- Exportar sugerencias a CSV

DATOS:
sugerencias: {
  [id]: {
    usuario_id,
    usuario_email,
    anonimo: true/false,
    tipo,
    sugerencia,
    razon,
    votos: 5,
    estado: "pendiente",
    respuesta_admin: null,
    fecha,
    fecha_actualizado
  }
}
```

---

## PASO 3: WIDGET "DUENDE DISPONIBLE"

### Instrucciones para Claude Code:

```
Crea el sistema de "Duende Disponible" para el Círculo:

CONCEPTO:
Cuando un duende dirige la semana, mostrar que está disponible para adopción.
Si alguien lo adopta → mensaje especial + ya no aparece en rotación futura.

WIDGET EN CONTENIDO DEL CÍRCULO:

CARD: "Conoce a {Nombre}"
- Imagen del duende (grande, hermosa)
- Nombre
- Descripción breve (de WooCommerce)
- Cristales que lleva
- Precio
- Botón: "Ver en la tienda ✨"
- Badge: "⭐ Dirige esta semana"

TEXTO MÁGICO:
"{Nombre} te está guiando esta semana. Si sientes el llamado, 
este guardián está disponible para formar un pacto álmico contigo.
Recuerda: cada guardián es único. Si alguien más lo elige primero,
habrá encontrado su hogar... pero quizás otro te esté esperando."

SI ES ADOPTADO DURANTE LA SEMANA:
- Cambiar card a: "Este guardián encontró su hogar 🏡"
- "{Nombre} fue adoptado/a por un/a miembro de nuestra comunidad.
  Su sabiduría de esta semana permanece con nosotros.
  El próximo lunes, un nuevo guardián nos guiará."
- NO mostrar botón de compra
- Marcar en sistema: duende_adoptado_durante_semana = true

DETECCIÓN DE ADOPCIÓN:
- Webhook de WooCommerce cuando se compra un producto
- Si el producto_id === duende_semana_actual.producto_id → marcar como adoptado
- Notificar al admin
- Actualizar vista del Círculo en tiempo real (o al recargar)

HISTORIAL:
- En algún lugar del Círculo, mostrar:
  "Guardianes que nos guiaron y encontraron hogar:"
  - Lista de duendes adoptados durante su semana
  - "Su sabiduría sigue con nosotros"
```

---

## PASO 4: REVISIÓN FINAL DE MI MAGIA

### Instrucciones para Claude Code:

```
Revisa y asegura que Mi Magia esté completo:

CHECKLIST MI MAGIA:

SECCIONES QUE DEBEN EXISTIR:
- [ ] Dashboard/Home de Mi Magia
- [ ] Mis Guardianes (lista de duendes comprados)
- [ ] Detalle de Guardián (canalización, cuidados)
- [ ] Mis Runas (balance + historial)
- [ ] Mis Tréboles (balance + cómo canjear)
- [ ] El Círculo (acceso o promoción)
- [ ] Configuración (email, preferencias)
- [ ] Tito (chat de ayuda)

FUNCIONALIDADES:
- [ ] Tour de bienvenida (primera vez)
- [ ] Navegación clara entre secciones
- [ ] Mobile responsive
- [ ] Carga rápida
- [ ] Sin errores en consola

VERIFICAR TITO:
- [ ] Botón de Tito visible
- [ ] Chat abre correctamente
- [ ] Responde a preguntas
- [ ] Tiene contexto del usuario (sabe su nombre, duendes, etc.)
- [ ] NO está roto por los cambios que hicimos

ESTÉTICA:
- [ ] Colores consistentes (negro, dorado, crema)
- [ ] Fuentes correctas (Cinzel, Cormorant Garamond)
- [ ] Imágenes cargan
- [ ] Espaciado profesional
- [ ] Se siente premium y mágico
```

---

## PASO 5: REVISIÓN FINAL DEL CÍRCULO

### Instrucciones para Claude Code:

```
Revisa y asegura que el Círculo esté completo:

CHECKLIST CÍRCULO:

PÁGINA DE VENTA (para no miembros):
- [ ] Descripción clara de qué es el Círculo
- [ ] Lista de beneficios
- [ ] Precios correctos ($3.600 / $5.900)
- [ ] Badge "MEJOR VALOR" en anual
- [ ] Botón Trial 15 días prominente
- [ ] Testimonios (si hay)
- [ ] FAQ básico

DENTRO DEL CÍRCULO (para miembros):
- [ ] Tour de bienvenida (primera vez)
- [ ] Duende de la Semana visible
- [ ] Contenido del día destacado
- [ ] Contenido de la semana en grid
- [ ] Widget fase lunar
- [ ] Widget estación celta
- [ ] Acceso al foro/comunidad
- [ ] Acceso a sugerencias
- [ ] Archivo de contenido pasado
- [ ] Card del duende disponible

PARA USUARIOS EN TRIAL:
- [ ] Banner indicando días restantes
- [ ] Botón "Suscribirme" visible
- [ ] Todo el contenido accesible

PARA USUARIOS CON TRIAL VENCIDO:
- [ ] Mensaje de que terminó el trial
- [ ] Lo que se están perdiendo
- [ ] Botón "Suscribirme" con descuento
- [ ] NO pueden ver contenido nuevo
```

---

## PASO 6: REVISIÓN FINAL DEL ADMIN

### Instrucciones para Claude Code:

```
Revisa que el Admin esté completo:

CHECKLIST ADMIN:

AUTENTICACIÓN:
- [ ] Login funciona
- [ ] Logout funciona  
- [ ] Rutas protegidas redirigen a login
- [ ] Token expira y pide re-login

DASHBOARD:
- [ ] Métricas cargan correctamente
- [ ] Datos son reales (no placeholders)
- [ ] Accesos rápidos funcionan

USUARIOS:
- [ ] Lista de usuarios carga
- [ ] Búsqueda funciona
- [ ] Filtros funcionan
- [ ] Crear usuario manual funciona
- [ ] Ver detalle de usuario funciona
- [ ] Editar usuario funciona

REGALOS:
- [ ] Buscar usuario funciona
- [ ] Regalar runas funciona (y se refleja)
- [ ] Regalar tréboles funciona
- [ ] Regalar acceso Círculo funciona
- [ ] Crear cupón funciona
- [ ] Extender membresía funciona

CÍRCULO:
- [ ] Stats cargan
- [ ] Lista de miembros funciona
- [ ] Lista de trials funciona
- [ ] Cambiar duende de semana funciona

CONTENIDO:
- [ ] Generador funciona (llama a Claude API)
- [ ] Calendario muestra datos
- [ ] Publicar contenido funciona
- [ ] Contenido aparece en el Círculo público

SUGERENCIAS:
- [ ] Lista de sugerencias carga
- [ ] Cambiar estado funciona
- [ ] Responder funciona
```

---

## PASO 7: PRUEBAS END-TO-END

### Instrucciones para Claude Code:

```
Ejecuta estas pruebas completas:

FLUJO 1: NUEVO USUARIO (desde cero)
1. Visitar la web como visitante
2. Ver página del Círculo
3. Hacer clic en "Trial 15 días"
4. Registrarse con email
5. Entrar a Mi Magia
6. Ver tour de bienvenida
7. Entrar al Círculo
8. Ver tour del Círculo
9. Ver contenido del día
10. Ir al foro
11. Crear un post
12. Enviar una sugerencia
→ Todo debe funcionar sin errores

FLUJO 2: ADMIN CREA USUARIO
1. Login en /admin
2. Ir a Usuarios
3. Crear usuario nuevo con email de prueba
4. Darle acceso al Círculo
5. Regalarle 100 runas
6. Verificar que el usuario aparece en la lista
7. Verificar que puede entrar al Círculo

FLUJO 3: GENERAR CONTENIDO
1. Login en /admin
2. Seleccionar Duende de la Semana
3. Generar su personalidad
4. Activarlo
5. Ir a Contenido
6. Generar contenido del día
7. Publicar
8. Verificar que aparece en el Círculo público

FLUJO 4: COMPRA DE DUENDE (simulado)
1. Simular webhook de WooCommerce con compra
2. Verificar que se crea cuenta en Mi Magia
3. Verificar que el duende aparece en "Mis Guardianes"
4. Verificar que se envía email de bienvenida

REPORTAR:
- [ ] Flujo 1: OK / Errores encontrados
- [ ] Flujo 2: OK / Errores encontrados
- [ ] Flujo 3: OK / Errores encontrados
- [ ] Flujo 4: OK / Errores encontrados
```

---

## PASO 8: DEPLOY Y VERIFICACIÓN PRODUCCIÓN

### Instrucciones para Claude Code:

```
Prepara el deploy a producción:

1. VERIFICAR VARIABLES DE ENTORNO EN VERCEL:
   - ANTHROPIC_API_KEY (para generar contenido)
   - OPENAI_API_KEY (para imágenes si se usa)
   - RESEND_API_KEY (para emails)
   - ADMIN_SECRET (para autenticación)
   - WOOCOMMERCE_WEBHOOK_SECRET (para verificar webhooks)
   - KV_REST_API_URL (Vercel KV)
   - KV_REST_API_TOKEN (Vercel KV)

2. EJECUTAR BUILD:
   npm run build
   
   → Debe completar sin errores
   → Revisar warnings importantes

3. COMMIT Y PUSH:
   git add .
   git commit -m "feat: Sistema completo Mi Magia + Círculo + Admin"
   git push origin main

4. VERIFICAR DEPLOY EN VERCEL:
   - Ir a vercel.com/dashboard
   - Ver que el deploy completó
   - Revisar logs por errores

5. PROBAR EN PRODUCCIÓN:
   - Abrir https://duendes-vercel.vercel.app (o tu dominio)
   - Probar flujo de trial
   - Probar login admin
   - Verificar que todo funciona igual que en local

6. CONFIGURAR DOMINIO (si no está):
   - Conectar dominio personalizado
   - Verificar SSL

REPORTE FINAL:
- URL de producción funcionando
- Screenshots de cada sección
- Lista de TODO si quedó algo pendiente
```

---

## RESUMEN SESIÓN 4

| Paso | Tarea | Tiempo estimado |
|------|-------|-----------------|
| 1 | Foro / Comunidad | 30 min |
| 2 | Buzón Sugerencias | 15 min |
| 3 | Widget Duende Disponible | 15 min |
| 4 | Revisión Mi Magia | 10 min |
| 5 | Revisión Círculo | 10 min |
| 6 | Revisión Admin | 10 min |
| 7 | Pruebas E2E | 20 min |
| 8 | Deploy | 15 min |

**Total: ~2 horas**

---

## 🎉 ¡PROYECTO COMPLETADO!

Al terminar las 4 sesiones tendrás:

✅ Mi Magia completo con tours
✅ Círculo de Duendes con trial 15 días
✅ Panel Admin para ser "dioses"
✅ Sistema de regalos completo
✅ Generador de contenido con IA
✅ Duende de la Semana automatizado
✅ Calendario editorial
✅ Fases lunares y estaciones celtas
✅ Foro de comunidad
✅ Buzón de sugerencias
✅ Tito funcionando
✅ Todo desplegado en producción

**Tiempo total estimado: 7-8 horas**
