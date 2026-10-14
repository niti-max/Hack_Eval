import React from 'react';
import { Loader } from 'lucide-react';

export const Loading = ({ message = 'Syncing with the grid...' }) => (
  <div className="flex justify-center items-center min-h-screen bg-[#020617] relative isolate overflow-hidden">
    <div className="mesh-glow"></div>
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(99,102,241,0.2)]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <p className="text-indigo-300 font-bold tracking-widest uppercase text-xs animate-pulse">{message}</p>
    </div>
  </div>
);

export const LoadingSpinner = ({ size = 24, className = '' }) => (
  <div className={`relative ${className}`} style={{ width: size, height: size }}>
    <div className="absolute inset-0 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
  </div>
);
