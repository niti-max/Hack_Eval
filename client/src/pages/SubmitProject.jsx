import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Clock, CheckCircle2 } from 'lucide-react';
import { submissionService, hackathonService, teamService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/Alert';
import { ButtonLoader } from '../components/Loader';

const SubmitProject = () => {
  const { hackathonId, teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hackathon, setHackathon] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null
  });

  useEffect(() => {
    Promise.all([
      hackathonService.getById(hackathonId),
      teamService.getById(teamId)
    ]).then(([hackRes, teamRes]) => {
      setHackathon(hackRes.data);
      setTeam(teamRes.data);
    }).catch(err => {
      setError('Technical Error: Unable to retrieve your team data. Please ensure you are registered for this event.');
    });
  }, [hackathonId, teamId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) return setError('Please select a file to upload');
    
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('hackathonId', hackathonId);
      data.append('teamId', teamId);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('file', formData.file);

      await submissionService.create(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit project. Please ensure the file is under 50MB.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-black text-slate-900 mb-1">Submit Project</h1>
          <p className="text-slate-500 font-medium text-lg">{hackathon?.title}</p>
        </div>

        {/* Time Remaining Banner */}
        <div className="bg-blue-50 border border-blue-100 p-8 rounded-[2rem] flex items-start space-x-5">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-blue-100">
            <Clock className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-blue-900 font-black text-sm uppercase tracking-widest mb-1">Submission Status</h3>
            <p className="text-blue-600 font-medium">Please ensure all project details are final before submitting.</p>
          </div>
        </div>

        {/* Submission Form */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-10">
          {error && <Alert type="error" message={error} className="mb-6" onClose={() => setError('')} />}
          
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Project Details</h2>
            <p className="text-slate-500 font-medium text-sm">Upload your presentation and provide project context</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field px-5"
                  placeholder="Enter your project title"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Project Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field px-5 resize-none"
                  placeholder="Briefly describe your project..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Upload Presentation (PPT/PDF) *</label>
                <div className="relative border-2 border-dashed border-slate-100 rounded-[2rem] p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  />
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Upload className="text-indigo-600 w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-lg">
                        {formData.file ? formData.file.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-slate-500 text-sm font-medium">PPT, PPTX, or PDF (Max 50MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-4 border-t border-slate-50">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-grow py-5 shadow-xl shadow-indigo-100"
              >
                {loading ? <ButtonLoader text="Submitting Project" /> : 'Final Submission'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary px-10 py-5"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Team Info Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-indigo-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Registering as</p>
              <p className="text-slate-900 font-bold">{team?.teamName || 'Your Team'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Team Leader</p>
            <p className="text-slate-900 font-bold">{team?.leader?.name || user?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitProject;
