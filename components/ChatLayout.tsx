'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { Search, Plus, Mic, Settings2, Zap, CircleHelp, Send, Moon, Sun, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function ChatLayout() {
  const { theme, toggleTheme } = useTheme();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  // Ensure we have the correct theme state on client-side
  useEffect(() => {
    setMounted(true);
    // Check actual DOM state
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
    // Force update the current theme state to match what will be toggled
    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const toggleSearch = () => setIsSearchActive(!isSearchActive);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col relative">
        <div className="absolute top-4 right-4 flex space-x-2">
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
            {!mounted ? null : (
              currentTheme === 'light' ? 
                <Sun className="w-5 h-5" /> : 
                <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
          <h1 className="text-3xl font-semibold mb-4">Ready when you are.</h1>
          
          <div className="w-full max-w-3xl mt-auto bg-gray-100 dark:bg-gray-800 rounded-xl p-3 shadow-md">
            <div className="flex items-center gap-2">
              <Button 
                variant={isSearchActive ? "default" : "ghost"} 
                size="icon"
                onClick={toggleSearch}
                className={`p-2 rounded-full ${isSearchActive ? 'bg-blue-500 text-white dark:bg-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                aria-label={isSearchActive ? 'Disable search' : 'Enable search'}
              >
                <Search className="w-5 h-5" />
              </Button>

              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-full">
                <Plus className="w-6 h-6" />
              </button>
              
              <input 
                type="text" 
                placeholder="Ask anything" 
                className="flex-1 p-3 bg-transparent focus:outline-none text-sm md:text-base"
              />
              
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-full">
                <Mic className="w-5 h-5" />
              </button>

              <Button variant="default" size="icon" className="p-2 rounded-full bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                <Send className="w-5 h-5" />
              </Button>
            </div>

            {isSearchActive && (
              <div className="mt-2 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Search active:</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 