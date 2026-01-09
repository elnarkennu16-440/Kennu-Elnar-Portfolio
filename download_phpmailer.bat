@echo off
echo ============================================
echo    Downloading PHPMailer for Email Setup
echo ============================================
echo.

cd /d "%~dp0"

echo 📥 Creating PHPMailer directory...
if not exist "PHPMailer" mkdir PHPMailer
cd PHPMailer

echo 📥 Downloading PHPMailer...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/PHPMailer/PHPMailer/archive/master.zip' -OutFile 'master.zip'"

echo 📦 Extracting PHPMailer...
powershell -Command "Expand-Archive -Path 'master.zip' -DestinationPath '.' -Force"

echo 📁 Moving files...
move "PHPMailer-master\*" "." >nul 2>&1
rmdir "PHPMailer-master" /s /q
del "master.zip"

echo ✅ PHPMailer downloaded successfully!
echo.
echo 🔧 Next steps:
echo 1. Set up your Gmail app password
echo 2. Edit send_email_smtp.php with your credentials
echo 3. Test the contact form
echo.
pause
