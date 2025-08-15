import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Badge = forwardRef(({ 
  className, 
  variant = 'default',
  size = 'md',
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center rounded-full font-medium";
  
  const variants = {
    default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    primary: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    secondary: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    success: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    danger: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    info: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    // Status specific variants for blood donation app
    pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    inprogress: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    done: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    canceled: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    active: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    blocked: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    draft: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    published: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge; 