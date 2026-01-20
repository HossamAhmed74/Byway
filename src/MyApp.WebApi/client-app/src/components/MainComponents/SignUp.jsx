import React, { useEffect, useState } from "react";
import Header from "./Header";
import Logo from "../../assets/Signup.png";
import FacebookIcon from "../../assets/facebook.png";
import GoogleIcon from "../../assets/google.png";
import MicrosoftIcon from "../../assets/microsoft.png";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";

export default function SignUp() {
  const [usernames, setUsernames] = useState([]);
  const [isUsernamesLoaded, setIsUsernamesLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
    reset,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  // Fetch usernames once on mount
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const usernamesRes = await fetch("/api/Account/GetUsersnames");
        if (!usernamesRes.ok) {
          throw new Error(`HTTP error! status: ${usernamesRes.status}`);
        }
        const usernamesData = await usernamesRes.json();
        setUsernames(usernamesData);
        setIsUsernamesLoaded(true);
      } catch (error) {
        console.error("Failed to fetch usernames:", error);
        setIsUsernamesLoaded(true); // Set to true even on error to prevent blocking
      }
    };
    fetchUsernames();
  }, []);

  // handle facebook login
  const FACEBOOK_APP_ID = "1898398977460957";
  const handleFacebookLogin = async (response) => {

    // Ensure we have the critical token
    if (response.accessToken) {
      const { accessToken, userID } = response;

      try {
        // 2. Send the accessToken and userID to the .NET backend for validation
        const apiResponse = await fetch("/api/account/loginWithFacebook", {
          method: "post",
          body: JSON.stringify({ accessToken, userID }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        // 3. The backend sends back your application's JWT
        const appToken = apiResponse.data.token;

        //check if there is a token in local storage
        const token = localStorage.getItem("token");
        if (token) {
          localStorage.clear("token");
          return;
        }
        // Store the token and update application state (e.g., set user logged in)
        localStorage.setItem("token", appToken);
        if (appToken) {
          toast.success("Successfully logged in with Facebook");
          window.href = "/dashboard";
        }
       
      } catch (error) {
        console.error("Error sending token to backend:", error);
        toast.error("Failed to login with Facebook. Please try again.");
      }
    } else {
      // Facebook login was cancelled or failed.
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    const idToken = response.credential;

    try {
      const fetchResponse = await fetch("/api/account/loginWithGoogle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: idToken,
        }),
      });

      // Handle non-200 responses (e.g., 401 Unauthorized, 400 Bad Request)
      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json();
        throw new Error(
          `Backend authentication failed: ${fetchResponse.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      // 3. Parse the JSON response from the backend
      const backendData = await fetchResponse.json();

      // The backend will return your application's JWT
      const appToken = backendData.token;

      // 4. Store the application token and proceed
      localStorage.setItem("token", appToken);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Authentication Error:", error.message);
    }
  };

  // Form submission
  const onSubmit = async (data) => {
    const registerUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerUser),
      });
      const result = await response.json();

      if (response.ok) {
        reset();
        window.location.href = "/login";
      } else {
        console.error("Server error:", result);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="grid grid-cols-12 overflow-hidden">
        <div className="col-span-5">
          <img src={Logo} alt="Logo" className="h-full w-full object-contain" />
        </div>
        <div className="col-span-7 bg-white p-10 shadow rounded-lg justify-center">
          <div className="mt-9">
            <h1 className="text-center text-3xl font-bold mb-6">
              Create your Account
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    {...register("firstName", {
                      required: "First Name is required",
                      minLength: {
                        value: 3,
                        message: "First Name must be at least 3 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "First Name should contain only letters",
                      },
                    })}
                    className={
                      errors.firstName
                        ? "w-full border border-red-600 rounded-md p-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                        : "w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    }
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    {...register("lastName", {
                      required: "Last Name is required",
                      minLength: {
                        value: 3,
                        message: "Last Name must be at least 3 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "Last Name should contain only letters",
                      },
                    })}
                    className={
                      errors.lastName
                        ? "w-full border border-red-600 rounded-md p-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                        : "w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    }
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    maxLength: {
                      value: 20,
                      message: "Username must not exceed 20 characters",
                    },
                    pattern: {
                      value: /^[A-Za-z0-9_]+$/,
                      message:
                        "Username can only contain letters, numbers, and underscores",
                    },
                    validate: (value) => {
                      if (!isUsernamesLoaded) return true;
                      return (
                        !usernames.includes(value) ||
                        "Username is already taken"
                      );
                    },
                  })}
                  placeholder="Username"
                  className={
                    errors.username
                      ? "w-full border border-red-600 rounded-md p-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      : "w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  }
                />
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  placeholder="Email"
                  className={
                    errors.email
                      ? "w-full border border-red-600 rounded-md p-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      : "w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  }
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password + Confirm Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                        message:
                          "Password must contain uppercase, number, and special character",
                      },
                    })}
                    placeholder="Password"
                    className={
                      errors.password
                        ? "w-full border border-red-600 rounded-md p-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                        : "w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    }
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    placeholder="Confirm Password"
                    className={
                      errors.confirmPassword
                        ? "w-full border border-red-600 rounded-md p-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                        : "w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    }
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="inline-flex gap-2 rounded border-3 border-black mt-9 w-15 px-6 py-3 text-white bg-black relative top-[1pc]"
              >
                <span className="text-sm font-medium">Create Your Account</span>
                <svg
                  className="size-5 shadow-sm rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Footer Text */}
          <div className="flex flex-col items-center p-8">
            <div className="flex items-center w-full max-w-lg mb-6 text-gray-500">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-4 text-sm font-medium">Sign in with</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <div className="flex flex-row gap-4 justify-center">
              <FacebookLogin
                appId={FACEBOOK_APP_ID}
                fields="name,email,picture"
                callback={handleFacebookLogin}
                icon="fa-facebook"
                textButton="facebook"
                cssClass="custom-fb-button"
              />

              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {}}
                size="large"
                width="100%"
                className="custom-google-button"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
