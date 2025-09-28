"use client";
import { useState, useMemo } from "react";
import { Search, X, MessageSquare } from "lucide-react";
import { useChat } from "@/context/ChatContext";

export default function GlobalSearch({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { conversations, selectConversation } = useChat();

  // Search across all conversations and messages
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const lowercaseSearch = searchTerm.toLowerCase();
    const results = [];

    conversations.forEach((conversation) => {
      const matchingMessages = conversation.messages.filter((message) =>
        message.content.toLowerCase().includes(lowercaseSearch)
      );

      if (matchingMessages.length > 0) {
        results.push({
          conversation,
          messages: matchingMessages,
        });
      }
    });

    return results;
  }, [conversations, searchTerm]);

  const handleSelectResult = (conversationId) => {
    selectConversation(conversationId);
    onClose();
  };

  const highlightText = (text, term) => {
    if (!term) return text;

    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-600 rounded px-1"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[70vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search across all conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-lg outline-none placeholder-gray-500"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-96">
          {searchTerm.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p>Start typing to search across all your conversations</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No results found for "{searchTerm}"</p>
            </div>
          ) : (
            <div className="p-2">
              <div className="text-sm text-gray-500 p-2 mb-2">
                Found{" "}
                {searchResults.reduce(
                  (acc, result) => acc + result.messages.length,
                  0
                )}{" "}
                messages in {searchResults.length} conversations
              </div>

              {searchResults.map((result, index) => (
                <div key={index} className="mb-4">
                  <button
                    onClick={() => handleSelectResult(result.conversation.id)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className="text-blue-500" />
                      <span className="font-medium text-sm">
                        {result.conversation.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {result.messages.length} message
                        {result.messages.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {result.messages.slice(0, 3).map((message, msgIndex) => (
                      <div key={msgIndex} className="ml-6 mb-2 text-sm">
                        <div className="text-xs text-gray-500 mb-1">
                          {message.role === "user" ? "You" : "ChatGPT"}
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 line-clamp-2">
                          {highlightText(
                            message.content.slice(0, 200) +
                              (message.content.length > 200 ? "..." : ""),
                            searchTerm
                          )}
                        </div>
                      </div>
                    ))}

                    {result.messages.length > 3 && (
                      <div className="ml-6 text-xs text-gray-500">
                        +{result.messages.length - 3} more messages
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
