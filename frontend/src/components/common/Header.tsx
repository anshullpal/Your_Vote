// components/common/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { isAuthenticated, isAdmin, isVoter, logout } = useAuth();

  // If still loading, return null or a simple placeholder
  if (!isAuthenticated && !isAdmin && !isVoter) {
    return null; 
  }

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-bold hover:text-indigo-400">
          Voting App
        </Link>
        
        <nav className="flex items-center space-x-4">
          {isAuthenticated && (
            <>
              {isAdmin && (
                <>
                  <Link href="/admin/dashboard" className="hover:text-indigo-400">Dashboard</Link>
                  <Link href="/admin/candidates" className="hover:text-indigo-400">Manage Candidates</Link>
                </>
              )}
              {isVoter && (
                <>
                  <Link href="/voter" className="hover:text-indigo-400">Vote</Link>
                  <Link href="/user/profile" className="hover:text-indigo-400">Profile</Link>
                </>
              )}
              
              <button 
                onClick={logout} 
                className="bg-red-600 hover:bg-red-700 py-1 px-3 rounded text-sm font-medium transition duration-150"
              >
                Logout
              </button>
            </>
          )}
          
          {!isAuthenticated && (
            <>
              <Link href="/login" className="hover:text-indigo-400">Login</Link>
              <Link href="/signup" className="hover:text-indigo-400">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;