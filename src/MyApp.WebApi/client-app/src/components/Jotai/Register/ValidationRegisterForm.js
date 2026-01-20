export const validateRegisterForm = (formData, usernames = []) => {
    const errors = {};

    // Username
    if (!formData.username?.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (usernames.includes(formData.username)) {
      errors.username = "Username already exists";
    }
  
    // Email
    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
  
    // Password
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      errors.password = "Password must contain at least one special character";
    }
  
    // Confirm Password
    if (!formData.confirmPassword?.trim()) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  
    // First Name
    if (!formData.firstName?.trim()) {
      errors.firstName = "First Name is required";
    } else if (formData.firstName.length < 3) {
      errors.firstName = "First Name must be at least 3 characters";
    }
  
    // Last Name
    if (!formData.lastName?.trim()) {
      errors.lastName = "Last Name is required";
    } else if (formData.lastName.length < 3) {
      errors.lastName = "Last Name must be at least 3 characters";
    }
  
    return errors;
  };
  