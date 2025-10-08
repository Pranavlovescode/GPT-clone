"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SharePage() {
  const [conversation, setConversation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (!data) {
      setError("No data provided in the link.");
      return;
    }

    try {
      const jsonStr = atob(decodeURIComponent(data));
      const conv = JSON.parse(jsonStr);
      setConversation(conv);
    } catch (err) {
      console.error(err);
      setError("Failed to parse shared conversation.");
    }
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Shared Conversation</h1>
        <p className="text-red-500">{error}</p>
        <Link href="/">Go back</Link>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Shared Conversation</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{conversation.title}</h1>
      <div className="space-y-4">
        {conversation.messages && conversation.messages.length > 0 ? (
          conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg ${
                msg.role === "user" ? "bg-gray-800" : "bg-gray-700"
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">{msg.role}</div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          ))
        ) : (
          <div className="text-gray-400">No messages in this conversation.</div>
        )}
      </div>
      <div className="mt-6">
        <Link href="/" className="text-sm text-blue-400">
          Back to app
        </Link>
      </div>
    </div>
  );
}
