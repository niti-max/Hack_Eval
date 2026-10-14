import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, BarChart3, GraduationCap, Star, Settings, ArrowRight, Calendar } from 'lucide-react';
import { hackathonService } from '../services/api';

const HackathonCard = ({ hackathon }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
        <Trophy className="text-indigo-600 w-6 h-6 group-hover:text-white" />
      </div>
      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-white uppercase tracking-widest">
        Active
      </span>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{hackathon.title}</h3>
    <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2">{hackathon.description}</p>
    
    <div className="space-y-3 mb-8">
      <div className="flex items-center text-slate-400 text-xs font-bold">
        <Calendar className="w-4 h-4 mr-2" />
        <span>Deadline: {new Date(hackathon.registrationDeadline || Date.now()).toLocaleDateString()}</span>
      </div>
    </div>

    <Link to="/register" className="w-full btn-primary !py-3 flex items-center justify-center space-x-2 text-sm">
      <span>Join Hackathon</span>
      <ArrowRight className="w-4 h-4" />
    </Link>
  </div>
);

const PortalCard = ({ title, description, icon: Icon, color, lightColor, path }) => (
  <Link to={path} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-80 relative overflow-hidden">
    <div className="relative z-10">
      <div className={`w-14 h-14 ${lightColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon className={`${color} w-7 h-7`} />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
    </div>
    
    <div className="relative z-10 flex items-center space-x-2 text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">
      <span>Enter Portal</span>
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </div>

    <div className={`absolute -right-10 -bottom-10 w-40 h-40 ${lightColor} opacity-20 rounded-full blur-3xl group-hover:opacity-40 transition-opacity`}></div>
  </Link>
);

const Home = () => {
  const [hackathons, setHackathons] = useState([]);

  useEffect(() => {
    hackathonService.getAll().then(res => setHackathons(res.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm mb-8 animate-bounce-slow">
            <Trophy className="text-amber-500 w-4 h-4" />
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Next Generation Hackathons</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
            Evaluating the <br />
            <span className="text-indigo-600">Future of Code.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            A comprehensive, criteria-based evaluation platform for hackathons. 
            Empowering students, evaluators, and administrators to build better together.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary px-10 py-5 text-lg">
              Get Started Today
            </Link>
            <Link to="/login" className="btn-secondary px-10 py-5 text-lg">
              Explore Platform
            </Link>
          </div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] -z-10"></div>
      </section>

      {/* Live Hackathons Section */}
      {hackathons.length > 0 && (
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">Live Hackathons</h2>
              <p className="text-slate-500 font-medium">Active competitions you can join right now</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hackathons.map(h => <HackathonCard key={h._id} hackathon={h} />)}
          </div>
        </section>
      )}

      {/* Portal Selection Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Choose Your Path</h2>
          <p className="text-slate-500 font-medium">Select your role to access your dedicated workspace</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PortalCard 
            title="Student Hub"
            description="Build teams, submit your innovations, and track your performance in real-time."
            icon={GraduationCap}
            color="text-indigo-600"
            lightColor="bg-indigo-50"
            path="/login/student"
          />
          <PortalCard 
            title="Evaluator Portal"
            description="Expert-led evaluation system with criteria-based scoring and detailed feedback tools."
            icon={Star}
            color="text-emerald-600"
            lightColor="bg-emerald-50"
            path="/login/judge"
          />
          <PortalCard 
            title="Admin Access"
            description="Full control over hackathons, user roles, system analytics, and event orchestration."
            icon={Settings}
            color="text-slate-900"
            lightColor="bg-slate-50"
            path="/login/admin"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
