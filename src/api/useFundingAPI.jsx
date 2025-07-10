import useAxiosSecure from "../hooks/useAxiosSecure";

function useFundingAPI() {
  const axiosSecure = useAxiosSecure();

  // Create new funding record with Stripe payment processing
  const createFunding = async (fundingData) => {
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
  };

  // Create funding record without payment processing (for admin use)
  const createFundingRecord = async (fundingData) => {
    const response = await axiosSecure.post("/funding", fundingData);
    return response.data;
  };

  // Get funding statistics (admin/volunteer only)
  const getFundingStats = async () => {
    const response = await axiosSecure.get("/funding/stats");
    return response.data;
  };

  // Get all funding records with pagination (admin/volunteer only)
  const getAllFunding = async (params = {}) => {
    const response = await axiosSecure.get("/funding", { params });
    return response.data;
  };

  // Get user's own funding history
  const getMyFunding = async (params = {}) => {
    const response = await axiosSecure.get("/funding/my-records", { params });
    return response.data;
  };

  // Update funding record status (admin only)
  const updateFundingStatus = async (fundingId, status) => {
    const response = await axiosSecure.patch(`/funding/${fundingId}/status`, { status });
    return response.data;
  };

  // Delete funding record (admin only)
  const deleteFunding = async (fundingId) => {
    const response = await axiosSecure.delete(`/funding/${fundingId}`);
    return response.data;
  };

  // Get funding analytics for dashboard (admin/volunteer only)
  const getFundingAnalytics = async (params = {}) => {
    const response = await axiosSecure.get("/funding/analytics", { params });
    return response.data;
  };

  // Refund a payment (admin only)
  const refundPayment = async (fundingId, reason = '') => {
    const response = await axiosSecure.post(`/funding/${fundingId}/refund`, { reason });
    return response.data;
  };

  // Export funding data (admin only)
  const exportFundingData = async (params = {}) => {
    const response = await axiosSecure.get("/funding/export", { 
      params,
      responseType: 'blob' // for file download
    });
    return response;
  };

  return {
    createFunding,
    createFundingRecord,
    getFundingStats,
    getAllFunding,
    getMyFunding,
    updateFundingStatus,
    deleteFunding,
    getFundingAnalytics,
    refundPayment,
    exportFundingData,
  };
}

export default useFundingAPI; 