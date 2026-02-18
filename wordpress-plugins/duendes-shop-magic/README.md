# Duendes Shop Magic — Plugin para WordPress

## Instrucciones para Claude Code

### Instalación

1. Copiar toda la carpeta `duendes-shop-magic/` a:
   ```
   /var/www/html/wp-content/plugins/duendes-shop-magic/
   ```
   (o la ruta equivalente de wp-content/plugins en el servidor)

2. La carpeta debe contener estos 3 archivos:
   - `duendes-shop-magic.php` (plugin principal)
   - `shop-magic.css` (estilos)
   - `shop-magic.js` (JavaScript)

3. Activar el plugin desde WordPress > Plugins

### Qué hace

- Solo se carga en `/shop/` y páginas de categoría de producto
- Inyecta CSS que transforma las `guardian-card` existentes con estilo mágico oscuro
- Inyecta JS que:
  - Crea partículas flotantes doradas (canvas)
  - Agrupa las cards por tamaño (Mini, Pixie, Mediano, Grande, Gigante)
  - Inserta headers de sección épicos entre grupos
  - Agrega hover overlay "CONOCER SU HISTORIA" a cada card
  - Scroll reveal con IntersectionObserver
  - Cursor glow que sigue el mouse (solo desktop)
  - Social proof toast

### Notas

- El JS lee `.guardian-tamano` de cada card para clasificar por tamaño
- Los productos adoptados (`.guardian-card.adoptado`) se muestran al final de cada sección en gris
- Si se agregan nuevos tamaños (Grande, Gigante), aparecen automáticamente
- No modifica ningún archivo existente — es un overlay puro
