<?php
declare(strict_types=1);

$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
if ($requestPath === '/index.php') {
    header('Location: /', true, 301);
    exit;
}

// Ensure the homepage always returns crawlable indexing headers.
header('X-Robots-Tag: index, follow', true);
header('Content-Type: text/html; charset=UTF-8');

$indexHtml = __DIR__ . '/index.html';
if (!is_file($indexHtml)) {
    http_response_code(500);
    echo 'Index file not found.';
    exit;
}

readfile($indexHtml);
