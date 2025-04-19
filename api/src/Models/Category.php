<?php

namespace src\Models;

class Category
{
    public int $id;
    public string $name;
    public ?int $parent_id;
    public int $course_count = 0;
}
