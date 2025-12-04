<?php
/**
 * اختبار بسيط لوظيفة إرسال البريد
 * Simple Mail Function Test
 * 
 * هذا الملف يساعد في اختبار ما إذا كان السيرفر قادراً على إرسال البريد الإلكتروني
 * This file helps test if the server can send emails
 */

// إعداد الترميز
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>اختبار إرسال البريد - Email Test</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        h1 {
            color: #667eea;
            margin-bottom: 20px;
            text-align: center;
        }

        .info-box {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 4px solid #667eea;
        }

        .info-box p {
            margin: 10px 0;
            line-height: 1.6;
        }

        .result {
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            font-weight: bold;
        }

        .success {
            background: #d4edda;
            color: #155724;
            border: 2px solid #c3e6cb;
        }

        .error {
            background: #f8d7da;
            color: #721c24;
            border: 2px solid #f5c6cb;
        }

        .btn {
            display: block;
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .code {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
            margin: 10px 0;
        }

        .badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            font-weight: bold;
            margin-right: 5px;
        }

        .badge-success {
            background: #28a745;
            color: white;
        }

        .badge-error {
            background: #dc3545;
            color: white;
        }

        .badge-info {
            background: #17a2b8;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 اختبار إرسال البريد الإلكتروني</h1>

        <div class="info-box">
            <p><strong>🎯 الهدف:</strong> التحقق من قدرة السيرفر على إرسال البريد الإلكتروني</p>
            <p><strong>📧 البريد المستقبل:</strong> info@arslantech-eg.com</p>
            <p><strong>⏰ التاريخ والوقت:</strong> <?php echo date('Y-m-d H:i:s'); ?></p>
        </div>

        <?php
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            echo '<div class="result-section">';
            
            // معلومات السيرفر
            echo '<div class="info-box">';
            echo '<h3>📊 معلومات السيرفر</h3>';
            echo '<p><span class="badge badge-info">PHP Version:</span> ' . phpversion() . '</p>';
            echo '<p><span class="badge badge-info">Server:</span> ' . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . '</p>';
            echo '<p><span class="badge badge-info">OS:</span> ' . PHP_OS . '</p>';
            
            // التحقق من دالة mail
            if (function_exists('mail')) {
                echo '<p><span class="badge badge-success">✓</span> دالة mail() متوفرة</p>';
            } else {
                echo '<p><span class="badge badge-error">✗</span> دالة mail() غير متوفرة</p>';
            }
            echo '</div>';

            // محاولة إرسال بريد تجريبي
            $to = 'info@arslantech-eg.com';
            $subject = 'رسالة اختبار من نظام النماذج - Test Email from Forms System';
            $message = "هذه رسالة اختبار من نظام النماذج\n";
            $message .= "Test email from Forms System\n\n";
            $message .= "التاريخ والوقت: " . date('Y-m-d H:i:s') . "\n";
            $message .= "Date & Time: " . date('Y-m-d H:i:s') . "\n\n";
            $message .= "Server: " . ($_SERVER['SERVER_NAME'] ?? 'localhost') . "\n";
            $message .= "IP: " . ($_SERVER['SERVER_ADDR'] ?? 'Unknown') . "\n\n";
            $message .= "إذا وصلتك هذه الرسالة، فهذا يعني أن نظام إرسال البريد يعمل بشكل صحيح.\n";
            $message .= "If you received this message, it means the email system is working correctly.\n";

            $headers = [];
            $headers[] = 'MIME-Version: 1.0';
            $headers[] = 'Content-type: text/plain; charset=utf-8';
            $headers[] = 'From: Arslan Tech Test <no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . '>';
            $headers[] = 'X-Mailer: PHP/' . phpversion();

            try {
                $sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $message, implode("\r\n", $headers));
                
                if ($sent) {
                    echo '<div class="result success">';
                    echo '<h2>✅ نجح الإرسال!</h2>';
                    echo '<p>تم إرسال البريد التجريبي بنجاح إلى: <strong>' . $to . '</strong></p>';
                    echo '<p>يرجى التحقق من البريد الوارد أو مجلد السبام (Spam/Junk)</p>';
                    echo '<div class="code">';
                    echo 'البريد المرسل إلى: ' . $to . '<br>';
                    echo 'الموضوع: ' . $subject . '<br>';
                    echo 'الحالة: تم الإرسال';
                    echo '</div>';
                    echo '</div>';
                } else {
                    throw new Exception('فشل إرسال البريد');
                }
            } catch (Exception $e) {
                echo '<div class="result error">';
                echo '<h2>❌ فشل الإرسال</h2>';
                echo '<p>لم يتم إرسال البريد بنجاح.</p>';
                echo '<p><strong>السبب المحتمل:</strong></p>';
                echo '<ul style="margin: 10px 0; padding-right: 20px;">';
                echo '<li>دالة mail() غير مفعلة على السيرفر</li>';
                echo '<li>لا يوجد إعداد SMTP على السيرفر</li>';
                echo '<li>البريد المرسل محظور من Firewall</li>';
                echo '<li>السيرفر لا يسمح بإرسال البريد الخارجي</li>';
                echo '</ul>';
                
                echo '<p><strong>🔧 الحلول المقترحة:</strong></p>';
                echo '<ul style="margin: 10px 0; padding-right: 20px;">';
                echo '<li>استخدام PHPMailer مع SMTP</li>';
                echo '<li>إعداد SendGrid أو Mailgun</li>';
                echo '<li>التواصل مع مزود الاستضافة</li>';
                echo '</ul>';
                echo '</div>';

                // عرض مثال على استخدام PHPMailer
                echo '<div class="info-box">';
                echo '<h3>💡 مثال على استخدام PHPMailer</h3>';
                echo '<div class="code" style="direction: ltr; text-align: left;">';
                echo htmlspecialchars('
// Install PHPMailer
composer require phpmailer/phpmailer

// Use PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host = "smtp.gmail.com";
$mail->SMTPAuth = true;
$mail->Username = "your-email@gmail.com";
$mail->Password = "your-password";
$mail->SMTPSecure = "tls";
$mail->Port = 587;
$mail->CharSet = "UTF-8";

$mail->setFrom("your-email@gmail.com", "Arslan Tech");
$mail->addAddress("info@arslantech-eg.com");
$mail->Subject = "Test Email";
$mail->Body = "Test message";

$mail->send();
                ');
                echo '</div>';
                echo '</div>';
            }

            // معلومات إضافية
            echo '<div class="info-box">';
            echo '<h3>📝 ملاحظات مهمة</h3>';
            echo '<ul style="margin: 10px 0; padding-right: 20px; line-height: 1.8;">';
            echo '<li>على السيرفر المحلي (localhost)، قد لا تعمل دالة mail() بدون إعداد SMTP</li>';
            echo '<li>على السيرفر الحقيقي، تحقق من إعدادات SMTP في php.ini</li>';
            echo '<li>بعض الاستضافات تحظر دالة mail() وتتطلب استخدام SMTP</li>';
            echo '<li>تحقق من مجلد السبام (Spam) إذا لم يصل البريد</li>';
            echo '<li>يمكنك استخدام خدمات مثل SendGrid, Mailgun, أو Amazon SES</li>';
            echo '</ul>';
            echo '</div>';

            echo '</div>';
        }
        ?>

        <form method="POST">
            <button type="submit" class="btn">🚀 إرسال بريد تجريبي</button>
        </form>

        <div class="info-box" style="margin-top: 20px;">
            <p style="text-align: center; color: #666;">
                <small>
                    هذا الملف للاختبار فقط. يمكنك حذفه بعد التأكد من عمل النظام.<br>
                    This file is for testing only. You can delete it after confirming the system works.
                </small>
            </p>
        </div>
    </div>
</body>
</html>
