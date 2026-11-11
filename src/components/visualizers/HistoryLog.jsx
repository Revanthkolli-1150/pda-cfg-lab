import React from 'react';
import { History, CheckCircle2, XCircle } from 'lucide-react';

export const HistoryLog = ({
  history = [],
  currentStep = 0,
  onSelectStep = () => {}
}) => {
  return (
    <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-4 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between border-b border-dark-750/70 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
            Automata Execution History Trace
          </h3>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Total Steps: <span className="text-cyan-400 font-bold">{history.length}</span>
        </span>
      </div>

      <div className="flex-1 max-h-[300px] overflow-auto border border-dark-800 rounded-lg">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead className="bg-dark-950 text-slate-400 border-b border-dark-800 sticky top-0">
            <tr>
              <th className="py-2 px-3">Step</th>
              <th className="py-2 px-3">State</th>
              <th className="py-2 px-3">Read</th>
              <th className="py-2 px-3">Remaining</th>
              <th className="py-2 px-3">Stack Top</th>
              <th className="py-2 px-3">Op</th>
              <th className="py-2 px-3">Transition Rule</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800/60">
            {history.map((h, idx) => {
              const isCurrent = idx === currentStep;
              const isAccept = h.status === 'ACCEPTED';
              const isReject = h.status === 'REJECTED';

              return (
                <tr
                  key={h.step ?? idx}
                  onClick={() => onSelectStep(idx)}
                  className={`cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-cyan-950/70 text-white font-bold border-l-4 border-l-cyan-400'
                      : 'hover:bg-dark-850/60 text-slate-300'
                  }`}
                >
                  <td className="py-2 px-3 text-cyan-400/90 font-bold">#{h.step ?? idx}</td>
                  <td className="py-2 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-dark-850 border border-dark-750 text-cyan-300">
                      {h.state}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-200 font-bold">{h.readChar}</td>
                  <td className="py-2 px-3 text-slate-400">
                    {h.unconsumedInput === '' || h.remaining === '' ? 'ε (EOF)' : (h.unconsumedInput || h.remaining)}
                  </td>
                  <td className="py-2 px-3 text-violet-300 font-bold">{h.stackTop}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        h.operation?.includes('PUSH')
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                          : h.operation?.includes('POP')
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-dark-800 text-slate-400'
                      }`}
                    >
                      {h.operation}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[11px] text-slate-300 max-w-xs truncate">
                    {h.ruleDescription}
                  </td>
                  <td className="py-2 px-3">
                    {isAccept ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase">
                        <CheckCircle2 className="w-3 h-3" /> Accept
                      </span>
                    ) : isReject ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase">
                        <XCircle className="w-3 h-3" /> Reject
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 uppercase">Step</span>
                    )}
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
