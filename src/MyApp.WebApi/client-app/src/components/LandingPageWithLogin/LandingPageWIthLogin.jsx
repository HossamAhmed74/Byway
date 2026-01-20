import React from "react";
import BoyPic from "../../assets/landing page without login/image 8.png";
import WomanPic from "../../assets/landing page without login/image 6.png";
import GirlPic from "../../assets/landing page without login/image 7.png";
import Avatar1 from "../../assets/Avatars Landing page without login/Ellipse 62.png";
import Avatar2 from "../../assets//Avatars Landing page without login/Ellipse 63.png";
import Avatar3 from "../../assets/Avatars Landing page without login/Ellipse 64.png";
import Avatar4 from "../../assets/Avatars Landing page without login/Ellipse 65.png";
import Avatar5 from "../../assets/Avatars Landing page without login/Ellipse 66.png";
import TopCategories from "../LandingPageWithoutLoginComponents/TopCategories";
import TopCourses from "../LandingPageWithoutLoginComponents/TopCourses";
import TopInstructors from "../LandingPageWithoutLoginComponents/TopInstructors";
import CustomerTestimonials from "../LandingPageWithoutLoginComponents/CustomerTestimonials";
import TheLastSection from "../LandingPageWithoutLoginComponents/TheLastSection";
import Footer from "../MainComponents/Footer";
import HeaderWithLogin from "../MainComponents/HeaderWithLogin";

const studentAvatars = [
  { url: Avatar1, alt: "Student 4" },
  { url: Avatar2, alt: "Student 5" },
  { url: Avatar3, alt: "Student 6" },
  { url: Avatar4, alt: "Student 7" },
  { url: Avatar5, alt: "Student 8" },
];

export default function LandingWithLogin() {
  return (
    <>
      <HeaderWithLogin />
      <div>
        <div className="grid grid-cols-12 min-h-screen">
          {/* Left Section (Text & Button) - No change */}
          <div className="col-span-5 flex flex-col justify-center items-center px-10">
            <h1 className="font-bold text-5xl mb-4 ml-9 leading-snug">
              Unlock Your Potential <br /> With Byway
            </h1>
            <h5 className="text-lg text-gray-600 mb-6 mr-5 leading-relaxed">
              Welcome to Byway, where learning knows no bounds. <br />
              We believe education is the key to personal and <br />
              professional growth, and we are here to guide you <br />
              on your journey to success.
            </h5>

            <button
              type="button"
              className="inline-block w-60 h-10 relative right-[7rem] rounded bg-blue-600 px-6 py-2 text-sm font-medium uppercase text-white shadow-lg transition duration-150 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Start Your Journey
            </button>
          </div>

          {/* ------------------------------------------------------------------ */}
          <div className="col-span-7 flex items-center justify-center relative overflow-hidden">
            <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center">
              {/* Decorative dots (simplified) */}
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 opacity-30">
                {/* Using a single background div to simulate the dotted pattern */}
                <div className="w-48 h-48 bg-dot-pattern bg-repeat"></div>
              </div>

              {/* ------------------ Student 1: Graduate (Red/Pink Circle) ------------------ */}
              <div className="absolute top-1/4 left-[18rem] z-10">
                {/* Outer White Ring (simulating a thick border) */}
                <div className="w-64 h-64 p-2 bg-white rounded-full shadow-xl">
                  {/* Inner Colored Circle & Image */}
                  <div className="w-full h-full rounded-full bg-red-400 overflow-hidden relative">
                    <img
                      src={WomanPic}
                      alt="Graduate Student"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              {/* ------------------ Student 2: Casual (Blue Circle) ------------------ */}
              <div className="absolute top-0 right-16 z-20">
                <div className="w-64 h-64 p-2 bg-white rounded-full shadow-xl">
                  <div className="w-full h-full rounded-full bg-blue-500 overflow-hidden relative">
                    <img
                      src={BoyPic}
                      alt="Casual Student"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              {/* ------------------ Student 3: Female (Yellow Circle) ------------------ */}
              <div className="absolute bottom-[2rem] right-12 z-10">
                <div className="w-72 h-72 p-2 bg-white rounded-full shadow-xl">
                  <div className="w-full h-full rounded-full bg-yellow-400 overflow-hidden relative">
                    <img
                      src={GirlPic}
                      alt="Female Student"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              {/* ------------------ Central Community Card (Placed relative to circles) ------------------ */}
              <div className="absolute top-[28pc] right-[13pc] z-30">
                <div className="bg-white rounded-xl shadow-2xl p-4 w-60">
                  {/* Avatar row */}
                  <div className="flex justify-center mb-3 -space-x-2">
                    {/* Simplified Avatars from image */}
                    {studentAvatars.map((student, i) => (
                      <img
                        key={i}
                        src={student.url}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white"
                      />
                    ))}
                  </div>

                  {/* Text content */}
                  <div className="text-center text-xs">
                    <p className="font-medium text-gray-700">
                      Join our community of
                    </p>
                    <p className="font-bold text-sm text-gray-900">
                      1200+ Students
                    </p>
                  </div>
                </div>
              </div>

              {/* Central Black Diamond (The small diamond shape between the top two circles) */}
              <div className="absolute top-[17rem] left-[37rem] transform -translate-x-1/2 -translate-y-1/2 z-30">
                {/* Outer Black Circle: w-12 h-12, now has rounded-full and NO rotation */}
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                  {/* Inner White Diamond: w-6 h-6, retains the rotate-45 to create the diamond shape */}
                  <div className="w-4 h-4 bg-white transform rotate-45 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-auto mt-12">
          <section className="max-w-full mx-auto bg-gray-50 py-12 rounded-lg shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
              {[
                { value: "250+", label: "Courses by our best mentors" },
                { value: "1000+", label: "Courses by our best mentors" },
                { value: "15+", label: "Courses by our best mentors" },
                { value: "2400+", label: "Courses by our best mentors" },
              ].map((item, idx) => (
                <div key={idx} className="py-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {item.value}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>
          </section>
          <TopCategories/>
        </div>
        <div className="w-full">
        <TopCourses/>
        </div>
        <div className="w-full">
        <TopInstructors/>
        </div>
        <div className="w-full">
        <CustomerTestimonials/>
        </div>
        <div className="">
        <TheLastSection/>
        </div>
      </div>
      <Footer />
    </>
  );
}
