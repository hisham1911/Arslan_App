<?php
// إعداد الجلسة
session_start();

header('X-Robots-Tag: noindex, nofollow', true);

// إعداد الترويسات
header('Content-Type: application/json; charset=utf-8');

// توليد رمز CSRF إذا لم يكن موجوداً
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// إرجاع الرمز
echo json_encode(['csrf_token' => $_SESSION['csrf_token']]);
