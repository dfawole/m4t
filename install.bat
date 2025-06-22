@echo off
echo Installing M4T Learning Platform...
echo.

echo Installing Node.js dependencies...
call npm install

echo Starting database...
call docker-compose up -d postgres

echo Setting up database...
timeout /t 10 /nobreak >nul
call npm run db:push

echo Starting development server...
call npm run dev

echo.
echo M4T Learning Platform is running!
echo Open http://localhost:3000 in your browser
pause
