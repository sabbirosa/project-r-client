import useAxiosSecure from "../hooks/useAxiosSecure";

function useFundingAPI() {
  const axiosSecure = useAxiosSecure();

  // Create new funding record (for users making donations)
  const createFunding = async (fundingData) => {
    const response = await axiosSecure.post("/funding", fundingData);
    return response.data;
  };

  // Get funding statistics (admin/volunteer only)
  const getFundingStats = async () => {
    const response = await axiosSecure.get("/funding/stats");
    return response.data;
  };

  // Get all funding records (admin/volunteer only)
  const getAllFunding = async (params = {}) => {
    const response = await axiosSecure.get("/admin/funding", { params });
    return response.data;
  };

  // Get user's own funding history
  const getMyFunding = async (params = {}) => {
    const response = await axiosSecure.get("/funding/my-records", { params });
    return response.data;
  };

  return {
    createFunding,
    getFundingStats,
    getAllFunding,
    getMyFunding,
  };
}

export default useFundingAPI; 