import React from 'react';
import { Mic, ShieldAlert } from 'lucide-react';

export default function Footer({ setCurrentPage }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
              <Mic className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <span className="font-bold text-white text-base">Mockly</span>
              <p className="text-xs text-slate-500">Practice how you communicate, not just what you know.</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-medium">
            <button onClick={() => setCurrentPage('landing')} className="hover:text-slate-200">Landing Page</button>
            <button onClick={() => setCurrentPage('dashboard')} className="hover:text-slate-200">Dashboard</button>
            <button onClick={() => setCurrentPage('setup')} className="hover:text-slate-200">Interview Setup</button>
            <button onClick={() => setCurrentPage('interview')} className="hover:text-slate-200">Interview Screen</button>
            <button onClick={() => setCurrentPage('feedback')} className="hover:text-slate-200">Feedback UI</button>
            <button onClick={() => setCurrentPage('report')} className="hover:text-slate-200">Final Report</button>
            <button onClick={() => setCurrentPage('history')} className="hover:text-slate-200">History</button>
            <button onClick={() => setCurrentPage('progress')} className="hover:text-slate-200">Progress</button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-amber-400/90 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-lg">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Day 1 Foundation Setup • ML Pipeline Connects Later</span>
          </div>

        </div>
        <div className="mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-600">
          © 2026 Mockly Platform. Built for students & fresh graduates.
        </div>
      </div>
    </footer>
  );
}
