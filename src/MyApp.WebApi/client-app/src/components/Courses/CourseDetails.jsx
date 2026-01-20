import React, { useEffect } from "react";
import Header from "../MainComponents/HeaderWithLogin";
import Footer from "../MainComponents/Footer";
import CourseImage from "../../assets/landing page without login/Rectangle 1080.png";
import InstructorPic from "../../assets/landing page without login/Ellipse 4.png";
import FacebookIcon from "../../assets/facebook.png";
import GoogleIcon from "../../assets/google.png";
import MicrosoftIcon from "../../assets/microsoft.png";
import GithubIcon from "../../assets/GitHub.png";
import XIcon from "../../assets/icons8-x-50.png";
import AvatarDesc from "../../assets/Ellipse 19.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cartItemsAtom } from "../../components/Jotai/cartItems/cartAtom";
import { useAtom } from "jotai";

const CourseDetails = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("description");
  const [courseData, setCourseData] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [disabledAddButton, setDisabledAddButton] = useState(false);

  useEffect(() => {
    const courseIsInCart = cartItems.find(
      (cartItem) => cartItem.id === location.state.course.id
    );
    if (courseIsInCart) {
      setDisabledAddButton(true);
    } else {
      setDisabledAddButton(false);
    }
  }, [location.state?.course]);

  useEffect(() => {
    if (location.state && location.state.course && location.state.topCourses) {
      setCourseData(location.state.course);
      setTopCourses(location.state.topCourses);
    }
  }, [location.state]);

  const addItemToCart = (item) => {
    const isExisting = cartItems.find((cartItem) => cartItem.id === item.id);
    if (isExisting) {
      return;
    }
    setCartItems([...cartItems, item]);
  };

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex text-sm">
              <Link to="/home" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
              <span className="mx-2 text-gray-400">›</span>
              <Link
                to="/designCourses"
                className="text-blue-600 hover:text-blue-800"
              >
                Courses
              </Link>
              <span className="mx-2 text-gray-400">›</span>
              <span className="text-gray-600">course Name</span>
            </nav>
          </div>
        </div>

        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                  {courseData?.name}
                </h1>
                <p className="text-gray-700 mb-4">
                  {courseData
                    ? courseData?.description
                    : `
                  This course is meticulously crafted to provide you with a
                  foundational understanding of the principles, methodologies,
                  and tools that drive exceptional user experiences in the
                  digital landscape.`}
                </p>

                {/* Rating & Stats */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        className={`w-4 h-4 ${
                          i < Math.floor(courseData?.rate)
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
                  {/* <span className="text-gray-700 mr-3">{Math.floor(courseData?.rate)}</span> */}
                  <span className="text-gray-600">
                    | {courseData?.totalHours} Total Hours,
                    {courseData?.totalCourseLectures} Lectures,
                    {courseData?.level} Level
                  </span>
                </div>

                {/* Instructor */}
                <div className="flex items-center mb-4">
                  <img
                    src={courseData?.instructorImageUrl}
                    alt="Instructor"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <span className="text-gray-700">Created by </span>
                    <span className="text-blue-600 font-medium">
                      {courseData?.instructorName}
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center mb-6">
                  <svg
                    className="w-5 h-5 text-gray-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4z" />
                  </svg>
                  <span className="text-gray-600">
                    {courseData?.categoryName}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b mb-6">
                <div className="flex space-x-1">
                  {[
                    { id: "description", label: "Description" },
                    { id: "instructor", label: "Instructor" },
                    { id: "content", label: "Content" },
                    { id: "reviews", label: "Reviews" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-white text-gray-800 border-b-2 border-blue-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-lg shadow p-6">
                {activeTab === "description" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      Course Description
                    </h2>
                    <p className="text-gray-700">
                      {courseData?.description
                        ? courseData?.description
                        : `
                      This interactive e-learning course will introduce you to
                      User Experience (UX) design, the art of creating products
                      and services that are intuitive, enjoyable, and
                      user-friendly. Gain a solid foundation in UX principles
                      and learn to apply them in real-world scenarios through
                      engaging modules and interactive exercises.`}
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-6">
                      Certification
                    </h2>
                    <p className="text-gray-700">
                      {courseData?.certification
                        ? courseData?.certification
                        : `
                      At Byway, we understand the significance of formal
                      recognition for your hard work and dedication to
                      continuous learning. Upon successful completion of our
                      courses, you will earn a prestigious certification that
                      not only validates your expertise but also opens doors to
                      new opportunities in your chosen field.`}
                    </p>
                  </div>
                )}

                {activeTab === "instructor" && (
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <img
                        src={courseData?.instructorImageUrl}
                        alt="Instructor"
                        className="w-20 h-20 rounded-full mr-4"
                      />
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {courseData?.instructorName}
                        </h2>
                        <p className="text-gray-600 mb-2">
                          {courseData?.instructorJobTitle}
                        </p>
                        <p className="text-gray-700">
                          {courseData?.instructorDescription
                            ? courseData?.instructorDescription
                            : `
                          Ronald has over 10 years of experience in UX design
                          and has helped numerous companies improve their user
                          experiences. He believes in practical, hands-on
                          learning and real-world applications.
                          `}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "content" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Course Content
                    </h2>
                    {courseData.courseContents.map((content, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {content.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span>
                              {content.lecturesNumber} lectures • {content.time}{" "}
                              hours
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Learner Reviews
                    </h2>
                    {[
                      {
                        name: "Sarah Johnson",
                        rating: 5,
                        date: "2 days ago",
                        comment:
                          "This course completely changed my approach to design. The practical exercises were incredibly helpful and I've already applied what I learned to my current project.",
                      },
                      {
                        name: "Michael Chen",
                        rating: 4,
                        date: "1 week ago",
                        comment:
                          "Great content and well-structured. The instructor explains complex concepts in an easy-to-understand way. Would recommend to anyone starting in UX design.",
                      },
                      {
                        name: "Emma Rodriguez",
                        rating: 5,
                        date: "2 weeks ago",
                        comment:
                          "I loved the real-world examples and case studies. The feedback on assignments was very constructive and helped me improve significantly.",
                      },
                    ].map((review, index) => (
                      <div
                        key={index}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <div className="flex items-center mb-2">
                          <img
                            src={AvatarDesc}
                            alt={review.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {review.name}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <div className="flex text-yellow-400 mr-2">
                                {[...Array(review.rating)].map((_, i) => (
                                  <svg
                                    className="w-4 h-4 text-yellow-300 ms-1"
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
                              <span>{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <img
                  src={courseData?.imageUrl}
                  alt="Course Thumbnail"
                  className="w-full h-36 object-cover rounded-lg mb-4"
                />

                <div className="text-2xl font-bold text-gray-800 mb-4">
                  ${courseData?.cost}
                </div>

                <button
                  disabled={disabledAddButton}
                  onClick={() => addItemToCart(courseData)}
                  className="w-full py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors mb-3"
                >
                  Add To Cart
                </button>

                <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Buy Now
                </button>
              </div>

              {/* Share Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Share</h3>
                <div className="flex space-x-3">
                  {[
                    {
                      name: "facebook",
                      icon: FacebookIcon,
                    },
                    {
                      name: "GitHub",
                      icon: GithubIcon,
                    },
                    {
                      name: "google",
                      icon: GoogleIcon,
                    },
                    {
                      name: "twitter",
                      icon: XIcon,
                    },
                    {
                      name: "microsoft",
                      icon: MicrosoftIcon,
                    },
                  ].map((social) => (
                    <button
                      key={social.name}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <img
                        src={social.icon}
                        alt={social.name}
                        className="w-6 h-6"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-9" />
          <div className="bg-white rounded-lg shadow p-6 mt-9">
            {/* Instructor Header */}
            <h2 className="text-xl font-bold text-gray-800 mb-1">Instructor</h2>

            <div className="flex items-start space-x-4 mt-4">
              {/* Profile Image */}
              <img
                src={courseData?.instructorImageUrl}
                alt="Ronald Richards"
                className="w-20 h-20 rounded-full border-2 border-gray-200"
              />

              {/* Instructor Info */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-blue-600 mb-1">
                  Ronald Richards
                </h3>
                <p className="text-gray-600 text-sm mb-4">UI/UX Designer</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 mr-1"
                    >
                      <path d="M2.45 13.8C1.85 12.68 1.85 11.32 2.45 10.2C4.3 6.8 7.88 4.5 12 4.5C16.12 4.5 19.7 6.8 21.55 10.2C22.15 11.32 22.15 12.68 21.55 13.8C19.7 17.2 16.12 19.5 12 19.5C7.88 19.5 4.3 17.2 2.45 13.8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    40,445 Reviews
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                      />
                    </svg>
                    500 Students
                  </div>
                  <div className="flex items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="my-path border-gray-500 mr-1 w-5 h-5"
                    >
                      <path
                        d="M14.031 6.80725C18.0186 9.11585 20.0124 10.2702 20.0124 11.9998C20.0124 13.7295 18.0186 14.8838 14.031 17.1924L13.0062 17.7857C9.00415 20.1027 7.00311 21.2612 5.50155 20.3954C4 19.5297 4 17.2175 4 12.5931L4 11.4065C4 6.7821 4 4.46991 5.50156 3.60418C7.00311 2.73846 9.00415 3.89695 13.0062 6.21394L14.031 6.80725Z"
                        stroke="black"
                        strokeWidth="1.5"
                      />
                    </svg>
                    15 Courses
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-700 text-sm leading-relaxed">
                  With over a decade of industry experience, Ronald brings a
                  wealth of practical knowledge to the classroom. He has played
                  a pivotal role in designing user-centric interfaces for
                  renowned tech companies, ensuring seamless and engaging user
                  experiences.
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="mt-8   pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Content
              </h3>

              <div className="space-y-3">
                {[
                  {
                    title: "Introduction to UX Design",
                    lectures: 5,
                    duration: "1 hour",
                  },
                  {
                    title: "Basics of User-Centered Design",
                    lectures: 5,
                    duration: "1 hour",
                  },
                  {
                    title: "Elements of User Experience",
                    lectures: 5,
                    duration: "1 hour",
                  },
                  {
                    title: "Visual Design Principles",
                    lectures: 5,
                    duration: "1 hour",
                  },
                ].map((module, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {module.title}
                      </h4>
                    </div>
                    <div className="text-sm text-gray-600">
                      {module.lectures} Lectures • {module.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <hr className="mt-9" />
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {/* Header */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Learner Reviews
            </h2>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Rating Summary */}
              <div className="lg:w-1/4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        className="w-4 h-4 text-yellow-300 ms-1"
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
                  <span className="text-2xl font-bold text-gray-800">4.6</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">146,951 reviews</p>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[
                    { stars: 5, percent: 80 },
                    { stars: 4, percent: 10 },
                    { stars: 3, percent: 5 },
                    { stars: 2, percent: 3 },
                    { stars: 1, percent: 2 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(item.stars)].map((_, i) => (
                          <svg
                            className="w-4 h-4 text-yellow-300 ms-1"
                            aria-hidden="true"
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ))}
                        {[...Array(5 - item.stars)].map((_, i) => (
                          <svg
                            className="w-4 h-4 text-yellow-300 ms-1"
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
                      <div className="w-full mx-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-600 text-sm ml-2">
                        {item.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:w-3/4 space-y-4">
                {[
                  {
                    name: "Mark Doe",
                    rating: 5,
                    date: "Reviewed on 22nd March, 2024",
                    comment:
                      "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
                  },
                  {
                    name: "Mark Doe",
                    rating: 5,
                    date: "Reviewed on 22nd March, 2024",
                    comment:
                      "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
                  },
                  {
                    name: "Mark Doe",
                    rating: 5,
                    date: "Reviewed on 22nd March, 2024",
                    comment:
                      "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
                  },
                ].map((review, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={AvatarDesc}
                        alt={review.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-800 mr-2">
                              {review.name}
                            </h3>
                            <div className="flex text-yellow-400">
                              {[...Array(review.rating)].map((_, i) => (
                                <svg
                                  className="w-4 h-4 text-yellow-300 ms-1"
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
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* View More Button */}
                <button className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  View more Reviews
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {/* Header */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              More Courses Like This
            </h2>

            {/* Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topCourses.map((course, index) => (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Course Image with Badge */}*{" "}
                  <div className="relative">
                    <img
                      src={course?.imageUrl}
                      alt={course?.name}
                      className="w-full h-36 object-cover"
                    />
                    {/* BEST SELLER Badge */}
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                      BEST SELLER
                    </div>
                  </div>
                  {/* Course Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
                      {course?.name}
                    </h3>

                    {/* Instructor */}
                    <p className="text-sm text-gray-600 mb-2">
                      By {course?.instructorName}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 mr-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            className={`w-4 h-4 ${
                              i < Math.floor(course?.rate)
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

                    {/* Stats */}
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <span>{course?.totalHours} hours</span>
                      <span className="mx-1">•</span>
                      <span>{course?.totalCourseLectures} Lectures</span>
                      <span className="mx-1">•</span>
                      <span>{course?.level}</span>
                    </div>

                    {/* Price */}
                    <div className="font-bold text-gray-800 mt-2">
                      {course.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-10 py-6">
          <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
            © 2023 Byway. All rights reserved.
          </div>
        </footer>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;
