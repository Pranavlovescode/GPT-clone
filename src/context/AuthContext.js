"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { storage } from "@/utils/storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    const storedUser = storage.loadUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Helper function to clean API keys
  const cleanApiKey = (apiKey) => {
    let key = apiKey.trim();
    // Remove common prefixes
    if (key.startsWith('apiKey=')) {
      key = key.substring(7);
    }
    // Remove any quotes if somehow present
    return key.replace(/["']/g, '');
  };

  // Sign up a new user
  const signup = ({ email, password, apiKey, apiProvider }) => {
    // In a real app, you would call an API here
    // For this clone, we'll store locally
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password, // Note: In a real app, NEVER store passwords in plain text
      apiKey: cleanApiKey(apiKey),
      apiProvider, // 'openai' or 'gemini'
      createdAt: new Date().toISOString()
    };
    
    storage.saveUser(newUser);
    setUser(newUser);
    return newUser;
  };

  // Log in an existing user
  const login = ({ email, password }) => {
    // In a real app, you would validate against a database
    const users = storage.loadUsers() || [];
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error("Invalid email or password");
    }
    
    storage.saveUser(foundUser);
    setUser(foundUser);
    return foundUser;
  };

  // Log out the current user
  const logout = () => {
    storage.clearUser();
    setUser(null);
  };

  // Update user profile
  const updateProfile = (updates) => {
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    storage.saveUser(updatedUser);
    setUser(updatedUser);
    
    // Also update in users list
    const users = storage.loadUsers() || [];
    const updatedUsers = users.map(u => 
      u.id === user.id ? updatedUser : u
    );
    storage.saveUsers(updatedUsers);
    
    return updatedUser;
  };

  // Update API key
  const updateApiKey = ({ apiKey, apiProvider }) => {
    return updateProfile({ apiKey: cleanApiKey(apiKey), apiProvider });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        updateProfile,
        updateApiKey,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};