import { useState } from "react";
import { FaEdit, FaEye, FaFilter, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router";
import { toast } from "react-toastify";
import useAdminAPI from "../api/useAdminAPI";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, LoadingSpinner, Modal, Pagination, Select } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

function ContentManagement() {
  const { user } = useAuth();
  const adminAPI = useAdminAPI();
  
  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  
  const itemsPerPage = 10;

  // Fetch blogs with pagination and filtering
  const { useGetAllBlogs } = useAdminAPI();
  const {
    data: blogsData,
    isLoading,
    error,
    refetch
  } = useGetAllBlogs({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter || undefined
  });

  // Handle blog status update (publish/unpublish)
  const { useUpdateBlogStatus } = useAdminAPI();
  const { mutate: updateBlogStatusMutation } = useUpdateBlogStatus();

  const handleStatusUpdate = (blogId, newStatus) => {
    updateBlogStatusMutation({ blogId, status: newStatus }, {
      onSuccess: () => {
        toast.success(`Blog ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`);
        refetch();
      },
      onError: (error) => {
        console.error('Error updating blog status:', error);
        toast.error('Failed to update blog status');
      }
    });
  };

  // Handle delete blog
  const { useDeleteBlog } = useAdminAPI();
  const { mutate: deleteBlogMutation, isPending: isDeleting } = useDeleteBlog();

  const handleDelete = () => {
    if (!selectedBlogId) return;
    
    deleteBlogMutation(selectedBlogId, {
      onSuccess: () => {
        toast.success('Blog deleted successfully!');
        setShowDeleteModal(false);
        setSelectedBlogId(null);
        refetch();
      },
      onError: (error) => {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog');
      }
    });
  };

  const confirmDelete = (blogId) => {
    setSelectedBlogId(blogId);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading blogs..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>Error loading blogs: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const blogs = blogsData?.blogs || [];
  const totalPages = blogsData?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Content Management
            </CardTitle>
            <Button asChild>
              <Link to="/dashboard/content-management/add-blog" className="flex items-center space-x-2">
                <FaPlus className="h-4 w-4" />
                <span>Add Blog</span>
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No blogs found.</p>
            <Button asChild className="mt-4">
              <Link to="/dashboard/content-management/add-blog">
                Create Your First Blog
              </Link>
            </Button>
          </div>
        ) : (
          blogs.map((blog) => (
            <Card key={blog._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Blog Thumbnail */}
                {blog.thumbnail && (
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Blog Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {blog.title}
                    </h3>
                    <Badge 
                      variant={blog.status === 'published' ? 'success' : 'warning'}
                      className="ml-2"
                    >
                      {blog.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>By: {blog.authorName}</p>
                    <p>Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  {/* Blog Content Preview */}
                  <div className="text-sm text-gray-600 line-clamp-3">
                    {blog.content.replace(/<[^>]+>/g, '').substring(0, 150)}...
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      asChild
                    >
                      <Link to={`/dashboard/content-management/edit-blog/${blog._id}`}>
                        <FaEdit className="h-3 w-3 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    
                    {blog.status === 'draft' ? (
                      user?.role === 'admin' && (
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleStatusUpdate(blog._id, 'published')}
                        >
                          Publish
                        </Button>
                      )
                    ) : (
                      user?.role === 'admin' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(blog._id, 'draft')}
                        >
                          Unpublish
                        </Button>
                      )
                    )}
                    
                    {user?.role === 'admin' && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => confirmDelete(blog._id)}
                      >
                        <FaTrash className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      asChild
                    >
                      <Link to={`/blog/${blog._id}`}>
                        <FaEye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this blog? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ContentManagement; 