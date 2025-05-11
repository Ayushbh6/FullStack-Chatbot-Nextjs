'use client'; // This component will render a script tag, but the script itself is pure JS

import React from 'react';

// This script should be as small and fast as possible.
// It sets the theme class on the <html> element before React hydration.
const immediateThemeScript = `(
  function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme) {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark');
        }
      } else {
        // No theme in localStorage, check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark'); 
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      }
    } catch (e) { /* Ignore errors */ }
  }
)();`;

export function ThemeInitializer() {
  return <script dangerouslySetInnerHTML={{ __html: immediateThemeScript }} />;
} 