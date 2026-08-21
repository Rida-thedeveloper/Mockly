import React, { useState } from 'react';
import { Briefcase, Sliders, Hash, ArrowRight, Play, Check, ShieldCheck } from 'lucide-react';

export default function SetupPage({ setCurrentPage, interviewSetup, setInterviewSetup }) {
  const [role, setRole] = useState(interviewSetup.role || 'Software Engineer');
  const [difficulty, setDifficulty] = useState(interviewSetup.difficulty || 'Intermediate');
  const [type, setType] = useState(interviewSetup.type || 'Technical');
  const [questionCount, setQuestionCount] = useState(interviewSetup.questionCount || 5);

  const roles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "AI/ML Engineer",
    "Data Analyst"
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];
  const types = ["Technical", "Behavioral", "Mixed"];
  const counts = [5, 10];

  const handleStart = () => {
    setInterviewSetup({
      role,
      difficulty,
      type,
      questionCount: Number(questionCount)
    });
    setCurrentPage('interview');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold">
          CONFIGURATION
        </div>
        <h1 className="text-3xl font-extrabold text-white">Set Up Your Interview</h1>
        <p className="text-sm text-slate-400">
          Customize your target job role, difficulty, and question count before recording.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
        
        {/* Job Role Selection */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>Target Job Role</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`p-3.5 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${
                  role === r
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{r}</span>
                {role === r && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-violet-400" />
            <span>Difficulty Level</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`p-3.5 rounded-xl border text-center text-sm font-semibold transition-all ${
                  difficulty === d
                    ? 'bg-violet-600/20 border-violet-500 text-violet-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Interview Type */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Interview Type</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`p-3.5 rounded-xl border text-center text-sm font-semibold transition-all ${
                  type === t
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-white flex items-center space-x-2">
            <Hash className="w-4 h-4 text-emerald-400" />
            <span>Number of Questions</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {counts.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setQuestionCount(c)}
                className={`p-3.5 rounded-xl border text-center text-sm font-semibold transition-all ${
                  questionCount === c
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {c} Questions
              </button>
            ))}
          </div>
        </div>

        {/* Selected Config Summary */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="space-x-4">
            <span className="text-slate-400">Role: <strong className="text-white">{role}</strong></span>
            <span className="text-slate-400">Difficulty: <strong className="text-white">{difficulty}</strong></span>
            <span className="text-slate-400">Type: <strong className="text-white">{type}</strong></span>
            <span className="text-slate-400">Questions: <strong className="text-white">{questionCount}</strong></span>
          </div>
          <div className="text-emerald-400 flex items-center space-x-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Saved in Frontend State</span>
          </div>
        </div>

        {/* Launch Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base rounded-xl shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-3 transition-all"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Start Interview</span>
        </button>

      </div>
    </div>
  );
}
