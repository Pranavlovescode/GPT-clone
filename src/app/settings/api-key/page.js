"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ApiKeyPage() {
  const { user, updateApiKey } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [apiProvider, setApiProvider] = useState(user?.apiProvider || "openai");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      if (!apiKey) {
        throw new Error("API key is required");
      }

      const trimmedKey = apiKey.trim();
      if (trimmedKey.length < 10) {
        throw new Error("Please enter a valid API key (must be at least 10 characters)");
      }

      await updateApiKey({ apiKey, apiProvider });
      setSuccess(true);
      
      // Reset form
      setApiKey("");
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/settings");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update API key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Link 
              href="/settings"
              className="text-blue-600 dark:text-blue-400 hover:underline mr-2"
            >
              ← Back to Settings
            </Link>
            <h1 className="text-2xl font-bold dark:text-white">Update API Key</h1>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            {success && (
              <div className="mb-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded">
                API key updated successfully! Redirecting...
              </div>
            )}
            
            {error && (
              <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="apiProvider"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  API Provider
                </label>
                <select
                  id="apiProvider"
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                >
                  <option value="openai">OpenAI (ChatGPT)</option>
                  <option value="gemini">Google Gemini</option>
                </select>
              </div>
              
              <div>
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {apiProvider === "openai" ? "OpenAI API Key" : "Gemini API Key"}
                </label>
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${apiProvider === "openai" ? "OpenAI" : "Gemini"} API Key`}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {apiProvider === "openai" 
                    ? "Get your API key from https://platform.openai.com/api-keys" 
                    : "Get your API key from Google AI Studio"}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter your API key directly (e.g., "sk-..." for OpenAI or the full key for Gemini).
                  The system will handle any prefixes like "apiKey=" automatically.
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <Link
                  href="/settings"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading || !apiKey}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Update API Key"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}