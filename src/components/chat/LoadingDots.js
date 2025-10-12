"use client";

import React from "react";

// Optional: You can adjust these defaults
const DEFAULT_MESSAGE = "Thinking";
const DEFAULT_DOTS = 3;
const DEFAULT_COLOR = "bg-green-500";

export default function LoadingDots({
  message = DEFAULT_MESSAGE,
  dots = DEFAULT_DOTS,
  color = DEFAULT_COLOR,
  className = "",
}) {
  // Generate dots with incremental animation delays
  const dotElements = Array.from({ length: dots }).map((_, i) => (
    <div
      key={i}
      className={`h-2 w-2 ${color} rounded-full animate-loading-dot`}
      style={{ animationDelay: `${i * 0.15}s` }}
    />
  ));

  return (
    <div
      className={`flex items-center space-x-1 ${className}`}
      aria-live="polite"
      role="status"
    >
      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
        {message}
        {/* Visually hidden for screen readers */}
        <span className="sr-only">Loading, please wait…</span>
      </span>
      <div className="flex space-x-1">
        <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce"></div>
        {/* {dotElements} */}
      </div>
      {/* <style jsx>{`
        @keyframes loading-dot {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-0.4em);
          }
        }
        .animate-loading-dot {
          animation: loading-dot 1s infinite;
        }
      `}</style> */}
    </div>
  );
}



// "use client";

// export default function LoadingDots() {
//   return (
//     <div className="flex items-center space-x-1">
//       <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
//         Thinking
//       </span>
//       <div className="flex space-x-1">
//         <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
//         <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
//         <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce"></div>
//       </div>
//     </div>
//   );
// }
