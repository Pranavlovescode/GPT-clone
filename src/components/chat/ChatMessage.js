'use client';
import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex p-4 rounded-lg w-full ${isUser ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
        <div className={`w-8 h-8 rounded-full ${isUser ? 'bg-blue-600' : 'bg-green-500'} flex items-center justify-center text-white text-xs mr-4 flex-shrink-0`}>
          {isUser ? 'PT' : 'AI'}
        </div>
        <div className="flex-grow">
          {isUser ? (
            <div className="prose dark:prose-invert">{message.content}</div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}