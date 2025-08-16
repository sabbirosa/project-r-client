import { cloneElement, forwardRef, isValidElement } from 'react';
import { cn } from '../../utils/cn';

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  asChild = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-red-600 dark:bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700 active:bg-red-800 dark:active:bg-red-800 focus:ring-red-500 dark:focus:ring-red-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200",
    secondary: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 focus:ring-gray-500 dark:focus:ring-gray-400 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200",
    outline: "border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white active:bg-red-700 dark:active:bg-red-700 focus:ring-red-500 dark:focus:ring-red-400 bg-transparent shadow-sm hover:shadow-md transition-all duration-200",
    ghost: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 active:bg-red-100 dark:active:bg-red-950/50 focus:ring-red-500 dark:focus:ring-red-400 bg-transparent transition-all duration-200",
    danger: "bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 active:bg-red-700 dark:active:bg-red-800 focus:ring-red-500 dark:focus:ring-red-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200",
    success: "bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700 active:bg-green-800 dark:active:bg-green-800 focus:ring-green-500 dark:focus:ring-green-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  const combinedClassName = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    loading && "cursor-wait opacity-80",
    className
  );

  // If asChild is true, render the children directly with the combined className
  if (asChild) {
    // Clone the first child and apply the button styles to it
    if (isValidElement(children)) {
      return cloneElement(children, {
        className: cn(combinedClassName, children.props?.className),
        ref,
        ...props,
        ...children.props,
      });
    }
    // If no valid child element, render a span
    return (
      <span className={combinedClassName} ref={ref} {...props}>
        {children}
      </span>
    );
  }

  return (
    <button
      className={combinedClassName}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button; 