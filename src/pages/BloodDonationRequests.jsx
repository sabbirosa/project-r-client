import { useState } from "react";
import { FaCalendarAlt, FaClock, FaEye, FaMapMarkerAlt, FaTint } from "react-icons/fa";
import { Link } from "react-router";
import usePublicAPI from "../api/usePublicAPI";
import { Button, Card, CardContent, LoadingSpinner, Pagination } from "../components/ui";

function BloodDonationRequests() {
  const { useGetPendingDonations } = usePublicAPI();
  
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch pending donation requests using the hook
  const { data, isLoading: loading, isError, error } = useGetPendingDonations({ 
    page: currentPage, 
    limit: 12 
  });

  const requests = data?.requests || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Format date and time
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Blood Donation Requests
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help save lives by responding to urgent blood donation requests in your area.
          </p>
          {total > 0 && (
            <p className="text-lg text-gray-700 mt-2">
              {total} urgent request{total !== 1 ? 's' : ''} need{total === 1 ? 's' : ''} your help
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner className="w-8 h-8" />
            <span className="ml-2 text-gray-600">Loading requests...</span>
          </div>
        ) : requests.length > 0 ? (
          <>
            {/* Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {requests.map(request => (
                <Card key={request._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {/* Header with Blood Group */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="bg-red-100 p-2 rounded-full">
                          <FaTint className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="font-bold text-red-600 text-lg">
                          {request.bloodGroup}
                        </span>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Urgent
                      </span>
                    </div>

                    {/* Patient Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      For: {request.recipientName}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {request.hospitalName}, {request.recipientUpazila}, {request.recipientDistrict}
                      </span>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <FaCalendarAlt className="w-3 h-3 mr-1" />
                        <span className="text-sm">
                          {formatDate(request.donationDate)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="w-3 h-3 mr-1" />
                        <span className="text-sm">
                          {request.donationTime}
                        </span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Button
                      asChild
                      className="w-full"
                      variant="outline"
                    >
                      <Link to={`/donation-requests/${request._id}`} className="flex items-center justify-center space-x-2">
                        <FaEye className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <FaTint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Active Requests
              </h3>
              <p className="text-gray-600 mb-4">
                There are currently no pending blood donation requests.
              </p>
              <p className="text-gray-500 text-sm">
                Check back later or consider registering as a donor to be notified of new requests.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Save Lives?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Every donation can save up to three lives. Join our community of heroes and make a difference today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/register">Become a Donor</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/search">Search Donors</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BloodDonationRequests; 