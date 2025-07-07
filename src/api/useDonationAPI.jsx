import useAxiosSecure from "../hooks/useAxiosSecure";

function useDonationAPI() {
  const axiosSecure = useAxiosSecure();

  const getAllRequests = async (params = {}) => {
    const response = await axiosSecure.get("/donations", { params });
    return response.data;
  };

  const getMyRequests = async (params = {}) => {
    const response = await axiosSecure.get("/donations/my-requests", { params });
    return response.data;
  };

  const getRecentRequests = async (limit = 3) => {
    const response = await axiosSecure.get(`/donations/recent?limit=${limit}`);
    return response.data;
  };

  const getRequestById = async (id) => {
    const response = await axiosSecure.get(`/donations/${id}`);
    return response.data;
  };

  const createRequest = async (requestData) => {
    const response = await axiosSecure.post("/donations", requestData);
    return response.data;
  };

  const updateRequest = async (id, requestData) => {
    const response = await axiosSecure.put(`/donations/${id}`, requestData);
    return response.data;
  };

  const deleteRequest = async (id) => {
    const response = await axiosSecure.delete(`/donations/${id}`);
    return response.data;
  };

  const confirmDonation = async (id, donorInfo) => {
    const response = await axiosSecure.post(`/donations/${id}/confirm`, donorInfo);
    return response.data;
  };

  const updateStatus = async (id, status) => {
    const response = await axiosSecure.patch(`/donations/${id}/status`, { status });
    return response.data;
  };

  const getStats = async () => {
    const response = await axiosSecure.get("/donations/stats");
    return response.data;
  };

  const searchRequests = async (filters) => {
    const response = await axiosSecure.get("/donations/search", { params: filters });
    return response.data;
  };

  return {
    getAllRequests,
    getMyRequests,
    getRecentRequests,
    getRequestById,
    createRequest,
    updateRequest,
    deleteRequest,
    confirmDonation,
    updateStatus,
    getStats,
    searchRequests,
  };
}

export default useDonationAPI; 