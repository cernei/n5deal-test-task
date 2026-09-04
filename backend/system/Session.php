<?php

class DatabaseSessionHandler implements SessionHandlerInterface {
    public function open(string $path, string $name): bool {
        return true;
    }

    public function close(): bool {
        return true;
    }

    public function read(string $id): string|false {
        $session = DB::table('sessions')->where('id', $id)->first();
        if ($session) {
            return base64_decode($session['payload']);
        }
        return '';
    }

    public function write(string $id, string $data): bool {
        $payload = base64_encode($data);
        $lastActivity = time();
        $userId = $_SESSION['user_id'] ?? null;
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;

        $exists = DB::table('sessions')->where('id', $id)->first();

        if ($exists) {
            return DB::table('sessions')->where('id', $id)->update([
                'payload' => $payload,
                'last_activity' => $lastActivity,
                'user_id' => $userId,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent
            ]);
        } else {
            return DB::table('sessions')->insert([
                'id' => $id,
                'payload' => $payload,
                'last_activity' => $lastActivity,
                'user_id' => $userId,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent
            ]);
        }
    }

    public function destroy(string $id): bool {
        return DB::table('sessions')->where('id', $id)->delete();
    }

    public function gc(int $max_lifetime): int|false {
        $threshold = time() - $max_lifetime;
        return DB::table('sessions')->where('last_activity', '<', $threshold)->delete() ? 1 : 0;
    }
}
class Session {
    public static function start(): void {
        if (session_status() === PHP_SESSION_NONE) {
            $handler = new DatabaseSessionHandler();
            session_set_save_handler($handler, true);
            session_start();
        }
    }

    public static function put(string $key, mixed $value): void {
        self::start();
        $_SESSION[$key] = $value;
    }

    public static function get(string $key, mixed $default = null): mixed {
        self::start();
        return $_SESSION[$key] ?? $default;
    }

    public static function has(string $key): bool {
        self::start();
        return isset($_SESSION[$key]);
    }

    public static function forget(string $key): void {
        self::start();
        unset($_SESSION[$key]);
    }
}