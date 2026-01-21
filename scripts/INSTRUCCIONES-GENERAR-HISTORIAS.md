# 📜 INSTRUCCIONES PARA GENERAR HISTORIAS DE GUARDIANES

## Resumen
Este script genera historias únicas para los guardianes de Duendes del Uruguay usando la API de Claude. Las historias siguen un formato específico y deben ser revisadas antes de subirse a WooCommerce.

---

## 🚀 CÓMO USAR

### Paso 1: Preparar el archivo de datos
Necesitás un CSV con los productos. El archivo debe tener estas columnas:

```
NOMBRE;GENERO;CATEGORIA;TAMANO;TAMANO_CM;ACCESORIOS
```

- **NOMBRE**: Nombre del guardián (ej: "Matheo", "Luna Pixie")
- **GENERO**: M o F
- **CATEGORIA**: Protección, Abundancia, Amor, Salud, Sabiduría, Sanación
- **TAMANO**: mini, especial, mediano, grande, gigante
- **TAMANO_CM**: 10, 18, 25, etc.
- **ACCESORIOS**: Descripción de lo que lleva (cristales, ropa, objetos)

El archivo debe estar en: `/Users/usuario/Desktop/productos-datos-completos.csv`

### Paso 2: Ejecutar el script
```bash
cd /Users/usuario/Desktop/duendes-vercel
node scripts/generar-historias-completo.js
```

### Paso 3: Revisar las historias
El script genera un archivo de texto para revisar:
```
/Users/usuario/Desktop/HISTORIAS-PARA-REVISAR.txt
```

Revisá cada historia y marcá las que necesiten corrección.

### Paso 4: Subir a WooCommerce
Una vez revisadas, usá el plugin de WordPress "✨ Generar Historias" para:
- Corregir historias individuales
- O usar el script de actualización masiva

---

## 📋 FORMATO DE LAS HISTORIAS

Cada historia DEBE tener esta estructura:

```
Este es [NOMBRE]. Tiene [EDAD] años y es un [TIPO] de [ESPECIALIDAD].

[Párrafo de backstory - qué nos contó cuando lo canalizamos]

**SINCRODESTINO:** [Algo mágico que pasó mientras lo creábamos]

[Qué ama y qué no tolera]

Su especialidad: [descripción corta]

**QUÉ TE APORTA [NOMBRE]:**
- [Beneficio 1 relacionado con sus accesorios]
- [Beneficio 2]
- [Beneficio 3]
- [Beneficio 4]

**CÓMO NACIÓ [NOMBRE] - El trabajo de canalización:**
[Párrafo sobre el proceso de creación artesanal]

**Lo que [NOMBRE] nos pidió que te digamos:**
*"[Mensaje canalizado en primera persona]"*

Si esto te hizo algo, [NOMBRE] ya te eligió.
```

---

## ⚠️ REGLAS CRÍTICAS

### PROHIBIDO:
- ❌ Mencionar nombres individuales (Thibisay, Gabriel, etc.)
- ❌ Usar frases genéricas de IA ("En lo profundo del bosque...")
- ❌ Historias genéricas sin relación con los accesorios
- ❌ Mezclar historias entre guardianes

### OBLIGATORIO:
- ✅ Usar lenguaje de EQUIPO ("nos contó", "canalizamos", "el taller")
- ✅ Tercera persona narrativa (narradores presentando al ser)
- ✅ Mencionar los accesorios específicos en "QUÉ TE APORTA"
- ✅ Español rioplatense (vos, tenés, podés)
- ✅ Cada historia debe ser ÚNICA basada en los datos del producto

### CATEGORÍAS Y SU ENFOQUE:
- **Protección**: Escudos, seguridad, repeler energías negativas
- **Abundancia**: Dinero, prosperidad, oportunidades, negocios
- **Amor**: Relaciones, amor propio, conexiones, sanación del corazón
- **Salud**: Sanación física, vitalidad, equilibrio, bienestar
- **Sabiduría**: Intuición, claridad mental, guía espiritual, conocimiento
- **Sanación**: Sanación emocional, traumas, paz interior

### TAMAÑOS Y SU IMPACTO:
- **mini/especial (10cm)**: Ser recreable, pero cada rostro es único
- **mediano (18cm)**: Pieza única e irrepetible
- **grande (25cm)**: Pieza única de gran poder
- **gigante**: Pieza única maestra, extremadamente rara

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Si las historias se mezclan:
El script procesa de a uno con delays para evitar esto. Si pasa:
1. Identificá qué historias están mal
2. Regenerá solo esas usando el plugin de WordPress

### Si hay errores de API:
- El script tiene 3 reintentos automáticos
- Si falla, espera y vuelve a correr

### Si los accesorios no aparecen en la historia:
- Verificá que el CSV tenga la columna ACCESORIOS completa
- El script usa esa columna para personalizar cada historia

---

## 📁 ARCHIVOS RELACIONADOS

- `scripts/generar-historias-completo.js` - Script principal
- `app/api/admin/productos/generar-historia/route.js` - API de generación
- `downloaded/duendes-generador-historias.php` - Plugin WordPress
- `CLAUDE.md` - Guía de estilo general

---

## 📞 SOPORTE

Si algo no funciona, revisá:
1. Que el archivo CSV esté bien formateado
2. Que la API de Vercel esté funcionando
3. Que tengas conexión a internet estable

Para regenerar una historia individual, usá el panel de WordPress.
