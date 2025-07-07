import useAxiosSecure from "../hooks/useAxiosSecure";

function usePublicAPI() {
  const axiosSecure = useAxiosSecure();

  // Get all published blogs
  const getPublishedBlogs = async (params = {}) => {
    const response = await axiosSecure.get("/public/blogs", { params });
    return response.data;
  };

  // Get single blog by ID
  const getBlogById = async (id) => {
    const response = await axiosSecure.get(`/public/blogs/${id}`);
    return response.data;
  };

  // Get all pending donation requests (public view)
  const getPendingDonations = async (params = {}) => {
    const response = await axiosSecure.get("/public/donations", { params });
    return response.data;
  };

  // Get donation request details (public view)
  const getDonationDetails = async (id) => {
    const response = await axiosSecure.get(`/public/donations/${id}`);
    return response.data;
  };

  // Search donors by blood group and location
  const searchDonors = async (searchParams) => {
    const response = await axiosSecure.get("/public/donors/search", { params: searchParams });
    return response.data;
  };

  // Contact form submission
  const submitContactForm = async (contactData) => {
    const response = await axiosSecure.post("/public/contact", contactData);
    return response.data;
  };

  // Get application statistics (public stats)
  const getPublicStats = async () => {
    const response = await axiosSecure.get("/public/stats");
    return response.data;
  };

  // File upload to ImageBB
  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    // Note: This uses ImageBB API directly
    const response = await axiosSecure.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  };

  return {
    getPublishedBlogs,
    getBlogById,
    getPendingDonations,
    getDonationDetails,
    searchDonors,
    submitContactForm,
    getPublicStats,
    uploadImage,
  };
}

export default usePublicAPI; 