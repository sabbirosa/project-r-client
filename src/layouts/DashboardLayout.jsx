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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-start h-16 px-4 bg-red-200">
          <Logo theme={"dark"} />
          <button
            onClick={closeSidebar}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeSidebar}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-red-100 text-red-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href) ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=ef4444&color=fff`}
              alt={user?.name}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
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
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 bg-white shadow">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-900"
            >
              <FaBars className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              Dashboard
            </h1>
            <div></div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;