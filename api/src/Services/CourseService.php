<?php

namespace src\Services;

use src\Database;
use PDO;

class CourseService
{
    public function getAll(): array
    {
        $pdo = Database::connect();

        $sql = "
            SELECT courses.*, main_category.name as main_category_name
            FROM courses
            JOIN categories main_category ON main_category.id = courses.category_id
        ";

        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByCategory(int $categoryId): array
    {
        $pdo = Database::connect();

        // Get all subcategories
        $subQuery = "
            WITH RECURSIVE subcategories AS (
                SELECT id FROM categories WHERE id = :id
                UNION ALL
                SELECT c.id FROM categories c
                JOIN subcategories sc ON sc.id = c.parent_id
            )
            SELECT id FROM subcategories
        ";

        $stmt = $pdo->prepare($subQuery);
        $stmt->execute(['id' => $categoryId]);
        $ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

        // Now fetch courses with those category ids
        $in  = implode(',', array_fill(0, count($ids), '?'));
        $sql = "
            SELECT courses.*, categories.name as main_category_name
            FROM courses
            JOIN categories ON categories.id = courses.category_id
            WHERE category_id IN ($in)
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($ids);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}