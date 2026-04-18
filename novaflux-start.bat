@echo off
echo ==========================================
echo    NOVAFLUX - Smart Grid Control System
echo ==========================================
echo.

cd /d "%~dp0NOVAFLUX_Command_Engine"

echo [1/3] Starting MCP Backend...
start "MCP Backend" cmd /k "node src\index.js"

timeout /t 2 /nobreak >nul

echo [2/3] Starting UI Server...
cd novaflux-ui
start "NOVAFLUX UI" cmd /k "npm run preview -- --host 0.0.0.0 --port 4173"

timeout /t 3 /nobreak >nul

echo [3/3] Opening Dashboard...
start http://127.0.0.1:4173

echo.
echo ==========================================
echo    System Started Successfully!
echo ==========================================
echo.
echo MCP API:    http://127.0.0.1:3000
echo UI Dashboard: http://127.0.0.1:4173
echo.
echo Login with: admin@novaflux.com / admin123
echo.
echo Press any key to close this window...
pause >nul