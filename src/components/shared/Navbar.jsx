import { useState } from "react";
import { FaBars, FaChevronDown, FaDonate, FaHome, FaSignInAlt, FaSignOutAlt, FaTachometerAlt, FaTimes, FaTint, FaUser, FaUserPlus } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "./Logo";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Check if current route is active
  const isActiveRoute = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Get navigation links based on authentication status
  const getNavigationLinks = () => {
    const baseLinks = [
      { path: "/", label: "Home", icon: FaHome },
      { path: "/donation-requests", label: "Blood Requests", icon: FaTint },
      { path: "/blog", label: "Blog", icon: null },
    ];

    if (isAuthenticated) {
      return [
        ...baseLinks,
        { path: "/funding", label: "Funding", icon: FaDonate },
        { path: "/search", label: "Search Donors", icon: null },
      ];
    }

    return baseLinks;
  };

  const navigationLinks = getNavigationLinks();

  return (
    <nav className="bg-white shadow-lg border-b border-red-100 sticky top-0 z-50 w-full">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Logo theme={"dark"} />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${
                      isActiveRoute(link.path)
                        ? "text-red-600 bg-red-50"
                        : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Authentication Section */}
            <div className="hidden md:flex items-center space-x-4">
              {!isAuthenticated ? (
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
                    <span className="hidden lg:block">{user?.name}</span>
                    <FaChevronDown className="h-3 w-3" />
                  </button>

                  {/* Desktop Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <FaTachometerAlt className="h-4 w-4" />
                          <span>Dashboard</span>
                        </div>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <FaSignOutAlt className="h-4 w-4" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 p-2 rounded-md transition-colors"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-6 w-6 rounded-full object-cover border border-red-100"
                      />
                    ) : (
                      <div className="h-6 w-6 bg-red-100 rounded-full flex items-center justify-center">
                        <FaUser className="h-3 w-3 text-red-600" />
                      </div>
                    )}
                  </button>

                  {/* Mobile User Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={closeMobileMenu}
                      >
                        <div className="flex items-center space-x-2">
                          <FaTachometerAlt className="h-4 w-4" />
                          <span>Dashboard</span>
                        </div>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <FaSignOutAlt className="h-4 w-4" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-red-600 p-2 rounded-md transition-colors"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-1">
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={closeMobileMenu}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActiveRoute(link.path)
                          ? "text-red-600 bg-red-50"
                          : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{link.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Authentication Links */}
              {!isAuthenticated && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <FaSignInAlt className="h-4 w-4" />
                      <span>Login</span>
                    </div>
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <FaUserPlus className="h-4 w-4" />
                      <span>Join as Donor</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar