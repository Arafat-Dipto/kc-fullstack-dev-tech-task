<?php

namespace src\Services;

use src\Database;
use PDO;

class CategoryService
{
    public function getAllWithCourseCounts(): array
    {
        $pdo = Database::connect();

        // Get category tree with course counts (including child categories)
        $sql = "
            WITH RECURSIVE category_tree AS (
                SELECT id, name, parent_id FROM categories
                UNION ALL
                SELECT c.id, c.name, c.parent_id FROM categories c
                JOIN category_tree ct ON ct.id = c.parent_id
            ),
            course_counts AS (
                SELECT category_id, COUNT(*) as count FROM courses GROUP BY category_id
            )
            SELECT c.id, c.name, c.parent_id,
                IFNULL(SUM(cc.count), 0) AS total_courses
            FROM categories c
            LEFT JOIN category_tree ct ON c.id = ct.id
            LEFT JOIN course_counts cc ON cc.category_id = ct.id
            GROUP BY c.id
        ";

        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}