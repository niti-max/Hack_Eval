import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Users } from 'lucide-react';
import { teamService, hackathonService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PageLoader, ButtonLoader } from '../components/Loader';
import { Alert } from '../components/Alert';

const TeamMemberForm = ({ title, data, index, onChange, isLeader = false }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
    <div className="flex items-center space-x-3 mb-2">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLeader ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
        <User className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name *</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          className="input-field px-5"
          placeholder="Enter full name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email *</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange(index, 'email', e.target.value)}
          className="input-field px-5"
          placeholder="student@university.edu"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Roll Number *</label>
        <input
          type="text"
          value={data.rollNumber}
          onChange={(e) => onChange(index, 'rollNumber', e.target.value)}
          className="input-field px-5"
          placeholder="e.g., CS2021001"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Phone Number *</label>
        <input
          type="text"
          value={data.phone}
          onChange={(e) => onChange(index, 'phone', e.target.value)}
          className="input-field px-5"
          placeholder="+1234567890"
          required
        />
      </div>
    </div>
  </div>
);

const TeamRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        setLoading(true);
        const res = await hackathonService.getById(id);
        const event = res.data;
        setHackathon(event);
        
        // Initialize members array based on maxTeamSize
        const size = event.maxTeamSize || 4;
        const initialMembers = Array.from({ length: size }, (_, i) => ({
          name: i === 0 ? (user?.name || '') : '',
          email: i === 0 ? (user?.email || '') : '',
          rollNumber: '',
          phone: ''
        }));
        setMembers(initialMembers);
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    loadEventData();
  }, [id, user]);

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await teamService.create({
        hackathonId: id,
        teamName,
        memberDetails: members
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check all details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><PageLoader /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-black text-slate-900 mb-1">Register Team</h1>
          <p className="text-slate-500 font-medium text-lg">Event: <span className="text-indigo-600">{hackathon?.title}</span></p>
        </div>

        {error && <Alert type="error" message={error} className="mb-6" onClose={() => setError('')} />}

        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Team Formation</h2>
              <p className="text-slate-500 font-medium text-sm">Provide details for all <span className="text-indigo-600 font-black">{hackathon?.maxTeamSize} members</span></p>
            </div>
            <div className="bg-indigo-50 px-4 py-2 rounded-xl flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-600 font-black text-sm uppercase tracking-widest">{hackathon?.maxTeamSize} Slots</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="max-w-md">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Team Name *</label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="input-field px-5"
                placeholder="Enter your team name"
              />
            </div>

            <div className="space-y-8">
              {members.map((member, idx) => (
                <TeamMemberForm 
                  key={idx}
                  title={idx === 0 ? "Team Leader (You)" : `Team Member ${idx + 1}`} 
                  data={member} 
                  index={idx} 
                  onChange={handleMemberChange} 
                  isLeader={idx === 0}
                />
              ))}
            </div>

            <div className="flex items-center space-x-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-grow py-5 shadow-xl shadow-indigo-100"
              >
                {submitting ? <ButtonLoader text="Registering Team" /> : 'Confirm Registration'}
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
      </div>
    </div>
  );
};

export default TeamRegistration;
