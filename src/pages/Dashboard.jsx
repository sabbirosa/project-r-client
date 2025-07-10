import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaEdit, FaEye, FaHandHoldingHeart, FaMoneyBillWave, FaPlus, FaTint, FaTrash, FaUsers } from "react-icons/fa";
import { Link } from "react-router";
import { toast } from "react-toastify";
import useAdminAPI from "../api/useAdminAPI";
import useDonationAPI from "../api/useDonationAPI";
import useFundingAPI from "../api/useFundingAPI";
import DonationAnalytics from "../components/charts/DonationAnalytics";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, LoadingSpinner, Modal, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function Dashboard() {
  const { user } = useAuth();
  const donationAPI = useDonationAPI();
  const adminAPI = useAdminAPI();
  const fundingAPI = useFundingAPI();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data based on user role
  const isDonor = user?.role === 'donor';
  const isAdminOrVolunteer = user?.role === 'admin' || user?.role === 'volunteer';

  // Fetch recent donation requests (for donors only)
  const {
    data: recentRequests,
    isLoading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests
  } = useQuery({
    queryKey: ['recentDonationRequests'],
    queryFn: () => donationAPI.getRecentRequests(3),
    enabled: !!user && isDonor
  });

  // Fetch dashboard statistics (for admin/volunteer)
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => adminAPI.getDashboardStats(),
    enabled: !!user && isAdminOrVolunteer
  });

  // Handle status update (done/cancel)
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await donationAPI.updateStatus(requestId, newStatus);
      toast.success(`Request ${newStatus === 'done' ? 'marked as completed' : 'cancelled'} successfully!`);
      refetchRequests();
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
      refetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete donation request');
    } finally {
      setIsDeleting(false);
    }
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

  const isLoading = isDonor ? requestsLoading : statsLoading;
  const error = isDonor ? requestsError : statsError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Welcome Section */}
      <motion.div variants={fadeInUp}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <FaTint className="text-red-600" />
              <span>Welcome back, {user?.name}!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {isDonor 
                ? "Thank you for being part of our blood donation community. Every donation counts and helps save lives."
                : `Welcome to your ${user?.role} dashboard. Here you can see important statistics and manage the platform.`
              }
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Cards for Admin/Volunteer */}
      {isAdminOrVolunteer && dashboardStats && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={fadeInUp}
        >
          {/* Total Users */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-b border-gray-200lue-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-blue-900">{dashboardStats.totalUsers}</p>
                    <p className="text-blue-700 text-sm">Active Donors</p>
                  </div>
                  <motion.div 
                    className="bg-blue-500 p-3 rounded-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaUsers className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Blood Donation Requests */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium mb-1">Blood Requests</p>
                    <p className="text-3xl font-bold text-red-900">{dashboardStats.totalRequests}</p>
                    <p className="text-red-700 text-sm">All Time</p>
                  </div>
                  <motion.div 
                    className="bg-red-500 p-3 rounded-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaHandHoldingHeart className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Funding */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium mb-1">Total Funding</p>
                    <p className="text-3xl font-bold text-green-900">${dashboardStats.totalFunding}</p>
                    <p className="text-green-700 text-sm">Raised</p>
                  </div>
                  <motion.div 
                    className="bg-green-500 p-3 rounded-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaMoneyBillWave className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Analytics Charts for Admin/Volunteer */}
      {isAdminOrVolunteer && (
        <motion.div variants={fadeInUp}>
          <DonationAnalytics />
        </motion.div>
      )}

      {/* Quick Actions for Admin/Volunteer */}
      {isAdminOrVolunteer && (
        <motion.div variants={fadeInUp}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild className="h-20 flex-col w-full">
                    <Link to="/dashboard/all-blood-donation-request">
                      <FaTint className="h-6 w-6 mb-2" />
                      Manage Blood Requests
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" className="h-20 flex-col w-full">
                    <Link to="/dashboard/content-management">
                      <FaEdit className="h-6 w-6 mb-2" />
                      Content Management
                    </Link>
                  </Button>
                </motion.div>

                {user?.role === 'admin' && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="outline" className="h-20 flex-col w-full">
                      <Link to="/dashboard/all-users">
                        <FaUsers className="h-6 w-6 mb-2" />
                        Manage Users
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Donation Requests Section (for donors only) */}
      {isDonor && recentRequests && recentRequests.length > 0 && (
        <motion.div variants={fadeInUp}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Recent Donation Requests
                </CardTitle>
                <Button asChild>
                  <Link to="/dashboard/my-donation-requests">
                    View My All Requests
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
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
                    {recentRequests.map((request) => (
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
                          <div className="flex space-x-2">
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
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* No Requests Message (for donors only) */}
      {isDonor && recentRequests && recentRequests.length === 0 && (
        <motion.div variants={fadeInUp}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="text-center py-12">
              <FaTint className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Donation Requests Yet
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't created any donation requests yet. Create your first request to help someone in need.
              </p>
              <Button asChild>
                <Link to="/dashboard/create-donation-request" className="flex items-center space-x-2">
                  <FaPlus className="h-4 w-4" />
                  <span>Create Donation Request</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div variants={fadeInUp}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="text-center py-12">
              <div className="text-red-600 mb-4">
                <FaTint className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Failed to Load Dashboard
              </h3>
              <p className="text-gray-500 mb-6">
                There was an error loading your dashboard data. Please try again.
              </p>
              <Button onClick={() => isDonor ? refetchRequests() : refetchStats()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
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
    </motion.div>
  );
}

export default Dashboard;