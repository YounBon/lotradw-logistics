@echo off
cd /d "%~dp0"
echo LoTraDW Logistics - Starting Stable Servers
echo ===========================================

REM Start backend with auto-restart
start "Backend-Stable" cmd /k "call backend-auto-restart.bat"

REM Wait for backend to initialize  
timeout /t 3 >nul

REM Start frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo Backend: Auto-restart enabled (stable)
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo.
echo Both servers started with stability features!
exit