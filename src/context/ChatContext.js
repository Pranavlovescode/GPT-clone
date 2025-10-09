"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { mockConversations, defaultMessage } from "@/utils/mockData";
import { storage } from "@/utils/storage";
import { useAuth } from "@/context/AuthContext";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user } = useAuth() || {};
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

    // Set loading state
    setLoading(true);

    try {
      // Check if user is authenticated and has API key
      if (user && user.apiKey) {
        // Get message history (excluding system messages) for context
        const messageHistory = updatedConversation.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Call our API endpoint with the user's API key
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messageHistory,
            apiKey: user.apiKey,
            apiProvider: user.apiProvider || 'openai'
          }),
        });

        let aiResponseContent;
        if (!response.ok) {
          let errorData = {};
          try {
            errorData = await response.json().catch(() => ({}));
            console.error('API error:', errorData);
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
            errorData = { error: `Error status: ${response.status}` };
          }
          
          // More descriptive error message based on common issues
          if (errorData && errorData.error && typeof errorData.error === 'string' && errorData.error.includes('API key')) {
            aiResponseContent = `Error: There's an issue with your API key. Please check your settings and ensure you've entered a valid ${user.apiProvider === 'openai' ? 'OpenAI' : 'Gemini'} API key.`;
          } else if (response.status === 401 || response.status === 403) {
            aiResponseContent = `Error: Authentication failed. Please check your ${user.apiProvider === 'openai' ? 'OpenAI' : 'Gemini'} API key in settings.`;
          } else {
            aiResponseContent = `Error: ${errorData?.error || `Failed to get response from AI (Status ${response.status})`}`;
          }
        } else {
          const data = await response.json();
          aiResponseContent = data.content;
        }

        const aiResponse = {
          id: `msg-${Date.now() + 1}`,
          content: aiResponseContent,
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
      } else {
        // Fallback to mock response if no API key (user not logged in or no key)
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
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorResponse = {
        id: `msg-${Date.now() + 1}`,
        content: `Error: ${error.message || 'Something went wrong. Please try again.'}`,
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, errorResponse],
      };

      // Update with error message
      setCurrentConversation(finalConversation);
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === finalConversation.id ? finalConversation : conv
        )
      );
    } finally {
      setLoading(false);
    }
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

    // Generate new AI response using the same method as sendMessage
    setLoading(true);
    
    try {
      // Check if user is authenticated and has API key
      if (user && user.apiKey) {
        // Get message history for context
        const messageHistory = updatedConversation.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Call our API endpoint with the user's API key
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messageHistory,
            apiKey: user.apiKey,
            apiProvider: user.apiProvider || 'openai'
          }),
        });

        let aiResponseContent;
        if (!response.ok) {
          let errorData = {};
          try {
            errorData = await response.json().catch(() => ({}));
            console.error('API error during regeneration:', errorData);
          } catch (parseError) {
            console.error('Failed to parse error response during regeneration:', parseError);
            errorData = { error: `Error status: ${response.status}` };
          }
          
          // More descriptive error message based on common issues
          if (errorData && errorData.error && typeof errorData.error === 'string' && errorData.error.includes('API key')) {
            aiResponseContent = `Error: There's an issue with your API key. Please check your settings and ensure you've entered a valid ${user.apiProvider === 'openai' ? 'OpenAI' : 'Gemini'} API key.`;
          } else if (response.status === 401 || response.status === 403) {
            aiResponseContent = `Error: Authentication failed. Please check your ${user.apiProvider === 'openai' ? 'OpenAI' : 'Gemini'} API key in settings.`;
          } else {
            aiResponseContent = `Error: ${errorData?.error || `Failed to get response from AI (Status ${response.status})`}`;
          }
        } else {
          const data = await response.json();
          aiResponseContent = data.content;
        }

        const aiResponse = {
          id: `msg-${Date.now() + 1}`,
          content: aiResponseContent,
          role: "assistant",
          timestamp: new Date().toISOString(),
        };

        const finalConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, aiResponse],
        };

        // Update current conversation with AI response
        setCurrentConversation(finalConversation);
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === finalConversation.id ? finalConversation : conv
          )
        );
      } else {
        // Fallback to mock response if no API key
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
        }, 1000);
      }
    } catch (error) {
      console.error('Error regenerating message:', error);
      
      // Add error message
      const errorResponse = {
        id: `msg-${Date.now() + 1}`,
        content: `Error: ${error.message || 'Failed to regenerate response. Please try again.'}`,
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, errorResponse],
      };

      setCurrentConversation(finalConversation);
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === finalConversation.id ? finalConversation : conv
        )
      );
    } finally {
      setLoading(false);
    }
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

  // Generate a shareable link for a conversation (serialized as base64 in query)
  const generateShareLink = (conversationId) => {
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return;

    try {
      const payload = encodeURIComponent(btoa(JSON.stringify(conv)));
      const url = `${window.location.origin}/share?data=${payload}`;

      // Copy to clipboard
      navigator.clipboard
        .writeText(url)
        .then(() => {
          // simple feedback
          alert("Share link copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy share link:", err);
          prompt("Copy this link:", url);
        });
    } catch (err) {
      console.error("Failed to generate share link:", err);
      alert("Failed to generate share link");
    }
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
        generateShareLink,
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
