import React from 'react';
import { Table } from 'lucide-react';

export const TransitionTable = ({
  transitions = [],
  activeRuleFormula = '',
  title = 'Formal PDA Transition Table'
}) => {
  return (
    <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-4 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between border-b border-dark-750/70 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
            {title}
          </h3>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Total Rules: <span className="text-cyan-400 font-bold">{transitions.length}</span>
        </span>
      </div>

      <div className="flex-1 max-h-[300px] overflow-auto border border-dark-800 rounded-lg">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead className="bg-dark-950 text-slate-400 border-b border-dark-800 sticky top-0">
            <tr>
              <th className="py-2 px-3">Rule</th>
              <th className="py-2 px-3">State</th>
              <th className="py-2 px-3">Input</th>
              <th className="py-2 px-3">Stack Top</th>
              <th className="py-2 px-3">Next State</th>
              <th className="py-2 px-3">Stack Op</th>
              <th className="py-2 px-3">Explanation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800/60">
            {transitions.map((t, idx) => {
              const isMatch = activeRuleFormula && (
                t.formula?.toLowerCase().includes(activeRuleFormula.toLowerCase()) ||
                activeRuleFormula.toLowerCase().includes(t.formula?.toLowerCase())
              );

              return (
                <tr
                  key={t.id || idx}
                  className={`transition-colors ${
                    isMatch
                      ? 'bg-cyan-950/60 text-white font-bold border-l-4 border-l-cyan-400'
                      : 'hover:bg-dark-850/60 text-slate-300'
                  }`}
                >
                  <td className="py-2 px-3 text-cyan-400/90 font-bold">{t.id ?? idx + 1}</td>
                  <td className="py-2 px-3">{t.from}</td>
                  <td className="py-2 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-dark-800 border border-dark-700 text-slate-100">
                      {t.input}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-dark-800 border border-dark-700 text-violet-300">
                      {t.stackTop || t.stack}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-cyan-300">{t.to}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        t.stackAction?.includes('PUSH')
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                          : t.stackAction?.includes('POP')
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-dark-800 text-slate-400'
                      }`}
                    >
                      {t.stackAction || t.action}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[11px] text-slate-400 max-w-xs truncate">
                    {t.explanation || t.desc}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
