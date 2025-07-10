import { useState } from "react";
import { FaBlog, FaChevronDown, FaDonate, FaHome, FaSignInAlt, FaSignOutAlt, FaTachometerAlt, FaUser, FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "./Logo";

function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <Logo theme={"dark"} />

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
              >
                <FaHome className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/donation-requests"
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Blood Requests
              </Link>
              
              <Link
                to="/blog"
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
              >
                <FaBlog className="h-4 w-4" />
                <span>Blog</span>
              </Link>

              {isAuthenticated() && (
                <Link
                  to="/funding"
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                >
                  <FaDonate className="h-4 w-4" />
                  <span>Funding</span>
                </Link>
              )}
            </div>

            {/* Authentication Section */}
            <div className="flex items-center space-x-4">
              {!isAuthenticated() ? (
                /* Not Authenticated */
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                  >
                    <FaSignInAlt className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                  >
                    <FaUserPlus className="h-4 w-4" />
                    <span>Join as Donor</span>
                  </Link>
                </div>
              ) : (
                /* Authenticated */
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover border-2 border-red-100"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                        <FaUser className="h-4 w-4 text-red-600" />
                      </div>
                    )}
                    <span className="hidden md:">{user?.name}</span>
                    <FaChevronDown className="h-3 w-3" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-200 border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        className=" px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center space-x-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaTachometerAlt className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center space-x-2"
                      >
                        <FaSignOutAlt className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
  )
}

export default Navbar