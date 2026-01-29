# PRECIOS OFICIALES - Duendes del Uruguay

## Uruguay (UYU) - Precios Fijos

| Categoría | Precio UYU |
|-----------|------------|
| Mini Clásicos | $2.500 |
| Mini Especiales / Pixies | $5.500 |
| Medianos Especiales | $8.000 |
| Grandes | $16.500 |
| Gigantes | $39.800 |

## Resto del Mundo (USD) - Precios Fijos

| Categoría | Precio USD |
|-----------|------------|
| Mini Clásicos | $70 |
| Mini Especiales / Pixies | $150 |
| Medianos Especiales | $200 |
| Grandes | $450 |
| Gigantes | $1.050 |

## Reglas

1. **Uruguay**: Siempre mostrar precio en UYU según tabla
2. **Resto del mundo**: Siempre mostrar precio en USD + aproximación en moneda local entre paréntesis
3. **No existen otros precios** - estos son los únicos válidos
4. La conversión USD→UYU NO se calcula, se usa la tabla fija

## Mapeo USD → UYU

```javascript
const PRECIOS_FIJOS = {
  // USD → UYU
  70: 2500,    // Mini clásico
  150: 5500,   // Mini especial / Pixie
  200: 8000,   // Mediano especial
  450: 16500,  // Grande
  1050: 39800  // Gigante
};
```
