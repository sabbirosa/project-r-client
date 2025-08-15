import { createBrowserRouter } from "react-router";
import DashboardLayout from "../layouts/DashboardLayout";
import RootLayout from "../layouts/RootLayout";
import AddBlog from "../pages/AddBlog";
import AllBloodDonationRequests from "../pages/AllBloodDonationRequests";
import AllUsers from "../pages/AllUsers";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import BloodDonationRequests from "../pages/BloodDonationRequests";
import ContentManagement from "../pages/ContentManagement";
import CreateDonationRequest from "../pages/CreateDonationRequest";
import Dashboard from "../pages/Dashboard";
import DonationRequestDetails from "../pages/DonationRequestDetails";
import EditBlog from "../pages/EditBlog";
import EditDonationRequest from "../pages/EditDonationRequest";
import Funding from "../pages/Funding";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyDonationRequests from "../pages/MyDonationRequests";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import SearchDonors from "../pages/SearchDonors";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: "funding",
        element: (
          <PrivateRoute>
            <Funding />
          </PrivateRoute>
        ),
      },
      {
        path: "search",
        element: <SearchDonors />,
      },
      {
        path: "donation-requests",
        element: <BloodDonationRequests />,
      },
      {
        path: "donation-requests/:id",
        element: (
          <PrivateRoute>
            <DonationRequestDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "blog/:id",
        element: <BlogDetails />,
      },
      // Add more public routes here
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      // Donor routes
      {
        path: "my-donation-requests",
        element: <MyDonationRequests />
      },
      {
        path: "create-donation-request",
        element: <CreateDonationRequest />
      },
      {
        path: "edit-donation-request/:id",
        element: <EditDonationRequest />
      },
      {
        path: "profile",
        element: <Profile />
      },
      
      // Admin/Volunteer routes
      {
        path: "all-blood-donation-request",
        element: <AllBloodDonationRequests />
      },
      {
        path: "content-management",
        element: (
          <PrivateRoute requiredRoles={["admin", "volunteer"]}>
            <ContentManagement />
          </PrivateRoute>
        )
      },
      {
        path: "content-management/add-blog",
        element: (
          <PrivateRoute requiredRoles={["admin", "volunteer"]}>
            <AddBlog />
          </PrivateRoute>
        )
      },
      {
        path: "content-management/edit-blog/:id",
        element: (
          <PrivateRoute requiredRoles={["admin", "volunteer"]}>
            <EditBlog />
          </PrivateRoute>
        )
      },
      
      // Admin only routes
      {
        path: "all-users",
        element: (
          <PrivateRoute requiredRole="admin">
            <AllUsers />
          </PrivateRoute>
        )
      },

    ],
  },
  
  // 404 Route
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 text-white rounded-full mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          <div className="space-y-4">
            <a 
              href="/" 
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Home
            </a>
            <div>
              <button 
                onClick={() => window.history.back()} 
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 font-medium rounded-md transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]);

export default router;
