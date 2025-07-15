import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCalendar, FaCreditCard, FaDonate, FaMoneyBillWave, FaPlus, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import useFundingAPI from "../api/useFundingAPI";
import { Badge, Button, Card, CardContent, Input, LoadingSpinner, Modal, Pagination, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

// Initialize Stripe with error handling
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

// Payment Form Component
function PaymentForm({ amount, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const { useCreateFunding } = useFundingAPI();
  const { mutateAsync: createFundingMutation } = useCreateFunding();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  // Check if Stripe is properly loaded
  if (!stripePublishableKey) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaCreditCard className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Payment Configuration Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Stripe is not configured. Please add your Stripe publishable key to the environment variables.
                </p>
                <p className="mt-1">
                  Add <code className="bg-red-100 px-1 rounded">VITE_STRIPE_PUBLISHABLE_KEY</code> to your .env file.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-4 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe has not loaded yet. Please try again.');
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user?.name,
          email: user?.email,
        },
      });

      if (error) {
        setCardError(error.message);
        toast.error(error.message);
        setIsProcessing(false);
        return;
      }

      // Process payment through your API
      const fundingData = {
        amount: parseFloat(amount),
        paymentMethodId: paymentMethod.id,
        donorName: user?.name,
        donorEmail: user?.email,
      };

      await createFundingMutation(fundingData);
      
      toast.success('Thank you for your donation!');
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Payment failed. Please try again.';
      setCardError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardChange = (event) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Donation Amount
        </label>
        <div className="text-2xl font-bold text-green-600 mb-4">
          ${parseFloat(amount).toFixed(2)}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-md p-4 bg-white">
          <CardElement
            onChange={handleCardChange}
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#374151',
                  fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
                  '::placeholder': {
                    color: '#9CA3AF',
                  },
                  iconColor: '#6B7280',
                },
                invalid: {
                  color: '#EF4444',
                  iconColor: '#EF4444',
                },
              },
              hidePostalCode: false,
            }}
          />
        </div>
        {cardError && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <FaCreditCard className="h-4 w-4 mr-1" />
            {cardError}
          </p>
        )}
      </div>

      <div className="bg-blue-50 border border-b border-gray-200lue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaCreditCard className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Test Mode
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Use test card: 4242 4242 4242 4242</p>
              <p>Any future date, any CVC, any postal code</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing || !!cardError}
          className="bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <FaDonate />
              <span>Donate ${parseFloat(amount).toFixed(2)}</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}

function Funding() {
  const { user } = useAuth();
  const fundingAPI = useFundingAPI();
  
  // State for pagination and modals
  const [currentPage, setCurrentPage] = useState(1);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  
  const itemsPerPage = 10;

  // Fetch funding records
  const { useGetAllFunding } = useFundingAPI();
  const {
    data: fundingData,
    isLoading,
    error,
    refetch
  } = useGetAllFunding({
    page: currentPage,
    limit: itemsPerPage
  });

  // Fetch funding statistics
  const { useGetFundingStats } = useFundingAPI();
  const {
    data: fundingStats,
    isLoading: statsLoading
  } = useGetFundingStats();

  // Form for donation amount
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm();

  const watchedAmount = watch('amount');

  // Handle donation modal submission
  const onDonationSubmit = (data) => {
    setDonationAmount(data.amount);
    // Don't close modal yet - payment form will handle success
  };

  // Handle successful payment
  const handlePaymentSuccess = () => {
    setShowDonateModal(false);
    reset();
    setDonationAmount('');
    refetch(); // Refresh funding records
  };

  // Handle payment cancellation
  const handlePaymentCancel = () => {
    setDonationAmount('');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaMoneyBillWave className="h-16 w-16 mx-auto mb-6 text-green-200" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Support Our Mission
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your financial support helps us save lives by maintaining our platform and supporting blood donation activities
          </p>
          <Button 
            onClick={() => setShowDonateModal(true)}
            size="lg"
            className="text-green-600 hover:bg-gray-100 flex items-center space-x-2 mx-auto"
          >
            <FaPlus className="h-5 w-5" />
            <span>Donate Now</span>
          </Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Statistics Cards */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Impact Together</h2>
          {fundingStats && !statsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Funding */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium mb-1">Total Funding</p>
                  <p className="text-3xl font-bold text-green-900">
                    ${fundingStats.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-green-700 text-sm">All Time</p>
                </div>
                <div className="bg-green-500 p-3 rounded-full">
                  <FaMoneyBillWave className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Donors */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-b border-gray-200lue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium mb-1">Total Donors</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {fundingStats.totalDonors || 0}
                  </p>
                  <p className="text-blue-700 text-sm">Contributors</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-full">
                  <FaUser className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Donation */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium mb-1">Average Donation</p>
                  <p className="text-3xl font-bold text-purple-900">
                    ${fundingStats.averageAmount?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-purple-700 text-sm">Per Donor</p>
                </div>
                <div className="bg-purple-500 p-3 rounded-full">
                  <FaDonate className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
          )}
        </section>

        {/* Recent Donations Section */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Recent Donations</h2>
          <p className="text-gray-600 text-center mb-8">Thank you to our generous supporters</p>
          
          <div>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner size="lg" text="Loading funding records..." />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Failed to load funding records</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Funding Date</TableHead>
                      <TableHead>Payment Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fundingData?.records?.length > 0 ? (
                      fundingData.records.map((funding) => (
                        <TableRow key={funding._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <FaUser className="text-gray-400" />
                              <span>{funding.donorName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <FaMoneyBillWave className="text-green-500" />
                              <span className="font-semibold text-green-600">
                                ${funding.amount.toFixed(2)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <FaCalendar className="text-gray-400" />
                              <span>{formatDate(funding.createdAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                funding.paymentStatus === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : funding.paymentStatus === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {funding.paymentStatus || 'completed'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          No funding records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {fundingData?.totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={fundingData.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
          </div>
        </section>

      {/* Donation Modal */}
      <Modal
        isOpen={showDonateModal}
        onClose={() => {
          setShowDonateModal(false);
          reset();
          setDonationAmount('');
        }}
        title="Make a Donation"
      >
        <div className="space-y-6">
          {!donationAmount ? (
            // Amount selection form
            <form onSubmit={handleSubmit(onDonationSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="Enter amount (e.g., 25.00)"
                  {...register('amount', {
                    required: 'Amount is required',
                    min: { value: 1, message: 'Minimum donation is $1' },
                    max: { value: 10000, message: 'Maximum donation is $10,000' }
                  })}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>

              {/* Quick amount buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setValue('amount', amount)}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>

              <div className="flex space-x-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDonateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Continue to Payment
                </Button>
              </div>
            </form>
          ) : (
            // Stripe payment form
            stripePromise ? (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={donationAmount}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                />
              </Elements>
            ) : (
              <div className="text-center py-8">
                <FaCreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Payment Not Available
                </h3>
                <p className="text-gray-600 mb-4">
                  Payment processing is not configured. Please contact support.
                </p>
                <Button onClick={() => setShowDonateModal(false)}>
                  Close
                </Button>
              </div>
            )
          )}
        </div>
      </Modal>
      </div>
    </div>
  );
}

export default Funding; 