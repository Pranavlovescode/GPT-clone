"use client";
import { useState } from "react";
import { Search, X } from "lucide-react";

export default function ConversationSearch({ onSearchChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchTermChange = (newTerm) => {
    setSearchTerm(newTerm);
    onSearchChange(newTerm);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      handleSearchTermChange("");
    }
  };

  const handleClearSearch = () => {
    handleSearchTermChange("");
    setIsSearchOpen(false);
  };

  return (
    <div className="p-3 border-b border-gray-700">
      {!isSearchOpen ? (
        <button
          onClick={handleSearchToggle}
          className="flex items-center justify-center gap-2 w-full rounded-md py-2 px-3 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <Search size={16} />
          <span className="text-sm">Search conversations</span>
        </button>
      ) : (
        <div className="relative">
          <div className="flex items-center bg-gray-800 rounded-md">
            <Search size={16} className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleClearSearch}
              className="absolute right-2 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
