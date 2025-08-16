import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState } from "react";
import { FaDownload, FaMapMarkerAlt, FaSearch, FaTint, FaUser } from "react-icons/fa";
import usePublicAPI from "../api/usePublicAPI";
import { Button, Card, CardContent, LoadingSpinner, Select } from "../components/ui";
import { districts, getUpazilasbyDistrictName } from "../constants/bdLocations";
import { bloodGroups } from "../constants/bloodGroups";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
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

function SearchDonors() {
  const { useSearchDonors } = usePublicAPI();
  const resultsRef = useRef(null);
  
  const [searchForm, setSearchForm] = useState({
    bloodGroup: "",
    district: "",
    upazila: ""
  });
  const [searchParams, setSearchParams] = useState(null);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Use the search hook with conditional execution
  const { data, isLoading: isSearching, isError, error } = useSearchDonors(searchParams);
  const donors = data?.donors || [];
  const hasSearched = searchParams !== null;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Update upazilas when district changes
    if (name === "district") {
      // Use the new utility function for filtering upazilas
      const districtUpazilas = getUpazilasbyDistrictName(value);
      setFilteredUpazilas(districtUpazilas);
      setSearchForm(prev => ({ ...prev, upazila: "" })); // Reset upazila
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Set search parameters to trigger the query
    setSearchParams({
      ...searchForm
    });
  };

  // Generate and download PDF
  const downloadPDF = async () => {
    if (!resultsRef.current || donors.length === 0) return;

    setIsGeneratingPDF(true);
    
    try {
      // Create a clone of the results for PDF generation
      const element = resultsRef.current;
      
      // Generate canvas from HTML
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add title page
      pdf.setFontSize(20);
      pdf.setTextColor(239, 68, 68); // Red color
      pdf.text('Blood Donor Search Results', 105, 30, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Search Criteria:`, 20, 50);
      pdf.text(`Blood Group: ${searchForm.bloodGroup}`, 20, 60);
      pdf.text(`District: ${searchForm.district}`, 20, 70);
      pdf.text(`Upazila: ${searchForm.upazila}`, 20, 80);
      pdf.text(`Total Donors Found: ${donors.length}`, 20, 90);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 100);

      // Add results as image
      let position = 120;
      
      if (heightLeft < pageHeight - position) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      } else {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 20, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      // Download the PDF
      pdf.save(`blood-donors-${searchForm.bloodGroup}-${searchForm.district}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Search Blood Donors
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find blood donors in your area. Search by blood group and location to connect with donors.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <Card className="mb-8 hover:shadow-xl transition-all duration-300 border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Blood Group */}
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Blood Group
                    </label>
                    <Select
                      name="bloodGroup"
                      value={searchForm.bloodGroup}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group.value} value={group.value}>{group.label}</option>
                      ))}
                    </Select>
                  </motion.div>

                  {/* District */}
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      District
                    </label>
                    <Select
                      name="district"
                      value={searchForm.district}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select District</option>
                      {districts.map(district => (
                        <option key={district.name} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </Select>
                  </motion.div>

                  {/* Upazila */}
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upazila
                    </label>
                    <Select
                      name="upazila"
                      value={searchForm.upazila}
                      onChange={handleInputChange}
                      disabled={!searchForm.district}
                      required
                    >
                      <option value="">Select Upazila</option>
                      {filteredUpazilas.map(upazila => (
                        <option key={upazila.id} value={upazila.name}>{upazila.name}</option>
                      ))}
                    </Select>
                  </motion.div>
                </div>

                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSearching}
                      className="px-8"
                    >
                      {isSearching ? (
                        <>
                          <LoadingSpinner className="w-4 h-4 mr-2" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <FaSearch className="w-4 h-4 mr-2" />
                          Search Donors
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Results */}
        {hasSearched && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Search Results
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 dark:text-gray-400">
                  {donors.length} donor{donors.length !== 1 ? 's' : ''} found
                </span>
                {donors.length > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={downloadPDF}
                      disabled={isGeneratingPDF}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      {isGeneratingPDF ? (
                        <>
                          <LoadingSpinner className="w-4 h-4" />
                          <span>Generating PDF...</span>
                        </>
                      ) : (
                        <>
                          <FaDownload className="w-4 h-4" />
                          <span>Download PDF</span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>

            <div ref={resultsRef}>
              {donors.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="initial"
                  animate="animate"
                  variants={staggerContainer}
                >
                  {donors.map((donor, index) => (
                    <motion.div
                      key={donor._id}
                      variants={scaleIn}
                      custom={index}
                      whileHover={{ y: -5, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-red-50 dark:border-red-900/20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            {donor.avatar ? (
                              <motion.img
                                src={donor.avatar}
                                alt={donor.name}
                                className="w-12 h-12 rounded-full object-cover"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                              />
                            ) : (
                              <motion.div 
                                className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"
                                whileHover={{ scale: 1.1, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                              >
                                <FaUser className="w-6 h-6 text-red-600" />
                              </motion.div>
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{donor.name}</h3>
                              <div className="flex items-center text-red-600 text-sm">
                                <FaTint className="w-3 h-3 mr-1" />
                                {donor.bloodGroup}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                            <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                            {donor.upazila}, {donor.district}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div variants={fadeInUp}>
                  <Card className="hover:shadow-xl transition-all duration-300 border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <FaSearch className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No Donors Found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        No donors found matching your criteria. Try adjusting your search parameters.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <Card className="hover:shadow-xl transition-all duration-300 border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <FaSearch className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Ready to Search
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Fill in the search form above to find blood donors in your area.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default SearchDonors; 