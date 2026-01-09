@echo off
echo ============================================
echo    Kennu Portfolio - Local Server Setup
echo ============================================
echo.

echo Checking if PHP is installed...
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PHP is not installed!
    echo.
    echo 📥 Please install PHP first:
    echo 1. Download PHP from: https://windows.php.net/download
    echo 2. Choose: "PHP 8.3 (8.3.x) VC16 x64 Thread Safe"
    echo 3. Extract to C:\php
    echo 4. Add C:\php to your system PATH
    echo 5. Restart command prompt and run this batch file again
    echo.
    pause
    exit /b 1
)

echo ✅ PHP is installed!
echo.
echo 🚀 Starting local server on http://localhost:8000
echo 📧 Contact form will send emails to your Gmail
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
php -S localhost:8000

pause
