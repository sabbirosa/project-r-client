import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaHandHoldingHeart, FaHospital, FaMapMarkerAlt, FaTint, FaUser } from "react-icons/fa";
import { Link, Navigate, useParams } from "react-router";
import useDonationAPI from "../api/useDonationAPI";
import usePublicAPI from "../api/usePublicAPI";
import { Button, Card, CardContent, LoadingSpinner, Modal } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

function DonationRequestDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { getDonationDetails } = usePublicAPI();
  const { confirmDonation } = useDonationAPI();
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // Fetch donation request details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await getDonationDetails(id);
        setRequest(result.request);
      } catch (error) {
        setError(error.message || "Failed to load request details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id, getDonationDetails]);

  // Check if current user is the requester
  const isOwnRequest = user?._id === request?.requesterId;

  // Handle donation confirmation
  const handleConfirmDonation = async () => {
    setIsConfirming(true);
    setConfirmError("");
    
    try {
      // Pass donor information to the API call
      const donorInfo = {
        donorName: user?.name,
        donorEmail: user?.email
      };
      
      const result = await confirmDonation(id, donorInfo);
      setConfirmMessage(result.message);
      setShowModal(false);
      // Refresh the request data to show updated status
      const updatedResult = await getDonationDetails(id);
      setRequest(updatedResult.request);
    } catch (error) {
      setConfirmError(error.message || "Failed to confirm donation");
    } finally {
      setIsConfirming(false);
    }
  };

  // Format date and time
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner className="w-8 h-8" />
            <span className="ml-2 text-gray-600">Loading request details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <FaTint className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Request Not Found
              </h3>
              <p className="text-gray-600 mb-4">
                {error || "The donation request could not be found or is no longer available."}
              </p>
              <Button asChild>
                <Link to="/donation-requests">Back to Requests</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <FaTint className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Blood Donation Request
              </h1>
              <p className="text-lg text-red-600 font-semibold">
                {request.bloodGroup} Blood Needed
              </p>
            </div>
          </div>
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
            Urgent Request
          </span>
        </div>

        {/* Success Message */}
        {confirmMessage && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FaHandHoldingHeart className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">{confirmMessage}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Request Details
                </h2>

                <div className="space-y-6">
                  {/* Patient Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <FaUser className="w-4 h-4 mr-2" />
                      Patient Information
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 font-medium">
                        Patient: {request.recipientName}
                      </p>
                      <p className="text-gray-600">
                        Blood Group: <span className="font-semibold text-red-600">{request.bloodGroup}</span>
                      </p>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                      Location Details
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center">
                        <FaHospital className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">Hospital:</span>
                        <span className="ml-2">{request.hospitalName}</span>
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">Address:</span>
                        <span className="ml-2">{request.fullAddress}</span>
                      </div>
                      <p className="text-gray-600">
                        {request.recipientUpazila}, {request.recipientDistrict}
                      </p>
                    </div>
                  </div>

                  {/* Donation Schedule */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <FaCalendarAlt className="w-4 h-4 mr-2" />
                      Donation Schedule
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="font-medium">Date:</span>
                          <span className="ml-2">{formatDate(request.donationDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="font-medium">Time:</span>
                          <span className="ml-2">{request.donationTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Message */}
                  {request.requestMessage && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Additional Information
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{request.requestMessage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div>
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {isOwnRequest ? "Your Request" : "Help Save a Life"}
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <FaTint className="w-5 h-5 text-red-600" />
                      <span className="font-bold text-red-600 text-lg">
                        {request.bloodGroup}
                      </span>
                    </div>
                    <p className="text-center text-sm text-gray-600">
                      Blood group needed
                    </p>
                  </div>

                  <div className="text-center">
                    {isOwnRequest ? (
                      <>
                        <p className="text-sm text-gray-600 mb-4">
                          This is your blood donation request. You cannot donate to your own request.
                        </p>
                        
                        <Button
                          size="lg"
                          className="w-full"
                          disabled
                          variant="outline"
                        >
                          <FaHandHoldingHeart className="w-4 h-4 mr-2" />
                          Cannot Donate to Own Request
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600 mb-4">
                          Your donation can save up to 3 lives. Be a hero today!
                        </p>
                        
                        <Button
                          onClick={() => !isOwnRequest && request.donationStatus === "pending" && setShowModal(true)}
                          size="lg"
                          className="w-full"
                          disabled={request.donationStatus !== "pending"}
                        >
                          <FaHandHoldingHeart className="w-4 h-4 mr-2" />
                          {request.donationStatus === "pending" ? "I Want to Donate" : "Request Not Available"}
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {isOwnRequest ? "Your request status" : "What happens next?"}
                    </h4>
                    {isOwnRequest ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Status: <span className="font-medium capitalize">{request.donationStatus}</span>
                        </p>
                        {request.donorInfo && (
                          <p className="text-sm text-gray-600">
                            Donor: <span className="font-medium">{request.donorInfo.name}</span>
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Share this request with potential donors to get help.
                        </p>
                      </div>
                    ) : (
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• We'll notify the requester</li>
                        <li>• You'll receive contact details</li>
                        <li>• Coordinate the donation time</li>
                        <li>• Help save a life!</li>
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirmation Modal */}
        <Modal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)}
          title="Confirm Donation"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              You are about to confirm your willingness to donate blood for this request. 
              Please review your information below:
            </p>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div>
                <span className="font-medium">Donor Name:</span>
                <span className="ml-2">{user?.name}</span>
              </div>
              <div>
                <span className="font-medium">Donor Email:</span>
                <span className="ml-2">{user?.email}</span>
              </div>
              <div>
                <span className="font-medium">Your Blood Group:</span>
                <span className="ml-2 text-red-600 font-semibold">{user?.bloodGroup}</span>
              </div>
            </div>

            {confirmError && (
              <p className="text-red-600 text-sm">{confirmError}</p>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleConfirmDonation}
                disabled={isConfirming}
                className="flex-1"
              >
                {isConfirming ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-2" />
                    Confirming...
                  </>
                ) : (
                  "Confirm Donation"
                )}
              </Button>
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
                disabled={isConfirming}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default DonationRequestDetails; 