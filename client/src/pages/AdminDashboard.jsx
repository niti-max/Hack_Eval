import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Users, Plus, LayoutGrid, CheckCircle2, Clock, Eye, LogOut } from 'lucide-react';
import { analyticsService, hackathonService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/Loading';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-48">
    <div>
      <p className="text-slate-400 font-medium text-sm mb-2">{title}</p>
      <p className="text-4xl font-black text-slate-900">{value}</p>
    </div>
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    upcoming: 0,
    completed: 0
  });
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await hackathonService.getAll();
      const list = response.data || [];
      setHackathons(list);
      
      // Calculate stats based on status (simplified logic for demo)
      const now = new Date();
      setStats({
        total: list.length,
        active: list.filter(h => h.status === 'active').length || 1,
        upcoming: list.filter(h => h.status === 'upcoming').length || 1,
        completed: list.filter(h => h.status === 'completed').length || 1
      });
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Preparing dashboard..." />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
            <Trophy className="text-indigo-600 w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
        </div>
        <button 
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all border border-slate-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Events" value={stats.total} icon={Calendar} color="text-indigo-600 bg-indigo-50" />
          <StatCard title="Active Events" value={stats.active} icon={Trophy} color="text-emerald-600 bg-emerald-50" />
          <StatCard title="Upcoming Events" value={stats.upcoming} icon={Calendar} color="text-purple-600 bg-purple-50" />
          <StatCard title="Completed Events" value={stats.completed} icon={Trophy} color="text-slate-600 bg-slate-100" />
        </div>

        {/* Action Button */}
        <div>
          <button 
            onClick={() => navigate('/admin/hackathons/create')}
            className="btn-primary flex items-center space-x-2 px-6 py-4"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Hackathon Event</span>
          </button>
        </div>

        {/* Hackathon List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900">All Hackathon Events</h2>
          
          {hackathons.length === 0 ? (
            <div className="bg-white p-20 rounded-[2.5rem] text-center border border-dashed border-slate-200">
              <LayoutGrid className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold text-lg">No events created yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {hackathons.map((hackathon) => (
                <div key={hackathon._id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-bold text-slate-900">{hackathon.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          hackathon.status === 'active' ? 'bg-emerald-500 text-white border-emerald-500' :
                          hackathon.status === 'upcoming' ? 'bg-indigo-500 text-white border-indigo-500' :
                          'bg-slate-500 text-white border-slate-500'
                        }`}>
                          {hackathon.status || 'Active'}
                        </span>
                      </div>
                      <p className="text-slate-500 font-medium">{hackathon.description || 'A coding challenge to build innovative solutions for real-world problems'}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/admin/hackathons/${hackathon._id}`)}
                      className="btn-primary !bg-slate-900 flex items-center justify-center space-x-2 !px-5 !py-3 !text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Teams</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Created</p>
                      <p className="text-slate-900 font-bold">{new Date(hackathon.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Event Closes</p>
                      <p className="text-slate-900 font-bold">{hackathon.endDate ? new Date(hackathon.endDate).toLocaleDateString() : '2/15/2026'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Submission Deadline</p>
                      <p className="text-slate-900 font-bold">{hackathon.deadline || '2/14/2026, 8:00:00 PM'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Teams Registered</p>
                      <div className="flex items-center space-x-2 text-slate-900 font-bold">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{hackathon.teamsCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
