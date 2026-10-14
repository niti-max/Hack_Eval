import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, MessageSquare, BarChart3, Target, Award } from 'lucide-react';
import { evaluationService, hackathonService, teamService } from '../services/api';
import { PageLoader } from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const ScoreCard = ({ label, score, max = 100, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-900">{score}<span className="text-sm text-slate-300 font-bold">/{max}</span></p>
    </div>
  </div>
);

const ResultsAnalytics = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const hackRes = await hackathonService.getById(id);
      setHackathon(hackRes.data);

      // Find user's team for this hackathon
      const teamsRes = await teamService.getAll(id);
      const userTeam = teamsRes.data.find(t => 
        t.leader === user.id || t.leader?._id === user.id || t.members?.some(m => m === user.id || m._id === user.id)
      );

      if (userTeam) {
        setTeam(userTeam);
        // Get evaluations for this team
        const evalRes = await evaluationService.getTeamEvaluations(userTeam._id);
        // For simplicity, take the first evaluation (or average them in future)
        setEvaluation(evalRes.data[0]);
      }
    } catch (err) {
      console.error('Failed to load results', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><PageLoader /></div>;

  if (!evaluation) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 text-center max-w-lg">
          <Target className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Evaluation in Progress</h2>
          <p className="text-slate-500 font-medium mb-8">The expert panel is currently reviewing your project. Check back soon for your performance analysis!</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary w-full py-4">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <header>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Event Performance</span>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Project Analysis</h1>
              </div>
              <p className="text-slate-500 font-medium text-lg">{hackathon?.title} • Team {team?.teamName}</p>
            </div>
            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl shadow-slate-200 min-w-[200px] text-center border-b-4 border-amber-500">
              <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Score</p>
              <p className="text-5xl font-black">{evaluation.totalScore}<span className="text-xl opacity-30">/100</span></p>
            </div>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScoreCard label="Project Status" score="Graded" max="Expert" icon={Award} color="bg-emerald-50 text-emerald-600" />
          <ScoreCard label="Evaluator" score={evaluation.judge?.name.split(' ')[0]} max="Panel" icon={Star} color="bg-indigo-50 text-indigo-600" />
          <ScoreCard label="Date" score={new Date(evaluation.evaluatedAt).toLocaleDateString()} max="2026" icon={BarChart3} color="bg-purple-50 text-purple-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Criteria Breakdown */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-3">
              <Target className="w-6 h-6 text-indigo-600" />
              <span>Criteria Breakdown</span>
            </h2>
            <div className="space-y-6">
              {evaluation.scores?.map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-700">{s.criteriaName}</span>
                    <span className="text-sm font-black text-indigo-600">{s.score}/100</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${s.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expert Feedback */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-purple-600" />
              <span>Expert Feedback</span>
            </h2>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative">
              <span className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center text-slate-300 text-2xl font-serif">"</span>
              <p className="text-slate-600 font-medium italic leading-relaxed">
                {evaluation.feedback || "The evaluator found your project well-executed and professional. Great attention to detail in the technical implementation."}
              </p>
            </div>
            <div className="flex items-center space-x-4 p-4 border border-indigo-100 bg-indigo-50/30 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Trophy className="text-amber-500 w-5 h-5" />
              </div>
              <p className="text-xs text-indigo-900 font-medium">
                Keep up the great work! Your team's performance has been recorded in the event archives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsAnalytics;
