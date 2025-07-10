import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

function usePublicAPI() {
  const axiosSecure = useAxiosSecure();

  // GET requests using useQuery
  const useGetPublishedBlogs = (params = {}) => {
    return useQuery({
      queryKey: ["public", "blogs", params],
      queryFn: async () => {
        const response = await axiosSecure.get("/public/blogs", { params });
        return response.data;
      },
    });
  };

  const useGetBlogById = (id) => {
    return useQuery({
      queryKey: ["public", "blogs", "detail", id],
      queryFn: async () => {
        const response = await axiosSecure.get(`/public/blogs/${id}`);
        return response.data;
      },
      enabled: !!id, // Only run query if id is provided
    });
  };

  const useGetPendingDonations = (params = {}) => {
    return useQuery({
      queryKey: ["public", "donation-requests", params],
      queryFn: async () => {
        const response = await axiosSecure.get("/public/donation-requests", { params });
        return response.data;
      },
    });
  };

  const useGetDonationDetails = (id) => {
    return useQuery({
      queryKey: ["public", "donation-requests", "detail", id],
      queryFn: async () => {
        const response = await axiosSecure.get(`/public/donation-requests/${id}`);
        return response.data;
      },
      enabled: !!id, // Only run query if id is provided
    });
  };

  const useSearchDonors = (searchParams) => {
    return useQuery({
      queryKey: ["public", "search-donors", searchParams],
      queryFn: async () => {
        const response = await axiosSecure.get("/public/search-donors", { params: searchParams });
        return response.data;
      },
      enabled: !!searchParams && Object.keys(searchParams).length > 0, // Only run if search params are provided
    });
  };

  const useGetPublicStats = () => {
    return useQuery({
      queryKey: ["public", "stats"],
      queryFn: async () => {
        const response = await axiosSecure.get("/public/stats");
        return response.data;
      },
    });
  };

  // Mutation requests using useMutation
  const useSubmitContactForm = () => {
    return useMutation({
      mutationFn: async (contactData) => {
        const response = await axiosSecure.post("/public/contact", contactData);
        return response.data;
      },
    });
  };

  const useUploadImage = () => {
    return useMutation({
      mutationFn: async (imageFile) => {
        const { uploadToCloudinary } = await import('../utils/cloudinary');
        try {
          return await uploadToCloudinary(imageFile);
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          throw new Error(error.message || 'Failed to upload image');
        }
      },
    });
  };

  return {
    // Query hooks
    useGetPublishedBlogs,
    useGetBlogById,
    useGetPendingDonations,
    useGetDonationDetails,
    useSearchDonors,
    useGetPublicStats,
    // Mutation hooks
    useSubmitContactForm,
    useUploadImage,
  };
}

export default usePublicAPI; 