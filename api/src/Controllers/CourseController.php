<?php

namespace src\Controllers;

use src\Services\CourseService;

class CourseController
{
    public function index(): void
    {
        header('Content-Type: application/json');
        $service = new CourseService();

        if (isset($_GET['category_id'])) {
            echo json_encode($service->getByCategory((int) $_GET['category_id']));
        } else {
            echo json_encode($service->getAll());
        }
    }
}
