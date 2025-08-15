import { motion } from "framer-motion";
import { useState } from "react";
import { FaAward, FaCertificate, FaEnvelope, FaHandHoldingHeart, FaHeart, FaMapMarkerAlt, FaMedal, FaPhone, FaQuoteLeft, FaSearch, FaShieldAlt, FaStar, FaTint, FaUserPlus, FaUsers } from "react-icons/fa";
import { Link } from "react-router";
import usePublicAPI from "../api/usePublicAPI";
import { Button, Card, CardContent, Input, Textarea } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

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

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
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

function Home() {
  const { isAuthenticated } = useAuth();
  const { submitContactForm } = usePublicAPI();
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Handle contact form input changes
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");

    try {
      const result = await submitContactForm(contactForm);
      setSubmitMessage(result.message);
      setContactForm({ name: "", email: "", message: "" }); // Reset form
    } catch (error) {
      setSubmitError(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1615461066159-fea0960485d5?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Blood donation background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              variants={fadeInUp}
            >
              Every Drop Counts
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-red-100"
              variants={fadeInUp}
            >
              Join our community of life-savers. Donate blood and help save lives in your community.
            </motion.p>
            
            {/* Call to Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              {!isAuthenticated ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
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
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
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
                </motion.div>
              )}
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Lives Saved */}
            <motion.div variants={scaleIn}>
              <Card className="text-center p-8 bg-red-50 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <motion.div 
                    className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaHandHoldingHeart className="h-8 w-8 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-3xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    10,000+
                  </motion.h3>
                  <p className="text-gray-600">Lives Saved</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Donors */}
            <motion.div variants={scaleIn}>
              <Card className="text-center p-8 bg-red-50 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <motion.div 
                    className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaUsers className="h-8 w-8 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-3xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    5,000+
                  </motion.h3>
                  <p className="text-gray-600">Active Donors</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Blood Units */}
            <motion.div variants={scaleIn}>
              <Card className="text-center p-8 bg-red-50 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <motion.div 
                    className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaTint className="h-8 w-8 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-3xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    25,000+
                  </motion.h3>
                  <p className="text-gray-600">Blood Units Donated</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Donate Blood */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Donate Blood?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Blood donation is a simple act that can save multiple lives. Here's why your donation matters.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Save Lives */}
            <motion.div variants={fadeInLeft}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <motion.div 
                    className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaHandHoldingHeart className="h-6 w-6 text-red-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Lives</h3>
                  <p className="text-gray-600">
                    One blood donation can save up to three lives. Your single act of kindness can make a huge difference.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emergency Ready */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <motion.div 
                    className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaPhone className="h-6 w-6 text-red-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Emergency Ready</h3>
                  <p className="text-gray-600">
                    Blood is needed every 2 seconds. Help us maintain emergency blood supplies for critical situations.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Health Benefits */}
            <motion.div variants={fadeInRight}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <motion.div 
                    className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaUsers className="h-6 w-6 text-red-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Health Benefits</h3>
                  <p className="text-gray-600">
                    Regular blood donation can improve your health by reducing iron levels and providing free health checkups.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these easy steps to become a blood donor.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Step 1 */}
            <motion.div className="text-center" variants={fadeInUp}>
              <motion.div 
                className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                1
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Register</h3>
              <p className="text-gray-600">Create your account and provide basic information</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div className="text-center" variants={fadeInUp}>
              <motion.div 
                className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                2
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Matched</h3>
              <p className="text-gray-600">We'll connect you with nearby donation requests</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div className="text-center" variants={fadeInUp}>
              <motion.div 
                className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                3
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Donate</h3>
              <p className="text-gray-600">Visit the location and donate blood safely</p>
            </motion.div>

            {/* Step 4 */}
            <motion.div className="text-center" variants={fadeInUp}>
              <motion.div 
                className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                4
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Lives</h3>
              <p className="text-gray-600">Your donation helps save lives in your community</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? Need help? We're here for you 24/7.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInLeft}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Send us a message</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <Input
                        label="Your Name"
                        placeholder="Enter your name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        required
                      />
                    </motion.div>
                    
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        required
                      />
                    </motion.div>
                    
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <Textarea
                        label="Message"
                        rows={4}
                        placeholder="Enter your message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        required
                      />
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </motion.div>
                    
                    {submitMessage && (
                      <motion.p 
                        className="text-center text-green-600"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {submitMessage}
                      </motion.p>
                    )}
                    {submitError && (
                      <motion.p 
                        className="text-center text-red-600"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {submitError}
                      </motion.p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              className="space-y-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div 
                className="flex items-start space-x-4"
                variants={fadeInRight}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-red-100 p-3 rounded-lg">
                  <FaPhone className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Emergency Hotline</h4>
                  <p className="text-gray-600">+880-123-456-789</p>
                  <p className="text-sm text-gray-500">Available 24/7 for emergency blood requests</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                variants={fadeInRight}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-red-100 p-3 rounded-lg">
                  <FaEnvelope className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Email Support</h4>
                  <p className="text-gray-600">info@projectr.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                variants={fadeInRight}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-red-100 p-3 rounded-lg">
                  <FaMapMarkerAlt className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Our Location</h4>
                  <p className="text-gray-600">123 Health Street</p>
                  <p className="text-gray-600">Dhaka-1200, Bangladesh</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;