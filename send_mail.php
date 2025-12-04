<?php
// إعداد الجلسة
session_start();

// إعداد ترميز UTF-8
header('Content-Type: application/json; charset=utf-8');

// السماح فقط بطلبات POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// التحقق من رمز CSRF
if (empty($_POST['csrf_token']) || empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Invalid CSRF token']);
    exit;
}

// Honeypot (basic spam protection)
if (!empty($_POST['website'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Spam detected']);
    exit;
}

// دالة تنظيف المدخلات
function clean($key) {
    return isset($_POST[$key]) ? trim(strip_tags($_POST[$key])) : '';
}

// استلام البيانات المشتركة
$formType = clean('form_type');
$email    = clean('email');
$phone    = clean('phone');

// التحقق من البريد الإلكتروني
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'البريد الإلكتروني غير صحيح أو مفقود']);
    exit;
}

// إعداد المتغيرات حسب نوع النموذج
$subject = '';
$bodyLines = [];
$to = 'info@arslantech-eg.com'; // البريد الموحد لجميع النماذج

switch ($formType) {
    case 'contact':
        $firstName = clean('firstName');
        $lastName  = clean('lastName');
        $fullName  = trim($firstName . ' ' . $lastName);
        $message   = clean('message');

        if (empty($message)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'نص الرسالة مطلوب']);
            exit;
        }

        $subject = 'رسالة جديدة من نموذج التواصل (Contact Us)';
        $bodyLines = [
            "نوع النموذج: تواصل معنا",
            "الاسم: " . ($fullName ?: 'غير مذكور'),
            "البريد الإلكتروني: " . $email,
            "رقم الهاتف: " . ($phone ?: 'غير مذكور'),
            "",
            "نص الرسالة:",
            $message
        ];
        break;

    case 'sales':
        $name    = clean('name');
        $company = clean('company');
        $product = clean('product');
        $message = clean('message');

        if (empty($name) || empty($product) || empty($message)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'البيانات الأساسية مطلوبة']);
            exit;
        }

        $productMap = [
            'attendance' => 'أجهزة الحضور والانصراف',
            'computers'  => 'أجهزة الكمبيوتر واللاب توب',
            'printers'   => 'الطابعات',
            'pbx'        => 'أجهزة السنترالات',
            'callcenter' => 'أجهزة الكول سنتر',
            'servers'    => 'أجهزة السيرفرات',
            'racks'      => 'راكات وباتش بانل',
            'network'    => 'أجهزة الشبكات',
            'cctv'       => 'كاميرات المراقبة'
        ];
        $productLabel = isset($productMap[$product]) ? $productMap[$product] : $product;

        $subject = 'طلب عرض أسعار جديد (Sales Request)';
        $bodyLines = [
            "نوع النموذج: طلب مبيعات",
            "الاسم: " . $name,
            "الشركة: " . ($company ?: 'غير مذكور'),
            "البريد الإلكتروني: " . $email,
            "رقم الهاتف: " . ($phone ?: 'غير مذكور'),
            "المنتج المطلوب: " . $productLabel,
            "",
            "التفاصيل:",
            $message
        ];
        break;

    case 'academy':
        $name  = clean('name');
        $track = clean('track');
        $mode  = clean('mode');
        $notes = clean('notes');

        if (empty($name) || empty($track) || empty($mode)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'البيانات الأساسية مطلوبة']);
            exit;
        }

        $trackMap = [
            'it'      => 'خدمات الـ IT',
            'network' => 'الشبكات',
            'low'     => 'التيار الخفيف'
        ];
        $modeMap = [
            'offline' => 'حضوري',
            'online'  => 'أونلاين مباشر'
        ];

        $trackLabel = isset($trackMap[$track]) ? $trackMap[$track] : $track;
        $modeLabel  = isset($modeMap[$mode]) ? $modeMap[$mode] : $mode;

        $subject = 'تسجيل جديد في الأكاديمية (Academy Registration)';
        $bodyLines = [
            "نوع النموذج: تسجيل أكاديمية",
            "الاسم: " . $name,
            "البريد الإلكتروني: " . $email,
            "رقم الهاتف: " . ($phone ?: 'غير مذكور'),
            "المسار التدريبي: " . $trackLabel,
            "نظام الدراسة: " . $modeLabel,
            "",
            "ملاحظات إضافية:",
            ($notes ?: 'لا يوجد')
        ];
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'نوع النموذج غير معروف']);
        exit;
}

// تجميع نص الرسالة
$body = implode("\n", $bodyLines);

// إعداد الترويسات
$headers   = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/plain; charset=utf-8';
$headers[] = 'From: Arslan Tech Website <no-reply@' . $_SERVER['SERVER_NAME'] . '>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'X-Mailer: PHP/' . phpversion();

// إرسال البريد
$success = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if ($success) {
    echo json_encode(['success' => true, 'message' => 'تم الإرسال بنجاح']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'فشل إرسال البريد من الخادم']);
}
