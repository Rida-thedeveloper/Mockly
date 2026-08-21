import React from 'react';
import { Award, Clock, Activity, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function QuestionFeedbackPage({ setCurrentPage, recordedAnswers }) {
  const answerCount = Object.keys(recordedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold">
          QUESTION ANALYSIS UI
        </div>
        <h1 className="text-3xl font-extrabold text-white">Answer Analysis</h1>
        <p className="text-sm text-slate-400">
          Per-question verbal performance indicators and audio evaluation framework.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
        
        {/* Prominent ML Disclaimer Banner */}
        <div className="bg-amber-950/60 border border-amber-800/80 rounded-2xl p-5 flex items-start space-x-4">
          <Cpu className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
          <div className="space-y-1">
            <h3 className="font-bold text-amber-200 text-sm">ML Pipeline Notice</h3>
            <p className="text-xs text-amber-300/90 leading-relaxed">
              "Your answer will be analyzed here after the ML pipeline is connected."
            </p>
            <p className="text-[11px] text-amber-400/70 font-mono pt-1">
              Note: Today's build establishes the full UI foundation. Real ML models (Whisper, Random Forest, Sentence Transformers) are strictly reserved for future backend updates.
            </p>
          </div>
        </div>

        {/* Answer Analysis Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
            <span className="text-xs text-slate-400 font-semibold block">Answer Relevance</span>
            <div className="text-3xl font-extrabold text-slate-500 font-mono">--%</div>
            <div className="text-[11px] text-slate-500">Semantic similarity score pending</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
            <span className="text-xs text-slate-400 font-semibold block">Speaking Pace</span>
            <div className="text-lg font-bold text-amber-400">Waiting for analysis</div>
            <div className="text-[11px] text-slate-500">Words per minute acoustic calculation</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
            <span className="text-xs text-slate-400 font-semibold block">Hesitation Marker</span>
            <div className="text-lg font-bold text-amber-400">Waiting for analysis</div>
            <div className="text-[11px] text-slate-500">Pitch & silence gap detection</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
            <span className="text-xs text-slate-400 font-semibold block">Filler Words</span>
            <div className="text-3xl font-extrabold text-slate-500 font-mono">--</div>
            <div className="text-[11px] text-slate-500">Occurrences of um / like / standard fillers</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
            <span className="text-xs text-slate-400 font-semibold block">Pauses & Silences</span>
            <div className="text-3xl font-extrabold text-slate-500 font-mono">--</div>
            <div className="text-[11px] text-slate-500">Unnatural pause frequency count</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
            <span className="text-xs text-slate-400 font-semibold block">Audio Captured</span>
            <div className="text-2xl font-bold text-indigo-400 font-mono">{answerCount} Answers</div>
            <div className="text-[11px] text-slate-500">Stored safely in frontend state</div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 pt-6">
          <button
            onClick={() => setCurrentPage('interview')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Interview Room</span>
          </button>

          <button
            onClick={() => setCurrentPage('report')}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-colors"
          >
            <span>View Full Final Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
