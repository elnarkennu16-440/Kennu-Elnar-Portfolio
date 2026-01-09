<?php
// Test script to verify PHPMailer setup
echo "<h1>PHPMailer Test</h1>";

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer files - try multiple possible paths
$phpmailer_paths = [
    'C:/PHPMailer/src/Exception.php',
    'C:/PHPMailer-master/src/Exception.php',
    __DIR__ . '/PHPMailer/src/Exception.php',
    __DIR__ . '/../PHPMailer/src/Exception.php'
];

$found_path = null;
foreach ($phpmailer_paths as $path) {
    if (file_exists($path)) {
        $found_path = dirname($path);
        echo "<p>✅ Found PHPMailer at: $found_path</p>";
        break;
    }
}

if (!$found_path) {
    echo "<p>❌ PHPMailer not found in any of these locations:</p>";
    echo "<ul>";
    foreach ($phpmailer_paths as $path) {
        echo "<li>$path</li>";
    }
    echo "</ul>";
    echo "<p>Please download PHPMailer from https://github.com/PHPMailer/PHPMailer and extract it to one of these locations.</p>";
    exit;
}

require $found_path . '/Exception.php';
require $found_path . '/PHPMailer.php';
require $found_path . '/SMTP.php';

echo "<p>✅ PHPMailer loaded successfully</p>";

// Test basic functionality
try {
    $mail = new PHPMailer(true);
    echo "<p>✅ PHPMailer object created</p>";

    // Test SMTP connection (without sending)
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'test@example.com'; // Placeholder
    $mail->Password   = 'test_password'; // Placeholder
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    echo "<p>✅ SMTP settings configured</p>";
    echo "<p>📧 To complete setup:</p>";
    echo "<ol>";
    echo "<li>Get Gmail app password from: Gmail → Security → App passwords</li>";
    echo "<li>Edit send_email_simple.php and replace 'YOUR_APP_PASSWORD_HERE' with your 16-character app password</li>";
    echo "<li>Test the contact form at: http://localhost/MY%20PORTFOLIO/</li>";
    echo "</ol>";

} catch (Exception $e) {
    echo "<p>❌ Error: " . $mail->ErrorInfo . "</p>";
}
?>
