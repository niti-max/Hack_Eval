import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Trophy, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/Alert';
import { ButtonLoader } from '../components/Loader';

const Login = () => {
  const { role } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-20">
      <div className="max-w-md w-full">
        {/* Branding */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
              <Trophy className="text-indigo-600 w-7 h-7" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-slate-900">
              Hack<span className="text-indigo-600">Eval</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900">Login to Continue</h1>
          <p className="text-slate-500 font-medium mt-2">Please enter your authorized credentials</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          {error && <Alert type="error" message={error} className="mb-6" onClose={() => setError('')} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field px-5 focus:ring-slate-200"
                    placeholder="e.g. user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field px-5 focus:ring-slate-200"
                    placeholder="********"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-black bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-100"
            >
              {loading ? <ButtonLoader text="Authenticating" /> : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <p className="text-slate-500 text-sm font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                  Register Now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
