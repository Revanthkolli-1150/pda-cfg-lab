import React, { useState } from 'react';
import { AlignLeft, Copy, Check } from 'lucide-react';

export const DerivationViewer = ({
  leftmost = [],
  rightmost = [],
  title = 'CFG Derivation Steps'
}) => {
  const [mode, setMode] = useState('leftmost'); // 'leftmost' | 'rightmost'
  const [copied, setCopied] = useState(false);

  const activeDerivation = mode === 'leftmost' ? leftmost : rightmost;

  const handleCopy = () => {
    const text = activeDerivation
      .map(
        d =>
          `Step ${d.stepNumber}: ${d.sententialForm}  [Rule: ${d.appliedRule || 'Start'}]`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeDerivation || activeDerivation.length === 0) {
    return (
      <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-6 text-center text-slate-500 font-mono text-sm">
        No derivation steps available for current input.
      </div>
    );
  }

  return (
    <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-4 flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dark-750/70 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <AlignLeft className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle LM / RM */}
          <div className="flex items-center bg-dark-950 p-0.5 rounded-lg border border-dark-800 text-xs font-mono">
            <button
              onClick={() => setMode('leftmost')}
              className={`px-2.5 py-1 rounded transition-colors ${
                mode === 'leftmost'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Leftmost (LM)
            </button>
            <button
              onClick={() => setMode('rightmost')}
              className={`px-2.5 py-1 rounded transition-colors ${
                mode === 'rightmost'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rightmost (RM)
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy derivation to clipboard"
            className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Step List */}
      <div className="flex-1 max-h-[360px] overflow-y-auto space-y-2 pr-1">
        {activeDerivation.map((step, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === activeDerivation.length - 1;

          return (
            <div
              key={step.stepNumber}
              className={`p-2.5 rounded-lg border text-xs font-mono transition-colors flex items-center justify-between gap-3 ${
                isLast
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : isFirst
                  ? 'bg-cyan-950/20 border-cyan-500/30'
                  : 'bg-dark-950/60 border-dark-800 hover:border-dark-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded flex items-center justify-center bg-dark-800 text-[11px] text-slate-400 font-bold border border-dark-700">
                  {step.stepNumber}
                </span>

                <span className="text-slate-400">⇒</span>

                <span className={`font-semibold tracking-wide ${isLast ? 'text-emerald-300' : 'text-slate-200'}`}>
                  {step.sententialForm}
                </span>
              </div>

              {step.appliedRule && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-dark-850 text-cyan-300 border border-dark-750 shrink-0">
                  {step.appliedRule}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
