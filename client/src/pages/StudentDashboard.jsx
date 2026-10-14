import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Users, Upload, Eye, CheckCircle2, LayoutGrid, LogOut } from 'lucide-react';
import { hackathonService, teamService } from '../services/api';
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

const StudentDashboard = () => {
  const [hackathons, setHackathons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hackRes, teamsRes] = await Promise.all([
        hackathonService.getAll(),
        teamService.getAll()
      ]);
      setHackathons(hackRes.data || []);
      setTeams(teamsRes.data || []);
    } catch (err) {
      console.error('Failed to load student dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><PageLoader /></div>;

  const participations = teams.length;
  const availableEvents = hackathons.filter(h => h.status !== 'completed').length;
  const pendingSubmissions = teams.filter(t => !t.submission).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
            <Trophy className="text-indigo-600 w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Student Dashboard</h1>
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
            <p className="text-indigo-600 font-medium">Participate in hackathons, submit your projects, and view your results</p>
          </div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Available Events" value={availableEvents} icon={Calendar} color="text-indigo-600 bg-indigo-50" />
          <StatCard title="My Participations" value={participations} icon={Trophy} color="text-purple-600 bg-purple-50" />
          <StatCard title="Pending Submissions" value={pendingSubmissions} icon={Upload} color="text-orange-600 bg-orange-50" />
        </div>

        {/* Hackathons List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900">Available Hackathons</h2>
          
          <div className="space-y-4">
            {hackathons.length === 0 ? (
              <div className="bg-white p-20 rounded-[2.5rem] text-center border border-dashed border-slate-200">
                <LayoutGrid className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-lg">No active hackathons found at the moment.</p>
                <p className="text-slate-400 text-sm">Check back later for new opportunities!</p>
              </div>
            ) : (
              hackathons.map((hackathon) => {
                const userTeam = teams.find(t => 
                  (t.hackathon === hackathon._id || t.hackathon?._id === hackathon._id) && 
                  (t.leader === user.id || t.leader?._id === user.id || t.members?.some(m => m === user.id || m._id === user.id))
                );
                return (
                  <div key={hackathon._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-bold text-slate-900">{hackathon.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            hackathon.status === 'active' || !hackathon.status ? 'bg-emerald-500 text-white border-emerald-500' :
                            hackathon.status === 'upcoming' ? 'bg-indigo-500 text-white border-indigo-500' :
                            'bg-slate-500 text-white border-slate-500'
                          }`}>
                            {hackathon.status || 'Active'}
                          </span>
                        </div>
                        <p className="text-slate-500 font-medium">{hackathon.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Event Closes</p>
                        <p className="text-slate-900 font-bold">{new Date(hackathon.endDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Submission Deadline</p>
                        <p className="text-slate-900 font-bold">{new Date(hackathon.submissionDeadline || hackathon.deadline).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Status</p>
                        <p className="text-slate-900 font-bold capitalize">{hackathon.status || 'Active'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Team Size</p>
                        <div className="flex items-center space-x-2 text-slate-900 font-bold">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>{hackathon.maxTeamSize} Members</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center space-x-4">
                        {userTeam ? (
                          userTeam.userEvaluation ? (
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 font-bold text-sm">
                                <Award className="w-4 h-4" />
                                <span>Score: {userTeam.userEvaluation.totalScore}/100</span>
                              </div>
                              <button 
                                onClick={() => navigate(`/student/results/${hackathon._id}`)}
                                className="btn-primary !bg-slate-900 flex items-center justify-center space-x-2 !px-5 !py-2.5 !text-xs shadow-lg shadow-slate-200"
                              >
                                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                <span>Analysis Report</span>
                              </button>
                            </div>
                          ) : userTeam.submission ? (
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 font-bold text-sm">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Project Submitted</span>
                              </div>
                              <button 
                                onClick={() => navigate(`/student/submit/${hackathon._id}/${userTeam._id}`)}
                                className="text-slate-400 hover:text-slate-600 text-xs font-bold underline"
                              >
                                Edit Submission
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => navigate(`/student/submit/${hackathon._id}/${userTeam._id}`)}
                              className="btn-secondary !bg-white flex items-center justify-center space-x-2 !px-5 !py-3 !text-sm border-slate-200"
                            >
                              <Upload className="w-4 h-4 text-indigo-600" />
                              <span>Submit Project</span>
                            </button>
                          )
                        ) : (
                          <button 
                            onClick={() => navigate(`/student/register-team/${hackathon._id}`)}
                            className="btn-primary !bg-slate-900 flex items-center justify-center space-x-2 !px-6 !py-3 !text-sm shadow-xl shadow-slate-200"
                          >
                            <Users className="w-4 h-4 text-white" />
                            <span>Register Team</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
