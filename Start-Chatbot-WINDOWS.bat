@echo off
REM ============================================================
REM  Sreeja's AI Chatbot - One-click start (Windows)
REM  Just double-click this file. First run takes a minute.
REM ============================================================
cd /d "%~dp0"

echo.
echo   Starting Sreeja's AI Chatbot...
echo   ----------------------------------------------------

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   [X] Node.js is not installed.
  echo       Please install it ^(free^) from:  https://nodejs.org
  echo       Download the "LTS" version, install it, then run this again.
  echo.
  pause
  exit /b 1
)

echo   Installing pieces ^(first time only, please wait^)...
pushd backend
call npm install
popd
pushd frontend
call npm install
popd

echo   Launching...
start "Chatbot Backend"  cmd /k "cd backend && npm run dev"
start "Chatbot Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo   Ready! Opening the chatbot in your browser...
echo   If it doesn't open, go to:  http://localhost:5173
timeout /t 6 >nul
start http://localhost:5173

echo.
echo   To STOP the chatbot, close the two black command windows that opened.
pause
