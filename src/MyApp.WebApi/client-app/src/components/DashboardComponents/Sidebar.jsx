import React from "react";
import BywayImage from "../../assets/Byway (1).png";
import { Link } from "react-router-dom";

function Sidebar() {  
const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
  const navItemsSidebar = [
    {
      label: "Dashboard",
      link: "/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875
             c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125
             c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
    },
    {
      label: "Instructors",
      link: "/instructors",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501
             20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1
             12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      ),
    },
    {
      label: "Courses",
      link: "/courses",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 19V6a1 1 0 0 1 1-1h4.032a1 1 0 0 1
             .768.36l1.9 2.28a1 1 0 0 0 .768.36H16a1
             1 0 0 1 1 1v1M3 19l3-8h15l-3 8H3Z"
          />
        </svg>
      ),
    },
    {
      label: "Logout",
      link: "/login",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5
             3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25
             2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0
             1-2.25-2.25V15m-3 0-3-3m0 0
             3-3m-3 3H15"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white">
      <div className="h-16 flex items-center px-4 gap-3">
        <img src={BywayImage} alt="Byway Logo" className="h-8 w-8 ml-5" />
        <span className="font-semibold">Byway</span>
      </div>

      <nav className="px-3 py-2 space-y-1">
        {navItemsSidebar.map(({ label, icon, link }, index) => (
          <React.Fragment key={label}>
            {/* Add a line before Logout */}
            {label === "Logout" && <hr className="my-2 border-gray-300" />}

            <Link
              to={link}
              onClick={label === "Logout" ? logout : undefined}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <span className="shrink-0">{icon}</span>
              <span className="text-sm">{label}</span>
            </Link>
          </React.Fragment>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
