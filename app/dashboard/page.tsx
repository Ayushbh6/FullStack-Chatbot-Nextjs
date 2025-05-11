import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="flex min-h-screen flex-col p-8">
      <header className="flex justify-between items-center mb-8 pb-4 border-b">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <SignOutButton />
      </header>
      
      <main className="flex flex-col flex-1">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {session.user?.name || 'User'}</h2>
          <p className="text-gray-600">
            You are now signed in to the AI Chatbot platform.
          </p>
          <p className="text-gray-600 mt-4">
            In the future, this is where the AI chat functionality will be implemented.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="flex items-center space-x-4">
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{session.user?.name || 'User'}</p>
              <p className="text-gray-600">{session.user?.email || 'No email'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 