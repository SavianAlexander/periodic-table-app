@echo off
echo =========================================
echo    Starting the Periodic Table App...
echo =========================================
echo.
echo Installing dependencies if needed...
call npm install
echo.
echo Launching the application in your browser...
call npm run dev -- --open
pause
