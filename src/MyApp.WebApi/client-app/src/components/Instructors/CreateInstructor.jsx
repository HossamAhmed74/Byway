import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import ProfilePic from "../../assets/Profile Pic.png";
import {
  instructorFormAtom,
  instructorFormErrorsAtom,
} from "../Jotai/Instructors/CreateInstructorAtoms";
import { useAtom } from "jotai";
import { jobTitlesAtom } from "../Jotai/Instructors/CreateInstructorAtoms";

const AddInstructorModal = ({
  isOpen,
  onClose,
  instructorToEdit,
  instructorToView,
  onReload,
}) => {
  const [instructor, setInstructor] = useAtom(instructorFormAtom);
  const [jotaiErrors, setJotaiErrors] = useAtom(instructorFormErrorsAtom);
  const [jobTitles, setJobTitles] = useAtom(jobTitlesAtom);
  const [localRate, setLocalRate] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors: formErrors },
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      image: "",
      name: "",
      jobTitleId: null,
      rate: 0,
      description: "",
    },
  });

  const name = watch("name");
  const jobTitleId = watch("jobTitleId");
  const description = watch("description");
  const image = watch("image");

  // if instructorFormAtom has data, then we are editing or Viewing an instructor
  useEffect(() => {
    // Decide which instructor data to use (edit or view)
    const instructorData = instructorToEdit || instructorToView;

    if (instructorData) {
      setValue("name", instructorData.name || "");
      setValue("jobTitleId", instructorData.jobTitleId || "");
      setValue("description", instructorData.description || "");
      setValue("rate", instructorData.rate || 0);
      setLocalRate(instructorData.rate || 0);
      setImagePreview(instructorData.imageUrl || null);
    } else {
      resetForm(); // Clear form if adding new
      setLocalRate(0);
      setImagePreview(null);
    }
  }, [instructorToEdit, instructorToView, setValue]);

  // Fetch job titles on mount
  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        const res = await fetch("/api/Instructor/GetAllJobTitles");
        const data = await res.json();
        setJobTitles(data);
      } catch (err) {
        console.error("Failed to fetch job titles:", err);
      }
    };
    fetchJobTitles();
  }, [setJobTitles]);

  // Sync form data with Jotai atom
  useEffect(() => {
    setInstructor({
      name,
      jobTitleId,
      description,
      image,
      rate: localRate,
    });
  }, [name, jobTitleId, description, image, localRate, setInstructor]);

  // Sync react-hook-form errors with Jotai
  useEffect(() => {
    const hasErrors = Object.keys(formErrors).length > 0;
    const hadErrors = Object.keys(jotaiErrors).length > 0;

    if (hasErrors || hadErrors) {
      setJotaiErrors(formErrors);
    }
  }, [
    formErrors.name?.message,
    formErrors.jobTitleId?.message,
    formErrors.rate?.message,
    formErrors.image?.message,
    formErrors.description?.message,
  ]);

  // Cleanup preview URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleAddInstructor = async (formValues) => {
    try {
      let uploadedImageUrl = instructorToEdit?.imageUrl || "";

      // 🔹 Upload new image only if a new one is selected
      if (imageFile && imagePreview !== uploadedImageUrl) {
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);

        const uploadRes = await fetch("/api/Instructor/UploadImage", {
          method: "POST",
          body: uploadForm,
        });

        if (!uploadRes.ok) {
          throw new Error((await uploadRes.text()) || "Image upload failed");
        }

        const uploadResult = await uploadRes.json();
        uploadedImageUrl = uploadResult.imageUrl;
      }

      // 🔹 Build instructor payload
      const instructor = {
        id: instructorToEdit ? instructorToEdit.id : 0,
        name: formValues.name.trim(),
        jobTitleId: formValues.jobTitleId,
        rate: localRate,
        description: formValues.description?.trim() || "",
        imageUrl: uploadedImageUrl,
      };

      // 🔹 Choose API endpoint and method
      const isEditing = Boolean(instructorToEdit);
      const endpoint = isEditing
        ? "/api/Instructor/UpdateInstructor"
        : "/api/Instructor/CreateInstructor";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instructor),
      });

      if (!response.ok) {
        throw new Error((await response.text()) || "Failed to save instructor");
      }

      await onReload();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving instructor:", error);
    }
  };

  const resetForm = () => {
    reset();
    setInstructor({
      image: "",
      name: "",
      jobTitleId: "",
      jobTitle: "",
      rate: 0,
      description: "",
    });
    setLocalRate(0);
    setImagePreview(null);
    setImageFile(null);
    setJotaiErrors({});
  };

  const handleRateClick = (rating) => {
    const newRating = localRate === rating ? Math.max(0, rating - 1) : rating;
    setLocalRate(newRating);
    setValue("rate", newRating, {
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const handleImageSelect = (event) => {
    const fileExists = event.target.value;
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setValue("image", file.name, {
        shouldValidate: true,
        shouldTouch: true,
      });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {instructorToView
            ? "View Instructor"
            : instructorToEdit
            ? "Edit Instructor"
            : "Add Instructor"}
        </h2>

        <div>
          {/* Avatar Upload Section */}
          <div className="mb-4">
            <div className="flex items-start">
              <div
                className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center relative overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={handleAvatarClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={ProfilePic}
                    alt="Default Avatar"
                    className="w-full h-full object-cover"
                  />
                )}

                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAvatarClick();
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </button>
              </div>

              {formErrors.image && (
                <p className="text-red-600 text-sm mt-1 ml-4">
                  {formErrors.image.message}
                </p>
              )}
            </div>
          </div>

          {/* Hidden input for image validation */}
          <input
            type="hidden"
            {...register("image", {
              validate: (value) => {
                if (instructorToEdit && !imageFile && imagePreview) {
                  return true;
                }

                if (!value && !imageFile) {
                  return "Please select an image";
                }
              },
            })}
          />

          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Name must not exceed 100 characters",
                },
                validate: (value) => {
                  if (!value?.trim()) {
                    return "Name cannot be empty or just spaces";
                  }

                  if (instructorToEdit.name === value) return true;
                },
              })}
              placeholder="Enter Instructor Name"
              disabled={instructorToView}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                formErrors.name
                  ? "border-red-600 focus:ring-red-600"
                  : "border-gray-300 focus:ring-blue-500"
              } ${instructorToView ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
            {formErrors.name && (
              <p className="text-red-600 text-sm mt-1">
                {formErrors.name.message}
              </p>
            )}
          </div>

          {/* Job Title & Rate Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <select
                {...register("jobTitleId", {
                  required: "Job title is required",
                  validate: (value) => {
                    if (!value || value === "") {
                      return "Please select a job title";
                    }
                    if (instructorToEdit.jobTitleId == value) return true;
                  },
                })}
                disabled={instructorToView}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  formErrors.jobTitle
                    ? "border-red-600 focus:ring-red-600"
                    : "border-gray-300 focus:ring-blue-500"
                } ${instructorToView ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                <option value="">Choose</option>
                {jobTitles.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
              {formErrors.jobTitleId && (
                <p className="text-red-600 text-sm mt-1">
                  {formErrors.jobTitleId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate
              </label>

              <input
                type="hidden"
                {...register("rate", {
                  required: "Please select a rate",
                  min: {
                    value: 1,
                    message: "Rate must be at least 1 star",
                  },
                  max: {
                    value: 5,
                    message: "Rate must be at most 5 stars",
                  },
                  validate: (value) => {
                    if (instructorToEdit.rate == value) return true;
                  },
                })}
              />

              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isSelected = star <= localRate;

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => !instructorToView && handleRateClick(star)}
                      className={`w-6 h-6 transition-colors duration-200 ${
                        isSelected ? "text-yellow-400" : "text-gray-300"
                      } ${
                        !instructorToView
                          ? "hover:text-yellow-300"
                          : "cursor-not-allowed"
                      }`}
                      {...register("rate", {
                        required: "Please select a rate",
                      })}
                    >
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                        className="w-full h-full"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    </button>
                  );
                })}
              </div>

              {formErrors.rate && (
                <p className="text-red-600 text-sm mt-1">
                  {formErrors.rate.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description must not exceed 500 characters",
                },
              })}
              placeholder="Enter Description"
              rows={3}
              disabled={instructorToView}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                formErrors.description
                  ? "border-red-600 focus:ring-red-600"
                  : "border-gray-300 focus:ring-blue-500"
              } ${instructorToView ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
            {formErrors.description && (
              <p className="text-red-600 text-sm mt-1">
                {formErrors.description.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {instructorToView ? "Close" : "Cancel"}
            </button>
            {!instructorToView && (
              <button
                type="button"
                onClick={handleSubmit(handleAddInstructor)}
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
              >
                {instructorToEdit ? "Update" : "Add"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInstructorModal;
