"use client";
import MainLayout from '@/components/MainLayout';
import ChatInterface from '@/components/chat/ChatInterface';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <ChatInterface />
      </MainLayout>
    </ProtectedRoute>
  );
}
