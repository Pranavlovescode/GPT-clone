"use client";
import React, { useMemo } from "react";
import { useChat } from "@/context/ChatContext";

// Helper: download a JSON file
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Helper: download TXT
function downloadTXT(content, filename) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Format a conversation to TXT
function conversationToTxt(conversation) {
  const header = `Title: ${conversation.title || "Untitled"}\nID: ${
    conversation.id
  }\nMessages: ${conversation.messages?.length || 0}\n---\n`;
  const lines = (conversation.messages || []).map(
    (m) =>
      `${m.timestamp ? `[${new Date(m.timestamp).toLocaleString()}] ` : ""}${
        m.role === "assistant" ? "AI" : "You"
      }: ${m.content}`
  );
  return [header, ...lines].join("\n");
}

export default function ExportPage() {
  const { conversations, currentConversation, exportConversations } = useChat();

  const hasConversations = conversations && conversations.length > 0;
  const hasCurrent =
    currentConversation &&
    currentConversation.id &&
    currentConversation.id !== "default";

  const totalMessages = useMemo(
    () => conversations.reduce((acc, c) => acc + (c.messages?.length || 0), 0),
    [conversations]
  );

  const handleExportAllJSON = () => {
    // Use existing context helper for consistency
    if (typeof exportConversations === "function") return exportConversations();
    downloadJSON(
      conversations,
      `chatgpt-conversations-${new Date().toISOString().split("T")[0]}.json`
    );
  };

  const handleExportCurrentJSON = () => {
    if (!hasCurrent) return;
    downloadJSON(
      currentConversation,
      `chatgpt-conversation-${currentConversation.id}.json`
    );
  };

  const handleExportCurrentTXT = () => {
    if (!hasCurrent) return;
    downloadTXT(
      conversationToTxt(currentConversation),
      `chatgpt-conversation-${currentConversation.id}.txt`
    );
  };

  const handleExportOneJSON = (conv) => {
    downloadJSON(conv, `chatgpt-conversation-${conv.id}.json`);
  };

  const handleExportOneTXT = (conv) => {
    downloadTXT(conversationToTxt(conv), `chatgpt-conversation-${conv.id}.txt`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Export Chats</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {hasConversations
          ? `${conversations.length} conversations • ${totalMessages} messages`
          : "No conversations available to export."}
      </p>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          onClick={handleExportAllJSON}
          disabled={!hasConversations}
        >
          Export All (JSON)
        </button>

        <button
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          onClick={handleExportCurrentJSON}
          disabled={!hasCurrent}
        >
          Export Current (JSON)
        </button>

        <button
          className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
          onClick={handleExportCurrentTXT}
          disabled={!hasCurrent}
        >
          Export Current (TXT)
        </button>
      </div>

      <div className="border-t dark:border-gray-700 pt-6">
        <h2 className="text-lg font-semibold mb-3">
          Export Individual Conversations
        </h2>
        {!hasConversations ? (
          <div className="text-gray-500">No conversations found.</div>
        ) : (
          <ul className="space-y-3">
            {conversations.map((conv) => (
              <li
                key={conv.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    {conv.title || "Untitled"}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {conv.messages?.length || 0} messages • ID: {conv.id}
                  </div>
                </div>
                <div className="flex gap-2 ml-3">
                  <button
                    className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => handleExportOneJSON(conv)}
                  >
                    JSON
                  </button>
                  <button
                    className="px-3 py-1.5 rounded bg-gray-700 text-white hover:bg-gray-800"
                    onClick={() => handleExportOneTXT(conv)}
                  >
                    TXT
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
