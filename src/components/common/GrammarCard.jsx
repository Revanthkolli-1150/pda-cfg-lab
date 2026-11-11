import React from 'react';
import { BookOpen, Code2 } from 'lucide-react';

export const GrammarCard = ({
  name = 'Formal Grammar Specification',
  variables = [],
  terminals = [],
  startSymbol = 'S',
  productions = [],
  notes = ''
}) => {
  return (
    <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-4 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between border-b border-dark-750/70 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
            {name}
          </h3>
        </div>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-dark-800 text-cyan-300 border border-dark-700 font-semibold">
          CFG: G = (V, Σ, R, S)
        </span>
      </div>

      {/* 4-Tuple Metadata */}
      <div className="grid grid-cols-3 gap-2 bg-dark-950 p-2.5 rounded-lg border border-dark-800 text-xs font-mono mb-3">
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Variables (V)</span>
          <span className="text-cyan-400 font-bold">{`{ ${variables.join(', ')} }`}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Terminals (Σ)</span>
          <span className="text-emerald-400 font-bold">{`{ ${terminals.join(', ')} }`}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Start (S)</span>
          <span className="text-amber-400 font-bold">{startSymbol}</span>
        </div>
      </div>

      {/* Production Rules */}
      <div className="flex-1">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-1.5 block">
          Production Rules (R):
        </span>
        <div className="space-y-1.5 bg-dark-950/70 p-3 rounded-lg border border-dark-800 font-mono text-xs">
          {productions.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-600 text-[10px] w-4">{idx + 1}.</span>
              <span className="text-cyan-300 font-bold">{rule.split('→')[0].trim()}</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-100 font-medium">{rule.split('→')[1]?.trim()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <p className="mt-3 text-[11px] text-slate-400 italic border-t border-dark-800 pt-2">
          {notes}
        </p>
      )}
    </div>
  );
};
