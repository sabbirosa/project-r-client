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
    default: "bg-gray-100 text-gray-800",
    primary: "bg-red-100 text-red-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    // Status specific variants for blood donation app
    pending: "bg-yellow-100 text-yellow-800",
    inprogress: "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
    canceled: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    blocked: "bg-red-100 text-red-800",
    draft: "bg-gray-100 text-gray-800",
    published: "bg-green-100 text-green-800",
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