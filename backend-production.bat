@echo off
title LoTraDW Backend Production
echo Starting Backend in Production Mode...
cd /d "D:\MINHPHUC\LoTraDW-logistics\backend"

echo Building project...
call npm run build

echo Starting production server...
call npm run start:prod

pause