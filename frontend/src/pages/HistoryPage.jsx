import React from 'react';
import { History, Calendar, Award, ArrowRight, Code, Database, Cpu, CheckCircle } from 'lucide-react';

export default function HistoryPage({ setCurrentPage }) {
  const historyData = [
    { id: 1, date: "Aug 18, 2026", role: "Software Engineer", score: 76, status: "Completed", icon: Code, type: "Technical", questions: 5 },
    { id: 2, date: "Aug 12, 2026", role: "Frontend Developer", score: 81, status: "Completed", icon: Code, type: "Technical", questions: 5 },
    { id: 3, date: "Aug 05, 2026", role: "Backend Developer", score: 74, status: "Completed", icon: Database, type: "Mixed", questions: 10 },
    { id: 4, date: "Jul 28, 2026", role: "AI/ML Engineer", score: 79, status: "Completed", icon: Cpu, type: "Technical", questions: 5 },
    { id: 5, date: "Jul 20, 2026", role: "Data Analyst", score: 72, status: "Completed", icon: Database, type: "Behavioral", questions: 5 }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold">
            PAST SESSIONS
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Interview History</h1>
          <p className="text-sm text-slate-400">
            Review past mock interview sessions, roles evaluated, and overall scores.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('setup')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center space-x-2 transition-colors self-start sm:self-auto"
        >
          <span>Start New Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* History Table Container */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-xs uppercase font-mono text-slate-400">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Role & Type</th>
                <th className="py-4 px-6">Questions</th>
                <th className="py-4 px-6">Score</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {historyData.map((row) => {
                const Icon = row.icon;
                return (
                  <tr key={row.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-slate-300">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{row.date}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-indigo-400 shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{row.role}</p>
                          <p className="text-[11px] text-slate-400">{row.type}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                      {row.questions} Questions
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
                        row.score >= 80 ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800'
                      }`}>
                        {row.score} / 100
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-800/40">
                        <CheckCircle className="w-3 h-3" />
                        <span>{row.status}</span>
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setCurrentPage('report')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 rounded-lg transition-colors inline-flex items-center space-x-1"
                      >
                        <span>Report</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
