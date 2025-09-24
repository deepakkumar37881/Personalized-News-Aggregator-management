import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Book,
  Clock,
  User,
  LogOut,
  Home,
  Bookmark,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/userSlice";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const sidebarRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when sidebar is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-white/95 backdrop-blur-lg text-gray-900 shadow-lg transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-72 z-50 border-r border-gray-200 p-6 flex flex-col`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-600">NewsHub</h2>
        </div>

        <ul className="space-y-3 flex-grow">
          {["home", "sources", "latest-news", "saved"].map((item, index) => {
            const icons = [Home, Book, Clock, Bookmark];
            const labels = ["Home", "Sources", "Latest", "Saved"];
            const Icon = icons[index];
            return (
              <NavLink
                key={item}
                to={`/${item}`}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-4 rounded-lg transition-all duration-200 text-lg font-medium hover:bg-blue-100 hover:text-blue-700 ${
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
                  }`
                }
              >
                <Icon className="w-6 h-6" />
                <p>{labels[index]}</p>
              </NavLink>
            );
          })}
        </ul>

        {/* User Info & Logout */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-4 mb-6">
            <User className="w-8 h-8 text-gray-500" />
            <div>
              <p className="font-semibold text-gray-800 text-lg">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-4 w-full bg-red-500 text-white p-4 rounded-lg hover:bg-red-600 transition-all duration-200 text-lg font-semibold shadow-md"
          >
            <LogOut className="w-6 h-6 cursor-pointer" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Sidebar Toggle Button - Light Theme */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 bg-gray-100 text-blue-700 p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none z-50 transition-all"
        >
          <Menu size={28} />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
