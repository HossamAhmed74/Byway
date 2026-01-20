import React from 'react';
import WomanPic from '../../assets/landing page without login/image 10.png';
import StudentPic from '../../assets/landing page without login/image 11.png';

const CallToActionSection = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Section 1: Become an Instructor */}
      <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
        {/* Image */}
        <div className="lg:w-1/2">
          <div className="bg-purple-100 rounded-3xl p-4 max-w-md mx-auto">
            <img
              src={WomanPic}
              alt="Instructor"
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-1/2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Become an Instructor</h2>
          <p className="text-gray-600">
            Instructors from around the world teach millions of students on Byway.
            We provide the tools and skills to teach what you love.
          </p>
          <button className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center transition">
            Start Your Instructor Journey
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Section 2: Transform your life through education */}
      <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
        {/* Image */}
        <div className="lg:w-1/2">
          <div className="bg-blue-100 rounded-3xl p-4 max-w-md mx-auto">
            <img
              src={StudentPic}
              alt="Student Learning"
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-1/2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Transform your life through education</h2>
          <p className="text-gray-600">
            Learners around the world are launching new careers, advancing in their fields, and enriching their lives.
          </p>
          <button className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center transition">
            Checkout Courses
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;