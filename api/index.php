<?php
// index.php or any front-controller file
header("Access-Control-Allow-Origin: *"); // or restrict to a specific origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS requests early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simple and reliable autoloader
spl_autoload_register(function ($class) {
    // Convert namespace separators to directory separators
    $file = __DIR__ . '/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require $file;
    }
});

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (preg_match('/^\/courses/', $requestUri)) {
    $controller = new src\Controllers\CourseController();
    $controller->index();
} elseif (preg_match('/^\/categories/', $requestUri)) {
    $controller = new src\Controllers\CategoryController();
    $controller->index();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
}
