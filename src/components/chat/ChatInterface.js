'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import ChatMessage from './ChatMessage';
import LoadingDots from './LoadingDots';

export default function ChatInterface() {
  const { currentConversation, sendMessage, loading } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {currentConversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-6">How can I help you today?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                {[
                  'Explain quantum computing in simple terms',
                  'Write a short story about a time traveler',
                  'Give me ideas for a project using React',
                  'How do I make an HTTP request in JavaScript?'
                ].map((suggestion, i) => (
                  <button 
                    key={i} 
                    className="p-4 border rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      setInput(suggestion);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          currentConversation.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        {loading && (
          <div className="flex p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs mr-4 flex-shrink-0">
              AI
            </div>
            <div className="flex-grow">
              <LoadingDots />
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-2 relative">
          <div className="flex-grow relative">
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 pr-12 resize-none bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Message ChatGPT..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
              style={{ 
                height: Math.min(120, Math.max(56, input.split('\n').length * 24)) + 'px'
              }}
            />
            <button
              type="submit"
              className={`absolute right-3 bottom-3 p-1 rounded-md ${
                !input.trim() 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              disabled={!input.trim() || loading}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
        <p className="text-xs text-center mt-2 text-gray-500">
          ChatGPT Clone can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}