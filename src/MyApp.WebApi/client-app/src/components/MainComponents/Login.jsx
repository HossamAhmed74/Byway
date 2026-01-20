import React from "react";
import Header from "./Header";
import Logo from "../../assets/Login.png";
import FacebookIcon from "../../assets/facebook.png";
import LinkedIn from "../../assets/LinkedIn_logo.png";
import MicrosoftIcon from "../../assets/microsoft.png";
import { loginFormAtom, loginErrorsAtom } from "../Jotai/Login/LoginAtoms";
import { useAtom } from "jotai";
import { validateLoginForm } from "../Jotai/Login/ValidationLoginForm";
import { useForm } from "react-hook-form";
import { usernameAtom } from "../Jotai/auth/authAtoms";
import { useAuthService } from "../../services/authService";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
export default function Login() {
  const [formData, setFormData] = useAtom(loginFormAtom);
  const [formErrors, setFormErrors] = useAtom(loginErrorsAtom);
  const [username, setUsernameAuth] = useAtom(usernameAtom);
  const { loginSuccess } = useAuthService();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle input typing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const validationErrors = validateLoginForm({ ...formData, [name]: value });
    setFormErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
  };

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

  // Validate on blur
  const handleBlur = () => {
    const validationErrors = validateLoginForm(formData);
    setFormErrors(validationErrors);
  };

  // Handle form submit
  const onSubmit = async (e, data) => {
    e.preventDefault();

    const userName = data.email;
    const password = data.password;

    const loginUser = { userName, password };

    try {
      const response = await fetch("/api/account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginUser),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error("Failed to login");
      }
      const result = await response.json();
      toast.success("Welcome back, " + result.username + "!");
      loginSuccess(result);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="grid grid-cols-12">
        {/* Left Section (Form) */}
        <div className="col-span-7 bg-white p-10 shadow rounded-lg justify-center">
          <div className="mt-9">
            <h1 className="text-center text-4xl font-bold mb-6">Sign In</h1>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xl font-bold mb-1">
                Email
              </label>
              <input
                type="text"
                id="email"
                {...register("email", {
                  required: "Email is required",
                })}
                placeholder="Enter Email"
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  formErrors.email
                    ? "w-full border border-red-600 rounded-md p-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                    : "w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                }
              />
              {formErrors.email && (
                <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xl font-bold mb-1">Password</label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                })}
                placeholder="Enter Your Password"
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  formErrors.password
                    ? "w-full border border-red-600 rounded-md p-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                    : "w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                }
              />
              {formErrors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="inline-flex gap-2 rounded border-3 border-black mt-9 w-15 px-6 py-3 text-white bg-black"
              onClick={(e) => onSubmit(e, formData)}
            >
              Login
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

          {/* Social Login Buttons */}

          {/* Social Login Buttons */}
          <div className="flex flex-col items-center p-8 mr-9">
            <div className="p-8 mr-1">
              <div className="text-center">
                <Link
                  to="/designCourses"
                  className="inline-block text-blue-600 font-medium text-base hover:underline transition"
                >
                  Sign in as a Guest
                </Link>
              </div>
            </div>
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

        {/* Right Side Image */}
        <div className="col-span-5">
          <img src={Logo} alt="Logo" className="h-full w-full object-contain" />
        </div>
      </div>
    </>
  );
}
