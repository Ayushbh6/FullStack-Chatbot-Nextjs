import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // If authenticated, redirect to chat, otherwise to login
  if (session) {
    redirect('/chat');
  } else {
    redirect('/login');
  }
  
  // This won't be rendered, but just in case
  return null;
}
