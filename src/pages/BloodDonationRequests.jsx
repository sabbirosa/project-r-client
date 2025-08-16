import { motion } from "framer-motion";
import { useState } from "react";
import { FaCalendarAlt, FaClock, FaEye, FaFilter, FaMapMarkerAlt, FaTint } from "react-icons/fa";
import { Link } from "react-router";
import usePublicAPI from "../api/usePublicAPI";
import { Button, Card, CardContent, LoadingSpinner, Pagination, Select } from "../components/ui";
import { districts } from "../constants/bdLocations";
import { bloodGroups } from "../constants/bloodGroups";

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

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

function BloodDonationRequests() {
  const { useGetPendingDonations } = usePublicAPI();
  
  const [currentPage, setCurrentPage] = useState(1);

  // Single sorting control: "<field>_<order>"
  // fields: date | bloodGroup | district
  // orders: asc | desc
  const [sortOption, setSortOption] = useState("date_desc");

  const [filterBloodGroup, setFilterBloodGroup] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");

  // Fetch pending donation requests using the hook
  const { data, isLoading: loading, isError, error } = useGetPendingDonations({ 
    page: currentPage, 
    limit: 12 
  });

  const rawRequests = data?.requests || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  // Apply filters and sorting
  const filteredAndSortedRequests = rawRequests
    .filter(request => {
      if (filterBloodGroup && request.bloodGroup !== filterBloodGroup) return false;
      if (filterDistrict && request.recipientDistrict !== filterDistrict) return false;
      return true;
    })
    .sort((a, b) => {
      const [by, order] = sortOption.split("_"); // e.g., ["date", "desc"]
      let compareValue = 0;

      if (by === "date") {
        compareValue = new Date(a.donationDate).getTime() - new Date(b.donationDate).getTime();
      } else if (by === "bloodGroup") {
        compareValue = a.bloodGroup.localeCompare(b.bloodGroup);
      } else if (by === "district") {
        compareValue = a.recipientDistrict.localeCompare(b.recipientDistrict);
      }

      return order === "asc" ? compareValue : -compareValue;
    });

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Clear filters
  const clearFilters = () => {
    setFilterBloodGroup("");
    setFilterDistrict("");
    setSortOption("date_desc");
  };

  // Format date and time
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Blood Donation Requests
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Help save lives by responding to urgent blood donation requests in your area.
          </p>
          {total > 0 && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
              {filteredAndSortedRequests.length} of {total} request{total !== 1 ? "s" : ""} shown
            </p>
          )}
        </motion.div>

        {/* Filters and Sorting */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp}>
          <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FaFilter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filter & Sort</h2>
                </div>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 dark:text-gray-400"
                >
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Blood Group Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blood Group
                  </label>
                  <Select
                    value={filterBloodGroup}
                    onChange={(e) => setFilterBloodGroup(e.target.value)}
                  >
                    <option value="">All Blood Groups</option>
                    {bloodGroups.map(group => (
                      <option key={group.value} value={group.value}>
                        {group.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* District Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    District
                  </label>
                  <Select
                    value={filterDistrict}
                    onChange={(e) => setFilterDistrict(e.target.value)}
                  >
                    <option value="">All Districts</option>
                    {districts.map(district => (
                      <option key={district.name} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Single Sort Control */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort
                  </label>
                  <Select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <optgroup label="Date">
                      <option value="date_desc">Newest First</option>
                      <option value="date_asc">Oldest First</option>
                    </optgroup>
                    <optgroup label="Blood Group">
                      <option value="bloodGroup_asc">A → Z</option>
                      <option value="bloodGroup_desc">Z → A</option>
                    </optgroup>
                    <optgroup label="District">
                      <option value="district_asc">A → Z</option>
                      <option value="district_desc">Z → A</option>
                    </optgroup>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner className="w-8 h-8" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading requests...</span>
          </div>
        ) : filteredAndSortedRequests.length > 0 ? (
          <>
            {/* Requests Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              {filteredAndSortedRequests.map((request, index) => (
                <motion.div
                  key={request._id}
                  variants={scaleIn}
                  custom={index}
                  whileHover={{ y: -5, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      {/* Header with Blood Group */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <motion.div 
                            className="bg-red-100 p-2 rounded-full"
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FaTint className="w-4 h-4 text-red-600" />
                          </motion.div>
                          <span className="font-bold text-red-600 text-lg">
                            {request.bloodGroup}
                          </span>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Urgent
                        </span>
                      </div>

                      {/* Patient Name */}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        For: {request.recipientName}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                        <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {request.hospitalName}, {request.recipientUpazila}, {request.recipientDistrict}
                        </span>
                      </div>

                      {/* Date and Time */}
                      <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-4">
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
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button asChild className="w-full" variant="outline">
                          <Link to={`/donation-requests/${request._id}`} className="flex items-center justify-center space-x-2">
                            <FaEye className="w-4 h-4" />
                            <span>View Details</span>
                          </Link>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

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
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                  <FaTint className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {rawRequests.length === 0 ? "No Active Requests" : "No Matching Requests"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {rawRequests.length === 0 
                    ? "There are currently no pending blood donation requests."
                    : "No requests match your current filters. Try adjusting your search criteria."}
                </p>
                <div className="space-y-2">
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    {rawRequests.length === 0 
                      ? "Check back later or consider registering as a donor to be notified of new requests."
                      : ""}
                  </p>
                  {rawRequests.length > 0 && (
                    <Button onClick={clearFilters} variant="outline" className="mt-4">
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ready to Save Lives?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
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
