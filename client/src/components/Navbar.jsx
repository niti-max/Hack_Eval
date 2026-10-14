import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigationLinks = () => {
    if (!isAuthenticated) return [];

    const baseLinks = [
      { label: 'Hackathons', path: '/hackathons' },
    ];

    if (user?.role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard' },
        ...baseLinks
      ];
    } else if (user?.role === 'judge') {
      return [
        { label: 'Evaluations', path: '/judge/evaluations' },
        ...baseLinks
      ];
    } else {
      return [
        { label: 'My Teams', path: '/student/teams' },
        ...baseLinks
      ];
    }
  };

  const navLinks = getNavigationLinks();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
            <Trophy className="text-indigo-600 w-5 h-5" />
          </div>
          <span className="text-lg font-black tracking-tighter text-slate-900">
            Hack<span className="text-indigo-600">Eval</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-bold transition-all
                ${location.pathname === link.path ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {link.label}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4 pl-6 border-l border-slate-200">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.role}</span>
                <span className="text-sm font-bold text-slate-900">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all border border-slate-100"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900">Sign In</Link>
              <Link to="/register" className="btn-primary !py-2 !px-4 !text-xs">Join Now</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-50 text-slate-600"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-2 space-y-2 border-t border-slate-100 mt-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="pt-2 grid grid-cols-2 gap-3 px-4">
              <Link to="/login" className="py-2 text-center text-sm font-bold text-slate-600 bg-slate-50 rounded-xl">Login</Link>
              <Link to="/register" className="py-2 text-center text-sm font-bold text-white bg-indigo-600 rounded-xl">Join</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
