import { Navigate } from "react-router";
import { LoadingSpinner } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = ({ children, redirectTo = "/dashboard" }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicRoute; 