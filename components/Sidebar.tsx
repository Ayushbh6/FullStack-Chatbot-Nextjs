'use client';

import React from 'react';

// Mock data for past conversations
const mockConversations = [
  { id: '1', title: 'Conversation about Next.js' },
  { id: '2', title: 'Tailwind CSS Tips' },
  { id: '3', title: 'React 19 Features' },
  { id: '4', title: 'Shadcn UI Integration' },
  { id: '5', title: 'Long Conversation Title That Might Wrap Around to Multiple Lines to Test Text Handling' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 md:w-72 bg-gray-50 dark:bg-gray-800 p-4 space-y-2 flex flex-col border-r border-gray-200 dark:border-gray-700">
      <div className="flex-grow overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Past Conversations</h2>
        <ul className="space-y-1">
          {mockConversations.map((convo) => (
            <li key={convo.id}>
              <button 
                className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors truncate"
                title={convo.title} // Show full title on hover for truncated text
              >
                {convo.title}
              </button>
              {/* Delete button can be added here later */}
            </li>
          ))}
        </ul>
      </div>
      {/* As per instructions, NO other items like 'Explore GPTs' or 'View plans' */}
    </aside>
  );
}
