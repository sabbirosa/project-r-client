import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FaArrowLeft, FaCalendar, FaShare, FaUser } from "react-icons/fa";
import { Link, useParams } from "react-router";
import { toast } from "react-toastify";
import usePublicAPI from "../api/usePublicAPI";
import { Button, Card, CardContent, LoadingSpinner } from "../components/ui";

function BlogDetails() {
  const { id } = useParams();
  const publicAPI = usePublicAPI();

  // Fetch single blog
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => publicAPI.getBlogById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const blog = data?.blog;

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: `Check out this blog: ${blog.title}`,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <div className="text-red-500 mb-4">
                <FaUser className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Blog Not Found
              </h3>
              <p className="text-gray-600 mb-4">
                {error?.response?.status === 404 
                  ? "The blog post you're looking for doesn't exist or has been removed."
                  : error?.message || "Unable to load the blog post. Please try again."
                }
              </p>
              <div className="space-x-4">
                <Button asChild variant="outline">
                  <Link to="/blog">
                    <FaArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blogs
                  </Link>
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blog Content */}
        {!isLoading && !isError && blog && (
          <div className="space-y-8">
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="outline" asChild>
                <Link to="/blog">
                  <FaArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blogs
                </Link>
              </Button>
              
              <Button variant="outline" onClick={handleShare}>
                <FaShare className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Blog Header */}
            <Card>
              <CardContent className="pt-6">
                {/* Blog Meta */}
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-2">
                    <FaUser className="h-4 w-4" />
                    <span className="font-medium">{blog.authorName || "Admin"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCalendar className="h-4 w-4" />
                    <span>{format(new Date(blog.createdAt), "MMMM dd, yyyy 'at' h:mm a")}</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {blog.status}
                  </span>
                </div>

                {/* Blog Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {blog.title}
                </h1>

                {/* Blog Thumbnail */}
                {blog.thumbnail && (
                  <div className="mb-8 rounded-lg overflow-hidden">
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-64 md:h-96 object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Blog Content */}
            <Card>
              <CardContent className="pt-6">
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-blockquote:text-gray-700 prose-blockquote:border-red-200"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </CardContent>
            </Card>

            {/* Related Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Found this helpful?
                    </h3>
                    <p className="text-gray-600">
                      Share it with others or explore more blog posts.
                    </p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={handleShare}>
                      <FaShare className="h-4 w-4 mr-2" />
                      Share Blog
                    </Button>
                    <Button asChild>
                      <Link to="/blog">
                        More Blogs
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
              <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ready to Make a Difference?
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Join our community of blood donors and help save lives. Every donation counts and can make a real difference in someone's life.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button asChild size="lg">
                    <Link to="/register">
                      Become a Donor
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/donation-requests">
                      View Requests
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogDetails; 