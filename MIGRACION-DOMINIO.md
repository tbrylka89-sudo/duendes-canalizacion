# MIGRACIÓN DE DOMINIO: Wix → WordPress (10Web)

## ESTADO ACTUAL (Actualizado: 17 enero 2026)

| Paso | Estado | Notas |
|------|--------|-------|
| DNS en Wix configurado | ✅ LISTO | A record → 34.70.139.72, CNAME www → duendesuy.10web.cloud |
| DNS propagado | ✅ LISTO | Verificado con dig @8.8.8.8 |
| Redirects Wix→WP instalados | ✅ LISTO | Plugin duendes-redirects-wix activo |
| 10Web detecta dominio | ⏳ ESPERANDO | Puede tardar hasta 24hs |
| SSL generado | ⏳ PENDIENTE | Hacer cuando 10Web diga "Pointed" |
| URLs WordPress actualizadas | ⏳ PENDIENTE | Hacer después del SSL |

### PRÓXIMOS PASOS (cuando 10Web diga "Pointed"):

1. En 10Web → Domains → click 3 puntitos en duendesdeluruguay.com → **Make Primary**
2. En 10Web → Tools → SSL → **Generate Free SSL** → Seleccionar duendesdeluruguay.com → Apply
3. Avisar a Claude para cambiar URLs de WordPress automáticamente

### URLs importantes:
- **Sitio actual:** https://duendesuy.10web.cloud
- **Sitio nuevo (cuando esté listo):** https://www.duendesdeluruguay.com
- **10Web panel:** https://my.10web.io/websites/1453202/domains

---

## Resumen Ejecutivo

| Aspecto | Detalle |
|---------|---------|
| **Dominio** | www.duendesdeluruguay.com |
| **Registrador actual** | Wix.com Ltd. |
| **Nameservers actuales** | ns10.wixdns.net, ns11.wixdns.net (no editables) |
| **Expira** | 2026-12-05 |
| **Destino** | duendesuy.10web.cloud |
| **IP de 10Web** | 34.70.139.72 |

---

## PARTE 1: URLs ENCONTRADAS EN WIX

### Páginas principales (17)

| URL Wix | Última modificación |
|---------|---------------------|
| / | Home |
| /cuidados | Cuidados |
| /stock | Stock disponible |
| /contacto | Contacto |
| /encargue | Formulario encargue |
| /portfolio | Portfolio |
| /nosotros | Nosotros |
| /políticas | Políticas |
| /plans-pricing | Planes y precios |
| /accesorios | Accesorios |
| /maestros | Duendes maestros |
| /formulario-de-duende-maestro | Formulario maestro |
| /loyalty | Programa lealtad |
| /shop-1 | Tienda |
| /copia-de-info | Info (copia) |
| /members | Área miembros |
| /preguntas-frecuentes | FAQ |

### Productos (62 encontrados en sitemap)

```
/product-page/dani-tu-compañero-para-los-días-de-ansiedad
/product-page/élowen
/product-page/jeremy
/product-page/brian-a
/product-page/mürh
/product-page/duende-de-la-sanación-1
/product-page/gaia
/product-page/box-elemental-opción-4
/product-page/chechu
/product-page/nano
/product-page/lil-el-duende-maestro-1
/product-page/ekris
/product-page/vero
/product-page/duende-compañero-2-1
/product-page/naia
/product-page/santino
/product-page/asher
/product-page/sennua
/product-page/7-poderes
/product-page/merlin
/product-page/merlin-1
/product-page/aprende-a-canalizar-duendes
/product-page/emilio
/product-page/cash-el-duende-del-dinero-1
/product-page/tony
/product-page/freydis
/product-page/estelar
/product-page/idris
/product-page/maya
/product-page/heart
/product-page/bruja-elemental
/product-page/amatista
/product-page/astrid
/product-page/promo-3x2
/product-page/duendes-en-tu-vida-guía-básica
/product-page/sara
/product-page/mario
/product-page/stan
/product-page/promo-matheo-y-lil-con-mini-set-de-cristales-de-regalo
/product-page/set-5-cristales-para-tu-duende
/product-page/cuarzo-aura
/product-page/rasiel-duende-de-la-transformación-y-éxito
/product-page/gran-aldea-1
/product-page/roger
/product-page/biblioteca-mágica
/product-page/altar-sincronizado-elemental
/product-page/trévor
/product-page/milo
/product-page/casita-elemental
/product-page/amatista-de-altar
/product-page/luke-duende-viajero
/product-page/reino-elemental-12-guardianes
/product-page/rubi
/product-page/matheo-selección-universo
/product-page/pequeña-aldea
/product-page/amun
/product-page/tareth
/product-page/rejilla-de-cristal-triple-manifestación
/product-page/kael-viajero-estelar
/product-page/rahmus-1
/product-page/trevi
/product-page/micelio-1
```

