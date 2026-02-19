<?php
/**
 * Flush rewrite rules - auto-delete
 */
if (!defined('ABSPATH')) exit;

add_action('init', function() {
    flush_rewrite_rules();
    error_log('[Duendes] Rewrite rules flushed');
    @unlink(__FILE__);
}, 9999);
