import React from 'react';
import { Layers, ArrowLeft, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export const StackVisualizer = ({
  stack = ['Z0'],
  lastOperation = 'INITIALIZE',
  maxStackDepth = 10,
  stackTop = 'Z0'
}) => {
  // Items from top to bottom
  const reversedItems = [...stack].reverse();

  const getBadgeColor = (item) => {
    if (item === 'Z0') return 'bg-violet-950/80 border-violet-500/50 text-violet-300';
    if (item === '(' || item === ')') return 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300';
    if (item === 'a') return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
    if (item === 'b') return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
    return 'bg-dark-800 border-dark-700 text-slate-200';
  };

  const isPush = lastOperation.includes('PUSH');
  const isPop = lastOperation.includes('POP');

  return (
    <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-4 flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dark-750/70 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
            Automata LIFO Stack
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Depth:</span>
          <span className="px-1.5 py-0.5 rounded bg-dark-800 text-cyan-300 border border-dark-700 font-bold">
            {stack.length}
          </span>
        </div>
      </div>

      {/* Operation Status Tag */}
      <div className="flex items-center justify-between text-xs font-mono bg-dark-950 px-3 py-1.5 rounded-lg border border-dark-800 mb-3">
        <span className="text-slate-400">Last Op:</span>
        <div className="flex items-center gap-1.5">
          {isPush && <ArrowDownCircle className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />}
          {isPop && <ArrowUpCircle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />}
          <span
            className={`font-semibold ${
              isPush
                ? 'text-cyan-400'
                : isPop
                ? 'text-rose-400'
                : 'text-slate-300'
            }`}
          >
            {lastOperation || 'NO OPERATION'}
          </span>
        </div>
      </div>

      {/* Physical Stack Chamber */}
      <div className="flex-1 flex flex-col justify-end bg-dark-950/80 rounded-xl border-2 border-dark-750 border-t-0 p-3 min-h-[220px] relative overflow-hidden">
        {/* Top Opening Marker */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/30 via-cyan-400 to-cyan-500/30" />

        {stack.length === 0 ? (
          <div className="flex flex-col items-center justify-center my-auto text-rose-400/80 text-xs font-mono">
            <span>Stack is completely empty!</span>
            <span className="text-[10px] text-slate-500 mt-1">(Underflow error)</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-[280px] overflow-y-auto pr-1">
            {reversedItems.map((item, idx) => {
              const isTop = idx === 0;
              const originalIndex = stack.length - 1 - idx;

              return (
                <div
                  key={`${item}-${originalIndex}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-mono transition-all duration-300 ${getBadgeColor(
                    item
                  )} ${
                    isTop
                      ? 'ring-2 ring-cyan-400/50 shadow-md shadow-cyan-500/10 scale-[1.02]'
                      : 'opacity-85'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-4">#{originalIndex}</span>
                    <span className="font-bold text-sm tracking-wider">{item}</span>
                  </div>

                  {isTop && (
                    <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold bg-cyan-950/90 px-1.5 py-0.5 rounded border border-cyan-500/40 animate-pulse">
                      <ArrowLeft className="w-3 h-3" />
                      <span>TOP</span>
                    </div>
                  )}

                  {item === 'Z0' && !isTop && (
                    <span className="text-[9px] uppercase tracking-wider text-violet-400/80">
                      Bottom Marker
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Stack base pedestal */}
        <div className="mt-2 pt-1 border-t border-dark-750 text-center">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
            Stack Base ── [Ground Z0]
          </span>
        </div>
      </div>
    </div>
  );
};
