'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomeRedirector = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        if (user.role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/voter');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-xl text-gray-700">
        Checking authentication status...
      </p>
    </div>
  );
};

export default HomeRedirector;
