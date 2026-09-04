<?php
// Simple Serverless PHP Backend (Single-File Router Pattern with CamelCase fields)

$dbFile = __DIR__ . '/database.sqlite';
$pdo = new PDO('sqlite:' . $dbFile);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
// Helper for JSON responses
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Helper to get request body
function getBody() {
    return json_decode(file_get_contents('php://input'), true) ?? $_POST;
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Access-Control-Allow-Origin: '. ($_SERVER['HTTP_ORIGIN'] ?? 'http://localhost'));

//echo 'coockie';
//print_r($_COOKIE);

if ($method === 'OPTIONS') {

    jsonResponse([], $status = 200);
}

session_start();
file_put_contents('log.txt', $path . ' '. print_r($_COOKIE, 1). "\n" , FILE_APPEND);

// Routing
if ($path === '/reset' ) {
    $pdo->exec("DROP TABLE IF EXISTS assets");
    $pdo->exec("DROP TABLE IF EXISTS users");

    $pdo->exec("CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        role TEXT DEFAULT 'user'
    )");

    $pdo->exec("CREATE TABLE assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        country TEXT,
        typeOfLicense TEXT,
        typeOfBusiness TEXT,
        businessStatus TEXT,
        askingPrice REAL,
        assetType TEXT,
        employees INTEGER,
        yearOfIssue INTEGER,
        regulatory TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )");

    $roles = [
        'BUYER' => 'Buyer',
        'SELLER' => 'Seller',
        'PLATFORM_MANAGER' => 'Platform Manager'
    ];

    // Seed Users
    $users = [
        [
            'email' => 'buyer@example.com',
            'password' => password_hash('password123', PASSWORD_BCRYPT),
            'firstName' => 'John',
            'lastName' => 'Doe',
            'role' => $roles['BUYER']
        ],
        [
            'email' => 'seller@example.com',
            'password' => password_hash('password123', PASSWORD_BCRYPT),
            'firstName' => 'Jane',
            'lastName' => 'Smith',
            'role' => $roles['SELLER']
        ],
        [
            'email' => 'manager@example.com',
            'password' => password_hash('password123', PASSWORD_BCRYPT),
            'firstName' => 'Admin',
            'lastName' => 'User',
            'role' => $roles['PLATFORM_MANAGER']
        ]
    ];

    $stmtUser = $pdo->prepare("INSERT OR IGNORE INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)");
    foreach ($users as $user) {
        $stmtUser->execute([
            $user['email'],
            $user['password'],
            $user['firstName'],
            $user['lastName'],
            $user['role']
        ]);
    }

    // Seed Assets
    $assets = [
        [
            'user_id' => 2,
            'country' => 'United States',
            'typeOfLicense' => 'Fintech',
            'typeOfBusiness' => 'Payment Gateway',
            'businessStatus' => 'Active',
            'askingPrice' => 250000.00,
            'assetType' => 'Company',
            'employees' => 12,
            'yearOfIssue' => 2021,
            'regulatory' => 'SEC'
        ],
        [
            'user_id' => 2,
            'country' => 'Malta',
            'typeOfLicense' => 'Gaming',
            'typeOfBusiness' => 'Online Casino',
            'businessStatus' => 'Pre-operational',
            'askingPrice' => 120000.00,
            'assetType' => 'License',
            'employees' => 4,
            'yearOfIssue' => 2023,
            'regulatory' => 'MGA'
        ]
    ];

    $stmtAsset = $pdo->prepare("INSERT INTO assets (user_id, country, typeOfLicense, typeOfBusiness, businessStatus, askingPrice, assetType, employees, yearOfIssue, regulatory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($assets as $asset) {
        $stmtAsset->execute([
            $asset['user_id'] ?? null,
            $asset['country'],
            $asset['typeOfLicense'],
            $asset['typeOfBusiness'],
            $asset['businessStatus'],
            $asset['askingPrice'],
            $asset['assetType'],
            $asset['employees'],
            $asset['yearOfIssue'],
            $asset['regulatory']
        ]);
    }
    jsonResponse(['message' => 'Database reset and tables created successfully.']);
}

if ($path === '/register' && $method === 'POST') {
    $body = getBody();
    $email = $body['email'] ?? '';
    $password = $body['password'] ?? '';
    $firstName = $body['firstName'] ?? '';
    $lastName = $body['lastName'] ?? '';
    $role = $body['role'] ?? 'user';

    if (!$email || !$password) {
        jsonResponse(['error' => 'Email and password are required.'], 400);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);

    try {
        $stmt = $pdo->prepare("INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$email, $hash, $firstName, $lastName, $role]);
        jsonResponse(['message' => 'User registered successfully.']);
    } catch (PDOException $e) {
        jsonResponse(['error' => 'User already exists or database error.'], 400);
    }
}

if ($path === '/login' && $method === 'POST') {
    $body = getBody();
    $email = $body['email'] ?? '';
    $password = $body['password'] ?? '';
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    file_put_contents('log.txt', print_r($user, 1) . "\n" , FILE_APPEND);

    if ($user && password_verify($password, $user['password'])) {
        // Initialize the session and store user details securely on the server
        $_SESSION['email'] = $user['email'];
        $_SESSION['user_id'] = $user['id'];

        unset($user['password']);
        jsonResponse(['message' => 'Login successful', 'user' => $user]);
    }

    jsonResponse(['error' => 'Invalid email or password.'], 401);
}

if ($path === '/logout' && $method === 'GET') {
    // End the current session and invalidate the client-side session cookie.
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $cookieParams = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $cookieParams['path'],
            $cookieParams['domain'],
            $cookieParams['secure'],
            $cookieParams['httponly']
        );
    }

    session_destroy();
    jsonResponse(['message' => 'Logout successful']);
}

