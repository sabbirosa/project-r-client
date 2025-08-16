import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

function useDonationAPI() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // GET requests using useQuery
  const useGetAllRequests = (params = {}) => {
    return useQuery({
      queryKey: ["donations", "all", params],
      queryFn: async () => {
        const response = await axiosSecure.get("/donations", { params });
        return response.data;
      },
    });
  };

  const useGetMyRequests = (params = {}) => {
    return useQuery({
      queryKey: ["donations", "my-requests", params],
      queryFn: async () => {
        const response = await axiosSecure.get("/donations/my-requests", { params });
        return response.data;
      },
    });
  };

  const useGetRecentRequests = (limit = 3) => {
    return useQuery({
      queryKey: ["donations", "recent", limit],
      queryFn: async () => {
        const response = await axiosSecure.get(`/donations/recent?limit=${limit}`);
        return response.data;
      },
    });
  };

  const useGetRequestById = (id) => {
    return useQuery({
      queryKey: ["donations", "detail", id],
      queryFn: async () => {
        const response = await axiosSecure.get(`/donations/${id}`);
        return response.data;
      },
      enabled: !!id, // Only run query if id is provided
    });
  };

  const useGetStats = () => {
    return useQuery({
      queryKey: ["donations", "stats"],
      queryFn: async () => {
        const response = await axiosSecure.get("/donations/stats");
        return response.data;
      },
    });
  };

  const useGetMyStats = () => {
    return useQuery({
      queryKey: ["donations", "my-stats"],
      queryFn: async () => {
        const response = await axiosSecure.get("/donations/my-stats");
        return response.data;
      },
    });
  };

  const useSearchRequests = (filters) => {
    return useQuery({
      queryKey: ["donations", "search", filters],
      queryFn: async () => {
        const response = await axiosSecure.get("/donations/search", { params: filters });
        return response.data;
      },
      enabled: !!filters && Object.keys(filters).length > 0, // Only run if filters are provided
    });
  };

  // Mutation requests using useMutation
  const useCreateRequest = () => {
    return useMutation({
      mutationFn: async (requestData) => {
        const response = await axiosSecure.post("/donations", requestData);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate relevant queries after creating a request
        queryClient.invalidateQueries({ queryKey: ["donations"] });
      },
    });
  };

  const useUpdateRequest = () => {
    return useMutation({
      mutationFn: async ({ id, requestData }) => {
        const response = await axiosSecure.put(`/donations/${id}`, requestData);
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate queries related to this specific request and general lists
        queryClient.invalidateQueries({ queryKey: ["donations", "detail", variables.id] });
        queryClient.invalidateQueries({ queryKey: ["donations", "all"] });
        queryClient.invalidateQueries({ queryKey: ["donations", "my-requests"] });
        queryClient.invalidateQueries({ queryKey: ["donations", "recent"] });
      },
    });
  };

  const useDeleteRequest = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axiosSecure.delete(`/donations/${id}`);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate all donation queries after deletion
        queryClient.invalidateQueries({ queryKey: ["donations"] });
      },
    });
  };

  const useConfirmDonation = () => {
    return useMutation({
      mutationFn: async ({ id, donorInfo }) => {
        const response = await axiosSecure.post(`/donations/${id}/confirm`, donorInfo);
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate queries related to this specific request and general lists
        queryClient.invalidateQueries({ queryKey: ["donations", "detail", variables.id] });
        queryClient.invalidateQueries({ queryKey: ["donations", "all"] });
        queryClient.invalidateQueries({ queryKey: ["donations", "stats"] });
      },
    });
  };

  const useUpdateStatus = () => {
    return useMutation({
      mutationFn: async ({ id, status }) => {
        const response = await axiosSecure.patch(`/donations/${id}/status`, { status });
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate queries related to this specific request and general lists
        queryClient.invalidateQueries({ queryKey: ["donations", "detail", variables.id] });
        queryClient.invalidateQueries({ queryKey: ["donations", "all"] });
        queryClient.invalidateQueries({ queryKey: ["donations", "my-requests"] });
        queryClient.invalidateQueries({ queryKey: ["donations", "recent"] });
        queryClient.invalidateQueries({ queryKey: ["donations", "stats"] });
      },
    });
  };

  return {
    // Query hooks
    useGetAllRequests,
    useGetMyRequests,
    useGetRecentRequests,
    useGetRequestById,
    useGetStats,
    useGetMyStats,
    useSearchRequests,
    // Mutation hooks
    useCreateRequest,
    useUpdateRequest,
    useDeleteRequest,
    useConfirmDonation,
    useUpdateStatus,
  };
}

export default useDonationAPI; 