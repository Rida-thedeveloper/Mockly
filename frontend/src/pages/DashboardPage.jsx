import React from 'react';
import { PlusCircle, Award, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, Calendar, Code, Clock } from 'lucide-react';

export default function DashboardPage({ setCurrentPage, user }) {
  // Demo stat values (easily replaceable with backend API / DB response)
  const stats = [
    { label: "Interviews Completed", value: "14", icon: CheckCircle2, color: "text-indigo-400" },
    { label: "Average Score", value: "78 / 100", icon: Award, color: "text-violet-400" },
    { label: "Best Skill", value: "Clarity & Structure", icon: TrendingUp, color: "text-emerald-400" },
    { label: "Needs Improvement", value: "Pacing & Pauses", icon: AlertTriangle, color: "text-amber-400" }
  ];

  // Demo recent interviews list
  const recentInterviews = [
    {
      id: 1,
      role: "Software Engineer",
      score: 76,
      date: "Aug 18, 2026",
      type: "Technical",
      difficulty: "Intermediate",
      status: "Completed"
    },
    {
      id: 2,
      role: "Frontend Developer",
      score: 81,
      date: "Aug 12, 2026",
      type: "Technical",
      difficulty: "Advanced",
      status: "Completed"
    },
    {
      id: 3,
      role: "Backend Developer",
      score: 74,
      date: "Aug 05, 2026",
      type: "Mixed",
      difficulty: "Intermediate",
      status: "Completed"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-8 rounded-3xl border border-slate-800">
        <div className="space-y-1">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold">
            DASHBOARD OVERVIEW
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back, {user?.name || 'Rida'}
          </h1>
          <p className="text-sm text-slate-400">
            Track your verbal interview progress, recent performances, and practice milestones.
          </p>
        </div>

        <div>
          <button
            onClick={() => setCurrentPage('setup')}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Start New Interview</span>
          </button>
        </div>
      </div>

      {/* Demo Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{st.label}</span>
                <Icon className={`w-5 h-5 ${st.color}`} />
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">{st.value}</p>
              <div className="text-[10px] text-slate-500 font-mono">Demo value • Replace via DB</div>
            </div>
          );
        })}
      </div>

      {/* Recent Interviews Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent Interviews</h2>
          <button 
            onClick={() => setCurrentPage('history')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentInterviews.map((item) => (
            <div key={item.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-indigo-500/40 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-indigo-400">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{item.role}</h3>
                    <p className="text-xs text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-500 inline mr-1" />
                      {item.date}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
                  item.score >= 80 ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800'
                }`}>
                  {item.score}/100
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{item.type}</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{item.difficulty}</span>
              </div>

              <button
                onClick={() => setCurrentPage('report')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>View Session Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
