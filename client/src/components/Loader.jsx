import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ size = 'md', color = 'text-indigo-600', className = '' }) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizes[size]} ${color} animate-spin`} />
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
    </div>
    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest animate-pulse">Initializing Portal...</p>
  </div>
);

export const ButtonLoader = ({ text = 'Processing' }) => (
  <div className="flex items-center justify-center space-x-2">
    <Loader2 className="w-4 h-4 animate-spin" />
    <span>{text}</span>
  </div>
);
