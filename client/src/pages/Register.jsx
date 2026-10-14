import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/Alert';
import { ButtonLoader } from '../components/Loader';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Join as a participant' },
    { id: 'judge', label: 'Evaluator', icon: ShieldCheck, desc: 'Join as an expert' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-20">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
              <Trophy className="text-indigo-600 w-7 h-7" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-slate-900">
              Hack<span className="text-indigo-600">Eval</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900">Create your account</h1>
          <p className="text-slate-500 font-medium mt-2">Join the innovation ecosystem today</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          {error && <Alert type="error" message={error} className="mb-6" onClose={() => setError('')} />}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 ml-1 text-center">I am joining as a...</label>
              <div className="grid grid-cols-2 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isActive = formData.role === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.id })}
                      className={`p-6 rounded-[2rem] border-2 transition-all text-center flex flex-col items-center group
                        ${isActive 
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100' 
                          : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors
                        ${isActive ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:text-slate-600'}`}>
                        <Icon size={24} />
                      </div>
                      <span className={`text-sm font-bold mb-1 ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {role.label}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                        {role.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field px-5"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field px-5"
                    placeholder="e.g. john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field px-5"
                    placeholder="Min. 8 characters"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-black bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-100"
            >
              {loading ? <ButtonLoader text="Creating Account" /> : (
                <>
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <p className="text-slate-500 text-sm font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
