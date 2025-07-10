import { useState } from "react";
import { FaMapMarkerAlt, FaSearch, FaTint, FaUser } from "react-icons/fa";
import usePublicAPI from "../api/usePublicAPI";
import { Button, Card, CardContent, LoadingSpinner, Select } from "../components/ui";
import { districts, upazilas } from "../constants/bdLocations";
import { bloodGroups } from "../constants/bloodGroups";

function SearchDonors() {
  const { searchDonors } = usePublicAPI();
  
  const [searchForm, setSearchForm] = useState({
    bloodGroup: "",
    district: "",
    upazila: ""
  });
  const [donors, setDonors] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Update upazilas when district changes
    if (name === "district") {
      const selectedDistrict = districts.find(d => d.name === value);
      if (selectedDistrict) {
        const districtUpazilas = upazilas.filter(u => u.district_id === selectedDistrict.id);
        setFilteredUpazilas(districtUpazilas);
      } else {
        setFilteredUpazilas([]);
      }
      setSearchForm(prev => ({ ...prev, upazila: "" })); // Reset upazila
    }
  };

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const result = await searchDonors(searchForm);
      setDonors(result.donors || []);
      setHasSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      setDonors([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Search Blood Donors
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find blood donors in your area. Search by blood group and location to connect with donors.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                </div>

                {/* Upazila */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                </div>
              </div>

              <div className="text-center">
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
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results
              </h2>
              <span className="text-gray-600">
                {donors.length} donor{donors.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {donors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map(donor => (
                  <Card key={donor._id}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        {donor.avatar ? (
                          <img
                            src={donor.avatar}
                            alt={donor.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <FaUser className="w-6 h-6 text-red-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                          <div className="flex items-center text-red-600 text-sm">
                            <FaTint className="w-3 h-3 mr-1" />
                            {donor.bloodGroup}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 text-sm">
                        <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                        {donor.upazila}, {donor.district}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Donors Found
                  </h3>
                  <p className="text-gray-600">
                    No donors found matching your criteria. Try adjusting your search parameters.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <Card>
            <CardContent className="p-8 text-center">
              <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Search
              </h3>
              <p className="text-gray-600">
                Fill in the search form above to find blood donors in your area.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default SearchDonors; 