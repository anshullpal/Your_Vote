'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Using relative path for robustness
import LoadingSpinner from '../components/common/LoadingSpinner'; // Import spinner

const HomeRedirector = () => {
  // Destructure auth state
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only run redirection logic once authentication status is known
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect based on the user's role: 'admin' or 'voter'
        if (user.role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/voter');
        }
      } else {
        // Redirect to login if not authenticated
        router.replace('/login');
      }
    }
  }, [isAuthenticated, user, isLoading, router]); // Dependencies are complete

  // Display a loading message while checking auth status
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-xl text-gray-700">Checking authentication status...</p>
    </div>
  );
};

export default HomeRedirector;
