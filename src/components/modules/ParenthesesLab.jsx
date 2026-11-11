import React, { useState, useEffect, useMemo } from 'react';
import { ParenthesesPDA, PARENTHESES_FORMAL_SPEC } from '../../core/automata/ParenthesesPDA.js';
import { ParenthesesCFG } from '../../core/parsers/ParenthesesCFG.js';
import { PARENTHESES_TEST_CASES } from '../../testcases/parenthesesTestCases.js';
import { StackVisualizer } from '../visualizers/StackVisualizer.jsx';
import { StateDiagram } from '../visualizers/StateDiagram.jsx';
import { TransitionTable } from '../visualizers/TransitionTable.jsx';
import { HistoryLog } from '../visualizers/HistoryLog.jsx';
import { ParseTreeVisualizer } from '../visualizers/ParseTreeVisualizer.jsx';
import { DerivationViewer } from '../visualizers/DerivationViewer.jsx';
import { Controls } from '../common/Controls.jsx';
import { TestCaseSelector } from '../common/TestCaseSelector.jsx';
import { GrammarCard } from '../common/GrammarCard.jsx';
import { CheckCircle2, XCircle, Code, ShieldCheck } from 'lucide-react';

export const ParenthesesLab = () => {
  const [input, setInput] = useState('(()())');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [viewTab, setViewTab] = useState('automata'); // 'automata' | 'cfg'

  const pda = useMemo(() => new ParenthesesPDA(), []);

  // Run PDA execution
  const pdaResult = useMemo(() => {
    return pda.run(input);
  }, [pda, input]);

  // Run CFG parse
  const cfgResult = useMemo(() => {
    return ParenthesesCFG.parse(input);
  }, [input]);

  const history = pdaResult.history || [];
  const currentHistoryStep = history[currentStepIndex] || history[history.length - 1] || null;

  // Auto-play timer
  useEffect(() => {
    let timer = null;
    if (isPlaying && currentStepIndex < history.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, speed);
    } else if (currentStepIndex >= history.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, history.length, speed]);

  const handleSelectCase = (testInput) => {
    setInput(testInput);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStepIndex < history.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleRunToComplete = () => {
    setCurrentStepIndex(Math.max(0, history.length - 1));
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-dark-900 border border-dark-750/70 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase tracking-wider">
                Case Study 2
              </span>
              <span className="text-xs text-slate-400 font-mono">Deterministic PDA (DPDA)</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Balanced Parentheses Checking
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Implements a Deterministic Pushdown Automaton for language L = {"{ w ∈ {(,)}* | w is balanced }"}. Pushes on '(', pops on ')', and accepts if input is consumed and stack returns to initial marker Z₀.
            </p>
          </div>

          {/* Validation Status Pill */}
          <div
            className={`px-4 py-3 rounded-xl border flex items-center gap-3 self-start md:self-auto ${
              pdaResult.accepted
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-rose-950/60 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-500/10'
            }`}
          >
            {pdaResult.accepted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="text-xs uppercase font-bold tracking-wider">
                {pdaResult.accepted ? 'Balanced (Accepted)' : 'Rejected (Imbalance)'}
              </div>
              <div className="text-xs font-mono text-slate-300 max-w-xs truncate">
                {pdaResult.reason || (pdaResult.accepted ? 'All parentheses matched' : 'Unmatched delimiter')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Editor & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-dark-900 border border-dark-750/70 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between mb-2">
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                Parentheses String Input
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-normal">
                Alphabet: Σ = &#123; '(', ')' &#125;
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
                placeholder="Enter parentheses string e.g. (()()) or (()(()))"
                className="w-full bg-dark-950 border border-dark-700 rounded-lg px-4 py-3 font-mono text-lg text-cyan-300 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner tracking-widest"
              />
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="mt-4">
            <Controls
              currentStep={currentStepIndex}
              totalSteps={history.length}
              isPlaying={isPlaying}
              speed={speed}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onStepForward={handleStepForward}
              onStepBack={handleStepBack}
              onReset={handleReset}
              onSpeedChange={setSpeed}
              onRunToComplete={handleRunToComplete}
              disabled={history.length === 0}
            />
          </div>
        </div>

        {/* Test Case Selector */}
        <div className="lg:col-span-1">
          <TestCaseSelector
            testCases={PARENTHESES_TEST_CASES}
            activeInput={input}
            onSelectCase={handleSelectCase}
          />
        </div>
      </div>

      {/* View Toggle Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-800 pb-2">
        <button
          onClick={() => setViewTab('automata')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
            viewTab === 'automata'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
          }`}
        >
          Pushdown Automata Simulator (DPDA)
        </button>
        <button
          onClick={() => setViewTab('cfg')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
            viewTab === 'cfg'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
          }`}
        >
          CFG Grammar &amp; Derivations (S → (S)S | ε)
        </button>
      </div>

      {/* Main View Area */}
      {viewTab === 'automata' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stack Visualizer */}
            <div className="lg:col-span-1">
              <StackVisualizer
                stack={currentHistoryStep?.stackSnapshot || ['Z0']}
                lastOperation={currentHistoryStep?.operation || 'INITIALIZE'}
                stackTop={currentHistoryStep?.stackTop || 'Z0'}
              />
            </div>

            {/* State Diagram */}
            <div className="lg:col-span-2">
              <StateDiagram
                title="DPDA State Transition Diagram"
                layoutType="parentheses"
                currentState={currentHistoryStep?.state || 'q0'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transition Table */}
            <TransitionTable
              transitions={PARENTHESES_FORMAL_SPEC.transitions}
              activeRuleFormula={currentHistoryStep?.ruleDescription || ''}
              title="Parentheses DPDA Transition Rules"
            />

            {/* History Log */}
            <HistoryLog
              history={history}
              currentStep={currentStepIndex}
              onSelectStep={(idx) => {
                setCurrentStepIndex(idx);
                setIsPlaying(false);
              }}
            />
          </div>
        </div>
      )}

      {viewTab === 'cfg' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ParseTreeVisualizer
              tree={cfgResult.tree}
              title={`Parentheses Parse Tree: "${input === '' ? 'ε' : input}"`}
            />
            <DerivationViewer
              leftmost={cfgResult.leftmostDerivation}
              rightmost={cfgResult.rightmostDerivation}
              title="Derivation Steps: S ⇒ (S)S ⇒ ..."
            />
          </div>

          <div className="lg:col-span-1">
            <GrammarCard
              name="Dyck Language (Balanced Parentheses) CFG"
              variables={['S']}
              terminals={['(', ')']}
              startSymbol="S"
              productions={[
                'S → ( S ) S',
                'S → ε'
              ]}
              notes="This grammar generates the Dyck Language D_1. It is unambiguous and deterministically parsable by an LL(1) parser as well as our DPDA."
            />
          </div>
        </div>
      )}
    </div>
  );
};
