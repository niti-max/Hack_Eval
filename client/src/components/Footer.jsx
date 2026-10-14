import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
            <Trophy className="text-indigo-600 w-4 h-4" />
          </div>
          <span className="text-sm font-black tracking-tighter text-slate-900">
            Hack<span className="text-indigo-600">Eval</span>
          </span>
          <span className="text-slate-400 text-sm ml-2">© 2024. All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-8">
          <Link to="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</Link>
          <Link to="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</Link>
          <Link to="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Contact Us</Link>
        </div>

        <div className="flex items-center space-x-4">
          <a href="#" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all">
            <Github className="w-4 h-4" />
          </a>
          <a href="#" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
