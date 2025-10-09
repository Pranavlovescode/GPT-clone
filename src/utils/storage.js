// Storage utilities for conversation persistence
const STORAGE_KEYS = {
  CONVERSATIONS: "chatgpt_clone_conversations",
  CURRENT_CONVERSATION: "chatgpt_clone_current_conversation",
  THEME: "chatgpt_clone_theme",
  USERS: "chatgpt_clone_users",
  CURRENT_USER: "chatgpt_clone_current_user",
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

  // Save users list
  saveUsers: (users) => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users:", error);
    }
  },

  // Load users list
  loadUsers: () => {
    if (!isBrowser) return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load users:", error);
      return [];
    }
  },

  // Save current user
  saveUser: (user) => {
    if (!isBrowser) return;
    try {
      // Save to current user
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      
      // Also update in users list
      const users = storage.loadUsers() || [];
      const existingUserIndex = users.findIndex(u => u.id === user.id);
      
      if (existingUserIndex >= 0) {
        users[existingUserIndex] = user;
      } else {
        users.push(user);
      }
      
      storage.saveUsers(users);
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  },

  // Load current user
  loadUser: () => {
    if (!isBrowser) return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Failed to load user:", error);
      return null;
    }
  },

  // Clear user session
  clearUser: () => {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (error) {
      console.error("Failed to clear user:", error);
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
