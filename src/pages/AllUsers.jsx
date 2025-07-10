import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaCheck, FaFilter, FaTimes, FaUserShield, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import useAdminAPI from "../api/useAdminAPI";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, LoadingSpinner, Pagination, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

function AllUsers() {
  const { user } = useAuth();
  const adminAPI = useAdminAPI();
  
  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  
  const itemsPerPage = 10;

  // Fetch users with pagination and filtering
  const {
    data: usersData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['allUsers', currentPage, statusFilter],
    queryFn: () => adminAPI.getAllUsers({
      page: currentPage,
      limit: itemsPerPage,
      status: statusFilter || undefined
    }),
    enabled: !!user && user.role === 'admin'
  });

  // Handle user status update
  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await adminAPI.updateUserStatus(userId, newStatus);
      toast.success(`User ${newStatus} successfully!`);
      refetch();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  // Handle user role update
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}!`);
      refetch();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading users..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>Error loading users: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const users = usersData?.users || [];
  const totalPages = usersData?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FaUsers className="text-blue-600" />
            <span>All Users</span>
          </CardTitle>
          <p className="text-gray-600">
            Manage user accounts, roles, and status
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
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </Select>
            
            <div className="text-sm text-gray-500">
              Total users: {usersData?.total || 0}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <FaUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No users found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Avatar</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userData) => (
                      <TableRow key={userData._id}>
                        <TableCell>
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=ef4444&color=fff`}
                            alt={userData.name}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {userData.name}
                        </TableCell>
                        <TableCell>
                          {userData.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {userData.bloodGroup}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {userData.district}, {userData.upazila}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              userData.role === 'admin' ? 'success' : 
                              userData.role === 'volunteer' ? 'warning' : 
                              'secondary'
                            }
                          >
                            {userData.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={userData.status === 'active' ? 'success' : 'destructive'}
                          >
                            {userData.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {/* Status Toggle */}
                            {userData.status === 'active' ? (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(userData._id, 'blocked')}
                                className="flex items-center space-x-1"
                              >
                                <FaTimes className="h-3 w-3" />
                                <span>Block</span>
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleStatusUpdate(userData._id, 'active')}
                                className="flex items-center space-x-1"
                              >
                                <FaCheck className="h-3 w-3" />
                                <span>Unblock</span>
                              </Button>
                            )}

                            {/* Role Selector */}
                            <Select
                              value={userData.role}
                              onChange={(e) => {
                                const newRole = e.target.value;
                                if (newRole !== userData.role) {
                                  handleRoleUpdate(userData._id, newRole);
                                }
                              }}
                            >
                              <option value="donor">Donor</option>
                              <option value="volunteer">Volunteer</option>
                              <option value="admin">Admin</option>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
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
            <FaUserShield className="h-5 w-5 text-blue-500 mt-1" />
            <div className="text-sm text-gray-600 space-y-2">
              <h4 className="font-medium text-gray-900">User Management Guidelines:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Block:</strong> Blocked users cannot create donation requests but can still log in</li>
                <li><strong>Roles:</strong> Donors can create requests, Volunteers can manage all requests, Admins have full access</li>
                <li><strong>Role Changes:</strong> Be careful when changing roles as this affects user permissions</li>
                <li><strong>Admin Role:</strong> Ensure there's always at least one admin user in the system</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AllUsers; 