import useAxiosSecure from "../hooks/useAxiosSecure";

function useAdminAPI() {
  const axiosSecure = useAxiosSecure();

  // User management
  const getAllUsers = async (params = {}) => {
    const response = await axiosSecure.get("/admin/users", { params });
    return response.data;
  };

  const updateUserStatus = async (userId, status) => {
    const response = await axiosSecure.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  };

  const updateUserRole = async (userId, role) => {
    const response = await axiosSecure.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  };

  const deleteUser = async (userId) => {
    const response = await axiosSecure.delete(`/admin/users/${userId}`);
    return response.data;
  };

  // Blog management
  const getAllBlogs = async (params = {}) => {
    const response = await axiosSecure.get("/admin/blogs", { params });
    return response.data;
  };

  const getBlogById = async (blogId) => {
    const response = await axiosSecure.get(`/admin/blogs/${blogId}`);
    return response.data;
  };

  const createBlog = async (blogData) => {
    const response = await axiosSecure.post("/admin/blogs", blogData);
    return response.data;
  };

  const updateBlog = async (blogId, blogData) => {
    const response = await axiosSecure.put(`/admin/blogs/${blogId}`, blogData);
    return response.data;
  };

  const deleteBlog = async (blogId) => {
    const response = await axiosSecure.delete(`/admin/blogs/${blogId}`);
    return response.data;
  };

  const updateBlogStatus = async (blogId, status) => {
    const response = await axiosSecure.patch(`/admin/blogs/${blogId}/status`, { status });
    return response.data;
  };

  // Dashboard statistics
  const getDashboardStats = async () => {
    const response = await axiosSecure.get("/admin/dashboard/stats");
    return response.data;
  };

  // Analytics data
  const getAnalyticsData = async (params = {}) => {
    const response = await axiosSecure.get("/admin/analytics", { params });
    return response.data;
  };

  const getBloodGroupDistribution = async () => {
    const response = await axiosSecure.get("/admin/analytics/blood-groups");
    return response.data;
  };

  const getTrendData = async (timeframe = 'daily') => {
    const response = await axiosSecure.get(`/admin/analytics/trends?timeframe=${timeframe}`);
    return response.data;
  };

  // Funding management
  const getAllFunding = async (params = {}) => {
    const response = await axiosSecure.get("/admin/funding", { params });
    return response.data;
  };

  const getFundingStats = async () => {
    const response = await axiosSecure.get("/funding/stats");
    return response.data;
  };

  // General admin operations - reusing existing donation API routes
  const getAllDonationRequests = async (params = {}) => {
    const response = await axiosSecure.get("/donations", { params });
    return response.data;
  };

  const updateDonationStatus = async (donationId, status) => {
    const response = await axiosSecure.patch(`/donations/${donationId}/status`, { status });
    return response.data;
  };

  const deleteDonationRequest = async (donationId) => {
    const response = await axiosSecure.delete(`/donations/${donationId}`);
    return response.data;
  };

  return {
    // User management
    getAllUsers,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    // Blog management
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    updateBlogStatus,
    // Dashboard statistics
    getDashboardStats,
    // Analytics
    getAnalyticsData,
    getBloodGroupDistribution,
    getTrendData,
    // Funding management
    getAllFunding,
    getFundingStats,
    // General admin operations
    getAllDonationRequests,
    updateDonationStatus,
    deleteDonationRequest,
  };
}

export default useAdminAPI; 