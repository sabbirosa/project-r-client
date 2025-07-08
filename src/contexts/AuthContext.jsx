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
  const [token, setToken] = useState(localStorage.getItem("bloodDonation_token"));

  // Initialize user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("bloodDonation_user");
    const savedToken = localStorage.getItem("bloodDonation_token");
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("bloodDonation_user");
        localStorage.removeItem("bloodDonation_token");
      }
    }
    setLoading(false);
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
      
      // Save user and token
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("bloodDonation_user", JSON.stringify(data.user));
      localStorage.setItem("bloodDonation_token", data.token);
      
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
      
      // Auto-login after successful registration
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("bloodDonation_user", JSON.stringify(data.user));
      localStorage.setItem("bloodDonation_token", data.token);
      
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
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("bloodDonation_user");
    localStorage.removeItem("bloodDonation_token");
    toast.success("Logged out successfully!");
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Profile update failed");
      }

      const data = await response.json();
      
      // Update user state
      setUser(data.user);
      localStorage.setItem("bloodDonation_user", JSON.stringify(data.user));
      
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

  // Fetch and update user data from server
  const updateUserData = async () => {
    try {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }

      const data = await response.json();
      
      // Update user state with fresh data
      setUser(data);
      localStorage.setItem("bloodDonation_user", JSON.stringify(data));
      
      return { success: true, user: data };
    } catch (error) {
      console.error("Update user data error:", error);
      return { success: false, error: error.message };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && token);
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

  // Get authorization header for API calls
  const getAuthHeaders = () => {
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const value = {
    // User state
    user,
    token,
    loading,
    
    // Authentication methods
    login,
    register,
    logout,
    updateProfile,
    updateUserData,
    
    // Helper methods
    isAuthenticated,
    hasRole,
    isAdmin,
    isVolunteer,
    isDonor,
    isActiveUser,
    getAuthHeaders,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 