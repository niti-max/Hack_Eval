import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, ClipboardCheck, Clock, Eye, LogOut, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { hackathonService, analyticsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/Loader';

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

const JudgeDashboard = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch only hackathons where this user is assigned as a judge
      const response = await hackathonService.getAll();
      const assigned = response.data.filter(h => 
        h.judges?.some(j => j === user.id || j._id === user.id)
      );
      setHackathons(assigned);
    } catch (err) {
      console.error('Failed to load judge dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><PageLoader /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
            <Trophy className="text-indigo-600 w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Judge Dashboard</h1>
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
        {/* Welcome Banner */}
        <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[2rem] relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-black text-slate-900 mb-1">Welcome, {user?.name.split(' ')[0]}!</h2>
            <p className="text-indigo-600 font-medium">Review team submissions and provide criteria-based evaluations</p>
          </div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Assigned Events" value={hackathons.length} icon={Trophy} color="text-indigo-600 bg-indigo-50" />
          <StatCard title="Active Status" value="Online" icon={CheckCircle2} color="text-emerald-600 bg-emerald-50" />
          <StatCard title="Role" value="Expert Panel" icon={ClipboardCheck} color="text-blue-600 bg-blue-50" />
        </div>

        {/* Assigned Hackathons */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900">Assigned Hackathons</h2>
          
          <div className="space-y-4">
            {hackathons.length === 0 ? (
              <div className="bg-white p-20 rounded-[2.5rem] text-center border border-dashed border-slate-200">
                <LayoutGrid className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-lg">No hackathons assigned to you yet.</p>
                <p className="text-slate-400 text-sm">You will see events here once an Admin adds you to an expert panel.</p>
              </div>
            ) : (
              hackathons.map((hackathon) => (
                <div key={hackathon._id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-bold text-slate-900">{hackathon.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          hackathon.status === 'active' || !hackathon.status ? 'bg-emerald-500 text-white border-emerald-500' :
                          'bg-slate-500 text-white border-slate-500'
                        }`}>
                          {hackathon.status || 'Active'}
                        </span>
                      </div>
                      <p className="text-slate-500 font-medium">{hackathon.description}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/judge/hackathons/${hackathon._id}/evaluate`)}
                      className="btn-primary !bg-slate-900 flex items-center justify-center space-x-2 !px-6 !py-3 !text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Evaluate Teams</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Ends On</p>
                      <p className="text-slate-900 font-bold">{new Date(hackathon.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Teams Registered</p>
                      <div className="flex items-center space-x-2 text-slate-900 font-bold">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{hackathon.teamsCount || 0} Teams</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Max Team Size</p>
                      <p className="text-indigo-600 font-black">{hackathon.maxTeamSize} Members</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JudgeDashboard;
