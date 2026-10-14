import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import JudgeDashboard from './JudgeDashboard';
import { PageLoader } from '../components/Loader';

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Artificial delay or actual data fetching
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><PageLoader /></div>;

  // Route to specific view based on role
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'judge':
      return <JudgeDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-black text-slate-900">Access Denied</h1>
            <p className="text-slate-500">Please login with an authorized account.</p>
          </div>
        </div>
      );
  }
};

export default UnifiedDashboard;
