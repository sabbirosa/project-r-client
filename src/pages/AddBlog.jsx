import JoditEditor from "jodit-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaImage, FaUpload } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAdminAPI from "../api/useAdminAPI";
import usePublicAPI from "../api/usePublicAPI";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, LoadingSpinner } from "../components/ui";

function AddBlog() {
  const navigate = useNavigate();
  const { useCreateBlog } = useAdminAPI();
  const { mutate: createBlogMutation, isPending: isSubmitting } = useCreateBlog();
  const { useUploadImage } = usePublicAPI();
  const { mutateAsync: uploadImageMutation } = useUploadImage();
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [content, setContent] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const thumbnailUrl = watch("thumbnail");

  // Jodit editor configuration
  const editorConfig = {
    readonly: false,
    height: 400,
    placeholder: "Write your blog content here...",
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    defaultActionOnPaste: "insert_as_html",
    buttons: [
      "undo", "redo", "|",
      "bold", "strikethrough", "underline", "italic", "|",
      "superscript", "subscript", "|",
      "align", "|",
      "ul", "ol", "|",
      "outdent", "indent", "|",
      "font", "fontsize", "brush", "paragraph", "|",
      "image", "link", "table", "|",
      "hr", "eraser", "copyformat", "|",
      "fullsize", "selectall", "print", "|",
      "source", "|",
    ],
    uploader: {
      insertImageAsBase64URI: true
    },
    removeButtons: ["brush", "file"],
    showPlaceholder: true,
    hidePoweredByJodit: true
  };

  // Handle image upload

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const response = await uploadImageMutation(file);
      
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

  const onSubmit = (data) => {
    // Validate content
    if (!content || content.trim().length < 50) {
      toast.error('Blog content must be at least 50 characters long');
      return;
    }

    createBlogMutation({
      title: data.title,
      thumbnail: data.thumbnail || "",
      content: content
    }, {
      onSuccess: () => {
        toast.success('Blog created successfully!');
        navigate('/dashboard/content-management');
      },
      onError: (error) => {
        console.error('Error creating blog:', error);
        toast.error(error.response?.data?.message || 'Failed to create blog');
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/dashboard/content-management">
                <FaArrowLeft className="h-4 w-4 mr-2" />
                Back to Content Management
              </Link>
            </Button>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Add New Blog
            </CardTitle>
          </div>
        </CardHeader>
      </Card>

      {/* Blog Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Blog Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title *
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Enter blog title"
                {...register("title", {
                  required: "Blog title is required",
                  minLength: {
                    value: 5,
                    message: "Title must be at least 5 characters long"
                  }
                })}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Thumbnail Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image
              </label>
              
              {/* Image Upload */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                    <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      {isUploadingImage ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <FaUpload className="h-4 w-4" />
                      )}
                      <span className="text-sm">
                        {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                      </span>
                    </div>
                  </label>
                  
                  <span className="text-sm text-gray-500">
                    or enter URL manually
                  </span>
                </div>

                {/* URL Input */}
                <Input
                  type="url"
                  placeholder="Enter image URL"
                  {...register("thumbnail")}
                  onChange={(e) => {
                    setValue("thumbnail", e.target.value);
                    setThumbnailPreview(e.target.value);
                  }}
                />

                {/* Image Preview */}
                {(thumbnailPreview || thumbnailUrl) && (
                  <div className="relative">
                    <img
                      src={thumbnailPreview || thumbnailUrl}
                      alt="Thumbnail preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                      onError={() => {
                        setThumbnailPreview("");
                        setValue("thumbnail", "");
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setValue("thumbnail", "");
                        setThumbnailPreview("");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Blog Content - Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Content *
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <JoditEditor
                  value={content}
                  config={editorConfig}
                  tabIndex={1}
                  onBlur={(newContent) => setContent(newContent)}
                  onChange={(newContent) => setContent(newContent)}
                />
              </div>
              {content.length > 0 && content.length < 50 && (
                <p className="text-red-500 text-sm mt-1">
                  Content must be at least 50 characters long ({content.length}/50)
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Use the rich text editor to format your content with headings, lists, links, images, and more.
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/content-management')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !content || content.trim().length < 50}
                className="flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FaImage className="h-4 w-4" />
                    <span>Create Blog</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Helper Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600 space-y-2">
            <h4 className="font-medium text-gray-900">Tips for creating a great blog:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Use a clear and compelling title that describes your content</li>
              <li>Add a thumbnail image to make your blog more engaging</li>
              <li>Use the rich text editor to format your content professionally</li>
              <li>Include headings, paragraphs, lists, and images for better readability</li>
              <li>Your blog will be saved as a draft and can be published later by an admin</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddBlog; 