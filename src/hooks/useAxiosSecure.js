import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Use Authorization headers instead of cookies
});

function useAxiosSecure() {
  const { logout, refreshUserData, getStoredToken, createAuthHeaders } = useAuth();

  // Request interceptor - Add Authorization header to all requests
  axiosSecure.interceptors.request.use((config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor - Handle authentication errors
  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401) {
        console.error("Unauthorized access - token may be expired or invalid");
        
        // Check if this is an auth endpoint to avoid infinite loops
        const isAuthEndpoint = error.config?.url?.includes('/auth/');
        const isVerifyEndpoint = error.config?.url?.includes('/auth/verify');
        
        // For auth endpoints (except verify), just reject the error
        if (isAuthEndpoint && !isVerifyEndpoint) {
          console.log("Auth endpoint returned 401 - not retrying");
          return Promise.reject(error);
        }
        
        // For verify endpoint or non-auth endpoints, try to refresh user data once
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          console.log("Attempting to refresh user authentication");
          
          try {
            const result = await refreshUserData();
            if (result.success) {
              console.log("User data refreshed successfully, retrying original request");
              // Update the Authorization header with the (potentially) new token
              const newToken = getStoredToken();
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return axiosSecure(originalRequest);
            } else {
              console.log("User data refresh failed - logging out");
              logout();
            }
          } catch (refreshError) {
            console.error("Error refreshing user data:", refreshError);
            logout();
          }
        } else {
          console.log("Already retried request - logging out");
          logout();
        }
      }
      
      // Handle 403 Forbidden errors
      if (error.response?.status === 403) {
        const errorMessage = error.response?.data?.message || '';
        console.error("403 Forbidden Error:", {
          url: error.config?.url,
          method: error.config?.method,
          message: errorMessage,
          timestamp: new Date().toISOString()
        });
        
        // Check if this is a blocked account
        if (errorMessage.toLowerCase().includes('blocked') || 
            errorMessage.toLowerCase().includes('suspended') ||
            errorMessage.toLowerCase().includes('banned')) {
          console.log("Account appears to be blocked - logging out");
          logout();
        } else {
          console.warn("Access forbidden - user may lack required permissions for this resource");
          // Don't auto-logout for permission issues, let the UI handle it
        }
      }
      
      return Promise.reject(error);
    }
  );

  return axiosSecure;
}

export default useAxiosSecure; 