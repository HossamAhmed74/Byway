import React, { useEffect, useState } from "react";
import Sidebar from "../DashboardComponents/Sidebar";
import Pagination from "../Common/Pagination";
import AddInstructorModal from "./CreateInstructor";
import DeletedModal from "../Modals/DeletedModal";
import { instructorsAtom } from "../Jotai/Instructors/CreateInstructorAtoms";
import { useAtom } from "jotai";

const StarIcon = ({ filled }) => (
  <svg
    className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 22 20"
    aria-hidden="true"
  >
    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
  </svg>
);

const InstructorsDashboard = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [totalInstructors, setTotalInstructors] = useState(0);
  const [selectedInstructorToEdit, setSelectedInstructorToEdit] =
    useState(null);
  const [selectedInstructorToView, setSelectedInstructorToView] =
    useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instructorsList, setInstructors] = useAtom(instructorsAtom);
  const [isViewInstructor, setIsViewInstructor] = useState(false);
  const [isEditInstructor, setInstructorToEdit] = useState(false);
  const [link, SetApiLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterInstructors, setFilterInstructors] = useState([]);

  const fetchInstructors = async () => {
    try {
      const res = await fetch("/api/Instructor/GetAllInstructors");
      const data = await res.json();
      setTotalInstructors(data.length);
      setInstructors(data);
    } catch (err) {
      console.error("Failed to fetch Instructor:", err);
    }
  };

  const normalize = (str) => str.toLowerCase().replace(/\s+/g, "");

  //handle search filter
  const handleSearchFilter = (e) => {
    const searchTerm = e.target.value;
    if (searchTerm && isNaN(searchTerm) && typeof searchTerm === "string") {
      const normTerm = normalize(searchTerm);
      setFilterInstructors(
        instructorsList.filter((instructor) => {
          const nameMatch = normalize(instructor.name).includes(normTerm);
          const jobMatch = normalize(instructor.jobTitle).includes(normTerm);
          return nameMatch || jobMatch;
        })
      );
    } else if (!isNaN(searchTerm) && searchTerm.trim() !== "") {
      setFilterInstructors(
        instructorsList.filter(
          (instructor) => instructor.rate === Number(searchTerm)
        )
      );
    } else {
      setFilterInstructors(instructorsList);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, [setInstructors]);

  const handleViewInstructor = (instructor) => () => {
    if (!instructor) return;
    setIsViewInstructor(true);
    setIsModalOpen(true);
    setInstructorToEdit(false);
    setSelectedInstructorToEdit(null);
    setSelectedInstructorToView(instructor);
  };

  const handleEditInstructor = (instructor) => () => {
    if (!instructor) return;
    setInstructorToEdit(true);
    setIsModalOpen(true);
    setIsViewInstructor(false);
    setSelectedInstructorToView(null);
    setSelectedInstructorToEdit(instructor);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-2 space-y-6">
        {/* Header */}
        <header className="px-6 py-4 flex justify-between">
          <div className="flex justify-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Instructors
            </h1>
            <nav className="text-sm text-gray-500 relative mt-3 ml-3">
              <a
                href="/dashboard"
                className=" text-sm font-bold hover:text-blue-600"
              >
                Dashboard
              </a>
              <span className="mx-2">›</span>
              <span>Instructors</span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="bg-white  h-12 w-12 grid place-content-center rounded-full hover:bg-gray-100 text-gray-600"
              aria-label="Notifications"
            >
              {/* Bell Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 
                     18 9.75V9A6 6 0 0 0 6 9v.75a8.967 
                     8.967 0 0 1-2.312 6.022c1.733.64 
                     3.56 1.085 5.455 1.31m5.714 0a24.255 
                     24.255 0 0 1-5.714 0m5.714 0a3 3 
                     0 1 1-5.714 0M3.124 7.5A8.969 
                     8.969 0 0 1 5.292 3m13.416 0a8.969 
                     8.969 0 0 1 2.168 4.5"
                />
              </svg>
            </button>
          </div>
        </header>

        <hr className="relative bottom-5" />

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Top Bar */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-800">
                All Instructors
              </h2>
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                {totalInstructors}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
              >
                + Add Instructor
              </button>

              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search Instructors"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleSearchFilter(e)}
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 
                       0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["Name", "Job Title", "Rate", "Action"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {(filterInstructors.length
                  ? filterInstructors
                  : instructorsList
                ).map((instructor, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {instructor.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {instructor.jobTitle}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            filled={star <= instructor.rate}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {/* View */}
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={handleViewInstructor(instructor)}
                        >
                          {/* Eye SVG unchanged */}
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 
                                 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 
                                 12 5c4.478 0 8.268 2.943 
                                 9.542 7-1.274 4.057-5.064 
                                 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>

                        {/* Edit */}
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={handleEditInstructor(instructor)}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 
                                 2v11a2 2 0 002 
                                 2h11a2 2 0 002-2v-5m-1.414-5L17 
                                 14.586M18 10a2 2 0 00-2-2h-6l-2-2H6a2 
                                 2 0 00-2 2v10a2 2 0 002 2h10a2 
                                 2 0 002-2v-4l2-2z"
                            />
                          </svg>
                        </button>

                        {/* Delete */}
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setSelectedInstructor(instructor);
                            SetApiLink(`Instructor/DeleteInstructor`);
                          }}
                          aria-label="Delete instructor"
                        >
                          <svg
                            className="w-5 h-5"
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
                              d="M5 7h14m-9 
                                 3v8m4-8v8M10 
                                 3h4a1 1 0 0 1 
                                 1 1v3H9V4a1 1 
                                 0 0 1 1-1ZM6 
                                 7h12v13a1 1 0 
                                 0 1-1 1H7a1 1 
                                 0 0 1-1-1V7Z"
                            />
                          </svg>
                        </button>

                        {showDeleteModal && (
                          <DeletedModal
                            Name={selectedInstructor?.name}
                            itemId={selectedInstructor?.id}
                            deletedType="Instructor"
                            onCancel={() => setShowDeleteModal(false)}
                            onConfirm={() => {
                              setShowDeleteModal(false);
                              fetchInstructors();
                            }}
                            apiUrlDirection={link}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <Pagination />
          </div>
        </div>
      </div>

      {/* Add/Edit/View Modal */}
      <AddInstructorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsViewInstructor(false);
          setInstructorToEdit(false);
          setSelectedInstructor(null);
          setSelectedInstructorToEdit(null);
          setSelectedInstructorToView(null);
        }}
        instructorToEdit={selectedInstructorToEdit}
        instructorToView={selectedInstructorToView}
        onReload={fetchInstructors}
      />
    </div>
  );
};

export default InstructorsDashboard;
