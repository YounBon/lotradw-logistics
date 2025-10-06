@echo off
title LoTraDW Logistics - Development Environment
color 0A

echo.
echo ================================================
echo   LoTraDW Logistics - Development Startup  
echo ================================================
echo.

REM Kill any existing processes on ports 3000 and 3001
echo Stopping any existing servers...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Starting development servers...
echo   Backend (NestJS):   http://localhost:3001
echo   Frontend (Next.js): http://localhost:3000
echo.

REM Start backend in new window
echo Starting Backend (NestJS)...
start "LoTraDW-Backend" cmd /c "cd backend && npm run start:dev && pause"

REM Wait a bit then start frontend
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend (Next.js)...
start "LoTraDW-Frontend" cmd /c "npm run frontend:dev && pause"

echo.
echo ================================
echo Both servers are starting!
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo ================================
echo.
echo Check the opened windows for server status.
echo Close this window when done.
pause