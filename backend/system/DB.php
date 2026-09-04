<?php

class DB
{
    protected static ?PDO $pdo = null;

    public static function connect(): void {
        $dbFile = __DIR__ . '/../database.sqlite';
        self::$pdo = new PDO('sqlite:' . $dbFile);
        self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    }

    public static function getPdo(): PDO {
        if (self::$pdo === null) {
            self::connect();
        }

        return self::$pdo;
    }

    public static function select(string $query, array $bindings = []): array {
        $stmt = self::getPdo()->prepare($query);
        $stmt->execute($bindings);
        return $stmt->fetchAll();
    }

    public static function statement(string $query, array $bindings = []): bool {
        $stmt = self::getPdo()->prepare($query);
        return $stmt->execute($bindings);
    }

    public static function table(string $table): QueryBuilder {
        return new QueryBuilder($table);
    }
}
