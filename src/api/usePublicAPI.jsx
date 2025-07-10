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
    const response = await axiosSecure.get("/public/donation-requests", { params });
    return response.data;
  };

  // Get donation request details (public view)
  const getDonationDetails = async (id) => {
    const response = await axiosSecure.get(`/public/donation-requests/${id}`);
    return response.data;
  };

  // Search donors by blood group and location
  const searchDonors = async (searchParams) => {
    const response = await axiosSecure.get("/public/search-donors", { params: searchParams });
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
    try {
      // Check if ImageBB API key is configured
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      if (!apiKey || apiKey === 'your_imgbb_api_key_here') {
        throw new Error('ImageBB API key not configured. Please set VITE_IMGBB_API_KEY in your .env file.');
      }

      // Validate file
      if (!imageFile) {
        throw new Error('No image file provided');
      }

      // Validate file type
      if (!imageFile.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      // Validate file size (max 10MB for ImageBB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (imageFile.size > maxSize) {
        throw new Error('Image size must be less than 10MB');
      }

      const formData = new FormData();
      formData.append("image", imageFile);

      // Use fetch directly to avoid axios interceptors for external API
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      return {
        success: true,
        data: {
          url: data.data.url,
          deleteUrl: data.data.delete_url,
          size: data.data.size,
        }
      };

    } catch (error) {
      console.error('ImageBB upload error:', error);
      throw new Error(error.message || 'Failed to upload image');
    }
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