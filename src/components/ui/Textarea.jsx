import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Textarea = forwardRef(({ 
  className, 
  error,
  label,
  helperText,
  required,
  rows = 3,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
          {required && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm font-medium",
          "bg-white dark:bg-gray-900",
          "border-gray-300 dark:border-gray-600",
          "text-gray-900 dark:text-gray-100",
          "placeholder:text-gray-500 dark:placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500",
          "focus:border-red-600 dark:focus:border-red-500",
          "hover:border-gray-400 dark:hover:border-gray-500",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800",
          "transition-all duration-200 ease-in-out resize-vertical",
          error && "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400 bg-red-50 dark:bg-red-950/20",
          className
        )}
        ref={ref}
        required={required}
        {...props}
      />
      {error && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{helperText}</p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea; 