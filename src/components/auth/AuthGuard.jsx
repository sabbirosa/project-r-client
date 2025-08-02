import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getUserPermissions, isActiveUser } from "../../utils/authUtils";
import LoadingSpinner from "../ui/LoadingSpinner";

const AuthGuard = ({ 
  children, 
  requiredRoles = [], 
  requireActive = true,
  redirectTo = "/login",
  fallback = null 
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      console.log("AuthGuard: User not authenticated, redirecting to login");
      navigate(redirectTo, { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }

    // Check if user is active (if required)
    if (requireActive && !isActiveUser(user)) {
      console.log("AuthGuard: User account is blocked");
      navigate("/blocked", { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }

    // Check role requirements
    if (requiredRoles.length > 0) {
      const userPermissions = getUserPermissions(user);
      const hasRequiredRole = requiredRoles.some(role => userPermissions[`is${role.charAt(0).toUpperCase() + role.slice(1)}`]);
      
      if (!hasRequiredRole) {
        console.log("AuthGuard: User lacks required roles:", { 
          userRole: user.role, 
          requiredRoles 
        });
        navigate("/unauthorized", { 
          state: { from: location.pathname },
          replace: true 
        });
        return;
      }
    }
  }, [user, isAuthenticated, loading, requiredRoles, requireActive, navigate, location, redirectTo]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show fallback if provided and user is not authenticated
  if (!isAuthenticated || !user) {
    return fallback;
  }

  // Check if user is active (if required)
  if (requireActive && !isActiveUser(user)) {
    return fallback;
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const userPermissions = getUserPermissions(user);
    const hasRequiredRole = requiredRoles.some(role => userPermissions[`is${role.charAt(0).toUpperCase() + role.slice(1)}`]);
    
    if (!hasRequiredRole) {
      return fallback;
    }
  }

  // User is authenticated and authorized
  return children;
};

export default AuthGuard; 