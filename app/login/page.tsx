'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="flex flex-col items-center mt-10 p-10 shadow-md rounded-lg bg-white">
        <h1 className="text-4xl font-bold mb-8">Welcome to AI Chatbot</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Please sign in to continue
        </p>
        
        <button
          onClick={() => signIn('google', { callbackUrl })}
          className="flex items-center justify-center gap-3 rounded-lg border bg-white px-6 py-3 text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <Image
            src="https://authjs.dev/img/providers/google.svg"
            width={24}
            height={24}
            alt="Google logo"
          />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
} 