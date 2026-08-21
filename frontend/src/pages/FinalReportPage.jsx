import React from 'react';
import { Award, AlertCircle, CheckCircle2, TrendingUp, HelpCircle, FileText, ArrowRight, Play } from 'lucide-react';

export default function FinalReportPage({ setCurrentPage, recordedAnswers }) {
  const hasAnswers = Object.keys(recordedAnswers).length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold">
          FINAL ASSESSMENT REPORT
        </div>
        <h1 className="text-3xl font-extrabold text-white">Interview Performance Report</h1>
        <p className="text-sm text-slate-400">
          Comprehensive summary of verbal communication indicators, score metrics, and actionable guidance.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
        
        {/* Placeholder / Setup Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold text-white">Report Status</p>
              <p className="text-xs text-slate-400">
                {hasAnswers 
                  ? `Completed ${Object.keys(recordedAnswers).length} response recordings` 
                  : "Complete an interview to generate your report."}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('setup')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center space-x-2 transition-colors shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Interview Session</span>
          </button>
        </div>

        {/* Top Score Banner */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-800/60 p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-xs font-mono text-indigo-300 font-bold uppercase tracking-wider">Overall Score</span>
            <div className="text-4xl font-extrabold text-white font-mono">
              -- <span className="text-xl text-slate-500 font-normal">/ 100</span>
            </div>
            <p className="text-xs text-slate-400">Awaiting ML scoring pipeline integration</p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-3 text-xs">
            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-300">
              Session ID: <span className="font-mono text-indigo-400">#MOCK-2026-08</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-300">
              Recordings: <span className="font-mono text-emerald-400">{Object.keys(recordedAnswers).length} Saved</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs text-slate-400">Answer Relevance</span>
            <div className="text-2xl font-bold text-slate-500 font-mono">--</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs text-slate-400">Speaking Pace</span>
            <div className="text-2xl font-bold text-slate-500 font-mono">--</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs text-slate-400">Hesitation</span>
            <div className="text-2xl font-bold text-slate-500 font-mono">--</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs text-slate-400">Filler Words</span>
            <div className="text-2xl font-bold text-slate-500 font-mono">--</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs text-slate-400">Pauses</span>
            <div className="text-2xl font-bold text-slate-500 font-mono">--</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs text-slate-400">Acoustic Clarity</span>
            <div className="text-2xl font-bold text-slate-500 font-mono">--</div>
          </div>
        </div>

        {/* 3 Main Sections */}
        <div className="space-y-6 pt-4">
          
          {/* Strengths */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Strengths</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
              <li>Consistent response structure and technical terminology.</li>
              <li>Clear microphone audio signal captured via browser MediaRecorder.</li>
              <li>Completed interview questions within requested timeline limits.</li>
            </ul>
          </div>

          {/* Areas to Improve */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>Areas to Improve</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
              <li>Reduce initial hesitation pauses before commencing detailed explanations.</li>
              <li>Maintain steady cadence during complex database and OOP architecture questions.</li>
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>Recommendations</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
              <li>Practice 2-3 mock sessions per week to build verbal confidence.</li>
              <li>Use structured answer models (STAR / Problem-Solution-Result format).</li>
              <li>Listen back to your audio recordings in the Interview Room preview player.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
