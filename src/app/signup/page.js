"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiProvider, setApiProvider] = useState("openai");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signup, isAuthenticated } = useAuth();

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password || !confirmPassword || !apiKey) {
        throw new Error("Please fill in all fields");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords don't match");
      }

      // API key validation - allow keys with common prefixes
      const trimmedKey = apiKey.trim();
      if (trimmedKey.length < 10) {
        throw new Error("Please enter a valid API key (must be at least 10 characters)");
      }

      await signup({ email, password, apiKey, apiProvider });
      router.push("/");
    } catch (err) {
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold dark:text-white">Sign up</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create your ChatGPT Clone account
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="apiProvider"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              API Provider
            </label>
            <select
              id="apiProvider"
              name="apiProvider"
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
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {apiProvider === "openai" ? "OpenAI API Key" : "Gemini API Key"}
            </label>
            <input
              id="apiKey"
              name="apiKey"
              type="password"
              required
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder={`Your ${apiProvider === "openai" ? "OpenAI" : "Gemini"} API Key`}
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

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link 
              href="/login"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}