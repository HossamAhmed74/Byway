export const validateCourse = (course) => {
  const errors = {};

  // More specific validation messages
  if (!course.name?.trim()) {
    errors.name = 'Course name is required';
  } else if (course.name.trim().length < 3) {
    errors.name = 'Course name must be at least 3 characters';
  } if (!course.level) errors.level = 'Level is required';
  if (!course.InstructorId) errors.InstructorId = 'Instructor is required';
  if (!course.categoryId) errors.categoryId = 'Category is required';
  if (course.cost === 0) errors.cost = 'Cost cannot be zero';
  if (course.cost < 0) errors.cost = 'Cost cannot be negative';
  if (course.totalHours <= 0) errors.totalHours = 'Total hours must be greater than 0';
  if (!course.image) errors.image = 'Image is required';

  if (!course.courseContent || course.courseContent.length === 0) {
    errors.courseContent = ['At least one content section is required'];
  } else {
    errors.courseContent = course.courseContent.map((content) => {
      const contentError = {};
      if (!content.contentName?.trim()) contentError.contentName = 'Content name is required';
      if (content.lecturesNumber <= 0 || content.lecturesNumber === 0) contentError.lecturesNumber = 'Lectures number must be greater than 0';
      if (content.time <= 0 || content.time === 0) contentError.time = 'Time must be greater than 0';
      return contentError; // always an object (maybe empty)
    });
  }

  return errors;
};
