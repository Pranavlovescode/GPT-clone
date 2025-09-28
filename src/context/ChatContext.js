"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { mockConversations, defaultMessage } from "@/utils/mockData";
import { storage } from "@/utils/storage";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] =
    useState(defaultMessage);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedConversations = storage.loadConversations();
    const storedCurrentConversation = storage.loadCurrentConversation();

    if (storedConversations && storedConversations.length > 0) {
      setConversations(storedConversations);
      if (
        storedCurrentConversation &&
        storedCurrentConversation.id !== "default"
      ) {
        setCurrentConversation(storedCurrentConversation);
      }
    } else {
      // First time user - use mock data
      setConversations(mockConversations);
      storage.saveConversations(mockConversations);
    }
    setIsInitialized(true);
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && conversations.length > 0) {
      storage.saveConversations(conversations);
    }
  }, [conversations, isInitialized]);

  // Save current conversation to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && currentConversation.id !== "default") {
      storage.saveCurrentConversation(currentConversation);
    }
  }, [currentConversation, isInitialized]);

  // Add a new conversation
  const addConversation = () => {
    const newConversation = {
      id: `conv-${Date.now()}`,
      title: "New Chat",
      messages: [],
    };

    setConversations((prevConversations) => [
      newConversation,
      ...prevConversations,
    ]);
    setCurrentConversation(newConversation);
    return newConversation;
  };

  // Delete a conversation
  const deleteConversation = (id) => {
    setConversations((prevConversations) =>
      prevConversations.filter((conv) => conv.id !== id)
    );

    if (currentConversation.id === id) {
      if (conversations.length > 1) {
        const remainingConv = conversations.find((conv) => conv.id !== id);
        setCurrentConversation(remainingConv || defaultMessage);
      } else {
        setCurrentConversation(defaultMessage);
      }
    }
  };

  // Update conversation title
  const updateConversationTitle = (id, title) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === id ? { ...conv, title } : conv
      )
    );

    if (currentConversation.id === id) {
      setCurrentConversation((prev) => ({ ...prev, title }));
    }
  };

  // Send a message and get a response
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    // Create new message
    const userMessage = {
      id: `msg-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    let updatedConversation;
    let isNewConversation = false;

    // If it's a new conversation, create one
    if (!currentConversation.id || currentConversation.id === "default") {
      const newConv = addConversation();
      updatedConversation = {
        ...newConv,
        messages: [userMessage],
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
      };
      isNewConversation = true;
    } else {
      updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, userMessage],
      };
    }

    // Update current conversation with user message
    setCurrentConversation(updatedConversation);

    // Update conversations list
    setConversations((prevConversations) =>
      isNewConversation
        ? [
            updatedConversation,
            ...prevConversations.filter((c) => c.id !== updatedConversation.id),
          ]
        : prevConversations.map((conv) =>
            conv.id === updatedConversation.id ? updatedConversation : conv
          )
    );

    // Simulate AI response
    setLoading(true);
    setTimeout(() => {
      const aiResponse = {
        id: `msg-${Date.now() + 1}`,
        content: simulateResponse(content),
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, aiResponse],
      };

      // Update current conversation with AI response
      setCurrentConversation(finalConversation);

      // Update conversations list
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === finalConversation.id ? finalConversation : conv
        )
      );
      setLoading(false);
    }, 1500);
  };

  // Regenerate a message
  const regenerateMessage = async (messageId) => {
    const messageIndex = currentConversation.messages.findIndex(
      (msg) => msg.id === messageId
    );
    if (messageIndex === -1) return;

    // Find the user message that prompted this AI response
    const userMessageIndex = messageIndex - 1;
    if (
      userMessageIndex < 0 ||
      currentConversation.messages[userMessageIndex].role !== "user"
    )
      return;

    const userMessage = currentConversation.messages[userMessageIndex];

    // Remove the AI message we're regenerating
    const updatedMessages = currentConversation.messages.slice(0, messageIndex);
    const updatedConversation = {
      ...currentConversation,
      messages: updatedMessages,
    };

    setCurrentConversation(updatedConversation);
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === updatedConversation.id ? updatedConversation : conv
      )
    );

    // Generate new AI response
    setLoading(true);
    setTimeout(() => {
      const aiResponse = {
        id: `msg-${Date.now()}`,
        content: simulateResponse(userMessage.content),
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, aiResponse],
      };

      setCurrentConversation(finalConversation);
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === finalConversation.id ? finalConversation : conv
        )
      );
      setLoading(false);
    }, 1500);
  };

  // Select a conversation
  const selectConversation = (id) => {
    const conversation = conversations.find((conv) => conv.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  // Clear all conversations
  const clearAllConversations = () => {
    setConversations([]);
    setCurrentConversation(defaultMessage);
    storage.clearAll();
  };

  // Export conversations
  const exportConversations = () => {
    const dataStr = JSON.stringify(conversations, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chatgpt-clone-conversations-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import conversations
  const importConversations = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConversations = JSON.parse(e.target.result);
        if (Array.isArray(importedConversations)) {
          setConversations(importedConversations);
          if (importedConversations.length > 0) {
            setCurrentConversation(importedConversations[0]);
          }
        }
      } catch (error) {
        console.error("Failed to import conversations:", error);
        alert("Failed to import conversations. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        loading,
        addConversation,
        deleteConversation,
        updateConversationTitle,
        sendMessage,
        selectConversation,
        regenerateMessage,
        clearAllConversations,
        exportConversations,
        importConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// Simulate AI responses
function simulateResponse(message) {
  const responses = [
    `I understand you're asking about "${message}". That's an interesting topic. Let me provide some thoughts on this.
    
First, it's important to consider multiple perspectives on this question. There are several key points to understand:

1. This topic has evolved significantly over recent years
2. Experts in the field generally agree on the core principles
3. There are practical applications you might find useful

Would you like me to elaborate on any of these aspects in particular?`,

    `Thanks for your question about "${message}".

Based on current information, here are some key insights:

- Research shows that this area is growing at a rapid pace
- The most effective approaches combine traditional and innovative methods
- Many practitioners recommend starting with small, incremental steps
- The context and specific goals significantly impact the best approach

Is there a specific aspect of this topic you'd like me to explore in more detail?`,

    `Regarding "${message}", here's what I can tell you:

This is a multifaceted topic with several important dimensions to consider. The most current understanding suggests:

1. **Foundational Concepts**: The underlying principles have remained consistent despite recent innovations
2. **Practical Applications**: There are numerous ways to apply these concepts in real-world scenarios
3. **Future Directions**: Emerging trends suggest this area will continue to evolve

Would you like me to focus on any particular aspect of this information?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
