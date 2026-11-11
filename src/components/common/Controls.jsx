import React from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, FastForward } from 'lucide-react';

export const Controls = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlayPause,
  onStepForward,
  onStepBack,
  onReset,
  onSpeedChange,
  onRunToComplete,
  disabled = false
}) => {
  const isAtEnd = currentStep >= totalSteps - 1;
  const isAtStart = currentStep <= 0;

  return (
    <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
      {/* Playback action buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onReset}
          disabled={disabled || isAtStart}
          title="Reset to start (Step 0)"
          className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onStepBack}
          disabled={disabled || isAtStart}
          title="Step backward"
          className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={onPlayPause}
          disabled={disabled || isAtEnd}
          title={isPlaying ? 'Pause simulation' : 'Play / Auto-step'}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm transition-all ${
            isPlaying
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
              : 'bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-semibold shadow-md shadow-cyan-500/20'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{isAtEnd ? 'Completed' : 'Play'}</span>
            </>
          )}
        </button>

        <button
          onClick={onStepForward}
          disabled={disabled || isAtEnd}
          title="Step forward one transition"
          className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          onClick={onRunToComplete}
          disabled={disabled || isAtEnd}
          title="Execute all remaining steps instantly"
          className="px-3 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Skip to End</span>
        </button>
      </div>

      {/* Step counter and progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-xs font-mono text-slate-400">
            Step <span className="text-cyan-400 font-semibold">{totalSteps > 0 ? currentStep + 1 : 0}</span> / {totalSteps}
          </span>
          <div className="w-28 h-1.5 bg-dark-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-cyan-400 transition-all duration-200"
              style={{ width: `${totalSteps > 1 ? ((currentStep + 1) / totalSteps) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 pl-3 border-l border-dark-750">
          <span className="text-xs text-slate-400 font-mono">Speed:</span>
          <select
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="bg-dark-800 border border-dark-700 rounded-md px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value={1500}>0.5x</option>
            <option value={800}>1.0x</option>
            <option value={400}>2.0x</option>
            <option value={150}>4.0x</option>
          </select>
        </div>
      </div>
    </div>
  );
};
