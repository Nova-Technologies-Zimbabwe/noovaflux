#!/bin/bash

echo "=========================================="
echo "   Stopping NOVAFLUX System"
echo "=========================================="
echo ""

echo "Stopping Node processes..."
pkill -f "node src/index.js" 2>/dev/null
pkill -f "vite preview" 2>/dev/null

echo ""
echo "=========================================="
echo "   System Stopped"
echo "=========================================="
echo ""

read -p "Press Enter to close..."