import { cn } from '../../utils/cn';

const LoadingSpinner = ({ 
  size = 'md', 
  className, 
  text,
  centered = false 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const spinner = (
    <div className={cn("flex items-center", centered && "justify-center")}>
      <svg
        className={cn(
          "animate-spin text-red-600 dark:text-red-500",
          sizes[size],
          className
        )}
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
      {text && <span className="ml-3 font-medium text-gray-700 dark:text-gray-300">{text}</span>}
    </div>
  );

  if (centered) {
    return (
      <div className="flex items-center justify-center min-h-[200px] w-full">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner; 