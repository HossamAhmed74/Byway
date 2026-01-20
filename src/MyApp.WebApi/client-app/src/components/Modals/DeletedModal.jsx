import React ,{useState} from "react";

const DeletedModal = ({
  Name,
  deletedType,
  onCancel,
  onConfirm,
  apiUrlDirection,
  itemId,
}) => {
const [isDeletingFailed,setIsDeletingFailed] = useState(false);
  const handleDelete = async () => {
    try {
      const apiUrl = `/api/${apiUrlDirection}/${itemId}`;

      const response = await fetch(apiUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        onConfirm?.();
      } else if(response.status === 400) {
        setIsDeletingFailed(true);
        console.error("Failed to delete. Status:", response.status);
      }
    } catch (error) {
      console.error("Error while deleting:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8"
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
                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-gray-700 mb-6">
          Are you sure you want to delete this {deletedType}: 
          <strong className="text-gray-900">{Name}</strong>?
        </p>

        {isDeletingFailed && (
          <p className="text-center text-red-600 mb-4">
           this course {Name} cannot be deleted because it is sold.
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={()=>{handleDelete()} }
            disabled={isDeletingFailed}
            className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletedModal;
