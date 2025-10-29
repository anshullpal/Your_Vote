'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VoterLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isVoter, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If not logged in or not a voter → kick out
      if (!isAuthenticated || !isVoter) {
        logout();
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated, isVoter, router, logout]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Checking voter access...
      </div>
    );
  }

  if (!isAuthenticated || !isVoter) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Redirecting...
      </div>
    );
  }

  return (
    <>
      <header className="bg-indigo-600 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Secure Voting Portal</h1>
          <nav>
            <Link href="/user/profile" className="mr-4 hover:text-indigo-200">
              Profile
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 py-1 px-3 rounded text-sm"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-6">{children}</main>
    </>
  );
}
