import { useState } from "react";
import { FaBars, FaChartBar, FaHandHoldingHeart, FaHome, FaTimes, FaTint, FaUser, FaUsers } from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router";
import Logo from "../components/shared/Logo";
import { Button } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: FaHome
      },
      {
        name: "Profile",
        href: "/dashboard/profile",
        icon: FaUser
      }
    ];

    const donorItems = [
      {
        name: "My Donation Requests",
        href: "/dashboard/my-donation-requests",
        icon: FaTint
      },
      {
        name: "Create Donation Request",
        href: "/dashboard/create-donation-request",
        icon: FaHandHoldingHeart
      }
    ];

    const volunteerItems = [
      {
        name: "All Blood Donations",
        href: "/dashboard/all-blood-donation-request",
        icon: FaTint
      },
      {
        name: "Content Management",
        href: "/dashboard/content-management",
        icon: FaChartBar
      }
    ];

    const adminOnlyItems = [
      {
        name: "All Users",
        href: "/dashboard/all-users",
        icon: FaUsers
      }
    ];

    // Build navigation based on user role
    let items = [...baseItems];
    
    if (user?.role === "donor") {
      items = [...items, ...donorItems];
    } else if (user?.role === "volunteer") {
      items = [...items, ...volunteerItems];
    } else if (user?.role === "admin") {
      // Admin gets access to everything
      items = [...items, ...donorItems, ...volunteerItems, ...adminOnlyItems];
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  const isActive = (href) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl dark:shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center justify-between h-16 px-4 bg-red-600 dark:bg-red-700 shadow-lg">
          <Logo />
          <button
            onClick={closeSidebar}
            className="lg:hidden text-white hover:text-red-200 p-1 rounded transition-colors duration-200"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeSidebar}
                  className={`group flex items-center px-3 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href) ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center space-x-3 mb-4">
            <img
              className="h-10 w-10 rounded-full object-cover border-2 border-red-200 dark:border-red-700 shadow-sm"
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=ef4444&color=fff`}
              alt={user?.name}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize font-medium">{user?.role}</p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-60 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg transition-colors duration-200"
            >
              <FaBars className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Dashboard
            </h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;