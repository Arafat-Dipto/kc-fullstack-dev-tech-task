<?php

namespace src\Controllers;

use src\Services\CategoryService;

class CategoryController
{
    public function index(): void
    {
        header('Content-Type: application/json');
        $service = new CategoryService();
        echo json_encode($service->getAllWithCourseCounts());
    }
}