---

## PARTE 2: MAPA DE REDIRECTS

### Redirects de Páginas

```apache
# PÁGINAS PRINCIPALES - Agregar a .htaccess o plugin Redirection

# Home (no necesita redirect)
# / → /

# Tienda
RewriteRule ^shop-1/?$ /shop/ [R=301,L]
RewriteRule ^stock/?$ /shop/ [R=301,L]
RewriteRule ^accesorios/?$ /shop/ [R=301,L]

# Información
RewriteRule ^cuidados/?$ /como-funciona/ [R=301,L]
RewriteRule ^nosotros/?$ /nosotros/ [R=301,L]
RewriteRule ^contacto/?$ /contacto/ [R=301,L]
RewriteRule ^encargue/?$ /contacto/ [R=301,L]
RewriteRule ^preguntas-frecuentes/?$ /faq/ [R=301,L]
RewriteRule ^pol%C3%ADticas/?$ /politica-de-privacidad/ [R=301,L]
RewriteRule ^políticas/?$ /politica-de-privacidad/ [R=301,L]

# Membresías y programas
RewriteRule ^plans-pricing/?$ /circulo-de-duendes/ [R=301,L]
RewriteRule ^loyalty/?$ /circulo-de-duendes/ [R=301,L]
RewriteRule ^members/?$ /mi-cuenta/ [R=301,L]

# Formularios y test
RewriteRule ^formulario-de-duende-maestro/?$ /descubri-que-duende-te-elige/ [R=301,L]
RewriteRule ^maestros/?$ /descubri-que-duende-te-elige/ [R=301,L]

# Otros
RewriteRule ^portfolio/?$ /testimonios/ [R=301,L]
RewriteRule ^copia-de-info/?$ / [R=301,L]
```

### Redirects de Productos (Wix → WooCommerce)

```apache
# PRODUCTOS - Cambio de /product-page/ a /product/

# Redirect genérico para todos los productos
RewriteRule ^product-page/(.*)$ /product/$1 [R=301,L]

# Productos con nombres específicos que cambiaron
RewriteRule ^product-page/dani-tu-compa%C3%B1ero-para-los-d%C3%ADas-de-ansiedad/?$ /product/dani-para-los-dias-de-ansiedad/ [R=301,L]
RewriteRule ^product-page/dani-tu-compañero-para-los-días-de-ansiedad/?$ /product/dani-para-los-dias-de-ansiedad/ [R=301,L]
RewriteRule ^product-page/duende-de-la-sanaci%C3%B3n-1/?$ /product/duende-de-la-sanacion/ [R=301,L]
RewriteRule ^product-page/duende-de-la-sanación-1/?$ /product/duende-de-la-sanacion/ [R=301,L]
RewriteRule ^product-page/lil-el-duende-maestro-1/?$ /product/lil/ [R=301,L]
RewriteRule ^product-page/cash-el-duende-del-dinero-1/?$ /product/cash/ [R=301,L]
RewriteRule ^product-page/rasiel-duende-de-la-transformaci%C3%B3n-y-%C3%A9xito/?$ /product/rasiel-duende-de-la-transformacion-y-exito/ [R=301,L]
RewriteRule ^product-page/tr%C3%A9vor/?$ /product/trevor-el-duende-de-la-suerte/ [R=301,L]
RewriteRule ^product-page/trévor/?$ /product/trevor-el-duende-de-la-suerte/ [R=301,L]
RewriteRule ^product-page/luke-duende-viajero/?$ /product/luke-el-duende-viajero-protector/ [R=301,L]
RewriteRule ^product-page/matheo-selecci%C3%B3n-universo/?$ /product/matheo/ [R=301,L]
RewriteRule ^product-page/rahmus-1/?$ /product/rahmus/ [R=301,L]
RewriteRule ^product-page/micelio-1/?$ /product/micelio/ [R=301,L]
RewriteRule ^product-page/gaia/?$ /product/gaia-2/ [R=301,L]
RewriteRule ^product-page/m%C3%BCrh/?$ /product/murh/ [R=301,L]
RewriteRule ^product-page/mürh/?$ /product/murh/ [R=301,L]
RewriteRule ^product-page/%C3%A9lowen/?$ /product/elowen/ [R=301,L]
RewriteRule ^product-page/élowen/?$ /product/elowen/ [R=301,L]
```

