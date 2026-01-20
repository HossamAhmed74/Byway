export const instructorValidation = (instructor) => {
    const errors = {};

    if (!instructor.name || !instructor.name.trim()) {
        errors.name = "Name is required";
    }
    
    if (!instructor.image || instructor.image.trim() === '') {
        errors.image = "Image is required";
    }
    
    if (!instructor.jobTitle || !instructor.jobTitle.trim()) {
        errors.jobTitle = "Job title is required";
    }
    
    if (instructor.rate <= 0 || instructor.rate > 5) {
        errors.rate = "Rate must be between 1 and 5";
    }
    
    return errors;
}