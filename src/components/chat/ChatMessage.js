"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, RotateCcw, Check } from "lucide-react";
import { useChat } from "@/context/ChatContext";

export default function ChatMessage({ message, onRegenerate }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(message.id);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`group flex ${isUser ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex p-4 rounded-lg w-full relative ${
          isUser
            ? "bg-blue-50 dark:bg-blue-900/30"
            : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full ${
            isUser ? "bg-blue-600" : "bg-green-500"
          } flex items-center justify-center text-white text-xs mr-4 flex-shrink-0`}
        >
          {isUser ? "PT" : "AI"}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isUser ? "You" : "ChatGPT"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
          {isUser ? (
            <div className="prose dark:prose-invert text-sm">
              {message.content}
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none text-sm">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div
          className={`absolute bottom-2 right-2 flex gap-1 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            title="Copy message"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          {!isUser && onRegenerate && (
            <button
              onClick={handleRegenerate}
              className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              title="Regenerate response"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
