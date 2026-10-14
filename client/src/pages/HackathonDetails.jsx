import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, FileCheck, AlertCircle, CheckCircle2, Clock, Download, ExternalLink } from 'lucide-react';
import { hackathonService, teamService } from '../services/api';
import { Loading } from '../components/Loading';

const HackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hackRes, teamsRes] = await Promise.all([
        hackathonService.getById(id),
        teamService.getAll(id)
      ]);
      setHackathon(hackRes.data);
      setTeams(teamsRes.data || []);
    } catch (err) {
      console.error('Failed to load hackathon details', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading hackathon data..." />;
  if (!hackathon) return <div className="p-20 text-center">Hackathon not found.</div>;

  const stats = [
    { label: 'Total Teams', value: teams.length, icon: Users, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Submissions', value: teams.filter(t => t.submission).length, icon: FileCheck, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Late Submissions', value: teams.filter(t => t.submission?.isLate).length, icon: AlertCircle, color: 'text-orange-600 bg-orange-50' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div>
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <h1 className="text-4xl font-black text-slate-900 mb-2">{hackathon.title}</h1>
          <p className="text-slate-500 font-medium text-lg">{hackathon.description}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-44">
                <div>
                  <p className="text-slate-400 font-medium text-sm mb-2">{stat.label}</p>
                  <p className="text-4xl font-black text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Registered Teams Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Registered Teams</h2>
            <p className="text-slate-500 font-medium">List of all teams participating in this hackathon</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Team Name</th>
                  <th className="px-8 py-5">Leader</th>
                  <th className="px-8 py-5">Members</th>
                  <th className="px-8 py-5">Submission</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">No teams registered yet.</td>
                  </tr>
                ) : (
                  teams.map((team) => (
                    <tr key={team._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-900">{team.teamName}</td>
                      <td className="px-8 py-6 text-slate-600 font-medium">{team.leader?.name}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2 text-slate-600 font-bold">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>{team.members?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {team.submission ? (
                          <div className="space-y-1">
                            <a 
                              href={team.submission.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 font-bold text-sm flex items-center space-x-2 hover:underline"
                            >
                              <Download className="w-4 h-4" />
                              <span className="line-clamp-1">{team.submission.fileName || `${team.teamName}_Presentation.pdf`}</span>
                            </a>
                            <p className="text-[10px] text-slate-400 font-medium flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(team.submission.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm font-medium">Not Submitted</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          !team.submission ? 'bg-slate-100 text-slate-500' :
                          team.submission.isLate ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                        }`}>
                          {!team.submission ? 'Pending' : team.submission.isLate ? (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              <span>Late Submission</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>On Time</span>
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetails;
