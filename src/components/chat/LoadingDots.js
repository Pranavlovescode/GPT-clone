"use client";

export default function LoadingDots() {
  return (
    <div className="flex items-center space-x-1">
      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
        Thinking
      </span>
      <div className="flex space-x-1">
        <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
