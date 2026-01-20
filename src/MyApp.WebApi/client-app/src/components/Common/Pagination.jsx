import React from 'react';

const Pagination = ({ currentPage = 1, totalPages = 3, onPageChange }) => {
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <nav className="inline-flex rounded-md shadow-sm border border-blue-100 bg-white">
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-4 py-2 text-sm font-medium text-gray-700 rounded-l-md transition ${
            currentPage <= 1
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-blue-50 hover:text-blue-700'
          }`}
        >
          ←
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-4 py-2 text-sm font-medium transition border-l border-blue-100 ${
              currentPage === page
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-4 py-2 text-sm font-medium text-gray-700 border-l border-blue-100 rounded-r-md transition ${
            currentPage >= totalPages
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-blue-50 hover:text-blue-700'
          }`}
        >
          →
        </button>
      </nav>
    </div>
  );
};

export default Pagination;