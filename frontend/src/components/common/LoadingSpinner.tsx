// components/common/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) => {
  const sizeClass = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-6',
  }[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent text-indigo-600 ${sizeClass}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;