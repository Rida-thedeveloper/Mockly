import React from 'react';
import { BarChart2, TrendingUp, Award, Calendar, Database, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ProgressPage({ setCurrentPage }) {
  // Demo progress trajectory data (structured cleanly for easy DB replacement later)
  const progressData = [
    { label: "Interview 1", score: 72, date: "Jul 20", role: "Data Analyst" },
    { label: "Interview 2", score: 75, date: "Jul 28", role: "AI/ML Engineer" },
    { label: "Interview 3", score: 81, date: "Aug 12", role: "Frontend Developer" },
    { label: "Interview 4", score: 84, date: "Aug 18", role: "Software Engineer" }
  ];

  const maxScore = 100;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold">
          ANALYTICS & TRENDS
        </div>
        <h1 className="text-3xl font-extrabold text-white">Interview Progress</h1>
        <p className="text-sm text-slate-400">
          Track your overall performance trajectory across consecutive mock interviews.
        </p>
      </div>

      {/* Progress Chart Container */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Score Improvement Trajectory</span>
            </h2>
            <p className="text-xs text-slate-400">
              Demonstrates score growth over 4 recent interview sessions.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>DB Sync Ready Data Format</span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-4 gap-4 sm:gap-8 items-end h-64 border-b border-slate-800 pb-4 px-4">
            {progressData.map((item, idx) => {
              const heightPercent = (item.score / maxScore) * 100;
              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  
                  {/* Hover score tooltip */}
                  <div className="mb-2 opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="bg-indigo-600 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                      {item.score}
                    </span>
                  </div>

                  {/* Bar */}
                  <div 
                    className="w-full max-w-[60px] bg-gradient-to-t from-indigo-700 via-indigo-500 to-violet-400 rounded-t-xl transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-indigo-500/20"
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* Label & Date */}
                  <div className="mt-3 text-center space-y-0.5">
                    <p className="text-xs font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-slate-400">{item.date}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Chart Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {progressData.map((item, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium">{item.label}</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{item.role}</span>
                  <span className="font-mono text-indigo-400 font-bold">{item.score}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Database Integration Notice Box */}
        <div className="bg-indigo-950/40 border border-indigo-800/40 p-5 rounded-2xl flex items-start space-x-3 text-xs text-indigo-300">
          <Database className="w-5 h-5 shrink-0 text-indigo-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-indigo-200">Database Replacement Ready</p>
            <p className="text-indigo-300/80 leading-relaxed">
              This chart uses demo data array (<code className="bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800 text-indigo-200">progressData</code>). Later when SQLite/PostgreSQL is connected, replace this array with FastAPI <code className="bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800 text-indigo-200">GET /api/progress</code> responses.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
