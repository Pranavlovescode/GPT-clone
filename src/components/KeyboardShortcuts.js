"use client";
import { useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { useTheme } from "@/context/ThemeContext";

export default function KeyboardShortcuts() {
  const { addConversation } = useChat();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + N: New conversation
      if ((event.ctrlKey || event.metaKey) && event.key === "n") {
        event.preventDefault();
        addConversation();
      }

      // Ctrl/Cmd + Shift + T: Toggle theme
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "T"
      ) {
        event.preventDefault();
        toggleTheme();
      }

      // Escape: Clear search (if search is focused)
      if (event.key === "Escape") {
        const searchInput = document.querySelector(
          'input[placeholder*="Search"]'
        );
        if (searchInput && document.activeElement === searchInput) {
          searchInput.blur();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [addConversation, toggleTheme]);

  return null; // This component doesn't render anything
}

// Keyboard shortcuts help component
export function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ["Ctrl", "N"], description: "New conversation" },
    { keys: ["Ctrl", "Shift", "T"], description: "Toggle theme" },
    { keys: ["Enter"], description: "Send message" },
    { keys: ["Shift", "Enter"], description: "New line in message" },
    { keys: ["Escape"], description: "Clear search/close modal" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {shortcut.description}
              </span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <span
                    key={keyIndex}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono"
                  >
                    {key}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Use Cmd instead of Ctrl on Mac
        </div>
      </div>
    </div>
  );
}
