// CoursesPage.jsx
import React, { useState } from "react";
import Pagination from "../Common/Pagination";
import Sidebar from "../DashboardComponents/Sidebar";
import DeletedModal from "../Modals/DeletedModal";
import CourseImage from "../../assets/landing page without login/Rectangle 1080.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  categoriesList,
  coursesAtom,
} from "../Jotai/courses/CreateCourseAtoms";
import { useNavigate, useLocation } from "react-router-dom";
import { usePublicAuthChecker } from "../../services/authService";

const CoursesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [coursesByCategory, setCoursesByCategory] = useState([]);
  const [totalPages, setTotalPages] = useState(5); 
  const [categories, setCategories] = useAtom(categoriesList);
  const [coursesList, setCourses] = useAtom(coursesAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn , username} = usePublicAuthChecker();


  const normalize = (str) => str.toLowerCase().replace(/\s+/g, "");
  // reload after update
  useEffect(() => {
    if (location.state && location.state?.reload) {
      fetchCourses();
    }
  }, [location.state]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //call courses
  useEffect(() => {
    fetchCourses();
  }, [setCourses]);

  async function fetchCourses() {
    try {
      const response = await fetch("/api/Courses/GetAllCourses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }
  //call categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/Category/GetAllCategories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, [setCategories]);

  // filter courses with category
  const handleSelectChange = (event) => {
    const selectedId = Number(event.target.value);

    const coursesWithCategoryId = coursesList.filter(
      (course) => course.categoryId === selectedId
    );
    setCoursesByCategory(coursesWithCategoryId);
  };

  const editCourse = (course) => () => {
    navigate("/addCourse", { state: { course } });
  };

  const viewCourse = (course) => () => {
    navigate("/addCourse", { state: { course, isView: true } });
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
            <div>
              <div className="text-sm relative mr-[50rem] mt-2">
                <a href="#" className="text-black-600 hover:text-blue-800">
                  Dashboard
                </a>
                <span className="mx-2 text-gray-400">›</span>
                <span className="text-gray-600">Courses</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="h-9 w-9 grid place-content-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                  />
                </svg>
              </button>

              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-medium">
              {username ? username.charAt(0).toUpperCase() : "G"}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 px-6 py-6 overflow-y-auto">
            {/* Header */}
            <div className="bg-white border rounded-xl px-6 py-4 flex justify-between items-center shadow-sm">
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Courses</h1>
                <nav className="flex text-sm mt-1 text-gray-500">
                  <Link to="/dashboard" className="hover:text-gray-800">
                    Dashboard
                  </Link>
                  <span className="mx-2">›</span>
                  <span className="text-gray-800">Courses</span>
                </nav>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <Link
                  to="/addCourse"
                  className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Add Course
                </Link>

                {/* Category Select */}
                <div className="relative">
                  <select
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    onChange={handleSelectChange}
                  >
                    <option>All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 
                      10.586l3.293-3.293a1 1 0 
                      111.414 1.414l-4 4a1 1 0 
                      01-1.414 0l-4-4a1 1 0 
                      010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for Courses"
                    className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-56"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500 absolute left-[12rem] top-1/2 -translate-y-1/2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 
                      5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchTerm
                ? (coursesByCategory.length
                    ? coursesByCategory
                    : coursesList
                  ).filter((course) =>
                    normalize(course.name).includes(normalize(searchTerm))
                  )
                : coursesByCategory.length
                ? coursesByCategory
                : coursesList
              ).map((course, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-xl p-4 hover:shadow-md transition"
                >
                  <img
                    src={course.imageUrl || CourseImage}
                    alt={course.name || "Course Image"}
                    className="w-full h-36 object-cover rounded-md mb-3"
                  />

                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                    {course.name}
                  </h3>

                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mb-2">
                    {course.categoryName}
                  </span>

                  <p className="text-sm text-gray-600 mb-2">
                    By {course.instructorName}
                  </p>

                  <div className="flex items-center mb-2">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          className={`w-4 h-4 ${
                            i < Math.floor(course.rate)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          aria-hidden="true"
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                    <span>{course.totalHours} hour</span>
                    <span>•</span>
                    <span>{course.totalCourseLectures} Lectures</span>
                    <span>•</span>
                    <span>{course.level}</span>
                  </div>

                  <div className="font-bold text-gray-800 mb-3">
                    {course.cost}$
                  </div>

                  <div className="flex space-x-2 gap-3">
                    <button
                      className="hover:text-blue-700"
                      onClick={viewCourse(course)}
                    >
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5 text-blue-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 
                                 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 
                                 12 5c4.478 0 8.268 2.943 
                                 9.542 7-1.274 4.057-5.064 
                                 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={editCourse(course)}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 
                                 2v11a2 2 0 002 
                                 2h11a2 2 0 002-2v-5m-1.414-5L17 
                                 14.586M18 10a2 2 0 00-2-2h-6l-2-2H6a2 
                                 2 0 00-2 2v10a2 2 0 002 2h10a2 
                                 2 0 002-2v-4l2-2z"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setSelectedCourse(course);
                      }}
                      aria-label="Delete course"
                    >
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 7h14m-9 
                                 3v8m4-8v8M10 
                                 3h4a1 1 0 0 1 
                                 1 1v3H9V4a1 1 
                                 0 0 1 1-1ZM6 
                                 7h12v13a1 1 0 
                                 0 1-1 1H7a1 1 
                                 0 0 1-1-1V7Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal rendered OUTSIDE the button */}
            {showDeleteModal && (
              <DeletedModal
                Name={selectedCourse?.name}
                deletedType="Course"
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={() => {
                  fetchCourses();
                  setShowDeleteModal(false);
                }}
                apiUrlDirection={"Courses/DeleteCourse"}
                itemId={selectedCourse?.id}
              />
            )}

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default CoursesPage;
