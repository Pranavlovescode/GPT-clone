"use client";
import { MessageSquare, Trash2 } from "lucide-react";
import { useChat } from "@/context/ChatContext";

export default function ConversationList({ filteredConversations }) {
  const {
    conversations,
    currentConversation,
    selectConversation,
    deleteConversation,
  } = useChat();

  const displayConversations = filteredConversations || conversations;

  return (
    <div className="py-2 space-y-1">
      {displayConversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-800 group ${
            currentConversation.id === conversation.id ? "bg-gray-800" : ""
          }`}
          onClick={() => selectConversation(conversation.id)}
        >
          <div className="flex items-center gap-2 truncate max-w-[180px]">
            <MessageSquare size={16} className="shrink-0" />
            <span className="truncate text-sm">{conversation.title}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteConversation(conversation.id);
            }}
            className="opacity-0 group-hover:opacity-100 hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {displayConversations.length === 0 && (
        <div className="px-3 py-2 text-gray-400 text-sm">
          {filteredConversations
            ? "No conversations match your search"
            : "No conversations yet"}
        </div>
      )}
    </div>
  );
}
