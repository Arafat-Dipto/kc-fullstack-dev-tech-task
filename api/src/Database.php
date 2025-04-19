<?php

namespace src;

use PDO;

class Database
{
    private static ?PDO $connection = null;

    public static function connect(): PDO
    {
        if (self::$connection === null) {
            $host = 'db'; // <--- Docker service name
            $db   = 'course_catalog';
            $user = 'test_user';
            $pass = 'test_password';
            $dsn  = "mysql:host=$host;dbname=$db;charset=utf8mb4";

            self::$connection = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);
        }

        return self::$connection;
    }
}
