<?php
$start = microtime(true);
session_name('token');
header("Access-Control-Allow-Methods: GET, POST, PUT, UPDATE, DELETE, OPTIONS");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Access-Control-Allow-Origin: '. ($_SERVER['HTTP_ORIGIN'] ?? 'http://localhost'));
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once __DIR__ . '/system/Request.php';
require_once __DIR__ . '/system/Response.php';
require_once __DIR__ . '/system/DB.php';
require_once __DIR__ . '/system/QueryBuilder.php';
require_once __DIR__ . '/system/Session.php';
require_once __DIR__ . '/system/ResetLog.php';
require_once __DIR__ . '/system/Route.php';
require_once __DIR__ . '/Dictionaries.php';
require_once __DIR__ . '/Seeder.php';
require_once __DIR__ . '/App.php';

//print microtime(1) - $start . "\n";
Route::dispatch();
