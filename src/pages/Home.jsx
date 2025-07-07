import { FaEnvelope, FaHandHoldingHeart, FaMapMarkerAlt, FaPhone, FaSearch, FaTint, FaUserPlus, FaUsers } from "react-icons/fa";
import { Link } from "react-router";
import { Button, Card, CardContent, Input, Textarea } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Every Drop Counts
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-red-100">
              Join our community of life-savers. Donate blood and help save lives in your community.
            </p>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated() ? (
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="bg-white text-red-600 hover:bg-gray-100"
                >
                  <Link to="/register" className="flex items-center space-x-2">
                    <FaUserPlus className="h-5 w-5" />
                    <span>Join as a Donor</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="bg-white text-red-600 hover:bg-gray-100"
                >
                  <Link to="/dashboard/create-donation-request" className="flex items-center space-x-2">
                    <FaTint className="h-5 w-5" />
                    <span>Request Blood</span>
                  </Link>
                </Button>
              )}
              
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600"
              >
                <Link to="/search" className="flex items-center space-x-2">
                  <FaSearch className="h-5 w-5" />
                  <span>Search Donors</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Lives Saved */}
            <Card className="text-center p-8 bg-red-50">
              <CardContent className="pt-6">
                <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHandHoldingHeart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
                <p className="text-gray-600">Lives Saved</p>
              </CardContent>
            </Card>

            {/* Active Donors */}
            <Card className="text-center p-8 bg-red-50">
              <CardContent className="pt-6">
                <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">5,000+</h3>
                <p className="text-gray-600">Active Donors</p>
              </CardContent>
            </Card>

            {/* Blood Units */}
            <Card className="text-center p-8 bg-red-50">
              <CardContent className="pt-6">
                <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTint className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">25,000+</h3>
                <p className="text-gray-600">Blood Units Donated</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Donate Blood */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Donate Blood?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Blood donation is a simple act that can save multiple lives. Here's why your donation matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Save Lives */}
            <Card>
              <CardContent className="p-6">
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FaHandHoldingHeart className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Lives</h3>
                <p className="text-gray-600">
                  One blood donation can save up to three lives. Your single act of kindness can make a huge difference.
                </p>
              </CardContent>
            </Card>

            {/* Emergency Ready */}
            <Card>
              <CardContent className="p-6">
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FaPhone className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Emergency Ready</h3>
                <p className="text-gray-600">
                  Blood is needed every 2 seconds. Help us maintain emergency blood supplies for critical situations.
                </p>
              </CardContent>
            </Card>

            {/* Health Benefits */}
            <Card>
              <CardContent className="p-6">
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FaUsers className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Health Benefits</h3>
                <p className="text-gray-600">
                  Regular blood donation can improve your health by reducing iron levels and providing free health checkups.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these easy steps to become a blood donor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Register</h3>
              <p className="text-gray-600">Create your account and provide basic information</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Matched</h3>
              <p className="text-gray-600">We'll connect you with nearby donation requests</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Donate</h3>
              <p className="text-gray-600">Visit the location and donate blood safely</p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Lives</h3>
              <p className="text-gray-600">Your donation helps save lives in your community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? Need help? We're here for you 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Send us a message</h3>
                <form className="space-y-6">
                  <Input
                    label="Your Name"
                    placeholder="Enter your name"
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                  />
                  
                  <Textarea
                    label="Message"
                    rows={4}
                    placeholder="Enter your message"
                  />
                  
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <FaPhone className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Emergency Hotline</h4>
                  <p className="text-gray-600">+880-123-456-789</p>
                  <p className="text-sm text-gray-500">Available 24/7 for emergency blood requests</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <FaEnvelope className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Email Support</h4>
                  <p className="text-gray-600">info@projectr.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <FaMapMarkerAlt className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Our Location</h4>
                  <p className="text-gray-600">123 Health Street</p>
                  <p className="text-gray-600">Dhaka-1200, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;