import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

function useFundingAPI() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // GET requests using useQuery
  const useGetFundingStats = () => {
    return useQuery({
      queryKey: ["funding", "stats"],
      queryFn: async () => {
        const response = await axiosSecure.get("/funding/stats");
        return response.data;
      },
    });
  };

  const useGetAllFunding = (params = {}) => {
    return useQuery({
      queryKey: ["funding", "all", params],
      queryFn: async () => {
        const response = await axiosSecure.get("/funding", { params });
        return response.data;
      },
    });
  };

  const useGetMyFunding = (params = {}) => {
    return useQuery({
      queryKey: ["funding", "my-records", params],
      queryFn: async () => {
        const response = await axiosSecure.get("/funding/my-records", { params });
        return response.data;
      },
    });
  };

  const useGetFundingAnalytics = (params = {}) => {
    return useQuery({
      queryKey: ["funding", "analytics", params],
      queryFn: async () => {
        const response = await axiosSecure.get("/funding/analytics", { params });
        return response.data;
      },
    });
  };

  // Export data is still a GET but handled as a mutation since it triggers download
  const useExportFundingData = () => {
    return useMutation({
      mutationFn: async (params = {}) => {
        const response = await axiosSecure.get("/funding/export", { 
          params,
          responseType: 'blob' // for file download
        });
        return response;
      },
    });
  };

  // Mutation requests using useMutation
  const useCreateFunding = () => {
    return useMutation({
      mutationFn: async (fundingData) => {
        try {
          // Process Stripe payment first
          const response = await axiosSecure.post("/funding/create-payment-intent", {
            amount: fundingData.amount,
            paymentMethodId: fundingData.paymentMethodId,
            donorName: fundingData.donorName,
            donorEmail: fundingData.donorEmail,
          });
          
          return response.data;
        } catch (error) {
          // Handle Stripe-specific errors
          if (error.response?.data?.type === 'StripeCardError') {
            throw new Error(error.response.data.message || 'Payment failed');
          }
          throw error;
        }
      },
      onSuccess: () => {
        // Invalidate funding queries after successful payment
        queryClient.invalidateQueries({ queryKey: ["funding"] });
      },
    });
  };

  const useCreateFundingRecord = () => {
    return useMutation({
      mutationFn: async (fundingData) => {
        const response = await axiosSecure.post("/funding", fundingData);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate funding queries after creating record
        queryClient.invalidateQueries({ queryKey: ["funding"] });
      },
    });
  };

  const useUpdateFundingStatus = () => {
    return useMutation({
      mutationFn: async ({ fundingId, status }) => {
        const response = await axiosSecure.patch(`/funding/${fundingId}/status`, { status });
        return response.data;
      },
      onSuccess: () => {
        // Invalidate funding queries after status update
        queryClient.invalidateQueries({ queryKey: ["funding"] });
      },
    });
  };

  const useDeleteFunding = () => {
    return useMutation({
      mutationFn: async (fundingId) => {
        const response = await axiosSecure.delete(`/funding/${fundingId}`);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate funding queries after deletion
        queryClient.invalidateQueries({ queryKey: ["funding"] });
      },
    });
  };

  const useRefundPayment = () => {
    return useMutation({
      mutationFn: async ({ fundingId, reason = '' }) => {
        const response = await axiosSecure.post(`/funding/${fundingId}/refund`, { reason });
        return response.data;
      },
      onSuccess: () => {
        // Invalidate funding queries after refund
        queryClient.invalidateQueries({ queryKey: ["funding"] });
      },
    });
  };

  return {
    // Query hooks
    useGetFundingStats,
    useGetAllFunding,
    useGetMyFunding,
    useGetFundingAnalytics,
    // Mutation hooks
    useCreateFunding,
    useCreateFundingRecord,
    useUpdateFundingStatus,
    useDeleteFunding,
    useRefundPayment,
    useExportFundingData,
  };
}

export default useFundingAPI; 