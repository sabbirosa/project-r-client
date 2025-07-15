import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

function useAdminAPI() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // GET requests using useQuery
  const useGetAllUsers = (params = {}) => {
    return useQuery({
      queryKey: ["admin", "users", params],
      queryFn: async () => {
        const response = await axiosSecure.get("/admin/users", { params });
        return response.data;
      },
    });
  };

  const useGetAllBlogs = (params = {}) => {
    return useQuery({
      queryKey: ["admin", "blogs", params],
      queryFn: async () => {
        const response = await axiosSecure.get("/admin/blogs", { params });
        return response.data;
      },
    });
  };

  const useGetBlogById = (blogId) => {
    return useQuery({
      queryKey: ["admin", "blogs", "detail", blogId],
      queryFn: async () => {
        const response = await axiosSecure.get(`/admin/blogs/${blogId}`);
        return response.data;
      },
      enabled: !!blogId, // Only run query if blogId is provided
    });
  };

  const useGetDashboardStats = () => {
    return useQuery({
      queryKey: ["admin", "dashboard", "stats"],
      queryFn: async () => {
        const response = await axiosSecure.get("/admin/dashboard/stats");
        return response.data;
      },
    });
  };

  const useGetDashboardAnalytics = () => {
    return useQuery({
      queryKey: ["admin", "dashboard", "analytics"],
      queryFn: async () => {
        const response = await axiosSecure.get("/admin/dashboard/analytics");
        return response.data;
      },
    });
  };

  const useGetAnalyticsData = (params = {}) => {
    return useQuery({
      queryKey: ["admin", "analytics", params],
      queryFn: async () => {
        const response = await axiosSecure.get("/admin/analytics", { params });
        return response.data;
      },
    });
  };

  const useGetBloodGroupDistribution = () => {
    return useQuery({
      queryKey: ["admin", "analytics", "blood-groups"],
      queryFn: async () => {
        const response = await axiosSecure.get("/admin/analytics/blood-groups");
        return response.data;
      },
    });
  };

  const useGetTrendData = (timeframe = 'daily') => {
    return useQuery({
      queryKey: ["admin", "analytics", "trends", timeframe],
      queryFn: async () => {
        const response = await axiosSecure.get(`/admin/analytics/trends?timeframe=${timeframe}`);
        return response.data;
      },
    });
  };

  const useGetAllFunding = (params = {}) => {
    return useQuery({
      queryKey: ["admin", "funding", params],
      queryFn: async () => {
        const response = await axiosSecure.get("/admin/funding", { params });
        return response.data;
      },
    });
  };

  const useGetFundingStats = () => {
    return useQuery({
      queryKey: ["admin", "funding", "stats"],
      queryFn: async () => {
        const response = await axiosSecure.get("/funding/stats");
        return response.data;
      },
    });
  };

  const useGetAllDonationRequests = (params = {}) => {
    return useQuery({
      queryKey: ["admin", "donations", params],
      queryFn: async () => {
        const response = await axiosSecure.get("/donations", { params });
        return response.data;
      },
    });
  };

  // Mutation requests using useMutation
  const useUpdateUserStatus = () => {
    return useMutation({
      mutationFn: async ({ userId, status }) => {
        const response = await axiosSecure.patch(`/admin/users/${userId}/status`, { status });
        return response.data;
      },
      onSuccess: () => {
        // Invalidate users queries after status update
        queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "stats"] });
      },
    });
  };

  const useUpdateUserRole = () => {
    return useMutation({
      mutationFn: async ({ userId, role }) => {
        const response = await axiosSecure.patch(`/admin/users/${userId}/role`, { role });
        return response.data;
      },
      onSuccess: () => {
        // Invalidate users queries after role update
        queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "stats"] });
      },
    });
  };

  const useDeleteUser = () => {
    return useMutation({
      mutationFn: async (userId) => {
        const response = await axiosSecure.delete(`/admin/users/${userId}`);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate users queries after deletion
        queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "stats"] });
      },
    });
  };

  const useCreateBlog = () => {
    return useMutation({
      mutationFn: async (blogData) => {
        const response = await axiosSecure.post("/admin/blogs", blogData);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate blogs queries after creation
        queryClient.invalidateQueries({ queryKey: ["admin", "blogs"] });
        queryClient.invalidateQueries({ queryKey: ["public", "blogs"] });
      },
    });
  };

  const useUpdateBlog = () => {
    return useMutation({
      mutationFn: async ({ blogId, blogData }) => {
        const response = await axiosSecure.put(`/admin/blogs/${blogId}`, blogData);
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate blog queries after update
        queryClient.invalidateQueries({ queryKey: ["admin", "blogs", "detail", variables.blogId] });
        queryClient.invalidateQueries({ queryKey: ["admin", "blogs"] });
        queryClient.invalidateQueries({ queryKey: ["public", "blogs"] });
      },
    });
  };

  const useDeleteBlog = () => {
    return useMutation({
      mutationFn: async (blogId) => {
        const response = await axiosSecure.delete(`/admin/blogs/${blogId}`);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate blogs queries after deletion
        queryClient.invalidateQueries({ queryKey: ["admin", "blogs"] });
        queryClient.invalidateQueries({ queryKey: ["public", "blogs"] });
      },
    });
  };

  const useUpdateBlogStatus = () => {
    return useMutation({
      mutationFn: async ({ blogId, status }) => {
        const response = await axiosSecure.patch(`/admin/blogs/${blogId}/status`, { status });
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate blog queries after status update
        queryClient.invalidateQueries({ queryKey: ["admin", "blogs", "detail", variables.blogId] });
        queryClient.invalidateQueries({ queryKey: ["admin", "blogs"] });
        queryClient.invalidateQueries({ queryKey: ["public", "blogs"] });
      },
    });
  };

  const useUpdateDonationStatus = () => {
    return useMutation({
      mutationFn: async ({ donationId, status }) => {
        const response = await axiosSecure.patch(`/donations/${donationId}/status`, { status });
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate donation queries after status update
        queryClient.invalidateQueries({ queryKey: ["admin", "donations"] });
        queryClient.invalidateQueries({ queryKey: ["donations"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "stats"] });
      },
    });
  };

  const useDeleteDonationRequest = () => {
    return useMutation({
      mutationFn: async (donationId) => {
        const response = await axiosSecure.delete(`/donations/${donationId}`);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate donation queries after deletion
        queryClient.invalidateQueries({ queryKey: ["admin", "donations"] });
        queryClient.invalidateQueries({ queryKey: ["donations"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "stats"] });
      },
    });
  };

  return {
    // Query hooks
    useGetAllUsers,
    useGetAllBlogs,
    useGetBlogById,
    useGetDashboardStats,
    useGetDashboardAnalytics,
    useGetAnalyticsData,
    useGetBloodGroupDistribution,
    useGetTrendData,
    useGetAllFunding,
    useGetFundingStats,
    useGetAllDonationRequests,
    // Mutation hooks
    useUpdateUserStatus,
    useUpdateUserRole,
    useDeleteUser,
    useCreateBlog,
    useUpdateBlog,
    useDeleteBlog,
    useUpdateBlogStatus,
    useUpdateDonationStatus,
    useDeleteDonationRequest,
  };
}

export default useAdminAPI; 