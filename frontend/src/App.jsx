import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

const API = "http://api.cc.localhost";

export default function App() {
    const [categories, setCategories] = useState([]);
    const [flatCategoryMap, setFlatCategoryMap] = useState({});
    const [allCourses, setAllCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryRes, courseRes] = await Promise.all([
                    axios.get(`${API}/categories`),
                    axios.get(`${API}/courses`),
                ]);

                const courseCounts = calculateCourseCounts(courseRes.data);
                const categoryTree = buildCategoryTree(
                    categoryRes.data,
                    courseCounts
                );
                const flatMap = buildFlatMap(categoryTree);

                setCategories(categoryTree);
                setFlatCategoryMap(flatMap);
                setAllCourses(courseRes.data);
                setFilteredCourses(courseRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Count direct courses per category ID
    const calculateCourseCounts = (courses) => {
        const counts = {};
        courses.forEach((course) => {
            counts[course.category_id] = (counts[course.category_id] || 0) + 1;
        });
        return counts;
    };

    // Builds nested category tree and calculates total_courses recursively
    const buildCategoryTree = (data, courseCounts) => {
        const map = {};
        const roots = [];

        data.forEach((cat) => {
            map[cat.id] = { ...cat, children: [], total_courses: 0 };
        });

        data.forEach((cat) => {
            if (cat.parent_id && map[cat.parent_id]) {
                map[cat.parent_id].children.push(map[cat.id]);
            } else {
                roots.push(map[cat.id]);
            }
        });

        // Recursively sum total_courses
        const calculateTotals = (node) => {
            let total = courseCounts[node.id] || 0;
            node.children.forEach((child) => {
                total += calculateTotals(child);
            });
            node.total_courses = total;
            return total;
        };

        roots.forEach((root) => calculateTotals(root));
        return roots;
    };

    // Flat map for easy category lookup
    const buildFlatMap = (tree) => {
        const map = {};

        const walk = (node) => {
            map[node.id] = node;
            node.children.forEach(walk);
        };

        tree.forEach(walk);
        return map;
    };

    const getAllChildIds = (categoryId) => {
        const ids = [categoryId];
        const collectChildren = (id) => {
            Object.values(flatCategoryMap).forEach((cat) => {
                if (cat.parent_id === id) {
                    ids.push(cat.id);
                    collectChildren(cat.id);
                }
            });
        };
        collectChildren(categoryId);
        return ids;
    };

    const filterCourses = (categoryId) => {
        if (!categoryId) {
            setFilteredCourses(allCourses);
            setActiveCategory(null);
            return;
        }

        setActiveCategory(categoryId);
        const allIds = getAllChildIds(categoryId);
        const filtered = allCourses.filter((course) =>
            allIds.includes(course.category_id)
        );
        setFilteredCourses(filtered);
    };

    const renderCategoryTree = (cats, level = 0) => {
        return cats.map((cat) => (
            <React.Fragment key={cat.id}>
                <li
                    className={`list-group-item ${
                        activeCategory === cat.id ? "active" : ""
                    }`}
                    onClick={() => filterCourses(cat.id)}
                    style={{
                        cursor: "pointer",
                        paddingLeft: `${level * 20 + 10}px`,
                    }}
                >
                    {cat.name} ({cat.total_courses})
                </li>
                {cat.children.length > 0 &&
                    renderCategoryTree(cat.children, level + 1)}
            </React.Fragment>
        ));
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <aside className="col-md-3">
                    <h5 className="mt-4">Categories</h5>
                    <ul className="list-group">
                        <li
                            className={`list-group-item ${
                                activeCategory === null ? "active" : ""
                            }`}
                            onClick={() => filterCourses(null)}
                            style={{ cursor: "pointer" }}
                        >
                            All Categories
                        </li>
                        {renderCategoryTree(categories)}
                    </ul>
                </aside>

                <main className="col-md-9">
                    <h1 className="my-4">
                        {activeCategory ? "Filtered Courses" : "Course Catalog"}
                    </h1>
                    <div className="row">
                        {filteredCourses.map((course) => (
                            <div
                                className="col-lg-4 col-md-12 mb-4"
                                key={course.id}
                            >
                                <div className="card h-100">
                                    <img
                                        src={course.image_preview}
                                        className="card-img-top"
                                        alt="course"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {course.title}
                                        </h5>
                                        <p className="card-text">
                                            {course.description.slice(0, 80)}...
                                        </p>
                                        <span className="badge bg-secondary">
                                            {course.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
