/**
 * Authentication Utilities
 * Helper functions for the token-based authentication system
 */

// Token Storage Keys
export const TOKEN_KEY = "bloodDonation_token";
export const USER_KEY = "bloodDonation_user";

// Token Management Functions
export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getStoredUser = () => {
  try {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Error parsing stored user:", error);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const setStoredUser = (userData) => {
  if (userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// JWT Token Utilities
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Decode JWT payload (note: this doesn't verify the signature, just reads the payload)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token has expired
    if (payload.exp && payload.exp < currentTime) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Assume expired if we can't decode
  }
};

export const getTokenPayload = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error("Error getting token payload:", error);
    return null;
  }
};

export const getTokenExpirationTime = (token) => {
  const payload = getTokenPayload(token);
  return payload?.exp ? new Date(payload.exp * 1000) : null;
};

// Create authenticated headers for API requests
export const createAuthHeaders = (additionalHeaders = {}) => {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Check if user is authenticated (has valid token)
export const isAuthenticated = () => {
  const token = getStoredToken();
  const user = getStoredUser();
  return !!(token && user && !isTokenExpired(token));
};

// Check if user has required role
export const hasRole = (user, role) => {
  return user?.role === role;
};

// Check if user is admin
export const isAdmin = (user) => {
  return hasRole(user, "admin");
};

// Check if user is volunteer
export const isVolunteer = (user) => {
  return hasRole(user, "volunteer");
};

// Check if user is donor
export const isDonor = (user) => {
  return hasRole(user, "donor");
};

// Check if user is active (not blocked)
export const isActiveUser = (user) => {
  return user?.status === "active";
};

// Check if user has any of the specified roles
export const hasAnyRole = (user, roles) => {
  return roles.includes(user?.role);
};

// Check if user has all of the specified roles
export const hasAllRoles = (user, roles) => {
  return roles.every(role => hasRole(user, role));
};

// Get user display name
export const getUserDisplayName = (user) => {
  return user?.name || user?.email || "Unknown User";
};

// Get user initials for avatar
export const getUserInitials = (user) => {
  if (!user?.name) return "U";
  
  const names = user.name.split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Check if user can access admin features
export const canAccessAdmin = (user) => {
  return isAdmin(user) || isVolunteer(user);
};

// Check if user can manage users
export const canManageUsers = (user) => {
  return isAdmin(user);
};

// Check if user can manage content
export const canManageContent = (user) => {
  return isAdmin(user) || isVolunteer(user);
};

// Check if user can view analytics
export const canViewAnalytics = (user) => {
  return isAdmin(user) || isVolunteer(user);
};

// Check if user can donate blood
export const canDonateBlood = (user) => {
  return isActiveUser(user) && (isDonor(user) || isVolunteer(user) || isAdmin(user));
};

// Check if user can request blood donation
export const canRequestBlood = (user) => {
  return isActiveUser(user);
};

// Get user permissions object
export const getUserPermissions = (user) => {
  if (!user) return {};
  
  return {
    isAdmin: isAdmin(user),
    isVolunteer: isVolunteer(user),
    isDonor: isDonor(user),
    isActive: isActiveUser(user),
    canAccessAdmin: canAccessAdmin(user),
    canManageUsers: canManageUsers(user),
    canManageContent: canManageContent(user),
    canViewAnalytics: canViewAnalytics(user),
    canDonateBlood: canDonateBlood(user),
    canRequestBlood: canRequestBlood(user),
  };
};

// Format user role for display
export const formatUserRole = (role) => {
  const roleMap = {
    admin: "Administrator",
    volunteer: "Volunteer",
    donor: "Blood Donor",
  };
  
  return roleMap[role] || role;
};

// Get user status color for UI
export const getUserStatusColor = (status) => {
  const statusColors = {
    active: "green",
    blocked: "red",
    pending: "yellow",
  };
  
  return statusColors[status] || "gray";
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Sanitize user input for security
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers
};

// Generate secure random string
export const generateSecureString = (length = 32) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Check if running in development
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

// Check if running in production
export const isProduction = () => {
  return import.meta.env.PROD;
};

// Get API base URL
export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL;
};

// Create API request headers
export const createApiHeaders = (additionalHeaders = {}) => {
  return {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };
};

// Handle API errors
export const handleApiError = (error) => {
  console.error("API Error:", error);
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        return {
          type: "AUTH_ERROR",
          message: data?.message || "Authentication failed",
          code: data?.code || "UNAUTHORIZED",
        };
      case 403:
        return {
          type: "FORBIDDEN",
          message: data?.message || "Access denied",
          code: data?.code || "FORBIDDEN",
        };
      case 404:
        return {
          type: "NOT_FOUND",
          message: data?.message || "Resource not found",
          code: "NOT_FOUND",
        };
      case 422:
        return {
          type: "VALIDATION_ERROR",
          message: data?.message || "Validation failed",
          errors: data?.errors || [],
        };
      case 500:
        return {
          type: "SERVER_ERROR",
          message: "Internal server error",
          code: "SERVER_ERROR",
        };
      default:
        return {
          type: "API_ERROR",
          message: data?.message || "An error occurred",
          code: `HTTP_${status}`,
        };
    }
  } else if (error.request) {
    // Network error
    return {
      type: "NETWORK_ERROR",
      message: "Network error - please check your connection",
      code: "NETWORK_ERROR",
    };
  } else {
    // Other error
    return {
      type: "UNKNOWN_ERROR",
      message: error.message || "An unknown error occurred",
      code: "UNKNOWN_ERROR",
    };
  }
}; 