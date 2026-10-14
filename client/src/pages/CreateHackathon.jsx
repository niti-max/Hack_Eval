import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, ShieldCheck } from 'lucide-react';
import { hackathonService, authService } from '../services/api';
import { Alert } from '../components/Alert';
import { ButtonLoader } from '../components/Loader';

const CreateHackathon = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableJudges, setAvailableJudges] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    regStartDate: '',
    regEndDate: '',
    eventStartDate: '',
    eventEndDate: '',
    theme: '',
    prize: '',
    location: 'Online',
    mode: 'online',
    maxTeamSize: 4,
    selectedJudges: []
  });

  useEffect(() => {
    const fetchEvaluators = async () => {
      try {
        const response = await authService.getUsers('judge');
        setAvailableJudges(response.data || []);
      } catch (err) {
        console.error('Failed to fetch evaluators', err);
      }
    };
    fetchEvaluators();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Dates are sent as YYYY-MM-DD which will be treated as 00:00:00 UTC or converted by Mongoose
      const submissionData = {
        title: formData.title,
        description: formData.description,
        registrationStartDate: formData.regStartDate,
        registrationEndDate: formData.regEndDate,
        startDate: formData.eventStartDate,
        endDate: formData.eventEndDate,
        submissionDeadline: formData.eventEndDate, // Default deadline to event end
        theme: formData.theme,
        prize: formData.prize,
        location: formData.location,
        mode: formData.mode,
        maxTeamSize: parseInt(formData.maxTeamSize),
        judges: formData.selectedJudges
      };

      await hackathonService.create(submissionData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create hackathon. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'judges') {
      const updatedJudges = checked 
        ? [...formData.selectedJudges, value]
        : formData.selectedJudges.filter(id => id !== value);
      setFormData({ ...formData, selectedJudges: updatedJudges });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Setup New Hackathon</h1>
        <p className="text-slate-500 font-medium mb-10">Configure your event timelines and participation rules</p>

        {error && <Alert type="error" message={error} className="mb-8" onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-12">
            
            {/* Section 1: Basic Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <span className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mr-3 text-sm font-black">01</span>
                Event Identity
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field px-5"
                  placeholder="Hackathon Title (e.g. Innovate 2026)"
                />
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field px-5 resize-none"
                  placeholder="Full description of the challenge..."
                />
              </div>
            </div>

            {/* Section 2: Configuration */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <span className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mr-3 text-sm font-black">02</span>
                Participation & Panel
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>Max Team Size *</span>
                    </div>
                  </label>
                  <select 
                    name="maxTeamSize" 
                    value={formData.maxTeamSize} 
                    onChange={handleChange}
                    className="input-field px-5 appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Student' : 'Students'} per team</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                      <span>Expert Panel</span>
                    </div>
                  </label>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
                    {availableJudges.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4 font-medium italic">No evaluators registered yet</p>
                    ) : (
                      availableJudges.map(judge => (
                        <label key={judge._id} className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-colors cursor-pointer group">
                          <input 
                            type="checkbox" 
                            name="judges" 
                            value={judge._id}
                            checked={formData.selectedJudges.includes(judge._id)}
                            onChange={handleChange}
                            className="w-5 h-5 text-indigo-600 rounded-lg border-slate-300 focus:ring-indigo-500 cursor-pointer" 
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{judge.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{judge.email}</span>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Timeline */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <span className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mr-3 text-sm font-black">03</span>
                Event Timelines
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Registration Window */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-l-4 border-indigo-500 pl-3">Registration Window</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1">Starts On</label>
                      <input type="date" name="regStartDate" required value={formData.regStartDate} onChange={handleChange} className="input-field px-5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1">Ends On</label>
                      <input type="date" name="regEndDate" required value={formData.regEndDate} onChange={handleChange} className="input-field px-5" />
                    </div>
                  </div>
                </div>

                {/* Event Window */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Hackathon Event</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1">Start Date</label>
                      <input type="date" name="eventStartDate" required value={formData.eventStartDate} onChange={handleChange} className="input-field px-5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1">End Date</label>
                      <input type="date" name="eventEndDate" required value={formData.eventEndDate} onChange={handleChange} className="input-field px-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-6 border-t border-slate-50">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-grow py-5 shadow-xl shadow-indigo-100"
              >
                {loading ? <ButtonLoader text="Initializing Event" /> : 'Launch Hackathon'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary px-10 py-5"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHackathon;
