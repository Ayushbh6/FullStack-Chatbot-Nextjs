// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/chat';
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="absolute top-4 right-4">
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
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">AI Chatbot</CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-300">
            Sign in to start your conversation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full justify-center gap-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <img
              src="https://authjs.dev/img/providers/google.svg"
              width={20}
              height={20}
              alt="Google logo"
            />
            <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col text-center text-xs text-gray-600 dark:text-gray-400">
          <p>
            By signing in, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}