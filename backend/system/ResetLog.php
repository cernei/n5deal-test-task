<?php

class ResetLog {
    public static function reset(): void
    {
        Db::statement('DROP TABLE IF EXISTS `sessions`;');
        Db::statement('CREATE TABLE sessions (
            id VARCHAR(255) NOT NULL PRIMARY KEY,
            user_id BIGINT NULL,
            ip_address VARCHAR(45) NULL,
            user_agent TEXT NULL,
            payload LONGTEXT NOT NULL,
            last_activity INT NOT NULL
        );');
    }
}