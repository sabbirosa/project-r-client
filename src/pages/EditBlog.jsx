import { useQuery } from "@tanstack/react-query";
import JoditEditor from "jodit-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import useAdminAPI from "../api/useAdminAPI";
import usePublicAPI from "../api/usePublicAPI";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, LoadingSpinner } from "../components/ui";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const adminAPI = useAdminAPI();
  const publicAPI = usePublicAPI();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [content, setContent] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const thumbnailUrl = watch("thumbnail");

  // Fetch the existing blog data
  const { data: blogData, isLoading, isError, error } = useQuery({
    queryKey: ["admin-blog", id],
    queryFn: () => adminAPI.getBlogById(id),
    enabled: !!id,
  });

  // Pre-populate form when blog data is loaded
  useEffect(() => {
    if (blogData?.blog) {
      const blog = blogData.blog;
      reset({
        title: blog.title,
        thumbnail: blog.thumbnail || "",
      });
      setContent(blog.content || "");
      setThumbnailPreview(blog.thumbnail || "");
    }
  }, [blogData, reset]);

  // Jodit editor configuration
  const editorConfig = {
    readonly: false,
    height: 400,
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",
    buttons: [
      "bold", "italic", "underline", "|",
      "ul", "ol", "|",
      "font", "fontsize", "brush", "|",
      "align", "|",
      "undo", "redo", "|",
      "hr", "link", "image"
    ],
    removeButtons: ["source", "fullsize", "about", "outdent", "indent", "video"],
    disablePlugins: ["paste", "stat"],
    events: {
      beforeEnter: function (event) {
        const editor = this;
        editor.selection.insertHTML('<br>');
        return false;
      }
    }
  };

  // Handle thumbnail preview from URL
  useEffect(() => {
    if (thumbnailUrl && thumbnailUrl !== thumbnailPreview) {
      setThumbnailPreview(thumbnailUrl);
    }
  }, [thumbnailUrl, thumbnailPreview]);

  // Handle image upload to ImageBB
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const response = await publicAPI.uploadImage(file);
      
      if (response.success && response.data.url) {
        const imageUrl = response.data.url;
        setValue("thumbnail", imageUrl);
        setThumbnailPreview(imageUrl);
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Handle specific error messages
      if (error.message.includes('API key not configured')) {
        toast.error('Please configure ImageBB API key in your .env file');
      } else if (error.message.includes('file type')) {
        toast.error('Please select a valid image file (PNG, JPG, JPEG, GIF, etc.)');
      } else if (error.message.includes('size')) {
        toast.error('Image size is too large. Please select an image under 10MB');
      } else {
        toast.error(error.message || 'Failed to upload image. Please try again.');
      }
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    // Validate content
    if (!content || content.trim().length < 50) {
      toast.error('Blog content must be at least 50 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminAPI.updateBlog(id, {
        title: data.title,
        thumbnail: data.thumbnail || "",
        content: content
      });

      toast.success('Blog updated successfully!');
      navigate('/dashboard/content-management');
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error(error.response?.data?.message || 'Failed to update blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading blog..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>Error loading blog: {error?.message || 'Blog not found'}</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard/content-management">
            Back to Content Management
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/content-management">
                  <FaArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Edit Blog
              </CardTitle>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Blog Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title *
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Enter your blog title..."
                {...register("title", {
                  required: "Blog title is required",
                  minLength: {
                    value: 10,
                    message: "Title must be at least 10 characters long"
                  },
                  maxLength: {
                    value: 100,
                    message: "Title must not exceed 100 characters"
                  }
                })}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image
              </label>
              
              <div className="space-y-4">
                {/* Image URL Input */}
                <div>
                  <Input
                    type="url"
                    placeholder="Enter image URL or upload below..."
                    {...register("thumbnail", {
                      pattern: {
                        value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                        message: "Please enter a valid URL"
                      }
                    })}
                    className={errors.thumbnail ? "border-red-500" : ""}
                  />
                  {errors.thumbnail && (
                    <p className="text-red-500 text-sm mt-1">{errors.thumbnail.message}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="imageUpload"
                      className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
                    >
                      {isUploadingImage ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <FaUpload className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">Upload Image</span>
                        </>
                      )}
                    </label>
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {thumbnailPreview && (
                  <div className="relative inline-block">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <div className="absolute -top-2 -right-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setValue("thumbnail", "");
                          setThumbnailPreview("");
                        }}
                        className="h-6 w-6 rounded-full p-0"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Content *
              </label>
              <div className="border rounded-lg overflow-hidden">
                <JoditEditor
                  value={content}
                  config={editorConfig}
                  onChange={(newContent) => setContent(newContent)}
                  onBlur={() => {}} // Do nothing on blur
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Minimum 50 characters required. Current: {content.replace(/<[^>]*>/g, '').length}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                asChild
                disabled={isSubmitting}
              >
                <Link to="/dashboard/content-management">
                  Cancel
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Updating...</span>
                  </>
                ) : (
                  "Update Blog"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default EditBlog; 