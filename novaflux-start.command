#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=========================================="
echo "   NOVAFLUX - Smart Grid Control System"
echo "=========================================="
echo "Project: $SCRIPT_DIR"
echo ""

# Kill existing processes
pkill -f "node src/index.js" 2>/dev/null
pkill -f "node server.js" 2>/dev/null
sleep 1

echo "[1/3] Starting MCP Backend..."
cd "$SCRIPT_DIR"
node src/index.js > /tmp/novaflux_mcp.log 2>&1 &
sleep 2

echo "[2/3] Starting UI Dashboard..."
cd "$SCRIPT_DIR/novaflux-ui"
node server.js > /tmp/novaflux_ui.log 2>&1 &
sleep 2

echo "[3/3] Opening Dashboard..."
open http://127.0.0.1:8080

echo ""
echo "=========================================="
echo "   System Started!"
echo "=========================================="
echo ""
echo "MCP API:    http://127.0.0.1:3000/api"
echo "Dashboard: http://127.0.0.1:8080"
echo ""
echo "Login: admin@novaflux.com / admin123"