import React from 'react';
import { Mic, BarChart2, History, LayoutDashboard, Settings, User, LogIn, Award } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage, user }) {
  const navItems = [
    { id: 'landing', label: 'Home', icon: Mic },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'setup', label: 'New Interview', icon: Settings },
    { id: 'interview', label: 'Interview Room', icon: Mic },
    { id: 'feedback', label: 'Feedback', icon: Award },
    { id: 'report', label: 'Final Report', icon: Award },
    { id: 'history', label: 'History', icon: History },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentPage('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                Mockly
              </span>
              <span className="hidden sm:inline-block text-[10px] text-indigo-400 font-mono ml-2 px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/50">
                FOUNDATION DAY 1
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile / Login Action */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div 
                onClick={() => setCurrentPage('dashboard')}
                className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-full px-3 py-1.5 cursor-pointer transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-semibold text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-slate-200">{user.name}</span>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-600/20 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 bg-slate-950/80 border-t border-slate-800/60 space-x-2 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium ${
              currentPage === item.id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 bg-slate-900 border border-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