if ($path === '/my-assets' || preg_match('#^/my-assets/(\d+)$#', $path, $matches)) {
    // Basic authentication / user session check
    file_put_contents('log.txt', 'session ' . print_r($_SESSION, true) . "\n" , FILE_APPEND);
    if (empty($_SESSION['user_id'])) {
        jsonResponse(['message' => 'Unauthenticated'], 401);
    }

    $userId = $_SESSION['user_id'];

    $assetId = $matches[1] ?? null;

    // Handle single-item operations (PUT / DELETE / GET single)
    if ($assetId) {
        if ($method === 'GET') {
            $stmt = $pdo->prepare("SELECT * FROM assets WHERE id = ? AND user_id = ?");
            $stmt->execute([$assetId, $userId]);
            $asset = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$asset) {
                jsonResponse(['message' => 'Asset not found'], 404);
            }
            jsonResponse($asset);
        }

        if ($method === 'PUT' || $method === 'PATCH') {
            // Verify ownership first
            $stmt = $pdo->prepare("SELECT id FROM assets WHERE id = ? AND user_id = ?");
            $stmt->execute([$assetId, $userId]);
            if (!$stmt->fetch()) {
                jsonResponse(['message' => 'Asset not found or unauthorized'], 404);
            }

            $body = getBody();
            $stmt = $pdo->prepare("
                UPDATE assets 
                SET country = ?, typeOfLicense = ?, typeOfBusiness = ?, businessStatus = ?, askingPrice = ?, assetType = ?, employees = ?, yearOfIssue = ?, regulatory = ?
                WHERE id = ? AND user_id = ?
            ");
            $stmt->execute([
                $body['country'] ?? null,
                $body['typeOfLicense'] ?? null,
                $body['typeOfBusiness'] ?? null,
                $body['businessStatus'] ?? null,
                $body['askingPrice'] ?? null,
                $body['assetType'] ?? null,
                $body['employees'] ?? null,
                $body['yearOfIssue'] ?? null,
                $body['regulatory'] ?? null,
                $assetId,
                $userId
            ]);

            jsonResponse(['message' => 'Asset updated successfully']);
        }

        if ($method === 'DELETE') {
            $stmt = $pdo->prepare("DELETE FROM assets WHERE id = ? AND user_id = ?");
            $stmt->execute([$assetId, $userId]);

            if ($stmt->rowCount() === 0) {
                jsonResponse(['message' => 'Asset not found or unauthorized'], 404);
            }

            jsonResponse(['message' => 'Asset deleted successfully']);
        }

        jsonResponse(['message' => 'Method not allowed'], 405);
    }

    // Handle collection-level operations (/my-assets)
    if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT * FROM assets WHERE user_id = ?");
        $stmt->execute([$userId]);
        $assets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse($assets);
    }

    if ($method === 'POST') {
        $body = getBody();
        $stmt = $pdo->prepare("INSERT INTO assets (user_id, country, typeOfLicense, typeOfBusiness, businessStatus, askingPrice, assetType, employees, yearOfIssue, regulatory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $userId, // Always enforce the session user_id for security
            $body['country'] ?? null,
            $body['typeOfLicense'] ?? null,
            $body['typeOfBusiness'] ?? null,
            $body['businessStatus'] ?? null,
            $body['askingPrice'] ?? null,
            $body['assetType'] ?? null,
            $body['employees'] ?? null,
            $body['yearOfIssue'] ?? null,
            $body['regulatory'] ?? null
        ]);
        jsonResponse(['message' => 'Asset created successfully', 'id' => $pdo->lastInsertId()], 201);
    }

    jsonResponse(['message' => 'Method not allowed'], 405);
}

if ($path === '/assets') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM assets");
        jsonResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}

jsonResponse(['error' => 'Endpoint not found'], 404);