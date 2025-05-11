 'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import ChatInput from './ChatInput';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { LogOut, Sun, Moon } from 'lucide-react';
import { signOut } from 'next-auth/react';

// Client-side conversation/message types
type ClientMessage = {
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
};
type ClientConversation = {
  _id: string;
  title: string;
  messages: ClientMessage[];
};

export default function ChatLayout() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
  const [conversations, setConversations] = useState<ClientConversation[]>([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ensure we have the correct theme state on client-side
  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setCurrentTheme(isDarkMode ? 'dark' : 'light');
  }, []);

  // Update local state when theme changes
  useEffect(() => {
    if (mounted) {
      setCurrentTheme(theme);
    }
  }, [theme, mounted]);

  const handleToggleTheme = () => {
    toggleTheme();
    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
  };


  const handleSignOut = () => signOut({ callbackUrl: '/login' });

  // Fetch conversations
  useEffect(() => {
    const load = async () => {
      setLoadingConvos(true);
      try {
        const res = await fetch('/api/conversations');
        const data: ClientConversation[] = await res.json();
        setConversations(data);
        if (!selectedId && data.length > 0) {
          setSelectedId(data[0]._id);
          setMessages(data[0].messages || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingConvos(false);
      }
    };
    load();
  }, [selectedId]);

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });
      const newConvo: ClientConversation = await res.json();
      setConversations((prev) => [newConvo, ...prev]);
      setSelectedId(newConvo._id);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c._id === id ? { ...c, title: newTitle } : c))
    );
  };

  const handleDelete = (id: string) => {
    setConversations((prev) => prev.filter((c) => c._id !== id));
    if (selectedId === id) {
      const next = conversations.find((c) => c._id !== id);
      if (next) {
        setSelectedId(next._id);
        setMessages(next.messages || []);
      } else {
        setSelectedId(null);
        setMessages([]);
      }
    }
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const convo = conversations.find((c) => c._id === id);
    setMessages(convo?.messages || []);
  };

  const handleSend = async (text: string) => {
    if (!selectedId) return;
    setIsProcessing(true);

    const userMsg: ClientMessage = {
      role: 'user',
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setConversations((prev) =>
      prev.map((c) =>
        c._id === selectedId
          ? { ...c, messages: [...c.messages, userMsg] }
          : c
      )
    );

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedId, input: text }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Network response was not ok or empty body');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantText = '';

      // Add placeholder for assistant message
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: '', createdAt: new Date().toISOString() },
      ]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          assistantText += chunk;
          setMessages((prev) => {
            const newMsgs = [...prev];
            const lastMsg = newMsgs[newMsgs.length - 1];
            newMsgs[newMsgs.length - 1] = {
              ...lastMsg,
              text: lastMsg.text + chunk,
            };
            return newMsgs;
          });
        }
      }

      // Append full assistant message to conversation
      const assistantMsg: ClientMessage = {
        role: 'assistant',
        text: assistantText,
        createdAt: new Date().toISOString(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selectedId
            ? { ...c, messages: [...c.messages, assistantMsg] }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Sidebar
        conversations={conversations}
        loading={loadingConvos}
        selectedId={selectedId}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      <main className="flex-1 flex flex-col relative">
        <div className="sticky top-0 z-10 p-4 flex justify-end bg-white dark:bg-gray-900">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleTheme}
              aria-label={currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {!mounted ? null : currentTheme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        {selectedId ? (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 pt-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-lg max-w-[70%] ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <ChatInput onSendMessage={handleSend} isProcessing={isProcessing} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select or create a conversation to start chatting.
          </div>
        )}
      </main>
    </div>
  );
}