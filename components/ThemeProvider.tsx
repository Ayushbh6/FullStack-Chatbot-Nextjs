'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setThemeDirectly: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to get initial theme, usable on client
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'; // Should not be relied upon by itself for class setting
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  if (storedTheme) return storedTheme;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

// Helper function to apply theme to DOM
const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize state from our helper, ensuring it runs client-side for localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return getInitialTheme();
    }
    return 'light'; // Default for SSR, to be corrected by client-side effect or initializer script
  });
  
  // First effect runs only once on mount to sync with system/localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const currentTheme = getInitialTheme();
    setTheme(currentTheme);
    applyTheme(currentTheme);
  }, []);
  
  // Apply theme changes when theme state changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      return newTheme;
    });
  };

  const setThemeDirectly = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeDirectly }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 