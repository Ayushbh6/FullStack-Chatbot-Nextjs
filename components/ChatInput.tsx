'use client';

import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing?: boolean;
}

export default function ChatInput({ onSendMessage, isProcessing = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message with Enter (but not when Shift is pressed)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line
      if (message.trim() && !isProcessing) {
        onSendMessage(message);
        setMessage('');
      }
    }
    // Shift+Enter creates a new line (default behavior, just let it happen)
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
          disabled={isProcessing}
          rows={1}
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100
                     px-4 py-2 
                     focus:border-blue-500 dark:focus:border-blue-400 
                     focus:outline-none focus:ring-2 
                     focus:ring-blue-200 dark:focus:ring-blue-800
                     placeholder:text-gray-500 dark:placeholder:text-gray-400
                     resize-none min-h-[40px]"
        />
        <button
          type="submit"
          disabled={!message.trim() || isProcessing}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isProcessing ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
