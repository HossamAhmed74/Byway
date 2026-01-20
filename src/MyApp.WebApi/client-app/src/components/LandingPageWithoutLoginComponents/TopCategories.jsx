
export default function TopCategories() {
  const categories = [
    {icon:(<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44"></path><path d="m13.56 11.747 4.332-.924"></path><path d="m16 21-3.105-6.21"></path><path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z"></path><path d="m6.158 8.633 1.114 4.456"></path><path d="m8 21 3.105-6.21"></path><circle cx="12" cy="13" r="2"></circle></svg>)
        ,title: "Fullstack",
         courses: "11 Courses" },
    {icon:(<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>),
         title: "Backend",
         courses: "12 Courses" },
    {icon:(<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg>),
          title: "Frontend",
          courses: "12 Courses" },
    {icon:(<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg>),
          title: "UX/UI Design",
          courses: "14 Courses" },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto py-12">
      {/* Header row */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Top Categories</h2>
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

      {/* Grid of categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-6 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
              {cat.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{cat.title}</h3>
            <p className="text-sm text-gray-500">{cat.courses}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
