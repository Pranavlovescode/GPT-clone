// Storage utilities for conversation persistence
const STORAGE_KEYS = {
  CONVERSATIONS: "chatgpt_clone_conversations",
  CURRENT_CONVERSATION: "chatgpt_clone_current_conversation",
  THEME: "chatgpt_clone_theme",
};

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

export const storage = {
  // Save conversations to localStorage
  saveConversations: (conversations) => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(
        STORAGE_KEYS.CONVERSATIONS,
        JSON.stringify(conversations)
      );
    } catch (error) {
      console.error("Failed to save conversations:", error);
    }
  },

  // Load conversations from localStorage
  loadConversations: () => {
    if (!isBrowser) return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Failed to load conversations:", error);
      return null;
    }
  },

  // Save current conversation
  saveCurrentConversation: (conversation) => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_CONVERSATION,
        JSON.stringify(conversation)
      );
    } catch (error) {
      console.error("Failed to save current conversation:", error);
    }
  },

  // Load current conversation
  loadCurrentConversation: () => {
    if (!isBrowser) return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Failed to load current conversation:", error);
      return null;
    }
  },

  // Save theme preference
  saveTheme: (theme) => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  },

  // Load theme preference
  loadTheme: () => {
    if (!isBrowser) return "light";
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
    } catch (error) {
      console.error("Failed to load theme:", error);
      return "light";
    }
  },

  // Clear all stored data
  clearAll: () => {
    if (!isBrowser) return;
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  },
};
