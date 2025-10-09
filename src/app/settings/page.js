"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 dark:text-white">Settings</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <p className="text-gray-900 dark:text-white">{user.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API Provider
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.apiProvider === "openai" ? "OpenAI (ChatGPT)" : "Google Gemini"}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API Key
                </label>
                <div className="flex items-center">
                  <p className="text-gray-900 dark:text-white mr-2">•••••••••••••••••••</p>
                  <button 
                    onClick={() => router.push("/settings/api-key")}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">About</h2>
            <p className="text-gray-700 dark:text-gray-300">
              ChatGPT Clone is an educational project built with Next.js that demonstrates
              how to create a chat interface similar to ChatGPT. This application uses your provided
              API key to communicate with language models.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Your API key is stored locally on your device and is never sent to our servers.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}