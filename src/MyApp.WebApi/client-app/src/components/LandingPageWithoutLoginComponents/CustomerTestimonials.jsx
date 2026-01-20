import React from 'react';
import MockAvatar from '../../assets/landing page without login/Ellipse 61.png';
import Vector from '../../assets/landing page without login/Vector.png';

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    quote: "Byway's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia.",
    name: "Jane Doe",
    role: "Designer",
    avatar: MockAvatar
  },
  {
    id: 2,
    quote: "The instructors are incredibly knowledgeable and patient. I went from zero to hero in just 3 months — highly recommend!",
    name: "John Smith",
    role: "Developer",
    avatar: MockAvatar
  },
  {
    id: 3,
    quote: "I’ve taken many online courses, but Byway stands out for its practical projects and real-world applications. Worth every penny!",
    name: "Emily Chen",
    role: "Product Manager",
    avatar: MockAvatar
  },
];

const CustomerTestimonials = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">What Our Customer Say</h2>
          <p className="text-gray-600">About Us</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-gray-200 hover:bg-gray-300 rounded-lg p-2 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 rounded-lg p-2 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col h-full"
          >
            <div className="mb-4">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-500 mb-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609a15.175 15.175 0 00-8.983-10.609v-7.391l-5.424 5.424V21h5.424z" />
                <path d="M27.6 21v-7.391c0-5.704 3.731-9.57 8.983-10.609a15.175 15.175 0 00-8.983-10.609v-7.391l-5.424 5.424V21H27.6z" />
              </svg> */}
                <img src={Vector} alt="Quote" className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-gray-700 text-sm leading-relaxed">{testimonial.quote}</p>
            </div>
            <div className="mt-auto flex items-center">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonials;