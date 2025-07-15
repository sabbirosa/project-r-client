import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCamera, FaEdit, FaSave, FaTimes, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import useAuthAPI from "../api/useAuthAPI";
import usePublicAPI from "../api/usePublicAPI";
import { Button, Card, CardContent, CardHeader, CardTitle, CloudinaryImage, Input, Select } from "../components/ui";
import { districts, getUpazilasbyDistrictName } from "../constants/bdLocations";
import { bloodGroups } from "../constants/bloodGroups";
import { useAuth } from "../contexts/AuthContext";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { user, updateUserData } = useAuth();
  const authAPI = useAuthAPI();
  const publicAPI = usePublicAPI();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Fetch user profile data
  const { useGetProfile } = useAuthAPI();
  const {
    data: profileData,
    isLoading,
    error
  } = useGetProfile();

  // Watch district changes to filter upazilas
  const watchedDistrict = watch("district");

  useEffect(() => {
    if (profileData) {
      // Reset form with profile data
      reset({
        name: profileData.name || "",
        email: profileData.email || "",
        bloodGroup: profileData.bloodGroup || "",
        district: profileData.district || "",
        upazila: profileData.upazila || "",
      });
      setSelectedDistrict(profileData.district || "");
      setAvatarPreview(profileData.avatar || null);
      
      // Filter upazilas based on district using district name
      if (profileData.district) {
        const filtered = getUpazilasbyDistrictName(profileData.district);
        setFilteredUpazilas(filtered);
      }
    }
  }, [profileData, reset]);

  useEffect(() => {
    if (watchedDistrict && watchedDistrict !== selectedDistrict) {
      setSelectedDistrict(watchedDistrict);
      setValue("upazila", ""); // Reset upazila when district changes
      
      // Use district name for filtering upazilas
      const filtered = getUpazilasbyDistrictName(watchedDistrict);
      setFilteredUpazilas(filtered);
    }
  }, [watchedDistrict, selectedDistrict, setValue]);

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload avatar to Cloudinary
  const { useUploadImage } = usePublicAPI();
  const { mutateAsync: uploadImageMutation } = useUploadImage();

  const uploadAvatar = async (imageFile) => {
    try {
      setUploadingImage(true);
      const response = await uploadImageMutation(imageFile);
      return response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      
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
      setUploadingImage(false);
    }
  };

  // Handle form submission
  const { useUpdateProfile } = useAuthAPI();
  const { mutate: updateProfileMutation } = useUpdateProfile();

  const onSubmit = async (data) => {
    try {
      let avatarUrl = profileData?.avatar || "";
      
      // Upload new avatar if selected
      if (avatar) {
        avatarUrl = await uploadAvatar(avatar);
      }

      const updateData = {
        name: data.name,
        bloodGroup: data.bloodGroup,
        district: data.district,
        upazila: data.upazila,
        avatar: avatarUrl,
      };

      updateProfileMutation(updateData, {
        onSuccess: async () => {
          // Update user data in context
          await updateUserData();
          
          // Invalidate and refetch profile data
          queryClient.invalidateQueries(['auth', 'profile']);
          
          toast.success("Profile updated successfully!");
          setIsEditing(false);
          setAvatar(null);
        },
        onError: (error) => {
          console.error("Profile update error:", error);
          toast.error(error.response?.data?.message || "Failed to update profile");
        }
      });
      
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to upload avatar");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatar(null);
    setAvatarPreview(profileData?.avatar || null);
    
    // Reset form to original values
    if (profileData) {
      reset({
        name: profileData.name || "",
        email: profileData.email || "",
        bloodGroup: profileData.bloodGroup || "",
        district: profileData.district || "",
        upazila: profileData.upazila || "",
      });
    }
  };

  const getDistrictName = (districtName) => {
    // Since database stores names, just return the name
    return districtName || "";
  };

  const getUpazilaName = (upazilaName) => {
    // Since database stores names, just return the name
    return upazilaName || "";
  };

  const getBloodGroupLabel = (bloodGroupValue) => {
    const bloodGroup = bloodGroups.find(bg => bg.value === bloodGroupValue);
    return bloodGroup ? bloodGroup.label : bloodGroupValue;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b border-gray-200-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load profile data</p>
        <Button onClick={() => queryClient.invalidateQueries(['auth', 'profile'])}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              My Profile
            </CardTitle>
            {!isEditing ? (
              <Button onClick={handleEdit} className="flex items-center space-x-2">
                <FaEdit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center space-x-2"
                >
                  <FaTimes className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100">
                  {avatarPreview ? (
                    <CloudinaryImage
                      src={avatarPreview}
                      alt="Profile"
                      width={128}
                      height={128}
                      crop="fill"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-red-100">
                      <FaUpload className="h-8 w-8 text-red-400" />
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                    <FaCamera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              {uploadingImage && (
                <p className="text-sm text-gray-600">Uploading image...</p>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <Input
                label="Full Name"
                {...register("name", {
                  required: isEditing ? "Name is required" : false,
                  minLength: isEditing ? { value: 2, message: "Name must be at least 2 characters" } : undefined
                })}
                error={errors.name?.message}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />

              {/* Email (Always disabled) */}
              <Input
                label="Email Address"
                {...register("email")}
                disabled={true}
                className="bg-gray-50"
                helpText="Email cannot be changed"
              />

              {/* Blood Group */}
              <Select
                label="Blood Group"
                {...register("bloodGroup", {
                  required: isEditing ? "Blood group is required" : false
                })}
                error={errors.bloodGroup?.message}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </Select>

              {/* District */}
              <Select
                label="District"
                {...register("district", {
                  required: isEditing ? "District is required" : false
                })}
                error={errors.district?.message}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </Select>

              {/* Upazila */}
              <Select
                label="Upazila"
                {...register("upazila", {
                  required: isEditing ? "Upazila is required" : false
                })}
                error={errors.upazila?.message}
                disabled={!isEditing || !selectedDistrict}
                className={!isEditing ? "bg-gray-50" : ""}
              >
                <option value="">Select Upazila</option>
                {filteredUpazilas.map((upazila) => (
                  <option key={upazila.id} value={upazila.name}>
                    {upazila.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Display-only fields when not editing */}
            {!isEditing && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Role:</span>
                    <span className="ml-2 capitalize">{user?.role}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 capitalize ${user?.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {user?.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Blood Group:</span>
                    <span className="ml-2 font-semibold text-red-600">
                      {getBloodGroupLabel(profileData?.bloodGroup)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2">
                      {getUpazilaName(profileData?.upazila)}, {getDistrictName(profileData?.district)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || uploadingImage}
                  className="flex items-center space-x-2"
                >
                  <FaSave className="h-4 w-4" />
                  <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile; 