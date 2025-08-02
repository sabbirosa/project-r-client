import { Navigate } from "react-router";
import { LoadingSpinner } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Debug logging
  console.log("PrivateRoute Debug:", {
    isAuthenticated: isAuthenticated,
    hasUser: !!user,
    loading,
    userRole: user?.role,
    userStatus: user?.status,
  });

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PrivateRoute; 