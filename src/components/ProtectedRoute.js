"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until auth state is loaded
    if (loading) return;
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state or nothing while checking auth
  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  // Render children if authenticated
  return children;
}