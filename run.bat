@echo off
title LoTraDW Dev
echo LoTraDW Logistics - Starting...
start "Backend" cmd /k "cd backend && npm run start:dev"
start "Frontend" cmd /k "npm run dev"
echo Check opened windows for servers