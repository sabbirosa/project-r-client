import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function useAxiosSecure() {
  const { token, logout, updateUserData } = useAuth();

  axiosSecure.interceptors.request.use((config) => {
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401) {
        console.error("Unauthorized access - token may be expired");
        
        // Only auto-logout for auth-related endpoints, not for image uploads or other operations
        const isAuthEndpoint = error.config?.url?.includes('/auth/');
        const isProfileEndpoint = error.config?.url?.includes('/auth/profile');
        const isRefreshEndpoint = error.config?.url?.includes('/auth/refresh');
        
        if (isAuthEndpoint && !isProfileEndpoint && !isRefreshEndpoint) {
          console.log("Authentication endpoint failed - logging out");
          logout();
        } else {
          console.warn("Non-auth endpoint returned 401 - may need token refresh");
          
          // Try to refresh user data to get updated token/user info
          if (updateUserData && typeof updateUserData === 'function') {
            try {
              const result = await updateUserData();
              if (!result.success) {
                console.log("User data refresh failed - logging out");
                logout();
              }
            } catch (refreshError) {
              console.error("Error refreshing user data:", refreshError);
              logout();
            }
          }
        }
      }
      
      // Handle 403 Forbidden errors
      if (error.response?.status === 403) {
        const errorMessage = error.response?.data?.message || '';
        console.error("403 Forbidden Error Details:", {
          url: error.config?.url,
          method: error.config?.method,
          message: errorMessage,
          hasAuthHeader: !!error.config?.headers?.authorization,
          timestamp: new Date().toISOString()
        });
        
        // Check if this is a role-based access issue or a blocked account
        if (errorMessage.toLowerCase().includes('blocked') || 
            errorMessage.toLowerCase().includes('suspended') ||
            errorMessage.toLowerCase().includes('administrator')) {
          console.log("Account appears to be blocked - logging out");
          logout();
        } else if (errorMessage.toLowerCase().includes('access required') || 
                   errorMessage.toLowerCase().includes('permission')) {
          console.warn("Access forbidden - user may lack required permissions for this resource");
          // Don't auto-logout for permission issues, let the UI handle it
        } else {
          console.warn("Unknown 403 error - could be authentication timing issue");
          // For unknown 403 errors, try refreshing user data once
          if (updateUserData && typeof updateUserData === 'function' && !originalRequest._retry) {
            console.log("Attempting to refresh user data for unknown 403 error");
            originalRequest._retry = true;
            try {
              const result = await updateUserData();
              if (result.success) {
                console.log("User data refreshed, retrying original request");
                // Update the authorization header with potentially new token
                if (originalRequest.headers && token) {
                  originalRequest.headers.authorization = `Bearer ${token}`;
                }
                return axiosSecure(originalRequest);
              }
            } catch (refreshError) {
              console.error("Failed to refresh user data:", refreshError);
            }
          }
        }
      }
      
      return Promise.reject(error);
    }
  );

  return axiosSecure;
}

export default useAxiosSecure; 