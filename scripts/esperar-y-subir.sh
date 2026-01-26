#!/bin/bash
# Script que espera a que el servidor esté online y sube los plugins
# Ejecutar: ./scripts/esperar-y-subir.sh

HOST="34.70.139.72"
PORT="55309"
USER="sftp_live_WfP6i"
PASS="JzflrSheUnj4itUE27Aqr0SgD3cG5LXhCR"
REMOTE_PATH="web/wp-live/wp-content/mu-plugins"
BASE_DIR="/Users/usuario/Desktop/duendes-vercel"

echo "========================================"
echo "  ESPERANDO SERVIDOR DE 10WEB..."
echo "========================================"
echo ""
echo "Verificando cada 30 segundos..."
echo "Presioná Ctrl+C para cancelar"
echo ""

# Esperar hasta que el servidor responda
while true; do
    # Intentar conectar al puerto 443
    if nc -z -w 5 $HOST 443 2>/dev/null; then
        echo ""
        echo "✅ ¡SERVIDOR ONLINE!"
        break
    else
        echo "$(date '+%H:%M:%S') - Servidor aún caído, reintentando en 30s..."
        sleep 30
    fi
done

echo ""
echo "Esperando 10 segundos para que el servidor se estabilice..."
sleep 10

echo ""
echo "========================================"
echo "  SUBIENDO PLUGINS..."
echo "========================================"
echo ""

/usr/bin/expect << EOF
set timeout 120
spawn sftp -o StrictHostKeyChecking=no -o ConnectTimeout=60 -P $PORT $USER@$HOST
expect {
    "password:" {
        send "$PASS\r"
    }
    timeout {
        puts "\n❌ Error: No se pudo conectar al SFTP"
        exit 1
    }
}
expect "sftp>"
send "cd $REMOTE_PATH\r"
expect "sftp>"
puts "\n📦 Subiendo duendes-tito-widget.php..."
send "put $BASE_DIR/wordpress-plugins/duendes-tito-widget.php\r"
expect "sftp>"
puts "\n📦 Subiendo duendes-header-footer-garantizado.php..."
send "put $BASE_DIR/wordpress-plugins/duendes-header-footer-garantizado.php\r"
expect "sftp>"
puts "\n📋 Verificando archivos subidos..."
send "ls -la duendes-tito-widget.php duendes-header-footer-garantizado.php\r"
expect "sftp>"
send "bye\r"
expect eof
EOF

echo ""
echo "========================================"
echo "  ✅ PLUGINS SUBIDOS EXITOSAMENTE"
echo "========================================"
echo ""
echo "Ahora verificá la web: https://duendesdeluruguay.com/tienda/"
echo ""
echo "Si los cambios no se ven, limpiá el caché desde:"
echo "https://my.10web.io/websites/1453202/main"
echo ""
