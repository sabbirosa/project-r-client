import { format } from "date-fns";
import { useState } from "react";
import { FaCalendar, FaEye, FaSearch, FaUser } from "react-icons/fa";
import { Link } from "react-router";
import usePublicAPI from "../api/usePublicAPI";
import { Button, Card, CardContent, Input, LoadingSpinner, Pagination } from "../components/ui";

function Blog() {
  const { useGetPublishedBlogs } = usePublicAPI();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  // Fetch blogs with search and pagination
  const { data, isLoading, isError, error } = useGetPublishedBlogs({ 
    page, 
    limit, 
    search: searchQuery 
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setPage(1); // Reset page when clearing search
    }
  };

  const truncateContent = (content, maxLength = 150) => {
    // Remove HTML tags and truncate
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > maxLength 
      ? `${textContent.substring(0, maxLength)}...` 
      : textContent;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Blood Donation Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Stay informed with the latest news, stories, and insights about blood donation and its impact on saving lives.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search blogs by title or content..."
                    value={searchQuery}
                    onChange={handleSearchInput}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
                  {isLoading ? <LoadingSpinner size="sm" /> : "Search"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="max-w-md mx-auto border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-6 text-center">
              <div className="text-red-500 dark:text-red-400 mb-4">
                <FaSearch className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Failed to Load Blogs
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error?.message || "Unable to fetch blogs. Please try again."}
              </p>
              <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {!isLoading && !isError && data?.blogs?.length === 0 && (
          <Card className="max-w-md mx-auto border-red-100 dark:border-red-900/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-6 text-center">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <FaSearch className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Blogs Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery 
                  ? `No blogs match your search "${searchQuery}"`
                  : "No published blogs available at the moment"
                }
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setPage(1);
                  }}
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Blog Grid */}
        {!isLoading && !isError && data?.blogs?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {data.blogs.map((blog) => (
              <Card key={blog._id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-red-50 dark:border-red-900/20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <div className="relative overflow-hidden">
                  {blog.thumbnail && (
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {!blog.thumbnail && (
                    <div className="w-full h-48 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950/30 dark:to-red-900/20 flex items-center justify-center">
                      <FaUser className="h-16 w-16 text-red-300 dark:text-red-400" />
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <FaUser className="h-3 w-3" />
                      <span>{blog.authorName || "Admin"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaCalendar className="h-3 w-3" />
                      <span>{format(new Date(blog.createdAt), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-3">
                    {truncateContent(blog.content)}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Button asChild className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200" size="sm">
                      <Link to={`/blog/${blog._id}`}>
                        <FaEye className="h-3 w-3 mr-2" />
                        Read More
                      </Link>
                    </Button>
                    
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {blog.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && data?.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}

        {/* Results Info */}
        {!isLoading && !isError && data?.total > 0 && (
          <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
            <p>
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total} blogs
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog; 