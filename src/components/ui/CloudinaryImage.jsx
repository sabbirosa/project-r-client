import { AdvancedImage } from '@cloudinary/react';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { cld } from '../../utils/cloudinary';

const CloudinaryImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  crop = 'auto',
  gravity = 'auto',
  fallbackSrc = null,
  ...props 
}) => {
  // If Cloudinary is not configured or src is not a Cloudinary URL, use regular img
  if (!cld || !src || !src.includes('cloudinary.com')) {
    return (
      <img 
        src={fallbackSrc || src} 
        alt={alt} 
        className={className}
        {...props} 
      />
    );
  }

  try {
    // Extract public ID from Cloudinary URL
    const getPublicIdFromUrl = (url) => {
      if (!url) return null;
      
      // Handle different Cloudinary URL formats
      const matches = url.match(/\/v\d+\/(.+?)(?:\.[^.]+)?$/);
      if (matches) {
        return matches[1];
      }
      
      // Fallback for other formats
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      return lastPart.split('.')[0];
    };

    const publicId = getPublicIdFromUrl(src);
    
    if (!publicId) {
      return (
        <img 
          src={fallbackSrc || src} 
          alt={alt} 
          className={className}
          {...props} 
        />
      );
    }

    // Create optimized image with transformations
    let img = cld.image(publicId)
      .delivery(format('auto'))  // Auto format (WebP, AVIF when supported)
      .delivery(quality('auto')); // Auto quality optimization

    // Apply resizing if width/height specified
    if (width || height) {
      let resizeAction;
      
      if (crop === 'fill') {
        resizeAction = auto().gravity(autoGravity());
      } else {
        resizeAction = auto();
        if (gravity === 'auto') {
          resizeAction = resizeAction.gravity(autoGravity());
        }
      }
      
      if (width) resizeAction = resizeAction.width(width);
      if (height) resizeAction = resizeAction.height(height);
      
      img = img.resize(resizeAction);
    }

    return (
      <AdvancedImage 
        cldImg={img} 
        className={className}
        alt={alt}
        {...props}
      />
    );
  } catch (error) {
    console.warn('CloudinaryImage error:', error);
    // Fallback to regular img tag if there's an error
    return (
      <img 
        src={fallbackSrc || src} 
        alt={alt} 
        className={className}
        {...props} 
      />
    );
  }
};

export default CloudinaryImage; 