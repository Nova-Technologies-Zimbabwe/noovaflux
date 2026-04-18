@echo off
echo ==========================================
echo    Stopping NOVAFLUX System
echo ==========================================
echo.

echo Stopping Node processes...
taskkill /F /IM node.exe 2>nul

echo.
echo ==========================================
echo    System Stopped
echo ==========================================
echo.
pause >nul