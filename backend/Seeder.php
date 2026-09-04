<?php

class Seeder {
    public static function run(): void
    {
        Db::statement('DROP TABLE IF EXISTS `users`;');
        Db::statement('DROP TABLE IF EXISTS `assets`;');
        Db::statement('CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            role TEXT DEFAULT `user`
        );');
        Db::statement('CREATE TABLE assets (
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
        );');

          $assets = [
            [
                'user_id' => 2,
                'country' => 'United States',
                'typeOfLicense' => 'BCRA PSP Registration (Registro PSP)',
                'typeOfBusiness' => 'Bank',
                'businessStatus' => 'Active',
                'askingPrice' => 1.00,
                'assetType' => 'License only',
                'employees' => 12,
                'yearOfIssue' => 2021,
                'regulatory' => 'SEC'
            ],
            [
                'user_id' => 2,
                'country' => 'Argentina',
                'typeOfLicense' => 'Banking license (BL)',
                'typeOfBusiness' => 'Fintech',
                'businessStatus' => 'Active',
                'askingPrice' => 120000.00,
                'assetType' => 'License only',
                'employees' => 4,
                'yearOfIssue' => 2018,
                'regulatory' => 'MGA'
            ],
            [
                'user_id' => 2,
                'country' => 'UK',
                'typeOfLicense' => 'Digital Asset Exchange (DAE)',
                'typeOfBusiness' => 'Gambling',
                'businessStatus' => 'Active',
                'askingPrice' => 620000.00,
                'assetType' => 'Fintech business',
                'employees' => 20,
                'yearOfIssue' => 2025,
                'regulatory' => 'MGA'
            ],
            [
                'user_id' => 2,
                'country' => 'Malta',
                'typeOfLicense' => 'PSAV Registration (CNV)',
                'typeOfBusiness' => 'Forex',
                'businessStatus' => 'Not Active',
                'askingPrice' => 1500000.00,
                'assetType' => 'Active business',
                'employees' => 100,
                'yearOfIssue' => 2022,
                'regulatory' => 'MGA'
            ],
            [
                'user_id' => 2,
                'country' => 'Serbia',
                'typeOfLicense' => 'PSAV Registration (CNV)',
                'typeOfBusiness' => 'Crowdfunding',
                'businessStatus' => 'Not Active',
                'askingPrice' => 350000.00,
                'assetType' => 'Active business',
                'employees' => 20,
                'yearOfIssue' => 2020,
                'regulatory' => 'MGA'
            ]

        ];
        foreach ($assets as $asset) {
            Db::table('assets')->insert($asset);
        }
        $users = [
            [
                'email' => 'buyer@example.com',
                'password' => password_hash('n5dealpass', PASSWORD_BCRYPT),
                'firstName' => 'John',
                'lastName' => 'Doe',
                'role' => 'Buyer'
            ],
            [
                'email' => 'seller@example.com',
                'password' => password_hash('n5dealpass', PASSWORD_BCRYPT),
                'firstName' => 'Jane',
                'lastName' => 'Smith',
                'role' => 'Seller'
            ],
            [
                'email' => 'manager@example.com',
                'password' => password_hash('n5dealpass', PASSWORD_BCRYPT),
                'firstName' => 'Admin',
                'lastName' => 'User',
                'role' => 'Platform manager'
            ]
        ];

        foreach ($users as $user) {
            Db::table('users')->insert($user);
        }
    }
}
