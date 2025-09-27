'use client';

export default function LoadingDots() {
  return (
    <div className="flex space-x-2">
      <div className="animate-pulse delay-0 h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
      <div className="animate-pulse delay-150 h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
      <div className="animate-pulse delay-300 h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
    </div>
  );
}