import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm border-collapse", className)}
      {...props}
    />
  </div>
));

const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-gray-50 dark:bg-gray-800 [&_tr]:border-b", className)}
    {...props}
  />
));

const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("bg-white dark:bg-gray-900 [&_tr:last-child]:border-0", className)}
    {...props}
  />
));

const TableFooter = forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-gray-50 dark:bg-gray-800 font-medium [&>tr]:last:border-b-0 border-t border-gray-200 dark:border-gray-700", className)}
    {...props}
  />
));

const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-gray-200 dark:border-gray-700 transition-all duration-150",
      "hover:bg-gray-50 dark:hover:bg-gray-800/70",
      "data-[state=selected]:bg-gray-100 dark:data-[state=selected]:bg-gray-800",
      className
    )}
    {...props}
  />
));

const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-semibold text-gray-900 dark:text-gray-100",
      "border-b border-gray-200 dark:border-gray-700",
      "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));

const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle text-gray-900 dark:text-gray-100",
      "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));

const TableCaption = forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-gray-600 dark:text-gray-400 font-medium", className)}
    {...props}
  />
));

Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableFooter.displayName = "TableFooter";
TableHead.displayName = "TableHead";
TableRow.displayName = "TableRow";
TableCell.displayName = "TableCell";
TableCaption.displayName = "TableCaption";

export {
    Table, TableBody, TableCaption, TableCell, TableFooter,
    TableHead, TableHeader, TableRow
};
