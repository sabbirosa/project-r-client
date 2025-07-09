import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaDonate, FaMoneyBillWave, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import useFundingAPI from "../api/useFundingAPI";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, LoadingSpinner, Modal, Pagination, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

function Funding() {
  const { user } = useAuth();
  const fundingAPI = useFundingAPI();
  
  // State for pagination and modals
  const [currentPage, setCurrentPage] = useState(1);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const itemsPerPage = 10;

  // Fetch funding records
  const {
    data: fundingData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['fundingRecords', currentPage],
    queryFn: () => fundingAPI.getAllFunding({
      page: currentPage,
      limit: itemsPerPage
    }),
    enabled: !!user && (user.role === 'admin' || user.role === 'volunteer')
  });

  // Fetch funding statistics
  const {
    data: fundingStats,
    isLoading: statsLoading
  } = useQuery({
    queryKey: ['fundingStats'],
    queryFn: () => fundingAPI.getFundingStats(),
    enabled: !!user && (user.role === 'admin' || user.role === 'volunteer')
  });

  // Form for donation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Handle donation submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await fundingAPI.createFunding({
        amount: parseFloat(data.amount),
        paymentMethod: 'stripe',
        transactionId: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });

      toast.success('Thank you for your donation!');
      setShowDonateModal(false);
      reset();
      refetch();
      
      // If stats are visible, refetch them too
      if (user.role === 'admin' || user.role === 'volunteer') {
        // TanStack Query will automatically refetch stats due to cache invalidation
      }
    } catch (error) {
      console.error('Error creating funding:', error);
      toast.error(error.response?.data?.message || 'Failed to process donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (statsLoading && (user.role === 'admin' || user.role === 'volunteer')) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading funding data..." />
      </div>
    );
  }

  const fundingRecords = fundingData?.funding || [];
  const totalPages = fundingData?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header with Give Fund Button */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <FaMoneyBillWave className="text-green-600" />
              <span>Funding</span>
            </CardTitle>
            <Button 
              onClick={() => setShowDonateModal(true)}
              className="flex items-center space-x-2"
            >
              <FaPlus className="h-4 w-4" />
              <span>Give Fund</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Cards (Admin/Volunteer only) */}
      {(user?.role === 'admin' || user?.role === 'volunteer') && fundingStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Funding</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${fundingStats.stats?.totalAmount?.toLocaleString() || '0'}
                  </p>
                </div>
                <FaMoneyBillWave className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Donors</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {fundingStats.stats?.totalRecords || 0}
                  </p>
                </div>
                <FaDonate className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Donation</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${fundingStats.stats?.totalRecords > 0 
                      ? (fundingStats.stats.totalAmount / fundingStats.stats.totalRecords).toFixed(2)
                      : '0'
                    }
                  </p>
                </div>
                <FaMoneyBillWave className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Funding Records Table (Admin/Volunteer only) */}
      {(user?.role === 'admin' || user?.role === 'volunteer') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Funding Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner size="lg" text="Loading funding records..." />
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">
                <p>Error loading funding records: {error.message}</p>
                <Button onClick={() => refetch()} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : fundingRecords.length === 0 ? (
              <div className="text-center py-12">
                <FaMoneyBillWave className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No funding records found.</p>
                <p className="text-gray-400">Encourage users to make their first donation!</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fundingRecords.map((record) => (
                      <TableRow key={record._id}>
                        <TableCell className="font-medium">
                          {record.userName}
                        </TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          ${record.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {record.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {record.transactionId}
                        </TableCell>
                        <TableCell>
                          {new Date(record.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={record.status === 'completed' ? 'success' : 'warning'}
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

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
      )}

      {/* Information for Regular Users */}
      {user?.role === 'donor' && (
        <Card>
          <CardContent className="p-8 text-center">
            <FaDonate className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Support Our Blood Donation Organization
            </h3>
            <p className="text-gray-600 mb-6">
              Your financial support helps us maintain our platform, organize blood drives, 
              and connect donors with those in need. Every contribution makes a difference.
            </p>
            <Button 
              onClick={() => setShowDonateModal(true)}
              size="lg"
              className="flex items-center space-x-2 mx-auto"
            >
              <FaDonate className="h-5 w-5" />
              <span>Make a Donation</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Donation Modal */}
      <Modal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        title="Make a Donation"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Donation Amount (USD) *
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="1"
              placeholder="Enter amount"
              {...register("amount", {
                required: "Donation amount is required",
                min: {
                  value: 1,
                  message: "Minimum donation amount is $1"
                },
                max: {
                  value: 10000,
                  message: "Maximum donation amount is $10,000"
                }
              })}
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Payment Information</h4>
            <p className="text-sm text-blue-700">
              For demo purposes, this will simulate a successful payment. 
              In a real application, this would integrate with Stripe or another payment processor.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDonateModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FaDonate className="h-4 w-4" />
                  <span>Donate Now</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Funding; 