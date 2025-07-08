import { createBrowserRouter } from "react-router";
import DashboardLayout from "../layouts/DashboardLayout";
import RootLayout from "../layouts/RootLayout";
import CreateDonationRequest from "../pages/CreateDonationRequest";
import Dashboard from "../pages/Dashboard";
import EditDonationRequest from "../pages/EditDonationRequest";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyDonationRequests from "../pages/MyDonationRequests";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
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
      // Add more public routes here (search, blog, donation-requests, etc.)
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
        element: <MyDonationRequests />,
      },
      {
        path: "create-donation-request",
        element: <CreateDonationRequest />,
      },
      {
        path: "edit-donation-request/:id",
        element: <EditDonationRequest />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      
      // Admin/Volunteer routes
      {
        path: "all-blood-donation-request",
        element: <div>All Blood Donation Requests</div> // TODO: Create this component
      },
      {
        path: "content-management",
        element: <div>Content Management</div> // TODO: Create this component
      },
      {
        path: "content-management/add-blog",
        element: <div>Add Blog</div> // TODO: Create this component
      },
      
      // Admin only routes
      {
        path: "all-users",
        element: <div>All Users</div> // TODO: Create this component
      },
      {
        path: "funding",
        element: <div>Funding</div> // TODO: Create this component
      },
    ],
  },
  
  // Public routes outside of main layout
  {
    path: "search",
    element: <div>Search Donors</div>, // TODO: Create this component
  },
  {
    path: "donation-requests",
    element: <div>Blood Donation Requests</div>, // TODO: Create this component
  },
  {
    path: "donation-requests/:id",
    element: (
      <PrivateRoute>
        <div>Donation Request Details</div> {/* TODO: Create this component */}
      </PrivateRoute>
    ),
  },
  {
    path: "blog",
    element: <div>Blog</div>, // TODO: Create this component
  },
  {
    path: "blog/:id",
    element: <div>Blog Post</div>, // TODO: Create this component
  },
  
  // 404 Route
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-8">Page not found</p>
          <a href="/" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors">
            Go Home
          </a>
        </div>
      </div>
    ),
  },
]);

export default router;
