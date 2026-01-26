#!/bin/bash
# Script para subir plugins a WordPress via SFTP
# Ejecutar: ./scripts/subir-plugins-wp.sh

echo "=== Subiendo plugins a WordPress ==="
echo ""

# Datos de conexión
HOST="34.70.139.72"
PORT="55309"
USER="sftp_live_WfP6i"
PASS="JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR"
REMOTE_PATH="web/wp-live/wp-content/mu-plugins"

# Archivos a subir
PLUGIN1="/Users/usuario/Desktop/duendes-vercel/wordpress-plugins/duendes-tito-widget.php"
PLUGIN2="/Users/usuario/Desktop/duendes-vercel/wordpress-plugins/duendes-header-footer-garantizado.php"

echo "Conectando a $HOST:$PORT..."
echo ""

/usr/bin/expect << EOF
set timeout 120
spawn sftp -o StrictHostKeyChecking=no -o ConnectTimeout=60 -P $PORT $USER@$HOST
expect {
    "password:" {
        send "$PASS\r"
    }
    timeout {
        puts "\n\n=== ERROR: Servidor no responde ==="
        puts "El servidor de 10Web puede estar en mantenimiento."
        puts "Intentá de nuevo en unos minutos."
        exit 1
    }
}
expect "sftp>"
send "cd $REMOTE_PATH\r"
expect "sftp>"
puts "\n--- Subiendo duendes-tito-widget.php ---"
send "put $PLUGIN1\r"
expect "sftp>"
puts "\n--- Subiendo duendes-header-footer-garantizado.php ---"
send "put $PLUGIN2\r"
expect "sftp>"
puts "\n--- Verificando archivos ---"
send "ls -la *.php\r"
expect "sftp>"
send "bye\r"
expect eof
EOF

echo ""
echo "=== Listo! ==="
echo ""
echo "Los plugins fueron subidos. Verificá la web:"
echo "https://duendesdeluruguay.com/tienda/"
echo ""
echo "Si Tito sigue sin aparecer, limpiá el caché desde:"
echo "https://my.10web.io/websites/1453202/main"
