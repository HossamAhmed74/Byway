import React from "react";
import Byway from "../../assets/Byway (1).png";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { cartItemsAtom } from "../Jotai/cartItems/cartAtom";
import { usePublicAuthChecker } from "../../services/authService";
import { tokenAtom ,usernameAtom} from "../Jotai/auth/authAtoms";
import toast from "react-hot-toast";

const HeaderWithLogin = () => {
  const { isLoggedIn , username} = usePublicAuthChecker();
  const [cartItemCount] = useAtom(cartItemsAtom);
  const [token , setToken] = useAtom(tokenAtom);

  const logOut = () => {
    localStorage.removeItem("token");
    setToken('');
    toast.success("Logged out successfully!");
    window.location.href = "/login";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={Byway} alt="Logo" className="h-6 w-6" />
          <h1 className="font-bold text-lg text-gray-800">Byway</h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4 mr-9">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4 ml-5">
          {/* Courses Link (same regardless of login) */}
          <Link
            to= {isLoggedIn ? "/courses" : "/designCourses"}
            className="text-gray-700 hover:text-blue-600 font-medium relative right-64"
          >
            Courses
          </Link>

          {/* Cart */}

            <div className="relative">
              <Link
                to="/shoppingCart"
                className="text-gray-700 hover:text-blue-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M14 13.1V12H4.6l.6-1.1l9.2-.9L16 4H3.7L3 1H0v1h2.2l2.1 8.4L3 13v1.5c0 .8.7 1.5 1.5 1.5S6 15.3 6 14.5S5.3 13 4.5 13H12v1.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.7-.4-1.2-1-1.4z" />
                </svg>
              </Link>
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white 
              text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {cartItemCount.length}
              </span>
            </div>

          {/* MAIN CONDITIONAL AREA */}
          <div
            className={
              isLoggedIn
                ? "flex items-center gap-4" // Logged in
                : "flex items-center gap-4" // Logged out (same wrapper)
            }
          >
              <>
                {/* Logout Button */}
                <button
                  onClick={logOut}
                  className="text-gray-700 hover:text-blue-600"
                >
                  <svg
                    viewBox="0 0 17 16"
                    className="w-6 h-6"
                    fill="currentColor"
                  >
                    <g fillRule="evenodd">
                      <path d="M9.995 4.917h1.992V0H1l8.026 2.666v12.251L1.321 13l-.215.829l8.89 2.153v-3.085l1.99.018V9.042h-1.99V4.917z" />
                      <path d="m15.904 7-2.87-2.932v1.987H11v1.916h2.034v2.062L15.904 7z" />
                    </g>
                  </svg>
                </button>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-medium">
                {username ? username.charAt(0).toUpperCase() : "G"}
              </div>
              </>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderWithLogin;