---

## PARTE 3: CONFIGURACIÓN DNS

### Datos actuales del dominio

```
Registrador: Wix.com Ltd.
Nameservers: ns10.wixdns.net, ns11.wixdns.net
IP actual: 185.230.63.107 (Wix)
```

### Datos necesarios para 10Web

```
IP de 10Web: 34.70.139.72
```

### Método recomendado: Registro A + CNAME

En lugar de cambiar nameservers (que requiere transferir el dominio), podés cambiar los registros DNS directamente en Wix:

| Tipo | Host | Valor | TTL |
|------|------|-------|-----|
| A | @ | 34.70.139.72 | 3600 |
| CNAME | www | duendesuy.10web.cloud | 3600 |

---

## PARTE 4: TUTORIAL - CAMBIAR DNS EN WIX

### Paso 1: Entrar al panel de Wix

1. Andá a **https://www.wix.com** e iniciá sesión
2. Click en tu foto de perfil (arriba a la derecha)
3. Seleccioná **"Dominios"** o **"Domains"**

### Paso 2: Seleccionar el dominio

1. Vas a ver `duendesdeluruguay.com` en la lista
2. Click en los **3 puntos** al lado del dominio
3. Seleccioná **"Administrar registros DNS"** o **"Manage DNS Records"**

### Paso 3: Modificar registro A existente

1. Buscá el registro tipo **A** que apunta a `@` o está vacío
2. Click en **Editar** (ícono de lápiz)
3. Cambiá el valor de la IP a: `34.70.139.72`
4. Click en **Guardar**

### Paso 4: Modificar o crear registro CNAME para www

1. Buscá si existe un registro **CNAME** para `www`
2. Si existe, editalo y poné: `duendesuy.10web.cloud`
3. Si no existe, click en **"Agregar registro"**:
   - Tipo: CNAME
   - Host: www
   - Valor: duendesuy.10web.cloud
4. Click en **Guardar**

### Paso 5: Eliminar otros registros que apunten a Wix

1. Buscá otros registros A que apunten a IPs de Wix (185.230.x.x)
2. Eliminalos para evitar conflictos

### Paso 6: Esperar propagación

- Los cambios tardan entre **15 minutos y 24 horas** en propagarse
- Podés verificar en: https://dnschecker.org/#A/duendesdeluruguay.com

---

## PARTE 5: CONFIGURAR DOMINIO EN 10WEB

### Paso 1: Entrar al dashboard de 10Web

1. Andá a **https://my.10web.io**
2. Iniciá sesión con tu cuenta

### Paso 2: Ir a tu sitio

1. En el dashboard, buscá **duendesuy.10web.cloud**
2. Click en el sitio para entrar a su panel

### Paso 3: Agregar dominio personalizado

1. En el menú lateral, buscá **"Domains"** o **"Dominios"**
2. Click en **"Add Domain"** o **"Agregar dominio"**
3. Escribí: `duendesdeluruguay.com`
4. Marcá también: `www.duendesdeluruguay.com`
5. Click en **"Add"**

### Paso 4: Verificar SSL

