'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md transition-colors"
    >
      Sign Out
    </button>
  );
} 