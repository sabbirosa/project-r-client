import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTint } from "react-icons/fa";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useDonationAPI from "../api/useDonationAPI";
import { Alert, AlertDescription, Button, Card, CardContent, CardHeader, CardTitle, Input, LoadingSpinner, Select, Textarea } from "../components/ui";
import {
    districts,
    getUpazilasbyDistrictName
} from "../constants/bdLocations";
import { bloodGroups } from "../constants/bloodGroups";
import { useAuth } from "../contexts/AuthContext";

function CreateDonationRequest() {
  const { user } = useAuth();
  const { useCreateRequest } = useDonationAPI();
  const { mutate: createRequestMutation, isPending: isMutationPending } = useCreateRequest();
  const navigate = useNavigate();
  
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const isSubmitting = isMutationPending;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      requesterName: user?.name || "",
      requesterEmail: user?.email || "",
    }
  });

  // Watch district changes to filter upazilas
  const watchedDistrict = watch("recipientDistrict");

  // Handle district change and filter upazilas
  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);
    setValue("recipientDistrict", districtName);
    setValue("recipientUpazila", ""); // Reset upazila when district changes
    
    // Use district name for filtering upazilas
    const filtered = getUpazilasbyDistrictName(districtName);
    setFilteredUpazilas(filtered);
  };

  // Handle form submission
  const onSubmit = (data) => {
    const requestData = {
      requesterName: data.requesterName,
      requesterEmail: data.requesterEmail,
      recipientName: data.recipientName,
      recipientDistrict: data.recipientDistrict,
      recipientUpazila: data.recipientUpazila,
      hospitalName: data.hospitalName,
      fullAddress: data.fullAddress,
      bloodGroup: data.bloodGroup,
      donationDate: data.donationDate,
      donationTime: data.donationTime,
      requestMessage: data.requestMessage,
      donationStatus: "pending" // Default status
    };

    createRequestMutation(requestData, {
      onSuccess: () => {
        toast.success("Donation request created successfully!");
        navigate("/dashboard/my-donation-requests");
      },
      onError: (error) => {
        console.error("Error creating donation request:", error);
        toast.error(error.response?.data?.message || "Failed to create donation request");
      }
    });
  };

  // Check if user is blocked
  if (user?.status === "blocked") {
    return (
      <div className="space-y-6">
        <Card className="border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <FaTint className="text-red-600" />
              <span>Create Donation Request</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Your account has been blocked. Only active users can create donation requests. 
                Please contact support if you believe this is an error.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <Card className="border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <FaTint className="text-red-600 dark:text-red-400" />
              <span>Create Donation Request</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Fill out the form below to create a blood donation request. All fields are required unless otherwise specified.
            </p>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Requester Information (Read-only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requester Name
                </label>
                <Input
                  {...register("requesterName")}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requester Email
                </label>
                <Input
                  {...register("requesterEmail")}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800/50"
                />
              </div>
            </div>

            {/* Recipient Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recipient Name <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <Input
                {...register("recipientName", {
                  required: "Recipient name is required"
                })}
                placeholder="Enter recipient's full name"
              />
              {errors.recipientName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.recipientName.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipient District <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <Select
                  {...register("recipientDistrict", {
                    required: "District is required"
                  })}
                  onChange={handleDistrictChange}
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </Select>
                {errors.recipientDistrict && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.recipientDistrict.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipient Upazila <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <Select
                  {...register("recipientUpazila", {
                    required: "Upazila is required"
                  })}
                  disabled={!selectedDistrict}
                >
                  <option value="">Select Upazila</option>
                  {filteredUpazilas.map((upazila) => (
                    <option key={upazila.id} value={upazila.name}>
                      {upazila.name}
                    </option>
                  ))}
                </Select>
                {errors.recipientUpazila && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.recipientUpazila.message}</p>
                )}
              </div>
            </div>

            {/* Hospital and Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hospital Name <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <Input
                {...register("hospitalName", {
                  required: "Hospital name is required"
                })}
                placeholder="e.g., Dhaka Medical College Hospital"
              />
              {errors.hospitalName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hospitalName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Address <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <Input
                {...register("fullAddress", {
                  required: "Full address is required"
                })}
                placeholder="e.g., Zahir Raihan Rd, Dhaka"
              />
              {errors.fullAddress && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullAddress.message}</p>
              )}
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blood Group <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <Select
                {...register("bloodGroup", {
                  required: "Blood group is required"
                })}
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </Select>
              {errors.bloodGroup && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bloodGroup.message}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Donation Date <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <Input
                  type="date"
                  {...register("donationDate", {
                    required: "Donation date is required",
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selectedDate >= today || "Date cannot be in the past";
                    }
                  })}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.donationDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.donationDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Donation Time <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <Input
                  type="time"
                  {...register("donationTime", {
                    required: "Donation time is required"
                  })}
                />
                {errors.donationTime && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.donationTime.message}</p>
                )}
              </div>
            </div>

            {/* Request Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Request Message <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <Textarea
                {...register("requestMessage", {
                  required: "Request message is required",
                  minLength: {
                    value: 10,
                    message: "Message must be at least 10 characters"
                  }
                })}
                rows={4}
                placeholder="Please describe why you need blood donation and any additional details..."
              />
              {errors.requestMessage && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.requestMessage.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" text="Creating Request..." />
                ) : (
                  "Create Request"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default CreateDonationRequest; 