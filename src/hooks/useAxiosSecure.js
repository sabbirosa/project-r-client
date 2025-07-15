import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function useAxiosSecure() {
  const { token, logout } = useAuth();

  axiosSecure.interceptors.request.use((config) => {
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error("Unauthorized access - token may be expired");
        
        // Only auto-logout for auth-related endpoints, not for image uploads or other operations
        const isAuthEndpoint = error.config?.url?.includes('/auth/');
        const isProfileEndpoint = error.config?.url?.includes('/auth/profile');
        
        if (isAuthEndpoint && !isProfileEndpoint) {
          console.log("Authentication endpoint failed - logging out");
          logout();
        } else {
          console.warn("Non-auth endpoint returned 401 - not auto-logging out");
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
}

export default useAxiosSecure; 