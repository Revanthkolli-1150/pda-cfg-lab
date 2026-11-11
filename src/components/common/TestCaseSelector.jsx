import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export const TestCaseSelector = ({ testCases = [], activeInput, onSelectCase }) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'accepted' | 'rejected'

  const filteredCases = testCases.filter(tc => {
    if (filter === 'all') return true;
    return tc.category === filter;
  });

  return (
    <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-3.5 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Presets &amp; Test Suite
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-dark-950 p-0.5 rounded-lg border border-dark-800 text-xs font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded transition-colors ${
              filter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({testCases.length})
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
              filter === 'accepted' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Accepted
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
              filter === 'rejected' ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <XCircle className="w-3 h-3 text-rose-400" />
            Rejected
          </button>
        </div>
      </div>

      {/* Test Case Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
        {filteredCases.map(tc => {
          const isSelected = activeInput === tc.input;
          const isAccepted = tc.category === 'accepted';

          return (
            <button
              key={tc.id}
              onClick={() => onSelectCase(tc.input)}
              title={`${tc.name}: ${tc.description}`}
              className={`text-left p-2 rounded-lg border text-xs transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-400/80 bg-cyan-950/30 text-white shadow-sm shadow-cyan-500/20'
                  : 'border-dark-750/50 bg-dark-850 hover:bg-dark-800 text-slate-300 hover:border-dark-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono font-medium truncate max-w-[140px] text-slate-100 bg-dark-900 px-1.5 py-0.5 rounded border border-dark-800">
                  {tc.input === '' ? 'ε (empty)' : tc.input}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    isAccepted
                      ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-950/70 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isAccepted ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                  {isAccepted ? 'Accept' : 'Reject'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">{tc.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
