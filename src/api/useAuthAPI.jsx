import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

function useAuthAPI() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // GET requests using useQuery
  const useGetProfile = () => {
    return useQuery({
      queryKey: ["auth", "profile"],
      queryFn: async () => {
        const response = await axiosSecure.get("/auth/profile");
        return response.data.user; // Return the user data, not the full response
      },
    });
  };

  const useVerifyToken = () => {
    return useQuery({
      queryKey: ["auth", "verify"],
      queryFn: async () => {
        const response = await axiosSecure.get("/auth/verify");
        return response.data;
      },
      retry: false, // Don't retry failed token verification
    });
  };

  // Mutation requests using useMutation
  const useRegister = () => {
    return useMutation({
      mutationFn: async (userData) => {
        const response = await axiosSecure.post("/auth/register", userData);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate and refetch auth-related queries after successful registration
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      },
    });
  };

  const useLogin = () => {
    return useMutation({
      mutationFn: async (credentials) => {
        const response = await axiosSecure.post("/auth/login", credentials);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate and refetch auth-related queries after successful login
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      },
    });
  };

  const useLogout = () => {
    return useMutation({
      mutationFn: async () => {
        const response = await axiosSecure.post("/auth/logout");
        return response.data;
      },
      onSuccess: () => {
        // Clear all cached data after logout
        queryClient.clear();
      },
    });
  };

  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: async (profileData) => {
        const response = await axiosSecure.put("/auth/profile", profileData);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate profile query to refetch updated data
        queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      },
    });
  };

  const useRefreshToken = () => {
    return useMutation({
      mutationFn: async () => {
        const response = await axiosSecure.post("/auth/refresh");
        return response.data;
      },
      onSuccess: () => {
        // Invalidate auth queries after token refresh
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      },
    });
  };

  const useChangePassword = () => {
    return useMutation({
      mutationFn: async (passwordData) => {
        const response = await axiosSecure.put("/auth/change-password", passwordData);
        return response.data;
      },
    });
  };

  return {
    // Query hooks
    useGetProfile,
    useVerifyToken,
    // Mutation hooks
    useRegister,
    useLogin,
    useLogout,
    useUpdateProfile,
    useRefreshToken,
    useChangePassword,
  };
}

export default useAuthAPI; 