/**
 * Utility functions for consistent error handling across the application
 */

/**
 * Default retry configuration for React Query that handles authentication errors properly
 * @param {number} maxRetries - Maximum number of retries (default: 2)
 * @returns {Object} React Query retry configuration
 */
export const getAuthRetryConfig = (maxRetries = 2) => ({
  retry: (failureCount, error) => {
    // Don't retry on authentication/authorization errors
    if (error?.response?.status === 403 || error?.response?.status === 401) {
      return false;
    }
    
    // Don't retry on client errors (4xx except 401/403)
    if (error?.response?.status >= 400 && error?.response?.status < 500) {
      return false;
    }
    
    return failureCount < maxRetries;
  }
});

/**
 * Check if an error is a permission/authentication related error
 * @param {Error} error - The error object to check
 * @returns {boolean} True if it's a permission error
 */
export const isAuthError = (error) => {
  return error?.response?.status === 403 || error?.response?.status === 401;
};

/**
 * Check if an error is a server error (5xx)
 * @param {Error} error - The error object to check
 * @returns {boolean} True if it's a server error
 */
export const isServerError = (error) => {
  return error?.response?.status >= 500;
};

/**
 * Get a user-friendly error message from an error object
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default message to show if no specific message found
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error, defaultMessage = 'Something went wrong') => {
  if (isAuthError(error)) {
    return 'You do not have permission to access this resource';
  }
  
  if (isServerError(error)) {
    return 'Server error. Please try again later';
  }
  
  return error?.response?.data?.message || error?.message || defaultMessage;
};

/**
 * React Query configuration for API calls that require authentication
 * @param {Object} options - Additional query options
 * @returns {Object} Complete query configuration
 */
export const createAuthQueryConfig = (options = {}) => ({
  ...getAuthRetryConfig(),
  ...options,
  // Combine enabled conditions if both are provided
  enabled: options.enabled !== undefined ? options.enabled : true,
});