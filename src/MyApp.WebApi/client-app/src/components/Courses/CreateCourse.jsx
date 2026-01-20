import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Sidebar from "../DashboardComponents/Sidebar";
import TextEditor from "../Shared/TextEditor";
import { useAtom } from "jotai";
import {
  ratingAtom,
  descriptionAtom,
  certificationAtom,
  currentStepAtom,
  isAddOpenAtom,
  CreateCourseAtoms,
  categoriesList,
  instructorsList,
} from "../Jotai/courses/CreateCourseAtoms";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

export default function CreateCourse() {
  const [rating, setRating] = useAtom(ratingAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [certification, setCertification] = useAtom(certificationAtom);
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const [isAddOpen, setIsAddOpen] = useAtom(isAddOpenAtom);
  const [course, setCourse] = useAtom(CreateCourseAtoms);
  const [categories, setCategories] = useAtom(categoriesList);
  const [instructors, setInstructorsList] = useAtom(instructorsList);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [localRate, setLocalRate] = useState(rating || 0);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [link, setLink] = useState("");
  const [editCourseData, setEditCourse] = useState(null);

  const navigate = useNavigate();

  const location = useLocation();
  const fileInputRef = React.createRef();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      name: course.name || "",
      level: course.level || "",
      InstructorId: course.InstructorId || "",
      description: course.description || "",
      certification: course.certification || "",
      categoryId: course.categoryId || "",
      cost: course.cost || 0,
      image: course.image || null,
      rate: course.rate || 0,
      totalHours: course.totalHours || 0,
      courseContents: course.courseContent || [
        {
          id: crypto.randomUUID(),
          contentName: "",
          lecturesNumber: 0,
          time: 0,
        },
      ],
    },
  });

  //fetch edit course data
  useEffect(() => {
    let editCourse;
    if (location.state) {
      if (location.state?.isView) {
        setIsViewOpen(true);
      }
      editCourse = location.state.course;
      setEditCourse(editCourse);
    }
    if (editCourse) {
      reset({
        name: editCourse.name || "",
        level: editCourse.level || "",
        InstructorId: editCourse.instructorId || "",
        description: editCourse.description || "",
        certification: editCourse.certification || "",
        categoryId: editCourse.categoryId || "",
        cost: editCourse.cost || 0,
        image: editCourse.imageUrl || null,
        rate: editCourse.rate || 0,
        totalHours: editCourse.totalHours || 0,
        courseContent:
          editCourse.courseContents?.map((c) => ({
            id: crypto.randomUUID(),
            contentName: c.name,
            lecturesNumber: c.lecturesNumber,
            time: c.time,
          })) || [],
      });
      if (editCourse.imageUrl) {
        setImagePreview(editCourse.imageUrl);
      }

      setValue(
        "courseContents",
        editCourse.courseContents?.map((c) => ({
          contentName: c.name,
          lecturesNumber: c.lecturesNumber,
          time: c.time,
        })) || []
      );
    }
  }, [editCourseData]);

  // call instructors
  useEffect(() => {
    async function fetchInstructors() {
      try {
        const response = await fetch("/api/Instructor/GetAllInstructors");
        const data = await response.json();
        setInstructorsList(data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    }
    fetchInstructors();
  }, [setInstructorsList]);

  //call categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/Category/GetAllCategories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, [setCategories]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "courseContent",
  });

  const watchedValues = watch();
  const currentRate = localRate || watchedValues.rate || 0;

  const handleRateClick = (rating) => {
    let newRating;
    if (localRate === rating) {
      newRating = Math.max(0, rating - 1);
    } else {
      newRating = rating;
    }
    setLocalRate(newRating);
    setValue("rate", newRating, { shouldValidate: true });
  };

  const handleReloadCourses = () => {
    navigate("/courses", { state: { reload: true } });
  };

  const onSubmit = async (data) => {
    let uploadedImageUrl = editCourseData?.imageUrl;

    // 🔹 Upload new image only if a new one is selected
    if (imageFile && imagePreview !== uploadedImageUrl) {
      const uploadForm = new FormData();
      uploadForm.append("file", imageFile);

      const uploadRes = await fetch("/api/Courses/UploadImage", {
        method: "POST",
        body: uploadForm,
      });

      if (!uploadRes.ok) {
        throw new Error((await uploadRes.text()) || "Image upload failed");
      }

      const uploadResult = await uploadRes.json();
      uploadedImageUrl = uploadResult.imageUrl;
    }

    const courseData = {
      id: editCourseData ? editCourseData.id : 0,
      imageUrl: uploadedImageUrl,
      name: data.name,
      categoryId: data.categoryId,
      level: data.level,
      instructorId: data.InstructorId,
      cost: data.cost,
      rate: localRate,
      totalHours: data.totalHours,
      description: data.description,
      certification: data.certification,
      courseContents: data.courseContent.map((c) => ({
        name: c.contentName,
        lecturesNumber: c.lecturesNumber,
        time: c.time,
      })),
    };

    const isEditing = Boolean(editCourseData);
    const endpoint = isEditing
      ? "/api/Courses/UpdateCourse"
      : "/api/Courses/CreateCourse";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();
      if (response.ok) {
        window.location.href = "/courses";
      } else {
        throw new Error(result.message || "Failed to save course");
      }

      reset();
      setRating(0);
      setDescription("");
      setCertification("");
      handleReloadCourses();
      setEditCourse(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const onBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    if (currentStep === 2) {
      setLink("/courses");
    } else setIsAddOpen(false);
  };

  const addContent = () => {
    append({
      id: crypto.randomUUID(),
      contentName: "",
      lecturesNumber: 0,
      time: 0,
    });
  };

  const removeContent = (index) => {
    remove(index);
  };

  const handleImageSelect = (event) => {
    const fileExists = event.target.value;
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setValue("image", file, {
        shouldValidate: true,
        shouldTouch: true,
      });
    } else {
      formErrors.image = "image is required";
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("image", null);
    clearErrors("image");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r shadow-sm">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
            <nav className="mt-1 text-sm">
              <a href="#" className="text-gray-600 hover:text-blue-700">
                Dashboard
              </a>
              <span className="mx-2 text-gray-400">›</span>
              <span className="text-gray-700">Courses</span>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <button
              className="h-9 w-9 grid place-content-center rounded-full hover:bg-gray-100 text-gray-600"
              aria-label="Notifications"
            >
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
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 
                  6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 
                  0a24.255 24.255 0 0 1-5.714 0m5.714 
                  0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 
                  8.969 0 0 1 5.292 3m13.416 0a8.969 
                  8.969 0 0 1 2.168 4.5"
                />
              </svg>
            </button>

            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-medium">
              J
            </div>
          </div>
        </header>

        <main className="px-4 py-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative w-full rounded-2xl border border-gray-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between px-6 pt-5">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Add Course
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Step {currentStep} of 2
                  </p>
                </div>
              </div>

              {currentStep === 1 && (
                <div className="px-6 pb-6">
                  <div className="border-b px-4 py-3 flex justify-start">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Course Details
                    </h3>
                  </div>

                  <div className="p-4 flex gap-6">
                    <div className="w-60 h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        disabled={isViewOpen}
                        onChange={handleImageSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />

                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Course Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <svg
                            className="w-8 h-8 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                          </svg>
                          <span className="text-sm text-gray-500">
                            Click to upload
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Recommended size:</span>{" "}
                          700x430 pixels
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">
                            Supported formats:
                          </span>{" "}
                          .jpg, .jpeg, .png, .gif
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Max file size:</span>{" "}
                          5MB
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          {imagePreview ? "Change Image" : "Upload Image"}
                        </button>

                        {imagePreview && (
                          <button
                            type="button"
                            onClick={removeImage}
                            disabled={isViewOpen}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Remove
                          </button>
                        )}
                      </div>

                      {formErrors.image && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-sm flex items-center">
                            {formErrors.image.message}
                          </p>
                        </div>
                      )}

                      {imagePreview && !formErrors.image && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-600 text-sm flex items-center">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Image uploaded successfully
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Course Name"
                        {...register("name", {
                          required: "Course name is required",
                          minLength: {
                            value: 3,
                            message:
                              "Course name must be at least 3 characters",
                          },
                          maxLength: {
                            value: 100,
                            message: "Course name cannot exceed 100 characters",
                          },
                        })}
                        className={
                          formErrors.name
                            ? "w-full border border-red-600 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-600"
                            : "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
                        }
                        disabled={isViewOpen}
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        {...register("categoryId", {
                          validate: (value) => {
                            if (!value || value.trim() === "") {
                              return "Category is required";
                            }
                          },
                        })}
                        className={
                          formErrors.categoryId
                            ? "w-full border border-red-600 rounded-md px-3 py-2 text-sm focus:ring-red-600"
                            : "w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        }
                        disabled={isViewOpen}
                      >
                        <option value="">Choose</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.categoryId && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.categoryId.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Level
                      </label>
                      <select
                        {...register("level", {
                          validate: (value) => {
                            if (!value || value.trim() === "") {
                              return "Level is required";
                            }
                          },
                        })}
                        disabled={isViewOpen}
                        className={
                          formErrors.level
                            ? "w-full border border-red-600 rounded-md px-3 py-2 text-sm focus:ring-red-600"
                            : "w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        }
                      >
                        <option value="">Choose</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                      {formErrors.level && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.level.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructor
                      </label>
                      <select
                        {...register("InstructorId", {
                          validate: (value) => {
                            if (!value || value.trim() === "") {
                              return "Instructor is required";
                            }
                          },
                        })}
                        className={
                          formErrors.InstructorId
                            ? "w-full border border-red-600 rounded-md px-3 py-2 text-sm focus:ring-red-600"
                            : "w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        }
                        disabled={isViewOpen}
                      >
                        <option value="">Choose</option>
                        {instructors.map((instructor) => (
                          <option key={instructor.id} value={instructor.id}>
                            {instructor.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.InstructorId && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.InstructorId.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cost
                      </label>
                      <input
                        type="number"
                        placeholder="Enter Cost"
                        {...register("cost", {
                          required: "Cost is required",
                          min: { value: 1, message: "Cost cannot be zero" },
                        })}
                        className={
                          formErrors.cost
                            ? "w-full border border-red-600 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-600"
                            : "w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        }
                        disabled={isViewOpen}
                      />
                      {formErrors.cost && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.cost.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Hours
                      </label>
                      <input
                        type="number"
                        placeholder="Enter Total Hours"
                        {...register("totalHours", {
                          required: "Total hours is required",
                          min: {
                            value: 1,
                            message: "Total hours must be greater than 0",
                          },
                        })}
                        className={
                          formErrors.totalHours
                            ? "w-full border border-red-600 rounded-md px-3 py-2 text-sm focus:ring-red-600"
                            : "w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        }
                        disabled={isViewOpen}
                      />
                      {formErrors.totalHours && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.totalHours.message}
                        </p>
                      )}
                    </div>

                    <div>
                      {/* ✅ Hidden input for RHF validation */}
                      <input
                        type="hidden"
                        {...register("rate", {
                          required: "Rate is required",
                          min: {
                            value: 1,
                            message: "Rate must be at least 1 star",
                          },
                          valueAsNumber: true,
                        })}
                        disabled={isViewOpen}
                        value={localRate}
                      />

                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rate
                      </label>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isSelected = star <= currentRate;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRateClick(star)}
                              disabled={isViewOpen}
                              className={`w-6 h-6 transition-colors duration-200 ${
                                isSelected ? "text-yellow-400" : "text-gray-300"
                              } hover:text-yellow-300`}
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
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.rate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <TextEditor
                        initialContent={description}
                        {...register("description")}
                        disabled={isViewOpen}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certification
                      </label>
                      <TextEditor
                        initialContent={certification}
                        {...register("certification")}
                        disabled={isViewOpen}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="px-6 pb-6">
                  <div className="border-b px-4 py-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-gray-600 mr-2 cursor-pointer"
                      onClick={() => setCurrentStep(1)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                      />
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-800">
                      Course Content
                    </h3>
                  </div>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="mb-6 p-4 bg-gray-50 rounded-lg relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeContent(index)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
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
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                          />
                        </svg>
                      </button>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Name"
                          {...register(`courseContent.${index}.contentName`, {
                            required: "Content name is required",
                          })}
                          className={
                            formErrors.courseContent?.[index]?.contentName
                              ? "w-full px-3 py-2 border border-red-600 rounded-md focus:ring-2 ring-red-600"
                              : "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2"
                          }
                          disabled={isViewOpen}
                        />
                        {formErrors.courseContent?.[index]?.contentName && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              formErrors.courseContent[index].contentName
                                .message
                            }
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lectures Number
                          </label>
                          <input
                            type="number"
                            placeholder="Enter Lectures Number"
                            {...register(
                              `courseContent.${index}.lecturesNumber`,
                              {
                                required: "Lectures number is required",
                                min: {
                                  value: 1,
                                  message:
                                    "Lectures number must be greater than 0",
                                },
                              }
                            )}
                            className={
                              formErrors.courseContent?.[index]?.lecturesNumber
                                ? "w-full px-3 py-2 border border-red-600 rounded-md focus:ring-2 ring-red-600"
                                : "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            }
                            disabled={isViewOpen}
                          />
                          {formErrors.courseContent?.[index]
                            ?.lecturesNumber && (
                            <p className="text-red-500 text-xs mt-1">
                              {
                                formErrors.courseContent[index].lecturesNumber
                                  .message
                              }
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time
                          </label>
                          <input
                            type="number"
                            placeholder="Enter Time"
                            {...register(`courseContent.${index}.time`, {
                              required: "Time is required",
                              min: {
                                value: 1,
                                message: "Time must be greater than 0",
                              },
                            })}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                              formErrors.courseContent?.[index]?.time
                                ? "border-red-600 ring-red-200"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                            disabled={isViewOpen}
                          />
                          {formErrors.courseContent?.[index]?.time && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.courseContent[index].time.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {!isViewOpen && (
                    <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
                        onClick={addContent}
                        disabled={isViewOpen}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 
                        0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                        Add Another Content
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 rounded-b-2xl border-t border-gray-200 bg-white px-6 py-4">
                <Link
                  to={link}
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center rounded-md border border-red-200 bg-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100"
                >
                  Cancel
                </Link>
                {!isViewOpen ? (
                  <button
                    type={currentStep === 2 ? "submit" : "button"}
                    onClick={currentStep === 1 ? onNext : onSubmit}
                    className="w-full text-center rounded-md bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-black"
                  >
                    {currentStep === 1 ? "Next" : "Add"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onNext}
                    className="w-full text-center rounded-md bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-black"
                    disabled={currentStep === 2}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
