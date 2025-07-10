import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle, Select } from "../ui";

// Sample data - in real implementation, this would come from API
const generateSampleData = () => {
  const today = new Date();
  const dailyData = [];
  const weeklyData = [];
  const monthlyData = [];

  // Generate daily data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dailyData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      requests: Math.floor(Math.random() * 15) + 5,
      completed: Math.floor(Math.random() * 10) + 3,
      pending: Math.floor(Math.random() * 8) + 2
    });
  }

  // Generate weekly data for last 12 weeks
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 7));
    weeklyData.push({
      week: `Week ${12 - i}`,
      requests: Math.floor(Math.random() * 50) + 20,
      completed: Math.floor(Math.random() * 35) + 15,
      pending: Math.floor(Math.random() * 25) + 5
    });
  }

  // Generate monthly data for last 6 months
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    monthlyData.push({
      month: monthNames[date.getMonth()],
      requests: Math.floor(Math.random() * 200) + 100,
      completed: Math.floor(Math.random() * 150) + 80,
      pending: Math.floor(Math.random() * 80) + 20
    });
  }

  return { dailyData, weeklyData, monthlyData };
};

// Blood group distribution data
const bloodGroupData = [
  { name: 'O+', value: 35, fill: '#ef4444' },
  { name: 'A+', value: 30, fill: '#f97316' },
  { name: 'B+', value: 15, fill: '#eab308' },
  { name: 'AB+', value: 8, fill: '#22c55e' },
  { name: 'O-', value: 5, fill: '#3b82f6' },
  { name: 'A-', value: 4, fill: '#8b5cf6' },
  { name: 'B-', value: 2, fill: '#ec4899' },
  { name: 'AB-', value: 1, fill: '#06b6d4' }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
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

function DonationAnalytics() {
  const [timeframe, setTimeframe] = useState('daily');
  const [chartType, setChartType] = useState('area');
  const [data, setData] = useState({});

  useEffect(() => {
    setData(generateSampleData());
  }, []);

  const getCurrentData = () => {
    switch (timeframe) {
      case 'weekly':
        return data.weeklyData || [];
      case 'monthly':
        return data.monthlyData || [];
      default:
        return data.dailyData || [];
    }
  };

  const getXAxisKey = () => {
    switch (timeframe) {
      case 'weekly':
        return 'week';
      case 'monthly':
        return 'month';
      default:
        return 'date';
    }
  };

  const renderChart = () => {
    const currentData = getCurrentData();
    const xAxisKey = getXAxisKey();

    const commonProps = {
      data: currentData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="requests" fill="#ef4444" name="Total Requests" />
            <Bar dataKey="completed" fill="#22c55e" name="Completed" />
            <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="requests" stroke="#ef4444" strokeWidth={2} name="Total Requests" />
            <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} name="Completed" />
            <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pending" />
          </LineChart>
        );
      default:
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="requests" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Total Requests" />
            <Area type="monotone" dataKey="completed" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} name="Completed" />
            <Area type="monotone" dataKey="pending" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Pending" />
          </AreaChart>
        );
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Chart Controls */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
        variants={fadeInUp}
      >
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <FaChartArea className="text-red-600" />
          <span>Donation Analytics</span>
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={timeframe}
            onValueChange={setTimeframe}
            className="min-w-[120px]"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Select>
          
          <Select
            value={chartType}
            onValueChange={setChartType}
            className="min-w-[120px]"
          >
            <option value="area">Area Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
          </Select>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div className="lg:col-span-2" variants={fadeInUp}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {chartType === 'bar' ? <FaChartBar className="text-blue-600" /> :
                 chartType === 'line' ? <FaChartLine className="text-green-600" /> :
                 <FaChartArea className="text-purple-600" />}
                <span className="capitalize">{timeframe} Donation Requests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Blood Group Distribution */}
        <motion.div variants={fadeInUp}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FaCalendarAlt className="text-red-600" />
                <span>Blood Group Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bloodGroupData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {bloodGroupData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary Statistics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        variants={fadeInUp}
      >
        <Card className="bg-red-50 border-red-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Today's Requests</p>
                <p className="text-2xl font-bold text-red-900">12</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <FaCalendarAlt className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-red-700 mt-1">+20% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-900">8</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <FaChartLine className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-700 mt-1">67% completion rate</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">4</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full">
                <FaChartBar className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-yellow-700 mt-1">Awaiting donors</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">This Month</p>
                <p className="text-2xl font-bold text-blue-900">156</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <FaChartArea className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-1">+15% from last month</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default DonationAnalytics; 