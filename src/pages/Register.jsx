import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUpload, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import usePublicAPI from "../api/usePublicAPI";
import { Button, Card, CardContent, CardHeader, CardTitle, CloudinaryImage, Input, Select } from "../components/ui";
import { districts, getUpazilasbyDistrictName } from "../constants/bdLocations";
import { bloodGroups } from "../constants/bloodGroups";
import { useAuth } from "../contexts/AuthContext";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const { register: registerUser, loading } = useAuth();
  const publicAPI = usePublicAPI();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // Handle district change and filter upazilas
  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);
    setValue("district", districtName);
    setValue("upazila", ""); // Reset upazila when district changes
    
    // Use the correct utility function for filtering upazilas by district name
    const filtered = getUpazilasbyDistrictName(districtName);
    setFilteredUpazilas(filtered);
  };

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload avatar using the improved API
  const { useUploadImage } = usePublicAPI();
  const { mutateAsync: uploadImageMutation } = useUploadImage();

  const uploadAvatarToImgBB = async (imageFile) => {
    try {
      setUploadingAvatar(true);
      const response = await uploadImageMutation(imageFile);
      return response.data.url;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      
      // Handle specific error messages
      if (error.message.includes('cloud name not configured') || error.message.includes('upload preset not configured')) {
        toast.error('Please configure Cloudinary settings in your .env file');
      } else if (error.message.includes('file type')) {
        toast.error('Please select a valid image file (PNG, JPG, JPEG, GIF, etc.)');
      } else if (error.message.includes('size')) {
        toast.error('Image size is too large. Please select an image under 10MB');
      } else {
        toast.error(error.message || 'Failed to upload avatar. Please try again.');
      }
      throw error;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      let avatarUrl = "";
      
      // Upload avatar if selected
      if (avatar) {
        avatarUrl = await uploadAvatarToImgBB(avatar);
      }

      const registrationData = {
        ...data,
        avatar: avatarUrl,
        role: "donor", // Default role
        status: "active", // Default status
      };

      // Remove confirmPassword from the data before sending
      delete registrationData.confirmPassword;

      const result = await registerUser(registrationData);
      
      if (result.success) {
        // Redirect to dashboard after successful registration
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        <div>
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30 shadow-lg">
            <FaUser className="h-7 w-7 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
            Join as a Blood Donor
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            Create your account to help save lives
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Registration Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Avatar Upload */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800">
                    {avatarPreview ? (
                      <CloudinaryImage
                        src={avatarPreview}
                        alt="Avatar preview"
                        width={96}
                        height={96}
                        crop="fill"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUpload className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Upload your photo</p>
              </div>

              {/* Name */}
              <Input
                label="Full Name"
                required
                placeholder="Enter your full name"
                error={errors.name?.message}
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" }
                })}
              />

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />

              {/* Blood Group */}
              <Select
                label="Blood Group"
                required
                placeholder="Select Blood Group"
                error={errors.bloodGroup?.message}
                {...register("bloodGroup", { required: "Blood group is required" })}
              >
                {bloodGroups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </Select>

              {/* District */}
              <Select
                label="District"
                required
                placeholder="Select District"
                error={errors.district?.message}
                {...register("district", { required: "District is required" })}
                onChange={handleDistrictChange}
              >
                {districts.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </Select>

              {/* Upazila */}
              <Select
                label="Upazila"
                required
                placeholder="Select Upazila"
                disabled={!selectedDistrict}
                error={errors.upazila?.message}
                {...register("upazila", { required: "Upazila is required" })}
              >
                {filteredUpazilas.map((upazila) => (
                  <option key={upazila.id} value={upazila.name}>
                    {upazila.name}
                  </option>
                ))}
              </Select>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Password <span className="text-red-600 dark:text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" }
                    })}
                    type={showPassword ? "text" : "password"}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm font-medium bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 focus:border-red-600 dark:focus:border-red-500 hover:border-gray-400 dark:hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all duration-200 ease-in-out pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Confirm Password <span className="text-red-600 dark:text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords do not match"
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm font-medium bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 focus:border-red-600 dark:focus:border-red-500 hover:border-gray-400 dark:hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all duration-200 ease-in-out pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                loading={loading || uploadingAvatar}
                className="w-full"
                size="lg"
              >
                {loading || uploadingAvatar ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Register; 