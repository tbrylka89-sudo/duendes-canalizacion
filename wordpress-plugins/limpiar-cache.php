<?php
/**
 * TEMPORAL - Limpiar OPcache
 * Visitá: tudominio.com/wp-content/mu-plugins/limpiar-cache.php
 * Después borrá este archivo
 */

if (function_exists('opcache_reset')) {
    opcache_reset();
    echo "✅ OPcache limpiado exitosamente!<br>";
    echo "Ahora podés borrar este archivo.";
} else {
    echo "⚠️ OPcache no está habilitado o no tenés permisos.";
}

// También intentar limpiar cache de WordPress si existe
if (file_exists(dirname(__FILE__) . '/../../wp-load.php')) {
    require_once(dirname(__FILE__) . '/../../wp-load.php');
    if (function_exists('wp_cache_flush')) {
        wp_cache_flush();
        echo "<br>✅ WordPress object cache también limpiado.";
    }
}
