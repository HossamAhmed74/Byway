import React from "react";
import Logo from "../../assets/Byway (1).png";
import { Link } from "react-router-dom";
import { usePublicAuthChecker } from "../../services/authService";

export default function Header() {
  const { isLoggedIn , username} = usePublicAuthChecker();
  return (
    <header className="bg-white shadow">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Brand */}
        <div className="flex items-center mr-5">
          <img src={Logo} alt="Logo" className="h-8 w-auto ml-3" />
          <h4 className=" text-lg text-gray-800 mr-3">Byway</h4>
        </div>

        {/* Middle: Search bar */}
        <div className="hidden md:flex flex-1 justify-center px-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-md rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />

          <Link to= {isLoggedIn ? "/courses" : "/designCourses"}  className="ml-3 mt-1">
            Courses
          </Link>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-4">
          <Link
            className="rounded-md border border-gray-500 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 "
            to="/login"
          >
            Login
          </Link>

          <Link
            className="rounded-md bg-gray-700 px-5 py-2.5 text-sm font-medium text-white"
            to="/signUp"
          >
            Sign Up
          </Link>
        </div>
      </div>
      <hr />
    </header>
  );
}
