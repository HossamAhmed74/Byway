import React from 'react';
import MockPic from '../../assets/landing page without login/Rectangle 1136.png';

// Mock data (replace with real data or props)
const instructors = [
  { id: 1, name: 'Ronald Richards', role: 'UI/UX Designer', rating: 4.8, students: '2.4K' },
  { id: 2, name: 'Jenny Wilson', role: 'Frontend Developer', rating: 4.9, students: '3.1K' },
  { id: 3, name: 'Guy Hawkins', role: 'Graphic Designer', rating: 4.7, students: '1.9K' },
  { id: 4, name: 'Savannah Nguyen', role: 'Product Manager', rating: 4.6, students: '2.7K' },
  { id: 5, name: 'Esther Howard', role: 'Data Scientist', rating: 4.9, students: '4.2K' },
];

const TopInstructors = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Top Instructors</h2>
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

      {/* Instructor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {instructors.map((instructor) => (
          <div
            key={instructor.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Placeholder image - replace with real image */}
            <div className="bg-gray-200 h-48 w-full flex items-center justify-center">
                <img src={MockPic} alt={instructor.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{instructor.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{instructor.role}</p>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-500 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.917c.788-.286 1.612-.286 2.4 0l1.07-1.07c.39-.39 1.023-.39 1.414 0 .39.39.39 1.022 0 1.414L12.414 5l1.515 1.515c.39.39.39 1.022 0 1.414-.39.39-1.023.39-1.414 0L11 6.414l-1.515 1.515c-.39.39-1.023.39-1.414 0-.39-.39-.39-1.022 0-1.414L9.586 5 8.07 3.485c-.39-.39-.39-1.022 0-1.414.39-.39 1.023-.39 1.414 0L9.049 2.917z" />
                    <path d="M10 13a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                  <span className="text-gray-700 font-medium">{instructor.rating}</span>
                </div>
                <span className="text-gray-500">{instructor.students} students</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopInstructors;