import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaEdit, FaEye, FaFilter, FaPlus, FaTint, FaTrash } from "react-icons/fa";
import { Link } from "react-router";
import { toast } from "react-toastify";
import useDonationAPI from "../api/useDonationAPI";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, LoadingSpinner, Modal, Pagination, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

function MyDonationRequests() {
  const { user } = useAuth();
  const donationAPI = useDonationAPI();
  
  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const itemsPerPage = 10;

  // Fetch donation requests with pagination and filtering
  const {
    data: requestsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['myDonationRequests', currentPage, statusFilter],
    queryFn: () => donationAPI.getMyRequests({
      page: currentPage,
      limit: itemsPerPage,
      status: statusFilter || undefined
    }),
    enabled: !!user
  });

  // Handle status update (done/cancel)
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await donationAPI.updateStatus(requestId, newStatus);
      toast.success(`Request ${newStatus === 'done' ? 'marked as completed' : 'cancelled'} successfully!`);
      refetch();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update request status');
    }
  };

  // Handle delete request
  const handleDeleteRequest = async () => {
    if (!selectedRequestId) return;
    
    try {
      setIsDeleting(true);
      await donationAPI.deleteRequest(selectedRequestId);
      toast.success('Donation request deleted successfully!');
      setShowDeleteModal(false);
      setSelectedRequestId(null);
      refetch();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete donation request');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get status badge variant
  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      inprogress: 'bg-blue-100 text-blue-800',
      done: 'bg-green-100 text-green-800',
      canceled: 'bg-red-100 text-red-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  // Format date and time
  const formatDateTime = (date, time) => {
    const formattedDate = new Date(date).toLocaleDateString();
    return `${formattedDate} ${time}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" text="Loading donation requests..." />
      </div>
    );
  }

  const requests = requestsData?.requests || [];
  const totalPages = requestsData?.totalPages || 0;
  const totalRequests = requestsData?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <FaTint className="text-red-600" />
              <span>My Donation Requests</span>
            </CardTitle>
            <Button asChild>
              <Link to="/dashboard/create-donation-request" className="flex items-center space-x-2">
                <FaPlus className="h-4 w-4" />
                <span>Create New Request</span>
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by status:</span>
              </div>
              <Select
                value={statusFilter}
                onChange={handleFilterChange}
                className="min-w-48"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Completed</option>
                <option value="canceled">Cancelled</option>
              </Select>
            </div>
            <div className="text-sm text-gray-600">
              Total: {totalRequests} request{totalRequests !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      {requests.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Donor Info</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell className="font-medium">
                        {request.recipientName}
                      </TableCell>
                      <TableCell>
                        {request.recipientDistrict}, {request.recipientUpazila}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(request.donationDate, request.donationTime)}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">
                          {request.bloodGroup}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(request.donationStatus)}>
                          {request.donationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.donationStatus === 'inprogress' && request.donorInfo ? (
                          <div className="text-sm">
                            <div className="font-medium">{request.donorInfo.name}</div>
                            <div className="text-gray-500">{request.donorInfo.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {/* Edit Button */}
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/dashboard/edit-donation-request/${request._id}`}>
                              <FaEdit className="h-4 w-4" />
                            </Link>
                          </Button>

                          {/* View Button */}
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/donation-requests/${request._id}`}>
                              <FaEye className="h-4 w-4" />
                            </Link>
                          </Button>

                          {/* Delete Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setSelectedRequestId(request._id);
                              setShowDeleteModal(true);
                            }}
                          >
                            <FaTrash className="h-4 w-4" />
                          </Button>

                          {/* Status Action Buttons */}
                          {request.donationStatus === 'inprogress' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusUpdate(request._id, 'done')}
                              >
                                Done
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleStatusUpdate(request._id, 'canceled')}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* No Requests State */
        <Card>
          <CardContent className="text-center py-12">
            <FaTint className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter ? `No ${statusFilter} requests found` : 'No Donation Requests Yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {statusFilter 
                ? `You don't have any ${statusFilter} donation requests.` 
                : "You haven't created any donation requests yet. Create your first request to help someone in need."
              }
            </p>
            {!statusFilter && (
              <Button asChild>
                <Link to="/dashboard/create-donation-request" className="flex items-center space-x-2">
                  <FaPlus className="h-4 w-4" />
                  <span>Create Donation Request</span>
                </Link>
              </Button>
            )}
            {statusFilter && (
              <Button 
                variant="outline" 
                onClick={() => setStatusFilter("")}
              >
                Clear Filter
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-red-600 mb-4">
              <FaTint className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to Load Requests
            </h3>
            <p className="text-gray-500 mb-6">
              There was an error loading your donation requests. Please try again.
            </p>
            <Button onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Donation Request"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this donation request? This action cannot be undone.
          </p>
          <div className="flex space-x-4 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteRequest}
              disabled={isDeleting}
            >
              {isDeleting ? <LoadingSpinner size="sm" /> : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MyDonationRequests; 