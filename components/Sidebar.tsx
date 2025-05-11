'use client'; // this component requires client-side rendering

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Conversation {
  _id: string;
  title: string;
}

// Individual conversation list item, supports select, rename, and delete
function ConversationItem({
  convo,
  selected,
  onSelect,
  onRename,
  onDelete,
}: {
  convo: Conversation;
  selected: boolean;
  onSelect: (id: string) => void;
  onRename: (newTitle: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(convo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const submitRename = async () => {
    const newTitle = title.trim();
    if (!newTitle || newTitle === convo.title) {
      setEditing(false);
      setTitle(convo.title);
      return;
    }
    try {
      const res = await fetch('/api/conversations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: convo._id, title: newTitle }),
      });
      if (!res.ok) throw new Error('Failed to rename');
      onRename(newTitle);
    } catch (err) {
      console.error(err);
      setTitle(convo.title);
    } finally {
      setEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitRename();
    } else if (e.key === 'Escape') {
      setEditing(false);
      setTitle(convo.title);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this conversation?')) return;
    try {
      const res = await fetch('/api/conversations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: convo._id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      onDelete();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <li>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {editing ? (
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={submitRename}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          ) : (
            <button
              onClick={() => onSelect(convo._id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm truncate transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                selected
                  ? 'bg-blue-200 text-gray-900 dark:bg-blue-700 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              title={convo.title}
            >
              {convo.title}
            </button>
          )}
        </div>
        <div className="flex items-center space-x-1 ml-2">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              title="Rename"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1 text-red-500 hover:text-red-700"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
}

interface SidebarProps {
  conversations: Conversation[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({
  conversations,
  loading,
  selectedId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: SidebarProps) {

  return (
    <aside className="w-64 md:w-72 bg-gray-50 dark:bg-gray-800 p-4 space-y-2 flex flex-col border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Conversations</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={onCreate}
          title="New Conversation"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : conversations.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No conversations yet.</p>
        ) : (
          <ul className="space-y-1">
            {conversations.map((convo) => (
              <ConversationItem
                key={convo._id}
                convo={convo}
                selected={convo._id === selectedId}
                onSelect={onSelect}
                onRename={(newTitle) => onRename(convo._id, newTitle)}
                onDelete={() => onDelete(convo._id)}
              />
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
