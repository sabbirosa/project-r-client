import useAxiosSecure from "../hooks/useAxiosSecure";

function useAuthAPI() {
  const axiosSecure = useAxiosSecure();

  const register = async (userData) => {
    const response = await axiosSecure.post("/auth/register", userData);
    return response.data;
  };

  const login = async (credentials) => {
    const response = await axiosSecure.post("/auth/login", credentials);
    return response.data;
  };

  const logout = async () => {
    const response = await axiosSecure.post("/auth/logout");
    return response.data;
  };

  const getProfile = async () => {
    const response = await axiosSecure.get("/auth/profile");
    return response.data;
  };

  const updateProfile = async (profileData) => {
    const response = await axiosSecure.put("/auth/profile", profileData);
    return response.data;
  };

  const verifyToken = async () => {
    const response = await axiosSecure.get("/auth/verify");
    return response.data;
  };

  const refreshToken = async () => {
    const response = await axiosSecure.post("/auth/refresh");
    return response.data;
  };

  const changePassword = async (passwordData) => {
    const response = await axiosSecure.put("/auth/change-password", passwordData);
    return response.data;
  };

  return {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    verifyToken,
    refreshToken,
    changePassword,
  };
}

export default useAuthAPI; 