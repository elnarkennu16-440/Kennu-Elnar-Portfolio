<?php
// Debug mode - enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer files - try multiple possible paths
$phpmailer_paths = [
    'C:/PHPMailer/src/Exception.php',
    'C:/PHPMailer-master/src/Exception.php',
    'C:/PHPMailer/Exception.php',
    'C:/PHPMailer/PHPMailer.php',
    'C:/PHPMailer/SMTP.php',
    __DIR__ . '/PHPMailer/src/Exception.php',
    __DIR__ . '/../PHPMailer/src/Exception.php'
];

$found_path = null;
foreach ($phpmailer_paths as $path) {
    if (file_exists($path)) {
        $found_path = dirname($path);
        break;
    }
}

if (!$found_path) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'PHPMailer not found. Please ensure PHPMailer is installed in C:/PHPMailer/']);
    exit;
}

require $found_path . '/Exception.php';
require $found_path . '/PHPMailer.php';
require $found_path . '/SMTP.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate required fields
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Create HTML email with dark red and white design
$email_body = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Contact Message</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #8B0000; font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #8B0000; padding: 20px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h1 style="color: #8B0000; text-align: center; margin-bottom: 30px; font-size: 24px; margin-top: 0;">New Contact Message</h1>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #8B0000; margin-bottom: 5px; margin-top: 0;">From:</h3>
                <p style="color: #333; margin: 0; font-size: 16px; font-weight: bold;">' . htmlspecialchars($name) . '</p>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #8B0000; margin-bottom: 5px;">Email:</h3>
                <p style="color: #333; margin: 0; font-size: 16px;">
                    <a href="mailto:' . htmlspecialchars($email) . '" style="color: #8B0000; text-decoration: none;">' . htmlspecialchars($email) . '</a>
                </p>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #8B0000; margin-bottom: 5px;">Message:</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #8B0000;">
                    <p style="color: #333; margin: 0; white-space: pre-wrap; word-wrap: break-word;">' . htmlspecialchars($message) . '</p>
                </div>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px; margin: 0;">This message was sent from your portfolio contact form</p>
                <p style="color: #666; font-size: 12px; margin: 5px 0 0 0;">Received on: ' . date('F j, Y \a\t g:i A') . '</p>
            </div>
        </div>
    </div>
</body>
</html>';

try {
    $mail = new PHPMailer(true);

    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'elnarkennu16@gmail.com'; // Your Gmail
    $mail->Password   = 'YOUR_APP_PASSWORD_HERE'; // Replace with your app password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Recipients
    $mail->setFrom('elnarkennu16@gmail.com', 'Kennu Portfolio');
    $mail->addAddress('elnarkennu16@gmail.com', 'Kennu');

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Message from ' . $name;
    $mail->Body    = $email_body;
    $mail->AltBody = "New message from: $name\nEmail: $email\n\n$message";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Message could not be sent. Please check your Gmail app password.',
        'error' => $mail->ErrorInfo
    ]);
}
?>
