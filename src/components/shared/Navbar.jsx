import { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaChevronDown,
  FaDonate,
  FaHome,
  FaMoon,
  FaSignInAlt,
  FaSignOutAlt,
  FaSun,
  FaTachometerAlt,
  FaTimes,
  FaTint,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Logo from "./Logo";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click & ESC
  useEffect(() => {
    function onDocClick(e) {
      if (!isDropdownOpen) return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    function onEsc(e) {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      await logout(); // make sure this calls backend /auth/logout (httpOnly cookie clear)
      navigate("/");
    } finally {
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const baseLinks = [
    { path: "/", label: "Home", icon: FaHome },
    { path: "/donation-requests", label: "Blood Requests", icon: FaTint },
    { path: "/blog", label: "Blog" },
  ];

  const authedLinks = isAuthenticated
    ? [
        ...baseLinks,
        { path: "/funding", label: "Funding", icon: FaDonate },
        { path: "/search", label: "Search Donors" },
      ]
    : baseLinks;

  const navItemClass = ({ isActive }) =>
    [
      "px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-200",
      isActive
        ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 shadow-sm"
        : "text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20",
    ].join(" ");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 dark:border-gray-800/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-gray-900/70 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {authedLinks.map(({ path, label, icon: Icon }) => (
              <NavLink key={path} to={path} className={navItemClass} end={path === "/"}>
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right side (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 border border-transparent hover:border-red-200 dark:hover:border-red-800"
              aria-label="Toggle dark mode"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </button>

            {/* Auth section */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <FaSignInAlt className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow"
                >
                  <FaUserPlus className="h-4 w-4" />
                  <span>Join as Donor</span>
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={isDropdownOpen}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name ?? "User avatar"}
                      className="h-8 w-8 rounded-full object-cover border-2 border-red-200 dark:border-red-700 shadow-sm"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-red-100 dark:bg-red-950/30 rounded-full grid place-items-center border border-red-200 dark:border-red-800">
                      <FaUser className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                  )}
                  <span className="hidden lg:block font-medium">{user?.name}</span>
                  <FaChevronDown className="h-3 w-3" />
                </button>

                {isDropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 capitalize font-medium mt-1">{user?.role}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      role="menuitem"
                      className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <FaTachometerAlt className="h-4 w-4" />
                        <span>Dashboard</span>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      role="menuitem"
                      className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition"
                    >
                      <div className="flex items-center gap-3">
                        <FaSignOutAlt className="h-4 w-4" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition"
              aria-label="Toggle dark mode"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 bg-white dark:bg-gray-900">
            <div className="space-y-1">
              {authedLinks.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                      isActive
                        ? "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
                    ].join(" ")
                  }
                >
                  <div className="flex items-center gap-2">
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    <span>{label}</span>
                  </div>
                </NavLink>
              ))}
            </div>

            {/* Mobile auth actions */}
            {!isAuthenticated ? (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <div className="flex items-center gap-2">
                    <FaSignInAlt className="h-4 w-4" />
                    <span>Login</span>
                  </div>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white transition"
                >
                  <div className="flex items-center gap-2">
                    <FaUserPlus className="h-4 w-4" />
                    <span>Join as Donor</span>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <div className="flex items-center gap-2">
                    <FaTachometerAlt className="h-4 w-4" />
                    <span>Dashboard</span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <div className="flex items-center gap-2">
                    <FaSignOutAlt className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