1. 10Web debería generar SSL automáticamente (Let's Encrypt)
2. Si no, buscá la opción **"SSL"** y activá **"Free SSL"**
3. Esperá unos minutos a que se genere

### Paso 5: Hacer el dominio primario

1. Una vez que el DNS propague, volvé a la sección de dominios
2. Click en los 3 puntos al lado de `duendesdeluruguay.com`
3. Seleccioná **"Make Primary"** o **"Hacer primario"**

---

## PARTE 6: CONFIGURAR REDIRECTS EN WORDPRESS

### Opción A: Plugin Redirection (Recomendado)

1. En WordPress, andá a **Plugins → Añadir nuevo**
2. Buscá **"Redirection"** (de John Godley)
3. Instalá y activá
4. Andá a **Herramientas → Redirection**
5. Importá las reglas desde un archivo CSV o agregalas manualmente

### Opción B: Archivo .htaccess

1. Conectate por SFTP al servidor de 10Web
2. Navegá a la carpeta raíz del sitio (`/public_html/` o `/htdocs/`)
3. Editá el archivo `.htaccess`
4. Agregá las reglas de la PARTE 2 **antes** de `# BEGIN WordPress`

### Archivo de redirects para importar

Creé un archivo separado con todos los redirects:
→ Ver: `redirects-wix-to-wp.csv`

---

## PARTE 7: GOOGLE SEARCH CONSOLE

### Paso 1: Agregar la propiedad

1. Andá a **https://search.google.com/search-console**
2. Click en el selector de propiedades (arriba a la izquierda)
3. Click en **"Añadir propiedad"**
4. Elegí **"Dominio"** y escribí: `duendesdeluruguay.com`
5. Verificá con registro DNS (Google te da un valor TXT)

### Paso 2: Verificar con DNS

1. En Wix, agregá un registro TXT con el valor que te da Google
2. Volvé a Search Console y click en **"Verificar"**

### Paso 3: Enviar sitemap nuevo

1. Una vez verificado, andá a **"Sitemaps"** en el menú
2. Agregá: `https://www.duendesdeluruguay.com/sitemap_index.xml`
3. Click en **"Enviar"**

### Paso 4: Solicitar indexación de páginas importantes

1. Andá a **"Inspección de URLs"** (arriba)
2. Pegá cada URL importante y click en **"Solicitar indexación"**
3. Priorizá: Home, Shop, páginas de categoría

### Paso 5: Monitorear redirects

1. En unas semanas, revisá **"Cobertura"**
2. Verificá que no haya errores 404
3. Si hay URLs viejas con error, agregá redirects faltantes

---

## PARTE 8: CHECKLIST POST-MIGRACIÓN

### Inmediatamente después del cambio DNS

- [ ] Verificar que el sitio carga en https://duendesdeluruguay.com
- [ ] Verificar que www redirige correctamente
- [ ] Verificar certificado SSL (candado verde)
- [ ] Probar 3-5 productos al azar
- [ ] Probar el carrito de compras
- [ ] Probar formulario de contacto

### Primeras 24-48 horas

- [ ] Verificar propagación DNS completa en dnschecker.org
- [ ] Probar desde dispositivo móvil
- [ ] Probar desde otra red (datos móviles)
- [ ] Revisar que los redirects funcionan (probar URLs viejas)

### Primera semana

- [ ] Verificar propiedad en Google Search Console
- [ ] Enviar sitemap nuevo
- [ ] Revisar errores de rastreo
- [ ] Monitorear tráfico en Google Analytics
- [ ] Revisar ventas y conversiones

### Primer mes

- [ ] Comparar posiciones en Google (pueden fluctuar temporalmente)
- [ ] Revisar errores 404 en Search Console
- [ ] Agregar redirects faltantes si hay errores
- [ ] Verificar que todas las páginas están indexadas

---

## PARTE 9: ARCHIVOS GENERADOS

| Archivo | Descripción |
|---------|-------------|
| `MIGRACION-DOMINIO.md` | Este documento |
| `redirects-wix-to-wp.csv` | Lista de redirects para importar |
| `htaccess-redirects.txt` | Reglas para .htaccess |

---

## NOTAS IMPORTANTES

### Sobre el dominio en Wix

El dominio tiene estado `clientTransferProhibited`, lo que significa que no se puede transferir a otro registrador sin desbloquear. Sin embargo, **no necesitás transferirlo** - solo cambiar los registros DNS para que apunte a 10Web.

### Sobre las URLs con caracteres especiales

Wix usa caracteres especiales en URLs (ñ, é, ü). WordPress generalmente los normaliza. Los redirects incluyen versiones codificadas (%C3%B1) y sin codificar para cubrir ambos casos.

### Sobre el SEO

- Los redirects 301 preservan ~90-99% del "link juice"
- Es normal ver fluctuaciones de ranking las primeras 2-4 semanas
- Google necesita tiempo para procesar los redirects
- Mantené el sitio de Wix activo unos días mientras propagay verificá

### Tiempo estimado de propagación

- Registros A/CNAME: 15 minutos a 24 horas
- Generación SSL: 5-30 minutos
- Indexación Google: 1-4 semanas
