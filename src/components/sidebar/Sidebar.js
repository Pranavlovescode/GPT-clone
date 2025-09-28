"use client";
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import ConversationList from "./ConversationList";
import ConversationSearch from "./ConversationSearch";
import SettingsMenu from "./SettingsMenu";
import { useChat } from "@/context/ChatContext";

export default function Sidebar() {
  const { addConversation, conversations } = useChat();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter conversations based on search term
  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) {
      return null; // Show all conversations
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    return conversations.filter((conversation) => {
      // Search in conversation title
      if (conversation.title.toLowerCase().includes(lowercaseSearch)) {
        return true;
      }

      // Search in message content
      return conversation.messages.some((message) =>
        message.content.toLowerCase().includes(lowercaseSearch)
      );
    });
  }, [conversations, searchTerm]);

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  return (
    <aside className="flex flex-col h-full w-64 bg-gray-900 text-white">
      <div className="p-3 border-b border-gray-700">
        <button
          onClick={addConversation}
          className="flex items-center justify-center gap-2 w-full rounded-md py-2 px-3 border border-gray-600 hover:bg-gray-700 transition-colors"
        >
          <Plus size={16} />
          <span>New chat</span>
        </button>
      </div>

      <ConversationSearch onSearchChange={handleSearchChange} />

      <div className="flex-grow overflow-y-auto">
        <ConversationList filteredConversations={filteredConversations} />
      </div>

      <div className="p-3 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer flex-1">
            <div className="h-7 w-7 rounded-full bg-green-500 flex items-center justify-center text-sm font-medium">
              PT
            </div>
            <span className="text-sm truncate">Pranav Titambe</span>
          </div>
          <SettingsMenu />
        </div>
      </div>
    </aside>
  );
}
