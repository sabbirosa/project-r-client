import { motion } from "framer-motion";
import { useState } from "react";
import { FaCalendarAlt, FaChartArea, FaChartBar, FaChartLine } from "react-icons/fa";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import useAdminAPI from "../../api/useAdminAPI";
import useDonationAPI from "../../api/useDonationAPI";
import useFundingAPI from "../../api/useFundingAPI";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, LoadingSpinner, Select } from "../ui";

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'];

export default function DonationAnalytics() {
    const [timeframe, setTimeframe] = useState('monthly');
    const { user } = useAuth();
    const adminAPI = useAdminAPI();
    const donationAPI = useDonationAPI();
    const fundingAPI = useFundingAPI();

    // Check if user has permission to view analytics
    const hasAnalyticsPermission = user && (user.role === 'admin' || user.role === 'volunteer');

    // Only make API calls if user has permission
    const { useGetAnalyticsData, useGetBloodGroupDistribution, useGetTrendData, useGetFundingStats } = useAdminAPI();
    const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useGetAnalyticsData({ timeframe }, {
        enabled: hasAnalyticsPermission,
        retry: (failureCount, error) => {
            // Don't retry on permission errors
            if (error?.response?.status === 403 || error?.response?.status === 401) {
                return false;
            }
            return failureCount < 2;
        }
    });

    const { data: bloodGroupData, isLoading: bloodGroupLoading, error: bloodGroupError } = useGetBloodGroupDistribution({
        enabled: hasAnalyticsPermission,
        retry: (failureCount, error) => {
            if (error?.response?.status === 403 || error?.response?.status === 401) {
                return false;
            }
            return failureCount < 2;
        }
    });

    // Get real trend data instead of generating fake data
    const { data: trendData, isLoading: trendLoading, error: trendError } = useGetTrendData(timeframe, {
        enabled: hasAnalyticsPermission,
        retry: (failureCount, error) => {
            if (error?.response?.status === 403 || error?.response?.status === 401) {
                return false;
            }
            return failureCount < 2;
        }
    });

    const { useGetStats } = useDonationAPI();
    const { data: donationStats, isLoading: donationStatsLoading, error: donationStatsError } = useGetStats({
        enabled: hasAnalyticsPermission,
        retry: (failureCount, error) => {
            if (error?.response?.status === 403 || error?.response?.status === 401) {
                return false;
            }
            return failureCount < 2;
        }
    });

    const { data: fundingStats, isLoading: fundingStatsLoading, error: fundingStatsError } = useGetFundingStats({
        enabled: hasAnalyticsPermission,
        retry: (failureCount, error) => {
            if (error?.response?.status === 403 || error?.response?.status === 401) {
                return false;
            }
            return failureCount < 2;
        }
    });

    // Check for permission errors specifically
    const hasPermissionError = [analyticsError, bloodGroupError, donationStatsError, fundingStatsError, trendError]
        .some(error => error?.response?.status === 403 || error?.response?.status === 401);

    const hasServerError = [analyticsError, bloodGroupError, donationStatsError, fundingStatsError, trendError]
        .some(error => error?.response?.status >= 500);

    const isLoading = analyticsLoading || bloodGroupLoading || donationStatsLoading || fundingStatsLoading || trendLoading;

    // Permission check - show message if user doesn't have permission
    if (!hasAnalyticsPermission) {
        return (
            <div className="space-y-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                        <FaChartArea className="w-12 h-12 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Access Required</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Analytics data is only available to administrators and volunteers. 
                        Please contact your administrator if you need access to this information.
                    </p>
                </motion.div>
            </div>
        );
    }

    // Handle permission errors
    if (hasPermissionError) {
        return (
            <div className="space-y-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <FaChartArea className="w-12 h-12 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        You don't have permission to view analytics data. Your session may have expired. 
                        Please log out and log back in.
                    </p>
                </motion.div>
            </div>
        );
    }

    // Handle server errors
    if (hasServerError) {
        return (
            <div className="space-y-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FaChartArea className="w-12 h-12 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Server Error</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        There was an error loading analytics data from the server. 
                        Please try again later or contact support.
                    </p>
                </motion.div>
            </div>
        );
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                    <span className="ml-3 text-lg text-gray-600">Loading analytics data...</span>
                </div>
            </div>
        );
    }

    // Process the data for charts using real API data
    const processedData = {
        userStats: analyticsData?.users || {},
        donationStats: analyticsData?.donations || donationStats || {},
        fundingStats: analyticsData?.funding || fundingStats || {},
        bloodGroups: bloodGroupData?.bloodGroups || []
    };

    // Use real trend data from API instead of generating fake data
    const donationTrends = trendData?.data?.map(item => ({
        name: item.period,
        donations: item.requests,
        completed: item.completed,
        pending: item.pending
    })) || [];

    const userGrowth = trendData?.data?.map(item => ({
        name: item.period,
        users: item.newUsers
    })) || [];

    const fundingTrends = trendData?.data?.map(item => ({
        name: item.period,
        amount: item.fundingAmount
    })) || [];

    // Prepare status distribution data using real data
    const statusData = [
        { name: 'Pending', value: processedData.donationStats.pendingRequests || processedData.donationStats.pending || 0, color: '#eab308' },
        { name: 'Completed', value: processedData.donationStats.completedRequests || processedData.donationStats.completed || 0, color: '#22c55e' },
        { name: 'In Progress', value: processedData.donationStats.inProgressRequests || processedData.donationStats.inProgress || 0, color: '#3b82f6' },
        { name: 'Canceled', value: processedData.donationStats.canceledRequests || processedData.donationStats.canceled || 0, color: '#ef4444' }
    ].filter(item => item.value > 0);

    return (
        <div className="space-y-6">
            {/* Header with time filter */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FaChartArea className="text-red-600" />
                        Donation Analytics
                    </h1>
                    <p className="text-gray-600 mt-1">Comprehensive insights into donation patterns and statistics</p>
                </div>
                <Select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                    <option value="daily">Daily View</option>
                    <option value="weekly">Weekly View</option>
                    <option value="monthly">Monthly View</option>
                </Select>
            </motion.div>

            {/* Summary Cards */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {processedData.donationStats.totalRequests || processedData.donationStats.total || 0}
                                </p>
                            </div>
                            <FaChartLine className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Donors</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {processedData.userStats.totalUsers || processedData.userStats.total || 0}
                                </p>
                            </div>
                            <FaChartBar className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {(processedData.donationStats.totalRequests || processedData.donationStats.total) > 0 
                                        ? Math.round(((processedData.donationStats.completedRequests || processedData.donationStats.completed || 0) / (processedData.donationStats.totalRequests || processedData.donationStats.total)) * 100)
                                        : 0}%
                                </p>
                            </div>
                            <FaCalendarAlt className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Funding</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${(processedData.fundingStats.totalAmount || 0).toLocaleString()}
                                </p>
                            </div>
                            <FaChartArea className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donation Trends */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Donation Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={donationTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area 
                                        type="monotone" 
                                        dataKey="donations" 
                                        stroke="#ef4444" 
                                        fill="#fee2e2" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Status Distribution */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Request Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* User Growth */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>User Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={userGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="users" 
                                        stroke="#3b82f6" 
                                        strokeWidth={2} 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Blood Group Distribution */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Blood Group Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={processedData.bloodGroups}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#ef4444" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Funding Trends */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Funding Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={fundingTrends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                                <Area 
                                    type="monotone" 
                                    dataKey="amount" 
                                    stroke="#8b5cf6" 
                                    fill="#f3e8ff" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
} 