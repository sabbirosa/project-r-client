import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Card = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-gray-200 dark:border-gray-700",
      "bg-white dark:bg-gray-900",
      "shadow-sm hover:shadow-md transition-all duration-200",
      "overflow-hidden",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

const CardHeader = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 p-6",
      "border-b border-gray-200 dark:border-gray-700",
      "bg-gray-50 dark:bg-gray-800/50",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

const CardTitle = forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-none tracking-tight",
      "text-gray-900 dark:text-gray-100",
      className
    )}
    {...props}
  >
    {children}
  </h3>
));

const CardDescription = forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm font-medium text-gray-600 dark:text-gray-400",
      className
    )}
    {...props}
  >
    {children}
  </p>
));

const CardContent = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 text-gray-900 dark:text-gray-100", className)}
    {...props}
  >
    {children}
  </div>
));

const CardFooter = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between p-6 pt-0",
      "border-t border-gray-200 dark:border-gray-700",
      "bg-gray-50 dark:bg-gray-800/50",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
