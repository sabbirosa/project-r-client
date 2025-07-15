import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary instance
export const createCloudinaryInstance = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName || cloudName === 'your_cloud_name_here') {
    console.warn('Cloudinary cloud name not configured');
    return null;
  }

  return new Cloudinary({
    cloud: {
      cloudName: cloudName
    }
  });
};

// Get the default Cloudinary instance
export const cld = createCloudinaryInstance();

// Upload image to Cloudinary (keeping the existing upload logic)
export const uploadToCloudinary = async (imageFile) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
  console.log('🔧 Cloudinary Debug Info:', {
    cloudName: cloudName ? cloudName.substring(0, 8) + '...' : 'NOT_SET',
    uploadPreset: uploadPreset ? uploadPreset.substring(0, 8) + '...' : 'NOT_SET',
    fileName: imageFile?.name,
    fileSize: imageFile?.size,
    fileType: imageFile?.type
  });
  
  if (!cloudName || cloudName === 'your_cloud_name_here') {
    throw new Error('Cloudinary cloud name not configured. Please set VITE_CLOUDINARY_CLOUD_NAME in your .env file.');
  }
  
  if (!uploadPreset || uploadPreset === 'your_upload_preset_here') {
    throw new Error('Cloudinary upload preset not configured. Please set VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.');
  }

  // Validate file
  if (!imageFile) {
    throw new Error('No image file provided');
  }

  // Validate file type
  if (!imageFile.type.startsWith('image/')) {
    throw new Error('Please select a valid image file');
  }

  // Validate file size (max 10MB for Cloudinary free tier)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (imageFile.size > maxSize) {
    throw new Error('Image size must be less than 10MB');
  }

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", uploadPreset);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  console.log('📤 Uploading to:', uploadUrl);

  try {
    // Check if user session is still valid before upload
    const userSession = localStorage.getItem("bloodDonation_user");
    const tokenSession = localStorage.getItem("bloodDonation_token");
    console.log('🔐 Session check before upload:', {
      hasUser: !!userSession,
      hasToken: !!tokenSession,
      timestamp: new Date().toISOString()
    });

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    console.log('📥 Response status:', response.status);
    
    const data = await response.json();
    console.log('📥 Response data:', data);

    if (!response.ok) {
      // Provide more detailed error information
      const errorMessage = data.error?.message || `Upload failed with status: ${response.status}`;
      const errorDetails = data.error ? ` - ${JSON.stringify(data.error)}` : '';
      throw new Error(`${errorMessage}${errorDetails}`);
    }
    
    if (data.error) {
      throw new Error(data.error.message || 'Upload failed');
    }

    // Check if user session is still valid after upload
    const userSessionAfter = localStorage.getItem("bloodDonation_user");
    const tokenSessionAfter = localStorage.getItem("bloodDonation_token");
    console.log('🔐 Session check after upload:', {
      hasUser: !!userSessionAfter,
      hasToken: !!tokenSessionAfter,
      changed: userSession !== userSessionAfter || tokenSession !== tokenSessionAfter,
      timestamp: new Date().toISOString()
    });

    console.log('✅ Upload successful:', data.secure_url);

    return {
      success: true,
      data: {
        url: data.secure_url,
        publicId: data.public_id,
        size: data.bytes,
        format: data.format,
        width: data.width,
        height: data.height,
      }
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    
    // Check session after error
    const userSessionAfterError = localStorage.getItem("bloodDonation_user");
    const tokenSessionAfterError = localStorage.getItem("bloodDonation_token");
    console.log('🔐 Session check after error:', {
      hasUser: !!userSessionAfterError,
      hasToken: !!tokenSessionAfterError,
      timestamp: new Date().toISOString()
    });
    
    throw error;
  }
}; 