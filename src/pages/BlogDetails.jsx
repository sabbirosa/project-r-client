import { format } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaArrowLeft, FaCalendar, FaCopy, FaShare, FaUser } from "react-icons/fa";
import { Link, useParams } from "react-router";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from "react-share";
import { toast } from "react-toastify";
import usePublicAPI from "../api/usePublicAPI";
import { Button, Card, CardContent, LoadingSpinner, Modal } from "../components/ui";

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

function BlogDetails() {
  const { id } = useParams();
  const { useGetBlogById } = usePublicAPI();
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch single blog
  const { data, isLoading, isError, error } = useGetBlogById(id);

  const blog = data?.blog;

  // Get share URL and content
  const shareUrl = window.location.href;
  const shareTitle = blog?.title || "Blood Donation Blog";
  const shareDescription = `Check out this blog: ${blog?.title} - Join our blood donation community and help save lives.`;

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          setShowShareModal(true);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied to clipboard!');
      setShowShareModal(false);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading State */}
        {isLoading && (
          <motion.div 
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <LoadingSpinner size="lg" />
          </motion.div>
        )}

        {/* Error State */}
        {isError && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <Card className="max-w-md mx-auto hover:shadow-xl transition-all duration-300 border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <motion.div 
                  className="text-red-500 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaUser className="h-12 w-12 mx-auto" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Blog Not Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {error?.response?.status === 404 
                    ? "The blog post you're looking for doesn't exist or has been removed."
                    : error?.message || "Unable to load the blog post. Please try again."
                  }
                </p>
                <div className="space-x-4">
                  <motion.div className="inline-block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="outline">
                      <Link to="/blog">
                        <FaArrowLeft className="h-4 w-4 mr-2" />
                        Back to Blogs
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div className="inline-block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white">
                      Try Again
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Blog Content */}
        {!isLoading && !isError && blog && (
          <motion.div 
            className="space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Navigation */}
            <motion.div 
              className="flex items-center justify-between"
              variants={fadeInUp}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" asChild>
                  <Link to="/blog">
                    <FaArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blogs
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={handleShare}>
                  <FaShare className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </motion.div>
            </motion.div>

            {/* Blog Header */}
            <motion.div variants={fadeInUp}>
              <Card className="hover:shadow-xl transition-all duration-300 border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardContent className="pt-6">
                  {/* Blog Meta */}
                  <motion.div 
                    className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6"
                    variants={fadeInLeft}
                  >
                    <div className="flex items-center space-x-2">
                      <FaUser className="h-4 w-4" />
                      <span className="font-medium">{blog.authorName || "Admin"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCalendar className="h-4 w-4" />
                      <span>{format(new Date(blog.createdAt), "MMMM dd, yyyy 'at' h:mm a")}</span>
                    </div>
                    <motion.span 
                      className="px-3 py-1 bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200 text-xs font-medium rounded-full"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {blog.status}
                    </motion.span>
                  </motion.div>

                  {/* Blog Title */}
                  <motion.h1 
                    className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight"
                    variants={fadeInUp}
                  >
                    {blog.title}
                  </motion.h1>

                  {/* Blog Thumbnail */}
                  {blog.thumbnail && (
                    <motion.div 
                      className="mb-8 rounded-lg overflow-hidden"
                      variants={scaleIn}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-full h-64 md:h-96 object-cover"
                      />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Blog Content */}
            <motion.div variants={fadeInUp}>
              <Card className="hover:shadow-xl transition-all duration-300 border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-red-600 dark:prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ol:text-gray-700 dark:prose-ol:text-gray-300 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:border-red-200 dark:prose-blockquote:border-red-800 prose-pre:bg-gray-800 dark:prose-pre:bg-gray-900 prose-code:text-gray-800 dark:prose-code:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Sharing Section */}
            <motion.div variants={fadeInUp}>
              <Card className="hover:shadow-xl transition-all duration-300 border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <motion.h3 
                      className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Share this blog post
                    </motion.h3>
                    <motion.div 
                      className="flex justify-center space-x-4 mb-4"
                      initial="initial"
                      animate="animate"
                      variants={staggerContainer}
                    >
                      <motion.div variants={scaleIn} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <FacebookShareButton
                          url={shareUrl}
                          quote={shareDescription}
                          hashtag="#BloodDonation"
                        >
                          <FacebookIcon size={40} round />
                        </FacebookShareButton>
                      </motion.div>

                      <motion.div variants={scaleIn} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <TwitterShareButton
                          url={shareUrl}
                          title={shareTitle}
                          hashtags={["BloodDonation", "SaveLives", "HealthCare"]}
                        >
                          <TwitterIcon size={40} round />
                        </TwitterShareButton>
                      </motion.div>

                      <motion.div variants={scaleIn} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <LinkedinShareButton
                          url={shareUrl}
                          title={shareTitle}
                          summary={shareDescription}
                          source="Project R - Blood Donation Platform"
                        >
                          <LinkedinIcon size={40} round />
                        </LinkedinShareButton>
                      </motion.div>

                      <motion.div variants={scaleIn} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <WhatsappShareButton
                          url={shareUrl}
                          title={shareDescription}
                          separator=" - "
                        >
                          <WhatsappIcon size={40} round />
                        </WhatsappShareButton>
                      </motion.div>
                    </motion.div>

                    <motion.div 
                      className="flex justify-center"
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        onClick={copyToClipboard}
                        className="flex items-center space-x-2"
                      >
                        <FaCopy className="h-4 w-4" />
                        <span>Copy Link</span>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Related Actions */}
            <motion.div variants={fadeInUp}>
              <Card className="hover:shadow-xl transition-all duration-300 border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        Found this helpful?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Share it with others or explore more blog posts.
                      </p>
                    </div>
                    
                    <div className="flex space-x-4">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" onClick={() => setShowShareModal(true)}>
                          <FaShare className="h-4 w-4 mr-2" />
                          Share Blog
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                          <Link to="/blog">
                            More Blogs
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Call to Action */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-red-200 dark:border-red-800 hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6 text-center">
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Ready to Make a Difference?
                  </motion.h3>
                  <motion.p 
                    className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Join our community of blood donors and help save lives. Every donation counts and can make a real difference in someone's life.
                  </motion.p>
                  <motion.div 
                    className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                        <Link to="/register">
                          Become a Donor
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="lg" asChild>
                        <Link to="/donation-requests">
                          View Requests
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Share Modal */}
        <Modal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title="Share this blog post"
        >
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-600 dark:text-gray-400">Choose how you'd like to share this blog post:</p>
            
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div variants={scaleIn}>
                <FacebookShareButton
                  url={shareUrl}
                  quote={shareDescription}
                  hashtag="#BloodDonation"
                  className="w-full"
                >
                  <div className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full">
                    <FacebookIcon size={24} round />
                    <span>Facebook</span>
                  </div>
                </FacebookShareButton>
              </motion.div>

              <motion.div variants={scaleIn}>
                <TwitterShareButton
                  url={shareUrl}
                  title={shareTitle}
                  hashtags={["BloodDonation", "SaveLives"]}
                  className="w-full"
                >
                  <div className="flex items-center justify-center space-x-2 p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors w-full">
                    <TwitterIcon size={24} round />
                    <span>Twitter</span>
                  </div>
                </TwitterShareButton>
              </motion.div>

              <motion.div variants={scaleIn}>
                <LinkedinShareButton
                  url={shareUrl}
                  title={shareTitle}
                  summary={shareDescription}
                  className="w-full"
                >
                  <div className="flex items-center justify-center space-x-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors w-full">
                    <LinkedinIcon size={24} round />
                    <span>LinkedIn</span>
                  </div>
                </LinkedinShareButton>
              </motion.div>

              <motion.div variants={scaleIn}>
                <WhatsappShareButton
                  url={shareUrl}
                  title={shareDescription}
                  className="w-full"
                >
                  <div className="flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full">
                    <WhatsappIcon size={24} round />
                    <span>WhatsApp</span>
                  </div>
                </WhatsappShareButton>
              </motion.div>
            </motion.div>

            <motion.div className="flex space-x-3" variants={fadeInUp}>
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <FaCopy className="h-4 w-4" />
                <span>Copy Link</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowShareModal(false)}
                className="px-6"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        </Modal>
      </div>
    </div>
  );
}

export default BlogDetails; 