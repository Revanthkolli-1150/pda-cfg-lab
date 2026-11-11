import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  Code,
  GitBranch,
  Split,
  ChevronRight,
  BookMarked,
  FileText
} from 'lucide-react';

export const Sidebar = ({ activeModule, onSelectModule, isOpen, onClose }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Mission Control',
      sublabel: 'Project Overview & Metrics',
      icon: LayoutDashboard,
      badge: 'Main'
    },
    {
      id: 'arithmetic',
      label: '1. Arithmetic Expressions',
      sublabel: 'Stratified CFG & Precedence',
      icon: Calculator,
      badge: 'CFG'
    },
    {
      id: 'parentheses',
      label: '2. Balanced Parentheses',
      sublabel: 'Deterministic DPDA & Stack',
      icon: Code,
      badge: 'DPDA'
    },
    {
      id: 'palindrome',
      label: '3. Palindrome Language',
      sublabel: 'Nondeterministic NPDA',
      icon: GitBranch,
      badge: 'NPDA'
    },
    {
      id: 'theory',
      label: 'Ambiguity & Theory Lab',
      sublabel: 'Dual Trees & Proofs',
      icon: Split,
      badge: 'Theory'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-50 md:z-30 h-screen md:h-[calc(100vh-4rem)] w-64 bg-dark-900 border-r border-dark-750/70 p-4 flex flex-col justify-between transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Section Title */}
          <div className="px-2 pt-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Automata Laboratories
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectModule(item.id);
                    onClose?.();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-cyan-500/15 border border-cyan-500/40 text-white shadow-sm shadow-cyan-500/10'
                      : 'hover:bg-dark-850 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-cyan-500 text-dark-950 font-bold'
                          : 'bg-dark-800 text-slate-400 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="text-xs font-semibold tracking-tight">{item.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">
                        {item.sublabel}
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="pt-4 border-t border-dark-800 text-xs text-slate-500 space-y-2">
          <div className="bg-dark-950 p-2.5 rounded-xl border border-dark-800">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
              <BookMarked className="w-3.5 h-3.5" />
              <span>Assessment Task 3</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              FLA Formal Models &amp; Interactive Parser Simulator
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
