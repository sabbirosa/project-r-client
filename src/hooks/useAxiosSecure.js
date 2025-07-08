import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function useAxiosSecure() {
  const { token } = useAuth();

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
        console.error("Unauthorized - maybe redirect to login");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
}

export default useAxiosSecure; 