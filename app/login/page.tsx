// app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">AI Chatbot</CardTitle>
          <CardDescription>
            Sign in to start your conversation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full justify-center gap-2 border-gray-300"
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
        <CardFooter className="flex flex-col text-center text-xs text-gray-500">
          <p>
            By signing in, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}