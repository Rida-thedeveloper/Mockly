import React from 'react';
import { ArrowRight, Play, CheckCircle2, Mic, Activity, Clock, FileText, Sparkles, Target, Zap } from 'lucide-react';

export default function LandingPage({ setCurrentPage }) {
  const steps = [
    {
      num: "01",
      title: "Choose Role",
      desc: "Select your target job role (e.g. Software Engineer, Frontend Developer), difficulty level, and question count.",
      icon: Target,
      color: "from-indigo-500 to-blue-500"
    },
    {
      num: "02",
      title: "Answer Questions",
      desc: "Listen to real technical or behavioral questions and speak your response using browser microphone recording.",
      icon: Mic,
      color: "from-violet-500 to-indigo-500"
    },
    {
      num: "03",
      title: "AI Analysis",
      desc: "Our upcoming backend ML engine will evaluate speaking pace, hesitation, filler words, pauses, and relevance.",
      icon: Activity,
      color: "from-purple-500 to-violet-500"
    },
    {
      num: "04",
      title: "Personalized Feedback",
      desc: "Review comprehensive reports detailing your communication strengths and actionable improvement insights.",
      icon: FileText,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const features = [
    {
      title: "Speaking Pace & Rhythm",
      desc: "Track words per minute to ensure you present answers clearly without rushing or dragging.",
      icon: Clock,
      badge: "Speech Metric"
    },
    {
      title: "Hesitation & Pauses",
      desc: "Identify silent pauses and hesitation markers to boost your confidence under pressure.",
      icon: Activity,
      badge: "Acoustics"
    },
    {
      title: "Filler Word Detection",
      desc: "Count occurrences of 'um', 'like', 'you know' to refine your professional speaking delivery.",
      icon: Zap,
      badge: "Speech Clarity"
    },
    {
      title: "Answer Relevance",
      desc: "Assess how accurately your vocal answer addresses core technical concepts in the prompt.",
      icon: Sparkles,
      badge: "Semantic Content"
    }
  ];

  return (
    <div className="space-y-24 py-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-POWERED INTERVIEW PRACTICE PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Practice how you communicate,{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
              not just what you know.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI-powered mock interviews that help you understand your speaking pace, hesitation, filler words, pauses, and answer relevance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentPage('setup')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/25 flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-0.5"
            >
              <span>Start Interview</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base flex items-center justify-center space-x-3 transition-colors"
            >
              <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
              <span>How It Works</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-slate-800/80 max-w-3xl mx-auto text-left">
            <div>
              <p className="text-2xl font-bold text-white">0%</p>
              <p className="text-xs text-slate-400">Judgement Free</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-400">MediaRecorder</p>
              <p className="text-xs text-slate-400">Browser Audio Capture</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-violet-400">5 Metrics</p>
              <p className="text-xs text-slate-400">Speech & Content Insights</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">Student First</p>
              <p className="text-xs text-slate-400">Fresh Grad Career Focus</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4-Step Visual Flow */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white">Simple 4-Step Process</h2>
          <p className="text-slate-400 text-sm">
            Structure your mock interview practice session in four seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="glass-panel p-6 rounded-2xl relative space-y-4 flex flex-col justify-between hover:border-indigo-500/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-1 rounded-md">
                      {s.num}
                    </span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {s.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    {s.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-600">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Analysis Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white">What Mockly Analyzes</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Comprehensive verbal communication metrics designed to elevate your interview delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-panel p-6 rounded-2xl flex items-start space-x-4 border border-slate-800 hover:border-indigo-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-indigo-400 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-white text-base">{f.title}</h3>
                    <span className="text-[10px] text-indigo-300 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded font-mono">
                      {f.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-panel p-10 rounded-3xl border border-indigo-500/30 text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-indigo-950/40 to-slate-950">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready for your first mock interview?</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            No signup required today. Select your target job role and start recording right in your browser.
          </p>
          <div>
            <button
              onClick={() => setCurrentPage('setup')}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 inline-flex items-center space-x-2 transition-all"
            >
              <span>Start Setup Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
