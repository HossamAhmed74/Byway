import React, { useState, useEffect } from "react";
import Header from "../MainComponents/HeaderWithLogin";
import Footer from "../MainComponents/Footer";
import {
  categoriesList,
  coursesAtom,
  filtrationAtom,
} from "../Jotai/courses/CreateCourseAtoms";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";

const DesignCourses = () => {
  const [selectedLectures, setSelectedLectures] = useState("");
  const [priceRange, setPriceRange] = useState([0, 980]);
  const [sortBy, setSortBy] = useState("latest");
  const [courses, setCourses] = useAtom(coursesAtom);
  const [categories, setCategories] = useAtom(categoriesList);
  const [checkedCategories, setCheckedCategory] = useState([]);
  const [currentRate, setCurrentRate] = useState(0);
  const [filtration, setFiltration] = useAtom(filtrationAtom);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [maxPrice, setMaxPrice] = useState(980);
  const navigate = useNavigate();

  const openCourseDetail = (course) => {
    const topCourses = courses.sort((a, b) => b.rating - a.rating).slice(0, 4);
    navigate(`/courseDetails`, { state: { course, topCourses } });
  };

  // Fixed filter logic
  useEffect(() => {
    if (!courses || courses.length === 0) {
      setFilteredCourses([]);
      return;
    }

    const newFiltration = {
      categories: checkedCategories.map(c => c.id),
      lecturesNumber: selectedLectures,
      priceRange: priceRange,
      rating: currentRate,
    };
    setFiltration(newFiltration);

    let filtered = [...courses].filter(course => {
      // Category filter
      const inCategory =
        checkedCategories.length === 0 ||
        checkedCategories.some(c => Number(c.id) === Number(course.categoryId));

      // Price filter
      const inPriceRange =
        course.cost >= priceRange[0] && course.cost <= priceRange[1];

      // Rating filter
      const meetsRating = currentRate === 0 || course.rate >= currentRate;

      // Lecture number filter
      let meetsLectureNumber = true;
      if (selectedLectures && selectedLectures.trim() !== "") {
        if (selectedLectures === "More than 45") {
          meetsLectureNumber = course.totalCourseLectures > 45;
        } else {
          const [min, max] = selectedLectures.split("-").map(Number);
          meetsLectureNumber =
            course.totalCourseLectures >= min &&
            course.totalCourseLectures <= max;
        }
      }

      return inCategory && inPriceRange && meetsRating && meetsLectureNumber;
    });

    // Apply sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.cost - b.cost);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.cost - a.cost);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rate - a.rate);
    } else if (sortBy === "latest") {
      // Assuming courses have an 'id' field that increases with time
      if (filtered.length > 0 && filtered[0].id !== undefined) {
        filtered.sort((a, b) => b.id - a.id);
      }
    }

    setFilteredCourses(filtered);
  }, [checkedCategories, selectedLectures, priceRange, currentRate, courses, sortBy, setFiltration]);

  const handleRateClick = (rating) => {
    setCurrentRate((prev) => (prev === rating ? 0 : rating));
  };

  // Fetch courses
  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/Courses/GetAllCourses");
        const data = await response.json();
        setCourses(data);
        if (data.length > 0) {
          const max = Math.max(...data.map(c => c.cost));
          setMaxPrice(max);
          setPriceRange([0, max]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchCourses();
  }, [setCourses]);

  // Fetch categories
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

  return (
    <>
      <Header />
      <div className="p-6 bg-white min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Design Courses
          </h1>
          <p className="text-lg text-gray-600 mt-2">All Development Courses</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <button className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center hover:bg-gray-50 transition-colors">
            Filter
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-64 bg-white p-4 rounded-lg shadow-sm">
            {/* Rating */}
            <div>
              <input type="hidden" value={currentRate} />
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate
              </label>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isSelected = star <= currentRate;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRateClick(star)}
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isSelected ? "text-yellow-400" : "text-gray-300"
                      } hover:text-yellow-300`}
                    >
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                        className="w-full h-full"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Number of Lectures */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">
                Number of Lectures
              </h3>
              <div className="space-y-2">
                {["1-15", "16-30", "31-45", "More than 45"].map((range) => (
                  <div key={range} className="flex items-center">
                    <input
                      type="radio"
                      id={`lectures-${range}`}
                      name="lectures"
                      checked={selectedLectures === range}
                      onChange={() => setSelectedLectures(range)}
                      className="accent-blue-500 mr-2"
                    />
                    <label
                      htmlFor={`lectures-${range}`}
                      className="text-sm text-gray-700"
                    >
                      {range}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Price</h3>
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 accent-blue-500 rounded-lg cursor-pointer"
              />
            </div>

            {/* Category */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Category</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="accent-blue-500 mr-2"
                      checked={checkedCategories.some((c) => c.id === cat.id)}
                      onChange={() => {
                        if (checkedCategories.some((c) => c.id === cat.id)) {
                          setCheckedCategory(
                            checkedCategories.filter((c) => c.id !== cat.id)
                          );
                        } else {
                          setCheckedCategory([...checkedCategories, cat]);
                        }
                      }}
                    />
                    <label className="text-sm text-gray-700">{cat.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(filteredCourses.length > 0 ? filteredCourses : courses).map(
                (course, index) => (
                  <div
                    key={index}
                    onClick={() => openCourseDetail(course)}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {course.categoryName}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {course.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        By {course.instructorName}
                      </p>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(course.rate)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        {course.totalHours} Total Hours.{" "}
                        {course.totalCourseLectures} Lectures. {course.level}
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        ${course.cost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DesignCourses;