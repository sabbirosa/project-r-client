import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Alert = forwardRef(({ 
  className, 
  variant = 'default',
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600",
    destructive: "bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100 border-red-300 dark:border-red-700",
    success: "bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700",
    warning: "bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 border-amber-300 dark:border-amber-700",
    info: "bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-700",
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 font-medium transition-all duration-200 ease-in-out",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const AlertTitle = forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-2 font-semibold leading-none tracking-tight text-current", className)}
    {...props}
  />
));

const AlertDescription = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-normal opacity-90 [&_p]:leading-relaxed", className)}
    {...props}
  />
));

Alert.displayName = "Alert";
AlertTitle.displayName = "AlertTitle";
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
