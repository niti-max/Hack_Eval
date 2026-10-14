import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

const JudgeFeedbackCard = ({ judgeName, date, totalScore, criteriaScores, comments }) => (
  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden group hover:border-indigo-100 transition-all">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-1">
        <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{judgeName}</h3>
        <p className="text-slate-400 text-xs font-medium flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Evaluated on {new Date(date).toLocaleString()}
        </p>
      </div>
      <div className="text-right">
        <p className="text-3xl font-black text-indigo-600 leading-none">{totalScore}/100</p>
        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase mt-2">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Approved
        </span>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {criteriaScores.map((c, i) => (
        <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{c.name}</p>
          <p className="text-slate-900 font-black text-lg">{c.score}<span className="text-xs text-slate-400 font-medium">/{c.max}</span></p>
        </div>
      ))}
    </div>

    <div className="pt-6 border-t border-slate-50">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Comments:</p>
      <p className="text-slate-600 font-medium leading-relaxed italic">
        "{comments}"
      </p>
    </div>
  </div>
);

const JudgeFeedbackList = ({ evaluations }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Judge Evaluations</h2>
        <p className="text-slate-500 font-medium">Detailed feedback from each judge</p>
      </div>
      
      <div className="space-y-6">
        {evaluations.map((evalData, idx) => (
          <JudgeFeedbackCard key={idx} {...evalData} />
        ))}
      </div>
    </div>
  );
};

export default JudgeFeedbackList;
