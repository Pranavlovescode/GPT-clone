"use client";
import { useState, useRef } from "react";
import { Settings, Download, Upload, Trash2, X } from "lucide-react";
import { useChat } from "@/context/ChatContext";

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { clearAllConversations, exportConversations, importConversations } =
    useChat();
  const fileInputRef = useRef(null);

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all conversations? This action cannot be undone."
      )
    ) {
      clearAllConversations();
      setIsOpen(false);
    }
  };

  const handleExport = () => {
    exportConversations();
    setIsOpen(false);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      importConversations(file);
      setIsOpen(false);
    }
    // Reset the input
    event.target.value = "";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded hover:bg-gray-800 transition-colors"
        title="Settings"
      >
        <Settings size={18} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
            <div className="py-2">
              <button
                onClick={handleExport}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2"
              >
                <Download size={16} />
                Export conversations
              </button>

              <button
                onClick={handleImport}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2"
              >
                <Upload size={16} />
                Import conversations
              </button>

              <hr className="border-gray-700 my-2" />

              <button
                onClick={handleClearAll}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 text-red-400 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Clear all conversations
              </button>
            </div>
          </div>
        </>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
