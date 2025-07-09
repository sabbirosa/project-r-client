import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaEdit, FaEye, FaFilter, FaTint, FaTrash } from "react-icons/fa";
import { Link } from "react-router";
import { toast } from "react-toastify";
import useAdminAPI from "../api/useAdminAPI";
import useDonationAPI from "../api/useDonationAPI";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, LoadingSpinner, Modal, Pagination, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

function AllBloodDonationRequests() {
  const { user } = useAuth();
  const adminAPI = useAdminAPI();
  const donationAPI = useDonationAPI();
  
  // State for pagination, filtering, and modals
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const itemsPerPage = 10;

  // Fetch all donation requests with pagination and filtering
  const {
    data: requestsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['allDonationRequests', currentPage, statusFilter],
    queryFn: () => donationAPI.getAllRequests({
      page: currentPage,
      limit: itemsPerPage,
      status: statusFilter || undefined
    }),
    enabled: !!user && (user.role === 'admin' || user.role === 'volunteer')
  });

  // Handle status update
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await donationAPI.updateStatus(requestId, newStatus);
      toast.success(`Request status updated to ${newStatus}!`);
      refetch();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update request status');
    }
  };

  // Handle delete request (admin only)
  const handleDeleteRequest = async () => {
    if (!selectedRequestId) return;
    
    setIsDeleting(true);
    try {
      await donationAPI.deleteRequest(selectedRequestId);
      toast.success('Donation request deleted successfully!');
      refetch();
      setShowDeleteModal(false);
      setSelectedRequestId(null);
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete donation request');
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if user can perform certain actions
  const canEdit = (request) => {
    return user?.role === 'admin' || request.requesterId === user?._id;
  };

  const canDelete = (request) => {
    return user?.role === 'admin' || request.requesterId === user?._id;
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'inprogress': return 'warning';
      case 'done': return 'success';
      case 'canceled': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString || 'Not specified';
  };

  if (!user || (user.role !== 'admin' && user.role !== 'volunteer')) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Access denied. This page is only accessible to admins and volunteers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FaTint className="text-red-600" />
            <span>All Blood Donation Requests</span>
          </CardTitle>
          <p className="text-gray-600">
            {user.role === 'volunteer' 
              ? 'View and manage donation request statuses' 
              : 'Manage all blood donation requests in the system'}
          </p>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
              <option value="canceled">Canceled</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner size="lg" text="Loading donation requests..." />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              <p>Error loading donation requests: {error.message}</p>
              <Button onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : requestsData?.requests?.length === 0 ? (
            <div className="text-center py-12">
              <FaTint className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No donation requests found.</p>
              <p className="text-gray-400">
                {statusFilter ? `No requests with status "${statusFilter}"` : 'No requests have been created yet.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requester</TableHead>
                      {requestsData?.requests?.some(req => req.donationStatus === 'inprogress' && req.donorInfo) && (
                        <TableHead>Donor</TableHead>
                      )}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requestsData.requests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell className="font-medium">
                          {request.recipientName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {request.recipientDistrict}, {request.recipientUpazila}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {request.bloodGroup}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(request.donationDate)}<br />
                          {formatTime(request.donationTime)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(request.donationStatus)}>
                            {request.donationStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {request.requesterName}
                        </TableCell>
                        {request.donationStatus === 'inprogress' && request.donorInfo && (
                          <TableCell className="text-sm text-gray-600">
                            {request.donorInfo.name}<br />
                            <span className="text-xs">{request.donorInfo.email}</span>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {/* View Button */}
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <Link to={`/donation-requests/${request._id}`}>
                                <FaEye className="h-3 w-3" />
                              </Link>
                            </Button>

                            {/* Status Update - Available for volunteers and admins */}
                            {request.donationStatus === 'inprogress' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleStatusUpdate(request._id, 'done')}
                                >
                                  Done
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleStatusUpdate(request._id, 'canceled')}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}

                            {/* Edit Button - Admin only OR request owner */}
                            {user.role === 'admin' && canEdit(request) && (
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                              >
                                <Link to={`/dashboard/edit-donation-request/${request._id}`}>
                                  <FaEdit className="h-3 w-3" />
                                </Link>
                              </Button>
                            )}

                            {/* Delete Button - Admin only OR request owner */}
                            {user.role === 'admin' && canDelete(request) && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedRequestId(request._id);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <FaTrash className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {requestsData.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={requestsData.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <FaTint className="h-5 w-5 text-red-500 mt-1" />
            <div className="text-sm text-gray-600 space-y-2">
              <h4 className="font-medium text-gray-900">
                {user.role === 'volunteer' ? 'Volunteer Permissions:' : 'Admin Permissions:'}
              </h4>
              <ul className="list-disc list-inside space-y-1">
                <li>View all blood donation requests with pagination and filtering</li>
                <li>Update donation status (mark as done/canceled when in progress)</li>
                {user.role === 'admin' && (
                  <>
                    <li>Edit and delete any donation request</li>
                    <li>Full administrative control over all requests</li>
                  </>
                )}
                {user.role === 'volunteer' && (
                  <li><strong>Restricted:</strong> Cannot edit or delete requests (view and status update only)</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Confirm Delete
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this donation request? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRequest}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Request'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AllBloodDonationRequests; 