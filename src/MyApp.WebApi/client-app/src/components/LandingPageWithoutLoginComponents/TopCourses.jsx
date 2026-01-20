import React from "react";
import MainPic from "../../assets/landing page without login/Rectangle 1080.png";
const courses = [
  {
    id: 1,
    title: "Beginner's Guide to Design",
    instructor: "Ronald Richards",
    category: "UI/UX Design",
    image: "https://via.placeholder.com/300x180", // Replace with real img
    rating: 5,
    hours: 22,
    lectures: 155,
    level: "Beginner",
    price: 45.0,
  },
  {
    id: 2,
    title: "Beginner's Guide to Design",
    instructor: "Ronald Richards",
    category: "UI/UX Design",
    image: "https://via.placeholder.com/300x180",
    rating: 5,
    hours: 22,
    lectures: 155,
    level: "Beginner",
    price: 45.0,
  },
  {
    id: 3,
    title: "Beginner's Guide to Design",
    instructor: "Ronald Richards",
    category: "UI/UX Design",
    image: "https://via.placeholder.com/300x180",
    rating: 5,
    hours: 22,
    lectures: 155,
    level: "Beginner",
    price: 45.0,
  },
  {
    id: 4,
    title: "Beginner's Guide to Design",
    instructor: "Ronald Richards",
    category: "UI/UX Design",
    image: "https://via.placeholder.com/300x180",
    rating: 5,
    hours: 22,
    lectures: 155,
    level: "Beginner",
    price: 45.0,
  },
];

export default function TopCourses() {
  return (
    <section className="max-w-7xl mx-auto px-4">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Top Courses</h2>
        <a
          href="#"
          className="text-blue-600 text-sm hover:underline font-medium"
        >
          See All
        </a>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-3"
          >
            {/* Image with Category Badge */}
            <div className="relative">
              <img
                src={MainPic}
                alt={course.title}
                className="rounded-lg w-full h-40 object-cover"
              />
              <span className="absolute top-2 left-2 bg-white text-blue-600 text-xs font-medium px-2 py-1 rounded-full shadow">
                {course.category}
              </span>
            </div>

            {/* Course Info */}
            <div className="mt-3">
              <h3 className="font-semibold text-sm line-clamp-2">
                {course.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">By {course.instructor}</p>

              {/* Rating */}
              <div className="flex items-center mt-2 text-yellow-500 text-sm">
                {"★".repeat(course.rating)}
                {"☆".repeat(5 - course.rating)}
              </div>

              {/* Details */}
              <p className="text-xs text-gray-500 mt-1">
                {course.hours} Total Hours, {course.lectures} Lectures,{" "}
                {course.level}
              </p>

              {/* Price */}
              <p className="font-bold text-gray-900 mt-2">${course.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
