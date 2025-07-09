import { Navigate, useLocation } from "react-router";
import { LoadingSpinner } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children, requiredRole = null, requiredRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role or is in required roles array
  const hasRequiredRole = () => {
    if (requiredRole && user?.role !== requiredRole) {
      return false;
    }
    
    if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
      return false;
    }
    
    return true;
  };

  if ((requiredRole || requiredRoles.length > 0) && !hasRequiredRole()) {
    // If user doesn't have required role, redirect based on their actual role
    if (user?.role === 'admin') {
      return <Navigate to="/dashboard" replace />;
    } else if (user?.role === 'volunteer') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Check if user is blocked
  if (user?.status === 'blocked') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.348 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Blocked</h2>
          <p className="text-gray-600 mb-6">
            Your account has been blocked. Please contact support for assistance.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute; 