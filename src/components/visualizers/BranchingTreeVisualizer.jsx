import React, { useState } from 'react';
import { GitBranch, CheckCircle2, XCircle, Search, HelpCircle } from 'lucide-react';

export const BranchingTreeVisualizer = ({
  allConfigs = [],
  winningPath = [],
  accepted = false,
  onSelectPath = () => {}
}) => {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'accepted' | 'dead_end'

  // Extract all terminal leaf branches
  const terminalLeaves = allConfigs.filter(
    c => c.children.length === 0 || c.status === 'ACCEPTED'
  );

  const filteredLeaves = terminalLeaves.filter(leaf => {
    if (filterType === 'accepted') return leaf.status === 'ACCEPTED';
    if (filterType === 'dead_end') return leaf.status !== 'ACCEPTED';
    return true;
  });

  return (
    <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-4 flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dark-750/70 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
            NPDA Nondeterministic Branch Exploration
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter pills */}
          <div className="flex items-center bg-dark-950 p-0.5 rounded-lg border border-dark-800 text-xs font-mono">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-0.5 rounded ${
                filterType === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({terminalLeaves.length})
            </button>
            <button
              onClick={() => setFilterType('accepted')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                filterType === 'accepted'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Winners
            </button>
            <button
              onClick={() => setFilterType('dead_end')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                filterType === 'dead_end'
                  ? 'bg-rose-500/20 text-rose-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <XCircle className="w-3 h-3 text-rose-400" />
              Dead Ends
            </button>
          </div>
        </div>
      </div>

      {/* Exploration Statistics Banner */}
      <div className="grid grid-cols-3 gap-2 bg-dark-950 p-2.5 rounded-lg border border-dark-800 text-xs font-mono mb-3">
        <div className="flex flex-col">
          <span className="text-slate-500 text-[10px] uppercase">Configurations</span>
          <span className="text-cyan-400 font-bold text-sm">{allConfigs.length}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-500 text-[10px] uppercase">Parallel Paths</span>
          <span className="text-slate-200 font-bold text-sm">{terminalLeaves.length}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-500 text-[10px] uppercase">NPDA Outcome</span>
          <span
            className={`font-bold text-sm flex items-center gap-1 ${
              accepted ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {accepted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {accepted ? 'ACCEPTED' : 'REJECTED'}
          </span>
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div className="flex-1 max-h-[300px] overflow-y-auto space-y-2 pr-1">
        {filteredLeaves.map((leaf, idx) => {
          const isWinner = leaf.status === 'ACCEPTED';

          return (
            <div
              key={leaf.id}
              className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                isWinner
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                  : 'bg-dark-950/70 border-dark-800 hover:border-dark-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">Branch #{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded bg-dark-850 border border-dark-750 text-cyan-300 font-semibold text-[11px]">
                    {leaf.branchLabel}
                  </span>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isWinner
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {isWinner ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {isWinner ? 'Winning Path' : 'Dead End'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-dark-850">
                <span>
                  Ended at state: <strong className="text-slate-200">{leaf.state}</strong>
                </span>
                <span>
                  Stack: <span className="text-violet-300 font-bold">[{leaf.stack.join(', ')}]</span>
                </span>
                <span>
                  Depth: <strong className="text-slate-300">{leaf.depth}</strong> steps
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
