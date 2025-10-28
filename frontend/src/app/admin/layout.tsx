// app/admin/layout.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLoading from './loading';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, isAdmin, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Check if user is NOT an admin
      if (!isAdmin) {
        // Log out any invalid token/role and redirect
        logout(); 
        router.push('/login');
      }
    }
  }, [isLoading, isAdmin, router, logout]);

  // Use the loading component while authentication status is being determined
  if (isLoading || !isAdmin) {
    return <AdminLoading />;
  }

  return (
    <>
      <header className="bg-gray-800 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <nav>
            <Link href="/admin/dashboard" className="mr-4 hover:text-indigo-400">
              Dashboard
            </Link>
            <Link href="/admin/candidates" className="mr-4 hover:text-indigo-400">
              Candidates
            </Link>
            <button onClick={logout} className="bg-red-500 hover:bg-red-700 py-1 px-3 rounded text-sm">
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-6">
        {children}
      </main>
    </>
  );
}