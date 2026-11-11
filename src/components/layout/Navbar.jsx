import React from 'react';
import { Layers, Terminal, CheckCircle2, BookOpen, ExternalLink, Menu } from 'lucide-react';

export const Navbar = ({ activeModule, onSelectModule, onToggleSidebar }) => {
  return (
    <header className="h-16 bg-dark-900/90 backdrop-blur-md border-b border-dark-750/70 sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg bg-dark-800 text-slate-300 hover:text-white md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div
          onClick={() => onSelectModule('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-dark-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight group-hover:text-cyan-300 transition-colors">
                PDA &amp; CFG LAB
              </span>
              <span className="hidden sm:inline-block px-2 py-0.2 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase">
                v1.0
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              FLA Task 3 • Automata &amp; Grammar Simulator
            </div>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Test Suite Passed Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Vitest: 30 / 30 Tests Passing</span>
        </div>

        {/* Quick Nav Button */}
        <button
          onClick={() => onSelectModule('theory')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
            activeModule === 'theory'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50'
              : 'bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Theory &amp; Proofs</span>
        </button>
      </div>
    </header>
  );
};
