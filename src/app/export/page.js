import React from 'react';
import { saveAs } from 'file-saver';

const mockChats = [
  { id: 1, user: 'User', message: 'Hello!' },
  { id: 2, user: 'Bot', message: 'Hi, how can I help you?' },
];

function exportChatsAsTxt(chats) {
  const content = chats.map(chat => `${chat.user}: ${chat.message}`).join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'chat-export.txt');
}

export default function ExportPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Export Chats</h1>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => exportChatsAsTxt(mockChats)}
      >
        Export as TXT
      </button>
    </div>
  );
}
