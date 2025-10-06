@echo off
title LoTraDW Backend Server
echo LoTraDW Backend Server - Auto Restart
echo =======================================

:start
echo [%TIME%] Starting NestJS Backend...
cd /d "D:\MINHPHUC\LoTraDW-logistics\backend"
npm run start:dev

echo.
echo [%TIME%] Backend stopped! Restarting in 3 seconds...
timeout /t 3 >nul
goto start