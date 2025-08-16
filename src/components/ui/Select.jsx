import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Select = forwardRef(({ 
  className, 
  children,
  label,
  error,
  helperText,
  required,
  placeholder = "Select an option",
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
      <select
        className={cn(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm font-medium",
          "bg-white dark:bg-gray-900",
          "border-gray-300 dark:border-gray-600",
          "text-gray-900 dark:text-gray-100",
          "focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500",
          "focus:border-red-600 dark:focus:border-red-500",
          "hover:border-gray-400 dark:hover:border-gray-500",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800",
          "transition-all duration-200 ease-in-out",
          "[&>option]:bg-white [&>option]:dark:bg-gray-900 [&>option]:text-gray-900 [&>option]:dark:text-gray-100",
          error && "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400 bg-red-50 dark:bg-red-950/20",
          className
        )}
        ref={ref}
        required={required}
        {...props}
      >
        {placeholder && (
          <option value="" disabled className="text-gray-500 dark:text-gray-400">
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {error && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select; 