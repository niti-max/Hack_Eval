import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, AlertCircle, CheckCircle2, User, Users, X, ExternalLink } from 'lucide-react';
import { teamService, hackathonService, evaluationService } from '../services/api';
import { PageLoader, ButtonLoader } from '../components/Loader';
import { Alert } from '../components/Alert';

const EvaluationCriteriaCard = ({ criteria = [] }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Evaluation Criteria</h2>
      <p className="text-slate-500 font-medium text-sm">Use these criteria to evaluate each team's submission</p>
    </div>
    <div className="flex flex-wrap gap-4">
      {criteria.length === 0 ? (
        ['Creativity', 'Technical', 'Impact'].map((name, i) => (
          <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[150px]">
            <p className="text-slate-900 font-bold text-xs mb-1">{name}</p>
            <p className="text-slate-400 text-[10px] font-black">Max: 100 points</p>
          </div>
        ))
      ) : (
        criteria.map((c, i) => (
          <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[150px]">
            <p className="text-slate-900 font-bold text-xs mb-1">{c.name}</p>
            <p className="text-slate-400 text-[10px] font-black">Max: {c.maxScore} points</p>
          </div>
        ))
      )}
    </div>
  </div>
);

const EvaluationModal = ({ team, criteria = [], onClose, onSubmit, submitting }) => {
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState('');

  useEffect(() => {
    const initialScores = {};
    criteria.forEach(c => initialScores[c._id || c.name] = 0);
    setScores(initialScores);
  }, [criteria]);

  const total = Object.values(scores).reduce((a, b) => Number(a) + Number(b), 0);
  const maxPossible = criteria.reduce((a, b) => a + (b.maxScore || 100), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Evaluate: {team.teamName}</h2>
            <p className="text-slate-500 font-medium text-sm">Provide scores for each criterion</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {criteria.map((c) => (
              <div key={c._id || c.name}>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-sm font-bold text-slate-700">{c.name}</label>
                  <span className="text-xs font-black text-slate-400">Max: {c.maxScore}</span>
                </div>
                <input
                  type="number"
                  max={c.maxScore}
                  min={0}
                  value={scores[c._id || c.name] || 0}
                  onChange={(e) => setScores({ ...scores, [c._id || c.name]: e.target.value })}
                  className="input-field"
                  placeholder={`0-${c.maxScore}`}
                />
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 p-6 rounded-2xl flex items-center justify-between">
            <span className="text-lg font-black text-slate-900">Total Score:</span>
            <span className="text-3xl font-black text-indigo-600">{total}/{maxPossible}</span>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Overall Feedback</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="input-field resize-none"
              rows={4}
              placeholder="What did the team do well? Where can they improve?"
            />
          </div>
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100">
          <button
            onClick={() => onSubmit({ 
              scores: Object.keys(scores).map(key => ({ 
                criteriaName: key, 
                score: scores[key] 
              })), 
              comments 
            })}
            disabled={submitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
          >
            {submitting ? <ButtonLoader text="Submitting Scores" /> : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Submit Evaluation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const JudgeEvaluationList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [submittedTeams, setSubmittedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [error, setError] = useState('');

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
      // Filter only teams that have a submission
      setSubmittedTeams(teamsRes.data.filter(t => t.submission));
    } catch (err) {
      console.error('Failed to load evaluation list', err);
      setError('Failed to load submitted teams. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (evaluationData) => {
    try {
      setSubmitting(true);
      await evaluationService.create({
        teamId: selectedTeam._id,
        hackathonId: id,
        criteriaScores: evaluationData.scores,
        comments: evaluationData.comments
      });
      setSelectedTeam(null);
      fetchData(); // Refresh to show updated status if any
    } catch (err) {
      setError('Failed to save evaluation. Please check your network.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><PageLoader /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Expert Review Panel</h1>
          <p className="text-slate-500 font-medium">{hackathon?.title}</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <EvaluationCriteriaCard criteria={hackathon?.evaluationCriteria} />

        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center space-x-3">
            <span>Submitted Projects</span>
            <span className="bg-white px-3 py-1 rounded-full text-sm border border-slate-200">{submittedTeams.length}</span>
          </h2>
          
          <div className="space-y-4">
            {submittedTeams.length === 0 ? (
              <div className="bg-white p-20 rounded-[2.5rem] text-center border border-dashed border-slate-200">
                <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-lg">No projects submitted yet.</p>
                <p className="text-slate-400 text-sm">Teams will appear here once they upload their presentations.</p>
              </div>
            ) : (
              submittedTeams.map((team) => (
                <div key={team._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="p-8 space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-xl font-bold text-slate-900">{team.teamName}</h3>
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-white uppercase tracking-widest">
                            Ready for Review
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                          <div className="flex items-center space-x-1">
                            <User className="w-3.5 h-3.5" />
                            <span>{team.leader?.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{team.members?.length || 1} Members</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center shadow-sm">
                          <FileText className="text-indigo-600 w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Presentation File</p>
                          <a 
                            href={`http://localhost:5000${team.submission?.files?.[0]?.url || team.submission?.url}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors flex items-center space-x-1 group"
                          >
                            <span>{team.submission?.files?.[0]?.filename || 'View Project File'}</span>
                            <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-400" />
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center shadow-sm">
                          <Clock className="text-slate-400 w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Submitted On</p>
                          <p className="text-sm font-bold text-slate-900">{new Date(team.submission?.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {team.userEvaluation ? (
                    <div className="flex items-center justify-between bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Evaluation Status</p>
                          <p className="text-emerald-900 font-bold">Review Completed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Score Given</p>
                        <p className="text-2xl font-black text-emerald-600">{team.userEvaluation.totalScore}/100</p>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setSelectedTeam(team)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl transition-all active:scale-[0.99] shadow-lg shadow-slate-100"
                    >
                      Start Evaluation
                    </button>
                  )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedTeam && (
        <EvaluationModal 
          team={selectedTeam} 
          criteria={hackathon?.evaluationCriteria}
          onClose={() => setSelectedTeam(null)} 
          onSubmit={handleEvaluate}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default JudgeEvaluationList;
