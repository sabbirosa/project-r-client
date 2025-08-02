import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get stored token
  const getStoredToken = () => {
    return localStorage.getItem("bloodDonation_token");
  };

  // Set token in localStorage
  const setStoredToken = (token) => {
    if (token) {
      localStorage.setItem("bloodDonation_token", token);
    } else {
      localStorage.removeItem("bloodDonation_token");
    }
  };

  // Get stored user
  const getStoredUser = () => {
    try {
      const savedUser = localStorage.getItem("bloodDonation_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("bloodDonation_user");
      return null;
    }
  };

  // Set user in localStorage
  const setStoredUser = (userData) => {
    if (userData) {
      localStorage.setItem("bloodDonation_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("bloodDonation_user");
    }
  };

  // Create authenticated headers
  const createAuthHeaders = (additionalHeaders = {}) => {
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

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const token = getStoredToken();
        const storedUser = getStoredUser();

        if (!token) {
          console.log('AuthContext: No token found');
          setUser(null);
          setIsAuthenticated(false);
          return;
        }

        if (storedUser) {
          // Restore user from localStorage temporarily
          setUser(storedUser);
          setIsAuthenticated(true);
        }

        // Verify token with server
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
          method: "GET",
          headers: createAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('AuthContext: Token verified, user authenticated');
          setUser(data.user);
          setIsAuthenticated(true);
          setStoredUser(data.user); // Update stored user with fresh data
        } else {
          console.log('AuthContext: Token verification failed');
          // Clear invalid token and user data
          setStoredToken(null);
          setStoredUser(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Don't clear on network errors, keep existing session
        if (!getStoredToken()) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      
      // Store token and user data
      setStoredToken(data.token);
      setStoredUser(data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      
      console.log('AuthContext: Login successful');
      toast.success("Login successful!");
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      
      // Store token and user data (auto-login after registration)
      setStoredToken(data.token);
      setStoredUser(data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      
      console.log('AuthContext: Registration and auto-login successful');
      toast.success("Registration successful!");
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint to inform server (optional, doesn't affect client logout)
      const token = getStoredToken();
      if (token) {
        await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
          method: "POST",
          headers: createAuthHeaders(),
        }).catch(error => {
          console.warn("Server logout failed:", error);
          // Continue with client logout anyway
        });
      }
    } catch (error) {
      console.warn("Logout error:", error);
    } finally {
      // Clear client-side state regardless of server response
      setStoredToken(null);
      setStoredUser(null);
      setUser(null);
      setIsAuthenticated(false);
      console.log('AuthContext: User logged out');
      toast.success("Logged out successfully!");
    }
  };

  // Refresh user data from server
  const refreshUserData = async () => {
    try {
      const token = getStoredToken();
      if (!token) {
        return { success: false, error: "No token available" };
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setStoredUser(data.user);
        setIsAuthenticated(true);
        console.log('AuthContext: User data refreshed');
        return { success: true, user: data.user };
      } else {
        // Token is invalid, clear auth state
        console.log('AuthContext: Token invalid during refresh');
        setStoredToken(null);
        setStoredUser(null);
        setUser(null);
        setIsAuthenticated(false);
        return { success: false, error: "Authentication expired" };
      }
    } catch (error) {
      console.error("Refresh user data error:", error);
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Profile update failed");
      }

      const data = await response.json();
      
      // Update user state and storage
      setUser(data.user);
      setStoredUser(data.user);
      
      console.log('AuthContext: Profile updated successfully');
      toast.success("Profile updated successfully!");
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Profile update failed");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Get current user data from server
  const getCurrentUser = async () => {
    try {
      const token = getStoredToken();
      if (!token) {
        return { success: false, error: "No authentication token available" };
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      if (!response.ok) {
        // Handle different error scenarios
        if (response.status >= 500) {
          console.error("Server error during getCurrentUser:", response.status);
          return { success: false, error: "Server error - keeping existing user data" };
        }
        
        // Clear auth on authentication errors
        if (response.status === 401 || response.status === 403) {
          console.warn("Authentication failed during getCurrentUser - clearing session");
          setStoredToken(null);
          setStoredUser(null);
          setUser(null);
          setIsAuthenticated(false);
          return { success: false, error: "Authentication failed" };
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch user data`);
      }

      const data = await response.json();
      
      // Only update if we got valid user data
      if (data && (data._id || data.id)) {
        setUser(data);
        setStoredUser(data);
        setIsAuthenticated(true);
        console.log("AuthContext: Current user data fetched successfully");
        return { success: true, user: data };
      } else {
        console.error("Invalid user data received:", data);
        return { success: false, error: "Invalid user data received" };
      }
    } catch (error) {
      console.error("Get current user error:", error);
      // Don't clear user data on network/fetch errors
      return { success: false, error: error.message };
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole("admin");
  };

  // Check if user is volunteer
  const isVolunteer = () => {
    return hasRole("volunteer");
  };

  // Check if user is donor
  const isDonor = () => {
    return hasRole("donor");
  };

  // Check if user is active (not blocked)
  const isActiveUser = () => {
    return user?.status === "active";
  };

  // Get authorization header for API calls (backward compatibility)
  const getAuthHeaders = () => {
    return createAuthHeaders();
  };

  const value = {
    // User state
    user,
    loading,
    isAuthenticated,
    
    // Authentication methods
    login,
    register,
    logout,
    refreshUserData,
    updateProfile,
    getCurrentUser,
    
    // Token management
    getStoredToken,
    createAuthHeaders,
    
    // Helper methods
    hasRole,
    isAdmin,
    isVolunteer,
    isDonor,
    isActiveUser,
    getAuthHeaders, // For backward compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 