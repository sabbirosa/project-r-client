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
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden min-h-[80vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1615461066159-fea0960485d5?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Blood donation background"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent"></div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight"
              variants={fadeInUp}
            >
              Every Drop <span className="text-red-200">Counts</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-red-50 leading-relaxed font-medium"
              variants={fadeInUp}
            >
              Join our community of life-savers. Donate blood and help save lives in your community. Your single donation can save up to three lives.
            </motion.p>
            
            {/* Call to Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={fadeInUp}
            >
              {!isAuthenticated ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="xl"
                    variant="secondary"
                    className="bg-white text-red-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl border-2 border-white/20 backdrop-blur-sm"
                  >
                    <Link to="/register" className="flex items-center space-x-3 px-8 py-4">
                      <FaUserPlus className="h-6 w-6" />
                      <span className="text-lg font-bold">Join as a Donor</span>
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
                    size="xl"
                    variant="secondary"
                    className="bg-white text-red-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl border-2 border-white/20 backdrop-blur-sm"
                  >
                    <Link to="/dashboard/create-donation-request" className="flex items-center space-x-3 px-8 py-4">
                      <FaTint className="h-6 w-6" />
                      <span className="text-lg font-bold">Request Blood</span>
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
                  size="xl"
                  variant="outline"
                  className="bg-transparent border-3 border-white text-white hover:bg-white hover:text-red-600 shadow-xl backdrop-blur-sm"
                >
                  <Link to="/search" className="flex items-center space-x-3 px-8 py-4">
                    <FaSearch className="h-6 w-6" />
                    <span className="text-lg font-bold">Search Donors</span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Statistics */}
      <section className="py-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Lives Saved */}
            <motion.div variants={scaleIn}>
              <Card className="text-center p-10 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 hover:shadow-2xl transition-all duration-300 border-2 border-red-100 dark:border-red-900/30 hover:border-red-200 dark:hover:border-red-800/50 transform hover:-translate-y-2">
                <CardContent className="pt-8">
                  <motion.div 
                    className="bg-gradient-to-br from-red-600 to-red-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaHandHoldingHeart className="h-10 w-10 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    10,000+
                  </motion.h3>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Lives Saved</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Donors */}
            <motion.div variants={scaleIn}>
              <Card className="text-center p-10 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 hover:shadow-2xl transition-all duration-300 border-2 border-red-100 dark:border-red-900/30 hover:border-red-200 dark:hover:border-red-800/50 transform hover:-translate-y-2">
                <CardContent className="pt-8">
                  <motion.div 
                    className="bg-gradient-to-br from-red-600 to-red-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaUsers className="h-10 w-10 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    5,000+
                  </motion.h3>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Active Donors</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Blood Units */}
            <motion.div variants={scaleIn}>
              <Card className="text-center p-10 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 hover:shadow-2xl transition-all duration-300 border-2 border-red-100 dark:border-red-900/30 hover:border-red-200 dark:hover:border-red-800/50 transform hover:-translate-y-2">
                <CardContent className="pt-8">
                  <motion.div 
                    className="bg-gradient-to-br from-red-600 to-red-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaTint className="h-10 w-10 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    25,000+
                  </motion.h3>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Blood Units Donated</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Donate Blood */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Donate Blood?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
                    className="bg-red-100 dark:bg-red-950/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaHandHoldingHeart className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Save Lives</h3>
                  <p className="text-gray-600 dark:text-gray-400">
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
                    className="bg-red-100 dark:bg-red-950/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaPhone className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Emergency Ready</h3>
                  <p className="text-gray-600 dark:text-gray-400">
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
                    className="bg-red-100 dark:bg-red-950/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaUsers className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Health Benefits</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Regular blood donation can improve your health by reducing iron levels and providing free health checkups.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
                className="bg-red-600 dark:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-md"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                1
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Register</h3>
              <p className="text-gray-600 dark:text-gray-400">Create your account and provide basic information</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div className="text-center" variants={fadeInUp}>
              <motion.div 
                className="bg-red-600 dark:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-md"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                2
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Get Matched</h3>
              <p className="text-gray-600 dark:text-gray-400">We'll connect you with nearby donation requests</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div className="text-center" variants={fadeInUp}>
              <motion.div 
                className="bg-red-600 dark:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-md"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                3
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Donate</h3>
              <p className="text-gray-600 dark:text-gray-400">Visit the location and donate blood safely</p>
            </motion.div>

            {/* Step 4 */}
            <motion.div className="text-center" variants={fadeInUp}>
              <motion.div 
                className="bg-red-600 dark:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-md"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                4
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Save Lives</h3>
              <p className="text-gray-600 dark:text-gray-400">Your donation helps save lives in your community</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Real stories from people whose lives were saved through blood donation.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Story 1 */}
            <motion.div variants={scaleIn}>
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
                      alt="Patient"
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Ahmed Rahman</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Accident Victim</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <FaQuoteLeft className="text-red-200 dark:text-red-300 text-2xl mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 italic">
                      "Thanks to the quick response of blood donors, I'm alive today. The blood donation community saved my life after a severe accident."
                    </p>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Story 2 */}
            <motion.div variants={scaleIn}>
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
                      alt="Patient"
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Sarah Khan</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Surgery Patient</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <FaQuoteLeft className="text-red-200 dark:text-red-300 text-2xl mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 italic">
                      "During my emergency surgery, blood donors became my heroes. Their generosity gave me a second chance at life."
                    </p>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Story 3 */}
            <motion.div variants={scaleIn}>
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
                      alt="Patient"
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Dr. Karim</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Medical Professional</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <FaQuoteLeft className="text-red-200 dark:text-red-300 text-2xl mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 italic">
                      "As a doctor, I've seen countless lives saved by blood donors. This platform makes connecting donors with patients seamless."
                    </p>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Blood Types Information Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Blood Types & Compatibility
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Understanding blood types helps us connect the right donors with recipients.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bloodType, index) => (
              <motion.div key={bloodType} variants={scaleIn}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      className="bg-red-100 dark:bg-red-950/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaTint className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{bloodType}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {bloodType === 'O-' ? 'Universal Donor' : 
                       bloodType === 'AB+' ? 'Universal Recipient' : 
                       'Compatible Types'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recognition & Awards Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Recognition & Awards
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our commitment to excellence in blood donation services has been recognized nationally.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Award 1 */}
            <motion.div variants={scaleIn}>
              <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="pt-6 h-full flex flex-col">
                  <motion.div 
                    className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaAward className="h-8 w-8 text-yellow-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Best Healthcare Initiative</h3>
                  <p className="text-gray-600 dark:text-gray-400 flex-grow">Ministry of Health Bangladesh - 2023</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Award 2 */}
            <motion.div variants={scaleIn}>
              <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="pt-6 h-full flex flex-col">
                  <motion.div 
                    className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaCertificate className="h-8 w-8 text-blue-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Digital Innovation Award</h3>
                  <p className="text-gray-600 dark:text-gray-400 flex-grow">Bangladesh Tech Awards - 2023</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Award 3 */}
            <motion.div variants={scaleIn}>
              <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="pt-6 h-full flex flex-col">
                  <motion.div 
                    className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaMedal className="h-8 w-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Community Service Excellence</h3>
                  <p className="text-gray-600 dark:text-gray-400 flex-grow">Red Crescent Society - 2022</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Safety & Trust
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your safety and privacy are our top priorities in every blood donation process.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Safety Feature 1 */}
            <motion.div variants={fadeInUp}>
              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="pt-6 h-full flex flex-col">
                  <motion.div 
                    className="bg-red-100 dark:bg-red-950/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaShieldAlt className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Verified Donors</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">All donors are verified and undergo health screening</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Safety Feature 2 */}
            <motion.div variants={fadeInUp}>
              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="pt-6 h-full flex flex-col">
                  <motion.div 
                    className="bg-red-100 dark:bg-red-950/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaHeart className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Health Monitoring</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">Regular health checkups and monitoring for all participants</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Safety Feature 3 */}
            <motion.div variants={fadeInUp}>
              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="pt-6 h-full flex flex-col">
                  <motion.div 
                    className="bg-red-100 dark:bg-red-950/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaCertificate className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Certified Process</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">WHO certified blood collection and testing procedures</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Safety Feature 4 */}
            <motion.div variants={fadeInUp}>
              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="pt-6 h-full flex flex-col">
                  <motion.div 
                    className="bg-red-100 dark:bg-red-950/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaUsers className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Community Trust</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">Trusted by thousands of donors and recipients nationwide</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Ready to Save Lives?
            </h2>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-red-50 leading-relaxed">
              Join thousands of heroes who are making a difference in their communities every day. Your donation can be the gift of life.
            </p>
            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="xl"
                className="bg-white text-red-600 hover:bg-gray-50 shadow-2xl hover:shadow-3xl border-2 border-white/20 backdrop-blur-sm"
              >
                <Link to={isAuthenticated ? "/dashboard" : "/register"} className="flex items-center space-x-3 px-10 py-5">
                  <FaUserPlus className="h-6 w-6" />
                  <span className="text-xl font-bold">{isAuthenticated ? "Go to Dashboard" : "Start Your Journey"}</span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Send us a message</h3>
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
                <div className="bg-red-100 dark:bg-red-950/30 p-3 rounded-lg">
                  <FaPhone className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Emergency Hotline</h4>
                  <p className="text-gray-600 dark:text-gray-400">+880-123-456-789</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Available 24/7 for emergency blood requests</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                variants={fadeInRight}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-red-100 dark:bg-red-950/30 p-3 rounded-lg">
                  <FaEnvelope className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Email Support</h4>
                  <p className="text-gray-600 dark:text-gray-400">info@projectr.com</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">We'll respond within 24 hours</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                variants={fadeInRight}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-red-100 dark:bg-red-950/30 p-3 rounded-lg">
                  <FaMapMarkerAlt className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Our Location</h4>
                  <p className="text-gray-600 dark:text-gray-400">123 Health Street</p>
                  <p className="text-gray-600 dark:text-gray-400">Dhaka-1200, Bangladesh</p>
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