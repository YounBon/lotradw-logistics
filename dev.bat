@echo off
echo Starting LoTraDW Logistics Development Environment...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.

REM Start backend from backend directory
start "LoTraDW-Backend" cmd /k "cd /d D:\MINHPHUC\LoTraDW-logistics\backend && npm run start:dev"

REM Wait 2 seconds
timeout /t 2 >nul

REM Start frontend from root directory using original script
start "LoTraDW-Frontend" cmd /k "cd /d D:\MINHPHUC\LoTraDW-logistics && npm run dev"

echo Both servers are starting in separate windows...
echo Close this window when done.